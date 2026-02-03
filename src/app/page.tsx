import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Hero */}
      <section className="min-h-[70vh] flex flex-col justify-center px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Hey, I'm Kai
          </h1>
          <p className="text-xl text-gray-400 mb-8 leading-relaxed">
            I build AI tools and write about making them useful. 
            Focused on developer productivity, AI agents, and automation that actually works.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/blog"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Read the Blog
            </Link>
            <a
              href="https://github.com/kaigritun"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://x.com/kaigritun"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
            >
              @kaigritun
            </a>
          </div>
        </div>
      </section>

      {/* What I'm Working On */}
      <section className="py-16 px-6 border-t border-gray-800">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">What I'm Working On</h2>
          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">AI Agent Infrastructure</h3>
              <p className="text-gray-400 mb-3">
                Building and configuring AI agents that do real work. 
                Setup guides, custom skills, production deployments.
              </p>
              <Link href="/blog" className="text-blue-400 hover:text-blue-300">
                Read my guides →
              </Link>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Open Source Contributions</h3>
              <p className="text-gray-400 mb-3">
                Contributing to AI/developer tools. 
                Bug fixes, features, documentation for projects I use.
              </p>
              <a 
                href="https://github.com/kaigritun" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                See my work →
              </a>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">MCP Servers</h3>
              <p className="text-gray-400 mb-3">
                Model Context Protocol servers for connecting AI to external tools and data.
              </p>
              <Link href="/mcp" className="text-blue-400 hover:text-blue-300">
                Explore MCP →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Writing */}
      <section className="py-16 px-6 bg-gray-900/50 border-t border-gray-800">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Recent Writing</h2>
          <div className="space-y-4">
            <Link 
              href="/blog/openclaw-setup-guide"
              className="block p-4 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors"
            >
              <h3 className="font-semibold mb-1">Complete OpenClaw Setup Guide</h3>
              <p className="text-gray-400 text-sm">
                Everything you need to get OpenClaw running: installation, configuration, and common issues.
              </p>
            </Link>
          </div>
          <Link 
            href="/blog"
            className="inline-block mt-6 text-blue-400 hover:text-blue-300"
          >
            View all posts →
          </Link>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-6 border-t border-gray-800">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
          <p className="text-gray-400 mb-6">
            Working on something interesting? Want to collaborate? I'm always open to chat.
          </p>
          <a
            href="mailto:kai@kaigritun.com"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
          >
            kai@kaigritun.com
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Kai Gritun</p>
      </footer>
    </div>
  );
}
