import type { Question } from '../types.ts';
import { mcq } from './helpers.ts';

/**
 * Part C: lights and shapes, Rules 20 to 31.
 *
 * These are placeholders in the sense that matters: from M1 the same concepts
 * are drilled by the renderer, which draws the vessel at a random aspect and
 * asks what you are looking at. The hand-written questions here cover the arcs,
 * ranges and edge cases that a picture cannot ask about.
 */
export const LIGHT_QUESTIONS: Question[] = [
  mcq({
    id: 'lgt-arcs-masthead',
    topic: 'lights',
    concept: 'rule21:arcs',
    difficulty: 1,
    prompt: 'Over what arc of the horizon does a masthead light show?',
    answer: '225 degrees — from right ahead to 22.5 degrees abaft the beam on either side',
    distractors: [
      '112.5 degrees on each side, 225 degrees in total, centred on the beam',
      '135 degrees, from right astern to 67.5 degrees on each side',
      '360 degrees, being an all-round light carried at the masthead',
    ],
    ruleRefs: ['Rule 21(a)'],
    explanation:
      'Rule 21(a). The three arcs to know cold: masthead 225, sidelight 112.5 each, sternlight 135. They sum to 225 + 135 = 360, which is the check that you have them right.',
  }),
  mcq({
    id: 'lgt-arc-sternlight',
    topic: 'lights',
    concept: 'rule21:sternlight',
    difficulty: 1,
    prompt: 'A sternlight is a white light showing over an arc of:',
    answer: '135 degrees, fixed so as to show 67.5 degrees from right aft on each side',
    distractors: [
      '112.5 degrees, fixed so as to show 56.25 degrees from right aft on each side',
      '225 degrees, fixed so as to show 112.5 degrees from right aft on each side',
      '180 degrees, showing over the whole of the after horizon',
    ],
    ruleRefs: ['Rule 21(c)'],
    explanation:
      'Rule 21(c). The 67.5 degrees each side is what puts the boundary 22.5 degrees abaft the beam.',
  }),
  mcq({
    id: 'lgt-range-under-12',
    topic: 'lights',
    concept: 'rule22:ranges',
    difficulty: 2,
    prompt: 'In a vessel of less than 12 metres in length, what is the minimum visibility range required of the sidelights?',
    answer: '1 mile',
    distractors: ['2 miles', '3 miles', '5 miles'],
    ruleRefs: ['Rule 22(c)'],
    explanation:
      'Rule 22(c): for a vessel under 12 metres the masthead light is 2 miles, sidelights 1 mile, sternlight 2 miles, towing light 2 miles and all-round lights 2 miles. The sidelights are the only 1 mile figure in the whole table, which is what makes it examinable.',
  }),
  mcq({
    id: 'lgt-second-masthead',
    topic: 'lights',
    concept: 'rule23:second-masthead',
    difficulty: 2,
    prompt: 'A power-driven vessel underway must exhibit a second masthead light abaft of and higher than the forward one when she is:',
    answer: '50 metres or more in length',
    distractors: [
      '20 metres or more in length',
      '100 metres or more in length',
      'Of any length, if she is making way through the water',
    ],
    ruleRefs: ['Rule 23(a)(ii)'],
    explanation:
      'Rule 23(a)(ii): a vessel of less than 50 metres in length shall not be obliged to exhibit the second masthead light but may do so.',
  }),
  mcq({
    id: 'lgt-tricolour-limit',
    topic: 'lights',
    concept: 'rule25:tricolour',
    difficulty: 2,
    prompt: 'A sailing vessel may combine her sidelights and sternlight in one lantern carried at or near the top of the mast if she is:',
    answer: 'Less than 20 metres in length',
    distractors: [
      'Less than 12 metres in length',
      'Less than 7 metres in length',
      'Of any length, provided she is not also using her deck-level lights',
    ],
    ruleRefs: ['Rule 25(b)'],
    explanation:
      'Rule 25(b). The tricolour is seen further in a seaway, but it is also easily lost against shore lights and sits above the horizon of a nearby ship\'s bridge, which makes it a real decision for a yacht.',
  }),
  mcq({
    id: 'lgt-sail-optional',
    topic: 'lights',
    concept: 'rule25:optional-red-green',
    difficulty: 2,
    prompt: 'A sailing vessel underway may, in addition to her sidelights and sternlight, exhibit at or near the top of the mast:',
    answer: 'Two all-round lights in a vertical line, the upper red and the lower green',
    distractors: [
      'Two all-round lights in a vertical line, the upper green and the lower red',
      'Two all-round red lights in a vertical line',
      'One all-round white light',
    ],
    ruleRefs: ['Rule 25(c)'],
    explanation:
      'Rule 25(c). Red over green, and Rule 25(c) forbids showing them with a combined tricolour lantern.',
  }),
  mcq({
    id: 'lgt-trawler',
    topic: 'lights',
    concept: 'rule26:trawling',
    difficulty: 2,
    prompt: 'A vessel engaged in trawling exhibits two all-round lights in a vertical line. What are they?',
    answer: 'Green over white',
    distractors: ['White over green', 'Red over white', 'White over red'],
    ruleRefs: ['Rule 26(b)'],
    explanation:
      'Rule 26(b): green over white for trawling, plus a masthead light abaft of and higher than the green if she is 50 metres or more, plus sidelights and sternlight when making way through the water.',
  }),
  mcq({
    id: 'lgt-fishing-gear',
    topic: 'lights',
    concept: 'rule26:outlying-gear',
    difficulty: 3,
    prompt: 'A vessel engaged in fishing other than trawling has gear extending more than 150 metres horizontally from the vessel. She shall exhibit:',
    answer: 'An all-round white light, or a cone apex upwards, in the direction of the gear',
    distractors: [
      'An all-round red light in the direction of the gear',
      'Two all-round white lights in a vertical line in the direction of the gear',
      'Nothing additional; the red over white lights suffice',
    ],
    ruleRefs: ['Rule 26(c)(ii)'],
    explanation:
      'Rule 26(c)(ii). The 150 metre threshold and the "in the direction of the gear" are both examinable; the light tells you which side you must not pass.',
  }),
  mcq({
    id: 'lgt-nuc',
    topic: 'lights',
    concept: 'rule27:nuc',
    difficulty: 1,
    prompt: 'A vessel not under command exhibits:',
    answer: 'Two all-round red lights in a vertical line, and sidelights and a sternlight only when making way through the water',
    distractors: [
      'Two all-round red lights in a vertical line, plus sidelights and sternlight at all times',
      'Three all-round red lights in a vertical line',
      'Red, white, red all-round lights in a vertical line',
    ],
    ruleRefs: ['Rule 27(a)'],
    explanation:
      'Rule 27(a). By day, two balls. Red-white-red is restricted in ability to manoeuvre, Rule 27(b); three reds is constrained by draught, Rule 28.',
  }),
  mcq({
    id: 'lgt-ram',
    topic: 'lights',
    concept: 'rule27:ram',
    difficulty: 2,
    prompt: 'What shapes does a vessel restricted in her ability to manoeuvre exhibit by day?',
    answer: 'Ball, diamond, ball, in a vertical line',
    distractors: [
      'Diamond, ball, diamond, in a vertical line',
      'Three balls in a vertical line',
      'Two balls in a vertical line',
    ],
    ruleRefs: ['Rule 27(b)(ii)'],
    explanation:
      'Rule 27(b): red, white, red lights; ball, diamond, ball shapes. The shapes mirror the lights — the white light and the diamond both sit in the middle.',
  }),
  mcq({
    id: 'lgt-dredger',
    topic: 'lights',
    concept: 'rule27:dredging-obstruction',
    difficulty: 3,
    prompt: 'A dredger at work has an obstruction on her port side. In addition to her restricted-in-ability-to-manoeuvre lights she exhibits:',
    answer: 'Two all-round red lights in a vertical line on the port side, and two all-round green lights in a vertical line on the starboard side',
    distractors: [
      'Two all-round green lights on the port side and two all-round red on the starboard side',
      'Two all-round red lights on the port side only',
      'One all-round red light on the port side and one all-round green on the starboard side',
    ],
    ruleRefs: ['Rule 27(d)'],
    explanation:
      'Rule 27(d): two reds mark the side on which the obstruction exists, two greens the side on which another vessel may pass. By day, two balls and two diamonds respectively.',
  }),
  mcq({
    id: 'lgt-pilot',
    topic: 'lights',
    concept: 'rule29:pilot',
    difficulty: 1,
    prompt: 'A pilot vessel on pilotage duty exhibits at or near the masthead:',
    answer: 'Two all-round lights in a vertical line, the upper white and the lower red',
    distractors: [
      'Two all-round lights in a vertical line, the upper red and the lower white',
      'Two all-round white lights in a vertical line',
      'An all-round white light and a flashing yellow light',
    ],
    ruleRefs: ['Rule 29(a)'],
    explanation:
      'Rule 29(a): white over red, plus sidelights and sternlight when underway, plus the anchor light or lights when at anchor.',
  }),
  mcq({
    id: 'lgt-aground',
    topic: 'lights',
    concept: 'rule30:aground',
    difficulty: 2,
    prompt: 'A vessel aground exhibits:',
    answer: 'Her anchor light or lights, plus two all-round red lights in a vertical line',
    distractors: [
      'Two all-round red lights in a vertical line only',
      'Three all-round red lights in a vertical line',
      'Her anchor lights plus three all-round red lights in a vertical line',
    ],
    ruleRefs: ['Rule 30(d)'],
    explanation:
      'Rule 30(d): anchor lights plus two all-round reds. By day, three balls in a vertical line — note the mismatch, two lights but three shapes.',
  }),
  mcq({
    id: 'lgt-anchor-under-7',
    topic: 'lights',
    concept: 'rule30:small-vessel-anchored',
    difficulty: 3,
    prompt: 'A vessel of less than 7 metres at anchor is not required to show an anchor light provided she is:',
    answer: 'Not in or near a narrow channel, fairway or anchorage, or where other vessels normally navigate',
    distractors: [
      'Anchored in daylight only',
      'Anchored in less than 5 metres of water',
      'Showing a radar reflector instead',
    ],
    ruleRefs: ['Rule 30(e)'],
    explanation:
      'Rule 30(e). Rule 30(f) gives a parallel exemption from the aground lights and shapes for vessels of less than 12 metres.',
  }),
  mcq({
    id: 'lgt-tow-over-200',
    topic: 'lights',
    concept: 'rule24:tow-length',
    difficulty: 2,
    prompt: 'A power-driven vessel towing astern shows three masthead lights in a vertical line. This tells you that:',
    answer: 'The length of the tow, measured from the stern of the towing vessel to the after end of the tow, exceeds 200 metres',
    distractors: [
      'The towing vessel herself is more than 200 metres in length',
      'She is towing three vessels',
      'The tow is a vessel not under command',
    ],
    ruleRefs: ['Rule 24(a)(i)'],
    explanation:
      'Rule 24(a)(i): two masthead lights in a vertical line, or three when the length of the tow exceeds 200 metres. By day a diamond shape is shown by both the towing vessel and the tow when the tow exceeds 200 metres.',
  }),
  mcq({
    id: 'lgt-when-exhibited',
    topic: 'lights',
    concept: 'rule20:when-lights',
    difficulty: 1,
    prompt: 'Rule 20 requires the prescribed lights to be exhibited:',
    answer: 'From sunset to sunrise, and from sunrise to sunset in restricted visibility',
    distractors: [
      'From one hour after sunset to one hour before sunrise, and in fog',
      'From sunset to sunrise only, whatever the visibility by day',
      'From the end of civil twilight to its start, and whenever raining',
    ],
    ruleRefs: ['Rule 20(b)', 'Rule 20(c)'],
    explanation:
      'Rule 20(b): the lights shall be exhibited from sunset to sunrise, and during that time no other lights shall be shown that could be mistaken for them, impair their visibility or distinctive character, or interfere with the look-out. Rule 20(c): they shall also be exhibited from sunrise to sunset in restricted visibility, and may be in all other circumstances when deemed necessary.',
  }),
  mcq({
    id: 'lgt-shapes-by-day',
    topic: 'lights',
    concept: 'rule20:shapes-by-day',
    difficulty: 1,
    prompt: 'When must the shapes prescribed by the Rules be exhibited?',
    answer: 'By day',
    distractors: [
      'By day and by night',
      'By day, only in restricted visibility',
      'Only when the lights have failed',
    ],
    ruleRefs: ['Rule 20(d)', 'Rule 20(a)'],
    explanation:
      'Rule 20(d): the Rules concerning shapes shall be complied with by day. Rule 20(a) adds that the Rules of Part C shall be complied with in all weathers. In restricted visibility by day a vessel shows both her lights (Rule 20(c)) and her shapes.',
  }),
  mcq({
    id: 'lgt-flashing-rate',
    topic: 'lights',
    concept: 'rule21:flashing',
    difficulty: 2,
    prompt: 'A "flashing light" in the Rules is a light flashing at regular intervals at a frequency of:',
    answer: '120 flashes or more per minute',
    distractors: [
      '60 flashes or more per minute',
      '50 to 80 flashes per minute',
      '30 flashes or more per minute',
    ],
    ruleRefs: ['Rule 21(f)'],
    explanation:
      'Rule 21(f): 120 flashes or more per minute. The Rules use flashing lights for an air-cushion vessel in the non-displacement mode (yellow, Rule 23(b)) and a WIG craft taking off, landing or flying near the surface (red, Rule 23(c)).',
  }),
  mcq({
    id: 'lgt-range-50m-plus',
    topic: 'lights',
    concept: 'rule22:ranges-50m',
    difficulty: 2,
    prompt: 'In a vessel of 50 metres or more in length, the minimum ranges of the masthead light and the sidelights are:',
    answer: 'Masthead light 6 miles, sidelights 3 miles',
    distractors: [
      'Masthead light 5 miles, sidelights 2 miles',
      'Masthead light 6 miles, sidelights 6 miles',
      'Masthead light 3 miles, sidelights 3 miles',
    ],
    ruleRefs: ['Rule 22(a)'],
    explanation:
      'Rule 22(a): for vessels of 50 metres or more, masthead light 6 miles; sidelight, sternlight, towing light and white, red, green or yellow all-round light, 3 miles.',
  }),
  mcq({
    id: 'lgt-range-12-to-50',
    topic: 'lights',
    concept: 'rule22:ranges-12-50m',
    difficulty: 3,
    prompt: 'What is the minimum range required of the masthead light of a power-driven vessel 15 metres in length?',
    answer: '3 miles',
    distractors: ['2 miles', '5 miles', '6 miles'],
    ruleRefs: ['Rule 22(b)'],
    explanation:
      'Rule 22(b), vessels of 12 metres or more but less than 50 metres: masthead light 5 miles, except that where the vessel is less than 20 metres, 3 miles; sidelight, sternlight, towing light and all-round lights 2 miles.',
  }),
  mcq({
    id: 'lgt-air-cushion',
    topic: 'lights',
    concept: 'rule23:air-cushion',
    difficulty: 2,
    prompt: 'An air-cushion vessel operating in the non-displacement mode exhibits, in addition to the lights of a power-driven vessel underway:',
    answer: 'An all-round flashing yellow light',
    distractors: [
      'A high-intensity all-round flashing red light',
      'Two all-round yellow lights in a vertical line',
      'An all-round flashing blue light',
    ],
    ruleRefs: ['Rule 23(b)'],
    explanation:
      'Rule 23(b): masthead light(s), sidelights and sternlight plus an all-round flashing yellow light. The high-intensity flashing red light belongs to a WIG craft taking off, landing or flying near the surface, Rule 23(c).',
  }),
  mcq({
    id: 'lgt-wig',
    topic: 'lights',
    concept: 'rule23:wig',
    difficulty: 2,
    prompt: 'A WIG craft, only when taking off, landing and in flight near the surface, exhibits in addition to the lights of a power-driven vessel:',
    answer: 'A high-intensity all-round flashing red light',
    distractors: [
      'An all-round flashing yellow light',
      'Two all-round red lights in a vertical line',
      'A high-intensity all-round flashing white light',
    ],
    ruleRefs: ['Rule 23(c)'],
    explanation:
      'Rule 23(c). On the water surface she shows only the lights of a power-driven vessel. Two all-round reds would mean not under command; the flashing yellow is an air-cushion vessel, Rule 23(b).',
  }),
  mcq({
    id: 'lgt-displaced-under-12',
    topic: 'lights',
    concept: 'rule23:displaced-light',
    difficulty: 3,
    prompt: 'On a power-driven vessel of less than 12 metres, the masthead light or all-round white light may be displaced from the centreline if centreline fitting is not practicable, provided that:',
    answer: 'The sidelights are combined in one lantern on the centreline, or as nearly as practicable in line with the white light',
    distractors: [
      'A second all-round white light is carried on the opposite side to balance it',
      'Her maximum speed does not exceed 7 knots and she is less than 7 metres long',
      'The sidelights are carried in separate lanterns at least 1 metre below the white light',
    ],
    ruleRefs: ['Rule 23(d)(iii)'],
    explanation:
      'Rule 23(d)(iii): the sidelights must be combined in one lantern carried on the fore and aft centreline, or located as nearly as practicable in the same fore and aft line as the masthead light or all-round white light.',
  }),
  mcq({
    id: 'lgt-tow-over-50',
    topic: 'lights',
    concept: 'rule24:towing-vessel-50m',
    difficulty: 3,
    prompt: 'A power-driven vessel 60 metres long is towing astern; the tow is 150 metres long. Which masthead lights does she exhibit?',
    answer: 'Two masthead lights in a vertical line, plus the second masthead light required of a vessel of 50 metres or more',
    distractors: [
      'Two masthead lights in a vertical line only, since towing lights replace the second masthead light',
      'Three masthead lights in a vertical line, because the towing vessel is 50 metres or more in length',
      'One masthead light forward and one aft, as for any power-driven vessel of her length',
    ],
    ruleRefs: ['Rule 24(d)', 'Rule 24(a)(i)', 'Rule 23(a)(ii)'],
    explanation:
      'Rule 24(a)(i): two masthead lights in a vertical line (three only if the tow exceeds 200 metres) instead of the forward or the after masthead light. Rule 24(d): she shall also comply with Rule 23(a)(ii), so at 50 metres or more she also shows the other masthead light.',
  }),
  mcq({
    id: 'lgt-tow-diamond',
    topic: 'lights',
    concept: 'rule24:tow-diamond',
    difficulty: 2,
    prompt: 'By day a tug is towing a barge astern; the length of the tow, from the tug\'s stern to the after end of the barge, is 250 metres. Which vessels exhibit a diamond shape?',
    answer: 'Both the tug and the barge, each where it can best be seen',
    distractors: [
      'The tug only, since she is responsible for the tow',
      'The barge only, at her aftermost extremity',
      'Neither; a diamond is needed only for tows over 500 metres',
    ],
    ruleRefs: ['Rule 24(e)(iii)', 'Rule 24(a)(v)'],
    explanation:
      'Rule 24(a)(v) requires the towing vessel, and Rule 24(e)(iii) the vessel or object being towed, to exhibit a diamond shape where it can best be seen when the length of the tow exceeds 200 metres.',
  }),
  mcq({
    id: 'lgt-submerged-tow',
    topic: 'lights',
    concept: 'rule24:submerged-tow',
    difficulty: 3,
    prompt: 'An inconspicuous, partly submerged object 30 metres wide and 90 metres long is being towed. In addition to one all-round white light at or near each end, it exhibits:',
    answer: 'Two all-round white lights at or near the extremities of its breadth',
    distractors: [
      'All-round white lights along its length, not more than 100 metres apart',
      'An all-round red light at or near each extremity of its breadth',
      'Nothing more; the lights at each end suffice at any breadth',
    ],
    ruleRefs: ['Rule 24(g)'],
    explanation:
      'Rule 24(g): under 25 metres in breadth, one all-round white light at or near each end (dracones need not show the forward one); 25 metres or more, two more at the extremities of its breadth; over 100 metres long, additional lights between so that they are no more than 100 metres apart. By day, a diamond at or near the aftermost extremity.',
  }),
  mcq({
    id: 'lgt-tow-unlit',
    topic: 'lights',
    concept: 'rule24:tow-cannot-be-lit',
    difficulty: 2,
    prompt: 'For some sufficient cause it is impracticable for a vessel being towed to exhibit her prescribed lights. Rule 24(h) requires:',
    answer: 'All possible measures to light her, or at least to indicate her presence',
    distractors: [
      'That the tow be stopped and anchored until daylight',
      'That the towing vessel show the lights of a vessel not under command',
      'Nothing further, since the towing lights warn of the tow',
    ],
    ruleRefs: ['Rule 24(h)'],
    explanation:
      'Rule 24(h): where from any sufficient cause it is impracticable for a vessel or object being towed to exhibit the lights or shapes of Rule 24(e) or (g), all possible measures shall be taken to light the vessel or object towed or at least to indicate its presence.',
  }),
  mcq({
    id: 'lgt-assistance-tow',
    topic: 'lights',
    concept: 'rule24:assistance-tow',
    difficulty: 3,
    prompt: 'A motor cruiser not normally engaged in towing takes a disabled yacht in tow at night and cannot exhibit towing lights. Under Rule 24(i):',
    answer: 'She need not exhibit them, but shall take all possible measures to indicate the tow, especially by lighting the towline',
    distractors: [
      'She must not tow at night unless she can exhibit the full lights of Rule 24(a)',
      'She shall exhibit two all-round red lights to show she is unable to keep out of the way',
      'She shall exhibit the distress signals of Annex IV for as long as the tow continues',
    ],
    ruleRefs: ['Rule 24(i)'],
    explanation:
      'Rule 24(i): a vessel not normally engaged in towing is not required to exhibit the lights of Rule 24(a) or (c) when towing a vessel in distress or otherwise in need of assistance, if it is impracticable. All possible measures, as authorised by Rule 36, shall be taken to indicate the relationship, in particular by illuminating the towline.',
  }),
  mcq({
    id: 'lgt-small-sail-oars',
    topic: 'lights',
    concept: 'rule25:small-sail-oars',
    difficulty: 1,
    prompt: 'A sailing dinghy of 5 metres underway at night is not exhibiting sidelights and a sternlight. She shall:',
    answer: 'Have ready at hand a torch or lighted lantern showing a white light, to be shown in time to prevent collision',
    distractors: [
      'Exhibit an all-round white light at the masthead throughout the hours of darkness',
      'Stay ashore between sunset and sunrise, since she cannot carry the prescribed lights',
      'Show a white light only in restricted visibility, when she cannot otherwise be seen',
    ],
    ruleRefs: ['Rule 25(d)(i)', 'Rule 25(d)(ii)'],
    explanation:
      'Rule 25(d)(i): a sailing vessel of less than 7 metres shall, if practicable, exhibit sidelights and sternlight (or a tricolour), but if she does not, she shall have ready at hand an electric torch or lighted lantern showing a white light, exhibited in sufficient time to prevent collision. Rule 25(d)(ii) gives the same option to a vessel under oars of any length.',
  }),
  mcq({
    id: 'lgt-motorsailing-cone',
    topic: 'lights',
    concept: 'rule25:motorsailing-cone',
    difficulty: 1,
    prompt: 'By day, a vessel proceeding under sail while also being propelled by machinery exhibits forward, where it can best be seen:',
    answer: 'A conical shape, apex downwards',
    distractors: [
      'A conical shape, apex upwards',
      'A black ball',
      'Two cones with their apexes together',
    ],
    ruleRefs: ['Rule 25(e)'],
    explanation:
      'Rule 25(e). With her engine in use she is a power-driven vessel under Rules 3(b) and 3(c), and the cone tells others so. Two cones apex to apex mean a vessel engaged in fishing, Rule 26.',
  }),
  mcq({
    id: 'lgt-not-fishing',
    topic: 'lights',
    concept: 'rule26:not-fishing',
    difficulty: 1,
    prompt: 'A trawler is steaming back to port at night with her gear stowed. She shall exhibit:',
    answer: 'Only the lights prescribed for a vessel of her length',
    distractors: [
      'Her trawling lights, since she is a fishing vessel',
      'Her trawling lights until she is within harbour limits',
      'Her trawling lights, but without sidelights and sternlight',
    ],
    ruleRefs: ['Rule 26(e)'],
    explanation:
      'Rule 26(e): a vessel when not engaged in fishing shall not exhibit the lights or shapes prescribed in Rule 26, but only those prescribed for a vessel of her length. The status depends on what she is doing, not on what kind of vessel she is.',
  }),
  mcq({
    id: 'lgt-ram-anchored',
    topic: 'lights',
    concept: 'rule27:ram-at-anchor',
    difficulty: 2,
    prompt: 'A vessel servicing a navigation mark is at anchor and restricted in her ability to manoeuvre. At night she exhibits:',
    answer: 'Red, white, red all-round lights in a vertical line, plus her anchor light or lights',
    distractors: [
      'Red, white, red all-round lights in a vertical line, instead of anchor lights',
      'Her anchor light or lights only, since at anchor she is not manoeuvring',
      'Red, white, red all-round lights plus masthead lights, sidelights and sternlight',
    ],
    ruleRefs: ['Rule 27(b)(iv)', 'Rule 30'],
    explanation:
      'Rule 27(b)(iv): when at anchor, in addition to the red-white-red lights (or ball-diamond-ball by day), the light, lights or shape prescribed in Rule 30. A dredger or vessel in underwater operations with an obstruction is the exception, Rule 27(d)(iii).',
  }),
  mcq({
    id: 'lgt-dredger-anchored',
    topic: 'lights',
    concept: 'rule27:dredger-at-anchor',
    difficulty: 3,
    prompt: 'A dredger at work at anchor, with an obstruction on one side, exhibits at night:',
    answer: 'Red, white, red plus the obstruction and passing-side lights, instead of her anchor lights',
    distractors: [
      'Red, white, red plus the obstruction and passing-side lights, and her anchor lights',
      'Her anchor lights plus two all-round red lights on the obstructed side only',
      'Her anchor lights plus the obstruction and passing-side lights, but not red, white, red',
    ],
    ruleRefs: ['Rule 27(d)(iii)', 'Rule 27(b)(iv)'],
    explanation:
      'Rule 27(d)(iii): when at anchor, the lights or shapes of Rule 27(d) are exhibited instead of the lights or shape prescribed in Rule 30. This differs from other restricted vessels at anchor, which add anchor lights under Rule 27(b)(iv).',
  }),
  mcq({
    id: 'lgt-diving-flag',
    topic: 'lights',
    concept: 'rule27:diving-flag',
    difficulty: 2,
    prompt: 'A small dive boat cannot exhibit all the lights and shapes of Rule 27(d). By day she shall exhibit:',
    answer: 'A rigid replica of International Code flag "A", not less than 1 metre in height',
    distractors: [
      'A red flag with a white diagonal stripe, not less than 1 metre in height',
      'International Code flag "B" at the masthead, of any size',
      'A cloth International Code flag "A", not less than 0.5 metre in height',
    ],
    ruleRefs: ['Rule 27(e)'],
    explanation:
      'Rule 27(e): three all-round lights, red-white-red, and a rigid replica of flag "A" not less than 1 metre in height, with measures taken to ensure its all-round visibility. The red flag with a white diagonal is a national "diver down" flag with no standing under the Rules.',
  }),
  mcq({
    id: 'lgt-mine-clearance',
    topic: 'lights',
    concept: 'rule27:mine-clearance',
    difficulty: 2,
    prompt: 'Three all-round green lights, one near the foremast head and one at each end of the fore yard, indicate:',
    answer: 'A mine-clearance vessel, which it is dangerous to approach within 1000 metres',
    distractors: [
      'A mine-clearance vessel, which it is dangerous to approach within 500 metres',
      'A dredger, showing the side on which it is safe to pass',
      'A vessel engaged in fishing with gear extending more than 150 metres',
    ],
    ruleRefs: ['Rule 27(f)'],
    explanation:
      'Rule 27(f): three all-round green lights or three balls, in addition to her power-driven or anchor lights. They indicate that it is dangerous for another vessel to approach within 1000 metres of the mine clearance vessel.',
  }),
  mcq({
    id: 'lgt-27-under-12',
    topic: 'lights',
    concept: 'rule27:under-12-exemption',
    difficulty: 2,
    prompt: 'Vessels of less than 12 metres are not required to exhibit the lights and shapes of Rule 27, except those:',
    answer: 'Engaged in diving operations',
    distractors: [
      'Not under command',
      'Engaged in dredging',
      'Engaged in towing',
    ],
    ruleRefs: ['Rule 27(g)'],
    explanation:
      'Rule 27(g): vessels of less than 12 metres, except those engaged in diving operations, are not required to exhibit the lights and shapes of Rule 27. Small dive boats are common, and Rule 27(e) gives them the flag "A" option.',
  }),
  mcq({
    id: 'lgt-27-not-distress',
    topic: 'lights',
    concept: 'rule27:not-distress',
    difficulty: 1,
    prompt: 'What does Rule 27(h) say about the signals of vessels not under command and restricted in their ability to manoeuvre?',
    answer: 'They are not signals of vessels in distress and requiring assistance',
    distractors: [
      'They also indicate distress when shown by a vessel making no way',
      'They indicate distress whenever shown together with a sound signal',
      'They indicate that the vessel requires a tow',
    ],
    ruleRefs: ['Rule 27(h)', 'Rule 37'],
    explanation:
      'Rule 27(h): the signals prescribed in Rule 27 are not signals of vessels in distress and requiring assistance. Such signals are contained in Annex IV, as Rule 37 provides.',
  }),
  mcq({
    id: 'lgt-cbd-optional',
    topic: 'lights',
    concept: 'rule28:cbd-signals',
    difficulty: 2,
    prompt: 'Under Rule 28, a vessel constrained by her draught:',
    answer: 'May exhibit three all-round red lights in a vertical line, or a cylinder, in addition to her power-driven lights',
    distractors: [
      'Shall exhibit three all-round red lights in a vertical line, or a cylinder, instead of her masthead lights',
      'Shall exhibit two all-round red lights in a vertical line, or two balls, in addition to her other lights',
      'May exhibit three all-round red lights at night, but has no shape to exhibit by day',
    ],
    ruleRefs: ['Rule 28'],
    explanation:
      'Rule 28 is permissive: she "may" exhibit, in addition to the lights for power-driven vessels in Rule 23, three all-round red lights in a vertical line, or a cylinder. Two reds or two balls are not under command, Rule 27(a).',
  }),
  mcq({
    id: 'lgt-pilot-off-duty',
    topic: 'lights',
    concept: 'rule29:off-duty',
    difficulty: 1,
    prompt: 'A pilot vessel not engaged on pilotage duty exhibits:',
    answer: 'The lights or shapes prescribed for a similar vessel of her length',
    distractors: [
      'White over red all-round lights, without sidelights or sternlight',
      'White over red all-round lights, since she is always a pilot vessel',
      'A single all-round white light at the masthead',
    ],
    ruleRefs: ['Rule 29(b)'],
    explanation:
      'Rule 29(b). White over red is shown only when engaged on pilotage duty, Rule 29(a); off duty she is lit like any similar vessel.',
  }),
  mcq({
    id: 'lgt-anchor-under-50',
    topic: 'lights',
    concept: 'rule30:anchor-under-50',
    difficulty: 2,
    prompt: 'A vessel 40 metres long at anchor may exhibit:',
    answer: 'One all-round white light where it can best be seen, instead of the two anchor lights',
    distractors: [
      'Only her deck working lights, instead of any anchor light',
      'Two all-round red lights in a vertical line where they can best be seen',
      'No anchor light at all, provided she is outside a fairway',
    ],
    ruleRefs: ['Rule 30(b)', 'Rule 30(a)'],
    explanation:
      'Rule 30(a) prescribes an all-round white light (or one ball) in the fore part and a lower all-round white light at or near the stern. Rule 30(b): a vessel of less than 50 metres may instead exhibit one all-round white light where it can best be seen.',
  }),
  mcq({
    id: 'lgt-deck-lights',
    topic: 'lights',
    concept: 'rule30:deck-lights',
    difficulty: 2,
    prompt: 'Which vessels at anchor SHALL use their available working or equivalent lights to illuminate their decks?',
    answer: 'Vessels of 100 metres and more in length',
    distractors: [
      'Vessels of 50 metres and more in length',
      'All vessels at anchor, of any length',
      'None; illuminating the decks is always optional',
    ],
    ruleRefs: ['Rule 30(c)'],
    explanation:
      'Rule 30(c): a vessel at anchor may, and a vessel of 100 metres and more in length shall, also use the available working or equivalent lights to illuminate her decks.',
  }),
  mcq({
    id: 'lgt-aground-under-12',
    topic: 'lights',
    concept: 'rule30:small-vessel-aground',
    difficulty: 3,
    prompt: 'A vessel of 10 metres runs aground at night. Under Rule 30(f) she is not required to exhibit:',
    answer: 'The two all-round red lights in a vertical line prescribed for a vessel aground',
    distractors: [
      'Her anchor light, provided she shows two all-round red lights',
      'Any light or shape whatsoever, wherever she is aground',
      'Anything, unless she is aground in or near a narrow channel',
    ],
    ruleRefs: ['Rule 30(f)', 'Rule 30(d)'],
    explanation:
      'Rule 30(f): a vessel of less than 12 metres, when aground, is not required to exhibit the lights or shapes of Rule 30(d)(i) and (ii), the two all-round reds and three balls. Rule 30(d) still calls for the anchor light or lights of Rule 30(a) or (b).',
  }),
  mcq({
    id: 'lgt-seaplane',
    topic: 'lights',
    concept: 'rule31:seaplanes',
    difficulty: 2,
    prompt: 'It is impracticable for a seaplane to exhibit lights of the characteristics or in the positions prescribed in Part C. Rule 31 requires her to:',
    answer: 'Exhibit lights and shapes as closely similar in characteristics and position as possible',
    distractors: [
      'Show no lights, and keep clear of all vessels between sunset and sunrise',
      'Show her aviation navigation lights, which then take the place of the Rules',
      'Show the lights and shapes of a vessel not under command',
    ],
    ruleRefs: ['Rule 31'],
    explanation:
      'Rule 31 applies equally to a WIG craft: where it is impracticable to exhibit lights and shapes of the characteristics or in the positions prescribed, she shall exhibit lights and shapes as closely similar in characteristics and position as is possible.',
  }),
  mcq({
    id: 'lgt-pair-trawling',
    topic: 'lights',
    concept: 'annex2:pair-trawling',
    difficulty: 3,
    prompt: 'By night, each vessel of 20 metres or more engaged in pair trawling shall exhibit:',
    answer: 'A searchlight directed forward and in the direction of the other vessel of the pair',
    distractors: [
      'Two yellow lights in a vertical line, flashing alternately every second',
      'A searchlight directed astern, onto the net between the two vessels',
      'An all-round white light in the direction of the other vessel',
    ],
    ruleRefs: ['Annex II, 2(b)', 'Rule 26(d)'],
    explanation:
      'Annex II, 2(b)(i), applied by Rule 26(d) to vessels fishing in close proximity. When shooting or hauling, or when the nets are fast on an obstruction, they also show the Annex II, 2(a) lights. Alternately flashing yellow lights are for purse seiners, Annex II, 3.',
  }),
  mcq({
    id: 'lgt-trawl-hauling',
    topic: 'lights',
    concept: 'annex2:trawler-signals',
    difficulty: 3,
    prompt: 'A trawler of 20 metres or more, fishing in close proximity to other fishing vessels, exhibits the additional signal of one white light over one red light in a vertical line. This means she is:',
    answer: 'Hauling her nets',
    distractors: [
      'Shooting her nets',
      'Fast on an obstruction',
      'Fishing with purse seine gear',
    ],
    ruleRefs: ['Annex II, 2(a)', 'Rule 26(d)'],
    explanation:
      'Annex II, 2(a): shooting, two white lights in a vertical line; hauling, white over red; net fast upon an obstruction, two red lights. Annex II, 1: they are at least 0.9 metre apart, below the Rule 26 lights, and visible all round at at least 1 mile but less than the fishing lights.',
  }),
  mcq({
    id: 'lgt-sidelight-cutoff',
    topic: 'lights',
    concept: 'annex1:horizontal-sectors',
    difficulty: 3,
    prompt: 'In the forward direction, the intensity of sidelights shall decrease to reach practical cut-off:',
    answer: 'Between 1 and 3 degrees outside the prescribed sectors',
    distractors: [
      'Not more than 5 degrees outside the prescribed sectors',
      'Exactly at right ahead, with no overlap at all',
      'Between 5 and 10 degrees outside the prescribed sectors',
    ],
    ruleRefs: ['Annex I, 9(a)'],
    explanation:
      'Annex I, 9(a)(i). This small overlap is why both sidelights may be seen from right ahead. The "not more than 5 degrees" figure in 9(a)(ii) applies to sternlights, masthead lights, and sidelights at 22.5 degrees abaft the beam.',
  }),
];
