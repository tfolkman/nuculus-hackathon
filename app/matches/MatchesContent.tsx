"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Entity, Match, ScoreBreakdown } from "@/lib/types";
import { seedEntities } from "@/lib/data/seed-entities";
import { buildExplanation } from "@/lib/matching/explain";
import {
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Info,
  Users,
  Sparkles,
  TrendingUp,
  Award,
  Zap,
  Lightbulb,
} from "lucide-react";
import { formatLabel } from "@/lib/format";

function ScoreBar({ label, value, max, color = "bg-[#0048bd]" }: { label: string; value: number; max: number; color?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-28 text-xs font-medium text-[#5a5a5c]">{label}</div>
      <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
      </div>
      <div className="w-6 text-xs font-bold text-right text-[#1c1c1d]">{value}</div>
    </div>
  );
}

function ConfidenceBadge({ confidence }: { confidence: Match["confidence"] }) {
  if (confidence === "high") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
        <Award className="h-3 w-3" /> High confidence
      </span>
    );
  }
  if (confidence === "medium") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200">
        <TrendingUp className="h-3 w-3" /> Medium confidence
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 border border-red-200">
      <AlertTriangle className="h-3 w-3" /> Low confidence
    </span>
  );
}

function GapRecommendation({ match }: { match: ReturnType<typeof buildExplanation> }) {
  if (match.confidence === "high") return null;
  if (match.score < 40) return null;

  return (
    <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
      <div className="flex items-center gap-2 text-sm font-bold text-amber-800">
        <Lightbulb className="h-4 w-4" />
        You&apos;re {Math.round((match.score / 100) * 100)}% fit — here&apos;s how to close the gap
      </div>
      <ul className="mt-2 text-sm text-amber-700 space-y-1">
        {match.gaps.slice(0, 2).map((g) => (
          <li key={g.label}>• {g.detail}</li>
        ))}
        {match.gaps.length === 0 && (
          <li>• Review the match details and confirm mutual interest before introduction.</li>
        )}
      </ul>
    </div>
  );
}

export default function MatchesPage() {
  const searchParams = useSearchParams();
  const sourceId = searchParams.get("source");

  const [loaded, setLoaded] = useState(false);
  const [entities, setEntities] = useState<Entity[]>(seedEntities);
  const [openMatch, setOpenMatch] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("nucleus_entities");
      if (stored) {
        const parsed = JSON.parse(stored) as Entity[];
        setEntities(seedEntities.concat(parsed.filter((p) => !seedEntities.find((s) => s.id === p.id))));
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  const source = entities.find((e) => e.id === sourceId);

  const matches = useMemo(() => {
    if (!source) return [];
    const targetTypes: Record<Entity["type"], Entity["type"][]> = {
      talent: ["startup", "program", "mentor", "investor"],
      startup: ["talent", "investor", "mentor", "service_provider", "program"],
      mentor: ["startup", "talent"],
      subject_matter_expert: ["startup", "talent", "program"],
      investor: ["startup", "program", "talent"],
      service_provider: ["startup", "talent"],
      program: ["startup", "talent", "mentor", "investor"],
      research_project: ["talent", "investor", "mentor"],
    };
    const targets = entities.filter(
      (e) => e.id !== source.id && (targetTypes[source.type] || []).includes(e.type)
    );
    const scored = targets
      .map((t) => buildExplanation(source, t))
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
    return scored;
  }, [source, entities]);

  if (!loaded) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/3 rounded bg-gray-200" />
          <div className="h-4 w-1/2 rounded bg-gray-200" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  if (!source) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-[#1c1c1d]">No intake found</h1>
        <p className="mt-2 text-[#5a5a5c]">Please complete the intake first.</p>
        <Link
          href="/intake"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0048bd] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0066e0]"
        >
          Go to Intake
        </Link>
      </div>
    );
  }

  const topMatch = matches[0];

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <Link
          href="/intake"
          className="inline-flex items-center gap-1 text-sm text-[#5a5a5c] hover:text-[#0048bd] transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to intake
        </Link>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#1c1c1d] md:text-4xl">
          Top Matches for {source.name}
        </h1>
        <p className="mt-2 text-[#5a5a5c]">
          Ranked by hybrid AI score with transparent explanations.
        </p>
      </div>

      {/* Best Match Hero */}
      {topMatch && topMatch.confidence !== "low" && (
        <div className="mb-8 rounded-2xl bg-gradient-to-br from-[#0048bd] to-[#0066e0] p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-white/70">
            <Sparkles className="h-4 w-4" /> Best Match
          </div>
          <div className="mt-3 text-2xl font-bold md:text-3xl">
            {entities.find((e) => e.id === topMatch.targetEntityId)?.name}
          </div>
          <div className="mt-1 text-white/80">
            {entities.find((e) => e.id === topMatch.targetEntityId)?.headline}
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="rounded-xl bg-white/15 px-5 py-3 backdrop-blur">
              <div className="text-3xl font-bold">{topMatch.score}</div>
              <div className="text-xs text-white/70 mt-0.5">Match Score</div>
            </div>
            <div className="rounded-xl bg-white/15 px-5 py-3 backdrop-blur">
              <div className="text-lg font-bold capitalize">{topMatch.confidence}</div>
              <div className="text-xs text-white/70 mt-0.5">Confidence</div>
            </div>
            <div className="rounded-xl bg-white/15 px-5 py-3 backdrop-blur">
              <div className="text-lg font-bold">{topMatch.reasons.length}</div>
              <div className="text-xs text-white/70 mt-0.5">Alignment Signals</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {matches.map((m, i) => {
          const target = entities.find((e) => e.id === m.targetEntityId)!;
          const isOpen = openMatch === m.targetEntityId;

          const scoreColor =
            m.confidence === "high"
              ? "text-emerald-600"
              : m.confidence === "medium"
              ? "text-amber-600"
              : "text-red-600";

          return (
            <div
              key={m.targetEntityId}
              className="rounded-2xl border border-[#dce6f0] bg-white shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
            >
              <button
                onClick={() => setOpenMatch(isOpen ? null : m.targetEntityId)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef6fc] font-bold text-[#0048bd]">
                    {i + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-semibold text-[#1c1c1d]">
                        {target.name}
                      </span>
                      <span className="rounded-full bg-[#eef6fc] px-2 py-0.5 text-xs font-medium text-[#5a5a5c]">
                        {formatLabel(target.type)}
                      </span>
                    </div>
                    <div className="mt-0.5 text-sm text-[#5a5a5c]">
                      {target.headline}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${scoreColor}`}>{m.score}</div>
                    <div className="mt-1">
                      <ConfidenceBadge confidence={m.confidence} />
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-[#5a5a5c]" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-[#5a5a5c]" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-[#dce6f0] px-6 py-5">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-5">
                      <div>
                        <div className="flex items-center gap-2 text-sm font-bold text-[#1c1c1d]">
                          <CheckCircle className="h-4 w-4 text-emerald-600" /> Why this match
                        </div>
                        <ul className="mt-3 space-y-2">
                          {m.reasons.map((r) => (
                            <li key={r.label} className="text-sm text-[#5a5a5c] leading-relaxed">
                              <span className="font-semibold text-[#1c1c1d]">{r.label}:</span>{" "}
                              {r.detail}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-sm font-bold text-[#1c1c1d]">
                          <Info className="h-4 w-4 text-[#00a3e0]" /> Evidence
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {m.evidence.map((e) => (
                            <span
                              key={e.field}
                              className="rounded-full bg-[#00a3e0]/10 px-2.5 py-1 text-xs font-medium text-[#00a3e0]"
                            >
                              {formatLabel(e.field)}: {e.value}
                            </span>
                          ))}
                        </div>
                      </div>

                      <GapRecommendation match={m} />
                    </div>

                    <div className="space-y-5">
                      {/* Score Breakdown */}
                      <div className="rounded-xl bg-[#f4fafe] p-4">
                        <div className="text-xs font-bold uppercase tracking-wide text-[#8a8a8c] mb-3">
                          Score Breakdown
                        </div>
                        <div className="space-y-2">
                          <ScoreBar label="Sector Fit" value={m.breakdown.sectorFit} max={25} />
                          <ScoreBar label="Role/Need Fit" value={m.breakdown.roleNeedFit} max={25} />
                          <ScoreBar label="Stage Fit" value={m.breakdown.stageFit} max={15} />
                          <ScoreBar label="Skill Overlap" value={m.breakdown.skillExpertiseFit} max={15} />
                          <ScoreBar label="Availability" value={m.breakdown.availabilityFit} max={10} />
                          <ScoreBar label="Utah Context" value={m.breakdown.utahContextFit} max={10} />
                        </div>
                      </div>

                      {m.gaps.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 text-sm font-bold text-[#1c1c1d]">
                            <AlertTriangle className="h-4 w-4 text-amber-600" /> Gaps & Risks
                          </div>
                          <ul className="mt-3 space-y-2">
                            {m.gaps.map((g) => (
                              <li key={g.label} className="text-sm text-[#5a5a5c] leading-relaxed">
                                <span className="font-semibold text-[#1c1c1d]">{g.label}:</span>{" "}
                                {g.detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="rounded-xl bg-[#f4fafe] p-4">
                        <div className="text-xs font-bold uppercase tracking-wide text-[#8a8a8c]">
                          Suggested next action
                        </div>
                        <div className="mt-1 text-sm font-medium text-[#1c1c1d]">
                          {m.nextBestAction}
                        </div>
                      </div>

                      <Link
                        href={`/staff/matches/${m.sourceEntityId}--${m.targetEntityId}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#0048bd] px-4 py-2.5 text-sm font-semibold text-[#0048bd] transition hover:bg-[#0048bd] hover:text-white hover:scale-[1.02]"
                      >
                        <Users className="h-4 w-4" />
                        Review in staff queue
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
