"use server";

import { generateText } from "ai";
import { aiModel } from "./provider";
import { ExplanationSchema } from "./schemas";
import { Entity } from "@/lib/types";
import { scoreMatch, totalScore, confidenceFromScore } from "@/lib/matching/score";

async function buildFallback(source: Entity, target: Entity, score: number, confidence: string) {
  const { buildExplanation } = await import("@/lib/matching/explain");
  const fallback = buildExplanation(source, target);

  return {
    summary: `Match confidence: ${confidence} (${score}%). ${fallback.reasons[0]?.detail || "Both are active in Utah's innovation ecosystem."}`,
    topReasons:
      fallback.reasons.length > 0
        ? fallback.reasons
        : [
            {
              label: "General opportunity",
              detail: `${source.name} and ${target.name} are both part of Utah's innovation ecosystem and may find unexpected synergies.`,
            },
          ],
    gaps: fallback.gaps.length > 0 ? fallback.gaps : [],
    suggestedIntro: fallback.suggestedIntro,
    nextBestAction: fallback.nextBestAction,
  };
}

export async function generateMatchExplanation(sourceJson: string, targetJson: string) {
  const source = JSON.parse(sourceJson) as Entity;
  const target = JSON.parse(targetJson) as Entity;

  if (!source || !target) {
    throw new Error("Entity not found");
  }

  const breakdown = scoreMatch(source, target);
  const score = totalScore(breakdown);
  const confidence = confidenceFromScore(score);

  // No AI → deterministic fallback
  if (!aiModel) {
    return await buildFallback(source, target, score, confidence);
  }

  // AI enabled → generate explanation (let it take as long as it needs)
  try {
    const { text } = await generateText({
      model: aiModel,
      prompt:
        `You are an AI match explainer for Nucleus Connect, a Utah innovation ecosystem matching platform. ` +
        `Your job is to explain matches HONESTLY. Do NOT make up strengths that don't exist. ` +
        `If the source profile is sparse (few skills, empty summary, no stated sectors), say so clearly.\n\n` +
        `Source: ${source.name} (${source.headline})\n` +
        `Summary: "${source.summary}"\n` +
        `Skills: [${source.skills.join(", ")}]\n` +
        `Sectors: [${source.sectors.join(", ")}]\n` +
        `Needs: [${source.needs.map((n) => n.description).join("; ")}]\n` +
        `Offers: [${source.offers.map((o) => o.description).join("; ")}]\n\n` +
        `Target: ${target.name} (${target.headline})\n` +
        `Summary: "${target.summary}"\n` +
        `Needs: [${target.needs.map((n) => n.description).join("; ")}]\n\n` +
        `Score breakdown (out of 100): ${JSON.stringify(breakdown)}.\n\n` +
        `RULES:\n` +
        `1. If source.skills is empty, do NOT claim skill alignment — instead flag it as a gap.\n` +
        `2. If source.summary is very short (<20 words), note that the profile is incomplete.\n` +
        `3. Only mention sectors if source.sectors was actually provided (not empty).\n` +
        `4. Be specific about Utah context when relevant.\n\n` +
        `CRITICAL: Return ONLY valid JSON. Every field must be present. Use "" for empty strings and [] for empty arrays. NEVER use null.\n\n` +
        `Expected JSON structure:\n` +
        `{\n` +
        `  "summary": "1-2 sentence honest match summary",\n` +
        `  "topReasons": [\n` +
        `    {"label": "Reason title", "detail": "Detailed explanation — only state real evidence"}\n` +
        `  ],\n` +
        `  "gaps": [\n` +
        `    {"label": "Gap title", "detail": "Real risk or missing info — be honest"}\n` +
        `  ],\n` +
        `  "suggestedIntro": "Full intro email text",\n` +
        `  "nextBestAction": "What to do next"\n` +
        `}`,
    });

    const cleaned = text.trim().replace(/^```json\s*/, "").replace(/```\s*$/, "");
    const parsed = JSON.parse(cleaned);
    const validated = ExplanationSchema.parse(parsed);

    return validated;
  } catch (error) {
    console.error("AI explanation failed, using fallback:", error);
    return await buildFallback(source, target, score, confidence);
  }
}
