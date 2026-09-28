/**
 * Marine weather: the Beaufort scale, the Met Office's forecast terms, the
 * clouds, and the passage of a depression.
 *
 * Forecast terms are the Met Office's own definitions, from its marine
 * forecasts glossary; Beaufort ranges are the standard ones. Everything is
 * northern hemisphere, which is where the RYA syllabus sails.
 */

// --- the Beaufort scale ------------------------------------------------------

export interface Force {
  force: number;
  name: string;
  /** Mean wind, knots, inclusive. */
  from: number;
  to: number;
  sea: string;
}

export const BEAUFORT: readonly Force[] = [
  { force: 0, name: 'Calm', from: 0, to: 0, sea: 'Sea like a mirror' },
  { force: 1, name: 'Light air', from: 1, to: 3, sea: 'Ripples, no crests' },
  { force: 2, name: 'Light breeze', from: 4, to: 6, sea: 'Small wavelets, crests glassy and not breaking' },
  { force: 3, name: 'Gentle breeze', from: 7, to: 10, sea: 'Large wavelets, crests begin to break, scattered white horses' },
  { force: 4, name: 'Moderate breeze', from: 11, to: 16, sea: 'Small waves becoming longer, fairly frequent white horses' },
  { force: 5, name: 'Fresh breeze', from: 17, to: 21, sea: 'Moderate waves, many white horses, some spray' },
  { force: 6, name: 'Strong breeze', from: 22, to: 27, sea: 'Large waves, white foam crests everywhere, spray likely' },
  { force: 7, name: 'Near gale', from: 28, to: 33, sea: 'Sea heaps up, foam from breaking waves blown in streaks' },
  { force: 8, name: 'Gale', from: 34, to: 40, sea: 'Moderately high waves, crests break into spindrift, well-marked streaks of foam' },
  { force: 9, name: 'Severe gale', from: 41, to: 47, sea: 'High waves, dense streaks of foam, crests topple and roll over' },
  { force: 10, name: 'Storm', from: 48, to: 55, sea: 'Very high waves with overhanging crests, the sea looks white' },
  { force: 11, name: 'Violent storm', from: 56, to: 63, sea: 'Exceptionally high waves, small ships lost to view behind them' },
  { force: 12, name: 'Hurricane', from: 64, to: 999, sea: 'Air filled with foam and spray, sea completely white' },
];

export function forceFor(knots: number): Force {
  return BEAUFORT.find((f) => knots >= f.from && knots <= f.to) ?? (BEAUFORT[12] as Force);
}

// --- the Met Office's terms --------------------------------------------------

export interface Term {
  term: string;
  meaning: string;
}

/** Timing, from the time of issue. */
export const TIMING: readonly Term[] = [
  { term: 'Imminent', meaning: 'within 6 hours of the time of issue' },
  { term: 'Soon', meaning: '6 to 12 hours from the time of issue' },
  { term: 'Later', meaning: 'more than 12 hours from the time of issue' },
];

export const VISIBILITY: readonly Term[] = [
  { term: 'Very poor', meaning: 'less than 1,000 metres' },
  { term: 'Poor', meaning: '1,000 metres to 2 miles' },
  { term: 'Moderate', meaning: '2 to 5 miles' },
  { term: 'Good', meaning: 'more than 5 miles' },
];

export const SEA_STATE: readonly Term[] = [
  { term: 'Smooth', meaning: 'waves under 0.5 m' },
  { term: 'Slight', meaning: 'waves 0.5 to 1.25 m' },
  { term: 'Moderate', meaning: 'waves 1.25 to 2.5 m' },
  { term: 'Rough', meaning: 'waves 2.5 to 4 m' },
  { term: 'Very rough', meaning: 'waves 4 to 6 m' },
  { term: 'High', meaning: 'waves 6 to 9 m' },
];

/** Speed of movement of pressure systems. */
export const MOVEMENT: readonly Term[] = [
  { term: 'Slowly', meaning: 'less than 15 knots' },
  { term: 'Steadily', meaning: '15 to 25 knots' },
  { term: 'Rather quickly', meaning: '25 to 35 knots' },
  { term: 'Rapidly', meaning: '35 to 45 knots' },
  { term: 'Very rapidly', meaning: 'more than 45 knots' },
];

/**
 * Pressure tendency: the change in the preceding three hours, hPa. The Met
 * Office names four bands; "steady" is used for no appreciable change.
 */
export const TENDENCY: readonly { word: string; from: number; to: number }[] = [
  { word: 'slowly', from: 0.1, to: 1.5 },
  { word: '', from: 1.6, to: 3.5 },
  { word: 'quickly', from: 3.6, to: 6.0 },
  { word: 'very rapidly', from: 6.1, to: 99 },
];

export function tendencyFor(changeIn3h: number): string {
  const a = Math.abs(changeIn3h);
  const way = changeIn3h < 0 ? 'Falling' : 'Rising';
  const band = TENDENCY.find((t) => a >= t.from - 1e-9 && a <= t.to + 1e-9);
  if (!band) return 'Steady';
  return band.word ? `${way} ${band.word}` : way;
}

// --- directions --------------------------------------------------------------

export const POINTS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;
export type Point = (typeof POINTS)[number];

const NAMES: Record<Point, string> = {
  N: 'north',
  NE: 'north-east',
  E: 'east',
  SE: 'south-east',
  S: 'south',
  SW: 'south-west',
  W: 'west',
  NW: 'north-west',
};

export function pointOf(deg: number): Point {
  return POINTS[Math.round((((deg % 360) + 360) % 360) / 45) % 8] as Point;
}

export function degOf(p: Point): number {
  return POINTS.indexOf(p) * 45;
}

/** 'SW' → 'south-westerly', as a wind is named. */
export function windName(p: Point): string {
  return `${NAMES[p]}erly`;
}

export function directionName(p: Point): string {
  return NAMES[p];
}

/** Clockwise is veering, anticlockwise backing. */
export function change(from: Point, to: Point): 'veering' | 'backing' {
  const d = (degOf(to) - degOf(from) + 360) % 360;
  return d > 0 && d < 180 ? 'veering' : 'backing';
}

/**
 * The wind at a point, from where the point lies relative to the centre of a
 * low or a high. Round a northern-hemisphere low the wind blows anticlockwise,
 * a little in across the isobars; round a high, clockwise and a little out.
 * To eight points: from 90° clockwise of the point's bearing from a low, 90°
 * anticlockwise of it from a high.
 */
export function windAround(system: 'low' | 'high', bearingFromCentre: number): Point {
  const inflow = 15;
  const from = system === 'low' ? bearingFromCentre + 90 - inflow : bearingFromCentre - 90 - inflow;
  return pointOf(from);
}

/**
 * Buys Ballot's law, northern hemisphere: stand with your back to the wind and
 * the low is on your left.
 */
export function lowFromWind(windFrom: Point): Point {
  return pointOf(degOf(windFrom) + 90);
}

// --- clouds ------------------------------------------------------------------

export type Genus =
  | 'cirrus'
  | 'cirrocumulus'
  | 'cirrostratus'
  | 'altocumulus'
  | 'altostratus'
  | 'nimbostratus'
  | 'stratocumulus'
  | 'stratus'
  | 'cumulus'
  | 'cumulonimbus';

export interface Cloud {
  genus: Genus;
  name: string;
  level: 'high' | 'medium' | 'low' | 'vertical';
  look: string;
  /** What it usually means to a sailor. */
  tells: string;
}

export const CLOUDS: Record<Genus, Cloud> = {
  cirrus: {
    genus: 'cirrus',
    name: 'Cirrus',
    level: 'high',
    look: 'thin white wisps and hooked streaks — "mares’ tails"',
    tells: 'often the first sign of an approaching warm front, a day or so ahead, especially if it thickens and the barometer falls',
  },
  cirrocumulus: {
    genus: 'cirrocumulus',
    name: 'Cirrocumulus',
    level: 'high',
    look: 'small white ripples or grains in rows — a "mackerel sky"',
    tells: 'unsettled air aloft; often accompanies cirrus ahead of a front',
  },
  cirrostratus: {
    genus: 'cirrostratus',
    name: 'Cirrostratus',
    level: 'high',
    look: 'a thin milky veil over the sky, with a halo round the sun or moon',
    tells: 'a warm front is approaching: rain likely within about twelve hours',
  },
  altocumulus: {
    genus: 'altocumulus',
    name: 'Altocumulus',
    level: 'medium',
    look: 'grey-white rounded patches in sheets or rows, bigger than cirrocumulus',
    tells: 'medium-level instability; in the morning, turreted forms can mean thunder later',
  },
  altostratus: {
    genus: 'altostratus',
    name: 'Altostratus',
    level: 'medium',
    look: 'a grey sheet through which the sun shows dimly, as through frosted glass, with no halo',
    tells: 'the warm front is getting close: rain within a few hours',
  },
  nimbostratus: {
    genus: 'nimbostratus',
    name: 'Nimbostratus',
    level: 'low',
    look: 'a thick, dark grey layer with a ragged base, the sun hidden, continuous rain',
    tells: 'the warm front itself: steady rain and poor visibility',
  },
  stratocumulus: {
    genus: 'stratocumulus',
    name: 'Stratocumulus',
    level: 'low',
    look: 'low grey or white rolls and lumps, often with gaps of blue',
    tells: 'usually dry; common in the warm sector and under a high',
  },
  stratus: {
    genus: 'stratus',
    name: 'Stratus',
    level: 'low',
    look: 'a low, featureless grey layer, hiding hilltops; drizzle',
    tells: 'drizzle and poor visibility — typical of the warm sector',
  },
  cumulus: {
    genus: 'cumulus',
    name: 'Cumulus',
    level: 'vertical',
    look: 'separate white heaps with flat bases and cauliflower tops',
    tells: 'fair weather when small; showers when they grow — typical behind a cold front',
  },
  cumulonimbus: {
    genus: 'cumulonimbus',
    name: 'Cumulonimbus',
    level: 'vertical',
    look: 'a towering cloud with an anvil-shaped top and a dark base',
    tells: 'heavy showers, squalls and thunder: reef before it arrives',
  },
};

// --- the passage of a depression ---------------------------------------------

export interface Stage {
  id: string;
  /** A label for the strip: 'Far ahead', 'Warm front'. */
  short: string;
  where: string;
  cloud: Genus;
  pressure: string;
  wind: string;
  weather: string;
  visibility: string;
}

/**
 * What a sailor sees as a classic depression passes to the north: the warm
 * front arrives, then the warm sector, then the cold front.
 */
export const DEPRESSION: readonly Stage[] = [
  {
    id: 'far-ahead',
    short: 'Far ahead',
    where: 'well ahead of the warm front',
    cloud: 'cirrus',
    pressure: 'starting to fall',
    wind: 'backing and freshening',
    weather: 'fine',
    visibility: 'good',
  },
  {
    id: 'ahead',
    short: 'Ahead',
    where: 'ahead of the warm front',
    cloud: 'cirrostratus',
    pressure: 'falling',
    wind: 'backing and freshening',
    weather: 'fine, the sun in a halo',
    visibility: 'good',
  },
  {
    id: 'near',
    short: 'Close ahead',
    where: 'close ahead of the warm front',
    cloud: 'altostratus',
    pressure: 'falling steadily',
    wind: 'fresh, still backing',
    weather: 'rain beginning',
    visibility: 'good, becoming moderate',
  },
  {
    id: 'warm-front',
    short: 'Warm front',
    where: 'at the warm front',
    cloud: 'nimbostratus',
    pressure: 'falling, then its fall stops as the front passes',
    wind: 'veers as the front passes',
    weather: 'continuous rain',
    visibility: 'poor',
  },
  {
    id: 'warm-sector',
    short: 'Warm sector',
    where: 'in the warm sector',
    cloud: 'stratus',
    pressure: 'steady, or falling slowly',
    wind: 'steady in direction',
    weather: 'drizzle, mild and damp',
    visibility: 'poor, often fog',
  },
  {
    id: 'cold-front',
    short: 'Cold front',
    where: 'at the cold front',
    cloud: 'cumulonimbus',
    pressure: 'rises sharply as the front passes',
    wind: 'veers sharply, often squally',
    weather: 'heavy rain, possibly thunder',
    visibility: 'poor in the rain',
  },
  {
    id: 'behind',
    short: 'Behind',
    where: 'behind the cold front',
    cloud: 'cumulus',
    pressure: 'rising',
    wind: 'fresh and gusty, veered',
    weather: 'showers and bright intervals, colder',
    visibility: 'very good except in showers',
  },
];
