import type { Answers, EstimateResult, ProductType, AILevel, TeamPref } from './types';
import { PRODUCT_TYPES, AI_OPTIONS, FEATURE_OPTIONS, INTEGRATION_OPTIONS, TEAM_OPTIONS } from './config';

export function calculateEstimate(a: Answers, customConfig?: any): EstimateResult {
  if (!a.productType || a.aiLevel.length === 0 || !a.teamPref) {
    return { minDays: 0, maxDays: 0, complexity: 'Low', complexityReason: '', team: [], drivers: [], phases: [], risks: [], costDrivers: [], mvpScope: { include: [], defer: [] } };
  }

  // ── Rule: 1 page/screen = 1 day (min) · 2 days (max) ────────────────────
  // Base screen counts per product type (CrestCode curated)
  const BASE_PAGES: Record<ProductType, number> = customConfig?.screen_counts || {
    landing:    1,   // 1 page
    marketing:  5,   // ~5 pages (Home, About, Services, Blog, Contact)
    internal:   8,   // ~8 screens
    saas:       18,  // ~18 screens
    marketplace:22,  // ~22 screens
    mobile:     18,  // ~18 screens
    ai_product: 16,  // ~16 screens
    enterprise: 30,  // ~30 screens
    other:      10,  // ~10 screens
  };

  let pages = BASE_PAGES[a.productType] || 10;

  // Platform additions (extra screens)
  const platformAdditions = customConfig?.platform_additions || {
    ios: 8,
    android_shared: 4,
    android_only: 8,
    admin: 5
  };
  const hasIOS = a.platforms.includes('ios');
  const hasAndroid = a.platforms.includes('android');
  if (hasIOS)    pages += platformAdditions.ios ?? 8;
  if (hasAndroid) pages += hasIOS ? (platformAdditions.android_shared ?? 4) : (platformAdditions.android_only ?? 8);
  if (a.platforms.includes('admin') && !['saas','marketplace','enterprise'].includes(a.productType)) {
    pages += platformAdditions.admin ?? 5;
  }

  // AI feature additions (extra screens/flows)
  const AI_PAGES: Record<AILevel, number> = customConfig?.ai_additions || {
    none:       0,
    assistant:  3,   // chat UI + config + history
    report_gen: 5,   // input form + processing + report view + export + history
    ocr:        4,   // upload + processing + results + corrections
    ai_core:    8,   // model config + training UI + dashboard + results + 4 more
  };
  a.aiLevel.forEach(level => {
    pages += AI_PAGES[level] ?? 0;
  });

  // Integration additions (each integration adds setup/config screens)
  const integrationAdditions = customConfig?.integration_additions || { standard: 2, custom: 3 };
  a.integrations.forEach(i => {
    pages += i === 'custom' ? (integrationAdditions.custom ?? 3) : (integrationAdditions.standard ?? 2);
  });

  // Feature additions (extra screens per feature)
  const FEATURE_PAGES: Record<string, number> = customConfig?.feature_additions || {
    profiles:      2,  // profile view + edit
    dashboard:     3,  // main dash + widgets + settings
    analytics:     4,  // overview + charts + filters + export
    reporting:     3,  // report list + viewer + builder
    payments:      4,  // checkout + billing + invoices + history
    booking:       4,  // calendar + booking form + confirmation + management
    search:        2,  // search results + filters
    notifications: 2,  // notification centre + settings
    messaging:     5,  // inbox + thread + compose + contacts + settings
    file_uploads:  2,  // upload UI + file manager
    roles:         3,  // role list + permissions matrix + assignment
    collaboration: 5,  // workspace + members + activity + shared views + settings
  };
  a.features.forEach(f => {
    const fp = FEATURE_PAGES[f];
    if (fp) pages += fp;
  });

  // Feature count tier adjustments (Low, Medium, High)
  const featureTiers = customConfig?.feature_tiers || { low: 3, medium: 7 };
  const featureTierAdditions = customConfig?.feature_tier_additions || { low: 0, medium: 2, high: 5 };
  const numFeatures = a.features.length;
  if (numFeatures <= (featureTiers.low ?? 3)) {
    pages += featureTierAdditions.low ?? 0;
  } else if (numFeatures <= (featureTiers.medium ?? 7)) {
    pages += featureTierAdditions.medium ?? 2;
  } else {
    pages += featureTierAdditions.high ?? 5;
  }

  // ── Convert pages → days (1 page = 1 day min, 2 days max) ────────────────
  let minD = pages * 1;
  let maxD = pages * 2;

  // Team preference: solo dev is slower, dedicated team is faster
  // These adjust effective days-per-page rate
  const TEAM_MULT: Record<TeamPref, [number, number]> = customConfig?.team_multipliers || {
    solo:      [1.5, 1.75],  // solo takes longer
    small:     [1.0, 1.0],   // baseline
    dedicated: [0.6, 0.75],  // dedicated team moves faster
  };
  minD = Math.round(minD * TEAM_MULT[a.teamPref][0]);
  maxD = Math.round(maxD * TEAM_MULT[a.teamPref][1]);
  minD = Math.max(1, minD);
  maxD = Math.max(2, maxD);

  // ── Complexity assessment ─────────────────────────────────────────────────
  const totalWeeks = maxD / 5;
  let complexity: EstimateResult['complexity'] = 'Low';
  let complexityReason = '';
  const cThresholds = customConfig?.complexity_thresholds || { low: 4, medium: 12, high: 24 };
  if (totalWeeks <= (cThresholds.low ?? 4)) {
    complexity = 'Low';
    complexityReason = 'Straightforward scope with minimal custom logic — well within standard development capacity.';
  } else if (totalWeeks <= (cThresholds.medium ?? 12)) {
    complexity = 'Medium';
    complexityReason = 'Moderate scope requiring careful architecture planning across several interconnected components.';
  } else if (totalWeeks <= (cThresholds.high ?? 24)) {
    complexity = 'High';
    complexityReason = 'Significant scope with multiple complex modules. Requires experienced engineers and structured delivery.';
  } else {
    complexity = 'Very High';
    complexityReason = 'Enterprise-grade complexity. Requires a dedicated product team, phased delivery, and strong technical governance.';
  }

  // ── Team composition ──────────────────────────────────────────────────────
  const team: { role: string; icon: string }[] = [];
  team.push({ role: 'Product Manager', icon: '📋' });
  if (!a.assets.includes('final_design')) {
    team.push({ role: 'UI/UX Designer', icon: '🎨' });
  }
  if (['saas','marketplace','enterprise','ai_product'].includes(a.productType) || a.features.includes('dashboard') || a.features.includes('analytics')) {
    team.push({ role: 'Frontend Engineer', icon: '💻' });
    team.push({ role: 'Backend Engineer', icon: '⚙️' });
  } else {
    team.push({ role: 'Full-Stack Developer', icon: '💻' });
  }
  if (hasIOS || hasAndroid) team.push({ role: 'Mobile Developer', icon: '📱' });
  if (a.aiLevel.length > 0 && !a.aiLevel.includes('none')) team.push({ role: 'AI / ML Engineer', icon: '🤖' });
  if (a.integrations.length > 2 || a.platforms.includes('api')) team.push({ role: 'Integration Specialist', icon: '🔌' });
  if (['enterprise', 'marketplace'].includes(a.productType)) team.push({ role: 'DevOps Engineer', icon: '🚀' });
  if (a.teamPref === 'dedicated') team.push({ role: 'QA Engineer', icon: '🧪' });

  // ── Key build drivers ─────────────────────────────────────────────────────
  const drivers: string[] = [];
  a.aiLevel.forEach(level => {
    if (level !== 'none') {
      const opt = AI_OPTIONS.find(o => o.key === level);
      if (opt) drivers.push(`${opt.label} integration`);
    }
  });
  if (a.features.includes('payments')) drivers.push('Payment processing & financial compliance');
  if (a.features.includes('messaging')) drivers.push('Real-time messaging infrastructure');
  if (a.features.includes('analytics') || a.features.includes('reporting')) drivers.push('Analytics & reporting engine');
  if (hasIOS && hasAndroid) drivers.push('Cross-platform mobile development');
  if (['enterprise','marketplace'].includes(a.productType)) drivers.push('Multi-tenant architecture & data isolation');
  if (a.integrations.includes('custom')) drivers.push('Custom third-party API integrations');
  if (a.features.includes('collaboration')) drivers.push('Real-time team collaboration system');
  if (drivers.length === 0) drivers.push('Core product development & infrastructure setup');

  // ── Phase durations (proportional from total days) ────────────────────────
  const hasIntegrationsOrAI = a.integrations.length > 0 || (a.aiLevel.length > 0 && !a.aiLevel.includes('none'));
  const fmtDays = (d: number) => {
    if (d <= 5) return `${d} day${d === 1 ? '' : 's'}`;
    const w = Math.round(d / 5);
    return `${w} week${w === 1 ? '' : 's'}`;
  };
  const p1min = Math.max(1, Math.round(minD * 0.15));
  const p1max = Math.max(1, Math.round(maxD * 0.15));
  const p2min = Math.max(1, Math.round(minD * 0.45));
  const p2max = Math.max(1, Math.round(maxD * 0.45));
  const p3min = Math.max(1, Math.round(minD * 0.25));
  const p3max = Math.max(1, Math.round(maxD * 0.25));
  const p4min = Math.max(1, Math.round(minD * 0.15));
  const p4max = Math.max(1, Math.round(maxD * 0.15));

  const phases: EstimateResult['phases'] = [
    {
      name: 'Phase 1: Planning & Architecture',
      duration: `${fmtDays(p1min)}–${fmtDays(p1max)}`,
      tasks: ['Product requirements & user story mapping', 'Technical architecture design', 'Database schema & API contract definition', 'UI/UX wireframes & design system setup']
    },
    {
      name: 'Phase 2: Core Development',
      duration: `${fmtDays(p2min)}–${fmtDays(p2max)}`,
      tasks: [
        'Core product pages & user flows',
        ...(a.features.includes('auth') ? ['Authentication & user management'] : []),
        ...(a.features.includes('dashboard') ? ['Dashboard & data visualization'] : []),
        ...(a.features.includes('payments') ? ['Payment processing integration'] : []),
        'Backend APIs & database logic',
      ]
    },
    ...(hasIntegrationsOrAI ? [{
      name: 'Phase 3: Integrations & AI',
      duration: `${fmtDays(p3min)}–${fmtDays(p3max)}`,
      tasks: [
        ...a.aiLevel.filter(level => level !== 'none').map(level => {
          const opt = AI_OPTIONS.find(o => o.key === level);
          return `${opt?.label || level} implementation`;
        }),
        ...(a.integrations.length > 0 ? [`Third-party integrations (${a.integrations.slice(0,3).map(i=>INTEGRATION_OPTIONS.find(o=>o.key===i)?.label).join(', ')})`] : []),
        'API hardening, rate limiting & security',
      ]
    }] : []),
    {
      name: `Phase ${hasIntegrationsOrAI ? 4 : 3}: Testing & Launch`,
      duration: `${fmtDays(p4min)}–${fmtDays(p4max)}`,
      tasks: ['QA testing across devices & browsers', 'Performance optimisation & load testing', 'Security audit & penetration testing', 'Production deployment & monitoring setup']
    }
  ];

  // ── Technical risks ───────────────────────────────────────────────────────
  const risks: EstimateResult['risks'] = [];
  if (a.aiLevel.includes('ai_core') || a.aiLevel.includes('report_gen')) {
    risks.push({ title: 'AI Output Consistency', detail: 'LLM responses may vary in quality and format. Requires robust prompt engineering, output validation layers, and fallback handling.', severity: 'high' });
  }
  if (a.integrations.includes('custom')) {
    risks.push({ title: 'Third-Party API Dependency', detail: 'Custom external APIs may have undocumented behaviour, rate limits, or breaking changes that cause integration delays.', severity: 'high' });
  }
  if (hasIOS && hasAndroid) {
    risks.push({ title: 'Cross-Platform Consistency', detail: 'Maintaining feature and UI parity across iOS and Android platforms adds QA overhead and potential platform-specific bugs.', severity: 'medium' });
  }
  if (['enterprise','marketplace'].includes(a.productType)) {
    risks.push({ title: 'Scalability Architecture', detail: 'Complex multi-tenant systems require upfront architecture decisions that are difficult to reverse later. Poor choices here compound exponentially.', severity: 'high' });
  }
  if (a.features.includes('messaging')) {
    risks.push({ title: 'Real-Time Infrastructure', detail: 'WebSocket or event-driven messaging systems require specialised DevOps setup and can introduce unexpected latency or scaling costs.', severity: 'medium' });
  }
  if (a.features.includes('payments')) {
    risks.push({ title: 'Payment Compliance', detail: 'Stripe/payment integrations require PCI-DSS compliance awareness, webhook reliability, and edge-case handling for failed transactions.', severity: 'medium' });
  }
  if (a.teamPref === 'solo') {
    risks.push({ title: 'Single Point of Failure', detail: 'Solo development creates key-person risk. Any illness, scope discovery, or context-switching significantly extends delivery timelines.', severity: 'high' });
  }
  if (risks.length === 0) {
    risks.push({ title: 'Scope Creep', detail: 'Without strict MVP discipline, feature additions during development are the most common cause of timeline overruns in early-stage products.', severity: 'medium' });
  }

  // ── Cost drivers ──────────────────────────────────────────────────────────
  const costDrivers: string[] = [];
  if (a.aiLevel.length > 0 && !a.aiLevel.includes('none')) costDrivers.push('AI/LLM API costs (ongoing per-request pricing that scales with usage)');
  if (hasIOS || hasAndroid) costDrivers.push('Apple Developer ($99/yr) and Google Play ($25 one-time) accounts plus device testing');
  if (a.integrations.length > 0) costDrivers.push('Third-party SaaS subscription costs for integrated services');
  if (['enterprise','saas','marketplace'].includes(a.productType)) costDrivers.push('Cloud infrastructure (compute, storage, CDN) — scales with user growth');
  if (a.teamPref === 'dedicated') costDrivers.push('Larger team headcount is the primary cost driver — offset by faster delivery and lower risk');
  if (a.features.includes('messaging')) costDrivers.push('Real-time messaging infrastructure (WebSocket servers or managed services like Ably/Pusher)');
  if (costDrivers.length === 0) costDrivers.push('Development time is the primary cost driver for this scope');

  // ── MVP Scope recommendation ──────────────────────────────────────────────
  const highValueFeatures = a.features.filter(f => ['auth','dashboard','payments','profiles'].includes(f));
  const deferFeatures = a.features.filter(f => ['analytics','reporting','messaging','collaboration','booking'].includes(f));
  const mvpInclude = [
    `Core ${PRODUCT_TYPES.find(p=>p.key===a.productType)?.label || a.productType} functionality`,
    ...highValueFeatures.map(f => FEATURE_OPTIONS.find(o=>o.key===f)?.label || f),
    ...(a.aiLevel.some(level => level !== 'none' && level !== 'ai_core') ? ['Basic AI feature (simplified prompt)'] : []),
    ...(a.aiLevel.includes('ai_core') ? ['Core AI engine (V1 capability)'] : []),
    ...(a.platforms.includes('web') ? ['Web application'] : []),
  ].filter(Boolean).slice(0, 6);

  const mvpDefer = [
    ...deferFeatures.map(f => FEATURE_OPTIONS.find(o=>o.key===f)?.label || f),
    ...(hasIOS && hasAndroid ? ['Android app (launch iOS first, add Android in V2)'] : []),
    ...(a.features.includes('analytics') ? ['Advanced analytics dashboard'] : []),
    'API documentation portal',
    'White-label / multi-tenant customisation',
  ].filter(Boolean).slice(0, 5);

  // Mathematically bound the maximum days to be 30% to 35% higher than minimum days
  if (maxD > Math.round(minD * 1.35)) {
    maxD = Math.round(minD * 1.35);
  }
  if (maxD < Math.round(minD * 1.30)) {
    maxD = Math.round(minD * 1.30);
  }

  return { minDays: minD, maxDays: maxD, complexity, complexityReason, team, drivers, phases, risks, costDrivers, mvpScope: { include: mvpInclude, defer: mvpDefer } };
}

export function formatDuration(minD: number, maxD: number): string {
  const toStr = (d: number) => {
    if (d <= 2) return `${d} Day${d === 1 ? '' : 's'}`;
    if (d < 7) return `${d} Days`;
    const w = Math.round(d / 5);
    return `${w} Week${w === 1 ? '' : 's'}`;
  };
  if (Math.round(minD / 5) === Math.round(maxD / 5)) return toStr(minD);
  if (minD < 7 && maxD < 7) return `${minD}–${maxD} Days`;
  const wMin = Math.round(minD / 5);
  const wMax = Math.round(maxD / 5);
  if (wMin < 1) return `${minD} Days – ${wMax} Week${wMax===1?'':'s'}`;
  return `${wMin}–${wMax} Weeks`;
}
