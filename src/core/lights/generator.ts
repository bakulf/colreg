import type { Question, QuestionSource, Rng } from '../types.ts';
import { pick, shuffle } from '../rng.ts';
import type { Light, Partner, VesselState } from './model.ts';
import { lightsFor, partnerFor } from './model.ts';
import { describeAspect, isVisible, signature, visibleLights } from './project.ts';
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
 * Whether she carries a yellow light this observer cannot see. The towing light
 * is what says "tow", so a picture of a towing vessel with it out of sight is
 * a picture of something else: the drill never shows her from there, and never
 * names her as the answer to another vessel's picture from there.
 */
export function hidesYellow(vessel: VesselState, aspect: number): boolean {
  return lightsFor(vessel).some((l) => l.colour === 'yellow' && !isVisible(l, aspect));
}

/**
 * Whether her outlying-gear light, Rule 26(c)(ii), falls in line with the red
 * over white from here. From abeam it does: it sits on her side towards or away
 * from you and shows as a third light under the other two, when the whole point
 * of it is to stand off to one side, towards the gear.
 */
export function hidesGearLight(vessel: VesselState, aspect: number): boolean {
  if (vessel.kind !== 'fishing' || !vessel.gearSide) return false;
  const [top, , gear] = visibleLights(vessel, aspect);
  return !top || !gear || Math.abs(gear.x - top.x) < 0.3;
}

/**
 * Whether a tow and the vessel ahead or astern of her are one behind the other
 * from here. End-on their lights pile into one tangle that no one could read.
 */
function inLine(vessel: VesselState, aspect: number): boolean {
  const relation = partnerFor(vessel)?.relation;
  return (relation === 'towed-by' || relation === 'pushed-by') && aspect % 180 === 0;
}

/**
 * Every vessel that draws exactly this picture, the drill's own vessel first,
 * leaving out those whose yellow light is hidden from here.
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
    if (text !== own && hidesYellow(c, aspect)) continue;
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
 * Seen from abaft the beam, where her yellow light shows, every vessel towing
 * astern is the same yellow over white: the masthead lights that give her
 * length and the length of her tow are out of sight. That picture has one
 * honest answer, "towing astern", so the group is asked about as one vessel.
 */
export const ANY_TOW: Partial<Record<VesselState['kind'], string>> = {
  towing: 'A power-driven vessel towing astern, of any length and with any length of tow',
  'restricted-towing':
    'A vessel engaged in a towing operation which severely restricts her ability to deviate, with any length of tow',
};

export function isAnyTow(group: readonly VesselState[]): boolean {
  const kind = group[0]?.kind;
  return group.length > 1 && kind !== undefined && kind in ANY_TOW && group.every((v) => v.kind === kind);
}

function answerText(group: readonly VesselState[]): string {
  return isAnyTow(group)
    ? (ANY_TOW[(group[0] as VesselState).kind] as string)
    : joinAlternatives(group.map(describeVessel));
}

/** How many different answers the picture fits. */
export function answerCount(group: readonly VesselState[]): number {
  return isAnyTow(group) ? 1 : group.length;
}

/**
 * The standard views that make a fair question of this vessel: fewest vessels
 * sharing the picture, and among those, the ones showing more than one light.
 */
const aspectCache = new WeakMap<VesselState, number[]>();

export function fairAspects(vessel: VesselState): number[] {
  const cached = aspectCache.get(vessel);
  if (cached) return cached;

  const scored = CANONICAL_ASPECTS.filter(
    (deg) => !hidesYellow(vessel, deg) && !hidesGearLight(vessel, deg) && !inLine(vessel, deg),
  ).map((deg) => ({
    deg,
    lit: visibleLights(vessel, deg).length,
    own: ownVisible(vessel, deg).length,
    group: answerCount(sharedGroup(vessel, deg)),
  })).filter((s) => s.own > 0);

  const best = Math.min(...scored.map((s) => s.group));
  const eligible = scored.filter((s) => s.group <= Math.min(best, MAX_SHARED_GROUP));
  const rich = eligible.filter((s) => s.lit >= 2);
  const result = (rich.length > 0 ? rich : eligible).map((s) => s.deg);

  aspectCache.set(vessel, result);
  return result;
}

/** Her own lights that this observer sees, leaving out a tow's partner. */
function ownVisible(vessel: VesselState, aspect: number): Light[] {
  return lightsFor(vessel).filter((l) => isVisible(l, aspect));
}

/** How easily confused two vessels' own lights are, to prefer instructive distractors. */
function similarity(a: VesselState, b: VesselState, aspect: number): number {
  const ca = ownVisible(a, aspect).map((l) => l.colour).sort();
  const cb = ownVisible(b, aspect).map((l) => l.colour).sort();
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

  // A tow is asked about with her tug in the picture, so the question is
  // which tow; the other options are the other tows.
  const isTow = partnerFor(answer) !== undefined;
  const candidates = VESSEL_POOL.filter((c) => {
    if ((partnerFor(c) !== undefined) !== isTow) return false;
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
  const colours = ownVisible(vessel, aspect).map((l) => l.colour);
  return (['white', 'red', 'green', 'yellow'] as const)
    .map((c) => ({ c, n: colours.filter((x) => x === c).length }))
    .filter((e) => e.n > 0)
    .map((e) => `${e.n} ${e.c}`)
    .join(', ');
}

function lightName(l: Light): string {
  switch (l.kind) {
    case 'masthead':
      return 'a masthead light';
    case 'side-port':
      return 'the red sidelight';
    case 'side-stbd':
      return 'the green sidelight';
    case 'stern':
      return 'the sternlight';
    case 'towing':
      return 'the yellow towing light';
    case 'all-round':
      return `an all-round ${l.colour} light`;
  }
}

/** Where a light can be seen from, and so from where it would settle the question. */
function arcText(l: Light): string {
  switch (l.kind) {
    case 'masthead':
      return 'shines from ahead to 22.5° abaft either beam';
    case 'side-port':
      return 'shines on her port side only, from ahead to 22.5° abaft the beam';
    case 'side-stbd':
      return 'shines on her starboard side only, from ahead to 22.5° abaft the beam';
    case 'stern':
    case 'towing':
      return 'shines only over her stern, 67.5° either side of dead astern: from abaft her beam you would see it and could tell them apart';
    case 'all-round':
      return 'shines all round';
  }
}

function lightKey(l: Light): string {
  return `${l.colour}:${l.kind}:${l.u}:${l.v}:${l.w}`;
}

/** The lights `a` carries that `b` does not. */
function extraLights(a: VesselState, b: VesselState): Light[] {
  const theirs = new Set(lightsFor(b).map(lightKey));
  return lightsFor(a).filter((l) => !theirs.has(lightKey(l)));
}

function lowerName(v: VesselState): string {
  return describeVessel(v).replace(/^An? /, (m) => m.toLowerCase());
}

/** A short handle for a vessel, for sentences that have to name two of them. */
function shortName(v: VesselState): string {
  switch (v.kind) {
    case 'towing':
      return 'a vessel towing astern';
    case 'pushing':
      return 'a vessel pushing ahead or towing alongside';
    case 'pushed-ahead':
      return 'a vessel pushed ahead';
    case 'towed-alongside':
      return 'a vessel towed alongside';
    default:
      return lowerName(v);
  }
}

/** The lights she carries that this observer cannot see, as a clause. */
function hiddenClause(vessel: VesselState, aspect: number): string {
  const hidden = [...new Set(lightsFor(vessel).filter((l) => !isVisible(l, aspect)).map(lightName))];
  if (hidden.length === 0) return '';
  return `; from here ${joinAnd(hidden)} ${hidden.length === 1 ? 'is' : 'are'} out of sight`;
}

function joinAnd(items: readonly string[]): string {
  return items.length < 2
    ? (items[0] ?? '')
    : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

/**
 * Vessels that would draw this picture but for a yellow light hidden from
 * here, which is why they are not among the options.
 */
function hiddenTowNote(vessel: VesselState, aspect: number): string | undefined {
  const sig = signature(vessel, aspect);
  const names = new Set(
    VESSEL_POOL.filter((c) => signature(c, aspect) === sig && hidesYellow(c, aspect)).map(shortName),
  );
  if (names.size === 0) return undefined;
  return `From this bearing ${joinAnd([...names])} would look the same, but her yellow towing light shines only over her stern, 67.5° either side of dead astern. Seen from abaft her beam, yellow over the white sternlight is what marks a tow.`;
}

/**
 * Why the picture fits more than one vessel: either their lights are the same
 * from every direction, or the one light that differs cannot be seen from here.
 */
function sharedNote(group: readonly VesselState[], aspect: number): string | undefined {
  if (group.length < 2) return undefined;
  const [vessel, ...others] = group as [VesselState, ...VesselState[]];
  const intro = `From here ${joinAnd(others.map(lowerName))} ${
    others.length === 1 ? 'shows' : 'show'
  } exactly the same lights, so the answer names ${group.length === 2 ? 'both' : 'all of them'}.`;

  const differences = others.flatMap((other) =>
    [
      { has: vessel, lacks: other, lights: extraLights(vessel, other) },
      { has: other, lacks: vessel, lights: extraLights(other, vessel) },
    ].filter((d) => d.lights.length > 0),
  );

  if (differences.length === 0) {
    return `${intro} Their lights are the same from every direction, so by night nothing tells them apart.`;
  }

  const explained = differences.map(({ has, lacks, lights }) => {
    const names = joinAnd([...new Set(lights.map(lightName))]);
    const hidden = lights.every((l) => !isVisible(l, aspect));
    const light = lights[0] as Light;
    return hidden
      ? `The difference is ${names}: ${shortName(has)} carries it, ${shortName(lacks)} does not. It ${arcText(light)}.`
      : `The difference is ${names}, which ${shortName(has)} carries and ${shortName(lacks)} does not, but from here it falls in line with her other lights and cannot be picked out.`;
  });
  return `${intro} ${explained.join(' ')}`;
}

/** Who is moving the tow, and what her lights are. */
function partnerSentence(p: Partner): string {
  const lights = describeLights(p.vessel);
  switch (p.relation) {
    case 'towed-by':
      return `The other lights, ahead of her, are the vessel towing her: ${lights}.`;
    case 'pushed-by':
      return `The other lights, astern of her, are the vessel pushing her: ${lights}.`;
    case 'alongside':
      return `The other lights, alongside her, are the vessel towing her: ${lights}.`;
  }
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
  const partner = partnerFor(vessel);
  const texts = [
    answerText(group),
    ...distractors.map(describeVessel),
  ];

  const question: Question = {
    id: `lgt-gen-${conceptFor(vessel)}-${aspectDeg}`,
    topic: 'colreg-c',
    concept: conceptFor(vessel),
    prompt: partner
      ? 'A clear night at sea. One vessel here is towing or pushing the other. What is the vessel being towed or pushed?'
      : 'A clear night at sea. What are you looking at?',
    choices: texts.map((text, i) => ({ id: String.fromCharCode(97 + i), text })),
    correct: 'a',
    ruleRefs: [...new Set(group.flatMap(ruleRefsFor))],
    explanation: [
      `${describeAspect(aspectDeg)}. ${partner ? 'Of the tow’s own lights you see' : 'You see'} ${colourTally(vessel, aspectDeg)}.`,
      `${describeVessel(vessel)} carries ${describeLights(vessel)}${hiddenClause(vessel, aspectDeg)}.`,
      partner && partnerSentence(partner),
      isAnyTow(group)
        ? `Yellow over white says she is towing astern. ${
            vessel.kind === 'towing' ? 'How long she is and how long her tow is' : 'How long her tow is'
          } you would read from her masthead lights — two in a vertical line, or three for a tow over 200 metres — and those show only from ahead to 22.5° abaft her beam.`
        : sharedNote(group, aspectDeg),
      hiddenTowNote(vessel, aspectDeg),
      ambiguityNote(vessel),
    ]
      .filter(Boolean)
      .join(' '),
    difficulty: answerCount(group) > 1 ? 3 : 2,
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
    topic: 'colreg-c' as const,
    concept,
    difficulty: 2 as const,
    generated: true,
    generate: (rng: Rng) => generateLightQuestion(pick(variants, rng), rng),
  }));
}
