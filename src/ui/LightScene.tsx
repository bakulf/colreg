import { useId } from 'react';
import type { VesselState } from '../core/lights/model.ts';
import { lightsFor } from '../core/lights/model.ts';
import { aspectLabel, projectScene } from '../core/lights/project.ts';
import type { LightColour } from '../core/lights/model.ts';

/**
 * A vessel's lights as they appear from the observer's position.
 *
 * Deliberately no hull, no silhouette, no horizon glow beyond a hint: at night
 * you see lights and nothing else, and drawing the ship would hand over the
 * aspect and the size for free. Everything on screen is derived from the model
 * and the Rule 21 arcs, so the picture cannot disagree with the answer.
 */

const HULL: Record<LightColour, string> = {
  white: '#ffffff',
  red: '#ff4438',
  green: '#3ddc77',
  yellow: '#ffd23d',
};

/**
 * The scale is fixed, never fitted to the lights on screen. A vessel seen
 * beam-on spreads her lights across the view and one seen end-on stacks them
 * in a line; that spread is the aspect, and rescaling each scene to fill the
 * frame would throw away the single most useful thing in the picture.
 */
const WIDTH = 460;
const HEIGHT = 300;
const SCALE = 165;
const BASELINE = HEIGHT - 44;

interface Props {
  vessel: VesselState;
  aspectDeg: number;
  compact?: boolean;
}

export function LightScene({ vessel, aspectDeg, compact = false }: Props) {
  const uid = useId().replace(/:/g, '');
  const glow = `glow-${uid}`;
  const lights = projectScene(lightsFor(vessel), aspectDeg);

  return (
    <svg
      className={compact ? 'scene small' : 'scene'}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label="Night scene showing the navigation lights of a vessel"
    >
      <defs>
        <filter id={glow} x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="5" result="blurred" />
          <feMerge>
            <feMergeNode in="blurred" />
            <feMergeNode in="blurred" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width={WIDTH} height={HEIGHT} fill="#01070c" />
      <line
        x1="0"
        y1={BASELINE}
        x2={WIDTH}
        y2={BASELINE}
        stroke="#0e2836"
        strokeWidth="1"
      />

      {/*
        The bearing is given, not hidden. Working out the aspect from the
        spread is a separate skill from knowing the configuration, and making
        a student do both at once teaches neither.
      */}
      <text
        x={WIDTH / 2}
        y={HEIGHT - 16}
        textAnchor="middle"
        fill="#5f89a1"
        fontSize="15"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        letterSpacing="0.08em"
      >
        {aspectLabel(aspectDeg).toUpperCase()}
      </text>

      {lights.map((light, i) => {
        const cx = WIDTH / 2 + light.x * SCALE;
        const cy = BASELINE - light.y * SCALE;
        // Rule 30(c) deck illumination is a wash of working light, not a
        // navigation light, so it is drawn smaller and softer.
        const r = light.dim ? 2.4 : 3.8;
        const halo = light.dim ? 5 : 7.5;
        return (
          <g
            key={i}
            filter={`url(#${glow})`}
            className={light.flashing ? 'flashing' : undefined}
          >
            <circle
              cx={cx}
              cy={cy}
              r={halo}
              fill={HULL[light.colour]}
              opacity={light.dim ? 0.18 : 0.3}
            />
            <circle cx={cx} cy={cy} r={r} fill={HULL[light.colour]} />
          </g>
        );
      })}
    </svg>
  );
}
