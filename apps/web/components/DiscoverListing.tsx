import Link from 'next/link';
import { regionsOf, t, toCardData, type Locale } from '@temple/core';
import { getCircuits, getTemples } from '@temple/content';
import { absUrl, breadcrumbList, collectionPage } from '@/lib/jsonld';
import { PageChrome } from '@/components/PageChrome';
import { JsonLd } from '@/components/JsonLd';
import { DiscoverExplorer } from '@/components/DiscoverExplorer';

// Cards server-rendered per Discover page. The catalogue is split into static
// pages (/temples/, /temples/page/2/, …) so each page's HTML stays the same size
// however large the catalogue grows; every temple is still linked from a
// crawlable, no-JS page. Search, facets and sorting load the whole catalogue
// on demand (/catalog/<locale>.json — see app/catalog/[file]/route.ts).
export const DISCOVER_PAGE_SIZE = 48;

export function discoverPageCount(locale: Locale): number {
  return Math.max(1, Math.ceil(getTemples(locale).length / DISCOVER_PAGE_SIZE));
}

export function discoverPath(locale: Locale, page: number): string {
  return page <= 1 ? `${locale}/temples/` : `${locale}/temples/page/${page}/`;
}

export function DiscoverListing({ locale, page }: { locale: Locale; page: number }) {
  const ui = t(locale);
  const all = getTemples(locale);
  const pageCount = discoverPageCount(locale);
  const slice = all.slice((page - 1) * DISCOVER_PAGE_SIZE, page * DISCOVER_PAGE_SIZE);
  // Only id + name are needed for the circuit facet chips; the full circuit
  // objects carry prose we don't want to serialize into the page payload.
  const circuits = getCircuits(locale).map((c) => ({ id: c.id, name: c.name }));
  const regions = regionsOf(all.map(toCardData));
  const path = discoverPath(locale, page);

  const collectionJsonLd = collectionPage({
    name: page > 1 ? `${ui.tabs.discover} — ${ui.discover.page} ${page}` : ui.tabs.discover,
    url: absUrl(path),
    items: slice.map((tp) => ({ name: tp.name, path: `${locale}/temples/${tp.id}/` })),
  });
  const breadcrumbs = breadcrumbList([
    { name: ui.tabs.home, path: `${locale}/` },
    { name: ui.tabs.discover, path: `${locale}/temples/` },
  ]);

  const pager =
    pageCount > 1 ? (
      <nav className="pager" aria-label={ui.discover.page}>
        {page > 1 ? (
          <Link className="pager__link" href={`/${discoverPath(locale, page - 1)}`} rel="prev">
            ← {ui.discover.pagePrev}
          </Link>
        ) : (
          <span className="pager__link is-disabled" aria-hidden="true">← {ui.discover.pagePrev}</span>
        )}
        <span className="pager__pages">
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) =>
            n === page ? (
              <span key={n} className="pager__num is-current" aria-current="page">{n}</span>
            ) : (
              <Link key={n} className="pager__num" href={`/${discoverPath(locale, n)}`}>{n}</Link>
            )
          )}
        </span>
        {page < pageCount ? (
          <Link className="pager__link" href={`/${discoverPath(locale, page + 1)}`} rel="next">
            {ui.discover.pageNext} →
          </Link>
        ) : (
          <span className="pager__link is-disabled" aria-hidden="true">{ui.discover.pageNext} →</span>
        )}
      </nav>
    ) : null;

  return (
    <PageChrome locale={locale} active="discover" pathSuffix={path.slice(locale.length + 1)}>
      <JsonLd data={collectionJsonLd} />
      <JsonLd data={breadcrumbs} />
      <div className="pagehead">
        <h1>{ui.tabs.discover}</h1>
        <p className="muted">
          {all.length} {ui.labels.allTemples.toLowerCase()}
          {pageCount > 1 && ` · ${ui.discover.page} ${page} / ${pageCount}`}
        </p>
      </div>

      {/* Project to card data so the section/visit prose is not serialized
          into this client component's hydration payload. */}
      <DiscoverExplorer
        locale={locale}
        initial={slice.map(toCardData)}
        total={all.length}
        regions={regions}
        circuits={circuits}
        pager={pager}
      />
    </PageChrome>
  );
}
