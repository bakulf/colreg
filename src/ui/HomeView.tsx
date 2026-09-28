import { useMemo, useState } from 'react';
import { TOPIC_INFO, topicsOf } from '../core/types.ts';
import type { Domain, Topic } from '../core/types.ts';
import { countByTopic } from '../core/questions/index.ts';
import type { Deck } from '../core/srs.ts';
import { counts, readiness, weakest } from '../core/srs.ts';
import type { Mode } from '../App.tsx';
import { MarkIcon } from './MarkIcon.tsx';

const LENGTHS = [10, 20, 40] as const;

interface Props {
  domain: Domain;
  topics: Topic[];
  onToggleTopic: (topic: Topic) => void;
  onSetTopics: (topics: Topic[], on: boolean) => void;
  length: number;
  onSetLength: (n: number) => void;
  deck: Deck;
  concepts: string[];
  onStart: (mode: Mode) => void;
  onReset: () => void;
  onExport: () => void;
  onImport: (text: string) => boolean;
  /** Only in COLREG: opens the full text of the Rules. */
  onOpenText?: () => void;
}

const FOOTNOTES: Record<Domain, string> = {
  colreg:
    'Rule text from MSN 1781 (M+F), the UK text of the Collision Regulations, © Crown copyright, Open Government Licence v3.0.',
  iala: 'Marks follow IALA Recommendation R1001, The IALA Maritime Buoyage System (Ed. 2.0, 2023). No Admiralty chart data is used.',
  coastal:
    'Characters follow IALA Recommendation R0110 (Ed. 5.0, 2021); ranges IALA R0202 (Ed. 2.1, 2017). Lights and positions are invented; no Admiralty data is used.',
  weather:
    'Topics follow section 12 of the RYA Coastal Skipper / Yachtmaster Offshore syllabus. Forecast terms are the Met Office’s own definitions. Northern hemisphere throughout.',
  tides:
    'Topics follow section 3 of the RYA Coastal Skipper / Yachtmaster Offshore syllabus. Ports and figures are invented for practice; use real tables for real passages.',
  tidal:
    'Topics follow sections 4 and 1 of the RYA Coastal Skipper / Yachtmaster Offshore syllabus. Diamonds, ports and passages are invented for practice.',
  compass:
    'Topics follow section 2 of the RYA Coastal Skipper / Yachtmaster Offshore syllabus. Variations and deviation cards are invented for practice; use the ones for your own chart and boat.',
};

const HEADINGS: Record<Domain, string> = {
  colreg: 'Parts of the Rules',
  iala: 'Mark categories',
  coastal: 'Topics',
  compass: 'Syllabus items',
  tidal: 'Syllabus items',
  tides: 'Syllabus items',
  weather: 'Syllabus items',
};

const INTRO: Record<Domain, { title: string; sub: string }> = {
  colreg: {
    title: 'Collision Regulations',
    sub: 'The International Regulations for Preventing Collisions at Sea 1972, drilled Part by Part.',
  },
  iala: {
    title: 'IALA Buoyage — Regions A and B',
    sub: 'The IALA Maritime Buoyage System, by day and by night. Region A is UK and European waters; Region B, the Americas, Japan, Korea and the Philippines, reverses the lateral colours.',
  },
  coastal: {
    title: 'Lights ashore',
    sub: 'Lighthouses, beacons and sector lights: their characters under IALA R0110, and how far they are seen under R0202.',
  },
  weather: {
    title: 'Weather',
    sub: 'Read the sky and the forecast: clouds by sight, a depression coming through, the Met Office’s words, fog and breezes.',
  },
  tides: {
    title: 'Tides',
    sub: 'How much water, and when: chart datum and drying heights, the rule of twelfths, secondary ports. Every sum can be done in your head.',
  },
  tidal: {
    title: 'Tidal streams',
    sub: 'Reading the diamonds, and allowing for the stream — without a plotter. Each step is a question you can answer in your head; the app draws the triangle once you have.',
  },
  compass: {
    title: 'The magnetic compass',
    sub: 'True, magnetic and compass: variation from the chart, deviation from the card, and how to check it. Work to the nearest degree.',
  },
};

/**
 * Part B is the one Part the Convention divides further, into three Sections.
 * The picker mirrors that: the Sections sit under their Part, and the Part
 * header toggles all three.
 */
const COLREG_LAYOUT: readonly (Topic | { part: string; sections: Topic[] })[] = [
  'colreg-a',
  { part: 'Steering and sailing rules', sections: ['colreg-b1', 'colreg-b2', 'colreg-b3'] },
  'colreg-c',
  'colreg-d',
  'colreg-e',
  'colreg-f',
  'colreg-annexes',
];

export function HomeView({
  domain,
  topics,
  onToggleTopic,
  onSetTopics,
  length,
  onSetLength,
  deck,
  concepts,
  onStart,
  onReset,
  onExport,
  onImport,
  onOpenText,
}: Props) {
  const [importError, setImportError] = useState<string | null>(null);
  const byTopic = useMemo(countByTopic, []);
  const own = topicsOf(domain);
  const chosen = topics.filter((t) => TOPIC_INFO[t].domain === domain);
  const fixed = chosen.reduce((n, t) => n + byTopic[t].fixed, 0);
  const generators = chosen.reduce((n, t) => n + byTopic[t].generated, 0);
  const available = fixed + generators;

  const now = Date.now();
  const due = counts(deck, concepts, now);
  const ready = readiness(deck, concepts, now);
  const conceptSet = new Set(concepts);
  const weak = weakest(
    Object.fromEntries(Object.entries(deck).filter(([c]) => conceptSet.has(c))),
    5,
  );
  const started = due.due + due.resting > 0;
  const intro = INTRO[domain];

  const row = (topic: Topic, nested = false) => {
    const info = TOPIC_INFO[topic];
    const on = topics.includes(topic);
    const n = byTopic[topic];
    return (
      <button
        key={topic}
        type="button"
        className={`topic${nested ? ' nested' : ''}`}
        aria-pressed={on}
        onClick={() => onToggleTopic(topic)}
      >
        {domain === 'iala' ? (
          <MarkIcon topic={topic} />
        ) : (
          <span className="code" aria-hidden="true">
            {nested ? info.code.replace('B/', '') : info.code}
          </span>
        )}
        <span className="topic-text">
          <span className="topic-title">
            {nested ? `Section ${info.code.replace('B/', '')} — ` : ''}
            {info.title}
          </span>
          <span className="topic-span">
            {info.span} · {n.fixed + n.generated} drills
          </span>
        </span>
        <span className="check" aria-hidden="true" />
      </button>
    );
  };

  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <h2>{intro.title}</h2>
          <p>{intro.sub}</p>
          {onOpenText && (
            <button type="button" className="link hero-link" onClick={onOpenText}>
              Read the Rules in full ›
            </button>
          )}
          {started ? (
            <div className="duerow">
              <span>
                <b>{due.due}</b> due
              </span>
              <span>
                <b>{due.fresh}</b> new
              </span>
              <span>
                <b>{due.resting}</b> resting
              </span>
            </div>
          ) : (
            <p className="hero-hint">
              {concepts.length} concepts to learn. Start with Study and the scheduler takes
              it from there.
            </p>
          )}
        </div>
        <Ring value={started ? ready : 0} label={started ? 'recall' : 'not started'} />
      </section>

      <div className="card">
        <div className="card-head">
          <h2>{HEADINGS[domain]}</h2>
          <span className="card-tools">
            <button type="button" className="link" onClick={() => onSetTopics(own, true)}>
              All
            </button>
            <button type="button" className="link" onClick={() => onSetTopics(own, false)}>
              None
            </button>
          </span>
        </div>

        {domain === 'colreg' ? (
          <div className="topics">
            {COLREG_LAYOUT.map((entry) => {
              if (typeof entry === 'string') return row(entry);
              const allOn = entry.sections.every((t) => topics.includes(t));
              return (
                <div className="part-group" key={entry.part}>
                  <button
                    type="button"
                    className="topic part"
                    aria-pressed={allOn}
                    onClick={() => onSetTopics(entry.sections, !allOn)}
                  >
                    <span className="code" aria-hidden="true">
                      B
                    </span>
                    <span className="topic-text">
                      <span className="topic-title">{entry.part}</span>
                      <span className="topic-span">Rules 4–19, in three Sections</span>
                    </span>
                    <span className="check" aria-hidden="true" />
                  </button>
                  {entry.sections.map((t) => row(t, true))}
                </div>
              );
            })}
          </div>
        ) : domain === 'iala' ? (
          <div className="topics grid">{own.map((t) => row(t))}</div>
        ) : (
          <div className="topics">{own.map((t) => row(t))}</div>
        )}
      </div>

      <div className="card">
        <h2>Session</h2>
        <div className="lengths">
          {LENGTHS.map((n) => (
            <button
              key={n}
              type="button"
              className="chip"
              aria-pressed={length === n}
              onClick={() => onSetLength(n)}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            className="chip"
            aria-pressed={length === Number.MAX_SAFE_INTEGER}
            onClick={() => onSetLength(Number.MAX_SAFE_INTEGER)}
          >
            All
          </button>
        </div>
        <p className="kbdhint">
          {fixed} written question{fixed === 1 ? '' : 's'}
          {generators > 0 && (
            <>
              {' '}
              and {generators} drill{generators === 1 ? '' : 's'} drawn fresh every time
            </>
          )}
          .
        </p>

        <div className="actions">
          <button
            type="button"
            className="primary"
            disabled={available === 0}
            onClick={() => onStart('review')}
          >
            {due.due > 0 ? `Review ${due.due} due` : 'Study'}
          </button>
          <button
            type="button"
            className="secondary"
            disabled={available === 0}
            onClick={() => onStart('practice')}
          >
            Random practice
          </button>
        </div>
        <p className="kbdhint">
          Study follows the scheduler — most overdue first, then anything you have not
          met. Practice ignores it and shuffles.
        </p>
      </div>

      {weak.length > 0 && (
        <div className="card">
          <h2>Hardest for you</h2>
          <div className="bars">
            {weak.map((card) => (
              <div className="bar" key={card.concept}>
                <span>{card.concept}</span>
                <span className="num">
                  {card.lapses > 0 ? `${card.lapses} lapse${card.lapses === 1 ? '' : 's'}` : 'new'}
                </span>
                <span className="track">
                  <span
                    className="fill hard"
                    style={{ width: `${((card.difficulty - 1) / 9) * 100}%` }}
                  />
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {started && (
        <div className="card">
          <h2>Your record</h2>
          <p className="kbdhint" style={{ marginTop: 0 }}>
            Everything is kept on this device only, for both COLREG and IALA. Clearing
            site data loses it, so export if it matters.
          </p>
          <div className="actions">
            <button type="button" className="secondary" onClick={onExport}>
              Export
            </button>
            <label className="secondary filebtn">
              Import
              <input
                type="file"
                accept="application/json,.json"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = '';
                  if (!file) return;
                  file.text().then((text) => {
                    if (!onImport(text)) {
                      setImportError('That file is not a COLREG backup.');
                    } else {
                      setImportError(null);
                    }
                  });
                }}
              />
            </label>
            <button type="button" className="secondary danger" onClick={onReset}>
              Reset
            </button>
          </div>
          {importError && (
            <p className="kbdhint" style={{ color: 'var(--port)' }}>
              {importError}
            </p>
          )}
        </div>
      )}

      <p className="footnote">
        {FOOTNOTES[domain]}
      </p>
    </>
  );
}

/** Recall as a dial: the share of concepts you would still get right now. */
function Ring({ value, label }: { value: number; label: string }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <div className="ring">
      <svg viewBox="0 0 84 84" aria-hidden="true">
        <circle cx="42" cy="42" r={r} className="ring-track" />
        {/* Skipped at zero: a round cap on an empty arc still draws a dot. */}
        {value > 0 && (
        <circle
          cx="42"
          cy="42"
          r={r}
          className="ring-fill"
          strokeDasharray={`${c * value} ${c}`}
          transform="rotate(-90 42 42)"
        />
        )}
      </svg>
      <div className="ring-label">
        <b>{Math.round(value * 100)}%</b>
        <span>{label}</span>
      </div>
    </div>
  );
}
