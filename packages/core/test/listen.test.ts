import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildPlaylist,
  formatTime,
  stepIndex,
  toListenItem,
} from '../src/listen.ts';
import type { Temple } from '../src/types.ts';

function templeStub(id: string, withAudio: boolean): Temple {
  return {
    id,
    locale: 'en',
    name: id,
    nativeName: id,
    deity: 'x',
    tradition: 'x',
    location: { city: 'x', state: 'x', lat: 10, lng: 78 },
    period: 'x',
    century: 10,
    dynasty: 'x',
    style: 'x',
    unesco: false,
    circuits: [],
    summary: 'x',
    sections: { history: 'x', architecture: 'x', legends: 'x', festivals: 'x', experience: 'x' },
    visit: { timings: 'x', dressCode: 'x', photography: 'x', gettingThere: 'x' },
    audio: withAudio ? { storyUrl: `https://cdn/${id}.mp3`, durationSec: 200 } : undefined,
  } as Temple;
}

test('buildPlaylist splits ready vs upcoming and preserves order', () => {
  const temples = [
    templeStub('a', true),
    templeStub('b', false),
    templeStub('c', true),
    templeStub('d', false),
  ];
  const { ready, upcoming } = buildPlaylist(temples);
  assert.deepEqual(ready.map((t) => t.id), ['a', 'c']);
  assert.deepEqual(upcoming.map((t) => t.id), ['b', 'd']);
});

test('buildPlaylist handles all-ready and none-ready', () => {
  assert.equal(buildPlaylist([templeStub('a', true), templeStub('b', true)]).upcoming.length, 0);
  assert.equal(buildPlaylist([templeStub('a', false)]).ready.length, 0);
  assert.deepEqual(buildPlaylist([]), { ready: [], upcoming: [] });
});

test('stepIndex wraps forward and backward', () => {
  assert.equal(stepIndex(0, 1, 3), 1);
  assert.equal(stepIndex(2, 1, 3), 0); // wrap past the end
  assert.equal(stepIndex(0, -1, 3), 2); // wrap before the start
  assert.equal(stepIndex(1, -1, 3), 0);
});

test('stepIndex is safe for empty and single-item lists', () => {
  assert.equal(stepIndex(0, 1, 0), 0);
  assert.equal(stepIndex(0, -1, 0), 0);
  assert.equal(stepIndex(0, 1, 1), 0);
  assert.equal(stepIndex(0, -1, 1), 0);
});

test('formatTime renders m:ss and clamps invalid input', () => {
  assert.equal(formatTime(0), '0:00');
  assert.equal(formatTime(5), '0:05');
  assert.equal(formatTime(75), '1:15');
  assert.equal(formatTime(600), '10:00');
  assert.equal(formatTime(NaN), '0:00'); // <audio>.duration before metadata loads
  assert.equal(formatTime(-3), '0:00');
  assert.equal(formatTime(59.9), '0:59'); // floors, no rounding to 1:00
});

test('toListenItem projects only the fields the player needs', () => {
  const item = toListenItem(templeStub('brihadeeswarar', true));
  assert.deepEqual(Object.keys(item).sort(), ['audio', 'id', 'name', 'nativeName']);
  assert.deepEqual(item.audio, { storyUrl: 'https://cdn/brihadeeswarar.mp3', durationSec: 200 });
  assert.equal(toListenItem(templeStub('x', false)).audio, undefined);
});
