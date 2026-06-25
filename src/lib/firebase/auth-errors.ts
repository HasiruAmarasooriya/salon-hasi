import { getFirebaseSetupHint } from "@/lib/firebase/admin";

export function mapAuthRouteError(error: unknown, fallback: string): string {
  if (!(error instanceof Error)) return fallback;

  const msg = error.message;

  if (msg.includes("Firebase Admin is not configured")) {
    return `Server Firebase credentials missing. ${getFirebaseSetupHint()}`;
  }
  if (
    msg.includes("Firebase web config") ||
    msg.includes("API key") ||
    msg.includes("placeholder") ||
    msg.includes("NEXT_PUBLIC_FIREBASE")
  ) {
    return msg;
  }
  if (msg.includes("EMAIL_EXISTS")) {
    return "An account with this email already exists";
  }
  if (msg.includes("EMAIL_NOT_FOUND") || msg.includes("INVALID_PASSWORD") || msg.includes("INVALID_LOGIN_CREDENTIALS")) {
    return "Invalid email or password";
  }
  if (msg.includes("OPERATION_NOT_ALLOWED")) {
    return "Email/password sign-in is disabled in Firebase Console. Enable it under Authentication → Sign-in method.";
  }
  if (msg.includes("WEAK_PASSWORD")) {
    return "Password is too weak. Use at least 8 characters with one uppercase letter and one number.";
  }
  if (msg.includes("TOO_MANY_ATTEMPTS_TRY_LATER")) {
    return "Too many attempts. Please wait a few minutes and try again.";
  }

  return fallback;
}
