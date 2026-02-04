import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'ChatGPT Prompts to Optimize Your LinkedIn Profile | GetTheJobAI',
  description: 'Use ChatGPT to craft a compelling LinkedIn headline, About section, and experience bullets that get you found by recruiters.',
  keywords: ['LinkedIn optimization', 'ChatGPT LinkedIn', 'LinkedIn profile tips', 'LinkedIn headline', 'LinkedIn About section', 'recruiter search'],
  openGraph: {
    title: 'ChatGPT Prompts to Optimize Your LinkedIn Profile',
    description: 'Use ChatGPT to craft a LinkedIn profile that gets you found by recruiters.',
    type: 'article',
    url: 'https://getthejobai.com/guides/chatgpt-linkedin-optimization',
  },
}

export default function ChatGPTLinkedInOptimization() {
  return (
    <main className="min-h-screen bg-[#0a0f0d] text-neutral-100">
      {/* Nav */}
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
            <span>LinkedIn</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            ChatGPT Prompts to Optimize Your LinkedIn Profile
          </h1>
          <p className="text-lg text-neutral-400">
            Your LinkedIn profile is your 24/7 recruiter. Here&apos;s how to use ChatGPT to make it work harder—from headline to recommendations.
          </p>
          <div className="flex items-center gap-4 mt-6 text-sm text-neutral-500">
            <span>~12 min read</span>
            <span>•</span>
            <span className="text-emerald-500">LinkedIn</span>
          </div>
        </header>

        <div className="prose prose-invert prose-neutral max-w-none">
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold mt-0 text-emerald-400">What You&apos;ll Learn</h3>
            <ul className="mb-0 text-neutral-300">
              <li>How to define your LinkedIn target audience</li>
              <li>Prompts for headline, About, and Experience sections</li>
              <li>How to get better recommendations</li>
              <li>Common mistakes to avoid</li>
              <li>Quick wins checklist</li>
            </ul>
          </div>

          <h2 id="why-optimize" className="text-2xl font-bold mt-12 mb-4">Why LinkedIn Optimization Matters</h2>
          
          <ul className="text-neutral-300 mb-6">
            <li><strong className="text-neutral-100">87% of recruiters</strong> use LinkedIn to find candidates</li>
            <li>Profiles with complete information get <strong className="text-neutral-100">40x more opportunities</strong></li>
            <li>Keywords determine if you show up in searches</li>
          </ul>

          <p className="text-neutral-300 mb-4">
            ChatGPT can help you nail the copy. You still need to be strategic about what you&apos;re optimizing for.
          </p>

          <h2 id="define-target" className="text-2xl font-bold mt-12 mb-4">Before You Start: Define Your Target</h2>

          <p className="text-neutral-300 mb-4">First, tell ChatGPT who you&apos;re trying to attract:</p>

          <pre className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg overflow-x-auto text-sm">
            <code className="text-neutral-300">{`I'm optimizing my LinkedIn profile. Help me clarify my target:

Current role: [YOUR ROLE]
Target role: [WHAT YOU WANT]
Industries I'm targeting: [INDUSTRIES]
Key skills I want to highlight: [SKILLS]

Based on this, what keywords and themes should appear throughout my profile?`}</code>
          </pre>

          <p className="text-neutral-400 mt-4 mb-6">Save this output—you&apos;ll reference it for every section.</p>

          <h2 id="headline" className="text-2xl font-bold mt-12 mb-4">The Headline (120 characters)</h2>

          <p className="text-neutral-300 mb-4">
            Your headline shows up everywhere—search results, comments, connection requests. Most people waste it with just their job title.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-3">Prompt for Multiple Options:</h3>
          <pre className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg overflow-x-auto text-sm">
            <code className="text-neutral-300">{`Write 5 LinkedIn headline options for me. Each should:
- Be under 120 characters
- Include 1-2 keywords recruiters search for
- Show value, not just job title
- Stand out from generic headlines

My target role: [ROLE]
Key skills: [SKILLS]
What I help with: [YOUR VALUE]`}</code>
          </pre>

          <h3 className="text-xl font-semibold mt-8 mb-3">Examples of Strong Headlines:</h3>
          <ul className="text-neutral-300 mb-6">
            <li>&quot;Product Manager | B2B SaaS | Shipped features used by 2M+ users&quot;</li>
            <li>&quot;Data Scientist turning messy data into business decisions | Python, SQL, ML&quot;</li>
            <li>&quot;Helping startups go from 0 to 1 | Former Stripe, currently building at stealth&quot;</li>
          </ul>

          <h2 id="about" className="text-2xl font-bold mt-12 mb-4">The About Section (2,600 characters max)</h2>

          <p className="text-neutral-300 mb-4">
            This is your elevator pitch. Most profiles are either empty or read like a resume. Aim for conversational but professional.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-3">Prompt for First Draft:</h3>
          <pre className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg overflow-x-auto text-sm">
            <code className="text-neutral-300">{`Write a LinkedIn About section for me. Structure it as:

Paragraph 1: Who I help and what I do (hook)
Paragraph 2: My background and credibility 
Paragraph 3: What I'm known for / key achievements
Paragraph 4: What I'm looking for now (if job seeking) or CTA

Keep it conversational, not corporate. Use "I" not "John is a..."
Total: 200-300 words

My info:
- Current role: [ROLE]
- Years experience: [YEARS]
- Key achievements: [LIST 2-3]
- What I'm looking for: [GOAL]
- Personality note: [CASUAL/FORMAL/OTHER]`}</code>
          </pre>

          <h3 className="text-xl font-semibold mt-8 mb-3">Prompt to Improve Existing:</h3>
          <pre className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg overflow-x-auto text-sm">
            <code className="text-neutral-300">{`Here's my current LinkedIn About section:

[PASTE CURRENT]

Rewrite it to be:
- More specific (add numbers where possible)
- More conversational (less corporate speak)
- Better optimized for these keywords: [KEYWORDS]
- Under 300 words`}</code>
          </pre>

          <h2 id="experience" className="text-2xl font-bold mt-12 mb-4">Experience Section</h2>

          <p className="text-neutral-300 mb-4">Each role needs impact, not just responsibilities.</p>

          <h3 className="text-xl font-semibold mt-8 mb-3">Prompt for Bullet Points:</h3>
          <pre className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg overflow-x-auto text-sm">
            <code className="text-neutral-300">{`Turn these job responsibilities into achievement-focused LinkedIn bullets:

Job title: [TITLE]
Company: [COMPANY]
Responsibilities: [PASTE YOUR TASKS]

For each bullet:
- Start with action verb
- Include metric or outcome where possible
- Keep under 200 characters
- Write 4-5 bullets total`}</code>
          </pre>

          <h2 id="skills" className="text-2xl font-bold mt-12 mb-4">Skills Section</h2>

          <p className="text-neutral-300 mb-4">LinkedIn lets you add up to 50 skills. Choose strategically.</p>

          <pre className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg overflow-x-auto text-sm">
            <code className="text-neutral-300">{`I'm a [ROLE] targeting [TARGET ROLE] positions.

Based on current job market trends, list:
- 10 must-have skills for LinkedIn (recruiters search these)
- 5 emerging skills that show I'm current
- 5 soft skills that complement the hard skills

Focus on skills that appear in job descriptions for [TARGET ROLE].`}</code>
          </pre>

          <h2 id="recommendations" className="text-2xl font-bold mt-12 mb-4">Recommendations</h2>

          <p className="text-neutral-300 mb-4">Recommendations add credibility. But asking for them is awkward.</p>

          <h3 className="text-xl font-semibold mt-8 mb-3">Prompt for Request Message:</h3>
          <pre className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg overflow-x-auto text-sm">
            <code className="text-neutral-300">{`Write a LinkedIn message asking [PERSON'S ROLE/RELATIONSHIP] for a recommendation.

Context: [HOW YOU WORKED TOGETHER]
What I'd like them to highlight: [SPECIFIC SKILLS/PROJECTS]

Keep it:
- Casual and not pushy
- Specific about what to mention
- Easy for them to say yes
- Under 100 words`}</code>
          </pre>

          <h3 className="text-xl font-semibold mt-8 mb-3">Prompt to Write FOR Them (if asked):</h3>
          <pre className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg overflow-x-auto text-sm">
            <code className="text-neutral-300">{`[NAME] asked me to draft my own recommendation for them to edit. Write a recommendation that:
- Mentions specific project: [PROJECT]
- Highlights these skills: [SKILLS]
- Sounds like it's from a [COLLEAGUE/MANAGER/CLIENT]
- Is 3-4 sentences

Our working relationship: [CONTEXT]`}</code>
          </pre>

          <h2 id="featured" className="text-2xl font-bold mt-12 mb-4">Featured Section</h2>

          <p className="text-neutral-300 mb-4">Use Featured to showcase your best work.</p>

          <pre className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg overflow-x-auto text-sm">
            <code className="text-neutral-300">{`I'm adding these to my LinkedIn Featured section:
1. [ITEM 1 - article/project/etc]
2. [ITEM 2]
3. [ITEM 3]

Write a 1-sentence description for each that:
- Explains what it is and why it matters
- Includes a hook to click
- Is under 100 characters`}</code>
          </pre>

          <h2 id="mistakes" className="text-2xl font-bold mt-12 mb-4">Common Mistakes</h2>

          <ol className="text-neutral-300 mb-6">
            <li><strong className="text-neutral-100">Keyword stuffing</strong> - &quot;AI AI AI machine learning AI&quot; looks spammy</li>
            <li><strong className="text-neutral-100">Third person</strong> - &quot;John is a passionate...&quot; sounds like a bio, not a profile</li>
            <li><strong className="text-neutral-100">No metrics</strong> - &quot;Improved sales&quot; vs &quot;Increased sales 40% YoY&quot;</li>
            <li><strong className="text-neutral-100">Corporate jargon</strong> - &quot;Leveraged synergies&quot; makes eyes glaze</li>
            <li><strong className="text-neutral-100">Empty sections</strong> - Incomplete profiles rank lower</li>
          </ol>

          <h2 id="checklist" className="text-2xl font-bold mt-12 mb-4">Quick Wins Checklist</h2>

          <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6 my-6">
            <ul className="text-neutral-300 space-y-2 mb-0">
              <li>☐ Headline includes target keywords + value prop</li>
              <li>☐ About section has clear who/what/why</li>
              <li>☐ Last 3 jobs have metrics in bullets</li>
              <li>☐ 30+ skills added (endorsements help ranking)</li>
              <li>☐ At least 3 recommendations</li>
              <li>☐ Featured section has 1-3 items</li>
              <li>☐ Custom URL (linkedin.com/in/yourname)</li>
              <li>☐ Profile photo is professional and recent</li>
            </ul>
          </div>

          <h2 id="test" className="text-2xl font-bold mt-12 mb-4">Test Your Profile</h2>

          <p className="text-neutral-300 mb-4">After optimizing, test it:</p>

          <pre className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg overflow-x-auto text-sm">
            <code className="text-neutral-300">{`Review my LinkedIn profile as a recruiter looking for [TARGET ROLE]:

[PASTE FULL PROFILE TEXT]

Score 1-10 on:
- Keyword optimization
- Clarity of value proposition
- Credibility/proof points
- Call to action
- Overall impression

What's the #1 thing to improve?`}</code>
          </pre>

          <div className="bg-emerald-950/30 border border-emerald-800/50 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold mt-0 text-emerald-300">Bottom Line</h3>
            <p className="mb-0 text-neutral-300">
              Your LinkedIn profile is working for you 24/7. Spend an hour with these prompts to optimize it, 
              then let it attract opportunities while you sleep. Update quarterly or when targeting new roles.
            </p>
          </div>

          <div className="border-t border-neutral-800 mt-12 pt-8">
            <h3 className="text-lg font-semibold">Related Guides</h3>
            <ul className="text-neutral-400">
              <li><Link href="/guides/ai-job-application-tracker" className="text-emerald-400 hover:text-emerald-300">Best AI Job Application Trackers →</Link></li>
              <li><Link href="/" className="text-emerald-400 hover:text-emerald-300">All Job Search Guides →</Link></li>
            </ul>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-neutral-800/50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <p className="text-neutral-600 text-sm font-mono">© {new Date().getFullYear()} GetTheJobAI</p>
          <Link href="/" className="text-sm text-neutral-500 hover:text-emerald-500 transition-colors">
            ← back home
          </Link>
        </div>
      </footer>
    </main>
  )
}
