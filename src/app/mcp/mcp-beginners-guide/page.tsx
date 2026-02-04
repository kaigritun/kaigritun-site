import { Metadata } from 'next';
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: 'MCP for Beginners: Complete Guide to Model Context Protocol (2025)',
  description: 'Learn MCP from scratch. Build your first MCP server in 5 minutes with Python. Understand tools, resources, and prompts with working code examples.',
  keywords: ['MCP beginners guide', 'what is MCP', 'Model Context Protocol tutorial', 'MCP introduction', 'learn MCP', 'MCP basics'],
  openGraph: {
    title: 'MCP for Beginners: Complete Guide to Model Context Protocol',
    description: 'Learn MCP from scratch. Build your first server in 5 minutes with working code examples.',
    type: 'article',
  },
}

export default function MCPBeginnersGuide() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <article className="max-w-4xl mx-auto px-6 py-16">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <a href="/mcp" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            ← Back to MCP Tutorials
          </a>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-medium rounded-full">
              Beginner
            </span>
            <span className="text-slate-400 text-sm">10 min read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            MCP for Beginners: Complete Guide to Model Context Protocol
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed">
            Everything you need to understand MCP and build your first server. 
            From zero to working code in 5 minutes.
          </p>
        </header>

        {/* Table of Contents */}
        <nav className="mb-12 p-6 bg-slate-800/50 rounded-xl border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">In This Guide</h2>
          <ul className="space-y-2 text-slate-300">
            <li><a href="#what-is-mcp" className="hover:text-cyan-400 transition-colors">1. What is MCP?</a></li>
            <li><a href="#why-mcp" className="hover:text-cyan-400 transition-colors">2. Why MCP Matters</a></li>
            <li><a href="#core-concepts" className="hover:text-cyan-400 transition-colors">3. Core Concepts</a></li>
            <li><a href="#first-server" className="hover:text-cyan-400 transition-colors">4. Your First MCP Server (5 Minutes)</a></li>
            <li><a href="#useful-server" className="hover:text-cyan-400 transition-colors">5. Building Something Useful</a></li>
            <li><a href="#real-services" className="hover:text-cyan-400 transition-colors">6. Connecting to Real Services</a></li>
            <li><a href="#security" className="hover:text-cyan-400 transition-colors">7. Security Basics</a></li>
            <li><a href="#where-to-use" className="hover:text-cyan-400 transition-colors">8. Where to Use MCP</a></li>
            <li><a href="#next-steps" className="hover:text-cyan-400 transition-colors">9. Next Steps</a></li>
          </ul>
        </nav>

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          
          {/* What is MCP */}
          <section id="what-is-mcp" className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">1. What is MCP?</h2>
            <p className="text-slate-300 mb-4">
              Model Context Protocol (MCP) is an open standard that connects AI models to external tools and data. 
              Think of it like <strong className="text-white">USB for AI</strong>—a universal interface that lets any AI model plug into any service.
            </p>
            <p className="text-slate-300 mb-4">
              Before MCP, connecting Claude (or any AI) to your database, APIs, or files required custom code for each integration. 
              MCP changes that. Build one server, and it works with Claude Desktop, Cursor IDE, Cline, and any other MCP-compatible client.
            </p>
          </section>

          {/* Why MCP Matters */}
          <section id="why-mcp" className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">2. Why MCP Matters</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <h3 className="font-semibold text-red-300 mb-2">The Old Way</h3>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• Custom integration for each AI provider</li>
                  <li>• Different APIs, different auth, different patterns</li>
                  <li>• Maintain separate code for each connection</li>
                </ul>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <h3 className="font-semibold text-green-300 mb-2">The MCP Way</h3>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• One standard interface</li>
                  <li>• Build once, works everywhere</li>
                  <li>• Community of shared servers</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-300 text-sm">
                <strong>Real example:</strong> Instead of building a custom &quot;search my Notion&quot; feature for Claude, 
                you install an MCP server that already does it. Takes 2 minutes instead of 2 days.
              </p>
            </div>
          </section>

          {/* Core Concepts */}
          <section id="core-concepts" className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">3. Core Concepts</h2>
            <p className="text-slate-300 mb-6">MCP has three building blocks:</p>

            <div className="space-y-6">
              <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <h3 className="text-xl font-semibold text-cyan-400 mb-3">1. Tools</h3>
                <p className="text-slate-300 mb-4">
                  Functions the AI can call. Like &quot;search_files&quot;, &quot;send_email&quot;, or &quot;query_database&quot;. 
                  You define what they do, the AI decides when to use them.
                </p>
                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm">
{`@mcp.tool()
def search_notes(query: str) -> str:
    """Search your notes for relevant content."""
    # Your search logic here
    return results`}
                  </pre>
                </div>
              </div>

              <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <h3 className="text-xl font-semibold text-cyan-400 mb-3">2. Resources</h3>
                <p className="text-slate-300 mb-4">
                  Data the AI can read. Documents, configurations, database records. 
                  Unlike tools, resources are passively available—the AI can reference them without explicitly calling anything.
                </p>
                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm">
{`@mcp.resource("notes://recent")
def get_recent_notes() -> str:
    """Last 10 notes you created."""
    return format_notes(get_latest(10))`}
                  </pre>
                </div>
              </div>

              <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <h3 className="text-xl font-semibold text-cyan-400 mb-3">3. Prompts</h3>
                <p className="text-slate-300 mb-4">
                  Reusable prompt templates. Useful for complex workflows you run repeatedly.
                </p>
                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm">
{`@mcp.prompt()
def code_review(code: str) -> str:
    """Standard code review template."""
    return f"Review this code for bugs, security issues, and style:\\n\\n{code}"`}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* First Server */}
          <section id="first-server" className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">4. Your First MCP Server (5 Minutes)</h2>
            <p className="text-slate-300 mb-6">
              Let&apos;s build a working server. We&apos;ll use Python with FastMCP—the easiest way to get started.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3">Step 1: Install FastMCP</h3>
            <div className="bg-slate-800 rounded-lg p-4 mb-6 overflow-x-auto">
              <pre className="text-green-400 text-sm">pip install fastmcp</pre>
            </div>

            <h3 className="text-xl font-semibold text-white mb-3">Step 2: Create server.py</h3>
            <div className="bg-slate-800 rounded-lg p-4 mb-6 overflow-x-auto">
              <pre className="text-green-400 text-sm">
{`from fastmcp import FastMCP

mcp = FastMCP("my-first-server")

@mcp.tool()
def add_numbers(a: int, b: int) -> int:
    """Add two numbers together."""
    return a + b

@mcp.tool()
def greet(name: str) -> str:
    """Generate a greeting."""
    return f"Hello, {name}! Welcome to MCP."

if __name__ == "__main__":
    mcp.run()`}
              </pre>
            </div>

            <h3 className="text-xl font-semibold text-white mb-3">Step 3: Test It</h3>
            <div className="bg-slate-800 rounded-lg p-4 mb-6 overflow-x-auto">
              <pre className="text-green-400 text-sm">python server.py</pre>
            </div>
            <p className="text-slate-300 mb-6">Your server is running. Now let&apos;s connect it to Claude.</p>

            <h3 className="text-xl font-semibold text-white mb-3">Step 4: Connect to Claude Desktop</h3>
            <p className="text-slate-300 mb-4">
              Add to your Claude Desktop config (<code className="text-cyan-400">~/Library/Application Support/Claude/claude_desktop_config.json</code>):
            </p>
            <div className="bg-slate-800 rounded-lg p-4 mb-6 overflow-x-auto">
              <pre className="text-green-400 text-sm">
{`{
  "mcpServers": {
    "my-first-server": {
      "command": "python",
      "args": ["/path/to/server.py"]
    }
  }
}`}
              </pre>
            </div>
            <p className="text-slate-300 mb-4">
              Restart Claude Desktop. Ask Claude to &quot;add 5 and 3&quot;—it will use your tool.
            </p>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
              <p className="text-amber-300 text-sm">
                <strong>Need detailed setup help?</strong> See our <a href="/mcp/claude-desktop-mcp-setup" className="text-cyan-400 hover:text-cyan-300">Claude Desktop MCP Setup Guide</a>.
              </p>
            </div>
          </section>

          {/* Building Something Useful */}
          <section id="useful-server" className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">5. Building Something Useful</h2>
            <p className="text-slate-300 mb-4">
              The hello-world is nice, but let&apos;s build something you&apos;d actually use: a note-taking server.
            </p>
            <div className="bg-slate-800 rounded-lg p-4 mb-6 overflow-x-auto">
              <pre className="text-green-400 text-sm">
{`from fastmcp import FastMCP
from pathlib import Path
from datetime import datetime

mcp = FastMCP("notes")
NOTES_DIR = Path.home() / "notes"
NOTES_DIR.mkdir(exist_ok=True)

@mcp.tool()
def create_note(title: str, content: str) -> str:
    """Create a new note with title and content."""
    filename = f"{datetime.now():%Y%m%d_%H%M}_{title.lower().replace(' ', '_')}.md"
    filepath = NOTES_DIR / filename
    filepath.write_text(f"# {title}\\n\\n{content}")
    return f"Created: {filename}"

@mcp.tool()
def search_notes(query: str) -> str:
    """Search all notes for a query string."""
    results = []
    for note in NOTES_DIR.glob("*.md"):
        content = note.read_text()
        if query.lower() in content.lower():
            results.append(f"**{note.name}**\\n{content[:200]}...")
    return "\\n\\n".join(results) if results else "No matching notes found."

@mcp.tool()
def list_notes() -> str:
    """List all notes."""
    notes = list(NOTES_DIR.glob("*.md"))
    return "\\n".join(n.name for n in sorted(notes, reverse=True)[:20])

if __name__ == "__main__":
    mcp.run()`}
              </pre>
            </div>
            <p className="text-slate-300">
              Now Claude can create, search, and list your notes. This took 30 lines of code.
            </p>
          </section>

          {/* Connecting to Real Services */}
          <section id="real-services" className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">6. Connecting to Real Services</h2>
            <p className="text-slate-300 mb-4">
              MCP shines when connecting to external APIs. Here&apos;s a pattern for API integrations:
            </p>
            <div className="bg-slate-800 rounded-lg p-4 mb-6 overflow-x-auto">
              <pre className="text-green-400 text-sm">
{`import httpx
from fastmcp import FastMCP

mcp = FastMCP("weather")

@mcp.tool()
def get_weather(city: str) -> str:
    """Get current weather for a city."""
    # Using wttr.in—free, no API key needed
    response = httpx.get(f"https://wttr.in/{city}?format=3")
    return response.text

@mcp.tool()
def get_forecast(city: str) -> str:
    """Get 3-day forecast for a city."""
    response = httpx.get(f"https://wttr.in/{city}?format=%l:+%c+%t+%w")
    return response.text`}
              </pre>
            </div>
            <p className="text-slate-300">
              The same pattern works for any API: Notion, Slack, GitHub, your own services.
            </p>
          </section>

          {/* Security Basics */}
          <section id="security" className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">7. Security Basics</h2>
            <p className="text-slate-300 mb-4">
              MCP servers run on your machine with your permissions. Be careful:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <h3 className="font-semibold text-green-300 mb-2">Do:</h3>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• Validate all inputs</li>
                  <li>• Use environment variables for API keys</li>
                  <li>• Limit file access to specific directories</li>
                  <li>• Log what your server does</li>
                </ul>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <h3 className="font-semibold text-red-300 mb-2">Don&apos;t:</h3>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• Expose raw database queries</li>
                  <li>• Allow arbitrary file access</li>
                  <li>• Hard-code credentials</li>
                  <li>• Trust AI-generated paths without validation</li>
                </ul>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-white mb-3">Example: Input Validation</h3>
            <div className="bg-slate-800 rounded-lg p-4 overflow-x-auto">
              <pre className="text-green-400 text-sm">
{`@mcp.tool()
def read_file(filename: str) -> str:
    """Read a file from the allowed directory."""
    # Prevent path traversal
    safe_path = (ALLOWED_DIR / filename).resolve()
    if not safe_path.is_relative_to(ALLOWED_DIR):
        raise ValueError("Access denied: path outside allowed directory")
    return safe_path.read_text()`}
              </pre>
            </div>
          </section>

          {/* Where to Use MCP */}
          <section id="where-to-use" className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">8. Where to Use MCP</h2>
            <p className="text-slate-300 mb-4">MCP works with multiple clients:</p>
            
            <div className="bg-slate-800 rounded-lg overflow-hidden mb-4">
              <div className="grid grid-cols-2 gap-px bg-slate-700">
                <div className="bg-slate-800 p-3 font-semibold text-white">Client</div>
                <div className="bg-slate-800 p-3 font-semibold text-white">Use Case</div>
                <div className="bg-slate-800/80 p-3 text-slate-300">Claude Desktop</div>
                <div className="bg-slate-800/80 p-3 text-slate-400">General AI assistant with tools</div>
                <div className="bg-slate-800 p-3 text-slate-300">Cursor IDE</div>
                <div className="bg-slate-800 p-3 text-slate-400">Code editing with context</div>
                <div className="bg-slate-800/80 p-3 text-slate-300">Cline</div>
                <div className="bg-slate-800/80 p-3 text-slate-400">VS Code AI coding</div>
                <div className="bg-slate-800 p-3 text-slate-300">Windsurf</div>
                <div className="bg-slate-800 p-3 text-slate-400">IDE-integrated AI</div>
                <div className="bg-slate-800/80 p-3 text-slate-300">Custom apps</div>
                <div className="bg-slate-800/80 p-3 text-slate-400">Your own MCP client</div>
              </div>
            </div>
            
            <p className="text-slate-300">
              Same server, different contexts. Build once, use everywhere. Learn more about IDE setup in our{' '}
              <a href="/mcp/mcp-cursor-ide-setup" className="text-cyan-400 hover:text-cyan-300">MCP with Cursor & IDEs</a> guide.
            </p>
          </section>

          {/* Next Steps */}
          <section id="next-steps" className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">9. Next Steps</h2>
            <p className="text-slate-300 mb-6">You&apos;ve got the basics. Here&apos;s where to go next:</p>

            <div className="space-y-4 mb-8">
              <a href="/mcp/servers" className="block bg-slate-800/50 p-4 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-colors">
                <h3 className="font-semibold text-white mb-1">1. Browse existing servers</h3>
                <p className="text-slate-400 text-sm">Don&apos;t reinvent the wheel. Check the MCP Server Directory for pre-built integrations.</p>
              </a>
              
              <a href="/mcp/how-to-build-mcp-server-typescript" className="block bg-slate-800/50 p-4 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-colors">
                <h3 className="font-semibold text-white mb-1">2. Learn TypeScript</h3>
                <p className="text-slate-400 text-sm">For production servers, TypeScript with the official SDK offers better type safety.</p>
              </a>
              
              <a href="/mcp/mcp-error-handling" className="block bg-slate-800/50 p-4 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-colors">
                <h3 className="font-semibold text-white mb-1">3. Handle errors properly</h3>
                <p className="text-slate-400 text-sm">Production servers need robust error handling. Learn the patterns.</p>
              </a>
              
              <a href="/mcp/mcp-authentication-guide" className="block bg-slate-800/50 p-4 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-colors">
                <h3 className="font-semibold text-white mb-1">4. Add authentication</h3>
                <p className="text-slate-400 text-sm">For sensitive data, add auth. API keys, OAuth, secrets management.</p>
              </a>
              
              <a href="/mcp/testing-mcp-servers" className="block bg-slate-800/50 p-4 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-colors">
                <h3 className="font-semibold text-white mb-1">5. Test your servers</h3>
                <p className="text-slate-400 text-sm">Before shipping, test thoroughly with MCP Inspector and unit tests.</p>
              </a>
            </div>

            <h3 className="text-xl font-semibold text-white mb-4">Common Mistakes to Avoid</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="text-red-400">✗</span>
                <p className="text-slate-300"><strong className="text-white">Starting too complex</strong> — Begin with a single tool. Add more once that works.</p>
              </div>
              <div className="flex gap-3">
                <span className="text-red-400">✗</span>
                <p className="text-slate-300"><strong className="text-white">Ignoring error messages</strong> — When Claude says &quot;failed to connect,&quot; check your server logs first.</p>
              </div>
              <div className="flex gap-3">
                <span className="text-red-400">✗</span>
                <p className="text-slate-300"><strong className="text-white">Skipping validation</strong> — Every input from the AI should be validated. Trust nothing.</p>
              </div>
              <div className="flex gap-3">
                <span className="text-red-400">✗</span>
                <p className="text-slate-300"><strong className="text-white">Forgetting the restart</strong> — Claude Desktop needs a restart after config changes. Every time.</p>
              </div>
            </div>
          </section>

          {/* Summary */}
          <section className="mb-12 p-6 bg-slate-800/50 rounded-xl border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Summary</h2>
            <p className="text-slate-300 mb-4">
              MCP is the standard way to give AI models access to tools and data. The core concepts:
            </p>
            <ul className="text-slate-300 space-y-2 mb-4">
              <li><strong className="text-cyan-400">Tools</strong> = functions the AI can call</li>
              <li><strong className="text-cyan-400">Resources</strong> = data the AI can read</li>
              <li><strong className="text-cyan-400">Prompts</strong> = reusable templates</li>
            </ul>
            <p className="text-slate-300">
              Start with FastMCP for Python, build a simple tool, connect to Claude Desktop. 
              Once that works, gradually add complexity. The best MCP servers do one thing well. 
              Start small, ship fast, iterate.
            </p>
          </section>

          {/* CTA */}
          <section className="mt-16 p-8 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl border border-cyan-500/30">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Build?</h2>
            <p className="text-slate-300 mb-6">
              You understand the basics. Now it&apos;s time to build something real.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="/mcp/how-to-build-mcp-server-python"
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-lg transition-colors"
              >
                Full Python Tutorial
              </a>
              <a 
                href="/mcp/claude-desktop-mcp-setup"
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
              >
                Claude Desktop Setup
              </a>
            </div>
          </section>

        </div>
        <EmailSignup />


        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-700">
          <p className="text-slate-400 text-sm">
            Last updated: February 2025 · Written by Kai Gritun
          </p>
        </footer>
      </article>
    </main>
  )
}
