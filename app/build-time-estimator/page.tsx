'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EditableText from '@/components/admin/EditableText';
import { useContent } from '@/context/ContentContext';
import {
  ArrowRight, ArrowLeft, CheckCircle, Clock, Users, Zap, AlertTriangle,
  BarChart2, Layers, Cpu, Package, ChevronRight, ExternalLink, CalendarDays,
  Shield, Star, Rocket
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type ProductType = 'landing' | 'marketing' | 'saas' | 'marketplace' | 'mobile' | 'ai_product' | 'internal' | 'enterprise' | 'other';
type AILevel = 'none' | 'assistant' | 'report_gen' | 'ocr' | 'ai_core';
type TeamPref = 'solo' | 'small' | 'dedicated';

interface Answers {
  productType: ProductType | null;
  assets: string[];
  platforms: string[];
  features: string[];
  aiLevel: AILevel | null;
  integrations: string[];
  teamPref: TeamPref | null;
}

interface EstimateResult {
  minDays: number;
  maxDays: number;
  complexity: 'Low' | 'Medium' | 'High' | 'Very High';
  complexityReason: string;
  team: { role: string; icon: string }[];
  drivers: string[];
  phases: { name: string; duration: string; tasks: string[] }[];
  risks: { title: string; detail: string; severity: 'medium' | 'high' }[];
  costDrivers: string[];
  mvpScope: { include: string[]; defer: string[] };
}

// ─── Config ───────────────────────────────────────────────────────────────────

const PRODUCT_TYPES: { key: ProductType; label: string; icon: string; desc: string }[] = [
  { key: 'landing',    label: 'Landing Page',        icon: '🏠', desc: 'Single page for marketing or lead capture' },
  { key: 'marketing',  label: 'Marketing Website',   icon: '🌐', desc: 'Multi-page brand & content site' },
  { key: 'saas',       label: 'SaaS Platform',        icon: '⚡', desc: 'Web app with subscriptions & dashboards' },
  { key: 'marketplace',label: 'Marketplace',          icon: '🛒', desc: 'Buyer/seller transaction platform' },
  { key: 'mobile',     label: 'Mobile App',           icon: '📱', desc: 'iOS and/or Android native app' },
  { key: 'ai_product', label: 'AI Product',           icon: '🤖', desc: 'AI-first product or LLM-powered tool' },
  { key: 'internal',   label: 'Internal Tool',        icon: '🔧', desc: 'Internal ops, admin or workflow tool' },
  { key: 'enterprise', label: 'Enterprise Platform',  icon: '🏢', desc: 'Complex multi-tenant enterprise system' },
  { key: 'other',      label: 'Other',                icon: '✨', desc: 'Custom or hybrid product' },
];

const ASSET_OPTIONS = [
  { key: 'idea_only',      label: 'Idea Only',                  icon: '💡' },
  { key: 'requirements',   label: 'Requirements Document',       icon: '📋' },
  { key: 'wireframes',     label: 'Wireframes',                 icon: '🖼️' },
  { key: 'final_design',   label: 'Final UI Design',            icon: '🎨' },
  { key: 'codebase',       label: 'Existing Codebase',          icon: '💻' },
  { key: 'database',       label: 'Existing Database',          icon: '🗄️' },
  { key: 'api',            label: 'Existing API',               icon: '🔌' },
  { key: 'auth',           label: 'Existing Auth System',       icon: '🔐' },
];

const PLATFORM_OPTIONS = [
  { key: 'web',     label: 'Web Application',  icon: '🌐' },
  { key: 'ios',     label: 'iOS App',           icon: '🍎' },
  { key: 'android', label: 'Android App',       icon: '🤖' },
  { key: 'admin',   label: 'Admin Dashboard',   icon: '⚙️' },
  { key: 'api',     label: 'API Only',          icon: '🔌' },
];

const FEATURE_OPTIONS = [
  { key: 'auth',          label: 'User Authentication',   icon: '🔐' },
  { key: 'profiles',      label: 'User Profiles',         icon: '👤' },
  { key: 'dashboard',     label: 'Dashboard',             icon: '📊' },
  { key: 'analytics',     label: 'Analytics',             icon: '📈' },
  { key: 'reporting',     label: 'Reporting',             icon: '📑' },
  { key: 'payments',      label: 'Payments',              icon: '💳' },
  { key: 'booking',       label: 'Booking System',        icon: '📅' },
  { key: 'search',        label: 'Search',                icon: '🔍' },
  { key: 'notifications', label: 'Notifications',         icon: '🔔' },
  { key: 'messaging',     label: 'Messaging',             icon: '💬' },
  { key: 'file_uploads',  label: 'File Uploads',          icon: '📎' },
  { key: 'roles',         label: 'Multi-User Roles',      icon: '👥' },
  { key: 'collaboration', label: 'Team Collaboration',    icon: '🤝' },
];

const AI_OPTIONS: { key: AILevel; label: string; icon: string; desc: string }[] = [
  { key: 'none',       label: 'No AI',                    icon: '—',  desc: 'Traditional software only' },
  { key: 'assistant',  label: 'AI Assistant',             icon: '🤖', desc: 'Chatbot or AI help widget' },
  { key: 'report_gen', label: 'AI Report Generation',     icon: '📄', desc: 'AI writes structured outputs' },
  { key: 'ocr',        label: 'OCR / Document Processing',icon: '📷', desc: 'Extract data from documents' },
  { key: 'ai_core',   label: 'AI Core Product',           icon: '🧠', desc: 'AI is the product itself' },
];

const INTEGRATION_OPTIONS = [
  { key: 'stripe',     label: 'Stripe',              icon: '💳' },
  { key: 'hubspot',    label: 'HubSpot',             icon: '🔶' },
  { key: 'salesforce', label: 'Salesforce',          icon: '☁️' },
  { key: 'slack',      label: 'Slack',               icon: '💬' },
  { key: 'google',     label: 'Google Services',     icon: '🔵' },
  { key: 'microsoft',  label: 'Microsoft Services',  icon: '🟦' },
  { key: 'custom',     label: 'Custom APIs',         icon: '🔌' },
];

const TEAM_OPTIONS: { key: TeamPref; label: string; icon: string; desc: string }[] = [
  { key: 'solo',      label: 'Solo Developer',          icon: '🧑‍💻', desc: 'One developer building everything' },
  { key: 'small',     label: 'Small Team (2–4)',         icon: '👥', desc: 'Standard cross-functional squad' },
  { key: 'dedicated', label: 'Dedicated Product Team',  icon: '🚀', desc: 'Full-scale team, fastest delivery' },
];

const STEPS = [
  { label: 'Product Type', icon: Package },
  { label: 'Progress',     icon: CheckCircle },
  { label: 'Platforms',    icon: Layers },
  { label: 'Features',     icon: Star },
  { label: 'AI',           icon: Cpu },
  { label: 'Integrations', icon: Zap },
  { label: 'Team',         icon: Users },
];

// ─── Estimation Logic ─────────────────────────────────────────────────────────

function calculateEstimate(a: Answers, customConfig?: any): EstimateResult {
  if (!a.productType || !a.aiLevel || !a.teamPref) {
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
  pages += AI_PAGES[a.aiLevel] ?? 0;

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
  if (a.aiLevel !== 'none') team.push({ role: 'AI / ML Engineer', icon: '🤖' });
  if (a.integrations.length > 2 || a.platforms.includes('api')) team.push({ role: 'Integration Specialist', icon: '🔌' });
  if (['enterprise', 'marketplace'].includes(a.productType)) team.push({ role: 'DevOps Engineer', icon: '🚀' });
  if (a.teamPref === 'dedicated') team.push({ role: 'QA Engineer', icon: '🧪' });

  // ── Key build drivers ─────────────────────────────────────────────────────
  const drivers: string[] = [];
  if (a.aiLevel !== 'none') drivers.push(`${AI_OPTIONS.find(o=>o.key===a.aiLevel)?.label} integration`);
  if (a.features.includes('payments')) drivers.push('Payment processing & financial compliance');
  if (a.features.includes('messaging')) drivers.push('Real-time messaging infrastructure');
  if (a.features.includes('analytics') || a.features.includes('reporting')) drivers.push('Analytics & reporting engine');
  if (hasIOS && hasAndroid) drivers.push('Cross-platform mobile development');
  if (['enterprise','marketplace'].includes(a.productType)) drivers.push('Multi-tenant architecture & data isolation');
  if (a.integrations.includes('custom')) drivers.push('Custom third-party API integrations');
  if (a.features.includes('collaboration')) drivers.push('Real-time team collaboration system');
  if (drivers.length === 0) drivers.push('Core product development & infrastructure setup');

  // ── Phase durations (proportional from total days) ────────────────────────
  // Phase split: 15% planning · 45% core dev · 25% integrations/AI · 15% launch
  const hasIntegrationsOrAI = a.integrations.length > 0 || a.aiLevel !== 'none';
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
        ...(a.aiLevel !== 'none' ? [`${AI_OPTIONS.find(o=>o.key===a.aiLevel)?.label} implementation`] : []),
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
  if (a.aiLevel === 'ai_core' || a.aiLevel === 'report_gen') {
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
  if (a.aiLevel !== 'none') costDrivers.push('AI/LLM API costs (ongoing per-request pricing that scales with usage)');
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
    `Core ${PRODUCT_TYPES.find(p=>p.key===a.productType)?.label} functionality`,
    ...highValueFeatures.map(f => FEATURE_OPTIONS.find(o=>o.key===f)?.label || f),
    ...(a.aiLevel !== 'none' && a.aiLevel !== 'ai_core' ? ['Basic AI feature (simplified prompt)'] : []),
    ...(a.aiLevel === 'ai_core' ? ['Core AI engine (V1 capability)'] : []),
    ...(a.platforms.includes('web') ? ['Web application'] : []),
  ].filter(Boolean).slice(0, 6);

  const mvpDefer = [
    ...deferFeatures.map(f => FEATURE_OPTIONS.find(o=>o.key===f)?.label || f),
    ...(hasIOS && hasAndroid ? ['Android app (launch iOS first, add Android in V2)'] : []),
    ...(a.features.includes('analytics') ? ['Advanced analytics dashboard'] : []),
    'API documentation portal',
    'White-label / multi-tenant customisation',
  ].filter(Boolean).slice(0, 5);

  return { minDays: minD, maxDays: maxD, complexity, complexityReason, team, drivers, phases, risks, costDrivers, mvpScope: { include: mvpInclude, defer: mvpDefer } };
}

function formatDuration(minD: number, maxD: number): string {
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

// ─── Shared Styles ────────────────────────────────────────────────────────────

const BLUE = '#005AE2';
const BLUE_LIGHT = '#EFF6FF';
const DARK = '#0F172A';
const MUTED = '#64748B';
const BORDER = '#E2E8F0';

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ display: 'flex', gap: '6px', marginBottom: '32px', alignItems: 'center' }}>
      {STEPS.map((s, i) => {
        const Icon = s.icon;
        const done = i < step - 1;
        const active = i === step - 1;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < total - 1 ? 1 : 'none' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0,
              padding: active ? '6px 12px' : '6px',
              borderRadius: '20px',
              background: active ? BLUE : done ? '#E8F5E9' : '#F8FAFC',
              border: `1.5px solid ${active ? BLUE : done ? '#A5D6A7' : BORDER}`,
              transition: 'all 0.2s',
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: active ? 'rgba(255,255,255,0.2)' : done ? '#16A34A' : BORDER,
                color: active ? '#fff' : done ? '#fff' : MUTED,
                fontSize: '0.65rem',
              }}>
                {done ? <CheckCircle size={12} color="#fff" /> : <span style={{ fontWeight: 800, fontSize: '0.65rem' }}>{i + 1}</span>}
              </div>
              {active && <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>{s.label}</span>}
            </div>
            {i < total - 1 && (
              <div style={{ flex: 1, height: 1.5, background: done ? '#A5D6A7' : BORDER, margin: '0 4px' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SingleSelect<T extends string>({
  options, value, onChange
}: {
  options: { key: T; label: string; icon: string; desc?: string }[];
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
      {options.map(o => (
        <button key={o.key} onClick={() => onChange(o.key)} style={{
          padding: '14px 16px', borderRadius: '10px', textAlign: 'left', cursor: 'pointer',
          border: `2px solid ${value === o.key ? BLUE : BORDER}`,
          background: value === o.key ? BLUE_LIGHT : '#FAFAFA',
          transition: 'all 0.15s', outline: 'none',
        }}>
          <div style={{ fontSize: '1.4rem', marginBottom: '6px' }}>{o.icon}</div>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: value === o.key ? BLUE : DARK }}>{o.label}</div>
          {o.desc && <div style={{ fontSize: '0.72rem', color: MUTED, marginTop: '2px', lineHeight: 1.4 }}>{o.desc}</div>}
        </button>
      ))}
    </div>
  );
}

function MultiSelect({
  options, values, onChange
}: {
  options: { key: string; label: string; icon: string }[];
  values: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (k: string) => {
    if (k === 'idea_only') { onChange(['idea_only']); return; }
    const next = values.filter(v => v !== 'idea_only');
    onChange(next.includes(k) ? next.filter(v => v !== k) : [...next, k]);
  };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px' }}>
      {options.map(o => {
        const selected = values.includes(o.key);
        return (
          <button key={o.key} onClick={() => toggle(o.key)} style={{
            padding: '12px 14px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', outline: 'none',
            border: `2px solid ${selected ? BLUE : BORDER}`,
            background: selected ? BLUE_LIGHT : '#FAFAFA', transition: 'all 0.15s',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: '4px', border: `2px solid ${selected ? BLUE : '#CBD5E1'}`,
              background: selected ? BLUE : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {selected && <CheckCircle size={10} color="#fff" />}
            </div>
            <span style={{ fontSize: '0.75rem' }}>{o.icon}</span>
            <span style={{ fontWeight: selected ? 700 : 500, fontSize: '0.82rem', color: selected ? BLUE : DARK }}>{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Report Sections ──────────────────────────────────────────────────────────

function ComplexityBadge({ level }: { level: EstimateResult['complexity'] }) {
  const map = {
    'Low':       { bg: '#E8F5E9', color: '#2E7D32', border: '#A5D6A7' },
    'Medium':    { bg: '#FFF8E1', color: '#B45309', border: '#FCD34D' },
    'High':      { bg: '#FFF3E0', color: '#C2410C', border: '#FDBA74' },
    'Very High': { bg: '#FEF2F2', color: '#B91C1C', border: '#FCA5A5' },
  };
  const s = map[level];
  return (
    <span style={{ padding: '4px 14px', borderRadius: '20px', fontWeight: 800, fontSize: '0.8rem', background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {level}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BuildTimeEstimatorPage() {
  const { content } = useContent();
  const [step, setStep] = useState(1);
  const [showReport, setShowReport] = useState(false);
  const [answers, setAnswers] = useState<Answers>({
    productType: null, assets: ['idea_only'], platforms: ['web'],
    features: [], aiLevel: null, integrations: [], teamPref: null,
  });

  const [customConfig, setCustomConfig] = useState<any>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);

  useEffect(() => {
    fetch('/api/tool-config?key=build_estimator')
      .then(r => r.json())
      .then(json => {
        if (json.status === 'success') {
          setCustomConfig(json.payload);
        }
      })
      .catch(err => console.error('Error fetching build estimator config:', err))
      .finally(() => setLoadingConfig(false));
  }, []);

  const estimate = useMemo(() => calculateEstimate(answers, customConfig), [answers, customConfig]);

  const canNext = () => {
    if (step === 1) return !!answers.productType;
    if (step === 2) return answers.assets.length > 0;
    if (step === 3) return answers.platforms.length > 0;
    if (step === 4) return true; // features optional
    if (step === 5) return !!answers.aiLevel;
    if (step === 6) return true; // integrations optional
    if (step === 7) return !!answers.teamPref;
    return true;
  };

  const setField = <K extends keyof Answers>(k: K, v: Answers[K]) =>
    setAnswers(prev => ({ ...prev, [k]: v }));

  if (showReport) {
    return <ReportView estimate={estimate} answers={answers} onBack={() => setShowReport(false)} customConfig={customConfig} />;
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'Manrope', sans-serif; }
        .bte-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .bte-btn { transition: all 0.15s; }

        /* ── Questionnaire Responsive ─────────────────────────────────────── */
        .bte-main {
          min-height: 100vh;
          background: linear-gradient(135deg, #F8FAFF 0%, #EFF6FF 100%);
          padding: 120px 16px 80px;
        }
        .bte-container { max-width: 780px; margin: 0 auto; }
        .bte-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #E2E8F0;
          padding: 32px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
        }
        .bte-step-heading {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 6px;
        }
        .bte-step-desc {
          font-size: 0.82rem;
          color: #64748B;
          margin-bottom: 20px;
        }
        .bte-nav { display: flex; justify-content: space-between; align-items: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #E2E8F0; }

        /* Progress bar step labels hidden on small screens */
        @media (max-width: 600px) {
          .bte-main { padding: 90px 12px 60px; }
          .bte-card { padding: 20px 14px; }
          .bte-step-heading { font-size: 1rem; }
          .bte-step-desc { font-size: 0.78rem; }
          .bte-progress-label { display: none; }
          .bte-nav { gap: 8px; }
        }

        /* Option grids: 2-col on tablet, 1-col on mobile */
        .bte-grid-single {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 10px;
        }
        .bte-grid-multi {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 8px;
        }
        @media (max-width: 480px) {
          .bte-grid-single { grid-template-columns: 1fr 1fr; }
          .bte-grid-multi  { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 360px) {
          .bte-grid-single { grid-template-columns: 1fr; }
          .bte-grid-multi  { grid-template-columns: 1fr; }
        }
      `}</style>

      <Header />

      <main className="bte-main">
        <div className="bte-container">

          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: BLUE_LIGHT, border: `1px solid #BFDBFE`, borderRadius: '20px', padding: '6px 16px' }}>
              <Clock size={14} color={BLUE} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: BLUE }}>Step {step} of {STEPS.length}</span>
            </div>
          </div>

          {/* Card */}
          <div className="bte-card">
            <ProgressBar step={step} total={STEPS.length} />

            {/* Step Content */}
            {step === 1 && (
              <div>
                <EditableText
                  contentKey="estimator.step1.heading"
                  value="What are you building?"
                  as="h2"
                  className="bte-step-heading"
                />
                <EditableText
                  contentKey="estimator.step1.desc"
                  value="Select the product type that best describes your idea."
                  as="p"
                  className="bte-step-desc"
                />
                <SingleSelect options={PRODUCT_TYPES} value={answers.productType} onChange={v => setField('productType', v)} />
              </div>
            )}

            {step === 2 && (
              <div>
                <EditableText
                  contentKey="estimator.step2.heading"
                  value="What do you already have?"
                  as="h2"
                  className="bte-step-heading"
                />
                <EditableText
                  contentKey="estimator.step2.desc"
                  value="Select everything that currently exists. Existing assets significantly reduce the estimated effort."
                  as="p"
                  className="bte-step-desc"
                  style={{ marginBottom: '6px' }}
                />
                <div style={{ background: '#FFF8E1', border: '1px solid #FCD34D', borderRadius: '8px', padding: '10px 14px', marginBottom: '18px', fontSize: '0.76rem', color: '#92400E' }}>
                  <EditableText
                    contentKey="estimator.step2.hint"
                    value="💡 Example: A landing page with a Final UI Design + Existing Codebase may only take 1 day."
                  />
                </div>
                <MultiSelect options={ASSET_OPTIONS} values={answers.assets} onChange={v => setField('assets', v)} />
              </div>
            )}

            {step === 3 && (
              <div>
                <EditableText
                  contentKey="estimator.step3.heading"
                  value="Which platforms do you need?"
                  as="h2"
                  className="bte-step-heading"
                />
                <EditableText
                  contentKey="estimator.step3.desc"
                  value="Select all deployment targets for your product."
                  as="p"
                  className="bte-step-desc"
                />
                <MultiSelect options={PLATFORM_OPTIONS} values={answers.platforms} onChange={v => setField('platforms', v)} />
              </div>
            )}

            {step === 4 && (
              <div>
                <EditableText
                  contentKey="estimator.step4.heading"
                  value="Which features do you need?"
                  as="h2"
                  className="bte-step-heading"
                />
                <EditableText
                  contentKey="estimator.step4.desc"
                  value="Select only what's essential for your MVP. You can always add more later."
                  as="p"
                  className="bte-step-desc"
                />
                <MultiSelect options={FEATURE_OPTIONS} values={answers.features} onChange={v => setField('features', v)} />
              </div>
            )}

            {step === 5 && (
              <div>
                <EditableText
                  contentKey="estimator.step5.heading"
                  value="Will AI be part of the product?"
                  as="h2"
                  className="bte-step-heading"
                />
                <EditableText
                  contentKey="estimator.step5.desc"
                  value="AI integration adds significant engineering complexity and timeline."
                  as="p"
                  className="bte-step-desc"
                />
                <SingleSelect options={AI_OPTIONS} value={answers.aiLevel} onChange={v => setField('aiLevel', v)} />
              </div>
            )}

            {step === 6 && (
              <div>
                <EditableText
                  contentKey="estimator.step6.heading"
                  value="Which external integrations are required?"
                  as="h2"
                  className="bte-step-heading"
                />
                <EditableText
                  contentKey="estimator.step6.desc"
                  value="Skip this if no third-party services are needed for V1."
                  as="p"
                  className="bte-step-desc"
                />
                <MultiSelect options={INTEGRATION_OPTIONS} values={answers.integrations} onChange={v => setField('integrations', v)} />
                {answers.integrations.length === 0 && (
                  <EditableText
                    contentKey="estimator.step6.empty"
                    value="No integrations selected — you can proceed."
                    as="p"
                    style={{ fontSize: '0.75rem', color: '#A0AEC0', marginTop: '12px', textAlign: 'center' }}
                  />
                )}
              </div>
            )}

            {step === 7 && (
              <div>
                <EditableText
                  contentKey="estimator.step7.heading"
                  value="How would you like to build?"
                  as="h2"
                  className="bte-step-heading"
                />
                <EditableText
                  contentKey="estimator.step7.desc"
                  value="Your team composition affects both delivery speed and overall investment."
                  as="p"
                  className="bte-step-desc"
                />
                <SingleSelect options={TEAM_OPTIONS} value={answers.teamPref} onChange={v => setField('teamPref', v)} />
              </div>
            )}

            {/* Navigation */}
            <div className="bte-nav">
              <button
                onClick={() => step > 1 ? setStep(s => s - 1) : undefined}
                disabled={step === 1}
                className="bte-btn"
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '8px',
                  border: `1.5px solid ${BORDER}`, background: 'transparent', cursor: step === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '0.85rem', fontWeight: 700, color: step === 1 ? '#CBD5E1' : MUTED,
                }}
              >
                <ArrowLeft size={14} />
                <EditableText contentKey="estimator.nav.back" value="Back" />
              </button>

              {step < STEPS.length ? (
                <button
                  onClick={() => canNext() && setStep(s => s + 1)}
                  disabled={!canNext()}
                  className="bte-btn"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 24px', borderRadius: '8px',
                    background: canNext() ? BLUE : '#CBD5E1', border: 'none', cursor: canNext() ? 'pointer' : 'not-allowed',
                    fontSize: '0.85rem', fontWeight: 700, color: '#fff',
                  }}
                >
                  <EditableText contentKey="estimator.nav.next" value="Next" /> <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  onClick={() => canNext() && setShowReport(true)}
                  disabled={!canNext()}
                  className="bte-btn"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 28px', borderRadius: '10px',
                    background: canNext() ? BLUE : '#CBD5E1', border: 'none', cursor: canNext() ? 'pointer' : 'not-allowed',
                    fontSize: '0.9rem', fontWeight: 800, color: '#fff',
                  }}
                >
                  <Rocket size={16} />
                  <EditableText contentKey="estimator.nav.generate" value="Generate Estimate" />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

// ─── Report View ──────────────────────────────────────────────────────────────

function ReportView({ estimate, answers, onBack, customConfig }: { estimate: EstimateResult; answers: Answers; onBack: () => void; customConfig: any }) {
  const { content } = useContent();
  const [activeSection, setActiveSection] = useState('timeline');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const productLabel = PRODUCT_TYPES.find(p => p.key === answers.productType)?.label || 'Product';
  const duration = formatDuration(estimate.minDays, estimate.maxDays);

  const navItems = [
    { key: 'timeline',   label: 'Timeline',      icon: Clock },
    { key: 'complexity', label: 'Complexity',     icon: BarChart2 },
    { key: 'team',       label: 'Team',           icon: Users },
    { key: 'drivers',    label: 'Build Drivers',  icon: Zap },
    { key: 'roadmap',    label: 'Roadmap',        icon: CalendarDays },
    { key: 'risks',      label: 'Risks',          icon: AlertTriangle },
    { key: 'costs',      label: 'Cost Drivers',   icon: BarChart2 },
    { key: 'mvp',        label: 'MVP Scope',      icon: Rocket },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'Manrope', sans-serif; background: #F8FAFF; }
        .rpt-nav-btn { width:100%; display:flex; align-items:center; gap:8px; padding:10px 14px; border-radius:8px; border:none; cursor:pointer; background:transparent; text-align:left; font-family:'Manrope',sans-serif; font-size:0.82rem; font-weight:600; color:#64748B; transition:all 0.15s; }
        .rpt-nav-btn:hover { background:#F1F5F9; color:#0F172A; }
        .rpt-nav-btn.active { background:#EFF6FF; color:#005AE2; font-weight:800; }
        .rpt-card { background:#fff; border-radius:14px; border:1px solid #E2E8F0; padding:24px; margin-bottom:16px; }
        .bte-btn:hover { opacity:0.88; transform:translateY(-1px); }
        .bte-btn { transition:all 0.15s; }

        /* ── Report Layout ──────────────────────────────────────────────────── */
        .rpt-layout { max-width:1100px; margin:24px auto; padding:0 16px; display:flex; gap:20px; align-items:flex-start; }
        .rpt-sidebar { width:210px; flex-shrink:0; position:sticky; top:100px; }
        .rpt-content { flex:1; min-width:0; }

        /* Hero stats row responsive */
        .rpt-hero-stats { display:flex; gap:24px; flex-wrap:wrap; margin-top:20px; }
        .rpt-hero-stat { background:rgba(255,255,255,0.10); border-radius:12px; padding:16px 24px; min-width:140px; }

        /* Team grid and report grids */
        .rpt-team-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:10px; }
        .rpt-tl-grid  { display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:12px; }
        .rpt-mvp-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }

        /* Sidebar mobile toggle button */
        .rpt-sidebar-toggle { display:none; width:100%; margin-bottom:10px; padding:10px 16px; border-radius:8px; border:1.5px solid #E2E8F0; background:#fff; cursor:pointer; font-family:'Manrope',sans-serif; font-size:0.82rem; font-weight:700; color:#64748B; }

        /* ── Tablet: sidebar goes to top ───────────────────────────────────── */
        @media (max-width: 900px) {
          .rpt-layout { flex-direction: column; }
          .rpt-sidebar { width: 100%; position: static; }
          .rpt-sidebar-inner { display: flex; flex-wrap: wrap; gap: 6px; }
          .rpt-nav-btn { width: auto; flex: 0 0 auto; }
          .rpt-sidebar-toggle { display: block; }
          .rpt-sidebar-collapsed { display: none; }
          .rpt-sidebar-expanded  { display: block; }
        }

        /* ── Mobile ─────────────────────────────────────────────────────────── */
        @media (max-width: 600px) {
          .rpt-hero-stats { gap: 12px; }
          .rpt-hero-stat  { padding: 12px 16px; min-width: 120px; }
          .rpt-card       { padding: 16px 14px; }
          .rpt-mvp-grid   { grid-template-columns: 1fr; }
          .rpt-tl-grid    { grid-template-columns: 1fr 1fr; }
          .rpt-team-grid  { grid-template-columns: 1fr 1fr; }
          .rpt-cta-wrap   { flex-direction: column; gap: 16px; align-items: flex-start; }
          .rpt-layout     { padding: 0 10px; margin: 16px auto; }
        }
        @media (max-width: 400px) {
          .rpt-tl-grid   { grid-template-columns: 1fr; }
          .rpt-team-grid { grid-template-columns: 1fr; }
        }

        /* Section heading font scaling */
        .rpt-section-h2 { font-size: 1.05rem; font-weight: 800; color: #0F172A; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; }
        .rpt-section-p  { font-size: 0.82rem; color: #64748B; margin-bottom: 20px; }
        @media (max-width: 600px) {
          .rpt-section-h2 { font-size: 0.95rem; }
          .rpt-section-p  { font-size: 0.78rem; margin-bottom: 14px; }
        }
      `}</style>

      <Header />

      {/* Report hero */}
      <div style={{ background: `linear-gradient(135deg, ${DARK} 0%, #1E3A6E 100%)`, padding: '120px 24px 32px', color: '#fff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.12)', borderRadius: '20px', padding: '5px 14px', marginBottom: '14px' }}>
            <Rocket size={12} color="#93C5FD" />
            <EditableText contentKey="estimator.report.badge" value="BUILD TIME ESTIMATE" style={{ fontSize: '0.72rem', fontWeight: 700, color: '#93C5FD' }} />
          </div>
          <h1 style={{ fontSize: 'clamp(1.2rem, 3vw, 2rem)', fontWeight: 900, margin: '0 0 8px', letterSpacing: '-0.03em' }}>
            {productLabel} — Development Estimate
          </h1>
          <div className="rpt-hero-stats">
            <div className="rpt-hero-stat">
              <EditableText contentKey="estimator.report.stat.timeline.label" value="MVP Timeline" style={{ fontSize: '0.68rem', fontWeight: 700, color: '#93C5FD', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px', display: 'block' }} />
              <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{duration}</div>
            </div>
            <div className="rpt-hero-stat">
              <EditableText contentKey="estimator.report.stat.complexity.label" value="Complexity" style={{ fontSize: '0.68rem', fontWeight: 700, color: '#93C5FD', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px', display: 'block' }} />
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff', lineHeight: 1.1 }}>{estimate.complexity}</div>
            </div>
            <div className="rpt-hero-stat">
              <EditableText contentKey="estimator.report.stat.team.label" value="Team Size" style={{ fontSize: '0.68rem', fontWeight: 700, color: '#93C5FD', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px', display: 'block' }} />
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff', lineHeight: 1.1 }}>{estimate.team.length} Roles</div>
            </div>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="rpt-layout">

        {/* Sidebar */}
        <div className="rpt-sidebar">
          <button onClick={onBack} className="bte-btn" style={{ width: '100%', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px 14px', borderRadius: '8px', border: `1.5px solid ${BORDER}`, background: 'transparent', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700, color: MUTED }}>
            <ArrowLeft size={12} />
            <EditableText contentKey="estimator.report.editAnswers" value="Edit Answers" />
          </button>

          {/* Mobile toggle */}
          <button className="rpt-sidebar-toggle" onClick={() => setSidebarOpen(o => !o)}>
            {sidebarOpen ? '▲ Hide Navigation' : '▼ Jump to Section'}
          </button>

          <div className={`${sidebarOpen ? 'rpt-sidebar-expanded' : 'rpt-sidebar-collapsed'}`} style={{ background: '#fff', borderRadius: '12px', border: `1px solid ${BORDER}`, padding: '12px', marginBottom: '12px' }}>
            <div className="rpt-sidebar-inner">
              {navItems.map(n => {
                const Icon = n.icon;
                return (
                  <button key={n.key} className={`rpt-nav-btn ${activeSection === n.key ? 'active' : ''}`} onClick={() => { setActiveSection(n.key); setSidebarOpen(false); }}>
                    <Icon size={14} />
                    {n.label}
                  </button>
                );
              })}
            </div>
          </div>
          <Link href={customConfig?.cta_values?.href || '/contact'} style={{ display: 'block', background: BLUE, color: '#fff', borderRadius: '10px', padding: '12px 16px', textDecoration: 'none', textAlign: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
            {customConfig?.cta_values?.text || 'Contact CrestCode'}
          </Link>
        </div>

        {/* Main content */}
        <div className="rpt-content">

          {activeSection === 'timeline' && (
            <div className="rpt-card">
              <h2 className="rpt-section-h2">
                <Clock size={18} color={BLUE} />
                <EditableText contentKey="estimator.report.timeline.heading" value="Development Estimate" />
              </h2>
              <EditableText
                contentKey="estimator.report.timeline.desc"
                value="Your personalised MVP timeline based on product scope, existing assets, and team structure."
                as="p"
                className="rpt-section-p"
              />
              <div style={{ background: `linear-gradient(135deg, ${BLUE} 0%, #1D4ED8 100%)`, borderRadius: '12px', padding: '28px 32px', color: '#fff', marginBottom: '20px', textAlign: 'center' }}>
                <EditableText
                  contentKey="estimator.report.timeline.stat.label"
                  value="Estimated MVP Timeline"
                  style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', display: 'block' }}
                />
                <div style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1 }}>{duration}</div>
                <div style={{ fontSize: '0.78rem', opacity: 0.75, marginTop: '8px' }}>
                  {answers.teamPref === 'solo' ? 'Solo developer pace' : answers.teamPref === 'dedicated' ? 'Dedicated team sprint pace' : 'Standard small team pace'}
                </div>
              </div>
              <div className="rpt-tl-grid">
                {[
                  { label: 'Product Type', value: productLabel },
                  { label: 'Build Stage', value: answers.assets.includes('idea_only') ? 'From Scratch' : answers.assets.includes('codebase') ? 'Existing Codebase' : 'Partial Assets' },
                  { label: 'Platforms', value: `${answers.platforms.length} Platform${answers.platforms.length > 1 ? 's' : ''}` },
                  { label: 'Features', value: `${answers.features.length} Selected` },
                ].map((item, i) => (
                  <div key={i} style={{ background: '#F8FAFC', borderRadius: '10px', padding: '14px', border: `1px solid ${BORDER}` }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>{item.label}</div>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem', color: DARK }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'complexity' && (
            <div className="rpt-card">
              <h2 className="rpt-section-h2">
                <BarChart2 size={18} color={BLUE} />
                <EditableText contentKey="estimator.report.complexity.heading" value="Build Complexity" />
              </h2>
              <EditableText
                contentKey="estimator.report.complexity.desc"
                value="An assessment of the technical and product complexity of this build."
                as="p"
                className="rpt-section-p"
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <ComplexityBadge level={estimate.complexity} />
                <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.6 }}>{estimate.complexityReason}</div>
              </div>
              <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: '20px' }}>
                <EditableText
                  contentKey="estimator.report.complexity.indicators.heading"
                  value="Complexity Indicators"
                  as="h4"
                  style={{ fontSize: '0.78rem', fontWeight: 800, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '12px' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { label: 'AI Integration', val: answers.aiLevel !== 'none', detail: answers.aiLevel !== 'none' ? AI_OPTIONS.find(o=>o.key===answers.aiLevel)?.label : 'None' },
                    { label: 'Mobile Platforms', val: answers.platforms.includes('ios') || answers.platforms.includes('android'), detail: [answers.platforms.includes('ios')?'iOS':'',answers.platforms.includes('android')?'Android':''].filter(Boolean).join(' + ') || 'None' },
                    { label: 'External Integrations', val: answers.integrations.length > 1, detail: answers.integrations.length > 0 ? `${answers.integrations.length} integrations` : 'None' },
                    { label: 'Complex Features', val: ['messaging','collaboration','booking'].some(f=>answers.features.includes(f)), detail: ['messaging','collaboration','booking'].filter(f=>answers.features.includes(f)).map(f=>FEATURE_OPTIONS.find(o=>o.key===f)?.label).join(', ') || 'None' },
                    { label: 'From Scratch Build', val: answers.assets.includes('idea_only') || answers.assets.length <= 1, detail: answers.assets.includes('idea_only') ? 'No existing assets' : 'Limited assets' },
                  ].map((row, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', background: '#F8FAFC', border: `1px solid ${BORDER}` }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: row.val ? '#EF4444' : '#22C55E', flexShrink: 0 }} />
                      <span style={{ fontWeight: 700, fontSize: '0.82rem', color: DARK, flex: 1 }}>{row.label}</span>
                      <span style={{ fontSize: '0.75rem', color: MUTED }}>{row.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'team' && (
            <div className="rpt-card">
              <h2 className="rpt-section-h2">
                <Users size={18} color={BLUE} />
                <EditableText contentKey="estimator.report.team.heading" value="Recommended Team" />
              </h2>
              <EditableText
                contentKey="estimator.report.team.desc"
                value="Roles actually needed for this product scope. Only relevant positions are shown."
                as="p"
                className="rpt-section-p"
              />
              <div className="rpt-team-grid">
                {estimate.team.map((member, i) => (
                  <div key={i} style={{ padding: '16px', borderRadius: '12px', background: BLUE_LIGHT, border: `1px solid #BFDBFE`, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.4rem' }}>{member.icon}</span>
                    <span style={{ fontWeight: 700, fontSize: '0.82rem', color: DARK }}>{member.role}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '20px', padding: '14px 16px', background: '#F0FDF4', border: '1px solid #A5D6A7', borderRadius: '10px', fontSize: '0.78rem', color: '#2E7D32', lineHeight: 1.6 }}>
                <strong>Team preference:</strong> {TEAM_OPTIONS.find(t=>t.key===answers.teamPref)?.label} — {TEAM_OPTIONS.find(t=>t.key===answers.teamPref)?.desc}
              </div>
            </div>
          )}

          {activeSection === 'drivers' && (
            <div className="rpt-card">
              <h2 className="rpt-section-h2">
                <Zap size={18} color={BLUE} />
                <EditableText contentKey="estimator.report.drivers.heading" value="Key Build Drivers" />
              </h2>
              <EditableText
                contentKey="estimator.report.drivers.desc"
                value="The primary factors influencing your development timeline."
                as="p"
                className="rpt-section-p"
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {estimate.drivers.map((driver, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 16px', borderRadius: '10px', background: '#F8FAFC', border: `1px solid ${BORDER}` }}>
                    <ChevronRight size={16} color={BLUE} style={{ flexShrink: 0, marginTop: '1px' }} />
                    <span style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>{driver}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'roadmap' && (
            <div className="rpt-card">
              <h2 className="rpt-section-h2">
                <CalendarDays size={18} color={BLUE} />
                <EditableText contentKey="estimator.report.roadmap.heading" value="Development Roadmap" />
              </h2>
              <EditableText
                contentKey="estimator.report.roadmap.desc"
                value="A high-level phased delivery plan tailored to your product scope."
                as="p"
                className="rpt-section-p"
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {estimate.phases.map((phase, i) => (
                  <div key={i} style={{ borderRadius: '12px', border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
                    <div style={{ background: i % 2 === 0 ? BLUE : DARK, padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#fff' }}>{phase.name}</span>
                      <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '12px', padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700, color: '#fff' }}>{phase.duration}</span>
                    </div>
                    <div style={{ padding: '14px 18px', background: '#FAFAFA' }}>
                      <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {phase.tasks.map((task, j) => (
                          <li key={j} style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.5 }}>{task}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'risks' && (
            <div className="rpt-card">
              <h2 className="rpt-section-h2">
                <AlertTriangle size={18} color="#C2410C" />
                <EditableText contentKey="estimator.report.risks.heading" value="Technical Risks" />
              </h2>
              <EditableText
                contentKey="estimator.report.risks.desc"
                value="Risks that may affect your delivery timeline if not proactively managed."
                as="p"
                className="rpt-section-p"
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {estimate.risks.map((risk, i) => (
                  <div key={i} style={{ borderRadius: '10px', border: `1px solid ${risk.severity === 'high' ? '#FCA5A5' : '#FCD34D'}`, background: risk.severity === 'high' ? '#FEF2F2' : '#FFFBEB', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <AlertTriangle size={14} color={risk.severity === 'high' ? '#B91C1C' : '#B45309'} />
                      <span style={{ fontWeight: 800, fontSize: '0.85rem', color: risk.severity === 'high' ? '#B91C1C' : '#92400E' }}>{risk.title}</span>
                      <span style={{ marginLeft: 'auto', fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', background: risk.severity === 'high' ? '#FEE2E2' : '#FEF3C7', color: risk.severity === 'high' ? '#B91C1C' : '#92400E' }}>
                        {risk.severity === 'high' ? 'HIGH' : 'MEDIUM'}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#334155', lineHeight: 1.6 }}>{risk.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'costs' && (
            <div className="rpt-card">
              <h2 className="rpt-section-h2">
                <BarChart2 size={18} color={BLUE} />
                <EditableText contentKey="estimator.report.costs.heading" value="Cost Drivers" />
              </h2>
              <EditableText
                contentKey="estimator.report.costs.desc"
                value="What contributes most to development effort and ongoing operational costs."
                as="p"
                className="rpt-section-p"
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {estimate.costDrivers.map((driver, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 16px', borderRadius: '10px', background: '#F8FAFC', border: `1px solid ${BORDER}` }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: BLUE, flexShrink: 0, marginTop: '7px' }} />
                    <span style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.6 }}>{driver}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '16px', padding: '14px 16px', background: BLUE_LIGHT, border: `1px solid #BFDBFE`, borderRadius: '10px', fontSize: '0.78rem', color: '#1E40AF', lineHeight: 1.6 }}>
                <EditableText
                  contentKey="estimator.report.costs.note"
                  value="💡 Note: Exact costs depend on team rates, cloud provider selection, and contracted delivery model. CrestCode can provide a detailed project quote after a discovery call."
                />
              </div>
            </div>
          )}

          {activeSection === 'mvp' && (
            <div className="rpt-card">
              <h2 className="rpt-section-h2">
                <Rocket size={18} color={BLUE} />
                <EditableText contentKey="estimator.report.mvp.heading" value="Recommended MVP Scope" />
              </h2>
              <EditableText
                contentKey="estimator.report.mvp.desc"
                value="Ship fast with what matters most. This scope recommendation is designed to maximise value in the shortest delivery window."
                as="p"
                className="rpt-section-p"
              />
              <div className="rpt-mvp-grid">
                <div style={{ borderRadius: '12px', border: '1px solid #A5D6A7', overflow: 'hidden' }}>
                  <div style={{ background: '#E8F5E9', padding: '12px 16px', fontWeight: 800, fontSize: '0.82rem', color: '#2E7D32', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={14} />
                    <EditableText contentKey="estimator.report.mvp.include.label" value="Include in V1" />
                  </div>
                  <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {estimate.mvpScope.include.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.8rem', color: '#334155' }}>
                        <span style={{ color: '#22C55E', fontWeight: 800, flexShrink: 0 }}>✓</span> {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ borderRadius: '12px', border: '1px solid #FCA5A5', overflow: 'hidden' }}>
                  <div style={{ background: '#FEE2E2', padding: '12px 16px', fontWeight: 800, fontSize: '0.82rem', color: '#B91C1C', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield size={14} />
                    <EditableText contentKey="estimator.report.mvp.defer.label" value="Defer to V2" />
                  </div>
                  <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {estimate.mvpScope.defer.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.8rem', color: '#334155' }}>
                        <span style={{ color: '#EF4444', fontWeight: 800, flexShrink: 0 }}>→</span> {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '16px', padding: '14px 16px', background: '#FFF8E1', border: '1px solid #FCD34D', borderRadius: '10px', fontSize: '0.78rem', color: '#92400E', lineHeight: 1.7 }}>
                <EditableText
                  contentKey="estimator.report.mvp.warning"
                  value="⚠️ Avoid overbuilding. Many early-stage products fail not because of what they built — but because they built too much before validating demand. Ship V1, learn, then expand."
                />
              </div>
            </div>
          )}

          {/* CTA Banner */}
          <div className="rpt-cta-wrap" style={{ background: '#fff', border: `2px solid ${BLUE}`, borderRadius: '16px', padding: '32px', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#EFF6FF', borderRadius: '20px', padding: '5px 14px', marginBottom: '12px' }}>
                <Zap size={12} color={BLUE} />
                <EditableText contentKey="estimator.report.cta.badge" value="Let's Build Together" style={{ fontSize: '0.7rem', fontWeight: 700, color: BLUE, textTransform: 'uppercase', letterSpacing: '0.08em' }} />
              </div>
              <EditableText
                contentKey="estimator.report.cta.heading"
                value="Need Help Building This?"
                as="h3"
                style={{ margin: '0 0 8px', fontWeight: 900, fontSize: '1.1rem', color: DARK, letterSpacing: '-0.02em' }}
              />
              <EditableText
                contentKey="estimator.report.cta.desc"
                value="CrestCode can take your idea from estimate to launch. We handle Product Strategy, UI/UX Design, MVP Development, AI Integration, and Product Launch."
                as="p"
                style={{ fontSize: '0.85rem', color: MUTED, margin: '0', lineHeight: 1.6 }}
              />
            </div>
            <div style={{ flexShrink: 0 }}>
              <Link href={customConfig?.cta_values?.href || '/contact'} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: BLUE, color: '#fff', borderRadius: '10px', padding: '13px 24px', textDecoration: 'none', fontWeight: 800, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                {customConfig?.cta_values?.text || 'Contact CrestCode'} <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
