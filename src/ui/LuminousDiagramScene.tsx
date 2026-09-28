import { luminousRangeNm } from '../core/coastal/range.ts';

/**
 * The luminous range diagram: nominal range across, luminous range up, one
 * curve per meteorological visibility — the chart every list of lights prints,
 * computed here from Allard's law as IALA R0202 prescribes. Read it as you
 * would the printed one: up from the nominal range to the visibility's curve,
 * then across. The luminous range scale is logarithmic, as on the printed
 * diagram, so short ranges in poor visibility can be read as easily as long
 * ones.
 */

const W = 340;
const H = 300;
const PAD = { l: 38, r: 44, t: 16, b: 34 };
const MAX_X = 30;
const MIN_Y = 0.5;
const MAX_Y = 60;
const CURVES = [1, 2, 3, 5, 10, 20];
const Y_TICKS = [0.5, 1, 2, 3, 5, 10, 20, 30, 50];
const Y_GRID = [0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 40, 50, 60];

const x = (n: number) => PAD.l + (n / MAX_X) * (W - PAD.l - PAD.r);
const y = (n: number) =>
  H - PAD.b - ((Math.log(n) - Math.log(MIN_Y)) / (Math.log(MAX_Y) - Math.log(MIN_Y))) * (H - PAD.t - PAD.b);

export function LuminousDiagramScene({ mark }: { mark: { nominal: number; visibility: number } | undefined }) {
  const lum = mark ? luminousRangeNm(mark.nominal, mark.visibility) : 0;
  return (
    <svg className="scene luminous" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Luminous range diagram">
      <rect width={W} height={H} fill="#fbf8ef" />
      {Array.from({ length: MAX_X / 2 + 1 }, (_, i) => i * 2).map((n) => (
        <line key={`x${n}`} x1={x(n)} y1={y(MIN_Y)} x2={x(n)} y2={y(MAX_Y)} stroke={n % 10 === 0 ? '#d9cfae' : '#ece4cb'} />
      ))}
      {Y_GRID.map((n) => (
        <line key={`y${n}`} x1={x(0)} y1={y(n)} x2={x(MAX_X)} y2={y(n)} stroke={Y_TICKS.includes(n) ? '#d9cfae' : '#ece4cb'} />
      ))}
      {[0, 5, 10, 15, 20, 25, 30].map((n) => (
        <text key={`xl${n}`} x={x(n)} y={y(MIN_Y) + 13} textAnchor="middle" fontSize="10" fill="#5e7489">
          {n}
        </text>
      ))}
      {Y_TICKS.map((n) => (
        <text key={`yl${n}`} x={x(0) - 5} y={y(n) + 3.5} textAnchor="end" fontSize="10" fill="#5e7489">
          {n}
        </text>
      ))}
      <text x={(x(0) + x(MAX_X)) / 2} y={H - 6} textAnchor="middle" fontSize="10.5" fill="#5e7489" fontWeight="600">
        Nominal range (M)
      </text>
      <text x={11} y={(y(MIN_Y) + y(MAX_Y)) / 2} textAnchor="middle" fontSize="10.5" fill="#5e7489" fontWeight="600" transform={`rotate(-90 11 ${(y(MIN_Y) + y(MAX_Y)) / 2})`}>
        Luminous range (M)
      </text>

      {CURVES.map((v) => {
        const pts: string[] = [];
        let last: [number, number] = [0, 0];
        for (let n = 0.5; n <= MAX_X; n += 0.25) {
          const l = luminousRangeNm(n, v);
          if (l < MIN_Y) continue;
          if (l > MAX_Y) break;
          last = [x(n), y(l)];
          pts.push(`${last[0].toFixed(1)},${last[1].toFixed(1)}`);
        }
        return (
          <g key={v}>
            <polyline points={pts.join(' ')} fill="none" stroke={v === 10 ? '#7a3f9a' : '#b4540a'} strokeWidth={v === 10 ? 1.8 : 1.3} />
            <text x={last[0] + 3} y={last[1] + 3} fontSize="9.5" fill={v === 10 ? '#7a3f9a' : '#b4540a'} fontWeight="700">
              {v < 1 ? v : v} M
            </text>
          </g>
        );
      })}

      {mark && (
        <g stroke="#102a43" strokeDasharray="3 3" strokeWidth={1.4}>
          <line x1={x(mark.nominal)} y1={y(MIN_Y)} x2={x(mark.nominal)} y2={y(lum)} />
          <line x1={x(0)} y1={y(lum)} x2={x(mark.nominal)} y2={y(lum)} />
          <circle cx={x(mark.nominal)} cy={y(lum)} r={4} fill="#102a43" stroke="none" />
        </g>
      )}
      <text x={x(0) + 4} y={PAD.t + 8} fontSize="9.5" fill="#5e7489">
        curves: meteorological visibility
      </text>
    </svg>
  );
}
