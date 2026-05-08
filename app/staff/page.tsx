"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Entity, Match } from "@/lib/types";
import { seedEntities } from "@/lib/data/seed-entities";
import { buildExplanation } from "@/lib/matching/explain";
import { Eye, ArrowRight, CheckCircle2, Clock, AlertCircle } from "lucide-react";

type QueueItem = {
  intake: Entity;
  topMatch: ReturnType<typeof buildExplanation> | null;
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

    const intakes = all.filter((e) => e.id.startsWith("intake-") || e.type === "talent");
    const items = intakes.map((intake) => {
      const candidates = all.filter((e) => e.id !== intake.id);
      const scored = candidates
        .map((c) => buildExplanation(intake, c))
        .sort((a, b) => b.score - a.score);
      return { intake, topMatch: scored[0] || null };
    });

    setQueue(items);
  }, []);

  function statusBadge(topMatch: QueueItem["topMatch"]) {
    if (!topMatch) return { label: "New", color: "bg-[#5a5a5c]/10 text-[#5a5a5c]" };
    if (topMatch.score >= 75) return { label: "AI Matched", color: "bg-[#0d9f6e]/10 text-[#0d9f6e]" };
    if (topMatch.score >= 50) return { label: "Needs Review", color: "bg-[#d49400]/10 text-[#d49400]" };
    return { label: "Low Confidence", color: "bg-[#dc2626]/10 text-[#dc2626]" };
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#1c1c1d]">Staff Queue</h1>
        <p className="mt-2 text-[#5a5a5c]">Review AI recommendations and approve introductions.</p>
      </div>

      <div className="grid gap-4">
        {queue.map((item) => {
          const s = statusBadge(item.topMatch);
          const detailId = `${item.intake.id}--${item.topMatch?.targetEntityId || "none"}`;
          return (
            <div key={item.intake.id} className="flex flex-col gap-4 rounded-2xl border border-[#dce6f0] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-[#0048bd]/5">
                  {s.label === "AI Matched" ? <CheckCircle2 className="h-5 w-5 text-[#0d9f6e]" /> : s.label === "Needs Review" ? <Clock className="h-5 w-5 text-[#d49400]" /> : <AlertCircle className="h-5 w-5 text-[#5a5a5c]" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#1c1c1d]">{item.intake.name}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.color}`}>{s.label}</span>
                  </div>
                  <div className="mt-1 text-sm text-[#5a5a5c]">{item.intake.headline || item.intake.summary.slice(0, 100)}</div>
                  {item.topMatch && (
                    <div className="mt-2 text-sm text-[#5a5a5c]">
                      Top match:{" "}
                      <span className="font-medium text-[#1c1c1d]">
                        {seedEntities.find((e) => e.id === item.topMatch!.targetEntityId)?.name}
                      </span>
                      {" "}• Score: {" "}
                      <span className="font-bold text-[#0048bd]">{item.topMatch.score}</span>
                    </div>
                  )}
                </div>
              </div>

              <Link
                href={`/staff/matches/${detailId}`}
                className="inline-flex items-center gap-2 rounded-xl border border-[#dce6f0] bg-white px-4 py-2 text-sm font-semibold text-[#1c1c1d] transition hover:bg-[#f4fafe]"
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
