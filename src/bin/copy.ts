#!/usr/bin/env node

import { join } from "node:path";
import process, { argv } from "node:process";
import { copySync } from "fs-extra";

function main(): number {
  const targetDirectoryPath = argv[2];

  if (!targetDirectoryPath) {
    console.error("Missing CLI argument: <target directory>");
    return 1;
  }

  const sourceDirectoryPath = join(__dirname, "..", "web");

  console.info("Copying frontend files");
  console.info(`    from --> ${sourceDirectoryPath}`);
  console.info(`    to --> ${targetDirectoryPath}`);

  copySync(sourceDirectoryPath, targetDirectoryPath);
  return 0;
}

process.exitCode = main();
