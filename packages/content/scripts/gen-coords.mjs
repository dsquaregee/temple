// Emits a single locale-independent coordinate index for the Discover "Near me"
// feature: `{ <temple-id>: [lat, lng] }`, written to
// apps/web/public/geo/coords.json. Coordinates are the same in every language,
// so one small file serves all locales — the client fetches it once when the
// visitor taps "Near me", then ranks the (already-fetched) catalogue by
// great-circle distance from the device location (see haversineKm in core).
//
// Read from the English content (the coordinate source of truth; validate.mjs
// keeps lat/lng identical across locales). Zero dependencies, so it runs in CI
// and deploy before `next build` without an install step. Compact JSON (no
// whitespace) — this file is fetched by clients.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const enDir = join(root, '..', 'data', 'temples', 'en');
const outDir = join(root, '..', '..', '..', 'apps', 'web', 'public', 'geo');

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const coords = {};
let total = 0;
for (const file of readdirSync(enDir).sort()) {
  if (!file.endsWith('.json')) continue;
  const doc = JSON.parse(readFileSync(join(enDir, file), 'utf8'));
  const { lat, lng } = doc.location || {};
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    throw new Error(`Missing/invalid coordinates for ${doc.id}`);
  }
  // Round to 4 decimals (~11 m) — ample for distance ranking, and it keeps the
  // file small.
  coords[doc.id] = [Math.round(lat * 1e4) / 1e4, Math.round(lng * 1e4) / 1e4];
  total++;
}

writeFileSync(join(outDir, 'coords.json'), JSON.stringify(coords));
console.log(`✓ coordinate index written: ${total} temples → ${outDir}/coords.json`);
