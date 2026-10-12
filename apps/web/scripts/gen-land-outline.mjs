// One-off generator for packages/core/geo/south-asia-land.json — the land
// outline drawn under every circuit route map. Geography doesn't change, so this
// only needs re-running to widen the covered area (validate.mjs enforces it).
//
//   cd $(mktemp -d) && npm i world-atlas@2.0.2 topojson-client@3.1.0 && \
//     node /path/to/apps/web/scripts/gen-land-outline.mjs 0.006 && \
//     cp out2.json /path/to/packages/core/geo/south-asia-land.json
//
// Source: Natural Earth 1:10m land (public domain), via world-atlas.
import { readFileSync, writeFileSync } from 'node:fs';
import * as topo from 'topojson-client';
const world = JSON.parse(readFileSync('node_modules/world-atlas/land-10m.json', 'utf8'));
const fc = topo.feature(world, world.objects.land);
const [W, E, S, N] = [66, 98, 4, 37];
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
const TOL = Number(process.argv[2] || 0.006);
const rings = [];
for (const f of fc.features) {
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  for (const p of polys) {
    const r = clip(p[0]);
    if (r.length < 3) continue;
    const kept = [];
    for (const [x, y] of r) {
      const l = kept[kept.length - 1];
      if (!l || Math.hypot(x - l[0], y - l[1]) > TOL) kept.push([Math.round(x * 1000) / 1000, Math.round(y * 1000) / 1000]);
    }
    if (kept.length >= 4) rings.push(kept);
  }
}
const out = JSON.stringify({ source: 'Natural Earth 1:10m land (public domain) via world-atlas@2.0.2; clipped to lng 66–98, lat 4–37 (South Asia)', rings });
console.log(rings.length, rings.reduce((a, r) => a + r.length, 0), out.length);
writeFileSync('out2.json', out);
