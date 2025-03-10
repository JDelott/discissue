import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Anthropic } from '@anthropic-ai/sdk';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Initialize PostgreSQL client
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/discissue',
});

// Middleware
app.use(cors());
app.use(express.json());

// API endpoint to generate issues
app.post('/api/generate-issue', async (req, res) => {
  try {
    const { githubRepo, discordContent, createOnGitHub = false } = req.body;
    
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
    
    console.log('Issue saved to database with ID:', result.rows[0].id);
    
    res.json({
      ...issueData,
      id: result.rows[0].id
    });
  } catch (error) {
    console.error('Error generating issue:', error);
    res.status(500).json({ error: 'Failed to generate issue' });
  }
});

// API endpoint to get all issues
app.get('/api/issues', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM issues ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
});

// In production, serve the static files from the build directory
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
