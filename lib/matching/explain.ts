import { Entity, Match, ScoreBreakdown, MatchReason, EvidenceSignal, MatchGap } from "@/lib/types";
import { scoreMatch, totalScore, confidenceFromScore } from "./score";

export function buildExplanation(source: Entity, target: Entity): Omit<Match, "id" | "createdAt" | "reviewedAt" | "reviewer" | "affinitySyncStatus"> {
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
      detail: `Both focus on ${shared.join(", ")}`,
    });
    evidence.push({ field: "sectors", value: shared.join(", ") });
  }

  if (breakdown.roleNeedFit >= 10) {
    const skillMatches = source.skills.filter((s) =>
      target.needs?.some((n) => n.description.toLowerCase().includes(s.toLowerCase()))
    );
    reasons.push({
      label: "Skill-to-need fit",
      detail: `${source.name}'s skills match ${target.name}'s needs: ${skillMatches.slice(0, 3).join(", ")}`,
    });
    evidence.push({ field: "skills", value: skillMatches.slice(0, 3).join(", ") });
  }

  if (breakdown.utahContextFit >= 5) {
    reasons.push({
      label: "Utah ecosystem connection",
      detail: "Strong Utah-specific signals (universities, Nucleus programs, local presence)",
    });
    evidence.push({ field: "utah_signals", value: `${source.location} • ${target.location}` });
  }

  if (breakdown.availabilityFit >= 5) {
    reasons.push({
      label: "Availability alignment",
      detail: `${source.availability} preference matches ${target.availability || target.type} context`,
    });
    evidence.push({ field: "availability", value: source.availability || "unknown" });
  }

  if (breakdown.skillExpertiseFit >= 7) {
    const shared = source.skills.filter((s) => target.skills.includes(s));
    reasons.push({
      label: "Shared expertise",
      detail: `Overlap in ${shared.slice(0, 3).join(", ")}`,
    });
    evidence.push({ field: "shared_skills", value: shared.slice(0, 3).join(", ") });
  }

  // Gaps
  if (breakdown.sectorFit < 5) {
    gaps.push({
      label: "Sector mismatch risk",
      detail: `${source.name} focuses on ${source.sectors.join(", ")} while ${target.name} is in ${target.sectors.join(", ")}`,
    });
  }
  if (breakdown.availabilityFit < 5) {
    gaps.push({
      label: "Availability uncertainty",
      detail: `Availability fit is uncertain (${source.availability || "unknown"} vs ${target.availability || "unknown"})`,
    });
  }
  if (source.needs?.length > 0 && target.offers?.length === 0) {
    gaps.push({
      label: "Unmet needs",
      detail: `${source.name} has needs that ${target.name} may not be able to address`,
    });
  }
  if (target.needs?.length > 0 && source.offers?.length === 0) {
    gaps.push({
      label: "Unmet needs",
      detail: `${target.name} has needs that ${source.name} may not be able to address`,
    });
  }

  if (reasons.length === 0) {
    reasons.push({
      label: "General opportunity",
      detail: `${source.name} and ${target.name} are both part of the Utah innovation ecosystem`,
    });
  }

  const suggestedIntro = generateIntro(source, target, reasons);
  const nextBestAction = score >= 75
    ? "Approve introduction and schedule first meeting"
    : score >= 50
    ? "Gather additional availability/funding signal, then introduce"
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
  };
}

function generateIntro(source: Entity, target: Entity, reasons: MatchReason[]): string {
  const reasonText = reasons.map((r) => r.detail).join(". ");
  return `Subject: Nucleus Connect — Introduction: ${source.name} \u0026 ${target.name}

Hi ${target.name.split(" ")[0]},

I hope you're doing well. I wanted to introduce you to ${source.name}—${source.headline}.

${source.name} is based in ${source.location} and active in ${source.sectors.join(", ")}. ${reasonText}.

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
