import { describe, expect, it } from 'vitest';
import type { Scenario } from './model.ts';
import { bearingFromHer, classify, relativeBearing, resolve } from './model.ts';
import { SPECS, composeScenarioDrill, correctOption, scenarioSources } from './generator.ts';
import { createRng } from '../rng.ts';

const power = (over: Partial<Scenario> = {}): Scenario => ({
  ownHeading: 0,
  own: 'power',
  bearing: 0,
  herHeading: 180,
  her: 'power',
  restrictedVisibility: false,
  ...over,
});

describe('geometry', () => {
  it('measures her bearing relative to your head', () => {
    expect(relativeBearing(power({ ownHeading: 350, bearing: 20 }))).toBe(30);
    expect(relativeBearing(power({ ownHeading: 20, bearing: 350 }))).toBe(330);
  });

  it('measures your bearing relative to her head, which decides overtaking', () => {
    // She bears 180 from you, so she is south of you and you are north of her.
    // She heads north, so you lie dead ahead of her.
    expect(bearingFromHer(power({ bearing: 180, herHeading: 0 }))).toBe(0);
    // She bears 000 from you and heads north: you are astern of her, in the
    // sector that makes you the overtaking vessel.
    expect(bearingFromHer(power({ bearing: 0, herHeading: 0 }))).toBe(180);
  });
});

describe('classification', () => {
  it('calls it head-on only when she is ahead and on a reciprocal course', () => {
    expect(classify(power({ bearing: 2, herHeading: 181 }))).toBe('head-on');
    // Ahead, but not reciprocal: a crossing situation.
    expect(classify(power({ bearing: 2, herHeading: 100 }))).toBe('crossing');
    // Reciprocal, but well off the bow.
    expect(classify(power({ bearing: 60, herHeading: 180 }))).toBe('crossing');
  });

  it('lets Rule 13 override the crossing rules', () => {
    // She is fine on your starboard bow — a crossing geometry — but you are
    // coming up from abaft her beam, so you are overtaking.
    const s = power({ bearing: 10, herHeading: 5 });
    expect(classify(s)).toBe('overtaking');
    expect(resolve(s).rule).toBe('Rule 13');
  });

  it('keeps an overtaking vessel overtaking whichever side she is', () => {
    expect(classify(power({ bearing: 350, herHeading: 355 }))).toBe('overtaking');
    expect(classify(power({ bearing: 10, herHeading: 5 }))).toBe('overtaking');
  });

  it('suspends the whole of Section II in restricted visibility', () => {
    const s = power({ bearing: 50, herHeading: 230, restrictedVisibility: true });
    expect(classify(s)).toBe('restricted-visibility');
    expect(resolve(s).role).toBe('both-act');
    expect(resolve(s).rule).toBe('Rule 19');
  });
});

describe('who gives way', () => {
  it('gives way to a vessel on your starboard side', () => {
    expect(resolve(power({ bearing: 60, herHeading: 250 })).role).toBe('give-way');
    expect(resolve(power({ bearing: 60, herHeading: 250 })).rule).toBe('Rule 15');
  });

  it('stands on for a vessel on your port side', () => {
    expect(resolve(power({ bearing: 300, herHeading: 130 })).role).toBe('stand-on');
  });

  it('never tells the stand-on vessel to alter to port for a vessel to port', () => {
    const v = resolve(power({ bearing: 300, herHeading: 130 }));
    expect(v.action).toContain('not alter to port');
  });

  it('puts the port-tack yacht out of the way of the starboard-tack yacht', () => {
    const s = power({
      own: 'sailing',
      her: 'sailing',
      bearing: 60,
      herHeading: 250,
      ownTack: 'port',
      herTack: 'starboard',
    });
    expect(resolve(s).role).toBe('give-way');
    expect(resolve(s).rule).toBe('Rule 12(a)(i)');
  });

  it('puts the windward yacht out of the way of the leeward yacht on the same tack', () => {
    const windward = power({
      own: 'sailing',
      her: 'sailing',
      ownTack: 'starboard',
      herTack: 'starboard',
      bearing: 300, // she is to port, so with the wind to starboard you are windward
      herHeading: 20,
    });
    expect(resolve(windward).rule).toBe('Rule 12(a)(ii)');
    expect(resolve(windward).role).toBe('give-way');
  });

  it('follows the Rule 18 ladder between different categories', () => {
    const asPower = power({ own: 'power', her: 'fishing', bearing: 300, herHeading: 120 });
    expect(resolve(asPower).role).toBe('give-way');
    const asFishing = power({ own: 'fishing', her: 'power', bearing: 60, herHeading: 240 });
    expect(resolve(asFishing).role).toBe('stand-on');
  });

  it('treats a vessel constrained by her draught as "do not impede", not "give way"', () => {
    const v = resolve(power({ her: 'cbd', bearing: 300, herHeading: 120 }));
    expect(v.role).toBe('not-impede');
    expect(v.rule).toBe('Rule 18(d)');
    expect(v.action).toContain('not the same as giving way');
  });

  it('never names a stand-on vessel in fog, from any bearing', () => {
    for (let b = 0; b < 360; b += 7) {
      const v = resolve(power({ bearing: b, herHeading: (b + 137) % 360, restrictedVisibility: true }));
      expect(v.role, `bearing ${b}`).toBe('both-act');
    }
  });

  it('never tells you to alter to port for a contact forward of the beam in fog', () => {
    for (const b of [0, 30, 60, 90, 300, 330, 359]) {
      const v = resolve(power({ bearing: b, herHeading: 200, restrictedVisibility: true }));
      expect(v.action, `bearing ${b}`).toContain('Do not alter to port');
    }
  });
});

describe('scenario drills', () => {
  it('builds a geometry that really is the situation it claims', () => {
    const rng = createRng(31);
    for (const spec of SPECS) {
      for (let i = 0; i < 25; i++) {
        const { scenario } = composeScenarioDrill(spec, rng);
        expect(spec.expect(scenario), `${spec.concept}`).toBe(true);
      }
    }
  });

  it('offers four distinct options, the first of which is the right one', () => {
    const rng = createRng(37);
    for (const spec of SPECS) {
      for (let i = 0; i < 15; i++) {
        const { question, scenario } = composeScenarioDrill(spec, rng);
        const texts = question.choices.map((c) => c.text);
        expect(new Set(texts).size, spec.concept).toBe(texts.length);
        expect(texts.length).toBe(4);
        expect(question.correct).toBe('a');
        // The first option must be the one the model derives, not a label.
        expect(correctOption(scenario)).toBeTruthy();
      }
    }
  });

  it('cites the rule the model resolved, never a different one', () => {
    const rng = createRng(41);
    for (const spec of SPECS) {
      const { question, scenario } = composeScenarioDrill(spec, rng);
      expect(question.ruleRefs).toEqual([resolve(scenario).rule]);
    }
  });

  it('offers the alter-to-port trap only where it is wrong', () => {
    const rng = createRng(43);
    for (const spec of SPECS) {
      for (let i = 0; i < 10; i++) {
        const { question } = composeScenarioDrill(spec, rng);
        const trap = question.choices.find((c) => c.text.includes('alter course to port'));
        if (trap) expect(trap.id).not.toBe('a');
      }
    }
  });

  it('exposes one source per situation, all marked generated', () => {
    const sources = scenarioSources();
    expect(sources).toHaveLength(SPECS.length);
    expect(sources.every((s) => s.generated && s.topic === 'steering')).toBe(true);
    expect(new Set(sources.map((s) => s.concept)).size).toBe(sources.length);
  });
});
