import type { Temple } from './types';

// The minimal shape the Listen player needs from a temple. Projecting to this
// (like `toCardData` for Discover) keeps the long-form prose, hero, and visit
// data off the client payload the Listen tab serializes for hydration.
export interface ListenItem {
  id: string;
  name: string;
  nativeName: string;
  audio?: { storyUrl: string; durationSec: number };
}

export function toListenItem(temple: Temple): ListenItem {
  return {
    id: temple.id,
    name: temple.name,
    nativeName: temple.nativeName,
    audio: temple.audio
      ? { storyUrl: temple.audio.storyUrl, durationSec: temple.audio.durationSec }
      : undefined,
  };
}

// Partition a locale's temples into the narrated playlist (audio ready, source
// order preserved) and the ones still awaiting narration ("coming soon").
export function buildPlaylist<T extends { audio?: unknown }>(
  temples: T[],
): { ready: T[]; upcoming: T[] } {
  const ready: T[] = [];
  const upcoming: T[] = [];
  for (const temple of temples) (temple.audio ? ready : upcoming).push(temple);
  return { ready, upcoming };
}

// Step to the next/previous index in a list of length `len`, wrapping around
// both ends. `delta` is typically +1 (next) or -1 (previous). Returns 0 for an
// empty or single-item list so callers can index safely.
export function stepIndex(current: number, delta: number, len: number): number {
  if (len <= 0) return 0;
  return (((current + delta) % len) + len) % len;
}

// Format a number of seconds as `m:ss` (e.g. 75 → "1:15"). Non-finite or
// negative inputs clamp to "0:00" — `<audio>.duration` is NaN before metadata
// loads, and the now-playing bar must still render.
export function formatTime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return '0:00';
  const whole = Math.floor(totalSeconds);
  const minutes = Math.floor(whole / 60);
  const seconds = whole % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
