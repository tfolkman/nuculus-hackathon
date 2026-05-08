import Link from "next/link";
import { ArrowRight, Sparkles, Users, Building2, Network, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#dce6f0] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#0048bd]/5 px-4 py-1.5 text-sm font-medium text-[#0048bd]">
              <Sparkles className="h-4 w-4" />
              Hackathon Prototype — Nucleus Utah AI Challenge
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#1c1c1d] md:text-6xl">
              Utah's Innovation Opportunity Graph
            </h1>
            <p className="mt-6 text-lg leading-8 text-[#5a5a5c]">
              Nucleus Connect turns Utah's fragmented innovation relationships into an explainable AI Opportunity Graph. AI prepares the best connections; Nucleus staff approves the relationship.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/intake"
                className="inline-flex items-center gap-2 rounded-xl bg-[#0048bd] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#0048bd]/20 transition hover:bg-[#0066e0]"
              >
                Find Your Connection
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/staff"
                className="inline-flex items-center gap-2 rounded-xl border border-[#dce6f0] bg-white px-6 py-3 text-sm font-bold text-[#1c1c1d] transition hover:bg-[#f4fafe]"
              >
                Staff Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="border-b border-[#dce6f0] bg-[#f4fafe]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Users, label: "Talent", value: "8+ operators" },
              { icon: Building2, label: "Startups", value: "6+ companies" },
              { icon: Network, label: "Mentors/SMEs", value: "5+ advisors" },
              { icon: ShieldCheck, label: "Match Quality", value: "Explainable AI" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
                <stat.icon className="h-5 w-5 text-[#00a3e0]" />
                <div>
                  <div className="text-sm font-bold text-[#1c1c1d]">{stat.value}</div>
                  <div className="text-xs text-[#5a5a5c]">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#1c1c1d]">How Nucleus Connect Works</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#5a5a5c]">
            From manual weekly review to real-time, explainable, staff-approved connections.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            { step: "01", title: "Describe your need", body: "Talent, startups, mentors, investors, or service providers describe what they're looking for in natural language." },
            { step: "02", title: "AI scoring + explanation", body: "Hybrid scoring across 8 dimensions produces a match score with clear reasoning, evidence, and gaps." },
            { step: "03", title: "Staff approves the intro", body: "Nucleus staff review AI recommendations, approve matches, and sync approved connections to Affinity CRM." },
          ].map((card) => (
            <div key={card.step} className="relative rounded-2xl bg-white p-6 shadow-sm border border-[#dce6f0]">
              <div className="text-2xl font-bold text-[#00a3e0]/20">{card.step}</div>
              <h3 className="mt-2 text-lg font-bold text-[#1c1c1d]">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5a5a5c]">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Demo CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-2xl bg-[#0048bd] p-10 text-center text-white shadow-xl">
          <h2 className="text-2xl font-extrabold md:text-3xl">Ready to explore the demo?</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Try the intake flow, view AI match results, and experience the staff approval dashboard with synthetic Utah data.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/intake"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#0048bd] shadow hover:bg-[#f4fafe]"
            >
              Try Intake
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/staff"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
            >
              View Staff Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
