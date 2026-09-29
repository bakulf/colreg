import type { Question, QuestionSource, Rng } from '../types.ts';
import { pick, shuffle } from '../rng.ts';
import type { VesselState } from '../lights/model.ts';
import { VESSEL_POOL } from '../vessels.ts';
import { joinAlternatives } from '../text.ts';
import type { DayTow } from './model.ts';
import {
  dayTowFor,
  daySignature,
  describeShapes,
  describeTowByDay,
  explainTowByDay,
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

/**
 * Every tow the day drills can show, towing vessel and tow together. The
 * short tow shows no shapes at all, so it is not drilled itself, but it is a
 * real picture and a fair wrong answer.
 */
const DAY_TOWS: readonly VesselState[] = [
  { kind: 'towing', lengthM: 30, makingWay: true, towLengthM: 260 },
  { kind: 'towing', lengthM: 30, makingWay: true, towLengthM: 90 },
  { kind: 'submerged-tow', lengthM: 80, makingWay: true },
  { kind: 'restricted-towing', lengthM: 40, makingWay: true, towLengthM: 250 },
  { kind: 'restricted-towing', lengthM: 40, makingWay: true, towLengthM: 150 },
];

/** Single vessels, whose picture is one set of shapes. */
const SINGLE_BY_DAY = DAY_POOL.filter((v) => !dayTowFor(v));

/** Every vessel showing this arrangement of shapes, the drill's own first. */
export function sharedShapeGroup(vessel: VesselState): VesselState[] {
  const sig = shapeSignature(vessel);
  const own = describeVesselByDay(vessel);
  const seen = new Set<string>();
  const members: VesselState[] = [];

  for (const c of SINGLE_BY_DAY) {
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

  const candidates = SINGLE_BY_DAY.filter((c) => {
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

/** A tow by day: the whole tow is in the picture, and the question is which. */
function composeTowDrill(vessel: VesselState, rng: Rng): ShapeDrill {
  const sig = daySignature(vessel);
  const seen = new Set([sig]);
  const others = DAY_TOWS.filter((c) => {
    const s = daySignature(c);
    if (seen.has(s)) return false;
    seen.add(s);
    return true;
  });
  const distractors = shuffle(others, rng).slice(0, 3);
  const tow = dayTowFor(vessel) as DayTow;
  const texts = [describeTowByDay(vessel), ...distractors.map(describeTowByDay)];

  const question: Question = {
    id: `shp-gen-${shapeConceptFor(vessel)}`,
    topic: 'colreg-c',
    concept: shapeConceptFor(vessel),
    prompt: 'Daylight, good visibility. A vessel towing, with her tow astern. What kind of tow is it?',
    choices: texts.map((text, i) => ({ id: String.fromCharCode(97 + i), text })),
    correct: 'a',
    ruleRefs: [...new Set([tow.tug, tow.tow].flatMap(shapeRuleRefs))],
    explanation: explainTowByDay(vessel),
    difficulty: 3,
    scene: { type: 'shapes', vessel },
  };
  return { question, vessel, group: [vessel], distractors };
}

export function composeShapeDrill(vessel: VesselState, rng: Rng): ShapeDrill {
  if (dayTowFor(vessel)) return composeTowDrill(vessel, rng);
  const group = sharedShapeGroup(vessel);
  const distractors = distractorsFor(group, rng);
  const texts = [
    joinAlternatives(group.map(describeVesselByDay)),
    ...distractors.map(describeVesselByDay),
  ];

  const question: Question = {
    id: `shp-gen-${shapeConceptFor(vessel)}`,
    topic: 'colreg-c',
    concept: shapeConceptFor(vessel),
    prompt: 'Daylight, good visibility. What are you looking at?',
    choices: texts.map((text, i) => ({ id: String.fromCharCode(97 + i), text })),
    correct: 'a',
    ruleRefs: [...new Set(group.flatMap(shapeRuleRefs))],
    explanation: [
      `She is showing ${describeShapes(vessel)}.`,
      shapeAmbiguityNote(vessel),
      vessel.kind === 'ram' && !vessel.atAnchor
        ? 'A vessel engaged in a towing operation which severely restricts her ability to deviate shows the same when her tow is 200 metres or less: Rule 27(c) gives her ball, diamond, ball on top of the Rule 24(a) shapes, and Rule 24(a) has none for a short tow. Only the tow astern of her tells them apart.'
        : undefined,
    ]
      .filter(Boolean)
      .join(' '),
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
    topic: 'colreg-c' as const,
    concept,
    difficulty: 2 as const,
    generated: true,
    generate: (rng: Rng) => composeShapeDrill(pick(variants, rng), rng).question,
  }));
}
