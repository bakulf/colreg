import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Topic } from './core/types.ts';
import { TOPICS } from './core/types.ts';
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
import { sourcesForTopics } from './core/questions/index.ts';
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
 * a rule can be linked to: '#/regs', '#/regs/r17-a-ii', or nothing for the
 * quiz.
 */
type Route = { view: 'quiz' } | { view: 'regs'; anchor: string | undefined };

function readRoute(): Route {
  const m = /^#\/regs(?:\/([a-z0-9-]+))?$/.exec(window.location.hash);
  return m ? { view: 'regs', anchor: m[1] } : { view: 'quiz' };
}

function go(route: Route) {
  const hash = route.view === 'regs' ? `#/regs${route.anchor ? `/${route.anchor}` : ''}` : '';
  if (window.location.hash !== hash) {
    window.history.pushState(null, '', hash || window.location.pathname + window.location.search);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }
}

export function App() {
  const [topics, setTopics] = useState<Topic[]>([...TOPICS]);
  const [length, setLength] = useState(20);
  const [session, setSession] = useState<QuizSession | null>(null);
  const [deck, setDeck] = useState<Deck>(loadDeck);
  const [route, setRoute] = useState<Route>(readRoute);
  const [modal, setModal] = useState<string | null>(null);

  useEffect(() => {
    const onHash = () => setRoute(readRoute());
    window.addEventListener('hashchange', onHash);
    window.addEventListener('popstate', onHash);
    return () => {
      window.removeEventListener('hashchange', onHash);
      window.removeEventListener('popstate', onHash);
    };
  }, []);

  const closeModal = useCallback(() => setModal(null), []);

  const concepts = useMemo(
    () => [...new Set(sourcesForTopics(topics).map((s) => s.concept))],
    [topics],
  );

  const toggleTopic = useCallback((topic: Topic) => {
    setTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    );
  }, []);

  const start = useCallback(
    (mode: Mode) => {
      setSession(
        createSession({
          topics,
          count: length,
          // In review mode the scheduler decides the order: whatever is most
          // overdue first, then concepts never seen.
          priority: mode === 'review' ? schedule(deck, concepts, Date.now()) : undefined,
        }),
      );
    },
    [topics, length, deck, concepts],
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

  const onAnswer = useCallback((choiceId: string) => {
    setSession((prev) => (prev ? answer(prev, choiceId) : prev));
  }, []);

  const onNext = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev;
      const next = advance(prev);
      if (isFinished(next)) commit(next);
      return next;
    });
  }, [commit]);

  const onQuit = useCallback(() => {
    // Answers already given still count; abandoning a session should not throw
    // away evidence about what you know.
    setSession((prev) => {
      if (prev) commit(prev);
      return null;
    });
  }, [commit]);

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

  return (
    <div className="app">
      <header className="masthead">
        <h1>COLREG</h1>
        <nav className="tabs">
          <button
            type="button"
            aria-pressed={route.view === 'quiz'}
            onClick={() => go({ view: 'quiz' })}
          >
            {session !== null && !showingResults ? 'Quiz ●' : 'Quiz'}
          </button>
          <button
            type="button"
            aria-pressed={route.view === 'regs'}
            onClick={() => go({ view: 'regs', anchor: undefined })}
          >
            Regulations
          </button>
        </nav>
      </header>

      {route.view === 'regs' && (
        <RegsView anchor={route.anchor} onGo={(anchor) => go({ view: 'regs', anchor })} />
      )}

      {route.view === 'quiz' && (
        <OpenRefProvider value={setModal}>
          {session === null && (
            <HomeView
              topics={topics}
              onToggleTopic={toggleTopic}
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
              onHome={() => setSession(null)}
            />
          )}
        </OpenRefProvider>
      )}

      {modal !== null && route.view === 'quiz' && (
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
