import type { Question } from '../types.ts';
import { mcq } from './helpers.ts';

/**
 * The magnetic compass: what the generated conversion drills cannot ask —
 * definitions, causes, how and when to check, and the kinds of compass.
 * Arranged by the items of section 2 of the RYA Coastal Skipper / Yachtmaster
 * Offshore shorebased syllabus. Wording is original.
 */
export const COMPASS_QUESTIONS: Question[] = [
  // --- variation -------------------------------------------------------------
  mcq({
    id: 'cmp-def-variation',
    topic: 'compass-variation',
    concept: 'compass:def:variation',
    difficulty: 1,
    prompt: 'What is variation?',
    answer: 'The angle between true north and magnetic north at your position',
    distractors: [
      'The angle between magnetic north and the north your compass points to',
      'The error caused by the boat’s engine and electrics',
      'The difference between your heading and your course over the ground',
    ],
    ruleRefs: ['Compass'],
    explanation:
      'Variation belongs to the place, not the boat: it is the angle between the geographic and magnetic poles as seen from where you are. The chart gives it in the compass rose. The second option is deviation, which belongs to the boat; the last is the effect of tide and leeway.',
  }),
  mcq({
    id: 'cmp-def-variation-changes',
    topic: 'compass-variation',
    concept: 'compass:def:variation-changes',
    difficulty: 1,
    prompt: 'Why does a chart give variation for a year, with an annual change, and in several compass roses?',
    answer: 'Because variation differs from place to place and drifts slowly over the years',
    distractors: [
      'Because variation depends on the boat’s heading',
      'Because variation reverses every few years',
      'Because each rose uses a different magnetic north',
    ],
    ruleRefs: ['Compass'],
    explanation:
      'The magnetic pole wanders, so variation changes by a few minutes a year, and it differs across a chart. Use the rose nearest your position and bring it up to date with the annual change. Dependence on heading is deviation.',
  }),
  mcq({
    id: 'cmp-def-annual-name',
    topic: 'compass-variation',
    concept: 'compass:def:annual-change-name',
    difficulty: 2,
    prompt: 'A rose reads "3°40\'W 2016 (9\'E)". Is the variation increasing or decreasing?',
    answer: 'Decreasing: the annual change is named opposite to the variation',
    distractors: [
      'Increasing: the annual change is added each year',
      'Increasing: easterly change always increases variation',
      'Neither: the figure in brackets is the error of the rose',
    ],
    ruleRefs: ['Compass'],
    explanation:
      'An annual change with the same name as the variation makes it grow; with the opposite name it shrinks, and can pass through zero and change name. Here 9\' east a year eats into 3°40\' west: about 3°40\' − 1°30\' = 2°10\'W after ten years.',
  }),

  // --- deviation -------------------------------------------------------------
  mcq({
    id: 'cmp-def-deviation',
    topic: 'compass-deviation',
    concept: 'compass:def:deviation',
    difficulty: 1,
    prompt: 'What is deviation?',
    answer: 'The angle between magnetic north and compass north, caused by the boat’s own magnetism',
    distractors: [
      'The angle between true north and magnetic north',
      'The error of the lubber line on the compass bowl',
      'The difference between the steering and hand-bearing compasses’ damping',
    ],
    ruleRefs: ['Compass'],
    explanation:
      'Deviation is the boat’s doing: iron and steel on board, and electric currents, pull the compass needle away from magnetic north. It is found by checking the compass and recorded on a deviation card against ship’s head.',
  }),
  mcq({
    id: 'cmp-def-deviation-heading',
    topic: 'compass-deviation',
    concept: 'compass:def:deviation-heading',
    difficulty: 2,
    prompt: 'Why is deviation tabulated against the ship’s head?',
    answer: 'Because the boat’s magnetic field turns with the boat, so its effect on the compass changes with heading',
    distractors: [
      'Because deviation depends on the bearing of the object observed',
      'Because variation changes with heading',
      'Because the card must be read in the direction of the conventional direction of buoyage',
    ],
    ruleRefs: ['Compass'],
    explanation:
      'The engine is always, say, forward of the compass. As the boat swings, that iron sits at a different angle to the earth’s field, so the pull on the needle changes. Hence a card per heading — and a bearing taken over the steering compass uses the deviation for the heading you are on, not for the bearing.',
  }),
  mcq({
    id: 'cmp-def-deviation-causes',
    topic: 'compass-deviation',
    concept: 'compass:def:deviation-causes',
    difficulty: 1,
    prompt: 'Which of these is most likely to cause new deviation in a yacht’s steering compass?',
    answer: 'A mobile phone or a handheld radio left beside the compass',
    distractors: [
      'A change of cruising area',
      'A year passing since the chart was printed',
      'Heeling to leeward in a breeze with a fibreglass hull',
    ],
    ruleRefs: ['Compass'],
    explanation:
      'Anything magnetic or carrying current near the compass: engines and steel keels, wiring, loudspeakers, phones, radios, tools, a tin of food in the cockpit locker. A new area or an old chart change the variation, not the deviation. Heel can add a little deviation in a boat with a lot of iron, but a fibreglass hull is not the cause.',
  }),
  mcq({
    id: 'cmp-def-error-west',
    topic: 'compass-deviation',
    concept: 'compass:def:error-west',
    difficulty: 2,
    prompt: 'Variation is 3°W and deviation 2°W. What is the compass error, and which reading is larger?',
    answer: '5°W — the compass reads 5° more than true',
    distractors: [
      '5°W — true reads 5° more than the compass',
      '1°W — the compass reads 1° more than true',
      '5°E — the compass reads 5° less than true',
    ],
    ruleRefs: ['Compass'],
    explanation:
      'Compass error is variation and deviation together: 3°W + 2°W = 5°W. "Error west, compass best": with a westerly error the compass figure is the bigger. So 090°T would be steered as 095°C.',
  }),

  // --- checks ----------------------------------------------------------------
  mcq({
    id: 'cmp-check-methods',
    topic: 'compass-checks',
    concept: 'compass:check:methods',
    difficulty: 2,
    prompt: 'Which is a sound way for a yachtsman to check the steering compass for deviation?',
    answer: 'Steer along a charted transit and compare its magnetic bearing with the compass',
    distractors: [
      'Compare the compass heading with the GPS course over ground',
      'Compare it with the variation in the nearest compass rose',
      'Turn the boat in a circle and see that the card turns smoothly',
    ],
    ruleRefs: ['Compass'],
    explanation:
      'A transit gives an exact bearing. Converted to magnetic and compared with what the compass shows, it gives the deviation for that heading; repeat on several headings. A hand-bearing compass used where it has no deviation does the same job. Course over ground includes tide and leeway, so it is not your heading.',
  }),
  mcq({
    id: 'cmp-check-when',
    topic: 'compass-checks',
    concept: 'compass:check:when',
    difficulty: 1,
    prompt: 'When should the deviation card be checked?',
    answer: 'After any change of equipment near the compass, and routinely, such as at the start of a season',
    distractors: [
      'Only when a new chart edition is published',
      'Whenever the variation changes',
      'Never — once swung, a compass keeps its deviation for life',
    ],
    ruleRefs: ['Compass'],
    explanation:
      'New electronics, a replaced engine or a steel item stowed near the compass change the deviation. It also drifts, so check it routinely and whenever you have an easy transit. The chart and variation have nothing to do with it.',
  }),
  mcq({
    id: 'cmp-check-not-correction',
    topic: 'compass-checks',
    concept: 'compass:check:not-correction',
    difficulty: 2,
    prompt: 'The syllabus asks for compass checks for deviation "but not correction". What is correction?',
    answer: 'Adjusting the compass with corrector magnets to reduce deviation — a job for a compass adjuster',
    distractors: [
      'Applying deviation to a course with the card',
      'Updating the variation for the current year',
      'Replacing the fluid in the compass bowl',
    ],
    ruleRefs: ['Compass'],
    explanation:
      'Correction, or compensation, means removing deviation at the compass, by corrector magnets placed by an adjuster while the boat is swung. What a skipper does is check it and allow for what remains, using a deviation card.',
  }),

  // --- types -----------------------------------------------------------------
  mcq({
    id: 'cmp-type-hand-bearing',
    topic: 'compass-types',
    concept: 'compass:type:hand-bearing',
    difficulty: 1,
    prompt: 'When can a hand-bearing compass be taken to have no deviation?',
    answer: 'When it is used well away from the engine, steel fittings and electronics',
    distractors: [
      'Always, because it is not fixed to the boat',
      'Only when the boat is on a northerly heading',
      'Never — it has the same deviation as the steering compass',
    ],
    ruleRefs: ['Compass'],
    explanation:
      'The hand-bearing compass has no card of its own because it is used where the boat’s magnetism is negligible — on the foredeck or in the pushpit, clear of the engine and steel rigging. Used beside the chart table it can be well out.',
  }),
  mcq({
    id: 'cmp-type-fluxgate',
    topic: 'compass-types',
    concept: 'compass:type:fluxgate',
    difficulty: 2,
    prompt: 'What is true of a fluxgate compass?',
    answer: 'It senses the earth’s field electronically, needs power, and can feed heading to an autopilot or radar',
    distractors: [
      'It points to true north, so variation does not apply',
      'It is unaffected by the boat’s magnetism, so it has no deviation',
      'It works without power from its own internal magnet',
    ],
    ruleRefs: ['Compass'],
    explanation:
      'A fluxgate is a magnetic compass read electronically, so it is subject to both variation and deviation — most can calibrate the deviation out by turning the boat slowly through a circle. It needs power, and in return gives heading to the autopilot, radar overlay and instruments. A gyro compass is the one that seeks true north.',
  }),
  mcq({
    id: 'cmp-type-gyro',
    topic: 'compass-types',
    concept: 'compass:type:gyro',
    difficulty: 2,
    prompt: 'A ship’s gyro compass differs from a magnetic compass in that it:',
    answer: 'Seeks true north, so neither variation nor deviation applies',
    distractors: [
      'Seeks magnetic north but has no deviation',
      'Needs no power',
      'Is the standard steering compass on small yachts',
    ],
    ruleRefs: ['Compass'],
    explanation:
      'A gyro compass aligns itself with the earth’s axis of rotation, so it reads true directly. It needs power and time to settle, and it is ship equipment, not a yacht’s. Its small error, if any, is found and applied as gyro error.',
  }),
  mcq({
    id: 'cmp-type-cog',
    topic: 'compass-types',
    concept: 'compass:type:cog-not-heading',
    difficulty: 2,
    prompt: 'Your plotter shows COG 205°. Can you use it in place of the compass heading?',
    answer: 'No: COG is your track over the ground, including tidal stream and leeway, not the way the boat is pointing',
    distractors: [
      'Yes: satellite position is more accurate than a compass',
      'Yes, after applying variation',
      'No, because COG is always magnetic',
    ],
    ruleRefs: ['Compass'],
    explanation:
      'Course over ground is derived from successive positions, so it shows where you are going, not where you are heading. With a cross-tide the two can differ by many degrees, and at low speed COG wanders. A satellite compass with two antennas does give heading; an ordinary receiver does not.',
  }),
];
