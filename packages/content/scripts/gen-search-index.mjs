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
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const templesDir = join(root, '..', 'data', 'temples');
const outDir = join(root, '..', '..', '..', 'apps', 'web', 'public', 'search');

// Keep this list in sync with `searchIndexText` in packages/core/src/discover.ts.
const SEARCH_FIELDS = ['deity', 'tradition', 'style', 'period'];

// Festival names each temple celebrates, so a devotee can search "Navaratri" and
// find every temple that keeps it. Detection mirrors packages/core/src/festivals.ts
// (patterns scanned in the English prose); this inline copy keeps the script
// node-20-safe (no TS import at build time) and is kept in sync by a test
// (packages/core/test/festivals.test.ts → "search-index festival list matches").
export const FESTIVAL_SEARCH = [
  { name: 'Thai Poosam', patterns: ['thai poosam', 'thaipusam', 'thaipoosam'] },
  { name: 'Maha Shivaratri', patterns: ['shivaratri'] },
  { name: 'Masi Magam', patterns: ['masi magam', 'masimagam'] },
  { name: 'Panguni Uthiram', patterns: ['panguni uthiram'] },
  { name: 'Aadi Pooram', patterns: ['aadi pooram', 'adi pooram'] },
  { name: 'Vinayaka Chaturthi', patterns: ['vinayaka chaturthi', 'vinayaka chathurthi', 'ganesh chaturthi'] },
  { name: 'Navaratri', patterns: ['navaratri', 'navratri'] },
  { name: 'Skanda Shashti', patterns: ['skanda shashti', 'skanda sashti', 'kandha sashti', 'kanda sashti'] },
  { name: 'Karthigai Deepam', patterns: ['karthigai deepam'] },
  { name: 'Arudra Darshan', patterns: ['arudra', 'thiruvathirai', 'arudhra'] },
  { name: 'Vaikunta Ekadashi', patterns: ['vaikunta ekadashi', 'vaikuntha ekadashi', 'vaikunta ekadasi'] },
];

function festivalText(enFestivalProse) {
  const hay = (enFestivalProse || '').toLowerCase();
  return FESTIVAL_SEARCH.filter((f) => f.patterns.some((p) => hay.includes(p)))
    .map((f) => f.name)
    .join(' ')
    .toLowerCase();
}

function searchText(doc, extra) {
  return [...SEARCH_FIELDS.map((k) => doc[k]), extra]
    .filter((v) => typeof v === 'string' && v.trim())
    .join(' ')
    .toLowerCase();
}

function main() {
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  const locales = readdirSync(templesDir).filter((d) => !d.startsWith('.')).sort();

  // Festival names are the same (transliterated) in every locale, detected once
  // from the English prose (the source of truth) and appended to each locale's
  // entry so festival search works in all languages.
  const festivalById = {};
  for (const file of readdirSync(join(templesDir, 'en')).sort()) {
    if (!file.endsWith('.json')) continue;
    const doc = JSON.parse(readFileSync(join(templesDir, 'en', file), 'utf8'));
    festivalById[doc.id] = festivalText(doc.sections?.festivals);
  }

  let total = 0;
  for (const locale of locales) {
    const index = {};
    for (const file of readdirSync(join(templesDir, locale)).sort()) {
      if (!file.endsWith('.json')) continue;
      const doc = JSON.parse(readFileSync(join(templesDir, locale, file), 'utf8'));
      index[doc.id] = searchText(doc, festivalById[doc.id]);
      total++;
    }
    // Compact JSON (no whitespace) — this file is fetched by clients.
    writeFileSync(join(outDir, `${locale}.json`), JSON.stringify(index));
  }

  console.log(
    `✓ search index written: ${locales.length} locales × ${total / locales.length} temples → ${outDir}`,
  );
}

// Only run when invoked directly (not when imported by the sync test).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
