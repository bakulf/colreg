import type { Question, QuestionSource, Rng } from '../types.ts';
import { pick, shuffle } from '../rng.ts';
import type { VesselState } from '../lights/model.ts';
import { VESSEL_POOL } from '../vessels.ts';
import { joinAlternatives } from '../text.ts';
import {
  describeShapes,
  describeVesselByDay,
  hasDaySignal,
  shapeAmbiguityNote,
  shapeConceptFor,
  shapeRuleRefs,
  shapeSignature,
  shapesFor,
} from './model.ts';

/**
 * Day-signal drills.
 *
 * Simpler than the night generator because shapes carry no arcs: there is no
 * aspect to choose and the picture is the same from everywhere. The guarantee
 * that matters survives unchanged — every vessel that shows this arrangement
 * appears in one combined option, and no other option may look the same.
 *
 * By day the shapes are far coarser than the lights: all fishing vessels show
 * the same two cones, and both ends of a long tow show the same diamond. So the
 * combined answer is the common case here, not the exception.
 */

const DAY_POOL: readonly VesselState[] = VESSEL_POOL.filter(hasDaySignal);

/** Every vessel showing this arrangement of shapes, the drill's own first. */
export function sharedShapeGroup(vessel: VesselState): VesselState[] {
  const sig = shapeSignature(vessel);
  const own = describeVesselByDay(vessel);
  const seen = new Set<string>();
  const members: VesselState[] = [];

  for (const c of DAY_POOL) {
    if (shapeSignature(c) !== sig) continue;
    const text = describeVesselByDay(c);
    if (seen.has(text)) continue;
    seen.add(text);
    members.push(c);
  }

  return [
    ...members.filter((m) => describeVesselByDay(m) === own),
    ...members.filter((m) => describeVesselByDay(m) !== own),
  ];
}

function distractorsFor(group: readonly VesselState[], rng: Rng): VesselState[] {
  const usedSignatures = new Set(group.map(shapeSignature));
  const usedTexts = new Set(group.map(describeVesselByDay));

  const candidates = DAY_POOL.filter((c) => {
    const sig = shapeSignature(c);
    const text = describeVesselByDay(c);
    if (usedSignatures.has(sig) || usedTexts.has(text)) return false;
    usedSignatures.add(sig);
    usedTexts.add(text);
    return true;
  });

  // Prefer arrangements with the same number of shapes: telling three balls
  // from ball-diamond-ball is the skill, telling three balls from a cylinder
  // is not.
  const target = shapesFor(group[0] as VesselState).length;
  const ranked = candidates
    .map((c) => ({ c, d: Math.abs(shapesFor(c).length - target) }))
    .sort((x, y) => x.d - y.d)
    .slice(0, 6)
    .map((e) => e.c);

  return shuffle(ranked, rng).slice(0, 3);
}

export interface ShapeDrill {
  question: Question;
  vessel: VesselState;
  group: VesselState[];
  distractors: VesselState[];
}

export function composeShapeDrill(vessel: VesselState, rng: Rng): ShapeDrill {
  const group = sharedShapeGroup(vessel);
  const distractors = distractorsFor(group, rng);
  const texts = [
    joinAlternatives(group.map(describeVesselByDay)),
    ...distractors.map(describeVesselByDay),
  ];

  const question: Question = {
    id: `shp-gen-${shapeConceptFor(vessel)}`,
    topic: 'lights',
    concept: shapeConceptFor(vessel),
    prompt: 'Daylight, good visibility. What are you looking at?',
    choices: texts.map((text, i) => ({ id: String.fromCharCode(97 + i), text })),
    correct: 'a',
    ruleRefs: [...new Set(group.flatMap(shapeRuleRefs))],
    explanation: `She is showing ${describeShapes(vessel)}.`,
    teachingNote:
      'Shapes are read the way lights are: count them, name them, then read the vertical ' +
      'order. Unlike lights they are all-round visible, so the aspect tells you nothing — ' +
      'which is exactly why the day signals carry less information than the night ones.',
    misconception: shapeAmbiguityNote(vessel),
    difficulty: group.length > 1 ? 3 : 2,
    scene: { type: 'shapes', vessel },
  };

  return { question, vessel, group, distractors };
}

export function shapeSources(): QuestionSource[] {
  const byConcept = new Map<string, VesselState[]>();
  for (const v of DAY_POOL) {
    const key = shapeConceptFor(v);
    byConcept.set(key, [...(byConcept.get(key) ?? []), v]);
  }

  return [...byConcept.entries()].map(([concept, variants]) => ({
    id: `gen-${concept}`,
    topic: 'lights' as const,
    concept,
    difficulty: 2 as const,
    generated: true,
    generate: (rng: Rng) => composeShapeDrill(pick(variants, rng), rng).question,
  }));
}
