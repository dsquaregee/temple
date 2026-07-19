import { describe, expect, it } from 'vitest';
import { colorAccentForTemple, colorForTemple } from './media';

const HEX = /^#[0-9a-fA-F]{6}$/;

describe('colorForTemple', () => {
  it('returns a valid 6-digit hex color', () => {
    expect(colorForTemple('brihadeeswarar')).toMatch(HEX);
  });

  it('is deterministic for a given id', () => {
    expect(colorForTemple('meenakshi-madurai')).toBe(
      colorForTemple('meenakshi-madurai'),
    );
  });

  it('differs across at least some ids (not a constant)', () => {
    const ids = [
      'brihadeeswarar',
      'meenakshi-madurai',
      'ramanathaswamy-rameswaram',
      'nataraja-chidambaram',
      'srikalahasti',
    ];
    const colors = new Set(ids.map(colorForTemple));
    expect(colors.size).toBeGreaterThan(1);
  });
});

describe('colorAccentForTemple', () => {
  it('returns a valid hex color', () => {
    expect(colorAccentForTemple('brihadeeswarar')).toMatch(HEX);
  });

  it('is deterministic and distinct from the base tone', () => {
    const base = colorForTemple('brihadeeswarar');
    const accent = colorAccentForTemple('brihadeeswarar');
    expect(accent).toMatch(HEX);
    // The accent is offset within the palette, so for a 10-tone palette it is
    // always a different entry than the base.
    expect(accent).not.toBe(base);
  });
});
