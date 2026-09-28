import { useId, useMemo } from 'react';
import type { Character, LightColour } from '../core/coastal/model.ts';
import { spoken, timeline } from '../core/coastal/model.ts';
import { useFlash } from './useFlash.ts';

/**
 * A light ashore at night, running its character at true speed.
 *
 * The headland and tower are drawn only as a faint silhouette against the
 * sky, as they are at night: enough to say "this is a lighthouse", nothing
 * that helps identify it. The light, and its reflection on the water, are the
 * whole of the information.
 */

const GLOW: Record<LightColour, string> = {
  W: '#ffffff',
  R: '#ff4438',
  G: '#3ddc77',
  Y: '#ffd23d',
};

const WIDTH = 460;
const HEIGHT = 260;
const SEA = 196;
const LAMP_X = 300;
const LAMP_Y = 96;

export function CoastalLightScene({
  character,
  compact = false,
}: {
  character: Character;
  compact?: boolean;
}) {
  const uid = useId().replace(/:/g, '');
  const flashing = useMemo(() => {
    const t = timeline(character);
    return { periodMs: t.periodMs, segments: t.phases };
  }, [character]);
  const lit = useFlash(flashing);

  return (
    <svg
      className={`scene coastal${compact ? ' small' : ''}`}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      // The observation, as a sighted student would count it — never the
      // chart notation, which is what they are asked to produce.
      aria-label={`A lighthouse at night showing ${spoken(character)}`}
    >
      <defs>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#020912" />
          <stop offset="100%" stopColor="#0b1a2a" />
        </linearGradient>
        <filter id={`glow-${uid}`} x="-400%" y="-400%" width="900%" height="900%">
          <feGaussianBlur stdDeviation="8" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width={WIDTH} height={HEIGHT} fill={`url(#sky-${uid})`} />
      {[
        [40, 30],
        [92, 62],
        [150, 22],
        [210, 48],
        [388, 34],
        [430, 70],
        [60, 110],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={0.9} fill="#7f93a8" opacity={0.6} />
      ))}

      <rect y={SEA} width={WIDTH} height={HEIGHT - SEA} fill="#01060b" />

      {/* Headland and tower, barely darker than the sky. */}
      <path
        d={`M 210 ${SEA} C 240 170, 262 150, 284 142 L 318 140 C 350 146, 400 170, 460 176 L 460 ${SEA} Z`}
        fill="#040b13"
      />
      <path
        d={`M ${LAMP_X - 9} 142 L ${LAMP_X - 6} ${LAMP_Y + 8} L ${LAMP_X + 6} ${LAMP_Y + 8} L ${LAMP_X + 9} 142 Z`}
        fill="#06101a"
      />
      <rect x={LAMP_X - 7} y={LAMP_Y - 6} width={14} height={14} rx={2} fill="#06101a" />

      {lit && (
        <>
          {/* The light's path on the water. */}
          <path
            d={`M ${LAMP_X - 3} ${SEA + 2} L ${LAMP_X + 3} ${SEA + 2} L ${LAMP_X - 40} ${HEIGHT} L ${LAMP_X - 70} ${HEIGHT} Z`}
            fill={GLOW[lit]}
            opacity={0.12}
          />
          <g filter={`url(#glow-${uid})`}>
            <circle cx={LAMP_X} cy={LAMP_Y} r={14} fill={GLOW[lit]} opacity={0.3} />
            <circle cx={LAMP_X} cy={LAMP_Y} r={5.5} fill={GLOW[lit]} />
          </g>
        </>
      )}
    </svg>
  );
}
