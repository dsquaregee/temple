import type { Circuit, Locale, Temple } from '@temple/core';
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
