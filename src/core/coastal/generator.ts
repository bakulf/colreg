import type { Question, QuestionSource, Rng } from '../types.ts';
import { pick, shuffle } from '../rng.ts';
import type { Character, LightColour } from './model.ts';
import { CATALOGUE, characterId, looksSame, notation, spoken } from './model.ts';
import {
  GEO_K,
  GEO_K_ALT,
  NOMINAL_VISIBILITY_NM,
  geographicRangeNm,
  horizonNm,
  luminousRangeNm,
} from './range.ts';

/**
 * Drills for lights ashore, all generated.
 *
 * Recognition drills flash a character from the catalogue and ask for its
 * chart notation. The chart and range drills build a light — elevation,
 * range, sectors — and ask what the chart is telling you or how far off it
 * will be seen, computing the answer from the same model the explanation
 * quotes.
 */

function mcq(
  id: string,
  topic: Question['topic'],
  concept: string,
  prompt: string,
  answer: string,
  distractors: string[],
  ruleRefs: string[],
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
    ruleRefs,
    explanation,
    difficulty,
    scene,
  };
}

// --- recognising a character -------------------------------------------------

/**
 * How alike two characters are to watch, so distractors are the ones worth
 * confusing: same class and a neighbouring group count or period first.
 */
function similarity(a: Character, b: Character): number {
  let s = 0;
  const family = (c: Character) =>
    c.cls === 'Q' || c.cls === 'VQ' || c.cls === 'UQ'
      ? 'quick'
      : c.cls === 'Fl' || c.cls === 'LFl'
        ? 'flash'
        : c.cls === 'Oc' || c.cls === 'Iso'
          ? 'long-light'
          : c.cls;
  if (a.cls === b.cls) s += 4;
  if (family(a) === family(b)) s += 3;
  if ((a.groups[0] ?? 1) === (b.groups[0] ?? 1)) s += 2;
  if (a.periodS === b.periodS) s += 1;
  if (a.colours.join() === b.colours.join()) s += 2;
  return s;
}

/**
 * A candidate in the answer's colour, so that colour is never the giveaway:
 * the question is the rhythm. Alternating lights keep their own pair.
 */
export function recolour(c: Character, like: Character): Character {
  if (c.cls === 'Al' || like.cls === 'Al') return c;
  return { ...c, colours: like.colours };
}

function characterDistractors(answer: Character, rng: Rng): Character[] {
  const seen = new Set([notation(answer)]);
  const candidates: Character[] = [];
  for (const c of shuffle(CATALOGUE, rng)) {
    const r = recolour(c, answer);
    if (seen.has(notation(r)) || looksSame(r, answer)) continue;
    seen.add(notation(r));
    candidates.push(r);
  }
  candidates.sort((x, y) => similarity(answer, y) - similarity(answer, x));
  return shuffle(candidates.slice(0, 6), rng).slice(0, 3);
}

function classNote(c: Character): string {
  switch (c.cls) {
    case 'F':
      return 'A fixed light never changes. R0110 advises care with a single fixed light: it may not be recognised as an aid to navigation at all.';
    case 'Oc':
      return 'Occulting: the light is on for longer than it is off. Count the eclipses, not the flashes.';
    case 'Iso':
      return 'Isophase: light and dark exactly equal. R0110 wants a period of at least 2 s, preferably 4 s, so it is not mistaken for an occulting or flashing light.';
    case 'Fl':
      return c.groups.length > 1
        ? 'Composite group flashing: groups of different sizes within one period. R0110 restricts it to (2+1), or (3+1) as an exception.'
        : 'Flashing: the light is off for longer than it is on — R0110 wants each eclipse at least three times the flash.';
    case 'LFl':
      return 'Long flashing: a single flash of at least two seconds, repeated.';
    case 'Q':
      return 'Quick: at least 50 and fewer than 80 flashes a minute, normally 60.';
    case 'VQ':
      return 'Very quick: at least 80 and fewer than 160 a minute, normally 120 — twice the quick rate.';
    case 'UQ':
      return 'Ultra quick: 160 to 300 a minute, normally 240.';
    case 'Mo':
      return 'Morse code: long and short appearances of light spelling a letter, a dot about half a second, a dash at least three times as long.';
    case 'Al':
      return 'Alternating: different colours in turn. R0110 asks for care that both colours look equally bright.';
  }
}

function recogniseDrill(c: Character, rng: Rng): Question {
  const wrong = characterDistractors(c, rng);
  return mcq(
    `cst-char-${characterId(c)}`,
    'coastal-characters',
    `coastal:char:${characterId(c)}`,
    c.periodS && c.periodS >= 10
      ? 'A light ashore at night. Watch at least one full cycle — this one is long — then give its character as the chart would print it.'
      : 'A light ashore at night. Watch it, then give its character as the chart would print it.',
    notation(c),
    wrong.map((w) => notation(w)),
    ['IALA R0110'],
    `${notation(c)}: ${spoken(c)}. ${classNote(c)}${
      c.periodS
        ? ` The period is timed from the start of one cycle to the start of the next, eclipses included.`
        : ''
    }`,
    c.periodS && c.periodS >= 10 ? 3 : 2,
    { type: 'coastal', character: c },
  );
}

// --- reading the chart -------------------------------------------------------

interface ChartLight {
  character: Character;
  colours: LightColour[];
  elevationM: number;
  /** Longest and shortest range, the same if one colour. */
  ranges: [number, number];
}

/** What lighthouses and sectored lights actually use; quick groups are for marks. */
const SECTORED: readonly Character[] = CATALOGUE.filter(
  (c) =>
    c.colours.length === 1 &&
    c.colours[0] === 'W' &&
    ['Fl', 'Oc', 'Iso', 'LFl'].includes(c.cls),
);

function chartText(l: ChartLight): string {
  const range = l.ranges[0] === l.ranges[1] ? `${l.ranges[0]}M` : `${l.ranges[0]}-${l.ranges[1]}M`;
  return `${notation(l.character, l.colours)} ${l.elevationM}m ${range}`;
}

function colourList(colours: readonly LightColour[]): string {
  const names = colours.map((c) => ({ W: 'white', R: 'red', G: 'green', Y: 'yellow' })[c]);
  if (names.length === 1) return names[0] as string;
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

function cycleText(c: Character): string {
  const n = c.groups[0] ?? 1;
  const every = `every ${c.periodS} s`;
  switch (c.cls) {
    case 'Fl':
      if (c.groups.length > 1) return `groups of ${c.groups.join(' + ')} flashes ${every}`;
      return n === 1 ? `one flash ${every}` : `${n} flashes ${every}`;
    case 'Oc':
      return n === 1 ? `one eclipse ${every}` : `${n} eclipses ${every}`;
    case 'Iso':
      return `equal light and dark, ${every}`;
    case 'LFl':
      return `one long flash ${every}`;
    case 'Q':
    case 'VQ':
      return `${n} ${c.cls === 'Q' ? 'quick' : 'very quick'} flashes${c.longFlash ? ' and a long flash' : ''} ${every}`;
    default:
      return every;
  }
}

function buildChartLight(rng: Rng): ChartLight {
  const character = pick(SECTORED, rng);
  const colours = pick<LightColour[]>([['W', 'R', 'G'], ['W', 'R'], ['W', 'G'], ['W']], rng);
  const elevationM = pick([9, 12, 15, 17, 21, 24, 28, 31, 36, 42, 55], rng);
  const high = pick([10, 12, 14, 15, 16, 18, 20, 22, 25], rng);
  const low = colours.length === 1 ? high : high - pick([2, 3, 4, 5], rng);
  return { character, colours, elevationM, ranges: [high, low] };
}

function decodeDrill(rng: Rng): Question {
  let l = buildChartLight(rng);
  // The swap distractor needs the elevation and range to differ.
  while (l.elevationM === l.ranges[0] || (l.character.groups[0] ?? 1) === l.character.periodS) {
    l = buildChartLight(rng);
  }
  const c = l.character;
  const multi = l.colours.length > 1;
  const rangeRight = multi
    ? `nominal range ${l.ranges[0]} M for the strongest colour, normally the white, down to ${l.ranges[1]} M for the weakest`
    : `nominal range ${l.ranges[0]} M`;
  const sectors = multi ? `${colourList(l.colours)} sectors` : 'white';

  const answer = `${cycleText(c)}; ${sectors}; ${l.elevationM} m above MHWS; ${rangeRight}`;
  const candidates = [
    // Elevation and range read the wrong way round.
    `${cycleText(c)}; ${sectors}; ${l.ranges[0]} m above MHWS; nominal range ${l.elevationM} M`,
    // Elevation taken from chart datum, as soundings are.
    `${cycleText(c)}; ${sectors}; ${l.elevationM} m above chart datum; ${rangeRight}`,
    // Range taken as luminous range for tonight rather than nominal.
    `${cycleText(c)}; ${sectors}; ${l.elevationM} m above MHWS; visible tonight at ${l.ranges[0]} M whatever the visibility`,
  ];
  if (multi) {
    candidates.push(
      `${cycleText(c)}; ${sectors}; ${l.elevationM} m above MHWS; the white reaches only ${l.ranges[1]} M and the coloured sectors ${l.ranges[0]} M`,
    );
  }
  return mcq(
    `cst-decode-${chartText(l)}`,
    'coastal-notation',
    'coastal:notation:decode',
    `The chart shows a light marked:\n\n${chartText(l)}\n\nWhat does it tell you?`,
    answer,
    shuffle(candidates, rng).slice(0, 3),
    ['Chart notation', 'IALA R0202'],
    `Character first (${notation(c, l.colours)}: ${cycleText(c)}${
      multi ? `, showing ${colourList(l.colours)} in different sectors` : ', and white because no colour is given'
    }), then the elevation — on Admiralty charts measured above MHWS, not chart datum, so it is the least height the light will be — then the range. Admiralty charts print the nominal range, the luminous range in a meteorological visibility of 10 miles (IALA R0202); on a clearer or murkier night it carries further or less far, and the earth's curve may hide it sooner.${
      multi ? ' With two ranges, coloured glass absorbs light, so the white normally carries furthest.' : ''
    }`,
    2,
  );
}

// --- sectors -----------------------------------------------------------------

function norm(b: number): number {
  return ((b % 360) + 360) % 360;
}

function inArc(b: number, from: number, to: number): boolean {
  const x = norm(b - from);
  return x < norm(to - from);
}

function deg(b: number): string {
  return `${String(norm(b)).padStart(3, '0')}°`;
}

type SectorColour = 'white' | 'red' | 'green' | 'obscured';

function sectorDrill(rng: Rng): Question {
  const whiteMid = pick([0, 20, 45, 70, 95, 130, 160, 200, 225, 250, 285, 310, 340], rng);
  const halfWhite = pick([2, 3, 4, 5], rng);
  const redWidth = pick([30, 40, 50, 60, 70], rng);
  const greenWidth = pick([30, 40, 50, 60, 70], rng);
  const redClockwise = rng.next() < 0.5;

  const wFrom = norm(whiteMid - halfWhite);
  const wTo = norm(whiteMid + halfWhite);
  const [lowColour, highColour] = redClockwise ? (['G', 'R'] as const) : (['R', 'G'] as const);
  const lowWidth = lowColour === 'R' ? redWidth : greenWidth;
  const highWidth = highColour === 'R' ? redWidth : greenWidth;
  const lowFrom = norm(wFrom - lowWidth);
  const highTo = norm(wTo + highWidth);

  const sectors: { colour: SectorColour; from: number; to: number }[] = [
    { colour: lowColour === 'R' ? 'red' : 'green', from: lowFrom, to: wFrom },
    { colour: 'white', from: wFrom, to: wTo },
    { colour: highColour === 'R' ? 'red' : 'green', from: wTo, to: highTo },
  ];
  const colourAt = (b: number): SectorColour =>
    sectors.find((s) => inArc(b, s.from, s.to))?.colour ?? 'obscured';

  // Aim for every answer about as often, and keep off the sector limits,
  // where a real observer could not tell either.
  const target = pick<SectorColour>(['white', 'red', 'green', 'obscured', 'red', 'green'], rng);
  let bearing = whiteMid;
  for (let i = 0; i < 200; i++) {
    const b = Math.floor(rng.next() * 360);
    const clear = sectors.every(
      (s) => Math.min(Math.abs(norm(b - s.from + 180) - 180), Math.abs(norm(b - s.to + 180) - 180)) >= 2,
    );
    if (clear && colourAt(b) === target) {
      bearing = b;
      break;
    }
  }
  const seen = colourAt(bearing);
  const recip = colourAt(bearing + 180);

  const text: Record<SectorColour, string> = {
    white: 'The white sector',
    red: 'The red sector',
    green: 'The green sector',
    obscured: 'Nothing — the light is obscured on that bearing',
  };
  const order: SectorColour[] = ['white', 'red', 'green', 'obscured'];

  const limits = sectors
    .map((s) => `${s.colour === 'white' ? 'W' : s.colour === 'red' ? 'R' : 'G'} ${deg(s.from)}–${deg(s.to)}`)
    .join(', ');

  return mcq(
    `cst-sector-${whiteMid}-${bearing}-${redClockwise}`,
    'coastal-notation',
    'coastal:notation:sector-bearing',
    `A sectored light, Fl.WRG.5s. The list of lights gives its sectors as:\n\n${limits}\n\nYou take a bearing of the light: ${deg(bearing)}T. What do you see?`,
    text[seen],
    order.filter((c) => c !== seen).map((c) => text[c]),
    ['Chart notation'],
    `Sector limits are true bearings from seaward — as you would take them from your own boat, looking at the light — listed clockwise. ${deg(bearing)} falls ${
      seen === 'obscured' ? 'outside every sector' : `in ${seen === 'white' ? 'W' : seen === 'red' ? 'R' : 'G'} ${deg(sectors.find((s) => s.colour === seen)!.from)}–${deg(sectors.find((s) => s.colour === seen)!.to)}`
    }. ${
      recip !== seen
        ? `Working it from the light instead — the reciprocal, ${deg(bearing + 180)} — would give ${recip === 'obscured' ? 'nothing at all' : recip}, which is the usual mistake.`
        : ''
    }`.trim(),
    2,
  );
}

// --- range -------------------------------------------------------------------

function fmt(nm: number): string {
  return `${nm.toFixed(1)} M`;
}

/**
 * Picks numeric distractors that are clearly apart from the answer and from
 * each other, so a candidate using the other common constant, or reading a
 * diagram, still lands on the right option.
 */
function spread(answer: number, candidates: number[], gap = 0.12): number[] {
  const chosen: number[] = [];
  for (const c of candidates) {
    if (!(c > 0)) continue;
    const all = [answer, ...chosen];
    if (all.every((x) => Math.abs(c - x) / Math.max(c, x) >= gap)) chosen.push(c);
    if (chosen.length === 3) break;
  }
  return chosen;
}

const ELEVATIONS = [12, 16, 18, 23, 28, 36, 41, 49, 56, 64, 72];
const EYES = [1.5, 2, 2.5, 3, 4];

function risingDrill(rng: Rng): Question {
  for (;;) {
    const H = pick(ELEVATIONS, rng);
    const h = pick(EYES, rng);
    const geo = geographicRangeNm(H, h);
    const nominal = Math.ceil(geo) + pick([3, 5, 8], rng);
    const wrong = spread(Math.round(geo * 10) / 10, [
      Math.round(horizonNm(H) * 10) / 10,
      Math.round(GEO_K * Math.sqrt(H + h) * 10) / 10,
      nominal,
      Math.round((geo + horizonNm(h)) * 10) / 10,
      Math.round(geo * 1.25 * 10) / 10,
    ]);
    if (wrong.length < 3) continue;
    return mcq(
      `cst-rise-${H}-${h}-${nominal}`,
      'coastal-range',
      'coastal:range:rising',
      `A lighthouse is charted as Fl(2)10s ${H}m ${nominal}M. Visibility is good, about 10 miles. Your height of eye is ${h} m. At what distance off should it rise above the horizon?`,
      fmt(geo),
      wrong.map(fmt),
      ['Horizon geometry', 'IALA R0202'],
      `Geographic range = ${GEO_K} × (√${H} + √${h}) = ${GEO_K} × (${Math.sqrt(H).toFixed(2)} + ${Math.sqrt(h).toFixed(2)}) = ${fmt(geo)}. Both horizons count: the light's own and yours. The luminous range tonight is about the nominal ${nominal} M, since the visibility is the 10 miles nominal range is defined for, and that is further than the horizon — so the light really does rise, and at that moment the distance off is known. Almanacs tabulate this; some use ${GEO_K_ALT} instead of ${GEO_K}, which gives ${fmt(geographicRangeNm(H, h, GEO_K_ALT))} here.`,
      3,
    );
  }
}

function noRiseDrill(rng: Rng): Question {
  for (;;) {
    const H = pick(ELEVATIONS.filter((e) => e >= 28), rng);
    const h = pick(EYES, rng);
    const geo = geographicRangeNm(H, h);
    const nominal = Math.floor(geo) - pick([4, 6, 8], rng);
    if (nominal < 5) continue;
    const answer = `It never rises: it appears at about ${nominal} M, already clear above the horizon`;
    return mcq(
      `cst-norise-${H}-${h}-${nominal}`,
      'coastal-range',
      'coastal:range:no-rising',
      `A light is charted as Oc.4s ${H}m ${nominal}M. Visibility is about 10 miles, height of eye ${h} m. What happens as you approach from seaward?`,
      answer,
      [
        `It rises above the horizon at ${fmt(geo)}`,
        `It rises above the horizon at ${fmt(horizonNm(H))}`,
        `It rises at ${nominal} M, since that is its charted range`,
      ],
      ['Horizon geometry', 'IALA R0202'],
      `Its geographic range is ${GEO_K} × (√${H} + √${h}) = ${fmt(geo)}, but it is not bright enough to carry that far: in 10 miles visibility its luminous range is its nominal ${nominal} M. The weaker limit wins, so you first see it well inside the horizon, simply switching on. A rising or dipping distance only works as a range when the luminous range is the greater.`,
      3,
    );
  }
}

const VISIBILITIES = [1, 2, 3, 5, 20];

function luminousDrill(rng: Rng): Question {
  for (;;) {
    const nominal = pick([8, 10, 12, 15, 18, 20, 24, 28], rng);
    const vis = pick(VISIBILITIES, rng);
    const lum = luminousRangeNm(nominal, vis);
    const answer = lum >= 5 ? Math.round(lum) : Math.round(lum * 2) / 2;
    const wrong = spread(answer, [
      nominal,
      vis,
      Math.round((nominal * vis) / NOMINAL_VISIBILITY_NM),
      Math.round(answer * 1.5),
      Math.round(answer * 0.6 * 2) / 2,
    ]);
    if (wrong.length < 3) continue;
    const m = (x: number) => `${x} M`;
    return mcq(
      `cst-lum-${nominal}-${vis}`,
      'coastal-range',
      'coastal:range:luminous',
      `A light has a nominal range of ${nominal} M. Tonight the meteorological visibility is ${vis} ${vis === 1 ? 'mile' : 'miles'}. Using the luminous range diagram, about how far will it carry?`,
      m(answer),
      wrong.map(m),
      ['IALA R0202'],
      `About ${m(answer)}. Nominal range is the luminous range in exactly 10 miles visibility, so ${
        vis < NOMINAL_VISIBILITY_NM ? 'in thicker weather the light carries less far' : 'in clearer weather it carries further'
      } — but not in proportion: the light is attenuated exponentially by the atmosphere and falls off with the square of distance, which is Allard's law, the calculation IALA R0202 prescribes and the diagram in every list of lights plots.`,
      3,
    );
  }
}

function firstSightDrill(rng: Rng): Question {
  for (;;) {
    const H = pick(ELEVATIONS, rng);
    const h = pick(EYES, rng);
    const nominal = pick([10, 14, 18, 22, 26], rng);
    const vis = pick([2, 3, 5, 20], rng);
    const geo = geographicRangeNm(H, h);
    const lum = luminousRangeNm(nominal, vis);
    if (Math.abs(geo - lum) / Math.max(geo, lum) < 0.18) continue;
    const first = Math.min(geo, lum);
    const wrong = spread(Math.round(first * 10) / 10, [Math.max(geo, lum), nominal, vis]);
    if (wrong.length < 3) continue;
    const lumWins = lum < geo;
    return mcq(
      `cst-first-${H}-${h}-${nominal}-${vis}`,
      'coastal-range',
      'coastal:range:first-sighting',
      `A light is charted as Fl.5s ${H}m ${nominal}M. Height of eye ${h} m; meteorological visibility ${vis} miles. At about what distance will you first see it?`,
      fmt(first),
      wrong.map(fmt),
      ['Horizon geometry', 'IALA R0202'],
      `Two limits, and the nearer one applies. Geographic range: ${GEO_K} × (√${H} + √${h}) = ${fmt(geo)}. Luminous range from the diagram, nominal ${nominal} M in ${vis} miles visibility: about ${fmt(lum)}. ${
        lumWins
          ? 'The light runs out of brightness before the horizon hides it, so it appears inside its geographic range — and does not rise.'
          : 'It is bright enough to carry beyond the horizon, so the horizon decides: it rises at its geographic range.'
      }`,
      3,
    );
  }
}

// --- sources -----------------------------------------------------------------

export function coastalSources(): QuestionSource[] {
  const sources: QuestionSource[] = CATALOGUE.map((c) => ({
    id: `gen-coastal-char-${characterId(c)}`,
    topic: 'coastal-characters' as const,
    concept: `coastal:char:${characterId(c)}`,
    difficulty: c.periodS && c.periodS >= 10 ? (3 as const) : (2 as const),
    generated: true,
    generate: (rng: Rng) => recogniseDrill(c, rng),
  }));

  const drills: [string, QuestionSource['topic'], (rng: Rng) => Question][] = [
    ['coastal:notation:decode', 'coastal-notation', decodeDrill],
    ['coastal:notation:sector-bearing', 'coastal-notation', sectorDrill],
    ['coastal:range:rising', 'coastal-range', risingDrill],
    ['coastal:range:no-rising', 'coastal-range', noRiseDrill],
    ['coastal:range:luminous', 'coastal-range', luminousDrill],
    ['coastal:range:first-sighting', 'coastal-range', firstSightDrill],
  ];
  for (const [concept, topic, generate] of drills) {
    sources.push({
      id: `gen-${concept}`,
      topic,
      concept,
      difficulty: 3,
      generated: true,
      generate,
    });
  }
  return sources;
}

export {
  recogniseDrill,
  decodeDrill,
  sectorDrill,
  risingDrill,
  noRiseDrill,
  luminousDrill,
  firstSightDrill,
};
