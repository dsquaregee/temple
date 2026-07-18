// Builds narrated "Ken Burns" videos from REAL, CC-licensed exterior photos on
// Wikimedia Commons + the TTS narration already in the media bucket.
//
// Pipeline per temple:
//   1. Query Commons for candidate photos.
//   2. Keep only high-quality, freely-licensed real photos (min megapixels,
//      landscape, JPEG/PNG, CC/PD license; skip maps/plans/diagrams). If fewer
//      than MIN_PHOTOS qualify, SKIP the temple (no low-quality filler).
//   3. Download the best PHOTOS_PER, record attribution.
//   4. (unless dry-run) render a 1280x720 slideshow with slow zoom, muxed with
//      the temple's narration audio, per locale; upload MP4s; set video (+hero).
//
// Usage:
//   GOOGLE_APPLICATION_CREDENTIALS=/path/key.json MEDIA_BUCKET=temple-502523-media \
//   [VIDEO_DRYRUN=1] [VIDEO_LOCALES=en,hi] [PHOTOS_PER=6] [MIN_PHOTOS=3] [MIN_MP=2] \
//   node packages/content/scripts/gen-video.mjs
//
// Requires: ffmpeg on PATH; network access to commons.wikimedia.org +
// upload.wikimedia.org; deps @google-cloud/storage.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { Storage } from '@google-cloud/storage';

const root = dirname(fileURLToPath(import.meta.url));
const dataDir = join(root, '..', 'data');
const repoRoot = join(root, '..', '..', '..');
const work = join(repoRoot, '.media-tmp');

const DRY = !!process.env.VIDEO_DRYRUN;
const BUCKET = process.env.MEDIA_BUCKET;
if (!DRY && !BUCKET) throw new Error('Set MEDIA_BUCKET (or VIDEO_DRYRUN=1 for a photo audit).');
const PHOTOS_PER = Number(process.env.PHOTOS_PER || 6);
const MIN_PHOTOS = Number(process.env.MIN_PHOTOS || 3);
const MIN_MP = Number(process.env.MIN_MP || 2);
const LOCALES = (process.env.VIDEO_LOCALES || 'en,ta,te,kn,ml,hi').split(',');
const UA = 'temple-app/1.0 (https://temples.dsquaregee.com; support@dsquaregee.com)';

// Commons search fallbacks for temples whose catalog name differs from the
// spelling photographers use on Commons (verified 2026-07: each fallback
// yields 20+ qualifying photos where the primary query finds ≤1).
const SEARCH_FALLBACKS = {
  arunachaleswarar: ['Annamalaiyar Temple', 'Arunachalesvara Temple Tiruvannamalai'],
  jambukeswarar: ['Jambukeswarar Temple', 'Thiruvanaikaval temple'],
};

// Editorially curated photo sets (exact Commons titles, hero first). The
// resolution-ranked search kept stereo-pair scans, archival B&W photos, a
// datestamped frame, and one wrong-temple shot — every title below was
// reviewed by eye (2026-07 audit, docs/media/photo-audit.md) and verified to
// depict the right temple. Temples not listed keep automatic selection.
const CURATED = {
  airavatesvara: [
    'File:Darasuram - Airavatesvara Temple.jpg',
    'File:Darasuram-Airavatesvara Temple-WUS02952.jpg',
    'File:Darasuram-Airavatesvara Temple-WUS02946.jpg',
    'File:Darasuram-Airavatesvara Temple-WUS02953.jpg',
    'File:Darasuram-Airavatesvara Temple-WUS03005.jpg',
    'File:Darasuram-Airavatesvara Temple-WUS02983.jpg',
  ],
  arunachaleswarar: [
    'File:Thiruvannamalai, Arunachalesvara Temple, Tower, India.jpg',
    'File:Arunachalesvara Temple - Annamalaiyar Temple Tiruvannamalai ttkcvrvb122k23iph (444).jpg',
    'File:Thiruvannamalai, Arunachalesvara Temple, Gopuram, India.jpg',
    'File:Arunachalesvara Temple - Annamalaiyar Temple Tiruvannamalai ttkcvrvb122k23iph (445).jpg',
    'File:Arunachalesvara(Annamalaiyar) Temple Thiruvannamalai 3.jpg',
    'File:Arunachalesvara Temple - Annamalaiyar Temple Tiruvannamalai ttkcvrvb122k23iph (377).jpg',
  ],
  brihadeeswarar: [
    'File:Brihadisvara Temple during Maha Shivaratri-WUS03611 (edit).jpg',
    'File:Brihadeeswarar Temple, Thanjavur.JPG',
    'File:Thanjavur Brihadeeswarar Temple.jpg',
    'File:Brihadeeswarar Temple Thanjavur.jpg',
    'File:Brihadeeswarar Temple thanjavur.jpg',
    'File:Brihadeeswarar temple evening, Thanjavur, Tamilnadu.jpg',
  ],
  ekambareswarar: [
    'File:The Raja Gopuram ( Temple Tower ) of Ekambareshwara Temple, Kanchipuram.jpg',
    'File:Ekambareswarar Temple, Kanchipuram temple tank 2K22TNKAN (3).jpg',
    'File:Ekambareswarar Temple, Kanchipuram temple tank 2K22TNKAN (1).jpg',
    'File:Ekambareswarar Temple, Kanchipuram temple tank 2K22TNKAN (6).jpg',
    'File:Ekambareswarar Temple, Kanchipuram inside 2K22TNKAN (37).jpg',
    'File:Ekambareswarar Temple, Kanchipuram inside 2K22TNKAN (38).jpg',
  ],
  jambukeswarar: [
    'File:East tower of Thiruvanaikaval Jambukeswarar temple.jpg',
    'File:Jambukeswarar Temple surroundings, Thiruvanaikaval ttkcvrvb122k23pxl (13).jpg',
    'File:Jambukeswarar Temple surroundings, Thiruvanaikaval ttkcvrvb122k23pxl (24).jpg',
    'File:Jambukeswarar Temple surroundings, Thiruvanaikaval ttkcvrvb122k23pxl (18).jpg',
    'File:Jambukeswarar Temple surroundings, Thiruvanaikaval ttkcvrvb122k23pxl (22).jpg',
    'File:Jambukeswarar Temple surroundings, Thiruvanaikaval ttkcvrvb122k23pxl (19).jpg',
  ],
  'nataraja-chidambaram': [
    'File:A view of Nataraja Shiva Temple at Chidambaram, Tamil Nadu (11).jpg',
    'File:Chidambaram-Thillai Nataraja Temple-WUS02374.jpg',
    'File:Chidambaram-Thillai Nataraja Temple-WUS02367.jpg',
    'File:Chidambaram-Thillai Nataraja Temple-WUS02424.jpg',
    'File:Chidambaram-Thillai Nataraja Temple-WUS02363.jpg',
    'File:Chidambaram-Thillai Nataraja Temple-WUS02380.jpg',
  ],
  'ramanathaswamy-rameswaram': [
    'File:Ramanathaswamy Temple corridor 03.jpg',
    'File:Ramanathaswamy Temple corridor 04.jpg',
    'File:Thousand pillar prakaram.JPG',
    'File:Thousand pillar hall rameswaram.tamilnadu - panoramio.jpg',
    'File:Ramanathaswamy Temple corridor 01.jpg',
    'File:Ramanathaswamy Temple, Rameswaram.jpg',
  ],
};

const EXCLUDE = /(\bmap\b|plan|diagram|sketch|drawing|engraving|lithograph|inscription|logo|seal|coin|chart|graph|\.svg|panorama.*stitch)/i;
const OK_LICENSE = /(cc[ -]?by([ -]sa)?|cc0|public domain|pd-|no restrictions)/i;
const BAD_LICENSE = /(non[- ]?free|fair use|all rights reserved|copyright)/i;

const stripHtml = (s) => (s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

async function commons(params) {
  const url = 'https://commons.wikimedia.org/w/api.php?' +
    new URLSearchParams({ format: 'json', origin: '*', ...params });
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`Commons API ${res.status}`);
  return res.json();
}

async function candidates(temple) {
  const curated = CURATED[temple.id];
  if (curated) {
    const data = await commons({
      action: 'query',
      titles: curated.join('|'),
      prop: 'imageinfo',
      iiprop: 'url|size|mime|extmetadata',
      iiurlwidth: '1920',
    });
    const byTitle = new Map();
    for (const p of Object.values(data?.query?.pages ?? {})) {
      const info = p.imageinfo?.[0];
      if (!info) continue;
      const meta = info.extmetadata || {};
      const lic = stripHtml(meta.LicenseShortName?.value) + ' ' + stripHtml(meta.License?.value) + ' ' + stripHtml(meta.UsageTerms?.value);
      if (BAD_LICENSE.test(lic) || !OK_LICENSE.test(lic)) continue;
      const artist = stripHtml(meta.Artist?.value) || 'Wikimedia Commons';
      const licName = stripHtml(meta.LicenseShortName?.value) || 'CC';
      byTitle.set(p.title, {
        title: p.title,
        mp: +((info.width * info.height) / 1e6).toFixed(1),
        thumb: info.thumburl || info.url,
        full: info.url,
        credit: `${artist} / Wikimedia Commons (${licName})`,
      });
    }
    // Preserve the curated (hero-first) order, not API response order.
    return curated.map((t) => byTitle.get(t)).filter(Boolean).slice(0, PHOTOS_PER);
  }

  const queries = [
    `${temple.name} ${temple.location?.city ?? ''}`.trim(),
    ...(SEARCH_FALLBACKS[temple.id] ?? []),
  ];
  const byTitle = new Map();
  for (const query of queries) {
    for (const c of await searchCommons(query)) {
      if (!byTitle.has(c.title)) byTitle.set(c.title, c);
    }
    if (byTitle.size >= PHOTOS_PER) break; // enough — skip remaining fallbacks
  }
  return [...byTitle.values()].sort((a, b) => b.mp - a.mp).slice(0, PHOTOS_PER);
}

async function searchCommons(query) {
  const data = await commons({
    action: 'query',
    generator: 'search',
    gsrsearch: `${query} filetype:bitmap`,
    gsrnamespace: '6',
    gsrlimit: '50',
    prop: 'imageinfo',
    iiprop: 'url|size|mime|extmetadata',
    iiurlwidth: '1920',
  });
  const pages = Object.values(data?.query?.pages ?? {});
  const out = [];
  for (const p of pages) {
    const info = p.imageinfo?.[0];
    if (!info) continue;
    const title = p.title || '';
    if (EXCLUDE.test(title)) continue;
    if (!/^image\/(jpeg|png)$/.test(info.mime || '')) continue;
    const mp = (info.width * info.height) / 1e6;
    if (mp < MIN_MP) continue;
    if (info.width < info.height * 1.15) continue; // landscape only
    const meta = info.extmetadata || {};
    const lic = stripHtml(meta.LicenseShortName?.value) + ' ' + stripHtml(meta.License?.value) + ' ' + stripHtml(meta.UsageTerms?.value);
    if (BAD_LICENSE.test(lic) || !OK_LICENSE.test(lic)) continue;
    const artist = stripHtml(meta.Artist?.value) || 'Wikimedia Commons';
    const licName = stripHtml(meta.LicenseShortName?.value) || 'CC';
    out.push({
      title,
      mp: +mp.toFixed(1),
      thumb: info.thumburl || info.url,
      full: info.url,
      credit: `${artist} / Wikimedia Commons (${licName})`,
    });
  }
  return out;
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`download ${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(dest, buf);
}

function probeDuration(mediaPath) {
  const out = execFileSync('ffprobe', [
    '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', mediaPath,
  ]);
  return parseFloat(String(out));
}

function renderVideo(imgs, audioPath, outPath, audioDur) {
  const n = imgs.length;
  const per = Math.max(3, Math.ceil(audioDur / n)); // seconds per photo
  const frames = per * 25;
  // Each image is a single input frame; zoompan expands it into a `frames`-long
  // zooming clip (a looped input here would multiply frames×d and the
  // slideshow would never advance past the first photo).
  const inputs = imgs.flatMap((f) => ['-i', f]);
  const filters = imgs
    .map(
      (_, i) =>
        `[${i}:v]scale=1600:900:force_original_aspect_ratio=increase,crop=1600:900,zoompan=z='min(zoom+0.0006,1.15)':d=${frames}:s=1280x720:fps=25,setsar=1[v${i}]`
    )
    .join(';');
  const concat = imgs.map((_, i) => `[v${i}]`).join('') + `concat=n=${n}:v=1:a=0[v]`;
  execFileSync(
    'ffmpeg',
    [
      '-y', ...inputs, '-i', audioPath,
      '-filter_complex', `${filters};${concat}`,
      '-map', '[v]', '-map', `${n}:a`,
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'medium', '-crf', '23',
      '-c:a', 'aac', '-b:a', '128k', '-shortest', '-movflags', '+faststart',
      outPath,
    ],
    { stdio: 'inherit' }
  );
}

mkdirSync(work, { recursive: true });
const storage = BUCKET ? new Storage() : null;
const bucket = storage ? storage.bucket(BUCKET) : null;

// Ensure the bucket exists with public-read objects (same approach as
// gen-audio.mjs: IAM binding, since new buckets default to uniform
// bucket-level access where ACL makePublic() is unavailable).
if (bucket) {
  const [exists] = await bucket.exists();
  if (!exists) {
    const location = process.env.MEDIA_BUCKET_LOCATION || 'asia-south1';
    console.log(`creating bucket ${BUCKET} in ${location} ...`);
    await storage.createBucket(BUCKET, { location });
  }
  const [policy] = await bucket.iam.getPolicy({ requestedPolicyVersion: 3 });
  policy.bindings = policy.bindings || [];
  const isPublic = policy.bindings.some(
    (b) => b.role === 'roles/storage.objectViewer' && (b.members || []).includes('allUsers')
  );
  if (!isPublic) {
    policy.bindings.push({ role: 'roles/storage.objectViewer', members: ['allUsers'] });
    await bucket.iam.setPolicy(policy);
  }
  console.log(`bucket ${BUCKET} is public (allUsers: objectViewer)`);
}

const enDir = join(dataDir, 'temples', 'en');
const ONLY_IDS = process.env.VIDEO_ONLY ? new Set(process.env.VIDEO_ONLY.split(',')) : null;
const SKIP_DONE = !!process.env.VIDEO_RESUME; // skip temples whose en doc already has video
const ids = readdirSync(enDir)
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.replace(/\.json$/, ''))
  .filter((id) => !ONLY_IDS || ONLY_IDS.has(id));

const report = [];
for (const id of ids) {
  const en = JSON.parse(readFileSync(join(enDir, `${id}.json`), 'utf8'));
  if (SKIP_DONE && en.video?.url) {
    console.log(`· ${id}: video already set — resume skip`);
    report.push({ id, picked: '—', skipped: false });
    continue;
  }
  let picks;
  try {
    picks = await candidates(en);
  } catch (e) {
    console.warn(`! ${id}: Commons query failed — ${e.message}`);
    report.push({ id, picked: 0, skipped: true, reason: 'query failed' });
    continue;
  }
  if (picks.length < MIN_PHOTOS) {
    console.log(`· ${id}: only ${picks.length} high-quality photo(s) (< ${MIN_PHOTOS}) — SKIPPED`);
    report.push({ id, picked: picks.length, skipped: true, reason: 'insufficient quality photos' });
    continue;
  }
  console.log(`✓ ${id}: ${picks.length} photos (${picks.map((p) => p.mp + 'MP').join(', ')})`);
  report.push({ id, picked: picks.length, skipped: false, photos: picks.map((p) => ({ title: p.title, mp: p.mp, credit: p.credit })) });
  if (DRY) continue;

  // One temple failing (bad photo, ffmpeg error, upload hiccup) must not kill
  // the whole run — mark it in the report and move on.
  try {
    const tdir = join(work, id);
    mkdirSync(tdir, { recursive: true });
    const imgPaths = [];
    for (let i = 0; i < picks.length; i++) {
      const dest = join(tdir, `${i}.jpg`);
      await download(picks[i].thumb, dest);
      imgPaths.push(dest);
    }
    const credit = [...new Set(picks.map((p) => p.credit))].join(' · ');

    // Upload the top photo as the real hero image (language-agnostic).
    const heroObj = `heroes/${id}.jpg`;
    await bucket.file(heroObj).save(readFileSync(imgPaths[0]), {
      contentType: 'image/jpeg',
      metadata: { cacheControl: 'public, max-age=31536000, immutable' },
      resumable: false,
    });
    const heroUrl = `https://storage.googleapis.com/${BUCKET}/${heroObj}`;

    for (const locale of LOCALES) {
      const jsonPath = join(dataDir, 'temples', locale, `${id}.json`);
      if (!existsSync(jsonPath)) continue;
      const doc = JSON.parse(readFileSync(jsonPath, 'utf8'));
      const audioUrl = doc.audio?.storyUrl;
      if (!audioUrl) {
        console.warn(`  ! ${locale}/${id}: no narration audio — locale skipped`);
        continue;
      }
      const audioPath = join(tdir, `audio-${locale}.mp3`);
      await download(audioUrl, audioPath);
      // Real duration from the file — the stored durationSec is an estimate.
      const audioDur = Math.round(probeDuration(audioPath)) || doc.audio?.durationSec || 90;
      const out = join(tdir, `${locale}.mp4`);
      renderVideo(imgPaths, audioPath, out, audioDur);

      const obj = `video/${locale}/${id}.mp4`;
      await bucket.file(obj).save(readFileSync(out), {
        contentType: 'video/mp4',
        metadata: { cacheControl: 'public, max-age=31536000, immutable' },
        resumable: false,
      });
      doc.video = {
        url: `https://storage.googleapis.com/${BUCKET}/${obj}`,
        posterUrl: heroUrl,
        durationSec: audioDur,
        credit,
      };
      doc.hero = { src: heroUrl, color: doc.hero?.color || '#5C3A2E', alt: `${doc.name}`, credit };
      writeFileSync(jsonPath, JSON.stringify(doc, null, 2) + '\n');
      console.log(`  → ${locale}/${id}.mp4 uploaded`);
    }
  } catch (e) {
    console.warn(`! ${id}: FAILED — ${String(e.message || e).split('\n')[0]}`);
    const r = report[report.length - 1];
    r.skipped = true;
    r.reason = 'render/upload failed';
  }
}

// Write an audit report.
const outDir = join(repoRoot, 'docs', 'media');
mkdirSync(outDir, { recursive: true });
let md = `# Temple photo/video audit (Wikimedia Commons)\n\n`;
md += `Quality gate: JPEG/PNG, ≥ ${MIN_MP} MP, landscape, CC/PD license; ≥ ${MIN_PHOTOS} photos required or the temple is skipped.\n\n`;
md += `| Temple | Photos kept | Status |\n|---|---|---|\n`;
for (const r of report) md += `| ${r.id} | ${r.picked} | ${r.skipped ? '⚠️ skipped ('+r.reason+')' : '✅ included'} |\n`;
writeFileSync(join(outDir, 'photo-audit.md'), md);

const kept = report.filter((r) => !r.skipped).length;
console.log(`\n${DRY ? '[dry-run] ' : ''}${kept}/${ids.length} temples have qualifying photos. Report → docs/media/photo-audit.md`);
