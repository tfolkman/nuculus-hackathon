"use server";

import { generateText } from "ai";
import { aiModel } from "./provider";
import { NormalizedIntakeSchema } from "./schemas";

export async function normalizeIntake(description: string, profileType: string) {
  if (!aiModel) {
    return { fallback: true, data: null };
  }

  try {
    const { text } = await generateText({
      model: aiModel,
      prompt:
        `Extract structured profile fields from this ${profileType} description. ` +
        `Return ONLY a valid JSON object. No markdown, no explanation, just raw JSON.\n\n` +
        `CRITICAL RULES:\n` +
        `1. Every field must be present. Use empty string "" or empty array [] if unknown. NEVER use null.\n` +
        `2. "availability" must be exactly one of: "full_time", "fractional", "advisory", "internship", or "" if unclear.\n` +
        `3. "sectors" and "skills" must be arrays of strings. Use [] if none detected.\n` +
        `4. "needs" and "offers" must be arrays of objects with "category" and "description" strings. Use [] if none.\n` +
        `5. "stagePreferences" and "institutionAffiliations" must be arrays of strings. Use [] if none.\n\n` +
        `Example valid output:\n` +
        `{\n` +
        `  "headline": "Software Engineer seeking startup role",\n` +
        `  "sectors": ["software", "ai"],\n` +
        `  "skills": ["python", "react"],\n` +
        `  "needs": [],\n` +
        `  "offers": [{"category": "role", "description": "Full-stack engineer"}],\n` +
        `  "availability": "full_time",\n` +
        `  "stagePreferences": ["seed"],\n` +
        `  "institutionAffiliations": [],\n` +
        `  "missionInterests": []\n` +
        `}\n\n` +
        `Description: "${description}"`,
    });

    // Parse JSON from the text response
    const cleaned = text.trim().replace(/^```json\s*/, "").replace(/```\s*$/, "");
    const parsed = JSON.parse(cleaned);

    // Validate against schema
    const validated = NormalizedIntakeSchema.parse(parsed);

    return { fallback: false, data: validated };
  } catch (error) {
    console.error("AI normalization failed, using fallback:", error);
    return { fallback: true, data: null };
  }
}
