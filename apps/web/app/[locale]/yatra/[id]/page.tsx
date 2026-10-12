import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { t, type Locale, type Temple } from '@temple/core';
import { getCircuit, getCircuitTemples, getCircuits } from '@temple/content';
import { LOCALES } from '@/lib/locales';
import { absUrl, breadcrumbList } from '@/lib/jsonld';
import { PageChrome } from '@/components/PageChrome';
import { JsonLd } from '@/components/JsonLd';
import { CircuitMap } from '@/components/CircuitMap';

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
  // Resolve optional regional groups to temples, with each group's numbering
  // offset (its first stop continues from the previous group's last).
  let running = 0;
  const groups = circuit.groups?.map((g) => {
    const temples = g.stops
      .map((id) => stops.find((t) => t.id === id))
      .filter((t): t is (typeof stops)[number] => Boolean(t));
    const offset = running;
    running += temples.length;
    return { name: g.name, temples, offset };
  });

  // TouristTrip with the stops as an ordered itinerary of attractions — lets
  // Google understand a circuit as a real multi-stop pilgrimage route.
  const tripJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: circuit.name,
    description: circuit.description,
    url: absUrl(`${locale}/yatra/${circuit.id}/`),
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: stops.length,
      itemListElement: stops.map((temple, index) => ({
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
      })),
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
        // Large circuits are read region by region: a map and list per group,
        // numbered continuously across the whole circuit.
        <div className="stop-groups">
          {groups.map((g, gi) => (
            <section key={g.name} className="section" aria-labelledby={`group-h-${gi}`}>
              <h2 id={`group-h-${gi}`}>
                {g.name} <span className="group-count">· {g.temples.length}</span>
              </h2>
              <CircuitMap
                circuitName={`${circuit.name} — ${g.name}`}
                temples={g.temples}
                locale={locale}
                title={ui.labels.routeMap}
                note={ui.labels.routeNote}
                orderLabel={ui.labels.drivingOrder}
                offset={g.offset}
              />
              <StopCards temples={g.temples} locale={locale} />
            </section>
          ))}
        </div>
      ) : (
        <section className="section" aria-labelledby="stops-h">
          <h2 id="stops-h">{ui.labels.stops}</h2>
          <StopCards temples={stops} locale={locale} />
        </section>
      )}
    </PageChrome>
  );
}

function StopCards({ temples, locale }: { temples: Temple[]; locale: Locale }) {
  return (
    <div className="stops">
      {temples.map((temple) => (
        <a key={temple.id} className="card" href={`/${locale}/temples/${temple.id}/`}>
          <h3>{temple.name}</h3>
          <div className="native">{temple.nativeName}</div>
          <div className="meta">
            {temple.location.city}, {temple.location.state}
          </div>
        </a>
      ))}
    </div>
  );
}
