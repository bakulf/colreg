import { useEffect, useRef, useState } from 'react';

export interface Flashing<C> {
  periodMs: number;
  /** In order from the start of the period; a null colour is darkness. */
  segments: readonly { colour: C | null; ms: number }[];
}

/**
 * Follows a light's character in real time and returns what is showing now.
 *
 * Deliberately not CSS keyframes: the characters are irregular (six quick
 * flashes then a long one then eight seconds of nothing) and generating a
 * keyframe rule per character would be harder to read than a clock.
 */
export function useFlash<C>(character: Flashing<C>): C | null {
  const [colour, setColour] = useState<C | null>(null);
  const current = useRef<C | null>(null);

  useEffect(() => {
    let frame = 0;
    const started = performance.now();

    const tick = () => {
      const t = (performance.now() - started) % character.periodMs;
      let acc = 0;
      let next: C | null = null;
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
