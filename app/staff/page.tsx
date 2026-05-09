"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Entity, Match } from "@/lib/types";
import { seedEntities } from "@/lib/data/seed-entities";
import { buildExplanation } from "@/lib/matching/explain";
import { Eye, ArrowRight, CheckCircle2, Clock, AlertCircle, TrendingUp, Users, Building2, Network, Ban, CheckCircle } from "lucide-react";
import { getAllMatchStatuses } from "@/lib/match-status";

type QueueItem = {
  intake: Entity;
  topMatch: ReturnType<typeof buildExplanation> | null;
  persistedStatus?: import("@/lib/match-status").PersistedMatchStatus;
};

export default function StaffPage() {
  const [queue, setQueue] = useState<QueueItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("nucleus_entities");
    let all = seedEntities;
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Entity[];
        all = seedEntities.concat(parsed.filter((p) => !seedEntities.find((s) => s.id === p.id) && p.id.startsWith("intake-")));
      } catch {
        // ignore
      }
    }

    const persisted = getAllMatchStatuses();
    const intakes = all.filter((e) => e.id.startsWith("intake-"));
    const items = intakes.map((intake) => {
      const candidates = all.filter((e) => e.id !== intake.id);
      const scored = candidates
        .map((c) => buildExplanation(intake, c))
        .sort((a, b) => b.score - a.score);
      const topMatch = scored[0] || null;
      const key = topMatch ? `${topMatch.sourceEntityId}--${topMatch.targetEntityId}` : "";
      return { intake, topMatch, persistedStatus: persisted[key] };
    });

    setQueue(items);
  }, []);

  const highConfidence = queue.filter((q) => q.topMatch && q.topMatch.score >= 65).length;
  const needsReview = queue.filter((q) => q.topMatch && q.topMatch.score >= 40 && q.topMatch.score < 65).length;
  const lowConfidence = queue.filter((q) => !q.topMatch || q.topMatch.score < 40).length;

  function statusBadge(item: QueueItem) {
    // If a human has already reviewed this match, show that status
    if (item.persistedStatus) {
      const s = item.persistedStatus.status;
      if (s === "approved") return { label: "Approved", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle };
      if (s === "rejected") return { label: "Rejected", color: "bg-red-50 text-red-700 border-red-200", icon: Ban };
      if (s === "held") return { label: "On Hold", color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock };
    }

    const topMatch = item.topMatch;
    if (!topMatch) return { label: "New", color: "bg-gray-100 text-gray-600 border-gray-200", icon: AlertCircle };
    if (topMatch.score >= 65) return { label: "AI Matched", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 };
    if (topMatch.score >= 40) return { label: "Needs Review", color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock };
    return { label: "Low Confidence", color: "bg-red-50 text-red-700 border-red-200", icon: AlertCircle };
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#1c1c1d] md:text-4xl">Staff Queue</h1>
        <p className="mt-2 text-[#5a5a5c] text-lg">Review AI recommendations and approve introductions.</p>
      </div>

      {/* Summary Banner */}
      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl bg-white border border-[#dce6f0] p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8a8a8c]">
            <Users className="h-4 w-4" /> Total Intakes
          </div>
          <div className="mt-2 text-3xl font-bold text-[#1c1c1d]">{queue.length}</div>
        </div>
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <CheckCircle2 className="h-4 w-4" /> High Confidence
          </div>
          <div className="mt-2 text-3xl font-bold text-emerald-700">{highConfidence}</div>
          <div className="mt-1 text-xs text-emerald-600">Ready for approval</div>
        </div>
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600">
            <Clock className="h-4 w-4" /> Needs Review
          </div>
          <div className="mt-2 text-3xl font-bold text-amber-700">{needsReview}</div>
          <div className="mt-1 text-xs text-amber-600">Check before introducing</div>
        </div>
        <div className="rounded-xl bg-red-50 border border-red-200 p-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600">
            <AlertCircle className="h-4 w-4" /> Low Confidence
          </div>
          <div className="mt-2 text-3xl font-bold text-red-700">{lowConfidence}</div>
          <div className="mt-1 text-xs text-red-600">Request more info</div>
        </div>
      </div>

      <div className="grid gap-4">
        {queue.map((item) => {
          const s = statusBadge(item);
          const detailId = `${item.intake.id}--${item.topMatch?.targetEntityId || "none"}`;
          const targetName = item.topMatch
            ? seedEntities.find((e) => e.id === item.topMatch!.targetEntityId)?.name
            : null;
          return (
            <div
              key={item.intake.id}
              className={`flex flex-col gap-4 rounded-2xl border p-5 shadow-sm transition hover:shadow-md hover:-translate-y-0.5 sm:flex-row sm:items-center sm:justify-between ${item.persistedStatus ? "bg-[#f8fafc] border-[#dce6f0]" : "bg-white border-[#dce6f0]"}`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-full ${item.persistedStatus ? "bg-emerald-50" : "bg-[#0048bd]/5"}`}>
                  <s.icon className={`h-5 w-5 ${s.color.includes("emerald") ? "text-emerald-600" : s.color.includes("amber") ? "text-amber-600" : s.color.includes("red") ? "text-red-600" : "text-[#5a5a5c]"}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-[#1c1c1d]">{item.intake.name}</span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold border ${s.color}`}>
                      {s.label}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-[#5a5a5c]">
                    {item.intake.headline || item.intake.summary.slice(0, 100)}
                  </div>
                  {item.topMatch && (
                    <div className="mt-2 text-sm text-[#5a5a5c]">
                      Top match:{" "}
                      <span className="font-medium text-[#1c1c1d]">{targetName}</span>
                      {" "}• Score:{" "}
                      <span className={`font-bold ${item.topMatch.score >= 65 ? "text-emerald-600" : item.topMatch.score >= 40 ? "text-amber-600" : "text-red-600"}`}>
                        {item.topMatch.score}
                      </span>
                      {" "}•{" "}
                      <span className="capitalize font-medium">{item.topMatch.confidence}</span>
                    </div>
                  )}
                </div>
              </div>

              <Link
                href={`/staff/matches/${detailId}`}
                className="inline-flex items-center gap-2 rounded-xl border border-[#dce6f0] bg-white px-4 py-2 text-sm font-semibold text-[#1c1c1d] transition hover:bg-[#f4fafe] hover:scale-[1.02]"
              >
                <Eye className="h-4 w-4" />
                Review
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
