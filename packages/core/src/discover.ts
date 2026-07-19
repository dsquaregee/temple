import type { Temple, TempleCardData } from './types';

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
function haystack(temple: TempleCardData): string {
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
export function matchesQuery(temple: TempleCardData, query: string): boolean {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;
  const hay = haystack(temple);
  return tokens.every((token) => hay.includes(token));
}

// Distinct region (state) values present in a set of temples, in first-seen
// order — used to build the region facet from whatever the catalog contains.
export function regionsOf(temples: TempleCardData[]): string[] {
  const seen: string[] = [];
  for (const temple of temples) {
    if (!seen.includes(temple.location.state)) seen.push(temple.location.state);
  }
  return seen;
}

// The Discover faceting state, shared by the web and mobile Discover tabs so
// the two apps filter identically. Any field left undefined (or 'all' for the
// single-choice facets) is treated as "no constraint". `savedIds`, when
// provided, restricts results to that set — the apps pass it only while the
// "saved only" toggle is on.
export interface TempleFilter {
  query?: string;
  circuit?: string | 'all';
  region?: string | 'all';
  era?: Era | 'all';
  unescoOnly?: boolean;
  savedIds?: readonly string[] | null;
}

// Apply the Discover facets to a catalog. Pure and order-preserving: the result
// keeps the input order, so callers can sort separately (see sortTemples).
// Generic over the element type so a projected TempleCardData[] in and a full
// Temple[] in each come back as the same type.
export function filterTemples<T extends TempleCardData>(temples: T[], filter: TempleFilter = {}): T[] {
  const { query = '', circuit = 'all', region = 'all', era = 'all', unescoOnly = false, savedIds = null } = filter;
  const saved = savedIds ? new Set(savedIds) : null;
  return temples.filter((tp) => {
    if (!matchesQuery(tp, query)) return false;
    if (circuit !== 'all' && !tp.circuits.includes(circuit)) return false;
    if (region !== 'all' && tp.location.state !== region) return false;
    if (era !== 'all' && templeEra(tp.century) !== era) return false;
    if (unescoOnly && !tp.unesco) return false;
    if (saved && !saved.has(tp.id)) return false;
    return true;
  });
}

// Ordering options offered on the Discover tab.
//   featured    — the catalog's own curated order (input order, unchanged)
//   chrono-asc  — oldest first (by century, then name)
//   chrono-desc — newest first
//   name        — alphabetical by localized name, honouring the locale's collation
export type SortKey = 'featured' | 'chrono-asc' | 'chrono-desc' | 'name';

// Display order for the sort control.
export const SORTS: readonly SortKey[] = ['featured', 'chrono-asc', 'chrono-desc', 'name'] as const;

// Return a new, sorted array (never mutates the input). `featured` is a stable
// copy of the input. `name` uses locale-aware collation so, e.g., Tamil names
// sort in Tamil order when the Tamil catalog is shown.
export function sortTemples<T extends Pick<Temple, 'century' | 'name'>>(
  temples: T[],
  sort: SortKey,
  locale?: string,
): T[] {
  const out = [...temples];
  switch (sort) {
    case 'chrono-asc':
      return out.sort((a, b) => a.century - b.century || a.name.localeCompare(b.name, locale));
    case 'chrono-desc':
      return out.sort((a, b) => b.century - a.century || a.name.localeCompare(b.name, locale));
    case 'name':
      return out.sort((a, b) => a.name.localeCompare(b.name, locale));
    case 'featured':
    default:
      return out;
  }
}

// Project a full Temple down to the fields the Discover listing needs, dropping
// the long-form prose and media. Use this before handing temples to the client
// Discover component so the catalog's section text is not serialized into the
// listing page's HTML.
export function toCardData(temple: Temple): TempleCardData {
  return {
    id: temple.id,
    name: temple.name,
    nativeName: temple.nativeName,
    deity: temple.deity,
    tradition: temple.tradition,
    dynasty: temple.dynasty,
    style: temple.style,
    period: temple.period,
    century: temple.century,
    unesco: temple.unesco,
    circuits: temple.circuits,
    summary: temple.summary,
    location: { city: temple.location.city, state: temple.location.state },
  };
}
