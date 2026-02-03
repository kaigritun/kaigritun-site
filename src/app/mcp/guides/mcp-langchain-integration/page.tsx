import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MCP with LangChain Integration Guide | Kai Gritun',
  description: 'Learn how to integrate Model Context Protocol (MCP) servers with LangChain to build powerful AI agents with external tools and data sources.',
  keywords: ['MCP LangChain', 'LangChain MCP integration', 'MCP tools LangChain', 'AI agents MCP', 'LangChain tools', 'MCP client Python'],
  openGraph: {
    title: 'MCP with LangChain Integration Guide',
    description: 'Build powerful AI agents by combining LangChain with MCP servers.',
    type: 'article',
  },
}

export default function MCPLangChainIntegration() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <article className="max-w-4xl mx-auto px-6 py-16">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
            <a href="/mcp" className="hover:text-zinc-300">MCP Tutorials</a>
            <span>/</span>
            <a href="/mcp/guides" className="hover:text-zinc-300">Guides</a>
            <span>/</span>
            <span>LangChain Integration</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            MCP with LangChain Integration Guide
          </h1>
          <p className="text-xl text-zinc-400">
            Build powerful AI agents by combining LangChain&apos;s orchestration with MCP&apos;s tool ecosystem.
          </p>
          <div className="flex items-center gap-4 mt-6 text-sm text-zinc-500">
            <span>~12 min read</span>
            <span>•</span>
            <span>Advanced</span>
            <span>•</span>
            <span>Python</span>
          </div>
        </header>

        <div className="prose prose-invert prose-zinc max-w-none">
          <p className="text-lg text-zinc-300">
            LangChain is the go-to framework for building LLM applications. MCP provides a standardized 
            way to connect LLMs to external tools. Together, they create powerful, extensible AI systems.
          </p>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold mt-0">What You&apos;ll Learn</h3>
            <ul className="mb-0">
              <li>Creating an MCP-LangChain bridge</li>
              <li>Wrapping MCP tools as LangChain tools</li>
              <li>Building agents with multiple MCP servers</li>
              <li>Best practices for production use</li>
            </ul>
          </div>

          <h2 id="why-langchain-mcp">Why LangChain + MCP?</h2>
          
          <p><strong>Benefits of this combo:</strong></p>
          <ul>
            <li>Use MCP&apos;s growing ecosystem of pre-built servers</li>
            <li>LangChain&apos;s agent orchestration with MCP&apos;s tool protocol</li>
            <li>Standardized tool interfaces across different LLM providers</li>
            <li>Easy swapping between Claude, GPT-4, and other models</li>
          </ul>

          <h2 id="setup">Setting Up the Integration</h2>

          <h3>Prerequisites</h3>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`pip install langchain langchain-anthropic mcp`}</code>
          </pre>

          <h3>Basic Architecture</h3>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   LangChain     │────▶│   MCP Client    │────▶│   MCP Server    │
│   Agent         │     │   (Bridge)      │     │   (Tools)       │
└─────────────────┘     └─────────────────┘     └─────────────────┘`}</code>
          </pre>

          <h2 id="bridge">Creating the MCP-LangChain Bridge</h2>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`from langchain.tools import BaseTool
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
import asyncio

class MCPToolWrapper(BaseTool):
    """Wraps an MCP tool as a LangChain tool."""
    
    name: str
    description: str
    mcp_session: ClientSession
    mcp_tool_name: str
    
    def _run(self, query: str) -> str:
        return asyncio.run(self._arun(query))
    
    async def _arun(self, query: str) -> str:
        result = await self.mcp_session.call_tool(
            self.mcp_tool_name,
            arguments={"query": query}
        )
        return result.content[0].text

async def get_mcp_tools(server_command: list[str]) -> list[BaseTool]:
    """Connect to MCP server and return LangChain tools."""
    
    server_params = StdioServerParameters(
        command=server_command[0],
        args=server_command[1:],
    )
    
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            
            # Get available tools from MCP server
            tools_response = await session.list_tools()
            
            langchain_tools = []
            for tool in tools_response.tools:
                wrapped = MCPToolWrapper(
                    name=tool.name,
                    description=tool.description,
                    mcp_session=session,
                    mcp_tool_name=tool.name
                )
                langchain_tools.append(wrapped)
            
            return langchain_tools`}</code>
          </pre>

          <h2 id="complete-example">Complete Example: File System Agent</h2>

          <p>Here&apos;s a complete example using the MCP filesystem server with LangChain:</p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`from langchain_anthropic import ChatAnthropic
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate

async def main():
    # Get MCP tools from filesystem server
    tools = await get_mcp_tools([
        "npx", "-y", "@modelcontextprotocol/server-filesystem", 
        "/path/to/allowed/directory"
    ])
    
    # Create LangChain agent
    llm = ChatAnthropic(model="claude-sonnet-4-20250514")
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a helpful assistant with file system access."),
        ("human", "{input}"),
        ("placeholder", "{agent_scratchpad}"),
    ])
    
    agent = create_tool_calling_agent(llm, tools, prompt)
    executor = AgentExecutor(agent=agent, tools=tools, verbose=True)
    
    # Run the agent
    result = await executor.ainvoke({
        "input": "List all Python files in the current directory"
    })
    print(result)

asyncio.run(main())`}</code>
          </pre>

          <h2 id="multiple-servers">Using Multiple MCP Servers</h2>

          <p>Real applications often need multiple tool sources:</p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`async def create_multi_server_agent():
    # Connect to multiple MCP servers
    filesystem_tools = await get_mcp_tools([
        "npx", "-y", "@modelcontextprotocol/server-filesystem", "."
    ])
    
    github_tools = await get_mcp_tools([
        "npx", "-y", "@modelcontextprotocol/server-github"
    ])
    
    postgres_tools = await get_mcp_tools([
        "npx", "-y", "@modelcontextprotocol/server-postgres",
        "postgresql://localhost/mydb"
    ])
    
    # Combine all tools
    all_tools = filesystem_tools + github_tools + postgres_tools
    
    # Create agent with all tools
    llm = ChatAnthropic(model="claude-sonnet-4-20250514")
    agent = create_tool_calling_agent(llm, all_tools, prompt)
    
    return AgentExecutor(agent=agent, tools=all_tools)`}</code>
          </pre>

          <h2 id="best-practices">Best Practices</h2>

          <h3>1. Handle Tool Errors Gracefully</h3>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`class MCPToolWrapper(BaseTool):
    async def _arun(self, query: str) -> str:
        try:
            result = await self.mcp_session.call_tool(
                self.mcp_tool_name,
                arguments={"query": query}
            )
            return result.content[0].text
        except Exception as e:
            return f"Tool error: {str(e)}"`}</code>
          </pre>

          <h3>2. Cache MCP Connections</h3>

          <p>Don&apos;t reconnect for every tool call:</p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`class MCPConnectionManager:
    def __init__(self):
        self._sessions = {}
    
    async def get_session(self, server_id: str, command: list[str]):
        if server_id not in self._sessions:
            self._sessions[server_id] = await self._connect(command)
        return self._sessions[server_id]`}</code>
          </pre>

          <h3>3. Validate Tool Inputs</h3>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`from pydantic import BaseModel, Field

class FileReadInput(BaseModel):
    path: str = Field(description="Path to the file to read")

class MCPToolWrapper(BaseTool):
    args_schema: type[BaseModel] = FileReadInput`}</code>
          </pre>

          <h2 id="llamaindex">LlamaIndex Alternative</h2>

          <p>If you&apos;re using LlamaIndex instead:</p>

          <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <code>{`from llama_index.core.tools import FunctionTool

def create_llamaindex_mcp_tool(mcp_tool, session):
    async def tool_fn(**kwargs):
        result = await session.call_tool(mcp_tool.name, arguments=kwargs)
        return result.content[0].text
    
    return FunctionTool.from_defaults(
        fn=tool_fn,
        name=mcp_tool.name,
        description=mcp_tool.description
    )`}</code>
          </pre>

          <h2 id="common-issues">Common Issues</h2>

          <ul>
            <li><strong>Connection timeouts:</strong> Set appropriate timeouts for MCP server startup</li>
            <li><strong>Tool schema mismatches:</strong> Validate MCP tool schemas match LangChain expectations</li>
            <li><strong>Async/sync mixing:</strong> Use <code>asyncio.run()</code> or proper async context</li>
          </ul>

          <div className="bg-emerald-950 border border-emerald-800 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold mt-0 text-emerald-300">Key Takeaways</h3>
            <ul className="mb-0">
              <li>Wrap MCP tools as LangChain <code>BaseTool</code> instances</li>
              <li>Use connection pooling for multiple servers</li>
              <li>Handle errors gracefully for robust agents</li>
              <li>Validate inputs with Pydantic schemas</li>
            </ul>
          </div>

          <div className="border-t border-zinc-800 mt-12 pt-8">
            <h3 className="text-lg font-semibold">Related Guides</h3>
            <ul>
              <li><a href="/mcp/how-to-build-mcp-server-python" className="text-blue-400 hover:text-blue-300">How to Build MCP Server (Python)</a></li>
              <li><a href="/mcp/guides/mcp-error-handling" className="text-blue-400 hover:text-blue-300">MCP Error Handling Best Practices</a></li>
              <li><a href="/mcp/guides/mcp-production-deployment" className="text-blue-400 hover:text-blue-300">Deploying MCP Servers to Production</a></li>
            </ul>
          </div>
        </div>
      </article>
    </main>
  )
}
