import { test } from 'node:test';
import assert from 'node:assert/strict';
import { activeStays, isoToday } from '../src/stay.ts';
import type { TempleStay } from '../src/types.ts';

const s = (name: string, extra: Partial<TempleStay> = {}): TempleStay => ({
  name,
  url: `https://example.com/${name}`,
  ...extra,
});

test('activeStays: undefined / empty → []', () => {
  assert.deepEqual(activeStays(undefined), []);
  assert.deepEqual(activeStays([]), []);
});

test('activeStays: open-ended listings always show', () => {
  const list = [s('a'), s('b', { sponsored: true })];
  assert.deepEqual(
    activeStays(list, '2027-01-01').map((x) => x.name),
    ['a', 'b'],
  );
});

test('activeStays: hides a listing on/after its until date, keeps future ones', () => {
  const list = [
    s('past', { until: '2026-01-01' }),
    s('today', { until: '2026-06-15' }),
    s('future', { until: '2026-12-31' }),
  ];
  assert.deepEqual(
    activeStays(list, '2026-06-15').map((x) => x.name),
    ['future'],
  );
});

test('activeStays: preserves order of the survivors', () => {
  const list = [s('x', { until: '2099-01-01' }), s('y'), s('z', { until: '2000-01-01' })];
  assert.deepEqual(
    activeStays(list, '2026-06-15').map((x) => x.name),
    ['x', 'y'],
  );
});

test('isoToday returns a YYYY-MM-DD string', () => {
  assert.match(isoToday(new Date('2026-06-15T10:00:00Z')), /^2026-06-15$/);
});
