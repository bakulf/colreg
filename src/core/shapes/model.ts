/**
 * Day signals — the shapes of Rules 24 to 30.
 *
 * Shapes are black, all-round visible and carried where they can best be seen,
 * so unlike lights they have no arcs and no aspect: what changes between
 * vessels is which shapes, in what vertical order, and on which side. That is
 * all this model records, and it is why the day scene is laid out on columns
 * rather than projected in three dimensions like the night scene.
 */

import type { Side, VesselState } from '../lights/model.ts';

export type ShapeForm =
  | 'ball'
  | 'cone-up'
  | 'cone-down'
  | 'diamond'
  | 'cylinder'
  | 'flag-a'
  | 'basket';

export interface Shape {
  form: ShapeForm;
  /**
   * -1 port side, 0 centreline, +1 starboard side. FORWARD is a separate
   * signal in the fore part of the vessel, such as the anchor ball a vessel
   * restricted in her ability to manoeuvre adds when she anchors.
   */
  column: number;
  /** 0 is lowest in its column. */
  row: number;
}

export const FORWARD = -2;

function column(forms: readonly ShapeForm[], col = 0): Shape[] {
  // Listed top first, to read the way the Rules describe them.
  const n = forms.length;
  return forms.map((form, i) => ({ form, column: col, row: n - 1 - i }));
}

function sideColumn(side: Side): number {
  return side === 'starboard' ? 1 : -1;
}

/** Two cones with their apexes together, Rule 26(b)(i). */
const FISHING_CONES: readonly ShapeForm[] = ['cone-down', 'cone-up'];

export function shapesFor(v: VesselState): Shape[] {
  const towOver200 = (v.towLengthM ?? 0) > 200;

  switch (v.kind) {
    // No day signal at all: her hull and rig are the only clue.
    case 'power':
    case 'power-small':
    case 'power-tiny':
    case 'hovercraft':
    case 'wig':
    case 'sailing':
    case 'torch':
    case 'pushing':
    case 'composite':
    case 'pushed-ahead':
    case 'towed-alongside':
      return [];

    case 'motorsailing':
      // Rule 25(e): a conical shape, apex downwards, forward where best seen.
      return column(['cone-down']);

    case 'towing':
      // Rule 24(a)(v): a diamond, but only when the tow exceeds 200 metres.
      return towOver200 ? column(['diamond']) : [];

    case 'towed':
      // Rule 24(e)(ii): the same diamond, on the tow.
      return towOver200 ? column(['diamond']) : [];

    case 'submerged-tow':
      // Rule 24(g)(iv): a diamond at or near the aftermost extremity.
      return column(['diamond']);

    case 'trawler':
    case 'fishing': {
      // Rule 26(c)(i): a vessel of less than 20 metres may exhibit a basket
      // instead of the two cones. Rare now, still in the Rules, still asked.
      if (v.lengthM < 20 && v.basket) return column(['basket']);
      const out = column(FISHING_CONES);
      if (v.kind === 'fishing' && v.gearSide) {
        // Rule 26(c)(ii): a cone apex upwards in the direction of the gear.
        out.push({ form: 'cone-up', column: sideColumn(v.gearSide), row: 0 });
      }
      return out;
    }

    case 'nuc':
      // Rule 27(a)(ii): two balls.
      return column(['ball', 'ball']);

    case 'ram': {
      // Rule 27(b)(ii): ball, diamond, ball — the shapes mirror the lights,
      // with the diamond where the white light sits. Rule 27(b)(iv): at
      // anchor, the anchor ball as well.
      const out = column(['ball', 'diamond', 'ball']);
      if (v.atAnchor) out.push({ form: 'ball', column: FORWARD, row: 0 });
      return out;
    }

    case 'restricted-towing': {
      const out = column(['ball', 'diamond', 'ball']);
      if (towOver200) out.push({ form: 'diamond', column: 1, row: 0 });
      return out;
    }

    case 'dredger': {
      // Rule 27(d)(ii) and (iii): two balls on the obstructed side, two
      // diamonds on the side a vessel may pass.
      const obstruction = v.obstructionSide ?? 'port';
      const clear: Side = obstruction === 'port' ? 'starboard' : 'port';
      return [
        ...column(['ball', 'diamond', 'ball']),
        ...column(['ball', 'ball'], sideColumn(obstruction)),
        ...column(['diamond', 'diamond'], sideColumn(clear)),
      ];
    }

    case 'diving':
      // Rule 27(e)(ii): a rigid replica of the International Code flag A, not
      // less than one metre in height.
      return column(['flag-a']);

    case 'mineclearance':
      // Rule 27(f): three balls, one at the masthead and one at each end of
      // the fore yard.
      return [
        { form: 'ball', column: 0, row: 1 },
        { form: 'ball', column: -1, row: 0 },
        { form: 'ball', column: 1, row: 0 },
      ];

    case 'cbd':
      // Rule 28: a cylinder.
      return column(['cylinder']);

    case 'pilot':
      // Rule 29 gives a pilot vessel no day signal of her own; at anchor she
      // shows the anchor ball like anyone else.
      return v.atAnchor ? column(['ball']) : [];

    case 'anchored':
      // Rule 30(a)(i): one ball in the fore part.
      return column(['ball']);

    case 'aground':
      // Rule 30(d)(i): three balls. Note the asymmetry with the lights, which
      // are two reds — there is no logic to recover it from, it has to be known.
      return column(['ball', 'ball', 'ball']);
  }
}

export function hasDaySignal(v: VesselState): boolean {
  return shapesFor(v).length > 0;
}

/** A fingerprint of the day picture, used to keep distractors distinguishable. */
export function shapeSignature(v: VesselState): string {
  return shapesFor(v)
    .map((s) => `${s.form}@${s.column},${s.row}`)
    .sort()
    .join('|');
}

/**
 * What she is, at the grain her day signal can actually resolve.
 *
 * Shapes carry far less than lights. They do not show her length, they do not
 * show whether she is making way, and every vessel engaged in fishing shows
 * the same two cones whether she is trawling or not. Describing a day scene
 * with the night wording would produce an answer naming five near-identical
 * vessels, which is unreadable and implies distinctions the picture cannot
 * support.
 */
export function describeVesselByDay(v: VesselState): string {
  switch (v.kind) {
    case 'motorsailing':
      return 'A vessel proceeding under sail and power together';
    case 'towing':
      return 'A vessel towing astern, the tow exceeding 200 metres';
    case 'towed':
      return 'A vessel being towed, the tow exceeding 200 metres';
    case 'submerged-tow':
      return 'An inconspicuous, partly submerged vessel or object being towed';
    case 'trawler':
      return 'A vessel engaged in fishing';
    case 'fishing':
      if (v.basket) return 'A vessel engaged in fishing, of less than 20 metres';
      return v.gearSide
        ? 'A vessel engaged in fishing, with gear extending more than 150 metres'
        : 'A vessel engaged in fishing';
    case 'nuc':
      return 'A vessel not under command';
    case 'ram':
      return v.atAnchor
        ? 'A vessel restricted in her ability to manoeuvre, at anchor'
        : 'A vessel restricted in her ability to manoeuvre';
    case 'restricted-towing':
      return (v.towLengthM ?? 0) > 200
        ? 'A vessel engaged in a towing operation which severely restricts her ability to deviate, the tow exceeding 200 metres'
        : 'A vessel engaged in a towing operation which severely restricts her ability to deviate';
    case 'dredger':
      return 'A vessel engaged in dredging or underwater operations, with an obstruction on one side';
    case 'diving':
      return 'A small vessel engaged in diving operations';
    case 'mineclearance':
      return 'A vessel engaged in mine clearance operations';
    case 'cbd':
      return 'A vessel constrained by her draught';
    case 'pilot':
    case 'anchored':
      return 'A vessel at anchor';
    case 'aground':
      return 'A vessel aground';
    default:
      return 'A vessel showing no day signal';
  }
}

export function describeShapes(v: VesselState): string {
  const forms = shapesFor(v);
  if (forms.length === 0) return 'no day signal';

  switch (v.kind) {
    case 'motorsailing':
      return 'a conical shape, apex downwards, forward where it can best be seen';
    case 'towing':
    case 'towed':
      return 'a diamond shape, shown by both the towing vessel and the tow when the length of tow exceeds 200 metres';
    case 'submerged-tow':
      return 'a diamond shape at or near the aftermost extremity of the tow';
    case 'trawler':
      return 'two cones with their apexes together in a vertical line';
    case 'fishing':
      if (v.basket && v.lengthM < 20) {
        return 'a basket, which Rule 26(c)(i) allows a vessel of less than 20 metres to show instead of the two cones';
      }
      return v.gearSide
        ? 'two cones with their apexes together, and a cone apex upwards in the direction of the gear'
        : 'two cones with their apexes together in a vertical line';
    case 'nuc':
      return 'two balls in a vertical line';
    case 'ram':
      return v.atAnchor
        ? 'three shapes in a vertical line, ball, diamond, ball, and in addition the anchor ball forward'
        : 'three shapes in a vertical line: ball, diamond, ball';
    case 'restricted-towing':
      return 'ball, diamond, ball, together with the diamond of Rule 24 when the tow exceeds 200 metres';
    case 'dredger':
      return v.atAnchor
        ? 'ball, diamond, ball, plus two balls on the side where the obstruction is and two diamonds on the side a vessel may pass — shown instead of the anchor ball'
        : 'ball, diamond, ball, plus two balls on the side where the obstruction is and two diamonds on the side a vessel may pass';
    case 'diving':
      return 'a rigid replica of the International Code flag A, not less than one metre in height';
    case 'mineclearance':
      return 'three balls, one at the masthead and one at each end of the fore yard';
    case 'cbd':
      return 'a cylinder';
    case 'pilot':
      return 'the anchor ball, a pilot vessel having no day signal of her own';
    case 'anchored':
      return 'one ball in the fore part of the vessel';
    case 'aground':
      return 'three balls in a vertical line';
    default:
      return 'no day signal';
  }
}

/**
 * Where the Rules give several different vessels the same day signal.
 *
 * By day the shapes are far coarser than the lights: every fishing vessel
 * shows the same two cones, and both ends of a long tow show the same diamond.
 * Students who learn the shapes as a lookup table are surprised by this, so
 * the drill says it out loud.
 */
export function shapeAmbiguityNote(v: VesselState): string | undefined {
  switch (v.kind) {
    case 'trawler':
    case 'fishing':
      return v.gearSide
        ? undefined
        : 'Every vessel engaged in fishing shows these same two cones, trawling or not. At night the lights separate them — green over white for trawling, red over white for everything else — but by day they do not.';
    case 'towing':
    case 'towed':
      return 'The same diamond is shown by the towing vessel and by the tow, and only when the length of tow exceeds 200 metres. A shorter tow carries no day signal at all, which is why a towline is so easily missed by day.';
    case 'submerged-tow':
      return 'The diamond here is the same shape a long tow shows under Rule 24(a)(v). What marks this one out is where it is: at the aftermost extremity of an object you may not be able to see at all.';
    case 'anchored':
    case 'pilot':
      return 'A single ball forward is simply "at anchor". A pilot vessel has no day signal of her own under Rule 29, so at anchor she shows the same ball as anyone else.';
    default:
      return undefined;
  }
}

export function shapeRuleRefs(v: VesselState): string[] {
  switch (v.kind) {
    case 'motorsailing':
      return ['Rule 25(e)'];
    case 'towing':
      return ['Rule 24(a)(v)'];
    case 'towed':
      return ['Rule 24(e)(ii)'];
    case 'submerged-tow':
      return ['Rule 24(g)(iv)'];
    case 'trawler':
      return ['Rule 26(b)(i)'];
    case 'fishing':
      if (v.basket) return ['Rule 26(c)(i)'];
      return v.gearSide ? ['Rule 26(c)(i)', 'Rule 26(c)(ii)'] : ['Rule 26(c)(i)'];
    case 'nuc':
      return ['Rule 27(a)(ii)'];
    case 'ram':
      return v.atAnchor ? ['Rule 27(b)(ii)', 'Rule 27(b)(iv)'] : ['Rule 27(b)(ii)'];
    case 'restricted-towing':
      return ['Rule 27(c)', 'Rule 24(a)(v)'];
    case 'dredger':
      return v.atAnchor ? ['Rule 27(d)(iii)'] : ['Rule 27(d)'];
    case 'diving':
      return ['Rule 27(e)(ii)'];
    case 'mineclearance':
      return ['Rule 27(f)'];
    case 'cbd':
      return ['Rule 28'];
    case 'pilot':
      return ['Rule 30(a)'];
    case 'anchored':
      return ['Rule 30(a)(i)'];
    case 'aground':
      return ['Rule 30(d)(i)'];
    default:
      return ['Rule 20'];
  }
}

export function shapeConceptFor(v: VesselState): string {
  switch (v.kind) {
    case 'fishing':
      if (v.basket) return 'shapes:fishing-basket';
      return v.gearSide ? 'shapes:fishing-outlying-gear' : 'shapes:fishing';
    case 'towing':
    case 'towed':
      return 'shapes:tow-diamond';
    case 'anchored':
    case 'pilot':
      return 'shapes:anchor-ball';
    case 'ram':
      return v.atAnchor ? 'shapes:ram-anchored' : 'shapes:ram';
    case 'restricted-towing':
      return (v.towLengthM ?? 0) > 200 ? 'shapes:restricted-towing' : 'shapes:restricted-towing-under-200';
    default:
      return `shapes:${v.kind}`;
  }
}

// --- tows by day ---------------------------------------------------------------

/**
 * A tow is drawn whole by day: the towing vessel ahead, the tow astern, the
 * towline between. The shapes of Rule 24 and Rule 27(c) are split between the
 * two — both carry the diamond of a long tow, a partly submerged tow carries
 * its own at its after end, and only the towing vessel carries ball, diamond,
 * ball — so neither half means much without the other.
 */
export interface DayTow {
  tug: VesselState;
  tow: VesselState;
}

export function dayTowFor(v: VesselState): DayTow | undefined {
  const towed = (towLengthM: number): VesselState => ({
    kind: 'towed',
    lengthM: 60,
    makingWay: true,
    towLengthM,
  });
  switch (v.kind) {
    case 'towing':
    case 'restricted-towing':
      return { tug: v, tow: towed(v.towLengthM ?? 150) };
    case 'towed':
      return {
        tug: { kind: 'towing', lengthM: 30, makingWay: true, towLengthM: v.towLengthM ?? 150 },
        tow: v,
      };
    case 'submerged-tow':
      return { tug: { kind: 'towing', lengthM: 30, makingWay: true, towLengthM: 150 }, tow: v };
    default:
      return undefined;
  }
}

/** The day picture's fingerprint, a tow's two halves included. */
export function daySignature(v: VesselState): string {
  const t = dayTowFor(v);
  return t ? `tow:${shapeSignature(t.tug)}/${shapeSignature(t.tow)}` : shapeSignature(v);
}

/** What the whole tow is, as an option in a day drill. */
export function describeTowByDay(v: VesselState): string {
  const long = (v.towLengthM ?? 0) > 200;
  switch (v.kind) {
    case 'submerged-tow':
      return 'A vessel towing an inconspicuous, partly submerged vessel or object';
    case 'restricted-towing':
      return long
        ? 'A towing operation which severely restricts the towing vessel’s ability to deviate, the tow exceeding 200 metres'
        : 'A towing operation which severely restricts the towing vessel’s ability to deviate, the tow 200 metres or less';
    default:
      return long
        ? 'A vessel towing astern, the tow exceeding 200 metres'
        : 'A vessel towing astern, the tow 200 metres or less';
  }
}

/** Which shapes each half of the tow carries, and why. */
export function explainTowByDay(v: VesselState): string {
  const long = (v.towLengthM ?? 0) > 200;
  switch (v.kind) {
    case 'submerged-tow':
      return 'The diamond is on the tow, at or near her aftermost extremity: Rule 24(g)(iv). The towing vessel shows nothing because this tow is not over 200 metres; if it were, she would show a diamond under Rule 24(a)(v) and the tow a second one, as far forward as practicable.';
    case 'restricted-towing':
      return long
        ? 'The towing vessel shows ball, diamond, ball — Rule 27(c) adds the shapes of Rule 27(b)(ii) to her towing shapes — and beside them the diamond of Rule 24(a)(v), because the tow exceeds 200 metres. The tow shows her own diamond under Rule 24(e)(iii).'
        : 'The towing vessel shows ball, diamond, ball: Rule 27(c) adds the shapes of Rule 27(b)(ii) to her towing shapes, and Rule 24(a) gives none for a tow of 200 metres or less. Without the tow in sight she would look like any vessel restricted in her ability to manoeuvre. The tow shows nothing.';
    default:
      return long
        ? 'Both the towing vessel and the tow show a diamond where it can best be seen: Rule 24(a)(v) and Rule 24(e)(iii), and only when the length of tow exceeds 200 metres.'
        : 'Neither shows anything: Rule 24 gives a diamond only when the length of tow exceeds 200 metres. A short tow has no day signal at all, which is why a towline is so easily missed by day.';
  }
}
