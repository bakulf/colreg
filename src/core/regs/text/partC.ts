import type { RegDoc } from '../model.ts';
import { PARTS } from '../../rules.ts';

/**
 * Part C — Lights and shapes, Rules 20 to 31, as amended (consolidated text
 * including the 2001 amendments), checked against MSN 1781 (M+F).
 *
 * Note: Rules 23(d) and 25(d) have no lead-in text before their
 * sub-paragraphs; their bare label lines end with a trailing space so that
 * the label is recognised by the line format.
 */
export const PART_C: RegDoc[] = [
  { id: 'r20', kind: 'rule', number: '20', title: 'Application', part: PARTS.C, text: `
(a) Rules in this Part shall be complied with in all weathers.
(b) The Rules concerning lights shall be complied with from sunset to sunrise, and during such times no other lights shall be exhibited, except such lights as cannot be mistaken for the lights specified in these Rules or do not impair their visibility or distinctive character, or interfere with the keeping of a proper look-out.
(c) The lights prescribed by these Rules shall, if carried, also be exhibited from sunrise to sunset in restricted visibility and may be exhibited in all other circumstances when it is deemed necessary.
(d) The Rules concerning shapes shall be complied with by day.
(e) The lights and shapes specified in these Rules shall comply with the provisions of Annex I to these Regulations.
` },
  { id: 'r21', kind: 'rule', number: '21', title: 'Definitions', part: PARTS.C, text: `
(a) "Masthead light" means a white light placed over the fore and aft centreline of the vessel showing an unbroken light over an arc of the horizon of 225 degrees and so fixed as to show the light from right ahead to 22.5 degrees abaft the beam on either side of the vessel.
(b) "Sidelights" means a green light on the starboard side and a red light on the port side each showing an unbroken light over an arc of the horizon of 112.5 degrees and so fixed as to show the light from right ahead to 22.5 degrees abaft the beam on its respective side. In a vessel of less than 20 metres in length the sidelights may be combined in one lantern carried on the fore and aft centreline of the vessel.
(c) "Sternlight" means a white light placed as nearly as practicable at the stern showing an unbroken light over an arc of the horizon of 135 degrees and so fixed as to show the light 67.5 degrees from right aft on each side of the vessel.
(d) "Towing light" means a yellow light having the same characteristics as the "sternlight" defined in paragraph (c) of this Rule.
(e) "All-round light" means a light showing an unbroken light over an arc of the horizon of 360 degrees.
(f) "Flashing light" means a light flashing at regular intervals at a frequency of 120 flashes or more per minute.
` },
  { id: 'r22', kind: 'rule', number: '22', title: 'Visibility of lights', part: PARTS.C, text: `
The lights prescribed in these Rules shall have an intensity as specified in Section 8 of Annex I to these Regulations so as to be visible at the following minimum ranges:
(a) In vessels of 50 metres or more in length:
  – a masthead light, 6 miles;
  – a sidelight, 3 miles;
  – a sternlight, 3 miles;
  – a towing light, 3 miles;
  – a white, red, green or yellow all-round light, 3 miles.
(b) In vessels of 12 metres or more in length but less than 50 metres in length:
  – a masthead light, 5 miles; except that where the length of the vessel is less than 20 metres, 3 miles;
  – a sidelight, 2 miles;
  – a sternlight, 2 miles;
  – a towing light, 2 miles;
  – a white, red, green or yellow all-round light, 2 miles.
(c) In vessels of less than 12 metres in length:
  – a masthead light, 2 miles;
  – a sidelight, 1 mile;
  – a sternlight, 2 miles;
  – a towing light, 2 miles;
  – a white, red, green or yellow all-round light, 2 miles.
(d) In inconspicuous, partly submerged vessels or objects being towed:
  – a white all-round light, 3 miles.
` },
  { id: 'r23', kind: 'rule', number: '23', title: 'Power-driven vessels underway', part: PARTS.C, text: `
(a) A power-driven vessel underway shall exhibit:
  (i) a masthead light forward;
  (ii) a second masthead light abaft of and higher than the forward one; except that a vessel of less than 50 metres in length shall not be obliged to exhibit such light but may do so;
  (iii) sidelights;
  (iv) a sternlight.
(b) An air-cushion vessel when operating in the non-displacement mode shall, in addition to the lights prescribed in paragraph (a) of this Rule, exhibit an all-round flashing yellow light.
(c) A WIG craft only when taking off, landing and in flight near the surface shall, in addition to the lights prescribed in paragraph (a) of this Rule, exhibit a high intensity all-round flashing red light.
(d) 
  (i) A power-driven vessel of less than 12 metres in length may in lieu of the lights prescribed in paragraph (a) of this Rule exhibit an all-round white light and sidelights;
  (ii) a power-driven vessel of less than 7 metres in length whose maximum speed does not exceed 7 knots may in lieu of the lights prescribed in paragraph (a) of this Rule exhibit an all-round white light and shall, if practicable, also exhibit sidelights;
  (iii) the masthead light or all-round white light on a power-driven vessel of less than 12 metres in length may be displaced from the fore and aft centreline of the vessel if centreline fitting is not practicable, provided that the sidelights are combined in one lantern which shall be carried on the fore and aft centreline of the vessel or located as nearly as practicable in the same fore and aft line as the masthead light or the all-round white light.
` },
  { id: 'r24', kind: 'rule', number: '24', title: 'Towing and pushing', part: PARTS.C, text: `
(a) A power-driven vessel when towing shall exhibit:
  (i) instead of the light prescribed in Rule 23(a)(i) or (a)(ii), two masthead lights in a vertical line. When the length of the tow, measuring from the stern of the towing vessel to the after end of the tow exceeds 200 metres, three such lights in a vertical line;
  (ii) sidelights;
  (iii) a sternlight;
  (iv) a towing light in a vertical line above the sternlight;
  (v) when the length of the tow exceeds 200 metres, a diamond shape where it can best be seen.
(b) When a pushing vessel and a vessel being pushed ahead are rigidly connected in a composite unit they shall be regarded as a power-driven vessel and exhibit the lights prescribed in Rule 23.
(c) A power-driven vessel when pushing ahead or towing alongside, except in the case of a composite unit, shall exhibit:
  (i) instead of the light prescribed in Rule 23(a)(i) or (a)(ii), two masthead lights in a vertical line;
  (ii) sidelights;
  (iii) a sternlight.
(d) A power-driven vessel to which paragraph (a) or (c) of this Rule applies shall also comply with Rule 23(a)(ii).
(e) A vessel or object being towed, other than those mentioned in paragraph (g) of this Rule, shall exhibit:
  (i) sidelights;
  (ii) a sternlight;
  (iii) when the length of the tow exceeds 200 metres, a diamond shape where it can best be seen.
(f) Provided that any number of vessels being towed alongside or pushed in a group shall be lighted as one vessel,
  (i) a vessel being pushed ahead, not being part of a composite unit, shall exhibit at the forward end, sidelights;
  (ii) a vessel being towed alongside shall exhibit a sternlight and at the forward end, sidelights.
(g) An inconspicuous, partly submerged vessel or object, or combination of such vessels or objects being towed, shall exhibit:
  (i) if it is less than 25 metres in breadth, one all-round white light at or near the forward end and one at or near the after end except that dracones need not exhibit a light at or near the forward end;
  (ii) if it is 25 metres or more in breadth, two additional all-round white lights at or near the extremities of its breadth;
  (iii) if it exceeds 100 metres in length, additional all-round white lights between the lights prescribed in sub-paragraphs (i) and (ii) so that the distance between the lights shall not exceed 100 metres;
  (iv) a diamond shape at or near the aftermost extremity of the last vessel or object being towed and if the length of the tow exceeds 200 metres an additional diamond shape where it can best be seen and located as far forward as is practicable.
(h) Where from any sufficient cause it is impracticable for a vessel or object being towed to exhibit the lights or shapes prescribed in paragraph (e) or (g) of this Rule, all possible measures shall be taken to light the vessel or object towed or at least to indicate the presence of such vessel or object.
(i) Where from any sufficient cause it is impracticable for a vessel not normally engaged in towing operations to display the lights prescribed in paragraph (a) or (c) of this Rule, such vessel shall not be required to exhibit those lights when engaged in towing another vessel in distress or otherwise in need of assistance. All possible measures shall be taken to indicate the nature of the relationship between the towing vessel and the vessel being towed as authorized by Rule 36, in particular by illuminating the towline.
` },
  { id: 'r25', kind: 'rule', number: '25', title: 'Sailing vessels underway and vessels under oars', part: PARTS.C, text: `
(a) A sailing vessel underway shall exhibit:
  (i) sidelights;
  (ii) a sternlight.
(b) In a sailing vessel of less than 20 metres in length the lights prescribed in paragraph (a) of this Rule may be combined in one lantern carried at or near the top of the mast where it can best be seen.
(c) A sailing vessel underway may, in addition to the lights prescribed in paragraph (a) of this Rule, exhibit at or near the top of the mast, where they can best be seen, two all-round lights in a vertical line, the upper being red and the lower green, but these lights shall not be exhibited in conjunction with the combined lantern permitted by paragraph (b) of this Rule.
(d) 
  (i) A sailing vessel of less than 7 metres in length shall, if practicable, exhibit the lights prescribed in paragraph (a) or (b) of this Rule, but if she does not, she shall have ready at hand an electric torch or lighted lantern showing a white light which shall be exhibited in sufficient time to prevent collision.
  (ii) A vessel under oars may exhibit the lights prescribed in this Rule for sailing vessels, but if she does not, she shall have ready at hand an electric torch or lighted lantern showing a white light which shall be exhibited in sufficient time to prevent collision.
(e) A vessel proceeding under sail when also being propelled by machinery shall exhibit forward where it can best be seen a conical shape, apex downwards.
` },
  { id: 'r26', kind: 'rule', number: '26', title: 'Fishing vessels', part: PARTS.C, text: `
(a) A vessel engaged in fishing, whether underway or at anchor, shall exhibit only the lights and shapes prescribed in this Rule.
(b) A vessel when engaged in trawling, by which is meant the dragging through the water of a dredge net or other apparatus used as a fishing appliance, shall exhibit:
  (i) two all-round lights in a vertical line, the upper being green and the lower white, or a shape consisting of two cones with their apexes together in a vertical line one above the other;
  (ii) a masthead light abaft of and higher than the all-round green light; a vessel of less than 50 metres in length shall not be obliged to exhibit such a light but may do so;
  (iii) when making way through the water, in addition to the lights prescribed in this paragraph, sidelights and a sternlight.
(c) A vessel engaged in fishing, other than trawling, shall exhibit:
  (i) two all-round lights in a vertical line, the upper being red and the lower white, or a shape consisting of two cones with apexes together in a vertical line one above the other;
  (ii) when there is outlying gear extending more than 150 metres horizontally from the vessel, an all-round white light or a cone apex upwards in the direction of the gear;
  (iii) when making way through the water, in addition to the lights prescribed in this paragraph, sidelights and a sternlight.
(d) The additional signals described in Annex II to these Regulations apply to a vessel engaged in fishing in close proximity to other vessels engaged in fishing.
(e) A vessel when not engaged in fishing shall not exhibit the lights or shapes prescribed in this Rule, but only those prescribed for a vessel of her length.
` },
  { id: 'r27', kind: 'rule', number: '27', title: 'Vessels not under command or restricted in their ability to manoeuvre', part: PARTS.C, text: `
(a) A vessel not under command shall exhibit:
  (i) two all-round red lights in a vertical line where they can best be seen;
  (ii) two balls or similar shapes in a vertical line where they can best be seen;
  (iii) when making way through the water, in addition to the lights prescribed in this paragraph, sidelights and a sternlight.
(b) A vessel restricted in her ability to manoeuvre, except a vessel engaged in mine-clearance operations, shall exhibit:
  (i) three all-round lights in a vertical line where they can best be seen. The highest and lowest of these lights shall be red and the middle light shall be white;
  (ii) three shapes in a vertical line where they can best be seen. The highest and lowest of these shapes shall be balls and the middle one a diamond;
  (iii) when making way through the water, a masthead light or lights, sidelights and a sternlight, in addition to the lights prescribed in sub-paragraph (i);
  (iv) when at anchor, in addition to the lights or shapes prescribed in sub-paragraphs (i) and (ii), the light, lights or shape prescribed in Rule 30.
(c) A power-driven vessel engaged in a towing operation such as severely restricts the towing vessel and her tow in their ability to deviate from their course shall, in addition to the lights or shapes prescribed in Rule 24(a), exhibit the lights or shapes prescribed in sub-paragraphs (b)(i) and (ii) of this Rule.
(d) A vessel engaged in dredging or underwater operations, when restricted in her ability to manoeuvre, shall exhibit the lights and shapes prescribed in sub-paragraphs (b)(i), (ii) and (iii) of this Rule and shall in addition, when an obstruction exists, exhibit:
  (i) two all-round red lights or two balls in a vertical line to indicate the side on which the obstruction exists;
  (ii) two all-round green lights or two diamonds in a vertical line to indicate the side on which another vessel may pass;
  (iii) when at anchor, the lights or shapes prescribed in this paragraph instead of the lights or shape prescribed in Rule 30.
(e) Whenever the size of a vessel engaged in diving operations makes it impracticable to exhibit all lights and shapes prescribed in paragraph (d) of this Rule, the following shall be exhibited:
  (i) three all-round lights in a vertical line where they can best be seen. The highest and lowest of these lights shall be red and the middle light shall be white;
  (ii) a rigid replica of the International Code flag "A" not less than 1 metre in height. Measures shall be taken to ensure its all-round visibility.
(f) A vessel engaged in mine-clearance operations shall in addition to the lights prescribed for a power-driven vessel in Rule 23 or to the lights or shape prescribed for a vessel at anchor in Rule 30 as appropriate, exhibit three all-round green lights or three balls. One of these lights or shapes shall be exhibited near the foremast head and one at each end of the fore yard. These lights or shapes indicate that it is dangerous for another vessel to approach within 1000 metres of the mine clearance vessel.
(g) Vessels of less than 12 metres in length, except those engaged in diving operations, shall not be required to exhibit the lights and shapes prescribed in this Rule.
(h) The signals prescribed in this Rule are not signals of vessels in distress and requiring assistance. Such signals are contained in Annex IV to these Regulations.
` },
  { id: 'r28', kind: 'rule', number: '28', title: 'Vessels constrained by their draught', part: PARTS.C, text: `
A vessel constrained by her draught may, in addition to the lights prescribed for power-driven vessels in Rule 23, exhibit where they can best be seen three all-round red lights in a vertical line, or a cylinder.
` },
  { id: 'r29', kind: 'rule', number: '29', title: 'Pilot vessels', part: PARTS.C, text: `
(a) A vessel engaged on pilotage duty shall exhibit:
  (i) at or near the masthead, two all-round lights in a vertical line, the upper being white and the lower red;
  (ii) when underway, in addition, sidelights and a sternlight;
  (iii) when at anchor, in addition to the lights prescribed in sub-paragraph (i), the light, lights or shape prescribed in Rule 30 for vessels at anchor.
(b) A pilot vessel when not engaged on pilotage duty shall exhibit the lights or shapes prescribed for a similar vessel of her length.
` },
  { id: 'r30', kind: 'rule', number: '30', title: 'Anchored vessels and vessels aground', part: PARTS.C, text: `
(a) A vessel at anchor shall exhibit where it can best be seen:
  (i) in the fore part, an all-round white light or one ball;
  (ii) at or near the stern and at a lower level than the light prescribed in sub-paragraph (i), an all-round white light.
(b) A vessel of less than 50 metres in length may exhibit an all-round white light where it can best be seen instead of the lights prescribed in paragraph (a) of this Rule.
(c) A vessel at anchor may, and a vessel of 100 metres and more in length shall, also use the available working or equivalent lights to illuminate her decks.
(d) A vessel aground shall exhibit the lights prescribed in paragraph (a) or (b) of this Rule and in addition, where they can best be seen:
  (i) two all-round red lights in a vertical line;
  (ii) three balls in a vertical line.
(e) A vessel of less than 7 metres in length, when at anchor, not in or near a narrow channel, fairway or anchorage, or where other vessels normally navigate, shall not be required to exhibit the lights or shape prescribed in paragraphs (a) and (b) of this Rule.
(f) A vessel of less than 12 metres in length, when aground, shall not be required to exhibit the lights or shapes prescribed in sub-paragraphs (d)(i) and (ii) of this Rule.
` },
  { id: 'r31', kind: 'rule', number: '31', title: 'Seaplanes', part: PARTS.C, text: `
Where it is impracticable for a seaplane or a WIG craft to exhibit lights and shapes of the characteristics or in the positions prescribed in the Rules of this Part she shall exhibit lights and shapes as closely similar in characteristics and position as is possible.
` },
];
