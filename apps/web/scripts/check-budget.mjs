// Performance budget for the static export. Guards the "extremely performant"
// product requirement and the designed-in-performance brief (D4): a big new
// dependency or a bloated page should fail the build, not surprise users on 4G.
//
// Zero dependencies (Node's own gzip) so it runs in CI without an install step,
// matching the content validators. Measures the built `out/` directory:
//   • largest single JS chunk (gzip)   — catches a heavy dep on a shared path
//   • total JS across all chunks (gzip) — catches bundle sprawl
//   • largest prerendered HTML (raw)    — catches SSG data bloat
//
// Budgets are set with headroom over the current build; they are ceilings that
// trip on a real regression, not a race to the smallest number. When the
// catalog legitimately grows past a ceiling, raise it in the same commit.
//
// Usage: node apps/web/scripts/check-budget.mjs   (after `pnpm build:web`)
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const root = dirname(fileURLToPath(import.meta.url));
const outDir = join(root, '..', 'out');

// KB budgets (1 KB = 1000 bytes here, to match how bundlers report sizes).
const BUDGET = {
  largestChunkGzipKB: 90, // current ~54
  totalJsGzipKB: 320, // current ~216
  largestHtmlRawKB: 300, // current ~216 (localized Discover listing; grows ~3 KB/temple, catches a regression to full-prose payloads)
};

function walk(dir, test) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p, test));
    else if (test(p)) out.push(p);
  }
  return out;
}

const kb = (bytes) => Math.round(bytes / 100) / 10; // one decimal, in KB(1000)

const jsFiles = walk(join(outDir, '_next', 'static'), (p) => extname(p) === '.js');
if (jsFiles.length === 0) {
  console.error('✗ no JS found under out/_next/static — did `pnpm build:web` run first?');
  process.exit(1);
}

let totalGzip = 0;
let largestChunk = { name: '', gzip: 0 };
for (const f of jsFiles) {
  const gz = gzipSync(readFileSync(f)).length;
  totalGzip += gz;
  if (gz > largestChunk.gzip) largestChunk = { name: f.slice(outDir.length + 1), gzip: gz };
}

const htmlFiles = walk(outDir, (p) => extname(p) === '.html');
let largestHtml = { name: '', raw: 0 };
for (const f of htmlFiles) {
  const raw = statSync(f).size;
  if (raw > largestHtml.raw) largestHtml = { name: f.slice(outDir.length + 1), raw };
}

const checks = [
  { label: 'largest JS chunk (gzip)', actual: kb(largestChunk.gzip), budget: BUDGET.largestChunkGzipKB, note: largestChunk.name },
  { label: 'total JS (gzip)', actual: kb(totalGzip), budget: BUDGET.totalJsGzipKB, note: `${jsFiles.length} chunks` },
  { label: 'largest HTML page (raw)', actual: kb(largestHtml.raw), budget: BUDGET.largestHtmlRawKB, note: largestHtml.name },
];

let failed = false;
console.log('Performance budget (out/):');
for (const c of checks) {
  const ok = c.actual <= c.budget;
  if (!ok) failed = true;
  const pct = Math.round((c.actual / c.budget) * 100);
  console.log(
    `  ${ok ? '✓' : '✗'} ${c.label.padEnd(26)} ${String(c.actual).padStart(6)} KB / ${c.budget} KB (${pct}%)  ${c.note}`,
  );
}

if (failed) {
  console.error('\n✗ performance budget exceeded — trim the regression or raise the ceiling in the same commit.');
  process.exit(1);
}
console.log('\n✓ within budget');
