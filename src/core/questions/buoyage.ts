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
    topic: 'buoyage',
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
    teachingNote:
      'Shape survives the region change; colour does not. A student who anchors on "can to port, cone to starboard" only has to relearn one thing if they ever sail in Region B. Make them say which way the conventional direction runs before they read any lateral mark — in a tidal estuary with two entrances it is not obvious, and the chart carries the arrow for exactly that reason.',
  }),
  mcq({
    id: 'buo-preferred-channel',
    topic: 'buoyage',
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
    teachingNote:
      'Two questions in order, always: what is the body, and what is the band? The body tells you what to do; the band tells you where the main channel goes. Students who try to read it as one symbol get it backwards.',
    misconception:
      'The 2+1 rhythm is the giveaway that you are looking at a preferred channel mark at all. No plain lateral mark uses composite group flashing.',
  }),
  mcq({
    id: 'buo-cardinal-south-topmark',
    topic: 'buoyage',
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
    teachingNote:
      'Teach the topmarks first and derive the colours from them: the black band is always at the end the cones point to. North cones up, black on top. South cones down, black at the bottom.',
  }),
  mcq({
    id: 'buo-cardinal-west',
    topic: 'buoyage',
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
    teachingNote:
      '"West is a wine glass, East is an egg" earns its keep. The band then follows the rule that black sits where the cone points touch the body.',
  }),
  mcq({
    id: 'buo-cardinal-lights',
    topic: 'buoyage',
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
    teachingNote:
      'The clock face is the whole system, and once the student has it they can decode any cardinal light without a card. Make the point about the long flash explicitly — students assume it carries extra meaning, and it does not.',
  }),
  mcq({
    id: 'buo-isolated-danger',
    topic: 'buoyage',
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
    topic: 'buoyage',
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
    teachingNote:
      'Morse A — short, long — is the memorable one, and it is worth pointing out that it is the same letter flown as a flag for a diver down. Different context, no relation; students sometimes try to connect them.',
  }),
  mcq({
    id: 'buo-special-mark',
    topic: 'buoyage',
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
    topic: 'buoyage',
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
    teachingNote:
      'Blue is used nowhere else in the system, which is the design intent: it is meant to look wrong and stop you assuming you know what it is.',
  }),
];
