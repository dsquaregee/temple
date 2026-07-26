import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  templeEra, matchesQuery, regionsOf, ERAS,
  filterTemples, sortTemples, SORTS, toCardData, searchIndexText,
} from '../src/discover.ts';
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

test('matchesQuery searches the card fields: native script, town, dynasty', () => {
  const t = temple({ nativeName: 'பெருவுடையார் கோயில்', dynasty: 'Chola' });
  assert.equal(matchesQuery(t, 'கோயில்'), true); // native name
  assert.equal(matchesQuery(t, 'chola'), true); // dynasty (stays on the card)
  assert.equal(matchesQuery(t, 'pandya'), false);
});

test('matchesQuery spans off-card fields only when the extra text is supplied', () => {
  const t = temple({ deity: 'Shiva', style: 'Dravidian' });
  // deity/style are no longer on the card, so a bare match does not find them...
  assert.equal(matchesQuery(t, 'shiva'), false);
  assert.equal(matchesQuery(t, 'dravidian'), false);
  // ...but do once the lazy index text is passed in.
  const extra = searchIndexText(t);
  assert.equal(matchesQuery(t, 'shiva', extra), true);
  assert.equal(matchesQuery(t, 'dravidian', extra), true);
  // A card token still ANDs correctly alongside an off-card token.
  assert.equal(matchesQuery(t, 'test shiva', extra), true); // "test" ∈ name, "shiva" ∈ extra
  assert.equal(matchesQuery(t, 'pandya', extra), false);
});

test('searchIndexText concatenates the off-card fields, lowercased', () => {
  const text = searchIndexText(temple({ deity: 'Shiva', tradition: 'Shaivism', style: 'Dravidian', period: '1010 CE' }));
  for (const token of ['shiva', 'shaivism', 'dravidian', '1010']) {
    assert.ok(text.includes(token), `expected "${token}" in "${text}"`);
  }
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

// A small mixed catalog for the filter/sort helpers.
const catalog = [
  temple({ id: 'brihad', name: 'Brihadeeswarar', century: 11, unesco: true, circuits: ['chola'], location: { city: 'Thanjavur', state: 'Tamil Nadu', lat: 10, lng: 79 } }),
  temple({ id: 'meenakshi', name: 'Meenakshi', century: 17, unesco: false, circuits: [], location: { city: 'Madurai', state: 'Tamil Nadu', lat: 9, lng: 78 } }),
  temple({ id: 'virupaksha', name: 'Aihole Virupaksha', century: 8, unesco: true, circuits: ['hoysala'], location: { city: 'Hampi', state: 'Karnataka', lat: 15, lng: 76 } }),
];

test('filterTemples with no criteria returns everything in input order', () => {
  assert.deepEqual(filterTemples(catalog).map((t) => t.id), ['brihad', 'meenakshi', 'virupaksha']);
  assert.deepEqual(filterTemples(catalog, {}).map((t) => t.id), ['brihad', 'meenakshi', 'virupaksha']);
});

test('filterTemples AND-combines every facet', () => {
  assert.deepEqual(
    filterTemples(catalog, { unescoOnly: true }).map((t) => t.id),
    ['brihad', 'virupaksha'],
  );
  assert.deepEqual(
    filterTemples(catalog, { region: 'Tamil Nadu' }).map((t) => t.id),
    ['brihad', 'meenakshi'],
  );
  assert.deepEqual(
    filterTemples(catalog, { circuit: 'chola' }).map((t) => t.id),
    ['brihad'],
  );
  assert.deepEqual(
    filterTemples(catalog, { era: 'later' }).map((t) => t.id),
    ['meenakshi'],
  );
  // Combined: UNESCO + Tamil Nadu leaves only Brihadeeswarar.
  assert.deepEqual(
    filterTemples(catalog, { unescoOnly: true, region: 'Tamil Nadu' }).map((t) => t.id),
    ['brihad'],
  );
  // Query narrows further and is still ANDed with facets.
  assert.deepEqual(filterTemples(catalog, { query: 'madurai' }).map((t) => t.id), ['meenakshi']);
});

test('filterTemples honours the saved-ids restriction only when provided', () => {
  assert.deepEqual(
    filterTemples(catalog, { savedIds: ['virupaksha', 'brihad'] }).map((t) => t.id),
    ['brihad', 'virupaksha'], // input order preserved, not savedIds order
  );
  // null/undefined savedIds means "no saved restriction".
  assert.equal(filterTemples(catalog, { savedIds: null }).length, 3);
  // An empty saved list legitimately matches nothing (nothing is saved).
  assert.deepEqual(filterTemples(catalog, { savedIds: [] }), []);
});

test('sortTemples does not mutate its input', () => {
  const before = catalog.map((t) => t.id);
  sortTemples(catalog, 'chrono-asc');
  assert.deepEqual(catalog.map((t) => t.id), before);
});

test('sortTemples featured preserves catalog order', () => {
  assert.deepEqual(sortTemples(catalog, 'featured').map((t) => t.id), ['brihad', 'meenakshi', 'virupaksha']);
});

test('sortTemples chronological orders by century both ways', () => {
  assert.deepEqual(sortTemples(catalog, 'chrono-asc').map((t) => t.century), [8, 11, 17]);
  assert.deepEqual(sortTemples(catalog, 'chrono-desc').map((t) => t.century), [17, 11, 8]);
});

test('sortTemples name sorts alphabetically by localized name', () => {
  assert.deepEqual(
    sortTemples(catalog, 'name').map((t) => t.name),
    ['Aihole Virupaksha', 'Brihadeeswarar', 'Meenakshi'],
  );
});

test('SORTS lists every sort key exactly once', () => {
  assert.deepEqual([...SORTS].sort(), ['chrono-asc', 'chrono-desc', 'featured', 'name']);
});

test('toCardData keeps card/facet fields and drops prose + off-card search fields', () => {
  const full = temple({ id: 'brihad', name: 'Brihadeeswarar', century: 11, unesco: true, circuits: ['chola'] });
  const card = toCardData(full);
  // Fields the card renders, facets, and sort rely on survive.
  assert.equal(card.id, 'brihad');
  assert.equal(card.name, 'Brihadeeswarar');
  assert.equal(card.nativeName, full.nativeName);
  assert.equal(card.dynasty, full.dynasty); // shown in the card meta line
  assert.equal(card.century, 11);
  assert.equal(card.unesco, true);
  assert.deepEqual(card.circuits, ['chola']);
  assert.deepEqual(card.location, { city: 'Thanjavur', state: 'Tamil Nadu' });
  // The search-only fields are NOT carried on the card — they load lazily as the
  // per-locale search index instead, keeping the listing payload small.
  assert.equal('deity' in card, false);
  assert.equal('tradition' in card, false);
  assert.equal('style' in card, false);
  assert.equal('period' in card, false);
  // The bulk — summary prose, sections, visit, coordinates — is not carried
  // into the payload (summary stays on the full Temple for the detail page).
  assert.equal('summary' in card, false);
  assert.equal('sections' in card, false);
  assert.equal('visit' in card, false);
  assert.equal('lat' in card.location, false);
});

test('filterTemples query spans the search index when provided', () => {
  const cards = catalog.map(toCardData);
  // Give brihad an off-card deity; without the index, a deity query finds nothing.
  const index = { brihad: searchIndexText(temple({ deity: 'Nataraja', tradition: '', style: '', period: '' })) };
  assert.deepEqual(filterTemples(cards, { query: 'nataraja' }).map((t) => t.id), []);
  assert.deepEqual(
    filterTemples(cards, { query: 'nataraja', searchIndex: index }).map((t) => t.id),
    ['brihad'],
  );
  // Card-field search (town) is unaffected by the index being present or absent.
  assert.deepEqual(filterTemples(cards, { query: 'madurai', searchIndex: index }).map((t) => t.id), ['meenakshi']);
});

test('filter + sort operate correctly on projected card data', () => {
  const cards = catalog.map(toCardData);
  const result = sortTemples(filterTemples(cards, { unescoOnly: true }), 'chrono-asc');
  assert.deepEqual(result.map((t) => t.id), ['virupaksha', 'brihad']); // 8th then 11th
  // Search still works over the projected fields.
  assert.deepEqual(filterTemples(cards, { query: 'madurai' }).map((t) => t.id), ['meenakshi']);
});
