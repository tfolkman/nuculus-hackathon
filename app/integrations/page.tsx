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
        <h1 className="text-3xl font-bold tracking-tight text-[#1c1c1d]">Integrations</h1>
        <p className="mt-2 text-[#5a5a5c]">Connect Nucleus Connect to your existing stack.</p>
      </div>

      <div className="space-y-6">
        {/* Squarespace */}
        <div className="rounded-2xl border border-[#dce6f0] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-[#0048bd]" />
            <div className="text-lg font-semibold text-[#1c1c1d]">Squarespace</div>
          </div>
          <p className="mt-2 text-sm text-[#5a5a5c]">Embed the intake form directly on your existing Nucleus Connections Hub page.</p>
          <div className="mt-4 flex items-start justify-between gap-3 rounded-xl bg-[#1c1c1d] p-4 font-mono text-xs text-[#dce6f0]">
            <pre className="overflow-x-auto">{embedCode}</pre>
            <button onClick={() => copy(embedCode)} className="shrink-0 text-[#8a8a8c] hover:text-white">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Typeform */}
        <div className="rounded-2xl border border-[#dce6f0] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <FormInput className="h-5 w-5 text-[#00a3e0]" />
            <div className="text-lg font-semibold text-[#1c1c1d]">Typeform Webhook</div>
          </div>
          <p className="mt-2 text-sm text-[#5a5a5c]">
            Point your existing Typeform webhook to Nucleus Connect. Submissions are normalized and matched automatically.
          </p>
          <div className="mt-4 rounded-xl bg-[#f4fafe] p-4">
            <div className="text-xs font-semibold uppercase text-[#8a8a8c]">Webhook endpoint</div>
            <div className="mt-1 flex items-center gap-2 font-mono text-sm text-[#1c1c1d]">
              POST /api/typeform/webhook
              <button onClick={() => copy("POST /api/typeform/webhook")} className="text-[#8a8a8c] hover:text-[#0048bd]">
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Affinity */}
        <div className="rounded-2xl border border-[#dce6f0] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-[#0d9f6e]" />
            <div className="text-lg font-semibold text-[#1c1c1d]">Affinity CRM</div>
          </div>
          <p className="mt-2 text-sm text-[#5a5a5c]">
            Affinity remains the system of record. Approved matches sync person/organization records, list entries, and notes with match rationale.
          </p>
          <div className="mt-4 rounded-xl bg-[#f4fafe] p-4">
            <div className="text-xs font-semibold uppercase text-[#8a8a8c]">Sync endpoint</div>
            <div className="mt-1 flex items-center gap-2 font-mono text-sm text-[#1c1c1d]">
              POST /api/affinity/sync
              <button onClick={() => copy("POST /api/affinity/sync")} className="text-[#8a8a8c] hover:text-[#0048bd]">
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#eef6fc] px-3 py-1 text-xs font-medium text-[#5a5a5c]">
            Mock mode active — set AFFINITY_API_KEY for real sync
          </div>
        </div>
      </div>
    </div>
  );
}
