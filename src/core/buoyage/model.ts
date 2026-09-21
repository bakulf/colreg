/**
 * IALA Maritime Buoyage System, Region A.
 *
 * A mark is described by what it is made of — body shape, colour pattern,
 * topmark, light character — and the drills are derived from that, so the
 * picture and the answer cannot drift apart.
 *
 * Region A is the system in force in UK and European waters and the one the
 * RYA syllabus examines. Region B reverses the lateral colours and keeps the
 * shapes; that difference is covered by a written question rather than by a
 * second set of marks.
 */

export type BuoyColour = 'red' | 'green' | 'yellow' | 'black' | 'white' | 'blue';

export type BodyShape = 'can' | 'conical' | 'spherical' | 'pillar';

export type BodyPattern =
  /** Bands across the body, listed top first. */
  | { type: 'horizontal'; colours: BuoyColour[] }
  /** Stripes down the body, listed left first and repeated to fill. */
  | { type: 'vertical'; colours: BuoyColour[] };

export type Topmark =
  | 'none'
  | 'can'
  | 'cone-up'
  | 'cones-up'
  | 'cones-base'
  | 'cones-down'
  | 'cones-point'
  | 'spheres'
  | 'sphere'
  | 'cross'
  | 'upright-cross';

/** One stretch of the light's cycle. A null colour is darkness. */
export interface Segment {
  colour: BuoyColour | null;
  ms: number;
}

export interface LightCharacter {
  /** As it is written on the chart, e.g. 'VQ(6)+LFl.10s'. */
  label: string;
  /** Spoken form, for the explanation. */
  spoken: string;
  periodMs: number;
  segments: Segment[];
}

export type MarkKind =
  | 'lateral-port'
  | 'lateral-stbd'
  | 'preferred-stbd'
  | 'preferred-port'
  | 'cardinal-n'
  | 'cardinal-e'
  | 'cardinal-s'
  | 'cardinal-w'
  | 'isolated-danger'
  | 'safe-water'
  | 'special'
  | 'emergency-wreck';

export interface Mark {
  kind: MarkKind;
  shape: BodyShape;
  body: BodyPattern;
  topmark: Topmark;
  topmarkColour: BuoyColour;
  light: LightCharacter;
}

// --- light characters --------------------------------------------------------

/**
 * Quick and very quick flashing, Rule-of-thumb rates from the IALA system:
 * quick is 50 to 79 flashes a minute, very quick 80 to 159. The cardinals here
 * use the very quick variants, whose 5 and 10 second periods are short enough
 * to sit and watch; the slower Q equivalents are named in the explanations.
 */
const VQ_ON = 150;
const VQ_OFF = 350;
const LONG_FLASH = 2000;

function vqGroup(count: number): Segment[] {
  return Array.from({ length: count }, () => [
    { colour: 'white' as BuoyColour | null, ms: VQ_ON },
    { colour: null, ms: VQ_OFF },
  ]).flat();
}

function darkTo(segments: Segment[], periodMs: number): Segment[] {
  const used = segments.reduce((n, s) => n + s.ms, 0);
  return used >= periodMs ? segments : [...segments, { colour: null, ms: periodMs - used }];
}

function cardinalLight(
  label: string,
  spoken: string,
  count: number | 'continuous',
  periodMs: number,
  withLongFlash = false,
): LightCharacter {
  if (count === 'continuous') {
    return {
      label,
      spoken,
      periodMs: VQ_ON + VQ_OFF,
      segments: [
        { colour: 'white', ms: VQ_ON },
        { colour: null, ms: VQ_OFF },
      ],
    };
  }
  const base = vqGroup(count);
  const withLong = withLongFlash
    ? [...base, { colour: 'white' as BuoyColour | null, ms: LONG_FLASH }]
    : base;
  return { label, spoken, periodMs, segments: darkTo(withLong, periodMs) };
}

function flashes(
  label: string,
  spoken: string,
  colour: BuoyColour,
  pattern: readonly number[],
  onMs: number,
  periodMs: number,
): LightCharacter {
  // `pattern` gives the gap after each flash except the last, which runs into
  // the eclipse that fills the period.
  const segments: Segment[] = [];
  for (const gap of pattern) {
    segments.push({ colour, ms: onMs });
    if (gap > 0) segments.push({ colour: null, ms: gap });
  }
  return { label, spoken, periodMs, segments: darkTo(segments, periodMs) };
}

// --- the marks ---------------------------------------------------------------

export const MARKS: Record<MarkKind, Mark> = {
  'lateral-port': {
    kind: 'lateral-port',
    shape: 'can',
    body: { type: 'horizontal', colours: ['red'] },
    topmark: 'can',
    topmarkColour: 'red',
    light: flashes('Fl.R.5s', 'one red flash every five seconds', 'red', [0], 500, 5000),
  },
  'lateral-stbd': {
    kind: 'lateral-stbd',
    shape: 'conical',
    body: { type: 'horizontal', colours: ['green'] },
    topmark: 'cone-up',
    topmarkColour: 'green',
    light: flashes('Fl.G.5s', 'one green flash every five seconds', 'green', [0], 500, 5000),
  },
  'preferred-stbd': {
    // Red body with a green band: a port-hand mark, so leave it to port, and
    // the band says the main channel runs to starboard of it.
    kind: 'preferred-stbd',
    shape: 'can',
    body: { type: 'horizontal', colours: ['red', 'green', 'red'] },
    topmark: 'can',
    topmarkColour: 'red',
    light: flashes(
      'Fl(2+1)R.10s',
      'a group of two red flashes then a single one, every ten seconds',
      'red',
      [1000, 2000, 0],
      500,
      10000,
    ),
  },
  'preferred-port': {
    kind: 'preferred-port',
    shape: 'conical',
    body: { type: 'horizontal', colours: ['green', 'red', 'green'] },
    topmark: 'cone-up',
    topmarkColour: 'green',
    light: flashes(
      'Fl(2+1)G.10s',
      'a group of two green flashes then a single one, every ten seconds',
      'green',
      [1000, 2000, 0],
      500,
      10000,
    ),
  },
  'cardinal-n': {
    kind: 'cardinal-n',
    shape: 'pillar',
    body: { type: 'horizontal', colours: ['black', 'yellow'] },
    topmark: 'cones-up',
    topmarkColour: 'black',
    light: cardinalLight('VQ', 'very quick flashing, without pause', 'continuous', 500),
  },
  'cardinal-e': {
    kind: 'cardinal-e',
    shape: 'pillar',
    body: { type: 'horizontal', colours: ['black', 'yellow', 'black'] },
    topmark: 'cones-base',
    topmarkColour: 'black',
    light: cardinalLight('VQ(3).5s', 'three very quick flashes every five seconds', 3, 5000),
  },
  'cardinal-s': {
    kind: 'cardinal-s',
    shape: 'pillar',
    body: { type: 'horizontal', colours: ['yellow', 'black'] },
    topmark: 'cones-down',
    topmarkColour: 'black',
    light: cardinalLight(
      'VQ(6)+LFl.10s',
      'six very quick flashes and a long flash, every ten seconds',
      6,
      10000,
      true,
    ),
  },
  'cardinal-w': {
    kind: 'cardinal-w',
    shape: 'pillar',
    body: { type: 'horizontal', colours: ['yellow', 'black', 'yellow'] },
    topmark: 'cones-point',
    topmarkColour: 'black',
    light: cardinalLight('VQ(9).10s', 'nine very quick flashes every ten seconds', 9, 10000),
  },
  'isolated-danger': {
    kind: 'isolated-danger',
    shape: 'pillar',
    body: { type: 'horizontal', colours: ['black', 'red', 'black'] },
    topmark: 'spheres',
    topmarkColour: 'black',
    light: flashes(
      'Fl(2).5s',
      'two white flashes every five seconds',
      'white',
      [1000, 0],
      400,
      5000,
    ),
  },
  'safe-water': {
    kind: 'safe-water',
    shape: 'spherical',
    body: { type: 'vertical', colours: ['red', 'white'] },
    topmark: 'sphere',
    topmarkColour: 'red',
    light: flashes(
      'LFl.10s',
      'one long white flash every ten seconds',
      'white',
      [0],
      LONG_FLASH,
      10000,
    ),
  },
  special: {
    kind: 'special',
    shape: 'pillar',
    body: { type: 'horizontal', colours: ['yellow'] },
    topmark: 'cross',
    topmarkColour: 'yellow',
    light: flashes('Fl.Y.5s', 'one yellow flash every five seconds', 'yellow', [0], 500, 5000),
  },
  'emergency-wreck': {
    kind: 'emergency-wreck',
    shape: 'pillar',
    body: { type: 'vertical', colours: ['blue', 'yellow'] },
    topmark: 'upright-cross',
    topmarkColour: 'yellow',
    light: {
      label: 'Al.Bu.Y.3s',
      spoken: 'alternating blue and yellow, one second each',
      periodMs: 3000,
      segments: [
        { colour: 'blue', ms: 1000 },
        { colour: null, ms: 500 },
        { colour: 'yellow', ms: 1000 },
        { colour: null, ms: 500 },
      ],
    },
  },
};

export const ALL_MARKS: readonly Mark[] = Object.values(MARKS);

export function markAt(kind: MarkKind): Mark {
  return MARKS[kind];
}

/** What the mark is, in the words the system uses. */
export function describeMark(kind: MarkKind): string {
  switch (kind) {
    case 'lateral-port':
      return 'A port-hand lateral mark';
    case 'lateral-stbd':
      return 'A starboard-hand lateral mark';
    case 'preferred-stbd':
      return 'A preferred channel to starboard mark';
    case 'preferred-port':
      return 'A preferred channel to port mark';
    case 'cardinal-n':
      return 'A north cardinal mark';
    case 'cardinal-e':
      return 'An east cardinal mark';
    case 'cardinal-s':
      return 'A south cardinal mark';
    case 'cardinal-w':
      return 'A west cardinal mark';
    case 'isolated-danger':
      return 'An isolated danger mark';
    case 'safe-water':
      return 'A safe water mark';
    case 'special':
      return 'A special mark';
    case 'emergency-wreck':
      return 'An emergency wreck marking buoy';
  }
}

/** What you do about it, which is the part that keeps you off the rocks. */
export function describeAction(kind: MarkKind): string {
  switch (kind) {
    case 'lateral-port':
      return 'Leave it to port when following the conventional direction of buoyage.';
    case 'lateral-stbd':
      return 'Leave it to starboard when following the conventional direction of buoyage.';
    case 'preferred-stbd':
      return 'The body is a port-hand mark, so leave it to port. The green band says the main channel lies to starboard of it.';
    case 'preferred-port':
      return 'The body is a starboard-hand mark, so leave it to starboard. The red band says the main channel lies to port of it.';
    case 'cardinal-n':
      return 'Pass to the north of it: the safe water lies on the named side.';
    case 'cardinal-e':
      return 'Pass to the east of it.';
    case 'cardinal-s':
      return 'Pass to the south of it.';
    case 'cardinal-w':
      return 'Pass to the west of it.';
    case 'isolated-danger':
      return 'It stands on or above a danger with navigable water all round. Do not pass close.';
    case 'safe-water':
      return 'There is navigable water all round it. It marks a landfall, a fairway or a mid-channel.';
    case 'special':
      return 'It is not primarily navigational. The chart says what the feature is — a spoil ground, an outfall, a cable, a racing mark.';
    case 'emergency-wreck':
      return 'A new wreck, not yet on the chart. Give it a wide berth; the buoy stays until the wreck is charted and conventionally marked.';
  }
}

export function describeBody(kind: MarkKind): string {
  const m = MARKS[kind];
  const shape =
    m.shape === 'can'
      ? 'can shaped'
      : m.shape === 'conical'
        ? 'conical'
        : m.shape === 'spherical'
          ? 'spherical'
          : 'a pillar';
  const colours =
    m.body.type === 'vertical'
      ? `${m.body.colours.join(' and ')} vertical stripes`
      : m.body.colours.length === 1
        ? (m.body.colours[0] as string)
        : `${m.body.colours.join(' over ')} horizontal bands`;
  return `${shape}, ${colours}`;
}

export function describeTopmark(kind: MarkKind): string {
  const m = MARKS[kind];
  switch (m.topmark) {
    case 'none':
      return 'no topmark';
    case 'can':
      return 'a single red can topmark';
    case 'cone-up':
      return 'a single green cone, point up';
    case 'cones-up':
      return 'two black cones, both points upwards';
    case 'cones-base':
      return 'two black cones, base to base';
    case 'cones-down':
      return 'two black cones, both points downwards';
    case 'cones-point':
      return 'two black cones, point to point';
    case 'spheres':
      return 'two black spheres in a vertical line';
    case 'sphere':
      return 'a single red sphere';
    case 'cross':
      return 'a single yellow cross';
    case 'upright-cross':
      return 'a single yellow upright cross';
  }
}

export function conceptFor(kind: MarkKind, mode: 'day' | 'night'): string {
  return `buoyage:${mode}:${kind}`;
}
