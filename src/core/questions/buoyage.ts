import type { Question } from '../types.ts';
import { mcq } from './helpers.ts';

/**
 * IALA Maritime Buoyage System, Region A — the system in force in UK and
 * European waters and therefore the one the RYA syllabus examines.
 *
 * From M5 the same concepts are drilled by a renderer that draws the buoy and
 * flashes its real light characteristic in real time; these questions cover the
 * colours, topmarks and naming that a moving picture still needs words for.
 */
export const BUOYAGE_QUESTIONS: Question[] = [
  mcq({
    id: 'buo-lateral-port-a',
    topic: 'iala-lateral',
    concept: 'iala-a:port-hand',
    difficulty: 1,
    prompt: 'In IALA Region A, a port-hand lateral mark is:',
    answer: 'Red, can shaped, with a red light if lit',
    distractors: [
      'Green, conical, with a green light if lit',
      'Red, conical, with a red light if lit',
      'Green, can shaped, with a white light if lit',
    ],
    ruleRefs: ['IALA A'],
    explanation:
      'Region A: red can to port, green cone to starboard, taken along the conventional direction of buoyage. That direction is usually the one a vessel takes when approaching a harbour, river or estuary from seaward, but not always: elsewhere it is set by the buoyage authority, and around continental landmasses it generally runs clockwise. "Returning from seaward" is the common case, not the definition. Region B, which covers the Americas, Japan, Korea and the Philippines, reverses the colours but keeps the shapes.',
  }),
  mcq({
    id: 'buo-preferred-channel',
    topic: 'iala-lateral',
    concept: 'iala-a:preferred-channel',
    difficulty: 3,
    prompt: 'In Region A you see a red can buoy with a single broad green horizontal band, showing Fl(2+1)R. What is it?',
    answer: 'A preferred channel to starboard mark — the main channel lies to starboard of the buoy, so leave it to port',
    distractors: [
      'A preferred channel to port mark — leave it to starboard',
      'An isolated danger mark',
      'A port-hand mark temporarily marking a wreck',
    ],
    ruleRefs: ['IALA A'],
    explanation:
      'The body colour and shape give the mark its primary character — here a port-hand mark, so you leave it to port — and the contrasting band names the preferred channel. Red body with green band: preferred channel to starboard.',
  }),
  mcq({
    id: 'buo-cardinal-south-topmark',
    topic: 'iala-cardinal',
    concept: 'iala:cardinal-topmarks',
    difficulty: 2,
    prompt: 'A cardinal mark carries two black cones in a vertical line, both points downwards. It is a:',
    answer: 'South cardinal mark — safe water lies to the south of it',
    distractors: [
      'North cardinal mark — safe water lies to the north of it',
      'West cardinal mark — safe water lies to the west of it',
      'South cardinal mark — safe water lies to the north of it',
    ],
    ruleRefs: ['IALA'],
    explanation:
      'The topmark cones point the way the colour bands run: north, both up, black over yellow; south, both down, yellow over black. You pass on the named side — a south cardinal is passed to its south.',
  }),
  mcq({
    id: 'buo-cardinal-west',
    topic: 'iala-cardinal',
    concept: 'iala:cardinal-west',
    difficulty: 2,
    prompt: 'What are the topmark and body colours of a west cardinal mark?',
    answer: 'Two black cones point to point, on a yellow body with a single broad black horizontal band',
    distractors: [
      'Two black cones base to base, on a black body with a single broad yellow horizontal band',
      'Two black cones point to point, on a black body with a single broad yellow horizontal band',
      'Two black cones both points upwards, on a black body over yellow',
    ],
    ruleRefs: ['IALA'],
    explanation:
      'West: cones point to point, making a wine glass or a waist — yellow, black band, yellow. East: cones base to base, making an egg — black, yellow band, black.',
  }),
  mcq({
    id: 'buo-cardinal-lights',
    topic: 'iala-cardinal',
    concept: 'iala:cardinal-lights',
    difficulty: 3,
    prompt: 'A white light shows Q(6) followed by one long flash, repeating every 15 seconds. It marks:',
    answer: 'A south cardinal — safe water to the south',
    distractors: [
      'A west cardinal — safe water to the west',
      'An east cardinal — safe water to the east',
      'A north cardinal — safe water to the north',
    ],
    ruleRefs: ['IALA'],
    explanation:
      'Cardinal light rhythms follow the clock face: east 3 flashes (3 o\'clock), south 6 (6 o\'clock), west 9 (9 o\'clock), north continuous quick or very quick. The long flash after the south group exists purely to stop you miscounting six as nine or three.',
  }),
  mcq({
    id: 'buo-isolated-danger',
    topic: 'iala-isolated-danger',
    concept: 'iala:isolated-danger',
    difficulty: 2,
    prompt: 'A black buoy with one or more broad red horizontal bands, carrying two black spheres in a vertical line, is:',
    answer: 'An isolated danger mark, stationed on or above a danger with navigable water all round it',
    distractors: [
      'A safe water mark',
      'A special mark indicating a spoil ground',
      'An emergency wreck marking buoy',
    ],
    ruleRefs: ['IALA'],
    explanation:
      'Its light is a white flash, group flashing two — Fl(2). Two black balls, two flashes: the topmark and the rhythm agree, which is the easiest way to hold it.',
  }),
  mcq({
    id: 'buo-safe-water',
    topic: 'iala-safe-water',
    concept: 'iala:safe-water',
    difficulty: 2,
    prompt: 'A buoy with red and white vertical stripes and a single red sphere topmark indicates:',
    answer: 'Safe water — navigable water all round the mark, such as a landfall or mid-channel mark',
    distractors: [
      'An isolated danger with navigable water all round it',
      'The centre of a traffic separation scheme',
      'A special mark whose purpose is given on the chart',
    ],
    ruleRefs: ['IALA'],
    explanation:
      'Safe water lights are white and deliberately unlike anything else: isophase, occulting, one long flash every 10 seconds, or Morse A. None of those rhythms is used by any other mark in the system.',
  }),
  mcq({
    id: 'buo-special-mark',
    topic: 'iala-special',
    concept: 'iala:special-mark',
    difficulty: 1,
    prompt: 'A yellow buoy with a yellow cross topmark and a yellow light is:',
    answer: 'A special mark, indicating a feature whose nature is shown on the chart, such as a spoil ground or a cable',
    distractors: [
      'A quarantine mark',
      'A mark indicating the limit of navigable water',
      'An emergency wreck marking buoy',
    ],
    ruleRefs: ['IALA'],
    explanation:
      'Special marks are yellow throughout: yellow body, yellow St Andrew\'s cross topmark, yellow light with any rhythm not used by the white lights of the system. They are not primarily navigational — the chart tells you what the feature is.',
  }),
  mcq({
    id: 'buo-emergency-wreck',
    topic: 'iala-wreck',
    concept: 'iala:emergency-wreck',
    difficulty: 3,
    prompt: 'A buoy with blue and yellow vertical stripes, a yellow cross topmark, and an alternating blue and yellow light is:',
    answer: 'An emergency wreck marking buoy, marking a new wreck not yet shown on the chart',
    distractors: [
      'A special mark marking a historic wreck',
      'An isolated danger mark of the new pattern',
      'A mark indicating an area closed to navigation',
    ],
    ruleRefs: ['IALA'],
    explanation:
      'Introduced after the Tricolor collisions in the Dover Strait in 2002. The light alternates blue and yellow, one second each with a half-second interval, and the buoy stays in place until the wreck is charted and conventionally marked.',
  }),
  mcq({
    id: 'buo-region-b-where',
    topic: 'iala-lateral-b',
    concept: 'iala-b:where',
    difficulty: 1,
    prompt: 'Where is IALA Region B in use?',
    answer: 'North, Central and South America, Japan, the Republic of Korea and the Philippines',
    distractors: [
      'Europe, Africa and Australia',
      'The whole of Asia and the Pacific',
      'The southern hemisphere',
    ],
    ruleRefs: ['IALA Region B'],
    explanation:
      'IALA R1001: the rules for System B were drawn up for North, Central and South America, Japan, the Republic of Korea and the Philippines, and the 1980 conference combined A and B into one system with two regions. Region A covers Europe, Africa, Australia, New Zealand, the Gulf and most of Asia. The exact boundaries are on the chart and in the Admiralty List of Lights.',
  }),
  mcq({
    id: 'buo-region-b-stbd',
    topic: 'iala-lateral-b',
    concept: 'iala-b:starboard-hand',
    difficulty: 1,
    prompt: 'In IALA Region B, a starboard-hand lateral mark is:',
    answer: 'Red, conical, with a red light if lit',
    distractors: [
      'Green, conical, with a green light if lit',
      'Red, can shaped, with a red light if lit',
      'Green, can shaped, with a white light if lit',
    ],
    ruleRefs: ['IALA Region B'],
    explanation:
      'R1001 Table 2: in Region B the colours are reversed — red to starboard, green to port — and the shapes are not: a cone is still starboard-hand and a can still port-hand. The American mnemonic is "red right returning": returning from seaward, keep the red marks on your right.',
  }),
  mcq({
    id: 'buo-region-b-same',
    topic: 'iala-lateral-b',
    concept: 'iala-b:what-changes',
    difficulty: 2,
    prompt: 'Sailing from Region A into Region B, what changes in the buoyage?',
    answer: 'Only the colours of the lateral and preferred channel marks, and of their lights',
    distractors: [
      'The lateral colours, and the cardinal marks are reversed too',
      'The shapes of the lateral marks: cans become starboard-hand',
      'The lateral colours, and safe water marks become green and white',
    ],
    ruleRefs: ['IALA Region B'],
    explanation:
      'R1001: "The Cardinal marks in Region A and Region B, and their use, are the same", and so are isolated danger, safe water, special and emergency wreck marks. Shapes and topmark shapes of lateral marks do not change either: a can is port-hand in both regions. Only red and green swap sides.',
  }),
  mcq({
    id: 'buo-region-b-preferred',
    topic: 'iala-lateral-b',
    concept: 'iala-b:preferred-channel',
    difficulty: 3,
    prompt: 'In Region B you see a green can buoy with one broad red horizontal band, showing Fl(2+1)G. What is it, and which side do you leave it?',
    answer: 'A preferred channel to starboard mark — leave it to port; the main channel lies to starboard',
    distractors: [
      'A preferred channel to port mark — leave it to starboard',
      'A port-hand mark that has been repainted — leave it to starboard',
      'An isolated danger mark — keep well clear on either side',
    ],
    ruleRefs: ['IALA Region B'],
    explanation:
      'R1001 Table 4. The body decides what you do: a green can is a Region B port-hand mark, so leave it to port. The band decides where the main channel goes: red, the starboard-hand colour in Region B, so the preferred channel is to starboard of it. The same buoy in Region A colours would be red with a green band.',
  }),
];
