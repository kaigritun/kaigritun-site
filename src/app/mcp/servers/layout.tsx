import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MCP Server Directory - Find Model Context Protocol Servers",
  description: "Browse 30+ MCP servers for AI development. Official and community servers for GitHub, databases, browsers, productivity tools, and more. Filter by category and language.",
  keywords: [
    "MCP servers",
    "Model Context Protocol",
    "MCP directory",
    "MCP server list",
    "AI tools",
    "Claude MCP",
    "MCP GitHub",
    "MCP Playwright",
    "MCP database",
    "MCP browser automation",
  ],
  openGraph: {
    title: "MCP Server Directory - Find Model Context Protocol Servers",
    description: "Browse 30+ MCP servers for AI development. Official and community servers with install commands.",
    type: "website",
  },
};

export default function ServersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
