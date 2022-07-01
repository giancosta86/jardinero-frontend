#!/usr/bin/env node

const { createServer } = require("http");
const { join } = require("path");
const serveStatic = require("serve-static");
const finalhandler = require("finalhandler");

const staticRootPath = join(__dirname, "..", "dist", "web");

console.log("Serving from directory:", staticRootPath);

const handler = serveStatic(staticRootPath, { index: "index.html" });

const server = createServer((req, res) => {
  handler(req, res, finalhandler(req, res));
});

const portArg = process.argv[2];

const port = Number(portArg) || 8080;

server.listen(port, () => {
  console.log(
    `Frontend static server listening on http://localhost:${port}...`
  );
});
