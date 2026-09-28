import type { ReactNode } from 'react';
import type { Topic } from '../core/types.ts';

/**
 * A thumbnail of each IALA category for the topic picker. Decoration only —
 * the drills draw the real marks with BuoyScene — so the colours follow the
 * system but the proportions are simplified to read at 36 pixels.
 */

const RED = '#d13b32';
const GREEN = '#2e9e5b';
const YELLOW = '#e8c33d';
const BLACK = '#1b2229';
const WHITE = '#ffffff';
const BLUE = '#2a63b8';

function Pillar({ bands, x = 18 }: { bands: string[]; x?: number }) {
  const top = 13;
  const h = 18 / bands.length;
  return (
    <g>
      {bands.map((fill, i) => (
        <rect key={i} x={x - 5} y={top + i * h} width={10} height={h} fill={fill} />
      ))}
      <rect x={x - 5} y={top} width={10} height={18} fill="none" stroke={BLACK} strokeWidth={0.8} />
    </g>
  );
}

export function MarkIcon({ topic }: { topic: Topic }) {
  let body: ReactNode = null;
  switch (topic) {
    case 'iala-lateral':
      body = (
        <g stroke={BLACK} strokeWidth={0.8}>
          <rect x={5} y={14} width={10} height={16} fill={RED} />
          <path d="M 21 30 L 26 12 L 31 30 Z" fill={GREEN} />
        </g>
      );
      break;
    case 'iala-cardinal':
      body = (
        <g>
          <Pillar bands={[BLACK, YELLOW]} />
          <path d="M 14 10 L 18 4 L 22 10 Z M 14 12 L 18 6 L 22 12 Z" fill={BLACK} transform="translate(0 -1)" />
        </g>
      );
      break;
    case 'iala-isolated-danger':
      body = (
        <g>
          <Pillar bands={[BLACK, RED, BLACK]} />
          <circle cx={18} cy={9.5} r={2.3} fill={BLACK} />
          <circle cx={18} cy={4.5} r={2.3} fill={BLACK} />
        </g>
      );
      break;
    case 'iala-safe-water':
      body = (
        <g>
          <circle cx={18} cy={21} r={9} fill={WHITE} stroke={BLACK} strokeWidth={0.8} />
          <path d="M 15 12.5 L 15 29.5 A 9 9 0 0 1 12 27 L 12 15 A 9 9 0 0 1 15 12.5 Z" fill={RED} />
          <path d="M 21 12.5 L 21 29.5 A 9 9 0 0 0 24 27 L 24 15 A 9 9 0 0 0 21 12.5 Z" fill={RED} />
          <circle cx={18} cy={7} r={2.8} fill={RED} />
        </g>
      );
      break;
    case 'iala-special':
      body = (
        <g>
          <Pillar bands={[YELLOW]} />
          <path d="M 14.5 4 L 21.5 10.5 M 21.5 4 L 14.5 10.5" stroke={YELLOW} strokeWidth={2.2} />
        </g>
      );
      break;
    case 'iala-wreck':
      body = (
        <g>
          <Pillar bands={[BLUE, YELLOW, BLUE, YELLOW]} />
          <path d="M 18 3.5 L 18 11 M 14.5 7.25 L 21.5 7.25" stroke={YELLOW} strokeWidth={2.2} />
        </g>
      );
      break;
    default:
      return null;
  }
  return (
    <svg className="markicon" viewBox="0 0 36 36" aria-hidden="true">
      <rect x={0} y={30} width={36} height={6} rx={1} fill="#cfe3ee" />
      {body}
    </svg>
  );
}
