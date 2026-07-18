'use client';

import React from 'react';

export const defaultPhases = [
  {
    stage: "01",
    title: "Finalize the Idea",
    description: "We pressure-test your concept, define the core problem, identify the target user, and align on a product vision that is ambitious but buildable.",
    duration: "2 weeks"
  },
  {
    stage: "02",
    title: "Operating Agreement",
    description: "We align on ownership, engagement terms, and mutual expectations before a single line of code is written.",
    duration: "1 week"
  },
  {
    stage: "03",
    title: "Requirements & Business Case",
    description: "Working sessions, user story mapping, PRFAQs, and a formal business case — so every build decision has a strategic rationale.",
    duration: "2 weeks"
  },
  {
    stage: "04",
    title: "Build the Product",
    description: "Senior in-house engineers build your MLP — no outsourcing, no juniors. Bi-weekly demos, continuous feedback, relentless quality.",
    duration: "12-18 weeks"
  },
  {
    stage: "05",
    title: "Go to Market",
    description: "Launch strategy, positioning, pitch materials, and early user acquisition support. You go to market ready — not just live.",
    duration: "2 weeks"
  }
];

export const FALLBACK_PHASE_DATA = [
  {
    phaseNum: "01", phaseKey: "SELECT",
    title: "We choose ideas worth building",
    description: "Submit your idea — not the how, just the what and why, in one page or less. Every submission gets reviewed by our partners directly.",
    bullets: [
      { title: "Submit your idea", desc: "One page max. We're evaluating the problem and your fit — not asking for a business plan yet." },
      { title: "Meet with partners", desc: "You'll learn what CrestCode does, what support looks like, and the full process ahead." }
    ],
    metricHeader: null,
    metrics: [
      { num: "01", label: "Typical duration", value: "1-2 weeks", valueColor: "#0F172A" },
      { num: "", label: "What you need", value: "Just the idea", valueColor: "#0F172A" }
    ]
  },
  {
    phaseNum: "02", phaseKey: "SUBMIT",
    title: "Submit your idea",
    description: "Share your concept with our team. We review every submission within 24–48 hours and assess fit across type potential, technical feasibility, and founder conviction.",
    bullets: [
      { title: "Initial assessment", desc: "We review every submission within 24–48 hours to assess type potential, technical feasibility, and founder conviction." },
      { title: "Partner meeting", desc: "Get invited to learn what Crestcode does, the support we provide, and the overall process." }
    ],
    metricHeader: null,
    metrics: [
      { num: "01", label: "Typical duration", value: "24-48 hours", valueColor: "#0F172A" },
      { num: "", label: "What you need", value: "1 page max", valueColor: "#0F172A" }
    ]
  },
  {
    phaseNum: "03", phaseKey: "VALIDATE",
    title: "We pressure-test before we build",
    description: "If there's mutual fit, you submit the full proposal — business model, strategic alignment, and technical scope — before any code gets written.",
    bullets: [
      { title: "Full proposal", desc: "Business model, target customer, and technical specifications get detailed and stress-tested together." },
      { title: "Team assigned", desc: "Senior engineers and product leads are allocated — the people you meet are the people who build." }
    ],
    metricHeader: null,
    metrics: [
      { num: "01", label: "Typical duration", value: "1-2 weeks", sub: "Proposal review through team allocation", valueColor: "#0F172A" },
      { num: "02", label: "Output", value: "Signed scope + team", sub: "Clear deliverables before build begins", valueColor: "#0F172A" }
    ]
  },
  {
    phaseNum: "04", phaseKey: "BUILD",
    title: "Design and engineering, in lockstep",
    description: "A high-velocity, structured roadmap from zero to market entry — six execution stages optimized for speed without sacrificing quality.",
    bullets: [
      { title: "Discovery & requirements", duration: "1-2 weeks", desc: "Defining core goals and user needs for a scalable architecture." },
      { title: "Strategy & setup", duration: "1-2 weeks", desc: "Technical planning and resource allocation." },
      { title: "Design & prototyping", duration: "3-4 weeks", desc: "High-fidelity UI/UX design and interaction mapping." },
      { title: "Agile development", duration: "8-12 weeks", desc: "Building core features with bi-weekly demos." },
      { title: "QA & launch prep", duration: "2 weeks", desc: "Rigorous testing and production deployment." }
    ],
    metricHeader: "HOW WE MEASURE THIS PHASE",
    metrics: [
      { num: "01", label: "Sprint velocity", value: "Bi-weekly demos", sub: "Working software shown every cycle", valueColor: "#005AE2" },
      { num: "02", label: "Scope stability", value: "85%+ on-spec", sub: "Features matching original scope", valueColor: "#10B981" },
      { num: "03", label: "Code quality gate", value: "80%+ test coverage", sub: "Minimum before a feature is \"done\"", valueColor: "#005AE2" },
      { num: "04", label: "Time to MLP", value: "15-22 weeks", sub: "Discovery through QA, idea-dependent", valueColor: "#B45309" }
    ]
  },
  {
    phaseNum: "05", phaseKey: "LAUNCH",
    title: "Precision over noise",
    description: "Founder-led, community-first, metrics-gated. Growth is earned before it's amplified — we deploy strategically to a beachhead market first.",
    bullets: [
      { title: "Beachhead deployment", desc: "Controlled release, rapid feedback gathering, and early community seeding." }
    ],
    metricHeader: "HOW WE MEASURE THIS PHASE",
    metrics: [
      { num: "01", label: "User retention (Day 30)", value: "Target 20-40%", sub: "Early product-market signal", valueColor: "#B45309" },
      { num: "02", label: "CAC : LTV ratio", value: "Target 1 : 4-5", sub: "Threshold before recommending paid growth", valueColor: "#B45309" },
      { num: "03", label: "Platform stability", value: "99.5%+ uptime", sub: "Monitored from first public release", valueColor: "#10B981" },
      { num: "04", label: "Time to first 100 users", value: "2-4 weeks", sub: "From beachhead release to adoption", valueColor: "#005AE2" }
    ]
  },
  {
    phaseNum: "06", phaseKey: "PMF",
    title: "Achieving Product-Market Fit",
    description: "We measure, iterate, and refine until your product earns genuine retention. PMF is not declared — it is proven through real user behavior and engagement signals.",
    bullets: [
      { title: "Retention signals", desc: "Track repeat usage, engagement depth, and organic referral patterns that indicate real product value." },
      { title: "User feedback loops", desc: "Structured interviews and behavioral data to identify what resonates and what needs refinement." },
      { title: "Iteration cycles", desc: "Rapid product adjustments based on validated learnings — not assumptions." }
    ],
    metricHeader: "HOW WE MEASURE THIS PHASE",
    metrics: [
      { num: "01", label: "Target PMF timeline", value: "3-6 months", sub: "Structured iteration cycles", valueColor: "#B45309" },
      { num: "02", label: "Retention metric", value: "Sustained active usage", sub: "Product-market confirmation", valueColor: "#005AE2" }
    ]
  },
  {
    phaseNum: "07", phaseKey: "SCALE",
    title: "We stay past the finish line",
    description: "This is where most studios disappear. We don't — refining distribution, optimizing the acquisition funnel, and supporting fundraising as the venture grows.",
    bullets: [
      { title: "Distribution & growth", desc: "Refining channels and optimizing the acquisition funnel for sustained impact." },
      { title: "Ongoing partnership", desc: "Continued access to the CrestCode network, engineering support, and strategic guidance." }
    ],
    metricHeader: "HOW WE MEASURE THIS PHASE",
    metrics: [
      { num: "01", label: "Month-over-month growth", value: "Target 10-20%", sub: "Sustainable compounding growth", valueColor: "#10B981" },
      { num: "02", label: "Channel diversification", value: "2+ active channels", sub: "Reduces single-source dependency", valueColor: "#005AE2" },
      { num: "03", label: "Net revenue retention", value: "Target 100%+", sub: "Expansion outpacing churn", valueColor: "#B45309" },
      { num: "04", label: "Continued engagement", value: "Ongoing partnership", sub: "Engaged through fundraising & beyond", valueColor: "#005AE2" }
    ]
  }
];

export const mergePhase = (idx: number, fallback: any, studioContent: any) => {
  const CMS_ITEMS = studioContent.selection_process?.items || [];
  const cms = CMS_ITEMS[idx] || {};
  return {
    ...fallback,
    title: cms.title ?? fallback.title,
    description: cms.description ?? fallback.description,
    metricHeader: cms.metricHeader !== undefined ? cms.metricHeader : fallback.metricHeader,
    bullets: (cms.bullets && cms.bullets.length > 0)
      ? cms.bullets.map((b: any, bIdx: number) => ({
          ...(fallback.bullets[bIdx] || {}),
          title: b.title ?? (fallback.bullets[bIdx]?.title || ''),
          desc: b.desc ?? (fallback.bullets[bIdx]?.desc || ''),
          ...(b.duration !== undefined ? { duration: b.duration } : {}),
        }))
      : fallback.bullets,
    metrics: (cms.metrics && cms.metrics.length > 0)
      ? cms.metrics.map((m: any, mIdx: number) => ({
          ...(fallback.metrics[mIdx] || {}),
          ...m,
        }))
      : fallback.metrics,
  };
};

export const getPhaseTabs = (studioContent: any) => {
  const CMS_TABS = studioContent.selection_process?.tabs;
  return [
    { title: CMS_TABS?.[0]?.title || 'SELECT', id: 0 },
    { title: CMS_TABS?.[1]?.title || 'SUBMIT', id: 1 },
    { title: CMS_TABS?.[2]?.title || 'VALIDATE', id: 2 },
    { title: CMS_TABS?.[3]?.title || 'BUILD', id: 3 },
    { title: CMS_TABS?.[4]?.title || 'LAUNCH', id: 4 },
    { title: CMS_TABS?.[5]?.title || 'PMF', id: 5 },
    { title: CMS_TABS?.[6]?.title || 'SCALE', id: 6 },
  ];
};

export const getCurrentPhaseData = (studioContent: any, heroCarouselIndex: number) => {
  const PHASE_DATA = FALLBACK_PHASE_DATA.map((fallback, idx) => mergePhase(idx, fallback, studioContent));
  return PHASE_DATA[heroCarouselIndex];
};
