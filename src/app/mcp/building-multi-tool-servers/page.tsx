import Link from "next/link";
import type { Metadata } from "next";
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: "Building Multi-Tool MCP Servers (2025 Guide) | Kai Gritun",
  description: "Learn to build MCP servers that expose multiple related tools. Organize tools logically, share state between them, and create cohesive tool collections for AI agents.",
  keywords: ["MCP multi-tool", "MCP server multiple tools", "Model Context Protocol tools", "MCP Python", "MCP TypeScript", "AI tools"],
};

export default function BuildingMultiToolServers() {
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
              Building Multi-Tool MCP Servers
            </h1>
            <p className="text-gray-400 text-lg mb-4">
              Create cohesive MCP servers that expose multiple related tools. Learn to organize 
              tools logically, share state, and build complete tool suites for AI agents.
            </p>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>February 3, 2026</span>
              <span>·</span>
              <span>12 min read</span>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p>
              Most real-world MCP servers need more than one tool. A database server needs 
              query, insert, update, and delete tools. A file server needs read, write, list, 
              and search tools. Building these multi-tool servers well requires thoughtful 
              organization and state management.
            </p>
            
            <p>
              In this tutorial, you'll learn patterns for building MCP servers with multiple 
              related tools that work together cohesively. We'll build a complete project 
              management server as our example.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4">When to Use Multi-Tool Servers</h2>
            <p>
              Group tools into a single server when they:
            </p>

            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li><strong>Share state</strong> — Tools need access to the same data or connections</li>
              <li><strong>Have related functionality</strong> — CRUD operations on the same resource</li>
              <li><strong>Share configuration</strong> — Same API keys, database connections, etc.</li>
              <li><strong>Are deployed together</strong> — Always used as a set</li>
            </ul>

            <p>
              Keep tools in separate servers when they're truly independent or when you want 
              to enable/disable them individually.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4">Project Structure</h2>
            <p>
              For larger multi-tool servers, organize your code clearly:
            </p>
            
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`project-mcp-server/
├── server.py           # Main entry point
├── tools/
│   ├── __init__.py
│   ├── projects.py     # Project-related tools
│   ├── tasks.py        # Task-related tools
│   └── reports.py      # Reporting tools
├── models/
│   ├── __init__.py
│   ├── project.py      # Project data model
│   └── task.py         # Task data model
├── storage/
│   ├── __init__.py
│   └── database.py     # Shared database connection
└── config.py           # Configuration`}
              </pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Step 1: Define Shared State</h2>
            <p>
              Create a shared state manager that all tools can access. This is the key to 
              multi-tool servers:
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`# storage/database.py
"""
Shared database connection for all tools.
"""
import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import Optional
import threading


class Database:
    """Thread-safe SQLite database manager."""
    
    _instance: Optional["Database"] = None
    _lock = threading.Lock()
    
    def __new__(cls, db_path: str = "projects.db"):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance._init_db(db_path)
        return cls._instance
    
    def _init_db(self, db_path: str):
        self.db_path = Path(db_path)
        self._local = threading.local()
        self._setup_tables()
    
    @property
    def conn(self) -> sqlite3.Connection:
        if not hasattr(self._local, "conn"):
            self._local.conn = sqlite3.connect(
                self.db_path,
                check_same_thread=False
            )
            self._local.conn.row_factory = sqlite3.Row
        return self._local.conn
    
    def _setup_tables(self):
        with self.conn:
            self.conn.executescript("""
                CREATE TABLE IF NOT EXISTS projects (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    description TEXT,
                    status TEXT DEFAULT 'active',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                
                CREATE TABLE IF NOT EXISTS tasks (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    project_id INTEGER NOT NULL,
                    title TEXT NOT NULL,
                    description TEXT,
                    status TEXT DEFAULT 'todo',
                    priority TEXT DEFAULT 'medium',
                    due_date DATE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (project_id) REFERENCES projects(id)
                );
            """)
    
    @contextmanager
    def transaction(self):
        try:
            yield self.conn
            self.conn.commit()
        except Exception:
            self.conn.rollback()
            raise


# Singleton instance
db = Database()`}
              </pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Step 2: Create Tool Modules</h2>
            <p>
              Organize tools into logical modules. Each module focuses on one resource type:
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`# tools/projects.py
"""
Project management tools.
"""
from typing import Optional
from storage.database import db


def create_project(name: str, description: Optional[str] = None) -> dict:
    """
    Create a new project.
    
    Args:
        name: The project name.
        description: Optional project description.
    
    Returns:
        The created project with its ID.
    """
    with db.transaction() as conn:
        cursor = conn.execute(
            "INSERT INTO projects (name, description) VALUES (?, ?)",
            (name, description)
        )
        project_id = cursor.lastrowid
    
    return {
        "id": project_id,
        "name": name,
        "description": description,
        "status": "active",
        "message": f"Project '{name}' created successfully"
    }


def list_projects(status: Optional[str] = None) -> list:
    """
    List all projects, optionally filtered by status.
    
    Args:
        status: Filter by status ('active', 'completed', 'archived').
    
    Returns:
        List of projects.
    """
    if status:
        rows = db.conn.execute(
            "SELECT * FROM projects WHERE status = ? ORDER BY created_at DESC",
            (status,)
        ).fetchall()
    else:
        rows = db.conn.execute(
            "SELECT * FROM projects ORDER BY created_at DESC"
        ).fetchall()
    
    return [dict(row) for row in rows]


def get_project(project_id: int) -> dict:
    """
    Get a project by ID with its tasks.
    
    Args:
        project_id: The project ID.
    
    Returns:
        Project details including task summary.
    """
    project = db.conn.execute(
        "SELECT * FROM projects WHERE id = ?",
        (project_id,)
    ).fetchone()
    
    if not project:
        return {"error": f"Project {project_id} not found"}
    
    # Get task counts
    task_stats = db.conn.execute("""
        SELECT 
            status,
            COUNT(*) as count
        FROM tasks 
        WHERE project_id = ?
        GROUP BY status
    """, (project_id,)).fetchall()
    
    result = dict(project)
    result["tasks"] = {row["status"]: row["count"] for row in task_stats}
    return result


def update_project_status(project_id: int, status: str) -> dict:
    """
    Update a project's status.
    
    Args:
        project_id: The project ID.
        status: New status ('active', 'completed', 'archived').
    
    Returns:
        Updated project info.
    """
    valid_statuses = ["active", "completed", "archived"]
    if status not in valid_statuses:
        return {"error": f"Invalid status. Must be one of: {valid_statuses}"}
    
    with db.transaction() as conn:
        conn.execute(
            "UPDATE projects SET status = ? WHERE id = ?",
            (status, project_id)
        )
    
    return get_project(project_id)`}
              </pre>
            </div>

            <p>Now create the tasks module:</p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`# tools/tasks.py
"""
Task management tools.
"""
from typing import Optional
from storage.database import db


def create_task(
    project_id: int,
    title: str,
    description: Optional[str] = None,
    priority: str = "medium",
    due_date: Optional[str] = None
) -> dict:
    """
    Create a new task in a project.
    
    Args:
        project_id: The project to add the task to.
        title: Task title.
        description: Optional task description.
        priority: Priority level ('low', 'medium', 'high', 'urgent').
        due_date: Optional due date (YYYY-MM-DD format).
    
    Returns:
        The created task.
    """
    # Verify project exists
    project = db.conn.execute(
        "SELECT id FROM projects WHERE id = ?",
        (project_id,)
    ).fetchone()
    
    if not project:
        return {"error": f"Project {project_id} not found"}
    
    with db.transaction() as conn:
        cursor = conn.execute("""
            INSERT INTO tasks (project_id, title, description, priority, due_date)
            VALUES (?, ?, ?, ?, ?)
        """, (project_id, title, description, priority, due_date))
        task_id = cursor.lastrowid
    
    return {
        "id": task_id,
        "project_id": project_id,
        "title": title,
        "description": description,
        "priority": priority,
        "due_date": due_date,
        "status": "todo",
        "message": f"Task '{title}' created"
    }


def list_tasks(
    project_id: Optional[int] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None
) -> list:
    """
    List tasks with optional filters.
    
    Args:
        project_id: Filter by project.
        status: Filter by status ('todo', 'in_progress', 'done').
        priority: Filter by priority.
    
    Returns:
        List of tasks.
    """
    query = "SELECT * FROM tasks WHERE 1=1"
    params = []
    
    if project_id:
        query += " AND project_id = ?"
        params.append(project_id)
    if status:
        query += " AND status = ?"
        params.append(status)
    if priority:
        query += " AND priority = ?"
        params.append(priority)
    
    query += " ORDER BY due_date ASC NULLS LAST, priority DESC"
    
    rows = db.conn.execute(query, params).fetchall()
    return [dict(row) for row in rows]


def update_task_status(task_id: int, status: str) -> dict:
    """
    Update a task's status.
    
    Args:
        task_id: The task ID.
        status: New status ('todo', 'in_progress', 'done').
    
    Returns:
        Updated task info.
    """
    valid = ["todo", "in_progress", "done"]
    if status not in valid:
        return {"error": f"Invalid status. Must be one of: {valid}"}
    
    with db.transaction() as conn:
        conn.execute(
            "UPDATE tasks SET status = ? WHERE id = ?",
            (status, task_id)
        )
    
    task = db.conn.execute(
        "SELECT * FROM tasks WHERE id = ?",
        (task_id,)
    ).fetchone()
    
    return dict(task) if task else {"error": "Task not found"}`}
              </pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Step 3: Wire Up the Server</h2>
            <p>
              Now create the main server file that registers all tools:
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`# server.py
"""
Project Management MCP Server
A multi-tool server for managing projects and tasks.
"""
from fastmcp import FastMCP
from tools import projects, tasks

# Create the server
mcp = FastMCP(
    "Project Manager",
    description="Manage projects and tasks"
)

# ============== Project Tools ==============

@mcp.tool()
def create_project(name: str, description: str = None) -> str:
    """Create a new project."""
    result = projects.create_project(name, description)
    return format_result(result)


@mcp.tool()
def list_projects(status: str = None) -> str:
    """List all projects. Optionally filter by status (active/completed/archived)."""
    result = projects.list_projects(status)
    return format_result(result)


@mcp.tool()
def get_project(project_id: int) -> str:
    """Get project details including task summary."""
    result = projects.get_project(project_id)
    return format_result(result)


@mcp.tool()
def update_project_status(project_id: int, status: str) -> str:
    """Update project status to active, completed, or archived."""
    result = projects.update_project_status(project_id, status)
    return format_result(result)


# ============== Task Tools ==============

@mcp.tool()
def create_task(
    project_id: int,
    title: str,
    description: str = None,
    priority: str = "medium",
    due_date: str = None
) -> str:
    """Create a task in a project. Priority: low/medium/high/urgent."""
    result = tasks.create_task(
        project_id, title, description, priority, due_date
    )
    return format_result(result)


@mcp.tool()
def list_tasks(
    project_id: int = None,
    status: str = None,
    priority: str = None
) -> str:
    """List tasks. Filter by project, status (todo/in_progress/done), or priority."""
    result = tasks.list_tasks(project_id, status, priority)
    return format_result(result)


@mcp.tool()
def update_task_status(task_id: int, status: str) -> str:
    """Update task status to todo, in_progress, or done."""
    result = tasks.update_task_status(task_id, status)
    return format_result(result)


# ============== Helpers ==============

def format_result(result) -> str:
    """Format result for AI consumption."""
    import json
    if isinstance(result, dict) and "error" in result:
        return f"Error: {result['error']}"
    return json.dumps(result, indent=2, default=str)


# ============== Resources ==============

@mcp.resource("projects://schema")
def get_schema() -> str:
    """Database schema documentation."""
    return """
Project Management Schema:

PROJECTS:
- id: unique identifier
- name: project name (required)
- description: project description
- status: active | completed | archived
- created_at: timestamp

TASKS:
- id: unique identifier  
- project_id: foreign key to projects
- title: task title (required)
- description: task description
- status: todo | in_progress | done
- priority: low | medium | high | urgent
- due_date: YYYY-MM-DD format
- created_at: timestamp
"""


if __name__ == "__main__":
    mcp.run()`}
              </pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Step 4: Add Reporting Tools</h2>
            <p>
              Multi-tool servers shine when tools build on each other. Add reporting tools 
              that aggregate data across projects:
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`# tools/reports.py
"""
Reporting tools that aggregate across projects and tasks.
"""
from storage.database import db


def get_dashboard() -> dict:
    """
    Get a dashboard summary of all projects and tasks.
    
    Returns:
        Summary statistics and recent activity.
    """
    # Project stats
    project_stats = db.conn.execute("""
        SELECT 
            status,
            COUNT(*) as count
        FROM projects
        GROUP BY status
    """).fetchall()
    
    # Task stats
    task_stats = db.conn.execute("""
        SELECT 
            status,
            COUNT(*) as count
        FROM tasks
        GROUP BY status
    """).fetchall()
    
    # Overdue tasks
    overdue = db.conn.execute("""
        SELECT COUNT(*) as count
        FROM tasks
        WHERE due_date < date('now')
        AND status != 'done'
    """).fetchone()
    
    # Recent tasks
    recent = db.conn.execute("""
        SELECT t.*, p.name as project_name
        FROM tasks t
        JOIN projects p ON t.project_id = p.id
        ORDER BY t.created_at DESC
        LIMIT 5
    """).fetchall()
    
    return {
        "projects": {row["status"]: row["count"] for row in project_stats},
        "tasks": {row["status"]: row["count"] for row in task_stats},
        "overdue_tasks": overdue["count"],
        "recent_tasks": [dict(row) for row in recent]
    }


def get_project_report(project_id: int) -> dict:
    """
    Generate a detailed report for a project.
    """
    # ... implementation
    pass`}
              </pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Best Practices</h2>
            
            <h3 className="text-xl font-semibold mt-8 mb-3">1. Consistent Naming</h3>
            <p>
              Use a consistent naming convention for related tools:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li><code className="bg-gray-800 px-1 rounded">create_project</code>, <code className="bg-gray-800 px-1 rounded">create_task</code> — action + noun</li>
              <li><code className="bg-gray-800 px-1 rounded">list_projects</code>, <code className="bg-gray-800 px-1 rounded">list_tasks</code> — consistent pluralization</li>
              <li><code className="bg-gray-800 px-1 rounded">get_project</code>, <code className="bg-gray-800 px-1 rounded">get_task</code> — singular for single-item retrieval</li>
            </ul>

            <h3 className="text-xl font-semibold mt-8 mb-3">2. Descriptive Docstrings</h3>
            <p>
              AI models read your docstrings to understand tools. Be specific:
            </p>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`# ❌ Bad
def update_status(id: int, status: str):
    """Update status."""
    
# ✅ Good  
def update_task_status(task_id: int, status: str):
    """
    Update a task's status.
    
    Args:
        task_id: The task ID to update.
        status: New status - must be 'todo', 'in_progress', or 'done'.
    
    Returns:
        Updated task object or error message.
    """`}
              </pre>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-3">3. Return Actionable Errors</h3>
            <p>
              When something goes wrong, tell the AI how to fix it:
            </p>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`# ❌ Bad
return {"error": "Invalid"}

# ✅ Good
return {
    "error": "Invalid status 'pending'",
    "valid_values": ["todo", "in_progress", "done"],
    "hint": "Use update_task_status(task_id=5, status='in_progress')"
}`}
              </pre>
            </div>

            <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-6 my-8">
              <h3 className="font-semibold mb-2">📚 Related Tutorials</h3>
              <ul className="space-y-2 text-gray-300">
                <li>→ <Link href="/mcp/how-to-build-mcp-server-python" className="text-blue-400 hover:underline">How to Build an MCP Server in Python</Link></li>
                <li>→ <Link href="/mcp/mcp-error-handling" className="text-blue-400 hover:underline">MCP Error Handling Best Practices</Link></li>
                <li>→ <Link href="/mcp/mcp-langchain-integration" className="text-blue-400 hover:underline">MCP with LangChain Integration</Link></li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Summary</h2>
            <p>
              Multi-tool MCP servers are the backbone of useful AI integrations. By organizing 
              tools logically, sharing state appropriately, and following consistent patterns, 
              you create tool suites that AI can use effectively.
            </p>

            <p>
              The project management server we built demonstrates these patterns: shared database 
              state, modular tool organization, cross-cutting reporting tools, and resources for 
              documentation. Use this as a template for your own multi-tool servers.
            </p>

            <p className="text-gray-400 mt-8">
              Questions? Reach out on <a href="https://x.com/kaigritun" className="text-blue-400 hover:underline">Twitter</a> or 
              email <a href="mailto:kai@kaigritun.com" className="text-blue-400 hover:underline">kai@kaigritun.com</a>.
            </p>
          </div>
        </div>
      </article>

      <EmailSignup />

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Kai Gritun · <Link href="https://x.com/kaigritun" className="hover:text-white">@kaigritun</Link></p>
      </footer>
    </div>
  );
}
