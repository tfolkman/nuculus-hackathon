"use client";

import { useState } from "react";
import { Copy, Check, Globe, FormInput, Database, ArrowRight, Play, Zap, ChevronRight } from "lucide-react";

export default function IntegrationsPage() {
  const [copied, setCopied] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);
  const [typeformPayload, setTypeformPayload] = useState(`{\n  "event_id": "evt_abc123",\n  "form_response": {\n    "definition": { "title": "Nucleus Connections Hub" },\n    "answers": [\n      { "field": { "ref": "name" }, "text": "Alex Rivera" },\n      { "field": { "ref": "email" }, "email": "alex@example.com" },\n      { "field": { "ref": "description" }, "text": "AI engineer looking for seed-stage fintech startup in SLC" }\n    ]\n  }\n}`);
  const [normalizedEntity, setNormalizedEntity] = useState<any>(null);

  const embedCode = `<iframe
  src="https://nucleus-connect.example.com/intake?source=squarespace"
  width="100%"
  height="820"
  style="border:0;border-radius:16px;overflow:hidden;"
  title="Nucleus Connect Intake"
></iframe>`;

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function runDemoSync() {
    setSyncing(true);
    setSynced(false);
    setTimeout(() => {
      setSyncing(false);
      setSynced(true);
    }, 1500);
  }

  function runTypeformTest() {
    try {
      const parsed = JSON.parse(typeformPayload);
      const answers = parsed.form_response?.answers || [];
      const name = answers.find((a: any) => a.field?.ref === "name" || a.field?.type === "short_text")?.text || "Unknown";
      const email = answers.find((a: any) => a.field?.type === "email")?.email || "unknown@example.com";
      const description = answers.find((a: any) => a.field?.ref === "description" || a.field?.type === "long_text")?.text || "";

      const sectors: string[] = [];
      const d = description.toLowerCase();
      if (/fintech|financial|banking/.test(d)) sectors.push("fintech");
      if (/ai|machine learning|ml/.test(d)) sectors.push("ai");
      if (/software|saas|developer/.test(d)) sectors.push("software");

      setNormalizedEntity({
        name,
        email,
        summary: description,
        sectors,
        skills: d.includes("engineer") ? ["engineering", "software"] : [],
        stagePreferences: d.includes("seed") ? ["seed"] : [],
        tags: ["Typeform Import"],
        source: "Typeform Webhook",
      });
    } catch {
      setNormalizedEntity({ error: "Invalid JSON payload" });
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-[#1c1c1d] md:text-4xl">Integrations</h1>
        <p className="mt-2 text-[#5a5a5c] text-lg">Connect Nucleus Connect to your existing stack.</p>
      </div>

      {/* Data Flow Diagram */}
      <div className="mb-10 rounded-2xl border border-[#dce6f0] bg-white p-8 shadow-sm">
        <div className="text-sm font-bold text-[#1c1c1d] mb-6">Data Flow</div>
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
          <div className="rounded-xl bg-[#f4fafe] border border-[#dce6f0] px-4 py-3 text-center">
            <div className="font-bold text-[#1c1c1d]">Squarespace</div>
            <div className="text-xs text-[#5a5a5c]">Website</div>
          </div>
          <ChevronRight className="h-5 w-5 text-[#8a8a8c]" />
          <div className="rounded-xl bg-[#f4fafe] border border-[#dce6f0] px-4 py-3 text-center">
            <div className="font-bold text-[#1c1c1d]">Typeform</div>
            <div className="text-xs text-[#5a5a5c]">Intake Form</div>
          </div>
          <ChevronRight className="h-5 w-5 text-[#8a8a8c]" />
          <div className="rounded-xl bg-[#0048bd]/10 border border-[#0048bd]/20 px-4 py-3 text-center">
            <div className="font-bold text-[#0048bd]">Nucleus Connect</div>
            <div className="text-xs text-[#0048bd]/70">AI Matching Engine</div>
          </div>
          <ChevronRight className="h-5 w-5 text-[#8a8a8c]" />
          <div className="rounded-xl bg-[#f4fafe] border border-[#dce6f0] px-4 py-3 text-center">
            <div className="font-bold text-[#1c1c1d]">Staff Approval</div>
            <div className="text-xs text-[#5a5a8c]">Human-in-the-loop</div>
          </div>
          <ChevronRight className="h-5 w-5 text-[#8a8a8c]" />
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-center">
            <div className="font-bold text-emerald-700">Affinity CRM</div>
            <div className="text-xs text-emerald-600">System of Record</div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Squarespace */}
        <div className="rounded-2xl border border-[#dce6f0] bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0048bd]/10">
              <Globe className="h-5 w-5 text-[#0048bd]" />
            </div>
            <div className="text-lg font-bold text-[#1c1c1d]">Squarespace</div>
          </div>
          <p className="mt-2 text-sm text-[#5a5a5c]">Embed the intake form directly on your existing Nucleus Connections Hub page.</p>
          <div className="mt-4 flex items-start justify-between gap-3 rounded-xl bg-[#1c1c1d] p-4 font-mono text-xs text-[#dce6f0]">
            <pre className="overflow-x-auto">{embedCode}</pre>
            <button onClick={() => copy(embedCode)} className="shrink-0 text-[#8a8a8c] hover:text-white transition">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Typeform */}
        <div className="rounded-2xl border border-[#dce6f0] bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00a3e0]/10">
              <FormInput className="h-5 w-5 text-[#00a3e0]" />
            </div>
            <div className="text-lg font-bold text-[#1c1c1d]">Typeform Webhook</div>
          </div>
          <p className="mt-2 text-sm text-[#5a5a5c]">
            Point your existing Typeform webhook to Nucleus Connect. Submissions are normalized and matched automatically.
          </p>
          <div className="mt-4 rounded-xl bg-[#f4fafe] p-4">
            <div className="text-xs font-bold uppercase text-[#8a8a8c]">Webhook endpoint</div>
            <div className="mt-1 flex items-center gap-2 font-mono text-sm text-[#1c1c1d]">
              POST /api/typeform/webhook
              <button onClick={() => copy("POST /api/typeform/webhook")} className="text-[#8a8a8c] hover:text-[#0048bd] transition">
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Typeform Tester */}
          <div className="mt-6 rounded-xl border border-[#dce6f0] p-4">
            <div className="text-sm font-bold text-[#1c1c1d] mb-3">Webhook Tester</div>
            <textarea
              value={typeformPayload}
              onChange={(e) => setTypeformPayload(e.target.value)}
              className="block w-full rounded-xl border border-[#dce6f0] bg-[#f4fafe] px-4 py-3 text-xs font-mono text-[#1c1c1d] outline-none focus:ring-2 ring-[#00a3e0]"
              rows={10}
            />
            <button
              onClick={runTypeformTest}
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#0048bd] px-4 py-2 text-sm font-bold text-white hover:bg-[#0066e0] hover:scale-[1.02] transition"
            >
              <Play className="h-4 w-4" />
              Test Normalization
            </button>

            {normalizedEntity && !normalizedEntity.error && (
              <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-4">
                <div className="text-sm font-bold text-emerald-800 mb-2">✅ Normalized Entity</div>
                <pre className="text-xs font-mono text-emerald-700 overflow-x-auto">{JSON.stringify(normalizedEntity, null, 2)}</pre>
              </div>
            )}
            {normalizedEntity?.error && (
              <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                {normalizedEntity.error}
              </div>
            )}
          </div>
        </div>

        {/* Affinity */}
        <div className="rounded-2xl border border-[#dce6f0] bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
              <Database className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="text-lg font-bold text-[#1c1c1d]">Affinity CRM</div>
          </div>
          <p className="mt-2 text-sm text-[#5a5a5c]">
            Affinity remains the system of record. Approved matches sync person/organization records, list entries, and notes with match rationale.
          </p>
          <div className="mt-4 rounded-xl bg-[#f4fafe] p-4">
            <div className="text-xs font-bold uppercase text-[#8a8a8c]">Sync endpoint</div>
            <div className="mt-1 flex items-center gap-2 font-mono text-sm text-[#1c1c1d]">
              POST /api/affinity/sync
              <button onClick={() => copy("POST /api/affinity/sync")} className="text-[#8a8a8c] hover:text-[#0048bd] transition">
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Live Sync Demo */}
          <div className="mt-6 rounded-xl border border-[#dce6f0] p-4">
            <div className="text-sm font-bold text-[#1c1c1d] mb-3">Live Sync Demo</div>
            <button
              onClick={runDemoSync}
              disabled={syncing}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 hover:scale-[1.02] transition disabled:opacity-50"
            >
              {syncing ? (
                <>
                  <Zap className="h-4 w-4 animate-pulse" />
                  Syncing to Affinity...
                </>
              ) : synced ? (
                <>
                  <Check className="h-4 w-4" />
                  Synced!
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Run Demo Sync
                </>
              )}
            </button>

            {synced && (
              <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-800">
                  <Check className="h-4 w-4" />
                  Successfully synced to Affinity CRM (mock)
                </div>
                <div className="mt-2 text-xs text-emerald-600">
                  Person record created • Organization linked • List entry added • Note with match rationale attached
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#eef6fc] px-3 py-1 text-xs font-medium text-[#5a5a5c]">
            Mock mode active — set AFFINITY_API_KEY for real sync
          </div>
        </div>
      </div>
    </div>
  );
}
