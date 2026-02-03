import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Building MCP Servers with LangChain and LlamaIndex | MCP Tutorials",
  description:
    "Learn how to integrate Model Context Protocol with LangChain and LlamaIndex. Build powerful AI applications combining MCP tools with popular LLM frameworks.",
  keywords: [
    "MCP LangChain",
    "MCP LlamaIndex",
    "Model Context Protocol integration",
    "LangChain MCP tools",
    "LlamaIndex MCP",
    "AI framework integration",
  ],
  openGraph: {
    title: "Building MCP Servers with LangChain and LlamaIndex",
    description:
      "Integrate MCP with LangChain and LlamaIndex to build powerful AI applications.",
    type: "article",
  },
};

export default function MCPLangChainLlamaIndex() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <header className="mb-12">
          <a
            href="/mcp"
            className="text-blue-400 hover:text-blue-300 text-sm mb-4 inline-block"
          >
            ← Back to MCP Tutorials
          </a>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Building MCP Servers with LangChain and LlamaIndex
          </h1>
          <p className="text-gray-400 text-lg">
            Model Context Protocol works beautifully with popular LLM frameworks.
            Here&apos;s how to integrate MCP with LangChain and LlamaIndex.
          </p>
          <div className="mt-4 flex gap-4 text-sm text-gray-500">
            <span>📅 February 2025</span>
            <span>⏱️ 12 min read</span>
          </div>
        </header>

        <article className="prose prose-invert prose-lg max-w-none">
          <h2 id="why-combine">Why Combine MCP with LLM Frameworks?</h2>
          <p>
            MCP gives your AI applications access to external tools and data sources.
            LangChain and LlamaIndex provide the orchestration layer. Together,
            they&apos;re unstoppable:
          </p>
          <ul>
            <li><strong>MCP</strong>: Standardized tool interface, secure connections, typed schemas</li>
            <li><strong>LangChain</strong>: Agent orchestration, chains, memory management</li>
            <li><strong>LlamaIndex</strong>: RAG pipelines, document processing, vector stores</li>
          </ul>

          <h2 id="langchain">MCP + LangChain Integration</h2>

          <h3>Setting Up the MCP Tool Provider</h3>
          <pre className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
            <code>{`from langchain.tools import BaseTool
from langchain.agents import initialize_agent, AgentType
from mcp import Client, StdioServerParameters

class MCPTool(BaseTool):
    """Wrapper to expose MCP tools to LangChain agents."""
    
    name: str
    description: str
    mcp_client: Client
    tool_name: str
    
    def _run(self, query: str) -> str:
        result = self.mcp_client.call_tool(
            self.tool_name,
            {"input": query}
        )
        return result.content[0].text
    
    async def _arun(self, query: str) -> str:
        result = await self.mcp_client.call_tool_async(
            self.tool_name,
            {"input": query}
        )
        return result.content[0].text`}</code>
          </pre>

          <h3>Connecting to an MCP Server</h3>
          <pre className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
            <code>{`import asyncio
from mcp import Client, StdioServerParameters

async def create_langchain_tools():
    # Connect to MCP server
    server_params = StdioServerParameters(
        command="npx",
        args=["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"]
    )
    
    async with Client(server_params) as client:
        # List available tools
        tools = await client.list_tools()
        
        # Convert to LangChain tools
        langchain_tools = []
        for tool in tools:
            langchain_tools.append(MCPTool(
                name=tool.name,
                description=tool.description,
                mcp_client=client,
                tool_name=tool.name
            ))
        
        return langchain_tools`}</code>
          </pre>

          <h3>Building a LangChain Agent with MCP Tools</h3>
          <pre className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
            <code>{`from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain.prompts import ChatPromptTemplate

async def build_mcp_agent():
    # Get MCP tools as LangChain tools
    tools = await create_langchain_tools()
    
    # Initialize LLM
    llm = ChatOpenAI(model="gpt-4", temperature=0)
    
    # Create agent
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a helpful assistant with access to file system tools."),
        ("human", "{input}"),
        ("placeholder", "{agent_scratchpad}")
    ])
    
    agent = create_openai_functions_agent(llm, tools, prompt)
    executor = AgentExecutor(agent=agent, tools=tools, verbose=True)
    
    return executor

# Run the agent
async def main():
    agent = await build_mcp_agent()
    result = await agent.ainvoke({
        "input": "List all Python files in the project directory"
    })
    print(result)

asyncio.run(main())`}</code>
          </pre>

          <h2 id="llamaindex">MCP + LlamaIndex Integration</h2>

          <h3>Creating an MCP-Powered Query Engine</h3>
          <pre className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
            <code>{`from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.core.tools import FunctionTool
from llama_index.core.agent import ReActAgent
from mcp import Client

class MCPLlamaIndexBridge:
    """Bridge MCP tools to LlamaIndex agents."""
    
    def __init__(self, mcp_client: Client):
        self.client = mcp_client
    
    def create_tool(self, mcp_tool_name: str, description: str):
        """Convert an MCP tool to a LlamaIndex FunctionTool."""
        
        def tool_fn(query: str) -> str:
            result = self.client.call_tool(
                mcp_tool_name,
                {"input": query}
            )
            return result.content[0].text
        
        return FunctionTool.from_defaults(
            fn=tool_fn,
            name=mcp_tool_name,
            description=description
        )`}</code>
          </pre>

          <h3>Building a RAG Pipeline with MCP Data Sources</h3>
          <pre className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
            <code>{`from llama_index.core import VectorStoreIndex, Document
from llama_index.llms.openai import OpenAI

async def build_mcp_rag_pipeline():
    # Connect to MCP server that provides documents
    server_params = StdioServerParameters(
        command="node",
        args=["./my-mcp-server.js"]
    )
    
    async with Client(server_params) as client:
        # Fetch documents via MCP
        result = await client.call_tool("list_documents", {})
        
        # Convert to LlamaIndex documents
        documents = []
        for doc in result.content:
            documents.append(Document(text=doc.text))
        
        # Build index
        index = VectorStoreIndex.from_documents(documents)
        
        # Create query engine
        query_engine = index.as_query_engine(
            llm=OpenAI(model="gpt-4"),
            similarity_top_k=5
        )
        
        return query_engine`}</code>
          </pre>

          <h3>Hybrid Agent: RAG + MCP Tools</h3>
          <pre className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
            <code>{`from llama_index.core.agent import ReActAgent
from llama_index.core.tools import QueryEngineTool

async def build_hybrid_agent():
    # Get RAG query engine
    rag_engine = await build_mcp_rag_pipeline()
    rag_tool = QueryEngineTool.from_defaults(
        query_engine=rag_engine,
        name="document_search",
        description="Search through project documentation"
    )
    
    # Get MCP tools
    mcp_bridge = MCPLlamaIndexBridge(mcp_client)
    file_tool = mcp_bridge.create_tool(
        "read_file",
        "Read contents of a specific file"
    )
    
    # Combine into ReAct agent
    agent = ReActAgent.from_tools(
        tools=[rag_tool, file_tool],
        llm=OpenAI(model="gpt-4"),
        verbose=True
    )
    
    return agent`}</code>
          </pre>

          <h2 id="best-practices">Best Practices</h2>

          <h3>1. Connection Management</h3>
          <p>Keep MCP connections alive for the session rather than reconnecting per-call:</p>
          <pre className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
            <code>{`class MCPConnectionPool:
    def __init__(self):
        self.connections = {}
    
    async def get_client(self, server_name: str, params: StdioServerParameters):
        if server_name not in self.connections:
            client = Client(params)
            await client.connect()
            self.connections[server_name] = client
        return self.connections[server_name]
    
    async def close_all(self):
        for client in self.connections.values():
            await client.close()`}</code>
          </pre>

          <h3>2. Error Handling</h3>
          <p>Wrap MCP calls with proper error handling:</p>
          <pre className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
            <code>{`class RobustMCPTool(BaseTool):
    def _run(self, query: str) -> str:
        try:
            result = self.mcp_client.call_tool(self.tool_name, {"input": query})
            return result.content[0].text
        except ConnectionError:
            return "Tool temporarily unavailable. Please try again."
        except TimeoutError:
            return "Tool request timed out. Try a simpler query."
        except Exception as e:
            return f"Tool error: {str(e)}"`}</code>
          </pre>

          <h3>3. Caching Responses</h3>
          <p>For expensive MCP operations, add caching:</p>
          <pre className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
            <code>{`from functools import lru_cache
import hashlib

class CachedMCPTool(BaseTool):
    @lru_cache(maxsize=100)
    def _cached_call(self, query_hash: str, query: str) -> str:
        result = self.mcp_client.call_tool(self.tool_name, {"input": query})
        return result.content[0].text
    
    def _run(self, query: str) -> str:
        query_hash = hashlib.md5(query.encode()).hexdigest()
        return self._cached_call(query_hash, query)`}</code>
          </pre>

          <h2 id="example">Real-World Example: Code Review Agent</h2>
          <p>Here&apos;s a complete example combining everything:</p>
          <pre className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
            <code>{`from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_openai_functions_agent
from mcp import Client, StdioServerParameters

async def build_code_review_agent():
    # MCP servers for different capabilities
    filesystem_params = StdioServerParameters(
        command="npx",
        args=["-y", "@modelcontextprotocol/server-filesystem", "./src"]
    )
    
    github_params = StdioServerParameters(
        command="npx", 
        args=["-y", "@modelcontextprotocol/server-github"]
    )
    
    # Connect to both
    fs_client = Client(filesystem_params)
    gh_client = Client(github_params)
    await fs_client.connect()
    await gh_client.connect()
    
    # Build tools
    tools = [
        MCPTool(name="read_file", description="Read source file", 
                mcp_client=fs_client, tool_name="read_file"),
        MCPTool(name="list_files", description="List files in directory",
                mcp_client=fs_client, tool_name="list_directory"),
        MCPTool(name="get_pr", description="Get pull request details",
                mcp_client=gh_client, tool_name="get_pull_request"),
        MCPTool(name="add_comment", description="Add PR comment",
                mcp_client=gh_client, tool_name="add_comment"),
    ]
    
    # Create agent
    llm = ChatOpenAI(model="gpt-4", temperature=0)
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a code review assistant. Review pull requests by:
        1. Reading the changed files
        2. Analyzing code quality and potential issues
        3. Adding helpful comments to the PR"""),
        ("human", "{input}"),
        ("placeholder", "{agent_scratchpad}")
    ])
    
    agent = create_openai_functions_agent(llm, tools, prompt)
    return AgentExecutor(agent=agent, tools=tools, verbose=True)`}</code>
          </pre>

          <h2 id="summary">Summary</h2>
          <p>MCP integrates naturally with both LangChain and LlamaIndex:</p>
          <ul>
            <li><strong>LangChain</strong>: Wrap MCP tools as <code>BaseTool</code> subclasses, use with any agent type</li>
            <li><strong>LlamaIndex</strong>: Create <code>FunctionTool</code> wrappers, combine with RAG pipelines</li>
            <li><strong>Hybrid</strong>: Use MCP for live data access, LlamaIndex for document search</li>
          </ul>
          <p>
            The key is treating MCP as your standardized tool layer while letting
            the framework handle orchestration.
          </p>

          <div className="bg-gray-800/50 rounded-lg p-6 mt-8 border border-gray-700">
            <h3 className="text-lg font-semibold mb-3 text-white">
              Related Articles
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/mcp/mcp-security-best-practices" className="text-blue-400 hover:underline">
                  MCP Security Best Practices
                </a>
              </li>
              <li>
                <a href="/mcp/building-production-mcp-servers" className="text-blue-400 hover:underline">
                  Building Production MCP Servers
                </a>
              </li>
              <li>
                <a href="/mcp/mcp-observability-monitoring" className="text-blue-400 hover:underline">
                  MCP Observability and Monitoring
                </a>
              </li>
            </ul>
          </div>
        </article>
      </div>
    </main>
  );
}
