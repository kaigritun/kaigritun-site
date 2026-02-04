import type { Metadata } from "next";
import EmailSignup from "@/components/EmailSignup";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MCP Database Integration: Connecting AI to Your Data",
  description:
    "Learn to integrate databases with MCP servers. Covers SQLite, PostgreSQL, MongoDB, connection pooling, caching, and secure query patterns.",
  openGraph: {
    title: "MCP Database Integration: Connecting AI to Your Data",
    description:
      "Learn to integrate databases with MCP servers. Covers SQLite, PostgreSQL, MongoDB, connection pooling, caching, and secure query patterns.",
    type: "article",
    publishedTime: "2025-02-04",
  },
  twitter: {
    card: "summary_large_image",
    title: "MCP Database Integration",
    description: "Give AI assistants secure access to your data",
  },
};

export default function MCPDatabaseIntegration() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-8">
        <Link href="/mcp" className="text-gray-400 hover:text-white transition">
          ← Back to MCP Tutorials
        </Link>
      </div>

      <article className="prose prose-lg prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-4">
          MCP Database Integration: Connecting AI to Your Data
        </h1>

        <p className="text-gray-400 text-sm mb-8">
          Published February 4, 2025 · 18 min read
        </p>

        <p className="lead text-xl text-gray-300">
          MCP servers shine when they give AI assistants access to real data. This guide 
          covers database integration patterns—from simple queries to production-ready 
          implementations.
        </p>

        <h2>The Value of Database Access</h2>

        <p>
          Without database access, AI assistants are limited to what&apos;s in their context 
          window. With it, they can:
        </p>

        <ul>
          <li>Query customer records</li>
          <li>Generate reports from live data</li>
          <li>Update information based on conversations</li>
          <li>Analyze trends across datasets</li>
        </ul>

        <h2>Quick Start: SQLite</h2>

        <p>SQLite is the simplest starting point. No server setup required.</p>

        <pre><code className="language-typescript">{`import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import Database from "better-sqlite3";

const db = new Database("./data.db");

const server = new Server(
  { name: "sqlite-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "query",
      description: "Run a read-only SQL query",
      inputSchema: {
        type: "object",
        properties: {
          sql: { type: "string", description: "SELECT query to run" }
        },
        required: ["sql"]
      }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "query") {
    const { sql } = request.params.arguments as { sql: string };
    
    // Safety: only allow SELECT
    if (!sql.trim().toUpperCase().startsWith("SELECT")) {
      return {
        content: [{ type: "text", text: "Only SELECT queries allowed" }],
        isError: true
      };
    }
    
    const results = db.prepare(sql).all();
    return {
      content: [{ type: "text", text: JSON.stringify(results, null, 2) }]
    };
  }
});`}</code></pre>

        <h2>PostgreSQL with Connection Pooling</h2>

        <p>For production, use connection pooling.</p>

        <pre><code className="language-typescript">{`import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 10, // Max pool size
  idleTimeoutMillis: 30000
});

async function query(sql: string, params: unknown[] = []) {
  const client = await pool.connect();
  try {
    const result = await client.query(sql, params);
    return result.rows;
  } finally {
    client.release();
  }
}

// Tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_customer") {
    const { customerId } = request.params.arguments as { customerId: string };
    
    const results = await query(
      "SELECT id, name, email, created_at FROM customers WHERE id = $1",
      [customerId]
    );
    
    return {
      content: [{
        type: "text",
        text: results.length ? JSON.stringify(results[0]) : "Customer not found"
      }]
    };
  }
});`}</code></pre>

        <h2>Safe Query Building</h2>

        <p>Never concatenate user input into SQL. Use parameterized queries.</p>

        <pre><code className="language-typescript">{`import { z } from "zod";

// Define allowed queries as functions
const queries = {
  getOrders: (customerId: string, limit: number) => ({
    sql: \`SELECT id, total, status, created_at 
          FROM orders 
          WHERE customer_id = $1 
          ORDER BY created_at DESC 
          LIMIT $2\`,
    params: [customerId, limit]
  }),
  
  getProductsByCategory: (category: string) => ({
    sql: \`SELECT id, name, price, stock 
          FROM products 
          WHERE category = $1 AND active = true\`,
    params: [category]
  }),
  
  searchCustomers: (searchTerm: string) => ({
    sql: \`SELECT id, name, email 
          FROM customers 
          WHERE name ILIKE $1 OR email ILIKE $1 
          LIMIT 20\`,
    params: [\`%\${searchTerm}%\`]
  })
};

// Expose specific tools, not raw SQL
const tools = [
  {
    name: "get_customer_orders",
    description: "Get recent orders for a customer",
    inputSchema: {
      type: "object",
      properties: {
        customerId: { type: "string" },
        limit: { type: "number", default: 10, maximum: 100 }
      },
      required: ["customerId"]
    }
  },
  {
    name: "search_customers",
    description: "Search customers by name or email",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", minLength: 2, maxLength: 100 }
      },
      required: ["query"]
    }
  }
];`}</code></pre>

        <h2>MongoDB Integration</h2>

        <p>
          Document databases work well with AI—the flexible schema matches natural 
          language queries.
        </p>

        <pre><code className="language-typescript">{`import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI!);
const db = client.db("myapp");

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "find_documents") {
    const { collection, filter, limit } = request.params.arguments as {
      collection: string;
      filter: Record<string, unknown>;
      limit?: number;
    };
    
    // Whitelist allowed collections
    const allowed = ["products", "articles", "faq"];
    if (!allowed.includes(collection)) {
      return {
        content: [{ type: "text", text: "Collection not accessible" }],
        isError: true
      };
    }
    
    const results = await db
      .collection(collection)
      .find(filter)
      .limit(limit || 20)
      .toArray();
    
    return {
      content: [{ type: "text", text: JSON.stringify(results, null, 2) }]
    };
  }
});`}</code></pre>

        <h2>Caching for Performance</h2>

        <p>Database queries can be slow. Cache common queries.</p>

        <pre><code className="language-typescript">{`import { createClient } from "redis";

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

async function cachedQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  ttlSeconds: number = 300
): Promise<T> {
  // Check cache
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Run query
  const result = await queryFn();
  
  // Cache result
  await redis.setEx(key, ttlSeconds, JSON.stringify(result));
  
  return result;
}

// Usage
async function getPopularProducts() {
  return cachedQuery(
    "popular_products",
    () => query("SELECT * FROM products ORDER BY sales DESC LIMIT 10"),
    3600 // 1 hour cache
  );
}`}</code></pre>

        <h2>Read Replicas for Scale</h2>

        <p>Heavy read traffic? Use replicas.</p>

        <pre><code className="language-typescript">{`import { Pool } from "pg";

const writePool = new Pool({
  host: process.env.DB_PRIMARY_HOST,
  // ... config
});

const readPool = new Pool({
  host: process.env.DB_REPLICA_HOST,
  // ... config
});

async function read(sql: string, params: unknown[] = []) {
  const client = await readPool.connect();
  try {
    return (await client.query(sql, params)).rows;
  } finally {
    client.release();
  }
}

async function write(sql: string, params: unknown[] = []) {
  const client = await writePool.connect();
  try {
    return (await client.query(sql, params)).rows;
  } finally {
    client.release();
  }
}`}</code></pre>

        <h2>Transaction Support</h2>

        <p>For multi-step operations, use transactions.</p>

        <pre><code className="language-typescript">{`async function transferFunds(from: string, to: string, amount: number) {
  const client = await pool.connect();
  
  try {
    await client.query("BEGIN");
    
    // Debit source
    await client.query(
      "UPDATE accounts SET balance = balance - $1 WHERE id = $2",
      [amount, from]
    );
    
    // Credit destination
    await client.query(
      "UPDATE accounts SET balance = balance + $1 WHERE id = $2",
      [amount, to]
    );
    
    await client.query("COMMIT");
    return { success: true };
    
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}`}</code></pre>

        <h2>Best Practices</h2>

        <ol>
          <li><strong>Never expose raw SQL</strong> — Create specific tools for specific queries</li>
          <li><strong>Use parameterized queries</strong> — Prevent SQL injection</li>
          <li><strong>Limit result sizes</strong> — Don&apos;t let AI fetch 1M rows</li>
          <li><strong>Cache aggressively</strong> — Same queries will repeat</li>
          <li><strong>Log all queries</strong> — Audit trail is essential</li>
          <li><strong>Use read replicas</strong> — Keep write database healthy</li>
          <li><strong>Set timeouts</strong> — Kill slow queries before they kill your server</li>
        </ol>

        <h2>Related Guides</h2>

        <ul>
          <li><Link href="/mcp/mcp-typescript-server-guide">TypeScript MCP servers</Link></li>
          <li><Link href="/mcp/mcp-security-best-practices">Security best practices</Link></li>
          <li><Link href="/mcp/mcp-error-handling-patterns">Error handling patterns</Link></li>
        </ul>

        <hr />

        <p>
          <strong>Questions about database integration?</strong> Reach out on{" "}
          <a href="https://twitter.com/kaigritun">Twitter</a>.
        </p>
      </article>

      <div className="mt-16">
        <EmailSignup />
      </div>
    </main>
  );
}
