import { z } from 'zod';

export interface ExtractedSignals {
  // Market / Business
  market_size: 'large' | 'medium' | 'small' | 'unknown';
  revenue_model: 'subscription' | 'usage_based' | 'one_time' | 'marketplace' | 'freemium' | 'unknown';
  growth_potential: 'high' | 'medium' | 'low' | 'unknown';
  scalability: 'high' | 'moderate' | 'low' | 'unknown';
  exit_potential: 'high' | 'medium' | 'low' | 'unknown';
  investor_interest_in_space: 'high' | 'medium' | 'low' | 'unknown';
  // Customer Demand
  pain_severity: 'severe' | 'moderate' | 'mild' | 'unknown';
  problem_frequency: 'daily' | 'weekly' | 'occasional' | 'rare' | 'unknown';
  existing_buyers: boolean;
  clear_roi: boolean;
  nice_to_have: boolean;
  willingness_to_pay: 'high' | 'medium' | 'low' | 'unknown';
  // Market Timing
  industry_growth: 'fast' | 'moderate' | 'slow' | 'declining' | 'unknown';
  technology_maturity: 'ready' | 'emerging' | 'not_ready' | 'unknown';
  consumer_adoption: 'growing' | 'early' | 'mass_market' | 'unknown';
  regulatory_environment: 'supportive' | 'neutral' | 'restrictive' | 'unknown';
  too_early: boolean;
  // Technical Feasibility
  existing_apis_available: boolean;
  mvp_complexity: 'simple' | 'moderate' | 'complex' | 'research_required' | 'unknown';
  requires_new_hardware: boolean;
  ai_dependency: 'core' | 'supporting' | 'none' | 'unknown';
  infrastructure_complexity: 'low' | 'medium' | 'high' | 'unknown';
  // Competitive Moat
  has_proprietary_data: boolean;
  has_network_effects: boolean;
  switching_costs: 'high' | 'medium' | 'low' | 'unknown';
  differentiation: 'strong' | 'moderate' | 'weak' | 'unknown';
  competition_level: 'low' | 'medium' | 'high' | 'very_high' | 'unknown';
  easy_to_copy: boolean;
  // Founder-Market Fit
  domain_expertise: 'expert' | 'experienced' | 'learning' | 'none' | 'unknown';
  technical_background: boolean;
  industry_experience: 'deep' | 'some' | 'none' | 'unknown';
  execution_track_record: 'strong' | 'some' | 'none' | 'unknown';
  credibility: 'high' | 'medium' | 'low' | 'unknown';
  // Q&A Explicit Signalling
  moat_strength: 'weak' | 'moderate' | 'strong';
  why_now_strength: 'strong' | 'moderate' | 'weak';
  validation_level: 'none' | 'conversations' | 'waitlist' | 'paying_customers';
  pain_score: number;
  technical_background_choice: 'can_code' | 'used_to_code' | 'no';
  founder_count: 'solo' | 'team';
  has_technical_cofounder: boolean;
  funding_status: 'bootstrapped' | 'raising' | 'raised';
  current_stage: 'forming' | 'ux_design' | 'prototype' | 'mvp';
  market_size_choice: 'small' | 'medium' | 'large' | 'mass_market';
  revenue_model_choice: 'subscription' | 'transaction_fee' | 'marketplace' | 'licensing' | 'advertising' | 'one_time' | 'other';
}

export interface ScoringFactor {
  label: string;
  points: number;
  detected: boolean;
  signal_key: string;
}

export interface DimensionRuleResult {
  score: number;
  confidence: number;
  factors: ScoringFactor[];
  active_factors: ScoringFactor[];
  positive_signals: string[];
  negative_signals: string[];
  base_score: number;
  positive_adjustments: number;
  negative_adjustments: number;
  neutral_signals: string[];
}

export const DimensionDetailSchema = z.object({
  score: z.number().min(0).max(10),
  confidence: z.number().min(0).max(100),
  evaluation_criteria: z.array(z.string()),
  why_this_score: z.string(),
  positive_signals: z.array(z.string()),
  negative_signals: z.array(z.string()),
  improvement_actions: z.array(z.string()),
  base_score: z.number(),
  positive_adjustments: z.number(),
  negative_adjustments: z.number(),
  neutral_signals: z.array(z.string()).optional(),
  scoring_factors: z.array(z.object({
    label: z.string(),
    points: z.number(),
    detected: z.boolean(),
    signal_key: z.string(),
  })).optional(),
});

export type DimensionDetail = z.infer<typeof DimensionDetailSchema>;

export const RiskMatrixItemSchema = z.object({
  severity: z.enum(['high', 'medium', 'low']),
  reason: z.string(),
  mitigation: z.string(),
});

export const ScoringResponseSchema = z.object({
  overall_score: z.number().min(0).max(10),
  startup_quality_score: z.number().min(0).max(10),
  investor_readiness_score: z.number().min(0).max(10),
  triage_band: z.enum(['Strong Pass', 'Promising / Needs Work', 'Not a Fit (Currently)']),
  confidence_level: z.number().min(0).max(100),
  startup_summary: z.string(),
  why_this_score: z.string(),
  biggest_assumption: z.string(),
  missing_evidence: z.string(),
  what_increased_the_score: z.array(z.string()),
  what_reduced_the_score: z.array(z.string()),
  how_to_improve: z.array(z.string()),
  investor_questions: z.array(z.string()),
  highest_scoring_dimension: z.string(),
  lowest_scoring_dimension: z.string(),
  is_mock: z.boolean().optional(),
  
  // New Investor-Grade due diligence layers:
  evidence_score: z.number().min(0).max(10),
  investment_probability: z.number().min(0).max(100),
  
  confidence_breakdown: z.object({
    questionnaire_completeness: z.number().min(0).max(100),
    signal_confidence: z.number().min(0).max(100),
    evidence_confidence: z.number().min(0).max(100),
    rule_confidence: z.number().min(0).max(100),
    overall_confidence: z.number().min(0).max(100),
  }),
  
  evidence_checklist: z.array(z.object({
    item: z.string(),
    status: z.enum(['completed', 'missing', 'partial']),
    gap_description: z.string(),
  })),

  score_sensitivity: z.array(z.object({
    milestone: z.string(),
    estimated_increase: z.number(),
  })),
  
  investor_red_flags: z.array(z.object({
    flag: z.string(),
    severity: z.enum(['high', 'medium', 'low']),
    reason: z.string(),
    recommendation: z.string(),
  })),
  
  risk_matrix: z.object({
    market: RiskMatrixItemSchema,
    execution: RiskMatrixItemSchema,
    funding: RiskMatrixItemSchema,
    competition: RiskMatrixItemSchema,
    technical: RiskMatrixItemSchema,
    legal: RiskMatrixItemSchema,
    operational: RiskMatrixItemSchema,
  }),
  
  validation_roadmap: z.array(z.object({
    phase: z.string(),
    task: z.string(),
    timeline: z.string(),
    impact: z.string(),
    effort: z.string(),
    expected_score_improvement: z.string(),
  })),
  
  comparable_startups: z.array(z.object({
    name: z.string(),
    description: z.string(),
    why_comparable: z.string(),
    business_model: z.string(),
    lessons_learned: z.string(),
  })),
  
  due_diligence_questions: z.object({
    market: z.array(z.object({ question: z.string(), expected_evidence: z.string(), suggested_prep: z.string() })),
    customer: z.array(z.object({ question: z.string(), expected_evidence: z.string(), suggested_prep: z.string() })),
    revenue: z.array(z.object({ question: z.string(), expected_evidence: z.string(), suggested_prep: z.string() })),
    technology: z.array(z.object({ question: z.string(), expected_evidence: z.string(), suggested_prep: z.string() })),
    competition: z.array(z.object({ question: z.string(), expected_evidence: z.string(), suggested_prep: z.string() })),
    operations: z.array(z.object({ question: z.string(), expected_evidence: z.string(), suggested_prep: z.string() })),
    legal: z.array(z.object({ question: z.string(), expected_evidence: z.string(), suggested_prep: z.string() })),
    financial: z.array(z.object({ question: z.string(), expected_evidence: z.string(), suggested_prep: z.string() })),
  }),
  
  co_founder_recommendations: z.string(),
  
  investor_memo: z.object({
    executive_summary: z.string(),
    investment_thesis: z.string(),
    strengths: z.string(),
    weaknesses: z.string(),
    major_risks: z.string(),
    recommendation: z.enum(['Pass', 'Monitor', 'Proceed Carefully', 'Strong Pass']),
    confidence_rating: z.string(),
    next_validation_step: z.string(),
  }),
  
  buildtime_estimator: z.object({
    timeline_months: z.number(),
    engineering_complexity: z.enum(['low', 'medium', 'high']),
    team_recommendation: z.string(),
    technical_risks: z.array(z.string()),
    development_phases: z.array(z.object({
      phase: z.string(),
      timeline: z.string(),
      estimated_effort: z.string(),
      description: z.string(),
    })),
  }),

  dimensions: z.object({
    investor_appeal: DimensionDetailSchema,
    customer_demand: DimensionDetailSchema,
    market_timing: DimensionDetailSchema,
    technical_feasibility: DimensionDetailSchema,
    competitive_moat: DimensionDetailSchema,
    founder_market_fit: DimensionDetailSchema,
  }),
  answers: z.any().optional(),
  signals: z.any().optional(),
});

export type ScoringResponse = z.infer<typeof ScoringResponseSchema>;

export const DIMENSION_META = [
  { key: 'investor_appeal',       label: 'Investor Appeal',       weight: 0.20, icon: '💼' },
  { key: 'customer_demand',       label: 'Customer Demand',       weight: 0.20, icon: '🎯' },
  { key: 'market_timing',         label: 'Market Timing',         weight: 0.15, icon: '⏱️' },
  { key: 'technical_feasibility', label: 'Technical Feasibility', weight: 0.15, icon: '⚙️' },
  { key: 'competitive_moat',      label: 'Competitive Moat',      weight: 0.15, icon: '🏰' },
  { key: 'founder_market_fit',    label: 'Founder-Market Fit',    weight: 0.15, icon: '🧭' },
] as const;

export type DimensionKey = typeof DIMENSION_META[number]['key'];
export type TriageBand = ScoringResponse['triage_band'];

export const TRIAGE_CONFIG: Record<TriageBand, { color: string; bg: string; border: string; label: string }> = {
  'Strong Pass': { color: '#2E7D32', bg: '#E8F5E9', border: '#A5D6A7', label: 'Strong Pass' },
  'Promising / Needs Work': { color: '#E0A800', bg: '#FFF8E1', border: '#FFE082', label: 'Promising / Needs Work' },
  'Not a Fit (Currently)': { color: '#C0392B', bg: '#FFEBEE', border: '#EF9A9A', label: 'Not a Fit (Currently)' },
};

export interface QAAnswers {
  customer: string;
  problem: string;
  pain_score: number;
  validation_level: 'none' | 'conversations' | 'waitlist' | 'paying_customers';
  market_size_choice: 'small' | 'medium' | 'large' | 'mass_market';
  revenue_model_choice: 'subscription' | 'transaction_fee' | 'marketplace' | 'licensing' | 'advertising' | 'one_time' | 'other';
  why_now: string;
  competitors: string;
  moat: string;
  solo_founder: boolean;
  has_technical_cofounder: boolean;
  technical_background: 'can_code' | 'used_to_code' | 'no';
  current_stage: 'forming' | 'ux_design' | 'prototype' | 'mvp';
  launch_timeline: string;
  funding_status: 'bootstrapped' | 'raising' | 'raised';
  contact_name: string;
  contact_email: string;
  need_help?: boolean;
}
