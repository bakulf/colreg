import { describe, expect, it } from 'vitest';
import { exportBackup, parseBackup } from './storage.ts';
import type { Deck } from './core/srs.ts';
import { applyReview } from './core/srs.ts';

const T0 = 1_750_000_000_000;

function sampleDeck(): Deck {
  let deck: Deck = {};
  deck = applyReview(deck, 'lights:power-over-50', 'good', T0);
  deck = applyReview(deck, 'signal:snd-rv-stopped', 'again', T0);
  deck = applyReview(deck, 'buoyage:night:cardinal-s', 'easy', T0);
  return deck;
}

describe('backup', () => {
  it('round-trips a deck unchanged', () => {
    const deck = sampleDeck();
    expect(parseBackup(exportBackup(deck))).toEqual(deck);
  });

  it('writes something a human can read and a machine can version', () => {
    const parsed = JSON.parse(exportBackup(sampleDeck()));
    expect(parsed.version).toBe(1);
    expect(typeof parsed.exportedAt).toBe('string');
  });

  it('refuses anything that is not a backup, rather than throwing', () => {
    // A failed import must leave the learner with the deck they already have.
    expect(parseBackup('')).toBeNull();
    expect(parseBackup('not json')).toBeNull();
    expect(parseBackup('null')).toBeNull();
    expect(parseBackup('[]')).toBeNull();
    expect(parseBackup('{"deck":{}}')).toBeNull();
    expect(parseBackup('{"version":99,"deck":{}}')).toBeNull();
  });

  it('drops entries that do not look like cards', () => {
    const text = JSON.stringify({
      version: 1,
      exportedAt: 'now',
      deck: {
        good: { concept: 'good', stability: 3, difficulty: 5, due: T0, lastReviewed: T0, reps: 1, lapses: 0 },
        rubbish: { stability: 'lots' },
        alsoRubbish: null,
      },
    });
    const deck = parseBackup(text);
    expect(deck).not.toBeNull();
    expect(Object.keys(deck as Deck)).toEqual(['good']);
  });

  it('accepts an empty deck', () => {
    expect(parseBackup(exportBackup({}))).toEqual({});
  });
});
