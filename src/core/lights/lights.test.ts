import { describe, expect, it } from 'vitest';
import { ARCS, arcContains, lightsFor } from './model.ts';
import { describeVessel } from './describe.ts';
import type { VesselState } from './model.ts';
import {
  aspectLabel,
  project,
  projectScene,
  signature,
  visibleLights,
} from './project.ts';
import {
  CANONICAL_ASPECTS,
  VESSEL_POOL,
  composeLightDrill,
  fairAspects,
  lightSources,
  sharedGroup,
} from './generator.ts';
import { createRng } from '../rng.ts';

describe('Rule 21 arcs', () => {
  it('shows a masthead light from right ahead to 22.5 degrees abaft the beam', () => {
    for (const bearing of [0, 90, 112, 248, 300, 359]) {
      expect(arcContains(ARCS.masthead, bearing), `${bearing}`).toBe(true);
    }
    for (const bearing of [113, 180, 247]) {
      expect(arcContains(ARCS.masthead, bearing), `${bearing}`).toBe(false);
    }
  });

  it('shows both sidelights dead ahead and neither dead astern', () => {
    expect(arcContains(ARCS['side-port'], 0)).toBe(true);
    expect(arcContains(ARCS['side-stbd'], 0)).toBe(true);
    expect(arcContains(ARCS['side-port'], 180)).toBe(false);
    expect(arcContains(ARCS['side-stbd'], 180)).toBe(false);
  });

  it('overlaps the sidelights across the bow by the Annex I cut-off, and no more', () => {
    // Inside the overlap both show; just outside it, only the one whose side
    // the observer is on.
    expect(arcContains(ARCS['side-port'], 1.5)).toBe(true);
    expect(arcContains(ARCS['side-stbd'], 1.5)).toBe(true);
    expect(arcContains(ARCS['side-port'], 5)).toBe(false);
    expect(arcContains(ARCS['side-stbd'], 5)).toBe(true);
    expect(arcContains(ARCS['side-stbd'], 355)).toBe(false);
    expect(arcContains(ARCS['side-port'], 355)).toBe(true);
  });

  it('lets a sailing vessel show two sidelights and nothing else, head-on', () => {
    const lights = visibleLights({ kind: 'sailing', lengthM: 12, makingWay: true }, 0);
    expect(lights.map((l) => l.colour).sort()).toEqual(['green', 'red']);
  });

  it('shows the sternlight exactly where the sidelights stop', () => {
    expect(arcContains(ARCS.stern, 113)).toBe(true);
    expect(arcContains(ARCS.stern, 247)).toBe(true);
    expect(arcContains(ARCS.stern, 111)).toBe(false);
    expect(arcContains(ARCS.stern, 249)).toBe(false);
  });

  it('shows an all-round light from everywhere', () => {
    for (let b = 0; b < 360; b += 7) expect(arcContains(ARCS['all-round'], b)).toBe(true);
  });

  it('accounts for the whole horizon with the masthead and stern arcs', () => {
    for (let b = 0; b < 360; b += 0.5) {
      const masthead = arcContains(ARCS.masthead, b);
      const stern = arcContains(ARCS.stern, b);
      expect(masthead !== stern || b === 112.5 || b === 247.5, `${b}`).toBe(true);
    }
  });
});

describe('projection', () => {
  const power: VesselState = { kind: 'power', lengthM: 140, makingWay: true };

  it('puts the red sidelight on the observer\'s right when head-on', () => {
    const lights = visibleLights(power, 0);
    const red = lights.find((l) => l.colour === 'red');
    const green = lights.find((l) => l.colour === 'green');
    expect(red).toBeDefined();
    expect(green).toBeDefined();
    expect(red!.x).toBeGreaterThan(0);
    expect(green!.x).toBeLessThan(0);
  });

  it('puts the masthead lights in a line when head-on, per Rule 14(b)', () => {
    const whites = visibleLights(power, 0).filter((l) => l.colour === 'white');
    expect(whites).toHaveLength(2);
    expect(Math.abs(whites[0]!.x - whites[1]!.x)).toBeLessThan(1e-9);
    expect(whites[0]!.y).not.toBe(whites[1]!.y);
  });

  it('separates the masthead lights as she turns away from end-on', () => {
    const whites = visibleLights(power, 50).filter((l) => l.colour === 'white');
    expect(Math.abs(whites[0]!.x - whites[1]!.x)).toBeGreaterThan(0.3);
  });

  it('shows only green from her starboard side and only red from her port side', () => {
    expect(visibleLights(power, 60).map((l) => l.colour)).toContain('green');
    expect(visibleLights(power, 60).map((l) => l.colour)).not.toContain('red');
    expect(visibleLights(power, 300).map((l) => l.colour)).toContain('red');
    expect(visibleLights(power, 300).map((l) => l.colour)).not.toContain('green');
  });

  it('shows a sternlight and no masthead light from dead astern', () => {
    const lights = visibleLights(power, 180);
    expect(lights).toHaveLength(1);
    expect(lights[0]!.colour).toBe('white');
  });

  it('puts her bow to the right when seen from her starboard beam', () => {
    const bow = project({ colour: 'white', kind: 'all-round', u: 0, v: 1, w: 0 }, 90);
    expect(bow.x).toBeGreaterThan(0.99);
  });
});

describe('vessel light definitions', () => {
  it('gives a power-driven vessel under 50 metres one masthead light', () => {
    const lights = lightsFor({ kind: 'power', lengthM: 30, makingWay: true });
    expect(lights.filter((l) => l.kind === 'masthead')).toHaveLength(1);
  });

  it('gives a power-driven vessel of 50 metres a second, higher, masthead light', () => {
    const lights = lightsFor({ kind: 'power', lengthM: 50, makingWay: true });
    const mast = lights.filter((l) => l.kind === 'masthead');
    expect(mast).toHaveLength(2);
    const [fwd, aft] = mast as [typeof mast[0], typeof mast[0]];
    expect(aft.w).toBeGreaterThan(fwd.w);
    expect(aft.v).toBeLessThan(fwd.v);
  });

  it('withholds sidelights and sternlight from a fishing vessel not making way', () => {
    const stopped = lightsFor({ kind: 'trawler', lengthM: 24, makingWay: false });
    expect(stopped.some((l) => l.kind.startsWith('side'))).toBe(false);
    expect(stopped.some((l) => l.kind === 'stern')).toBe(false);

    const moving = lightsFor({ kind: 'trawler', lengthM: 24, makingWay: true });
    expect(moving.some((l) => l.kind === 'stern')).toBe(true);
  });

  it('keeps a power-driven vessel\'s full lights whether or not she is making way', () => {
    const a = lightsFor({ kind: 'power', lengthM: 30, makingWay: true });
    const b = lightsFor({ kind: 'power', lengthM: 30, makingWay: false });
    expect(a).toEqual(b);
  });

  it('puts green over white on a trawler and red over white on other fishing', () => {
    const trawler = lightsFor({ kind: 'trawler', lengthM: 24, makingWay: false });
    const fishing = lightsFor({ kind: 'fishing', lengthM: 18, makingWay: false });
    const top = (ls: typeof trawler) =>
      ls.filter((l) => l.kind === 'all-round').sort((x, y) => y.w - x.w)[0]!.colour;
    expect(top(trawler)).toBe('green');
    expect(top(fishing)).toBe('red');
  });

  it('puts the trawler\'s masthead light above her green light at 50 metres and over', () => {
    const lights = lightsFor({ kind: 'trawler', lengthM: 62, makingWay: false });
    const green = lights.find((l) => l.colour === 'green')!;
    const mast = lights.find((l) => l.kind === 'masthead')!;
    expect(mast.w).toBeGreaterThan(green.w);
  });

  it('gives a tow of more than 200 metres three masthead lights, not two', () => {
    const short = lightsFor({ kind: 'towing', lengthM: 30, makingWay: true, towLengthM: 90 });
    const long = lightsFor({ kind: 'towing', lengthM: 30, makingWay: true, towLengthM: 260 });
    expect(short.filter((l) => l.kind === 'masthead')).toHaveLength(2);
    expect(long.filter((l) => l.kind === 'masthead')).toHaveLength(3);
    expect(long.some((l) => l.colour === 'yellow')).toBe(true);
  });

  it('gives a vessel aground her anchor lights as well as two reds', () => {
    const lights = lightsFor({ kind: 'aground', lengthM: 120, makingWay: false });
    expect(lights.filter((l) => l.colour === 'red')).toHaveLength(2);
    expect(lights.filter((l) => l.colour === 'white')).toHaveLength(2);
  });
});

describe('question generator', () => {
  const rng = () => createRng(20260921);

  it('always draws at least one light', () => {
    const r = rng();
    for (const vessel of VESSEL_POOL) {
      for (let i = 0; i < 20; i++) {
        const drill = composeLightDrill(vessel, r);
        expect(
          projectScene(lightsFor(drill.vessel), drill.aspectDeg).length,
          `${vessel.kind} at ${drill.aspectDeg}`,
        ).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('only ever draws one of the eight standard bearings', () => {
    const r = rng();
    for (const vessel of VESSEL_POOL) {
      for (let i = 0; i < 20; i++) {
        const { aspectDeg } = composeLightDrill(vessel, r);
        expect(CANONICAL_ASPECTS, `${vessel.kind}`).toContain(aspectDeg);
      }
    }
  });

  it('draws two or more lights whenever a standard bearing allows it', () => {
    const r = rng();
    // Derived, not listed: a vessel qualifies if any eligible standard bearing
    // shows her two lights. A plain sailing vessel qualifies only end-on; a
    // 7-metre motorboat showing a single all-round white never does.
    const hasRichAspect = (v: (typeof VESSEL_POOL)[number]) =>
      fairAspects(v).some((deg) => projectScene(lightsFor(v), deg).length >= 2);

    const rich = VESSEL_POOL.filter(hasRichAspect);
    expect(rich.length).toBeGreaterThan(VESSEL_POOL.length / 2);

    for (const vessel of rich) {
      for (let i = 0; i < 10; i++) {
        const drill = composeLightDrill(vessel, r);
        expect(
          projectScene(lightsFor(drill.vessel), drill.aspectDeg).length,
          `${vessel.kind} at ${drill.aspectDeg}`,
        ).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('never offers a distractor that produces the same picture as the answer', () => {
    const r = rng();
    for (const vessel of VESSEL_POOL) {
      for (let i = 0; i < 20; i++) {
        const { aspectDeg, distractors } = composeLightDrill(vessel, r);
        const sigs = [vessel, ...distractors].map((v) => signature(v, aspectDeg));
        expect(
          new Set(sigs).size,
          `${vessel.kind} at ${aspectDeg}: two options look the same`,
        ).toBe(sigs.length);
      }
    }
  });

  it('names every vessel that could be showing this picture in the answer', () => {
    // The invariant that matters. If a vessel in the pool shows identical
    // lights at this aspect and is not named in the correct option, the drill
    // is answerable by elimination while teaching something false — that
    // two sidelights and nothing else must be a vessel under tow, when they
    // are equally a sailing vessel.
    const r = rng();
    for (const vessel of VESSEL_POOL) {
      for (let i = 0; i < 15; i++) {
        const { question, aspectDeg } = composeLightDrill(vessel, r);
        const answerKey = signature(vessel, aspectDeg);
        const answerText = question.choices[0]!.text;

        for (const other of VESSEL_POOL) {
          if (signature(other, aspectDeg) !== answerKey) continue;
          // Case-insensitive: all but the first alternative have their article
          // lowercased so the option reads as one sentence.
          expect(
            answerText.toLowerCase(),
            `${vessel.kind} at ${aspectDeg}: "${describeVessel(other)}" shows the same lights but is not in the answer`,
          ).toContain(describeVessel(other).toLowerCase());
        }
      }
    }
  });

  it('collects a sailing vessel and a vessel under tow into one answer', () => {
    // Rule 24(e) gives the tow sidelights and a sternlight: exactly Rule 25(a).
    const sailing = VESSEL_POOL.find((v) => v.kind === 'sailing' && !v.tricolour && !v.optionalRedGreen)!;
    const group = sharedGroup(sailing, 0).map((v) => v.kind);
    expect(group).toContain('sailing');
    expect(group).toContain('towed');
  });

  it('collects a motorsailing yacht with a power-driven vessel of her size', () => {
    // Rule 3(b): with the engine engaged she is power-driven, and her lights
    // say nothing else.
    const motorsailing = VESSEL_POOL.find((v) => v.kind === 'motorsailing')!;
    expect(sharedGroup(motorsailing, 60).map((v) => v.kind)).toContain('power');
  });

  it('avoids bearings where almost everything looks the same', () => {
    // Dead astern nearly every vessel is one white sternlight. A question
    // asked from there would have a dozen right answers.
    const r = rng();
    for (const vessel of VESSEL_POOL) {
      for (let i = 0; i < 15; i++) {
        const { aspectDeg, group } = composeLightDrill(vessel, r);
        expect(
          group.length,
          `${vessel.kind} at ${aspectDeg}: ${group.length} vessels share this picture`,
        ).toBeLessThanOrEqual(3);
      }
    }
  });

  it('never offers a distractor worded the same as the answer', () => {
    const r = rng();
    for (const vessel of VESSEL_POOL) {
      for (let i = 0; i < 20; i++) {
        const q = composeLightDrill(vessel, r).question;
        const texts = q.choices.map((c) => c.text);
        expect(new Set(texts).size, `${vessel.kind}`).toBe(texts.length);
      }
    }
  });

  it('offers at least three options, the first of which is correct', () => {
    const r = rng();
    for (const vessel of VESSEL_POOL) {
      const q = composeLightDrill(vessel, r).question;
      expect(q.choices.length, `${vessel.kind}`).toBeGreaterThanOrEqual(3);
      expect(q.correct).toBe('a');
      expect(q.explanation.length).toBeGreaterThan(40);
    }
  });

  it('labels the view with the bearing it was drawn from', () => {
    expect(aspectLabel(0)).toBe('End-on');
    expect(aspectLabel(45)).toBe('Her starboard bow');
    expect(aspectLabel(90)).toBe('Her starboard beam');
    expect(aspectLabel(180)).toBe('Stern-on');
    expect(aspectLabel(315)).toBe('Her port bow');
  });

  it('exposes one source per concept, all marked generated', () => {
    const sources = lightSources();
    expect(sources.length).toBeGreaterThan(8);
    expect(sources.every((s) => s.generated)).toBe(true);
    expect(sources.every((s) => s.topic === 'lights')).toBe(true);
    expect(new Set(sources.map((s) => s.concept)).size).toBe(sources.length);
  });

  it('varies the picture across repeated draws of the same concept', () => {
    const r = rng();
    const source = lightSources().find((s) => s.concept === 'lights:power-over-50')!;
    const aspects = new Set<number>();
    for (let i = 0; i < 25; i++) {
      const scene = source.generate(r).scene;
      if (scene?.type !== 'lights') throw new Error('expected a light scene');
      aspects.add(scene.aspectDeg);
    }
    // Several standard views, not one memorised picture — but drawn from the
    // eight canonical bearings, so the count is small by design.
    expect(aspects.size).toBeGreaterThanOrEqual(3);
  });

  it('is reproducible from a seed, like the rest of the engine', () => {
    const a = composeLightDrill(VESSEL_POOL[4]!, createRng(99));
    const b = composeLightDrill(VESSEL_POOL[4]!, createRng(99));
    expect(a.aspectDeg).toBe(b.aspectDeg);
    expect(a.question.choices).toEqual(b.question.choices);
  });
});
