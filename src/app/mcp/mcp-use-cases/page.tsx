import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '10 Practical MCP Use Cases (With Code) | Real-World Examples',
  description: 'Discover 10 real-world MCP use cases with working Python code. From personal knowledge bases to smart home control—practical examples you can adapt today.',
  keywords: ['MCP use cases', 'MCP server examples', 'what to build with MCP', 'MCP projects', 'Model Context Protocol examples'],
  openGraph: {
    title: '10 Practical MCP Use Cases (With Code)',
    description: 'Real-world MCP examples with working code you can adapt.',
    type: 'article',
  },
}

export default function MCPUseCases() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <article className="max-w-4xl mx-auto px-6 py-16">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <a href="/mcp" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            ← Back to MCP Tutorials
          </a>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-sm font-medium rounded-full">
              Inspiration
            </span>
            <span className="text-slate-400 text-sm">10 min read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            10 Practical MCP Use Cases (With Code)
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed">
            MCP connects AI to your tools. But what does that mean in practice? 
            Here are 10 real use cases with Python code you can adapt today.
          </p>
        </header>

        {/* Table of Contents */}
        <nav className="mb-12 p-6 bg-slate-800/50 rounded-xl border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">In This Guide</h2>
          <ul className="space-y-2 text-slate-300">
            <li><a href="#knowledge-base" className="hover:text-cyan-400 transition-colors">1. Personal Knowledge Base</a></li>
            <li><a href="#dev-environment" className="hover:text-cyan-400 transition-colors">2. Development Environment Control</a></li>
            <li><a href="#email-triage" className="hover:text-cyan-400 transition-colors">3. Email Triage</a></li>
            <li><a href="#database" className="hover:text-cyan-400 transition-colors">4. Database Query Assistant</a></li>
            <li><a href="#api-docs" className="hover:text-cyan-400 transition-colors">5. API Documentation Explorer</a></li>
            <li><a href="#calendar" className="hover:text-cyan-400 transition-colors">6. Calendar and Scheduling</a></li>
            <li><a href="#filesystem" className="hover:text-cyan-400 transition-colors">7. File System Operations</a></li>
            <li><a href="#monitoring" className="hover:text-cyan-400 transition-colors">8. Monitoring and Alerts</a></li>
            <li><a href="#research" className="hover:text-cyan-400 transition-colors">9. Research Assistant</a></li>
            <li><a href="#smart-home" className="hover:text-cyan-400 transition-colors">10. Smart Home Control</a></li>
            <li><a href="#building" className="hover:text-cyan-400 transition-colors">Building Your Own</a></li>
          </ul>
        </nav>

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          
          {/* 1. Personal Knowledge Base */}
          <section id="knowledge-base" className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">1. Personal Knowledge Base</h2>
            <p className="text-slate-300 mb-4">
              Connect Claude to your notes, documents, and bookmarks. Instead of searching manually, 
              ask &quot;What did I write about React hooks last month?&quot;
            </p>
            <div className="bg-slate-800 rounded-lg p-4 mb-6 overflow-x-auto">
              <pre className="text-green-400 text-sm">
{`from fastmcp import FastMCP
from pathlib import Path

mcp = FastMCP("knowledge")

@mcp.tool()
def search_obsidian(query: str) -> str:
    """Search Obsidian vault for notes matching query."""
    vault = Path.home() / "Documents/Obsidian"
    matches = []
    for md in vault.rglob("*.md"):
        content = md.read_text()
        if query.lower() in content.lower():
            matches.append(f"**{md.stem}**\\n{content[:300]}...")
    return "\\n\\n".join(matches[:5]) or "No matches found"

@mcp.tool()
def get_note(title: str) -> str:
    """Get full content of a specific note."""
    vault = Path.home() / "Documents/Obsidian"
    for md in vault.rglob("*.md"):
        if title.lower() in md.stem.lower():
            return md.read_text()
    return "Note not found"`}
              </pre>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-300 text-sm">
                <strong>Use it for:</strong> Research, writing, finding that thing you know you wrote down somewhere.
              </p>
            </div>
          </section>

          {/* 2. Development Environment Control */}
          <section id="dev-environment" className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">2. Development Environment Control</h2>
            <p className="text-slate-300 mb-4">
              Let Claude interact with your dev tools—run tests, check git status, manage branches.
            </p>
            <div className="bg-slate-800 rounded-lg p-4 mb-6 overflow-x-auto">
              <pre className="text-green-400 text-sm">
{`import subprocess
from fastmcp import FastMCP

mcp = FastMCP("dev-tools")

@mcp.tool()
def git_status(repo_path: str) -> str:
    """Get git status for a repository."""
    result = subprocess.run(
        ["git", "status", "--short"],
        cwd=repo_path,
        capture_output=True,
        text=True
    )
    return result.stdout or "Clean working directory"

@mcp.tool()
def run_tests(repo_path: str, test_pattern: str = "") -> str:
    """Run pytest in a repository."""
    cmd = ["pytest", "-v"]
    if test_pattern:
        cmd.extend(["-k", test_pattern])
    result = subprocess.run(cmd, cwd=repo_path, capture_output=True, text=True)
    return result.stdout + result.stderr

@mcp.tool()
def list_branches(repo_path: str) -> str:
    """List git branches."""
    result = subprocess.run(
        ["git", "branch", "-a"],
        cwd=repo_path,
        capture_output=True,
        text=True
    )
    return result.stdout`}
              </pre>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-300 text-sm">
                <strong>Use it for:</strong> Code review, debugging, understanding unfamiliar codebases.
              </p>
            </div>
          </section>

          {/* 3. Email Triage */}
          <section id="email-triage" className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">3. Email Triage</h2>
            <p className="text-slate-300 mb-4">
              Connect to your email. Claude summarizes unread messages, drafts replies, finds that email from last week.
            </p>
            <div className="bg-slate-800 rounded-lg p-4 mb-6 overflow-x-auto">
              <pre className="text-green-400 text-sm">
{`import imaplib
import email
from fastmcp import FastMCP

mcp = FastMCP("email")

@mcp.tool()
def get_unread_emails(max_count: int = 10) -> str:
    """Get unread emails from inbox."""
    mail = imaplib.IMAP4_SSL("imap.gmail.com")
    mail.login(EMAIL, PASSWORD)  # Use app password
    mail.select("inbox")
    
    _, messages = mail.search(None, "UNSEEN")
    email_ids = messages[0].split()[-max_count:]
    
    summaries = []
    for eid in email_ids:
        _, data = mail.fetch(eid, "(RFC822)")
        msg = email.message_from_bytes(data[0][1])
        summaries.append(f"From: {msg['from']}\\nSubject: {msg['subject']}")
    
    mail.logout()
    return "\\n\\n".join(summaries)

@mcp.tool()
def search_emails(query: str, folder: str = "inbox") -> str:
    """Search emails by subject or sender."""
    # Implementation searches email headers
    pass`}
              </pre>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-300 text-sm">
                <strong>Use it for:</strong> Morning email triage, finding specific conversations, drafting responses.
              </p>
            </div>
          </section>

          {/* 4. Database Query Assistant */}
          <section id="database" className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">4. Database Query Assistant</h2>
            <p className="text-slate-300 mb-4">
              Safe, read-only access to your databases. Claude writes SQL, explains results, finds patterns.
            </p>
            <div className="bg-slate-800 rounded-lg p-4 mb-6 overflow-x-auto">
              <pre className="text-green-400 text-sm">
{`import sqlite3
from fastmcp import FastMCP

mcp = FastMCP("database")

@mcp.tool()
def query_database(sql: str) -> str:
    """Run read-only SQL query. SELECT only."""
    if not sql.strip().upper().startswith("SELECT"):
        return "Error: Only SELECT queries allowed"
    
    conn = sqlite3.connect("app.db")
    cursor = conn.execute(sql)
    columns = [d[0] for d in cursor.description]
    rows = cursor.fetchall()
    conn.close()
    
    # Format as markdown table
    result = "| " + " | ".join(columns) + " |\\n"
    result += "| " + " | ".join(["---"] * len(columns)) + " |\\n"
    for row in rows[:50]:  # Limit rows
        result += "| " + " | ".join(str(v) for v in row) + " |\\n"
    return result

@mcp.tool()
def describe_tables() -> str:
    """List all tables and their schemas."""
    conn = sqlite3.connect("app.db")
    cursor = conn.execute(
        "SELECT name, sql FROM sqlite_master WHERE type='table'"
    )
    tables = cursor.fetchall()
    conn.close()
    return "\\n\\n".join(f"**{t[0]}**\\n\`\`\`sql\\n{t[1]}\\n\`\`\`" for t in tables)`}
              </pre>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-300 text-sm">
                <strong>Use it for:</strong> Data analysis, report generation, understanding your data.
              </p>
            </div>
          </section>

          {/* 5. API Documentation Explorer */}
          <section id="api-docs" className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">5. API Documentation Explorer</h2>
            <p className="text-slate-300 mb-4">
              Connect Claude to your API docs. It understands your endpoints, parameters, and can help debug issues.
            </p>
            <div className="bg-slate-800 rounded-lg p-4 mb-6 overflow-x-auto">
              <pre className="text-green-400 text-sm">
{`import httpx
from fastmcp import FastMCP

mcp = FastMCP("api-docs")

@mcp.tool()
def get_openapi_spec(api_url: str) -> str:
    """Fetch and summarize an OpenAPI specification."""
    response = httpx.get(f"{api_url}/openapi.json")
    spec = response.json()
    
    endpoints = []
    for path, methods in spec.get("paths", {}).items():
        for method, details in methods.items():
            endpoints.append(
                f"{method.upper()} {path}: {details.get('summary', 'No description')}"
            )
    
    return f"**{spec.get('info', {}).get('title', 'API')}**\\n\\n" + "\\n".join(endpoints)

@mcp.tool()
def test_endpoint(method: str, url: str, data: str = "") -> str:
    """Test an API endpoint."""
    response = httpx.request(method, url, json=eval(data) if data else None)
    return f"Status: {response.status_code}\\n\\n{response.text[:1000]}"`}
              </pre>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-300 text-sm">
                <strong>Use it for:</strong> API integration, debugging, generating client code.
              </p>
            </div>
          </section>

          {/* 6. Calendar and Scheduling */}
          <section id="calendar" className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">6. Calendar and Scheduling</h2>
            <p className="text-slate-300 mb-4">
              Let Claude see your calendar, find free slots, and understand your availability.
            </p>
            <div className="bg-slate-800 rounded-lg p-4 mb-6 overflow-x-auto">
              <pre className="text-green-400 text-sm">
{`from datetime import datetime, timedelta
from fastmcp import FastMCP
import caldav

mcp = FastMCP("calendar")

@mcp.tool()
def get_today_events() -> str:
    """Get today's calendar events."""
    client = caldav.DAVClient(url=CALDAV_URL, username=USER, password=PASS)
    calendar = client.principal().calendars()[0]
    
    today = datetime.now().date()
    events = calendar.date_search(today, today + timedelta(days=1))
    
    return "\\n".join(
        f"{e.vobject_instance.vevent.dtstart.value}: "
        f"{e.vobject_instance.vevent.summary.value}"
        for e in events
    )

@mcp.tool()
def find_free_time(duration_hours: int, within_days: int = 7) -> str:
    """Find free time slots in calendar."""
    # Implementation checks for gaps between events
    pass`}
              </pre>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-300 text-sm">
                <strong>Use it for:</strong> Meeting scheduling, time management, availability checks.
              </p>
            </div>
          </section>

          {/* 7. File System Operations */}
          <section id="filesystem" className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">7. File System Operations</h2>
            <p className="text-slate-300 mb-4">
              Controlled file operations—searching, organizing, batch renaming.
            </p>
            <div className="bg-slate-800 rounded-lg p-4 mb-6 overflow-x-auto">
              <pre className="text-green-400 text-sm">
{`from pathlib import Path
import shutil
from fastmcp import FastMCP

mcp = FastMCP("files")
ALLOWED_DIR = Path.home() / "Documents"

def safe_path(filepath: str) -> Path:
    """Ensure path is within allowed directory."""
    full = (ALLOWED_DIR / filepath).resolve()
    if not full.is_relative_to(ALLOWED_DIR):
        raise ValueError("Path outside allowed directory")
    return full

@mcp.tool()
def find_files(pattern: str, directory: str = ".") -> str:
    """Find files matching a glob pattern."""
    base = safe_path(directory)
    matches = list(base.glob(pattern))[:50]
    return "\\n".join(str(m.relative_to(ALLOWED_DIR)) for m in matches)

@mcp.tool()
def read_file(filepath: str) -> str:
    """Read file contents."""
    return safe_path(filepath).read_text()[:10000]

@mcp.tool()
def move_file(source: str, destination: str) -> str:
    """Move a file to a new location."""
    src = safe_path(source)
    dst = safe_path(destination)
    shutil.move(src, dst)
    return f"Moved {source} to {destination}"`}
              </pre>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-300 text-sm">
                <strong>Use it for:</strong> File organization, batch operations, finding documents.
              </p>
            </div>
          </section>

          {/* 8. Monitoring and Alerts */}
          <section id="monitoring" className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">8. Monitoring and Alerts</h2>
            <p className="text-slate-300 mb-4">
              Connect Claude to your monitoring systems. It can check status, analyze trends, and explain issues.
            </p>
            <div className="bg-slate-800 rounded-lg p-4 mb-6 overflow-x-auto">
              <pre className="text-green-400 text-sm">
{`import httpx
from fastmcp import FastMCP

mcp = FastMCP("monitoring")

@mcp.tool()
def check_website(url: str) -> str:
    """Check if a website is up and measure response time."""
    try:
        response = httpx.get(url, timeout=10)
        return f"Status: {response.status_code}\\n" \\
               f"Response time: {response.elapsed.total_seconds():.2f}s"
    except Exception as e:
        return f"Error: {e}"

@mcp.tool()
def get_server_metrics(host: str) -> str:
    """Get CPU, memory, disk usage from a server."""
    # Implementation via SSH or monitoring API
    pass

@mcp.tool()
def query_logs(service: str, hours: int = 1, level: str = "error") -> str:
    """Search logs for a service."""
    # Implementation queries your log aggregator
    pass`}
              </pre>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-300 text-sm">
                <strong>Use it for:</strong> Incident response, system health checks, log analysis.
              </p>
            </div>
          </section>

          {/* 9. Research Assistant */}
          <section id="research" className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">9. Research Assistant</h2>
            <p className="text-slate-300 mb-4">
              Connect to research databases, paper repositories, and citation managers.
            </p>
            <div className="bg-slate-800 rounded-lg p-4 mb-6 overflow-x-auto">
              <pre className="text-green-400 text-sm">
{`import httpx
from fastmcp import FastMCP

mcp = FastMCP("research")

@mcp.tool()
def search_arxiv(query: str, max_results: int = 5) -> str:
    """Search arXiv for papers."""
    response = httpx.get(
        "http://export.arxiv.org/api/query",
        params={"search_query": f"all:{query}", "max_results": max_results}
    )
    # Parse XML response and extract titles, authors, abstracts
    return parse_arxiv_response(response.text)

@mcp.tool()
def get_paper_summary(arxiv_id: str) -> str:
    """Get abstract and details for an arXiv paper."""
    pass`}
              </pre>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-300 text-sm">
                <strong>Use it for:</strong> Literature review, staying current, finding related work.
              </p>
            </div>
          </section>

          {/* 10. Smart Home Control */}
          <section id="smart-home" className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">10. Smart Home Control</h2>
            <p className="text-slate-300 mb-4">
              Connect Claude to your home automation. Control lights, check sensors, run routines.
            </p>
            <div className="bg-slate-800 rounded-lg p-4 mb-6 overflow-x-auto">
              <pre className="text-green-400 text-sm">
{`import httpx
from fastmcp import FastMCP

mcp = FastMCP("home")

@mcp.tool()
def set_light(room: str, state: str, brightness: int = 100) -> str:
    """Control a light. state: on/off"""
    response = httpx.post(
        f"{HASS_URL}/api/services/light/turn_{state}",
        headers={"Authorization": f"Bearer {HASS_TOKEN}"},
        json={"entity_id": f"light.{room}", "brightness_pct": brightness}
    )
    return f"Light {room} turned {state}"

@mcp.tool()
def get_temperature(room: str) -> str:
    """Get temperature sensor reading."""
    pass

@mcp.tool()
def run_scene(scene_name: str) -> str:
    """Activate a home automation scene."""
    pass`}
              </pre>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-300 text-sm">
                <strong>Use it for:</strong> Voice-free home control, automation debugging, status checks.
              </p>
            </div>
          </section>

          {/* Building Your Own */}
          <section id="building" className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Building Your Own</h2>
            <p className="text-slate-300 mb-4">
              These examples share a pattern:
            </p>
            <div className="space-y-4 mb-6">
              <div className="flex gap-4">
                <span className="text-cyan-400 text-xl">1.</span>
                <div>
                  <h3 className="font-semibold text-white">Wrap an existing service</h3>
                  <p className="text-slate-300 text-sm">Don&apos;t build from scratch. Connect what you already use.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-cyan-400 text-xl">2.</span>
                <div>
                  <h3 className="font-semibold text-white">Keep tools focused</h3>
                  <p className="text-slate-300 text-sm">One tool, one job. Let the AI combine them.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-cyan-400 text-xl">3.</span>
                <div>
                  <h3 className="font-semibold text-white">Validate everything</h3>
                  <p className="text-slate-300 text-sm">Never trust inputs. Check paths, sanitize queries, limit output.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-cyan-400 text-xl">4.</span>
                <div>
                  <h3 className="font-semibold text-white">Return useful context</h3>
                  <p className="text-slate-300 text-sm">Don&apos;t just return &quot;success.&quot; Return what changed, what it means.</p>
                </div>
              </div>
            </div>
            <p className="text-slate-300">
              Start with the use case that would save you the most time. Build one tool. Test it. Then expand.
            </p>
          </section>

          {/* Related Tutorials */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Related Tutorials</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <a href="/mcp/how-to-build-mcp-server-python" className="block p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-colors">
                <h3 className="font-semibold text-white mb-1">How to Build MCP Server (Python)</h3>
                <p className="text-slate-400 text-sm">Complete FastMCP tutorial from scratch</p>
              </a>
              <a href="/mcp/claude-desktop-mcp-setup" className="block p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-colors">
                <h3 className="font-semibold text-white mb-1">Claude Desktop MCP Setup</h3>
                <p className="text-slate-400 text-sm">Configure Claude Desktop with MCP servers</p>
              </a>
              <a href="/mcp/best-mcp-servers-2025" className="block p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-colors">
                <h3 className="font-semibold text-white mb-1">Best MCP Servers 2025</h3>
                <p className="text-slate-400 text-sm">Top servers worth installing</p>
              </a>
              <a href="/mcp/mcp-error-handling-patterns" className="block p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-colors">
                <h3 className="font-semibold text-white mb-1">MCP Error Handling Patterns</h3>
                <p className="text-slate-400 text-sm">Build robust servers that fail gracefully</p>
              </a>
            </div>
          </section>

          {/* CTA */}
          <section className="mt-16 p-8 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl border border-cyan-500/30">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Build?</h2>
            <p className="text-slate-300 mb-6">
              Pick the use case that would save you the most time, and build your first MCP server today.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="/mcp/how-to-build-mcp-server-python"
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-lg transition-colors"
              >
                Build Your First Server (Python)
              </a>
              <a 
                href="/mcp/servers"
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
              >
                Browse MCP Server Directory
              </a>
            </div>
          </section>

        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-700">
          <p className="text-slate-400 text-sm">
            Last updated: February 2025 · Written by Kai Gritun
          </p>
        </footer>
      </article>
    </main>
  )
}
