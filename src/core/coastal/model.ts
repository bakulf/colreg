/**
 * Lights on aids to navigation — lighthouses, beacons, leading and sector
 * lights — described the way IALA Recommendation R0110 (Rhythmic Characters of
 * Lights on Aids to Navigation, Ed. 5.0, June 2021) classifies them.
 *
 * A light is described by its class, grouping, colours and period. Its
 * timeline — what an observer actually sees, second by second — is derived from
 * that using the timings R0110 gives in its examples, and `violations` checks
 * the result against the limits R0110 sets. The tests run every light in the
 * catalogue through it, so the app cannot flash a character R0110 would reject.
 */

export type LightColour = 'W' | 'R' | 'G' | 'Y';

export const COLOUR_NAMES: Record<LightColour, string> = {
  W: 'white',
  R: 'red',
  G: 'green',
  Y: 'yellow',
};

export type LightClass =
  | 'F'
  | 'Oc'
  | 'Iso'
  | 'Fl'
  | 'LFl'
  | 'Q'
  | 'VQ'
  | 'UQ'
  | 'Mo'
  | 'Al';

export interface Character {
  cls: LightClass;
  /**
   * Flashes or eclipses per group: [] for a single flash or eclipse or a
   * continuous quick light, [3] for Fl(3), [2, 1] for Fl(2+1).
   */
  groups: number[];
  /** Q(6)+LFl and VQ(6)+LFl: the long flash after the group. */
  longFlash?: boolean;
  /** Mo(#): the Morse letter. */
  letter?: string;
  /** In seconds. Absent for a fixed light and a continuous quick light. */
  periodS?: number;
  /** One colour, or the two an alternating light alternates between. */
  colours: LightColour[];
}

export interface Phase {
  colour: LightColour | null;
  ms: number;
}

export interface Timeline {
  periodMs: number;
  phases: Phase[];
}

// --- timings -----------------------------------------------------------------

/**
 * The durations R0110 uses in its own examples. A real light's flash may be
 * shorter; these are chosen because they satisfy every limit R0110 sets and
 * are long enough to watch.
 */
const T = {
  /** Fl, Fl(#), Fl(#+#): the flash. */
  flash: 500,
  /** Fl(2): eclipse within the group; flash + eclipse >= 1 s. */
  flashGapTwo: 1000,
  /** Fl(3+): eclipse within the group; flash + eclipse >= 2 s. */
  flashGapMany: 1500,
  /** Oc, Oc(#): the eclipse. */
  eclipse: 1000,
  /** Oc(#): light between eclipses in a group. */
  ocLightInGroup: 1000,
  longFlash: 2000,
  /** Q: 60 a minute. VQ: 120. UQ: 240. On and off equal. */
  Q: 500,
  VQ: 250,
  UQ: 125,
  /** Morse: a dot about 0.5 s, a dash three times as long. */
  dot: 500,
  dash: 1500,
} as const;

const MORSE: Record<string, string> = {
  A: '.-',
  U: '..-',
  D: '-..',
  K: '-.-',
};

// --- timeline ----------------------------------------------------------------

function fill(phases: Phase[], periodMs: number): Phase[] {
  const used = phases.reduce((n, p) => n + p.ms, 0);
  return used >= periodMs ? phases : [...phases, { colour: null, ms: periodMs - used }];
}

/** A group of `n` flashes, `gap` apart, with no trailing eclipse. */
function flashGroup(n: number, colour: LightColour, on: number, gap: number): Phase[] {
  const out: Phase[] = [];
  for (let i = 0; i < n; i++) {
    out.push({ colour, ms: on });
    if (i < n - 1) out.push({ colour: null, ms: gap });
  }
  return out;
}

function quickRate(cls: 'Q' | 'VQ' | 'UQ'): number {
  return T[cls];
}

export function timeline(c: Character): Timeline {
  const colour = c.colours[0] ?? 'W';
  const periodMs = (c.periodS ?? 0) * 1000;

  switch (c.cls) {
    case 'F':
      return { periodMs: 1000, phases: [{ colour, ms: 1000 }] };

    case 'Iso':
      return {
        periodMs,
        phases: [
          { colour, ms: periodMs / 2 },
          { colour: null, ms: periodMs / 2 },
        ],
      };

    case 'Al': {
      // Two colours, each shown for half the period, no darkness between.
      const other = c.colours[1] ?? 'R';
      return {
        periodMs,
        phases: [
          { colour, ms: periodMs / 2 },
          { colour: other, ms: periodMs / 2 },
        ],
      };
    }

    case 'LFl':
      return { periodMs, phases: fill([{ colour, ms: T.longFlash }], periodMs) };

    case 'Fl': {
      const groups = c.groups.length === 0 ? [1] : c.groups;
      if (groups.length === 1) {
        const n = groups[0] as number;
        const gap = n === 2 ? T.flashGapTwo : T.flashGapMany;
        return { periodMs, phases: fill(flashGroup(n, colour, T.flash, gap), periodMs) };
      }
      // Composite, e.g. (2+1): R0110's example spaces the groups by three
      // eclipses-within-a-group, and gives the rest of the period to the
      // eclipse before the next repetition.
      const phases: Phase[] = [];
      groups.forEach((n, i) => {
        phases.push(...flashGroup(n, colour, T.flash, T.flashGapTwo));
        if (i < groups.length - 1) phases.push({ colour: null, ms: 3 * T.flashGapTwo });
      });
      return { periodMs, phases: fill(phases, periodMs) };
    }

    case 'Oc': {
      const n = c.groups[0] ?? 1;
      const phases: Phase[] = [];
      for (let i = 0; i < n; i++) {
        phases.push({ colour: null, ms: T.eclipse });
        if (i < n - 1) phases.push({ colour, ms: T.ocLightInGroup });
      }
      // Light fills the rest of the period after the last eclipse.
      const used = phases.reduce((s, p) => s + p.ms, 0);
      phases.push({ colour, ms: periodMs - used });
      return { periodMs, phases };
    }

    case 'Q':
    case 'VQ':
    case 'UQ': {
      const on = quickRate(c.cls);
      if (c.groups.length === 0) {
        return {
          periodMs: on * 2,
          phases: [
            { colour, ms: on },
            { colour: null, ms: on },
          ],
        };
      }
      const n = c.groups[0] as number;
      const phases = flashGroup(n, colour, on, on);
      if (c.longFlash) {
        phases.push({ colour: null, ms: on });
        phases.push({ colour, ms: T.longFlash });
      }
      return { periodMs, phases: fill(phases, periodMs) };
    }

    case 'Mo': {
      const code = MORSE[c.letter ?? 'A'] ?? '.-';
      const phases: Phase[] = [];
      [...code].forEach((sym, i) => {
        phases.push({ colour, ms: sym === '.' ? T.dot : T.dash });
        if (i < code.length - 1) phases.push({ colour: null, ms: T.dot });
      });
      return { periodMs, phases: fill(phases, periodMs) };
    }
  }
}

// --- R0110 limits ------------------------------------------------------------

/** Table 1: maximum periods, in seconds. */
export function maxPeriodS(c: Character): number | undefined {
  const n = c.groups[0] ?? 1;
  switch (c.cls) {
    case 'Iso':
      return 12;
    case 'Oc':
      return n === 1 ? 15 : n === 2 ? 20 : 30;
    case 'Fl':
      if (c.groups.length > 1) return 30;
      return n === 1 ? 15 : n === 2 ? 20 : 30;
    case 'LFl':
      return 20;
    case 'VQ':
    case 'UQ':
      return c.groups.length ? 15 : undefined;
    case 'Q':
      return c.groups.length ? 20 : undefined;
    case 'Mo':
      return 30;
    default:
      return undefined;
  }
}

function runs(phases: Phase[], lit: boolean): number[] {
  return phases.filter((p) => (p.colour !== null) === lit).map((p) => p.ms);
}

/**
 * Every way this light falls short of R0110, as sentences. Empty means it
 * conforms. Checked against the timeline, not the description, so a mistake
 * in `timeline` is caught too.
 */
export function violations(c: Character): string[] {
  const out: string[] = [];
  const t = timeline(c);
  const total = t.phases.reduce((n, p) => n + p.ms, 0);
  if (Math.abs(total - t.periodMs) > 1) out.push(`phases sum to ${total} ms, not ${t.periodMs}`);

  const max = maxPeriodS(c);
  if (max !== undefined && (c.periodS ?? 0) > max) {
    out.push(`period ${c.periodS} s exceeds the Table 1 maximum of ${max} s`);
  }

  const light = runs(t.phases, true);
  const dark = runs(t.phases, false);
  const litMs = light.reduce((a, b) => a + b, 0);
  const darkMs = dark.reduce((a, b) => a + b, 0);
  const n = c.groups[0] ?? 1;

  switch (c.cls) {
    case 'Oc': {
      if (litMs <= darkMs) out.push('occulting light must be lit longer than dark');
      const eclipse = Math.max(...dark);
      if (n === 1 && (light[0] ?? 0) < 3 * eclipse) out.push('Oc: light < 3 × eclipse');
      if (n > 1) {
        const inGroup = T.ocLightInGroup;
        const between = light[light.length - 1] ?? 0;
        if (inGroup < eclipse) out.push('Oc(#): light in group < eclipse');
        if (between < 3 * inGroup) out.push('Oc(#): light between groups < 3 × light in group');
        if (n === 2 && eclipse + inGroup < 1000) out.push('Oc(2): eclipse + light < 1 s');
        if (n >= 3 && eclipse + inGroup < 2000) out.push('Oc(3+): eclipse + light < 2 s');
        if (n > 5) out.push('Oc(#): more than five eclipses');
      }
      if ((c.periodS ?? 0) < 2) out.push('Oc: period under 2 s');
      break;
    }
    case 'Iso':
      if (light[0] !== dark[0]) out.push('Iso: light and dark must be equal');
      if ((c.periodS ?? 0) < 2) out.push('Iso: period under 2 s');
      break;
    case 'Fl':
    case 'LFl': {
      if (litMs >= darkMs) out.push('flashing light must be dark longer than lit');
      const flash = Math.max(...light);
      if (c.cls === 'LFl' && flash < 2000) out.push('LFl: long flash under 2 s');
      if (c.cls === 'Fl' && c.groups.length <= 1 && n === 1) {
        if ((dark[0] ?? 0) < 3 * flash) out.push('Fl: eclipse < 3 × flash');
        if ((c.periodS ?? 0) < 2) out.push('Fl: period under 2 s');
      }
      if (c.cls === 'LFl' && (dark[0] ?? 0) < 3 * flash) out.push('LFl: eclipse < 3 × flash');
      if (c.cls === 'Fl' && (c.groups.length > 1 || n > 1)) {
        const inGroup = Math.min(...dark);
        const last = dark[dark.length - 1] ?? 0;
        if (inGroup < flash) out.push('Fl(#): eclipse in group < flash');
        if (last < 3 * inGroup) out.push('Fl(#): eclipse between groups < 3 × eclipse in group');
        const biggest = Math.max(...c.groups);
        if (c.groups.length === 1 && biggest === 2 && flash + inGroup < 1000) {
          out.push('Fl(2): flash + eclipse < 1 s');
        }
        if (c.groups.length === 1 && biggest >= 3 && flash + inGroup < 2000) {
          out.push('Fl(3+): flash + eclipse < 2 s');
        }
        if (biggest > 6) out.push('Fl(#): more than six flashes');
        if (c.groups.length > 1) {
          const ok = c.groups.join('+') === '2+1' || c.groups.join('+') === '3+1';
          if (!ok) out.push('Fl(#+#): only (2+1), or (3+1) as an exception');
        }
      }
      break;
    }
    case 'Q':
    case 'VQ':
    case 'UQ': {
      const cycle = 2 * quickRate(c.cls);
      const perMinute = 60000 / cycle;
      const [lo, hi] =
        c.cls === 'Q' ? [50, 80] : c.cls === 'VQ' ? [80, 160] : [160, 301];
      if (perMinute < lo || perMinute >= hi) out.push(`${c.cls}: ${perMinute} a minute is out of class`);
      if (c.groups.length && ![3, 9, 6].includes(n)) out.push(`${c.cls}(#): groups of 3 or 9 only`);
      if (n === 6 && !c.longFlash) out.push(`${c.cls}(6) is only used with a long flash`);
      if (c.longFlash) {
        const after = dark[dark.length - 1] ?? 0;
        const need = c.cls === 'Q' ? 3 * T.longFlash : 1.5 * T.longFlash;
        if (after < need) out.push(`${c.cls}(6)+LFl: eclipse after the long flash too short`);
      }
      break;
    }
    case 'Mo':
      if (!MORSE[c.letter ?? '']) out.push(`Mo: no Morse for "${c.letter}"`);
      break;
    default:
      break;
  }
  return out;
}

// --- notation ----------------------------------------------------------------

function groupText(c: Character): string {
  if (c.cls === 'Mo') return `(${c.letter})`;
  if (c.groups.length === 0) return '';
  return `(${c.groups.join('+')})`;
}

/**
 * As printed on a chart: 'Fl(3)15s', 'Oc(2)R.10s', 'Q(6)+LFl.15s', 'Al.WR.4s'.
 *
 * White is left out of a single-colour light, as on Admiralty charts, where a
 * light with no colour given is white.
 */
export function notation(c: Character, colours: readonly LightColour[] = c.colours): string {
  let out = `${c.cls}${groupText(c)}${c.longFlash ? '+LFl' : ''}`;
  // A dot separates the parts, except straight after a bracket: 'Fl.R.5s'
  // but 'Fl(3)G.10s' and 'Fl(3)15s'.
  const add = (part: string) => {
    out += (out.endsWith(')') ? '' : '.') + part;
  };
  const col = colours.length === 1 && colours[0] === 'W' ? '' : colours.join('');
  if (col) add(col);
  if (c.periodS !== undefined) add(`${c.periodS}s`);
  return out;
}

const NUMBER_WORDS = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

function every(periodS: number | undefined): string {
  if (periodS === undefined) return '';
  return periodS === 1 ? ' every second' : ` every ${periodS} seconds`;
}

/** What you would say you saw: 'three white flashes every 15 seconds'. */
export function spoken(c: Character): string {
  const colour = COLOUR_NAMES[c.colours[0] ?? 'W'];
  const n = c.groups[0] ?? 1;
  switch (c.cls) {
    case 'F':
      return `a steady ${colour} light that never goes out`;
    case 'Iso':
      return `${colour} light and darkness of equal length, ${(c.periodS ?? 0) / 2} seconds each`;
    case 'Al':
      return `${colour} and ${COLOUR_NAMES[c.colours[1] ?? 'R']} alternately, ${(c.periodS ?? 0) / 2} seconds each, with no darkness between`;
    case 'LFl':
      return `one long ${colour} flash of two seconds${every(c.periodS)}`;
    case 'Fl':
      if (c.groups.length > 1) {
        return `a group of ${NUMBER_WORDS[c.groups[0] as number]} ${colour} flashes then ${NUMBER_WORDS[c.groups[1] as number]}${every(c.periodS)}`;
      }
      return n === 1
        ? `one ${colour} flash${every(c.periodS)}`
        : `${NUMBER_WORDS[n]} ${colour} flashes${every(c.periodS)}`;
    case 'Oc':
      return n === 1
        ? `a steady ${colour} light, eclipsed once${every(c.periodS)}`
        : `a steady ${colour} light, eclipsed ${NUMBER_WORDS[n]} times in a row${every(c.periodS)}`;
    case 'Q':
    case 'VQ':
    case 'UQ': {
      const rate = c.cls === 'Q' ? '60' : c.cls === 'VQ' ? '120' : '240';
      if (c.groups.length === 0) return `${colour} flashes without pause, ${rate} a minute`;
      return `${NUMBER_WORDS[n]} ${colour} flashes at ${rate} a minute${c.longFlash ? ', then a long flash' : ''}${every(c.periodS)}`;
    }
    case 'Mo':
      return `${colour} flashes long and short, spelling ${c.letter} in Morse${every(c.periodS)}`;
  }
}

// --- the catalogue -----------------------------------------------------------

const W: LightColour[] = ['W'];

function light(
  cls: LightClass,
  groups: number[],
  periodS?: number,
  colours: LightColour[] = W,
  extra: Partial<Character> = {},
): Character {
  return { cls, groups, periodS, colours, ...extra };
}

/**
 * The characters drilled. Real ones — each is in use on UK and European
 * coasts — and between them every class R0110 recommends for lighthouses and
 * beacons, with the periods typical of each.
 */
export const CATALOGUE: readonly Character[] = [
  light('F', []),
  light('Fl', [], 5),
  light('Fl', [], 10),
  light('Fl', [2], 10),
  light('Fl', [3], 15),
  light('Fl', [4], 20),
  light('Fl', [5], 30),
  light('Fl', [2, 1], 15),
  light('LFl', [], 10),
  light('Oc', [], 4),
  light('Oc', [], 10),
  light('Oc', [2], 10),
  light('Oc', [3], 15),
  light('Iso', [], 4),
  light('Iso', [], 10),
  light('Q', []),
  light('VQ', []),
  light('UQ', []),
  light('Q', [3], 10),
  light('Q', [9], 15),
  light('Q', [6], 15, W, { longFlash: true }),
  light('VQ', [3], 5),
  light('VQ', [9], 10),
  light('VQ', [6], 10, W, { longFlash: true }),
  light('Mo', [], 8, W, { letter: 'A' }),
  light('Mo', [], 15, W, { letter: 'U' }),
  light('Al', [], 4, ['W', 'R']),
  light('Fl', [], 5, ['R']),
  light('Fl', [3], 10, ['G']),
  light('Oc', [], 6, ['R']),
];

/** A stable id for a character: 'Fl(3).15s', 'Q(6)+LFl.15s'. */
export function characterId(c: Character): string {
  return notation(c).replace(/\./g, '-');
}

/** Two characters an observer could not tell apart by watching. */
export function looksSame(a: Character, b: Character): boolean {
  const ta = timeline(a);
  const tb = timeline(b);
  return JSON.stringify(ta) === JSON.stringify(tb);
}
