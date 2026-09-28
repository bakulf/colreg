import { describe, expect, it } from 'vitest';
import { CATALOGUE, looksSame, maxPeriodS, notation, timeline, violations } from './model.ts';
import type { Character } from './model.ts';
import {
  GEO_K_ALT,
  NOMINAL_VISIBILITY_NM,
  geographicRangeNm,
  luminousRangeNm,
} from './range.ts';
import {
  coastalSources,
  decodeDrill,
  firstSightDrill,
  luminousDrill,
  noRiseDrill,
  recogniseDrill,
  risingDrill,
  sectorDrill,
  recolour,
} from './generator.ts';
import { createRng } from '../rng.ts';
import type { Question } from '../types.ts';

describe('R0110 characters', () => {
  it('flashes nothing R0110 would reject', () => {
    for (const c of CATALOGUE) {
      expect(violations(c), notation(c)).toEqual([]);
    }
  });

  it('catches characters that break R0110', () => {
    const bad: Character[] = [
      { cls: 'Iso', groups: [], periodS: 14, colours: ['W'] }, // over 12 s
      { cls: 'Fl', groups: [7], periodS: 30, colours: ['W'] }, // seven flashes
      { cls: 'Fl', groups: [2, 2], periodS: 20, colours: ['W'] }, // not (2+1)
      { cls: 'Q', groups: [5], periodS: 10, colours: ['W'] }, // Q groups are 3 or 9
      { cls: 'Oc', groups: [], periodS: 20, colours: ['W'] }, // over 15 s
    ];
    for (const c of bad) expect(violations(c), notation(c)).not.toEqual([]);
  });

  it('knows the Table 1 maxima', () => {
    const c = (cls: Character['cls'], groups: number[]): Character => ({ cls, groups, colours: ['W'] });
    expect(maxPeriodS(c('Iso', []))).toBe(12);
    expect(maxPeriodS(c('Fl', []))).toBe(15);
    expect(maxPeriodS(c('Fl', [2]))).toBe(20);
    expect(maxPeriodS(c('Fl', [3]))).toBe(30);
    expect(maxPeriodS(c('Fl', [2, 1]))).toBe(30);
    expect(maxPeriodS(c('LFl', []))).toBe(20);
    expect(maxPeriodS(c('VQ', [3]))).toBe(15);
    expect(maxPeriodS(c('Q', [3]))).toBe(20);
  });

  it('writes notation as the chart does', () => {
    const byNotation = new Set(CATALOGUE.map((c) => notation(c)));
    for (const n of ['Fl.5s', 'Fl(3)15s', 'Fl(2+1)15s', 'Oc.R.6s', 'Fl(3)G.10s', 'Q(6)+LFl.15s', 'VQ(3)5s', 'Mo(A)8s', 'Al.WR.4s', 'Iso.4s', 'LFl.10s', 'Q', 'F']) {
      expect(byNotation.has(n), n).toBe(true);
    }
  });

  it('gives every character in the catalogue its own look', () => {
    for (let i = 0; i < CATALOGUE.length; i++) {
      for (let j = i + 1; j < CATALOGUE.length; j++) {
        const a = CATALOGUE[i] as Character;
        const b = CATALOGUE[j] as Character;
        expect(looksSame(a, b), `${notation(a)} vs ${notation(b)}`).toBe(false);
      }
    }
  });

  it('runs quick lights at the IALA specification rates', () => {
    const rate = (cls: 'Q' | 'VQ' | 'UQ') => {
      const t = timeline({ cls, groups: [], colours: ['W'] });
      return 60000 / t.periodMs;
    };
    expect(rate('Q')).toBe(60);
    expect(rate('VQ')).toBe(120);
    expect(rate('UQ')).toBe(240);
  });
});

describe('R0202 and the horizon', () => {
  it('makes luminous range equal nominal range in 10 miles visibility', () => {
    for (const n of [5, 10, 18, 25]) {
      expect(luminousRangeNm(n, NOMINAL_VISIBILITY_NM)).toBeCloseTo(n, 3);
    }
  });

  it('shortens range in thicker weather and lengthens it in clearer', () => {
    expect(luminousRangeNm(20, 5)).toBeLessThan(20);
    expect(luminousRangeNm(20, 20)).toBeGreaterThan(20);
    expect(luminousRangeNm(20, 2)).toBeLessThan(luminousRangeNm(20, 5));
  });

  it('adds both horizons', () => {
    expect(geographicRangeNm(36, 4)).toBeCloseTo(2.08 * (6 + 2), 6);
  });
});

function sample(make: (rng: ReturnType<typeof createRng>) => Question, n = 200): Question[] {
  const rng = createRng(2024);
  return Array.from({ length: n }, () => make(rng));
}

function numberIn(text: string): number {
  return Number(/([\d.]+) M/.exec(text)?.[1]);
}

describe('coastal drills', () => {
  const all = [
    ...CATALOGUE.flatMap((c) => sample((rng) => recogniseDrill(c, rng), 10)),
    ...sample(decodeDrill),
    ...sample(sectorDrill),
    ...sample(risingDrill),
    ...sample(noRiseDrill),
    ...sample(luminousDrill),
    ...sample(firstSightDrill),
  ];

  it('always offers four distinct options with one correct', () => {
    for (const q of all) {
      expect(q.choices, q.id).toHaveLength(4);
      expect(new Set(q.choices.map((c) => c.text)).size, q.id).toBe(4);
      expect(q.choices.filter((c) => c.id === q.correct), q.id).toHaveLength(1);
    }
  });

  it('never lets colour give the answer away', () => {
    for (const c of CATALOGUE.filter((x) => x.cls !== 'Al')) {
      for (const q of sample((rng) => recogniseDrill(c, rng), 10)) {
        for (const choice of q.choices) {
          const other = CATALOGUE.map((x) => recolour(x, c)).find((x) => notation(x) === choice.text);
          if (other && other.cls !== 'Al') expect(other.colours, choice.text).toEqual(c.colours);
        }
      }
    }
  });

  it('never offers a distractor that looks the same as the character shown', () => {
    for (const c of CATALOGUE) {
      for (const q of sample((rng) => recogniseDrill(c, rng), 20)) {
        for (const choice of q.choices) {
          if (choice.id === q.correct) continue;
          const other = CATALOGUE.map((x) => recolour(x, c)).find((x) => notation(x) === choice.text);
          expect(other, choice.text).toBeDefined();
          expect(looksSame(other as Character, c), `${notation(c)} vs ${choice.text}`).toBe(false);
        }
      }
    }
  });

  it('lets "a shade over 2 × (√H + √h)" land on the right rising range', () => {
    for (const q of sample(risingDrill)) {
      const [, H, h] = /-(\d+)-([\d.]+)-/.exec(q.id) ?? [];
      const sH = Math.sqrt(Number(H));
      const sh = Math.sqrt(Number(h));
      expect(Number.isInteger(sH) && Number.isInteger(sh * 2), q.id).toBe(true);
      const guess = 2 * (sH + sh);
      const closest = q.choices
        .map((c) => ({ c, d: Math.abs(numberIn(c.text) - guess) }))
        .sort((a, b) => a.d - b.d)[0];
      expect(closest?.c.id, q.id).toBe(q.correct);
    }
  });

  it('keeps the right answer to a rising range right with the other almanac constant', () => {
    for (const q of sample(risingDrill)) {
      const [, H, h] = /-(\d+)-([\d.]+)-/.exec(q.id) ?? [];
      const alt = geographicRangeNm(Number(H), Number(h), GEO_K_ALT);
      const closest = q.choices
        .map((c) => ({ c, d: Math.abs(numberIn(c.text) - alt) }))
        .sort((a, b) => a.d - b.d)[0];
      expect(closest?.c.id, q.id).toBe(q.correct);
    }
  });

  it('puts sector bearings in the sector they name', () => {
    for (const q of sample(sectorDrill)) {
      const right = q.choices.find((c) => c.id === q.correct)?.text ?? '';
      const bearing = Number(/bearing of the light: (\d{3})°T/.exec(q.prompt)?.[1]);
      const sectors = [...q.prompt.matchAll(/([WRG]) (\d{3})°–(\d{3})°/g)].map((m) => ({
        colour: m[1],
        from: Number(m[2]),
        to: Number(m[3]),
      }));
      const hit = sectors.find(
        (s) => (((bearing - s.from) % 360) + 360) % 360 < (((s.to - s.from) % 360) + 360) % 360,
      );
      const expected = !hit
        ? 'Nothing'
        : { W: 'The white', R: 'The red', G: 'The green' }[hit.colour as 'W' | 'R' | 'G'];
      expect(right.startsWith(expected as string), `${q.prompt} → ${right}`).toBe(true);
    }
  });

  it('exposes one source per character and one per computed drill', () => {
    const sources = coastalSources();
    expect(sources.length).toBe(CATALOGUE.length + 6);
    expect(new Set(sources.map((s) => s.concept)).size).toBe(sources.length);
    const rng = createRng(5);
    for (const s of sources) expect(s.generate(rng).concept, s.id).toBe(s.concept);
  });
});

describe('chart notation, as chart 5011 prints it', () => {
  it('writes one, two and several ranges as P14 does', async () => {
    const { rangeText } = await import('./generator.ts');
    expect(rangeText([15])).toBe('15M');
    expect(rangeText([15, 10])).toBe('15/10M');
    expect(rangeText([15, 7, 10])).toBe('15-7M');
    expect(rangeText([7, 5, 6])).toBe('7-5M');
  });

  it('prints the full description without spaces, as P16 does', () => {
    for (const q of sample(decodeDrill, 100)) {
      const line = q.prompt.split('\n\n')[1] ?? '';
      expect(line, q.prompt).toMatch(/^\S+\d+m\d+(\/\d+|-\d+)?M$/);
    }
  });
});
