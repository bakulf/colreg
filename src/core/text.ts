/**
 * Joins the vessels a single picture could honestly be into one option.
 *
 * Only the first keeps its capital, so the option reads as one sentence rather
 * than a list of headings: "A sailing vessel underway, or a vessel being towed".
 */
export function joinAlternatives(parts: readonly string[]): string {
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0] as string;

  const cased = parts.map((p, i) =>
    i === 0 ? p : p.replace(/^An? /, (article) => article.toLowerCase()),
  );
  return `${cased.slice(0, -1).join('; ')}, or ${cased[cased.length - 1]}`;
}
