import { NextResponse } from "next/server";
import { signInWithEmailPassword } from "@/lib/firebase/auth-server";
import { findUserById } from "@/lib/firestore";
import { isAdminRole, setSessionCookie } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
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
    const user = await findUserById(auth.localId);

    if (!user) {
      return NextResponse.json(
        { error: "Account profile not found. Run npm run db:seed." },
        { status: 401 },
      );
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
    let message = "Login failed. Please try again.";
    if (error instanceof Error) {
      if (error.message.includes("INVALID")) {
        message = "Invalid email or password";
      } else if (
        error.message.includes("API key") ||
        error.message.includes("placeholder") ||
        error.message.includes("NEXT_PUBLIC_FIREBASE_API_KEY")
      ) {
        message =
          "Firebase web config is missing or invalid. Run: npm run setup:firebase-web, then restart npm run dev.";
      }
    }
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
