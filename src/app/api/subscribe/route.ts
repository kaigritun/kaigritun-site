import { NextRequest, NextResponse } from "next/server";

// For now, just log subscribers - we'll send manually until email is restored
// Subscribers will show up in Vercel function logs

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Log subscriber (visible in Vercel logs)
    console.log("=== NEW SUBSCRIBER ===");
    console.log("Email:", email);
    console.log("Time:", new Date().toISOString());
    console.log("======================");

    // Also try to send via webhook if available
    const webhookUrl = process.env.SUBSCRIBER_WEBHOOK;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, timestamp: new Date().toISOString() }),
        });
      } catch (e) {
        console.error("Webhook failed:", e);
      }
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
