// Post-export CSP hardening for the static site.
//
// A Next.js static export emits per-page executable inline scripts (the
// `self.__next_f.push(...)` hydration payload) with no runtime to attach a
// nonce, so the header CSP in firebase.json must keep `script-src 'unsafe-inline'`
// to let them run. That is the one weak spot in the policy. This script closes
// it WITHOUT a server: for each exported HTML file it computes the SHA-256 of
// every executable inline script and injects a per-page
// `<meta http-equiv="Content-Security-Policy">` whose `script-src` lists exactly
// those hashes (and 'self' for the chunk files) — and NO 'unsafe-inline'.
//
// The meta and header policies are enforced together: an injected inline script
// passes the header (unsafe-inline) but fails the meta (no matching hash) and is
// blocked. Data blocks (`application/ld+json`) are not executed, so CSP does not
// govern them and they need no hash.
//
// Runs automatically after `next build` (postbuild). Idempotent.
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = dirname(fileURLToPath(import.meta.url));
const outDir = join(root, '..', 'out');

// Executable inline <script> ... </script> with no `src`. Next escapes any
// literal `</script>` inside JS strings as `<\/script>`, so a non-greedy match
// to the first `</script>` is safe. The attribute group lets us skip data
// blocks (type="application/ld+json" / "application/json").
const INLINE_SCRIPT = /<script(?![^>]*\ssrc=)([^>]*)>([\s\S]*?)<\/script>/gi;
const NON_EXEC_TYPE = /type\s*=\s*["'](application\/(ld\+json|json))["']/i;
// A CSP meta we previously injected — matched so re-runs replace, not stack.
const EXISTING_META = /\s*<meta http-equiv="Content-Security-Policy"[^>]*>/i;

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (extname(p) === '.html') out.push(p);
  }
  return out;
}

export function hashesFor(html) {
  const set = new Set();
  for (const [, attrs, body] of html.matchAll(INLINE_SCRIPT)) {
    if (NON_EXEC_TYPE.test(attrs)) continue; // data block, not executed
    const digest = createHash('sha256').update(body, 'utf8').digest('base64');
    set.add(`'sha256-${digest}'`);
  }
  return [...set];
}

export function metaFor(html) {
  const hashes = hashesFor(html);
  if (hashes.length === 0) return null;
  return `<meta http-equiv="Content-Security-Policy" content="script-src 'self' ${hashes.join(' ')}">`;
}

export function injectMeta(html, metaTag) {
  const cleaned = html.replace(EXISTING_META, '');
  // Place the policy first in <head> so it governs every later script.
  if (/<head[^>]*>/i.test(cleaned)) {
    return cleaned.replace(/(<head[^>]*>)/i, `$1${metaTag}`);
  }
  // Defensive: no <head> (shouldn't happen for Next pages) — prepend.
  return metaTag + cleaned;
}

function existsSyncDir(p) {
  try {
    return statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function main() {
  const files = existsSyncDir(outDir) ? walk(outDir) : [];
  if (files.length === 0) {
    console.error('✗ no HTML under apps/web/out — run `next build` first');
    process.exit(1);
  }
  let processed = 0;
  let maxHashes = 0;
  for (const file of files) {
    const html = readFileSync(file, 'utf8');
    const meta = metaFor(html);
    if (!meta) continue; // static page with no executable inline scripts
    maxHashes = Math.max(maxHashes, hashesFor(html).length);
    writeFileSync(file, injectMeta(html, meta));
    processed++;
  }
  console.log(
    `✓ CSP script hashes injected into ${processed}/${files.length} HTML pages (≤${maxHashes} hashes/page)`,
  );
}

// Only walk/rewrite the export when run directly (not when imported by a test).
if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
