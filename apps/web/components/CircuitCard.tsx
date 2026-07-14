import Link from 'next/link';
import type { Circuit, Locale } from '@temple/core';
import { t } from '@temple/core';

export default function CircuitCard({
  circuit,
  locale,
}: {
  circuit: Circuit;
  locale: Locale;
}) {
  const s = t(locale);
  return (
    <Link className="card" href={`/${locale}/yatra/${circuit.id}`}>
      <p className="meta" style={{ marginBottom: '0.3rem' }}>
        {circuit.region} · {circuit.stops.length} {s.labels.stops}
      </p>
      <h3 style={{ fontSize: '1.15rem' }}>{circuit.name}</h3>
      <p className="native">{circuit.nativeName}</p>
      <p className="meta" style={{ marginTop: '0.4rem' }}>{circuit.theme}</p>
    </Link>
  );
}
