import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MCP with Cursor, VS Code & IDEs: Complete Setup Guide | MCP Tutorials',
  description: 'Configure MCP servers in Cursor, VS Code with Cline/Continue, Windsurf, and other AI-powered IDEs. Step-by-step setup for each editor with working examples.',
  keywords: ['MCP Cursor', 'MCP VS Code', 'MCP IDE', 'Cursor MCP setup', 'Cline MCP', 'Continue extension MCP', 'Windsurf MCP', 'MCP editor integration'],
  openGraph: {
    title: 'MCP with Cursor, VS Code & IDEs: Complete Setup Guide',
    description: 'Configure MCP servers in Cursor, VS Code with Cline/Continue, Windsurf, and other AI-powered IDEs.',
    type: 'article',
  },
}

export default function MCPCursorIDESetup() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-8">
          <a href="/mcp" className="text-blue-400 hover:text-blue-300 text-sm">
            ← Back to MCP Tutorials
          </a>
        </div>
        
        <article className="prose prose-invert prose-lg max-w-none">
          <h1 className="text-4xl font-bold mb-4 text-white">
            MCP with Cursor, VS Code & IDEs: Complete Setup Guide
          </h1>
          
          <p className="text-gray-400 text-lg mb-8">
            Your AI coding assistant becomes much more powerful with MCP servers. This guide covers setup for every major AI-powered IDE — Cursor, VS Code (with Cline or Continue), Windsurf, and more.
          </p>

          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold mb-3 mt-0">Quick Jump</h3>
            <ul className="grid md:grid-cols-2 gap-2 mb-0 text-sm">
              <li><a href="#cursor" className="text-blue-400">Cursor Setup</a></li>
              <li><a href="#vscode-cline" className="text-blue-400">VS Code + Cline</a></li>
              <li><a href="#vscode-continue" className="text-blue-400">VS Code + Continue</a></li>
              <li><a href="#windsurf" className="text-blue-400">Windsurf Setup</a></li>
              <li><a href="#common-servers" className="text-blue-400">Best Servers for Coding</a></li>
              <li><a href="#troubleshooting" className="text-blue-400">Troubleshooting</a></li>
            </ul>
          </div>

          <h2 id="why-mcp-ide">Why MCP in Your IDE?</h2>
          
          <p>
            AI coding assistants are great, but they're limited to what's in your current file and context window. MCP servers extend them with:
          </p>

          <ul>
            <li><strong>Database access</strong> — Query your actual database schemas and data</li>
            <li><strong>GitHub integration</strong> — Create issues, PRs, search code across repos</li>
            <li><strong>Documentation</strong> — Pull in API docs, internal wikis, Notion pages</li>
            <li><strong>External APIs</strong> — Interact with any service you use</li>
            <li><strong>File operations</strong> — Advanced file management beyond the IDE's built-in</li>
          </ul>

          <p>
            Instead of copy-pasting context, your AI assistant can pull what it needs directly.
          </p>

          <h2 id="cursor">Cursor Setup</h2>

          <p>
            <a href="https://cursor.sh" className="text-blue-400">Cursor</a> is a VS Code fork built for AI coding. It has native MCP support (in beta as of early 2025).
          </p>

          <h3>Step 1: Enable MCP in Settings</h3>

          <p>
            Open Cursor Settings → Features → look for "MCP Servers" or "Model Context Protocol". Enable it if it's not already on.
          </p>

          <h3>Step 2: Create Config File</h3>

          <p>
            Cursor uses a config file similar to Claude Desktop. Create <code>~/.cursor/mcp.json</code>:
          </p>

          <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/yourname/projects"
      ]
    }
  }
}`}
          </pre>

          <h3>Step 3: Restart Cursor</h3>

          <p>
            Restart Cursor completely (Cmd+Q / Alt+F4, then reopen). The MCP servers will start automatically.
          </p>

          <h3>Step 4: Verify It's Working</h3>

          <p>
            In Cursor's AI chat, try asking something that requires your MCP server:
          </p>

          <ul>
            <li>"List my recent GitHub issues" (tests GitHub server)</li>
            <li>"What files are in my projects folder?" (tests filesystem server)</li>
          </ul>

          <p>
            If the AI can answer correctly, your servers are connected.
          </p>

          <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 my-6">
            <p className="mb-0 text-sm">
              <strong>Note:</strong> Cursor's MCP support is evolving. Check their docs for the latest config format. Some features may require Cursor Pro.
            </p>
          </div>

          <h2 id="vscode-cline">VS Code + Cline</h2>

          <p>
            <a href="https://github.com/cline/cline" className="text-blue-400">Cline</a> (formerly Claude Dev) is a VS Code extension that brings Claude to your editor. It has excellent MCP support.
          </p>

          <h3>Step 1: Install Cline</h3>

          <ol>
            <li>Open VS Code Extensions (Cmd+Shift+X)</li>
            <li>Search for "Cline"</li>
            <li>Install the extension by saoudrizwan</li>
            <li>Reload VS Code</li>
          </ol>

          <h3>Step 2: Configure Cline</h3>

          <p>
            Open Cline settings (gear icon in the Cline sidebar panel) and add your API key. Then find the MCP Servers section.
          </p>

          <h3>Step 3: Add MCP Servers</h3>

          <p>
            Cline stores MCP config in its settings. You can either:
          </p>

          <p><strong>Option A: Use the UI</strong></p>
          <ol>
            <li>In Cline settings, find "MCP Servers"</li>
            <li>Click "Add Server"</li>
            <li>Enter the server name, command, and arguments</li>
          </ol>

          <p><strong>Option B: Edit settings.json directly</strong></p>

          <p>Add to your VS Code settings.json:</p>

          <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "cline.mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://user:pass@localhost/mydb"
      }
    }
  }
}`}
          </pre>

          <h3>Step 4: Test the Connection</h3>

          <p>
            Open the Cline chat panel and ask something that uses your MCP server:
          </p>

          <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
{`"Show me the schema for my users table"`}
          </pre>

          <p>
            If Cline can query your Postgres database and show the schema, it's working.
          </p>

          <h2 id="vscode-continue">VS Code + Continue</h2>

          <p>
            <a href="https://continue.dev" className="text-blue-400">Continue</a> is another popular AI coding extension for VS Code (and JetBrains). It supports MCP for context providers.
          </p>

          <h3>Step 1: Install Continue</h3>

          <ol>
            <li>Open VS Code Extensions</li>
            <li>Search for "Continue"</li>
            <li>Install and reload</li>
          </ol>

          <h3>Step 2: Edit config.json</h3>

          <p>
            Continue's config file is at <code>~/.continue/config.json</code>. Add MCP servers under the <code>experimental</code> section:
          </p>

          <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "models": [...],
  "experimental": {
    "mcpServers": {
      "filesystem": {
        "command": "npx",
        "args": [
          "-y",
          "@modelcontextprotocol/server-filesystem",
          "/Users/yourname/projects"
        ]
      },
      "memory": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-memory"]
      }
    }
  }
}`}
          </pre>

          <h3>Step 3: Use MCP Context</h3>

          <p>
            In Continue's chat, use the <code>@</code> symbol to reference MCP resources:
          </p>

          <ul>
            <li><code>@files</code> — Access filesystem server resources</li>
            <li><code>@memory</code> — Store and retrieve context</li>
          </ul>

          <p>
            Continue's MCP integration focuses on context providers (resources) rather than tools. Check their docs for the latest capabilities.
          </p>

          <h2 id="windsurf">Windsurf Setup</h2>

          <p>
            <a href="https://codeium.com/windsurf" className="text-blue-400">Windsurf</a> (by Codeium) is another AI-native IDE. MCP support varies by version.
          </p>

          <h3>Configuration</h3>

          <p>
            Look for MCP settings in Windsurf's preferences. The config format is similar to other IDEs:
          </p>

          <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "mcpServers": {
    "server-name": {
      "command": "command-to-run",
      "args": ["arg1", "arg2"],
      "env": {
        "ENV_VAR": "value"
      }
    }
  }
}`}
          </pre>

          <p>
            Check Windsurf's documentation for the exact config file location and format for your version.
          </p>

          <h2 id="common-servers">Best MCP Servers for Coding</h2>

          <p>
            Here are the most useful MCP servers for development work:
          </p>

          <div className="bg-gray-900 rounded-lg p-6 my-6">
            <h3 className="mt-0 text-xl">Essential Servers</h3>
            
            <h4 className="text-lg mt-4">GitHub Server</h4>
            <p className="text-sm text-gray-400 mb-2">Create issues, PRs, search code, manage repos</p>
            <pre className="bg-gray-800 p-3 rounded text-sm mb-4">
{`npx -y @modelcontextprotocol/server-github`}
            </pre>

            <h4 className="text-lg">Filesystem Server</h4>
            <p className="text-sm text-gray-400 mb-2">Read/write files, search content, manage directories</p>
            <pre className="bg-gray-800 p-3 rounded text-sm mb-4">
{`npx -y @modelcontextprotocol/server-filesystem /path/to/allow`}
            </pre>

            <h4 className="text-lg">PostgreSQL Server</h4>
            <p className="text-sm text-gray-400 mb-2">Query databases, inspect schemas, run migrations</p>
            <pre className="bg-gray-800 p-3 rounded text-sm mb-4">
{`npx -y @modelcontextprotocol/server-postgres`}
            </pre>

            <h4 className="text-lg">Memory Server</h4>
            <p className="text-sm text-gray-400 mb-2">Persistent memory across conversations</p>
            <pre className="bg-gray-800 p-3 rounded text-sm">
{`npx -y @modelcontextprotocol/server-memory`}
            </pre>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 my-6">
            <h3 className="mt-0 text-xl">Advanced Servers</h3>
            
            <h4 className="text-lg mt-4">Playwright Server</h4>
            <p className="text-sm text-gray-400 mb-2">Browser automation for testing and scraping</p>
            <pre className="bg-gray-800 p-3 rounded text-sm mb-4">
{`npx -y @anthropic/mcp-server-playwright`}
            </pre>

            <h4 className="text-lg">Puppeteer Server</h4>
            <p className="text-sm text-gray-400 mb-2">Chrome automation with screenshots</p>
            <pre className="bg-gray-800 p-3 rounded text-sm mb-4">
{`npx -y @anthropic/mcp-server-puppeteer`}
            </pre>

            <h4 className="text-lg">Context7 (Documentation)</h4>
            <p className="text-sm text-gray-400 mb-2">Pull in library docs on demand</p>
            <pre className="bg-gray-800 p-3 rounded text-sm">
{`npx -y @context7/mcp-server`}
            </pre>
          </div>

          <h2 id="multi-server">Running Multiple Servers</h2>

          <p>
            Most IDEs support running multiple MCP servers simultaneously. Here's a complete example config:
          </p>

          <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_xxx"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/me/code"],
      "env": {}
    },
    "postgres-dev": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://localhost/dev_db"
      }
    },
    "postgres-prod": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://readonly:xxx@prod-server/prod_db"
      }
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "env": {}
    }
  }
}`}
          </pre>

          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 my-6">
            <p className="mb-0 text-sm">
              <strong>Tip:</strong> Give servers descriptive names like "postgres-dev" and "postgres-prod" so you know which you're querying.
            </p>
          </div>

          <h2 id="troubleshooting">Troubleshooting</h2>

          <h3>Server Not Connecting</h3>

          <ol>
            <li><strong>Check the command</strong> — Run it manually in terminal to see errors</li>
            <li><strong>Verify paths</strong> — Absolute paths are more reliable than relative</li>
            <li><strong>Check env vars</strong> — API tokens and connection strings must be valid</li>
            <li><strong>Restart IDE</strong> — Most IDEs need full restart after config changes</li>
          </ol>

          <h3>Tools Not Appearing</h3>

          <ul>
            <li>Some IDEs only show tools when they're relevant to the current context</li>
            <li>Try explicitly asking the AI to use a specific tool</li>
            <li>Check if the IDE requires enabling specific permissions for MCP tools</li>
          </ul>

          <h3>Performance Issues</h3>

          <ul>
            <li>Each MCP server is a separate process — don't run more than you need</li>
            <li>Use connection pooling for database servers</li>
            <li>Consider caching for frequently-accessed resources</li>
          </ul>

          <h3>IDE-Specific Issues</h3>

          <p><strong>Cursor:</strong> MCP is in beta. Some features may require Cursor Pro subscription.</p>
          
          <p><strong>Cline:</strong> Make sure you're using the latest version. MCP support has improved significantly in recent releases.</p>
          
          <p><strong>Continue:</strong> Focus is on context providers (resources) rather than tools. Some tool functionality may be limited.</p>

          <h2>Workflow Example</h2>

          <p>
            Here's how MCP transforms a typical development workflow:
          </p>

          <p><strong>Without MCP:</strong></p>
          <ol>
            <li>Open database GUI, copy schema</li>
            <li>Paste into AI chat</li>
            <li>Ask for help with query</li>
            <li>Copy query, test it manually</li>
            <li>Go back to AI with error message</li>
          </ol>

          <p><strong>With MCP:</strong></p>
          <ol>
            <li>"Help me write a query to find users who signed up last week but haven't made a purchase"</li>
            <li>AI checks schema via MCP, writes query, tests it, refines if needed</li>
          </ol>

          <p>
            The AI has direct access to your database schema and can verify its work — no copy-paste needed.
          </p>

          <h2>Security Best Practices</h2>

          <ul>
            <li><strong>Use read-only credentials</strong> for production databases</li>
            <li><strong>Limit filesystem access</strong> to specific directories</li>
            <li><strong>Use environment variables</strong> for secrets, never hardcode in config</li>
            <li><strong>Review tool permissions</strong> — some servers have write capabilities</li>
            <li><strong>Separate dev and prod</strong> — Use different servers for different environments</li>
          </ul>

          <h2>What's Next?</h2>

          <p>Now that you have MCP set up in your IDE:</p>

          <ul>
            <li><a href="/mcp/best-mcp-servers-2025" className="text-blue-400">Explore more MCP servers</a> to extend your setup</li>
            <li><a href="/mcp/how-to-build-mcp-server-python" className="text-blue-400">Build your own server</a> for custom integrations</li>
            <li><a href="/mcp/troubleshooting-mcp-servers" className="text-blue-400">Troubleshooting guide</a> for common issues</li>
          </ul>

          <div className="mt-12 p-6 bg-gray-900 rounded-lg">
            <h3 className="mt-0">About These Tutorials</h3>
            <p className="mb-0 text-gray-400">
              Written by <a href="/" className="text-blue-400">Kai Gritun</a>. I've been building MCP servers since the protocol launched and have contributed to the MCP ecosystem. These guides come from real implementation experience.
            </p>
          </div>
        </article>
      </div>
    </main>
  )
}
