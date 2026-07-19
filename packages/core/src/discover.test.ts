import { describe, expect, it } from 'vitest';
import { ERAS, matchesQuery, regionsOf, templeEra } from './discover';
import type { Temple } from './types';

// Minimal Temple factory — only the fields the discovery helpers read.
function temple(overrides: Partial<Temple> = {}): Temple {
  return {
    id: 'brihadeeswarar',
    locale: 'en',
    name: 'Brihadeeswarar Temple',
    nativeName: 'பிரகதீஸ்வரர் கோயில்',
    deity: 'Shiva',
    tradition: 'Shaiva',
    location: { city: 'Thanjavur', state: 'Tamil Nadu', lat: 10.78, lng: 79.13 },
    period: 'Chola',
    century: 11,
    dynasty: 'Chola',
    style: 'Dravidian',
    unesco: true,
    circuits: ['great-living-chola-temples'],
    summary: 'A granite giant raised by Rajaraja Chola.',
    sections: {
      history: '',
      architecture: '',
      legends: '',
      festivals: '',
      experience: '',
    },
    visit: { timings: '', dressCode: '', photography: '', gettingThere: '' },
    ...overrides,
  };
}

describe('templeEra', () => {
  it('buckets by century at the documented boundaries', () => {
    expect(templeEra(1)).toBe('early');
    expect(templeEra(7)).toBe('early'); // inclusive upper edge of "early"
    expect(templeEra(8)).toBe('classical'); // first classical century
    expect(templeEra(13)).toBe('classical'); // inclusive upper edge of "classical"
    expect(templeEra(14)).toBe('later'); // first "later" century
    expect(templeEra(21)).toBe('later');
  });

  it('every bucket it returns is a member of ERAS', () => {
    for (const century of [1, 7, 8, 13, 14, 20]) {
      expect(ERAS).toContain(templeEra(century));
    }
  });
});

describe('matchesQuery', () => {
  it('matches everything for an empty or whitespace query', () => {
    expect(matchesQuery(temple(), '')).toBe(true);
    expect(matchesQuery(temple(), '   ')).toBe(true);
  });

  it('is case-insensitive across searchable fields', () => {
    expect(matchesQuery(temple(), 'THANJAVUR')).toBe(true);
    expect(matchesQuery(temple(), 'shiva')).toBe(true);
    expect(matchesQuery(temple(), 'chola')).toBe(true);
  });

  it('matches native-script tokens', () => {
    expect(matchesQuery(temple(), 'கோயில்')).toBe(true);
  });

  it('requires every token to appear (AND semantics)', () => {
    expect(matchesQuery(temple(), 'thanjavur shiva')).toBe(true);
    expect(matchesQuery(temple(), 'thanjavur kerala')).toBe(false);
  });

  it('does not match tokens absent from any field', () => {
    expect(matchesQuery(temple(), 'vaishnava')).toBe(false);
  });
});

describe('regionsOf', () => {
  it('returns distinct states in first-seen order', () => {
    const temples = [
      temple({ id: 'a', location: { ...temple().location, state: 'Tamil Nadu' } }),
      temple({ id: 'b', location: { ...temple().location, state: 'Kerala' } }),
      temple({ id: 'c', location: { ...temple().location, state: 'Tamil Nadu' } }),
      temple({ id: 'd', location: { ...temple().location, state: 'Karnataka' } }),
    ];
    expect(regionsOf(temples)).toEqual(['Tamil Nadu', 'Kerala', 'Karnataka']);
  });

  it('returns an empty array for an empty catalog', () => {
    expect(regionsOf([])).toEqual([]);
  });
});
