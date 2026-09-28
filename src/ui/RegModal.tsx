import { useEffect, useRef } from 'react';
import { docById, docTitle } from '../core/regs/index.ts';
import { DocBody, OpenRefProvider } from './RegText.tsx';
import type { OpenRef } from './RegText.tsx';

interface Props {
  anchor: string;
  onNavigate: OpenRef;
  onOpenFull: (anchor: string) => void;
  onClose: () => void;
}

/**
 * A rule shown over whatever cited it, so that checking a citation does not
 * cost you your place in a quiz.
 */
export function RegModal({ anchor, onNavigate, onOpenFull, onClose }: Props) {
  const docId = anchor.split('-')[0] as string;
  const doc = docById(docId);
  const panel = useRef<HTMLDivElement>(null);

  // Swallow keys while open, so 1–4 and Enter do not answer the question
  // underneath. Capture on window runs before the quiz's own listener.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Tab') return;
      e.stopImmediatePropagation();
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey, { capture: true });
    return () => window.removeEventListener('keydown', onKey, { capture: true });
  }, [onClose]);

  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    const target = el.querySelector<HTMLElement>(`[id="${anchor}"]`);
    if (target) target.scrollIntoView({ block: 'center' });
    else el.scrollTop = 0;
  }, [anchor]);

  if (!doc) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={docTitle(doc)}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <div className="reg-part">{doc.part}</div>
            <h3>{docTitle(doc)}</h3>
          </div>
          <button type="button" className="close" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body" ref={panel}>
          <OpenRefProvider value={onNavigate}>
            <DocBody docId={doc.id} highlight={anchor} />
          </OpenRefProvider>
        </div>
        <div className="modal-foot">
          <button type="button" className="secondary" onClick={() => onOpenFull(anchor)}>
            Open in COLREG text
          </button>
          <button type="button" className="secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
