"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EntityType, IntakeForm, Entity } from "@/lib/types";
import { seedEntities } from "@/lib/data/seed-entities";
import { normalizeIntake } from "@/lib/ai/actions";
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
  const [normalizedData, setNormalizedData] = useState<Record<string, unknown> | null>(null);

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

  async function handleDescribe(overrideText?: string) {
    const text = overrideText || form.naturalDescription || "";
    if (!text.trim() || !form.name) return;

    setIsAnalyzing(true);

    // Call AI normalization
    try {
      const result = await normalizeIntake(text, entity.type || "talent");

      if (result.fallback || !result.data) {
        // Deterministic fallback extraction
        const signals: string[] = [];
        if (/\b(ceo|cto|coo|executive)\b/i.test(text)) signals.push("Executive role");
        if (/\b(engineer|developer|software)\b/i.test(text)) signals.push("Engineering");
        if (/\b(sales|marketing|growth|business development)\b/i.test(text)) signals.push("Go-to-market");
        if (/\b(utah|salt lake|provo|logan|ogden|lehi)\b/i.test(text)) signals.push("Utah-based");
        if (/\b(university|student|intern|byu|usu|u of u)\b/i.test(text)) signals.push("Student / Intern");
        if (/\b(ai|machine learning|\bml\b|computer vision)\b/i.test(text)) signals.push("AI / ML");
        if (/\b(life science|biotech|medical|fda|510k|diagnostic)\b/i.test(text)) signals.push("Life sciences");
        if (/\b(energy|solar|battery|cleantech|grid)\b/i.test(text)) signals.push("Energy / Cleantech");
        if (/\b(defense|aerospace|dod|sbir|sttr)\b/i.test(text)) signals.push("Defense / Aerospace");
        if (/\b(fractional|advisor|advisory|board)\b/i.test(text)) signals.push("Fractional / Advisory");
        if (/\b(cyber|security|cryptography)\b/i.test(text)) signals.push("Cybersecurity");
        if (/\b(fintech|financial|banking)\b/i.test(text)) signals.push("Fintech");
        if (/\b(seed|pre-seed|early stage)\b/i.test(text)) signals.push("Early-stage");
        if (/\b(series a|growth|scaling)\b/i.test(text)) signals.push("Growth-stage");
        if (signals.length === 0) signals.push("Utah innovation ecosystem");
        setExtracted(signals);
        setNormalizedData(null);
      } else {
        // AI extracted data — auto-populate
        const data = result.data;
        setNormalizedData(data);

        const signals = [
          ...((data.sectors as string[]) || []).map((s: string) => s.replace(/_/g, " ")),
          ...((data.skills as string[]) || []).slice(0, 4),
          ...((data.stagePreferences as string[]) || []).map((s: string) => s.replace(/_/g, " ")),
          ...((data.institutionAffiliations as string[]) || []).map((s: string) => s.replace(/_/g, " ")),
          data.availability as string,
        ].filter(Boolean);
        setExtracted(signals.length > 0 ? signals : ["Utah innovation ecosystem"]);
      }
    } catch (e) {
      console.error("AI normalization failed:", e);
      // Fallback on error
      setExtracted(["Utah innovation ecosystem"]);
      setNormalizedData(null);
    } finally {
      setIsAnalyzing(false);
      setStep(3);
    }
  }

  function handleSubmit() {
    const text = (form.naturalDescription || "").toLowerCase();

    // Use AI-normalized data if available, otherwise fall back to regex
    const sectors: Entity["sectors"] = normalizedData?.sectors && (normalizedData.sectors as string[]).length > 0
      ? (normalizedData.sectors as string[]).filter((s: string) =>
          ["life_sciences","ai","defense_aerospace","cyber","energy","advanced_manufacturing","fintech","software","cleantech","other"].includes(s)
        ) as Entity["sectors"]
      : [];

    if (sectors.length === 0) {
      if (/\b(life science|biotech|medical|fda|diagnostic|therapeutic|pharma)\b/.test(text)) sectors.push("life_sciences");
      if (/\b(ai|machine learning|\bml\b|computer vision|neural|algorithm)\b/.test(text)) sectors.push("ai");
      if (/\b(defense|aerospace|military|dod|satellite)\b/.test(text)) sectors.push("defense_aerospace");
      if (/\b(cyber|security|cryptography|encryption|threat)\b/.test(text)) sectors.push("cyber");
      if (/\b(energy|solar|battery|grid|microgrid|renewable|power|cleantech)\b/.test(text)) sectors.push("energy");
      if (/\b(manufactur|factory|production|industrial|automation|robotics)\b/.test(text)) sectors.push("advanced_manufacturing");
      if (/\b(fintech|financial|banking|payment|credit|crypto)\b/.test(text)) sectors.push("fintech");
      if (/\b(software|saas|app|platform|api|developer|code)\b/.test(text)) sectors.push("software");
      if (/\b(clean|climate|carbon|green|sustainable|environmental|agriculture)\b/.test(text)) sectors.push("cleantech");
    }

    const skills: string[] = normalizedData?.skills && (normalizedData.skills as string[]).length > 0
      ? (normalizedData.skills as string[])
      : [];
    if (skills.length === 0) {
      if (/\bcommercialization\b/.test(text)) skills.push("commercialization");
      if (/\b(regulatory|fda|510k|iso)\b/.test(text)) skills.push("regulatory_strategy");
      if (/\bengineering\b/.test(text)) skills.push("engineering");
      if (/\bsales\b/.test(text)) skills.push("sales");
      if (/\bmarketing\b/.test(text)) skills.push("marketing");
      if (/\b(software|code|developer)\b/.test(text)) skills.push("software");
      if (/\bpython\b/.test(text)) skills.push("python");
      if (/\b(machine learning|\bml\b|computer vision)\b/.test(text)) skills.push("machine_learning");
      if (/\boperations\b/.test(text)) skills.push("operations");
      if (/\bstrategy\b/.test(text)) skills.push("strategy");
      if (/\b(finance|financial)\b/.test(text)) skills.push("finance");
      if (/\b(legal|attorney|law)\b/.test(text)) skills.push("legal");
      if (/\b(patent|ip)\b/.test(text)) skills.push("ip_strategy");
      if (/\b(grant|sbir|sttr)\b/.test(text)) skills.push("grant_writing");
      if (/\b(management|leadership)\b/.test(text)) skills.push("management");
      if (/\bproduct\b/.test(text)) skills.push("product");
      if (/\bdesign\b/.test(text)) skills.push("design");
      if (/\b(data|analytics)\b/.test(text)) skills.push("data_analysis");
    }

    const stagePreferences: Entity["stagePreferences"] = normalizedData?.stagePreferences && (normalizedData.stagePreferences as string[]).length > 0
      ? (normalizedData.stagePreferences as string[]).filter((s: string) =>
          ["idea","research","prototype","pre_seed","seed","series_a","growth","commercialization","sbir_phase_i","sbir_phase_ii"].includes(s)
        ) as Entity["stagePreferences"]
      : [];
    if (stagePreferences.length === 0) {
      if (/\bpre[-\s]?seed\b/.test(text)) stagePreferences.push("pre_seed");
      if (/\b(seed[-\s]?stage|seed stage|raising seed)\b/.test(text)) stagePreferences.push("seed");
      if (/\bseries a\b/.test(text)) stagePreferences.push("series_a");
      if (/\b(growth|scaling)\b/.test(text)) stagePreferences.push("growth");
      if (/\bprototype\b/.test(text)) stagePreferences.push("prototype");
      if (/\bidea\b/.test(text)) stagePreferences.push("idea");
      if (/\bsbir\b/.test(text)) stagePreferences.push("sbir_phase_i", "sbir_phase_ii");
      if (stagePreferences.length === 0) stagePreferences.push("seed");
    }

    let availability: Entity["availability"] = normalizedData?.availability && (normalizedData.availability as string) !== ""
      ? (normalizedData.availability as Entity["availability"])
      : undefined;
    if (!availability) {
      if (/\bfractional\b/.test(text)) availability = "fractional";
      else if (/\b(intern|student)\b/.test(text)) availability = "internship";
      else if (/\b(advisor|advisory|board)\b/.test(text)) availability = "advisory";
      else if (/\b(full[-\s]?time|co[-\s]?founder|cto|ceo|coo|vp)\b/.test(text)) availability = "full_time";
    }

    const institutionAffiliations: Entity["institutionAffiliations"] = normalizedData?.institutionAffiliations && (normalizedData.institutionAffiliations as string[]).length > 0
      ? (normalizedData.institutionAffiliations as string[]).filter((s: string) =>
          ["university_of_utah","brigham_young_university","utah_state_university","utah_valley_university","weber_state_university","utah_tech_university","southern_utah_university","salt_lake_community_college","none","out_of_state"].includes(s)
        ) as Entity["institutionAffiliations"]
      : [];
    if (institutionAffiliations.length === 0) {
      if (/\b(university of utah|u of u)\b/.test(text)) institutionAffiliations.push("university_of_utah");
      if (/\b(byu|brigham young)\b/.test(text)) institutionAffiliations.push("brigham_young_university");
      if (/\b(usu|utah state)\b/.test(text)) institutionAffiliations.push("utah_state_university");
      if (/\b(uvu|utah valley)\b/.test(text)) institutionAffiliations.push("utah_valley_university");
      if (/\bmit\b|massachusetts institute/.test(text)) institutionAffiliations.push("out_of_state");
      if (/\b(stanford|harvard|berkeley|caltech|cmu|carnegie mellon)\b/.test(text)) institutionAffiliations.push("out_of_state");
      if (institutionAffiliations.length === 0) institutionAffiliations.push("none");
    }

    const id = `intake-${Date.now()}`;
    const newEntity: Entity = {
      id,
      type: entity.type || "talent",
      name: form.name || "Anonymous",
      headline: (normalizedData?.headline as string) || form.naturalDescription?.slice(0, 80) || "New submission",
      summary: form.naturalDescription || "",
      location: "Utah",
      sectors,
      institutionAffiliations,
      stagePreferences,
      missionInterests: normalizedData?.missionInterests && (normalizedData.missionInterests as string[]).length > 0
        ? (normalizedData.missionInterests as string[])
        : /utah|salt lake|provo|logan|byu|usu|u of u/.test(text)
        ? ["utah_ecosystem"]
        : [],
      skills,
      expertise: skills,
      needs: normalizedData?.needs
        ? (normalizedData.needs as { category: string; description: string }[])
        : [],
      offers: normalizedData?.offers && (normalizedData.offers as { category: string; description: string }[]).length > 0
        ? (normalizedData.offers as { category: string; description: string }[])
        : [{ category: "role", description: form.naturalDescription || "" }],
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
                  key={s + i}
                  className="rounded-full bg-[#eef6fc] px-3 py-1 text-xs font-medium text-[#0048bd] animate-fade-in"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {normalizedData && (
            <div className="mb-6 rounded-xl bg-[#f4fafe] p-4 border border-[#dce6f0]">
              <div className="text-xs font-bold uppercase tracking-wide text-[#8a8a8c] mb-2">
                AI-Extracted Profile
              </div>
              <div className="space-y-2 text-sm text-[#5a5a5c]">
                {(normalizedData.headline as string) && (
                  <p><span className="font-semibold text-[#1c1c1d]">Headline:</span> {normalizedData.headline as string}</p>
                )}
                {(normalizedData.availability as string) && (
                  <p><span className="font-semibold text-[#1c1c1d]">Availability:</span> {normalizedData.availability as string}</p>
                )}
                {(normalizedData.skills as string[])?.length > 0 && (
                  <p><span className="font-semibold text-[#1c1c1d]">Skills:</span> {(normalizedData.skills as string[]).join(", ")}</p>
                )}
                {(normalizedData.needs as { description: string }[])?.length > 0 && (
                  <p><span className="font-semibold text-[#1c1c1d]">Needs:</span> {(normalizedData.needs as { description: string }[]).map((n) => n.description).join("; ")}</p>
                )}
              </div>
            </div>
          )}

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
