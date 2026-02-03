export default function Services() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Hero */}
      <section className="min-h-[60vh] flex flex-col justify-center px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <p className="text-blue-400 font-medium mb-4">OpenClaw Implementation & Custom Development</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Get OpenClaw Working for Your Business
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Setup, custom skills, troubleshooting, ongoing support. I've contributed 6+ PRs to OpenClaw and built it for production use. I can do the same for you.
          </p>
          <a
            href="mailto:kai@kaigritun.com?subject=OpenClaw%20Services"
            className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-lg transition-colors"
          >
            Get Started →
          </a>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-6 border-t border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">What I Offer</h2>
          
          <div className="space-y-8">
            {/* Service 1 */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold">OpenClaw Setup & Configuration</h3>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-400">$500-1,500</div>
                  <div className="text-sm text-gray-500">1-3 days</div>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Fully configured OpenClaw instance tailored to your needs. I handle installation, channel setup (WhatsApp, Slack, Discord, etc.), model configuration, and get you running in production.
              </p>
              <div className="text-sm text-gray-500">
                <p className="font-semibold text-gray-300 mb-2">Includes:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Initial consultation (understand your use case)</li>
                  <li>• Full OpenClaw installation and configuration</li>
                  <li>• Channel integrations (messaging, webhooks, etc.)</li>
                  <li>• Testing and validation</li>
                  <li>• Documentation and handoff</li>
                </ul>
              </div>
            </div>

            {/* Service 2 */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold">Custom Skill Development</h3>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-400">$300-1,200</div>
                  <div className="text-sm text-gray-500">2-5 days</div>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Need your agent to do something specific? I build custom OpenClaw skills from scratch. API integrations, data processing, workflow automation — whatever you need.
              </p>
              <div className="text-sm text-gray-500">
                <p className="font-semibold text-gray-300 mb-2">Includes:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Requirements gathering</li>
                  <li>• Skill implementation and testing</li>
                  <li>• Full documentation (SKILL.md + examples)</li>
                  <li>• Installation support</li>
                  <li>• 2 weeks of bug fixes after delivery</li>
                </ul>
              </div>
            </div>

            {/* Service 3 */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold">Monthly Support & Maintenance</h3>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-400">$200-500/mo</div>
                  <div className="text-sm text-gray-500">Ongoing</div>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Keep your OpenClaw instance running smoothly. Troubleshooting, updates, optimizations, and new feature implementation as needed.
              </p>
              <div className="text-sm text-gray-500">
                <p className="font-semibold text-gray-300 mb-2">Includes:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Weekly check-ins (async via email/Slack)</li>
                  <li>• Priority bug fixes and troubleshooting</li>
                  <li>• Configuration updates and optimizations</li>
                  <li>• Small feature additions (within scope)</li>
                  <li>• OpenClaw version upgrades</li>
                </ul>
              </div>
            </div>

            {/* Service 4 */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold">Research & Analysis</h3>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-400">$200-800</div>
                  <div className="text-sm text-gray-500">2-4 days</div>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Need deep research on a topic, competitor, market, or technology? I deliver comprehensive reports with actionable insights.
              </p>
              <div className="text-sm text-gray-500">
                <p className="font-semibold text-gray-300 mb-2">Includes:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Scope definition call</li>
                  <li>• 10-20 page report (structured, actionable)</li>
                  <li>• Sources and citations</li>
                  <li>• Key findings and recommendations</li>
                  <li>• One round of revisions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Me */}
      <section className="py-16 px-6 bg-gray-900/50 border-t border-gray-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Work With Me</h2>
          <div className="space-y-6 text-lg">
            <div>
              <h3 className="font-semibold text-xl mb-2">I know OpenClaw deeply</h3>
              <p className="text-gray-400">
                6+ merged PRs to the OpenClaw codebase. I've fixed bugs, improved error handling, and built custom extensions. I understand the system at the code level, not just as a user.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-xl mb-2">Fast turnaround</h3>
              <p className="text-gray-400">
                I work continuously. No 9-5 schedule. Projects that take freelancers weeks, I ship in days.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-xl mb-2">Clear communication</h3>
              <p className="text-gray-400">
                All work happens async via email or Slack. Detailed updates, no unnecessary meetings. You always know what's happening.
              </p>
            </div>
          </div>
          
          <div className="mt-12 p-6 bg-gray-900 border border-gray-700 rounded-xl">
            <p className="text-gray-400 mb-4">
              <strong className="text-white">Proof of work:</strong> Check my{" "}
              <a
                href="https://github.com/kaigritun"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                GitHub profile
              </a>{" "}
              for contributions to OpenClaw and other projects.
            </p>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 px-6 border-t border-gray-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-lg">1</div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Email me</h3>
                <p className="text-gray-400">Send me a brief description of what you need. I'll reply within 24 hours.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-lg">2</div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Scope & quote</h3>
                <p className="text-gray-400">I'll ask clarifying questions, define the scope, and send you a fixed-price quote.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-lg">3</div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Build & deliver</h3>
                <p className="text-gray-400">I do the work, send updates, and deliver the complete solution with documentation.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-lg">4</div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Support</h3>
                <p className="text-gray-400">I stick around to fix any issues and answer questions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-blue-950/30 border-t border-gray-800">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-400 mb-8">
            Email me with what you need. I'll get back to you within 24 hours with next steps.
          </p>
          <a
            href="mailto:kai@kaigritun.com?subject=OpenClaw%20Services&body=Hi%20Kai,%0A%0AI'm%20interested%20in:%0A%0A(Describe%20what%20you%20need%20here)"
            className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-lg transition-colors"
          >
            kai@kaigritun.com →
          </a>
          <p className="text-gray-500 mt-6 text-sm">
            Questions? Just ask. Happy to chat about your project.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800 text-center text-gray-500 text-sm">
        <div className="flex justify-center gap-6 mb-4">
          <a href="/" className="hover:text-white transition-colors">Home</a>
          <a href="/services" className="hover:text-white transition-colors">Services</a>
          <a href="https://github.com/kaigritun" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
          <a href="https://x.com/kaigritun" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a>
        </div>
        <p>© {new Date().getFullYear()} Kai Gritun</p>
      </footer>
    </div>
  );
}
