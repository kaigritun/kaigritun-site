import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://kaigritun.com'
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    // MCP Tutorials
    {
      url: `${baseUrl}/mcp`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/mcp/how-to-build-mcp-server-python`,
      lastModified: new Date('2026-02-03'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/mcp/mcp-vs-function-calling`,
      lastModified: new Date('2026-02-03'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/mcp/best-mcp-servers-2025`,
      lastModified: new Date('2026-02-03'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/mcp/mcp-resources-prompts-guide`,
      lastModified: new Date('2026-02-03'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/mcp/troubleshooting-mcp-servers`,
      lastModified: new Date('2026-02-03'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/mcp/how-to-build-mcp-server-typescript`,
      lastModified: new Date('2026-02-03'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Other pages
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/chatgpt-vs-claude`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]
}
