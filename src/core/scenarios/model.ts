/**
 * Two-vessel encounters, Rules 11 to 19.
 *
 * A scenario is a geometry — your heading, her bearing from you, her heading —
 * plus what each of you is. Everything else is derived: which rule governs,
 * who gives way, what the action should be. Deriving it rather than storing it
 * means a scenario cannot be labelled with the wrong rule, and it means the
 * bank can be swept exhaustively in a test.
 *
 * Bearings and headings are true, in degrees. The observer is always at the
 * centre of the plot looking along her own heading.
 */

export type Category =
  | 'power'
  | 'sailing'
  | 'fishing'
  | 'ram'
  | 'nuc'
  | 'cbd';

export const CATEGORY_LABELS: Record<Category, string> = {
  power: 'a power-driven vessel',
  sailing: 'a sailing vessel',
  fishing: 'a vessel engaged in fishing',
  ram: 'a vessel restricted in her ability to manoeuvre',
  nuc: 'a vessel not under command',
  cbd: 'a vessel constrained by her draught',
};

/** Rule 18's ladder, lowest number keeps clear of everything above it. */
const PRECEDENCE: Record<Category, number> = {
  nuc: 5,
  ram: 4,
  fishing: 3,
  sailing: 2,
  cbd: 1,
  power: 1,
};

export type Tack = 'port' | 'starboard';

/**
 * Where the encounter happens.
 *
 * Rule 18 opens "except where Rules 9, 10 and 13 otherwise require", so the
 * setting can displace the ordinary steering rules entirely. A yacht crossing
 * a dredged channel is not in a Rule 15 crossing situation with the ship
 * coming up it; she is under a Rule 9 duty not to impede, which is a different
 * obligation with a different remedy.
 */
export type Setting = 'open-water' | 'narrow-channel' | 'traffic-lane';

export interface Scenario {
  /** Your own heading, true. */
  ownHeading: number;
  /** Your own category. */
  own: Category;
  /** Her true bearing from you. */
  bearing: number;
  /** Her heading, true. */
  herHeading: number;
  her: Category;
  /** Which tack each is on, where both are sailing vessels. */
  ownTack?: Tack;
  herTack?: Tack;
  /** Neither of you can see the other: Section III applies. */
  restrictedVisibility: boolean;
  /** Defaults to open water when omitted. */
  setting?: Setting;
  /** Your own length, where Rule 9(b) and Rule 10(j) turn on 20 metres. */
  ownLengthM?: number;
  /**
   * She can safely navigate only within the channel, or she is following a
   * traffic lane. Either makes her the vessel not to be impeded.
   */
  sheIsConfined?: boolean;
  /** You are crossing the channel or the lane rather than running along it. */
  youAreCrossing?: boolean;
}

export type Situation =
  | 'head-on'
  | 'crossing'
  | 'overtaking'
  | 'being-overtaken'
  | 'sailing'
  | 'precedence'
  | 'constrained-by-draught'
  | 'narrow-channel'
  | 'traffic-lane'
  | 'restricted-visibility';

export type Role = 'give-way' | 'stand-on' | 'both-act' | 'not-impede';

export function norm(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/** Signed difference in [-180, 180). */
export function delta(a: number, b: number): number {
  return norm(a - b + 180) - 180;
}

/** Her bearing relative to your head: 0 is right ahead, 90 your starboard beam. */
export function relativeBearing(s: Scenario): number {
  return norm(s.bearing - s.ownHeading);
}

/** Your bearing relative to her head, which decides the overtaking sector. */
export function bearingFromHer(s: Scenario): number {
  return norm(norm(s.bearing + 180) - s.herHeading);
}

/** How nearly reciprocal the two headings are: 180 is exactly head-on. */
export function headingDifference(s: Scenario): number {
  return Math.abs(delta(s.ownHeading, s.herHeading));
}

/**
 * Which rule the geometry puts you in.
 *
 * The order matters and follows the Rules themselves: Rule 19 first, because
 * out of sight nothing in Section II applies at all; then Rule 13, which by
 * 13(a) overrides everything in Section II; then Rule 18 where the categories
 * differ; then head-on and crossing.
 */
export function classify(s: Scenario): Situation {
  if (s.restrictedVisibility) return 'restricted-visibility';

  const herBearingFromYou = relativeBearing(s);
  const yourBearingFromHer = bearingFromHer(s);

  // Rule 13(b): overtaking is decided from the overtaken vessel — more than
  // 22.5 degrees abaft her beam.
  const youAreOvertaking = yourBearingFromHer > 112.5 && yourBearingFromHer < 247.5;
  const sheIsOvertaking = herBearingFromYou > 112.5 && herBearingFromYou < 247.5;

  if (youAreOvertaking) return 'overtaking';
  if (sheIsOvertaking) return 'being-overtaken';

  // Rules 9 and 10 displace Rule 18, and Rule 8(f) governs what "not impede"
  // requires. They are checked after Rule 13 because Rule 13 overrides them
  // too: an overtaking vessel in a narrow channel is still overtaking.
  if (s.setting === 'narrow-channel' && mustNotImpede(s)) return 'narrow-channel';
  if (s.setting === 'traffic-lane' && mustNotImpede(s)) return 'traffic-lane';

  if (s.own === 'sailing' && s.her === 'sailing') return 'sailing';

  // Rule 18(d) sits outside the ladder: a vessel constrained by her draught is
  // a power-driven vessel, so against anything that outranks a power-driven
  // vessel she simply gives way. It is only against another power-driven
  // vessel — equal precedence — that the weaker "avoid impeding" duty applies.
  const cbdInvolved = (s.own === 'cbd') !== (s.her === 'cbd');
  if (cbdInvolved && PRECEDENCE[s.own] === PRECEDENCE[s.her]) {
    return 'constrained-by-draught';
  }

  if (PRECEDENCE[s.own] !== PRECEDENCE[s.her]) return 'precedence';

  if (s.own === 'power' && s.her === 'power') {
    // Rule 14(b): reciprocal or nearly reciprocal, and she is ahead or nearly
    // ahead. Six degrees either way is the usual working tolerance.
    const nearlyAhead = herBearingFromYou < 12 || herBearingFromYou > 348;
    if (nearlyAhead && headingDifference(s) > 168) return 'head-on';
    return 'crossing';
  }

  return 'crossing';
}

/**
 * Whether you are one of the vessels Rules 9 and 10 tell not to impede.
 *
 * Rule 9(b) names vessels under 20 metres and sailing vessels; 9(c) adds
 * vessels engaged in fishing; 9(d) adds any vessel crossing. Rule 10(j) names
 * the same three against a power-driven vessel following a lane.
 */
export function mustNotImpede(s: Scenario): boolean {
  if (!s.sheIsConfined) return false;
  const small = (s.ownLengthM ?? 100) < 20;
  const byClass = small || s.own === 'sailing' || s.own === 'fishing';
  return s.setting === 'narrow-channel' ? byClass || s.youAreCrossing === true : byClass;
}

export interface Verdict {
  situation: Situation;
  role: Role;
  /** The rule that decides it. */
  rule: string;
  /** What you should actually do. */
  action: string;
  /** Why, in the words of the rule. */
  reasoning: string;
}

function windwardIsOwn(s: Scenario): boolean {
  // On the same tack, the vessel to windward keeps clear. With the wind on the
  // starboard side, windward lies to starboard, so the vessel further to
  // windward is the one the other sees on her windward side.
  const rel = relativeBearing(s);
  return s.ownTack === 'starboard' ? rel > 180 : rel < 180;
}

export function resolve(s: Scenario): Verdict {
  const situation = classify(s);
  const rel = relativeBearing(s);

  switch (situation) {
    case 'restricted-visibility':
      return {
        situation,
        role: 'both-act',
        rule: 'Rule 19',
        action:
          rel > 180 || rel < 112.5
            ? 'Take avoiding action in ample time. Do not alter to port for a vessel forward of the beam; a substantial alteration to starboard, or a reduction of speed, or both.'
            : 'Take avoiding action in ample time. Do not alter towards her: she is abaft your beam.',
        reasoning:
          'You are not in sight of one another, so Rules 11 to 18 do not apply and neither of you is the stand-on vessel. Rule 19(d) forbids an alteration to port for a vessel forward of the beam other than one being overtaken, and an alteration towards a vessel abeam or abaft the beam.',
      };

    case 'overtaking':
      return {
        situation,
        role: 'give-way',
        rule: 'Rule 13',
        action:
          'Keep out of her way and stay clear until you are finally past and clear. Pass on whichever side is safer, and do not cut back across her bow.',
        reasoning:
          'You are coming up on her from more than 22.5 degrees abaft her beam, so you are the overtaking vessel. Rule 13(a) gives this precedence over anything in Section II, and Rule 13(d) says no later change of bearing makes it a crossing situation or relieves you of the duty.',
      };

    case 'being-overtaken':
      return {
        situation,
        role: 'stand-on',
        rule: 'Rule 13',
        action:
          'Hold your course and speed. If it becomes apparent she is not keeping clear, Rule 17(a)(ii) lets you act; if collision cannot be avoided by her alone, Rule 17(b) requires it.',
        reasoning:
          'She is coming up from more than 22.5 degrees abaft your beam, so she is the overtaking vessel and must keep out of your way whatever her category.',
      };

    case 'sailing': {
      if (s.ownTack !== s.herTack) {
        const youOnPort = s.ownTack === 'port';
        return {
          situation,
          role: youOnPort ? 'give-way' : 'stand-on',
          rule: 'Rule 12(a)(i)',
          action: youOnPort
            ? 'Keep out of her way: bear away astern of her, or tack, taking early and substantial action.'
            : 'Hold your course and speed, watching for her to give way.',
          reasoning: `You have the wind on your ${s.ownTack} side and she has it on her ${s.herTack} side. On different tacks, the vessel with the wind on the port side keeps out of the way.`,
        };
      }
      const youWindward = windwardIsOwn(s);
      return {
        situation,
        role: youWindward ? 'give-way' : 'stand-on',
        rule: 'Rule 12(a)(ii)',
        action: youWindward
          ? 'Keep out of her way: you are to windward, so bear away or luff early and clear.'
          : 'Hold your course and speed. You are the leeward vessel.',
        reasoning:
          'You have the wind on the same side. On the same tack, the vessel to windward keeps out of the way of the vessel to leeward.',
      };
    }

    case 'narrow-channel': {
      const why = s.youAreCrossing
        ? 'Rule 9(d): a vessel shall not cross a narrow channel or fairway if such crossing impedes the passage of a vessel which can safely navigate only within it.'
        : (s.ownLengthM ?? 100) < 20
          ? 'Rule 9(b): a vessel of less than 20 metres in length shall not impede the passage of a vessel which can safely navigate only within a narrow channel or fairway.'
          : s.own === 'fishing'
            ? 'Rule 9(c): a vessel engaged in fishing shall not impede the passage of any other vessel navigating within a narrow channel or fairway.'
            : 'Rule 9(b): a sailing vessel shall not impede the passage of a vessel which can safely navigate only within a narrow channel or fairway.';
      return {
        situation,
        role: 'not-impede',
        rule: s.youAreCrossing ? 'Rule 9(d)' : 'Rule 9(b)',
        action:
          'Take early action to keep out of the channel, or to cross well clear ahead or astern, so that she is never put to a manoeuvre. Rule 8(f) is the test: you must allow her sufficient sea room for safe passage, and if risk of collision none the less develops you are still fully bound by the steering rules.',
        reasoning: `${why} Not impeding is a duty owed before risk of collision arises; it is not the same as being the give-way vessel.`,
      };
    }

    case 'traffic-lane':
      return {
        situation,
        role: 'not-impede',
        rule: 'Rule 10(j)',
        action: s.youAreCrossing
          ? 'Cross on a heading as nearly as practicable at right angles to the general direction of traffic flow — a heading, not a course made good — and take early action so that she is not put to a manoeuvre.'
          : 'Keep clear of the lane, or leave it at as small an angle as practicable, taking early action to allow her safe passage.',
        reasoning:
          'Rule 10(j): a vessel of less than 20 metres in length, a sailing vessel, or a vessel engaged in fishing shall not impede the safe passage of a power-driven vessel following a traffic lane. Rule 10(c) governs how you cross.',
      };

    case 'constrained-by-draught':
      return s.her === 'cbd'
        ? {
            situation,
            role: 'not-impede',
            rule: 'Rule 18(d)',
            action:
              'Take early action to allow her sufficient sea room. This is not the same as giving way, and if risk of collision develops you are still bound by the steering rules.',
            reasoning:
              'A vessel constrained by her draught does not sit in the Rule 18 order of precedence. Rule 18(d) only requires any vessel other than one not under command or restricted in her ability to manoeuvre to avoid impeding her safe passage, if the circumstances of the case admit.',
          }
        : {
            situation,
            role: 'stand-on',
            rule: 'Rule 18(d)',
            action:
              'She is required to avoid impeding you, but do not rely on it as a right of way: if risk of collision develops, the ordinary steering rules bind you both and you may still be the give-way vessel.',
            reasoning:
              'You are constrained by your draught. Rule 18(d) asks other vessels to avoid impeding your safe passage; it does not put you in the order of precedence, and it does not make you a stand-on vessel within the meaning of Rule 17.',
          };

    case 'precedence': {
      const youYield = PRECEDENCE[s.own] < PRECEDENCE[s.her];
      return {
        situation,
        role: youYield ? 'give-way' : 'stand-on',
        rule: 'Rule 18',
        action: youYield
          ? 'Keep out of her way, taking early and substantial action to keep well clear under Rule 16.'
          : 'Hold your course and speed under Rule 17(a)(i), and be ready to act if she does not.',
        reasoning: youYield
          ? `Rule 18 puts ${CATEGORY_LABELS[s.her]} above ${CATEGORY_LABELS[s.own]}: not under command, then restricted in ability to manoeuvre, then engaged in fishing, then sailing, then power-driven.`
          : `Rule 18 puts ${CATEGORY_LABELS[s.own]} above ${CATEGORY_LABELS[s.her]}, so she keeps out of your way.`,
      };
    }

    case 'head-on':
      return {
        situation,
        role: 'both-act',
        rule: 'Rule 14',
        action:
          'Alter course to starboard, substantially and in good time, so that you pass port to port. Sound one short blast as you do.',
        reasoning:
          'Two power-driven vessels meeting on reciprocal or nearly reciprocal courses: each alters to starboard. Rule 14(c) adds that if you are in any doubt whether this is a head-on situation you shall assume that it is.',
      };

    case 'crossing': {
      const sheIsToStarboard = rel > 0 && rel < 180;
      return {
        situation,
        role: sheIsToStarboard ? 'give-way' : 'stand-on',
        rule: 'Rule 15',
        action: sheIsToStarboard
          ? 'Keep out of her way. Alter substantially to starboard and pass under her stern; Rule 15 tells you to avoid crossing ahead.'
          : 'Hold your course and speed. If she does not act, Rule 17(a)(ii) permits you to; Rule 17(c) says do not alter to port for a vessel on your own port side.',
        reasoning: sheIsToStarboard
          ? 'She is on your starboard side, so you are the give-way vessel. Rule 16 requires early and substantial action.'
          : 'She is on your port side, so she is the give-way vessel and you are the stand-on vessel.',
      };
    }
  }
}
