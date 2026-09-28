import type { Question } from '../types.ts';
import { mcq } from './helpers.ts';

/**
 * Lights on aids to navigation: what the generated drills cannot ask by
 * flashing a light or computing a range — the definitions, the limits R0110
 * sets, and the conventions of the chart.
 *
 * Characters follow IALA Recommendation R0110 (Ed. 5.0, June 2021), ranges
 * IALA Recommendation R0202 (E-200-2, Ed. 2.1, December 2017). Chart
 * conventions are those of Admiralty charts, described in our own words.
 */
export const COASTAL_QUESTIONS: Question[] = [
  // --- R0110: rhythmic characters --------------------------------------------
  mcq({
    id: 'cst-def-occulting',
    topic: 'coastal-characters',
    concept: 'coastal:def:occulting',
    difficulty: 1,
    prompt: 'What makes a light "occulting"?',
    answer: 'In each period the light is on for longer in total than it is off',
    distractors: [
      'It is off for longer in total than it is on',
      'Its periods of light and darkness are exactly equal',
      'It shows two colours in turn',
    ],
    ruleRefs: ['IALA R0110'],
    explanation:
      'R0110 class 2: an occulting light is one in which the total duration of light in a period is longer than the total duration of darkness. Flashing is the opposite; isophase is exactly equal; alternating is about colour, not rhythm. On an occulting light you count the eclipses.',
  }),
  mcq({
    id: 'cst-def-isophase',
    topic: 'coastal-characters',
    concept: 'coastal:def:isophase',
    difficulty: 1,
    prompt: 'An isophase light is one in which:',
    answer: 'The durations of light and darkness are equal',
    distractors: [
      'The light is steady and never goes out',
      'The flashes are repeated at 60 a minute',
      'The light is on longer than it is off',
    ],
    ruleRefs: ['IALA R0110'],
    explanation:
      'R0110 class 3: all durations of light and darkness clearly equal. R0110 wants the period at least 2 s and preferably at least 4 s, so that an isophase light is not mistaken for an occulting or flashing one of similar period.',
  }),
  mcq({
    id: 'cst-def-quick',
    topic: 'coastal-characters',
    concept: 'coastal:def:quick-rates',
    difficulty: 2,
    prompt: 'R0110 defines a quick light (Q) by its rate of flashing. What is that rate?',
    answer: 'At least 50 but fewer than 80 flashes a minute, normally 60',
    distractors: [
      'At least 80 but fewer than 160 a minute, normally 120',
      '120 or more flashes a minute',
      'Fewer than 50 flashes a minute',
    ],
    ruleRefs: ['IALA R0110'],
    explanation:
      'Quick: 50 to under 80 a minute, IALA specification 60. Very quick: 80 to under 160, specification 120. Ultra quick: 160 to 300, specification 240. Anything slower than 50 a minute is simply flashing. Note the COLREG flashing light of Rule 21(f) — 120 or more a minute — is a different definition for a different purpose.',
  }),
  mcq({
    id: 'cst-def-long-flash',
    topic: 'coastal-characters',
    concept: 'coastal:def:long-flash',
    difficulty: 2,
    prompt: 'In a long-flashing light (LFl), how long is the long flash?',
    answer: 'Not less than 2 seconds',
    distractors: ['Exactly 1 second', 'At least 4 seconds', 'Half the period'],
    ruleRefs: ['IALA R0110'],
    explanation:
      'R0110 defines a long flash as an appearance of light of not less than 2 seconds, and requires the eclipse after it to be at least three times as long. LFl.10s is the classic example: two seconds of light, eight of darkness.',
  }),
  mcq({
    id: 'cst-def-flash-eclipse',
    topic: 'coastal-characters',
    concept: 'coastal:def:flash-eclipse',
    difficulty: 2,
    prompt: 'For a single-flashing light, R0110 sets a minimum for the eclipse between flashes. What is it?',
    answer: 'At least three times the duration of the flash',
    distractors: [
      'At least equal to the flash',
      'At least one second, whatever the flash',
      'At least half the period',
    ],
    ruleRefs: ['IALA R0110'],
    explanation:
      'A flashing light must be clearly more dark than light, so the eclipse is at least three times the flash, and the period at least 2 s. The mirror rule applies to occulting lights: the light at least three times the eclipse.',
  }),
  mcq({
    id: 'cst-def-group-limit',
    topic: 'coastal-characters',
    concept: 'coastal:def:group-limit',
    difficulty: 2,
    prompt: 'How many flashes may a group-flashing light, Fl(#), have in each group?',
    answer: 'No more than five in general, six only as an exception',
    distractors: [
      'Any number up to nine',
      'Two or three only',
      'No limit, provided the period is under 30 s',
    ],
    ruleRefs: ['IALA R0110'],
    explanation:
      'Beyond five or six flashes a group cannot be counted reliably at a glance. Occulting groups have a similar limit: four eclipses in general, five as an exception. Quick and very quick groups use three or nine, plus six with a long flash.',
  }),
  mcq({
    id: 'cst-def-max-period',
    topic: 'coastal-characters',
    concept: 'coastal:def:max-period',
    difficulty: 3,
    prompt: 'R0110 Table 1 gives maximum periods. Which class has the shortest maximum?',
    answer: 'Isophase — 12 seconds',
    distractors: [
      'Group flashing with three or more flashes — 12 seconds',
      'Morse code — 15 seconds',
      'Long flashing — 30 seconds',
    ],
    ruleRefs: ['IALA R0110'],
    explanation:
      'Isophase 12 s; single occulting, single flashing and group very quick 15 s; two-eclipse or two-flash groups, long flashing and group quick 20 s; groups of three or more, composite groups and Morse 30 s. A long period makes a light hard to identify, since you must wait out a whole cycle.',
  }),
  mcq({
    id: 'cst-def-composite-oc',
    topic: 'coastal-characters',
    concept: 'coastal:def:composite-occulting',
    difficulty: 3,
    prompt: 'What does R0110 say about composite group-occulting lights such as Oc(2+1)?',
    answer: 'They are not recommended, because they are difficult to recognise',
    distractors: [
      'They are reserved for preferred-channel marks',
      'They must use a period of at least 30 seconds',
      'They may only be shown in red or green',
    ],
    ruleRefs: ['IALA R0110'],
    explanation:
      'The class exists and is still found, but R0110 recommends against it. Its flashing counterpart, Fl(2+1), is recommended — restricted to (2+1), or (3+1) as an exception.',
  }),
  mcq({
    id: 'cst-def-fixed',
    topic: 'coastal-characters',
    concept: 'coastal:def:fixed',
    difficulty: 2,
    prompt: 'Why does R0110 say a single fixed light (F) should be used with care?',
    answer: 'It may not be recognised as an aid to navigation light at all',
    distractors: [
      'It uses more power than a flashing light',
      'It cannot be given a nominal range',
      'It can only be white',
    ],
    ruleRefs: ['IALA R0110'],
    explanation:
      'A steady light ashore looks like any other shore light — a street lamp, a window. A rhythm is what identifies an aid to navigation, which is why nearly every light has one.',
  }),
  mcq({
    id: 'cst-def-consistent',
    topic: 'coastal-characters',
    concept: 'coastal:def:consistent',
    difficulty: 2,
    prompt: 'A lighthouse has white, red and green sectors. What must stay the same whichever sector you are in?',
    answer: 'The rhythmic character, on any given bearing',
    distractors: [
      'The colour',
      'The nominal range',
      'Nothing — each sector may have its own character',
    ],
    ruleRefs: ['IALA R0110'],
    explanation:
      'R0110 recommends that a light must, on a given bearing, maintain a consistent character. The colour changes with the sector and the range usually does too (coloured glass absorbs light), but you identify the light by its rhythm.',
  }),

  // --- the chart -------------------------------------------------------------
  mcq({
    id: 'cst-chart-elevation',
    topic: 'coastal-notation',
    concept: 'coastal:notation:elevation-datum',
    difficulty: 2,
    prompt: 'On an Admiralty chart a light is marked "Fl.10s 24m 20M". The 24 m is its elevation above:',
    answer: 'Mean High Water Springs (MHWS)',
    distractors: ['Chart datum', 'Mean sea level', 'The ground on which the tower stands'],
    ruleRefs: ['Chart notation'],
    explanation:
      'Heights of lights, like other heights on Admiralty charts, are above MHWS, so the figure is the least the light will be above the sea at almost any state of tide. It is not the height of the structure. Depths and drying heights use chart datum instead.',
  }),
  mcq({
    id: 'cst-chart-range',
    topic: 'coastal-notation',
    concept: 'coastal:notation:charted-range',
    difficulty: 2,
    prompt: 'Which range does an Admiralty chart print beside a light?',
    answer: 'The nominal range — its luminous range in a meteorological visibility of 10 miles',
    distractors: [
      'The geographic range for a height of eye of 5 m',
      'The luminous range in the worst visibility expected',
      'The lesser of the luminous and geographic ranges',
    ],
    ruleRefs: ['Chart notation', 'IALA R0202'],
    explanation:
      'Nominal range, as R0202 defines it. It says how bright the light is, nothing about your height of eye or tonight’s weather. To know when you will see it you work out both the luminous range for the visibility you have and the geographic range, and take the smaller.',
  }),
  mcq({
    id: 'cst-chart-white',
    topic: 'coastal-notation',
    concept: 'coastal:notation:white-omitted',
    difficulty: 1,
    prompt: 'A light is charted as "Fl(3)15s" with no colour given. What colour is it?',
    answer: 'White',
    distractors: ['Yellow', 'It cannot be told from the chart', 'Red, as lights ashore are'],
    ruleRefs: ['Chart notation'],
    explanation:
      'A light with no colour in its description is white. Colours are only written when they are not white, or when there are several: Fl(3)R.15s, Fl.WRG.5s.',
  }),
  mcq({
    id: 'cst-chart-sector-bearings',
    topic: 'coastal-notation',
    concept: 'coastal:notation:sector-convention',
    difficulty: 2,
    prompt: 'How are the limits of a light’s sectors given in a list of lights?',
    answer: 'As true bearings from seaward, clockwise',
    distractors: [
      'As true bearings from the light, clockwise',
      'As magnetic bearings from seaward',
      'As relative bearings from the harbour entrance',
    ],
    ruleRefs: ['Chart notation'],
    explanation:
      'From seaward: the bearing you would take of the light from your own boat. Working them from the light — the reciprocal — puts you in the wrong sector. They are true, so a compass bearing has to be corrected before comparing.',
  }),
  mcq({
    id: 'cst-chart-period',
    topic: 'coastal-notation',
    concept: 'coastal:notation:period',
    difficulty: 1,
    prompt: 'In "Fl(4)20s", what exactly does 20s measure?',
    answer: 'The time from the start of one group of four flashes to the start of the next',
    distractors: [
      'The eclipse after each group',
      'The time taken to show the four flashes',
      'The interval between individual flashes',
    ],
    ruleRefs: ['Chart notation', 'IALA R0110'],
    explanation:
      'The period is one full cycle, flashes and eclipses together. To time a light, start the watch at the first flash of a group and stop it at the first flash of the next.',
  }),
  mcq({
    id: 'cst-chart-dir',
    topic: 'coastal-notation',
    concept: 'coastal:notation:dir-ldg',
    difficulty: 2,
    prompt: 'On a chart, what do "Dir" and "Ldg" mean before a light?',
    answer: 'Dir: a direction light, a narrow sector marking a line to follow. Ldg: one of a pair of leading lights',
    distractors: [
      'Dir: the light is directed at the land. Ldg: the light is on a landing stage',
      'Dir: it shows only in daylight. Ldg: its range is reduced',
      'Dir: a directional radio beacon. Ldg: a light on a lightship',
    ],
    ruleRefs: ['Chart notation'],
    explanation:
      'A direction light shows a narrow white sector along the line to be followed, often with coloured or flashing sectors either side. Leading lights are a pair, the rear higher: keep them in line and you are on the leading line.',
  }),

  // --- R0202 and the horizon -------------------------------------------------
  mcq({
    id: 'cst-range-nominal',
    topic: 'coastal-range',
    concept: 'coastal:def:nominal',
    difficulty: 2,
    prompt: 'R0202 defines a light’s nominal range as its luminous range in a meteorological visibility of:',
    answer: '10 nautical miles',
    distractors: ['20 nautical miles', '5 nautical miles', 'The visibility on the night it was measured'],
    ruleRefs: ['IALA R0202'],
    explanation:
      'Nominal range is luminous range standardised to 10 miles visibility, for an illuminance at the eye of 2 × 10⁻⁷ lux at night. It is really a measure of how bright the light is, expressed in miles.',
  }),
  mcq({
    id: 'cst-range-luminous-depends',
    topic: 'coastal-range',
    concept: 'coastal:def:luminous-vs-geographic',
    difficulty: 2,
    prompt: 'Which pair of things decides a light’s luminous range?',
    answer: 'Its intensity and the meteorological visibility',
    distractors: [
      'Its elevation and your height of eye',
      'Its elevation and its intensity',
      'Your height of eye and the visibility',
    ],
    ruleRefs: ['IALA R0202'],
    explanation:
      'Luminous range is about brightness and the atmosphere, and nothing about heights. Geographic range is the opposite: heights of light and eye, nothing about brightness. The light is seen at the smaller of the two.',
  }),
  mcq({
    id: 'cst-range-dip-fix',
    topic: 'coastal-range',
    concept: 'coastal:def:dipping-fix',
    difficulty: 2,
    prompt: 'You see a powerful light dip below the horizon and take its bearing at that moment. What do you have?',
    answer: 'A fix: the bearing, and the distance off from its dipping range',
    distractors: [
      'A single position line only',
      'Nothing useful: dipping distance depends on the visibility',
      'Your speed over the ground',
    ],
    ruleRefs: ['Horizon geometry'],
    explanation:
      'At the instant of dipping the distance off is the geographic range for the light’s elevation and your height of eye, from the formula or the almanac table. With a bearing that is a fix. It only works if the light is bright enough to reach the horizon — its luminous range must exceed its geographic range.',
  }),
  mcq({
    id: 'cst-range-loom',
    topic: 'coastal-range',
    concept: 'coastal:def:loom',
    difficulty: 2,
    prompt: 'On a clear night you see a regular glow sweeping the sky well beyond a lighthouse’s geographic range. What is it?',
    answer: 'The loom of the light, reflected by the atmosphere from below the horizon',
    distractors: [
      'The light itself, lifted by abnormal refraction',
      'A different light with the same character',
      'The nominal range being exceeded because the visibility is over 10 miles',
    ],
    ruleRefs: ['Horizon geometry'],
    explanation:
      'The loom is the beam lighting up the atmosphere above a light that is still below the horizon. It can identify the light by its rhythm, but it gives no distance: you cannot take a rising or dipping range from a loom.',
  }),
];
