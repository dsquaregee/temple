// Generates a decorative placeholder hero SVG per temple, tinted by the same
// deterministic per-temple color used across the apps (packages/core/media.ts).
// These are honest, abstract architectural placeholders — NOT photographs —
// used until licensed exterior/gopuram photography is available. When real
// images arrive, set `hero` on the temple content and this is bypassed.
import { readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const templesDir = join(root, '..', '..', '..', 'packages', 'content', 'data', 'temples', 'en');
const outDir = join(root, '..', 'public', 'heroes');

// Keep in sync with packages/core/src/media.ts.
const HERO_PALETTE = [
  '#8A3324', '#7A5230', '#6B4A2B', '#5C3A2E', '#7C5E1E',
  '#4E5A34', '#3F5661', '#5A3D5C', '#8A4B08', '#495B7A',
];
function hash(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}
const colorFor = (id) => HERO_PALETTE[hash(id) % HERO_PALETTE.length];
const accentFor = (id) => HERO_PALETTE[(hash(id) + 4) % HERO_PALETTE.length];

// A layered gopuram silhouette: diminishing tiers + a finial, drawn in a
// translucent light tone over a two-stop gradient.
function heroSvg(id) {
  const base = colorFor(id);
  const accent = accentFor(id);
  const W = 1200;
  const H = 480;
  const tiers = [];
  const baseW = 520;
  const baseH = 46;
  const cx = W / 2;
  let y = H - 8;
  for (let i = 0; i < 6; i++) {
    const w = baseW - i * 74;
    const x = cx - w / 2;
    tiers.push(
      `<rect x="${x.toFixed(0)}" y="${(y - baseH).toFixed(0)}" width="${w}" height="${baseH}" rx="6"/>`
    );
    y -= baseH + 6;
  }
  // Crowning triangle + finial.
  const topW = baseW - 6 * 74;
  tiers.push(
    `<path d="M ${cx} ${(y - 54).toFixed(0)} L ${(cx + topW / 2).toFixed(0)} ${y.toFixed(0)} L ${(cx - topW / 2).toFixed(0)} ${y.toFixed(0)} Z"/>`
  );
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Decorative temple silhouette">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${base}"/>
      <stop offset="1" stop-color="${accent}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <g fill="#F2EAD9" fill-opacity="0.16">${tiers.join('')}</g>
  <circle cx="${cx}" cy="${(y - 66).toFixed(0)}" r="9" fill="#F2EAD9" fill-opacity="0.28"/>
</svg>
`;
}

mkdirSync(outDir, { recursive: true });
const ids = readdirSync(templesDir)
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.replace(/\.json$/, ''));
for (const id of ids) {
  writeFileSync(join(outDir, `${id}.svg`), heroSvg(id));
}
console.log(`gen-heroes: wrote ${ids.length} placeholder hero SVGs to public/heroes/`);
