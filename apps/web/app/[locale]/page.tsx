import Link from 'next/link';
import { t, type Locale } from '@temple/core';
import { getCircuits, getTemples } from '@temple/content';
import TempleCard from '../../components/TempleCard';
import CircuitCard from '../../components/CircuitCard';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  const s = t(locale);
  const temples = getTemples(locale);
  const circuits = getCircuits(locale);

  // Deterministic per build: rotates when the site is rebuilt (daily deploy).
  const featured = temples[new Date().getDate() % temples.length] ?? temples[0];

  return (
    <>
      <header style={{ margin: '0.5rem 0 1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem' }}>{s.appName}</h1>
        <p className="meta">{s.tagline}</p>
      </header>

      {featured && (
        <>
          <p className="fact-label">{s.labels.templeOfTheDay}</p>
          <Link href={`/${locale}/temples/${featured.id}`} className="hero" style={{ display: 'block' }}>
            <h1 style={{ fontSize: '1.6rem' }}>{featured.name}</h1>
            <p className="native">{featured.nativeName}</p>
            <p style={{ marginTop: '0.75rem', maxWidth: '36rem' }}>
              {featured.summary.length > 200
                ? featured.summary.slice(0, 197).trimEnd() + '…'
                : featured.summary}
            </p>
          </Link>
        </>
      )}

      <h2 className="section-title">{s.labels.circuits}</h2>
      <div className="stack">
        {circuits.map((c) => (
          <CircuitCard key={c.id} circuit={c} locale={locale} />
        ))}
      </div>

      <h2 className="section-title">{s.labels.allTemples}</h2>
      <div className="stack">
        {temples.map((temple) => (
          <TempleCard key={temple.id} temple={temple} locale={locale} />
        ))}
      </div>
    </>
  );
}
