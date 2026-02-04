import { Metadata } from 'next';
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: 'Building Your First MCP Server in TypeScript | MCP Tutorials',
  description: 'Step-by-step tutorial to build a complete MCP server in TypeScript. Learn project setup, tool registration, error handling, and Claude Desktop integration.',
  keywords: ['MCP server TypeScript', 'MCP tutorial', 'TypeScript MCP', 'Model Context Protocol', 'Claude Desktop MCP'],
  openGraph: {
    title: 'Building Your First MCP Server in TypeScript',
    description: 'Complete tutorial for building MCP servers with TypeScript and the official SDK.',
    type: 'article',
  },
}

export default function MCPTypeScriptTutorial() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <a href="/mcp" className="text-purple-400 hover:text-purple-300">← Back to MCP Tutorials</a>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 text-sm font-medium bg-blue-500/20 text-blue-300 rounded-full">Tutorial</span>
            <span className="text-gray-400 text-sm">14 min read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Building Your First MCP Server in TypeScript
          </h1>
          <p className="text-xl text-gray-300">
            A complete walkthrough from project setup to Claude Desktop integration. Build a working MCP server in under 30 minutes.
          </p>
        </header>

        {/* Prerequisites */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 mb-12">
          <h3 className="text-lg font-semibold text-blue-300 mb-3">Prerequisites</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• Node.js 18+</li>
            <li>• TypeScript basics</li>
            <li>• Claude Desktop installed (optional, for testing)</li>
          </ul>
        </div>

        {/* Table of Contents */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-12 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Contents</h2>
          <ul className="space-y-2 text-gray-300">
            <li><a href="#step-1" className="hover:text-purple-400">→ Step 1: Project Setup</a></li>
            <li><a href="#step-2" className="hover:text-purple-400">→ Step 2: Basic Server Structure</a></li>
            <li><a href="#step-3" className="hover:text-purple-400">→ Step 3: Build and Test</a></li>
            <li><a href="#step-4" className="hover:text-purple-400">→ Step 4: Add More Tools</a></li>
            <li><a href="#step-5" className="hover:text-purple-400">→ Step 5: Connect to Claude Desktop</a></li>
            <li><a href="#step-6" className="hover:text-purple-400">→ Step 6: Error Handling</a></li>
            <li><a href="#next-steps" className="hover:text-purple-400">→ Next Steps</a></li>
          </ul>
        </div>

        {/* Article Content */}
        <article className="prose prose-invert prose-lg max-w-none">
          
          {/* Step 1 */}
          <section id="step-1" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Step 1: Project Setup</h2>
            
            <p className="text-gray-300 mb-6">
              Create a new directory and initialize your TypeScript project:
            </p>

            <div className="bg-gray-950 rounded-lg p-6 mb-6 overflow-x-auto">
              <div className="text-xs text-gray-500 mb-2">Terminal</div>
              <pre className="text-sm text-gray-300"><code>{`mkdir my-mcp-server
cd my-mcp-server
npm init -y
npm install @modelcontextprotocol/sdk zod
npm install -D typescript @types/node
npx tsc --init`}</code></pre>
            </div>

            <p className="text-gray-300 mb-6">
              Update <code className="text-purple-400">tsconfig.json</code>:
            </p>

            <div className="bg-gray-950 rounded-lg p-6 mb-6 overflow-x-auto">
              <div className="text-xs text-gray-500 mb-2">tsconfig.json</div>
              <pre className="text-sm text-gray-300"><code>{`{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "strict": true
  }
}`}</code></pre>
            </div>
          </section>

          {/* Step 2 */}
          <section id="step-2" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Step 2: Basic Server Structure</h2>
            
            <p className="text-gray-300 mb-6">
              Create <code className="text-purple-400">src/index.ts</code>:
            </p>

            <div className="bg-gray-950 rounded-lg p-6 mb-6 overflow-x-auto">
              <div className="text-xs text-gray-500 mb-2">src/index.ts</div>
              <pre className="text-sm text-gray-300"><code>{`import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  {
    name: "my-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "hello",
      description: "Says hello to someone",
      inputSchema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Name to greet",
          },
        },
        required: ["name"],
      },
    },
  ],
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "hello") {
    const name = request.params.arguments?.name as string;
    return {
      content: [
        {
          type: "text",
          text: \`Hello, \${name}! 👋\`,
        },
      ],
    };
  }
  throw new Error(\`Unknown tool: \${request.params.name}\`);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP server running");
}

main().catch(console.error);`}</code></pre>
            </div>
          </section>

          {/* Step 3 */}
          <section id="step-3" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Step 3: Build and Test</h2>
            
            <p className="text-gray-300 mb-6">
              Add scripts to <code className="text-purple-400">package.json</code>:
            </p>

            <div className="bg-gray-950 rounded-lg p-6 mb-6 overflow-x-auto">
              <div className="text-xs text-gray-500 mb-2">package.json (partial)</div>
              <pre className="text-sm text-gray-300"><code>{`{
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  }
}`}</code></pre>
            </div>

            <p className="text-gray-300 mb-6">Build and test:</p>

            <div className="bg-gray-950 rounded-lg p-6 mb-6 overflow-x-auto">
              <div className="text-xs text-gray-500 mb-2">Terminal</div>
              <pre className="text-sm text-gray-300"><code>{`# Build
npm run build

# Test locally
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | npm run start`}</code></pre>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
              <p className="text-green-200 text-sm">
                <strong>Success!</strong> You should see a JSON response listing your "hello" tool.
              </p>
            </div>
          </section>

          {/* Step 4 */}
          <section id="step-4" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Step 4: Add More Tools</h2>
            
            <p className="text-gray-300 mb-6">
              Let's add a practical tool—a word counter:
            </p>

            <div className="bg-gray-950 rounded-lg p-6 mb-6 overflow-x-auto">
              <div className="text-xs text-gray-500 mb-2">src/index.ts (updated)</div>
              <pre className="text-sm text-gray-300"><code>{`server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "hello",
      description: "Says hello to someone",
      inputSchema: {
        type: "object",
        properties: {
          name: { type: "string", description: "Name to greet" },
        },
        required: ["name"],
      },
    },
    {
      name: "word_count",
      description: "Counts words in text",
      inputSchema: {
        type: "object",
        properties: {
          text: { type: "string", description: "Text to count words in" },
        },
        required: ["text"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "hello":
      const name = request.params.arguments?.name as string;
      return {
        content: [{ type: "text", text: \`Hello, \${name}! 👋\` }],
      };
    
    case "word_count":
      const text = request.params.arguments?.text as string;
      const words = text.trim().split(/\\s+/).length;
      return {
        content: [{ type: "text", text: \`Word count: \${words}\` }],
      };
    
    default:
      throw new Error(\`Unknown tool: \${request.params.name}\`);
  }
});`}</code></pre>
            </div>
          </section>

          {/* Step 5 */}
          <section id="step-5" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Step 5: Connect to Claude Desktop</h2>
            
            <p className="text-gray-300 mb-6">
              Edit <code className="text-purple-400">~/Library/Application Support/Claude/claude_desktop_config.json</code> (macOS) or the equivalent path on your OS:
            </p>

            <div className="bg-gray-950 rounded-lg p-6 mb-6 overflow-x-auto">
              <div className="text-xs text-gray-500 mb-2">claude_desktop_config.json</div>
              <pre className="text-sm text-gray-300"><code>{`{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["/absolute/path/to/my-mcp-server/dist/index.js"]
    }
  }
}`}</code></pre>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
              <p className="text-amber-200 text-sm">
                <strong>Important:</strong> Use the absolute path to your compiled JavaScript file. Restart Claude Desktop after editing the config.
              </p>
            </div>

            <p className="text-gray-300 mb-6">
              Your tools now appear in the 🔨 menu in Claude Desktop!
            </p>
          </section>

          {/* Step 6 */}
          <section id="step-6" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Step 6: Error Handling</h2>
            
            <p className="text-gray-300 mb-6">
              Add proper error handling with Zod validation:
            </p>

            <div className="bg-gray-950 rounded-lg p-6 mb-6 overflow-x-auto">
              <div className="text-xs text-gray-500 mb-2">src/index.ts (with validation)</div>
              <pre className="text-sm text-gray-300"><code>{`import { z } from "zod";

const HelloArgsSchema = z.object({
  name: z.string().min(1),
});

const WordCountArgsSchema = z.object({
  text: z.string().min(1),
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    switch (request.params.name) {
      case "hello": {
        const args = HelloArgsSchema.parse(request.params.arguments);
        return {
          content: [{ type: "text", text: \`Hello, \${args.name}! 👋\` }],
        };
      }
      
      case "word_count": {
        const args = WordCountArgsSchema.parse(request.params.arguments);
        const words = args.text.trim().split(/\\s+/).length;
        return {
          content: [{ type: "text", text: \`Word count: \${words}\` }],
        };
      }
      
      default:
        throw new Error(\`Unknown tool: \${request.params.name}\`);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        content: [{ 
          type: "text", 
          text: \`Invalid arguments: \${error.message}\` 
        }],
        isError: true,
      };
    }
    throw error;
  }
});`}</code></pre>
            </div>
          </section>

          {/* Next Steps */}
          <section id="next-steps" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Next Steps</h2>
            
            <p className="text-gray-300 mb-6">
              Now that you have a working MCP server, explore these advanced topics:
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-2">📦 Add Resources</h4>
                <p className="text-gray-400 text-sm">Expose data that Claude can read and reference</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-2">📝 Implement Prompts</h4>
                <p className="text-gray-400 text-sm">Create reusable prompt templates</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-2">🌐 HTTP Transport</h4>
                <p className="text-gray-400 text-sm">Deploy to a remote server with SSE</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-2">📤 Publish to npm</h4>
                <p className="text-gray-400 text-sm">Share your server with others</p>
              </div>
            </div>
          </section>

        </article>

        {/* Email Signup */}
        <div className="my-16">
          <EmailSignup />
        </div>

        {/* Related Links */}
        <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-8 border border-purple-500/30 mb-16">
          <h3 className="text-xl font-semibold text-white mb-4">Continue Learning</h3>
          <ul className="space-y-2 text-gray-300">
            <li>→ <a href="/mcp/mcp-resources-guide" className="text-purple-400 hover:text-purple-300">MCP Resources Deep Dive</a></li>
            <li>→ <a href="/mcp/mcp-vs-langchain" className="text-purple-400 hover:text-purple-300">MCP vs LangChain: When to Use Each</a></li>
            <li>→ <a href="/mcp/mcp-error-handling" className="text-purple-400 hover:text-purple-300">Advanced Error Handling Patterns</a></li>
            <li>→ <a href="/mcp/mcp-docker-deployment" className="text-purple-400 hover:text-purple-300">Deploy with Docker</a></li>
          </ul>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <a href="/mcp" className="text-purple-400 hover:text-purple-300">← Back to MCP Tutorials</a>
            <span className="text-gray-500 text-sm">February 3, 2026</span>
          </div>
        </footer>
      </div>
    </main>
  )
}
