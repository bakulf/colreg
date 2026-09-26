/**
 * The full text of the Regulations, Rules 1 to 41 and Annexes I to IV.
 *
 * Each document is written as plain text in a small line format, so the text
 * files read like the Regulations themselves and stay easy to check against the
 * source:
 *
 *   - one paragraph per line; blank lines are ignored;
 *   - two spaces of indentation per level of nesting;
 *   - a paragraph may open with its label — "(a)", "(ii)", "1." or "(1)" —
 *     which becomes part of its anchor;
 *   - a line without a label continues the paragraph above it at that depth,
 *     for the text that follows a list of sub-paragraphs;
 *   - a line starting "## " is a heading inside the document, as the Annexes
 *     use to title their sections.
 *
 * Anchors are the document id followed by the label path, so Rule 17(a)(ii)
 * is `r17-a-ii` and Annex I section 9(a)(i) is `a1-9-a-i`. That is what makes
 * a citation in a question resolvable to the exact paragraph it cites.
 */

export interface RegDoc {
  /** 'r17' for a rule, 'a1' to 'a4' for an annex. */
  id: string;
  kind: 'rule' | 'annex';
  /** '17', or the roman numeral of an annex. */
  number: string;
  title: string;
  /** The Part and Section it sits in; annexes use 'Annexes'. */
  part: string;
  text: string;
}

export type RegBlock =
  | { type: 'heading'; text: string }
  | {
      type: 'para';
      /** The label as printed, e.g. '(a)' or '1.'; empty for continuations. */
      label: string;
      depth: number;
      text: string;
      /** Anchor of this paragraph, or of the one it continues. */
      anchor: string;
    };

const LABEL = /^(\([a-z]{1,4}\)|\([0-9]{1,2}\)|[0-9]{1,2}\.)(?:\s+|$)/;

function labelKey(label: string): string {
  return label.replace(/[().]/g, '');
}

export function parseDoc(doc: RegDoc): RegBlock[] {
  const blocks: RegBlock[] = [];
  const path: string[] = [];

  for (const raw of doc.text.split('\n')) {
    if (raw.trim() === '') continue;
    const trimmed = raw.trimStart();
    if (trimmed.startsWith('## ')) {
      blocks.push({ type: 'heading', text: trimmed.slice(3).trim() });
      path.length = 0;
      continue;
    }

    let depth = Math.floor((raw.length - trimmed.length) / 2);
    let rest = trimmed;
    let m = LABEL.exec(rest);
    if (m) {
      // "(f) (i) The masthead light..." — a paragraph with no words of its
      // own, opening straight into its first sub-paragraph. Each label gets
      // its own block so that both anchors exist.
      while (m) {
        const label = m[1] as string;
        rest = rest.slice(m[0].length);
        const next = LABEL.exec(rest);
        path.length = depth;
        path[depth] = labelKey(label);
        blocks.push({
          type: 'para',
          label,
          depth,
          text: next ? '' : rest.trim(),
          anchor: anchorOf(doc.id, path),
        });
        if (next) depth += 1;
        m = next;
      }
    } else {
      blocks.push({
        type: 'para',
        label: '',
        depth,
        text: trimmed.trim(),
        anchor: anchorOf(doc.id, path.slice(0, depth)),
      });
    }
  }
  return blocks;
}

export function anchorOf(docId: string, path: readonly string[]): string {
  return [docId, ...path].join('-');
}

const ROMAN: Record<string, number> = { I: 1, II: 2, III: 3, IV: 4 };

export interface RefTarget {
  docId: string;
  /** Label path inside the document, possibly empty. */
  path: string[];
}

/**
 * Parses a citation as the questions write them.
 *
 *   'Rule 17(a)(ii)'   -> r17, [a, ii]
 *   'Rule 13'          -> r13, []
 *   'Annex IV, 1(k)'   -> a4, [1, k]
 *   'Annex I §9(a)(i)' -> a1, [9, a, i]
 *   'Annex II'         -> a2, []
 *
 * Anything else — 'IALA A', free text — returns undefined and is shown as
 * plain text.
 */
export function parseRef(ref: string): RefTarget | undefined {
  const rule = /^Rules? (\d{1,2})((?:\([a-z0-9]{1,4}\))*)/.exec(ref);
  if (rule) {
    return { docId: `r${Number(rule[1])}`, path: parens(rule[2] ?? '') };
  }
  const annex = /^Annex (IV|I{1,3})\b(?:,?\s*(?:section\s+|§\s*)?(\d{1,2}))?((?:\([a-z0-9]{1,4}\))*)/.exec(ref);
  if (annex) {
    const n = ROMAN[annex[1] as string] as number;
    const path = annex[2] ? [annex[2], ...parens(annex[3] ?? '')] : [];
    return { docId: `a${n}`, path };
  }
  return undefined;
}

function parens(s: string): string[] {
  return [...s.matchAll(/\(([a-z0-9]{1,4})\)/g)].map((m) => m[1] as string);
}

/**
 * Citations inside running text, for turning them into links.
 *
 * Matches 'Rule 17(a)(ii)', 'Rules 9 and 10' (first number only), 'Annex IV'
 * and 'Annex I, section 9(a)(i)'. Bare continuations like "17(a)(ii)" after
 * "Rule 17(a)(i);" are left alone — linking them would need guessing.
 */
export const INLINE_REF =
  /\b(?:Rule \d{1,2}(?:\([a-z0-9]{1,4}\))*|Annex (?:IV|I{1,3})(?:,? (?:section |§)?\d{1,2}(?:\([a-z0-9]{1,4}\))*)?)/g;

/** The deepest anchor that exists for a target, falling back to the document. */
export function resolveAnchor(target: RefTarget, anchors: ReadonlySet<string>): string {
  for (let n = target.path.length; n > 0; n--) {
    const a = anchorOf(target.docId, target.path.slice(0, n));
    if (anchors.has(a)) return a;
  }
  return target.docId;
}
