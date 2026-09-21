import { describe, expect, it } from 'vitest';
import {
  hasDaySignal,
  shapeConceptFor,
  shapeSignature,
  shapesFor,
} from './model.ts';
import { composeShapeDrill, shapeSources } from './generator.ts';
import { VESSEL_POOL } from '../vessels.ts';
import { createRng } from '../rng.ts';

describe('day signals', () => {
  it('gives a vessel not under command two balls', () => {
    const shapes = shapesFor({ kind: 'nuc', lengthM: 80, makingWay: false });
    expect(shapes.map((s) => s.form)).toEqual(['ball', 'ball']);
  });

  it('gives a vessel restricted in her ability to manoeuvre ball, diamond, ball', () => {
    const shapes = shapesFor({ kind: 'ram', lengthM: 70, makingWay: false })
      .sort((a, b) => b.row - a.row)
      .map((s) => s.form);
    expect(shapes).toEqual(['ball', 'diamond', 'ball']);
  });

  it('gives a vessel aground three balls, against her two red lights', () => {
    const shapes = shapesFor({ kind: 'aground', lengthM: 120, makingWay: false });
    expect(shapes.filter((s) => s.form === 'ball')).toHaveLength(3);
  });

  it('puts the dredger\'s balls on the obstructed side and diamonds on the clear side', () => {
    const shapes = shapesFor({
      kind: 'dredger',
      lengthM: 45,
      makingWay: true,
      obstructionSide: 'port',
    });
    const balls = shapes.filter((s) => s.form === 'ball' && s.column !== 0);
    const diamonds = shapes.filter((s) => s.form === 'diamond' && s.column !== 0);
    expect(balls).toHaveLength(2);
    expect(diamonds).toHaveLength(2);
    expect(balls.every((s) => s.column < 0)).toBe(true);
    expect(diamonds.every((s) => s.column > 0)).toBe(true);
  });

  it('gives every fishing vessel the same two cones, trawling or not', () => {
    const trawler = shapeSignature({ kind: 'trawler', lengthM: 24, makingWay: true });
    const other = shapeSignature({ kind: 'fishing', lengthM: 18, makingWay: true });
    expect(trawler).toBe(other);
  });

  it('shows the tow diamond only when the tow exceeds 200 metres', () => {
    const short = shapesFor({ kind: 'towing', lengthM: 30, makingWay: true, towLengthM: 90 });
    const long = shapesFor({ kind: 'towing', lengthM: 30, makingWay: true, towLengthM: 260 });
    expect(short).toEqual([]);
    expect(long.map((s) => s.form)).toEqual(['diamond']);
  });

  it('gives a power-driven vessel underway no day signal at all', () => {
    expect(hasDaySignal({ kind: 'power', lengthM: 140, makingWay: true })).toBe(false);
    expect(hasDaySignal({ kind: 'sailing', lengthM: 12, makingWay: true })).toBe(false);
  });

  it('marks out a motorsailing yacht with a cone apex downwards', () => {
    const shapes = shapesFor({ kind: 'motorsailing', lengthM: 14, makingWay: true });
    expect(shapes.map((s) => s.form)).toEqual(['cone-down']);
  });

  it('spreads the mine clearance balls across the fore yard', () => {
    const shapes = shapesFor({ kind: 'mineclearance', lengthM: 55, makingWay: true });
    expect(shapes).toHaveLength(3);
    expect(new Set(shapes.map((s) => s.column))).toEqual(new Set([-1, 0, 1]));
  });
});

describe('day generator', () => {
  const pool = VESSEL_POOL.filter(hasDaySignal);

  it('drills only vessels that actually carry a day signal', () => {
    expect(pool.length).toBeGreaterThan(10);
    for (const v of pool) expect(shapesFor(v).length).toBeGreaterThan(0);
  });

  it('never offers two options with the same arrangement of shapes', () => {
    const r = createRng(7);
    for (const vessel of pool) {
      for (let i = 0; i < 10; i++) {
        const { distractors } = composeShapeDrill(vessel, r);
        const sigs = [vessel, ...distractors].map(shapeSignature);
        expect(new Set(sigs).size, `${vessel.kind}`).toBe(sigs.length);
      }
    }
  });

  it('never offers two options with the same wording', () => {
    const r = createRng(11);
    for (const vessel of pool) {
      const texts = composeShapeDrill(vessel, r).question.choices.map((c) => c.text);
      expect(new Set(texts).size, `${vessel.kind}`).toBe(texts.length);
    }
  });

  it('carries a shapes scene and at least three options', () => {
    const r = createRng(13);
    for (const vessel of pool) {
      const q = composeShapeDrill(vessel, r).question;
      expect(q.scene?.type).toBe('shapes');
      expect(q.choices.length).toBeGreaterThanOrEqual(3);
      expect(q.correct).toBe('a');
    }
  });

  it('exposes one source per day concept', () => {
    const sources = shapeSources();
    expect(new Set(sources.map((s) => s.concept)).size).toBe(sources.length);
    expect(sources.every((s) => s.generated)).toBe(true);
    expect(new Set(pool.map(shapeConceptFor)).size).toBe(sources.length);
  });
});
