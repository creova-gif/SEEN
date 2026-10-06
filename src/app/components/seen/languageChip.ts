/**
 * Language chip text for the card `typeLabel` slot (E2, DS1 slot budget).
 * Viewer's language first; at most two codes then "+N" so the chip never overflows
 * at 320 px; no languages field means no chip.
 */
export function languageChipText(languages: readonly string[] | undefined, viewer: string): string | null {
  if (!languages || languages.length === 0) return null;
  const codes = [...new Set(languages.map(l => l.toUpperCase()))];
  const v = viewer.toUpperCase();
  codes.sort((a, b) => (a === v ? -1 : b === v ? 1 : 0));
  if (codes.length === 1) return codes[0];
  if (codes.length === 2) return `${codes[0]} · ${codes[1]}`;
  return `${codes[0]} +${codes.length - 1}`;
}
