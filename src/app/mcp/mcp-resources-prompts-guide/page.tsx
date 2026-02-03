import { Metadata } from 'next';
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: 'MCP Resources and Prompts: Complete Guide | Kai Gritun',
  description: 'Learn how to use MCP Resources and Prompts to give AI assistants context and reusable instructions. Practical examples with code.',
  keywords: ['MCP resources', 'MCP prompts', 'Model Context Protocol', 'MCP primitives', 'AI context', 'Claude MCP'],
  openGraph: {
    title: 'MCP Resources and Prompts: Complete Guide',
    description: 'Learn how to use MCP Resources and Prompts to give AI assistants context and reusable instructions.',
    type: 'article',
    publishedTime: '2025-02-03',
  },
}

export default function MCPResourcesPromptsGuide() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <article className="max-w-3xl mx-auto px-6 py-16">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
            <a href="/mcp" className="hover:text-amber-400 transition-colors">← MCP Tutorials</a>
            <span>•</span>
            <time dateTime="2025-02-03">February 3, 2025</time>
            <span>•</span>
            <span>10 min read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            MCP Resources and Prompts: Complete Guide
          </h1>
          <p className="text-xl text-zinc-400 leading-relaxed">
            Tools get all the attention, but Resources and Prompts are what make MCP servers truly powerful. 
            Learn how to give AI assistants rich context and reusable instructions.
          </p>
        </header>

        <div className="prose prose-invert prose-zinc max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">The Three MCP Primitives</h2>
            <p className="text-zinc-300 mb-4">
              MCP servers expose three types of capabilities:
            </p>
            <ul className="text-zinc-300 space-y-3 mb-6">
              <li><strong className="text-amber-400">Tools</strong> — Functions the AI can call (most common)</li>
              <li><strong className="text-amber-400">Resources</strong> — Data the AI can read for context</li>
              <li><strong className="text-amber-400">Prompts</strong> — Reusable instruction templates</li>
            </ul>
            <p className="text-zinc-300">
              Most tutorials focus on tools, but resources and prompts unlock different use cases. 
              Let's explore when and how to use each.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">Resources: Giving AI Context</h2>
            <p className="text-zinc-300 mb-4">
              Resources are read-only data that AI assistants can access. Think of them as files the AI can read 
              to understand your project, configuration, or current state.
            </p>

            <h3 className="text-xl font-semibold text-zinc-200 mt-8 mb-4">When to Use Resources</h3>
            <ul className="text-zinc-300 space-y-2 mb-6">
              <li>• Project documentation or README files</li>
              <li>• Configuration files the AI should reference</li>
              <li>• Database schemas or API specs</li>
              <li>• Current system state or logs</li>
              <li>• Any read-only data that provides context</li>
            </ul>

            <h3 className="text-xl font-semibold text-zinc-200 mt-8 mb-4">Resource Example: Project Context</h3>
            <p className="text-zinc-300 mb-4">
              Here's an MCP server that exposes project files as resources:
            </p>
            <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 overflow-x-auto text-sm mb-6">
              <code className="text-zinc-300">{`from fastmcp import FastMCP
import os

mcp = FastMCP("Project Context")

@mcp.resource("project://readme")
def get_readme() -> str:
    """The project README file"""
    with open("README.md", "r") as f:
        return f.read()

@mcp.resource("project://config")
def get_config() -> str:
    """Current project configuration"""
    with open("config.yaml", "r") as f:
        return f.read()

@mcp.resource("project://schema")
def get_schema() -> str:
    """Database schema definition"""
    with open("schema.sql", "r") as f:
        return f.read()

if __name__ == "__main__":
    mcp.run()`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-zinc-200 mt-8 mb-4">Dynamic Resources with Templates</h3>
            <p className="text-zinc-300 mb-4">
              Resources can be dynamic using URI templates:
            </p>
            <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 overflow-x-auto text-sm mb-6">
              <code className="text-zinc-300">{`@mcp.resource("file://{path}")
def read_file(path: str) -> str:
    """Read any file from the project"""
    # Security: validate path is within project
    safe_path = os.path.abspath(path)
    if not safe_path.startswith(os.getcwd()):
        raise ValueError("Path outside project directory")
    
    with open(safe_path, "r") as f:
        return f.read()

@mcp.resource("logs://{date}")
def get_logs(date: str) -> str:
    """Get logs for a specific date (YYYY-MM-DD)"""
    log_file = f"logs/{date}.log"
    if os.path.exists(log_file):
        with open(log_file, "r") as f:
            return f.read()
    return f"No logs found for {date}"`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-zinc-200 mt-8 mb-4">Resources vs Tools</h3>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 mb-6">
              <p className="text-zinc-300 mb-4">
                <strong className="text-amber-400">Use Resources when:</strong> You want the AI to read data for context 
                (project docs, schemas, configs). Resources are passive — they provide information.
              </p>
              <p className="text-zinc-300">
                <strong className="text-amber-400">Use Tools when:</strong> You want the AI to take actions or fetch 
                dynamic data with parameters. Tools are active — they do things.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">Prompts: Reusable Instructions</h2>
            <p className="text-zinc-300 mb-4">
              Prompts are pre-written instruction templates that users can invoke. They're useful for 
              complex workflows that need consistent structure.
            </p>

            <h3 className="text-xl font-semibold text-zinc-200 mt-8 mb-4">When to Use Prompts</h3>
            <ul className="text-zinc-300 space-y-2 mb-6">
              <li>• Complex multi-step workflows</li>
              <li>• Code review or analysis templates</li>
              <li>• Report generation with specific format</li>
              <li>• Debugging or troubleshooting guides</li>
              <li>• Any repeated task that benefits from structure</li>
            </ul>

            <h3 className="text-xl font-semibold text-zinc-200 mt-8 mb-4">Prompt Example: Code Review</h3>
            <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 overflow-x-auto text-sm mb-6">
              <code className="text-zinc-300">{`from fastmcp import FastMCP
from fastmcp.prompts import Prompt

mcp = FastMCP("Code Review")

@mcp.prompt()
def code_review(code: str, language: str = "python") -> str:
    """Structured code review template"""
    return f"""Please review this {language} code:

\`\`\`{language}
{code}
\`\`\`

Analyze for:
1. **Bugs & Logic Errors** - Any obvious bugs or edge cases?
2. **Security Issues** - Input validation, injection risks, secrets?
3. **Performance** - Inefficient operations, unnecessary loops?
4. **Readability** - Clear naming, good structure, comments?
5. **Best Practices** - Following {language} conventions?

Provide specific suggestions with code examples."""

@mcp.prompt()
def debug_error(error_message: str, stack_trace: str = "") -> str:
    """Debug an error with structured analysis"""
    return f"""Help me debug this error:

**Error Message:**
{error_message}

**Stack Trace:**
{stack_trace if stack_trace else "Not provided"}

Please:
1. Explain what this error means
2. Identify the likely cause
3. Suggest fixes with code examples
4. Recommend how to prevent this in the future"""`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-zinc-200 mt-8 mb-4">Prompts with Dynamic Context</h3>
            <p className="text-zinc-300 mb-4">
              Prompts can combine with resources for powerful workflows:
            </p>
            <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 overflow-x-auto text-sm mb-6">
              <code className="text-zinc-300">{`@mcp.prompt()
def analyze_project() -> list:
    """Analyze the entire project structure"""
    # Return multiple messages for complex prompts
    return [
        {
            "role": "user",
            "content": """Analyze this project and provide:

1. **Architecture Overview** - How is it structured?
2. **Key Components** - What are the main modules?
3. **Dependencies** - What external libraries are used?
4. **Suggested Improvements** - What could be better?

Use the project resources (readme, config, schema) for context."""
        }
    ]

@mcp.prompt()
def generate_tests(file_path: str) -> str:
    """Generate unit tests for a file"""
    return f"""Generate comprehensive unit tests for the file at {file_path}.

Requirements:
- Use pytest as the testing framework
- Cover happy path and edge cases
- Mock external dependencies
- Include docstrings explaining each test
- Aim for 80%+ coverage

Read the file using resources first, then generate tests."""`}</code>
            </pre>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">Combining All Three Primitives</h2>
            <p className="text-zinc-300 mb-4">
              The real power comes from combining tools, resources, and prompts in one server:
            </p>
            <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 overflow-x-auto text-sm mb-6">
              <code className="text-zinc-300">{`from fastmcp import FastMCP
import subprocess
import os

mcp = FastMCP("Full Stack Dev Assistant")

# RESOURCES - Project context
@mcp.resource("project://readme")
def get_readme() -> str:
    """Project documentation"""
    return open("README.md").read()

@mcp.resource("project://package")
def get_package() -> str:
    """Package dependencies"""
    return open("package.json").read()

# TOOLS - Actions the AI can take
@mcp.tool()
def run_tests() -> str:
    """Run the test suite"""
    result = subprocess.run(
        ["npm", "test"], 
        capture_output=True, 
        text=True
    )
    return f"STDOUT:\\n{result.stdout}\\nSTDERR:\\n{result.stderr}"

@mcp.tool()
def lint_code() -> str:
    """Run the linter"""
    result = subprocess.run(
        ["npm", "run", "lint"], 
        capture_output=True, 
        text=True
    )
    return result.stdout or result.stderr

@mcp.tool()
def create_file(path: str, content: str) -> str:
    """Create or update a file"""
    with open(path, "w") as f:
        f.write(content)
    return f"Created {path}"

# PROMPTS - Structured workflows
@mcp.prompt()
def full_review() -> str:
    """Complete project review workflow"""
    return """Perform a full project review:

1. Read the README and package.json resources
2. Run the test suite and linter
3. Analyze results and provide:
   - Current project status
   - Test coverage assessment
   - Code quality issues
   - Prioritized recommendations

Be specific and actionable."""

@mcp.prompt()
def add_feature(feature_name: str, description: str) -> str:
    """Guided feature implementation"""
    return f"""Help me implement: {feature_name}

Description: {description}

Steps:
1. Review project structure (use resources)
2. Propose file changes needed
3. Write the implementation
4. Add tests for the feature
5. Update documentation

Let's go step by step."""

if __name__ == "__main__":
    mcp.run()`}</code>
            </pre>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">Using in Claude Desktop</h2>
            <p className="text-zinc-300 mb-4">
              Once your MCP server is configured in Claude Desktop, you can:
            </p>

            <h3 className="text-xl font-semibold text-zinc-200 mt-8 mb-4">Access Resources</h3>
            <p className="text-zinc-300 mb-4">
              Resources appear in the attachment menu. Click the + button and select from available resources 
              to add them to your conversation context.
            </p>

            <h3 className="text-xl font-semibold text-zinc-200 mt-8 mb-4">Use Prompts</h3>
            <p className="text-zinc-300 mb-4">
              Prompts appear in the slash command menu. Type <code className="bg-zinc-800 px-2 py-1 rounded">/</code> to 
              see available prompts, then select one to insert the template into your conversation.
            </p>

            <h3 className="text-xl font-semibold text-zinc-200 mt-8 mb-4">Call Tools</h3>
            <p className="text-zinc-300 mb-4">
              Tools are called automatically when relevant. Ask Claude to "run the tests" or "lint the code" 
              and it will use the appropriate tools.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">Best Practices</h2>
            
            <div className="space-y-6">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-amber-400 mb-2">1. Resources Should Be Read-Only</h3>
                <p className="text-zinc-300">
                  Resources provide context, not actions. If you need to modify data, use a tool instead. 
                  This keeps the mental model clear.
                </p>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-amber-400 mb-2">2. Prompts Should Be Self-Contained</h3>
                <p className="text-zinc-300">
                  A good prompt includes all necessary instructions. Reference resources and tools by name 
                  so the AI knows what's available.
                </p>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-amber-400 mb-2">3. Validate Resource Paths</h3>
                <p className="text-zinc-300">
                  If using dynamic resources with templates, always validate paths to prevent directory 
                  traversal or access to sensitive files.
                </p>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-amber-400 mb-2">4. Document Everything</h3>
                <p className="text-zinc-300">
                  Use clear docstrings for all resources, tools, and prompts. The AI uses these descriptions 
                  to understand when and how to use each capability.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">Summary</h2>
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-lg p-6">
              <ul className="text-zinc-300 space-y-3">
                <li><strong className="text-amber-400">Tools:</strong> Actions the AI can perform (run commands, modify data, call APIs)</li>
                <li><strong className="text-amber-400">Resources:</strong> Read-only context (project files, configs, schemas)</li>
                <li><strong className="text-amber-400">Prompts:</strong> Reusable instruction templates (workflows, reviews, analysis)</li>
              </ul>
              <p className="text-zinc-300 mt-4">
                Use all three together for powerful, context-aware AI assistants that understand your project 
                and can help with complex workflows.
              </p>
            </div>
          </section>
        </div>

        <footer className="mt-16 pt-8 border-t border-zinc-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-zinc-500 text-sm">Written by Kai Gritun</p>
              <p className="text-zinc-600 text-sm">Building tools for the AI-native future</p>
            </div>
            <a 
              href="/mcp" 
              className="text-amber-400 hover:text-amber-300 transition-colors text-sm"
            >
              ← Back to MCP Tutorials
            </a>
          </div>
        </footer>
      </article>
    </main>
  )
}
