import type { Metadata } from "next";
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: "Gig With AI - Start Your AI Side Hustle",
  description: "Turn AI skills into income. Discover proven side hustles, freelance strategies, and passive income ideas using ChatGPT and other AI tools.",
  keywords: ["AI side hustle", "AI freelance", "ChatGPT money", "AI income", "passive income AI", "make money with AI"],
  openGraph: {
    title: "Gig With AI - Start Your AI Side Hustle",
    description: "Turn AI skills into income",
    url: "https://gigwithai.com",
    siteName: "Gig With AI",
    type: "website",
  },
};

const hustles = [
  {
    title: "AI Content Creation",
    description: "Write blogs, social posts, and copy for clients using AI assistance.",
    income: "$2-5k/mo",
    difficulty: "Easy",
  },
  {
    title: "AI Image Generation",
    description: "Create logos, art, and graphics with Midjourney and DALL-E.",
    income: "$1-3k/mo",
    difficulty: "Easy",
  },
  {
    title: "Chatbot Building",
    description: "Build custom AI chatbots for businesses and customer service.",
    income: "$3-10k/mo",
    difficulty: "Medium",
  },
  {
    title: "AI Consulting",
    description: "Help businesses integrate AI into their workflows.",
    income: "$5-15k/mo",
    difficulty: "Medium",
  },
  {
    title: "Prompt Engineering",
    description: "Create and sell prompt templates for specific industries.",
    income: "$1-4k/mo",
    difficulty: "Easy",
  },
  {
    title: "AI Automation Services",
    description: "Automate repetitive tasks for clients with AI workflows.",
    income: "$4-12k/mo",
    difficulty: "Advanced",
  },
];

export default function GigWithAIHome() {
  return (
    <div className="min-h-screen bg-[#0c0a10] text-neutral-100">
      {/* Nav */}
      <nav className="px-6 py-4 border-b border-neutral-800/50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <span className="font-bold text-violet-500 tracking-tight">GigWithAI</span>
          <div className="flex gap-6 text-sm text-neutral-400">
            <a href="#hustles" className="hover:text-violet-500 transition-colors">hustles</a>
            <a href="#newsletter" className="hover:text-violet-500 transition-colors">newsletter</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 border-b border-neutral-800/50">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-violet-500 font-mono text-sm mb-4">AI side hustles that pay</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Make Money<br />
            <span className="text-violet-500">with AI</span>
          </h1>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto mb-10">
            AI isn't replacing jobs—it's creating them. Learn how to turn your AI skills 
            into a profitable side hustle or full-time income.
          </p>
          <EmailSignup 
            headline="Get AI income ideas weekly" 
            buttonText="Get Ideas" 
            site="gigwithai" 
          />
        </div>
      </section>

      {/* Hustles */}
      <section id="hustles" className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-8">Proven AI Side Hustles</h2>
          
          <div className="space-y-4">
            {hustles.map((hustle) => (
              <div
                key={hustle.title}
                className="bg-neutral-900/30 border border-neutral-800/50 rounded-lg p-5 hover:border-violet-500/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-100 mb-1">
                      {hustle.title}
                    </h3>
                    <p className="text-sm text-neutral-400 mb-3">
                      {hustle.description}
                    </p>
                    <div className="flex gap-3">
                      <span className="text-xs font-mono bg-violet-500/10 text-violet-400 px-2 py-1 rounded">
                        {hustle.income}
                      </span>
                      <span className="text-xs font-mono bg-neutral-800 text-neutral-400 px-2 py-1 rounded">
                        {hustle.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Now */}
      <section className="px-6 py-16 border-t border-neutral-800/50 bg-neutral-900/20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-8">Why Start Now?</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-2xl mb-3">🚀</div>
              <h3 className="font-semibold mb-2">Early Mover Advantage</h3>
              <p className="text-sm text-neutral-400">
                AI skills are in massive demand. Position yourself before the market saturates.
              </p>
            </div>
            <div>
              <div className="text-2xl mb-3">🔧</div>
              <h3 className="font-semibold mb-2">Low Barrier to Entry</h3>
              <p className="text-sm text-neutral-400">
                No coding required for most AI side hustles. Just ChatGPT and creativity.
              </p>
            </div>
            <div>
              <div className="text-2xl mb-3">📈</div>
              <h3 className="font-semibold mb-2">Scalable Income</h3>
              <p className="text-sm text-neutral-400">
                Start small, grow big. Many AI hustles can become full businesses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stats */}
      <section className="px-6 py-16 border-t border-neutral-800/50">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-violet-500 mb-1">$4.2B</div>
              <p className="text-sm text-neutral-500">AI freelance market by 2025</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-violet-500 mb-1">70%</div>
              <p className="text-sm text-neutral-500">of companies hiring AI skills</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-violet-500 mb-1">$50-150</div>
              <p className="text-sm text-neutral-500">average hourly rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section id="newsletter" className="px-6 py-16 border-t border-neutral-800/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">Ready to Start Earning?</h2>
          <p className="text-neutral-400 text-center mb-8 max-w-lg mx-auto">
            Get weekly AI side hustle ideas, strategies, and success stories 
            delivered to your inbox. Join the AI income revolution.
          </p>
          <EmailSignup 
            headline="Get AI income ideas weekly" 
            buttonText="Subscribe Free" 
            site="gigwithai" 
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-neutral-800/50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <p className="text-neutral-600 text-sm font-mono">© {new Date().getFullYear()} GigWithAI</p>
          <p className="text-neutral-600 text-sm">
            Built by <a href="https://kaigritun.com" className="hover:text-violet-500 transition-colors">Kai Gritun</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
