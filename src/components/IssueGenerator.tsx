import { useState, useEffect } from 'react';
import RepoSelector from './RepoSelector';

// Get the API URL from environment variables or use a default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function IssueGenerator() {
  const [githubRepo, setGithubRepo] = useState('');
  const [discordContent, setDiscordContent] = useState('');
  const [generatedIssue, setGeneratedIssue] = useState<null | {
    title: string;
    body: string;
    labels: string[];
    id: number;
  }>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCreatingIssue, setIsCreatingIssue] = useState(false);
  const [issueCreated, setIssueCreated] = useState(false);
  const [issueUrl, setIssueUrl] = useState('');
  const [selectedRepo, setSelectedRepo] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedBody, setEditedBody] = useState('');
  const [editedLabels, setEditedLabels] = useState<string[]>([]);

  // Add this function to handle repository selection
  const handleRepoSelect = (repo: string) => {
    console.log('Repository selected in IssueGenerator:', repo);
    setSelectedRepo(repo);
  };

  // Check if user is authenticated
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/status`, {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(data.authenticated);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    };

    checkAuthStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!githubRepo || !discordContent) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setIssueCreated(false);
    setIssueUrl('');
    
    try {
      console.log('Submitting to:', `${API_URL}/api/generate-issue`);
      
      // Call the backend API
      const response = await fetch(`${API_URL}/api/generate-issue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          githubRepo,
          discordContent,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate issue');
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      setGeneratedIssue(data);
      setEditedTitle(data.title);
      setEditedBody(data.body);
      setEditedLabels(data.labels);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to generate issue. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const createGitHubIssue = async () => {
    if (!generatedIssue) {
      alert('Please generate issue content first');
      return;
    }
    
    console.log('Current selected repo:', selectedRepo);
    
    // Extract repository information from the githubRepo URL if it's provided
    let repoToUse = selectedRepo;
    
    if (!repoToUse && githubRepo) {
      try {
        // Parse the GitHub URL to extract owner/repo format
        const url = new URL(githubRepo);
        if (url.hostname === 'github.com') {
          const pathParts = url.pathname.split('/').filter(Boolean);
          if (pathParts.length >= 2) {
            repoToUse = `${pathParts[0]}/${pathParts[1]}`;
            console.log('Extracted repository from URL:', repoToUse);
          }
        }
      } catch (error) {
        console.error('Failed to parse GitHub URL:', error);
      }
    }
    
    if (!repoToUse) {
      alert('Please select a repository or enter a valid GitHub repository URL');
      return;
    }
    
    try {
      setIsCreatingIssue(true);
      setError('');
      
      console.log('Creating issue in repository:', repoToUse);
      console.log('Issue title:', generatedIssue.title);
      console.log('Issue body length:', generatedIssue.body.length);
      
      const response = await fetch(`${API_URL}/api/issues/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for sending cookies
        body: JSON.stringify({
          title: isEditing ? editedTitle : generatedIssue.title,
          body: isEditing ? editedBody : generatedIssue.body,
          labels: isEditing ? editedLabels : generatedIssue.labels,
          repo: repoToUse
        }),
      });
      
      console.log('Response status:', response.status);
      
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        throw new Error('Server returned invalid JSON');
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create issue');
      }
      
      console.log('Issue created successfully:', data);
      
      // Show success message and link to the created issue
      setIssueCreated(true);
      setIssueUrl(data.html_url);
      
      // Optionally, redirect to the created issue
      window.open(data.html_url, '_blank');
    } catch (error) {
      console.error('Error creating GitHub issue:', error);
      setError(`Error creating issue: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsCreatingIssue(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
            Generate GitHub Issues from Discord
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Paste your Discord conversation and GitHub repository details to automatically generate a structured GitHub issue.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-soft rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="github-repo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                GitHub Repository URL
              </label>
              <input
                type="text"
                id="github-repo"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="https://github.com/username/repository"
                value={githubRepo}
                onChange={(e) => setGithubRepo(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="discord-content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Discord Conversation
              </label>
              <textarea
                id="discord-content"
                rows={8}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="Paste your Discord conversation here..."
                value={discordContent}
                onChange={(e) => setDiscordContent(e.target.value)}
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4">
                <div className="flex">
                  <div className="text-sm text-red-700 dark:text-red-400">
                    {error}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Generate Issue'
                )}
              </button>
            </div>
          </form>

          {generatedIssue && (
            <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-10">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Generated GitHub Issue</h2>
              
              {isAuthenticated && (
                <div className="mb-4">
                  <RepoSelector onRepoSelect={handleRepoSelect} />
                </div>
              )}
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Title</h3>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  ) : (
                    <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">{generatedIssue.title}</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Labels</h3>
                  {isEditing ? (
                    <div className="mt-1">
                      <input
                        type="text"
                        value={editedLabels.join(', ')}
                        onChange={(e) => setEditedLabels(e.target.value.split(',').map(label => label.trim()))}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Enter labels separated by commas"
                      />
                      <p className="text-xs text-gray-500 mt-1">Separate labels with commas</p>
                    </div>
                  ) : (
                    <div className="mt-1 flex flex-wrap gap-2">
                      {generatedIssue.labels.map((label, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Body</h3>
                  <div className="mt-1 prose dark:prose-invert max-w-none">
                    {isEditing ? (
                      <textarea
                        value={editedBody}
                        onChange={(e) => setEditedBody(e.target.value)}
                        rows={12}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                      />
                    ) : (
                      <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto">
                        {generatedIssue.body}
                      </pre>
                    )}
                  </div>
                </div>
                
                <div className="pt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (isEditing) {
                        // When saving, update the generatedIssue with edited content
                        setGeneratedIssue({
                          ...generatedIssue,
                          title: editedTitle,
                          body: editedBody,
                          labels: editedLabels
                        });
                      }
                      // Toggle editing mode
                      setIsEditing(!isEditing);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      {isEditing ? (
                        <path d="M5 13l4 4L19 7l-2-2L9 13l-2-2-2 2z" />
                      ) : (
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      )}
                    </svg>
                    {isEditing ? 'Save Changes' : 'Edit Issue'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `# ${isEditing ? editedTitle : generatedIssue.title}\n\n${isEditing ? editedBody : generatedIssue.body}`
                      );
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                      <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                    </svg>
                    Copy to Clipboard
                  </button>
                  
                  {isAuthenticated ? (
                    <button
                      type="button"
                      onClick={createGitHubIssue}
                      disabled={isCreatingIssue || issueCreated || (!selectedRepo && !githubRepo)}
                      className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                        issueCreated 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-primary-600 hover:bg-primary-700'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isCreatingIssue ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating...
                        </>
                      ) : issueCreated ? (
                        <>
                          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Issue Created
                        </>
                      ) : (
                        <>
                          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                          </svg>
                          Create GitHub Issue
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="inline-flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-md">
                      <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      Sign in to create issues
                    </div>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => {
                      // Clear the generated issue and reset related states
                      setGeneratedIssue(null);
                      setEditedTitle('');
                      setEditedBody('');
                      setEditedLabels([]);
                      setIsEditing(false);
                      setIssueCreated(false);
                      setIssueUrl('');
                      setError('');
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5 text-red-500 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Delete
                  </button>
                </div>
                
                {issueCreated && issueUrl && (
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
                    <p className="text-green-800 dark:text-green-300 mb-2">
                      Issue successfully created on GitHub!
                    </p>
                    <a 
                      href={issueUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      View issue on GitHub
                      <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
