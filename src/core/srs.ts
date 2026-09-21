/**
 * Spaced repetition over concepts.
 *
 * FSRS-style: each concept carries a *stability* — how many days until recall
 * probability falls to the target — and a *difficulty*, how hard the concept is
 * for this learner. Reviews move both. Unlike SM-2, the interval comes from a
 * forgetting curve rather than from multiplying the last interval, so a lapse
 * after a long gap is penalised less harshly than a lapse after a short one.
 *
 * Scheduling a *concept* rather than a question is what makes this work with
 * the generators: the drill for `lights:trawler-stopped` mints a fresh picture
 * every time, so there is nothing to memorise except the thing being tested.
 *
 * The parameters below are a reasonable published default set, not one fitted
 * to this learner. Fitting would need far more review history than an exam
 * candidate produces in a few weeks, and a wrong fit is worse than a sane
 * default.
 */

export type Grade = 'again' | 'hard' | 'good' | 'easy';

export interface CardState {
  concept: string;
  /** Days until recall probability reaches RETENTION_TARGET. */
  stability: number;
  /** 1 (easy) to 10 (hard). */
  difficulty: number;
  /** Epoch milliseconds of the last review, or 0 if never seen. */
  lastReviewed: number;
  /** Epoch milliseconds when it next falls due. */
  due: number;
  reps: number;
  lapses: number;
}

export const RETENTION_TARGET = 0.9;
const DAY_MS = 86_400_000;

/** Initial stability in days, by first grade. */
const INITIAL_STABILITY: Record<Grade, number> = {
  again: 0.4,
  hard: 1.2,
  good: 3.1,
  easy: 15.7,
};

const INITIAL_DIFFICULTY = 5.3;
const DIFFICULTY_DELTA: Record<Grade, number> = {
  again: 1.7,
  hard: 0.6,
  good: -0.1,
  easy: -1.0,
};

/** How much a successful review multiplies stability, before adjustments. */
const GROWTH: Record<Grade, number> = {
  again: 0,
  hard: 1.2,
  good: 2.4,
  easy: 4.0,
};

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

export function newCard(concept: string): CardState {
  return {
    concept,
    stability: 0,
    difficulty: INITIAL_DIFFICULTY,
    lastReviewed: 0,
    due: 0,
    reps: 0,
    lapses: 0,
  };
}

/**
 * Probability the learner still knows it, on the exponential forgetting curve
 * used by FSRS. At elapsed == stability this returns RETENTION_TARGET.
 */
export function retrievability(card: CardState, now: number): number {
  if (card.reps === 0 || card.stability <= 0) return 0;
  const elapsedDays = Math.max(0, (now - card.lastReviewed) / DAY_MS);
  return Math.pow(1 + elapsedDays / (card.stability * 9), -1);
}

export function review(card: CardState, grade: Grade, now: number): CardState {
  const difficulty = clamp(card.difficulty + DIFFICULTY_DELTA[grade], 1, 10);

  let stability: number;
  if (card.reps === 0) {
    stability = INITIAL_STABILITY[grade];
  } else if (grade === 'again') {
    // A lapse does not reset to zero. How much survives depends on how strong
    // it was and how hard the concept is.
    stability = clamp(card.stability * 0.35 * (11 - difficulty) * 0.1, 0.2, card.stability);
  } else {
    // Reviewing something you had almost forgotten is worth more than
    // reviewing something you still knew perfectly — the spacing effect.
    const r = retrievability(card, now);
    const surprise = 1 + (1 - r) * 0.9;
    const ease = (11 - difficulty) / 9;
    stability = card.stability * (1 + (GROWTH[grade] - 1) * ease * surprise);
  }

  stability = clamp(stability, 0.2, 3650);
  const due = now + Math.round(stability * DAY_MS);

  return {
    concept: card.concept,
    stability,
    difficulty,
    lastReviewed: now,
    due,
    reps: card.reps + 1,
    lapses: card.lapses + (grade === 'again' ? 1 : 0),
  };
}

/**
 * Turns a right-or-wrong answer into a grade.
 *
 * The app asks multiple choice, so there is no self-rating to collect. Time
 * taken is the only other signal available, and a fast correct answer is
 * genuinely different from one that took twenty seconds of elimination.
 */
export function gradeFromAnswer(correct: boolean, elapsedMs: number): Grade {
  if (!correct) return 'again';
  if (elapsedMs < 6000) return 'easy';
  if (elapsedMs < 20000) return 'good';
  return 'hard';
}

export type Deck = Record<string, CardState>;

export function cardFor(deck: Deck, concept: string): CardState {
  return deck[concept] ?? newCard(concept);
}

export function applyReview(
  deck: Deck,
  concept: string,
  grade: Grade,
  now: number,
): Deck {
  return { ...deck, [concept]: review(cardFor(deck, concept), grade, now) };
}

export interface DueCounts {
  /** Never reviewed. */
  fresh: number;
  /** Reviewed and now due. */
  due: number;
  /** Reviewed and not yet due. */
  resting: number;
}

export function counts(deck: Deck, allConcepts: readonly string[], now: number): DueCounts {
  let fresh = 0;
  let due = 0;
  let resting = 0;
  for (const concept of allConcepts) {
    const card = deck[concept];
    if (!card || card.reps === 0) fresh += 1;
    else if (card.due <= now) due += 1;
    else resting += 1;
  }
  return { fresh, due, resting };
}

/**
 * Orders concepts for a study session: overdue first, worst overdue first,
 * then concepts never seen, then anything else by how soon it falls due.
 *
 * Mixing in unseen concepts rather than clearing the whole backlog first keeps
 * a session from being all revision on a day when a lot has come due.
 */
export function schedule(
  deck: Deck,
  allConcepts: readonly string[],
  now: number,
): string[] {
  const overdue: Array<{ concept: string; by: number }> = [];
  const fresh: string[] = [];
  const resting: Array<{ concept: string; due: number }> = [];

  for (const concept of allConcepts) {
    const card = deck[concept];
    if (!card || card.reps === 0) {
      fresh.push(concept);
    } else if (card.due <= now) {
      overdue.push({ concept, by: now - card.due });
    } else {
      resting.push({ concept, due: card.due });
    }
  }

  overdue.sort((a, b) => b.by - a.by);
  resting.sort((a, b) => a.due - b.due);

  return [
    ...overdue.map((e) => e.concept),
    ...fresh,
    ...resting.map((e) => e.concept),
  ];
}

/** Concepts you keep getting wrong, worst first. */
export function weakest(deck: Deck, limit = 10): CardState[] {
  return Object.values(deck)
    .filter((c) => c.reps > 0)
    .sort((a, b) => b.difficulty - a.difficulty || b.lapses - a.lapses)
    .slice(0, limit);
}

/** A rough readiness figure: the share of concepts you would still recall. */
export function readiness(
  deck: Deck,
  allConcepts: readonly string[],
  now: number,
): number {
  if (allConcepts.length === 0) return 0;
  const total = allConcepts.reduce((sum, concept) => {
    const card = deck[concept];
    return sum + (card ? retrievability(card, now) : 0);
  }, 0);
  return total / allConcepts.length;
}
