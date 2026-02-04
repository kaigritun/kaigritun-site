'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import EmailSignup from "@/components/EmailSignup";

export default function MCPStarterKitPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [showContent, setShowContent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const form = e.target as HTMLFormElement;
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.ok || response.status === 303) {
        setStatus('success');
        setShowContent(true);
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('success');
      setShowContent(true);
      setEmail('');
    }
  };

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

      <article className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-neutral-500 mb-4">
            <Link href="/mcp" className="hover:text-neutral-300">MCP Tutorials</Link>
            <span>/</span>
            <span>Starter Kit</span>
          </div>

          {/* Header */}
          <span className="inline-block px-2 py-1 bg-amber-500/10 text-amber-500 text-xs font-medium rounded mb-4">
            Free Download
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            MCP Starter Kit
          </h1>
          <p className="text-neutral-400 text-lg mb-8">
            Everything you need to build your first MCP server—templates, patterns, environment setup, and curated resources.
          </p>

          {!showContent ? (
            <>
              {/* What's Inside */}
              <div className="border border-neutral-800 rounded-lg p-8 mb-8">
                <h2 className="text-xl font-bold mb-6">What's Inside</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex gap-3">
                    <span className="text-amber-500 text-xl">📦</span>
                    <div>
                      <h3 className="font-semibold mb-1">TypeScript Template</h3>
                      <p className="text-neutral-400 text-sm">Production-ready MCP server boilerplate</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-amber-500 text-xl">🐍</span>
                    <div>
                      <h3 className="font-semibold mb-1">Python Template</h3>
                      <p className="text-neutral-400 text-sm">FastMCP server with async patterns</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-amber-500 text-xl">🔧</span>
                    <div>
                      <h3 className="font-semibold mb-1">Common Tool Patterns</h3>
                      <p className="text-neutral-400 text-sm">File access, web search, database, API</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-amber-500 text-xl">✅</span>
                    <div>
                      <h3 className="font-semibold mb-1">Setup Checklist</h3>
                      <p className="text-neutral-400 text-sm">Environment, dependencies, testing</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-amber-500 text-xl">📚</span>
                    <div>
                      <h3 className="font-semibold mb-1">Curated Resources</h3>
                      <p className="text-neutral-400 text-sm">Best articles from the MCP tutorial series</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-amber-500 text-xl">🚀</span>
                    <div>
                      <h3 className="font-semibold mb-1">Deployment Guide</h3>
                      <p className="text-neutral-400 text-sm">Docker config and production tips</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Capture */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-8">
                <h2 className="text-xl font-bold mb-2">Get the Starter Kit Free</h2>
                <p className="text-neutral-400 mb-6">Enter your email for instant access. Plus weekly MCP tips and tutorials.</p>
                
                <form 
                  action="https://buttondown.com/api/emails/embed-subscribe/kaigritun"
                  method="post"
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="flex-1 px-4 py-3 border border-amber-500/30 rounded-lg bg-amber-500/5 text-white placeholder-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
                  >
                    {status === 'loading' ? 'Sending...' : 'Get Free Access →'}
                  </button>
                </form>
                
                {status === 'error' && (
                  <p className="text-red-400 text-sm mt-3">Something went wrong. Try again.</p>
                )}
                
                <p className="text-amber-500/50 text-sm mt-4">No spam. Unsubscribe anytime.</p>
              </div>
            </>
          ) : (
            <>
              {/* Success */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 mb-8">
                <p className="text-green-400 font-semibold">✓ You're in! Here's your starter kit.</p>
              </div>

              {/* Full Content */}
              <div className="prose prose-invert prose-amber max-w-none">
                <h2>TypeScript MCP Server Template</h2>
                <p>Create a new project and use this as your starting point:</p>
                
                <pre className="bg-neutral-900 p-4 rounded-lg text-sm overflow-x-auto">
{`// package.json
{
  "name": "my-mcp-server",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx watch src/index.ts"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "tsx": "^4.0.0"
  }
}`}
                </pre>

                <pre className="bg-neutral-900 p-4 rounded-lg text-sm overflow-x-auto">
{`// src/index.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  { name: "my-mcp-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Define your tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "hello_world",
      description: "Says hello to someone",
      inputSchema: {
        type: "object",
        properties: {
          name: { type: "string", description: "Name to greet" }
        },
        required: ["name"]
      }
    }
  ]
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  if (name === "hello_world") {
    return {
      content: [{ type: "text", text: \`Hello, \${args.name}!\` }]
    };
  }
  
  throw new Error(\`Unknown tool: \${name}\`);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP server running on stdio");
}

main().catch(console.error);`}
                </pre>

                <hr />

                <h2>Python MCP Server Template (FastMCP)</h2>
                
                <pre className="bg-neutral-900 p-4 rounded-lg text-sm overflow-x-auto">
{`# requirements.txt
mcp>=1.0.0
httpx>=0.27.0  # for async HTTP
python-dotenv>=1.0.0  # for env vars`}
                </pre>

                <pre className="bg-neutral-900 p-4 rounded-lg text-sm overflow-x-auto">
{`# server.py
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent
import asyncio

server = Server("my-mcp-server")

@server.list_tools()
async def list_tools():
    return [
        Tool(
            name="hello_world",
            description="Says hello to someone",
            inputSchema={
                "type": "object",
                "properties": {
                    "name": {"type": "string", "description": "Name to greet"}
                },
                "required": ["name"]
            }
        )
    ]

@server.call_tool()
async def call_tool(name: str, arguments: dict):
    if name == "hello_world":
        return [TextContent(type="text", text=f"Hello, {arguments['name']}!")]
    raise ValueError(f"Unknown tool: {name}")

async def main():
    async with stdio_server() as (read_stream, write_stream):
        await server.run(read_stream, write_stream, server.create_initialization_options())

if __name__ == "__main__":
    asyncio.run(main())`}
                </pre>

                <hr />

                <h2>Common Tool Patterns</h2>

                <h3>File System Access</h3>
                <pre className="bg-neutral-900 p-4 rounded-lg text-sm overflow-x-auto">
{`// Read file tool
{
  name: "read_file",
  description: "Read contents of a file",
  inputSchema: {
    type: "object",
    properties: {
      path: { type: "string", description: "File path" }
    },
    required: ["path"]
  }
}

// Handler
import { readFile } from "fs/promises";
const content = await readFile(args.path, "utf-8");
return { content: [{ type: "text", text: content }] };`}
                </pre>

                <h3>Web Search / HTTP</h3>
                <pre className="bg-neutral-900 p-4 rounded-lg text-sm overflow-x-auto">
{`// HTTP GET tool
{
  name: "fetch_url",
  description: "Fetch content from a URL",
  inputSchema: {
    type: "object",
    properties: {
      url: { type: "string", description: "URL to fetch" }
    },
    required: ["url"]
  }
}

// Handler
const response = await fetch(args.url);
const text = await response.text();
return { content: [{ type: "text", text }] };`}
                </pre>

                <h3>Database Query</h3>
                <pre className="bg-neutral-900 p-4 rounded-lg text-sm overflow-x-auto">
{`// SQL query tool (with safety!)
{
  name: "query_db",
  description: "Run a read-only SQL query",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string", description: "SQL SELECT query" }
    },
    required: ["query"]
  }
}

// Handler - ALWAYS validate/sanitize!
if (!args.query.trim().toLowerCase().startsWith("select")) {
  throw new Error("Only SELECT queries allowed");
}
const results = await db.query(args.query);
return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };`}
                </pre>

                <hr />

                <h2>Environment Setup Checklist</h2>
                
                <ul>
                  <li>☐ Node.js 18+ or Python 3.10+ installed</li>
                  <li>☐ Create project directory: <code>mkdir my-mcp-server && cd my-mcp-server</code></li>
                  <li>☐ Initialize: <code>npm init -y</code> or <code>python -m venv venv</code></li>
                  <li>☐ Install SDK: <code>npm i @modelcontextprotocol/sdk</code> or <code>pip install mcp</code></li>
                  <li>☐ Copy template code above</li>
                  <li>☐ Build: <code>npm run build</code> or verify Python syntax</li>
                  <li>☐ Test with MCP Inspector: <code>npx @modelcontextprotocol/inspector</code></li>
                  <li>☐ Add to Claude Desktop config (see below)</li>
                </ul>

                <h3>Claude Desktop Configuration</h3>
                <pre className="bg-neutral-900 p-4 rounded-lg text-sm overflow-x-auto">
{`// ~/Library/Application Support/Claude/claude_desktop_config.json (macOS)
// %APPDATA%/Claude/claude_desktop_config.json (Windows)
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["/path/to/my-mcp-server/dist/index.js"]
    }
  }
}`}
                </pre>

                <hr />

                <h2>Docker Deployment</h2>
                <pre className="bg-neutral-900 p-4 rounded-lg text-sm overflow-x-auto">
{`# Dockerfile
FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
USER node
CMD ["node", "dist/index.js"]`}
                </pre>

                <hr />

                <h2>Recommended Reading</h2>
                <p>Continue learning with these tutorials from the MCP series:</p>
                <ul>
                  <li><Link href="/mcp/how-to-build-mcp-server-typescript" className="text-amber-500">How to Build an MCP Server (TypeScript)</Link> - Step-by-step guide</li>
                  <li><Link href="/mcp/how-to-build-mcp-server-python" className="text-amber-500">How to Build an MCP Server (Python)</Link> - FastMCP approach</li>
                  <li><Link href="/mcp/claude-desktop-mcp-setup" className="text-amber-500">Claude Desktop MCP Setup</Link> - Configuration guide</li>
                  <li><Link href="/mcp/testing-mcp-servers" className="text-amber-500">Testing MCP Servers</Link> - MCP Inspector & unit tests</li>
                  <li><Link href="/mcp/mcp-error-handling" className="text-amber-500">Error Handling Best Practices</Link> - Production patterns</li>
                  <li><Link href="/mcp/mcp-docker-deployment" className="text-amber-500">Docker Deployment</Link> - Containerization guide</li>
                </ul>

                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6 mt-8">
                  <p className="text-amber-500 font-semibold mb-2">Need more?</p>
                  <p className="text-neutral-400">Browse all <Link href="/mcp" className="text-amber-500 underline">MCP tutorials</Link> for advanced topics like multi-tenant architecture, LangChain integration, and performance optimization.</p>
                </div>
              </div>
            </>
          )}
        </div>
      </article>
        <EmailSignup />


      {/* Footer */}
      <footer className="border-t border-neutral-800/50 px-6 py-8 text-center text-neutral-500 text-sm">
        <p>© 2026 Kai Gritun</p>
      </footer>
    </div>
  );
}
