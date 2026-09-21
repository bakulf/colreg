/**
 * Rule 37 and Annex IV — distress signals — and Rule 36, signals to attract
 * attention.
 *
 * Annex IV is a closed list. That is the whole point of it: paragraph 2
 * prohibits using any of these signals except to indicate distress, and
 * prohibits any other signal that could be confused with one. So the module
 * models the list, and separately models the things people believe are on it
 * and are not — because in an exam and at sea, knowing what a white flare is
 * *not* saying matters as much as knowing what a red one is.
 */

export type Channel = 'visual' | 'sound' | 'radio' | 'action';

export const CHANNEL_LABELS: Record<Channel, string> = {
  visual: 'seen',
  sound: 'heard',
  radio: 'received',
  action: 'seen, made by a person',
};

export interface DistressSignal {
  id: string;
  channel: Channel;
  /** What you would actually see, hear or receive. */
  observation: string;
  /** Sub-paragraph of Annex IV, section 1. */
  ref: string;
  note?: string;
  /** Drawn by the renderer, where there is something to draw. */
  visual?: 'flags-nc' | 'square-and-ball';
}

/**
 * Annex IV, section 1: the signals which indicate distress and need of
 * assistance. Fifteen of them, and the list is exhaustive.
 */
export const DISTRESS_SIGNALS: readonly DistressSignal[] = [
  {
    id: 'gun',
    channel: 'sound',
    observation: 'A gun or other explosive signal fired at intervals of about a minute',
    ref: 'Annex IV, 1(a)',
    note: 'The interval is part of the signal. A single shot, or several in quick succession, is not it.',
  },
  {
    id: 'continuous-fog',
    channel: 'sound',
    observation: 'A continuous sounding with any fog-signalling apparatus',
    ref: 'Annex IV, 1(b)',
    note: 'Continuous, not repeated. This is the one distress signal a small yacht can make with nothing but her horn, and it is widely forgotten.',
  },
  {
    id: 'red-stars',
    channel: 'visual',
    observation: 'Rockets or shells throwing red stars, fired one at a time at short intervals',
    ref: 'Annex IV, 1(c)',
  },
  {
    id: 'sos',
    channel: 'radio',
    observation: 'The group · · · — — — · · · (SOS) in Morse Code, by any signalling method',
    ref: 'Annex IV, 1(d)',
    note: 'By any method: radio, a lamp, a torch, a whistle, banging on the hull.',
  },
  {
    id: 'mayday',
    channel: 'radio',
    observation: 'The spoken word "Mayday" sent by radiotelephony',
    ref: 'Annex IV, 1(e)',
  },
  {
    id: 'nc',
    channel: 'visual',
    observation: 'The International Code Signal of distress, N over C',
    ref: 'Annex IV, 1(f)',
    visual: 'flags-nc',
    note: 'Two flags, November over Charlie. No other two-flag hoist means distress.',
  },
  {
    id: 'square-ball',
    channel: 'visual',
    observation:
      'A square flag with a ball, or anything resembling a ball, above or below it',
    ref: 'Annex IV, 1(g)',
    visual: 'square-and-ball',
    note: 'Above or below — the order does not matter, and the flag may be any colour. Improvised from a fender and a towel, it still counts.',
  },
  {
    id: 'flames',
    channel: 'visual',
    observation: 'Flames on the vessel, as from a burning tar barrel or oil barrel',
    ref: 'Annex IV, 1(h)',
  },
  {
    id: 'red-flare',
    channel: 'visual',
    observation: 'A rocket parachute flare or a hand flare showing a red light',
    ref: 'Annex IV, 1(i)',
    note: 'Red. The colour is the signal — see what a white flare means, which is something else entirely.',
  },
  {
    id: 'orange-smoke',
    channel: 'visual',
    observation: 'A smoke signal giving off orange-coloured smoke',
    ref: 'Annex IV, 1(j)',
  },
  {
    id: 'arms',
    channel: 'action',
    observation:
      'Slowly and repeatedly raising and lowering arms outstretched to each side',
    ref: 'Annex IV, 1(k)',
    note: 'Slowly, repeatedly, both arms, outstretched to each side. One arm waved is a greeting, and that is exactly how it will be read.',
  },
  {
    id: 'dsc',
    channel: 'radio',
    observation:
      'A distress alert by digital selective calling on VHF channel 70, or on the MF and HF distress frequencies',
    ref: 'Annex IV, 1(l)',
  },
  {
    id: 'satellite',
    channel: 'radio',
    observation:
      'A ship-to-shore distress alert sent by the ship\'s Inmarsat or other satellite ship earth station',
    ref: 'Annex IV, 1(m)',
  },
  {
    id: 'epirb',
    channel: 'radio',
    observation: 'Signals transmitted by emergency position-indicating radio beacons',
    ref: 'Annex IV, 1(n)',
  },
  {
    id: 'sart',
    channel: 'radio',
    observation:
      'Approved signals transmitted by radiocommunication systems, including survival craft radar transponders',
    ref: 'Annex IV, 1(o)',
  },
];

/**
 * Things a candidate will reach for that are not on the list.
 *
 * These are not invented: each is a real signal, or a real near-miss, that
 * people believe means distress. Annex IV, 2 prohibits using anything that
 * could be confused with a distress signal, which is precisely why the white
 * flare has to be understood as *not* one.
 */
export interface NotDistress {
  id: string;
  observation: string;
  /** What it actually means, or why it is not a distress signal. */
  truth: string;
}

export const NOT_DISTRESS: readonly NotDistress[] = [
  {
    id: 'white-flare',
    observation: 'A white flare',
    truth:
      'Not a distress signal, and not in Annex IV at all. It is used to draw attention and to say "I am here" — commonly by a fishing vessel warning a ship closing her. Treating a white flare as a call for help is the classic error; treating it as decoration is the dangerous one.',
  },
  {
    id: 'five-blasts',
    observation: 'Five or more short and rapid blasts on the whistle',
    truth:
      'Rule 34(d): I do not understand your intentions, or I doubt whether you are taking sufficient action to avoid collision. A warning between vessels in sight of one another, not distress.',
  },
  {
    id: 'three-short',
    observation: 'Three short blasts on the whistle',
    truth: 'Rule 34(a): I am operating astern propulsion.',
  },
  {
    id: 'two-red-lights',
    observation: 'Two all-round red lights in a vertical line',
    truth:
      'Rule 27(a): a vessel not under command. She has a problem and cannot manoeuvre, but she is not asking for assistance and this is not a distress signal.',
  },
  {
    id: 'one-arm',
    observation: 'Waving one arm above the head',
    truth:
      'Not the Annex IV signal. That one is both arms, outstretched to each side, raised and lowered slowly and repeatedly. One arm waved reads as a greeting.',
  },
  {
    id: 'green-star',
    observation: 'A rocket throwing green stars',
    truth:
      'Not in Annex IV. Annex IV names red stars; green is not a distress colour and in some waters signals something else entirely.',
  },
  {
    id: 'flag-o',
    observation: 'The International Code flag O flown alone',
    truth:
      'Man overboard in the International Code of Signals, but not one of the Annex IV distress signals. Only N over C is.',
  },
  {
    id: 'orange-canvas',
    observation: 'A piece of orange canvas with a black square and circle',
    truth:
      'A close call, and worth knowing exactly. It appears in Annex IV, 3 — the paragraph that draws attention to other signals — not in Annex IV, 1, the list of distress signals. It is an identification signal for search from the air.',
  },
  {
    id: 'dye',
    observation: 'A dye marker in the water',
    truth:
      'Like the orange canvas, this sits in Annex IV, 3 rather than in the list of distress signals in Annex IV, 1.',
  },
  {
    id: 'gun-once',
    observation: 'A single gunshot',
    truth:
      'Annex IV, 1(a) is a gun or other explosive signal fired at intervals of about a minute. The repetition and the interval are the signal; one shot is not.',
  },
  {
    id: 'searchlight',
    observation: 'A searchlight beam directed towards a danger',
    truth:
      'Rule 36: a signal to attract attention. Rule 36 requires that such a signal cannot be mistaken for any signal authorised elsewhere in the Rules, and that it does not embarrass any vessel.',
  },
  {
    id: 'anchor-ball',
    observation: 'A single black ball forward',
    truth: 'Rule 30(a): a vessel at anchor.',
  },
];

export function signalById(id: string): DistressSignal | undefined {
  return DISTRESS_SIGNALS.find((s) => s.id === id);
}

export function notDistressById(id: string): NotDistress | undefined {
  return NOT_DISTRESS.find((s) => s.id === id);
}
