/**
 * Fetches Firebase Web SDK config via Management API and writes NEXT_PUBLIC_FIREBASE_*.
 *
 * Local:  npm run setup:firebase-web
 * Vercel: set FIREBASE_SERVICE_ACCOUNT_JSON in project env; build runs this automatically
 * Print:  npm run setup:firebase-web:vercel  (copy values into Vercel dashboard)
 */
const fs = require("fs");
const path = require("path");

const projectRoot = path.join(__dirname, "..");
const serviceAccountPath = path.join(projectRoot, "firebase-service-account.json");
const envPath = path.join(projectRoot, ".env");
const envExamplePath = path.join(projectRoot, ".env.example");

const PLACEHOLDER_PATTERN = /your-(api-key|sender-id|app-id|measurement-id)/i;
const PLACEHOLDER_API_KEY = /^your-api-key$/i;

const args = new Set(process.argv.slice(2));
const printOnly = args.has("--print");
const ifNeeded = args.has("--if-needed");

require("dotenv").config();

function loadServiceAccount() {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (json && !json.startsWith("#")) {
    return JSON.parse(json);
  }

  if (fs.existsSync(serviceAccountPath)) {
    return JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
  }

  if (printOnly || ifNeeded) {
    return null;
  }

  console.error("\n✗ Missing Firebase service account credentials\n");
  console.error("  Local: save firebase-service-account.json and run npm run setup:firebase");
  console.error("  Vercel: add FIREBASE_SERVICE_ACCOUNT_JSON in Project Settings → Environment Variables\n");
  process.exit(1);
}

function hasValidWebConfig() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim();
  return !!apiKey && !PLACEHOLDER_API_KEY.test(apiKey);
}

function resolveEnvTargetPath() {
  if (process.env.VERCEL || process.env.CI) {
    return path.join(projectRoot, ".env.production.local");
  }
  return envPath;
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

function configToEnvEntries(cfg) {
  const entries = {
    NEXT_PUBLIC_FIREBASE_API_KEY: cfg.apiKey,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: cfg.authDomain,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: cfg.projectId,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: cfg.storageBucket,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: cfg.messagingSenderId,
    NEXT_PUBLIC_FIREBASE_APP_ID: cfg.appId,
  };
  if (cfg.measurementId) {
    entries.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = cfg.measurementId;
  }
  return entries;
}

function upsertEnvFile(targetPath, entries) {
  let env = fs.existsSync(targetPath)
    ? fs.readFileSync(targetPath, "utf8")
    : fs.existsSync(envExamplePath)
      ? fs.readFileSync(envExamplePath, "utf8")
      : "";

  for (const [key, value] of Object.entries(entries)) {
    if (!value) continue;
    const line = `${key}="${String(value).replace(/"/g, "")}"`;
    const re = new RegExp(`^${key}=.*$`, "m");
    env = re.test(env) ? env.replace(re, line) : `${env.trimEnd()}\n${line}\n`;
  }

  if (
    !env.includes("GOOGLE_APPLICATION_CREDENTIALS=") &&
    !process.env.VERCEL &&
    fs.existsSync(serviceAccountPath)
  ) {
    env = `${env.trimEnd()}\nGOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json\n`;
  }

  fs.writeFileSync(targetPath, env.endsWith("\n") ? env : `${env}\n`);
}

function printEnvEntries(entries) {
  console.log("\nCopy these into Vercel → Project Settings → Environment Variables:\n");
  for (const [key, value] of Object.entries(entries)) {
    console.log(`${key}=${value}`);
  }
  console.log("\nAlso add (Production, Preview, Development):");
  console.log("FIREBASE_SERVICE_ACCOUNT_JSON=<paste full service account JSON on one line>\n");
}

async function main() {
  if (ifNeeded && hasValidWebConfig()) {
    console.log("Firebase web config already set — skipping sync.");
    return;
  }

  const credentials = loadServiceAccount();
  if (!credentials) {
    if (ifNeeded) {
      console.warn(
        "Warning: NEXT_PUBLIC_FIREBASE_* not set and FIREBASE_SERVICE_ACCOUNT_JSON missing. " +
          "Add env vars in Vercel or run npm run setup:firebase-web locally.",
      );
      return;
    }
    process.exit(1);
  }

  const projectId = credentials.project_id;
  if (!projectId) {
    console.error("✗ Service account JSON is missing project_id");
    process.exit(1);
  }

  console.log(`Fetching web SDK config for project: ${projectId}…`);
  const cfg = await fetchWebSdkConfig(projectId, credentials);
  const entries = configToEnvEntries(cfg);

  if (printOnly) {
    printEnvEntries(entries);
    return;
  }

  const targetPath = resolveEnvTargetPath();
  upsertEnvFile(targetPath, entries);

  for (const [key, value] of Object.entries(entries)) {
    process.env[key] = String(value);
  }

  const hadPlaceholders =
    fs.existsSync(envPath) && PLACEHOLDER_PATTERN.test(fs.readFileSync(envPath, "utf8"));

  console.log(`✓ Wrote NEXT_PUBLIC_FIREBASE_* to ${path.basename(targetPath)}`);
  if (hadPlaceholders) {
    console.log("  (replaced placeholder values)");
  }
  if (process.env.VERCEL) {
    console.log("  Vercel build will embed these values for login and the client SDK.");
  } else {
    console.log("\n  Restart the dev server: npm run dev");
    console.log("  Then sign in at http://localhost:3000/admin/login\n");
  }
}

main().catch((err) => {
  console.error("\n✗", err.message || err);
  if (process.env.VERCEL) {
    console.error(
      "\n  Vercel fix: Project Settings → Environment Variables → add FIREBASE_SERVICE_ACCOUNT_JSON",
    );
    console.error("  Or paste NEXT_PUBLIC_FIREBASE_* from Firebase Console → Your apps → Web.\n");
  } else {
    console.error(
      "\n  Manual fix: Firebase Console → Project settings → Your apps → Web app",
    );
    console.error("  Or run: npm run setup:firebase-web:vercel\n");
  }
  process.exit(ifNeeded ? 0 : 1);
});
