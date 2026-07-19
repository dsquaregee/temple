import { test } from 'node:test';
import assert from 'node:assert/strict';
import { colorForTemple, colorAccentForTemple } from '../src/media.ts';

const HEX = /^#[0-9A-Fa-f]{6}$/;

test('colorForTemple is deterministic for a given id', () => {
  assert.equal(colorForTemple('brihadeeswarar'), colorForTemple('brihadeeswarar'));
});

test('colorForTemple and its accent are always valid hex', () => {
  for (const id of ['brihadeeswarar', 'meenakshi-madurai', 'virupaksha-hampi', '', 'x']) {
    assert.match(colorForTemple(id), HEX, `base for "${id}"`);
    assert.match(colorAccentForTemple(id), HEX, `accent for "${id}"`);
  }
});

test('accent tone differs from the base tone', () => {
  for (const id of ['brihadeeswarar', 'srikalahasti', 'guruvayur-krishna']) {
    assert.notEqual(colorForTemple(id), colorAccentForTemple(id));
  }
});

test('the catalog spreads across more than one palette tone', () => {
  const ids = [
    'brihadeeswarar', 'meenakshi-madurai', 'virupaksha-hampi', 'srikalahasti',
    'nataraja-chidambaram', 'ramanathaswamy-rameswaram', 'guruvayur-krishna',
    'udupi-krishna', 'sringeri-sharada', 'kanchi-kamakshi',
  ];
  const colors = new Set(ids.map(colorForTemple));
  assert.ok(colors.size > 1, 'expected the hash to distribute ids across tones');
});
