import type { Question, QuestionSource, Rng } from '../types.ts';
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
      return v.role === 'not-impede' ? 'notimpede-18d' : 'standon-18';
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
  'constrained-by-draught': ['giveway-18', 'standon-17', 'giveway-15', 'standon-18'],
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
  label: string;
  build(rng: Rng): Scenario;
  expect(s: Scenario): boolean;
  /** Used if the random builder cannot hit the target; always valid. */
  fallback: Scenario;
}

const isRole = (s: Scenario, role: string) => resolve(s).role === role;

export const SPECS: readonly ScenarioSpec[] = [
  {
    concept: 'scenario:crossing-give-way',
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
    label: 'you are overtaking her',
    build: (rng) => {
      const own = pickRange(rng, 0, 359);
      const rel = rng.next() < 0.5 ? pickRange(rng, 0, 20) : pickRange(rng, 340, 359);
      return {
        ownHeading: own,
        own: 'power',
        bearing: (own + rel) % 360,
        herHeading: (own + pickRange(rng, -25, 25)) % 360,
        her: 'power',
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
    label: 'she is overtaking you',
    build: (rng) => {
      const own = pickRange(rng, 0, 359);
      const rel = pickRange(rng, 150, 210);
      return {
        ownHeading: own,
        own: 'power',
        bearing: (own + rel) % 360,
        herHeading: (own + pickRange(rng, -25, 25)) % 360,
        her: 'power',
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
        ['fishing', 'ram'],
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
    label: 'a vessel constrained by her draught',
    build: (rng) => {
      const own = pickRange(rng, 0, 359);
      const rel = pickRange(rng, 25, 335);
      return {
        ownHeading: own,
        own: 'power',
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
    concept: 'scenario:narrow-channel',
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
    topic: 'steering',
    concept: spec.concept,
    prompt: `${describeSelf(scenario)}.${describeSetting(scenario)} ${describeHer(scenario)}, bearing ${String(rel).padStart(3, '0')}° relative, and the bearing is steady. What do you do?`,
    choices: keys.map((k, i) => ({ id: String.fromCharCode(97 + i), text: OPTIONS[k] })),
    correct: 'a',
    ruleRefs: [verdict.rule],
    explanation: `${verdict.reasoning} ${verdict.action}`,
    teachingNote:
      'Work it in the same order every time: are we in sight of one another, is either of us overtaking, are we different categories under Rule 18, and only then head-on or crossing. Answering out of order is how a crossing rule gets applied to an overtaking situation.',
    misconception:
      verdict.role === 'stand-on'
        ? 'Stand on does not mean do nothing until it is too late. Rule 17(a)(ii) lets you act as soon as it is apparent she is not keeping clear, and Rule 17(b) requires it once collision cannot be avoided by her alone.'
        : undefined,
    difficulty: 3,
    scene: { type: 'scenario', scenario },
  };

  return { question, scenario };
}

export function scenarioSources(): QuestionSource[] {
  return SPECS.map((spec) => ({
    id: `gen-${spec.concept}`,
    topic: 'steering' as const,
    concept: spec.concept,
    difficulty: 3 as const,
    generated: true,
    generate: (rng: Rng) => composeScenarioDrill(spec, rng).question,
  }));
}
