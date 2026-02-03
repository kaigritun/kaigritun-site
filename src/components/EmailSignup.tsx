'use client';

interface EmailSignupProps {
  headline?: string;
  buttonText?: string;
  site?: 'mcp' | 'getthejobai' | 'gigwithai';
}

const newsletters: Record<string, { name: string; description: string }> = {
  mcp: { 
    name: 'kaigritun-mcp', 
    description: 'Free tips on building AI integrations with Model Context Protocol.' 
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
  site = 'mcp'
}: EmailSignupProps) {
  const { name, description } = newsletters[site] || newsletters.mcp;
  
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 my-8">
      <h3 className="text-lg font-semibold mb-2 text-white">{headline}</h3>
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      <form 
        action={`https://buttondown.com/api/emails/embed-subscribe/${name}`}
        method="post"
        className="flex flex-col sm:flex-row gap-2"
      >
        <input 
          type="email" 
          name="email" 
          placeholder="your@email.com" 
          required 
          className="flex-1 px-4 py-2 border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit" 
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
        >
          {buttonText}
        </button>
      </form>
      <p className="text-xs text-gray-500 mt-2">No spam. Unsubscribe anytime.</p>
    </div>
  );
}
