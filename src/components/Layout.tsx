import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import GitHubAuth, { UserData } from './GitHubAuth';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        console.log('Checking auth status...');
        
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/status`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        console.log('Auth status response:', response.status, response.statusText);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Auth data received:', data);
          
          setIsAuthenticated(data.authenticated);
          if (data.authenticated && data.user) {
            setUserData(data.user);
            console.log('User is authenticated:', data.user);
          } else {
            console.log('User is not authenticated');
          }
        } else {
          console.error('Failed to check auth status:', response.status);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleAuthChange = (isAuthenticated: boolean, userData?: UserData) => {
    setIsAuthenticated(isAuthenticated);
    setUserData(userData || null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link to="/" className="font-display text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                DiscIssue
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
                Home
              </Link>
              <Link to="/generate" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
                Generate Issue
              </Link>
            </nav>
            <div>
              {isLoading ? (
                <span className="text-gray-600 dark:text-gray-300">Loading...</span>
              ) : isAuthenticated && userData ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600 dark:text-gray-300">{userData.login}</span>
                  {userData.avatar_url && (
                    <img 
                      src={userData.avatar_url} 
                      alt={`${userData.login}'s avatar`} 
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <button 
                    onClick={async () => {
                      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/logout`, {
                        method: 'POST',
                        credentials: 'include'
                      });
                      setIsAuthenticated(false);
                      setUserData(null);
                    }}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <GitHubAuth onAuthChange={handleAuthChange} />
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        {children}
      </main>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="font-display text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                DiscIssue
              </span>
            </div>
            <p className="text-gray-400">© 2023 DiscIssue. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
