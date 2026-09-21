/**
 * Index of the International Regulations for Preventing Collisions at Sea 1972
 * (as amended) — the IRPCS / COLREGs.
 *
 * Source of the rule text: the Merchant Shipping (Distress Signals and
 * Prevention of Collisions) Regulations 1996 (SI 1996/75), Schedule 1, which
 * reproduces the Convention and is published on legislation.gov.uk under the
 * Open Government Licence v3.0. Quoted fragments below are kept short and
 * verbatim where the exact wording matters for the exam; everything else is
 * summarised in our own words.
 */

export interface RuleEntry {
  /** Rule number, 1..38. */
  n: number;
  title: string;
  part: string;
  /** Key wording, verbatim where the exam expects the exact phrase. */
  key?: string;
}

export const PARTS = {
  A: 'Part A — General',
  B1: 'Part B/I — Any condition of visibility',
  B2: 'Part B/II — In sight of one another',
  B3: 'Part B/III — Restricted visibility',
  C: 'Part C — Lights and shapes',
  D: 'Part D — Sound and light signals',
  E: 'Part E — Exemptions',
  F: 'Part F — Verification of compliance',
} as const;

export const RULES: readonly RuleEntry[] = [
  { n: 1, title: 'Application', part: PARTS.A,
    key: 'Applies to all vessels upon the high seas and in all waters connected therewith navigable by seagoing vessels.' },
  { n: 2, title: 'Responsibility', part: PARTS.A,
    key: 'Nothing shall exonerate any vessel, or her owner, master or crew, from the consequences of any neglect to comply with these Rules or of the neglect of any precaution which may be required by the ordinary practice of seamen, or by the special circumstances of the case.' },
  { n: 3, title: 'General definitions', part: PARTS.A },
  { n: 4, title: 'Application', part: PARTS.B1,
    key: 'Rules in this Section apply in any condition of visibility.' },
  { n: 5, title: 'Look-out', part: PARTS.B1,
    key: 'Every vessel shall at all times maintain a proper look-out by sight and hearing as well as by all available means appropriate in the prevailing circumstances and conditions so as to make a full appraisal of the situation and of the risk of collision.' },
  { n: 6, title: 'Safe speed', part: PARTS.B1,
    key: 'Every vessel shall at all times proceed at a safe speed so that she can take proper and effective action to avoid collision and be stopped within a distance appropriate to the prevailing circumstances and conditions.' },
  { n: 7, title: 'Risk of collision', part: PARTS.B1,
    key: 'If there is any doubt such risk shall be deemed to exist.' },
  { n: 8, title: 'Action to avoid collision', part: PARTS.B1,
    key: 'Any action shall be positive, made in ample time and with due regard to the observance of good seamanship. Any alteration of course and/or speed shall be large enough to be readily apparent to another vessel observing visually or by radar; a succession of small alterations should be avoided.' },
  { n: 9, title: 'Narrow channels', part: PARTS.B1,
    key: 'A vessel proceeding along the course of a narrow channel or fairway shall keep as near to the outer limit of the channel or fairway which lies on her starboard side as is safe and practicable.' },
  { n: 10, title: 'Traffic separation schemes', part: PARTS.B1,
    key: 'A vessel shall so far as practicable avoid crossing traffic lanes, but if obliged to do so shall cross on a heading as nearly as practicable at right angles to the general direction of traffic flow.' },
  { n: 11, title: 'Application', part: PARTS.B2,
    key: 'Rules in this Section apply to vessels in sight of one another.' },
  { n: 12, title: 'Sailing vessels', part: PARTS.B2,
    key: 'Different tacks: the one which has the wind on the port side keeps out of the way. Same tack: the one to windward keeps out of the way of the one to leeward.' },
  { n: 13, title: 'Overtaking', part: PARTS.B2,
    key: 'A vessel shall be deemed to be overtaking when coming up with another vessel from a direction more than 22.5 degrees abaft her beam. Any subsequent alteration of the bearing between the two vessels shall not make the overtaking vessel a crossing vessel.' },
  { n: 14, title: 'Head-on situation', part: PARTS.B2,
    key: 'When two power-driven vessels are meeting on reciprocal or nearly reciprocal courses so as to involve risk of collision each shall alter her course to starboard so that each shall pass on the port side of the other.' },
  { n: 15, title: 'Crossing situation', part: PARTS.B2,
    key: 'When two power-driven vessels are crossing so as to involve risk of collision, the vessel which has the other on her own starboard side shall keep out of the way and shall, if the circumstances of the case admit, avoid crossing ahead of the other vessel.' },
  { n: 16, title: 'Action by give-way vessel', part: PARTS.B2,
    key: 'Every vessel which is directed to keep out of the way of another vessel shall, so far as possible, take early and substantial action to keep well clear.' },
  { n: 17, title: 'Action by stand-on vessel', part: PARTS.B2,
    key: 'She shall keep her course and speed. She may however take action to avoid collision by her manoeuvre alone, as soon as it becomes apparent to her that the vessel required to keep out of the way is not taking appropriate action. A power-driven vessel which takes action in a crossing situation shall, if the circumstances of the case admit, not alter course to port for a vessel on her own port side.' },
  { n: 18, title: 'Responsibilities between vessels', part: PARTS.B2,
    key: 'Order of precedence: not under command, restricted in ability to manoeuvre, engaged in fishing, sailing, power-driven.' },
  { n: 19, title: 'Conduct of vessels in restricted visibility', part: PARTS.B3,
    key: 'Avoid an alteration of course to port for a vessel forward of the beam, other than for a vessel being overtaken; and an alteration of course towards a vessel abeam or abaft the beam.' },
  { n: 20, title: 'Application (lights and shapes)', part: PARTS.C,
    key: 'Lights shall be exhibited from sunset to sunrise, and in restricted visibility and may be exhibited in all other circumstances when it is deemed necessary.' },
  { n: 21, title: 'Definitions (lights)', part: PARTS.C,
    key: 'Masthead light 225 degrees; sidelights 112.5 degrees each; sternlight 135 degrees; all-round light 360 degrees; flashing light 120 flashes or more per minute.' },
  { n: 22, title: 'Visibility of lights', part: PARTS.C },
  { n: 23, title: 'Power-driven vessels underway', part: PARTS.C },
  { n: 24, title: 'Towing and pushing', part: PARTS.C },
  { n: 25, title: 'Sailing vessels underway and vessels under oars', part: PARTS.C },
  { n: 26, title: 'Fishing vessels', part: PARTS.C },
  { n: 27, title: 'Vessels not under command or restricted in their ability to manoeuvre', part: PARTS.C },
  { n: 28, title: 'Vessels constrained by their draught', part: PARTS.C },
  { n: 29, title: 'Pilot vessels', part: PARTS.C },
  { n: 30, title: 'Anchored vessels and vessels aground', part: PARTS.C },
  { n: 31, title: 'Seaplanes', part: PARTS.C },
  { n: 32, title: 'Definitions (sound)', part: PARTS.D,
    key: 'Short blast: about one second. Prolonged blast: from four to six seconds.' },
  { n: 33, title: 'Equipment for sound signals', part: PARTS.D },
  { n: 34, title: 'Manoeuvring and warning signals', part: PARTS.D },
  { n: 35, title: 'Sound signals in restricted visibility', part: PARTS.D },
  { n: 36, title: 'Signals to attract attention', part: PARTS.D },
  { n: 37, title: 'Distress signals', part: PARTS.D },
  { n: 38, title: 'Exemptions', part: PARTS.E },
] as const;

const BY_NUMBER = new Map(RULES.map((r) => [r.n, r]));

export function getRule(n: number): RuleEntry | undefined {
  return BY_NUMBER.get(n);
}

/** Parses 'Rule 17(a)(ii)' -> 17. Returns undefined for anything else. */
export function ruleNumberOf(ref: string): number | undefined {
  const m = /^Rule (\d{1,2})\b/.exec(ref);
  if (!m) return undefined;
  return Number(m[1]);
}
