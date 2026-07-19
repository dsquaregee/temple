import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { HERO_PALETTE } from '../../core/src/media.ts';

// Loads the real catalog JSON off disk and asserts the invariants the apps
// depend on. Complements scripts/validate.mjs: that guards the CI gate with
// zero deps; this expresses the same contract as tests plus cross-locale
// *factual* parity (translations must not drift structural data).

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = join(here, '..', 'data');
const LOCALES = ['en', 'ta', 'te', 'kn', 'ml', 'hi'] as const;

type Doc = Record<string, any>;
type ByLocale = Record<string, Record<string, Doc>>;

function load(kind: 'temples' | 'circuits'): ByLocale {
  const out: ByLocale = {};
  const kindDir = join(dataDir, kind);
  for (const locale of readdirSync(kindDir).sort()) {
    out[locale] = {};
    for (const file of readdirSync(join(kindDir, locale)).sort()) {
      if (!file.endsWith('.json')) continue;
      const id = file.replace(/\.json$/, '');
      out[locale][id] = JSON.parse(readFileSync(join(kindDir, locale, file), 'utf8'));
    }
  }
  return out;
}

const temples = load('temples');
const circuits = load('circuits');

function get(obj: Doc, path: string): unknown {
  return path.split('.').reduce<any>((o, k) => (o ? o[k] : undefined), obj);
}

test('all six locales are present for temples and circuits', () => {
  for (const locale of LOCALES) {
    assert.ok(temples[locale], `no temples for ${locale}`);
    assert.ok(circuits[locale], `no circuits for ${locale}`);
  }
});

test('every locale has the same temple and circuit id set as English', () => {
  const enTemples = Object.keys(temples.en).sort();
  const enCircuits = Object.keys(circuits.en).sort();
  for (const locale of LOCALES) {
    assert.deepEqual(Object.keys(temples[locale]).sort(), enTemples, `temples ${locale}`);
    assert.deepEqual(Object.keys(circuits[locale]).sort(), enCircuits, `circuits ${locale}`);
  }
});

test('id and locale fields agree with each file’s path', () => {
  for (const locale of LOCALES) {
    for (const [id, doc] of Object.entries(temples[locale])) {
      assert.equal(doc.id, id, `${locale}/${id} id mismatch`);
      assert.equal(doc.locale, locale, `${locale}/${id} locale mismatch`);
    }
  }
});

test('every temple has all required localized prose and factual fields', () => {
  const strings = [
    'name', 'nativeName', 'deity', 'tradition', 'period', 'dynasty', 'style',
    'summary', 'location.city', 'location.state',
    'sections.history', 'sections.architecture', 'sections.legends',
    'sections.festivals', 'sections.experience',
    'visit.timings', 'visit.dressCode', 'visit.photography', 'visit.gettingThere',
  ];
  for (const locale of LOCALES) {
    for (const [id, doc] of Object.entries(temples[locale])) {
      for (const key of strings) {
        const v = get(doc, key);
        assert.equal(typeof v, 'string', `${locale}/${id}.${key} not a string`);
        assert.ok((v as string).trim().length > 0, `${locale}/${id}.${key} empty`);
      }
      assert.equal(typeof doc.century, 'number', `${locale}/${id}.century`);
      assert.equal(typeof doc.unesco, 'boolean', `${locale}/${id}.unesco`);
      assert.ok(Array.isArray(doc.circuits), `${locale}/${id}.circuits`);
      assert.equal(typeof doc.location.lat, 'number', `${locale}/${id}.lat`);
      assert.equal(typeof doc.location.lng, 'number', `${locale}/${id}.lng`);
    }
  }
});

test('centuries and coordinates are within plausible bounds', () => {
  for (const [id, doc] of Object.entries(temples.en)) {
    assert.ok(doc.century >= 1 && doc.century <= 21, `${id} century ${doc.century}`);
    // Rough Indian-subcontinent bounding box.
    assert.ok(doc.location.lat >= 6 && doc.location.lat <= 37, `${id} lat ${doc.location.lat}`);
    assert.ok(doc.location.lng >= 68 && doc.location.lng <= 98, `${id} lng ${doc.location.lng}`);
  }
});

test('circuit stops reference temples that exist in the same locale', () => {
  for (const locale of LOCALES) {
    for (const c of Object.values(circuits[locale])) {
      for (const stop of c.stops ?? []) {
        assert.ok(temples[locale][stop], `circuit ${c.id} (${locale}) → missing stop "${stop}"`);
      }
    }
  }
});

test('every circuit a temple claims membership in actually exists', () => {
  for (const [id, doc] of Object.entries(temples.en)) {
    for (const circuitId of doc.circuits ?? []) {
      assert.ok(circuits.en[circuitId], `temple ${id} → unknown circuit "${circuitId}"`);
    }
  }
});

test('circuit membership is bidirectional (temple.circuits ↔ circuit.stops)', () => {
  for (const [templeId, doc] of Object.entries(temples.en)) {
    for (const circuitId of doc.circuits ?? []) {
      const circuit = circuits.en[circuitId];
      assert.ok(
        circuit?.stops?.includes(templeId),
        `temple ${templeId} claims circuit ${circuitId} but is not among its stops`,
      );
    }
  }
});

test('translations preserve factual fields exactly from the English source', () => {
  // Structural / factual data must be identical across locales — only prose is
  // translated. Catches a translation accidentally editing a coordinate,
  // century, UNESCO flag, or circuit membership.
  const factual = ['century', 'unesco', 'location.lat', 'location.lng'];
  for (const [id, en] of Object.entries(temples.en)) {
    for (const locale of LOCALES) {
      if (locale === 'en') continue;
      const other = temples[locale][id];
      for (const key of factual) {
        assert.deepEqual(get(other, key), get(en, key), `${locale}/${id}.${key} differs from en`);
      }
      assert.deepEqual(
        [...other.circuits].sort(),
        [...en.circuits].sort(),
        `${locale}/${id}.circuits differ from en`,
      );
    }
  }
});

test('circuit stop ordering is identical across locales', () => {
  for (const [id, en] of Object.entries(circuits.en)) {
    for (const locale of LOCALES) {
      if (locale === 'en') continue;
      assert.deepEqual(circuits[locale][id].stops, en.stops, `${locale}/${id} stop order differs`);
    }
  }
});

// The web hero background is a CSS class per palette tone (no inline style, so
// CSP style-src stays 'self'). A stored hero.color outside HERO_PALETTE would
// silently fall back to the default tone — catch that here instead.
test('every stored hero.color is a HERO_PALETTE tone', () => {
  const palette = new Set<string>(HERO_PALETTE);
  for (const locale of LOCALES) {
    for (const [id, doc] of Object.entries(temples[locale])) {
      const color = doc.hero?.color;
      if (color == null) continue;
      assert.ok(palette.has(color), `${locale}/${id}.hero.color ${color} is not in HERO_PALETTE`);
    }
  }
});
