import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Octokit } from '@octokit/rest';
import axios from 'axios';

// Define types for Anthropic SDK since type declarations are missing
interface AnthropicMessage {
  role: string;
  content: string;
}

interface AnthropicContentItem {
  type: string;
  text: string;
}

interface AnthropicResponse {
  content: AnthropicContentItem[];
}

// Simple Anthropic client interface
class Anthropic {
  private apiKey: string;
  
  constructor(options: { apiKey: string }) {
    this.apiKey = options.apiKey;
  }
  
  messages = {
    create: async (params: {
      model: string;
      max_tokens: number;
      messages: AnthropicMessage[];
    }): Promise<AnthropicResponse> => {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify(params)
      });
      
      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.status}`);
      }
      
      return response.json();
    }
  };
}

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Initialize PostgreSQL client
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/discissue',
});

// Define our custom user type
interface GitHubUser {
  id: number;
  github_id: string;
  username: string;
  avatar_url: string;
  access_token: string;
}

// Extend Express Request to include user
// Using module augmentation for Express types
declare module 'express-serve-static-core' {
  type User = GitHubUser;
}

// Configure CORS
app.use(cors({
  origin: true, // Allow all origins for testing
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'temporary_development_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Define our custom session data with a more specific type
declare module 'express-session' {
  interface SessionData {
    accessToken?: string;
    user?: {
      id: number;
      login: string;
      avatar_url: string;
      name?: string | null;
      email?: string | null;
      // Use a more specific index signature to avoid eslint warnings
      [key: string]: string | number | boolean | null | undefined;
    };
    authenticated?: boolean;
  }
}

// GitHub OAuth configuration
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    callbackURL: `${process.env.APP_URL || 'http://localhost:3001'}/api/auth/github/callback`,
    scope: ['user:email', 'repo'] // Request repo scope to create issues
  },
  async (accessToken: string, _refreshToken: string, profile: { id: string; username: string; _json: { avatar_url: string } }, done: (error: Error | null, user?: GitHubUser | false) => void) => {
    try {
      // Store user in database
      const result = await pool.query(
        'INSERT INTO users (github_id, username, avatar_url, access_token) VALUES ($1, $2, $3, $4) ON CONFLICT (github_id) DO UPDATE SET username = $2, avatar_url = $3, access_token = $4 RETURNING *',
        [profile.id, profile.username, profile._json.avatar_url, accessToken]
      );
      
      const user = result.rows[0];
      return done(null, {
        id: user.id,
        github_id: user.github_id,
        username: user.username,
        avatar_url: user.avatar_url,
        access_token: accessToken
      });
    } catch (error) {
      return done(error as Error);
    }
  }
));

// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, (user as GitHubUser).id);
});

// Deserialize user from session
passport.deserializeUser(async (id: number, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return done(null, false);
    }
    
    const user = result.rows[0];
    done(null, {
      id: user.id,
      github_id: user.github_id,
      username: user.username,
      avatar_url: user.avatar_url,
      access_token: user.access_token
    });
  } catch (error) {
    done(error as Error);
  }
});

// API endpoint to generate issues
app.post('/api/generate-issue', async (req: express.Request, res: express.Response) => {
  try {
    const { githubRepo, discordContent } = req.body;
    
    // Call Anthropic API
    console.log('Calling Anthropic API...');
    const message = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `Convert this Discord conversation into a structured GitHub issue. 
          Format the issue with a clear title, description, and suggest appropriate labels.
          
          GitHub Repository: ${githubRepo}
          
          Discord Conversation:
          ${discordContent}
          
          Please return a JSON object with the following structure:
          {
            "title": "Issue title",
            "body": "Formatted issue body with markdown",
            "labels": ["label1", "label2"]
          }`
        }
      ]
    });
    
    // Parse the response
    const responseContent = message.content[0].type === 'text' 
      ? message.content[0].text 
      : JSON.stringify(message.content[0]);
      
    const jsonMatch = responseContent.match(/```json\n([\s\S]*?)\n```/) || 
                      responseContent.match(/{[\s\S]*?}/);
                      
    let issueData;
    if (jsonMatch) {
      issueData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
    } else {
      issueData = {
        title: "Issue from Discord conversation",
        body: responseContent,
        labels: ["needs-triage"]
      };
    }
    
    // Save to database
    console.log('Saving to database...');
    const query = `
      INSERT INTO issues (github_repo, discord_content, title, body, labels)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      githubRepo,
      discordContent,
      issueData.title,
      issueData.body,
      issueData.labels
    ]);
    
    const savedIssue = result.rows[0];
    
    // Return the generated issue
    res.json({
      id: savedIssue.id,
      title: savedIssue.title,
      body: savedIssue.body,
      labels: savedIssue.labels
    });
  } catch (error) {
    console.error('Error generating issue:', error);
    res.status(500).json({ error: 'Failed to generate issue' });
  }
});

// API endpoint to get all issues
app.get('/api/issues', async (_req: express.Request, res: express.Response) => {
  try {
    const result = await pool.query('SELECT * FROM issues ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
});

// GitHub OAuth routes
app.get('/api/auth/github', passport.authenticate('github'));

// GitHub OAuth callback route
app.get('/api/auth/github/callback', async (req, res) => {
  try {
    console.log('Received GitHub callback:', req.query);
    
    const { code } = req.query;
    
    if (!code) {
      console.error('No code received from GitHub');
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/error?message=No code received`);
    }
    
    console.log('Exchanging code for token...');
    
    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code
      },
      {
        headers: {
          Accept: 'application/json'
        }
      }
    );
    
    console.log('Token response received');
    
    const accessToken = tokenResponse.data.access_token;
    
    if (!accessToken) {
      console.error('Failed to get access token');
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/error?message=Failed to get token`);
    }
    
    // Get user data with the access token
    const octokit = new Octokit({
      auth: accessToken
    });
    
    const { data: userData } = await octokit.users.getAuthenticated();
    console.log('User authenticated:', userData.login);
    
    // Store user data and token in session
    if (req.session) {
      req.session.accessToken = accessToken;
      req.session.user = {
        id: userData.id,
        login: userData.login,
        avatar_url: userData.avatar_url,
        name: userData.name || undefined,
        email: userData.email || undefined,
        html_url: userData.html_url
      };
      req.session.authenticated = true;
      
      // Save the session before redirecting
      req.session.save((err) => {
        if (err) {
          console.error('Error saving session:', err);
        }
        
        console.log('Session saved, redirecting to frontend');
        // Make sure to use the correct frontend URL
        res.redirect(process.env.FRONTEND_URL || 'http://localhost:3000');
      });
    } else {
      console.error('No session available');
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/error?message=No session available`);
    }
  } catch (error) {
    console.error('Error in GitHub callback:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/error?message=Authentication failed`);
  }
});

// Check authentication status
app.get('/api/auth/status', (req, res) => {
  if (req.session && req.session.authenticated && req.session.user) {
    res.json({
      authenticated: true,
      user: {
        id: req.session.user.id,
        login: req.session.user.login,
        name: req.session.user.name,
        avatar_url: req.session.user.avatar_url,
        html_url: req.session.user.html_url
      }
    });
  } else {
    res.json({ authenticated: false });
  }
});

// Logout route
app.post('/api/auth/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ error: 'Failed to logout' });
      }
      res.json({ success: true });
    });
  } else {
    res.json({ success: true });
  }
});

// Create GitHub issue
app.post('/api/create-github-issue', (async (req: express.Request, res: express.Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const { repo, title, body, labels } = req.body;
    
    // Extract owner and repo name from the repository URL
    const repoUrlPattern = /github\.com\/([^/]+)\/([^/]+)/;
    const repoMatch = repo.match(repoUrlPattern);
    
    if (!repoMatch) {
      return res.status(400).json({ error: 'Invalid GitHub repository URL' });
    }
    
    const [, owner, repoName] = repoMatch;
    
    // Create Octokit instance with user's access token
    const octokit = new Octokit({
      auth: (req.user as GitHubUser).access_token
    });
    
    // Create the issue on GitHub
    const response = await octokit.rest.issues.create({
      owner,
      repo: repoName,
      title,
      body,
      labels
    });
    
    // Update the issue in the database with the GitHub issue number
    await pool.query(
      'UPDATE issues SET github_issue_number = $1, github_issue_url = $2 WHERE title = $3 AND github_repo = $4',
      [response.data.number, response.data.html_url, title, repo]
    );
    
    res.json({
      success: true,
      issue_number: response.data.number,
      html_url: response.data.html_url
    });
  } catch (error) {
    console.error('Error creating GitHub issue:', error);
    
    // Handle different error types with proper type checking
    if (typeof error === 'object' && error !== null && 'status' in error) {
      const httpError = error as { status: number };
      if (httpError.status === 404) {
        return res.status(404).json({ error: 'Repository not found or you don\'t have access to it' });
      } else if (httpError.status === 403) {
        return res.status(403).json({ error: 'You don\'t have permission to create issues in this repository' });
      }
    }
    
    res.status(500).json({ error: 'Failed to create GitHub issue' });
  }
}) as express.RequestHandler);

// Add this near your other API endpoints
app.get('/api/test', (_req, res) => {
  res.json({ message: 'Server is working!' });
});

// In production, serve the static files from the build directory
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../dist')));
  
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });
}

// Add this near the top of your Express setup
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Add a simple test endpoint
app.get('/api/ping', (_req, res) => {
  res.json({ message: 'pong' });
});

// Update the issues/create endpoint with proper types
app.post('/api/issues/create', (async (req, res) => {
  try {
    console.log('Received issue creation request');
    
    // Check if user is authenticated
    if (!req.session?.authenticated || !req.session?.accessToken) {
      console.log('User not authenticated');
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    console.log('User authenticated, session:', {
      authenticated: req.session.authenticated,
      hasToken: !!req.session.accessToken,
      user: req.session.user ? {
        login: req.session.user.login,
        id: req.session.user.id
      } : 'No user in session'
    });
    
    const { title, body, repo } = req.body;
    
    console.log('Request body:', { 
      title: title ? `${title.substring(0, 30)}...` : 'missing', 
      bodyLength: body ? body.length : 0,
      repo 
    });
    
    if (!title || !body) {
      console.log('Missing title or body');
      return res.status(400).json({ message: 'Title and body are required' });
    }
    
    if (!repo || typeof repo !== 'string' || !repo.includes('/')) {
      console.log('Invalid repository format:', repo);
      return res.status(400).json({ message: 'Invalid repository format. Use owner/repo' });
    }
    
    // Use the user's access token to create the issue
    const octokit = new Octokit({
      auth: req.session.accessToken
    });
    
    // Split the repository into owner and repo name
    const [owner, repoName] = repo.split('/');
    
    if (!owner || !repoName) {
      console.log('Invalid repository parts:', { owner, repoName });
      return res.status(400).json({ message: 'Invalid repository format. Use owner/repo' });
    }
    
    console.log(`Creating issue in ${owner}/${repoName}`);
    
    try {
      // Create the issue
      const { data: issue } = await octokit.issues.create({
        owner,
        repo: repoName,
        title,
        body
      });
      
      console.log(`Issue created: ${issue.html_url}`);
      
      // Return the created issue data
      return res.json({
        id: issue.id,
        number: issue.number,
        html_url: issue.html_url,
        title: issue.title
      });
    } catch (apiError: unknown) {
      console.error('GitHub API error:', apiError instanceof Error ? apiError.message : apiError);
      
      // Type guard for Octokit error
      if (apiError && typeof apiError === 'object' && 'response' in apiError) {
        const octokitError = apiError as { 
          response?: { 
            status?: number; 
            data?: Record<string, unknown> 
          } 
        };
        
        if (octokitError.response) {
          console.error('API response:', {
            status: octokitError.response.status,
            data: octokitError.response.data
          });
        }
      }
      
      throw apiError;
    }
  } catch (error: unknown) {
    console.error('Error creating issue:', error);
    
    // Handle specific GitHub API errors
    if (error && typeof error === 'object' && 'response' in error) {
      const httpError = error as { 
        response?: { 
          status?: number; 
          data?: Record<string, unknown> 
        } 
      };
      
      if (httpError.response?.status === 404) {
        return res.status(404).json({ message: 'Repository not found or you don\'t have access' });
      }
      
      if (httpError.response?.status === 403) {
        return res.status(403).json({ message: 'You don\'t have permission to create issues in this repository' });
      }
      
      if (httpError.response?.data) {
        return res.status(httpError.response.status || 500).json({ 
          message: 'GitHub API error',
          details: httpError.response.data
        });
      }
    }
    
    res.status(500).json({ 
      message: 'Failed to create issue',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}) as express.RequestHandler);

// Fix the repos endpoint
app.get('/api/repos', (async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.session?.authenticated || !req.session?.accessToken) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Use the user's access token to fetch repositories
    const octokit = new Octokit({
      auth: req.session.accessToken
    });
    
    // Fetch repositories the user has access to
    const { data: repos } = await octokit.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 100
    });
    
    // Return simplified repo data
    res.json(repos.map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      private: repo.private
    })));
  } catch (error: unknown) {
    console.error('Error fetching repositories:', error);
    res.status(500).json({ 
      message: 'Failed to fetch repositories',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}) as express.RequestHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
