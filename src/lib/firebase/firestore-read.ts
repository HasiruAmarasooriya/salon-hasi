import { isFirebaseAdminConfigured } from "@/lib/firebase/admin";

/** Run a Firestore read; use fallback when Admin is unavailable or any read fails. */
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
    const message = error instanceof Error ? error.message : String(error);
    console.warn("[Firestore] Using fallback data:", message);
    return fallback;
  }
}
