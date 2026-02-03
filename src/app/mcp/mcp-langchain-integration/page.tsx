import Link from "next/link";
import type { Metadata } from "next";
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: "MCP with LangChain Integration (2025 Guide) | Kai Gritun",
  description: "Learn how to integrate MCP servers with LangChain for enhanced AI applications. Connect Claude, GPT-4, and other LLMs to external tools using Model Context Protocol.",
  keywords: ["MCP LangChain", "LangChain MCP integration", "Model Context Protocol LangChain", "LangChain tools", "MCP Python", "AI agents"],
};

export default function MCPLangChainIntegration() {
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
              MCP with LangChain Integration
            </h1>
            <p className="text-gray-400 text-lg mb-4">
              Connect MCP servers to LangChain agents for powerful AI applications that can 
              interact with external tools and data sources.
            </p>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>February 3, 2026</span>
              <span>·</span>
              <span>10 min read</span>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p>
              LangChain is one of the most popular frameworks for building AI applications. It provides 
              abstractions for chains, agents, memory, and tools. MCP (Model Context Protocol) provides 
              a standardized way to expose tools to AI models. Together, they create a powerful combination 
              for building production-ready AI applications.
            </p>
            
            <p>
              In this tutorial, you'll learn how to connect MCP servers to LangChain agents. By the end, 
              your LangChain applications will be able to use any MCP-compatible tool, giving you access 
              to a growing ecosystem of standardized integrations.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4">Why Combine MCP with LangChain?</h2>
            <p>
              Both LangChain and MCP solve the problem of connecting LLMs to external tools, but they 
              approach it differently:
            </p>

            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li><strong>LangChain</strong> — Framework for building AI applications with chains, agents, and memory</li>
              <li><strong>MCP</strong> — Protocol for standardized tool exposure that works across different AI clients</li>
            </ul>

            <p>
              By using MCP servers with LangChain, you get the best of both worlds: LangChain's powerful 
              agent orchestration combined with MCP's standardized, reusable tool integrations. Write 
              an MCP server once, use it with Claude Desktop, LangChain, and any other MCP client.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4">Prerequisites</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Python 3.10 or higher</li>
              <li>Basic familiarity with LangChain</li>
              <li>An MCP server to connect to (we'll use one from a previous tutorial)</li>
              <li>OpenAI API key or Anthropic API key</li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-4">Architecture Overview</h2>
            <p>
              Here's how the integration works:
            </p>
            
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`┌─────────────────────────────────────────────────────────┐
│                   LangChain Agent                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Memory    │  │   Chains    │  │   Tools     │     │
│  └─────────────┘  └─────────────┘  └──────┬──────┘     │
└────────────────────────────────────────────┼────────────┘
                                             │
                                    MCP Client Adapter
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    ▼                        ▼                        ▼
            ┌─────────────┐          ┌─────────────┐          ┌─────────────┐
            │ MCP Server  │          │ MCP Server  │          │ MCP Server  │
            │  (Weather)  │          │ (Database)  │          │   (Files)   │
            └─────────────┘          └─────────────┘          └─────────────┘`}
              </pre>
            </div>

            <p>
              The MCP Client Adapter translates between LangChain's tool interface and the MCP protocol, 
              allowing your agents to seamlessly call MCP tools.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4">Step 1: Install Dependencies</h2>
            <p>First, set up your project and install the required packages:</p>
            
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-green-400 overflow-x-auto">
{`mkdir langchain-mcp-demo
cd langchain-mcp-demo
python -m venv venv
source venv/bin/activate

pip install langchain langchain-openai mcp httpx`}
              </pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Step 2: Create the MCP-LangChain Adapter</h2>
            <p>
              We need to create an adapter that converts MCP tools into LangChain tools. Create a file 
              called <code className="bg-gray-800 px-2 py-1 rounded">mcp_adapter.py</code>:
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`"""
MCP to LangChain Adapter
Converts MCP tools into LangChain-compatible tools.
"""
import asyncio
import json
from typing import Any, Dict, List, Optional
from langchain.tools import BaseTool
from pydantic import BaseModel, Field
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client


class MCPToolAdapter(BaseTool):
    """Wraps an MCP tool as a LangChain tool."""
    
    name: str
    description: str
    session: Any  # MCP ClientSession
    tool_name: str
    args_schema: Optional[type[BaseModel]] = None
    
    class Config:
        arbitrary_types_allowed = True
    
    def _run(self, **kwargs) -> str:
        """Synchronous execution - wraps async call."""
        return asyncio.run(self._arun(**kwargs))
    
    async def _arun(self, **kwargs) -> str:
        """Call the MCP tool asynchronously."""
        try:
            result = await self.session.call_tool(
                self.tool_name,
                arguments=kwargs
            )
            # Extract text content from result
            if result.content:
                return "\\n".join(
                    c.text for c in result.content 
                    if hasattr(c, 'text')
                )
            return "Tool executed successfully (no output)"
        except Exception as e:
            return f"Error calling tool: {str(e)}"


async def create_mcp_tools(
    server_command: str,
    server_args: List[str] = None
) -> tuple[List[BaseTool], Any]:
    """
    Connect to an MCP server and create LangChain tools from it.
    
    Args:
        server_command: Command to run the MCP server (e.g., "python")
        server_args: Arguments for the server command (e.g., ["server.py"])
    
    Returns:
        Tuple of (list of LangChain tools, MCP session)
    """
    server_params = StdioServerParameters(
        command=server_command,
        args=server_args or [],
    )
    
    # Connect to the MCP server
    read, write = await stdio_client(server_params).__aenter__()
    session = ClientSession(read, write)
    await session.__aenter__()
    await session.initialize()
    
    # List available tools from the server
    tools_response = await session.list_tools()
    
    langchain_tools = []
    for tool in tools_response.tools:
        # Create a dynamic Pydantic model for the tool's arguments
        if tool.inputSchema and "properties" in tool.inputSchema:
            fields = {}
            for prop_name, prop_info in tool.inputSchema["properties"].items():
                field_type = str  # Default to string
                if prop_info.get("type") == "integer":
                    field_type = int
                elif prop_info.get("type") == "number":
                    field_type = float
                elif prop_info.get("type") == "boolean":
                    field_type = bool
                
                description = prop_info.get("description", "")
                required = prop_name in tool.inputSchema.get("required", [])
                
                if required:
                    fields[prop_name] = (field_type, Field(description=description))
                else:
                    fields[prop_name] = (
                        Optional[field_type], 
                        Field(default=None, description=description)
                    )
            
            args_schema = type(f"{tool.name}Args", (BaseModel,), fields)
        else:
            args_schema = None
        
        # Create the LangChain tool
        lc_tool = MCPToolAdapter(
            name=tool.name,
            description=tool.description or f"MCP tool: {tool.name}",
            session=session,
            tool_name=tool.name,
            args_schema=args_schema,
        )
        langchain_tools.append(lc_tool)
    
    return langchain_tools, session`}
              </pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Step 3: Create the LangChain Agent</h2>
            <p>
              Now let's create an agent that uses MCP tools. Create <code className="bg-gray-800 px-2 py-1 rounded">agent.py</code>:
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`"""
LangChain Agent with MCP Tools
"""
import asyncio
import os
from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_openai_tools_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from mcp_adapter import create_mcp_tools


async def main():
    # Connect to your MCP server and get tools
    # Adjust the command based on your MCP server location
    tools, session = await create_mcp_tools(
        server_command="python",
        server_args=["path/to/your/mcp/server.py"]
    )
    
    print(f"Loaded {len(tools)} tools from MCP server:")
    for tool in tools:
        print(f"  - {tool.name}: {tool.description[:50]}...")
    
    # Create the LLM
    llm = ChatOpenAI(
        model="gpt-4-turbo-preview",
        temperature=0,
    )
    
    # Create the prompt
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a helpful assistant with access to external tools.
Use the available tools to help answer questions accurately.
Always explain what you're doing when using tools."""),
        MessagesPlaceholder(variable_name="chat_history", optional=True),
        ("human", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ])
    
    # Create the agent
    agent = create_openai_tools_agent(llm, tools, prompt)
    agent_executor = AgentExecutor(
        agent=agent,
        tools=tools,
        verbose=True,
        handle_parsing_errors=True,
    )
    
    # Run a test query
    print("\\n" + "="*50)
    print("Testing the agent...")
    print("="*50 + "\\n")
    
    result = await agent_executor.ainvoke({
        "input": "What's the weather like in Tokyo and Paris?"
    })
    
    print("\\nAgent Response:")
    print(result["output"])
    
    # Cleanup
    await session.__aexit__(None, None, None)


if __name__ == "__main__":
    asyncio.run(main())`}
              </pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Step 4: Using Multiple MCP Servers</h2>
            <p>
              One of the powerful aspects of this integration is the ability to connect multiple MCP 
              servers to a single agent. Here's how to aggregate tools from multiple servers:
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`async def create_multi_server_agent():
    """Create an agent with tools from multiple MCP servers."""
    
    all_tools = []
    sessions = []
    
    # Connect to weather server
    weather_tools, weather_session = await create_mcp_tools(
        server_command="python",
        server_args=["servers/weather_server.py"]
    )
    all_tools.extend(weather_tools)
    sessions.append(weather_session)
    
    # Connect to database server
    db_tools, db_session = await create_mcp_tools(
        server_command="python",
        server_args=["servers/database_server.py"]
    )
    all_tools.extend(db_tools)
    sessions.append(db_session)
    
    # Connect to file server
    file_tools, file_session = await create_mcp_tools(
        server_command="python",
        server_args=["servers/file_server.py"]
    )
    all_tools.extend(file_tools)
    sessions.append(file_session)
    
    print(f"Total tools loaded: {len(all_tools)}")
    
    # Create agent with all tools
    llm = ChatOpenAI(model="gpt-4-turbo-preview")
    # ... rest of agent creation
    
    return agent_executor, sessions`}
              </pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Step 5: Adding Conversation Memory</h2>
            <p>
              LangChain excels at maintaining conversation context. Here's how to add memory 
              to your MCP-powered agent:
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`from langchain.memory import ConversationBufferMemory

# Create memory
memory = ConversationBufferMemory(
    memory_key="chat_history",
    return_messages=True
)

# Update the agent executor
agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    memory=memory,
    verbose=True,
)

# Now the agent remembers previous interactions
await agent_executor.ainvoke({"input": "What's the weather in Tokyo?"})
await agent_executor.ainvoke({"input": "How about compared to yesterday?"})`}
              </pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Using with Anthropic Claude</h2>
            <p>
              You can also use Claude instead of GPT-4. Install the Anthropic integration:
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-green-400 overflow-x-auto">
{`pip install langchain-anthropic`}
              </pre>
            </div>

            <p>Then swap the LLM:</p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(
    model="claude-3-opus-20240229",
    temperature=0,
)

# Use create_tool_calling_agent for Claude
from langchain.agents import create_tool_calling_agent

agent = create_tool_calling_agent(llm, tools, prompt)`}
              </pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Production Considerations</h2>
            <p>
              When deploying MCP+LangChain applications to production, keep these points in mind:
            </p>

            <ul className="list-disc list-inside space-y-2 text-gray-300 my-4">
              <li><strong>Connection Management</strong> — MCP connections should be pooled and reused rather than created per-request</li>
              <li><strong>Error Handling</strong> — Wrap tool calls in try-catch and provide fallback responses</li>
              <li><strong>Timeouts</strong> — Set reasonable timeouts for MCP tool calls to prevent hanging</li>
              <li><strong>Logging</strong> — Log all tool calls for debugging and monitoring</li>
              <li><strong>Rate Limiting</strong> — Implement rate limiting if your MCP servers have usage limits</li>
            </ul>

            <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-6 my-8">
              <h3 className="font-semibold mb-2">📚 Related Tutorials</h3>
              <ul className="space-y-2 text-gray-300">
                <li>→ <Link href="/mcp/how-to-build-mcp-server-python" className="text-blue-400 hover:underline">How to Build an MCP Server in Python</Link></li>
                <li>→ <Link href="/mcp/building-multi-tool-servers" className="text-blue-400 hover:underline">Building Multi-Tool MCP Servers</Link></li>
                <li>→ <Link href="/mcp/mcp-error-handling" className="text-blue-400 hover:underline">MCP Error Handling Best Practices</Link></li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Summary</h2>
            <p>
              Integrating MCP with LangChain gives you the flexibility of LangChain's agent framework 
              combined with the standardization of the Model Context Protocol. You can reuse MCP servers 
              across different applications while leveraging LangChain's memory, chains, and orchestration 
              capabilities.
            </p>

            <p>
              The adapter pattern shown here can be extended to support additional MCP features like 
              resources and prompts, making your LangChain agents even more powerful.
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
