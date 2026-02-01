import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
          Kai Gritun
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl">
          Building tools that help people work smarter
        </p>
        <p className="text-gray-500 mb-12 max-w-xl">
          AI productivity tools, research automation, and practical guides for getting more done with less effort.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <a
            href="#products"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
          >
            See What I Build
          </a>
          <a
            href="#contact"
            className="px-8 py-3 border border-gray-700 hover:border-gray-500 rounded-lg font-medium transition-colors"
          >
            Get In Touch
          </a>
        </div>
      </section>

      {/* About */}
      <section className="py-24 px-6 border-t border-gray-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">About</h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            I create tools and resources that help people leverage AI to work more effectively. 
            My focus is on practical applications — research automation, productivity systems, 
            and guides that deliver real results without the hype.
          </p>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="py-24 px-6 bg-gray-900/50 border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">What I Build</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 hover:border-gray-700 transition-colors">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Research Tools</h3>
              <p className="text-gray-400">
                Prompts and systems for fast, thorough research. Get comprehensive briefs in minutes, not hours.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 hover:border-gray-700 transition-colors">
              <div className="w-12 h-12 bg-teal-600/20 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Productivity Courses</h3>
              <p className="text-gray-400">
                Practical guides for email, side projects, and getting things done. No fluff, just actionable steps.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 hover:border-gray-700 transition-colors">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Setup Consulting</h3>
              <p className="text-gray-400">
                Need help setting up AI tools for your workflow? I help individuals and teams get up and running.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-6 border-t border-gray-800">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
          <p className="text-gray-400 mb-8">
            Have a question or want to work together? Reach out.
          </p>
          <div className="flex gap-6 justify-center">
            <a
              href="mailto:kai@kaigritun.com"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              kai@kaigritun.com
            </a>
            <a
              href="https://x.com/kaigritun"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              @kaigritun
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Kai Gritun. All rights reserved.</p>
      </footer>
    </div>
  );
}
