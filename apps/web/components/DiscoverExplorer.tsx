'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  ERAS,
  SORTS,
  ORIGIN_CITIES,
  ORIGIN_CITY_BY_NAME,
  filterTemples,
  sortTemples,
  haversineKm,
  t,
  type Circuit,
  type Era,
  type LatLng,
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

  // "Near me": once the visitor grants location, rank the catalogue by
  // great-circle distance. Coordinates are locale-independent and fetched once
  // (/geo/coords.json); the device location never leaves the browser.
  const [coords, setCoords] = useState<Readonly<Record<string, [number, number]>> | null>(null);
  const coordsRequested = useRef(false);
  const loadCoords = useCallback(() => {
    if (coordsRequested.current) return;
    coordsRequested.current = true;
    fetch('/geo/coords.json')
      .then((r) => (r.ok ? (r.json() as Promise<Record<string, [number, number]>>) : null))
      .then((data) => {
        if (data) setCoords(data);
        else coordsRequested.current = false;
      })
      .catch(() => {
        coordsRequested.current = false;
      });
  }, []);
  const [userLoc, setUserLoc] = useState<LatLng | null>(null);
  const [nearby, setNearby] = useState(false);
  const [geoStatus, setGeoStatus] = useState<'idle' | 'locating' | 'error'>('idle');
  // When the visitor picks a city instead of sharing GPS, its name (for the
  // "from <city>" note); empty when ranking from the device location.
  const [originCity, setOriginCity] = useState('');
  // A short explainer shown before the browser's own permission prompt ("prime"),
  // or actionable help when the browser has blocked location ("blocked").
  const [geoPanel, setGeoPanel] = useState<'none' | 'prime' | 'blocked'>('none');
  // Browser permission state, when the Permissions API is available (not Safari
  // < 16): lets us skip the explainer when already granted and show the
  // unblock-help when denied, instead of a silent failure.
  const geoPerm = useRef<'granted' | 'prompt' | 'denied' | 'unknown'>('unknown');
  useEffect(() => {
    const perms = typeof navigator !== 'undefined' ? navigator.permissions : undefined;
    if (!perms?.query) return;
    perms
      .query({ name: 'geolocation' as PermissionName })
      .then((s) => {
        geoPerm.current = s.state as typeof geoPerm.current;
        s.onchange = () => {
          geoPerm.current = s.state as typeof geoPerm.current;
        };
      })
      .catch(() => {});
  }, []);

  // Whether the app is running as an installed PWA (standalone) — the unblock
  // steps differ: an installed app has no address-bar lock icon, so location is
  // re-enabled from the device's app settings, not the browser.
  const [isStandalone, setIsStandalone] = useState(false);
  useEffect(() => {
    try {
      const standalone =
        window.matchMedia?.('(display-mode: standalone)').matches ||
        // iOS Safari home-screen apps.
        (navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsStandalone(!!standalone);
    } catch {
      /* ignore */
    }
  }, []);

  // Deep link from the Home "Temples near you" shortcut: open the explainer so
  // the visitor can grant location (or pick a city) with one tap.
  useEffect(() => {
    try {
      if (new URLSearchParams(window.location.search).get('near') === '1') {
        setGeoPanel('prime');
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Last granted position, so a return visit shows nearby instantly with no spinner
  // and no second prompt. Stored only on this device.
  const GEO_KEY = 'temple:geo:v1';
  const readCachedLoc = (): LatLng | null => {
    try {
      const raw = localStorage.getItem(GEO_KEY);
      if (!raw) return null;
      const o = JSON.parse(raw);
      if (typeof o.lat === 'number' && typeof o.lng === 'number') return { lat: o.lat, lng: o.lng };
    } catch {
      /* ignore */
    }
    return null;
  };

  // Actually ask the browser for the device location (triggers the native prompt
  // when permission is still "prompt"). Called from the explainer's button, or
  // directly when permission is already granted.
  const requestLocation = useCallback(() => {
    setGeoPanel('none');
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setGeoStatus('error');
      return;
    }
    setGeoStatus('locating');
    loadCoords();
    loadCatalog();
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLoc(loc);
        setNearby(true);
        setOriginCity('');
        setGeoStatus('idle');
        geoPerm.current = 'granted';
        try {
          localStorage.setItem(GEO_KEY, JSON.stringify({ ...loc, ts: Date.now() }));
        } catch {
          /* ignore */
        }
      },
      (err) => {
        setGeoStatus('error');
        setNearby(false);
        if (err && err.code === err.PERMISSION_DENIED) {
          geoPerm.current = 'denied';
          setGeoPanel('blocked');
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }, [loadCoords, loadCatalog]);

  // The "Near me" chip entry point. Toggles off if on; otherwise routes through
  // the explainer / unblock-help / cached-location fast paths.
  const onNearMe = useCallback(() => {
    if (nearby) {
      setNearby(false);
      setGeoPanel('none');
      setOriginCity('');
      return;
    }
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setGeoStatus('error');
      return;
    }
    if (geoPerm.current === 'denied') {
      setGeoPanel('blocked');
      return;
    }
    if (geoPerm.current === 'granted') {
      // Show the last location instantly (if any), then refresh silently.
      const cached = readCachedLoc();
      if (cached) {
        setUserLoc(cached);
        setNearby(true);
        loadCoords();
        loadCatalog();
      }
      requestLocation();
      return;
    }
    // "prompt" or unknown → explain first, so the native prompt isn't a surprise.
    setGeoPanel('prime');
  }, [nearby, requestLocation, loadCoords, loadCatalog]);

  // Fallback: rank by distance from a chosen city instead of the device — for
  // visitors who won't share GPS or whose browser blocks it. No prompt involved.
  const chooseCity = useCallback(
    (name: string) => {
      const city = ORIGIN_CITY_BY_NAME[name];
      if (!city) return;
      setUserLoc({ lat: city.lat, lng: city.lng });
      setOriginCity(city.name);
      setNearby(true);
      setGeoPanel('none');
      setGeoStatus('idle');
      loadCoords();
      loadCatalog();
    },
    [loadCoords, loadCatalog],
  );

  const { ids: savedIds, ready: favReady } = useFavorites();

  const filtersActive =
    query.trim() !== '' ||
    circuit !== 'all' ||
    region !== 'all' ||
    era !== 'all' ||
    unescoOnly ||
    savedOnly ||
    nearby ||
    sort !== 'featured';

  // Any active filter or sort spans the whole catalogue (once loaded); with no
  // filters the page shows its own static slice and the pager.
  useEffect(() => {
    if (filtersActive) loadCatalog();
  }, [filtersActive, loadCatalog]);
  // "Near me" also needs the catalogue (to rank every temple) and the coords.
  useEffect(() => {
    if (nearby) loadCoords();
  }, [nearby, loadCoords]);
  const base = filtersActive && catalog ? catalog : initial;
  const loading = (filtersActive && !catalog) || geoStatus === 'locating' || (nearby && !coords);

  const filtered = useMemo(
    () =>
      filterTemples(base, {
        query,
        circuit,
        region,
        era,
        unescoOnly,
        savedIds: savedOnly ? savedIds : null,
        searchIndex,
      }),
    [base, query, circuit, region, era, unescoOnly, savedOnly, savedIds, searchIndex],
  );

  const nearbyReady = nearby && userLoc !== null && coords !== null;

  // Distance (km) from the device to each filtered temple, when "Near me" is on.
  const distById = useMemo(() => {
    if (!nearbyReady) return null;
    const m: Record<string, number> = {};
    for (const tp of filtered) {
      const c = coords![tp.id];
      if (c) m[tp.id] = haversineKm(userLoc!, { lat: c[0], lng: c[1] });
    }
    return m;
  }, [nearbyReady, filtered, coords, userLoc]);

  const results = useMemo(() => {
    if (distById) {
      return filtered
        .filter((tp) => distById[tp.id] !== undefined)
        .sort((a, b) => distById[a.id]! - distById[b.id]!);
    }
    return sortTemples(filtered, sort, locale);
  }, [filtered, distById, sort, locale]);

  const nf = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const fmtKm = useCallback(
    (km: number) => {
      const v = km < 10 ? Math.round(km * 10) / 10 : Math.round(km);
      return `${nf.format(v)} km ${d.away}`;
    },
    [nf, d.away],
  );

  function reset() {
    setQuery('');
    setCircuit('all');
    setRegion('all');
    setEra('all');
    setUnescoOnly(false);
    setSavedOnly(false);
    setSort('featured');
    setNearby(false);
    setGeoStatus('idle');
    setGeoPanel('none');
    setOriginCity('');
  }

  // Labels for the collapsed accordion headers and the active-filter chips.
  const circuitName =
    circuit === 'all' ? d.all : circuits.find((c) => c.id === circuit)?.name ?? d.all;
  const eraLabel = era === 'all' ? d.all : d[ERA_KEY[era]];
  const anyFacetActive =
    circuit !== 'all' || region !== 'all' || era !== 'all' || unescoOnly || savedOnly || nearby;

  // The zero-permission fallback: rank from a chosen city. Shared by both geo panels.
  const citySelect = (
    <label className="geopanel__city">
      {d.orChooseCity}
      <select value="" onChange={(e) => chooseCity(e.target.value)} aria-label={d.chooseCity}>
        <option value="" disabled>
          {d.chooseCity}
        </option>
        {ORIGIN_CITIES.map((c) => (
          <option key={c.name} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <div className="discover">
      <button
        type="button"
        className={nearby ? 'nearme-cta is-active' : 'nearme-cta'}
        aria-pressed={nearby}
        onClick={onNearMe}
      >
        <span aria-hidden="true">📍</span>{' '}
        {nearby && originCity ? `${d.templesNearYou} · ${originCity}` : d.templesNearYou}
      </button>

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

      {geoPanel === 'prime' && (
        <div className="geopanel" role="group" aria-label={d.nearMe}>
          <p className="geopanel__why">{d.nearMeWhy}</p>
          <div className="geopanel__actions">
            <button type="button" className="geobtn geobtn--primary" onClick={requestLocation}>
              📍 {d.useMyLocation}
            </button>
            <button type="button" className="geobtn" onClick={() => setGeoPanel('none')}>
              {d.notNow}
            </button>
          </div>
          {citySelect}
        </div>
      )}

      {geoPanel === 'blocked' && (
        <div className="geopanel" role="group" aria-label={d.locationBlocked}>
          <p className="geopanel__why">
            <strong>{d.locationBlocked}</strong>
          </p>
          {/* Zero-permission path first — no settings hunt required. */}
          {citySelect}
          <p className="geopanel__steps muted">
            {isStandalone ? d.locationBlockedHowApp : d.locationBlockedHow}
          </p>
          <div className="geopanel__actions">
            <button type="button" className="geobtn geobtn--primary" onClick={requestLocation}>
              {d.nearMe}
            </button>
            <button type="button" className="geobtn" onClick={() => setGeoPanel('none')}>
              {d.notNow}
            </button>
          </div>
        </div>
      )}

      {/* Result count + sort + clear — always visible so the page leads with
          results, not a wall of filters. */}
      <div className="discover-controls">
        <span className="results-count" aria-live="polite">
          {filtersActive ? results.length : total} {d.results}
          {nearby && originCity && <span className="muted"> · {originCity}</span>}
          {loading && (
            <span className="muted"> · {geoStatus === 'locating' ? d.locating : d.loading}</span>
          )}
          {geoStatus === 'error' && geoPanel !== 'blocked' && (
            <span className="muted"> · {d.locationError}</span>
          )}
        </span>
        <label className="sortctl">
          <span className="sortctl__label">{d.sort}</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            {SORTS.map((s) => (
              <option key={s} value={s}>
                {d[SORT_KEY[s]]}
              </option>
            ))}
          </select>
        </label>
        {filtersActive && (
          <button type="button" className="clearbtn" onClick={reset}>
            {d.clear}
          </button>
        )}
      </div>

      {/* Active filters as removable chips, so what's applied is visible without
          opening the panels below. */}
      {anyFacetActive && (
        <div className="activefilters">
          {nearby && (
            <button type="button" className="afchip" onClick={() => { setNearby(false); setOriginCity(''); }}>
              📍 {originCity || d.nearMe} <span aria-hidden="true">✕</span>
            </button>
          )}
          {circuit !== 'all' && (
            <button type="button" className="afchip" onClick={() => setCircuit('all')}>
              {circuitName} <span aria-hidden="true">✕</span>
            </button>
          )}
          {region !== 'all' && (
            <button type="button" className="afchip" onClick={() => setRegion('all')}>
              {region} <span aria-hidden="true">✕</span>
            </button>
          )}
          {era !== 'all' && (
            <button type="button" className="afchip" onClick={() => setEra('all')}>
              {eraLabel} <span aria-hidden="true">✕</span>
            </button>
          )}
          {unescoOnly && (
            <button type="button" className="afchip" onClick={() => setUnescoOnly(false)}>
              {d.unescoOnly} <span aria-hidden="true">✕</span>
            </button>
          )}
          {savedOnly && (
            <button type="button" className="afchip" onClick={() => setSavedOnly(false)}>
              ★ {t(locale).favorites.saved} <span aria-hidden="true">✕</span>
            </button>
          )}
        </div>
      )}

      {/* Collapsible facets — native <details>, keyboard-accessible, no-JS safe.
          Collapsed by default so the long circuit/region lists don't bury the
          results; each header shows the current selection. */}
      <div className="facets">
        {circuits.length > 0 && (
          <details className="facetgroup">
            <summary>
              <span className="facetgroup__label">{d.circuit}</span>
              <span className="facetgroup__value">{circuitName}</span>
            </summary>
            <div className="facetgroup__body">
              <FilterChip active={circuit === 'all'} onClick={() => setCircuit('all')}>
                {d.all}
              </FilterChip>
              {circuits.map((c) => (
                <FilterChip key={c.id} active={circuit === c.id} onClick={() => setCircuit(c.id)}>
                  {c.name}
                </FilterChip>
              ))}
            </div>
          </details>
        )}

        {regions.length > 1 && (
          <details className="facetgroup">
            <summary>
              <span className="facetgroup__label">{d.region}</span>
              <span className="facetgroup__value">{region === 'all' ? d.all : region}</span>
            </summary>
            <div className="facetgroup__body">
              <FilterChip active={region === 'all'} onClick={() => setRegion('all')}>
                {d.all}
              </FilterChip>
              {regions.map((r) => (
                <FilterChip key={r} active={region === r} onClick={() => setRegion(r)}>
                  {r}
                </FilterChip>
              ))}
            </div>
          </details>
        )}

        <details className="facetgroup">
          <summary>
            <span className="facetgroup__label">{d.era}</span>
            <span className="facetgroup__value">{eraLabel}</span>
          </summary>
          <div className="facetgroup__body">
            <FilterChip active={era === 'all'} onClick={() => setEra('all')}>
              {d.all}
            </FilterChip>
            {ERAS.map((e) => (
              <FilterChip key={e} active={era === e} onClick={() => setEra(e)}>
                {d[ERA_KEY[e]]}
              </FilterChip>
            ))}
          </div>
        </details>

        <details className="facetgroup">
          <summary>
            <span className="facetgroup__label">{d.unescoOnly}</span>
            <span className="facetgroup__value">
              {[unescoOnly ? d.unescoOnly : null, savedOnly ? t(locale).favorites.saved : null]
                .filter(Boolean)
                .join(', ') || d.all}
            </span>
          </summary>
          <div className="facetgroup__body">
            <FilterChip active={unescoOnly} onClick={() => setUnescoOnly((v) => !v)}>
              {d.unescoOnly}
            </FilterChip>
            {favReady && savedIds.length > 0 && (
              <FilterChip active={savedOnly} onClick={() => setSavedOnly((v) => !v)}>
                ★ {t(locale).favorites.saved}
              </FilterChip>
            )}
          </div>
        </details>
      </div>

      {results.length > 0 ? (
        <div className="grid">
          {results.map((tp) => (
            <SavableTempleCard
              key={tp.id}
              locale={locale}
              temple={tp}
              badge={distById && distById[tp.id] !== undefined ? fmtKm(distById[tp.id]!) : undefined}
            />
          ))}
        </div>
      ) : (
        <p className="empty">{loading ? d.loading : d.none}</p>
      )}

      {!filtersActive && pager}
    </div>
  );
}
