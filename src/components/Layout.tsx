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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-white border-b border-black sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex-shrink-0">
              <Link to="/" className="font-sans text-xl sm:text-2xl font-bold text-black">
                IssueMakerAI
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-black hover:text-gray-700 font-medium transition-colors">
                Home
              </Link>
              <Link to="/generate" className="text-black hover:text-gray-700 font-medium transition-colors">
                Generate Issue
              </Link>
            </nav>
            
            {/* Desktop Auth */}
            <div className="hidden md:block">
              {isLoading ? (
                <span className="text-black">Loading...</span>
              ) : isAuthenticated && userData ? (
                <div className="flex items-center space-x-4">
                  <span className="text-black">{userData.login}</span>
                  {userData.avatar_url && (
                    <img 
                      src={userData.avatar_url} 
                      alt={`${userData.login}'s avatar`} 
                      className="w-8 h-8 rounded-none border border-black"
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
                    className="text-black hover:text-gray-700 text-sm font-medium border-b border-black"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <GitHubAuth onAuthChange={handleAuthChange} />
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 text-black hover:text-gray-700 focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <span className="block h-6 w-6 text-center font-bold text-xl">×</span>
                ) : (
                  <span className="block h-6 w-6 text-center font-bold text-xl">≡</span>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu, show/hide based on menu state */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-black">
            <div className="px-4 pt-2 pb-3 space-y-1 sm:px-6">
              <Link 
                to="/" 
                className="block py-2 text-black hover:text-gray-700 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/generate" 
                className="block py-2 text-black hover:text-gray-700 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Generate Issue
              </Link>
            </div>
            <div className="px-4 py-4 border-t border-black sm:px-6">
              {isLoading ? (
                <span className="text-black">Loading...</span>
              ) : isAuthenticated && userData ? (
                <div className="flex items-center space-x-4">
                  <span className="text-black">{userData.login}</span>
                  {userData.avatar_url && (
                    <img 
                      src={userData.avatar_url} 
                      alt={`${userData.login}'s avatar`} 
                      className="w-8 h-8 rounded-none border border-black"
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
                      setMobileMenuOpen(false);
                    }}
                    className="text-black hover:text-gray-700 text-sm font-medium border-b border-black"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <GitHubAuth onAuthChange={(isAuth, userData) => {
                  handleAuthChange(isAuth, userData);
                  setMobileMenuOpen(false);
                }} />
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <span className="font-sans text-xl sm:text-2xl font-bold text-white">
                IssueMakerAI
              </span>
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8 text-center sm:text-left">
              <Link to="/" className="text-white hover:text-gray-300 transition-colors">
                Home
              </Link>
              <Link to="/generate" className="text-white hover:text-gray-300 transition-colors">
                Generate Issue
              </Link>
              <a href="https://github.com" className="text-white hover:text-gray-300 transition-colors">
                GitHub
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center md:text-left">
            <p className="text-gray-400">© 2023 IssueMakerAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
