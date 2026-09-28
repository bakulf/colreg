import { describe, expect, it } from 'vitest';
import {
  TWELFTHS,
  clearanceNow,
  depthOver,
  depthOverDrying,
  heightDifferenceAt,
  timeDifferenceAt,
  twelfthsHeight,
} from './model.ts';
import {
  anchorAtLowWaterDrill,
  clearanceDrill,
  crossBankDrill,
  depthDrill,
  dryingDrill,
  secondaryHeightDrill,
  secondaryTimeDrill,
  tidesSources,
  twelfthsHeightDrill,
  twelfthsTimeDrill,
} from './generator.ts';
import { createRng } from '../rng.ts';
import type { Question } from '../types.ts';

describe('tides model', () => {
  it('adds soundings, subtracts drying heights, and measures clearance from HAT', () => {
    expect(depthOver(2.4, 3.1)).toBeCloseTo(5.5);
    expect(depthOverDrying(1.2, 3.0)).toBeCloseTo(1.8);
    expect(clearanceNow(18, 5.6, 3.1)).toBeCloseTo(20.5);
  });

  it('runs the twelfths 1, 2, 3, 3, 2, 1', () => {
    const steps = TWELFTHS.slice(1).map((t, i) => t - (TWELFTHS[i] as number));
    expect(steps).toEqual([1, 2, 3, 3, 2, 1]);
    expect(twelfthsHeight(0.6, 5.4, 3, true)).toBeCloseTo(3.0);
    expect(twelfthsHeight(0.6, 5.4, 1, false)).toBeCloseTo(5.0);
  });

  it('interpolates secondary port differences linearly', () => {
    const d = { times: [60, 420] as [number, number], timeDiff: [20, 40] as [number, number], levels: [5, 4] as [number, number], heightDiff: [-0.6, -0.2] as [number, number] };
    expect(timeDifferenceAt(d, 240)).toBeCloseTo(30);
    expect(heightDifferenceAt(d, 4.5)).toBeCloseTo(-0.4);
    expect(heightDifferenceAt(d, 5)).toBeCloseTo(-0.6);
  });
});

function num(re: RegExp, text: string): number {
  const m = re.exec(text);
  if (!m) throw new Error(`no match for ${re} in: ${text}`);
  return Number(m[1]);
}

const answerOf = (q: Question) => q.choices.find((c) => c.id === q.correct)?.text ?? '';
const metres = (q: Question) => num(/(-?\d+\.\d) m/, answerOf(q));

function sample(make: (rng: ReturnType<typeof createRng>) => Question, n = 250): Question[] {
  const rng = createRng(1234);
  return Array.from({ length: n }, () => make(rng));
}

/** Exact in tenths: a sum done in the head, not a rounded calculation. */
function tenth(x: number): boolean {
  return Math.abs(x * 10 - Math.round(x * 10)) < 1e-6;
}

describe('tide drills give the right answer, and it is mental arithmetic', () => {
  it('depth over a sounding', () => {
    for (const q of sample(depthDrill)) {
      const expected = num(/sounding of ([\d.]+) m/, q.prompt) + num(/height of tide is ([\d.]+) m/, q.prompt);
      expect(metres(q), q.prompt).toBeCloseTo(expected, 6);
    }
  });

  it('depth over a drying bank', () => {
    for (const q of sample(dryingDrill)) {
      const expected = num(/height of tide is ([\d.]+) m/, q.prompt) - num(/underlined figure: (\d+\.\d)/, q.prompt);
      expect(metres(q), q.prompt).toBeCloseTo(expected, 6);
    }
  });

  it('clearance under a bridge', () => {
    for (const q of sample(clearanceDrill)) {
      const c = num(/charted as ([\d.]+) m/, q.prompt);
      const hat = num(/which here is ([\d.]+) m/, q.prompt);
      const hot = num(/height of tide is ([\d.]+) m/, q.prompt);
      expect(metres(q), q.prompt).toBeCloseTo(c + hat - hot, 6);
    }
  });

  it('height of tide needed to cross a bar', () => {
    for (const q of sample(crossBankDrill)) {
      const expected =
        num(/dries ([\d.]+) m/, q.prompt) + num(/drawing ([\d.]+) m/, q.prompt) + num(/wanting ([\d.]+) m/, q.prompt);
      expect(metres(q), q.prompt).toBeCloseTo(expected, 6);
    }
  });

  it('depth at low water when anchored at high water', () => {
    for (const q of sample(anchorAtLowWaterDrill)) {
      const now = num(/height of tide ([\d.]+) m/, q.prompt);
      const sounder = num(/reads ([\d.]+) m/, q.prompt);
      const lw = num(/will be ([\d.]+) m/, q.prompt);
      expect(metres(q), q.prompt).toBeCloseTo(sounder - (now - lw), 6);
    }
  });

  it('height by the rule of twelfths, with a twelfth that is a round figure', () => {
    for (const q of sample(twelfthsHeightDrill)) {
      const lw = num(/LW ([\d.]+) m/, q.prompt);
      const hw = num(/HW ([\d.]+) m/, q.prompt);
      expect(tenth((hw - lw) / 12), q.prompt).toBe(true);
      const from = /is at (\d\d)(\d\d): LW/.exec(q.prompt)!;
      const at = /height of tide at (\d\d)(\d\d)/.exec(q.prompt)!;
      let hours = (Number(at[1]) * 60 + Number(at[2]) - (Number(from[1]) * 60 + Number(from[2]))) / 60;
      if (hours < 0) hours += 24;
      const rising = /, LW is at/.test(q.prompt);
      expect(metres(q), q.prompt).toBeCloseTo(twelfthsHeight(lw, hw, hours, rising), 6);
    }
  });

  it('time for a height by the rule of twelfths', () => {
    for (const q of sample(twelfthsTimeDrill)) {
      const lw = num(/LW is at \d{4}, ([\d.]+) m/, q.prompt);
      const hw = num(/later, ([\d.]+) m/, q.prompt);
      const need = num(/need ([\d.]+) m/, q.prompt);
      const start = /LW is at (\d\d)(\d\d)/.exec(q.prompt)!;
      const hours = TWELFTHS.findIndex((t) => Math.abs(lw + ((hw - lw) * t) / 12 - need) < 1e-6);
      expect(hours, q.prompt).toBeGreaterThan(0);
      const t = Number(start[1]) * 60 + Number(start[2]) + hours * 60;
      expect(answerOf(q), q.prompt).toBe(
        `${String(Math.floor(t / 60) % 24).padStart(2, '0')}${String(t % 60).padStart(2, '0')}`,
      );
    }
  });

  it('secondary port time and height, on or half way between tabulated values', () => {
    for (const q of sample(secondaryTimeDrill)) {
      expect(/^\d{4}$/.test(answerOf(q)), q.prompt).toBe(true);
    }
    for (const q of sample(secondaryHeightDrill)) {
      expect(tenth(metres(q)), q.prompt).toBe(true);
      const standard = num(/HW at Portmoor is ([\d.]+) m/, q.prompt);
      const sp = num(/at MHWS \(([\d.]+) m\)/, q.prompt);
      const np = num(/at MHWN \(([\d.]+) m\)/, q.prompt);
      const f = (standard - np) / (sp - np);
      expect([0, 0.5, 1].some((x) => Math.abs(x - f) < 1e-6), q.prompt).toBe(true);
    }
  });
});

describe('tide drill options', () => {
  const all = [
    depthDrill,
    dryingDrill,
    clearanceDrill,
    crossBankDrill,
    anchorAtLowWaterDrill,
    twelfthsHeightDrill,
    twelfthsTimeDrill,
    secondaryTimeDrill,
    secondaryHeightDrill,
  ].flatMap((d) => sample(d, 120));

  it('always offers four distinct options with one correct', () => {
    for (const q of all) {
      expect(q.choices, q.id).toHaveLength(4);
      expect(new Set(q.choices.map((c) => c.text)).size, `${q.id}: ${q.choices.map((c) => c.text)}`).toBe(4);
      expect(q.choices.filter((c) => c.id === q.correct), q.id).toHaveLength(1);
    }
  });

  it('exposes one source per drill, each generating its own concept', () => {
    const sources = tidesSources();
    expect(new Set(sources.map((s) => s.concept)).size).toBe(sources.length);
    const rng = createRng(3);
    for (const s of sources) expect(s.generate(rng).concept).toBe(s.concept);
  });
});
