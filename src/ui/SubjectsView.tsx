import type { Deck } from '../core/srs.ts';
import { counts, readiness } from '../core/srs.ts';
import type { Domain } from '../core/types.ts';
import { SUBJECTS } from './subjects.tsx';

interface Props {
  deck: Deck;
  conceptsOf: (domain: Domain) => string[];
  inQuiz: (domain: Domain) => boolean;
  onOpen: (domain: Domain) => void;
  onOpenText: () => void;
}

/** The home page: one tile per subject, each with where you stand in it. */
export function SubjectsView({ deck, conceptsOf, inQuiz, onOpen, onOpenText }: Props) {
  const now = Date.now();
  return (
    <>
      <div className="subjects">
        {SUBJECTS.map((s) => {
          const concepts = conceptsOf(s.domain);
          const due = counts(deck, concepts, now);
          const started = due.due + due.resting > 0;
          const ready = readiness(deck, concepts, now);
          return (
            <button
              key={s.domain}
              type="button"
              className="subject"
              data-domain={s.domain}
              onClick={() => onOpen(s.domain)}
            >
              <span className="subject-icon">{s.icon}</span>
              <span className="subject-text">
                <span className="subject-title">{s.title}</span>
                <span className="subject-blurb">{s.blurb}</span>
                <span className="subject-stats">
                  {inQuiz(s.domain) ? (
                    <b className="subject-live">Quiz in progress</b>
                  ) : started ? (
                    <>
                      <b>{Math.round(ready * 100)}%</b> recall
                      {due.due > 0 && (
                        <>
                          {' · '}
                          <b>{due.due}</b> due
                        </>
                      )}
                    </>
                  ) : (
                    <>{concepts.length} concepts · not started</>
                  )}
                </span>
              </span>
              <span className="subject-meter" aria-hidden="true">
                <span style={{ width: `${Math.round(ready * 100)}%` }} />
              </span>
            </button>
          );
        })}
      </div>

      <button type="button" className="textlink" onClick={onOpenText}>
        <span>
          <b>COLREG text</b>
          <span className="muted"> — the Rules and Annexes in full, with search</span>
        </span>
        <span aria-hidden="true">›</span>
      </button>

      <p className="footnote">
        Progress is kept on this device only. Open a subject to study, export or reset.
      </p>
    </>
  );
}
