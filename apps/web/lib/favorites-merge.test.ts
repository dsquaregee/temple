import { describe, expect, it } from 'vitest';
import { mergeFavorites, sameFavorites } from './favorites';

describe('sameFavorites', () => {
  it('is true for the same set regardless of order', () => {
    expect(sameFavorites(['a', 'b'], ['b', 'a'])).toBe(true);
    expect(sameFavorites([], [])).toBe(true);
  });

  it('is false when the sets differ', () => {
    expect(sameFavorites(['a'], ['a', 'b'])).toBe(false);
    expect(sameFavorites(['a', 'b'], ['a', 'c'])).toBe(false);
    expect(sameFavorites(['a'], [])).toBe(false);
  });
});

describe('mergeFavorites', () => {
  it('unions local and remote, keeping local order first', () => {
    expect(mergeFavorites(['a', 'b'], ['c', 'a'])).toEqual(['a', 'b', 'c']);
  });

  it('returns a copy of local when remote adds nothing', () => {
    expect(mergeFavorites(['a', 'b'], ['a'])).toEqual(['a', 'b']);
    expect(mergeFavorites(['a'], [])).toEqual(['a']);
  });

  it('adopts remote saves when local is empty (a fresh device)', () => {
    expect(mergeFavorites([], ['x', 'y'])).toEqual(['x', 'y']);
  });

  it('never loses a save present on either side', () => {
    const merged = mergeFavorites(['a', 'b'], ['b', 'c', 'd']);
    for (const id of ['a', 'b', 'c', 'd']) expect(merged).toContain(id);
    // no duplicates
    expect(new Set(merged).size).toBe(merged.length);
  });
});
