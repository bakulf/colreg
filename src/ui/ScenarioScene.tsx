import type { Scenario } from '../core/scenarios/model.ts';
import { norm, relativeBearing } from '../core/scenarios/model.ts';

/**
 * A head-up plot of the encounter: you at the centre, your heading up the page.
 *
 * Head-up rather than north-up because every rule in Section II is written in
 * terms of your own head — "on her own starboard side", "forward of the beam",
 * "22.5 degrees abaft her beam". A north-up plot would make the student rotate
 * the picture before they could apply the rule.
 *
 * In restricted visibility she is a radar contact and nothing else. Drawing a
 * ship there would quietly contradict Rule 19, which applies precisely because
 * you cannot see her.
 */

const SIZE = 340;
const C = SIZE / 2;
const R = 132;

const FAINT = '#1d3d4f';
const OWN = '#46b0d8';
const HER = '#e8b13d';

function xy(relBearing: number, range: number): [number, number] {
  const t = (relBearing * Math.PI) / 180;
  return [C + range * Math.sin(t), C - range * Math.cos(t)];
}

/** A vessel drawn as a boat-shaped wedge pointing along her heading. */
function Hull({
  x,
  y,
  headingRel,
  colour,
  scale = 1,
}: {
  x: number;
  y: number;
  headingRel: number;
  colour: string;
  scale?: number;
}) {
  const l = 15 * scale;
  const w = 7 * scale;
  return (
    <g transform={`translate(${x} ${y}) rotate(${headingRel})`}>
      <path
        d={`M 0 ${-l} L ${w} ${-l * 0.1} L ${w * 0.8} ${l * 0.8} L ${-w * 0.8} ${l * 0.8} L ${-w} ${-l * 0.1} Z`}
        fill={colour}
      />
      {/* Heading vector, so aspect is unambiguous. */}
      <line x1={0} y1={-l} x2={0} y2={-l - 22 * scale} stroke={colour} strokeWidth={2} />
      <path
        d={`M 0 ${-l - 26 * scale} L ${-3.5 * scale} ${-l - 18 * scale} L ${3.5 * scale} ${-l - 18 * scale} Z`}
        fill={colour}
      />
    </g>
  );
}

export function ScenarioScene({
  scenario,
  compact = false,
}: {
  scenario: Scenario;
  compact?: boolean;
}) {
  const rel = relativeBearing(scenario);
  const herHeadingRel = norm(scenario.herHeading - scenario.ownHeading);
  const [hx, hy] = xy(rel, R * 0.72);
  const fog = scenario.restrictedVisibility;

  return (
    <svg
      className={`scene plot${compact ? ' small' : ''}`}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="img"
      aria-label="Head-up plot of the encounter, your vessel at the centre"
    >
      <rect width={SIZE} height={SIZE} fill={fog ? '#0a1219' : '#061520'} />

      {/* Range rings and the cardinal relative bearings. */}
      {[R, R * 0.66, R * 0.33].map((r) => (
        <circle key={r} cx={C} cy={C} r={r} fill="none" stroke={FAINT} strokeWidth={1} />
      ))}
      {[0, 90, 180, 270].map((b) => {
        const [x1, y1] = xy(b, R * 0.33);
        const [x2, y2] = xy(b, R);
        return <line key={b} x1={x1} y1={y1} x2={x2} y2={y2} stroke={FAINT} strokeWidth={1} />;
      })}

      {/* The 22.5-degrees-abaft-the-beam boundary: the overtaking sector, and
          the edge of your own sidelight arcs. */}
      {[112.5, 247.5].map((b) => {
        const [x2, y2] = xy(b, R);
        return (
          <line
            key={b}
            x1={C}
            y1={C}
            x2={x2}
            y2={y2}
            stroke="#2a5e78"
            strokeWidth={1}
            strokeDasharray="3 4"
          />
        );
      })}

      {['000', '090', '180', '270'].map((label, i) => {
        const [x, y] = xy(i * 90, R + 16);
        return (
          <text
            key={label}
            x={x}
            y={y + 4}
            textAnchor="middle"
            fill="#5f89a1"
            fontSize="11"
            fontFamily="ui-monospace, monospace"
          >
            {label}
          </text>
        );
      })}

      <Hull x={C} y={C} headingRel={0} colour={OWN} />

      {fog ? (
        <g>
          {/* A radar paint: position and nothing more. */}
          <circle cx={hx} cy={hy} r={13} fill={HER} opacity={0.14} />
          <circle cx={hx} cy={hy} r={5} fill={HER} />
          <text
            x={C}
            y={SIZE - 12}
            textAnchor="middle"
            fill="#6f8ea1"
            fontSize="11"
            letterSpacing="0.1em"
          >
            RADAR CONTACT — NOT IN SIGHT
          </text>
        </g>
      ) : (
        <Hull x={hx} y={hy} headingRel={herHeadingRel} colour={HER} />
      )}
    </svg>
  );
}
