/**
 * Domain types for the COLREG trainer.
 *
 * This module is pure TypeScript: no React, no DOM, no browser APIs. Everything
 * the learning engine needs lives here or beside it, so a future native shell
 * can reuse the whole layer unchanged.
 */

import type { VesselState } from './lights/model.ts';
import type { MarkKind } from './buoyage/model.ts';
import type { Scenario } from './scenarios/model.ts';
import type { Character } from './coastal/model.ts';
import type { DeviationCard, RoseVariation } from './compass/model.ts';
import type { Diamond, TriangleDiagram } from './tidal/model.ts';

/**
 * The bodies of rules the app drills, kept apart: a session is drawn from one
 * of them and never mixes them. They are different documents with different
 * authorities, and the syllabus treats them separately.
 */
export type Domain = 'colreg' | 'iala' | 'coastal' | 'compass' | 'tidal';

/**
 * COLREG topics follow the structure of the Convention itself — its Parts, with
 * Part B split into its three Sections, and the Annexes — so a topic is always
 * "the rules in this Part", never a grouping of our own. IALA topics follow the
 * categories of the IALA Maritime Buoyage System. Lights on aids to
 * navigation follow the IALA recommendations that govern them: R0110 for their
 * rhythmic characters, R0202 for their range. The compass follows the items of
 * the RYA Coastal Skipper / Yachtmaster Offshore syllabus, section 2, and tidal
 * streams section 4 — with the estimated position of section 1, which is where
 * the stream is allowed for after the event.
 */
export type Topic =
  | 'colreg-a'
  | 'colreg-b1'
  | 'colreg-b2'
  | 'colreg-b3'
  | 'colreg-c'
  | 'colreg-d'
  | 'colreg-e'
  | 'colreg-f'
  | 'colreg-annexes'
  | 'iala-lateral'
  | 'iala-lateral-b'
  | 'iala-cardinal'
  | 'iala-isolated-danger'
  | 'iala-safe-water'
  | 'iala-special'
  | 'iala-wreck'
  | 'coastal-characters'
  | 'coastal-notation'
  | 'coastal-range'
  | 'compass-variation'
  | 'compass-deviation'
  | 'compass-checks'
  | 'compass-types'
  | 'tidal-sources'
  | 'tidal-cts'
  | 'tidal-ep'
  | 'tidal-hazards';

export interface TopicInfo {
  domain: Domain;
  /** Short tag as the source document numbers it: 'A', 'B/III', 'Annexes'. */
  code: string;
  title: string;
  /** What it spans, e.g. 'Rules 4–10'. */
  span: string;
}

export const TOPIC_INFO: Record<Topic, TopicInfo> = {
  'colreg-a': { domain: 'colreg', code: 'A', title: 'General', span: 'Rules 1–3' },
  'colreg-b1': {
    domain: 'colreg',
    code: 'B/I',
    title: 'Conduct of vessels in any condition of visibility',
    span: 'Rules 4–10',
  },
  'colreg-b2': {
    domain: 'colreg',
    code: 'B/II',
    title: 'Conduct of vessels in sight of one another',
    span: 'Rules 11–18',
  },
  'colreg-b3': {
    domain: 'colreg',
    code: 'B/III',
    title: 'Conduct of vessels in restricted visibility',
    span: 'Rule 19',
  },
  'colreg-c': { domain: 'colreg', code: 'C', title: 'Lights and shapes', span: 'Rules 20–31' },
  'colreg-d': {
    domain: 'colreg',
    code: 'D',
    title: 'Sound and light signals',
    span: 'Rules 32–37',
  },
  'colreg-e': { domain: 'colreg', code: 'E', title: 'Exemptions', span: 'Rule 38' },
  'colreg-f': {
    domain: 'colreg',
    code: 'F',
    title: 'Verification of compliance',
    span: 'Rules 39–41',
  },
  'colreg-annexes': {
    domain: 'colreg',
    code: 'Annexes',
    title: 'Technical annexes',
    span: 'Annexes I–IV',
  },
  'iala-lateral': {
    domain: 'iala',
    code: 'Lateral A',
    title: 'Lateral marks — Region A',
    span: 'Red to port, green to starboard',
  },
  'iala-lateral-b': {
    domain: 'iala',
    code: 'Lateral B',
    title: 'Lateral marks — Region B',
    span: 'Green to port, red to starboard',
  },
  'iala-cardinal': {
    domain: 'iala',
    code: 'Cardinal',
    title: 'Cardinal marks',
    span: 'North, east, south, west',
  },
  'iala-isolated-danger': {
    domain: 'iala',
    code: 'Isolated',
    title: 'Isolated danger marks',
    span: 'A danger with navigable water all round',
  },
  'iala-safe-water': {
    domain: 'iala',
    code: 'Safe water',
    title: 'Safe water marks',
    span: 'Mid-channel and landfall',
  },
  'iala-special': {
    domain: 'iala',
    code: 'Special',
    title: 'Special marks',
    span: 'Not primarily for navigation',
  },
  'iala-wreck': {
    domain: 'iala',
    code: 'Wreck',
    title: 'Emergency wreck marking',
    span: 'New dangers, before they are charted',
  },
  'coastal-characters': {
    domain: 'coastal',
    code: 'R0110',
    title: 'Rhythmic characters',
    span: 'Fixed, occulting, isophase, flashing, quick, Morse',
  },
  'coastal-notation': {
    domain: 'coastal',
    code: 'Chart',
    title: 'Reading a light on the chart',
    span: 'Character, colours, period, elevation, range, sectors',
  },
  'coastal-range': {
    domain: 'coastal',
    code: 'R0202',
    title: 'Range',
    span: 'Nominal, luminous and geographic; rising and dipping',
  },
  'compass-variation': {
    domain: 'compass',
    code: 'Var',
    title: 'Variation',
    span: 'Allowing for it; its change with time and position',
  },
  'compass-deviation': {
    domain: 'compass',
    code: 'Dev',
    title: 'Deviation',
    span: 'Its causes; allowing for it with a deviation card',
  },
  'compass-checks': {
    domain: 'compass',
    code: 'Check',
    title: 'Checking for deviation',
    span: 'Transits and comparison — checks, not correction',
  },
  'compass-types': {
    domain: 'compass',
    code: 'Types',
    title: 'Types of compass',
    span: 'Steering, hand-bearing, fluxgate, gyro',
  },
  'tidal-sources': {
    domain: 'tidal',
    code: 'Info',
    title: 'Tidal stream information',
    span: 'Diamonds, atlases and almanacs; springs and neaps',
  },
  'tidal-cts': {
    domain: 'tidal',
    code: 'CTS',
    title: 'Allowing for the stream: course to steer',
    span: 'The triangle, one in sixty, leeway, speed over the ground',
  },
  'tidal-ep': {
    domain: 'tidal',
    code: 'EP',
    title: 'Estimated position',
    span: 'Syllabus 1: the stream and leeway allowed for after the event',
  },
  'tidal-hazards': {
    domain: 'tidal',
    code: 'Races',
    title: 'Races, overfalls and seeing the stream',
    span: 'Tide rips and races; tidal observation from buoys and beacons',
  },
};

export const TOPICS: readonly Topic[] = Object.keys(TOPIC_INFO) as Topic[];

export function topicsOf(domain: Domain): Topic[] {
  return TOPICS.filter((t) => TOPIC_INFO[t].domain === domain);
}

export const DOMAIN_LABELS: Record<Domain, string> = {
  colreg: 'COLREG',
  iala: 'IALA',
  coastal: 'Lights',
  compass: 'Compass',
  tidal: 'Tidal streams',
};

/** 'Part B/III — Conduct of vessels in restricted visibility', 'Lateral marks'. */
export function topicLabel(topic: Topic): string {
  const info = TOPIC_INFO[topic];
  if (info.domain !== 'colreg') return info.title;
  if (topic === 'colreg-annexes') return `Annexes I–IV`;
  return `Part ${info.code} — ${info.title}`;
}

/** 1 = recall, 2 = applied, 3 = the kind an examiner uses to separate candidates. */
export type Difficulty = 1 | 2 | 3;

export interface Choice {
  id: string;
  text: string;
}

/**
 * A picture the question is asked about, carried as data so that `core` stays
 * free of rendering. The UI maps each scene type to a component.
 */
export type Scene =
  | {
      type: 'lights';
      vessel: VesselState;
      /** Observer's relative bearing from the vessel; 0 is head-on. */
      aspectDeg: number;
    }
  | {
      /** Day signals have no arcs and no aspect: the same from everywhere. */
      type: 'shapes';
      vessel: VesselState;
    }
  | {
      type: 'buoy';
      kind: MarkKind;
      /** By day the body and topmark; by night only the light, flashing. */
      mode: 'day' | 'night';
    }
  | {
      /** A head-up plot of a two-vessel encounter. */
      type: 'scenario';
      scenario: Scenario;
    }
  | {
      /** A sound signal drawn as a timeline and played back in real time. */
      type: 'signal';
      signalId: string;
    }
  | {
      /** The two Annex IV distress signals that are things you look at. */
      type: 'distress';
      visual: 'flags-nc' | 'square-and-ball';
    }
  | {
      /** A light ashore at night, showing its character in real time. */
      type: 'coastal';
      character: Character;
    }
  | {
      /** A chart's compass rose, with its variation printed as on the chart. */
      type: 'compass-rose';
      rose: RoseVariation;
    }
  | {
      /** The steering compass's deviation card. */
      type: 'deviation-card';
      card: DeviationCard;
    }
  | {
      /** A chart's table of tidal stream rates for one diamond. */
      type: 'tidal-diamond';
      diamond: Diamond;
      /** Row to pick out, hours from HW. */
      highlight: number | undefined;
    }
  | {
      /** A vector triangle, drawn with the conventional arrows. */
      type: 'tidal-triangle';
      diagram: TriangleDiagram;
    }
  | {
      /** Four triangles, labelled A to D, to choose between. */
      type: 'tidal-pick';
      diagrams: TriangleDiagram[];
    };

export interface Question {
  id: string;
  topic: Topic;
  /**
   * The underlying thing being tested, shared by every question that drills it.
   * Spaced repetition schedules *concepts*; a concept may later be backed by a
   * generator that mints a fresh question each review.
   */
  concept: string;
  prompt: string;
  choices: Choice[];
  /** Id of the correct choice. */
  correct: string;
  /** Human-readable rule citations, e.g. ['Rule 15', 'Rule 16']. */
  ruleRefs: string[];
  /** Why the answer is right. Shown after answering. */
  explanation: string;
  difficulty: Difficulty;
  /** Optional picture the question is about. */
  scene?: Scene;
  /** A picture shown only after answering: the worked solution. */
  afterScene?: Scene;
}

/**
 * A source of questions for one concept.
 *
 * In M0 every source is a fixed question (`staticSource`). From M1 the light,
 * sound and geometry modules supply sources that build a new question on each
 * call, which is why the quiz engine only ever talks to this interface.
 */
export interface QuestionSource {
  id: string;
  topic: Topic;
  concept: string;
  difficulty: Difficulty;
  /** True when `generate` mints a fresh question each call. */
  generated: boolean;
  generate(rng: Rng): Question;
}

/** Seeded pseudo-random source, so a session can be replayed exactly. */
export interface Rng {
  /** Float in [0, 1). */
  next(): number;
}

export function staticSource(question: Question): QuestionSource {
  return {
    id: question.id,
    topic: question.topic,
    concept: question.concept,
    difficulty: question.difficulty,
    generated: false,
    generate: () => question,
  };
}
