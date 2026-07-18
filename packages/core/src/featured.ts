// Deterministic daily-rotation helpers for "temple of the day"-style features.
// Pure so the caller owns the clock: the web app renders a build-time default
// on the server and re-picks for the visitor's actual day on the client (a
// static export can't recompute per request); the mobile app picks at runtime
// on the device.

/** Whole-day count since the Unix epoch (UTC). */
export function epochDay(date: Date): number {
  return Math.floor(date.getTime() / 86_400_000);
}

// Stable index into a list of `length` for a given whole-day number. Wraps over
// the list and handles negatives, so the pick advances by one each day and
// repeats once the catalog is exhausted.
export function indexOfDay(length: number, dayNumber: number): number {
  if (length <= 0) return 0;
  const day = Math.floor(dayNumber);
  return ((day % length) + length) % length;
}
