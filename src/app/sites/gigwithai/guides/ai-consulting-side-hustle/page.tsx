import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Start an AI Consulting Side Hustle | GigWithAI',
  description: 'Companies need someone to tell them what AI tools to use. Learn how to start an AI consulting business on the side.',
  keywords: ['AI consulting', 'AI consulting business', 'AI consultant side hustle', 'AI implementation', 'AI strategy consulting'],
  openGraph: {
    title: 'How to Start an AI Consulting Side Hustle',
    description: 'Companies are paralyzed by AI options. Help them figure it out.',
    type: 'article',
    url: 'https://gigwithai.com/guides/ai-consulting-side-hustle',
  },
}

export default function AIConsultingSideHustle() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-neutral-100">
      <nav className="px-6 py-4 border-b border-neutral-800/50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-amber-500 tracking-tight">GigWithAI</Link>
          <div className="flex gap-6 text-sm text-neutral-400">
            <Link href="/#guides" className="hover:text-amber-500 transition-colors">guides</Link>
            <Link href="/#newsletter" className="hover:text-amber-500 transition-colors">newsletter</Link>
          </div>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-16">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-sm text-neutral-500 mb-4">
            <Link href="/" className="hover:text-neutral-300">Home</Link>
            <span>/</span>
            <span>Guides</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            How to Start an AI Consulting Side Hustle
          </h1>
          <p className="text-lg text-neutral-400">
            Companies are drowning in AI hype and paralyzed by options. They don&apos;t need another tool subscription — they need someone to tell them what to do.
          </p>
          <div className="flex items-center gap-4 mt-6 text-sm text-neutral-500">
            <span>~10 min read</span>
            <span>•</span>
            <span className="text-amber-500">Consulting</span>
          </div>
        </header>

        <div className="prose prose-invert prose-neutral max-w-none">
          
          <h2 className="text-2xl font-bold mt-12 mb-4">What AI Consulting Actually Means</h2>

          <p className="text-neutral-300 mb-4">
            You&apos;re not building AI from scratch. You&apos;re helping businesses:
          </p>

          <ul className="text-neutral-300 mb-6">
            <li><strong className="text-neutral-100">Choose the right tools</strong> for their specific problems</li>
            <li><strong className="text-neutral-100">Implement workflows</strong> using off-the-shelf AI products</li>
            <li><strong className="text-neutral-100">Train their teams</strong> to use AI effectively</li>
            <li><strong className="text-neutral-100">Audit existing processes</strong> for AI opportunities</li>
          </ul>

          <p className="text-neutral-300 mb-4">
            This isn&apos;t about being an ML engineer. It&apos;s about understanding business problems and knowing which AI tools solve them.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">Who Needs AI Consulting?</h2>

          <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6 my-8">
            <h4 className="font-semibold text-amber-400 mt-0">Small Businesses</h4>
            <p className="text-neutral-300 mb-4">&quot;We know AI could help but don&apos;t know where to start&quot;<br/>Budget: $500-2,000 for assessment + recommendations</p>

            <h4 className="font-semibold text-amber-400">Marketing Agencies</h4>
            <p className="text-neutral-300 mb-4">&quot;Our clients are asking about AI and we&apos;re scrambling&quot;<br/>Budget: $2,000-10,000 for workflow implementation</p>

            <h4 className="font-semibold text-amber-400">Professional Services</h4>
            <p className="text-neutral-300 mb-4">&quot;We&apos;re losing to competitors using AI but our partners are skeptical&quot;<br/>Budget: $5,000-25,000 for firm-wide implementation</p>

            <h4 className="font-semibold text-amber-400">Mid-Size Companies</h4>
            <p className="text-neutral-300 mb-0">&quot;We have 50 employees and zero AI strategy&quot;<br/>Budget: $10,000-50,000 for assessment + implementation</p>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-4">The Consulting Framework</h2>

          <h3 className="text-xl font-semibold mt-8 mb-3">Phase 1: AI Audit ($500-2,000)</h3>
          <p className="text-neutral-300 mb-4"><strong>Deliverable:</strong> Report identifying 3-5 high-impact AI opportunities</p>
          <p className="text-neutral-300 mb-4"><strong>Process:</strong></p>
          <ol className="text-neutral-300 mb-4">
            <li>Interview stakeholders (2-4 hours)</li>
            <li>Document current workflows</li>
            <li>Map problems to AI solutions</li>
            <li>Prioritize by impact and ease</li>
            <li>Present recommendations</li>
          </ol>

          <p className="text-neutral-300 mb-4"><strong>What you assess:</strong></p>
          <ul className="text-neutral-300 mb-6">
            <li>Repetitive tasks (writing, data entry, scheduling)</li>
            <li>Research-heavy work (market analysis, competitive intelligence)</li>
            <li>Customer communication (email, chat, FAQs)</li>
            <li>Content creation (social media, blog, internal docs)</li>
            <li>Data analysis and reporting</li>
          </ul>

          <h3 className="text-xl font-semibold mt-8 mb-3">Phase 2: Implementation ($2,000-10,000)</h3>
          <p className="text-neutral-300 mb-4"><strong>Deliverable:</strong> Working AI workflows + trained team</p>
          <ol className="text-neutral-300 mb-6">
            <li>Set up tools (ChatGPT, Claude, specialized apps)</li>
            <li>Create prompts and templates</li>
            <li>Build automations (Zapier/Make if needed)</li>
            <li>Document SOPs</li>
            <li>Train key users</li>
            <li>30-day support period</li>
          </ol>

          <h3 className="text-xl font-semibold mt-8 mb-3">Phase 3: Ongoing Optimization ($500-2,000/month)</h3>
          <p className="text-neutral-300 mb-4"><strong>Deliverable:</strong> Monthly check-ins, prompt updates, new use case identification</p>

          <h2 className="text-2xl font-bold mt-12 mb-4">Pricing Your Services</h2>

          <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6 my-8">
            <h4 className="font-semibold text-amber-400 mt-0">Hourly (Starting Out)</h4>
            <p className="text-neutral-300 mb-4">$100-200/hour for assessments and consulting</p>

            <h4 className="font-semibold text-amber-400">Project-Based (After 5+ Clients)</h4>
            <ul className="text-neutral-300 mb-4">
              <li>AI Audit: $1,000-3,000</li>
              <li>Single workflow implementation: $2,000-5,000</li>
              <li>Comprehensive implementation: $5,000-15,000</li>
            </ul>

            <h4 className="font-semibold text-amber-400">Retainer (Established)</h4>
            <ul className="text-neutral-300 mb-0">
              <li>Monthly optimization: $1,000-3,000</li>
              <li>On-demand consulting: $2,000-5,000/month</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-4">How to Get Your First Client</h2>

          <h3 className="text-xl font-semibold mt-8 mb-3">Warm Network First</h3>
          <p className="text-neutral-300 mb-4">
            Who do you know running a business? Who complains about repetitive work? Who&apos;s mentioned AI with confusion?
          </p>

          <p className="text-neutral-300 mb-2"><strong>Outreach template:</strong></p>
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4 my-4">
            <p className="text-neutral-300 mb-0 italic">
              &quot;Hey [name], been doing AI consulting on the side — helping businesses figure out which AI tools actually save time vs. which are just hype. If you&apos;re curious how AI could help [their business type], happy to do a free 30-minute assessment. No pitch, just a conversation.&quot;
            </p>
          </div>

          <h3 className="text-xl font-semibold mt-8 mb-3">LinkedIn Positioning</h3>
          <ul className="text-neutral-300 mb-6">
            <li>Post about AI use cases (not AI news)</li>
            <li>Share specific results: &quot;Helped a law firm cut research time by 60%&quot;</li>
            <li>Comment on posts from your target industries</li>
          </ul>

          <h3 className="text-xl font-semibold mt-8 mb-3">Local Businesses</h3>
          <p className="text-neutral-300 mb-4">
            Walk into businesses you frequent. &quot;I do AI consulting — noticed you do [thing that AI could help]. Would you be open to a 15-minute chat?&quot;
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-3">Partnerships</h3>
          <p className="text-neutral-300 mb-4">
            Accountants, bookkeepers, business coaches — they have clients asking about AI. Offer referral fees or white-label services.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">What You Need to Know</h2>

          <p className="text-neutral-300 mb-4">You don&apos;t need to be an AI expert. You need to know:</p>

          <h4 className="font-semibold text-neutral-100 mt-6 mb-2">The Tools</h4>
          <ul className="text-neutral-300 mb-4">
            <li><strong>General AI:</strong> ChatGPT, Claude, Perplexity</li>
            <li><strong>Writing:</strong> Jasper, Copy.ai</li>
            <li><strong>Images:</strong> Midjourney, DALL-E, Canva AI</li>
            <li><strong>Transcription:</strong> Otter.ai, Fireflies</li>
            <li><strong>Automation:</strong> Zapier, Make, n8n</li>
          </ul>

          <h4 className="font-semibold text-neutral-100 mt-6 mb-2">The Prompts</h4>
          <p className="text-neutral-300 mb-4">How to get good output, customize for business needs, create reusable templates.</p>

          <h4 className="font-semibold text-neutral-100 mt-6 mb-2">The Limits</h4>
          <p className="text-neutral-300 mb-4">What AI can&apos;t do (yet), where human judgment is essential, common AI failures.</p>

          <h2 className="text-2xl font-bold mt-12 mb-4">The Time Investment</h2>

          <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6 my-8">
            <h4 className="font-semibold text-amber-400 mt-0">Side Hustle Mode (5-10 hours/week)</h4>
            <p className="text-neutral-300 mb-4">1-2 clients at a time, focus on assessments<br/>Potential: $2,000-5,000/month</p>

            <h4 className="font-semibold text-amber-400">Part-Time (15-20 hours/week)</h4>
            <p className="text-neutral-300 mb-4">3-4 active clients, mix of services<br/>Potential: $5,000-10,000/month</p>

            <h4 className="font-semibold text-amber-400">Full-Time Transition (40+ hours/week)</h4>
            <p className="text-neutral-300 mb-0">5-8 clients, team expansion<br/>Potential: $15,000-30,000/month</p>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-4">Start This Week</h2>

          <div className="bg-amber-900/30 border border-amber-800/50 rounded-lg p-6 my-8">
            <ol className="text-neutral-300 mb-0">
              <li className="mb-2">List 10 people in your network who run businesses</li>
              <li className="mb-2">Send 5 messages offering a free AI assessment</li>
              <li className="mb-2">Do 2-3 free assessments to build your process</li>
              <li className="mb-2">Convert 1 to paid engagement</li>
              <li>Document and repeat</li>
            </ol>
          </div>

          <p className="text-neutral-300 mb-4">
            The market is massive and the window is open. Most businesses haven&apos;t figured out AI yet — you just need to figure it out slightly faster than they do.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">Related Guides</h2>
          <ul className="text-neutral-300">
            <li><Link href="/guides/ai-business-ideas-2026" className="text-amber-500 hover:text-amber-400">17 AI Business Ideas You Can Start Today</Link></li>
            <li><Link href="/guides/best-ai-tools-for-freelancers" className="text-amber-500 hover:text-amber-400">Best AI Tools for Freelancers</Link></li>
            <li><Link href="/guides/make-money-with-ai" className="text-amber-500 hover:text-amber-400">How to Make Money with AI</Link></li>
          </ul>
        </div>
      </article>
    </main>
  )
}
