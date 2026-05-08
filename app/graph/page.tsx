"use client";

import { useMemo, useState } from "react";
import { Entity } from "@/lib/types";
import { seedEntities } from "@/lib/data/seed-entities";
import { Building2, Users, GraduationCap, Lightbulb, Briefcase, HandCoins, Wrench, Layers } from "lucide-react";

const typeMeta: Record<Entity["type"], { label: string; icon: typeof Building2 }> = {
  talent: { label: "Talent", icon: Users },
  startup: { label: "Startups", icon: Building2 },
  research_project: { label: "Research", icon: GraduationCap },
  mentor: { label: "Mentors", icon: Lightbulb },
  subject_matter_expert: { label: "SMEs", icon: Briefcase },
  investor: { label: "Investors", icon: HandCoins },
  service_provider: { label: "Providers", icon: Wrench },
  program: { label: "Programs", icon: Layers },
};

const sectors = [
  "life_sciences", "ai", "defense_aerospace", "cyber", "energy", "advanced_manufacturing", "fintech", "software", "cleantech", "other",
];

export default function GraphPage() {
  const [filterType, setFilterType] = useState<Entity["type"] | "all">("all");
  const [filterSector, setFilterSector] = useState<string>("all");

  const filtered = useMemo(() => {
    return seedEntities.filter((e) => {
      if (filterType !== "all" && e.type !== filterType) return false;
      if (filterSector !== "all" && !e.sectors.includes(filterSector as any)) return false;
      return true;
    });
  }, [filterType, filterSector]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#0f172a]">Utah Opportunity Graph</h1>
        <p className="mt-2 text-[#64748b]">Explore Utah's innovation ecosystem by sector, institution, and stage.</p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as Entity["type"] | "all")}
          className="rounded-xl border border-[#e2e8f0] bg-white px-3 py-2 text-sm text-[#0f172a] outline-none focus:ring-2 ring-[#06b6d4]"
        >
          <option value="all">All types</option>
          {Object.entries(typeMeta).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>

        <select
          value={filterSector}
          onChange={(e) => setFilterSector(e.target.value)}
          className="rounded-xl border border-[#e2e8f0] bg-white px-3 py-2 text-sm text-[#0f172a] outline-none focus:ring-2 ring-[#06b6d4]"
        >
          <option value="all">All sectors</option>
          {sectors.map((s) => (
            <option key={s} value={s}>{s.replace("_", " ")}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((e) => {
          const Meta = typeMeta[e.type];
          return (
            <div key={e.id} className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1e3a5f]/5">
                  <Meta.icon className="h-4 w-4 text-[#1e3a5f]" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#0f172a]">{e.name}</div>
                  <div className="text-xs text-[#64748b]">{Meta.label} • {e.location}</div>
                </div>
              </div>
              <div className="mt-3 text-sm text-[#64748b] line-clamp-2">{e.headline}</div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {e.sectors.slice(0, 3).map((s) => (
                  <span key={s} className="rounded-full bg-[#f1f5f9] px-2 py-0.5 text-[10px] font-medium text-[#64748b]">
                    {s.replace("_", " ")}
                  </span>
                ))}
                {e.tags.slice(0, 2).map((t) => (
                  <span key={t} className="rounded-full bg-[#06b6d4]/10 px-2 py-0.5 text-[10px] font-medium text-[#06b6d4]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
