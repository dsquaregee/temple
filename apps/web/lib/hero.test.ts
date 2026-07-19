import { describe, expect, it } from 'vitest';
import type { Temple } from '@temple/core';
import { heroFor } from './hero';

function temple(overrides: Partial<Temple> = {}): Temple {
  return {
    id: 'meenakshi-madurai',
    locale: 'en',
    name: 'Meenakshi Amman Temple',
    nativeName: 'மீனாட்சி அம்மன் கோயில்',
    deity: 'Meenakshi',
    tradition: 'Shakta',
    location: { city: 'Madurai', state: 'Tamil Nadu', lat: 9.92, lng: 78.12 },
    period: 'Nayak',
    century: 17,
    dynasty: 'Nayak',
    style: 'Dravidian',
    unesco: false,
    circuits: [],
    summary: '',
    sections: { history: '', architecture: '', legends: '', festivals: '', experience: '' },
    visit: { timings: '', dressCode: '', photography: '', gettingThere: '' },
    ...overrides,
  };
}

describe('heroFor', () => {
  it('falls back to the deterministic generated placeholder when no hero is set', () => {
    const hero = heroFor(temple());
    expect(hero.src).toBe('/heroes/meenakshi-madurai.svg');
    expect(hero.color).toMatch(/^#[0-9a-fA-F]{6}$/);
    expect(hero.alt).toContain('Meenakshi Amman Temple');
    expect(hero.sources).toBeUndefined();
  });

  it('uses the provided hero image when content supplies one', () => {
    const hero = heroFor(
      temple({
        hero: {
          src: '/media/heroes/meenakshi.jpg',
          color: '#123456',
          alt: 'Meenakshi gopuram',
          sources: { avif: '/media/heroes/meenakshi.avif', webp: '/media/heroes/meenakshi.webp' },
          credit: 'Photo: CC BY 4.0',
        },
      }),
    );
    expect(hero.src).toBe('/media/heroes/meenakshi.jpg');
    expect(hero.color).toBe('#123456');
    expect(hero.alt).toBe('Meenakshi gopuram');
    expect(hero.sources?.avif).toBe('/media/heroes/meenakshi.avif');
    expect(hero.credit).toBe('Photo: CC BY 4.0');
  });
});
