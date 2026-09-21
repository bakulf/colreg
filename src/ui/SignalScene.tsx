import { useEffect, useRef, useState } from 'react';
import { GAP_MS, durationMs, signalById } from '../core/signals/model.ts';
import type { Blast } from '../core/signals/model.ts';

/**
 * A sound signal as a timeline, played back in real time.
 *
 * The blast lengths are drawn to scale, which is the whole point: a prolonged
 * blast is five times a short one, and seeing that beside a playhead crawling
 * across it does what the words "four to six seconds" do not. The playhead
 * runs at true speed for the same reason the buoy lights do.
 *
 * Audio is not wired up yet. When it is, it drives off this same model, and
 * the timeline stays as the visual channel.
 */

const WIDTH = 460;
const HEIGHT = 130;
const MARGIN = 22;
const TRACK_Y = 56;
const TRACK_H = 26;

const BLAST_FILL: Record<Blast['kind'], string> = {
  short: '#46b0d8',
  prolonged: '#46b0d8',
  bell: '#e8b13d',
  gong: '#c98a2e',
};

function usePlayhead(totalMs: number): number {
  const [t, setT] = useState(0);
  const frame = useRef(0);

  useEffect(() => {
    const started = performance.now();
    const tick = () => {
      // A beat of silence after the signal, so a repeated signal reads as
      // repeated rather than running into itself.
      setT((performance.now() - started) % (totalMs + 1400));
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [totalMs]);

  return t;
}

export function SignalScene({ signalId, compact = false }: { signalId: string; compact?: boolean }) {
  const signal = signalById(signalId);
  const total = signal ? durationMs(signal) : 0;
  const playhead = usePlayhead(total);

  if (!signal) return null;

  const usable = WIDTH - MARGIN * 2;
  const scale = usable / total;

  // Lay the blasts out end to end with the gaps between them.
  let cursor = 0;
  const bars = signal.blasts.map((blast, i) => {
    const x = MARGIN + cursor * scale;
    const w = blast.ms * scale;
    cursor += blast.ms + (i < signal.blasts.length - 1 ? GAP_MS : 0);
    return { blast, x, w };
  });

  const headX = MARGIN + Math.min(playhead, total) * scale;
  const sounding = bars.some((b) => headX >= b.x && headX <= b.x + b.w);

  return (
    <svg
      className={`scene signal${compact ? ' small' : ''}`}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={`A sound signal: ${signal.notation}`}
    >
      <rect width={WIDTH} height={HEIGHT} fill="#061520" />

      {/* Second marks, so the lengths can be read off rather than guessed. */}
      {Array.from({ length: Math.ceil(total / 1000) + 1 }, (_, i) => {
        const x = MARGIN + i * 1000 * scale;
        return (
          <g key={i}>
            <line
              x1={x}
              y1={TRACK_Y - 8}
              x2={x}
              y2={TRACK_Y + TRACK_H + 8}
              stroke="#173444"
              strokeWidth={1}
            />
            {i % 5 === 0 && (
              <text
                x={x}
                y={TRACK_Y + TRACK_H + 24}
                textAnchor="middle"
                fill="#4d7d9a"
                fontSize="10"
              >
                {i}s
              </text>
            )}
          </g>
        );
      })}

      <line
        x1={MARGIN}
        y1={TRACK_Y + TRACK_H / 2}
        x2={WIDTH - MARGIN}
        y2={TRACK_Y + TRACK_H / 2}
        stroke="#173444"
        strokeWidth={1}
      />

      {bars.map(({ blast, x, w }, i) => (
        <rect
          key={i}
          x={x}
          y={TRACK_Y}
          width={Math.max(w, 2)}
          height={TRACK_H}
          rx={3}
          fill={BLAST_FILL[blast.kind]}
          opacity={headX >= x && headX <= x + w ? 1 : 0.42}
        />
      ))}

      <line
        x1={headX}
        y1={TRACK_Y - 14}
        x2={headX}
        y2={TRACK_Y + TRACK_H + 14}
        stroke={sounding ? '#ffffff' : '#5f89a1'}
        strokeWidth={2}
      />
    </svg>
  );
}
