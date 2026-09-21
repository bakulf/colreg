import type { Light, LightColour, VesselState } from './model.ts';
import { ARCS, arcContains, lightsFor } from './model.ts';

/**
 * Projecting a vessel's lights onto the observer's eye.
 *
 * `aspectDeg` is the observer's relative bearing from the vessel: 0 means the
 * observer lies dead ahead of her and sees her head-on, 180 means the observer
 * is dead astern of her and sees her going away.
 *
 * With the observer at a distance, the vessel's athwartships axis u and her
 * fore-and-aft axis v flatten onto one screen axis:
 *
 *     x = v·sin θ − u·cos θ,   y = w
 *
 * Head-on (θ = 0) that gives x = −u, so her port side falls on the observer's
 * right and the red light appears to the right — which is what you see. The
 * two masthead lights, both on the centreline, collapse to the same x, which
 * is Rule 14(b)'s "masthead lights in a line" emerging from the geometry
 * rather than being asserted.
 */

export interface ProjectedLight {
  colour: LightColour;
  /** Screen horizontal, right positive, in half-length units. */
  x: number;
  /** Screen vertical, up positive, in half-length units. */
  y: number;
  flashing?: boolean;
  dim?: boolean;
}

export function isVisible(light: Light, aspectDeg: number): boolean {
  return arcContains(ARCS[light.kind], aspectDeg);
}

export function project(light: Light, aspectDeg: number): ProjectedLight {
  const t = (aspectDeg * Math.PI) / 180;
  return {
    colour: light.colour,
    x: light.v * Math.sin(t) - light.u * Math.cos(t),
    y: light.w,
    flashing: light.flashing,
    dim: light.dim,
  };
}

export function projectScene(lights: readonly Light[], aspectDeg: number): ProjectedLight[] {
  return lights.filter((l) => isVisible(l, aspectDeg)).map((l) => project(l, aspectDeg));
}

export function visibleLights(vessel: VesselState, aspectDeg: number): ProjectedLight[] {
  return projectScene(lightsFor(vessel), aspectDeg);
}

/**
 * A fingerprint of what the observer actually sees.
 *
 * Two scenarios with the same signature produce the same picture, so the
 * generator uses this to guarantee that no distractor is indistinguishable
 * from the correct answer. Positions are rounded coarsely — about a tenth of
 * the vessel's half-length — because a difference finer than that is not
 * something anyone can read off a night scene.
 */
export function signature(vessel: VesselState, aspectDeg: number): string {
  return visibleLights(vessel, aspectDeg)
    .map((l) => `${l.colour}@${l.x.toFixed(1)},${l.y.toFixed(1)}`)
    .sort()
    .join('|');
}

/**
 * Which lights are lit, ignoring where the observer stands.
 *
 * Two vessels with the same key at the same aspect are showing literally the
 * same lights in the same places: no drawing, and no observer, could tell them
 * apart. Unlike `signature` this depends on the aspect only through visibility,
 * which is constant between cut-off bearings — so it can be computed once per
 * sector instead of once per bearing.
 */
export function visibleKey(vessel: VesselState, aspectDeg: number): string {
  return lightsFor(vessel)
    .filter((l) => isVisible(l, aspectDeg))
    .map((l) => `${l.colour}:${l.u}:${l.v}:${l.w}:${l.flashing ? 'f' : ''}${l.dim ? 'd' : ''}`)
    .sort()
    .join('|');
}

export type AspectSector =
  | 'ahead'
  | 'starboard-bow'
  | 'starboard-beam'
  | 'starboard-quarter'
  | 'astern'
  | 'port-quarter'
  | 'port-beam'
  | 'port-bow';

export function aspectSector(aspectDeg: number): AspectSector {
  const b = ((aspectDeg % 360) + 360) % 360;
  if (b < 5 || b >= 355) return 'ahead';
  if (b < 67.5) return 'starboard-bow';
  if (b < 112.5) return 'starboard-beam';
  if (b < 175) return 'starboard-quarter';
  if (b < 185) return 'astern';
  if (b < 247.5) return 'port-quarter';
  if (b < 292.5) return 'port-beam';
  return 'port-bow';
}

/** A caption for the view, so the student is not made to solve geometry first. */
export function aspectLabel(aspectDeg: number): string {
  switch (aspectSector(aspectDeg)) {
    case 'ahead':
      return 'End-on';
    case 'starboard-bow':
      return 'Her starboard bow';
    case 'starboard-beam':
      return 'Her starboard beam';
    case 'starboard-quarter':
      return 'Her starboard quarter';
    case 'astern':
      return 'Stern-on';
    case 'port-quarter':
      return 'Her port quarter';
    case 'port-beam':
      return 'Her port beam';
    case 'port-bow':
      return 'Her port bow';
  }
}

/** Where the observer is standing, in the words an instructor would use. */
export function describeAspect(aspectDeg: number): string {
  switch (aspectSector(aspectDeg)) {
    case 'ahead':
      return 'You are dead ahead of her: she is end-on to you';
    case 'starboard-bow':
      return 'You are on her starboard bow';
    case 'starboard-beam':
      return 'You are on her starboard beam';
    case 'starboard-quarter':
      return 'You are on her starboard quarter, abaft her beam';
    case 'astern':
      return 'You are dead astern of her';
    case 'port-quarter':
      return 'You are on her port quarter, abaft her beam';
    case 'port-beam':
      return 'You are on her port beam';
    case 'port-bow':
      return 'You are on her port bow';
  }
}
