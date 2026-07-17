from typing import Dict, Any, List

def detect_red_flags(signals: Dict[str, Any]) -> List[Dict[str, Any]]:
    flags = []

    # 1. Solo Founder
    if signals.get("founder_count") == "solo":
        flags.append({
            "flag": "Solo Founder",
            "severity": "medium",
            "reason": "Venture is operated by a single founder, raising execution risk and key-person dependency.",
            "recommendation": "Recruit a complementary co-founder (ideally technical or operations-focused) to distribute workload and build investor trust."
        })

    # 2. No Technical Lead
    if not signals.get("technical_background") and not signals.get("has_technical_cofounder"):
        flags.append({
            "flag": "No Technical Lead",
            "severity": "high",
            "reason": "The team lacks internal coding/engineering leadership, relying heavily on external agencies or contractors.",
            "recommendation": "Onboard a CTO or technical co-founder with equity to bring product development and system architecture in-house."
        })

    # 3. Tiny Market Size
    if signals.get("market_size_choice") == "small" or signals.get("market_size") == "small":
        flags.append({
            "flag": "Tiny Market Size",
            "severity": "medium",
            "reason": "The addressable market is niche or localized, limiting the startup's ability to achieve venture-scale returns.",
            "recommendation": "Pivot or expand the target market definition to adjacent customer segments or larger geographic markets."
        })

    # 4. Weak Defensibility Moat
    if signals.get("easy_to_copy") or signals.get("moat_strength") == "weak":
        flags.append({
            "flag": "Weak Defensibility Moat",
            "severity": "high",
            "reason": "The product has no proprietary datasets, network effects, or switching costs, making it highly susceptible to cloning.",
            "recommendation": "Design lock-in mechanics, proprietary workflows, or data loops that make the solution more defensible over time."
        })

    # 5. Zero Customer Validation
    if signals.get("validation_level") == "none":
        flags.append({
            "flag": "Zero Customer Validation",
            "severity": "high",
            "reason": "The idea has not been validated with customer interviews, landing page signups, or early testers.",
            "recommendation": "Conduct 15+ structured interviews with target customer personas before building additional software."
        })

    # 6. Unclear Revenue Model
    if signals.get("revenue_model_choice") == "other" and signals.get("revenue_model") == "unknown":
        flags.append({
            "flag": "Unclear Revenue Model",
            "severity": "medium",
            "reason": "The business model is undefined or secondary, creating commercial viability risk.",
            "recommendation": "Define a primary pricing strategy (SaaS subscription, transaction commission, marketplace fee) and test it with buyers."
        })

    # 7. Weak Core Differentiation
    if signals.get("differentiation") == "weak":
        flags.append({
            "flag": "Weak Core Differentiation",
            "severity": "high",
            "reason": "The offering does not have a clear '10x value proposition' or differentiation compared to established competitors.",
            "recommendation": "Sharpen the value proposition focusing on a highly specific customer pain point that incumbents ignore."
        })

    return flags

def run_rule_engine(signals: Dict[str, Any], rule_modifiers: Optional[Dict[str, float]] = None) -> Dict[str, Any]:
    def get_points(label: str, default_points: float) -> float:
        if rule_modifiers and label in rule_modifiers:
            return float(rule_modifiers[label])
        return default_points

    def evaluate_dimension(
        base_score: float,
        factors_list: List[Dict[str, Any]],
        dimension_signals_keys: List[str]
    ) -> Dict[str, Any]:
        positive_adjustments = 0.0
        negative_adjustments = 0.0
        factors = []
        active_factors = []
        positive_signals = []
        negative_signals = []
        neutral_signals = []

        for f in factors_list:
            scoring_factor = {
                "label": f["label"],
                "points": f["points"],
                "detected": f["detected"],
                "signal_key": f["signal_key"]
            }
            factors.append(scoring_factor)

            if not f["detected"]:
                neutral_signals.append(f["label"])
            else:
                active_factors.append(scoring_factor)
                if f["points"] > 0:
                    positive_adjustments += f["points"]
                    positive_signals.append(f["label"])
                elif f["points"] < 0:
                    negative_adjustments += f["points"]
                    negative_signals.append(f["label"])
                else:
                    neutral_signals.append(f["label"])

        score = min(10.0, max(0.0, base_score + positive_adjustments + negative_adjustments))

        # Confidence calculation
        known_count = 0
        for k in dimension_signals_keys:
            val = signals.get(k)
            if val != "unknown" and val is not None:
                known_count += 1
        confidence = min(98, max(40, int(round((known_count / len(dimension_signals_keys)) * 100))))

        return {
            "score": round(score, 1),
            "confidence": confidence,
            "factors": factors,
            "active_factors": active_factors,
            "positive_signals": positive_signals,
            "negative_signals": negative_signals,
            "base_score": base_score,
            "positive_adjustments": round(positive_adjustments, 1),
            "negative_adjustments": round(negative_adjustments, 1),
            "neutral_signals": neutral_signals
        }

    # 1. Investor Appeal
    investor_appeal_factors = [
        {"label": "Large Addressable Market", "points": get_points("Large Addressable Market", 2), "detected": signals.get("market_size") == "large", "signal_key": "market_size"},
        {"label": "Medium Addressable Market", "points": get_points("Medium Addressable Market", 1), "detected": signals.get("market_size") == "medium", "signal_key": "market_size"},
        {"label": "Subscription / Recurring Revenue", "points": get_points("Subscription / Recurring Revenue", 2), "detected": signals.get("revenue_model") in ["subscription", "usage_based", "freemium"], "signal_key": "revenue_model"},
        {"label": "One-Time Revenue Model", "points": get_points("One-Time Revenue Model", -1), "detected": signals.get("revenue_model") == "one_time", "signal_key": "revenue_model"},
        {"label": "High Scalability Potential", "points": get_points("High Scalability Potential", 2), "detected": signals.get("scalability") == "high", "signal_key": "scalability"},
        {"label": "Moderate Scalability Potential", "points": get_points("Moderate Scalability Potential", 1), "detected": signals.get("scalability") == "moderate", "signal_key": "scalability"},
        {"label": "Strong Exit Potential", "points": get_points("Strong Exit Potential", 1), "detected": signals.get("exit_potential") == "high", "signal_key": "exit_potential"},
        {"label": "Active Investor Interest in Space", "points": get_points("Active Investor Interest in Space", 1), "detected": signals.get("investor_interest_in_space") == "high", "signal_key": "investor_interest_in_space"},
        {"label": "High Growth Potential", "points": get_points("High Growth Potential", 1), "detected": signals.get("growth_potential") == "high", "signal_key": "growth_potential"},
        {"label": "Small Addressable Market", "points": get_points("Small Addressable Market", -2), "detected": signals.get("market_size") == "small", "signal_key": "market_size"},
        {"label": "Low Scalability Potential", "points": get_points("Low Scalability Potential", -1), "detected": signals.get("scalability") == "low", "signal_key": "scalability"},
        {"label": "Active Funding Stage (Raising/Raised)", "points": get_points("Active Funding Stage (Raising/Raised)", 1), "detected": signals.get("funding_status") in ["raising", "raised"], "signal_key": "funding_status"},
        {"label": "Validated with Paying Customers", "points": get_points("Validated with Paying Customers", 4), "detected": signals.get("validation_level") == "paying_customers", "signal_key": "validation_level"},
        {"label": "Validated with Waitlist", "points": get_points("Validated with Waitlist", 2), "detected": signals.get("validation_level") == "waitlist", "signal_key": "validation_level"},
        {"label": "Validated with User Conversations", "points": get_points("Validated with User Conversations", 1), "detected": signals.get("validation_level") == "conversations", "signal_key": "validation_level"},
        {"label": "No Prior Validation Done", "points": get_points("No Prior Validation Done", -2), "detected": signals.get("validation_level") == "none", "signal_key": "validation_level"},
        {"label": "Targeting Mass Market", "points": get_points("Targeting Mass Market", 3), "detected": signals.get("market_size_choice") == "mass_market", "signal_key": "market_size_choice"},
        {"label": "Targeting Large Market Segment", "points": get_points("Targeting Large Market Segment", 2), "detected": signals.get("market_size_choice") == "large", "signal_key": "market_size_choice"},
        {"label": "Targeting Medium Market Segment", "points": get_points("Targeting Medium Market Segment", 1), "detected": signals.get("market_size_choice") == "medium", "signal_key": "market_size_choice"},
        {"label": "Targeting Small/Niche Market Segment", "points": get_points("Targeting Small/Niche Market Segment", -2), "detected": signals.get("market_size_choice") == "small", "signal_key": "market_size_choice"}
    ]
    investor_appeal_keys = ["market_size", "revenue_model", "scalability", "exit_potential", "investor_interest_in_space", "growth_potential"]

    # 2. Customer Demand
    customer_demand_factors = [
        {"label": "Severe Customer Pain Point", "points": get_points("Severe Customer Pain Point", 3), "detected": signals.get("pain_severity") == "severe", "signal_key": "pain_severity"},
        {"label": "Moderate Customer Pain Point", "points": get_points("Moderate Customer Pain Point", 1), "detected": signals.get("pain_severity") == "moderate", "signal_key": "pain_severity"},
        {"label": "Frequent Problem Occurrence (Daily/Weekly)", "points": get_points("Frequent Problem Occurrence (Daily/Weekly)", 2), "detected": signals.get("problem_frequency") in ["daily", "weekly"], "signal_key": "problem_frequency"},
        {"label": "Existing Buyers/Users Present", "points": get_points("Existing Buyers/Users Present", 2), "detected": signals.get("existing_buyers") is True, "signal_key": "existing_buyers"},
        {"label": "Clear ROI for Buyer", "points": get_points("Clear ROI for Buyer", 2), "detected": signals.get("clear_roi") is True, "signal_key": "clear_roi"},
        {"label": "High Willingness to Pay", "points": get_points("High Willingness to Pay", 1), "detected": signals.get("willingness_to_pay") == "high", "signal_key": "willingness_to_pay"},
        {"label": "Nice-to-Have Product Concept", "points": get_points("Nice-to-Have Product Concept", -2), "detected": signals.get("nice_to_have") is True, "signal_key": "nice_to_have"},
        {"label": "Low Willingness to Pay", "points": get_points("Low Willingness to Pay", -2), "detected": signals.get("willingness_to_pay") == "low", "signal_key": "willingness_to_pay"},
        {"label": "Infrequent Problem Occurrence", "points": get_points("Infrequent Problem Occurrence", -2), "detected": signals.get("problem_frequency") == "rare", "signal_key": "problem_frequency"},
        {"label": "Mild Customer Pain Point", "points": get_points("Mild Customer Pain Point", -1), "detected": signals.get("pain_severity") == "mild", "signal_key": "pain_severity"},
        {"label": "Proven Demand via Paying Customers", "points": get_points("Proven Demand via Paying Customers", 5), "detected": signals.get("validation_level") == "paying_customers", "signal_key": "validation_level"},
        {"label": "Proven Demand via Waitlist Signups", "points": get_points("Proven Demand via Waitlist Signups", 3), "detected": signals.get("validation_level") == "waitlist", "signal_key": "validation_level"},
        {"label": "Proven Demand via Interviews", "points": get_points("Proven Demand via Interviews", 1), "detected": signals.get("validation_level") == "conversations", "signal_key": "validation_level"},
        {"label": "Zero Validated Demand", "points": get_points("Zero Validated Demand", -2), "detected": signals.get("validation_level") == "none", "signal_key": "validation_level"},
        {"label": "Critical Pain Score (8-10)", "points": get_points("Critical Pain Score (8-10)", 2), "detected": signals.get("pain_score", 0) >= 8, "signal_key": "pain_score"},
        {"label": "Elevated Pain Score (5-7)", "points": get_points("Elevated Pain Score (5-7)", 1), "detected": 5 <= signals.get("pain_score", 0) <= 7, "signal_key": "pain_score"},
        {"label": "Low Pain Score (1-4)", "points": get_points("Low Pain Score (1-4)", -1), "detected": signals.get("pain_score", 0) <= 4, "signal_key": "pain_score"}
    ]
    customer_demand_keys = ["pain_severity", "problem_frequency", "existing_buyers", "clear_roi", "nice_to_have", "willingness_to_pay"]

    # 3. Market Timing
    market_timing_factors = [
        {"label": "Fast-Growing Industry Segment", "points": get_points("Fast-Growing Industry Segment", 3), "detected": signals.get("industry_growth") == "fast", "signal_key": "industry_growth"},
        {"label": "Moderate Industry Segment Growth", "points": get_points("Moderate Industry Segment Growth", 1), "detected": signals.get("industry_growth") == "moderate", "signal_key": "industry_growth"},
        {"label": "Technology Ready for Commercial Deployment", "points": get_points("Technology Ready for Commercial Deployment", 2), "detected": signals.get("technology_maturity") == "ready", "signal_key": "technology_maturity"},
        {"label": "Emerging Technology Stack", "points": get_points("Emerging Technology Stack", 1), "detected": signals.get("technology_maturity") == "emerging", "signal_key": "technology_maturity"},
        {"label": "Growing Consumer/Enterprise Adoption Curve", "points": get_points("Growing Consumer/Enterprise Adoption Curve", 2), "detected": signals.get("consumer_adoption") == "growing", "signal_key": "consumer_adoption"},
        {"label": "Supportive Regulatory Framework", "points": get_points("Supportive Regulatory Framework", 1), "detected": signals.get("regulatory_environment") == "supportive", "signal_key": "regulatory_environment"},
        {"label": "Too Early for Commercial Scaling", "points": get_points("Too Early for Commercial Scaling", -3), "detected": signals.get("too_early") is True, "signal_key": "too_early"},
        {"label": "Declining Industry Core Growth", "points": get_points("Declining Industry Core Growth", -3), "detected": signals.get("industry_growth") == "declining", "signal_key": "industry_growth"},
        {"label": "Restrictive Regulatory Environment", "points": get_points("Restrictive Regulatory Environment", -2), "detected": signals.get("regulatory_environment") == "restrictive", "signal_key": "regulatory_environment"},
        {"label": "Technology Stack Unripe / Unproven", "points": get_points("Technology Stack Unripe / Unproven", -2), "detected": signals.get("technology_maturity") == "not_ready", "signal_key": "technology_maturity"},
        {"label": "Strong \"Why Now\" Case", "points": get_points("Strong \"Why Now\" Case", 3), "detected": signals.get("why_now_strength") == "strong", "signal_key": "why_now_strength"},
        {"label": "Moderate \"Why Now\" Case", "points": get_points("Moderate \"Why Now\" Case", 1), "detected": signals.get("why_now_strength") == "moderate", "signal_key": "why_now_strength"},
        {"label": "Weak \"Why Now\" Case", "points": get_points("Weak \"Why Now\" Case", -2), "detected": signals.get("why_now_strength") == "weak", "signal_key": "why_now_strength"}
    ]
    market_timing_keys = ["industry_growth", "technology_maturity", "consumer_adoption", "regulatory_environment", "too_early"]

    # 4. Technical Feasibility
    technical_feasibility_factors = [
        {"label": "Existing Ecosystem APIs/APIs Available", "points": get_points("Existing Ecosystem APIs/APIs Available", 3), "detected": signals.get("existing_apis_available") is True, "signal_key": "existing_apis_available"},
        {"label": "Simple MVP Development Path", "points": get_points("Simple MVP Development Path", 2), "detected": signals.get("mvp_complexity") == "simple", "signal_key": "mvp_complexity"},
        {"label": "Moderate MVP Development Path", "points": get_points("Moderate MVP Development Path", 1), "detected": signals.get("mvp_complexity") == "moderate", "signal_key": "mvp_complexity"},
        {"label": "Low Infrastructure Complexity", "points": get_points("Low Infrastructure Complexity", 1), "detected": signals.get("infrastructure_complexity") == "low", "signal_key": "infrastructure_complexity"},
        {"label": "Basic R&D or Scientific Research Required", "points": get_points("Basic R&D or Scientific Research Required", -3), "detected": signals.get("mvp_complexity") == "research_required", "signal_key": "mvp_complexity"},
        {"label": "Requires Custom New Hardware", "points": get_points("Requires Custom New Hardware", -2), "detected": signals.get("requires_new_hardware") is True, "signal_key": "requires_new_hardware"},
        {"label": "Complex Frontend/Backend MVP Scope", "points": get_points("Complex Frontend/Backend MVP Scope", -1), "detected": signals.get("mvp_complexity") == "complex", "signal_key": "mvp_complexity"},
        {"label": "High Infrastructure / Server Complexity", "points": get_points("High Infrastructure / Server Complexity", -1), "detected": signals.get("infrastructure_complexity") == "high", "signal_key": "infrastructure_complexity"},
        {"label": "Concept Phase / Ideation Stage", "points": get_points("Concept Phase / Ideation Stage", -2), "detected": signals.get("current_stage") == "forming", "signal_key": "current_stage"},
        {"label": "Prototype / Wired Interactive Stage", "points": get_points("Prototype / Wired Interactive Stage", 2), "detected": signals.get("current_stage") == "prototype", "signal_key": "current_stage"},
        {"label": "Launched MVP Stage", "points": get_points("Launched MVP Stage", 4), "detected": signals.get("current_stage") == "mvp", "signal_key": "current_stage"}
    ]
    technical_feasibility_keys = ["existing_apis_available", "mvp_complexity", "requires_new_hardware", "ai_dependency", "infrastructure_complexity"]

    # 5. Competitive Moat
    competitive_moat_factors = [
        {"label": "Proprietary Data Accumulation Loop", "points": get_points("Proprietary Data Accumulation Loop", 3), "detected": signals.get("has_proprietary_data") is True, "signal_key": "has_proprietary_data"},
        {"label": "Organic Network Effects Loop", "points": get_points("Organic Network Effects Loop", 3), "detected": signals.get("has_network_effects") is True, "signal_key": "has_network_effects"},
        {"label": "High Switching Costs for Customers", "points": get_points("High Switching Costs for Customers", 2), "detected": signals.get("switching_costs") == "high", "signal_key": "switching_costs"},
        {"label": "Moderate Customer Switching Costs", "points": get_points("Moderate Customer Switching Costs", 1), "detected": signals.get("switching_costs") == "medium", "signal_key": "switching_costs"},
        {"label": "Strong Product Differentiation", "points": get_points("Strong Product Differentiation", 2), "detected": signals.get("differentiation") == "strong", "signal_key": "differentiation"},
        {"label": "Moderate Product Differentiation", "points": get_points("Moderate Product Differentiation", 1), "detected": signals.get("differentiation") == "moderate", "signal_key": "differentiation"},
        {"label": "Product is Extremely Easy to Clone", "points": get_points("Product is Extremely Easy to Clone", -3), "detected": signals.get("easy_to_copy") is True, "signal_key": "easy_to_copy"},
        {"label": "Very High Competitive Saturation", "points": get_points("Very High Competitive Saturation", -2), "detected": signals.get("competition_level") == "very_high", "signal_key": "competition_level"},
        {"label": "High Competitive Saturation", "points": get_points("High Competitive Saturation", -1), "detected": signals.get("competition_level") == "high", "signal_key": "competition_level"},
        {"label": "Weak Core Differentiation", "points": get_points("Weak Core Differentiation", -2), "detected": signals.get("differentiation") == "weak", "signal_key": "differentiation"},
        {"label": "Low Customer Switching Costs", "points": get_points("Low Customer Switching Costs", -1), "detected": signals.get("switching_costs") == "low", "signal_key": "switching_costs"},
        {"label": "Defensible Competitor Moat", "points": get_points("Defensible Competitor Moat", 3), "detected": signals.get("moat_strength") == "strong", "signal_key": "moat_strength"},
        {"label": "Moderate Defensibility Moat", "points": get_points("Moderate Defensibility Moat", 1), "detected": signals.get("moat_strength") == "moderate", "signal_key": "moat_strength"},
        {"label": "No Moat / Low Defensibility", "points": get_points("No Moat / Low Defensibility", -2), "detected": signals.get("moat_strength") == "weak", "signal_key": "moat_strength"}
    ]
    competitive_moat_keys = ["has_proprietary_data", "has_network_effects", "switching_costs", "differentiation", "competition_level", "easy_to_copy"]

    # 6. Founder-Market Fit
    founder_market_fit_factors = [
        {"label": "Domain Expert Founder(s)", "points": get_points("Domain Expert Founder(s)", 3), "detected": signals.get("domain_expertise") == "expert", "signal_key": "domain_expertise"},
        {"label": "Experienced in Core Domain", "points": get_points("Experienced in Core Domain", 2), "detected": signals.get("domain_expertise") == "experienced", "signal_key": "domain_expertise"},
        {"label": "Founder is Technical", "points": get_points("Founder is Technical", 2), "detected": signals.get("technical_background") is True, "signal_key": "technical_background"},
        {"label": "Deep Industry Experience", "points": get_points("Deep Industry Experience", 2), "detected": signals.get("industry_experience") == "deep", "signal_key": "industry_experience"},
        {"label": "Some Industry Experience", "points": get_points("Some Industry Experience", 1), "detected": signals.get("industry_experience") == "some", "signal_key": "industry_experience"},
        {"label": "Strong Track Record of Launching", "points": get_points("Strong Track Record of Launching", 2), "detected": signals.get("execution_track_record") == "strong", "signal_key": "execution_track_record"},
        {"label": "Some Track Record of Launching", "points": get_points("Some Track Record of Launching", 1), "detected": signals.get("execution_track_record") == "some", "signal_key": "execution_track_record"},
        {"label": "Zero Prior Domain Knowledge", "points": get_points("Zero Prior Domain Knowledge", -2), "detected": signals.get("domain_expertise") == "none", "signal_key": "domain_expertise"},
        {"label": "Domain is in Learning Phase", "points": get_points("Domain is in Learning Phase", -1), "detected": signals.get("domain_expertise") == "learning", "signal_key": "domain_expertise"},
        {"label": "Zero Core Industry Experience", "points": get_points("Zero Core Industry Experience", -1), "detected": signals.get("industry_experience") == "none", "signal_key": "industry_experience"},
        {"label": "Zero Launching Track Record", "points": get_points("Zero Launching Track Record", -1), "detected": signals.get("execution_track_record") == "none", "signal_key": "execution_track_record"},
        {"label": "Founder Can Code Directly", "points": get_points("Founder Can Code Directly", 2), "detected": signals.get("technical_background_choice") == "can_code", "signal_key": "technical_background_choice"},
        {"label": "Founder Used to Code", "points": get_points("Founder Used to Code", 1), "detected": signals.get("technical_background_choice") == "used_to_code", "signal_key": "technical_background_choice"},
        {"label": "Team features Technical Co-Founder", "points": get_points("Team features Technical Co-Founder", 1), "detected": signals.get("founder_count") == "team" and signals.get("has_technical_cofounder") is True, "signal_key": "has_technical_cofounder"}
    ]
    founder_market_fit_keys = ["domain_expertise", "technical_background", "industry_experience", "execution_track_record", "credibility"]

    return {
        "investor_appeal": evaluate_dimension(5.0, investor_appeal_factors, investor_appeal_keys),
        "customer_demand": evaluate_dimension(5.0, customer_demand_factors, customer_demand_keys),
        "market_timing": evaluate_dimension(5.0, market_timing_factors, market_timing_keys),
        "technical_feasibility": evaluate_dimension(5.0, technical_feasibility_factors, technical_feasibility_keys),
        "competitive_moat": evaluate_dimension(5.0, competitive_moat_factors, competitive_moat_keys),
        "founder_market_fit": evaluate_dimension(5.0, founder_market_fit_factors, founder_market_fit_keys),
    }
