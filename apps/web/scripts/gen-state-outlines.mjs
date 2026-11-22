// One-off generator for packages/core/geo/india-states.json — the state
// boundaries + name labels drawn faintly under every route map so a viewer can
// tell which state each stop is in. Geography doesn't change, so this only needs
// re-running to adjust detail (the TOL argument) or the source.
//
//   cd $(mktemp -d) && npm i polygon-clipping@0.15.7 && \
//     curl -sL -o in.geojson \
//       https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@main/geojson/india.geojson && \
//     node /path/to/apps/web/scripts/gen-state-outlines.mjs in.geojson out.json 0.03 && \
//     cp out.json /path/to/packages/core/geo/india-states.json
//
// Source: udit-001/india-maps-data (district polygons, ODbL). Districts are
// dissolved into one outline per state with polygon-clipping, clipped to the
// South Asia bbox (lng 66–98, lat 4–37) and simplified by dropping
// near-coincident points. `label` is the area-weighted centroid of each state's
// largest piece, for placing its name.
import { readFileSync, writeFileSync } from 'node:fs';
import polygonClipping from 'polygon-clipping';

const [, , SRC, OUT, TOLARG] = process.argv;
const TOL = Number(TOLARG || 0.03);
const [W, E, S, N] = [66, 98, 4, 37];

const fc = JSON.parse(readFileSync(SRC, 'utf8'));
const byState = new Map();
for (const f of fc.features) {
  const name = f.properties.st_nm;
  if (!name) continue;
  const g = f.geometry;
  const mp = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
  if (!byState.has(name)) byState.set(name, []);
  byState.get(name).push(mp);
}

function clip(ring) {
  let out = ring;
  const edges = [
    [(p) => p[0] >= W, (a, b) => { const t = (W - a[0]) / (b[0] - a[0]); return [W, a[1] + t * (b[1] - a[1])]; }],
    [(p) => p[0] <= E, (a, b) => { const t = (E - a[0]) / (b[0] - a[0]); return [E, a[1] + t * (b[1] - a[1])]; }],
    [(p) => p[1] >= S, (a, b) => { const t = (S - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), S]; }],
    [(p) => p[1] <= N, (a, b) => { const t = (N - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), N]; }],
  ];
  for (const [inside, cut] of edges) {
    const inp = out; out = [];
    for (let i = 0; i < inp.length; i++) {
      const cur = inp[i], prev = inp[(i + inp.length - 1) % inp.length];
      if (inside(cur)) { if (!inside(prev)) out.push(cut(prev, cur)); out.push(cur); }
      else if (inside(prev)) out.push(cut(prev, cur));
    }
    if (!out.length) break;
  }
  return out;
}
const simplify = (r) => {
  const kept = [];
  for (const [x, y] of r) {
    const l = kept[kept.length - 1];
    if (!l || Math.hypot(x - l[0], y - l[1]) > TOL) kept.push([Math.round(x * 1000) / 1000, Math.round(y * 1000) / 1000]);
  }
  return kept;
};
const area = (r) => { let a = 0; for (let i = 0, n = r.length; i < n; i++) { const p = r[i], q = r[(i + 1) % n]; a += p[0] * q[1] - q[0] * p[1]; } return a / 2; };
const centroid = (r) => { let x = 0, y = 0, a = 0; for (let i = 0, n = r.length; i < n; i++) { const p = r[i], q = r[(i + 1) % n]; const f = p[0] * q[1] - q[0] * p[1]; a += f; x += (p[0] + q[0]) * f; y += (p[1] + q[1]) * f; } a *= 0.5; return [x / (6 * a), y / (6 * a)]; };

const states = [];
for (const [name, districts] of byState) {
  let merged;
  try { merged = polygonClipping.union(districts[0], ...districts.slice(1)); }
  catch (e) { console.warn('union failed for', name, e.message); continue; }
  const rings = [];
  let biggest = null, biggestArea = 0;
  for (const poly of merged) {
    const c = clip(poly[0]);
    if (c.length < 4) continue;
    const s = simplify(c);
    if (s.length < 4) continue;
    rings.push(s);
    const ar = Math.abs(area(s));
    if (ar > biggestArea) { biggestArea = ar; biggest = s; }
  }
  if (!rings.length) continue;
  states.push({ name, rings, label: biggest ? centroid(biggest).map((v) => Math.round(v * 1000) / 1000) : null });
}

const out = {
  source: 'India state boundaries dissolved from district polygons (udit-001/india-maps-data, ODbL) via polygon-clipping; clipped to lng 66–98, lat 4–37; simplified (tol ' + TOL + ').',
  states,
};
writeFileSync(OUT, JSON.stringify(out));
console.log('states:', states.length, 'rings:', states.reduce((a, s) => a + s.rings.length, 0), 'bytes:', JSON.stringify(out).length);
