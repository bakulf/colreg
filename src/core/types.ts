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

export type Topic =
  | 'definitions'
  | 'steering'
  | 'lights'
  | 'sound'
  | 'buoyage';

export const TOPICS: readonly Topic[] = [
  'definitions',
  'steering',
  'lights',
  'sound',
  'buoyage',
] as const;

export const TOPIC_LABELS: Record<Topic, string> = {
  definitions: 'Definitions & general',
  steering: 'Steering & sailing rules',
  lights: 'Lights & shapes',
  sound: 'Sound & light signals',
  buoyage: 'IALA A buoyage',
};

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
  /** How you would put it to a student. The instructor layer. */
  teachingNote?: string;
  /** The mistake students reliably make here. */
  misconception?: string;
  difficulty: Difficulty;
  /** Optional picture the question is about. */
  scene?: Scene;
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
