import { describe, expect, it } from 'vitest';
import { LOCALES } from '@temple/core';
import { isLocale, LOCALE_LABELS } from './locales';

describe('isLocale', () => {
  it('accepts every shipped locale', () => {
    for (const locale of LOCALES) expect(isLocale(locale)).toBe(true);
  });

  it('rejects unknown values', () => {
    expect(isLocale('fr')).toBe(false);
    expect(isLocale('')).toBe(false);
    expect(isLocale('EN')).toBe(false);
  });
});

describe('LOCALE_LABELS', () => {
  it('has a non-empty native script and English gloss for every locale', () => {
    for (const locale of LOCALES) {
      const label = LOCALE_LABELS[locale];
      expect(label, `label for "${locale}" missing`).toBeTruthy();
      expect(label.script.trim().length).toBeGreaterThan(0);
      expect(label.gloss.trim().length).toBeGreaterThan(0);
    }
  });

  it('covers exactly the shipped locales — no extra or missing entries', () => {
    expect(Object.keys(LOCALE_LABELS).sort()).toEqual([...LOCALES].sort());
  });
});
