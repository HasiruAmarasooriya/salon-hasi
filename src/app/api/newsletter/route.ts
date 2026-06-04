import { NextResponse } from "next/server";
import { getSiteSetting, upsertSiteSetting } from "@/lib/firestore";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
});

const KEY = "newsletter_emails";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 },
      );
    }

    const email = parsed.data.email.toLowerCase().trim();
    const existing = await getSiteSetting(KEY);
    const list: string[] = existing ? JSON.parse(existing) : [];

    if (!list.includes(email)) {
      list.push(email);
      await upsertSiteSetting(KEY, JSON.stringify(list));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json(
      { error: "Subscription failed" },
      { status: 500 },
    );
  }
}
