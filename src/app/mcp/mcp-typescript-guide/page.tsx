import { Metadata } from 'next';
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: "Building MCP Servers with TypeScript (2025 Guide)",
  description: "Complete guide to building MCP servers with TypeScript. Type-safe tool definitions, Zod validation, async patterns, project structure, and best practices.",
  keywords: ["MCP TypeScript", "TypeScript MCP server", "Model Context Protocol TypeScript", "type-safe MCP", "MCP SDK TypeScript"],
  openGraph: {
    title: "Building MCP Servers with TypeScript",
    description: "Complete guide to building type-safe MCP servers with TypeScript.",
    type: "article",
  },
};

export default function MCPTypeScriptGuide() {
  return (
    <main className="min-h-screen bg-black text-white">
      <article className="max-w-3xl mx-auto px-6 py-16">
        <header className="mb-12">
          <div className="text-orange-500 text-sm font-mono mb-4">MCP Guide</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Building MCP Servers with TypeScript
          </h1>
          <p className="text-gray-400 text-lg">
            Type safety, better IDE support, and the npm ecosystem—TypeScript is excellent for MCP development.
          </p>
          <div className="text-gray-500 text-sm mt-4">
            Updated February 2025 · 12 min read
          </div>
        </header>

        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-xl text-gray-300 leading-relaxed">
            TypeScript catches parameter mismatches at compile time, provides autocomplete in your IDE, and has a mature ecosystem of packages. This guide covers everything you need to build production MCP servers in TypeScript.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Why TypeScript for MCP?</h2>
          
          <ul className="text-gray-300 space-y-2 my-4">
            <li>• <strong>Type safety:</strong> Catch parameter mismatches at compile time</li>
            <li>• <strong>Better IDE support:</strong> Autocomplete, refactoring, inline docs</li>
            <li>• <strong>npm ecosystem:</strong> Thousands of packages ready to use</li>
            <li>• <strong>Familiar to web developers:</strong> Lower learning curve</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Quick Start</h2>

          <p className="text-gray-300">
            Initialize a new TypeScript MCP project:
          </p>

          <div className="bg-gray-900 rounded-lg p-4 my-6 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`mkdir my-mcp-server && cd my-mcp-server
npm init -y
npm install @modelcontextprotocol/sdk typescript @types/node
npx tsc --init`}
            </pre>
          </div>

          <p className="text-gray-300">
            Configure <code>tsconfig.json</code>:
          </p>

          <div className="bg-gray-900 rounded-lg p-4 my-6 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}`}
            </pre>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Basic Server Structure</h2>

          <div className="bg-gray-900 rounded-lg p-4 my-6 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`// src/index.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  {
    name: "my-typescript-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "greet",
      description: "Greet a user by name",
      inputSchema: {
        type: "object",
        properties: {
          name: { type: "string", description: "Name to greet" },
        },
        required: ["name"],
      },
    },
  ],
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "greet") {
    const { name } = request.params.arguments as { name: string };
    return {
      content: [{ type: "text", text: \`Hello, \${name}!\` }],
    };
  }
  throw new Error(\`Unknown tool: \${request.params.name}\`);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);`}
            </pre>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Type-Safe Tool Definitions</h2>

          <p className="text-gray-300">
            Create interfaces for your tool parameters:
          </p>

          <div className="bg-gray-900 rounded-lg p-4 my-6 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`// src/types.ts
export interface SearchParams {
  query: string;
  limit?: number;
  filters?: {
    category?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

export interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  url: string;
  score: number;
}`}
            </pre>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Zod for Runtime Validation</h2>

          <p className="text-gray-300">
            TypeScript types disappear at runtime. Use Zod for validation:
          </p>

          <div className="bg-gray-900 rounded-lg p-4 my-6 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`import { z } from "zod";

const SearchParamsSchema = z.object({
  query: z.string().min(1).max(500),
  limit: z.number().int().min(1).max(100).default(10),
  filters: z.object({
    category: z.string().optional(),
    dateFrom: z.string().datetime().optional(),
    dateTo: z.string().datetime().optional(),
  }).optional(),
});

type SearchParams = z.infer<typeof SearchParamsSchema>;

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "search") {
    // Validate at runtime
    const params = SearchParamsSchema.parse(request.params.arguments);
    // params is now fully typed AND validated
    return await handleSearch(params);
  }
});`}
            </pre>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Error Handling</h2>

          <p className="text-gray-300">
            Create typed error classes:
          </p>

          <div className="bg-gray-900 rounded-lg p-4 my-6 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`class MCPError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = "MCPError";
  }
}

class NotFoundError extends MCPError {
  constructor(resource: string, id: string) {
    super(\`\${resource} not found: \${id}\`, "NOT_FOUND", 404);
  }
}

class ValidationError extends MCPError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR", 400);
  }
}`}
            </pre>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Project Structure</h2>

          <p className="text-gray-300">
            Organize larger projects:
          </p>

          <div className="bg-gray-900 rounded-lg p-4 my-6 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`my-mcp-server/
├── src/
│   ├── index.ts          # Entry point
│   ├── server.ts         # Server setup
│   ├── tools/
│   │   ├── index.ts      # Tool registry
│   │   ├── search.ts     # Search tool
│   │   └── crud.ts       # CRUD tools
│   ├── services/
│   │   ├── database.ts   # DB connection
│   │   └── cache.ts      # Caching layer
│   ├── types/
│   │   └── index.ts      # Shared types
│   └── utils/
│       └── validation.ts # Validators
├── tests/
│   └── tools.test.ts
├── package.json
└── tsconfig.json`}
            </pre>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Testing</h2>

          <p className="text-gray-300">
            Use Vitest for fast TypeScript testing:
          </p>

          <div className="bg-gray-900 rounded-lg p-4 my-6 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`// tests/tools.test.ts
import { describe, it, expect } from "vitest";
import { handleSearch } from "../src/tools/search.js";

describe("search tool", () => {
  it("returns results for valid query", async () => {
    const results = await handleSearch({ query: "typescript" });
    
    expect(results).toBeInstanceOf(Array);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty("title");
  });
  
  it("respects limit parameter", async () => {
    const results = await handleSearch({ query: "test", limit: 5 });
    expect(results.length).toBeLessThanOrEqual(5);
  });
});`}
            </pre>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Building and Running</h2>

          <p className="text-gray-300">
            Add scripts to <code>package.json</code>:
          </p>

          <div className="bg-gray-900 rounded-lg p-4 my-6 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx watch src/index.ts",
    "test": "vitest"
  }
}`}
            </pre>
          </div>

          <p className="text-gray-300">
            Configure in Claude Desktop:
          </p>

          <div className="bg-gray-900 rounded-lg p-4 my-6 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["/path/to/my-mcp-server/dist/index.js"]
    }
  }
}`}
            </pre>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-white">TypeScript-Specific Tips</h2>

          <div className="bg-gray-900 rounded-lg p-6 my-8">
            <ul className="text-gray-300 space-y-2">
              <li>• <strong>Use strict mode</strong> — catches more bugs</li>
              <li>• <strong>Avoid <code>any</code></strong> — defeats the purpose of TypeScript</li>
              <li>• <strong>Use <code>unknown</code> for external data</strong> — then narrow with validation</li>
              <li>• <strong>Enable <code>noUncheckedIndexedAccess</code></strong> — catches array bound errors</li>
            </ul>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 my-6 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`// In tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true
  }
}`}
            </pre>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Next Steps</h2>

          <div className="bg-gray-900 rounded-lg p-6 my-8">
            <ul className="text-gray-300 space-y-2">
              <li>→ <a href="/mcp/mcp-docker-deployment" className="text-orange-500 hover:underline">MCP Docker Deployment</a> — Deploy to production</li>
              <li>→ <a href="/mcp/mcp-error-handling-patterns" className="text-orange-500 hover:underline">MCP Error Handling Patterns</a> — Robust error management</li>
              <li>→ <a href="/mcp/how-to-build-mcp-server-python" className="text-orange-500 hover:underline">MCP Server in Python</a> — Compare with Python approach</li>
              <li>→ <a href="/mcp" className="text-orange-500 hover:underline">MCP Guide Home</a> — All tutorials</li>
            </ul>
          </div>

          <div className="my-12">
            <EmailSignup site="mcp" />
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <p className="text-gray-500 text-sm">
              Written by Kai Gritun. Building tools for AI developers.
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
