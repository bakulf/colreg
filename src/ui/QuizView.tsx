import { useEffect } from 'react';
import type { QuizSession } from '../core/quiz.ts';
import { currentItem, isAnswered, isCorrect, orderedChoices } from '../core/quiz.ts';
import { TOPIC_LABELS } from '../core/types.ts';
import { SceneView } from './SceneView.tsx';

interface Props {
  session: QuizSession;
  onAnswer: (choiceId: string) => void;
  onNext: () => void;
  onQuit: () => void;
}

export function QuizView({ session, onAnswer, onNext, onQuit }: Props) {
  const item = currentItem(session);
  const choices = item ? orderedChoices(item) : [];
  const answered = item ? isAnswered(item) : false;

  // Answer with 1..4, then Enter or Space to move on. Fast repetition is the
  // whole point of a drill app; reaching for the mouse each time kills it.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!item) return;
      if (!answered) {
        const n = Number(e.key);
        if (Number.isInteger(n) && n >= 1 && n <= choices.length) {
          e.preventDefault();
          onAnswer(choices[n - 1]!.id);
        }
        return;
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onNext();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [item, answered, choices, onAnswer, onNext]);

  if (!item) return null;

  const { question } = item;
  const total = session.items.length;
  const n = session.cursor + 1;
  const right = isCorrect(item);

  return (
    <>
      <div className="progressbar">
        <div style={{ width: `${((n - 1) / total) * 100}%` }} />
      </div>

      <div className="meta">
        <span>
          Question {n} of {total}
        </span>
        <span>{TOPIC_LABELS[question.topic]}</span>
      </div>

      <div className="card">
        {question.scene && <SceneView scene={question.scene} />}
        <p className="prompt">{question.prompt}</p>

        <div className="choices">
          {choices.map((choice, i) => {
            const isRightChoice = choice.id === question.correct;
            const isGiven = item.given === choice.id;
            let cls = 'choice';
            if (answered) {
              if (isRightChoice) cls += ' correct';
              else if (isGiven) cls += ' wrong';
              else cls += ' dim';
            }
            return (
              <button
                key={choice.id}
                className={cls}
                disabled={answered}
                onClick={() => onAnswer(choice.id)}
              >
                <span className="key" aria-hidden="true">
                  {answered && isRightChoice ? '✓' : answered && isGiven ? '✗' : i + 1}
                </span>
                <span>{choice.text}</span>
              </button>
            );
          })}
        </div>

        {answered && (
          <>
            <div className="feedback">
              <h3>{right ? 'Correct' : 'Not quite'}</h3>
              <p>{question.explanation}</p>
            </div>

            {question.teachingNote && (
              <div className="feedback teaching">
                <h3>Teaching it</h3>
                <p>{question.teachingNote}</p>
              </div>
            )}

            {question.misconception && (
              <div className="feedback trap">
                <h3>Where students go wrong</h3>
                <p>{question.misconception}</p>
              </div>
            )}

            <div className="refs">
              {question.ruleRefs.map((ref) => (
                <span className="ref" key={ref}>
                  {ref}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="actions">
        <button className="secondary" onClick={onQuit}>
          Stop
        </button>
        <button className="primary" disabled={!answered} onClick={onNext}>
          {n === total ? 'Finish' : 'Next'}
        </button>
      </div>

      <p className="kbdhint">
        <kbd>1</kbd>–<kbd>{choices.length}</kbd> to answer, <kbd>Enter</kbd> to continue.
      </p>
    </>
  );
}
