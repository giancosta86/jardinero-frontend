#!/usr/bin/env node

const { join } = require("path");
const { copySync } = require("fs-extra");

const targetDirectoryPath = process.argv[2];

if (!targetDirectoryPath) {
  console.error("Missing CLI argument: <target directory>");
  process.exit(1);
}

const sourceDirectoryPath = join(__dirname, "..", "dist", "web");

console.log("Copying frontend files");
console.log(`    from --> ${sourceDirectoryPath}`);
console.log(`    to --> ${targetDirectoryPath}`);

copySync(sourceDirectoryPath, targetDirectoryPath);
