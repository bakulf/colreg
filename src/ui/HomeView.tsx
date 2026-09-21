import { useMemo, useState } from 'react';
import { TOPICS, TOPIC_LABELS } from '../core/types.ts';
import type { Topic } from '../core/types.ts';
import { countByTopic } from '../core/questions/index.ts';
import type { Deck } from '../core/srs.ts';
import { counts, readiness, weakest } from '../core/srs.ts';
import type { Mode } from '../App.tsx';

const LENGTHS = [10, 20, 40] as const;

interface Props {
  topics: Topic[];
  onToggleTopic: (topic: Topic) => void;
  length: number;
  onSetLength: (n: number) => void;
  deck: Deck;
  concepts: string[];
  onStart: (mode: Mode) => void;
  onReset: () => void;
  onExport: () => void;
  onImport: (text: string) => boolean;
}

export function HomeView({
  topics,
  onToggleTopic,
  length,
  onSetLength,
  deck,
  concepts,
  onStart,
  onReset,
  onExport,
  onImport,
}: Props) {
  const [importError, setImportError] = useState<string | null>(null);
  const byTopic = useMemo(countByTopic, []);
  const fixed = topics.reduce((n, t) => n + byTopic[t].fixed, 0);
  const generators = topics.reduce((n, t) => n + byTopic[t].generated, 0);
  const available = fixed + generators;

  const now = Date.now();
  const due = counts(deck, concepts, now);
  const ready = readiness(deck, concepts, now);
  const weak = weakest(deck, 5);
  const started = due.due + due.resting > 0;

  return (
    <>
      {started && (
        <div className="card">
          <h2>Where you are</h2>
          <div className="readiness">
            <div className="bigpct">{Math.round(ready * 100)}%</div>
            <div className="muted">
              of the {concepts.length} concepts in these topics you would still recall now
            </div>
          </div>
          <div className="duerow">
            <span>
              <b>{due.due}</b> due
            </span>
            <span>
              <b>{due.fresh}</b> not yet seen
            </span>
            <span>
              <b>{due.resting}</b> resting
            </span>
          </div>
        </div>
      )}

      <div className="card">
        <h2>Topics</h2>
        <div className="topics">
          {TOPICS.map((topic) => {
            const on = topics.includes(topic);
            return (
              <button
                key={topic}
                className="topic"
                aria-pressed={on}
                onClick={() => onToggleTopic(topic)}
              >
                <span className="tick" aria-hidden="true">{on ? '✓' : ''}</span>
                <span>{TOPIC_LABELS[topic]}</span>
                <span className="count">
                  {byTopic[topic].fixed}
                  {byTopic[topic].generated > 0 && (
                    <span className="gen"> + {byTopic[topic].generated} drawn</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="card">
        <h2>Length</h2>
        <div className="lengths">
          {LENGTHS.map((n) => (
            <button
              key={n}
              className="chip"
              aria-pressed={length === n}
              onClick={() => onSetLength(n)}
            >
              {n} questions
            </button>
          ))}
          <button
            className="chip"
            aria-pressed={length === Number.MAX_SAFE_INTEGER}
            onClick={() => onSetLength(Number.MAX_SAFE_INTEGER)}
          >
            Everything
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
      </div>

      <div className="actions">
        <button
          className="primary"
          disabled={available === 0}
          onClick={() => onStart('review')}
        >
          {due.due > 0 ? `Review ${due.due} due` : 'Study'}
        </button>
        <button
          className="secondary"
          disabled={available === 0}
          onClick={() => onStart('practice')}
        >
          Random practice
        </button>
      </div>
      <p className="kbdhint">
        Review follows the scheduler — most overdue first, then anything you have not
        met. Practice ignores it and shuffles.
      </p>

      {started && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <h2>Your record</h2>
          <p className="kbdhint" style={{ marginTop: 0 }}>
            Everything is kept on this device only. Clearing site data loses it, so
            export if it matters.
          </p>
          <div className="actions">
            <button className="secondary" onClick={onExport}>
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
            <button className="secondary" onClick={onReset}>
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

      {weak.length > 0 && (
        <div className="card" style={{ marginTop: '1rem' }}>
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

      <p className="footnote">
        Rule text from the Merchant Shipping (Distress Signals and Prevention of
        Collisions) Regulations 1996, © Crown copyright, Open Government Licence v3.0.
      </p>
    </>
  );
}
