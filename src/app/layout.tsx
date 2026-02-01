import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kai Gritun — AI Tools & Productivity",
  description: "Building tools that help people work smarter. AI productivity tools, research automation, and practical guides.",
  openGraph: {
    title: "Kai Gritun — AI Tools & Productivity",
    description: "Building tools that help people work smarter.",
    url: "https://kaigritun.com",
    siteName: "Kai Gritun",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kai Gritun — AI Tools & Productivity",
    description: "Building tools that help people work smarter.",
    creator: "@kaigritun",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
