import type { Question, QuestionSource, Rng } from '../types.ts';
import { shuffle } from '../rng.ts';
import type { DistressSignal, NotDistress } from './model.ts';
import { DISTRESS_SIGNALS, NOT_DISTRESS } from './model.ts';

/**
 * Distress drills, in both directions.
 *
 * Annex IV is a closed list, so it can be drilled two ways that test different
 * things. "Which of these is a distress signal" checks that the list is known.
 * "Which of these is NOT" checks something harder and more useful: that the
 * near-misses are known to be near-misses. A candidate who can recite the
 * fifteen and still thinks a white flare means help has learned the wrong half.
 */

function recogniseDrill(signal: DistressSignal, rng: Rng): Question {
  const wrong = shuffle(NOT_DISTRESS, rng).slice(0, 3);

  return {
    id: `dst-is-${signal.id}`,
    topic: 'sound',
    concept: `distress:is:${signal.id}`,
    prompt: 'Which of these is a distress signal under Annex IV?',
    choices: [signal.observation, ...wrong.map((w) => w.observation)].map((text, i) => ({
      id: String.fromCharCode(97 + i),
      text,
    })),
    correct: 'a',
    ruleRefs: ['Rule 37', signal.ref],
    explanation: `${signal.ref}. ${signal.note ?? ''}`.trim(),
    teachingNote:
      'Annex IV is a closed list of fifteen. Paragraph 2 then prohibits using any of them except to indicate distress, and prohibits any other signal that might be confused with one — which is why the list being closed matters.',
    misconception: wrong
      .map((w) => `${w.observation}: ${w.truth}`)
      .join(' '),
    difficulty: 2,
    scene: signal.visual ? { type: 'distress', visual: signal.visual } : undefined,
  };
}

function exclusionDrill(impostor: NotDistress, rng: Rng): Question {
  const real = shuffle(DISTRESS_SIGNALS, rng).slice(0, 3);

  return {
    id: `dst-not-${impostor.id}`,
    topic: 'sound',
    concept: `distress:not:${impostor.id}`,
    prompt: 'Which of these is NOT a distress signal under Annex IV?',
    choices: [impostor.observation, ...real.map((r) => r.observation)].map((text, i) => ({
      id: String.fromCharCode(97 + i),
      text,
    })),
    correct: 'a',
    ruleRefs: ['Rule 37', 'Annex IV'],
    explanation: impostor.truth,
    teachingNote:
      'Knowing what a signal does not mean is worth as much as knowing what it does. Every option here except one is on the Annex IV list; the odd one out is something people reliably mistake for it.',
    difficulty: 3,
  };
}

/** The wording of the arms signal is examined, so it gets its own drill. */
function armsDrill(): Question {
  return {
    id: 'dst-arms-detail',
    topic: 'sound',
    concept: 'distress:arms-detail',
    prompt: 'The Annex IV distress signal made with the arms is:',
    choices: [
      { id: 'a', text: 'Slowly and repeatedly raising and lowering arms outstretched to each side' },
      { id: 'b', text: 'Waving one arm above the head' },
      { id: 'c', text: 'Both arms held straight up above the head' },
      { id: 'd', text: 'Crossing and uncrossing both arms in front of the body' },
    ],
    correct: 'a',
    ruleRefs: ['Annex IV, 1(k)'],
    explanation:
      'Both arms, outstretched to each side, raised and lowered slowly and repeatedly. Every word carries: one arm waved reads as a greeting, and a fast movement reads as excitement rather than distress.',
    teachingNote:
      'Make the student do it. It feels absurd on dry land and that is exactly why they will remember it, and why they will do it slowly enough to be understood if they ever need to.',
    difficulty: 2,
  };
}

/** Rule 36 — signals to attract attention, which are not distress signals. */
function attentionDrill(): Question {
  return {
    id: 'dst-rule36',
    topic: 'sound',
    concept: 'rule36:attention',
    prompt:
      'Under Rule 36, a vessel wishing to attract the attention of another vessel may:',
    choices: [
      {
        id: 'a',
        text: 'Make light or sound signals that cannot be mistaken for any signal authorised elsewhere in the Rules, or direct the beam of a searchlight towards the danger',
      },
      {
        id: 'b',
        text: 'Use a high-intensity flashing or revolving light, which is the most conspicuous option available',
      },
      { id: 'c', text: 'Sound five or more short and rapid blasts' },
      { id: 'd', text: 'Fire a white flare, which is the recognised attention signal' },
    ],
    correct: 'a',
    ruleRefs: ['Rule 36'],
    explanation:
      'Rule 36 permits any light or sound signal that cannot be mistaken for a signal authorised elsewhere, and permits directing a searchlight in the direction of the danger in such a way as not to embarrass any vessel. Any light used to attract attention must not be mistakable for an aid to navigation, and high-intensity flashing or revolving lights, such as strobes, shall be avoided.',
    teachingNote:
      'Rule 36 and Annex IV are easily muddled. Rule 36 says "look at me"; Annex IV says "help me". A searchlight on the danger is Rule 36; a red flare is Annex IV.',
    misconception:
      'Five short and rapid blasts is the Rule 34(d) doubt signal, not a general attention signal, and it applies between vessels in sight of one another.',
    difficulty: 3,
  };
}

/** Annex IV, 3: signals attention is drawn to, which are not on the list. */
function annexThreeDrill(): Question {
  return {
    id: 'dst-annex-iv-3',
    topic: 'sound',
    concept: 'distress:annex-iv-3',
    prompt:
      'A piece of orange canvas bearing a black square and circle, and a dye marker in the water, are:',
    choices: [
      {
        id: 'a',
        text: 'Signals that Annex IV draws attention to in paragraph 3, but which are not among the distress signals listed in paragraph 1',
      },
      { id: 'b', text: 'Distress signals in the Annex IV list, like a red flare' },
      { id: 'c', text: 'Signals to attract attention under Rule 36' },
      { id: 'd', text: 'Signals reserved for vessels engaged in search and rescue' },
    ],
    correct: 'a',
    ruleRefs: ['Annex IV, 3'],
    explanation:
      'Annex IV, 1 lists the distress signals. Annex IV, 3 separately draws attention to the International Code of Signals, the search and rescue manual, the orange canvas with a black square and circle for identification from the air, and the dye marker. Useful, carried in liferafts, and not on the list.',
    teachingNote:
      'A fine distinction, but a fair one to ask: the orange canvas is for being found once someone is already looking, not for raising the alarm.',
    difficulty: 3,
  };
}

export function distressSources(): QuestionSource[] {
  const sources: QuestionSource[] = [];

  for (const signal of DISTRESS_SIGNALS) {
    sources.push({
      id: `gen-distress-is-${signal.id}`,
      topic: 'sound',
      concept: `distress:is:${signal.id}`,
      difficulty: 2,
      generated: true,
      generate: (rng: Rng) => recogniseDrill(signal, rng),
    });
  }

  for (const impostor of NOT_DISTRESS) {
    sources.push({
      id: `gen-distress-not-${impostor.id}`,
      topic: 'sound',
      concept: `distress:not:${impostor.id}`,
      difficulty: 3,
      generated: true,
      generate: (rng: Rng) => exclusionDrill(impostor, rng),
    });
  }

  for (const question of [armsDrill(), attentionDrill(), annexThreeDrill()]) {
    sources.push({
      id: `fixed-${question.id}`,
      topic: question.topic,
      concept: question.concept,
      difficulty: question.difficulty,
      generated: false,
      generate: () => question,
    });
  }

  return sources;
}

export { recogniseDrill, exclusionDrill };
