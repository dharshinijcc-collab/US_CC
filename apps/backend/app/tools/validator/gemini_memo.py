import json
from typing import Dict, Any, List, Optional
from app.services.gemini_client import require_gemini_client, GEMINI_MODEL
from app.tools.validator.startups import CURATED_STARTUPS

def generate_mock_narratives(
    idea: str,
    answers: Dict[str, Any],
    scores: Dict[str, Any],
    dimensions: Dict[str, Any],
    red_flags: List[Dict[str, Any]]
) -> Dict[str, Any]:
    def get_dimension_label(key: str) -> str:
        meta = {
            "customer_demand": "Customer Demand",
            "competitive_moat": "Competitive Moat",
            "technical_feasibility": "Technical Feasibility",
            "founder_market_fit": "Founder-Market Fit",
            "investor_appeal": "Investor Appeal",
            "market_timing": "Market Timing"
        }
        return meta.get(key, key)

    highest_dim = "customer_demand"
    lowest_dim = "competitive_moat"
    highest_score = -1.0
    lowest_score = 11.0

    for key, val in dimensions.items():
        score = val["score"]
        if score > highest_score:
            highest_score = score
            highest_dim = key
        if score < lowest_score:
            lowest_score = score
            lowest_dim = key

    overall_reason = f"The overall venture readiness score of {scores['overall_score']}/10 places this concept in the '{scores['triage_band']}' triage band. This rating reflects strong indications in {get_dimension_label(highest_dim)} (scoring {highest_score}/10) offset by structural risks in {get_dimension_label(lowest_dim)} (scoring {lowest_score}/10). The concept targets a viable problem space, but requires targeted validation of the core business model and switching costs."

    dimension_narratives = {}
    for key, dim in dimensions.items():
        label = get_dimension_label(key)
        pos_sigs = dim.get("positive_signals", [])
        neg_sigs = dim.get("negative_signals", [])
        
        dimension_narratives[key] = {
            "score": dim["score"],
            "confidence": dim["confidence"],
            "evaluation_criteria": [f["label"] for f in dim["factors"]],
            "why_this_score": f"The score of {dim['score']}/10 for {label} is determined by several active factors. Specifically, the presence of {', '.join(pos_sigs[:2]) or 'basic elements'} provides a positive baseline. However, concerns regarding {', '.join(neg_sigs[:2]) or 'unvalidated assumptions'} limit the upside.",
            "positive_signals": pos_sigs if pos_sigs else ["Basic concept established"],
            "negative_signals": neg_sigs if neg_sigs else ["Unvalidated market assumptions"],
            "improvement_actions": [
                f"Conduct 10+ detailed customer interviews focusing specifically on {label.lower()} friction.",
                f"Draft a detailed case study or simulation showing how your solution directly impacts {label.lower()}.",
                f"Analyze historical benchmarks of competitive models in this dimension to optimize performance."
            ],
            "base_score": dim["base_score"],
            "positive_adjustments": dim["positive_adjustments"],
            "negative_adjustments": dim["negative_adjustments"],
            "neutral_signals": dim["neutral_signals"]
        }

    mock_comps = []
    for c in CURATED_STARTUPS[:3]:
        mock_comps.append({
            "name": c["name"],
            "description": c["description"],
            "why_comparable": f"Shares a similar structural approach in the {c['domain']} space, validating the scalability of the business model.",
            "business_model": c["business_model"],
            "lessons_learned": c["key_lesson"]
        })

    return {
        "overall_score": scores["overall_score"],
        "startup_quality_score": scores["startup_quality_score"],
        "investor_readiness_score": scores["investor_readiness_score"],
        "triage_band": scores["triage_band"],
        "confidence_level": scores["confidence_level"],
        "startup_summary": f"A startup aimed at solving the following problem: '{answers.get('problem', '')}' for target customer segment: '{answers.get('customer', '')}'.",
        "why_this_score": overall_reason,
        "biggest_assumption": "The primary leap-of-faith assumption is that customers will switch from their current habits.",
        "missing_evidence": "There is currently a lack of quantitative evidence to prove willingness to pay.",
        "what_increased_the_score": ["Founder has technical background", "Target market size is perceived as large"],
        "what_reduced_the_score": ["Operating in forming stage means high execution risk", "The competitive moat is currently unproven"],
        "how_to_improve": ["Secure 3 non-binding Letters of Intent (LOIs)", "Develop clickable interactive prototype"],
        "investor_questions": ["What specific features create high switching costs?", "What is the CAC payback period model?"],
        "highest_scoring_dimension": get_dimension_label(highest_dim),
        "lowest_scoring_dimension": get_dimension_label(lowest_dim),
        "is_mock": True,
        "evidence_score": scores["evidence_score"],
        "investment_probability": scores["investment_probability"],
        "confidence_breakdown": scores["confidence_breakdown"],
        "evidence_checklist": scores["evidence_checklist"],
        "score_sensitivity": scores["score_sensitivity"],
        "investor_red_flags": red_flags,
        "buildtime_estimator": scores["buildtime_estimator"],
        "risk_matrix": {
            "market": {"severity": "medium", "reason": "Unvalidated demand", "mitigation": "Run landing page tests"},
            "execution": {"severity": "high", "reason": "Early product stage", "mitigation": "Use strict milestones"},
            "funding": {"severity": "medium", "reason": "Capital required to build team", "mitigation": "Bootstrap early v1"},
            "competition": {"severity": "medium", "reason": "Incumbents have lock-in", "mitigation": "Build unique integrations"},
            "technical": {"severity": "low", "reason": "Standard code features", "mitigation": "Use serverless cloud"},
            "legal": {"severity": "low", "reason": "Standard privacy policies", "mitigation": "Apply templates"},
            "operational": {"severity": "low", "reason": "Flat operations headcount", "mitigation": "Keep team lean"}
        },
        "validation_roadmap": [
            {"phase": "Phase 1: Validation", "task": "Interview 15 customers to map friction points", "timeline": "Weeks 1-2", "impact": "Reduces demand risk", "effort": "Low", "expected_score_improvement": "+0.6"},
            {"phase": "Phase 2: Prototyping", "task": "Design and build clickable web wireframes", "timeline": "Weeks 3-4", "impact": "Validates usability", "effort": "Medium", "expected_score_improvement": "+0.8"},
            {"phase": "Phase 3: Launch Prep", "task": "Set up landing page and waitlist collection", "timeline": "Week 5", "impact": "Establishes lead pool", "effort": "Low", "expected_score_improvement": "+1.2"},
            {"phase": "Phase 4: Build", "task": "Deploy v1 MVP software", "timeline": "Weeks 6-10", "impact": "Product launch", "effort": "High", "expected_score_improvement": "+1.5"}
        ],
        "comparable_startups": mock_comps,
        "due_diligence_questions": {
            "market": [{"question": "How big is the wedge segment?", "expected_evidence": "Bottom-up TAM analysis", "suggested_prep": "Model price * customer count"}],
            "customer": [{"question": "Why will users switch from habits?", "expected_evidence": "Discovery interview notes", "suggested_prep": "Consolidate pain points from transcripts"}],
            "revenue": [{"question": "What is the pricing model validation?", "expected_evidence": "LOI payment terms", "suggested_prep": "Check customer willingness to pay responses"}],
            "technology": [{"question": "What are key API dependencies?", "expected_evidence": "Architecture diagrams", "suggested_prep": "Document fallbacks for API outage"}],
            "competition": [{"question": "How to protect features from clones?", "expected_evidence": "Moat properties", "suggested_prep": "Develop proprietary data loops"}],
            "operations": [{"question": "How is customer support managed?", "expected_evidence": "Operations flows", "suggested_prep": "Create template answer guides"}],
            "legal": [{"question": "Is compliance standard?", "expected_evidence": "Privacy agreements", "suggested_prep": "Review generic templates"}],
            "financial": [{"question": "What is the 12-month runway?", "expected_evidence": "Financial budget sheet", "suggested_prep": "Map core developer expenses"}]
        },
        "co_founder_recommendations": "Recruit a technical co-founder who can own frontend/backend engineering.",
        "investor_memo": {
            "executive_summary": "An early-stage opportunity focusing on a validated customer pain point.",
            "investment_thesis": "By automating repetitive overhead, this solution unlocks immediate time savings.",
            "strengths": "Strong founder domain experience and high perceived user pain.",
            "weaknesses": "Early stage of development and low current validation.",
            "major_risks": "High competitive replication risk.",
            "recommendation": "Strong Pass" if scores["overall_score"] >= 7.5 else "Proceed Carefully" if scores["overall_score"] >= 4.5 else "Monitor",
            "confidence_rating": "Medium - based on current questionnaire details",
            "next_validation_step": "Conduct 10 discovery calls and build interactive wireframe designs."
        },
        "dimensions": dimension_narratives
    }

async def generate_narrative_memo(
    idea: str,
    answers: Dict[str, Any],
    scores: Dict[str, Any],
    dimensions: Dict[str, Any],
    red_flags: List[Dict[str, Any]],
    system_prompt: Optional[str] = None
) -> Dict[str, Any]:
    try:
        ai = require_gemini_client()
    except Exception:
        print("[WARN] Gemini client not initialized. Falling back to mock narratives.")
        return generate_mock_narratives(idea, answers, scores, dimensions, red_flags)

    default_system = f"""You are an expert venture capital investment analyst writing a premium, investor-grade startup due diligence report.
Your role is to write narrative explanations, risk mitigation plans, comparable startup analyses, and investor memos that strictly align with the pre-computed scores and signals.
You must NOT change or contradict any score.

CURATED DATABASE OF ELIGIBLE COMPARABLE STARTUPS (Select exactly 3-5 that best match the sector of this startup):
{json.dumps(CURATED_STARTUPS, indent=2)}

Provide the response in strict JSON matching the required schema structure. No commentary."""

    sys_prompt = system_prompt or default_system

    prompt = f"""Idea description: {idea}
Pre-calculated Scores:
- Startup Quality Score: {scores['startup_quality_score']}/10
- Investor Readiness Score: {scores['investor_readiness_score']}/10
- Overall Score: {scores['overall_score']}/10
- Evidence Score: {scores['evidence_score']}/10
- Investment Probability: {scores['investment_probability']}%
- Confidence Level: {scores['confidence_level']}%
- Red Flag Count: {len(red_flags)}

Detected Red Flags:
{json.dumps(red_flags, indent=2)}

Individual Dimension Scores & Signals:
- Investor Appeal: Score {dimensions['investor_appeal']['score']}/10
- Customer Demand: Score {dimensions['customer_demand']['score']}/10
- Market Timing: Score {dimensions['market_timing']['score']}/10
- Technical Feasibility: Score {dimensions['technical_feasibility']['score']}/10
- Competitive Moat: Score {dimensions['competitive_moat']['score']}/10
- Founder-Market Fit: Score {dimensions['founder_market_fit']['score']}/10

Founder answers for reference:
- Target Customer: {answers.get('customer')}
- Core Problem: {answers.get('problem')}
- Validation: {answers.get('validation_level')}
- Why Now: {answers.get('why_now')}
- Competitors: {answers.get('competitors')}
- Moat: {answers.get('moat')}"""

    try:
        response = await ai.aio.models.generate_content(
            model=GEMINI_MODEL,
            contents=[sys_prompt, prompt],
            config={
                "response_mime_type": "application/json",
                "temperature": 0.6,
            }
        )
        
        generated = json.loads(response.text)

        # Force exact pre-calculated score structures back into payload to protect math integrity
        generated["overall_score"] = scores["overall_score"]
        generated["startup_quality_score"] = scores["startup_quality_score"]
        generated["investor_readiness_score"] = scores["investor_readiness_score"]
        generated["triage_band"] = scores["triage_band"]
        generated["confidence_level"] = scores["confidence_level"]
        generated["evidence_score"] = scores["evidence_score"]
        generated["investment_probability"] = scores["investment_probability"]
        generated["confidence_breakdown"] = scores["confidence_breakdown"]
        generated["evidence_checklist"] = scores["evidence_checklist"]
        generated["score_sensitivity"] = scores["score_sensitivity"]
        generated["investor_red_flags"] = red_flags
        generated["buildtime_estimator"] = scores["buildtime_estimator"]
        generated["is_mock"] = False

        for k, dim in dimensions.items():
            if "dimensions" in generated and k in generated["dimensions"]:
                generated["dimensions"][k]["score"] = dim["score"]
                generated["dimensions"][k]["confidence"] = dim["confidence"]
                generated["dimensions"][k]["scoring_factors"] = dim["factors"]
                generated["dimensions"][k]["base_score"] = dim["base_score"]
                generated["dimensions"][k]["positive_adjustments"] = dim["positive_adjustments"]
                generated["dimensions"][k]["negative_adjustments"] = dim["negative_adjustments"]
                generated["dimensions"][k]["positive_signals"] = dim["positive_signals"] if dim["positive_signals"] else ["Basic signals detected"]
                generated["dimensions"][k]["negative_signals"] = dim["negative_signals"] if dim["negative_signals"] else ["Minor optimization opportunities"]
                generated["dimensions"][k]["neutral_signals"] = dim["neutral_signals"]

        return generated
    except Exception as e:
        print(f"[Gemini Error] Narrative memo generation failed, falling back to mock: {str(e)}")
        return generate_mock_narratives(idea, answers, scores, dimensions, red_flags)
