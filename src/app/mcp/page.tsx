import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MCP Tutorials - Model Context Protocol Guides | Kai Gritun",
  description: "Learn to build MCP servers, connect AI models to external tools, and master the Model Context Protocol with practical tutorials and working examples.",
  keywords: ["MCP", "Model Context Protocol", "MCP server", "MCP tutorial", "AI tools", "Claude MCP", "LLM tools"],
};

const tutorials = [
  {
    title: "MCP for Beginners: Complete Guide",
    description: "Learn MCP from scratch. Build your first server in 5 minutes.",
    href: "/mcp/mcp-beginners-guide",
    tag: "Beginner",
  },
  {
    title: "MCP Server Directory",
    description: "Browse 30+ MCP servers with search and filtering.",
    href: "/mcp/servers",
    tag: "Directory",
  },
  {
    title: "MCP with LangChain Integration",
    description: "Connect MCP servers to LangChain for enhanced AI apps.",
    href: "/mcp/mcp-langchain-integration",
    tag: "Integration",
  },
  {
    title: "Building Multi-Tool MCP Servers",
    description: "Create servers that expose multiple related tools.",
    href: "/mcp/building-multi-tool-servers",
    tag: "Architecture",
  },
  {
    title: "MCP Error Handling Best Practices",
    description: "Robust error handling for production MCP servers.",
    href: "/mcp/mcp-error-handling",
    tag: "Production",
  },
  {
    title: "MCP Webhooks & Event-Driven Patterns",
    description: "Build reactive servers that respond to external events.",
    href: "/mcp/mcp-webhooks-event-driven",
    tag: "Advanced",
  },
  {
    title: "MCP Error Handling Patterns",
    description: "Build robust MCP servers that fail gracefully.",
    href: "/mcp/mcp-error-handling-patterns",
    tag: "Production",
  },
  {
    title: "Multi-Tenant MCP Architecture",
    description: "Serve multiple users securely with tenant isolation.",
    href: "/mcp/multi-tenant-mcp-architecture",
    tag: "Advanced",
  },
  {
    title: "MCP with Cursor & IDEs",
    description: "Configure MCP in Cursor, VS Code, and Windsurf.",
    href: "/mcp/mcp-cursor-ide-setup",
    tag: "Setup",
  },
  {
    title: "Building MCP Clients",
    description: "Connect to MCP servers from your own code.",
    href: "/mcp/building-mcp-clients",
    tag: "Advanced",
  },
  {
    title: "MCP Performance Optimization",
    description: "Connection pooling, caching, async patterns.",
    href: "/mcp/mcp-performance-optimization",
    tag: "Performance",
  },
  {
    title: "MCP Docker Deployment",
    description: "Containerize for production with health checks.",
    href: "/mcp/mcp-docker-deployment",
    tag: "DevOps",
  },
  {
    title: "Claude Desktop MCP Setup",
    description: "First install to multiple servers.",
    href: "/mcp/claude-desktop-mcp-setup",
    tag: "Beginner",
  },
  {
    title: "Testing MCP Servers",
    description: "MCP Inspector, unit tests, CI/CD pipelines.",
    href: "/mcp/testing-mcp-servers",
    tag: "Testing",
  },
  {
    title: "MCP Troubleshooting Guide",
    description: "Fix common problems fast.",
    href: "/mcp/troubleshooting-mcp-servers",
    tag: "Debug",
  },
  {
    title: "MCP Authentication Guide",
    description: "API keys, OAuth, secrets managers.",
    href: "/mcp/mcp-authentication-guide",
    tag: "Security",
  },
  {
    title: "How to Build MCP Server (TypeScript)",
    description: "Official SDK with Zod schemas.",
    href: "/mcp/how-to-build-mcp-server-typescript",
    tag: "Tutorial",
  },
  {
    title: "How to Build MCP Server (Python)",
    description: "FastMCP framework from scratch.",
    href: "/mcp/how-to-build-mcp-server-python",
    tag: "Tutorial",
  },
  {
    title: "MCP vs Function Calling",
    description: "When to use each approach.",
    href: "/mcp/mcp-vs-function-calling",
    tag: "Concepts",
  },
  {
    title: "Best MCP Servers 2025",
    description: "Top servers worth using.",
    href: "/mcp/best-mcp-servers-2025",
    tag: "Lists",
  },
  {
    title: "MCP Resources and Prompts",
    description: "Beyond tools: resources and prompts.",
    href: "/mcp/mcp-resources-prompts-guide",
    tag: "Concepts",
  },
];

export default function MCPPage() {
  return (
    <div className="min-h-screen bg-[#0c0c0c] text-neutral-100">
      {/* Nav */}
      <nav className="px-6 py-4 border-b border-neutral-800/50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight">kai</Link>
          <div className="flex gap-6 text-sm text-neutral-400">
            <Link href="/mcp" className="text-amber-500">mcp</Link>
            <Link href="/blog" className="hover:text-amber-500 transition-colors">blog</Link>
            <a href="https://github.com/kaigritun" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors">github</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-16 border-b border-neutral-800/50">
        <div className="max-w-3xl mx-auto">
          <p className="text-amber-500 font-mono text-sm mb-4">Model Context Protocol</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            MCP Tutorials
          </h1>
          <p className="text-neutral-400 max-w-xl">
            Everything you need to build MCP servers. From first "hello world" to production multi-tenant deployments.
          </p>
        </div>
      </section>

      {/* Tutorials */}
      <section className="px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-1">
            {tutorials.map((tutorial) => (
              <Link
                key={tutorial.href}
                href={tutorial.href}
                className="block py-4 group border-b border-neutral-800/30 last:border-0"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium group-hover:text-amber-500 transition-colors mb-1">
                      {tutorial.title}
                    </h3>
                    <p className="text-sm text-neutral-500 truncate">
                      {tutorial.description}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-neutral-600 shrink-0 mt-1">
                    {tutorial.tag.toLowerCase()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* What is MCP */}
      <section className="px-6 py-12 border-t border-neutral-800/50 bg-neutral-900/20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-6">What is MCP?</h2>
          <div className="text-neutral-400 space-y-4 text-sm leading-relaxed">
            <p>
              Model Context Protocol is an open standard for connecting AI models to external tools and data. 
              Instead of building custom integrations for each AI provider, you build one MCP server that works everywhere.
            </p>
            <p>
              It's like USB for AI—a standard interface that any model can plug into.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
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
