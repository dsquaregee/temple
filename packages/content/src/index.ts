import type { Circuit, Festival, Locale, TamilMonth, Temple } from '@temple/core';
import { detectFestivals, FESTIVAL_BY_KEY, FESTIVALS, TAMIL_MONTHS } from '@temple/core';
import { circuitData, templeData } from './generated';

export function getTemples(locale: Locale): Temple[] {
  return templeData
    .filter((t) => t.locale === locale)
    .sort((a, b) => a.century - b.century || a.name.localeCompare(b.name));
}

export function getTemple(locale: Locale, id: string): Temple | undefined {
  return templeData.find((t) => t.locale === locale && t.id === id);
}

export function getCircuits(locale: Locale): Circuit[] {
  return circuitData
    .filter((c) => c.locale === locale)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getCircuit(locale: Locale, id: string): Circuit | undefined {
  return circuitData.find((c) => c.locale === locale && c.id === id);
}

export function getCircuitTemples(locale: Locale, circuit: Circuit): Temple[] {
  return circuit.stops
    .map((id) => getTemple(locale, id))
    .filter((t): t is Temple => Boolean(t));
}

export interface FestivalEntry {
  festival: Festival;
  temples: Temple[];
}
export interface FestivalCalendarMonth {
  month: TamilMonth;
  festivals: FestivalEntry[];
}

// Festival calendar: which temples celebrate each major festival, grouped by
// Tamil month in calendar order. Detection runs once over the English prose
// (the source of truth); temples are then projected into the requested locale
// for display. Months and festivals with no matching temple are omitted.
export function getFestivalCalendar(locale: Locale): FestivalCalendarMonth[] {
  const byFestival: Record<string, string[]> = {};
  for (const temple of getTemples('en')) {
    for (const key of detectFestivals(temple.sections?.festivals)) {
      (byFestival[key] ??= []).push(temple.id);
    }
  }
  const calendar: FestivalCalendarMonth[] = [];
  for (const month of TAMIL_MONTHS) {
    const festivals: FestivalEntry[] = [];
    for (const festival of FESTIVALS.filter((f) => f.month === month.key)) {
      const ids = byFestival[festival.key] ?? [];
      if (ids.length === 0) continue;
      const temples = ids
        .map((id) => getTemple(locale, id))
        .filter((t): t is Temple => Boolean(t))
        .sort((a, b) => a.name.localeCompare(b.name));
      if (temples.length > 0) festivals.push({ festival, temples });
    }
    if (festivals.length > 0) calendar.push({ month, festivals });
  }
  return calendar;
}

/** The temples that celebrate a single festival, in the requested locale. */
export function getFestivalTemples(locale: Locale, key: string): Temple[] {
  if (!FESTIVAL_BY_KEY[key]) return [];
  return getTemples('en')
    .filter((t) => detectFestivals(t.sections?.festivals).includes(key))
    .map((t) => getTemple(locale, t.id))
    .filter((t): t is Temple => Boolean(t))
    .sort((a, b) => a.name.localeCompare(b.name));
}
