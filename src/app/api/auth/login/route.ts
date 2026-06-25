import { NextResponse } from "next/server";
import { signInWithEmailPassword } from "@/lib/firebase/auth-server";
import { mapAuthRouteError } from "@/lib/firebase/auth-errors";
import { isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { createUserProfile, findUserById } from "@/lib/firestore";
import { isAdminRole, setSessionCookie } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json(
      {
        error: mapAuthRouteError(
          new Error("Firebase Admin is not configured"),
          "Login failed. Please try again.",
        ),
      },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;
    const mode = body.mode === "admin" ? "admin" : "user";
    const normalizedEmail = email.toLowerCase().trim();

    const auth = await signInWithEmailPassword(normalizedEmail, password);
    let user = await findUserById(auth.localId);

    if (!user) {
      if (mode === "admin") {
        return NextResponse.json(
          { error: "Admin account not found. Run npm run db:seed on the server." },
          { status: 401 },
        );
      }

      user = await createUserProfile(auth.localId, {
        email: normalizedEmail,
        name: auth.displayName?.trim() || null,
        phone: null,
        role: "CUSTOMER",
        image: null,
      });
    }

    if (mode === "admin" && !isAdminRole(user.role)) {
      return NextResponse.json(
        { error: "You do not have admin access" },
        { status: 403 },
      );
    }

    await setSessionCookie(auth.idToken);

    const redirect =
      mode === "admin" ? "/admin" : isAdminRole(user.role) ? "/admin" : "/account";

    return NextResponse.json({
      success: true,
      redirect,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: mapAuthRouteError(error, "Login failed. Please try again.") },
      { status: 401 },
    );
  }
}
