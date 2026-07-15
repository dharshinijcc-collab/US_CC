"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectRedFlags = detectRedFlags;
exports.runRuleEngine = runRuleEngine;
function detectRedFlags(signals) {
    const flags = [];
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
function runRuleEngine(signals, ruleModifiers) {
    const getPoints = (label, defaultPoints) => {
        if (ruleModifiers && ruleModifiers[label] !== undefined) {
            return Number(ruleModifiers[label]);
        }
        return defaultPoints;
    };
    const evaluateDimension = (baseScore, factorsList, dimensionSignalsKeys) => {
        let positiveAdjustments = 0;
        let negativeAdjustments = 0;
        const factors = [];
        const activeFactors = [];
        const positiveSignals = [];
        const negativeSignals = [];
        const neutralSignals = [];
        factorsList.forEach(f => {
            const scoringFactor = {
                label: f.label,
                points: f.points,
                detected: f.detected,
                signal_key: f.signalKey
            };
            factors.push(scoringFactor);
            // Keep track of neutral/inactive factors
            if (!f.detected) {
                neutralSignals.push(f.label);
            }
            else {
                activeFactors.push(scoringFactor);
                if (f.points > 0) {
                    positiveAdjustments += f.points;
                    positiveSignals.push(f.label);
                }
                else if (f.points < 0) {
                    negativeAdjustments += f.points;
                    negativeSignals.push(f.label);
                }
                else {
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
        { label: 'Large Addressable Market', points: getPoints('Large Addressable Market', 2), detected: signals.market_size === 'large', signalKey: 'market_size' },
        { label: 'Medium Addressable Market', points: getPoints('Medium Addressable Market', 1), detected: signals.market_size === 'medium', signalKey: 'market_size' },
        { label: 'Subscription / Recurring Revenue', points: getPoints('Subscription / Recurring Revenue', 2), detected: ['subscription', 'usage_based', 'freemium'].includes(signals.revenue_model), signalKey: 'revenue_model' },
        { label: 'One-Time Revenue Model', points: getPoints('One-Time Revenue Model', -1), detected: signals.revenue_model === 'one_time', signalKey: 'revenue_model' },
        { label: 'High Scalability Potential', points: getPoints('High Scalability Potential', 2), detected: signals.scalability === 'high', signalKey: 'scalability' },
        { label: 'Moderate Scalability Potential', points: getPoints('Moderate Scalability Potential', 1), detected: signals.scalability === 'moderate', signalKey: 'scalability' },
        { label: 'Strong Exit Potential', points: getPoints('Strong Exit Potential', 1), detected: signals.exit_potential === 'high', signalKey: 'exit_potential' },
        { label: 'Active Investor Interest in Space', points: getPoints('Active Investor Interest in Space', 1), detected: signals.investor_interest_in_space === 'high', signalKey: 'investor_interest_in_space' },
        { label: 'High Growth Potential', points: getPoints('High Growth Potential', 1), detected: signals.growth_potential === 'high', signalKey: 'growth_potential' },
        { label: 'Small Addressable Market', points: getPoints('Small Addressable Market', -2), detected: signals.market_size === 'small', signalKey: 'market_size' },
        { label: 'Low Scalability Potential', points: getPoints('Low Scalability Potential', -1), detected: signals.scalability === 'low', signalKey: 'scalability' },
        { label: 'Active Funding Stage (Raising/Raised)', points: getPoints('Active Funding Stage (Raising/Raised)', 1), detected: ['raising', 'raised'].includes(signals.funding_status), signalKey: 'funding_status' },
        { label: 'Validated with Paying Customers', points: getPoints('Validated with Paying Customers', 4), detected: signals.validation_level === 'paying_customers', signalKey: 'validation_level' },
        { label: 'Validated with Waitlist', points: getPoints('Validated with Waitlist', 2), detected: signals.validation_level === 'waitlist', signalKey: 'validation_level' },
        { label: 'Validated with User Conversations', points: getPoints('Validated with User Conversations', 1), detected: signals.validation_level === 'conversations', signalKey: 'validation_level' },
        { label: 'No Prior Validation Done', points: getPoints('No Prior Validation Done', -2), detected: signals.validation_level === 'none', signalKey: 'validation_level' },
        { label: 'Targeting Mass Market', points: getPoints('Targeting Mass Market', 3), detected: signals.market_size_choice === 'mass_market', signalKey: 'market_size_choice' },
        { label: 'Targeting Large Market Segment', points: getPoints('Targeting Large Market Segment', 2), detected: signals.market_size_choice === 'large', signalKey: 'market_size_choice' },
        { label: 'Targeting Medium Market Segment', points: getPoints('Targeting Medium Market Segment', 1), detected: signals.market_size_choice === 'medium', signalKey: 'market_size_choice' },
        { label: 'Targeting Small/Niche Market Segment', points: getPoints('Targeting Small/Niche Market Segment', -2), detected: signals.market_size_choice === 'small', signalKey: 'market_size_choice' }
    ];
    const investorAppealKeys = [
        'market_size', 'revenue_model', 'scalability', 'exit_potential', 'investor_interest_in_space', 'growth_potential'
    ];
    // 2. Customer Demand
    const customerDemandFactors = [
        { label: 'Severe Customer Pain Point', points: getPoints('Severe Customer Pain Point', 3), detected: signals.pain_severity === 'severe', signalKey: 'pain_severity' },
        { label: 'Moderate Customer Pain Point', points: getPoints('Moderate Customer Pain Point', 1), detected: signals.pain_severity === 'moderate', signalKey: 'pain_severity' },
        { label: 'Frequent Problem Occurrence (Daily/Weekly)', points: getPoints('Frequent Problem Occurrence (Daily/Weekly)', 2), detected: ['daily', 'weekly'].includes(signals.problem_frequency), signalKey: 'problem_frequency' },
        { label: 'Existing Buyers/Users Present', points: getPoints('Existing Buyers/Users Present', 2), detected: signals.existing_buyers === true, signalKey: 'existing_buyers' },
        { label: 'Clear ROI for Buyer', points: getPoints('Clear ROI for Buyer', 2), detected: signals.clear_roi === true, signalKey: 'clear_roi' },
        { label: 'High Willingness to Pay', points: getPoints('High Willingness to Pay', 1), detected: signals.willingness_to_pay === 'high', signalKey: 'willingness_to_pay' },
        { label: 'Nice-to-Have Product Concept', points: getPoints('Nice-to-Have Product Concept', -2), detected: signals.nice_to_have === true, signalKey: 'nice_to_have' },
        { label: 'Low Willingness to Pay', points: getPoints('Low Willingness to Pay', -2), detected: signals.willingness_to_pay === 'low', signalKey: 'willingness_to_pay' },
        { label: 'Infrequent Problem Occurrence', points: getPoints('Infrequent Problem Occurrence', -2), detected: signals.problem_frequency === 'rare', signalKey: 'problem_frequency' },
        { label: 'Mild Customer Pain Point', points: getPoints('Mild Customer Pain Point', -1), detected: signals.pain_severity === 'mild', signalKey: 'pain_severity' },
        { label: 'Proven Demand via Paying Customers', points: getPoints('Proven Demand via Paying Customers', 5), detected: signals.validation_level === 'paying_customers', signalKey: 'validation_level' },
        { label: 'Proven Demand via Waitlist Signups', points: getPoints('Proven Demand via Waitlist Signups', 3), detected: signals.validation_level === 'waitlist', signalKey: 'validation_level' },
        { label: 'Proven Demand via Interviews', points: getPoints('Proven Demand via Interviews', 1), detected: signals.validation_level === 'conversations', signalKey: 'validation_level' },
        { label: 'Zero Validated Demand', points: getPoints('Zero Validated Demand', -2), detected: signals.validation_level === 'none', signalKey: 'validation_level' },
        { label: 'Critical Pain Score (8-10)', points: getPoints('Critical Pain Score (8-10)', 2), detected: signals.pain_score >= 8, signalKey: 'pain_score' },
        { label: 'Elevated Pain Score (5-7)', points: getPoints('Elevated Pain Score (5-7)', 1), detected: signals.pain_score >= 5 && signals.pain_score <= 7, signalKey: 'pain_score' },
        { label: 'Low Pain Score (1-4)', points: getPoints('Low Pain Score (1-4)', -1), detected: signals.pain_score <= 4, signalKey: 'pain_score' }
    ];
    const customerDemandKeys = [
        'pain_severity', 'problem_frequency', 'existing_buyers', 'clear_roi', 'nice_to_have', 'willingness_to_pay'
    ];
    // 3. Market Timing
    const marketTimingFactors = [
        { label: 'Fast-Growing Industry Segment', points: getPoints('Fast-Growing Industry Segment', 3), detected: signals.industry_growth === 'fast', signalKey: 'industry_growth' },
        { label: 'Moderate Industry Segment Growth', points: getPoints('Moderate Industry Segment Growth', 1), detected: signals.industry_growth === 'moderate', signalKey: 'industry_growth' },
        { label: 'Technology Ready for Commercial Deployment', points: getPoints('Technology Ready for Commercial Deployment', 2), detected: signals.technology_maturity === 'ready', signalKey: 'technology_maturity' },
        { label: 'Emerging Technology Stack', points: getPoints('Emerging Technology Stack', 1), detected: signals.technology_maturity === 'emerging', signalKey: 'technology_maturity' },
        { label: 'Growing Consumer/Enterprise Adoption Curve', points: getPoints('Growing Consumer/Enterprise Adoption Curve', 2), detected: signals.consumer_adoption === 'growing', signalKey: 'consumer_adoption' },
        { label: 'Supportive Regulatory Framework', points: getPoints('Supportive Regulatory Framework', 1), detected: signals.regulatory_environment === 'supportive', signalKey: 'regulatory_environment' },
        { label: 'Too Early for Commercial Scaling', points: getPoints('Too Early for Commercial Scaling', -3), detected: signals.too_early === true, signalKey: 'too_early' },
        { label: 'Declining Industry Core Growth', points: getPoints('Declining Industry Core Growth', -3), detected: signals.industry_growth === 'declining', signalKey: 'industry_growth' },
        { label: 'Restrictive Regulatory Environment', points: getPoints('Restrictive Regulatory Environment', -2), detected: signals.regulatory_environment === 'restrictive', signalKey: 'regulatory_environment' },
        { label: 'Technology Stack Unripe / Unproven', points: getPoints('Technology Stack Unripe / Unproven', -2), detected: signals.technology_maturity === 'not_ready', signalKey: 'technology_maturity' },
        { label: 'Strong "Why Now" Case', points: getPoints('Strong "Why Now" Case', 3), detected: signals.why_now_strength === 'strong', signalKey: 'why_now_strength' },
        { label: 'Moderate "Why Now" Case', points: getPoints('Moderate "Why Now" Case', 1), detected: signals.why_now_strength === 'moderate', signalKey: 'why_now_strength' },
        { label: 'Weak "Why Now" Case', points: getPoints('Weak "Why Now" Case', -2), detected: signals.why_now_strength === 'weak', signalKey: 'why_now_strength' }
    ];
    const marketTimingKeys = [
        'industry_growth', 'technology_maturity', 'consumer_adoption', 'regulatory_environment', 'too_early'
    ];
    // 4. Technical Feasibility
    const technicalFeasibilityFactors = [
        { label: 'Existing Ecosystem APIs/APIs Available', points: getPoints('Existing Ecosystem APIs/APIs Available', 3), detected: signals.existing_apis_available === true, signalKey: 'existing_apis_available' },
        { label: 'Simple MVP Development Path', points: getPoints('Simple MVP Development Path', 2), detected: signals.mvp_complexity === 'simple', signalKey: 'mvp_complexity' },
        { label: 'Moderate MVP Development Path', points: getPoints('Moderate MVP Development Path', 1), detected: signals.mvp_complexity === 'moderate', signalKey: 'mvp_complexity' },
        { label: 'Low Infrastructure Complexity', points: getPoints('Low Infrastructure Complexity', 1), detected: signals.infrastructure_complexity === 'low', signalKey: 'infrastructure_complexity' },
        { label: 'Basic R&D or Scientific Research Required', points: getPoints('Basic R&D or Scientific Research Required', -3), detected: signals.mvp_complexity === 'research_required', signalKey: 'mvp_complexity' },
        { label: 'Requires Custom New Hardware', points: getPoints('Requires Custom New Hardware', -2), detected: signals.requires_new_hardware === true, signalKey: 'requires_new_hardware' },
        { label: 'Complex Frontend/Backend MVP Scope', points: getPoints('Complex Frontend/Backend MVP Scope', -1), detected: signals.mvp_complexity === 'complex', signalKey: 'mvp_complexity' },
        { label: 'High Infrastructure / Server Complexity', points: getPoints('High Infrastructure / Server Complexity', -1), detected: signals.infrastructure_complexity === 'high', signalKey: 'infrastructure_complexity' },
        { label: 'Concept Phase / Ideation Stage', points: getPoints('Concept Phase / Ideation Stage', -2), detected: signals.current_stage === 'forming', signalKey: 'current_stage' },
        { label: 'Prototype / Wired Interactive Stage', points: getPoints('Prototype / Wired Interactive Stage', 2), detected: signals.current_stage === 'prototype', signalKey: 'current_stage' },
        { label: 'Launched MVP Stage', points: getPoints('Launched MVP Stage', 4), detected: signals.current_stage === 'mvp', signalKey: 'current_stage' }
    ];
    const technicalFeasibilityKeys = [
        'existing_apis_available', 'mvp_complexity', 'requires_new_hardware', 'ai_dependency', 'infrastructure_complexity'
    ];
    // 5. Competitive Moat
    const competitiveMoatFactors = [
        { label: 'Proprietary Data Accumulation Loop', points: getPoints('Proprietary Data Accumulation Loop', 3), detected: signals.has_proprietary_data === true, signalKey: 'has_proprietary_data' },
        { label: 'Organic Network Effects Loop', points: getPoints('Organic Network Effects Loop', 3), detected: signals.has_network_effects === true, signalKey: 'has_network_effects' },
        { label: 'High Switching Costs for Customers', points: getPoints('High Switching Costs for Customers', 2), detected: signals.switching_costs === 'high', signalKey: 'switching_costs' },
        { label: 'Moderate Customer Switching Costs', points: getPoints('Moderate Customer Switching Costs', 1), detected: signals.switching_costs === 'medium', signalKey: 'switching_costs' },
        { label: 'Strong Product Differentiation', points: getPoints('Strong Product Differentiation', 2), detected: signals.differentiation === 'strong', signalKey: 'differentiation' },
        { label: 'Moderate Product Differentiation', points: getPoints('Moderate Product Differentiation', 1), detected: signals.differentiation === 'moderate', signalKey: 'differentiation' },
        { label: 'Product is Extremely Easy to Clone', points: getPoints('Product is Extremely Easy to Clone', -3), detected: signals.easy_to_copy === true, signalKey: 'easy_to_copy' },
        { label: 'Very High Competitive Saturation', points: getPoints('Very High Competitive Saturation', -2), detected: signals.competition_level === 'very_high', signalKey: 'competition_level' },
        { label: 'High Competitive Saturation', points: getPoints('High Competitive Saturation', -1), detected: signals.competition_level === 'high', signalKey: 'competition_level' },
        { label: 'Weak Core Differentiation', points: getPoints('Weak Core Differentiation', -2), detected: signals.differentiation === 'weak', signalKey: 'differentiation' },
        { label: 'Low Customer Switching Costs', points: getPoints('Low Customer Switching Costs', -1), detected: signals.switching_costs === 'low', signalKey: 'switching_costs' },
        { label: 'Defensible Competitor Moat', points: getPoints('Defensible Competitor Moat', 3), detected: signals.moat_strength === 'strong', signalKey: 'moat_strength' },
        { label: 'Moderate Defensibility Moat', points: getPoints('Moderate Defensibility Moat', 1), detected: signals.moat_strength === 'moderate', signalKey: 'moat_strength' },
        { label: 'No Moat / Low Defensibility', points: getPoints('No Moat / Low Defensibility', -2), detected: signals.moat_strength === 'weak', signalKey: 'moat_strength' }
    ];
    const competitiveMoatKeys = [
        'has_proprietary_data', 'has_network_effects', 'switching_costs', 'differentiation', 'competition_level', 'easy_to_copy'
    ];
    // 6. Founder-Market Fit
    const founderMarketFitFactors = [
        { label: 'Domain Expert Founder(s)', points: getPoints('Domain Expert Founder(s)', 3), detected: signals.domain_expertise === 'expert', signalKey: 'domain_expertise' },
        { label: 'Experienced in Core Domain', points: getPoints('Experienced in Core Domain', 2), detected: signals.domain_expertise === 'experienced', signalKey: 'domain_expertise' },
        { label: 'Founder is Technical', points: getPoints('Founder is Technical', 2), detected: signals.technical_background === true, signalKey: 'technical_background' },
        { label: 'Deep Industry Experience', points: getPoints('Deep Industry Experience', 2), detected: signals.industry_experience === 'deep', signalKey: 'industry_experience' },
        { label: 'Some Industry Experience', points: getPoints('Some Industry Experience', 1), detected: signals.industry_experience === 'some', signalKey: 'industry_experience' },
        { label: 'Strong Track Record of Launching', points: getPoints('Strong Track Record of Launching', 2), detected: signals.execution_track_record === 'strong', signalKey: 'execution_track_record' },
        { label: 'Some Track Record of Launching', points: getPoints('Some Track Record of Launching', 1), detected: signals.execution_track_record === 'some', signalKey: 'execution_track_record' },
        { label: 'Zero Prior Domain Knowledge', points: getPoints('Zero Prior Domain Knowledge', -2), detected: signals.domain_expertise === 'none', signalKey: 'domain_expertise' },
        { label: 'Domain is in Learning Phase', points: getPoints('Domain is in Learning Phase', -1), detected: signals.domain_expertise === 'learning', signalKey: 'domain_expertise' },
        { label: 'Zero Core Industry Experience', points: getPoints('Zero Core Industry Experience', -1), detected: signals.industry_experience === 'none', signalKey: 'industry_experience' },
        { label: 'Zero Launching Track Record', points: getPoints('Zero Launching Track Record', -1), detected: signals.execution_track_record === 'none', signalKey: 'execution_track_record' },
        { label: 'Founder Can Code Directly', points: getPoints('Founder Can Code Directly', 2), detected: signals.technical_background_choice === 'can_code', signalKey: 'technical_background_choice' },
        { label: 'Founder Used to Code', points: getPoints('Founder Used to Code', 1), detected: signals.technical_background_choice === 'used_to_code', signalKey: 'technical_background_choice' },
        { label: 'Team features Technical Co-Founder', points: getPoints('Team features Technical Co-Founder', 1), detected: signals.founder_count === 'team' && signals.has_technical_cofounder === true, signalKey: 'has_technical_cofounder' }
    ];
    const founderMarketFitKeys = [
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
