import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Use ChatGPT for Networking Emails | GetTheJobAI',
  description: 'Learn to write networking emails that get responses using ChatGPT. Includes prompts, examples, and advanced techniques.',
  keywords: ['ChatGPT networking emails', 'AI networking messages', 'networking email prompts', 'professional networking', 'job search networking'],
  openGraph: {
    title: 'How to Use ChatGPT for Networking Emails',
    description: 'Write networking emails that actually get responses using ChatGPT.',
    type: 'article',
    url: 'https://getthejobai.com/guides/chatgpt-networking-emails',
  },
}

export default function ChatGPTNetworkingEmails() {
  return (
    <main className="min-h-screen bg-[#0a0f0d] text-neutral-100">
      <nav className="px-6 py-4 border-b border-neutral-800/50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-emerald-500 tracking-tight">GetTheJobAI</Link>
          <div className="flex gap-6 text-sm text-neutral-400">
            <Link href="/#guides" className="hover:text-emerald-500 transition-colors">guides</Link>
            <Link href="/#newsletter" className="hover:text-emerald-500 transition-colors">newsletter</Link>
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
            <span>Networking</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            How to Use ChatGPT for Networking Emails
          </h1>
          <p className="text-lg text-neutral-400">
            Networking emails are awkward. Here&apos;s how to use ChatGPT to write messages that actually get responses.
          </p>
          <div className="flex items-center gap-4 mt-6 text-sm text-neutral-500">
            <span>~8 min read</span>
            <span>•</span>
            <span className="text-emerald-500">Networking</span>
          </div>
        </header>

        <div className="prose prose-invert prose-neutral max-w-none">
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold mt-0 text-emerald-400">What You&apos;ll Learn</h3>
            <ul className="mb-0 text-neutral-300">
              <li>Why most networking emails fail</li>
              <li>The perfect prompt structure for ChatGPT</li>
              <li>Real examples you can adapt</li>
              <li>Advanced techniques for follow-ups</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-4">Why Most Networking Emails Fail</h2>
          
          <p className="text-neutral-300 mb-4">
            The typical networking email sounds like this:
          </p>

          <blockquote className="border-l-4 border-neutral-700 pl-4 italic text-neutral-400 my-6">
            &quot;Dear Mr. Smith, I hope this email finds you well. I am reaching out because I am interested in opportunities at your company...&quot;
          </blockquote>

          <p className="text-neutral-300 mb-4">
            Nobody responds to that. It&apos;s generic, self-focused, and sounds like a template.
          </p>

          <p className="text-neutral-300 mb-4">Good networking emails are:</p>
          <ul className="text-neutral-300 mb-6">
            <li><strong className="text-neutral-100">Specific</strong> — shows you did research</li>
            <li><strong className="text-neutral-100">Brief</strong> — respects their time</li>
            <li><strong className="text-neutral-100">Value-focused</strong> — what&apos;s in it for them</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-4">The Perfect Prompt Structure</h2>

          <p className="text-neutral-300 mb-4">
            Don&apos;t just ask ChatGPT to &quot;write a networking email.&quot; That gives you generic garbage.
          </p>

          <p className="text-neutral-300 mb-4">Use this framework:</p>

          <pre className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg overflow-x-auto text-sm">
            <code className="text-neutral-300">{`I need to write a networking email to [specific person/role] at [company].

Context:
- How I found them: [LinkedIn, mutual connection, their content, etc.]
- What impressed me: [specific thing they did/said]
- My background: [relevant experience in 1-2 sentences]
- My ask: [specific, reasonable request]

Write a brief email (under 100 words) that:
- Opens with something specific about them
- Briefly explains why I'm reaching out
- Makes one clear, small ask
- Sounds like a real person wrote it`}</code>
          </pre>

          <h2 className="text-2xl font-bold mt-12 mb-4">Example: Reaching Out to a Hiring Manager</h2>

          <p className="text-neutral-300 mb-4"><strong>Prompt:</strong></p>

          <pre className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg overflow-x-auto text-sm">
            <code className="text-neutral-300">{`I need to write a networking email to Sarah Chen, Engineering Director at Stripe.

Context:
- Found her through her talk at the Women in Tech conference
- Impressed by her approach to building diverse engineering teams
- I'm a senior engineer with 5 years in fintech
- Ask: 15-minute call about engineering culture at Stripe

Write a brief email that sounds genuine.`}</code>
          </pre>

          <p className="text-neutral-300 mt-6 mb-4"><strong>Result:</strong></p>

          <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4 my-4">
            <p className="text-neutral-300 mb-3">Hi Sarah,</p>
            <p className="text-neutral-300 mb-3">
              Your Women in Tech talk on building diverse teams stuck with me — especially the part about rethinking technical interviews. I&apos;ve been thinking about how to apply that at my current company.
            </p>
            <p className="text-neutral-300 mb-3">
              I&apos;m a senior fintech engineer exploring what&apos;s next, and Stripe&apos;s engineering culture keeps coming up in my research. Would you have 15 minutes sometime to share what makes it different?
            </p>
            <p className="text-neutral-300">Either way, thanks for putting that talk out there.</p>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-4">Advanced Techniques</h2>

          <h3 className="text-xl font-semibold mt-8 mb-3">1. Research Mode</h3>
          <p className="text-neutral-300 mb-4">Before writing, have ChatGPT help you research:</p>

          <pre className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg overflow-x-auto text-sm">
            <code className="text-neutral-300">{`I want to reach out to [person] at [company]. Help me find:
- Their recent LinkedIn posts or articles
- Company news from the last 3 months
- Mutual connections or shared experiences
- Something specific I could reference in my email`}</code>
          </pre>

          <h3 className="text-xl font-semibold mt-8 mb-3">2. Multiple Versions</h3>
          <p className="text-neutral-300 mb-4">Generate 3-4 versions and pick the best elements:</p>

          <pre className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg overflow-x-auto text-sm">
            <code className="text-neutral-300">{`Write 4 different versions of this networking email, each with a different opening hook:
1. Reference their recent work
2. Mention a mutual connection
3. Ask a thoughtful question
4. Lead with a relevant insight`}</code>
          </pre>

          <h3 className="text-xl font-semibold mt-8 mb-3">3. The Follow-Up Sequence</h3>
          <p className="text-neutral-300 mb-4">Plan your follow-ups in advance:</p>

          <pre className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg overflow-x-auto text-sm">
            <code className="text-neutral-300">{`Create a 3-email sequence for networking outreach:
- Email 1: Initial contact (send now)
- Email 2: Gentle follow-up (1 week later)
- Email 3: Final attempt (2 weeks later)

Each should be shorter than the last and add new value.`}</code>
          </pre>

          <h2 className="text-2xl font-bold mt-12 mb-4">What NOT to Do</h2>

          <ul className="text-neutral-300 mb-6">
            <li>❌ <strong>Sending without editing</strong> — Always personalize the output</li>
            <li>❌ <strong>Too formal</strong> — &quot;I would be honored if you would consider...&quot; sounds robotic</li>
            <li>❌ <strong>Burying the ask</strong> — Put your request early and make it specific</li>
            <li>❌ <strong>Mass blasting</strong> — Quality over quantity; 10 personalized emails beat 100 templates</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-4">The 30-Second Review</h2>

          <p className="text-neutral-300 mb-4">Before sending any networking email:</p>

          <ol className="text-neutral-300 mb-6">
            <li><strong className="text-neutral-100">The name test</strong> — Does it mention something only this person would appreciate?</li>
            <li><strong className="text-neutral-100">The favor test</strong> — Is your ask small and specific?</li>
            <li><strong className="text-neutral-100">The delete test</strong> — If you received this, would you respond or delete?</li>
          </ol>

          <div className="bg-emerald-900/30 border border-emerald-800/50 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold mt-0 text-emerald-400">Start Now</h3>
            <p className="mb-0 text-neutral-300">
              Open ChatGPT and try the prompt framework above for your next networking email. 
              The AI gets you 80% there — your personal touch closes the gap.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-4">Related Guides</h2>
          <ul className="text-neutral-300">
            <li><Link href="/guides/chatgpt-resume-prompts" className="text-emerald-500 hover:text-emerald-400">50 ChatGPT Prompts for Your Job Search</Link></li>
            <li><Link href="/guides/ai-interview-preparation" className="text-emerald-500 hover:text-emerald-400">AI Tools for Job Interviews</Link></li>
            <li><Link href="/guides/ai-job-search-tools" className="text-emerald-500 hover:text-emerald-400">AI Job Search Tools That Actually Work</Link></li>
          </ul>
        </div>
      </article>
    </main>
  )
}
