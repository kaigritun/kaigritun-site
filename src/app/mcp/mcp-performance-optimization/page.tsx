import { Metadata } from 'next';
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: "MCP Performance Optimization Guide (2025)",
  description: "Make your MCP servers fast with caching, connection pooling, async patterns, and benchmarking. Complete performance optimization guide for Model Context Protocol.",
  keywords: ["MCP performance", "MCP optimization", "fast MCP servers", "MCP caching", "MCP async", "Model Context Protocol performance"],
  openGraph: {
    title: "MCP Performance Optimization Guide",
    description: "Make your MCP servers fast with caching, connection pooling, and async patterns.",
    type: "article",
  },
};

export default function MCPPerformanceOptimization() {
  return (
    <main className="min-h-screen bg-black text-white">
      <article className="max-w-3xl mx-auto px-6 py-16">
        <header className="mb-12">
          <div className="text-orange-500 text-sm font-mono mb-4">MCP Guide</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            MCP Performance Optimization Guide
          </h1>
          <p className="text-gray-400 text-lg">
            Make your MCP servers fast with caching, connection pooling, and async patterns.
          </p>
          <div className="text-gray-500 text-sm mt-4">
            Updated February 2025 · 9 min read
          </div>
        </header>

        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-xl text-gray-300 leading-relaxed">
            Every millisecond of MCP latency adds to AI response time. Users waiting 10+ seconds for a response will abandon your tool. This guide covers the patterns that make MCP servers fast.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Why Performance Matters</h2>
          
          <p className="text-gray-300">
            Slow MCP servers create a poor user experience. When an AI assistant calls your tool and waits 5 seconds for a response, the entire conversation feels sluggish. Fast servers = better UX = more usage.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Async Everything</h2>

          <p className="text-gray-300">
            MCP is inherently async. Don't block the event loop:
          </p>

          <div className="bg-gray-900 rounded-lg p-4 my-6 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`# BAD - blocks the event loop
@server.tool()
def slow_tool():
    result = requests.get("https://api.example.com")  # Blocking!
    return result.json()

# GOOD - non-blocking
@server.tool()
async def fast_tool():
    async with aiohttp.ClientSession() as session:
        async with session.get("https://api.example.com") as response:
            return await response.json()`}
            </pre>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Connection Pooling</h2>

          <p className="text-gray-300">
            Create connections once, reuse them:
          </p>

          <div className="bg-gray-900 rounded-lg p-4 my-6 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`import aiohttp
import asyncpg

class MCPServer:
    def __init__(self):
        self.session = None
        self.db_pool = None
    
    async def startup(self):
        # HTTP connection pool
        self.session = aiohttp.ClientSession(
            connector=aiohttp.TCPConnector(limit=100)
        )
        # Database connection pool
        self.db_pool = await asyncpg.create_pool(
            DATABASE_URL, 
            min_size=5, 
            max_size=20
        )
    
    async def shutdown(self):
        await self.session.close()
        await self.db_pool.close()`}
            </pre>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Caching Strategies</h2>

          <h3 className="text-xl font-bold mt-8 mb-4 text-orange-500">In-Memory Cache</h3>

          <p className="text-gray-300">
            For frequently accessed, rarely changing data:
          </p>

          <div className="bg-gray-900 rounded-lg p-4 my-6 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`from functools import lru_cache
from cachetools import TTLCache

# Simple LRU cache
@lru_cache(maxsize=1000)
def get_config(key):
    return load_from_database(key)

# Async TTL cache
cache = TTLCache(maxsize=1000, ttl=300)  # 5 minute TTL

async def cached_fetch(url):
    if url in cache:
        return cache[url]
    
    result = await fetch(url)
    cache[url] = result
    return result`}
            </pre>
          </div>

          <h3 className="text-xl font-bold mt-8 mb-4 text-orange-500">Redis for Distributed Caching</h3>

          <p className="text-gray-300">
            When running multiple MCP server instances:
          </p>

          <div className="bg-gray-900 rounded-lg p-4 my-6 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`import redis.asyncio as redis

class CachedMCPServer:
    def __init__(self):
        self.redis = redis.Redis(host='localhost', port=6379)
    
    async def get_cached(self, key, fetch_func, ttl=300):
        # Try cache first
        cached = await self.redis.get(key)
        if cached:
            return json.loads(cached)
        
        # Cache miss - fetch and store
        result = await fetch_func()
        await self.redis.setex(key, ttl, json.dumps(result))
        return result`}
            </pre>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Batch Operations</h2>

          <p className="text-gray-300">
            Combine multiple requests into one:
          </p>

          <div className="bg-gray-900 rounded-lg p-4 my-6 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`@server.tool()
async def get_users_batch(user_ids: list[str]):
    # BAD: N database queries
    # users = [await db.get_user(id) for id in user_ids]
    
    # GOOD: 1 database query
    users = await db.get_users_where_id_in(user_ids)
    return users`}
            </pre>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Streaming Responses</h2>

          <p className="text-gray-300">
            For large results, stream instead of buffering:
          </p>

          <div className="bg-gray-900 rounded-lg p-4 my-6 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`@server.tool()
async def stream_large_file(path: str):
    async def generate():
        async with aiofiles.open(path, 'r') as f:
            async for line in f:
                yield line
    
    return StreamingResponse(generate())`}
            </pre>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Timeout Handling</h2>

          <p className="text-gray-300">
            Don't let slow operations hang forever:
          </p>

          <div className="bg-gray-900 rounded-lg p-4 my-6 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`import asyncio

@server.tool()
async def fetch_with_timeout(url: str):
    try:
        return await asyncio.wait_for(
            fetch(url),
            timeout=5.0  # 5 second timeout
        )
    except asyncio.TimeoutError:
        return {"error": "Request timed out"}`}
            </pre>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Benchmarking</h2>

          <p className="text-gray-300">
            Measure before optimizing:
          </p>

          <div className="bg-gray-900 rounded-lg p-4 my-6 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`import time
import statistics

async def benchmark_tool(tool_func, iterations=100):
    times = []
    for _ in range(iterations):
        start = time.perf_counter()
        await tool_func()
        times.append(time.perf_counter() - start)
    
    return {
        "mean": statistics.mean(times) * 1000,  # ms
        "median": statistics.median(times) * 1000,
        "p95": sorted(times)[int(iterations * 0.95)] * 1000,
        "min": min(times) * 1000,
        "max": max(times) * 1000,
    }`}
            </pre>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Target Metrics</h2>

          <div className="bg-gray-900 rounded-lg p-6 my-8">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="font-bold text-orange-500">Metric</div>
              <div className="font-bold text-orange-500">Target</div>
              <div className="font-bold text-orange-500">Acceptable</div>
              
              <div className="text-gray-300">Tool latency (p50)</div>
              <div className="text-gray-300">&lt;100ms</div>
              <div className="text-gray-300">&lt;500ms</div>
              
              <div className="text-gray-300">Tool latency (p95)</div>
              <div className="text-gray-300">&lt;500ms</div>
              <div className="text-gray-300">&lt;2s</div>
              
              <div className="text-gray-300">Memory per request</div>
              <div className="text-gray-300">&lt;10MB</div>
              <div className="text-gray-300">&lt;50MB</div>
              
              <div className="text-gray-300">Connections reused</div>
              <div className="text-gray-300">&gt;90%</div>
              <div className="text-gray-300">&gt;70%</div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Performance Checklist</h2>

          <div className="bg-gray-900 rounded-lg p-6 my-8">
            <ul className="text-gray-300 space-y-2">
              <li>☐ All I/O operations are async</li>
              <li>☐ Connection pools for HTTP and database</li>
              <li>☐ Caching for repeated queries (TTL appropriate)</li>
              <li>☐ Batch operations where possible</li>
              <li>☐ Timeouts on all external calls</li>
              <li>☐ Streaming for large responses</li>
              <li>☐ Profiled and benchmarked critical paths</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Next Steps</h2>

          <div className="bg-gray-900 rounded-lg p-6 my-8">
            <ul className="text-gray-300 space-y-2">
              <li>→ <a href="/mcp/testing-mcp-servers" className="text-orange-500 hover:underline">Testing MCP Servers</a> — Load testing approaches</li>
              <li>→ <a href="/mcp/mcp-error-handling-patterns" className="text-orange-500 hover:underline">MCP Error Handling Patterns</a> — Graceful degradation</li>
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
