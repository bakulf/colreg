import type { Question } from '../types.ts';
import { mcq } from './helpers.ts';

/**
 * Tides: what the generated height drills do not ask. Arranged by the items of
 * section 3 of the RYA Coastal Skipper / Yachtmaster Offshore syllabus.
 * Wording is original.
 */
export const TIDES_QUESTIONS: Question[] = [
  // --- causes, springs and neaps ---------------------------------------------
  mcq({
    id: 'tds-cause-springs',
    topic: 'tides-causes',
    concept: 'tides:def:springs',
    difficulty: 1,
    prompt: 'When do spring tides occur?',
    answer: 'Around new and full moon, when sun and moon pull in line — in practice a day or two after',
    distractors: [
      'In spring, from March to May',
      'At the moon’s first and last quarters',
      'Whenever the moon is closest to the earth, whatever its phase',
    ],
    ruleRefs: ['Tidal heights'],
    explanation:
      'Springs have nothing to do with the season: sun and moon in line, at new and full moon, add their pulls and give the biggest ranges; the effect lags by a day or two in UK waters. At the quarters they pull at right angles and the ranges are smallest: neaps. Springs come about every fortnight.',
  }),
  mcq({
    id: 'tds-cause-equinox',
    topic: 'tides-causes',
    concept: 'tides:def:equinoctial',
    difficulty: 2,
    prompt: 'Which spring tides are usually the largest of the year?',
    answer: 'Those near the equinoxes, in March and September',
    distractors: [
      'Those near the solstices, in June and December',
      'Those in midsummer, when the sun is strongest',
      'All springs are the same size',
    ],
    ruleRefs: ['Tidal heights'],
    explanation:
      'At the equinoxes the sun is over the equator, and the combined pull is at its most effective: equinoctial springs have the greatest ranges, the highest highs and the lowest lows. Worth knowing before drying out or passing under a bridge in March or September.',
  }),
  mcq({
    id: 'tds-cause-daily',
    topic: 'tides-causes',
    concept: 'tides:def:daily-lag',
    difficulty: 1,
    prompt: 'On UK coasts, roughly how much later is high water each day?',
    answer: 'About 50 minutes, since there are two tides in a lunar day of about 24 h 50 m',
    distractors: ['Exactly an hour', 'About 12 minutes', 'It happens at the same time each day'],
    ruleRefs: ['Tidal heights'],
    explanation:
      'The moon comes round again after about 24 hours 50 minutes, and there are two high waters in that time, so each is about 12 h 25 m after the last and the pattern slips about 50 minutes a day. A useful check on a tide table read from the wrong day.',
  }),
  mcq({
    id: 'tds-cause-weather',
    topic: 'tides-causes',
    concept: 'tides:def:weather',
    difficulty: 2,
    prompt: 'A deep depression, 980 hPa, sits over the area. What does it do to the predicted heights?',
    answer: 'Raises the sea level, by roughly a centimetre for each hectopascal below average',
    distractors: [
      'Lowers the sea level, because low pressure sucks water away',
      'Nothing: predictions allow for the weather',
      'Only affects the times, not the heights',
    ],
    ruleRefs: ['Tidal heights'],
    explanation:
      'Tide tables assume average pressure. About a centimetre per hectopascal: 980 against a mean near 1013 is some 0.3 m higher. Strong onshore winds pile water up, offshore winds lower it; a storm surge can add much more. High pressure does the opposite, and matters when crossing a bar on a calm, high day.',
  }),

  // --- tide tables and heights -----------------------------------------------
  mcq({
    id: 'tds-tables-sources',
    topic: 'tides-heights',
    concept: 'tides:def:sources',
    difficulty: 1,
    prompt: 'Where do you get tidal predictions for a UK standard port?',
    answer: 'A nautical almanac, the Admiralty Tide Tables, or the UKHO’s online EasyTide',
    distractors: [
      'The chart, which prints each day’s times',
      'The tidal stream atlas',
      'Only from the harbour master',
    ],
    ruleRefs: ['Tidal heights'],
    explanation:
      'Almanacs and the Admiralty Tide Tables give times and heights of HW and LW for standard ports, with curves, and differences for secondary ports. EasyTide gives a few days ahead online. Check the time zone: UK tables are usually in UT, so add an hour in summer.',
  }),
  mcq({
    id: 'tds-tables-twelfths-limit',
    topic: 'tides-heights',
    concept: 'tides:def:twelfths-limit',
    difficulty: 2,
    prompt: 'When is the rule of twelfths a poor guide?',
    answer: 'Where the tidal curve is lopsided, such as the Solent with its double high water',
    distractors: [
      'At springs, because the range is too big',
      'On a falling tide',
      'Never: it is exact everywhere',
    ],
    ruleRefs: ['Tidal heights'],
    explanation:
      'The rule assumes a symmetrical six-hour rise and fall. Where the curve is distorted — double high waters in the Solent, double low waters at Portland — use the port’s own curve from the almanac.',
  }),

  // --- levels and datum ------------------------------------------------------
  mcq({
    id: 'tds-levels-cd',
    topic: 'tides-levels',
    concept: 'tides:def:chart-datum',
    difficulty: 1,
    prompt: 'On a UK Admiralty chart, chart datum is usually:',
    answer: 'Lowest Astronomical Tide (LAT), the lowest level predicted in normal weather',
    distractors: ['Mean Low Water Springs', 'Mean Sea Level', 'Mean High Water Springs'],
    ruleRefs: ['Tidal heights'],
    explanation:
      'Chart datum is the level soundings are measured from, set so low (usually LAT) that there is almost always at least the charted depth. Heights of tide are measured up from it. Pressure and wind can still take the sea below it.',
  }),
  mcq({
    id: 'tds-levels-order',
    topic: 'tides-levels',
    concept: 'tides:def:levels-order',
    difficulty: 2,
    prompt: 'Which list runs from highest to lowest?',
    answer: 'HAT, MHWS, MHWN, MLWN, MLWS, LAT',
    distractors: [
      'MHWS, HAT, MHWN, MLWN, LAT, MLWS',
      'HAT, MHWN, MHWS, MLWS, MLWN, LAT',
      'MHWS, MHWN, HAT, LAT, MLWN, MLWS',
    ],
    ruleRefs: ['Tidal heights'],
    explanation:
      'Highest and Lowest Astronomical Tide bracket everything. Springs have the bigger range, so MHWS is above MHWN and MLWS below MLWN. On charts: soundings and drying heights from chart datum (usually LAT), heights of lights and land from MHWS, clearances from HAT.',
  }),
  mcq({
    id: 'tds-levels-underlined',
    topic: 'tides-levels',
    concept: 'tides:def:drying-height',
    difficulty: 1,
    prompt: 'On a chart, what does an underlined figure such as 1₆ on a rock mean?',
    answer: 'A drying height: the rock stands 1.6 m above chart datum',
    distractors: [
      'A depth of 1.6 m below chart datum',
      'A height of 1.6 m above MHWS',
      'A doubtful sounding',
    ],
    ruleRefs: ['Tidal heights'],
    explanation:
      'Underlined figures are drying heights — above chart datum, so they uncover at low water. The depth over them is the height of tide minus the drying height; if that is negative, the rock is out of the water.',
  }),

  // --- secondary ports -------------------------------------------------------
  mcq({
    id: 'tds-secondary-what',
    topic: 'tides-secondary',
    concept: 'tides:def:secondary',
    difficulty: 1,
    prompt: 'How do you find the tide at a secondary port?',
    answer: 'Apply the almanac’s time and height differences to the predictions for its standard port',
    distractors: [
      'Read it from the nearest tidal diamond',
      'Use the standard port’s predictions unchanged',
      'Add 50 minutes to the standard port for each 10 miles of distance',
    ],
    ruleRefs: ['Tidal heights'],
    explanation:
      'Only standard ports get full daily predictions. Each secondary port has differences for HW and LW times and heights, tabulated against the standard port’s times and its spring and neap levels, interpolated for today; then use the standard port’s curve.',
  }),

  // --- anomalies -------------------------------------------------------------
  // The syllabus names the Solent, but what matters is the idea, not the
  // geography: places appear as examples, never as the thing to remember.
  mcq({
    id: 'tds-anomaly-double-hw',
    topic: 'tides-anomalies',
    concept: 'tides:anomaly:double-hw',
    difficulty: 1,
    prompt: 'Some ports — Southampton, in the Solent, is the usual example — have a "double high water". What does that mean?',
    answer: 'The tide stays high for a long time, with two peaks, instead of one clear high water',
    distractors: [
      'There are four high waters a day instead of two',
      'High water is twice as high as the tables say',
      'The tide rises twice as fast as elsewhere',
    ],
    ruleRefs: ['Tidal heights'],
    explanation:
      'The shape of the tide is distorted by the local coast: the water reaches high water, dips a little, and rises again, or simply stands high for two or three hours. Still two tides a day, but the curve is nothing like the smooth one the rule of twelfths assumes.',
  }),
  mcq({
    id: 'tds-anomaly-what-to-do',
    topic: 'tides-anomalies',
    concept: 'tides:anomaly:what-to-do',
    difficulty: 1,
    prompt: 'You need a height of tide at a port with a double high water or a double low water. How do you work it out?',
    answer: 'With that port’s own tidal curve from the almanac, not the rule of twelfths',
    distractors: [
      'With the rule of twelfths, halving the range',
      'By averaging the two high waters',
      'You cannot: such ports have no predictions',
    ],
    ruleRefs: ['Tidal heights'],
    explanation:
      'The rule of twelfths only works for a smooth, symmetrical six-hour rise and fall. Where the curve is distorted, the almanac gives special curves for those ports; read the height off the curve for the time you need.',
  }),
  mcq({
    id: 'tds-anomaly-lw-based',
    topic: 'tides-anomalies',
    concept: 'tides:anomaly:lw-curves',
    difficulty: 2,
    prompt: 'Where high water is double or lasts for hours, the almanac’s curves are entered from low water instead. Why?',
    answer: 'Because with a long or double high water there is no clear moment of HW to count from, while LW is sharp',
    distractors: [
      'Because those ports are only used at low water',
      'Because chart datum there is at high water',
      'Because the tide there only rises, and never falls',
    ],
    ruleRefs: ['Tidal heights'],
    explanation:
      'A curve needs a clear starting point. When high water is a plateau with two bumps, "the time of HW" hardly exists, so the curves count hours from low water, which is well defined. The Solent is the classic case the syllabus mentions.',
  }),
];
