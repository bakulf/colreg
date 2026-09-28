/**
 * Tidal streams: reading them, and allowing for them.
 *
 * Everything is plane vector arithmetic on a small patch of sea, north up, x
 * east and y north, distances in nautical miles and speeds in knots. That is
 * exactly what the chartwork does with a plotter; here the app does it, and
 * the student reasons about it.
 *
 * Streams are always given by their set — the direction they flow *towards* —
 * unlike wind, which is named for where it comes from.
 */

export type Vec = [number, number];

export function norm360(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

export function fromPolar(dirDeg: number, length: number): Vec {
  const a = (dirDeg * Math.PI) / 180;
  return [length * Math.sin(a), length * Math.cos(a)];
}

export function add(a: Vec, b: Vec): Vec {
  return [a[0] + b[0], a[1] + b[1]];
}

export function scale(a: Vec, k: number): Vec {
  return [a[0] * k, a[1] * k];
}

export function length(a: Vec): number {
  return Math.hypot(a[0], a[1]);
}

export function direction(a: Vec): number {
  return norm360((Math.atan2(a[0], a[1]) * 180) / Math.PI);
}

/** b − a the short way round, in −180..180. */
export function turn(a: number, b: number): number {
  return ((b - a + 540) % 360) - 180;
}

export function bearing(deg: number): string {
  return `${String(Math.round(norm360(deg)) % 360).padStart(3, '0')}°`;
}

// --- the tidal diamond -------------------------------------------------------

/** One hour's stream at a diamond. */
export interface StreamHour {
  /** Hours from HW at the standard port, −6 … +6. */
  hour: number;
  set: number;
  spring: number;
  neap: number;
}

export interface Diamond {
  letter: string;
  standardPort: string;
  hours: StreamHour[];
}

/**
 * A plausible diamond: a stream running one way for about six hours and back
 * the other way for the next six, strongest in the middle of each and slack
 * near the turn. Neap rates are about half the springs, as the ratio of the
 * ranges usually makes them. Rates are to a tenth of a knot, sets to a degree,
 * as a chart's table gives them.
 */
export function makeDiamond(
  letter: string,
  standardPort: string,
  floodSet: number,
  maxSpring: number,
  turnHour: number,
): Diamond {
  const hours: StreamHour[] = [];
  for (let h = -6; h <= 6; h++) {
    // Phase so that the stream turns at `turnHour` and again six hours on.
    const phase = ((h - turnHour) / 6) * Math.PI;
    const s = Math.sin(phase);
    const set = norm360(s >= 0 ? floodSet : floodSet + 180);
    const spring = Math.round(Math.abs(s) * maxSpring * 10) / 10;
    const neap = Math.round(spring * 0.5 * 10) / 10;
    hours.push({ hour: h, set: norm360(Math.round(set + Math.sin(h) * 4)), spring, neap });
  }
  return { letter, standardPort, hours };
}

/**
 * Which row of the table applies at a time, in minutes from HW: the row for
 * "HW −3" covers from 3½ to 2½ hours before HW, and so on.
 */
export function rowFor(minutesFromHw: number): number {
  const h = Math.round(minutesFromHw / 60);
  return Math.max(-6, Math.min(6, h));
}

export interface Ranges {
  /** Mean spring and neap ranges at the standard port, metres. */
  meanSpring: number;
  meanNeap: number;
  /** Today's range there. */
  today: number;
}

/**
 * The rate for today, interpolated between neaps and springs by today's range
 * against the mean ranges — the method of the almanac's computation of rates
 * diagram. Outside the mean ranges it extrapolates, as the diagram does.
 */
export function rateFor(hour: StreamHour, r: Ranges): number {
  const f = (r.today - r.meanNeap) / (r.meanSpring - r.meanNeap);
  return hour.neap + (hour.spring - hour.neap) * f;
}

// --- course to steer ---------------------------------------------------------

export interface CourseToSteer {
  /** Direction of the water track to steer for, °T, before leeway. */
  waterTrack: number;
  /** Speed made good along the ground track, knots. */
  sog: number;
  /** Cross-track component of the stream, positive to starboard of the track. */
  cross: number;
  /** Along-track component, positive towards the waypoint. */
  along: number;
}

/**
 * The course through the water that, with the stream, keeps you on the ground
 * track: the vector triangle. Undefined if the stream is too strong across the
 * track for the boat's speed to hold it.
 */
export function courseToSteer(track: number, speed: number, stream: Vec): CourseToSteer | undefined {
  const u = fromPolar(track, 1);
  const right = fromPolar(track + 90, 1);
  const along = stream[0] * u[0] + stream[1] * u[1];
  const cross = stream[0] * right[0] + stream[1] * right[1];
  if (Math.abs(cross) >= speed) return undefined;
  const angle = (Math.asin(cross / speed) * 180) / Math.PI;
  const waterTrack = norm360(track - angle);
  const sog = speed * Math.cos((angle * Math.PI) / 180) + along;
  return { waterTrack, sog, cross, along };
}

/**
 * The one-in-sixty rule: an offset of one mile in sixty is about one degree,
 * so a stream of c knots across a boat making s knots needs about 60·c/s
 * degrees of correction. Good to within a degree or two up to about 20°.
 */
export function oneInSixty(cross: number, speed: number): number {
  return (60 * cross) / speed;
}

/**
 * Leeway pushes the boat downwind of her heading. To make good a water track,
 * steer that many degrees into the wind: with the wind on the port side the
 * boat is pushed to starboard, so steer to port of the track, and vice versa.
 */
export function headingForWaterTrack(
  waterTrack: number,
  leeway: number,
  windSide: 'port' | 'starboard',
): number {
  return norm360(windSide === 'port' ? waterTrack - leeway : waterTrack + leeway);
}

/** The water track a heading produces with leeway. */
export function waterTrackForHeading(
  heading: number,
  leeway: number,
  windSide: 'port' | 'starboard',
): number {
  return norm360(windSide === 'port' ? heading + leeway : heading - leeway);
}

// --- estimated position ------------------------------------------------------

/**
 * Where you are after an hour, from where you were: along the water track for
 * the distance run through the water, then the stream's set and drift for the
 * hour.
 */
export function estimatedPosition(
  heading: number,
  logDistance: number,
  leeway: number,
  windSide: 'port' | 'starboard',
  stream: Vec,
): { waterEnd: Vec; ep: Vec; waterTrack: number } {
  const waterTrack = waterTrackForHeading(heading, leeway, windSide);
  const waterEnd = fromPolar(waterTrack, logDistance);
  return { waterEnd, ep: add(waterEnd, stream), waterTrack };
}

// --- diagrams ----------------------------------------------------------------

export type Leg = 'water' | 'ground' | 'tide';

export interface Segment {
  from: Vec;
  to: Vec;
  /** Conventional arrows: one for the water track, two ground, three tide. */
  kind: Leg;
}

export interface TriangleDiagram {
  segments: Segment[];
  start: Vec;
  /** The waypoint being steered for, when there is one. */
  waypoint?: Vec;
  /** An estimated position, drawn as a triangle. */
  ep?: Vec;
  /** A ground track line to draw beyond the segments, for the CTS. */
  trackTo?: Vec;
}

/**
 * The course-to-steer construction for one hour: ground track to the
 * waypoint; from the start, the hour's stream; from its end, the boat's speed
 * swung to meet the track; that line is the water track to steer.
 */
export function ctsDiagram(track: number, distance: number, speed: number, stream: Vec): TriangleDiagram {
  const cts = courseToSteer(track, speed, stream);
  const start: Vec = [0, 0];
  const waypoint = fromPolar(track, distance);
  if (!cts) return { segments: [], start, waypoint };
  const meet = fromPolar(track, cts.sog);
  return {
    start,
    waypoint,
    trackTo: waypoint,
    segments: [
      { from: start, to: meet, kind: 'ground' },
      { from: start, to: stream, kind: 'tide' },
      { from: stream, to: meet, kind: 'water' },
    ],
  };
}

/** The same triangle with the stream laid the wrong way. */
export function ctsReversedTide(track: number, distance: number, speed: number, stream: Vec): TriangleDiagram {
  return ctsDiagram(track, distance, speed, scale(stream, -1));
}

/**
 * Joining the end of the stream vector straight to the waypoint — right only
 * if the passage takes exactly the hour the stream was laid for.
 */
export function ctsToWaypoint(track: number, distance: number, stream: Vec): TriangleDiagram {
  const start: Vec = [0, 0];
  const waypoint = fromPolar(track, distance);
  return {
    start,
    waypoint,
    trackTo: waypoint,
    segments: [
      { from: start, to: waypoint, kind: 'ground' },
      { from: start, to: stream, kind: 'tide' },
      { from: stream, to: waypoint, kind: 'water' },
    ],
  };
}

/** The estimated-position construction: water track first, stream at its end. */
export function epDiagram(waterTrack: number, distance: number, stream: Vec, waypoint?: Vec): TriangleDiagram {
  const start: Vec = [0, 0];
  const waterEnd = fromPolar(waterTrack, distance);
  const ep = add(waterEnd, stream);
  return {
    start,
    waypoint,
    ep,
    segments: [
      { from: start, to: waterEnd, kind: 'water' },
      { from: waterEnd, to: ep, kind: 'tide' },
      { from: start, to: ep, kind: 'ground' },
    ],
  };
}
