import { describe, expect, it } from 'vitest';
import {
  add,
  courseToSteer,
  ctsDiagram,
  direction,
  epDiagram,
  fromPolar,
  headingForWaterTrack,
  length,
  makeDiamond,
  norm360,
  oneInSixty,
  rateFor,
  rowFor,
  turn,
  waterTrackForHeading,
} from './model.ts';
import type { Vec } from './model.ts';
import {
  atlasDrill,
  diamondRowDrill,
  epFromDrDrill,
  epLeewayDrill,
  etaDrill,
  fullCtsDrill,
  interpolateDrill,
  leewayDrill,
  oneInSixtyDrill,
  tidalSources,
  trianglePickDrill,
} from './generator.ts';
import { createRng } from '../rng.ts';
import type { Question } from '../types.ts';

describe('tidal model', () => {
  it('rounds to the row centred on each hour', () => {
    expect(rowFor(-190)).toBe(-3); // 3h10m before
    expect(rowFor(-140)).toBe(-2); // 2h20m before
    expect(rowFor(25)).toBe(0);
    expect(rowFor(400)).toBe(6);
  });

  it('interpolates by range, and extrapolates beyond springs', () => {
    const h = { hour: 2, set: 90, spring: 3.0, neap: 1.5 };
    expect(rateFor(h, { meanSpring: 5, meanNeap: 2, today: 3.5 })).toBeCloseTo(2.25);
    expect(rateFor(h, { meanSpring: 5, meanNeap: 2, today: 5 })).toBeCloseTo(3.0);
    expect(rateFor(h, { meanSpring: 5, meanNeap: 2, today: 5.6 })).toBeCloseTo(3.3);
  });

  it('keeps neap rates at about half the springs and reverses the stream', () => {
    for (let set = 0; set < 360; set += 10) {
      for (const h of makeDiamond('A', 'X', set, 3, 0).hours) {
        expect(h.set, `set ${set}`).toBeGreaterThanOrEqual(0);
        expect(h.set, `set ${set}`).toBeLessThan(360);
      }
    }
    const d = makeDiamond('A', 'X', 60, 3, 0);
    for (const h of d.hours) expect(Math.abs(h.neap - h.spring / 2)).toBeLessThanOrEqual(0.051);
    const flood = d.hours.find((h) => h.hour === 3)!;
    const ebb = d.hours.find((h) => h.hour === -3)!;
    expect(Math.abs(turn(flood.set, ebb.set))).toBeGreaterThan(160);
  });

  it('solves the triangle so that the water track plus the stream lies on the ground track', () => {
    const rng = createRng(8);
    for (let i = 0; i < 500; i++) {
      const track = rng.next() * 360;
      const speed = 4 + rng.next() * 4;
      const stream = fromPolar(rng.next() * 360, rng.next() * 3);
      const cts = courseToSteer(track, speed, stream);
      if (!cts) continue;
      const ground = add(fromPolar(cts.waterTrack, speed), stream);
      expect(Math.abs(turn(direction(ground), track))).toBeLessThan(1e-6);
      expect(length(ground)).toBeCloseTo(cts.sog, 6);
    }
  });

  it('makes one in sixty a fair estimate below about twenty degrees', () => {
    for (let c = 0.2; c <= 1.8; c += 0.2) {
      const speed = 6;
      const exact = (Math.asin(c / speed) * 180) / Math.PI;
      expect(Math.abs(exact - oneInSixty(c, speed))).toBeLessThan(1);
    }
  });

  it('applies leeway downwind, and steers into the wind to undo it', () => {
    expect(waterTrackForHeading(90, 5, 'port')).toBe(95);
    expect(headingForWaterTrack(90, 5, 'port')).toBe(85);
    expect(headingForWaterTrack(90, 5, 'starboard')).toBe(95);
    expect(waterTrackForHeading(headingForWaterTrack(200, 7, 'starboard'), 7, 'starboard')).toBe(200);
  });

  it('draws a CTS whose ground leg lies on the track, and an EP whose ground leg ends at the EP', () => {
    const stream: Vec = fromPolar(160, 1.5);
    const d = ctsDiagram(45, 9, 6, stream);
    const ground = d.segments.find((s) => s.kind === 'ground')!;
    expect(Math.abs(turn(direction(ground.to), 45))).toBeLessThan(1e-6);
    const water = d.segments.find((s) => s.kind === 'water')!;
    expect(length([water.to[0] - water.from[0], water.to[1] - water.from[1]])).toBeCloseTo(6, 6);
    const e = epDiagram(45, 6, stream);
    const g = e.segments.find((s) => s.kind === 'ground')!;
    expect(g.to).toEqual(e.ep);
  });
});

// --- every drill recomputed from its own words -------------------------------

function num(re: RegExp, text: string): number {
  const m = re.exec(text);
  if (!m) throw new Error(`no match for ${re} in: ${text}`);
  return Number(m[1]);
}

const answerOf = (q: Question) => q.choices.find((c) => c.id === q.correct)?.text ?? '';

function sample(make: (rng: ReturnType<typeof createRng>) => Question, n = 250): Question[] {
  const rng = createRng(4040);
  return Array.from({ length: n }, () => make(rng));
}

function streamIn(text: string, re = /stream[^.]*?(\d{3})°[^\d]*?(\d+\.\d) kn/): Vec {
  const m = re.exec(text);
  if (!m) throw new Error(`no stream in: ${text}`);
  return fromPolar(Number(m[1]), Number(m[2]));
}

describe('tidal drills give the answer the vectors give', () => {
  it('reads the right row of the diamond', () => {
    for (const q of sample(diamondRowDrill)) {
      if (q.scene?.type !== 'tidal-diamond') throw new Error('no table');
      const hw = /HW Portmoor is at (\d\d)(\d\d)/.exec(q.prompt)!;
      const at = /expect at (\d\d)(\d\d)/.exec(q.prompt)!;
      let offset = Number(at[1]) * 60 + Number(at[2]) - (Number(hw[1]) * 60 + Number(hw[2]));
      if (offset > 720) offset -= 1440;
      if (offset < -720) offset += 1440;
      const row = q.scene.diamond.hours.find((h) => h.hour === rowFor(offset))!;
      expect(answerOf(q), q.prompt).toBe(
        `${String(row.set).padStart(3, '0')}° at ${row.spring.toFixed(1)} kn`,
      );
    }
  });

  it('interpolates the rate', () => {
    for (const q of sample(interpolateDrill)) {
      const sp = num(/(\d\.\d) kn at springs/, q.prompt);
      const np = num(/(\d\.\d) kn at neaps/, q.prompt);
      const ms = num(/mean spring range is (\d\.\d)/, q.prompt);
      const mn = num(/mean neap range (\d\.\d)/, q.prompt);
      const t = num(/today's range is (\d\.\d)/, q.prompt);
      const rate = np + ((sp - np) * (t - mn)) / (ms - mn);
      expect(Math.abs(num(/(\d+\.\d) kn/, answerOf(q)) - rate), q.prompt).toBeLessThanOrEqual(0.051);
      // Done in the head: no rounding needed, the sum comes out in tenths.
      expect(Math.abs(rate * 10 - Math.round(rate * 10)), q.prompt).toBeLessThan(1e-9);
    }
  });

  it('decodes atlas figures, neaps first in tenths', () => {
    for (const q of sample(atlasDrill, 50)) {
      const m = /"(\d+),(\d+)"/.exec(q.prompt)!;
      expect(answerOf(q)).toBe(
        `${(Number(m[1]) / 10).toFixed(1)} kn at neaps, ${(Number(m[2]) / 10).toFixed(1)} kn at springs`,
      );
    }
  });

  it('steers up-tide by one in sixty, within a degree of the exact triangle', () => {
    for (const q of sample(oneInSixtyDrill)) {
      const track = num(/bears (\d{3})°T/, q.prompt);
      const speed = num(/make ([\d.]+) kn/, q.prompt);
      const stream = streamIn(q.prompt, /sets (\d{3})° at (\d\.\d) kn/);
      const cts = courseToSteer(track, speed, stream)!;
      // Straight across, so the whole stream is cross-stream …
      expect(Math.abs(cts.along), q.prompt).toBeLessThan(1e-9);
      // … and the rule gives whole degrees.
      const est = oneInSixty(cts.cross, speed);
      expect(Number.isInteger(Math.round(est * 1e6) / 1e6), q.prompt).toBe(true);
      const answer = num(/(\d{3})°T/, answerOf(q));
      expect(answer, q.prompt).toBe(norm360(track - est));
      expect(Math.abs(turn(answer, cts.waterTrack)), q.prompt).toBeLessThan(1);
    }
  });

  it('allows for stream, then leeway, then variation — all mental', () => {
    for (const q of sample(fullCtsDrill)) {
      const track = num(/bears (\d{3})°T/, q.prompt);
      const speed = num(/at ([\d.]+) kn\. The stream/, q.prompt);
      const stream = streamIn(q.prompt, /hour: (\d{3})°, (\d\.\d) kn/);
      const leeway = num(/expect (\d+)° of leeway/, q.prompt);
      const side = /wind is on your (port|starboard)/.exec(q.prompt)![1] as 'port' | 'starboard';
      const v = /Variation (\d)°([EW])/.exec(q.prompt)!;
      const variation = Number(v[1]) * (v[2] === 'W' ? -1 : 1);
      const cts = courseToSteer(track, speed, stream)!;
      const water = norm360(track - oneInSixty(cts.cross, speed));
      const expected = Math.round(norm360(headingForWaterTrack(water, leeway, side) - variation)) % 360;
      expect(num(/(\d{3})°M/, answerOf(q)), q.prompt).toBe(expected);
      // And a plotter would agree to within a degree.
      const exact = norm360(headingForWaterTrack(cts.waterTrack, leeway, side) - variation);
      expect(Math.abs(turn(expected, exact)), q.prompt).toBeLessThan(1.5);
    }
  });

  it('gives an arrival time from speed over the ground, in whole quarter hours', () => {
    for (const q of sample(etaDrill)) {
      const start = /At (\d\d)(\d\d)/.exec(q.prompt)!;
      const distance = num(/is ([\d.]+) M away/, q.prompt);
      const track = num(/on (\d{3})°T/, q.prompt);
      const speed = num(/make (\d) kn/, q.prompt);
      const stream = streamIn(q.prompt, /sets (\d{3})° at (\d\.\d) kn/);
      const along = stream[0] * Math.sin((track * Math.PI) / 180) + stream[1] * Math.cos((track * Math.PI) / 180);
      const minutes = (distance / (speed + along)) * 60;
      expect(minutes % 30, q.prompt).toBeCloseTo(0, 6);
      const t = Number(start[1]) * 60 + Number(start[2]) + minutes;
      expect(answerOf(q), q.prompt).toBe(
        `${String(Math.floor(t / 60) % 24).padStart(2, '0')}${String(Math.round(t % 60)).padStart(2, '0')}`,
      );
    }
  });

  it('points up into the wind for leeway', () => {
    for (const q of sample(leewayDrill, 100)) {
      const track = num(/water track of (\d{3})°T/, q.prompt);
      const leeway = num(/estimate (\d+)° of leeway/, q.prompt);
      const side = /wind on your (port|starboard) bow/.exec(q.prompt)![1] as 'port' | 'starboard';
      expect(num(/(\d{3})°T/, answerOf(q))).toBe(headingForWaterTrack(track, leeway, side));
    }
  });

  it('puts the EP the stream’s drift from the DR, towards its set', () => {
    for (const q of sample(epFromDrDrill)) {
      const rate = num(/at (\d\.\d) kn\. Where/, q.prompt);
      const set = num(/averages (\d{3})°/, q.prompt);
      const hours = /for an hour/.test(q.prompt) ? 1 : /for half an hour/.test(q.prompt) ? 0.5 : num(/for ([\d.]+) hours/, q.prompt);
      // A product for the head: whole hours, or a rate that halves to a tenth.
      expect(Number.isInteger(hours) || (rate * 10) % 2 === 0, q.prompt).toBe(true);
      expect(answerOf(q), q.prompt).toBe(
        `${(Math.round(rate * hours * 10) / 10).toFixed(1)} M towards ${String(set).padStart(3, '0')}° from the DR`,
      );
    }
  });

  it('lays the distance run downwind of the heading', () => {
    for (const q of sample(epLeewayDrill, 100)) {
      const heading = num(/steered (\d{3})°T/, q.prompt);
      const leeway = num(/estimate (\d+)° of leeway/, q.prompt);
      const side = /wind on the (port|starboard) side/.exec(q.prompt)![1] as 'port' | 'starboard';
      expect(num(/(\d{3})°T/, answerOf(q))).toBe(waterTrackForHeading(heading, leeway, side));
    }
  });

  it('marks exactly one diagram right in each pick', () => {
    for (const target of ['cts', 'ep'] as const) {
      for (const q of sample((rng) => trianglePickDrill(rng, target), 100)) {
        if (q.scene?.type !== 'tidal-pick') throw new Error('no diagrams');
        expect(q.scene.diagrams).toHaveLength(4);
        const letter = answerOf(q).slice(-1);
        const d = q.scene.diagrams['ABCD'.indexOf(letter)]!;
        if (target === 'ep') expect(d.ep, q.explanation).toBeDefined();
        else {
          // The right CTS: stream from the start, water leg from its end to the track.
          const tide = d.segments.find((s) => s.kind === 'tide')!;
          expect(tide.from).toEqual(d.start);
          expect(d.ep).toBeUndefined();
        }
      }
    }
  });
});

describe('tidal drill options', () => {
  const all = [
    diamondRowDrill,
    interpolateDrill,
    atlasDrill,
    oneInSixtyDrill,
    fullCtsDrill,
    etaDrill,
    leewayDrill,
    epFromDrDrill,
    epLeewayDrill,
    (rng: ReturnType<typeof createRng>) => trianglePickDrill(rng, 'cts'),
    (rng: ReturnType<typeof createRng>) => trianglePickDrill(rng, 'ep'),
  ].flatMap((d) => sample(d, 100));

  it('always offers four distinct options with one correct', () => {
    for (const q of all) {
      expect(q.choices, q.id).toHaveLength(4);
      expect(new Set(q.choices.map((c) => c.text)).size, `${q.id}: ${q.choices.map((c) => c.text)}`).toBe(4);
      expect(q.choices.filter((c) => c.id === q.correct), q.id).toHaveLength(1);
    }
  });

  it('exposes one source per drill, each generating its own concept', () => {
    const sources = tidalSources();
    expect(new Set(sources.map((s) => s.concept)).size).toBe(sources.length);
    const rng = createRng(3);
    for (const s of sources) expect(s.generate(rng).concept).toBe(s.concept);
  });
});
