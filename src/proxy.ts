import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyFirebaseIdToken } from "@/lib/firebase/auth-server";
import { findUserById } from "@/lib/firestore";

const SESSION_COOKIE = "salon_session";

async function getUserFromRequest(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const decoded = await verifyFirebaseIdToken(token);
    const profile = await findUserById(decoded.uid);
    if (!profile) return null;
    return { id: profile.id, role: profile.role };
  } catch {
    return null;
  }
}

function isAdminRole(role: string) {
  return role === "ADMIN" || role === "STAFF";
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const user = await getUserFromRequest(request);

  const isAdminLogin = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");
  const isAccountRoute = pathname.startsWith("/account");
  const isUserAuthRoute =
    pathname === "/login" || pathname === "/register";

  if (isAdminRoute && !isAdminLogin) {
    if (!user || !isAdminRole(user.role)) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isAdminLogin && user && isAdminRole(user.role)) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (isAccountRoute && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isUserAuthRoute && user) {
    const redirect = isAdminRole(user.role) ? "/admin" : "/account";
    return NextResponse.redirect(new URL(redirect, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/account", "/account/:path*", "/login", "/register"],
};
