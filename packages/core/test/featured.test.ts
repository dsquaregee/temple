import { test } from 'node:test';
import assert from 'node:assert/strict';
import { epochDay, indexOfDay } from '../src/featured.ts';

test('epochDay counts whole UTC days since the epoch', () => {
  assert.equal(epochDay(new Date('1970-01-01T00:00:00Z')), 0);
  assert.equal(epochDay(new Date('1970-01-02T00:00:00Z')), 1);
  assert.equal(epochDay(new Date('1970-01-01T23:59:59Z')), 0); // same day floors down
  assert.equal(epochDay(new Date('2026-07-19T12:00:00Z')), 20653);
});

test('indexOfDay wraps over the list length', () => {
  assert.equal(indexOfDay(3, 0), 0);
  assert.equal(indexOfDay(3, 3), 0);
  assert.equal(indexOfDay(3, 7), 1);
});

test('indexOfDay handles negative day numbers without going negative', () => {
  assert.equal(indexOfDay(3, -1), 2);
  assert.equal(indexOfDay(3, -3), 0);
  assert.equal(indexOfDay(5, -7), 3);
});

test('indexOfDay is safe for empty/zero-length lists', () => {
  assert.equal(indexOfDay(0, 5), 0);
  assert.equal(indexOfDay(-1, 5), 0);
});

test('indexOfDay floors fractional day numbers', () => {
  assert.equal(indexOfDay(3, 7.9), 1);
});

test('a full year of days visits the whole catalog and only wraps at length', () => {
  const length = 25;
  const seen = new Set<number>();
  for (let day = 0; day < length; day++) seen.add(indexOfDay(length, day));
  assert.equal(seen.size, length); // every temple picked exactly once before repeating
  assert.equal(indexOfDay(length, length), indexOfDay(length, 0)); // then it wraps
});
