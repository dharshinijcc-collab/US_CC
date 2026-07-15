-- Update tool_configurations for idea_validator to merge new rule_modifiers
update public.tool_configurations
set config = config || jsonb_build_object(
  'rule_modifiers', jsonb_build_object(
    'Large Addressable Market', 2.0,
    'Medium Addressable Market', 1.0,
    'Small Addressable Market', -2.0,
    'Targeting Mass Market', 3.0,
    'Targeting Large Market Segment', 2.0,
    'Targeting Medium Market Segment', 1.0,
    'Targeting Small/Niche Market Segment', -2.0,
    'Severe Customer Pain Point', 3.0,
    'Moderate Customer Pain Point', 1.0,
    'Mild Customer Pain Point', -1.0,
    'Proven Demand via Paying Customers', 5.0,
    'Proven Demand via Waitlist Signups', 3.0,
    'Proven Demand via Interviews', 1.0,
    'Zero Validated Demand', -2.0,
    'Critical Pain Score (8-10)', 2.0,
    'Elevated Pain Score (5-7)', 1.0,
    'Low Pain Score (1-4)', -1.0,
    'Proprietary Data Accumulation Loop', 3.0,
    'Organic Network Effects Loop', 3.0,
    'Strong Product Differentiation', 2.0,
    'Defensible Competitor Moat', 3.0,
    'Moderate Customer Switching Costs', 1.0,
    'Moderate Product Differentiation', 1.0,
    'Moderate Defensibility Moat', 1.0,
    'Product is Extremely Easy to Clone', -3.0,
    'Weak Core Differentiation', -2.0,
    'No Moat / Low Defensibility', -2.0,
    'Low Customer Switching Costs', -1.0,
    'High Customer Switching Costs', 2.0,
    'Simple MVP Development Path', 2.0,
    'Launched MVP Stage', 4.0,
    'Moderate MVP Development Path', 1.0,
    'Prototype / Wired Interactive Stage', 2.0,
    'Complex Frontend/Backend MVP Scope', -1.0,
    'Basic R&D or Scientific Research Required', -3.0,
    'Low Infrastructure Complexity', 1.0,
    'High Infrastructure / Server Complexity', -1.0,
    'Requires Custom New Hardware', -2.0,
    'Domain Expert Founder(s)', 3.0,
    'Deep Industry Experience', 2.0,
    'Strong Track Record of Launching', 2.0,
    'Experienced in Core Domain', 2.0,
    'Some Industry Experience', 1.0,
    'Some Track Record of Launching', 1.0,
    'Zero Prior Domain Knowledge', -2.0,
    'Zero Core Industry Experience', -1.0,
    'Zero Launching Track Record', -1.0,
    'Subscription / Recurring Revenue', 2.0,
    'High Growth Potential', 1.0,
    'High Scalability Potential', 2.0,
    'Moderate Scalability Potential', 1.0,
    'One-Time Revenue Model', -1.0,
    'Low Scalability Potential', -1.0,
    'Fast-Growing Industry Segment', 3.0,
    'Strong "Why Now" Case', 3.0,
    'Moderate Industry Segment Growth', 1.0,
    'Moderate "Why Now" Case', 1.0,
    'Declining Industry Core Growth', -3.0,
    'Weak "Why Now" Case', -2.0,
    'Too Early for Commercial Scaling', -3.0
  )
)
where key = 'idea_validator';

-- Update tool_configurations for build_estimator to merge feature_tiers, feature_tier_additions, and integration_additions
update public.tool_configurations
set config = config || jsonb_build_object(
  'feature_tiers', jsonb_build_object(
    'low', 3,
    'medium', 7
  ),
  'feature_tier_additions', jsonb_build_object(
    'low', 0,
    'medium', 2,
    'high', 5
  ),
  'integration_additions', jsonb_build_object(
    'standard', 2,
    'custom', 3
  )
)
where key = 'build_estimator';
