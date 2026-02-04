import { Metadata } from 'next';
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: 'MCP vs LangChain: When to Use Each for AI Development | MCP Tutorials',
  description: 'Compare MCP and LangChain for building AI applications. Learn when to use Anthropic\'s Model Context Protocol vs LangChain framework, with code examples and use cases.',
  keywords: ['MCP vs LangChain', 'Model Context Protocol', 'LangChain comparison', 'AI development', 'LLM tools'],
  openGraph: {
    title: 'MCP vs LangChain: When to Use Each for AI Development',
    description: 'Comprehensive comparison of MCP and LangChain for building AI-powered applications.',
    type: 'article',
  },
}

export default function MCPvsLangChain() {
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
            <span className="px-3 py-1 text-sm font-medium bg-purple-500/20 text-purple-300 rounded-full">Comparison</span>
            <span className="text-gray-400 text-sm">12 min read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            MCP vs LangChain: When to Use Each
          </h1>
          <p className="text-xl text-gray-300">
            Two powerful approaches to building AI applications. Learn when each tool shines and how to combine them effectively.
          </p>
        </header>

        {/* Table of Contents */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-12 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Contents</h2>
          <ul className="space-y-2 text-gray-300">
            <li><a href="#what-is-mcp" className="hover:text-purple-400">→ What is MCP?</a></li>
            <li><a href="#what-is-langchain" className="hover:text-purple-400">→ What is LangChain?</a></li>
            <li><a href="#when-mcp" className="hover:text-purple-400">→ When to Use MCP</a></li>
            <li><a href="#when-langchain" className="hover:text-purple-400">→ When to Use LangChain</a></li>
            <li><a href="#use-both" className="hover:text-purple-400">→ Can You Use Both?</a></li>
            <li><a href="#code-comparison" className="hover:text-purple-400">→ Code Comparison</a></li>
            <li><a href="#bottom-line" className="hover:text-purple-400">→ The Bottom Line</a></li>
          </ul>
        </div>

        {/* Article Content */}
        <article className="prose prose-invert prose-lg max-w-none">
          
          {/* Intro */}
          <section className="mb-16">
            <p className="text-gray-300 text-lg leading-relaxed">
              The AI tooling landscape has two major players for building LLM-powered applications: Anthropic's Model Context Protocol (MCP) and LangChain. Both let you extend AI models with external capabilities, but they solve different problems.
            </p>
          </section>

          {/* What is MCP */}
          <section id="what-is-mcp" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">What is MCP?</h2>
            
            <p className="text-gray-300 mb-6">
              MCP (Model Context Protocol) is a standardized protocol for connecting AI assistants to external tools and data. Think of it as a universal adapter—any MCP-compatible client (Claude Desktop, Continue, Zed) can connect to any MCP server without custom integration code.
            </p>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 mb-6">
              <h4 className="text-white font-semibold mb-4">Key Characteristics</h4>
              <ul className="space-y-3 text-gray-300">
                <li><strong className="text-purple-400">Protocol-first:</strong> Defines how tools communicate, not what they do</li>
                <li><strong className="text-purple-400">Stateless by design:</strong> Each request is independent</li>
                <li><strong className="text-purple-400">Transport-agnostic:</strong> Works over stdio, HTTP, or custom transports</li>
                <li><strong className="text-purple-400">Lightweight:</strong> A basic MCP server is ~50 lines of code</li>
              </ul>
            </div>
          </section>

          {/* What is LangChain */}
          <section id="what-is-langchain" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">What is LangChain?</h2>
            
            <p className="text-gray-300 mb-6">
              LangChain is a framework for building LLM applications. It provides abstractions for chains, agents, memory, and retrieval—essentially a toolkit for orchestrating complex AI workflows.
            </p>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 mb-6">
              <h4 className="text-white font-semibold mb-4">Key Characteristics</h4>
              <ul className="space-y-3 text-gray-300">
                <li><strong className="text-blue-400">Framework-first:</strong> Provides building blocks you compose</li>
                <li><strong className="text-blue-400">Stateful options:</strong> Built-in memory and conversation management</li>
                <li><strong className="text-blue-400">Provider-agnostic:</strong> Works with OpenAI, Anthropic, local models</li>
                <li><strong className="text-blue-400">Comprehensive:</strong> Covers the full stack from prompts to deployment</li>
              </ul>
            </div>
          </section>

          {/* When to Use MCP */}
          <section id="when-mcp" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">When to Use MCP</h2>
            
            <p className="text-gray-300 mb-6">Choose MCP when you need:</p>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                <h4 className="text-white font-semibold mb-2">🔌 Universal Tool Compatibility</h4>
                <p className="text-gray-400 text-sm">Build once, use everywhere. An MCP server for your database works with any MCP-compatible client.</p>
              </div>
              <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                <h4 className="text-white font-semibold mb-2">🛠️ Simple Tool Exposure</h4>
                <p className="text-gray-400 text-sm">You have an API or service and want AI to access it. MCP makes this trivial.</p>
              </div>
              <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                <h4 className="text-white font-semibold mb-2">🤖 Claude-Specific Workflows</h4>
                <p className="text-gray-400 text-sm">MCP is Anthropic's native protocol. Claude Desktop and Claude.ai use it directly.</p>
              </div>
              <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                <h4 className="text-white font-semibold mb-2">📦 Minimal Dependencies</h4>
                <p className="text-gray-400 text-sm">MCP servers have near-zero dependencies. No framework lock-in.</p>
              </div>
            </div>
          </section>

          {/* When to Use LangChain */}
          <section id="when-langchain" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">When to Use LangChain</h2>
            
            <p className="text-gray-300 mb-6">Choose LangChain when you need:</p>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                <h4 className="text-white font-semibold mb-2">🔄 Complex Orchestration</h4>
                <p className="text-gray-400 text-sm">Multi-step workflows, conditional logic, parallel tool calls.</p>
              </div>
              <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                <h4 className="text-white font-semibold mb-2">🧠 Memory and Context</h4>
                <p className="text-gray-400 text-sm">Conversations that remember previous interactions.</p>
              </div>
              <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                <h4 className="text-white font-semibold mb-2">📚 RAG Pipelines</h4>
                <p className="text-gray-400 text-sm">Sophisticated document retrieval with vector stores.</p>
              </div>
              <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                <h4 className="text-white font-semibold mb-2">🔀 Provider Flexibility</h4>
                <p className="text-gray-400 text-sm">Switch between OpenAI, Anthropic, local models without code changes.</p>
              </div>
            </div>
          </section>

          {/* Can You Use Both */}
          <section id="use-both" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Can You Use Both?</h2>
            
            <p className="text-gray-300 mb-6">
              <strong className="text-green-400">Yes.</strong> Common patterns include:
            </p>

            <div className="space-y-4 mb-8">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-2">LangChain as MCP Client</h4>
                <p className="text-gray-400">Use LangChain's agent framework to call MCP servers</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-2">MCP for Tools, LangChain for Orchestration</h4>
                <p className="text-gray-400">Build simple MCP servers for data access, use LangChain to orchestrate them</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-2">Gradual Migration</h4>
                <p className="text-gray-400">Start with LangChain, extract stable tools into MCP servers</p>
              </div>
            </div>
          </section>

          {/* Code Comparison */}
          <section id="code-comparison" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Code Comparison</h2>
            
            <p className="text-gray-300 mb-6">
              Here's the same tool implemented in both approaches:
            </p>

            <div className="bg-gray-950 rounded-lg p-6 mb-6 overflow-x-auto">
              <div className="text-xs text-gray-500 mb-2">MCP Server (Python)</div>
              <pre className="text-sm text-gray-300"><code>{`from mcp.server import Server
import mcp.types as types

server = Server("weather")

@server.list_tools()
async def list_tools():
    return [types.Tool(
        name="get_weather",
        description="Get current weather",
        inputSchema={
            "type": "object",
            "properties": {
                "city": {"type": "string"}
            }
        }
    )]

@server.call_tool()
async def call_tool(name: str, arguments: dict):
    if name == "get_weather":
        return f"Weather in {arguments['city']}: 72°F, sunny"`}</code></pre>
            </div>

            <div className="bg-gray-950 rounded-lg p-6 mb-6 overflow-x-auto">
              <div className="text-xs text-gray-500 mb-2">LangChain Tool (Python)</div>
              <pre className="text-sm text-gray-300"><code>{`from langchain.tools import tool
from langchain.agents import create_react_agent

@tool
def get_weather(city: str) -> str:
    """Get current weather for a city"""
    return f"Weather in {city}: 72°F, sunny"

agent = create_react_agent(llm, [get_weather], prompt)`}</code></pre>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
              <p className="text-amber-200 text-sm">
                <strong>Note:</strong> MCP is more verbose but produces a reusable, portable server. LangChain is more concise but tightly coupled to the framework.
              </p>
            </div>
          </section>

          {/* Bottom Line */}
          <section id="bottom-line" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">The Bottom Line</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-purple-500/10 rounded-lg p-6 border border-purple-500/30">
                <h3 className="text-xl font-semibold text-purple-300 mb-3">MCP</h3>
                <p className="text-gray-300">Universal tool protocol. Build interoperable tools.</p>
                <p className="text-gray-400 text-sm mt-3">Best for: Exposing existing services, Claude integration, portable tools</p>
              </div>
              <div className="bg-blue-500/10 rounded-lg p-6 border border-blue-500/30">
                <h3 className="text-xl font-semibold text-blue-300 mb-3">LangChain</h3>
                <p className="text-gray-300">Application framework. Build complex AI apps.</p>
                <p className="text-gray-400 text-sm mt-3">Best for: New AI applications, RAG pipelines, multi-model workflows</p>
              </div>
            </div>

            <p className="text-gray-300 text-lg">
              <strong>Start with MCP</strong> if you're exposing existing services. <strong>Start with LangChain</strong> if you're building a new AI application from scratch. <strong>Use both</strong> when you need portable tools inside sophisticated workflows.
            </p>
          </section>

        </article>

        {/* Email Signup */}
        <div className="my-16">
          <EmailSignup />
        </div>

        {/* Related Links */}
        <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-8 border border-purple-500/30 mb-16">
          <h3 className="text-xl font-semibold text-white mb-4">Continue Learning</h3>
          <ul className="space-y-2 text-gray-300">
            <li>→ <a href="/mcp/mcp-typescript-tutorial" className="text-purple-400 hover:text-purple-300">Build Your First MCP Server in TypeScript</a></li>
            <li>→ <a href="/mcp/mcp-resources-guide" className="text-purple-400 hover:text-purple-300">MCP Resources Deep Dive</a></li>
            <li>→ <a href="/mcp/mcp-langchain-integration" className="text-purple-400 hover:text-purple-300">Integrating MCP with LangChain</a></li>
          </ul>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <a href="/mcp" className="text-purple-400 hover:text-purple-300">← Back to MCP Tutorials</a>
            <span className="text-gray-500 text-sm">February 3, 2026</span>
          </div>
        </footer>
      </div>
    </main>
  )
}
