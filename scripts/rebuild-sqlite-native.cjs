/**
 * Rebuilds better-sqlite3 native bindings for the Node.js binary running this script.
 * Required after Node upgrades; Prisma's adapter bundles its own copy.
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const projectRoot = path.join(__dirname, "..");
const nodeGyp = path.join(
  path.dirname(process.execPath),
  "node_modules",
  "npm",
  "node_modules",
  "node-gyp",
  "bin",
  "node-gyp.js"
);

const packages = [
  path.join(projectRoot, "node_modules", "better-sqlite3"),
  path.join(
    projectRoot,
    "node_modules",
    "@prisma",
    "adapter-better-sqlite3",
    "node_modules",
    "better-sqlite3"
  ),
].filter((dir) => fs.existsSync(path.join(dir, "binding.gyp")));

if (packages.length === 0) {
  console.warn("rebuild-sqlite-native: no better-sqlite3 packages found");
  process.exit(0);
}

if (!fs.existsSync(nodeGyp)) {
  console.error(
    "rebuild-sqlite-native: node-gyp not found. Run: npm rebuild better-sqlite3"
  );
  process.exit(1);
}

console.log(
  `Rebuilding better-sqlite3 for Node ${process.version} (${process.execPath})`
);

for (const dir of packages) {
  console.log(`  → ${path.relative(projectRoot, dir)}`);
  execSync(`"${process.execPath}" "${nodeGyp}" rebuild --release`, {
    cwd: dir,
    stdio: "inherit",
  });
}
