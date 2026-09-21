import type { Question, QuestionSource, Rng } from '../types.ts';
import { shuffle } from '../rng.ts';
import type { Signal } from './model.ts';
import { ALL_SIGNALS, sameSound } from './model.ts';
import { joinAlternatives } from '../text.ts';

/**
 * Signal drills.
 *
 * Shown as a timeline of blasts at their true lengths rather than as the words
 * "one prolonged, two short", because the words are what the student already
 * has and cannot yet convert into a sound. Audio comes later; the timeline
 * already carries the thing that matters, which is that a prolonged blast is
 * five times a short one and nothing like the two-second toot most people
 * imagine.
 *
 * Two signals in the Rules are acoustically identical and mean different
 * things — one prolonged blast is both "I am approaching a blind bend" under
 * Rule 34(e) and "a power-driven vessel making way" under Rule 35(a). As with
 * the lights, they are collected into one answer rather than one of them being
 * quietly dropped.
 */

/** Every signal that sounds exactly like this one, its own first. */
export function sharedSoundGroup(signal: Signal): Signal[] {
  const members = ALL_SIGNALS.filter((s) => sameSound(s, signal));
  return [
    ...members.filter((s) => s.id === signal.id),
    ...members.filter((s) => s.id !== signal.id),
  ];
}

function distractorsFor(group: readonly Signal[], rng: Rng): Signal[] {
  const excluded = new Set(group.map((s) => s.id));
  const target = group[0] as Signal;

  const candidates = ALL_SIGNALS.filter((s) => {
    if (excluded.has(s.id)) return false;
    // A distractor must not sound the same as any option already offered.
    if (group.some((g) => sameSound(g, s))) return false;
    excluded.add(s.id);
    return true;
  });

  // Prefer signals of the same length and from the same part of the Rules:
  // telling one prolonged from two prolonged is the skill, telling it from
  // the aground bell is not.
  const ranked = candidates
    .map((s) => {
      let score = 3 - Math.min(3, Math.abs(s.blasts.length - target.blasts.length));
      if (s.context === target.context) score += 2;
      return { s, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((e) => e.s);

  return shuffle(ranked, rng).slice(0, 3);
}

function contextPrompt(signal: Signal): string {
  return signal.context === 'manoeuvring'
    ? 'Clear weather, and you can see her. She sounds this. What does it mean?'
    : 'Fog. You can see nothing. You hear this, repeated. What is she?';
}

function sharedNote(group: readonly Signal[]): string | undefined {
  if (group.length < 2) return undefined;
  return group[0]?.ambiguity;
}

export interface SignalDrill {
  question: Question;
  signal: Signal;
  group: Signal[];
  distractors: Signal[];
}

export function composeSignalDrill(signal: Signal, rng: Rng): SignalDrill {
  const group = sharedSoundGroup(signal);
  const distractors = distractorsFor(group, rng);
  const texts = [
    joinAlternatives(group.map((s) => s.meaning)),
    ...distractors.map((s) => s.meaning),
  ];

  const interval = signal.interval ? `, ${signal.interval}` : '';

  const question: Question = {
    id: `sig-gen-${signal.id}`,
    topic: 'sound',
    concept: `signal:${signal.id}`,
    prompt: contextPrompt(signal),
    choices: texts.map((text, i) => ({ id: String.fromCharCode(97 + i), text })),
    correct: 'a',
    ruleRefs: [...new Set(group.flatMap((s) => s.ruleRefs))],
    explanation: `That is ${signal.notation}${interval}. ${signal.meaning}.`,
    teachingNote:
      signal.teachingNote ??
      'Count the blasts before you interpret them, and count the long ones separately from the short. Rule 32 fixes the lengths: a short blast is about one second, a prolonged blast four to six. Get the student to time five seconds out loud — it is far longer than anyone expects.',
    misconception: sharedNote(group),
    difficulty: group.length > 1 ? 3 : 2,
    scene: { type: 'signal', signalId: signal.id },
  };

  return { question, signal, group, distractors };
}

export function signalSources(): QuestionSource[] {
  return ALL_SIGNALS.map((signal) => ({
    id: `gen-signal-${signal.id}`,
    topic: 'sound' as const,
    concept: `signal:${signal.id}`,
    difficulty: 2 as const,
    generated: true,
    generate: (rng: Rng) => composeSignalDrill(signal, rng).question,
  }));
}
