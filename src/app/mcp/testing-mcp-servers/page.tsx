import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Testing MCP Servers: A Complete Guide | Kai Gritun",
  description:
    "Learn how to test MCP servers effectively with unit tests, integration tests, and the MCP Inspector. Covers Python (FastMCP) and TypeScript testing patterns.",
  keywords: [
    "MCP testing",
    "test MCP server",
    "MCP Inspector",
    "FastMCP testing",
    "MCP unit tests",
    "MCP integration tests",
  ],
  openGraph: {
    title: "Testing MCP Servers: A Complete Guide",
    description:
      "Learn how to test MCP servers effectively with unit tests, integration tests, and the MCP Inspector.",
    type: "article",
  },
};

export default function TestingMCPServersPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-8">
          <a
            href="/mcp"
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back to MCP Tutorials
          </a>
        </div>

        <article className="prose prose-invert prose-lg max-w-none">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Testing MCP Servers: A Complete Guide
          </h1>

          <p className="text-gray-400 text-lg mb-8">
            February 2025 · 12 min read
          </p>

          <p className="text-xl text-gray-300 mb-8">
            You&apos;ve built an MCP server. But how do you know it works? This
            guide covers everything from quick manual testing to comprehensive
            test suites that catch bugs before your users do.
          </p>

          <nav className="bg-gray-900/50 rounded-lg p-6 mb-12">
            <h2 className="text-lg font-semibold mb-4 mt-0">
              What We&apos;ll Cover
            </h2>
            <ul className="space-y-2 mb-0">
              <li>
                <a href="#quick-validation" className="text-blue-400">
                  Quick Validation with MCP Inspector
                </a>
              </li>
              <li>
                <a href="#manual-testing" className="text-blue-400">
                  Manual Testing Techniques
                </a>
              </li>
              <li>
                <a href="#unit-tests-python" className="text-blue-400">
                  Unit Testing in Python (FastMCP)
                </a>
              </li>
              <li>
                <a href="#unit-tests-typescript" className="text-blue-400">
                  Unit Testing in TypeScript
                </a>
              </li>
              <li>
                <a href="#integration-tests" className="text-blue-400">
                  Integration Testing
                </a>
              </li>
              <li>
                <a href="#ci-cd" className="text-blue-400">
                  CI/CD Pipeline Setup
                </a>
              </li>
              <li>
                <a href="#mocking" className="text-blue-400">
                  Mocking External Dependencies
                </a>
              </li>
              <li>
                <a href="#best-practices" className="text-blue-400">
                  Testing Best Practices
                </a>
              </li>
            </ul>
          </nav>

          <h2 id="quick-validation" className="text-2xl font-bold mt-12 mb-4">
            Quick Validation with MCP Inspector
          </h2>

          <p>
            The fastest way to test your MCP server is the{" "}
            <strong>MCP Inspector</strong> — a web-based tool that lets you
            interact with your server in real-time. It shows exactly what tools,
            resources, and prompts your server exposes.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-4">
            Installing MCP Inspector
          </h3>

          <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <code className="text-green-400">{`# Install globally
npm install -g @modelcontextprotocol/inspector

# Or run directly with npx
npx @modelcontextprotocol/inspector`}</code>
          </pre>

          <h3 className="text-xl font-semibold mt-8 mb-4">
            Running the Inspector
          </h3>

          <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <code className="text-green-400">{`# For a Python server
npx @modelcontextprotocol/inspector python your_server.py

# For a TypeScript/Node server
npx @modelcontextprotocol/inspector node build/index.js

# For an installed package
npx @modelcontextprotocol/inspector npx -y your-mcp-server`}</code>
          </pre>

          <p>
            The Inspector opens a web interface (usually at
            localhost:5173) where you can:
          </p>

          <ul className="space-y-2">
            <li>Browse all exposed tools, resources, and prompts</li>
            <li>Execute tools with custom arguments</li>
            <li>View raw JSON-RPC messages</li>
            <li>Test error handling</li>
            <li>Inspect resource contents</li>
          </ul>

          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-6 my-8">
            <h4 className="text-blue-400 font-semibold mb-2">💡 Pro Tip</h4>
            <p className="mb-0">
              Keep the Inspector running during development. It&apos;s the
              quickest way to verify changes without restarting your MCP client.
            </p>
          </div>

          <h2 id="manual-testing" className="text-2xl font-bold mt-12 mb-4">
            Manual Testing Techniques
          </h2>

          <p>
            Sometimes you need to test the raw protocol. Here&apos;s how to talk
            to your MCP server directly.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-4">
            Using stdio Directly
          </h3>

          <p>MCP servers communicate over stdin/stdout. You can pipe JSON-RPC messages directly:</p>

          <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <code className="text-green-400">{`# Initialize the connection
echo '{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2024-11-05", "capabilities": {}, "clientInfo": {"name": "test", "version": "1.0"}}}' | python your_server.py

# List available tools
echo '{"jsonrpc": "2.0", "id": 2, "method": "tools/list", "params": {}}' | python your_server.py

# Call a specific tool
echo '{"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "your_tool", "arguments": {"arg1": "value"}}}' | python your_server.py`}</code>
          </pre>

          <h3 className="text-xl font-semibold mt-8 mb-4">
            Testing with a Simple Script
          </h3>

          <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <code className="text-green-400">{`#!/usr/bin/env python3
"""Quick test script for MCP servers."""
import subprocess
import json

def send_message(proc, message):
    """Send a JSON-RPC message and get response."""
    proc.stdin.write(json.dumps(message) + "\\n")
    proc.stdin.flush()
    response = proc.stdout.readline()
    return json.loads(response)

# Start the server
proc = subprocess.Popen(
    ["python", "your_server.py"],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    text=True
)

# Initialize
response = send_message(proc, {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
        "protocolVersion": "2024-11-05",
        "capabilities": {},
        "clientInfo": {"name": "test", "version": "1.0"}
    }
})
print("Initialize:", response)

# List tools
response = send_message(proc, {
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/list",
    "params": {}
})
print("Tools:", response)

proc.terminate()`}</code>
          </pre>

          <h2 id="unit-tests-python" className="text-2xl font-bold mt-12 mb-4">
            Unit Testing in Python (FastMCP)
          </h2>

          <p>
            FastMCP makes testing straightforward. Here&apos;s how to write proper
            unit tests for your tools.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-4">
            Basic Test Structure
          </h3>

          <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <code className="text-green-400">{`# test_server.py
import pytest
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

# Your server code
from server import mcp  # assuming your FastMCP instance is called 'mcp'

@pytest.fixture
async def client():
    """Create a test client connected to the server."""
    server_params = StdioServerParameters(
        command="python",
        args=["server.py"]
    )
    
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            yield session

@pytest.mark.asyncio
async def test_tools_list(client):
    """Test that tools are properly exposed."""
    result = await client.list_tools()
    tool_names = [t.name for t in result.tools]
    
    assert "my_tool" in tool_names
    assert "another_tool" in tool_names

@pytest.mark.asyncio
async def test_tool_execution(client):
    """Test tool execution with valid input."""
    result = await client.call_tool("my_tool", {"input": "test"})
    
    assert len(result.content) > 0
    assert result.content[0].type == "text"
    assert "expected output" in result.content[0].text`}</code>
          </pre>

          <h3 className="text-xl font-semibold mt-8 mb-4">
            Testing Tools Directly (Without Protocol)
          </h3>

          <p>
            For faster unit tests, you can test your tool functions directly
            without going through the MCP protocol:
          </p>

          <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <code className="text-green-400">{`# server.py
from fastmcp import FastMCP

mcp = FastMCP("test-server")

@mcp.tool()
def calculate_sum(a: int, b: int) -> int:
    """Add two numbers together."""
    return a + b

@mcp.tool()
async def fetch_data(url: str) -> str:
    """Fetch data from a URL."""
    import httpx
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        return response.text

# test_tools.py
import pytest
from server import calculate_sum, fetch_data

def test_calculate_sum():
    """Direct unit test for calculate_sum."""
    assert calculate_sum(2, 3) == 5
    assert calculate_sum(-1, 1) == 0
    assert calculate_sum(0, 0) == 0

def test_calculate_sum_type_error():
    """Test that invalid types raise errors."""
    with pytest.raises(TypeError):
        calculate_sum("not", "numbers")

@pytest.mark.asyncio
async def test_fetch_data(httpx_mock):
    """Test fetch_data with mocked HTTP."""
    httpx_mock.add_response(
        url="https://api.example.com/data",
        text="mocked response"
    )
    
    result = await fetch_data("https://api.example.com/data")
    assert result == "mocked response"`}</code>
          </pre>

          <h3 className="text-xl font-semibold mt-8 mb-4">
            Testing Error Handling
          </h3>

          <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <code className="text-green-400">{`@pytest.mark.asyncio
async def test_tool_invalid_input(client):
    """Test that invalid input returns proper error."""
    with pytest.raises(Exception) as exc_info:
        await client.call_tool("my_tool", {"invalid": "params"})
    
    assert "required parameter" in str(exc_info.value).lower()

@pytest.mark.asyncio
async def test_tool_handles_api_error(client, httpx_mock):
    """Test graceful handling of API failures."""
    httpx_mock.add_response(status_code=500)
    
    result = await client.call_tool("fetch_data", {"url": "https://api.example.com"})
    
    # Should return error message, not crash
    assert "error" in result.content[0].text.lower()`}</code>
          </pre>

          <h2
            id="unit-tests-typescript"
            className="text-2xl font-bold mt-12 mb-4"
          >
            Unit Testing in TypeScript
          </h2>

          <p>
            For TypeScript MCP servers, here&apos;s how to set up testing with
            Jest or Vitest.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-4">
            Setting Up Vitest
          </h3>

          <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <code className="text-green-400">{`# Install dependencies
npm install -D vitest @types/node

# package.json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run"
  }
}`}</code>
          </pre>

          <h3 className="text-xl font-semibold mt-8 mb-4">Writing Tests</h3>

          <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <code className="text-green-400">{`// src/tools.ts - Your tool implementations
export function calculateSum(a: number, b: number): number {
  return a + b;
}

export async function fetchData(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(\`HTTP \${response.status}\`);
  }
  return response.text();
}

// src/tools.test.ts
import { describe, it, expect, vi } from 'vitest';
import { calculateSum, fetchData } from './tools';

describe('calculateSum', () => {
  it('adds positive numbers', () => {
    expect(calculateSum(2, 3)).toBe(5);
  });

  it('handles negative numbers', () => {
    expect(calculateSum(-1, 1)).toBe(0);
  });

  it('handles zero', () => {
    expect(calculateSum(0, 0)).toBe(0);
  });
});

describe('fetchData', () => {
  it('returns response text on success', async () => {
    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('mocked data'),
    });

    const result = await fetchData('https://api.example.com');
    expect(result).toBe('mocked data');
  });

  it('throws on HTTP error', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(fetchData('https://api.example.com'))
      .rejects.toThrow('HTTP 500');
  });
});`}</code>
          </pre>

          <h3 className="text-xl font-semibold mt-8 mb-4">
            Testing the Full Server
          </h3>

          <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <code className="text-green-400">{`// src/server.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn, ChildProcess } from 'child_process';

describe('MCP Server Integration', () => {
  let serverProcess: ChildProcess;

  beforeAll(async () => {
    serverProcess = spawn('node', ['build/index.js'], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    
    // Wait for server to be ready
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  afterAll(() => {
    serverProcess.kill();
  });

  it('responds to initialize', async () => {
    const message = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test', version: '1.0' },
      },
    });

    serverProcess.stdin!.write(message + '\\n');

    const response = await new Promise<string>((resolve) => {
      serverProcess.stdout!.once('data', (data) => {
        resolve(data.toString());
      });
    });

    const parsed = JSON.parse(response);
    expect(parsed.result).toBeDefined();
    expect(parsed.result.serverInfo).toBeDefined();
  });
});`}</code>
          </pre>

          <h2 id="integration-tests" className="text-2xl font-bold mt-12 mb-4">
            Integration Testing
          </h2>

          <p>
            Integration tests verify your server works correctly with real MCP
            clients. Here&apos;s a pattern for end-to-end testing.
          </p>

          <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <code className="text-green-400">{`# test_integration.py
import pytest
import asyncio
from pathlib import Path

@pytest.fixture(scope="module")
def event_loop():
    """Create event loop for the test module."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="module")
async def mcp_client():
    """Start server and create client for integration tests."""
    from mcp import ClientSession, StdioServerParameters
    from mcp.client.stdio import stdio_client
    
    server_params = StdioServerParameters(
        command="python",
        args=[str(Path(__file__).parent.parent / "server.py")],
        env={
            "API_KEY": "test_key",  # Test credentials
            "DEBUG": "true"
        }
    )
    
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            yield session

class TestIntegration:
    """Integration test suite."""
    
    @pytest.mark.asyncio
    async def test_full_workflow(self, mcp_client):
        """Test a complete user workflow."""
        # Step 1: List available tools
        tools = await mcp_client.list_tools()
        assert len(tools.tools) > 0
        
        # Step 2: Use first tool
        first_tool = tools.tools[0]
        result = await mcp_client.call_tool(
            first_tool.name,
            {"input": "test data"}
        )
        assert result.content
        
        # Step 3: Read a resource
        resources = await mcp_client.list_resources()
        if resources.resources:
            content = await mcp_client.read_resource(
                resources.resources[0].uri
            )
            assert content.contents
    
    @pytest.mark.asyncio
    async def test_concurrent_requests(self, mcp_client):
        """Test that server handles concurrent requests."""
        tasks = [
            mcp_client.call_tool("my_tool", {"input": f"test_{i}"})
            for i in range(10)
        ]
        
        results = await asyncio.gather(*tasks)
        
        assert len(results) == 10
        assert all(r.content for r in results)`}</code>
          </pre>

          <h2 id="ci-cd" className="text-2xl font-bold mt-12 mb-4">
            CI/CD Pipeline Setup
          </h2>

          <p>
            Automate your tests with GitHub Actions. Here&apos;s a complete
            workflow:
          </p>

          <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <code className="text-green-400">{`# .github/workflows/test.yml
name: Test MCP Server

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-python:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          pip install -e .
          pip install pytest pytest-asyncio pytest-httpx
      
      - name: Run tests
        run: pytest -v --tb=short
      
      - name: Test with MCP Inspector
        run: |
          npm install -g @modelcontextprotocol/inspector
          timeout 10 npx @modelcontextprotocol/inspector python server.py &
          sleep 5
          curl -s http://localhost:5173/api/tools | jq .

  test-typescript:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Run tests
        run: npm test
      
      - name: Lint
        run: npm run lint`}</code>
          </pre>

          <h2 id="mocking" className="text-2xl font-bold mt-12 mb-4">
            Mocking External Dependencies
          </h2>

          <p>
            Your MCP server probably calls external APIs. Here&apos;s how to mock
            them properly.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-4">
            Python with pytest-httpx
          </h3>

          <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <code className="text-green-400">{`# conftest.py
import pytest

@pytest.fixture
def mock_github_api(httpx_mock):
    """Mock GitHub API responses."""
    httpx_mock.add_response(
        url="https://api.github.com/repos/owner/repo",
        json={
            "name": "repo",
            "full_name": "owner/repo",
            "stargazers_count": 100
        }
    )
    
    httpx_mock.add_response(
        url="https://api.github.com/repos/owner/repo/issues",
        json=[
            {"number": 1, "title": "Bug fix", "state": "open"},
            {"number": 2, "title": "Feature", "state": "closed"}
        ]
    )
    
    return httpx_mock

# test_github_tools.py
@pytest.mark.asyncio
async def test_get_repo_info(client, mock_github_api):
    """Test GitHub repo info tool with mocked API."""
    result = await client.call_tool(
        "get_repo_info",
        {"owner": "owner", "repo": "repo"}
    )
    
    assert "100" in result.content[0].text  # Star count
    assert "owner/repo" in result.content[0].text`}</code>
          </pre>

          <h3 className="text-xl font-semibold mt-8 mb-4">
            TypeScript with vi.mock
          </h3>

          <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <code className="text-green-400">{`// test/mocks.ts
import { vi } from 'vitest';

export const mockFetch = vi.fn();

// Reset before each test
beforeEach(() => {
  mockFetch.mockReset();
  global.fetch = mockFetch;
});

// Helper to mock specific endpoints
export function mockGitHubAPI() {
  mockFetch.mockImplementation((url: string) => {
    if (url.includes('/repos/')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          name: 'repo',
          stargazers_count: 100,
        }),
      });
    }
    
    return Promise.resolve({
      ok: false,
      status: 404,
    });
  });
}`}</code>
          </pre>

          <h2 id="best-practices" className="text-2xl font-bold mt-12 mb-4">
            Testing Best Practices
          </h2>

          <div className="space-y-6">
            <div className="bg-gray-900/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">
                1. Test the Happy Path First
              </h3>
              <p className="mb-0">
                Start with tests that verify normal operation. Edge cases and
                error handling come second.
              </p>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">
                2. Test Tool Descriptions
              </h3>
              <p className="mb-0">
                LLMs use your tool descriptions to decide when to call them.
                Test that descriptions are accurate and helpful.
              </p>
              <pre className="bg-gray-800 rounded p-3 mt-3 text-sm">
                <code>{`def test_tool_descriptions(client):
    tools = await client.list_tools()
    
    for tool in tools.tools:
        assert len(tool.description) > 20
        assert tool.inputSchema is not None`}</code>
              </pre>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">
                3. Test Parameter Validation
              </h3>
              <p className="mb-0">
                Ensure invalid parameters are rejected with clear error
                messages, not cryptic crashes.
              </p>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">
                4. Test Timeouts and Cancellation
              </h3>
              <p className="mb-0">
                Long-running tools should handle timeouts gracefully. Test that
                they can be cancelled.
              </p>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">
                5. Use Fixtures for Common Setup
              </h3>
              <p className="mb-0">
                Don&apos;t repeat server startup code. Use fixtures to share setup
                across tests.
              </p>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">
                6. Test with Real LLM Clients (Occasionally)
              </h3>
              <p className="mb-0">
                Unit tests with mocks are fast. But occasionally test with
                Claude Desktop to catch integration issues.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-4">
            Quick Reference: Test Commands
          </h2>

          <div className="bg-gray-900/50 rounded-lg p-6">
            <pre className="text-sm mb-0">
              <code>{`# Python
pytest                          # Run all tests
pytest -v                       # Verbose output
pytest -x                       # Stop on first failure
pytest --cov=src               # With coverage
pytest -k "test_tool"          # Run specific tests

# TypeScript  
npm test                        # Run tests
npm run test:watch             # Watch mode
npm run test:coverage          # With coverage

# MCP Inspector
npx @modelcontextprotocol/inspector python server.py
npx @modelcontextprotocol/inspector node build/index.js`}</code>
            </pre>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-4">Wrapping Up</h2>

          <p>
            Good testing is the difference between &quot;it works on my
            machine&quot; and &quot;it works.&quot; For MCP servers specifically:
          </p>

          <ul className="space-y-2">
            <li>
              <strong>Start with MCP Inspector</strong> for quick validation
            </li>
            <li>
              <strong>Unit test your tool functions</strong> directly for speed
            </li>
            <li>
              <strong>Integration test the full protocol</strong> for confidence
            </li>
            <li>
              <strong>Automate with CI/CD</strong> to catch regressions
            </li>
          </ul>

          <p>
            A well-tested MCP server is one you can ship with confidence.
          </p>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <h3 className="text-xl font-semibold mb-4">Continue Learning</h3>
            <div className="grid gap-4">
              <a
                href="/mcp/how-to-build-mcp-server-python"
                className="block p-4 bg-gray-900/50 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <span className="text-blue-400 font-medium">
                  ← Build an MCP Server (Python)
                </span>
                <p className="text-gray-400 text-sm mt-1 mb-0">
                  Start here if you haven&apos;t built a server yet
                </p>
              </a>
              <a
                href="/mcp/troubleshooting-mcp-servers"
                className="block p-4 bg-gray-900/50 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <span className="text-blue-400 font-medium">
                  Troubleshooting MCP Servers →
                </span>
                <p className="text-gray-400 text-sm mt-1 mb-0">
                  When tests pass but production fails
                </p>
              </a>
              <a
                href="/mcp/mcp-authentication-guide"
                className="block p-4 bg-gray-900/50 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <span className="text-blue-400 font-medium">
                  MCP Authentication Guide →
                </span>
                <p className="text-gray-400 text-sm mt-1 mb-0">
                  Securely handle credentials in tests
                </p>
              </a>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
