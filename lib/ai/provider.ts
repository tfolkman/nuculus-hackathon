import { createOpenAI } from "@ai-sdk/openai";

function getModel() {
  if (process.env.AI_ENABLED !== "true") return null;

  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const baseURL = process.env.AI_BASE_URL;

  const provider = createOpenAI({
    apiKey,
    baseURL: baseURL || undefined,
  });

  return provider(process.env.AI_MODEL || "gpt-4o-mini");
}

export const aiModel = getModel();
