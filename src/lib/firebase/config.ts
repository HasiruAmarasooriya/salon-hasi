export function getFirebaseClientConfig() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

  if (!apiKey || !authDomain || !projectId || !appId) {
    throw new Error(
      "Missing Firebase env vars. Copy .env.example and set NEXT_PUBLIC_FIREBASE_* values.",
    );
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId,
  };
}

const PLACEHOLDER_API_KEY = /^your-api-key$/i;

function firebaseWebSetupHint(): string {
  if (process.env.VERCEL) {
    return (
      "Firebase web config is missing on Vercel. Add FIREBASE_SERVICE_ACCOUNT_JSON in " +
      "Vercel → Project Settings → Environment Variables (then redeploy), or add all " +
      "NEXT_PUBLIC_FIREBASE_* values manually. Local: npm run setup:firebase-web"
    );
  }
  return "NEXT_PUBLIC_FIREBASE_API_KEY is not set. Run: npm run setup:firebase-web";
}

export function getFirebaseApiKey() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(firebaseWebSetupHint());
  }
  if (PLACEHOLDER_API_KEY.test(apiKey)) {
    throw new Error(
      process.env.VERCEL
        ? firebaseWebSetupHint()
        : "NEXT_PUBLIC_FIREBASE_API_KEY is still a placeholder. Run: npm run setup:firebase-web",
    );
  }
  return apiKey;
}
