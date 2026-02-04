import Link from 'next/link';
import { Metadata } from 'next';
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: 'MCP Authentication: API Keys, OAuth, and Token Management',
  description: 'Learn how to secure MCP servers with authentication. Covers API key validation, OAuth flows, token refresh, and credential management best practices.',
  keywords: ['mcp authentication', 'mcp security', 'api key validation', 'oauth mcp', 'token management'],
  openGraph: {
    title: 'MCP Authentication: API Keys, OAuth, and Token Management',
    description: 'Secure your MCP servers with proper authentication patterns.',
  },
};

export default function MCPAuthenticationPatterns() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-12">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/mcp" className="hover:text-blue-600">MCP Tutorials</Link>
          <span>/</span>
          <span>Security</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">MCP Authentication: API Keys, OAuth, and Token Management</h1>
        <p className="text-xl text-gray-600">
          Secure your MCP servers with production-ready authentication patterns. Learn API key validation, 
          OAuth integration, and token management best practices.
        </p>
      </header>

      <div className="prose prose-lg max-w-none">
        <p>
          Security is non-negotiable when building MCP servers that handle sensitive data or perform actions 
          on behalf of users. This guide covers the authentication patterns you need to know—from simple 
          API keys to full OAuth flows.
        </p>

        <h2>Why Authentication Matters for MCP</h2>
        <p>
          MCP servers act as bridges between AI models and external systems. Without proper authentication:
        </p>
        <ul>
          <li>Unauthorized users could access sensitive data</li>
          <li>AI models could be tricked into performing malicious actions</li>
          <li>Your API quotas could be exhausted by bad actors</li>
          <li>Audit trails become impossible to maintain</li>
        </ul>

        <h2>Pattern 1: API Key Authentication</h2>
        <p>
          The simplest authentication method. Great for server-to-server communication and internal tools.
        </p>

        <h3>Basic API Key Validation</h3>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
{`import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const VALID_API_KEYS = new Set([
  process.env.API_KEY_1,
  process.env.API_KEY_2,
]);

function validateApiKey(key: string | undefined): boolean {
  if (!key) return false;
  return VALID_API_KEYS.has(key);
}

const server = new Server(
  { name: "secure-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Middleware to check API key on each request
server.setRequestHandler("tools/call", async (request) => {
  const apiKey = request.params?.apiKey as string;
  
  if (!validateApiKey(apiKey)) {
    throw new Error("Invalid or missing API key");
  }
  
  // Process the actual tool call
  return handleToolCall(request);
});`}</pre>

        <h3>Hashed API Key Storage</h3>
        <p>
          Never store API keys in plain text. Use a one-way hash for comparison:
        </p>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
{`import crypto from 'crypto';

function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

// Store hashed keys, not plain text
const HASHED_KEYS = new Set([
  hashApiKey(process.env.API_KEY_1!),
  hashApiKey(process.env.API_KEY_2!),
]);

function validateApiKey(key: string): boolean {
  const hashedInput = hashApiKey(key);
  return HASHED_KEYS.has(hashedInput);
}`}</pre>

        <h2>Pattern 2: OAuth 2.0 Integration</h2>
        <p>
          For MCP servers that need to access user data from third-party services (GitHub, Google, Slack, etc.), 
          OAuth is the standard approach.
        </p>

        <h3>OAuth Flow Overview</h3>
        <ol>
          <li>User initiates connection through your app</li>
          <li>Redirect to OAuth provider's authorization page</li>
          <li>User grants permissions</li>
          <li>Provider redirects back with authorization code</li>
          <li>Exchange code for access token</li>
          <li>Store token securely for MCP server use</li>
        </ol>

        <h3>Token Storage for MCP</h3>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
{`import { Server } from "@modelcontextprotocol/sdk/server/index.js";

interface TokenStore {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

class OAuthMCPServer {
  private tokens: Map<string, TokenStore> = new Map();

  async getValidToken(userId: string): Promise<string> {
    const stored = this.tokens.get(userId);
    
    if (!stored) {
      throw new Error("No token found. User must authenticate.");
    }
    
    // Check if token is expired (with 5 min buffer)
    if (Date.now() > stored.expiresAt - 300000) {
      return this.refreshToken(userId, stored.refreshToken);
    }
    
    return stored.accessToken;
  }

  async refreshToken(userId: string, refreshToken: string): Promise<string> {
    const response = await fetch("https://oauth.provider.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: process.env.OAUTH_CLIENT_ID!,
        client_secret: process.env.OAUTH_CLIENT_SECRET!,
      }),
    });
    
    const data = await response.json();
    
    this.tokens.set(userId, {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || refreshToken,
      expiresAt: Date.now() + (data.expires_in * 1000),
    });
    
    return data.access_token;
  }
}`}</pre>

        <h2>Pattern 3: JWT Token Validation</h2>
        <p>
          JWTs are ideal when your MCP server needs to verify tokens issued by another service 
          without making network calls for each request.
        </p>

        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
{`import jwt from 'jsonwebtoken';

interface TokenPayload {
  sub: string;      // User ID
  scope: string[];  // Allowed actions
  exp: number;      // Expiration
}

function validateJWT(token: string): TokenPayload {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    
    // Check expiration
    if (payload.exp < Date.now() / 1000) {
      throw new Error("Token expired");
    }
    
    return payload;
  } catch (error) {
    throw new Error("Invalid token");
  }
}

// Use in MCP tool handler
server.setRequestHandler("tools/call", async (request) => {
  const token = request.params?.authToken as string;
  const payload = validateJWT(token);
  
  // Check if user has permission for this tool
  const toolName = request.params?.name as string;
  if (!payload.scope.includes(toolName) && !payload.scope.includes("*")) {
    throw new Error(\`User lacks permission for tool: \${toolName}\`);
  }
  
  return handleToolCall(request, payload.sub);
});`}</pre>

        <h2>Pattern 4: Credential Management Best Practices</h2>
        
        <h3>Environment Variables</h3>
        <p>Never hardcode credentials. Use environment variables with proper scoping:</p>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
{`# .env.local (never commit this)
MCP_API_KEY=your-secret-key
OAUTH_CLIENT_ID=xxx
OAUTH_CLIENT_SECRET=xxx
JWT_SECRET=your-jwt-secret

# Load in your server
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });`}</pre>

        <h3>Secrets Management Services</h3>
        <p>For production, use a secrets manager:</p>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
{`// AWS Secrets Manager example
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({ region: "us-east-1" });

async function getSecret(secretName: string): Promise<string> {
  const response = await client.send(
    new GetSecretValueCommand({ SecretId: secretName })
  );
  return response.SecretString!;
}

// Initialize at startup
const API_KEY = await getSecret("mcp-server/api-key");`}</pre>

        <h2>Pattern 5: Request Signing</h2>
        <p>
          For high-security scenarios, sign each request to prevent tampering:
        </p>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
{`import crypto from 'crypto';

function signRequest(payload: object, secret: string, timestamp: number): string {
  const message = JSON.stringify(payload) + timestamp.toString();
  return crypto.createHmac('sha256', secret).update(message).digest('hex');
}

function verifySignature(
  payload: object, 
  signature: string, 
  timestamp: number,
  secret: string
): boolean {
  // Reject if timestamp is more than 5 minutes old
  if (Date.now() - timestamp > 300000) {
    return false;
  }
  
  const expectedSignature = signRequest(payload, secret, timestamp);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}`}</pre>

        <h2>Security Checklist</h2>
        <p>Before deploying your authenticated MCP server:</p>
        <ul>
          <li>✅ All secrets loaded from environment or secrets manager</li>
          <li>✅ API keys are hashed before storage/comparison</li>
          <li>✅ OAuth tokens are refreshed before expiration</li>
          <li>✅ JWTs are validated with proper signature verification</li>
          <li>✅ Failed auth attempts are logged (without logging the credentials)</li>
          <li>✅ Rate limiting is in place to prevent brute force</li>
          <li>✅ HTTPS/TLS for all network communication</li>
          <li>✅ Sensitive data is never logged</li>
        </ul>

        <h2>Next Steps</h2>
        <p>
          Now that you understand MCP authentication patterns, you're ready to build secure servers. 
          Check out these related guides:
        </p>
        <ul>
          <li><Link href="/mcp/how-to-build-mcp-server-python" className="text-blue-600 hover:underline">Build Your First MCP Server in Python</Link></li>
          <li><Link href="/mcp/mcp-error-handling-patterns" className="text-blue-600 hover:underline">MCP Error Handling Patterns</Link></li>
          <li><Link href="/mcp/testing-mcp-servers" className="text-blue-600 hover:underline">Testing MCP Servers</Link></li>
        </ul>

        {/* Email Signup */}
        <div className="my-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <h3 className="text-xl font-semibold mb-2">Get MCP tutorials in your inbox</h3>
          <p className="text-gray-600 mb-4">
            Weekly guides on building AI-powered tools with the Model Context Protocol.
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
