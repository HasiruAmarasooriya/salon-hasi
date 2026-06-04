/**
 * Helps place firebase-service-account.json in the project root.
 * Run: npm run setup:firebase
 */
const fs = require("fs");
const path = require("path");

const projectRoot = path.join(__dirname, "..");
const target = path.join(projectRoot, "firebase-service-account.json");

const CONSOLE_URL =
  "https://console.firebase.google.com/project/salon-hasi/settings/serviceaccounts/adminsdk";

function isServiceAccountJson(filePath) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return (
      data.type === "service_account" &&
      data.project_id &&
      data.private_key &&
      data.client_email
    );
  } catch {
    return false;
  }
}

function findInDir(dir) {
  if (!fs.existsSync(dir)) return null;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isFile() && e.name.endsWith(".json") && isServiceAccountJson(full)) {
      return full;
    }
  }
  for (const e of entries) {
    if (e.isFile() && /adminsdk|firebase.*service/i.test(e.name) && e.name.endsWith(".json")) {
      const full = path.join(dir, e.name);
      if (isServiceAccountJson(full)) return full;
    }
  }
  return null;
}

function searchCommonLocations() {
  const home = process.env.USERPROFILE || process.env.HOME || "";
  const dirs = [
    projectRoot,
    path.join(home, "Downloads"),
    path.join(home, "Desktop"),
    path.join(home, "Documents"),
  ];
  for (const dir of dirs) {
    const found = findInDir(dir);
    if (found && path.resolve(found) !== path.resolve(target)) return found;
  }
  return null;
}

const envPath = path.join(projectRoot, ".env");
const envExamplePath = path.join(projectRoot, ".env.example");
const credEnvLine = "GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json";

function ensureEnvCredentialsLine() {
  if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
    let example = fs.readFileSync(envExamplePath, "utf8");
    example = example.replace(
      /^# GOOGLE_APPLICATION_CREDENTIALS=.*$/m,
      credEnvLine,
    );
    if (!example.includes(credEnvLine)) {
      example += `\n${credEnvLine}\n`;
    }
    fs.writeFileSync(envPath, example, "utf8");
    console.log("✓ Created .env from .env.example (set GOOGLE_APPLICATION_CREDENTIALS).");
    console.log("  Fill in NEXT_PUBLIC_FIREBASE_* values from Firebase Console → Project settings → Your apps.");
    return;
  }
  if (!fs.existsSync(envPath)) return;
  let env = fs.readFileSync(envPath, "utf8");
  if (env.includes("GOOGLE_APPLICATION_CREDENTIALS=")) return;
  env = env.trimEnd() + `\n${credEnvLine}\n`;
  fs.writeFileSync(envPath, env, "utf8");
  console.log("✓ Added GOOGLE_APPLICATION_CREDENTIALS to .env");
}

function main() {
  if (fs.existsSync(target) && isServiceAccountJson(target)) {
    ensureEnvCredentialsLine();
    console.log("✓ firebase-service-account.json is already in place.");
    console.log("  Run: npm run setup:firebase-web  (if login says invalid API key)");
    console.log("  Run: npm run db:seed");
    return;
  }

  const discovered = searchCommonLocations();
  if (discovered) {
    fs.copyFileSync(discovered, target);
    ensureEnvCredentialsLine();
    console.log("✓ Copied service account key to:");
    console.log(" ", target);
    console.log("  From:", discovered);
    console.log("\n  Next: npm run db:seed");
    return;
  }

  console.error("\n✗ Missing: firebase-service-account.json\n");
  console.error("This file cannot be created automatically. Download it from Firebase:\n");
  console.error("  1. Open:", CONSOLE_URL);
  console.error("  2. Click: Generate new private key → Generate key");
  console.error("  3. Save the downloaded file HERE as:");
  console.error("     ", target);
  console.error("\n  4. Then run: npm run db:seed\n");

  if (process.platform === "win32") {
    try {
      const { execSync } = require("child_process");
      execSync(`start "" "${CONSOLE_URL}"`, { stdio: "ignore", shell: true });
      console.error("(Opened Firebase Console in your browser.)\n");
    } catch {
      /* ignore */
    }
  }

  process.exit(1);
}

main();
