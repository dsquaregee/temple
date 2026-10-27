import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  FESTIVALS,
  MONTH_BY_KEY,
  TAMIL_MONTHS,
  detectFestivals,
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

test('detectFestivals is case-insensitive and substring-based', () => {
  assert.deepEqual(detectFestivals('The temple celebrates MAHA SHIVARATRI each year.'), [
    'maha-shivaratri',
  ]);
  assert.deepEqual(detectFestivals(undefined), []);
  assert.deepEqual(detectFestivals('No known festival here.'), []);
});
