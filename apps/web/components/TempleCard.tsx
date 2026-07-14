import Link from 'next/link';
import type { Locale, Temple } from '@temple/core';
import { t } from '@temple/core';

export default function TempleCard({
  temple,
  locale,
}: {
  temple: Temple;
  locale: Locale;
}) {
  const s = t(locale);
  return (
    <Link className="card" href={`/${locale}/temples/${temple.id}`}>
      <div className="chiprow" style={{ marginBottom: '0.5rem' }}>
        <span className="chip">{temple.location.city}</span>
        <span className="chip">{temple.dynasty}</span>
        {temple.unesco && <span className="chip chip--unesco">{s.labels.unesco}</span>}
      </div>
      <h3 style={{ fontSize: '1.15rem' }}>{temple.name}</h3>
      <p className="native">{temple.nativeName}</p>
      <p className="meta" style={{ marginTop: '0.4rem' }}>
        {temple.summary.length > 160
          ? temple.summary.slice(0, 157).trimEnd() + '…'
          : temple.summary}
      </p>
    </Link>
  );
}
