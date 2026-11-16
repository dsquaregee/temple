import type { TempleStay } from './types';

// Today in UTC as an ISO date (YYYY-MM-DD). Used to expire sponsored listings
// at build time; UTC is fine at day granularity for a listing window.
export function isoToday(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

// The stays to actually show for a temple: drop any whose `until` date has
// passed (on/after `until` the listing is hidden). Non-sponsored / open-ended
// listings (no `until`) always show. Order is preserved.
export function activeStays(
  stays: TempleStay[] | undefined,
  today: string = isoToday(),
): TempleStay[] {
  if (!stays || stays.length === 0) return [];
  return stays.filter((s) => !s.until || s.until > today);
}
