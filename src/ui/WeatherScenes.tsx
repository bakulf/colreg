import { useEffect, useRef } from 'react';
import { CLOUDS, DEPRESSION } from '../core/weather/model.ts';

/**
 * A sketch synoptic chart, and the passage of a depression as a strip.
 */

const W = 320;
const H = 300;

export function SynopticScene({
  system,
  boatAt,
  tight,
}: {
  system: 'low' | 'high';
  boatAt: number | undefined;
  tight: number | undefined;
}) {
  const cx = W / 2;
  const cy = H / 2;
  // Isobars: circles whose centres drift towards `tight`, so they crowd on
  // that side and spread on the other.
  const shift = tight === undefined ? 0 : 7;
  const t = ((tight ?? 0) * Math.PI) / 180;
  const rings = [26, 50, 74, 98, 122].map((r, i) => ({
    x: cx + Math.sin(t) * shift * i,
    y: cy - Math.cos(t) * shift * i,
    r,
    p: system === 'low' ? 988 + i * 4 : 1036 - i * 4,
  }));
  const boat =
    boatAt === undefined
      ? undefined
      : { x: cx + Math.sin((boatAt * Math.PI) / 180) * 86, y: cy - Math.cos((boatAt * Math.PI) / 180) * 86 };
  const pointA = tight === undefined ? undefined : { x: cx + Math.sin(t) * 100, y: cy - Math.cos(t) * 100 };
  const pointB = tight === undefined ? undefined : { x: cx - Math.sin(t) * 100, y: cy + Math.cos(t) * 100 };

  return (
    <svg className="scene synoptic" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Sketch chart of a ${system}`}>
      <rect width={W} height={H} fill="#f7fafc" />
      <g transform="translate(20 18)">
        <path d="M 0 14 L 6 0 L 12 14 L 6 10 Z" fill="#5e7489" />
        <text x={6} y={27} textAnchor="middle" fontSize="10" fill="#5e7489">
          N
        </text>
      </g>
      {rings.map((r) => (
        <g key={r.r}>
          <circle cx={r.x} cy={r.y} r={r.r} fill="none" stroke="#5e7489" strokeWidth={1.2} />
          <text x={r.x + r.r * 0.72 + 2} y={r.y - r.r * 0.72} fontSize="9" fill="#5e7489">
            {r.p}
          </text>
        </g>
      ))}
      <text x={cx} y={cy + 9} textAnchor="middle" fontSize="26" fontWeight="800" fill={system === 'low' ? '#c2410c' : '#1464c0'}>
        {system === 'low' ? 'L' : 'H'}
      </text>
      {boat && (
        <g transform={`translate(${boat.x} ${boat.y})`}>
          <path d="M 0 -11 L 7 7 L -7 7 Z" fill="#102a43" />
          <circle r={15} fill="none" stroke="#102a43" strokeDasharray="3 3" />
        </g>
      )}
      {pointA && (
        <text x={pointA.x} y={pointA.y + 5} textAnchor="middle" fontSize="16" fontWeight="800" fill="#102a43">
          A
        </text>
      )}
      {pointB && (
        <text x={pointB.x} y={pointB.y + 5} textAnchor="middle" fontSize="16" fontWeight="800" fill="#102a43">
          B
        </text>
      )}
    </svg>
  );
}

export function FrontStripScene({ highlight }: { highlight: number }) {
  const row = useRef<HTMLDivElement>(null);
  // Bring the stage asked about into view; the strip is wider than a phone.
  useEffect(() => {
    const el = row.current;
    const lit = el?.children[highlight] as HTMLElement | undefined;
    if (el && lit) el.scrollLeft = lit.offsetLeft - (el.clientWidth - lit.clientWidth) / 2;
  }, [highlight]);
  return (
    <div className="front-strip" aria-label="How a depression passes">
      <div className="front-strip-row" ref={row}>
        {DEPRESSION.map((s, i) => (
          <div key={s.id} className={`front-stage${i === highlight ? ' lit' : ''}`}>
            <span className="front-where">{s.short}</span>
            <b>{CLOUDS[s.cloud].name}</b>
            <span>
              <i>baro</i> {s.pressure}
            </span>
            <span>
              <i>wind</i> {s.wind}
            </span>
            <span>
              <i>vis</i> {s.visibility}
            </span>
          </div>
        ))}
      </div>
      <p className="front-strip-note">A depression passing to the north, west to east: read left to right.</p>
    </div>
  );
}
