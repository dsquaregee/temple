import type { Metadata } from 'next';
import { t, type Locale } from '@temple/core';
import { getCircuits } from '@temple/content';
import CircuitCard from '../../../components/CircuitCard';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  return { title: t(locale).tabs.yatra };
}

export default async function Yatra({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  const s = t(locale);
  const circuits = getCircuits(locale);

  return (
    <>
      <h1 style={{ fontSize: '1.5rem', margin: '0.5rem 0 1rem' }}>
        {s.tabs.yatra}
      </h1>
      <div className="stack">
        {circuits.map((circuit) => (
          <CircuitCard key={circuit.id} circuit={circuit} locale={locale} />
        ))}
      </div>
    </>
  );
}
