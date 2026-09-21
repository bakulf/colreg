import { describe, expect, it } from 'vitest';
import { ALL_QUESTIONS } from './questions/index.ts';
import { getRule, ruleNumberOf } from './rules.ts';
import { TOPICS } from './types.ts';

/**
 * Content is the product here, so it gets the same treatment as code: every
 * authoring mistake that can be caught mechanically is caught here rather than
 * discovered mid-revision.
 */
describe('question bank', () => {
  it('has unique ids', () => {
    const seen = new Set<string>();
    const duplicates: string[] = [];
    for (const q of ALL_QUESTIONS) {
      if (seen.has(q.id)) duplicates.push(q.id);
      seen.add(q.id);
    }
    expect(duplicates).toEqual([]);
  });

  it('gives every question exactly one correct choice that exists', () => {
    for (const q of ALL_QUESTIONS) {
      const match = q.choices.filter((c) => c.id === q.correct);
      expect(match, `${q.id} must have exactly one correct choice`).toHaveLength(1);
    }
  });

  it('offers at least three distinct, non-empty choices', () => {
    for (const q of ALL_QUESTIONS) {
      expect(q.choices.length, q.id).toBeGreaterThanOrEqual(3);
      const texts = new Set(q.choices.map((c) => c.text.trim()));
      expect(texts.size, `${q.id} has duplicate choice text`).toBe(q.choices.length);
      for (const c of q.choices) expect(c.text.trim(), q.id).not.toBe('');
    }
  });

  it('cites at least one rule reference that resolves to a real rule', () => {
    for (const q of ALL_QUESTIONS) {
      expect(q.ruleRefs.length, `${q.id} cites no rule`).toBeGreaterThan(0);
      for (const ref of q.ruleRefs) {
        const n = ruleNumberOf(ref);
        // Buoyage cites IALA, which has no rule number; COLREG refs must resolve.
        if (n === undefined) {
          expect(ref, `${q.id} ref "${ref}"`).toMatch(/IALA/);
        } else {
          expect(getRule(n), `${q.id} cites nonexistent Rule ${n}`).toBeDefined();
        }
      }
    }
  });

  it('explains every question', () => {
    for (const q of ALL_QUESTIONS) {
      expect(q.explanation.trim().length, `${q.id} has no explanation`).toBeGreaterThan(40);
    }
  });

  it('uses only known topics', () => {
    for (const q of ALL_QUESTIONS) {
      expect(TOPICS, q.id).toContain(q.topic);
    }
  });

  it('covers every topic', () => {
    for (const topic of TOPICS) {
      const n = ALL_QUESTIONS.filter((q) => q.topic === topic).length;
      expect(n, `topic ${topic} is empty`).toBeGreaterThan(0);
    }
  });
});
