import math
from typing import Dict, Any, List

def calculate_aggregated_scores(
    dimensions: Dict[str, Any],
    answers: Dict[str, Any],
    red_flag_count: int,
    config: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    customer_demand = dimensions["customer_demand"]["score"]
    competitive_moat = dimensions["competitive_moat"]["score"]
    technical_feasibility = dimensions["technical_feasibility"]["score"]
    founder_market_fit = dimensions["founder_market_fit"]["score"]
    investor_appeal = dimensions["investor_appeal"]["score"]
    market_timing = dimensions["market_timing"]["score"]

    # Dynamic weights with fallback
    w_quality = (config or {}).get("scoring_weights", {}).get("quality", {"demand": 0.35, "moat": 0.30, "technical": 0.20, "founder": 0.15})
    w_readiness = (config or {}).get("scoring_weights", {}).get("readiness", {"appeal": 0.40, "timing": 0.30, "founder": 0.15, "demand": 0.15})
    adj_validation = (config or {}).get("adjustments", {}).get("validation", {"none": -1.5, "paying_customers": 1.5})
    adj_stage = (config or {}).get("adjustments", {}).get("stage", {"forming": -1.5, "mvp": 1.0})
    thresholds = (config or {}).get("triage_thresholds", {"strong_pass": 7.5, "needs_work": 4.5})

    # 1. Startup Quality Score
    startup_quality_score = (
        w_quality.get("demand", 0.35) * customer_demand +
        w_quality.get("moat", 0.30) * competitive_moat +
        w_quality.get("technical", 0.20) * technical_feasibility +
        w_quality.get("founder", 0.15) * founder_market_fit
    )

    # 2. Investor Readiness Score
    investor_readiness_score = (
        w_readiness.get("appeal", 0.40) * investor_appeal +
        w_readiness.get("timing", 0.30) * market_timing +
        w_readiness.get("founder", 0.15) * founder_market_fit +
        w_readiness.get("demand", 0.15) * customer_demand
    )

    # 3. Validation Adjustment
    validation_level = answers.get("validation_level", "none")
    validation_adj = adj_validation.get(validation_level, 0.0)
    if validation_level == "none":
        validation_adj = adj_validation.get("none", -1.5)
    elif validation_level == "paying_customers":
        validation_adj = adj_validation.get("paying_customers", 1.5)

    # 4. Stage Adjustment
    current_stage = answers.get("current_stage", "forming")
    stage_adj = adj_stage.get(current_stage, 0.0)
    if current_stage == "forming":
        stage_adj = adj_stage.get("forming", -1.5)
    elif current_stage == "mvp":
        stage_adj = adj_stage.get("mvp", 1.0)

    # 5. Overall Score
    raw_overall = (startup_quality_score + investor_readiness_score) / 2.0 + validation_adj + stage_adj
    overall_score = min(10.0, max(0.0, round(raw_overall * 10) / 10.0))

    # 6. Triage Band
    triage_band = "Promising / Needs Work"
    if overall_score >= thresholds.get("strong_pass", 7.5):
        triage_band = "Strong Pass"
    elif overall_score < thresholds.get("needs_work", 4.5):
        triage_band = "Not a Fit (Currently)"

    # 7. Evidence Score (0-10)
    val_score = 0
    if validation_level == "conversations":
        val_score = 2
    elif validation_level == "waitlist":
        val_score = 4
    elif validation_level == "paying_customers":
        val_score = 6

    stage_score = 0
    if current_stage == "ux_design":
        stage_score = 1
    elif current_stage == "prototype":
        stage_score = 2
    elif current_stage == "mvp":
        stage_score = 4

    evidence_score = min(10, val_score + stage_score)

    # 8. Investment Probability (0-100%)
    val_prob_bonus = 0
    if validation_level == "conversations":
        val_prob_bonus = 5
    elif validation_level == "waitlist":
        val_prob_bonus = 12
    elif validation_level == "paying_customers":
        val_prob_bonus = 20

    stage_prob_bonus = 0
    if current_stage == "prototype":
        stage_prob_bonus = 5
    elif current_stage == "mvp":
        stage_prob_bonus = 10

    mkt_prob_bonus = 10 if answers.get("market_size_choice") in ["large", "mass_market"] else 0
    
    fund_status = answers.get("funding_status", "bootstrapped")
    fund_prob_bonus = 5
    if fund_status == "raising":
        fund_prob_bonus = 8
    elif fund_status == "raised":
        fund_prob_bonus = 10

    flag_penalty = red_flag_count * 5
    raw_prob = (investor_readiness_score * 8) + val_prob_bonus + stage_prob_bonus + mkt_prob_bonus + fund_prob_bonus - flag_penalty
    investment_probability = min(100, max(0, int(round(raw_prob))))

    # 9. Confidence Breakdown
    cust_txt = answers.get("customer", "")
    prob_txt = answers.get("problem", "")
    why_now_txt = answers.get("why_now", "")
    comp_txt = answers.get("competitors", "")
    moat_txt = answers.get("moat", "")
    text_length = len(cust_txt) + len(prob_txt) + len(why_now_txt) + len(comp_txt) + len(moat_txt)
    questionnaire_completeness = min(100, max(80, int(round(80 + (text_length / 50.0)))))

    signal_confidence = int(round(sum(d["confidence"] for d in dimensions.values()) / len(dimensions)))
    evidence_confidence = evidence_score * 10
    rule_confidence = 100

    overall_confidence = min(98, max(40, int(round(
        0.15 * questionnaire_completeness + 
        0.50 * signal_confidence + 
        0.25 * evidence_confidence + 
        0.10 * rule_confidence
    ))))

    # 10. Evidence Checklist
    evidence_checklist = [
        {
            "item": "Customer Discovery Interviews",
            "status": "completed" if validation_level != "none" else "missing",
            "gap_description": "Conducted initial discussions" if validation_level != "none" else "No structured customer interviews performed yet."
        },
        {
            "item": "Interactive Design/Wired Prototype",
            "status": "completed" if current_stage in ["prototype", "mvp"] else "partial" if current_stage == "ux_design" else "missing",
            "gap_description": "High fidelity prototype built" if current_stage in ["prototype", "mvp"] else "UX design in progress" if current_stage == "ux_design" else "No clickable demo or user-interface mockups available."
        },
        {
            "item": "Waitlist & Landing Page Traction",
            "status": "completed" if validation_level in ["waitlist", "paying_customers"] else "missing",
            "gap_description": "Waitlist active" if validation_level in ["waitlist", "paying_customers"] else "No active landing page or signup waitlist deployed."
        },
        {
            "item": "Minimum Viable Product (MVP)",
            "status": "completed" if current_stage == "mvp" else "partial" if current_stage == "prototype" else "missing",
            "gap_description": "MVP is live" if current_stage == "mvp" else "Full MVP software has not yet been built or released."
        },
        {
            "item": "Early Paying Customers / Traction",
            "status": "completed" if validation_level == "paying_customers" else "missing",
            "gap_description": "Paying pilot/customers locked" if validation_level == "paying_customers" else "Zero revenue transactions or subscription contracts validated."
        }
    ]

    # 11. Score Sensitivity Engine
    score_sensitivity = []
    if validation_level == "none":
        score_sensitivity.append({"milestone": "Interview 20 Customers", "estimated_increase": 0.6})
        score_sensitivity.append({"milestone": "Launch landing page & collect 100+ signups", "estimated_increase": 1.2})
        score_sensitivity.append({"milestone": "Acquire first 3 paying customers", "estimated_increase": 2.3})
    elif validation_level == "conversations":
        score_sensitivity.append({"milestone": "Launch landing page & collect 100+ signups", "estimated_increase": 0.8})
        score_sensitivity.append({"milestone": "Acquire first 3 paying customers", "estimated_increase": 1.7})
    elif validation_level == "waitlist":
        score_sensitivity.append({"milestone": "Acquire first 3 paying customers", "estimated_increase": 1.2})

    if current_stage in ["forming", "ux_design"]:
        score_sensitivity.append({"milestone": "Build interactive clickable prototype", "estimated_increase": 0.8})
        score_sensitivity.append({"milestone": "Develop and launch MVP software", "estimated_increase": 1.5})
    elif current_stage == "prototype":
        score_sensitivity.append({"milestone": "Develop and launch MVP software", "estimated_increase": 1.0})

    # 12. BuildTime Estimator
    base_weeks = 10.0
    if current_stage == "mvp":
        base_weeks -= 7.0
    elif current_stage == "prototype":
        base_weeks -= 3.5
    elif current_stage == "ux_design":
        base_weeks -= 2.0

    if answers.get("has_technical_cofounder") or answers.get("technical_background") == "can_code":
        base_weeks -= 2.0

    if technical_feasibility < 5.0:
        base_weeks += 3.0
    elif technical_feasibility < 7.0:
        base_weeks += 1.0

    final_weeks = max(1.5, round(base_weeks * 10) / 10.0)
    timeline_months = max(0.4, round((final_weeks / 4.0) * 10) / 10.0)

    complexity = "medium"
    if final_weeks <= 4:
        complexity = "low"
    elif final_weeks >= 10:
        complexity = "high"

    team = "1 Tech Lead, 1 Frontend Developer, 1 Backend Developer, 1 Product Designer"
    technical_risks = [
        "Ensuring scalable API response times under high concurrency.",
        "Integrating with third-party software legacy webhooks."
    ]

    if complexity == "low":
        team = "1 Full-Stack Developer + 1 Part-Time UI/UX Designer"
        technical_risks = [
            "Maintaining simplicity to avoid scope creep in initial V1 launch.",
            "Hosting resources on serverless endpoints to keep cloud costs low."
        ]
    elif complexity == "high":
        team = "1 Tech Lead, 2 Full-Stack Developers, 1 DevOps Engineer, 1 Product Designer, 1 AI/Data Specialist"
        technical_risks = [
            "Database scale issues with massive real-time data loops.",
            "Training and fine-tuning custom AI models within budget.",
            "Securing regulatory compliance (GDPR/HIPAA) for custom storage structures."
        ]

    development_phases = [
        {"phase": "Discovery & UX Spec", "timeline": f"{round(timeline_months * 0.15 * 10) / 10.0} month(s)", "estimated_effort": "15%", "description": "Map workflows, user flows, database architecture blueprints, and interactive wireframes."},
        {"phase": "UI/UX Interactive Design", "timeline": f"{round(timeline_months * 0.15 * 10) / 10.0} month(s)", "estimated_effort": "15%", "description": "Create high-fidelity design sheets, responsive templates, and style system configurations."},
        {"phase": "Frontend Engineering", "timeline": f"{round(timeline_months * 0.25 * 10) / 10.0} month(s)", "estimated_effort": "25%", "description": "Develop Next.js/React layout templates, client page routings, and browser storage components."},
        {"phase": "Backend API & Infrastructure", "timeline": f"{round(timeline_months * 0.25 * 10) / 10.0} month(s)", "estimated_effort": "25%", "description": "Establish database connections, schema constraints, security keys, and router pipelines."},
        {"phase": "AI & Custom Integrations", "timeline": f"{round(timeline_months * 0.10 * 10) / 10.0} month(s)", "estimated_effort": "10%", "description": "Integrate Gemini LLM prompts, caching algorithms, and third-party SaaS hooks."},
        {"phase": "QA Testing & Launch Deployment", "timeline": f"{round(timeline_months * 0.10 * 10) / 10.0} month(s)", "estimated_effort": "10%", "description": "Run build tests, cross-browser responsiveness checks, and deploy to Vercel/AWS environments."},
    ]

    buildtime_estimator = {
        "timeline_months": timeline_months,
        "engineering_complexity": complexity,
        "team_recommendation": team,
        "technical_risks": technical_risks,
        "development_phases": development_phases
    }

    return {
        "startup_quality_score": min(10.0, max(0.0, round(startup_quality_score * 10) / 10.0)),
        "investor_readiness_score": min(10.0, max(0.0, round(investor_readiness_score * 10) / 10.0)),
        "overall_score": overall_score,
        "triage_band": triage_band,
        "confidence_level": overall_confidence,
        "evidence_score": evidence_score,
        "investment_probability": investment_probability,
        "confidence_breakdown": {
            "questionnaire_completeness": questionnaire_completeness,
            "signal_confidence": signal_confidence,
            "evidence_confidence": evidence_confidence,
            "rule_confidence": rule_confidence,
            "overall_confidence": overall_confidence,
        },
        "evidence_checklist": evidence_checklist,
        "score_sensitivity": score_sensitivity,
        "buildtime_estimator": buildtime_estimator
    }
