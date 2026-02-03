import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "15 Best MCP Servers in 2025 | Model Context Protocol",
  description:
    "Curated list of the best MCP servers for AI development: GitHub, Playwright, FastMCP, database tools, and more. Updated for 2025 with star counts and use cases.",
  keywords: [
    "best MCP servers",
    "MCP servers 2025",
    "Model Context Protocol servers",
    "MCP GitHub server",
    "FastMCP",
    "AI tool integration",
  ],
  openGraph: {
    title: "15 Best MCP Servers in 2025",
    description:
      "Curated list of the best MCP servers for AI development. GitHub, Playwright, databases, and more.",
    type: "article",
  },
};

export default function BestMCPServers2025() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="mb-12">
          <a
            href="/mcp"
            className="text-blue-400 hover:text-blue-300 text-sm mb-4 inline-block"
          >
            ← Back to MCP Tutorials
          </a>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            15 Best MCP Servers in 2025
          </h1>
          <p className="text-gray-400 text-lg">
            The most useful Model Context Protocol servers for AI development,
            ranked by GitHub stars and real-world utility.
          </p>
          <div className="mt-4 flex gap-4 text-sm text-gray-500">
            <span>📅 Updated: February 2025</span>
            <span>⏱️ 10 min read</span>
          </div>
        </header>

        <article className="prose prose-invert prose-lg max-w-none">
          <p className="text-xl text-gray-300 mb-8">
            MCP servers give AI models superpowers—access to GitHub, databases,
            browsers, and more. But with hundreds of servers available, which
            ones actually matter? I've ranked the 15 most useful MCP servers
            based on GitHub stars, active development, and real-world utility.
          </p>

          <div className="bg-gray-800/50 rounded-lg p-6 mb-8 border border-gray-700">
            <h3 className="text-lg font-semibold mb-3 text-white">
              Quick Jump
            </h3>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              <li>
                <a href="#official" className="text-blue-400 hover:underline">
                  Official Servers
                </a>
              </li>
              <li>
                <a href="#frameworks" className="text-blue-400 hover:underline">
                  Frameworks & Tools
                </a>
              </li>
              <li>
                <a href="#databases" className="text-blue-400 hover:underline">
                  Database Servers
                </a>
              </li>
              <li>
                <a href="#dev-tools" className="text-blue-400 hover:underline">
                  Developer Tools
                </a>
              </li>
              <li>
                <a
                  href="#specialized"
                  className="text-blue-400 hover:underline"
                >
                  Specialized Servers
                </a>
              </li>
              <li>
                <a
                  href="#get-started"
                  className="text-blue-400 hover:underline"
                >
                  Getting Started
                </a>
              </li>
            </ul>
          </div>

          {/* Official Servers */}
          <h2
            id="official"
            className="text-2xl font-bold mt-12 mb-6 text-white"
          >
            🎖️ Official MCP Servers
          </h2>
          <p className="text-gray-300 mb-6">
            These are maintained by major companies and provide production-ready
            integrations.
          </p>

          <div className="space-y-6">
            {/* GitHub */}
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-white">
                  1. GitHub MCP Server
                </h3>
                <span className="text-yellow-400 text-sm">⭐ 26,600</span>
              </div>
              <p className="text-gray-400 text-sm mb-2">
                github/github-mcp-server
              </p>
              <p className="text-gray-300 mb-4">
                GitHub's official MCP server. Access repositories, issues, PRs,
                code search, and more directly from your AI assistant. Essential
                for any developer workflow.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-sm">
                  Official
                </span>
                <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-sm">
                  Production Ready
                </span>
                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-sm">
                  TypeScript
                </span>
              </div>
              <a
                href="https://github.com/github/github-mcp-server"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline text-sm mt-3 inline-block"
              >
                View on GitHub →
              </a>
            </div>

            {/* Playwright */}
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-white">
                  2. Playwright MCP Server
                </h3>
                <span className="text-yellow-400 text-sm">⭐ 26,625</span>
              </div>
              <p className="text-gray-400 text-sm mb-2">
                microsoft/playwright-mcp
              </p>
              <p className="text-gray-300 mb-4">
                Microsoft's browser automation server. Let AI control browsers,
                take screenshots, fill forms, and navigate web pages. Perfect
                for web scraping and testing automation.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-sm">
                  Official
                </span>
                <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-sm">
                  Browser Automation
                </span>
                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-sm">
                  TypeScript
                </span>
              </div>
              <a
                href="https://github.com/microsoft/playwright-mcp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline text-sm mt-3 inline-block"
              >
                View on GitHub →
              </a>
            </div>

            {/* AWS */}
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-white">
                  3. AWS MCP Servers
                </h3>
                <span className="text-yellow-400 text-sm">⭐ 8,035</span>
              </div>
              <p className="text-gray-400 text-sm mb-2">awslabs/mcp</p>
              <p className="text-gray-300 mb-4">
                Official AWS MCP servers for cloud infrastructure. Manage EC2,
                S3, Lambda, and other AWS services through AI. Great for DevOps
                and cloud automation.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-sm">
                  Official
                </span>
                <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-sm">
                  Cloud
                </span>
                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-sm">
                  Python
                </span>
              </div>
              <a
                href="https://github.com/awslabs/mcp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline text-sm mt-3 inline-block"
              >
                View on GitHub →
              </a>
            </div>
          </div>

          {/* Frameworks */}
          <h2
            id="frameworks"
            className="text-2xl font-bold mt-12 mb-6 text-white"
          >
            🛠️ Frameworks & Meta-Tools
          </h2>
          <p className="text-gray-300 mb-6">
            Tools to build, test, and manage MCP servers.
          </p>

          <div className="space-y-6">
            {/* Context7 */}
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-white">
                  4. Context7
                </h3>
                <span className="text-yellow-400 text-sm">⭐ 44,561</span>
              </div>
              <p className="text-gray-400 text-sm mb-2">upstash/context7</p>
              <p className="text-gray-300 mb-4">
                The highest-starred MCP server. Provides up-to-date code
                documentation for LLMs. Query any library's docs directly in
                your AI assistant—no more hallucinated APIs.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-sm">
                  Most Starred
                </span>
                <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-sm">
                  Documentation
                </span>
              </div>
              <a
                href="https://github.com/upstash/context7"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline text-sm mt-3 inline-block"
              >
                View on GitHub →
              </a>
            </div>

            {/* FastMCP */}
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-white">5. FastMCP</h3>
                <span className="text-yellow-400 text-sm">⭐ 22,543</span>
              </div>
              <p className="text-gray-400 text-sm mb-2">jlowin/fastmcp</p>
              <p className="text-gray-300 mb-4">
                The fastest way to build MCP servers in Python. Simple
                decorators, automatic type validation, built-in testing. If
                you're building custom servers, start here.
              </p>
              <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm mb-4">
                <code className="text-green-400">{`from fastmcp import FastMCP
mcp = FastMCP("My Server")

@mcp.tool()
def hello(name: str) -> str:
    return f"Hello, {name}!"`}</code>
              </pre>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-sm">
                  Framework
                </span>
                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-sm">
                  Python
                </span>
              </div>
              <a
                href="https://github.com/jlowin/fastmcp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline text-sm mt-3 inline-block"
              >
                View on GitHub →
              </a>
            </div>

            {/* MCP Inspector */}
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-white">
                  6. MCP Inspector
                </h3>
                <span className="text-yellow-400 text-sm">⭐ 8,522</span>
              </div>
              <p className="text-gray-400 text-sm mb-2">
                modelcontextprotocol/inspector
              </p>
              <p className="text-gray-300 mb-4">
                Official visual testing tool for MCP servers. Debug tool calls,
                inspect responses, test your server before deploying. Essential
                for development.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-sm">
                  Official
                </span>
                <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-sm">
                  Debugging
                </span>
              </div>
              <a
                href="https://github.com/modelcontextprotocol/inspector"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline text-sm mt-3 inline-block"
              >
                View on GitHub →
              </a>
            </div>
          </div>

          {/* Database Servers */}
          <h2
            id="databases"
            className="text-2xl font-bold mt-12 mb-6 text-white"
          >
            🗄️ Database Servers
          </h2>
          <p className="text-gray-300 mb-6">
            Connect AI to your data sources with these database integrations.
          </p>

          <div className="space-y-6">
            {/* MindsDB */}
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-white">7. MindsDB</h3>
                <span className="text-yellow-400 text-sm">⭐ 38,382</span>
              </div>
              <p className="text-gray-400 text-sm mb-2">mindsdb/mindsdb</p>
              <p className="text-gray-300 mb-4">
                Federated query engine for AI. Connect to 100+ data sources
                (PostgreSQL, MySQL, MongoDB, Snowflake, etc.) through a single
                MCP server. Query anything with natural language.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-sm">
                  Multi-Database
                </span>
                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-sm">
                  Python
                </span>
              </div>
              <a
                href="https://github.com/mindsdb/mindsdb"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline text-sm mt-3 inline-block"
              >
                View on GitHub →
              </a>
            </div>

            {/* Google GenAI Toolbox */}
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-white">
                  8. Google GenAI Toolbox
                </h3>
                <span className="text-yellow-400 text-sm">⭐ 12,704</span>
              </div>
              <p className="text-gray-400 text-sm mb-2">
                googleapis/genai-toolbox
              </p>
              <p className="text-gray-300 mb-4">
                Google's MCP server for databases. Supports AlloyDB, Cloud SQL,
                Spanner, and more. Built-in connection pooling, authentication,
                and security.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-sm">
                  Official
                </span>
                <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-sm">
                  GCP
                </span>
              </div>
              <a
                href="https://github.com/googleapis/genai-toolbox"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline text-sm mt-3 inline-block"
              >
                View on GitHub →
              </a>
            </div>
          </div>

          {/* Developer Tools */}
          <h2
            id="dev-tools"
            className="text-2xl font-bold mt-12 mb-6 text-white"
          >
            👨‍💻 Developer Tools
          </h2>
          <p className="text-gray-300 mb-6">
            MCP servers that enhance developer workflows.
          </p>

          <div className="space-y-6">
            {/* Figma */}
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-white">
                  9. Figma Context MCP
                </h3>
                <span className="text-yellow-400 text-sm">⭐ 12,958</span>
              </div>
              <p className="text-gray-400 text-sm mb-2">
                GLips/Figma-Context-MCP
              </p>
              <p className="text-gray-300 mb-4">
                Extract Figma designs for AI coding agents. Cursor, Claude, and
                others can understand your designs and generate accurate code.
                Huge time-saver for design-to-code workflows.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-pink-500/20 text-pink-300 rounded text-sm">
                  Design
                </span>
                <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-sm">
                  Cursor Compatible
                </span>
              </div>
              <a
                href="https://github.com/GLips/Figma-Context-MCP"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline text-sm mt-3 inline-block"
              >
                View on GitHub →
              </a>
            </div>

            {/* Git MCP */}
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-white">
                  10. GitMCP
                </h3>
                <span className="text-yellow-400 text-sm">⭐ 7,513</span>
              </div>
              <p className="text-gray-400 text-sm mb-2">idosal/git-mcp</p>
              <p className="text-gray-300 mb-4">
                Free, open-source remote MCP server for any GitHub project.
                Access documentation, code, and context without hallucinations.
                No setup required—just point to any repo.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-sm">
                  Free
                </span>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-sm">
                  Remote
                </span>
              </div>
              <a
                href="https://github.com/idosal/git-mcp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline text-sm mt-3 inline-block"
              >
                View on GitHub →
              </a>
            </div>

            {/* Serena */}
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-white">11. Serena</h3>
                <span className="text-yellow-400 text-sm">⭐ 19,638</span>
              </div>
              <p className="text-gray-400 text-sm mb-2">oraios/serena</p>
              <p className="text-gray-300 mb-4">
                Powerful coding agent toolkit with semantic retrieval and
                editing. Understands codebases at a deep level, finds relevant
                code, and makes precise edits.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-sm">
                  Coding Agent
                </span>
                <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-sm">
                  Semantic Search
                </span>
              </div>
              <a
                href="https://github.com/oraios/serena"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline text-sm mt-3 inline-block"
              >
                View on GitHub →
              </a>
            </div>

            {/* PAL */}
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-white">
                  12. PAL MCP Server
                </h3>
                <span className="text-yellow-400 text-sm">⭐ 10,997</span>
              </div>
              <p className="text-gray-400 text-sm mb-2">
                BeehiveInnovations/pal-mcp-server
              </p>
              <p className="text-gray-300 mb-4">
                Universal AI model bridge. Use Claude Code, Gemini CLI, Codex
                CLI with any model—GPT-4, Gemini, OpenRouter, Ollama, and more.
                All models working as one.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-sm">
                  Multi-Model
                </span>
                <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-sm">
                  Coding Agents
                </span>
              </div>
              <a
                href="https://github.com/BeehiveInnovations/pal-mcp-server"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline text-sm mt-3 inline-block"
              >
                View on GitHub →
              </a>
            </div>
          </div>

          {/* Specialized */}
          <h2
            id="specialized"
            className="text-2xl font-bold mt-12 mb-6 text-white"
          >
            🔬 Specialized Servers
          </h2>
          <p className="text-gray-300 mb-6">
            Domain-specific MCP servers for unique use cases.
          </p>

          <div className="space-y-6">
            {/* Chrome MCP */}
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-white">
                  13. Chrome MCP
                </h3>
                <span className="text-yellow-400 text-sm">⭐ 10,244</span>
              </div>
              <p className="text-gray-400 text-sm mb-2">hangwin/mcp-chrome</p>
              <p className="text-gray-300 mb-4">
                Chrome extension-based MCP server. Control your actual browser—
                navigate, click, fill forms, extract content. Great for
                automation that needs real browser context.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-sm">
                  Browser
                </span>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-sm">
                  Extension
                </span>
              </div>
              <a
                href="https://github.com/hangwin/mcp-chrome"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline text-sm mt-3 inline-block"
              >
                View on GitHub →
              </a>
            </div>

            {/* GhidraMCP */}
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-white">
                  14. GhidraMCP
                </h3>
                <span className="text-yellow-400 text-sm">⭐ 7,221</span>
              </div>
              <p className="text-gray-400 text-sm mb-2">
                LaurieWired/GhidraMCP
              </p>
              <p className="text-gray-300 mb-4">
                MCP server for Ghidra reverse engineering. Let AI analyze
                binaries, decompile code, and understand assembly. Essential for
                security researchers.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-sm">
                  Security
                </span>
                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-sm">
                  Reverse Engineering
                </span>
              </div>
              <a
                href="https://github.com/LaurieWired/GhidraMCP"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline text-sm mt-3 inline-block"
              >
                View on GitHub →
              </a>
            </div>

            {/* HexStrike */}
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-white">
                  15. HexStrike AI
                </h3>
                <span className="text-yellow-400 text-sm">⭐ 6,581</span>
              </div>
              <p className="text-gray-400 text-sm mb-2">0x4m4/hexstrike-ai</p>
              <p className="text-gray-300 mb-4">
                Cybersecurity MCP server with 150+ tools. Automated pentesting,
                vulnerability discovery, bug bounty automation. For security
                professionals only.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-sm">
                  Security
                </span>
                <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-sm">
                  Pentesting
                </span>
              </div>
              <a
                href="https://github.com/0x4m4/hexstrike-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline text-sm mt-3 inline-block"
              >
                View on GitHub →
              </a>
            </div>
          </div>

          {/* Honorable Mentions */}
          <h2 className="text-2xl font-bold mt-12 mb-6 text-white">
            📋 Honorable Mentions
          </h2>
          <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
            <ul className="space-y-2 text-gray-300">
              <li>
                <strong>mcp-use</strong> (9,038 ⭐) — Easiest way to interact
                with MCP servers using custom agents
              </li>
              <li>
                <strong>Activepieces</strong> (20,655 ⭐) — 400+ MCP servers for
                workflow automation
              </li>
              <li>
                <strong>MCP Registry</strong> (6,355 ⭐) — Official community
                registry for discovering servers
              </li>
              <li>
                <strong>Awesome MCP Servers</strong> (80,234 ⭐) — Curated list
                of all MCP servers
              </li>
            </ul>
          </div>

          {/* Getting Started */}
          <h2
            id="get-started"
            className="text-2xl font-bold mt-12 mb-6 text-white"
          >
            🚀 Getting Started
          </h2>
          <p className="text-gray-300 mb-4">
            Ready to use these servers? Here's how to get started:
          </p>

          <div className="space-y-4">
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
              <h4 className="font-semibold text-white mb-2">
                1. Install an MCP Client
              </h4>
              <p className="text-gray-400 text-sm">
                Claude Desktop, Cursor, VS Code with Continue, or any MCP-compatible
                client.
              </p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
              <h4 className="font-semibold text-white mb-2">
                2. Configure Servers
              </h4>
              <p className="text-gray-400 text-sm">
                Add servers to your client's config file (usually
                claude_desktop_config.json).
              </p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
              <h4 className="font-semibold text-white mb-2">
                3. Start Building
              </h4>
              <p className="text-gray-400 text-sm">
                Learn to build your own servers with{" "}
                <a
                  href="/mcp/how-to-build-mcp-server-python"
                  className="text-blue-400 hover:underline"
                >
                  our Python tutorial
                </a>
                .
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-6 mt-12 border border-blue-500/30">
            <h3 className="text-xl font-semibold mb-2 text-white">
              Learn More About MCP
            </h3>
            <p className="text-gray-300 mb-4">
              Check out our other tutorials to master MCP development:
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/mcp/how-to-build-mcp-server-python"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm transition"
              >
                Build an MCP Server →
              </a>
              <a
                href="/mcp/mcp-vs-function-calling"
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm transition"
              >
                MCP vs Function Calling →
              </a>
            </div>
          </div>
        </article>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            Star counts as of February 2025. Have a server to suggest?{" "}
            <a
              href="https://github.com/kaigritun"
              className="text-blue-400 hover:underline"
            >
              Let me know
            </a>
            .
          </p>
        </footer>
      </div>
    </main>
  );
}
