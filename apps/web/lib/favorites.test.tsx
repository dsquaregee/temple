// @vitest-environment jsdom
import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useFavorites } from './favorites';

// Drive the hook from a throwaway component and expose its return value so the
// test can call `toggle`/`has` and read `ids`/`ready` after each render.
function harness() {
  const ref: { current: ReturnType<typeof useFavorites> | null } = { current: null };
  function Probe() {
    ref.current = useFavorites();
    return null;
  }
  render(<Probe />);
  return ref as { current: ReturnType<typeof useFavorites> };
}

beforeEach(() => localStorage.clear());
afterEach(() => localStorage.clear());

describe('useFavorites', () => {
  it('starts empty and becomes ready after mount', () => {
    const h = harness();
    expect(h.current.ids).toEqual([]);
    expect(h.current.ready).toBe(true);
  });

  it('toggles an id on and off, persisting to localStorage', () => {
    const h = harness();
    act(() => h.current.toggle('brihadeeswarar'));
    expect(h.current.ids).toEqual(['brihadeeswarar']);
    expect(h.current.has('brihadeeswarar')).toBe(true);
    expect(JSON.parse(localStorage.getItem('temple:saved:v1')!)).toEqual([
      'brihadeeswarar',
    ]);

    act(() => h.current.toggle('brihadeeswarar'));
    expect(h.current.ids).toEqual([]);
    expect(h.current.has('brihadeeswarar')).toBe(false);
  });

  it('loads pre-existing favorites from storage on mount', () => {
    localStorage.setItem('temple:saved:v1', JSON.stringify(['meenakshi-madurai']));
    const h = harness();
    expect(h.current.ids).toEqual(['meenakshi-madurai']);
  });

  it('keeps independent hook instances in sync via the change event', () => {
    const a = harness();
    const b = harness();
    act(() => a.current.toggle('nataraja-chidambaram'));
    // The second instance listens for the same-tab change event and updates.
    expect(b.current.has('nataraja-chidambaram')).toBe(true);
  });

  it('ignores corrupt storage payloads instead of throwing', () => {
    localStorage.setItem('temple:saved:v1', '{not json');
    const h = harness();
    expect(h.current.ids).toEqual([]);
  });
});
