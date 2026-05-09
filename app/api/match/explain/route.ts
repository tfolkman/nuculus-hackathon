import { generateText } from "ai";
import { aiModel } from "@/lib/ai/provider";
import { ExplanationSchema } from "@/lib/ai/schemas";
import { getEntityById } from "@/lib/data/seed-entities";
import { scoreMatch, totalScore, confidenceFromScore } from "@/lib/matching/score";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const url = new URL(req.url);
  const sourceId = url.searchParams.get("sourceId") || "";
  const targetId = url.searchParams.get("targetId") || "";

  if (!sourceId || !targetId) {
    return NextResponse.json({ error: "Missing sourceId or targetId" }, { status: 400 });
  }

  const source = getEntityById(sourceId);
  const target = getEntityById(targetId);
  if (!source || !target) {
    return NextResponse.json({ error: "Entity not found" }, { status: 404 });
  }

  // Always run deterministic scoring
  const breakdown = scoreMatch(source, target);
  const score = totalScore(breakdown);
  const confidence = confidenceFromScore(score);

  // Deterministic fallback — forced into ExplanationSchema shape
  if (!aiModel) {
    const { buildExplanation } = await import("@/lib/matching/explain");
    const fallback = buildExplanation(source, target);

    const fallbackMatchingSchema = {
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

    return NextResponse.json(fallbackMatchingSchema);
  }

  // AI enabled → try to generate structured explanation
  try {
    const { text } = await generateText({
      model: aiModel,
      prompt:
        `You are an AI match explainer for Nucleus Connect, a Utah innovation ecosystem matching platform. ` +
        `Explain why ${source.name} (${source.headline}) is a good match for ${target.name} (${target.headline}). ` +
        `Use plain English. Be specific about Utah context when relevant. ` +
        `Score breakdown (out of 100): ${JSON.stringify(breakdown)}. ` +
        `Source summary: ${source.summary}. Target summary: ${target.summary}.\n\n` +
        `Return ONLY a valid JSON object with this exact structure. No markdown, no explanation, just raw JSON:\n\n` +
        `{\n` +
        `  "summary": "1-2 sentence match summary",\n` +
        `  "topReasons": [\n` +
        `    {"label": "Reason title", "detail": "Detailed explanation"}\n` +
        `  ],\n` +
        `  "gaps": [\n` +
        `    {"label": "Gap title", "detail": "Risk or missing info"}\n` +
        `  ],\n` +
        `  "suggestedIntro": "Full intro email text",\n` +
        `  "nextBestAction": "What to do next"\n` +
        `}`,
    });

    // Parse JSON from the text response
    const cleaned = text.trim().replace(/^```json\s*/, "").replace(/```\s*$/, "");
    const parsed = JSON.parse(cleaned);

    // Validate against schema
    const validated = ExplanationSchema.parse(parsed);

    return NextResponse.json(validated);
  } catch (error) {
    console.error("AI explanation generation failed, using fallback:", error);

    // Return deterministic fallback in schema shape
    const { buildExplanation } = await import("@/lib/matching/explain");
    const fallback = buildExplanation(source, target);

    const fallbackMatchingSchema = {
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

    return NextResponse.json(fallbackMatchingSchema);
  }
}
