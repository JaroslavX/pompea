// server.js — Phusion Passenger entry point for cPanel Node.js Selector
// This file must be placed at the APPLICATION ROOT on the server.
// In cPanel > Node.js Selector, set "Application startup file" to: server.js

'use strict';

// CRITICAL: Force working directory to this file's location.
// Phusion Passenger does not always set cwd to the app root, which causes
// Next.js standalone server to fail finding .next/static and public assets.
process.chdir(__dirname);
const path = require('path');

// Set production mode
process.env.NODE_ENV = 'production';

// The Next.js standalone build creates its own server.js inside .next/standalone/
// When we deploy, we copy .next/standalone/* to the app root, so the standalone
// server.js IS this directory. Just boot it directly.
// The CloudLinux Node.js selector keeps deleting ./node_modules from the app root,
// so also resolve packages from a folder outside the app (~/pompeya-modules/node_modules).
const fs = require('fs');
const os = require('os');
const extraModules = process.env.EXTRA_NODE_MODULES || path.join(os.homedir(), 'pompeya-modules', 'node_modules');
if (fs.existsSync(extraModules)) {
  process.env.NODE_PATH = [extraModules, process.env.NODE_PATH].filter(Boolean).join(path.delimiter);
  require('module').Module._initPaths();

  // Turbopack links externals as .next/node_modules/<pkg>-<hash> -> ../../node_modules/<pkg>.
  // Re-point any dangling link at the external folder.
  const linkDir = path.join(__dirname, '.next', 'node_modules');
  if (fs.existsSync(linkDir)) {
    for (const entry of fs.readdirSync(linkDir)) {
      const link = path.join(linkDir, entry);
      const pkg = entry.replace(/-[0-9a-f]{16}$/, '');
      if (!fs.existsSync(link) && fs.existsSync(path.join(extraModules, pkg))) {
        try {
          fs.rmSync(link, { force: true });
          fs.symlinkSync(path.join(extraModules, pkg), link);
        } catch (err) {
          console.error('Could not relink', entry, err);
        }
      }
    }
  }
}

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT, 10) || 3000;
const dir = __dirname;

const app = next({
  dev: false,
  hostname,
  port,
  dir,
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
