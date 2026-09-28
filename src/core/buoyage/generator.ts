import type { Question, QuestionSource, Rng } from '../types.ts';
import { shuffle } from '../rng.ts';
import { topicForMark } from '../topics.ts';
import type { MarkKind } from './model.ts';
import {
  ALL_MARKS,
  conceptFor,
  describeAction,
  describeBody,
  describeMark,
  describeTopmark,
  markAt,
} from './model.ts';

/**
 * Buoyage drills, by day and by night.
 *
 * The night drill is the one that earns the module. A chart says VQ(6)+LFl.10s
 * and a book says "six very quick flashes and a long one"; neither teaches the
 * rhythm. Watching it flash does, and counting six against nine under time
 * pressure is exactly the skill.
 *
 * No two marks in Region A share a body or a character, so unlike Part C there
 * is no shared-answer problem here — every picture has exactly one mark.
 */

export type BuoyMode = 'day' | 'night';

function distractorsFor(kind: MarkKind, mode: BuoyMode, rng: Rng): MarkKind[] {
  const others = ALL_MARKS.map((m) => m.kind).filter((k) => k !== kind);

  // Prefer the marks a student actually confuses: by day the other cardinals
  // and anything with a similar topmark; by night anything with the same
  // colour of light or a nearby flash count.
  const target = markAt(kind);
  const ranked = others
    .map((k) => {
      const m = markAt(k);
      let score = 0;
      if (mode === 'day') {
        if (m.topmark === target.topmark) score += 3;
        if (m.shape === target.shape) score += 2;
        if (m.body.colours.some((c) => target.body.colours.includes(c))) score += 1;
        if (k.startsWith('cardinal') && kind.startsWith('cardinal')) score += 3;
      } else {
        const lit = (x: typeof m) => x.light.segments.filter((s) => s.colour).length;
        if (m.light.segments[0]?.colour === target.light.segments[0]?.colour) score += 3;
        score += 3 - Math.min(3, Math.abs(lit(m) - lit(target)));
        if (k.startsWith('cardinal') && kind.startsWith('cardinal')) score += 3;
      }
      return { k, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((e) => e.k);

  return shuffle(ranked, rng).slice(0, 3);
}

export interface BuoyDrill {
  question: Question;
  kind: MarkKind;
  mode: BuoyMode;
  distractors: MarkKind[];
}

export function composeBuoyDrill(kind: MarkKind, mode: BuoyMode, rng: Rng): BuoyDrill {
  const mark = markAt(kind);
  const distractors = distractorsFor(kind, mode, rng);
  const texts = [describeMark(kind), ...distractors.map(describeMark)];

  const question: Question = {
    id: `buo-gen-${mode}-${kind}`,
    topic: topicForMark(kind),
    concept: conceptFor(kind, mode),
    prompt:
      mode === 'night'
        ? 'Night. You can see nothing of the buoy but its light. Watch a full cycle — some run to ten seconds — then say what it is.'
        : 'Daylight. What mark is this?',
    choices: texts.map((text, i) => ({ id: String.fromCharCode(97 + i), text })),
    correct: 'a',
    ruleRefs: ['IALA Region A'],
    explanation:
      (mode === 'night'
        ? `${mark.light.label} — ${mark.light.spoken}. By day she is ${describeBody(kind)}, with ${describeTopmark(kind)}. ${describeAction(kind)}`
        : `${describeBody(kind)}, with ${describeTopmark(kind)}. Her light is ${mark.light.label}, ${mark.light.spoken}. ${describeAction(kind)}`) +
      noteFor(kind, mode),
    difficulty: mode === 'night' ? 3 : 2,
    scene: { type: 'buoy', kind, mode },
  };

  return { question, kind, mode, distractors };
}

/** The facts about a mark that the description alone does not carry. */
function noteFor(kind: MarkKind, mode: BuoyMode): string {
  if (kind.startsWith('cardinal') && mode === 'night') {
    return ' East three, south six, west nine, north continuous, as on a clock face. The long flash after the south group only stops six being miscounted as nine; it carries no meaning of its own.';
  }
  if (kind.startsWith('preferred')) {
    return ' The body tells you what to do; the band tells you where the main channel goes. The 2+1 rhythm is the giveaway: no plain lateral mark uses composite group flashing.';
  }
  if (kind === 'safe-water') {
    return ' Safe water lights are deliberately unlike anything else in the system: isophase, occulting, one long flash every ten seconds, or Morse A.';
  }
  if (kind === 'emergency-wreck') {
    return ' Blue appears nowhere else in the system, so that the mark looks wrong and stops you assuming you know what it is.';
  }
  return '';
}

export function buoyageSources(): QuestionSource[] {
  const sources: QuestionSource[] = [];
  for (const mark of ALL_MARKS) {
    for (const mode of ['day', 'night'] as const) {
      sources.push({
        id: `gen-${conceptFor(mark.kind, mode)}`,
        topic: topicForMark(mark.kind),
        concept: conceptFor(mark.kind, mode),
        difficulty: mode === 'night' ? 3 : 2,
        generated: true,
        generate: (rng: Rng) => composeBuoyDrill(mark.kind, mode, rng).question,
      });
    }
  }
  return sources;
}

/** Used by the tests to sweep every mark in both modes. */
export function allBuoyDrills(rng: Rng): BuoyDrill[] {
  return ALL_MARKS.flatMap((m) =>
    (['day', 'night'] as const).map((mode) => composeBuoyDrill(m.kind, mode, rng)),
  );
}
