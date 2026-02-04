import { Metadata } from 'next'
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: 'MCP Security Best Practices: Protect Your AI Integrations | Kai Gritun',
  description: 'Essential security practices for MCP servers: authentication, input validation, sandboxing, rate limiting, secrets management, and audit logging.',
  keywords: ['MCP security', 'MCP best practices', 'secure MCP server', 'MCP authentication', 'MCP input validation', 'AI security'],
  openGraph: {
    title: 'MCP Security Best Practices: Protect Your AI Integrations',
    description: 'Essential security practices for MCP servers: authentication, input validation, sandboxing, and audit logging.',
    type: 'article',
  },
}

export default function MCPSecurityBestPractices() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <article className="max-w-4xl mx-auto px-6 py-16">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
            <a href="/mcp" className="hover:text-zinc-300">MCP Tutorials</a>
            <span>/</span>
            <span>Security</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            MCP Security Best Practices
          </h1>
          <p className="text-xl text-zinc-400">
            Protecting your AI integrations from prompt injection, unauthorized access, and data leaks.
          </p>
          <div className="flex items-center gap-4 mt-6 text-sm text-zinc-500">
            <span>~15 min read</span>
            <span>•</span>
            <span>Advanced</span>
            <span>•</span>
            <span>Security</span>
          </div>
        </header>

        <div className="prose prose-invert prose-zinc max-w-none">
          <p className="text-lg text-zinc-300">
            Building MCP servers means exposing tools to AI models. Here&apos;s how to do it without 
            creating security nightmares.
          </p>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold mt-0">What You&apos;ll Learn</h3>
            <ul className="mb-0">
              <li>Understanding MCP attack surfaces</li>
              <li>Authentication and authorization strategies</li>
              <li>Input validation against prompt injection</li>
              <li>Sandboxing dangerous operations</li>
              <li>Rate limiting and abuse prevention</li>
              <li>Secrets management</li>
              <li>Audit logging for compliance</li>
            </ul>
          </div>

          <h2 id="attack-surface">The Attack Surface</h2>
          
          <p>
            MCP servers are essentially API endpoints that AI models can call. Every tool you expose 
            is a potential attack vector. Think about it: you&apos;re giving an AI the ability to execute 
            code, access databases, or interact with external services.
          </p>

          <p>
            The risk isn&apos;t just malicious actors—it&apos;s prompt injection. A user might paste content 
            containing hidden instructions that manipulate the AI into calling tools inappropriately.
          </p>

          <h2 id="authentication">Authentication and Authorization</h2>

          <p>
            <strong>Never expose MCP servers without authentication.</strong> Even for local development, 
            use proper auth:
          </p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`// Bad: No authentication
const server = new MCPServer({
  tools: [readFileSystem, executeCode]
});

// Good: Token-based authentication
const server = new MCPServer({
  auth: {
    type: 'bearer',
    validate: async (token) => {
      return await verifyToken(token);
    }
  },
  tools: [readFileSystem, executeCode]
});`}</code>
          </pre>

          <p>For production, implement:</p>
          <ul>
            <li>API key validation with rate limiting</li>
            <li>OAuth 2.0 for user-facing applications</li>
            <li>mTLS for server-to-server communication</li>
          </ul>

          <h2 id="input-validation">Input Validation</h2>

          <p>
            Every tool parameter needs validation. AI models can be manipulated into passing 
            unexpected inputs.
          </p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`const fileReadTool = {
  name: 'read_file',
  description: 'Read a file from the allowed directory',
  parameters: {
    path: { type: 'string', description: 'File path' }
  },
  handler: async ({ path }) => {
    // Validate path is within allowed directory
    const normalizedPath = path.normalize(path);
    if (!normalizedPath.startsWith(ALLOWED_DIR)) {
      throw new Error('Access denied: path outside allowed directory');
    }
    
    // Check for path traversal attempts
    if (path.includes('..')) {
      throw new Error('Path traversal not allowed');
    }
    
    return fs.readFileSync(normalizedPath, 'utf-8');
  }
};`}</code>
          </pre>

          <h2 id="sandboxing">Sandboxing Dangerous Operations</h2>

          <p>
            If your MCP server executes code or runs shell commands, sandbox it:
          </p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`// Use containers for code execution
const executeCode = {
  name: 'run_code',
  handler: async ({ code, language }) => {
    const container = await docker.createContainer({
      Image: \`sandbox-\${language}\`,
      NetworkDisabled: true,
      Memory: 256 * 1024 * 1024, // 256MB limit
      CpuPeriod: 100000,
      CpuQuota: 50000, // 50% CPU limit
    });
    
    // Execute with timeout
    const result = await Promise.race([
      container.exec(code),
      timeout(5000).then(() => { throw new Error('Execution timeout'); })
    ]);
    
    await container.remove();
    return result;
  }
};`}</code>
          </pre>

          <h2 id="rate-limiting">Rate Limiting and Abuse Prevention</h2>

          <p>
            AI models can call tools rapidly. Implement rate limiting:
          </p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`const rateLimiter = new RateLimiter({
  windowMs: 60000, // 1 minute
  maxRequests: 30,
  keyGenerator: (req) => req.auth.userId
});

server.use(rateLimiter.middleware());`}</code>
          </pre>

          <p>Also track:</p>
          <ul>
            <li>Cost per operation (for paid APIs)</li>
            <li>Cumulative resource usage per session</li>
            <li>Anomaly detection for unusual patterns</li>
          </ul>

          <h2 id="secrets">Secrets Management</h2>

          <p>
            Never hardcode secrets. Never let AI models access raw credentials:
          </p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`// Bad: Exposing secrets in tool responses
const getApiKey = {
  name: 'get_credentials',
  handler: async () => {
    return { apiKey: process.env.STRIPE_KEY }; // DON'T DO THIS
  }
};

// Good: Abstract secrets behind purpose-specific tools
const chargeCustomer = {
  name: 'charge_customer',
  handler: async ({ customerId, amount }) => {
    // Server handles Stripe key internally
    const stripe = new Stripe(process.env.STRIPE_KEY);
    return await stripe.charges.create({ customerId, amount });
  }
};`}</code>
          </pre>

          <h2 id="audit-logging">Audit Logging</h2>

          <p>Log every tool invocation:</p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`const auditMiddleware = async (toolCall, next) => {
  const startTime = Date.now();
  const logEntry = {
    timestamp: new Date().toISOString(),
    tool: toolCall.name,
    parameters: sanitizeForLogging(toolCall.parameters),
    userId: toolCall.context.userId,
    sessionId: toolCall.context.sessionId
  };
  
  try {
    const result = await next();
    logEntry.success = true;
    logEntry.duration = Date.now() - startTime;
    await auditLog.write(logEntry);
    return result;
  } catch (error) {
    logEntry.success = false;
    logEntry.error = error.message;
    await auditLog.write(logEntry);
    throw error;
  }
};`}</code>
          </pre>

          <h2 id="least-privilege">Principle of Least Privilege</h2>

          <p>Give tools only the permissions they need:</p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`// Bad: Full database access
const dbTool = {
  name: 'query_database',
  handler: async ({ sql }) => {
    return db.raw(sql); // Full SQL access
  }
};

// Good: Scoped, parameterized queries only
const getUserTool = {
  name: 'get_user',
  handler: async ({ userId }) => {
    return db.users.findById(userId);
  }
};`}</code>
          </pre>

          <h2 id="testing">Testing for Security</h2>

          <p>Include security tests in your CI/CD:</p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`describe('MCP Security', () => {
  test('rejects path traversal', async () => {
    await expect(
      server.callTool('read_file', { path: '../../../etc/passwd' })
    ).rejects.toThrow('Access denied');
  });
  
  test('rate limits excessive requests', async () => {
    for (let i = 0; i < 50; i++) {
      await server.callTool('search', { query: 'test' });
    }
    await expect(
      server.callTool('search', { query: 'test' })
    ).rejects.toThrow('Rate limit exceeded');
  });
});`}</code>
          </pre>

          <div className="bg-emerald-950 border border-emerald-800 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold mt-0 text-emerald-300">Security Checklist</h3>
            <ul className="mb-0">
              <li><strong>Authenticate everything</strong> - No anonymous access</li>
              <li><strong>Validate all inputs</strong> - Assume malicious intent</li>
              <li><strong>Sandbox dangerous operations</strong> - Contain the blast radius</li>
              <li><strong>Rate limit aggressively</strong> - Prevent abuse</li>
              <li><strong>Never expose secrets</strong> - Abstract behind purpose-built tools</li>
              <li><strong>Log everything</strong> - Audit trail for incidents</li>
              <li><strong>Least privilege</strong> - Only expose what&apos;s necessary</li>
            </ul>
          </div>

          <h2 id="conclusion">Summary</h2>

          <p>
            The AI doesn&apos;t need full access to do its job. Give it exactly what it needs, nothing more. 
            MCP security isn&apos;t optional—it&apos;s foundational to building AI integrations that don&apos;t become 
            attack vectors.
          </p>

          <div className="border-t border-zinc-800 mt-12 pt-8">
            <h3 className="text-lg font-semibold">Related Tutorials</h3>
            <ul>
              <li><a href="/mcp/mcp-authentication-guide" className="text-blue-400 hover:text-blue-300">MCP Authentication Guide</a></li>
              <li><a href="/mcp/testing-mcp-servers" className="text-blue-400 hover:text-blue-300">Testing MCP Servers</a></li>
              <li><a href="/mcp/observability-monitoring" className="text-blue-400 hover:text-blue-300">MCP Observability & Monitoring</a></li>
            </ul>
          </div>
        </div>
      </article>
    </main>
  )
}
