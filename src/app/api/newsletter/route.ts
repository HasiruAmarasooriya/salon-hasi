import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
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
    const existing = await prisma.siteSetting.findUnique({ where: { key: KEY } });
    const list: string[] = existing ? JSON.parse(existing.value) : [];

    if (!list.includes(email)) {
      list.push(email);
      await prisma.siteSetting.upsert({
        where: { key: KEY },
        update: { value: JSON.stringify(list) },
        create: { key: KEY, value: JSON.stringify(list) },
      });
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
