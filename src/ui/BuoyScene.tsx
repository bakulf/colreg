import { useEffect, useId, useRef, useState } from 'react';
import type { BuoyColour, LightCharacter, MarkKind, Topmark } from '../core/buoyage/model.ts';
import { markAt } from '../core/buoyage/model.ts';

/**
 * A buoy, by day as body and topmark, by night as its light alone — flashing at
 * the real rate.
 *
 * The animation is the content, not decoration. VQ(6)+LFl.10s on a chart is a
 * string to memorise; six quick flashes, a long one, and a pause you have to
 * wait out is a rhythm you recognise. So the period runs at true speed, long
 * eclipses included: sitting through eight seconds of darkness waiting for a
 * safe-water mark to flash again is part of the lesson.
 */

const INK: Record<BuoyColour, string> = {
  red: '#d13b32',
  green: '#2e9e5b',
  yellow: '#e8c33d',
  black: '#14181c',
  white: '#f2f6f8',
  blue: '#2a63b8',
};

const GLOW: Record<BuoyColour, string> = {
  red: '#ff4438',
  green: '#3ddc77',
  yellow: '#ffd23d',
  black: '#14181c',
  white: '#ffffff',
  blue: '#5aa0ff',
};

const WIDTH = 460;
const HEIGHT = 300;
const WATERLINE = 248;
const CX = WIDTH / 2;

/** Body geometry, in the order the drawing needs it. */
const BODY_TOP = 150;
const BODY_BOTTOM = WATERLINE;
const BODY_HALF = 34;

/**
 * Follows a light character in real time.
 *
 * Deliberately not CSS keyframes: the characters are irregular (six quick
 * flashes then a long one then eight seconds of nothing) and generating a
 * keyframe rule per mark would be harder to read than a clock.
 */
function useFlashColour(character: LightCharacter): BuoyColour | null {
  const [colour, setColour] = useState<BuoyColour | null>(null);
  const current = useRef<BuoyColour | null>(null);

  useEffect(() => {
    let frame = 0;
    const started = performance.now();

    const tick = () => {
      const t = (performance.now() - started) % character.periodMs;
      let acc = 0;
      let next: BuoyColour | null = null;
      for (const segment of character.segments) {
        acc += segment.ms;
        if (t < acc) {
          next = segment.colour;
          break;
        }
      }
      if (next !== current.current) {
        current.current = next;
        setColour(next);
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [character]);

  return colour;
}

/**
 * The vertical extent of the body, so horizontal bands divide the hull itself
 * rather than an arbitrary rectangle around it.
 */
function bodyBounds(shape: string): { top: number; bottom: number } {
  switch (shape) {
    case 'conical':
      return { top: BODY_TOP - 12, bottom: BODY_BOTTOM };
    case 'spherical':
      return { top: BODY_BOTTOM - 72, bottom: BODY_BOTTOM + 12 };
    default:
      return { top: BODY_TOP, bottom: BODY_BOTTOM };
  }
}

function bodyPath(shape: string): string {
  const t = BODY_TOP;
  const b = BODY_BOTTOM;
  const h = BODY_HALF;
  switch (shape) {
    case 'can':
      return `M ${CX - h} ${t} L ${CX + h} ${t} L ${CX + h} ${b} L ${CX - h} ${b} Z`;
    case 'conical':
      return `M ${CX} ${t - 12} L ${CX + h} ${b} L ${CX - h} ${b} Z`;
    case 'spherical': {
      // A sphere floating, not a dome: it sits down into the water rather than
      // standing on it.
      const r = 42;
      const cy = b - 30;
      return `M ${CX - r} ${cy} a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 ${-r * 2} 0 Z`;
    }
    default:
      // Pillar: a plain column, which is what carries a cardinal's topmark
      // high enough to be read from a distance.
      return `M ${CX - h * 0.72} ${t} L ${CX + h * 0.72} ${t} L ${CX + h * 0.72} ${b} L ${CX - h * 0.72} ${b} Z`;
  }
}

/**
 * How far a topmark reaches above and below its centre.
 *
 * Needed because a pair of cones is twice the height of a single cone, and a
 * topmark that overlaps the body is unreadable — which is the whole content of
 * a cardinal mark.
 */
function topmarkHalfHeight(form: Topmark): number {
  switch (form) {
    case 'none':
      return 0;
    case 'cones-up':
    case 'cones-down':
    case 'cones-base':
    case 'cones-point':
      return 32;
    case 'spheres':
      return 30;
    default:
      return 15;
  }
}

function TopmarkMark({ form, colour, cy }: { form: Topmark; colour: BuoyColour; cy: number }) {
  const fill = INK[colour];
  const s = 15;
  const gap = 2;

  const cone = (y: number, up: boolean) =>
    up
      ? `${CX},${y - s} ${CX - s * 0.85},${y + s} ${CX + s * 0.85},${y + s}`
      : `${CX},${y + s} ${CX - s * 0.85},${y - s} ${CX + s * 0.85},${y - s}`;

  switch (form) {
    case 'none':
      return null;
    case 'can':
      return <rect x={CX - s * 0.8} y={cy - s} width={s * 1.6} height={s * 2} fill={fill} />;
    case 'cone-up':
      return <polygon points={cone(cy, true)} fill={fill} />;
    case 'cones-up':
      return (
        <g fill={fill}>
          <polygon points={cone(cy - s - gap, true)} />
          <polygon points={cone(cy + s + gap, true)} />
        </g>
      );
    case 'cones-down':
      return (
        <g fill={fill}>
          <polygon points={cone(cy - s - gap, false)} />
          <polygon points={cone(cy + s + gap, false)} />
        </g>
      );
    case 'cones-base':
      // Base to base: an egg. Points outwards, flat faces meeting.
      return (
        <g fill={fill}>
          <polygon points={cone(cy - s - gap, true)} />
          <polygon points={cone(cy + s + gap, false)} />
        </g>
      );
    case 'cones-point':
      // Point to point: a wine glass. Apexes meeting in the middle.
      return (
        <g fill={fill}>
          <polygon points={cone(cy - s - gap, false)} />
          <polygon points={cone(cy + s + gap, true)} />
        </g>
      );
    case 'spheres':
      return (
        <g fill={fill}>
          <circle cx={CX} cy={cy - s - gap} r={s * 0.85} />
          <circle cx={CX} cy={cy + s + gap} r={s * 0.85} />
        </g>
      );
    case 'sphere':
      return <circle cx={CX} cy={cy} r={s} fill={fill} />;
    case 'cross':
      return (
        <g stroke={fill} strokeWidth={7} strokeLinecap="square">
          <line x1={CX - s} y1={cy - s} x2={CX + s} y2={cy + s} />
          <line x1={CX + s} y1={cy - s} x2={CX - s} y2={cy + s} />
        </g>
      );
    case 'upright-cross':
      return (
        <g stroke={fill} strokeWidth={7} strokeLinecap="square">
          <line x1={CX - s} y1={cy} x2={CX + s} y2={cy} />
          <line x1={CX} y1={cy - s} x2={CX} y2={cy + s} />
        </g>
      );
  }
}

interface Props {
  kind: MarkKind;
  mode: 'day' | 'night';
  compact?: boolean;
}

export function BuoyScene({ kind, mode, compact = false }: Props) {
  const mark = markAt(kind);
  const uid = useId().replace(/:/g, '');
  const clip = `body-${uid}`;
  const glow = `bglow-${uid}`;
  const lit = useFlashColour(mark.light);

  const night = mode === 'night';
  const lightY = 96;
  const stripes = mark.body.colours;

  const bounds = bodyBounds(mark.shape);

  // Hang the topmark clear above the body, whatever its height.
  const half = topmarkHalfHeight(mark.topmark);
  const staffTop = bounds.top - 22;
  const topmarkY = staffTop - half;

  return (
    <svg
      className={`scene buoy ${night ? 'night' : 'day'}${compact ? ' small' : ''}`}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      /*
        The label carries the observation, never the shorthand and never the
        answer. "Six very quick flashes and a long flash, every ten seconds" is
        what a sighted student watches and counts, so a screen reader should
        get it too; "VQ(6)+LFl.10s" is the chart abbreviation they are being
        drilled to produce, and reading that out would hand over the work.
      */
      aria-label={
        night
          ? `A buoy at night, its light showing ${mark.light.spoken}`
          : 'A buoy seen in daylight, showing its body colours and topmark'
      }
    >
      <defs>
        <clipPath id={clip}>
          <path d={bodyPath(mark.shape)} />
        </clipPath>
        <filter id={glow} x="-400%" y="-400%" width="900%" height="900%">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width={WIDTH} height={HEIGHT} fill={night ? '#01070c' : '#b9d2e0'} />
      <rect
        y={WATERLINE}
        width={WIDTH}
        height={HEIGHT - WATERLINE}
        fill={night ? '#020c13' : '#7ea7c0'}
      />

      {!night && (
        <>
          {/* Body, its colour pattern painted inside the hull outline. */}
          <g clipPath={`url(#${clip})`}>
            {mark.body.type === 'horizontal'
              ? stripes.map((colour, i) => (
                  <rect
                    key={i}
                    x={CX - 60}
                    y={bounds.top + ((bounds.bottom - bounds.top) / stripes.length) * i}
                    width={120}
                    height={(bounds.bottom - bounds.top) / stripes.length + 1}
                    fill={INK[colour as BuoyColour]}
                  />
                ))
              : // Vertical stripes repeat to fill, as the system draws them.
                Array.from({ length: 8 }, (_, i) => (
                  <rect
                    key={i}
                    x={CX - 60 + i * 15}
                    y={bounds.top}
                    width={15}
                    height={bounds.bottom - bounds.top}
                    fill={INK[stripes[i % stripes.length] as BuoyColour]}
                  />
                ))}
          </g>
          <path d={bodyPath(mark.shape)} fill="none" stroke="#0d1b24" strokeWidth={2} />

          {/* Topmark, on its staff. */}
          {mark.topmark !== 'none' && (
            <>
              <line
                x1={CX}
                y1={bounds.top + 6}
                x2={CX}
                y2={staffTop}
                stroke="#0d1b24"
                strokeWidth={3}
              />
              <TopmarkMark form={mark.topmark} colour={mark.topmarkColour} cy={topmarkY} />
            </>
          )}
        </>
      )}

      {/*
        At night the character is the whole question, so nothing else may be
        drawn — no hull, no topmark, and above all no label.
      */}
      {night && lit && (
        <g filter={`url(#${glow})`}>
          <circle cx={CX} cy={lightY} r={13} fill={GLOW[lit]} opacity={0.3} />
          <circle cx={CX} cy={lightY} r={5.5} fill={GLOW[lit]} />
        </g>
      )}
    </svg>
  );
}
