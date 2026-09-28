import type { TideCurve, TideLevels } from '../core/types.ts';
import { TWELFTHS, twelfthsHeight } from '../core/tides/model.ts';

/**
 * Tidal height pictures: a cross-section of the water — chart datum, the sea,
 * the bottom or a drying bank, a bridge — and a rule-of-twelfths curve.
 * Drawn after answering, with the figures of the question on them.
 */

const W = 320;
const H = 280;

function clock(minutes: number): string {
  const v = ((Math.round(minutes) % 1440) + 1440) % 1440;
  return `${String(Math.floor(v / 60)).padStart(2, '0')}${String(v % 60).padStart(2, '0')}`;
}

function Dim({ x, y1, y2, label, colour }: { x: number; y1: number; y2: number; label: string; colour: string }) {
  if (Math.abs(y2 - y1) < 2) return null;
  const top = Math.min(y1, y2);
  const bottom = Math.max(y1, y2);
  return (
    <g stroke={colour} fill={colour}>
      <line x1={x} y1={top} x2={x} y2={bottom} strokeWidth={1.2} />
      <path d={`M ${x - 3} ${top + 5} L ${x} ${top} L ${x + 3} ${top + 5}`} fill="none" strokeWidth={1.2} />
      <path d={`M ${x - 3} ${bottom - 5} L ${x} ${bottom} L ${x + 3} ${bottom - 5}`} fill="none" strokeWidth={1.2} />
      <text x={x + 6} y={(top + bottom) / 2 + 4} fontSize="11" stroke="none" fontWeight="600">
        {label}
      </text>
    </g>
  );
}

export function TideLevelsScene({ levels }: { levels: TideLevels }) {
  const { heightOfTide: hot, chartedDepth, dryingHeight, hat, clearance, draught } = levels;
  const top = hat !== undefined && clearance !== undefined ? hat + clearance + 1 : hot + 1.5;
  const bottom = chartedDepth !== undefined ? -chartedDepth - 0.8 : -1;
  const k = (H - 40) / (top - bottom);
  const y = (h: number) => 20 + (top - h) * k;
  const sea = y(hot);
  const cd = y(0);

  return (
    <svg className="scene levels" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Cross-section of the water and chart datum">
      <rect width={W} height={H} fill="#f7fafc" />
      {/* The sea. */}
      <rect x={0} y={sea} width={W} height={H - sea} fill="#cfe6f3" />
      <line x1={0} y1={sea} x2={W} y2={sea} stroke="#1464c0" strokeWidth={1.6} />
      <text x={8} y={sea - 5} fontSize="10.5" fill="#1464c0" fontWeight="600">
        sea level now
      </text>

      {/* Chart datum. */}
      <line x1={0} y1={cd} x2={W} y2={cd} stroke="#7a3f9a" strokeWidth={1.2} strokeDasharray="5 4" />
      <text x={W - 8} y={cd + 13} textAnchor="end" fontSize="10.5" fill="#7a3f9a" fontWeight="600">
        chart datum
      </text>

      {/* The bottom, or a drying bank. */}
      {chartedDepth !== undefined && (
        <rect x={0} y={y(-chartedDepth)} width={W} height={H - y(-chartedDepth)} fill="#d8c9a3" />
      )}
      {dryingHeight !== undefined && (
        <>
          <rect x={0} y={y(-0.6)} width={W} height={H - y(-0.6)} fill="#d8c9a3" />
          <path
            d={`M 60 ${y(-0.6)} C 110 ${y(dryingHeight)}, 150 ${y(dryingHeight)}, 190 ${y(dryingHeight)} C 230 ${y(dryingHeight)}, 260 ${y(dryingHeight)}, ${W} ${y(-0.6)} Z`}
            fill="#d8c9a3"
          />
        </>
      )}

      {/* A boat, for a draught. */}
      {draught !== undefined && (
        <path
          d={`M 150 ${sea - 6} L 230 ${sea - 6} L 215 ${sea + draught * k * 0.35} L 195 ${sea + draught * k} L 185 ${sea + draught * k} L 175 ${sea + draught * k * 0.35} Z`}
          fill="#ffffff"
          stroke="#102a43"
          strokeWidth={1.2}
        />
      )}

      {/* HAT and a bridge. */}
      {hat !== undefined && clearance !== undefined && (
        <>
          <line x1={0} y1={y(hat)} x2={W} y2={y(hat)} stroke="#c2410c" strokeWidth={1} strokeDasharray="3 3" />
          <text x={8} y={y(hat) - 5} fontSize="10.5" fill="#c2410c" fontWeight="600">
            HAT
          </text>
          <rect x={0} y={y(hat + clearance) - 10} width={W} height={10} fill="#5e7489" />
        </>
      )}

      {/* Dimensions. */}
      <Dim x={hat !== undefined ? 70 : 120} y1={cd} y2={sea} label={`${hot.toFixed(1)} m tide`} colour="#1464c0" />
      {chartedDepth !== undefined && (
        <>
          <Dim x={40} y1={cd} y2={y(-chartedDepth)} label={`${chartedDepth.toFixed(1)} charted`} colour="#7a3f9a" />
          <Dim x={250} y1={sea} y2={y(-chartedDepth)} label={`${(chartedDepth + hot).toFixed(1)} m depth`} colour="#102a43" />
        </>
      )}
      {dryingHeight !== undefined && (
        <>
          <Dim x={200} y1={cd} y2={y(dryingHeight)} label={`${dryingHeight.toFixed(1)} dries`} colour="#7a3f9a" />
          {draught === undefined && (
            <Dim x={260} y1={y(dryingHeight)} y2={sea} label={`${(hot - dryingHeight).toFixed(1)} m`} colour="#102a43" />
          )}
        </>
      )}
      {hat !== undefined && clearance !== undefined && (
        <>
          <Dim x={228} y1={y(hat)} y2={y(hat + clearance)} label={`${clearance.toFixed(1)} charted`} colour="#c2410c" />
          <Dim x={140} y1={sea} y2={y(hat + clearance)} label={`${(clearance + hat - hot).toFixed(1)} m now`} colour="#102a43" />
        </>
      )}
    </svg>
  );
}

export function TideCurveScene({ curve }: { curve: TideCurve }) {
  const { lw, hw, rising, markHours, startClock } = curve;
  const pad = { l: 40, r: 16, t: 20, b: 34 };
  const x = (h: number) => pad.l + (h / 6) * (W - pad.l - pad.r);
  const y = (m: number) => pad.t + ((hw + 0.3 - m) / (hw - lw + 0.6)) * (H - pad.t - pad.b);
  // A smooth curve through the twelfths points.
  const pts = Array.from({ length: 61 }, (_, i) => {
    const t = i / 10;
    const f = (1 - Math.cos((Math.PI * t) / 6)) / 2;
    const h = rising ? lw + (hw - lw) * f : hw - (hw - lw) * f;
    return `${x(t).toFixed(1)},${y(h).toFixed(1)}`;
  });
  const markH = twelfthsHeight(lw, hw, markHours, rising);

  return (
    <svg className="scene curve" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Tidal curve by the rule of twelfths">
      <rect width={W} height={H} fill="#f7fafc" />
      {[0, 1, 2, 3, 4, 5, 6].map((h) => (
        <g key={h}>
          <line x1={x(h)} y1={pad.t} x2={x(h)} y2={H - pad.b} stroke="#dbe5ee" />
          <text x={x(h)} y={H - pad.b + 14} textAnchor="middle" fontSize="10" fill="#5e7489">
            {clock(startClock + h * 60)}
          </text>
          {h > 0 && (
            <text x={x(h - 0.5)} y={H - 6} textAnchor="middle" fontSize="9.5" fill="#a21caf" fontWeight="700">
              {(TWELFTHS[h] as number) - (TWELFTHS[h - 1] as number)}/12
            </text>
          )}
        </g>
      ))}
      <line x1={pad.l} y1={y(lw)} x2={W - pad.r} y2={y(lw)} stroke="#dbe5ee" />
      <line x1={pad.l} y1={y(hw)} x2={W - pad.r} y2={y(hw)} stroke="#dbe5ee" />
      <text x={pad.l - 6} y={y(hw) + 4} textAnchor="end" fontSize="10" fill="#5e7489">
        {hw.toFixed(1)}
      </text>
      <text x={pad.l - 6} y={y(lw) + 4} textAnchor="end" fontSize="10" fill="#5e7489">
        {lw.toFixed(1)}
      </text>
      <polyline points={pts.join(' ')} fill="none" stroke="#a21caf" strokeWidth={2.2} />
      <line x1={x(markHours)} y1={y(markH)} x2={x(markHours)} y2={H - pad.b} stroke="#102a43" strokeDasharray="3 3" />
      <line x1={pad.l} y1={y(markH)} x2={x(markHours)} y2={y(markH)} stroke="#102a43" strokeDasharray="3 3" />
      <circle cx={x(markHours)} cy={y(markH)} r={4.5} fill="#102a43" />
      <text x={x(markHours) + (markHours < 5 ? 8 : -8)} y={y(markH) - 8} textAnchor={markHours < 5 ? 'start' : 'end'} fontSize="12" fontWeight="700" fill="#102a43">
        {markH.toFixed(1)} m
      </text>
    </svg>
  );
}
