import type { Question } from '../types.ts';
import { mcq } from './helpers.ts';

/**
 * Position fixing (section 1 of the RYA Coastal Skipper / Yachtmaster Offshore
 * syllabus) and pilotage (section 7): what the generated drills do not ask.
 * Wording is original.
 */
export const POSITION_QUESTIONS: Question[] = [
  // --- visual fixing ---------------------------------------------------------
  mcq({
    id: 'pos-vis-transit',
    topic: 'position-visual',
    concept: 'position:def:transit',
    difficulty: 1,
    prompt: 'Which gives the most accurate single position line?',
    answer: 'A transit: two charted objects in line',
    distractors: [
      'A hand-bearing compass bearing of a distant headland',
      'A radar bearing',
      'A bearing of a lighthouse taken over the steering compass',
    ],
    ruleRefs: ['Position fixing'],
    explanation:
      'A transit needs no compass, so it carries no compass error, deviation or reading error: when two charted objects are in line, you are on that line exactly. Crossed with a bearing it gives an excellent fix.',
  }),
  mcq({
    id: 'pos-vis-near',
    topic: 'position-visual',
    concept: 'position:def:near-objects',
    difficulty: 2,
    prompt: 'For a bearing fix, why choose near objects rather than distant ones, when both are charted?',
    answer: 'A degree of error moves the position line less the nearer the object is',
    distractors: [
      'Near objects are always lit',
      'Distant objects are not shown on the chart',
      'Bearings of distant objects need deviation applied twice',
    ],
    ruleRefs: ['Position fixing'],
    explanation:
      'A one-degree error is about 1 mile off at 60 miles, but only 0.1 mile at 6. Near, well-defined, charted objects — a beacon, a church spire — beat a vague headland 10 miles away.',
  }),
  mcq({
    id: 'pos-vis-running',
    topic: 'position-mixed',
    concept: 'position:def:running-fix',
    difficulty: 2,
    prompt: 'Only one charted object is in sight. How can you still get a fix?',
    answer: 'A running fix: take two bearings of it some time apart, and move the first position line along your course and distance run',
    distractors: [
      'Take two bearings a minute apart and cross them directly',
      'Take one bearing and assume you are on your course line',
      'It cannot be done without a second object',
    ],
    ruleRefs: ['Position fixing'],
    explanation:
      'Transfer the first position line by the course and distance made good between the bearings — allowing for tide — and cross it with the second. It depends on that run being right, so it is less reliable than a simultaneous fix.',
  }),
  mcq({
    id: 'pos-mix-depth',
    topic: 'position-mixed',
    concept: 'position:def:depth-line',
    difficulty: 2,
    prompt: 'You have one bearing of a lighthouse and an echo sounder. How can the depth help?',
    answer: 'Reduced to chart datum, the depth puts you on a contour; where the bearing crosses that contour is a fix',
    distractors: [
      'The depth gives your distance from the lighthouse directly',
      'Depths cannot be used for position',
      'Only if the depth is less than 5 m',
    ],
    ruleRefs: ['Position fixing'],
    explanation:
      'Take off the height of tide (and allow for the transducer depth) to get the charted depth, then find where that contour meets your position line. It works best where contours are clear and the bottom slopes steadily.',
  }),
  mcq({
    id: 'pos-radar-range',
    topic: 'position-radar',
    concept: 'position:def:radar-ranges',
    difficulty: 1,
    prompt: 'On a small-craft radar, which is more accurate: ranges or bearings?',
    answer: 'Ranges; radar bearings are poor because of the wide beam and the boat’s yaw',
    distractors: [
      'Bearings; ranges depend on the weather',
      'Both are equally accurate',
      'Neither can be used for a fix',
    ],
    ruleRefs: ['Position fixing'],
    explanation:
      'A small scanner’s beam is several degrees wide and the heading wanders, so radar bearings are rough. Ranges, from the variable range marker, are good. Two or three ranges make a good fix; a radar range with a visual bearing makes another.',
  }),
  mcq({
    id: 'pos-radar-target',
    topic: 'position-radar',
    concept: 'position:def:radar-target',
    difficulty: 2,
    prompt: 'Which coast makes the best radar target for a range?',
    answer: 'A steep cliff, rising sharply from the water',
    distractors: [
      'A low, sandy beach',
      'A gently sloping mudflat',
      'A range of hills several miles inland',
    ],
    ruleRefs: ['Position fixing'],
    explanation:
      'A steep face returns a strong echo from the waterline, so the range is to the charted coastline. A low shore may not show at all, and inland hills show — but you would be ranging the hills, not the coast.',
  }),
  mcq({
    id: 'pos-gnss-datum',
    topic: 'position-gnss',
    concept: 'position:def:gnss-datum',
    difficulty: 2,
    prompt: 'Why check the horizontal datum in the chart’s notes before plotting a GNSS position?',
    answer: 'GNSS works in WGS84; a chart on another datum needs the shift given in its notes, or the plotter set to match',
    distractors: [
      'Because GNSS positions are in magnetic',
      'Because the datum changes with the tide',
      'It does not matter: all charts use the same datum',
    ],
    ruleRefs: ['Position fixing'],
    explanation:
      'Most modern charts are on WGS84, like GNSS. Older ones may be on another datum, and the difference can be a couple of hundred metres — plenty to put you on the rocks in pilotage. The chart states the shift.',
  }),
  mcq({
    id: 'pos-gnss-check',
    topic: 'position-gnss',
    concept: 'position:def:gnss-check',
    difficulty: 1,
    prompt: 'GNSS is accurate to a few metres. Why still keep a check by other means?',
    answer: 'It can fail or be jammed, and a wrong waypoint or chart error goes unnoticed without an independent check',
    distractors: [
      'Because GNSS is only accurate to a mile',
      'Because the law forbids navigating by GNSS alone',
      'There is no need',
    ],
    ruleRefs: ['Position fixing'],
    explanation:
      'The position may be right while the chart is wrong, the waypoint mistyped, the antenna failed or the signal jammed. A regular plot on the paper chart, confirmed by bearings, a depth or a transit, keeps you in control when it goes wrong.',
  }),
  mcq({
    id: 'pos-acc-rank',
    topic: 'position-accuracy',
    concept: 'position:def:accuracy-rank',
    difficulty: 2,
    prompt: 'Which list runs from most to least reliable?',
    answer: 'Transit with a bearing; three-bearing fix; running fix; EP; DR',
    distractors: [
      'DR; EP; running fix; three-bearing fix; transit',
      'EP; three-bearing fix; DR; transit; running fix',
      'Running fix; transit; EP; DR; three-bearing fix',
    ],
    ruleRefs: ['Position fixing'],
    explanation:
      'Each step down relies more on things you cannot see: a running fix on the run between bearings, an EP on predicted tide and estimated leeway, a DR on course and log alone. Plot each for what it is.',
  }),
  mcq({
    id: 'pos-acc-area',
    topic: 'position-accuracy',
    concept: 'position:def:area-uncertainty',
    difficulty: 2,
    prompt: 'What happens to the area of uncertainty around an EP as the hours pass without a fix?',
    answer: 'It grows, as errors in tide, leeway, steering and log add up',
    distractors: [
      'It stays the same',
      'It shrinks, as the errors average out',
      'It disappears once the tide turns',
    ],
    ruleRefs: ['Position fixing'],
    explanation:
      'Every hour adds its own error, so the circle of where you might be widens. Keep clear of danger by at least its radius, and get a fix before closing the coast.',
  }),
];

export const PILOTAGE_QUESTIONS: Question[] = [
  mcq({
    id: 'pil-sig-where',
    topic: 'pilotage-signals',
    concept: 'pilotage:def:harbour-rules',
    difficulty: 1,
    prompt: 'Where do you find a harbour’s regulations and its signals before arriving?',
    answer: 'In the almanac and pilot book, and the harbour authority’s notices',
    distractors: [
      'Only on the chart',
      'In the COLREGs',
      'They are the same in every harbour',
    ],
    ruleRefs: ['Pilotage'],
    explanation:
      'Harbour and local regulations — speed limits, channels for small craft, the VHF channel of port control, signals and reporting points — are in almanacs, pilot books and the authority’s own notices. They sit alongside the COLREGs, which Rule 1(b) allows.',
  }),
  mcq({
    id: 'pil-plan-contents',
    topic: 'pilotage-planning',
    concept: 'pilotage:def:plan',
    difficulty: 1,
    prompt: 'What belongs in a pilotage plan?',
    answer: 'Headings and distances between turning points, the marks to look for, transits and clearing bearings, and depths',
    distractors: [
      'Only the GPS waypoints',
      'The tidal stream atlas and nothing else',
      'The full passage plan from the last port',
    ],
    ruleRefs: ['Pilotage'],
    explanation:
      'Pilotage is navigating by eye, close to danger, when there is no time to plot. So the plan does the thinking beforehand: what to steer, how far, what to see, what keeps you safe — in a simple sketch you can use on deck.',
  }),
  mcq({
    id: 'pil-plan-when',
    topic: 'pilotage-planning',
    concept: 'pilotage:def:plan-when',
    difficulty: 1,
    prompt: 'When should a pilotage plan be prepared?',
    answer: 'Beforehand, from the chart, pilot book and tide tables — close to danger there is no time to work it out',
    distractors: [
      'On arrival, as the marks come into sight',
      'Only if the GPS fails',
      'After entering, for the log',
    ],
    ruleRefs: ['Pilotage'],
    explanation:
      'In pilotage things happen quickly and the skipper should be watching the water, not the chart table. So the thinking is done in advance: what to steer, how far, which marks to find, what keeps you clear, the height of tide — written on one clear sheet that can be taken on deck.',
  }),
  mcq({
    id: 'pil-clr-why',
    topic: 'pilotage-clearing',
    concept: 'pilotage:def:clearing',
    difficulty: 1,
    prompt: 'What is a clearing line for?',
    answer: 'To keep you clear of a danger by checking one bearing, without plotting a fix',
    distractors: [
      'To mark the centre of the channel',
      'To show where to anchor',
      'To give a distance off the coast',
    ],
    ruleRefs: ['Pilotage'],
    explanation:
      'A bearing of a charted mark, or a transit, that passes just clear of the danger. While the mark bears on the safe side of the line — not more than, or not less than — you are clear.',
  }),
  mcq({
    id: 'pil-clr-nmt',
    topic: 'pilotage-clearing',
    concept: 'pilotage:def:nmt-nlt',
    difficulty: 1,
    prompt: 'On a pilotage plan, what do "NMT 045°" and "NLT 045°" mean?',
    answer: 'Not more than 045° and not less than 045°: the limits a clearing bearing of the mark must stay within',
    distractors: [
      'Nautical miles to go and nautical miles left',
      'Night-time and daylight bearings',
      'Next mark to steer for, and next light to look for',
    ],
    ruleRefs: ['Pilotage'],
    explanation:
      'RYA shorthand for clearing bearings. "NMT 045°": the mark must bear 045° or less — if it bears more, you are over the line towards the danger. Rule of thumb, looking along the line at the mark: danger on the left, NMT; danger on the right, NLT.',
  }),
  mcq({
    id: 'pil-snd-contour',
    topic: 'pilotage-soundings',
    concept: 'pilotage:def:contour',
    difficulty: 2,
    prompt: 'In poor visibility, approaching a coast, how can the echo sounder guide you?',
    answer: 'Follow a chosen depth contour, reduced for the tide, that leads safely where you want to go',
    distractors: [
      'Steer for the deepest water you can find',
      'Keep the reading constant at whatever it shows now',
      'It cannot help without GPS',
    ],
    ruleRefs: ['Pilotage'],
    explanation:
      'Pick a contour clear of dangers, work out what the sounder should read on it at the time, and steer to hold that reading. It gives a line to follow when nothing can be seen.',
  }),
  mcq({
    id: 'pil-lead-stern',
    topic: 'pilotage-transits',
    concept: 'pilotage:def:stern-transit',
    difficulty: 2,
    prompt: 'Leaving harbour, why keep a transit astern in line?',
    answer: 'It shows at once if you are being set off the track, with no compass needed',
    distractors: [
      'It is required by the COLREGs',
      'Transits only work astern',
      'It gives your speed over the ground',
    ],
    ruleRefs: ['Pilotage'],
    explanation:
      'A back transit works like a leading line ahead. As long as the marks stay in line, you are on the track; if they open, you are being set and can correct before it matters.',
  }),
];
