import { describe, expect, it } from 'vitest';
import {
  PORT_SIGNALS,
  clearingLabel,
  cut,
  isSafe,
  norm360,
  offBow,
  steerForLeadingMarks,
  worstCut,
} from './model.ts';
import {
  bestThreeDrill,
  clearingLabelDrill,
  clearingSafeDrill,
  cockedHatDrill,
  lastBearingDrill,
  leadingDrill,
  pilotageSources,
  portSignalDrill,
  positionSources,
  soundingDrill,
  waypointDrill,
} from './generator.ts';
import { createRng } from '../rng.ts';
import type { Question } from '../types.ts';

/** Bearing from a to b on a flat chart, x east, y north. */
function bearingTo(a: [number, number], b: [number, number]): number {
  return norm360((Math.atan2(b[0] - a[0], b[1] - a[1]) * 180) / Math.PI);
}

describe('pilotage geometry', () => {
  it('measures the cut between position lines, 0 to 90', () => {
    expect(cut(10, 70)).toBe(60);
    expect(cut(10, 190)).toBe(0);
    expect(cut(0, 100)).toBe(80);
    expect(worstCut([0, 60, 120])).toBe(60);
  });

  it('labels a clearing line so that its safe side really is safe', () => {
    // Mark at the origin, clearing line due north towards it (000°). Test
    // observers on both sides, south of the mark.
    for (const dangerSide of ['left', 'right'] as const) {
      const label = clearingLabel(dangerSide);
      for (const x of [-3, -1, 1, 3]) {
        const observer: [number, number] = [x, -10];
        const observed = bearingTo(observer, [0, 0]);
        const onDangerSide = dangerSide === 'right' ? x > 0 : x < 0;
        expect(isSafe(label, 0, observed), `${dangerSide} x=${x}`).toBe(!onDangerSide);
      }
    }
  });

  it('reads leading marks the way the geometry says', () => {
    // Front mark 10 units north, rear 20: observer off to one side.
    for (const x of [-2, 2]) {
      const o: [number, number] = [x, 0];
      const front = bearingTo(o, [0, 10]);
      const rear = bearingTo(o, [0, 20]);
      const rearAppears = ((rear - front + 540) % 360) - 180 > 0 ? 'right' : 'left';
      const steer = steerForLeadingMarks(rearAppears);
      // Right of the line (x > 0) must steer to port, left to starboard.
      expect(steer, `x=${x}`).toBe(x > 0 ? 'port' : 'starboard');
    }
  });

  it('follows IALA R0111: three lights, red stop, green proceed, yellow only with messages 2 and 5', () => {
    for (const s of PORT_SIGNALS) {
      expect(s.lights).toHaveLength(3);
      if (s.lights.every((l) => l === 'R')) expect(s.message).toMatch(/stop|shall not proceed/i);
      if (s.yellow) expect(['stop-except', 'on-order-except']).toContain(s.id);
    }
    expect(PORT_SIGNALS.find((s) => s.flashing)?.id).toBe('emergency');
  });
});

const answerOf = (q: Question) => q.choices.find((c) => c.id === q.correct)?.text ?? '';

function sample(make: (rng: ReturnType<typeof createRng>) => Question, n = 150): Question[] {
  const rng = createRng(31337);
  return Array.from({ length: n }, () => make(rng));
}

describe('position and pilotage drills give the right answer', () => {
  it('plots from a waypoint on the reciprocal', () => {
    for (const q of sample(waypointDrill)) {
      const b = Number(/bearing (\d{3})°T/.exec(q.prompt)![1]);
      expect(answerOf(q)).toContain(`${String(norm360(b + 180)).padStart(3, '0')}°T`);
    }
  });

  it('picks the three bearings with the widest cuts', () => {
    for (const q of sample(bestThreeDrill, 60)) {
      const pairs = [...q.prompt.matchAll(/(the [a-z ]+?) (\d{3})°/g)].map((m) => [m[1]!, Number(m[2])] as const);
      const byName = new Map(pairs);
      const cutOf = (text: string) => {
        const names = text.toLowerCase().split(', ');
        const bs = names.map((n) => byName.get(n)!) as [number, number, number];
        return worstCut(bs);
      };
      const right = cutOf(answerOf(q));
      for (const c of q.choices) if (c.id !== q.correct) expect(cutOf(c.text), q.prompt).toBeLessThan(right);
    }
  });

  it('takes the mark nearest the beam last', () => {
    for (const q of sample(lastBearingDrill)) {
      const heading = Number(/steering (\d{3})°T/.exec(q.prompt)![1]);
      const pairs = [...q.prompt.matchAll(/(the [a-z ]+?) (\d{3})°/g)].map((m) => [m[1]!, Number(m[2])] as const);
      const beam = pairs.reduce((b, p) => (Math.abs(offBow(heading, p[1]) - 90) < Math.abs(offBow(heading, b[1]) - 90) ? p : b));
      expect(answerOf(q).toLowerCase()).toBe(beam[0]);
    }
  });

  it('judges a clearing bearing, and labels a clearing line, consistently', () => {
    for (const q of sample(clearingSafeDrill)) {
      const m = /(NLT|NMT) (\d{3})°T/.exec(q.prompt)!;
      const obs = Number(/bearing of it: (\d{3})°T/.exec(q.prompt)![1]);
      const safe = isSafe(m[1] as 'NLT' | 'NMT', Number(m[2]), obs);
      expect(answerOf(q)).toBe(safe ? 'Safe side of the line' : 'Standing into danger');
    }
    for (const q of sample(clearingLabelDrill)) {
      const side = /rocks are on the (left|right)/.exec(q.prompt)![1] as 'left' | 'right';
      expect(answerOf(q).startsWith(clearingLabel(side)), q.prompt).toBe(true);
    }
  });

  it('reduces a sounding to chart datum', () => {
    for (const q of sample(soundingDrill)) {
      const r = Number(/shows ([\d.]+) m/.exec(q.prompt)![1]);
      const k = Number(/keel is ([\d.]+) m/.exec(q.prompt)![1]);
      const t = Number(/tide is ([\d.]+) m/.exec(q.prompt)![1]);
      expect(Number(/([\d.]+) m/.exec(answerOf(q))![1])).toBeCloseTo(r + k - t, 6);
    }
  });
});

describe('position and pilotage drill options', () => {
  const all = [
    waypointDrill,
    bestThreeDrill,
    lastBearingDrill,
    cockedHatDrill,
    ...PORT_SIGNALS.map((s) => portSignalDrill(s.id)),
    clearingSafeDrill,
    clearingLabelDrill,
    leadingDrill,
    soundingDrill,
  ].flatMap((d) => sample(d, 40));

  it('always offers four distinct options with one correct', () => {
    for (const q of all) {
      expect(q.choices, q.id).toHaveLength(4);
      expect(new Set(q.choices.map((c) => c.text)).size, `${q.id}: ${q.choices.map((c) => c.text).join(' | ')}`).toBe(4);
      expect(q.choices.filter((c) => c.id === q.correct), q.id).toHaveLength(1);
    }
  });

  it('exposes one source per concept', () => {
    const sources = [...positionSources(), ...pilotageSources()];
    expect(new Set(sources.map((s) => s.concept)).size).toBe(sources.length);
    const rng = createRng(1);
    for (const s of sources) expect(s.generate(rng).concept).toBe(s.concept);
  });
});
