import type { Metadata } from "next";
import EmailSignup from "@/components/EmailSignup";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Building MCP Servers with TypeScript: Complete Guide",
  description:
    "Learn to build MCP servers in TypeScript with type safety, proper SDK usage, error handling, and deployment. Full tutorial with code examples.",
  openGraph: {
    title: "Building MCP Servers with TypeScript: Complete Guide",
    description:
      "Learn to build MCP servers in TypeScript with type safety, proper SDK usage, error handling, and deployment. Full tutorial with code examples.",
    type: "article",
    publishedTime: "2025-02-04",
  },
  twitter: {
    card: "summary_large_image",
    title: "Building MCP Servers with TypeScript",
    description: "Type-safe MCP servers with the official SDK",
  },
};

export default function MCPTypeScriptServerGuide() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-8">
        <Link href="/mcp" className="text-gray-400 hover:text-white transition">
          ← Back to MCP Tutorials
        </Link>
      </div>

      <article className="prose prose-lg prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-4">
          Building MCP Servers with TypeScript: Complete Guide
        </h1>

        <p className="text-gray-400 text-sm mb-8">
          Published February 4, 2025 · 15 min read
        </p>

        <p className="lead text-xl text-gray-300">
          Building MCP servers in TypeScript gives you type safety, better IDE support, 
          and the full power of the Node.js ecosystem. This guide walks through everything 
          from setup to deployment.
        </p>

        <h2>Why TypeScript for MCP?</h2>

        <p>
          TypeScript catches errors before runtime. When you&apos;re building tools that AI 
          assistants will use, that reliability matters. A type error in production means 
          your AI can&apos;t complete tasks.
        </p>

        <p>The MCP SDK has first-class TypeScript support with full type definitions.</p>

        <h2>Quick Setup</h2>

        <pre><code className="language-bash">{`mkdir my-mcp-server && cd my-mcp-server
npm init -y
npm install @modelcontextprotocol/sdk typescript @types/node
npx tsc --init`}</code></pre>

        <p>Configure <code>tsconfig.json</code>:</p>

        <pre><code className="language-json">{`{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}`}</code></pre>

        <h2>Your First TypeScript MCP Server</h2>

        <p>Create <code>src/index.ts</code>:</p>

        <pre><code className="language-typescript">{`import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Define your tools with proper typing
interface WeatherParams {
  city: string;
  units?: "celsius" | "fahrenheit";
}

const server = new Server(
  { name: "weather-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_weather",
      description: "Get current weather for a city",
      inputSchema: {
        type: "object",
        properties: {
          city: { type: "string", description: "City name" },
          units: { 
            type: "string", 
            enum: ["celsius", "fahrenheit"],
            default: "celsius"
          }
        },
        required: ["city"]
      }
    }
  ]
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_weather") {
    const params = request.params.arguments as WeatherParams;
    // Your weather API logic here
    return {
      content: [
        {
          type: "text",
          text: \`Weather in \${params.city}: 72°F, sunny\`
        }
      ]
    };
  }
  throw new Error(\`Unknown tool: \${request.params.name}\`);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Weather MCP server running");
}

main().catch(console.error);`}</code></pre>

        <h2>Type-Safe Tool Parameters</h2>

        <p>Create reusable types for your tools:</p>

        <pre><code className="language-typescript">{`// types.ts
export interface ToolResponse {
  content: Array<{
    type: "text" | "image" | "resource";
    text?: string;
    data?: string;
    mimeType?: string;
  }>;
  isError?: boolean;
}

export interface DatabaseQueryParams {
  query: string;
  parameters?: Record<string, unknown>;
}

export interface FileOperationParams {
  path: string;
  content?: string;
  encoding?: BufferEncoding;
}`}</code></pre>

        <h2>Error Handling in TypeScript</h2>

        <pre><code className="language-typescript">{`class MCPError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "MCPError";
  }
}

function handleToolCall(name: string, args: unknown): ToolResponse {
  try {
    // Validate with type guards
    if (!isValidParams(args)) {
      throw new MCPError(
        "Invalid parameters",
        "INVALID_PARAMS",
        { received: args }
      );
    }
    // Process...
  } catch (error) {
    if (error instanceof MCPError) {
      return {
        content: [{ type: "text", text: error.message }],
        isError: true
      };
    }
    throw error;
  }
}

// Type guard example
function isValidParams(obj: unknown): obj is WeatherParams {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "city" in obj &&
    typeof (obj as WeatherParams).city === "string"
  );
}`}</code></pre>

        <h2>Building and Running</h2>

        <p>Add scripts to <code>package.json</code>:</p>

        <pre><code className="language-json">{`{
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsc --watch"
  }
}`}</code></pre>

        <p>Build and test:</p>

        <pre><code className="language-bash">{`npm run build
node dist/index.js`}</code></pre>

        <h2>Connecting to Claude Desktop</h2>

        <p>Add to <code>claude_desktop_config.json</code>:</p>

        <pre><code className="language-json">{`{
  "mcpServers": {
    "weather": {
      "command": "node",
      "args": ["/path/to/your/dist/index.js"]
    }
  }
}`}</code></pre>

        <h2>Best Practices</h2>

        <ol>
          <li><strong>Use strict mode</strong> — Catches more errors at compile time</li>
          <li><strong>Define interfaces for all tool parameters</strong> — Self-documenting code</li>
          <li><strong>Use type guards</strong> — Validate runtime data safely</li>
          <li><strong>Handle all error cases</strong> — AI assistants need clear error messages</li>
          <li><strong>Export types</strong> — Make your server easy to extend</li>
        </ol>

        <p>
          TypeScript adds a bit of setup overhead but pays off in reliability. When your 
          MCP server handles real tasks, you want that confidence.
        </p>

        <h2>Next Steps</h2>

        <ul>
          <li>Add <Link href="/mcp/mcp-database-integration">database integration</Link> to your server</li>
          <li>Implement <Link href="/mcp/mcp-security-best-practices">security best practices</Link></li>
          <li>Deploy with <Link href="/mcp/mcp-docker-deployment">Docker</Link></li>
        </ul>

        <hr />

        <p>
          <strong>Questions about TypeScript MCP development?</strong> Reach out on{" "}
          <a href="https://twitter.com/kaigritun">Twitter</a>.
        </p>
      </article>

      <div className="mt-16">
        <EmailSignup />
      </div>
    </main>
  );
}
