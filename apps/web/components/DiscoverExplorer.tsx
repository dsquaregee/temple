'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  ERAS,
  SORTS,
  filterTemples,
  regionsOf,
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
// keyboard-operable; the SSG page still ships every temple in its initial
// markup (all filters start "off"), so search-engine crawlers and no-JS clients
// see the full catalog before this hydrates.
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

// Client-side search + faceted filtering for the Discover tab. All filtering is
// in-memory over the already-loaded locale catalog — no network, instant, and
// works offline once the shell is cached.
export function DiscoverExplorer({
  locale,
  temples,
  circuits,
}: {
  locale: Locale;
  temples: TempleCardData[];
  circuits: Pick<Circuit, 'id' | 'name'>[];
}) {
  const d = t(locale).discover;
  const regions = useMemo(() => regionsOf(temples), [temples]);

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
    }
  }, [loadSearchIndex]);

  const [circuit, setCircuit] = useState<string>('all');
  const [region, setRegion] = useState<string>('all');
  const [era, setEra] = useState<Era | 'all'>('all');
  const [unescoOnly, setUnescoOnly] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>('featured');

  const { ids: savedIds, ready: favReady } = useFavorites();

  const results = useMemo(
    () =>
      sortTemples(
        filterTemples(temples, {
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
    [temples, query, circuit, region, era, unescoOnly, savedOnly, savedIds, sort, locale, searchIndex],
  );

  const filtersActive =
    query.trim() !== '' ||
    circuit !== 'all' ||
    region !== 'all' ||
    era !== 'all' ||
    unescoOnly ||
    savedOnly ||
    sort !== 'featured';

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
        onFocus={loadSearchIndex}
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
          {results.length} {d.results}
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
        <p className="empty">{d.none}</p>
      )}
    </div>
  );
}
