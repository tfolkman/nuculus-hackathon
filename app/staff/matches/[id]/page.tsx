"use client";

export const dynamic = "force-dynamic";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Entity, Match } from "@/lib/types";
import { seedEntities } from "@/lib/data/seed-entities";
import { buildExplanation } from "@/lib/matching/explain";
import { ArrowLeft, CheckCircle, XCircle, PauseCircle, Send, Database } from "lucide-react";

export default function MatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = decodeURIComponent((params.id as string) || "");
  const [sourceId, targetId] = rawId.split("--");

  const [entities, setEntities] = useState<Entity[]>(seedEntities);
  const [matchStatus, setMatchStatus] = useState<Match["status"]>("suggested");
  const [syncStatus, setSyncStatus] = useState<string>("not_synced");

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
  }, []);

  const source = entities.find((e) => e.id === sourceId);
  const target = entities.find((e) => e.id === targetId);

  const match = useMemo(() => {
    if (!source || !target) return null;
    return buildExplanation(source, target) as Match & { breakdown: NonNullable<ReturnType<typeof buildExplanation>> };
  }, [source, target]);

  if (!source || !target || !match) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="text-[#64748b]">Match not found.</p>
        <Link href="/staff" className="mt-4 inline-block rounded-xl bg-[#1e3a5f] px-5 py-2.5 text-sm font-semibold text-white">
          Back to Queue
        </Link>
      </div>
    );
  }

  const handleApprove = () => {
    setMatchStatus("approved");
    setSyncStatus("mock_synced");
  };
  const handleReject = () => {
    setMatchStatus("rejected");
    setSyncStatus("not_synced");
  };
  const handleHold = () => {
    setMatchStatus("held");
    setSyncStatus("not_synced");
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Link href="/staff" className="inline-flex items-center gap-1 text-sm text-[#64748b] hover:text-[#1e3a5f]">
        <ArrowLeft className="h-4 w-4" /> Back to queue
      </Link>

      <div className="mt-6 flex flex-col gap-6 md:flex-row">
        {/* Source card */}
        <div className="flex-1 rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-[#94a3b8]">Source intake</div>
          <div className="mt-2 text-xl font-bold text-[#0f172a]">{source.name}</div>
          <div className="mt-1 text-sm text-[#64748b]">{source.headline}</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {source.sectors.map((s) => (
              <span key={s} className="rounded-full bg-[#f1f5f9] px-2.5 py-1 text-xs font-medium text-[#64748b]">
                {s}
              </span>
            ))}
          </div>
          <div className="mt-3 text-sm text-[#64748b]">{source.summary}</div>
        </div>

        {/* Target card */}
        <div className="flex-1 rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-[#94a3b8]">Recommended match</div>
          <div className="mt-2 text-xl font-bold text-[#0f172a]">{target.name}</div>
          <div className="mt-1 text-sm text-[#64748b]">{target.headline}</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {target.sectors.map((s) => (
              <span key={s} className="rounded-full bg-[#f1f5f9] px-2.5 py-1 text-xs font-medium text-[#64748b]">
                {s}
              </span>
            ))}
          </div>
          <div className="mt-3 text-sm text-[#64748b]">{target.summary}</div>
        </div>
      </div>

      {/* Score */}
      <div className="mt-6 rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-[#0f172a]">Match Score</div>
            <div className="mt-1 text-4xl font-bold text-[#1e3a5f]">{match.score}</div>
            <div className="mt-1 text-sm text-[#64748b]">Confidence: <span className="font-medium text-[#0f172a]">{match.confidence}</span></div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-[#0f172a]">Status</div>
            <div className="mt-1 inline-block rounded-full bg-[#f1f5f9] px-3 py-1 text-sm font-medium text-[#0f172a] capitalize">
              {matchStatus}
            </div>
          </div>
        </div>
      </div>

      {/* Reasons + Evidence */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-[#0f172a]">Why this match</div>
          <ul className="mt-4 space-y-3">
            {match.reasons.map((r) => (
              <li key={r.label} className="flex items-start gap-2 text-sm text-[#64748b]">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#10b981]" />
                <span><span className="font-medium text-[#0f172a]">{r.label}:</span> {r.detail}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-[#0f172a]">Evidence</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {match.evidence.map((e) => (
              <span key={`${e.field}-${e.value}`} className="rounded-full bg-[#06b6d4]/10 px-2.5 py-1 text-xs font-medium text-[#06b6d4]">
                {e.field}: {e.value}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Intro + Actions */}
      <div className="mt-6 rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
        <div className="text-sm font-semibold text-[#0f172a]">Suggested Intro Email</div>
        <textarea
          className="mt-3 block w-full rounded-xl border border-[#e2e8f0] bg-[#f8f9fb] px-4 py-3 text-sm text-[#0f172a] outline-none focus:ring-2 ring-[#06b6d4]"
          rows={8}
          defaultValue={match.suggestedIntro}
        />

        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={handleApprove} className="inline-flex items-center gap-2 rounded-xl bg-[#10b981] px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-[#059669]">
            <CheckCircle className="h-4 w-4" /> Approve
          </button>
          <button onClick={handleHold} className="inline-flex items-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-5 py-2.5 text-sm font-semibold text-[#0f172a] hover:bg-[#f8f9fb]">
            <PauseCircle className="h-4 w-4" /> Hold
          </button>
          <button onClick={handleReject} className="inline-flex items-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-5 py-2.5 text-sm font-semibold text-[#ef4444] hover:bg-[#fef2f2]">
            <XCircle className="h-4 w-4" /> Reject
          </button>
        </div>
      </div>

      {/* Affinity sync */}
      <div className="mt-6 rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#0f172a]">
          <Database className="h-4 w-4 text-[#64748b]" /> Affinity CRM Sync
        </div>
        <div className="mt-3 rounded-xl bg-[#0f172a] p-4 font-mono text-xs text-[#e2e8f0] overflow-x-auto">
          <pre>{JSON.stringify({
            person: source.name,
            org: target.type === "startup" ? target.name : undefined,
            list: `Nucleus Connect - ${target.type === "startup" ? "Startups" : "Talent"}`,
            fields: {
              "Nucleus Profile Type": target.type,
              "Nucleus Sector Focus": target.sectors.join(", "),
              "Nucleus Match Score": match.score,
              "Nucleus Match Status": matchStatus,
              "Nucleus Source": "Nucleus Connect",
            },
            note: match.suggestedIntro,
          }, null, 2)}</pre>
        </div>
        <div className="mt-3 text-sm text-[#64748b]">Sync status: <span className="font-medium text-[#0f172a] capitalize">{syncStatus.replace("_", " ")}</span></div>
      </div>
    </div>
  );
}
