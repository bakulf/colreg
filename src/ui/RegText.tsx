import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { RegBlock } from '../core/regs/index.ts';
import { INLINE_REF, blocksOf, resolveRef } from '../core/regs/index.ts';

/**
 * Citations as links, and the text of a rule as a page.
 *
 * What a link does depends on where it is: in a quiz it opens the rule over the
 * question, in the Regulations view it moves to it. So the action comes from
 * context, and everything that renders a citation only needs to call it.
 */

export type OpenRef = (anchor: string) => void;

const OpenRefContext = createContext<OpenRef | null>(null);

export const OpenRefProvider = OpenRefContext.Provider;

function useOpenRef(): OpenRef | null {
  return useContext(OpenRefContext);
}

/** One citation. Anything that is not a rule or an annex stays plain text. */
export function RefChip({ refText }: { refText: string }) {
  const open = useOpenRef();
  const hit = resolveRef(refText);
  if (!hit || !open) {
    return <span className="ref">{refText}</span>;
  }
  return (
    <button type="button" className="ref link" onClick={() => open(hit.anchor)}>
      {refText}
    </button>
  );
}

export function RefChips({ refs }: { refs: readonly string[] }) {
  return (
    <div className="refs">
      {refs.map((ref) => (
        <RefChip key={ref} refText={ref} />
      ))}
    </div>
  );
}

/** Running text with every "Rule 17(a)(ii)" or "Annex IV" in it made a link. */
export function LinkedText({ text }: { text: string }) {
  const open = useOpenRef();
  if (!open) return <>{text}</>;

  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(INLINE_REF)) {
    const at = m.index ?? 0;
    const hit = resolveRef(m[0]);
    if (!hit) continue;
    if (at > last) out.push(text.slice(last, at));
    out.push(
      <button
        type="button"
        key={at}
        className="inline-ref"
        onClick={() => open(hit.anchor)}
      >
        {m[0]}
      </button>,
    );
    last = at + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

function isWithin(anchor: string, target: string | undefined): boolean {
  if (!target) return false;
  return anchor === target || anchor.startsWith(`${target}-`);
}

function Block({ block, highlight }: { block: RegBlock; highlight?: string }) {
  if (block.type === 'heading') return <h4 className="reg-heading">{block.text}</h4>;

  const lit = highlight !== undefined && highlight.includes('-') && isWithin(block.anchor, highlight);
  const bullet = !block.label && block.text.startsWith('- ');
  return (
    <p
      id={block.label ? block.anchor : undefined}
      className={`reg-para${lit ? ' lit' : ''}${bullet ? ' bullet' : ''}`}
      style={{ paddingLeft: `${block.depth * 1.25}rem` }}
    >
      {block.label && <span className="reg-label">{block.label}</span>}
      <LinkedText text={bullet ? block.text.slice(2) : block.text} />
    </p>
  );
}

/**
 * The text of one rule or annex. `highlight` marks the cited paragraph and
 * everything under it; citing a whole rule highlights nothing.
 */
export function DocBody({ docId, highlight }: { docId: string; highlight?: string }) {
  return (
    <div className="reg-body">
      {blocksOf(docId).map((b, i) => (
        <Block key={i} block={b} highlight={highlight} />
      ))}
    </div>
  );
}
