import { describe, expect, it } from 'vitest';
import { ALL_MARKS, MARKS, describeMark, markAt } from './model.ts';
import { allBuoyDrills, buoyageSources, composeBuoyDrill } from './generator.ts';
import { createRng } from '../rng.ts';

describe('IALA Region A marks', () => {
  it('gives every mark a light whose segments fill its period exactly', () => {
    for (const mark of ALL_MARKS) {
      const total = mark.light.segments.reduce((n, s) => n + s.ms, 0);
      expect(total, `${mark.kind} (${mark.light.label})`).toBe(mark.light.periodMs);
    }
  });

  it('gives every mark a light that is sometimes lit and sometimes dark', () => {
    for (const mark of ALL_MARKS) {
      expect(mark.light.segments.some((s) => s.colour !== null), mark.kind).toBe(true);
      expect(mark.light.segments.some((s) => s.colour === null), mark.kind).toBe(true);
    }
  });

  it('counts the cardinal flashes round the clock face', () => {
    const count = (kind: Parameters<typeof markAt>[0]) =>
      markAt(kind).light.segments.filter((s) => s.colour !== null).length;
    expect(count('cardinal-e')).toBe(3);
    expect(count('cardinal-s')).toBe(7); // six quick flashes plus the long one
    expect(count('cardinal-w')).toBe(9);
    expect(count('cardinal-n')).toBe(1); // continuous, one flash per period
  });

  it('ends the south cardinal group with a long flash', () => {
    const lit = MARKS['cardinal-s'].light.segments.filter((s) => s.colour !== null);
    const last = lit[lit.length - 1]!;
    expect(last.ms).toBeGreaterThanOrEqual(2000);
    expect(lit.slice(0, -1).every((s) => s.ms < 500)).toBe(true);
  });

  it('puts the black band where the cardinal cones point', () => {
    expect(MARKS['cardinal-n'].body.colours).toEqual(['black', 'yellow']);
    expect(MARKS['cardinal-s'].body.colours).toEqual(['yellow', 'black']);
    expect(MARKS['cardinal-e'].body.colours).toEqual(['black', 'yellow', 'black']);
    expect(MARKS['cardinal-w'].body.colours).toEqual(['yellow', 'black', 'yellow']);
  });

  it('keeps Region A lateral colours and shapes together', () => {
    expect(MARKS['lateral-port'].shape).toBe('can');
    expect(MARKS['lateral-port'].body.colours).toEqual(['red']);
    expect(MARKS['lateral-stbd'].shape).toBe('conical');
    expect(MARKS['lateral-stbd'].body.colours).toEqual(['green']);
  });

  it('builds a preferred channel mark from a lateral body and a contrasting band', () => {
    // Red body, green band: a port-hand mark, so leave it to port, and the
    // main channel lies to starboard.
    expect(MARKS['preferred-stbd'].body.colours).toEqual(['red', 'green', 'red']);
    expect(MARKS['preferred-stbd'].shape).toBe('can');
    expect(MARKS['preferred-port'].body.colours).toEqual(['green', 'red', 'green']);
    expect(MARKS['preferred-port'].shape).toBe('conical');
  });

  it('uses composite group flashing only for the preferred channel marks', () => {
    const composite = ALL_MARKS.filter((m) => m.light.label.includes('+1'));
    expect(composite.map((m) => m.kind).sort()).toEqual(['preferred-port', 'preferred-stbd']);
  });

  it('agrees the isolated danger topmark with its rhythm', () => {
    expect(MARKS['isolated-danger'].topmark).toBe('spheres');
    expect(
      MARKS['isolated-danger'].light.segments.filter((s) => s.colour !== null),
    ).toHaveLength(2);
  });

  it('uses blue nowhere except the emergency wreck buoy', () => {
    const withBlue = ALL_MARKS.filter(
      (m) =>
        m.body.colours.includes('blue') || m.light.segments.some((s) => s.colour === 'blue'),
    );
    expect(withBlue.map((m) => m.kind)).toEqual(['emergency-wreck']);
  });

  it('gives red and green lights only to lateral marks', () => {
    for (const mark of ALL_MARKS) {
      const colours = new Set(mark.light.segments.map((s) => s.colour).filter(Boolean));
      if (colours.has('red') || colours.has('green')) {
        expect(mark.kind, `${mark.kind} has a lateral-coloured light`).toMatch(
          /^(lateral|preferred)-/,
        );
      }
    }
  });
});

describe('buoyage drills', () => {
  it('offers four distinct options with the first correct', () => {
    for (const drill of allBuoyDrills(createRng(5))) {
      const texts = drill.question.choices.map((c) => c.text);
      expect(new Set(texts).size, drill.kind).toBe(texts.length);
      expect(texts.length).toBeGreaterThanOrEqual(3);
      expect(drill.question.correct).toBe('a');
      expect(texts[0]).toBe(describeMark(drill.kind));
    }
  });

  it('never offers the same mark twice in one question', () => {
    for (const drill of allBuoyDrills(createRng(9))) {
      expect(drill.distractors).not.toContain(drill.kind);
      expect(new Set(drill.distractors).size).toBe(drill.distractors.length);
    }
  });

  it('never names the light character in a night question', () => {
    for (const mark of ALL_MARKS) {
      const q = composeBuoyDrill(mark.kind, 'night', createRng(2)).question;
      expect(q.prompt).not.toContain(mark.light.label);
      for (const choice of q.choices) {
        expect(choice.text, `${mark.kind}: the answer gives the character away`).not.toContain(
          mark.light.label,
        );
      }
    }
  });

  it('carries a buoy scene in the right mode', () => {
    for (const drill of allBuoyDrills(createRng(4))) {
      expect(drill.question.scene?.type).toBe('buoy');
      if (drill.question.scene?.type !== 'buoy') throw new Error('expected a buoy scene');
      expect(drill.question.scene.kind).toBe(drill.kind);
      expect(drill.question.scene.mode).toBe(drill.mode);
    }
  });

  it('explains what to do about the mark, not just what it is', () => {
    for (const drill of allBuoyDrills(createRng(6))) {
      expect(drill.question.explanation.length, drill.kind).toBeGreaterThan(60);
      expect(drill.question.teachingNote, drill.kind).toBeTruthy();
    }
  });

  it('exposes a day and a night source for every mark', () => {
    const sources = buoyageSources();
    expect(sources).toHaveLength(ALL_MARKS.length * 2);
    expect(new Set(sources.map((s) => s.concept)).size).toBe(sources.length);
    expect(sources.every((s) => s.topic === 'buoyage' && s.generated)).toBe(true);
  });
});
