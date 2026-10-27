import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  FESTIVALS,
  FESTIVAL_BY_KEY,
  FESTIVAL_DATES,
  MONTH_BY_KEY,
  TAMIL_MONTHS,
  currentTamilMonthKey,
  detectFestivals,
  formatFestivalDate,
  nextFestivalDate,
  nextTamilMonthKey,
} from '../src/festivals.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const enDir = join(root, 'packages', 'content', 'data', 'temples', 'en');

const enProse = readdirSync(enDir)
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(join(enDir, f), 'utf8')).sections?.festivals ?? '');

test('every festival maps to a defined Tamil month', () => {
  for (const f of FESTIVALS) {
    assert.ok(MONTH_BY_KEY[f.month], `festival ${f.key} has unknown month ${f.month}`);
  }
});

test('festival and month keys are unique', () => {
  const fk = FESTIVALS.map((f) => f.key);
  assert.equal(new Set(fk).size, fk.length, 'duplicate festival key');
  const mk = TAMIL_MONTHS.map((m) => m.key);
  assert.equal(new Set(mk).size, mk.length, 'duplicate month key');
});

test('every festival matches at least one temple (no dead patterns)', () => {
  const matched = new Set<string>();
  for (const prose of enProse) for (const k of detectFestivals(prose)) matched.add(k);
  for (const f of FESTIVALS) {
    assert.ok(matched.has(f.key), `festival ${f.key} matched no temple — stale pattern?`);
  }
});

test('search-index festival list matches the core dictionary', async () => {
  // gen-search-index.mjs inlines the festival patterns (it must stay node-20-safe,
  // so it cannot import this TS module at build time). Guard the copies in sync.
  const { FESTIVAL_SEARCH } = await import(
    '../../content/scripts/gen-search-index.mjs'
  );
  assert.deepEqual(
    FESTIVAL_SEARCH.map((f: { name: string; patterns: string[] }) => ({
      name: f.name,
      patterns: f.patterns,
    })),
    FESTIVALS.map((f) => ({ name: f.name, patterns: f.patterns })),
    'FESTIVAL_SEARCH in gen-search-index.mjs is out of sync with FESTIVALS'
  );
});

test('currentTamilMonthKey maps Gregorian dates to the right Tamil month', () => {
  // new Date(y, m0, d) uses local time, matching the function's getMonth/getDate.
  assert.equal(currentTamilMonthKey(new Date(2026, 0, 20)), 'thai'); // after Jan 14
  assert.equal(currentTamilMonthKey(new Date(2026, 0, 5)), 'margazhi'); // before Jan 14
  assert.equal(currentTamilMonthKey(new Date(2026, 3, 20)), 'chithirai'); // after Apr 14
  assert.equal(currentTamilMonthKey(new Date(2026, 10, 1)), 'aippasi'); // Nov 1, before Nov 16
  assert.equal(currentTamilMonthKey(new Date(2026, 11, 20)), 'margazhi'); // after Dec 16
});

test('nextTamilMonthKey wraps in calendar order', () => {
  assert.equal(nextTamilMonthKey('chithirai'), 'vaikasi');
  assert.equal(nextTamilMonthKey('panguni'), 'chithirai');
});

test('FESTIVAL_DATES are valid, ascending ISO dates for known festivals', () => {
  const iso = /^\d{4}-\d{2}-\d{2}$/;
  for (const [key, dates] of Object.entries(FESTIVAL_DATES)) {
    assert.ok(FESTIVAL_BY_KEY[key], `FESTIVAL_DATES has unknown festival ${key}`);
    assert.ok(dates.length > 0, `${key} has no dates`);
    for (const d of dates) {
      assert.match(d, iso, `${key} has malformed date ${d}`);
      assert.ok(!Number.isNaN(Date.parse(d)), `${key} has invalid date ${d}`);
    }
    const sorted = [...dates].sort();
    assert.deepEqual(dates, sorted, `${key} dates are not ascending`);
  }
});

test('nextFestivalDate returns the first date on or after the given day', () => {
  // maha-shivaratri: ['2027-03-06', '2028-02-23']
  assert.equal(nextFestivalDate('maha-shivaratri', new Date(2026, 0, 1)), '2027-03-06');
  assert.equal(nextFestivalDate('maha-shivaratri', new Date(2027, 2, 6)), '2027-03-06'); // same day
  assert.equal(nextFestivalDate('maha-shivaratri', new Date(2027, 2, 7)), '2028-02-23');
  assert.equal(nextFestivalDate('maha-shivaratri', new Date(2030, 0, 1)), undefined); // all past
  assert.equal(nextFestivalDate('no-such-festival', new Date(2026, 0, 1)), undefined);
});

test('formatFestivalDate renders a human, locale-independent date', () => {
  assert.equal(formatFestivalDate('2027-03-06'), '6 Mar 2027');
  assert.equal(formatFestivalDate('2026-11-24'), '24 Nov 2026');
});

test('detectFestivals is case-insensitive and substring-based', () => {
  assert.deepEqual(detectFestivals('The temple celebrates MAHA SHIVARATRI each year.'), [
    'maha-shivaratri',
  ]);
  assert.deepEqual(detectFestivals(undefined), []);
  assert.deepEqual(detectFestivals('No known festival here.'), []);
});
