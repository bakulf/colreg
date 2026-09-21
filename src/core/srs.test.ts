import { describe, expect, it } from 'vitest';
import type { Deck } from './srs.ts';
import {
  applyReview,
  cardFor,
  counts,
  gradeFromAnswer,
  newCard,
  readiness,
  retrievability,
  review,
  schedule,
} from './srs.ts';

const DAY = 86_400_000;
const T0 = 1_750_000_000_000;

describe('grading', () => {
  it('treats a wrong answer as a lapse whatever the speed', () => {
    expect(gradeFromAnswer(false, 500)).toBe('again');
    expect(gradeFromAnswer(false, 60_000)).toBe('again');
  });

  it('rewards a fast right answer and discounts a slow one', () => {
    expect(gradeFromAnswer(true, 3000)).toBe('easy');
    expect(gradeFromAnswer(true, 12_000)).toBe('good');
    expect(gradeFromAnswer(true, 45_000)).toBe('hard');
  });
});

describe('scheduling one card', () => {
  it('gives a new card an interval that grows with the grade', () => {
    const base = newCard('c');
    const again = review(base, 'again', T0).due - T0;
    const hard = review(base, 'hard', T0).due - T0;
    const good = review(base, 'good', T0).due - T0;
    const easy = review(base, 'easy', T0).due - T0;
    expect(again).toBeLessThan(hard);
    expect(hard).toBeLessThan(good);
    expect(good).toBeLessThan(easy);
  });

  it('lengthens the interval on each successful review', () => {
    let card = review(newCard('c'), 'good', T0);
    const first = card.stability;
    card = review(card, 'good', card.due);
    expect(card.stability).toBeGreaterThan(first);
    card = review(card, 'good', card.due);
    expect(card.stability).toBeGreaterThan(first * 2);
  });

  it('shortens but does not reset the interval on a lapse', () => {
    let card = review(newCard('c'), 'good', T0);
    card = review(card, 'good', card.due);
    card = review(card, 'good', card.due);
    const before = card.stability;

    const lapsed = review(card, 'again', card.due);
    expect(lapsed.stability).toBeLessThan(before);
    expect(lapsed.stability).toBeGreaterThan(0);
    expect(lapsed.lapses).toBe(1);
  });

  it('makes a concept harder when you keep missing it', () => {
    let card = newCard('c');
    const start = card.difficulty;
    for (let i = 0; i < 3; i++) card = review(card, 'again', T0 + i * DAY);
    expect(card.difficulty).toBeGreaterThan(start);
    expect(card.difficulty).toBeLessThanOrEqual(10);
  });

  it('makes a concept easier when you keep getting it right quickly', () => {
    let card = newCard('c');
    const start = card.difficulty;
    for (let i = 0; i < 3; i++) card = review(card, 'easy', card.due || T0);
    expect(card.difficulty).toBeLessThan(start);
    expect(card.difficulty).toBeGreaterThanOrEqual(1);
  });

  it('keeps difficulty inside its bounds however it is hammered', () => {
    let card = newCard('c');
    for (let i = 0; i < 40; i++) card = review(card, 'again', T0 + i * DAY);
    expect(card.difficulty).toBeLessThanOrEqual(10);
    for (let i = 0; i < 80; i++) card = review(card, 'easy', card.due);
    expect(card.difficulty).toBeGreaterThanOrEqual(1);
  });

  it('rewards a review that was nearly forgotten more than one still fresh', () => {
    const base = review(newCard('c'), 'good', T0);

    const immediately = review(base, 'good', T0 + 60_000);
    const atTheLimit = review(base, 'good', base.due);

    // The spacing effect: recalling something you had almost lost is worth
    // more than recalling something you reviewed a minute ago.
    expect(atTheLimit.stability).toBeGreaterThan(immediately.stability);
  });
});

describe('retrievability', () => {
  it('is zero for a card never reviewed', () => {
    expect(retrievability(newCard('c'), T0)).toBe(0);
  });

  it('decays with time since the last review', () => {
    const card = review(newCard('c'), 'good', T0);
    const fresh = retrievability(card, T0);
    const later = retrievability(card, T0 + 30 * DAY);
    expect(fresh).toBeGreaterThan(later);
    expect(later).toBeGreaterThan(0);
  });

  it('is highest immediately after a review', () => {
    const card = review(newCard('c'), 'good', T0);
    expect(retrievability(card, T0)).toBeCloseTo(1, 5);
  });
});

describe('the deck', () => {
  const concepts = ['a', 'b', 'c', 'd'];

  it('reports a fresh deck as all unseen', () => {
    expect(counts({}, concepts, T0)).toEqual({ fresh: 4, due: 0, resting: 0 });
    expect(readiness({}, concepts, T0)).toBe(0);
  });

  it('moves a reviewed concept out of the unseen pile', () => {
    const deck = applyReview({}, 'a', 'good', T0);
    expect(counts(deck, concepts, T0)).toEqual({ fresh: 3, due: 0, resting: 1 });
  });

  it('brings a concept back when its interval has run out', () => {
    const deck = applyReview({}, 'a', 'good', T0);
    const after = (deck['a'] as NonNullable<Deck[string]>).due + 1;
    expect(counts(deck, concepts, after).due).toBe(1);
  });

  it('puts the most overdue concept first, then the unseen', () => {
    let deck: Deck = {};
    deck = applyReview(deck, 'a', 'good', T0 - 40 * DAY);
    deck = applyReview(deck, 'b', 'good', T0 - 5 * DAY);
    deck = applyReview(deck, 'c', 'easy', T0);

    const order = schedule(deck, concepts, T0);
    expect(order[0]).toBe('a');
    // 'd' has never been seen, so it comes before 'c', which is resting.
    expect(order.indexOf('d')).toBeLessThan(order.indexOf('c'));
  });

  it('returns every concept exactly once, whatever their state', () => {
    let deck: Deck = {};
    deck = applyReview(deck, 'a', 'again', T0);
    deck = applyReview(deck, 'c', 'easy', T0);
    const order = schedule(deck, concepts, T0);
    expect(order.slice().sort()).toEqual(concepts.slice().sort());
  });

  it('ignores deck entries for concepts not in the topics chosen', () => {
    const deck = applyReview({}, 'zz-not-a-topic', 'good', T0);
    expect(counts(deck, concepts, T0).fresh).toBe(4);
    expect(schedule(deck, concepts, T0)).not.toContain('zz-not-a-topic');
  });

  it('raises readiness as concepts are learned', () => {
    let deck: Deck = {};
    const before = readiness(deck, concepts, T0);
    for (const c of concepts) deck = applyReview(deck, c, 'good', T0);
    expect(readiness(deck, concepts, T0)).toBeGreaterThan(before);
    expect(readiness(deck, concepts, T0)).toBeLessThanOrEqual(1);
  });

  it('hands back a usable card for a concept it has never seen', () => {
    const card = cardFor({}, 'brand-new');
    expect(card.concept).toBe('brand-new');
    expect(card.reps).toBe(0);
  });
});
