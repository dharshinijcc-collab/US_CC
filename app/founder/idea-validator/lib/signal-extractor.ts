import { GoogleGenAI } from '@google/genai';
import { ExtractedSignals, QAAnswers } from '../types/scoring';

// Helper to generate dynamic mock signals based on Q&A answers
export function generateDynamicMockSignals(idea: string, answers: QAAnswers): ExtractedSignals {
  const containsKeyword = (text: string, keywords: string[]): boolean => {
    const lower = text.toLowerCase();
    return keywords.some(k => lower.includes(k));
  };

  const fullText = `${idea} ${answers.customer} ${answers.problem} ${answers.why_now} ${answers.competitors} ${answers.moat}`;

  // Infer Market Size signal
  let marketSize: ExtractedSignals['market_size'] = 'medium';
  if (containsKeyword(fullText, ['global', 'billion', 'millions', 'enterprise', 'huge', 'mass'])) {
    marketSize = 'large';
  } else if (containsKeyword(fullText, ['niche', 'local', 'small', 'family', 'shop'])) {
    marketSize = 'small';
  }

  // Infer Revenue Model signal
  let revenueModel: ExtractedSignals['revenue_model'] = 'subscription';
  if (answers.revenue_model_choice === 'one_time') {
    revenueModel = 'one_time';
  } else if (answers.revenue_model_choice === 'marketplace') {
    revenueModel = 'marketplace';
  } else if (answers.revenue_model_choice === 'advertising') {
    revenueModel = 'freemium';
  } else if (answers.revenue_model_choice === 'transaction_fee') {
    revenueModel = 'usage_based';
  }

  // Infer Scalability
  let scalability: ExtractedSignals['scalability'] = 'high';
  if (containsKeyword(fullText, ['hardware', 'consulting', 'agency', 'physical', 'manufacturing'])) {
    scalability = 'moderate';
  }

  // Infer Customer Pain Severity
  let painSeverity: ExtractedSignals['pain_severity'] = 'moderate';
  if (answers.pain_score >= 8) {
    painSeverity = 'severe';
  } else if (answers.pain_score <= 4) {
    painSeverity = 'mild';
  }

  // Infer Moat Defensibility
  const moatStrength = answers.moat.length > 60 ? 'strong' : answers.moat.length > 25 ? 'moderate' : 'weak';
  const easyToCopy = !containsKeyword(answers.moat, ['proprietary', 'patent', 'network effect', 'ip ', 'data loop', 'switching cost']);

  // Infer Why Now Timing
  const whyNowStrength = answers.why_now.length > 50 ? 'strong' : answers.why_now.length > 20 ? 'moderate' : 'weak';

  // Infer Domain Expertise
  let domainExpertise: ExtractedSignals['domain_expertise'] = 'experienced';
  if (containsKeyword(fullText, ['phd', 'doctor', '10 years', 'expert', 'specialist', 'researcher'])) {
    domainExpertise = 'expert';
  } else if (containsKeyword(fullText, ['novice', 'beginner', 'student', 'learning'])) {
    domainExpertise = 'learning';
  }

  return {
    market_size: marketSize,
    revenue_model: revenueModel,
    growth_potential: containsKeyword(fullText, ['fast', 'hyper', 'rapid', 'scale', 'boom']) ? 'high' : 'medium',
    scalability,
    exit_potential: marketSize === 'large' ? 'high' : 'medium',
    investor_interest_in_space: containsKeyword(fullText, ['ai ', 'artificial intelligence', 'saas', 'crypto', 'web3', 'fintech', 'healthtech']) ? 'high' : 'medium',
    
    pain_severity: painSeverity,
    problem_frequency: containsKeyword(fullText, ['daily', 'every day', 'always', 'hourly']) ? 'daily' : 'weekly',
    existing_buyers: answers.validation_level === 'paying_customers' || containsKeyword(fullText, ['revenue', 'sales', 'paying']),
    clear_roi: !containsKeyword(fullText, ['fun', 'social', 'hobby', 'nice to have']),
    nice_to_have: containsKeyword(fullText, ['entertainment', 'social network', 'game', 'lifestyle']) || answers.pain_score <= 4,
    willingness_to_pay: answers.pain_score >= 7 ? 'high' : 'medium',
    
    industry_growth: containsKeyword(fullText, ['growth', 'booming', 'emerging', 'trends']) ? 'fast' : 'moderate',
    technology_maturity: 'ready',
    consumer_adoption: 'growing',
    regulatory_environment: 'neutral',
    too_early: containsKeyword(fullText, ['quantum', 'nuclear', 'fusion', 'next decade', 'future tech']),
    
    existing_apis_available: !containsKeyword(fullText, ['custom protocol', 'proprietary hardware', 'blockchain from scratch']),
    mvp_complexity: containsKeyword(fullText, ['simple', 'no-code', 'wrapper', 'widget']) ? 'simple' : 'moderate',
    requires_new_hardware: containsKeyword(fullText, ['sensor', 'device', 'gadget', 'wearable', 'robot']),
    ai_dependency: containsKeyword(fullText, ['ai ', 'llm', 'gpt', 'gemini', 'copilot', 'agent']) ? 'core' : 'none',
    infrastructure_complexity: containsKeyword(fullText, ['cloud', 'kubernetes', 'scale', 'real-time', 'video']) ? 'medium' : 'low',
    
    has_proprietary_data: containsKeyword(answers.moat, ['data loop', 'proprietary data', 'dataset', 'collecting data']),
    has_network_effects: containsKeyword(answers.moat, ['network effect', 'viral', 'referral', 'community']),
    switching_costs: containsKeyword(answers.moat, ['integrate', 'switching cost', 'lock-in', 'enterprise integration']) ? 'high' : 'medium',
    differentiation: containsKeyword(answers.moat, ['different', 'unique', 'unlike', 'moat', 'competitor']) ? 'strong' : 'moderate',
    competition_level: containsKeyword(fullText, ['crowded', 'saturated', 'lot of', 'many players']) ? 'high' : 'medium',
    easy_to_copy: easyToCopy,
    
    domain_expertise: domainExpertise,
    technical_background: answers.technical_background !== 'no',
    industry_experience: containsKeyword(fullText, ['years in', 'worked at', 'background in']) ? 'deep' : 'some',
    execution_track_record: 'some',
    credibility: 'medium',
    
    moat_strength: moatStrength,
    why_now_strength: whyNowStrength,
    validation_level: answers.validation_level,
    pain_score: answers.pain_score,
    technical_background_choice: answers.technical_background,
    founder_count: answers.solo_founder ? 'solo' : 'team',
    has_technical_cofounder: answers.has_technical_cofounder,
    funding_status: answers.funding_status,
    current_stage: answers.current_stage,
    market_size_choice: answers.market_size_choice,
    revenue_model_choice: answers.revenue_model_choice
  };
}

export async function extractSignals(
  idea: string,
  answers: QAAnswers,
  apiKey: string | undefined
): Promise<ExtractedSignals> {
  const useMockAI = process.env.USE_MOCK_AI === 'true' || !apiKey;

  if (useMockAI) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return generateDynamicMockSignals(idea, answers);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey! });

    const systemPrompt = `You are a startup analyst. Your ONLY job is to extract factual, observable signals from a startup idea description. You must NOT assign scores, ratings, or judgements.
Read the startup idea and output categorical signals using the exact values specified in the schema.
RULES:
- Use "unknown" when you cannot confidently determine a signal from the provided information
- Be conservative: only mark "existing_buyers: true" if there is clear evidence of paying customers
- Do not infer beyond what is explicitly stated or strongly implied
- "domain_expertise: expert" requires direct evidence the founder has deep, practitioner-level knowledge
- "has_proprietary_data: true" requires evidence of unique, defensible data assets — not just "will collect data"
- "too_early: true" means the market or technology clearly does not exist yet at commercial scale
- Estimate "moat_strength" ('strong' | 'moderate' | 'weak') based on Moat and Competitors description.
- Estimate "why_now_strength" ('strong' | 'moderate' | 'weak') based on Why Now description.
Output strict JSON matching the schema. No commentary.

JSON Schema structure:
{
  "market_size": "large" | "medium" | "small" | "unknown",
  "revenue_model": "subscription" | "usage_based" | "one_time" | "marketplace" | "freemium" | "unknown",
  "growth_potential": "high" | "medium" | "low" | "unknown",
  "scalability": "high" | "moderate" | "low" | "unknown",
  "exit_potential": "high" | "medium" | "low" | "unknown",
  "investor_interest_in_space": "high" | "medium" | "low" | "unknown",
  "pain_severity": "severe" | "moderate" | "mild" | "unknown",
  "problem_frequency": "daily" | "weekly" | "occasional" | "rare" | "unknown",
  "existing_buyers": boolean,
  "clear_roi": boolean,
  "nice_to_have": boolean,
  "willingness_to_pay": "high" | "medium" | "low" | "unknown",
  "industry_growth": "fast" | "moderate" | "slow" | "declining" | "unknown",
  "technology_maturity": "ready" | "emerging" | "not_ready" | "unknown",
  "consumer_adoption": "growing" | "early" | "mass_market" | "unknown",
  "regulatory_environment": "supportive" | "neutral" | "restrictive" | "unknown",
  "too_early": boolean,
  "existing_apis_available": boolean,
  "mvp_complexity": "simple" | "moderate" | "complex" | "research_required" | "unknown",
  "requires_new_hardware": boolean,
  "ai_dependency": "core" | "supporting" | "none" | "unknown",
  "infrastructure_complexity": "low" | "medium" | "high" | "unknown",
  "has_proprietary_data": boolean,
  "has_network_effects": boolean,
  "switching_costs": "high" | "medium" | "low" | "unknown",
  "differentiation": "strong" | "moderate" | "weak" | "unknown",
  "competition_level": "low" | "medium" | "high" | "very_high" | "unknown",
  "easy_to_copy": boolean,
  "domain_expertise": "expert" | "experienced" | "learning" | "none" | "unknown",
  "technical_background": boolean,
  "industry_experience": "deep" | "some" | "none" | "unknown",
  "execution_track_record": "strong" | "some" | "none" | "unknown",
  "credibility": "high" | "medium" | "low" | "unknown"
}`;

    const prompt = `Idea description: ${idea}
Founder's answers:
- Target Customer: ${answers.customer}
- Core Problem: ${answers.problem}
- Validation: ${answers.validation_level}
- Timing: ${answers.why_now}
- Competitors: ${answers.competitors}
- Moat: ${answers.moat}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [systemPrompt, prompt],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      }
    });

    const extracted = JSON.parse(response.text || '{}');

    // Merge manual form selections to ensure override sync
    const finalSignals: ExtractedSignals = {
      ...extracted,
      moat_strength: answers.moat.length > 60 ? 'strong' : answers.moat.length > 25 ? 'moderate' : 'weak',
      why_now_strength: answers.why_now.length > 50 ? 'strong' : answers.why_now.length > 20 ? 'moderate' : 'weak',
      validation_level: answers.validation_level,
      pain_score: answers.pain_score,
      technical_background_choice: answers.technical_background,
      founder_count: answers.solo_founder ? 'solo' : 'team',
      has_technical_cofounder: answers.has_technical_cofounder,
      funding_status: answers.funding_status,
      current_stage: answers.current_stage,
      market_size_choice: answers.market_size_choice,
      revenue_model_choice: answers.revenue_model_choice
    };

    return finalSignals;
  } catch (error) {
    console.error('Gemini signal extraction failed, falling back to mock:', error);
    return generateDynamicMockSignals(idea, answers);
  }
}
