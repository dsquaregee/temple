// Bootstrap a new content locale by machine-translating the English source with
// the Google Cloud Translation API (v2). Produces one temple JSON per temple and
// one circuit JSON per circuit in the target locale, mirroring the existing
// locales' shape exactly so validate.mjs / qa-translations.mjs pass.
//
// WHAT IT TRANSLATES (everything the other locales localize):
//   temples: name, deity, tradition, period, dynasty, style, summary,
//            sections.{history,architecture,legends,festivals,experience},
//            visit.{timings,dressCode,photography,gettingThere},
//            location.{city,state}
//   circuits: name, theme, region, description, groups[].name
// KEPT VERBATIM (constant across locales): id, nativeName (the temple's own
//   canonical name), lat/lng, century, unesco, circuits, stops, groups[].stops.
// DROPPED for a new locale: audio, video (no narration generated yet — the UI
//   shows the "coming soon" state). hero is kept (locale-independent image).
//
// AUTH (run on a machine with gcloud, so no secret is hard-coded):
//   GTRANSLATE_TOKEN=$(gcloud auth print-access-token) \
//   GCP_PROJECT=temples2 \
//   node packages/content/scripts/translate-locale.mjs bn mr or
// or pass an API key instead: GTRANSLATE_KEY=... node ... bn
//
// Re-runnable and idempotent per field: it always rewrites the target files.
// This is a MACHINE translation to bootstrap the locale; a native-fluent review
// pass (as done for the other locales) should follow before it's considered final.
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const dataDir = join(root, '..', 'data');
const TOKEN = process.env.GTRANSLATE_TOKEN;
const KEY = process.env.GTRANSLATE_KEY;
const PROJECT = process.env.GCP_PROJECT;
const ENDPOINT = 'https://translation.googleapis.com/language/translate/v2';

if (!TOKEN && !KEY) {
  console.error('Set GTRANSLATE_TOKEN (gcloud auth print-access-token) or GTRANSLATE_KEY.');
  process.exit(1);
}
const targets = process.argv.slice(2);
if (targets.length === 0) {
  console.error('Usage: node translate-locale.mjs <locale> [<locale> ...]   e.g. bn mr or');
  process.exit(1);
}

// Translate an array of strings in one request (API accepts repeated q).
async function translateBatch(texts, target) {
  if (texts.length === 0) return [];
  const url = KEY ? `${ENDPOINT}?key=${KEY}` : ENDPOINT;
  const headers = { 'Content-Type': 'application/json' };
  if (TOKEN) {
    headers.Authorization = `Bearer ${TOKEN}`;
    if (PROJECT) headers['x-goog-user-project'] = PROJECT;
  }
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ q: texts, source: 'en', target, format: 'text' }),
  });
  if (!res.ok) throw new Error(`Translate API ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return json.data.translations.map((t) => t.text);
}

// Translate a flat map of {path: string}, returning {path: translated}.
async function translateFields(fields, target) {
  const keys = Object.keys(fields);
  const out = {};
  // Chunk to stay under request-size limits (~128 segments / 30k chars per call).
  const CHUNK = 50;
  for (let i = 0; i < keys.length; i += CHUNK) {
    const slice = keys.slice(i, i + CHUNK);
    const translated = await translateBatch(slice.map((k) => fields[k]), target);
    slice.forEach((k, j) => (out[k] = translated[j]));
  }
  return out;
}

const TEMPLE_STR_FIELDS = ['name', 'deity', 'tradition', 'period', 'dynasty', 'style', 'summary'];

async function translateTemple(en, target) {
  const fields = {};
  for (const k of TEMPLE_STR_FIELDS) if (typeof en[k] === 'string') fields[k] = en[k];
  for (const [k, v] of Object.entries(en.sections || {})) if (typeof v === 'string') fields[`sections.${k}`] = v;
  for (const [k, v] of Object.entries(en.visit || {})) if (typeof v === 'string') fields[`visit.${k}`] = v;
  if (en.location?.city) fields['location.city'] = en.location.city;
  if (en.location?.state) fields['location.state'] = en.location.state;

  const tr = await translateFields(fields, target);
  const doc = { ...en, locale: target };
  for (const k of TEMPLE_STR_FIELDS) if (k in tr) doc[k] = tr[k];
  doc.sections = Object.fromEntries(
    Object.keys(en.sections || {}).map((k) => [k, tr[`sections.${k}`] ?? en.sections[k]]),
  );
  doc.visit = Object.fromEntries(
    Object.keys(en.visit || {}).map((k) => [k, tr[`visit.${k}`] ?? en.visit[k]]),
  );
  doc.location = {
    ...en.location,
    city: tr['location.city'] ?? en.location.city,
    state: tr['location.state'] ?? en.location.state,
  };
  // nativeName kept verbatim; audio/video dropped (no narration for this locale yet).
  delete doc.audio;
  delete doc.video;
  return doc;
}

async function translateCircuit(en, target) {
  const fields = {};
  for (const k of ['name', 'theme', 'region', 'description']) if (typeof en[k] === 'string') fields[k] = en[k];
  (en.groups || []).forEach((g, i) => { if (g.name) fields[`group.${i}`] = g.name; });
  const tr = await translateFields(fields, target);
  const doc = { ...en, locale: target };
  for (const k of ['name', 'theme', 'region', 'description']) if (k in tr) doc[k] = tr[k];
  if (en.groups) doc.groups = en.groups.map((g, i) => ({ ...g, name: tr[`group.${i}`] ?? g.name }));
  return doc;
}

async function run() {
  for (const target of targets) {
    for (const kind of ['temples', 'circuits']) {
      const srcDir = join(dataDir, kind, 'en');
      const outDir = join(dataDir, kind, target);
      mkdirSync(outDir, { recursive: true });
      const files = readdirSync(srcDir).filter((f) => f.endsWith('.json')).sort();
      let n = 0;
      for (const file of files) {
        const en = JSON.parse(readFileSync(join(srcDir, file), 'utf8'));
        const doc = kind === 'temples' ? await translateTemple(en, target) : await translateCircuit(en, target);
        writeFileSync(join(outDir, file), JSON.stringify(doc, null, 2) + '\n');
        n++;
        if (n % 25 === 0) console.log(`  ${target}/${kind}: ${n}/${files.length}`);
      }
      console.log(`✓ ${target}/${kind}: ${n} files`);
    }
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
