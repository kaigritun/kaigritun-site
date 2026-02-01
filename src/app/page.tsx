"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Hero - Problem + Promise */}
      <section className="min-h-[80vh] flex flex-col justify-center px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-blue-400 font-medium mb-4">Stop wasting hours on research</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Get Comprehensive Research Briefs in <span className="text-blue-400">15 Minutes</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            4 AI prompts that turn ChatGPT into your research assistant. 
            Competitive analysis, market research, decision briefs — done fast.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#get-prompts"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-lg transition-colors"
            >
              Get the Free Prompts →
            </a>
          </div>
          <p className="text-gray-500 mt-4 text-sm">Free download. No credit card required.</p>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-16 px-6 border-t border-gray-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Sound familiar?</h2>
          <div className="space-y-4 text-lg text-gray-400">
            <p>→ You spend hours Googling and still don't have clear answers</p>
            <p>→ ChatGPT gives you generic, surface-level responses</p>
            <p>→ You're making decisions without the full picture</p>
            <p>→ Research reports take days when you need them in hours</p>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-16 px-6 bg-gray-900/50 border-t border-gray-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">The fix is simple</h2>
          <p className="text-gray-400 text-lg text-center mb-8">
            Most people use ChatGPT wrong for research. They ask vague questions and get vague answers.
          </p>
          <p className="text-gray-300 text-lg text-center">
            These prompts are structured to extract <span className="text-white font-semibold">specific, actionable intelligence</span> — 
            the kind consultants charge $500/hour to deliver.
          </p>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-16 px-6 border-t border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-12 text-center">What's included</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Quick Scan Prompt</h3>
              <p className="text-gray-400">5-minute overview of any topic. Key facts, common misconceptions, best resources.</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Deep Dive Prompt</h3>
              <p className="text-gray-400">Comprehensive 15-minute brief. History, current state, key players, future outlook.</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Competitive Analysis Prompt</h3>
              <p className="text-gray-400">Compare 3+ options side-by-side. Strengths, weaknesses, best-fit recommendations.</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Decision Brief Prompt</h3>
              <p className="text-gray-400">Make better choices. Arguments for/against, risks, mitigation strategies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-gray-900/50 border-t border-gray-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-12 text-center">How it works</h2>
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="font-semibold mb-1">Copy the prompt</h3>
                <p className="text-gray-400">Pick the prompt that matches your research need</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="font-semibold mb-1">Fill in your topic</h3>
                <p className="text-gray-400">Replace [TOPIC] with what you're researching</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="font-semibold mb-1">Get your brief</h3>
                <p className="text-gray-400">Receive a structured, comprehensive research brief in minutes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Email Capture */}
      <section id="get-prompts" className="py-20 px-6 border-t border-gray-800">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Get the prompts free</h2>
          <p className="text-gray-400 mb-8">
            Enter your email and I'll send them right over. Start doing better research today.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 rounded-lg font-semibold transition-colors whitespace-nowrap"
            >
              {status === "loading" ? "Sending..." : "Send Me the Prompts"}
            </button>
          </form>
          
          {status === "success" && (
            <p className="mt-4 text-green-400">Check your email! The prompts are on their way.</p>
          )}
          {status === "error" && (
            <p className="mt-4 text-red-400">Something went wrong. Try again?</p>
          )}
          
          <p className="mt-6 text-gray-500 text-sm">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* Paid Upsell */}
      <section className="py-20 px-6 bg-blue-950/30 border-t border-gray-800">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-blue-400 font-medium mb-4">Want to go deeper?</p>
          <h2 className="text-3xl font-bold mb-4">The Complete Research System</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            12 advanced prompts, templates, and a complete workflow for turning AI into your research team.
            Everything I use for market research, competitive analysis, and strategic decisions.
          </p>
          
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 max-w-md mx-auto mb-8">
            <div className="text-4xl font-bold mb-2">$19</div>
            <p className="text-gray-400 mb-6">One-time purchase. Lifetime access.</p>
            <ul className="text-left space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>12 advanced research prompts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>Research brief templates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>Workflow guide (how I use these daily)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>Future updates included</span>
              </li>
            </ul>
            <a
              href="mailto:kai@kaigritun.com?subject=Complete%20Research%20System&body=I'd%20like%20to%20purchase%20the%20Complete%20Research%20System%20($19)"
              className="block w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors text-center"
            >
              Get the Complete System →
            </a>
          </div>
          <p className="text-gray-500 text-sm">
            Questions? Email kai@kaigritun.com
          </p>
        </div>
      </section>

      {/* About / Trust */}
      <section className="py-16 px-6 bg-gray-900/50 border-t border-gray-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Who made this?</h2>
          <p className="text-gray-400">
            I'm Kai. I spend most of my time researching — markets, competitors, technologies, decisions. 
            These prompts are what I actually use every day. They work.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <a
              href="https://x.com/kaigritun"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              @kaigritun
            </a>
            <span className="text-gray-700">·</span>
            <a
              href="mailto:kai@kaigritun.com"
              className="text-gray-400 hover:text-white transition-colors"
            >
              kai@kaigritun.com
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Kai Gritun</p>
      </footer>
    </div>
  );
}
