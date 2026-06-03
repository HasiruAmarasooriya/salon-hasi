import { NextResponse } from "next/server";
import { getSession, isAdminRole } from "@/lib/auth/session";

export async function requireAdminApi() {
  const session = await getSession();
  if (!session || !isAdminRole(session.role)) {
    return {
      session: null,
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
  return { session, error: null };
}
