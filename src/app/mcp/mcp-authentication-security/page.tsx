import { Metadata } from 'next';
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: "MCP Authentication and Security Best Practices (2025 Guide)",
  description: "Secure your MCP servers with API keys, OAuth, mTLS, rate limiting, and audit logging. Complete guide to MCP security patterns and vulnerability prevention.",
  keywords: ["MCP security", "MCP authentication", "Model Context Protocol security", "MCP API keys", "MCP OAuth", "secure MCP servers"],
  openGraph: {
    title: "MCP Authentication and Security Best Practices",
    description: "Complete guide to securing MCP servers with authentication, rate limiting, and audit logging.",
    type: "article",
  },
};

export default function MCPAuthenticationSecurity() {
  return (
    <main className="min-h-screen bg-black text-white">
      <article className="max-w-3xl mx-auto px-6 py-16">
        <header className="mb-12">
          <div className="text-orange-500 text-sm font-mono mb-4">MCP Guide</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            MCP Authentication and Security Best Practices
          </h1>
          <p className="text-gray-400 text-lg">
            Secure your MCP servers with proper authentication, input validation, and audit logging.
          </p>
          <div className="text-gray-500 text-sm mt-4">
            Updated February 2025 · 10 min read
          </div>
        </header>

        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-xl text-gray-300 leading-relaxed">
            MCP servers often access sensitive resources: databases, APIs, file systems. Without proper authentication, you're giving AI assistants—and potentially malicious actors—unrestricted access. This guide covers security patterns that protect your infrastructure.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Why MCP Security Matters</h2>
          
          <p className="text-gray-300">
            Every MCP tool is a potential attack surface. An unsecured server could expose:
          </p>
          
          <ul className="text-gray-300 space-y-2 my-4">
            <li>• Database credentials and sensitive data</li>
            <li>• File system access (path traversal attacks)</li>
            <li>• API keys to external services</li>
            <li>• Command execution capabilities</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Authentication Patterns</h2>

          <h3 className="text-xl font-bold mt-8 mb-4 text-orange-500">1. API Key Authentication</h3>
          
          <p className="text-gray-300">
            The simplest approach. Pass an API key in the transport configuration:
          </p>

          <div className="bg-gray-900 rounded-lg p-4 my-6 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`from mcp.server import Server
import os

server = Server("secure-server")

API_KEY = os.environ.get("MCP_API_KEY")

@server.middleware
async def authenticate(request, call_next):
    if request.headers.get("X-API-Key") != API_KEY:
        raise PermissionError("Invalid API key")
    return await call_next(request)`}
            </pre>
          </div>

          <p className="text-gray-300">
            <strong>Key rule:</strong> Store keys in environment variables, never in code.
          </p>

          <h3 className="text-xl font-bold mt-8 mb-4 text-orange-500">2. OAuth 2.0 Integration</h3>
          
          <p className="text-gray-300">
            For enterprise deployments, OAuth provides proper token management:
          </p>

          <div className="bg-gray-900 rounded-lg p-4 my-6 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`from mcp.server import Server
import jwt

server = Server("oauth-server")

@server.middleware
async def verify_oauth_token(request, call_next):
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    try:
        payload = jwt.decode(token, PUBLIC_KEY, algorithms=["RS256"])
        request.user = payload
    except jwt.InvalidTokenError:
        raise PermissionError("Invalid token")
    return await call_next(request)`}
            </pre>
          </div>

          <h3 className="text-xl font-bold mt-8 mb-4 text-orange-500">3. mTLS (Mutual TLS)</h3>
          
          <p className="text-gray-300">
            For maximum security, require client certificates:
          </p>

          <div className="bg-gray-900 rounded-lg p-4 my-6 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`import ssl

ssl_context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
ssl_context.load_cert_chain("server.crt", "server.key")
ssl_context.load_verify_locations("ca.crt")
ssl_context.verify_mode = ssl.CERT_REQUIRED`}
            </pre>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Tool-Level Permissions</h2>

          <p className="text-gray-300">
            Not all tools need the same access level. Implement granular permissions:
          </p>

          <div className="bg-gray-900 rounded-lg p-4 my-6 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`TOOL_PERMISSIONS = {
    "read_file": ["read"],
    "write_file": ["read", "write"],
    "delete_file": ["read", "write", "admin"],
}

@server.tool()
async def guarded_tool(name: str, context):
    required = TOOL_PERMISSIONS.get(name, ["admin"])
    user_perms = context.user.get("permissions", [])
    
    if not any(p in user_perms for p in required):
        raise PermissionError(f"Missing permission for {name}")`}
            </pre>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Input Validation</h2>

          <p className="text-gray-300">
            AI-generated inputs can be unpredictable. Validate everything:
          </p>

          <div className="bg-gray-900 rounded-lg p-4 my-6 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`from pydantic import BaseModel, validator
import re

class FileRequest(BaseModel):
    path: str
    
    @validator("path")
    def validate_path(cls, v):
        # Prevent path traversal
        if ".." in v or v.startswith("/"):
            raise ValueError("Invalid path")
        # Whitelist allowed directories
        if not v.startswith(("docs/", "data/")):
            raise ValueError("Access denied")
        return v`}
            </pre>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Rate Limiting</h2>

          <p className="text-gray-300">
            Prevent abuse with rate limits:
          </p>

          <div className="bg-gray-900 rounded-lg p-4 my-6 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`from collections import defaultdict
import time

class RateLimiter:
    def __init__(self, max_requests=100, window=60):
        self.max_requests = max_requests
        self.window = window
        self.requests = defaultdict(list)
    
    def check(self, client_id):
        now = time.time()
        self.requests[client_id] = [
            t for t in self.requests[client_id] 
            if now - t < self.window
        ]
        if len(self.requests[client_id]) >= self.max_requests:
            raise Exception("Rate limit exceeded")
        self.requests[client_id].append(now)`}
            </pre>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Audit Logging</h2>

          <p className="text-gray-300">
            Log all tool invocations for security review:
          </p>

          <div className="bg-gray-900 rounded-lg p-4 my-6 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`import logging
import json
import time

audit_logger = logging.getLogger("mcp.audit")

@server.middleware
async def audit_log(request, call_next):
    result = await call_next(request)
    audit_logger.info(json.dumps({
        "timestamp": time.time(),
        "tool": request.tool_name,
        "user": request.user.get("sub"),
        "args": request.arguments,
        "success": result.success
    }))
    return result`}
            </pre>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Common Vulnerabilities</h2>

          <div className="bg-gray-900 rounded-lg p-6 my-8">
            <h3 className="text-orange-500 font-bold mb-4">1. Path Traversal</h3>
            <pre className="text-sm text-gray-300">
{`# VULNERABLE
def read_file(path):
    return open(f"data/{path}").read()

# User passes: "../../../etc/passwd"`}
            </pre>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 my-8">
            <h3 className="text-orange-500 font-bold mb-4">2. Command Injection</h3>
            <pre className="text-sm text-gray-300">
{`# VULNERABLE
def run_command(cmd):
    os.system(f"ls {cmd}")

# User passes: "; rm -rf /"`}
            </pre>
          </div>

          <p className="text-gray-300">
            Always sanitize and validate inputs. Use allowlists, not blocklists.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Security Checklist</h2>

          <div className="bg-gray-900 rounded-lg p-6 my-8">
            <ul className="text-gray-300 space-y-2">
              <li>☐ API keys stored in environment variables</li>
              <li>☐ Input validation on all tool parameters</li>
              <li>☐ Path traversal prevention for file operations</li>
              <li>☐ Rate limiting enabled</li>
              <li>☐ Audit logging configured</li>
              <li>☐ HTTPS/TLS for all connections</li>
              <li>☐ Principle of least privilege for tool permissions</li>
              <li>☐ Regular key rotation policy</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Next Steps</h2>

          <div className="bg-gray-900 rounded-lg p-6 my-8">
            <ul className="text-gray-300 space-y-2">
              <li>→ <a href="/mcp/mcp-error-handling-patterns" className="text-orange-500 hover:underline">MCP Error Handling Patterns</a> — Graceful security failures</li>
              <li>→ <a href="/mcp/mcp-docker-deployment" className="text-orange-500 hover:underline">MCP Docker Deployment</a> — Secure containerized deployment</li>
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
