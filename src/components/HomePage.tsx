import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="bg-white text-black">
      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 md:pt-40 lg:pt-48 pb-24 sm:pb-32 md:pb-40 lg:pb-48">
        <div className="max-w-7xl mx-auto px-8 sm:px-10 lg:px-12">
          <div className="max-w-3xl pl-8 sm:pl-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-bold leading-none tracking-tight">
              <span className="block">AI-Powered</span>
              <span className="block mt-2">Issue Creation</span>
            </h1>
            <p className="mt-8 sm:mt-10 md:mt-12 text-lg sm:text-xl max-w-2xl leading-relaxed">
              Transform any text content into organized GitHub issues with AI-powered analysis. Save time and streamline your development workflow.
            </p>
            <ul className="mt-8 space-y-4 text-gray-600">
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Instant issue generation from any text
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Smart categorization and labeling
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Seamless GitHub integration
              </li>
            </ul>
            <div className="mt-10 sm:mt-12 md:mt-16 flex flex-col sm:flex-row gap-4 sm:gap-6">
              <Link 
                to="/generate"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-black text-base font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
              >
                Try It Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-28 md:py-32 lg:py-36 bg-gray-100">
        <div className="max-w-7xl mx-auto px-8 sm:px-10 lg:px-12">
          <h2 className="text-3xl sm:text-4xl font-sans font-bold pl-8 sm:pl-10">
            Features
          </h2>
          
          <div className="mt-16 sm:mt-20 md:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16 pl-8 sm:pl-10">
            <div className="border-t-2 border-black pt-6">
              <h3 className="text-xl font-bold mb-4">AI-Powered Analysis</h3>
              <p className="text-gray-800">
                Smart conversion of any text content into structured issues with intelligent categorization and priority assignment.
              </p>
            </div>

            <div className="border-t-2 border-black pt-6">
              <h3 className="text-xl font-bold mb-4">Customizable Workflow</h3>
              <p className="text-gray-800">
                Tailor the issue format to match your team's workflow with customizable templates and settings.
              </p>
            </div>

            <div className="border-t-2 border-black pt-6">
              <h3 className="text-xl font-bold mb-4">Seamless Integration</h3>
              <p className="text-gray-800">
                Works seamlessly with your GitHub repositories and supports various text input formats.
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

          <div className="mt-8 sm:mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 md:gap-x-12 md:gap-y-16">
            <div className="relative pl-8 sm:pl-10">
              <div className="absolute top-0 left-0 ml-2 sm:ml-3 mt-0 flex items-center justify-center h-6 w-6 sm:h-8 sm:w-8 bg-black text-white font-bold text-base sm:text-lg">
                1
              </div>
              <div className="border-l-2 border-black pl-10 sm:pl-12 md:pl-14 h-full">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Sign in with GitHub</h3>
                <p className="text-gray-800 text-sm sm:text-base">
                  Securely authenticate with your GitHub account in one click.
                </p>
              </div>
            </div>

            <div className="relative pl-8 sm:pl-10">
              <div className="absolute top-0 left-0 ml-2 sm:ml-3 mt-0 flex items-center justify-center h-6 w-6 sm:h-8 sm:w-8 bg-black text-white font-bold text-base sm:text-lg">
                2
              </div>
              <div className="border-l-2 border-black pl-10 sm:pl-12 md:pl-14 h-full">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Copy Text Content</h3>
                <p className="text-gray-800 text-sm sm:text-base">
                  Copy the relevant text content you want to convert into an issue.
                </p>
              </div>
            </div>

            <div className="relative pl-8 sm:pl-10">
              <div className="absolute top-0 left-0 ml-2 sm:ml-3 mt-0 flex items-center justify-center h-6 w-6 sm:h-8 sm:w-8 bg-black text-white font-bold text-base sm:text-lg">
                3
              </div>
              <div className="border-l-2 border-black pl-10 sm:pl-12 md:pl-14 h-full">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Paste & Process</h3>
                <p className="text-gray-800 text-sm sm:text-base">
                  Paste the content and select your GitHub repository.
                </p>
              </div>
            </div>

            <div className="relative pl-8 sm:pl-10">
              <div className="absolute top-0 left-0 ml-2 sm:ml-3 mt-0 flex items-center justify-center h-6 w-6 sm:h-8 sm:w-8 bg-black text-white font-bold text-base sm:text-lg">
                4
              </div>
              <div className="border-l-2 border-black pl-10 sm:pl-12 md:pl-14 h-full">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Create GitHub Issue</h3>
                <p className="text-gray-800 text-sm sm:text-base">
                  Review the AI-generated issue and create it with one click.
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
                IssueMakerAI was born out of the need to streamline the process of creating well-structured GitHub issues.
              </p>
              <p className="text-gray-800 leading-relaxed">
                Our mission is to help development teams efficiently convert any text-based discussions into actionable GitHub issues.
              </p>
            </div>
            <div>
              <p className="text-gray-800 leading-relaxed">
                We're constantly improving IssueMakerAI based on user feedback and adding new features to make it even more powerful and user-friendly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
