-- Create tool_configurations table
create table if not exists public.tool_configurations (
  id              uuid primary key default gen_random_uuid(),
  key             text not null unique,
  config          jsonb not null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Auto-update updated_at on every row change
create or replace function public.handle_tool_configurations_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_tool_configurations_updated_at on public.tool_configurations;
create trigger set_tool_configurations_updated_at
  before update on public.tool_configurations
  for each row execute function public.handle_tool_configurations_updated_at();

-- Enable RLS
alter table public.tool_configurations enable row level security;

-- Public can read tool configs
create policy "Public can read tool configurations"
  on public.tool_configurations for select
  using (true);

-- Service role full access
create policy "Service role full access for tool configurations"
  on public.tool_configurations for all
  using (true)
  with check (true);

-- Seed defaults
insert into public.tool_configurations (key, config) values
  ('idea_validator', '{
    "scoring_weights": {
      "quality": {
        "demand": 0.35,
        "moat": 0.30,
        "technical": 0.20,
        "founder": 0.15
      },
      "readiness": {
        "appeal": 0.40,
        "timing": 0.30,
        "founder": 0.15,
        "demand": 0.15
      }
    },
    "adjustments": {
      "validation": {
        "none": -1.5,
        "paying_customers": 1.5
      },
      "stage": {
        "forming": -1.5,
        "mvp": 1.0
      }
    },
    "triage_thresholds": {
      "strong_pass": 7.5,
      "needs_work": 4.5
    },
    "prompt_templates": {
      "signal_extraction": "You are a startup analyst. Your ONLY job is to extract factual, observable signals from a startup idea description. You must NOT assign scores, ratings, or judgements.\nRead the startup idea and output categorical signals using the exact values specified in the schema.\nRULES:\n- Use \"unknown\" when you cannot confidently determine a signal from the provided information\n- Be conservative: only mark \"existing_buyers: true\" if there is clear evidence of paying customers\n- Do not infer beyond what is explicitly stated or strongly implied\n- \"domain_expertise: expert\" requires direct evidence the founder has deep, practitioner-level knowledge\n- \"has_proprietary_data: true\" requires evidence of unique, defensible data assets — not just \"will collect data\"\n- \"too_early: true\" means the market or technology clearly does not exist yet at commercial scale\n- Estimate \"moat_strength\" (''strong'' | ''moderate'' | ''weak'') based on Moat and Competitors description.\n- Estimate \"why_now_strength\" (''strong'' | ''moderate'' | ''weak'') based on Why Now description.\nOutput strict JSON matching the schema. No commentary.\n\nJSON Schema structure:\n{\n  \"market_size\": \"large\" | \"medium\" | \"small\" | \"unknown\",\n  \"revenue_model\": \"subscription\" | \"usage_based\" | \"one_time\" | \"marketplace\" | \"freemium\" | \"unknown\",\n  \"growth_potential\": \"high\" | \"medium\" | \"low\" | \"unknown\",\n  \"scalability\": \"high\" | \"moderate\" | \"low\" | \"unknown\",\n  \"exit_potential\": \"high\" | \"medium\" | \"low\" | \"unknown\",\n  \"investor_interest_in_space\": \"high\" | \"medium\" | \"low\" | \"unknown\",\n  \"pain_severity\": \"severe\" | \"moderate\" | \"mild\" | \"unknown\",\n  \"problem_frequency\": \"daily\" | \"weekly\" | \"occasional\" | \"rare\" | \"unknown\",\n  \"existing_buyers\": boolean,\n  \"clear_roi\": boolean,\n  \"nice_to_have\": boolean,\n  \"willingness_to_pay\": \"high\" | \"medium\" | \"low\" | \"unknown\",\n  \"industry_growth\": \"fast\" | \"moderate\" | \"slow\" | \"declining\" | \"unknown\",\n  \"technology_maturity\": \"ready\" | \"emerging\" | \"not_ready\" | \"unknown\",\n  \"consumer_adoption\": \"growing\" | \"early\" | \"mass_market\" | \"unknown\",\n  \"regulatory_environment\": \"supportive\" | \"neutral\" | \"restrictive\" | \"unknown\",\n  \"too_early\": boolean,\n  \"existing_apis_available\": boolean,\n  \"mvp_complexity\": \"simple\" | \"moderate\" | \"complex\" | \"research_required\" | \"unknown\",\n  \"requires_new_hardware\": boolean,\n  \"ai_dependency\": \"core\" | \"supporting\" | \"none\" | \"unknown\",\n  \"infrastructure_complexity\": \"low\" | \"medium\" | \"high\" | \"unknown\",\n  \"has_proprietary_data\": boolean,\n  \"has_network_effects\": boolean,\n  \"switching_costs\": \"high\" | \"medium\" | \"low\" | \"unknown\",\n  \"differentiation\": \"strong\" | \"moderate\" | \"weak\" | \"unknown\",\n  \"competition_level\": \"low\" | \"medium\" | \"high\" | \"very_high\" | \"unknown\",\n  \"easy_to_copy\": boolean,\n  \"domain_expertise\": \"expert\" | \"experienced\" | \"learning\" | \"none\" | \"unknown\",\n  \"technical_background\": boolean,\n  \"industry_experience\": \"deep\" | \"some\" | \"none\" | \"unknown\",\n  \"execution_track_record\": \"strong\" | \"some\" | \"none\" | \"unknown\",\n  \"credibility\": \"high\" | \"medium\" | \"low\" | \"unknown\"\n}",
      "narrative_generation": "You are an expert venture capital investment analyst writing a premium, investor-grade startup due diligence report.\nYour role is to write narrative explanations, risk mitigation plans, comparable startup analyses, and investor memos that strictly align with the pre-computed scores and signals.\nYou must NOT change or contradict any score.\n\nProvide the response in strict JSON matching this exact structure:\n{\n  \"startup_summary\": \"Brief 1-paragraph summary of the opportunity\",\n  \"why_this_score\": \"Comprehensive explanation of why the overall score was assigned based on the dimension scores, stage, and validation level.\",\n  \"biggest_assumption\": \"The primary unvalidated leap-of-faith assumption (e.g. Willingness to pay, user behavior changes)\",\n  \"missing_evidence\": \"The single most critical missing proof point (e.g. Locked pilots, waitlist size, demo engagement metrics)\",\n  \"what_increased_the_score\": [\"Enhancer 1\", \"Enhancer 2\", \"Enhancer 3\"],\n  \"what_reduced_the_score\": [\"Detractor 1\", \"Detractor 2\", \"Detractor 3\"],\n  \"how_to_improve\": [\"Action 1\", \"Action 2\", \"Action 3\"],\n  \"investor_questions\": [\"Question 1\", \"Question 2\", \"Question 3\"],\n  \"highest_scoring_dimension\": \"Name of highest dimension\",\n  \"lowest_scoring_dimension\": \"Name of lowest dimension\",\n  \n  \"risk_matrix\": {\n    \"market\": { \"severity\": \"high\"|\"medium\"|\"low\", \"reason\": \"why\", \"mitigation\": \"how to mitigate\" },\n    \"execution\": { \"severity\": \"high\"|\"medium\"|\"low\", \"reason\": \"why\", \"mitigation\": \"how to mitigate\" },\n    \"funding\": { \"severity\": \"high\"|\"medium\"|\"low\", \"reason\": \"why\", \"mitigation\": \"how to mitigate\" },\n    \"competition\": { \"severity\": \"high\"|\"medium\"|\"low\", \"reason\": \"why\", \"mitigation\": \"how to mitigate\" },\n    \"technical\": { \"severity\": \"high\"|\"medium\"|\"low\", \"reason\": \"why\", \"mitigation\": \"how to mitigate\" },\n    \"legal\": { \"severity\": \"high\"|\"medium\"|\"low\", \"reason\": \"why\", \"mitigation\": \"how to mitigate\" },\n    \"operational\": { \"severity\": \"high\"|\"medium\"|\"low\", \"reason\": \"why\", \"mitigation\": \"how to mitigate\" }\n  },\n  \n  \"validation_roadmap\": [\n    { \"phase\": \"Phase 1: Validation\", \"task\": \"Specific task\", \"timeline\": \"Weeks 1-2\", \"impact\": \"Impact statement\", \"effort\": \"Low\"|\"Medium\"|\"High\", \"expected_score_improvement\": \"+0.x\" }\n  ],\n  \n  \"comparable_startups\": [\n    { \"name\": \"Name\", \"description\": \"Description\", \"why_comparable\": \"Why structurally similar\", \"business_model\": \"Business model\", \"lessons_learned\": \"Lesson\" }\n  ],\n  \n  \"due_diligence_questions\": {\n    \"market\": [{ \"question\": \"Question?\", \"expected_evidence\": \"Evidence\", \"suggested_prep\": \"How\" }],\n    \"customer\": [{ \"question\": \"Question?\", \"expected_evidence\": \"Evidence\", \"suggested_prep\": \"How\" }],\n    \"revenue\": [{ \"question\": \"Question?\", \"expected_evidence\": \"Evidence\", \"suggested_prep\": \"How\" }],\n    \"technology\": [{ \"question\": \"Question?\", \"expected_evidence\": \"Evidence\", \"suggested_prep\": \"How\" }],\n    \"competition\": [{ \"question\": \"Question?\", \"expected_evidence\": \"Evidence\", \"suggested_prep\": \"How\" }],\n    \"operations\": [{ \"question\": \"Question?\", \"expected_evidence\": \"Evidence\", \"suggested_prep\": \"How\" }],\n    \"legal\": [{ \"question\": \"Question?\", \"expected_evidence\": \"Evidence\", \"suggested_prep\": \"How\" }],\n    \"financial\": [{ \"question\": \"Question?\", \"expected_evidence\": \"Evidence\", \"suggested_prep\": \"How\" }]\n  },\n  \n  \"co_founder_recommendations\": \"Detailed cofounder advice\",\n  \n  \"investor_memo\": {\n    \"executive_summary\": \"Memo summary\",\n    \"investment_thesis\": \"Thesis\",\n    \"strengths\": \"Strengths\",\n    \"weaknesses\": \"Weaknesses\",\n    \"major_risks\": \"Risks\",\n    \"recommendation\": \"Pass\" | \"Monitor\" | \"Proceed Carefully\" | \"Strong Pass\",\n    \"confidence_rating\": \"Confidence rating\",\n    \"next_validation_step\": \"Immediate next validation step\"\n  },\n  \n  \"dimensions\": {\n    \"investor_appeal\": { \"evaluation_criteria\": [\"criteria\"], \"why_this_score\": \"prose\", \"improvement_actions\": [\"actions\"] },\n    \"customer_demand\": { \"evaluation_criteria\": [\"criteria\"], \"why_this_score\": \"prose\", \"improvement_actions\": [\"actions\"] },\n    \"market_timing\": { \"evaluation_criteria\": [\"criteria\"], \"why_this_score\": \"prose\", \"improvement_actions\": [\"actions\"] },\n    \"technical_feasibility\": { \"evaluation_criteria\": [\"criteria\"], \"why_this_score\": \"prose\", \"improvement_actions\": [\"actions\"] },\n    \"competitive_moat\": { \"evaluation_criteria\": [\"criteria\"], \"why_this_score\": \"prose\", \"improvement_actions\": [\"actions\"] },\n    \"founder_market_fit\": { \"evaluation_criteria\": [\"criteria\"], \"why_this_score\": \"prose\", \"improvement_actions\": [\"actions\"] }\n  }\n}"
    },
    "feature_flags": {
      "use_mock_db": false,
      "use_mock_ai": false
    }
  }'),
  ('build_estimator', '{
    "screen_counts": {
      "landing": 1,
      "marketing": 5,
      "internal": 8,
      "saas": 18,
      "marketplace": 22,
      "mobile": 18,
      "ai_product": 16,
      "enterprise": 30,
      "other": 10
    },
    "platform_additions": {
      "ios": 8,
      "android_shared": 4,
      "android_only": 8,
      "admin": 5
    },
    "ai_additions": {
      "none": 0,
      "assistant": 3,
      "report_gen": 5,
      "ocr": 4,
      "ai_core": 8
    },
    "feature_additions": {
      "profiles": 2,
      "dashboard": 3,
      "analytics": 4,
      "reporting": 3,
      "payments": 4,
      "booking": 4,
      "search": 2,
      "notifications": 2,
      "messaging": 5,
      "file_uploads": 2,
      "roles": 3,
      "collaboration": 5
    },
    "team_multipliers": {
      "solo": [1.5, 1.75],
      "small": [1.0, 1.0],
      "dedicated": [0.6, 0.75]
    },
    "weeks_adjustments": {
      "cofounder_bonus": -2.0,
      "low_feasibility_penalty": 3.0,
      "mid_feasibility_penalty": 1.0
    },
    "complexity_thresholds": {
      "low": 4,
      "medium": 12,
      "high": 24
    },
    "cta_values": {
      "href": "/contact",
      "text": "Schedule Discovery Call"
    }
  }')
on conflict (key) do update set config = excluded.config;
