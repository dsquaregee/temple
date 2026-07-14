import type { Metadata } from 'next';
import Link from 'next/link';
import { LOCALES, t, type Locale } from '@temple/core';
import { getCircuit, getCircuits, getCircuitTemples } from '@temple/content';

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    getCircuits(locale).map((circuit) => ({ locale, id: circuit.id }))
  );
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = (await params) as { locale: Locale; id: string };
  const circuit = getCircuit(locale, id);
  if (!circuit) return {};
  return {
    title: circuit.name,
    description: circuit.theme,
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, `/${l}/yatra/${id}/`])
      ),
    },
  };
}

export default async function CircuitDetail({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = (await params) as { locale: Locale; id: string };
  const circuit = getCircuit(locale, id);
  if (!circuit) return null;
  const s = t(locale);
  const stops = getCircuitTemples(locale, circuit);

  return (
    <article>
      <div className="hero">
        <h1>{circuit.name}</h1>
        <p className="native">{circuit.nativeName}</p>
        <p className="meta" style={{ color: '#e8cfa4', marginTop: '0.5rem' }}>
          {circuit.region} · {circuit.stops.length} {s.labels.stops}
        </p>
      </div>

      <p style={{ margin: '1.25rem 0' }}>{circuit.theme}</p>

      <div className="prose">
        {circuit.description.split('\n\n').map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <h2 className="section-title">{s.labels.stops}</h2>
      <ol className="stops" style={{ listStyle: 'none' }}>
        {stops.map((temple, i) => (
          <li key={temple.id}>
            <span className="n">{i + 1}</span>
            <Link href={`/${locale}/temples/${temple.id}`} style={{ flex: 1 }}>
              <strong style={{ color: 'var(--ink-strong)' }}>{temple.name}</strong>
              <span className="meta"> · {temple.location.city}</span>
            </Link>
          </li>
        ))}
      </ol>
    </article>
  );
}
