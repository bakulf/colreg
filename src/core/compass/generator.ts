import type { Question, QuestionSource, Rng } from '../types.ts';
import { pick, shuffle } from '../rng.ts';
import type { DeviationCard, RoseVariation } from './model.ts';
import {
  CARD_STEP,
  bearing,
  error,
  makeCard,
  norm360,
  roseText,
  turn,
  variationMinutesIn,
  variationText,
  wholeDegrees,
} from './model.ts';

/**
 * Compass drills, all generated.
 *
 * Each one sets up a situation — a variation, a deviation card, a heading —
 * computes the answer with the two conversion lines in model.ts, and offers
 * as distractors the answers the classic mistakes produce: a sign applied the
 * wrong way, a step left out, deviation read for the wrong heading. So a wrong
 * choice is always a recognisable wrong method, and the explanation can say
 * which.
 */

type Topic = Question['topic'];

function mcq(
  id: string,
  topic: Topic,
  concept: string,
  prompt: string,
  answer: string,
  distractors: string[],
  explanation: string,
  difficulty: Question['difficulty'],
  scene?: Question['scene'],
): Question {
  return {
    id,
    topic,
    concept,
    prompt,
    choices: [answer, ...distractors].map((text, i) => ({
      id: String.fromCharCode(97 + i),
      text,
    })),
    correct: 'a',
    ruleRefs: ['Compass'],
    explanation,
    difficulty,
    scene,
  };
}

/**
 * Picks up to three wrong answers, in the order given (most instructive
 * first), that are all different from the answer and from each other — and at
 * least `gap` degrees from the answer, so a slip of a degree in reading a card
 * cannot land on a distractor.
 */
function wrongBearings(answer: number, candidates: number[], gap = 2): number[] {
  const chosen: number[] = [];
  for (const c of candidates.map(norm360)) {
    const all = [answer, ...chosen];
    if (all.every((x) => Math.abs(turn(x, c)) >= gap)) chosen.push(c);
    if (chosen.length === 3) break;
  }
  return chosen;
}

/** A non-zero whole-degree error of at least `min`, east or west. */
function someError(rng: Rng, min: number, max: number): number {
  const size = min + Math.floor(rng.next() * (max - min + 1));
  return rng.next() < 0.5 ? -size : size;
}

/** A card with enough deviation to matter, on the headings a drill uses. */
function someCard(rng: Rng): DeviationCard {
  return makeCard(pick([4, 5, 6], rng), Math.floor(rng.next() * 360), pick([-1, 0, 0, 1], rng));
}

function cardHeadings(card: DeviationCard, minAbs: number): number[] {
  return card.deviation
    .map((d, i) => ({ d, h: i * CARD_STEP }))
    .filter((e) => Math.abs(e.d) >= minAbs)
    .map((e) => e.h);
}

function devAt(card: DeviationCard, heading: number): number {
  return card.deviation[norm360(heading) / CARD_STEP] as number;
}

const CADET =
  'With east counted positive and west negative: magnetic = compass + deviation, true = magnetic + variation. Compass to true, add east (CADET); true to compass, the other way.';

// --- variation ---------------------------------------------------------------

function trueToMagneticDrill(rng: Rng): Question {
  for (;;) {
    const v = someError(rng, 2, 9);
    const t = Math.floor(rng.next() * 360);
    const answer = norm360(t - v);
    const wrong = wrongBearings(answer, [t + v, t, t - 2 * v, t + 2 * v]);
    if (wrong.length < 3) continue;
    return mcq(
      `cmp-t2m-${t}-${v}`,
      'compass-variation',
      'compass:var:true-to-magnetic',
      `The chart gives variation ${error(v)}. You lay off a course of ${bearing(t)}T. What is it magnetic?`,
      `${bearing(answer)}M`,
      wrong.map((w) => `${bearing(w)}M`),
      `True to magnetic, variation goes the other way: ${error(v)} is ${v > 0 ? 'subtracted' : 'added'}. ${bearing(t)}T ${v > 0 ? '−' : '+'} ${Math.abs(v)}° = ${bearing(answer)}M. "Variation west, magnetic best": with westerly variation the magnetic figure is the larger. ${CADET}`,
      1,
    );
  }
}

function magneticToTrueDrill(rng: Rng): Question {
  for (;;) {
    const v = someError(rng, 2, 9);
    const m = Math.floor(rng.next() * 360);
    const answer = norm360(m + v);
    const wrong = wrongBearings(answer, [m - v, m, m + 2 * v, m - 2 * v]);
    if (wrong.length < 3) continue;
    return mcq(
      `cmp-m2t-${m}-${v}`,
      'compass-variation',
      'compass:var:magnetic-to-true',
      `A hand-bearing compass, used well clear of anything magnetic, gives a lighthouse at ${bearing(m)}M. Variation is ${error(v)}. What true bearing do you plot?`,
      `${bearing(answer)}T`,
      wrong.map((w) => `${bearing(w)}T`),
      `Magnetic to true, add east and subtract west: ${bearing(m)}M ${v > 0 ? '+' : '−'} ${Math.abs(v)}° = ${bearing(answer)}T. ${CADET}`,
      1,
    );
  }
}

function annualChangeDrill(rng: Rng): Question {
  for (;;) {
    // A sum for the head: the rose on a whole or half degree, and years × the
    // annual change coming to a whole number of degrees or a half — 10' for 6
    // years is 1°, 5' for 6 years is ½°.
    const minutes = (rng.next() < 0.75 ? -1 : 1) * pick([30, 60, 90, 120, 150, 180, 210, 240, 270], rng);
    const [perYear, years] = pick<[number, number]>(
      [
        [5, 6],
        [5, 12],
        [6, 10],
        [10, 3],
        [10, 6],
        [10, 9],
        [10, 12],
        [12, 5],
        [12, 10],
        [6, 5],
        [8, 15],
        [9, 10],
      ],
      rng,
    );
    const annual = (rng.next() < 0.8 ? 1 : -1) * Math.sign(-minutes || 1) * perYear;
    const year = 2004 + Math.floor(rng.next() * 10);
    const target = year + years;
    const rose: RoseVariation = { minutes, year, annualMinutes: annual };

    const now = variationMinutesIn(rose, target);
    // Exactly half a degree has no nearest degree; set another.
    if (Math.abs(now) % 60 === 30) continue;
    const answer = wholeDegrees(now);
    const reversed = wholeDegrees(minutes - annual * (target - year));
    const unchanged = wholeDegrees(minutes);
    const flipped = -answer;
    const texts = [answer, reversed, unchanged, flipped, answer + Math.sign(annual) * 2].map(error);
    const unique = [...new Set(texts)];
    if (unique.length < 4 || unique[0] !== error(answer) || answer === 0) continue;

    const increasing = Math.sign(annual) === Math.sign(minutes);
    const change = annual * (target - year);
    return mcq(
      `cmp-rose-${minutes}-${year}-${annual}-${target}`,
      'compass-variation',
      'compass:var:annual-change',
      `The nearest compass rose on the chart is printed:\n\n${roseText(rose)}\n\nWhat variation do you apply in ${target}, to the nearest degree?`,
      error(answer),
      unique.slice(1, 4),
      `${target - year} years at ${Math.abs(annual)}'${annual > 0 ? 'E' : 'W'} a year is ${Math.abs(change)}' towards the ${change > 0 ? 'east' : 'west'}. ${variationText(minutes)} ${change > 0 ? 'moved east' : 'moved west'} by ${Math.floor(Math.abs(change) / 60)}°${String(Math.abs(change) % 60).padStart(2, '0')}' gives ${variationText(now)}, or ${error(answer)} to the nearest degree. ${
        increasing
          ? 'The annual change has the same name as the variation, so the variation is growing.'
          : 'The annual change is named opposite to the variation, so the variation is shrinking' +
            (Math.sign(now) !== Math.sign(minutes) ? ' — and here it has passed through zero and changed name.' : '.')
      }`,
      2,
      { type: 'compass-rose', rose },
    );
  }
}

// --- deviation ---------------------------------------------------------------

function compassToTrueDrill(rng: Rng): Question {
  for (;;) {
    const card = someCard(rng);
    const headings = cardHeadings(card, 2);
    if (headings.length === 0) continue;
    const c = pick(headings, rng);
    const d = devAt(card, c);
    const v = someError(rng, 2, 7);
    if (Math.abs(d) === Math.abs(v)) continue;
    const answer = norm360(c + d + v);
    const wrong = wrongBearings(answer, [c - d + v, c + d - v, c + v, c - d - v]);
    if (wrong.length < 3) continue;
    return mcq(
      `cmp-c2t-${c}-${d}-${v}`,
      'compass-deviation',
      'compass:dev:compass-to-true',
      `You are steering ${bearing(c)}C. Variation is ${error(v)}. Using the deviation card, what is your true course?`,
      `${bearing(answer)}T`,
      wrong.map((w) => `${bearing(w)}T`),
      `The card gives ${error(d)} for a ship's head of ${bearing(c)}C, so ${bearing(c)}C ${d > 0 ? '+' : '−'} ${Math.abs(d)}° = ${bearing(c + d)}M; then variation ${error(v)}: ${bearing(c + d)}M ${v > 0 ? '+' : '−'} ${Math.abs(v)}° = ${bearing(answer)}T. ${CADET}`,
      2,
      { type: 'deviation-card', card },
    );
  }
}

function trueToCompassDrill(rng: Rng): Question {
  for (;;) {
    const card = someCard(rng);
    const headings = cardHeadings(card, 2);
    if (headings.length === 0) continue;
    // Chosen so the compass course lands on a heading the card lists.
    const c = pick(headings, rng);
    const d = devAt(card, c);
    const v = someError(rng, 2, 7);
    if (Math.abs(d) === Math.abs(v)) continue;
    const m = norm360(c + d);
    const t = norm360(m + v);
    const wrong = wrongBearings(c, [m + d, t + v - d, m, t + v + d, t]);
    if (wrong.length < 3) continue;
    return mcq(
      `cmp-t2c-${t}-${d}-${v}`,
      'compass-deviation',
      'compass:dev:true-to-compass',
      `The course to make good is ${bearing(t)}T, with no tidal stream or leeway. Variation is ${error(v)}. Using the deviation card, what compass course do you give the helmsman?`,
      `${bearing(c)}C`,
      wrong.map((w) => `${bearing(w)}C`),
      `True to magnetic, reverse the variation: ${bearing(t)}T ${v > 0 ? '−' : '+'} ${Math.abs(v)}° = ${bearing(m)}M. The card is indexed by compass heading, so look for the heading that, with its deviation, gives ${bearing(m)}M: ${bearing(c)}C, deviation ${error(d)}, and ${bearing(c)} ${d > 0 ? '+' : '−'} ${Math.abs(d)} = ${bearing(m)}. ${CADET}`,
      3,
      { type: 'deviation-card', card },
    );
  }
}

function steeringBearingDrill(rng: Rng): Question {
  for (;;) {
    const card = someCard(rng);
    const heads = cardHeadings(card, 2);
    if (heads.length === 0) continue;
    const head = pick(heads, rng);
    const dHead = devAt(card, head);
    // The bearing is itself a card heading with a different deviation, so
    // reading the card for it is a visible, wrong, answer.
    const others = card.deviation
      .map((d, i) => ({ d, h: i * CARD_STEP }))
      .filter((e) => e.d !== dHead && Math.abs(turn(e.h, head)) >= 60);
    if (others.length === 0) continue;
    const b = pick(others, rng);
    const v = someError(rng, 2, 6);
    const answer = norm360(b.h + dHead + v);
    const trap = norm360(b.h + b.d + v);
    const wrong = wrongBearings(answer, [trap, b.h + v, b.h - dHead + v, b.h + dHead - v]);
    // The whole point is the wrong heading's deviation; if it cannot be
    // offered clearly apart from the answer, set another.
    if (wrong.length < 3 || wrong[0] !== trap) continue;
    return mcq(
      `cmp-sbrg-${head}-${b.h}-${v}`,
      'compass-deviation',
      'compass:dev:bearing-ship-head',
      `Steering ${bearing(head)}C, you take a bearing of a headland over the steering compass: ${bearing(b.h)}C. Variation ${error(v)}. Using the deviation card, what true bearing do you plot?`,
      `${bearing(answer)}T`,
      wrong.map((w) => `${bearing(w)}T`),
      `Deviation depends on which way the boat is heading, not on what you are looking at: the boat's magnetic field moves with the boat. So use the card for the ship's head, ${bearing(head)}C: ${error(dHead)}. ${bearing(b.h)}C ${dHead > 0 ? '+' : '−'} ${Math.abs(dHead)}° = ${bearing(b.h + dHead)}M, then ${error(v)} gives ${bearing(answer)}T. The card's ${error(b.d)} against ${bearing(b.h)} is the deviation you would have if you were steering ${bearing(b.h)}.`,
      3,
      { type: 'deviation-card', card },
    );
  }
}

function handBearingDrill(rng: Rng): Question {
  for (;;) {
    const card = someCard(rng);
    const heads = cardHeadings(card, 3);
    if (heads.length === 0) continue;
    const head = pick(heads, rng);
    const d = devAt(card, head);
    const v = someError(rng, 2, 6);
    const b = Math.floor(rng.next() * 360);
    const answer = norm360(b + v);
    const wrong = wrongBearings(answer, [b + d + v, b - v, b + d - v, b]);
    if (wrong.length < 3) continue;
    return mcq(
      `cmp-hbc-${head}-${b}-${v}`,
      'compass-deviation',
      'compass:dev:hand-bearing',
      `Steering ${bearing(head)}C, you stand in the pushpit, well away from the engine and anything magnetic, and take a bearing of a church spire with the hand-bearing compass: ${bearing(b)}. Variation ${error(v)}. What true bearing do you plot?`,
      `${bearing(answer)}T`,
      wrong.map((w) => `${bearing(w)}T`),
      `The deviation card belongs to the steering compass in its fixed place. A hand-bearing compass used where nothing magnetic is near is taken as having no deviation, so its reading is magnetic: ${bearing(b)}M ${v > 0 ? '+' : '−'} ${Math.abs(v)}° = ${bearing(answer)}T. Applying the steering compass's ${error(d)} as well is the mistake. The assumption fails if you use it near the engine, the rigging's steel or a phone.`,
      2,
      { type: 'deviation-card', card },
    );
  }
}

// --- checking the compass ----------------------------------------------------

function transitCheckDrill(rng: Rng): Question {
  for (;;) {
    const t = Math.floor(rng.next() * 360);
    const v = someError(rng, 1, 5);
    const d = someError(rng, 1, 6);
    const m = norm360(t - v);
    const c = norm360(m - d);
    const head = norm360(c + pick([-40, -20, 20, 40, 90, 180], rng));
    const texts = [d, -d, turn(c, t), turn(c, norm360(t + v))].map(error);
    const unique = [...new Set(texts)];
    if (unique.length < 4 || unique[0] !== error(d)) continue;
    return mcq(
      `cmp-transit-${t}-${v}-${d}`,
      'compass-checks',
      'compass:check:transit',
      `Two charted beacons come into transit. On the chart the transit line is ${bearing(t)}T. As they line up, the steering compass gives ${bearing(c)}C; you are on ${bearing(head)}C. Variation ${error(v)}. What is the deviation on this heading?`,
      error(d),
      unique.slice(1, 4),
      `Turn the charted bearing into magnetic, then compare with the compass: ${bearing(t)}T ${v > 0 ? '−' : '+'} ${Math.abs(v)}° = ${bearing(m)}M. The compass says ${bearing(c)}C. Deviation = magnetic − compass = ${error(d)}: the compass reads ${d > 0 ? 'less' : 'more'} than magnetic, so the error is ${d > 0 ? 'east' : 'west'} ("error west, compass best"). It holds for this heading only; a check on other headings builds the card.`,
      3,
    );
  }
}

function compareCheckDrill(rng: Rng): Question {
  for (;;) {
    const d = someError(rng, 2, 6);
    const c = Math.floor(rng.next() * 360);
    const m = norm360(c + d);
    const answer = error(d);
    const options = [answer, error(-d), error(2 * d), 'None can be found without knowing the variation'];
    if (new Set(options).size < 4) continue;
    return mcq(
      `cmp-compare-${c}-${d}`,
      'compass-checks',
      'compass:check:hand-bearing-compare',
      `To check the steering compass, you stand where a hand-bearing compass has no deviation and sight it along the boat's centreline: ${bearing(m)}M. At the same moment the steering compass shows ${bearing(c)}C. What is the deviation on this heading?`,
      answer,
      shuffle(options.slice(1), rng),
      `Both instruments are magnetic compasses, so variation plays no part. The hand-bearing compass gives the magnetic heading, ${bearing(m)}M; the steering compass shows ${bearing(c)}C. Deviation = magnetic − compass = ${error(d)}. Repeated on several headings, this is how a yachtsman makes a deviation card without a compass adjuster.`,
      2,
    );
  }
}

// --- sources -----------------------------------------------------------------

export function compassSources(): QuestionSource[] {
  const drills: [string, Topic, Question['difficulty'], (rng: Rng) => Question][] = [
    ['compass:var:true-to-magnetic', 'compass-variation', 1, trueToMagneticDrill],
    ['compass:var:magnetic-to-true', 'compass-variation', 1, magneticToTrueDrill],
    ['compass:var:annual-change', 'compass-variation', 2, annualChangeDrill],
    ['compass:dev:compass-to-true', 'compass-deviation', 2, compassToTrueDrill],
    ['compass:dev:true-to-compass', 'compass-deviation', 3, trueToCompassDrill],
    ['compass:dev:bearing-ship-head', 'compass-deviation', 3, steeringBearingDrill],
    ['compass:dev:hand-bearing', 'compass-deviation', 2, handBearingDrill],
    ['compass:check:transit', 'compass-checks', 3, transitCheckDrill],
    ['compass:check:hand-bearing-compare', 'compass-checks', 2, compareCheckDrill],
  ];
  return drills.map(([concept, topic, difficulty, generate]) => ({
    id: `gen-${concept}`,
    topic,
    concept,
    difficulty,
    generated: true,
    generate,
  }));
}

export {
  trueToMagneticDrill,
  magneticToTrueDrill,
  annualChangeDrill,
  compassToTrueDrill,
  trueToCompassDrill,
  steeringBearingDrill,
  handBearingDrill,
  transitCheckDrill,
  compareCheckDrill,
};
