import { getFirebaseApiKey } from "@/lib/firebase/config";
import { getAdminAuth } from "@/lib/firebase/admin";

type FirebaseAuthResponse = {
  idToken: string;
  localId: string;
  email: string;
  displayName?: string;
  error?: { message: string };
};

async function firebaseAuthRequest(
  endpoint: string,
  body: Record<string, unknown>,
): Promise<FirebaseAuthResponse> {
  const apiKey = getFirebaseApiKey();
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/${endpoint}?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  const data = (await res.json()) as FirebaseAuthResponse & {
    error?: { message: string };
  };

  if (!res.ok || data.error) {
    const msg = data.error?.message ?? "Authentication failed";
    throw new Error(msg);
  }

  return data;
}

export async function signInWithEmailPassword(email: string, password: string) {
  return firebaseAuthRequest("accounts:signInWithPassword", {
    email,
    password,
    returnSecureToken: true,
  });
}

export async function signUpWithEmailPassword(
  email: string,
  password: string,
  displayName?: string,
) {
  return firebaseAuthRequest("accounts:signUp", {
    email,
    password,
    returnSecureToken: true,
    displayName,
  });
}

export async function verifyFirebaseIdToken(idToken: string) {
  const decoded = await getAdminAuth().verifyIdToken(idToken);
  return decoded;
}
