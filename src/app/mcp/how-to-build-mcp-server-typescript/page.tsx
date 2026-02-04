import Link from "next/link";
import type { Metadata } from "next";
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: "How to Build an MCP Server with TypeScript (2026 Guide) | Kai Gritun",
  description: "Learn to build an MCP server in TypeScript step-by-step. Connect Claude and other LLMs to custom tools with the Model Context Protocol. Production-ready code included.",
  keywords: ["MCP server TypeScript", "build MCP server", "Model Context Protocol tutorial", "MCP TypeScript", "Claude MCP", "MCP SDK"],
};

export default function MCPServerTypeScriptTutorial() {
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
              How to Build an MCP Server with TypeScript
            </h1>
            <p className="text-gray-400 text-lg mb-4">
              Build a production-ready MCP server from scratch. TypeScript is what Anthropic uses 
              for their official examples—here&apos;s how to do it right.
            </p>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>February 3, 2026</span>
              <span>·</span>
              <span>15 min read</span>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            
            <h2>Prerequisites</h2>
            <ul>
              <li>Node.js 18+</li>
              <li>npm or pnpm</li>
              <li>Basic TypeScript knowledge</li>
              <li>Claude Desktop or Cursor IDE (for testing)</li>
            </ul>

            <h2>Quick Start: Minimal MCP Server</h2>
            <p>First, set up your project:</p>
            
            <pre><code className="language-bash">{`mkdir my-mcp-server
cd my-mcp-server
npm init -y
npm install @modelcontextprotocol/sdk zod
npm install -D typescript @types/node
npx tsc --init`}</code></pre>

            <p>Update your <code>tsconfig.json</code>:</p>

            <pre><code className="language-json">{`{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true
  },
  "include": ["src/**/*"]
}`}</code></pre>

            <p>Update <code>package.json</code>:</p>

            <pre><code className="language-json">{`{
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  }
}`}</code></pre>

            <p>Now create your server in <code>src/index.ts</code>:</p>

            <pre><code className="language-typescript">{`import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "my-mcp-server",
  version: "1.0.0",
});

// Define a simple tool
server.tool(
  "get_weather",
  "Get current weather for a city",
  {
    city: z.string().describe("City name"),
  },
  async ({ city }) => {
    // In production, call a real weather API
    return {
      content: [
        {
          type: "text",
          text: \`Weather in \${city}: 72°F, sunny\`,
        },
      ],
    };
  }
);

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);`}</code></pre>

            <p>Build and test:</p>

            <pre><code className="language-bash">{`npm run build
echo '{"jsonrpc":"2.0","method":"tools/list","id":1}' | node dist/index.js`}</code></pre>

            <h2>Adding Resources</h2>
            <p>Resources let Claude read data from your server:</p>

            <pre><code className="language-typescript">{`// Static resource
server.resource(
  "config",
  "config://settings",
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify({ theme: "dark", debug: false }),
      },
    ],
  })
);

// Dynamic resource with template
server.resource(
  "user-profile",
  new ResourceTemplate("user://{userId}/profile", { list: undefined }),
  async (uri, { userId }) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify({ id: userId, name: "Test User" }),
      },
    ],
  })
);`}</code></pre>

            <h2>Adding Prompts</h2>
            <p>Prompts are reusable templates that help Claude handle specific tasks:</p>

            <pre><code className="language-typescript">{`server.prompt(
  "code-review",
  "Review code for issues and improvements",
  {
    language: z.string().describe("Programming language"),
    code: z.string().describe("Code to review"),
  },
  ({ language, code }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: \`Review this \${language} code for bugs, security issues, and improvements:\\n\\n\\\`\\\`\\\`\${language}\\n\${code}\\n\\\`\\\`\\\`\`,
        },
      },
    ],
  })
);`}</code></pre>

            <h2>Connecting to Claude Desktop</h2>
            <p>Add your server to Claude Desktop&apos;s config:</p>
            <p><strong>macOS:</strong> <code>~/Library/Application Support/Claude/claude_desktop_config.json</code></p>
            <p><strong>Windows:</strong> <code>%APPDATA%\Claude\claude_desktop_config.json</code></p>

            <pre><code className="language-json">{`{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["/absolute/path/to/dist/index.js"]
    }
  }
}`}</code></pre>

            <p>Restart Claude Desktop. Your tools will appear in the tools menu.</p>

            <h2>Error Handling Best Practices</h2>
            <p>Always handle errors gracefully:</p>

            <pre><code className="language-typescript">{`import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";

server.tool(
  "fetch_data",
  "Fetch data from external API",
  { endpoint: z.string() },
  async ({ endpoint }) => {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new McpError(
          ErrorCode.InternalError,
          \`API returned \${response.status}\`
        );
      }
      const data = await response.json();
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    } catch (error) {
      if (error instanceof McpError) throw error;
      throw new McpError(
        ErrorCode.InternalError,
        \`Failed to fetch: \${error.message}\`
      );
    }
  }
);`}</code></pre>

            <h2>Full Example: File System Server</h2>
            <p>Here&apos;s a more complete example—a server that lets Claude read and write files:</p>

            <pre><code className="language-typescript">{`import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFile, writeFile, readdir } from "fs/promises";
import { join } from "path";

const ALLOWED_DIR = process.env.MCP_FILES_DIR || "./files";

const server = new McpServer({
  name: "file-server",
  version: "1.0.0",
});

server.tool(
  "read_file",
  "Read contents of a file",
  { path: z.string().describe("Relative file path") },
  async ({ path }) => {
    const fullPath = join(ALLOWED_DIR, path);
    const content = await readFile(fullPath, "utf-8");
    return {
      content: [{ type: "text", text: content }],
    };
  }
);

server.tool(
  "write_file",
  "Write content to a file",
  {
    path: z.string().describe("Relative file path"),
    content: z.string().describe("Content to write"),
  },
  async ({ path, content }) => {
    const fullPath = join(ALLOWED_DIR, path);
    await writeFile(fullPath, content, "utf-8");
    return {
      content: [{ type: "text", text: \`Wrote \${content.length} bytes to \${path}\` }],
    };
  }
);

server.tool(
  "list_files",
  "List files in directory",
  { path: z.string().optional().describe("Relative directory path") },
  async ({ path = "." }) => {
    const fullPath = join(ALLOWED_DIR, path);
    const files = await readdir(fullPath, { withFileTypes: true });
    const list = files.map(f => \`\${f.isDirectory() ? "📁" : "📄"} \${f.name}\`);
    return {
      content: [{ type: "text", text: list.join("\\n") }],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);`}</code></pre>

            <h2>Testing Your Server</h2>
            <p>Use the MCP Inspector for interactive testing:</p>

            <pre><code className="language-bash">{`npx @modelcontextprotocol/inspector node dist/index.js`}</code></pre>

            <p>This opens a web UI where you can:</p>
            <ul>
              <li>List and call tools</li>
              <li>Browse resources</li>
              <li>Test prompts</li>
              <li>See raw JSON-RPC messages</li>
            </ul>

            <h2>Deployment Options</h2>
            
            <h3>As a local process (most common)</h3>
            <p>Configure in Claude Desktop or Cursor as shown above.</p>

            <h3>As a Docker container</h3>
            <pre><code className="language-dockerfile">{`FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
CMD ["node", "dist/index.js"]`}</code></pre>

            <h3>As an HTTP server (for remote access)</h3>
            <p>Use <code>HttpServerTransport</code> instead of <code>StdioServerTransport</code>:</p>

            <pre><code className="language-typescript">{`import { HttpServerTransport } from "@modelcontextprotocol/sdk/server/http.js";

const transport = new HttpServerTransport({ port: 3000 });
await server.connect(transport);`}</code></pre>

            <h2>Key Takeaways</h2>
            <ol>
              <li><strong>Start simple</strong> - Get one tool working before adding complexity</li>
              <li><strong>Use Zod schemas</strong> - They provide validation and generate descriptions</li>
              <li><strong>Handle errors</strong> - Always wrap external calls in try/catch</li>
              <li><strong>Test iteratively</strong> - Use MCP Inspector during development</li>
              <li><strong>Security first</strong> - Validate inputs and restrict file system access</li>
            </ol>

            <h2>Next Steps</h2>
            <p>
              Now that you have a working TypeScript MCP server, explore these related guides:
            </p>
            <ul>
              <li><Link href="/mcp/servers" className="text-blue-400 hover:text-blue-300">Browse the MCP Server Directory</Link> for inspiration</li>
              <li><Link href="/mcp/mcp-error-handling-patterns" className="text-blue-400 hover:text-blue-300">Error handling patterns</Link> for production</li>
              <li><Link href="/mcp/mcp-docker-deployment" className="text-blue-400 hover:text-blue-300">Docker deployment</Link> for containerization</li>
              <li><Link href="/mcp/how-to-build-mcp-server-python" className="text-blue-400 hover:text-blue-300">Python MCP tutorial</Link> if you prefer Python</li>
            </ul>
          </div>

          {/* Email Signup */}
          <div className="mt-12 p-6 bg-gray-900 rounded-lg border border-gray-800">
            <h3 className="text-xl font-semibold mb-2">Get More MCP Tutorials</h3>
            <p className="text-gray-400 mb-4">
              Weekly deep dives on building AI tools. No spam, unsubscribe anytime.
            </p>
            <EmailSignup site="mcp" />
          </div>

          {/* Related Articles */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-4">Related Articles</h3>
            <div className="grid gap-4">
              <Link href="/mcp/how-to-build-mcp-server-python" className="p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors border border-gray-800">
                <h4 className="font-medium mb-1">How to Build an MCP Server in Python</h4>
                <p className="text-sm text-gray-400">FastMCP makes Python MCP development quick and easy</p>
              </Link>
              <Link href="/mcp/mcp-error-handling-patterns" className="p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors border border-gray-800">
                <h4 className="font-medium mb-1">MCP Error Handling Patterns</h4>
                <p className="text-sm text-gray-400">Production-ready error handling for MCP servers</p>
              </Link>
              <Link href="/mcp/servers" className="p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors border border-gray-800">
                <h4 className="font-medium mb-1">MCP Server Directory</h4>
                <p className="text-sm text-gray-400">Browse 29+ MCP servers with search and filters</p>
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-6">
        <div className="max-w-4xl mx-auto text-center text-gray-500 text-sm">
          <p>© 2026 Kai Gritun. Building tools for the AI era.</p>
        </div>
      </footer>
    </div>
  );
}
