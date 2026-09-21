import type { Deck } from './core/srs.ts';

/**
 * The only browser-specific part of persistence. Everything lives on the
 * device; there is no backend and no account, so the export below is the whole
 * backup story — clearing site data is otherwise unrecoverable.
 */
const DECK_KEY = 'colreg.deck.v1';
/** The key used before the app was renamed. Read once, then migrated. */
const LEGACY_DECK_KEY = 'calreg.deck.v1';
const EXPORT_VERSION = 1;

export function loadDeck(): Deck {
  try {
    const raw = localStorage.getItem(DECK_KEY) ?? localStorage.getItem(LEGACY_DECK_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return {};
    return parsed as Deck;
  } catch {
    // Corrupt or unavailable storage must never block studying.
    return {};
  }
}

export function saveDeck(deck: Deck): void {
  try {
    localStorage.setItem(DECK_KEY, JSON.stringify(deck));
  } catch {
    // Private browsing, quota, and so on. Losing history is survivable.
  }
}

export function clearAll(): void {
  try {
    localStorage.removeItem(DECK_KEY);
    localStorage.removeItem(LEGACY_DECK_KEY);
  } catch {
    // ignore
  }
}

export interface Backup {
  version: number;
  exportedAt: string;
  deck: Deck;
}

export function exportBackup(deck: Deck): string {
  const backup: Backup = {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    deck,
  };
  return JSON.stringify(backup, null, 2);
}

/**
 * Reads a backup back in. Returns null rather than throwing on anything it
 * does not recognise: a failed import should leave the learner where they
 * were, not wipe the deck they still have.
 */
export function parseBackup(text: string): Deck | null {
  try {
    const parsed: unknown = JSON.parse(text);
    if (typeof parsed !== 'object' || parsed === null) return null;
    const backup = parsed as Partial<Backup>;
    if (backup.version !== EXPORT_VERSION) return null;
    if (typeof backup.deck !== 'object' || backup.deck === null) return null;

    // Keep only entries that look like cards, so a truncated or hand-edited
    // file cannot poison the scheduler.
    const deck: Deck = {};
    for (const [concept, card] of Object.entries(backup.deck)) {
      if (
        card &&
        typeof card === 'object' &&
        typeof (card as { stability?: unknown }).stability === 'number' &&
        typeof (card as { difficulty?: unknown }).difficulty === 'number' &&
        typeof (card as { due?: unknown }).due === 'number'
      ) {
        deck[concept] = card as Deck[string];
      }
    }
    return deck;
  } catch {
    return null;
  }
}
