"use client";

import { useState, useEffect, useMemo } from "react";
import { generateMatchExplanation } from "@/lib/ai/match-actions";
import { Entity } from "@/lib/types";
import { buildExplanation } from "@/lib/matching/explain";
import { scoreMatch, totalScore, confidenceFromScore } from "@/lib/matching/score";
import { SkeletonCard, SkeletonSection } from "@/components/ui/SkeletonCard";
import { CheckCircle, AlertTriangle, Send, TrendingUp, Sparkles, Zap } from "lucide-react";

function buildClientFallback(source: Entity, target: Entity) {
  const breakdown = scoreMatch(source, target);
  const score = totalScore(breakdown);
  const confidence = confidenceFromScore(score);
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
    isAi: false,
  };
}

export function MatchExplanation({ source, target }: { source: Entity; target: Entity }) {
  // Show deterministic fallback immediately
  const fallback = useMemo(() => buildClientFallback(source, target), [source, target]);
  const [object, setObject] = useState<any>(fallback);
  const [isLoading, setIsLoading] = useState(true);
  const [isAi, setIsAi] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchExplanation() {
      try {
        const data = await generateMatchExplanation(
          JSON.stringify(source),
          JSON.stringify(target)
        );
        if (!cancelled) {
          setObject({ ...data, isAi: true });
          setIsAi(true);
          setIsLoading(false);
        }
      } catch (e) {
        console.error("Failed to generate explanation:", e);
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchExplanation();
    return () => { cancelled = true; };
  }, [source, target]);

  return (
    <div className="space-y-6">
      {/* AI Status Badge */}
      {isLoading && (
        <div className="rounded-xl bg-[#0048bd]/5 p-4 flex items-center gap-3">
          <Sparkles className="h-4 w-4 text-[#0048bd] animate-pulse" />
          <div>
            <div className="text-sm font-medium text-[#1c1c1d]">AI enhancement in progress...</div>
            <div className="text-xs text-[#5a5a5c]">Showing deterministic analysis while AI generates (may take 15-30s with free model)</div>
          </div>
        </div>
      )}
      {!isLoading && isAi && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3">
          <div className="text-xs font-medium text-emerald-700 flex items-center gap-2">
            <Sparkles className="h-3 w-3" />
            AI-enhanced explanation
          </div>
        </div>
      )}
      {!isLoading && !isAi && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
          <div className="text-xs font-medium text-amber-700 flex items-center gap-2">
            <Zap className="h-3 w-3" />
            Deterministic analysis (AI model too slow or unavailable)
          </div>
        </div>
      )}

      {/* Summary */}
      <section className="rounded-2xl border border-[#dce6f0] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold text-[#1c1c1d] mb-3">
          <TrendingUp className="h-4 w-4 text-[#0048bd]" />
          Match Summary
        </div>
        {object?.summary ? (
          <p className="text-sm text-[#5a5a5c] leading-relaxed animate-fade-in">
            {object.summary}
          </p>
        ) : (
          <SkeletonCard lines={2} />
        )}
      </section>

      {/* Top reasons */}
      <section className="rounded-2xl border border-[#dce6f0] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold text-[#1c1c1d] mb-4">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          Why This Match Works
        </div>
        {object?.topReasons ? (
          <ul className="space-y-3">
            {object.topReasons.map((r: any, i: number) => (
              <li
                key={i}
                className="text-sm text-[#5a5a5c] leading-relaxed animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <span className="font-semibold text-[#1c1c1d]">{r?.label}:</span>{" "}
                {r?.detail}
              </li>
            ))}
          </ul>
        ) : (
          <SkeletonCard lines={3} />
        )}
      </section>

      {/* Gaps */}
      <section className="rounded-2xl border border-[#dce6f0] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold text-[#1c1c1d] mb-4">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          Gaps & Risks
        </div>
        {object?.gaps ? (
          object.gaps.length > 0 ? (
            <ul className="space-y-3">
              {object.gaps.map((g: any, i: number) => (
                <li
                  key={i}
                  className="text-sm text-[#5a5a5c] leading-relaxed animate-fade-in"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <span className="font-semibold text-[#1c1c1d]">{g?.label}:</span>{" "}
                  {g?.detail}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#5a5a5c]">
              No significant gaps identified. This looks like a strong match.
            </p>
          )
        ) : (
          <SkeletonCard lines={2} />
        )}
      </section>

      {/* Suggested intro */}
      <section className="rounded-2xl border border-[#dce6f0] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold text-[#1c1c1d] mb-3">
          <Send className="h-4 w-4 text-[#00a3e0]" />
          Suggested Introduction
        </div>
        {object?.suggestedIntro ? (
          <div className="rounded-xl bg-[#f4fafe] p-4">
            <p className="text-sm text-[#5a5a5c] leading-relaxed whitespace-pre-wrap animate-fade-in">
              {object.suggestedIntro}
            </p>
          </div>
        ) : (
          <SkeletonCard lines={4} />
        )}
      </section>

      {/* Next best action */}
      {object?.nextBestAction ? (
        <div className="rounded-xl bg-[#0048bd]/5 p-4 animate-fade-in">
          <div className="text-xs font-bold uppercase tracking-wide text-[#0048bd] mb-1">
            Next Best Action
          </div>
          <div className="text-sm font-medium text-[#1c1c1d]">{object.nextBestAction}</div>
        </div>
      ) : (
        <SkeletonSection lines={1} />
      )}
    </div>
  );
}
