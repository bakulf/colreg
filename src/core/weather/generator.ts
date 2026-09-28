import type { Question, QuestionSource, Rng, Scene } from '../types.ts';
import { pick, shuffle } from '../rng.ts';
import type { Genus, Point, Term } from './model.ts';
import {
  BEAUFORT,
  CLOUDS,
  DEPRESSION,
  MOVEMENT,
  POINTS,
  SEA_STATE,
  TIMING,
  VISIBILITY,
  change,
  degOf,
  directionName,
  lowFromWind,
  pointOf,
  tendencyFor,
  windAround,
  windName,
} from './model.ts';

/**
 * Weather drills. Clouds are recognised from photographs — two of each, so
 * it is the cloud that is learnt and not the picture; a depression's passage
 * is drilled as a sequence you can see coming; the forecast's words are drilled
 * against the Met Office's own definitions; winds round lows and highs from a
 * sketch chart. Nothing needs more than a glance and a rule of thumb.
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
    ruleRefs: ['Meteorology'],
    explanation,
    difficulty,
    scene,
    afterScene,
  };
}

const GENERA = Object.keys(CLOUDS) as Genus[];

/** Clouds a student confuses with this one: same level first, then look-alikes. */
function cloudDistractors(g: Genus, rng: Rng): Genus[] {
  const alike: Record<Genus, Genus[]> = {
    cirrus: ['cirrostratus', 'cirrocumulus', 'altocumulus'],
    cirrocumulus: ['altocumulus', 'cirrus', 'stratocumulus'],
    cirrostratus: ['altostratus', 'cirrus', 'stratus'],
    altocumulus: ['cirrocumulus', 'stratocumulus', 'cumulus'],
    altostratus: ['cirrostratus', 'nimbostratus', 'stratus'],
    nimbostratus: ['altostratus', 'stratus', 'cumulonimbus'],
    stratocumulus: ['altocumulus', 'stratus', 'cumulus'],
    stratus: ['nimbostratus', 'stratocumulus', 'altostratus'],
    cumulus: ['cumulonimbus', 'stratocumulus', 'altocumulus'],
    cumulonimbus: ['cumulus', 'nimbostratus', 'altostratus'],
  };
  return shuffle(alike[g], rng);
}

// --- basic terms -------------------------------------------------------------

function beaufortForceDrill(rng: Rng): Question {
  const f = pick(BEAUFORT.slice(2, 11), rng);
  const knots = f.from + Math.floor(rng.next() * (f.to - f.from + 1));
  const wrong = shuffle(
    BEAUFORT.filter((x) => Math.abs(x.force - f.force) <= 2 && x.force !== f.force),
    rng,
  ).slice(0, 3);
  const text = (x: (typeof BEAUFORT)[number]) => `Force ${x.force} — ${x.name.toLowerCase()}`;
  return mcq(
    `wx-bf-${knots}`,
    'weather-terms',
    'weather:beaufort-knots',
    `The wind is blowing a steady ${knots} knots. What is that on the Beaufort scale?`,
    text(f),
    wrong.map(text),
    `Force ${f.force}, ${f.name.toLowerCase()}: ${f.from} to ${f.to} knots. ${f.sea}. A handy anchor: force 4 starts at 11 knots, force 6 at 22, gale force 8 at 34.`,
    1,
  );
}

function beaufortSeaDrill(rng: Rng): Question {
  const f = pick(BEAUFORT.slice(1, 10), rng);
  const wrong = shuffle(
    BEAUFORT.filter((x) => Math.abs(x.force - f.force) <= 3 && x.force !== f.force && x.force > 0),
    rng,
  ).slice(0, 3);
  return mcq(
    `wx-bfsea-${f.force}`,
    'weather-terms',
    'weather:beaufort-sea',
    `You look at the sea: ${f.sea.charAt(0).toLowerCase()}${f.sea.slice(1)}. Roughly what force is blowing?`,
    `Force ${f.force}`,
    wrong.map((x) => `Force ${x.force}`),
    `That is force ${f.force}, ${f.name.toLowerCase()}, ${f.from}–${f.to} knots. Reading the sea is how the scale began — and how to check a forecast against what is actually happening.`,
    2,
  );
}

function veerBackDrill(rng: Rng): Question {
  for (;;) {
    const from = pick(POINTS, rng);
    const steps = pick([1, 2, 3, -1, -2, -3], rng);
    const to = pointOf(degOf(from) + steps * 45);
    const answer = change(from, to);
    return mcq(
      `wx-veer-${from}-${to}`,
      'weather-terms',
      'weather:veer-back',
      `The wind shifts from ${windName(from)} to ${windName(to)}. What is that called?`,
      answer === 'veering' ? 'Veering — a clockwise shift' : 'Backing — an anticlockwise shift',
      [
        answer === 'veering' ? 'Backing — an anticlockwise shift' : 'Veering — a clockwise shift',
        'Becoming cyclonic',
        'Freshening',
      ],
      `${directionName(from)} to ${directionName(to)} goes ${answer === 'veering' ? 'clockwise' : 'anticlockwise'} round the compass: ${answer}. In the northern hemisphere the wind usually backs as a depression approaches and veers as its fronts pass.`,
      1,
    );
  }
}

// --- clouds ------------------------------------------------------------------

function cloudMeaningDrill(rng: Rng): Question {
  const g = pick(['cirrus', 'cirrostratus', 'altostratus', 'nimbostratus', 'stratus', 'cumulus', 'cumulonimbus'] as Genus[], rng);
  const c = CLOUDS[g];
  const wrong = cloudDistractors(g, rng).map((w) => CLOUDS[w].tells);
  return mcq(
    `wx-cloudmean-${g}`,
    'weather-clouds',
    `weather:cloud-meaning:${g}`,
    'You see this sky. What does it most likely tell you?',
    capital(c.tells),
    wrong.map(capital),
    `${c.name}: ${c.look}. It ${c.tells}.`,
    2,
    { type: 'cloud', genus: g, photo: Math.floor(rng.next() * 2) },
  );
}

function capital(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// --- pressure and fronts -----------------------------------------------------

function nextCloudDrill(rng: Rng): Question {
  const i = pick([0, 1, 2, 4, 5], rng);
  const now = DEPRESSION[i]!;
  const next = DEPRESSION[i + 1]!;
  const wrongG = shuffle(
    GENERA.filter((g) => g !== next.cloud && g !== now.cloud),
    rng,
  ).slice(0, 3);
  return mcq(
    `wx-next-${now.id}`,
    'weather-systems',
    `weather:front-next:${now.id}`,
    `A depression is approaching from the west. You see this sky, and the barometer is ${now.pressure}. Which cloud do you expect next?`,
    CLOUDS[next.cloud].name,
    wrongG.map((g) => CLOUDS[g].name),
    `Now: ${CLOUDS[now.cloud].name.toLowerCase()}, ${now.where}. Next: ${CLOUDS[next.cloud].name.toLowerCase()}, ${next.where}. The classic sequence is cirrus, cirrostratus, altostratus, nimbostratus at the warm front; stratus in the warm sector; cumulonimbus at the cold front; then cumulus and showers.`,
    2,
    { type: 'cloud', genus: now.cloud, photo: Math.floor(rng.next() * 2) },
    { type: 'front-strip', highlight: i + 1 },
  );
}

function whereAmIDrill(rng: Rng): Question {
  const i = Math.floor(rng.next() * DEPRESSION.length);
  const s = DEPRESSION[i]!;
  const wrong = shuffle(
    DEPRESSION.filter((x) => x.id !== s.id),
    rng,
  )
    .slice(0, 3)
    .map((x) => capital(x.where));
  return mcq(
    `wx-where-${s.id}`,
    'weather-systems',
    `weather:front-where:${s.id}`,
    `A depression is passing north of you. The sky looks like this. Barometer: ${s.pressure}. Wind: ${s.wind}. Weather: ${s.weather}. Visibility: ${s.visibility}. Where are you?`,
    capital(s.where),
    wrong,
    `${capital(s.where)}: ${CLOUDS[s.cloud].name.toLowerCase()}, pressure ${s.pressure}, wind ${s.wind}.`,
    3,
    { type: 'cloud', genus: s.cloud, photo: Math.floor(rng.next() * 2) },
    { type: 'front-strip', highlight: i },
  );
}

function frontChangeDrill(rng: Rng): Question {
  const which = pick(['warm', 'cold'] as const, rng);
  const s = DEPRESSION.find((x) => x.id === `${which}-front`)!;
  const answer = which === 'warm'
    ? 'The wind veers, the rain eases to drizzle, and the barometer stops falling'
    : 'The wind veers sharply, the barometer rises, and heavy rain gives way to showers and clearer air';
  const options = [
    answer,
    which === 'warm'
      ? 'The wind backs, the rain gets heavier, and the barometer falls faster'
      : 'The wind backs, the barometer falls, and the weather turns to drizzle',
    'Nothing changes until the next front',
    which === 'warm'
      ? 'The wind veers sharply, the barometer rises, and it turns colder'
      : 'The wind veers, the rain eases to drizzle, and the barometer stops falling',
  ];
  return mcq(
    `wx-frontchange-${which}`,
    'weather-systems',
    `weather:front-change:${which}`,
    `The ${which} front of a depression passes over you. What changes?`,
    options[0] as string,
    options.slice(1),
    `At the ${which} front: wind ${s.wind}; pressure ${s.pressure}. ${which === 'warm' ? 'Behind it lies the warm sector: mild, damp, drizzle and poor visibility.' : 'Behind it: colder, clearer air, showers and good visibility — with gusts.'}`,
    2,
    undefined,
    { type: 'front-strip', highlight: DEPRESSION.indexOf(s) },
  );
}

function orderDrill(rng: Rng): Question {
  const right = ['Cirrus', 'Cirrostratus', 'Altostratus', 'Nimbostratus'];
  const wrongs = [
    ['Nimbostratus', 'Altostratus', 'Cirrostratus', 'Cirrus'],
    ['Cumulus', 'Cumulonimbus', 'Nimbostratus', 'Stratus'],
    ['Cirrostratus', 'Cirrus', 'Nimbostratus', 'Altostratus'],
    ['Altostratus', 'Cirrus', 'Cumulonimbus', 'Cirrostratus'],
  ];
  return mcq(
    'wx-order-warm',
    'weather-systems',
    'weather:front-order',
    'As a warm front approaches, in which order do the clouds usually arrive?',
    right.join(' → '),
    shuffle(wrongs, rng)
      .slice(0, 3)
      .map((w) => w.join(' → ')),
    'The front slopes gently forward, so its cloud arrives from the top down: high cirrus first, a day or so ahead; then a cirrostratus veil with a halo; then thickening, lowering altostratus; then nimbostratus and rain at the front itself.',
    2,
    undefined,
    { type: 'front-strip', highlight: 3 },
  );
}

function windRoundDrill(rng: Rng): Question {
  const system = pick(['low', 'high'] as const, rng);
  const at = pick(POINTS, rng);
  const bearing = degOf(at);
  const answer = windAround(system, bearing);
  const reversed = windAround(system === 'low' ? 'high' : 'low', bearing);
  const fromCentre = pointOf(bearing + 180);
  const toCentre = at;
  const options = [answer, reversed, fromCentre, toCentre];
  if (new Set(options).size < 4) return windRoundDrill(rng);
  return mcq(
    `wx-round-${system}-${at}`,
    'weather-systems',
    `weather:wind-round:${system}`,
    `Northern hemisphere. The centre of the ${system} is shown on this sketch chart, and you are the boat, to the ${directionName(at)} of it. Roughly what wind do you expect?`,
    `A ${windName(answer)}`,
    options.slice(1).map((p) => `A ${windName(p)}`),
    `Round a northern-hemisphere ${system} the wind blows ${system === 'low' ? 'anticlockwise, slightly in towards the centre' : 'clockwise, slightly out from the centre'}, roughly along the isobars. To the ${directionName(at)} of the centre that gives a ${windName(answer)}. Buys Ballot: back to the wind, the low is on your left.`,
    2,
    { type: 'synoptic', system, boatAt: bearing, tight: undefined },
  );
}

function buysBallotDrill(rng: Rng): Question {
  const wind = pick(POINTS, rng);
  const low = lowFromWind(wind);
  const options = [low, pointOf(degOf(low) + 180), wind, pointOf(degOf(wind) + 180)];
  if (new Set(options).size < 4) return buysBallotDrill(rng);
  return mcq(
    `wx-bb-${wind}`,
    'weather-systems',
    'weather:buys-ballot',
    `Northern hemisphere. The wind is ${windName(wind)}. Roughly where is the centre of low pressure?`,
    `To the ${directionName(low)}`,
    options.slice(1).map((p) => `To the ${directionName(p)}`),
    `Buys Ballot's law: stand with your back to the wind, and in the northern hemisphere the low is on your left — a little behind you. With a ${windName(wind)} your back faces ${directionName(wind)}, so the low lies to the ${directionName(low)}.`,
    2,
  );
}

function isobarSpacingDrill(rng: Rng): Question {
  const at = pick(POINTS, rng);
  const answer = 'At A, where the isobars are closest together';
  return mcq(
    `wx-spacing-${at}`,
    'weather-systems',
    'weather:isobar-spacing',
    'On this sketch chart, where will the wind be stronger?',
    answer,
    [
      'At B, where the isobars are furthest apart',
      'The same at both: the pressure difference across the chart is the same',
      'At the centre of the low',
    ],
    'The closer the isobars, the steeper the pressure gradient and the stronger the wind. At the very centre of a low the wind is often light.',
    1,
    { type: 'synoptic', system: 'low', boatAt: undefined, tight: degOf(at) },
  );
}

// --- forecasts ---------------------------------------------------------------

function termDrill(
  rng: Rng,
  table: readonly Term[],
  what: string,
  concept: string,
  topic: Topic,
): Question {
  const t = pick(table, rng);
  const reverse = rng.next() < 0.5;
  // Three-entry tables get an impostor, so there are always four options; it
  // is not a Met Office term, and the explanation lists only the real ones.
  const impostor: Term = { term: 'Eventually', meaning: 'more than 24 hours from the time of issue' };
  const pool = table.length >= 4 ? table : [...table, impostor];
  const others = shuffle(pool.filter((x) => x.term !== t.term), rng).slice(0, 3);
  const full = `The full set: ${table.map((x) => `${x.term.toLowerCase()} — ${x.meaning}`).join('; ')}.`;
  return reverse
    ? mcq(
        `wx-${concept}-r-${t.term}`,
        topic,
        `weather:${concept}`,
        `In a Met Office forecast, which ${what} term means ${t.meaning}?`,
        `“${t.term}”`,
        others.map((o) => `“${o.term}”`),
        `“${t.term}” means ${t.meaning}. ${full}`,
        1,
      )
    : mcq(
        `wx-${concept}-f-${t.term}`,
        topic,
        `weather:${concept}`,
        `In a Met Office forecast, what does the ${what} term “${t.term}” mean?`,
        capital(t.meaning),
        others.map((o) => capital(o.meaning)),
        `“${t.term}” means ${t.meaning}. ${full}`,
        1,
      );
}

function galeDrill(rng: Rng): Question {
  const f = pick([8, 9, 10], rng);
  const name = { 8: 'gale', 9: 'severe gale', 10: 'storm' }[f] as string;
  const knots = { 8: '34–40', 9: '41–47', 10: '48–55' }[f] as string;
  const gusts = { 8: '43–51', 9: '52–60', 10: '61–68' }[f] as string;
  return mcq(
    `wx-gale-${f}`,
    'weather-forecasts',
    'weather:gale-warning',
    `A ${name} warning is issued. What does the Met Office mean by ${name}?`,
    `Force ${f}, ${knots} knots, or gusts reaching ${gusts} knots`,
    [8, 9, 10, 7]
      .filter((x) => x !== f)
      .slice(0, 3)
      .map((x) =>
        x === 7
          ? 'Force 7, 28–33 knots, the start of the gale range'
          : `Force ${x}, ${{ 8: '34–40', 9: '41–47', 10: '48–55' }[x]} knots, or gusts reaching ${{ 8: '43–51', 9: '52–60', 10: '61–68' }[x]} knots`,
      ),
    `Met Office: gale — force 8 (34–40 kn) or gusts 43–51 kn; severe gale — force 9 (41–47 kn) or gusts 52–60 kn; storm — force 10 (48–55 kn) or gusts 61–68 kn. Force 7 is a near gale and gets no warning.`,
    1,
  );
}

function forecastLineDrill(rng: Rng): Question {
  const dir = pick(POINTS, rng);
  const lo = pick([3, 4, 5], rng);
  const hi = lo + 2;
  const timing = pick(TIMING, rng);
  const sea = pick(SEA_STATE.slice(1, 5), rng);
  const vis = pick(VISIBILITY.slice(1), rng);
  const line = `${directionName(dir).replace(/^./, (c) => c.toUpperCase())} ${lo} to ${hi}, occasionally ${hi + 1} ${timing.term.toLowerCase()}. ${sea.term}. Rain. ${vis.term}.`;
  const ask = pick(['sea', 'vis', 'timing'] as const, rng);
  const [answer, wrong, why] =
    ask === 'sea'
      ? [capital(sea.meaning), shuffle(SEA_STATE.filter((x) => x.term !== sea.term), rng).slice(0, 3).map((x) => capital(x.meaning)), `“${sea.term}” is ${sea.meaning}.`]
      : ask === 'vis'
        ? [capital(vis.meaning), shuffle(VISIBILITY.filter((x) => x.term !== vis.term), rng).slice(0, 3).map((x) => capital(x.meaning)), `“${vis.term}” visibility is ${vis.meaning}.`]
        : [
            `Force ${hi + 1} at times, ${timing.meaning}`,
            [
              ...TIMING.filter((x) => x.term !== timing.term).map((x) => `Force ${hi + 1} at times, ${x.meaning}`),
              `Force ${hi + 1} all the time, ${timing.meaning}`,
            ].slice(0, 3),
            `“Occasionally ${hi + 1} ${timing.term.toLowerCase()}”: force ${hi + 1} at times, ${timing.meaning}.`,
          ];
  const question = ask === 'sea' ? 'What waves does it forecast?' : ask === 'vis' ? 'What visibility does it forecast?' : `What does “occasionally ${hi + 1} ${timing.term.toLowerCase()}” mean?`;
  return mcq(
    `wx-line-${dir}-${lo}-${timing.term}-${sea.term}-${vis.term}-${ask}`,
    'weather-forecasts',
    'weather:forecast-line',
    `An area forecast reads:\n\n“${line}”\n\n${question}`,
    answer,
    wrong,
    `Area forecasts give wind, then sea state, then weather, then visibility. ${why}`,
    2,
  );
}

// --- breezes -----------------------------------------------------------------

function seaBreezeDrill(rng: Rng): Question {
  const seaSide = pick(POINTS.filter((_, i) => i % 2 === 0), rng);
  const night = rng.next() < 0.4;
  const answer = night ? pointOf(degOf(seaSide) + 180) : seaSide;
  const options = [answer, pointOf(degOf(answer) + 180), pointOf(degOf(answer) + 90), pointOf(degOf(answer) - 90)];
  return mcq(
    `wx-breeze-${seaSide}-${night}`,
    'weather-breezes',
    night ? 'weather:land-breeze' : 'weather:sea-breeze',
    night
      ? `A clear, calm night on a coast where the open sea lies to the ${directionName(seaSide)}. Close inshore, which way will any breeze blow?`
      : `A sunny summer afternoon with little gradient wind, on a coast where the open sea lies to the ${directionName(seaSide)}. Which way will the breeze blow near the shore?`,
    `From the ${directionName(answer)}${night ? ' — off the land' : ' — in off the sea'}`,
    options.slice(1).map((p) => `From the ${directionName(p)}`),
    night
      ? 'At night the land cools faster than the sea, the air over it sinks and flows out to sea: a land breeze, light, and only a few miles offshore.'
      : 'By day the land heats faster than the sea; air rises over it and cooler air flows in from the sea to replace it — a sea breeze, from the sea onto the land, often force 3–4 by mid-afternoon, dying at dusk.',
    1,
  );
}

// --- barometer ---------------------------------------------------------------

function barometerDrill(rng: Rng): Question {
  const start = pick([1004, 1008, 1012, 1016, 1020], rng);
  const change = pick([-7, -5, -4, -3, -2, -1, 1, 2, 3, 5], rng);
  const end = start + change;
  const answer = tendencyFor(change);
  const all = ['Falling slowly', 'Falling', 'Falling quickly', 'Falling very rapidly', 'Rising slowly', 'Rising', 'Rising quickly'];
  const wrong = shuffle(all.filter((x) => x !== answer && x.split(' ')[0] === answer.split(' ')[0]), rng).slice(0, 3);
  while (wrong.length < 3) wrong.push(all.find((x) => x !== answer && !wrong.includes(x)) as string);
  return mcq(
    `wx-baro-${start}-${change}`,
    'weather-barometer',
    'weather:tendency',
    `The barometer read ${start} hPa at 0900 and ${end} hPa at 1200. How would the Met Office describe that?`,
    answer,
    wrong,
    `${Math.abs(change)} hPa in three hours. Met Office bands: slowly 0.1–1.5, (no adjective) 1.6–3.5, quickly 3.6–6.0, very rapidly more than 6.0 hPa in three hours. ${change <= -4 ? 'A fall that fast often means strong winds or a gale soon — log it every hour and reef early.' : change < 0 ? 'A steady fall: something is coming; watch the sky and the next forecast.' : 'Rising: the weather is improving, though a quick rise behind a cold front comes with gusts.'}`,
    1,
  );
}

// --- sources -----------------------------------------------------------------

export function weatherSources(): QuestionSource[] {
  const drills: [string, Topic, Question['difficulty'], (rng: Rng) => Question][] = [
    ['weather:beaufort-knots', 'weather-terms', 1, beaufortForceDrill],
    ['weather:beaufort-sea', 'weather-terms', 2, beaufortSeaDrill],
    ['weather:veer-back', 'weather-terms', 1, veerBackDrill],
    ['weather:front-order', 'weather-systems', 2, orderDrill],
    ['weather:front-change', 'weather-systems', 2, frontChangeDrill],
    ['weather:wind-round', 'weather-systems', 2, windRoundDrill],
    ['weather:buys-ballot', 'weather-systems', 2, buysBallotDrill],
    ['weather:isobar-spacing', 'weather-systems', 1, isobarSpacingDrill],
    ['weather:timing', 'weather-forecasts', 1, (rng) => termDrill(rng, TIMING, 'timing', 'timing', 'weather-forecasts')],
    ['weather:visibility', 'weather-forecasts', 1, (rng) => termDrill(rng, VISIBILITY, 'visibility', 'visibility', 'weather-forecasts')],
    ['weather:sea-state', 'weather-forecasts', 1, (rng) => termDrill(rng, SEA_STATE, 'sea state', 'sea-state', 'weather-forecasts')],
    ['weather:movement', 'weather-forecasts', 2, (rng) => termDrill(rng, MOVEMENT, 'movement', 'movement', 'weather-forecasts')],
    ['weather:gale-warning', 'weather-forecasts', 1, galeDrill],
    ['weather:forecast-line', 'weather-forecasts', 2, forecastLineDrill],
    ['weather:sea-breeze', 'weather-breezes', 1, seaBreezeDrill],
    ['weather:tendency', 'weather-barometer', 1, barometerDrill],
  ];
  const sources: QuestionSource[] = drills.map(([concept, topic, difficulty, generate]) => ({
    id: `gen-${concept}`,
    topic,
    concept,
    difficulty,
    generated: true,
    generate: (rng: Rng) => ({ ...generate(rng), concept }),
  }));
  // One source per cloud, so each is scheduled on its own.
  for (const g of GENERA) {
    sources.push({
      id: `gen-weather-cloud-${g}`,
      topic: 'weather-clouds',
      concept: `weather:cloud:${g}`,
      difficulty: 2,
      generated: true,
      generate: (rng: Rng) => cloudFor(g, rng),
    });
  }
  sources.push({
    id: 'gen-weather:cloud-meaning',
    topic: 'weather-clouds',
    concept: 'weather:cloud-meaning',
    difficulty: 2,
    generated: true,
    generate: (rng: Rng) => ({ ...cloudMeaningDrill(rng), concept: 'weather:cloud-meaning' }),
  });
  // One per stage of the depression, for "what next" and "where am I".
  sources.push({
    id: 'gen-weather:front-next',
    topic: 'weather-systems',
    concept: 'weather:front-next',
    difficulty: 2,
    generated: true,
    generate: (rng: Rng) => ({ ...nextCloudDrill(rng), concept: 'weather:front-next' }),
  });
  sources.push({
    id: 'gen-weather:front-where',
    topic: 'weather-systems',
    concept: 'weather:front-where',
    difficulty: 3,
    generated: true,
    generate: (rng: Rng) => ({ ...whereAmIDrill(rng), concept: 'weather:front-where' }),
  });
  return sources;
}

/** The recognition drill for one named cloud. */
function cloudFor(g: Genus, rng: Rng): Question {
  const wrong = cloudDistractors(g, rng);
  const c = CLOUDS[g];
  return mcq(
    `wx-cloud-${g}`,
    'weather-clouds',
    `weather:cloud:${g}`,
    'What cloud is this?',
    c.name,
    wrong.map((w) => CLOUDS[w].name),
    `${c.name}, a ${c.level === 'vertical' ? 'heaped cloud that can reach from low to high' : `${c.level}-level cloud`}: ${c.look}. It ${c.tells}.`,
    2,
    { type: 'cloud', genus: g, photo: Math.floor(rng.next() * 2) },
  );
}

export type { Point };
export {
  beaufortForceDrill,
  beaufortSeaDrill,
  veerBackDrill,
  cloudFor,
  cloudMeaningDrill,
  nextCloudDrill,
  whereAmIDrill,
  frontChangeDrill,
  orderDrill,
  windRoundDrill,
  buysBallotDrill,
  isobarSpacingDrill,
  termDrill,
  galeDrill,
  forecastLineDrill,
  seaBreezeDrill,
  barometerDrill,
};
