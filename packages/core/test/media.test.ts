import { test } from 'node:test';
import assert from 'node:assert/strict';
import { colorForTemple, colorAccentForTemple, heroBgClass, HERO_PALETTE } from '../src/media.ts';

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

test('heroBgClass maps every palette tone to a distinct in-range class', () => {
  const classes = HERO_PALETTE.map(heroBgClass);
  assert.equal(new Set(classes).size, HERO_PALETTE.length, 'each tone gets a unique class');
  for (let i = 0; i < HERO_PALETTE.length; i++) {
    assert.equal(heroBgClass(HERO_PALETTE[i]!), `hero-bg-${i}`);
  }
});

test('heroBgClass falls back to the default tone for an off-palette color', () => {
  // Fallback index 3 = laterite; must still name a class the CSS actually defines.
  assert.equal(heroBgClass('#123456'), 'hero-bg-3');
  assert.equal(heroBgClass(''), 'hero-bg-3');
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
