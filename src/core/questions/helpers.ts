import type { Choice, Difficulty, Question, Scene, Topic } from '../types.ts';

export interface QuestionSpec {
  id: string;
  topic: Topic;
  concept: string;
  difficulty: Difficulty;
  prompt: string;
  /** The correct option, written out. */
  answer: string;
  /** The wrong options. Order here is authoring order only; quizzes shuffle. */
  distractors: string[];
  ruleRefs: string[];
  explanation: string;
  teachingNote?: string;
  misconception?: string;
  scene?: Scene;
}

/**
 * Builds a Question from a spec. Taking the answer as its own field rather than
 * an index into `choices` makes it structurally impossible to author a question
 * with no correct answer or two of them.
 */
export function mcq(spec: QuestionSpec): Question {
  const texts = [spec.answer, ...spec.distractors];
  const choices: Choice[] = texts.map((text, i) => ({
    id: String.fromCharCode(97 + i),
    text,
  }));
  return {
    id: spec.id,
    topic: spec.topic,
    concept: spec.concept,
    prompt: spec.prompt,
    choices,
    correct: 'a',
    ruleRefs: spec.ruleRefs,
    explanation: spec.explanation,
    teachingNote: spec.teachingNote,
    misconception: spec.misconception,
    difficulty: spec.difficulty,
    scene: spec.scene,
  };
}
