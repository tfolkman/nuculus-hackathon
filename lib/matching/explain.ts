import { Entity, Match, ScoreBreakdown, MatchReason, EvidenceSignal, MatchGap } from "@/lib/types";
import { scoreMatch, totalScore, confidenceFromScore } from "./score";

function formatToken(text: string): string {
  return text
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bFda\b/gi, "FDA")
    .replace(/\b510k\b/gi, "510(k)")
    .replace(/\bIso\b/gi, "ISO")
    .replace(/\bPma\b/gi, "PMA")
    .replace(/\bQsr\b/gi, "QSR")
    .replace(/\bEu Mdr\b/gi, "EU MDR")
    .replace(/\bNist\b/gi, "NIST")
    .replace(/\bFedramp\b/gi, "FedRAMP")
    .replace(/\bDo[dD]\b/gi, "DoD")
    .replace(/\bSbir\b/gi, "SBIR")
    .replace(/\bSttr\b/gi, "STTR")
    .replace(/\bU of U\b/gi, "University of Utah")
    .replace(/\bUsu\b/gi, "USU")
    .replace(/\bByu\b/gi, "BYU")
    .replace(/\bUv[uU]\b/gi, "UVU")
    .replace(/\bGtm\b/gi, "GTM")
    .replace(/\bM \u0026 A\b/gi, "M\u0026A")
    .replace(/\bSaas\b/gi, "SaaS")
    .replace(/\bAi\b/gi, "AI")
    .replace(/\bMl\b/gi, "ML");
}

export function buildExplanation(source: Entity, target: Entity): Omit<Match, "id" | "createdAt" | "reviewedAt" | "reviewer" | "affinitySyncStatus"> & { breakdown: ScoreBreakdown } {
  const breakdown = scoreMatch(source, target);
  const score = totalScore(breakdown);
  const confidence = confidenceFromScore(score);

  const reasons: MatchReason[] = [];
  const evidence: EvidenceSignal[] = [];
  const gaps: MatchGap[] = [];

  if (breakdown.sectorFit >= 10) {
    const shared = source.sectors.filter((s) => target.sectors.includes(s));
    reasons.push({
      label: "Sector alignment",
      detail: `${source.name}'s focus on ${shared.map(formatToken).join(", ")} directly aligns with ${target.name}'s work in ${target.sectors.map(formatToken).join(", ")}.`,
    });
    evidence.push({ field: "sectors", value: shared.map(formatToken).join(", ") });
  }

  if (breakdown.roleNeedFit >= 10) {
    const skillMatches = source.skills.filter((s) =>
      target.needs?.some((n) => n.description.toLowerCase().includes(s.toLowerCase().replace(/_/g, " ")))
    );
    const expertiseMatches = source.expertise.filter((e) =>
      target.needs?.some((n) => n.description.toLowerCase().includes(e.toLowerCase().replace(/_/g, " ")))
    );
    const allMatches = [...new Set([...skillMatches, ...expertiseMatches])];
    const needDesc = target.needs?.find((n) =>
      allMatches.some((m) => n.description.toLowerCase().includes(m.toLowerCase().replace(/_/g, " ")))
    )?.description || target.needs?.[0]?.description || "key needs";

    reasons.push({
      label: "Skill-to-need fit",
      detail: `${source.name}'s background in ${allMatches.slice(0, 3).map(formatToken).join(", ")} directly addresses ${target.name}'s need: "${needDesc}".`,
    });
    evidence.push({ field: "skills", value: allMatches.slice(0, 3).map(formatToken).join(", ") });
  }

  if (breakdown.utahContextFit >= 5) {
    const sharedInst = source.institutionAffiliations?.filter(
      (i) => i !== "none" && i !== "out_of_state" && target.institutionAffiliations?.includes(i)
    ) || [];
    const instText = sharedInst.length > 0
      ? `Both are connected to ${sharedInst.map(formatToken).join(", ")}.`
      : `Both are deeply rooted in Utah's innovation ecosystem.`;
    reasons.push({
      label: "Utah ecosystem connection",
      detail: `${source.name} (${source.location}) and ${target.name} (${target.location}) strengthen Utah's network. ${instText}`,
    });
    evidence.push({ field: "utah_signals", value: `${source.location} \u2022 ${target.location}` });
  }

  if (breakdown.availabilityFit >= 5) {
    const srcAvail = formatToken(source.availability || "flexible");
    const tgtNeeds = target.needs?.map((n) => n.description).join("; ") || "their current context";
    reasons.push({
      label: "Availability alignment",
      detail: `${source.name}'s ${srcAvail} availability matches ${target.name}'s needs: ${tgtNeeds}.`,
    });
    evidence.push({ field: "availability", value: srcAvail });
  }

  if (breakdown.stageFit >= 7) {
    const sharedStages = source.stagePreferences?.filter((s) => target.stagePreferences?.includes(s)) || [];
    reasons.push({
      label: "Stage alignment",
      detail: `Both are focused on ${sharedStages.map(formatToken).join(", ")} stage \u2014 ensuring aligned expectations on company maturity and risk profile.`,
    });
    evidence.push({ field: "stage", value: sharedStages.map(formatToken).join(", ") });
  }

  if (breakdown.skillExpertiseFit >= 7) {
    const shared = source.skills.filter((s) => target.skills.includes(s) || target.expertise.includes(s));
    reasons.push({
      label: "Shared expertise",
      detail: `They bring complementary capabilities in ${shared.slice(0, 3).map(formatToken).join(", ")}, making collaboration natural.`,
    });
    evidence.push({ field: "shared_skills", value: shared.slice(0, 3).map(formatToken).join(", ") });
  }

  if (breakdown.missionFit >= 3) {
    const shared = source.missionInterests?.filter((m) => target.missionInterests?.includes(m)) || [];
    reasons.push({
      label: "Mission alignment",
      detail: `Shared mission interests in ${shared.map(formatToken).join(", ")} suggest strong cultural and values fit.`,
    });
    evidence.push({ field: "mission", value: shared.map(formatToken).join(", ") });
  }

  // Gaps
  if (breakdown.sectorFit < 5) {
    gaps.push({
      label: "Sector mismatch risk",
      detail: `${source.name} focuses on ${source.sectors.map(formatToken).join(", ")} while ${target.name} is in ${target.sectors.map(formatToken).join(", ")}. Consider if cross-sector experience is relevant.`,
    });
  }
  if (breakdown.roleNeedFit < 5) {
    gaps.push({
      label: "Skill gap",
      detail: `${target.name} needs expertise that ${source.name}'s profile doesn't clearly demonstrate. A mentorship or training bridge may help.`,
    });
  }
  if (breakdown.availabilityFit < 5) {
    gaps.push({
      label: "Availability uncertainty",
      detail: `${source.name} is ${formatToken(source.availability || "flexible")}, but ${target.name} may need a different engagement model.`,
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

  if (reasons.length === 0) {
    reasons.push({
      label: "General opportunity",
      detail: `${source.name} and ${target.name} are both part of Utah's innovation ecosystem and may find unexpected synergies.`,
    });
  }

  const suggestedIntro = generateIntro(source, target, reasons);
  const nextBestAction = score >= 65
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

function generateIntro(source: Entity, target: Entity, reasons: MatchReason[]): string {
  const topReason = reasons[0]?.detail || "Both are active in Utah's innovation ecosystem.";
  return `Subject: Nucleus Connect \u2014 Introduction: ${source.name} \u0026 ${target.name}

Hi ${target.name.split(" ")[0]},

I hope you're doing well. I wanted to introduce you to ${source.name} \u2014 ${source.headline}.

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
