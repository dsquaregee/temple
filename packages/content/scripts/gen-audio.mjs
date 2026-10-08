// Generates narrated audio for every temple × locale with Google Cloud
// Text-to-Speech, uploads the MP3s to a Cloud Storage bucket, and writes each
// temple's `audio` field ({ storyUrl, durationSec }) so the Listen player
// lights up. Run after enabling the Text-to-Speech API on the project.
//
// Usage:
//   GOOGLE_APPLICATION_CREDENTIALS=/path/to/sa-key.json \
//   AUDIO_BUCKET=temples2-audio \
//   [AUDIO_LIMIT=1] [AUDIO_LOCALES=en,hi] [AUDIO_EN_VOICE=en-IN-Chirp3-HD-Kore] \
//   node packages/content/scripts/gen-audio.mjs
//
// Sample mode — AUDIO_SAMPLE=brihadeeswarar,ekambareswarar renders each listed
// temple's English narration once per SAMPLE_VARIANTS entry (voice × lexicon on/
// off) to audio/samples/en/<id>/<variant>.mp3 and prints the URLs. It writes no
// content, so nothing changes on the site; it's for comparing voices by ear.
//
// Deps (install once): pnpm --filter @temple/content add -D \
//   @google-cloud/text-to-speech @google-cloud/storage
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import textToSpeech from '@google-cloud/text-to-speech';
import { Storage } from '@google-cloud/storage';

const root = dirname(fileURLToPath(import.meta.url));
const templesDir = join(root, '..', 'data', 'temples');

const BUCKET = process.env.AUDIO_BUCKET;
if (!BUCKET) throw new Error('Set AUDIO_BUCKET to the target Cloud Storage bucket name.');
// Public URL the app serves from. Objects are uploaded to the GCS bucket above
// (the generator) but served from Cloudflare R2 (same object keys), which is the
// primary CDN origin ($0 egress, survives a GCP lock). Override via env if the
// serving host changes. See docs/migrate-project.md (R2 primary origin).
const PUBLIC_BASE = (process.env.AUDIO_PUBLIC_BASE || 'https://audio.dsquaregee.com').replace(/\/$/, '');
const LIMIT = process.env.AUDIO_LIMIT ? Number(process.env.AUDIO_LIMIT) : Infinity;
const ONLY = process.env.AUDIO_LOCALES ? process.env.AUDIO_LOCALES.split(',') : null;
const SAMPLE = process.env.AUDIO_SAMPLE ? process.env.AUDIO_SAMPLE.split(',').map((s) => s.trim()).filter(Boolean) : null;

// Neural2 where available, else Wavenet/Standard. Override per project needs.
const VOICES = {
  en: { languageCode: 'en-IN', name: process.env.AUDIO_EN_VOICE || 'en-IN-Neural2-A' },
  hi: { languageCode: 'hi-IN', name: 'hi-IN-Neural2-A' },
  ta: { languageCode: 'ta-IN', name: 'ta-IN-Wavenet-A' },
  te: { languageCode: 'te-IN', name: 'te-IN-Standard-A' },
  kn: { languageCode: 'kn-IN', name: 'kn-IN-Wavenet-A' },
  ml: { languageCode: 'ml-IN', name: 'ml-IN-Wavenet-A' },
};
const LOCALES = (ONLY ?? Object.keys(VOICES)).filter((l) => VOICES[l]);

// Voices compared in sample mode: today's voice as the baseline, then the newer
// Chirp 3 HD Indian-English voices without and with the pronunciation lexicon.
const SAMPLE_VARIANTS = [
  { key: 'current-neural2', name: 'en-IN-Neural2-A', lexicon: false },
  { key: 'chirp3-kore', name: 'en-IN-Chirp3-HD-Kore', lexicon: false },
  { key: 'chirp3-kore-lexicon', name: 'en-IN-Chirp3-HD-Kore', lexicon: true },
  { key: 'chirp3-charon-lexicon', name: 'en-IN-Chirp3-HD-Charon', lexicon: true },
];

// English pronunciation lexicon (data/pronunciation/en.json): Sanskrit/Tamil
// words → phonetic respellings, substituted into the TTS input only. Longest
// keys first so compounds win over their parts; plurals/possessives keep their
// suffix because the match is on the bare word.
const lexiconPath = join(root, '..', 'data', 'pronunciation', 'en.json');
const LEXICON = Object.entries(JSON.parse(readFileSync(lexiconPath, 'utf8')).words)
  .sort((a, b) => b[0].length - a[0].length)
  .map(([word, say]) => [new RegExp(`\\b${word}(?=s?\\b)`, 'gi'), say]);
const applyLexicon = (text) => LEXICON.reduce((t, [re, say]) => t.replace(re, say), text);

const tts = new textToSpeech.TextToSpeechClient();
const storage = new Storage();
const bucket = storage.bucket(BUCKET);

// Ensure the target bucket exists and its objects are publicly readable (so the
// <audio> player can fetch them). Uses bucket-level IAM, which works with the
// uniform bucket-level access that new buckets default to.
async function ensureBucket() {
  const [exists] = await bucket.exists();
  if (!exists) {
    const location = process.env.AUDIO_BUCKET_LOCATION || 'asia-south1';
    console.log(`creating bucket ${BUCKET} in ${location} ...`);
    await storage.createBucket(BUCKET, { location });
  }
  // New buckets default to uniform bucket-level access, so make objects public
  // via an IAM binding (the ACL-based makePublic() does not work under UBLA).
  try {
    const [policy] = await bucket.iam.getPolicy({ requestedPolicyVersion: 3 });
    policy.bindings = policy.bindings || [];
    const has = policy.bindings.some(
      (b) => b.role === 'roles/storage.objectViewer' && (b.members || []).includes('allUsers')
    );
    if (!has) {
      policy.bindings.push({ role: 'roles/storage.objectViewer', members: ['allUsers'] });
      await bucket.iam.setPolicy(policy);
    }
    console.log(`bucket ${BUCKET} is public (allUsers: objectViewer)`);
  } catch (e) {
    console.warn(`  ! could not set bucket public via IAM: ${e.message.split('\n')[0]}`);
    console.warn('    grant allUsers "Storage Object Viewer" on the bucket manually.');
  }
}

const byteLen = (s) => Buffer.byteLength(s, 'utf8');

// Split into request-sized chunks (<5000 bytes is the API limit) on sentence
// boundaries (Latin ., Devanagari danda ।, and CJK/Indic punctuation).
function chunk(text, maxBytes = 4200) {
  const parts = text.split(/(?<=[.!?।॥])\s+/).filter(Boolean);
  const out = [];
  let cur = '';
  for (const p of parts) {
    if (cur && byteLen(cur) + byteLen(p) + 1 > maxBytes) {
      out.push(cur);
      cur = '';
    }
    // A single sentence longer than the limit: hard-split on spaces.
    if (byteLen(p) > maxBytes) {
      const words = p.split(/\s+/);
      for (const w of words) {
        if (byteLen(cur) + byteLen(w) + 1 > maxBytes) { out.push(cur); cur = ''; }
        cur += (cur ? ' ' : '') + w;
      }
    } else {
      cur += (cur ? ' ' : '') + p;
    }
  }
  if (cur) out.push(cur);
  return out;
}

function narration(doc) {
  const s = doc.sections || {};
  return [
    doc.name, doc.summary, s.history, s.architecture, s.legends,
    s.festivals, s.experience,
  ].filter(Boolean).join('\n\n');
}

async function synth(text, locale, voice = VOICES[locale], { strict = false } = {}) {
  const v = voice;
  let audioConfig = { audioEncoding: 'MP3', speakingRate: 0.98 };
  const buffers = [];
  for (const c of chunk(text)) {
    let res;
    const request = () =>
      tts.synthesizeSpeech({
        input: { text: c },
        voice: { languageCode: v.languageCode, name: v.name },
        audioConfig,
      });
    try {
      [res] = await request();
    } catch (e) {
      // Some voice families reject speakingRate; retry the same voice at the
      // default rate before giving up on it.
      try {
        audioConfig = { audioEncoding: 'MP3' };
        [res] = await request();
        console.warn(`  ! ${v.name}: speakingRate rejected, using default rate`);
        buffers.push(Buffer.from(res.audioContent, 'base64'));
        continue;
      } catch {
        // fall through
      }
      // Sample mode compares named voices, so a silent substitution would
      // mislabel the sample — fail loudly instead.
      if (strict) throw new Error(`${v.name}: ${e.message.split('\n')[0]}`);
      console.warn(`  ! ${v.name} unavailable (${e.message.split('\n')[0]}); using the default ${v.languageCode} voice`);
      // Fall back to any default voice for the language if the named one is
      // unavailable in this project/region.
      [res] = await tts.synthesizeSpeech({
        input: { text: c },
        voice: { languageCode: v.languageCode },
        audioConfig,
      });
    }
    buffers.push(Buffer.from(res.audioContent, 'base64'));
  }
  return Buffer.concat(buffers);
}

// Rough spoken-duration estimate (chars/sec varies by script; good enough for
// the "~N min" label shown in the UI).
const estimateSec = (text) => Math.max(1, Math.round(text.length / 13));

await ensureBucket();

if (SAMPLE) {
  const urls = [];
  for (const id of SAMPLE) {
    const doc = JSON.parse(readFileSync(join(templesDir, 'en', `${id}.json`), 'utf8'));
    const text = narration(doc);
    for (const variant of SAMPLE_VARIANTS) {
      const input = variant.lexicon ? applyLexicon(text) : text;
      const mp3 = await synth(input, 'en', { languageCode: 'en-IN', name: variant.name }, { strict: true });
      const objectPath = `audio/samples/en/${id}/${variant.key}.mp3`;
      await bucket.file(objectPath).save(mp3, {
        contentType: 'audio/mpeg',
        metadata: { cacheControl: 'no-cache' },
        resumable: false,
      });
      // Samples aren't mirrored to R2, so link the public GCS object directly.
      const url = `https://storage.googleapis.com/${BUCKET}/${objectPath}`;
      urls.push(url);
      console.log(`✓ sample ${id} · ${variant.key}  (${(mp3.length / 1024).toFixed(0)} KB)\n  ${url}`);
    }
  }
  console.log(`\ngen-audio: wrote ${urls.length} sample(s); no content changed.`);
  process.exit(0);
}

let done = 0;
for (const locale of LOCALES) {
  const dir = join(templesDir, locale);
  const files = readdirSync(dir).filter((f) => f.endsWith('.json')).slice(0, LIMIT);
  for (const file of files) {
    const path = join(dir, file);
    const doc = JSON.parse(readFileSync(path, 'utf8'));
    const expectedUrl = `${PUBLIC_BASE}/audio/${locale}/${doc.id}.mp3`;
    // Resume: skip files already generated (unless AUDIO_FORCE=1).
    if (!process.env.AUDIO_FORCE && doc.audio?.storyUrl === expectedUrl) {
      console.log(`· ${locale}/${doc.id} (already done, skipping)`);
      continue;
    }
    const text = narration(doc);
    const mp3 = await synth(locale === 'en' ? applyLexicon(text) : text, locale);

    const objectPath = `audio/${locale}/${doc.id}.mp3`;
    const gcsFile = bucket.file(objectPath);
    await gcsFile.save(mp3, {
      contentType: 'audio/mpeg',
      metadata: { cacheControl: 'public, max-age=31536000, immutable' },
      resumable: false,
    });

    doc.audio = {
      storyUrl: `${PUBLIC_BASE}/${objectPath}`,
      durationSec: estimateSec(text),
    };
    writeFileSync(path, JSON.stringify(doc, null, 2) + '\n');
    done++;
    console.log(`✓ ${locale}/${doc.id}  (${(mp3.length / 1024).toFixed(0)} KB, ~${doc.audio.durationSec}s)`);
  }
}
console.log(`\ngen-audio: wrote ${done} audio file(s) to gs://${BUCKET}/audio/ and updated content.`);
