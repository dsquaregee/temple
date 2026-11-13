import { DOT_R, layoutCircuitMap, SOUTH_ASIA_LAND, type Temple } from '@temple/core';

// Illustrated route map for a circuit: a warm parchment land, a golden route
// threading the stops in pilgrimage order, gopuram tower markers with numbered
// medallions, a title ribbon and compass rose — and a bus and car that drive
// the route (SVG animateMotion; no client JS, paused under prefers-reduced-
// motion). Every marker and label links to its temple page. Rendered as inline
// SVG at build time from content data, so adding a temple to a circuit's `stops`
// redraws the map — and re-aims the travellers — on the next build.

// Headroom above the map for the title ribbon.
const BAND = 84;

// A stylized 4-tier gopuram (gateway tower) — architecture, not deity imagery.
// Drawn in a 40×48 box, base centered at (20, 46), apex near the top.
const TOWER_TIERS =
  'M7 46 L33 46 L31 37 L9 37 Z M9 37 L31 37 L29 28 L11 28 Z ' +
  'M11 28 L29 28 L27 19 L13 19 Z M13 19 L27 19 L25 11 L15 11 Z M15 11 L20 4 L25 11 Z';

export function CircuitMap({
  circuitName,
  temples,
  locale,
  title,
  note,
  orderLabel,
  offset = 0,
}: {
  circuitName: string;
  temples: Temple[];
  locale: string;
  title: string;
  note: string;
  orderLabel: string;
  /** Numbering offset for a grouped circuit's later sections. */
  offset?: number;
}) {
  const layout = layoutCircuitMap(
    temples.map((t) => ({
      id: t.id,
      name: t.name,
      city: t.location.city,
      lat: t.location.lat,
      lng: t.location.lng,
    })),
    SOUTH_ASIA_LAND,
    { offset }
  );
  if (!layout.pins.length) return null;
  const { width: W, height: H } = layout;
  // Unique per map: a grouped circuit renders several on one page.
  const titleId = `cmap-title-${offset}`;
  const routeId = `cmap-route-${offset}`;
  const pinById = new Map(layout.pins.map((p) => [p.id, p]));
  const nameById = new Map(temples.map((t) => [t.id, t.name]));

  // Keep the travellers at a steady pace regardless of route length.
  const dur = Math.min(42, Math.max(13, layout.pins.length * 2.4));
  // Ribbon sized to the map; long names shrink to fit.
  const ribbonW = Math.min(W * 0.72, 560);
  const ribbonX = (W - ribbonW) / 2;
  const ribbonFont = circuitName.length > 34 ? 15 : circuitName.length > 24 ? 18 : 21;
  // First stop in driving order — parks the static traveller (reduced motion).
  const start = layout.pins.find((p) => p.n === 1 + offset) ?? layout.pins[0]!;

  const vehicle = (cls: string, begin: string, body: string) => (
    <g className={cls} aria-hidden="true">
      {body === 'bus' ? (
        <>
          <rect className="cmap-veh-bus" x="-13" y="-7" width="26" height="14" rx="3" />
          <rect className="cmap-veh-win" x="2" y="-4.5" width="8" height="5" rx="1" />
          <rect className="cmap-veh-win" x="-8" y="-4.5" width="8" height="5" rx="1" />
          <circle className="cmap-veh-wheel" cx="-7" cy="8" r="2.6" />
          <circle className="cmap-veh-wheel" cx="7" cy="8" r="2.6" />
        </>
      ) : (
        <>
          <rect className="cmap-veh-car" x="-9" y="-5" width="18" height="9" rx="4" />
          <rect className="cmap-veh-cab" x="-4" y="-7" width="9" height="5" rx="3" />
          <circle className="cmap-veh-wheel" cx="-5" cy="6" r="2.1" />
          <circle className="cmap-veh-wheel" cx="5" cy="6" r="2.1" />
        </>
      )}
      <animateMotion dur={`${dur}s`} begin={begin} repeatCount="indefinite" rotate="auto" calcMode="linear">
        {/* xlinkHref for WebKit/iOS Safari, which doesn't honour plain href on mpath. */}
        <mpath href={`#${routeId}`} xlinkHref={`#${routeId}`} />
      </animateMotion>
    </g>
  );

  return (
    <figure className="cmap">
      <svg
        viewBox={`0 ${-BAND} ${W} ${H + BAND}`}
        role="group"
        aria-labelledby={titleId}
        className="cmap-svg"
      >
        <title id={titleId}>{`${title}: ${circuitName}`}</title>
        <defs>
          <linearGradient id={`cmap-sea-${offset}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" className="cmap-sea-top" />
            <stop offset="1" className="cmap-sea-bot" />
          </linearGradient>
          <radialGradient id={`cmap-land-${offset}`} cx="0.4" cy="0.32" r="0.95">
            <stop offset="0" className="cmap-land-hi" />
            <stop offset="1" className="cmap-land-lo" />
          </radialGradient>
          <pattern id={`cmap-paper-${offset}`} width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.1" className="cmap-dot" />
          </pattern>
          <symbol id={`cmap-tower-${offset}`} viewBox="0 0 40 48">
            <path className="cmap-tower" d={TOWER_TIERS} />
            <circle className="cmap-kalasam" cx="20" cy="3" r="2.4" />
          </symbol>
        </defs>

        {/* Title band + sea + land */}
        <rect className="cmap-band" x="0" y={-BAND} width={W} height={BAND} />
        <rect x="0" y="0" width={W} height={H} fill={`url(#cmap-sea-${offset})`} />
        {layout.landPath && (
          <>
            <path className="cmap-land" d={layout.landPath} fill={`url(#cmap-land-${offset})`} />
            <path className="cmap-land-texture" d={layout.landPath} fill={`url(#cmap-paper-${offset})`} />
          </>
        )}

        {/* Route: glow under, solid line, and flowing centre dashes. The dash is
            animated continuously, so it's limited to label-mode maps (few, short
            routes); the long compact routes skip it to spare the repaint. */}
        <path className="cmap-route-glow" d={layout.routePath} />
        <path id={routeId} className="cmap-route" d={layout.routePath} />
        {layout.mode !== 'compact' && <path className="cmap-route-dash" d={layout.routePath} />}

        {/* Travellers (hidden when the viewer prefers reduced motion) */}
        {vehicle('cmap-veh', '0s', 'bus')}
        {vehicle('cmap-veh', `-${dur / 2}s`, 'car')}
        {/* Static traveller parked at stop 1, shown only under reduced motion */}
        <g className="cmap-veh-static" aria-hidden="true" transform={`translate(${start.x} ${start.y - 2})`}>
          <rect className="cmap-veh-bus" x="-13" y="-7" width="26" height="14" rx="3" />
          <rect className="cmap-veh-win" x="2" y="-4.5" width="8" height="5" rx="1" />
          <rect className="cmap-veh-win" x="-8" y="-4.5" width="8" height="5" rx="1" />
          <circle className="cmap-veh-wheel" cx="-7" cy="8" r="2.6" />
          <circle className="cmap-veh-wheel" cx="7" cy="8" r="2.6" />
        </g>

        {layout.labels.map(
          (l) =>
            l.leader && (
              <line
                key={`leader-${l.id}`}
                className="cmap-leader"
                x1={l.leader.x1}
                y1={l.leader.y1}
                x2={l.leader.x2}
                y2={l.leader.y2}
              />
            )
        )}

        {/* Compact circuits (many stops): numbered dots keep it legible. */}
        {layout.mode === 'compact' &&
          layout.pins.map((p) => (
            <a
              key={p.id}
              href={`/${locale}/temples/${p.id}/`}
              aria-label={`${p.n}. ${nameById.get(p.id) ?? ''}`}
              className="cmap-stop"
            >
              <circle className="cmap-dotpin" cx={p.x} cy={p.y} r={DOT_R} />
              <text className="cmap-dot-n" x={p.x} y={p.y + 4} textAnchor="middle" fontSize={p.n > 99 ? 9 : 11}>
                {p.n}
              </text>
            </a>
          ))}

        {layout.labels.map((l) => {
          const pin = pinById.get(l.id);
          if (!pin) return null;
          return (
            <a
              key={l.id}
              href={`/${locale}/temples/${l.id}/`}
              aria-label={`${l.n}. ${l.lines.join(' ')}, ${l.city}`}
              className="cmap-stop"
            >
              {/* Gopuram tower on the temple's coordinates, numbered medallion above. */}
              <g transform={`translate(${pin.x} ${pin.y})`}>
                <ellipse className="cmap-tower-shadow" cx="0" cy="3" rx="16" ry="5" />
                <use href={`#cmap-tower-${offset}`} x="-18" y="-43" width="36" height="43" />
                <circle className="cmap-badge cmap-badge--pin" cx="0" cy="-46" r="11" />
                <text className="cmap-pin-n" x="0" y="-42" textAnchor="middle" fontSize={l.n > 99 ? 9 : 12}>
                  {l.n}
                </text>
              </g>
              <g transform={`translate(${l.x} ${l.y})`}>
                <rect className="cmap-label-box" width={l.w} height={l.h} rx="12" />
                {l.lines.map((line, i) => (
                  <text key={i} className="cmap-name" x="18" y={30 + i * 24} fontSize={l.nameFont}>
                    {line}
                  </text>
                ))}
                <text className="cmap-city" x="18" y={l.h - 13}>
                  {l.city}
                </text>
              </g>
            </a>
          );
        })}

        {/* Title ribbon in the headroom band */}
        <g transform={`translate(${ribbonX} ${-BAND + 20})`} aria-hidden="true">
          <path className="cmap-ribbon-tail" d="M-18 14 L0 6 L0 40 L-18 48 Z" />
          <path className="cmap-ribbon-tail" d={`M${ribbonW + 18} 14 L${ribbonW} 6 L${ribbonW} 40 L${ribbonW + 18} 48 Z`} />
          <rect className="cmap-ribbon" x="0" y="0" width={ribbonW} height="46" rx="6" />
          <text className="cmap-ribbon-text" x={ribbonW / 2} y="30" textAnchor="middle" fontSize={ribbonFont}>
            {circuitName}
          </text>
        </g>

        {/* Scale + compass rose */}
        <g className="cmap-scale" transform={`translate(${layout.scale.x} ${layout.scale.y})`}>
          <line x1="0" y1="0" x2={layout.scale.length} y2="0" />
          <line x1="0" y1="-5" x2="0" y2="5" />
          <line x1={layout.scale.length} y1="-5" x2={layout.scale.length} y2="5" />
          <text x={layout.scale.length / 2} y="-9" textAnchor="middle">
            {layout.scale.label}
          </text>
        </g>
        <g className="cmap-compass" transform={`translate(${W - 64} 66)`} aria-hidden="true">
          <circle className="cmap-compass-ring" r="28" />
          <path className="cmap-compass-n" d="M0 -24 L6 0 L0 -5 L-6 0 Z" />
          <path className="cmap-compass-s" d="M0 24 L6 0 L0 5 L-6 0 Z" />
          <text className="cmap-compass-l" x="0" y="-30" textAnchor="middle">
            N
          </text>
        </g>
      </svg>
      <figcaption className="cmap-note">
        {layout.order.length > 2 && (
          <span className="cmap-order">
            {orderLabel}: {layout.order.join(' → ')}
          </span>
        )}
        {note}
      </figcaption>
    </figure>
  );
}
