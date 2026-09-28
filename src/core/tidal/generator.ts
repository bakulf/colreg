import type { Question, QuestionSource, Rng, Scene } from '../types.ts';
import { pick, shuffle } from '../rng.ts';
import type { Diamond, Ranges, TriangleDiagram, Vec } from './model.ts';
import {
  bearing,
  courseToSteer,
  ctsDiagram,
  ctsReversedTide,
  ctsToWaypoint,
  epDiagram,
  fromPolar,
  headingForWaterTrack,
  makeDiamond,
  norm360,
  oneInSixty,
  rateFor,
  rowFor,
  turn,
  waterTrackForHeading,
} from './model.ts';

/**
 * Tidal stream drills, built to be done without a plotter.
 *
 * The chartwork is split into the steps an examiner checks — reading the
 * diamond, interpolating the rate, which way to allow for the stream and for
 * leeway, whether a triangle is built right — and each is a question that can
 * be answered in the head or with a line of arithmetic. The app does the exact
 * vector solution, uses it for the answer, and after answering draws the
 * triangle with the conventional arrows. Options are far enough apart that a
 * sound estimate, by the one-in-sixty rule or a sketch, lands on the right one.
 *
 * Diamonds, ports and passages are invented: the Admiralty's are not ours to
 * reproduce.
 */

type Topic = Question['topic'];

const PORT = 'Portmoor';

function mcq(
  id: string,
  topic: Topic,
  concept: string,
  prompt: string,
  answer: string,
  distractors: string[],
  explanation: string,
  difficulty: Question['difficulty'],
  scene?: Scene,
  afterScene?: Scene,
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
    ruleRefs: ['Tidal streams'],
    explanation,
    difficulty,
    scene,
    afterScene,
  };
}

function wrongBearings(answer: number, candidates: number[], gap: number): number[] {
  const chosen: number[] = [];
  for (const c of candidates.map(norm360)) {
    if ([answer, ...chosen].every((x) => Math.abs(turn(x, c)) >= gap)) chosen.push(c);
    if (chosen.length === 3) break;
  }
  return chosen;
}

function wrongNumbers(answer: number, candidates: number[], gap: number): number[] {
  const chosen: number[] = [];
  for (const c of candidates) {
    if (!(c >= 0)) continue;
    if ([answer, ...chosen].every((x) => Math.abs(x - c) >= gap - 1e-9)) chosen.push(c);
    if (chosen.length === 3) break;
  }
  return chosen;
}

const kn = (x: number) => `${x.toFixed(1)} kn`;
const r1 = (x: number) => Math.round(x * 10) / 10;

function clock(minutes: number): string {
  const m = ((Math.round(minutes) % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}${String(m % 60).padStart(2, '0')}`;
}

function someDiamond(rng: Rng): Diamond {
  return makeDiamond(
    pick(['A', 'B', 'C', 'D', 'E', 'F'], rng),
    PORT,
    Math.floor(rng.next() * 36) * 10,
    pick([1.8, 2.2, 2.6, 3.0, 3.4], rng),
    pick([-6, -5, -4, 0, 1], rng),
  );
}

function hourName(h: number): string {
  return h === 0 ? 'HW' : `HW${h > 0 ? '+' : '−'}${Math.abs(h)}`;
}

// --- reading the stream ------------------------------------------------------

function diamondRowDrill(rng: Rng): Question {
  for (;;) {
    const diamond = someDiamond(rng);
    const hw = 6 * 60 + Math.floor(rng.next() * 144) * 5;
    // Keep clear of the half-hour boundaries between rows, where two rows are
    // equally right.
    const offset = Math.round((rng.next() * 11 - 5.5) * 60);
    if (Math.abs((Math.abs(offset) % 60) - 30) < 8) continue;
    const row = rowFor(offset);
    const at = (h: number) => diamond.hours.find((x) => x.hour === h);
    const right = at(row);
    const next = at(row + (offset > row * 60 ? 1 : -1));
    const mirror = at(-row);
    if (!right || right.spring < 0.4) continue;
    const text = (set: number, rate: number) => `${bearing(set)} at ${rate.toFixed(1)} kn`;
    const answer = text(right.set, right.spring);
    const unique = [
      ...new Set(
        [
          next && text(next.set, next.spring),
          mirror && row !== 0 && text(mirror.set, mirror.spring),
          text(right.set, right.neap),
          text(norm360(right.set + 180), right.spring),
        ].filter((x): x is string => Boolean(x) && x !== answer),
      ),
    ];
    if (unique.length < 3) continue;
    const mins = Math.abs(offset);
    return mcq(
      `tid-row-${diamond.hours[0]?.set}-${hw}-${offset}`,
      'tidal-sources',
      'tidal:diamond-row',
      `HW ${PORT} is at ${clock(hw)} today, and it is a spring tide. The chart's table for tidal diamond ◇${diamond.letter} is shown. What stream do you expect at ${clock(hw + offset)}?`,
      answer,
      unique.slice(0, 3),
      `${clock(hw + offset)} is ${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, '0')}m ${offset < 0 ? 'before' : 'after'} HW, which falls in the ${hourName(row)} row: each row covers the half hour either side of its hour. At springs read the spring rate: ${answer}. The set is where the stream goes to, not where it comes from.`,
      2,
      { type: 'tidal-diamond', diamond, highlight: undefined },
      { type: 'tidal-diamond', diamond, highlight: row },
    );
  }
}

function interpolateDrill(rng: Rng): Question {
  for (;;) {
    const diamond = someDiamond(rng);
    const row = pick([-4, -3, -2, 2, 3, 4], rng);
    const h = diamond.hours.find((x) => x.hour === row);
    if (!h || h.spring < 1.6) continue;
    // Round ranges and a simple fraction, so the interpolation is mental:
    // neap range half the spring, today a fifth of the way along, or two fifths…
    const [meanSpring, meanNeap] = pick<[number, number]>([[4, 2], [5, 2.5], [6, 3]], rng);
    const f = pick([0.2, 0.4, 0.5, 0.6, 0.8, 1.2], rng);
    const today = r1(meanNeap + (meanSpring - meanNeap) * f);
    const ranges: Ranges = { meanSpring, meanNeap, today };
    const answer = r1(rateFor(h, ranges));
    const wrong = wrongNumbers(
      answer,
      [h.spring, h.neap, r1((h.spring + h.neap) / 2), r1((h.spring * today) / meanSpring), r1(answer + 0.5)],
      0.2,
    );
    if (wrong.length < 3) continue;
    return mcq(
      `tid-interp-${row}-${h.spring}-${today}`,
      'tidal-sources',
      'tidal:interpolate',
      `At ${hourName(row)} ${PORT}, diamond ◇${diamond.letter} gives ${bearing(h.set)}, ${h.spring.toFixed(1)} kn at springs and ${h.neap.toFixed(1)} kn at neaps. ${PORT}'s mean spring range is ${meanSpring.toFixed(1)} m and mean neap range ${meanNeap.toFixed(1)} m; today's range is ${today.toFixed(1)} m. What rate do you use?`,
      kn(answer),
      wrong.map(kn),
      `Interpolate by range, as the almanac's computation of rates diagram does. From neaps to springs the range grows by ${(meanSpring - meanNeap).toFixed(1)} m; today is ${(today - meanNeap).toFixed(1)} m above neaps, ${f > 1 ? `${f} times the span` : f === 0.5 ? 'half way' : `${f * 10} tenths of the way`}. The rate grows by ${(h.spring - h.neap).toFixed(1)} kn over the same span, so ${h.neap.toFixed(1)} + ${f} × ${(h.spring - h.neap).toFixed(1)} ≈ ${kn(answer)}.${
        f > 1 ? ' Today is bigger than a mean spring, so go beyond the spring rate — the diagram carries on past it.' : ''
      }`,
      2,
    );
  }
}

function atlasDrill(rng: Rng): Question {
  for (;;) {
    const neap = pick([4, 6, 8, 9, 11, 12, 14, 15, 17], rng);
    const spring = Math.round(neap * pick([1.8, 1.9, 2, 2.1], rng));
    const label = `${String(neap).padStart(2, '0')},${spring}`;
    const answer = `${(neap / 10).toFixed(1)} kn at neaps, ${(spring / 10).toFixed(1)} kn at springs`;
    const options = [
      answer,
      `${(spring / 10).toFixed(1)} kn at neaps, ${(neap / 10).toFixed(1)} kn at springs`,
      `${neap} kn at neaps, ${spring} kn at springs`,
      `${(neap / 10).toFixed(1)} kn now, ${(spring / 10).toFixed(1)} kn in an hour`,
    ];
    if (new Set(options).size < 4) continue;
    return mcq(
      `tid-atlas-${label}`,
      'tidal-sources',
      'tidal:atlas-figures',
      `On a page of a tidal stream atlas, an arrow is marked "${label}". What does it mean?`,
      answer,
      options.slice(1),
      `Tidal stream atlases give the mean neap rate then the mean spring rate, in tenths of a knot, the neap first: ${label} is ${answer}. The arrow shows the set for that hour relative to HW at the standard port; for today, interpolate between the two by range.`,
      1,
    );
  }
}

// --- course to steer ---------------------------------------------------------

interface Passage {
  track: number;
  distance: number;
  speed: number;
  stream: Vec;
  set: number;
  rate: number;
}

/**
 * Boat speed and cross-stream pairs for which the one-in-sixty correction is
 * a whole number of degrees: 60 × 1.5 ÷ 6 = 15.
 */
const MENTAL_PAIRS: readonly [number, number][] = [
  [4, 0.8],
  [4, 1.0],
  [5, 0.5],
  [5, 1.0],
  [5, 1.5],
  [6, 0.8],
  [6, 1.0],
  [6, 1.2],
  [6, 1.5],
  [6, 2.0],
  [7, 1.4],
  [7, 2.1],
  [8, 1.2],
  [8, 1.6],
  [8, 2.0],
];

/**
 * A passage for a sum done in the head: the stream sets straight across the
 * track, so all of it is cross-stream, at a rate the one-in-sixty rule turns
 * into whole degrees.
 */
function acrossPassage(rng: Rng): Passage {
  const track = Math.floor(rng.next() * 72) * 5;
  const [speed, rate] = pick(MENTAL_PAIRS, rng);
  const set = norm360(track + pick([90, -90], rng));
  return { track, distance: speed, speed, stream: fromPolar(set, rate), set, rate };
}

function ctsScene(p: Passage): Scene {
  return { type: 'tidal-triangle', diagram: ctsDiagram(p.track, p.distance, p.speed, p.stream) };
}

function oneInSixtyDrill(rng: Rng): Question {
  for (;;) {
    const p = acrossPassage(rng);
    const cts = courseToSteer(p.track, p.speed, p.stream)!;
    const est = oneInSixty(cts.cross, p.speed);
    // The answer is the estimate a navigator makes; the exact triangle is
    // within a degree of it and is shown after.
    const answer = norm360(Math.round(p.track - est));
    const wrong = wrongBearings(
      answer,
      [p.track + est, p.track, p.track - 2 * est, p.track - est / 2],
      4,
    );
    if (wrong.length < 3) continue;
    const side = cts.cross > 0 ? 'starboard' : 'port';
    return mcq(
      `tid-160-${p.track}-${p.set}-${p.rate}-${p.speed}`,
      'tidal-cts',
      'tidal:cts-one-in-sixty',
      `The waypoint bears ${bearing(p.track)}T, about an hour away. You make ${p.speed} kn through the water. For the hour the stream sets ${bearing(p.set)} at ${p.rate.toFixed(1)} kn — straight across your track. Ignoring leeway, which water track do you steer to stay on the line?`,
      `${bearing(answer)}T`,
      wrong.map((w) => `${bearing(w)}T`),
      `The stream sets you to ${side} at ${p.rate.toFixed(1)} kn. One in sixty: 60 × ${p.rate.toFixed(1)} ÷ ${p.speed} = ${Math.abs(est).toFixed(0)}°, so steer ${Math.abs(est).toFixed(0)}° up-tide, to ${side === 'starboard' ? 'port' : 'starboard'}: ${bearing(answer)}T. The exact triangle, drawn here, gives ${cts.waterTrack.toFixed(1)}° — a plotter and the rule agree within a degree up to about 20°.`,
      2,
      undefined,
      ctsScene(p),
    );
  }
}

function fullCtsDrill(rng: Rng): Question {
  for (;;) {
    const p = acrossPassage(rng);
    const leeway = pick([3, 4, 5, 6, 8], rng);
    const windSide = pick(['port', 'starboard'] as const, rng);
    const variation = pick([-4, -3, -2, 2, 3], rng);
    const cts = courseToSteer(p.track, p.speed, p.stream)!;
    const est = oneInSixty(cts.cross, p.speed);
    const water = norm360(p.track - est);
    const heading = headingForWaterTrack(water, leeway, windSide);
    const answer = Math.round(norm360(heading - variation));
    const other = windSide === 'port' ? 'starboard' : 'port';
    const wrong = wrongBearings(
      answer,
      [
        headingForWaterTrack(water, leeway, other) - variation,
        headingForWaterTrack(p.track + est, leeway, windSide) - variation,
        heading + variation,
        headingForWaterTrack(p.track, leeway, windSide) - variation,
      ].map(Math.round),
      3,
    );
    if (wrong.length < 3) continue;
    const varText = `${Math.abs(variation)}°${variation > 0 ? 'E' : 'W'}`;
    return mcq(
      `tid-cts-${p.track}-${p.set}-${p.rate}-${leeway}-${windSide}-${variation}`,
      'tidal-cts',
      'tidal:cts-full',
      `The waypoint bears ${bearing(p.track)}T, about an hour away at ${p.speed} kn. The stream for the hour: ${bearing(p.set)}, ${p.rate.toFixed(1)} kn, straight across the track. The wind is on your ${windSide} side and you expect ${leeway}° of leeway. Variation ${varText}. What magnetic course do you give the helmsman?`,
      `${bearing(answer)}M`,
      wrong.map((w) => `${bearing(w)}M`),
      `Three steps, each in your head. Stream: 60 × ${p.rate.toFixed(1)} ÷ ${p.speed} = ${Math.abs(est).toFixed(0)}° up-tide, a water track of ${bearing(water)}T. Leeway: the wind on the ${windSide} side pushes you to ${other}, so point ${leeway}° into it: ${bearing(heading)}T. Variation: ${varText} is ${variation > 0 ? 'subtracted' : 'added'} from true to magnetic: ${bearing(answer)}M.`,
      3,
      undefined,
      ctsScene(p),
    );
  }
}

/**
 * Speed over the ground and arrival time, with the stream dead ahead or
 * astern and numbers that divide: 9 miles at 4.5 knots is two hours.
 */
function etaDrill(rng: Rng): Question {
  for (;;) {
    const speed = pick([5, 6, 7], rng);
    const rate = pick([1, 1.5, 2], rng);
    const fair = rng.next() < 0.5;
    const sog = fair ? speed + rate : speed - rate;
    const hours = pick([1, 1.5, 2, 2.5, 3], rng);
    const distance = sog * hours;
    // Only distances a chart would give to a tenth, so the sum stays exact.
    if (Math.abs(distance * 10 - Math.round(distance * 10)) > 1e-9) continue;
    const track = Math.floor(rng.next() * 72) * 5;
    const set = fair ? track : norm360(track + 180);
    const start = 8 * 60 + Math.floor(rng.next() * 16) * 15;
    const at = (kts: number) => clock(start + (distance / kts) * 60);
    const answer = at(sog);
    const candidates = [at(speed), at(fair ? speed - rate : speed + rate), at(speed + (fair ? 2 : -2) * rate)];
    const unique = [...new Set(candidates.filter((c) => c !== answer))];
    if (unique.length < 3) continue;
    return mcq(
      `tid-eta-${speed}-${rate}-${fair}-${hours}`,
      'tidal-cts',
      'tidal:eta',
      `At ${clock(start)} the waypoint is ${distance.toFixed(1)} M away on ${bearing(track)}T. You make ${speed} kn through the water, and the stream sets ${bearing(set)} at ${rate.toFixed(1)} kn. When do you expect to arrive?`,
      answer,
      unique,
      `The stream is ${fair ? 'dead astern — a fair tide — so add it to' : 'dead ahead — a foul tide — so take it off'} your speed: ${speed} ${fair ? '+' : '−'} ${rate} = ${sog} kn over the ground. ${distance.toFixed(1)} M at ${sog} kn is ${hours === 1 ? 'an hour' : `${hours} hours`}: ${answer}.`,
      1,
    );
  }
}

function leewayDrill(rng: Rng): Question {
  const track = Math.floor(rng.next() * 72) * 5;
  const leeway = pick([3, 4, 5, 6, 7, 8, 10], rng);
  const windSide = pick(['port', 'starboard'] as const, rng);
  const answer = headingForWaterTrack(track, leeway, windSide);
  const wrong = [
    headingForWaterTrack(track, leeway, windSide === 'port' ? 'starboard' : 'port'),
    track,
    headingForWaterTrack(track, 2 * leeway, windSide),
  ];
  return mcq(
    `tid-leeway-${track}-${leeway}-${windSide}`,
    'tidal-cts',
    'tidal:leeway',
    `You need a water track of ${bearing(track)}T. Close-hauled with the wind on your ${windSide} bow, you estimate ${leeway}° of leeway. What heading do you steer?`,
    `${bearing(answer)}T`,
    wrong.map((w) => `${bearing(w)}T`),
    `Leeway takes you downwind of where you point. With the wind on the ${windSide} bow you slide to ${windSide === 'port' ? 'starboard' : 'port'}, so point ${leeway}° up into the wind — to ${windSide} — to make the track good: ${bearing(answer)}T.`,
    1,
  );
}

/**
 * A passage with a strong stream for its boat speed, so the four
 * constructions look clearly different when drawn — a triangle, not a needle.
 */
function drawablePassage(rng: Rng): Passage | undefined {
  const track = Math.floor(rng.next() * 72) * 5;
  const speed = pick([4, 4.5, 5], rng);
  const rate = pick([2.0, 2.4, 2.8], rng);
  const set = norm360(track + pick([1, -1], rng) * pick([70, 90, 110, 120], rng));
  const stream = fromPolar(set, rate);
  const cts = courseToSteer(track, speed, stream);
  if (!cts || Math.abs(cts.cross) / speed < 0.3 || Math.abs(cts.cross) / speed > 0.6) return undefined;
  return { track, distance: speed, speed, stream, set, rate };
}

function trianglePickDrill(rng: Rng, target: 'cts' | 'ep'): Question {
  for (;;) {
    const p = drawablePassage(rng);
    if (!p) continue;
    const cts = courseToSteer(p.track, p.speed, p.stream)!;
    // Longer than an hour, so that joining the stream's end straight to the
    // waypoint is visibly wrong.
    const distance = r1(p.speed * 1.6);
    const waypoint = fromPolar(p.track, distance);
    const options: { d: TriangleDiagram; right: boolean; what: string }[] = [
      { d: ctsDiagram(p.track, distance, p.speed, p.stream), right: target === 'cts', what: 'course to steer: one hour of stream from the start, then one hour of boat speed swung to meet the track' },
      { d: ctsReversedTide(p.track, distance, p.speed, p.stream), right: false, what: 'the stream laid the wrong way, as if the set were where it comes from' },
      { d: epDiagram(p.track, p.speed, p.stream, waypoint), right: target === 'ep', what: 'estimated position: the water track steered first, the stream at its end' },
      { d: ctsToWaypoint(p.track, distance, p.stream), right: false, what: 'the end of one hour of stream joined straight to the waypoint, although the passage is not one hour' },
    ];
    // The EP diagram must end visibly off the track, or it looks like a CTS.
    if (Math.abs(cts.cross) < 0.8) continue;
    const order = shuffle(options, rng);
    const letters = ['A', 'B', 'C', 'D'];
    const right = order.findIndex((o) => o.right);
    const answer = `Diagram ${letters[right]}`;
    const wrong = letters.filter((_, i) => i !== right).map((l) => `Diagram ${l}`);
    const notes = order.map((o, i) => `${letters[i]}: ${o.what}${o.right ? ' — right' : ''}.`).join(' ');
    return mcq(
      `tid-pick-${target}-${p.track}-${p.set}-${p.rate}`,
      target === 'cts' ? 'tidal-cts' : 'tidal-ep',
      target === 'cts' ? 'tidal:cts-triangle' : 'tidal:ep-triangle',
      target === 'cts'
        ? `Waypoint on ${bearing(p.track)}T, ${distance.toFixed(1)} M; ${p.speed} kn through the water; stream ${bearing(p.set)} ${p.rate.toFixed(1)} kn. Which diagram is the right construction for the course to steer? (One arrow: water track. Two: ground track. Three: stream.)`
        : `From the fix you steered ${bearing(p.track)}T for an hour at ${p.speed} kn; the stream was ${bearing(p.set)} ${p.rate.toFixed(1)} kn. Which diagram finds your estimated position? (One arrow: water track. Two: ground track. Three: stream.)`,
      answer,
      wrong,
      notes,
      3,
      { type: 'tidal-pick', diagrams: order.map((o) => o.d) },
    );
  }
}

// --- estimated position ------------------------------------------------------

/**
 * The EP as a displacement from the DR: whatever the course, the stream moves
 * you its set, by its rate times the time. That is the whole idea of the
 * construction, and it can be done in the head.
 */
function epFromDrDrill(rng: Rng): Question {
  for (;;) {
    const heading = Math.floor(rng.next() * 72) * 5;
    const log = pick([4.2, 4.8, 5.3, 5.9, 6.4], rng);
    const set = Math.floor(rng.next() * 36) * 10;
    const rate = pick([0.8, 1.2, 1.4, 1.6, 2.0], rng);
    const hours = pick([1, 1.5, 2], rng);
    const drift = r1(rate * hours);
    const answer = `${drift.toFixed(1)} M towards ${bearing(set)} from the DR`;
    // With more than an hour, the slip is to lay one hour of stream; with
    // exactly one, to halve it.
    const wrongDrift = hours === 1 ? r1(rate / 2) : rate;
    const options = [
      answer,
      `${drift.toFixed(1)} M towards ${bearing(set + 180)} from the DR`,
      `${wrongDrift.toFixed(1)} M towards ${bearing(set)} from the DR`,
      `At the DR: the stream moves the water, not your position through it`,
    ];
    if (new Set(options).size < 4) continue;
    const stream = fromPolar(set, drift);
    return mcq(
      `tid-epdr-${heading}-${log}-${set}-${rate}-${hours}`,
      'tidal-ep',
      'tidal:ep-from-dr',
      `From a fix you steer ${bearing(heading)}T for ${hours === 1 ? 'an hour' : `${hours} hours`}, and plot the DR from the log. There is no leeway. The stream over that time averages ${bearing(set)} at ${rate.toFixed(1)} kn. Where is the EP?`,
      options[0] as string,
      options.slice(1),
      `The stream carries the water, and you with it, towards its set: ${rate.toFixed(1)} kn for ${hours} h is ${drift.toFixed(1)} M towards ${bearing(set)}. So from the DR, lay that vector — three arrows — and its end is the EP. The set is where the stream goes, never where it comes from.`,
      2,
      undefined,
      { type: 'tidal-triangle', diagram: epDiagram(heading, r1(log * hours), stream) },
    );
  }
}

function epLeewayDrill(rng: Rng): Question {
  const heading = Math.floor(rng.next() * 72) * 5;
  const leeway = pick([3, 4, 5, 6, 8, 10], rng);
  const windSide = pick(['port', 'starboard'] as const, rng);
  const answer = waterTrackForHeading(heading, leeway, windSide);
  const other = windSide === 'port' ? 'starboard' : 'port';
  return mcq(
    `tid-eplee-${heading}-${leeway}-${windSide}`,
    'tidal-ep',
    'tidal:ep-leeway',
    `Working up an EP: you steered ${bearing(heading)}T close-hauled with the wind on the ${windSide} side, and estimate ${leeway}° of leeway. Along which water track do you lay off the distance run?`,
    `${bearing(answer)}T`,
    [waterTrackForHeading(heading, leeway, other), heading, waterTrackForHeading(heading, 2 * leeway, windSide)].map(
      (w) => `${bearing(w)}T`,
    ),
    `Leeway blows you downwind of your heading. The wind is on the ${windSide} side, so you slide to ${other}: ${bearing(heading)} ${windSide === 'port' ? '+' : '−'} ${leeway}° = ${bearing(answer)}T. Lay the log distance along that, then the stream from its end.`,
    1,
  );
}

// --- sources -----------------------------------------------------------------

export function tidalSources(): QuestionSource[] {
  const drills: [string, Topic, Question['difficulty'], (rng: Rng) => Question][] = [
    ['tidal:diamond-row', 'tidal-sources', 2, diamondRowDrill],
    ['tidal:interpolate', 'tidal-sources', 2, interpolateDrill],
    ['tidal:atlas-figures', 'tidal-sources', 1, atlasDrill],
    ['tidal:cts-one-in-sixty', 'tidal-cts', 2, oneInSixtyDrill],
    ['tidal:cts-full', 'tidal-cts', 3, fullCtsDrill],
    ['tidal:eta', 'tidal-cts', 1, etaDrill],
    ['tidal:leeway', 'tidal-cts', 1, leewayDrill],
    ['tidal:cts-triangle', 'tidal-cts', 3, (rng) => trianglePickDrill(rng, 'cts')],
    ['tidal:ep-from-dr', 'tidal-ep', 2, epFromDrDrill],
    ['tidal:ep-leeway', 'tidal-ep', 1, epLeewayDrill],
    ['tidal:ep-triangle', 'tidal-ep', 2, (rng) => trianglePickDrill(rng, 'ep')],
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
  diamondRowDrill,
  interpolateDrill,
  atlasDrill,
  oneInSixtyDrill,
  fullCtsDrill,
  etaDrill,
  leewayDrill,
  trianglePickDrill,
  epFromDrDrill,
  epLeewayDrill,
};
