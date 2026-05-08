"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EntityType, IntakeForm, Entity } from "@/lib/types";
import { seedEntities } from "@/lib/data/seed-entities";
import { ArrowRight, Lightbulb, Wand2, Loader2, Sparkles, User, GraduationCap, Briefcase } from "lucide-react";

const profileTypes: { value: EntityType; label: string; desc: string }[] = [
  { value: "talent", label: "Talent / Operator", desc: "Executives, engineers, students, operators" },
  { value: "startup", label: "Startup / Research", desc: "University spinouts, deep tech startups" },
  { value: "mentor", label: "Mentor / Advisor", desc: "Experienced mentors and board advisors" },
  { value: "subject_matter_expert", label: "Subject-Matter Expert", desc: "Deep expertise in specific domains" },
  { value: "investor", label: "Investor", desc: "Angels, VCs, fund managers" },
  { value: "service_provider", label: "Service Provider", desc: "Legal, IP, regulatory, design, manufacturing" },
];

const demoScenarios = [
  {
    id: "executive",
    icon: Briefcase,
    title: "Executive → Deep Tech",
    subtitle: "Fractional COO, life sciences",
    description: "I am a fractional COO with medical device commercialization experience looking for a seed-stage life sciences startup in Utah.",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
  },
  {
    id: "student",
    icon: GraduationCap,
    title: "Student → Research Spinout",
    subtitle: "ML intern, AI/manufacturing",
    description: "BYU computer vision student seeking an ML engineering internship at an AI or advanced manufacturing startup in Utah.",
    name: "Diego Morales",
    email: "diego.morales@example.com",
  },
  {
    id: "operator",
    icon: User,
    title: "Operator → Scaling Company",
    subtitle: "VP Sales, cleantech/energy",
    description: "Enterprise SaaS sales leader with $30M+ ARR closed, looking for VP Sales role at a scaling cleantech or energy startup in Utah.",
    name: "Liam Anderson",
    email: "liam.anderson@example.com",
  },
];

export default function IntakePage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [entity, setEntity] = useState<Partial<Entity>>({ type: "talent" });
  const [form, setForm] = useState<Partial<IntakeForm>>({ naturalDescription: "", name: "", email: "" });
  const [extracted, setExtracted] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  function handleTypeSelect(type: EntityType) {
    setEntity({ type });
    setStep(2);
  }

  function loadDemo(scenarioId: string) {
    const scenario = demoScenarios.find((s) => s.id === scenarioId);
    if (!scenario) return;
    setForm({
      naturalDescription: scenario.description,
      name: scenario.name,
      email: scenario.email,
    });
    handleDescribe(scenario.description);
  }

  function handleDescribe(overrideText?: string) {
    const text = overrideText || form.naturalDescription || "";
    setIsAnalyzing(true);

    setTimeout(() => {
      const signals: string[] = [];
      if (/ceo|cto|coo|executive/i.test(text)) signals.push("Executive role");
      if (/engineer|developer|software/i.test(text)) signals.push("Engineering");
      if (/sales|marketing|growth|business development/i.test(text)) signals.push("Go-to-market");
      if (/utah|salt lake|provo|logan|ogden|lehi/i.test(text)) signals.push("Utah-based");
      if (/university|student|intern|byu|usu|u of u/i.test(text)) signals.push("Student / Intern");
      if (/ai|machine learning|ml|computer vision/i.test(text)) signals.push("AI / ML");
      if (/life science|biotech|medical|fda|510k|diagnostic/i.test(text)) signals.push("Life sciences");
      if (/energy|solar|battery|cleantech|grid/i.test(text)) signals.push("Energy / Cleantech");
      if (/defense|aerospace|dod|sbir|sttr/i.test(text)) signals.push("Defense / Aerospace");
      if (/fractional|advisor|advisory|board/i.test(text)) signals.push("Fractional / Advisory");
      if (/cyber|security|cryptography/i.test(text)) signals.push("Cybersecurity");
      if (/fintech|financial|banking/i.test(text)) signals.push("Fintech");
      if (/seed|pre-seed|early stage/i.test(text)) signals.push("Early-stage");
      if (/series a|growth|scaling/i.test(text)) signals.push("Growth-stage");
      if (signals.length === 0) signals.push("Utah innovation ecosystem");
      setExtracted(signals);
      setIsAnalyzing(false);
      setStep(3);
    }, 1400);
  }

  function handleSubmit() {
    const text = (form.naturalDescription || "").toLowerCase();
    const sectors: Entity["sectors"] = [];
    if (/life science|biotech|medical|fda|diagnostic|therapeutic|pharma/.test(text)) sectors.push("life_sciences");
    if (/ai|machine learning|ml|computer vision|neural|algorithm/.test(text)) sectors.push("ai");
    if (/defense|aerospace|military|dod|satellite/.test(text)) sectors.push("defense_aerospace");
    if (/cyber|security|cryptography|encryption|threat/.test(text)) sectors.push("cyber");
    if (/energy|solar|battery|grid|microgrid|renewable|power|cleantech/.test(text)) sectors.push("energy");
    if (/manufacturing|factory|production|industrial|automation|robotics/.test(text)) sectors.push("advanced_manufacturing");
    if (/fintech|financial|banking|payment|credit|crypto/.test(text)) sectors.push("fintech");
    if (/software|saas|app|platform|api|developer|code/.test(text)) sectors.push("software");
    if (/clean|climate|carbon|green|sustainable|environmental|agriculture/.test(text)) sectors.push("cleantech");

    const skills: string[] = [];
    if (/commercialization/.test(text)) skills.push("commercialization");
    if (/regulatory|fda|510k|iso/.test(text)) skills.push("regulatory_strategy");
    if (/engineering/.test(text)) skills.push("engineering");
    if (/sales/.test(text)) skills.push("sales");
    if (/marketing/.test(text)) skills.push("marketing");
    if (/software|code|developer/.test(text)) skills.push("software");
    if (/python/.test(text)) skills.push("python");
    if (/machine learning|ml|computer vision/.test(text)) skills.push("machine_learning");
    if (/operations|ops/.test(text)) skills.push("operations");
    if (/strategy/.test(text)) skills.push("strategy");
    if (/finance|financial/.test(text)) skills.push("finance");
    if (/legal|attorney|law/.test(text)) skills.push("legal");
    if (/patent|ip/.test(text)) skills.push("ip_strategy");
    if (/grant|sbir|sttr/.test(text)) skills.push("grant_writing");
    if (/management|leadership/.test(text)) skills.push("management");
    if (/product/.test(text)) skills.push("product");
    if (/design/.test(text)) skills.push("design");
    if (/data|analytics/.test(text)) skills.push("data_analysis");

    const stagePreferences: Entity["stagePreferences"] = [];
    if (/pre[-\s]?seed/.test(text)) stagePreferences.push("pre_seed");
    if (/seed[-\s]?stage|seed stage|raising seed/.test(text)) stagePreferences.push("seed");
    if (/series a/.test(text)) stagePreferences.push("series_a");
    if (/growth|scaling/.test(text)) stagePreferences.push("growth");
    if (/prototype/.test(text)) stagePreferences.push("prototype");
    if (/idea/.test(text)) stagePreferences.push("idea");
    if (/sbir/.test(text)) stagePreferences.push("sbir_phase_i", "sbir_phase_ii");
    if (stagePreferences.length === 0) stagePreferences.push("seed");

    let availability: Entity["availability"] = undefined;
    if (/fractional/.test(text)) availability = "fractional";
    else if (/intern|student/.test(text)) availability = "internship";
    else if (/advisor|advisory|board/.test(text)) availability = "advisory";
    else if (/full[-\s]?time|co[-\s]?founder|cto|ceo|coo|vp/.test(text)) availability = "full_time";

    const institutionAffiliations: Entity["institutionAffiliations"] = [];
    if (/university of utah|u of u/.test(text)) institutionAffiliations.push("university_of_utah");
    if (/byu|brigham young/.test(text)) institutionAffiliations.push("brigham_young_university");
    if (/usu|utah state/.test(text)) institutionAffiliations.push("utah_state_university");
    if (/uvu|utah valley/.test(text)) institutionAffiliations.push("utah_valley_university");
    if (institutionAffiliations.length === 0) institutionAffiliations.push("none");

    const id = `intake-${Date.now()}`;
    const newEntity: Entity = {
      id,
      type: entity.type || "talent",
      name: form.name || "Anonymous",
      headline: form.naturalDescription?.slice(0, 80) || "New submission",
      summary: form.naturalDescription || "",
      location: "Utah",
      sectors,
      institutionAffiliations,
      stagePreferences,
      missionInterests: ["utah_ecosystem"],
      skills,
      expertise: skills,
      needs: [],
      offers: [{ category: "role", description: form.naturalDescription || "" }],
      fundingStatus: undefined,
      origin: undefined,
      trl: undefined,
      tags: extracted,
      publicSignals: [],
      availability,
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
      <div className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#0048bd]/5 px-4 py-1.5 text-sm font-medium text-[#0048bd]">
          <Sparkles className="h-4 w-4" />
          Hackathon Prototype — Nucleus Utah AI Challenge
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[#1c1c1d] md:text-4xl">Find Your Connection</h1>
        <p className="mt-3 text-lg text-[#5a5a5c]">
          Describe what you need. AI extracts signals and ranks matches across Utah's innovation ecosystem.
        </p>
      </div>

      {/* Step 1: Select type */}
      {step === 1 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {profileTypes.map((pt) => (
            <button
              key={pt.value}
              onClick={() => handleTypeSelect(pt.value)}
              className="flex flex-col items-start rounded-2xl border border-[#dce6f0] bg-white p-6 text-left shadow-sm transition hover:border-[#00a3e0] hover:shadow-md hover:-translate-y-0.5"
            >
              <span className="text-base font-semibold text-[#1c1c1d]">{pt.label}</span>
              <span className="mt-1 text-sm text-[#5a5a5c]">{pt.desc}</span>
            </button>
          ))}
        </div>
      )}

      {/* Step 2: Describe */}
      {step === 2 && (
        <div className="rounded-2xl border border-[#dce6f0] bg-white p-8 shadow-sm">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#0048bd]/5 px-3 py-1 text-xs font-medium text-[#0048bd]">
            <Lightbulb className="h-3.5 w-3.5" />
            Step 2 of 3 — Describe your need
          </div>

          {/* Demo scenarios */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#1c1c1d] mb-3">
              Or try a demo scenario (pre-filled for judges):
            </label>
            <div className="grid gap-3 sm:grid-cols-3">
              {demoScenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => loadDemo(scenario.id)}
                  className="flex flex-col items-start rounded-xl border border-[#dce6f0] bg-[#f4fafe] p-4 text-left transition hover:border-[#0048bd] hover:bg-[#eef6fc] hover:shadow-sm"
                >
                  <scenario.icon className="h-5 w-5 text-[#0048bd] mb-2" />
                  <span className="text-sm font-semibold text-[#1c1c1d]">{scenario.title}</span>
                  <span className="text-xs text-[#5a5a5c] mt-1">{scenario.subtitle}</span>
                </button>
              ))}
            </div>
          </div>

          <label className="block text-sm font-semibold text-[#1c1c1d]">
            What connection are you looking for?
          </label>
          <p className="mt-1 text-xs text-[#8a8a8c]">
            The more detail you provide, the better our AI can match you. Include your background, desired role, sectors, and stage preferences.
          </p>
          <textarea
            value={form.naturalDescription}
            onChange={(e) => setForm((f) => ({ ...f, naturalDescription: e.target.value }))}
            placeholder="Example: I am a fractional COO with medical device commercialization experience looking for a seed-stage life sciences startup in Utah..."
            className="mt-3 block w-full rounded-xl border border-[#dce6f0] bg-[#f4fafe] px-4 py-3 text-sm text-[#1c1c1d] outline-none ring-[#00a3e0] placeholder:text-[#8a8a8c] focus:ring-2"
            rows={8}
          />

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#1c1c1d]">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="mt-2 block w-full rounded-xl border border-[#dce6f0] bg-[#f4fafe] px-4 py-2.5 text-sm outline-none ring-[#00a3e0] placeholder:text-[#8a8a8c] focus:ring-2"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1c1c1d]">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="mt-2 block w-full rounded-xl border border-[#dce6f0] bg-[#f4fafe] px-4 py-2.5 text-sm outline-none ring-[#00a3e0] placeholder:text-[#8a8a8c] focus:ring-2"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <button
            onClick={() => handleDescribe()}
            disabled={!form.naturalDescription || !form.name || isAnalyzing}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0048bd] px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-[#0066e0] hover:scale-[1.02] disabled:opacity-40"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                AI is analyzing your profile...
              </>
            ) : (
              <>
                Extract signals
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Analyzing state */}
      {step === 2 && isAnalyzing && (
        <div className="mt-6 flex flex-col items-center gap-4 py-12 rounded-2xl border border-[#dce6f0] bg-white">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0048bd] border-t-transparent" />
          <div className="text-base font-medium text-[#1c1c1d]">AI is analyzing your profile...</div>
          <div className="text-sm text-[#8a8a8c]">Extracting sectors, skills, stage preferences, and Utah context</div>
          <div className="flex gap-2 mt-2">
            {["Sectors", "Skills", "Stage", "Utah context"].map((label, i) => (
              <span
                key={label}
                className="rounded-full bg-[#eef6fc] px-3 py-1 text-xs font-medium text-[#0048bd] animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Review + Submit */}
      {step === 3 && (
        <div className="rounded-2xl border border-[#dce6f0] bg-white p-8 shadow-sm">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#0d9f6e]/10 px-3 py-1 text-xs font-medium text-[#0d9f6e]">
            <Wand2 className="h-3.5 w-3.5" />
            Step 3 of 3 — AI Normalized
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-[#1c1c1d]">Extracted signals:</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {extracted.map((s, i) => (
                <span
                  key={s}
                  className="rounded-full bg-[#eef6fc] px-3 py-1 text-xs font-medium text-[#0048bd]"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3 text-sm text-[#5a5a5c]">
            <p><span className="font-semibold text-[#1c1c1d]">Profile type:</span> {entity.type}</p>
            <p><span className="font-semibold text-[#1c1c1d]">Name:</span> {form.name}</p>
            <p><span className="font-semibold text-[#1c1c1d]">Location:</span> Utah</p>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0048bd] px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-[#0066e0] hover:scale-[1.02]"
          >
            Find Matches
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
