'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import EditableText from '@/components/admin/EditableText';
import { useContent } from '@/context/ContentContext';
import {
  ArrowRight, ArrowLeft, CheckCircle, Clock, Users, Zap, AlertTriangle,
  BarChart2, Layers, Cpu, Package, ChevronRight, ExternalLink, CalendarDays,
  Shield, Star, Rocket,
  
  // Clean, professional, minimalistic Lucide icons
  Home, Globe, ShoppingCart, Smartphone, Bot, Wrench, Building2, Sparkles,
  Lightbulb, FileText, Layout, Palette, Code2, Database, KeyRound, Lock,
  User, LayoutDashboard, ClipboardList, CreditCard, Calendar, Search, Bell,
  MessageSquare, Paperclip, Handshake, Ban, Brain, Mail, Cloud, Plug, ShieldCheck,
  Check, Play, Settings
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
  aiLevel: AILevel[];
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

const PRODUCT_TYPES: { key: ProductType; label: string; icon: React.ReactNode; desc: string }[] = [
  { key: 'landing',    label: 'Landing Page',        icon: <Home size={20} />, desc: 'Single page for marketing or lead capture' },
  { key: 'marketing',  label: 'Marketing Website',   icon: <Globe size={20} />, desc: 'Multi-page brand & content site' },
  { key: 'saas',       label: 'SaaS Platform',        icon: <Zap size={20} />, desc: 'Web app with subscriptions & dashboards' },
  { key: 'marketplace',label: 'Marketplace',          icon: <ShoppingCart size={20} />, desc: 'Buyer/seller transaction platform' },
  { key: 'mobile',     label: 'Mobile App',           icon: <Smartphone size={20} />, desc: 'iOS and/or Android native app' },
  { key: 'ai_product', label: 'AI Product',           icon: <Bot size={20} />, desc: 'AI-first product or LLM-powered tool' },
  { key: 'internal',   label: 'Internal Tool',        icon: <Wrench size={20} />, desc: 'Internal ops, admin or workflow tool' },
  { key: 'enterprise', label: 'Enterprise Platform',  icon: <Building2 size={20} />, desc: 'Complex multi-tenant enterprise system' },
  { key: 'other',      label: 'Other',                icon: <Sparkles size={20} />, desc: 'Custom or hybrid product' },
];

const ASSET_OPTIONS: { key: string; label: string; icon: React.ReactNode }[] = [
  { key: 'idea_only',      label: 'Idea Only',                  icon: <Lightbulb size={16} /> },
  { key: 'requirements',   label: 'Requirements Document',       icon: <FileText size={16} /> },
  { key: 'wireframes',     label: 'Wireframes',                 icon: <Layout size={16} /> },
  { key: 'final_design',   label: 'Final UI Design',            icon: <Palette size={16} /> },
  { key: 'codebase',       label: 'Existing Codebase',          icon: <Code2 size={16} /> },
  { key: 'database',       label: 'Existing Database',          icon: <Database size={16} /> },
  { key: 'api',            label: 'Existing API',               icon: <Plug size={16} /> },
  { key: 'auth',           label: 'Existing Auth System',       icon: <KeyRound size={16} /> },
];

const PLATFORM_OPTIONS: { key: string; label: string; icon: React.ReactNode }[] = [
  { key: 'web',     label: 'Web Application',  icon: <Globe size={16} /> },
  { key: 'ios',     label: 'iOS App',           icon: <Smartphone size={16} /> },
  { key: 'android', label: 'Android App',       icon: <Smartphone size={16} /> },
  { key: 'admin',   label: 'Admin Dashboard',   icon: <LayoutDashboard size={16} /> },
  { key: 'api',     label: 'API Only',          icon: <Plug size={16} /> },
];

const FEATURE_OPTIONS: { key: string; label: string; icon: React.ReactNode }[] = [
  { key: 'auth',          label: 'User Authentication',   icon: <Lock size={16} /> },
  { key: 'profiles',      label: 'User Profiles',         icon: <User size={16} /> },
  { key: 'dashboard',     label: 'Dashboard',             icon: <LayoutDashboard size={16} /> },
  { key: 'analytics',     label: 'Analytics',             icon: <BarChart2 size={16} /> },
  { key: 'reporting',     label: 'Reporting',             icon: <ClipboardList size={16} /> },
  { key: 'payments',      label: 'Payments',              icon: <CreditCard size={16} /> },
  { key: 'booking',       label: 'Booking System',        icon: <Calendar size={16} /> },
  { key: 'search',        label: 'Search',                icon: <Search size={16} /> },
  { key: 'notifications', label: 'Notifications',         icon: <Bell size={16} /> },
  { key: 'messaging',     label: 'Messaging',             icon: <MessageSquare size={16} /> },
  { key: 'file_uploads',  label: 'File Uploads',          icon: <Paperclip size={16} /> },
  { key: 'roles',         label: 'Multi-User Roles',      icon: <ShieldCheck size={16} /> },
  { key: 'collaboration', label: 'Team Collaboration',    icon: <Handshake size={16} /> },
];

const AI_OPTIONS: { key: AILevel; label: string; icon: React.ReactNode; desc: string }[] = [
  { key: 'none',       label: 'No AI',                    icon: <Ban size={20} />,  desc: 'Traditional software only' },
  { key: 'assistant',  label: 'AI Assistant',             icon: <Bot size={20} />, desc: 'Chatbot or AI help widget' },
  { key: 'report_gen', label: 'AI Report Generation',     icon: <FileText size={20} />, desc: 'AI writes structured outputs' },
  { key: 'ocr',        label: 'OCR / Document Processing',icon: <FileText size={20} />, desc: 'Extract data from documents' },
  { key: 'ai_core',    label: 'AI Core Product',           icon: <Brain size={20} />, desc: 'AI is the product itself' },
];

const INTEGRATION_OPTIONS: { key: string; label: string; desc: string; icon: React.ReactNode }[] = [
  { key: 'payment',    label: 'Payment Processors',                  desc: 'Stripe, PayPal, Razorpay',           icon: <CreditCard size={16} /> },
  { key: 'email',      label: 'Email Integration',                   desc: 'Outlook, Gmail, Apple Mail',         icon: <Mail size={16} /> },
  { key: 'microsoft',  label: 'Microsoft Services',                  desc: 'Microsoft 365, Teams, Azure',        icon: <Cloud size={16} /> },
  { key: 'custom',     label: 'Custom APIs',                         desc: 'Internal or proprietary systems',    icon: <Plug size={16} /> },
  { key: 'chatbot',    label: 'Chatbot',                             desc: 'Support & conversational bots',      icon: <Bot size={16} /> },
  { key: 'slack',      label: 'Messenger such as Slack',             desc: 'Slack, Discord, Microsoft Teams',    icon: <MessageSquare size={16} /> },
  { key: 'salesforce', label: 'Custom Applications such as Salesforce', desc: 'Salesforce, HubSpot, Zoho CRM',      icon: <Database size={16} /> },
];

const TEAM_OPTIONS: { key: TeamPref; label: string; icon: React.ReactNode; desc: string }[] = [
  { key: 'solo',      label: 'Solo Developer',          icon: <User size={20} />, desc: 'One developer building everything' },
  { key: 'small',     label: 'Small Team (2–4)',         icon: <Users size={20} />, desc: 'Standard cross-functional squad' },
  { key: 'dedicated', label: 'Dedicated Product Team',  icon: <Rocket size={20} />, desc: 'Full-scale team, fastest delivery' },
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
  // Phase split: 15% planning · 45% core dev · 25% integrations/AI · 15% launch
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
    `Core ${PRODUCT_TYPES.find(p=>p.key===a.productType)?.label} functionality`,
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
  // to ensure a tight, confident estimation range (avoiding unrealistic 100% variation)
  if (maxD > Math.round(minD * 1.35)) {
    maxD = Math.round(minD * 1.35);
  }
  if (maxD < Math.round(minD * 1.30)) {
    maxD = Math.round(minD * 1.30);
  }

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '36px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', width: '100%', padding: '0 12px' }}>
        {/* Background Line */}
        <div style={{ position: 'absolute', top: '16px', left: '20px', right: '20px', height: '2px', background: '#E2E8F0', zIndex: 0 }} />
        {/* Active Progress Line */}
        <div style={{
          position: 'absolute', top: '16px', left: '20px',
          width: `${((step - 1) / (total - 1)) * 94}%`,
          height: '2px', background: BLUE, transition: 'all 0.3s ease', zIndex: 0
        }} />

        {STEPS.map((s, i) => {
          const done = i < step - 1;
          const active = i === step - 1;
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, position: 'relative', width: '60px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: active ? BLUE : done ? '#FFFFFF' : '#FFFFFF',
                border: `2px solid ${active ? BLUE : done ? BLUE : '#CBD5E1'}`,
                color: active ? '#FFFFFF' : done ? BLUE : '#64748B',
                fontWeight: 700,
                fontSize: '0.85rem',
                boxShadow: active ? '0 0 0 4px rgba(0, 90, 226, 0.15)' : 'none',
                transition: 'all 0.25s ease',
              }}>
                {done ? <Check size={14} strokeWidth={3} /> : <span>{i + 1}</span>}
              </div>
              <span className="bte-step-label" style={{
                marginTop: '8px',
                fontSize: '0.72rem',
                fontWeight: active ? 700 : 500,
                color: active ? DARK : done ? MUTED : '#94A3B8',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                position: 'absolute',
                top: '32px',
                transition: 'color 0.2s',
              }}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
      {/* Margin spacer to prevent labels from overlapping content */}
      <div style={{ height: '20px' }} />
    </div>
  );
}

function SingleSelect<T extends string>({
  options, value, onChange
}: {
  options: { key: T; label: string; icon: React.ReactNode; desc?: string }[];
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(215px, 1fr))', gridAutoRows: '1fr', gap: '12px' }}>
      {options.map(o => (
        <button
          key={o.key}
          onClick={() => onChange(o.key)}
          className={`bte-option-btn ${value === o.key ? 'selected' : ''}`}
        >
          <div className="bte-option-icon">{o.icon}</div>
          <div className="bte-option-label">{o.label}</div>
          {o.desc && <div className="bte-option-desc">{o.desc}</div>}
        </button>
      ))}
    </div>
  );
}

function MultiSelect({
  options, values, onChange
}: {
  options: { key: string; label: string; desc?: string; icon: React.ReactNode }[];
  values: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (k: string) => {
    if (k === 'idea_only') { onChange(['idea_only']); return; }
    if (k === 'none') { onChange(['none']); return; }
    
    let next = values.filter(v => v !== 'idea_only' && v !== 'none');
    if (next.includes(k)) {
      next = next.filter(v => v !== k);
    } else {
      next = [...next, k];
    }
    
    if (next.length === 0) {
      if (options.some(o => o.key === 'none')) {
        onChange(['none']);
      } else if (options.some(o => o.key === 'idea_only')) {
        onChange(['idea_only']);
      } else {
        onChange([]);
      }
    } else {
      onChange(next);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(215px, 1fr))', gridAutoRows: '1fr', gap: '12px' }}>
      {options.map(o => {
        const selected = values.includes(o.key);
        return (
          <button
            key={o.key}
            onClick={() => toggle(o.key)}
            className={`bte-multi-btn ${selected ? 'selected' : ''}`}
          >
            <div className="bte-checkbox">
              {selected && <Check size={12} color="#fff" strokeWidth={3} />}
            </div>
            <span className="bte-multi-icon">{o.icon}</span>
            <span className="bte-multi-label">{o.label}</span>
            {o.desc && (
              <div className="bte-card-tooltip">
                <span style={{ fontWeight: 600, color: '#94A3B8', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '2px' }}>Examples</span>
                {o.desc}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

function MultiSelectCards<T extends string>({
  options, values, onChange
}: {
  options: { key: T; label: string; icon: React.ReactNode; desc?: string }[];
  values: T[];
  onChange: (v: T[]) => void;
}) {
  const toggle = (k: T) => {
    if (k === 'none') { onChange(['none' as T]); return; }
    let next = values.filter(v => v !== ('none' as T));
    if (next.includes(k)) {
      next = next.filter(v => v !== k);
    } else {
      next = [...next, k];
    }
    if (next.length === 0) {
      onChange(['none' as T]);
    } else {
      onChange(next);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(215px, 1fr))', gridAutoRows: '1fr', gap: '12px' }}>
      {options.map(o => {
        const selected = values.includes(o.key);
        return (
          <button
            key={o.key}
            onClick={() => toggle(o.key)}
            className={`bte-option-btn ${selected ? 'selected' : ''}`}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '10px' }}>
              <div className="bte-option-icon">{o.icon}</div>
              <div className="bte-checkbox">
                {selected && <Check size={12} color="#fff" strokeWidth={3} />}
              </div>
            </div>
            <div className="bte-option-label">{o.label}</div>
            {o.desc && <div className="bte-option-desc">{o.desc}</div>}
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
    features: [], aiLevel: ['none'], integrations: [], teamPref: null,
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
    if (step === 5) return answers.aiLevel.length > 0;
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

        
        /* Trendy, consistent option buttons (Single & Multi Select Cards) */
        .bte-option-btn {
          padding: 16px 20px;
          border-radius: 12px;
          text-align: left;
          cursor: pointer;
          border: 1.5px solid #E2E8F0;
          background: #FFFFFF;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 125px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
          position: relative;
          box-sizing: border-box;
        }
        .bte-option-btn:hover {
          border-color: #CBD5E1;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.04);
        }
        .bte-option-btn.selected {
          border-color: #005AE2 !important;
          background: #F0F6FF !important;
          box-shadow: 0 4px 12px rgba(0, 90, 226, 0.08) !important;
        }
        .bte-option-icon {
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        .bte-option-btn .bte-option-icon {
          color: #64748B;
        }
        .bte-option-btn.selected .bte-option-icon {
          color: #005AE2 !important;
        }
        .bte-option-label {
          font-weight: 700;
          font-size: 0.85rem;
          transition: color 0.2s;
          color: #0F172A;
        }
        .bte-option-btn.selected .bte-option-label {
          color: #005AE2 !important;
        }
        .bte-option-desc {
          font-size: 0.72rem;
          color: #64748B;
          margin-top: 4px;
          line-height: 1.4;
        }

        /* Trendy, consistent multi-select pills (horizontal style) */
        .bte-multi-btn {
          padding: 14px 18px;
          border-radius: 12px;
          cursor: pointer;
          text-align: left;
          outline: none;
          border: 1.5px solid #E2E8F0;
          background: #FFFFFF;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 14px;
          height: 100%;
          min-height: 58px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
          box-sizing: border-box;
        }
        .bte-multi-btn:hover {
          border-color: #CBD5E1;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.04);
        }
        .bte-multi-btn.selected {
          border-color: #005AE2 !important;
          background: #F0F6FF !important;
          box-shadow: 0 4px 12px rgba(0, 90, 226, 0.08) !important;
        }
        .bte-checkbox {
          width: 18px;
          height: 18px;
          border-radius: 4px;
          border: 2px solid #CBD5E1;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .bte-multi-btn.selected .bte-checkbox,
        .bte-option-btn.selected .bte-checkbox {
          border-color: #005AE2 !important;
          background: #005AE2 !important;
        }
        .bte-multi-icon {
          display: inline-flex;
          align-items: center;
          color: #64748B;
          transition: color 0.2s;
          flex-shrink: 0;
        }
        .bte-multi-btn.selected .bte-multi-icon {
          color: #005AE2 !important;
        }
        .bte-multi-label {
          font-weight: 500;
          font-size: 0.875rem;
          color: #334155;
          transition: color 0.2s;
          line-height: 1.3;
        }
        /* Option B: Premium Floating Tooltip for Multi-select Cards */
        .bte-multi-btn {
          position: relative; /* Anchor for absolute tooltip */
        }
        .bte-card-tooltip {
          visibility: hidden;
          width: 190px;
          background-color: #0F172A;
          color: #FFFFFF;
          text-align: center;
          border-radius: 8px;
          padding: 8px 12px;
          position: absolute;
          z-index: 20;
          bottom: 125%; /* Float above the card */
          left: 50%;
          transform: translateX(-50%) translateY(6px);
          opacity: 0;
          transition: opacity 0.2s ease, transform 0.2s ease;
          font-size: 0.72rem;
          line-height: 1.4;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          pointer-events: none;
          font-weight: 500;
        }
        .bte-card-tooltip::after {
          content: "";
          position: absolute;
          top: 100%; /* Arrow pointing down */
          left: 50%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: #0F172A transparent transparent transparent;
        }
        .bte-multi-btn:hover .bte-card-tooltip {
          visibility: visible;
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        .bte-multi-btn.selected .bte-multi-label {
          font-weight: 600;
          color: #005AE2 !important;
        }
        @media (max-width: 600px) {
          .bte-step-label {
            display: none !important;
          }
        }

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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '250px' }}>
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
                      style={{ marginBottom: 0 }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      const allKeys = ASSET_OPTIONS.map(o => o.key).filter(k => k !== 'idea_only');
                      const allSelected = allKeys.every(k => answers.assets.includes(k));
                      setField('assets', allSelected ? [] : allKeys);
                    }}
                    style={{
                      background: 'transparent',
                      border: `1.5px solid ${BLUE}`,
                      color: BLUE,
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      flexShrink: 0,
                      marginTop: '4px',
                      transition: 'all 0.15s ease',
                    }}
                    className="bte-select-all-btn"
                  >
                    {ASSET_OPTIONS.map(o => o.key).filter(k => k !== 'idea_only').every(k => answers.assets.includes(k)) ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '18px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '250px' }}>
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
                      style={{ marginBottom: 0 }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      const allKeys = PLATFORM_OPTIONS.map(o => o.key);
                      const allSelected = allKeys.every(k => answers.platforms.includes(k));
                      setField('platforms', allSelected ? [] : allKeys);
                    }}
                    style={{
                      background: 'transparent',
                      border: `1.5px solid ${BLUE}`,
                      color: BLUE,
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      flexShrink: 0,
                      marginTop: '4px',
                      transition: 'all 0.15s ease',
                    }}
                    className="bte-select-all-btn"
                  >
                    {PLATFORM_OPTIONS.map(o => o.key).every(k => answers.platforms.includes(k)) ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <MultiSelect options={PLATFORM_OPTIONS} values={answers.platforms} onChange={v => setField('platforms', v)} />
              </div>
            )}

            {step === 4 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '18px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '250px' }}>
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
                      style={{ marginBottom: 0 }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      const allKeys = FEATURE_OPTIONS.map(o => o.key);
                      const allSelected = allKeys.every(k => answers.features.includes(k));
                      setField('features', allSelected ? [] : allKeys);
                    }}
                    style={{
                      background: 'transparent',
                      border: `1.5px solid ${BLUE}`,
                      color: BLUE,
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      flexShrink: 0,
                      marginTop: '4px',
                      transition: 'all 0.15s ease',
                    }}
                    className="bte-select-all-btn"
                  >
                    {FEATURE_OPTIONS.map(o => o.key).every(k => answers.features.includes(k)) ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <MultiSelect options={FEATURE_OPTIONS} values={answers.features} onChange={v => setField('features', v)} />
              </div>
            )}

            {step === 5 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '18px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '250px' }}>
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
                      style={{ marginBottom: 0 }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      const allKeys = AI_OPTIONS.map(o => o.key).filter(k => k !== 'none');
                      const allSelected = allKeys.every(k => answers.aiLevel.includes(k));
                      setField('aiLevel', allSelected ? ['none'] : allKeys);
                    }}
                    style={{
                      background: 'transparent',
                      border: `1.5px solid ${BLUE}`,
                      color: BLUE,
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      flexShrink: 0,
                      marginTop: '4px',
                      transition: 'all 0.15s ease',
                    }}
                    className="bte-select-all-btn"
                  >
                    {AI_OPTIONS.map(o => o.key).filter(k => k !== 'none').every(k => answers.aiLevel.includes(k)) ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <MultiSelectCards options={AI_OPTIONS} values={answers.aiLevel} onChange={v => setField('aiLevel', v)} />
              </div>
            )}

            {step === 6 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '18px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '250px' }}>
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
                      style={{ marginBottom: 0 }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      const allKeys = INTEGRATION_OPTIONS.map(o => o.key);
                      const allSelected = allKeys.every(k => answers.integrations.includes(k));
                      setField('integrations', allSelected ? [] : allKeys);
                    }}
                    style={{
                      background: 'transparent',
                      border: `1.5px solid ${BLUE}`,
                      color: BLUE,
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      flexShrink: 0,
                      marginTop: '4px',
                      transition: 'all 0.15s ease',
                    }}
                    className="bte-select-all-btn"
                  >
                    {INTEGRATION_OPTIONS.map(o => o.key).every(k => answers.integrations.includes(k)) ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
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

const ROLE_ICONS: Record<string, React.ReactNode> = {
  'Product Manager': <ClipboardList size={18} color="#005AE2" />,
  'UI/UX Designer': <Palette size={18} color="#005AE2" />,
  'Frontend Engineer': <Code2 size={18} color="#005AE2" />,
  'Backend Engineer': <Database size={18} color="#005AE2" />,
  'Full-Stack Developer': <Code2 size={18} color="#005AE2" />,
  'Mobile Developer': <Smartphone size={18} color="#005AE2" />,
  'AI / ML Engineer': <Brain size={18} color="#005AE2" />,
  'Integration Specialist': <Plug size={18} color="#005AE2" />,
  'DevOps Engineer': <Cloud size={18} color="#005AE2" />,
  'QA Engineer': <ShieldCheck size={18} color="#005AE2" />,
};

function SelectionsSummaryPanel({ answers, estimate, section }: { answers: Answers; estimate: EstimateResult; section: string }) {
  const productTypeLabel = (answers.productType ? (PRODUCT_TYPES.find(p => p.key === answers.productType)?.label || answers.productType) : '') || 'None';
  const platformLabels = answers.platforms.map(p => PLATFORM_OPTIONS.find(o => o.key === p)?.label || p).join(', ');
  const featureLabels = answers.features.map(f => FEATURE_OPTIONS.find(o => o.key === f)?.label || f);
  const aiLabels = answers.aiLevel.filter(l => l !== 'none').map(l => AI_OPTIONS.find(o => o.key === l)?.label || l);
  const integrationLabels = answers.integrations.map(i => INTEGRATION_OPTIONS.find(o => o.key === i)?.label || i);
  const teamPrefLabel = (answers.teamPref ? (TEAM_OPTIONS.find(t => t.key === answers.teamPref)?.label || answers.teamPref) : '') || 'None';

  const selectionsList: { label: string; value: string }[] = [
    { label: 'Product Type', value: productTypeLabel },
    { label: 'Selected Platforms', value: platformLabels || 'None' },
    { label: 'Selected Team Pref', value: teamPrefLabel || 'None' },
  ];
  if (featureLabels.length > 0) selectionsList.push({ label: 'Selected Features', value: featureLabels.join(', ') });
  if (aiLabels.length > 0) selectionsList.push({ label: 'AI Features', value: aiLabels.join(', ') });
  if (integrationLabels.length > 0) selectionsList.push({ label: 'Selected Integrations', value: integrationLabels.join(', ') });

  let analysisTitle = "Outcome Analysis";
  let analysisWhy: string[] = [];

  if (section === 'timeline') {
    analysisTitle = "How Selections Influenced Timeline";
    analysisWhy.push(`Building a ${productTypeLabel} establishes the base development screen count.`);
    if (answers.platforms.includes('ios') || answers.platforms.includes('android')) {
      analysisWhy.push("Native mobile platforms add design and QA parity testing layers, scaling effort.");
    }
    if (answers.teamPref === 'solo') {
      analysisWhy.push("Solo developer pace multiplies timelines by 1.5x due to lack of parallel execution.");
    } else if (answers.teamPref === 'dedicated') {
      analysisWhy.push("Dedicated squad pace compresses timeline by 0.6x through parallel dev, design, and testing.");
    } else {
      analysisWhy.push("Standard small team pace implements standard 1.0x baseline velocity.");
    }
  } else if (section === 'complexity') {
    analysisTitle = "Technical Complexity Analysis";
    if (answers.aiLevel.some(l => l !== 'none')) {
      analysisWhy.push("AI integrations require pipeline orchestrations, prompt safety layers, and output validation.");
    }
    if (answers.features.includes('messaging') || answers.features.includes('collaboration')) {
      analysisWhy.push("Real-time collaborative features require state synchronization and WebSocket infrastructure.");
    }
    if (answers.integrations.includes('custom')) {
      analysisWhy.push("Custom APIs introduce technical uncertainties and require robust integration mapping.");
    }
    if (analysisWhy.length === 0) {
      analysisWhy.push("Straightforward scope with standard CRUD operations and minimal complex third-party dependencies.");
    }
  } else if (section === 'team') {
    analysisTitle = "Recommended Roles Analysis";
    if (answers.platforms.includes('ios') || answers.platforms.includes('android')) {
      analysisWhy.push("Mobile developer is recommended to ensure native OS integration and styling Parity.");
    }
    if (answers.aiLevel.some(l => l !== 'none')) {
      analysisWhy.push("AI Engineer recommended to configure LLM agents, prompts, and inference integrations.");
    }
    if (answers.integrations.length > 2 || answers.platforms.includes('api')) {
      analysisWhy.push("Integration Specialist recommended to coordinate secure API contracts and payloads.");
    }
    if (answers.teamPref === 'dedicated') {
      analysisWhy.push("Dedicated team adds QA Specialist to prevent regressions and handle automated testing.");
    } else {
      analysisWhy.push("Standard engineering roles cover all requested features without custom QA overhead.");
    }
  } else if (section === 'drivers') {
    analysisTitle = "Outcome Driver Mapping";
    if (answers.features.includes('payments')) {
      analysisWhy.push("Payment Processing: gateway integration, subscription webhooks, invoicing, and PCI audit compliance.");
    }
    if (answers.features.includes('messaging')) {
      analysisWhy.push("Real-time Messaging: Socket connections, notification fallbacks, and connection drops management.");
    }
    if (answers.features.includes('analytics')) {
      analysisWhy.push("Analytics Engine: aggregate querying, charting tools, and CSV/PDF report rendering.");
    }
    if (analysisWhy.length === 0) {
      analysisWhy.push("Core product features, responsive frontend layouts, and database setup are the main drivers.");
    }
  } else if (section === 'roadmap') {
    analysisTitle = "Roadmap Phase Allocation";
    analysisWhy.push("Planning & Architecture: standard 15% allocation to specify API contracts and map databases.");
    analysisWhy.push("Core Development: 45% allocation focused on delivering high-value user stories.");
    if (answers.integrations.length > 0 || answers.aiLevel.some(l => l !== 'none')) {
      analysisWhy.push("Integrations & AI: 25% phase dedicated to securing third-party webhooks and training prompt models.");
    }
    analysisWhy.push("Testing & Launch: 15% phase to perform end-to-end regression testing and cloud setup.");
  } else if (section === 'risks') {
    analysisTitle = "Risk Drivers Connection";
    if (answers.teamPref === 'solo') {
      analysisWhy.push("Solo Developer: creates single-point-of-failure risk if developer gets ill or hits roadblocks.");
    }
    if (answers.integrations.includes('custom')) {
      analysisWhy.push("Custom APIs: third-party dependencies are prone to rate limits or API contract shifts.");
    }
    if (answers.platforms.includes('ios') && answers.platforms.includes('android')) {
      analysisWhy.push("Cross-Platform: QA overhead maintaining exact Parity across differing devices and operating systems.");
    }
    if (analysisWhy.length === 0) {
      analysisWhy.push("Standard project parameters minimize high technical delivery risks.");
    }
  } else if (section === 'costs') {
    analysisTitle = "Ongoing Cost Allocation";
    if (answers.aiLevel.some(l => l !== 'none')) {
      analysisWhy.push("AI APIs: recurring pay-per-token API invocation costs (e.g. OpenAI/Anthropic).");
    }
    if (answers.platforms.includes('ios') || answers.platforms.includes('android')) {
      analysisWhy.push("Developer Accounts: Apple/Google yearly registration and device testing fees.");
    }
    if (answers.integrations.length > 0) {
      analysisWhy.push("Third-party SaaS: monthly costs for subscription integration services (e.g. Stripe, SendGrid).");
    }
    if (analysisWhy.length === 0) {
      analysisWhy.push("Standard cloud hosting and database compute scale with user traffic.");
    }
  } else if (section === 'mvp') {
    analysisTitle = "MVP Prioritization Rules";
    analysisWhy.push("Core CRUD capability and user profiles are placed in V1 to establish functional value.");
    if (answers.features.includes('payments')) {
      analysisWhy.push("Billing and payments included in V1 to validate pricing and capture revenue immediately.");
    }
    if (answers.features.some(f => ['analytics', 'messaging', 'booking'].includes(f))) {
      analysisWhy.push("Complex reporting, peer messaging, and custom scheduling deferred to V2 to secure a fast launch.");
    }
  }

  return (
    <div className="rpt-sel-panel" style={{ background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px', marginBottom: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <ClipboardList size={14} color="#005AE2" />
            <h4 style={{ margin: 0, fontSize: '0.78rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Selections</h4>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {selectionsList.map((sel, idx) => (
              <div key={idx} style={{ fontSize: '0.78rem', lineHeight: 1.4 }}>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>{sel.label}: </span>
                <span style={{ color: '#475569' }}>{sel.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Lightbulb size={14} color="#005AE2" />
            <h4 style={{ margin: 0, fontSize: '0.78rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{analysisTitle}</h4>
          </div>
          <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {analysisWhy.map((why, idx) => (
              <li key={idx} style={{ fontSize: '0.76rem', color: '#475569', lineHeight: 1.4 }}>{why}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

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
        
        /* Accessibility Outline & Focus Indicator Audit */
        button:focus-visible,
        a:focus-visible,
        input:focus-visible,
        textarea:focus-visible,
        .bte-option-btn:focus-visible,
        .bte-multi-btn:focus-visible,
        .rpt-nav-btn:focus-visible {
          outline: 2.5px solid #005AE2 !important;
          outline-offset: 3px !important;
        }
        
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
              <SelectionsSummaryPanel answers={answers} estimate={estimate} section="timeline" />
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
              <SelectionsSummaryPanel answers={answers} estimate={estimate} section="complexity" />
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
                    { label: 'AI Integration', val: !answers.aiLevel.includes('none'), detail: !answers.aiLevel.includes('none') ? answers.aiLevel.filter(level => level !== 'none').map(level => AI_OPTIONS.find(o=>o.key===level)?.label).join(', ') : 'None' },
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
              <SelectionsSummaryPanel answers={answers} estimate={estimate} section="team" />
              <div className="rpt-team-grid">
                {estimate.team.map((member, i) => (
                  <div key={i} style={{ padding: '16px', borderRadius: '12px', background: BLUE_LIGHT, border: `1px solid #BFDBFE`, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: '#fff', border: '1px solid #BFDBFE', flexShrink: 0 }}>
                      {ROLE_ICONS[member.role] || <User size={16} color="#005AE2" />}
                    </div>
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
              <SelectionsSummaryPanel answers={answers} estimate={estimate} section="drivers" />
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
              <SelectionsSummaryPanel answers={answers} estimate={estimate} section="roadmap" />
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
              <SelectionsSummaryPanel answers={answers} estimate={estimate} section="risks" />

              {/* Overall Risk Summary Panel */}
              {(() => {
                const highCount = estimate.risks.filter(r => r.severity === 'high').length;
                const medCount = estimate.risks.filter(r => r.severity === 'medium').length;
                const scoreVal = Math.min(10, Math.max(1.5, Math.round((highCount * 2.5 + medCount * 1.2) * 10) / 10));
                const riskLevel = scoreVal >= 7.0 ? 'High' : scoreVal >= 4.0 ? 'Medium' : 'Low';
                const levelColor = riskLevel === 'High' ? '#EF4444' : riskLevel === 'Medium' ? '#F59E0B' : '#10B981';
                const levelBg = riskLevel === 'High' ? '#FEF2F2' : riskLevel === 'Medium' ? '#FFFBEB' : '#ECFDF5';
                const levelBorder = riskLevel === 'High' ? '#FCA5A5' : riskLevel === 'Medium' ? '#FCD34D' : '#A7F3D0';

                return (
                  <div style={{ display: 'flex', gap: '20px', padding: '20px', borderRadius: '12px', border: `1px solid ${levelBorder}`, background: levelBg, marginBottom: '24px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '0 0 160px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid rgba(0,0,0,0.06)', paddingRight: '20px' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Overall Risk Level</span>
                      <span style={{ fontSize: '1.5rem', fontWeight: 900, color: levelColor }}>{riskLevel}</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginTop: '4px' }}>Score: {scoreVal} / 10</span>
                    </div>
                    <div style={{ flex: 1, minWidth: '220px' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'block' }}>Primary Risk Drivers</span>
                      <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {estimate.risks.map((risk, i) => (
                          <li key={i} style={{ fontSize: '0.78rem', color: '#334155', fontWeight: 600 }}>
                            {risk.title} <span style={{ fontSize: '0.65rem', fontWeight: 700, color: risk.severity === 'high' ? '#EF4444' : '#F59E0B' }}>({risk.severity.toUpperCase()})</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })()}

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
              <SelectionsSummaryPanel answers={answers} estimate={estimate} section="costs" />
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
              <SelectionsSummaryPanel answers={answers} estimate={estimate} section="mvp" />
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
