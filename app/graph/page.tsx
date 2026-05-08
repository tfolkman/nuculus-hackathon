"use client";

import { useMemo, useState } from "react";
import { Entity } from "@/lib/types";
import { seedEntities } from "@/lib/data/seed-entities";
import {
  Building2,
  Users,
  GraduationCap,
  Lightbulb,
  Briefcase,
  HandCoins,
  Wrench,
  Layers,
  MapPin,
  Sparkles,
} from "lucide-react";

const typeMeta: Record<
  Entity["type"],
  { label: string; icon: typeof Building2; color: string }
> = {
  talent: { label: "Talent", icon: Users, color: "bg-[#0048bd]/10 text-[#0048bd]" },
  startup: { label: "Startups", icon: Building2, color: "bg-emerald-50 text-emerald-600" },
  research_project: { label: "Research", icon: GraduationCap, color: "bg-purple-50 text-purple-600" },
  mentor: { label: "Mentors", icon: Lightbulb, color: "bg-amber-50 text-amber-600" },
  subject_matter_expert: { label: "SMEs", icon: Briefcase, color: "bg-cyan-50 text-cyan-600" },
  investor: { label: "Investors", icon: HandCoins, color: "bg-green-50 text-green-600" },
  service_provider: { label: "Providers", icon: Wrench, color: "bg-rose-50 text-rose-600" },
  program: { label: "Programs", icon: Layers, color: "bg-indigo-50 text-indigo-600" },
};

const sectors = [
  "life_sciences",
  "ai",
  "defense_aerospace",
  "cyber",
  "energy",
  "advanced_manufacturing",
  "fintech",
  "software",
  "cleantech",
  "other",
];

export default function GraphPage() {
  const [filterType, setFilterType] = useState<Entity["type"] | "all">("all");
  const [filterSector, setFilterSector] = useState<string>("all");

  const filtered = useMemo(() => {
    return seedEntities.filter((e) => {
      if (filterType !== "all" && e.type !== filterType) return false;
      if (filterSector !== "all" && !e.sectors.includes(filterSector as any))
        return false;
      return true;
    });
  }, [filterType, filterSector]);

  const stats = useMemo(() => {
    return {
      total: seedEntities.length,
      talent: seedEntities.filter((e) => e.type === "talent").length,
      startups: seedEntities.filter((e) => e.type === "startup").length,
      investors: seedEntities.filter((e) => e.type === "investor").length,
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#1c1c1d] md:text-4xl">
          Utah Opportunity Graph
        </h1>
        <p className="mt-2 text-[#5a5a5c] text-lg">
          Explore Utah's innovation ecosystem by sector, institution, and stage.
        </p>
      </div>

      {/* Stats Banner */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl bg-white border border-[#dce6f0] p-4 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-[#8a8a8c]">
            Total Entities
          </div>
          <div className="mt-1 text-2xl font-bold text-[#1c1c1d]">{stats.total}</div>
        </div>
        <div className="rounded-xl bg-[#0048bd]/5 border border-[#0048bd]/10 p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-[#0048bd]">
            Talent
          </div>
          <div className="mt-1 text-2xl font-bold text-[#0048bd]">{stats.talent}</div>
        </div>
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Startups
          </div>
          <div className="mt-1 text-2xl font-bold text-emerald-700">{stats.startups}</div>
        </div>
        <div className="rounded-xl bg-green-50 border border-green-200 p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-green-600">
            Investors
          </div>
          <div className="mt-1 text-2xl font-bold text-green-700">{stats.investors}</div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as Entity["type"] | "all")}
          className="rounded-xl border border-[#dce6f0] bg-white px-3 py-2 text-sm text-[#1c1c1d] outline-none focus:ring-2 ring-[#00a3e0]"
        >
          <option value="all">All types</option>
          {Object.entries(typeMeta).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </select>

        <select
          value={filterSector}
          onChange={(e) => setFilterSector(e.target.value)}
          className="rounded-xl border border-[#dce6f0] bg-white px-3 py-2 text-sm text-[#1c1c1d] outline-none focus:ring-2 ring-[#00a3e0]"
        >
          <option value="all">All sectors</option>
          {sectors.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>

        <div className="text-sm text-[#5a5a5c]">
          Showing <span className="font-bold text-[#1c1c1d]">{filtered.length}</span> of{" "}
          {seedEntities.length} entities
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((e) => {
          const Meta = typeMeta[e.type];
          return (
            <div
              key={e.id}
              className="rounded-2xl border border-[#dce6f0] bg-white p-5 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${Meta.color}`}
                >
                  <Meta.icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1c1c1d]">{e.name}</div>
                  <div className="text-xs text-[#5a5a5c] flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {Meta.label} • {e.location}
                  </div>
                </div>
              </div>
              <div className="mt-3 text-sm text-[#5a5a5c] line-clamp-2">
                {e.headline}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {e.sectors.slice(0, 3).map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-[#eef6fc] px-2 py-0.5 text-[10px] font-medium text-[#5a5a5c]"
                  >
                    {s.replace("_", " ")}
                  </span>
                ))}
                {e.tags.slice(0, 2).map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-[#00a3e0]/10 px-2 py-0.5 text-[10px] font-medium text-[#00a3e0]"
                  >
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
