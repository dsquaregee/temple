// Generates narrated audio for every temple × locale with Google Cloud
// Text-to-Speech, uploads the MP3s to a Cloud Storage bucket, and writes each
// temple's `audio` field ({ storyUrl, durationSec }) so the Listen player
// lights up. Run after enabling the Text-to-Speech API on the project.
//
// Usage:
//   GOOGLE_APPLICATION_CREDENTIALS=/path/to/sa-key.json \
//   AUDIO_BUCKET=temple-502523-audio \
//   [AUDIO_LIMIT=1] [AUDIO_LOCALES=en,hi] \
//   node packages/content/scripts/gen-audio.mjs
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
const LIMIT = process.env.AUDIO_LIMIT ? Number(process.env.AUDIO_LIMIT) : Infinity;
const ONLY = process.env.AUDIO_LOCALES ? process.env.AUDIO_LOCALES.split(',') : null;

// Neural2 where available, else Wavenet/Standard. Override per project needs.
const VOICES = {
  en: { languageCode: 'en-IN', name: 'en-IN-Neural2-A' },
  hi: { languageCode: 'hi-IN', name: 'hi-IN-Neural2-A' },
  ta: { languageCode: 'ta-IN', name: 'ta-IN-Wavenet-A' },
  te: { languageCode: 'te-IN', name: 'te-IN-Standard-A' },
  kn: { languageCode: 'kn-IN', name: 'kn-IN-Wavenet-A' },
  ml: { languageCode: 'ml-IN', name: 'ml-IN-Wavenet-A' },
};
const LOCALES = (ONLY ?? Object.keys(VOICES)).filter((l) => VOICES[l]);

const tts = new textToSpeech.TextToSpeechClient();
const storage = new Storage();
const bucket = storage.bucket(BUCKET);

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

async function synth(text, locale) {
  const v = VOICES[locale];
  const audioConfig = { audioEncoding: 'MP3', speakingRate: 0.98 };
  const buffers = [];
  for (const c of chunk(text)) {
    let res;
    try {
      [res] = await tts.synthesizeSpeech({
        input: { text: c },
        voice: { languageCode: v.languageCode, name: v.name },
        audioConfig,
      });
    } catch (e) {
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

let done = 0;
for (const locale of LOCALES) {
  const dir = join(templesDir, locale);
  const files = readdirSync(dir).filter((f) => f.endsWith('.json')).slice(0, LIMIT);
  for (const file of files) {
    const path = join(dir, file);
    const doc = JSON.parse(readFileSync(path, 'utf8'));
    const text = narration(doc);
    const mp3 = await synth(text, locale);

    const objectPath = `audio/${locale}/${doc.id}.mp3`;
    const gcsFile = bucket.file(objectPath);
    await gcsFile.save(mp3, {
      contentType: 'audio/mpeg',
      metadata: { cacheControl: 'public, max-age=31536000, immutable' },
      resumable: false,
    });
    try {
      await gcsFile.makePublic();
    } catch {
      console.warn(`  ! could not set public ACL on ${objectPath} — make the bucket public via IAM (allUsers: Storage Object Viewer).`);
    }

    doc.audio = {
      storyUrl: `https://storage.googleapis.com/${BUCKET}/${objectPath}`,
      durationSec: estimateSec(text),
    };
    writeFileSync(path, JSON.stringify(doc, null, 2) + '\n');
    done++;
    console.log(`✓ ${locale}/${doc.id}  (${(mp3.length / 1024).toFixed(0)} KB, ~${doc.audio.durationSec}s)`);
  }
}
console.log(`\ngen-audio: wrote ${done} audio file(s) to gs://${BUCKET}/audio/ and updated content.`);
