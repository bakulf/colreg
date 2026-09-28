import { describe, expect, it } from 'vitest';
import {
  bearing,
  compassForMagnetic,
  deviationFor,
  error,
  makeCard,
  norm360,
  roseText,
  variationMinutesIn,
  variationText,
} from './model.ts';
import type { DeviationCard } from './model.ts';
import {
  annualChangeDrill,
  compareCheckDrill,
  compassSources,
  compassToTrueDrill,
  handBearingDrill,
  magneticToTrueDrill,
  steeringBearingDrill,
  transitCheckDrill,
  trueToCompassDrill,
  trueToMagneticDrill,
} from './generator.ts';
import { createRng } from '../rng.ts';
import type { Question } from '../types.ts';

describe('compass model', () => {
  it('writes the rose as the chart does, and brings it up to date', () => {
    // The worked example in the usual references: 4°15'W 2009 (8'E).
    const rose = { minutes: -255, year: 2009, annualMinutes: 8 };
    expect(roseText(rose)).toBe("4°15'W 2009 (8'E)");
    expect(variationText(variationMinutesIn(rose, 2011))).toBe("3°59'W");
    expect(variationText(variationMinutesIn(rose, 2020))).toBe("2°47'W");
  });

  it('names errors east and west', () => {
    expect(error(3)).toBe('3°E');
    expect(error(-2)).toBe('2°W');
    expect(bearing(-3)).toBe('357°');
    expect(bearing(360)).toBe('000°');
  });

  it('makes plausible cards and inverts them', () => {
    for (let seed = 0; seed < 200; seed++) {
      const rng = createRng(seed);
      const card = makeCard(4 + Math.floor(rng.next() * 3), rng.next() * 360, 0);
      expect(card.deviation).toHaveLength(12);
      for (const d of card.deviation) expect(Math.abs(d)).toBeLessThanOrEqual(7);
      for (let c = 0; c < 360; c += 30) {
        const m = norm360(c + deviationFor(card, c));
        const back = compassForMagnetic(card, m);
        expect(Math.abs(((back - c + 540) % 360) - 180)).toBeLessThan(1e-4);
      }
    }
  });
});

// --- independent checking of every drill -------------------------------------

function num(re: RegExp, text: string): number {
  const m = re.exec(text);
  if (!m) throw new Error(`no match for ${re} in: ${text}`);
  return Number(m[1]);
}

/** '3°W' → −3, '2°E' → 2, read out of a prompt. */
function signed(re: RegExp, text: string): number {
  const m = re.exec(text);
  if (!m) throw new Error(`no match for ${re} in: ${text}`);
  return Number(m[1]) * (m[2] === 'W' ? -1 : 1);
}

function cardOf(q: Question): DeviationCard {
  if (q.scene?.type !== 'deviation-card') throw new Error(`${q.id} has no card`);
  return q.scene.card;
}

const answerOf = (q: Question) => q.choices.find((c) => c.id === q.correct)?.text ?? '';
const degreesIn = (text: string) => num(/(\d{3})°/, text);

function sample(make: (rng: ReturnType<typeof createRng>) => Question, n = 300): Question[] {
  const rng = createRng(77);
  return Array.from({ length: n }, () => make(rng));
}

const VAR = /[Vv]ariation (?:is )?(\d+)°([EW])/;

describe('compass drills give the answer the rules give', () => {
  it('true to magnetic', () => {
    for (const q of sample(trueToMagneticDrill)) {
      const t = num(/course of (\d{3})°T/, q.prompt);
      const v = signed(/variation (\d+)°([EW])/, q.prompt);
      expect(degreesIn(answerOf(q)), q.prompt).toBe(norm360(t - v));
    }
  });

  it('magnetic to true', () => {
    for (const q of sample(magneticToTrueDrill)) {
      const m = num(/at (\d{3})°M/, q.prompt);
      const v = signed(VAR, q.prompt);
      expect(degreesIn(answerOf(q)), q.prompt).toBe(norm360(m + v));
    }
  });

  it('bringing the rose up to date', () => {
    for (const q of sample(annualChangeDrill)) {
      if (q.scene?.type !== 'compass-rose') throw new Error('no rose');
      const target = num(/apply in (\d{4})/, q.prompt);
      const minutes = variationMinutesIn(q.scene.rose, target);
      expect(answerOf(q), q.prompt).toBe(error(Math.round(minutes / 60)));
      expect(q.prompt).toContain(roseText(q.scene.rose));
    }
  });

  it('compass to true, from the card', () => {
    for (const q of sample(compassToTrueDrill)) {
      const c = num(/steering (\d{3})°C/, q.prompt);
      const v = signed(VAR, q.prompt);
      const d = deviationFor(cardOf(q), c);
      expect(degreesIn(answerOf(q)), q.prompt).toBe(norm360(c + d + v));
    }
  });

  it('true to compass, from the card', () => {
    for (const q of sample(trueToCompassDrill)) {
      const t = num(/good is (\d{3})°T/, q.prompt);
      const v = signed(VAR, q.prompt);
      const c = degreesIn(answerOf(q));
      // Steering the answer must give the true course asked for.
      expect(norm360(c + deviationFor(cardOf(q), c) + v), q.prompt).toBe(t);
    }
  });

  it('a bearing over the steering compass uses the deviation for the ship’s head', () => {
    for (const q of sample(steeringBearingDrill)) {
      const head = num(/Steering (\d{3})°C/, q.prompt);
      const b = num(/compass: (\d{3})°C/, q.prompt);
      const v = signed(VAR, q.prompt);
      const d = deviationFor(cardOf(q), head);
      expect(degreesIn(answerOf(q)), q.prompt).toBe(norm360(b + d + v));
      // And the wrong method is on offer.
      const wrong = norm360(b + deviationFor(cardOf(q), b) + v);
      expect(q.choices.map((c) => degreesIn(c.text))).toContain(wrong);
    }
  });

  it('a hand-bearing compass has no deviation', () => {
    for (const q of sample(handBearingDrill)) {
      const b = num(/hand-bearing compass: (\d{3})°/, q.prompt);
      const v = signed(VAR, q.prompt);
      expect(degreesIn(answerOf(q)), q.prompt).toBe(norm360(b + v));
    }
  });

  it('deviation from a transit', () => {
    for (const q of sample(transitCheckDrill)) {
      const t = num(/line is (\d{3})°T/, q.prompt);
      const c = num(/compass gives (\d{3})°C/, q.prompt);
      const v = signed(VAR, q.prompt);
      const d = ((norm360(t - v - c) + 180) % 360) - 180;
      expect(answerOf(q), q.prompt).toBe(error(d));
    }
  });

  it('deviation by comparison with a hand-bearing compass', () => {
    for (const q of sample(compareCheckDrill)) {
      const m = num(/centreline: (\d{3})°M/, q.prompt);
      const c = num(/shows (\d{3})°C/, q.prompt);
      const d = ((norm360(m - c) + 180) % 360) - 180;
      expect(answerOf(q), q.prompt).toBe(error(d));
    }
  });
});

describe('compass drill options', () => {
  const all = [
    trueToMagneticDrill,
    magneticToTrueDrill,
    annualChangeDrill,
    compassToTrueDrill,
    trueToCompassDrill,
    steeringBearingDrill,
    handBearingDrill,
    transitCheckDrill,
    compareCheckDrill,
  ].flatMap((d) => sample(d, 150));

  it('always offers four distinct options with one correct', () => {
    for (const q of all) {
      expect(q.choices, q.id).toHaveLength(4);
      expect(new Set(q.choices.map((c) => c.text)).size, q.id).toBe(4);
      expect(q.choices.filter((c) => c.id === q.correct), q.id).toHaveLength(1);
    }
  });

  it('keeps bearing options at least two degrees apart', () => {
    for (const q of all) {
      const degs = q.choices.map((c) => /(\d{3})°[TMC]/.exec(c.text)?.[1]).filter(Boolean).map(Number);
      if (degs.length < 4) continue;
      for (let i = 0; i < degs.length; i++) {
        for (let j = i + 1; j < degs.length; j++) {
          const gap = Math.abs(((degs[i]! - degs[j]! + 540) % 360) - 180);
          expect(gap, `${q.prompt}\n${degs.join(' ')}`).toBeGreaterThanOrEqual(2);
        }
      }
    }
  });

  it('exposes one source per drill, each generating its own concept', () => {
    const sources = compassSources();
    expect(new Set(sources.map((s) => s.concept)).size).toBe(sources.length);
    const rng = createRng(3);
    for (const s of sources) expect(s.generate(rng).concept).toBe(s.concept);
  });
});
