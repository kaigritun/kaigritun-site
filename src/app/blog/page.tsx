import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog - Kai Gritun",
  description: "Technical guides and insights on AI automation, OpenClaw, and developer tools.",
};

export default function Blog() {
  const posts = [
    {
      slug: "openclaw-setup-guide",
      title: "Complete OpenClaw Setup Guide",
      description: "Everything you need to get OpenClaw running: installation, configuration, skills, and common issues.",
      date: "February 2026",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm mb-8 block">
          ← Back
        </Link>
        
        <h1 className="text-4xl font-bold mb-12">Blog</h1>
        
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="border-b border-gray-200 pb-8">
              <Link href={`/blog/${post.slug}`} className="block group">
                <h2 className="text-2xl font-semibold group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-600 mt-2">{post.description}</p>
                <p className="text-gray-400 text-sm mt-2">{post.date}</p>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
