import { describe, expect, it } from 'vitest';
import { strings, t } from './i18n';
import { LOCALES } from './types';

// Recursively collect the dotted key paths of a nested string record so two
// locales can be compared for structural parity regardless of nesting.
function keyPaths(obj: unknown, prefix = ''): string[] {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
      keyPaths(v, prefix ? `${prefix}.${k}` : k),
    );
  }
  return [prefix];
}

// Collect every leaf string value with its path, for empty-value checks.
function leaves(obj: unknown, prefix = ''): [string, unknown][] {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
      leaves(v, prefix ? `${prefix}.${k}` : k),
    );
  }
  return [[prefix, obj]];
}

const EN_KEYS = keyPaths(strings.en).sort();

describe('UI strings (i18n)', () => {
  it('ships every locale in LOCALES', () => {
    for (const locale of LOCALES) {
      expect(strings[locale], `strings["${locale}"] missing`).toBeTruthy();
    }
  });

  it.each(LOCALES)('locale "%s" has the exact same key set as English', (locale) => {
    const keys = keyPaths(strings[locale]).sort();
    expect(keys).toEqual(EN_KEYS);
  });

  it.each(LOCALES)('locale "%s" has no empty string values', (locale) => {
    for (const [path, value] of leaves(strings[locale])) {
      expect(typeof value, `${locale}.${path} should be a string`).toBe('string');
      expect((value as string).trim().length, `${locale}.${path} is empty`).toBeGreaterThan(0);
    }
  });

  it('t(locale) returns the strings record for that locale', () => {
    for (const locale of LOCALES) {
      expect(t(locale)).toBe(strings[locale]);
    }
  });
});
