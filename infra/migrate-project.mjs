#!/usr/bin/env node
// Retarget the whole repo from one GCP/Firebase project to another, in one pass.
//
// Why this exists: the Firebase project id and the two GCS bucket names are baked
// into ~600 content JSON files (every hero/video/audio URL), plus `.firebaserc`,
// `firebase.json`, the deploy/media/audio workflows, and the docs. When a project
// has to be replaced (e.g. the original was locked), hunting those strings by hand
// is error-prone. This codemod does the three string substitutions deterministically
// and reports exactly what it changed.
//
// It only rewrites in-repo text. It does NOT touch GCP: creating the new project,
// its buckets, the service-account key, or the `FIREBASE_SERVICE_ACCOUNT` GitHub
// secret are owner steps — see docs/migrate-project.md.
//
// Usage:
//   node infra/migrate-project.mjs --to <new-project-id> [options]
//
// Options:
//   --to <id>             New project id (required). Buckets default to
//                         <id>-media and <id>-audio (the repo's convention).
//   --from <id>           Old project id to replace (default: temple-502523).
//   --media-bucket <name> Override the new media bucket (default: <to>-media).
//   --audio-bucket <name> Override the new audio bucket (default: <to>-audio).
//   --dry-run             Report what would change; write nothing.
//
// Examples:
//   node infra/migrate-project.mjs --to temple-prod-x9 --dry-run
//   node infra/migrate-project.mjs --to temple-prod-x9
//   node infra/migrate-project.mjs --to temple-prod-x9 \
//     --media-bucket temple-cdn-media --audio-bucket temple-cdn-audio

import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { readdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');

// Dirs we never rewrite: VCS, dependencies, build output, lockfiles.
const SKIP_DIRS = new Set(['.git', 'node_modules', 'out', '.next', 'dist', '.turbo', '.expo', 'coverage']);
// Only rewrite text we understand. Binary media never contains the strings.
const TEXT_EXT = new Set([
  '.json', '.json5', '.jsonc', '.mjs', '.cjs', '.js', '.ts', '.tsx', '.yml', '.yaml',
  '.md', '.txt', '.html', '.css', '.toml', '.env', '.sh',
]);
const SKIP_FILES = new Set(['pnpm-lock.yaml', 'package-lock.json', 'yarn.lock']);
// Files that intentionally keep the OLD id and must NOT be rewritten: this codemod
// (its --from default), the migration runbook (its "copy from gs://<old>-media"
// source commands reference both ids by design), and the CLAUDE.md history note
// recording which project was locked. These are documentation of record, not
// operational config (live URLs live in content JSON + workflows, which ARE rewritten).
const SKIP_PATHS = new Set([
  'infra/migrate-project.mjs',
  'docs/migrate-project.md',
  'CLAUDE.md',
]);

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') out.dryRun = true;
    else if (a === '--to') out.to = argv[++i];
    else if (a === '--from') out.from = argv[++i];
    else if (a === '--media-bucket') out.mediaBucket = argv[++i];
    else if (a === '--audio-bucket') out.audioBucket = argv[++i];
    else {
      console.error(`Unknown argument: ${a}`);
      process.exit(2);
    }
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));
const from = args.from || 'temple-502523';
const to = args.to;
if (!to) {
  console.error('Error: --to <new-project-id> is required.\n');
  console.error('Run with --dry-run first to preview. See docs/migrate-project.md.');
  process.exit(2);
}
// GCP project ids: 6–30 chars, lowercase letters/digits/hyphens, must start with a letter.
if (!/^[a-z][a-z0-9-]{5,29}$/.test(to)) {
  console.error(`Error: "${to}" is not a valid GCP project id (6–30 chars, lowercase letter then letters/digits/hyphens).`);
  process.exit(2);
}

const fromMedia = `${from}-media`;
const fromAudio = `${from}-audio`;
const toMedia = args.mediaBucket || `${to}-media`;
const toAudio = args.audioBucket || `${to}-audio`;

// Order matters: replace the longer, bucket-qualified strings first so the bare
// project-id replacement that follows can't partially rewrite a bucket name.
const RULES = [
  [fromMedia, toMedia],
  [fromAudio, toAudio],
  [from, to],
];

function walk(dir, acc) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(join(dir, entry.name), acc);
    } else if (entry.isFile()) {
      if (SKIP_FILES.has(entry.name)) continue;
      if (!TEXT_EXT.has(extname(entry.name))) continue;
      const full = join(dir, entry.name);
      const rel = full.slice(REPO_ROOT.length + 1).split('\\').join('/');
      if (SKIP_PATHS.has(rel)) continue;
      acc.push(full);
    }
  }
  return acc;
}

function applyRules(text) {
  let out = text;
  let n = 0;
  for (const [a, b] of RULES) {
    if (a === b) continue;
    const parts = out.split(a);
    n += parts.length - 1;
    out = parts.join(b);
  }
  return { out, n };
}

const files = walk(REPO_ROOT, []);
let changedFiles = 0;
let totalReplacements = 0;
const perFile = [];

for (const file of files) {
  let text;
  try {
    text = readFileSync(file, 'utf8');
  } catch {
    continue; // unreadable / binary — skip
  }
  if (!text.includes(from)) continue;
  const { out, n } = applyRules(text);
  if (n === 0 || out === text) continue;
  changedFiles++;
  totalReplacements += n;
  perFile.push([file.slice(REPO_ROOT.length + 1), n]);
  if (!args.dryRun) writeFileSync(file, out);
}

perFile.sort((a, b) => b[1] - a[1]);
const mode = args.dryRun ? 'DRY RUN — no files written' : 'APPLIED';
console.log(`\nProject migration (${mode})`);
console.log(`  from : ${from}  (media=${fromMedia}, audio=${fromAudio})`);
console.log(`  to   : ${to}  (media=${toMedia}, audio=${toAudio})\n`);
console.log('Top files by replacements:');
for (const [rel, n] of perFile.slice(0, 15)) console.log(`  ${String(n).padStart(5)}  ${rel}`);
if (perFile.length > 15) console.log(`  … and ${perFile.length - 15} more files`);
console.log(`\n${totalReplacements} replacement(s) across ${changedFiles} file(s).`);
if (args.dryRun) {
  console.log('\nRe-run without --dry-run to write the changes, then:');
  console.log('  pnpm -w build && pnpm -w test   # verify, then commit & push');
} else {
  console.log('\nNext: verify no stray operational references remain');
  console.log('(migrate-project.mjs, docs/migrate-project.md, CLAUDE.md keep the old id by design):');
  console.log(`  grep -rln "${from}" . --exclude-dir=.git --exclude-dir=node_modules \\`);
  console.log(`    | grep -vE '^\\./(infra/migrate-project\\.mjs|docs/migrate-project\\.md|CLAUDE\\.md)$' || echo "clean"`);
  console.log('Then rebuild, test, commit, and push. See docs/migrate-project.md for the GCP-side steps.');
}
