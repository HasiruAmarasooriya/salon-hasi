import { NextResponse } from "next/server";
import { signUpWithEmailPassword } from "@/lib/firebase/auth-server";
import { mapAuthRouteError } from "@/lib/firebase/auth-errors";
import { isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import {
  createUserProfile,
  findUserByEmail,
} from "@/lib/firestore";
import { setSessionCookie } from "@/lib/auth/session";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json(
      {
        error: mapAuthRouteError(
          new Error("Firebase Admin is not configured"),
          "Registration failed. Please try again.",
        ),
      },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const { name, email, phone, password } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await findUserByEmail(normalizedEmail);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    const auth = await signUpWithEmailPassword(
      normalizedEmail,
      password,
      name.trim(),
    );

    const user = await createUserProfile(auth.localId, {
      email: normalizedEmail,
      name: name.trim(),
      phone: phone?.trim() || null,
      role: "CUSTOMER",
      image: null,
    });

    await setSessionCookie(auth.idToken);

    return NextResponse.json({
      success: true,
      redirect: "/account",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: mapAuthRouteError(error, "Registration failed. Please try again.") },
      { status: 500 },
    );
  }
}
