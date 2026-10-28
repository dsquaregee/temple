// Feature-usage analytics: a tiny, privacy-light event counter. The site beacons
// an event name (no PII, no identifiers) and the Worker increments per-event
// totals and per-day counts in KV. A fixed whitelist means the store can only
// ever hold these counters. Read back via GET /stats.
//
// Counters use read-modify-write (KV has no atomic increment), so under heavy
// concurrency a few increments can be lost — fine for an approximate "which
// features get used" signal, which is all this is for.

export const TRACKABLE = [
  'nearby_city', // picked a city in Discover "Near me"
  'listen_play', // started narration on the Listen tab
  'share', // used the Share button
  'offline_download', // downloaded a temple/circuit for offline
  'remind_enable', // turned on festival push reminders
  'festival_cal', // added a festival to their calendar (.ics)
] as const;

export type TrackEvent = (typeof TRACKABLE)[number];

export function isTrackable(name: unknown): name is TrackEvent {
  return typeof name === 'string' && (TRACKABLE as readonly string[]).includes(name);
}

export const STAT_PREFIX = 'stat:';
export const totalKey = (name: string): string => `${STAT_PREFIX}${name}:total`;
export const dayKey = (name: string, day: string): string => `${STAT_PREFIX}${name}:${day}`;
