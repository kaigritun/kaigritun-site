"use client";

import { useState } from "react";

interface EmailSignupProps {
  headline: string;
  buttonText?: string;
  site: "mcp" | "getthejobai" | "gigwithai";
}

const themeColors = {
  mcp: {
    accent: "amber",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    button: "bg-amber-500 hover:bg-amber-600",
    text: "text-amber-500",
    focus: "focus:ring-amber-500",
  },
  getthejobai: {
    accent: "emerald",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    button: "bg-emerald-500 hover:bg-emerald-600",
    text: "text-emerald-500",
    focus: "focus:ring-emerald-500",
  },
  gigwithai: {
    accent: "violet",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    button: "bg-violet-500 hover:bg-violet-600",
    text: "text-violet-500",
    focus: "focus:ring-violet-500",
  },
};

export default function EmailSignup({ headline, buttonText = "Subscribe", site }: EmailSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const theme = themeColors[site];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/email-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, site }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "You're subscribed!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className={`${theme.bg} ${theme.border} border rounded-lg p-6 text-center`}>
        <div className={`${theme.text} text-2xl mb-2`}>✓</div>
        <p className="text-neutral-200 font-medium">{message}</p>
        <p className="text-neutral-400 text-sm mt-1">Check your inbox soon.</p>
      </div>
    );
  }

  return (
    <div className={`${theme.bg} ${theme.border} border rounded-lg p-6`}>
      <h3 className="text-lg font-semibold text-neutral-100 mb-2">{headline}</h3>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={`flex-1 px-4 py-2.5 bg-neutral-900/50 border border-neutral-700 rounded-lg 
            text-neutral-100 placeholder-neutral-500 
            focus:outline-none focus:ring-2 ${theme.focus} focus:border-transparent
            disabled:opacity-50`}
          disabled={status === "loading"}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={`${theme.button} px-6 py-2.5 rounded-lg font-medium text-white
            transition-colors disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2`}
        >
          {status === "loading" ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Subscribing...</span>
            </>
          ) : (
            buttonText
          )}
        </button>
      </form>
      {status === "error" && (
        <p className="text-red-400 text-sm mt-2">{message}</p>
      )}
      <p className="text-neutral-500 text-xs mt-3">No spam. Unsubscribe anytime.</p>
    </div>
  );
}
