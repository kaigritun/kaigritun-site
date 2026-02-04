import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Build Your First MCP Server in TypeScript - Complete Guide',
  description: 'Step-by-step tutorial for building MCP servers in TypeScript. Learn to use @modelcontextprotocol/sdk with type-safe tool definitions.',
  keywords: ['mcp typescript', 'mcp server typescript', 'modelcontextprotocol sdk', 'type-safe mcp'],
  openGraph: {
    title: 'Build Your First MCP Server in TypeScript',
    description: 'Complete TypeScript guide for building MCP servers with type safety.',
  },
};

export default function MCPTypeScriptQuickstart() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-12">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/mcp" className="hover:text-blue-600">MCP Tutorials</Link>
          <span>/</span>
          <span>TypeScript</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">Build Your First MCP Server in TypeScript</h1>
        <p className="text-xl text-gray-600">
          A complete guide to building type-safe MCP servers using the official TypeScript SDK. 
          From setup to deployment in 15 minutes.
        </p>
      </header>

      <div className="prose prose-lg max-w-none">
        <p>
          TypeScript is the recommended language for building MCP servers. The official SDK provides 
          excellent type definitions, making it easy to catch errors at compile time and get great 
          IDE autocompletion. Let's build a complete MCP server from scratch.
        </p>

        <h2>Prerequisites</h2>
        <ul>
          <li>Node.js 18+ installed</li>
          <li>Basic TypeScript knowledge</li>
          <li>A code editor (VS Code recommended)</li>
        </ul>

        <h2>Step 1: Project Setup</h2>
        <p>Create a new directory and initialize your project:</p>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
{`mkdir my-mcp-server
cd my-mcp-server
npm init -y

# Install dependencies
npm install @modelcontextprotocol/sdk zod
npm install -D typescript @types/node tsx

# Initialize TypeScript
npx tsc --init`}</pre>

        <h3>Configure TypeScript</h3>
        <p>Update your <code>tsconfig.json</code>:</p>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
{`{
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
}`}</pre>

        <h2>Step 2: Create the Server</h2>
        <p>Create <code>src/index.ts</code>:</p>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
{`import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

// Define your tool input schemas with Zod
const GreetInputSchema = z.object({
  name: z.string().describe("Name of the person to greet"),
  formal: z.boolean().optional().describe("Use formal greeting"),
});

const CalculateInputSchema = z.object({
  operation: z.enum(["add", "subtract", "multiply", "divide"]),
  a: z.number().describe("First number"),
  b: z.number().describe("Second number"),
});

// Type inference from schemas
type GreetInput = z.infer<typeof GreetInputSchema>;
type CalculateInput = z.infer<typeof CalculateInputSchema>;

// Create the server
const server = new Server(
  {
    name: "my-typescript-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "greet",
        description: "Generate a greeting for someone",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Name to greet" },
            formal: { type: "boolean", description: "Use formal style" },
          },
          required: ["name"],
        },
      },
      {
        name: "calculate",
        description: "Perform basic math operations",
        inputSchema: {
          type: "object",
          properties: {
            operation: { 
              type: "string", 
              enum: ["add", "subtract", "multiply", "divide"] 
            },
            a: { type: "number" },
            b: { type: "number" },
          },
          required: ["operation", "a", "b"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "greet": {
      const input = GreetInputSchema.parse(args);
      const greeting = input.formal
        ? \`Good day, \${input.name}. It is a pleasure to make your acquaintance.\`
        : \`Hey \${input.name}! What's up?\`;
      
      return {
        content: [{ type: "text", text: greeting }],
      };
    }

    case "calculate": {
      const input = CalculateInputSchema.parse(args);
      let result: number;

      switch (input.operation) {
        case "add":
          result = input.a + input.b;
          break;
        case "subtract":
          result = input.a - input.b;
          break;
        case "multiply":
          result = input.a * input.b;
          break;
        case "divide":
          if (input.b === 0) {
            return {
              content: [{ type: "text", text: "Error: Division by zero" }],
              isError: true,
            };
          }
          result = input.a / input.b;
          break;
      }

      return {
        content: [{ 
          type: "text", 
          text: \`\${input.a} \${input.operation} \${input.b} = \${result}\` 
        }],
      };
    }

    default:
      throw new Error(\`Unknown tool: \${name}\`);
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server running on stdio");
}

main().catch(console.error);`}</pre>

        <h2>Step 3: Add Package Scripts</h2>
        <p>Update <code>package.json</code>:</p>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
{`{
  "name": "my-mcp-server",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx src/index.ts"
  }
}`}</pre>

        <h2>Step 4: Build and Test</h2>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
{`# Build the project
npm run build

# Test with stdin/stdout
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node dist/index.js`}</pre>

        <h2>Step 5: Connect to Claude Desktop</h2>
        <p>Add your server to Claude Desktop's config (<code>claude_desktop_config.json</code>):</p>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
{`{
  "mcpServers": {
    "my-typescript-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/my-mcp-server/dist/index.js"]
    }
  }
}`}</pre>

        <h2>Advanced: Type-Safe Tool Registry</h2>
        <p>For larger servers, create a type-safe tool registry:</p>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
{`import { z } from "zod";

// Define a tool type
interface Tool<T extends z.ZodType> {
  name: string;
  description: string;
  inputSchema: T;
  handler: (input: z.infer<T>) => Promise<string>;
}

// Create type-safe tool factory
function createTool<T extends z.ZodType>(tool: Tool<T>): Tool<T> {
  return tool;
}

// Define tools with full type safety
const tools = [
  createTool({
    name: "fetch_weather",
    description: "Get current weather for a location",
    inputSchema: z.object({
      city: z.string(),
      units: z.enum(["celsius", "fahrenheit"]).default("celsius"),
    }),
    handler: async (input) => {
      // TypeScript knows input has city: string and units: "celsius" | "fahrenheit"
      return \`Weather in \${input.city}: 72°\${input.units === "celsius" ? "C" : "F"}\`;
    },
  }),
  
  createTool({
    name: "send_email",
    description: "Send an email",
    inputSchema: z.object({
      to: z.string().email(),
      subject: z.string().max(100),
      body: z.string(),
    }),
    handler: async (input) => {
      // Full type safety on input.to, input.subject, input.body
      return \`Email sent to \${input.to}\`;
    },
  }),
];

// Type-safe tool dispatcher
async function handleToolCall(name: string, args: unknown): Promise<string> {
  const tool = tools.find(t => t.name === name);
  if (!tool) throw new Error(\`Unknown tool: \${name}\`);
  
  const validatedInput = tool.inputSchema.parse(args);
  return tool.handler(validatedInput);
}`}</pre>

        <h2>Error Handling Best Practices</h2>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
{`import { z } from "zod";

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;
    
    // Zod parsing will throw on invalid input
    const result = await handleToolCall(name, args);
    
    return {
      content: [{ type: "text", text: result }],
    };
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return {
        content: [{
          type: "text",
          text: \`Validation error: \${error.errors.map(e => e.message).join(", ")}\`,
        }],
        isError: true,
      };
    }
    
    // Handle other errors
    return {
      content: [{
        type: "text",
        text: \`Error: \${error instanceof Error ? error.message : "Unknown error"}\`,
      }],
      isError: true,
    };
  }
});`}</pre>

        <h2>Project Structure for Larger Servers</h2>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
{`my-mcp-server/
├── src/
│   ├── index.ts           # Server entry point
│   ├── tools/
│   │   ├── index.ts       # Tool registry
│   │   ├── weather.ts     # Weather tool
│   │   ├── email.ts       # Email tool
│   │   └── database.ts    # Database tool
│   ├── schemas/
│   │   └── index.ts       # Shared Zod schemas
│   └── utils/
│       └── validation.ts  # Validation helpers
├── package.json
├── tsconfig.json
└── README.md`}</pre>

        <h2>Next Steps</h2>
        <ul>
          <li><Link href="/mcp/mcp-authentication-patterns" className="text-blue-600 hover:underline">Add authentication to your server</Link></li>
          <li><Link href="/mcp/mcp-error-handling-patterns" className="text-blue-600 hover:underline">Production error handling patterns</Link></li>
          <li><Link href="/mcp/testing-mcp-servers" className="text-blue-600 hover:underline">Testing your MCP server</Link></li>
          <li><Link href="/mcp/servers" className="text-blue-600 hover:underline">Browse the MCP Server Directory</Link></li>
        </ul>

        {/* Email Signup */}
        <div className="my-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <h3 className="text-xl font-semibold mb-2">Level up your MCP skills</h3>
          <p className="text-gray-600 mb-4">
            Get weekly TypeScript MCP tutorials and patterns delivered to your inbox.
          </p>
          <form className="flex gap-2">
            <input 
              type="email" 
              placeholder="you@example.com" 
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              type="submit" 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </article>
  );
}
