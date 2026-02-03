import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MCP Observability: Monitoring Your AI Tool Integrations | Kai Gritun',
  description: 'Complete guide to monitoring MCP servers in production: metrics, logs, distributed tracing, alerting, and cost tracking for AI integrations.',
  keywords: ['MCP monitoring', 'MCP observability', 'MCP metrics', 'MCP logging', 'MCP tracing', 'AI observability'],
  openGraph: {
    title: 'MCP Observability: Monitoring Your AI Tool Integrations',
    description: 'Complete guide to monitoring MCP servers: metrics, logs, distributed tracing, and cost tracking.',
    type: 'article',
  },
}

export default function MCPObservabilityMonitoring() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <article className="max-w-4xl mx-auto px-6 py-16">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
            <a href="/mcp" className="hover:text-zinc-300">MCP Tutorials</a>
            <span>/</span>
            <span>Operations</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            MCP Observability & Monitoring
          </h1>
          <p className="text-xl text-zinc-400">
            If you can&apos;t see what&apos;s happening in your MCP servers, you&apos;re flying blind.
          </p>
          <div className="flex items-center gap-4 mt-6 text-sm text-zinc-500">
            <span>~18 min read</span>
            <span>•</span>
            <span>Advanced</span>
            <span>•</span>
            <span>Operations</span>
          </div>
        </header>

        <div className="prose prose-invert prose-zinc max-w-none">
          <p className="text-lg text-zinc-300">
            You built an MCP server. It&apos;s running in production. Now what? This guide covers 
            the three pillars of observability—metrics, logs, and traces—adapted for AI tool integrations.
          </p>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold mt-0">What You&apos;ll Learn</h3>
            <ul className="mb-0">
              <li>Why MCP needs special monitoring</li>
              <li>Implementing metrics for tool calls</li>
              <li>Structured logging for AI interactions</li>
              <li>Distributed tracing across tool chains</li>
              <li>Alerting strategies</li>
              <li>Cost attribution and tracking</li>
            </ul>
          </div>

          <h2 id="why-mcp-special">Why MCP Needs Special Monitoring</h2>
          
          <p>
            Traditional API monitoring tracks request/response metrics. MCP monitoring needs more because:
          </p>

          <ul>
            <li><strong>AI behavior is non-deterministic</strong> - The same prompt can trigger different tool sequences</li>
            <li><strong>Chains of calls matter</strong> - One user request might invoke 5+ tools</li>
            <li><strong>Cost accumulates quickly</strong> - API calls, compute, storage add up per interaction</li>
            <li><strong>Failures cascade</strong> - One broken tool can derail an entire conversation</li>
          </ul>

          <h2 id="metrics">Pillar 1: Metrics</h2>

          <p>Track quantitative data about your MCP server:</p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`const metrics = {
  // Tool-level metrics
  toolInvocations: new Counter({
    name: 'mcp_tool_invocations_total',
    help: 'Total tool invocations',
    labelNames: ['tool', 'status']
  }),
  
  toolDuration: new Histogram({
    name: 'mcp_tool_duration_seconds',
    help: 'Tool execution duration',
    labelNames: ['tool'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 5, 10]
  }),
  
  // Session-level metrics
  activeSession: new Gauge({
    name: 'mcp_active_sessions',
    help: 'Currently active MCP sessions'
  }),
  
  // Cost tracking
  estimatedCost: new Counter({
    name: 'mcp_estimated_cost_cents',
    help: 'Estimated cost in cents',
    labelNames: ['tool', 'resource_type']
  })
};`}</code>
          </pre>

          <p>Instrument your tool calls:</p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`const instrumentedHandler = async (toolCall) => {
  const timer = metrics.toolDuration.startTimer({ tool: toolCall.name });
  try {
    const result = await originalHandler(toolCall);
    metrics.toolInvocations.inc({ tool: toolCall.name, status: 'success' });
    return result;
  } catch (error) {
    metrics.toolInvocations.inc({ tool: toolCall.name, status: 'error' });
    throw error;
  } finally {
    timer();
  }
};`}</code>
          </pre>

          <p>Key metrics to track:</p>
          <ul>
            <li><strong>Tool invocation rate</strong> - Which tools are hot?</li>
            <li><strong>Error rate per tool</strong> - Which tools are failing?</li>
            <li><strong>Latency percentiles</strong> - p50, p95, p99 per tool</li>
            <li><strong>Cost per session</strong> - Are some users expensive?</li>
            <li><strong>Active sessions</strong> - Capacity planning</li>
          </ul>

          <h2 id="logs">Pillar 2: Logs</h2>

          <p>Structured logging for debugging and audit:</p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`const logger = pino({
  level: 'info',
  formatters: {
    level: (label) => ({ level: label })
  }
});

const logToolCall = (toolCall, result, error) => {
  logger.info({
    event: 'tool_call',
    timestamp: new Date().toISOString(),
    sessionId: toolCall.context.sessionId,
    requestId: toolCall.context.requestId,
    tool: toolCall.name,
    // Don't log raw parameters - might contain PII
    parametersHash: hashObject(toolCall.parameters),
    success: !error,
    durationMs: result.durationMs,
    // Truncate large results
    resultPreview: truncate(JSON.stringify(result.data), 200),
    ...(error && { 
      errorType: error.name,
      errorMessage: error.message 
    })
  });
};`}</code>
          </pre>

          <p>Log structure matters:</p>
          <ul>
            <li><strong>Correlation IDs</strong> - Link logs across a conversation</li>
            <li><strong>Session context</strong> - Who, when, what model</li>
            <li><strong>Sanitized parameters</strong> - Hash or redact sensitive data</li>
            <li><strong>Timing information</strong> - Queue time, execution time</li>
          </ul>

          <h2 id="traces">Pillar 3: Traces</h2>

          <p>Distributed tracing shows the full picture:</p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`import { trace, SpanStatusCode } from '@opentelemetry/api';

const tracer = trace.getTracer('mcp-server');

const tracedHandler = async (toolCall) => {
  return tracer.startActiveSpan(\`tool:\${toolCall.name}\`, async (span) => {
    span.setAttributes({
      'mcp.tool.name': toolCall.name,
      'mcp.session.id': toolCall.context.sessionId,
      'mcp.model': toolCall.context.model
    });
    
    try {
      // If tool calls external APIs, those get child spans
      const result = await originalHandler(toolCall);
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.setStatus({ 
        code: SpanStatusCode.ERROR, 
        message: error.message 
      });
      span.recordException(error);
      throw error;
    } finally {
      span.end();
    }
  });
};`}</code>
          </pre>

          <p>Traces answer questions like:</p>
          <ul>
            <li>Why did this conversation take 30 seconds?</li>
            <li>Which external API is the bottleneck?</li>
            <li>What was the sequence of tool calls?</li>
          </ul>

          <h2 id="alerting">Alerting Strategy</h2>

          <p>Set up alerts that matter:</p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`# High error rate on critical tool
- alert: MCPToolHighErrorRate
  expr: |
    rate(mcp_tool_invocations_total{status="error"}[5m]) 
    / rate(mcp_tool_invocations_total[5m]) > 0.1
  for: 2m
  labels:
    severity: critical
  annotations:
    summary: "Tool {{ $labels.tool }} has >10% error rate"

# Latency degradation
- alert: MCPToolLatencyHigh
  expr: |
    histogram_quantile(0.95, rate(mcp_tool_duration_seconds_bucket[5m])) > 5
  for: 5m
  labels:
    severity: warning

# Cost runaway
- alert: MCPCostSpike
  expr: |
    rate(mcp_estimated_cost_cents[1h]) > 100
  labels:
    severity: warning
  annotations:
    summary: "MCP cost exceeding $1/hour"`}</code>
          </pre>

          <h2 id="dashboard">Dashboard Essentials</h2>

          <p>Your MCP dashboard should show:</p>

          <p><strong>Overview Panel:</strong></p>
          <ul>
            <li>Active sessions (real-time)</li>
            <li>Tool calls per minute (time series)</li>
            <li>Overall error rate (gauge)</li>
            <li>Estimated hourly cost</li>
          </ul>

          <p><strong>Tool Breakdown:</strong></p>
          <ul>
            <li>Invocations by tool (bar chart)</li>
            <li>Error rate by tool (table with color coding)</li>
            <li>Latency heatmap</li>
          </ul>

          <p><strong>Session Deep Dive:</strong></p>
          <ul>
            <li>Search by session ID</li>
            <li>Tool call timeline</li>
            <li>Cost breakdown</li>
            <li>Error logs</li>
          </ul>

          <h2 id="debugging">Debugging Production Issues</h2>

          <p>When something breaks:</p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`// 1. Find the problematic session
const session = await logs.search({
  query: 'status:error',
  timeRange: 'last-1h',
  groupBy: 'sessionId'
}).orderBy('count', 'desc').first();

// 2. Get the full conversation trace
const trace = await tracing.getTrace(session.traceId);

// 3. Identify the failing span
const failingSpan = trace.spans.find(s => s.status.code === 'ERROR');

// 4. Get detailed logs for that span
const logs = await logs.search({
  spanId: failingSpan.spanId
});`}</code>
          </pre>

          <h2 id="cost-tracking">Cost Attribution</h2>

          <p>Track costs back to their source:</p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`const costTracker = {
  recordCost: async (toolCall, cost) => {
    await db.costs.insert({
      sessionId: toolCall.context.sessionId,
      userId: toolCall.context.userId,
      tool: toolCall.name,
      costCents: cost,
      timestamp: new Date()
    });
  },
  
  getSessionCost: async (sessionId) => {
    return db.costs.where({ sessionId }).sum('costCents');
  },
  
  getUserMonthlyCost: async (userId) => {
    return db.costs
      .where({ userId })
      .where('timestamp', '>=', startOfMonth())
      .sum('costCents');
  }
};`}</code>
          </pre>

          <div className="bg-blue-950 border border-blue-800 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold mt-0 text-blue-300">Production Checklist</h3>
            <ul className="mb-0">
              <li>☐ Metrics exported to monitoring system (Prometheus, DataDog, etc.)</li>
              <li>☐ Structured logs flowing to aggregator (Loki, Elasticsearch, etc.)</li>
              <li>☐ Distributed tracing enabled (Jaeger, Tempo, etc.)</li>
              <li>☐ Alerts configured for error rate, latency, cost</li>
              <li>☐ Dashboard built and accessible</li>
              <li>☐ On-call runbook for common issues</li>
              <li>☐ Cost tracking per user/session</li>
              <li>☐ Log retention policy configured</li>
            </ul>
          </div>

          <h2 id="summary">Summary</h2>

          <p>
            MCP observability isn&apos;t about collecting data—it&apos;s about answering questions:
          </p>

          <ul>
            <li><strong>Is it working?</strong> → Error rate metrics</li>
            <li><strong>Is it fast enough?</strong> → Latency percentiles</li>
            <li><strong>What happened?</strong> → Logs with correlation IDs</li>
            <li><strong>Why is it slow?</strong> → Distributed traces</li>
            <li><strong>How much does it cost?</strong> → Cost attribution</li>
          </ul>

          <p>
            Instrument from day one. The production issues you can&apos;t debug are the ones you can&apos;t see.
          </p>

          <div className="border-t border-zinc-800 mt-12 pt-8">
            <h3 className="text-lg font-semibold">Related Tutorials</h3>
            <ul>
              <li><a href="/mcp/security-best-practices" className="text-blue-400 hover:text-blue-300">MCP Security Best Practices</a></li>
              <li><a href="/mcp/mcp-error-handling-patterns" className="text-blue-400 hover:text-blue-300">MCP Error Handling Patterns</a></li>
              <li><a href="/mcp/mcp-performance-optimization" className="text-blue-400 hover:text-blue-300">MCP Performance Optimization</a></li>
            </ul>
          </div>
        </div>
      </article>
    </main>
  )
}
