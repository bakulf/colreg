import { describe, expect, it } from 'vitest';
import {
  ALL_SIGNALS,
  FOG,
  MANOEUVRING,
  PROLONGED_MS,
  SHORT_MS,
  durationMs,
  sameSound,
  signalById,
} from './model.ts';
import { composeSignalDrill, sharedSoundGroup, signalSources } from './generator.ts';
import { createRng } from '../rng.ts';

describe('Rule 32 blast lengths', () => {
  it('makes a short blast about a second and a prolonged one four to six', () => {
    expect(SHORT_MS).toBe(1000);
    expect(PROLONGED_MS).toBeGreaterThanOrEqual(4000);
    expect(PROLONGED_MS).toBeLessThanOrEqual(6000);
  });

  it('uses only the two lengths Rule 32 defines for whistle signals', () => {
    for (const signal of ALL_SIGNALS) {
      for (const blast of signal.blasts) {
        if (blast.kind === 'short') expect(blast.ms, signal.id).toBe(SHORT_MS);
        if (blast.kind === 'prolonged') expect(blast.ms, signal.id).toBe(PROLONGED_MS);
      }
    }
  });

  it('measures a signal including the gaps between its blasts', () => {
    // One prolonged plus two short: 5 + 1 + 1 seconds of sound, two gaps.
    const s = signalById('snd-rv-restricted')!;
    expect(durationMs(s)).toBe(PROLONGED_MS + SHORT_MS * 2 + 1000 * 2);
  });
});

describe('the signals themselves', () => {
  it('gives one, two and three short blasts their Rule 34(a) meanings', () => {
    expect(signalById('snd-one-short')!.meaning).toContain('starboard');
    expect(signalById('snd-two-short')!.meaning).toContain('port');
    expect(signalById('snd-three-short')!.meaning).toContain('astern propulsion');
  });

  it('keeps the doubt signal at five blasts minimum, not exactly five', () => {
    expect(signalById('snd-five-short')!.notation).toContain('at least five');
  });

  it('gives the anchored vessel a one-minute cycle and the rest two', () => {
    expect(signalById('snd-rv-anchored')!.interval).toContain('one minute');
    expect(signalById('snd-rv-making-way')!.interval).toContain('two minutes');
    expect(signalById('snd-rv-stopped')!.interval).toContain('two minutes');
  });

  it('shares one prolonged and two short between six categories', () => {
    const m = signalById('snd-rv-restricted')!.meaning;
    for (const category of [
      'not under command',
      'restricted in her ability to manoeuvre',
      'constrained by her draught',
      'sailing',
      'fishing',
      'towing',
    ]) {
      expect(m, category).toContain(category);
    }
  });

  it('prefixes the overtaking signals with two prolonged blasts', () => {
    for (const id of ['snd-overtake-stbd', 'snd-overtake-port']) {
      const kinds = signalById(id)!.blasts.map((b) => b.kind);
      expect(kinds.slice(0, 2), id).toEqual(['prolonged', 'prolonged']);
    }
  });

  it('separates the manoeuvring signals from the fog signals', () => {
    expect(MANOEUVRING.every((s) => s.context === 'manoeuvring')).toBe(true);
    expect(FOG.every((s) => s.context === 'restricted-visibility')).toBe(true);
  });

  it('cites a rule for every signal', () => {
    for (const s of ALL_SIGNALS) expect(s.ruleRefs.length, s.id).toBeGreaterThan(0);
  });

  it('finds the one genuinely ambiguous pair in the Rules', () => {
    // One prolonged blast: Rule 34(e) at a blind bend, Rule 35(a) in fog.
    const bend = signalById('snd-bend')!;
    const makingWay = signalById('snd-rv-making-way')!;
    expect(sameSound(bend, makingWay)).toBe(true);
    expect(sharedSoundGroup(bend)).toHaveLength(2);
  });
});

describe('signal drills', () => {
  it('names every signal that sounds like this one in the answer', () => {
    const rng = createRng(17);
    for (const signal of ALL_SIGNALS) {
      const { question, group } = composeSignalDrill(signal, rng);
      for (const member of group) {
        expect(
          question.choices[0]!.text.toLowerCase(),
          `${signal.id}: "${member.meaning}" sounds the same but is not in the answer`,
        ).toContain(member.meaning.toLowerCase().replace(/^an? /, ''));
      }
    }
  });

  it('never offers a distractor that sounds like the answer', () => {
    const rng = createRng(19);
    for (const signal of ALL_SIGNALS) {
      for (let i = 0; i < 10; i++) {
        const { group, distractors } = composeSignalDrill(signal, rng);
        for (const d of distractors) {
          for (const g of group) {
            expect(sameSound(d, g), `${signal.id} vs ${d.id}`).toBe(false);
          }
        }
      }
    }
  });

  it('offers four distinct options with the first correct', () => {
    const rng = createRng(23);
    for (const signal of ALL_SIGNALS) {
      const q = composeSignalDrill(signal, rng).question;
      const texts = q.choices.map((c) => c.text);
      expect(new Set(texts).size, signal.id).toBe(texts.length);
      expect(texts.length, signal.id).toBe(4);
      expect(q.correct).toBe('a');
    }
  });

  it('never gives the notation away in the prompt', () => {
    const rng = createRng(29);
    for (const signal of ALL_SIGNALS) {
      const q = composeSignalDrill(signal, rng).question;
      expect(q.prompt.toLowerCase(), signal.id).not.toContain('prolonged');
      expect(q.prompt.toLowerCase(), signal.id).not.toContain('short blast');
    }
  });

  it('carries a signal scene pointing at the right signal', () => {
    const rng = createRng(31);
    for (const signal of ALL_SIGNALS) {
      const q = composeSignalDrill(signal, rng).question;
      expect(q.scene?.type).toBe('signal');
      if (q.scene?.type !== 'signal') throw new Error('expected a signal scene');
      expect(q.scene.signalId).toBe(signal.id);
    }
  });

  it('exposes one source per signal', () => {
    const sources = signalSources();
    expect(sources).toHaveLength(ALL_SIGNALS.length);
    expect(sources.every((s) => s.topic === 'sound' && s.generated)).toBe(true);
    expect(new Set(sources.map((s) => s.concept)).size).toBe(sources.length);
  });
});
