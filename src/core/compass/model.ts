/**
 * The magnetic compass: variation, deviation, and the conversions between
 * true, magnetic and compass directions.
 *
 * Signs follow one convention throughout: east is positive, west negative.
 * Then every conversion is an addition —
 *
 *   magnetic = compass + deviation
 *   true     = magnetic + variation
 *
 * — which is the arithmetic behind "CADET" (Compass ADd East to get True) and
 * "error west, compass best". The drills are built on these two lines and
 * nothing else, so the answer and the explanation cannot disagree.
 */

export function norm360(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/** '047°', as a course or bearing is written. */
export function bearing(deg: number): string {
  return `${String(Math.round(norm360(deg)) % 360).padStart(3, '0')}°`;
}

/** 3 → '3°E', -2 → '2°W', 0 → '0°'. */
export function error(deg: number): string {
  if (deg === 0) return '0°';
  return `${Math.abs(deg)}°${deg > 0 ? 'E' : 'W'}`;
}

// --- variation ---------------------------------------------------------------

/** As printed in a chart's compass rose: "4°15'W 2009 (8'E)". */
export interface RoseVariation {
  /** Variation in minutes of arc, east positive, for `year`. */
  minutes: number;
  year: number;
  /** Annual change in minutes, east positive. */
  annualMinutes: number;
}

function degMin(minutes: number): string {
  const abs = Math.abs(minutes);
  const d = Math.floor(abs / 60);
  const m = abs % 60;
  const side = minutes > 0 ? 'E' : minutes < 0 ? 'W' : '';
  return `${d}°${String(m).padStart(2, '0')}'${side}`;
}

/** The rose's own wording: "4°15'W 2009 (8'E)". */
export function roseText(v: RoseVariation): string {
  const change = `${Math.abs(v.annualMinutes)}'${v.annualMinutes > 0 ? 'E' : 'W'}`;
  return `${degMin(v.minutes)} ${v.year} (${change})`;
}

/** Variation in minutes for a given year. */
export function variationMinutesIn(v: RoseVariation, year: number): number {
  return v.minutes + v.annualMinutes * (year - v.year);
}

/** Written in degrees and minutes: '2°47'W'. */
export function variationText(minutes: number): string {
  return degMin(minutes);
}

/** Rounded to the nearest whole degree, as it is applied to a course. */
export function wholeDegrees(minutes: number): number {
  return Math.round(minutes / 60);
}

// --- deviation ---------------------------------------------------------------

/**
 * A deviation card: deviation against ship's head by compass, every 30°, as
 * the card in an almanac gives it. Values are whole degrees, east positive.
 */
export interface DeviationCard {
  /** Twelve entries, for compass headings 000°, 030° … 330°. */
  deviation: number[];
}

export const CARD_STEP = 30;

/**
 * A plausible card: a yacht's deviation follows the shape of a sine curve
 * round the compass — the semicircular deviation of the textbooks — plus a
 * small constant. Peak values of four to six degrees are typical of a
 * steel-engined boat whose compass has not been adjusted.
 */
export function makeCard(amplitude: number, phaseDeg: number, constant: number): DeviationCard {
  const deviation = Array.from({ length: 360 / CARD_STEP }, (_, i) => {
    const h = (i * CARD_STEP * Math.PI) / 180;
    return Math.round(constant + amplitude * Math.sin(h + (phaseDeg * Math.PI) / 180));
  });
  return { deviation };
}

/**
 * Deviation for a compass heading. Between the card's entries it is
 * interpolated; in practice, and in every drill here, headings are taken off
 * the card directly.
 */
export function deviationFor(card: DeviationCard, compassHeading: number): number {
  const h = norm360(compassHeading);
  const i = Math.floor(h / CARD_STEP);
  const f = (h - i * CARD_STEP) / CARD_STEP;
  const a = card.deviation[i % card.deviation.length] as number;
  const b = card.deviation[(i + 1) % card.deviation.length] as number;
  return a + (b - a) * f;
}

// --- conversions -------------------------------------------------------------

export function compassToMagnetic(compass: number, deviation: number): number {
  return norm360(compass + deviation);
}

export function magneticToTrue(magnetic: number, variation: number): number {
  return norm360(magnetic + variation);
}

export function trueToMagnetic(trueDeg: number, variation: number): number {
  return norm360(trueDeg - variation);
}

export function magneticToCompass(magnetic: number, deviation: number): number {
  return norm360(magnetic - deviation);
}

/**
 * The compass course to steer for a magnetic course, reading the card by
 * compass heading. The card is indexed by the answer, so it is solved rather
 * than looked up; deviation changes slowly with heading, so this settles in a
 * couple of steps.
 */
export function compassForMagnetic(card: DeviationCard, magnetic: number): number {
  let c = magnetic;
  for (let i = 0; i < 6; i++) c = norm360(magnetic - deviationFor(card, c));
  return c;
}

/** The difference b − a, as the short way round, in −180..180. */
export function turn(a: number, b: number): number {
  return ((b - a + 540) % 360) - 180;
}
