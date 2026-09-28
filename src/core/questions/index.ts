import type { Domain, Question, QuestionSource, Topic } from '../types.ts';
import { TOPICS, TOPIC_INFO, staticSource } from '../types.ts';
import { DEFINITION_QUESTIONS } from './definitions.ts';
import { STEERING_QUESTIONS } from './steering.ts';
import { LIGHT_QUESTIONS } from './lights.ts';
import { SOUND_QUESTIONS } from './sound.ts';
import { BUOYAGE_QUESTIONS } from './buoyage.ts';
import { COASTAL_QUESTIONS } from './coastal.ts';
import { coastalSources } from '../coastal/generator.ts';
import { lightSources } from '../lights/generator.ts';
import { shapeSources } from '../shapes/generator.ts';
import { buoyageSources } from '../buoyage/generator.ts';
import { scenarioSources } from '../scenarios/generator.ts';
import { signalSources } from '../signals/generator.ts';
import { distressSources } from '../distress/generator.ts';
import { ruleIndexSources } from '../ruleindex/generator.ts';

export const ALL_QUESTIONS: readonly Question[] = [
  ...DEFINITION_QUESTIONS,
  ...STEERING_QUESTIONS,
  ...LIGHT_QUESTIONS,
  ...SOUND_QUESTIONS,
  ...BUOYAGE_QUESTIONS,
  ...COASTAL_QUESTIONS,
];

/**
 * Every question, wrapped as a source.
 *
 * Generators added in later milestones append here; nothing downstream needs to
 * know whether a source is fixed or generated.
 */
export const ALL_SOURCES: readonly QuestionSource[] = [
  ...ALL_QUESTIONS.map(staticSource),
  ...lightSources(),
  ...shapeSources(),
  ...buoyageSources(),
  ...scenarioSources(),
  ...signalSources(),
  ...distressSources(),
  ...ruleIndexSources(),
  ...coastalSources(),
];

export function sourcesForTopics(topics: readonly Topic[]): QuestionSource[] {
  const wanted = new Set(topics);
  return ALL_SOURCES.filter((s) => wanted.has(s.topic));
}

export interface TopicCount {
  /** Hand-written questions. */
  fixed: number;
  /** Generators, each an endless supply for one concept. */
  generated: number;
}

export function countByTopic(): Record<Topic, TopicCount> {
  const counts = Object.fromEntries(
    TOPICS.map((t) => [t, { fixed: 0, generated: 0 }]),
  ) as Record<Topic, TopicCount>;
  for (const s of ALL_SOURCES) {
    if (s.generated) counts[s.topic].generated += 1;
    else counts[s.topic].fixed += 1;
  }
  return counts;
}

/** The sources of one domain, restricted to the topics chosen within it. */
export function sourcesForDomain(domain: Domain, topics: readonly Topic[]): QuestionSource[] {
  return sourcesForTopics(topics.filter((t) => TOPIC_INFO[t].domain === domain));
}
