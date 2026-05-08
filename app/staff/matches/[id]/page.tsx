"use client";

export const dynamic = "force-dynamic";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Entity, Match } from "@/lib/types";
import { seedEntities } from "@/lib/data/seed-entities";
import { buildExplanation } from "@/lib/matching/explain";
import { ArrowLeft, CheckCircle, XCircle, PauseCircle, Send, Database, Loader2, Sparkles, Copy, Check } from "lucide-react";

export default function MatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = decodeURIComponent((params.id as string) || "");
  const [sourceId, targetId] = rawId.split("--");

  const [entities, setEntities] = useState<Entity[]>(seedEntities);
  const [matchStatus, setMatchStatus] = useState<Match["status"]>("suggested");
  const [syncStatus, setSyncStatus] = useState<string>("not_synced");
  const [showConfetti, setShowConfetti] = useState(false);
  const [copied, setCopied] = useState(false);

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
    return buildExplanation(source, target);
  }, [source, target]);

  if (!source || !target || !match) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="text-[#5a5a5c]">Match not found.</p>
        <Link href="/staff" className="mt-4 inline-block rounded-xl bg-[#0048bd] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0066e0]">
          Back to Queue
        </Link>
      </div>
    );
  }

  const handleApprove = () => {
    setMatchStatus("approved");
    setSyncStatus("mock_synced");
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };
  const handleReject = () => {
    setMatchStatus("rejected");
    setSyncStatus("not_synced");
  };
  const handleHold = () => {
    setMatchStatus("held");
    setSyncStatus("not_synced");
  };

  const confidenceColor =
    match.confidence === "high"
      ? "text-emerald-600"
      : match.confidence === "medium"
      ? "text-amber-600"
      : "text-red-600";

  const confidenceBg =
    match.confidence === "high"
      ? "bg-emerald-50 border-emerald-200"
      : match.confidence === "medium"
      ? "bg-amber-50 border-amber-200"
      : "bg-red-50 border-red-200";

  const syncPayload = {
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
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-6xl animate-bounce">
            🎉
          </div>
        </div>
      )}

      <Link href="/staff" className="inline-flex items-center gap-1 text-sm text-[#5a5a5c] hover:text-[#0048bd] transition">
        <ArrowLeft className="h-4 w-4" /> Back to queue
      </Link>

      <div className="mt-6 flex flex-col gap-6 md:flex-row">
        {/* Source card */}
        <div className="flex-1 rounded-2xl border border-[#dce6f0] bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="text-xs font-bold uppercase tracking-wide text-[#8a8a8c]">Source intake</div>
          <div className="mt-2 text-xl font-bold text-[#1c1c1d]">{source.name}</div>
          <div className="mt-1 text-sm text-[#5a5a5c]">{source.headline}</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {source.sectors.slice(0, 3).map((s) => (
              <span key={s} className="rounded-full bg-[#eef6fc] px-2.5 py-1 text-xs font-medium text-[#5a5a5c]">
                {s.replace("_", " ")}
              </span>
            ))}
          </div>
          <div className="mt-3 text-sm text-[#5a5a5c] leading-relaxed">{source.summary}</div>
        </div>

        {/* Target card */}
        <div className="flex-1 rounded-2xl border border-[#dce6f0] bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="text-xs font-bold uppercase tracking-wide text-[#8a8a8c]">Recommended match</div>
          <div className="mt-2 text-xl font-bold text-[#1c1c1d]">{target.name}</div>
          <div className="mt-1 text-sm text-[#5a5a5c]">{target.headline}</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {target.sectors.slice(0, 3).map((s) => (
              <span key={s} className="rounded-full bg-[#eef6fc] px-2.5 py-1 text-xs font-medium text-[#5a5a5c]">
                {s.replace("_", " ")}
              </span>
            ))}
          </div>
          <div className="mt-3 text-sm text-[#5a5a5c] leading-relaxed">{target.summary}</div>
        </div>
      </div>

      {/* Score */}
      <div className={`mt-6 rounded-2xl border p-6 shadow-sm ${confidenceBg}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-[#1c1c1d]">Match Score</div>
            <div className={`mt-1 text-4xl font-bold ${confidenceColor}`}>{match.score}</div>
            <div className="mt-1 text-sm text-[#5a5a5c]">
              Confidence:{" "}
              <span className={`font-bold capitalize ${confidenceColor}`}>{match.confidence}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-[#1c1c1d]">Status</div>
            <div className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-bold capitalize border ${
              matchStatus === "approved"
                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                : matchStatus === "rejected"
                ? "bg-red-100 text-red-700 border-red-200"
                : matchStatus === "held"
                ? "bg-amber-100 text-amber-700 border-amber-200"
                : "bg-[#eef6fc] text-[#1c1c1d] border-[#dce6f0]"
            }`}>
              {matchStatus === "approved" && <CheckCircle className="inline h-4 w-4 mr-1" />}
              {matchStatus}
            </div>
          </div>
        </div>
      </div>

      {/* Reasons + Evidence */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-[#dce6f0] bg-white p-6 shadow-sm">
          <div className="text-sm font-bold text-[#1c1c1d]">Why this match</div>
          <ul className="mt-4 space-y-3">
            {match.reasons.map((r) => (
              <li key={r.label} className="flex items-start gap-2 text-sm text-[#5a5a5c] leading-relaxed">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span><span className="font-semibold text-[#1c1c1d]">{r.label}:</span> {r.detail}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-[#dce6f0] bg-white p-6 shadow-sm">
          <div className="text-sm font-bold text-[#1c1c1d]">Evidence</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {match.evidence.map((e) => (
              <span key={`${e.field}-${e.value}`} className="rounded-full bg-[#00a3e0]/10 px-2.5 py-1 text-xs font-medium text-[#00a3e0]">
                {e.field}: {e.value}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Intro + Actions */}
      <div className="mt-6 rounded-2xl border border-[#dce6f0] bg-white p-6 shadow-sm">
        <div className="text-sm font-bold text-[#1c1c1d]">Suggested Intro Email</div>
        <textarea
          className="mt-3 block w-full rounded-xl border border-[#dce6f0] bg-[#f4fafe] px-4 py-3 text-sm text-[#1c1c1d] outline-none focus:ring-2 ring-[#00a3e0]"
          rows={8}
          defaultValue={match.suggestedIntro}
        />

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleApprove}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-emerald-700 hover:scale-[1.02] transition"
          >
            <CheckCircle className="h-4 w-4" /> Approve
          </button>
          <button
            onClick={handleHold}
            className="inline-flex items-center gap-2 rounded-xl border border-[#dce6f0] bg-white px-5 py-2.5 text-sm font-bold text-[#1c1c1d] hover:bg-[#f4fafe] hover:scale-[1.02] transition"
          >
            <PauseCircle className="h-4 w-4" /> Hold
          </button>
          <button
            onClick={handleReject}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-bold text-red-700 hover:bg-red-100 hover:scale-[1.02] transition"
          >
            <XCircle className="h-4 w-4" /> Reject
          </button>
        </div>
      </div>

      {/* Affinity sync */}
      <div className="mt-6 rounded-2xl border border-[#dce6f0] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold text-[#1c1c1d]">
          <Database className="h-4 w-4 text-[#5a5a5c]" /> Affinity CRM Sync
        </div>
        <div className="mt-3 rounded-xl bg-[#1c1c1d] p-4 font-mono text-xs text-[#dce6f0] overflow-x-auto relative">
          <button
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(syncPayload, null, 2));
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="absolute top-3 right-3 text-[#8a8a8c] hover:text-white transition"
            title="Copy JSON"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
          <pre>{JSON.stringify(syncPayload, null, 2)}</pre>
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm text-[#5a5a5c]">
          Sync status:{" "}
          <span className={`font-bold capitalize inline-flex items-center gap-1 ${
            syncStatus === "mock_synced" ? "text-emerald-600" : "text-[#1c1c1d]"
          }`}>
            {syncStatus === "mock_synced" && <Sparkles className="h-3.5 w-3.5" />}
            {syncStatus.replace("_", " ")}
          </span>
        </div>
      </div>
    </div>
  );
}
