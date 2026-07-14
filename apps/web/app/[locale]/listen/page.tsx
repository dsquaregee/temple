import type { Metadata } from 'next';
import { t, type Locale } from '@temple/core';
import { getTemples } from '@temple/content';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  return { title: t(locale).tabs.listen };
}

export default async function Listen({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  const s = t(locale);
  const temples = getTemples(locale);

  return (
    <>
      <h1 style={{ fontSize: '1.5rem', margin: '0.5rem 0 1rem' }}>
        {s.tabs.listen}
      </h1>
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <p>{s.labels.listenComingSoon}</p>
      </div>
      <div className="stack">
        {temples.map((temple) => (
          <div className="card" key={temple.id} style={{ opacity: 0.6 }}>
            <p className="fact-label">♪</p>
            <h3 style={{ fontSize: '1.05rem' }}>{temple.name}</h3>
            <p className="meta">{temple.location.city}</p>
          </div>
        ))}
      </div>
    </>
  );
}
