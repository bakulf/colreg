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
    teachingNote:
      'Get the student to draw the arcs once on a blank circle. 22.5 degrees abaft the beam is where the sidelight ends and the sternlight begins, and that same bearing defines the overtaking sector in Rule 13.',
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
    teachingNote:
      'Three length bands: 50m and over, 12 to 50m, under 12m. Have the student reproduce the grid rather than memorise isolated numbers.',
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
    teachingNote:
      'Two masthead lights is the best size cue available at night, and the relative bearing between them is the best aspect cue. Teach the student to read the pair, not just to count them.',
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
      'Rule 25(b). The tricolour is seen further in a seaway, but it is also easily lost against shore lights and sits above the horizon of a nearby ship\'s bridge — worth saying out loud when teaching, because it is a real decision for a yacht.',
    misconception:
      'The tricolour may not be shown together with the optional all-round red-over-green masthead lights of Rule 25(c).',
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
    teachingNote:
      '"Red over green, sailing machine" is the usual jingle. It is optional and increasingly rare, but it appears in exams precisely because it is rare.',
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
    teachingNote:
      '"Green over white, trawling at night; red over white, fishing at night." The pair only works if the student also knows that trawling means dragging a net or dredge through the water, and everything else fishing is Rule 26(c).',
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
    teachingNote:
      'The "only when making way" qualifier is the part that gets dropped. It applies to NUC, RAM and fishing alike, and it is how you tell a drifting casualty from one still moving.',
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
    teachingNote:
      'Red for the blocked side, green for the clear side, reading exactly like the colours a helmsman already associates with stop and go. Make the student say which side they would pass, not just name the lights.',
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
    teachingNote:
      '"White over red, pilot ahead." Also worth noting she keeps her anchor light as well when anchored — one of the few cases where two sets of lights are shown together.',
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
    misconception:
      'The two-lights-three-shapes asymmetry is the trap, and it is asked often. There is no logic to recover it from; it simply has to be known.',
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
    teachingNote:
      'Two different lengths for two different exemptions — 7 metres anchored, 12 metres aground. Easy marks for a candidate who has noticed, easy loss for one who has not.',
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
    teachingNote:
      'Count the vertical whites before you decide what you are looking at. Three of them at night means at least 200 metres of unlit or dimly lit water behind her, and that is the single most dangerous thing a small craft can misread.',
  }),
];
