"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EntityType, IntakeForm, Entity } from "@/lib/types";
import { seedEntities } from "@/lib/data/seed-entities";
import { ArrowRight, Lightbulb, Wand2 } from "lucide-react";

const profileTypes: { value: EntityType; label: string; desc: string }[] = [
  { value: "talent", label: "Talent / Operator", desc: "Executives, engineers, students, operators" },
  { value: "startup", label: "Startup / Research", desc: "University spinouts, deep tech startups" },
  { value: "mentor", label: "Mentor / Advisor", desc: "Experienced mentors and board advisors" },
  { value: "subject_matter_expert", label: "Subject-Matter Expert", desc: "Deep expertise in specific domains" },
  { value: "investor", label: "Investor", desc: "Angels, VCs, fund managers" },
  { value: "service_provider", label: "Service Provider", desc: "Legal, IP, regulatory, design, manufacturing" },
];

export default function IntakePage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [entity, setEntity] = useState<Partial<Entity>>({ type: "talent" });
  const [form, setForm] = useState<Partial<IntakeForm>>({ naturalDescription: "", name: "", email: "" });
  const [extracted, setExtracted] = useState<string[]>([]);

  function handleTypeSelect(type: EntityType) {
    setEntity({ type });
    setStep(2);
  }

  function handleDescribe() {
    const text = form.naturalDescription || "";
    const signals: string[] = [];
    if (/ceo|cto|coo|executive/i.test(text)) signals.push("Executive role");
    if (/engineer|developer|software/i.test(text)) signals.push("Engineering");
    if (/sales|marketing|growth/i.test(text)) signals.push("Go-to-market");
    if (/utah|salt lake|provo|logan/i.test(text)) signals.push("Utah-based");
    if (/university|student|intern/i.test(text)) signals.push("Student / Intern");
    if (/ai|machine learning|ml/i.test(text)) signals.push("AI / ML");
    if (/life science|biotech|medical/i.test(text)) signals.push("Life sciences");
    if (/energy|solar|battery/i.test(text)) signals.push("Energy / Cleantech");
    if (/defense|aerospace|dod/i.test(text)) signals.push("Defense / Aerospace");
    if (/fractional|advisor|advisory/i.test(text)) signals.push("Fractional / Advisory");
    if (signals.length === 0) signals.push("Utah innovation ecosystem");
    setExtracted(signals);
    setStep(3);
  }

  function handleSubmit() {
    const id = `intake-${Date.now()}`;
    const newEntity: Entity = {
      id,
      type: entity.type || "talent",
      name: form.name || "Anonymous",
      headline: form.naturalDescription?.slice(0, 80) || "New submission",
      summary: form.naturalDescription || "",
      location: "Utah",
      sectors: [],
      institutionAffiliations: [],
      stagePreferences: [],
      missionInterests: [],
      skills: [],
      expertise: [],
      needs: [],
      offers: [],
      tags: extracted,
      publicSignals: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const all = [...seedEntities, newEntity];
    if (typeof window !== "undefined") {
      localStorage.setItem("nucleus_entities", JSON.stringify(all));
      localStorage.setItem("nucleus_intake_id", id);
    }
    router.push(`/matches?source=${id}`);
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-[#0f172a]">Find Your Connection</h1>
        <p className="mt-2 text-[#64748b]">Describe what you need. AI extracts signals and ranks matches.</p>
      </div>

      {/* Step 1: Select type */}
      {step === 1 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {profileTypes.map((pt) => (
            <button
              key={pt.value}
              onClick={() => handleTypeSelect(pt.value)}
              className="flex flex-col items-start rounded-2xl border border-[#e2e8f0] bg-white p-6 text-left shadow-sm transition hover:border-[#06b6d4] hover:shadow-md"
            >
              <span className="text-base font-semibold text-[#0f172a]">{pt.label}</span>
              <span className="mt-1 text-sm text-[#64748b]">{pt.desc}</span>
            </button>
          ))}
        </div>
      )}

      {/* Step 2: Describe */}
      {step === 2 && (
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-8 shadow-sm">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#1e3a5f]/5 px-3 py-1 text-xs font-medium text-[#1e3a5f]">
            <Lightbulb className="h-3.5 w-3.5" />
            Step 2 of 3
          </div>
          <label className="block text-sm font-semibold text-[#0f172a]">What connection are you looking for?</label>
          <textarea
            value={form.naturalDescription}
            onChange={(e) => setForm((f) => ({ ...f, naturalDescription: e.target.value }))}
            placeholder="Example: I am a fractional COO with medical device commercialization experience looking for a seed-stage life sciences startup in Utah..."
            className="mt-3 block w-full rounded-xl border border-[#e2e8f0] bg-[#f8f9fb] px-4 py-3 text-sm text-[#0f172a] outline-none ring-[#06b6d4] placeholder:text-[#94a3b8] focus:ring-2"
            rows={5}
          />

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0f172a]">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="mt-2 block w-full rounded-xl border border-[#e2e8f0] bg-[#f8f9fb] px-4 py-2.5 text-sm outline-none ring-[#06b6d4] placeholder:text-[#94a3b8] focus:ring-2"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0f172a]">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="mt-2 block w-full rounded-xl border border-[#e2e8f0] bg-[#f8f9fb] px-4 py-2.5 text-sm outline-none ring-[#06b6d4] placeholder:text-[#94a3b8] focus:ring-2"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <button
            onClick={handleDescribe}
            disabled={!form.naturalDescription || !form.name}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1e3a5f] px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-[#2d4a6f] disabled:opacity-40"
          >
            Extract signals
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Step 3: Review + Submit */}
      {step === 3 && (
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-8 shadow-sm">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#10b981]/10 px-3 py-1 text-xs font-medium text-[#10b981]">
            <Wand2 className="h-3.5 w-3.5" />
            Step 3 of 3 — AI Normalized
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-[#0f172a]">Extracted signals:</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {extracted.map((s) => (
                <span key={s} className="rounded-full bg-[#f1f5f9] px-3 py-1 text-xs font-medium text-[#1e3a5f]">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3 text-sm text-[#64748b]">
            <p><span className="font-semibold text-[#0f172a]">Profile type:</span> {entity.type}</p>
            <p><span className="font-semibold text-[#0f172a]">Name:</span> {form.name}</p>
            <p><span className="font-semibold text-[#0f172a]">Location:</span> Utah</p>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1e3a5f] px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-[#2d4a6f]"
          >
            Find Matches
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
