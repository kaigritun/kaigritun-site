import { Metadata } from 'next'
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: 'MCP Authentication Guide: Secure Your MCP Servers | Kai Gritun',
  description: 'Learn how to add authentication to MCP servers. Covers API keys, OAuth tokens, environment variables, and security best practices for production MCP deployments.',
  keywords: ['MCP authentication', 'MCP security', 'MCP API keys', 'secure MCP server', 'MCP OAuth', 'MCP credentials'],
  openGraph: {
    title: 'MCP Authentication Guide: Secure Your MCP Servers',
    description: 'Learn how to add authentication to MCP servers. API keys, OAuth tokens, environment variables, and security best practices.',
    type: 'article',
  },
}

export default function MCPAuthenticationGuide() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <article className="max-w-4xl mx-auto px-6 py-16">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
            <a href="/mcp" className="hover:text-zinc-300">MCP Tutorials</a>
            <span>/</span>
            <span>Authentication</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            MCP Authentication Guide
          </h1>
          <p className="text-xl text-zinc-400">
            Secure your MCP servers with API keys, OAuth tokens, and environment-based credentials.
          </p>
          <div className="flex items-center gap-4 mt-6 text-sm text-zinc-500">
            <span>~12 min read</span>
            <span>•</span>
            <span>Intermediate</span>
            <span>•</span>
            <span>Security</span>
          </div>
        </header>

        <div className="prose prose-invert prose-zinc max-w-none">
          <p className="text-lg text-zinc-300">
            MCP servers often need to connect to external APIs and services that require authentication. 
            This guide covers multiple authentication strategies, from simple API keys to OAuth tokens, 
            with security best practices for production deployments.
          </p>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold mt-0">What You&apos;ll Learn</h3>
            <ul className="mb-0">
              <li>Environment variable-based authentication</li>
              <li>API key management and rotation</li>
              <li>OAuth token handling</li>
              <li>Secrets management best practices</li>
              <li>Multi-environment configurations</li>
            </ul>
          </div>

          <h2 id="env-variables">Environment Variables: The Foundation</h2>
          
          <p>
            The most common and recommended way to handle credentials in MCP servers is through 
            environment variables. Claude Desktop and other clients support passing environment 
            variables to MCP server processes.
          </p>

          <h3>Basic Environment Variable Usage</h3>

          <p>Here&apos;s a Python MCP server that uses environment variables for authentication:</p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`# server.py
import os
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("authenticated-server")

# Read credentials from environment
API_KEY = os.environ.get("MY_SERVICE_API_KEY")
if not API_KEY:
    raise ValueError("MY_SERVICE_API_KEY environment variable required")

@mcp.tool()
def fetch_data(query: str) -> str:
    """Fetch data from authenticated API."""
    import httpx
    
    response = httpx.get(
        "https://api.example.com/data",
        params={"q": query},
        headers={"Authorization": f"Bearer {API_KEY}"}
    )
    return response.json()

if __name__ == "__main__":
    mcp.run()`}</code>
          </pre>

          <h3>Claude Desktop Configuration</h3>

          <p>
            Configure Claude Desktop to pass environment variables to your server:
          </p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`{
  "mcpServers": {
    "my-authenticated-server": {
      "command": "python",
      "args": ["/path/to/server.py"],
      "env": {
        "MY_SERVICE_API_KEY": "sk-your-api-key-here"
      }
    }
  }
}`}</code>
          </pre>

          <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4 my-6">
            <p className="font-semibold text-yellow-200">⚠️ Security Note</p>
            <p className="text-yellow-100 mb-0">
              Storing API keys directly in config files is convenient for development but not ideal 
              for production. We&apos;ll cover better approaches below.
            </p>
          </div>

          <h2 id="multiple-credentials">Managing Multiple Credentials</h2>

          <p>
            Real-world MCP servers often need to interact with multiple services. Here&apos;s a 
            pattern for managing multiple credentials cleanly:
          </p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`# config.py
import os
from dataclasses import dataclass

@dataclass
class Credentials:
    github_token: str
    openai_key: str
    database_url: str
    
    @classmethod
    def from_env(cls) -> "Credentials":
        """Load credentials from environment variables."""
        missing = []
        
        github_token = os.environ.get("GITHUB_TOKEN")
        if not github_token:
            missing.append("GITHUB_TOKEN")
            
        openai_key = os.environ.get("OPENAI_API_KEY")
        if not openai_key:
            missing.append("OPENAI_API_KEY")
            
        database_url = os.environ.get("DATABASE_URL")
        if not database_url:
            missing.append("DATABASE_URL")
            
        if missing:
            raise ValueError(f"Missing required environment variables: {', '.join(missing)}")
            
        return cls(
            github_token=github_token,
            openai_key=openai_key,
            database_url=database_url
        )

# server.py
from mcp.server.fastmcp import FastMCP
from config import Credentials

mcp = FastMCP("multi-auth-server")
creds = Credentials.from_env()

@mcp.tool()
def github_search(query: str) -> str:
    """Search GitHub repositories."""
    import httpx
    response = httpx.get(
        "https://api.github.com/search/repositories",
        params={"q": query},
        headers={"Authorization": f"token {creds.github_token}"}
    )
    return response.json()

@mcp.tool()
def ai_summarize(text: str) -> str:
    """Summarize text using OpenAI."""
    import httpx
    response = httpx.post(
        "https://api.openai.com/v1/chat/completions",
        headers={"Authorization": f"Bearer {creds.openai_key}"},
        json={
            "model": "gpt-4o-mini",
            "messages": [{"role": "user", "content": f"Summarize: {text}"}]
        }
    )
    return response.json()["choices"][0]["message"]["content"]`}</code>
          </pre>

          <h2 id="oauth">OAuth Token Handling</h2>

          <p>
            For services that require OAuth (like Google APIs, Slack, etc.), you&apos;ll typically 
            need to handle token refresh. Here&apos;s a pattern for that:
          </p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`# oauth_handler.py
import os
import json
import time
from pathlib import Path
import httpx

class OAuthTokenManager:
    """Manage OAuth tokens with automatic refresh."""
    
    def __init__(
        self,
        client_id: str,
        client_secret: str,
        token_url: str,
        token_file: Path
    ):
        self.client_id = client_id
        self.client_secret = client_secret
        self.token_url = token_url
        self.token_file = token_file
        self._token_data = None
        self._load_token()
    
    def _load_token(self):
        """Load token from file if it exists."""
        if self.token_file.exists():
            self._token_data = json.loads(self.token_file.read_text())
    
    def _save_token(self):
        """Save token to file."""
        self.token_file.parent.mkdir(parents=True, exist_ok=True)
        self.token_file.write_text(json.dumps(self._token_data))
    
    def _refresh_token(self):
        """Refresh the access token using refresh token."""
        if not self._token_data or "refresh_token" not in self._token_data:
            raise ValueError("No refresh token available. Re-authorize required.")
        
        response = httpx.post(
            self.token_url,
            data={
                "grant_type": "refresh_token",
                "refresh_token": self._token_data["refresh_token"],
                "client_id": self.client_id,
                "client_secret": self.client_secret,
            }
        )
        response.raise_for_status()
        
        new_data = response.json()
        self._token_data["access_token"] = new_data["access_token"]
        self._token_data["expires_at"] = time.time() + new_data.get("expires_in", 3600)
        
        if "refresh_token" in new_data:
            self._token_data["refresh_token"] = new_data["refresh_token"]
        
        self._save_token()
    
    def get_access_token(self) -> str:
        """Get a valid access token, refreshing if necessary."""
        if not self._token_data:
            raise ValueError("No token available. Authorization required.")
        
        # Refresh if expired or expiring soon (within 5 minutes)
        expires_at = self._token_data.get("expires_at", 0)
        if time.time() > expires_at - 300:
            self._refresh_token()
        
        return self._token_data["access_token"]

# Usage in MCP server
from mcp.server.fastmcp import FastMCP
from oauth_handler import OAuthTokenManager
from pathlib import Path

mcp = FastMCP("google-drive-server")

token_manager = OAuthTokenManager(
    client_id=os.environ["GOOGLE_CLIENT_ID"],
    client_secret=os.environ["GOOGLE_CLIENT_SECRET"],
    token_url="https://oauth2.googleapis.com/token",
    token_file=Path.home() / ".config" / "mcp" / "google_token.json"
)

@mcp.tool()
def list_drive_files(folder_id: str = "root") -> str:
    """List files in Google Drive folder."""
    import httpx
    
    token = token_manager.get_access_token()
    response = httpx.get(
        "https://www.googleapis.com/drive/v3/files",
        params={"q": f"'{folder_id}' in parents"},
        headers={"Authorization": f"Bearer {token}"}
    )
    return response.json()`}</code>
          </pre>

          <h2 id="secrets-managers">Using Secrets Managers</h2>

          <p>
            For production deployments, consider using a secrets manager instead of plain 
            environment variables. Here are examples for popular options:
          </p>

          <h3>1Password CLI Integration</h3>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`# Claude Desktop config using 1Password
{
  "mcpServers": {
    "secure-server": {
      "command": "op",
      "args": [
        "run",
        "--",
        "python",
        "/path/to/server.py"
      ],
      "env": {
        "MY_API_KEY": "op://vault/item/field"
      }
    }
  }
}

# The 'op run' command automatically injects secrets
# from 1Password references like op://vault/item/field`}</code>
          </pre>

          <h3>AWS Secrets Manager</h3>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`# secrets_loader.py
import boto3
import json
from functools import lru_cache

@lru_cache(maxsize=1)
def get_secrets(secret_name: str, region: str = "us-east-1") -> dict:
    """Load secrets from AWS Secrets Manager."""
    client = boto3.client("secretsmanager", region_name=region)
    response = client.get_secret_value(SecretId=secret_name)
    return json.loads(response["SecretString"])

# Usage in server
from mcp.server.fastmcp import FastMCP
from secrets_loader import get_secrets

mcp = FastMCP("aws-secrets-server")
secrets = get_secrets("my-mcp-server-secrets")

@mcp.tool()
def secure_operation() -> str:
    """Perform operation using secrets from AWS."""
    api_key = secrets["api_key"]
    # Use the secret...
    return "Done"`}</code>
          </pre>

          <h3>HashiCorp Vault</h3>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`# vault_loader.py
import hvac
import os

def get_vault_secrets(path: str) -> dict:
    """Load secrets from HashiCorp Vault."""
    client = hvac.Client(
        url=os.environ.get("VAULT_ADDR", "http://localhost:8200"),
        token=os.environ.get("VAULT_TOKEN")
    )
    
    response = client.secrets.kv.v2.read_secret_version(path=path)
    return response["data"]["data"]

# Usage
secrets = get_vault_secrets("mcp/my-server")
api_key = secrets["api_key"]`}</code>
          </pre>

          <h2 id="multi-environment">Multi-Environment Configuration</h2>

          <p>
            Handle different credentials for development, staging, and production:
          </p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`# config.py
import os
from dataclasses import dataclass
from typing import Literal

Environment = Literal["development", "staging", "production"]

@dataclass
class Config:
    environment: Environment
    api_key: str
    api_base_url: str
    debug: bool
    
    @classmethod
    def load(cls) -> "Config":
        env = os.environ.get("MCP_ENV", "development")
        
        if env == "production":
            return cls(
                environment="production",
                api_key=os.environ["PROD_API_KEY"],
                api_base_url="https://api.example.com",
                debug=False
            )
        elif env == "staging":
            return cls(
                environment="staging",
                api_key=os.environ["STAGING_API_KEY"],
                api_base_url="https://staging-api.example.com",
                debug=True
            )
        else:
            return cls(
                environment="development",
                api_key=os.environ.get("DEV_API_KEY", "dev-key-for-testing"),
                api_base_url="http://localhost:8000",
                debug=True
            )

# server.py
from mcp.server.fastmcp import FastMCP
from config import Config

config = Config.load()
mcp = FastMCP(f"my-server-{config.environment}")

@mcp.tool()
def get_environment() -> str:
    """Check which environment the server is running in."""
    return f"Running in {config.environment} mode"`}</code>
          </pre>

          <h2 id="security-best-practices">Security Best Practices</h2>

          <div className="space-y-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <h3 className="font-semibold text-green-400 mt-0">✓ Do</h3>
              <ul className="mb-0">
                <li>Use environment variables or secrets managers for credentials</li>
                <li>Implement least-privilege access (only request scopes you need)</li>
                <li>Rotate credentials regularly</li>
                <li>Use short-lived tokens when possible (OAuth)</li>
                <li>Log authentication failures (without logging the credentials)</li>
                <li>Validate all input before using in API calls</li>
              </ul>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <h3 className="font-semibold text-red-400 mt-0">✗ Don&apos;t</h3>
              <ul className="mb-0">
                <li>Hardcode credentials in source code</li>
                <li>Commit config files with real credentials to git</li>
                <li>Log credentials or tokens (even in debug mode)</li>
                <li>Share credentials between environments</li>
                <li>Use overly permissive API scopes</li>
                <li>Store credentials in plain text files</li>
              </ul>
            </div>
          </div>

          <h3>Credential Validation Pattern</h3>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`# validation.py
import os
import sys

def validate_credentials():
    """Validate all required credentials at startup."""
    required = {
        "GITHUB_TOKEN": "GitHub Personal Access Token",
        "OPENAI_API_KEY": "OpenAI API Key",
    }
    
    optional = {
        "SLACK_BOT_TOKEN": "Slack Bot Token (for notifications)",
    }
    
    missing = []
    for var, description in required.items():
        if not os.environ.get(var):
            missing.append(f"  - {var}: {description}")
    
    if missing:
        print("❌ Missing required credentials:", file=sys.stderr)
        print("\\n".join(missing), file=sys.stderr)
        print("\\nPlease set these environment variables.", file=sys.stderr)
        sys.exit(1)
    
    # Warn about optional missing credentials
    for var, description in optional.items():
        if not os.environ.get(var):
            print(f"⚠️  Optional: {var} not set ({description})", file=sys.stderr)
    
    print("✅ All required credentials validated")

# Call at server startup
if __name__ == "__main__":
    validate_credentials()
    
    from mcp.server.fastmcp import FastMCP
    mcp = FastMCP("validated-server")
    # ... rest of server
    mcp.run()`}</code>
          </pre>

          <h2 id="typescript-auth">TypeScript Authentication</h2>

          <p>
            The same patterns work in TypeScript with the official MCP SDK:
          </p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`// config.ts
import { z } from 'zod';

const ConfigSchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
  apiSecret: z.string().optional(),
  environment: z.enum(['development', 'staging', 'production']).default('development'),
});

export type Config = z.infer<typeof ConfigSchema>;

export function loadConfig(): Config {
  const result = ConfigSchema.safeParse({
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
    environment: process.env.NODE_ENV,
  });
  
  if (!result.success) {
    console.error('Configuration error:', result.error.format());
    process.exit(1);
  }
  
  return result.data;
}

// server.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';

const config = loadConfig();
const server = new McpServer({ name: 'authenticated-ts-server', version: '1.0.0' });

server.tool(
  'secure_fetch',
  { url: z.string().url() },
  async ({ url }) => {
    const response = await fetch(url, {
      headers: { 'Authorization': \`Bearer \${config.apiKey}\` }
    });
    return { content: [{ type: 'text', text: await response.text() }] };
  }
);

const transport = new StdioServerTransport();
server.connect(transport);`}</code>
          </pre>

          <h2 id="conclusion">Summary</h2>

          <p>
            Authentication in MCP servers follows the same best practices as any backend service:
          </p>

          <ol>
            <li><strong>Use environment variables</strong> as the foundation</li>
            <li><strong>Validate credentials at startup</strong> to fail fast</li>
            <li><strong>Consider secrets managers</strong> for production (1Password, AWS, Vault)</li>
            <li><strong>Handle OAuth properly</strong> with token refresh</li>
            <li><strong>Separate environments</strong> with different credentials</li>
            <li><strong>Never log or commit</strong> actual credentials</li>
          </ol>

          <p>
            The key insight: Claude Desktop (and other MCP clients) can pass environment variables 
            to your server process. Build your authentication around that capability, and you can 
            keep credentials secure while maintaining easy local development.
          </p>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold mt-0">Next Steps</h3>
            <ul className="mb-0">
              <li><a href="/mcp/how-to-build-mcp-server-python" className="text-blue-400 hover:text-blue-300">Build your first MCP server in Python</a></li>
              <li><a href="/mcp/how-to-build-mcp-server-typescript" className="text-blue-400 hover:text-blue-300">Build your first MCP server in TypeScript</a></li>
              <li><a href="/mcp/troubleshooting-mcp-servers" className="text-blue-400 hover:text-blue-300">Troubleshooting MCP issues</a></li>
              <li><a href="/mcp/best-mcp-servers-2025" className="text-blue-400 hover:text-blue-300">Explore top MCP servers for reference</a></li>
            </ul>
          </div>
        </div>
        <EmailSignup />


        <footer className="mt-16 pt-8 border-t border-zinc-800">
          <a href="/mcp" className="text-blue-400 hover:text-blue-300">
            ← Back to MCP Tutorials
          </a>
        </footer>
      </article>
    </main>
  )
}
