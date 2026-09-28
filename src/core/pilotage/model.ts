/**
 * Position fixing and pilotage: the geometry behind a good fix, clearing
 * lines, leading lines, reducing soundings, and the port traffic signals.
 *
 * Port traffic signals are IALA Recommendation R0111 (E-111, Ed. 1.3,
 * December 2019). The rest is plane geometry and the conventions of RYA
 * chartwork.
 */

export function norm360(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

export function bearing(deg: number): string {
  return `${String(Math.round(norm360(deg)) % 360).padStart(3, '0')}°`;
}

/** The angle between two position lines, 0–90°: bearings 180° apart give the same line. */
export function cut(a: number, b: number): number {
  const d = Math.abs(norm360(a - b)) % 180;
  return Math.min(d, 180 - d);
}

/** How good three bearings are as a fix: the worst cut between any two. */
export function worstCut(bs: readonly [number, number, number]): number {
  return Math.min(cut(bs[0], bs[1]), cut(bs[1], bs[2]), cut(bs[0], bs[2]));
}

/** Angle off the bow, 0–180, port or starboard alike. */
export function offBow(heading: number, b: number): number {
  const d = norm360(b - heading);
  return d > 180 ? 360 - d : d;
}

// --- clearing lines ----------------------------------------------------------

/**
 * A clearing line runs to a charted mark. Looking along it at the mark, if the
 * danger is on the right-hand side, the safe water is on the left, where the
 * mark bears more than the line: "not less than". Danger on the left: "not
 * more than".
 */
export function clearingLabel(dangerSide: 'left' | 'right'): 'NLT' | 'NMT' {
  return dangerSide === 'right' ? 'NLT' : 'NMT';
}

export function isSafe(label: 'NLT' | 'NMT', line: number, observed: number): boolean {
  const d = ((observed - line + 540) % 360) - 180;
  return label === 'NLT' ? d >= 0 : d <= 0;
}

// --- leading lines -----------------------------------------------------------

/**
 * Two marks in line ahead, the rear one further off. Off the line to one side,
 * the nearer front mark moves across further, so the rear mark appears on the
 * same side as you are: rear mark to the right of the front, you are right of
 * the line — alter to port to regain it.
 */
export function steerForLeadingMarks(rearAppears: 'left' | 'right' | 'inline'): 'port' | 'starboard' | 'hold' {
  if (rearAppears === 'inline') return 'hold';
  return rearAppears === 'right' ? 'port' : 'starboard';
}

// --- port traffic signals ----------------------------------------------------

export type SignalLight = 'R' | 'G' | 'W';

export interface PortSignal {
  id: string;
  /** Top to bottom. */
  lights: [SignalLight, SignalLight, SignalLight];
  flashing: boolean;
  /** The yellow light to the left, at the level of the top light. */
  yellow: boolean;
  message: string;
}

export const PORT_SIGNALS: readonly PortSignal[] = [
  {
    id: 'emergency',
    lights: ['R', 'R', 'R'],
    flashing: true,
    yellow: false,
    message: 'Serious emergency — all vessels to stop or divert according to instructions',
  },
  {
    id: 'stop',
    lights: ['R', 'R', 'R'],
    flashing: false,
    yellow: false,
    message: 'Vessels shall not proceed',
  },
  {
    id: 'one-way',
    lights: ['G', 'G', 'G'],
    flashing: false,
    yellow: false,
    message: 'Vessels may proceed — one-way traffic',
  },
  {
    id: 'two-way',
    lights: ['G', 'G', 'W'],
    flashing: false,
    yellow: false,
    message: 'Vessels may proceed — two-way traffic',
  },
  {
    id: 'on-order',
    lights: ['G', 'W', 'G'],
    flashing: false,
    yellow: false,
    message: 'A vessel may proceed only when it has received a specific order to do so',
  },
  {
    id: 'stop-except',
    lights: ['R', 'R', 'R'],
    flashing: false,
    yellow: true,
    message: 'Vessels shall not proceed — except that vessels navigating outside the main channel need not comply',
  },
  {
    id: 'on-order-except',
    lights: ['G', 'W', 'G'],
    flashing: false,
    yellow: true,
    message: 'Proceed only on specific order — except that vessels navigating outside the main channel need not comply',
  },
];
