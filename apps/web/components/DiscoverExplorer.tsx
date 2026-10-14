'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  ERAS,
  SORTS,
  filterTemples,
  sortTemples,
  t,
  type Circuit,
  type Era,
  type Locale,
  type SortKey,
  type TempleCardData,
} from '@temple/core';
import { SavableTempleCard } from './SavableTempleCard';
import { useFavorites } from '@/lib/favorites';

const ERA_KEY = {
  early: 'eraEarly',
  classical: 'eraClassical',
  later: 'eraLater',
} as const satisfies Record<Era, string>;

const SORT_KEY = {
  featured: 'sortFeatured',
  'chrono-asc': 'sortOldest',
  'chrono-desc': 'sortNewest',
  name: 'sortName',
} as const satisfies Record<SortKey, string>;

// A single tappable filter option. Renders as a real <button> so the facets are
// keyboard-operable. Each static Discover page server-renders one page of the
// catalogue (all filters start "off"), and the pager links every page, so
// search-engine crawlers and no-JS clients reach every temple.
function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={active ? 'fchip is-active' : 'fchip'}
      aria-pressed={active}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Facet({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="facet">
      <span className="facet__label">{label}</span>
      {children}
    </div>
  );
}

// Client-side search + faceted filtering for the Discover tab. The page ships
// only its own slice of cards (`initial`); the first time a visitor searches,
// filters or re-sorts, the whole locale catalogue is fetched once
// (/catalog/<locale>.json, card fields only) and all filtering then runs in
// memory over it — instant, and offline once cached. Until it arrives, the
// filters apply to the visible page so the UI never blocks.
export function DiscoverExplorer({
  locale,
  initial,
  total,
  regions,
  circuits,
  pager,
}: {
  locale: Locale;
  initial: TempleCardData[];
  total: number;
  regions: string[];
  circuits: Pick<Circuit, 'id' | 'name'>[];
  pager?: ReactNode;
}) {
  const d = t(locale).discover;

  const [catalog, setCatalog] = useState<TempleCardData[] | null>(null);
  const catalogRequested = useRef(false);
  const loadCatalog = useCallback(() => {
    if (catalogRequested.current) return;
    catalogRequested.current = true;
    fetch(`/catalog/${locale}.json`)
      .then((r) => (r.ok ? (r.json() as Promise<TempleCardData[]>) : null))
      .then((data) => {
        if (data) setCatalog(data);
        else catalogRequested.current = false;
      })
      .catch(() => {
        catalogRequested.current = false; // allow a later attempt after a transient failure
      });
  }, [locale]);

  const [query, setQuery] = useState('');

  // The deity/tradition/style/period search text is kept off the listing payload
  // (see TempleCardData); it loads lazily as a per-locale index the first time
  // the user engages the search box. Until then, search spans the card fields
  // (name, native name, town, state, dynasty); once loaded, results recompute to
  // also span the off-card fields. Fetched at most once; a failure is retryable.
  const [searchIndex, setSearchIndex] = useState<Readonly<Record<string, string>> | null>(null);
  const indexRequested = useRef(false);
  const loadSearchIndex = useCallback(() => {
    if (indexRequested.current) return;
    indexRequested.current = true;
    fetch(`/search/${locale}.json`)
      .then((r) => (r.ok ? (r.json() as Promise<Record<string, string>>) : null))
      .then((data) => {
        if (data) setSearchIndex(data);
      })
      .catch(() => {
        indexRequested.current = false; // allow a later attempt after a transient failure
      });
  }, [locale]);

  // Seed the search from a ?q= param (the WebSite sitelinks searchbox targets
  // this, and it makes searches shareable). Runs after mount, so server and
  // client both first render the empty state — no hydration mismatch. A shared
  // query may target an off-card field (e.g. a deity), so load the index too.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('q');
    if (q) {
      setQuery(q);
      loadSearchIndex();
      loadCatalog();
    }
  }, [loadSearchIndex, loadCatalog]);

  const [circuit, setCircuit] = useState<string>('all');
  const [region, setRegion] = useState<string>('all');
  const [era, setEra] = useState<Era | 'all'>('all');
  const [unescoOnly, setUnescoOnly] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>('featured');

  const { ids: savedIds, ready: favReady } = useFavorites();

  const filtersActive =
    query.trim() !== '' ||
    circuit !== 'all' ||
    region !== 'all' ||
    era !== 'all' ||
    unescoOnly ||
    savedOnly ||
    sort !== 'featured';

  // Any active filter or sort spans the whole catalogue (once loaded); with no
  // filters the page shows its own static slice and the pager.
  useEffect(() => {
    if (filtersActive) loadCatalog();
  }, [filtersActive, loadCatalog]);
  const base = filtersActive && catalog ? catalog : initial;
  const loading = filtersActive && !catalog;

  const results = useMemo(
    () =>
      sortTemples(
        filterTemples(base, {
          query,
          circuit,
          region,
          era,
          unescoOnly,
          savedIds: savedOnly ? savedIds : null,
          searchIndex,
        }),
        sort,
        locale,
      ),
    [base, query, circuit, region, era, unescoOnly, savedOnly, savedIds, sort, locale, searchIndex],
  );

  function reset() {
    setQuery('');
    setCircuit('all');
    setRegion('all');
    setEra('all');
    setUnescoOnly(false);
    setSavedOnly(false);
    setSort('featured');
  }

  return (
    <div className="discover">
      <input
        type="search"
        className="searchinput"
        placeholder={d.searchPlaceholder}
        value={query}
        onFocus={() => {
          loadSearchIndex();
          loadCatalog();
        }}
        onChange={(e) => {
          loadSearchIndex();
          setQuery(e.target.value);
        }}
        aria-label={d.searchPlaceholder}
      />

      {circuits.length > 0 && (
        <Facet label={d.circuit}>
          <FilterChip active={circuit === 'all'} onClick={() => setCircuit('all')}>
            {d.all}
          </FilterChip>
          {circuits.map((c) => (
            <FilterChip
              key={c.id}
              active={circuit === c.id}
              onClick={() => setCircuit(c.id)}
            >
              {c.name}
            </FilterChip>
          ))}
        </Facet>
      )}

      {regions.length > 1 && (
        <Facet label={d.region}>
          <FilterChip active={region === 'all'} onClick={() => setRegion('all')}>
            {d.all}
          </FilterChip>
          {regions.map((r) => (
            <FilterChip key={r} active={region === r} onClick={() => setRegion(r)}>
              {r}
            </FilterChip>
          ))}
        </Facet>
      )}

      <Facet label={d.era}>
        <FilterChip active={era === 'all'} onClick={() => setEra('all')}>
          {d.all}
        </FilterChip>
        {ERAS.map((e) => (
          <FilterChip key={e} active={era === e} onClick={() => setEra(e)}>
            {d[ERA_KEY[e]]}
          </FilterChip>
        ))}
      </Facet>

      <Facet label={d.sort}>
        {SORTS.map((s) => (
          <FilterChip key={s} active={sort === s} onClick={() => setSort(s)}>
            {d[SORT_KEY[s]]}
          </FilterChip>
        ))}
      </Facet>

      <div className="filterbar">
        <FilterChip active={unescoOnly} onClick={() => setUnescoOnly((v) => !v)}>
          {d.unescoOnly}
        </FilterChip>
        {favReady && savedIds.length > 0 && (
          <FilterChip active={savedOnly} onClick={() => setSavedOnly((v) => !v)}>
            ★ {t(locale).favorites.saved}
          </FilterChip>
        )}
        <span className="results-count" aria-live="polite">
          {filtersActive ? results.length : total} {d.results}
          {loading && <span className="muted"> · {d.loading}</span>}
        </span>
        {filtersActive && (
          <button type="button" className="clearbtn" onClick={reset}>
            {d.clear}
          </button>
        )}
      </div>

      {results.length > 0 ? (
        <div className="grid">
          {results.map((tp) => (
            <SavableTempleCard key={tp.id} locale={locale} temple={tp} />
          ))}
        </div>
      ) : (
        <p className="empty">{loading ? d.loading : d.none}</p>
      )}

      {!filtersActive && pager}
    </div>
  );
}
