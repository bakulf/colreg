import { useEffect, useMemo, useState } from 'react';
import type { RegDoc } from '../core/regs/index.ts';
import { REG_DOCS, blocksOf, docById, docTitle, docsByPart } from '../core/regs/index.ts';
import { DocBody, OpenRefProvider } from './RegText.tsx';

interface Props {
  /** A document id or a paragraph anchor; undefined shows the contents. */
  anchor: string | undefined;
  onGo: (anchor: string | undefined) => void;
}

interface Hit {
  doc: RegDoc;
  anchor: string;
  snippet: string;
}

function search(query: string): Hit[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const hits: Hit[] = [];
  for (const doc of REG_DOCS) {
    if (docTitle(doc).toLowerCase().includes(q)) {
      hits.push({ doc, anchor: doc.id, snippet: doc.part });
    }
    for (const b of blocksOf(doc.id)) {
      if (b.type !== 'para') continue;
      const at = b.text.toLowerCase().indexOf(q);
      if (at < 0) continue;
      const from = Math.max(0, at - 50);
      const snippet = `${from > 0 ? '…' : ''}${b.text.slice(from, at + q.length + 70)}…`;
      hits.push({ doc, anchor: b.anchor, snippet });
    }
  }
  return hits.slice(0, 60);
}

/** The Rules and Annexes in full: contents, search, and one document at a time. */
export function RegsView({ anchor, onGo }: Props) {
  const [query, setQuery] = useState('');
  const hits = useMemo(() => search(query), [query]);
  const docId = anchor?.split('-')[0];
  const doc = docId ? docById(docId) : undefined;
  const index = doc ? REG_DOCS.indexOf(doc) : -1;
  const prev = index > 0 ? REG_DOCS[index - 1] : undefined;
  const next = index >= 0 && index < REG_DOCS.length - 1 ? REG_DOCS[index + 1] : undefined;

  useEffect(() => {
    if (!anchor) return;
    const target = anchor.includes('-') ? document.getElementById(anchor) : null;
    if (target) target.scrollIntoView({ block: 'center' });
    else window.scrollTo(0, 0);
  }, [anchor]);

  if (doc) {
    return (
      <>
        <div className="regs-nav">
          <button type="button" className="secondary" onClick={() => onGo(undefined)}>
            Contents
          </button>
          <span className="spacer" />
          <button
            type="button"
            className="secondary"
            disabled={!prev}
            onClick={() => prev && onGo(prev.id)}
          >
            ‹ {prev ? shortTitle(prev) : ''}
          </button>
          <button
            type="button"
            className="secondary"
            disabled={!next}
            onClick={() => next && onGo(next.id)}
          >
            {next ? shortTitle(next) : ''} ›
          </button>
        </div>
        <div className="card">
          <div className="reg-part">{doc.part}</div>
          <h2 className="reg-title">{docTitle(doc)}</h2>
          <OpenRefProvider value={(a) => onGo(a)}>
            <DocBody docId={doc.id} highlight={anchor} />
          </OpenRefProvider>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="card">
        <input
          className="search"
          type="search"
          placeholder="Search the Rules and Annexes"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query.trim().length >= 2 && (
          <div className="hits">
            {hits.length === 0 && <p className="muted">Nothing matches.</p>}
            {hits.map((h, i) => (
              <button type="button" key={i} className="hit" onClick={() => onGo(h.anchor)}>
                <span className="hit-title">{shortTitle(h.doc)}</span>
                <span className="hit-snippet">{h.snippet}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {query.trim().length < 2 &&
        docsByPart().map(({ part, docs }) => (
          <div className="card" key={part}>
            <h2>{part}</h2>
            <div className="toc">
              {docs.map((d) => (
                <button type="button" key={d.id} className="toc-item" onClick={() => onGo(d.id)}>
                  <span className="toc-n">{d.kind === 'rule' ? d.number : `Annex ${d.number}`}</span>
                  <span>{d.title}</span>
                </button>
              ))}
            </div>
          </div>
        ))}

      <p className="footnote">
        The International Regulations for Preventing Collisions at Sea 1972, as amended, as
        given effect in the UK by MSN 1781 (M+F). © Crown copyright, Open Government
        Licence v3.0.
      </p>
    </>
  );
}

function shortTitle(doc: RegDoc): string {
  return doc.kind === 'rule' ? `Rule ${doc.number}` : `Annex ${doc.number}`;
}
