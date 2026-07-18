'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  ERAS,
  matchesQuery,
  regionsOf,
  t,
  templeEra,
  type Circuit,
  type Era,
  type Locale,
  type Temple,
} from '@temple/core';
import { TempleCard } from './cards';
import { SaveButton } from './SaveButton';
import { useFavorites } from '@/lib/favorites';

const ERA_KEY = {
  early: 'eraEarly',
  classical: 'eraClassical',
  later: 'eraLater',
} as const satisfies Record<Era, string>;

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
  temples: Temple[];
  circuits: Pick<Circuit, 'id' | 'name'>[];
}) {
  const d = t(locale).discover;
  const regions = useMemo(() => regionsOf(temples), [temples]);

  const [query, setQuery] = useState('');
  // Seed the search from a ?q= param (the WebSite sitelinks searchbox targets
  // this, and it makes searches shareable). Runs after mount, so server and
  // client both first render the empty state — no hydration mismatch.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('q');
    if (q) setQuery(q);
  }, []);

  const [circuit, setCircuit] = useState<string>('all');
  const [region, setRegion] = useState<string>('all');
  const [era, setEra] = useState<Era | 'all'>('all');
  const [unescoOnly, setUnescoOnly] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);

  const { ids: savedIds, ready: favReady } = useFavorites();

  const results = useMemo(
    () =>
      temples.filter((tp) => {
        if (!matchesQuery(tp, query)) return false;
        if (circuit !== 'all' && !tp.circuits.includes(circuit)) return false;
        if (region !== 'all' && tp.location.state !== region) return false;
        if (era !== 'all' && templeEra(tp.century) !== era) return false;
        if (unescoOnly && !tp.unesco) return false;
        if (savedOnly && !savedIds.includes(tp.id)) return false;
        return true;
      }),
    [temples, query, circuit, region, era, unescoOnly, savedOnly, savedIds],
  );

  const filtersActive =
    query.trim() !== '' ||
    circuit !== 'all' ||
    region !== 'all' ||
    era !== 'all' ||
    unescoOnly ||
    savedOnly;

  function reset() {
    setQuery('');
    setCircuit('all');
    setRegion('all');
    setEra('all');
    setUnescoOnly(false);
    setSavedOnly(false);
  }

  return (
    <div className="discover">
      <input
        type="search"
        className="searchinput"
        placeholder={d.searchPlaceholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
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
            <div key={tp.id} className="cardwrap">
              <TempleCard locale={locale} temple={tp} />
              <SaveButton locale={locale} id={tp.id} className="card-save" />
            </div>
          ))}
        </div>
      ) : (
        <p className="empty">{d.none}</p>
      )}
    </div>
  );
}
