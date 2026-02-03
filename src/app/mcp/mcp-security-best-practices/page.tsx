import Link from "next/link";
import type { Metadata } from "next";
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: "MCP Security Best Practices (2026 Guide) | Kai Gritun",
  description: "Learn essential security patterns for production MCP servers. Authentication, input validation, secrets management, rate limiting, and audit logging for Model Context Protocol.",
  keywords: ["MCP security", "MCP authentication", "Model Context Protocol security", "secure MCP server", "MCP best practices", "MCP input validation"],
};

export default function MCPSecurityBestPractices() {
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
          {/* Meta */}
          <div className="mb-8">
            <Link href="/mcp" className="text-blue-400 hover:text-blue-300 text-sm mb-4 inline-block">
              ← Back to MCP Tutorials
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              MCP Security Best Practices
            </h1>
            <p className="text-gray-400 text-lg mb-4">
              MCP servers expose powerful capabilities to AI agents. That power comes with security 
              responsibility. Learn authentication, input validation, secrets management, and audit logging.
            </p>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>February 3, 2026</span>
              <span>·</span>
              <span>8 min read</span>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p>
              A poorly secured MCP server can leak API keys, expose sensitive data, or become 
              an attack vector. This guide covers security patterns for production MCP servers.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4">The Security Mindset</h2>
            <p>
              MCP servers are attack surfaces. They receive arbitrary input from AI agents who 
              might be influenced by malicious prompts (prompt injection). Your server must:
            </p>

            <ul className="list-disc list-inside space-y-2 text-gray-300 my-4">
              <li>Never trust input blindly</li>
              <li>Protect sensitive credentials</li>
              <li>Log operations for audit</li>
              <li>Fail safely without leaking information</li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-4">1. Authentication Patterns</h2>

            <h3 className="text-xl font-semibold mt-8 mb-3">Token-Based Auth</h3>
            <p>Most MCP deployments use token-based authentication:</p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`from mcp.server import Server
import os

server = Server("secure-server")

# Load token from environment (never hardcode)
VALID_TOKEN = os.environ.get("MCP_AUTH_TOKEN")

@server.tool("secure_action")
async def secure_action(auth_token: str, action: str) -> str:
    # Validate token first
    if not auth_token or auth_token != VALID_TOKEN:
        return "Error: Invalid authentication token"
    
    # Proceed with authenticated action
    return f"Authenticated action: {action}"`}
              </pre>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-3">Per-Tool Permissions</h3>
            <p>Different tools need different permission levels:</p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`PERMISSIONS = {
    "read_data": ["viewer", "editor", "admin"],
    "write_data": ["editor", "admin"],
    "delete_data": ["admin"],
}

def check_permission(tool_name: str, user_role: str) -> bool:
    allowed_roles = PERMISSIONS.get(tool_name, [])
    return user_role in allowed_roles`}
              </pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">2. Input Validation</h2>
            <p>Never trust AI-provided input. Validate everything:</p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`import re
from typing import Optional

def validate_email(email: str) -> Optional[str]:
    """Validate email format."""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
    if not re.match(pattern, email):
        return None
    return email

def validate_path(path: str) -> Optional[str]:
    """Prevent path traversal attacks."""
    # Reject path traversal attempts
    if ".." in path or path.startswith("/"):
        return None
    # Only allow alphanumeric, dash, underscore, forward slash
    if not re.match(r'^[\\w\\-/]+$', path):
        return None
    return path

@server.tool("read_file")
async def read_file(filename: str) -> str:
    safe_path = validate_path(filename)
    if not safe_path:
        return "Error: Invalid filename"
    
    # Safe to proceed
    full_path = f"/app/data/{safe_path}"
    # ... read file`}
              </pre>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-3">SQL Injection Prevention</h3>
            <p>If your MCP server touches a database:</p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`# WRONG - SQL injection vulnerability
@server.tool("search_users")
async def search_users_bad(query: str) -> str:
    cursor.execute(f"SELECT * FROM users WHERE name = '{query}'")
    # Attacker can inject: ' OR '1'='1

# RIGHT - Parameterized query
@server.tool("search_users")
async def search_users(query: str) -> str:
    cursor.execute("SELECT * FROM users WHERE name = ?", (query,))`}
              </pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">3. Secrets Management</h2>
            <p><strong>Never hardcode secrets.</strong> Use environment variables or a secrets manager:</p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`# WRONG
API_KEY = "sk-abc123..."

# RIGHT
import os
API_KEY = os.environ.get("OPENAI_API_KEY")
if not API_KEY:
    raise RuntimeError("OPENAI_API_KEY not set")`}
              </pre>
            </div>

            <p>For production, use proper secrets management:</p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`# AWS Secrets Manager example
import boto3
import json

def get_secret(secret_name: str) -> dict:
    client = boto3.client("secretsmanager")
    response = client.get_secret_value(SecretId=secret_name)
    return json.loads(response["SecretString"])

secrets = get_secret("prod/mcp-server")
API_KEY = secrets["api_key"]`}
              </pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">4. Rate Limiting</h2>
            <p>Prevent abuse with rate limiting:</p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`from collections import defaultdict
from time import time

class RateLimiter:
    def __init__(self, calls_per_minute: int = 60):
        self.calls_per_minute = calls_per_minute
        self.calls = defaultdict(list)
    
    def check(self, client_id: str) -> bool:
        now = time()
        minute_ago = now - 60
        
        # Remove old calls
        self.calls[client_id] = [
            t for t in self.calls[client_id] if t > minute_ago
        ]
        
        if len(self.calls[client_id]) >= self.calls_per_minute:
            return False
        
        self.calls[client_id].append(now)
        return True

limiter = RateLimiter(calls_per_minute=30)

@server.tool("api_call")
async def api_call(client_id: str, request: str) -> str:
    if not limiter.check(client_id):
        return "Error: Rate limit exceeded. Try again later."
    # Process request...`}
              </pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">5. Audit Logging</h2>
            <p>Log all sensitive operations:</p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`import logging
from datetime import datetime

# Configure audit logger
audit_logger = logging.getLogger("audit")
audit_logger.setLevel(logging.INFO)
handler = logging.FileHandler("/var/log/mcp-audit.log")
handler.setFormatter(logging.Formatter(
    '%(asctime)s - %(levelname)s - %(message)s'
))
audit_logger.addHandler(handler)

@server.tool("sensitive_action")
async def sensitive_action(client_id: str, action: str, target: str) -> str:
    # Log before action
    audit_logger.info(f"client={client_id} action={action} target={target}")
    
    try:
        result = perform_action(action, target)
        audit_logger.info(f"client={client_id} action={action} status=success")
        return result
    except Exception as e:
        audit_logger.error(f"client={client_id} action={action} status=failed error={e}")
        return f"Error: {e}"`}
              </pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">6. Error Messages</h2>
            <p>Don't leak sensitive info in errors:</p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`# WRONG - leaks system info
except Exception as e:
    return f"Database error: {e}"  # Might expose connection strings, paths

# RIGHT - generic error, log details internally
except Exception as e:
    logging.error(f"Database error: {e}")  # Internal log
    return "Error: Unable to complete request. Please try again."`}
              </pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Security Checklist</h2>
            <p>Before deploying your MCP server:</p>

            <ul className="list-disc list-inside space-y-2 text-gray-300 my-4">
              <li>All secrets loaded from environment/secrets manager</li>
              <li>Input validation on all tool parameters</li>
              <li>Authentication required for sensitive operations</li>
              <li>Rate limiting enabled</li>
              <li>Audit logging for sensitive actions</li>
              <li>Error messages don't leak system information</li>
              <li>SQL queries use parameterized statements</li>
              <li>File paths validated to prevent traversal</li>
              <li>HTTPS enabled for network transport</li>
            </ul>

            <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-6 my-8">
              <h3 className="font-semibold mb-2">📚 Related Tutorials</h3>
              <ul className="space-y-2 text-gray-300">
                <li>→ <Link href="/mcp/mcp-error-handling" className="text-blue-400 hover:underline">MCP Error Handling Best Practices</Link></li>
                <li>→ <Link href="/mcp/testing-mcp-servers" className="text-blue-400 hover:underline">Testing MCP Servers</Link></li>
                <li>→ <Link href="/mcp/mcp-docker-deployment" className="text-blue-400 hover:underline">MCP Docker Deployment</Link></li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Summary</h2>
            <p>
              Securing MCP servers requires defense in depth. Validate all inputs, protect 
              credentials, log operations, and never expose internal details in error messages.
            </p>

            <p>
              Build security into your servers from the start — it's much harder to add later.
            </p>

            <p className="text-gray-400 mt-8">
              Questions? Reach out on <a href="https://x.com/kaigritun" className="text-blue-400 hover:underline">Twitter</a> or 
              email <a href="mailto:kai@kaigritun.com" className="text-blue-400 hover:underline">kai@kaigritun.com</a>.
            </p>
          </div>
        </div>
      </article>

      <EmailSignup />

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Kai Gritun · <Link href="https://x.com/kaigritun" className="hover:text-white">@kaigritun</Link></p>
      </footer>
    </div>
  );
}
