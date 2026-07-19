import { test } from 'node:test';
import assert from 'node:assert/strict';
import { templeEra, matchesQuery, regionsOf, ERAS } from '../src/discover.ts';
import type { Temple } from '../src/types.ts';

// A minimal Temple factory — only the fields discovery reads need to be real;
// the rest are filled with harmless placeholders.
function temple(over: Partial<Temple> = {}): Temple {
  return {
    id: 'x',
    locale: 'en',
    name: 'Test Temple',
    nativeName: 'சோதனை',
    deity: 'Shiva',
    tradition: 'Shaivism',
    location: { city: 'Thanjavur', state: 'Tamil Nadu', lat: 10, lng: 79 },
    period: '1010 CE',
    century: 11,
    dynasty: 'Chola',
    style: 'Dravidian',
    unesco: false,
    circuits: [],
    summary: 'A great temple.',
    sections: { history: '', architecture: '', legends: '', festivals: '', experience: '' },
    visit: { timings: '', dressCode: '', photography: '', gettingThere: '' },
    ...over,
  };
}

test('templeEra buckets by century boundaries', () => {
  assert.equal(templeEra(1), 'early');
  assert.equal(templeEra(7), 'early'); // upper edge of early
  assert.equal(templeEra(8), 'classical'); // lower edge of classical
  assert.equal(templeEra(13), 'classical'); // upper edge of classical
  assert.equal(templeEra(14), 'later'); // lower edge of later
  assert.equal(templeEra(21), 'later');
});

test('ERAS lists every era oldest-first with no gaps', () => {
  assert.deepEqual([...ERAS], ['early', 'classical', 'later']);
  // Every era produced by templeEra is representable in the facet order.
  for (const c of [1, 7, 8, 13, 14, 20]) {
    assert.ok(ERAS.includes(templeEra(c)));
  }
});

test('matchesQuery matches everything on empty/whitespace queries', () => {
  const t = temple();
  assert.equal(matchesQuery(t, ''), true);
  assert.equal(matchesQuery(t, '   '), true);
});

test('matchesQuery is case-insensitive and AND-combines tokens', () => {
  const t = temple({ name: 'Brihadeeswarar Temple', location: { city: 'Thanjavur', state: 'Tamil Nadu', lat: 10, lng: 79 } });
  assert.equal(matchesQuery(t, 'BRIHAD'), true);
  assert.equal(matchesQuery(t, 'brihad thanjavur'), true); // both tokens present
  assert.equal(matchesQuery(t, 'brihad madurai'), false); // second token absent
});

test('matchesQuery searches native script and deity/dynasty', () => {
  const t = temple({ nativeName: 'பெருவுடையார் கோயில்', deity: 'Shiva', dynasty: 'Chola' });
  assert.equal(matchesQuery(t, 'கோயில்'), true);
  assert.equal(matchesQuery(t, 'chola'), true);
  assert.equal(matchesQuery(t, 'pandya'), false);
});

test('regionsOf returns distinct states in first-seen order', () => {
  const temples = [
    temple({ location: { city: 'Thanjavur', state: 'Tamil Nadu', lat: 10, lng: 79 } }),
    temple({ location: { city: 'Hampi', state: 'Karnataka', lat: 15, lng: 76 } }),
    temple({ location: { city: 'Madurai', state: 'Tamil Nadu', lat: 9, lng: 78 } }),
  ];
  assert.deepEqual(regionsOf(temples), ['Tamil Nadu', 'Karnataka']);
  assert.deepEqual(regionsOf([]), []);
});
