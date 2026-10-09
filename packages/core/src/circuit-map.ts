// Pure layout for the illustrated circuit route map: projects each stop's
// lat/lng into a fixed-width SVG viewBox, fits the view to the stops, clips the
// coastline to it, threads a smooth route through the stops in pilgrimage order,
// and places a label per stop (left or right of its pin, de-overlapped with
// leader lines). Everything is derived from content data, so adding a temple to
// a circuit's `stops` updates its map on the next build — no hand-drawn art.
// The route line follows a suggested driving order (shortest path); numbering
// stays the circuit's official order.
//
// Render-agnostic: returns geometry only. The web app renders it as inline SVG
// (zero client JS); the mobile app can render the same output with react-native-svg.

export interface MapStop {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
}

export interface MapLabel {
  n: number;
  id: string;
  /** Short temple name, wrapped onto one or two lines. */
  lines: string[];
  nameFont: number;
  city: string;
  /** Top-left corner of the label box. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Where the leader line meets the label (null when it sits beside its pin). */
  leader: { x1: number; y1: number; x2: number; y2: number } | null;
}

export interface CircuitMapLayout {
  width: number;
  height: number;
  /** SVG path data for land, already clipped to the view. Empty if none. */
  landPath: string;
  /** SVG path data for the route through the stops in order. */
  routePath: string;
  pins: { n: number; id: string; x: number; y: number }[];
  labels: MapLabel[];
  /** Stop numbers (official order, 1-based) in the suggested driving order the route follows. */
  order: number[];
  scale: { x: number; y: number; length: number; label: string };
}

export const MAP_WIDTH = 640;
const NAME_FONTS = [22, 20, 18];
export const CITY_FONT = 18;
const LABEL_PAD_X = 12;
const ICON_W = 32;
const LINE_H = 24;
const LABEL_GAP = 8;
const NEAR_MAX_W = 260;
const COL_W = 240;
const PIN_OFFSET = 24;
const KM_PER_DEG = 111.32;

// Rough rendered width of a string: Latin glyphs average ~0.56em; Indic scripts
// (combining marks counted as code points) run wider per visible glyph, so a
// slightly higher factor keeps their boxes from clipping.
export function estimateTextWidth(text: string, fontSize: number): number {
  const chars = [...text];
  const indic = chars.some((c) => c.codePointAt(0)! >= 0x0900 && c.codePointAt(0)! <= 0x0dff);
  return chars.length * fontSize * (indic ? 0.5 : 0.56);
}

// Fit `text` into maxW, cutting at a word boundary with an ellipsis if needed.
export function fitText(text: string, fontSize: number, maxW: number): string {
  if (estimateTextWidth(text, fontSize) <= maxW) return text;
  const words = text.split(/\s+/);
  let out = '';
  for (const w of words) {
    const next = out ? `${out} ${w}` : w;
    if (estimateTextWidth(`${next}…`, fontSize) > maxW) break;
    out = next;
  }
  if (!out) {
    const chars = [...text];
    while (chars.length && estimateTextWidth(`${chars.join('')}…`, fontSize) > maxW) chars.pop();
    out = chars.join('');
  }
  return `${out}…`;
}

// "Adinathar Perumal Temple, Alvarthirunagari" → "Adinathar Perumal Temple":
// the town is already on the label's second line.
// Map labels keep just the core name: no town (it's on the second line), no
// parenthetical alias, and no trailing English "Temple".
export function shortName(name: string): string {
  return (name.split(/[,،]/)[0] ?? name)
    .replace(/\s*[(（][^)）]*[)）]\s*/g, ' ')
    .trim()
    .replace(/\s+Temple$/, '');
}

// "Chottanikkara, Ernakulam district" → "Chottanikkara" when the full place
// doesn't fit the label.
export function shortCity(city: string, maxW: number): string {
  if (estimateTextWidth(city, CITY_FONT) <= maxW) return city;
  return fitText((city.split(/[,،]/)[0] ?? city).trim(), CITY_FONT, maxW);
}

// Wrap onto at most `maxLines` lines within maxW, stepping the font down for a
// single long word before falling back to an ellipsis on the last line.
export function wrapText(text: string, maxW: number, maxLines = 2): { lines: string[]; font: number } {
  const words = text.split(/\s+/).filter(Boolean);
  for (const font of NAME_FONTS) {
    const lines: string[] = [];
    let cur = '';
    let ok = true;
    for (const w of words) {
      const next = cur ? `${cur} ${w}` : w;
      if (estimateTextWidth(next, font) <= maxW) cur = next;
      else if (!cur) { ok = false; break; } // one word wider than the line
      else { lines.push(cur); cur = w; if (estimateTextWidth(w, font) > maxW) { ok = false; break; } }
    }
    if (cur) lines.push(cur);
    if (ok && lines.length <= maxLines) return { lines, font };
  }
  const font = NAME_FONTS[NAME_FONTS.length - 1]!;
  const first = fitText(text, font, maxW);
  if (first.endsWith('…') && maxLines > 1) {
    const head = first.slice(0, -1).trim();
    return { lines: [head, fitText(text.slice(head.length).trim(), font, maxW)], font };
  }
  return { lines: [first], font };
}

// Sutherland–Hodgman clip of a polygon ring against an axis-aligned rectangle.
type Pt = [number, number];

export function clipRing(ring: Pt[], x0: number, y0: number, x1: number, y1: number): Pt[] {
  type Edge = [(p: Pt) => boolean, (a: Pt, b: Pt) => Pt];
  const lerpX = (x: number) => (a: Pt, b: Pt): Pt => [x, a[1] + ((x - a[0]) / (b[0] - a[0])) * (b[1] - a[1])];
  const lerpY = (y: number) => (a: Pt, b: Pt): Pt => [a[0] + ((y - a[1]) / (b[1] - a[1])) * (b[0] - a[0]), y];
  const edges: Edge[] = [
    [(p) => p[0] >= x0, lerpX(x0)],
    [(p) => p[0] <= x1, lerpX(x1)],
    [(p) => p[1] >= y0, lerpY(y0)],
    [(p) => p[1] <= y1, lerpY(y1)],
  ];
  let out = ring;
  for (const [inside, cut] of edges) {
    const input = out;
    out = [];
    for (let i = 0; i < input.length; i++) {
      const cur = input[i]!;
      const prev = input[(i + input.length - 1) % input.length]!;
      if (inside(cur)) {
        if (!inside(prev)) out.push(cut(prev, cur));
        out.push(cur);
      } else if (inside(prev)) {
        out.push(cut(prev, cur));
      }
    }
    if (!out.length) break;
  }
  return out;
}

const r1 = (v: number) => Math.round(v * 10) / 10;

// Catmull-Rom through the points, emitted as cubic Béziers: a road-like curve
// that still passes exactly through every pin.
export function smoothPath(pts: { x: number; y: number }[]): string {
  const first = pts[0];
  if (!first) return '';
  let d = `M${r1(first.x)} ${r1(first.y)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p1 = pts[i]!;
    const p2 = pts[i + 1]!;
    const p0 = pts[i - 1] ?? p1;
    const p3 = pts[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C${r1(c1.x)} ${r1(c1.y)} ${r1(c2.x)} ${r1(c2.y)} ${r1(p2.x)} ${r1(p2.y)}`;
  }
  return d;
}

// Push boxes (sorted by desired y) apart so none overlap, keeping them within
// [top, bottom]: a forward pass resolves overlaps downward, a backward pass
// pulls the stack back up if it ran past the bottom.
function spread(items: { y: number; h: number }[], top: number, bottom: number) {
  items.sort((a, b) => a.y - b.y);
  for (let i = 0; i < items.length; i++) {
    const it = items[i]!;
    const prev = items[i - 1];
    const min = prev ? prev.y + prev.h + LABEL_GAP : top;
    if (it.y < min) it.y = min;
  }
  for (let i = items.length - 1; i >= 0; i--) {
    const it = items[i]!;
    const next = items[i + 1];
    const max = next ? next.y - it.h - LABEL_GAP : bottom - it.h;
    if (it.y > max) it.y = max;
  }
}

function niceKm(target: number): number {
  const steps = [0.5, 1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500];
  return steps.reduce((best, s) => (Math.abs(s - target) < Math.abs(best - target) ? s : best), 1);
}

// Great-circle distance in km.
export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLng = (b.lng - a.lng) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

// Suggested driving order: the shortest open path visiting every stop once
// (straight-line distances). Circuits list stops in their canonical order —
// planetary, elemental — which can zig-zag across the map; pilgrims drive them
// geographically. Exact Held–Karp up to 12 stops (≤ ~600k steps, build time
// only), nearest-neighbour + 2-opt beyond. The path starts at whichever end has
// the lower official number, so it reads from "1" when it can. Returns indices.
export function drivingOrder(stops: { lat: number; lng: number }[]): number[] {
  const n = stops.length;
  if (n <= 2) return stops.map((_, i) => i);
  const d = stops.map((a) => stops.map((b) => haversineKm(a, b)));
  const dist = (i: number, j: number) => d[i]![j]!;
  let path: number[];
  if (n <= 12) {
    const FULL = 1 << n;
    const cost = new Float64Array(FULL * n).fill(Infinity);
    const prev = new Int8Array(FULL * n).fill(-1);
    for (let i = 0; i < n; i++) cost[(1 << i) * n + i] = 0;
    for (let mask = 1; mask < FULL; mask++) {
      for (let last = 0; last < n; last++) {
        const c = cost[mask * n + last]!;
        if (!(mask & (1 << last)) || c === Infinity) continue;
        for (let next = 0; next < n; next++) {
          if (mask & (1 << next)) continue;
          const m2 = mask | (1 << next);
          const c2 = c + dist(last, next);
          if (c2 < cost[m2 * n + next]!) {
            cost[m2 * n + next] = c2;
            prev[m2 * n + next] = last;
          }
        }
      }
    }
    let end = 0;
    for (let i = 1; i < n; i++) if (cost[(FULL - 1) * n + i]! < cost[(FULL - 1) * n + end]!) end = i;
    path = [];
    for (let mask = FULL - 1, cur = end; cur !== -1; ) {
      path.push(cur);
      const p = prev[mask * n + cur]!;
      mask &= ~(1 << cur);
      cur = p;
    }
    path.reverse();
  } else {
    path = [0];
    const left = new Set(stops.map((_, i) => i).slice(1));
    while (left.size) {
      const last = path[path.length - 1]!;
      let best = -1;
      for (const j of left) if (best < 0 || dist(last, j) < dist(last, best)) best = j;
      path.push(best);
      left.delete(best);
    }
    for (let improved = true; improved; ) {
      improved = false;
      for (let i = 0; i < n - 2; i++) {
        for (let k = i + 2; k < n; k++) {
          const a = path[i]!, b = path[i + 1]!, c = path[k]!, e = path[k + 1];
          const before = dist(a, b) + (e === undefined ? 0 : dist(c, e));
          const after = dist(a, c) + (e === undefined ? 0 : dist(b, e));
          if (after < before - 1e-9) {
            path.splice(i + 1, k - i, ...path.slice(i + 1, k + 1).reverse());
            improved = true;
          }
        }
      }
    }
  }
  return path[path.length - 1]! < path[0]! ? path.reverse() : path;
}

type Rect = { x: number; y: number; w: number; h: number };
const hit = (a: Rect, b: Rect, pad = 4) =>
  a.x < b.x + b.w + pad && b.x < a.x + a.w + pad && a.y < b.y + b.h + pad && b.y < a.y + a.h + pad;

export function layoutCircuitMap(stops: MapStop[], land: number[][][]): CircuitMapLayout {
  const valid = stops.filter((s) => Number.isFinite(s.lat) && Number.isFinite(s.lng));
  if (!valid.length) {
    return { width: MAP_WIDTH, height: 0, landPath: '', routePath: '', pins: [], labels: [], order: [], scale: { x: 0, y: 0, length: 0, label: '' } };
  }
  const lats = valid.map((s) => s.lat);
  const midLat = (Math.min(...lats) + Math.max(...lats)) / 2;
  const kx = Math.cos((midLat * Math.PI) / 180);
  // Equirectangular with a cos(lat) correction — accurate enough at circuit
  // scale (a few hundred km) and trivially invertible for the scale bar.
  const px = (lng: number) => lng * kx;
  const py = (lat: number) => -lat;
  const xs = valid.map((s) => px(s.lng));
  const ys = valid.map((s) => py(s.lat));
  // Minimum extent (~4 km) so shrines in one town don't collapse to a point.
  const MIN_SPAN = 0.04;
  const spanX = Math.max(Math.max(...xs) - Math.min(...xs), MIN_SPAN);
  const spanY = Math.max(Math.max(...ys) - Math.min(...ys), MIN_SPAN);
  const cx = (Math.max(...xs) + Math.min(...xs)) / 2;
  const cy = (Math.max(...ys) + Math.min(...ys)) / 2;
  const W = MAP_WIDTH;

  // Fit the stops into `box` (preserving geography), returning projectors.
  const fit = (box: Rect) => {
    const s = Math.min(box.w / spanX, box.h / spanY);
    const ox = box.x + box.w / 2 - cx * s;
    const oy = box.y + box.h / 2 - cy * s;
    return { s, toX: (lng: number) => px(lng) * s + ox, toY: (lat: number) => py(lat) * s + oy };
  };

  const measure = (st: MapStop, maxW: number) => {
    const textW = maxW - 2 * LABEL_PAD_X - ICON_W;
    const { lines, font } = wrapText(shortName(st.name), textW);
    const city = shortCity(st.city, textW);
    const w = Math.min(maxW, Math.max(...lines.map((l) => estimateTextWidth(l, font)), estimateTextWidth(city, CITY_FONT)) + 2 * LABEL_PAD_X + ICON_W + 4);
    const h = 16 + lines.length * LINE_H + 22;
    return { lines, nameFont: font, city, w: Math.round(w), h };
  };

  // Layout A — labels beside their pins (left or right by which half the pin
  // is in), with stops fitted to the middle of the frame. Reads most like an
  // illustrated map; used whenever no label collides with another or a pin.
  const tryNear = () => {
    const aspect = spanY / spanX;
    const H = Math.round(Math.min(900, Math.max(400, 300 * aspect + 140)));
    const f = fit({ x: 170, y: 70, w: W - 340, h: H - 130 });
    const pins = valid.map((st, i) => ({ n: i + 1, id: st.id, x: f.toX(st.lng), y: f.toY(st.lat) }));
    const sides: { left: (MapLabel & { px: number; py: number })[]; right: (MapLabel & { px: number; py: number })[] } = { left: [], right: [] };
    valid.forEach((st, i) => {
      const pin = pins[i]!;
      const m = measure(st, NEAR_MAX_W);
      const side = pin.x < W / 2 ? 'right' : 'left';
      const x = side === 'right' ? Math.min(pin.x + PIN_OFFSET, W - m.w - 6) : Math.max(pin.x - PIN_OFFSET - m.w, 6);
      sides[side].push({ n: pin.n, id: st.id, ...m, x, y: pin.y - 12 - m.h / 2, leader: null, px: pin.x, py: pin.y });
    });
    spread(sides.left, 8, H - 40);
    spread(sides.right, 8, H - 40);
    const labels = [...sides.left, ...sides.right];
    const pinHeads: Rect[] = pins.map((p) => ({ x: p.x - 16, y: p.y - 40, w: 32, h: 40 }));
    for (let i = 0; i < labels.length; i++) {
      const a = labels[i]!;
      for (let j = i + 1; j < labels.length; j++) if (hit(a, labels[j]!)) return null;
      for (const [k, head] of pinHeads.entries()) if (k !== a.n - 1 && hit(a, head, 2)) return null;
    }
    return { H, f, pins, labels: labels.map((l) => withLeader(l, l.x + l.w / 2 > l.px ? l.x : l.x + l.w)) };
  };

  // Layout B — a legend column on the right with dashed leaders to the pins,
  // for tight clusters (several shrines in one town) where labels can't sit
  // beside their pins without colliding.
  const columns = () => {
    const ms = valid.map((st) => measure(st, COL_W));
    const stackH = ms.reduce((a, m) => a + m.h + LABEL_GAP, 0);
    const H = Math.round(Math.min(1000, Math.max(420, stackH + 60)));
    const f = fit({ x: 40, y: 70, w: W - COL_W - 110, h: H - 130 });
    const pins = valid.map((st, i) => ({ n: i + 1, id: st.id, x: f.toX(st.lng), y: f.toY(st.lat) }));
    const x = W - COL_W - 10;
    const labels = valid.map((st, i) => {
      const pin = pins[i]!;
      return { n: pin.n, id: st.id, ...ms[i]!, w: COL_W, x, y: pin.y - 12 - ms[i]!.h / 2, leader: null, px: pin.x, py: pin.y };
    });
    spread(labels, 10, H - 40);
    return { H, f, pins, labels: labels.map((l) => withLeader(l, l.x)) };
  };

  const withLeader = (l: MapLabel & { px: number; py: number }, edgeX: number): MapLabel => {
    const { px: lx, py: ly, ...label } = l;
    const midY = label.y + label.h / 2;
    const pinY = ly - 24; // pin head centre
    const far = Math.abs(midY - pinY) > 8 || Math.abs(edgeX - lx) > PIN_OFFSET + 6;
    return {
      ...label,
      x: r1(label.x),
      y: r1(label.y),
      leader: far ? { x1: r1(lx), y1: r1(pinY), x2: r1(edgeX), y2: r1(midY) } : null,
    };
  };

  const chosen = tryNear() ?? columns();
  const { H, f } = chosen;
  const pins = chosen.pins.map((p) => ({ ...p, x: r1(p.x), y: r1(p.y) }));
  const labels = chosen.labels.sort((a, b) => a.n - b.n);

  // Land: project, clip to the frame (+margin so strokes don't show at edges),
  // and thin points closer than ~2.5 units for compact path data.
  const M = 4;
  const landPath = land
    .map((ring) => {
      const proj = ring.map((p): Pt => [f.toX(p[0] ?? 0), f.toY(p[1] ?? 0)]);
      const clipped = clipRing(proj, -M, -M, W + M, H + M);
      const kept: Pt[] = [];
      for (const p of clipped) {
        const last = kept[kept.length - 1];
        if (!last || Math.hypot(p[0] - last[0], p[1] - last[1]) > 2.5) kept.push(p);
      }
      if (kept.length < 3) return '';
      return `M${kept.map((p) => `${r1(p[0])} ${r1(p[1])}`).join('L')}Z`;
    })
    .filter(Boolean)
    .join('');

  // Scale bar ≈ a fifth of the frame width, rounded to a friendly distance.
  const kmPerUnit = KM_PER_DEG / f.s;
  const km = niceKm((W / 5) * kmPerUnit);
  const scale = { x: 20, y: H - 18, length: r1(km / kmPerUnit), label: `${km} km` };

  // The route line follows the suggested driving order; pins and labels keep
  // the circuit's official numbering.
  const order = drivingOrder(valid);
  const routePath = smoothPath(order.map((i) => pins[i]!));

  return { width: W, height: H, landPath, routePath, pins, labels, order: order.map((i) => i + 1), scale };
}
