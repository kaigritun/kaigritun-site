import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Multi-Tenant MCP Architecture | MCP Tutorials',
  description: 'Learn how to build multi-tenant MCP servers that securely serve multiple users or organizations. Covers tenant isolation, authentication, rate limiting, and deployment patterns.',
  keywords: ['MCP multi-tenant', 'MCP SaaS', 'MCP architecture', 'tenant isolation MCP', 'MCP API platform'],
  openGraph: {
    title: 'Multi-Tenant MCP Architecture',
    description: 'Build secure multi-tenant MCP servers for SaaS applications.',
    type: 'article',
    publishedTime: '2025-02-03T14:00:00.000Z',
  },
}

export default function MultiTenantMCPArchitecture() {
  return (
    <main className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto">
        <header className="mb-12">
          <a href="/mcp" className="text-purple-400 hover:text-purple-300 mb-4 inline-block">
            ← Back to MCP Tutorials
          </a>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Multi-Tenant MCP Architecture
          </h1>
          <p className="text-xl text-gray-300 mb-4">
            Build secure MCP servers that serve multiple users or organizations with proper isolation, authentication, and rate limiting.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>February 2025</span>
            <span>•</span>
            <span>20 min read</span>
            <span>•</span>
            <span className="text-purple-400">Advanced</span>
          </div>
        </header>

        <div className="prose prose-invert prose-purple max-w-none">
          
          <p className="text-lg text-gray-300 leading-relaxed">
            As MCP adoption grows, you'll likely want to build servers that can handle multiple users or organizations. 
            This guide covers patterns for building production-ready multi-tenant MCP servers that maintain security, 
            performance, and data isolation between tenants.
          </p>

          <div className="bg-gray-800 rounded-lg p-6 my-8 border border-gray-700">
            <h3 className="text-white text-lg font-semibold mt-0 mb-4">What You'll Learn</h3>
            <ul className="text-gray-300 space-y-2 mb-0">
              <li>Tenant identification and authentication patterns</li>
              <li>Data isolation strategies (database per tenant vs shared)</li>
              <li>Rate limiting and quotas per tenant</li>
              <li>Request context and middleware patterns</li>
              <li>Deployment architectures for scale</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">Understanding Multi-Tenancy in MCP</h2>

          <p className="text-gray-300">
            Multi-tenancy means a single MCP server instance serves multiple independent users (tenants). 
            Each tenant should feel like they have their own dedicated server while you benefit from 
            shared infrastructure.
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Key Challenges</h3>

          <ul className="text-gray-300 space-y-2">
            <li><strong className="text-white">Data Isolation</strong> — Tenant A must never see Tenant B's data</li>
            <li><strong className="text-white">Authentication</strong> — Verify who's making requests</li>
            <li><strong className="text-white">Resource Limits</strong> — Prevent one tenant from impacting others</li>
            <li><strong className="text-white">Configuration</strong> — Different tenants may have different settings</li>
            <li><strong className="text-white">Billing</strong> — Track usage per tenant for monetization</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">Tenant Identification Patterns</h2>

          <p className="text-gray-300">
            The first challenge is identifying which tenant is making a request. Here are common patterns:
          </p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Pattern 1: API Key Authentication</h3>

          <pre className="bg-gray-950 rounded-lg p-4 overflow-x-auto">
            <code className="text-sm text-gray-300">{`# tenant_auth.py
from dataclasses import dataclass
from typing import Optional
import hashlib
import secrets
import sqlite3

@dataclass
class Tenant:
    id: str
    name: str
    api_key_hash: str
    tier: str  # 'free', 'pro', 'enterprise'
    rate_limit: int
    created_at: str

class TenantAuth:
    def __init__(self, db_path: str = "tenants.db"):
        self.conn = sqlite3.connect(db_path, check_same_thread=False)
        self._init_db()
    
    def _init_db(self):
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS tenants (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                api_key_hash TEXT UNIQUE NOT NULL,
                tier TEXT DEFAULT 'free',
                rate_limit INTEGER DEFAULT 100,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        self.conn.commit()
    
    def create_tenant(self, name: str, tier: str = 'free') -> tuple[str, str]:
        """Create a tenant and return (tenant_id, api_key)"""
        tenant_id = secrets.token_hex(8)
        api_key = f"mcp_{secrets.token_hex(24)}"
        api_key_hash = hashlib.sha256(api_key.encode()).hexdigest()
        
        rate_limits = {'free': 100, 'pro': 1000, 'enterprise': 10000}
        
        self.conn.execute(
            "INSERT INTO tenants (id, name, api_key_hash, tier, rate_limit) VALUES (?, ?, ?, ?, ?)",
            (tenant_id, name, api_key_hash, tier, rate_limits.get(tier, 100))
        )
        self.conn.commit()
        
        return tenant_id, api_key
    
    def authenticate(self, api_key: str) -> Optional[Tenant]:
        """Authenticate and return tenant, or None if invalid"""
        api_key_hash = hashlib.sha256(api_key.encode()).hexdigest()
        
        cursor = self.conn.execute(
            "SELECT id, name, api_key_hash, tier, rate_limit, created_at FROM tenants WHERE api_key_hash = ?",
            (api_key_hash,)
        )
        row = cursor.fetchone()
        
        if row:
            return Tenant(*row)
        return None`}</code>
          </pre>

          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Pattern 2: JWT/OAuth Token</h3>

          <pre className="bg-gray-950 rounded-lg p-4 overflow-x-auto">
            <code className="text-sm text-gray-300">{`# jwt_auth.py
import jwt
from dataclasses import dataclass
from typing import Optional
from datetime import datetime, timedelta

@dataclass
class TokenPayload:
    tenant_id: str
    user_id: str
    scopes: list[str]
    exp: datetime

class JWTAuth:
    def __init__(self, secret: str, algorithm: str = "HS256"):
        self.secret = secret
        self.algorithm = algorithm
    
    def create_token(
        self, 
        tenant_id: str, 
        user_id: str, 
        scopes: list[str],
        expires_in: timedelta = timedelta(hours=24)
    ) -> str:
        payload = {
            "tenant_id": tenant_id,
            "user_id": user_id,
            "scopes": scopes,
            "exp": datetime.utcnow() + expires_in,
            "iat": datetime.utcnow()
        }
        return jwt.encode(payload, self.secret, algorithm=self.algorithm)
    
    def verify_token(self, token: str) -> Optional[TokenPayload]:
        try:
            payload = jwt.decode(token, self.secret, algorithms=[self.algorithm])
            return TokenPayload(
                tenant_id=payload["tenant_id"],
                user_id=payload["user_id"],
                scopes=payload["scopes"],
                exp=datetime.fromtimestamp(payload["exp"])
            )
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
    
    def has_scope(self, token_payload: TokenPayload, required_scope: str) -> bool:
        return required_scope in token_payload.scopes or "admin" in token_payload.scopes`}</code>
          </pre>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">Request Context Pattern</h2>

          <p className="text-gray-300">
            Use a context object to carry tenant information through your MCP server. This pattern keeps 
            your tool implementations clean while maintaining tenant awareness.
          </p>

          <pre className="bg-gray-950 rounded-lg p-4 overflow-x-auto">
            <code className="text-sm text-gray-300">{`# context.py
from contextvars import ContextVar
from dataclasses import dataclass
from typing import Optional, Any

@dataclass
class RequestContext:
    tenant_id: str
    user_id: Optional[str] = None
    scopes: list[str] = None
    metadata: dict[str, Any] = None
    
    def __post_init__(self):
        if self.scopes is None:
            self.scopes = []
        if self.metadata is None:
            self.metadata = {}

# Thread-safe context variable
_request_context: ContextVar[Optional[RequestContext]] = ContextVar(
    'request_context', 
    default=None
)

def set_context(ctx: RequestContext):
    _request_context.set(ctx)

def get_context() -> Optional[RequestContext]:
    return _request_context.get()

def require_context() -> RequestContext:
    ctx = get_context()
    if ctx is None:
        raise RuntimeError("No request context set")
    return ctx`}</code>
          </pre>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">Data Isolation Strategies</h2>

          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Strategy 1: Row-Level Isolation (Shared Database)</h3>

          <p className="text-gray-300">
            All tenants share a database, with tenant_id columns filtering data. Best for smaller scale 
            with many tenants.
          </p>

          <pre className="bg-gray-950 rounded-lg p-4 overflow-x-auto">
            <code className="text-sm text-gray-300">{`# shared_db.py
import asyncpg
from context import require_context

class TenantAwareDB:
    def __init__(self, pool: asyncpg.Pool):
        self.pool = pool
    
    async def get_documents(self, limit: int = 100) -> list[dict]:
        """Automatically filters by current tenant"""
        ctx = require_context()
        
        async with self.pool.acquire() as conn:
            rows = await conn.fetch("""
                SELECT id, title, content, created_at
                FROM documents
                WHERE tenant_id = $1
                ORDER BY created_at DESC
                LIMIT $2
            """, ctx.tenant_id, limit)
            
            return [dict(row) for row in rows]
    
    async def create_document(self, title: str, content: str) -> str:
        """Automatically sets tenant_id"""
        ctx = require_context()
        
        async with self.pool.acquire() as conn:
            doc_id = await conn.fetchval("""
                INSERT INTO documents (tenant_id, title, content)
                VALUES ($1, $2, $3)
                RETURNING id
            """, ctx.tenant_id, title, content)
            
            return doc_id
    
    async def get_document(self, doc_id: str) -> dict | None:
        """Only returns document if it belongs to current tenant"""
        ctx = require_context()
        
        async with self.pool.acquire() as conn:
            row = await conn.fetchrow("""
                SELECT id, title, content, created_at
                FROM documents
                WHERE id = $1 AND tenant_id = $2
            """, doc_id, ctx.tenant_id)
            
            return dict(row) if row else None`}</code>
          </pre>

          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Strategy 2: Schema-Per-Tenant</h3>

          <p className="text-gray-300">
            Each tenant gets their own database schema. Better isolation while sharing the same database server.
          </p>

          <pre className="bg-gray-950 rounded-lg p-4 overflow-x-auto">
            <code className="text-sm text-gray-300">{`# schema_isolation.py
import asyncpg
from context import require_context

class SchemaIsolatedDB:
    def __init__(self, pool: asyncpg.Pool):
        self.pool = pool
    
    def _schema_name(self, tenant_id: str) -> str:
        # Sanitize tenant_id for use as schema name
        return f"tenant_{tenant_id.replace('-', '_')}"
    
    async def provision_tenant(self, tenant_id: str):
        """Create schema and tables for new tenant"""
        schema = self._schema_name(tenant_id)
        
        async with self.pool.acquire() as conn:
            await conn.execute(f"CREATE SCHEMA IF NOT EXISTS {schema}")
            await conn.execute(f"""
                CREATE TABLE IF NOT EXISTS {schema}.documents (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    title TEXT NOT NULL,
                    content TEXT,
                    created_at TIMESTAMP DEFAULT NOW()
                )
            """)
    
    async def get_documents(self, limit: int = 100) -> list[dict]:
        ctx = require_context()
        schema = self._schema_name(ctx.tenant_id)
        
        async with self.pool.acquire() as conn:
            rows = await conn.fetch(f"""
                SELECT id, title, content, created_at
                FROM {schema}.documents
                ORDER BY created_at DESC
                LIMIT $1
            """, limit)
            
            return [dict(row) for row in rows]`}</code>
          </pre>

          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Strategy 3: Database-Per-Tenant</h3>

          <p className="text-gray-300">
            Maximum isolation — each tenant gets their own database. Best for enterprise/compliance requirements.
          </p>

          <pre className="bg-gray-950 rounded-lg p-4 overflow-x-auto">
            <code className="text-sm text-gray-300">{`# db_per_tenant.py
import asyncpg
from typing import Dict
from context import require_context

class TenantDBManager:
    def __init__(self, base_dsn: str):
        self.base_dsn = base_dsn
        self._pools: Dict[str, asyncpg.Pool] = {}
    
    def _db_name(self, tenant_id: str) -> str:
        return f"tenant_{tenant_id.replace('-', '_')}"
    
    async def get_pool(self, tenant_id: str) -> asyncpg.Pool:
        """Get or create connection pool for tenant"""
        if tenant_id not in self._pools:
            db_name = self._db_name(tenant_id)
            dsn = f"{self.base_dsn}/{db_name}"
            self._pools[tenant_id] = await asyncpg.create_pool(dsn, min_size=1, max_size=5)
        
        return self._pools[tenant_id]
    
    async def provision_tenant(self, tenant_id: str):
        """Create database for new tenant"""
        db_name = self._db_name(tenant_id)
        
        # Connect to default database to create new one
        conn = await asyncpg.connect(f"{self.base_dsn}/postgres")
        try:
            await conn.execute(f"CREATE DATABASE {db_name}")
        finally:
            await conn.close()
        
        # Initialize schema in new database
        pool = await self.get_pool(tenant_id)
        async with pool.acquire() as conn:
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS documents (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    title TEXT NOT NULL,
                    content TEXT,
                    created_at TIMESTAMP DEFAULT NOW()
                )
            """)
    
    async def execute_for_tenant(self, query: str, *args) -> list:
        """Execute query against current tenant's database"""
        ctx = require_context()
        pool = await self.get_pool(ctx.tenant_id)
        
        async with pool.acquire() as conn:
            return await conn.fetch(query, *args)`}</code>
          </pre>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">Rate Limiting Per Tenant</h2>

          <p className="text-gray-300">
            Implement per-tenant rate limits to ensure fair resource distribution and protect your service.
          </p>

          <pre className="bg-gray-950 rounded-lg p-4 overflow-x-auto">
            <code className="text-sm text-gray-300">{`# rate_limiter.py
import time
import redis
from dataclasses import dataclass
from typing import Optional
from context import require_context

@dataclass
class RateLimitResult:
    allowed: bool
    remaining: int
    reset_at: float
    retry_after: Optional[float] = None

class TenantRateLimiter:
    def __init__(self, redis_client: redis.Redis, default_limit: int = 100):
        self.redis = redis_client
        self.default_limit = default_limit
        self.window_seconds = 60  # 1 minute window
    
    def _key(self, tenant_id: str) -> str:
        window = int(time.time() / self.window_seconds)
        return f"rate_limit:{tenant_id}:{window}"
    
    async def check_limit(self, limit: Optional[int] = None) -> RateLimitResult:
        """Check and increment rate limit for current tenant"""
        ctx = require_context()
        key = self._key(ctx.tenant_id)
        limit = limit or self.default_limit
        
        pipe = self.redis.pipeline()
        pipe.incr(key)
        pipe.expire(key, self.window_seconds)
        results = pipe.execute()
        
        current = results[0]
        window_end = (int(time.time() / self.window_seconds) + 1) * self.window_seconds
        
        if current > limit:
            return RateLimitResult(
                allowed=False,
                remaining=0,
                reset_at=window_end,
                retry_after=window_end - time.time()
            )
        
        return RateLimitResult(
            allowed=True,
            remaining=limit - current,
            reset_at=window_end
        )

class TieredRateLimiter(TenantRateLimiter):
    """Rate limiter with different limits per tier"""
    
    TIER_LIMITS = {
        'free': 100,
        'pro': 1000,
        'enterprise': 10000
    }
    
    async def check_limit_for_tier(self, tier: str) -> RateLimitResult:
        limit = self.TIER_LIMITS.get(tier, self.default_limit)
        return await self.check_limit(limit)`}</code>
          </pre>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">Complete Multi-Tenant MCP Server</h2>

          <p className="text-gray-300">
            Here's a complete example putting all the patterns together:
          </p>

          <pre className="bg-gray-950 rounded-lg p-4 overflow-x-auto">
            <code className="text-sm text-gray-300">{`# multi_tenant_server.py
from mcp.server.fastmcp import FastMCP
from mcp.server.fastmcp.exceptions import McpError
import asyncpg
import redis

from tenant_auth import TenantAuth, Tenant
from context import RequestContext, set_context, require_context
from rate_limiter import TieredRateLimiter

# Initialize
mcp = FastMCP("Multi-Tenant Document Server")
auth = TenantAuth()
redis_client = redis.Redis()
rate_limiter = TieredRateLimiter(redis_client)
db_pool: asyncpg.Pool = None

@mcp.on_startup
async def startup():
    global db_pool
    db_pool = await asyncpg.create_pool(
        "postgresql://localhost/multitenant_mcp",
        min_size=5,
        max_size=20
    )

# Middleware for authentication and rate limiting
async def authenticate_request(api_key: str) -> Tenant:
    """Authenticate and set up request context"""
    tenant = auth.authenticate(api_key)
    if not tenant:
        raise McpError("INVALID_REQUEST", "Invalid API key")
    
    # Check rate limit
    ctx = RequestContext(tenant_id=tenant.id)
    set_context(ctx)
    
    result = await rate_limiter.check_limit_for_tier(tenant.tier)
    if not result.allowed:
        raise McpError(
            "RESOURCE_EXHAUSTED",
            "Rate limit exceeded. Retry after " + str(int(result.retry_after)) + " seconds"
        )
    
    return tenant

# Tools with tenant isolation

@mcp.tool()
async def list_documents(api_key: str, limit: int = 20) -> str:
    """List documents for the authenticated tenant"""
    tenant = await authenticate_request(api_key)
    ctx = require_context()
    
    async with db_pool.acquire() as conn:
        rows = await conn.fetch("""
            SELECT id, title, created_at
            FROM documents
            WHERE tenant_id = $1
            ORDER BY created_at DESC
            LIMIT $2
        """, ctx.tenant_id, limit)
    
    if not rows:
        return f"No documents found for {tenant.name}"
    
    docs = [f"- {row['title']} (ID: {row['id']})" for row in rows]
    return f"Documents for {tenant.name}:\\n" + "\\n".join(docs)

@mcp.tool()
async def create_document(api_key: str, title: str, content: str) -> str:
    """Create a new document for the authenticated tenant"""
    tenant = await authenticate_request(api_key)
    ctx = require_context()
    
    async with db_pool.acquire() as conn:
        doc_id = await conn.fetchval("""
            INSERT INTO documents (tenant_id, title, content)
            VALUES ($1, $2, $3)
            RETURNING id
        """, ctx.tenant_id, title, content)
    
    # Track for billing
    await track_usage(ctx.tenant_id, "document_created")
    
    return f"Created document '{title}' with ID: {doc_id}"

@mcp.tool()
async def get_document(api_key: str, document_id: str) -> str:
    """Retrieve a document (only if it belongs to the tenant)"""
    tenant = await authenticate_request(api_key)
    ctx = require_context()
    
    async with db_pool.acquire() as conn:
        row = await conn.fetchrow("""
            SELECT title, content, created_at
            FROM documents
            WHERE id = $1 AND tenant_id = $2
        """, document_id, ctx.tenant_id)
    
    if not row:
        return "Document not found or access denied"
    
    return f"# {row['title']}\\n\\n{row['content']}\\n\\nCreated: {row['created_at']}"

@mcp.tool()
async def search_documents(api_key: str, query: str, limit: int = 10) -> str:
    """Search documents within the tenant's scope"""
    tenant = await authenticate_request(api_key)
    ctx = require_context()
    
    async with db_pool.acquire() as conn:
        rows = await conn.fetch("""
            SELECT id, title, 
                   ts_headline('english', content, plainto_tsquery($2)) as snippet
            FROM documents
            WHERE tenant_id = $1
              AND to_tsvector('english', title || ' ' || content) @@ plainto_tsquery($2)
            ORDER BY ts_rank(to_tsvector('english', title || ' ' || content), plainto_tsquery($2)) DESC
            LIMIT $3
        """, ctx.tenant_id, query, limit)
    
    if not rows:
        return f"No documents matching '{query}'"
    
    results = [f"**{row['title']}** (ID: {row['id']})\\n{row['snippet']}" for row in rows]
    return f"Search results for '{query}':\\n\\n" + "\\n\\n".join(results)

# Usage tracking for billing
async def track_usage(tenant_id: str, event: str, count: int = 1):
    """Track usage events for billing"""
    key = f"usage:{tenant_id}:{event}"
    redis_client.incrby(key, count)

if __name__ == "__main__":
    mcp.run()`}</code>
          </pre>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">Deployment Architecture</h2>

          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Shared Infrastructure (Most Common)</h3>

          <div className="bg-gray-800 rounded-lg p-6 my-6 border border-gray-700">
            <pre className="text-gray-300 text-sm m-0">{`┌─────────────────────────────────────────────────────────┐
│                    Load Balancer                         │
│                  (nginx / ALB / Cloudflare)              │
└─────────────────────────────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │ MCP Server  │ │ MCP Server  │ │ MCP Server  │
    │  Instance 1 │ │  Instance 2 │ │  Instance 3 │
    └─────────────┘ └─────────────┘ └─────────────┘
           │               │               │
           └───────────────┼───────────────┘
                           │
    ┌──────────────────────┼──────────────────────┐
    │                      ▼                      │
    │  ┌─────────────┐  ┌─────────────┐          │
    │  │  PostgreSQL │  │    Redis    │          │
    │  │  (Shared DB)│  │ (Rate Limit)│          │
    │  └─────────────┘  └─────────────┘          │
    └─────────────────────────────────────────────┘`}</pre>
          </div>

          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Kubernetes Deployment</h3>

          <pre className="bg-gray-950 rounded-lg p-4 overflow-x-auto">
            <code className="text-sm text-gray-300">{`# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mcp-multi-tenant
spec:
  replicas: 3
  selector:
    matchLabels:
      app: mcp-multi-tenant
  template:
    metadata:
      labels:
        app: mcp-multi-tenant
    spec:
      containers:
      - name: mcp-server
        image: your-registry/mcp-multi-tenant:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: mcp-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: mcp-secrets
              key: redis-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: mcp-multi-tenant-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: mcp-multi-tenant
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Pods
    pods:
      metric:
        name: mcp_requests_per_second
      target:
        type: AverageValue
        averageValue: "100"`}</code>
          </pre>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">Billing & Usage Tracking</h2>

          <pre className="bg-gray-950 rounded-lg p-4 overflow-x-auto">
            <code className="text-sm text-gray-300">{`# billing.py
import redis
from datetime import datetime
from typing import Dict
from dataclasses import dataclass

@dataclass
class UsageReport:
    tenant_id: str
    period: str
    events: Dict[str, int]
    total_requests: int
    estimated_cost: float

class BillingTracker:
    def __init__(self, redis_client: redis.Redis):
        self.redis = redis_client
        
        # Pricing per event type
        self.pricing = {
            'tool_call': 0.001,        # $0.001 per tool call
            'document_created': 0.01,   # $0.01 per document
            'search_query': 0.005,      # $0.005 per search
        }
    
    def track(self, tenant_id: str, event_type: str, count: int = 1):
        """Track a billable event"""
        month = datetime.now().strftime("%Y-%m")
        key = f"billing:{tenant_id}:{month}:{event_type}"
        self.redis.incrby(key, count)
    
    def get_usage(self, tenant_id: str, month: str = None) -> UsageReport:
        """Get usage report for a tenant"""
        month = month or datetime.now().strftime("%Y-%m")
        pattern = f"billing:{tenant_id}:{month}:*"
        
        events = {}
        total_requests = 0
        estimated_cost = 0.0
        
        for key in self.redis.scan_iter(pattern):
            event_type = key.decode().split(":")[-1]
            count = int(self.redis.get(key) or 0)
            events[event_type] = count
            total_requests += count
            estimated_cost += count * self.pricing.get(event_type, 0)
        
        return UsageReport(
            tenant_id=tenant_id,
            period=month,
            events=events,
            total_requests=total_requests,
            estimated_cost=estimated_cost
        )

# Add billing tool to MCP server
@mcp.tool()
async def get_usage_report(api_key: str, month: str = None) -> str:
    """Get usage report for the current billing period"""
    tenant = await authenticate_request(api_key)
    report = billing.get_usage(tenant.id, month)
    
    lines = [
        "# Usage Report for " + tenant.name,
        "Period: " + report.period,
        "Total Requests: " + str(report.total_requests),
        "",
        "## Breakdown:",
    ]
    
    for event, count in report.events.items():
        cost = count * billing.pricing.get(event, 0)
        lines.append("- " + event + ": " + str(count) + " ($" + format(cost, '.2f') + ")")
    
    lines.append("\\n**Estimated Total: $" + format(report.estimated_cost, '.2f') + "**")
    
    return "\\n".join(lines)`}
            </code>
          </pre>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">Security Best Practices</h2>

          <div className="bg-gray-800 rounded-lg p-6 my-8 border border-gray-700">
            <h3 className="text-white text-lg font-semibold mt-0 mb-4">Multi-Tenant Security Checklist</h3>
            <ul className="text-gray-300 space-y-3 mb-0">
              <li>
                <strong className="text-green-400">✓ Data Isolation</strong>
                <p className="text-sm text-gray-400 mt-1">Every database query includes tenant_id filter. No exceptions.</p>
              </li>
              <li>
                <strong className="text-green-400">✓ Input Validation</strong>
                <p className="text-sm text-gray-400 mt-1">Validate all inputs. Use parameterized queries. Never trust client data.</p>
              </li>
              <li>
                <strong className="text-green-400">✓ API Key Rotation</strong>
                <p className="text-sm text-gray-400 mt-1">Support key rotation without downtime. Old keys grace period.</p>
              </li>
              <li>
                <strong className="text-green-400">✓ Audit Logging</strong>
                <p className="text-sm text-gray-400 mt-1">Log all sensitive operations with tenant context for compliance.</p>
              </li>
              <li>
                <strong className="text-green-400">✓ Resource Limits</strong>
                <p className="text-sm text-gray-400 mt-1">Rate limiting, request size limits, timeout enforcement per tenant.</p>
              </li>
              <li>
                <strong className="text-green-400">✓ Encryption</strong>
                <p className="text-sm text-gray-400 mt-1">TLS for transport. Consider tenant-specific encryption keys for sensitive data.</p>
              </li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">Next Steps</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
            <a href="/mcp/mcp-authentication-guide" className="block bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-colors">
              <h3 className="text-white font-semibold mb-2">Authentication Guide →</h3>
              <p className="text-gray-400 text-sm">Deep dive into MCP authentication patterns</p>
            </a>
            <a href="/mcp/mcp-docker-deployment" className="block bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-colors">
              <h3 className="text-white font-semibold mb-2">Docker Deployment →</h3>
              <p className="text-gray-400 text-sm">Containerize and deploy MCP servers</p>
            </a>
            <a href="/mcp/mcp-performance-optimization" className="block bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-colors">
              <h3 className="text-white font-semibold mb-2">Performance Optimization →</h3>
              <p className="text-gray-400 text-sm">Scale your multi-tenant server</p>
            </a>
            <a href="/mcp/testing-mcp-servers" className="block bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-colors">
              <h3 className="text-white font-semibold mb-2">Testing Guide →</h3>
              <p className="text-gray-400 text-sm">Test multi-tenant isolation properly</p>
            </a>
          </div>

        </div>

        <footer className="mt-16 pt-8 border-t border-gray-800">
          <p className="text-gray-400">
            Multi-tenancy is complex but essential for building scalable MCP services. 
            Start with shared infrastructure and row-level isolation, then evolve as your needs grow.
          </p>
          <div className="mt-6">
            <a href="/mcp" className="text-purple-400 hover:text-purple-300">
              ← Back to all MCP tutorials
            </a>
          </div>
        </footer>
      </article>
    </main>
  )
}
