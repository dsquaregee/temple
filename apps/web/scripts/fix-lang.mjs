// Post-build: set the correct <html lang> per locale in the static export.
//
// The App Router has a single root layout, so the exported HTML ships
// `<html lang="en">` on every page; LocaleClient fixes it client-side, but
// crawlers see the static value. This rewrites `lang="en"` → the page's locale
// for every non-English output path, so the served HTML's lang matches its
// hreflang — a correctness win for a multilingual catalog. Runs after export,
// alongside csp-hashes.
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'out');
const LOCALES = ['ta', 'te', 'kn', 'ml', 'hi']; // en is the built-in default

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if (name.endsWith('.html')) fixFile(p);
  }
}

let changed = 0;
function fixFile(path) {
  // Locale is the first path segment under out/.
  const rel = path.slice(outDir.length + 1);
  const seg = rel.split(/[\\/]/)[0];
  if (!LOCALES.includes(seg)) return;
  const html = readFileSync(path, 'utf8');
  const next = html.replace(/<html lang="en"/, `<html lang="${seg}"`);
  if (next !== html) {
    writeFileSync(path, next);
    changed++;
  }
}

walk(outDir);
console.log(`✓ <html lang> localized on ${changed} non-English pages`);
