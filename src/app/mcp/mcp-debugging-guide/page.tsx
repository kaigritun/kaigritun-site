import Link from "next/link";
import type { Metadata } from "next";
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: "MCP Debugging Guide: Troubleshoot Common Issues | Kai Gritun",
  description: "Fix MCP server problems fast. Debug connection issues, missing tools, permission errors, and platform-specific problems with step-by-step solutions.",
  keywords: ["MCP debugging", "MCP troubleshooting", "MCP server not starting", "MCP connection timeout", "MCP Inspector", "Claude MCP tools missing"],
};

export default function MCPDebuggingGuide() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-semibold hover:text-blue-400 transition-colors">
            Kai Gritun
          </Link>
          <nav className="flex gap-6 text-sm text-gray-400">
            <Link href="/mcp" className="hover:text-white transition-colors">MCP Tutorials</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          </nav>
        </div>
      </header>

      {/* Article */}
      <article className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Meta */}
          <div className="mb-8">
            <Link href="/mcp" className="text-blue-400 hover:text-blue-300 text-sm mb-4 inline-block">
              ← Back to MCP Tutorials
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              MCP Debugging Guide: Troubleshoot Common Issues
            </h1>
            <p className="text-gray-400 text-lg mb-4">
              Your MCP server isn't working. Don't panic. This guide walks through the most 
              common problems and how to fix them—from servers that won't start to tools 
              that mysteriously don't appear in Claude.
            </p>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>February 3, 2026</span>
              <span>·</span>
              <span>15 min read</span>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p>
              MCP debugging can feel frustrating because errors happen in multiple places: 
              your server code, the transport layer, the client configuration, or the AI 
              model's interpretation. This guide helps you identify which layer is broken 
              and how to fix it.
            </p>
            
            <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 my-6">
              <p className="text-blue-200 text-sm m-0">
                <strong>Quick tip:</strong> Most MCP issues come from three places: wrong paths in 
                config, missing environment variables, or schema validation errors. Check these first.
              </p>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Common Issues and Solutions</h2>

            <h3 className="text-xl font-semibold mt-8 mb-3">Server Not Starting</h3>
            <p>
              The most common issue. Your MCP server process exits immediately or fails to spawn.
            </p>

            <p><strong>Symptom:</strong> Claude shows "MCP server failed to start" or the server process dies instantly.</p>

            <p><strong>Debug steps:</strong></p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Run the server command manually in your terminal</li>
              <li>Check for syntax errors or import failures</li>
              <li>Verify all dependencies are installed</li>
              <li>Check file permissions</li>
            </ol>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <p className="text-gray-400 text-sm mb-2">Test your server manually first:</p>
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`# Python server
cd /path/to/your/server
python server.py

# TypeScript/Node server
npx ts-node server.ts
# or
node dist/server.js

# If using uv (Python)
uv run python server.py`}
              </pre>
            </div>

            <p>
              If the server runs fine manually but fails from Claude Desktop, the issue is likely 
              in the configuration path or working directory. Claude Desktop doesn't inherit 
              your shell environment by default.
            </p>

            <h3 className="text-xl font-semibold mt-8 mb-3">Connection Timeouts</h3>
            <p>
              The server starts but Claude can't connect, or connections drop after some time.
            </p>

            <p><strong>Common causes:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Server taking too long to initialize</li>
              <li>Blocking operations in the main event loop</li>
              <li>Network/firewall issues (for SSE transport)</li>
              <li>Server not sending proper JSON-RPC responses</li>
            </ul>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <p className="text-gray-400 text-sm mb-2">Add initialization logging to identify where it hangs:</p>
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`import logging
import sys

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    stream=sys.stderr
)
logger = logging.getLogger(__name__)

logger.info("Server starting...")

# Your slow initialization here
logger.info("Loading database connection...")
db = connect_to_database()
logger.info("Database connected")

logger.info("Starting MCP server...")
mcp.run()`}
              </pre>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-3">Tool Not Appearing in Claude</h3>
            <p>
              Your server runs, connects successfully, but Claude doesn't show or use your tools.
            </p>

            <p><strong>Checklist:</strong></p>
            <ol className="list-decimal list-inside space-y-2">
              <li><strong>Tool schema is valid:</strong> Use MCP Inspector to verify your tool definitions</li>
              <li><strong>Tool name is unique:</strong> Duplicate names across servers cause conflicts</li>
              <li><strong>Description is present:</strong> Claude needs descriptions to understand when to use tools</li>
              <li><strong>Server registered correctly:</strong> Check claude_desktop_config.json syntax</li>
            </ol>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <p className="text-gray-400 text-sm mb-2">Verify tool schema with MCP Inspector:</p>
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`npx @modelcontextprotocol/inspector python server.py

# Inspector shows:
# - Connected tools and their schemas
# - Input/output validation
# - Real-time request/response logging`}
              </pre>
            </div>

            <p>
              A common mistake is forgetting the tool decorator or using incorrect type hints 
              that fail schema generation:
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`# ❌ Missing decorator - tool won't be exposed
async def my_tool(query: str) -> str:
    return "result"

# ❌ Invalid type hint - schema generation fails
@mcp.tool()
async def my_tool(data: dict) -> str:  # 'dict' too vague
    return "result"

# ✅ Correct - explicit types with descriptions
@mcp.tool()
async def my_tool(query: str) -> str:
    """Search for information.
    
    Args:
        query: The search query string
    
    Returns:
        Search results as formatted text
    """
    return "result"`}
              </pre>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-3">Permission Errors</h3>
            <p>
              Your server can't access files, databases, or APIs it needs.
            </p>

            <p><strong>Common scenarios:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>File paths inaccessible from Claude Desktop's context</li>
              <li>API keys not available in environment</li>
              <li>Database permissions for the user running the server</li>
              <li>macOS sandbox restrictions</li>
            </ul>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <p className="text-gray-400 text-sm mb-2">Debug permission issues:</p>
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`import os
import logging

logger = logging.getLogger(__name__)

@mcp.tool()
async def read_file(path: str) -> str:
    """Read a file with permission debugging."""
    logger.info(f"Attempting to read: {path}")
    logger.info(f"Current user: {os.getuid()}")
    logger.info(f"Current working dir: {os.getcwd()}")
    logger.info(f"File exists: {os.path.exists(path)}")
    
    if os.path.exists(path):
        logger.info(f"File permissions: {oct(os.stat(path).st_mode)}")
        logger.info(f"File owner: {os.stat(path).st_uid}")
    
    try:
        with open(path, 'r') as f:
            return f.read()
    except PermissionError as e:
        return f"Permission denied: {e}. Server running as UID {os.getuid()}"`}
              </pre>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-3">Memory and Resource Issues</h3>
            <p>
              Server slows down, crashes after running for a while, or uses excessive memory.
            </p>

            <p><strong>Common causes:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Memory leaks from unclosed connections</li>
              <li>Accumulating data in global state</li>
              <li>Large responses not being streamed</li>
              <li>Too many concurrent requests</li>
            </ul>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <p className="text-gray-400 text-sm mb-2">Add memory monitoring:</p>
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`import psutil
import os
import logging

logger = logging.getLogger(__name__)

def log_memory_usage(context: str = ""):
    process = psutil.Process(os.getpid())
    mem_info = process.memory_info()
    logger.info(f"Memory [{context}]: RSS={mem_info.rss / 1024 / 1024:.1f}MB")

@mcp.tool()
async def process_large_data(file_path: str) -> str:
    log_memory_usage("before processing")
    
    # Process in chunks instead of loading everything
    results = []
    with open(file_path, 'r') as f:
        for chunk in iter(lambda: f.read(8192), ''):
            results.append(process_chunk(chunk))
    
    log_memory_usage("after processing")
    return "\\n".join(results)`}
              </pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Debugging Techniques</h2>

            <h3 className="text-xl font-semibold mt-8 mb-3">Setting Up Comprehensive Logging</h3>
            <p>
              Good logging is your primary debugging tool. Configure it to capture everything 
              during development, then dial it back for production.
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <p className="text-gray-400 text-sm mb-2">Production-ready logging setup:</p>
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`import logging
import sys
import os
from datetime import datetime

def setup_logging():
    """Configure logging for MCP server debugging."""
    log_level = os.getenv("MCP_LOG_LEVEL", "INFO")
    log_file = os.getenv("MCP_LOG_FILE")
    
    # Format includes timestamp, level, and context
    formatter = logging.Formatter(
        '%(asctime)s | %(levelname)-8s | %(name)s:%(lineno)d | %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    # Always log to stderr (visible in MCP Inspector)
    stderr_handler = logging.StreamHandler(sys.stderr)
    stderr_handler.setFormatter(formatter)
    
    handlers = [stderr_handler]
    
    # Optionally log to file for persistent debugging
    if log_file:
        file_handler = logging.FileHandler(log_file)
        file_handler.setFormatter(formatter)
        handlers.append(file_handler)
    
    logging.basicConfig(
        level=getattr(logging, log_level),
        handlers=handlers
    )
    
    # Reduce noise from libraries
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("httpcore").setLevel(logging.WARNING)
    
    return logging.getLogger(__name__)

logger = setup_logging()
logger.info("MCP server initializing")`}
              </pre>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-3">Using MCP Inspector</h3>
            <p>
              MCP Inspector is the official debugging tool. It shows you exactly what's happening 
              in the protocol layer—every request, response, and error.
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`# Install globally
npm install -g @modelcontextprotocol/inspector

# Run with your server
npx @modelcontextprotocol/inspector python server.py

# For TypeScript
npx @modelcontextprotocol/inspector npx ts-node server.ts

# With environment variables
MCP_LOG_LEVEL=DEBUG npx @modelcontextprotocol/inspector python server.py`}
              </pre>
            </div>

            <p><strong>What MCP Inspector shows you:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>All registered tools with their schemas</li>
              <li>Request/response pairs in real-time</li>
              <li>Validation errors on inputs and outputs</li>
              <li>Connection lifecycle events</li>
              <li>stderr output from your server</li>
            </ul>

            <h3 className="text-xl font-semibold mt-8 mb-3">Testing with curl</h3>
            <p>
              For SSE-based servers, you can test the HTTP endpoints directly with curl. This 
              bypasses the client entirely and tests your server in isolation.
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`# Test SSE connection (for SSE transport servers)
curl -N http://localhost:3000/sse

# Send a tools/list request
curl -X POST http://localhost:3000/message \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc": "2.0", "method": "tools/list", "id": 1}'

# Call a specific tool
curl -X POST http://localhost:3000/message \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "my_tool",
      "arguments": {"query": "test"}
    },
    "id": 2
  }'`}
              </pre>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-3">Environment Variable Debugging</h3>
            <p>
              Missing or incorrect environment variables cause many silent failures. Add 
              validation at startup to catch these early.
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`import os
import sys

REQUIRED_ENV_VARS = [
    "DATABASE_URL",
    "API_KEY",
]

OPTIONAL_ENV_VARS = {
    "LOG_LEVEL": "INFO",
    "TIMEOUT_SECONDS": "30",
}

def validate_environment():
    """Check required environment variables at startup."""
    missing = []
    
    for var in REQUIRED_ENV_VARS:
        value = os.getenv(var)
        if not value:
            missing.append(var)
        else:
            # Log presence but not value (security)
            print(f"✓ {var} is set", file=sys.stderr)
    
    for var, default in OPTIONAL_ENV_VARS.items():
        value = os.getenv(var, default)
        print(f"○ {var} = {value} {'(default)' if not os.getenv(var) else ''}", file=sys.stderr)
    
    if missing:
        print(f"\\n✗ Missing required environment variables:", file=sys.stderr)
        for var in missing:
            print(f"  - {var}", file=sys.stderr)
        print(f"\\nSet these in your claude_desktop_config.json 'env' section", file=sys.stderr)
        sys.exit(1)
    
    print(f"\\n✓ Environment validation passed", file=sys.stderr)

# Run at import time, before server starts
validate_environment()`}
              </pre>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-3">Schema Validation Errors</h3>
            <p>
              When tools fail silently, it's often because the input or output doesn't match 
              the expected schema. Add explicit validation to surface these errors.
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`from pydantic import BaseModel, ValidationError
from typing import Optional
import logging

logger = logging.getLogger(__name__)

class SearchInput(BaseModel):
    query: str
    max_results: Optional[int] = 10
    
class SearchResult(BaseModel):
    title: str
    url: str
    snippet: str

@mcp.tool()
async def search(query: str, max_results: int = 10) -> str:
    """Search with input validation."""
    # Validate input explicitly
    try:
        validated = SearchInput(query=query, max_results=max_results)
        logger.debug(f"Input validated: {validated}")
    except ValidationError as e:
        logger.error(f"Input validation failed: {e}")
        return f"Invalid input: {e}"
    
    # Your search logic here
    results = perform_search(validated.query, validated.max_results)
    
    # Validate output
    validated_results = []
    for r in results:
        try:
            validated_results.append(SearchResult(**r).dict())
        except ValidationError as e:
            logger.warning(f"Skipping invalid result: {e}")
    
    return json.dumps(validated_results, indent=2)`}
              </pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Platform-Specific Issues</h2>

            <h3 className="text-xl font-semibold mt-8 mb-3">macOS Path Problems</h3>
            <p>
              macOS has unique path and permission behaviors that cause many MCP issues.
            </p>

            <p><strong>Common macOS problems:</strong></p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Tilde expansion:</strong> <code>~/path</code> doesn't expand in config files. Use full paths like <code>/Users/yourname/path</code></li>
              <li><strong>App sandboxing:</strong> Claude Desktop may not access all directories. Grant Full Disk Access in System Preferences if needed</li>
              <li><strong>Python path:</strong> Use <code>/usr/bin/python3</code> or the full path to your virtual environment's Python</li>
              <li><strong>Homebrew paths:</strong> Binaries in <code>/opt/homebrew/bin</code> aren't in PATH for GUI apps</li>
            </ul>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <p className="text-gray-400 text-sm mb-2">macOS claude_desktop_config.json example:</p>
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`{
  "mcpServers": {
    "my-server": {
      "command": "/Users/yourname/.venv/bin/python",
      "args": ["/Users/yourname/projects/my-mcp-server/server.py"],
      "env": {
        "PATH": "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin",
        "HOME": "/Users/yourname"
      }
    }
  }
}`}
              </pre>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-3">Windows Compatibility</h3>
            <p>
              Windows has different path separators, line endings, and process spawning behavior.
            </p>

            <p><strong>Windows-specific issues:</strong></p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Path separators:</strong> Use forward slashes <code>/</code> or escaped backslashes <code>\\\\</code> in config</li>
              <li><strong>Python command:</strong> Use <code>python</code> not <code>python3</code></li>
              <li><strong>Virtual environments:</strong> Activation script is <code>Scripts\\activate</code> not <code>bin/activate</code></li>
              <li><strong>Line endings:</strong> Ensure your server handles both <code>\\n</code> and <code>\\r\\n</code></li>
            </ul>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <p className="text-gray-400 text-sm mb-2">Windows claude_desktop_config.json:</p>
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`{
  "mcpServers": {
    "my-server": {
      "command": "C:/Users/yourname/.venv/Scripts/python.exe",
      "args": ["C:/Users/yourname/projects/my-mcp-server/server.py"],
      "env": {
        "PYTHONUNBUFFERED": "1"
      }
    }
  }
}`}
              </pre>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-3">Docker Container Debugging</h3>
            <p>
              Running MCP servers in Docker adds networking and volume mount complexity.
            </p>

            <p><strong>Docker debugging checklist:</strong></p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Network mode:</strong> Use <code>host</code> network or properly expose ports</li>
              <li><strong>Volume mounts:</strong> Ensure config files and data are accessible inside the container</li>
              <li><strong>Environment:</strong> Pass env vars with <code>-e</code> or <code>--env-file</code></li>
              <li><strong>Logs:</strong> Use <code>docker logs -f container_name</code> to watch output</li>
            </ul>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <p className="text-gray-400 text-sm mb-2">Dockerfile with debugging support:</p>
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy server code
COPY . .

# Enable unbuffered output for real-time logging
ENV PYTHONUNBUFFERED=1
ENV MCP_LOG_LEVEL=DEBUG

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s \\
  CMD python -c "import socket; s=socket.socket(); s.connect(('localhost', 3000)); s.close()"

EXPOSE 3000

CMD ["python", "server.py"]`}
              </pre>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <p className="text-gray-400 text-sm mb-2">Debug a running container:</p>
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`# View logs
docker logs -f my-mcp-server

# Shell into container
docker exec -it my-mcp-server /bin/bash

# Check environment
docker exec my-mcp-server env | grep MCP

# Test connectivity from host
curl http://localhost:3000/health`}
              </pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Error Handling Patterns</h2>
            <p>
              Good error handling makes debugging easier by providing clear, actionable messages.
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <p className="text-gray-400 text-sm mb-2">Comprehensive error handling template:</p>
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`import traceback
import logging
from functools import wraps

logger = logging.getLogger(__name__)

def handle_errors(func):
    """Decorator for consistent error handling across tools."""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        except ValueError as e:
            logger.warning(f"Validation error in {func.__name__}: {e}")
            return f"Invalid input: {e}"
        except PermissionError as e:
            logger.error(f"Permission denied in {func.__name__}: {e}")
            return f"Permission denied: {e}. Check file/directory permissions."
        except TimeoutError as e:
            logger.error(f"Timeout in {func.__name__}: {e}")
            return f"Operation timed out. Try again or use smaller input."
        except Exception as e:
            logger.exception(f"Unexpected error in {func.__name__}")
            # In debug mode, include traceback
            if os.getenv("MCP_DEBUG"):
                return f"Error: {e}\\n\\nTraceback:\\n{traceback.format_exc()}"
            return f"An error occurred: {type(e).__name__}: {e}"
    return wrapper

@mcp.tool()
@handle_errors
async def my_tool(query: str) -> str:
    """Tool with automatic error handling."""
    # Your logic here - errors are automatically caught and formatted
    result = await perform_operation(query)
    return result`}
              </pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Next Steps</h2>
            <p>
              Once you've fixed your immediate issue, consider these resources to build 
              more robust MCP servers:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><Link href="/mcp/mcp-error-handling" className="text-blue-400 hover:text-blue-300">MCP Error Handling Best Practices</Link> - Build servers that fail gracefully</li>
              <li><Link href="/mcp/testing-mcp-servers" className="text-blue-400 hover:text-blue-300">Testing MCP Servers</Link> - Catch bugs before they reach production</li>
              <li><Link href="/mcp/mcp-performance-optimization" className="text-blue-400 hover:text-blue-300">MCP Performance Optimization</Link> - Make your servers fast and efficient</li>
              <li><Link href="/mcp/mcp-docker-deployment" className="text-blue-400 hover:text-blue-300">MCP Docker Deployment</Link> - Production containerization patterns</li>
              <li><Link href="/mcp/troubleshooting-mcp-servers" className="text-blue-400 hover:text-blue-300">MCP Troubleshooting Guide</Link> - Quick fixes for common problems</li>
            </ul>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 my-8">
              <h3 className="text-lg font-semibold mb-2">Quick Debug Checklist</h3>
              <ul className="list-none space-y-2 text-gray-300">
                <li>☐ Can you run the server manually in terminal?</li>
                <li>☐ Are all paths absolute (no ~)?</li>
                <li>☐ Are required environment variables set?</li>
                <li>☐ Does MCP Inspector show your tools?</li>
                <li>☐ Are there syntax errors in your config JSON?</li>
                <li>☐ Did you restart Claude Desktop after config changes?</li>
                <li>☐ Check stderr output for error messages?</li>
              </ul>
            </div>

            {/* Email Signup */}
            <div className="my-12">
              <EmailSignup 
                headline="Get MCP tutorials in your inbox"
                buttonText="Subscribe"
                site="mcp"
              />
            </div>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Kai Gritun</p>
          <div className="flex gap-4">
            <Link href="/mcp" className="hover:text-white transition-colors">MCP Tutorials</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
