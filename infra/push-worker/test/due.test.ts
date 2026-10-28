import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dueFestivals, isoDay, daysBetween, type FestivalDates } from '../src/due.ts';

const DATES: FestivalDates = {
  a: ['2027-03-06', '2028-02-23'],
  b: ['2027-03-22'],
  past: ['2020-01-01'],
};

test('isoDay formats UTC date', () => {
  assert.equal(isoDay(new Date('2027-03-04T18:00:00Z')), '2027-03-04');
});

test('daysBetween counts whole days', () => {
  assert.equal(daysBetween('2027-03-04', '2027-03-06'), 2);
  assert.equal(daysBetween('2027-03-06', '2027-03-06'), 0);
  assert.equal(daysBetween('2027-03-07', '2027-03-06'), -1);
});

test('dueFestivals fires only within the lead window', () => {
  // 2 days before 'a' (2027-03-06), lead 3 → 'a' due, 'b' not (16 days away).
  assert.deepEqual(dueFestivals(DATES, '2027-03-04', 3), [{ key: 'a', date: '2027-03-06' }]);
});

test('dueFestivals ignores past dates and picks the next occurrence', () => {
  // After the first 'a' date, it should consider the 2028 one.
  const r = dueFestivals(DATES, '2028-02-21', 3);
  assert.deepEqual(r, [{ key: 'a', date: '2028-02-23' }]);
});

test('dueFestivals returns nothing when all festivals are far off', () => {
  assert.deepEqual(dueFestivals(DATES, '2027-01-01', 3), []);
});

test('dueFestivals excludes a festival with no future dates', () => {
  const r = dueFestivals(DATES, '2027-03-19', 3);
  assert.deepEqual(r, [{ key: 'b', date: '2027-03-22' }]);
});
