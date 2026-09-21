import type { QuizSession } from '../core/quiz.ts';
import { score } from '../core/quiz.ts';
import { TOPIC_LABELS } from '../core/types.ts';
import { SceneView } from './SceneView.tsx';

interface Props {
  session: QuizSession;
  onAgain: () => void;
  onHome: () => void;
}

function choiceText(
  question: QuizSession['items'][number]['question'],
  id: string | null,
): string {
  if (id === null) return 'not answered';
  return question.choices.find((c) => c.id === id)?.text ?? 'unknown';
}

export function ResultsView({ session, onAgain, onHome }: Props) {
  const result = score(session);
  const pct = Math.round(result.ratio * 100);
  const minutes = Math.floor(result.elapsedMs / 60000);
  const seconds = Math.floor((result.elapsedMs % 60000) / 1000);

  return (
    <>
      <div className="card">
        <div className="bigscore">
          <div className="n">
            {result.correct} / {result.total}
          </div>
          <div className="pct">
            {pct}% · {minutes}m {String(seconds).padStart(2, '0')}s
          </div>
        </div>

        <div className="bars">
          {result.byTopic.map((t) => (
            <div className="bar" key={t.topic}>
              <span>{TOPIC_LABELS[t.topic]}</span>
              <span className="num">
                {t.correct}/{t.total}
              </span>
              <span className="track">
                <span
                  className="fill"
                  style={{ width: `${(t.correct / t.total) * 100}%` }}
                />
              </span>
            </div>
          ))}
        </div>
      </div>

      {result.wrong.length > 0 && (
        <div className="card">
          <h2>Review</h2>
          <div className="review">
            {result.wrong.map((item) => (
              <div className="item" key={item.question.id}>
                {item.question.scene && <SceneView scene={item.question.scene} compact />}
                <p className="q">{item.question.prompt}</p>
                <p className="given">✗ {choiceText(item.question, item.given)}</p>
                <p className="right">✓ {choiceText(item.question, item.question.correct)}</p>
                <p className="muted" style={{ fontSize: '0.88rem', marginTop: '0.4rem' }}>
                  {item.question.explanation}
                </p>
                <div className="refs">
                  {item.question.ruleRefs.map((ref) => (
                    <span className="ref" key={ref}>
                      {ref}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="actions">
        <button className="secondary" onClick={onHome}>
          Home
        </button>
        <button className="primary" onClick={onAgain}>
          Another round
        </button>
      </div>
    </>
  );
}
