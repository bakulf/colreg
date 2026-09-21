import { describe, expect, it } from 'vitest';
import { ALL_SOURCES } from './questions/index.ts';
import { RULES, ruleNumberOf } from './rules.ts';
import { createRng } from './rng.ts';

/**
 * Coverage of the Regulations, checked rather than claimed.
 *
 * Every source is generated once and its citations collected, so the answer to
 * "is Rule 27 in here?" comes from the bank itself rather than from anyone's
 * memory of having written it.
 */

function citedRules(): Map<number, string[]> {
  const rng = createRng(4242);
  const cited = new Map<number, string[]>();

  for (const source of ALL_SOURCES) {
    const question = source.generate(rng);
    for (const ref of question.ruleRefs) {
      const n = ruleNumberOf(ref);
      if (n === undefined) continue;
      cited.set(n, [...(cited.get(n) ?? []), source.concept]);
    }
  }
  return cited;
}


describe('coverage of the Regulations', () => {
  const cited = citedRules();

  it('cites every steering and sailing rule, 4 to 19', () => {
    for (let n = 4; n <= 19; n++) {
      expect(cited.has(n), `Rule ${n} is not cited by any drill`).toBe(true);
    }
  });

  it('cites every rule in the Regulations, 1 to 38, with no exceptions', () => {
    const missing = RULES.map((r) => r.n).filter((n) => !cited.has(n));
    expect(missing, 'rules no drill cites').toEqual([]);
  });

  it('drills every rule from both directions, number and subject', () => {
    // The rule index covers the whole table, so every rule has at least the
    // "what is Rule N" and "which rule covers X" pair.
    for (const rule of RULES) {
      expect(
        (cited.get(rule.n) ?? []).length,
        `Rule ${rule.n} (${rule.title}) is thinly covered`,
      ).toBeGreaterThanOrEqual(2);
    }
  });

  it('covers the Annexes that carry drillable content', () => {
    const rng = createRng(99);
    const annexes = new Set<string>();
    for (const source of ALL_SOURCES) {
      for (const ref of source.generate(rng).ruleRefs) {
        const match = /^Annex ([IV]+)/.exec(ref);
        if (match) annexes.add(match[1] as string);
      }
    }
    // Annex II: additional signals for fishing vessels in close proximity.
    // Annex IV: distress signals.
    expect([...annexes].sort()).toEqual(['II', 'IV']);
  });

  it('drills the rules an examiner leans on hardest more than once', () => {
    // Rules 13 to 19 are where candidates lose marks, so none of them should
    // rest on a single question.
    for (let n = 13; n <= 19; n++) {
      expect(
        (cited.get(n) ?? []).length,
        `Rule ${n} rests on too few drills`,
      ).toBeGreaterThanOrEqual(2);
    }
  });
});
