import { describe, expect, it } from 'vitest';
import {
  BEAUFORT,
  CLOUDS,
  DEPRESSION,
  change,
  degOf,
  forceFor,
  lowFromWind,
  tendencyFor,
  windAround,
  windName,
} from './model.ts';
import {
  barometerDrill,
  beaufortForceDrill,
  beaufortSeaDrill,
  buysBallotDrill,
  cloudFor,
  cloudMeaningDrill,
  forecastLineDrill,
  frontChangeDrill,
  galeDrill,
  isobarSpacingDrill,
  nextCloudDrill,
  orderDrill,
  seaBreezeDrill,
  termDrill,
  veerBackDrill,
  weatherSources,
  whereAmIDrill,
  windRoundDrill,
} from './generator.ts';
import { MOVEMENT, SEA_STATE, TIMING, VISIBILITY } from './model.ts';
import { createRng } from '../rng.ts';
import type { Question } from '../types.ts';

describe('weather model', () => {
  it('covers every knot from 0 to 64 exactly once on the Beaufort scale', () => {
    for (let k = 0; k <= 70; k++) {
      expect(BEAUFORT.filter((f) => k >= f.from && k <= f.to), `${k} kn`).toHaveLength(1);
    }
    expect(forceFor(34).force).toBe(8);
    expect(forceFor(33).force).toBe(7);
  });

  it('uses the Met Office tendency bands', () => {
    expect(tendencyFor(-1.5)).toBe('Falling slowly');
    expect(tendencyFor(-1.6)).toBe('Falling');
    expect(tendencyFor(-3.5)).toBe('Falling');
    expect(tendencyFor(-3.6)).toBe('Falling quickly');
    expect(tendencyFor(-6)).toBe('Falling quickly');
    expect(tendencyFor(-7)).toBe('Falling very rapidly');
    expect(tendencyFor(2)).toBe('Rising');
  });

  it('veers clockwise and backs anticlockwise', () => {
    expect(change('SW', 'W')).toBe('veering');
    expect(change('SE', 'NE')).toBe('backing');
    expect(change('NW', 'N')).toBe('veering');
  });

  it('blows anticlockwise round a low and clockwise round a high', () => {
    // South of a low: westerly. North of a low: easterly.
    expect(windAround('low', 180)).toBe('W');
    expect(windAround('low', 0)).toBe('E');
    // South of a high: easterly.
    expect(windAround('high', 180)).toBe('E');
    // Buys Ballot agrees: in a westerly, the low is to the north.
    expect(lowFromWind('W')).toBe('N');
    expect(windName('SW')).toBe('south-westerly');
  });

  it('agrees with itself: the wind round a low points to that low by Buys Ballot', () => {
    for (const b of [0, 45, 90, 135, 180, 225, 270, 315]) {
      const wind = windAround('low', b);
      expect(degOf(lowFromWind(wind)), `from ${b}`).toBe((b + 180) % 360);
    }
  });

  it('runs a depression through its classic cloud sequence', () => {
    expect(DEPRESSION.map((s) => s.cloud)).toEqual([
      'cirrus',
      'cirrostratus',
      'altostratus',
      'nimbostratus',
      'stratus',
      'cumulonimbus',
      'cumulus',
    ]);
  });
});

const answerOf = (q: Question) => q.choices.find((c) => c.id === q.correct)?.text ?? '';

function sample(make: (rng: ReturnType<typeof createRng>) => Question, n = 150): Question[] {
  const rng = createRng(777);
  return Array.from({ length: n }, () => make(rng));
}

describe('weather drills give the right answer', () => {
  it('Beaufort from knots', () => {
    for (const q of sample(beaufortForceDrill)) {
      const k = Number(/steady (\d+) knots/.exec(q.prompt)![1]);
      expect(answerOf(q).startsWith(`Force ${forceFor(k).force} `), q.prompt).toBe(true);
    }
  });

  it('pressure tendency from two readings', () => {
    for (const q of sample(barometerDrill)) {
      const m = /read (\d+) hPa at 0900 and (\d+) hPa/.exec(q.prompt)!;
      expect(answerOf(q), q.prompt).toBe(tendencyFor(Number(m[2]) - Number(m[1])));
    }
  });

  it('veering and backing', () => {
    for (const q of sample(veerBackDrill)) {
      const m = /from ([a-z-]+)erly to ([a-z-]+)erly/.exec(q.prompt)!;
      const code = (n: string) =>
        ({ north: 'N', 'north-east': 'NE', east: 'E', 'south-east': 'SE', south: 'S', 'south-west': 'SW', west: 'W', 'north-west': 'NW' })[n] as Parameters<typeof change>[0];
      const expected = change(code(m[1]!), code(m[2]!));
      expect(answerOf(q).toLowerCase().startsWith(expected), q.prompt).toBe(true);
    }
  });

  it('wind round a low or high on the sketch chart', () => {
    for (const q of sample(windRoundDrill)) {
      if (q.scene?.type !== 'synoptic' || q.scene.boatAt === undefined) throw new Error('no chart');
      expect(answerOf(q), q.prompt).toBe(`A ${windName(windAround(q.scene.system, q.scene.boatAt))}`);
    }
  });

  it('next cloud as a depression approaches', () => {
    for (const q of sample(nextCloudDrill)) {
      if (q.scene?.type !== 'cloud') throw new Error('no cloud');
      const genus = q.scene.genus;
      const i = DEPRESSION.findIndex((s) => s.cloud === genus);
      expect(answerOf(q), q.prompt).toBe(CLOUDS[DEPRESSION[i + 1]!.cloud].name);
    }
  });

  it('a sea breeze blows off the sea by day and a land breeze off the land by night', () => {
    for (const q of sample(seaBreezeDrill)) {
      const sea = /open sea lies to the ([a-z-]+)/.exec(q.prompt)![1];
      const night = /night/.test(q.prompt);
      const from = /^From the ([a-z-]+)/.exec(answerOf(q))![1];
      if (night) expect(from, q.prompt).not.toBe(sea);
      else expect(from, q.prompt).toBe(sea);
    }
  });
});

describe('weather drill options', () => {
  const all = [
    beaufortForceDrill,
    beaufortSeaDrill,
    veerBackDrill,
    (rng: ReturnType<typeof createRng>) => cloudFor('cumulus', rng),
    cloudMeaningDrill,
    nextCloudDrill,
    whereAmIDrill,
    frontChangeDrill,
    orderDrill,
    windRoundDrill,
    buysBallotDrill,
    isobarSpacingDrill,
    (rng: ReturnType<typeof createRng>) => termDrill(rng, TIMING, 'timing', 'timing', 'weather-forecasts'),
    (rng: ReturnType<typeof createRng>) => termDrill(rng, VISIBILITY, 'visibility', 'visibility', 'weather-forecasts'),
    (rng: ReturnType<typeof createRng>) => termDrill(rng, SEA_STATE, 'sea state', 'sea-state', 'weather-forecasts'),
    (rng: ReturnType<typeof createRng>) => termDrill(rng, MOVEMENT, 'movement', 'movement', 'weather-forecasts'),
    galeDrill,
    forecastLineDrill,
    seaBreezeDrill,
    barometerDrill,
  ].flatMap((d) => sample(d, 60));

  it('always offers four distinct options with one correct', () => {
    for (const q of all) {
      expect(q.choices, q.id).toHaveLength(4);
      expect(new Set(q.choices.map((c) => c.text)).size, `${q.id}: ${q.choices.map((c) => c.text).join(' | ')}`).toBe(4);
      expect(q.choices.filter((c) => c.id === q.correct), q.id).toHaveLength(1);
    }
  });

  it('exposes one source per concept, each generating its own concept', () => {
    const sources = weatherSources();
    expect(new Set(sources.map((s) => s.concept)).size).toBe(sources.length);
    const rng = createRng(5);
    for (const s of sources) expect(s.generate(rng).concept, s.id).toBe(s.concept);
  });
});
