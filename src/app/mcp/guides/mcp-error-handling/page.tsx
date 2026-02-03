import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MCP Error Handling Best Practices | Kai Gritun',
  description: 'Robust error handling patterns for production MCP servers: error types, validation, retry logic, logging, and graceful degradation.',
  keywords: ['MCP error handling', 'MCP best practices', 'MCP validation', 'MCP logging', 'MCP retry', 'robust MCP server'],
  openGraph: {
    title: 'MCP Error Handling Best Practices',
    description: 'Build robust MCP servers with proper error handling, validation, and logging.',
    type: 'article',
  },
}

export default function MCPErrorHandling() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <article className="max-w-4xl mx-auto px-6 py-16">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
            <a href="/mcp" className="hover:text-zinc-300">MCP Tutorials</a>
            <span>/</span>
            <a href="/mcp/guides" className="hover:text-zinc-300">Guides</a>
            <span>/</span>
            <span>Error Handling</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            MCP Error Handling Best Practices
          </h1>
          <p className="text-xl text-zinc-400">
            Build robust MCP servers that fail gracefully and provide useful error information to LLM clients.
          </p>
          <div className="flex items-center gap-4 mt-6 text-sm text-zinc-500">
            <span>~10 min read</span>
            <span>•</span>
            <span>Production</span>
            <span>•</span>
            <span>Python</span>
          </div>
        </header>

        <div className="prose prose-invert prose-zinc max-w-none">
          <p className="text-lg text-zinc-300">
            Robust error handling is critical for production MCP servers. This guide covers patterns 
            for handling failures gracefully and providing useful error information to LLM clients.
          </p>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold mt-0">What You&apos;ll Learn</h3>
            <ul className="mb-0">
              <li>MCP error types and codes</li>
              <li>Input validation patterns</li>
              <li>Retry-friendly error responses</li>
              <li>Logging and debugging strategies</li>
              <li>Graceful degradation techniques</li>
            </ul>
          </div>

          <h2 id="error-types">Error Types in MCP</h2>

          <p>MCP defines several error categories:</p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-2 px-4">Error Code</th>
                  <th className="text-left py-2 px-4">Meaning</th>
                  <th className="text-left py-2 px-4">When to Use</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-800/50">
                  <td className="py-2 px-4 font-mono">-32700</td>
                  <td className="py-2 px-4">Parse error</td>
                  <td className="py-2 px-4">Invalid JSON received</td>
                </tr>
                <tr className="border-b border-zinc-800/50">
                  <td className="py-2 px-4 font-mono">-32600</td>
                  <td className="py-2 px-4">Invalid request</td>
                  <td className="py-2 px-4">Malformed request structure</td>
                </tr>
                <tr className="border-b border-zinc-800/50">
                  <td className="py-2 px-4 font-mono">-32601</td>
                  <td className="py-2 px-4">Method not found</td>
                  <td className="py-2 px-4">Unknown method called</td>
                </tr>
                <tr className="border-b border-zinc-800/50">
                  <td className="py-2 px-4 font-mono">-32602</td>
                  <td className="py-2 px-4">Invalid params</td>
                  <td className="py-2 px-4">Wrong or missing parameters</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-mono">-32603</td>
                  <td className="py-2 px-4">Internal error</td>
                  <td className="py-2 px-4">Server-side failure</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 id="basic-error-response">Implementing Error Handlers</h2>

          <h3>Basic Error Response</h3>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`from mcp.server import Server
from mcp.types import ErrorData

server = Server("my-server")

@server.call_tool()
async def handle_tool_call(name: str, arguments: dict):
    try:
        if name == "read_file":
            return await read_file(arguments.get("path"))
        else:
            raise ValueError(f"Unknown tool: {name}")
    except FileNotFoundError as e:
        return ErrorData(
            code=-32602,
            message=f"File not found: {e.filename}"
        )
    except PermissionError:
        return ErrorData(
            code=-32603,
            message="Permission denied"
        )
    except Exception as e:
        return ErrorData(
            code=-32603,
            message=f"Internal error: {str(e)}"
        )`}</code>
          </pre>

          <h3>Structured Error Information</h3>

          <p>Provide context that helps the LLM recover:</p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`class ToolError(Exception):
    def __init__(self, message: str, recoverable: bool = True, suggestion: str = None):
        self.message = message
        self.recoverable = recoverable
        self.suggestion = suggestion

@server.call_tool()
async def handle_tool_call(name: str, arguments: dict):
    try:
        return await execute_tool(name, arguments)
    except ToolError as e:
        error_info = {
            "error": e.message,
            "recoverable": e.recoverable,
        }
        if e.suggestion:
            error_info["suggestion"] = e.suggestion
        
        return ErrorData(
            code=-32603,
            message=json.dumps(error_info)
        )`}</code>
          </pre>

          <h2 id="validation">Validation Patterns</h2>

          <h3>Input Validation</h3>

          <p>Validate before executing:</p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`from pydantic import BaseModel, ValidationError

class FileReadArgs(BaseModel):
    path: str
    encoding: str = "utf-8"

@server.call_tool()
async def read_file_tool(name: str, arguments: dict):
    try:
        args = FileReadArgs(**arguments)
    except ValidationError as e:
        return ErrorData(
            code=-32602,
            message=f"Invalid arguments: {e.errors()}"
        )
    
    # Proceed with validated args
    return await read_file(args.path, args.encoding)`}</code>
          </pre>

          <h3>Path Validation (Security)</h3>

          <p>Always validate file paths:</p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`import os
from pathlib import Path

ALLOWED_ROOTS = [Path("/data"), Path("/tmp")]

def validate_path(path: str) -> Path:
    resolved = Path(path).resolve()
    
    # Check against allowed directories
    for root in ALLOWED_ROOTS:
        try:
            resolved.relative_to(root)
            return resolved
        except ValueError:
            continue
    
    raise ToolError(
        message=f"Path {path} is outside allowed directories",
        recoverable=False,
        suggestion=f"Use paths under: {', '.join(str(r) for r in ALLOWED_ROOTS)}"
    )`}</code>
          </pre>

          <h2 id="retry">Retry-Friendly Errors</h2>

          <p>Help LLMs retry intelligently:</p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`class RetryableError(Exception):
    def __init__(self, message: str, retry_after: int = None, max_retries: int = 3):
        self.message = message
        self.retry_after = retry_after
        self.max_retries = max_retries

@server.call_tool()
async def api_call_tool(name: str, arguments: dict):
    try:
        return await call_external_api(arguments)
    except RateLimitError as e:
        raise RetryableError(
            message="Rate limited",
            retry_after=e.retry_after,
            max_retries=3
        )
    except TimeoutError:
        raise RetryableError(
            message="Request timed out",
            retry_after=5,
            max_retries=2
        )`}</code>
          </pre>

          <h2 id="logging">Logging for Debugging</h2>

          <p>Comprehensive logging helps diagnose issues:</p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`import logging
import traceback
from datetime import datetime

logger = logging.getLogger("mcp-server")

@server.call_tool()
async def handle_tool_call(name: str, arguments: dict):
    request_id = datetime.now().isoformat()
    
    logger.info(f"[{request_id}] Tool call: {name}", extra={
        "arguments": arguments,
        "request_id": request_id
    })
    
    try:
        result = await execute_tool(name, arguments)
        logger.info(f"[{request_id}] Success")
        return result
    except Exception as e:
        logger.error(f"[{request_id}] Error: {e}", extra={
            "traceback": traceback.format_exc(),
            "request_id": request_id
        })
        raise`}</code>
          </pre>

          <h2 id="graceful-degradation">Graceful Degradation</h2>

          <p>When a tool partially fails:</p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`@server.call_tool()
async def batch_process_tool(name: str, arguments: dict):
    items = arguments.get("items", [])
    results = []
    errors = []
    
    for item in items:
        try:
            result = await process_item(item)
            results.append({"item": item, "result": result})
        except Exception as e:
            errors.append({"item": item, "error": str(e)})
    
    return {
        "successful": results,
        "failed": errors,
        "success_rate": len(results) / len(items) if items else 0
    }`}</code>
          </pre>

          <h2 id="client-side">Client-Side Error Handling</h2>

          <p>For MCP clients consuming tools:</p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`async def safe_tool_call(session, tool_name: str, arguments: dict):
    try:
        result = await session.call_tool(tool_name, arguments=arguments)
        
        if result.isError:
            error_data = json.loads(result.content[0].text)
            if error_data.get("recoverable"):
                # Try alternative approach
                return await handle_recoverable_error(error_data)
            else:
                raise ToolError(error_data["error"])
        
        return result.content[0].text
        
    except Exception as e:
        logger.error(f"Tool call failed: {e}")
        return None`}</code>
          </pre>

          <h2 id="testing">Testing Error Paths</h2>

          <p>Don&apos;t forget to test error scenarios:</p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`import pytest

@pytest.mark.asyncio
async def test_file_not_found():
    result = await handle_tool_call("read_file", {"path": "/nonexistent"})
    assert result.code == -32602
    assert "not found" in result.message.lower()

@pytest.mark.asyncio
async def test_invalid_arguments():
    result = await handle_tool_call("read_file", {})  # Missing path
    assert result.code == -32602

@pytest.mark.asyncio
async def test_permission_denied(mock_filesystem):
    mock_filesystem.set_permission("/secret", readable=False)
    result = await handle_tool_call("read_file", {"path": "/secret"})
    assert result.code == -32603
    assert "permission" in result.message.lower()`}</code>
          </pre>

          <div className="bg-emerald-950 border border-emerald-800 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold mt-0 text-emerald-300">Summary</h3>
            <p>Good error handling in MCP:</p>
            <ul className="mb-0">
              <li><strong>Use standard error codes</strong> for consistency</li>
              <li><strong>Provide actionable messages</strong> that help LLMs recover</li>
              <li><strong>Validate inputs early</strong> before expensive operations</li>
              <li><strong>Log comprehensively</strong> for debugging</li>
              <li><strong>Design for partial failures</strong> in batch operations</li>
              <li><strong>Test error paths</strong> as thoroughly as success paths</li>
            </ul>
          </div>

          <div className="border-t border-zinc-800 mt-12 pt-8">
            <h3 className="text-lg font-semibold">Related Guides</h3>
            <ul>
              <li><a href="/mcp/security-best-practices" className="text-blue-400 hover:text-blue-300">MCP Security Best Practices</a></li>
              <li><a href="/mcp/observability-monitoring" className="text-blue-400 hover:text-blue-300">MCP Observability & Monitoring</a></li>
              <li><a href="/mcp/guides/mcp-production-deployment" className="text-blue-400 hover:text-blue-300">Deploying MCP Servers to Production</a></li>
            </ul>
          </div>
        </div>
      </article>
    </main>
  )
}
