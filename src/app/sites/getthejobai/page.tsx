import type { Metadata } from "next";
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: "Get The Job AI - Land Your Dream Job with AI",
  description: "AI-powered job search strategies, resume optimization, and interview prep. Get hired faster with proven AI techniques.",
  keywords: ["AI job search", "resume AI", "interview prep", "job hunting", "career AI", "ChatGPT job search"],
  openGraph: {
    title: "Get The Job AI - Land Your Dream Job with AI",
    description: "AI-powered job search strategies and interview prep",
    url: "https://getthejobai.com",
    siteName: "Get The Job AI",
    type: "website",
  },
};

const guides = [
  {
    title: "AI Resume Optimization",
    description: "Beat ATS systems and stand out to recruiters with AI-optimized resumes.",
    href: "/resume-optimization",
    tag: "Essential",
  },
  {
    title: "ChatGPT Interview Prep",
    description: "Practice with AI and nail your next interview with confidence.",
    href: "/interview-prep",
    tag: "Popular",
  },
  {
    title: "AI Cover Letter Generator",
    description: "Craft personalized cover letters that actually get read.",
    href: "/cover-letters",
    tag: "Quick Win",
  },
  {
    title: "LinkedIn AI Optimization",
    description: "Get found by recruiters with an AI-optimized profile.",
    href: "/linkedin-optimization",
    tag: "Visibility",
  },
  {
    title: "Salary Negotiation Scripts",
    description: "AI-generated scripts to negotiate your best offer.",
    href: "/salary-negotiation",
    tag: "Money",
  },
  {
    title: "Job Search Automation",
    description: "Let AI handle the grunt work of finding relevant jobs.",
    href: "/job-automation",
    tag: "Advanced",
  },
];

export default function GetTheJobAIHome() {
  return (
    <div className="min-h-screen bg-[#0a0f0d] text-neutral-100">
      {/* Nav */}
      <nav className="px-6 py-4 border-b border-neutral-800/50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <span className="font-bold text-emerald-500 tracking-tight">GetTheJobAI</span>
          <div className="flex gap-6 text-sm text-neutral-400">
            <a href="#guides" className="hover:text-emerald-500 transition-colors">guides</a>
            <a href="#newsletter" className="hover:text-emerald-500 transition-colors">newsletter</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 border-b border-neutral-800/50">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-emerald-500 font-mono text-sm mb-4">AI-powered job search</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Land Your Dream Job<br />
            <span className="text-emerald-500">with AI</span>
          </h1>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto mb-10">
            Stop applying blindly. Use AI to optimize your resume, ace interviews, 
            and negotiate offers. The job search game has changed—here's how to win.
          </p>
          <EmailSignup 
            headline="Get weekly AI job search tips" 
            buttonText="Get Free Tips" 
            site="getthejobai" 
          />
        </div>
      </section>

      {/* Guides */}
      <section id="guides" className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-8">Free Guides</h2>
          
          <div className="space-y-1">
            {guides.map((guide) => (
              <div
                key={guide.href}
                className="block py-4 group border-b border-neutral-800/30 last:border-0"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-neutral-200 group-hover:text-emerald-500 transition-colors mb-1">
                      {guide.title}
                    </h3>
                    <p className="text-sm text-neutral-500">
                      {guide.description}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-emerald-600/70 shrink-0 mt-1">
                    {guide.tag.toLowerCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-neutral-500 text-sm mt-8 text-center">
            Full guides coming soon. Subscribe to get notified.
          </p>
        </div>
      </section>

      {/* Why AI for Job Search */}
      <section className="px-6 py-16 border-t border-neutral-800/50 bg-neutral-900/20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-8">Why AI Changes Everything</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-2xl mb-3">🎯</div>
              <h3 className="font-semibold mb-2">Beat the ATS</h3>
              <p className="text-sm text-neutral-400">
                75% of resumes never reach humans. AI helps you optimize for the algorithms.
              </p>
            </div>
            <div>
              <div className="text-2xl mb-3">⚡</div>
              <h3 className="font-semibold mb-2">10x Faster</h3>
              <p className="text-sm text-neutral-400">
                Custom cover letters in seconds. Interview prep in minutes. Apply smarter, not harder.
              </p>
            </div>
            <div>
              <div className="text-2xl mb-3">💰</div>
              <h3 className="font-semibold mb-2">Higher Offers</h3>
              <p className="text-sm text-neutral-400">
                AI-powered salary research and negotiation scripts that get results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section id="newsletter" className="px-6 py-16 border-t border-neutral-800/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">Ready to Get Hired?</h2>
          <p className="text-neutral-400 text-center mb-8 max-w-lg mx-auto">
            Join thousands of job seekers using AI to land better jobs, faster. 
            Free weekly tips and strategies.
          </p>
          <EmailSignup 
            headline="Get weekly AI job search tips" 
            buttonText="Subscribe Free" 
            site="getthejobai" 
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-neutral-800/50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <p className="text-neutral-600 text-sm font-mono">© {new Date().getFullYear()} GetTheJobAI</p>
          <p className="text-neutral-600 text-sm">
            Built by <a href="https://kaigritun.com" className="hover:text-emerald-500 transition-colors">Kai Gritun</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
