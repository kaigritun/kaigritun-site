import { Metadata } from 'next';
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: 'Claude Desktop MCP Setup Guide (2025) | Complete Configuration Tutorial',
  description: 'Step-by-step guide to setting up MCP servers with Claude Desktop. Learn configuration, troubleshooting, and best practices for the Anthropic desktop app.',
  keywords: ['Claude Desktop MCP', 'MCP setup', 'Claude Desktop configuration', 'MCP Claude', 'Anthropic MCP'],
  openGraph: {
    title: 'Claude Desktop MCP Setup Guide',
    description: 'Complete guide to configuring MCP servers with Claude Desktop application.',
    type: 'article',
  },
}

export default function ClaudeDesktopMCPSetup() {
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
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-sm font-medium rounded-full">
              Setup Guide
            </span>
            <span className="text-slate-400 text-sm">12 min read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Claude Desktop MCP Setup Guide
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed">
            Complete tutorial for configuring MCP servers with Anthropic&apos;s Claude Desktop 
            application. From first install to running multiple servers.
          </p>
        </header>

        {/* Table of Contents */}
        <nav className="mb-12 p-6 bg-slate-800/50 rounded-xl border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">In This Guide</h2>
          <ul className="space-y-2 text-slate-300">
            <li><a href="#prerequisites" className="hover:text-cyan-400 transition-colors">1. Prerequisites</a></li>
            <li><a href="#install-claude" className="hover:text-cyan-400 transition-colors">2. Installing Claude Desktop</a></li>
            <li><a href="#config-file" className="hover:text-cyan-400 transition-colors">3. Finding the Config File</a></li>
            <li><a href="#first-server" className="hover:text-cyan-400 transition-colors">4. Adding Your First MCP Server</a></li>
            <li><a href="#multiple-servers" className="hover:text-cyan-400 transition-colors">5. Running Multiple Servers</a></li>
            <li><a href="#verify" className="hover:text-cyan-400 transition-colors">6. Verifying Your Setup</a></li>
            <li><a href="#common-issues" className="hover:text-cyan-400 transition-colors">7. Common Issues & Fixes</a></li>
            <li><a href="#best-practices" className="hover:text-cyan-400 transition-colors">8. Best Practices</a></li>
          </ul>
        </nav>

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          
          {/* Prerequisites */}
          <section id="prerequisites" className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">1. Prerequisites</h2>
            <p className="text-slate-300 mb-4">
              Before setting up MCP with Claude Desktop, make sure you have:
            </p>
            <ul className="text-slate-300 space-y-2 mb-6">
              <li><strong>macOS or Windows</strong> — Claude Desktop is available for both platforms</li>
              <li><strong>A Claude account</strong> — Free or Pro, both work with MCP</li>
              <li><strong>Node.js or Python</strong> — Depending on which MCP servers you want to use</li>
              <li><strong>A text editor</strong> — VS Code, Sublime, or even Notepad works</li>
            </ul>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-300 text-sm">
                <strong>Tip:</strong> Most MCP servers are distributed via npm (Node.js) or pip (Python). 
                Install both runtimes for maximum flexibility.
              </p>
            </div>
          </section>

          {/* Install Claude Desktop */}
          <section id="install-claude" className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">2. Installing Claude Desktop</h2>
            <p className="text-slate-300 mb-4">
              Download Claude Desktop from Anthropic&apos;s official website:
            </p>
            <div className="bg-slate-800 rounded-lg p-4 mb-6">
              <code className="text-cyan-400">https://claude.ai/download</code>
            </div>
            <p className="text-slate-300 mb-4">
              After installation:
            </p>
            <ol className="text-slate-300 space-y-2 mb-6">
              <li>1. Open Claude Desktop</li>
              <li>2. Sign in with your Anthropic account</li>
              <li>3. Make sure the app is working (send a test message)</li>
              <li>4. Close the app before editing the config file</li>
            </ol>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
              <p className="text-amber-300 text-sm">
                <strong>Important:</strong> Always close Claude Desktop before editing the configuration. 
                Changes are loaded when the app starts.
              </p>
            </div>
          </section>

          {/* Config File Location */}
          <section id="config-file" className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">3. Finding the Config File</h2>
            <p className="text-slate-300 mb-4">
              Claude Desktop stores its MCP configuration in a JSON file. The location depends on your operating system:
            </p>
            
            <h3 className="text-xl font-semibold text-white mb-3">macOS</h3>
            <div className="bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto">
              <pre className="text-green-400 text-sm">
{`~/Library/Application Support/Claude/claude_desktop_config.json`}
              </pre>
            </div>
            <p className="text-slate-300 mb-6">
              Open in terminal:
            </p>
            <div className="bg-slate-800 rounded-lg p-4 mb-6 overflow-x-auto">
              <pre className="text-green-400 text-sm">
{`# Open in VS Code
code ~/Library/Application\\ Support/Claude/claude_desktop_config.json

# Or create if it doesn't exist
mkdir -p ~/Library/Application\\ Support/Claude
touch ~/Library/Application\\ Support/Claude/claude_desktop_config.json`}
              </pre>
            </div>

            <h3 className="text-xl font-semibold text-white mb-3">Windows</h3>
            <div className="bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto">
              <pre className="text-green-400 text-sm">
{`%APPDATA%\\Claude\\claude_desktop_config.json`}
              </pre>
            </div>
            <p className="text-slate-300 mb-4">
              Open in PowerShell:
            </p>
            <div className="bg-slate-800 rounded-lg p-4 mb-6 overflow-x-auto">
              <pre className="text-green-400 text-sm">
{`# Open in VS Code
code $env:APPDATA\\Claude\\claude_desktop_config.json

# Or open the folder in Explorer
explorer $env:APPDATA\\Claude`}
              </pre>
            </div>
          </section>

          {/* First Server */}
          <section id="first-server" className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">4. Adding Your First MCP Server</h2>
            <p className="text-slate-300 mb-4">
              Let&apos;s add the official filesystem server as your first MCP integration. 
              This gives Claude access to read and write files in specified directories.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3">Step 1: Install the Server</h3>
            <div className="bg-slate-800 rounded-lg p-4 mb-6 overflow-x-auto">
              <pre className="text-green-400 text-sm">
{`# Install globally (no need to run npm every time)
npm install -g @modelcontextprotocol/server-filesystem`}
              </pre>
            </div>

            <h3 className="text-xl font-semibold text-white mb-3">Step 2: Configure Claude Desktop</h3>
            <p className="text-slate-300 mb-4">
              Add this to your <code className="text-cyan-400">claude_desktop_config.json</code>:
            </p>
            <div className="bg-slate-800 rounded-lg p-4 mb-6 overflow-x-auto">
              <pre className="text-green-400 text-sm">
{`{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/yourname/Documents",
        "/Users/yourname/Projects"
      ]
    }
  }
}`}
              </pre>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
              <p className="text-blue-300 text-sm">
                <strong>Replace the paths</strong> with directories you want Claude to access. 
                Only give access to folders you&apos;re comfortable with Claude reading/writing.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-white mb-3">Step 3: Restart Claude Desktop</h3>
            <p className="text-slate-300 mb-4">
              Fully quit and reopen Claude Desktop. The MCP server will start automatically.
            </p>
          </section>

          {/* Multiple Servers */}
          <section id="multiple-servers" className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">5. Running Multiple Servers</h2>
            <p className="text-slate-300 mb-4">
              You can run multiple MCP servers simultaneously. Each gets its own entry in the config:
            </p>
            <div className="bg-slate-800 rounded-lg p-4 mb-6 overflow-x-auto">
              <pre className="text-green-400 text-sm">
{`{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/yourname/Projects"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://user:pass@localhost/mydb"
      }
    },
    "custom-python": {
      "command": "python",
      "args": ["/path/to/my_custom_server.py"]
    }
  }
}`}
              </pre>
            </div>

            <h3 className="text-xl font-semibold text-white mb-3">Popular MCP Servers</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <h4 className="font-semibold text-white mb-2">@modelcontextprotocol/server-github</h4>
                <p className="text-slate-400 text-sm">Manage repos, issues, PRs</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <h4 className="font-semibold text-white mb-2">@modelcontextprotocol/server-postgres</h4>
                <p className="text-slate-400 text-sm">Query PostgreSQL databases</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <h4 className="font-semibold text-white mb-2">@modelcontextprotocol/server-brave-search</h4>
                <p className="text-slate-400 text-sm">Web search capabilities</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <h4 className="font-semibold text-white mb-2">@anthropics/server-playwright</h4>
                <p className="text-slate-400 text-sm">Browser automation</p>
              </div>
            </div>
            <p className="text-slate-300">
              See our <a href="/mcp/best-mcp-servers-2025" className="text-cyan-400 hover:text-cyan-300">Best MCP Servers 2025</a> guide 
              for a complete list with installation instructions.
            </p>
          </section>

          {/* Verify Setup */}
          <section id="verify" className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">6. Verifying Your Setup</h2>
            <p className="text-slate-300 mb-4">
              After restarting Claude Desktop, verify your MCP servers are running:
            </p>

            <h3 className="text-xl font-semibold text-white mb-3">Check the Hammer Icon</h3>
            <p className="text-slate-300 mb-4">
              Look for a small hammer (🔨) icon in the bottom-left of the chat input. 
              Click it to see available tools from your MCP servers.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3">Test with a Query</h3>
            <p className="text-slate-300 mb-4">
              Ask Claude to use one of the tools:
            </p>
            <div className="bg-slate-800 rounded-lg p-4 mb-6">
              <p className="text-slate-300 italic">&quot;List the files in my Projects folder&quot;</p>
            </div>
            <p className="text-slate-300 mb-4">
              Claude should use the filesystem MCP server to list your files.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3">Check the Logs</h3>
            <p className="text-slate-300 mb-4">
              If something isn&apos;t working, check the logs:
            </p>
            <div className="bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto">
              <pre className="text-green-400 text-sm">
{`# macOS
tail -f ~/Library/Logs/Claude/mcp*.log

# Windows (PowerShell)
Get-Content $env:APPDATA\\Claude\\logs\\mcp*.log -Tail 50 -Wait`}
              </pre>
            </div>
          </section>

          {/* Common Issues */}
          <section id="common-issues" className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">7. Common Issues & Fixes</h2>

            <div className="space-y-6">
              <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-2">Tools not showing up</h3>
                <ul className="text-slate-300 space-y-1 text-sm">
                  <li>• Make sure you fully quit Claude Desktop (not just closed the window)</li>
                  <li>• Verify your JSON syntax is valid (use a JSON validator)</li>
                  <li>• Check that the command path is correct</li>
                  <li>• Look for errors in the MCP logs</li>
                </ul>
              </div>

              <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-2">&quot;spawn ENOENT&quot; error</h3>
                <ul className="text-slate-300 space-y-1 text-sm">
                  <li>• The command (npx, python, etc.) isn&apos;t in Claude Desktop&apos;s PATH</li>
                  <li>• Use full paths: <code className="text-cyan-400">/usr/local/bin/npx</code> instead of <code className="text-cyan-400">npx</code></li>
                  <li>• Find paths with: <code className="text-cyan-400">which npx</code> or <code className="text-cyan-400">which python</code></li>
                </ul>
              </div>

              <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-2">Environment variables not working</h3>
                <ul className="text-slate-300 space-y-1 text-sm">
                  <li>• Use the <code className="text-cyan-400">env</code> key in the server config</li>
                  <li>• Variables are per-server, not global</li>
                  <li>• Don&apos;t include spaces around the = sign</li>
                </ul>
              </div>

              <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-2">Server crashes on startup</h3>
                <ul className="text-slate-300 space-y-1 text-sm">
                  <li>• Test the command manually in terminal first</li>
                  <li>• Check if dependencies are installed</li>
                  <li>• Look for permission issues on accessed directories</li>
                </ul>
              </div>
            </div>

            <p className="text-slate-300 mt-6">
              For more detailed troubleshooting, see our <a href="/mcp/troubleshooting-mcp-servers" className="text-cyan-400 hover:text-cyan-300">MCP Troubleshooting Guide</a>.
            </p>
          </section>

          {/* Best Practices */}
          <section id="best-practices" className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">8. Best Practices</h2>

            <div className="space-y-4">
              <div className="flex gap-4">
                <span className="text-cyan-400 text-xl">🔒</span>
                <div>
                  <h3 className="font-semibold text-white">Limit file access</h3>
                  <p className="text-slate-300 text-sm">Only give servers access to directories they need. Avoid <code className="text-cyan-400">/</code> or home directory.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-cyan-400 text-xl">🔑</span>
                <div>
                  <h3 className="font-semibold text-white">Use environment variables for secrets</h3>
                  <p className="text-slate-300 text-sm">Never hardcode API keys in the config. Use the <code className="text-cyan-400">env</code> key.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-cyan-400 text-xl">📦</span>
                <div>
                  <h3 className="font-semibold text-white">Use npx for official servers</h3>
                  <p className="text-slate-300 text-sm"><code className="text-cyan-400">npx -y</code> always gets the latest version without manual updates.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-cyan-400 text-xl">📝</span>
                <div>
                  <h3 className="font-semibold text-white">Comment your config</h3>
                  <p className="text-slate-300 text-sm">JSON doesn&apos;t support comments, but you can add a <code className="text-cyan-400">_comment</code> key for documentation.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-cyan-400 text-xl">🧪</span>
                <div>
                  <h3 className="font-semibold text-white">Test new servers individually</h3>
                  <p className="text-slate-300 text-sm">Add one server at a time. Makes debugging easier.</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mt-16 p-8 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl border border-cyan-500/30">
            <h2 className="text-2xl font-bold text-white mb-4">Start Building</h2>
            <p className="text-slate-300 mb-6">
              Now that Claude Desktop is configured, it&apos;s time to build your own MCP servers 
              or explore what&apos;s available.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="/mcp/how-to-build-mcp-server-python"
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-lg transition-colors"
              >
                Build Your First Server (Python)
              </a>
              <a 
                href="/mcp/best-mcp-servers-2025"
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
              >
                Browse MCP Servers
              </a>
            </div>
          </section>

        </div>

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
