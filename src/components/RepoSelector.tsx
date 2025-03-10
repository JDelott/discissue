import { useState, useEffect } from 'react';

interface Repo {
  id: number;
  name: string;
  full_name: string;
}

interface RepoSelectorProps {
  onRepoSelect: (repo: string) => void;
}

export default function RepoSelector({ onRepoSelect }: RepoSelectorProps) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<string>('');
  
  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/repos`, {
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch repositories');
        }
        
        const data = await response.json();
        console.log('Fetched repositories:', data);
        setRepos(data);
        
        // Select the first repo by default if available
        if (data.length > 0) {
          setSelectedRepo(data[0].full_name);
          onRepoSelect(data[0].full_name);
        }
      } catch (error) {
        console.error('Error fetching repos:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRepos();
  }, [onRepoSelect]);
  
  const handleRepoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const repo = e.target.value;
    console.log('Selected repository:', repo);
    setSelectedRepo(repo);
    onRepoSelect(repo);
  };
  
  if (isLoading) {
    return <div>Loading repositories...</div>;
  }
  
  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }
  
  if (repos.length === 0) {
    return <div>No repositories found. Please create a repository on GitHub first.</div>;
  }
  
  return (
    <div className="mb-4">
      <label htmlFor="repo-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Select Repository
      </label>
      <select
        id="repo-select"
        value={selectedRepo}
        onChange={handleRepoChange}
        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:text-gray-200"
      >
        {repos.map((repo) => (
          <option key={repo.id} value={repo.full_name}>
            {repo.full_name}
          </option>
        ))}
      </select>
    </div>
  );
}
