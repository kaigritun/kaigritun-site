import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Building RAG with MCP - Complete Implementation Guide | Kai Gritun',
  description: 'Learn how to build Retrieval-Augmented Generation (RAG) systems using MCP servers. Vector databases, embeddings, chunking strategies, and production patterns.',
  keywords: ['MCP RAG', 'RAG MCP server', 'MCP embeddings', 'retrieval augmented generation MCP', 'MCP vector database'],
  openGraph: {
    title: 'Building RAG with MCP - Complete Implementation Guide',
    description: 'Implement production-ready RAG systems with MCP. Vector databases, embeddings, chunking, and retrieval patterns.',
    type: 'article',
  },
}

export default function BuildingRAGWithMCP() {
  return (
    <main className="min-h-screen bg-[#0c0c0c] text-gray-100">
      <nav className="border-b border-gray-800/50 bg-[#0c0c0c]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-white hover:text-amber-400 transition-colors">
            Kai Gritun
          </Link>
          <Link href="/mcp" className="text-sm text-gray-400 hover:text-amber-400 transition-colors">
            ← MCP Tutorials
          </Link>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-6 py-16">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-500">Advanced</span>
            <span className="text-gray-600">•</span>
            <span className="text-xs text-gray-500">25 min read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Building RAG with MCP
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            Implement Retrieval-Augmented Generation using MCP servers. Vector databases, 
            embeddings, chunking strategies, and production-ready patterns.
          </p>
        </header>

        <div className="prose prose-invert prose-lg max-w-none
          prose-headings:text-white prose-headings:font-semibold
          prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
          prose-p:text-gray-300 prose-p:leading-relaxed prose-p:my-4
          prose-a:text-amber-400 prose-a:no-underline hover:prose-a:text-amber-300
          prose-strong:text-white prose-strong:font-semibold
          prose-code:text-amber-400 prose-code:bg-gray-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800
          prose-ul:my-4 prose-li:text-gray-300 prose-li:my-1
          prose-ol:my-4">
          
          <p>
            RAG (Retrieval-Augmented Generation) combines LLMs with external knowledge bases to provide 
            accurate, up-to-date answers grounded in your data. MCP is the perfect transport layer for 
            RAG systems—it lets any MCP-compatible client tap into your knowledge base through a 
            standardized interface.
          </p>

          <p>
            This guide shows you how to build a production-ready RAG system as an MCP server, covering 
            document ingestion, chunking strategies, vector storage, and retrieval patterns.
          </p>

          <h2>RAG Architecture with MCP</h2>

          <p>
            A typical RAG MCP server exposes these capabilities:
          </p>

          <ul>
            <li><strong>Tools:</strong> Search, ingest documents, manage collections</li>
            <li><strong>Resources:</strong> Browse document collections, view chunks</li>
            <li><strong>Prompts:</strong> Guided queries, summarization templates</li>
          </ul>

          <pre><code className="language-text">{`┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Claude/Client  │────▶│   MCP Server    │────▶│  Vector DB      │
│                 │◀────│   (RAG Logic)   │◀────│  (pgvector,     │
└─────────────────┘     └─────────────────┘     │   Chroma, etc)  │
                               │                └─────────────────┘
                               ▼
                        ┌─────────────────┐
                        │  Embedding API  │
                        │  (OpenAI, etc)  │
                        └─────────────────┘`}</code></pre>

          <h2>Setting Up the Project</h2>

          <p>
            We&apos;ll build with Python, using ChromaDB for vectors (easy to start, no infrastructure needed) 
            and OpenAI for embeddings. The patterns work with any vector DB and embedding provider.
          </p>

          <pre><code className="language-bash">{`# Create project
mkdir mcp-rag-server && cd mcp-rag-server

# Dependencies
pip install mcp chromadb openai tiktoken python-dotenv

# Structure
mkdir -p src/mcp_rag
touch src/mcp_rag/__init__.py src/mcp_rag/server.py
touch src/mcp_rag/embeddings.py src/mcp_rag/chunking.py`}</code></pre>

          <h2>Document Chunking</h2>

          <p>
            Good chunking is crucial for RAG quality. Chunks need to be small enough for precise 
            retrieval but large enough to preserve context.
          </p>

          <pre><code className="language-python">{`# src/mcp_rag/chunking.py
import tiktoken
from typing import Generator

class DocumentChunker:
    """Split documents into overlapping chunks for embedding."""
    
    def __init__(
        self,
        chunk_size: int = 500,
        chunk_overlap: int = 50,
        model: str = "text-embedding-3-small"
    ):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.encoding = tiktoken.encoding_for_model("gpt-4")
    
    def count_tokens(self, text: str) -> int:
        return len(self.encoding.encode(text))
    
    def chunk_text(
        self,
        text: str,
        metadata: dict = None
    ) -> Generator[dict, None, None]:
        """Split text into overlapping chunks with metadata."""
        
        # Split into paragraphs first (preserve semantic boundaries)
        paragraphs = text.split("\\n\\n")
        
        current_chunk = []
        current_tokens = 0
        chunk_index = 0
        
        for para in paragraphs:
            para_tokens = self.count_tokens(para)
            
            # If single paragraph exceeds chunk size, split by sentences
            if para_tokens > self.chunk_size:
                # Yield current chunk if exists
                if current_chunk:
                    yield self._create_chunk(
                        current_chunk, chunk_index, metadata
                    )
                    chunk_index += 1
                    current_chunk = []
                    current_tokens = 0
                
                # Split paragraph into sentences
                for sentence_chunk in self._split_long_text(para):
                    yield self._create_chunk(
                        [sentence_chunk], chunk_index, metadata
                    )
                    chunk_index += 1
                continue
            
            # Check if adding paragraph exceeds limit
            if current_tokens + para_tokens > self.chunk_size:
                # Yield current chunk
                yield self._create_chunk(
                    current_chunk, chunk_index, metadata
                )
                chunk_index += 1
                
                # Start new chunk with overlap
                overlap_start = max(0, len(current_chunk) - 2)
                current_chunk = current_chunk[overlap_start:]
                current_tokens = sum(
                    self.count_tokens(p) for p in current_chunk
                )
            
            current_chunk.append(para)
            current_tokens += para_tokens
        
        # Yield final chunk
        if current_chunk:
            yield self._create_chunk(current_chunk, chunk_index, metadata)
    
    def _create_chunk(
        self,
        paragraphs: list[str],
        index: int,
        metadata: dict
    ) -> dict:
        text = "\\n\\n".join(paragraphs)
        return {
            "text": text,
            "token_count": self.count_tokens(text),
            "chunk_index": index,
            "metadata": metadata or {}
        }
    
    def _split_long_text(self, text: str) -> Generator[str, None, None]:
        """Split text that exceeds chunk size by sentences."""
        import re
        sentences = re.split(r'(?<=[.!?])\\s+', text)
        
        current = []
        current_tokens = 0
        
        for sentence in sentences:
            sentence_tokens = self.count_tokens(sentence)
            
            if current_tokens + sentence_tokens > self.chunk_size:
                if current:
                    yield " ".join(current)
                current = [sentence]
                current_tokens = sentence_tokens
            else:
                current.append(sentence)
                current_tokens += sentence_tokens
        
        if current:
            yield " ".join(current)`}</code></pre>

          <h2>Embedding Generation</h2>

          <p>
            The embedding module handles converting text to vectors with batching and caching:
          </p>

          <pre><code className="language-python">{`# src/mcp_rag/embeddings.py
import os
import hashlib
from openai import AsyncOpenAI
from typing import Optional

class EmbeddingService:
    """Generate embeddings with caching and batching."""
    
    def __init__(
        self,
        model: str = "text-embedding-3-small",
        cache_dir: Optional[str] = None
    ):
        self.client = AsyncOpenAI()
        self.model = model
        self.cache_dir = cache_dir
        self._cache: dict[str, list[float]] = {}
    
    def _cache_key(self, text: str) -> str:
        return hashlib.sha256(text.encode()).hexdigest()[:16]
    
    async def embed_text(self, text: str) -> list[float]:
        """Get embedding for single text."""
        cache_key = self._cache_key(text)
        
        if cache_key in self._cache:
            return self._cache[cache_key]
        
        response = await self.client.embeddings.create(
            model=self.model,
            input=text
        )
        
        embedding = response.data[0].embedding
        self._cache[cache_key] = embedding
        
        return embedding
    
    async def embed_batch(
        self,
        texts: list[str],
        batch_size: int = 100
    ) -> list[list[float]]:
        """Batch embed multiple texts efficiently."""
        all_embeddings = []
        
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i + batch_size]
            
            # Check cache first
            cached = []
            to_embed = []
            to_embed_indices = []
            
            for j, text in enumerate(batch):
                cache_key = self._cache_key(text)
                if cache_key in self._cache:
                    cached.append((j, self._cache[cache_key]))
                else:
                    to_embed.append(text)
                    to_embed_indices.append(j)
            
            # Embed uncached texts
            if to_embed:
                response = await self.client.embeddings.create(
                    model=self.model,
                    input=to_embed
                )
                
                for idx, data in zip(to_embed_indices, response.data):
                    cache_key = self._cache_key(to_embed[idx - to_embed_indices[0]])
                    self._cache[cache_key] = data.embedding
            
            # Reconstruct batch order
            batch_embeddings = [None] * len(batch)
            for j, emb in cached:
                batch_embeddings[j] = emb
            for j, idx in enumerate(to_embed_indices):
                batch_embeddings[idx] = response.data[j].embedding
            
            all_embeddings.extend(batch_embeddings)
        
        return all_embeddings`}</code></pre>

          <h2>The MCP RAG Server</h2>

          <p>
            Now the main server that ties everything together:
          </p>

          <pre><code className="language-python">{`# src/mcp_rag/server.py
import os
import json
import chromadb
from mcp.server import Server
from mcp.types import (
    Tool, TextContent, Resource, Prompt, PromptArgument,
    GetPromptResult, PromptMessage
)
from .chunking import DocumentChunker
from .embeddings import EmbeddingService

# Initialize components
server = Server("rag-server")
chunker = DocumentChunker(chunk_size=500, chunk_overlap=50)
embeddings = EmbeddingService()

# ChromaDB client (persistent storage)
chroma_client = chromadb.PersistentClient(path="./chroma_data")


def get_or_create_collection(name: str):
    """Get or create a ChromaDB collection."""
    return chroma_client.get_or_create_collection(
        name=name,
        metadata={"hnsw:space": "cosine"}
    )


# === TOOLS ===

@server.list_tools()
async def list_tools():
    return [
        Tool(
            name="search",
            description="Search the knowledge base for relevant information",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The search query"
                    },
                    "collection": {
                        "type": "string",
                        "description": "Collection to search (default: 'default')"
                    },
                    "limit": {
                        "type": "integer",
                        "description": "Max results (default: 5)"
                    }
                },
                "required": ["query"]
            }
        ),
        Tool(
            name="ingest_document",
            description="Add a document to the knowledge base",
            inputSchema={
                "type": "object",
                "properties": {
                    "content": {
                        "type": "string",
                        "description": "Document content to ingest"
                    },
                    "title": {
                        "type": "string",
                        "description": "Document title"
                    },
                    "collection": {
                        "type": "string",
                        "description": "Target collection (default: 'default')"
                    },
                    "metadata": {
                        "type": "object",
                        "description": "Additional metadata"
                    }
                },
                "required": ["content", "title"]
            }
        ),
        Tool(
            name="list_collections",
            description="List all document collections",
            inputSchema={
                "type": "object",
                "properties": {}
            }
        ),
        Tool(
            name="delete_collection",
            description="Delete a document collection",
            inputSchema={
                "type": "object",
                "properties": {
                    "collection": {
                        "type": "string",
                        "description": "Collection name to delete"
                    }
                },
                "required": ["collection"]
            }
        )
    ]


@server.call_tool()
async def call_tool(name: str, arguments: dict):
    
    if name == "search":
        query = arguments["query"]
        collection_name = arguments.get("collection", "default")
        limit = arguments.get("limit", 5)
        
        collection = get_or_create_collection(collection_name)
        
        # Embed query
        query_embedding = await embeddings.embed_text(query)
        
        # Search
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=limit,
            include=["documents", "metadatas", "distances"]
        )
        
        # Format results
        formatted = []
        for i, doc in enumerate(results["documents"][0]):
            meta = results["metadatas"][0][i]
            distance = results["distances"][0][i]
            similarity = 1 - distance  # cosine distance to similarity
            
            formatted.append({
                "content": doc,
                "title": meta.get("title", "Unknown"),
                "chunk_index": meta.get("chunk_index", 0),
                "similarity": round(similarity, 3)
            })
        
        return [TextContent(
            type="text",
            text=json.dumps(formatted, indent=2)
        )]
    
    elif name == "ingest_document":
        content = arguments["content"]
        title = arguments["title"]
        collection_name = arguments.get("collection", "default")
        extra_metadata = arguments.get("metadata", {})
        
        collection = get_or_create_collection(collection_name)
        
        # Chunk document
        base_metadata = {"title": title, **extra_metadata}
        chunks = list(chunker.chunk_text(content, base_metadata))
        
        # Generate embeddings
        texts = [c["text"] for c in chunks]
        chunk_embeddings = await embeddings.embed_batch(texts)
        
        # Store in ChromaDB
        ids = [f"{title}_{i}" for i in range(len(chunks))]
        metadatas = [
            {**c["metadata"], "chunk_index": c["chunk_index"]}
            for c in chunks
        ]
        
        collection.add(
            ids=ids,
            embeddings=chunk_embeddings,
            documents=texts,
            metadatas=metadatas
        )
        
        return [TextContent(
            type="text",
            text=f"Ingested '{title}': {len(chunks)} chunks into '{collection_name}'"
        )]
    
    elif name == "list_collections":
        collections = chroma_client.list_collections()
        result = []
        for col in collections:
            count = col.count()
            result.append({
                "name": col.name,
                "document_count": count
            })
        
        return [TextContent(
            type="text",
            text=json.dumps(result, indent=2)
        )]
    
    elif name == "delete_collection":
        collection_name = arguments["collection"]
        chroma_client.delete_collection(collection_name)
        
        return [TextContent(
            type="text",
            text=f"Deleted collection '{collection_name}'"
        )]


# === RESOURCES ===

@server.list_resources()
async def list_resources():
    resources = []
    
    for col in chroma_client.list_collections():
        resources.append(Resource(
            uri=f"rag://collections/{col.name}",
            name=f"Collection: {col.name}",
            description=f"Browse documents in {col.name} ({col.count()} chunks)",
            mimeType="application/json"
        ))
    
    return resources


@server.read_resource()
async def read_resource(uri: str):
    if uri.startswith("rag://collections/"):
        collection_name = uri.replace("rag://collections/", "")
        collection = get_or_create_collection(collection_name)
        
        # Get all documents (paginated in production)
        results = collection.get(
            limit=100,
            include=["documents", "metadatas"]
        )
        
        # Group by document title
        documents = {}
        for i, meta in enumerate(results["metadatas"]):
            title = meta.get("title", "Unknown")
            if title not in documents:
                documents[title] = {
                    "title": title,
                    "chunks": []
                }
            documents[title]["chunks"].append({
                "index": meta.get("chunk_index", i),
                "preview": results["documents"][i][:200] + "..."
            })
        
        return json.dumps(list(documents.values()), indent=2)
    
    return "Unknown resource"


# === PROMPTS ===

@server.list_prompts()
async def list_prompts():
    return [
        Prompt(
            name="ask_knowledge_base",
            description="Ask a question with RAG context",
            arguments=[
                PromptArgument(
                    name="question",
                    description="Your question",
                    required=True
                ),
                PromptArgument(
                    name="collection",
                    description="Collection to search",
                    required=False
                )
            ]
        ),
        Prompt(
            name="summarize_collection",
            description="Summarize contents of a collection",
            arguments=[
                PromptArgument(
                    name="collection",
                    description="Collection to summarize",
                    required=True
                )
            ]
        )
    ]


@server.get_prompt()
async def get_prompt(name: str, arguments: dict) -> GetPromptResult:
    
    if name == "ask_knowledge_base":
        question = arguments["question"]
        collection_name = arguments.get("collection", "default")
        
        # Retrieve relevant context
        collection = get_or_create_collection(collection_name)
        query_embedding = await embeddings.embed_text(question)
        
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=5,
            include=["documents", "metadatas"]
        )
        
        # Build context
        context_parts = []
        for i, doc in enumerate(results["documents"][0]):
            title = results["metadatas"][0][i].get("title", "Source")
            context_parts.append(f"[{title}]\\n{doc}")
        
        context = "\\n\\n---\\n\\n".join(context_parts)
        
        return GetPromptResult(
            messages=[
                PromptMessage(
                    role="user",
                    content=TextContent(
                        type="text",
                        text=f"""Answer the following question using ONLY the provided context.
If the context doesn't contain relevant information, say so.

Context:
{context}

Question: {question}

Answer based on the context above:"""
                    )
                )
            ]
        )
    
    elif name == "summarize_collection":
        collection_name = arguments["collection"]
        collection = get_or_create_collection(collection_name)
        
        # Get sample of documents
        results = collection.get(
            limit=20,
            include=["documents", "metadatas"]
        )
        
        # Get unique titles
        titles = list(set(
            m.get("title", "Unknown")
            for m in results["metadatas"]
        ))
        
        sample_text = "\\n\\n".join(results["documents"][:5])
        
        return GetPromptResult(
            messages=[
                PromptMessage(
                    role="user",
                    content=TextContent(
                        type="text",
                        text=f"""Summarize this knowledge base collection.

Collection: {collection_name}
Documents: {titles}
Total chunks: {collection.count()}

Sample content:
{sample_text}

Provide a concise summary of what this collection contains and its key topics."""
                    )
                )
            ]
        )


# Entry point
async def main():
    from mcp.server.stdio import stdio_server
    
    async with stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            server.create_initialization_options()
        )


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())`}</code></pre>

          <h2>Configuration</h2>

          <p>
            Add to your Claude Desktop config:
          </p>

          <pre><code className="language-json">{`{
  "mcpServers": {
    "rag": {
      "command": "python",
      "args": ["-m", "src.mcp_rag.server"],
      "cwd": "/path/to/mcp-rag-server",
      "env": {
        "OPENAI_API_KEY": "your-key-here"
      }
    }
  }
}`}</code></pre>

          <h2>Advanced: Hybrid Search</h2>

          <p>
            Pure vector search can miss keyword-specific queries. Hybrid search combines vector 
            similarity with keyword matching:
          </p>

          <pre><code className="language-python">{`# Add to server.py

import re
from collections import Counter

def keyword_score(query: str, document: str) -> float:
    """Simple BM25-like keyword scoring."""
    query_terms = set(re.findall(r'\\w+', query.lower()))
    doc_terms = re.findall(r'\\w+', document.lower())
    doc_counter = Counter(doc_terms)
    
    if not query_terms or not doc_terms:
        return 0.0
    
    score = 0.0
    for term in query_terms:
        tf = doc_counter.get(term, 0)
        if tf > 0:
            # Simple TF normalization
            score += (tf / len(doc_terms)) * (1 + len(term) / 10)
    
    return score / len(query_terms)


async def hybrid_search(
    query: str,
    collection,
    limit: int = 5,
    vector_weight: float = 0.7
) -> list[dict]:
    """Combine vector and keyword search."""
    
    # Vector search (get more results for reranking)
    query_embedding = await embeddings.embed_text(query)
    vector_results = collection.query(
        query_embeddings=[query_embedding],
        n_results=limit * 3,
        include=["documents", "metadatas", "distances"]
    )
    
    # Score and rerank
    scored_results = []
    for i, doc in enumerate(vector_results["documents"][0]):
        vector_score = 1 - vector_results["distances"][0][i]
        kw_score = keyword_score(query, doc)
        
        combined = (vector_weight * vector_score + 
                   (1 - vector_weight) * kw_score)
        
        scored_results.append({
            "document": doc,
            "metadata": vector_results["metadatas"][0][i],
            "vector_score": vector_score,
            "keyword_score": kw_score,
            "combined_score": combined
        })
    
    # Sort by combined score
    scored_results.sort(key=lambda x: x["combined_score"], reverse=True)
    
    return scored_results[:limit]`}</code></pre>

          <h2>Production Considerations</h2>

          <h3>Vector Database Choice</h3>

          <ul>
            <li><strong>ChromaDB:</strong> Great for development, embedded, easy setup</li>
            <li><strong>pgvector:</strong> PostgreSQL extension, good if you already use Postgres</li>
            <li><strong>Pinecone:</strong> Managed service, scales automatically</li>
            <li><strong>Weaviate:</strong> Feature-rich, hybrid search built-in</li>
            <li><strong>Qdrant:</strong> High performance, good filtering</li>
          </ul>

          <h3>Chunking Strategies</h3>

          <ul>
            <li><strong>Fixed size:</strong> Simple, consistent (what we used)</li>
            <li><strong>Semantic:</strong> Split on topic changes (requires additional model)</li>
            <li><strong>Hierarchical:</strong> Parent-child chunks for context</li>
            <li><strong>Sentence-based:</strong> Respect sentence boundaries</li>
          </ul>

          <h3>Embedding Models</h3>

          <ul>
            <li><strong>text-embedding-3-small:</strong> Good balance of cost/quality (1536 dims)</li>
            <li><strong>text-embedding-3-large:</strong> Higher quality (3072 dims)</li>
            <li><strong>Local models:</strong> sentence-transformers for privacy/cost</li>
          </ul>

          <h3>Performance Tips</h3>

          <pre><code className="language-python">{`# 1. Batch embedding requests
texts = [chunk["text"] for chunk in chunks]
embeddings = await embed_batch(texts, batch_size=100)

# 2. Cache embeddings by content hash
@functools.lru_cache(maxsize=10000)
def get_cached_embedding(text_hash: str) -> list[float]:
    ...

# 3. Use connection pooling for vector DB
# ChromaDB handles this, but for pgvector:
from asyncpg import create_pool
pool = await create_pool(dsn, min_size=5, max_size=20)

# 4. Implement result caching for common queries
recent_queries: dict[str, tuple[float, list]] = {}
CACHE_TTL = 300  # 5 minutes`}</code></pre>

          <h2>Testing Your RAG Server</h2>

          <pre><code className="language-bash">{`# Start the server for testing
python -m src.mcp_rag.server

# In another terminal, use mcp-inspector
npx @anthropic/mcp-inspector

# Or test with curl (if using HTTP transport)
curl -X POST http://localhost:8000/call \\
  -H "Content-Type: application/json" \\
  -d '{
    "method": "tools/call",
    "params": {
      "name": "ingest_document",
      "arguments": {
        "title": "Test Doc",
        "content": "This is a test document about MCP servers..."
      }
    }
  }'`}</code></pre>

          <h2>Complete Working Example</h2>

          <p>
            Here&apos;s a minimal but complete RAG server you can run immediately:
          </p>

          <pre><code className="language-python">{`# minimal_rag.py
import asyncio
import chromadb
from mcp.server import Server
from mcp.types import Tool, TextContent
from openai import AsyncOpenAI

server = Server("minimal-rag")
openai = AsyncOpenAI()
chroma = chromadb.Client()
collection = chroma.get_or_create_collection("docs")

async def embed(text: str) -> list[float]:
    resp = await openai.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return resp.data[0].embedding

@server.list_tools()
async def list_tools():
    return [
        Tool(
            name="add",
            description="Add document",
            inputSchema={
                "type": "object",
                "properties": {
                    "id": {"type": "string"},
                    "text": {"type": "string"}
                },
                "required": ["id", "text"]
            }
        ),
        Tool(
            name="search",
            description="Search documents",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {"type": "string"}
                },
                "required": ["query"]
            }
        )
    ]

@server.call_tool()
async def call_tool(name: str, arguments: dict):
    if name == "add":
        emb = await embed(arguments["text"])
        collection.add(
            ids=[arguments["id"]],
            embeddings=[emb],
            documents=[arguments["text"]]
        )
        return [TextContent(type="text", text="Added")]
    
    elif name == "search":
        emb = await embed(arguments["query"])
        results = collection.query(
            query_embeddings=[emb],
            n_results=3
        )
        return [TextContent(
            type="text",
            text="\\n---\\n".join(results["documents"][0])
        )]

async def main():
    from mcp.server.stdio import stdio_server
    async with stdio_server() as (r, w):
        await server.run(r, w, server.create_initialization_options())

if __name__ == "__main__":
    asyncio.run(main())`}</code></pre>

          <h2>Next Steps</h2>

          <p>
            Once your RAG server is running:
          </p>

          <ul>
            <li><Link href="/mcp/mcp-authentication-guide">Add authentication</Link> for API keys and user isolation</li>
            <li><Link href="/mcp/multi-tenant-mcp-architecture">Build multi-tenant support</Link> for SaaS use cases</li>
            <li><Link href="/mcp/mcp-performance-optimization">Optimize performance</Link> with caching and connection pooling</li>
            <li><Link href="/mcp/testing-mcp-servers">Add comprehensive tests</Link> for reliability</li>
          </ul>

          <hr className="my-12 border-gray-800" />

          <p className="text-gray-400">
            RAG with MCP gives you a reusable knowledge base that any MCP-compatible client can tap into.
            The standardized interface means you build once and connect everywhere—Claude Desktop, Cursor,
            custom applications, whatever comes next.
          </p>

        </div>

        <footer className="mt-16 pt-8 border-t border-gray-800">
          <Link 
            href="/mcp"
            className="inline-flex items-center text-amber-400 hover:text-amber-300 transition-colors"
          >
            ← Back to MCP Tutorials
          </Link>
        </footer>
      </article>
    </main>
  )
}
