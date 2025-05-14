export function normalizeBibleText(text: string): string {
  // Step 1: Normalize Unicode composition (NFKD)
  let normalized = text.normalize("NFKD");

  // Step 2: Replace specific Unicode characters
  const replacements: Record<string, string> = {
    // Quotes and apostrophes
    "[\u2018\u2019\u02BC]": "'",
    "[\u201C\u201D]": '"',
    // Dashes
    "[\u2013\u2014]": "-",
    // Spaces
    "[\u00A0\u202F]": " ",
    // Ellipsis
    "\u2026": "...",
    // Angle quotes
    "[\u00AB\u00BB]": '"',
    // Hebrew and Greek special characters
    "[\u05BE\u05C3\u05C6]": "-",
    "[\u037E\u0387]": ";",
  };

  for (const [unicode, replacement] of Object.entries(replacements)) {
    normalized = normalized.replace(new RegExp(unicode, "g"), replacement);
  }

  // Step 3: Remove combining diacritical marks
  normalized = normalized.replace(/[\u0300-\u036F]/g, "");

  // Step 4: Remove other non-ASCII characters (optional)
  // normalized = normalized.replace(/[^\x00-\x7F]/g, '');

  return normalized;
}
