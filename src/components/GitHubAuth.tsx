import { useState, useEffect } from 'react';

// Get the API URL from environment variables or use a default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

export interface UserData {
  id: number;
  login: string;
  name?: string;
  avatar_url: string;
  html_url?: string;
}

interface GitHubAuthProps {
  onAuthChange: (isAuthenticated: boolean, userData?: UserData) => void;
}

export default function GitHubAuth({ onAuthChange }: GitHubAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log('Checking auth status...');
        const response = await fetch(`${API_URL}/api/auth/status`, {
          credentials: 'include', // Important: include cookies for session
        });
        
        console.log('Auth status response:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Auth data:', data);
          
          if (data.authenticated && data.user) {
            setIsAuthenticated(true);
            setUserData(data.user);
            onAuthChange(true, data.user);
          } else {
            setIsAuthenticated(false);
            onAuthChange(false);
          }
        } else {
          console.error('Auth status check failed:', response.statusText);
          setIsAuthenticated(false);
          onAuthChange(false);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
        setIsAuthenticated(false);
        onAuthChange(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [onAuthChange]);

  const handleLogin = () => {
    window.location.href = `${API_URL}/api/auth/github`;
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      setIsAuthenticated(false);
      setUserData(null);
      onAuthChange(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="flex flex-col items-start space-y-4">
      {error && (
        <div className="text-sm text-red-600 dark:text-red-400">
          Error: {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex items-center justify-center py-4">Loading...</div>
      ) : (
        <div className="flex items-center space-x-4">
          {isAuthenticated && userData ? (
            <div className="flex items-center space-x-3">
              {userData.avatar_url && (
                <img 
                  src={userData.avatar_url} 
                  alt={`${userData.login}'s avatar`} 
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {userData.login}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
              </svg>
              Sign in with GitHub
            </button>
          )}
        </div>
      )}
    </div>
  );
}
