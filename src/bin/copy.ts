#!/usr/bin/env node

import { join } from "path";
import { copySync } from "fs-extra";
import { argv } from "process";

const targetDirectoryPath = argv[2];

if (!targetDirectoryPath) {
  console.error("Missing CLI argument: <target directory>");
  process.exit(1);
}

const sourceDirectoryPath = join(__dirname, "..", "dist", "web");

console.log("Copying frontend files");
console.log(`    from --> ${sourceDirectoryPath}`);
console.log(`    to --> ${targetDirectoryPath}`);

copySync(sourceDirectoryPath, targetDirectoryPath);
