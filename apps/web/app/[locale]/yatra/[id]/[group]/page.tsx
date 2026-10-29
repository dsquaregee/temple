import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { t, type Locale } from '@temple/core';
import { getCircuit, getCircuitTemples, getCircuits } from '@temple/content';
import { LOCALES } from '@/lib/locales';
import { pageAlternates } from '@/lib/seo';
import { absUrl, breadcrumbList } from '@/lib/jsonld';
import { PageChrome } from '@/components/PageChrome';
import { JsonLd } from '@/components/JsonLd';
import { CircuitMap } from '@/components/CircuitMap';
import { resolveGroups, StopCards } from '@/components/CircuitStops';

// One regional section of a large circuit (e.g. Divya Desams → Chola Nadu):
// its own route map and numbered temple list. Splitting keeps every page light
// as the circuit grows — a single page with all 107 Divya Desams and six maps
// was ~470 KB of HTML + flight data.
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    getCircuits(locale).flatMap((circuit) =>
      (circuit.groups ?? []).map((g) => ({ locale, id: circuit.id, group: g.id }))
    )
  );
}

function resolve(locale: Locale, id: string, groupId: string) {
  const circuit = getCircuit(locale, id);
  if (!circuit) return undefined;
  const group = resolveGroups(circuit, getCircuitTemples(locale, circuit))?.find((g) => g.id === groupId);
  return group ? { circuit, group } : undefined;
}

export function generateMetadata({
  params,
}: {
  params: { locale: Locale; id: string; group: string };
}): Metadata {
  const r = resolve(params.locale, params.id, params.group);
  if (!r) return {};
  const path = (l: string) => `/${l}/yatra/${params.id}/${params.group}/`;
  return {
    title: `${r.group.name} — ${r.circuit.name}`,
    description: r.circuit.theme,
    alternates: pageAlternates(params.locale, path),
  };
}

export default function CircuitGroupPage({
  params,
}: {
  params: { locale: Locale; id: string; group: string };
}) {
  const { locale, id } = params;
  const r = resolve(locale, id, params.group);
  if (!r) notFound();
  const { circuit, group } = r;
  const ui = t(locale);

  const breadcrumbs = breadcrumbList([
    { name: ui.tabs.home, path: `${locale}/` },
    { name: ui.tabs.yatra, path: `${locale}/yatra/` },
    { name: circuit.name, path: `${locale}/yatra/${circuit.id}/` },
    { name: group.name, path: `${locale}/yatra/${circuit.id}/${group.id}/` },
  ]);
  const listJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${circuit.name} — ${group.name}`,
    url: absUrl(`${locale}/yatra/${circuit.id}/${group.id}/`),
    numberOfItems: group.temples.length,
    itemListElement: group.temples.map((temple, i) => ({
      '@type': 'ListItem',
      position: group.offset + i + 1,
      url: absUrl(`${locale}/temples/${temple.id}/`),
      name: temple.name,
    })),
  };

  return (
    <PageChrome locale={locale} active="yatra" pathSuffix={`yatra/${circuit.id}/${group.id}/`}>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={listJsonLd} />
      <div className="hero">
        <a className="eyebrow" href={`/${locale}/yatra/${circuit.id}/`}>
          ‹ {circuit.name}
        </a>
        <h1>{group.name}</h1>
        <p className="native">{circuit.nativeName}</p>
      </div>

      <div className="chips">
        <span className="chip">
          {group.temples.length} {ui.labels.stops}
        </span>
        <span className="chip">
          {group.offset + 1}–{group.offset + group.temples.length}
        </span>
      </div>

      <CircuitMap
        circuitName={`${circuit.name} — ${group.name}`}
        temples={group.temples}
        locale={locale}
        title={ui.labels.routeMap}
        note={ui.labels.routeNote}
        orderLabel={ui.labels.drivingOrder}
        offset={group.offset}
      />

      <section className="section" aria-labelledby="stops-h">
        <h2 id="stops-h">{ui.labels.stops}</h2>
        <StopCards temples={group.temples} locale={locale} start={group.offset} />
      </section>
    </PageChrome>
  );
}
