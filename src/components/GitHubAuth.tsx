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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log('Checking auth status...');
        const response = await fetch(`${API_URL}/api/auth/status`, {
          credentials: 'include',
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
          setError(`Authentication failed: ${response.statusText}`);
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
    setIsLoading(true);
    // Redirect to the GitHub auth endpoint
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/github`;
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
      setError(error instanceof Error ? error.message : 'Error logging out');
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {isLoading ? (
        <div className="text-sm">Loading...</div>
      ) : (
        <>
          {error && (
            <div className="text-red-500 text-sm mr-4">
              {error}
            </div>
          )}
          {isAuthenticated && userData ? (
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              {isLoading ? 'Connecting...' : (
                <>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span>Login with GitHub</span>
                </>
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
}
