// Generates modern responsive hero formats (AVIF + WebP) and a social-share
// (OpenGraph) image from the JPEG hero already in the media bucket, uploads
// them, and records the URLs in every locale's content so the <picture>
// sources and per-temple og:image light up — no app code changes needed.
//
// The design brief (D4) calls for "AVIF hero as the preloaded LCP element";
// this produces it. AVIF typically lands ~80% smaller than the source JPEG,
// which matters most on the 4G connections our Indian audience is on.
//
// Usage:
//   GOOGLE_APPLICATION_CREDENTIALS=/path/key.json \
//   MEDIA_BUCKET=temple-502523-media \
//   [HERO_ONLY=brihadeeswarar,meenakshi-madurai] [HERO_FORCE=1] \
//   node packages/content/scripts/gen-hero-variants.mjs
//
// Deps (already in @temple/content): sharp, @google-cloud/storage
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { Storage } from '@google-cloud/storage';

const root = dirname(fileURLToPath(import.meta.url));
const templesDir = join(root, '..', 'data', 'temples');

const BUCKET = process.env.MEDIA_BUCKET;
if (!BUCKET) throw new Error('Set MEDIA_BUCKET to the media Cloud Storage bucket name.');
const ONLY = process.env.HERO_ONLY ? new Set(process.env.HERO_ONLY.split(',')) : null;
const FORCE = !!process.env.HERO_FORCE;

const HERO_WIDTH = 1600; // enough for the LCP hero on high-DPI phones
const OG_W = 1200;
const OG_H = 630; // standard OpenGraph card
const IMMUTABLE = 'public, max-age=31536000, immutable';

const storage = new Storage();
const bucket = storage.bucket(BUCKET);

const publicUrl = (obj) => `https://storage.googleapis.com/${BUCKET}/${obj}`;

async function upload(obj, buf, contentType) {
  await bucket.file(obj).save(buf, {
    contentType,
    metadata: { cacheControl: IMMUTABLE },
    resumable: false,
  });
}

const localeDirs = readdirSync(templesDir).filter((d) =>
  statSync(join(templesDir, d)).isDirectory()
);

// Locale-agnostic temple id list from the English catalog.
const ids = readdirSync(join(templesDir, 'en'))
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.replace(/\.json$/, ''));

let done = 0;
let skipped = 0;
for (const id of ids) {
  if (ONLY && !ONLY.has(id)) continue;

  // The hero src/sources/og are language-agnostic, so English drives the check.
  const enDoc = JSON.parse(readFileSync(join(templesDir, 'en', `${id}.json`), 'utf8'));
  const src = enDoc.hero?.src;
  if (!src || !/^https?:\/\//.test(src)) {
    console.log(`· ${id} (no real hero photo — skipping)`);
    skipped++;
    continue;
  }

  const avifObj = `heroes/${id}.avif`;
  const webpObj = `heroes/${id}.webp`;
  const ogObj = `og/${id}.jpg`;

  if (
    !FORCE &&
    enDoc.hero?.sources?.avif === publicUrl(avifObj) &&
    enDoc.hero?.sources?.webp === publicUrl(webpObj) &&
    enDoc.hero?.og === publicUrl(ogObj)
  ) {
    console.log(`· ${id} (variants already present — skipping)`);
    skipped++;
    continue;
  }

  // Pull the source hero straight from the bucket (public object, but the
  // Storage client authenticates so it also works on private buckets).
  const [orig] = await bucket.file(`heroes/${id}.jpg`).download();
  const meta = await sharp(orig).metadata();
  const width = Math.min(HERO_WIDTH, meta.width || HERO_WIDTH);

  const avif = await sharp(orig)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .avif({ quality: 50 })
    .toBuffer();
  const webp = await sharp(orig)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 72 })
    .toBuffer();
  // OpenGraph card: a saliency-cropped 1200×630 of the hero.
  const og = await sharp(orig)
    .rotate()
    .resize({ width: OG_W, height: OG_H, fit: 'cover', position: 'attention' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();

  await upload(avifObj, avif, 'image/avif');
  await upload(webpObj, webp, 'image/webp');
  await upload(ogObj, og, 'image/jpeg');

  // Write the URLs into every locale copy; hero.alt (per-locale) is untouched.
  for (const locale of localeDirs) {
    const p = join(templesDir, locale, `${id}.json`);
    let doc;
    try {
      doc = JSON.parse(readFileSync(p, 'utf8'));
    } catch {
      continue;
    }
    if (!doc.hero) continue;
    doc.hero.sources = { avif: publicUrl(avifObj), webp: publicUrl(webpObj) };
    doc.hero.og = publicUrl(ogObj);
    writeFileSync(p, JSON.stringify(doc, null, 2) + '\n');
  }

  done++;
  console.log(
    `✓ ${id}  avif ${(avif.length / 1024).toFixed(0)}KB · webp ${(webp.length / 1024).toFixed(0)}KB · og ${(og.length / 1024).toFixed(0)}KB`
  );
}

console.log(
  `\ngen-hero-variants: ${done} generated, ${skipped} skipped → gs://${BUCKET}/heroes,og/ and updated content.`
);
