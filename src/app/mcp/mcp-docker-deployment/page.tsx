import { Metadata } from 'next';
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: 'MCP Docker Deployment: Containerize Your MCP Servers | MCP Tutorials',
  description: 'Learn how to containerize MCP servers with Docker. Complete guide covering Dockerfiles, docker-compose, production deployment, health checks, and orchestration.',
  keywords: ['MCP Docker', 'containerize MCP server', 'MCP deployment', 'Docker MCP', 'MCP production'],
  openGraph: {
    title: 'MCP Docker Deployment: Containerize Your MCP Servers',
    description: 'Complete guide to containerizing MCP servers with Docker for production deployment.',
    type: 'article',
  },
}

export default function MCPDockerDeployment() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <a href="/mcp" className="text-purple-400 hover:text-purple-300">← Back to MCP Tutorials</a>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 text-sm font-medium bg-blue-500/20 text-blue-300 rounded-full">DevOps</span>
            <span className="text-gray-400 text-sm">15 min read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            MCP Docker Deployment
          </h1>
          <p className="text-xl text-gray-300">
            Containerize your MCP servers for consistent, reproducible, production-ready deployments.
          </p>
        </header>

        {/* Table of Contents */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-12 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Contents</h2>
          <ul className="space-y-2 text-gray-300">
            <li><a href="#why-docker" className="hover:text-purple-400">→ Why Docker for MCP?</a></li>
            <li><a href="#python-dockerfile" className="hover:text-purple-400">→ Python MCP Server Dockerfile</a></li>
            <li><a href="#typescript-dockerfile" className="hover:text-purple-400">→ TypeScript MCP Server Dockerfile</a></li>
            <li><a href="#docker-compose" className="hover:text-purple-400">→ Docker Compose for Development</a></li>
            <li><a href="#health-checks" className="hover:text-purple-400">→ Health Checks and Monitoring</a></li>
            <li><a href="#multi-server" className="hover:text-purple-400">→ Multi-Server Architecture</a></li>
            <li><a href="#production" className="hover:text-purple-400">→ Production Deployment</a></li>
            <li><a href="#kubernetes" className="hover:text-purple-400">→ Kubernetes Orchestration</a></li>
            <li><a href="#best-practices" className="hover:text-purple-400">→ Best Practices</a></li>
          </ul>
        </div>

        {/* Article Content */}
        <article className="prose prose-invert prose-lg max-w-none">
          
          {/* Why Docker */}
          <section id="why-docker" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Why Docker for MCP?</h2>
            
            <p className="text-gray-300 mb-6">
              Running MCP servers in containers provides several key benefits:
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-2">🔄 Reproducibility</h4>
                <p className="text-gray-400 text-sm">Same environment everywhere—dev, staging, production. No "works on my machine" issues.</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-2">🔒 Isolation</h4>
                <p className="text-gray-400 text-sm">MCP servers run in isolated containers with controlled access to host resources.</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-2">📦 Dependency Management</h4>
                <p className="text-gray-400 text-sm">Bundle all dependencies in the image. No Python version conflicts or missing packages.</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-2">🚀 Easy Deployment</h4>
                <p className="text-gray-400 text-sm">Deploy to any Docker host, Kubernetes, or container service with one command.</p>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
              <p className="text-amber-200 text-sm">
                <strong>Note:</strong> MCP servers communicate via stdio by default. Docker works best with HTTP-based transports (SSE) for production deployments.
              </p>
            </div>
          </section>

          {/* Python Dockerfile */}
          <section id="python-dockerfile" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Python MCP Server Dockerfile</h2>
            
            <p className="text-gray-300 mb-6">
              Here's a production-ready Dockerfile for a Python MCP server using FastMCP:
            </p>

            <div className="bg-gray-950 rounded-lg p-6 mb-6 overflow-x-auto">
              <div className="text-xs text-gray-500 mb-2">Dockerfile</div>
              <pre className="text-sm text-gray-300"><code>{`# Build stage
FROM python:3.11-slim as builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \\
    build-essential \\
    && rm -rf /var/lib/apt/lists/*

# Create virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Production stage
FROM python:3.11-slim

WORKDIR /app

# Copy virtual environment from builder
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Create non-root user
RUN useradd --create-home --shell /bin/bash mcp
USER mcp

# Copy application code
COPY --chown=mcp:mcp . .

# Expose port for SSE transport
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \\
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1

# Run the MCP server
CMD ["python", "server.py"]`}</code></pre>
            </div>

            <p className="text-gray-300 mb-6">
              And the corresponding <code className="text-purple-400">requirements.txt</code>:
            </p>

            <div className="bg-gray-950 rounded-lg p-6 mb-6 overflow-x-auto">
              <div className="text-xs text-gray-500 mb-2">requirements.txt</div>
              <pre className="text-sm text-gray-300"><code>{`fastmcp>=0.1.0
httpx>=0.25.0
uvicorn>=0.24.0
python-dotenv>=1.0.0`}</code></pre>
            </div>

            <p className="text-gray-300 mb-6">
              Here's a minimal server that works with Docker:
            </p>

            <div className="bg-gray-950 rounded-lg p-6 mb-6 overflow-x-auto">
              <div className="text-xs text-gray-500 mb-2">server.py</div>
              <pre className="text-sm text-gray-300"><code>{`from fastmcp import FastMCP
import os

mcp = FastMCP("docker-example")

@mcp.tool()
def get_environment() -> dict:
    """Get current environment info"""
    return {
        "container_id": os.environ.get("HOSTNAME", "unknown"),
        "python_version": os.sys.version,
        "environment": os.environ.get("ENV", "development")
    }

@mcp.tool()
def process_data(data: str) -> str:
    """Process input data"""
    return f"Processed: {data.upper()}"

# Health endpoint for Docker health checks
@mcp.custom_route("/health", methods=["GET"])
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    # Use SSE transport for Docker
    mcp.run(transport="sse", host="0.0.0.0", port=8000)`}</code></pre>
            </div>

            <p className="text-gray-300 mb-6">
              Build and run:
            </p>

            <div className="bg-gray-950 rounded-lg p-6 mb-6 overflow-x-auto">
              <pre className="text-sm text-gray-300"><code>{`# Build the image
docker build -t mcp-server:latest .

# Run the container
docker run -d \\
  --name mcp-server \\
  -p 8000:8000 \\
  -e ENV=production \\
  mcp-server:latest

# Check logs
docker logs -f mcp-server`}</code></pre>
            </div>
          </section>

          {/* TypeScript Dockerfile */}
          <section id="typescript-dockerfile" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">TypeScript MCP Server Dockerfile</h2>
            
            <p className="text-gray-300 mb-6">
              For TypeScript MCP servers using the official SDK:
            </p>

            <div className="bg-gray-950 rounded-lg p-6 mb-6 overflow-x-auto">
              <div className="text-xs text-gray-500 mb-2">Dockerfile</div>
              <pre className="text-sm text-gray-300"><code>{`# Build stage
FROM node:20-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src/ ./src/

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Create non-root user
RUN addgroup -S mcp && adduser -S mcp -G mcp
USER mcp

# Copy built application
COPY --from=builder --chown=mcp:mcp /app/dist ./dist
COPY --from=builder --chown=mcp:mcp /app/node_modules ./node_modules
COPY --from=builder --chown=mcp:mcp /app/package.json ./

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \\
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "dist/index.js"]`}</code></pre>
            </div>

            <p className="text-gray-300 mb-6">
              The TypeScript server with HTTP transport:
            </p>

            <div className="bg-gray-950 rounded-lg p-6 mb-6 overflow-x-auto">
              <div className="text-xs text-gray-500 mb-2">src/index.ts</div>
              <pre className="text-sm text-gray-300"><code>{`import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";

const app = express();
const server = new Server(
  { name: "docker-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Register tools
server.setRequestHandler("tools/list", async () => ({
  tools: [{
    name: "get_info",
    description: "Get container info",
    inputSchema: { type: "object", properties: {} }
  }]
}));

server.setRequestHandler("tools/call", async (request) => {
  if (request.params.name === "get_info") {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          hostname: process.env.HOSTNAME,
          nodeVersion: process.version,
          uptime: process.uptime()
        })
      }]
    };
  }
  throw new Error("Unknown tool");
});

// Health endpoint
app.get("/health", (req, res) => {
  res.json({ status: "healthy", uptime: process.uptime() });
});

// SSE endpoint for MCP
app.get("/sse", async (req, res) => {
  const transport = new SSEServerTransport("/message", res);
  await server.connect(transport);
});

app.post("/message", express.json(), async (req, res) => {
  // Handle MCP messages
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`MCP server running on port \${PORT}\`);
});`}</code></pre>
            </div>
          </section>

          {/* Docker Compose */}
          <section id="docker-compose" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Docker Compose for Development</h2>
            
            <p className="text-gray-300 mb-6">
              Docker Compose makes it easy to run multiple MCP servers together with shared services:
            </p>

            <div className="bg-gray-950 rounded-lg p-6 mb-6 overflow-x-auto">
              <div className="text-xs text-gray-500 mb-2">docker-compose.yml</div>
              <pre className="text-sm text-gray-300"><code>{`version: '3.8'

services:
  # Python MCP server
  mcp-python:
    build:
      context: ./python-server
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - ENV=development
      - DATABASE_URL=postgres://postgres:password@db:5432/mcp
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - ./python-server:/app:ro  # Read-only mount for dev
    restart: unless-stopped
    networks:
      - mcp-network

  # TypeScript MCP server
  mcp-typescript:
    build:
      context: ./typescript-server
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis
    restart: unless-stopped
    networks:
      - mcp-network

  # Shared PostgreSQL database
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mcp
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - mcp-network

  # Redis for caching/sessions
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - mcp-network

  # MCP Gateway/Router (optional)
  gateway:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - mcp-python
      - mcp-typescript
    networks:
      - mcp-network

volumes:
  postgres_data:
  redis_data:

networks:
  mcp-network:
    driver: bridge`}</code></pre>
            </div>

            <p className="text-gray-300 mb-6">
              Start everything with:
            </p>

            <div className="bg-gray-950 rounded-lg p-6 mb-6 overflow-x-auto">
              <pre className="text-sm text-gray-300"><code>{`# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Rebuild after changes
docker-compose up -d --build`}</code></pre>
            </div>
          </section>

          {/* Health Checks */}
          <section id="health-checks" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Health Checks and Monitoring</h2>
            
            <p className="text-gray-300 mb-6">
              Proper health checks are essential for container orchestration:
            </p>

            <div className="bg-gray-950 rounded-lg p-6 mb-6 overflow-x-auto">
              <div className="text-xs text-gray-500 mb-2">server.py - Enhanced health check</div>
              <pre className="text-sm text-gray-300"><code>{`import time
from datetime import datetime
from fastmcp import FastMCP

mcp = FastMCP("monitored-server")

# Track server state
start_time = time.time()
request_count = 0

@mcp.tool()
def example_tool(input: str) -> str:
    global request_count
    request_count += 1
    return f"Processed: {input}"

@mcp.custom_route("/health", methods=["GET"])
async def health():
    """Basic health check"""
    return {"status": "healthy"}

@mcp.custom_route("/health/live", methods=["GET"])
async def liveness():
    """Kubernetes liveness probe"""
    return {"status": "alive", "timestamp": datetime.utcnow().isoformat()}

@mcp.custom_route("/health/ready", methods=["GET"])
async def readiness():
    """Kubernetes readiness probe"""
    # Add your readiness checks here
    # e.g., database connection, external service availability
    return {
        "status": "ready",
        "uptime_seconds": time.time() - start_time,
        "request_count": request_count
    }

@mcp.custom_route("/metrics", methods=["GET"])
async def metrics():
    """Prometheus-compatible metrics"""
    uptime = time.time() - start_time
    return f"""# HELP mcp_uptime_seconds Server uptime in seconds
# TYPE mcp_uptime_seconds gauge
mcp_uptime_seconds {uptime}

# HELP mcp_requests_total Total requests processed
# TYPE mcp_requests_total counter
mcp_requests_total {request_count}
"""

if __name__ == "__main__":
    mcp.run(transport="sse", host="0.0.0.0", port=8000)`}</code></pre>
            </div>
          </section>

          {/* Multi-Server Architecture */}
          <section id="multi-server" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Multi-Server Architecture</h2>
            
            <p className="text-gray-300 mb-6">
              For complex applications, use an Nginx gateway to route requests to multiple MCP servers:
            </p>

            <div className="bg-gray-950 rounded-lg p-6 mb-6 overflow-x-auto">
              <div className="text-xs text-gray-500 mb-2">nginx.conf</div>
              <pre className="text-sm text-gray-300"><code>{`events {
    worker_connections 1024;
}

http {
    upstream mcp_python {
        server mcp-python:8000;
    }

    upstream mcp_typescript {
        server mcp-typescript:3000;
    }

    server {
        listen 80;

        # Python MCP server - data processing tools
        location /api/data/ {
            proxy_pass http://mcp_python/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_buffering off;
            proxy_cache off;
        }

        # TypeScript MCP server - code analysis tools
        location /api/code/ {
            proxy_pass http://mcp_typescript/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_buffering off;
            proxy_cache off;
        }

        # SSE requires special handling
        location ~ /sse$ {
            proxy_pass http://mcp_python;
            proxy_http_version 1.1;
            proxy_set_header Connection '';
            proxy_buffering off;
            proxy_cache off;
            chunked_transfer_encoding off;
        }

        # Health check endpoint
        location /health {
            return 200 'OK';
            add_header Content-Type text/plain;
        }
    }
}`}</code></pre>
            </div>
          </section>

          {/* Production Deployment */}
          <section id="production" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Production Deployment</h2>
            
            <p className="text-gray-300 mb-6">
              Production Docker Compose with security hardening:
            </p>

            <div className="bg-gray-950 rounded-lg p-6 mb-6 overflow-x-auto">
              <div className="text-xs text-gray-500 mb-2">docker-compose.prod.yml</div>
              <pre className="text-sm text-gray-300"><code>{`version: '3.8'

services:
  mcp-server:
    image: your-registry.com/mcp-server:v1.0.0
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
      update_config:
        parallelism: 1
        delay: 10s
        failure_action: rollback
    environment:
      - ENV=production
    secrets:
      - db_password
      - api_key
    security_opt:
      - no-new-privileges:true
    read_only: true
    tmpfs:
      - /tmp
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

secrets:
  db_password:
    external: true
  api_key:
    external: true`}</code></pre>
            </div>

            <p className="text-gray-300 mb-6">
              Deploy with:
            </p>

            <div className="bg-gray-950 rounded-lg p-6 mb-6 overflow-x-auto">
              <pre className="text-sm text-gray-300"><code>{`# Create secrets
echo "your-db-password" | docker secret create db_password -
echo "your-api-key" | docker secret create api_key -

# Deploy stack
docker stack deploy -c docker-compose.prod.yml mcp

# Check status
docker stack services mcp
docker stack ps mcp`}</code></pre>
            </div>
          </section>

          {/* Kubernetes */}
          <section id="kubernetes" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Kubernetes Orchestration</h2>
            
            <p className="text-gray-300 mb-6">
              For larger deployments, Kubernetes provides advanced orchestration:
            </p>

            <div className="bg-gray-950 rounded-lg p-6 mb-6 overflow-x-auto">
              <div className="text-xs text-gray-500 mb-2">k8s/deployment.yaml</div>
              <pre className="text-sm text-gray-300"><code>{`apiVersion: apps/v1
kind: Deployment
metadata:
  name: mcp-server
  labels:
    app: mcp-server
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
          image: your-registry.com/mcp-server:v1.0.0
          ports:
            - containerPort: 8000
          env:
            - name: ENV
              value: production
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: mcp-secrets
                  key: database-url
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          livenessProbe:
            httpGet:
              path: /health/live
              port: 8000
            initialDelaySeconds: 10
            periodSeconds: 30
          readinessProbe:
            httpGet:
              path: /health/ready
              port: 8000
            initialDelaySeconds: 5
            periodSeconds: 10
          securityContext:
            runAsNonRoot: true
            readOnlyRootFilesystem: true
            allowPrivilegeEscalation: false
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
      targetPort: 8000
  type: ClusterIP
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: mcp-server-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: mcp-server
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70`}</code></pre>
            </div>

            <p className="text-gray-300 mb-6">
              Deploy to Kubernetes:
            </p>

            <div className="bg-gray-950 rounded-lg p-6 mb-6 overflow-x-auto">
              <pre className="text-sm text-gray-300"><code>{`# Create namespace
kubectl create namespace mcp

# Create secrets
kubectl create secret generic mcp-secrets \\
  --from-literal=database-url='postgres://...' \\
  -n mcp

# Apply manifests
kubectl apply -f k8s/ -n mcp

# Check status
kubectl get pods -n mcp
kubectl get hpa -n mcp`}</code></pre>
            </div>
          </section>

          {/* Best Practices */}
          <section id="best-practices" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Best Practices</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4">Security</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>✓ Run containers as non-root user</li>
                  <li>✓ Use read-only root filesystem where possible</li>
                  <li>✓ Never store secrets in images—use Docker secrets or environment variables</li>
                  <li>✓ Scan images for vulnerabilities (Trivy, Snyk)</li>
                  <li>✓ Use specific image tags, not <code className="text-purple-400">:latest</code></li>
                </ul>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4">Performance</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>✓ Use multi-stage builds to minimize image size</li>
                  <li>✓ Layer Dockerfile commands efficiently (dependencies before code)</li>
                  <li>✓ Set appropriate resource limits</li>
                  <li>✓ Use connection pooling for databases</li>
                  <li>✓ Enable container health checks</li>
                </ul>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4">Observability</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>✓ Expose Prometheus metrics endpoint</li>
                  <li>✓ Use structured JSON logging</li>
                  <li>✓ Include correlation IDs for request tracing</li>
                  <li>✓ Separate liveness and readiness probes</li>
                  <li>✓ Monitor container resource usage</li>
                </ul>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4">CI/CD</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>✓ Automate image builds on git push</li>
                  <li>✓ Tag images with git SHA and semantic version</li>
                  <li>✓ Run tests inside containers before pushing</li>
                  <li>✓ Use image registries with vulnerability scanning</li>
                  <li>✓ Implement rolling deployments with rollback</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Summary */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Summary</h2>
            
            <p className="text-gray-300 mb-6">
              Docker provides a robust way to deploy MCP servers in production:
            </p>

            <ul className="space-y-3 text-gray-300 mb-8">
              <li>• <strong>Multi-stage builds</strong> keep images small and secure</li>
              <li>• <strong>Docker Compose</strong> simplifies multi-service development</li>
              <li>• <strong>Health checks</strong> enable proper orchestration</li>
              <li>• <strong>Kubernetes</strong> provides enterprise-scale deployment</li>
              <li>• <strong>SSE transport</strong> works better than stdio in containers</li>
            </ul>

            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-8 border border-purple-500/30">
              <h3 className="text-xl font-semibold text-white mb-4">Next Steps</h3>
              <ul className="space-y-2 text-gray-300">
                <li>→ <a href="/mcp/testing-mcp-servers" className="text-purple-400 hover:text-purple-300">Set up CI/CD with automated testing</a></li>
                <li>→ <a href="/mcp/mcp-authentication-guide" className="text-purple-400 hover:text-purple-300">Secure your containers with proper authentication</a></li>
                <li>→ <a href="/mcp/troubleshooting-mcp-servers" className="text-purple-400 hover:text-purple-300">Debug container issues</a></li>
              </ul>
            </div>
          </section>

        </article>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <a href="/mcp" className="text-purple-400 hover:text-purple-300">← Back to MCP Tutorials</a>
            <span className="text-gray-500 text-sm">Last updated: February 2026</span>
          </div>
        </footer>
      </div>
    </main>
  )
}
