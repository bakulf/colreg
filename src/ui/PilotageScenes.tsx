import { PORT_SIGNALS, bearing } from '../core/pilotage/model.ts';

/**
 * Position and pilotage sketches: a cocked hat by a rock, a clearing line on a
 * chart, leading marks as seen from the helm, and port traffic signals.
 */

const W = 320;
const H = 300;

function u(deg: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [Math.sin(a), -Math.cos(a)];
}

function Rocks({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={22} fill="none" stroke="#102a43" strokeDasharray="3 3" />
      {[
        [-8, -4],
        [6, -7],
        [2, 7],
        [-5, 9],
        [10, 5],
      ].map(([dx, dy], i) => (
        <g key={i} stroke="#102a43" strokeWidth={1.6}>
          <line x1={x + dx! - 3} y1={y + dy!} x2={x + dx! + 3} y2={y + dy!} />
          <line x1={x + dx!} y1={y + dy! - 3} x2={x + dx!} y2={y + dy! + 3} />
        </g>
      ))}
    </g>
  );
}

export function CockedHatScene({ danger, rotation }: { danger: number; rotation: number }) {
  const c: [number, number] = [W / 2, H / 2 + 10];
  const verts = [0, 120, 240].map((a) => {
    const [x, y] = u(a + rotation);
    return [c[0] + x * 34, c[1] + y * 34] as [number, number];
  });
  const lines = [
    [0, 1],
    [1, 2],
    [2, 0],
  ].map(([i, j]) => {
    const a = verts[i!]!;
    const b = verts[j!]!;
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy);
    const ext = 90;
    return [a[0] - (dx / len) * ext, a[1] - (dy / len) * ext, b[0] + (dx / len) * ext, b[1] + (dy / len) * ext];
  });
  const dv = verts[danger]!;
  const away = [dv[0] - c[0], dv[1] - c[1]];
  const k = Math.hypot(away[0]!, away[1]!);
  const rock = [dv[0] + (away[0]! / k) * 40, dv[1] + (away[1]! / k) * 40];
  return (
    <svg className="scene chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="A cocked hat of three position lines, with a rock nearby">
      <rect width={W} height={H} fill="#eef6fb" />
      {lines.map((l, i) => (
        <line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke="#1464c0" strokeWidth={1.6} />
      ))}
      <polygon points={verts.map((v) => v.join(',')).join(' ')} fill="#1464c0" opacity={0.08} />
      {verts.map((v, i) => {
        const o = [v[0] - c[0], v[1] - c[1]];
        const n = Math.hypot(o[0]!, o[1]!);
        return (
          <text key={i} x={v[0] + (o[0]! / n) * 16} y={v[1] + (o[1]! / n) * 16 + 5} textAnchor="middle" fontSize="15" fontWeight="800" fill="#102a43">
            {'ABC'[i]}
          </text>
        );
      })}
      <Rocks x={rock[0]!} y={rock[1]!} />
    </svg>
  );
}

export function ClearingLineScene({
  line,
  label,
  dangerSide,
  observed,
}: {
  line: number;
  label: 'NLT' | 'NMT' | undefined;
  dangerSide: 'left' | 'right';
  observed: number | undefined;
}) {
  const c: [number, number] = [W / 2, H / 2];
  const [ux, uy] = u(line);
  const mark: [number, number] = [c[0] + ux * 105, c[1] + uy * 105];
  const tail: [number, number] = [c[0] - ux * 125, c[1] - uy * 125];
  // Right of the line, looking along it towards the mark.
  const side = dangerSide === 'right' ? 90 : -90;
  const [px, py] = u(line + side);
  const rock: [number, number] = [c[0] + px * 48 - ux * 10, c[1] + py * 48 - uy * 10];
  const boat = observed === undefined ? undefined : (() => {
    const [bx, by] = u(observed);
    return [mark[0] - bx * 175, mark[1] - by * 175] as [number, number];
  })();
  const textAt: [number, number] = [c[0] - ux * 60 - px * 14, c[1] - uy * 60 - py * 14];
  const angle = ((line + 90) % 180) - 90;
  return (
    <svg className="scene chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="A clearing line on a chart sketch">
      <rect width={W} height={H} fill="#eef6fb" />
      <g transform="translate(18 16)">
        <path d="M 0 14 L 6 0 L 12 14 L 6 10 Z" fill="#5e7489" />
        <text x={6} y={27} textAnchor="middle" fontSize="10" fill="#5e7489">
          N
        </text>
      </g>
      <line x1={mark[0]} y1={mark[1]} x2={tail[0]} y2={tail[1]} stroke="#a21caf" strokeWidth={1.8} strokeDasharray="7 5" />
      {/* The mark: a church, as charted. */}
      <g transform={`translate(${mark[0]} ${mark[1]})`}>
        <circle r={5} fill="#102a43" />
        <line x1={0} y1={-12} x2={0} y2={-5} stroke="#102a43" strokeWidth={2} />
        <line x1={-4} y1={-9} x2={4} y2={-9} stroke="#102a43" strokeWidth={2} />
      </g>
      <Rocks x={rock[0]} y={rock[1]} />
      <text
        x={textAt[0]}
        y={textAt[1]}
        textAnchor="middle"
        fontSize="13"
        fontWeight="800"
        fill="#a21caf"
        transform={`rotate(${angle} ${textAt[0]} ${textAt[1]})`}
      >
        {label ?? '???'} {bearing(line)}
      </text>
      {boat && (
        <g>
          <line x1={boat[0]} y1={boat[1]} x2={mark[0]} y2={mark[1]} stroke="#102a43" strokeWidth={1} strokeDasharray="2 3" />
          <path d="M 0 -9 L 6 7 L -6 7 Z" fill="#102a43" transform={`translate(${boat[0]} ${boat[1]}) rotate(${observed})`} />
        </g>
      )}
    </svg>
  );
}

export function LeadingMarksScene({ rear }: { rear: 'left' | 'right' | 'inline' }) {
  const dx = rear === 'inline' ? 0 : rear === 'right' ? 30 : -30;
  const cx = W / 2;
  return (
    <svg className="scene view" viewBox={`0 0 ${W} 220`} role="img" aria-label="Two leading marks seen ahead">
      <rect width={W} height={220} fill="#bcd9ee" />
      <path d={`M 0 150 C 60 120, 120 110, 170 108 C 220 106, 270 118, ${W} 130 L ${W} 160 L 0 160 Z`} fill="#7c9a6a" />
      <rect y={158} width={W} height={62} fill="#4d7fa6" />
      {/* Rear mark, higher up the hill: inverted triangle on a tall post. */}
      <line x1={cx + dx} y1={112} x2={cx + dx} y2={62} stroke="#1b2229" strokeWidth={3} />
      <path d={`M ${cx + dx - 11} 48 L ${cx + dx + 11} 48 L ${cx + dx} 66 Z`} fill="#e8642c" stroke="#1b2229" />
      {/* Front mark, at the water: triangle point up. */}
      <line x1={cx} y1={160} x2={cx} y2={128} stroke="#1b2229" strokeWidth={4} />
      <path d={`M ${cx - 15} 132 L ${cx + 15} 132 L ${cx} 106 Z`} fill="#e8642c" stroke="#1b2229" />
      <line x1={cx} y1={205} x2={cx} y2={188} stroke="#102a43" strokeWidth={2} />
      <path d={`M ${cx} 180 l 6 12 l -12 0 z`} fill="#102a43" />
    </svg>
  );
}

const LIGHT = { R: '#ff453a', G: '#30d158', W: '#ffffff' } as const;

export function PortSignalScene({ signal }: { signal: string }) {
  const s = PORT_SIGNALS.find((x) => x.id === signal)!;
  return (
    <svg className="scene signals" viewBox={`0 0 ${W} 250`} role="img" aria-label="Port traffic signals">
      <rect width={W} height={250} fill="#0b1520" />
      <rect x={130} y={30} width={60} height={190} rx={10} fill="#1f2a36" />
      {s.lights.map((c, i) => (
        <g key={i} className={s.flashing ? 'flashing' : undefined}>
          <circle cx={160} cy={65 + i * 60} r={24} fill={LIGHT[c]} opacity={0.25} />
          <circle cx={160} cy={65 + i * 60} r={15} fill={LIGHT[c]} />
        </g>
      ))}
      {s.yellow && (
        <g>
          <rect x={70} y={45} width={40} height={40} rx={8} fill="#1f2a36" />
          <circle cx={90} cy={65} r={20} fill="#ffd60a" opacity={0.25} />
          <circle cx={90} cy={65} r={12} fill="#ffd60a" />
        </g>
      )}
    </svg>
  );
}
