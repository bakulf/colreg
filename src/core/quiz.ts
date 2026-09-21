import type { Question, QuestionSource, Topic } from './types.ts';
import { createRng, randomSeed, shuffle } from './rng.ts';
import { sourcesForTopics } from './questions/index.ts';

export interface QuizConfig {
  topics: readonly Topic[];
  /** Upper bound; a session is shorter if the bank has fewer questions. */
  count: number;
  seed?: number;
  /**
   * Concepts in the order the scheduler wants them. Sources whose concept
   * appears here are drawn first, in that order; the rest follow shuffled.
   * Omit it for a plain random practice session.
   */
  priority?: readonly string[];
}

export interface QuizItem {
  question: Question;
  /** Choice ids in presentation order; shuffled per session. */
  order: string[];
  /** The choice the user picked, or null while unanswered. */
  given: string | null;
  /** When this question was first put in front of the learner. */
  shownAt: number | null;
  /** When it was answered. The gap between the two grades the review. */
  answeredAt: number | null;
}

export interface QuizSession {
  seed: number;
  topics: readonly Topic[];
  items: QuizItem[];
  /** Index of the item being shown. */
  cursor: number;
  startedAt: number;
  finishedAt: number | null;
}

export function createSession(
  config: QuizConfig,
  sources: readonly QuestionSource[] = sourcesForTopics(config.topics),
  now: () => number = Date.now,
): QuizSession {
  const seed = config.seed ?? randomSeed();
  const rng = createRng(seed);

  const wanted = Math.max(0, config.count);
  const items: QuizItem[] = [];
  const seen = new Set<string>();

  // A scheduled session follows the scheduler's order; a practice session is
  // shuffled. Either way the same duplicate check applies.
  const shuffled = shuffle(sources, rng);
  const ordered = config.priority
    ? orderByPriority(shuffled, config.priority)
    : shuffled;

  // Draw until the paper is full rather than taking a fixed slice, because two
  // different concepts can legitimately mint the same question: a vessel under
  // tow and a sailing vessel produce one identical picture with one identical
  // combined answer. Asking it twice in a paper looks like a bug.
  for (const source of ordered) {
    if (items.length >= wanted) break;
    const question = source.generate(rng);
    const fingerprint = `${question.prompt}\u0000${question.choices
      .map((c) => c.text)
      .sort()
      .join('\u0001')}`;
    if (seen.has(fingerprint)) continue;
    seen.add(fingerprint);
    items.push({
      question,
      order: shuffle(question.choices.map((c) => c.id), rng),
      given: null,
      shownAt: null,
      answeredAt: null,
    });
  }

  const first = items[0];
  if (first) first.shownAt = now();

  return {
    seed,
    topics: config.topics,
    items,
    cursor: 0,
    startedAt: now(),
    finishedAt: null,
  };
}

export function currentItem(session: QuizSession): QuizItem | undefined {
  return session.items[session.cursor];
}

export function isAnswered(item: QuizItem): boolean {
  return item.given !== null;
}

export function isCorrect(item: QuizItem): boolean {
  return item.given === item.question.correct;
}

function orderByPriority(
  sources: readonly QuestionSource[],
  priority: readonly string[],
): QuestionSource[] {
  const rank = new Map(priority.map((concept, i) => [concept, i]));
  const scheduled: QuestionSource[] = [];
  const rest: QuestionSource[] = [];
  for (const source of sources) {
    if (rank.has(source.concept)) scheduled.push(source);
    else rest.push(source);
  }
  scheduled.sort(
    (a, b) => (rank.get(a.concept) as number) - (rank.get(b.concept) as number),
  );
  return [...scheduled, ...rest];
}

/** Records an answer. First answer wins — re-answering is a no-op. */
export function answer(
  session: QuizSession,
  choiceId: string,
  now: () => number = Date.now,
): QuizSession {
  const item = session.items[session.cursor];
  if (!item || item.given !== null) return session;

  const items = session.items.slice();
  items[session.cursor] = { ...item, given: choiceId, answeredAt: now() };
  return { ...session, items };
}

/** How long the learner spent on this question, or 0 if it was skipped. */
export function elapsedFor(item: QuizItem): number {
  if (item.shownAt === null || item.answeredAt === null) return 0;
  return Math.max(0, item.answeredAt - item.shownAt);
}

export function advance(
  session: QuizSession,
  now: () => number = Date.now,
): QuizSession {
  const next = session.cursor + 1;
  if (next >= session.items.length) {
    return { ...session, cursor: session.items.length, finishedAt: now() };
  }
  const items = session.items.slice();
  const upcoming = items[next];
  if (upcoming && upcoming.shownAt === null) {
    items[next] = { ...upcoming, shownAt: now() };
  }
  return { ...session, items, cursor: next };
}

export function isFinished(session: QuizSession): boolean {
  return session.cursor >= session.items.length;
}

export interface TopicScore {
  topic: Topic;
  correct: number;
  total: number;
}

export interface Score {
  correct: number;
  total: number;
  /** 0..1, or 0 for an empty session. */
  ratio: number;
  byTopic: TopicScore[];
  /** Questions answered wrongly, in presentation order. */
  wrong: QuizItem[];
  elapsedMs: number;
}

export function score(session: QuizSession, now: () => number = Date.now): Score {
  const byTopic = new Map<Topic, TopicScore>();
  const wrong: QuizItem[] = [];
  let correct = 0;

  for (const item of session.items) {
    const topic = item.question.topic;
    const entry = byTopic.get(topic) ?? { topic, correct: 0, total: 0 };
    entry.total += 1;
    if (isCorrect(item)) {
      entry.correct += 1;
      correct += 1;
    } else {
      wrong.push(item);
    }
    byTopic.set(topic, entry);
  }

  const total = session.items.length;
  return {
    correct,
    total,
    ratio: total === 0 ? 0 : correct / total,
    byTopic: [...byTopic.values()],
    wrong,
    elapsedMs: (session.finishedAt ?? now()) - session.startedAt,
  };
}

/** Choices in the order this session presents them. */
export function orderedChoices(item: QuizItem) {
  const byId = new Map(item.question.choices.map((c) => [c.id, c]));
  return item.order.flatMap((id) => {
    const choice = byId.get(id);
    return choice ? [choice] : [];
  });
}
