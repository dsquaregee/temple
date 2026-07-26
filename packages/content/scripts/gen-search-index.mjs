// Emits the per-locale Discover search index: `{ <temple-id>: "<search text>" }`,
// where the text is the lowercased deity/tradition/style/period for that temple.
// These four fields are searchable but never displayed on the Discover card, so
// they are kept OFF the listing HTML payload (see TempleCardData) and loaded
// lazily by the Discover tab instead. One JSON per locale is written to
// apps/web/public/search/<locale>.json, so Next copies it into the static export
// and Firebase serves it at /search/<locale>.json (CSP connect-src 'self').
//
// Zero dependencies — reads the same content JSON as validate.mjs, so it runs in
// CI and deploy before `next build` without an install step.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const templesDir = join(root, '..', 'data', 'temples');
const outDir = join(root, '..', '..', '..', 'apps', 'web', 'public', 'search');

// Keep this list in sync with `searchIndexText` in packages/core/src/discover.ts.
const SEARCH_FIELDS = ['deity', 'tradition', 'style', 'period'];

function searchText(doc) {
  return SEARCH_FIELDS.map((k) => doc[k])
    .filter((v) => typeof v === 'string' && v.trim())
    .join(' ')
    .toLowerCase();
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const locales = readdirSync(templesDir).filter((d) => !d.startsWith('.')).sort();
let total = 0;
for (const locale of locales) {
  const index = {};
  for (const file of readdirSync(join(templesDir, locale)).sort()) {
    if (!file.endsWith('.json')) continue;
    const doc = JSON.parse(readFileSync(join(templesDir, locale, file), 'utf8'));
    index[doc.id] = searchText(doc);
    total++;
  }
  // Compact JSON (no whitespace) — this file is fetched by clients.
  writeFileSync(join(outDir, `${locale}.json`), JSON.stringify(index));
}

console.log(
  `✓ search index written: ${locales.length} locales × ${total / locales.length} temples → ${outDir}`,
);
