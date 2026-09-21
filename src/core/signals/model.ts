/**
 * Sound signals, Rules 34 and 35.
 *
 * A signal is a sequence of blasts with real durations, so it can be shown as
 * a timeline and, later, played. Rule 32 fixes the lengths: a short blast is
 * about one second, a prolonged blast from four to six seconds. Those numbers
 * are the content — a two-second toot is heard as a short blast, which in a
 * manoeuvring signal means something entirely different — so they are modelled
 * rather than described.
 */

export type BlastKind = 'short' | 'prolonged' | 'bell' | 'gong';

export interface Blast {
  kind: BlastKind;
  ms: number;
}

export const SHORT_MS = 1000;
/** Rule 32(c) allows four to six seconds; five is the middle of the range. */
export const PROLONGED_MS = 5000;
/** Rule 32(b): the gap between blasts of a group, about a second. */
export const GAP_MS = 1000;

export function short(n = 1): Blast[] {
  return Array.from({ length: n }, () => ({ kind: 'short' as const, ms: SHORT_MS }));
}

export function prolonged(n = 1): Blast[] {
  return Array.from({ length: n }, () => ({ kind: 'prolonged' as const, ms: PROLONGED_MS }));
}

export type SignalContext = 'manoeuvring' | 'restricted-visibility';

export interface Signal {
  id: string;
  context: SignalContext;
  blasts: Blast[];
  /** What it means, as the answer to a drill. */
  meaning: string;
  /** How it is written down, e.g. "one prolonged, two short". */
  notation: string;
  /** How often it is repeated, where the Rules say. */
  interval?: string;
  ruleRefs: string[];
  teachingNote?: string;
  /** Other signals that mean something different but sound the same. */
  ambiguity?: string;
}

/**
 * Rule 34 — manoeuvring and warning signals, between vessels in sight of one
 * another.
 */
export const MANOEUVRING: Signal[] = [
  {
    id: 'snd-one-short',
    context: 'manoeuvring',
    blasts: short(1),
    notation: 'one short blast',
    meaning: 'I am altering my course to starboard',
    ruleRefs: ['Rule 34(a)'],
    teachingNote:
      'These signals state what you are doing, not what you intend to do. The rule says "when manoeuvring as authorized or required by these Rules" — you sound them as you act.',
  },
  {
    id: 'snd-two-short',
    context: 'manoeuvring',
    blasts: short(2),
    notation: 'two short blasts',
    meaning: 'I am altering my course to port',
    ruleRefs: ['Rule 34(a)'],
  },
  {
    id: 'snd-three-short',
    context: 'manoeuvring',
    blasts: short(3),
    notation: 'three short blasts',
    meaning: 'I am operating astern propulsion',
    ruleRefs: ['Rule 34(a)'],
    teachingNote:
      'About the engines, not about movement. A large vessel sounding three short blasts may still be making several knots ahead; she has put the engines astern and will carry her way for a long time yet. Hearing this and assuming she is backing away from you is a good way to be run down.',
  },
  {
    id: 'snd-five-short',
    context: 'manoeuvring',
    blasts: short(5),
    notation: 'at least five short and rapid blasts',
    meaning:
      'I do not understand your intentions or actions, or I doubt whether you are taking sufficient action to avoid collision',
    ruleRefs: ['Rule 34(d)'],
    teachingNote:
      'Mandatory, not an expression of irritation: the rule says "shall". And "at least" five — five is the minimum, not the number. It may be supplemented by five or more short and rapid flashes.',
  },
  {
    id: 'snd-bend',
    context: 'manoeuvring',
    blasts: prolonged(1),
    notation: 'one prolonged blast',
    meaning:
      'I am approaching a bend or an obstruction where other vessels may be obscured',
    ruleRefs: ['Rule 34(e)'],
    teachingNote:
      'The answering signal is part of the rule: any vessel within hearing round the bend replies with one prolonged blast.',
    ambiguity:
      'In restricted visibility the identical signal — one prolonged blast every two minutes — means a power-driven vessel making way through the water. Which one you are hearing depends on whether you can see her, which is exactly the distinction Rule 11 and Rule 19 turn on.',
  },
  {
    id: 'snd-overtake-stbd',
    context: 'manoeuvring',
    blasts: [...prolonged(2), ...short(1)],
    notation: 'two prolonged blasts followed by one short blast',
    meaning: 'I intend to overtake you on your starboard side',
    ruleRefs: ['Rule 34(c)(i)', 'Rule 9(e)'],
    teachingNote:
      'The short blasts follow the ordinary convention — one for starboard, two for port — so only the two prolonged blasts as a prefix need remembering.',
  },
  {
    id: 'snd-overtake-port',
    context: 'manoeuvring',
    blasts: [...prolonged(2), ...short(2)],
    notation: 'two prolonged blasts followed by two short blasts',
    meaning: 'I intend to overtake you on your port side',
    ruleRefs: ['Rule 34(c)(i)', 'Rule 9(e)'],
  },
  {
    id: 'snd-overtake-agree',
    context: 'manoeuvring',
    blasts: [...prolonged(1), ...short(1), ...prolonged(1), ...short(1)],
    notation: 'one prolonged, one short, one prolonged, one short',
    meaning: 'I agree: you may overtake as you propose',
    ruleRefs: ['Rule 34(c)(ii)'],
    teachingNote:
      'Only the vessel being overtaken sounds this, and only in a narrow channel or fairway. Silence is not agreement.',
  },
];

/** Rule 35 — signals in or near an area of restricted visibility. */
export const FOG: Signal[] = [
  {
    id: 'snd-rv-making-way',
    context: 'restricted-visibility',
    blasts: prolonged(1),
    notation: 'one prolonged blast',
    interval: 'at intervals of not more than two minutes',
    meaning: 'A power-driven vessel making way through the water',
    ruleRefs: ['Rule 35(a)'],
    ambiguity:
      'The same single prolonged blast is the Rule 34(e) signal for approaching a blind bend. In sight of one another it means the bend; out of sight it means a power-driven vessel making way.',
  },
  {
    id: 'snd-rv-stopped',
    context: 'restricted-visibility',
    blasts: prolonged(2),
    notation: 'two prolonged blasts',
    interval: 'at intervals of not more than two minutes',
    meaning: 'A power-driven vessel underway but stopped and making no way through the water',
    ruleRefs: ['Rule 35(b)'],
    teachingNote:
      'This is where the underway and making way distinction pays off. One prolonged, she is moving; two, she is stopped but not anchored — and she may start moving at any moment.',
  },
  {
    id: 'snd-rv-restricted',
    context: 'restricted-visibility',
    blasts: [...prolonged(1), ...short(2)],
    notation: 'one prolonged blast followed by two short blasts',
    interval: 'at intervals of not more than two minutes',
    meaning:
      'A vessel not under command, restricted in her ability to manoeuvre, constrained by her draught, sailing, engaged in fishing, or towing or pushing',
    ruleRefs: ['Rule 35(c)'],
    teachingNote:
      'Six categories share this one signal, so it tells you she is one of them and nothing more. It does not make her a stand-on vessel or you a give-way vessel: out of sight of one another there is no such relationship, and Rule 19 governs what you both do.',
  },
  {
    id: 'snd-rv-towed',
    context: 'restricted-visibility',
    blasts: [...prolonged(1), ...short(3)],
    notation: 'one prolonged blast followed by three short blasts',
    interval: 'at intervals of not more than two minutes',
    meaning: 'A manned vessel being towed, or the last vessel of a tow if more than one is manned',
    ruleRefs: ['Rule 35(e)'],
    teachingNote:
      'Sounded immediately after the towing vessel\'s signal where practicable. Hearing the pair — one long two short, then one long three short — tells you there is a tow and roughly how far the far end is. That is genuinely useful in fog.',
  },
  {
    id: 'snd-rv-anchored',
    context: 'restricted-visibility',
    blasts: [{ kind: 'bell', ms: 5000 }],
    notation: 'rapid ringing of the bell for about five seconds',
    interval: 'at intervals of not more than one minute',
    meaning: 'A vessel at anchor',
    ruleRefs: ['Rule 35(g)'],
    teachingNote:
      'One minute, not two. Most of Rule 35 is on a two-minute cycle, which is exactly why this one is asked. At 100 metres and over the bell is sounded forward and a gong aft.',
  },
  {
    id: 'snd-rv-anchored-warning',
    context: 'restricted-visibility',
    blasts: [...short(1), ...prolonged(1), ...short(1)],
    notation: 'one short, one prolonged, one short',
    meaning:
      'A vessel at anchor, warning an approaching vessel of her position and of the possibility of collision',
    ruleRefs: ['Rule 35(g)'],
    teachingNote:
      'Optional — the rule says "may" — and sounded in addition to the bell, not instead of it.',
  },
  {
    id: 'snd-rv-aground',
    context: 'restricted-visibility',
    blasts: [
      { kind: 'bell', ms: 1200 },
      { kind: 'bell', ms: 5000 },
      { kind: 'bell', ms: 1200 },
    ],
    notation:
      'three distinct strokes of the bell, then rapid ringing, then three distinct strokes',
    interval: 'at intervals of not more than one minute',
    meaning: 'A vessel aground',
    ruleRefs: ['Rule 35(h)'],
    teachingNote:
      'The anchor signal with three distinct strokes wrapped round it. She may in addition sound an appropriate whistle signal.',
  },
  {
    id: 'snd-rv-pilot',
    context: 'restricted-visibility',
    blasts: short(4),
    notation: 'four short blasts',
    meaning: 'A pilot vessel on pilotage duty, sounding her identity signal',
    ruleRefs: ['Rule 35(j)'],
    teachingNote:
      'Sounded in addition to the signal her category requires, not instead of it. Four short blasts mean nothing else in the Rules.',
  },
];

export const ALL_SIGNALS: readonly Signal[] = [...MANOEUVRING, ...FOG];

export function signalById(id: string): Signal | undefined {
  return ALL_SIGNALS.find((s) => s.id === id);
}

/** Total length of one cycle of the signal, gaps included. */
export function durationMs(signal: Signal): number {
  return signal.blasts.reduce((n, b) => n + b.ms, 0) + GAP_MS * (signal.blasts.length - 1);
}

/** Signals that sound identical, whatever they mean. */
export function sameSound(a: Signal, b: Signal): boolean {
  if (a.blasts.length !== b.blasts.length) return false;
  return a.blasts.every((blast, i) => blast.kind === b.blasts[i]?.kind);
}
