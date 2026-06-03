import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "salon_session";

type TokenPayload = {
  id?: string;
  role?: string;
};

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

async function getUserFromRequest(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const secret = getSecret();
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    const data = payload as TokenPayload;
    if (!data.id || !data.role) return null;
    return { id: data.id, role: data.role };
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
