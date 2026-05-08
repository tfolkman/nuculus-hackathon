import { Entity, ScoreBreakdown, Need, Offer } from "@/lib/types";

function overlapScore(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const setB = new Set(b);
  const matches = a.filter((x) => setB.has(x)).length;
  return matches / Math.min(a.length, b.length);
}

function tokenSet(texts: string[]): Set<string> {
  const tokens = texts.flatMap((t) =>
    t.toLowerCase().split(/[\W_]+/).filter((w) => w.length > 2)
  );
  return new Set(tokens);
}

function textOverlap(a: string[], b: Need[] | Offer[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const setA = tokenSet(a);
  const setB = tokenSet(b.map((x) => x.description));
  if (!setA.size || !setB.size) return 0;
  let matches = 0;
  for (const t of setA) if (setB.has(t)) matches++;
  return matches / Math.min(setA.size, setB.size);
}

function inferAvailabilityFromNeeds(entity: Entity): string | undefined {
  const needsDesc = entity.needs?.map((n) => n.description).join(" ") || "";
  const offersDesc = entity.offers?.map((o) => o.description).join(" ") || "";
  const combined = (needsDesc + " " + offersDesc).toLowerCase();

  if (/\bfractional\b/.test(combined)) return "fractional";
  if (/\bintern(?:ship)?\b|\bstudent\b/.test(combined)) return "internship";
  if (/\badvisor(?:y)?\b|\bboard\b/.test(combined)) return "advisory";
  if (/\bfull[-\s]?time\b|\bco[-\s]?founder\b|\bcto\b|\bceo\b|\bcoo\b|\bvp\b/.test(combined)) return "full_time";
  return "full_time";
}

/** Extract tokens from an entity's unstructured text fields as fallback */
function entityTextTokens(entity: Entity): Set<string> {
  const sources = [
    entity.summary,
    entity.headline,
    entity.name,
    ...entity.tags,
    ...(entity.publicSignals?.map((s) => s.summary + " " + s.label) || []),
  ].filter(Boolean) as string[];
  return tokenSet(sources);
}

/** Sector synonyms for text-based fallback matching */
const SECTOR_KEYWORDS: Record<string, string[]> = {
  life_sciences: ["medical", "biotech", "pharma", "diagnostic", "fda", "therapeutic", "clinical", "health", "patient"],
  ai: ["machine", "learning", "neural", "algorithm", "model", "deep", "computer", "vision", "nlp"],
  defense_aerospace: ["defense", "aerospace", "military", "dod", "aircraft", "satellite", "tactical"],
  cyber: ["cyber", "security", "cryptography", "encryption", "threat", "zero", "trust", "compliance"],
  energy: ["energy", "solar", "battery", "grid", "microgrid", "renewable", "power", "cleantech", "clean"],
  advanced_manufacturing: ["manufacturing", "factory", "production", "industrial", "automation", "robotics", "defect"],
  fintech: ["fintech", "financial", "banking", "payment", "credit", "crypto", "blockchain", "quantum"],
  software: ["software", "saas", "app", "platform", "api", "developer", "code", "cloud"],
  cleantech: ["clean", "climate", "carbon", "green", "sustainable", "environmental", "agriculture"],
};

function detectSectorsFromText(entity: Entity): string[] {
  const tokens = entityTextTokens(entity);
  const detected: string[] = [];
  for (const [sector, keywords] of Object.entries(SECTOR_KEYWORDS)) {
    if (keywords.some((k) => tokens.has(k))) detected.push(sector);
  }
  return detected;
}

function detectStageFromText(entity: Entity): string[] {
  const text = (entity.summary + " " + entity.headline).toLowerCase();
  const stages: string[] = [];
  if (/\bpre[-\s]?seed\b/.test(text)) stages.push("pre_seed");
  if (/\bseed[-\s]?stage\b|\braising seed\b/.test(text)) stages.push("seed");
  if (/\bseries a\b/.test(text)) stages.push("series_a");
  if (/\bgrowth\b|\bscaling\b/.test(text)) stages.push("growth");
  if (/\bprototype\b/.test(text)) stages.push("prototype");
  if (/\bsbir\b/.test(text)) stages.push("sbir_phase_i", "sbir_phase_ii");
  if (stages.length === 0 && /\bstartup\b|\bearly\b/.test(text)) stages.push("seed");
  return stages;
}

function detectAvailabilityFromText(entity: Entity): string | undefined {
  const text = (entity.summary + " " + entity.headline + " " + entity.tags.join(" ")).toLowerCase();
  if (/\bfractional\b/.test(text)) return "fractional";
  if (/\bintern(?:ship)?\b|\bstudent\b/.test(text)) return "internship";
  if (/\badvisor(?:y)?\b|\bboard\b/.test(text)) return "advisory";
  if (/\bfull[-\s]?time\b|\bco[-\s]?founder\b/.test(text)) return "full_time";
  return undefined;
}

function enrichedSectors(entity: Entity): string[] {
  if (entity.sectors.length > 0) return entity.sectors;
  return detectSectorsFromText(entity);
}

function enrichedSkills(entity: Entity): string[] {
  if (entity.skills.length > 0) return entity.skills;
  const tokens = entityTextTokens(entity);
  const skillKeywords = [
    "commercialization", "regulatory", "engineering", "sales", "marketing",
    "software", "hardware", "machine", "learning", "python", "typescript",
    "operations", "strategy", "finance", "legal", "patent", "grant",
    "management", "leadership", "product", "design", "data", "analysis",
  ];
  return skillKeywords.filter((k) => tokens.has(k));
}

function enrichedExpertise(entity: Entity): string[] {
  if (entity.expertise.length > 0) return entity.expertise;
  const tokens = entityTextTokens(entity);
  const expKeywords = [
    "fda", "510k", "clinical", "trials", "iso", "supply", "chain",
    "municipal", "contracts", "enterprise", "fortune", "channel",
    "partnerships", "devops", "security", "nist", "fedramp",
  ];
  return expKeywords.filter((k) => tokens.has(k));
}

function enrichedStages(entity: Entity): string[] {
  if (entity.stagePreferences.length > 0) return entity.stagePreferences;
  return detectStageFromText(entity);
}

function enrichedAvailability(entity: Entity): string | undefined {
  return entity.availability || detectAvailabilityFromText(entity) || (entity.type === "startup" ? inferAvailabilityFromNeeds(entity) : undefined);
}

export function scoreMatch(source: Entity, target: Entity): ScoreBreakdown {
  const srcSectors = enrichedSectors(source);
  const tgtSectors = enrichedSectors(target);
  const sectorFit = Math.round(overlapScore(srcSectors, tgtSectors) * 25);

  const srcSkills = enrichedSkills(source);
  const srcExpertise = enrichedExpertise(source);
  const tgtSkills = enrichedSkills(target);
  const tgtExpertise = enrichedExpertise(target);

  const sourceOffers = source.offers || [];
  const targetNeeds = target.needs || [];
  const sourceNeeds = source.needs || [];
  const targetOffers = target.offers || [];

  // Use enriched text tokens as fallback for skill/need matching
  const srcSkillTokens = source.skills.length > 0 ? source.skills : Array.from(entityTextTokens(source));
  const srcExpertiseTokens = source.expertise.length > 0 ? source.expertise : Array.from(entityTextTokens(source));

  const roleNeedFit = Math.round(
    Math.max(
      textOverlap(srcSkillTokens, targetNeeds),
      textOverlap(srcExpertiseTokens, targetNeeds),
      textOverlap(sourceOffers.map((o) => o.description), targetNeeds),
      textOverlap(targetOffers.map((o) => o.description), sourceNeeds)
    ) * 25
  );

  const srcStages = enrichedStages(source);
  const tgtStages = enrichedStages(target);
  const stageFit = Math.round(
    overlapScore(srcStages, tgtStages) * 15
  );

  const skillExpertiseFit = Math.round(
    Math.max(
      overlapScore(srcSkills, tgtSkills),
      overlapScore(srcSkills, tgtExpertise),
      overlapScore(srcExpertise, tgtSkills),
      overlapScore(srcExpertise, tgtExpertise)
    ) * 15
  );

  let availabilityFit = 0;
  const srcAvail = enrichedAvailability(source);
  const tgtAvail = enrichedAvailability(target);

  if (srcAvail === tgtAvail && srcAvail) availabilityFit = 10;
  else if (srcAvail && tgtAvail) {
    const compat: Record<string, string[]> = {
      full_time: ["full_time", "fractional"],
      fractional: ["fractional", "advisory", "full_time"],
      advisory: ["advisory", "fractional"],
      internship: ["internship", "fractional"],
      not_available: [],
    };
    if (compat[srcAvail]?.includes(tgtAvail)) {
      availabilityFit = 5;
    }
  }

  let utahContextFit = 0;
  const utahInstitutions = source.institutionAffiliations?.filter(
    (i) => i !== "none" && i !== "out_of_state"
  ) || [];
  const targetUtahInst = target.institutionAffiliations?.filter(
    (i) => i !== "none" && i !== "out_of_state"
  ) || [];
  if (utahInstitutions.length > 0 && targetUtahInst.length > 0) {
    utahContextFit = Math.round(
      overlapScore(utahInstitutions, targetUtahInst) * 10
    );
  }
  if (source.location?.toLowerCase().includes("utah")) utahContextFit += 2;
  if (target.location?.toLowerCase().includes("utah")) utahContextFit += 2;
  if (source.tags?.some((t) => t.includes("spinout"))) utahContextFit += 3;
  if (target.tags?.some((t) => t.includes("spinout"))) utahContextFit += 3;
  if (target.publicSignals?.some((s) => s.source.includes("nucleus")))
    utahContextFit += 2;
  if (source.publicSignals?.some((s) => s.source.includes("nucleus")))
    utahContextFit += 2;
  if (utahContextFit > 10) utahContextFit = 10;

  const missionFit = Math.round(
    overlapScore(source.missionInterests || [], target.missionInterests || []) * 5
  );

  let networkLeverage = 0;
  if (
    (source.publicSignals?.length || 0) > 0 &&
    (target.publicSignals?.length || 0) > 0
  ) {
    networkLeverage = 2;
  }
  if ((source.affinity?.personId || source.affinity?.orgId) && (target.affinity?.personId || target.affinity?.orgId)) {
    networkLeverage += 3;
  }
  if (networkLeverage > 5) networkLeverage = 5;

  return {
    sectorFit,
    roleNeedFit,
    stageFit,
    skillExpertiseFit,
    availabilityFit,
    utahContextFit,
    missionFit,
    networkLeverage,
  };
}

export function totalScore(b: ScoreBreakdown): number {
  return (
    b.sectorFit +
    b.roleNeedFit +
    b.stageFit +
    b.skillExpertiseFit +
    b.availabilityFit +
    b.utahContextFit +
    b.missionFit +
    b.networkLeverage
  );
}

export function confidenceFromScore(score: number): "low" | "medium" | "high" {
  if (score >= 65) return "high";
  if (score >= 40) return "medium";
  return "low";
}
