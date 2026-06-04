import { cookies } from "next/headers";
import { verifyFirebaseIdToken } from "@/lib/firebase/auth-server";
import { findUserById } from "@/lib/firestore";
import type { Role } from "@/lib/types/database";

export const SESSION_COOKIE = "salon_session";

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  role: Role;
};

export async function verifySessionToken(
  token: string,
): Promise<SessionUser | null> {
  try {
    const decoded = await verifyFirebaseIdToken(token);
    const profile = await findUserById(decoded.uid);
    if (!profile) return null;
    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, idToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export function isAdminRole(role: Role) {
  return role === "ADMIN" || role === "STAFF";
}
