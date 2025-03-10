import { useState } from 'react';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!githubRepo || !discordContent) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
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
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to generate issue. Please try again.');
    } finally {
      setIsLoading(false);
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
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Title</h3>
                  <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">{generatedIssue.title}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Labels</h3>
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
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Body</h3>
                  <div className="mt-1 prose dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto">
                      {generatedIssue.body}
                    </pre>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `# ${generatedIssue.title}\n\n${generatedIssue.body}`
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
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
