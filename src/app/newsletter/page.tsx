import Link from "next/link";
import type { Metadata } from "next";
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: "Newsletter - MCP Tutorials & Updates | Kai Gritun",
  description: "Get MCP tutorials, updates, and best practices delivered to your inbox. Learn to build AI integrations with Model Context Protocol.",
};

export default function NewsletterPage() {
  return (
    <div className="min-h-screen bg-[#0c0c0c] text-neutral-100">
      <nav className="px-6 py-4 border-b border-neutral-800/50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight">kai</Link>
          <div className="flex gap-6 text-sm text-neutral-400">
            <Link href="/mcp" className="hover:text-amber-500 transition-colors">mcp</Link>
            <Link href="/blog" className="hover:text-amber-500 transition-colors">blog</Link>
            <a href="https://github.com/kaigritun" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors">github</a>
          </div>
        </div>
      </nav>

      <section className="px-6 py-20">
        <div className="max-w-2xl mx-auto">
          <p className="text-amber-500 font-mono text-sm mb-4">Newsletter</p>
          <h1 className="text-4xl font-bold mb-6 tracking-tight">
            MCP Tutorials & Updates
          </h1>
          <p className="text-xl text-neutral-400 mb-8 leading-relaxed">
            Stay up to date with Model Context Protocol. Every week, you&apos;ll get:
          </p>
          
          <ul className="space-y-4 text-neutral-400 mb-12">
            <li className="flex gap-3">
              <span className="text-amber-500">→</span>
              <span>New tutorials and working code examples</span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-500">→</span>
              <span>MCP ecosystem updates and new servers</span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-500">→</span>
              <span>Production patterns and best practices</span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-500">→</span>
              <span>Tips from building real MCP integrations</span>
            </li>
          </ul>

          <EmailSignup 
            headline="Get MCP tutorials & updates"
            buttonText="Subscribe free"
            site="mcp"
          />

          <div className="mt-16 pt-12 border-t border-neutral-800/50">
            <h2 className="text-lg font-semibold mb-4">What readers say</h2>
            <div className="space-y-6 text-neutral-500">
              <blockquote className="border-l-2 border-amber-500/50 pl-4 italic">
                &quot;The most practical MCP content I&apos;ve found. Actually shows working code, not just concepts.&quot;
              </blockquote>
              <blockquote className="border-l-2 border-amber-500/50 pl-4 italic">
                &quot;Helped me go from zero to a production MCP server in a weekend.&quot;
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <footer className="px-6 py-8 border-t border-neutral-800/50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <p className="text-neutral-600 text-sm font-mono">© {new Date().getFullYear()}</p>
          <Link href="/" className="text-sm text-neutral-500 hover:text-amber-500 transition-colors">
            ← back home
          </Link>
        </div>
      </footer>
    </div>
  );
}
