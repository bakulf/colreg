/**
 * How far a light can be seen.
 *
 * Three ranges, and the one that matters is the smallest that applies:
 *
 * - Nominal range: what the chart prints. IALA Recommendation R0202 (E-200-2,
 *   Ed. 2.1, December 2017) defines it as the luminous range in a
 *   meteorological visibility of 10 nautical miles, for an illuminance at the
 *   eye of 2 × 10⁻⁷ lux at night.
 * - Luminous range: how far the light carries in the visibility there actually
 *   is, by Allard's law, which R0202 prescribes for every range calculation.
 * - Geographic range: how far before the curve of the earth hides it, from the
 *   height of the light and the height of eye.
 */

const NM = 1852;
/** R0202: illuminance at the eye for night-time nominal range, in lux. */
const E_NIGHT = 2e-7;
/** R0202: nominal range is defined for a meteorological visibility of 10 NM. */
export const NOMINAL_VISIBILITY_NM = 10;

/**
 * The RYA and most yachtsmen's almanacs use 2.08, which is the geometric 1.92
 * plus about 8 % for refraction. IHO S-12 uses 2.03. The drills are built so
 * that the right answer is the same with either.
 */
export const GEO_K = 2.08;
export const GEO_K_ALT = 2.03;

/** Distance of the horizon from a height, in nautical miles. */
export function horizonNm(heightM: number, k = GEO_K): number {
  return k * Math.sqrt(heightM);
}

/**
 * The distance at which a light of elevation `lightM` rises above, or dips
 * below, the horizon for an eye `eyeM` above the sea.
 */
export function geographicRangeNm(lightM: number, eyeM: number, k = GEO_K): number {
  return horizonNm(lightM, k) + horizonNm(eyeM, k);
}

/** Allard's law: I = E · D² · 0.05^(−D/V), with D and V in metres. */
function intensityFor(rangeNm: number, visibilityNm: number): number {
  const d = rangeNm * NM;
  const v = visibilityNm * NM;
  return E_NIGHT * d * d * 0.05 ** (-d / v);
}

/** The luminous intensity, in candela, a light of this nominal range has. */
export function intensityFromNominal(nominalNm: number): number {
  return intensityFor(nominalNm, NOMINAL_VISIBILITY_NM);
}

/**
 * Luminous range for a light of the given nominal range in the given
 * meteorological visibility — what the luminous range diagram in a list of
 * lights reads off.
 */
export function luminousRangeNm(nominalNm: number, visibilityNm: number): number {
  const target = intensityFromNominal(nominalNm);
  // Allard's law is increasing in D, so bisect.
  let lo = 0;
  let hi = 500;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (intensityFor(mid, visibilityNm) < target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
