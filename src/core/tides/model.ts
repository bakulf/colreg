/**
 * Tidal heights: levels and datums, the rule of twelfths, and secondary ports.
 *
 * Heights are in metres. Everything below the sea is measured down from chart
 * datum (charted depths), everything that dries up from it (drying heights),
 * and the height of tide is the height of the sea surface above it. Vertical
 * clearances are above HAT on current Admiralty editions (chart 5011 and the
 * charts' own notes). So:
 *
 *   depth of water over a charted depth   = charted depth + height of tide
 *   depth of water over a drying height   = height of tide − drying height
 *   clearance under a bridge now           = charted clearance + (HAT − height of tide)
 */

export function depthOver(chartedDepth: number, heightOfTide: number): number {
  return chartedDepth + heightOfTide;
}

export function depthOverDrying(dryingHeight: number, heightOfTide: number): number {
  return heightOfTide - dryingHeight;
}

export function clearanceNow(chartedClearance: number, hat: number, heightOfTide: number): number {
  return chartedClearance + (hat - heightOfTide);
}

// --- the rule of twelfths ----------------------------------------------------

/**
 * Of the range, how many twelfths have gone by after each hour of a six-hour
 * rise or fall: 1, 2, 3, 3, 2, 1 in each hour — so 1, 3, 6, 9, 11, 12 in all.
 * A fair model of a symmetrical curve; poor where the curve is not, such as
 * the Solent.
 */
export const TWELFTHS = [0, 1, 3, 6, 9, 11, 12] as const;

/** Height `hours` after LW on a rising tide, or after HW on a falling one. */
export function twelfthsHeight(lw: number, hw: number, hours: number, rising: boolean): number {
  const range = hw - lw;
  const done = (range * (TWELFTHS[hours] as number)) / 12;
  return rising ? lw + done : hw - done;
}

// --- secondary ports ---------------------------------------------------------

/**
 * A secondary port's differences: time differences for HW at two standard-port
 * HW times, and height differences at MHWS and MHWN, as an almanac tabulates
 * them. Interpolation between them is linear.
 */
export interface Differences {
  /** Standard-port HW times, minutes after midnight, for the two columns. */
  times: [number, number];
  /** HW time difference at each, minutes. */
  timeDiff: [number, number];
  /** Standard port's MHWS and MHWN, metres. */
  levels: [number, number];
  /** Height difference at MHWS and at MHWN, metres. */
  heightDiff: [number, number];
}

export function timeDifferenceAt(d: Differences, standardHw: number): number {
  const [t1, t2] = d.times;
  const f = (standardHw - t1) / (t2 - t1);
  return d.timeDiff[0] + (d.timeDiff[1] - d.timeDiff[0]) * f;
}

export function heightDifferenceAt(d: Differences, standardHeight: number): number {
  const [sp, np] = d.levels;
  const f = (standardHeight - np) / (sp - np);
  return d.heightDiff[1] + (d.heightDiff[0] - d.heightDiff[1]) * f;
}
