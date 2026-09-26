/**
 * Rules 1 to 19: Part A (General) and Part B (Steering and sailing rules),
 * Sections I, II and III, in the consolidated text as amended up to and
 * including the 2013 amendments (resolution A.1085(28)).
 *
 * A paragraph whose only content is its sub-paragraphs, such as Rule 17(a),
 * is written as its label followed by a single space, so the parser still
 * reads it as a labelled paragraph with empty text.
 */
import type { RegDoc } from '../model.ts';
import { PARTS } from '../../rules.ts';

export const PART_AB: RegDoc[] = [
  { id: 'r1', kind: 'rule', number: '1', title: 'Application', part: PARTS.A, text: `
(a) These Rules shall apply to all vessels upon the high seas and in all waters connected therewith navigable by seagoing vessels.
(b) Nothing in these Rules shall interfere with the operation of special rules made by an appropriate authority for roadsteads, harbours, rivers, lakes or inland waterways connected with the high seas and navigable by seagoing vessels. Such special rules shall conform as closely as possible to these Rules.
(c) Nothing in these Rules shall interfere with the operation of any special rules made by the Government of any State with respect to additional station or signal lights, shapes or whistle signals for ships of war and vessels proceeding under convoy, or with respect to additional station or signal lights or shapes for fishing vessels engaged in fishing as a fleet. These additional station or signal lights, shapes or whistle signals shall, so far as possible, be such that they cannot be mistaken for any light, shape or signal authorized elsewhere under these Rules.
(d) Traffic separation schemes may be adopted by the Organization for the purpose of these Rules.
(e) Whenever the Government concerned shall have determined that a vessel of special construction or purpose cannot comply fully with the provisions of any of these Rules with respect to the number, position, range or arc of visibility of lights or shapes, as well as to the disposition and characteristics of sound-signalling appliances, such vessel shall comply with such other provisions in regard to the number, position, range or arc of visibility of lights or shapes, as well as to the disposition and characteristics of sound-signalling appliances, as her Government shall have determined to be the closest possible compliance with these Rules in respect of that vessel.
` },
  { id: 'r2', kind: 'rule', number: '2', title: 'Responsibility', part: PARTS.A, text: `
(a) Nothing in these Rules shall exonerate any vessel, or the owner, master or crew thereof, from the consequences of any neglect to comply with these Rules or of the neglect of any precaution which may be required by the ordinary practice of seamen, or by the special circumstances of the case.
(b) In construing and complying with these Rules due regard shall be had to all dangers of navigation and collision and to any special circumstances, including the limitations of the vessels involved, which may make a departure from these Rules necessary to avoid immediate danger.
` },
  { id: 'r3', kind: 'rule', number: '3', title: 'General definitions', part: PARTS.A, text: `
For the purpose of these Rules, except where the context otherwise requires:
(a) The word "vessel" includes every description of water craft, including non-displacement craft, WIG craft and seaplanes, used or capable of being used as a means of transportation on water.
(b) The term "power-driven vessel" means any vessel propelled by machinery.
(c) The term "sailing vessel" means any vessel under sail provided that propelling machinery, if fitted, is not being used.
(d) The term "vessel engaged in fishing" means any vessel fishing with nets, lines, trawls or other fishing apparatus which restrict manoeuvrability, but does not include a vessel fishing with trolling lines or other fishing apparatus which do not restrict manoeuvrability.
(e) The word "seaplane" includes any aircraft designed to manoeuvre on the water.
(f) The term "vessel not under command" means a vessel which through some exceptional circumstance is unable to manoeuvre as required by these Rules and is therefore unable to keep out of the way of another vessel.
(g) The term "vessel restricted in her ability to manoeuvre" means a vessel which from the nature of her work is restricted in her ability to manoeuvre as required by these Rules and is therefore unable to keep out of the way of another vessel. The term "vessels restricted in their ability to manoeuvre" shall include but not be limited to:
  (i) a vessel engaged in laying, servicing or picking up a navigation mark, submarine cable or pipeline;
  (ii) a vessel engaged in dredging, surveying or underwater operations;
  (iii) a vessel engaged in replenishment or transferring persons, provisions or cargo while underway;
  (iv) a vessel engaged in the launching or recovery of aircraft;
  (v) a vessel engaged in mine clearance operations;
  (vi) a vessel engaged in a towing operation such as severely restricts the towing vessel and her tow in their ability to deviate from their course.
(h) The term "vessel constrained by her draught" means a power-driven vessel which, because of her draught in relation to the available depth and width of navigable water, is severely restricted in her ability to deviate from the course she is following.
(i) The word "underway" means that a vessel is not at anchor, or made fast to the shore, or aground.
(j) The words "length" and "breadth" of a vessel mean her length overall and greatest breadth.
(k) Vessels shall be deemed to be in sight of one another only when one can be observed visually from the other.
(l) The term "restricted visibility" means any condition in which visibility is restricted by fog, mist, falling snow, heavy rainstorms, sandstorms or any other similar causes.
(m) The term "Wing-in-Ground (WIG) craft" means a multimodal craft which, in its main operational mode, flies in close proximity to the surface by utilizing surface-effect action.
` },
  { id: 'r4', kind: 'rule', number: '4', title: 'Application', part: PARTS.B1, text: `
Rules in this Section apply in any condition of visibility.
` },
  { id: 'r5', kind: 'rule', number: '5', title: 'Look-out', part: PARTS.B1, text: `
Every vessel shall at all times maintain a proper look-out by sight and hearing as well as by all available means appropriate in the prevailing circumstances and conditions so as to make a full appraisal of the situation and of the risk of collision.
` },
  { id: 'r6', kind: 'rule', number: '6', title: 'Safe speed', part: PARTS.B1, text: `
Every vessel shall at all times proceed at a safe speed so that she can take proper and effective action to avoid collision and be stopped within a distance appropriate to the prevailing circumstances and conditions.
In determining a safe speed the following factors shall be among those taken into account:
(a) By all vessels:
  (i) the state of visibility;
  (ii) the traffic density including concentrations of fishing vessels or any other vessels;
  (iii) the manoeuvrability of the vessel with special reference to stopping distance and turning ability in the prevailing conditions;
  (iv) at night the presence of background light such as from shore lights or from back scatter of her own lights;
  (v) the state of wind, sea and current, and the proximity of navigational hazards;
  (vi) the draught in relation to the available depth of water.
(b) Additionally, by vessels with operational radar:
  (i) the characteristics, efficiency and limitations of the radar equipment;
  (ii) any constraints imposed by the radar range scale in use;
  (iii) the effect on radar detection of the sea state, weather and other sources of interference;
  (iv) the possibility that small vessels, ice and other floating objects may not be detected by radar at an adequate range;
  (v) the number, location and movement of vessels detected by radar;
  (vi) the more exact assessment of the visibility that may be possible when radar is used to determine the range of vessels or other objects in the vicinity.
` },
  { id: 'r7', kind: 'rule', number: '7', title: 'Risk of collision', part: PARTS.B1, text: `
(a) Every vessel shall use all available means appropriate to the prevailing circumstances and conditions to determine if risk of collision exists. If there is any doubt such risk shall be deemed to exist.
(b) Proper use shall be made of radar equipment if fitted and operational, including long-range scanning to obtain early warning of risk of collision and radar plotting or equivalent systematic observation of detected objects.
(c) Assumptions shall not be made on the basis of scanty information, especially scanty radar information.
(d) In determining if risk of collision exists the following considerations shall be among those taken into account:
  (i) such risk shall be deemed to exist if the compass bearing of an approaching vessel does not appreciably change;
  (ii) such risk may sometimes exist even when an appreciable bearing change is evident, particularly when approaching a very large vessel or a tow or when approaching a vessel at close range.
` },
  { id: 'r8', kind: 'rule', number: '8', title: 'Action to avoid collision', part: PARTS.B1, text: `
(a) Any action taken to avoid collision shall be taken in accordance with the Rules of this Part and shall, if the circumstances of the case admit, be positive, made in ample time and with due regard to the observance of good seamanship.
(b) Any alteration of course and/or speed to avoid collision shall, if the circumstances of the case admit, be large enough to be readily apparent to another vessel observing visually or by radar; a succession of small alterations of course and/or speed should be avoided.
(c) If there is sufficient sea-room, alteration of course alone may be the most effective action to avoid a close-quarters situation provided that it is made in good time, is substantial and does not result in another close-quarters situation.
(d) Action taken to avoid collision with another vessel shall be such as to result in passing at a safe distance. The effectiveness of the action shall be carefully checked until the other vessel is finally past and clear.
(e) If necessary to avoid collision or allow more time to assess the situation, a vessel shall slacken her speed or take all way off by stopping or reversing her means of propulsion.
(f) 
  (i) A vessel which, by any of these Rules, is required not to impede the passage or safe passage of another vessel shall, when required by the circumstances of the case, take early action to allow sufficient sea-room for the safe passage of the other vessel.
  (ii) A vessel required not to impede the passage or safe passage of another vessel is not relieved of this obligation if approaching the other vessel so as to involve risk of collision and shall, when taking action, have full regard to the action which may be required by the Rules of this Part.
  (iii) A vessel the passage of which is not to be impeded remains fully obliged to comply with the Rules of this Part when the two vessels are approaching one another so as to involve risk of collision.
` },
  { id: 'r9', kind: 'rule', number: '9', title: 'Narrow channels', part: PARTS.B1, text: `
(a) A vessel proceeding along the course of a narrow channel or fairway shall keep as near to the outer limit of the channel or fairway which lies on her starboard side as is safe and practicable.
(b) A vessel of less than 20 metres in length or a sailing vessel shall not impede the passage of a vessel which can safely navigate only within a narrow channel or fairway.
(c) A vessel engaged in fishing shall not impede the passage of any other vessel navigating within a narrow channel or fairway.
(d) A vessel shall not cross a narrow channel or fairway if such crossing impedes the passage of a vessel which can safely navigate only within such channel or fairway. The latter vessel may use the sound signal prescribed in Rule 34(d) if in doubt as to the intention of the crossing vessel.
(e) 
  (i) In a narrow channel or fairway when overtaking can take place only if the vessel to be overtaken has to take action to permit safe passing, the vessel intending to overtake shall indicate her intention by sounding the appropriate signal prescribed in Rule 34(c)(i). The vessel to be overtaken shall, if in agreement, sound the appropriate signal prescribed in Rule 34(c)(ii) and take steps to permit safe passing. If in doubt she may sound the signals prescribed in Rule 34(d).
  (ii) This Rule does not relieve the overtaking vessel of her obligation under Rule 13.
(f) A vessel nearing a bend or an area of a narrow channel or fairway where other vessels may be obscured by an intervening obstruction shall navigate with particular alertness and caution and shall sound the appropriate signal prescribed in Rule 34(e).
(g) Any vessel shall, if the circumstances of the case admit, avoid anchoring in a narrow channel.
` },
  { id: 'r10', kind: 'rule', number: '10', title: 'Traffic separation schemes', part: PARTS.B1, text: `
(a) This Rule applies to traffic separation schemes adopted by the Organization and does not relieve any vessel of her obligation under any other Rule.
(b) A vessel using a traffic separation scheme shall:
  (i) proceed in the appropriate traffic lane in the general direction of traffic flow for that lane;
  (ii) so far as practicable keep clear of a traffic separation line or separation zone;
  (iii) normally join or leave a traffic lane at the termination of the lane, but when joining or leaving from either side shall do so at as small an angle to the general direction of traffic flow as practicable.
(c) A vessel shall, so far as practicable, avoid crossing traffic lanes but if obliged to do so shall cross on a heading as nearly as practicable at right angles to the general direction of traffic flow.
(d) 
  (i) A vessel shall not use an inshore traffic zone when she can safely use the appropriate traffic lane within the adjacent traffic separation scheme. However, vessels of less than 20 metres in length, sailing vessels and vessels engaged in fishing may use the inshore traffic zone.
  (ii) Notwithstanding sub-paragraph (d)(i), a vessel may use an inshore traffic zone when en route to or from a port, offshore installation or structure, pilot station or any other place situated within the inshore traffic zone, or to avoid immediate danger.
(e) A vessel other than a crossing vessel or a vessel joining or leaving a lane shall not normally enter a separation zone or cross a separation line except:
  (i) in cases of emergency to avoid immediate danger;
  (ii) to engage in fishing within a separation zone.
(f) A vessel navigating in areas near the terminations of traffic separation schemes shall do so with particular caution.
(g) A vessel shall so far as practicable avoid anchoring in a traffic separation scheme or in areas near its terminations.
(h) A vessel not using a traffic separation scheme shall avoid it by as wide a margin as is practicable.
(i) A vessel engaged in fishing shall not impede the passage of any vessel following a traffic lane.
(j) A vessel of less than 20 metres in length or a sailing vessel shall not impede the safe passage of a power-driven vessel following a traffic lane.
(k) A vessel restricted in her ability to manoeuvre when engaged in an operation for the maintenance of safety of navigation in a traffic separation scheme is exempted from complying with this Rule to the extent necessary to carry out the operation.
(l) A vessel restricted in her ability to manoeuvre when engaged in an operation for the laying, servicing or picking up of a submarine cable, within a traffic separation scheme, is exempted from complying with this Rule to the extent necessary to carry out the operation.
` },
  { id: 'r11', kind: 'rule', number: '11', title: 'Application', part: PARTS.B2, text: `
Rules in this Section apply to vessels in sight of one another.
` },
  { id: 'r12', kind: 'rule', number: '12', title: 'Sailing vessels', part: PARTS.B2, text: `
(a) When two sailing vessels are approaching one another, so as to involve risk of collision, one of them shall keep out of the way of the other as follows:
  (i) when each has the wind on a different side, the vessel which has the wind on the port side shall keep out of the way of the other;
  (ii) when both have the wind on the same side, the vessel which is to windward shall keep out of the way of the vessel which is to leeward;
  (iii) if a vessel with the wind on the port side sees a vessel to windward and cannot determine with certainty whether the other vessel has the wind on the port or on the starboard side, she shall keep out of the way of the other.
(b) For the purposes of this Rule the windward side shall be deemed to be the side opposite to that on which the mainsail is carried or, in the case of a square-rigged vessel, the side opposite to that on which the largest fore-and-aft sail is carried.
` },
  { id: 'r13', kind: 'rule', number: '13', title: 'Overtaking', part: PARTS.B2, text: `
(a) Notwithstanding anything contained in the Rules of Part B, Sections I and II, any vessel overtaking any other shall keep out of the way of the vessel being overtaken.
(b) A vessel shall be deemed to be overtaking when coming up with another vessel from a direction more than 22.5 degrees abaft her beam, that is, in such a position with reference to the vessel she is overtaking, that at night she would be able to see only the sternlight of that vessel but neither of her sidelights.
(c) When a vessel is in any doubt as to whether she is overtaking another, she shall assume that this is the case and act accordingly.
(d) Any subsequent alteration of the bearing between the two vessels shall not make the overtaking vessel a crossing vessel within the meaning of these Rules or relieve her of the duty of keeping clear of the overtaken vessel until she is finally past and clear.
` },
  { id: 'r14', kind: 'rule', number: '14', title: 'Head-on situation', part: PARTS.B2, text: `
(a) When two power-driven vessels are meeting on reciprocal or nearly reciprocal courses so as to involve risk of collision each shall alter her course to starboard so that each shall pass on the port side of the other.
(b) Such a situation shall be deemed to exist when a vessel sees the other ahead or nearly ahead and by night she could see the masthead lights of the other in a line or nearly in a line and/or both sidelights and by day she observes the corresponding aspect of the other vessel.
(c) When a vessel is in any doubt as to whether such a situation exists she shall assume that it does exist and act accordingly.
` },
  { id: 'r15', kind: 'rule', number: '15', title: 'Crossing situation', part: PARTS.B2, text: `
When two power-driven vessels are crossing so as to involve risk of collision, the vessel which has the other on her own starboard side shall keep out of the way and shall, if the circumstances of the case admit, avoid crossing ahead of the other vessel.
` },
  { id: 'r16', kind: 'rule', number: '16', title: 'Action by give-way vessel', part: PARTS.B2, text: `
Every vessel which is directed to keep out of the way of another vessel shall, so far as possible, take early and substantial action to keep well clear.
` },
  { id: 'r17', kind: 'rule', number: '17', title: 'Action by stand-on vessel', part: PARTS.B2, text: `
(a) 
  (i) Where one of two vessels is to keep out of the way the other shall keep her course and speed.
  (ii) The latter vessel may however take action to avoid collision by her manoeuvre alone, as soon as it becomes apparent to her that the vessel required to keep out of the way is not taking appropriate action in compliance with these Rules.
(b) When, from any cause, the vessel required to keep her course and speed finds herself so close that collision cannot be avoided by the action of the give-way vessel alone, she shall take such action as will best aid to avoid collision.
(c) A power-driven vessel which takes action in a crossing situation in accordance with sub-paragraph (a)(ii) of this Rule to avoid collision with another power-driven vessel shall, if the circumstances of the case admit, not alter course to port for a vessel on her own port side.
(d) This Rule does not relieve the give-way vessel of her obligation to keep out of the way.
` },
  { id: 'r18', kind: 'rule', number: '18', title: 'Responsibilities between vessels', part: PARTS.B2, text: `
Except where Rules 9, 10 and 13 otherwise require:
(a) A power-driven vessel underway shall keep out of the way of:
  (i) a vessel not under command;
  (ii) a vessel restricted in her ability to manoeuvre;
  (iii) a vessel engaged in fishing;
  (iv) a sailing vessel.
(b) A sailing vessel underway shall keep out of the way of:
  (i) a vessel not under command;
  (ii) a vessel restricted in her ability to manoeuvre;
  (iii) a vessel engaged in fishing.
(c) A vessel engaged in fishing when underway shall, so far as possible, keep out of the way of:
  (i) a vessel not under command;
  (ii) a vessel restricted in her ability to manoeuvre.
(d) 
  (i) Any vessel other than a vessel not under command or a vessel restricted in her ability to manoeuvre shall, if the circumstances of the case admit, avoid impeding the safe passage of a vessel constrained by her draught, exhibiting the signals in Rule 28.
  (ii) A vessel constrained by her draught shall navigate with particular caution having full regard to her special condition.
(e) A seaplane on the water shall, in general, keep well clear of all vessels and avoid impeding their navigation. In circumstances, however, where risk of collision exists, she shall comply with the Rules of this Part.
(f) 
  (i) A WIG craft shall, when taking off, landing and in flight near the surface, keep well clear of all other vessels and avoid impeding their navigation;
  (ii) a WIG craft operating on the water surface shall comply with the Rules of this Part as a power-driven vessel.
` },
  { id: 'r19', kind: 'rule', number: '19', title: 'Conduct of vessels in restricted visibility', part: PARTS.B3, text: `
(a) This Rule applies to vessels not in sight of one another when navigating in or near an area of restricted visibility.
(b) Every vessel shall proceed at a safe speed adapted to the prevailing circumstances and conditions of restricted visibility. A power-driven vessel shall have her engines ready for immediate manoeuvre.
(c) Every vessel shall have due regard to the prevailing circumstances and conditions of restricted visibility when complying with the Rules of Section I of this Part.
(d) A vessel which detects by radar alone the presence of another vessel shall determine if a close-quarters situation is developing and/or risk of collision exists. If so, she shall take avoiding action in ample time, provided that when such action consists of an alteration of course, so far as possible the following shall be avoided:
  (i) an alteration of course to port for a vessel forward of the beam, other than for a vessel being overtaken;
  (ii) an alteration of course towards a vessel abeam or abaft the beam.
(e) Except where it has been determined that a risk of collision does not exist, every vessel which hears apparently forward of her beam the fog signal of another vessel, or which cannot avoid a close-quarters situation with another vessel forward of her beam, shall reduce her speed to the minimum at which she can be kept on her course. She shall if necessary take all her way off and in any event navigate with extreme caution until danger of collision is over.
` },
];
