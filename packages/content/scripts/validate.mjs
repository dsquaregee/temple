// Validates every content JSON file: required fields, locale/id consistency
// with its path, circuit stop references, and cross-locale parity with the
// English source of truth. Zero dependencies so it can run pre-install in CI.
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const dataDir = join(root, '..', 'data');
const LOCALES = ['en', 'ta', 'te', 'kn', 'ml', 'hi'];

const errors = [];

function req(obj, key, type, ctx) {
  const v = key.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
  const ok =
    type === 'array'
      ? Array.isArray(v)
      : typeof v === type && (type !== 'string' || v.trim().length > 0);
  if (!ok) errors.push(`${ctx}: missing/invalid "${key}" (want ${type})`);
}

function load(kind) {
  const byLocale = {};
  const kindDir = join(dataDir, kind);
  for (const locale of readdirSync(kindDir).sort()) {
    byLocale[locale] = {};
    for (const file of readdirSync(join(kindDir, locale)).sort()) {
      if (!file.endsWith('.json')) continue;
      const ctx = `${kind}/${locale}/${file}`;
      let doc;
      try {
        doc = JSON.parse(readFileSync(join(kindDir, locale, file), 'utf8'));
      } catch (e) {
        errors.push(`${ctx}: JSON parse error — ${e.message}`);
        continue;
      }
      const id = file.replace(/\.json$/, '');
      if (doc.id !== id) errors.push(`${ctx}: id "${doc.id}" ≠ filename`);
      if (doc.locale !== locale)
        errors.push(`${ctx}: locale "${doc.locale}" ≠ directory`);
      byLocale[locale][id] = doc;

      if (kind === 'temples') {
        for (const k of [
          'name', 'nativeName', 'deity', 'tradition', 'period', 'dynasty',
          'style', 'summary', 'location.city', 'location.state',
          'sections.history', 'sections.architecture', 'sections.legends',
          'sections.festivals', 'sections.experience', 'visit.timings',
          'visit.dressCode', 'visit.photography', 'visit.gettingThere',
        ]) req(doc, k, 'string', ctx);
        req(doc, 'century', 'number', ctx);
        req(doc, 'location.lat', 'number', ctx);
        req(doc, 'location.lng', 'number', ctx);
        req(doc, 'unesco', 'boolean', ctx);
        req(doc, 'circuits', 'array', ctx);
      } else {
        for (const k of ['name', 'nativeName', 'theme', 'region', 'description'])
          req(doc, k, 'string', ctx);
        req(doc, 'stops', 'array', ctx);
      }
    }
  }
  return byLocale;
}

const temples = load('temples');
const circuits = load('circuits');

// Circuit stops must reference temples that exist in the same locale.
for (const [locale, byId] of Object.entries(circuits)) {
  for (const c of Object.values(byId)) {
    for (const stop of c.stops ?? []) {
      if (!temples[locale]?.[stop])
        errors.push(`circuits/${locale}/${c.id}: stop "${stop}" has no temple file`);
    }
  }
}

// Every non-English locale must mirror the English catalog exactly.
const enTemples = Object.keys(temples.en ?? {}).sort();
const enCircuits = Object.keys(circuits.en ?? {}).sort();
for (const locale of LOCALES) {
  const t = Object.keys(temples[locale] ?? {}).sort();
  const c = Object.keys(circuits[locale] ?? {}).sort();
  if (t.join() !== enTemples.join())
    errors.push(`locale ${locale}: temple set differs from en (${t.length} vs ${enTemples.length})`);
  if (c.join() !== enCircuits.join())
    errors.push(`locale ${locale}: circuit set differs from en`);
}

if (errors.length) {
  console.error(`✗ ${errors.length} content error(s):`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log(
  `✓ content valid: ${enTemples.length} temples × ${LOCALES.length} locales, ${enCircuits.length} circuits`
);
