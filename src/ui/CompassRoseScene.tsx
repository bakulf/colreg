import type { RoseVariation } from '../core/compass/model.ts';
import { roseText, variationMinutesIn } from '../core/compass/model.ts';

/**
 * A chart's compass rose: the outer ring true, the inner ring magnetic,
 * turned by the variation for the year printed, and the variation written
 * across the middle in the chart's own words.
 *
 * The inner ring is drawn for the rose's year, as a real chart's is. Bringing
 * it up to date is the student's job.
 */

const SIZE = 300;
const C = SIZE / 2;
const R_OUT = 132;
const R_IN = 96;

function ring(radius: number, rotate: number, major: number, label: boolean) {
  const ticks = [];
  for (let d = 0; d < 360; d += 5) {
    const long = d % major === 0;
    const len = long ? 10 : d % 10 === 0 ? 6 : 3;
    const a = ((d + rotate) * Math.PI) / 180;
    const x1 = C + radius * Math.sin(a);
    const y1 = C - radius * Math.cos(a);
    const x2 = C + (radius - len) * Math.sin(a);
    const y2 = C - (radius - len) * Math.cos(a);
    ticks.push(<line key={`t${d}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#7a3f9a" strokeWidth={long ? 1.4 : 0.8} />);
    if (label && long) {
      const lx = C + (radius - 20) * Math.sin(a);
      const ly = C - (radius - 20) * Math.cos(a) + 3.5;
      ticks.push(
        <text key={`l${d}`} x={lx} y={ly} textAnchor="middle" fontSize="9.5" fill="#7a3f9a" fontFamily="ui-sans-serif, system-ui">
          {String(d).padStart(3, '0')}
        </text>,
      );
    }
  }
  return ticks;
}

export function CompassRoseScene({ rose, compact = false }: { rose: RoseVariation; compact?: boolean }) {
  const variation = variationMinutesIn(rose, rose.year) / 60;
  const text = roseText(rose);
  const [value, year, change] = text.split(' ');

  return (
    <svg
      className={`scene rose${compact ? ' small' : ''}`}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="img"
      aria-label={`A compass rose printed ${text}`}
    >
      <rect width={SIZE} height={SIZE} fill="#fbf8ef" />
      <circle cx={C} cy={C} r={R_OUT} fill="none" stroke="#7a3f9a" strokeWidth={1.2} />
      <circle cx={C} cy={C} r={R_IN} fill="none" stroke="#7a3f9a" strokeWidth={1} />
      {ring(R_OUT, 0, 30, true)}
      {ring(R_IN, variation, 90, false)}

      {/* True north: the star. Magnetic north: the arrow on the inner ring. */}
      <path d={`M ${C} ${C - R_OUT - 10} l 4 9 l -8 0 z`} fill="#7a3f9a" />
      <g transform={`rotate(${variation} ${C} ${C})`}>
        <line x1={C} y1={C - 30} x2={C} y2={C - R_IN + 12} stroke="#7a3f9a" strokeWidth={1.2} />
        <path d={`M ${C} ${C - R_IN + 4} l 5 11 l -10 0 z`} fill="#7a3f9a" />
      </g>

      <text x={C} y={C - 6} textAnchor="middle" fontSize="13" fontWeight="600" fill="#4a2560" fontFamily="ui-sans-serif, system-ui">
        {value} {year}
      </text>
      <text x={C} y={C + 12} textAnchor="middle" fontSize="12" fill="#4a2560" fontFamily="ui-sans-serif, system-ui">
        {change}
      </text>
    </svg>
  );
}
