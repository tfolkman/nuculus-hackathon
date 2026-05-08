import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Users,
  Building2,
  Network,
  ShieldCheck,
  MessageSquare,
  BrainCircuit,
  Handshake,
  Zap,
  TrendingUp,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#dce6f0] bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0048bd]/5 via-transparent to-[#00a3e0]/5" />
        <div className="relative mx-auto max-w-7xl px-6 py-28 md:py-40">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#d49400]/10 px-4 py-1.5 text-sm font-bold text-[#d49400] border border-[#d49400]/20">
              <Sparkles className="h-4 w-4" />
              🏆 Hackathon Demo — Nucleus Utah AI Challenge
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#1c1c1d] md:text-6xl leading-[1.1]">
              Stop manually reviewing submissions once a week.
            </h1>
            <p className="mt-6 text-lg leading-8 text-[#5a5a5c] max-w-2xl">
              Nucleus Connect uses explainable AI to instantly match Utah&apos;s best
              operators, students, and advisors with the startups that need them.
              From 3 people + spreadsheets → AI-ranked matches in 3 seconds.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/intake"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0048bd] to-[#0066e0] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#0048bd]/20 transition hover:scale-[1.02] hover:shadow-xl"
              >
                Find Your Connection
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/staff"
                className="inline-flex items-center gap-2 rounded-xl border border-[#dce6f0] bg-white px-6 py-3 text-sm font-bold text-[#1c1c1d] transition hover:bg-[#f4fafe] hover:scale-[1.02]"
              >
                Staff Dashboard
              </Link>
            </div>
          </div>

          {/* Before/After Visual */}
          <div className="mt-16 grid gap-6 md:grid-cols-2 max-w-3xl">
            <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6">
              <div className="flex items-center gap-2 text-sm font-bold text-red-700 mb-3">
                <Zap className="h-4 w-4" />
                BEFORE
              </div>
              <div className="space-y-2 text-sm text-red-700/80">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-400" />
                  3 people manually review Typeform submissions
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-400" />
                  Once a week via spreadsheet
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-400" />
                  No scoring, no tracking, no transparency
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-400" />
                  Connections lost in inboxes
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-700 mb-3">
                <TrendingUp className="h-4 w-4" />
                WITH NUCLEUS CONNECT
              </div>
              <div className="space-y-2 text-sm text-emerald-700/80">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  AI scores matches across 8 dimensions instantly
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  Explainable results with evidence and gaps
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  Staff approve with one click
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  Auto-sync to Affinity CRM
                </div>
              </div>
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
              <div
                key={stat.label}
                className="flex items-center gap-3 rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0048bd]/10">
                  <stat.icon className="h-5 w-5 text-[#0048bd]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1c1c1d]">
                    {stat.value}
                  </div>
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
          <h2 className="text-3xl font-extrabold tracking-tight text-[#1c1c1d] md:text-4xl">
            How Nucleus Connect Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#5a5a5c] text-lg">
            From manual weekly review to real-time, explainable, staff-approved
            connections.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            {
              step: "01",
              icon: MessageSquare,
              title: "Describe your need",
              body: "Talent, startups, mentors, investors, or service providers describe what they're looking for in natural language. AI extracts structured signals instantly.",
            },
            {
              step: "02",
              icon: BrainCircuit,
              title: "AI scoring + explanation",
              body: "Hybrid scoring across 8 dimensions produces a match score with clear reasoning, evidence, and gap analysis. No black boxes.",
            },
            {
              step: "03",
              icon: Handshake,
              title: "Staff approves the intro",
              body: "Nucleus staff review AI recommendations, approve matches, and sync approved connections to Affinity CRM with full rationale.",
            },
          ].map((card) => (
            <div
              key={card.step}
              className="relative rounded-2xl bg-gradient-to-b from-white to-[#f4fafe]/50 p-8 shadow-sm border border-[#dce6f0] transition hover:shadow-md hover:-translate-y-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0048bd]/10 mb-4">
                <card.icon className="h-6 w-6 text-[#0048bd]" />
              </div>
              <div className="text-sm font-bold text-[#00a3e0]/40 uppercase tracking-wider">
                Step {card.step}
              </div>
              <h3 className="mt-2 text-xl font-bold text-[#1c1c1d]">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#5a5a5c]">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Demo CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-2xl bg-gradient-to-br from-[#0048bd] to-[#0066e0] p-10 text-center text-white shadow-xl">
          <h2 className="text-2xl font-extrabold md:text-3xl">
            Ready to explore the demo?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80 text-lg">
            Try the intake flow with 3 pre-built scenarios, view AI match results,
            and experience the staff approval dashboard with synthetic Utah data.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/intake"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#0048bd] shadow hover:bg-[#f4fafe] hover:scale-[1.02] transition"
            >
              Try Intake
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/staff"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 hover:scale-[1.02] transition"
            >
              View Staff Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
