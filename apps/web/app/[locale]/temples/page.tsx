import type { Metadata } from 'next';
import { t, type Locale } from '@temple/core';
import { getTemples } from '@temple/content';
import TempleCard from '../../../components/TempleCard';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  return { title: t(locale).tabs.discover };
}

export default async function Discover({
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
        {s.tabs.discover}
      </h1>
      <div className="stack">
        {temples.map((temple) => (
          <TempleCard key={temple.id} temple={temple} locale={locale} />
        ))}
      </div>
    </>
  );
}
