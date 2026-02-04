import Link from 'next/link';
import { Metadata } from 'next';
import servers from '@/data/mcp-servers.json';

export const metadata: Metadata = {
  title: 'MCP Server Directory - Find Model Context Protocol Servers | Kai Gritun',
  description: 'Browse 15+ MCP (Model Context Protocol) servers. Official and community servers for filesystem, GitHub, databases, search, and more. Installation guides included.',
  keywords: ['MCP servers', 'Model Context Protocol', 'AI tools', 'LLM integrations', 'Claude MCP'],
};

export default function MCPServersPage() {
  const officialServers = servers.filter(s => s.category === 'Official');
  const communityServers = servers.filter(s => s.category === 'Community');

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            MCP Server Directory
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse {servers.length}+ Model Context Protocol servers. Connect AI to filesystems, 
            databases, APIs, and more.
          </p>
        </div>

        <div className="mb-8">
          <Link href="/mcp" className="text-blue-600 hover:underline">
            ← Back to MCP Tutorials
          </Link>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Official Servers</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {officialServers.map((server) => (
              <Link
                key={server.slug}
                href={`/mcp/servers/${server.slug}`}
                className="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{server.name}</h3>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Official
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {server.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {server.useCases.slice(0, 2).map((useCase) => (
                    <span key={useCase} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {useCase}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {communityServers.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Community Servers</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communityServers.map((server) => (
                <Link
                  key={server.slug}
                  href={`/mcp/servers/${server.slug}`}
                  className="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{server.name}</h3>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Community
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {server.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {server.useCases.slice(0, 2).map((useCase) => (
                      <span key={useCase} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {useCase}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Build Your Own Server</h2>
          <p className="text-gray-600 mb-6">
            Can&apos;t find what you need? Learn how to build custom MCP servers for your specific use case.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/mcp/how-to-build-mcp-server-python"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Python Tutorial →
            </Link>
            <Link
              href="/mcp/how-to-build-mcp-server-typescript"
              className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              TypeScript Tutorial →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
