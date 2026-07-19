// Rasterises the app icon (apps/web/public/icon.svg) into the PNG sizes the PWA
// manifest and app stores expect. The SVG stays the source of truth; these are
// committed build artifacts so a plain `pnpm build:web` needs no image toolchain.
//
// Usage: node packages/content/scripts/gen-icons.mjs
//
// Deps (already in @temple/content): sharp
import { readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = dirname(fileURLToPath(import.meta.url));
const publicDir = join(root, '..', '..', '..', 'apps', 'web', 'public');
const svg = readFileSync(join(publicDir, 'icon.svg'));

const SIZES = [192, 512];

for (const size of SIZES) {
  const out = join(publicDir, `icon-${size}.png`);
  // High density so the vector rasterises crisply before the downscale.
  await sharp(svg, { density: 384 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log(`✓ icon-${size}.png (${statSync(out).size} bytes)`);
}
