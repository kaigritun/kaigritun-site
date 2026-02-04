import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://kaigritun.com'
  
  // Static pages
  const staticPages = [
    { url: baseUrl, changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${baseUrl}/mcp`, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/mcp/servers`, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/mcp/guides`, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/mcp/starter-kit`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/services`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/chatgpt-vs-claude`, changeFrequency: 'monthly' as const, priority: 0.6 },
  ]
  
  // Dynamically get all MCP article pages
  const mcpDir = path.join(process.cwd(), 'src/app/mcp')
  let mcpPages: { url: string; changeFrequency: 'monthly'; priority: number }[] = []
  
  try {
    const mcpFolders = fs.readdirSync(mcpDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .filter(dirent => !['servers', 'guides', 'starter-kit'].includes(dirent.name)) // Exclude static pages
      .map(dirent => dirent.name)
    
    mcpPages = mcpFolders.map(folder => ({
      url: `${baseUrl}/mcp/${folder}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))
  } catch (error) {
    console.error('Error reading MCP directory:', error)
  }

  // Dynamically get MCP server pages
  const serversDir = path.join(process.cwd(), 'src/app/mcp/servers')
  let serverPages: { url: string; changeFrequency: 'monthly'; priority: number }[] = []
  
  try {
    const serverFolders = fs.readdirSync(serversDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
    
    serverPages = serverFolders.map(folder => ({
      url: `${baseUrl}/mcp/servers/${folder}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Error reading servers directory:', error)
  }

  const allPages = [...staticPages, ...mcpPages, ...serverPages]

  return allPages.map(({ url, changeFrequency, priority }) => ({
    url,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }))
}
