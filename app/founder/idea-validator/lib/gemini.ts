import { GoogleGenAI } from '@google/genai';
import { ScoringResponse, DimensionDetail, QAAnswers, DIMENSION_META, TRIAGE_CONFIG } from '../types/scoring';
import { CURATED_STARTUPS } from './startups';

// Helper to generate realistic mock narratives dynamically (Fallback Mode)
export function generateMockNarratives(
  idea: string,
  answers: QAAnswers,
  scores: {
    startup_quality_score: number;
    investor_readiness_score: number;
    overall_score: number;
    triage_band: string;
    confidence_level: number;
    evidence_score: number;
    investment_probability: number;
    confidence_breakdown: any;
    evidence_checklist: any;
    score_sensitivity: any;
    buildtime_estimator: any;
  },
  dimensions: Record<string, any>,
  redFlags: any[]
): ScoringResponse {
  const getDimensionLabel = (key: string): string => {
    return DIMENSION_META.find(d => d.key === key)?.label || key;
  };

  // Find highest and lowest scoring dimensions
  let highestDim = 'customer_demand';
  let lowestDim = 'competitive_moat';
  let highestScore = -1;
  let lowestScore = 11;

  Object.entries(dimensions).forEach(([key, value]) => {
    if (value.score > highestScore) {
      highestScore = value.score;
      highestDim = key;
    }
    if (value.score < lowestScore) {
      lowestScore = value.score;
      lowestDim = key;
    }
  });

  const overallReason = `The overall venture readiness score of ${scores.overall_score}/10 places this concept in the "${scores.triage_band}" triage band. This rating reflects strong indications in ${getDimensionLabel(highestDim)} (scoring ${highestScore}/10) offset by structural risks in ${getDimensionLabel(lowestDim)} (scoring ${lowestScore}/10). The concept targets a viable problem space, but requires targeted validation of the core business model and switching costs.`;

  const dimensionNarratives: Record<string, DimensionDetail> = {};

  Object.entries(dimensions).forEach(([key, dim]: [string, any]) => {
    const label = getDimensionLabel(key);

    // Build Timeline gets a custom narrative referencing actual estimator data
    if (key === 'build_timeline') {
      const tl = scores.buildtime_estimator;
      dimensionNarratives[key] = {
        score: dim.score,
        confidence: dim.confidence,
        evaluation_criteria: dim.factors.map((f: any) => f.label),
        why_this_score: `The Build Timeline score of ${dim.score}/10 reflects this team's execution readiness from a product engineering perspective. Based on the current stage (${answers.current_stage}), technical background, and MVP complexity, the estimated build window is approximately ${tl?.timeline_months ?? '?'} month(s) with ${tl?.engineering_complexity ?? 'medium'} engineering complexity. ${dim.positive_signals.length > 0 ? `Positive indicators include: ${dim.positive_signals.slice(0, 2).join(' and ')}.` : ''} ${dim.negative_signals.length > 0 ? `Build risks include: ${dim.negative_signals.slice(0, 2).join(' and ')}.` : ''} A faster timeline with lower complexity translates directly to lower burn, faster learning cycles, and earlier customer feedback loops — all of which significantly improve the investment profile.`,
        positive_signals: dim.positive_signals.length > 0 ? dim.positive_signals : ['Basic build infrastructure identified'],
        negative_signals: dim.negative_signals.length > 0 ? dim.negative_signals : ['No build has been started yet'],
        improvement_actions: [
          `Advance to the next build stage (${answers.current_stage === 'forming' ? 'create interactive wireframes' : answers.current_stage === 'ux_design' ? 'build a clickable prototype' : 'launch an MVP with at least one working workflow'}) to reduce timeline risk.`,
          `Identify and integrate existing APIs or SaaS tools (Stripe, Auth0, Firebase) to avoid reinventing core infrastructure and compress development by 20–30%.`,
          tl?.engineering_complexity === 'high'
            ? 'Consider scoping down the initial MVP to reduce engineering complexity — focus on one core workflow that delivers immediate user value.'
            : 'Recruit a technical co-founder or lead engineer to own the engineering roadmap and reduce delivery timeline risk.'
        ],
        base_score: dim.base_score,
        positive_adjustments: dim.positive_adjustments,
        negative_adjustments: dim.negative_adjustments,
        neutral_signals: dim.neutral_signals
      };
      return;
    }

    dimensionNarratives[key] = {
      score: dim.score,
      confidence: dim.confidence,
      evaluation_criteria: dim.factors.map((f: any) => f.label),
      why_this_score: `The score of ${dim.score}/10 for ${label} is determined by several active factors. Specifically, the presence of ${dim.positive_signals.slice(0, 2).join(' and ') || 'basic elements'} provides a positive baseline. However, concerns regarding ${dim.negative_signals.slice(0, 2).join(' or ') || 'unvalidated assumptions'} limit the upside. This indicates that while the fundamentals are in place, further operational proof points are required to increase conviction.`,
      positive_signals: dim.positive_signals.length > 0 ? dim.positive_signals : ['Basic concept established'],
      negative_signals: dim.negative_signals.length > 0 ? dim.negative_signals : ['Unvalidated market assumptions'],
      improvement_actions: [
        `Conduct 10+ detailed customer interviews focusing specifically on ${label.toLowerCase()} friction.`,
        `Draft a detailed case study or simulation showing how your solution directly impacts ${label.toLowerCase()}.`,
        `Analyze historical benchmarks of competitive models in this dimension to optimize performance.`
      ],
      base_score: dim.base_score,
      positive_adjustments: dim.positive_adjustments,
      negative_adjustments: dim.negative_adjustments,
      neutral_signals: dim.neutral_signals
    };
  });


  // Pick mock comparable startups from curated list
  const mockComps = CURATED_STARTUPS.slice(0, 3).map(c => ({
    name: c.name,
    description: c.description,
    why_comparable: `Shares a similar structural approach in the ${c.domain} space, validating the scalability of the business model.`,
    business_model: c.business_model,
    lessons_learned: c.key_lesson
  }));

  return {
    overall_score: scores.overall_score,
    startup_quality_score: scores.startup_quality_score,
    investor_readiness_score: scores.investor_readiness_score,
    triage_band: scores.triage_band as any,
    confidence_level: scores.confidence_level,
    startup_summary: `A startup aimed at solving the following problem: "${answers.problem}" for target customer segment: "${answers.customer}". The proposed solution leverages key domain insights to address a pain score of ${answers.pain_score}/10, currently operating in the ${answers.current_stage} stage with a ${answers.funding_status} model.`,
    why_this_score: overallReason,
    biggest_assumption: `The primary leap-of-faith assumption is that the target customer (${answers.customer}) will switch from their current manual workflows or incumbent competitors to adopt this solution, despite the existing switching costs.`,
    missing_evidence: `There is currently a lack of quantitative evidence (e.g. paying pilot contracts or locked letter-of-intent agreements) to prove customer willingness to pay specifically for this value proposition.`,
    what_increased_the_score: [
      `Founder has a technical background (${answers.technical_background === 'can_code' ? 'can code directly' : 'used to code'}) which reduces execution risk.`,
      `Target market size is perceived as ${answers.market_size_choice} which leaves substantial room for scaling.`,
      `Validation stage includes ${answers.validation_level} which indicates active user engagement.`
    ],
    what_reduced_the_score: [
      `Operating in the ${answers.current_stage} stage means substantial execution, engineering, and roadmap risks remain.`,
      `The competitive moat is currently described as "${answers.moat.substring(0, 60)}...", which suggests incumbents could copy features quickly.`,
      `No paying customers have been locked in yet, keeping the revenue model hypothetical.`
    ],
    how_to_improve: [
      `Secure 3 non-binding Letters of Intent (LOIs) from target buyers to validate purchasing authority and willingness to pay.`,
      `Develop a clickable interactive prototype to run user validation tests on the core workflow.`,
      `Draft a quantitative competitive comparison chart highlighting a 10x workflow improvement vs. existing solutions.`
    ],
    investor_questions: [
      `What specific features or data integrations create high switching costs that will prevent users from returning to competitors?`,
      `What is the customer acquisition cost (CAC) payback period model, and how does it scale in this market segment?`,
      `How will the founder assemble the initial core engineering team to deliver the V1 roadmap on schedule?`
    ],
    highest_scoring_dimension: getDimensionLabel(highestDim),
    lowest_scoring_dimension: getDimensionLabel(lowestDim),
    is_mock: true,
    
    evidence_score: scores.evidence_score,
    investment_probability: scores.investment_probability,
    confidence_breakdown: scores.confidence_breakdown,
    evidence_checklist: scores.evidence_checklist,
    score_sensitivity: scores.score_sensitivity,
    investor_red_flags: redFlags,
    buildtime_estimator: scores.buildtime_estimator,
    
    risk_matrix: {
      market: { severity: 'medium', reason: 'Unvalidated buyer demand details.', mitigation: 'Run landing page landing tests.' },
      execution: { severity: 'high', reason: 'Forming stage product build risk.', mitigation: 'Leverage strict agile milestones.' },
      funding: { severity: 'medium', reason: 'Capital required to onboard cofounders.', mitigation: 'Apply bootstrapping structures.' },
      competition: { severity: 'medium', reason: 'Incumbents have high switching costs.', mitigation: 'Build workflow integrations.' },
      technical: { severity: 'low', reason: 'Relies on standard APIs.', mitigation: 'Use serverless infrastructure.' },
      legal: { severity: 'low', reason: 'Standard data privacy policies.', mitigation: 'Draft standard customer agreements.' },
      operational: { severity: 'low', reason: 'Light operations workload.', mitigation: 'Keep headcount flat.' }
    },
    
    validation_roadmap: [
      { phase: 'Phase 1: Validation', task: 'Interview 15 customers to map friction points', timeline: 'Weeks 1-2', impact: 'Reduces demand risk', effort: 'Low', expected_score_improvement: '+0.6' },
      { phase: 'Phase 2: Prototyping', task: 'Design and build clickable web wireframes', timeline: 'Weeks 3-4', impact: 'Validates usability', effort: 'Medium', expected_score_improvement: '+0.8' },
      { phase: 'Phase 3: Launch Prep', task: 'Set up landing page and waitlist collection', timeline: 'Week 5', impact: 'Establishes initial lead pool', effort: 'Low', expected_score_improvement: '+1.2' },
      { phase: 'Phase 4: Build', task: 'Deploy v1 MVP software with payment gateways', timeline: 'Weeks 6-10', impact: 'Product launch', effort: 'High', expected_score_improvement: '+1.5' },
    ],
    
    comparable_startups: mockComps,
    
    due_diligence_questions: {
      market: [{ question: 'How big is the specific wedge segment you are targeting initially?', expected_evidence: 'TAM bottom-up sheet', suggested_prep: 'Map customer count * average price' }],
      customer: [{ question: 'Why will customers change from current manual habits?', expected_evidence: 'Interview testimonials', suggested_prep: 'Synthesize pain points from 10 discovery call transcripts' }],
      revenue: [{ question: 'What is the pricing model validation basis?', expected_evidence: 'LOI payment terms', suggested_prep: 'Quote pricing responses from early pilots' }],
      technology: [{ question: 'What are the main third-party API dependencies?', expected_evidence: 'Architecture diagrams', suggested_prep: 'Document fallback protocols for service outages' }],
      competition: [{ question: 'How will you protect your core workflow from clones?', expected_evidence: 'Moat features list', suggested_prep: 'Highlight proprietary dataset loops' }],
      operations: [{ question: 'How will customer success be supported initially?', expected_evidence: 'Operations flow charts', suggested_prep: 'Define automated support templates' }],
      legal: [{ question: 'Are there specific regulatory compliances required?', expected_evidence: 'Legal counsel memos', suggested_prep: 'Establish GDPR compliance audit specs' }],
      financial: [{ question: 'What is the projected cash runway in the next 12 months?', expected_evidence: 'Financial budget spreadsheet', suggested_prep: 'Model monthly expenses and contractor costs' }]
    },
    
    co_founder_recommendations: 'Recruit a technical co-founder who can own the frontend/backend engineering roadmap, enabling the domain expert founder to focus purely on customer acquisition, user research, and strategic fundraising loops.',
    
    investor_memo: {
      executive_summary: 'An early-stage opportunity focusing on a validated customer pain point, seeking to modernize workflows via scalable digital endpoints.',
      investment_thesis: 'By automating repetitive administrative overhead, this solution unlocks immediate time savings, establishing a sticky platform with proprietary data loop potential.',
      strengths: 'Strong founder domain experience and high perceived user pain.',
      weaknesses: 'Early stage of development and low current validation barrier proof points.',
      major_risks: 'High competitive replication risk and customer adoption friction.',
      recommendation: scores.overall_score >= 7.5 ? 'Strong Pass' : scores.overall_score >= 4.5 ? 'Proceed Carefully' : 'Monitor',
      confidence_rating: 'Medium - based on current questionnaire details',
      next_validation_step: 'Conduct 10 discovery calls and build interactive wireframe designs.'
    },
    
    dimensions: dimensionNarratives as any
  };
}

export async function generateNarrative(
  idea: string,
  answers: QAAnswers,
  scores: {
    startup_quality_score: number;
    investor_readiness_score: number;
    overall_score: number;
    triage_band: string;
    confidence_level: number;
    evidence_score: number;
    investment_probability: number;
    confidence_breakdown: any;
    evidence_checklist: any;
    score_sensitivity: any;
    buildtime_estimator: any;
  },
  dimensions: Record<string, any>,
  redFlags: any[],
  apiKey: string | undefined
): Promise<ScoringResponse> {
  const useMockAI = process.env.USE_MOCK_AI === 'true' || !apiKey;

  if (useMockAI) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return generateMockNarratives(idea, answers, scores, dimensions, redFlags);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey! });

    const systemPrompt = `You are an expert venture capital investment analyst writing a premium, investor-grade startup due diligence report.
Your role is to write narrative explanations, risk mitigation plans, comparable startup analyses, and investor memos that strictly align with the pre-computed scores and signals.
You must NOT change or contradict any score.

CURATED DATABASE OF ELIGIBLE COMPARABLE STARTUPS (Select exactly 3-5 that best match the sector of this startup):
${JSON.stringify(CURATED_STARTUPS, null, 2)}

Provide the response in strict JSON matching this exact structure:
{
  "startup_summary": "Brief 1-paragraph summary of the opportunity",
  "why_this_score": "Comprehensive explanation of why the overall score was assigned based on the dimension scores, stage, and validation level.",
  "biggest_assumption": "The primary unvalidated leap-of-faith assumption (e.g. Willingness to pay, user behavior changes)",
  "missing_evidence": "The single most critical missing proof point (e.g. Locked pilots, waitlist size, demo engagement metrics)",
  "what_increased_the_score": ["Enhancer 1", "Enhancer 2", "Enhancer 3"],
  "what_reduced_the_score": ["Detractor 1", "Detractor 2", "Detractor 3"],
  "how_to_improve": ["Action 1", "Action 2", "Action 3"],
  "investor_questions": ["Question 1", "Question 2", "Question 3"],
  "highest_scoring_dimension": "Name of highest dimension",
  "lowest_scoring_dimension": "Name of lowest dimension",
  
  "risk_matrix": {
    "market": { "severity": "high"|"medium"|"low", "reason": "why", "mitigation": "how to mitigate" },
    "execution": { "severity": "high"|"medium"|"low", "reason": "why", "mitigation": "how to mitigate" },
    "funding": { "severity": "high"|"medium"|"low", "reason": "why", "mitigation": "how to mitigate" },
    "competition": { "severity": "high"|"medium"|"low", "reason": "why", "mitigation": "how to mitigate" },
    "technical": { "severity": "high"|"medium"|"low", "reason": "why", "mitigation": "how to mitigate" },
    "legal": { "severity": "high"|"medium"|"low", "reason": "why", "mitigation": "how to mitigate" },
    "operational": { "severity": "high"|"medium"|"low", "reason": "why", "mitigation": "how to mitigate" }
  },
  
  "validation_roadmap": [
    { "phase": "Phase 1: Validation", "task": "Specific task", "timeline": "Weeks 1-2", "impact": "Impact statement", "effort": "Low"|"Medium"|"High", "expected_score_improvement": "+0.x" },
    { "phase": "Phase 2: MVP Design", "task": "Specific task", "timeline": "Weeks 3-4", "impact": "Impact statement", "effort": "Low"|"Medium"|"High", "expected_score_improvement": "+0.x" }
  ],
  
  "comparable_startups": [
    { "name": "Name from database", "description": "Description", "why_comparable": "Why this startup is similar structurally", "business_model": "Their business model", "lessons_learned": "Lesson" }
  ],
  
  "due_diligence_questions": {
    "market": [{ "question": "Question?", "expected_evidence": "Evidence required", "suggested_prep": "How to prep" }],
    "customer": [{ "question": "Question?", "expected_evidence": "Evidence required", "suggested_prep": "How to prep" }],
    "revenue": [{ "question": "Question?", "expected_evidence": "Evidence required", "suggested_prep": "How to prep" }],
    "technology": [{ "question": "Question?", "expected_evidence": "Evidence required", "suggested_prep": "How to prep" }],
    "competition": [{ "question": "Question?", "expected_evidence": "Evidence required", "suggested_prep": "How to prep" }],
    "operations": [{ "question": "Question?", "expected_evidence": "Evidence required", "suggested_prep": "How to prep" }],
    "legal": [{ "question": "Question?", "expected_evidence": "Evidence required", "suggested_prep": "How to prep" }],
    "financial": [{ "question": "Question?", "expected_evidence": "Evidence required", "suggested_prep": "How to prep" }]
  },
  
  "co_founder_recommendations": "Detailed advice on building the founding team based on founder profile.",
  
  "investor_memo": {
    "executive_summary": "Investor-grade memo summary.",
    "investment_thesis": "Why this opportunity could succeed.",
    "strengths": "Top strengths.",
    "weaknesses": "Key weaknesses.",
    "major_risks": "Top 2 risks.",
    "recommendation": "Pass" | "Monitor" | "Proceed Carefully" | "Strong Pass",
    "confidence_rating": "Confidence rating description",
    "next_validation_step": "Single immediate validation step"
  },
  
  "dimensions": {
    "investor_appeal": { "evaluation_criteria": [string], "why_this_score": "100-200 words explaining how market size, revenue model, scalability and validation level drove this score", "improvement_actions": [string, string, string] },
    "customer_demand": { "evaluation_criteria": [string], "why_this_score": "100-200 words explaining how pain severity, problem frequency, willingness to pay, and validation evidence drove this score", "improvement_actions": [string, string, string] },
    "market_timing": { "evaluation_criteria": [string], "why_this_score": "100-200 words explaining how industry growth, technology maturity, regulatory environment, and why-now strength drove this score", "improvement_actions": [string, string, string] },
    "technical_feasibility": { "evaluation_criteria": [string], "why_this_score": "100-200 words explaining how MVP complexity, infrastructure requirements, existing APIs, and development stage drove this score", "improvement_actions": [string, string, string] },
    "competitive_moat": { "evaluation_criteria": [string], "why_this_score": "100-200 words explaining how proprietary data, network effects, switching costs, and differentiation drove this score", "improvement_actions": [string, string, string] },
    "founder_market_fit": { "evaluation_criteria": [string], "why_this_score": "100-200 words explaining how domain expertise, technical background, industry experience, and execution track record drove this score", "improvement_actions": [string, string, string] },
    "build_timeline": { "evaluation_criteria": [string], "why_this_score": "100-200 words explaining how the founder's current build stage, technical capability, team composition, and product complexity affect how quickly this team can ship a working product. Reference the estimated timeline_months and engineering_complexity from the buildtime_estimator context.", "improvement_actions": [string, string, string] }
  }
}`;

    const prompt = `Idea description: ${idea}
Pre-calculated Scores:
- Startup Quality Score: ${scores.startup_quality_score}/10
- Investor Readiness Score: ${scores.investor_readiness_score}/10
- Overall Score: ${scores.overall_score}/10
- Evidence Score: ${scores.evidence_score}/10
- Investment Probability: ${scores.investment_probability}%
- Confidence Level: ${scores.confidence_level}%
- Red Flag Count: ${redFlags.length}

Detected Red Flags:
${JSON.stringify(redFlags, null, 2)}

Individual Dimension Scores & Signals:
- Investor Appeal: Score ${dimensions.investor_appeal.score}/10
- Customer Demand: Score ${dimensions.customer_demand.score}/10
- Market Timing: Score ${dimensions.market_timing.score}/10
- Technical Feasibility: Score ${dimensions.technical_feasibility.score}/10
- Competitive Moat: Score ${dimensions.competitive_moat.score}/10
- Founder-Market Fit: Score ${dimensions.founder_market_fit.score}/10
- Build Timeline: Score ${dimensions.build_timeline?.score ?? 'N/A'}/10 (Estimated ${scores.buildtime_estimator?.timeline_months ?? '?'} months | Complexity: ${scores.buildtime_estimator?.engineering_complexity ?? 'unknown'})

Founder answers for reference:
- Target Customer: ${answers.customer}
- Core Problem: ${answers.problem}
- Validation: ${answers.validation_level}
- Current Stage: ${answers.current_stage}
- Technical Background: ${answers.technical_background}
- Has Technical Co-Founder: ${answers.has_technical_cofounder ?? false}
- Why Now: ${answers.why_now}
- Competitors: ${answers.competitors}
- Moat: ${answers.moat}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [systemPrompt, prompt],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.6,
      }
    });

    const generated = JSON.parse(response.text || '{}');

    // Inject exact pre-computed scores and structures to guarantee AI cannot hallucinate math
    generated.overall_score = scores.overall_score;
    generated.startup_quality_score = scores.startup_quality_score;
    generated.investor_readiness_score = scores.investor_readiness_score;
    generated.triage_band = scores.triage_band;
    generated.confidence_level = scores.confidence_level;
    generated.evidence_score = scores.evidence_score;
    generated.investment_probability = scores.investment_probability;
    generated.confidence_breakdown = scores.confidence_breakdown;
    generated.evidence_checklist = scores.evidence_checklist;
    generated.score_sensitivity = scores.score_sensitivity;
    generated.investor_red_flags = redFlags;
    generated.buildtime_estimator = scores.buildtime_estimator;
    generated.is_mock = false;

    Object.keys(dimensions).forEach(k => {
      if (generated.dimensions?.[k]) {
        generated.dimensions[k].score = dimensions[k].score;
        generated.dimensions[k].confidence = dimensions[k].confidence;
        generated.dimensions[k].scoring_factors = dimensions[k].factors;
        generated.dimensions[k].base_score = dimensions[k].base_score;
        generated.dimensions[k].positive_adjustments = dimensions[k].positive_adjustments;
        generated.dimensions[k].negative_adjustments = dimensions[k].negative_adjustments;
        generated.dimensions[k].positive_signals = dimensions[k].positive_signals.length > 0 ? dimensions[k].positive_signals : ['Basic signals detected'];
        generated.dimensions[k].negative_signals = dimensions[k].negative_signals.length > 0 ? dimensions[k].negative_signals : ['Minor optimization opportunities'];
        generated.dimensions[k].neutral_signals = dimensions[k].neutral_signals;
      }
    });

    return generated as ScoringResponse;
  } catch (error) {
    console.error('Gemini narrative generation failed, falling back to mock:', error);
    return generateMockNarratives(idea, answers, scores, dimensions, redFlags);
  }
}
