import { DimensionRuleResult, TriageBand, QAAnswers } from '../types/scoring';

export interface ScoreSensitivityItem {
  milestone: string;
  estimated_increase: number;
}

export interface EvidenceChecklistItem {
  item: string;
  status: 'completed' | 'missing' | 'partial';
  gap_description: string;
}

export interface BuildTimeEstimates {
  timeline_months: number;
  engineering_complexity: 'low' | 'medium' | 'high';
  team_recommendation: string;
  technical_risks: string[];
  development_phases: {
    phase: string;
    timeline: string;
    estimated_effort: string;
    description: string;
  }[];
}

export function calculateAggregatedScores(
  dimensions: Record<string, DimensionRuleResult>,
  answers: QAAnswers,
  redFlagCount: number,
  config?: any
): {
  startup_quality_score: number;
  investor_readiness_score: number;
  overall_score: number;
  triage_band: TriageBand;
  confidence_level: number;
  evidence_score: number;
  investment_probability: number;
  confidence_breakdown: {
    questionnaire_completeness: number;
    signal_confidence: number;
    evidence_confidence: number;
    rule_confidence: number;
    overall_confidence: number;
  };
  evidence_checklist: EvidenceChecklistItem[];
  score_sensitivity: ScoreSensitivityItem[];
  buildtime_estimator: BuildTimeEstimates;
} {
  const customerDemand = dimensions.customer_demand.score;
  const competitiveMoat = dimensions.competitive_moat.score;
  const technicalFeasibility = dimensions.technical_feasibility.score;
  const founderMarketFit = dimensions.founder_market_fit.score;
  const investorAppeal = dimensions.investor_appeal.score;
  const marketTiming = dimensions.market_timing.score;

  // Retrieve dynamic configurations with fallbacks
  const wQuality = config?.scoring_weights?.quality || { demand: 0.35, moat: 0.30, technical: 0.20, founder: 0.15 };
  const wReadiness = config?.scoring_weights?.readiness || { appeal: 0.40, timing: 0.30, founder: 0.15, demand: 0.15 };
  const adjValidation = config?.adjustments?.validation || { none: -1.5, paying_customers: 1.5 };
  const adjStage = config?.adjustments?.stage || { forming: -1.5, mvp: 1.0 };
  const thresholds = config?.triage_thresholds || { strong_pass: 7.5, needs_work: 4.5 };

  // 1. Startup Quality Score
  const startupQualityScore =
    (wQuality.demand ?? 0.35) * customerDemand +
    (wQuality.moat ?? 0.30) * competitiveMoat +
    (wQuality.technical ?? 0.20) * technicalFeasibility +
    (wQuality.founder ?? 0.15) * founderMarketFit;

  // 2. Investor Readiness Score
  const investorReadinessScore =
    (wReadiness.appeal ?? 0.40) * investorAppeal +
    (wReadiness.timing ?? 0.30) * marketTiming +
    (wReadiness.founder ?? 0.15) * founderMarketFit +
    (wReadiness.demand ?? 0.15) * customerDemand;

  // 3. Adjustments
  let validationAdj = 0;
  if (answers.validation_level === 'none') {
    validationAdj = adjValidation.none ?? -1.5;
  } else if (answers.validation_level === 'paying_customers') {
    validationAdj = adjValidation.paying_customers ?? 1.5;
  } else if (answers.validation_level && adjValidation[answers.validation_level] !== undefined) {
    validationAdj = adjValidation[answers.validation_level];
  }

  let stageAdj = 0;
  if (answers.current_stage === 'forming') {
    stageAdj = adjStage.forming ?? -1.5;
  } else if (answers.current_stage === 'mvp') {
    stageAdj = adjStage.mvp ?? 1.0;
  } else if (answers.current_stage && adjStage[answers.current_stage] !== undefined) {
    stageAdj = adjStage[answers.current_stage];
  }

  // 4. Overall Score calculation
  const rawOverall = (startupQualityScore + investorReadinessScore) / 2 + validationAdj + stageAdj;
  const overallScore = Math.min(10, Math.max(0, Math.round(rawOverall * 10) / 10));

  // 5. Triage Band
  let triageBand: TriageBand = 'Promising / Needs Work';
  if (overallScore >= (thresholds.strong_pass ?? 7.5)) {
    triageBand = 'Strong Pass';
  } else if (overallScore < (thresholds.needs_work ?? 4.5)) {
    triageBand = 'Not a Fit (Currently)';
  }

  // 6. Evidence Score (0-10)
  // Validation level: none = 0, conversations = 2, waitlist = 4, paying_customers = 6
  // Current stage: forming = 0, ux_design = 1, prototype = 2, mvp = 4
  let valScore = 0;
  if (answers.validation_level === 'conversations') valScore = 2;
  else if (answers.validation_level === 'waitlist') valScore = 4;
  else if (answers.validation_level === 'paying_customers') valScore = 6;

  let stageScore = 0;
  if (answers.current_stage === 'ux_design') stageScore = 1;
  else if (answers.current_stage === 'prototype') stageScore = 2;
  else if (answers.current_stage === 'mvp') stageScore = 4;

  const evidenceScore = Math.min(10, valScore + stageScore);

  // 7. Investment Probability (0-100%)
  // Base: Investor Readiness * 8
  // Positive adjustments: validation level, stage, large market size, funded status
  // Negative adjustments: Red Flags
  let valProbBonus = 0;
  if (answers.validation_level === 'conversations') valProbBonus = 5;
  else if (answers.validation_level === 'waitlist') valProbBonus = 12;
  else if (answers.validation_level === 'paying_customers') valProbBonus = 20;

  let stageProbBonus = 0;
  if (answers.current_stage === 'prototype') stageProbBonus = 5;
  else if (answers.current_stage === 'mvp') stageProbBonus = 10;

  let mktProbBonus = 0;
  if (['large', 'mass_market'].includes(answers.market_size_choice)) {
    mktProbBonus = 10;
  }

  let fundProbBonus = 0;
  if (answers.funding_status === 'bootstrapped') fundProbBonus = 5;
  else if (answers.funding_status === 'raising') fundProbBonus = 8;
  else if (answers.funding_status === 'raised') fundProbBonus = 10;

  const flagPenalty = redFlagCount * 5;

  const rawProb = (investorReadinessScore * 8) + valProbBonus + stageProbBonus + mktProbBonus + fundProbBonus - flagPenalty;
  const investmentProbability = Math.min(100, Math.max(0, Math.round(rawProb)));

  // 8. Confidence Breakdown
  // Questionnaire completeness: calculate base text fills
  const textLength = answers.customer.length + answers.problem.length + answers.why_now.length + answers.competitors.length + answers.moat.length;
  const questionnaire_completeness = Math.min(100, Math.max(80, Math.round(80 + (textLength / 50))));

  const signal_confidence = Math.round(
    Object.values(dimensions).reduce((acc, cur) => acc + cur.confidence, 0) / Object.keys(dimensions).length
  );
  
  const evidence_confidence = evidenceScore * 10;
  const rule_confidence = 100;

  const overall_confidence = Math.min(98, Math.max(40, Math.round(
    0.15 * questionnaire_completeness + 
    0.50 * signal_confidence + 
    0.25 * evidence_confidence + 
    0.10 * rule_confidence
  )));

  // 9. Evidence Checklist
  const evidence_checklist: EvidenceChecklistItem[] = [
    {
      item: 'Customer Discovery Interviews',
      status: answers.validation_level !== 'none' ? 'completed' : 'missing',
      gap_description: answers.validation_level !== 'none' ? 'Conducted initial discussions' : 'No structured customer interviews performed yet.'
    },
    {
      item: 'Interactive Design/Wired Prototype',
      status: ['prototype', 'mvp'].includes(answers.current_stage) ? 'completed' : answers.current_stage === 'ux_design' ? 'partial' : 'missing',
      gap_description: ['prototype', 'mvp'].includes(answers.current_stage) 
        ? 'High fidelity prototype built' 
        : answers.current_stage === 'ux_design' 
          ? 'UX design in progress' 
          : 'No clickable demo or user-interface mockups available.'
    },
    {
      item: 'Waitlist & Landing Page Traction',
      status: ['waitlist', 'paying_customers'].includes(answers.validation_level) ? 'completed' : 'missing',
      gap_description: ['waitlist', 'paying_customers'].includes(answers.validation_level) ? 'Waitlist active' : 'No active landing page or signup waitlist deployed.'
    },
    {
      item: 'Minimum Viable Product (MVP)',
      status: answers.current_stage === 'mvp' ? 'completed' : ['prototype'].includes(answers.current_stage) ? 'partial' : 'missing',
      gap_description: answers.current_stage === 'mvp' ? 'MVP is live' : 'Full MVP software has not yet been built or released.'
    },
    {
      item: 'Early Paying Customers / Traction',
      status: answers.validation_level === 'paying_customers' ? 'completed' : 'missing',
      gap_description: answers.validation_level === 'paying_customers' ? 'Paying pilot/customers locked' : 'Zero revenue transactions or subscription contracts validated.'
    }
  ];

  // 10. Score Sensitivity Engine
  const score_sensitivity: ScoreSensitivityItem[] = [];
  if (answers.validation_level === 'none') {
    score_sensitivity.push({ milestone: 'Interview 20 Customers', estimated_increase: 0.6 });
    score_sensitivity.push({ milestone: 'Launch landing page & collect 100+ signups', estimated_increase: 1.2 });
    score_sensitivity.push({ milestone: 'Acquire first 3 paying customers', estimated_increase: 2.3 });
  } else if (answers.validation_level === 'conversations') {
    score_sensitivity.push({ milestone: 'Launch landing page & collect 100+ signups', estimated_increase: 0.8 });
    score_sensitivity.push({ milestone: 'Acquire first 3 paying customers', estimated_increase: 1.7 });
  } else if (answers.validation_level === 'waitlist') {
    score_sensitivity.push({ milestone: 'Acquire first 3 paying customers', estimated_increase: 1.2 });
  }

  if (['forming', 'ux_design'].includes(answers.current_stage)) {
    score_sensitivity.push({ milestone: 'Build interactive clickable prototype', estimated_increase: 0.8 });
    score_sensitivity.push({ milestone: 'Develop and launch MVP software', estimated_increase: 1.5 });
  } else if (answers.current_stage === 'prototype') {
    score_sensitivity.push({ milestone: 'Develop and launch MVP software', estimated_increase: 1.0 });
  }

  // 11. BuildTime Estimator
  // Base SaaS MVP = 10 weeks (approx 2.5 months)
  let baseWeeks = 10;

  // Design & Code adjustments based on current_stage
  if (answers.current_stage === 'mvp') {
    baseWeeks -= 10 * 0.70;
  } else if (answers.current_stage === 'prototype') {
    baseWeeks -= 10 * 0.35;
  } else if (answers.current_stage === 'ux_design') {
    baseWeeks -= 10 * 0.20;
  }

  // Technical cofounder / team adjustments
  if (answers.has_technical_cofounder || answers.technical_background === 'can_code') {
    baseWeeks -= 2.0;
  }

  // Complexity adders based on technicalFeasibility
  if (technicalFeasibility < 5.0) {
    baseWeeks += 3.0;
  } else if (technicalFeasibility < 7.0) {
    baseWeeks += 1.0;
  }

  // Ensure logical minimum constraints (minimum 1.5 weeks)
  const finalWeeks = Math.max(1.5, Math.round(baseWeeks * 10) / 10);

  // Convert weeks to months for schema (1 week = 0.25 months)
  const timeline_months = Math.max(0.4, Math.round((finalWeeks / 4) * 10) / 10);
  
  let complexity: BuildTimeEstimates['engineering_complexity'] = 'medium';
  if (finalWeeks <= 4) {
    complexity = 'low';
  } else if (finalWeeks >= 10) {
    complexity = 'high';
  }

  let team = '1 Tech Lead, 1 Frontend Developer, 1 Backend Developer, 1 Product Designer';
  let technical_risks = [
    'Ensuring scalable API response times under high concurrency.',
    'Integrating with third-party software legacy webhooks.'
  ];

  if (complexity === 'low') {
    team = '1 Full-Stack Developer + 1 Part-Time UI/UX Designer';
    technical_risks = [
      'Maintaining simplicity to avoid scope creep in initial V1 launch.',
      'Hosting resources on serverless endpoints to keep cloud costs low.'
    ];
  } else if (complexity === 'high') {
    team = '1 Tech Lead, 2 Full-Stack Developers, 1 DevOps Engineer, 1 Product Designer, 1 AI/Data Specialist';
    technical_risks = [
      'Database scale issues with massive real-time data loops.',
      'Training and fine-tuning custom AI models within budget.',
      'Securing regulatory compliance (GDPR/HIPAA) for custom storage structures.'
    ];
  }

  const development_phases = [
    { phase: 'Discovery & UX Spec', timeline: `${Math.round(timeline_months * 0.15 * 10) / 10} month(s)`, estimated_effort: '15%', description: 'Map workflows, user flows, database architecture blueprints, and interactive wireframes.' },
    { phase: 'UI/UX Interactive Design', timeline: `${Math.round(timeline_months * 0.15 * 10) / 10} month(s)`, estimated_effort: '15%', description: 'Create high-fidelity design sheets, responsive templates, and style system configurations.' },
    { phase: 'Frontend Engineering', timeline: `${Math.round(timeline_months * 0.25 * 10) / 10} month(s)`, estimated_effort: '25%', description: 'Develop Next.js/React layout templates, client page routings, and browser storage components.' },
    { phase: 'Backend API & Infrastructure', timeline: `${Math.round(timeline_months * 0.25 * 10) / 10} month(s)`, estimated_effort: '25%', description: 'Establish database connections, schema constraints, security keys, and router pipelines.' },
    { phase: 'AI & Custom Integrations', timeline: `${Math.round(timeline_months * 0.10 * 10) / 10} month(s)`, estimated_effort: '10%', description: 'Integrate Gemini LLM prompts, caching algorithms, and third-party SaaS hooks.' },
    { phase: 'QA Testing & Launch Deployment', timeline: `${Math.round(timeline_months * 0.10 * 10) / 10} month(s)`, estimated_effort: '10%', description: 'Run build tests, cross-browser responsiveness checks, and deploy to Vercel/AWS environments.' },
  ];

  return {
    startup_quality_score: Math.min(10, Math.max(0, Math.round(startupQualityScore * 10) / 10)),
    investor_readiness_score: Math.min(10, Math.max(0, Math.round(investorReadinessScore * 10) / 10)),
    overall_score: overallScore,
    triage_band: triageBand,
    confidence_level: overall_confidence,
    evidence_score: evidenceScore,
    investment_probability: investmentProbability,
    confidence_breakdown: {
      questionnaire_completeness,
      signal_confidence,
      evidence_confidence,
      rule_confidence,
      overall_confidence,
    },
    evidence_checklist,
    score_sensitivity,
    buildtime_estimator: {
      timeline_months,
      engineering_complexity: complexity,
      team_recommendation: team,
      technical_risks,
      development_phases
    }
  };
}

