# Nucleus Connect Design Spec

**Date:** 2026-05-08  
**Project:** Nucleus Utah Hackathon — AI-powered matching platform  
**Primary goal:** Win the $5,000 Nucleus Utah prize by presenting a production-minded, polished prototype that directly solves Nucleus’s manual Connections Hub matching workflow.

---

## 1. Executive Summary

Nucleus Connect is an AI-powered Utah Opportunity Graph and staff-reviewed matching engine for the Nucleus Institute’s existing Connections Hub.

The product is not a generic job board. It is a connection operating system for Utah’s innovation ecosystem. It helps Nucleus intake talent, mentors, subject-matter experts, investors, service providers, startups, and university research teams; normalize their profiles; discover high-fit matches; explain why each match matters; and route approved connections back into Affinity CRM.

The prototype should optimize for judge impact across the official criteria:

| Criterion | Weight | Product response |
| --- | ---: | --- |
| User Experience | 40% | Polished onboarding, clear match explanations, staff review workflow, trust-building UI |
| Match Quality & Intelligence | 30% | Hybrid scoring: structured filters, Utah ecosystem signals, embeddings, LLM explanations, gap analysis |
| Integration | 20% | Squarespace entry point, Typeform/webhook compatibility, Affinity API adapter, CRM-as-system-of-record model |
| Innovation & Creativity | 10% | Utah Opportunity Graph, public-data enrichment, cross-network matching beyond talent/jobs |

The demo should make one idea obvious: Nucleus can move from “three people manually review submissions once a week” to “AI prepares the best connections immediately, and staff approves the human relationship.”

---

## 2. Source Inputs

This spec is based on:

- `AGENTS.md` mission and judging emphasis.
- `paramaters.md` official challenge brief.
- `kickoffnotes.md` meeting transcript.
- Nucleus website review, especially:
  - Home page: Utah universities, industry leaders, entrepreneurs, policymakers, talent, research, enterprise.
  - Contact page: Connections Hub with Operator, Mentor, Subject-Matter Expert, Venture, Service Provider networks.
  - Programs page: Nucleus Fund, Nucleus Grow, MarketEdge, UTIF context.
- Integration research:
  - Affinity API supports people, organizations, list entries, field values, notes, and webhooks. Affinity should remain the system of record.
  - Squarespace can route users to an embedded or linked custom app via custom code, iframe, or CTA.
  - Typeform can remain as an intake source through webhook/response ingestion.
  - OpenAI-style embeddings plus structured scoring and LLM-generated explanations are a credible production AI matching pattern.
  - Supabase/Postgres with pgvector is a practical production data layer for vector search.

---

## 3. Core Problem

Nucleus is already a trusted connector in Utah’s innovation economy, but the operational workflow is manual.

Current state:

1. Users visit the Squarespace Connections Hub.
2. Users select one of several network forms.
3. Form submissions flow into Affinity CRM.
4. A small Nucleus team reviews submissions periodically.
5. Staff manually reasons about who should meet whom.
6. Staff manually reaches out to make introductions.

Pain points:

- Matching is slow because review happens manually and periodically.
- Match quality depends on staff memory and availability.
- The CRM contains useful relationship data, but there is no intelligent matching layer.
- Users may not know what opportunities, startups, research projects, mentors, investors, or providers exist.
- Too much intake friction reduces completion.
- A generic LinkedIn/job-board approach does not model Utah-specific commercialization needs.

---

## 4. Product Thesis

The winning product should be framed as:

> **Nucleus Connect turns Utah’s fragmented innovation relationships into an explainable AI Opportunity Graph, then helps Nucleus staff approve high-trust introductions.**

Key positioning:

- **Connection graph, not job board:** The app matches people, startups, investors, research teams, mentors, SMEs, service providers, and programs.
- **Human-in-the-loop:** AI recommends; Nucleus approves. This preserves trust and avoids reckless auto-introductions.
- **Utah-native:** The ontology, scoring, seed data, public-data sources, and demo examples are anchored in Utah’s universities, sectors, and commercialization programs.
- **Integration-first:** The app enhances Squarespace, Typeform, and Affinity rather than replacing them.

---

## 5. Target Users

### 5.1 External Users

External users need quick, low-friction intake and useful feedback.

Supported user types:

1. **Executives / operators**
   - Co-founder, CEO, COO, CFO, CMO, commercialization lead, fractional executive.
2. **Functional operators**
   - Engineering, sales, marketing, product, operations, regulatory, finance.
3. **Students / interns**
   - Undergraduate, graduate, MBA, PhD, soon-to-graduate talent.
4. **Board members / advisors / mentors**
   - Formal advisors for equity or cash; informal mentors for free.
5. **Subject-matter experts**
   - AI, energy, life sciences, aerospace/defense, cyber, advanced manufacturing, fintech, software, regulatory, SBIR/STTR.
6. **Investors**
   - Utah angels, Utah VCs, out-of-state VCs interested in Utah deep tech.
7. **Service providers**
   - Legal, IP, regulatory, finance, grant writing, product, design, marketing, manufacturing, go-to-market.
8. **Startup / research teams**
   - University spinouts, bootstrapped startups, Nucleus portfolio companies, companies seeking talent, investors, advisors, providers, or funding support.

### 5.2 Internal Users

Internal users are the Nucleus staff members who manage connections.

They need:

- A queue of new intakes.
- AI-normalized summaries.
- Ranked match recommendations.
- Explanation, evidence, gaps, risks, and suggested intro language.
- Approval/reject/hold workflows.
- Affinity sync status.
- A way to see the broader Utah Opportunity Graph by sector, stage, university, and role need.

---

## 6. Product Scope for the Hackathon Prototype

### 6.1 Must-Have Demo Capabilities

The prototype must demonstrate:

1. **Landing page / value proposition**
   - Clear Nucleus-branded explanation of the platform.
   - Calls to action for “Find connections” and “Staff dashboard.”

2. **Low-friction intake**
   - User selects a profile type.
   - User can describe themselves or their need in natural language.
   - Structured fields capture the challenge-required profile attributes.
   - The app shows that AI can enrich or normalize the input.

3. **Dual-sided and multi-sided profiles**
   - Talent profiles include skills, industry/domain expertise, stage preference, availability, risk tolerance, mission alignment.
   - Startup profiles include technology domain, origin, commercialization/funding stage, immediate needs, funding status.
   - Extended Nucleus profiles include mentor, SME, investor, service provider, and program context.

4. **AI match results**
   - Ranked matches with score.
   - “Why this match” explanation.
   - Evidence signals.
   - Risks/gaps.
   - Suggested next step.
   - Upskilling or preparation recommendation when relevant.

5. **Staff review workflow**
   - Dashboard queue for new submissions.
   - Match detail view.
   - Approve/reject/hold controls.
   - Generated intro email.
   - CRM sync status.

6. **Utah Opportunity Graph**
   - Visual or card-based map of Utah sectors, universities, startups/research, capital, mentors, SMEs, and service providers.
   - Filter by sector, university origin, stage, and connection type.
   - Shows “what is available” beyond individual job listings.

7. **Integration story**
   - Squarespace embed/link route.
   - Typeform webhook compatibility route.
   - Affinity adapter that can run in mock mode for demo and real mode with API key/config.
   - Visible audit trail showing what would be written to Affinity.

8. **Example match scenarios**
   - Executive → deep tech startup.
   - Student → research spinout.
   - Operator or SME/service provider/investor → scaling company.

### 6.2 Non-Goals for the Hackathon Prototype

These are intentionally out of scope for the 12-hour build:

- Real user authentication beyond a demo-safe staff/user route split.
- Full Affinity OAuth or admin setup UI.
- Production billing, notification delivery, or email sending.
- Scraping private or sensitive data.
- Replacing Affinity CRM.
- Replacing the Nucleus website.
- Fully automated introductions without staff approval.

---

## 7. Information Architecture

The app should have these primary routes:

1. `/`
   - Public landing page.
   - Explains Nucleus Connect.
   - Provides demo CTAs.

2. `/intake`
   - External user profile/need intake.
   - Supports role selection and natural-language description.

3. `/matches`
   - User-facing match result preview after intake.
   - Shows transparent explanations and trust-building language.

4. `/staff`
   - Internal dashboard.
   - Queue of new intakes and match recommendations.

5. `/staff/matches/[id]`
   - Detailed staff review page.
   - Approve/reject/hold, intro draft, Affinity sync payload.

6. `/graph`
   - Utah Opportunity Graph.
   - Explore entities by sector, institution, stage, network type, and need.

7. `/integrations`
   - Demo integration console.
   - Shows Squarespace embed snippet, Typeform webhook endpoint, Affinity sync events, and mock/real mode.

8. `/api/typeform/webhook`
   - Receives Typeform-style submissions.
   - Normalizes submission into internal profile schema.

9. `/api/affinity/sync`
   - Creates/updates mock or real Affinity records.
   - Stores sync event status.

10. `/api/match`
   - Runs matching for a selected intake/profile.
   - Uses deterministic scoring with optional AI explanation provider.

---

## 8. UX Principles

### 8.1 Keep Intake Fast

The transcript emphasized that too many clicks or too much required information will reduce usage. Intake should feel lightweight.

Design rules:

- First screen asks: “What connection are you looking for?”
- Natural-language box is prominent.
- Structured fields are progressive and mostly optional.
- Required fields are limited to name, email, profile type, and primary goal for demo.
- AI normalization preview tells users, “We extracted these signals from your description.”

### 8.2 Build Trust Through Explanation

Every match should explain:

- Why the match is relevant.
- Which user/startup signals drove the match.
- Which Utah-specific signals matter.
- What is missing or uncertain.
- Whether staff review is required.

Avoid black-box language. Use plain English and evidence chips.

### 8.3 Staff Are the Final Connectors

The interface should reinforce:

- Nucleus staff remain in control.
- AI accelerates research and triage.
- Approved intros become relationship actions in Affinity.

### 8.4 Make Utah Visible

Utah specificity should not be buried in copy. It should appear in:

- Sector filters.
- University-origin badges.
- Nucleus program badges.
- Public funding/research signal chips.
- Example profiles and scenarios.
- Opportunity Graph sections.

---

## 9. Visual Direction

The UI should feel like a natural extension of the Nucleus website while being more modern and product-oriented.

Observed Nucleus design cues:

- Clean editorial layout.
- Large mission-driven headings.
- Poppins and Manrope typography references.
- Innovation/collaboration language.
- Professional, institutional trust tone.

Prototype visual system:

- Font stack: Manrope or Inter fallback, with Poppins-style headings if easy.
- Background: warm off-white or very light slate.
- Primary color: deep Nucleus blue.
- Accent colors: electric blue/cyan, sage/green for positive signals, amber for gaps.
- Cards: rounded, shadow-light, spacious.
- Badges: sector, stage, institution, network type, confidence.
- Data visualization: simple graph/list hybrid rather than complex canvas if time is limited.

Key screens must look polished because UX is 40% of judging.

---

## 10. Data Model

The data model should support multi-sided matching while remaining simple enough for the hackathon.

### 10.1 Core Entity

All matchable records are entities.

```ts
type EntityType =
  | 'talent'
  | 'startup'
  | 'research_project'
  | 'mentor'
  | 'subject_matter_expert'
  | 'investor'
  | 'service_provider'
  | 'program';

type Entity = {
  id: string;
  type: EntityType;
  name: string;
  headline: string;
  summary: string;
  location: string;
  sectors: Sector[];
  institutionAffiliations: Institution[];
  stagePreferences: Stage[];
  availability?: Availability;
  riskTolerance?: RiskTolerance;
  missionInterests: string[];
  skills: string[];
  expertise: string[];
  needs: Need[];
  offers: Offer[];
  fundingStatus?: FundingStatus;
  origin?: Origin;
  trl?: number;
  tags: string[];
  publicSignals: PublicSignal[];
  affinity?: AffinityReference;
  createdAt: string;
  updatedAt: string;
};
```

### 10.2 Sector

```ts
type Sector =
  | 'life_sciences'
  | 'ai'
  | 'defense_aerospace'
  | 'cyber'
  | 'energy'
  | 'advanced_manufacturing'
  | 'fintech'
  | 'software'
  | 'cleantech'
  | 'other';
```

### 10.3 Institution

```ts
type Institution =
  | 'university_of_utah'
  | 'brigham_young_university'
  | 'utah_state_university'
  | 'utah_valley_university'
  | 'weber_state_university'
  | 'utah_tech_university'
  | 'southern_utah_university'
  | 'salt_lake_community_college'
  | 'none'
  | 'out_of_state';
```

### 10.4 Stage

```ts
type Stage =
  | 'idea'
  | 'research'
  | 'prototype'
  | 'pre_seed'
  | 'seed'
  | 'series_a'
  | 'growth'
  | 'commercialization'
  | 'sbir_phase_i'
  | 'sbir_phase_ii';
```

### 10.5 Match Record

```ts
type Match = {
  id: string;
  sourceEntityId: string;
  targetEntityId: string;
  score: number;
  confidence: 'low' | 'medium' | 'high';
  status: 'suggested' | 'approved' | 'rejected' | 'held' | 'introduced';
  reasons: MatchReason[];
  evidence: EvidenceSignal[];
  gaps: MatchGap[];
  suggestedIntro: string;
  nextBestAction: string;
  createdAt: string;
  reviewedAt?: string;
  reviewer?: string;
  affinitySyncStatus: 'not_synced' | 'mock_synced' | 'synced' | 'failed';
};
```

---

## 11. AI Matching Approach

The matching system should be described as production-ready even if the prototype uses seeded data and demo-safe fallbacks.

### 11.1 Hybrid Matching Pipeline

1. **Normalize intake**
   - Convert natural-language descriptions into structured fields.
   - Extract skills, sectors, stage, availability, needs, offers, risk tolerance, and mission interests.

2. **Candidate retrieval**
   - Use hard filters for incompatible cases.
   - Use structured scoring to find likely matches.
   - Use vector similarity for semantic fit when embeddings are available.

3. **Scoring**
   - Combine structured score, semantic score, Utah ecosystem score, availability/stage fit, and relationship/context score.

4. **Reranking and explanation**
   - Generate match rationale, evidence, risks, gaps, and suggested next action.
   - Use deterministic fallback explanations if no LLM key is configured.

5. **Staff review**
   - AI recommendations are routed to staff.
   - Staff approves, rejects, holds, or edits intro.

### 11.2 Scoring Formula

Prototype scoring should be explicit and explainable:

```ts
type ScoreBreakdown = {
  sectorFit: number;        // 0-20
  roleNeedFit: number;      // 0-20
  stageFit: number;         // 0-15
  skillExpertiseFit: number;// 0-15
  availabilityFit: number;  // 0-10
  utahContextFit: number;   // 0-10
  missionFit: number;       // 0-5
  networkLeverage: number;  // 0-5
};
```

Total score is the sum of the eight components. Each match card should show top drivers rather than exposing all math by default.

### 11.3 Utah Context Signals

Utah-specific signals should influence matches:

- Utah university affiliation or origin.
- Alignment with Nucleus focus sectors.
- Fit with Nucleus programs: Nucleus Fund, Nucleus Grow, MarketEdge, UTIF, SBIR/STTR support.
- Utah location or willingness to engage in Utah.
- Rural/northern/southern Utah relevance where applicable.
- Utah investor interest or prior Utah startup experience.
- Commercialization needs common in university spinouts: regulatory, customer discovery, grant funding, IP/licensing, first sales, manufacturing scale-up.

### 11.4 Explainability Requirements

Every match explanation should include:

- **Top reasons:** 2-4 concise bullets.
- **Evidence:** tagged fields or public signals that support the match.
- **Gaps:** missing information or possible mismatch.
- **Suggested intro:** staff-editable email or note.
- **Next best action:** such as “approve intro,” “ask for availability,” “route to MarketEdge,” or “recommend SBIR advisor.”

Example explanation:

> Sarah is a strong match for HelioGrid because she has scaled energy hardware from prototype to first municipal customers, prefers fractional COO roles, and has Utah State energy network ties. The main gap is that HelioGrid has not confirmed budget for a paid fractional role, so Nucleus should frame this as an exploratory advisor/operator conversation first.

---

## 12. Public Data and Enrichment Strategy

The kickoff transcript explicitly challenged teams to discover useful public data. The prototype should include a credible public-data roadmap and a small seeded representation.

### 12.1 Public Sources to Reference

Potential sources:

- University tech transfer/licensing pages:
  - University of Utah Technology Licensing Office.
  - BYU Technology Transfer.
  - Utah State University Technology Transfer.
- NIH RePORTER API for life sciences research funding signals.
- NSF award search for university research projects.
- SBIR/STTR public award and solicitation sources.
- Nucleus program pages: Nucleus Fund, Nucleus Grow, MarketEdge, UTIF.
- Public startup websites and press releases.
- Public investor thesis pages.
- Event/program data such as Boost, State of Innovation, and Nucleus workshops.

### 12.2 Prototype Enrichment

The hackathon prototype should seed a compact synthetic dataset that looks like public enrichment:

- Research project: University of Utah medical device spinout with NIH signal.
- Research project: BYU AI manufacturing optimization project with NSF-like signal.
- Startup: USU energy hardware company with SBIR/STTR relevance.
- Investor: out-of-state deep tech fund interested in Utah university spinouts.
- Service provider: Utah regulatory/IP/grant writing provider.

Each seeded entity should include `publicSignals` with fields:

```ts
type PublicSignal = {
  source: 'nucleus' | 'university' | 'nih_reporter' | 'nsf' | 'sbir' | 'company_website' | 'manual_seed';
  label: string;
  url?: string;
  observedAt: string;
  summary: string;
};
```

---

## 13. Integration Design

### 13.1 Squarespace

Nucleus currently uses Squarespace. The prototype should show three compatible integration paths:

1. **Primary launch path:** Add a “Find Your Connection” CTA on the existing Contact/Connections Hub page linking to the app.
2. **Embedded path:** Embed the intake route in a Squarespace page using an iframe or custom-code block.
3. **Progressive path:** Keep current Connections Hub copy and replace individual Typeform links over time with Nucleus Connect intake links.

Demo artifact:

```html
<iframe
  src="https://nucleus-connect.example.com/intake?source=squarespace"
  width="100%"
  height="820"
  style="border:0;border-radius:16px;overflow:hidden;"
  title="Nucleus Connect Intake"
></iframe>
```

### 13.2 Typeform

Nucleus may keep Typeform in the near term. The app should support Typeform-style webhook ingestion.

Flow:

1. User submits existing Typeform.
2. Typeform sends webhook to `/api/typeform/webhook`.
3. Adapter maps answers into the internal `Entity` schema.
4. Matching runs.
5. Staff dashboard shows the new intake and AI recommendations.
6. Affinity sync writes normalized fields and match status.

### 13.3 Affinity

Affinity should remain the CRM system of record.

Supported production operations:

- Search/create person for talent, mentor, investor, SME, provider contacts.
- Search/create organization for startup, investor fund, service provider company.
- Add person or organization to a configured Affinity list.
- Write field values such as sector, profile type, availability, stage, AI summary, match score, match status, and source.
- Create notes containing match rationale and suggested intro.
- Listen to Affinity webhooks for CRM-side updates in a later phase.

Prototype behavior:

- Use a mock Affinity adapter by default.
- Display the exact payload that would be sent to Affinity.
- Support environment variables for real API mode if time and keys are available.

Suggested Affinity lists:

- `Nucleus Connect - Talent`
- `Nucleus Connect - Startups`
- `Nucleus Connect - Mentors`
- `Nucleus Connect - SMEs`
- `Nucleus Connect - Investors`
- `Nucleus Connect - Service Providers`
- `Nucleus Connect - Match Queue`

Suggested Affinity fields:

- `Nucleus Profile Type`
- `Nucleus Sector Focus`
- `Nucleus Stage Preference`
- `Nucleus Availability`
- `Nucleus Risk Tolerance`
- `Nucleus Immediate Needs`
- `Nucleus AI Summary`
- `Nucleus Top Match IDs`
- `Nucleus Match Score`
- `Nucleus Match Status`
- `Nucleus Source`

---

## 14. Demo Dataset

The prototype should use synthetic but realistic Utah profiles. No proprietary or sensitive data should be used.

### 14.1 Required Demo Scenarios

#### Scenario 1: Executive → Deep Tech Startup

Source:

- Talent: Sarah Chen, fractional COO/commercialization executive.
- Background: scaled FDA-adjacent hardware, commercialization, first enterprise customers.
- Preference: fractional or advisory role, pre-seed/seed, Utah life sciences or energy.

Target:

- Startup: NeuroShield Diagnostics.
- Origin: University of Utah research lab.
- Sector: life sciences + AI.
- Need: commercialization COO, regulatory strategy, first hospital pilots.

Expected explanation:

- Strong sector and commercialization fit.
- University spinout experience is relevant.
- Fractional availability matches startup budget.
- Gap: confirm regulatory depth and compensation expectations.

#### Scenario 2: Student → Research Spinout

Source:

- Talent: Diego Morales, BYU/UVU student or graduate student.
- Skills: Python, computer vision, manufacturing analytics.
- Preference: internship or first operator role.

Target:

- Startup/research project: ForgeVision AI.
- Origin: BYU advanced manufacturing research.
- Sector: AI + advanced manufacturing.
- Need: ML intern for defect detection prototype.

Expected explanation:

- Direct skill fit.
- Student availability matches internship need.
- Utah university ecosystem fit.
- Gap: needs mentorship and clear project scope.

#### Scenario 3: Operator/SME/Provider → Scaling Company

Source:

- SME/service provider: Rachel Kim, SBIR/STTR grant strategist and defense commercialization advisor.
- Expertise: DoD SBIR, aerospace/defense, non-dilutive funding.

Target:

- Startup: AeroGrid Systems.
- Origin: Utah State University engineering team.
- Sector: defense/aerospace + energy.
- Need: SBIR Phase II strategy and defense customer discovery.

Expected explanation:

- Strong SBIR/STTR fit.
- Defense commercialization expertise aligns with sector.
- Utah/Nucleus Grow/UTIF relevance.
- Gap: confirm whether the company needs grant strategy, advisor role, or paid service provider engagement.

### 14.2 Additional Seed Entities

Include enough entities to make the dashboard and graph feel alive:

- 8-12 talent/operator profiles.
- 6-8 startup/research profiles.
- 4-6 mentors/SMEs.
- 3-4 investors.
- 3-4 service providers.
- 3-4 Nucleus programs/resources.

---

## 15. Staff Workflow

The staff dashboard is the most important demo screen after intake.

### 15.1 Queue View

Cards should show:

- New intake name.
- Profile type.
- Primary ask/offer.
- Sector tags.
- Best match score.
- Status.
- Source: Squarespace, Typeform, manual, public import.

Statuses:

- `New`
- `AI matched`
- `Needs review`
- `Approved`
- `Introduced`
- `Held`
- `Rejected`

### 15.2 Match Detail View

Sections:

1. Intake summary.
2. AI-normalized profile.
3. Ranked match list.
4. Selected match explanation.
5. Risk/gap assessment.
6. Suggested intro email.
7. Affinity sync preview.
8. Staff decision controls.

### 15.3 Approval Flow

When staff clicks Approve:

1. Match status changes to `approved`.
2. Intro draft is generated or revealed.
3. Affinity mock sync event is created.
4. UI shows a success state: “Approved and queued for intro.”

---

## 16. Error Handling and Trust States

The prototype should show production thinking through clear states.

### 16.1 Low Confidence Match

If score is below 65:

- Label confidence as low or medium.
- Show gaps prominently.
- Recommend more profile information or staff research.

### 16.2 Missing Data

If a required matching signal is missing:

- Do not fail the match.
- Show “Unknown” or “Needs confirmation.”
- Add a next best action such as “Ask for availability” or “Confirm funding stage.”

### 16.3 Integration Failure

If Affinity sync fails:

- Keep match status locally.
- Show failure reason.
- Provide retry option.
- Keep payload visible for manual fallback.

### 16.4 AI Provider Unavailable

If no AI API key is configured:

- Use deterministic scoring and templated explanations.
- Display demo mode indicator in integration console.
- Keep the product fully demoable.

---

## 17. Security, Privacy, and Data Handling

Even in a hackathon, the design should communicate responsible data practices.

Requirements:

- Use synthetic data for demo.
- Do not store proprietary/sensitive personal data.
- Store only the information users submit or public signals imported from public sources.
- Keep AI-generated recommendations marked as recommendations, not facts.
- Require staff approval before introductions.
- Provide audit trail for match decisions and CRM sync events.
- Keep Affinity API keys server-side only.
- Avoid exposing secret values in the browser.

---

## 18. Technical Architecture

### 18.1 Recommended Stack

- **App framework:** Next.js with App Router.
- **Language:** TypeScript.
- **Styling:** Tailwind CSS with polished custom components.
- **UI components:** shadcn-style primitives if setup time allows; otherwise hand-built accessible components.
- **Database:** Supabase/Postgres for production path; local seeded data for demo reliability.
- **Vector search:** pgvector-ready schema; deterministic local semantic scoring fallback.
- **AI:** OpenAI-compatible provider for embeddings and explanations; fallback templates.
- **Validation:** Zod schemas.
- **Testing:** Vitest for matching/scoring logic; Playwright or smoke script if time allows.
- **Deployment:** Vercel preferred for Next.js speed.

### 18.2 Application Layers

1. **UI layer**
   - Route pages and components.
   - Cards, badges, match explanations, dashboards.

2. **Domain layer**
   - Entity schema.
   - Match schema.
   - Scoring functions.
   - Explanation builder.

3. **Data layer**
   - Seeded synthetic data.
   - Repository functions for entities, matches, sync events.
   - Later Supabase implementation.

4. **AI layer**
   - Intake normalization.
   - Embedding provider.
   - Match explanation provider.
   - Deterministic fallback provider.

5. **Integration layer**
   - Affinity adapter.
   - Typeform adapter.
   - Squarespace embed docs/snippet.

---

## 19. Recommended File/Module Structure

```text
app/
  page.tsx
  intake/page.tsx
  matches/page.tsx
  graph/page.tsx
  integrations/page.tsx
  staff/page.tsx
  staff/matches/[id]/page.tsx
  api/match/route.ts
  api/typeform/webhook/route.ts
  api/affinity/sync/route.ts
components/
  app-shell.tsx
  badge.tsx
  button.tsx
  card.tsx
  entity-card.tsx
  intake-form.tsx
  match-card.tsx
  match-explanation.tsx
  opportunity-graph.tsx
  score-breakdown.tsx
  staff-queue.tsx
lib/
  affinity/
    affinity-adapter.ts
    mock-affinity-adapter.ts
    real-affinity-adapter.ts
    types.ts
  ai/
    explanation-provider.ts
    intake-normalizer.ts
    deterministic-explanations.ts
  data/
    seed-entities.ts
    seed-matches.ts
    repository.ts
  matching/
    score.ts
    rank.ts
    explain.ts
    types.ts
  typeform/
    typeform-adapter.ts
  utah/
    ontology.ts
    public-signals.ts
  validation/
    schemas.ts
```

---

## 20. Prototype Success Criteria

The prototype is successful if a judge can understand these points within five minutes:

1. Nucleus Connect solves the exact manual workflow described in the kickoff.
2. It is easier and more trustworthy than a job board.
3. It explains every match in plain English.
4. It is Utah-specific in sectors, universities, programs, and examples.
5. It integrates with Squarespace and Affinity rather than asking Nucleus to replace its stack.
6. It supports the current Connections Hub networks, not only talent and startups.
7. It shows realistic example matches.
8. It has a credible path from demo to production.

---

## 21. Presentation Narrative

Recommended demo script:

1. **Open with pain**
   - “Today, three Nucleus staff members manually review submissions and decide who should meet whom.”

2. **Show the new intake**
   - “A founder, operator, student, investor, or provider can describe what they need in plain language.”

3. **Show AI normalization**
   - “The system extracts sector, stage, role need, availability, Utah context, and mission signals.”

4. **Show ranked matches**
   - “The match is not a black box. It explains fit, evidence, gaps, and next best action.”

5. **Show staff dashboard**
   - “Nucleus remains the trusted connector. AI prepares the work; staff approves the relationship.”

6. **Show Affinity sync**
   - “The CRM remains the system of record. Every approved match and rationale flows back into Affinity.”

7. **Show Utah Opportunity Graph**
   - “Over time, this becomes a living map of Utah’s innovation ecosystem: research, startups, capital, talent, and support.”

8. **Close with impact**
   - “This compresses weekly manual review into real-time, explainable, staff-reviewed connections.”

---

## 22. Build Priorities for 12 Hours

Priority order:

1. Polished app shell and visual system.
2. Seed data and matching logic.
3. Intake flow.
4. Match results with explanations.
5. Staff dashboard and approval flow.
6. Integration console with Affinity/Squarespace/Typeform story.
7. Utah Opportunity Graph.
8. Tests for scoring logic.
9. Deployment polish and presentation script.

If time gets tight, preserve UX and demo reliability over deeper backend complexity. The product should look real, explain itself clearly, and never fail during presentation.

---

## 23. Spec Self-Review

### 23.1 Coverage Check

This spec covers all official required features:

- Dual-sided profiles: Sections 5, 10, and 14.
- Nucleus parameters / integration: Section 13.
- UX: Sections 8, 9, 15, and 20.
- Explainable AI: Section 11.
- Utah context: Sections 11.3, 12, and 14.
- Example matches: Section 14.
- AI approach explanation: Sections 11 and 18.

It also covers kickoff-specific needs:

- Manual weekly review pain: Sections 3 and 15.
- Five Connections Hub networks: Sections 5 and 13.
- Awareness of available opportunities: Sections 7 and 12.
- Public data stretch: Section 12.
- Staff/human approval: Sections 11.1 and 15.

### 23.2 Placeholder Scan

The spec contains no intentionally unresolved placeholders. The implementation plan should convert this into concrete tasks, files, tests, and commands.

### 23.3 Scope Check

The concept has multiple future subsystems, but the hackathon scope is a single coherent prototype: intake, matching, staff review, integration preview, and Utah graph. The implementation plan should prioritize these as one demo application with production-minded seams rather than separate products.
