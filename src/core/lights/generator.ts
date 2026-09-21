import type { Question, QuestionSource, Rng } from '../types.ts';
import { pick, shuffle } from '../rng.ts';
import type { VesselState } from './model.ts';
import { describeAspect, signature, visibleLights } from './project.ts';
import {
  ambiguityNote,
  conceptFor,
  describeLights,
  describeVessel,
  ruleRefsFor,
} from './describe.ts';
import { VESSEL_POOL } from '../vessels.ts';
import { joinAlternatives } from '../text.ts';

export { VESSEL_POOL };

/**
 * Turning the light model into a supply of questions.
 *
 * Views are the eight standard relative bearings, not arbitrary ones. The set
 * of lights a vessel shows changes only at a cut-off bearing, so the horizon
 * holds four genuinely different answers to "which lights can I see", not 3600:
 * drawing her at 37.4 degrees rather than 45 teaches nothing extra and costs
 * the student a geometry problem while they are still trying to learn that
 * green over white means trawling. The bearing is named under the picture for
 * the same reason.
 *
 * The other hard part is guaranteeing the picture has one honest answer. Part C
 * gives several different vessels identical lights: a vessel under tow shows
 * exactly what a sailing vessel shows, a motorsailing yacht shows exactly what
 * a motorboat of her size shows, and from ahead a vessel pushing is
 * indistinguishable from one towing astern. Offering only one of them as the
 * answer would be answerable by elimination while teaching something false. So:
 *
 *   - vessels sharing the picture are collected into one option naming them
 *     all, and the drill says why they cannot be told apart;
 *   - bearings where the picture is shared by more than a handful of vessels —
 *     dead astern, where almost everything is a single white sternlight — are
 *     passed over in favour of bearings that discriminate;
 *   - no remaining distractor may produce the same picture as the answer.
 */

/** The eight points of the compass, taken relative to the vessel's head. */
export const CANONICAL_ASPECTS = [0, 45, 90, 135, 180, 225, 270, 315] as const;

/** Beyond this, the picture tells you too little to be worth asking about. */
const MAX_SHARED_GROUP = 3;

/**
 * Every vessel that draws exactly this picture, the drill's own vessel first.
 *
 * Compared on the projected scene rather than on the lights themselves, because
 * two lights at different places on the hull can still fall on the same point
 * of the view: seen end-on or stern-on, everything on the centreline collapses
 * into one vertical line.
 */
export function sharedGroup(vessel: VesselState, aspect: number): VesselState[] {
  const sig = signature(vessel, aspect);
  const own = describeVessel(vessel);
  const seen = new Set<string>();
  const members: VesselState[] = [];

  for (const c of VESSEL_POOL) {
    if (signature(c, aspect) !== sig) continue;
    const text = describeVessel(c);
    if (seen.has(text)) continue;
    seen.add(text);
    members.push(c);
  }

  return [
    ...members.filter((m) => describeVessel(m) === own),
    ...members.filter((m) => describeVessel(m) !== own),
  ];
}

/**
 * The standard views that make a fair question of this vessel: fewest vessels
 * sharing the picture, and among those, the ones showing more than one light.
 */
const aspectCache = new WeakMap<VesselState, number[]>();

export function fairAspects(vessel: VesselState): number[] {
  const cached = aspectCache.get(vessel);
  if (cached) return cached;

  const scored = CANONICAL_ASPECTS.map((deg) => ({
    deg,
    lit: visibleLights(vessel, deg).length,
    group: sharedGroup(vessel, deg).length,
  })).filter((s) => s.lit > 0);

  const best = Math.min(...scored.map((s) => s.group));
  const eligible = scored.filter((s) => s.group <= Math.min(best, MAX_SHARED_GROUP));
  const rich = eligible.filter((s) => s.lit >= 2);
  const result = (rich.length > 0 ? rich : eligible).map((s) => s.deg);

  aspectCache.set(vessel, result);
  return result;
}

/** How easily confused two scenes are, used to prefer instructive distractors. */
function similarity(a: VesselState, b: VesselState, aspect: number): number {
  const ca = visibleLights(a, aspect).map((l) => l.colour).sort();
  const cb = visibleLights(b, aspect).map((l) => l.colour).sort();
  const remaining = [...cb];
  let shared = 0;
  for (const colour of ca) {
    const i = remaining.indexOf(colour);
    if (i >= 0) {
      remaining.splice(i, 1);
      shared += 1;
    }
  }
  return shared * 2 - Math.abs(ca.length - cb.length);
}

function distractorsFor(
  group: readonly VesselState[],
  aspect: number,
  rng: Rng,
): VesselState[] {
  const answer = group[0] as VesselState;
  const usedSignatures = new Set(group.map((v) => signature(v, aspect)));
  const usedTexts = new Set(group.map(describeVessel));

  const candidates = VESSEL_POOL.filter((c) => {
    const sig = signature(c, aspect);
    const text = describeVessel(c);
    if (sig === '' || usedSignatures.has(sig) || usedTexts.has(text)) return false;
    usedSignatures.add(sig);
    usedTexts.add(text);
    return true;
  });

  // Take the most confusable handful, then shuffle, so the same three do not
  // come round every time this concept does.
  const ranked = candidates
    .map((c) => ({ c, score: similarity(answer, c, aspect) }))
    .sort((x, y) => y.score - x.score)
    .slice(0, 6)
    .map((e) => e.c);

  return shuffle(ranked, rng).slice(0, 3);
}

function colourTally(vessel: VesselState, aspect: number): string {
  const colours = visibleLights(vessel, aspect).map((l) => l.colour);
  return (['white', 'red', 'green', 'yellow'] as const)
    .map((c) => ({ c, n: colours.filter((x) => x === c).length }))
    .filter((e) => e.n > 0)
    .map((e) => `${e.n} ${e.c}`)
    .join(', ');
}

function sharedNote(group: readonly VesselState[]): string | undefined {
  if (group.length < 2) return undefined;
  const names = group.map((v) => describeVessel(v).replace(/^An? /, (m) => m.toLowerCase()));
  return (
    `This picture does not belong to one vessel. From this bearing ${names
      .slice(0, -1)
      .join('; ')} and ${names[names.length - 1]} show identical lights, and nothing in ` +
    'the scene separates them. What resolves it is what else is around her, how she ' +
    'moves, and by day her shapes.'
  );
}

export interface LightDrill {
  question: Question;
  vessel: VesselState;
  aspectDeg: number;
  group: VesselState[];
  distractors: VesselState[];
}

/** Builds one drill, keeping the vessels around so tests can check the picture. */
export function composeLightDrill(vessel: VesselState, rng: Rng): LightDrill {
  const aspectDeg = pick(fairAspects(vessel), rng);
  const group = sharedGroup(vessel, aspectDeg);
  const distractors = distractorsFor(group, aspectDeg, rng);
  const texts = [
    joinAlternatives(group.map(describeVessel)),
    ...distractors.map(describeVessel),
  ];

  const question: Question = {
    id: `lgt-gen-${conceptFor(vessel)}-${aspectDeg}`,
    topic: 'lights',
    concept: conceptFor(vessel),
    prompt: 'A clear night at sea. What are you looking at?',
    choices: texts.map((text, i) => ({ id: String.fromCharCode(97 + i), text })),
    correct: 'a',
    ruleRefs: [...new Set(group.flatMap(ruleRefsFor))],
    explanation:
      `${describeAspect(aspectDeg)}, so what reaches you is ${colourTally(vessel, aspectDeg)}. ` +
      `${describeVessel(vessel)} carries ${describeLights(vessel)}.`,
    teachingNote:
      'Read the picture in one order every time: count the lights, name the colours, ' +
      'then read the vertical order. Only then look at the horizontal spread, which is ' +
      'the aspect — and aspect is what tells you whether she is a problem.',
    misconception: sharedNote(group) ?? ambiguityNote(vessel),
    difficulty: group.length > 1 ? 3 : 2,
    scene: { type: 'lights', vessel, aspectDeg },
  };

  return { question, vessel, aspectDeg, group, distractors };
}

export function generateLightQuestion(vessel: VesselState, rng: Rng): Question {
  return composeLightDrill(vessel, rng).question;
}

/** One source per concept, so progress is tracked per vessel type. */
export function lightSources(): QuestionSource[] {
  const byConcept = new Map<string, VesselState[]>();
  for (const v of VESSEL_POOL) {
    const key = conceptFor(v);
    byConcept.set(key, [...(byConcept.get(key) ?? []), v]);
  }

  return [...byConcept.entries()].map(([concept, variants]) => ({
    id: `gen-${concept}`,
    topic: 'lights' as const,
    concept,
    difficulty: 2 as const,
    generated: true,
    generate: (rng: Rng) => generateLightQuestion(pick(variants, rng), rng),
  }));
}
