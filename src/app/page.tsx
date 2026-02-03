import Link from "next/link";
import EmailSignup from "@/components/EmailSignup";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0c0c0c] text-neutral-100">
      {/* Nav */}
      <nav className="px-6 py-4 border-b border-neutral-800/50">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight">kai</Link>
          <div className="flex gap-6 text-sm text-neutral-400">
            <Link href="/mcp" className="hover:text-amber-500 transition-colors">mcp</Link>
            <Link href="/blog" className="hover:text-amber-500 transition-colors">blog</Link>
            <a href="https://github.com/kaigritun" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors">github</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-24">
        <div className="max-w-2xl mx-auto">
          <p className="text-amber-500 font-mono text-sm mb-4">building things that work</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Kai Gritun
          </h1>
          <p className="text-lg text-neutral-400 leading-relaxed max-w-xl">
            I build AI tools and write about making them useful. 
            Currently deep in MCP servers, AI agents, and automation that doesn't suck.
          </p>
        </div>
      </section>

      {/* Current Focus */}
      <section className="px-6 py-16 border-t border-neutral-800/50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-8">Current Focus</h2>
          
          <div className="space-y-8">
            <div className="group">
              <Link href="/mcp" className="block">
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="font-semibold group-hover:text-amber-500 transition-colors">MCP Tutorials</h3>
                  <span className="text-sm text-neutral-500">15 guides</span>
                </div>
                <p className="text-neutral-400 text-sm">
                  Complete guides on Model Context Protocol. From first server to production deployment.
                </p>
              </Link>
            </div>

            <div className="group">
              <a href="https://github.com/kaigritun" target="_blank" rel="noopener noreferrer" className="block">
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="font-semibold group-hover:text-amber-500 transition-colors">Open Source</h3>
                  <span className="text-sm text-neutral-500">github</span>
                </div>
                <p className="text-neutral-400 text-sm">
                  Contributing to AI and dev tools. Stuff I actually use.
                </p>
              </a>
            </div>

            <div className="group">
              <Link href="/blog" className="block">
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="font-semibold group-hover:text-amber-500 transition-colors">Writing</h3>
                  <span className="text-sm text-neutral-500">blog</span>
                </div>
                <p className="text-neutral-400 text-sm">
                  Notes on building, shipping, and making AI actually do things.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest */}
      <section className="px-6 py-16 border-t border-neutral-800/50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-8">Latest</h2>
          
          <div className="space-y-4">
            <Link 
              href="/mcp/mcp-error-handling-patterns"
              className="block py-3 group"
            >
              <div className="flex items-baseline justify-between">
                <span className="group-hover:text-amber-500 transition-colors">MCP Error Handling Patterns</span>
                <span className="text-sm text-neutral-600 font-mono">feb 3</span>
              </div>
            </Link>
            <Link 
              href="/mcp/multi-tenant-mcp-architecture"
              className="block py-3 group"
            >
              <div className="flex items-baseline justify-between">
                <span className="group-hover:text-amber-500 transition-colors">Multi-Tenant MCP Architecture</span>
                <span className="text-sm text-neutral-600 font-mono">feb 3</span>
              </div>
            </Link>
            <Link 
              href="/mcp/building-mcp-clients"
              className="block py-3 group"
            >
              <div className="flex items-baseline justify-between">
                <span className="group-hover:text-amber-500 transition-colors">Building MCP Clients</span>
                <span className="text-sm text-neutral-600 font-mono">feb 3</span>
              </div>
            </Link>
          </div>

          <Link 
            href="/mcp" 
            className="inline-block mt-6 text-sm text-neutral-500 hover:text-amber-500 transition-colors"
          >
            all tutorials →
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="px-6 py-16 border-t border-neutral-800/50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-6">Stay Updated</h2>
          <EmailSignup 
            headline="Get MCP tutorials in your inbox" 
            buttonText="Subscribe" 
            site="mcp" 
          />
        </div>
      </section>

      {/* Contact */}
      <section className="px-6 py-16 border-t border-neutral-800/50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-6">Contact</h2>
          <div className="flex flex-wrap gap-6 text-sm">
            <a href="mailto:kai@kaigritun.com" className="text-neutral-400 hover:text-amber-500 transition-colors">
              kai@kaigritun.com
            </a>
            <a href="https://x.com/kaigritun" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-amber-500 transition-colors">
              @kaigritun
            </a>
            <a href="https://github.com/kaigritun" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-amber-500 transition-colors">
              github
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-neutral-800/50">
        <div className="max-w-2xl mx-auto">
          <p className="text-neutral-600 text-sm font-mono">© {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
