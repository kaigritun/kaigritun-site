import { Metadata } from 'next'
import Link from 'next/link'
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: 'MCP Webhooks and Event-Driven Patterns | Kai Gritun',
  description: 'Build reactive MCP servers that respond to external events with webhooks, pub/sub patterns, and real-time notifications.',
  keywords: ['MCP webhooks', 'MCP events', 'event-driven MCP', 'MCP real-time', 'MCP notifications'],
  openGraph: {
    title: 'MCP Webhooks and Event-Driven Patterns',
    description: 'Build reactive MCP servers that respond to external events with webhooks, pub/sub patterns, and real-time notifications.',
    type: 'article',
  },
}

export default function MCPWebhooksEventDriven() {
  return (
    <main className="min-h-screen bg-[#0c0c0c] text-gray-100">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <nav className="mb-12">
          <Link href="/mcp" className="text-amber-500 hover:text-amber-400 text-sm font-mono">
            ← Back to MCP Tutorials
          </Link>
        </nav>

        <div className="mb-8">
          <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">Advanced Guide</span>
          <h1 className="text-4xl font-bold mt-2 mb-4">MCP Webhooks and Event-Driven Patterns</h1>
          <p className="text-gray-400 text-lg">
            Build reactive MCP servers that respond to external events—webhooks, pub/sub, and real-time notifications.
          </p>
          <div className="flex gap-4 mt-4 text-sm text-gray-500">
            <span>20 min read</span>
            <span>•</span>
            <span>Advanced</span>
          </div>
        </div>

        <article className="prose prose-invert prose-amber max-w-none">
          <p className="lead text-xl text-gray-300">
            Most MCP tutorials show request-response patterns: the client asks, the server answers. But real applications need to react to <em>external</em> events—GitHub pushes, Stripe payments, Slack messages. This guide shows how to build event-driven MCP servers.
          </p>

          <h2>The Challenge: MCP is Pull-Based</h2>
          
          <p>
            MCP follows a request-response model. Clients (like Claude) call tools and get results. There's no built-in way for a server to "push" events to a client.
          </p>

          <p>
            But your server can <em>receive</em> events from external services (via webhooks), store them, and let clients query for new events. This creates an event-driven architecture on top of MCP.
          </p>

          <pre><code className="language-text">{`┌─────────────┐     webhook      ┌─────────────┐
│   GitHub    │ ───────────────► │  MCP Server │
│   Stripe    │                  │  (webhook   │
│   Slack     │                  │   endpoint) │
└─────────────┘                  └──────┬──────┘
                                        │
                                        │ stores events
                                        ▼
                                 ┌─────────────┐
                                 │   Events    │
                                 │    Store    │
                                 └──────┬──────┘
                                        │
                                        │ queries
                                        ▼
                                 ┌─────────────┐
                                 │   Claude    │
                                 │  (client)   │
                                 └─────────────┘`}</code></pre>

          <h2>Pattern 1: Webhook Receiver with Event Store</h2>

          <p>
            The most common pattern: your MCP server runs an HTTP endpoint that receives webhooks, stores them, and exposes tools to query events.
          </p>

          <pre><code className="language-python">{`# webhook_mcp_server.py
import asyncio
from datetime import datetime
from collections import deque
from fastmcp import FastMCP
from aiohttp import web
import json

mcp = FastMCP("Webhook Events")

# In-memory event store (use Redis/DB in production)
events = deque(maxlen=1000)
event_lock = asyncio.Lock()

# Webhook HTTP handler
async def webhook_handler(request: web.Request) -> web.Response:
    """Receive webhooks and store events."""
    try:
        data = await request.json()
        source = request.match_info.get('source', 'unknown')
        
        event = {
            'id': len(events) + 1,
            'source': source,
            'timestamp': datetime.utcnow().isoformat(),
            'payload': data,
            'headers': dict(request.headers)
        }
        
        async with event_lock:
            events.append(event)
        
        return web.json_response({'status': 'received', 'event_id': event['id']})
    except Exception as e:
        return web.json_response({'error': str(e)}, status=400)

# MCP Tools to query events
@mcp.tool()
async def get_recent_events(
    limit: int = 10,
    source: str | None = None
) -> list[dict]:
    """Get recent webhook events, optionally filtered by source."""
    async with event_lock:
        filtered = list(events)
    
    if source:
        filtered = [e for e in filtered if e['source'] == source]
    
    return filtered[-limit:]

@mcp.tool()
async def get_event_by_id(event_id: int) -> dict | None:
    """Get a specific event by ID."""
    async with event_lock:
        for event in events:
            if event['id'] == event_id:
                return event
    return None

@mcp.tool()
async def get_events_since(timestamp: str, source: str | None = None) -> list[dict]:
    """Get all events since a timestamp (ISO format)."""
    since = datetime.fromisoformat(timestamp)
    async with event_lock:
        filtered = [
            e for e in events 
            if datetime.fromisoformat(e['timestamp']) > since
        ]
    
    if source:
        filtered = [e for e in filtered if e['source'] == source]
    
    return filtered

@mcp.tool()
async def get_event_sources() -> list[str]:
    """List all unique event sources."""
    async with event_lock:
        return list(set(e['source'] for e in events))

# Run both MCP and webhook server
async def run_webhook_server():
    """Run the webhook HTTP server."""
    app = web.Application()
    app.router.add_post('/webhook/{source}', webhook_handler)
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, 'localhost', 8080)
    await site.start()
    print("Webhook server running on http://localhost:8080/webhook/{source}")
    
    # Keep running
    while True:
        await asyncio.sleep(3600)

async def main():
    # Run both servers concurrently
    await asyncio.gather(
        mcp.run_async(),      # MCP on stdio
        run_webhook_server()  # HTTP on port 8080
    )

if __name__ == "__main__":
    asyncio.run(main())`}</code></pre>

          <h3>Configure with ngrok for External Webhooks</h3>

          <p>
            For external services to reach your local server, use ngrok:
          </p>

          <pre><code className="language-bash">{`# Terminal 1: Run MCP server
python webhook_mcp_server.py

# Terminal 2: Expose webhook endpoint
ngrok http 8080

# Use the ngrok URL for webhook configuration
# https://abc123.ngrok.io/webhook/github
# https://abc123.ngrok.io/webhook/stripe`}</code></pre>

          <h2>Pattern 2: GitHub Integration</h2>

          <p>
            A practical example: build an MCP server that tracks GitHub events (pushes, PRs, issues) and lets Claude summarize activity.
          </p>

          <pre><code className="language-python">{`# github_events_mcp.py
import hashlib
import hmac
from fastmcp import FastMCP
from aiohttp import web
from datetime import datetime, timedelta
from collections import defaultdict
import json

mcp = FastMCP("GitHub Events")

# Configuration
WEBHOOK_SECRET = os.environ.get("GITHUB_WEBHOOK_SECRET", "")

# Event storage by repo
events_by_repo: dict[str, list] = defaultdict(list)
MAX_EVENTS_PER_REPO = 500

def verify_github_signature(payload: bytes, signature: str) -> bool:
    """Verify GitHub webhook signature."""
    if not WEBHOOK_SECRET:
        return True  # Skip verification if no secret
    
    expected = 'sha256=' + hmac.new(
        WEBHOOK_SECRET.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(expected, signature)

async def github_webhook(request: web.Request) -> web.Response:
    """Handle GitHub webhook events."""
    payload = await request.read()
    signature = request.headers.get('X-Hub-Signature-256', '')
    
    if not verify_github_signature(payload, signature):
        return web.json_response({'error': 'Invalid signature'}, status=401)
    
    event_type = request.headers.get('X-GitHub-Event', 'unknown')
    data = json.loads(payload)
    
    # Extract repo name
    repo = data.get('repository', {}).get('full_name', 'unknown')
    
    event = {
        'type': event_type,
        'timestamp': datetime.utcnow().isoformat(),
        'repo': repo,
        'data': extract_relevant_data(event_type, data)
    }
    
    events_by_repo[repo].append(event)
    if len(events_by_repo[repo]) > MAX_EVENTS_PER_REPO:
        events_by_repo[repo] = events_by_repo[repo][-MAX_EVENTS_PER_REPO:]
    
    return web.json_response({'status': 'ok'})

def extract_relevant_data(event_type: str, data: dict) -> dict:
    """Extract relevant fields based on event type."""
    if event_type == 'push':
        return {
            'branch': data.get('ref', '').replace('refs/heads/', ''),
            'commits': len(data.get('commits', [])),
            'pusher': data.get('pusher', {}).get('name'),
            'commit_messages': [c.get('message', '')[:100] for c in data.get('commits', [])[:5]]
        }
    elif event_type == 'pull_request':
        pr = data.get('pull_request', {})
        return {
            'action': data.get('action'),
            'number': pr.get('number'),
            'title': pr.get('title'),
            'user': pr.get('user', {}).get('login'),
            'state': pr.get('state'),
            'merged': pr.get('merged', False)
        }
    elif event_type == 'issues':
        issue = data.get('issue', {})
        return {
            'action': data.get('action'),
            'number': issue.get('number'),
            'title': issue.get('title'),
            'user': issue.get('user', {}).get('login'),
            'state': issue.get('state')
        }
    else:
        return {'action': data.get('action')}

# MCP Tools
@mcp.tool()
async def list_tracked_repos() -> list[str]:
    """List all repositories with tracked events."""
    return list(events_by_repo.keys())

@mcp.tool()
async def get_repo_activity(
    repo: str,
    hours: int = 24,
    event_type: str | None = None
) -> dict:
    """Get repository activity summary for the last N hours."""
    cutoff = datetime.utcnow() - timedelta(hours=hours)
    
    recent = [
        e for e in events_by_repo.get(repo, [])
        if datetime.fromisoformat(e['timestamp']) > cutoff
        and (event_type is None or e['type'] == event_type)
    ]
    
    return {
        'repo': repo,
        'period_hours': hours,
        'total_events': len(recent),
        'events_by_type': count_by_type(recent),
        'recent_events': recent[-10:]
    }

def count_by_type(events: list) -> dict:
    counts = defaultdict(int)
    for e in events:
        counts[e['type']] += 1
    return dict(counts)

@mcp.tool()
async def summarize_commits(repo: str, hours: int = 24) -> dict:
    """Summarize recent commits for a repository."""
    cutoff = datetime.utcnow() - timedelta(hours=hours)
    
    pushes = [
        e for e in events_by_repo.get(repo, [])
        if e['type'] == 'push' and datetime.fromisoformat(e['timestamp']) > cutoff
    ]
    
    total_commits = sum(e['data'].get('commits', 0) for e in pushes)
    contributors = set(e['data'].get('pusher') for e in pushes if e['data'].get('pusher'))
    
    messages = []
    for push in pushes:
        messages.extend(push['data'].get('commit_messages', []))
    
    return {
        'repo': repo,
        'period_hours': hours,
        'total_pushes': len(pushes),
        'total_commits': total_commits,
        'contributors': list(contributors),
        'recent_messages': messages[-20:]
    }

@mcp.tool()
async def get_pr_activity(repo: str, hours: int = 24) -> dict:
    """Get pull request activity for a repository."""
    cutoff = datetime.utcnow() - timedelta(hours=hours)
    
    prs = [
        e for e in events_by_repo.get(repo, [])
        if e['type'] == 'pull_request' and datetime.fromisoformat(e['timestamp']) > cutoff
    ]
    
    by_action = defaultdict(list)
    for pr in prs:
        action = pr['data'].get('action', 'unknown')
        by_action[action].append({
            'number': pr['data'].get('number'),
            'title': pr['data'].get('title'),
            'user': pr['data'].get('user')
        })
    
    return {
        'repo': repo,
        'period_hours': hours,
        'total_pr_events': len(prs),
        'by_action': dict(by_action)
    }`}</code></pre>

          <h2>Pattern 3: Pub/Sub with Redis</h2>

          <p>
            For higher scale and multiple MCP server instances, use Redis pub/sub:
          </p>

          <pre><code className="language-python">{`# pubsub_mcp_server.py
import redis.asyncio as redis
import asyncio
import json
from fastmcp import FastMCP
from datetime import datetime

mcp = FastMCP("PubSub Events")

# Redis connection
redis_client: redis.Redis | None = None
event_buffer: list[dict] = []
buffer_lock = asyncio.Lock()

async def init_redis():
    global redis_client
    redis_client = redis.Redis(host='localhost', port=6379, decode_responses=True)

async def subscribe_to_channels():
    """Subscribe to Redis channels and buffer events."""
    pubsub = redis_client.pubsub()
    await pubsub.subscribe('events:github', 'events:stripe', 'events:slack')
    
    async for message in pubsub.listen():
        if message['type'] == 'message':
            event = {
                'channel': message['channel'],
                'data': json.loads(message['data']),
                'timestamp': datetime.utcnow().isoformat()
            }
            async with buffer_lock:
                event_buffer.append(event)
                # Keep last 1000 events
                if len(event_buffer) > 1000:
                    event_buffer.pop(0)

# MCP Tools
@mcp.tool()
async def get_recent_events(channel: str | None = None, limit: int = 20) -> list[dict]:
    """Get recent events from the pub/sub buffer."""
    async with buffer_lock:
        filtered = event_buffer.copy()
    
    if channel:
        filtered = [e for e in filtered if channel in e['channel']]
    
    return filtered[-limit:]

@mcp.tool()
async def publish_event(channel: str, event_data: dict) -> dict:
    """Publish an event to a channel."""
    message = json.dumps({
        'source': 'mcp',
        'timestamp': datetime.utcnow().isoformat(),
        **event_data
    })
    
    await redis_client.publish(f'events:{channel}', message)
    return {'status': 'published', 'channel': channel}

@mcp.tool()
async def get_channel_stats() -> dict:
    """Get event counts by channel."""
    async with buffer_lock:
        stats = {}
        for event in event_buffer:
            ch = event['channel']
            stats[ch] = stats.get(ch, 0) + 1
    return stats

async def main():
    await init_redis()
    
    # Run subscriber and MCP server concurrently
    await asyncio.gather(
        subscribe_to_channels(),
        mcp.run_async()
    )

if __name__ == "__main__":
    asyncio.run(main())`}</code></pre>

          <h2>Pattern 4: Long-Polling for "Real-Time" Events</h2>

          <p>
            While MCP doesn't support server push, you can implement long-polling where the tool waits for new events:
          </p>

          <pre><code className="language-python">{`@mcp.tool()
async def wait_for_event(
    source: str | None = None,
    timeout_seconds: int = 30
) -> dict | None:
    """
    Wait for the next event, with optional source filter.
    Returns the event or None if timeout.
    """
    start = datetime.utcnow()
    initial_count = len(events)
    
    while (datetime.utcnow() - start).seconds < timeout_seconds:
        async with event_lock:
            if len(events) > initial_count:
                # New event arrived
                new_events = list(events)[initial_count:]
                if source:
                    new_events = [e for e in new_events if e['source'] == source]
                if new_events:
                    return new_events[0]
                initial_count = len(events)
        
        await asyncio.sleep(0.5)  # Poll interval
    
    return None  # Timeout

@mcp.tool()
async def subscribe_to_events(
    sources: list[str],
    callback_description: str
) -> dict:
    """
    Register interest in events from specific sources.
    The callback_description tells Claude what to do when events arrive.
    
    Example: subscribe_to_events(
        sources=['github', 'stripe'],
        callback_description='Summarize new commits and notify about payments'
    )
    """
    # Store subscription (Claude will poll using wait_for_event)
    return {
        'subscribed': sources,
        'instruction': f'Use wait_for_event(source) to poll for events. {callback_description}'
    }`}</code></pre>

          <h2>Pattern 5: Event-Triggered Actions</h2>

          <p>
            Build servers that take action based on events. This example processes Stripe webhooks and creates tasks:
          </p>

          <pre><code className="language-python">{`# stripe_events_mcp.py
import stripe
from fastmcp import FastMCP
from aiohttp import web
import os

mcp = FastMCP("Stripe Events")
stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")
WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET")

# Processed events and actions
processed_events: list[dict] = []
pending_actions: list[dict] = []

async def stripe_webhook(request: web.Request) -> web.Response:
    """Handle Stripe webhook events."""
    payload = await request.read()
    sig = request.headers.get('Stripe-Signature')
    
    try:
        event = stripe.Webhook.construct_event(payload, sig, WEBHOOK_SECRET)
    except Exception as e:
        return web.json_response({'error': str(e)}, status=400)
    
    # Process based on event type
    processed = process_stripe_event(event)
    processed_events.append(processed)
    
    return web.json_response({'status': 'ok'})

def process_stripe_event(event: stripe.Event) -> dict:
    """Process Stripe event and queue actions."""
    result = {
        'event_id': event.id,
        'type': event.type,
        'timestamp': event.created,
        'actions': []
    }
    
    if event.type == 'checkout.session.completed':
        session = event.data.object
        result['actions'].append({
            'type': 'send_welcome_email',
            'customer_email': session.customer_email,
            'amount': session.amount_total / 100
        })
        pending_actions.append(result['actions'][-1])
        
    elif event.type == 'invoice.payment_failed':
        invoice = event.data.object
        result['actions'].append({
            'type': 'send_payment_failed_email',
            'customer_id': invoice.customer,
            'amount': invoice.amount_due / 100
        })
        pending_actions.append(result['actions'][-1])
        
    elif event.type == 'customer.subscription.deleted':
        sub = event.data.object
        result['actions'].append({
            'type': 'send_churm_survey',
            'customer_id': sub.customer,
            'plan': sub.items.data[0].price.id if sub.items.data else None
        })
        pending_actions.append(result['actions'][-1])
    
    return result

# MCP Tools
@mcp.tool()
async def get_pending_actions() -> list[dict]:
    """Get pending actions from Stripe events."""
    return pending_actions.copy()

@mcp.tool()
async def mark_action_complete(action_type: str, details: str) -> dict:
    """Mark a pending action as completed."""
    global pending_actions
    
    for i, action in enumerate(pending_actions):
        if action['type'] == action_type:
            completed = pending_actions.pop(i)
            return {
                'status': 'completed',
                'action': completed,
                'details': details
            }
    
    return {'status': 'not_found'}

@mcp.tool()
async def get_recent_stripe_events(limit: int = 20) -> list[dict]:
    """Get recent processed Stripe events."""
    return processed_events[-limit:]

@mcp.tool()
async def get_event_summary(hours: int = 24) -> dict:
    """Summarize Stripe events by type."""
    from datetime import datetime, timedelta
    import time
    
    cutoff = time.time() - (hours * 3600)
    recent = [e for e in processed_events if e['timestamp'] > cutoff]
    
    by_type = {}
    for event in recent:
        t = event['type']
        by_type[t] = by_type.get(t, 0) + 1
    
    return {
        'period_hours': hours,
        'total_events': len(recent),
        'by_type': by_type,
        'pending_actions': len(pending_actions)
    }`}</code></pre>

          <h2>Pattern 6: TypeScript Event Server</h2>

          <p>
            The same patterns work in TypeScript with the MCP SDK:
          </p>

          <pre><code className="language-typescript">{`// event-server.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import express from "express";

interface StoredEvent {
  id: number;
  source: string;
  timestamp: string;
  payload: unknown;
}

const events: StoredEvent[] = [];
let eventId = 0;

// Express webhook server
const app = express();
app.use(express.json());

app.post("/webhook/:source", (req, res) => {
  const event: StoredEvent = {
    id: ++eventId,
    source: req.params.source,
    timestamp: new Date().toISOString(),
    payload: req.body,
  };
  
  events.push(event);
  if (events.length > 1000) events.shift();
  
  res.json({ status: "received", eventId: event.id });
});

// Start webhook server
app.listen(8080, () => {
  console.error("Webhook server on http://localhost:8080");
});

// MCP Server
const server = new McpServer({
  name: "Event Server",
  version: "1.0.0",
});

server.tool(
  "get_recent_events",
  "Get recent webhook events",
  {
    limit: z.number().optional().default(10),
    source: z.string().optional(),
  },
  async ({ limit, source }) => {
    let filtered = events;
    if (source) {
      filtered = events.filter((e) => e.source === source);
    }
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(filtered.slice(-limit), null, 2),
        },
      ],
    };
  }
);

server.tool(
  "wait_for_event",
  "Wait for the next event (long-poll)",
  {
    source: z.string().optional(),
    timeoutMs: z.number().optional().default(30000),
  },
  async ({ source, timeoutMs }) => {
    const startCount = events.length;
    const deadline = Date.now() + timeoutMs;
    
    while (Date.now() < deadline) {
      if (events.length > startCount) {
        const newEvents = events.slice(startCount);
        const match = source
          ? newEvents.find((e) => e.source === source)
          : newEvents[0];
        
        if (match) {
          return {
            content: [{ type: "text", text: JSON.stringify(match, null, 2) }],
          };
        }
      }
      await new Promise((r) => setTimeout(r, 500));
    }
    
    return {
      content: [{ type: "text", text: "Timeout: no new events" }],
    };
  }
);

// Run MCP server
const transport = new StdioServerTransport();
server.connect(transport);`}</code></pre>

          <h2>Production Considerations</h2>

          <h3>Event Persistence</h3>

          <p>
            In-memory storage works for development but loses events on restart. Use a proper database:
          </p>

          <pre><code className="language-python">{`# Using SQLite for persistence
import aiosqlite

async def init_db():
    async with aiosqlite.connect('events.db') as db:
        await db.execute('''
            CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY,
                source TEXT,
                timestamp TEXT,
                payload TEXT
            )
        ''')
        await db.execute('CREATE INDEX IF NOT EXISTS idx_source ON events(source)')
        await db.execute('CREATE INDEX IF NOT EXISTS idx_timestamp ON events(timestamp)')
        await db.commit()

async def store_event(source: str, payload: dict):
    async with aiosqlite.connect('events.db') as db:
        await db.execute(
            'INSERT INTO events (source, timestamp, payload) VALUES (?, ?, ?)',
            (source, datetime.utcnow().isoformat(), json.dumps(payload))
        )
        await db.commit()

async def get_events(source: str | None = None, limit: int = 100) -> list[dict]:
    async with aiosqlite.connect('events.db') as db:
        if source:
            cursor = await db.execute(
                'SELECT * FROM events WHERE source = ? ORDER BY id DESC LIMIT ?',
                (source, limit)
            )
        else:
            cursor = await db.execute(
                'SELECT * FROM events ORDER BY id DESC LIMIT ?',
                (limit,)
            )
        rows = await cursor.fetchall()
        return [
            {'id': r[0], 'source': r[1], 'timestamp': r[2], 'payload': json.loads(r[3])}
            for r in rows
        ]`}</code></pre>

          <h3>Webhook Security</h3>

          <ul>
            <li><strong>Always verify signatures</strong> — GitHub, Stripe, Slack all sign webhooks</li>
            <li><strong>Use HTTPS</strong> — ngrok provides this automatically</li>
            <li><strong>Validate payloads</strong> — Don't trust incoming data blindly</li>
            <li><strong>Rate limit</strong> — Protect against webhook floods</li>
            <li><strong>Idempotency</strong> — Webhooks can be retried; handle duplicates</li>
          </ul>

          <pre><code className="language-python">{`# Idempotent event handling
processed_ids: set[str] = set()

async def handle_webhook(event_id: str, data: dict) -> bool:
    """Return True if event was processed, False if duplicate."""
    if event_id in processed_ids:
        return False  # Already processed
    
    processed_ids.add(event_id)
    # Actually process the event...
    
    # Clean up old IDs periodically
    if len(processed_ids) > 10000:
        # In production, use Redis with TTL instead
        pass
    
    return True`}</code></pre>

          <h3>Scaling</h3>

          <p>
            For high-volume webhooks:
          </p>

          <ul>
            <li><strong>Queue webhooks</strong> — Accept immediately, process asynchronously</li>
            <li><strong>Use Redis/Kafka</strong> — For cross-instance event sharing</li>
            <li><strong>Horizontal scaling</strong> — Multiple MCP server instances with shared state</li>
          </ul>

          <h2>Best Practices Summary</h2>

          <ol>
            <li><strong>Separate concerns</strong> — Webhook receiver, event store, MCP tools</li>
            <li><strong>Buffer events</strong> — Don't rely on clients being connected</li>
            <li><strong>Provide query tools</strong> — Let clients filter by source, time, type</li>
            <li><strong>Add summaries</strong> — Tools that aggregate and summarize are more useful than raw events</li>
            <li><strong>Handle duplicates</strong> — Webhooks retry; be idempotent</li>
            <li><strong>Secure everything</strong> — Verify signatures, use HTTPS, validate input</li>
            <li><strong>Persist events</strong> — In-memory = data loss on restart</li>
          </ol>

          <h2>Complete Example: Deployment Monitoring</h2>

          <p>
            Here's a full example combining everything—a deployment monitoring MCP server that tracks GitHub pushes and Vercel deployments:
          </p>

          <pre><code className="language-python">{`# deployment_monitor.py
"""
MCP server that monitors deployments by tracking:
- GitHub push events
- Vercel deployment webhooks
- Provides tools to query deployment status
"""

import asyncio
import hmac
import hashlib
import os
from datetime import datetime, timedelta
from collections import defaultdict
from fastmcp import FastMCP
from aiohttp import web
import aiosqlite
import json

mcp = FastMCP("Deployment Monitor")

DB_PATH = "deployments.db"
GITHUB_SECRET = os.environ.get("GITHUB_WEBHOOK_SECRET", "")
VERCEL_SECRET = os.environ.get("VERCEL_WEBHOOK_SECRET", "")

# Initialize database
async def init_db():
    async with aiosqlite.connect(DB_PATH) as db:
        await db.executescript('''
            CREATE TABLE IF NOT EXISTS pushes (
                id INTEGER PRIMARY KEY,
                repo TEXT,
                branch TEXT,
                commit_sha TEXT,
                commit_message TEXT,
                author TEXT,
                timestamp TEXT
            );
            
            CREATE TABLE IF NOT EXISTS deployments (
                id INTEGER PRIMARY KEY,
                project TEXT,
                url TEXT,
                status TEXT,
                commit_sha TEXT,
                timestamp TEXT,
                duration_ms INTEGER
            );
            
            CREATE INDEX IF NOT EXISTS idx_pushes_repo ON pushes(repo);
            CREATE INDEX IF NOT EXISTS idx_deployments_project ON deployments(project);
        ''')
        await db.commit()

# Webhook handlers
async def github_webhook(request: web.Request) -> web.Response:
    payload = await request.read()
    sig = request.headers.get('X-Hub-Signature-256', '')
    
    if GITHUB_SECRET:
        expected = 'sha256=' + hmac.new(
            GITHUB_SECRET.encode(), payload, hashlib.sha256
        ).hexdigest()
        if not hmac.compare_digest(expected, sig):
            return web.json_response({'error': 'Invalid signature'}, status=401)
    
    data = json.loads(payload)
    event_type = request.headers.get('X-GitHub-Event')
    
    if event_type == 'push':
        async with aiosqlite.connect(DB_PATH) as db:
            for commit in data.get('commits', [])[:10]:
                await db.execute('''
                    INSERT INTO pushes (repo, branch, commit_sha, commit_message, author, timestamp)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (
                    data['repository']['full_name'],
                    data['ref'].replace('refs/heads/', ''),
                    commit['id'][:7],
                    commit['message'][:200],
                    commit['author']['name'],
                    datetime.utcnow().isoformat()
                ))
            await db.commit()
    
    return web.json_response({'status': 'ok'})

async def vercel_webhook(request: web.Request) -> web.Response:
    data = await request.json()
    
    deployment = data.get('payload', {})
    status = data.get('type', '').replace('deployment.', '')
    
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute('''
            INSERT INTO deployments (project, url, status, commit_sha, timestamp, duration_ms)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            deployment.get('name', 'unknown'),
            deployment.get('url', ''),
            status,
            deployment.get('meta', {}).get('githubCommitSha', '')[:7],
            datetime.utcnow().isoformat(),
            deployment.get('buildingAt', 0)
        ))
        await db.commit()
    
    return web.json_response({'status': 'ok'})

# MCP Tools
@mcp.tool()
async def get_recent_pushes(repo: str | None = None, limit: int = 10) -> list[dict]:
    """Get recent Git pushes, optionally filtered by repo."""
    async with aiosqlite.connect(DB_PATH) as db:
        if repo:
            cursor = await db.execute(
                'SELECT * FROM pushes WHERE repo = ? ORDER BY id DESC LIMIT ?',
                (repo, limit)
            )
        else:
            cursor = await db.execute(
                'SELECT * FROM pushes ORDER BY id DESC LIMIT ?', (limit,)
            )
        rows = await cursor.fetchall()
        return [
            {'repo': r[1], 'branch': r[2], 'sha': r[3], 'message': r[4], 'author': r[5], 'time': r[6]}
            for r in rows
        ]

@mcp.tool()
async def get_recent_deployments(project: str | None = None, limit: int = 10) -> list[dict]:
    """Get recent Vercel deployments."""
    async with aiosqlite.connect(DB_PATH) as db:
        if project:
            cursor = await db.execute(
                'SELECT * FROM deployments WHERE project = ? ORDER BY id DESC LIMIT ?',
                (project, limit)
            )
        else:
            cursor = await db.execute(
                'SELECT * FROM deployments ORDER BY id DESC LIMIT ?', (limit,)
            )
        rows = await cursor.fetchall()
        return [
            {'project': r[1], 'url': r[2], 'status': r[3], 'sha': r[4], 'time': r[5]}
            for r in rows
        ]

@mcp.tool()
async def get_deployment_status(project: str) -> dict:
    """Get current deployment status for a project."""
    async with aiosqlite.connect(DB_PATH) as db:
        # Latest deployment
        cursor = await db.execute(
            'SELECT * FROM deployments WHERE project = ? ORDER BY id DESC LIMIT 1',
            (project,)
        )
        latest = await cursor.fetchone()
        
        # Count by status in last 24h
        cursor = await db.execute('''
            SELECT status, COUNT(*) FROM deployments 
            WHERE project = ? AND timestamp > ? 
            GROUP BY status
        ''', (project, (datetime.utcnow() - timedelta(hours=24)).isoformat()))
        status_counts = dict(await cursor.fetchall())
        
        return {
            'project': project,
            'latest': {
                'url': latest[2] if latest else None,
                'status': latest[3] if latest else None,
                'time': latest[5] if latest else None
            },
            'last_24h': status_counts
        }

@mcp.tool()
async def correlate_push_to_deployment(commit_sha: str) -> dict:
    """Find deployment triggered by a specific commit."""
    async with aiosqlite.connect(DB_PATH) as db:
        # Find the push
        cursor = await db.execute(
            'SELECT * FROM pushes WHERE commit_sha LIKE ? LIMIT 1',
            (commit_sha + '%',)
        )
        push = await cursor.fetchone()
        
        # Find related deployment
        cursor = await db.execute(
            'SELECT * FROM deployments WHERE commit_sha LIKE ? ORDER BY id DESC LIMIT 1',
            (commit_sha + '%',)
        )
        deployment = await cursor.fetchone()
        
        return {
            'push': {'repo': push[1], 'message': push[4], 'author': push[5]} if push else None,
            'deployment': {'project': deployment[1], 'status': deployment[3], 'url': deployment[2]} if deployment else None
        }

# Run servers
async def run_webhook_server():
    app = web.Application()
    app.router.add_post('/webhook/github', github_webhook)
    app.router.add_post('/webhook/vercel', vercel_webhook)
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, 'localhost', 8080)
    await site.start()
    print("Webhook server on http://localhost:8080", file=__import__('sys').stderr)
    while True:
        await asyncio.sleep(3600)

async def main():
    await init_db()
    await asyncio.gather(
        mcp.run_async(),
        run_webhook_server()
    )

if __name__ == "__main__":
    asyncio.run(main())`}</code></pre>

          <h2>Next Steps</h2>

          <ul>
            <li><a href="/mcp/building-mcp-clients">Building MCP Clients</a> — Create clients that consume these events</li>
            <li><a href="/mcp/mcp-performance-optimization">Performance Optimization</a> — Handle high event volumes</li>
            <li><a href="/mcp/multi-tenant-mcp-architecture">Multi-Tenant Architecture</a> — Isolate events per tenant</li>
          </ul>
        </article>

        <EmailSignup />

        <div className="mt-16 pt-8 border-t border-gray-800">
          <Link href="/mcp" className="text-amber-500 hover:text-amber-400">
            ← Back to all MCP tutorials
          </Link>
        </div>
      </div>
    </main>
  )
}
