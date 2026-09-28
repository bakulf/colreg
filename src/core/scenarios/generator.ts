import type { Question, QuestionSource, Rng, Topic } from '../types.ts';
import { shuffle } from '../rng.ts';
import type { Category, Scenario, Situation, Tack } from './model.ts';
import { CATEGORY_LABELS, classify, relativeBearing, resolve } from './model.ts';

/**
 * Encounter drills.
 *
 * The scenario is built, then classified by the same code the answer comes
 * from, then kept only if it classified as intended. So a drill labelled
 * "crossing, you give way" cannot contain a geometry that is really an
 * overtaking situation — the commonest way a hand-written question bank goes
 * quietly wrong.
 */

/** The answers on offer. Wrong ones are real mistakes, not nonsense. */
const OPTIONS = {
  'giveway-15':
    'Give way: alter substantially to starboard and pass under her stern — Rule 15',
  'giveway-15-port':
    'Give way: alter course to port and pass ahead of her — Rule 15',
  'standon-17': 'Stand on: hold your course and speed — Rule 17',
  'headon-14': 'Both alter course to starboard and pass port to port — Rule 14',
  'overtaking-13':
    'You are overtaking: keep well clear until finally past and clear — Rule 13',
  'overtaken-13': 'You are being overtaken: hold your course and speed — Rule 13',
  'giveway-18': 'Give way: she is higher in the order of precedence — Rule 18',
  'standon-18': 'Stand on: you are higher in the order of precedence — Rule 18',
  'giveway-12-port': 'Give way: you have the wind on your port side — Rule 12(a)(i)',
  'standon-12-stbd': 'Stand on: you have the wind on your starboard side — Rule 12(a)(i)',
  'giveway-12-windward': 'Give way: you are the windward vessel — Rule 12(a)(ii)',
  'standon-12-leeward': 'Stand on: you are the leeward vessel — Rule 12(a)(ii)',
  'notimpede-18d':
    'Neither give way nor stand on: avoid impeding her safe passage — Rule 18(d)',
  'cbd-own':
    'Navigate with particular caution: others must avoid impeding you, but this gives you no right of way — Rule 18(d)',
  'keepclear-18e':
    'Keep well clear of all vessels and avoid impeding their navigation — Rule 18(e)',
  'keepclear-18f':
    'Keep well clear of all other vessels and avoid impeding their navigation — Rule 18(f)',
  'notimpede-9':
    'Do not impede her: keep clear of the channel, or cross well clear, taking early action — Rule 9',
  'notimpede-10':
    'Do not impede her: keep clear of the lane, or cross at right angles to the traffic flow — Rule 10(j)',
  'standon-9':
    'Stand on: a vessel confined to the channel must keep out of your way — Rule 9',
  'rv-19': 'Neither of you stands on: take avoiding action in ample time — Rule 19',
  'rv-19-port': 'Alter course to port to open the range — Rule 19',
  'standon-sound': 'Stand on and sound five short and rapid blasts — Rule 34(d)',
} as const;

type OptionKey = keyof typeof OPTIONS;

/** Which option the geometry actually calls for. */
export function correctOption(s: Scenario): OptionKey {
  const v = resolve(s);
  switch (v.situation) {
    case 'restricted-visibility':
      return 'rv-19';
    case 'overtaking':
      return 'overtaking-13';
    case 'being-overtaken':
      return 'overtaken-13';
    case 'head-on':
      return 'headon-14';
    case 'sailing':
      if (v.rule === 'Rule 12(a)(i)') {
        return v.role === 'give-way' ? 'giveway-12-port' : 'standon-12-stbd';
      }
      return v.role === 'give-way' ? 'giveway-12-windward' : 'standon-12-leeward';
    case 'narrow-channel':
      return 'notimpede-9';
    case 'traffic-lane':
      return 'notimpede-10';
    case 'constrained-by-draught':
      return v.role === 'not-impede' ? 'notimpede-18d' : 'cbd-own';
    case 'seaplane-wig':
      if (v.role === 'stand-on') return 'standon-18';
      return v.rule === 'Rule 18(e)' ? 'keepclear-18e' : 'keepclear-18f';
    case 'precedence':
      return v.role === 'give-way' ? 'giveway-18' : 'standon-18';
    case 'crossing':
      return v.role === 'give-way' ? 'giveway-15' : 'standon-17';
  }
}

/** The mistakes worth putting in front of someone, per situation. */
const TRAPS: Record<Situation, OptionKey[]> = {
  crossing: ['giveway-15-port', 'standon-17', 'giveway-15', 'headon-14', 'standon-sound'],
  'head-on': ['giveway-15', 'standon-17', 'overtaking-13', 'giveway-15-port'],
  overtaking: ['giveway-15', 'standon-17', 'overtaken-13', 'headon-14'],
  'being-overtaken': ['giveway-15', 'overtaking-13', 'standon-17', 'giveway-18'],
  sailing: [
    'giveway-12-port',
    'standon-12-stbd',
    'giveway-12-windward',
    'standon-12-leeward',
    'giveway-15',
  ],
  precedence: ['giveway-18', 'standon-18', 'giveway-15', 'standon-17', 'notimpede-18d'],
  'constrained-by-draught': ['giveway-18', 'standon-17', 'giveway-15', 'standon-18', 'notimpede-18d', 'cbd-own'],
  'seaplane-wig': ['standon-18', 'giveway-15', 'standon-17', 'keepclear-18e', 'keepclear-18f', 'notimpede-18d'],
  'narrow-channel': ['giveway-15', 'standon-9', 'standon-17', 'notimpede-10', 'notimpede-18d'],
  'traffic-lane': ['giveway-15', 'notimpede-9', 'standon-17', 'headon-14'],
  'restricted-visibility': ['rv-19-port', 'standon-17', 'giveway-15', 'standon-sound'],
};

function optionsFor(s: Scenario, rng: Rng): OptionKey[] {
  const correct = correctOption(s);
  const situation = classify(s);
  const pool = TRAPS[situation].filter((k) => k !== correct);
  const extra = (Object.keys(OPTIONS) as OptionKey[]).filter(
    (k) => k !== correct && !pool.includes(k),
  );
  const wrong = [...shuffle(pool, rng), ...shuffle(extra, rng)].slice(0, 3);
  return [correct, ...wrong];
}

// --- building geometries that classify as intended ---------------------------

function pickRange(rng: Rng, lo: number, hi: number): number {
  return Math.round(lo + rng.next() * (hi - lo));
}

export interface ScenarioSpec {
  concept: string;
  /** The Part B Section whose rules decide it. */
  topic: Topic;
  label: string;
  build(rng: Rng): Scenario;
  expect(s: Scenario): boolean;
  /** Used if the random builder cannot hit the target; always valid. */
  fallback: Scenario;
}

const isRole = (s: Scenario, role: string) => resolve(s).role === role;

function pickCategory(rng: Rng, from: readonly Category[]): Category {
  return from[Math.floor(rng.next() * from.length)] as Category;
}

/**
 * Rule 13(a) applies "notwithstanding anything contained in the Rules of Part
 * B, Sections I and II", so a sailing or fishing vessel coming up from astern
 * keeps clear of a power-driven vessel. Mixing categories into the overtaking
 * drills is what tests that; sailing vessels carry no tack here, because the
 * geometry already decides it.
 */
const OVERTAKING_CATEGORIES: readonly Category[] = ['power', 'power', 'sailing', 'fishing'];

export const SPECS: readonly ScenarioSpec[] = [
  {
    concept: 'scenario:crossing-give-way',
    topic: 'colreg-b2',
    label: 'crossing, she is on your starboard side',
    build: (rng) => {
      const own = pickRange(rng, 0, 359);
      const rel = pickRange(rng, 20, 100);
      return {
        ownHeading: own,
        own: 'power',
        bearing: (own + rel) % 360,
        herHeading: (own + rel + 180 + pickRange(rng, -55, 55)) % 360,
        her: 'power',
        restrictedVisibility: false,
      };
    },
    expect: (s) => classify(s) === 'crossing' && isRole(s, 'give-way'),
    fallback: {
      ownHeading: 0,
      own: 'power',
      bearing: 50,
      herHeading: 240,
      her: 'power',
      restrictedVisibility: false,
    },
  },
  {
    concept: 'scenario:crossing-stand-on',
    topic: 'colreg-b2',
    label: 'crossing, she is on your port side',
    build: (rng) => {
      const own = pickRange(rng, 0, 359);
      const rel = pickRange(rng, 260, 340);
      return {
        ownHeading: own,
        own: 'power',
        bearing: (own + rel) % 360,
        herHeading: (own + rel + 180 + pickRange(rng, -55, 55)) % 360,
        her: 'power',
        restrictedVisibility: false,
      };
    },
    expect: (s) => classify(s) === 'crossing' && isRole(s, 'stand-on'),
    fallback: {
      ownHeading: 0,
      own: 'power',
      bearing: 310,
      herHeading: 140,
      her: 'power',
      restrictedVisibility: false,
    },
  },
  {
    concept: 'scenario:head-on',
    topic: 'colreg-b2',
    label: 'head-on',
    build: (rng) => {
      const own = pickRange(rng, 0, 359);
      const rel = rng.next() < 0.5 ? pickRange(rng, 0, 8) : pickRange(rng, 352, 359);
      return {
        ownHeading: own,
        own: 'power',
        bearing: (own + rel) % 360,
        herHeading: (own + 180 + pickRange(rng, -8, 8)) % 360,
        her: 'power',
        restrictedVisibility: false,
      };
    },
    expect: (s) => classify(s) === 'head-on',
    fallback: {
      ownHeading: 0,
      own: 'power',
      bearing: 2,
      herHeading: 181,
      her: 'power',
      restrictedVisibility: false,
    },
  },
  {
    concept: 'scenario:overtaking',
    topic: 'colreg-b2',
    label: 'you are overtaking her',
    build: (rng) => {
      const own = pickRange(rng, 0, 359);
      const rel = rng.next() < 0.5 ? pickRange(rng, 0, 20) : pickRange(rng, 340, 359);
      return {
        ownHeading: own,
        own: pickCategory(rng, OVERTAKING_CATEGORIES),
        bearing: (own + rel) % 360,
        herHeading: (own + pickRange(rng, -25, 25)) % 360,
        her: pickCategory(rng, OVERTAKING_CATEGORIES),
        restrictedVisibility: false,
      };
    },
    expect: (s) => classify(s) === 'overtaking',
    fallback: {
      ownHeading: 0,
      own: 'power',
      bearing: 5,
      herHeading: 10,
      her: 'power',
      restrictedVisibility: false,
    },
  },
  {
    concept: 'scenario:being-overtaken',
    topic: 'colreg-b2',
    label: 'she is overtaking you',
    build: (rng) => {
      const own = pickRange(rng, 0, 359);
      const rel = pickRange(rng, 150, 210);
      return {
        ownHeading: own,
        own: pickCategory(rng, OVERTAKING_CATEGORIES),
        bearing: (own + rel) % 360,
        herHeading: (own + pickRange(rng, -25, 25)) % 360,
        her: pickCategory(rng, OVERTAKING_CATEGORIES),
        restrictedVisibility: false,
      };
    },
    expect: (s) => classify(s) === 'being-overtaken',
    fallback: {
      ownHeading: 0,
      own: 'power',
      bearing: 185,
      herHeading: 5,
      her: 'power',
      restrictedVisibility: false,
    },
  },
  {
    concept: 'scenario:sailing-different-tacks',
    topic: 'colreg-b2',
    label: 'two sailing vessels on different tacks',
    build: (rng) => {
      const own = pickRange(rng, 0, 359);
      const rel = rng.next() < 0.5 ? pickRange(rng, 25, 105) : pickRange(rng, 255, 335);
      const ownTack: Tack = rng.next() < 0.5 ? 'port' : 'starboard';
      return {
        ownHeading: own,
        own: 'sailing',
        bearing: (own + rel) % 360,
        herHeading: (own + rel + 180 + pickRange(rng, -50, 50)) % 360,
        her: 'sailing',
        ownTack,
        herTack: ownTack === 'port' ? 'starboard' : 'port',
        restrictedVisibility: false,
      };
    },
    expect: (s) => classify(s) === 'sailing' && s.ownTack !== s.herTack,
    fallback: {
      ownHeading: 0,
      own: 'sailing',
      bearing: 60,
      herHeading: 250,
      her: 'sailing',
      ownTack: 'port',
      herTack: 'starboard',
      restrictedVisibility: false,
    },
  },
  {
    concept: 'scenario:sailing-same-tack',
    topic: 'colreg-b2',
    label: 'two sailing vessels on the same tack',
    build: (rng) => {
      const own = pickRange(rng, 0, 359);
      const rel = rng.next() < 0.5 ? pickRange(rng, 25, 105) : pickRange(rng, 255, 335);
      const tack: Tack = rng.next() < 0.5 ? 'port' : 'starboard';
      return {
        ownHeading: own,
        own: 'sailing',
        bearing: (own + rel) % 360,
        herHeading: (own + pickRange(rng, -40, 40)) % 360,
        her: 'sailing',
        ownTack: tack,
        herTack: tack,
        restrictedVisibility: false,
      };
    },
    expect: (s) => classify(s) === 'sailing' && s.ownTack === s.herTack,
    fallback: {
      ownHeading: 0,
      own: 'sailing',
      bearing: 60,
      herHeading: 20,
      her: 'sailing',
      ownTack: 'starboard',
      herTack: 'starboard',
      restrictedVisibility: false,
    },
  },
  {
    concept: 'scenario:precedence-give-way',
    topic: 'colreg-b2',
    label: 'she is higher in the Rule 18 order',
    build: (rng) => {
      const own = pickRange(rng, 0, 359);
      const rel = pickRange(rng, 25, 335);
      const pairs: Array<[Category, Category]> = [
        ['power', 'sailing'],
        ['power', 'fishing'],
        ['power', 'ram'],
        ['power', 'nuc'],
        ['sailing', 'fishing'],
        ['sailing', 'nuc'],
        ['sailing', 'ram'],
        ['fishing', 'ram'],
        ['fishing', 'nuc'],
        ['cbd', 'nuc'],
        ['cbd', 'ram'],
      ];
      const [own_, her] = pairs[Math.floor(rng.next() * pairs.length)] as [Category, Category];
      return {
        ownHeading: own,
        own: own_,
        bearing: (own + rel) % 360,
        herHeading: (own + rel + 180 + pickRange(rng, -60, 60)) % 360,
        her,
        restrictedVisibility: false,
      };
    },
    expect: (s) => classify(s) === 'precedence' && isRole(s, 'give-way'),
    fallback: {
      ownHeading: 0,
      own: 'power',
      bearing: 300,
      herHeading: 120,
      her: 'fishing',
      restrictedVisibility: false,
    },
  },
  {
    concept: 'scenario:precedence-stand-on',
    topic: 'colreg-b2',
    label: 'you are higher in the Rule 18 order',
    build: (rng) => {
      const own = pickRange(rng, 0, 359);
      const rel = pickRange(rng, 25, 335);
      const pairs: Array<[Category, Category]> = [
        ['sailing', 'power'],
        ['fishing', 'power'],
        ['ram', 'power'],
        ['nuc', 'power'],
        ['fishing', 'sailing'],
        ['ram', 'fishing'],
        ['nuc', 'fishing'],
        ['nuc', 'sailing'],
        ['ram', 'sailing'],
        ['nuc', 'cbd'],
      ];
      const [own_, her] = pairs[Math.floor(rng.next() * pairs.length)] as [Category, Category];
      return {
        ownHeading: own,
        own: own_,
        bearing: (own + rel) % 360,
        herHeading: (own + rel + 180 + pickRange(rng, -60, 60)) % 360,
        her,
        restrictedVisibility: false,
      };
    },
    expect: (s) => classify(s) === 'precedence' && isRole(s, 'stand-on'),
    fallback: {
      ownHeading: 0,
      own: 'fishing',
      bearing: 60,
      herHeading: 240,
      her: 'power',
      restrictedVisibility: false,
    },
  },
  {
    concept: 'scenario:cbd-not-impede',
    topic: 'colreg-b2',
    label: 'a vessel constrained by her draught',
    build: (rng) => {
      const own = pickRange(rng, 0, 359);
      const rel = pickRange(rng, 25, 335);
      return {
        ownHeading: own,
        own: pickCategory(rng, ['power', 'sailing', 'fishing']),
        bearing: (own + rel) % 360,
        herHeading: (own + rel + 180 + pickRange(rng, -60, 60)) % 360,
        her: 'cbd',
        restrictedVisibility: false,
      };
    },
    expect: (s) => resolve(s).role === 'not-impede',
    fallback: {
      ownHeading: 0,
      own: 'power',
      bearing: 300,
      herHeading: 120,
      her: 'cbd',
      restrictedVisibility: false,
    },
  },
  {
    concept: 'scenario:cbd-own',
    topic: 'colreg-b2',
    label: 'you are constrained by your draught',
    build: (rng) => {
      const own = pickRange(rng, 0, 359);
      const rel = pickRange(rng, 25, 335);
      return {
        ownHeading: own,
        own: 'cbd',
        bearing: (own + rel) % 360,
        herHeading: (own + rel + 180 + pickRange(rng, -60, 60)) % 360,
        her: pickCategory(rng, ['power', 'sailing', 'fishing']),
        restrictedVisibility: false,
      };
    },
    expect: (s) => classify(s) === 'constrained-by-draught' && s.own === 'cbd',
    fallback: {
      ownHeading: 0,
      own: 'cbd',
      bearing: 60,
      herHeading: 240,
      her: 'sailing',
      restrictedVisibility: false,
    },
  },
  {
    concept: 'scenario:seaplane',
    topic: 'colreg-b2',
    label: 'you are a seaplane on the water',
    build: (rng) => {
      const own = pickRange(rng, 0, 359);
      const rel = pickRange(rng, 25, 335);
      return {
        ownHeading: own,
        own: 'seaplane',
        bearing: (own + rel) % 360,
        herHeading: (own + rel + 180 + pickRange(rng, -60, 60)) % 360,
        her: pickCategory(rng, ['power', 'sailing', 'fishing']),
        restrictedVisibility: false,
      };
    },
    expect: (s) => classify(s) === 'seaplane-wig',
    fallback: {
      ownHeading: 0,
      own: 'seaplane',
      bearing: 300,
      herHeading: 120,
      her: 'power',
      restrictedVisibility: false,
    },
  },
  {
    concept: 'scenario:wig',
    topic: 'colreg-b2',
    label: 'you are a WIG craft in flight near the surface',
    build: (rng) => {
      const own = pickRange(rng, 0, 359);
      const rel = pickRange(rng, 25, 335);
      return {
        ownHeading: own,
        own: 'wig',
        bearing: (own + rel) % 360,
        herHeading: (own + rel + 180 + pickRange(rng, -60, 60)) % 360,
        her: pickCategory(rng, ['power', 'sailing', 'fishing']),
        restrictedVisibility: false,
      };
    },
    expect: (s) => classify(s) === 'seaplane-wig',
    fallback: {
      ownHeading: 0,
      own: 'wig',
      bearing: 60,
      herHeading: 240,
      her: 'power',
      restrictedVisibility: false,
    },
  },
  {
    concept: 'scenario:narrow-channel',
    topic: 'colreg-b1',
    label: 'a narrow channel',
    build: (rng) => {
      const own = pickRange(rng, 0, 359);
      const rel = pickRange(rng, 25, 335);
      const crossing = rng.next() < 0.5;
      const cls = pickRange(rng, 0, 2);
      return {
        ownHeading: own,
        own: cls === 0 ? 'sailing' : cls === 1 ? 'fishing' : 'power',
        ownLengthM: cls === 2 ? 14 : 30,
        bearing: (own + rel) % 360,
        herHeading: (own + rel + 180 + pickRange(rng, -50, 50)) % 360,
        her: 'power',
        setting: 'narrow-channel',
        sheIsConfined: true,
        youAreCrossing: crossing,
        restrictedVisibility: false,
      };
    },
    expect: (s) => classify(s) === 'narrow-channel',
    fallback: {
      ownHeading: 0,
      own: 'sailing',
      ownLengthM: 30,
      bearing: 300,
      herHeading: 120,
      her: 'power',
      setting: 'narrow-channel',
      sheIsConfined: true,
      restrictedVisibility: false,
    },
  },
  {
    concept: 'scenario:traffic-lane',
    topic: 'colreg-b1',
    label: 'a traffic separation scheme',
    build: (rng) => {
      const own = pickRange(rng, 0, 359);
      const rel = pickRange(rng, 25, 335);
      const cls = pickRange(rng, 0, 2);
      return {
        ownHeading: own,
        own: cls === 0 ? 'sailing' : cls === 1 ? 'fishing' : 'power',
        ownLengthM: cls === 2 ? 14 : 30,
        bearing: (own + rel) % 360,
        herHeading: (own + rel + 180 + pickRange(rng, -50, 50)) % 360,
        her: 'power',
        setting: 'traffic-lane',
        sheIsConfined: true,
        youAreCrossing: true,
        restrictedVisibility: false,
      };
    },
    expect: (s) => classify(s) === 'traffic-lane',
    fallback: {
      ownHeading: 0,
      own: 'sailing',
      ownLengthM: 30,
      bearing: 300,
      herHeading: 120,
      her: 'power',
      setting: 'traffic-lane',
      sheIsConfined: true,
      youAreCrossing: true,
      restrictedVisibility: false,
    },
  },
  {
    concept: 'scenario:restricted-visibility',
    topic: 'colreg-b3',
    label: 'a radar contact in fog',
    build: (rng) => {
      const own = pickRange(rng, 0, 359);
      const rel = pickRange(rng, 0, 359);
      return {
        ownHeading: own,
        own: 'power',
        bearing: (own + rel) % 360,
        herHeading: pickRange(rng, 0, 359),
        her: 'power',
        restrictedVisibility: true,
      };
    },
    expect: (s) => classify(s) === 'restricted-visibility',
    fallback: {
      ownHeading: 0,
      own: 'power',
      bearing: 40,
      herHeading: 200,
      her: 'power',
      restrictedVisibility: true,
    },
  },
];

function buildMatching(spec: ScenarioSpec, rng: Rng): Scenario {
  for (let attempt = 0; attempt < 200; attempt++) {
    const candidate = spec.build(rng);
    if (spec.expect(candidate)) return candidate;
  }
  return spec.fallback;
}

export interface ScenarioDrill {
  question: Question;
  scenario: Scenario;
}

function describeSelf(s: Scenario): string {
  if (s.own === 'sailing' && s.ownTack) {
    return `You are ${CATEGORY_LABELS[s.own]} with the wind on your ${s.ownTack} side`;
  }
  const size = s.ownLengthM !== undefined ? ` of ${s.ownLengthM} metres` : '';
  return `You are ${CATEGORY_LABELS[s.own]}${size}`;
}

function describeSetting(s: Scenario): string {
  switch (s.setting) {
    case 'narrow-channel':
      return s.youAreCrossing
        ? ' You are crossing a narrow channel; she can safely navigate only within it.'
        : ' You are in a narrow channel; she can safely navigate only within it.';
    case 'traffic-lane':
      return ' You are crossing a traffic lane; she is a power-driven vessel following it.';
    default:
      return '';
  }
}

function describeHer(s: Scenario): string {
  if (s.restrictedVisibility) {
    return 'You have a radar contact and cannot see her';
  }
  if (s.her === 'sailing' && s.herTack) {
    return `She is ${CATEGORY_LABELS[s.her]} with the wind on her ${s.herTack} side`;
  }
  return `She is ${CATEGORY_LABELS[s.her]}`;
}

export function composeScenarioDrill(spec: ScenarioSpec, rng: Rng): ScenarioDrill {
  const scenario = buildMatching(spec, rng);
  const verdict = resolve(scenario);
  const keys = optionsFor(scenario, rng);
  const rel = Math.round(relativeBearing(scenario));

  const question: Question = {
    id: `scn-gen-${spec.concept}-${scenario.ownHeading}-${scenario.bearing}`,
    topic: spec.topic,
    concept: spec.concept,
    prompt: `${describeSelf(scenario)}.${describeSetting(scenario)} ${describeHer(scenario)}, bearing ${String(rel).padStart(3, '0')}° relative, and the bearing is steady. What do you do?`,
    choices: keys.map((k, i) => ({ id: String.fromCharCode(97 + i), text: OPTIONS[k] })),
    correct: 'a',
    ruleRefs: [verdict.rule],
    explanation: `${verdict.reasoning} ${verdict.action}`,
    difficulty: 3,
    scene: { type: 'scenario', scenario },
  };

  return { question, scenario };
}

export function scenarioSources(): QuestionSource[] {
  return SPECS.map((spec) => ({
    id: `gen-${spec.concept}`,
    topic: spec.topic,
    concept: spec.concept,
    difficulty: 3 as const,
    generated: true,
    generate: (rng: Rng) => composeScenarioDrill(spec, rng).question,
  }));
}
