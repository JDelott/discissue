import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="bg-white text-black">
      {/* Hero Section */}
      <section className="pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-20 sm:pb-24 md:pb-28 lg:pb-32">
        <div className="max-w-7xl mx-auto px-8 sm:px-10 lg:px-12">
          <div className="max-w-3xl pl-8 sm:pl-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-bold leading-none tracking-tight">
              <span className="block">Discord to</span>
              <span className="block mt-2">GitHub Issues</span>
            </h1>
            <p className="mt-8 sm:mt-10 md:mt-12 text-lg sm:text-xl max-w-2xl leading-relaxed">
              Transform your Discord discussions into organized GitHub issues with AI-powered analysis.
            </p>
            <div className="mt-10 sm:mt-12 md:mt-16 flex flex-col sm:flex-row gap-4 sm:gap-6">
              <Link 
                to="/generate"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-black text-base font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
              >
                Try It Now
              </Link>
              <a 
                href="https://github.com" 
                className="mt-4 sm:mt-0 inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-black text-base font-medium text-black bg-transparent hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-24 md:py-28 lg:py-32 bg-gray-100">
        <div className="max-w-7xl mx-auto px-8 sm:px-10 lg:px-12">
          <h2 className="text-3xl sm:text-4xl font-sans font-bold pl-8 sm:pl-10">
            Features
          </h2>
          
          <div className="mt-12 sm:mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 pl-8 sm:pl-10">
            <div className="border-t-2 border-black pt-6">
              <h3 className="text-xl font-bold mb-3 sm:mb-4">AI-Powered</h3>
              <p className="text-gray-800">
                Smart conversion of conversations into structured issues with intelligent categorization.
              </p>
            </div>

            <div className="border-t-2 border-black pt-6">
              <h3 className="text-xl font-bold mb-3 sm:mb-4">Customizable</h3>
              <p className="text-gray-800">
                Tailor the issue format to match your team's workflow with customizable templates.
              </p>
            </div>

            <div className="border-t-2 border-black pt-6">
              <h3 className="text-xl font-bold mb-3 sm:mb-4">Seamless Integration</h3>
              <p className="text-gray-800">
                Works directly with your existing GitHub repositories and Discord servers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-20 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-8 sm:px-10 lg:px-12">
          <h2 className="text-3xl sm:text-4xl font-sans font-bold pl-8 sm:pl-10">
            How It Works
          </h2>

          <div className="mt-8 sm:mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
            <div className="relative pl-8 sm:pl-10">
              <div className="absolute top-0 left-0 ml-2 sm:ml-3 mt-0 flex items-center justify-center h-6 w-6 sm:h-8 sm:w-8 bg-black text-white font-bold text-base sm:text-lg">
                1
              </div>
              <div className="border-l-2 border-black pl-10 sm:pl-12 md:pl-14 h-full">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Copy Discord Content</h3>
                <p className="text-gray-800 text-sm sm:text-base">
                  Select and copy the relevant conversation from your Discord channel.
                </p>
              </div>
            </div>

            <div className="relative pl-8 sm:pl-10">
              <div className="absolute top-0 left-0 ml-2 sm:ml-3 mt-0 flex items-center justify-center h-6 w-6 sm:h-8 sm:w-8 bg-black text-white font-bold text-base sm:text-lg">
                2
              </div>
              <div className="border-l-2 border-black pl-10 sm:pl-12 md:pl-14 h-full">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Paste & Process</h3>
                <p className="text-gray-800 text-sm sm:text-base">
                  Paste the conversation and provide your GitHub repository details.
                </p>
              </div>
            </div>

            <div className="relative pl-8 sm:pl-10">
              <div className="absolute top-0 left-0 ml-2 sm:ml-3 mt-0 flex items-center justify-center h-6 w-6 sm:h-8 sm:w-8 bg-black text-white font-bold text-base sm:text-lg">
                3
              </div>
              <div className="border-l-2 border-black pl-10 sm:pl-12 md:pl-14 h-full">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Create GitHub Issue</h3>
                <p className="text-gray-800 text-sm sm:text-base">
                  Review the generated issue, then create it in your GitHub repository.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-24 md:py-28 lg:py-32 bg-black text-white">
        <div className="max-w-7xl mx-auto px-8 sm:px-10 lg:px-12">
          <div className="text-center pl-8 sm:pl-10">
            <h2 className="text-3xl sm:text-4xl font-sans font-bold">
              Ready to streamline your workflow?
            </h2>
            <div className="mt-8 sm:mt-10 md:mt-12">
              <Link
                to="/generate"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-base font-medium text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white transition-colors"
              >
                Try It Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 sm:py-24 md:py-28 lg:py-32 bg-gray-100">
        <div className="max-w-7xl mx-auto px-8 sm:px-10 lg:px-12">
          <h2 className="text-3xl sm:text-4xl font-sans font-bold pl-8 sm:pl-10">
            About
          </h2>

          <div className="mt-10 sm:mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pl-8 sm:pl-10">
            <div>
              <p className="text-gray-800 mb-4 sm:mb-6 leading-relaxed">
                DiscIssue was born out of the frustration of manually converting Discord discussions into GitHub issues.
              </p>
              <p className="text-gray-800 leading-relaxed">
                Our mission is to help development teams bridge the gap between communication platforms and project management tools.
              </p>
            </div>
            <div>
              <p className="text-gray-800 leading-relaxed">
                We're constantly improving DiscIssue based on user feedback and adding new features to make it even more powerful and user-friendly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
