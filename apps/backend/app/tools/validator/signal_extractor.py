import json
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
from app.services.gemini_client import require_gemini_client, GEMINI_MODEL

class ExtractedSignalsSchema(BaseModel):
    market_size: str = Field(description="large | medium | small | unknown")
    revenue_model: str = Field(description="subscription | usage_based | one_time | marketplace | freemium | unknown")
    growth_potential: str = Field(description="high | medium | low | unknown")
    scalability: str = Field(description="high | moderate | low | unknown")
    exit_potential: str = Field(description="high | medium | low | unknown")
    investor_interest_in_space: str = Field(description="high | medium | low | unknown")
    pain_severity: str = Field(description="severe | moderate | mild | unknown")
    problem_frequency: str = Field(description="daily | weekly | occasional | rare | unknown")
    existing_buyers: bool
    clear_roi: bool
    nice_to_have: bool
    willingness_to_pay: str = Field(description="high | medium | low | unknown")
    industry_growth: str = Field(description="fast | moderate | slow | declining | unknown")
    technology_maturity: str = Field(description="ready | emerging | not_ready | unknown")
    consumer_adoption: str = Field(description="growing | early | mass_market | unknown")
    regulatory_environment: str = Field(description="supportive | neutral | restrictive | unknown")
    too_early: bool
    existing_apis_available: bool
    mvp_complexity: str = Field(description="simple | moderate | complex | research_required | unknown")
    requires_new_hardware: bool
    ai_dependency: str = Field(description="core | supporting | none | unknown")
    infrastructure_complexity: str = Field(description="low | medium | high | unknown")
    has_proprietary_data: bool
    has_network_effects: bool
    switching_costs: str = Field(description="high | medium | low | unknown")
    differentiation: str = Field(description="strong | moderate | weak | unknown")
    competition_level: str = Field(description="low | medium | high | very_high | unknown")
    easy_to_copy: bool
    domain_expertise: str = Field(description="expert | experienced | learning | none | unknown")
    technical_background: bool
    industry_experience: str = Field(description="deep | some | none | unknown")
    execution_track_record: str = Field(description="strong | some | none | unknown")
    credibility: str = Field(description="high | medium | low | unknown")

def generate_dynamic_mock_signals(idea: str, answers: Dict[str, Any]) -> Dict[str, Any]:
    def contains_keyword(text: str, keywords: list) -> bool:
        lower = text.lower()
        return any(k in lower for k in keywords)

    full_text = f"{idea} {answers.get('customer', '')} {answers.get('problem', '')} {answers.get('why_now', '')} {answers.get('competitors', '')} {answers.get('moat', '')}"

    # Infer Market Size
    market_size = "medium"
    if contains_keyword(full_text, ["global", "billion", "millions", "enterprise", "huge", "mass"]):
        market_size = "large"
    elif contains_keyword(full_text, ["niche", "local", "small", "family", "shop"]):
        market_size = "small"

    # Infer Revenue Model
    revenue_model = "subscription"
    rev_choice = answers.get("revenue_model_choice")
    if rev_choice == "one_time":
        revenue_model = "one_time"
    elif rev_choice == "marketplace":
        revenue_model = "marketplace"
    elif rev_choice == "advertising":
        revenue_model = "freemium"
    elif rev_choice == "transaction_fee":
        revenue_model = "usage_based"

    # Infer Scalability
    scalability = "high"
    if contains_keyword(full_text, ["hardware", "consulting", "agency", "physical", "manufacturing"]):
        scalability = "moderate"

    # Infer Customer Pain Severity
    pain_severity = "moderate"
    pain_score = answers.get("pain_score", 0)
    if pain_score >= 8:
        pain_severity = "severe"
    elif pain_score <= 4:
        pain_severity = "mild"

    # Infer Moat Defensibility
    moat_txt = answers.get("moat", "")
    moat_strength = "strong" if len(moat_txt) > 60 else "moderate" if len(moat_txt) > 25 else "weak"
    easy_to_copy = not contains_keyword(moat_txt, ["proprietary", "patent", "network effect", "ip ", "data loop", "switching cost"])

    # Infer Why Now Timing
    why_now_txt = answers.get("why_now", "")
    why_now_strength = "strong" if len(why_now_txt) > 50 else "moderate" if len(why_now_txt) > 20 else "weak"

    # Infer Domain Expertise
    domain_expertise = "experienced"
    if contains_keyword(full_text, ["phd", "doctor", "10 years", "expert", "specialist", "researcher"]):
        domain_expertise = "expert"
    elif contains_keyword(full_text, ["novice", "beginner", "student", "learning"]):
        domain_expertise = "learning"

    return {
        "market_size": market_size,
        "revenue_model": revenue_model,
        "growth_potential": "high" if contains_keyword(full_text, ["fast", "hyper", "rapid", "scale", "boom"]) else "medium",
        "scalability": scalability,
        "exit_potential": "high" if market_size == "large" else "medium",
        "investor_interest_in_space": "high" if contains_keyword(full_text, ["ai ", "artificial intelligence", "saas", "crypto", "web3", "fintech", "healthtech"]) else "medium",
        
        "pain_severity": pain_severity,
        "problem_frequency": "daily" if contains_keyword(full_text, ["daily", "every day", "always", "hourly"]) else "weekly",
        "existing_buyers": answers.get("validation_level") == "paying_customers" or contains_keyword(full_text, ["revenue", "sales", "paying"]),
        "clear_roi": not contains_keyword(full_text, ["fun", "social", "hobby", "nice to have"]),
        "nice_to_have": contains_keyword(full_text, ["entertainment", "social network", "game", "lifestyle"]) or pain_score <= 4,
        "willingness_to_pay": "high" if pain_score >= 7 else "medium",
        
        "industry_growth": "fast" if contains_keyword(full_text, ["growth", "booming", "emerging", "trends"]) else "moderate",
        "technology_maturity": "ready",
        "consumer_adoption": "growing",
        "regulatory_environment": "neutral",
        "too_early": contains_keyword(full_text, ["quantum", "nuclear", "fusion", "next decade", "future tech"]),
        
        "existing_apis_available": not contains_keyword(full_text, ["custom protocol", "proprietary hardware", "blockchain from scratch"]),
        "mvp_complexity": "simple" if contains_keyword(full_text, ["simple", "no-code", "wrapper", "widget"]) else "moderate",
        "requires_new_hardware": contains_keyword(full_text, ["sensor", "device", "gadget", "wearable", "robot"]),
        "ai_dependency": "core" if contains_keyword(full_text, ["ai ", "llm", "gpt", "gemini", "copilot", "agent"]) else "none",
        "infrastructure_complexity": "medium" if contains_keyword(full_text, ["cloud", "kubernetes", "scale", "real-time", "video"]) else "low",
        
        "has_proprietary_data": contains_keyword(moat_txt, ["data loop", "proprietary data", "dataset", "collecting data"]),
        "has_network_effects": contains_keyword(moat_txt, ["network effect", "viral", "referral", "community"]),
        "switching_costs": "high" if contains_keyword(moat_txt, ["integrate", "switching cost", "lock-in", "enterprise integration"]) else "medium",
        "differentiation": "strong" if contains_keyword(moat_txt, ["different", "unique", "unlike", "moat", "competitor"]) else "moderate",
        "competition_level": "high" if contains_keyword(full_text, ["crowded", "saturated", "lot of", "many players"]) else "medium",
        "easy_to_copy": easy_to_copy,
        
        "domain_expertise": domain_expertise,
        "technical_background": answers.get("technical_background") != "no",
        "industry_experience": "deep" if contains_keyword(full_text, ["years in", "worked at", "background in"]) else "some",
        "execution_track_record": "some",
        "credibility": "medium",
        
        "moat_strength": moat_strength,
        "why_now_strength": why_now_strength,
        "validation_level": answers.get("validation_level"),
        "pain_score": pain_score,
        "technical_background_choice": answers.get("technical_background"),
        "founder_count": "solo" if answers.get("solo_founder") else "team",
        "has_technical_cofounder": answers.get("has_technical_cofounder"),
        "funding_status": answers.get("funding_status"),
        "current_stage": answers.get("current_stage"),
        "market_size_choice": answers.get("market_size_choice"),
        "revenue_model_choice": answers.get("revenue_model_choice")
    }

async def extract_signals(
    idea: str,
    answers: Dict[str, Any],
    system_prompt: Optional[str] = None
) -> Dict[str, Any]:
    try:
        ai = require_gemini_client()
    except Exception:
        print("[WARN] Gemini client not initialized. Falling back to dynamic mock signals.")
        return generate_dynamic_mock_signals(idea, answers)

    default_system = """You are a startup analyst. Your ONLY job is to extract factual, observable signals from a startup idea description. You must NOT assign scores, ratings, or judgements.
Read the startup idea and output categorical signals using the exact values specified in the schema.
RULES:
- Use "unknown" when you cannot confidently determine a signal from the provided information
- Be conservative: only mark "existing_buyers: true" if there is clear evidence of paying customers
- Do not infer beyond what is explicitly stated or strongly implied
Output strict JSON matching the schema. No commentary."""

    sys_prompt = system_prompt or default_system

    prompt = f"""
<raw_user_idea>
{idea}
</raw_user_idea>
Founder's answers:
- Target Customer: <customer>{answers.get('customer')}</customer>
- Core Problem: <problem>{answers.get('problem')}</problem>
- Validation: <validation>{answers.get('validation_level')}</validation>
- Timing: <why_now>{answers.get('why_now')}</why_now>
- Competitors: <competitors>{answers.get('competitors')}</competitors>
- Moat: <moat>{answers.get('moat')}</moat>"""

    try:
        # Call Google GenAI SDK AIO namespace with response schema
        response = await ai.aio.models.generate_content(
            model=GEMINI_MODEL,
            contents=[sys_prompt, prompt],
            config={
                "response_mime_type": "application/json",
                "response_schema": ExtractedSignalsSchema,
                "temperature": 0.1,
            }
        )
        
        extracted = json.loads(response.text)

        # Merge manual overrides
        moat_txt = answers.get("moat", "")
        why_now_txt = answers.get("why_now", "")
        
        extracted["moat_strength"] = "strong" if len(moat_txt) > 60 else "moderate" if len(moat_txt) > 25 else "weak"
        extracted["why_now_strength"] = "strong" if len(why_now_txt) > 50 else "moderate" if len(why_now_txt) > 20 else "weak"
        extracted["validation_level"] = answers.get("validation_level")
        extracted["pain_score"] = answers.get("pain_score")
        extracted["technical_background_choice"] = answers.get("technical_background")
        extracted["founder_count"] = "solo" if answers.get("solo_founder") else "team"
        extracted["has_technical_cofounder"] = answers.get("has_technical_cofounder")
        extracted["funding_status"] = answers.get("funding_status")
        extracted["current_stage"] = answers.get("current_stage")
        extracted["market_size_choice"] = answers.get("market_size_choice")
        extracted["revenue_model_choice"] = answers.get("revenue_model_choice")

        return extracted
    except Exception as e:
        print(f"[Gemini Error] Signal extraction failed, falling back to mock: {str(e)}")
        return generate_dynamic_mock_signals(idea, answers)
