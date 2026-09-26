import type { RegBlock, RegDoc } from './model.ts';
import { parseDoc, parseRef, resolveAnchor } from './model.ts';
import { PART_AB } from './text/partAB.ts';
import { PART_C } from './text/partC.ts';
import { PART_DEF } from './text/partDEF.ts';
import { ANNEXES } from './text/annexes.ts';

export type { RegBlock, RegDoc } from './model.ts';
export { INLINE_REF, parseRef } from './model.ts';

/** Rules 1 to 41 in order, then Annexes I to IV. */
export const REG_DOCS: readonly RegDoc[] = [...PART_AB, ...PART_C, ...PART_DEF, ...ANNEXES];

const BY_ID = new Map(REG_DOCS.map((d) => [d.id, d]));
const BLOCKS = new Map<string, RegBlock[]>();
const ANCHOR_DOC = new Map<string, string>();

for (const doc of REG_DOCS) {
  const blocks = parseDoc(doc);
  BLOCKS.set(doc.id, blocks);
  ANCHOR_DOC.set(doc.id, doc.id);
  for (const b of blocks) if (b.type === 'para') ANCHOR_DOC.set(b.anchor, doc.id);
}

export const ANCHORS: ReadonlySet<string> = new Set(ANCHOR_DOC.keys());

export function docById(id: string): RegDoc | undefined {
  return BY_ID.get(id);
}

export function blocksOf(id: string): RegBlock[] {
  return BLOCKS.get(id) ?? [];
}

export function docTitle(doc: RegDoc): string {
  return doc.kind === 'rule' ? `Rule ${doc.number} — ${doc.title}` : `Annex ${doc.number} — ${doc.title}`;
}

/** The Parts in reading order, each with its documents. */
export function docsByPart(): { part: string; docs: RegDoc[] }[] {
  const out: { part: string; docs: RegDoc[] }[] = [];
  for (const doc of REG_DOCS) {
    const last = out[out.length - 1];
    if (last && last.part === doc.part) last.docs.push(doc);
    else out.push({ part: doc.part, docs: [doc] });
  }
  return out;
}

export interface ResolvedRef {
  docId: string;
  /** The paragraph to show, or the document id itself. */
  anchor: string;
}

/** A citation as written in a question, resolved to the paragraph it cites. */
export function resolveRef(ref: string): ResolvedRef | undefined {
  const target = parseRef(ref);
  if (!target || !BY_ID.has(target.docId)) return undefined;
  return { docId: target.docId, anchor: resolveAnchor(target, ANCHORS) };
}
