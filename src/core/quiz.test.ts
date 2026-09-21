import { describe, expect, it } from 'vitest';
import {
  advance,
  answer,
  createSession,
  currentItem,
  isFinished,
  orderedChoices,
  score,
} from './quiz.ts';
import { ALL_SOURCES, sourcesForTopics } from './questions/index.ts';
import type { Topic } from './types.ts';

const ALL_TOPICS: Topic[] = ['definitions', 'steering', 'lights', 'sound', 'buoyage'];

function clock(): () => number {
  let t = 1000;
  return () => (t += 1000);
}

describe('createSession', () => {
  it('is reproducible from its seed', () => {
    const a = createSession({ topics: ALL_TOPICS, count: 10, seed: 42 });
    const b = createSession({ topics: ALL_TOPICS, count: 10, seed: 42 });
    expect(a.items.map((i) => i.question.id)).toEqual(b.items.map((i) => i.question.id));
    expect(a.items.map((i) => i.order)).toEqual(b.items.map((i) => i.order));
  });

  it('varies with the seed', () => {
    const a = createSession({ topics: ALL_TOPICS, count: 10, seed: 1 });
    const b = createSession({ topics: ALL_TOPICS, count: 10, seed: 2 });
    expect(a.items.map((i) => i.question.id)).not.toEqual(b.items.map((i) => i.question.id));
  });

  it('never repeats a question within a session', () => {
    const s = createSession({ topics: ALL_TOPICS, count: ALL_SOURCES.length, seed: 7 });
    const ids = s.items.map((i) => i.question.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('caps at the size of the bank rather than padding', () => {
    const s = createSession({ topics: ['buoyage'], count: 1000, seed: 3 });
    expect(s.items.length).toBe(sourcesForTopics(['buoyage']).length);
  });

  it('draws only from the requested topics', () => {
    const s = createSession({ topics: ['sound'], count: 50, seed: 5 });
    expect(s.items.every((i) => i.question.topic === 'sound')).toBe(true);
  });

  it('presents every choice exactly once', () => {
    const s = createSession({ topics: ALL_TOPICS, count: 20, seed: 11 });
    for (const item of s.items) {
      const shown = orderedChoices(item).map((c) => c.id).sort();
      const defined = item.question.choices.map((c) => c.id).sort();
      expect(shown).toEqual(defined);
    }
  });
});

describe('answering', () => {
  it('records the first answer and ignores later ones', () => {
    let s = createSession({ topics: ALL_TOPICS, count: 5, seed: 9 });
    s = answer(s, 'a');
    s = answer(s, 'b');
    expect(currentItem(s)?.given).toBe('a');
  });

  it('walks to the end and then reports finished', () => {
    let s = createSession({ topics: ALL_TOPICS, count: 3, seed: 13 }, undefined, clock());
    expect(isFinished(s)).toBe(false);
    for (let i = 0; i < 3; i++) {
      s = answer(s, currentItem(s)!.question.correct);
      s = advance(s, clock());
    }
    expect(isFinished(s)).toBe(true);
    expect(s.finishedAt).not.toBeNull();
  });
});

describe('score', () => {
  it('scores a perfect session', () => {
    let s = createSession({ topics: ALL_TOPICS, count: 6, seed: 21 }, undefined, clock());
    while (!isFinished(s)) {
      s = answer(s, currentItem(s)!.question.correct);
      s = advance(s, clock());
    }
    const result = score(s, clock());
    expect(result.correct).toBe(6);
    expect(result.ratio).toBe(1);
    expect(result.wrong).toEqual([]);
  });

  it('counts an unanswered question as wrong', () => {
    let s = createSession({ topics: ALL_TOPICS, count: 4, seed: 33 }, undefined, clock());
    s = advance(s, clock());
    s = advance(s, clock());
    s = advance(s, clock());
    s = advance(s, clock());
    const result = score(s, clock());
    expect(result.correct).toBe(0);
    expect(result.wrong).toHaveLength(4);
  });

  it('breaks the score down by topic', () => {
    let s = createSession({ topics: ['buoyage'], count: 4, seed: 44 }, undefined, clock());
    while (!isFinished(s)) {
      s = answer(s, currentItem(s)!.question.correct);
      s = advance(s, clock());
    }
    const result = score(s, clock());
    expect(result.byTopic).toEqual([{ topic: 'buoyage', correct: 4, total: 4 }]);
  });
});
