import type { Metadata } from 'next'
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: 'MCP Troubleshooting Guide: Fix Common Server Issues | Kai Gritun',
  description: 'Solve the most common MCP server problems. Connection failures, tool not showing, timeout errors, and debugging techniques for Model Context Protocol.',
  keywords: ['MCP troubleshooting', 'MCP not working', 'MCP connection failed', 'MCP server errors', 'debug MCP', 'Claude Desktop MCP issues'],
  openGraph: {
    title: 'MCP Troubleshooting Guide: Fix Common Server Issues',
    description: 'Solve the most common MCP server problems. Connection failures, timeouts, and debugging techniques.',
    type: 'article',
    publishedTime: '2025-02-03T12:00:00Z',
    authors: ['Kai Gritun'],
  },
}

export default function MCPTroubleshootingPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-8">
          <a href="/mcp" className="text-orange-400 hover:text-orange-300 text-sm">
            ← Back to MCP Tutorials
          </a>
        </div>

        <article className="prose prose-invert prose-zinc max-w-none">
          <h1 className="text-4xl font-bold mb-4">MCP Troubleshooting Guide: Fix Common Server Issues</h1>
          
          <p className="text-zinc-400 text-lg mb-8">
            MCP servers failing silently? Tools not appearing? This guide covers the most common problems 
            and how to fix them fast.
          </p>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-8">
            <p className="text-sm text-zinc-400 mb-2">Quick Navigation</p>
            <ul className="text-sm space-y-1 list-none pl-0">
              <li><a href="#connection-issues" className="text-orange-400 hover:text-orange-300">Connection Issues</a></li>
              <li><a href="#tools-not-showing" className="text-orange-400 hover:text-orange-300">Tools Not Showing Up</a></li>
              <li><a href="#timeout-errors" className="text-orange-400 hover:text-orange-300">Timeout Errors</a></li>
              <li><a href="#config-problems" className="text-orange-400 hover:text-orange-300">Config File Problems</a></li>
              <li><a href="#debugging-techniques" className="text-orange-400 hover:text-orange-300">Debugging Techniques</a></li>
              <li><a href="#client-specific" className="text-orange-400 hover:text-orange-300">Client-Specific Issues</a></li>
            </ul>
          </div>

          <h2 id="connection-issues" className="text-2xl font-bold mt-12 mb-4">Connection Issues</h2>

          <h3 className="text-xl font-semibold mt-8 mb-3">"Server failed to start"</h3>
          
          <p>Most common cause: the command path is wrong or the environment isn't set up correctly.</p>

          <p><strong>Check 1: Does the command work manually?</strong></p>
          
          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto text-sm">
{`# Test your exact command from the config
cd /path/to/your/server
python -m your_server

# Or for Node servers
npx your-mcp-server`}
          </pre>

          <p><strong>Check 2: Is Python/Node in PATH for the MCP host?</strong></p>
          
          <p>
            Claude Desktop and other clients may not inherit your shell's PATH. Use absolute paths:
          </p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto text-sm">
{`// BAD - relies on PATH
{
  "command": "python",
  "args": ["-m", "my_server"]
}

// GOOD - explicit path
{
  "command": "/usr/local/bin/python3",
  "args": ["-m", "my_server"]
}

// Find your Python path with:
// which python3`}
          </pre>

          <h3 className="text-xl font-semibold mt-8 mb-3">"Connection closed unexpectedly"</h3>

          <p>The server started but crashed. Check for:</p>

          <ol>
            <li><strong>Missing dependencies</strong> — Run <code>pip install -e .</code> or <code>npm install</code></li>
            <li><strong>Import errors</strong> — Test with <code>python -c "from your_server import mcp"</code></li>
            <li><strong>Missing environment variables</strong> — API keys, configs not set</li>
          </ol>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto text-sm">
{`// Pass env vars in config
{
  "command": "python",
  "args": ["-m", "my_server"],
  "env": {
    "OPENAI_API_KEY": "sk-...",
    "DEBUG": "true"
  }
}`}
          </pre>

          <h2 id="tools-not-showing" className="text-2xl font-bold mt-12 mb-4">Tools Not Showing Up</h2>

          <h3 className="text-xl font-semibold mt-8 mb-3">Server connects but tools are empty</h3>

          <p>Your server runs but Claude doesn't see the tools. Common causes:</p>

          <p><strong>1. Tools not registered properly</strong></p>
          
          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto text-sm">
{`# FastMCP - make sure you're using the decorator
from fastmcp import FastMCP

mcp = FastMCP("my-server")

@mcp.tool()  # <-- This decorator is required!
def my_tool(arg: str) -> str:
    """Tool description here."""  # <-- Docstring required!
    return f"Result: {arg}"

# DON'T FORGET: Run with mcp.run()
if __name__ == "__main__":
    mcp.run()`}
          </pre>

          <p><strong>2. Type hints missing</strong></p>

          <p>MCP uses type hints to generate the schema. No hints = no parameters:</p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto text-sm">
{`# BAD - no type hints, tool won't have proper params
@mcp.tool()
def search(query):
    return results

# GOOD - explicit types
@mcp.tool()
def search(query: str, limit: int = 10) -> list[dict]:
    """Search for items.
    
    Args:
        query: The search query
        limit: Max results to return
    """
    return results`}
          </pre>

          <p><strong>3. Server is stdio but config expects SSE (or vice versa)</strong></p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto text-sm">
{`// For stdio servers (most common)
{
  "mcpServers": {
    "my-server": {
      "command": "python",
      "args": ["-m", "my_server"]
    }
  }
}

// For SSE/HTTP servers
{
  "mcpServers": {
    "my-server": {
      "url": "http://localhost:3000/sse"
    }
  }
}`}
          </pre>

          <h2 id="timeout-errors" className="text-2xl font-bold mt-12 mb-4">Timeout Errors</h2>

          <h3 className="text-xl font-semibold mt-8 mb-3">Tool execution timeouts</h3>

          <p>Tools taking too long? The client gives up after ~30-60 seconds typically.</p>

          <p><strong>Solutions:</strong></p>

          <ol>
            <li><strong>Add progress reporting</strong> — For long operations, report progress so the client knows you're alive</li>
            <li><strong>Chunk the work</strong> — Break into smaller operations</li>
            <li><strong>Return early, process async</strong> — Start the work and return a status/ID to check later</li>
          </ol>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto text-sm">
{`@mcp.tool()
async def long_operation(task: str) -> str:
    """Starts a long operation and returns immediately."""
    
    # Start background task
    task_id = start_background_task(task)
    
    # Return immediately
    return f"Started task {task_id}. Use check_status('{task_id}') to monitor."

@mcp.tool()
def check_status(task_id: str) -> dict:
    """Check status of a background task."""
    return get_task_status(task_id)`}
          </pre>

          <h3 className="text-xl font-semibold mt-8 mb-3">Startup timeouts</h3>

          <p>Server takes too long to initialize. Solutions:</p>

          <ul>
            <li>Defer heavy initialization until first tool call</li>
            <li>Load resources lazily</li>
            <li>Add connection pooling instead of per-call connections</li>
          </ul>

          <h2 id="config-problems" className="text-2xl font-bold mt-12 mb-4">Config File Problems</h2>

          <h3 className="text-xl font-semibold mt-8 mb-3">Config file location</h3>

          <p>Different clients store configs in different places:</p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto text-sm">
{`# Claude Desktop
macOS: ~/Library/Application Support/Claude/claude_desktop_config.json
Windows: %APPDATA%\\Claude\\claude_desktop_config.json

# Cursor
~/.cursor/mcp.json

# Cline (VS Code extension)
Settings → Cline → MCP Servers

# OpenClaw
~/.openclaw/openclaw.json (under mcp.servers)`}
          </pre>

          <h3 className="text-xl font-semibold mt-8 mb-3">JSON syntax errors</h3>

          <p>Invalid JSON = config won't load. Common mistakes:</p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto text-sm">
{`// WRONG - trailing comma
{
  "mcpServers": {
    "server1": { ... },  // <-- trailing comma breaks JSON
  }
}

// WRONG - comments in JSON
{
  // This breaks the config
  "mcpServers": { ... }
}

// Validate with:
cat config.json | python -m json.tool`}
          </pre>

          <h3 className="text-xl font-semibold mt-8 mb-3">Path escaping on Windows</h3>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto text-sm">
{`// WRONG
{
  "command": "C:\\Users\\me\\server.py"  // Single backslash
}

// RIGHT
{
  "command": "C:\\\\Users\\\\me\\\\server.py"  // Escaped
}
// OR
{
  "command": "C:/Users/me/server.py"  // Forward slashes work too
}`}
          </pre>

          <h2 id="debugging-techniques" className="text-2xl font-bold mt-12 mb-4">Debugging Techniques</h2>

          <h3 className="text-xl font-semibold mt-8 mb-3">1. Add logging to your server</h3>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto text-sm">
{`import logging
import sys

# Log to stderr (stdout is for MCP protocol)
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    stream=sys.stderr
)
logger = logging.getLogger(__name__)

@mcp.tool()
def my_tool(arg: str) -> str:
    logger.debug(f"my_tool called with arg={arg}")
    try:
        result = do_something(arg)
        logger.debug(f"my_tool returning: {result}")
        return result
    except Exception as e:
        logger.error(f"my_tool failed: {e}", exc_info=True)
        raise`}
          </pre>

          <h3 className="text-xl font-semibold mt-8 mb-3">2. Test with MCP Inspector</h3>

          <p>The official MCP Inspector lets you test servers interactively:</p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto text-sm">
{`# Install and run
npx @modelcontextprotocol/inspector

# Opens web UI at localhost:5173
# Connect to your server, test tools manually`}
          </pre>

          <h3 className="text-xl font-semibold mt-8 mb-3">3. Check client logs</h3>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto text-sm">
{`# Claude Desktop logs
macOS: ~/Library/Logs/Claude/
Windows: %APPDATA%\\Claude\\logs\\

# Look for MCP-related errors
grep -i "mcp" ~/Library/Logs/Claude/*.log`}
          </pre>

          <h3 className="text-xl font-semibold mt-8 mb-3">4. Test the protocol manually</h3>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto text-sm">
{`# Start server and send test messages
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}' | python -m your_server

# Should get back a valid JSON response`}
          </pre>

          <h2 id="client-specific" className="text-2xl font-bold mt-12 mb-4">Client-Specific Issues</h2>

          <h3 className="text-xl font-semibold mt-8 mb-3">Claude Desktop</h3>

          <ul>
            <li><strong>Restart required</strong> — After config changes, fully quit and reopen Claude (Cmd/Ctrl+Q)</li>
            <li><strong>Server appears "disconnected"</strong> — Check the MCP server status in Claude settings</li>
            <li><strong>Can't find config</strong> — Enable Developer Mode in Claude settings first</li>
          </ul>

          <h3 className="text-xl font-semibold mt-8 mb-3">Cursor</h3>

          <ul>
            <li><strong>MCP not available</strong> — Ensure you're on Cursor version 0.43+</li>
            <li><strong>Config not loading</strong> — Check <code>~/.cursor/mcp.json</code> exists and is valid JSON</li>
            <li><strong>Tools not appearing in Composer</strong> — Toggle Agent mode on</li>
          </ul>

          <h3 className="text-xl font-semibold mt-8 mb-3">Cline</h3>

          <ul>
            <li><strong>Settings location</strong> — VS Code Settings → Extensions → Cline → MCP Servers</li>
            <li><strong>Server startup issues</strong> — Check VS Code Output panel (Cline channel)</li>
          </ul>

          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-6 mt-12">
            <h3 className="text-xl font-semibold mb-3 text-orange-400">Still Stuck?</h3>
            <p className="mb-4">
              Common debugging checklist:
            </p>
            <ol className="space-y-2">
              <li>✓ Can you run the server command manually in terminal?</li>
              <li>✓ Is the config file valid JSON? (Use a JSON validator)</li>
              <li>✓ Are you using absolute paths for commands?</li>
              <li>✓ Did you restart the client after config changes?</li>
              <li>✓ Check client logs for error messages</li>
              <li>✓ Test with MCP Inspector to isolate client vs server issues</li>
            </ol>
          </div>

          <div className="mt-12 pt-8 border-t border-zinc-800">
            <h3 className="text-xl font-semibold mb-4">Related Guides</h3>
            <ul className="space-y-2">
              <li>
                <a href="/mcp/how-to-build-mcp-server-python" className="text-orange-400 hover:text-orange-300">
                  How to Build an MCP Server in Python
                </a>
              </li>
              <li>
                <a href="/mcp/mcp-resources-prompts-guide" className="text-orange-400 hover:text-orange-300">
                  MCP Resources & Prompts Guide
                </a>
              </li>
              <li>
                <a href="/mcp/best-mcp-servers-2025" className="text-orange-400 hover:text-orange-300">
                  Best MCP Servers 2025
                </a>
              </li>
            </ul>
          </div>
        </article>

        <EmailSignup />

        <footer className="mt-16 pt-8 border-t border-zinc-800 text-center text-zinc-500 text-sm">
          <p>Built by <a href="/" className="text-orange-400 hover:text-orange-300">Kai Gritun</a></p>
        </footer>
      </div>
    </main>
  )
}
