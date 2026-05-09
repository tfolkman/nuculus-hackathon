"use server";

import { generateText } from "ai";
import { aiModel } from "./provider";
import { Entity } from "@/lib/types";
import { computeSemanticScore } from "./semantic-score";

export async function scoreMatchWithAI(sourceJson: string, targetJson: string): Promise<{
  breakdown: import("@/lib/types").ScoreBreakdown;
  totalScore: number;
  confidence: "low" | "medium" | "high";
  aiExplanation: string;
  source: "llm" | "semantic";
} | null> {
  const source = JSON.parse(sourceJson) as Entity;
  const target = JSON.parse(targetJson) as Entity;

  const fallback = computeSemanticScore(source, target);

  if (!aiModel) {
    console.log("[AI Score] No model — returning semantic fallback");
    return { ...fallback, source: "semantic" };
  }

  const startTime = Date.now();
  console.log(`[AI Score] Trying LLM for ${source.name} ↔ ${target.name}`);

  try {
    const { text } = await generateText({
      model: aiModel,
      prompt:
        `Score this match from 0-100.\n\n` +
        `TALENT: ${source.headline}. ${source.summary}\n` +
        `STARTUP: ${target.headline}. ${target.summary}\n\n` +
        `Return ONLY JSON:\n` +
        `{` +
        `"score": number, ` +
        `"why": "1 sentence explaining semantic fit"` +
        `}`,
    });

    const elapsed = Date.now() - startTime;
    console.log(`[AI Score] LLM responded in ${elapsed}ms`);

    const cleaned = text.trim().replace(/^```json\s*/, "").replace(/```\s*$/, "");
    const parsed = JSON.parse(cleaned);
    const score = Math.min(100, Math.max(0, Math.round(parsed.score || 50)));

    const breakdown = {
      sectorFit: Math.round(score * 0.25),
      roleNeedFit: Math.round(score * 0.25),
      stageFit: Math.round(score * 0.15),
      skillExpertiseFit: Math.round(score * 0.15),
      availabilityFit: Math.round(score * 0.10),
      utahContextFit: Math.round(score * 0.05),
      missionFit: Math.round(score * 0.03),
      networkLeverage: Math.round(score * 0.02),
    };

    const confidence = score >= 65 ? "high" : score >= 40 ? "medium" : "low";

    console.log(`[AI Score] LLM score: ${score} (${confidence})`);

    return {
      breakdown,
      totalScore: score,
      confidence,
      aiExplanation: parsed.why || "LLM evaluated semantic fit.",
      source: "llm",
    };
  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`[AI Score] LLM failed after ${elapsed}ms — using fallback:`, error);
    return { ...fallback, source: "semantic" };
  }
}
