// app/resources/estimator/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Calculator, Check, ArrowRight, ArrowLeft, RefreshCw, Info, HelpCircle, 
  Layers, Code, PenTool, Users, Shield, Cpu, ExternalLink, Zap
} from 'lucide-react';

// --- CONFIG & ESTIMATION DATABASE ---
type ProductType = 'saas' | 'mobile' | 'landing' | 'marketplace' | 'ai_agent' | 'custom_api';
type DesignStatus = 'final_design' | 'wireframes' | 'no_design';
type CodebaseStatus = 'existing' | 'partial' | 'scratch';
type TeamSize = 'solo' | 'standard' | 'dedicated';

interface ProductBase {
  name: string;
  baseWeeks: number;
  defaultFeatures: string[];
}

const PRODUCT_BASES: Record<ProductType, ProductBase> = {
  saas: {
    name: 'SaaS Web App / MVP',
    baseWeeks: 10,
    defaultFeatures: ['User Authentication & Profiles', 'Core Multi-tenant Dashboard', 'Billing / Stripe Subscription Integration', 'Settings & Notifications']
  },
  mobile: {
    name: 'Mobile App (iOS & Android)',
    baseWeeks: 12,
    defaultFeatures: ['App Store / Google Play configuration', 'Push Notifications', 'Native API connections', 'Offline caching & Storage']
  },
  landing: {
    name: 'Landing Page / Marketing Site',
    baseWeeks: 1.5,
    defaultFeatures: ['Premium custom styling', 'SEO optimization', 'Analytics integration', 'Lead collection form']
  },
  marketplace: {
    name: 'Marketplace Platform',
    baseWeeks: 14,
    defaultFeatures: ['Buyer/Seller profile structures', 'Product listings & search indexing', 'Escrow / Multi-party payment flows', 'Admin review panel']
  },
  ai_agent: {
    name: 'AI Agent / LLM Core Product',
    baseWeeks: 12,
    defaultFeatures: ['LLM API prompt engineering', 'Vector database & embeddings', 'Context window history cache', 'Dynamic agent tool pipelines']
  },
  custom_api: {
    name: 'Custom API / Integration Service',
    baseWeeks: 6,
    defaultFeatures: ['REST / GraphQL endpoint structures', 'Rate limiting & API keys', 'Legacy database integrations', 'Detailed API documentation docs']
  }
};

export default function EstimatorPage() {
  // Wizard state
  const [step, setStep] = useState(1);
  const [productType, setProductType] = useState<ProductType>('saas');
  
  // Inputs
  const [designStatus, setDesignStatus] = useState<DesignStatus>('no_design');
  const [codebaseStatus, setCodebaseStatus] = useState<CodebaseStatus>('scratch');
  
  // Existing Components checklist
  const [hasDesignSystem, setHasDesignSystem] = useState(false);
  const [hasAuth, setHasAuth] = useState(false);
  const [hasDashboard, setHasDashboard] = useState(false);
  const [hasCMS, setHasCMS] = useState(false);
  
  // Complexities
  const [aiComplexity, setAiComplexity] = useState<'none' | 'basic' | 'core'>('none');
  const [integrationComplexity, setIntegrationComplexity] = useState<'low' | 'medium' | 'high'>('low');
  const [teamSize, setTeamSize] = useState<TeamSize>('standard');

  const calculateEstimate = () => {
    const base = PRODUCT_BASES[productType];
    let weeks = base.baseWeeks;
    const reasons: string[] = [];

    // 1. Design Readiness Adjustments
    if (designStatus === 'final_design') {
      weeks -= base.baseWeeks * 0.40;
      reasons.push('final designs are ready');
    } else if (designStatus === 'wireframes') {
      weeks -= base.baseWeeks * 0.20;
      reasons.push('interactive wireframes are ready');
    }

    // 2. Existing Codebase Adjustments
    if (codebaseStatus === 'existing') {
      weeks -= base.baseWeeks * 0.30;
      reasons.push('an existing Next.js/React codebase is available');
    } else if (codebaseStatus === 'partial') {
      weeks -= base.baseWeeks * 0.15;
      reasons.push('a partial codebase is available');
    }

    // 3. Existing Components Adjustments (Saves modular weeks)
    if (hasDesignSystem && productType !== 'landing') {
      weeks -= 1.0;
      reasons.push('an existing design system is in place');
    }
    if (hasAuth && productType !== 'landing') {
      weeks -= 1.0;
      reasons.push('core authentication is already built');
    }
    if (hasDashboard && (productType === 'saas' || productType === 'marketplace')) {
      weeks -= 1.5;
      reasons.push('an existing dashboard framework is available');
    }
    if (hasCMS) {
      weeks -= 1.0;
      reasons.push('an existing CMS structure is available');
    }

    // 4. AI Complexity Adders
    if (aiComplexity === 'basic') {
      weeks += 1.5;
    } else if (aiComplexity === 'core') {
      weeks += 4.5;
    }

    // 5. Integration Complexity Adders
    if (integrationComplexity === 'medium') {
      weeks += 1.5;
    } else if (integrationComplexity === 'high') {
      weeks += 3.5;
    }

    // 6. Team Size Scalers
    if (teamSize === 'solo') {
      weeks = weeks * 1.35;
    } else if (teamSize === 'dedicated') {
      weeks = weeks * 0.75;
    }

    // Protect minimum boundaries
    const finalWeeks = Math.max(1, Math.round(weeks * 10) / 10);

    // Timeline range (e.g. 4-6 weeks)
    const minWeeks = Math.max(1, Math.round(finalWeeks * 0.85));
    const maxWeeks = Math.round(finalWeeks * 1.15);
    const timelineString = minWeeks === maxWeeks ? `${minWeeks} Week(s)` : `${minWeeks}–${maxWeeks} Weeks`;

    return {
      minWeeks,
      maxWeeks,
      timelineString,
      reasons,
      complexity: finalWeeks < 4 ? 'Low' : finalWeeks < 9 ? 'Medium' : 'High'
    };
  };

  const est = calculateEstimate();

  const handleReset = () => {
    setProductType('saas');
    setDesignStatus('no_design');
    setCodebaseStatus('scratch');
    setHasDesignSystem(false);
    setHasAuth(false);
    setHasDashboard(false);
    setHasCMS(false);
    setAiComplexity('none');
    setIntegrationComplexity('low');
    setTeamSize('standard');
    setStep(1);
  };

  return (
    <>
      <Header />
      <main style={{
        background: '#F8FAFC',
        minHeight: '100vh',
        padding: '120px 24px 80px',
        fontFamily: "'Inter', sans-serif"
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <Link href="/resources" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#64748B',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
              marginBottom: '16px',
              transition: 'color 0.2s'
            }} onMouseEnter={(e) => e.currentTarget.style.color = '#005AE2'} onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}>
              <ArrowLeft size={14} /> Back to Resources
            </Link>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              background: '#EFF6FF',
              color: '#005AE2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <Calculator size={28} />
            </div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.03em',
              margin: '0 0 10px 0',
              fontFamily: "'Manrope', sans-serif"
            }}>
              Timeline & Cost Estimator
            </h1>
            <p style={{
              color: '#64748B',
              fontSize: '0.95rem',
              maxWidth: '560px',
              margin: '0 auto',
              lineHeight: 1.5
            }}>
              Get a realistic, data-driven timeline estimate for your product based on existing components, design assets, and feature scope.
            </p>
          </div>

          {/* Progress Bar */}
          {step <= 3 && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
              {[1, 2, 3].map((num) => (
                <div key={num} style={{
                  flex: 1,
                  height: '4px',
                  borderRadius: '2px',
                  backgroundColor: step >= num ? '#005AE2' : '#E2E8F0',
                  transition: 'background-color 0.3s'
                }} />
              ))}
            </div>
          )}

          {/* Card Wrapper */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '20px',
            boxShadow: '0 10px 30px -10px rgba(15, 23, 42, 0.04)',
            padding: '40px 32px'
          }}>
            {/* STEP 1: Product Type */}
            {step === 1 && (
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '24px', letterSpacing: '-0.02em', fontFamily: "'Manrope', sans-serif" }}>
                  1. What product model are you building?
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                  {Object.entries(PRODUCT_BASES).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => setProductType(key as ProductType)}
                      style={{
                        padding: '20px',
                        borderRadius: '12px',
                        border: productType === key ? '2px solid #005AE2' : '1px solid #E2E8F0',
                        backgroundColor: productType === key ? '#F0F7FF' : '#FFFFFF',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        outline: 'none'
                      }}
                    >
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: '0 0 6px 0' }}>{value.name}</h3>
                      <p style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: 1.4, margin: 0 }}>
                        Baseline: {value.baseWeeks} weeks | Features: {value.defaultFeatures.length} core modules.
                      </p>
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setStep(2)}
                    style={{
                      backgroundColor: '#005AE2',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.9rem'
                    }}
                  >
                    Next Step <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Design & Code Readiness */}
            {step === 2 && (
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '24px', letterSpacing: '-0.02em', fontFamily: "'Manrope', sans-serif" }}>
                  2. Existing assets & design readiness
                </h2>

                {/* Design readiness */}
                <div style={{ marginBottom: '28px' }}>
                  <label style={{ display: 'block', fontWeight: 700, color: '#334155', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                    Design Availability
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    {[
                      { key: 'final_design', label: 'Final Designs Ready', desc: '-40% build effort' },
                      { key: 'wireframes', label: 'Wireframes Ready', desc: '-20% build effort' },
                      { key: 'no_design', label: 'No Design Assets', desc: 'Starting from scratch' }
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => setDesignStatus(item.key as DesignStatus)}
                        style={{
                          padding: '14px',
                          borderRadius: '8px',
                          border: designStatus === item.key ? '1.5px solid #005AE2' : '1.5px solid #E2E8F0',
                          backgroundColor: designStatus === item.key ? '#F0F7FF' : '#FFFFFF',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>{item.label}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Codebase Status */}
                <div style={{ marginBottom: '32px' }}>
                  <label style={{ display: 'block', fontWeight: 700, color: '#334155', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                    Existing Codebase Assets
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    {[
                      { key: 'existing', label: 'Existing Codebase', desc: '-30% build effort' },
                      { key: 'partial', label: 'Partial Codebase', desc: '-15% build effort' },
                      { key: 'scratch', label: 'Build From Scratch', desc: 'Starting fresh' }
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => setCodebaseStatus(item.key as CodebaseStatus)}
                        style={{
                          padding: '14px',
                          borderRadius: '8px',
                          border: codebaseStatus === item.key ? '1.5px solid #005AE2' : '1.5px solid #E2E8F0',
                          backgroundColor: codebaseStatus === item.key ? '#F0F7FF' : '#FFFFFF',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>{item.label}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Next/Prev Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button
                    onClick={() => setStep(1)}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#64748B',
                      border: '1px solid #E2E8F0',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.9rem'
                    }}
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    style={{
                      backgroundColor: '#005AE2',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.9rem'
                    }}
                  >
                    Next Step <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Reusable components & complexities */}
            {step === 3 && (
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '24px', letterSpacing: '-0.02em', fontFamily: "'Manrope', sans-serif" }}>
                  3. Existing assets & tech complexity
                </h2>

                {/* Existing components checkboxes */}
                {productType !== 'landing' && (
                  <div style={{ marginBottom: '28px' }}>
                    <label style={{ display: 'block', fontWeight: 700, color: '#334155', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                      Which modules are already built?
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      {[
                        { state: hasDesignSystem, set: setHasDesignSystem, label: 'Design System / Style tokens', desc: 'Colors, variables, elements ready' },
                        { state: hasAuth, set: setHasAuth, label: 'Core Authentication Flow', desc: 'Supabase sign-in/up ready' },
                        { state: hasDashboard, set: setHasDashboard, label: 'Core User Dashboard', desc: 'User panels/layouts available', disabled: productType === 'custom_api' },
                        { state: hasCMS, set: setHasCMS, label: 'Admin CMS / Settings panel', desc: 'Standard configuration screens ready' }
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          disabled={item.disabled}
                          onClick={() => item.set(!item.state)}
                          style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: item.state ? '1.5px solid #005AE2' : '1.5px solid #E2E8F0',
                            backgroundColor: item.state ? '#F0F7FF' : '#FFFFFF',
                            cursor: item.disabled ? 'not-allowed' : 'pointer',
                            opacity: item.disabled ? 0.5 : 1,
                            textAlign: 'left',
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'center'
                          }}
                        >
                          <div style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '4px',
                            border: item.state ? 'none' : '2px solid #CBD5E1',
                            backgroundColor: item.state ? '#005AE2' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {item.state && <Check size={12} color="#FFFFFF" />}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>{item.label}</div>
                            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{item.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI integration */}
                <div style={{ marginBottom: '28px' }}>
                  <label style={{ display: 'block', fontWeight: 700, color: '#334155', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                    AI integration requirement
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    {[
                      { key: 'none', label: 'No AI Integrations', desc: 'Core business logic' },
                      { key: 'basic', label: 'Basic AI Features', desc: 'Standard API wrappers' },
                      { key: 'core', label: 'AI is Core Product', desc: 'Embeddings & pipelines' }
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => setAiComplexity(item.key as any)}
                        style={{
                          padding: '14px',
                          borderRadius: '8px',
                          border: aiComplexity === item.key ? '1.5px solid #005AE2' : '1.5px solid #E2E8F0',
                          backgroundColor: aiComplexity === item.key ? '#F0F7FF' : '#FFFFFF',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>{item.label}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Team size */}
                <div style={{ marginBottom: '32px' }}>
                  <label style={{ display: 'block', fontWeight: 700, color: '#334155', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                    Target Engineering Squad
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    {[
                      { key: 'solo', label: 'Solo Developer', desc: 'Reduced cost, longer timeline' },
                      { key: 'standard', label: '2-3 Developers', desc: 'Balanced scope & speed' },
                      { key: 'dedicated', label: 'Dedicated Squad', desc: 'Accelerated MVP timeline' }
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => setTeamSize(item.key as TeamSize)}
                        style={{
                          padding: '14px',
                          borderRadius: '8px',
                          border: teamSize === item.key ? '1.5px solid #005AE2' : '1.5px solid #E2E8F0',
                          backgroundColor: teamSize === item.key ? '#F0F7FF' : '#FFFFFF',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>{item.label}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Next/Prev Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button
                    onClick={() => setStep(2)}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#64748B',
                      border: '1px solid #E2E8F0',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.9rem'
                    }}
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    style={{
                      backgroundColor: 'linear-gradient(135deg, #005AE2 0%, #4F46E5 100%)',
                      background: '#005AE2',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '12px 28px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.9rem'
                    }}
                  >
                    Calculate Estimate <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Results Display */}
            {step === 4 && (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: 'var(--primary-blue)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    display: 'inline-block',
                    marginBottom: '8px'
                  }}>
                    ESTIMATED MVP TIMELINE
                  </span>
                  <div style={{
                    fontSize: '3rem',
                    fontWeight: 900,
                    color: '#0F172A',
                    letterSpacing: '-0.04em',
                    lineHeight: 1,
                    marginBottom: '12px',
                    fontFamily: "'Manrope', sans-serif"
                  }}>
                    {est.timelineString}
                  </div>
                  
                  {/* Dynamic friendly reductions description */}
                  {est.reasons.length > 0 ? (
                    <div style={{
                      backgroundColor: '#F0FDF4',
                      border: '1px solid #BBF7D0',
                      color: '#166534',
                      borderRadius: '10px',
                      padding: '16px 20px',
                      fontSize: '0.85rem',
                      lineHeight: 1.5,
                      maxWidth: '560px',
                      margin: '0 auto 24px',
                      textAlign: 'left'
                    }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <Zap size={16} style={{ color: '#16A34A', flexShrink: 0, marginTop: '2px' }} />
                        <span>
                          <strong>Estimate Optimized:</strong> Timeline is reduced because {est.reasons.slice(0, -1).join(', ') + (est.reasons.length > 1 ? ', and ' : '') + est.reasons[est.reasons.length - 1]} are already available.
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p style={{ color: '#64748B', fontSize: '0.875rem', margin: '0 auto 24px', maxWidth: '500px' }}>
                      Estimate calculated from scratch baseline specs. Adding design systems, API authentications, or wireframes will decrease launch speed.
                    </p>
                  )}
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '32px 0' }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '32px' }}>
                  {/* Left Column: Scope & Cost */}
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px', letterSpacing: '-0.01em', fontFamily: "'Manrope', sans-serif" }}>
                      Project Profile
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                        <span style={{ color: '#64748B' }}>Product Class:</span>
                        <span style={{ fontWeight: 700, color: '#0F172A' }}>{PRODUCT_BASES[productType].name}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                        <span style={{ color: '#64748B' }}>Design Stage:</span>
                        <span style={{ fontWeight: 700, color: '#0F172A' }}>
                          {designStatus === 'final_design' ? 'Final Design Ready' : designStatus === 'wireframes' ? 'Wireframes Ready' : 'Needs Full Styling'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                        <span style={{ color: '#64748B' }}>Starting Base:</span>
                        <span style={{ fontWeight: 700, color: '#0F172A' }}>
                          {codebaseStatus === 'existing' ? 'Active Codebase' : codebaseStatus === 'partial' ? 'Partial Codebase' : 'From Scratch'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                        <span style={{ color: '#64748B' }}>Engineering Squad:</span>
                        <span style={{ fontWeight: 700, color: '#0F172A' }}>
                          {teamSize === 'solo' ? '1 Solo Developer' : teamSize === 'dedicated' ? 'Dedicated Team (4+)' : '2-3 Developers'}
                        </span>
                      </div>
                    </div>

                    </div>

                  {/* Right Column: Phase Breakdown */}
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px', letterSpacing: '-0.01em', fontFamily: "'Manrope', sans-serif" }}>
                      Phase Breakdown
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {[
                        { name: 'Specs & Discovery', pct: 15, desc: 'Flowcharts, schema mapping & technical strategy.' },
                        { name: 'UI/UX Interface Design', pct: 15, desc: 'Responsive high-fidelity prototypes.', condition: designStatus === 'no_design' },
                        { name: 'Frontend Engineering', pct: 25, desc: 'Client pages, layout views, components.' },
                        { name: 'Backend & Infrastructure', pct: 25, desc: 'APIs, database RLS policies, logic integrations.' },
                        { name: 'AI & Custom Addons', pct: 10, desc: 'LLM agents, vector DB configs.', condition: aiComplexity !== 'none' },
                        { name: 'QA Checks & Deployment', pct: 10, desc: 'Build testing, mobile response audits.' }
                      ].filter(phase => phase.condition !== false).map((phase, index) => (
                        <div key={index} style={{
                          padding: '10px 12px',
                          border: '1px solid #F1F5F9',
                          borderRadius: '8px',
                          fontSize: '0.78rem'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#334155', marginBottom: '2px' }}>
                            <span>{phase.name}</span>
                            <span style={{ color: '#005AE2' }}>{phase.pct}% Effort</span>
                          </div>
                          <div style={{ color: '#64748B', fontSize: '0.72rem' }}>{phase.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '32px',
                  alignItems: 'center'
                }}>
                  <button
                    onClick={handleReset}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#64748B',
                      border: '1px solid #E2E8F0',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.9rem'
                    }}
                  >
                    <RefreshCw size={16} /> Recalculate
                  </button>

                  <Link href="/founder" style={{
                    backgroundColor: '#005AE2',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.9rem',
                    textDecoration: 'none'
                  }}>
                    Validate Your Idea <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
