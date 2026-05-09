import { Entity, ScoreBreakdown } from "@/lib/types";

// Semantic term mappings for AI-style scoring (works client + server)
const SEMANTIC_MAP: Record<string, string[]> = {
  ai: ["artificial intelligence", "machine learning", "ml", "deep learning", "computer vision", "nlp", "neural networks"],
  "machine learning": ["ai", "ml", "deep learning", "neural networks"],
  "computer vision": ["ai", "machine learning", "imaging", "cameras", "visual recognition"],
  manufacturing: ["advanced manufacturing", "factory", "production", "industrial", "fabrication"],
  advanced_manufacturing: ["manufacturing", "factory", "production", "industrial"],
  biotech: ["biotechnology", "life sciences", "pharma", "drug discovery", "genomics"],
  biotechnology: ["biotech", "life sciences", "pharma"],
  healthcare: ["health", "medical", "life sciences", "biotech", "clinical"],
  aerospace: ["defense", "space", "satellite", "aviation"],
  defense: ["aerospace", "military", "security", "dual-use"],
  energy: ["clean tech", "renewable", "solar", "battery", "power"],
  software: ["saas", "platform", "app", "web", "cloud"],
  hardware: ["iot", "device", "electronics", "robotics", "sensor"],
  robotics: ["automation", "hardware", "ai", "manufacturing"],
  finance: ["fintech", "financial", "banking", "payments"],
  sales: ["business development", "revenue", "gtm", "go-to-market"],
  marketing: ["growth", "brand", "demand generation", "gtm"],
  engineering: ["software", "hardware", "technical", "development"],
  operations: ["ops", "supply chain", "manufacturing", "logistics"],
  supply_chain: ["operations", "logistics", "manufacturing"],
  clinical: ["healthcare", "medical", "biotech", "fda"],
  regulatory: ["compliance", "fda", "clinical", "legal"],
  data: ["analytics", "ai", "machine learning", "bi"],
  cloud: ["aws", "azure", "infrastructure", "devops", "saas"],
  devops: ["cloud", "infrastructure", "sre", "platform"],
  product: ["pm", "product management", "strategy", "roadmap"],
  strategy: ["consulting", "product", "business", "planning"],
  legal: ["compliance", "regulatory", "ip", "patents", "contracts"],
};

function normalizeTerm(term: string): string {
  return term.toLowerCase().replace(/[^a-z0-9]/g, " ");
}

function hasSemanticOverlap(a: string[], b: string[]): { score: number; reason: string } {
  let bestScore = 0;
  let bestReason = "";

  for (const termA of a) {
    const normA = normalizeTerm(termA);
    for (const termB of b) {
      const normB = normalizeTerm(termB);

      // Direct match
      if (normA === normB || normA.includes(normB) || normB.includes(normA)) {
        return { score: 1.0, reason: `${termA} directly matches ${termB}` };
      }

      // Semantic map match
      const relatedA = SEMANTIC_MAP[normA] || [];
      const relatedB = SEMANTIC_MAP[normB] || [];

      if (relatedA.some((r) => normalizeTerm(r) === normB)) {
        bestScore = Math.max(bestScore, 0.8);
        bestReason = `${termA} semantically relates to ${termB}`;
      }
      if (relatedB.some((r) => normalizeTerm(r) === normA)) {
        bestScore = Math.max(bestScore, 0.8);
        bestReason = `${termB} semantically relates to ${termA}`;
      }

      // Cross-map check
      for (const ra of relatedA) {
        for (const rb of relatedB) {
          if (normalizeTerm(ra) === normalizeTerm(rb)) {
            bestScore = Math.max(bestScore, 0.6);
            if (!bestReason) bestReason = `${termA} and ${termB} share related domain`;
          }
        }
      }
    }
  }

  return { score: bestScore, reason: bestReason };
}

export function computeSemanticScore(source: Entity, target: Entity): {
  breakdown: ScoreBreakdown;
  totalScore: number;
  confidence: "low" | "medium" | "high";
  aiExplanation: string;
} {
  const allSourceTerms = [
    ...source.skills,
    ...source.sectors,
    ...source.needs.map((n) => n.description),
    source.headline,
    source.summary,
  ];

  const allTargetTerms = [
    ...target.skills,
    ...target.sectors,
    ...target.needs.map((n) => n.description),
    target.headline,
    target.summary,
  ];

  const semantic = hasSemanticOverlap(allSourceTerms, allTargetTerms);

  // Stage fit
  let stageFit = 0;
  if (source.stagePreferences.length && target.stagePreferences.length) {
    const overlap = source.stagePreferences.filter((s) => target.stagePreferences.includes(s));
    stageFit = overlap.length > 0 ? 12 : 4;
  } else {
    stageFit = 8;
  }

  // Availability
  let availabilityFit = 5;
  if (source.availability && target.needs.some((n) => n.description.toLowerCase().includes(source.availability?.toLowerCase() || ""))) {
    availabilityFit = 8;
  }

  // Utah context
  let utahContextFit = 0;
  const utahSignals = ["utah", "byu", "university of utah", "usu", "nucleus", "salt lake", "provo", "logan"];
  const sourceUtah = allSourceTerms.some((t) => utahSignals.some((u) => t.toLowerCase().includes(u)));
  const targetUtah = allTargetTerms.some((t) => utahSignals.some((u) => t.toLowerCase().includes(u)));
  if (sourceUtah && targetUtah) utahContextFit = 8;
  else if (sourceUtah || targetUtah) utahContextFit = 4;

  const baseScore = semantic.score;
  const sectorFit = Math.round(baseScore * 25);
  const roleNeedFit = Math.round(baseScore * 25);
  const skillExpertiseFit = Math.round(baseScore * 15);
  const missionFit = Math.round(baseScore * 5);
  const networkLeverage = Math.round(baseScore * 5);

  const totalScore = sectorFit + roleNeedFit + stageFit + skillExpertiseFit + availabilityFit + utahContextFit + missionFit + networkLeverage;
  const confidence = totalScore >= 65 ? "high" : totalScore >= 40 ? "medium" : "low";

  const reason = semantic.reason
    ? `Semantic engine: ${semantic.reason}.`
    : `Limited semantic overlap between ${source.name} and ${target.name}.`;

  return {
    breakdown: {
      sectorFit,
      roleNeedFit,
      stageFit,
      skillExpertiseFit,
      availabilityFit,
      utahContextFit,
      missionFit,
      networkLeverage,
    },
    totalScore,
    confidence,
    aiExplanation: `${reason} Uses semantic term relationships (e.g., "manufacturing" ↔ "advanced manufacturing") rather than exact keyword matching.`,
  };
}
