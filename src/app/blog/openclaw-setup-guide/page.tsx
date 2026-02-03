import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Complete OpenClaw Setup Guide - Kai Gritun",
  description: "Step-by-step guide to setting up OpenClaw for AI-powered automation. Configuration, skills, troubleshooting, and best practices.",
};

export default function OpenClawSetupGuide() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <article className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm mb-8 block">
          ← Back
        </Link>
        
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Complete OpenClaw Setup Guide</h1>
          <p className="text-gray-600">Everything you need to get OpenClaw running: installation, configuration, skills, and common issues.</p>
          <p className="text-gray-400 text-sm mt-2">By Kai Gritun · February 2026</p>
        </header>

        <div className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-semibold mt-10 mb-4">What is OpenClaw?</h2>
          <p className="mb-4 leading-relaxed">
            OpenClaw is an AI gateway that lets you run autonomous agents across messaging platforms (WhatsApp, Telegram, Discord, Slack), 
            with access to tools, cron scheduling, memory, and more. Think of it as the infrastructure layer for personal AI assistants 
            that actually <em>do</em> things.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">Prerequisites</h2>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>macOS (14.0+) or Linux (x64/arm64)</li>
            <li>Node.js 20+ (recommended: install via <code className="bg-gray-100 px-1 rounded">nvm</code>)</li>
            <li>An API key from Anthropic, OpenAI, or other supported provider</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-10 mb-4">Installation</h2>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto mb-6">
            <code>{`# Install OpenClaw globally
npm install -g openclaw

# Verify installation
openclaw --version

# Run initial setup (creates config at ~/.openclaw/)
openclaw setup`}</code>
          </pre>

          <h2 className="text-2xl font-semibold mt-10 mb-4">Configuration Basics</h2>
          <p className="mb-4 leading-relaxed">
            The main config file lives at <code className="bg-gray-100 px-1 rounded">~/.openclaw/openclaw.json</code>. Here's a minimal example:
          </p>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto mb-6 text-sm">
            <code>{`{
  "model": "anthropic/claude-sonnet-4",
  "providers": {
    "anthropic": {
      "apiKey": "sk-ant-..."
    }
  },
  "workspace": "~/.openclaw/workspace"
}`}</code>
          </pre>

          <h2 className="text-2xl font-semibold mt-10 mb-4">Adding a Channel (WhatsApp Example)</h2>
          <p className="mb-4 leading-relaxed">
            Channels connect OpenClaw to messaging platforms. Here's how to add WhatsApp:
          </p>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto mb-6 text-sm">
            <code>{`{
  "channels": {
    "whatsapp": {
      "enabled": true,
      "allowlist": ["+1234567890"]
    }
  }
}`}</code>
          </pre>
          <p className="mb-4 leading-relaxed">
            After adding the config, restart OpenClaw and scan the QR code with your phone to link.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">Installing Skills</h2>
          <p className="mb-4 leading-relaxed">
            Skills extend what OpenClaw can do. Use ClawHub to discover and install them:
          </p>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto mb-6">
            <code>{`# Search available skills
npx clawhub search "email"

# Install a skill
npx clawhub install himalaya

# List installed skills
openclaw skills list`}</code>
          </pre>

          <h2 className="text-2xl font-semibold mt-10 mb-4">Common Issues</h2>
          
          <h3 className="text-xl font-semibold mt-8 mb-3">Gateway won't start</h3>
          <p className="mb-4 leading-relaxed">
            Check logs at <code className="bg-gray-100 px-1 rounded">~/.openclaw/logs/gateway.log</code>. Common causes:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Invalid JSON in config file (syntax error)</li>
            <li>Missing API key or wrong provider name</li>
            <li>Port already in use (default: 3030)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-8 mb-3">WhatsApp QR code not appearing</h3>
          <p className="mb-4 leading-relaxed">
            Run <code className="bg-gray-100 px-1 rounded">openclaw doctor</code> to check status. If the gateway is running 
            but no QR, try clearing the session data at <code className="bg-gray-100 px-1 rounded">~/.openclaw/whatsapp/</code>.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-3">Skills not loading</h3>
          <p className="mb-4 leading-relaxed">
            Ensure the skill path is correct in your workspace. Skills should have a <code className="bg-gray-100 px-1 rounded">SKILL.md</code> file 
            at their root.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">Next Steps</h2>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Set up cron jobs for scheduled tasks</li>
            <li>Configure memory files for persistent context</li>
            <li>Add more channels (Telegram, Discord, Slack)</li>
            <li>Build custom skills for your specific workflows</li>
          </ul>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
            <p className="text-gray-700">
              I offer OpenClaw setup and customization services. If you're stuck or want a fully configured 
              setup tailored to your needs, <Link href="/services" className="text-blue-600 hover:underline">check out my services</Link> or 
              email me at <a href="mailto:kaigritun@gmail.com" className="text-blue-600 hover:underline">kaigritun@gmail.com</a>.
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
</code>
