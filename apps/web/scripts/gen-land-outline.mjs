// One-off generator for packages/core/geo/south-india-land.json — the coastline drawn
// under every circuit route map (components/CircuitMap.tsx). Geography doesn't
// change, so this only needs re-running to widen the covered area (e.g. a
// circuit outside South India; validate.mjs enforces the current bbox).
//
//   cd $(mktemp -d) && npm i world-atlas@2.0.2 topojson-client@3.1.0 && \
//     node /path/to/apps/web/scripts/gen-land-outline.mjs && \
//     cp out.json /path/to/packages/core/geo/south-india-land.json
//
// Source: Natural Earth 1:10m countries (public domain), via world-atlas.
import { readFileSync, writeFileSync } from 'node:fs';
import * as topo from 'topojson-client';
const world = JSON.parse(readFileSync('node_modules/world-atlas/countries-10m.json', 'utf8'));
const fc = topo.feature(world, world.objects.countries);
const pick = fc.features.filter((f) => ['India', 'Sri Lanka'].includes(f.properties.name));
const [W, E, S, N] = [71, 88, 5.5, 22];
// Sutherland–Hodgman clip of a ring to the bbox.
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
const rings = [];
for (const f of pick) {
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  for (const p of polys) {
    const r = clip(p[0]);
    if (r.length < 3) continue;
    // drop points closer than ~0.005° (~500 m) to the previous kept point
    const kept = [];
    for (const [x, y] of r) {
      const l = kept[kept.length - 1];
      if (!l || Math.hypot(x - l[0], y - l[1]) > 0.005) kept.push([Math.round(x * 1000) / 1000, Math.round(y * 1000) / 1000]);
    }
    if (kept.length >= 3) rings.push(kept);
  }
}
console.log(rings.length, rings.reduce((a, r) => a + r.length, 0));
writeFileSync('out.json', JSON.stringify({ source: 'Natural Earth 1:10m countries (public domain) via world-atlas@2.0.2; India + Sri Lanka clipped to lng 71–88, lat 5.5–22', rings }));
