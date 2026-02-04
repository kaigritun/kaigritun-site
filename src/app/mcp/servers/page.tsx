"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import EmailSignup from "@/components/EmailSignup";

const servers = [
  // Official / Major Company Servers
  {
    name: "GitHub MCP Server",
    description: "Official GitHub integration. Access repos, issues, PRs, code search, and more.",
    github: "https://github.com/github/github-mcp-server",
    install: "npx @github/mcp-server",
    category: "dev-tools",
    language: "typescript",
    tags: ["official", "code", "git"],
    stars: "26.6k",
  },
  {
    name: "Playwright MCP",
    description: "Microsoft's browser automation. Control browsers, take screenshots, fill forms.",
    github: "https://github.com/microsoft/playwright-mcp",
    install: "npx @playwright/mcp@latest",
    category: "browser",
    language: "typescript",
    tags: ["official", "automation", "testing"],
    stars: "26.6k",
  },
  {
    name: "AWS MCP Servers",
    description: "Official AWS integration. Manage EC2, S3, Lambda, and other AWS services.",
    github: "https://github.com/awslabs/mcp",
    install: "pip install awslabs-mcp",
    category: "cloud",
    language: "python",
    tags: ["official", "cloud", "devops"],
    stars: "8k",
  },
  {
    name: "Google GenAI Toolbox",
    description: "Google's database MCP. AlloyDB, Cloud SQL, Spanner with built-in security.",
    github: "https://github.com/googleapis/genai-toolbox",
    install: "pip install genai-toolbox",
    category: "data",
    language: "python",
    tags: ["official", "database", "gcp"],
    stars: "12.7k",
  },
  // Frameworks & Tools
  {
    name: "Context7",
    description: "Up-to-date code documentation for LLMs. Query any library's docs directly.",
    github: "https://github.com/upstash/context7",
    install: "npx @upstash/context7-mcp",
    category: "dev-tools",
    language: "typescript",
    tags: ["documentation", "coding"],
    stars: "44.5k",
  },
  {
    name: "FastMCP",
    description: "The fastest way to build MCP servers in Python. Simple decorators, auto validation.",
    github: "https://github.com/jlowin/fastmcp",
    install: "pip install fastmcp",
    category: "framework",
    language: "python",
    tags: ["framework", "python"],
    stars: "22.5k",
  },
  {
    name: "MCP Inspector",
    description: "Official visual testing tool for MCP servers. Debug and inspect responses.",
    github: "https://github.com/modelcontextprotocol/inspector",
    install: "npx @modelcontextprotocol/inspector",
    category: "dev-tools",
    language: "typescript",
    tags: ["official", "debugging", "testing"],
    stars: "8.5k",
  },
  // Browser & Automation
  {
    name: "Browserbase MCP",
    description: "Cloud browser automation with AI. Stagehand-powered interactions.",
    github: "https://github.com/browserbase/mcp-server-browserbase",
    install: "npx @browserbasehq/mcp",
    category: "browser",
    language: "typescript",
    tags: ["cloud", "automation", "ai"],
    stars: "2.1k",
  },
  {
    name: "Puppeteer MCP",
    description: "Browser automation via Puppeteer. Screenshots, navigation, form filling.",
    github: "https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer",
    install: "npx @modelcontextprotocol/server-puppeteer",
    category: "browser",
    language: "typescript",
    tags: ["official", "automation"],
    stars: "26k",
  },
  {
    name: "Chrome MCP",
    description: "Control your actual Chrome browser via extension. Real browser context.",
    github: "https://github.com/nicholasoxford/mcp-chrome",
    install: "npx mcp-chrome",
    category: "browser",
    language: "typescript",
    tags: ["extension", "automation"],
    stars: "10.2k",
  },
  // Data & Databases
  {
    name: "PostgreSQL MCP",
    description: "Query PostgreSQL databases. Read-only by default, schema inspection.",
    github: "https://github.com/modelcontextprotocol/servers/tree/main/src/postgres",
    install: "npx @modelcontextprotocol/server-postgres",
    category: "data",
    language: "typescript",
    tags: ["official", "database", "sql"],
    stars: "26k",
  },
  {
    name: "SQLite MCP",
    description: "Local SQLite database access. Query, analyze, and manage SQLite files.",
    github: "https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite",
    install: "npx @modelcontextprotocol/server-sqlite",
    category: "data",
    language: "typescript",
    tags: ["official", "database", "sql"],
    stars: "26k",
  },
  {
    name: "MindsDB MCP",
    description: "Federated query engine. Connect 100+ data sources through one interface.",
    github: "https://github.com/mindsdb/mindsdb",
    install: "pip install mindsdb",
    category: "data",
    language: "python",
    tags: ["database", "ai", "federation"],
    stars: "38.3k",
  },
  {
    name: "Supabase MCP",
    description: "Supabase integration. Database, auth, storage, and edge functions.",
    github: "https://github.com/supabase-community/supabase-mcp",
    install: "npx supabase-mcp",
    category: "data",
    language: "typescript",
    tags: ["database", "backend", "auth"],
    stars: "1.8k",
  },
  // Productivity & Communication
  {
    name: "Slack MCP",
    description: "Send messages, read channels, manage Slack workspaces via AI.",
    github: "https://github.com/modelcontextprotocol/servers/tree/main/src/slack",
    install: "npx @modelcontextprotocol/server-slack",
    category: "productivity",
    language: "typescript",
    tags: ["official", "messaging", "chat"],
    stars: "26k",
  },
  {
    name: "Google Drive MCP",
    description: "Search and read Google Drive files. Docs, Sheets, and more.",
    github: "https://github.com/modelcontextprotocol/servers/tree/main/src/gdrive",
    install: "npx @modelcontextprotocol/server-gdrive",
    category: "productivity",
    language: "typescript",
    tags: ["official", "files", "google"],
    stars: "26k",
  },
  {
    name: "Notion MCP",
    description: "Read and search Notion pages and databases. Knowledge base access.",
    github: "https://github.com/modelcontextprotocol/servers/tree/main/src/notion",
    install: "npx @modelcontextprotocol/server-notion",
    category: "productivity",
    language: "typescript",
    tags: ["official", "notes", "wiki"],
    stars: "26k",
  },
  {
    name: "Linear MCP",
    description: "Project management integration. Issues, projects, and team workflows.",
    github: "https://github.com/modelcontextprotocol/servers/tree/main/src/linear",
    install: "npx @modelcontextprotocol/server-linear",
    category: "productivity",
    language: "typescript",
    tags: ["official", "project-management"],
    stars: "26k",
  },
  // Web & Search
  {
    name: "Fetch MCP",
    description: "Fetch and convert web pages to markdown. Simple web content extraction.",
    github: "https://github.com/modelcontextprotocol/servers/tree/main/src/fetch",
    install: "npx @modelcontextprotocol/server-fetch",
    category: "web",
    language: "typescript",
    tags: ["official", "scraping", "content"],
    stars: "26k",
  },
  {
    name: "Brave Search MCP",
    description: "Web search via Brave Search API. Privacy-focused search results.",
    github: "https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search",
    install: "npx @modelcontextprotocol/server-brave-search",
    category: "web",
    language: "typescript",
    tags: ["official", "search"],
    stars: "26k",
  },
  {
    name: "Exa MCP",
    description: "AI-native search engine. Semantic search for research and discovery.",
    github: "https://github.com/exa-labs/exa-mcp-server",
    install: "npx exa-mcp-server",
    category: "web",
    language: "typescript",
    tags: ["search", "ai", "research"],
    stars: "3.2k",
  },
  // Developer Tools
  {
    name: "Figma Context MCP",
    description: "Extract Figma designs for AI coding. Design-to-code workflows.",
    github: "https://github.com/GLips/Figma-Context-MCP",
    install: "npx figma-developer-mcp",
    category: "dev-tools",
    language: "typescript",
    tags: ["design", "ui", "coding"],
    stars: "12.9k",
  },
  {
    name: "GitMCP",
    description: "Remote MCP for any GitHub project. No setup, just point to any repo.",
    github: "https://github.com/idosal/git-mcp",
    install: "npx git-mcp",
    category: "dev-tools",
    language: "typescript",
    tags: ["git", "remote", "documentation"],
    stars: "7.5k",
  },
  {
    name: "Serena",
    description: "Coding agent with semantic retrieval. Deep codebase understanding.",
    github: "https://github.com/oraios/serena",
    install: "pip install serena-mcp",
    category: "dev-tools",
    language: "python",
    tags: ["coding", "semantic", "agent"],
    stars: "19.6k",
  },
  {
    name: "Sentry MCP",
    description: "Error tracking integration. Query issues, analyze crashes, debug faster.",
    github: "https://github.com/getsentry/sentry-mcp",
    install: "npx @sentry/mcp-server",
    category: "dev-tools",
    language: "typescript",
    tags: ["debugging", "errors", "monitoring"],
    stars: "1.4k",
  },
  // Security & Specialized
  {
    name: "GhidraMCP",
    description: "Ghidra reverse engineering. AI-powered binary analysis and decompilation.",
    github: "https://github.com/LaurieWired/GhidraMCP",
    install: "pip install ghidra-mcp",
    category: "security",
    language: "python",
    tags: ["security", "reverse-engineering"],
    stars: "7.2k",
  },
  {
    name: "Filesystem MCP",
    description: "Secure local file access. Read, write, and manage files with permissions.",
    github: "https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem",
    install: "npx @modelcontextprotocol/server-filesystem",
    category: "system",
    language: "typescript",
    tags: ["official", "files", "system"],
    stars: "26k",
  },
  {
    name: "Memory MCP",
    description: "Persistent memory for AI. Store and retrieve context across sessions.",
    github: "https://github.com/modelcontextprotocol/servers/tree/main/src/memory",
    install: "npx @modelcontextprotocol/server-memory",
    category: "system",
    language: "typescript",
    tags: ["official", "memory", "context"],
    stars: "26k",
  },
  {
    name: "Time MCP",
    description: "Time and timezone utilities. Current time, conversions, scheduling.",
    github: "https://github.com/modelcontextprotocol/servers/tree/main/src/time",
    install: "npx @modelcontextprotocol/server-time",
    category: "system",
    language: "typescript",
    tags: ["official", "utility"],
    stars: "26k",
  },
];

const categories = [
  { id: "all", label: "All", count: servers.length },
  { id: "dev-tools", label: "Dev Tools", count: servers.filter(s => s.category === "dev-tools").length },
  { id: "browser", label: "Browser", count: servers.filter(s => s.category === "browser").length },
  { id: "data", label: "Data", count: servers.filter(s => s.category === "data").length },
  { id: "productivity", label: "Productivity", count: servers.filter(s => s.category === "productivity").length },
  { id: "web", label: "Web", count: servers.filter(s => s.category === "web").length },
  { id: "cloud", label: "Cloud", count: servers.filter(s => s.category === "cloud").length },
  { id: "framework", label: "Framework", count: servers.filter(s => s.category === "framework").length },
  { id: "security", label: "Security", count: servers.filter(s => s.category === "security").length },
  { id: "system", label: "System", count: servers.filter(s => s.category === "system").length },
];

export default function MCPServersDirectory() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");

  const filteredServers = useMemo(() => {
    return servers.filter((server) => {
      const matchesSearch = search === "" || 
        server.name.toLowerCase().includes(search.toLowerCase()) ||
        server.description.toLowerCase().includes(search.toLowerCase()) ||
        server.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
      
      const matchesCategory = selectedCategory === "all" || server.category === selectedCategory;
      const matchesLanguage = selectedLanguage === "all" || server.language === selectedLanguage;
      
      return matchesSearch && matchesCategory && matchesLanguage;
    });
  }, [search, selectedCategory, selectedLanguage]);

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-neutral-100">
      {/* Nav */}
      <nav className="px-6 py-4 border-b border-neutral-800/50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight">kai</Link>
          <div className="flex gap-6 text-sm text-neutral-400">
            <Link href="/mcp" className="text-amber-500">mcp</Link>
            <Link href="/blog" className="hover:text-amber-500 transition-colors">blog</Link>
            <a href="https://github.com/kaigritun" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors">github</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-12 border-b border-neutral-800/50">
        <div className="max-w-5xl mx-auto">
          <Link href="/mcp" className="text-amber-500 font-mono text-sm mb-4 inline-block hover:underline">
            ← MCP Tutorials
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            MCP Server Directory
          </h1>
          <p className="text-neutral-400 max-w-2xl mb-6">
            Find Model Context Protocol servers for AI development. {servers.length} servers from official sources and the community.
          </p>
          
          {/* Search */}
          <div className="relative max-w-xl">
            <input
              type="text"
              placeholder="Search servers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="px-6 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Filters Row */}
          <div className="flex flex-wrap gap-4 mb-8 items-center">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.filter(c => c.count > 0 || c.id === "all").map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                      : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:border-neutral-700"
                  }`}
                >
                  {cat.label}
                  <span className="ml-1.5 text-xs opacity-60">{cat.count}</span>
                </button>
              ))}
            </div>

            {/* Language Filter */}
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-neutral-500">Language:</span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-sm text-neutral-300 focus:outline-none focus:border-amber-500/50"
              >
                <option value="all">All</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-sm text-neutral-500 mb-6">
            Showing {filteredServers.length} of {servers.length} servers
          </p>

          {/* Server Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {filteredServers.map((server) => (
              <div
                key={server.name}
                className="bg-neutral-900/50 border border-neutral-800/50 rounded-lg p-5 hover:border-neutral-700/50 transition-colors group"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-neutral-100 group-hover:text-amber-500 transition-colors">
                    {server.name}
                  </h3>
                  <span className="text-xs text-amber-500/70 font-mono shrink-0">
                    ⭐ {server.stars}
                  </span>
                </div>
                
                <p className="text-sm text-neutral-400 mb-4 line-clamp-2">
                  {server.description}
                </p>

                {/* Install Command */}
                <div className="bg-neutral-950 rounded px-3 py-2 mb-4 font-mono text-xs text-neutral-400 overflow-x-auto">
                  <span className="text-neutral-600">$</span> {server.install}
                </div>

                {/* Tags & Link */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      server.language === "typescript" 
                        ? "bg-blue-500/10 text-blue-400" 
                        : "bg-green-500/10 text-green-400"
                    }`}>
                      {server.language}
                    </span>
                    {server.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded text-xs bg-neutral-800 text-neutral-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={server.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-neutral-500 hover:text-amber-500 transition-colors shrink-0"
                  >
                    GitHub →
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredServers.length === 0 && (
            <div className="text-center py-16">
              <p className="text-neutral-500 mb-2">No servers found</p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("all");
                  setSelectedLanguage("all");
                }}
                className="text-amber-500 text-sm hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-12 border-t border-neutral-800/50 bg-neutral-900/20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-6">Build Your Own</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/mcp/how-to-build-mcp-server-python"
              className="block p-4 bg-neutral-900/50 border border-neutral-800/50 rounded-lg hover:border-amber-500/30 transition-colors"
            >
              <h3 className="font-semibold mb-1 text-neutral-100">Build MCP Server (Python)</h3>
              <p className="text-sm text-neutral-500">FastMCP framework from scratch</p>
            </Link>
            <Link
              href="/mcp/how-to-build-mcp-server-typescript"
              className="block p-4 bg-neutral-900/50 border border-neutral-800/50 rounded-lg hover:border-amber-500/30 transition-colors"
            >
              <h3 className="font-semibold mb-1 text-neutral-100">Build MCP Server (TypeScript)</h3>
              <p className="text-sm text-neutral-500">Official SDK with Zod schemas</p>
            </Link>
          </div>
        </div>
      </section>
        <EmailSignup />


      {/* Footer */}
      <footer className="px-6 py-8 border-t border-neutral-800/50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <p className="text-neutral-600 text-sm font-mono">© {new Date().getFullYear()}</p>
          <Link href="/mcp" className="text-sm text-neutral-500 hover:text-amber-500 transition-colors">
            ← back to tutorials
          </Link>
        </div>
      </footer>
    </div>
  );
}
