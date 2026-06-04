import { readFileSync } from "fs";
import { resolve } from "path";
import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

let app: App | undefined;

const DEFAULT_SERVICE_ACCOUNT_FILE = "firebase-service-account.json";

const SETUP_HINT =
  "Add FIREBASE_SERVICE_ACCOUNT_JSON to .env (paste the full JSON on one line), " +
  "or set GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json " +
  "(download from Firebase Console → Project settings → Service accounts → Generate new private key).";

function resolveServiceAccountPath(): string | undefined {
  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
  if (credPath) return resolve(process.cwd(), credPath);
  const defaultPath = resolve(process.cwd(), DEFAULT_SERVICE_ACCOUNT_FILE);
  try {
    readFileSync(defaultPath, "utf8");
    return defaultPath;
  } catch {
    return undefined;
  }
}

function readServiceAccountFile(absolute: string): Record<string, string> {
  try {
    return JSON.parse(readFileSync(absolute, "utf8")) as Record<string, string>;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      throw new Error(
        `Service account file not found:\n  ${absolute}\n\n` +
          "Download it from Firebase Console → Project settings → Service accounts → Generate new private key,\n" +
          "save as firebase-service-account.json in the project folder, then run: npm run setup:firebase\n" +
          "Or run: npm run setup:firebase (opens the console and searches Downloads).",
      );
    }
    throw error;
  }
}

export function isFirebaseAdminConfigured(): boolean {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (json && json !== "" && !json.startsWith("#")) return true;
  return !!resolveServiceAccountPath();
}

function loadServiceAccount(): Record<string, string> {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (json && !json.startsWith("#")) {
    return JSON.parse(json) as Record<string, string>;
  }

  const filePath = resolveServiceAccountPath();
  if (filePath) {
    return readServiceAccountFile(filePath);
  }

  throw new Error(`Firebase Admin is not configured. ${SETUP_HINT}`);
}

export function getAdminApp(): App {
  if (app) return app;
  if (getApps().length > 0) {
    app = getApps()[0]!;
    return app;
  }

  if (!isFirebaseAdminConfigured()) {
    throw new Error(`Firebase Admin is not configured. ${SETUP_HINT}`);
  }

  const serviceAccount = loadServiceAccount();
  const projectId =
    serviceAccount.project_id ??
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ??
    process.env.FIREBASE_PROJECT_ID;

  app = initializeApp({
    credential: cert(serviceAccount as Parameters<typeof cert>[0]),
    projectId,
  });
  return app;
}

export function getAdminFirestore(): Firestore {
  return getFirestore(getAdminApp());
}

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp());
}

export function getFirebaseSetupHint(): string {
  return SETUP_HINT;
}
