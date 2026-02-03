import Link from "next/link";
import EmailSignup from "@/components/EmailSignup";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MCP Error Handling Best Practices (2025 Guide) | Kai Gritun",
  description: "Learn robust error handling patterns for production MCP servers. Handle network failures, validation errors, timeouts, and provide helpful error messages for AI agents.",
  keywords: ["MCP error handling", "MCP production", "Model Context Protocol errors", "MCP best practices", "MCP Python", "AI error handling"],
};

export default function MCPErrorHandling() {
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
              MCP Error Handling Best Practices
            </h1>
            <p className="text-gray-400 text-lg mb-4">
              Build robust MCP servers that fail gracefully. Learn patterns for handling 
              network failures, validation errors, and providing helpful feedback to AI agents.
            </p>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>February 3, 2026</span>
              <span>·</span>
              <span>11 min read</span>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p>
              In production, things break. APIs go down, databases timeout, users provide invalid 
              input, and edge cases multiply. Good error handling is what separates a prototype 
              from a production-ready MCP server.
            </p>
            
            <p>
              This guide covers error handling patterns that make your MCP servers reliable and 
              helpful. When errors occur, the AI using your tools should understand what went 
              wrong and how to recover.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4">The Golden Rule</h2>
            <p>
              <strong>Never let exceptions bubble up unhandled.</strong> An unhandled exception 
              in an MCP tool can crash the server or leave the AI confused. Always catch 
              exceptions and return meaningful error messages.
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`# ❌ Bad - exceptions can crash or confuse
@mcp.tool()
async def fetch_data(url: str) -> str:
    response = await httpx.get(url)
    return response.json()["data"]

# ✅ Good - always handle errors
@mcp.tool()
async def fetch_data(url: str) -> str:
    """Fetch data from a URL."""
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url)
            response.raise_for_status()
            return response.json()["data"]
    except httpx.TimeoutException:
        return "Error: Request timed out after 30 seconds. The server may be slow or unreachable."
    except httpx.HTTPStatusError as e:
        return f"Error: Server returned status {e.response.status_code}. URL may be invalid or access denied."
    except KeyError:
        return "Error: Response didn't contain expected 'data' field. API format may have changed."
    except Exception as e:
        return f"Error: Unexpected failure - {type(e).__name__}: {str(e)}"`}
              </pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Error Categories</h2>
            <p>
              Different errors need different handling strategies:
            </p>

            <h3 className="text-xl font-semibold mt-8 mb-3">1. Input Validation Errors</h3>
            <p>
              Catch bad input before doing any work. Validate early, fail fast.
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`from typing import Literal

@mcp.tool()
def create_task(
    title: str,
    priority: str = "medium",
    due_date: str = None
) -> str:
    """
    Create a new task.
    
    Args:
        title: Task title (required, 1-200 characters).
        priority: Priority level (low, medium, high, urgent).
        due_date: Due date in YYYY-MM-DD format.
    """
    errors = []
    
    # Validate title
    if not title or not title.strip():
        errors.append("Title is required and cannot be empty")
    elif len(title) > 200:
        errors.append(f"Title too long ({len(title)} chars). Maximum is 200 characters")
    
    # Validate priority
    valid_priorities = ["low", "medium", "high", "urgent"]
    if priority not in valid_priorities:
        errors.append(f"Invalid priority '{priority}'. Must be one of: {', '.join(valid_priorities)}")
    
    # Validate date format
    if due_date:
        try:
            from datetime import datetime
            datetime.strptime(due_date, "%Y-%m-%d")
        except ValueError:
            errors.append(f"Invalid date format '{due_date}'. Use YYYY-MM-DD (e.g., 2026-02-15)")
    
    # Return all validation errors at once
    if errors:
        return "Validation failed:\\n• " + "\\n• ".join(errors)
    
    # Proceed with creation...
    return create_task_in_db(title.strip(), priority, due_date)`}
              </pre>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-3">2. Network and External Service Errors</h3>
            <p>
              External services fail. Plan for it with retries and timeouts:
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`import asyncio
from typing import TypeVar, Callable
import httpx

T = TypeVar('T')

async def retry_with_backoff(
    func: Callable[[], T],
    max_retries: int = 3,
    base_delay: float = 1.0,
    max_delay: float = 30.0
) -> T:
    """Retry a function with exponential backoff."""
    last_exception = None
    
    for attempt in range(max_retries):
        try:
            return await func()
        except (httpx.TimeoutException, httpx.NetworkError) as e:
            last_exception = e
            if attempt < max_retries - 1:
                delay = min(base_delay * (2 ** attempt), max_delay)
                await asyncio.sleep(delay)
    
    raise last_exception


@mcp.tool()
async def fetch_weather(city: str) -> str:
    """Get current weather for a city."""
    async def _fetch():
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"https://wttr.in/{city}?format=j1",
                headers={"User-Agent": "MCP-Server/1.0"}
            )
            response.raise_for_status()
            return response.json()
    
    try:
        data = await retry_with_backoff(_fetch, max_retries=3)
        current = data["current_condition"][0]
        return f"Weather in {city}: {current['temp_F']}°F, {current['weatherDesc'][0]['value']}"
    
    except httpx.TimeoutException:
        return f"Error: Weather service timed out after 3 retries. Try again later."
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            return f"Error: City '{city}' not found. Check spelling or try a larger nearby city."
        return f"Error: Weather service returned {e.response.status_code}. Service may be temporarily unavailable."
    except Exception as e:
        return f"Error: Could not fetch weather - {str(e)}"`}
              </pre>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-3">3. Resource Not Found Errors</h3>
            <p>
              When an item doesn't exist, provide context and suggestions:
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`@mcp.tool()
def get_project(project_id: int) -> str:
    """Get project details by ID."""
    project = db.get_project(project_id)
    
    if not project:
        # Get similar projects to suggest
        all_projects = db.list_projects(limit=5)
        
        if all_projects:
            suggestions = ", ".join(
                f"'{p['name']}' (id={p['id']})" 
                for p in all_projects[:3]
            )
            return (
                f"Error: Project with ID {project_id} not found.\\n"
                f"Available projects: {suggestions}\\n"
                f"Use list_projects() to see all projects."
            )
        return (
            f"Error: Project with ID {project_id} not found.\\n"
            f"No projects exist yet. Use create_project(name='...') to create one."
        )
    
    return format_project(project)`}
              </pre>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-3">4. Permission and Authorization Errors</h3>
            <p>
              Be clear about what permissions are needed:
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`@mcp.tool()
def delete_project(project_id: int, confirm: bool = False) -> str:
    """
    Delete a project and all its tasks.
    
    Args:
        project_id: Project to delete.
        confirm: Must be True to confirm deletion.
    """
    if not confirm:
        return (
            "Error: Deletion requires confirmation.\\n"
            "This will permanently delete the project and ALL its tasks.\\n"
            "To confirm, call: delete_project(project_id={project_id}, confirm=True)"
        )
    
    project = db.get_project(project_id)
    if not project:
        return f"Error: Project {project_id} not found."
    
    if project["status"] == "archived":
        return (
            f"Error: Cannot delete archived project '{project['name']}'.\\n"
            "Archived projects are protected. Contact an admin to delete."
        )
    
    task_count = db.count_tasks(project_id)
    db.delete_project(project_id)
    
    return f"Deleted project '{project['name']}' and {task_count} associated tasks."`}
              </pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Structured Error Responses</h2>
            <p>
              For complex tools, return structured error objects that the AI can parse:
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`import json
from dataclasses import dataclass, asdict
from typing import Optional, List


@dataclass
class ToolError:
    """Structured error response."""
    error: str
    code: str
    details: Optional[str] = None
    suggestions: Optional[List[str]] = None
    recoverable: bool = True
    
    def to_json(self) -> str:
        return json.dumps(asdict(self), indent=2)


@dataclass  
class ToolSuccess:
    """Structured success response."""
    data: dict
    message: Optional[str] = None
    
    def to_json(self) -> str:
        return json.dumps(asdict(self), indent=2)


@mcp.tool()
async def complex_operation(param: str) -> str:
    """A tool with structured responses."""
    
    # Validation error
    if not param:
        return ToolError(
            error="Missing required parameter",
            code="VALIDATION_ERROR",
            details="The 'param' argument is required",
            suggestions=["Provide a non-empty string for 'param'"],
            recoverable=True
        ).to_json()
    
    try:
        result = await do_operation(param)
        return ToolSuccess(
            data=result,
            message="Operation completed successfully"
        ).to_json()
        
    except RateLimitError:
        return ToolError(
            error="Rate limit exceeded",
            code="RATE_LIMIT",
            details="Too many requests in the past minute",
            suggestions=[
                "Wait 60 seconds before retrying",
                "Reduce request frequency"
            ],
            recoverable=True
        ).to_json()
        
    except ServiceUnavailableError:
        return ToolError(
            error="Service temporarily unavailable",
            code="SERVICE_DOWN",
            details="The backend service is not responding",
            suggestions=[
                "Try again in a few minutes",
                "Check service status page"
            ],
            recoverable=True
        ).to_json()`}
              </pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Logging for Debugging</h2>
            <p>
              Good logging helps you debug issues in production:
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`import logging
import sys
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stderr),  # MCP uses stdout for protocol
        logging.FileHandler('mcp-server.log')
    ]
)
logger = logging.getLogger("mcp-server")


def log_tool_call(tool_name: str):
    """Decorator to log tool calls."""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            call_id = datetime.now().strftime("%H%M%S%f")[:10]
            logger.info(f"[{call_id}] {tool_name} called with kwargs={kwargs}")
            
            try:
                result = await func(*args, **kwargs)
                # Log truncated result
                result_preview = result[:200] + "..." if len(result) > 200 else result
                logger.info(f"[{call_id}] {tool_name} returned: {result_preview}")
                return result
            except Exception as e:
                logger.error(f"[{call_id}] {tool_name} failed: {e}", exc_info=True)
                raise
        
        return wrapper
    return decorator


@mcp.tool()
@log_tool_call("fetch_data")
async def fetch_data(url: str) -> str:
    """Fetch data from URL."""
    # ... implementation`}
              </pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Graceful Degradation</h2>
            <p>
              When part of a tool fails, return partial results rather than nothing:
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`@mcp.tool()
async def get_city_info(city: str) -> str:
    """Get comprehensive info about a city (weather, time, population)."""
    results = {"city": city}
    errors = []
    
    # Try weather - don't fail if this breaks
    try:
        results["weather"] = await fetch_weather(city)
    except Exception as e:
        errors.append(f"Weather unavailable: {str(e)}")
        results["weather"] = None
    
    # Try timezone
    try:
        results["local_time"] = await fetch_timezone(city)
    except Exception as e:
        errors.append(f"Timezone unavailable: {str(e)}")
        results["local_time"] = None
    
    # Try population
    try:
        results["population"] = await fetch_population(city)
    except Exception as e:
        errors.append(f"Population unavailable: {str(e)}")
        results["population"] = None
    
    # Format response with partial data
    output = [f"Information for {city}:"]
    
    if results["weather"]:
        output.append(f"  Weather: {results['weather']}")
    if results["local_time"]:
        output.append(f"  Local time: {results['local_time']}")
    if results["population"]:
        output.append(f"  Population: {results['population']:,}")
    
    if errors:
        output.append(f"\\nNote: Some data unavailable:")
        for err in errors:
            output.append(f"  • {err}")
    
    return "\\n".join(output)`}
              </pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Testing Error Handling</h2>
            <p>
              Write tests specifically for error cases:
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`import pytest
from unittest.mock import patch, AsyncMock


class TestErrorHandling:
    
    @pytest.mark.asyncio
    async def test_handles_timeout(self):
        """Tool returns helpful message on timeout."""
        with patch('httpx.AsyncClient.get', side_effect=httpx.TimeoutException("timeout")):
            result = await fetch_weather("London")
            assert "timed out" in result.lower()
            assert "try again" in result.lower()
    
    @pytest.mark.asyncio
    async def test_handles_invalid_city(self):
        """Tool provides suggestions for invalid city."""
        result = await fetch_weather("NotARealCity12345")
        assert "not found" in result.lower() or "error" in result.lower()
    
    def test_validates_empty_title(self):
        """Rejects empty task title with clear message."""
        result = create_task(title="", priority="high")
        assert "required" in result.lower()
        assert "title" in result.lower()
    
    def test_validates_invalid_priority(self):
        """Lists valid options when priority is invalid."""
        result = create_task(title="Test", priority="super-urgent")
        assert "invalid" in result.lower()
        assert "low" in result.lower()  # Shows valid options
        assert "high" in result.lower()`}
              </pre>
            </div>

            <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-6 my-8">
              <h3 className="font-semibold mb-2">📚 Related Tutorials</h3>
              <ul className="space-y-2 text-gray-300">
                <li>→ <Link href="/mcp/how-to-build-mcp-server-python" className="text-blue-400 hover:underline">How to Build an MCP Server in Python</Link></li>
                <li>→ <Link href="/mcp/building-multi-tool-servers" className="text-blue-400 hover:underline">Building Multi-Tool MCP Servers</Link></li>
                <li>→ <Link href="/mcp/testing-mcp-servers" className="text-blue-400 hover:underline">Testing MCP Servers</Link></li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Summary</h2>
            <p>
              Error handling in MCP servers is about helping the AI recover gracefully. When 
              something goes wrong:
            </p>

            <ul className="list-disc list-inside space-y-2 text-gray-300 my-4">
              <li><strong>Catch all exceptions</strong> — Never let errors bubble up unhandled</li>
              <li><strong>Be specific</strong> — Tell the AI exactly what went wrong</li>
              <li><strong>Suggest fixes</strong> — Provide actionable next steps</li>
              <li><strong>Validate early</strong> — Catch bad input before doing work</li>
              <li><strong>Retry transient failures</strong> — Use exponential backoff for network issues</li>
              <li><strong>Degrade gracefully</strong> — Return partial results when possible</li>
              <li><strong>Log everything</strong> — You'll need it for debugging</li>
            </ul>

            <p>
              Build these patterns into your MCP servers from the start, and they'll be 
              production-ready from day one.
            </p>

            <p className="text-gray-400 mt-8">
              Questions? Reach out on <a href="https://x.com/kaigritun" className="text-blue-400 hover:underline">Twitter</a> or 
              email <a href="mailto:kai@kaigritun.com" className="text-blue-400 hover:underline">kai@kaigritun.com</a>.
            </p>
          </div>
        </div>
      </article>

      {/* Newsletter */}
      <section className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-3xl mx-auto">
          <EmailSignup 
            headline="Get MCP tutorials in your inbox" 
            buttonText="Subscribe" 
            site="mcp" 
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Kai Gritun · <Link href="https://x.com/kaigritun" className="hover:text-white">@kaigritun</Link></p>
      </footer>
    </div>
  );
}
