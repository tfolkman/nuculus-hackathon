"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Entity, Match } from "@/lib/types";
import { seedEntities } from "@/lib/data/seed-entities";
import { buildExplanation } from "@/lib/matching/explain";
import { ArrowLeft, CheckCircle, AlertTriangle, ChevronDown, ChevronUp, Info, Users } from "lucide-react";

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
    const targets = entities.filter((e) =>
      e.id !== source.id && (targetTypes[source.type] || []).includes(e.type)
    );
    const scored = targets
      .map((t) => buildExplanation(source, t))
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
    return scored;
  }, [source, entities]);

  if (!loaded) {
    return (
      <div className="flex h-64 items-center justify-center text-[#64748b]">
        Loading matches...
      </div>
    );
  }

  if (!source) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-[#0f172a]">No intake found</h1>
        <p className="mt-2 text-[#64748b]">Please complete the intake first.</p>
        <Link href="/intake" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1e3a5f] px-5 py-2.5 text-sm font-semibold text-white">
          Go to Intake
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <Link href="/intake" className="inline-flex items-center gap-1 text-sm text-[#64748b] hover:text-[#1e3a5f]">
          <ArrowLeft className="h-4 w-4" /> Back to intake
        </Link>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#0f172a]">Top Matches for {source.name}</h1>
        <p className="mt-2 text-[#64748b]">Ranked by hybrid AI score with transparent explanations.</p>
      </div>

      <div className="grid gap-6">
        {matches.map((m, i) => {
          const target = entities.find((e) => e.id === m.targetEntityId)!;
          const isOpen = openMatch === m.targetEntityId;
          const confidenceColor =
            m.confidence === "high"
              ? "bg-[#10b981]/10 text-[#10b981]"
              : m.confidence === "medium"
              ? "bg-[#f59e0b]/10 text-[#f59e0b]"
              : "bg-[#ef4444]/10 text-[#ef4444]";

          return (
            <div key={m.targetEntityId} className="rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
              <button
                onClick={() => setOpenMatch(isOpen ? null : m.targetEntityId)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1f5f9] font-bold text-[#1e3a5f]">
                    {i + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-semibold text-[#0f172a]">{target.name}</span>
                      <span className="rounded-full bg-[#f1f5f9] px-2 py-0.5 text-xs font-medium text-[#64748b]">
                        {target.type}
                      </span>
                    </div>
                    <div className="mt-0.5 text-sm text-[#64748b]">{target.headline}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#1e3a5f]">{m.score}</div>
                    <div className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${confidenceColor}`}>
                      {m.confidence} confidence
                    </div>
                  </div>
                  {isOpen ? <ChevronUp className="h-5 w-5 text-[#64748b]" /> : <ChevronDown className="h-5 w-5 text-[#64748b]" />}
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-[#e2e8f0] px-6 py-5">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-[#0f172a]">
                          <CheckCircle className="h-4 w-4 text-[#10b981]" /> Why this match
                        </div>
                        <ul className="mt-2 space-y-2">
                          {m.reasons.map((r) => (
                            <li key={r.label} className="text-sm text-[#64748b]">
                              <span className="font-medium text-[#0f172a]">{r.label}:</span> {r.detail}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-[#0f172a]">
                          <Info className="h-4 w-4 text-[#06b6d4]" /> Evidence
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {m.evidence.map((e) => (
                            <span key={e.field} className="rounded-full bg-[#06b6d4]/10 px-2.5 py-1 text-xs font-medium text-[#06b6d4]">
                              {e.field}: {e.value}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {m.gaps.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 text-sm font-semibold text-[#0f172a]">
                            <AlertTriangle className="h-4 w-4 text-[#f59e0b]" /> Gaps & Risks
                          </div>
                          <ul className="mt-2 space-y-2">
                            {m.gaps.map((g) => (
                              <li key={g.label} className="text-sm text-[#64748b]">
                                <span className="font-medium text-[#0f172a]">{g.label}:</span> {g.detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="rounded-xl bg-[#f8f9fb] p-4">
                        <div className="text-xs font-semibold uppercase tracking-wide text-[#94a3b8]">Suggested next action</div>
                        <div className="mt-1 text-sm font-medium text-[#0f172a]">{m.nextBestAction}</div>
                      </div>

                      <Link
                        href={`/staff/matches/${m.sourceEntityId}--${m.targetEntityId}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#1e3a5f] px-4 py-2.5 text-sm font-semibold text-[#1e3a5f] transition hover:bg-[#1e3a5f] hover:text-white"
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
