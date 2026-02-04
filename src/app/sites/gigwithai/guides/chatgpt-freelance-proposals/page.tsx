import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'ChatGPT Prompts for Winning Freelance Proposals | GigWithAI',
  description: 'Use ChatGPT to write freelance proposals that actually convert. Proven prompts for Upwork, Fiverr, and more.',
  keywords: ['ChatGPT freelance', 'Upwork proposals', 'Fiverr proposals', 'AI proposals', 'freelance AI', 'proposal templates'],
  openGraph: {
    title: 'ChatGPT Prompts for Winning Freelance Proposals',
    description: 'Use ChatGPT to write freelance proposals that actually convert.',
    type: 'article',
    url: 'https://gigwithai.com/guides/chatgpt-freelance-proposals',
  },
}

export default function ChatGPTFreelanceProposals() {
  return (
    <main className="min-h-screen bg-[#0c0a10] text-neutral-100">
      {/* Nav */}
      <nav className="px-6 py-4 border-b border-neutral-800/50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-violet-500 tracking-tight">GigWithAI</Link>
          <div className="flex gap-6 text-sm text-neutral-400">
            <Link href="/#hustles" className="hover:text-violet-500 transition-colors">hustles</Link>
            <Link href="/#newsletter" className="hover:text-violet-500 transition-colors">newsletter</Link>
          </div>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-16">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-sm text-neutral-500 mb-4">
            <Link href="/" className="hover:text-neutral-300">Home</Link>
            <span>/</span>
            <span>Guides</span>
            <span>/</span>
            <span>Freelance Proposals</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            ChatGPT Prompts for Winning Freelance Proposals
          </h1>
          <p className="text-lg text-neutral-400">
            Writing proposals on Upwork and Fiverr eats hours. Most get ignored. Here&apos;s how to use ChatGPT to write proposals that actually convert.
          </p>
          <div className="flex items-center gap-4 mt-6 text-sm text-neutral-500">
            <span>~8 min read</span>
            <span>•</span>
            <span className="text-violet-500">Freelance</span>
          </div>
        </header>

        <div className="prose prose-invert prose-neutral max-w-none">
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold mt-0 text-violet-400">What You&apos;ll Learn</h3>
            <ul className="mb-0 text-neutral-300">
              <li>Why most freelance proposals fail</li>
              <li>The core proposal framework that works</li>
              <li>5 ChatGPT prompts for different proposal stages</li>
              <li>Real before/after examples</li>
              <li>Common mistakes to avoid</li>
            </ul>
          </div>

          <h2 id="why-proposals-fail" className="text-2xl font-bold mt-12 mb-4">Why Most Freelance Proposals Fail</h2>
          
          <p className="text-neutral-300 mb-4">
            The average Upwork job gets 20-50 proposals. Clients skim for 5 seconds. Generic templates blend into noise.
          </p>

          <p className="text-neutral-300 mb-4">What works:</p>
          <ul className="text-neutral-300 mb-6">
            <li><strong className="text-neutral-100">Specific</strong> - Reference their exact problem</li>
            <li><strong className="text-neutral-100">Proof</strong> - Show you&apos;ve done similar work</li>
            <li><strong className="text-neutral-100">Clear next step</strong> - What happens if they hire you</li>
          </ul>

          <p className="text-neutral-300 mb-4">ChatGPT can help with all three.</p>

          <h2 id="framework" className="text-2xl font-bold mt-12 mb-4">The Core Proposal Framework</h2>
          
          <p className="text-neutral-300 mb-4">Before prompts, understand the structure:</p>
          
          <ol className="text-neutral-300 mb-6">
            <li><strong className="text-neutral-100">Hook</strong> (1 sentence) - Show you read the job post</li>
            <li><strong className="text-neutral-100">Credibility</strong> (2-3 sentences) - Why you specifically</li>
            <li><strong className="text-neutral-100">Approach</strong> (2-3 sentences) - How you&apos;d tackle it</li>
            <li><strong className="text-neutral-100">CTA</strong> (1 sentence) - Next step</li>
          </ol>

          <h2 id="prompt-1" className="text-2xl font-bold mt-12 mb-4">Prompt 1: Analyze the Job Post</h2>
          
          <pre className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg overflow-x-auto text-sm">
            <code className="text-neutral-300">{`I'm applying to this freelance job. Extract:
1. The core problem they're trying to solve
2. Specific requirements mentioned
3. Red flags or concerns they might have
4. Keywords I should include in my proposal

Job post:
[PASTE JOB POST]`}</code>
          </pre>

          <p className="text-neutral-400 mt-4 mb-6">This gives you the raw material. Now you know exactly what to address.</p>

          <h2 id="prompt-2" className="text-2xl font-bold mt-12 mb-4">Prompt 2: Generate Your Hook</h2>

          <pre className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg overflow-x-auto text-sm">
            <code className="text-neutral-300">{`Based on this job post, write 3 opening lines for my proposal that:
- Reference something specific from their post
- Show I understand their actual problem (not just the task)
- Are under 20 words each

Job post: [PASTE]
My relevant experience: [BRIEF DESCRIPTION]`}</code>
          </pre>

          <p className="text-neutral-400 mt-4 mb-6">Pick the best one or combine elements.</p>

          <h2 id="prompt-3" className="text-2xl font-bold mt-12 mb-4">Prompt 3: Write the Full Proposal</h2>

          <pre className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg overflow-x-auto text-sm">
            <code className="text-neutral-300">{`Write a freelance proposal for this job using this structure:
- Hook (1 sentence referencing their specific need)
- Credibility (2 sentences about relevant experience)
- Approach (2-3 sentences on how I'd tackle this)
- CTA (1 sentence with clear next step)

Keep it under 150 words. No fluff.

Job: [PASTE JOB POST]
My background: [YOUR EXPERIENCE]
Portfolio pieces: [RELEVANT WORK]`}</code>
          </pre>

          <h2 id="prompt-4" className="text-2xl font-bold mt-12 mb-4">Prompt 4: Tailor for Specific Platforms</h2>

          <h3 className="text-xl font-semibold mt-8 mb-3">For Upwork:</h3>
          <pre className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg overflow-x-auto text-sm">
            <code className="text-neutral-300">{`Rewrite this proposal for Upwork. Include:
- Reference to their budget/timeline if mentioned
- Question to encourage response
- Mention of availability

Original proposal: [YOUR DRAFT]`}</code>
          </pre>

          <h3 className="text-xl font-semibold mt-8 mb-3">For Fiverr Custom Offers:</h3>
          <pre className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg overflow-x-auto text-sm">
            <code className="text-neutral-300">{`Make this more casual and direct for a Fiverr custom offer. 
Shorter paragraphs. Include a clear deliverable and timeline.

Original: [YOUR DRAFT]`}</code>
          </pre>

          <h2 id="prompt-5" className="text-2xl font-bold mt-12 mb-4">Prompt 5: Handle Objections</h2>

          <pre className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg overflow-x-auto text-sm">
            <code className="text-neutral-300">{`This client might worry about:
- [CONCERN 1 - e.g., "tight timeline"]
- [CONCERN 2 - e.g., "limited budget"]

Rewrite my proposal to subtly address these concerns without being defensive.

Current proposal: [YOUR DRAFT]`}</code>
          </pre>

          <h2 id="example" className="text-2xl font-bold mt-12 mb-4">Real Example: Before and After</h2>

          <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4 my-4">
            <p className="text-sm font-semibold text-red-400 mb-2">❌ Before (Generic):</p>
            <p className="text-neutral-400 italic">&quot;Hi! I&apos;m a web developer with 5 years experience. I can build your website. Let me know if interested.&quot;</p>
          </div>

          <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-lg p-4 my-4">
            <p className="text-sm font-semibold text-emerald-400 mb-2">✅ After (ChatGPT-assisted):</p>
            <p className="text-neutral-300 italic">&quot;You need the Shopify store migrated before your Black Friday sale - that&apos;s a tight timeline but doable. I&apos;ve done 3 similar Shopify migrations this year, including one with 500+ products completed in 8 days. I&apos;d start with a product audit to identify potential migration issues before touching any data. Want me to send over a timeline breakdown?&quot;</p>
          </div>

          <p className="text-neutral-400 mt-4">Same person, same experience. Completely different response rate.</p>

          <h2 id="tips" className="text-2xl font-bold mt-12 mb-4">Tips for Better Results</h2>

          <ol className="text-neutral-300 mb-6">
            <li><strong className="text-neutral-100">Feed it your wins</strong> - Tell ChatGPT about past successful proposals</li>
            <li><strong className="text-neutral-100">Iterate</strong> - First draft is never final. Ask &quot;make this more specific&quot; or &quot;shorten this&quot;</li>
            <li><strong className="text-neutral-100">Keep your voice</strong> - Edit the output to sound like you</li>
            <li><strong className="text-neutral-100">Save templates</strong> - Build a prompt library for common job types</li>
          </ol>

          <h2 id="mistakes" className="text-2xl font-bold mt-12 mb-4">Common Mistakes</h2>

          <ul className="text-neutral-300 mb-6">
            <li><strong className="text-neutral-100">Copy-paste without editing</strong> - Clients can smell AI-only proposals</li>
            <li><strong className="text-neutral-100">Too long</strong> - If ChatGPT gives you 300 words, cut it to 150</li>
            <li><strong className="text-neutral-100">No personalization</strong> - Always include something specific to THEIR post</li>
            <li><strong className="text-neutral-100">Generic CTAs</strong> - &quot;Let me know&quot; is weak. &quot;Want me to send a timeline?&quot; is better</li>
          </ul>

          <h2 id="next-steps" className="text-2xl font-bold mt-12 mb-4">Next Steps</h2>

          <ol className="text-neutral-300 mb-6">
            <li>Copy these prompts to a doc you can access quickly</li>
            <li>Try them on your next 5 proposals</li>
            <li>Track which versions get responses</li>
            <li>Refine based on what works</li>
          </ol>

          <div className="bg-violet-950/30 border border-violet-800/50 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold mt-0 text-violet-300">Bottom Line</h3>
            <p className="mb-0 text-neutral-300">
              The goal isn&apos;t to automate proposals entirely—it&apos;s to get to a strong first draft faster, 
              so you can send more high-quality proposals per hour.
            </p>
          </div>

          <div className="border-t border-neutral-800 mt-12 pt-8">
            <h3 className="text-lg font-semibold">Related Guides</h3>
            <ul className="text-neutral-400">
              <li><Link href="/" className="text-violet-400 hover:text-violet-300">AI Side Hustles Overview →</Link></li>
            </ul>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-neutral-800/50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <p className="text-neutral-600 text-sm font-mono">© {new Date().getFullYear()} GigWithAI</p>
          <Link href="/" className="text-sm text-neutral-500 hover:text-violet-500 transition-colors">
            ← back home
          </Link>
        </div>
      </footer>
    </main>
  )
}
