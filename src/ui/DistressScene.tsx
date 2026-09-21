/**
 * The two Annex IV distress signals that are objects rather than events.
 *
 * Most of the list is a flare, a sound, a radio alert or a gesture, and words
 * carry those as well as a picture would. These two are hoists, and a hoist is
 * worth drawing: N over C is the only two-flag signal that means distress, and
 * the square-and-ball is the one you improvise from what is aboard.
 */

const WIDTH = 460;
const HEIGHT = 240;
const MAST_X = 150;

const BLUE = '#1f5fae';
const RED = '#c9342b';
const WHITE = '#f2f6f8';
const INK = '#16232c';

/** November: a four by four chequer of blue and white. */
function FlagN({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const cells = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      cells.push(
        <rect
          key={`${row}-${col}`}
          x={x + (col * w) / 4}
          y={y + (row * h) / 4}
          width={w / 4}
          height={h / 4}
          fill={(row + col) % 2 === 0 ? BLUE : WHITE}
        />,
      );
    }
  }
  return (
    <g>
      {cells}
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={INK} strokeWidth={1.5} />
    </g>
  );
}

/** Charlie: five horizontal stripes, blue white red white blue. */
function FlagC({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const stripes = [BLUE, WHITE, RED, WHITE, BLUE];
  return (
    <g>
      {stripes.map((colour, i) => (
        <rect
          key={i}
          x={x}
          y={y + (i * h) / 5}
          width={w}
          height={h / 5}
          fill={colour}
        />
      ))}
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={INK} strokeWidth={1.5} />
    </g>
  );
}

export function DistressScene({
  visual,
  compact = false,
}: {
  visual: 'flags-nc' | 'square-and-ball';
  compact?: boolean;
}) {
  const flagW = 92;
  const flagH = 68;
  const top = 34;

  return (
    <svg
      className={`scene day${compact ? ' small' : ''}`}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={
        visual === 'flags-nc'
          ? 'Two code flags hoisted one above the other'
          : 'A square flag hoisted with a ball below it'
      }
    >
      <defs>
        <linearGradient id="distress-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93b6cc" />
          <stop offset="100%" stopColor="#c9dbe6" />
        </linearGradient>
      </defs>
      <rect width={WIDTH} height={HEIGHT} fill="url(#distress-sky)" />

      <line
        x1={MAST_X}
        y1={16}
        x2={MAST_X}
        y2={HEIGHT - 20}
        stroke={INK}
        strokeWidth={3}
        opacity={0.55}
      />

      {visual === 'flags-nc' ? (
        <>
          <FlagN x={MAST_X + 6} y={top} w={flagW} h={flagH} />
          <FlagC x={MAST_X + 6} y={top + flagH + 14} w={flagW} h={flagH} />
        </>
      ) : (
        <>
          {/*
            Annex IV, 1(g): a square flag with a ball, or anything resembling a
            ball, above or below it. The flag may be any colour — drawn plain
            so the shape is the signal, which is the point.
          */}
          <rect
            x={MAST_X + 6}
            y={top}
            width={flagH}
            height={flagH}
            fill="#e4ebef"
            stroke={INK}
            strokeWidth={1.5}
          />
          <circle
            cx={MAST_X + 6 + flagH / 2}
            cy={top + flagH + 38}
            r={24}
            fill={INK}
          />
        </>
      )}
    </svg>
  );
}
