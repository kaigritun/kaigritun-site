import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "subscribers.json");

interface Subscriber {
  email: string;
  site: string;
  subscribedAt: string;
}

async function getSubscribers(): Promise<Subscriber[]> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveSubscribers(subscribers: Subscriber[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(subscribers, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const { email, site } = await request.json();

    // Validate email
    if (!email || !email.includes("@") || !email.includes(".")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Validate site
    const validSites = ["mcp", "getthejobai", "gigwithai"];
    if (!site || !validSites.includes(site)) {
      return NextResponse.json({ error: "Invalid site" }, { status: 400 });
    }

    // Get existing subscribers
    const subscribers = await getSubscribers();

    // Check for duplicate (same email + site)
    const exists = subscribers.some(
      (sub) => sub.email.toLowerCase() === email.toLowerCase() && sub.site === site
    );

    if (exists) {
      return NextResponse.json({ 
        success: true, 
        message: "You're already subscribed!" 
      });
    }

    // Add new subscriber
    const newSubscriber: Subscriber = {
      email: email.toLowerCase().trim(),
      site,
      subscribedAt: new Date().toISOString(),
    };

    subscribers.push(newSubscriber);
    await saveSubscribers(subscribers);

    // Log for monitoring
    console.log(`[EMAIL SIGNUP] ${site}: ${email}`);

    return NextResponse.json({ 
      success: true, 
      message: "You're in! We'll be in touch." 
    });
  } catch (error) {
    console.error("Email signup error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
