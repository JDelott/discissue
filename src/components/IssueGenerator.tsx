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
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-8 sm:px-10 lg:px-12 py-16 sm:py-20">
        <div className="pl-8 sm:pl-10">
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-sans font-bold">
                  Generate GitHub Issue
                </h1>
                <p className="mt-4 text-gray-800">
                  Paste your Discord conversation below to generate a structured GitHub issue.
                </p>
              </div>

              <div>
                <label htmlFor="githubRepo" className="block text-sm font-medium text-gray-800">
                  GitHub Repository URL
                </label>
                <input
                  type="text"
                  id="githubRepo"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  className="mt-2 block w-full border-2 border-black focus:ring-0 focus:border-black"
                  placeholder="https://github.com/owner/repo"
                />
              </div>

              <div>
                <label htmlFor="discordContent" className="block text-sm font-medium text-gray-800">
                  Discord Conversation
                </label>
                <textarea
                  id="discordContent"
                  value={discordContent}
                  onChange={(e) => setDiscordContent(e.target.value)}
                  rows={8}
                  className="mt-2 block w-full border-2 border-black focus:ring-0 focus:border-black"
                  placeholder="Paste your Discord conversation here..."
                />
              </div>

              {error && (
                <div className="border-2 border-black p-4">
                  <p className="text-black">{error}</p>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-6 py-3 border-2 border-black text-base font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Processing...' : 'Generate Issue'}
                </button>
              </div>
            </div>
          </form>

          {generatedIssue && (
            <div className="mt-16 border-t-2 border-black pt-10">
              <h2 className="text-2xl font-bold text-black mb-8">Generated GitHub Issue</h2>
              
              {isAuthenticated && (
                <div className="mb-8">
                  <RepoSelector onRepoSelect={handleRepoSelect} />
                </div>
              )}
              
              <div className="space-y-8">
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
                
                <div className="pt-6 flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (isEditing) {
                        setGeneratedIssue({
                          ...generatedIssue,
                          title: editedTitle,
                          body: editedBody,
                          labels: editedLabels
                        });
                      }
                      setIsEditing(!isEditing);
                    }}
                    className="inline-flex items-center px-6 py-3 border-2 border-black text-base font-medium text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
                  >
                    {isEditing ? 'Save Changes' : 'Edit Issue'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `# ${isEditing ? editedTitle : generatedIssue.title}\n\n${isEditing ? editedBody : generatedIssue.body}`
                      );
                    }}
                    className="inline-flex items-center px-6 py-3 border-2 border-black text-base font-medium text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
                  >
                    Copy to Clipboard
                  </button>

                  {isAuthenticated ? (
                    <button
                      type="button"
                      onClick={createGitHubIssue}
                      disabled={isCreatingIssue || issueCreated || (!selectedRepo && !githubRepo)}
                      className="inline-flex items-center px-6 py-3 border-2 border-black text-base font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isCreatingIssue ? 'Creating...' : issueCreated ? 'Issue Created' : 'Create GitHub Issue'}
                    </button>
                  ) : (
                    <div className="inline-flex items-center px-6 py-3 border-2 border-black text-base font-medium text-gray-600">
                      Sign in to create issues
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setGeneratedIssue(null);
                      setEditedTitle('');
                      setEditedBody('');
                      setEditedLabels([]);
                      setIsEditing(false);
                      setIssueCreated(false);
                      setIssueUrl('');
                      setError('');
                    }}
                    className="inline-flex items-center px-6 py-3 border-2 border-black text-base font-medium text-black hover:text-white hover:bg-red-600 hover:border-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
                
                {issueCreated && issueUrl && (
                  <div className="mt-6 p-6 border-2 border-black">
                    <p className="text-black mb-4">
                      Issue successfully created on GitHub!
                    </p>
                    <a 
                      href={issueUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-black hover:underline"
                    >
                      View issue on GitHub →
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
