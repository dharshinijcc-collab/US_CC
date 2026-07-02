import { ExtractedSignals, DimensionRuleResult, ScoringFactor } from '../types/scoring';

export interface RedFlag {
  flag: string;
  severity: 'high' | 'medium' | 'low';
  reason: string;
  recommendation: string;
}

export function detectRedFlags(signals: ExtractedSignals): RedFlag[] {
  const flags: RedFlag[] = [];

  // 1. Solo Founder
  if (signals.founder_count === 'solo') {
    flags.push({
      flag: 'Solo Founder',
      severity: 'medium',
      reason: 'Venture is operated by a single founder, raising execution risk and key-person dependency.',
      recommendation: 'Recruit a complementary co-founder (ideally technical or operations-focused) to distribute workload and build investor trust.'
    });
  }

  // 2. No Technical Lead
  if (!signals.technical_background && !signals.has_technical_cofounder) {
    flags.push({
      flag: 'No Technical Lead',
      severity: 'high',
      reason: 'The team lacks internal coding/engineering leadership, relying heavily on external agencies or contractors.',
      recommendation: 'Onboard a CTO or technical co-founder with equity to bring product development and system architecture in-house.'
    });
  }

  // 3. Tiny Market Size
  if (signals.market_size_choice === 'small' || signals.market_size === 'small') {
    flags.push({
      flag: 'Tiny Market Size',
      severity: 'medium',
      reason: 'The addressable market is niche or localized, limiting the startup\'s ability to achieve venture-scale returns.',
      recommendation: 'Pivot or expand the target market definition to adjacent customer segments or larger geographic markets.'
    });
  }

  // 4. Weak Defensibility Moat
  if (signals.easy_to_copy || signals.moat_strength === 'weak') {
    flags.push({
      flag: 'Weak Defensibility Moat',
      severity: 'high',
      reason: 'The product has no proprietary datasets, network effects, or switching costs, making it highly susceptible to cloning.',
      recommendation: 'Design lock-in mechanics, proprietary workflows, or data loops that make the solution more defensible over time.'
    });
  }

  // 5. Zero Customer Validation
  if (signals.validation_level === 'none') {
    flags.push({
      flag: 'Zero Customer Validation',
      severity: 'high',
      reason: 'The idea has not been validated with customer interviews, landing page signups, or early testers.',
      recommendation: 'Conduct 15+ structured interviews with target customer personas before building additional software.'
    });
  }

  // 6. Unclear Revenue Model
  if (signals.revenue_model_choice === 'other' && signals.revenue_model === 'unknown') {
    flags.push({
      flag: 'Unclear Revenue Model',
      severity: 'medium',
      reason: 'The business model is undefined or secondary, creating commercial viability risk.',
      recommendation: 'Define a primary pricing strategy (SaaS subscription, transaction commission, marketplace fee) and test it with buyers.'
    });
  }

  // 7. Weak Core Differentiation
  if (signals.differentiation === 'weak') {
    flags.push({
      flag: 'Weak Core Differentiation',
      severity: 'high',
      reason: 'The offering does not have a clear "10x value proposition" or differentiation compared to established competitors.',
      recommendation: 'Sharpen the value proposition focusing on a highly specific customer pain point that incumbents ignore.'
    });
  }

  return flags;
}

export function runRuleEngine(signals: ExtractedSignals): Record<string, DimensionRuleResult> {
  const evaluateDimension = (
    baseScore: number,
    factorsList: { label: string; points: number; detected: boolean; signalKey: string }[],
    dimensionSignalsKeys: (keyof ExtractedSignals)[]
  ): DimensionRuleResult => {
    let positiveAdjustments = 0;
    let negativeAdjustments = 0;
    const factors: ScoringFactor[] = [];
    const activeFactors: ScoringFactor[] = [];
    const positiveSignals: string[] = [];
    const negativeSignals: string[] = [];
    const neutralSignals: string[] = [];

    factorsList.forEach(f => {
      const scoringFactor: ScoringFactor = {
        label: f.label,
        points: f.points,
        detected: f.detected,
        signal_key: f.signalKey
      };
      factors.push(scoringFactor);
      
      // Keep track of neutral/inactive factors
      if (!f.detected) {
        neutralSignals.push(f.label);
      } else {
        activeFactors.push(scoringFactor);
        if (f.points > 0) {
          positiveAdjustments += f.points;
          positiveSignals.push(f.label);
        } else if (f.points < 0) {
          negativeAdjustments += f.points;
          negativeSignals.push(f.label);
        } else {
          neutralSignals.push(f.label);
        }
      }
    });

    const score = Math.min(10, Math.max(0, baseScore + positiveAdjustments + negativeAdjustments));

    // Calculate confidence score (percentage of known signals)
    let knownCount = 0;
    dimensionSignalsKeys.forEach(k => {
      const val = signals[k];
      if (val !== 'unknown' && val !== undefined && val !== null) {
        knownCount++;
      }
    });
    const confidence = Math.min(98, Math.max(40, Math.round((knownCount / dimensionSignalsKeys.length) * 100)));

    return {
      score: Number(score.toFixed(1)),
      confidence,
      factors,
      active_factors: activeFactors,
      positive_signals: positiveSignals,
      negative_signals: negativeSignals,
      base_score: baseScore,
      positive_adjustments: Number(positiveAdjustments.toFixed(1)),
      negative_adjustments: Number(negativeAdjustments.toFixed(1)),
      neutral_signals: neutralSignals
    };
  };

  // 1. Investor Appeal
  const investorAppealFactors = [
    { label: 'Large Addressable Market', points: 2, detected: signals.market_size === 'large', signalKey: 'market_size' },
    { label: 'Medium Addressable Market', points: 1, detected: signals.market_size === 'medium', signalKey: 'market_size' },
    { label: 'Subscription / Recurring Revenue', points: 2, detected: ['subscription', 'usage_based', 'freemium'].includes(signals.revenue_model), signalKey: 'revenue_model' },
    { label: 'One-Time Revenue Model', points: -1, detected: signals.revenue_model === 'one_time', signalKey: 'revenue_model' },
    { label: 'High Scalability Potential', points: 2, detected: signals.scalability === 'high', signalKey: 'scalability' },
    { label: 'Moderate Scalability Potential', points: 1, detected: signals.scalability === 'moderate', signalKey: 'scalability' },
    { label: 'Strong Exit Potential', points: 1, detected: signals.exit_potential === 'high', signalKey: 'exit_potential' },
    { label: 'Active Investor Interest in Space', points: 1, detected: signals.investor_interest_in_space === 'high', signalKey: 'investor_interest_in_space' },
    { label: 'High Growth Potential', points: 1, detected: signals.growth_potential === 'high', signalKey: 'growth_potential' },
    { label: 'Small Addressable Market', points: -2, detected: signals.market_size === 'small', signalKey: 'market_size' },
    { label: 'Low Scalability Potential', points: -1, detected: signals.scalability === 'low', signalKey: 'scalability' },
    { label: 'Active Funding Stage (Raising/Raised)', points: 1, detected: ['raising', 'raised'].includes(signals.funding_status), signalKey: 'funding_status' },
    { label: 'Validated with Paying Customers', points: 4, detected: signals.validation_level === 'paying_customers', signalKey: 'validation_level' },
    { label: 'Validated with Waitlist', points: 2, detected: signals.validation_level === 'waitlist', signalKey: 'validation_level' },
    { label: 'Validated with User Conversations', points: 1, detected: signals.validation_level === 'conversations', signalKey: 'validation_level' },
    { label: 'No Prior Validation Done', points: -2, detected: signals.validation_level === 'none', signalKey: 'validation_level' },
    { label: 'Targeting Mass Market', points: 3, detected: signals.market_size_choice === 'mass_market', signalKey: 'market_size_choice' },
    { label: 'Targeting Large Market Segment', points: 2, detected: signals.market_size_choice === 'large', signalKey: 'market_size_choice' },
    { label: 'Targeting Medium Market Segment', points: 1, detected: signals.market_size_choice === 'medium', signalKey: 'market_size_choice' },
    { label: 'Targeting Small/Niche Market Segment', points: -2, detected: signals.market_size_choice === 'small', signalKey: 'market_size_choice' }
  ];
  const investorAppealKeys: (keyof ExtractedSignals)[] = [
    'market_size', 'revenue_model', 'scalability', 'exit_potential', 'investor_interest_in_space', 'growth_potential'
  ];

  // 2. Customer Demand
  const customerDemandFactors = [
    { label: 'Severe Customer Pain Point', points: 3, detected: signals.pain_severity === 'severe', signalKey: 'pain_severity' },
    { label: 'Moderate Customer Pain Point', points: 1, detected: signals.pain_severity === 'moderate', signalKey: 'pain_severity' },
    { label: 'Frequent Problem Occurrence (Daily/Weekly)', points: 2, detected: ['daily', 'weekly'].includes(signals.problem_frequency), signalKey: 'problem_frequency' },
    { label: 'Existing Buyers/Users Present', points: 2, detected: signals.existing_buyers === true, signalKey: 'existing_buyers' },
    { label: 'Clear ROI for Buyer', points: 2, detected: signals.clear_roi === true, signalKey: 'clear_roi' },
    { label: 'High Willingness to Pay', points: 1, detected: signals.willingness_to_pay === 'high', signalKey: 'willingness_to_pay' },
    { label: 'Nice-to-Have Product Concept', points: -2, detected: signals.nice_to_have === true, signalKey: 'nice_to_have' },
    { label: 'Low Willingness to Pay', points: -2, detected: signals.willingness_to_pay === 'low', signalKey: 'willingness_to_pay' },
    { label: 'Infrequent Problem Occurrence', points: -2, detected: signals.problem_frequency === 'rare', signalKey: 'problem_frequency' },
    { label: 'Mild Customer Pain Point', points: -1, detected: signals.pain_severity === 'mild', signalKey: 'pain_severity' },
    { label: 'Proven Demand via Paying Customers', points: 5, detected: signals.validation_level === 'paying_customers', signalKey: 'validation_level' },
    { label: 'Proven Demand via Waitlist Signups', points: 3, detected: signals.validation_level === 'waitlist', signalKey: 'validation_level' },
    { label: 'Proven Demand via Interviews', points: 1, detected: signals.validation_level === 'conversations', signalKey: 'validation_level' },
    { label: 'Zero Validated Demand', points: -2, detected: signals.validation_level === 'none', signalKey: 'validation_level' },
    { label: 'Critical Pain Score (8-10)', points: 2, detected: signals.pain_score >= 8, signalKey: 'pain_score' },
    { label: 'Elevated Pain Score (5-7)', points: 1, detected: signals.pain_score >= 5 && signals.pain_score <= 7, signalKey: 'pain_score' },
    { label: 'Low Pain Score (1-4)', points: -1, detected: signals.pain_score <= 4, signalKey: 'pain_score' }
  ];
  const customerDemandKeys: (keyof ExtractedSignals)[] = [
    'pain_severity', 'problem_frequency', 'existing_buyers', 'clear_roi', 'nice_to_have', 'willingness_to_pay'
  ];

  // 3. Market Timing
  const marketTimingFactors = [
    { label: 'Fast-Growing Industry Segment', points: 3, detected: signals.industry_growth === 'fast', signalKey: 'industry_growth' },
    { label: 'Moderate Industry Segment Growth', points: 1, detected: signals.industry_growth === 'moderate', signalKey: 'industry_growth' },
    { label: 'Technology Ready for Commercial Deployment', points: 2, detected: signals.technology_maturity === 'ready', signalKey: 'technology_maturity' },
    { label: 'Emerging Technology Stack', points: 1, detected: signals.technology_maturity === 'emerging', signalKey: 'technology_maturity' },
    { label: 'Growing Consumer/Enterprise Adoption Curve', points: 2, detected: signals.consumer_adoption === 'growing', signalKey: 'consumer_adoption' },
    { label: 'Supportive Regulatory Framework', points: 1, detected: signals.regulatory_environment === 'supportive', signalKey: 'regulatory_environment' },
    { label: 'Too Early for Commercial Scaling', points: -3, detected: signals.too_early === true, signalKey: 'too_early' },
    { label: 'Declining Industry Core Growth', points: -3, detected: signals.industry_growth === 'declining', signalKey: 'industry_growth' },
    { label: 'Restrictive Regulatory Environment', points: -2, detected: signals.regulatory_environment === 'restrictive', signalKey: 'regulatory_environment' },
    { label: 'Technology Stack Unripe / Unproven', points: -2, detected: signals.technology_maturity === 'not_ready', signalKey: 'technology_maturity' },
    { label: 'Strong "Why Now" Case', points: 3, detected: signals.why_now_strength === 'strong', signalKey: 'why_now_strength' },
    { label: 'Moderate "Why Now" Case', points: 1, detected: signals.why_now_strength === 'moderate', signalKey: 'why_now_strength' },
    { label: 'Weak "Why Now" Case', points: -2, detected: signals.why_now_strength === 'weak', signalKey: 'why_now_strength' }
  ];
  const marketTimingKeys: (keyof ExtractedSignals)[] = [
    'industry_growth', 'technology_maturity', 'consumer_adoption', 'regulatory_environment', 'too_early'
  ];

  // 4. Technical Feasibility
  const technicalFeasibilityFactors = [
    { label: 'Existing Ecosystem APIs/APIs Available', points: 3, detected: signals.existing_apis_available === true, signalKey: 'existing_apis_available' },
    { label: 'Simple MVP Development Path', points: 2, detected: signals.mvp_complexity === 'simple', signalKey: 'mvp_complexity' },
    { label: 'Moderate MVP Development Path', points: 1, detected: signals.mvp_complexity === 'moderate', signalKey: 'mvp_complexity' },
    { label: 'Low Infrastructure Complexity', points: 1, detected: signals.infrastructure_complexity === 'low', signalKey: 'infrastructure_complexity' },
    { label: 'Basic R&D or Scientific Research Required', points: -3, detected: signals.mvp_complexity === 'research_required', signalKey: 'mvp_complexity' },
    { label: 'Requires Custom New Hardware', points: -2, detected: signals.requires_new_hardware === true, signalKey: 'requires_new_hardware' },
    { label: 'Complex Frontend/Backend MVP Scope', points: -1, detected: signals.mvp_complexity === 'complex', signalKey: 'mvp_complexity' },
    { label: 'High Infrastructure / Server Complexity', points: -1, detected: signals.infrastructure_complexity === 'high', signalKey: 'infrastructure_complexity' },
    { label: 'Concept Phase / Ideation Stage', points: -2, detected: signals.current_stage === 'forming', signalKey: 'current_stage' },
    { label: 'Prototype / Wired Interactive Stage', points: 2, detected: signals.current_stage === 'prototype', signalKey: 'current_stage' },
    { label: 'Launched MVP Stage', points: 4, detected: signals.current_stage === 'mvp', signalKey: 'current_stage' }
  ];
  const technicalFeasibilityKeys: (keyof ExtractedSignals)[] = [
    'existing_apis_available', 'mvp_complexity', 'requires_new_hardware', 'ai_dependency', 'infrastructure_complexity'
  ];

  // 5. Competitive Moat
  const competitiveMoatFactors = [
    { label: 'Proprietary Data Accumulation Loop', points: 3, detected: signals.has_proprietary_data === true, signalKey: 'has_proprietary_data' },
    { label: 'Organic Network Effects Loop', points: 3, detected: signals.has_network_effects === true, signalKey: 'has_network_effects' },
    { label: 'High Switching Costs for Customers', points: 2, detected: signals.switching_costs === 'high', signalKey: 'switching_costs' },
    { label: 'Moderate Customer Switching Costs', points: 1, detected: signals.switching_costs === 'medium', signalKey: 'switching_costs' },
    { label: 'Strong Product Differentiation', points: 2, detected: signals.differentiation === 'strong', signalKey: 'differentiation' },
    { label: 'Moderate Product Differentiation', points: 1, detected: signals.differentiation === 'moderate', signalKey: 'differentiation' },
    { label: 'Product is Extremely Easy to Clone', points: -3, detected: signals.easy_to_copy === true, signalKey: 'easy_to_copy' },
    { label: 'Very High Competitive Saturation', points: -2, detected: signals.competition_level === 'very_high', signalKey: 'competition_level' },
    { label: 'High Competitive Saturation', points: -1, detected: signals.competition_level === 'high', signalKey: 'competition_level' },
    { label: 'Weak Core Differentiation', points: -2, detected: signals.differentiation === 'weak', signalKey: 'differentiation' },
    { label: 'Low Customer Switching Costs', points: -1, detected: signals.switching_costs === 'low', signalKey: 'switching_costs' },
    { label: 'Defensible Competitor Moat', points: 3, detected: signals.moat_strength === 'strong', signalKey: 'moat_strength' },
    { label: 'Moderate Defensibility Moat', points: 1, detected: signals.moat_strength === 'moderate', signalKey: 'moat_strength' },
    { label: 'No Moat / Low Defensibility', points: -2, detected: signals.moat_strength === 'weak', signalKey: 'moat_strength' }
  ];
  const competitiveMoatKeys: (keyof ExtractedSignals)[] = [
    'has_proprietary_data', 'has_network_effects', 'switching_costs', 'differentiation', 'competition_level', 'easy_to_copy'
  ];

  // 6. Founder-Market Fit
  const founderMarketFitFactors = [
    { label: 'Domain Expert Founder(s)', points: 3, detected: signals.domain_expertise === 'expert', signalKey: 'domain_expertise' },
    { label: 'Experienced in Core Domain', points: 2, detected: signals.domain_expertise === 'experienced', signalKey: 'domain_expertise' },
    { label: 'Founder is Technical', points: 2, detected: signals.technical_background === true, signalKey: 'technical_background' },
    { label: 'Deep Industry Experience', points: 2, detected: signals.industry_experience === 'deep', signalKey: 'industry_experience' },
    { label: 'Some Industry Experience', points: 1, detected: signals.industry_experience === 'some', signalKey: 'industry_experience' },
    { label: 'Strong Track Record of Launching', points: 2, detected: signals.execution_track_record === 'strong', signalKey: 'execution_track_record' },
    { label: 'Some Track Record of Launching', points: 1, detected: signals.execution_track_record === 'some', signalKey: 'execution_track_record' },
    { label: 'Zero Prior Domain Knowledge', points: -2, detected: signals.domain_expertise === 'none', signalKey: 'domain_expertise' },
    { label: 'Domain is in Learning Phase', points: -1, detected: signals.domain_expertise === 'learning', signalKey: 'domain_expertise' },
    { label: 'Zero Core Industry Experience', points: -1, detected: signals.industry_experience === 'none', signalKey: 'industry_experience' },
    { label: 'Zero Launching Track Record', points: -1, detected: signals.execution_track_record === 'none', signalKey: 'execution_track_record' },
    { label: 'Founder Can Code Directly', points: 2, detected: signals.technical_background_choice === 'can_code', signalKey: 'technical_background_choice' },
    { label: 'Founder Used to Code', points: 1, detected: signals.technical_background_choice === 'used_to_code', signalKey: 'technical_background_choice' },
    { label: 'Team features Technical Co-Founder', points: 1, detected: signals.founder_count === 'team' && signals.has_technical_cofounder === true, signalKey: 'has_technical_cofounder' }
  ];
  const founderMarketFitKeys: (keyof ExtractedSignals)[] = [
    'domain_expertise', 'technical_background', 'industry_experience', 'execution_track_record', 'credibility'
  ];

  return {
    investor_appeal: evaluateDimension(5, investorAppealFactors, investorAppealKeys),
    customer_demand: evaluateDimension(5, customerDemandFactors, customerDemandKeys),
    market_timing: evaluateDimension(5, marketTimingFactors, marketTimingKeys),
    technical_feasibility: evaluateDimension(5, technicalFeasibilityFactors, technicalFeasibilityKeys),
    competitive_moat: evaluateDimension(5, competitiveMoatFactors, competitiveMoatKeys),
    founder_market_fit: evaluateDimension(5, founderMarketFitFactors, founderMarketFitKeys),
  };
}
