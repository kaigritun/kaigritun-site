import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MCP Tutorials - Model Context Protocol Guides | Kai Gritun",
  description: "Learn to build MCP servers, connect AI models to external tools, and master the Model Context Protocol with practical tutorials and working examples.",
  keywords: ["MCP", "Model Context Protocol", "MCP server", "MCP tutorial", "AI tools", "Claude MCP", "LLM tools"],
};

const tutorials = [
  {
    title: "MCP Error Handling Patterns",
    description: "Build robust MCP servers that fail gracefully. Learn error codes, retry logic, graceful degradation, recovery hints, and user-friendly error messages.",
    href: "/mcp/mcp-error-handling-patterns",
    date: "2026-02-03",
    readTime: "18 min read",
    tags: ["Best Practices", "Production"],
  },
  {
    title: "Multi-Tenant MCP Architecture",
    description: "Build secure MCP servers that serve multiple users or organizations. Covers tenant isolation, authentication, rate limiting, billing, and deployment patterns.",
    href: "/mcp/multi-tenant-mcp-architecture",
    date: "2026-02-03",
    readTime: "20 min read",
    tags: ["Advanced", "Production", "SaaS"],
  },
  {
    title: "MCP with Cursor, VS Code & IDEs",
    description: "Configure MCP servers in Cursor, VS Code with Cline/Continue, Windsurf, and other AI-powered IDEs. Step-by-step setup for each editor.",
    href: "/mcp/mcp-cursor-ide-setup",
    date: "2026-02-03",
    readTime: "14 min read",
    tags: ["IDE", "Setup"],
  },
  {
    title: "Building MCP Clients",
    description: "Connect to MCP servers from your own code. Build CLI tools, agents, and applications that use MCP servers programmatically.",
    href: "/mcp/building-mcp-clients",
    date: "2026-02-03",
    readTime: "15 min read",
    tags: ["Advanced", "Client"],
  },
  {
    title: "MCP Performance Optimization",
    description: "Make your MCP servers fast. Connection pooling, caching strategies, async patterns, request batching, and monitoring.",
    href: "/mcp/mcp-performance-optimization",
    date: "2026-02-03",
    readTime: "15 min read",
    tags: ["Performance", "Production"],
  },
  {
    title: "MCP Docker Deployment",
    description: "Containerize your MCP servers for production. Dockerfiles, docker-compose, health checks, multi-server architecture, and Kubernetes orchestration.",
    href: "/mcp/mcp-docker-deployment",
    date: "2026-02-03",
    readTime: "15 min read",
    tags: ["DevOps", "Production"],
  },
  {
    title: "Claude Desktop MCP Setup Guide",
    description: "Complete tutorial for configuring MCP servers with Anthropic's Claude Desktop. From first install to running multiple servers.",
    href: "/mcp/claude-desktop-mcp-setup",
    date: "2026-02-03",
    readTime: "12 min read",
    tags: ["Setup", "Beginner"],
  },
  {
    title: "Testing MCP Servers: A Complete Guide",
    description: "From quick validation with MCP Inspector to full CI/CD pipelines. Unit tests, integration tests, and mocking patterns for Python and TypeScript.",
    href: "/mcp/testing-mcp-servers",
    date: "2026-02-03",
    readTime: "12 min read",
    tags: ["Testing", "Best Practices"],
  },
  {
    title: "MCP Troubleshooting Guide: Fix Common Server Issues",
    description: "Server failing silently? Tools not appearing? This guide covers the most common MCP problems and how to fix them fast.",
    href: "/mcp/troubleshooting-mcp-servers",
    date: "2026-02-03",
    readTime: "10 min read",
    tags: ["Debug", "Reference"],
  },
  {
    title: "MCP Authentication Guide",
    description: "Secure your MCP servers with proper credential handling. Environment variables, OAuth tokens, secrets managers, and multi-environment configs.",
    href: "/mcp/mcp-authentication-guide",
    date: "2026-02-03",
    readTime: "14 min read",
    tags: ["Security", "Production"],
  },
  {
    title: "15 Best MCP Servers in 2025",
    description: "Curated list of the most useful MCP servers: GitHub, Playwright, databases, and more. Ranked by GitHub stars and real-world utility.",
    href: "/mcp/best-mcp-servers-2025",
    date: "2026-02-03",
    readTime: "10 min read",
    tags: ["List", "Resources"],
  },
  {
    title: "How to Build an MCP Server in TypeScript",
    description: "Build type-safe MCP servers with the official SDK. Covers Zod schemas, resource templates, and Claude Desktop integration.",
    href: "/mcp/how-to-build-mcp-server-typescript",
    date: "2026-02-03",
    readTime: "15 min read",
    tags: ["TypeScript", "Intermediate"],
  },
  {
    title: "MCP Resources and Prompts: Complete Guide",
    description: "Tools get all the attention, but Resources and Prompts are what make MCP servers powerful. Learn how to give AI rich context and reusable instructions.",
    href: "/mcp/mcp-resources-prompts-guide",
    date: "2026-02-03",
    readTime: "10 min read",
    tags: ["Advanced", "Deep Dive"],
  },
  {
    title: "How to Build an MCP Server in Python",
    description: "Step-by-step guide to creating your first MCP server. Connect Claude and other LLMs to custom tools in under 30 minutes.",
    href: "/mcp/how-to-build-mcp-server-python",
    date: "2026-02-03",
    readTime: "12 min read",
    tags: ["Python", "Beginner"],
  },
  {
    title: "MCP vs OpenAI Function Calling: Which Should You Use?",
    description: "Comprehensive comparison of the two major approaches to AI tool integration. Learn the key differences, pros/cons, and when to use each.",
    href: "/mcp/mcp-vs-function-calling",
    date: "2026-02-03",
    readTime: "8 min read",
    tags: ["Comparison", "Architecture"],
  },
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
            <li>→ Building MCP Servers for Databases</li>
            <li>→ MCP Server Monitoring and Observability</li>
            <li>→ Real-time MCP with WebSockets</li>
            <li>→ MCP Webhooks and Event-Driven Patterns</li>
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
