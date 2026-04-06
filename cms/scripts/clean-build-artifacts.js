const fs = require("fs");
const path = require("path");

const projectRoot = process.cwd();
const targets = ["dist", "build", ".cache", ".strapi"];

for (const target of targets) {
  fs.rmSync(path.join(projectRoot, target), { recursive: true, force: true });
}
