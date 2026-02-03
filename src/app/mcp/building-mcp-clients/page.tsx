import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Building MCP Clients: Connect Your App to MCP Servers | Kai Gritun',
  description: 'Learn how to build MCP clients in Python and TypeScript. Connect your application to any MCP server, discover tools, call functions, and handle responses.',
  keywords: ['MCP client', 'MCP SDK', 'connect to MCP server', 'MCP client Python', 'MCP client TypeScript', 'Model Context Protocol client'],
  openGraph: {
    title: 'Building MCP Clients: Connect Your App to MCP Servers',
    description: 'Learn how to build MCP clients in Python and TypeScript. Connect your application to any MCP server.',
    type: 'article',
  },
}

export default function BuildingMCPClientsPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-8">
          <a href="/mcp" className="text-blue-400 hover:text-blue-300 text-sm">
            ← Back to MCP Tutorials
          </a>
        </div>
        
        <article className="prose prose-invert prose-lg max-w-none">
          <h1 className="text-4xl font-bold mb-4">Building MCP Clients: Connect Your App to MCP Servers</h1>
          
          <p className="text-gray-400 text-sm mb-8">
            February 2026 · 15 min read · By Kai Gritun
          </p>
          
          <p className="lead text-xl text-gray-300">
            Most MCP tutorials focus on building servers. But what if you want to build an application that <em>consumes</em> MCP servers? This guide shows you how to build MCP clients that can connect to any server, discover its capabilities, and use its tools.
          </p>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold mb-3 mt-0">What You'll Learn</h3>
            <ul className="text-gray-300 mb-0">
              <li>How MCP clients work (the protocol)</li>
              <li>Building a client in Python with the MCP SDK</li>
              <li>Building a client in TypeScript</li>
              <li>Discovering server capabilities</li>
              <li>Calling tools and handling responses</li>
              <li>Managing multiple servers</li>
              <li>Building an LLM-powered client</li>
            </ul>
          </div>

          <h2>When Do You Need an MCP Client?</h2>
          
          <p>
            Claude Desktop, Cursor, and other AI tools already have MCP clients built in. So when would you build your own?
          </p>
          
          <ul>
            <li><strong>Custom AI applications</strong> — Your own chatbot or agent that needs tool access</li>
            <li><strong>Automation pipelines</strong> — Scripts that use MCP tools without an LLM</li>
            <li><strong>Testing and debugging</strong> — Programmatically test your MCP servers</li>
            <li><strong>Orchestration layers</strong> — Systems that coordinate multiple MCP servers</li>
            <li><strong>Non-Claude integrations</strong> — Connect other LLMs to MCP servers</li>
          </ul>

          <h2>Understanding the Protocol</h2>
          
          <p>
            MCP uses JSON-RPC 2.0 over stdio or HTTP/SSE. As a client, you:
          </p>
          
          <ol>
            <li><strong>Initialize</strong> — Exchange capabilities with the server</li>
            <li><strong>Discover</strong> — List available tools, resources, and prompts</li>
            <li><strong>Call</strong> — Invoke tools with arguments, get results</li>
            <li><strong>Handle notifications</strong> — React to server updates (optional)</li>
          </ol>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 my-8">
            <h4 className="text-md font-semibold mb-3 mt-0">Client ↔ Server Message Flow</h4>
            <pre className="bg-gray-950 p-4 rounded text-sm overflow-x-auto mt-0 mb-0"><code>{`Client                              Server
   |                                    |
   |-- initialize ---------------------->|
   |<----------------------- initialized |
   |                                    |
   |-- tools/list --------------------->|
   |<----------------------- tools list |
   |                                    |
   |-- tools/call {name, args} -------->|
   |<-------------------------- result  |
   |                                    |`}</code></pre>
          </div>

          <h2>Python MCP Client</h2>
          
          <p>
            Let's build a Python client that can connect to any MCP server and call its tools.
          </p>

          <h3>Installation</h3>
          
          <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto"><code className="language-bash">{`pip install mcp`}</code></pre>

          <h3>Basic Client Structure</h3>
          
          <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto"><code className="language-python">{`import asyncio
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def main():
    # Define server connection
    server_params = StdioServerParameters(
        command="python",
        args=["-m", "my_mcp_server"],
        env=None  # Optional environment variables
    )
    
    # Connect to the server
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            # Initialize the connection
            await session.initialize()
            
            # Now you can interact with the server
            print("Connected to MCP server!")
            
            # List available tools
            tools = await session.list_tools()
            print(f"Available tools: {[t.name for t in tools.tools]}")

if __name__ == "__main__":
    asyncio.run(main())`}</code></pre>

          <h3>Discovering Server Capabilities</h3>
          
          <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto"><code className="language-python">{`async def discover_server(session: ClientSession):
    """Discover everything a server offers."""
    
    # List tools
    tools_result = await session.list_tools()
    print("\\n📧 TOOLS:")
    for tool in tools_result.tools:
        print(f"  • {tool.name}: {tool.description}")
        if tool.inputSchema:
            print(f"    Parameters: {tool.inputSchema}")
    
    # List resources
    resources_result = await session.list_resources()
    print("\\n📁 RESOURCES:")
    for resource in resources_result.resources:
        print(f"  • {resource.uri}: {resource.name}")
    
    # List prompts
    prompts_result = await session.list_prompts()
    print("\\n💬 PROMPTS:")
    for prompt in prompts_result.prompts:
        print(f"  • {prompt.name}: {prompt.description}")`}</code></pre>

          <h3>Calling Tools</h3>
          
          <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto"><code className="language-python">{`async def call_tool(session: ClientSession, tool_name: str, arguments: dict):
    """Call a tool and return the result."""
    result = await session.call_tool(tool_name, arguments)
    
    # Handle different content types
    for content in result.content:
        if content.type == "text":
            return content.text
        elif content.type == "image":
            return f"Image: {content.mimeType}, {len(content.data)} bytes"
        elif content.type == "resource":
            return f"Resource: {content.uri}"
    
    return result

# Example usage
async def demo_tool_calls(session: ClientSession):
    # Call a weather tool
    weather = await call_tool(session, "get_weather", {
        "city": "New York"
    })
    print(f"Weather: {weather}")
    
    # Call a database query tool
    results = await call_tool(session, "query_database", {
        "sql": "SELECT * FROM users LIMIT 5"
    })
    print(f"Query results: {results}")`}</code></pre>

          <h3>Reading Resources</h3>
          
          <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto"><code className="language-python">{`async def read_resource(session: ClientSession, uri: str):
    """Read a resource from the server."""
    result = await session.read_resource(uri)
    
    for content in result.contents:
        if content.text:
            return content.text
        elif content.blob:
            return f"Binary data: {len(content.blob)} bytes"
    
    return None

# Example: Read a file resource
content = await read_resource(session, "file:///path/to/document.txt")

# Example: Read a dynamic resource
user_data = await read_resource(session, "user://profile/123")`}</code></pre>

          <h2>TypeScript MCP Client</h2>
          
          <p>
            The TypeScript SDK provides similar functionality with strong typing.
          </p>

          <h3>Installation</h3>
          
          <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto"><code className="language-bash">{`npm install @modelcontextprotocol/sdk`}</code></pre>

          <h3>Basic Client</h3>
          
          <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto"><code className="language-typescript">{`import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
  // Create transport
  const transport = new StdioClientTransport({
    command: "node",
    args: ["./my-mcp-server.js"],
  });

  // Create client
  const client = new Client({
    name: "my-mcp-client",
    version: "1.0.0",
  }, {
    capabilities: {}
  });

  // Connect
  await client.connect(transport);
  console.log("Connected to MCP server!");

  // List tools
  const tools = await client.listTools();
  console.log("Available tools:", tools.tools.map(t => t.name));

  // Call a tool
  const result = await client.callTool({
    name: "get_weather",
    arguments: { city: "San Francisco" }
  });
  console.log("Result:", result);

  // Cleanup
  await client.close();
}

main().catch(console.error);`}</code></pre>

          <h3>Full-Featured Client Class</h3>
          
          <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto"><code className="language-typescript">{`import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { Tool, Resource, CallToolResult } from "@modelcontextprotocol/sdk/types.js";

interface ServerConfig {
  command: string;
  args: string[];
  env?: Record<string, string>;
}

class MCPClient {
  private client: Client;
  private transport: StdioClientTransport | null = null;
  private tools: Map<string, Tool> = new Map();

  constructor(name: string, version: string) {
    this.client = new Client({ name, version }, { capabilities: {} });
  }

  async connect(config: ServerConfig): Promise<void> {
    this.transport = new StdioClientTransport({
      command: config.command,
      args: config.args,
      env: config.env,
    });

    await this.client.connect(this.transport);
    
    // Cache tools for quick lookup
    const result = await this.client.listTools();
    for (const tool of result.tools) {
      this.tools.set(tool.name, tool);
    }
  }

  async disconnect(): Promise<void> {
    await this.client.close();
  }

  getAvailableTools(): string[] {
    return Array.from(this.tools.keys());
  }

  getToolSchema(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  async callTool(name: string, args: Record<string, unknown>): Promise<string> {
    const result = await this.client.callTool({ name, arguments: args });
    
    // Extract text content
    const textContent = result.content.find(c => c.type === "text");
    if (textContent && "text" in textContent) {
      return textContent.text;
    }
    
    return JSON.stringify(result.content);
  }

  async listResources(): Promise<Resource[]> {
    const result = await this.client.listResources();
    return result.resources;
  }

  async readResource(uri: string): Promise<string> {
    const result = await this.client.readResource({ uri });
    const content = result.contents[0];
    
    if ("text" in content) {
      return content.text;
    }
    
    return \`Binary content: \${content.mimeType}\`;
  }
}

// Usage
const client = new MCPClient("my-app", "1.0.0");
await client.connect({
  command: "uvx",
  args: ["my-mcp-server"],
});

console.log("Tools:", client.getAvailableTools());
const weather = await client.callTool("get_weather", { city: "Tokyo" });
console.log("Weather:", weather);`}</code></pre>

          <h2>Managing Multiple Servers</h2>
          
          <p>
            Real applications often need to connect to multiple MCP servers. Here's a pattern for managing them:
          </p>

          <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto"><code className="language-python">{`from dataclasses import dataclass
from typing import Dict, List, Any, Optional

@dataclass
class ServerConfig:
    name: str
    command: str
    args: List[str]
    env: Optional[Dict[str, str]] = None

class MCPOrchestrator:
    """Manages multiple MCP server connections."""
    
    def __init__(self):
        self.sessions: Dict[str, ClientSession] = {}
        self.tools: Dict[str, str] = {}  # tool_name -> server_name
    
    async def connect_server(self, config: ServerConfig):
        """Connect to an MCP server and register its tools."""
        server_params = StdioServerParameters(
            command=config.command,
            args=config.args,
            env=config.env
        )
        
        # Store connection (simplified - real impl needs context management)
        read, write = await stdio_client(server_params).__aenter__()
        session = await ClientSession(read, write).__aenter__()
        await session.initialize()
        
        self.sessions[config.name] = session
        
        # Register tools with namespacing
        tools = await session.list_tools()
        for tool in tools.tools:
            # Namespace tools by server: "github.create_issue"
            namespaced_name = f"{config.name}.{tool.name}"
            self.tools[namespaced_name] = config.name
            # Also allow unnamespaced if unique
            if tool.name not in self.tools:
                self.tools[tool.name] = config.name
    
    async def call_tool(self, tool_name: str, arguments: dict) -> Any:
        """Route tool call to the appropriate server."""
        server_name = self.tools.get(tool_name)
        if not server_name:
            raise ValueError(f"Unknown tool: {tool_name}")
        
        session = self.sessions[server_name]
        
        # Strip namespace if present
        actual_tool_name = tool_name.split(".")[-1]
        
        return await session.call_tool(actual_tool_name, arguments)
    
    def list_all_tools(self) -> List[str]:
        """List all available tools across all servers."""
        return list(self.tools.keys())

# Usage
orchestrator = MCPOrchestrator()

await orchestrator.connect_server(ServerConfig(
    name="github",
    command="uvx",
    args=["mcp-server-github"],
    env={"GITHUB_TOKEN": "..."}
))

await orchestrator.connect_server(ServerConfig(
    name="slack",
    command="uvx",
    args=["mcp-server-slack"],
    env={"SLACK_TOKEN": "..."}
))

# Call tools from any server
issue = await orchestrator.call_tool("github.create_issue", {
    "repo": "owner/repo",
    "title": "Bug report",
    "body": "Details..."
})

message = await orchestrator.call_tool("slack.send_message", {
    "channel": "#dev",
    "text": f"Created issue: {issue}"
})`}</code></pre>

          <h2>Building an LLM-Powered Client</h2>
          
          <p>
            Here's how to build an AI agent that uses MCP tools:
          </p>

          <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto"><code className="language-python">{`import json
from anthropic import Anthropic

class MCPAgent:
    """An LLM agent that can use MCP tools."""
    
    def __init__(self, orchestrator: MCPOrchestrator):
        self.orchestrator = orchestrator
        self.client = Anthropic()
        self.messages = []
    
    def _get_tool_definitions(self) -> list:
        """Convert MCP tools to Claude's tool format."""
        tools = []
        for tool_name, server_name in self.orchestrator.tools.items():
            session = self.orchestrator.sessions[server_name]
            # Get tool schema from server
            # (You'd cache this in practice)
            tool_def = {
                "name": tool_name.replace(".", "_"),  # Claude doesn't like dots
                "description": f"Tool from {server_name}",
                "input_schema": {"type": "object", "properties": {}}
            }
            tools.append(tool_def)
        return tools
    
    async def chat(self, user_message: str) -> str:
        """Process a message and use tools as needed."""
        self.messages.append({"role": "user", "content": user_message})
        
        while True:
            # Call Claude with tools
            response = self.client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=4096,
                tools=self._get_tool_definitions(),
                messages=self.messages
            )
            
            # Check if Claude wants to use a tool
            if response.stop_reason == "tool_use":
                tool_results = []
                
                for block in response.content:
                    if block.type == "tool_use":
                        # Execute the tool via MCP
                        tool_name = block.name.replace("_", ".")
                        result = await self.orchestrator.call_tool(
                            tool_name,
                            block.input
                        )
                        tool_results.append({
                            "type": "tool_result",
                            "tool_use_id": block.id,
                            "content": str(result)
                        })
                
                # Add assistant message and tool results
                self.messages.append({"role": "assistant", "content": response.content})
                self.messages.append({"role": "user", "content": tool_results})
                
            else:
                # Final response
                self.messages.append({"role": "assistant", "content": response.content})
                return response.content[0].text

# Usage
orchestrator = MCPOrchestrator()
await orchestrator.connect_server(...)

agent = MCPAgent(orchestrator)
response = await agent.chat("Check my GitHub notifications and summarize them")
print(response)`}</code></pre>

          <h2>HTTP/SSE Client (Alternative Transport)</h2>
          
          <p>
            For remote servers, use HTTP/SSE instead of stdio:
          </p>

          <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto"><code className="language-python">{`from mcp.client.sse import sse_client

async def connect_remote_server(url: str):
    """Connect to an MCP server over HTTP/SSE."""
    
    async with sse_client(url) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            
            # Use normally
            tools = await session.list_tools()
            print(f"Remote tools: {[t.name for t in tools.tools]}")
            
            result = await session.call_tool("some_tool", {"arg": "value"})
            return result

# Connect to remote server
await connect_remote_server("http://localhost:3000/mcp")`}</code></pre>

          <h2>Error Handling Best Practices</h2>
          
          <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto"><code className="language-python">{`from mcp.types import McpError

class MCPClientError(Exception):
    """Custom error for MCP client issues."""
    pass

async def safe_call_tool(session: ClientSession, name: str, args: dict):
    """Call a tool with proper error handling."""
    try:
        result = await asyncio.wait_for(
            session.call_tool(name, args),
            timeout=30.0  # 30 second timeout
        )
        
        # Check for error in result
        if result.isError:
            raise MCPClientError(f"Tool returned error: {result.content}")
        
        return result
        
    except asyncio.TimeoutError:
        raise MCPClientError(f"Tool {name} timed out after 30 seconds")
    except McpError as e:
        raise MCPClientError(f"MCP protocol error: {e}")
    except ConnectionError:
        raise MCPClientError("Lost connection to MCP server")

async def call_with_retry(session: ClientSession, name: str, args: dict, retries: int = 3):
    """Call a tool with retries on transient failures."""
    last_error = None
    
    for attempt in range(retries):
        try:
            return await safe_call_tool(session, name, args)
        except MCPClientError as e:
            last_error = e
            if "timed out" in str(e) or "connection" in str(e).lower():
                await asyncio.sleep(2 ** attempt)  # Exponential backoff
                continue
            raise  # Don't retry on other errors
    
    raise last_error`}</code></pre>

          <h2>Testing Your Client</h2>
          
          <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto"><code className="language-python">{`import pytest
from unittest.mock import AsyncMock, MagicMock

@pytest.fixture
def mock_session():
    """Create a mock MCP session for testing."""
    session = AsyncMock(spec=ClientSession)
    
    # Mock tool list
    mock_tool = MagicMock()
    mock_tool.name = "test_tool"
    mock_tool.description = "A test tool"
    session.list_tools.return_value = MagicMock(tools=[mock_tool])
    
    # Mock tool call
    mock_result = MagicMock()
    mock_content = MagicMock()
    mock_content.type = "text"
    mock_content.text = "Tool result"
    mock_result.content = [mock_content]
    session.call_tool.return_value = mock_result
    
    return session

@pytest.mark.asyncio
async def test_discover_tools(mock_session):
    """Test that we can discover server tools."""
    tools = await mock_session.list_tools()
    assert len(tools.tools) == 1
    assert tools.tools[0].name == "test_tool"

@pytest.mark.asyncio
async def test_call_tool(mock_session):
    """Test calling a tool."""
    result = await call_tool(mock_session, "test_tool", {"arg": "value"})
    assert result == "Tool result"
    mock_session.call_tool.assert_called_once_with("test_tool", {"arg": "value"})`}</code></pre>

          <h2>Complete Example: GitHub Issue Manager</h2>
          
          <p>
            Here's a complete example of a CLI tool that uses an MCP client:
          </p>

          <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto"><code className="language-python">{`#!/usr/bin/env python3
"""GitHub Issue Manager using MCP."""

import asyncio
import argparse
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

class GitHubMCPClient:
    def __init__(self):
        self.session = None
    
    async def connect(self):
        server_params = StdioServerParameters(
            command="uvx",
            args=["mcp-server-github"],
        )
        
        self._read, self._write = await stdio_client(server_params).__aenter__()
        self.session = await ClientSession(self._read, self._write).__aenter__()
        await self.session.initialize()
    
    async def list_issues(self, repo: str, state: str = "open"):
        result = await self.session.call_tool("list_issues", {
            "owner": repo.split("/")[0],
            "repo": repo.split("/")[1],
            "state": state
        })
        return result.content[0].text
    
    async def create_issue(self, repo: str, title: str, body: str):
        result = await self.session.call_tool("create_issue", {
            "owner": repo.split("/")[0],
            "repo": repo.split("/")[1],
            "title": title,
            "body": body
        })
        return result.content[0].text
    
    async def close_issue(self, repo: str, issue_number: int):
        result = await self.session.call_tool("update_issue", {
            "owner": repo.split("/")[0],
            "repo": repo.split("/")[1],
            "issue_number": issue_number,
            "state": "closed"
        })
        return result.content[0].text

async def main():
    parser = argparse.ArgumentParser(description="Manage GitHub issues via MCP")
    parser.add_argument("repo", help="Repository (owner/repo)")
    subparsers = parser.add_subparsers(dest="command")
    
    # List command
    list_parser = subparsers.add_parser("list", help="List issues")
    list_parser.add_argument("--state", default="open", choices=["open", "closed", "all"])
    
    # Create command
    create_parser = subparsers.add_parser("create", help="Create issue")
    create_parser.add_argument("--title", required=True)
    create_parser.add_argument("--body", default="")
    
    # Close command
    close_parser = subparsers.add_parser("close", help="Close issue")
    close_parser.add_argument("issue_number", type=int)
    
    args = parser.parse_args()
    
    client = GitHubMCPClient()
    await client.connect()
    
    if args.command == "list":
        print(await client.list_issues(args.repo, args.state))
    elif args.command == "create":
        print(await client.create_issue(args.repo, args.title, args.body))
    elif args.command == "close":
        print(await client.close_issue(args.repo, args.issue_number))

if __name__ == "__main__":
    asyncio.run(main())`}</code></pre>

          <div className="bg-blue-950 border border-blue-800 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold mb-3 mt-0">Key Takeaways</h3>
            <ul className="text-gray-300 mb-0">
              <li><strong>Use the official SDKs</strong> — Don't implement the protocol yourself</li>
              <li><strong>Handle errors gracefully</strong> — Timeouts, disconnections, and invalid responses</li>
              <li><strong>Cache tool schemas</strong> — Don't re-fetch on every call</li>
              <li><strong>Namespace tools</strong> — When using multiple servers, avoid name collisions</li>
              <li><strong>Test with mocks</strong> — Don't hit real servers in unit tests</li>
            </ul>
          </div>

          <h2>Next Steps</h2>
          
          <p>
            Now that you can build MCP clients, explore:
          </p>
          
          <ul>
            <li><a href="/mcp/how-to-build-mcp-server-python" className="text-blue-400 hover:text-blue-300">Build your own MCP server</a> to use with your client</li>
            <li><a href="/mcp/testing-mcp-servers" className="text-blue-400 hover:text-blue-300">Testing strategies</a> for comprehensive client tests</li>
            <li><a href="/mcp/mcp-performance-optimization" className="text-blue-400 hover:text-blue-300">Performance optimization</a> for production clients</li>
          </ul>

          <hr className="my-12 border-gray-800" />
          
          <p className="text-gray-400">
            Have questions about building MCP clients? Find me on <a href="https://x.com/kaigritun" className="text-blue-400 hover:text-blue-300">X @kaigritun</a>.
          </p>
        </article>
      </div>
    </main>
  )
}