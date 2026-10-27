// Emits a per-locale, per-circuit offline manifest:
//   apps/web/public/offline/<locale>/<circuitId>.json  →  { resources: string[] }
// listing every URL needed to use that circuit offline — its overview + regional
// pages, and each stop's temple page, narration audio and hero image. The
// circuit page ships only a Download button; it fetches this manifest on tap, so
// a 275-stop circuit doesn't bloat the page payload. Zero-dependency (reads the
// same content JSON as validate.mjs); runs in build before `next build`.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const dataDir = join(root, '..', '..', '..', 'packages', 'content', 'data');
const templesDir = join(dataDir, 'temples');
const circuitsDir = join(dataDir, 'circuits');
const outRoot = join(root, '..', 'public', 'offline');

const templeCache = new Map();
function temple(locale, id) {
  const k = `${locale}/${id}`;
  if (!templeCache.has(k)) {
    try {
      templeCache.set(k, JSON.parse(readFileSync(join(templesDir, locale, `${id}.json`), 'utf8')));
    } catch {
      templeCache.set(k, null);
    }
  }
  return templeCache.get(k);
}

rmSync(outRoot, { recursive: true, force: true });
mkdirSync(outRoot, { recursive: true });

const locales = readdirSync(circuitsDir).filter((d) => !d.startsWith('.')).sort();
let total = 0;
for (const locale of locales) {
  mkdirSync(join(outRoot, locale), { recursive: true });
  for (const file of readdirSync(join(circuitsDir, locale)).sort()) {
    if (!file.endsWith('.json')) continue;
    const circuit = JSON.parse(readFileSync(join(circuitsDir, locale, file), 'utf8'));
    const resources = [`/${locale}/yatra/${circuit.id}/`];
    for (const g of circuit.groups ?? []) {
      resources.push(`/${locale}/yatra/${circuit.id}/${g.id}/`);
    }
    for (const id of circuit.stops ?? []) {
      resources.push(`/${locale}/temples/${id}/`);
      const t = temple(locale, id);
      if (t?.audio?.storyUrl) resources.push(t.audio.storyUrl);
      if (t?.hero?.src) resources.push(t.hero.src);
    }
    // De-dupe while preserving order.
    const unique = [...new Set(resources)];
    writeFileSync(
      join(outRoot, locale, `${circuit.id}.json`),
      JSON.stringify({ resources: unique })
    );
    total += 1;
  }
}

console.log(`✓ offline manifests written: ${total} circuit manifests → ${outRoot}`);
