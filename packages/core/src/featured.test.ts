import { describe, expect, it } from 'vitest';
import { epochDay, indexOfDay } from './featured';

describe('epochDay', () => {
  it('is 0 for the Unix epoch and 1 the next day', () => {
    expect(epochDay(new Date('1970-01-01T00:00:00Z'))).toBe(0);
    expect(epochDay(new Date('1970-01-01T23:59:59Z'))).toBe(0);
    expect(epochDay(new Date('1970-01-02T00:00:00Z'))).toBe(1);
  });

  it('advances by exactly one per calendar day (UTC)', () => {
    const a = epochDay(new Date('2026-07-19T10:00:00Z'));
    const b = epochDay(new Date('2026-07-20T10:00:00Z'));
    expect(b - a).toBe(1);
  });
});

describe('indexOfDay', () => {
  it('rotates through the list and wraps', () => {
    expect(indexOfDay(3, 0)).toBe(0);
    expect(indexOfDay(3, 1)).toBe(1);
    expect(indexOfDay(3, 2)).toBe(2);
    expect(indexOfDay(3, 3)).toBe(0); // wraps
    expect(indexOfDay(3, 4)).toBe(1);
  });

  it('handles negative day numbers without going out of range', () => {
    expect(indexOfDay(3, -1)).toBe(2);
    expect(indexOfDay(3, -3)).toBe(0);
    expect(indexOfDay(3, -4)).toBe(2);
  });

  it('is always a valid index for a non-empty list', () => {
    for (let day = -50; day <= 50; day++) {
      const i = indexOfDay(10, day);
      expect(i).toBeGreaterThanOrEqual(0);
      expect(i).toBeLessThan(10);
    }
  });

  it('returns 0 for an empty list rather than NaN', () => {
    expect(indexOfDay(0, 5)).toBe(0);
    expect(indexOfDay(-1, 5)).toBe(0);
  });
});
