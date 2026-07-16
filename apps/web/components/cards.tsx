import { t, type Circuit, type Locale, type Temple } from '@temple/core';

export function TempleCard({
  locale,
  temple,
}: {
  locale: Locale;
  temple: Temple;
}) {
  const ui = t(locale);
  return (
    <a className="card" href={`/${locale}/temples/${temple.id}/`}>
      <h3>{temple.name}</h3>
      <div className="native" lang="ta">
        {temple.nativeName}
      </div>
      <div className="meta">
        {temple.location.city}, {temple.location.state} · {temple.dynasty}
        {temple.unesco ? ` · ${ui.labels.unesco}` : ''}
      </div>
    </a>
  );
}

export function CircuitCard({
  locale,
  circuit,
}: {
  locale: Locale;
  circuit: Circuit;
}) {
  const ui = t(locale);
  return (
    <a className="card" href={`/${locale}/yatra/${circuit.id}/`}>
      <h3>{circuit.name}</h3>
      <div className="native">{circuit.nativeName}</div>
      <div className="meta">
        {circuit.stops.length} {ui.labels.stops} · {circuit.region}
      </div>
    </a>
  );
}
