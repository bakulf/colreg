import type { Question, QuestionSource, Rng, Scene } from '../types.ts';
import { pick, shuffle } from '../rng.ts';
import {
  PORT_SIGNALS,
  bearing,
  clearingLabel,
  isSafe,
  norm360,
  offBow,
  steerForLeadingMarks,
  worstCut,
} from './model.ts';

/**
 * Position fixing and pilotage drills: every one a glance and a rule of
 * thumb. Which three marks to take, which to take last, which corner of the
 * cocked hat to trust, where a waypoint puts you, which side of a clearing
 * line you are on, which way the leading marks say to steer, what a sounding
 * means on the chart, and what the port signals say.
 */

type Topic = Question['topic'];

function mcq(
  id: string,
  topic: Topic,
  concept: string,
  prompt: string,
  answer: string,
  distractors: string[],
  ruleRefs: string[],
  explanation: string,
  difficulty: Question['difficulty'],
  scene?: Scene,
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
    ruleRefs,
    explanation,
    difficulty,
    scene,
  };
}

const POS = ['Position fixing'];
const PIL = ['Pilotage'];

const WORDS = { NLT: 'not less than', NMT: 'not more than' } as const;

const MARKS = ['the church spire', 'the lighthouse', 'the water tower', 'the radio mast', 'the beacon', 'the headland', 'the monument'];

// --- position ----------------------------------------------------------------

function waypointDrill(rng: Rng): Question {
  const b = Math.floor(rng.next() * 72) * 5;
  const dist = pick([1.2, 1.8, 2.4, 3.0, 3.6, 4.5], rng);
  const answer = `${dist.toFixed(1)} M from the waypoint, on a bearing of ${bearing(b + 180)}T from it`;
  const wrong = [
    `${dist.toFixed(1)} M from the waypoint, on a bearing of ${bearing(b)}T from it`,
    `${dist.toFixed(1)} M from the waypoint, on a bearing of ${bearing(b + 90)}T from it`,
    `${(dist * 2).toFixed(1)} M from the waypoint, on a bearing of ${bearing(b + 180)}T from it`,
  ];
  return mcq(
    `pos-wpt-${b}-${dist}`,
    'position-gnss',
    'position:waypoint-fix',
    `The GPS shows a charted waypoint bearing ${bearing(b)}T, ${dist.toFixed(1)} M. Where do you plot your position?`,
    answer,
    wrong,
    POS,
    `The display gives the waypoint's bearing from you. To plot yourself from the waypoint, reverse it: ${bearing(b)} ± 180 = ${bearing(b + 180)}. Lay ${dist.toFixed(1)} M from the waypoint along ${bearing(b + 180)}T. A quick, clean fix — as long as the waypoint was entered right, which is why it is worth a check against a bearing or a depth.`,
    1,
  );
}

function bestThreeDrill(rng: Rng): Question {
  for (;;) {
    const names = shuffle(MARKS, rng).slice(0, 5);
    const bs = names.map(() => Math.floor(rng.next() * 72) * 5);
    const triples: [number, number, number][] = [];
    for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) for (let k = j + 1; k < 5; k++) triples.push([i, j, k]);
    const scored = triples
      .map((t) => ({ t, s: worstCut([bs[t[0]]!, bs[t[1]]!, bs[t[2]]!]) }))
      .sort((a, b) => b.s - a.s);
    const best = scored[0]!;
    // A clear winner, with good cuts, and three clearly worse to offer.
    if (best.s < 45 || scored[1]!.s > best.s - 15) continue;
    const worse = scored.filter((x) => x.s <= 25);
    if (worse.length < 3) continue;
    const text = (t: [number, number, number]) => t.map((i) => names[i]).join(', ');
    const list = names.map((n, i) => `${n} ${bearing(bs[i]!)}`).join('; ');
    return mcq(
      `pos-best3-${bs.join('-')}`,
      'position-visual',
      'position:best-three',
      `From the chart you can take bearings of: ${list}. Which three give the best fix?`,
      capital(text(best.t)),
      shuffle(worse, rng)
        .slice(0, 3)
        .map((x) => capital(text(x.t))),
      POS,
      `Position lines should cross at good angles: two bearings about 90° apart, three about 120° apart — so each pair of lines cuts at around 60° — and never much under 30°. ${capital(text(best.t))} cut at no less than ${Math.round(best.s)}°. Marks bunched on similar bearings give lines that meet at a fine angle, where a small error in a bearing moves the fix a long way. Prefer near, well-defined marks too: an error of a degree matters less the closer the mark.`,
      2,
    );
  }
}

function capital(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function lastBearingDrill(rng: Rng): Question {
  for (;;) {
    const heading = Math.floor(rng.next() * 72) * 5;
    const names = shuffle(MARKS, rng).slice(0, 3);
    const offs = shuffle([pick([0, 10, 170, 180], rng), pick([30, 40, 140, 150], rng), pick([80, 90, 100], rng)], rng);
    const sides = offs.map(() => (rng.next() < 0.5 ? 1 : -1));
    const bs = offs.map((o, i) => norm360(heading + o * sides[i]!));
    const beamIdx = offs.findIndex((o) => o >= 80 && o <= 100);
    const answer = names[beamIdx]!;
    const list = names.map((n, i) => `${n} ${bearing(bs[i]!)}`).join('; ');
    return mcq(
      `pos-last-${heading}-${bs.join('-')}`,
      'position-visual',
      'position:beam-last',
      `You are steering ${bearing(heading)}T at 6 knots and taking a three-bearing fix: ${list}. Which do you take last?`,
      capital(answer),
      [...names.filter((_, i) => i !== beamIdx).map(capital), 'The order does not matter'],
      POS,
      `Take the marks ahead or astern first — their bearings change slowly — and the one near the beam last, since its bearing changes fastest as you move. ${capital(answer)} is ${Math.round(offBow(heading, bs[beamIdx]!))}° off the bow. Then the fix is right for the moment of the last bearing: note that time.`,
      2,
    );
  }
}

function cockedHatDrill(rng: Rng): Question {
  const vertex = Math.floor(rng.next() * 3);
  const rot = Math.floor(rng.next() * 360);
  const letters = ['A', 'B', 'C'];
  return mcq(
    `pos-hat-${vertex}-${rot}`,
    'position-visual',
    'position:cocked-hat',
    'Your three bearings do not meet at a point but form this triangle — a cocked hat — with a rock close by. Where do you plot your position for safety?',
    `Corner ${letters[vertex]}, the one closest to the danger`,
    [...letters.filter((_, i) => i !== vertex).map((l) => `Corner ${l}`), 'The middle of the triangle'].slice(0, 3),
    POS,
    `A small cocked hat is normal — each bearing carries a degree or two of error. Assume you are in the corner closest to danger, here ${letters[vertex]}, and remember you may even be outside the triangle: give the danger a margin. A large cocked hat means a mistake — a misidentified mark, a misread bearing, deviation — so take the bearings again.`,
    2,
    { type: 'cocked-hat', danger: vertex, rotation: rot },
  );
}

// --- pilotage ----------------------------------------------------------------

function portSignalDrill(id: string) {
  return (rng: Rng): Question => {
    const s = PORT_SIGNALS.find((x) => x.id === id)!;
    const others = shuffle(
      PORT_SIGNALS.filter((x) => x.message !== s.message),
      rng,
    )
      .sort((a, b) => Number(b.lights.join() === s.lights.join()) - Number(a.lights.join() === s.lights.join()))
      .slice(0, 3);
    return mcq(
      `pil-ipts-${s.id}`,
      'pilotage-signals',
      `pilotage:ipts:${s.id}`,
      'Entering harbour, you see these port traffic signals. What do they mean?',
      s.message,
      others.map((o) => o.message),
      ['IALA R0111'],
      `International port traffic signals (IALA R0111): always three lights in a column; red means do not proceed, green means proceed subject to conditions. ${
        s.flashing ? 'Flashing red, all three: a serious emergency.' : ''
      }${s.yellow ? ' A yellow light to the left, level with the top light, exempts vessels that can navigate safely outside the main channel — often small craft.' : ''} The harbour's own rules, in the almanac or pilot book, say how they apply there.`,
      1,
      { type: 'port-signal', signal: s.id },
    );
  };
}

function clearingSafeDrill(rng: Rng): Question {
  const line = Math.floor(rng.next() * 72) * 5;
  const dangerSide = pick(['left', 'right'] as const, rng);
  const label = clearingLabel(dangerSide);
  const delta = pick([-15, -10, -6, -4, 4, 6, 10, 15], rng);
  const observed = norm360(line + delta);
  const safe = isSafe(label, line, observed);
  const answer = safe ? 'Safe side of the line' : 'Standing into danger';
  return mcq(
    `pil-clr-${line}-${dangerSide}-${delta}`,
    'pilotage-clearing',
    'pilotage:clearing-safe',
    `Your pilotage plan has a clearing line on ${MARKS[0]}: ${label} ${bearing(line)}T (${WORDS[label]} ${bearing(line)}). You take a bearing of it: ${bearing(observed)}T. Where are you?`,
    answer,
    [safe ? 'Standing into danger' : 'Safe side of the line', 'Exactly on the line', 'It cannot be told without a GPS position'],
    PIL,
    `${label} means "${label === 'NLT' ? 'not less than' : 'not more than'}": the mark must bear ${label === 'NLT' ? 'at least' : 'at most'} ${bearing(line)}. ${bearing(observed)} is ${delta > 0 ? 'more' : 'less'}, so ${safe ? 'you are on the safe side' : 'you are over the line, towards the danger — turn away until the bearing is back inside the limit'}. One hand-bearing compass, no plotting: that is why clearing lines are used in pilotage.`,
    1,
    { type: 'clearing-line', line, label, dangerSide, observed },
  );
}

function clearingLabelDrill(rng: Rng): Question {
  const line = Math.floor(rng.next() * 72) * 5;
  const dangerSide = pick(['left', 'right'] as const, rng);
  const label = clearingLabel(dangerSide);
  return mcq(
    `pil-clrlbl-${line}-${dangerSide}`,
    'pilotage-clearing',
    'pilotage:clearing-label',
    `You draw a clearing line to ${MARKS[1]} on ${bearing(line)}T. Looking along it towards the mark, the rocks are on the ${dangerSide}. How do you label it — NMT (not more than) or NLT (not less than)?`,
    `${label} ${bearing(line)}T — ${WORDS[label]}`,
    (['NLT', 'NMT'] as const)
      .flatMap((l) => [line, line + 180].map((b) => `${l} ${bearing(b)}T — ${WORDS[l]}`))
      .filter((t) => t !== `${label} ${bearing(line)}T — ${WORDS[label]}`),
    PIL,
    `The RYA shorthand for a clearing bearing: NMT, not more than; NLT, not less than. The rule of thumb, looking along the line towards the mark: danger on the left, NMT; danger on the right, NLT. Why: on the safe side, the ${dangerSide === 'right' ? 'left' : 'right'}, the mark lies a little to your ${dangerSide}, so its bearing is ${dangerSide === 'right' ? 'more' : 'less'} than the line's — safe means ${WORDS[label]} ${bearing(line)}. The bearing is always of the mark from you. Some navigators mark the danger side of the line with a + or − instead; the idea is the same.`,
    2,
    { type: 'clearing-line', line, label: undefined, dangerSide, observed: undefined },
  );
}

function leadingDrill(rng: Rng): Question {
  const rear = pick(['left', 'right', 'inline', 'left', 'right'] as const, rng);
  const steer = steerForLeadingMarks(rear);
  const text = { port: 'Alter to port until they line up', starboard: 'Alter to starboard until they line up', hold: 'Hold your course: you are on the line' };
  return mcq(
    `pil-lead-${rear}`,
    'pilotage-transits',
    `pilotage:leading:${rear === 'inline' ? 'inline' : 'off'}`,
    'Following a leading line into harbour, you see the two marks like this, the rear one higher and further off. What do you do?',
    text[steer],
    (['port', 'starboard', 'hold'] as const).filter((x) => x !== steer).map((x) => text[x]).concat(['Stop and wait for the marks to separate']),
    PIL,
    rear === 'inline'
      ? 'Marks in line, one above the other: you are on the leading line. Keep them so.'
      : `The rear mark appears to the ${rear} of the front one, so you are to the ${rear} of the line — the nearer front mark shifts further as you move off it. Alter to ${steer} to bring them back in line. The usual rule of thumb: steer towards the front mark.`,
    1,
    { type: 'leading-marks', rear },
  );
}

function soundingDrill(rng: Rng): Question {
  for (;;) {
    const reading = r1(4 + rng.next() * 8);
    const keel = pick([1.2, 1.5, 1.8, 2.0], rng);
    const tide = r1(0.5 + rng.next() * 4);
    const answer = r1(reading + keel - tide);
    if (answer < 1) continue;
    const m = (x: number) => `${x.toFixed(1)} m`;
    const wrong = [r1(reading - tide), r1(reading + keel + tide), r1(reading - keel - tide)];
    if (new Set([answer, ...wrong]).size < 4) continue;
    return mcq(
      `pil-snd-${reading}-${keel}-${tide}`,
      'pilotage-soundings',
      'pilotage:reduce-sounding',
      `The echo sounder, set to read below the keel, shows ${m(reading)}. The keel is ${m(keel)} down, and the height of tide is ${m(tide)}. What charted depth should you be over?`,
      m(answer),
      wrong.map(m),
      PIL,
      `Depth of water = ${m(reading)} + ${m(keel)} = ${m(r1(reading + keel))}. Take off the height of tide to reduce it to chart datum: ${m(answer)}. Compare with the soundings and contours near your EP — following a contour is a sound way to feel along a coast in poor visibility.`,
      2,
    );
  }
}

const r1 = (x: number) => Math.round(x * 10) / 10;

// --- sources -----------------------------------------------------------------

type Drill = [string, Topic, Question['difficulty'], (rng: Rng) => Question];

function toSources(drills: Drill[]): QuestionSource[] {
  return drills.map(([concept, topic, difficulty, generate]) => ({
    id: `gen-${concept}`,
    topic,
    concept,
    difficulty,
    generated: true,
    generate: (rng: Rng) => ({ ...generate(rng), concept }),
  }));
}

export function positionSources(): QuestionSource[] {
  return toSources([
    ['position:waypoint-fix', 'position-gnss', 1, waypointDrill],
    ['position:best-three', 'position-visual', 2, bestThreeDrill],
    ['position:beam-last', 'position-visual', 2, lastBearingDrill],
    ['position:cocked-hat', 'position-visual', 2, cockedHatDrill],
  ]);
}

export function pilotageSources(): QuestionSource[] {
  return toSources([
    ...PORT_SIGNALS.map((s): Drill => [`pilotage:ipts:${s.id}`, 'pilotage-signals', 1, portSignalDrill(s.id)]),
    ['pilotage:clearing-safe', 'pilotage-clearing', 1, clearingSafeDrill],
    ['pilotage:clearing-label', 'pilotage-clearing', 2, clearingLabelDrill],
    ['pilotage:leading', 'pilotage-transits', 1, leadingDrill],
    ['pilotage:reduce-sounding', 'pilotage-soundings', 2, soundingDrill],
  ]);
}

export {
  waypointDrill,
  bestThreeDrill,
  lastBearingDrill,
  cockedHatDrill,
  portSignalDrill,
  clearingSafeDrill,
  clearingLabelDrill,
  leadingDrill,
  soundingDrill,
};
