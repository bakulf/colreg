import type { Question } from '../types.ts';
import { mcq } from './helpers.ts';

/**
 * Tidal streams: what the generated chartwork drills do not ask. Arranged by
 * the items of section 4 of the RYA Coastal Skipper / Yachtmaster Offshore
 * syllabus, with the estimated position of section 1. Wording is original.
 */
export const TIDAL_QUESTIONS: Question[] = [
  // --- information -----------------------------------------------------------
  mcq({
    id: 'tid-def-set',
    topic: 'tidal-sources',
    concept: 'tidal:def:set',
    difficulty: 1,
    prompt: 'A tidal stream is given as "set 080°, rate 2.0 kn". Which way is the water moving?',
    answer: 'Towards 080°',
    distractors: ['From 080°, towards 260°', 'Towards 080° magnetic', 'It depends on the state of tide'],
    ruleRefs: ['Tidal streams'],
    explanation:
      'A stream is named for where it goes; a wind for where it comes from. Set is true, like everything taken off the chart. The drift is the distance the water moves you in a given time: 2.0 kn for 1½ hours is a drift of 3.0 M.',
  }),
  mcq({
    id: 'tid-def-diamond-ref',
    topic: 'tidal-sources',
    concept: 'tidal:def:diamond-reference',
    difficulty: 1,
    prompt: 'The table beside a chart’s tidal diamonds gives streams against what?',
    answer: 'Hours before and after high water at a named standard port, at springs and at neaps',
    distractors: [
      'Clock times, for each day of the year',
      'Hours before and after low water at the nearest harbour',
      'The height of tide at the diamond',
    ],
    ruleRefs: ['Tidal streams'],
    explanation:
      'The stream follows the tide, so it is tabulated against HW at a standard port — the table’s heading names it — from six hours before to six after, with a spring and a neap rate. Today’s rate is interpolated between the two by today’s range there.',
  }),
  mcq({
    id: 'tid-def-row',
    topic: 'tidal-sources',
    concept: 'tidal:def:row-covers',
    difficulty: 2,
    prompt: 'HW at the standard port is 1400. Which row of the diamond table do you use at 1050?',
    answer: 'HW −3: it covers from 3½ to 2½ hours before high water',
    distractors: [
      'HW −4, because 1050 is more than three hours before HW',
      'HW −2, the next hour to come',
      'Either, averaged',
    ],
    ruleRefs: ['Tidal streams'],
    explanation:
      '1050 is 3h 10m before HW. Each row stands for the hour centred on it, so HW −3 covers 1030 to 1130 here. Taking the row whose hour has "not yet been reached" is the usual slip.',
  }),
  mcq({
    id: 'tid-def-sources',
    topic: 'tidal-sources',
    concept: 'tidal:def:sources',
    difficulty: 1,
    prompt: 'Close inshore, round a headland, the diamonds are some miles off. Where do you look for the stream there?',
    answer: 'The sailing directions or pilot book, and the almanac’s notes, which describe inshore eddies and early turns',
    distractors: [
      'The nearest diamond, which applies unchanged up to the shore',
      'The tide tables for the nearest port',
      'The plotter’s COG, which shows the stream directly',
    ],
    ruleRefs: ['Tidal streams'],
    explanation:
      'A diamond is the stream at one point. Close inshore it often turns earlier, runs faster off headlands, and forms eddies in bays; pilot books and almanac notes describe these. Tidal stream atlases give the broad picture hour by hour.',
  }),

  // --- course to steer -------------------------------------------------------
  mcq({
    id: 'tid-cts-order',
    topic: 'tidal-cts',
    concept: 'tidal:def:cts-order',
    difficulty: 2,
    prompt: 'Working out a course to steer, in which order do you allow for things?',
    answer: 'Stream (the triangle), then leeway, then variation, then deviation',
    distractors: [
      'Variation first, then the triangle, then leeway',
      'Leeway, then deviation, then the stream',
      'The order does not matter',
    ],
    ruleRefs: ['Tidal streams'],
    explanation:
      'The triangle is drawn on the chart in true, so it comes first and gives a true water track. Leeway turns that into the true heading to point. Only then convert for the helmsman: variation to magnetic, deviation to compass.',
  }),
  mcq({
    id: 'tid-cts-one-triangle',
    topic: 'tidal-cts',
    concept: 'tidal:def:whole-passage',
    difficulty: 3,
    prompt: 'For a three-hour passage across a stream that changes each hour, why lay off all three hours of stream in one triangle rather than a new course each hour?',
    answer: 'One course steered throughout gets there soonest; you leave the line and come back to it, but arrive at the waypoint',
    distractors: [
      'Because the stream is the same every hour',
      'So that the boat stays exactly on the ground track all the way',
      'Because hourly triangles cannot be drawn on a chart',
    ],
    ruleRefs: ['Tidal streams'],
    explanation:
      'Summing the streams and steering one course lets the tide carry you off the line and back again, and the effects cancel — the shortest time. Correcting every hour holds the line but sails further. The exception is where there is danger either side of the line: then stay on it.',
  }),
  mcq({
    id: 'tid-cts-water-track',
    topic: 'tidal-cts',
    concept: 'tidal:def:which-side',
    difficulty: 1,
    prompt: 'In a course-to-steer triangle, which side gives the course?',
    answer: 'The water track, marked with one arrow',
    distractors: [
      'The ground track, marked with two arrows',
      'The stream, marked with three arrows',
      'The line from the start to the waypoint',
    ],
    ruleRefs: ['Tidal streams'],
    explanation:
      'One arrow for the water track (the way you move through the water: what you steer, before leeway), two for the ground track (where you actually go), three for the stream. The ground track is the line to the waypoint; its length for an hour is your speed over the ground.',
  }),

  // --- estimated position ----------------------------------------------------
  mcq({
    id: 'tid-ep-dr-vs-ep',
    topic: 'tidal-ep',
    concept: 'tidal:def:dr-vs-ep',
    difficulty: 1,
    prompt: 'What does an estimated position allow for that a dead reckoning position does not?',
    answer: 'Tidal stream and leeway',
    distractors: ['Variation and deviation', 'The distance run by the log', 'The course steered'],
    ruleRefs: ['Tidal streams'],
    explanation:
      'A DR uses course steered and distance run only. An EP adds leeway and the stream, so it is your best estimate of where you are until you get a fix. Both are true positions on the chart: variation and deviation are dealt with before either is plotted.',
  }),
  mcq({
    id: 'tid-ep-symbols',
    topic: 'tidal-ep',
    concept: 'tidal:def:symbols',
    difficulty: 1,
    prompt: 'In RYA chartwork, how are a fix, an estimated position and a waypoint marked?',
    answer: 'Fix: a circle with a dot. EP: a triangle with a dot. Waypoint: a square',
    distractors: [
      'Fix: a triangle. EP: a circle. Waypoint: a cross',
      'Fix: a square. EP: a circle. Waypoint: a triangle',
      'All three with a dot and the time',
    ],
    ruleRefs: ['Tidal streams'],
    explanation:
      'Circle for a fix, triangle for an EP, square for a waypoint, each with its time. The dead reckoning position is a short line across the track. Consistent marks let anyone read the chart at a glance.',
  }),
  mcq({
    id: 'tid-ep-trust',
    topic: 'tidal-ep',
    concept: 'tidal:def:ep-uncertainty',
    difficulty: 2,
    prompt: 'Your EP is three hours old and built on predicted streams and estimated leeway. What should you do with it?',
    answer: 'Treat it as the centre of an area of uncertainty, and confirm it with a fix from an independent source',
    distractors: [
      'Trust it as a fix, since it allows for everything',
      'Ignore it once you have a GNSS position',
      'Re-plot it with the stream reversed as a check',
    ],
    ruleRefs: ['Tidal streams'],
    explanation:
      'Every input has an error — the stream prediction, the log, the helmsman’s average course, the guessed leeway — and they grow with time. The area of uncertainty grows with them, so confirm the EP: bearings, a transit, a depth contour, or GNSS checked against something else.',
  }),

  // --- races and observation -------------------------------------------------
  mcq({
    id: 'tid-race-when',
    topic: 'tidal-hazards',
    concept: 'tidal:hazard:race-conditions',
    difficulty: 1,
    prompt: 'When is a tide race off a headland at its most dangerous?',
    answer: 'At springs, with the wind blowing against the stream',
    distractors: [
      'At neaps, with the wind in the same direction as the stream',
      'At slack water, when the stream turns',
      'Only at night',
    ],
    ruleRefs: ['Tidal streams'],
    explanation:
      'The stream accelerates round headlands and over uneven ground; at springs it is strongest, and wind against it raises short, steep, breaking seas. Pass at slack or neaps, in light weather, or keep well clear as the pilot book advises.',
  }),
  mcq({
    id: 'tid-race-chart',
    topic: 'tidal-hazards',
    concept: 'tidal:hazard:chart',
    difficulty: 1,
    prompt: 'How does a chart warn of overfalls or a tide race?',
    answer: 'With wavy lines and a legend such as "Overfalls", "Tide rips" or "Race"',
    distractors: [
      'With a magenta tidal diamond',
      'With a dotted danger line only',
      'It does not; only the pilot book mentions them',
    ],
    ruleRefs: ['Tidal streams'],
    explanation:
      'Overfalls, tide rips and races are charted with a symbol of wavy lines and a legend. Pilot books add when they run and how to avoid them.',
  }),
  mcq({
    id: 'tid-observe-buoy',
    topic: 'tidal-hazards',
    concept: 'tidal:hazard:observe',
    difficulty: 2,
    prompt: 'Passing a large buoy, you see it leaning and a wake streaming away from it to the east. What is the stream doing?',
    answer: 'Setting east: the water is flowing past the buoy towards the east',
    distractors: [
      'Setting west: the buoy leans into the stream',
      'Nothing: buoys lean with the wind, not the stream',
      'It is slack: a wake forms only as the stream turns',
    ],
    ruleRefs: ['Tidal streams'],
    explanation:
      'A buoy, beacon or pot marker in a stream has water piling up on its up-tide side and a wake trailing down-tide, and is pushed over down-tide. So the wake points where the stream sets. Boats at anchor in light winds lie head to the stream, pointing the other way.',
  }),
];
