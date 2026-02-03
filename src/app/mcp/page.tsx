import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MCP Tutorials - Model Context Protocol Guides | Kai Gritun",
  description: "Learn to build MCP servers, connect AI models to external tools, and master the Model Context Protocol with practical tutorials and working examples.",
  keywords: ["MCP", "Model Context Protocol", "MCP server", "MCP tutorial", "AI tools", "Claude MCP", "LLM tools"],
};

const tutorials = [
  {
    title: "How to Build an MCP Server in Python",
    description: "Step-by-step guide to creating your first MCP server. Connect Claude and other LLMs to custom tools in under 30 minutes.",
    href: "/mcp/how-to-build-mcp-server-python",
    date: "2026-02-03",
    readTime: "12 min read",
    tags: ["Python", "Beginner"],
  },
  // More tutorials coming soon
];

export default function MCPTutorials() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-semibold hover:text-blue-400 transition-colors">
            Kai Gritun
          </Link>
          <nav className="flex gap-6 text-sm text-gray-400">
            <Link href="/mcp" className="text-white">MCP Tutorials</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-6 border-b border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            MCP Tutorials
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Learn to build MCP servers and connect AI models to external tools. 
            Practical guides with working code examples.
          </p>
        </div>
      </section>

      {/* What is MCP */}
      <section className="py-12 px-6 bg-gray-900/50 border-b border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">What is MCP?</h2>
          <p className="text-gray-400 mb-4">
            The <strong className="text-white">Model Context Protocol (MCP)</strong> is an open standard 
            that lets AI models like Claude interact with external tools and data sources. Instead of 
            being limited to what's in their training data, LLMs can read files, query databases, 
            call APIs, and take actions in the real world.
          </p>
          <p className="text-gray-400">
            Think of MCP servers as plugins for AI. You build a server that exposes tools, 
            and any MCP-compatible AI client can use them. It's how AI agents actually get things done.
          </p>
        </div>
      </section>

      {/* Tutorials List */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Tutorials</h2>
          <div className="space-y-6">
            {tutorials.map((tutorial) => (
              <Link
                key={tutorial.href}
                href={tutorial.href}
                className="block bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors"
              >
                <div className="flex flex-wrap gap-2 mb-3">
                  {tutorial.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-blue-900/50 text-blue-300 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-400">
                  {tutorial.title}
                </h3>
                <p className="text-gray-400 mb-3">{tutorial.description}</p>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>{tutorial.date}</span>
                  <span>·</span>
                  <span>{tutorial.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-12 px-6 bg-gray-900/50 border-t border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Coming Soon</h2>
          <ul className="space-y-3 text-gray-400">
            <li>→ MCP vs OpenAI Function Calling: When to Use Each</li>
            <li>→ Best MCP Servers in 2025 (curated list)</li>
            <li>→ Building an MCP Server in TypeScript</li>
            <li>→ Connecting MCP to Claude Desktop</li>
            <li>→ Advanced MCP: Resources and Prompts</li>
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Kai Gritun · <Link href="https://x.com/kaigritun" className="hover:text-white">@kaigritun</Link></p>
      </footer>
    </div>
  );
}
