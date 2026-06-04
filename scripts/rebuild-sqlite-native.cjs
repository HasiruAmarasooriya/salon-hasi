/**
 * Ensures better-sqlite3 native bindings match the Node.js binary running this script.
 * Re-runs when NODE_MODULE_VERSION changes (e.g. Node 22 install, Node 24 runtime).
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const projectRoot = path.join(__dirname, "..");
const nodeAbi = process.versions.modules;

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
].filter((dir) => fs.existsSync(path.join(dir, "package.json")));

function abiStampPath(dir) {
  return path.join(dir, ".installed-node-abi");
}

function abiMatches(dir) {
  const stamp = abiStampPath(dir);
  if (!fs.existsSync(stamp)) return false;
  return fs.readFileSync(stamp, "utf8").trim() === nodeAbi;
}

function writeAbiStamp(dir) {
  fs.writeFileSync(abiStampPath(dir), nodeAbi);
}

function canLoad(dir) {
  const entry = path.join(dir, "lib", "database.js");
  if (!fs.existsSync(entry)) return false;
  try {
    const resolved = require.resolve(entry, { paths: [dir] });
    delete require.cache[resolved];
    require(resolved);
    return true;
  } catch {
    return false;
  }
}

if (packages.length === 0) {
  console.warn("rebuild-sqlite-native: no better-sqlite3 packages found");
  process.exit(0);
}

const needsRebuild = packages.filter(
  (dir) => !abiMatches(dir) || !canLoad(dir)
);

if (needsRebuild.length === 0) {
  console.log(
    `rebuild-sqlite-native: bindings OK for Node ${process.version} (ABI ${nodeAbi})`
  );
  process.exit(0);
}

console.log(
  `Rebuilding better-sqlite3 for Node ${process.version} (ABI ${nodeAbi})`
);

for (const dir of needsRebuild) {
  const release = path.join(dir, "build", "Release", "better_sqlite3.node");
  if (fs.existsSync(release)) {
    fs.rmSync(release, { force: true });
  }
  if (fs.existsSync(abiStampPath(dir))) {
    fs.rmSync(abiStampPath(dir), { force: true });
  }
}

execSync("npm rebuild better-sqlite3", {
  cwd: projectRoot,
  stdio: "inherit",
});

for (const dir of packages) {
  if (!canLoad(dir)) {
    console.error(
      `rebuild-sqlite-native: failed to load better-sqlite3 in ${path.relative(projectRoot, dir)}`
    );
    process.exit(1);
  }
  writeAbiStamp(dir);
}

console.log(
  `rebuild-sqlite-native: done for Node ${process.version} (ABI ${nodeAbi})`
);
