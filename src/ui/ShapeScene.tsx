import type { VesselState } from '../core/lights/model.ts';
import type { Shape, ShapeForm } from '../core/shapes/model.ts';
import { shapesFor } from '../core/shapes/model.ts';

/**
 * Day signals, drawn on the masts and yard that carry them.
 *
 * Shapes are black and all-round visible, so there is no aspect and no colour
 * to read — only how many, which forms, in what order, and on which side. The
 * drawing shows a bare mast per occupied column so that "on the side where the
 * obstruction is" has somewhere to be.
 */

const WIDTH = 460;
const HEIGHT = 300;
const BASELINE = HEIGHT - 44;
const COLUMN_GAP = 108;
const ROW_GAP = 52;
const ROW_BASE = 96;
const SIZE = 36;

const INK = '#0d1b24';
const SKY_TOP = '#93b6cc';
const SKY_BOTTOM = '#c9dbe6';

function ShapeMark({ form, cx, cy }: { form: ShapeForm; cx: number; cy: number }) {
  const r = SIZE / 2;

  switch (form) {
    case 'ball':
      return <circle cx={cx} cy={cy} r={r * 0.92} fill={INK} />;

    case 'cone-up':
      return (
        <polygon
          points={`${cx},${cy - r} ${cx - r * 0.9},${cy + r} ${cx + r * 0.9},${cy + r}`}
          fill={INK}
        />
      );

    case 'cone-down':
      return (
        <polygon
          points={`${cx},${cy + r} ${cx - r * 0.9},${cy - r} ${cx + r * 0.9},${cy - r}`}
          fill={INK}
        />
      );

    case 'diamond':
      return (
        <polygon
          points={`${cx},${cy - r} ${cx + r * 0.8},${cy} ${cx},${cy + r} ${cx - r * 0.8},${cy}`}
          fill={INK}
        />
      );

    case 'cylinder':
      // Drawn as the Rules describe it: taller than it is wide, flat ended.
      return (
        <rect
          x={cx - r * 0.72}
          y={cy - r}
          width={r * 1.44}
          height={r * 2}
          rx={2}
          fill={INK}
        />
      );

    case 'basket': {
      // Drawn as a woven basket: a tapered body with a rim and cross-hatching,
      // so it cannot be read as a cylinder or a ball.
      const w = r * 1.5;
      const h = r * 1.5;
      return (
        <g stroke={INK} strokeWidth={1.6} fill="none">
          <path
            d={`M ${cx - w} ${cy - h * 0.7} L ${cx + w} ${cy - h * 0.7} L ${cx + w * 0.62} ${cy + h * 0.8} L ${cx - w * 0.62} ${cy + h * 0.8} Z`}
            fill="#0d1b24"
            fillOpacity={0.18}
          />
          <line x1={cx - w} y1={cy - h * 0.7} x2={cx + w} y2={cy - h * 0.7} />
          <line x1={cx - w * 0.86} y1={cy + h * 0.05} x2={cx + w * 0.86} y2={cy + h * 0.05} />
          <line x1={cx - w * 0.33} y1={cy - h * 0.7} x2={cx - w * 0.2} y2={cy + h * 0.8} />
          <line x1={cx + w * 0.33} y1={cy - h * 0.7} x2={cx + w * 0.2} y2={cy + h * 0.8} />
        </g>
      );
    }

    case 'flag-a': {
      // International Code flag A: white at the hoist, blue at the fly, with
      // the fly cut into a swallowtail.
      const w = r * 2.1;
      const h = r * 1.5;
      const x = cx - w / 2;
      const y = cy - h / 2;
      return (
        <g>
          <rect x={x} y={y} width={w / 2} height={h} fill="#f4f8fa" stroke={INK} strokeWidth={1.5} />
          <polygon
            points={`${x + w / 2},${y} ${x + w},${y} ${x + w * 0.82},${cy} ${x + w},${y + h} ${x + w / 2},${y + h}`}
            fill="#1f6bb0"
            stroke={INK}
            strokeWidth={1.5}
          />
        </g>
      );
    }
  }
}

export function ShapeScene({ vessel, compact = false }: { vessel: VesselState; compact?: boolean }) {
  const shapes: Shape[] = shapesFor(vessel);
  const columns = [...new Set(shapes.map((s) => s.column))].sort((a, b) => a - b);

  const maxRow = Math.max(0, ...shapes.map((s) => s.row));
  const xOf = (col: number) => WIDTH / 2 + col * COLUMN_GAP;
  const yOf = (row: number) => ROW_BASE + (maxRow - row) * ROW_GAP;

  return (
    <svg
      className={compact ? 'scene day small' : 'scene day'}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label="Daylight scene showing the day signals of a vessel"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={SKY_TOP} />
          <stop offset="100%" stopColor={SKY_BOTTOM} />
        </linearGradient>
      </defs>

      <rect width={WIDTH} height={HEIGHT} fill="url(#sky)" />
      <line x1="0" y1={BASELINE} x2={WIDTH} y2={BASELINE} stroke="#6b93ab" strokeWidth="1" />

      {/* A yard joining the outer columns, so side signals hang from something. */}
      {columns.length > 1 && (
        <line
          x1={xOf(columns[0]!)}
          y1={yOf(0) + SIZE * 0.75}
          x2={xOf(columns[columns.length - 1]!)}
          y2={yOf(0) + SIZE * 0.75}
          stroke={INK}
          strokeWidth="2"
          opacity="0.45"
        />
      )}

      {columns.map((col) => (
        <line
          key={col}
          x1={xOf(col)}
          y1={yOf(maxRow) - SIZE}
          x2={xOf(col)}
          y2={BASELINE}
          stroke={INK}
          strokeWidth="2"
          opacity="0.45"
        />
      ))}

      {shapes.map((s, i) => (
        <ShapeMark key={i} form={s.form} cx={xOf(s.column)} cy={yOf(s.row)} />
      ))}
    </svg>
  );
}
