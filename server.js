// Passenger wrapper for Next.js standalone build
// 1. Load .env.local — standalone server doesn't auto-load env files at runtime
const fs = require('fs');
const path = require('path');
const envFile = path.join(__dirname, '.env.local');
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, 'utf8').split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) return;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) process.env[key] = val;
  });
}
// 2. Delegate to the compiled standalone server
require('./.next/standalone/server.js');
