import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isTrackable, totalKey, dayKey, TRACKABLE } from '../src/stats.ts';

test('isTrackable accepts only whitelisted events', () => {
  assert.ok(isTrackable('share'));
  assert.ok(isTrackable('nearby_city'));
  assert.ok(!isTrackable('arbitrary'));
  assert.ok(!isTrackable(''));
  assert.ok(!isTrackable(123));
  assert.ok(!isTrackable(undefined));
});

test('every whitelisted event is a distinct non-empty string', () => {
  const set = new Set(TRACKABLE);
  assert.equal(set.size, TRACKABLE.length);
  for (const n of TRACKABLE) assert.ok(typeof n === 'string' && n.length > 0);
});

test('KV keys are namespaced and deterministic', () => {
  assert.equal(totalKey('share'), 'stat:share:total');
  assert.equal(dayKey('share', '2027-03-06'), 'stat:share:2027-03-06');
});
