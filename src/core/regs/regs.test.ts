import { describe, expect, it } from 'vitest';
import { ANCHORS, REG_DOCS, blocksOf, resolveRef } from './index.ts';
import { INLINE_REF, parseRef } from './model.ts';
import { ALL_SOURCES } from '../questions/index.ts';
import { RULES } from '../rules.ts';
import { createRng } from '../rng.ts';

describe('the text of the Regulations', () => {
  it('carries every rule, 1 to 41, and all four Annexes, once each', () => {
    const ids = REG_DOCS.map((d) => d.id);
    const expected = [
      ...Array.from({ length: 41 }, (_, i) => `r${i + 1}`),
      'a1',
      'a2',
      'a3',
      'a4',
    ];
    expect(ids).toEqual(expected);
  });

  it('agrees with the rule index on every title it shares', () => {
    for (const rule of RULES) {
      const doc = REG_DOCS.find((d) => d.id === `r${rule.n}`)!;
      expect(doc.part, `Rule ${rule.n}`).toBe(rule.part);
    }
  });

  it('gives every document some text and unique anchors', () => {
    for (const doc of REG_DOCS) {
      const paras = blocksOf(doc.id).filter((b) => b.type === 'para');
      expect(paras.length, doc.id).toBeGreaterThan(0);
      const labelled = paras.filter((b) => b.type === 'para' && b.label);
      const anchors = labelled.map((b) => (b.type === 'para' ? b.anchor : ''));
      expect(new Set(anchors).size, `${doc.id} repeats an anchor`).toBe(anchors.length);
    }
  });

  it('resolves the paragraphs the drills lean on', () => {
    for (const a of ['r17-a-ii', 'r3-g-vi', 'r24-a-v', 'r27-b-iv', 'r27-d-iii', 'r35-k', 'a1-9-a-i', 'a4-1-k']) {
      expect(ANCHORS.has(a), a).toBe(true);
    }
  });
});

describe('citations', () => {
  it('parses the forms the questions use', () => {
    expect(parseRef('Rule 17(a)(ii)')).toEqual({ docId: 'r17', path: ['a', 'ii'] });
    expect(parseRef('Annex IV, 1(k)')).toEqual({ docId: 'a4', path: ['1', 'k'] });
    expect(parseRef('Annex I, section 9(a)(i)')).toEqual({ docId: 'a1', path: ['9', 'a', 'i'] });
    expect(parseRef('Annex II')).toEqual({ docId: 'a2', path: [] });
    expect(parseRef('IALA A')).toBeUndefined();
  });

  it('finds citations inside running text', () => {
    const text = 'Rule 13(a) overrides Rule 18, and Annex IV lists the signals.';
    expect(text.match(INLINE_REF)).toEqual(['Rule 13(a)', 'Rule 18', 'Annex IV']);
  });

  it('resolves every rule and annex citation in the bank to the paragraph it names', () => {
    const rng = createRng(7);
    const unresolved: string[] = [];
    for (const source of ALL_SOURCES) {
      for (const ref of source.generate(rng).ruleRefs) {
        const target = parseRef(ref);
        if (!target) continue;
        const hit = resolveRef(ref);
        const full = [target.docId, ...target.path].join('-');
        if (!hit || hit.anchor !== full) unresolved.push(`${source.id}: ${ref}`);
      }
    }
    expect(unresolved).toEqual([]);
  });
});
