import { z } from "zod";

export const ExplanationSchema = z.object({
  summary: z.string().describe("1-2 sentence human-readable match summary"),
  topReasons: z.array(
    z.object({
      label: z.string(),
      detail: z.string(),
    })
  ).describe("Why this match works"),
  gaps: z.array(
    z.object({
      label: z.string(),
      detail: z.string(),
    })
  ).describe("Risks or missing info"),
  suggestedIntro: z.string(),
  nextBestAction: z.string(),
});

export type ExplanationOutput = z.infer<typeof ExplanationSchema>;

// Helper: ensure a field is an array (handles null, undefined, or single value)
const coerceArray = (val: unknown) => {
  if (Array.isArray(val)) return val;
  if (val === null || val === undefined) return [];
  return [val];
};

// Helper: ensure a field is a string (handles null, undefined, number, etc.)
const coerceString = (val: unknown) => {
  if (typeof val === "string") return val;
  if (val === null || val === undefined) return "";
  return String(val);
};

export const NormalizedIntakeSchema = z.object({
  headline: z.preprocess(coerceString, z.string()).default("").describe("A short professional headline"),
  sectors: z.preprocess(coerceArray, z.array(z.string())).default([]).describe("Relevant sectors from the description"),
  skills: z.preprocess(coerceArray, z.array(z.string())).default([]).describe("Extracted skills"),
  needs: z.preprocess(coerceArray, z.array(
    z.object({
      category: z.preprocess(coerceString, z.string()).default(""),
      description: z.preprocess(coerceString, z.string()).default(""),
    })
  )).default([]).describe("Needs expressed in the description"),
  offers: z.preprocess(coerceArray, z.array(
    z.object({
      category: z.preprocess(coerceString, z.string()).default(""),
      description: z.preprocess(coerceString, z.string()).default(""),
    })
  )).default([]).describe("What the person offers"),
  availability: z.preprocess(coerceString, z.string()).default("").describe("Availability type"),
  stagePreferences: z.preprocess(coerceArray, z.array(z.string())).default([]).describe("Company stage preferences"),
  institutionAffiliations: z.preprocess(coerceArray, z.array(z.string())).default([]).describe("University or institution affiliations"),
  missionInterests: z.preprocess(coerceArray, z.array(z.string())).default([]).describe("Mission or interest areas"),
});

export type NormalizedIntakeOutput = z.infer<typeof NormalizedIntakeSchema>;
