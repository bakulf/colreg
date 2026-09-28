import type { Diamond, Leg, TriangleDiagram, Vec } from '../core/tidal/model.ts';
import { bearing } from '../core/tidal/model.ts';

/**
 * Tidal stream pictures: the chart's diamond table, and vector triangles drawn
 * with the conventional arrows — one for the water track, two for the ground
 * track, three for the stream.
 */

export function TidalDiamondScene({ diamond, highlight }: { diamond: Diamond; highlight: number | undefined }) {
  return (
    <div className="diamond" role="table" aria-label={`Tidal stream table for diamond ${diamond.letter}`}>
      <table>
        <thead>
          <tr>
            <th scope="col">
              Hours
              <br />
              <small>HW {diamond.standardPort}</small>
            </th>
            <th scope="col" colSpan={3}>
              <span className="diamond-mark">◇</span>
              {diamond.letter}
            </th>
          </tr>
          <tr className="diamond-sub">
            <th />
            <th scope="col">Set</th>
            <th scope="col">Sp</th>
            <th scope="col">Np</th>
          </tr>
        </thead>
        <tbody>
          {diamond.hours.map((h) => (
            <tr key={h.hour} className={h.hour === highlight ? 'lit' : undefined}>
              <th scope="row">{h.hour === 0 ? 'HW' : `${h.hour > 0 ? '+' : '−'}${Math.abs(h.hour)}`}</th>
              <td>{bearing(h.set)}</td>
              <td>{h.spring.toFixed(1)}</td>
              <td>{h.neap.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const COLOUR: Record<Leg, string> = {
  water: '#1464c0',
  ground: '#102a43',
  tide: '#c2410c',
};

const ARROWS: Record<Leg, number> = { water: 1, ground: 2, tide: 3 };

interface Box {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

function pointsOf(d: TriangleDiagram): Vec[] {
  return [
    d.start,
    ...d.segments.flatMap((s) => [s.from, s.to]),
    ...(d.waypoint ? [d.waypoint] : []),
    ...(d.ep ? [d.ep] : []),
    ...(d.trackTo ? [d.trackTo] : []),
  ];
}

export function boxOf(diagrams: readonly TriangleDiagram[]): Box {
  const pts = diagrams.flatMap(pointsOf);
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
}

function Chevrons({ from, to, kind, px }: { from: Vec; to: Vec; kind: Leg; px: (v: Vec) => Vec }) {
  const [x1, y1] = px(from);
  const [x2, y2] = px(to);
  const len = Math.hypot(x2 - x1, y2 - y1);
  if (len < 1) return null;
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const n = ARROWS[kind];
  const out = [];
  for (let i = 0; i < n; i++) {
    const t = 0.5 + (i - (n - 1) / 2) * (7 / len);
    const cx = x1 + (x2 - x1) * t;
    const cy = y1 + (y2 - y1) * t;
    const s = 6;
    out.push(
      <path
        key={i}
        d={`M ${cx - ux * s - uy * s * 0.7} ${cy - uy * s + ux * s * 0.7} L ${cx} ${cy} L ${cx - ux * s + uy * s * 0.7} ${cy - uy * s - ux * s * 0.7}`}
        fill="none"
        stroke={COLOUR[kind]}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />,
    );
  }
  return <>{out}</>;
}

export function TriangleSvg({
  diagram,
  box,
  size = 300,
  label,
}: {
  diagram: TriangleDiagram;
  box: Box;
  size?: number;
  label?: string;
}) {
  const pad = 28;
  const span = Math.max(box.maxX - box.minX, box.maxY - box.minY, 1);
  const k = (size - pad * 2) / span;
  const ox = pad + ((size - pad * 2) - (box.maxX - box.minX) * k) / 2;
  const oy = pad + ((size - pad * 2) - (box.maxY - box.minY) * k) / 2;
  const px = (v: Vec): Vec => [ox + (v[0] - box.minX) * k, size - (oy + (v[1] - box.minY) * k)];
  const [sx, sy] = px(diagram.start);

  return (
    <svg className="scene triangle" viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label ?? 'Vector triangle'}>
      <rect width={size} height={size} fill="#f7fafc" />
      {/* North arrow. */}
      <g transform="translate(18 16)">
        <path d="M 0 12 L 5 0 L 10 12 L 5 9 Z" fill="#7890a5" />
        <text x={5} y={24} textAnchor="middle" fontSize="9" fill="#7890a5">
          N
        </text>
      </g>
      {label && (
        <text x={size - 14} y={24} textAnchor="end" fontSize="18" fontWeight="700" fill="#102a43">
          {label}
        </text>
      )}
      {diagram.trackTo && (
        <line
          x1={sx}
          y1={sy}
          x2={px(diagram.trackTo)[0]}
          y2={px(diagram.trackTo)[1]}
          stroke="#9fb4c6"
          strokeWidth={1}
          strokeDasharray="4 4"
        />
      )}
      {diagram.segments.map((s, i) => {
        const [x1, y1] = px(s.from);
        const [x2, y2] = px(s.to);
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={COLOUR[s.kind]} strokeWidth={2} />
            <Chevrons from={s.from} to={s.to} kind={s.kind} px={px} />
          </g>
        );
      })}
      {/* Fix: circle and dot. Waypoint: square. EP: triangle. */}
      <circle cx={sx} cy={sy} r={6} fill="none" stroke="#102a43" strokeWidth={1.6} />
      <circle cx={sx} cy={sy} r={1.6} fill="#102a43" />
      {diagram.waypoint && (
        <rect
          x={px(diagram.waypoint)[0] - 6}
          y={px(diagram.waypoint)[1] - 6}
          width={12}
          height={12}
          fill="none"
          stroke="#102a43"
          strokeWidth={1.6}
        />
      )}
      {diagram.ep && (
        <g transform={`translate(${px(diagram.ep)[0]} ${px(diagram.ep)[1]})`}>
          <path d="M 0 -8 L 7 5 L -7 5 Z" fill="none" stroke="#102a43" strokeWidth={1.6} />
          <circle r={1.6} fill="#102a43" />
        </g>
      )}
    </svg>
  );
}

export function TidalTriangleScene({ diagram, compact = false }: { diagram: TriangleDiagram; compact?: boolean }) {
  return (
    <div className={`triangle-one${compact ? ' small' : ''}`}>
      <TriangleSvg diagram={diagram} box={boxOf([diagram])} />
      <Legend />
    </div>
  );
}

export function TidalPickScene({ diagrams }: { diagrams: TriangleDiagram[] }) {
  // One scale for all four, so lengths compare across them.
  const box = boxOf(diagrams);
  return (
    <div className="triangle-pick">
      <div className="triangle-grid">
        {diagrams.map((d, i) => (
          <TriangleSvg key={i} diagram={d} box={box} label={'ABCD'[i]} />
        ))}
      </div>
      <Legend />
    </div>
  );
}

function Legend() {
  return (
    <p className="triangle-legend">
      <span style={{ color: COLOUR.water }}>› water track</span>
      <span style={{ color: COLOUR.ground }}>›› ground track</span>
      <span style={{ color: COLOUR.tide }}>››› stream</span>
      <span>○ fix · □ waypoint · △ EP</span>
    </p>
  );
}
