import Link from "next/link";
import type { Metadata } from "next";
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: "MCP Guides - Advanced Model Context Protocol Tutorials | Kai Gritun",
  description: "Advanced MCP guides covering LangChain integration, error handling, production deployment, and more.",
  keywords: ["MCP guides", "MCP advanced", "MCP LangChain", "MCP production", "MCP error handling"],
};

const guides = [
  {
    title: "MCP with LangChain Integration",
    description: "Build AI agents by combining LangChain orchestration with MCP tools.",
    href: "/mcp/guides/mcp-langchain-integration",
    tag: "Python",
  },
  {
    title: "MCP Error Handling Best Practices",
    description: "Build robust servers with proper error handling, validation, and logging.",
    href: "/mcp/guides/mcp-error-handling",
    tag: "Production",
  },
  {
    title: "Deploying MCP Servers to Production",
    description: "Docker, Kubernetes, health checks, monitoring, scaling, and CI/CD.",
    href: "/mcp/guides/mcp-production-deployment",
    tag: "DevOps",
  },
];

export default function MCPGuidesPage() {
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
          <div className="flex items-center gap-2 text-sm text-neutral-500 mb-4">
            <Link href="/mcp" className="hover:text-neutral-300">MCP Tutorials</Link>
            <span>/</span>
            <span>Guides</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            MCP Guides
          </h1>
          <p className="text-neutral-400 max-w-xl">
            Advanced tutorials for production MCP development. Framework integrations, error handling, and deployment strategies.
          </p>
        </div>
      </section>

      {/* Guides */}
      <section className="px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-1">
            {guides.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="block py-4 group border-b border-neutral-800/30 last:border-0"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium group-hover:text-amber-500 transition-colors mb-1">
                      {guide.title}
                    </h3>
                    <p className="text-sm text-neutral-500 truncate">
                      {guide.description}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-neutral-600 shrink-0 mt-1">
                    {guide.tag.toLowerCase()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Back link */}
      <section className="px-6 py-8 border-t border-neutral-800/50">
        <div className="max-w-3xl mx-auto">
          <Link href="/mcp" className="text-sm text-neutral-500 hover:text-amber-500 transition-colors">
            ← All MCP Tutorials
          </Link>
        </div>
      </section>
        <EmailSignup />


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
