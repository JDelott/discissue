import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="pt-16 pb-24 sm:pt-24 sm:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-gray-900 dark:text-white">
              <span className="block">Convert Discord -&gt;</span>
              <span className="block mt-2 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"> GitHub Issues</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              Transform your Discord discussions into organized GitHub issues automatically with AI-powered analysis and categorization.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/generate"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-md text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all transform hover:scale-105"
              >
                Try It Now
              </Link>
              <a 
                href="https://github.com" 
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
              Powerful Features
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              Everything you need to streamline your workflow from Discord to GitHub
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 shadow-soft">
              <div className="h-12 w-12 rounded-md bg-primary-600 text-white flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">AI-Powered</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Smart conversion of conversations into structured issues with intelligent categorization and labeling.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 shadow-soft">
              <div className="h-12 w-12 rounded-md bg-secondary-600 text-white flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Customizable</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Tailor the issue format to match your team's workflow with customizable templates and settings.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 shadow-soft">
              <div className="h-12 w-12 rounded-md bg-gradient-to-r from-primary-600 to-secondary-600 text-white flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Seamless Integration</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Works directly with your existing GitHub repositories and Discord servers without complex setup.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
              How It Works
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              Three simple steps to convert Discord conversations into GitHub issues
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="absolute top-0 left-0 -ml-4 mt-2 flex items-center justify-center h-8 w-8 rounded-full bg-primary-600 text-white font-bold text-lg">
                1
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-soft h-full">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 mt-2">Copy Discord Content</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Select and copy the relevant conversation from your Discord channel that you want to convert into an issue.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-0 left-0 -ml-4 mt-2 flex items-center justify-center h-8 w-8 rounded-full bg-primary-600 text-white font-bold text-lg">
                2
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-soft h-full">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 mt-2">Paste & Process</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Paste the conversation into DiscIssue and provide your GitHub repository details. Our AI will analyze the content.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-0 left-0 -ml-4 mt-2 flex items-center justify-center h-8 w-8 rounded-full bg-primary-600 text-white font-bold text-lg">
                3
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-soft h-full">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 mt-2">Create GitHub Issue</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Review the generated issue with AI-suggested title, description, and labels, then create it in your GitHub repository.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-display font-bold text-white">
            Ready to streamline your workflow?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-primary-100">
            Join the waitlist to be notified when DiscIssue launches.
          </p>
          <div className="mt-8">
            <Link
              to="/generate"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-md text-primary-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-600 focus:ring-white transition-colors"
            >
              Try It Now
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
              About DiscIssue
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              Built by developers, for developers
            </p>
          </div>

          <div className="mt-16 bg-gray-50 dark:bg-gray-700 rounded-xl p-8 shadow-soft">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              DiscIssue was born out of the frustration of manually converting Discord discussions into GitHub issues. We wanted to create a tool that would make this process seamless and efficient.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our mission is to help development teams bridge the gap between communication platforms and project management tools, saving time and reducing the friction in the development process.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              We're constantly improving DiscIssue based on user feedback and adding new features to make it even more powerful and user-friendly.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
