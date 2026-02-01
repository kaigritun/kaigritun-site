import { NextRequest, NextResponse } from "next/server";

const PROMPTS_CONTENT = `
# AI Research Prompts - Free Pack

Thanks for downloading! Here are 4 battle-tested prompts for fast, thorough research.

---

## 1. Quick Scan (5 minutes)
Use when: You need a fast overview of any topic

\`\`\`
I need a quick research brief on [TOPIC].

Give me:
- What it is (2-3 sentences)
- Why it matters right now
- 3 key things everyone should know
- 1 common misconception
- Best single resource to learn more

Keep it under 300 words. No fluff.
\`\`\`

---

## 2. Deep Dive (15 minutes)
Use when: You need comprehensive understanding

\`\`\`
I need a deep research brief on [TOPIC].

Cover:
1. OVERVIEW: What is this and why does it exist?
2. HISTORY: Key milestones and how we got here
3. CURRENT STATE: What's happening now?
4. KEY PLAYERS: Who are the main people/companies involved?
5. PROS & CONS: Balanced view of benefits and drawbacks
6. FUTURE: Where is this heading?
7. SOURCES: 5 credible sources for further reading

Be thorough but clear. Use specific examples and data where possible.
\`\`\`

---

## 3. Competitive Analysis
Use when: Evaluating options or competitors

\`\`\`
Compare [OPTION A] vs [OPTION B] vs [OPTION C].

For each, cover:
- Core offering / what it does
- Target audience
- Pricing model
- Key strengths
- Key weaknesses
- Best for (specific use case)

Then give me:
- Side-by-side comparison table
- Your recommendation based on [MY SITUATION/CRITERIA]
\`\`\`

---

## 4. Decision Brief
Use when: You need to make an informed decision

\`\`\`
I'm deciding whether to [DECISION].

Context: [YOUR SITUATION]

Give me:
1. DECISION SUMMARY: Restate the decision clearly
2. KEY FACTORS: What matters most in this decision?
3. ARGUMENTS FOR: Strongest reasons to do it
4. ARGUMENTS AGAINST: Strongest reasons not to
5. RISKS: What could go wrong?
6. MITIGATION: How to reduce those risks
7. RECOMMENDATION: What would you do and why?

Be direct. I want your actual opinion, not just "it depends."
\`\`\`

---

## Tips for Best Results

1. **Be specific** - "AI in healthcare diagnostics" beats "AI"
2. **Add context** - Tell the AI your background and why you're researching
3. **Iterate** - Ask follow-up questions on anything unclear
4. **Verify** - Cross-check important facts, especially dates and numbers

---

Want more? Check out kaigritun.com for advanced research systems and productivity tools.

Questions? Reply to this email: kai@kaigritun.com
`;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Send email via JMAP (Fastmail)
    const jmapToken = process.env.JMAP_TOKEN;
    const accountId = process.env.JMAP_ACCOUNT_ID;
    const identityId = process.env.JMAP_IDENTITY_ID;

    if (!jmapToken || !accountId || !identityId) {
      console.error("Missing JMAP credentials");
      // Still return success to user, log for manual follow-up
      console.log("NEW SUBSCRIBER:", email);
      return NextResponse.json({ success: true });
    }

    // Create and send email via JMAP
    const jmapRequest = {
      using: ["urn:ietf:params:jmap:core", "urn:ietf:params:jmap:mail", "urn:ietf:params:jmap:submission"],
      methodCalls: [
        [
          "Email/set",
          {
            accountId,
            create: {
              draft: {
                mailboxIds: { INBOX: true },
                from: [{ email: "kai@kaigritun.com", name: "Kai Gritun" }],
                to: [{ email }],
                subject: "Your Free AI Research Prompts",
                bodyValues: {
                  body: { value: PROMPTS_CONTENT, charset: "utf-8" },
                },
                textBody: [{ partId: "body", type: "text/plain" }],
              },
            },
          },
          "0",
        ],
        [
          "EmailSubmission/set",
          {
            accountId,
            create: {
              submission: {
                emailId: "#draft",
                identityId,
              },
            },
          },
          "1",
        ],
      ],
    };

    const response = await fetch("https://api.fastmail.com/jmap/api/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jmapToken}`,
      },
      body: JSON.stringify(jmapRequest),
    });

    if (!response.ok) {
      console.error("JMAP error:", await response.text());
      // Still return success, will follow up manually
      console.log("NEW SUBSCRIBER (email failed):", email);
      return NextResponse.json({ success: true });
    }

    // Also notify myself
    const notifyRequest = {
      using: ["urn:ietf:params:jmap:core", "urn:ietf:params:jmap:mail", "urn:ietf:params:jmap:submission"],
      methodCalls: [
        [
          "Email/set",
          {
            accountId,
            create: {
              draft: {
                mailboxIds: { INBOX: true },
                from: [{ email: "kai@kaigritun.com", name: "Kai Gritun" }],
                to: [{ email: "kai@kaigritun.com" }],
                subject: `New subscriber: ${email}`,
                bodyValues: {
                  body: { value: `New email list subscriber: ${email}\n\nTime: ${new Date().toISOString()}`, charset: "utf-8" },
                },
                textBody: [{ partId: "body", type: "text/plain" }],
              },
            },
          },
          "0",
        ],
        [
          "EmailSubmission/set",
          {
            accountId,
            create: {
              submission: {
                emailId: "#draft",
                identityId,
              },
            },
          },
          "1",
        ],
      ],
    };

    await fetch("https://api.fastmail.com/jmap/api/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jmapToken}`,
      },
      body: JSON.stringify(notifyRequest),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
