// Minimal static server for the exported site (apps/web/out), replaying the
// production response headers from firebase.json so Lighthouse (and manual
// checks) see the real CSP / HSTS / Permissions-Policy — not a bare server.
//
// Zero dependencies. Honors trailingSlash directory indexes and the `**` +
// path-specific header rules from firebase.json (last matching rule wins,
// mirroring Firebase Hosting). Prints the bound URL; PORT env overrides.
import { readFileSync, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const OUT = join(root, '..', 'out');
const firebase = JSON.parse(readFileSync(join(root, '..', '..', '..', 'firebase.json'), 'utf8'));
const headerRules = firebase.hosting?.headers ?? [];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.woff2': 'font/woff2',
};

// Translate a Firebase glob source ("**", "/_next/static/**") to a RegExp.
function toRegExp(glob) {
  const re = glob
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '::GLOBSTAR::')
    .replace(/\*/g, '[^/]*')
    .replace(/::GLOBSTAR::/g, '.*');
  return new RegExp('^' + re + '$');
}
const rules = headerRules.map((r) => ({ test: toRegExp(r.source), headers: r.headers }));

function headersFor(pathname) {
  const out = {};
  for (const rule of rules) {
    if (rule.test.test(pathname)) for (const h of rule.headers) out[h.key] = h.value;
  }
  return out;
}

function resolve(pathname) {
  let fp = join(OUT, pathname);
  if (existsSync(fp) && statSync(fp).isDirectory()) fp = join(fp, 'index.html');
  else if (!existsSync(fp) && existsSync(fp + '.html')) fp += '.html';
  return existsSync(fp) && statSync(fp).isFile() ? fp : null;
}

const server = createServer((req, res) => {
  const pathname = decodeURIComponent((req.url || '/').split('?')[0]);
  const fp = resolve(pathname);
  if (!fp) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
    return;
  }
  const headers = { 'Content-Type': MIME[extname(fp)] || 'application/octet-stream', ...headersFor(pathname) };
  res.writeHead(200, headers);
  res.end(readFileSync(fp));
});

const port = Number(process.env.PORT || 4999);
server.listen(port, () => {
  console.log(`Serving apps/web/out with firebase.json headers → http://localhost:${port}`);
});
