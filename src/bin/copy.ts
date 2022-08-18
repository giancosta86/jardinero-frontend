#!/usr/bin/env node

import { join } from "node:path";
import { argv } from "node:process";
import { copySync } from "fs-extra";

const targetDirectoryPath = argv[2];

if (!targetDirectoryPath) {
  console.error("Missing CLI argument: <target directory>");
  process.exit(1);
}

const sourceDirectoryPath = join(__dirname, "..", "web");

console.log("Copying frontend files");
console.log(`    from --> ${sourceDirectoryPath}`);
console.log(`    to --> ${targetDirectoryPath}`);

copySync(sourceDirectoryPath, targetDirectoryPath);
