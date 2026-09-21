import type { Question, QuestionSource, Rng } from '../types.ts';
import { shuffle } from '../rng.ts';
import type { RuleEntry } from '../rules.ts';
import { RULES } from '../rules.ts';

/**
 * Knowing the Rules by number.
 *
 * An instructor has to cite, not just comply: "that is Rule 17(a)(ii)" ends an
 * argument on a pontoon in a way that "I think you should have held your
 * course" does not. Examiners ask for the number, and a candidate who can
 * apply every rule correctly and name none of them will still lose marks.
 *
 * Drilled in both directions, because they are different skills. Recognising a
 * rule from its subject is recall; producing the number from the wording is
 * what you need when you are quoting it at someone.
 */

/**
 * A rule's subject, made unique.
 *
 * Four rules are titled "Application" — 1, 4, 11 and 20 — because each opens a
 * Part or a Section. A drill that offered two options reading "Application"
 * would have two right answers, so where a title is shared the Part is added.
 */
export function subjectOf(rule: RuleEntry): string {
  const shared = RULES.filter((r) => r.title === rule.title).length > 1;
  return shared ? `${rule.title} — ${rule.part}` : rule.title;
}

function label(rule: RuleEntry): string {
  return `Rule ${rule.n} — ${subjectOf(rule)}`;
}

/**
 * Neighbours make the best distractors: a candidate who has the structure of
 * the Rules will not confuse Rule 5 with Rule 30, but Rule 16 with Rule 17 is
 * exactly the slip worth catching.
 */
function neighbours(rule: RuleEntry, rng: Rng, count = 3): RuleEntry[] {
  const others = RULES.filter((r) => r.n !== rule.n);
  const ranked = others
    .map((r) => ({
      r,
      score:
        (r.part === rule.part ? 6 : 0) + Math.max(0, 8 - Math.abs(r.n - rule.n)),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 7)
    .map((e) => e.r);
  return shuffle(ranked, rng).slice(0, count);
}

/** Given the number, what does it cover? */
function subjectDrill(rule: RuleEntry, rng: Rng): Question {
  const wrong = neighbours(rule, rng);
  return {
    id: `rix-subject-${rule.n}`,
    topic: 'definitions',
    concept: `rule-index:subject:${rule.n}`,
    prompt: `What is the subject of Rule ${rule.n}?`,
    choices: [subjectOf(rule), ...wrong.map(subjectOf)].map((text, i) => ({
      id: String.fromCharCode(97 + i),
      text,
    })),
    correct: 'a',
    ruleRefs: [`Rule ${rule.n}`],
    explanation: `Rule ${rule.n}, ${subjectOf(rule)}. It sits in ${rule.part}.${
      rule.key ? ` ${rule.key}` : ''
    }`,
    teachingNote:
      'Learn the Rules as a shape before learning them as a list. Part A is general, Part B is the steering and sailing rules in three sections, Part C is lights and shapes, Part D is signals. Given the shape, most numbers can be reconstructed rather than memorised.',
    difficulty: 2,
  };
}

/** Given the subject, which number is it? */
function numberDrill(rule: RuleEntry, rng: Rng): Question {
  const wrong = neighbours(rule, rng);
  return {
    id: `rix-number-${rule.n}`,
    topic: 'definitions',
    concept: `rule-index:number:${rule.n}`,
    prompt: `Which rule covers ${lowerFirst(subjectOf(rule))}?`,
    choices: [label(rule), ...wrong.map(label)].map((text, i) => ({
      id: String.fromCharCode(97 + i),
      text,
    })),
    correct: 'a',
    ruleRefs: [`Rule ${rule.n}`],
    explanation: `${rule.part}.${rule.key ? ` ${rule.key}` : ''}`,
    difficulty: 2,
  };
}

/** Given the wording, which rule is it? Only for rules whose text we carry. */
function wordingDrill(rule: RuleEntry, rng: Rng): Question {
  const wrong = neighbours(rule, rng);
  return {
    id: `rix-wording-${rule.n}`,
    topic: 'definitions',
    concept: `rule-index:wording:${rule.n}`,
    prompt: `Which rule says this?\n\n“${rule.key as string}”`,
    choices: [label(rule), ...wrong.map(label)].map((text, i) => ({
      id: String.fromCharCode(97 + i),
      text,
    })),
    correct: 'a',
    ruleRefs: [`Rule ${rule.n}`],
    explanation: `Rule ${rule.n}, ${subjectOf(rule)}, in ${rule.part}.`,
    teachingNote:
      'Producing the number from the wording is the version that matters when you are quoting a rule at someone. Recognising the subject from the number is the easier half.',
    difficulty: 3,
  };
}

function lowerFirst(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

export function ruleIndexSources(): QuestionSource[] {
  const sources: QuestionSource[] = [];

  for (const rule of RULES) {
    sources.push({
      id: `gen-rule-subject-${rule.n}`,
      topic: 'definitions',
      concept: `rule-index:subject:${rule.n}`,
      difficulty: 2,
      generated: true,
      generate: (rng: Rng) => subjectDrill(rule, rng),
    });
    sources.push({
      id: `gen-rule-number-${rule.n}`,
      topic: 'definitions',
      concept: `rule-index:number:${rule.n}`,
      difficulty: 2,
      generated: true,
      generate: (rng: Rng) => numberDrill(rule, rng),
    });
    if (rule.key) {
      sources.push({
        id: `gen-rule-wording-${rule.n}`,
        topic: 'definitions',
        concept: `rule-index:wording:${rule.n}`,
        difficulty: 3,
        generated: true,
        generate: (rng: Rng) => wordingDrill(rule, rng),
      });
    }
  }

  return sources;
}

export { subjectDrill, numberDrill, wordingDrill };
