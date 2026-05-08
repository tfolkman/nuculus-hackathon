import { Entity, ScoreBreakdown, Need, Offer } from "@/lib/types";

function overlapScore(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const setB = new Set(b);
  const matches = a.filter((x) => setB.has(x)).length;
  return matches / Math.min(a.length, b.length);
}

function containsKeyword(a: string[], b: Need[] | Offer[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const keywords = b.flatMap((x) => x.description.toLowerCase().split(/\W+/));
  const setB = new Set(keywords);
  const matches = a.filter((x) => setB.has(x.toLowerCase())).length;
  return matches / Math.min(a.length, keywords.length || 1);
}

export function scoreMatch(source: Entity, target: Entity): ScoreBreakdown {
  const sectorFit = Math.round(overlapScore(source.sectors, target.sectors) * 20);

  const sourceOffers = source.offers || [];
  const targetNeeds = target.needs || [];
  const sourceNeeds = source.needs || [];
  const targetOffers = target.offers || [];
  const roleNeedFit = Math.round(
    Math.max(
      containsKeyword(source.skills, targetNeeds),
      containsKeyword(source.expertise, targetNeeds),
      containsKeyword(sourceOffers.map((o) => o.description), targetNeeds),
      containsKeyword(targetOffers.map((o) => o.description), sourceNeeds)
    ) * 20
  );

  const stageFit = Math.round(
    overlapScore(
      source.stagePreferences || [],
      target.stagePreferences || []
    ) * 15
  );

  const skillExpertiseFit = Math.round(
    Math.max(
      overlapScore(source.skills, target.skills),
      overlapScore(source.skills, target.expertise),
      overlapScore(source.expertise, target.skills),
      overlapScore(source.expertise, target.expertise)
    ) * 15
  );

  let availabilityFit = 0;
  if (source.availability === target.availability) availabilityFit = 10;
  else if (source.availability && target.availability) {
    const compat: Record<string, string[]> = {
      full_time: ["full_time", "fractional"],
      fractional: ["fractional", "advisory", "full_time"],
      advisory: ["advisory", "fractional"],
      internship: ["internship", "fractional"],
      not_available: [],
    };
    if (compat[source.availability]?.includes(target.availability)) {
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
  if (target.publicSignals?.some((s) => s.source.includes("nucleus")))
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
  if (score >= 75) return "high";
  if (score >= 50) return "medium";
  return "low";
}
