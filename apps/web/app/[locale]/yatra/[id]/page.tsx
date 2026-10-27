import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { t, type Locale } from '@temple/core';
import { getCircuit, getCircuitTemples, getCircuits } from '@temple/content';
import { LOCALES } from '@/lib/locales';
import { absUrl, breadcrumbList } from '@/lib/jsonld';
import { PageChrome } from '@/components/PageChrome';
import { JsonLd } from '@/components/JsonLd';
import { CircuitMap } from '@/components/CircuitMap';
import { resolveGroups, StopCards } from '@/components/CircuitStops';
import { OfflineButton } from '@/components/OfflineButton';

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    getCircuits(locale).map((circuit) => ({ locale, id: circuit.id }))
  );
}

export function generateMetadata({
  params,
}: {
  params: { locale: Locale; id: string };
}): Metadata {
  const circuit = getCircuit(params.locale, params.id);
  if (!circuit) return {};
  return {
    title: circuit.name,
    description: circuit.description,
    alternates: {
      canonical: `/${params.locale}/yatra/${circuit.id}/`,
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, `/${l}/yatra/${circuit.id}/`])
      ),
    },
  };
}

export default function CircuitDetail({
  params,
}: {
  params: { locale: Locale; id: string };
}) {
  const { locale, id } = params;
  const circuit = getCircuit(locale, id);
  if (!circuit) notFound();
  const ui = t(locale);
  const stops = getCircuitTemples(locale, circuit);
  // Large circuits (e.g. the Divya Desams) are split into regional pages.
  const groups = resolveGroups(circuit, stops);

  // TouristTrip with an ordered itinerary — lets Google understand a circuit as
  // a real multi-stop pilgrimage route. For a grouped circuit the itinerary
  // lists the regions (each links to its own page, which carries the granular
  // per-temple ItemList); inlining all stops here would duplicate that data and,
  // on the largest circuits (275-stop Paadal Petra Sthalams), blow the per-page
  // byte budget. Ungrouped circuits inline their stops as attractions.
  const itineraryItems = groups
    ? groups.map((g, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'TouristTrip',
          name: g.name,
          url: absUrl(`${locale}/yatra/${circuit.id}/${g.id}/`),
        },
      }))
    : stops.map((temple, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'TouristAttraction',
          name: temple.name,
          url: absUrl(`${locale}/temples/${temple.id}/`),
          address: {
            '@type': 'PostalAddress',
            addressLocality: temple.location.city,
            addressRegion: temple.location.state,
            addressCountry: 'IN',
          },
        },
      }));
  const tripJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: circuit.name,
    description: circuit.description,
    url: absUrl(`${locale}/yatra/${circuit.id}/`),
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: itineraryItems.length,
      itemListElement: itineraryItems,
    },
  };

  const breadcrumbs = breadcrumbList([
    { name: ui.tabs.home, path: `${locale}/` },
    { name: ui.tabs.yatra, path: `${locale}/yatra/` },
    { name: circuit.name, path: `${locale}/yatra/${circuit.id}/` },
  ]);

  return (
    <PageChrome locale={locale} active="yatra" pathSuffix={`yatra/${circuit.id}/`}>
      <JsonLd data={tripJsonLd} />
      <JsonLd data={breadcrumbs} />
      <div className="hero">
        <span className="eyebrow">{circuit.region}</span>
        <h1>{circuit.name}</h1>
        <p className="native">{circuit.nativeName}</p>
      </div>

      <div className="chips">
        <span className="chip">
          {stops.length} {ui.labels.stops}
        </span>
        <span className="chip">{circuit.theme}</span>
      </div>

      <div className="actions">
        <OfflineButton
          locale={locale}
          downloadKey={`circuit:${circuit.id}`}
          manifest={`/offline/${locale}/${circuit.id}.json`}
        />
      </div>

      {groups ? (
        <section className="section">
          <p className="lead">{circuit.description}</p>
        </section>
      ) : (
        <>
          <CircuitMap
            circuitName={circuit.name}
            temples={stops}
            locale={locale}
            title={ui.labels.routeMap}
            note={ui.labels.routeNote}
            orderLabel={ui.labels.drivingOrder}
          />
          <section className="section">
            <p className="lead">{circuit.description}</p>
          </section>
        </>
      )}

      {groups ? (
        // Overview: every stop as a numbered dot, then one tile per region —
        // each region has its own page with a detailed map and the temples.
        <>
          <CircuitMap
            circuitName={circuit.name}
            temples={stops}
            locale={locale}
            title={ui.labels.routeMap}
            note={ui.labels.routeNote}
            orderLabel={ui.labels.drivingOrder}
          />
          <section className="section" aria-labelledby="regions-h">
            <h2 id="regions-h">{ui.labels.stops}</h2>
            <div className="stops stops--explicit">
              {groups.map((g) => (
                <a key={g.id} className="card" href={`/${locale}/yatra/${circuit.id}/${g.id}/`}>
                  <span className="stop-n stop-n--range" aria-hidden="true">
                    {g.offset + 1}–{g.offset + g.temples.length}
                  </span>
                  <h3>{g.name}</h3>
                  <div className="meta">
                    {g.temples.length} {ui.labels.stops} ·{' '}
                    {g.temples
                      .slice(0, 3)
                      .map((t) => t.location.city.split(',')[0])
                      .join(', ')}
                    {g.temples.length > 3 ? '…' : ''}
                  </div>
                </a>
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className="section" aria-labelledby="stops-h">
          <h2 id="stops-h">{ui.labels.stops}</h2>
          <StopCards temples={stops} locale={locale} />
        </section>
      )}
    </PageChrome>
  );
}

