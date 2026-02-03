import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Deploying MCP Servers to Production | Kai Gritun',
  description: 'Complete guide to deploying MCP servers: Docker, Kubernetes, health checks, monitoring, scaling, and CI/CD pipelines.',
  keywords: ['MCP deployment', 'MCP production', 'MCP Docker', 'MCP Kubernetes', 'MCP scaling', 'MCP CI/CD'],
  openGraph: {
    title: 'Deploying MCP Servers to Production',
    description: 'From development to production: containerization, scaling, monitoring, and CI/CD.',
    type: 'article',
  },
}

export default function MCPProductionDeployment() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <article className="max-w-4xl mx-auto px-6 py-16">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
            <a href="/mcp" className="hover:text-zinc-300">MCP Tutorials</a>
            <span>/</span>
            <a href="/mcp/guides" className="hover:text-zinc-300">Guides</a>
            <span>/</span>
            <span>Production Deployment</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Deploying MCP Servers to Production
          </h1>
          <p className="text-xl text-zinc-400">
            From development to production with confidence: containerization, scaling, monitoring, and CI/CD.
          </p>
          <div className="flex items-center gap-4 mt-6 text-sm text-zinc-500">
            <span>~15 min read</span>
            <span>•</span>
            <span>DevOps</span>
            <span>•</span>
            <span>Production</span>
          </div>
        </header>

        <div className="prose prose-invert prose-zinc max-w-none">
          <p className="text-lg text-zinc-300">
            Moving your MCP server from development to production requires careful planning around 
            security, scalability, and reliability. This guide covers everything you need to deploy with confidence.
          </p>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold mt-0">What You&apos;ll Learn</h3>
            <ul className="mb-0">
              <li>Deployment architecture options</li>
              <li>Containerization with Docker</li>
              <li>Kubernetes deployment</li>
              <li>Health checks and monitoring</li>
              <li>Scaling strategies</li>
              <li>CI/CD pipeline setup</li>
            </ul>
          </div>

          <h2 id="architecture">Deployment Architecture Options</h2>

          <h3>Option 1: Sidecar (Recommended for Single-Tenant)</h3>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`┌─────────────────────────────────────────────┐
│              Application Pod                 │
│  ┌─────────────┐     ┌─────────────────┐   │
│  │ LLM Client  │────▶│  MCP Server     │   │
│  │ (stdio)     │     │  (subprocess)   │   │
│  └─────────────┘     └─────────────────┘   │
└─────────────────────────────────────────────┘`}</code>
          </pre>

          <p>Best for: Desktop apps, single-user services, secure environments.</p>

          <h3>Option 2: Standalone Service (Multi-Tenant)</h3>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ LLM Client 1 │────▶│              │────▶│ Database     │
└──────────────┘     │  MCP Server  │     └──────────────┘
┌──────────────┐     │  (HTTP/SSE)  │     ┌──────────────┐
│ LLM Client 2 │────▶│              │────▶│ External API │
└──────────────┘     └──────────────┘     └──────────────┘`}</code>
          </pre>

          <p>Best for: Multi-user platforms, shared infrastructure, API-based access.</p>

          <h3>Option 3: Serverless</h3>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ LLM Client   │────▶│ API Gateway  │────▶│ Lambda/CF    │
│              │     │              │     │ (MCP Server) │
└──────────────┘     └──────────────┘     └──────────────┘`}</code>
          </pre>

          <p>Best for: Bursty workloads, cost optimization, stateless tools.</p>

          <h2 id="docker">Containerization</h2>

          <h3>Dockerfile for Python MCP Server</h3>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`FROM python:3.11-slim

WORKDIR /app

# Security: non-root user
RUN useradd -m -u 1000 mcp
USER mcp

# Dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Application
COPY --chown=mcp:mcp . .

# Health check
HEALTHCHECK --interval=30s --timeout=3s \\
  CMD python -c "import socket; s=socket.socket(); s.connect(('localhost', 8080))"

EXPOSE 8080

CMD ["python", "-m", "mcp_server", "--port", "8080"]`}</code>
          </pre>

          <h3>Docker Compose for Development</h3>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`version: '3.8'

services:
  mcp-server:
    build: .
    ports:
      - "8080:8080"
    environment:
      - LOG_LEVEL=debug
      - DATABASE_URL=postgresql://db:5432/mcp
    depends_on:
      - db
    restart: unless-stopped
    
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: mcp
      POSTGRES_PASSWORD: dev_only
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:`}</code>
          </pre>

          <h2 id="kubernetes">Kubernetes Deployment</h2>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`apiVersion: apps/v1
kind: Deployment
metadata:
  name: mcp-server
spec:
  replicas: 3
  selector:
    matchLabels:
      app: mcp-server
  template:
    metadata:
      labels:
        app: mcp-server
    spec:
      containers:
      - name: mcp-server
        image: your-registry/mcp-server:v1.0.0
        ports:
        - containerPort: 8080
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
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: mcp-secrets
              key: database-url
---
apiVersion: v1
kind: Service
metadata:
  name: mcp-server
spec:
  selector:
    app: mcp-server
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP`}</code>
          </pre>

          <h2 id="secrets">Environment Configuration</h2>

          <h3>Secure Secret Management</h3>

          <p>Never hardcode secrets. Use environment variables with a secrets manager:</p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`import os
from functools import lru_cache

@lru_cache()
def get_config():
    return {
        "database_url": os.environ["DATABASE_URL"],
        "api_key": os.environ.get("API_KEY"),
        "log_level": os.environ.get("LOG_LEVEL", "info"),
        "allowed_origins": os.environ.get("ALLOWED_ORIGINS", "").split(","),
    }`}</code>
          </pre>

          <h3>AWS Secrets Manager Integration</h3>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`import boto3
import json

def get_secrets():
    client = boto3.client('secretsmanager')
    response = client.get_secret_value(SecretId='mcp-server-secrets')
    return json.loads(response['SecretString'])`}</code>
          </pre>

          <h2 id="health-checks">Health Checks</h2>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`from fastapi import FastAPI
from datetime import datetime

app = FastAPI()
start_time = datetime.now()

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "uptime_seconds": (datetime.now() - start_time).total_seconds()
    }

@app.get("/ready")
async def readiness_check():
    # Check dependencies
    db_ok = await check_database()
    cache_ok = await check_cache()
    
    if db_ok and cache_ok:
        return {"status": "ready"}
    else:
        return {"status": "not ready"}, 503`}</code>
          </pre>

          <h2 id="scaling">Scaling Considerations</h2>

          <h3>Horizontal Scaling</h3>

          <p>MCP servers should be stateless for easy horizontal scaling:</p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`# Bad: In-memory state
class MCPServer:
    def __init__(self):
        self.user_data = {}  # Lost on restart!

# Good: External state
class MCPServer:
    def __init__(self, redis_client):
        self.redis = redis_client
    
    async def get_user_data(self, user_id):
        return await self.redis.get(f"user:{user_id}")`}</code>
          </pre>

          <h3>Connection Pooling</h3>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`from asyncpg import create_pool

async def init_db():
    return await create_pool(
        dsn=os.environ["DATABASE_URL"],
        min_size=5,
        max_size=20,
        command_timeout=30
    )`}</code>
          </pre>

          <h3>Rate Limiting</h3>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`from fastapi import Request
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/tools/{tool_name}")
@limiter.limit("100/minute")
async def call_tool(request: Request, tool_name: str):
    # Tool execution
    pass`}</code>
          </pre>

          <h2 id="monitoring">Monitoring Setup</h2>

          <h3>Prometheus Metrics</h3>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`from prometheus_client import Counter, Histogram, start_http_server

TOOL_CALLS = Counter('mcp_tool_calls_total', 'Total tool calls', ['tool_name', 'status'])
TOOL_LATENCY = Histogram('mcp_tool_latency_seconds', 'Tool call latency', ['tool_name'])

@server.call_tool()
async def handle_tool_call(name: str, arguments: dict):
    with TOOL_LATENCY.labels(tool_name=name).time():
        try:
            result = await execute_tool(name, arguments)
            TOOL_CALLS.labels(tool_name=name, status='success').inc()
            return result
        except Exception:
            TOOL_CALLS.labels(tool_name=name, status='error').inc()
            raise

# Start metrics server
start_http_server(9090)`}</code>
          </pre>

          <h3>Structured Logging</h3>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`import structlog

logger = structlog.get_logger()

@server.call_tool()
async def handle_tool_call(name: str, arguments: dict):
    logger.info("tool_call_started", tool=name, args=arguments)
    
    try:
        result = await execute_tool(name, arguments)
        logger.info("tool_call_completed", tool=name, success=True)
        return result
    except Exception as e:
        logger.error("tool_call_failed", tool=name, error=str(e))
        raise`}</code>
          </pre>

          <h2 id="cicd">CI/CD Pipeline</h2>

          <h3>GitHub Actions Example</h3>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`name: Deploy MCP Server

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: pip install -r requirements.txt
      - run: pytest tests/

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build and push Docker image
        run: |
          docker build -t your-registry/mcp-server:\${{ github.sha }} .
          docker push your-registry/mcp-server:\${{ github.sha }}
      
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/mcp-server \\
            mcp-server=your-registry/mcp-server:\${{ github.sha }}`}</code>
          </pre>

          <div className="bg-amber-950 border border-amber-800 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold mt-0 text-amber-300">Pre-Launch Checklist</h3>
            <ul className="mb-0">
              <li>☐ All secrets in secret manager (not env vars or code)</li>
              <li>☐ Health and readiness endpoints implemented</li>
              <li>☐ Logging with request IDs for tracing</li>
              <li>☐ Metrics exported (Prometheus/CloudWatch)</li>
              <li>☐ Rate limiting configured</li>
              <li>☐ Resource limits set in container/K8s</li>
              <li>☐ Horizontal pod autoscaling enabled</li>
              <li>☐ Database connection pooling configured</li>
              <li>☐ Graceful shutdown handling</li>
              <li>☐ Error responses don&apos;t leak internals</li>
              <li>☐ CI/CD pipeline with tests</li>
            </ul>
          </div>

          <div className="border-t border-zinc-800 mt-12 pt-8">
            <h3 className="text-lg font-semibold">Related Guides</h3>
            <ul>
              <li><a href="/mcp/security-best-practices" className="text-blue-400 hover:text-blue-300">MCP Security Best Practices</a></li>
              <li><a href="/mcp/guides/mcp-error-handling" className="text-blue-400 hover:text-blue-300">MCP Error Handling Best Practices</a></li>
              <li><a href="/mcp/observability-monitoring" className="text-blue-400 hover:text-blue-300">MCP Observability & Monitoring</a></li>
            </ul>
          </div>
        </div>
      </article>
    </main>
  )
}
