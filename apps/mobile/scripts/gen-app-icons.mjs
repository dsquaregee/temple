// Rasterises the Expo/Android app icons from the brand SVGs into the PNGs
// app.json references. Committed build artifacts, so a plain checkout + EAS
// build needs no image toolchain. Re-run after editing any source SVG:
//
//   node apps/mobile/scripts/gen-app-icons.mjs
//
// Sources:
//   apps/web/public/icon.svg               → icon.png            (full brand square)
//   apps/mobile/assets/adaptive-foreground.svg → adaptive-icon.png (Android foreground, transparent)
//   apps/mobile/assets/splash-logo.svg     → splash.png          (splash mark, transparent)
//
// Deps: sharp (already in @temple/content). Run from repo root or anywhere.
import { readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const here = dirname(fileURLToPath(import.meta.url));
const mobileDir = join(here, '..');
const assets = join(mobileDir, 'assets');
const webPublic = join(mobileDir, '..', 'web', 'public');

// sharp lives in @temple/content's dependency tree.
const require = createRequire(join(mobileDir, '..', '..', 'packages', 'content', 'package.json'));
const sharp = require('sharp');

const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };
const jobs = [
  // Full brand icon → iOS/legacy launcher + Play store icon. Flattened onto the
  // brand maroon so it is a SOLID square with no transparent corners (stores and
  // iOS reject alpha in the icon; launchers apply their own rounding/masking).
  { src: join(webPublic, 'icon.svg'), out: join(assets, 'icon.png'), size: 1024, flatten: '#b3411f' },
  // Android adaptive foreground: transparent; OS supplies the maroon background.
  { src: join(assets, 'adaptive-foreground.svg'), out: join(assets, 'adaptive-icon.png'), size: 1024 },
  // Splash mark: transparent, composited over the cream splash background.
  { src: join(assets, 'splash-logo.svg'), out: join(assets, 'splash.png'), size: 1024 },
];

for (const { src, out, size, flatten } of jobs) {
  const svg = readFileSync(src);
  let img = sharp(svg, { density: 512 }).resize(size, size, { fit: 'contain', background: TRANSPARENT });
  if (flatten) img = img.flatten({ background: flatten });
  await img.png({ compressionLevel: 9 }).toFile(out);
  console.log(`✓ ${out.replace(mobileDir + '/', '')} (${statSync(out).size} bytes)`);
}
