import type { Metadata } from "next";
import EmailSignup from "@/components/EmailSignup";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MCP Security Best Practices: Protecting Your Server",
  description:
    "Essential security practices for MCP servers: input validation, path traversal prevention, rate limiting, secrets management, and audit logging.",
  openGraph: {
    title: "MCP Security Best Practices: Protecting Your Server",
    description:
      "Essential security practices for MCP servers: input validation, path traversal prevention, rate limiting, secrets management, and audit logging.",
    type: "article",
    publishedTime: "2025-02-04",
  },
  twitter: {
    card: "summary_large_image",
    title: "MCP Security Best Practices",
    description: "Protect your MCP servers from common vulnerabilities",
  },
};

export default function MCPSecurityBestPractices() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-8">
        <Link href="/mcp" className="text-gray-400 hover:text-white transition">
          ← Back to MCP Tutorials
        </Link>
      </div>

      <article className="prose prose-lg prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-4">
          MCP Security Best Practices: Protecting Your Server
        </h1>

        <p className="text-gray-400 text-sm mb-8">
          Published February 4, 2025 · 20 min read
        </p>

        <p className="lead text-xl text-gray-300">
          MCP servers often have access to sensitive data and system resources. A poorly 
          secured server is an attack vector. This guide covers the security practices 
          every MCP developer should implement.
        </p>

        <h2>The Threat Model</h2>

        <p>MCP servers sit between AI assistants and your systems. Threats include:</p>

        <ul>
          <li><strong>Prompt injection</strong>: Malicious prompts trying to manipulate tool calls</li>
          <li><strong>Data exfiltration</strong>: Unauthorized access to sensitive information</li>
          <li><strong>Resource abuse</strong>: Denial of service through excessive requests</li>
          <li><strong>Privilege escalation</strong>: Gaining access beyond intended scope</li>
        </ul>

        <h2>Input Validation</h2>

        <p>Never trust input. Ever.</p>

        <pre><code className="language-typescript">{`import { z } from "zod";

// Define strict schemas
const FileReadSchema = z.object({
  path: z.string()
    .max(500)
    .refine(
      (p) => !p.includes("..") && !p.startsWith("/"),
      "Path traversal not allowed"
    ),
  encoding: z.enum(["utf8", "base64"]).default("utf8")
});

const DatabaseQuerySchema = z.object({
  query: z.string().max(1000),
  // Whitelist allowed operations
  operation: z.enum(["SELECT", "COUNT"]),
  table: z.enum(["users", "products", "orders"]),
  limit: z.number().int().min(1).max(100).default(10)
});

function handleToolCall(name: string, args: unknown) {
  // Validate before processing
  const validated = FileReadSchema.safeParse(args);
  if (!validated.success) {
    return {
      content: [{ type: "text", text: "Invalid parameters" }],
      isError: true
    };
  }
  // Now safe to use validated.data
}`}</code></pre>

        <h2>Path Traversal Prevention</h2>

        <p>File operations are high-risk. Contain them.</p>

        <pre><code className="language-typescript">{`import path from "path";
import { realpath } from "fs/promises";

const ALLOWED_BASE = "/app/data";

async function safePath(userPath: string): Promise<string> {
  // Resolve to absolute path
  const resolved = path.resolve(ALLOWED_BASE, userPath);
  
  // Get real path (resolves symlinks)
  const real = await realpath(resolved);
  
  // Verify still within allowed directory
  if (!real.startsWith(ALLOWED_BASE)) {
    throw new Error("Access denied: path outside allowed directory");
  }
  
  return real;
}

// Use it
async function readFile(userPath: string) {
  const safe = await safePath(userPath);
  return fs.readFile(safe, "utf8");
}`}</code></pre>

        <h2>Rate Limiting</h2>

        <p>Prevent abuse with request limits.</p>

        <pre><code className="language-typescript">{`class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  constructor(
    private maxRequests: number,
    private windowMs: number
  ) {}
  
  check(key: string): boolean {
    const now = Date.now();
    const timestamps = this.requests.get(key) || [];
    
    // Remove old timestamps
    const valid = timestamps.filter(t => now - t < this.windowMs);
    
    if (valid.length >= this.maxRequests) {
      return false; // Rate limited
    }
    
    valid.push(now);
    this.requests.set(key, valid);
    return true;
  }
}

const limiter = new RateLimiter(100, 60000); // 100 req/min

function handleRequest(toolName: string, args: unknown) {
  if (!limiter.check(toolName)) {
    return {
      content: [{ type: "text", text: "Rate limit exceeded" }],
      isError: true
    };
  }
  // Process request
}`}</code></pre>

        <h2>Secrets Management</h2>

        <p>Never hardcode secrets.</p>

        <pre><code className="language-typescript">{`// Bad
const API_KEY = "sk-1234567890";

// Good
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable required");
}

// Better: Use a secrets manager
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

async function getSecret(name: string): Promise<string> {
  const client = new SecretManagerServiceClient();
  const [version] = await client.accessSecretVersion({
    name: \`projects/my-project/secrets/\${name}/versions/latest\`
  });
  return version.payload?.data?.toString() || "";
}`}</code></pre>

        <h2>Audit Logging</h2>

        <p>Log everything. You&apos;ll need it.</p>

        <pre><code className="language-typescript">{`interface AuditLog {
  timestamp: string;
  tool: string;
  args: unknown;
  result: "success" | "error" | "denied";
  duration: number;
  error?: string;
}

function logAudit(log: AuditLog) {
  // Redact sensitive fields
  const sanitized = {
    ...log,
    args: redactSensitive(log.args)
  };
  console.log(JSON.stringify(sanitized));
}

function redactSensitive(obj: unknown): unknown {
  if (typeof obj !== "object" || obj === null) return obj;
  
  const sensitive = ["password", "token", "secret", "key", "auth"];
  const result: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (sensitive.some(s => key.toLowerCase().includes(s))) {
      result[key] = "[REDACTED]";
    } else {
      result[key] = redactSensitive(value);
    }
  }
  return result;
}`}</code></pre>

        <h2>Principle of Least Privilege</h2>

        <p>Only expose what&apos;s necessary.</p>

        <pre><code className="language-typescript">{`// Don't do this
tools: [
  { name: "execute_sql", description: "Run any SQL query" }
]

// Do this
tools: [
  { name: "get_user_orders", description: "Get orders for a user ID" },
  { name: "get_product_info", description: "Get product details by SKU" },
  { name: "count_inventory", description: "Count items in stock" }
]`}</code></pre>

        <p>Specific, limited tools are safer than general-purpose ones.</p>

        <h2>Sandboxing</h2>

        <p>Isolate dangerous operations.</p>

        <pre><code className="language-typescript">{`import { VM } from "vm2";

function safeEval(code: string, context: object) {
  const vm = new VM({
    timeout: 1000,
    sandbox: context,
    eval: false,
    wasm: false
  });
  
  return vm.run(code);
}`}</code></pre>

        <p>Or use Docker for complete isolation:</p>

        <pre><code className="language-yaml">{`# docker-compose.yml
services:
  mcp-server:
    build: .
    read_only: true
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    mem_limit: 256m
    cpus: 0.5`}</code></pre>

        <h2>Environment Separation</h2>

        <p>Don&apos;t mix production and development.</p>

        <pre><code className="language-typescript">{`const config = {
  development: {
    database: "dev_db",
    allowedPaths: ["/tmp", "./data"],
    rateLimit: 1000
  },
  production: {
    database: process.env.DB_NAME,
    allowedPaths: ["/app/data"],
    rateLimit: 100
  }
};

const env = process.env.NODE_ENV || "development";
const settings = config[env as keyof typeof config];`}</code></pre>

        <h2>Security Checklist</h2>

        <p>Before deploying any MCP server:</p>

        <ul>
          <li>All inputs validated with strict schemas</li>
          <li>No path traversal possible</li>
          <li>Rate limiting implemented</li>
          <li>Secrets in environment variables or secret manager</li>
          <li>Audit logging enabled</li>
          <li>Tools follow least privilege</li>
          <li>Error messages don&apos;t leak sensitive info</li>
          <li>Dependencies scanned for vulnerabilities</li>
          <li>Container runs as non-root user</li>
          <li>Network access restricted to necessary endpoints</li>
        </ul>

        <h2>Related Guides</h2>

        <ul>
          <li><Link href="/mcp/mcp-typescript-server-guide">Building TypeScript MCP servers</Link></li>
          <li><Link href="/mcp/mcp-docker-deployment">Docker deployment</Link></li>
          <li><Link href="/mcp/mcp-error-handling-patterns">Error handling patterns</Link></li>
        </ul>

        <hr />

        <p>
          <strong>Questions about MCP security?</strong> Reach out on{" "}
          <a href="https://twitter.com/kaigritun">Twitter</a>.
        </p>
      </article>

      <div className="mt-16">
        <EmailSignup />
      </div>
    </main>
  );
}
