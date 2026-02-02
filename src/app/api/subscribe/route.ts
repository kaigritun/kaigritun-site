import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Log subscriber
    console.log("=== NEW SUBSCRIBER ===");
    console.log("Email:", email);
    console.log("Time:", new Date().toISOString());
    console.log("======================");

    // Send email with prompts via himalaya (Gmail account)
    const emailBody = `From: Kai Gritun <kaigritun@gmail.com>
To: ${email}
Subject: Your Free Research Prompts - Ready to Use

Hi there!

Thanks for grabbing the research prompts. Here they are:

## Quick Scan Prompt
Use this when you need a 5-minute overview of any topic.

"I need a quick scan of [TOPIC]. Provide: 1) A concise summary (3-4 sentences), 2) The 3 most important things to know, 3) Common misconceptions, 4) The best 2-3 resources to learn more. Be specific and actionable."

## Deep Dive Prompt
Use this for comprehensive 15-minute research briefs.

"I need a comprehensive brief on [TOPIC]. Cover: 1) Historical context and evolution, 2) Current state and key players, 3) Main benefits and drawbacks, 4) Common use cases, 5) Future outlook and trends, 6) Recommended next steps for someone looking to implement/use this. Provide specific examples and data where possible."

## Competitive Analysis Prompt
Use this to compare options side-by-side.

"I need a competitive analysis comparing [OPTION A], [OPTION B], and [OPTION C] for [USE CASE]. For each option provide: 1) Core strengths, 2) Main weaknesses, 3) Best fit scenarios, 4) Pricing/cost considerations. Then give a clear recommendation based on typical use cases."

## Decision Brief Prompt
Use this when making important decisions.

"I'm deciding whether to [DECISION]. Help me think through this by providing: 1) Arguments FOR this decision with supporting evidence, 2) Arguments AGAINST with risks/downsides, 3) Key factors to consider, 4) Potential mitigation strategies for risks, 5) A framework for making this decision. Be balanced and thorough."

---

**How to use them:**
1. Copy the prompt that matches your need
2. Replace [TOPIC] or [DECISION] with your specific question
3. Paste into ChatGPT or Claude
4. Get a structured, comprehensive research brief

**Pro tip:** Start with Quick Scan for new topics, then use Deep Dive if you need more detail.

Questions? Just reply to this email.

Best,
Kai

P.S. Want the complete research system with 12 advanced prompts and templates? Check out kaigritun.com for the full package ($19).`;

    try {
      await execAsync(`echo ${JSON.stringify(emailBody)} | himalaya message send -a gmail`);
      console.log("✓ Email delivered to:", email);
    } catch (emailError) {
      console.error("Email send failed:", emailError);
      // Don't fail the request - we still logged the subscriber
    }

    return NextResponse.json({ 
      success: true,
      message: "Thanks! Check your email for the download link."
    });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
