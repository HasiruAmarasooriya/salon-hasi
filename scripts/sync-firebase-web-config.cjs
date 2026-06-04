/**
 * Fetches the Firebase Web app SDK config via Management API
 * (uses firebase-service-account.json) and updates .env NEXT_PUBLIC_FIREBASE_*.
 *
 * Run: npm run setup:firebase-web
 */
const fs = require("fs");
const path = require("path");

const projectRoot = path.join(__dirname, "..");
const serviceAccountPath = path.join(projectRoot, "firebase-service-account.json");
const envPath = path.join(projectRoot, ".env");
const envExamplePath = path.join(projectRoot, ".env.example");

const PLACEHOLDER_PATTERN = /your-(api-key|sender-id|app-id|measurement-id)/i;

function loadServiceAccount() {
  if (!fs.existsSync(serviceAccountPath)) {
    console.error("\n✗ Missing firebase-service-account.json\n");
    console.error("  Run: npm run setup:firebase\n");
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
}

async function fetchWebSdkConfig(projectId, credentials) {
  const { GoogleAuth } = await import("google-auth-library");
  const auth = new GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/firebase.readonly"],
  });
  const client = await auth.getClient();
  const token = (await client.getAccessToken()).token;
  if (!token) throw new Error("Could not obtain access token from service account");

  const listRes = await fetch(
    `https://firebase.googleapis.com/v1beta1/projects/${projectId}/webApps`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const list = await listRes.json();
  if (!listRes.ok) {
    throw new Error(
      `Failed to list web apps (${listRes.status}): ${list.error?.message ?? JSON.stringify(list)}`,
    );
  }
  if (!list.apps?.length) {
    throw new Error(
      "No Firebase web app found. Create one in Firebase Console → Project settings → Your apps → Web.",
    );
  }

  const appId = list.apps[0].appId;
  const cfgRes = await fetch(
    `https://firebase.googleapis.com/v1beta1/projects/${projectId}/webApps/${appId}/config`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const cfg = await cfgRes.json();
  if (!cfgRes.ok || !cfg.apiKey) {
    throw new Error(
      `Failed to load web app config (${cfgRes.status}): ${cfg.error?.message ?? JSON.stringify(cfg)}`,
    );
  }
  return cfg;
}

function upsertEnv(vars) {
  let env = fs.existsSync(envPath)
    ? fs.readFileSync(envPath, "utf8")
    : fs.existsSync(envExamplePath)
      ? fs.readFileSync(envExamplePath, "utf8")
      : "";

  const entries = {
    NEXT_PUBLIC_FIREBASE_API_KEY: vars.apiKey,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: vars.authDomain,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: vars.projectId,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: vars.storageBucket,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: vars.messagingSenderId,
    NEXT_PUBLIC_FIREBASE_APP_ID: vars.appId,
  };
  if (vars.measurementId) {
    entries.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = vars.measurementId;
  }

  for (const [key, value] of Object.entries(entries)) {
    if (!value) continue;
    const line = `${key}="${String(value).replace(/"/g, "")}"`;
    const re = new RegExp(`^${key}=.*$`, "m");
    env = re.test(env) ? env.replace(re, line) : `${env.trimEnd()}\n${line}\n`;
  }

  if (!env.includes("GOOGLE_APPLICATION_CREDENTIALS=")) {
    env = `${env.trimEnd()}\nGOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json\n`;
  }

  fs.writeFileSync(envPath, env.endsWith("\n") ? env : `${env}\n`);
}

async function main() {
  const credentials = loadServiceAccount();
  const projectId = credentials.project_id;
  if (!projectId) {
    console.error("✗ Service account JSON is missing project_id");
    process.exit(1);
  }

  console.log(`Fetching web SDK config for project: ${projectId}…`);
  const cfg = await fetchWebSdkConfig(projectId, credentials);
  upsertEnv(cfg);

  const hadPlaceholders =
    fs.existsSync(envPath) &&
    PLACEHOLDER_PATTERN.test(fs.readFileSync(envPath, "utf8"));

  console.log("✓ Updated .env with NEXT_PUBLIC_FIREBASE_* from Firebase");
  if (hadPlaceholders) {
    console.log("  (replaced placeholder values)");
  }
  console.log("\n  Restart the dev server: npm run dev");
  console.log("  Then sign in at http://localhost:3000/admin/login\n");
}

main().catch((err) => {
  console.error("\n✗", err.message || err);
  console.error(
    "\n  Manual fix: Firebase Console → Project settings → Your apps → Web app",
  );
  console.error("  Copy config into .env (NEXT_PUBLIC_FIREBASE_*).\n");
  process.exit(1);
});
