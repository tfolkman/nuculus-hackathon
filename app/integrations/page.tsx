"use client";

import { useState } from "react";
import { Copy, Check, Globe, FormInput, Database } from "lucide-react";

export default function IntegrationsPage() {
  const [copied, setCopied] = useState(false);

  const embedCode = `\u003ciframe\n  src="https://nucleus-connect.example.com/intake?source=squarespace"\n  width="100%"\n  height="820"\n  style="border:0;border-radius:16px;overflow:hidden;"\n  title="Nucleus Connect Intake"\n\u003e\u003c/iframe\u003e`;

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#0f172a]">Integrations</h1>
        <p className="mt-2 text-[#64748b]">Connect Nucleus Connect to your existing stack.</p>
      </div>

      <div className="space-y-6">
        {/* Squarespace */}
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-[#1e3a5f]" />
            <div className="text-lg font-semibold text-[#0f172a]">Squarespace</div>
          </div>
          <p className="mt-2 text-sm text-[#64748b]">Embed the intake form directly on your existing Nucleus Connections Hub page.</p>
          <div className="mt-4 flex items-start justify-between gap-3 rounded-xl bg-[#0f172a] p-4 font-mono text-xs text-[#e2e8f0]">
            <pre className="overflow-x-auto">{embedCode}</pre>
            <button onClick={() => copy(embedCode)} className="shrink-0 text-[#94a3b8] hover:text-white">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Typeform */}
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <FormInput className="h-5 w-5 text-[#06b6d4]" />
            <div className="text-lg font-semibold text-[#0f172a]">Typeform Webhook</div>
          </div>
          <p className="mt-2 text-sm text-[#64748b]">
            Point your existing Typeform webhook to Nucleus Connect. Submissions are normalized and matched automatically.
          </p>
          <div className="mt-4 rounded-xl bg-[#f8f9fb] p-4">
            <div className="text-xs font-semibold uppercase text-[#94a3b8]">Webhook endpoint</div>
            <div className="mt-1 flex items-center gap-2 font-mono text-sm text-[#0f172a]">
              POST /api/typeform/webhook
              <button onClick={() => copy("POST /api/typeform/webhook")} className="text-[#94a3b8] hover:text-[#1e3a5f]">
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Affinity */}
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-[#10b981]" />
            <div className="text-lg font-semibold text-[#0f172a]">Affinity CRM</div>
          </div>
          <p className="mt-2 text-sm text-[#64748b]">
            Affinity remains the system of record. Approved matches sync person/organization records, list entries, and notes with match rationale.
          </p>
          <div className="mt-4 rounded-xl bg-[#f8f9fb] p-4">
            <div className="text-xs font-semibold uppercase text-[#94a3b8]">Sync endpoint</div>
            <div className="mt-1 flex items-center gap-2 font-mono text-sm text-[#0f172a]">
              POST /api/affinity/sync
              <button onClick={() => copy("POST /api/affinity/sync")} className="text-[#94a3b8] hover:text-[#1e3a5f]">
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#f1f5f9] px-3 py-1 text-xs font-medium text-[#64748b]">
            Mock mode active — set AFFINITY_API_KEY for real sync
          </div>
        </div>
      </div>
    </div>
  );
}
