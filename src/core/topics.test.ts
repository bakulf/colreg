import { describe, expect, it } from 'vitest';
import { ALL_SOURCES, sourcesForDomain } from './questions/index.ts';
import { createRng } from './rng.ts';
import type { Domain } from './types.ts';
import { DOMAIN_LABELS, TOPICS, TOPIC_INFO, topicsOf } from './types.ts';
import { topicForRef } from './topics.ts';

/**
 * COLREG and IALA are kept apart, and COLREG is divided the way the Convention
 * divides itself. Both are claims about every question, so every source is
 * generated repeatedly and held to them.
 */
describe('topics', () => {
  const rng = createRng(90210);
  const samples = ALL_SOURCES.flatMap((source) =>
    Array.from({ length: source.generated ? 12 : 1 }, () => ({
      source,
      question: source.generate(rng),
    })),
  );

  it('files every COLREG question under the Part its first citation is in', () => {
    for (const { source, question } of samples) {
      if (TOPIC_INFO[source.topic].domain !== 'colreg') continue;
      const first = question.ruleRefs[0] ?? '';
      expect(topicForRef(first), `${source.id} cites ${first}`).toBe(source.topic);
      expect(question.topic, source.id).toBe(source.topic);
    }
  });

  it('cites only its own domain’s authorities', () => {
    const own: Record<Domain, (ref: string) => boolean> = {
      colreg: (ref) => {
        try {
          topicForRef(ref);
          return true;
        } catch {
          return false;
        }
      },
      iala: (ref) => /^IALA( Region)?( A)?$/.test(ref),
      coastal: (ref) => /^IALA R0(110|202)$|^Chart notation$|^Horizon geometry$/.test(ref),
    };
    for (const { source, question } of samples) {
      const domain = TOPIC_INFO[source.topic].domain;
      for (const ref of question.ruleRefs) {
        expect(own[domain](ref), `${source.id} (${domain}) cites "${ref}"`).toBe(true);
      }
    }
  });

  it('has something to ask in every topic', () => {
    for (const topic of TOPICS) {
      expect(ALL_SOURCES.some((s) => s.topic === topic), topic).toBe(true);
    }
  });

  it('draws a domain from that domain only, whatever else is selected', () => {
    const everything = [...TOPICS];
    for (const s of sourcesForDomain('iala', everything)) {
      expect(TOPIC_INFO[s.topic].domain).toBe('iala');
    }
    for (const s of sourcesForDomain('colreg', everything)) {
      expect(TOPIC_INFO[s.topic].domain).toBe('colreg');
    }
    const domains = Object.keys(DOMAIN_LABELS) as Domain[];
    for (const d of domains) {
      for (const s of sourcesForDomain(d, everything)) expect(TOPIC_INFO[s.topic].domain).toBe(d);
    }
    expect(domains.reduce((n, d) => n + topicsOf(d).length, 0)).toBe(TOPICS.length);
  });
});
