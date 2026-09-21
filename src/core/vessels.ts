import type { VesselState } from './lights/model.ts';

/**
 * Every vessel the drills can show, covering Rules 23 to 30.
 *
 * This is also the distractor pool for both the night and the day generators,
 * so every wrong answer a student is offered is a real vessel from the Rules
 * rather than an invented one.
 *
 * Rule 31 is deliberately absent. It prescribes no configuration of its own —
 * a seaplane exhibits lights "as closely similar in characteristics and
 * position as is possible" to the rest of Part C — so there is nothing to draw
 * that would not be a guess. It is covered by a written question instead.
 */
export const VESSEL_POOL: readonly VesselState[] = [
  // Rule 23 — power-driven vessels underway
  { kind: 'power', lengthM: 28, makingWay: true },
  { kind: 'power', lengthM: 140, makingWay: true },
  // Rule 23(a)(ii) permits a vessel under 50 metres to show the second
  // masthead light she is not obliged to carry. She is in the pool so that
  // the drill cannot teach "two masthead lights, therefore 50 metres or more":
  // her picture is identical to the big ship's, and the generator will put
  // them in one answer.
  { kind: 'power', lengthM: 35, makingWay: true, secondMasthead: true },
  { kind: 'power-small', lengthM: 9, makingWay: true },
  { kind: 'power-tiny', lengthM: 5, makingWay: true },
  { kind: 'hovercraft', lengthM: 30, makingWay: true },
  { kind: 'wig', lengthM: 25, makingWay: true },

  // Rule 24 — towing and pushing
  { kind: 'towing', lengthM: 30, makingWay: true, towLengthM: 90 },
  { kind: 'towing', lengthM: 30, makingWay: true, towLengthM: 260 },
  { kind: 'pushing', lengthM: 40, makingWay: true },
  { kind: 'composite', lengthM: 45, makingWay: true },
  { kind: 'pushed-ahead', lengthM: 60, makingWay: true },
  { kind: 'towed-alongside', lengthM: 55, makingWay: true },
  { kind: 'towed', lengthM: 60, makingWay: true, towLengthM: 260 },
  { kind: 'submerged-tow', lengthM: 80, makingWay: true },

  // Rule 25 — sailing vessels and vessels under oars
  { kind: 'sailing', lengthM: 12, makingWay: true },
  { kind: 'sailing', lengthM: 11, makingWay: true, tricolour: true },
  { kind: 'sailing', lengthM: 15, makingWay: true, optionalRedGreen: true },
  { kind: 'motorsailing', lengthM: 14, makingWay: true },
  { kind: 'torch', lengthM: 6, makingWay: true },

  // Rule 26 — fishing vessels
  { kind: 'trawler', lengthM: 24, makingWay: true },
  { kind: 'trawler', lengthM: 24, makingWay: false },
  { kind: 'trawler', lengthM: 62, makingWay: true },
  { kind: 'fishing', lengthM: 18, makingWay: true },
  { kind: 'fishing', lengthM: 18, makingWay: false },
  { kind: 'fishing', lengthM: 18, makingWay: true, gearSide: 'starboard' },
  { kind: 'fishing', lengthM: 16, makingWay: false, basket: true },
  // Rule 26(d) and Annex II — the signals fishing vessels show each other.
  { kind: 'trawler', lengthM: 26, makingWay: true, annexII: 'shooting' },
  { kind: 'trawler', lengthM: 26, makingWay: true, annexII: 'hauling' },
  { kind: 'trawler', lengthM: 26, makingWay: false, annexII: 'net-fast' },
  { kind: 'fishing', lengthM: 22, makingWay: false, annexII: 'purse-seine' },

  // Rule 27 — not under command, restricted in ability to manoeuvre
  { kind: 'nuc', lengthM: 80, makingWay: false },
  { kind: 'nuc', lengthM: 80, makingWay: true },
  { kind: 'ram', lengthM: 70, makingWay: false },
  { kind: 'ram', lengthM: 70, makingWay: true },
  { kind: 'restricted-towing', lengthM: 60, makingWay: true, towLengthM: 250 },
  { kind: 'dredger', lengthM: 45, makingWay: true, obstructionSide: 'port' },
  { kind: 'dredger', lengthM: 45, makingWay: false, obstructionSide: 'starboard', atAnchor: true },
  { kind: 'diving', lengthM: 10, makingWay: false },
  { kind: 'mineclearance', lengthM: 55, makingWay: true },

  // Rules 28 to 30
  { kind: 'cbd', lengthM: 180, makingWay: true },
  { kind: 'pilot', lengthM: 20, makingWay: true },
  { kind: 'pilot', lengthM: 20, makingWay: false, atAnchor: true },
  { kind: 'anchored', lengthM: 30, makingWay: false },
  { kind: 'anchored', lengthM: 120, makingWay: false },
  { kind: 'anchored', lengthM: 150, makingWay: false, illuminatedDecks: true },
  { kind: 'aground', lengthM: 30, makingWay: false },
  { kind: 'aground', lengthM: 120, makingWay: false },
];
