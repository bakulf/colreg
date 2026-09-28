import type { Topic } from './types.ts';
import type { MarkKind } from './buoyage/model.ts';
import { PARTS, getRule, ruleNumberOf } from './rules.ts';

/**
 * Where a question belongs is decided by what it cites, not by anyone's sense
 * of what it is about: a question whose leading citation is Rule 19 is a Part
 * B, Section III question even if it mentions sound signals. The tests hold
 * every question to this, generated ones included.
 */

const TOPIC_OF_PART: Record<string, Topic> = {
  [PARTS.A]: 'colreg-a',
  [PARTS.B1]: 'colreg-b1',
  [PARTS.B2]: 'colreg-b2',
  [PARTS.B3]: 'colreg-b3',
  [PARTS.C]: 'colreg-c',
  [PARTS.D]: 'colreg-d',
  [PARTS.E]: 'colreg-e',
  [PARTS.F]: 'colreg-f',
};

export function topicForRule(n: number): Topic {
  const rule = getRule(n);
  if (!rule) throw new Error(`No Rule ${n}`);
  const topic = TOPIC_OF_PART[rule.part];
  if (!topic) throw new Error(`Rule ${n} is in no known Part`);
  return topic;
}

/** The COLREG topic a citation belongs to: 'Rule 17(a)(ii)', 'Annex IV, 1(k)'. */
export function topicForRef(ref: string): Topic {
  const n = ruleNumberOf(ref);
  if (n !== undefined) return topicForRule(n);
  if (/^Annex (IV|I{1,3})\b/.test(ref)) return 'colreg-annexes';
  throw new Error(`"${ref}" is not a COLREG citation`);
}

export function topicForMark(kind: MarkKind): Topic {
  switch (kind) {
    case 'lateral-port':
    case 'lateral-stbd':
    case 'preferred-port':
    case 'preferred-stbd':
      return 'iala-lateral';
    case 'lateral-port-b':
    case 'lateral-stbd-b':
    case 'preferred-port-b':
    case 'preferred-stbd-b':
      return 'iala-lateral-b';
    case 'cardinal-n':
    case 'cardinal-e':
    case 'cardinal-s':
    case 'cardinal-w':
      return 'iala-cardinal';
    case 'isolated-danger':
      return 'iala-isolated-danger';
    case 'safe-water':
      return 'iala-safe-water';
    case 'special':
      return 'iala-special';
    case 'emergency-wreck':
      return 'iala-wreck';
  }
}
