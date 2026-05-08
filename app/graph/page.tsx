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
        <h1 className="text-3xl font-bold tracking-tight text-[#1c1c1d]">Utah Opportunity Graph</h1>
        <p className="mt-2 text-[#5a5a5c]">Explore Utah's innovation ecosystem by sector, institution, and stage.</p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as Entity["type"] | "all")}
          className="rounded-xl border border-[#dce6f0] bg-white px-3 py-2 text-sm text-[#1c1c1d] outline-none focus:ring-2 ring-[#00a3e0]"
        >
          <option value="all">All types</option>
          {Object.entries(typeMeta).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>

        <select
          value={filterSector}
          onChange={(e) => setFilterSector(e.target.value)}
          className="rounded-xl border border-[#dce6f0] bg-white px-3 py-2 text-sm text-[#1c1c1d] outline-none focus:ring-2 ring-[#00a3e0]"
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
            <div key={e.id} className="rounded-2xl border border-[#dce6f0] bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0048bd]/5">
                  <Meta.icon className="h-4 w-4 text-[#0048bd]" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#1c1c1d]">{e.name}</div>
                  <div className="text-xs text-[#5a5a5c]">{Meta.label} • {e.location}</div>
                </div>
              </div>
              <div className="mt-3 text-sm text-[#5a5a5c] line-clamp-2">{e.headline}</div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {e.sectors.slice(0, 3).map((s) => (
                  <span key={s} className="rounded-full bg-[#eef6fc] px-2 py-0.5 text-[10px] font-medium text-[#5a5a5c]">
                    {s.replace("_", " ")}
                  </span>
                ))}
                {e.tags.slice(0, 2).map((t) => (
                  <span key={t} className="rounded-full bg-[#00a3e0]/10 px-2 py-0.5 text-[10px] font-medium text-[#00a3e0]">
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
