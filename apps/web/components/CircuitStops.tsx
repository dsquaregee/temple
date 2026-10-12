import type { Circuit, Locale, Temple } from '@temple/core';

export interface ResolvedGroup {
  id: string;
  name: string;
  temples: Temple[];
  /** Numbering offset: the group's first stop continues the previous group's last. */
  offset: number;
}

// Resolve a circuit's optional regional groups to temples, numbered
// continuously across the whole circuit.
export function resolveGroups(circuit: Circuit, stops: Temple[]): ResolvedGroup[] | undefined {
  let running = 0;
  return circuit.groups?.map((g) => {
    const temples = g.stops
      .map((id) => stops.find((t) => t.id === id))
      .filter((t): t is Temple => Boolean(t));
    const offset = running;
    running += temples.length;
    return { id: g.id, name: g.name, temples, offset };
  });
}

// Numbered stop cards linking to each temple. Numbers are explicit (not a CSS
// counter) so a regional page can continue the circuit's numbering — an inline
// counter-reset offset would need a style attribute, which the CSP forbids.
export function StopCards({
  temples,
  locale,
  start = 0,
}: {
  temples: Temple[];
  locale: Locale;
  start?: number;
}) {
  return (
    <div className="stops stops--explicit">
      {temples.map((temple, i) => (
        <a key={temple.id} className="card" href={`/${locale}/temples/${temple.id}/`}>
          <span className="stop-n" aria-hidden="true">
            {start + i + 1}
          </span>
          <h3>{temple.name}</h3>
          <div className="native">{temple.nativeName}</div>
          <div className="meta">
            {temple.location.city}, {temple.location.state}
          </div>
        </a>
      ))}
    </div>
  );
}
