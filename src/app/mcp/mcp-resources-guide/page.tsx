import { Metadata } from 'next';
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: 'MCP Resources Deep Dive: Exposing Data to AI | MCP Tutorials',
  description: 'Master MCP Resources to expose files, databases, and APIs to AI assistants. Learn static resources, dynamic data, templates, subscriptions, and best practices.',
  keywords: ['MCP resources', 'Model Context Protocol', 'MCP data', 'AI context', 'MCP tutorial'],
  openGraph: {
    title: 'MCP Resources Deep Dive: Exposing Data to AI',
    description: 'Complete guide to implementing MCP Resources for AI-powered data access.',
    type: 'article',
  },
}

export default function MCPResourcesGuide() {
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
            <span className="px-3 py-1 text-sm font-medium bg-green-500/20 text-green-300 rounded-full">Deep Dive</span>
            <span className="text-gray-400 text-sm">11 min read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            MCP Resources Deep Dive
          </h1>
          <p className="text-xl text-gray-300">
            Learn how to expose files, databases, and APIs as read-only resources that AI assistants can access and reference.
          </p>
        </header>

        {/* Table of Contents */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-12 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Contents</h2>
          <ul className="space-y-2 text-gray-300">
            <li><a href="#why-resources" className="hover:text-purple-400">→ Why Resources?</a></li>
            <li><a href="#structure" className="hover:text-purple-400">→ Resource Structure</a></li>
            <li><a href="#basic" className="hover:text-purple-400">→ Basic Implementation</a></li>
            <li><a href="#dynamic" className="hover:text-purple-400">→ Dynamic Resources</a></li>
            <li><a href="#templates" className="hover:text-purple-400">→ Resource Templates</a></li>
            <li><a href="#binary" className="hover:text-purple-400">→ Binary Resources</a></li>
            <li><a href="#subscriptions" className="hover:text-purple-400">→ Resource Subscriptions</a></li>
            <li><a href="#best-practices" className="hover:text-purple-400">→ Best Practices</a></li>
            <li><a href="#patterns" className="hover:text-purple-400">→ Common Patterns</a></li>
          </ul>
        </div>

        {/* Article Content */}
        <article className="prose prose-invert prose-lg max-w-none">
          
          {/* Intro */}
          <section className="mb-16">
            <p className="text-gray-300 text-lg leading-relaxed">
              MCP Resources let your server expose data to AI clients—files, database records, API responses, anything the model might need as context. Unlike tools (which perform actions), resources are read-only data that clients can fetch and include in conversations.
            </p>
          </section>

          {/* Why Resources */}
          <section id="why-resources" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Why Resources?</h2>
            
            <p className="text-gray-300 mb-6">Before resources, you'd either:</p>

            <div className="space-y-3 mb-6">
              <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
                <p className="text-gray-300"><span className="text-red-400">1.</span> Hard-code data in prompts <span className="text-gray-500">(inflexible)</span></p>
              </div>
              <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
                <p className="text-gray-300"><span className="text-red-400">2.</span> Create tools that return data <span className="text-gray-500">(wasteful for static content)</span></p>
              </div>
              <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
                <p className="text-gray-300"><span className="text-red-400">3.</span> Copy-paste context manually <span className="text-gray-500">(tedious)</span></p>
              </div>
            </div>

            <div className="bg-green-500/10 rounded-lg p-6 border border-green-500/30">
              <h4 className="text-green-300 font-semibold mb-2">Resources solve this elegantly</h4>
              <p className="text-gray-300">The AI sees what data is available and can request exactly what it needs.</p>
            </div>
          </section>

          {/* Resource Structure */}
          <section id="structure" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Resource Structure</h2>
            
            <p className="text-gray-300 mb-6">Every resource has:</p>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-purple-400 font-semibold mb-2">URI</h4>
                <p className="text-gray-400 text-sm">Unique identifier (e.g., <code className="text-purple-300">file:///docs/readme.md</code>)</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-purple-400 font-semibold mb-2">Name</h4>
                <p className="text-gray-400 text-sm">Human-readable label</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-purple-400 font-semibold mb-2">Description</h4>
                <p className="text-gray-400 text-sm">What the resource contains (optional)</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-purple-400 font-semibold mb-2">MIME Type</h4>
                <p className="text-gray-400 text-sm">Content type (e.g., <code className="text-purple-300">text/plain</code>, <code className="text-purple-300">application/json</code>)</p>
              </div>
            </div>
          </section>

          {/* Basic Implementation */}
          <section id="basic" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Basic Implementation</h2>
            
            <div className="bg-gray-950 rounded-lg p-6 mb-6 overflow-x-auto">
              <div className="text-xs text-gray-500 mb-2">TypeScript</div>
              <pre className="text-sm text-gray-300"><code>{`import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  { name: "docs-server", version: "1.0.0" },
  { capabilities: { resources: {} } }
);

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: "docs://readme",
      name: "README",
      description: "Project documentation",
      mimeType: "text/markdown",
    },
    {
      uri: "docs://changelog",
      name: "Changelog",
      description: "Version history",
      mimeType: "text/markdown",
    },
  ],
}));

// Serve resource content
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  
  switch (uri) {
    case "docs://readme":
      return {
        contents: [
          {
            uri,
            mimeType: "text/markdown",
            text: "# My Project\\n\\nWelcome to the docs...",
          },
        ],
      };
    case "docs://changelog":
      return {
        contents: [
          {
            uri,
            mimeType: "text/markdown",
            text: "## v1.0.0\\n- Initial release",
          },
        ],
      };
    default:
      throw new Error(\`Resource not found: \${uri}\`);
  }
});`}</code></pre>
            </div>
          </section>

          {/* Dynamic Resources */}
          <section id="dynamic" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Dynamic Resources</h2>
            
            <p className="text-gray-300 mb-6">
              Resources can be generated dynamically. Here's a database-backed example:
            </p>

            <div className="bg-gray-950 rounded-lg p-6 mb-6 overflow-x-auto">
              <div className="text-xs text-gray-500 mb-2">TypeScript - Database Resources</div>
              <pre className="text-sm text-gray-300"><code>{`import { db } from "./database.js";

server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const users = await db.query("SELECT id, name FROM users");
  
  return {
    resources: users.map((user) => ({
      uri: \`db://users/\${user.id}\`,
      name: user.name,
      description: \`Profile data for \${user.name}\`,
      mimeType: "application/json",
    })),
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const match = request.params.uri.match(/^db:\\/\\/users\\/(\\d+)$/);
  if (!match) throw new Error("Invalid URI");
  
  const user = await db.query(
    "SELECT * FROM users WHERE id = ?", 
    [match[1]]
  );
  
  return {
    contents: [
      {
        uri: request.params.uri,
        mimeType: "application/json",
        text: JSON.stringify(user, null, 2),
      },
    ],
  };
});`}</code></pre>
            </div>
          </section>

          {/* Resource Templates */}
          <section id="templates" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Resource Templates</h2>
            
            <p className="text-gray-300 mb-6">
              For parameterized resources, use templates:
            </p>

            <div className="bg-gray-950 rounded-lg p-6 mb-6 overflow-x-auto">
              <div className="text-xs text-gray-500 mb-2">TypeScript - Templates</div>
              <pre className="text-sm text-gray-300"><code>{`server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [],
  resourceTemplates: [
    {
      uriTemplate: "github://repo/{owner}/{name}",
      name: "GitHub Repository",
      description: "Fetch repository info",
      mimeType: "application/json",
    },
  ],
}));`}</code></pre>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
              <p className="text-blue-200 text-sm">
                <strong>Note:</strong> Clients expand templates with actual values before requesting. For example, <code className="text-blue-300">github://repo/facebook/react</code>.
              </p>
            </div>
          </section>

          {/* Binary Resources */}
          <section id="binary" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Binary Resources</h2>
            
            <p className="text-gray-300 mb-6">
              For images, PDFs, or other binary data:
            </p>

            <div className="bg-gray-950 rounded-lg p-6 mb-6 overflow-x-auto">
              <div className="text-xs text-gray-500 mb-2">TypeScript - Binary Data</div>
              <pre className="text-sm text-gray-300"><code>{`import { readFileSync } from "fs";

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  if (request.params.uri === "image://logo") {
    const buffer = readFileSync("./logo.png");
    return {
      contents: [
        {
          uri: request.params.uri,
          mimeType: "image/png",
          blob: buffer.toString("base64"),
        },
      ],
    };
  }
  throw new Error("Resource not found");
});`}</code></pre>
            </div>
          </section>

          {/* Subscriptions */}
          <section id="subscriptions" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Resource Subscriptions</h2>
            
            <p className="text-gray-300 mb-6">
              Clients can subscribe to resource changes for real-time updates:
            </p>

            <div className="bg-gray-950 rounded-lg p-6 mb-6 overflow-x-auto">
              <div className="text-xs text-gray-500 mb-2">TypeScript - Subscriptions</div>
              <pre className="text-sm text-gray-300"><code>{`import { SubscribeRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const subscriptions = new Set<string>();

server.setRequestHandler(SubscribeRequestSchema, async (request) => {
  // Track subscription
  subscriptions.add(request.params.uri);
  return {};
});

// When data changes, notify subscribers:
function notifyResourceChanged(uri: string) {
  if (subscriptions.has(uri)) {
    server.notification({
      method: "notifications/resources/updated",
      params: { uri },
    });
  }
}`}</code></pre>
            </div>
          </section>

          {/* Best Practices */}
          <section id="best-practices" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Best Practices</h2>
            
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-2">✓ Use Meaningful URIs</h4>
                <p className="text-gray-400"><code className="text-green-400">db://users/123</code> is better than <code className="text-red-400">resource-1</code></p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-2">✓ Include Descriptions</h4>
                <p className="text-gray-400">Help the AI understand what's available and when to use each resource</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-2">✓ Set Correct MIME Types</h4>
                <p className="text-gray-400">Affects how content is processed and displayed</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-2">✓ Paginate Large Lists</h4>
                <p className="text-gray-400">Don't return 10,000 resources at once</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-2">✓ Cache When Possible</h4>
                <p className="text-gray-400">Resources are often read multiple times</p>
              </div>
            </div>
          </section>

          {/* Common Patterns */}
          <section id="patterns" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Common Patterns</h2>
            
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                <h4 className="text-white font-semibold mb-2">📁 File Browsers</h4>
                <p className="text-gray-400 text-sm">Expose directory structures as navigable resources</p>
              </div>
              <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                <h4 className="text-white font-semibold mb-2">🗄️ Database Explorers</h4>
                <p className="text-gray-400 text-sm">List tables and records as browsable resources</p>
              </div>
              <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                <h4 className="text-white font-semibold mb-2">📖 API Documentation</h4>
                <p className="text-gray-400 text-sm">Expose OpenAPI specs for AI to understand your API</p>
              </div>
              <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                <h4 className="text-white font-semibold mb-2">⚙️ Configuration</h4>
                <p className="text-gray-400 text-sm">Expose settings files the AI might need to reference</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-6 border border-purple-500/30">
              <p className="text-gray-300 text-lg">
                Resources are the foundation for context-aware AI assistants. Master them, and your MCP servers become dramatically more useful.
              </p>
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
            <li>→ <a href="/mcp/mcp-typescript-tutorial" className="text-purple-400 hover:text-purple-300">Build Your First MCP Server in TypeScript</a></li>
            <li>→ <a href="/mcp/mcp-vs-langchain" className="text-purple-400 hover:text-purple-300">MCP vs LangChain: When to Use Each</a></li>
            <li>→ <a href="/mcp/mcp-resources-prompts-guide" className="text-purple-400 hover:text-purple-300">MCP Prompts Guide</a></li>
            <li>→ <a href="/mcp/mcp-database-integrations" className="text-purple-400 hover:text-purple-300">Database Integrations</a></li>
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
