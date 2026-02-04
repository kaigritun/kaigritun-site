import Link from "next/link";
import type { Metadata } from "next";
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: "MCP Security Best Practices (2026 Guide) | Kai Gritun",
  description: "Essential security practices for MCP server development. Input validation, rate limiting, secrets management, and audit logging for AI tool integrations.",
  keywords: ["MCP security", "MCP server security", "Model Context Protocol security", "AI security", "LLM security", "MCP best practices"],
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
              MCP servers have direct access to AI models and often to sensitive systems. 
              Security isn't optional—it's fundamental.
            </p>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>February 4, 2026</span>
              <span>·</span>
              <span>12 min read</span>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <h2 className="text-2xl font-bold mt-12 mb-4">The MCP Threat Model</h2>
            <p>MCP servers face unique risks:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li><strong>Prompt injection</strong> - Malicious prompts trying to manipulate tool calls</li>
              <li><strong>Data exfiltration</strong> - Tools being tricked into leaking sensitive data</li>
              <li><strong>Privilege escalation</strong> - Gaining access beyond intended permissions</li>
              <li><strong>Resource exhaustion</strong> - DOS through expensive operations</li>
            </ul>
            <p>Understanding these helps you build defenses.</p>

            <h2 className="text-2xl font-bold mt-12 mb-4">Input Validation</h2>
            <p>Never trust tool inputs. Ever.</p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`from pydantic import BaseModel, validator, constr
import re

class FileReadInput(BaseModel):
    path: constr(max_length=500)
    
    @validator('path')
    def validate_path(cls, v):
        # Prevent path traversal
        if '..' in v:
            raise ValueError('Path traversal not allowed')
        
        # Whitelist allowed directories
        allowed_prefixes = ['/home/user/documents/', '/tmp/mcp/']
        if not any(v.startswith(p) for p in allowed_prefixes):
            raise ValueError('Path not in allowed directories')
        
        # Block sensitive files
        blocked = ['.env', 'secrets', 'credentials', '.ssh']
        if any(b in v.lower() for b in blocked):
            raise ValueError('Access to sensitive files blocked')
        
        return v`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">Principle of Least Privilege</h2>
            <p>Tools should have minimal permissions:</p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`import os
from pathlib import Path

class SecureFileServer:
    def __init__(self, sandbox_dir: str):
        self.sandbox = Path(sandbox_dir).resolve()
        # Ensure sandbox exists and has restricted permissions
        self.sandbox.mkdir(mode=0o700, exist_ok=True)
    
    def read_file(self, path: str) -> str:
        full_path = (self.sandbox / path).resolve()
        
        # Verify path stays within sandbox
        if not str(full_path).startswith(str(self.sandbox)):
            raise PermissionError("Access denied: path escape attempt")
        
        return full_path.read_text()
    
    def list_files(self) -> list[str]:
        # Only return files, not directory structure
        return [f.name for f in self.sandbox.iterdir() if f.is_file()]`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">Rate Limiting</h2>
            <p>Prevent resource exhaustion:</p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`import time
from collections import defaultdict
from functools import wraps

class RateLimiter:
    def __init__(self, calls_per_minute: int = 60):
        self.limit = calls_per_minute
        self.calls = defaultdict(list)
    
    def check(self, tool_name: str) -> bool:
        now = time.time()
        minute_ago = now - 60
        
        # Clean old entries
        self.calls[tool_name] = [
            t for t in self.calls[tool_name] if t > minute_ago
        ]
        
        if len(self.calls[tool_name]) >= self.limit:
            return False
        
        self.calls[tool_name].append(now)
        return True

rate_limiter = RateLimiter(calls_per_minute=30)

def rate_limited(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if not rate_limiter.check(func.__name__):
            raise Exception("Rate limit exceeded. Try again later.")
        return func(*args, **kwargs)
    return wrapper`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">Secrets Management</h2>
            <p>Never hardcode secrets:</p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`import os
from functools import lru_cache

@lru_cache()
def get_secret(name: str) -> str:
    """Load secrets from environment variables only."""
    value = os.environ.get(name)
    if value is None:
        raise ValueError(f"Required secret {name} not configured")
    return value

# Usage in tool
def call_api():
    api_key = get_secret("API_KEY")  # Not hardcoded
    # ... use api_key`}</code>
            </pre>

            <p>For production, use proper secret managers:</p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`# AWS Secrets Manager example
import boto3
import json

def get_secret_aws(secret_name: str) -> dict:
    client = boto3.client('secretsmanager')
    response = client.get_secret_value(SecretId=secret_name)
    return json.loads(response['SecretString'])`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">Audit Logging</h2>
            <p>Log all tool invocations:</p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`import logging
import json
from datetime import datetime
from typing import Any

# Configure secure logging
logging.basicConfig(
    filename='/var/log/mcp/audit.log',
    format='%(message)s',
    level=logging.INFO
)
audit_logger = logging.getLogger('mcp.audit')

def audit_log(tool_name: str, inputs: dict, result: Any, error: str = None):
    """Log tool invocations for security audit."""
    entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "tool": tool_name,
        "inputs": sanitize_for_log(inputs),
        "success": error is None,
        "error": error,
    }
    audit_logger.info(json.dumps(entry))

def sanitize_for_log(data: dict) -> dict:
    """Remove sensitive fields before logging."""
    sensitive_keys = ['password', 'token', 'key', 'secret', 'credential']
    return {
        k: '[REDACTED]' if any(s in k.lower() for s in sensitive_keys) else v
        for k, v in data.items()
    }`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">Sandboxing External Commands</h2>
            <p>If you must run shell commands:</p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`import subprocess
import shlex

ALLOWED_COMMANDS = {'ls', 'cat', 'grep', 'wc'}

def run_safe_command(command: str, args: list[str]) -> str:
    # Whitelist commands
    if command not in ALLOWED_COMMANDS:
        raise PermissionError(f"Command '{command}' not allowed")
    
    # Sanitize arguments
    safe_args = [shlex.quote(arg) for arg in args]
    
    # Run with restrictions
    result = subprocess.run(
        [command] + safe_args,
        capture_output=True,
        text=True,
        timeout=30,  # Prevent hanging
        cwd='/tmp/sandbox',  # Restrict working directory
        env={},  # Clean environment
    )
    
    if result.returncode != 0:
        raise RuntimeError(f"Command failed: {result.stderr}")
    
    return result.stdout[:10000]  # Limit output size`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">Network Security</h2>
            <p>Control outbound connections:</p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`from urllib.parse import urlparse

ALLOWED_DOMAINS = {'api.github.com', 'api.openai.com'}

def validate_url(url: str) -> str:
    parsed = urlparse(url)
    
    # HTTPS only
    if parsed.scheme != 'https':
        raise ValueError("Only HTTPS URLs allowed")
    
    # Domain whitelist
    if parsed.netloc not in ALLOWED_DOMAINS:
        raise ValueError(f"Domain {parsed.netloc} not in allowlist")
    
    # Block internal IPs
    import socket
    ip = socket.gethostbyname(parsed.netloc)
    if ip.startswith(('10.', '172.', '192.168.', '127.')):
        raise ValueError("Internal network access blocked")
    
    return url`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">Security Checklist</h2>
            <p>Before deploying any MCP server:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>All inputs validated with strict schemas</li>
              <li>Path traversal attacks blocked</li>
              <li>Sensitive files/directories blocked</li>
              <li>Rate limiting implemented</li>
              <li>Secrets loaded from environment/secret manager</li>
              <li>Audit logging enabled</li>
              <li>Outbound network calls restricted</li>
              <li>Shell commands sandboxed (or disabled)</li>
              <li>Resource limits set (timeouts, max sizes)</li>
              <li>Error messages don't leak sensitive info</li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-4">Conclusion</h2>
            <p>
              Security in MCP isn't about paranoia—it's about responsibility. These servers interact 
              with powerful AI models that can be manipulated. Build with defense in depth, validate 
              everything, and log for accountability.
            </p>
            <p>
              Your users trust you with their AI assistant's capabilities. Earn that trust.
            </p>
          </div>

          {/* Email Signup */}
          <div className="mt-16 p-8 bg-gray-900 rounded-xl border border-gray-800">
            <h3 className="text-xl font-bold mb-4">Get MCP Tips & Tutorials</h3>
            <p className="text-gray-400 mb-6">
              Join developers building AI-powered tools. Get tutorials, code examples, and updates.
            </p>
            <EmailSignup site="mcp" />
          </div>

          {/* Related */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <h3 className="text-lg font-semibold mb-4">Related Tutorials</h3>
            <div className="grid gap-4">
              <Link href="/mcp/mcp-typescript-tutorial" className="p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
                <span className="text-blue-400">How to Build an MCP Server with TypeScript</span>
                <p className="text-sm text-gray-500 mt-1">Type-safe MCP server development</p>
              </Link>
              <Link href="/mcp/mcp-database-integration" className="p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
                <span className="text-blue-400">MCP Database Integration</span>
                <p className="text-sm text-gray-500 mt-1">Connect AI to databases securely</p>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
