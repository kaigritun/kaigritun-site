import type { Metadata } from 'next'
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: 'MCP Performance Optimization: Speed Up Your Servers | Kai Gritun',
  description: 'Learn how to optimize MCP server performance with connection pooling, caching strategies, async patterns, and monitoring. Reduce latency and handle more requests.',
  keywords: ['MCP performance', 'MCP optimization', 'MCP latency', 'MCP caching', 'fast MCP server'],
  openGraph: {
    title: 'MCP Performance Optimization: Speed Up Your Servers',
    description: 'Comprehensive guide to optimizing MCP server performance for production workloads.',
    type: 'article',
    publishedTime: '2025-02-03T00:00:00.000Z',
  },
}

export default function MCPPerformanceOptimization() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-8">
          <a href="/mcp" className="text-orange-400 hover:text-orange-300 text-sm">
            ← Back to MCP Tutorials
          </a>
        </div>
        
        <article className="prose prose-invert prose-orange max-w-none">
          <h1 className="text-4xl font-bold text-white mb-4">
            MCP Performance Optimization: Speed Up Your Servers
          </h1>
          
          <p className="text-zinc-400 text-lg mb-8">
            15 min read • February 2025
          </p>

          <p className="lead text-xl text-zinc-300">
            MCP servers can become bottlenecks when Claude needs to make many tool calls or handle 
            complex operations. This guide covers practical optimization techniques to reduce latency, 
            increase throughput, and handle production workloads efficiently.
          </p>

          <nav className="my-8 p-6 bg-zinc-900 rounded-lg">
            <h2 className="text-lg font-semibold text-white mt-0 mb-4">Quick Navigation</h2>
            <ul className="space-y-2 mb-0">
              <li><a href="#measuring" className="text-orange-400">Measuring Performance</a></li>
              <li><a href="#connection-pooling" className="text-orange-400">Connection Pooling</a></li>
              <li><a href="#caching" className="text-orange-400">Caching Strategies</a></li>
              <li><a href="#async-patterns" className="text-orange-400">Async Patterns</a></li>
              <li><a href="#batching" className="text-orange-400">Request Batching</a></li>
              <li><a href="#streaming" className="text-orange-400">Streaming Responses</a></li>
              <li><a href="#monitoring" className="text-orange-400">Production Monitoring</a></li>
              <li><a href="#common-mistakes" className="text-orange-400">Common Mistakes</a></li>
            </ul>
          </nav>

          <h2 id="measuring" className="text-2xl font-bold text-white mt-12">
            Measuring Performance
          </h2>

          <p>
            Before optimizing, measure. Add timing instrumentation to understand where time is spent:
          </p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code className="text-sm text-zinc-300">{`import time
import logging
from functools import wraps
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("optimized-server")
logger = logging.getLogger(__name__)

def timed_tool(func):
    """Decorator to measure tool execution time."""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start = time.perf_counter()
        try:
            result = await func(*args, **kwargs)
            return result
        finally:
            elapsed = (time.perf_counter() - start) * 1000
            logger.info(f"{func.__name__} took {elapsed:.2f}ms")
    return wrapper

@mcp.tool()
@timed_tool
async def search_database(query: str) -> str:
    """Search with timing instrumentation."""
    # Your implementation
    pass`}</code>
          </pre>

          <p>
            For more comprehensive metrics, track percentiles (p50, p95, p99) and create histograms:
          </p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code className="text-sm text-zinc-300">{`import statistics
from collections import defaultdict, deque

class PerformanceTracker:
    def __init__(self, window_size: int = 1000):
        self.metrics = defaultdict(lambda: deque(maxlen=window_size))
    
    def record(self, tool_name: str, duration_ms: float):
        self.metrics[tool_name].append(duration_ms)
    
    def get_stats(self, tool_name: str) -> dict:
        data = list(self.metrics[tool_name])
        if not data:
            return {}
        
        sorted_data = sorted(data)
        return {
            "count": len(data),
            "mean": statistics.mean(data),
            "p50": sorted_data[len(data) // 2],
            "p95": sorted_data[int(len(data) * 0.95)],
            "p99": sorted_data[int(len(data) * 0.99)],
            "max": max(data),
        }

tracker = PerformanceTracker()

# Use in decorator
def timed_tool(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start = time.perf_counter()
        try:
            result = await func(*args, **kwargs)
            return result
        finally:
            elapsed = (time.perf_counter() - start) * 1000
            tracker.record(func.__name__, elapsed)
    return wrapper`}</code>
          </pre>

          <h2 id="connection-pooling" className="text-2xl font-bold text-white mt-12">
            Connection Pooling
          </h2>

          <p>
            Creating new connections for each request is expensive. Pool and reuse connections 
            to databases, APIs, and external services:
          </p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code className="text-sm text-zinc-300">{`import asyncpg
import httpx
from contextlib import asynccontextmanager

class ConnectionManager:
    """Manages connection pools for the MCP server."""
    
    def __init__(self):
        self.db_pool = None
        self.http_client = None
    
    async def initialize(self):
        # PostgreSQL connection pool
        self.db_pool = await asyncpg.create_pool(
            dsn="postgresql://user:pass@localhost/db",
            min_size=5,      # Minimum connections to keep
            max_size=20,     # Maximum connections
            max_inactive_connection_lifetime=300,  # 5 min idle timeout
        )
        
        # HTTP client with connection pooling
        self.http_client = httpx.AsyncClient(
            limits=httpx.Limits(
                max_connections=100,
                max_keepalive_connections=20,
            ),
            timeout=httpx.Timeout(30.0),
        )
    
    async def close(self):
        if self.db_pool:
            await self.db_pool.close()
        if self.http_client:
            await self.http_client.aclose()

# Global connection manager
connections = ConnectionManager()

@asynccontextmanager
async def lifespan(app):
    await connections.initialize()
    yield
    await connections.close()

# Use in tools
@mcp.tool()
async def query_users(search: str) -> str:
    """Query users using pooled connection."""
    async with connections.db_pool.acquire() as conn:
        rows = await conn.fetch(
            "SELECT * FROM users WHERE name ILIKE $1 LIMIT 10",
            f"%{search}%"
        )
        return str([dict(r) for r in rows])`}</code>
          </pre>

          <h2 id="caching" className="text-2xl font-bold text-white mt-12">
            Caching Strategies
          </h2>

          <p>
            Cache responses for expensive operations. Use TTL-based caching with different 
            strategies for different data types:
          </p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code className="text-sm text-zinc-300">{`import asyncio
from datetime import datetime, timedelta
from typing import Any, Optional
import hashlib
import json

class AsyncCache:
    """Simple async-safe cache with TTL support."""
    
    def __init__(self):
        self._cache: dict[str, tuple[Any, datetime]] = {}
        self._lock = asyncio.Lock()
    
    def _make_key(self, *args, **kwargs) -> str:
        """Create cache key from arguments."""
        key_data = json.dumps({"args": args, "kwargs": kwargs}, sort_keys=True)
        return hashlib.md5(key_data.encode()).hexdigest()
    
    async def get(self, key: str) -> Optional[Any]:
        async with self._lock:
            if key not in self._cache:
                return None
            value, expires = self._cache[key]
            if datetime.now() > expires:
                del self._cache[key]
                return None
            return value
    
    async def set(self, key: str, value: Any, ttl_seconds: int):
        async with self._lock:
            expires = datetime.now() + timedelta(seconds=ttl_seconds)
            self._cache[key] = (value, expires)
    
    async def clear_expired(self):
        """Periodic cleanup of expired entries."""
        async with self._lock:
            now = datetime.now()
            self._cache = {
                k: v for k, v in self._cache.items()
                if v[1] > now
            }

cache = AsyncCache()

def cached(ttl_seconds: int = 300):
    """Decorator for caching tool results."""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            key = cache._make_key(func.__name__, *args, **kwargs)
            
            # Try cache first
            cached_result = await cache.get(key)
            if cached_result is not None:
                return cached_result
            
            # Execute and cache
            result = await func(*args, **kwargs)
            await cache.set(key, result, ttl_seconds)
            return result
        return wrapper
    return decorator

@mcp.tool()
@cached(ttl_seconds=60)  # Cache for 1 minute
async def get_exchange_rates(base: str = "USD") -> str:
    """Get exchange rates with caching."""
    response = await connections.http_client.get(
        f"https://api.exchangerate.host/latest?base={base}"
    )
    return response.json()`}</code>
          </pre>

          <p>
            For production, consider using Redis for distributed caching:
          </p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code className="text-sm text-zinc-300">{`import redis.asyncio as redis

class RedisCache:
    def __init__(self, url: str = "redis://localhost:6379"):
        self.redis = redis.from_url(url)
    
    async def get(self, key: str) -> Optional[str]:
        return await self.redis.get(key)
    
    async def set(self, key: str, value: str, ttl: int):
        await self.redis.setex(key, ttl, value)
    
    async def close(self):
        await self.redis.close()`}</code>
          </pre>

          <h2 id="async-patterns" className="text-2xl font-bold text-white mt-12">
            Async Patterns
          </h2>

          <p>
            MCP servers should be fully async. Run independent operations concurrently:
          </p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code className="text-sm text-zinc-300">{`@mcp.tool()
async def get_user_summary(user_id: str) -> str:
    """Get user summary by fetching data concurrently."""
    
    # Bad: Sequential fetching (slow)
    # profile = await fetch_profile(user_id)
    # posts = await fetch_posts(user_id)
    # followers = await fetch_followers(user_id)
    
    # Good: Concurrent fetching (fast)
    profile, posts, followers = await asyncio.gather(
        fetch_profile(user_id),
        fetch_posts(user_id),
        fetch_followers(user_id),
    )
    
    return json.dumps({
        "profile": profile,
        "recent_posts": posts[:5],
        "follower_count": len(followers),
    })

# With error handling
async def get_user_summary_safe(user_id: str) -> str:
    """Concurrent fetching with graceful error handling."""
    results = await asyncio.gather(
        fetch_profile(user_id),
        fetch_posts(user_id),
        fetch_followers(user_id),
        return_exceptions=True,
    )
    
    profile, posts, followers = results
    
    return json.dumps({
        "profile": profile if not isinstance(profile, Exception) else None,
        "recent_posts": posts[:5] if not isinstance(posts, Exception) else [],
        "follower_count": len(followers) if not isinstance(followers, Exception) else 0,
    })`}</code>
          </pre>

          <p>
            For CPU-bound operations, use a thread pool:
          </p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code className="text-sm text-zinc-300">{`import asyncio
from concurrent.futures import ThreadPoolExecutor

# Create thread pool for CPU-bound work
executor = ThreadPoolExecutor(max_workers=4)

def cpu_heavy_sync(data: str) -> str:
    """CPU-intensive operation (runs in thread)."""
    # Parsing, compression, image processing, etc.
    import hashlib
    result = data
    for _ in range(1000):
        result = hashlib.sha256(result.encode()).hexdigest()
    return result

@mcp.tool()
async def process_data(data: str) -> str:
    """Process data using thread pool for CPU work."""
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(executor, cpu_heavy_sync, data)
    return result`}</code>
          </pre>

          <h2 id="batching" className="text-2xl font-bold text-white mt-12">
            Request Batching
          </h2>

          <p>
            When Claude makes many similar requests, batch them to reduce round trips:
          </p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code className="text-sm text-zinc-300">{`class BatchProcessor:
    """Batches requests to reduce API calls."""
    
    def __init__(self, batch_size: int = 10, delay_ms: int = 50):
        self.batch_size = batch_size
        self.delay_ms = delay_ms
        self._queue: list[tuple[str, asyncio.Future]] = []
        self._lock = asyncio.Lock()
        self._processing = False
    
    async def add(self, item_id: str) -> Any:
        """Add item to batch, returns result when processed."""
        future = asyncio.Future()
        
        async with self._lock:
            self._queue.append((item_id, future))
            
            # Start processing if batch is full
            if len(self._queue) >= self.batch_size:
                asyncio.create_task(self._process_batch())
            elif not self._processing:
                # Schedule processing after delay
                asyncio.create_task(self._delayed_process())
        
        return await future
    
    async def _delayed_process(self):
        await asyncio.sleep(self.delay_ms / 1000)
        await self._process_batch()
    
    async def _process_batch(self):
        async with self._lock:
            if not self._queue or self._processing:
                return
            
            self._processing = True
            batch = self._queue[:self.batch_size]
            self._queue = self._queue[self.batch_size:]
        
        try:
            # Make single batched API call
            ids = [item_id for item_id, _ in batch]
            results = await self._fetch_batch(ids)
            
            # Resolve futures with results
            for (item_id, future), result in zip(batch, results):
                future.set_result(result)
        except Exception as e:
            for _, future in batch:
                future.set_exception(e)
        finally:
            self._processing = False
    
    async def _fetch_batch(self, ids: list[str]) -> list[Any]:
        # Single API call for multiple items
        response = await connections.http_client.post(
            "https://api.example.com/batch",
            json={"ids": ids}
        )
        return response.json()["results"]

batcher = BatchProcessor()

@mcp.tool()
async def get_item(item_id: str) -> str:
    """Get item - automatically batched."""
    result = await batcher.add(item_id)
    return json.dumps(result)`}</code>
          </pre>

          <h2 id="streaming" className="text-2xl font-bold text-white mt-12">
            Streaming Responses
          </h2>

          <p>
            For large responses, stream data progressively to avoid memory issues and 
            provide faster time-to-first-byte:
          </p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code className="text-sm text-zinc-300">{`from typing import AsyncIterator

async def stream_large_file(path: str) -> AsyncIterator[str]:
    """Stream file contents in chunks."""
    async with aiofiles.open(path, 'r') as f:
        while chunk := await f.read(8192):  # 8KB chunks
            yield chunk

@mcp.tool()
async def read_large_log(path: str, search: str) -> str:
    """Read large log file efficiently with streaming."""
    matches = []
    line_number = 0
    
    async with aiofiles.open(path, 'r') as f:
        async for line in f:
            line_number += 1
            if search.lower() in line.lower():
                matches.append(f"Line {line_number}: {line.strip()}")
                
                # Limit results to prevent massive responses
                if len(matches) >= 100:
                    matches.append(f"... (truncated, {line_number}+ lines searched)")
                    break
    
    return "\\n".join(matches) if matches else "No matches found"`}</code>
          </pre>

          <h2 id="monitoring" className="text-2xl font-bold text-white mt-12">
            Production Monitoring
          </h2>

          <p>
            Set up Prometheus metrics for production monitoring:
          </p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code className="text-sm text-zinc-300">{`from prometheus_client import Counter, Histogram, generate_latest
import time

# Define metrics
TOOL_CALLS = Counter(
    'mcp_tool_calls_total',
    'Total tool calls',
    ['tool_name', 'status']
)

TOOL_DURATION = Histogram(
    'mcp_tool_duration_seconds',
    'Tool execution duration',
    ['tool_name'],
    buckets=[.01, .025, .05, .1, .25, .5, 1, 2.5, 5, 10]
)

ACTIVE_CONNECTIONS = Gauge(
    'mcp_active_connections',
    'Number of active MCP connections'
)

def monitored(func):
    """Decorator for Prometheus metrics."""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start = time.perf_counter()
        status = "success"
        try:
            result = await func(*args, **kwargs)
            return result
        except Exception as e:
            status = "error"
            raise
        finally:
            duration = time.perf_counter() - start
            TOOL_CALLS.labels(tool_name=func.__name__, status=status).inc()
            TOOL_DURATION.labels(tool_name=func.__name__).observe(duration)
    return wrapper

# Expose metrics endpoint
@mcp.tool()
async def get_metrics() -> str:
    """Get Prometheus metrics for monitoring."""
    return generate_latest().decode('utf-8')`}</code>
          </pre>

          <h2 id="common-mistakes" className="text-2xl font-bold text-white mt-12">
            Common Mistakes to Avoid
          </h2>

          <div className="bg-red-950 border border-red-800 p-6 rounded-lg my-6">
            <h3 className="text-red-400 mt-0 mb-4">❌ Performance Anti-Patterns</h3>
            <ul className="text-zinc-300 mb-0 space-y-3">
              <li><strong>Blocking the event loop:</strong> Using sync I/O in async functions freezes everything</li>
              <li><strong>Creating connections per request:</strong> Connection setup is expensive, always pool</li>
              <li><strong>Unbounded caches:</strong> Memory leaks from caches that grow forever</li>
              <li><strong>N+1 queries:</strong> Fetching related data in loops instead of batching</li>
              <li><strong>Ignoring timeouts:</strong> Hanging requests tie up resources indefinitely</li>
              <li><strong>Large synchronous responses:</strong> Building huge strings in memory</li>
            </ul>
          </div>

          <div className="bg-green-950 border border-green-800 p-6 rounded-lg my-6">
            <h3 className="text-green-400 mt-0 mb-4">✅ Performance Best Practices</h3>
            <ul className="text-zinc-300 mb-0 space-y-3">
              <li><strong>Always use async I/O:</strong> httpx, asyncpg, aiofiles, aioredis</li>
              <li><strong>Pool everything:</strong> Database connections, HTTP clients, thread pools</li>
              <li><strong>Set TTLs and limits:</strong> Cache expiration, max cache size, timeouts</li>
              <li><strong>Batch related requests:</strong> Fetch multiple items in single queries</li>
              <li><strong>Add timeouts everywhere:</strong> HTTP calls, database queries, tool execution</li>
              <li><strong>Stream large data:</strong> Process in chunks, don't load everything to memory</li>
              <li><strong>Measure continuously:</strong> You can't optimize what you don't measure</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-white mt-12">Summary</h2>

          <p>
            MCP performance optimization follows the same principles as any server optimization:
          </p>

          <ol>
            <li><strong>Measure first</strong> — Add instrumentation before making changes</li>
            <li><strong>Pool connections</strong> — Reuse expensive resources</li>
            <li><strong>Cache intelligently</strong> — Trade memory for latency where appropriate</li>
            <li><strong>Go async</strong> — Never block the event loop</li>
            <li><strong>Batch operations</strong> — Reduce round trips</li>
            <li><strong>Monitor production</strong> — Catch regressions early</li>
          </ol>

          <p>
            Start with measurement, make one change at a time, and verify improvements with data. 
            Premature optimization is the root of all evil — but measured optimization at scale is essential.
          </p>

          <div className="mt-12 p-6 bg-zinc-900 rounded-lg">
            <h3 className="text-white mt-0">Continue Learning</h3>
            <ul className="mb-0">
              <li><a href="/mcp/testing-mcp-servers" className="text-orange-400">Testing MCP Servers</a> — Validate your optimizations</li>
              <li><a href="/mcp/mcp-docker-deployment" className="text-orange-400">Docker Deployment</a> — Deploy optimized servers</li>
              <li><a href="/mcp/troubleshooting-mcp-servers" className="text-orange-400">Troubleshooting Guide</a> — Debug performance issues</li>
            </ul>
          </div>
        </article>

        <div className="mt-16 pt-8 border-t border-zinc-800">
          <a href="/mcp" className="text-orange-400 hover:text-orange-300">
            ← Back to all MCP tutorials
          </a>
        </div>
      </div>
    </main>
  )
}
