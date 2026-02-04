import Link from "next/link";
import type { Metadata } from "next";
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: "MCP with OpenAI: Using Model Context Protocol Beyond Claude | Kai Gritun",
  description: "Learn how to use MCP servers with OpenAI GPT-4 and other models. Build a bridge layer to leverage your MCP infrastructure across AI providers.",
  keywords: ["MCP OpenAI", "MCP GPT-4", "Model Context Protocol OpenAI", "MCP multi-provider", "MCP bridge", "MCP function calling"],
};

export default function MCPOpenAIIntegration() {
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
              MCP with OpenAI: Using Model Context Protocol Beyond Claude
            </h1>
            <p className="text-gray-400 text-lg mb-4">
              While MCP was created by Anthropic for Claude, you can use MCP servers with OpenAI models too. 
              Here&apos;s how to bridge the gap.
            </p>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>February 4, 2026</span>
              <span>·</span>
              <span>10 min read</span>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <h2 className="text-2xl font-bold mt-12 mb-4">The Challenge</h2>
            <p>MCP is a protocol, not a Claude-exclusive feature. The protocol itself is provider-agnostic—the challenge is that OpenAI doesn&apos;t natively speak MCP. You need a translation layer.</p>

            <h2 className="text-2xl font-bold mt-12 mb-4">Architecture Overview</h2>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`┌─────────────┐     ┌──────────────┐     ┌────────────┐
│   OpenAI    │────▶│  MCP Bridge  │────▶│ MCP Server │
│   Client    │◀────│   (Python)   │◀────│   (Any)    │
└─────────────┘     └──────────────┘     └────────────┘`}</code>
            </pre>
            <p>The bridge converts OpenAI function calls to MCP tool invocations and back.</p>

            <h2 className="text-2xl font-bold mt-12 mb-4">Building the Bridge</h2>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`import openai
from mcp.client import Client as MCPClient
import json

class MCPOpenAIBridge:
    def __init__(self, mcp_server_url):
        self.mcp = MCPClient(mcp_server_url)
        self.openai = openai.Client()
    
    async def get_openai_tools(self):
        """Convert MCP tools to OpenAI function schema"""
        mcp_tools = await self.mcp.list_tools()
        
        openai_functions = []
        for tool in mcp_tools:
            openai_functions.append({
                "type": "function",
                "function": {
                    "name": tool.name,
                    "description": tool.description,
                    "parameters": tool.input_schema
                }
            })
        return openai_functions
    
    async def handle_function_call(self, function_name, arguments):
        """Route OpenAI function calls to MCP server"""
        result = await self.mcp.call_tool(function_name, arguments)
        return result.content
    
    async def chat(self, messages):
        tools = await self.get_openai_tools()
        
        response = self.openai.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            tools=tools
        )
        
        # Handle tool calls
        if response.choices[0].message.tool_calls:
            for call in response.choices[0].message.tool_calls:
                result = await self.handle_function_call(
                    call.function.name,
                    json.loads(call.function.arguments)
                )
                messages.append({
                    "role": "tool",
                    "tool_call_id": call.id,
                    "content": str(result)
                })
            
            # Get final response
            response = self.openai.chat.completions.create(
                model="gpt-4o",
                messages=messages,
                tools=tools
            )
        
        return response.choices[0].message.content`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">Usage Example</h2>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`async def main():
    bridge = MCPOpenAIBridge("http://localhost:3000")
    
    response = await bridge.chat([
        {"role": "user", "content": "What files are in my project directory?"}
    ])
    
    print(response)`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">Schema Translation Gotchas</h2>
            <p>MCP and OpenAI have slightly different schema expectations:</p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`def translate_schema(mcp_schema):
    """Handle MCP → OpenAI schema differences"""
    openai_schema = mcp_schema.copy()
    
    # OpenAI requires 'type' at root level
    if "type" not in openai_schema:
        openai_schema["type"] = "object"
    
    # OpenAI doesn't support some JSON Schema features
    if "additionalProperties" in openai_schema:
        del openai_schema["additionalProperties"]
    
    return openai_schema`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">When This Makes Sense</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li><strong>Existing MCP infrastructure</strong> - Don&apos;t rebuild tools for each provider</li>
              <li><strong>Model comparison</strong> - Test same tools across Claude and GPT-4</li>
              <li><strong>Fallback strategy</strong> - If one provider is down, switch to another</li>
              <li><strong>Cost optimization</strong> - Use cheaper models for simple tool operations</li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-4">Limitations</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li><strong>Context handling differs</strong> - Claude and GPT handle context windows differently</li>
              <li><strong>No native MCP features</strong> - Resources and prompts won&apos;t work the same way</li>
              <li><strong>Latency overhead</strong> - Extra hop through the bridge</li>
              <li><strong>Error handling</strong> - Need to translate MCP errors to OpenAI format</li>
            </ol>

            <h2 className="text-2xl font-bold mt-12 mb-4">Alternative: LangChain Integration</h2>
            <p>If you&apos;re already using LangChain, it has MCP support built in:</p>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`from langchain_mcp import MCPToolkit
from langchain_openai import ChatOpenAI

toolkit = MCPToolkit(server_url="http://localhost:3000")
tools = toolkit.get_tools()

llm = ChatOpenAI(model="gpt-4o")
agent = create_tool_calling_agent(llm, tools, prompt)`}</code>
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-4">Conclusion</h2>
            <p>MCP doesn&apos;t lock you into Claude. With a simple bridge layer, you can use your MCP servers with OpenAI, Google&apos;s Gemini, or any model that supports function calling. Build your tools once, use them everywhere.</p>
          </div>

          {/* CTA */}
          <div className="mt-12 p-6 bg-gray-900 rounded-lg border border-gray-800">
            <h3 className="text-xl font-bold mb-2">Get the MCP Starter Kit</h3>
            <p className="text-gray-400 mb-4">Templates, examples, and a quickstart guide for building MCP servers.</p>
            <EmailSignup site="mcp" buttonText="Download Free Kit" />
          </div>

          {/* Related */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <h3 className="text-xl font-bold mb-4">Related Tutorials</h3>
            <div className="grid gap-4">
              <Link href="/mcp/how-to-build-mcp-server-python" className="block p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
                <span className="font-medium">How to Build an MCP Server in Python</span>
                <p className="text-sm text-gray-400 mt-1">Step-by-step guide to building your first MCP server.</p>
              </Link>
              <Link href="/mcp/mcp-vs-function-calling" className="block p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
                <span className="font-medium">MCP vs Function Calling</span>
                <p className="text-sm text-gray-400 mt-1">Understanding when to use MCP vs native function calling.</p>
              </Link>
              <Link href="/mcp/mcp-langchain-integration" className="block p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
                <span className="font-medium">MCP LangChain Integration</span>
                <p className="text-sm text-gray-400 mt-1">Using MCP with LangChain agents.</p>
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-6">
        <div className="max-w-4xl mx-auto text-center text-gray-500 text-sm">
          <p>© 2026 Kai Gritun. Building tools for developers.</p>
        </div>
      </footer>
    </div>
  );
}
