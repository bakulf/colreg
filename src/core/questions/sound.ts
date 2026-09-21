import type { Question } from '../types.ts';
import { mcq } from './helpers.ts';

/**
 * Part D: sound and light signals, Rules 32 to 37.
 *
 * From M3 these concepts are also drilled by the audio trainer, which plays the
 * real blast pattern and asks you to name it. The text questions below carry the
 * intervals, thresholds and equipment rules that audio cannot convey.
 */
export const SOUND_QUESTIONS: Question[] = [
  mcq({
    id: 'snd-blast-durations',
    topic: 'sound',
    concept: 'rule32:durations',
    difficulty: 1,
    prompt: 'How long is a prolonged blast?',
    answer: 'From four to six seconds',
    distractors: [
      'About one second',
      'From two to three seconds',
      'From six to eight seconds',
    ],
    ruleRefs: ['Rule 32(b)', 'Rule 32(c)'],
    explanation:
      'Rule 32(c): a prolonged blast is a blast of from four to six seconds duration. Rule 32(b): a short blast is about one second.',
    teachingNote:
      'Make the student actually count it out loud. Four to six seconds is much longer than anyone expects, and a two-second toot is heard as a short blast — which in a manoeuvring signal means something entirely different.',
  }),
  mcq({
    id: 'snd-manoeuvring-port',
    topic: 'sound',
    concept: 'rule34:manoeuvring',
    difficulty: 1,
    prompt: 'Two power-driven vessels are in sight of one another. Two short blasts means:',
    answer: 'I am altering my course to port',
    distractors: [
      'I am altering my course to starboard',
      'I am operating astern propulsion',
      'I intend to overtake you on your port side',
    ],
    ruleRefs: ['Rule 34(a)'],
    explanation:
      'Rule 34(a): one short blast, I am altering my course to starboard; two short, to port; three short, I am operating astern propulsion.',
    misconception:
      'These signals state what you are doing, not what you intend to do. The Rule says "when manoeuvring as authorized or required by these Rules" — you sound them as you act.',
  }),
  mcq({
    id: 'snd-three-short',
    topic: 'sound',
    concept: 'rule34:astern-propulsion',
    difficulty: 2,
    prompt: 'Three short blasts means:',
    answer: 'I am operating astern propulsion',
    distractors: [
      'I am going astern through the water',
      'My engines are stopped',
      'I am turning short round to starboard',
    ],
    ruleRefs: ['Rule 34(a)'],
    explanation:
      'The signal is about the engines, not about movement. A large vessel sounding three short blasts may still be making several knots ahead — she has just put the engines astern and will carry her way for a long time yet.',
    teachingNote:
      'This distinction is worth labouring. Hearing three shorts and assuming the ship is now backing away from you is a good way to be run down.',
  }),
  mcq({
    id: 'snd-doubt',
    topic: 'sound',
    concept: 'rule34:doubt-signal',
    difficulty: 1,
    prompt: 'You doubt whether a vessel approaching you is taking sufficient action to avoid collision. You shall indicate that doubt by:',
    answer: 'At least five short and rapid blasts on the whistle',
    distractors: [
      'Five prolonged blasts on the whistle',
      'One prolonged blast followed by five short blasts',
      'Three short and rapid blasts on the whistle',
    ],
    ruleRefs: ['Rule 34(d)'],
    explanation:
      'Rule 34(d): at least five short and rapid blasts, which may be supplemented by a light signal of at least five short and rapid flashes. Note "at least" — five is the minimum, not the number.',
    teachingNote:
      'It is a mandatory signal ("shall"), not an optional expression of irritation, and Rule 34(d) applies to vessels in sight of one another.',
  }),
  mcq({
    id: 'snd-bend',
    topic: 'sound',
    concept: 'rule34:blind-bend',
    difficulty: 2,
    prompt: 'You are approaching a bend in a channel where other vessels may be obscured by an intervening obstruction. You shall sound:',
    answer: 'One prolonged blast, to be answered by any approaching vessel within hearing with one prolonged blast',
    distractors: [
      'Two prolonged blasts, answered by two prolonged blasts',
      'Five short and rapid blasts',
      'One prolonged blast followed by one short blast',
    ],
    ruleRefs: ['Rule 34(e)'],
    explanation:
      'Rule 34(e). The answering signal is part of the rule: any vessel within hearing around the bend or behind the obstruction replies with one prolonged blast.',
  }),
  mcq({
    id: 'snd-overtake-narrow',
    topic: 'sound',
    concept: 'rule34:overtaking-signals',
    difficulty: 3,
    prompt: 'In a narrow channel, a vessel intending to overtake on the other vessel\'s starboard side sounds:',
    answer: 'Two prolonged blasts followed by one short blast',
    distractors: [
      'Two prolonged blasts followed by two short blasts',
      'One prolonged blast followed by one short blast',
      'One short blast',
    ],
    ruleRefs: ['Rule 34(c)(i)', 'Rule 34(c)(ii)', 'Rule 9(e)'],
    explanation:
      'Rule 34(c)(i): two prolonged then one short means I intend to overtake you on your starboard side; two prolonged then two short, on your port side. The vessel to be overtaken, if in agreement, sounds one prolonged, one short, one prolonged, one short — Rule 34(c)(ii).',
    teachingNote:
      'The short blasts follow the ordinary course-alteration convention: one short for starboard, two for port. Once the student sees that, only the two prolonged blasts as a prefix need to be remembered.',
  }),
  mcq({
    id: 'snd-rv-underway-stopped',
    topic: 'sound',
    concept: 'rule35:underway-stopped',
    difficulty: 2,
    prompt: 'In or near an area of restricted visibility, a power-driven vessel underway but stopped and making no way through the water shall sound:',
    answer: 'Two prolonged blasts in succession at intervals of not more than two minutes, with an interval of about two seconds between them',
    distractors: [
      'One prolonged blast at intervals of not more than two minutes',
      'One prolonged blast followed by two short blasts',
      'Three prolonged blasts in succession',
    ],
    ruleRefs: ['Rule 35(b)'],
    explanation:
      'Rule 35(a) gives one prolonged blast for a power-driven vessel making way; 35(b) gives two prolonged for one underway but stopped. This is where the underway / making way distinction pays off.',
  }),
  mcq({
    id: 'snd-rv-one-prolonged-two-short',
    topic: 'sound',
    concept: 'rule35:one-prolonged-two-short',
    difficulty: 3,
    prompt: 'In restricted visibility you hear one prolonged blast followed by two short blasts, repeated at intervals of about two minutes. Which of these could it NOT be?',
    answer: 'A power-driven vessel underway and making way through the water',
    distractors: [
      'A vessel engaged in fishing',
      'A sailing vessel',
      'A vessel restricted in her ability to manoeuvre',
    ],
    ruleRefs: ['Rule 35(c)'],
    explanation:
      'Rule 35(c) gives one prolonged plus two short to a whole group: not under command, restricted in ability to manoeuvre, constrained by draught, sailing, engaged in fishing, and towing or pushing. A power-driven vessel making way sounds one prolonged only.',
    teachingNote:
      'Six categories share this one signal, so it narrows down what she is and no further. It establishes no stand-on or give-way relationship: you are not in sight of one another, so Rules 11 to 18 do not apply and your conduct is governed by Rule 19 — both of you take avoiding action in ample time.',
  }),
  mcq({
    id: 'snd-rv-towed',
    topic: 'sound',
    concept: 'rule35:vessel-towed',
    difficulty: 3,
    prompt: 'A manned vessel being towed, or the last vessel of a tow if more than one is manned, shall sound in restricted visibility:',
    answer: 'One prolonged blast followed by three short blasts, immediately after the signal made by the towing vessel',
    distractors: [
      'One prolonged blast followed by two short blasts',
      'Three short blasts only',
      'Nothing; the towing vessel signals for the whole tow',
    ],
    ruleRefs: ['Rule 35(e)'],
    explanation:
      'Rule 35(e), sounded at intervals of not more than two minutes and, where practicable, immediately after the signal made by the towing vessel.',
    teachingNote:
      'Hearing the pair — one long two short, then one long three short — tells you there is a tow and roughly how far the far end is. That is genuinely useful information in fog.',
  }),
  mcq({
    id: 'snd-anchored-bell',
    topic: 'sound',
    concept: 'rule35:anchored',
    difficulty: 2,
    prompt: 'A vessel of 60 metres at anchor in fog shall sound:',
    answer: 'Rapid ringing of the bell for about five seconds at intervals of not more than one minute',
    distractors: [
      'Rapid ringing of the bell for about five seconds at intervals of not more than two minutes',
      'Rapid ringing of the bell forward and a gong aft, at intervals of not more than one minute',
      'One prolonged blast at intervals of not more than two minutes',
    ],
    ruleRefs: ['Rule 35(g)'],
    explanation:
      'Rule 35(g): rapid ringing of the bell for about five seconds at intervals of not more than one minute. The bell forward plus the gong aft applies to a vessel of 100 metres or more — at 60 metres, bell only. She may in addition sound one short, one prolonged and one short blast to warn an approaching vessel.',
    misconception:
      'The anchored interval is one minute, not two. Most other fog signals in Rule 35 are two minutes, which is why this one is asked.',
  }),
  mcq({
    id: 'snd-equipment-thresholds',
    topic: 'sound',
    concept: 'rule33:equipment',
    difficulty: 2,
    prompt: 'A vessel of 12 metres or more in length shall be provided with:',
    answer: 'A whistle and a bell',
    distractors: [
      'A whistle only',
      'A whistle, a bell and a gong',
      'Some efficient sound signalling appliance of any kind',
    ],
    ruleRefs: ['Rule 33(a)', 'Rule 33(b)'],
    explanation:
      'Rule 33(a): 12 metres or more, whistle and bell; 100 metres or more, additionally a gong whose tone cannot be confused with the bell. Rule 33(b): a vessel of less than 12 metres is not obliged to carry these appliances but shall be provided with some other means of making an efficient sound signal.',
  }),
];
