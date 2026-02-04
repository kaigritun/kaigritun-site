import Link from "next/link";
import type { Metadata } from "next";
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: "MCP Caching Strategies: Making Your Servers Fast | Kai Gritun",
  description: "Learn caching strategies for MCP servers. In-memory, Redis, request deduplication, and tiered caching to cut response times by 90%.",
  keywords: ["MCP caching", "MCP performance", "Model Context Protocol caching", "MCP Redis", "MCP optimization", "fast MCP servers"],
};

export default function MCPCachingStrategies() {
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
              MCP Caching Strategies: Making Your Servers Fast and Efficient
            </h1>
            <p className="text-gray-400 text-lg mb-4">
              MCP tools that hit external APIs on every call get expensive and slow. 
              Smart caching can cut response times by 90% and API costs dramatically.
            </p>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>February 4, 2026</span>
              <span>·</span>
              <span>12 min read</span>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <h2 className="text-2xl font-bold mt-12 mb-4">Why Cache in MCP Servers?</h2>
            <p>Every MCP tool call involves:</p>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Client sends request → Network latency</li>
              <li>Server processes → Compute time</li>
              <li>External API call → More latency + API costs</li>
              <li>Response back to client → Network latency</li>
            </ol>
            <p>Caching eliminates step 3 for repeated queries.</p>

            <h2 className="text-2xl font-bold mt-12 mb-4">Pattern 1: In-Memory Caching</h2>
            <p>Fastest option for single-server deployments.</p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`from datetime import datetime, timedelta

class CachedMCPServer:
    def __init__(self):
        self._cache = {}
        self._cache_ttl = {}
    
    def cache_get(self, key, ttl_seconds=300):
        """Get from cache if not expired"""
        if key in self._cache:
            if datetime.utcnow() < self._cache_ttl[key]:
                return self._cache[key]
            else:
                del self._cache[key]
                del self._cache_ttl[key]
        return None
    
    def cache_set(self, key, value, ttl_seconds=300):
        """Set with TTL"""
        self._cache[key] = value
        self._cache_ttl[key] = datetime.utcnow() + timedelta(seconds=ttl_seconds)
    
    @tool
    async def get_weather(self, city: str):
        """Get weather with caching"""
        cache_key = f"weather:{city.lower()}"
        
        cached = self.cache_get(cache_key)
        if cached:
            return {"data": cached, "cached": True}
        
        # Fetch from API
        weather = await self.fetch_weather_api(city)
        self.cache_set(cache_key, weather, ttl_seconds=1800)  # 30 min
        
        return {"data": weather, "cached": False}`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">Pattern 2: Redis Distributed Cache</h2>
            <p>For multi-server deployments or persistent caching.</p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`import redis
import json
from typing import Optional

class RedisCachedMCP:
    def __init__(self, redis_url="redis://localhost:6379"):
        self.redis = redis.from_url(redis_url)
    
    def cache_get(self, key: str) -> Optional[dict]:
        data = self.redis.get(key)
        return json.loads(data) if data else None
    
    def cache_set(self, key: str, value: dict, ttl_seconds: int = 300):
        self.redis.setex(key, ttl_seconds, json.dumps(value))
    
    def cache_invalidate(self, pattern: str):
        """Invalidate all keys matching pattern"""
        for key in self.redis.scan_iter(match=pattern):
            self.redis.delete(key)`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">Pattern 3: Request Deduplication</h2>
            <p>Prevent duplicate API calls for concurrent identical requests.</p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`import asyncio

class DeduplicatingCache:
    def __init__(self):
        self._pending = {}
        self._cache = {}
    
    async def get_or_fetch(self, key: str, fetch_fn):
        # Return cached if available
        if key in self._cache:
            return self._cache[key]
        
        # If request already pending, wait for it
        if key in self._pending:
            return await self._pending[key]
        
        # Create pending future
        self._pending[key] = asyncio.create_task(fetch_fn())
        
        try:
            result = await self._pending[key]
            self._cache[key] = result
            return result
        finally:
            del self._pending[key]`}</code>
            </pre>
            <p><strong>Use case:</strong> 10 concurrent users ask for the same data → 1 API call instead of 10.</p>

            <h2 className="text-2xl font-bold mt-12 mb-4">Pattern 4: Tiered Caching</h2>
            <p>Combine fast local cache with persistent distributed cache.</p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`class TieredCache:
    def __init__(self, redis_url):
        self.local = {}
        self.local_ttl = {}
        self.redis = redis.from_url(redis_url)
    
    async def get(self, key):
        # L1: Local memory (fastest)
        if key in self.local and datetime.utcnow() < self.local_ttl[key]:
            return self.local[key]
        
        # L2: Redis (persistent)
        data = self.redis.get(key)
        if data:
            value = json.loads(data)
            # Populate L1
            self.local[key] = value
            self.local_ttl[key] = datetime.utcnow() + timedelta(seconds=60)
            return value
        
        return None`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">Cache Invalidation Strategies</h2>
            <p>The hard part of caching is knowing when to clear it.</p>
            
            <h3 className="text-xl font-semibold mt-8 mb-3">Time-Based (TTL)</h3>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`# Short TTL for frequently changing data
cache_set("stock_price:AAPL", price, ttl_seconds=60)

# Long TTL for stable data
cache_set("company_info:AAPL", info, ttl_seconds=86400)`}</code>
            </pre>

            <h3 className="text-xl font-semibold mt-8 mb-3">Event-Based</h3>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`@tool
async def update_user_profile(self, user_id: str, data: dict):
    # Update database
    await self.db.update_user(user_id, data)
    
    # Invalidate related caches
    self.cache_invalidate(f"user:{user_id}:*")
    self.cache_invalidate(f"profile:{user_id}")`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">Caching Best Practices</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li><strong>Cache the right layer</strong> - Cache API responses, not processed results</li>
              <li><strong>Use consistent key formats</strong> - <code className="bg-gray-800 px-1 rounded">{'{type}:{identifier}:{qualifier}'}</code></li>
              <li><strong>Set appropriate TTLs</strong> - Match data volatility</li>
              <li><strong>Monitor cache hit rates</strong> - Below 80%? Rethink your strategy</li>
              <li><strong>Handle cache failures gracefully</strong> - Fall back to direct fetch</li>
            </ol>

            <h2 className="text-2xl font-bold mt-12 mb-4">Resilient Cache Pattern</h2>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`async def resilient_get(self, key, fetch_fn):
    try:
        cached = self.cache_get(key)
        if cached:
            return cached
    except redis.ConnectionError:
        # Cache is down, proceed without it
        pass
    
    result = await fetch_fn()
    
    try:
        self.cache_set(key, result)
    except redis.ConnectionError:
        pass  # Cache write failed, but we have data
    
    return result`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">Measuring Impact</h2>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`class InstrumentedCache:
    def __init__(self):
        self.hits = 0
        self.misses = 0
    
    async def get_with_metrics(self, key, fetch_fn):
        start = time.time()
        
        cached = self.cache_get(key)
        if cached:
            self.hits += 1
            latency = time.time() - start
            logger.info(f"Cache HIT: {key} ({latency*1000:.1f}ms)")
            return cached
        
        self.misses += 1
        result = await fetch_fn()
        self.cache_set(key, result)
        
        latency = time.time() - start
        logger.info(f"Cache MISS: {key} ({latency*1000:.1f}ms)")
        return result
    
    @property
    def hit_rate(self):
        total = self.hits + self.misses
        return self.hits / total if total > 0 else 0`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">Conclusion</h2>
            <p>Start with simple in-memory caching. Add Redis when you need persistence or multiple servers. Use request deduplication for high-concurrency scenarios. Always measure—you can&apos;t improve what you don&apos;t track.</p>
          </div>

          {/* CTA */}
          <div className="mt-12 p-6 bg-gray-900 rounded-lg border border-gray-800">
            <h3 className="text-xl font-bold mb-2">Get the MCP Starter Kit</h3>
            <p className="text-gray-400 mb-4">Templates, examples, and a quickstart guide for building MCP servers.</p>
            <EmailSignup site="mcp" buttonText="Download Free Kit" />
          </div>

          {/* Related */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <h3 className="text-xl font-bold mb-4">Related Tutorials</h3>
            <div className="grid gap-4">
              <Link href="/mcp/mcp-error-handling-patterns" className="block p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
                <span className="font-medium">MCP Error Handling Patterns</span>
                <p className="text-sm text-gray-400 mt-1">Build robust MCP servers that handle failures gracefully.</p>
              </Link>
              <Link href="/mcp/building-multi-tool-servers" className="block p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
                <span className="font-medium">Building Multi-Tool MCP Servers</span>
                <p className="text-sm text-gray-400 mt-1">Organize and scale servers with many tools.</p>
              </Link>
              <Link href="/mcp/testing-mcp-servers" className="block p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
                <span className="font-medium">Testing MCP Servers</span>
                <p className="text-sm text-gray-400 mt-1">Unit and integration testing strategies for MCP.</p>
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-6">
        <div className="max-w-4xl mx-auto text-center text-gray-500 text-sm">
          <p>© 2026 Kai Gritun. Building tools for developers.</p>
        </div>
      </footer>
    </div>
  );
}
