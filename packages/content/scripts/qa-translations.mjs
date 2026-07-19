// Automated translation QA. NOT a substitute for native-speaker review — it
// catches mechanical problems a reviewer shouldn't have to hunt for:
//   • untranslated fields (no characters in the target script)
//   • heavy Latin leakage (low target-script ratio → likely English left in)
//   • length outliers vs the English source (possible truncation or bloat)
// English is the source of truth. Writes docs/i18n/translation-review.md and
// prints a summary. Report-only (exit 0) — proper nouns legitimately stay in
// Latin, so findings are signals for a human, not hard failures.
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const dataDir = join(root, '..', 'data');
const repoRoot = join(root, '..', '..', '..');

const SCRIPTS = {
  ta: { name: 'Tamil', re: /[஀-௿]/g },
  te: { name: 'Telugu', re: /[ఀ-౿]/g },
  kn: { name: 'Kannada', re: /[ಀ-೿]/g },
  ml: { name: 'Malayalam', re: /[ഀ-ൿ]/g },
  hi: { name: 'Hindi (Devanagari)', re: /[ऀ-ॿ]/g },
};
const LOCALES = Object.keys(SCRIPTS);

const TEMPLE_FIELDS = [
  'name', 'deity', 'tradition', 'period', 'dynasty', 'style', 'summary',
  'location.city', 'location.state',
  'sections.history', 'sections.architecture', 'sections.legends',
  'sections.festivals', 'sections.experience',
  'visit.timings', 'visit.dressCode', 'visit.photography', 'visit.gettingThere',
];
const CIRCUIT_FIELDS = ['name', 'theme', 'region', 'description'];

const get = (o, path) => path.split('.').reduce((v, k) => (v ? v[k] : undefined), o);
const countMatches = (s, re) => (s.match(re) || []).length;
const latinLetters = (s) => countMatches(s, /[A-Za-z]/g);

// Map every Indic script's digits (and Arabic-Indic) back to 0-9 so a number
// written in native digits still compares equal to the English source. Ranges,
// in order, are the Unicode digit blocks for the scripts we ship plus Arabic.
const DIGIT_BASES = [
  0x0966, // Devanagari ०-९
  0x0be6, // Tamil ௦-௯
  0x0c66, // Telugu ౦-౯
  0x0ce6, // Kannada ೦-೯
  0x0d66, // Malayalam ൦-൯
  0x0660, // Arabic-Indic ٠-٩
];
function normalizeDigits(s) {
  return s.replace(/[०-९௦-௯౦-౯೦-೯൦-൯٠-٩]/g, (ch) => {
    const cp = ch.codePointAt(0);
    for (const base of DIGIT_BASES) {
      if (cp >= base && cp <= base + 9) return String(cp - base);
    }
    return ch;
  });
}
// Multiset of standalone number tokens (dates, measurements) in a string, after
// digit normalization. Used to check numbers survive translation intact.
function numberTokens(s) {
  return (normalizeDigits(s).match(/\d+/g) || []);
}

function loadKind(kind) {
  const byLocale = {};
  const kindDir = join(dataDir, kind);
  for (const locale of readdirSync(kindDir)) {
    byLocale[locale] = {};
    for (const file of readdirSync(join(kindDir, locale))) {
      if (!file.endsWith('.json')) continue;
      const id = file.replace(/\.json$/, '');
      byLocale[locale][id] = JSON.parse(
        readFileSync(join(kindDir, locale, file), 'utf8')
      );
    }
  }
  return byLocale;
}

const temples = loadKind('temples');
const circuits = loadKind('circuits');

const findings = []; // {locale, kind, id, field, level, note}

function check(kind, byLocale, fields) {
  const en = byLocale.en ?? {};
  for (const locale of LOCALES) {
    const { re } = SCRIPTS[locale];
    const docs = byLocale[locale] ?? {};
    for (const id of Object.keys(en).sort()) {
      const doc = docs[id];
      if (!doc) continue;
      for (const field of fields) {
        const val = get(doc, field);
        const enVal = get(en[id], field);
        if (typeof val !== 'string' || typeof enVal !== 'string') continue;
        const script = countMatches(val, re);
        const latin = latinLetters(val);
        const letters = script + latin;
        const ratio = letters ? script / letters : 1;
        const lenRatio = enVal.length ? val.length / enVal.length : 1;

        if (val.length >= 15 && script === 0) {
          findings.push({ locale, kind, id, field, level: 'ERROR',
            note: `no ${SCRIPTS[locale].name} characters — likely untranslated` });
        } else if (letters >= 12 && ratio < 0.45) {
          findings.push({ locale, kind, id, field, level: 'WARN',
            note: `low target-script ratio ${(ratio * 100).toFixed(0)}% (check for leftover English; proper nouns may be fine)` });
        }
        if (enVal.length >= 40 && lenRatio < 0.4) {
          findings.push({ locale, kind, id, field, level: 'WARN',
            note: `much shorter than English (${(lenRatio * 100).toFixed(0)}% of source length — possible truncation)` });
        }
        if (enVal.length >= 40 && lenRatio > 3) {
          findings.push({ locale, kind, id, field, level: 'WARN',
            note: `much longer than English (${lenRatio.toFixed(1)}× source length)` });
        }

        // Numeric parity: every number in the English source (a date, century,
        // height, count…) should reappear in the translation, whether kept in
        // Arabic or written in native digits. Missing numbers usually mean a
        // dropped date or measurement. WARN, since numbers may be legitimately
        // spelled out in words in a given language.
        const enNums = numberTokens(enVal);
        if (enNums.length) {
          const have = new Set(numberTokens(val));
          const missing = [...new Set(enNums)].filter((n) => !have.has(n));
          if (missing.length) {
            findings.push({ locale, kind, id, field, level: 'WARN',
              note: `number(s) ${missing.join(', ')} in English not found in translation (check dates/measurements)` });
          }
        }
      }
    }
  }
}

check('temples', temples, TEMPLE_FIELDS);
check('circuits', circuits, CIRCUIT_FIELDS);

// Per-locale coverage: average target-script ratio across all prose.
const coverage = {};
for (const locale of LOCALES) {
  let script = 0, latin = 0;
  for (const [kind, byLocale, fields] of [
    ['temples', temples, TEMPLE_FIELDS],
    ['circuits', circuits, CIRCUIT_FIELDS],
  ]) {
    for (const doc of Object.values(byLocale[locale] ?? {})) {
      for (const field of fields) {
        const v = get(doc, field);
        if (typeof v !== 'string') continue;
        script += countMatches(v, SCRIPTS[locale].re);
        latin += latinLetters(v);
      }
    }
  }
  coverage[locale] = { script, latin, ratio: script / (script + latin || 1) };
}

const errors = findings.filter((f) => f.level === 'ERROR');
const warns = findings.filter((f) => f.level === 'WARN');

// ---- write report ----
let md = `# Translation review — automated QA\n\n`;
md += `> Generated by \`packages/content/scripts/qa-translations.mjs\`. This is a\n`;
md += `> mechanical pass, **not** a native-speaker review. Proper nouns (e.g.\n`;
md += `> "Chola", "UNESCO", "CE") legitimately remain in Latin, so warnings are\n`;
md += `> signals to spot-check, not defects.\n\n`;

md += `## Coverage by language\n\n`;
md += `| Locale | Language | Target-script ratio | Errors | Warnings |\n`;
md += `|---|---|---|---|---|\n`;
for (const locale of LOCALES) {
  const c = coverage[locale];
  md += `| \`${locale}\` | ${SCRIPTS[locale].name} | ${(c.ratio * 100).toFixed(1)}% | `;
  md += `${errors.filter((f) => f.locale === locale).length} | `;
  md += `${warns.filter((f) => f.locale === locale).length} |\n`;
}
md += `\n(Target-script ratio = share of letters in the language's own script vs\n`;
md += `Latin. Below 100% is expected — proper nouns stay in Latin.)\n\n`;

md += `## Errors (likely untranslated — fix before launch)\n\n`;
if (!errors.length) {
  md += `_None._ Every prose field contains characters in its target script.\n\n`;
} else {
  md += `| Locale | File | Field | Issue |\n|---|---|---|---|\n`;
  for (const f of errors)
    md += `| \`${f.locale}\` | ${f.kind}/${f.id} | \`${f.field}\` | ${f.note} |\n`;
  md += `\n`;
}

md += `## Warnings (spot-check)\n\n`;
if (!warns.length) {
  md += `_None._\n\n`;
} else {
  md += `| Locale | File | Field | Note |\n|---|---|---|---|\n`;
  for (const f of warns)
    md += `| \`${f.locale}\` | ${f.kind}/${f.id} | \`${f.field}\` | ${f.note} |\n`;
  md += `\n`;
}

md += `## Human reviewer checklist (per language)\n\n`;
md += `A native speaker should confirm, for each language:\n\n`;
md += `- [ ] **Deity & sacred terms** are the standard local spellings (e.g. the\n`;
md += `  temple's presiding deity, "lingam", "gopuram", "darshan").\n`;
md += `- [ ] **Place names** (city, state, nearby towns) use the conventional\n`;
md += `  local rendering.\n`;
md += `- [ ] **Tone** is reverent and editorial, not literal/machine-like.\n`;
md += `- [ ] **Facts, dates, and measurements** match the English source exactly.\n`;
md += `- [ ] No leftover English words in the flowing prose (proper nouns aside).\n`;
md += `- [ ] Honorifics and register are appropriate for devotional content.\n\n`;
md += `Sign-off:\n\n`;
md += `| Language | Reviewer | Date | Status |\n|---|---|---|---|\n`;
for (const locale of LOCALES)
  md += `| ${SCRIPTS[locale].name} (\`${locale}\`) |  |  | ⬜ pending |\n`;
md += `\n`;

const outDir = join(repoRoot, 'docs', 'i18n');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'translation-review.md'), md);

console.log(
  `translation QA: ${errors.length} error(s), ${warns.length} warning(s) across ${LOCALES.length} locales`
);
for (const locale of LOCALES) {
  console.log(`  ${locale}: script ratio ${(coverage[locale].ratio * 100).toFixed(1)}%`);
}
console.log('report → docs/i18n/translation-review.md');

// Fail only on genuine untranslated fields; warnings are advisory.
if (errors.length) process.exitCode = 1;
