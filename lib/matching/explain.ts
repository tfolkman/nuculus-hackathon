import { Entity, Match, ScoreBreakdown, MatchReason, EvidenceSignal, MatchGap } from "@/lib/types";
import { scoreMatch, totalScore, confidenceFromScore } from "./score";
import { formatLabel } from "@/lib/format";

/** Word-boundary-aware phrase check — prevents "ai" from matching "aiden" */
function phraseIncludes(text: string, phrase: string): boolean {
  const t = text.toLowerCase();
  const p = phrase.toLowerCase();
  const idx = t.indexOf(p);
  if (idx === -1) return false;
  const before = idx === 0 ? " " : t[idx - 1];
  const after = idx + p.length >= t.length ? " " : t[idx + p.length];
  return !/\w/.test(before) && !/\w/.test(after);
}

/** Check if the entity has meaningful user-provided data vs. defaults/inferences */
function isProfileSparse(entity: Entity): boolean {
  const hasRealSkills = entity.skills.length > 0 && !entity.skills.every((s) => s === "");
  const hasRealSectors = entity.sectors.length > 0;
  const hasRealSummary = entity.summary.length > 20;
  const hasRealNeeds = entity.needs.length > 0;
  const hasRealOffers = entity.offers.length > 0 && !entity.offers.every((o) => o.description === entity.summary);
  return !hasRealSkills && !hasRealSectors && !hasRealSummary && !hasRealNeeds && !hasRealOffers;
}

/** Check if a field was likely auto-inferred rather than explicitly stated */
function wasInferred(entity: Entity, field: "availability" | "stagePreferences" | "sectors" | "missionInterests"): boolean {
  const text = (entity.summary + " " + entity.headline).toLowerCase();
  if (field === "availability" && entity.availability) {
    const availTerms: Record<string, string[]> = {
      full_time: ["full-time", "full time", "employee", "hire"],
      fractional: ["fractional", "part-time", "part time", "consultant"],
      advisory: ["advisor", "advisory", "board", "mentor"],
      internship: ["intern", "student", "internship"],
    };
    const terms = availTerms[entity.availability] || [];
    return !terms.some((t) => text.includes(t));
  }
  if (field === "stagePreferences") {
    const stageTerms: Record<string, string[]> = {
      pre_seed: ["pre-seed", "preseed", "very early"],
      seed: ["seed", "early stage", "startup"],
      series_a: ["series a", "series-a"],
      growth: ["growth", "scaling", "scale"],
      prototype: ["prototype", "mvp"],
    };
    return entity.stagePreferences.some((stage) => {
      const terms = stageTerms[stage] || [];
      return !terms.some((t) => text.includes(t));
    });
  }
  if (field === "sectors") {
    const sectorTerms: Record<string, string[]> = {
      life_sciences: ["medical", "biotech", "pharma", "health"],
      ai: ["ai", "machine learning", "ml", "artificial intelligence"],
      defense_aerospace: ["defense", "aerospace", "military", "dod"],
      cyber: ["cyber", "security"],
      energy: ["energy", "solar", "battery", "renewable"],
      advanced_manufacturing: ["manufactur", "factory", "production", "industrial"],
      fintech: ["fintech", "finance", "banking"],
      software: ["software", "saas", "app"],
      cleantech: ["clean", "climate", "green"],
    };
    return entity.sectors.some((sector) => {
      const terms = sectorTerms[sector] || [];
      return !terms.some((t) => text.includes(t));
    });
  }
  if (field === "missionInterests") {
    if (entity.missionInterests.includes("utah_ecosystem")) {
      return !/utah|salt lake|provo|logan|byu|usu/.test(text);
    }
    return false;
  }
  return false;
}

/** Check if headline/summary text semantically aligns with target */
function findTextualConnections(source: Entity, target: Entity): MatchReason[] {
  const reasons: MatchReason[] = [];
  const sourceText = (source.headline + " " + source.summary).toLowerCase();

  if (/manufactur|production|factory|industrial/.test(sourceText)) {
    const targetHasManufacturing = target.sectors.includes("advanced_manufacturing") ||
      target.headline.toLowerCase().includes("manufactur") ||
      target.summary.toLowerCase().includes("manufactur") ||
      target.needs.some((n) => /manufactur|production|factory/.test(n.description.toLowerCase()));
    if (targetHasManufacturing) {
      reasons.push({
        label: "Manufacturing background",
        detail: `${source.name}'s background in manufacturing aligns with ${target.name}'s work in advanced manufacturing and production.`,
      });
    }
  }

  if (/energy|power|grid|battery|solar|renewable/.test(sourceText)) {
    const targetHasEnergy = target.sectors.includes("energy") ||
      target.headline.toLowerCase().includes("energy") ||
      target.summary.toLowerCase().includes("energy");
    if (targetHasEnergy) {
      reasons.push({
        label: "Energy sector interest",
        detail: `${source.name} has expressed interest in the energy sector, which aligns with ${target.name}'s focus.`,
      });
    }
  }

  if (/mit\b|massachusetts institute|stanford|harvard|phd|masters|mba/.test(sourceText)) {
    reasons.push({
      label: "Strong academic background",
      detail: `${source.name} brings advanced education credentials that may strengthen ${target.name}'s technical team.`,
    });
  }

  if (/manager|director|lead|head|vp|coo|ceo|cto|executive/.test(sourceText)) {
    const targetNeedsLeadership = target.needs.some((n) =>
      /coo|ceo|cto|vp|director|manager|lead|executive/.test(n.description.toLowerCase())
    );
    if (targetNeedsLeadership) {
      reasons.push({
        label: "Leadership experience",
        detail: `${source.name} has leadership experience that matches ${target.name}'s need for senior operational talent.`,
      });
    }
  }

  return reasons;
}

export function buildExplanation(source: Entity, target: Entity): Omit<Match, "id" | "createdAt" | "reviewedAt" | "reviewer" | "affinitySyncStatus"> & { breakdown: ScoreBreakdown } {
  const breakdown = scoreMatch(source, target);
  const score = totalScore(breakdown);
  const confidence = confidenceFromScore(score);
  const sourceIsSparse = isProfileSparse(source);

  const reasons: MatchReason[] = [];
  const evidence: EvidenceSignal[] = [];
  const gaps: MatchGap[] = [];

  // HONESTY CHECK: If source profile is basically empty, say so upfront
  if (sourceIsSparse) {
    gaps.push({
      label: "Incomplete profile",
      detail: `${source.name}'s profile lacks detail. The match score is based on minimal information. Ask for more background on skills, experience, and specific interests before making an introduction.`,
    });
  }

  // Try to find textual connections from headline/summary first
  const textReasons = findTextualConnections(source, target);
  reasons.push(...textReasons);
  textReasons.forEach((r) => {
    evidence.push({ field: "profile_text", value: r.label });
  });

  // Only claim sector alignment if sectors were actually stated (not inferred)
  if (breakdown.sectorFit >= 10 && !wasInferred(source, "sectors")) {
    const shared = source.sectors.filter((s) => target.sectors.includes(s));
    if (shared.length > 0) {
      reasons.push({
        label: "Sector alignment",
        detail: `${source.name}'s focus on ${shared.map(formatLabel).join(", ")} directly aligns with ${target.name}'s work in ${target.sectors.map(formatLabel).join(", ")}.`,
      });
      evidence.push({ field: "Sectors", value: shared.map(formatLabel).join(", ") });
    }
  }

  // Only claim skill-to-need fit if source actually has skills
  if (breakdown.roleNeedFit >= 10 && source.skills.length > 0 && !source.skills.every((s) => s === "")) {
    const skillMatches = source.skills.filter((s) =>
      target.needs?.some((n) => phraseIncludes(n.description, s.replace(/_/g, " ")))
    );
    const expertiseMatches = source.expertise.filter((e) =>
      target.needs?.some((n) => phraseIncludes(n.description, e.replace(/_/g, " ")))
    );
    const allMatches = [...new Set([...skillMatches, ...expertiseMatches])];
    if (allMatches.length > 0) {
      const needDesc = target.needs?.find((n) =>
        allMatches.some((m) => phraseIncludes(n.description, m.replace(/_/g, " ")))
      )?.description || target.needs?.[0]?.description || "key needs";

      reasons.push({
        label: "Skill-to-need fit",
        detail: `${source.name}'s background in ${allMatches.slice(0, 3).map(formatLabel).join(", ")} directly addresses ${target.name}'s need: "${needDesc}".`,
      });
      evidence.push({ field: "Skills", value: allMatches.slice(0, 3).map(formatLabel).join(", ") });
    }
  }

  // Utah context: be honest about whether it's real or just auto-filled
  if (breakdown.utahContextFit >= 5) {
    const sharedInst = source.institutionAffiliations?.filter(
      (i) => i !== "none" && i !== "out_of_state" && target.institutionAffiliations?.includes(i)
    ) || [];
    if (sharedInst.length > 0) {
      reasons.push({
        label: "Utah ecosystem connection",
        detail: `${source.name} and ${target.name} are both connected to ${sharedInst.map(formatLabel).join(", ")}.`,
      });
      evidence.push({ field: "Institutions", value: sharedInst.map(formatLabel).join(", ") });
    } else if (source.location?.toLowerCase().includes("utah") && target.location?.toLowerCase().includes("utah")) {
      reasons.push({
        label: "Utah location",
        detail: `Both are based in Utah, which may facilitate in-person collaboration.`,
      });
      evidence.push({ field: "Location", value: `${source.location} • ${target.location}` });
    }
  }

  // Availability: only claim alignment if explicitly stated
  if (breakdown.availabilityFit >= 5 && !wasInferred(source, "availability")) {
    const srcAvail = source.availability || "flexible";
    reasons.push({
      label: "Availability alignment",
      detail: `${source.name} is available for ${formatLabel(srcAvail)} engagement, which matches what ${target.name} is looking for.`,
    });
    evidence.push({ field: "Availability", value: formatLabel(srcAvail) });
  } else if (breakdown.availabilityFit >= 5 && wasInferred(source, "availability")) {
    gaps.push({
      label: "Availability not confirmed",
      detail: `${source.name} did not specify availability. Defaulted to "${formatLabel(source.availability || "flexible")}" — confirm their preferred engagement model before introducing.`,
    });
  }

  // Stage: only claim alignment if explicitly stated
  if (breakdown.stageFit >= 7 && !wasInferred(source, "stagePreferences")) {
    const sharedStages = source.stagePreferences?.filter((s) => target.stagePreferences?.includes(s)) || [];
    if (sharedStages.length > 0) {
      reasons.push({
        label: "Stage alignment",
        detail: `Both are focused on ${sharedStages.map(formatLabel).join(", ")} stage — ensuring aligned expectations on company maturity and risk profile.`,
      });
      evidence.push({ field: "Stage", value: sharedStages.map(formatLabel).join(", ") });
    }
  } else if (breakdown.stageFit >= 7 && wasInferred(source, "stagePreferences")) {
    gaps.push({
      label: "Stage preference not confirmed",
      detail: `${source.name} did not specify stage preferences. Defaulted to "${source.stagePreferences.map(formatLabel).join(", ")}" — confirm their interest in this stage before introducing.`,
    });
  }

  // Skill expertise
  if (breakdown.skillExpertiseFit >= 7) {
    const shared = source.skills.filter((s) => target.skills.includes(s) || target.expertise.includes(s));
    if (shared.length > 0) {
      reasons.push({
        label: "Shared expertise",
        detail: `They bring complementary capabilities in ${shared.slice(0, 3).map(formatLabel).join(", ")}, making collaboration natural.`,
      });
      evidence.push({ field: "shared_skills", value: shared.slice(0, 3).map(formatLabel).join(", ") });
    }
  }

  // Mission: DON'T show if it was auto-filled for everyone
  if (breakdown.missionFit >= 3 && !wasInferred(source, "missionInterests")) {
    const shared = source.missionInterests?.filter((m) => target.missionInterests?.includes(m)) || [];
    if (shared.length > 0) {
      reasons.push({
        label: "Mission alignment",
        detail: `Shared mission interests in ${shared.map(formatLabel).join(", ")} suggest strong cultural and values fit.`,
      });
      evidence.push({ field: "Mission", value: shared.map(formatLabel).join(", ") });
    }
  }

  // Gaps for low scores
  if (breakdown.roleNeedFit < 5) {
    gaps.push({
      label: "Skill gap",
      detail: `${target.name} needs expertise that ${source.name}'s profile doesn't clearly demonstrate. A mentorship or training bridge may help.`,
    });
  }

  if (breakdown.sectorFit < 5 && source.sectors.length > 0) {
    gaps.push({
      label: "Sector mismatch risk",
      detail: `${source.name} focuses on ${source.sectors.map(formatLabel).join(", ")} while ${target.name} is in ${target.sectors.map(formatLabel).join(", ")}. Consider if cross-sector experience is relevant.`,
    });
  }

  if (breakdown.availabilityFit < 5 && source.availability) {
    gaps.push({
      label: "Availability uncertainty",
      detail: `${source.name} is ${formatLabel(source.availability)}, but ${target.name} may need a different engagement model.`,
    });
  }

  if (source.needs?.length && !target.offers?.length) {
    gaps.push({
      label: "Unmet needs",
      detail: `${source.name} has needs that ${target.name} may not be able to address.`,
    });
  }

  if (target.needs?.length && !source.offers?.length) {
    gaps.push({
      label: "Unmet needs",
      detail: `${target.name} has needs that ${source.name} may not be able to address.`,
    });
  }

  // If no real reasons found, be honest
  if (reasons.length === 0) {
    if (sourceIsSparse) {
      reasons.push({
        label: "Potential opportunity",
        detail: `${source.name} and ${target.name} are both in Utah's innovation ecosystem, but ${source.name}'s profile lacks enough detail to assess fit. Recommend gathering more information before introducing.`,
      });
    } else {
      reasons.push({
        label: "General opportunity",
        detail: `${source.name} and ${target.name} are both part of Utah's innovation ecosystem and may find unexpected synergies.`,
      });
    }
  }

  const suggestedIntro = generateIntro(source, target, reasons, sourceIsSparse);
  const nextBestAction = sourceIsSparse
    ? "Request a detailed profile from " + source.name + " before making any introduction"
    : score >= 65
    ? "Approve introduction and schedule first meeting"
    : score >= 40
    ? "Gather additional availability or funding signal, then introduce"
    : "Request more profile detail or confirm mutual interest before introduction";

  return {
    sourceEntityId: source.id,
    targetEntityId: target.id,
    score,
    confidence,
    status: "suggested",
    reasons,
    evidence,
    gaps,
    suggestedIntro,
    nextBestAction,
    breakdown,
  };
}

function generateIntro(source: Entity, target: Entity, reasons: MatchReason[], sourceIsSparse: boolean): string {
  const topReason = reasons[0]?.detail || "Both are active in Utah's innovation ecosystem.";

  if (sourceIsSparse) {
    return `Subject: Nucleus Connect — Potential Introduction: ${source.name} & ${target.name}

Hi ${target.name.split(" ")[0]},

I hope you're doing well. I wanted to introduce you to ${source.name} — ${source.headline}.

${topReason}

${target.name} is ${target.headline}.

Before making this introduction formal, I'd recommend we gather more details about ${source.name}'s background and specific interests. Would you be open to a brief exploratory conversation?

Best,
Nucleus Team`;
  }

  return `Subject: Nucleus Connect — Introduction: ${source.name} & ${target.name}

Hi ${target.name.split(" ")[0]},

I hope you're doing well. I wanted to introduce you to ${source.name} — ${source.headline}.

${topReason}

${target.name} is ${target.headline}.

I think there's a strong opportunity for you two to connect. Would you be open to a brief intro call?

Best,
Nucleus Team`;
}

export function rankMatches(source: Entity, candidates: Entity[]): ReturnType<typeof buildExplanation>[] {
  const scored = candidates
    .filter((c) => c.id !== source.id)
    .map((c) => buildExplanation(source, c))
    .sort((a, b) => b.score - a.score);

  return scored;
}
