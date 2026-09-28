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
  }),
  mcq({
    id: 'snd-manoeuvring-port',
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
  }),
  mcq({
    id: 'snd-three-short',
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
  }),
  mcq({
    id: 'snd-doubt',
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
  }),
  mcq({
    id: 'snd-bend',
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
  }),
  mcq({
    id: 'snd-rv-underway-stopped',
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
  }),
  mcq({
    id: 'snd-rv-towed',
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
  }),
  mcq({
    id: 'snd-anchored-bell',
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
  }),
  mcq({
    id: 'snd-equipment-thresholds',
    concept: 'rule33:equipment',
    difficulty: 2,
    prompt: 'A vessel of 15 metres in length shall be provided with:',
    answer: 'A whistle',
    distractors: [
      'A whistle and a bell',
      'A whistle, a bell and a gong',
      'No appliance, only some other means of making an efficient sound signal',
    ],
    ruleRefs: ['Rule 33(a)', 'Rule 33(b)'],
    explanation:
      'Rule 33(a): 12 metres or more, a whistle; 20 metres or more, a bell in addition; 100 metres or more, a gong as well, whose tone cannot be confused with the bell. Rule 33(b): a vessel of less than 12 metres is not obliged to carry these appliances but shall be provided with some other means of making an efficient sound signal. Older texts put the bell at 12 metres. The 2001 amendments moved it to 20 metres, which is also why Rule 35(i) lets a vessel of 12 to 20 metres make some other efficient sound signal instead of the bell signals.',
  }),
  mcq({
    id: 'snd-whistle-definition',
    concept: 'rule32:whistle',
    difficulty: 2,
    prompt: 'The word "whistle" in the Rules means:',
    answer: 'Any sound signalling appliance capable of producing the prescribed blasts and complying with Annex III',
    distractors: [
      'A steam or air whistle mounted on the funnel or foremast of a power-driven vessel',
      'Any horn or siren audible at 2 miles or more, whatever its specification',
      'Any sound signalling appliance except an electric horn or aerosol foghorn',
    ],
    ruleRefs: ['Rule 32(a)'],
    explanation:
      'Rule 32(a): any sound signalling appliance capable of producing the prescribed blasts and which complies with the specifications in Annex III. An electric horn that meets Annex III is a whistle for the purposes of the Rules.',
  }),
  mcq({
    id: 'snd-light-signals',
    concept: 'rule34:light-signals',
    difficulty: 3,
    prompt: 'A power-driven vessel supplements her manoeuvring whistle signals with light signals under Rule 34(b). The flashes shall be:',
    answer: 'About one second each, about one second apart, with not less than ten seconds between successive signals',
    distractors: [
      'About two seconds each, about one second apart, with not less than five seconds between successive signals',
      'About half a second each, at the rate of a flashing light, with not less than one minute between signals',
      'About one second each, about two seconds apart, with not less than two minutes between successive signals',
    ],
    ruleRefs: ['Rule 34(b)(ii)', 'Rule 34(b)(iii)', 'Rule 34(b)(i)'],
    explanation:
      'Rule 34(b)(ii). One flash means altering to starboard, two to port, three operating astern propulsion (Rule 34(b)(i)). Rule 34(b)(iii): the light, if fitted, is an all-round white light visible at a minimum range of 5 miles.',
  }),
  mcq({
    id: 'snd-whistles-100m',
    concept: 'rule34:whistles-apart',
    difficulty: 2,
    prompt: 'A large vessel has whistles fitted more than 100 metres apart. For manoeuvring and warning signals:',
    answer: 'One whistle only shall be used',
    distractors: [
      'Both whistles shall be sounded together',
      'The whistles shall be sounded one after the other',
      'The forward whistle shall be used by day and the after one by night',
    ],
    ruleRefs: ['Rule 34(f)'],
    explanation:
      'Rule 34(f). Two whistles far apart sounding the same signal would be heard at different times at a distance and could be taken as extra blasts, turning one signal into another. Annex III requires such whistles not to be sounded simultaneously.',
  }),
  mcq({
    id: 'snd-fishing-at-anchor',
    concept: 'rule35:fishing-ram-at-anchor',
    difficulty: 3,
    prompt: 'In restricted visibility, a vessel engaged in fishing at anchor sounds:',
    answer: 'One prolonged followed by two short blasts, at intervals of not more than 2 minutes',
    distractors: [
      'Rapid ringing of the bell for about 5 seconds, at intervals of not more than 1 minute',
      'One short, one prolonged and one short blast, at intervals of not more than 1 minute',
      'One prolonged followed by three short blasts, at intervals of not more than 2 minutes',
    ],
    ruleRefs: ['Rule 35(d)', 'Rule 35(c)'],
    explanation:
      'Rule 35(d): a vessel engaged in fishing at anchor, and a vessel restricted in her ability to manoeuvre carrying out her work at anchor, sound the Rule 35(c) signal instead of the anchor bell of Rule 35(g).',
  }),
  mcq({
    id: 'snd-composite-unit',
    concept: 'rule35:composite-unit',
    difficulty: 2,
    prompt: 'A pusher and the barge ahead of her are rigidly connected in a composite unit. Making way in fog, they sound:',
    answer: 'One prolonged blast at intervals of not more than 2 minutes',
    distractors: [
      'One prolonged followed by two short blasts at intervals of not more than 2 minutes',
      'One prolonged followed by three short blasts at intervals of not more than 2 minutes',
      'Two prolonged blasts at intervals of not more than 2 minutes',
    ],
    ruleRefs: ['Rule 35(f)', 'Rule 24(b)'],
    explanation:
      'Rule 35(f): a composite unit is regarded as a power-driven vessel and gives the signals of Rule 35(a) or (b). It also shows the lights of a power-driven vessel, Rule 24(b). A pusher not rigidly connected sounds one prolonged and two short, Rule 35(c).',
  }),
  mcq({
    id: 'snd-12-to-20-bell',
    concept: 'rule35:12-to-20m',
    difficulty: 2,
    prompt: 'A vessel of 16 metres at anchor in fog does not give the bell signal. She shall instead:',
    answer: 'Make some other efficient sound signal at intervals of not more than 2 minutes',
    distractors: [
      'Sound one prolonged blast at intervals of not more than 1 minute',
      'Make no sound signal, since she is under 20 metres',
      'Sound one short, one prolonged and one short blast every minute',
    ],
    ruleRefs: ['Rule 35(i)'],
    explanation:
      'Rule 35(i): a vessel of 12 metres or more but less than 20 metres is not obliged to give the bell signals of Rule 35(g) and (h), but if she does not, she shall make some other efficient sound signal at intervals of not more than 2 minutes.',
  }),
  mcq({
    id: 'snd-under-12',
    concept: 'rule35:under-12m',
    difficulty: 1,
    prompt: 'A motor boat of 9 metres is underway in fog. Under Rule 35(j) she:',
    answer: 'Need not give the Rule 35 signals, but if she does not, shall make some other efficient sound signal every 2 minutes or less',
    distractors: [
      'Must sound one prolonged blast every 2 minutes or less, like any power-driven vessel making way',
      'Need make no sound signal of any kind, being under 12 metres and not obliged to carry a whistle',
      'Must ring a bell rapidly for about five seconds every minute or less, instead of using a whistle',
    ],
    ruleRefs: ['Rule 35(j)', 'Rule 33(b)'],
    explanation:
      'Rule 35(j): a vessel of less than 12 metres is not obliged to give the Rule 35 signals, but if she does not, she shall make some other efficient sound signal at intervals of not more than 2 minutes. Rule 33(b) likewise requires her to have some means of making an efficient sound signal.',
  }),
  mcq({
    id: 'snd-pilot-identity',
    concept: 'rule35:pilot-identity',
    difficulty: 2,
    prompt: 'In restricted visibility, a pilot vessel on pilotage duty may, in addition to her normal fog signals, sound:',
    answer: 'An identity signal of four short blasts',
    distractors: [
      'An identity signal of one short, one prolonged and one short blast',
      'An identity signal of two prolonged and two short blasts',
      'An identity signal of five short and rapid blasts',
    ],
    ruleRefs: ['Rule 35(k)'],
    explanation:
      'Rule 35(k): in addition to the signals of Rule 35(a), (b) or (g). One short, one prolonged, one short is the warning a vessel at anchor may give, Rule 35(g); five short and rapid blasts is the doubt signal, Rule 34(d).',
  }),
  mcq({
    id: 'snd-aground',
    concept: 'rule35:aground',
    difficulty: 3,
    prompt: 'A vessel of 120 metres is aground in fog. Her signal includes:',
    answer: 'Three separate strokes on the bell before and after the rapid ringing of the bell, and the gong aft',
    distractors: [
      'Rapid ringing of the bell forward and the gong aft only, exactly as for a vessel at anchor',
      'Three separate strokes on the gong before and after the rapid ringing of the bell forward',
      'Three separate strokes on the bell before and after the rapid ringing, but no gong',
    ],
    ruleRefs: ['Rule 35(h)', 'Rule 35(g)'],
    explanation:
      'Rule 35(h): a vessel aground gives the bell signal and, if required, the gong signal of Rule 35(g) (bell forward then gong aft for a vessel of 100 metres or more), plus three separate and distinct strokes on the bell immediately before and after the rapid ringing of the bell. She may also sound an appropriate whistle signal.',
  }),
  mcq({
    id: 'snd-whistle-frequency',
    concept: 'annex3:whistle-frequency',
    difficulty: 3,
    prompt: 'The fundamental frequency of the whistle of a vessel 250 metres in length shall lie between:',
    answer: '70 and 200 Hz',
    distractors: ['130 and 350 Hz', '250 and 700 Hz', '180 and 2100 Hz'],
    ruleRefs: ['Annex III, 1(b)'],
    explanation:
      'Annex III, 1(b): 70-200 Hz for a vessel of 200 metres or more; 130-350 Hz for 75 metres but less than 200 metres; 250-700 Hz for less than 75 metres. The larger the vessel, the deeper the note.',
  }),
];
