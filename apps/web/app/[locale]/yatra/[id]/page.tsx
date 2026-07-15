import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { t, type Locale } from '@temple/core';
import { getCircuit, getCircuitTemples, getCircuits } from '@temple/content';
import { LOCALES } from '@/lib/locales';
import { PageChrome } from '@/components/PageChrome';

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

  return (
    <PageChrome locale={locale} active="yatra" pathSuffix={`yatra/${circuit.id}/`}>
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

      <section className="section">
        <p className="lead">{circuit.description}</p>
      </section>

      <section className="section" aria-labelledby="stops-h">
        <h2 id="stops-h">{ui.labels.stops}</h2>
        <div className="stops">
          {stops.map((temple) => (
            <a
              key={temple.id}
              className="card"
              href={`/${locale}/temples/${temple.id}/`}
            >
              <h3>{temple.name}</h3>
              <div className="native">{temple.nativeName}</div>
              <div className="meta">
                {temple.location.city}, {temple.location.state}
              </div>
            </a>
          ))}
        </div>
      </section>
    </PageChrome>
  );
}
