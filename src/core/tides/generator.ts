import type { Question, QuestionSource, Rng, Scene } from '../types.ts';
import { pick } from '../rng.ts';
import type { Differences } from './model.ts';
import {
  TWELFTHS,
  clearanceNow,
  depthOver,
  depthOverDrying,
  heightDifferenceAt,
  timeDifferenceAt,
  twelfthsHeight,
} from './model.ts';

/**
 * Tidal height drills, done in the head.
 *
 * Every number is to a tenth of a metre and every sum is an addition or a
 * subtraction; ranges for the rule of twelfths divide by twelve; secondary
 * port interpolations fall exactly on a tabulated value or half way between.
 * After answering, the app draws the levels or the curve. Ports and figures
 * are invented.
 */

type Topic = Question['topic'];

const PORT = 'Portmoor';

function mcq(
  id: string,
  topic: Topic,
  concept: string,
  prompt: string,
  answer: string,
  distractors: string[],
  explanation: string,
  difficulty: Question['difficulty'],
  afterScene?: Scene,
): Question {
  return {
    id,
    topic,
    concept,
    prompt,
    choices: [answer, ...distractors].map((text, i) => ({
      id: String.fromCharCode(97 + i),
      text,
    })),
    correct: 'a',
    ruleRefs: ['Tidal heights'],
    explanation,
    difficulty,
    afterScene,
  };
}

const r1 = (x: number) => Math.round(x * 10) / 10;
const m = (x: number) => `${x.toFixed(1)} m`;

/** A tenth of a metre between 0 and `max`, never 0. */
function tenths(rng: Rng, lo: number, hi: number): number {
  return r1(lo + Math.floor(rng.next() * Math.round((hi - lo) * 10 + 1)) / 10);
}

function wrongMetres(answer: number, candidates: number[], gap = 0.3): number[] {
  const chosen: number[] = [];
  for (const c of candidates.map(r1)) {
    if ([answer, ...chosen].every((x) => Math.abs(x - c) >= gap - 1e-9)) chosen.push(c);
    if (chosen.length === 3) break;
  }
  return chosen;
}

function clock(minutes: number): string {
  const v = ((Math.round(minutes) % 1440) + 1440) % 1440;
  return `${String(Math.floor(v / 60)).padStart(2, '0')}${String(v % 60).padStart(2, '0')}`;
}

// --- levels and datum --------------------------------------------------------

function depthDrill(rng: Rng): Question {
  for (;;) {
    const charted = tenths(rng, 0.5, 6);
    const hot = tenths(rng, 0.4, 5.5);
    const answer = r1(depthOver(charted, hot));
    const wrong = wrongMetres(answer, [Math.abs(hot - charted), charted, hot, answer + hot]);
    if (wrong.length < 3) continue;
    return mcq(
      `tds-depth-${charted}-${hot}`,
      'tides-levels',
      'tides:depth-over-sounding',
      `The chart shows a sounding of ${charted.toFixed(1)} m where you intend to anchor. The height of tide is ${hot.toFixed(1)} m. How much water is there?`,
      m(answer),
      wrong.map(m),
      `Soundings are measured down from chart datum; the height of tide is the sea's height above chart datum. So the depth is the two added: ${charted.toFixed(1)} + ${hot.toFixed(1)} = ${m(answer)}.`,
      1,
      { type: 'tide-levels', levels: { heightOfTide: hot, chartedDepth: charted } },
    );
  }
}

function dryingDrill(rng: Rng): Question {
  for (;;) {
    const drying = tenths(rng, 0.3, 2.5);
    const hot = tenths(rng, drying + 0.5, drying + 4);
    const answer = r1(depthOverDrying(drying, hot));
    const wrong = wrongMetres(answer, [hot + drying, hot, drying, answer + 1]);
    if (wrong.length < 3) continue;
    return mcq(
      `tds-dry-${drying}-${hot}`,
      'tides-levels',
      'tides:depth-over-drying',
      `A bank is charted with an underlined figure: ${drying.toFixed(1)}. The height of tide is ${hot.toFixed(1)} m. How much water is over the bank?`,
      m(answer),
      wrong.map(m),
      `An underlined figure is a drying height — above chart datum, uncovered at low water. The sea has to cover it first: ${hot.toFixed(1)} − ${drying.toFixed(1)} = ${m(answer)}. Adding it, as for a sounding, is the classic slip.`,
      1,
      { type: 'tide-levels', levels: { heightOfTide: hot, dryingHeight: drying } },
    );
  }
}

function clearanceDrill(rng: Rng): Question {
  for (;;) {
    const hat = tenths(rng, 4, 6.5);
    const cleared = pick([12, 14, 15, 16, 18, 20, 22], rng);
    const hot = tenths(rng, 0.5, hat - 0.5);
    const answer = r1(clearanceNow(cleared, hat, hot));
    const wrong = wrongMetres(answer, [cleared, cleared + hot, cleared - hot, cleared + hat]);
    if (wrong.length < 3) continue;
    return mcq(
      `tds-clear-${cleared}-${hat}-${hot}`,
      'tides-levels',
      'tides:bridge-clearance',
      `A bridge's vertical clearance is charted as ${cleared.toFixed(1)} m; the chart notes say clearances are above HAT, which here is ${hat.toFixed(1)} m. The height of tide is ${hot.toFixed(1)} m. How much clearance is there now?`,
      m(answer),
      wrong.map(m),
      `The charted clearance is what is left at the highest astronomical tide. Now the sea is ${(hat - hot).toFixed(1)} m below HAT (${hat.toFixed(1)} − ${hot.toFixed(1)}), so there is that much more: ${cleared.toFixed(1)} + ${(hat - hot).toFixed(1)} = ${m(answer)}. Leave a margin for waves and a surge.`,
      2,
      { type: 'tide-levels', levels: { heightOfTide: hot, hat, clearance: cleared } },
    );
  }
}

function crossBankDrill(rng: Rng): Question {
  for (;;) {
    const drying = tenths(rng, 0.2, 2);
    const draught = pick([1.2, 1.5, 1.6, 1.8, 1.9, 2.1], rng);
    const margin = pick([0.3, 0.5, 1.0], rng);
    const answer = r1(drying + draught + margin);
    const wrong = wrongMetres(answer, [draught + margin - drying, draught + margin, drying + draught, answer + draught]);
    if (wrong.length < 3) continue;
    return mcq(
      `tds-bank-${drying}-${draught}-${margin}`,
      'tides-levels',
      'tides:height-to-cross',
      `To cross a bar that dries ${drying.toFixed(1)} m, drawing ${draught.toFixed(1)} m and wanting ${margin.toFixed(1)} m under the keel, what height of tide do you need?`,
      m(answer),
      wrong.map(m),
      `The sea must first cover the ${drying.toFixed(1)} m drying height, then float the ${draught.toFixed(1)} m draught, then leave ${margin.toFixed(1)} m: ${drying.toFixed(1)} + ${draught.toFixed(1)} + ${margin.toFixed(1)} = ${m(answer)}. Then find from the tables when the tide reaches it.`,
      2,
      { type: 'tide-levels', levels: { heightOfTide: answer, dryingHeight: drying, draught } },
    );
  }
}

function anchorAtLowWaterDrill(rng: Rng): Question {
  for (;;) {
    const now = tenths(rng, 4, 6);
    const lw = tenths(rng, 0.3, 1.5);
    const sounder = tenths(rng, 5, 10);
    const answer = r1(sounder - (now - lw));
    if (answer < 1) continue;
    const wrong = wrongMetres(answer, [sounder - now, sounder - lw, sounder + (now - lw), sounder]);
    if (wrong.length < 3) continue;
    return mcq(
      `tds-anchor-${now}-${lw}-${sounder}`,
      'tides-levels',
      'tides:depth-at-low-water',
      `You anchor at high water, height of tide ${now.toFixed(1)} m, and the echo sounder reads ${sounder.toFixed(1)} m of water. Low water tonight will be ${lw.toFixed(1)} m. How much water will you have at low water?`,
      m(answer),
      wrong.map(m),
      `The sea will fall by the difference between the two heights: ${now.toFixed(1)} − ${lw.toFixed(1)} = ${(now - lw).toFixed(1)} m. So ${sounder.toFixed(1)} − ${(now - lw).toFixed(1)} = ${m(answer)} at low water. Check that against your draught and swinging room before settling for the night.`,
      2,
    );
  }
}

// --- the rule of twelfths ----------------------------------------------------

/** Ranges that divide by twelve, so each twelfth is a round figure. */
const RANGES = [2.4, 3.6, 4.8, 6.0];

function twelfthsHeightDrill(rng: Rng): Question {
  for (;;) {
    const range = pick(RANGES, rng);
    const lw = pick([0.5, 1.0], rng);
    const hw = r1(lw + range);
    const rising = rng.next() < 0.5;
    const hours = pick([1, 2, 3, 4, 5], rng);
    const start = 6 * 60 + Math.floor(rng.next() * 24) * 30;
    const answer = r1(twelfthsHeight(lw, hw, hours, rising));
    const linear = rising ? lw + (range * hours) / 6 : hw - (range * hours) / 6;
    const opposite = r1(twelfthsHeight(lw, hw, hours, !rising));
    const nextHour = hours < 6 ? r1(twelfthsHeight(lw, hw, hours + 1, rising)) : answer;
    const wrong = wrongMetres(answer, [linear, opposite, nextHour, r1(twelfthsHeight(lw, hw, hours - 1, rising))], 0.2);
    if (wrong.length < 3) continue;
    const from = rising ? 'LW' : 'HW';
    const twelfths = TWELFTHS[hours] as number;
    return mcq(
      `tds-12h-${range}-${lw}-${rising}-${hours}`,
      'tides-heights',
      'tides:twelfths-height',
      `At ${PORT}, ${from} is at ${clock(start)}: LW ${lw.toFixed(1)} m, HW ${hw.toFixed(1)} m, about six hours apart. By the rule of twelfths, what is the height of tide at ${clock(start + hours * 60)}?`,
      m(answer),
      wrong.map(m),
      `Range ${hw.toFixed(1)} − ${lw.toFixed(1)} = ${range.toFixed(1)} m, so a twelfth is ${(range / 12).toFixed(1)} m. The tide moves 1, 2, 3, 3, 2, 1 twelfths in successive hours: after ${hours} hour${hours > 1 ? 's' : ''} it has ${rising ? 'risen' : 'fallen'} ${twelfths} twelfths, ${((range * twelfths) / 12).toFixed(1)} m. ${rising ? `${lw.toFixed(1)} + ` : `${hw.toFixed(1)} − `}${((range * twelfths) / 12).toFixed(1)} = ${m(answer)}. A straight-line guess gives ${m(r1(linear))}, wrong because the tide is slowest near HW and LW.`,
      2,
      { type: 'tide-curve', curve: { lw, hw, rising, markHours: hours, startClock: start } },
    );
  }
}

function twelfthsTimeDrill(rng: Rng): Question {
  for (;;) {
    const range = pick(RANGES, rng);
    const lw = pick([0.5, 1.0], rng);
    const hw = r1(lw + range);
    const hours = pick([1, 2, 3, 4, 5], rng);
    const target = r1(twelfthsHeight(lw, hw, hours, true));
    const start = 5 * 60 + Math.floor(rng.next() * 24) * 30;
    const linearHours = ((target - lw) / range) * 6;
    const at = (h: number) => clock(start + h * 60);
    const candidates = [at(Math.round(linearHours * 2) / 2), at(hours + 1), at(hours - 1), at(6 - hours)];
    const answer = at(hours);
    const unique = [...new Set(candidates.filter((c) => c !== answer))];
    if (unique.length < 3 || hours - 1 < 0) continue;
    return mcq(
      `tds-12t-${range}-${lw}-${hours}`,
      'tides-heights',
      'tides:twelfths-time',
      `At ${PORT}, LW is at ${clock(start)}, ${lw.toFixed(1)} m, and HW about six hours later, ${hw.toFixed(1)} m. You need ${target.toFixed(1)} m of tide to leave the harbour. By the rule of twelfths, from when is there enough?`,
      answer,
      unique.slice(0, 3),
      `You need ${(target - lw).toFixed(1)} m of rise out of a ${range.toFixed(1)} m range: ${Math.round(((target - lw) / range) * 12)} twelfths. The tide rises 1, 3, 6, 9, 11, 12 twelfths by the end of each hour, so that is reached after ${hours} hour${hours > 1 ? 's' : ''}: ${answer}.`,
      2,
      { type: 'tide-curve', curve: { lw, hw, rising: true, markHours: hours, startClock: start } },
    );
  }
}

// --- secondary ports ---------------------------------------------------------

function someDifferences(rng: Rng): Differences {
  const t1 = pick([0, 60, 120], rng);
  const a = pick([-40, -30, -20, -10, 10, 20, 30, 40], rng);
  const b = a + pick([-20, 20, 40, -40], rng);
  const sp = pick([4.4, 4.8, 5.2, 5.6], rng);
  const np = r1(sp - pick([1.0, 1.2, 1.6], rng));
  const hs = pick([-0.8, -0.6, -0.4, -0.2, 0.2, 0.4], rng);
  const hn = r1(hs + pick([-0.2, 0.2, 0.4], rng));
  return { times: [t1, t1 + 360], timeDiff: [a, b], levels: [sp, np], heightDiff: [hs, hn] };
}

function signedMin(x: number): string {
  const s = x < 0 ? '−' : '+';
  const v = Math.abs(Math.round(x));
  return `${s}${String(Math.floor(v / 60)).padStart(2, '0')}${String(v % 60).padStart(2, '0')}`;
}

function signedM(x: number): string {
  return `${x < 0 ? '−' : '+'}${Math.abs(x).toFixed(1)}`;
}

function differencesText(d: Differences): string {
  return `HW time differences: ${signedMin(d.timeDiff[0])} when HW ${PORT} is at ${clock(d.times[0])} and ${clock(d.times[0] + 720)}; ${signedMin(d.timeDiff[1])} when it is at ${clock(d.times[1])} and ${clock(d.times[1] + 720)}. Height differences: ${signedM(d.heightDiff[0])} m at MHWS (${d.levels[0].toFixed(1)} m), ${signedM(d.heightDiff[1])} m at MHWN (${d.levels[1].toFixed(1)} m).`;
}

function secondaryTimeDrill(rng: Rng): Question {
  for (;;) {
    const d = someDifferences(rng);
    const where = pick([0, 0.5, 1], rng);
    const standardHw = d.times[0] + (d.times[1] - d.times[0]) * where + pick([0, 720], rng);
    const diff = timeDifferenceAt(d, d.times[0] + (d.times[1] - d.times[0]) * where);
    const answer = clock(standardHw + diff);
    const candidates = [
      clock(standardHw - diff),
      clock(standardHw + d.timeDiff[where === 1 ? 0 : 1]),
      clock(standardHw),
      clock(standardHw + d.timeDiff[0] + d.timeDiff[1]),
    ];
    const unique = [...new Set(candidates.filter((c) => c !== answer))];
    if (unique.length < 3) continue;
    return mcq(
      `tds-sectime-${d.times[0]}-${d.timeDiff.join('_')}-${where}-${standardHw}`,
      'tides-secondary',
      'tides:secondary-time',
      `HW ${PORT} (the standard port) is at ${clock(standardHw)}. For the secondary port the almanac gives: ${differencesText(d)} When is HW at the secondary port?`,
      answer,
      unique.slice(0, 3),
      `${where === 0.5 ? `${clock(standardHw)} is half way between the tabulated times, so the difference is half way too: ${signedMin(diff)}.` : `${clock(standardHw)} is a tabulated time, so its difference applies as it stands: ${signedMin(diff)}.`} ${clock(standardHw)} ${signedMin(diff)} = ${answer}. Differences are applied to the standard port's time with their sign; in the almanac, remember to add an hour for summer time if the tables are in UT.`,
      2,
    );
  }
}

function secondaryHeightDrill(rng: Rng): Question {
  for (;;) {
    const d = someDifferences(rng);
    const where = pick([0, 0.5, 1], rng);
    const standard = r1(d.levels[1] + (d.levels[0] - d.levels[1]) * where);
    const diff = r1(heightDifferenceAt(d, standard));
    const answer = r1(standard + diff);
    const wrong = wrongMetres(
      answer,
      [standard - diff, standard + d.heightDiff[where === 1 ? 1 : 0], standard, standard + (d.heightDiff[0] + d.heightDiff[1])],
      0.2,
    );
    if (wrong.length < 3) continue;
    const range = where === 1 ? 'springs' : where === 0 ? 'neaps' : 'half way between neaps and springs';
    return mcq(
      `tds-secht-${d.levels.join('_')}-${d.heightDiff.join('_')}-${where}`,
      'tides-secondary',
      'tides:secondary-height',
      `Today's HW at ${PORT} is ${standard.toFixed(1)} m. For the secondary port the almanac gives: ${differencesText(d)} What is the height of HW at the secondary port?`,
      m(answer),
      wrong.map(m),
      `${standard.toFixed(1)} m is ${range === 'springs' ? 'MHWS' : range === 'neaps' ? 'MHWN' : 'half way from MHWN to MHWS'}, so the height difference is ${range === 'springs' ? 'the spring one' : range === 'neaps' ? 'the neap one' : 'half way between the two'}: ${signedM(diff)} m. ${standard.toFixed(1)} ${signedM(diff)} = ${m(answer)}.`,
      2,
    );
  }
}

// --- sources -----------------------------------------------------------------

export function tidesSources(): QuestionSource[] {
  const drills: [string, Topic, Question['difficulty'], (rng: Rng) => Question][] = [
    ['tides:depth-over-sounding', 'tides-levels', 1, depthDrill],
    ['tides:depth-over-drying', 'tides-levels', 1, dryingDrill],
    ['tides:bridge-clearance', 'tides-levels', 2, clearanceDrill],
    ['tides:height-to-cross', 'tides-levels', 2, crossBankDrill],
    ['tides:depth-at-low-water', 'tides-levels', 2, anchorAtLowWaterDrill],
    ['tides:twelfths-height', 'tides-heights', 2, twelfthsHeightDrill],
    ['tides:twelfths-time', 'tides-heights', 2, twelfthsTimeDrill],
    ['tides:secondary-time', 'tides-secondary', 2, secondaryTimeDrill],
    ['tides:secondary-height', 'tides-secondary', 2, secondaryHeightDrill],
  ];
  return drills.map(([concept, topic, difficulty, generate]) => ({
    id: `gen-${concept}`,
    topic,
    concept,
    difficulty,
    generated: true,
    generate,
  }));
}

export {
  depthDrill,
  dryingDrill,
  clearanceDrill,
  crossBankDrill,
  anchorAtLowWaterDrill,
  twelfthsHeightDrill,
  twelfthsTimeDrill,
  secondaryTimeDrill,
  secondaryHeightDrill,
};
