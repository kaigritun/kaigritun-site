import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MCP Error Handling Patterns: Build Robust AI Integrations",
  description:
    "Learn error handling patterns for MCP servers. Implement proper error codes, retry logic, graceful degradation, and user-friendly error messages.",
  openGraph: {
    title: "MCP Error Handling Patterns: Build Robust AI Integrations",
    description:
      "Learn error handling patterns for MCP servers. Implement proper error codes, retry logic, graceful degradation, and user-friendly error messages.",
    type: "article",
    publishedTime: "2025-02-03",
  },
  twitter: {
    card: "summary_large_image",
    title: "MCP Error Handling Patterns",
    description: "Build robust MCP servers with proper error handling",
  },
};

export default function MCPErrorHandlingPatterns() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-8">
        <Link href="/mcp" className="text-gray-400 hover:text-white transition">
          ← Back to MCP Tutorials
        </Link>
      </div>

      <article className="prose prose-lg prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-4">
          MCP Error Handling Patterns: Build Robust AI Integrations
        </h1>

        <p className="text-gray-400 text-sm mb-8">
          Published February 3, 2025 · 18 min read
        </p>

        <p className="lead text-xl text-gray-300">
          When an MCP tool fails, the LLM needs to understand what went wrong and 
          how to recover. Poor error handling leads to confused AI responses, 
          frustrated users, and unreliable integrations. This guide covers patterns 
          for building MCP servers that fail gracefully and help LLMs recover intelligently.
        </p>

        <h2>The MCP Error Model</h2>

        <p>
          MCP uses JSON-RPC 2.0 error codes. Understanding these is crucial for proper 
          error handling:
        </p>

        <pre><code className="language-python">{`# Standard JSON-RPC error codes
ERROR_CODES = {
    -32700: "Parse error",           # Invalid JSON
    -32600: "Invalid request",       # Not valid JSON-RPC
    -32601: "Method not found",      # Unknown method
    -32602: "Invalid params",        # Bad parameters
    -32603: "Internal error",        # Server-side failure
    
    # Custom MCP error codes (application-specific)
    # Use codes in the -32000 to -32099 range
    -32000: "Resource not found",
    -32001: "Permission denied",
    -32002: "Rate limited",
    -32003: "External service error",
    -32004: "Validation failed",
}`}</code></pre>

        <h2>Basic Error Handling in FastMCP</h2>

        <p>
          FastMCP provides a clean way to raise errors that the LLM can understand:
        </p>

        <pre><code className="language-python">{`from mcp.server.fastmcp import FastMCP
from mcp.shared.exceptions import McpError
from mcp.types import ErrorData, INVALID_PARAMS, INTERNAL_ERROR

mcp = FastMCP("error-demo")

@mcp.tool()
async def get_user(user_id: str) -> dict:
    """Get user by ID."""
    
    # Validate input
    if not user_id:
        raise McpError(
            ErrorData(
                code=INVALID_PARAMS,
                message="user_id is required"
            )
        )
    
    if not user_id.isdigit():
        raise McpError(
            ErrorData(
                code=INVALID_PARAMS,
                message=f"user_id must be numeric, got: {user_id}"
            )
        )
    
    # Simulate database lookup
    users = {"1": {"name": "Alice"}, "2": {"name": "Bob"}}
    
    if user_id not in users:
        raise McpError(
            ErrorData(
                code=-32000,  # Custom: resource not found
                message=f"User {user_id} not found. Valid IDs: {list(users.keys())}"
            )
        )
    
    return users[user_id]`}</code></pre>

        <h2>Pattern 1: Structured Error Responses</h2>

        <p>
          Instead of raising exceptions, return structured error objects that give the 
          LLM context to recover:
        </p>

        <pre><code className="language-python">{`from typing import TypedDict, Literal
from dataclasses import dataclass
import traceback

@dataclass
class ToolResult:
    """Structured result that always succeeds at transport level."""
    success: bool
    data: dict | None = None
    error: dict | None = None

@mcp.tool()
async def search_files(
    query: str,
    path: str = ".",
    max_results: int = 10
) -> dict:
    """
    Search for files matching a query.
    
    Returns structured result with success/error status.
    """
    result = {"success": False, "data": None, "error": None}
    
    try:
        # Validate inputs
        if not query or len(query) < 2:
            result["error"] = {
                "type": "validation_error",
                "field": "query",
                "message": "Query must be at least 2 characters",
                "suggestion": "Try a longer search term"
            }
            return result
        
        if max_results < 1 or max_results > 100:
            result["error"] = {
                "type": "validation_error",
                "field": "max_results",
                "message": f"max_results must be 1-100, got {max_results}",
                "suggestion": "Use max_results between 1 and 100"
            }
            return result
        
        # Check path exists
        from pathlib import Path
        search_path = Path(path)
        if not search_path.exists():
            result["error"] = {
                "type": "not_found",
                "resource": "path",
                "message": f"Path does not exist: {path}",
                "suggestion": "Check the path or use '.' for current directory"
            }
            return result
        
        # Do the search
        matches = []
        for file in search_path.rglob(f"*{query}*"):
            if len(matches) >= max_results:
                break
            matches.append(str(file))
        
        result["success"] = True
        result["data"] = {
            "matches": matches,
            "count": len(matches),
            "truncated": len(matches) == max_results,
            "searched_path": str(search_path.absolute())
        }
        
    except PermissionError as e:
        result["error"] = {
            "type": "permission_denied",
            "message": f"Cannot access path: {e}",
            "suggestion": "Try a different directory or check permissions"
        }
    except Exception as e:
        result["error"] = {
            "type": "internal_error",
            "message": str(e),
            "suggestion": "This is unexpected. Try with different parameters."
        }
    
    return result`}</code></pre>

        <h2>Pattern 2: Retry-Friendly Errors</h2>

        <p>
          For transient failures (network issues, rate limits), provide information 
          that helps the LLM decide whether and when to retry:
        </p>

        <pre><code className="language-python">{`import asyncio
import httpx
from datetime import datetime, timedelta

class RetryInfo:
    def __init__(
        self,
        should_retry: bool,
        retry_after_seconds: int | None = None,
        max_retries: int = 3,
        backoff_multiplier: float = 2.0
    ):
        self.should_retry = should_retry
        self.retry_after_seconds = retry_after_seconds
        self.max_retries = max_retries
        self.backoff_multiplier = backoff_multiplier

@mcp.tool()
async def fetch_api_data(
    endpoint: str,
    attempt: int = 1
) -> dict:
    """
    Fetch data from external API with retry guidance.
    
    Args:
        endpoint: API endpoint to call
        attempt: Current attempt number (for retry tracking)
    """
    max_attempts = 3
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"https://api.example.com/{endpoint}")
            
            if response.status_code == 200:
                return {
                    "success": True,
                    "data": response.json(),
                    "attempt": attempt
                }
            
            elif response.status_code == 429:  # Rate limited
                retry_after = int(response.headers.get("Retry-After", 60))
                return {
                    "success": False,
                    "error": {
                        "type": "rate_limited",
                        "message": "API rate limit exceeded",
                        "retry": {
                            "should_retry": attempt < max_attempts,
                            "retry_after_seconds": retry_after,
                            "next_attempt": attempt + 1,
                            "max_attempts": max_attempts
                        },
                        "suggestion": f"Wait {retry_after} seconds, then call with attempt={attempt + 1}"
                    }
                }
            
            elif response.status_code >= 500:  # Server error
                backoff = min(2 ** attempt, 30)  # Exponential backoff, max 30s
                return {
                    "success": False,
                    "error": {
                        "type": "server_error",
                        "status_code": response.status_code,
                        "message": "External API is having issues",
                        "retry": {
                            "should_retry": attempt < max_attempts,
                            "retry_after_seconds": backoff,
                            "next_attempt": attempt + 1,
                            "max_attempts": max_attempts
                        },
                        "suggestion": f"Server error, try again in {backoff}s with attempt={attempt + 1}"
                    }
                }
            
            else:  # Client error (4xx except 429)
                return {
                    "success": False,
                    "error": {
                        "type": "client_error",
                        "status_code": response.status_code,
                        "message": response.text[:200],
                        "retry": {
                            "should_retry": False,
                            "reason": "Client errors are not retryable"
                        },
                        "suggestion": "Check the endpoint parameter and try a different value"
                    }
                }
    
    except httpx.TimeoutException:
        backoff = min(2 ** attempt, 30)
        return {
            "success": False,
            "error": {
                "type": "timeout",
                "message": "Request timed out after 10 seconds",
                "retry": {
                    "should_retry": attempt < max_attempts,
                    "retry_after_seconds": backoff,
                    "next_attempt": attempt + 1
                },
                "suggestion": f"Network slow, retry in {backoff}s with attempt={attempt + 1}"
            }
        }
    
    except httpx.ConnectError:
        return {
            "success": False,
            "error": {
                "type": "connection_failed",
                "message": "Could not connect to API",
                "retry": {
                    "should_retry": attempt < max_attempts,
                    "retry_after_seconds": 5,
                    "next_attempt": attempt + 1
                },
                "suggestion": "Network issue, retry in 5s"
            }
        }`}</code></pre>

        <h2>Pattern 3: Graceful Degradation</h2>

        <p>
          When full functionality isn&apos;t available, return partial results with 
          clear explanation of what&apos;s missing:
        </p>

        <pre><code className="language-python">{`@mcp.tool()
async def get_weather(
    location: str,
    include_forecast: bool = True,
    include_alerts: bool = True
) -> dict:
    """
    Get weather for a location with optional forecast and alerts.
    
    Gracefully degrades if some data sources are unavailable.
    """
    result = {
        "success": True,
        "data": {},
        "degraded": False,
        "warnings": []
    }
    
    # Always try to get current conditions
    try:
        current = await fetch_current_weather(location)
        result["data"]["current"] = current
    except Exception as e:
        # Current weather is required - fail completely
        return {
            "success": False,
            "error": {
                "type": "service_unavailable",
                "message": f"Cannot fetch current weather: {e}",
                "suggestion": "Weather service may be down, try again later"
            }
        }
    
    # Forecast is optional - degrade gracefully
    if include_forecast:
        try:
            forecast = await fetch_forecast(location)
            result["data"]["forecast"] = forecast
        except Exception as e:
            result["degraded"] = True
            result["warnings"].append({
                "component": "forecast",
                "reason": str(e),
                "impact": "7-day forecast unavailable, only current conditions shown"
            })
    
    # Alerts are optional - degrade gracefully
    if include_alerts:
        try:
            alerts = await fetch_alerts(location)
            result["data"]["alerts"] = alerts
        except Exception as e:
            result["degraded"] = True
            result["warnings"].append({
                "component": "alerts",
                "reason": str(e),
                "impact": "Weather alerts unavailable"
            })
    
    # Add metadata about response completeness
    result["metadata"] = {
        "components_requested": ["current"] + 
            (["forecast"] if include_forecast else []) +
            (["alerts"] if include_alerts else []),
        "components_returned": list(result["data"].keys()),
        "completeness": len(result["data"]) / (1 + include_forecast + include_alerts)
    }
    
    return result`}</code></pre>

        <h2>Pattern 4: Context-Aware Error Messages</h2>

        <p>
          Error messages should help the LLM understand not just what failed, but 
          how to fix it:
        </p>

        <pre><code className="language-python">{`from enum import Enum
from typing import Any

class ErrorContext:
    """Build informative error context for LLMs."""
    
    @staticmethod
    def validation_error(
        field: str,
        value: Any,
        expected: str,
        valid_examples: list[str] | None = None
    ) -> dict:
        """Create a validation error with helpful context."""
        error = {
            "type": "validation_error",
            "field": field,
            "received": str(value),
            "expected": expected,
            "message": f"Invalid {field}: expected {expected}, got {type(value).__name__}"
        }
        if valid_examples:
            error["examples"] = valid_examples
            error["suggestion"] = f"Try one of: {', '.join(valid_examples)}"
        return error
    
    @staticmethod
    def not_found(
        resource_type: str,
        identifier: str,
        similar: list[str] | None = None
    ) -> dict:
        """Create a not-found error with alternatives."""
        error = {
            "type": "not_found",
            "resource_type": resource_type,
            "identifier": identifier,
            "message": f"{resource_type} '{identifier}' not found"
        }
        if similar:
            error["similar_matches"] = similar[:5]
            error["suggestion"] = f"Did you mean: {similar[0]}?"
        else:
            error["suggestion"] = f"Check the {resource_type} identifier and try again"
        return error
    
    @staticmethod
    def permission_error(
        action: str,
        resource: str,
        required_permission: str | None = None
    ) -> dict:
        """Create a permission error with required access info."""
        error = {
            "type": "permission_denied",
            "action": action,
            "resource": resource,
            "message": f"Permission denied: cannot {action} {resource}"
        }
        if required_permission:
            error["required_permission"] = required_permission
            error["suggestion"] = f"This action requires '{required_permission}' permission"
        else:
            error["suggestion"] = "Check access permissions for this resource"
        return error

@mcp.tool()
async def manage_project(
    action: str,
    project_name: str,
    settings: dict | None = None
) -> dict:
    """Manage project with context-aware errors."""
    
    valid_actions = ["create", "update", "delete", "archive"]
    if action not in valid_actions:
        return {
            "success": False,
            "error": ErrorContext.validation_error(
                field="action",
                value=action,
                expected="one of: create, update, delete, archive",
                valid_examples=valid_actions
            )
        }
    
    # Check if project exists
    projects = await get_all_projects()
    project_names = [p["name"] for p in projects]
    
    if action in ["update", "delete", "archive"]:
        if project_name not in project_names:
            # Find similar names for suggestions
            similar = find_similar(project_name, project_names)
            return {
                "success": False,
                "error": ErrorContext.not_found(
                    resource_type="project",
                    identifier=project_name,
                    similar=similar
                )
            }
    
    if action == "create":
        if project_name in project_names:
            return {
                "success": False,
                "error": {
                    "type": "already_exists",
                    "resource_type": "project",
                    "identifier": project_name,
                    "message": f"Project '{project_name}' already exists",
                    "suggestion": "Use 'update' action to modify existing project, or choose a different name"
                }
            }
    
    # Check permissions
    user_perms = await get_user_permissions()
    required_perms = {"create": "project.create", "delete": "project.delete"}
    
    if action in required_perms:
        if required_perms[action] not in user_perms:
            return {
                "success": False,
                "error": ErrorContext.permission_error(
                    action=action,
                    resource=f"project/{project_name}",
                    required_permission=required_perms[action]
                )
            }
    
    # Perform action...
    return {"success": True, "data": {"action": action, "project": project_name}}`}</code></pre>

        <h2>Pattern 5: Error Aggregation for Batch Operations</h2>

        <p>
          When processing multiple items, collect all errors and report them together:
        </p>

        <pre><code className="language-python">{`from dataclasses import dataclass, field
from typing import Generic, TypeVar

T = TypeVar("T")

@dataclass
class BatchResult(Generic[T]):
    """Result of a batch operation with partial success support."""
    total: int = 0
    succeeded: int = 0
    failed: int = 0
    results: list[T] = field(default_factory=list)
    errors: list[dict] = field(default_factory=list)
    
    @property
    def success_rate(self) -> float:
        return self.succeeded / self.total if self.total > 0 else 0.0
    
    @property
    def partial_success(self) -> bool:
        return self.succeeded > 0 and self.failed > 0

@mcp.tool()
async def process_files(
    file_paths: list[str],
    operation: str = "analyze"
) -> dict:
    """
    Process multiple files with detailed error reporting.
    
    Continues processing even if some files fail.
    """
    batch = BatchResult[dict](total=len(file_paths))
    
    for path in file_paths:
        try:
            # Validate path
            from pathlib import Path
            file = Path(path)
            
            if not file.exists():
                batch.failed += 1
                batch.errors.append({
                    "file": path,
                    "error_type": "not_found",
                    "message": f"File does not exist: {path}",
                    "recoverable": False
                })
                continue
            
            if not file.is_file():
                batch.failed += 1
                batch.errors.append({
                    "file": path,
                    "error_type": "invalid_type",
                    "message": f"Path is not a file: {path}",
                    "recoverable": False
                })
                continue
            
            # Process file
            result = await process_single_file(file, operation)
            batch.succeeded += 1
            batch.results.append({"file": path, **result})
            
        except PermissionError:
            batch.failed += 1
            batch.errors.append({
                "file": path,
                "error_type": "permission_denied",
                "message": f"Cannot read file: {path}",
                "recoverable": True,
                "suggestion": "Check file permissions"
            })
        except Exception as e:
            batch.failed += 1
            batch.errors.append({
                "file": path,
                "error_type": "processing_error",
                "message": str(e),
                "recoverable": False
            })
    
    # Build response
    response = {
        "success": batch.succeeded > 0,
        "summary": {
            "total": batch.total,
            "succeeded": batch.succeeded,
            "failed": batch.failed,
            "success_rate": round(batch.success_rate, 2)
        },
        "results": batch.results
    }
    
    if batch.errors:
        response["errors"] = batch.errors
        
        # Categorize errors for easy understanding
        error_types = {}
        for err in batch.errors:
            t = err["error_type"]
            error_types[t] = error_types.get(t, 0) + 1
        
        response["error_summary"] = {
            "by_type": error_types,
            "recoverable_count": sum(1 for e in batch.errors if e.get("recoverable")),
            "suggestion": generate_batch_suggestion(batch.errors)
        }
    
    return response

def generate_batch_suggestion(errors: list[dict]) -> str:
    """Generate helpful suggestion based on error patterns."""
    types = [e["error_type"] for e in errors]
    
    if types.count("not_found") == len(types):
        return "All files not found. Check the file paths."
    elif types.count("permission_denied") > len(types) / 2:
        return "Many permission errors. Try running with elevated permissions."
    elif "not_found" in types:
        return f"{types.count('not_found')} files not found. Remove missing files and retry."
    else:
        return "Mixed errors. Review individual error messages."`}</code></pre>

        <h2>Pattern 6: Error Recovery Hints</h2>

        <p>
          Include explicit recovery steps that the LLM can follow:
        </p>

        <pre><code className="language-python">{`@dataclass
class RecoveryStep:
    """A single step the LLM can take to recover."""
    action: str
    tool: str | None = None
    parameters: dict | None = None
    description: str = ""

@mcp.tool()
async def deploy_application(
    app_name: str,
    environment: str,
    version: str | None = None
) -> dict:
    """Deploy application with recovery guidance on failure."""
    
    try:
        # Check app exists
        app = await get_application(app_name)
        if not app:
            return {
                "success": False,
                "error": {
                    "type": "not_found",
                    "message": f"Application '{app_name}' not found",
                    "recovery_steps": [
                        {
                            "step": 1,
                            "action": "List available applications",
                            "tool": "list_applications",
                            "parameters": {},
                            "description": "Find the correct app name"
                        },
                        {
                            "step": 2,
                            "action": "Retry deployment with correct name",
                            "tool": "deploy_application",
                            "parameters": {"environment": environment}
                        }
                    ]
                }
            }
        
        # Check environment
        valid_envs = ["staging", "production", "development"]
        if environment not in valid_envs:
            return {
                "success": False,
                "error": {
                    "type": "invalid_environment",
                    "message": f"Unknown environment: {environment}",
                    "recovery_steps": [
                        {
                            "step": 1,
                            "action": "Use valid environment",
                            "tool": "deploy_application",
                            "parameters": {
                                "app_name": app_name,
                                "environment": "staging"  # Suggest safest option
                            },
                            "description": f"Valid environments: {', '.join(valid_envs)}"
                        }
                    ]
                }
            }
        
        # Check version exists
        if version:
            available_versions = await get_app_versions(app_name)
            if version not in available_versions:
                return {
                    "success": False,
                    "error": {
                        "type": "version_not_found",
                        "message": f"Version {version} not found",
                        "recovery_steps": [
                            {
                                "step": 1,
                                "action": "List available versions",
                                "tool": "list_app_versions",
                                "parameters": {"app_name": app_name}
                            },
                            {
                                "step": 2,
                                "action": "Deploy latest version",
                                "tool": "deploy_application",
                                "parameters": {
                                    "app_name": app_name,
                                    "environment": environment
                                },
                                "description": "Omit version to deploy latest"
                            }
                        ]
                    }
                }
        
        # Attempt deployment
        deployment = await start_deployment(app, environment, version)
        
        return {
            "success": True,
            "data": {
                "deployment_id": deployment["id"],
                "status": "in_progress",
                "estimated_duration": "2-5 minutes"
            },
            "next_steps": [
                {
                    "action": "Monitor deployment",
                    "tool": "check_deployment_status",
                    "parameters": {"deployment_id": deployment["id"]}
                }
            ]
        }
        
    except DeploymentInProgressError as e:
        return {
            "success": False,
            "error": {
                "type": "deployment_in_progress",
                "message": "Another deployment is running",
                "current_deployment": e.deployment_id,
                "recovery_steps": [
                    {
                        "step": 1,
                        "action": "Check current deployment status",
                        "tool": "check_deployment_status",
                        "parameters": {"deployment_id": e.deployment_id}
                    },
                    {
                        "step": 2,
                        "action": "Wait for completion or cancel",
                        "options": [
                            {"tool": "wait_for_deployment", "parameters": {"deployment_id": e.deployment_id}},
                            {"tool": "cancel_deployment", "parameters": {"deployment_id": e.deployment_id}}
                        ]
                    }
                ]
            }
        }`}</code></pre>

        <h2>Pattern 7: Error Logging and Observability</h2>

        <p>
          Track errors for debugging while keeping responses LLM-friendly:
        </p>

        <pre><code className="language-python">{`import logging
import uuid
from datetime import datetime
from functools import wraps

logger = logging.getLogger(__name__)

def track_errors(func):
    """Decorator to track errors with correlation IDs."""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        correlation_id = str(uuid.uuid4())[:8]
        start_time = datetime.utcnow()
        
        try:
            result = await func(*args, **kwargs)
            
            # Log success
            logger.info(
                f"[{correlation_id}] {func.__name__} succeeded",
                extra={
                    "correlation_id": correlation_id,
                    "function": func.__name__,
                    "duration_ms": (datetime.utcnow() - start_time).total_seconds() * 1000,
                    "args": str(args)[:100],
                    "kwargs": str(kwargs)[:100]
                }
            )
            
            return result
            
        except Exception as e:
            # Log detailed error for debugging
            logger.error(
                f"[{correlation_id}] {func.__name__} failed: {e}",
                extra={
                    "correlation_id": correlation_id,
                    "function": func.__name__,
                    "error_type": type(e).__name__,
                    "error_message": str(e),
                    "args": str(args)[:100],
                    "kwargs": str(kwargs)[:100]
                },
                exc_info=True
            )
            
            # Return LLM-friendly error with reference ID
            return {
                "success": False,
                "error": {
                    "type": "internal_error",
                    "message": f"An error occurred: {type(e).__name__}",
                    "reference_id": correlation_id,
                    "suggestion": f"If this persists, report error ID: {correlation_id}"
                }
            }
    
    return wrapper

@mcp.tool()
@track_errors
async def complex_operation(data: dict) -> dict:
    """Operation with automatic error tracking."""
    # Your logic here...
    pass`}</code></pre>

        <h2>TypeScript Error Handling</h2>

        <p>
          The same patterns apply in TypeScript with the MCP SDK:
        </p>

        <pre><code className="language-typescript">{`import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { z } from "zod";

const server = new Server(
  { name: "error-demo", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Custom error types
interface ToolError {
  type: string;
  message: string;
  suggestion?: string;
  recoverySteps?: RecoveryStep[];
}

interface RecoveryStep {
  step: number;
  action: string;
  tool?: string;
  parameters?: Record<string, unknown>;
}

interface ToolResult<T> {
  success: boolean;
  data?: T;
  error?: ToolError;
}

// Helper functions
function validationError(
  field: string, 
  received: unknown, 
  expected: string
): ToolError {
  return {
    type: "validation_error",
    message: \`Invalid \${field}: expected \${expected}, got \${typeof received}\`,
    suggestion: \`Provide a valid \${field}\`
  };
}

function notFoundError(
  resourceType: string,
  id: string,
  alternatives?: string[]
): ToolError {
  const error: ToolError = {
    type: "not_found",
    message: \`\${resourceType} '\${id}' not found\`
  };
  
  if (alternatives?.length) {
    error.suggestion = \`Did you mean: \${alternatives[0]}?\`;
  }
  
  return error;
}

// Tool implementation
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  if (name === "get_item") {
    const input = GetItemSchema.safeParse(args);
    
    if (!input.success) {
      // Return structured error instead of throwing
      const result: ToolResult<never> = {
        success: false,
        error: {
          type: "validation_error",
          message: "Invalid parameters",
          suggestion: input.error.issues
            .map(i => \`\${i.path.join(".")}: \${i.message}\`)
            .join("; ")
        }
      };
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify(result, null, 2)
        }]
      };
    }
    
    try {
      const item = await database.getItem(input.data.id);
      
      if (!item) {
        const similar = await database.findSimilar(input.data.id);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              success: false,
              error: notFoundError("item", input.data.id, similar)
            }, null, 2)
          }]
        };
      }
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({ success: true, data: item }, null, 2)
        }]
      };
      
    } catch (err) {
      // Unexpected error - log and return generic message
      console.error("get_item failed:", err);
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: false,
            error: {
              type: "internal_error",
              message: "An unexpected error occurred",
              suggestion: "Try again or use different parameters"
            }
          }, null, 2)
        }]
      };
    }
  }
  
  throw new McpError(
    ErrorCode.MethodNotFound,
    \`Unknown tool: \${name}\`
  );
});`}</code></pre>

        <h2>Testing Error Handling</h2>

        <p>
          Verify your error handling works correctly:
        </p>

        <pre><code className="language-python">{`import pytest
from mcp.shared.exceptions import McpError

@pytest.mark.asyncio
async def test_validation_error_includes_suggestion():
    """Errors should include actionable suggestions."""
    result = await get_user("")
    
    assert not result["success"]
    assert result["error"]["type"] == "validation_error"
    assert "suggestion" in result["error"]
    assert len(result["error"]["suggestion"]) > 0

@pytest.mark.asyncio
async def test_not_found_includes_alternatives():
    """Not found errors should suggest alternatives."""
    result = await search_items("nonexistent-item")
    
    assert not result["success"]
    assert result["error"]["type"] == "not_found"
    assert "similar_matches" in result["error"] or "suggestion" in result["error"]

@pytest.mark.asyncio
async def test_batch_operation_continues_on_error():
    """Batch operations should process all items even with failures."""
    files = ["exists.txt", "missing.txt", "also-exists.txt"]
    result = await process_files(files)
    
    # Should have partial success
    assert result["success"]  # At least some succeeded
    assert result["summary"]["succeeded"] == 2
    assert result["summary"]["failed"] == 1
    assert len(result["errors"]) == 1

@pytest.mark.asyncio
async def test_retry_info_for_transient_errors():
    """Transient errors should include retry guidance."""
    # Simulate rate limit
    result = await fetch_with_rate_limit("endpoint", force_rate_limit=True)
    
    assert not result["success"]
    assert result["error"]["type"] == "rate_limited"
    assert result["error"]["retry"]["should_retry"]
    assert "retry_after_seconds" in result["error"]["retry"]

@pytest.mark.asyncio
async def test_recovery_steps_are_executable():
    """Recovery steps should reference valid tools with valid params."""
    result = await deploy_application("missing-app", "production")
    
    assert not result["success"]
    steps = result["error"]["recovery_steps"]
    
    for step in steps:
        assert "action" in step
        if "tool" in step:
            # Verify tool exists
            assert step["tool"] in available_tools
            # Verify parameters are valid
            if "parameters" in step:
                assert isinstance(step["parameters"], dict)`}</code></pre>

        <h2>Best Practices Summary</h2>

        <ul>
          <li><strong>Always include suggestions</strong> — Tell the LLM how to fix the problem</li>
          <li><strong>Use structured errors</strong> — Consistent format helps LLM parsing</li>
          <li><strong>Provide alternatives</strong> — &quot;Did you mean...?&quot; helps recovery</li>
          <li><strong>Include retry guidance</strong> — Should retry? When? How many times?</li>
          <li><strong>Degrade gracefully</strong> — Partial results beat total failure</li>
          <li><strong>Reference IDs for debugging</strong> — Let humans trace issues</li>
          <li><strong>Recovery steps</strong> — Explicit next actions the LLM can take</li>
          <li><strong>Test error paths</strong> — They&apos;re as important as success paths</li>
        </ul>

        <h2>What&apos;s Next?</h2>

        <p>
          Now that you can handle errors gracefully, explore these related topics:
        </p>

        <ul>
          <li><Link href="/mcp/testing-mcp-servers">Testing MCP Servers</Link> — Comprehensive testing guide</li>
          <li><Link href="/mcp/mcp-performance-optimization">Performance Optimization</Link> — Handle errors without slowing down</li>
          <li><Link href="/mcp/troubleshooting-mcp-servers">Troubleshooting Guide</Link> — Debug common MCP issues</li>
        </ul>

        <hr />

        <p>
          <strong>Questions about error handling?</strong> Reach out on{" "}
          <a href="https://twitter.com/kaigritun">Twitter</a>.
        </p>
      </article>
    </main>
  );
}
