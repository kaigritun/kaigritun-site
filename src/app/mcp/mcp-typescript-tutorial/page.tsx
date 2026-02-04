import Link from "next/link";
import type { Metadata } from "next";
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: "How to Build an MCP Server with TypeScript (2026 Guide) | Kai Gritun",
  description: "Learn to build a production-ready MCP server with TypeScript. Type-safe tool definitions, Zod validation, and best practices for reliable AI tool integration.",
  keywords: ["MCP TypeScript", "MCP server TypeScript", "Model Context Protocol TypeScript", "type-safe MCP", "MCP Zod", "TypeScript AI tools"],
};

export default function MCPTypeScriptTutorial() {
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
              TypeScript is the go-to choice for MCP development. Type safety catches bugs before runtime, 
              autocomplete speeds up development, and the tooling is mature.
            </p>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>February 4, 2026</span>
              <span>·</span>
              <span>10 min read</span>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <h2 className="text-2xl font-bold mt-12 mb-4">Why TypeScript for MCP?</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li><strong>Type safety</strong> - Catch protocol errors at compile time</li>
              <li><strong>Better IDE support</strong> - Autocomplete for MCP schemas</li>
              <li><strong>Refactoring confidence</strong> - Change code without fear</li>
              <li><strong>Documentation built-in</strong> - Types serve as docs</li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-4">Prerequisites</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Node.js 18+</li>
              <li>npm or pnpm</li>
              <li>Basic TypeScript knowledge</li>
              <li>Understanding of MCP concepts</li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-4">Project Setup</h2>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`mkdir mcp-typescript-server
cd mcp-typescript-server
npm init -y
npm install @modelcontextprotocol/sdk zod
npm install -D typescript @types/node tsx`}</code>
            </pre>

            <p>Create <code>tsconfig.json</code>:</p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">Basic Server Structure</h2>
            <p>Create <code>src/index.ts</code>:</p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

// Define tool input schemas with Zod
const GreetInputSchema = z.object({
  name: z.string().describe("Name to greet"),
  formal: z.boolean().optional().describe("Use formal greeting"),
});

type GreetInput = z.infer<typeof GreetInputSchema>;

// Create server instance
const server = new Server(
  {
    name: "typescript-mcp-server",
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
      name: "greet",
      description: "Generate a greeting message",
      inputSchema: {
        type: "object",
        properties: {
          name: { type: "string", description: "Name to greet" },
          formal: { type: "boolean", description: "Use formal greeting" },
        },
        required: ["name"],
      },
    },
  ],
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "greet") {
    const input = GreetInputSchema.parse(args);
    const greeting = input.formal
      ? \`Good day, \${input.name}. How may I assist you?\`
      : \`Hey \${input.name}! What's up?\`;

    return {
      content: [{ type: "text", text: greeting }],
    };
  }

  throw new Error(\`Unknown tool: \${name}\`);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("TypeScript MCP server running");
}

main().catch(console.error);`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">Type-Safe Tool Handlers</h2>
            <p>Create a pattern for type-safe tool registration:</p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`// src/tools.ts
import { z } from "zod";

// Tool definition type
interface ToolDefinition<T extends z.ZodType> {
  name: string;
  description: string;
  schema: T;
  handler: (input: z.infer<T>) => Promise<string>;
}

// Create a type-safe tool
function createTool<T extends z.ZodType>(def: ToolDefinition<T>) {
  return def;
}

// Example tools
export const calculateTool = createTool({
  name: "calculate",
  description: "Perform mathematical calculations",
  schema: z.object({
    expression: z.string().describe("Math expression to evaluate"),
  }),
  handler: async ({ expression }) => {
    const result = Function(\`"use strict"; return (\${expression})\`)();
    return \`Result: \${result}\`;
  },
});`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">Error Handling</h2>
            <p>TypeScript helps catch errors, but runtime errors still happen:</p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";

export function handleToolError(error: unknown, toolName: string): never {
  if (error instanceof z.ZodError) {
    throw new McpError(
      ErrorCode.InvalidParams,
      \`Invalid parameters for \${toolName}: \${error.message}\`
    );
  }

  if (error instanceof Error) {
    throw new McpError(
      ErrorCode.InternalError,
      \`\${toolName} failed: \${error.message}\`
    );
  }

  throw new McpError(ErrorCode.InternalError, \`Unknown error in \${toolName}\`);
}`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">Building and Running</h2>
            <p>Add scripts to <code>package.json</code>:</p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx src/index.ts"
  }
}`}</code>
            </pre>

            <p>Build and test:</p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`npm run build
echo '{"jsonrpc":"2.0","method":"tools/list","id":1}' | node dist/index.js`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">Claude Desktop Configuration</h2>
            <p>Add to <code>claude_desktop_config.json</code>:</p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`{
  "mcpServers": {
    "typescript-server": {
      "command": "node",
      "args": ["/path/to/mcp-typescript-server/dist/index.js"]
    }
  }
}`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">Best Practices</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li><strong>Use Zod for all input validation</strong> - Runtime type checking is essential</li>
              <li><strong>Export types from schemas</strong> - <code>z.infer&lt;typeof Schema&gt;</code> keeps types in sync</li>
              <li><strong>Handle errors explicitly</strong> - Map errors to proper MCP error codes</li>
              <li><strong>Log to stderr</strong> - stdout is for MCP protocol communication</li>
              <li><strong>Use strict TypeScript config</strong> - Catch more bugs at compile time</li>
            </ol>

            <h2 className="text-2xl font-bold mt-12 mb-4">Next Steps</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Add resources with typed schemas</li>
              <li>Implement prompts with template types</li>
              <li>Add comprehensive tests with Vitest</li>
              <li>Set up CI/CD with type checking</li>
            </ul>

            <p className="mt-8">
              TypeScript and MCP are a natural fit. The type system catches protocol errors early, 
              making development faster and servers more reliable.
            </p>
          </div>

          {/* Email Signup */}
          <div className="mt-16 p-8 bg-gray-900 rounded-xl border border-gray-800">
            <h3 className="text-xl font-bold mb-4">Get MCP Tips & Tutorials</h3>
            <p className="text-gray-400 mb-6">
              Join developers building AI-powered tools. Get tutorials, code examples, and updates.
            </p>
            <EmailSignup site="mcp" />
          </div>

          {/* Related */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <h3 className="text-lg font-semibold mb-4">Related Tutorials</h3>
            <div className="grid gap-4">
              <Link href="/mcp/how-to-build-mcp-server-python" className="p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
                <span className="text-blue-400">How to Build an MCP Server in Python</span>
                <p className="text-sm text-gray-500 mt-1">Step-by-step Python tutorial for MCP development</p>
              </Link>
              <Link href="/mcp/mcp-security-best-practices" className="p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
                <span className="text-blue-400">MCP Security Best Practices</span>
                <p className="text-sm text-gray-500 mt-1">Essential security patterns for MCP servers</p>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
