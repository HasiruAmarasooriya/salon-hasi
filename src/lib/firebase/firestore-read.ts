import { isFirebaseAdminConfigured } from "@/lib/firebase/admin";

function isCredentialError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("Could not load the default credentials") ||
    message.includes("Firebase Admin is not configured") ||
    message.includes("ENOENT") ||
    message.includes("credential")
  );
}

/** Run a Firestore read; use fallback when Admin credentials are missing (dev / static data). */
export async function firestoreReadOrFallback<T>(
  read: () => Promise<T>,
  fallback: T,
): Promise<T> {
  if (!isFirebaseAdminConfigured()) {
    return fallback;
  }
  try {
    return await read();
  } catch (error) {
    if (isCredentialError(error)) {
      console.warn(
        "[Firestore] Skipping database read — configure FIREBASE_SERVICE_ACCOUNT_JSON in .env",
      );
      return fallback;
    }
    throw error;
  }
}
