import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  layoutCircuitMap, shortName, wrapText, clipRing, smoothPath, type MapStop,
} from '../src/circuit-map.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const data = join(root, 'packages', 'content', 'data');
const land = JSON.parse(readFileSync(join(root, 'apps', 'web', 'lib', 'geo', 'south-india-land.json'), 'utf8')).rings;

const overlap = (a: { x: number; y: number; w: number; h: number }, b: typeof a) =>
  a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

function stopsFor(locale: string, circuitId: string): MapStop[] {
  const c = JSON.parse(readFileSync(join(data, 'circuits', locale, `${circuitId}.json`), 'utf8'));
  return c.stops.map((id: string) => {
    const t = JSON.parse(readFileSync(join(data, 'temples', locale, `${id}.json`), 'utf8'));
    return { id, name: t.name, city: t.location.city, lat: t.location.lat, lng: t.location.lng };
  });
}

// Every real circuit in every locale: one pin and one non-overlapping, in-frame
// label per stop, numbered in pilgrimage order. Runs over live content, so a
// newly added temple or circuit is covered automatically.
for (const locale of readdirSync(join(data, 'circuits'))) {
  for (const file of readdirSync(join(data, 'circuits', locale))) {
    const id = file.replace(/\.json$/, '');
    test(`route map layout: ${locale}/${id}`, () => {
      const stops = stopsFor(locale, id);
      const m = layoutCircuitMap(stops, land);
      assert.equal(m.pins.length, stops.length);
      assert.equal(m.labels.length, stops.length);
      assert.deepEqual(m.labels.map((l) => l.id), stops.map((s) => s.id));
      assert.deepEqual(m.pins.map((p) => p.n), stops.map((_, i) => i + 1));
      for (const p of m.pins) {
        assert.ok(p.x >= 0 && p.x <= m.width && p.y >= 30 && p.y <= m.height, `pin ${p.id} inside frame`);
      }
      for (const [i, a] of m.labels.entries()) {
        assert.ok(a.x >= 0 && a.x + a.w <= m.width && a.y >= 0 && a.y + a.h <= m.height, `label ${a.id} inside frame`);
        assert.ok(a.lines.length >= 1 && a.lines.length <= 2);
        for (const b of m.labels.slice(i + 1)) assert.ok(!overlap(a, b), `labels ${a.id} / ${b.id} overlap`);
      }
      assert.match(m.routePath, /^M[\d.-]+ [\d.-]+( C[\d. -]+)*$/);
    });
  }
}

test('dense same-town circuit falls back to the legend column with leaders', () => {
  const m = layoutCircuitMap(stopsFor('en', 'temples-of-kanchipuram'), land);
  const xs = new Set(m.labels.map((l) => l.x));
  assert.equal(xs.size, 1, 'all labels share one column');
  assert.ok(m.labels.every((l) => l.leader), 'every label has a leader line');
});

test('coastal circuit draws land; scale bar is a friendly distance', () => {
  const m = layoutCircuitMap(stopsFor('en', 'pancha-bhoota-sthalams'), land);
  assert.ok(m.landPath.startsWith('M') && m.landPath.includes('Z'));
  assert.match(m.scale.label, /^(0\.5|1|2|5|10|20|25|50|100|200|250|500) km$/);
});

test('no stops yields an empty layout', () => {
  const m = layoutCircuitMap([], land);
  assert.equal(m.pins.length, 0);
  assert.equal(m.height, 0);
});

test('shortName drops the town and a trailing English "Temple"', () => {
  assert.equal(shortName('Adinathar Perumal Temple, Alvarthirunagari'), 'Adinathar Perumal');
  assert.equal(shortName('Ekambareswarar Temple'), 'Ekambareswarar');
  assert.equal(shortName('ஏகாம்பரேஸ்வரர் கோயில்'), 'ஏகாம்பரேஸ்வரர் கோயில்');
  assert.equal(shortName('Vaikom Mahadeva Temple (Vaikkathappan)'), 'Vaikom Mahadeva');
});

test('wrapText wraps to two lines, shrinking the font before truncating', () => {
  const short = wrapText('Ekambareswarar', 200);
  assert.deepEqual(short.lines, ['Ekambareswarar']);
  const long = wrapText('Thirunageswaram Naganathaswamy Kovil Extra Words Here', 170);
  assert.ok(long.lines.length <= 2);
  assert.ok(long.lines[1]!.endsWith('…'));
});

test('clipRing clips a polygon to the rectangle', () => {
  const r = clipRing([[-10, -10], [10, -10], [10, 10], [-10, 10]], 0, 0, 5, 5);
  assert.ok(r.every(([x, y]) => x >= 0 && x <= 5 && y >= 0 && y <= 5));
  assert.ok(r.length >= 4);
});

test('smoothPath passes through every point', () => {
  const d = smoothPath([{ x: 0, y: 0 }, { x: 10, y: 5 }, { x: 20, y: 0 }]);
  assert.ok(d.startsWith('M0 0'));
  assert.ok(d.includes(' 10 5 C') && d.endsWith(' 20 0'));
});
