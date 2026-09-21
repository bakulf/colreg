import type { VesselState } from './model.ts';

/** Rule 26(d) and Annex II, in the words the Annex uses. */
const ANNEX_II: Record<'shooting' | 'hauling' | 'net-fast' | 'purse-seine', string> = {
  shooting: 'shooting her nets',
  hauling: 'hauling her nets',
  'net-fast': 'with her net fast upon an obstruction',
  'purse-seine': 'hampered by her purse seine gear',
};

function sizeClause(lengthM: number): string {
  return lengthM >= 50 ? '50 metres or more' : 'less than 50 metres';
}

/** The answer text for a vessel, in the language the Rules use. */
export function describeVessel(v: VesselState): string {
  const way = v.makingWay ? 'making way through the water' : 'not making way through the water';

  switch (v.kind) {
    case 'power':
      return v.secondMasthead && v.lengthM < 50
        ? 'A power-driven vessel of less than 50 metres underway, showing the second masthead light Rule 23(a)(ii) leaves optional for her'
        : `A power-driven vessel of ${sizeClause(v.lengthM)} underway`;
    case 'power-small':
      return 'A power-driven vessel of less than 12 metres, underway, using the option in Rule 23(d)';
    case 'power-tiny':
      return 'A power-driven vessel of less than 7 metres whose maximum speed is under 7 knots, underway';
    case 'hovercraft':
      return 'An air-cushion vessel operating in the non-displacement mode';
    case 'wig':
      return 'A WIG craft taking off, landing or flying near the surface';
    case 'towing':
      return (v.towLengthM ?? 0) > 200
        ? 'A power-driven vessel towing astern, length of tow more than 200 metres'
        : 'A power-driven vessel towing astern, length of tow 200 metres or less';
    case 'pushing':
      return 'A power-driven vessel pushing ahead or towing alongside, not a composite unit';
    case 'towed':
      return 'A vessel being towed';
    case 'composite':
      return 'A pushing vessel and a vessel pushed ahead, rigidly connected as a composite unit';
    case 'pushed-ahead':
      return 'A vessel being pushed ahead, not part of a composite unit';
    case 'towed-alongside':
      return 'A vessel being towed alongside';
    case 'submerged-tow':
      return 'An inconspicuous, partly submerged vessel or object being towed';
    case 'sailing':
      if (v.tricolour) return 'A sailing vessel under 20 metres underway, using a combined lantern';
      if (v.optionalRedGreen)
        return 'A sailing vessel underway, showing the optional lights of Rule 25(c)';
      return 'A sailing vessel underway';
    case 'motorsailing':
      return 'A vessel proceeding under sail and power together';
    case 'torch':
      return 'A sailing vessel under 7 metres, or a vessel under oars, showing a lantern';
    case 'trawler':
      return v.annexII
        ? `A vessel engaged in trawling, ${ANNEX_II[v.annexII]}`
        : `A vessel engaged in trawling of ${sizeClause(v.lengthM)}, ${way}`;
    case 'fishing':
      if (v.annexII) return `A vessel engaged in fishing, ${ANNEX_II[v.annexII]}`;
      return v.gearSide
        ? `A vessel engaged in fishing other than trawling with gear extending more than 150 metres, ${way}`
        : `A vessel engaged in fishing other than trawling, ${way}`;
    case 'nuc':
      return `A vessel not under command, ${way}`;
    case 'ram':
      return `A vessel restricted in her ability to manoeuvre, ${way}`;
    case 'restricted-towing':
      return 'A vessel engaged in a towing operation which severely restricts her ability to deviate';
    case 'dredger':
      return v.atAnchor
        ? 'A vessel engaged in dredging or underwater operations, at anchor, with an obstruction on one side'
        : 'A vessel engaged in dredging or underwater operations, with an obstruction on one side';
    case 'diving':
      return `A small vessel engaged in diving operations, ${way}`;
    case 'mineclearance':
      return 'A vessel engaged in mine clearance operations';
    case 'cbd':
      return 'A vessel constrained by her draught, underway';
    case 'pilot':
      return v.atAnchor
        ? 'A pilot vessel on pilotage duty, at anchor'
        : 'A pilot vessel on pilotage duty, underway';
    case 'anchored':
      if (v.illuminatedDecks) return 'A vessel of 100 metres or more at anchor';
      return `A vessel of ${sizeClause(v.lengthM)} at anchor`;
    case 'aground':
      return `A vessel of ${sizeClause(v.lengthM)} aground`;
  }
}

/** The full set of lights she carries, whether or not you can see them all. */
export function describeLights(v: VesselState): string {
  const big = v.lengthM >= 50;

  switch (v.kind) {
    case 'power':
      if (v.secondMasthead && !big) {
        return 'a forward masthead light, a second masthead light abaft of and higher than it — which Rule 23(a)(ii) permits but does not require below 50 metres — sidelights and a sternlight';
      }
      return big
        ? 'a forward masthead light, a second masthead light abaft of and higher than it, sidelights and a sternlight'
        : 'a masthead light, sidelights and a sternlight';
    case 'power-small':
      return 'an all-round white light and sidelights, in lieu of the full Rule 23(a) set';
    case 'power-tiny':
      return 'an all-round white light, with sidelights only if practicable';
    case 'hovercraft':
      return 'the lights of a power-driven vessel plus an all-round flashing yellow light';
    case 'wig':
      return 'the lights of a power-driven vessel plus a high-intensity all-round flashing red light';
    case 'towing':
      return `${
        (v.towLengthM ?? 0) > 200 ? 'three' : 'two'
      } masthead lights in a vertical line, sidelights, a sternlight and a yellow towing light above the sternlight`;
    case 'pushing':
      return 'two masthead lights in a vertical line, sidelights and a sternlight, with no towing light';
    case 'towed':
      return 'sidelights and a sternlight';
    case 'composite':
      return 'the lights of a single power-driven vessel: nothing in them says she is two hulls';
    case 'pushed-ahead':
      return 'sidelights at the forward end, and nothing else';
    case 'towed-alongside':
      return 'a sternlight, and sidelights at the forward end';
    case 'submerged-tow':
      return 'an all-round white light at or near each end, close to the water';
    case 'sailing':
      if (v.tricolour)
        return 'sidelights and a sternlight combined in one lantern at or near the top of the mast';
      if (v.optionalRedGreen)
        return 'sidelights, a sternlight, and two all-round lights at the masthead, red over green';
      return 'sidelights and a sternlight';
    case 'motorsailing':
      return 'the lights of a power-driven vessel, and by day a conical shape apex downwards';
    case 'torch':
      return 'an electric torch or lighted lantern showing a white light, exhibited in time to prevent collision';
    case 'trawler':
      return `two all-round lights in a vertical line, green over white${
        big ? ', a masthead light abaft of and higher than the green' : ''
      }${
        v.annexII ? `, and the Annex II signal for a vessel ${ANNEX_II[v.annexII]}` : ''
      }, and sidelights and a sternlight only when making way`;
    case 'fishing':
      return `two all-round lights in a vertical line, red over white${
        v.gearSide ? ', an all-round white light in the direction of the gear' : ''
      }${
        v.annexII ? `, and the Annex II signal for a vessel ${ANNEX_II[v.annexII]}` : ''
      }, and sidelights and a sternlight only when making way`;
    case 'nuc':
      return 'two all-round red lights in a vertical line, and sidelights and a sternlight only when making way';
    case 'ram':
      return 'three all-round lights in a vertical line, red white red, and masthead lights, sidelights and a sternlight only when making way';
    case 'restricted-towing':
      return 'the red white red lights of Rule 27(b) together with the full Rule 24(a) towing lights';
    case 'dredger':
      return 'the red white red lights of Rule 27(b), two all-round red on the side where the obstruction is, and two all-round green on the side a vessel may pass';
    case 'diving':
      return 'three all-round lights in a vertical line, red white red, and by day a rigid replica of the International Code flag A not less than one metre high';
    case 'mineclearance':
      return 'her Rule 23 lights plus three all-round green lights, one at the masthead and one at each end of the fore yard';
    case 'cbd':
      return 'three all-round red lights in a vertical line, in addition to her Rule 23 lights';
    case 'pilot':
      return 'two all-round lights in a vertical line, white over red, plus sidelights and a sternlight when underway or her anchor lights when at anchor';
    case 'anchored':
      return big
        ? `an all-round white light forward and a second all-round white light at or near the stern, lower than the forward one${
            v.illuminatedDecks ? ', with her decks illuminated' : ''
          }`
        : 'one all-round white light where it can best be seen';
    case 'aground':
      return 'her anchor light or lights together with two all-round red lights in a vertical line';
  }
}

/**
 * Where the Rules deliberately give two different vessels the same picture.
 *
 * Saying so is the point rather than an embarrassment: a student who knows that
 * sidelights and a sternlight could be a yacht or the barge on the end of a
 * tow-wire will look for the towing vessel's lights ahead of them.
 */
export function ambiguityNote(v: VesselState): string | undefined {
  switch (v.kind) {
    case 'composite':
      return 'Rule 24(b) lights a composite unit as one power-driven vessel, so by night she is indistinguishable from a single ship of her size. That is deliberate: rigidly connected, she handles as one, and there is nothing useful you could do with the knowledge that she is two.';
    case 'pushed-ahead':
      return 'Sidelights and nothing above them, and no sternlight — a picture no vessel underway on her own account ever shows. If you see it, look for the pusher behind her.';
    case 'towed':
      return 'These are exactly the lights of a sailing vessel, and nothing in the tow itself tells you otherwise. What gives it away is ahead of her: the towing vessel\'s vertical masthead lights and her yellow towing light. By day the diamond is shown by both, but only when the tow exceeds 200 metres.';
    case 'diving':
      return 'By night a small diving boat shows the same red white red as any vessel restricted in her ability to manoeuvre. Only the day signal, the rigid flag A, identifies her as a diving operation.';
    case 'sailing':
      return v.tricolour || v.optionalRedGreen
        ? undefined
        : 'Sidelights and a sternlight and nothing above them is also what a vessel under tow shows, and what a vessel under oars may show. In a busy seaway, look for towing lights ahead before you assume yacht.';
    case 'motorsailing':
      return 'Her lights are those of a power-driven vessel, so at night she is indistinguishable from a motorboat of her size. The cone of Rule 25(e) is the only signal that marks her out, and only by day.';
    default:
      return undefined;
  }
}

export function ruleRefsFor(v: VesselState): string[] {
  switch (v.kind) {
    case 'power':
      return v.secondMasthead && v.lengthM < 50 ? ['Rule 23(a)(ii)'] : ['Rule 23(a)'];
    case 'power-small':
      return ['Rule 23(d)(i)'];
    case 'power-tiny':
      return ['Rule 23(d)(ii)'];
    case 'hovercraft':
      return ['Rule 23(b)'];
    case 'wig':
      return ['Rule 23(c)'];
    case 'towing':
      return ['Rule 24(a)'];
    case 'pushing':
      return ['Rule 24(c)'];
    case 'towed':
      return ['Rule 24(e)'];
    case 'composite':
      return ['Rule 24(b)'];
    case 'pushed-ahead':
      return ['Rule 24(f)'];
    case 'towed-alongside':
      return ['Rule 24(f)'];
    case 'submerged-tow':
      return ['Rule 24(g)'];
    case 'sailing':
      if (v.tricolour) return ['Rule 25(b)'];
      if (v.optionalRedGreen) return ['Rule 25(c)'];
      return ['Rule 25(a)'];
    case 'motorsailing':
      return ['Rule 25(e)', 'Rule 3(c)'];
    case 'torch':
      return ['Rule 25(d)'];
    case 'trawler':
      return v.annexII ? ['Rule 26(d)', 'Annex II'] : ['Rule 26(b)'];
    case 'fishing':
      if (v.annexII) return ['Rule 26(d)', 'Annex II'];
      return v.gearSide ? ['Rule 26(c)(ii)'] : ['Rule 26(c)'];
    case 'nuc':
      return ['Rule 27(a)'];
    case 'ram':
      return ['Rule 27(b)'];
    case 'restricted-towing':
      return ['Rule 27(c)', 'Rule 24(a)'];
    case 'dredger':
      return ['Rule 27(d)'];
    case 'diving':
      return ['Rule 27(e)'];
    case 'mineclearance':
      return ['Rule 27(f)'];
    case 'cbd':
      return ['Rule 28', 'Rule 23(a)'];
    case 'pilot':
      return ['Rule 29(a)'];
    case 'anchored':
      return v.illuminatedDecks
        ? ['Rule 30(a)', 'Rule 30(c)']
        : ['Rule 30(a)', 'Rule 30(b)'];
    case 'aground':
      return ['Rule 30(d)'];
  }
}

/** The concept key used for progress tracking and, from M2, for scheduling. */
export function conceptFor(v: VesselState): string {
  const big = v.lengthM >= 50;
  switch (v.kind) {
    case 'power':
      if (v.secondMasthead && !big) return 'lights:power-optional-second-masthead';
      return big ? 'lights:power-over-50' : 'lights:power-under-50';
    case 'sailing':
      if (v.tricolour) return 'lights:sailing-tricolour';
      if (v.optionalRedGreen) return 'lights:sailing-red-green';
      return 'lights:sailing';
    case 'trawler':
      if (v.annexII) return `lights:annex-ii-${v.annexII}`;
      return big
        ? 'lights:trawler-over-50'
        : v.makingWay
          ? 'lights:trawler-making-way'
          : 'lights:trawler-stopped';
    case 'fishing':
      if (v.annexII) return `lights:annex-ii-${v.annexII}`;
      return v.gearSide
        ? 'lights:fishing-outlying-gear'
        : v.makingWay
          ? 'lights:fishing-making-way'
          : 'lights:fishing-stopped';
    case 'nuc':
      return v.makingWay ? 'lights:nuc-making-way' : 'lights:nuc-stopped';
    case 'ram':
      return v.makingWay ? 'lights:ram-making-way' : 'lights:ram-stopped';
    case 'towing':
      return (v.towLengthM ?? 0) > 200 ? 'lights:towing-over-200' : 'lights:towing-under-200';
    case 'dredger':
      return v.atAnchor ? 'lights:dredger-anchored' : 'lights:dredger';
    case 'pilot':
      return v.atAnchor ? 'lights:pilot-anchored' : 'lights:pilot';
    case 'anchored':
      if (v.illuminatedDecks) return 'lights:anchored-over-100';
      return big ? 'lights:anchored-over-50' : 'lights:anchored-under-50';
    case 'aground':
      return big ? 'lights:aground-over-50' : 'lights:aground-under-50';
    default:
      return `lights:${v.kind}`;
  }
}
