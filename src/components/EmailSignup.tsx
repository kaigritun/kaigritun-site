'use client';

import { useState, FormEvent } from 'react';

interface EmailSignupProps {
  headline?: string;
  buttonText?: string;
  site?: 'mcp' | 'getthejobai' | 'gigwithai';
  compact?: boolean;
}

const newsletters: Record<string, { name: string; description: string }> = {
  mcp: { 
    name: 'kaigritun', 
    description: 'Tutorials, updates, and best practices for Model Context Protocol.' 
  },
  getthejobai: { 
    name: 'getthejobai', 
    description: 'AI job search tips delivered weekly.' 
  },
  gigwithai: { 
    name: 'gigwithai', 
    description: 'AI side hustle ideas to boost your income.' 
  },
};

export default function EmailSignup({ 
  headline = 'Get updates in your inbox',
  buttonText = 'Subscribe',
  site = 'mcp',
  compact = false
}: EmailSignupProps) {
  const { name, description } = newsletters[site] || newsletters.mcp;
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const form = e.target as HTMLFormElement;
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.ok || response.status === 303) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      // Buttondown redirects on success, which can throw
      setStatus('success');
      setEmail('');
    }
  };

  if (status === 'success') {
    return (
      <div className={`bg-amber-500/10 border border-amber-500/30 rounded-lg ${compact ? 'p-4' : 'p-6'}`}>
        <p className="text-amber-500 font-medium">✓ You&apos;re in!</p>
        <p className="text-neutral-400 text-sm mt-1">Check your inbox to confirm your subscription.</p>
      </div>
    );
  }
  
  return (
    <div className={`bg-neutral-900 border border-neutral-800 rounded-lg ${compact ? 'p-4' : 'p-6'}`}>
      {!compact && <h3 className="text-lg font-semibold mb-2 text-white">{headline}</h3>}
      {!compact && <p className="text-neutral-400 text-sm mb-4">{description}</p>}
      <form 
        action={`https://buttondown.com/api/emails/embed-subscribe/${name}`}
        method="post"
        onSubmit={handleSubmit}
        className={`flex ${compact ? 'flex-row' : 'flex-col sm:flex-row'} gap-2`}
      >
        <input 
          type="email" 
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email" 
          required 
          className="flex-1 px-4 py-2.5 border border-neutral-700 rounded-md bg-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
        <button 
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-black font-medium rounded-md transition-colors whitespace-nowrap"
        >
          {status === 'loading' ? 'Joining...' : buttonText}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-red-400 text-sm mt-2">Something went wrong. Please try again.</p>
      )}
      {!compact && <p className="text-xs text-neutral-500 mt-3">No spam. Unsubscribe anytime.</p>}
    </div>
  );
}
