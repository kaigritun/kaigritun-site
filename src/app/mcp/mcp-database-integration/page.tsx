import Link from "next/link";
import type { Metadata } from "next";
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: "MCP Database Integration Guide (2026) | Kai Gritun",
  description: "Build a secure MCP server for database access. Natural language queries, safe SQL execution, and production-ready patterns for connecting AI to databases.",
  keywords: ["MCP database", "MCP SQL", "AI database access", "Model Context Protocol database", "MCP PostgreSQL", "natural language SQL"],
};

export default function MCPDatabaseIntegration() {
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
              Building an MCP Server for Database Integration
            </h1>
            <p className="text-gray-400 text-lg mb-4">
              Connecting AI assistants to databases unlocks powerful workflows: natural language queries, 
              data analysis, automated reporting. This guide shows you how to build it securely.
            </p>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>February 4, 2026</span>
              <span>·</span>
              <span>15 min read</span>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <h2 className="text-2xl font-bold mt-12 mb-4">Why Database + MCP?</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li><strong>Natural language queries</strong> - Ask questions in plain English</li>
              <li><strong>Data exploration</strong> - Let AI help you understand your data</li>
              <li><strong>Automated reporting</strong> - Generate insights on demand</li>
              <li><strong>Safe operations</strong> - Controlled access through defined tools</li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-4">Architecture Overview</h2>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`Claude Desktop → MCP Server → Database
                     ↓
              Query Validation
              Result Formatting
              Access Control`}</code>
            </pre>
            <p>
              The MCP server acts as a secure intermediary, validating queries and controlling 
              what the AI can access.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4">Basic Setup</h2>
            <p>Install dependencies:</p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`pip install mcp psycopg2-binary sqlalchemy`}</code>
            </pre>

            <p>Create the server:</p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`# database_mcp.py
import os
from mcp.server.fastmcp import FastMCP
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine

mcp = FastMCP("Database MCP")

# Database connection
def get_engine() -> Engine:
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        raise ValueError("DATABASE_URL not set")
    return create_engine(db_url)

engine = get_engine()

@mcp.tool()
def list_tables() -> str:
    """List all tables in the database."""
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """))
        tables = [row[0] for row in result]
    return f"Tables: {', '.join(tables)}"

@mcp.tool()
def describe_table(table_name: str) -> str:
    """Get the schema of a specific table."""
    # Validate table name (prevent injection)
    if not table_name.isidentifier():
        return "Invalid table name"
    
    with engine.connect() as conn:
        result = conn.execute(text(f"""
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = :table
            ORDER BY ordinal_position
        """), {"table": table_name})
        
        columns = []
        for row in result:
            nullable = "NULL" if row[2] == "YES" else "NOT NULL"
            columns.append(f"  {row[0]}: {row[1]} {nullable}")
    
    return f"Table: {table_name}\\n" + "\\n".join(columns)

if __name__ == "__main__":
    mcp.run()`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">Safe Query Execution</h2>
            <p>The tricky part: allowing queries without SQL injection.</p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
import re

# Patterns that indicate dangerous operations
DANGEROUS_PATTERNS = [
    r'\\bDROP\\b',
    r'\\bDELETE\\b',
    r'\\bTRUNCATE\\b',
    r'\\bUPDATE\\b',
    r'\\bINSERT\\b',
    r'\\bALTER\\b',
    r'\\bCREATE\\b',
    r'\\bGRANT\\b',
    r'\\bREVOKE\\b',
    r'--',  # Comments (often used in injection)
    r';.*\\w',  # Multiple statements
]

def is_safe_query(query: str) -> tuple[bool, str]:
    """Check if query is safe to execute."""
    query_upper = query.upper()
    
    for pattern in DANGEROUS_PATTERNS:
        if re.search(pattern, query_upper):
            return False, f"Blocked: query contains forbidden pattern"
    
    # Must be a SELECT
    if not query_upper.strip().startswith('SELECT'):
        return False, "Only SELECT queries allowed"
    
    return True, "OK"

@mcp.tool()
def run_query(query: str) -> str:
    """
    Execute a read-only SQL query.
    Only SELECT statements are allowed.
    Results limited to 100 rows.
    """
    # Validate query
    safe, message = is_safe_query(query)
    if not safe:
        return f"Query rejected: {message}"
    
    try:
        with engine.connect() as conn:
            result = conn.execute(text(query))
            rows = result.fetchmany(100)  # Limit results
            columns = result.keys()
            
            # Format as table
            output = [" | ".join(columns)]
            output.append("-" * len(output[0]))
            for row in rows:
                output.append(" | ".join(str(v) for v in row))
            
            return "\\n".join(output)
    
    except SQLAlchemyError as e:
        return f"Query error: {str(e)}"`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">Read-Only Database User</h2>
            <p>Best practice: use a dedicated read-only database user:</p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`-- PostgreSQL
CREATE USER mcp_readonly WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE mydb TO mcp_readonly;
GRANT USAGE ON SCHEMA public TO mcp_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO mcp_readonly;
-- Ensure future tables are also readable
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT SELECT ON TABLES TO mcp_readonly;`}</code>
            </pre>
            <p>Now even if query validation fails, damage is limited.</p>

            <h2 className="text-2xl font-bold mt-12 mb-4">Parameterized Queries</h2>
            <p>For structured operations, use parameters:</p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`@mcp.tool()
def search_customers(
    name: str = None,
    email: str = None,
    limit: int = 10
) -> str:
    """
    Search customers by name or email.
    Returns matching customer records.
    """
    conditions = []
    params = {"limit": min(limit, 100)}  # Cap limit
    
    if name:
        conditions.append("name ILIKE :name")
        params["name"] = f"%{name}%"
    
    if email:
        conditions.append("email ILIKE :email")
        params["email"] = f"%{email}%"
    
    where_clause = " AND ".join(conditions) if conditions else "1=1"
    
    query = text(f"""
        SELECT id, name, email, created_at
        FROM customers
        WHERE {where_clause}
        ORDER BY created_at DESC
        LIMIT :limit
    """)
    
    with engine.connect() as conn:
        result = conn.execute(query, params)
        rows = result.fetchall()
    
    if not rows:
        return "No customers found"
    
    return "\\n".join(
        f"[{r.id}] {r.name} <{r.email}> (joined {r.created_at})"
        for r in rows
    )`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">Aggregation Tools</h2>
            <p>Pre-built aggregations are safer than freeform queries:</p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`@mcp.tool()
def sales_summary(
    start_date: str,
    end_date: str,
    group_by: str = "day"
) -> str:
    """
    Get sales summary for a date range.
    group_by: 'day', 'week', or 'month'
    """
    # Validate group_by
    valid_groups = {
        "day": "DATE(created_at)",
        "week": "DATE_TRUNC('week', created_at)",
        "month": "DATE_TRUNC('month', created_at)",
    }
    
    if group_by not in valid_groups:
        return f"Invalid group_by. Use: {', '.join(valid_groups.keys())}"
    
    date_expr = valid_groups[group_by]
    
    query = text(f"""
        SELECT 
            {date_expr} as period,
            COUNT(*) as orders,
            SUM(total) as revenue,
            AVG(total) as avg_order
        FROM orders
        WHERE created_at BETWEEN :start AND :end
        GROUP BY {date_expr}
        ORDER BY period
    """)
    
    with engine.connect() as conn:
        result = conn.execute(query, {
            "start": start_date,
            "end": end_date
        })
        rows = result.fetchall()
    
    output = [f"Sales Summary (start to end):\\n"]
    for row in rows:
        output.append(
            f"period: orders orders, revenue total, avg_order avg"
        )
    
    return "\\n".join(output)`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">Configuration</h2>
            <p>Claude Desktop config:</p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`{
  "mcpServers": {
    "database": {
      "command": "python",
      "args": ["/path/to/database_mcp.py"],
      "env": {
        "DATABASE_URL": "postgresql://mcp_readonly:password@localhost/mydb"
      }
    }
  }
}`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">Security Summary</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li><strong>Read-only database user</strong> - Defense in depth</li>
              <li><strong>Query validation</strong> - Block dangerous operations</li>
              <li><strong>Parameterized queries</strong> - Prevent injection</li>
              <li><strong>Result limits</strong> - Prevent data dumps</li>
              <li><strong>Specific tools</strong> - Better than freeform SQL</li>
              <li><strong>Audit logging</strong> - Track all queries</li>
            </ol>

            <h2 className="text-2xl font-bold mt-12 mb-4">Example Conversation</h2>
            <p>Once set up, conversations look like this:</p>
            <div className="bg-gray-900 p-4 rounded-lg">
              <p className="text-gray-300"><strong>User:</strong> What tables do we have?</p>
              <p className="text-gray-400 italic mt-2">Claude calls list_tables</p>
              <p className="text-gray-300 mt-2">Tables: customers, orders, products, inventory</p>
              <p className="text-gray-300 mt-4"><strong>User:</strong> How many orders did we get last week?</p>
              <p className="text-gray-400 italic mt-2">Claude calls sales_summary with dates</p>
              <p className="text-gray-300 mt-2">Sales Summary (2026-01-27 to 2026-02-03):<br/>
              2026-01-27: 45 orders, $3,240.00 total, $72.00 avg</p>
            </div>
            <p className="mt-4">Database access through natural language—secure and powerful.</p>
          </div>

          {/* Email Signup */}
          <div className="mt-16 p-8 bg-gray-900 rounded-xl border border-gray-800">
            <h3 className="text-xl font-bold mb-4">Get MCP Tips & Tutorials</h3>
            <p className="text-gray-400 mb-6">
              Join developers building AI-powered tools. Get tutorials, code examples, and updates.
            </p>
            <EmailSignup site="mcp" />
          </div>

          {/* Related */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <h3 className="text-lg font-semibold mb-4">Related Tutorials</h3>
            <div className="grid gap-4">
              <Link href="/mcp/mcp-security-best-practices" className="p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
                <span className="text-blue-400">MCP Security Best Practices</span>
                <p className="text-sm text-gray-500 mt-1">Essential security patterns for MCP servers</p>
              </Link>
              <Link href="/mcp/how-to-build-mcp-server-python" className="p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
                <span className="text-blue-400">How to Build an MCP Server in Python</span>
                <p className="text-sm text-gray-500 mt-1">Step-by-step Python tutorial for beginners</p>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
