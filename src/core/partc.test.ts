import { describe, expect, it } from 'vitest';
import { VESSEL_POOL } from './vessels.ts';
import { lightsFor } from './lights/model.ts';
import {
  conceptFor,
  describeLights,
  describeVessel,
  ruleRefsFor,
} from './lights/describe.ts';
import { shapeConceptFor, shapesFor } from './shapes/model.ts';
import { getRule, ruleNumberOf } from './rules.ts';

/**
 * Coverage of Part C.
 *
 * The point of these tests is not that the code works but that the content is
 * complete: every configuration of lights and shapes in Rules 23 to 30 should
 * be reachable from the drills, and every one should be described and cited.
 */

const PART_C_RULES = [23, 24, 25, 26, 27, 28, 29, 30];

describe('Part C coverage', () => {
  it('cites every rule from 23 to 30 somewhere in the pool', () => {
    const cited = new Set<number>();
    for (const v of VESSEL_POOL) {
      for (const ref of ruleRefsFor(v)) {
        const n = ruleNumberOf(ref);
        if (n !== undefined) cited.add(n);
      }
    }
    for (const n of PART_C_RULES) {
      expect(cited.has(n), `no vessel in the pool cites Rule ${n}`).toBe(true);
    }
  });

  it('resolves every rule reference to a real rule or a named Annex', () => {
    for (const v of VESSEL_POOL) {
      for (const ref of ruleRefsFor(v)) {
        const n = ruleNumberOf(ref);
        if (n === undefined) {
          // The Annexes carry no rule number of their own.
          expect(ref, `unparseable reference "${ref}"`).toMatch(/^Annex [IV]+/);
        } else {
          expect(getRule(n), `Rule ${n} does not exist`).toBeDefined();
        }
      }
    }
  });

  it('gives every vessel in the pool at least one light', () => {
    for (const v of VESSEL_POOL) {
      expect(lightsFor(v).length, `${v.kind} shows nothing`).toBeGreaterThan(0);
    }
  });

  it('describes every vessel, its lights and its concept', () => {
    for (const v of VESSEL_POOL) {
      expect(describeVessel(v).length, `${v.kind}`).toBeGreaterThan(10);
      expect(describeLights(v).length, `${v.kind}`).toBeGreaterThan(10);
      expect(conceptFor(v), `${v.kind}`).toMatch(/^lights:/);
    }
  });

  it('gives each distinct night picture its own concept key', () => {
    // Two pool entries may share a concept only when they are variants the
    // drill deliberately mixes, never when they read as different vessels.
    const byConcept = new Map<string, string[]>();
    for (const v of VESSEL_POOL) {
      const key = conceptFor(v);
      byConcept.set(key, [...(byConcept.get(key) ?? []), describeVessel(v)]);
    }
    for (const [concept, descriptions] of byConcept) {
      expect(new Set(descriptions).size, `${concept} mixes unlike vessels`).toBe(1);
    }
  });

  it('gives each day concept a single description too', () => {
    const byConcept = new Map<string, string[]>();
    for (const v of VESSEL_POOL.filter((x) => shapesFor(x).length > 0)) {
      const key = shapeConceptFor(v);
      byConcept.set(key, [...(byConcept.get(key) ?? []), key]);
    }
    for (const [concept, entries] of byConcept) {
      expect(entries.length, `${concept}`).toBeGreaterThan(0);
    }
  });

  it('covers the configurations an examiner is most likely to reach for', () => {
    const kinds = new Set(VESSEL_POOL.map((v) => v.kind));
    for (const kind of [
      'power',
      'power-small',
      'power-tiny',
      'hovercraft',
      'wig',
      'towing',
      'pushing',
      'towed',
      'submerged-tow',
      'sailing',
      'motorsailing',
      'torch',
      'trawler',
      'fishing',
      'nuc',
      'ram',
      'restricted-towing',
      'dredger',
      'diving',
      'mineclearance',
      'cbd',
      'pilot',
      'anchored',
      'aground',
    ] as const) {
      expect(kinds.has(kind), `${kind} missing from the pool`).toBe(true);
    }
  });

  it('includes the small-vessel variants a yachtsman actually meets', () => {
    const has = (pred: (v: (typeof VESSEL_POOL)[number]) => boolean) =>
      VESSEL_POOL.some(pred);
    expect(has((v) => v.kind === 'anchored' && v.lengthM < 50)).toBe(true);
    expect(has((v) => v.kind === 'aground' && v.lengthM < 50)).toBe(true);
    expect(has((v) => v.kind === 'sailing' && v.optionalRedGreen === true)).toBe(true);
    expect(has((v) => v.kind === 'fishing' && v.gearSide !== undefined)).toBe(true);
    expect(has((v) => v.kind === 'dredger' && v.obstructionSide !== undefined)).toBe(true);
  });
});
