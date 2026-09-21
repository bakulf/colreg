/**
 * The lights a vessel exhibits, as data. Rules 20 to 31.
 *
 * Every light carries its position on the vessel and the arc over which Rule 21
 * says it is visible. Nothing here knows how to draw; the renderer derives the
 * picture, and because visibility is computed from the rule's own arcs the app
 * cannot draw a vessel showing a light she should not be showing.
 */

export type LightColour = 'white' | 'red' | 'green' | 'yellow';

export type LightKind =
  | 'masthead'
  | 'side-port'
  | 'side-stbd'
  | 'stern'
  | 'towing'
  | 'all-round';

export interface Light {
  colour: LightColour;
  kind: LightKind;
  /** Athwartships, starboard positive, in half-length units. */
  u: number;
  /** Fore and aft, bow positive, in half-length units. */
  v: number;
  /** Height above the waterline, in half-length units. */
  w: number;
  /** Rule 21(f): 120 flashes or more per minute. */
  flashing?: boolean;
  /** Deck illumination under Rule 30(c), drawn smaller and softer. */
  dim?: boolean;
}

/**
 * Rule 21 arcs, expressed as relative bearings from the vessel's head, measured
 * clockwise. A pair [from, to] with from > to wraps through zero.
 *
 * Masthead 225 degrees, sidelights 112.5 each, sternlight 135. The sidelight
 * and sternlight boundary at 22.5 degrees abaft the beam is the same bearing
 * that defines the overtaking sector in Rule 13 — one number, two rules.
 *
 * The sidelights are given the 2 degrees of overlap across the bow that Annex
 * I, section 9(a)(i) permits: the practical cut-off must fall between 1 and 3
 * degrees outside the prescribed sector. Without it, "both sidelights and no
 * masthead light" — the Rule 14(b) head-on picture, and the only way a sailing
 * vessel ever shows two lights — would exist at exactly one bearing and could
 * never be drawn.
 */
export const SIDELIGHT_CUTOFF_DEG = 2;

export const ARCS: Record<LightKind, readonly [number, number]> = {
  masthead: [247.5, 112.5],
  'side-port': [247.5, SIDELIGHT_CUTOFF_DEG],
  'side-stbd': [360 - SIDELIGHT_CUTOFF_DEG, 112.5],
  stern: [112.5, 247.5],
  towing: [112.5, 247.5],
  'all-round': [0, 360],
};

export function arcContains(arc: readonly [number, number], bearing: number): boolean {
  const [from, to] = arc;
  const b = ((bearing % 360) + 360) % 360;
  return from <= to ? b >= from && b <= to : b >= from || b <= to;
}

/** Bearings at which some light enters or leaves its arc. */
export const CUTOFF_BEARINGS: readonly number[] = [
  SIDELIGHT_CUTOFF_DEG,
  112.5,
  247.5,
  360 - SIDELIGHT_CUTOFF_DEG,
];

// --- where lights sit on the vessel -----------------------------------------

const MAST_FWD = { u: 0, v: 0.35, w: 0.62 };
const MAST_AFT = { u: 0, v: -0.3, w: 0.95 };
const SIDE_V = 0.28;
const SIDE_U = 0.13;
const SIDE_W = 0.26;
const STERN = { u: 0, v: -0.92, w: 0.2 };
const TOW_LIGHT = { u: 0, v: -0.92, w: 0.34 };
const STACK_U = 0;
const STACK_V = 0.12;
const STACK_STEP = 0.22;
const ANCHOR_FWD = { u: 0, v: 0.85, w: 0.6 };
const ANCHOR_AFT = { u: 0, v: -0.85, w: 0.28 };
const TRICOLOUR = { u: 0, v: 0.0, w: 1.05 };
const YARD_U = 0.45;

/** A vertical line of all-round lights, listed top first. */
function stack(colours: readonly LightColour[], base: number, v = STACK_V): Light[] {
  const n = colours.length;
  return colours.map((colour, i) => ({
    colour,
    kind: 'all-round' as const,
    u: STACK_U,
    v,
    w: base + (n - 1 - i) * STACK_STEP,
  }));
}

function sidelights(v = SIDE_V, u = SIDE_U, w = SIDE_W): Light[] {
  return [
    { colour: 'red', kind: 'side-port', u: -u, v, w },
    { colour: 'green', kind: 'side-stbd', u, v, w },
  ];
}

function sternlight(pos = STERN): Light {
  return { colour: 'white', kind: 'stern', ...pos };
}

/**
 * Rule 23(a)(ii): the second masthead light is required at 50 metres and over,
 * and expressly permitted below it. Both cases are modelled, because the
 * common inference "two masthead lights, therefore she is 50 metres or more"
 * is wrong and the drill would otherwise teach it.
 */
export function hasSecondMasthead(v: VesselState): boolean {
  return v.lengthM >= 50 || v.secondMasthead === true;
}

function mastheads(v: VesselState, aftW = MAST_AFT.w): Light[] {
  const out: Light[] = [{ colour: 'white', kind: 'masthead', ...MAST_FWD }];
  if (hasSecondMasthead(v)) {
    out.push({ colour: 'white', kind: 'masthead', u: MAST_AFT.u, v: MAST_AFT.v, w: aftW });
  }
  return out;
}

/** Rule 24(a)(i) and 24(c)(i): the vertical column that replaces a masthead light. */
function towingColumn(count: number): Light[] {
  return Array.from({ length: count }, (_, i) => ({
    colour: 'white' as const,
    kind: 'masthead' as const,
    u: MAST_FWD.u,
    v: MAST_FWD.v,
    w: MAST_FWD.w + i * 0.2,
  }));
}

function anchorLights(lengthM: number): Light[] {
  const out: Light[] = [{ colour: 'white', kind: 'all-round', ...ANCHOR_FWD }];
  if (lengthM >= 50) out.push({ colour: 'white', kind: 'all-round', ...ANCHOR_AFT });
  return out;
}

/**
 * Annex II: additional signals for fishing vessels in close proximity.
 *
 * Carried forward of and clear of the Rule 26 lights, so that both sets read
 * separately — which is the point of them. They say what she is doing with
 * her gear, not what she is, and they are addressed to other fishing vessels.
 */
function annexIILights(kind: NonNullable<VesselState['annexII']>): Light[] {
  const at = (colour: LightColour, w: number, flashing = false): Light => ({
    colour,
    kind: 'all-round',
    u: 0,
    v: 0.5,
    w,
    ...(flashing ? { flashing: true } : {}),
  });

  switch (kind) {
    case 'shooting':
      return [at('white', 0.78), at('white', 0.56)];
    case 'hauling':
      return [at('white', 0.78), at('red', 0.56)];
    case 'net-fast':
      return [at('red', 0.78), at('red', 0.56)];
    case 'purse-seine':
      // Two yellow lights flashing alternately every second, shown when she is
      // hampered by her gear.
      return [at('yellow', 0.78, true), at('yellow', 0.56, true)];
  }
}

/** Rule 30(c): working lights illuminating the decks, at 100 metres and over. */
function deckLights(): Light[] {
  return [-0.6, -0.2, 0.2, 0.6].map((v) => ({
    colour: 'white' as const,
    kind: 'all-round' as const,
    u: 0,
    v,
    w: 0.14,
    dim: true,
  }));
}

// --- vessels ----------------------------------------------------------------

export type VesselKind =
  // Rule 23
  | 'power'
  | 'power-small'
  | 'power-tiny'
  | 'hovercraft'
  | 'wig'
  // Rule 24
  | 'towing'
  | 'pushing'
  | 'towed'
  | 'composite'
  | 'pushed-ahead'
  | 'towed-alongside'
  | 'submerged-tow'
  // Rule 25
  | 'sailing'
  | 'motorsailing'
  | 'torch'
  // Rule 26
  | 'trawler'
  | 'fishing'
  // Rule 27
  | 'nuc'
  | 'ram'
  | 'restricted-towing'
  | 'dredger'
  | 'diving'
  | 'mineclearance'
  // Rules 28 to 30
  | 'cbd'
  | 'pilot'
  | 'anchored'
  | 'aground';

export type Side = 'port' | 'starboard';

export interface VesselState {
  kind: VesselKind;
  lengthM: number;
  /**
   * Relevant only where the Rules qualify the sidelights and sternlight with
   * "when making way through the water" — NUC, RAM and fishing vessels. A
   * power-driven vessel underway but stopped still shows her full Rule 23
   * lights.
   */
  makingWay: boolean;
  /** Sailing vessel under 20 metres using a combined lantern, Rule 25(b). */
  tricolour?: boolean;
  /**
   * A vessel under 50 metres exercising the option in Rule 23(a)(ii) to show
   * the second masthead light she is not obliged to carry.
   */
  secondMasthead?: boolean;
  /** Sailing vessel showing the optional red over green, Rule 25(c). */
  optionalRedGreen?: boolean;
  /** Length of tow in metres, Rule 24(a)(i). */
  towLengthM?: number;
  /** Side on which fishing gear extends more than 150 m, Rule 26(c)(ii). */
  gearSide?: Side;
  /**
   * Rule 26(d) and Annex II: the additional signals a fishing vessel shows
   * when working in close proximity to others. Optional under the Rules, and
   * meaningful only among fishing vessels.
   */
  annexII?: 'shooting' | 'hauling' | 'net-fast' | 'purse-seine';
  /**
   * Rule 26(c)(i): a fishing vessel of less than 20 metres may show a basket
   * by day instead of the two cones.
   */
  basket?: boolean;
  /** Side on which a dredger's obstruction lies, Rule 27(d). */
  obstructionSide?: Side;
  /** At anchor as well as on duty or at work: Rules 29(a)(iii), 27(d)(iv). */
  atAnchor?: boolean;
  /** Rule 30(c): decks illuminated, required at 100 metres and over. */
  illuminatedDecks?: boolean;
}

function sideSign(side: Side): number {
  return side === 'starboard' ? 1 : -1;
}

export function lightsFor(v: VesselState): Light[] {
  switch (v.kind) {
    case 'power':
      return [...mastheads(v), ...sidelights(), sternlight()];

    case 'power-small':
      // Rule 23(d): a vessel under 12 metres may show an all-round white light
      // and sidelights in lieu of the full Rule 23(a) set.
      return [
        { colour: 'white', kind: 'all-round', u: 0, v: 0.1, w: 0.7 },
        ...sidelights(),
      ];

    case 'power-tiny':
      // Rule 23(d)(ii): under 7 metres and incapable of more than 7 knots, the
      // sidelights are required only if practicable.
      return [{ colour: 'white', kind: 'all-round', u: 0, v: 0.1, w: 0.55 }];

    case 'hovercraft':
      // Rule 23(b): an air-cushion vessel in non-displacement mode adds an
      // all-round flashing yellow light.
      return [
        ...mastheads(v),
        ...sidelights(),
        sternlight(),
        { colour: 'yellow', kind: 'all-round', u: 0, v: 0.35, w: 1.12, flashing: true },
      ];

    case 'wig':
      // Rule 23(c): a WIG craft taking off, landing or flying near the surface
      // adds a high-intensity all-round flashing red light.
      return [
        ...mastheads(v),
        ...sidelights(),
        sternlight(),
        { colour: 'red', kind: 'all-round', u: 0, v: 0.35, w: 1.12, flashing: true },
      ];

    case 'sailing': {
      // Rule 25(a), or 25(b) for the combined lantern under 20 metres.
      const base =
        v.tricolour && v.lengthM < 20
          ? [
              ...sidelights(TRICOLOUR.v, SIDE_U * 0.45, TRICOLOUR.w),
              sternlight({ u: 0, v: TRICOLOUR.v, w: TRICOLOUR.w }),
            ]
          : [...sidelights(), sternlight()];
      // Rule 25(c): the optional pair may not be shown with a combined lantern.
      return v.optionalRedGreen && !v.tricolour
        ? [...stack(['red', 'green'], 1.1, 0), ...base]
        : base;
    }

    case 'motorsailing':
      // Rule 3(c): with the engine engaged she is a power-driven vessel, and
      // her lights say so. Only the Rule 25(e) cone marks her out, by day.
      return [...mastheads(v), ...sidelights(), sternlight()];

    case 'torch':
      // Rules 25(d)(i) and 25(d)(ii): a sailing vessel under 7 metres, or a
      // vessel under oars, showing a lantern or torch in time to prevent
      // collision.
      return [{ colour: 'white', kind: 'all-round', u: 0, v: 0, w: 0.22 }];

    case 'towing': {
      // Rule 24(a): two masthead lights in a vertical line, three if the tow
      // exceeds 200 metres, plus a yellow towing light above the sternlight.
      const column = towingColumn((v.towLengthM ?? 0) > 200 ? 3 : 2);
      const out = [...column, ...sidelights(), sternlight()];
      if (v.lengthM >= 50) {
        out.push({ colour: 'white', kind: 'masthead', u: MAST_AFT.u, v: MAST_AFT.v, w: 1.25 });
      }
      out.push({ colour: 'yellow', kind: 'towing', ...TOW_LIGHT });
      return out;
    }

    case 'pushing': {
      // Rule 24(c): pushing ahead or towing alongside. Two masthead lights in a
      // vertical line, sidelights and a sternlight — and no towing light, which
      // is the only thing separating her from Rule 24(a).
      const out = [...towingColumn(2), ...sidelights(), sternlight()];
      if (v.lengthM >= 50) {
        out.push({ colour: 'white', kind: 'masthead', u: MAST_AFT.u, v: MAST_AFT.v, w: 1.25 });
      }
      return out;
    }

    case 'towed':
      // Rule 24(e): the vessel or object being towed shows sidelights and a
      // sternlight, which is exactly what a sailing vessel shows.
      return [...sidelights(), sternlight()];

    case 'composite':
      // Rule 24(b): a pushing vessel and a vessel being pushed ahead rigidly
      // connected as a composite unit are lighted as one power-driven vessel.
      // Her picture is therefore a motorboat's, and nothing about the lights
      // reveals that she is two hulls.
      return [...mastheads(v), ...sidelights(), sternlight()];

    case 'pushed-ahead':
      // Rule 24(f)(i): a vessel being pushed ahead, not part of a composite
      // unit, shows sidelights at the forward end and nothing else.
      return sidelights(0.92, SIDE_U, 0.22);

    case 'towed-alongside':
      // Rule 24(f)(ii): a vessel towed alongside shows a sternlight and
      // sidelights at the forward end.
      return [...sidelights(0.92, SIDE_U, 0.22), sternlight()];

    case 'submerged-tow':
      // Rule 24(g): an inconspicuous, partly submerged object under tow shows
      // an all-round white light at or near each end, barely above the water.
      return [
        { colour: 'white', kind: 'all-round', u: 0, v: 0.95, w: 0.06 },
        { colour: 'white', kind: 'all-round', u: 0, v: -0.95, w: 0.06 },
      ];

    case 'trawler': {
      // Rule 26(b): green over white, plus a masthead light abaft of and
      // higher than the green at 50 metres and over.
      const out = stack(['green', 'white'], 0.62);
      if (v.lengthM >= 50) {
        out.push({ colour: 'white', kind: 'masthead', u: MAST_AFT.u, v: MAST_AFT.v, w: 1.06 });
      }
      if (v.annexII) out.push(...annexIILights(v.annexII));
      if (v.makingWay) out.push(...sidelights(), sternlight());
      return out;
    }

    case 'fishing': {
      // Rule 26(c): red over white for fishing other than trawling, plus an
      // all-round white in the direction of gear extending more than 150 m.
      const out = stack(['red', 'white'], 0.62);
      if (v.gearSide) {
        out.push({
          colour: 'white',
          kind: 'all-round',
          u: sideSign(v.gearSide) * 0.62,
          v: 0,
          w: 0.45,
        });
      }
      if (v.annexII) out.push(...annexIILights(v.annexII));
      if (v.makingWay) out.push(...sidelights(), sternlight());
      return out;
    }

    case 'nuc': {
      // Rule 27(a): two all-round red, sidelights and sternlight only when
      // making way.
      const out = stack(['red', 'red'], 0.8);
      if (v.makingWay) out.push(...sidelights(), sternlight());
      return out;
    }

    case 'ram':
    case 'diving': {
      // Rule 27(b): red, white, red, with masthead lights only when making way.
      // Rule 27(e)(i) gives a small diving boat the same three lights, so by
      // night she is indistinguishable from any other vessel restricted in her
      // ability to manoeuvre. The flag A replica is a day signal only.
      const out = stack(['red', 'white', 'red'], 0.8);
      if (v.makingWay) out.push(...mastheads(v), ...sidelights(), sternlight());
      return out;
    }

    case 'restricted-towing': {
      // Rule 27(c): a towing operation which severely restricts the towing
      // vessel and her tow carries the Rule 27(b) lights and the Rule 24(a)
      // lights together.
      const column = towingColumn((v.towLengthM ?? 0) > 200 ? 3 : 2);
      return [
        ...stack(['red', 'white', 'red'], 1.0),
        ...column,
        ...sidelights(),
        sternlight(),
        { colour: 'yellow', kind: 'towing', ...TOW_LIGHT },
      ];
    }

    case 'dredger': {
      // Rule 27(d): the Rule 27(b) lights, plus two all-round red on the side
      // where the obstruction is and two all-round green on the side a vessel
      // may pass.
      const obstruction = v.obstructionSide ?? 'port';
      const clear: Side = obstruction === 'port' ? 'starboard' : 'port';
      const out = [
        ...stack(['red', 'white', 'red'], 1.0),
        ...stack(['red', 'red'], 0.5, 0).map((l) => ({
          ...l,
          u: sideSign(obstruction) * 0.5,
        })),
        ...stack(['green', 'green'], 0.5, 0).map((l) => ({
          ...l,
          u: sideSign(clear) * 0.5,
        })),
      ];
      if (v.atAnchor) out.push(...anchorLights(v.lengthM));
      else if (v.makingWay) out.push(...mastheads(v), ...sidelights(), sternlight());
      return out;
    }

    case 'mineclearance':
      // Rule 27(f): three all-round green, one at the masthead and one at each
      // end of the fore yard, in addition to her Rule 23 lights.
      return [
        ...mastheads(v),
        ...sidelights(),
        sternlight(),
        { colour: 'green', kind: 'all-round', u: 0, v: 0.35, w: 1.15 },
        { colour: 'green', kind: 'all-round', u: -YARD_U, v: 0.35, w: 0.86 },
        { colour: 'green', kind: 'all-round', u: YARD_U, v: 0.35, w: 0.86 },
      ];

    case 'cbd':
      // Rule 28: three all-round red in addition to the Rule 23 lights.
      return [
        ...stack(['red', 'red', 'red'], 0.8),
        ...mastheads(v),
        ...sidelights(),
        sternlight(),
      ];

    case 'pilot': {
      // Rule 29(a): white over red, plus sidelights and a sternlight when
      // underway, or her anchor lights when at anchor.
      const out = stack(['white', 'red'], 1.0);
      if (v.atAnchor) out.push(...anchorLights(v.lengthM));
      else out.push(...sidelights(), sternlight());
      return out;
    }

    case 'anchored': {
      // Rule 30(a): one all-round white forward; at 50 metres and over, a
      // second at or near the stern and lower. Rule 30(c): at 100 metres and
      // over she shall also illuminate her decks.
      const out = anchorLights(v.lengthM);
      if (v.illuminatedDecks) out.push(...deckLights());
      return out;
    }

    case 'aground':
      // Rule 30(d): the anchor lights plus two all-round red.
      return [...anchorLights(v.lengthM), ...stack(['red', 'red'], 0.85)];
  }
}
