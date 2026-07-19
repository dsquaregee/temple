import { test } from 'node:test';
import assert from 'node:assert/strict';
import { strings, t } from '../src/i18n.ts';
import { LOCALES } from '../src/types.ts';

// Collect every leaf key path (e.g. "tabs.home") of a nested string object, so
// two locales can be compared for exact structural parity.
function keyPaths(obj: unknown, prefix = ''): string[] {
  if (obj === null || typeof obj !== 'object') return [prefix];
  return Object.entries(obj as Record<string, unknown>)
    .flatMap(([k, v]) => keyPaths(v, prefix ? `${prefix}.${k}` : k))
    .sort();
}

test('every declared locale has a strings table', () => {
  for (const locale of LOCALES) {
    assert.ok(strings[locale], `missing strings for ${locale}`);
  }
});

test('every locale mirrors the English key structure exactly', () => {
  const enKeys = keyPaths(strings.en);
  for (const locale of LOCALES) {
    assert.deepEqual(
      keyPaths(strings[locale]),
      enKeys,
      `locale ${locale} key set differs from en`,
    );
  }
});

test('no UI string is empty in any locale', () => {
  for (const locale of LOCALES) {
    const flat = keyPaths(strings[locale]);
    for (const path of flat) {
      const value = path
        .split('.')
        .reduce<any>((o, k) => o?.[k], strings[locale]);
      assert.equal(typeof value, 'string', `${locale}.${path} not a string`);
      assert.ok(value.trim().length > 0, `${locale}.${path} is empty`);
    }
  }
});

test('each locale names itself in its own script (languageName)', () => {
  // English is the only one whose languageName is Latin script.
  assert.equal(strings.en.labels.languageName, 'English');
  for (const locale of LOCALES) {
    assert.ok(strings[locale].labels.languageName.trim().length > 0);
  }
});

test('t() returns the requested locale and falls back to en', () => {
  assert.equal(t('ta'), strings.ta);
  assert.equal(t('hi'), strings.hi);
  // Defensive fallback for a bad locale at runtime (cast around the type).
  assert.equal(t('xx' as any), strings.en);
});
