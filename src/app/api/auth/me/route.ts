import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession, SESSION_COOKIE } from "@/lib/auth/session";

export async function GET() {
  const session = await getSession();
  if (session) {
    return NextResponse.json({ user: session });
  }

  const cookieStore = await cookies();
  if (cookieStore.get(SESSION_COOKIE)?.value) {
    cookieStore.delete(SESSION_COOKIE);
  }

  return NextResponse.json({ user: null });
}
