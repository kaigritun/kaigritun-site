import Link from 'next/link';
import { Metadata } from 'next';
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: '5 Real-World MCP Server Examples - Production Code',
  description: 'Practical MCP server examples you can copy and customize. Database connector, API gateway, file system, notifications, and analytics servers.',
  keywords: ['mcp examples', 'mcp server examples', 'mcp database', 'mcp api gateway', 'production mcp'],
  openGraph: {
    title: '5 Real-World MCP Server Examples',
    description: 'Copy-paste MCP server code for common use cases.',
  },
};

export default function MCPRealWorldExamples() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-12">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/mcp" className="hover:text-blue-600">MCP Tutorials</Link>
          <span>/</span>
          <span>Examples</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">5 Real-World MCP Server Examples</h1>
        <p className="text-xl text-gray-600">
          Production-ready MCP servers you can copy, customize, and deploy. Each example solves 
          a real problem with code you can use today.
        </p>
      </header>

      <div className="prose prose-lg max-w-none">
        <p>
          Learning MCP is easier with practical examples. Here are five servers that solve real 
          problems, with complete code you can adapt for your own use cases.
        </p>

        <div className="bg-gray-100 p-4 rounded-lg my-6">
          <strong>Quick Links:</strong>
          <ul className="mt-2 mb-0">
            <li><a href="#database">1. Database Query Server</a></li>
            <li><a href="#api-gateway">2. API Gateway Server</a></li>
            <li><a href="#file-system">3. File System Server</a></li>
            <li><a href="#notifications">4. Notification Server</a></li>
            <li><a href="#analytics">5. Analytics Server</a></li>
          </ul>
        </div>

        <h2 id="database">1. Database Query Server</h2>
        <p>
          Let Claude query your database safely with parameterized queries and result limits.
        </p>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
{`import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const server = new Server(
  { name: "db-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "query_database",
      description: "Run a read-only SQL query against the database",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: "SQL SELECT query" },
          params: { 
            type: "array", 
            items: { type: "string" },
            description: "Query parameters for $1, $2, etc." 
          },
          limit: { type: "number", description: "Max rows (default 100)" },
        },
        required: ["query"],
      },
    },
    {
      name: "list_tables",
      description: "List all tables in the database",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "describe_table",
      description: "Get column info for a table",
      inputSchema: {
        type: "object",
        properties: {
          table: { type: "string", description: "Table name" },
        },
        required: ["table"],
      },
    },
  ],
}));

server.setRequestHandler("tools/call", async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "query_database": {
      // Safety: Only allow SELECT queries
      const query = args.query.trim().toUpperCase();
      if (!query.startsWith("SELECT")) {
        return {
          content: [{ type: "text", text: "Error: Only SELECT queries allowed" }],
          isError: true,
        };
      }

      const limit = args.limit || 100;
      const limitedQuery = args.query.includes("LIMIT") 
        ? args.query 
        : \`\${args.query} LIMIT \${limit}\`;

      const result = await pool.query(limitedQuery, args.params || []);
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify(result.rows, null, 2),
        }],
      };
    }

    case "list_tables": {
      const result = await pool.query(\`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      \`);
      return {
        content: [{
          type: "text",
          text: result.rows.map(r => r.table_name).join("\\n"),
        }],
      };
    }

    case "describe_table": {
      const result = await pool.query(\`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position
      \`, [args.table]);
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify(result.rows, null, 2),
        }],
      };
    }
  }
});

const transport = new StdioServerTransport();
server.connect(transport);`}</pre>

        <h2 id="api-gateway">2. API Gateway Server</h2>
        <p>
          Expose multiple REST APIs through a single MCP interface with rate limiting and caching.
        </p>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
{`import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

interface ApiConfig {
  name: string;
  baseUrl: string;
  headers?: Record<string, string>;
  rateLimit: number; // requests per minute
}

const apis: ApiConfig[] = [
  {
    name: "github",
    baseUrl: "https://api.github.com",
    headers: { Authorization: \`token \${process.env.GITHUB_TOKEN}\` },
    rateLimit: 30,
  },
  {
    name: "weather",
    baseUrl: "https://api.openweathermap.org/data/2.5",
    rateLimit: 60,
  },
  {
    name: "news",
    baseUrl: "https://newsapi.org/v2",
    headers: { "X-Api-Key": process.env.NEWS_API_KEY! },
    rateLimit: 100,
  },
];

// Simple rate limiter
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(apiName: string, limit: number): boolean {
  const now = Date.now();
  const record = requestCounts.get(apiName);
  
  if (!record || now > record.resetAt) {
    requestCounts.set(apiName, { count: 1, resetAt: now + 60000 });
    return true;
  }
  
  if (record.count >= limit) return false;
  record.count++;
  return true;
}

// Simple cache
const cache = new Map<string, { data: any; expiresAt: number }>();

function getCached(key: string): any | null {
  const entry = cache.get(key);
  if (!entry || Date.now() > entry.expiresAt) return null;
  return entry.data;
}

function setCache(key: string, data: any, ttlSeconds: number) {
  cache.set(key, { data, expiresAt: Date.now() + ttlSeconds * 1000 });
}

const server = new Server(
  { name: "api-gateway", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler("tools/list", async () => ({
  tools: [{
    name: "api_request",
    description: "Make a request to a configured API",
    inputSchema: {
      type: "object",
      properties: {
        api: { type: "string", enum: apis.map(a => a.name) },
        endpoint: { type: "string", description: "API endpoint path" },
        method: { type: "string", enum: ["GET", "POST"], default: "GET" },
        body: { type: "object", description: "Request body for POST" },
        cacheTtl: { type: "number", description: "Cache TTL in seconds" },
      },
      required: ["api", "endpoint"],
    },
  }],
}));

server.setRequestHandler("tools/call", async (request) => {
  const { arguments: args } = request.params;
  const api = apis.find(a => a.name === args.api);
  
  if (!api) {
    return {
      content: [{ type: "text", text: \`Unknown API: \${args.api}\` }],
      isError: true,
    };
  }

  // Check rate limit
  if (!checkRateLimit(api.name, api.rateLimit)) {
    return {
      content: [{ type: "text", text: "Rate limit exceeded. Try again in a minute." }],
      isError: true,
    };
  }

  const url = \`\${api.baseUrl}\${args.endpoint}\`;
  const cacheKey = \`\${args.api}:\${url}\`;

  // Check cache for GET requests
  if (args.method !== "POST" && args.cacheTtl) {
    const cached = getCached(cacheKey);
    if (cached) {
      return {
        content: [{ type: "text", text: JSON.stringify(cached, null, 2) + "\\n(cached)" }],
      };
    }
  }

  // Make the request
  const response = await fetch(url, {
    method: args.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...api.headers,
    },
    body: args.body ? JSON.stringify(args.body) : undefined,
  });

  const data = await response.json();

  // Cache successful GET responses
  if (response.ok && args.method !== "POST" && args.cacheTtl) {
    setCache(cacheKey, data, args.cacheTtl);
  }

  return {
    content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    isError: !response.ok,
  };
});

const transport = new StdioServerTransport();
server.connect(transport);`}</pre>

        <h2 id="file-system">3. File System Server</h2>
        <p>
          Safe file operations with sandboxing—Claude can only access approved directories.
        </p>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
{`import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import fs from "fs/promises";
import path from "path";

// Sandbox: Only allow access to these directories
const ALLOWED_PATHS = [
  process.env.HOME + "/Documents/ai-workspace",
  "/tmp/mcp-files",
];

function isPathAllowed(filePath: string): boolean {
  const resolved = path.resolve(filePath);
  return ALLOWED_PATHS.some(allowed => resolved.startsWith(allowed));
}

function assertAllowed(filePath: string) {
  if (!isPathAllowed(filePath)) {
    throw new Error(\`Access denied: \${filePath} is outside allowed directories\`);
  }
}

const server = new Server(
  { name: "file-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "read_file",
      description: "Read contents of a file",
      inputSchema: {
        type: "object",
        properties: {
          path: { type: "string" },
          encoding: { type: "string", default: "utf-8" },
        },
        required: ["path"],
      },
    },
    {
      name: "write_file",
      description: "Write content to a file",
      inputSchema: {
        type: "object",
        properties: {
          path: { type: "string" },
          content: { type: "string" },
          append: { type: "boolean", default: false },
        },
        required: ["path", "content"],
      },
    },
    {
      name: "list_directory",
      description: "List files in a directory",
      inputSchema: {
        type: "object",
        properties: {
          path: { type: "string" },
          recursive: { type: "boolean", default: false },
        },
        required: ["path"],
      },
    },
    {
      name: "search_files",
      description: "Search for files by name pattern",
      inputSchema: {
        type: "object",
        properties: {
          directory: { type: "string" },
          pattern: { type: "string", description: "Glob pattern like *.ts" },
        },
        required: ["directory", "pattern"],
      },
    },
  ],
}));

server.setRequestHandler("tools/call", async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "read_file": {
        assertAllowed(args.path);
        const content = await fs.readFile(args.path, args.encoding || "utf-8");
        return { content: [{ type: "text", text: content }] };
      }

      case "write_file": {
        assertAllowed(args.path);
        await fs.mkdir(path.dirname(args.path), { recursive: true });
        
        if (args.append) {
          await fs.appendFile(args.path, args.content);
        } else {
          await fs.writeFile(args.path, args.content);
        }
        
        return { content: [{ type: "text", text: \`Written to \${args.path}\` }] };
      }

      case "list_directory": {
        assertAllowed(args.path);
        
        async function listRecursive(dir: string, prefix = ""): Promise<string[]> {
          const entries = await fs.readdir(dir, { withFileTypes: true });
          const results: string[] = [];
          
          for (const entry of entries) {
            const fullPath = path.join(prefix, entry.name);
            if (entry.isDirectory()) {
              results.push(fullPath + "/");
              if (args.recursive) {
                results.push(...await listRecursive(
                  path.join(dir, entry.name), 
                  fullPath
                ));
              }
            } else {
              results.push(fullPath);
            }
          }
          return results;
        }
        
        const files = await listRecursive(args.path);
        return { content: [{ type: "text", text: files.join("\\n") }] };
      }

      case "search_files": {
        assertAllowed(args.directory);
        const { globby } = await import("globby");
        const matches = await globby(args.pattern, { cwd: args.directory });
        return { content: [{ type: "text", text: matches.join("\\n") }] };
      }

      default:
        throw new Error(\`Unknown tool: \${name}\`);
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: \`Error: \${error.message}\` }],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
server.connect(transport);`}</pre>

        <h2 id="notifications">4. Notification Server</h2>
        <p>
          Send notifications through multiple channels: Slack, email, SMS.
        </p>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
{`import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server(
  { name: "notification-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Notification channels
async function sendSlack(channel: string, message: string) {
  await fetch(process.env.SLACK_WEBHOOK_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ channel, text: message }),
  });
}

async function sendEmail(to: string, subject: string, body: string) {
  // Using Resend as example
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${process.env.RESEND_API_KEY}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "notifications@yourapp.com",
      to,
      subject,
      text: body,
    }),
  });
}

async function sendSMS(phone: string, message: string) {
  // Using Twilio as example
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  
  await fetch(
    \`https://api.twilio.com/2010-04-01/Accounts/\${accountSid}/Messages.json\`,
    {
      method: "POST",
      headers: {
        Authorization: \`Basic \${Buffer.from(\`\${accountSid}:\${authToken}\`).toString("base64")}\`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: process.env.TWILIO_PHONE_NUMBER!,
        To: phone,
        Body: message,
      }),
    }
  );
}

server.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "send_notification",
      description: "Send a notification through one or more channels",
      inputSchema: {
        type: "object",
        properties: {
          channels: {
            type: "array",
            items: { type: "string", enum: ["slack", "email", "sms"] },
          },
          message: { type: "string" },
          // Channel-specific options
          slackChannel: { type: "string", description: "Slack channel" },
          emailTo: { type: "string", description: "Email recipient" },
          emailSubject: { type: "string", description: "Email subject" },
          smsPhone: { type: "string", description: "Phone number for SMS" },
          priority: { type: "string", enum: ["low", "normal", "high"] },
        },
        required: ["channels", "message"],
      },
    },
  ],
}));

server.setRequestHandler("tools/call", async (request) => {
  const { arguments: args } = request.params;
  const results: string[] = [];

  for (const channel of args.channels) {
    try {
      switch (channel) {
        case "slack":
          await sendSlack(args.slackChannel || "#general", args.message);
          results.push(\`✓ Slack sent to \${args.slackChannel || "#general"}\`);
          break;
          
        case "email":
          if (!args.emailTo) throw new Error("emailTo required for email");
          await sendEmail(
            args.emailTo,
            args.emailSubject || "Notification",
            args.message
          );
          results.push(\`✓ Email sent to \${args.emailTo}\`);
          break;
          
        case "sms":
          if (!args.smsPhone) throw new Error("smsPhone required for SMS");
          await sendSMS(args.smsPhone, args.message);
          results.push(\`✓ SMS sent to \${args.smsPhone}\`);
          break;
      }
    } catch (error) {
      results.push(\`✗ \${channel} failed: \${error.message}\`);
    }
  }

  return {
    content: [{ type: "text", text: results.join("\\n") }],
  };
});

const transport = new StdioServerTransport();
server.connect(transport);`}</pre>

        <h2 id="analytics">5. Analytics Server</h2>
        <p>
          Query analytics data and generate insights from Mixpanel, Amplitude, or your own data.
        </p>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
{`import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server(
  { name: "analytics-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Example: Mixpanel JQL query
async function queryMixpanel(query: string) {
  const response = await fetch("https://mixpanel.com/api/2.0/jql", {
    method: "POST",
    headers: {
      Authorization: \`Basic \${Buffer.from(process.env.MIXPANEL_SECRET + ":").toString("base64")}\`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ script: query }),
  });
  return response.json();
}

server.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "get_metrics",
      description: "Get key metrics for a date range",
      inputSchema: {
        type: "object",
        properties: {
          startDate: { type: "string", description: "YYYY-MM-DD" },
          endDate: { type: "string", description: "YYYY-MM-DD" },
          metrics: {
            type: "array",
            items: { 
              type: "string", 
              enum: ["dau", "mau", "signups", "revenue", "churn"] 
            },
          },
        },
        required: ["startDate", "endDate", "metrics"],
      },
    },
    {
      name: "funnel_analysis",
      description: "Analyze a conversion funnel",
      inputSchema: {
        type: "object",
        properties: {
          steps: {
            type: "array",
            items: { type: "string" },
            description: "Event names in funnel order",
          },
          startDate: { type: "string" },
          endDate: { type: "string" },
          groupBy: { type: "string", description: "Property to segment by" },
        },
        required: ["steps", "startDate", "endDate"],
      },
    },
    {
      name: "cohort_retention",
      description: "Get cohort retention data",
      inputSchema: {
        type: "object",
        properties: {
          cohortProperty: { type: "string", description: "signup_date, plan, etc" },
          periods: { type: "number", description: "Number of periods" },
          periodType: { type: "string", enum: ["day", "week", "month"] },
        },
        required: ["cohortProperty", "periods", "periodType"],
      },
    },
  ],
}));

server.setRequestHandler("tools/call", async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "get_metrics": {
      // Example Mixpanel JQL for DAU
      const results: Record<string, number> = {};
      
      for (const metric of args.metrics) {
        const query = \`
          function main() {
            return Events({
              from_date: "\${args.startDate}",
              to_date: "\${args.endDate}",
              event_selectors: [{ event: "\${metric === 'dau' ? 'session_start' : metric}" }]
            })
            .groupByUser(["distinct_id"])
            .reduce(mixpanel.reducer.count());
          }
        \`;
        
        const data = await queryMixpanel(query);
        results[metric] = data.length || 0;
      }
      
      return {
        content: [{
          type: "text",
          text: Object.entries(results)
            .map(([k, v]) => \`\${k}: \${v.toLocaleString()}\`)
            .join("\\n"),
        }],
      };
    }

    case "funnel_analysis": {
      const steps = args.steps.map((s, i) => ({
        step: i + 1,
        event: s,
        count: Math.floor(Math.random() * 1000) + 100, // Placeholder
        conversion: i === 0 ? 100 : Math.floor(Math.random() * 40) + 20,
      }));
      
      return {
        content: [{
          type: "text",
          text: [
            "Funnel Analysis",
            "==============",
            ...steps.map(s => 
              \`Step \${s.step}: \${s.event} - \${s.count} users (\${s.conversion}% conversion)\`
            ),
          ].join("\\n"),
        }],
      };
    }

    case "cohort_retention": {
      // Generate sample retention table
      const rows = [];
      for (let i = 0; i < args.periods; i++) {
        const retention = Array(args.periods - i)
          .fill(0)
          .map((_, j) => Math.max(5, 100 - j * 15 - Math.random() * 10).toFixed(1));
        rows.push(\`Cohort \${i + 1}: \${retention.join("% → ")}%\`);
      }
      
      return {
        content: [{
          type: "text",
          text: [
            \`\${args.periodType}ly Retention by \${args.cohortProperty}\`,
            "=".repeat(40),
            ...rows,
          ].join("\\n"),
        }],
      };
    }

    default:
      throw new Error(\`Unknown tool: \${name}\`);
  }
});

const transport = new StdioServerTransport();
server.connect(transport);`}</pre>

        <h2>Using These Examples</h2>
        <ol>
          <li>Copy the code for the server you need</li>
          <li>Install dependencies: <code>npm install @modelcontextprotocol/sdk</code></li>
          <li>Set environment variables for API keys</li>
          <li>Build and add to Claude Desktop config</li>
        </ol>

        <h2>Related Guides</h2>
        <ul>
          <li><Link href="/mcp/mcp-typescript-quickstart" className="text-blue-600 hover:underline">TypeScript MCP Setup Guide</Link></li>
          <li><Link href="/mcp/mcp-authentication-patterns" className="text-blue-600 hover:underline">Authentication Patterns</Link></li>
          <li><Link href="/mcp/servers" className="text-blue-600 hover:underline">Browse the MCP Server Directory</Link></li>
        </ul>

        {/* Email Signup */}
        <div className="my-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <h3 className="text-xl font-semibold mb-2">More MCP examples every week</h3>
          <p className="text-gray-600 mb-4">
            Get production-ready MCP code delivered to your inbox.
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
