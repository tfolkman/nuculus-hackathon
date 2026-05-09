/**
 * Format internal snake_case identifiers into human-readable labels
 * "advanced_manufacturing" → "Advanced Manufacturing"
 * "brigham_young_university" → "Brigham Young University"
 * "profile_text" → "Profile Text"
 * "ai" → "AI"
 * "fda_510k" → "FDA 510k"
 * "utah_ecosystem" → "Utah Ecosystem"
 */
export function formatLabel(input: string): string {
  if (!input) return "";

  // Special case mappings for common abbreviations
  const abbreviations: Record<string, string> = {
    ai: "AI",
    ml: "ML",
    fda: "FDA",
    dod: "DoD",
    sbir: "SBIR",
    sttr: "STTR",
    nsf: "NSF",
    nih: "NIH",
    ceo: "CEO",
    cto: "CTO",
    coo: "COO",
    cfo: "CFO",
    cmo: "CMO",
    vp: "VP",
    saas: "SaaS",
    api: "API",
    ip: "IP",
    byu: "BYU",
    usu: "USU",
    uvu: "UVU",
    trl: "TRL",
  };

  return input
    .split("_")
    .map((word, i) => {
      const lower = word.toLowerCase();
      // Check if it's a known abbreviation
      if (abbreviations[lower]) {
        return abbreviations[lower];
      }
      // Otherwise title case
      if (i === 0 || lower.length > 2) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      return word.toLowerCase();
    })
    .join(" ");
}

/**
 * Format a list of identifiers
 */
export function formatList(items: string[]): string {
  return items.map(formatLabel).join(", ");
}
