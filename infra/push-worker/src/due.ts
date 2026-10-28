// Which festivals to notify about on a given day. Pure and dependency-free so it
// is unit-tested without the Workers runtime.

export type FestivalDates = Record<string, string[]>;

/** A local-time Date as YYYY-MM-DD. */
export function isoDay(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Whole days from ISO `a` to ISO `b` (b - a); negative if b is before a. */
export function daysBetween(a: string, b: string): number {
  const da = Date.parse(`${a}T00:00:00Z`);
  const db = Date.parse(`${b}T00:00:00Z`);
  return Math.round((db - da) / 86400000);
}

/**
 * Festivals whose next observance is within `leadDays` of `today` (inclusive of
 * today, exclusive of dates already past). Returns `{ key, date }` so the caller
 * can dedupe sends per festival-date. `leadDays` = 3 means "notify up to three
 * days before".
 */
export function dueFestivals(
  dates: FestivalDates,
  today: string,
  leadDays: number,
): { key: string; date: string }[] {
  const out: { key: string; date: string }[] = [];
  for (const [key, list] of Object.entries(dates)) {
    const next = list.find((d) => d >= today);
    if (!next) continue;
    const delta = daysBetween(today, next);
    if (delta >= 0 && delta <= leadDays) out.push({ key, date: next });
  }
  return out;
}
