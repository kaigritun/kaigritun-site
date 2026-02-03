import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MCP Database Integrations: PostgreSQL, MongoDB, Redis | Complete Guide",
  description:
    "Learn to build MCP servers that connect to databases. Covers PostgreSQL, MongoDB, Redis, SQLite with connection pooling, migrations, and production patterns.",
  keywords: [
    "MCP database",
    "MCP PostgreSQL",
    "MCP MongoDB",
    "MCP Redis",
    "database MCP server",
    "MCP SQL",
  ],
  openGraph: {
    title: "MCP Database Integrations: PostgreSQL, MongoDB, Redis",
    description:
      "Build MCP servers that connect to PostgreSQL, MongoDB, Redis, and SQLite with production-ready patterns.",
    type: "article",
  },
};

export default function MCPDatabaseIntegrationsPage() {
  return (
    <main className="min-h-screen bg-[#0c0c0c] text-gray-100">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link
          href="/mcp"
          className="text-amber-500 hover:text-amber-400 text-sm mb-8 inline-block"
        >
          ← Back to MCP Tutorials
        </Link>

        <article className="prose prose-invert prose-amber max-w-none">
          <header className="mb-12 border-b border-gray-800 pb-8">
            <p className="text-amber-500 font-mono text-sm mb-2 uppercase tracking-wider">
              Tutorial
            </p>
            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
              MCP Database Integrations
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed">
              Connect your MCP servers to PostgreSQL, MongoDB, Redis, and SQLite 
              with connection pooling, migrations, and production-ready patterns.
            </p>
            <div className="flex gap-4 mt-4 text-sm text-gray-500">
              <span>15 min read</span>
              <span>•</span>
              <span>Updated February 2025</span>
            </div>
          </header>

          <nav className="bg-gray-900/50 rounded-lg p-6 mb-12 border border-gray-800">
            <h2 className="text-lg font-semibold mb-4 text-white">Contents</h2>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#overview" className="hover:text-amber-500">
                  Database Access Patterns
                </a>
              </li>
              <li>
                <a href="#postgresql" className="hover:text-amber-500">
                  PostgreSQL with asyncpg
                </a>
              </li>
              <li>
                <a href="#mongodb" className="hover:text-amber-500">
                  MongoDB with Motor
                </a>
              </li>
              <li>
                <a href="#redis" className="hover:text-amber-500">
                  Redis for Caching and Queues
                </a>
              </li>
              <li>
                <a href="#sqlite" className="hover:text-amber-500">
                  SQLite for Local Databases
                </a>
              </li>
              <li>
                <a href="#pooling" className="hover:text-amber-500">
                  Connection Pooling
                </a>
              </li>
              <li>
                <a href="#migrations" className="hover:text-amber-500">
                  Schema Migrations
                </a>
              </li>
              <li>
                <a href="#complete-example" className="hover:text-amber-500">
                  Complete Example: Analytics Server
                </a>
              </li>
            </ul>
          </nav>

          <section id="overview" className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">
              Database Access Patterns
            </h2>
            <p className="text-gray-300 mb-4">
              MCP servers often need to query, update, or aggregate data from databases.
              Unlike traditional web APIs, MCP tools are invoked by AI assistants, which
              means:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>
                <strong>Natural language queries</strong> — The AI translates user intent
                into structured database operations
              </li>
              <li>
                <strong>Context awareness</strong> — Tools can access conversation context
                to filter or scope queries
              </li>
              <li>
                <strong>Iterative exploration</strong> — Users often start broad and narrow
                down, requiring efficient pagination
              </li>
            </ul>
            <p className="text-gray-300">
              This guide covers the most common database integrations with patterns
              that work well for AI-driven access.
            </p>
          </section>

          <section id="postgresql" className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">
              PostgreSQL with asyncpg
            </h2>
            <p className="text-gray-300 mb-4">
              PostgreSQL is the go-to choice for structured data. Use <code>asyncpg</code> for
              high-performance async access:
            </p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm mb-4">
              <code className="text-gray-300">{`# Install dependencies
pip install mcp[cli] asyncpg`}</code>
            </pre>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm mb-4">
              <code className="text-gray-300">{`# server.py
import asyncpg
from mcp.server.fastmcp import FastMCP
from contextlib import asynccontextmanager
import os

mcp = FastMCP("postgres-server")

# Connection pool (initialized on startup)
pool = None

@asynccontextmanager
async def lifespan(app):
    global pool
    pool = await asyncpg.create_pool(
        os.environ.get("DATABASE_URL"),
        min_size=5,
        max_size=20
    )
    yield
    await pool.close()

mcp.lifespan = lifespan

@mcp.tool()
async def query_users(
    email_contains: str = None,
    limit: int = 10,
    offset: int = 0
) -> dict:
    """Search users in the database."""
    async with pool.acquire() as conn:
        if email_contains:
            rows = await conn.fetch(
                """
                SELECT id, email, name, created_at 
                FROM users 
                WHERE email ILIKE $1
                ORDER BY created_at DESC
                LIMIT $2 OFFSET $3
                """,
                f"%{email_contains}%",
                limit,
                offset
            )
        else:
            rows = await conn.fetch(
                """
                SELECT id, email, name, created_at 
                FROM users 
                ORDER BY created_at DESC
                LIMIT $1 OFFSET $2
                """,
                limit,
                offset
            )
        
        return {
            "users": [dict(row) for row in rows],
            "count": len(rows),
            "offset": offset
        }

@mcp.tool()
async def get_user_stats(user_id: int) -> dict:
    """Get statistics for a specific user."""
    async with pool.acquire() as conn:
        stats = await conn.fetchrow(
            """
            SELECT 
                u.id,
                u.email,
                COUNT(DISTINCT o.id) as order_count,
                COALESCE(SUM(o.total), 0) as total_spent,
                MAX(o.created_at) as last_order
            FROM users u
            LEFT JOIN orders o ON u.id = o.user_id
            WHERE u.id = $1
            GROUP BY u.id, u.email
            """,
            user_id
        )
        
        if not stats:
            return {"error": "User not found"}
        
        return dict(stats)

@mcp.tool()
async def run_analytics_query(
    sql: str,
    params: list = None
) -> dict:
    """
    Run a read-only analytics query.
    Only SELECT statements are allowed.
    """
    # Security: only allow SELECT
    sql_lower = sql.lower().strip()
    if not sql_lower.startswith("select"):
        return {"error": "Only SELECT queries allowed"}
    
    # Block dangerous keywords
    dangerous = ["insert", "update", "delete", "drop", "alter", "truncate"]
    if any(word in sql_lower for word in dangerous):
        return {"error": "Query contains forbidden keywords"}
    
    async with pool.acquire() as conn:
        try:
            if params:
                rows = await conn.fetch(sql, *params)
            else:
                rows = await conn.fetch(sql)
            
            return {
                "rows": [dict(row) for row in rows],
                "count": len(rows)
            }
        except Exception as e:
            return {"error": str(e)}`}</code>
            </pre>
            <p className="text-gray-300">
              <strong>Key patterns:</strong> Use connection pools, parameterized queries
              to prevent SQL injection, and read-only restrictions for analytics tools.
            </p>
          </section>

          <section id="mongodb" className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">
              MongoDB with Motor
            </h2>
            <p className="text-gray-300 mb-4">
              For document databases, <code>motor</code> provides async MongoDB access:
            </p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm mb-4">
              <code className="text-gray-300">{`# Install
pip install mcp[cli] motor`}</code>
            </pre>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm mb-4">
              <code className="text-gray-300">{`# server.py
from motor.motor_asyncio import AsyncIOMotorClient
from mcp.server.fastmcp import FastMCP
from bson import ObjectId
import os

mcp = FastMCP("mongo-server")

# MongoDB client
client = AsyncIOMotorClient(os.environ.get("MONGODB_URI"))
db = client.myapp

@mcp.tool()
async def search_documents(
    collection: str,
    query: dict = None,
    projection: list = None,
    limit: int = 20
) -> dict:
    """
    Search documents in a MongoDB collection.
    
    Args:
        collection: Collection name (products, orders, etc.)
        query: MongoDB query filter (e.g., {"status": "active"})
        projection: Fields to return (e.g., ["name", "price"])
        limit: Max documents to return
    """
    allowed_collections = ["products", "orders", "categories"]
    if collection not in allowed_collections:
        return {"error": f"Collection must be one of: {allowed_collections}"}
    
    coll = db[collection]
    
    # Build projection
    proj = None
    if projection:
        proj = {field: 1 for field in projection}
        proj["_id"] = 1
    
    cursor = coll.find(query or {}, proj).limit(limit)
    docs = await cursor.to_list(length=limit)
    
    # Convert ObjectId to string for JSON serialization
    for doc in docs:
        doc["_id"] = str(doc["_id"])
    
    return {"documents": docs, "count": len(docs)}

@mcp.tool()
async def aggregate_data(
    collection: str,
    pipeline: list
) -> dict:
    """
    Run an aggregation pipeline on a collection.
    
    Args:
        collection: Collection name
        pipeline: MongoDB aggregation pipeline stages
    """
    allowed = ["products", "orders", "categories"]
    if collection not in allowed:
        return {"error": f"Collection must be one of: {allowed}"}
    
    # Security: limit result size
    pipeline = pipeline + [{"$limit": 1000}]
    
    coll = db[collection]
    cursor = coll.aggregate(pipeline)
    results = await cursor.to_list(length=1000)
    
    # Handle ObjectId serialization
    for doc in results:
        if "_id" in doc and isinstance(doc["_id"], ObjectId):
            doc["_id"] = str(doc["_id"])
    
    return {"results": results, "count": len(results)}

@mcp.tool()
async def get_document(
    collection: str,
    document_id: str
) -> dict:
    """Get a single document by ID."""
    allowed = ["products", "orders", "categories"]
    if collection not in allowed:
        return {"error": f"Collection must be one of: {allowed}"}
    
    try:
        oid = ObjectId(document_id)
    except Exception:
        return {"error": "Invalid document ID format"}
    
    doc = await db[collection].find_one({"_id": oid})
    
    if not doc:
        return {"error": "Document not found"}
    
    doc["_id"] = str(doc["_id"])
    return {"document": doc}`}</code>
            </pre>
            <p className="text-gray-300">
              <strong>Note:</strong> Always whitelist allowed collections and limit result
              sizes to prevent resource exhaustion.
            </p>
          </section>

          <section id="redis" className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">
              Redis for Caching and Queues
            </h2>
            <p className="text-gray-300 mb-4">
              Redis is perfect for caching, session data, and job queues:
            </p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm mb-4">
              <code className="text-gray-300">{`# Install
pip install mcp[cli] redis`}</code>
            </pre>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm mb-4">
              <code className="text-gray-300">{`# server.py
import redis.asyncio as redis
from mcp.server.fastmcp import FastMCP
import json
import os

mcp = FastMCP("redis-server")

# Redis client
r = redis.from_url(os.environ.get("REDIS_URL", "redis://localhost"))

@mcp.tool()
async def cache_get(key: str) -> dict:
    """Get a value from the cache."""
    value = await r.get(key)
    if value is None:
        return {"found": False, "value": None}
    
    # Try to parse as JSON
    try:
        parsed = json.loads(value)
        return {"found": True, "value": parsed}
    except json.JSONDecodeError:
        return {"found": True, "value": value.decode()}

@mcp.tool()
async def cache_set(
    key: str,
    value: str,
    ttl_seconds: int = 3600
) -> dict:
    """
    Set a value in the cache.
    
    Args:
        key: Cache key
        value: Value to store (string or JSON)
        ttl_seconds: Time to live in seconds (default: 1 hour)
    """
    await r.setex(key, ttl_seconds, value)
    return {"success": True, "key": key, "ttl": ttl_seconds}

@mcp.tool()
async def get_queue_stats(queue_name: str) -> dict:
    """Get statistics for a job queue."""
    # Common Redis queue patterns
    pending = await r.llen(f"{queue_name}:pending")
    processing = await r.scard(f"{queue_name}:processing")
    completed = await r.get(f"{queue_name}:completed_count") or 0
    failed = await r.llen(f"{queue_name}:failed")
    
    return {
        "queue": queue_name,
        "pending": pending,
        "processing": processing,
        "completed": int(completed),
        "failed": failed
    }

@mcp.tool()
async def peek_queue(
    queue_name: str,
    count: int = 5
) -> dict:
    """
    Peek at items in a queue without removing them.
    
    Args:
        queue_name: Name of the queue
        count: Number of items to peek (max 20)
    """
    count = min(count, 20)  # Safety limit
    
    items = await r.lrange(f"{queue_name}:pending", 0, count - 1)
    
    parsed = []
    for item in items:
        try:
            parsed.append(json.loads(item))
        except json.JSONDecodeError:
            parsed.append(item.decode())
    
    return {"items": parsed, "count": len(parsed)}

@mcp.tool()
async def get_rate_limit_status(key: str) -> dict:
    """Check rate limit status for a key."""
    # Sliding window rate limit pattern
    current = await r.get(f"ratelimit:{key}")
    ttl = await r.ttl(f"ratelimit:{key}")
    
    return {
        "key": key,
        "current_count": int(current) if current else 0,
        "ttl_seconds": ttl if ttl > 0 else 0
    }`}</code>
            </pre>
          </section>

          <section id="sqlite" className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">
              SQLite for Local Databases
            </h2>
            <p className="text-gray-300 mb-4">
              SQLite is great for local-first MCP servers. Use <code>aiosqlite</code> for
              async access:
            </p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm mb-4">
              <code className="text-gray-300">{`# Install
pip install mcp[cli] aiosqlite`}</code>
            </pre>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm mb-4">
              <code className="text-gray-300">{`# server.py
import aiosqlite
from mcp.server.fastmcp import FastMCP
from pathlib import Path

mcp = FastMCP("sqlite-server")

# Database path
DB_PATH = Path.home() / ".myapp" / "data.db"

async def get_db():
    """Get database connection with row factory."""
    db = await aiosqlite.connect(DB_PATH)
    db.row_factory = aiosqlite.Row
    return db

@mcp.tool()
async def init_database() -> dict:
    """Initialize database schema."""
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    
    async with await get_db() as db:
        await db.executescript("""
            CREATE TABLE IF NOT EXISTS notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT,
                tags TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            
            CREATE INDEX IF NOT EXISTS idx_notes_tags ON notes(tags);
            CREATE INDEX IF NOT EXISTS idx_notes_created ON notes(created_at);
        """)
        await db.commit()
    
    return {"success": True, "path": str(DB_PATH)}

@mcp.tool()
async def add_note(
    title: str,
    content: str = "",
    tags: list = None
) -> dict:
    """Add a new note."""
    tags_str = ",".join(tags) if tags else ""
    
    async with await get_db() as db:
        cursor = await db.execute(
            "INSERT INTO notes (title, content, tags) VALUES (?, ?, ?)",
            (title, content, tags_str)
        )
        await db.commit()
        
        return {"id": cursor.lastrowid, "title": title}

@mcp.tool()
async def search_notes(
    query: str = None,
    tag: str = None,
    limit: int = 20
) -> dict:
    """Search notes by text or tag."""
    async with await get_db() as db:
        if tag:
            cursor = await db.execute(
                """
                SELECT * FROM notes 
                WHERE tags LIKE ? 
                ORDER BY updated_at DESC 
                LIMIT ?
                """,
                (f"%{tag}%", limit)
            )
        elif query:
            cursor = await db.execute(
                """
                SELECT * FROM notes 
                WHERE title LIKE ? OR content LIKE ?
                ORDER BY updated_at DESC 
                LIMIT ?
                """,
                (f"%{query}%", f"%{query}%", limit)
            )
        else:
            cursor = await db.execute(
                "SELECT * FROM notes ORDER BY updated_at DESC LIMIT ?",
                (limit,)
            )
        
        rows = await cursor.fetchall()
        notes = [dict(row) for row in rows]
        
        return {"notes": notes, "count": len(notes)}

@mcp.tool()
async def get_note(note_id: int) -> dict:
    """Get a specific note by ID."""
    async with await get_db() as db:
        cursor = await db.execute(
            "SELECT * FROM notes WHERE id = ?",
            (note_id,)
        )
        row = await cursor.fetchone()
        
        if not row:
            return {"error": "Note not found"}
        
        return {"note": dict(row)}`}</code>
            </pre>
          </section>

          <section id="pooling" className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">
              Connection Pooling
            </h2>
            <p className="text-gray-300 mb-4">
              Connection pooling is critical for MCP servers that handle concurrent requests.
              Here&apos;s how to configure pools properly:
            </p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm mb-4">
              <code className="text-gray-300">{`# PostgreSQL pooling with asyncpg
pool = await asyncpg.create_pool(
    DATABASE_URL,
    min_size=5,        # Minimum connections to keep open
    max_size=20,       # Maximum connections allowed
    max_inactive_connection_lifetime=300,  # Close idle connections after 5 min
    command_timeout=60 # Query timeout
)

# MongoDB pooling (built into motor)
client = AsyncIOMotorClient(
    MONGODB_URI,
    maxPoolSize=20,
    minPoolSize=5,
    maxIdleTimeMS=300000
)

# Redis pooling (built into redis-py)
pool = redis.ConnectionPool.from_url(
    REDIS_URL,
    max_connections=20
)
r = redis.Redis(connection_pool=pool)`}</code>
            </pre>
            <p className="text-gray-300 mb-4">
              <strong>Pool sizing guidelines:</strong>
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>
                <strong>min_size:</strong> Number of expected concurrent tool calls
              </li>
              <li>
                <strong>max_size:</strong> 2-3x min_size for burst handling
              </li>
              <li>
                <strong>Idle timeout:</strong> 5-10 minutes for cost efficiency
              </li>
              <li>
                <strong>Query timeout:</strong> 30-60 seconds (AI assistants wait)
              </li>
            </ul>
          </section>

          <section id="migrations" className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">
              Schema Migrations
            </h2>
            <p className="text-gray-300 mb-4">
              For production MCP servers, use proper migration tools:
            </p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm mb-4">
              <code className="text-gray-300">{`# Alembic for SQLAlchemy/PostgreSQL
pip install alembic sqlalchemy asyncpg

# Initialize
alembic init migrations

# Create migration
alembic revision --autogenerate -m "add users table"

# Run migrations
alembic upgrade head`}</code>
            </pre>
            <p className="text-gray-300 mb-4">
              Integrate migrations into your MCP server startup:
            </p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm mb-4">
              <code className="text-gray-300">{`from alembic.config import Config
from alembic import command

async def run_migrations():
    """Run pending migrations on startup."""
    alembic_cfg = Config("alembic.ini")
    command.upgrade(alembic_cfg, "head")

@asynccontextmanager
async def lifespan(app):
    # Run migrations before starting
    await run_migrations()
    
    # Initialize connection pool
    global pool
    pool = await asyncpg.create_pool(DATABASE_URL)
    
    yield
    
    await pool.close()`}</code>
            </pre>
          </section>

          <section id="complete-example" className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">
              Complete Example: Analytics Server
            </h2>
            <p className="text-gray-300 mb-4">
              Here&apos;s a complete MCP server that combines PostgreSQL for data,
              Redis for caching, and proper connection management:
            </p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm mb-4">
              <code className="text-gray-300">{`# analytics_server.py
import asyncpg
import redis.asyncio as redis
from mcp.server.fastmcp import FastMCP
from contextlib import asynccontextmanager
from datetime import datetime, timedelta
import json
import os

mcp = FastMCP("analytics-server")

# Connection globals
pg_pool = None
redis_client = None

@asynccontextmanager
async def lifespan(app):
    global pg_pool, redis_client
    
    # Initialize PostgreSQL pool
    pg_pool = await asyncpg.create_pool(
        os.environ["DATABASE_URL"],
        min_size=5,
        max_size=20
    )
    
    # Initialize Redis
    redis_client = redis.from_url(
        os.environ.get("REDIS_URL", "redis://localhost")
    )
    
    yield
    
    # Cleanup
    await pg_pool.close()
    await redis_client.close()

mcp.lifespan = lifespan

# Cache decorator
async def cached(key: str, ttl: int = 300):
    """Get from cache or None."""
    data = await redis_client.get(key)
    if data:
        return json.loads(data)
    return None

async def set_cache(key: str, data: dict, ttl: int = 300):
    """Set cache with TTL."""
    await redis_client.setex(key, ttl, json.dumps(data, default=str))

@mcp.tool()
async def get_daily_metrics(
    date: str = None,
    metric_type: str = "all"
) -> dict:
    """
    Get daily metrics for the dashboard.
    
    Args:
        date: Date in YYYY-MM-DD format (default: today)
        metric_type: Type of metric (users, revenue, events, all)
    """
    if date is None:
        date = datetime.now().strftime("%Y-%m-%d")
    
    # Check cache first
    cache_key = f"metrics:{date}:{metric_type}"
    cached_data = await cached(cache_key)
    if cached_data:
        cached_data["from_cache"] = True
        return cached_data
    
    async with pg_pool.acquire() as conn:
        if metric_type == "users" or metric_type == "all":
            user_stats = await conn.fetchrow("""
                SELECT 
                    COUNT(*) as signups,
                    COUNT(*) FILTER (WHERE last_login >= $1) as active
                FROM users
                WHERE created_at::date = $1 OR last_login >= $1
            """, date)
        
        if metric_type == "revenue" or metric_type == "all":
            revenue_stats = await conn.fetchrow("""
                SELECT 
                    COALESCE(SUM(amount), 0) as total,
                    COUNT(*) as transactions
                FROM transactions
                WHERE created_at::date = $1
            """, date)
        
        if metric_type == "events" or metric_type == "all":
            event_stats = await conn.fetchrow("""
                SELECT 
                    COUNT(*) as total,
                    COUNT(DISTINCT user_id) as unique_users
                FROM events
                WHERE created_at::date = $1
            """, date)
    
    result = {
        "date": date,
        "from_cache": False
    }
    
    if metric_type in ("users", "all"):
        result["users"] = dict(user_stats)
    if metric_type in ("revenue", "all"):
        result["revenue"] = dict(revenue_stats)
    if metric_type in ("events", "all"):
        result["events"] = dict(event_stats)
    
    # Cache for 5 minutes
    await set_cache(cache_key, result, ttl=300)
    
    return result

@mcp.tool()
async def get_trend_data(
    metric: str,
    days: int = 7
) -> dict:
    """
    Get trend data for a metric over time.
    
    Args:
        metric: Metric to track (signups, revenue, events)
        days: Number of days to look back (max 90)
    """
    days = min(days, 90)
    start_date = datetime.now() - timedelta(days=days)
    
    cache_key = f"trend:{metric}:{days}"
    cached_data = await cached(cache_key)
    if cached_data:
        return cached_data
    
    async with pg_pool.acquire() as conn:
        if metric == "signups":
            rows = await conn.fetch("""
                SELECT 
                    created_at::date as date,
                    COUNT(*) as value
                FROM users
                WHERE created_at >= $1
                GROUP BY created_at::date
                ORDER BY date
            """, start_date)
        elif metric == "revenue":
            rows = await conn.fetch("""
                SELECT 
                    created_at::date as date,
                    COALESCE(SUM(amount), 0) as value
                FROM transactions
                WHERE created_at >= $1
                GROUP BY created_at::date
                ORDER BY date
            """, start_date)
        elif metric == "events":
            rows = await conn.fetch("""
                SELECT 
                    created_at::date as date,
                    COUNT(*) as value
                FROM events
                WHERE created_at >= $1
                GROUP BY created_at::date
                ORDER BY date
            """, start_date)
        else:
            return {"error": f"Unknown metric: {metric}"}
    
    result = {
        "metric": metric,
        "days": days,
        "data": [{"date": str(r["date"]), "value": float(r["value"])} for r in rows]
    }
    
    await set_cache(cache_key, result, ttl=300)
    return result

@mcp.tool()
async def top_users(
    metric: str = "revenue",
    limit: int = 10
) -> dict:
    """
    Get top users by a metric.
    
    Args:
        metric: Ranking metric (revenue, events, logins)
        limit: Number of users to return (max 50)
    """
    limit = min(limit, 50)
    
    async with pg_pool.acquire() as conn:
        if metric == "revenue":
            rows = await conn.fetch("""
                SELECT 
                    u.id, u.email, u.name,
                    COALESCE(SUM(t.amount), 0) as value
                FROM users u
                LEFT JOIN transactions t ON u.id = t.user_id
                GROUP BY u.id, u.email, u.name
                ORDER BY value DESC
                LIMIT $1
            """, limit)
        elif metric == "events":
            rows = await conn.fetch("""
                SELECT 
                    u.id, u.email, u.name,
                    COUNT(e.id) as value
                FROM users u
                LEFT JOIN events e ON u.id = e.user_id
                GROUP BY u.id, u.email, u.name
                ORDER BY value DESC
                LIMIT $1
            """, limit)
        else:
            return {"error": f"Unknown metric: {metric}"}
    
    return {
        "metric": metric,
        "users": [dict(r) for r in rows]
    }

@mcp.tool()
async def invalidate_cache(pattern: str = "*") -> dict:
    """
    Invalidate cached data.
    
    Args:
        pattern: Key pattern to invalidate (e.g., "metrics:*")
    """
    # Safety: require specific pattern
    if pattern == "*":
        return {"error": "Must specify a pattern (e.g., metrics:*)"}
    
    keys = []
    async for key in redis_client.scan_iter(pattern):
        keys.append(key)
    
    if keys:
        await redis_client.delete(*keys)
    
    return {"invalidated": len(keys), "pattern": pattern}

if __name__ == "__main__":
    import asyncio
    mcp.run()`}</code>
            </pre>
          </section>

          <section className="mb-12 bg-gray-900/50 rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4">Best Practices</h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-amber-500">→</span>
                <span>
                  <strong>Always use connection pools</strong> — Never create connections
                  per request; reuse from a pool
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">→</span>
                <span>
                  <strong>Parameterize all queries</strong> — Never interpolate user input
                  directly into SQL
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">→</span>
                <span>
                  <strong>Set query timeouts</strong> — AI assistants can wait, but not
                  forever
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">→</span>
                <span>
                  <strong>Whitelist allowed operations</strong> — Especially for
                  user-provided queries or collection names
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">→</span>
                <span>
                  <strong>Cache expensive queries</strong> — Use Redis with reasonable TTLs
                  for analytics
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">→</span>
                <span>
                  <strong>Limit result sizes</strong> — Always cap results to prevent memory
                  issues
                </span>
              </li>
            </ul>
          </section>

          <section className="border-t border-gray-800 pt-8">
            <h2 className="text-xl font-bold text-white mb-4">Related Tutorials</h2>
            <div className="grid gap-4">
              <Link
                href="/mcp/mcp-performance-optimization"
                className="block p-4 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-amber-500/50 transition-colors"
              >
                <h3 className="font-semibold text-white mb-1">
                  MCP Performance Optimization
                </h3>
                <p className="text-sm text-gray-400">
                  Connection pooling, caching, and async patterns for fast MCP servers.
                </p>
              </Link>
              <Link
                href="/mcp/mcp-authentication-guide"
                className="block p-4 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-amber-500/50 transition-colors"
              >
                <h3 className="font-semibold text-white mb-1">
                  MCP Authentication Guide
                </h3>
                <p className="text-sm text-gray-400">
                  Secure your database credentials with environment variables and secrets managers.
                </p>
              </Link>
              <Link
                href="/mcp/testing-mcp-servers"
                className="block p-4 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-amber-500/50 transition-colors"
              >
                <h3 className="font-semibold text-white mb-1">
                  Testing MCP Servers
                </h3>
                <p className="text-sm text-gray-400">
                  Unit and integration testing patterns for database-backed MCP servers.
                </p>
              </Link>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
