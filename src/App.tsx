import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Domain, Topic } from './core/types.ts';
import { DOMAIN_LABELS, TOPICS } from './core/types.ts';
import type { QuizSession } from './core/quiz.ts';
import {
  advance,
  answer,
  createSession,
  elapsedFor,
  isCorrect,
  isFinished,
} from './core/quiz.ts';
import type { Deck } from './core/srs.ts';
import { applyReview, gradeFromAnswer, schedule } from './core/srs.ts';
import { sourcesForDomain } from './core/questions/index.ts';
import { clearAll, exportBackup, loadDeck, parseBackup, saveDeck } from './storage.ts';
import { HomeView } from './ui/HomeView.tsx';
import { QuizView } from './ui/QuizView.tsx';
import { ResultsView } from './ui/ResultsView.tsx';
import { RegsView } from './ui/RegsView.tsx';
import { RegModal } from './ui/RegModal.tsx';
import { OpenRefProvider } from './ui/RegText.tsx';

export type Mode = 'practice' | 'review';

/**
 * Where you are, kept in the URL hash so the back button works on a phone and
 * a rule can be linked to: nothing for COLREG, '#/iala', '#/lights', '#/regs' or
 * '#/regs/r17-a-ii'.
 */
type Route = { view: Domain } | { view: 'regs'; anchor: string | undefined };

function readRoute(): Route {
  const hash = window.location.hash;
  if (hash === '#/iala') return { view: 'iala' };
  if (hash === '#/lights') return { view: 'coastal' };
  const m = /^#\/regs(?:\/([a-z0-9-]+))?$/.exec(hash);
  return m ? { view: 'regs', anchor: m[1] } : { view: 'colreg' };
}

function hashOf(route: Route): string {
  if (route.view === 'regs') return `#/regs${route.anchor ? `/${route.anchor}` : ''}`;
  if (route.view === 'iala') return '#/iala';
  return route.view === 'coastal' ? '#/lights' : '';
}

function go(route: Route) {
  const hash = hashOf(route);
  if (window.location.hash !== hash) {
    window.history.pushState(null, '', hash || window.location.pathname + window.location.search);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }
}

type Sessions = Record<Domain, QuizSession | null>;

export function App() {
  const [topics, setTopics] = useState<Topic[]>([...TOPICS]);
  const [length, setLength] = useState(20);
  // One session per domain, so moving to IALA mid-way through a COLREG paper
  // does not lose it — and a paper can never contain both.
  const [sessions, setSessions] = useState<Sessions>({ colreg: null, iala: null, coastal: null });
  const [deck, setDeck] = useState<Deck>(loadDeck);
  const [route, setRoute] = useState<Route>(readRoute);
  const [modal, setModal] = useState<string | null>(null);

  const domain: Domain | null = route.view === 'regs' ? null : route.view;
  const session = domain ? sessions[domain] : null;

  useEffect(() => {
    const onHash = () => setRoute(readRoute());
    window.addEventListener('hashchange', onHash);
    window.addEventListener('popstate', onHash);
    return () => {
      window.removeEventListener('hashchange', onHash);
      window.removeEventListener('popstate', onHash);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route.view]);

  const closeModal = useCallback(() => setModal(null), []);

  const concepts = useMemo(
    () =>
      domain ? [...new Set(sourcesForDomain(domain, topics).map((s) => s.concept))] : [],
    [domain, topics],
  );

  const toggleTopic = useCallback((topic: Topic) => {
    setTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    );
  }, []);

  const setSome = useCallback((some: Topic[], on: boolean) => {
    setTopics((prev) => {
      const rest = prev.filter((t) => !some.includes(t));
      return on ? [...rest, ...some] : rest;
    });
  }, []);

  const setSession = useCallback(
    (d: Domain, update: (prev: QuizSession | null) => QuizSession | null) => {
      setSessions((prev) => ({ ...prev, [d]: update(prev[d]) }));
    },
    [],
  );

  const start = useCallback(
    (mode: Mode) => {
      if (!domain) return;
      const next = createSession(
        {
          topics,
          count: length,
          // In review mode the scheduler decides the order: whatever is most
          // overdue first, then concepts never seen.
          priority: mode === 'review' ? schedule(deck, concepts, Date.now()) : undefined,
        },
        sourcesForDomain(domain, topics),
      );
      setSession(domain, () => next);
      window.scrollTo(0, 0);
    },
    [domain, topics, length, deck, concepts, setSession],
  );

  /**
   * Folds a finished or abandoned session into the deck. Only answered
   * questions count — skipping one is not evidence either way.
   */
  const commit = useCallback((finished: QuizSession) => {
    const now = Date.now();
    setDeck((prev) => {
      let next = prev;
      for (const item of finished.items) {
        if (item.given === null) continue;
        const grade = gradeFromAnswer(isCorrect(item), elapsedFor(item));
        next = applyReview(next, item.question.concept, grade, now);
      }
      saveDeck(next);
      return next;
    });
  }, []);

  const onAnswer = useCallback(
    (choiceId: string) => {
      if (domain) setSession(domain, (prev) => (prev ? answer(prev, choiceId) : prev));
    },
    [domain, setSession],
  );

  const onNext = useCallback(() => {
    if (!domain) return;
    const prev = sessions[domain];
    if (!prev) return;
    const next = advance(prev);
    if (isFinished(next)) commit(next);
    setSession(domain, () => next);
    window.scrollTo(0, 0);
  }, [domain, sessions, commit, setSession]);

  const onQuit = useCallback(() => {
    if (!domain) return;
    // Answers already given still count; abandoning a session should not throw
    // away evidence about what you know.
    const prev = sessions[domain];
    if (prev) commit(prev);
    setSession(domain, () => null);
  }, [domain, sessions, commit, setSession]);

  const onReset = useCallback(() => {
    clearAll();
    setDeck({});
  }, []);

  const onExport = useCallback(() => {
    const blob = new Blob([exportBackup(deck)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `colreg-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [deck]);

  const onImport = useCallback((text: string) => {
    const imported = parseBackup(text);
    if (!imported) return false;
    saveDeck(imported);
    setDeck(imported);
    return true;
  }, []);

  const showingResults = session !== null && isFinished(session);
  const inQuiz = (d: Domain) => {
    const s = sessions[d];
    return s !== null && !isFinished(s);
  };

  return (
    <div className="app" data-domain={domain ?? 'colreg'}>
      <header className="masthead">
        <div className="masthead-inner">
          <div className="brand">
            <Burgee />
            <div>
              <h1>COLREG</h1>
              <span className="sub">Yachtmaster rules trainer</span>
            </div>
          </div>
          <nav className="tabs" aria-label="Sections">
            {(['colreg', 'iala', 'coastal'] as const).map((d) => (
              <button
                key={d}
                type="button"
                aria-pressed={route.view === d}
                onClick={() => go({ view: d })}
              >
                {DOMAIN_LABELS[d]}
                {inQuiz(d) && <span className="live" aria-label="(quiz in progress)" />}
              </button>
            ))}
            <button
              type="button"
              aria-pressed={route.view === 'regs'}
              onClick={() => go({ view: 'regs', anchor: undefined })}
            >
              COLREG text
            </button>
          </nav>
        </div>
      </header>

      <main className="page">
        {route.view === 'regs' && (
          <RegsView anchor={route.anchor} onGo={(anchor) => go({ view: 'regs', anchor })} />
        )}

        {domain && (
          <OpenRefProvider value={setModal}>
            {session === null && (
              <HomeView
                key={domain}
                domain={domain}
                topics={topics}
                onToggleTopic={toggleTopic}
                onSetTopics={setSome}
                length={length}
                onSetLength={setLength}
                deck={deck}
                concepts={concepts}
                onStart={start}
                onReset={onReset}
                onExport={onExport}
                onImport={onImport}
              />
            )}

            {session !== null && !showingResults && (
              <QuizView
                session={session}
                onAnswer={onAnswer}
                onNext={onNext}
                onQuit={onQuit}
              />
            )}

            {showingResults && (
              <ResultsView
                session={session}
                onAgain={() => start('practice')}
                onHome={() => setSession(domain, () => null)}
              />
            )}
          </OpenRefProvider>
        )}
      </main>

      {modal !== null && domain && (
        <RegModal
          anchor={modal}
          onNavigate={setModal}
          onOpenFull={(anchor) => {
            setModal(null);
            go({ view: 'regs', anchor });
          }}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

/** A swallow-tailed burgee: the club flag every yacht flies at the masthead. */
function Burgee() {
  return (
    <svg className="burgee" viewBox="0 0 40 40" aria-hidden="true">
      <line x1="8" y1="4" x2="8" y2="37" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M 9 6 L 35 12.5 L 26 15 L 35 18 L 9 24 Z" fill="#e0453c" />
      <path d="M 9 13 L 30 14.6 L 9 17 Z" fill="#ffffff" opacity="0.9" />
    </svg>
  );
}
