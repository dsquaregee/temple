import type { Temple } from './types';

// Discovery/faceting helpers shared by the web and mobile Discover tabs so both
// apps bucket eras and match search queries identically. Kept dependency-free
// (pure functions over the localized Temple objects) — no locale-specific
// lowercasing beyond String.toLowerCase, which is adequate for the Indic
// scripts we ship (they have no case) and for Latin/English.

export type Era = 'early' | 'classical' | 'later';

// Display order for era facets, oldest first.
export const ERAS: readonly Era[] = ['early', 'classical', 'later'] as const;

// Bucket a temple by the century its principal structure dates to. Boundaries:
//   early     — up to the 7th century (pre-imperial-Chola foundations)
//   classical — 8th–13th century (the great Chola/Pandya temple-building era)
//   later     — 14th century onward (Vijayanagara/Nayak expansions)
export function templeEra(century: number): Era {
  if (century <= 7) return 'early';
  if (century <= 13) return 'classical';
  return 'later';
}

// Fields a free-text query searches across. Everything a devotee is likely to
// type — a temple name (in English or native script), a deity, a town, a
// dynasty — is covered.
function haystack(temple: Temple): string {
  const { location } = temple;
  return [
    temple.name,
    temple.nativeName,
    temple.deity,
    temple.tradition,
    temple.dynasty,
    temple.style,
    temple.period,
    location.city,
    location.state,
    temple.summary,
  ]
    .join(' ')
    .toLowerCase();
}

// True when every whitespace-separated token in the query appears somewhere in
// the temple's searchable text. Empty/whitespace queries match everything.
export function matchesQuery(temple: Temple, query: string): boolean {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;
  const hay = haystack(temple);
  return tokens.every((token) => hay.includes(token));
}

// Distinct region (state) values present in a set of temples, in first-seen
// order — used to build the region facet from whatever the catalog contains.
export function regionsOf(temples: Temple[]): string[] {
  const seen: string[] = [];
  for (const temple of temples) {
    if (!seen.includes(temple.location.state)) seen.push(temple.location.state);
  }
  return seen;
}
