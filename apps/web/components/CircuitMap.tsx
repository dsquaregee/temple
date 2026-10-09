import { layoutCircuitMap, type Temple } from '@temple/core';
import land from '@/lib/geo/south-india-land.json';

// Illustrated route map for a circuit: coastline, a golden route through the
// stops in pilgrimage order, numbered pins, and labels — every pin and label
// links to its temple page. Rendered as inline SVG at build time from content
// data (no map tiles, no client JS, no new CSP surface), so adding a temple to
// a circuit's `stops` redraws the map on the next build.
export function CircuitMap({
  circuitName,
  temples,
  locale,
  title,
  note,
}: {
  circuitName: string;
  temples: Temple[];
  locale: string;
  title: string;
  note: string;
}) {
  const layout = layoutCircuitMap(
    temples.map((t) => ({
      id: t.id,
      name: t.name,
      city: t.location.city,
      lat: t.location.lat,
      lng: t.location.lng,
    })),
    land.rings
  );
  if (!layout.pins.length) return null;
  const { width: W, height: H } = layout;
  const titleId = 'cmap-title';

  return (
    <figure className="cmap">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="group"
        aria-labelledby={titleId}
        className="cmap-svg"
      >
        <title id={titleId}>{`${title}: ${circuitName}`}</title>
        <defs>
          <pattern id="cmap-dots" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.1" className="cmap-dot" />
          </pattern>
          {/* Stylized gopuram (gateway tower) — architecture, not deity imagery. */}
          <symbol id="cmap-gopuram" viewBox="0 0 24 24">
            <path d="M12 1.5l1.3 2.2H10.7zM9.6 4.6h4.8l.9 3H8.7zM8.2 8.5h7.6l1 3.4H7.2zM6.6 12.8h10.8l1.1 3.8H5.5zM4.8 17.5h14.4l1.2 4.5H3.6z" />
          </symbol>
        </defs>

        <rect className="cmap-sea" width={W} height={H} />
        {layout.landPath && (
          <>
            <path className="cmap-land" d={layout.landPath} />
            <path className="cmap-land-texture" d={layout.landPath} fill="url(#cmap-dots)" />
          </>
        )}

        <path className="cmap-route-glow" d={layout.routePath} />
        <path className="cmap-route" d={layout.routePath} />

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

        {layout.labels.map((l) => {
          const pin = layout.pins[l.n - 1];
          if (!pin) return null;
          return (
            <a
              key={l.id}
              href={`/${locale}/temples/${l.id}/`}
              aria-label={`${l.n}. ${l.lines.join(' ')}, ${l.city}`}
              className="cmap-stop"
            >
              {/* Teardrop pin with its tip on the temple's coordinates. */}
              <g transform={`translate(${pin.x} ${pin.y})`}>
                <path className="cmap-pin" d="M0 0C-6-9-15-15-15-24a15 15 0 1 1 30 0C15-15 6-9 0 0z" />
                <text className="cmap-pin-n" x="0" y="-19" textAnchor="middle">
                  {l.n}
                </text>
              </g>
              <g transform={`translate(${l.x} ${l.y})`}>
                <rect className="cmap-label-box" width={l.w} height={l.h} rx="10" />
                <use href="#cmap-gopuram" className="cmap-gopuram" x="7" y={l.h / 2 - 15} width="26" height="26" />
                <circle className="cmap-badge" cx="31" cy={l.h / 2 + 9} r="9.5" />
                <text className="cmap-badge-n" x="31" y={l.h / 2 + 13.5} textAnchor="middle">
                  {l.n}
                </text>
                {l.lines.map((line, i) => (
                  <text key={i} className="cmap-name" x="46" y={30 + i * 24} style={{ fontSize: l.nameFont }}>
                    {line}
                  </text>
                ))}
                <text className="cmap-city" x="46" y={l.h - 13}>
                  {l.city}
                </text>
              </g>
            </a>
          );
        })}

        <g className="cmap-scale" transform={`translate(${layout.scale.x} ${layout.scale.y})`}>
          <line x1="0" y1="0" x2={layout.scale.length} y2="0" />
          <line x1="0" y1="-5" x2="0" y2="5" />
          <line x1={layout.scale.length} y1="-5" x2={layout.scale.length} y2="5" />
          <text x={layout.scale.length / 2} y="-9" textAnchor="middle">
            {layout.scale.label}
          </text>
        </g>
        <g
          className="cmap-north"
          transform={`translate(${layout.scale.x + layout.scale.length + 34} ${layout.scale.y - 6})`}
          aria-hidden="true"
        >
          <path d="M0-14L6 6L0 2L-6 6z" />
          <text x="13" y="5">
            N
          </text>
        </g>
      </svg>
      <figcaption className="cmap-note">{note}</figcaption>
    </figure>
  );
}
