export type EntityType =
  | 'talent'
  | 'startup'
  | 'research_project'
  | 'mentor'
  | 'subject_matter_expert'
  | 'investor'
  | 'service_provider'
  | 'program';

export type Sector =
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

export type Institution =
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

export type Stage =
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

export type Availability = 'full_time' | 'fractional' | 'advisory' | 'internship' | 'not_available';
export type RiskTolerance = 'low' | 'medium' | 'high';

export type PublicSignal = {
  source: string;
  label: string;
  url?: string;
  observedAt: string;
  summary: string;
};

export type AffinityReference = {
  personId?: string;
  orgId?: string;
  listEntryId?: string;
};

export type Need = {
  category: string;
  description: string;
};

export type Offer = {
  category: string;
  description: string;
};

export type Entity = {
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
  fundingStatus?: string;
  origin?: 'university_lab' | 'bootstrapped' | 'nucleus_portfolio' | 'accelerator' | 'out_of_state' | 'other';
  trl?: number;
  tags: string[];
  publicSignals: PublicSignal[];
  affinity?: AffinityReference;
  createdAt: string;
  updatedAt: string;
};

export type ScoreBreakdown = {
  sectorFit: number;
  roleNeedFit: number;
  stageFit: number;
  skillExpertiseFit: number;
  availabilityFit: number;
  utahContextFit: number;
  missionFit: number;
  networkLeverage: number;
};

export type MatchReason = {
  label: string;
  detail: string;
};

export type EvidenceSignal = {
  field: string;
  value: string;
};

export type MatchGap = {
  label: string;
  detail: string;
};

export type Match = {
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

export type IntakeForm = {
  profileType: EntityType;
  name: string;
  email: string;
  naturalDescription: string;
  headline?: string;
  sectors?: Sector[];
  skills?: string[];
  needs?: Need[];
  offers?: Offer[];
  availability?: Availability;
  stagePreferences?: Stage[];
  institutionAffiliations?: Institution[];
};
