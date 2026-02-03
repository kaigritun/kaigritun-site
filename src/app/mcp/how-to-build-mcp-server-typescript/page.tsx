import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Build an MCP Server in TypeScript | MCP Tutorial",
  description: "Step-by-step guide to building MCP servers with the official TypeScript SDK. Connect Claude and other LLMs to custom tools using Node.js.",
  keywords: ["MCP TypeScript", "MCP server TypeScript", "MCP SDK", "Model Context Protocol TypeScript", "build MCP server", "MCP Node.js"],
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
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-6">
            <Link href="/mcp" className="hover:text-white">MCP Tutorials</Link>
            <span className="mx-2">→</span>
            <span>TypeScript Server</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold mb-4">
            How to Build an MCP Server in TypeScript
          </h1>
          <div className="flex gap-4 text-sm text-gray-500 mb-8">
            <span>February 3, 2026</span>
            <span>·</span>
            <span>15 min read</span>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-gray max-w-none">
            <p className="text-xl text-gray-300 mb-8">
              Build production-ready MCP servers using the official TypeScript SDK. This guide covers 
              setup, tool creation, resources, and deployment — with patterns you'll use in real projects.
            </p>

            <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mb-8">
              <p className="text-blue-300 m-0">
                <strong>Python developer?</strong> Check out our{" "}
                <Link href="/mcp/how-to-build-mcp-server-python" className="text-blue-400 hover:underline">
                  Python MCP tutorial
                </Link>{" "}
                using FastMCP instead.
              </p>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Why TypeScript for MCP?</h2>
            
            <p className="text-gray-300">
              The official MCP SDK is written in TypeScript. While Python has FastMCP (which is 
              excellent for quick prototypes), TypeScript gives you:
            </p>

            <ul className="text-gray-300 space-y-2">
              <li><strong>Type safety</strong> — Catch errors before runtime</li>
              <li><strong>Official SDK</strong> — Direct from Anthropic, always up to date</li>
              <li><strong>Node.js ecosystem</strong> — npm packages for everything</li>
              <li><strong>Better for complex servers</strong> — Interfaces, generics, refactoring</li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-4">Prerequisites</h2>

            <ul className="text-gray-300 space-y-2">
              <li>Node.js 18+ installed</li>
              <li>Basic TypeScript knowledge</li>
              <li>Claude Desktop or another MCP client for testing</li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-4">Project Setup</h2>

            <p className="text-gray-300">Create a new project and install dependencies:</p>

            <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <code className="text-sm text-gray-300">{`mkdir my-mcp-server
cd my-mcp-server
npm init -y
npm install @modelcontextprotocol/sdk zod
npm install -D typescript @types/node tsx`}</code>
            </pre>

            <p className="text-gray-300">Initialize TypeScript:</p>

            <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <code className="text-sm text-gray-300">{`npx tsc --init`}</code>
            </pre>

            <p className="text-gray-300">Update <code>tsconfig.json</code>:</p>

            <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <code className="text-sm text-gray-300">{`{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">Basic Server Structure</h2>

            <p className="text-gray-300">
              Create <code>src/index.ts</code> with the basic MCP server structure:
            </p>

            <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <code className="text-sm text-gray-300">{`import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "my-mcp-server",
  version: "1.0.0",
});

// Tools, resources, and prompts go here

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP server running on stdio");
}

main().catch(console.error);`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">Adding Tools</h2>

            <p className="text-gray-300">
              Tools are the core of MCP — they let AI models take actions. Here's how to define them:
            </p>

            <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <code className="text-sm text-gray-300">{`import { z } from "zod";

// Define a simple tool
server.tool(
  "greet",
  "Generate a greeting message",
  {
    name: z.string().describe("Name to greet"),
    style: z.enum(["formal", "casual"]).optional().describe("Greeting style"),
  },
  async ({ name, style = "casual" }) => {
    const greeting = style === "formal" 
      ? \`Good day, \${name}. How may I assist you?\`
      : \`Hey \${name}! What's up?\`;
    
    return {
      content: [{ type: "text", text: greeting }],
    };
  }
);`}</code>
            </pre>

            <p className="text-gray-300">
              The SDK uses <strong>Zod</strong> for schema validation. Each parameter gets a Zod type, 
              and <code>.describe()</code> tells the AI what the parameter is for.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4">Real Example: GitHub Repository Info</h2>

            <p className="text-gray-300">
              Let's build something useful — a tool that fetches GitHub repository information:
            </p>

            <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <code className="text-sm text-gray-300">{`import { z } from "zod";

server.tool(
  "get_github_repo",
  "Get information about a GitHub repository",
  {
    owner: z.string().describe("Repository owner (username or org)"),
    repo: z.string().describe("Repository name"),
  },
  async ({ owner, repo }) => {
    const response = await fetch(
      \`https://api.github.com/repos/\${owner}/\${repo}\`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "mcp-server",
        },
      }
    );

    if (!response.ok) {
      return {
        content: [{ 
          type: "text", 
          text: \`Error: Could not fetch repository. Status: \${response.status}\` 
        }],
        isError: true,
      };
    }

    const data = await response.json();
    
    const info = \`
**\${data.full_name}**
\${data.description || "No description"}

⭐ Stars: \${data.stargazers_count.toLocaleString()}
🍴 Forks: \${data.forks_count.toLocaleString()}
👀 Watchers: \${data.watchers_count.toLocaleString()}
📝 Language: \${data.language || "Not specified"}
📅 Created: \${new Date(data.created_at).toLocaleDateString()}
🔄 Last updated: \${new Date(data.updated_at).toLocaleDateString()}
\`.trim();

    return {
      content: [{ type: "text", text: info }],
    };
  }
);`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">Adding Resources</h2>

            <p className="text-gray-300">
              Resources provide read-only data to AI models. They're perfect for configuration, 
              documentation, or any data the AI needs to reference:
            </p>

            <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <code className="text-sm text-gray-300">{`// Static resource
server.resource(
  "config://app/settings",
  "Application configuration",
  async () => ({
    contents: [{
      uri: "config://app/settings",
      mimeType: "application/json",
      text: JSON.stringify({
        apiVersion: "v2",
        maxRetries: 3,
        timeout: 30000,
      }, null, 2),
    }],
  })
);

// Dynamic resource with template
server.resource(
  "file://{path}",
  "Read a file from the project",
  async ({ path }) => {
    const fs = await import("fs/promises");
    const content = await fs.readFile(path, "utf-8");
    return {
      contents: [{
        uri: \`file://\${path}\`,
        mimeType: "text/plain",
        text: content,
      }],
    };
  }
);`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">Adding Prompts</h2>

            <p className="text-gray-300">
              Prompts are reusable templates that guide AI behavior for specific tasks:
            </p>

            <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <code className="text-sm text-gray-300">{`server.prompt(
  "code_review",
  "Review code for issues and improvements",
  {
    code: z.string().describe("Code to review"),
    language: z.string().optional().describe("Programming language"),
  },
  async ({ code, language }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: \`Please review this \${language || ""} code:

\\\`\\\`\\\`\${language || ""}
\${code}
\\\`\\\`\\\`

Focus on:
1. Potential bugs or errors
2. Performance issues
3. Security concerns
4. Code style and readability
5. Suggestions for improvement\`,
      },
    }],
  })
);`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">Complete Server Example</h2>

            <p className="text-gray-300">
              Here's a complete server that combines tools, resources, and prompts:
            </p>

            <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <code className="text-sm text-gray-300">{`import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as fs from "fs/promises";
import * as path from "path";

const server = new McpServer({
  name: "project-assistant",
  version: "1.0.0",
});

// Tool: List files in directory
server.tool(
  "list_files",
  "List files in a directory",
  {
    directory: z.string().describe("Directory path to list"),
    pattern: z.string().optional().describe("Glob pattern to filter files"),
  },
  async ({ directory, pattern }) => {
    try {
      const entries = await fs.readdir(directory, { withFileTypes: true });
      const files = entries
        .filter(e => !pattern || e.name.includes(pattern))
        .map(e => \`\${e.isDirectory() ? "📁" : "📄"} \${e.name}\`)
        .join("\\n");
      
      return { content: [{ type: "text", text: files || "No files found" }] };
    } catch (error) {
      return { 
        content: [{ type: "text", text: \`Error: \${error}\` }],
        isError: true 
      };
    }
  }
);

// Tool: Read file content
server.tool(
  "read_file",
  "Read the contents of a file",
  {
    filePath: z.string().describe("Path to the file"),
  },
  async ({ filePath }) => {
    try {
      const content = await fs.readFile(filePath, "utf-8");
      return { content: [{ type: "text", text: content }] };
    } catch (error) {
      return { 
        content: [{ type: "text", text: \`Error reading file: \${error}\` }],
        isError: true 
      };
    }
  }
);

// Tool: Write file
server.tool(
  "write_file",
  "Write content to a file",
  {
    filePath: z.string().describe("Path to the file"),
    content: z.string().describe("Content to write"),
  },
  async ({ filePath, content }) => {
    try {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, content, "utf-8");
      return { content: [{ type: "text", text: \`✓ Written to \${filePath}\` }] };
    } catch (error) {
      return { 
        content: [{ type: "text", text: \`Error writing file: \${error}\` }],
        isError: true 
      };
    }
  }
);

// Resource: Project structure
server.resource(
  "project://structure",
  "Current project structure",
  async () => {
    const cwd = process.cwd();
    const entries = await fs.readdir(cwd, { withFileTypes: true });
    const structure = entries
      .filter(e => !e.name.startsWith("."))
      .map(e => \`\${e.isDirectory() ? "📁" : "📄"} \${e.name}\`)
      .join("\\n");
    
    return {
      contents: [{
        uri: "project://structure",
        mimeType: "text/plain",
        text: \`Project: \${path.basename(cwd)}\\n\\n\${structure}\`,
      }],
    };
  }
);

// Prompt: Explain code
server.prompt(
  "explain_code",
  "Explain what a piece of code does",
  {
    filePath: z.string().describe("Path to the file to explain"),
  },
  async ({ filePath }) => {
    const content = await fs.readFile(filePath, "utf-8");
    const ext = path.extname(filePath).slice(1);
    
    return {
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: \`Please explain what this code does, step by step:

\\\`\\\`\\\`\${ext}
\${content}
\\\`\\\`\\\`\`,
        },
      }],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Project assistant MCP server running");
}

main().catch(console.error);`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">Running the Server</h2>

            <p className="text-gray-300">Add scripts to <code>package.json</code>:</p>

            <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <code className="text-sm text-gray-300">{`{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx src/index.ts"
  }
}`}</code>
            </pre>

            <p className="text-gray-300">Test with <code>tsx</code> during development:</p>

            <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <code className="text-sm text-gray-300">{`npx tsx src/index.ts`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">Claude Desktop Configuration</h2>

            <p className="text-gray-300">
              Add your server to Claude Desktop's config file. On macOS, edit{" "}
              <code>~/Library/Application Support/Claude/claude_desktop_config.json</code>:
            </p>

            <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <code className="text-sm text-gray-300">{`{
  "mcpServers": {
    "project-assistant": {
      "command": "npx",
      "args": ["tsx", "/path/to/my-mcp-server/src/index.ts"],
      "cwd": "/path/to/working/directory"
    }
  }
}`}</code>
            </pre>

            <p className="text-gray-300">
              Or for the compiled version:
            </p>

            <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <code className="text-sm text-gray-300">{`{
  "mcpServers": {
    "project-assistant": {
      "command": "node",
      "args": ["/path/to/my-mcp-server/dist/index.js"]
    }
  }
}`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">Error Handling Best Practices</h2>

            <p className="text-gray-300">
              Proper error handling makes your server robust:
            </p>

            <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <code className="text-sm text-gray-300">{`server.tool(
  "risky_operation",
  "Does something that might fail",
  { input: z.string() },
  async ({ input }) => {
    try {
      const result = await somethingRisky(input);
      return { 
        content: [{ type: "text", text: result }] 
      };
    } catch (error) {
      // Log for debugging (goes to stderr)
      console.error("Operation failed:", error);
      
      // Return structured error to AI
      return {
        content: [{
          type: "text",
          text: \`Operation failed: \${error instanceof Error ? error.message : "Unknown error"}\`,
        }],
        isError: true,
      };
    }
  }
);`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">TypeScript vs Python: When to Use Each</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-gray-300 border-collapse">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 pr-4">Aspect</th>
                    <th className="text-left py-2 pr-4">TypeScript</th>
                    <th className="text-left py-2">Python (FastMCP)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 pr-4">Setup time</td>
                    <td className="py-2 pr-4">~10 minutes</td>
                    <td className="py-2">~3 minutes</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 pr-4">Type safety</td>
                    <td className="py-2 pr-4">Excellent</td>
                    <td className="py-2">Good (with type hints)</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 pr-4">Best for</td>
                    <td className="py-2 pr-4">Complex servers, teams</td>
                    <td className="py-2">Quick prototypes, data science</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 pr-4">Ecosystem</td>
                    <td className="py-2 pr-4">npm (massive)</td>
                    <td className="py-2">PyPI (massive)</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 pr-4">SDK</td>
                    <td className="py-2 pr-4">Official (Anthropic)</td>
                    <td className="py-2">Community (FastMCP)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Next Steps</h2>

            <ul className="text-gray-300 space-y-2">
              <li>
                <Link href="/mcp/mcp-resources-prompts-guide" className="text-blue-400 hover:underline">
                  Deep dive into Resources and Prompts →
                </Link>
              </li>
              <li>
                <Link href="/mcp/troubleshooting-mcp-servers" className="text-blue-400 hover:underline">
                  Troubleshooting guide when things go wrong →
                </Link>
              </li>
              <li>
                <Link href="/mcp/best-mcp-servers-2025" className="text-blue-400 hover:underline">
                  Explore existing MCP servers for inspiration →
                </Link>
              </li>
            </ul>

            <div className="bg-gray-800 rounded-lg p-6 mt-12">
              <h3 className="font-bold mb-2">Summary</h3>
              <p className="text-gray-300 m-0">
                TypeScript + the official MCP SDK gives you type safety, great tooling, and direct 
                access to the latest protocol features. It's the right choice for production servers 
                and larger projects. Start with the patterns in this guide, then customize for your 
                specific use case.
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Kai Gritun · <Link href="https://x.com/kaigritun" className="hover:text-white">@kaigritun</Link></p>
      </footer>
    </div>
  );
}
