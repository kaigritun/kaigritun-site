import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import servers from '@/data/mcp-servers.json';

type Server = typeof servers[0];

export async function generateStaticParams() {
  return servers.map((server) => ({
    slug: server.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const server = servers.find((s) => s.slug === slug);
  
  if (!server) {
    return { title: 'Server Not Found' };
  }

  return {
    title: `${server.name} MCP Server - Installation & Setup Guide | Kai Gritun`,
    description: `${server.description} Learn how to install and configure the ${server.name} MCP server for Claude and other AI assistants.`,
    keywords: [`${server.name} MCP`, 'MCP server', 'Model Context Protocol', server.slug, ...server.useCases],
  };
}

export default async function ServerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const server = servers.find((s) => s.slug === slug) as Server | undefined;

  if (!server) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <nav className="mb-8">
          <Link href="/mcp/servers" className="text-blue-600 hover:underline">
            ← Back to Server Directory
          </Link>
        </nav>

        <article>
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-4xl font-bold text-gray-900">{server.name}</h1>
              <span className={`text-sm px-3 py-1 rounded ${
                server.category === 'Official' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {server.category}
              </span>
            </div>
            <p className="text-xl text-gray-600">{server.description}</p>
          </header>

          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Install</h2>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <code className="text-green-400 text-sm">
                npx {server.npm}
              </code>
            </div>
            <p className="text-gray-600 text-sm mt-3">
              Or install globally: <code className="bg-gray-100 px-2 py-1 rounded">npm install -g {server.npm}</code>
            </p>
          </section>

          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Use Cases</h2>
            <div className="grid grid-cols-2 gap-4">
              {server.useCases.map((useCase) => (
                <div key={useCase} className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">{useCase}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Claude Desktop Configuration</h2>
            <p className="text-gray-600 mb-4">
              Add this to your <code className="bg-gray-100 px-2 py-1 rounded">claude_desktop_config.json</code>:
            </p>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-green-400 text-sm">{`{
  "mcpServers": {
    "${server.slug}": {
      "command": "npx",
      "args": ["-y", "${server.npm}"]
    }
  }
}`}</pre>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Resources</h2>
            <div className="space-y-3">
              <a
                href={server.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:underline"
              >
                <span>📦</span>
                <span>View on GitHub</span>
              </a>
              <a
                href={`https://www.npmjs.com/package/${server.npm}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:underline"
              >
                <span>📚</span>
                <span>NPM Package</span>
              </a>
            </div>
          </section>

          <section className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Related Tutorials</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href="/mcp/claude-desktop-mcp-setup"
                className="block bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-900">Claude Desktop Setup</h3>
                <p className="text-gray-600 text-sm">Configure MCP servers in Claude Desktop</p>
              </Link>
              <Link
                href="/mcp/best-mcp-servers-2025"
                className="block bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-900">Best MCP Servers 2025</h3>
                <p className="text-gray-600 text-sm">Top servers for different use cases</p>
              </Link>
              <Link
                href="/mcp/troubleshooting-mcp-servers"
                className="block bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-900">Troubleshooting Guide</h3>
                <p className="text-gray-600 text-sm">Fix common MCP server issues</p>
              </Link>
              <Link
                href="/mcp/mcp-security-best-practices"
                className="block bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-900">Security Best Practices</h3>
                <p className="text-gray-600 text-sm">Secure your MCP deployments</p>
              </Link>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
