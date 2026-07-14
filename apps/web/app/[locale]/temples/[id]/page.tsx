import type { Metadata } from 'next';
import Link from 'next/link';
import { LOCALES, t, type Locale } from '@temple/core';
import {
  getCircuit,
  getTemple,
  getTemples,
} from '@temple/content';
import TempleCard from '../../../../components/TempleCard';

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    getTemples(locale).map((temple) => ({ locale, id: temple.id }))
  );
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = (await params) as { locale: Locale; id: string };
  const temple = getTemple(locale, id);
  if (!temple) return {};
  return {
    title: temple.name,
    description: temple.summary,
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, `/${l}/temples/${id}/`])
      ),
    },
  };
}

export default async function TempleDetail({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = (await params) as { locale: Locale; id: string };
  const temple = getTemple(locale, id);
  if (!temple) return null;
  const s = t(locale);

  const circuits = temple.circuits
    .map((cid) => getCircuit(locale, cid))
    .filter((c) => c !== undefined);

  const related = getTemples(locale)
    .filter(
      (other) =>
        other.id !== temple.id &&
        (other.circuits.some((c) => temple.circuits.includes(c)) ||
          other.location.state === temple.location.state)
    )
    .slice(0, 3);

  const sections = [
    { title: s.sections.history, body: temple.sections.history },
    { title: s.sections.architecture, body: temple.sections.architecture },
    { title: s.sections.legends, body: temple.sections.legends },
    { title: s.sections.festivals, body: temple.sections.festivals },
    { title: s.sections.experience, body: temple.sections.experience },
  ];

  const facts = [
    { label: s.visit.timings, body: temple.visit.timings },
    { label: s.visit.dressCode, body: temple.visit.dressCode },
    { label: s.visit.photography, body: temple.visit.photography },
    { label: s.visit.gettingThere, body: temple.visit.gettingThere },
  ];

  return (
    <article>
      <div className="hero">
        <h1>{temple.name}</h1>
        <p className="native">{temple.nativeName}</p>
        <p className="meta" style={{ color: '#e8cfa4', marginTop: '0.5rem' }}>
          {temple.location.city}, {temple.location.state} · {temple.period}
        </p>
      </div>

      <div className="chiprow" style={{ margin: '1rem 0' }}>
        <span className="chip">{temple.deity.split(',')[0]}</span>
        <span className="chip">{temple.dynasty}</span>
        <span className="chip">{temple.style}</span>
        {temple.unesco && <span className="chip chip--unesco">{s.labels.unesco}</span>}
      </div>

      <h2 className="section-title">{s.labels.whyItMatters}</h2>
      <p>{temple.summary}</p>

      {sections.map((section) => (
        <section key={section.title}>
          <h2 className="section-title">{section.title}</h2>
          <div className="prose">
            {section.body.split('\n\n').map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      ))}

      <h2 className="section-title">{s.visit.heading}</h2>
      <div className="facts">
        {facts.map((fact) => (
          <div className="card" key={fact.label}>
            <p className="fact-label">{fact.label}</p>
            <p style={{ fontSize: '0.925rem' }}>{fact.body}</p>
          </div>
        ))}
      </div>

      {circuits.length > 0 && (
        <>
          <h2 className="section-title">{s.labels.partOf}</h2>
          <div className="stack">
            {circuits.map((circuit) => (
              <Link
                key={circuit.id}
                className="card"
                href={`/${locale}/yatra/${circuit.id}`}
              >
                <h3 style={{ fontSize: '1.05rem' }}>{circuit.name}</h3>
                <p className="meta">
                  {circuit.region} · {circuit.stops.length} {s.labels.stops}
                </p>
              </Link>
            ))}
          </div>
        </>
      )}

      {related.length > 0 && (
        <>
          <h2 className="section-title">{s.labels.relatedTemples}</h2>
          <div className="stack">
            {related.map((other) => (
              <TempleCard key={other.id} temple={other} locale={locale} />
            ))}
          </div>
        </>
      )}

      <div className="card" style={{ marginTop: '2rem' }}>
        <p className="fact-label">{s.labels.supportTemple}</p>
        <p className="meta">{s.labels.supportNote}</p>
      </div>
    </article>
  );
}
