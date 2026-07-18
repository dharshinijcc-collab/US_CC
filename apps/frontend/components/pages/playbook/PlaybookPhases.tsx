'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';
import EditableImage from '@/components/pages/admin/EditableImage';
import { 
  Building, Users, TrendingUp, Sparkles, Check, X, Compass, Cpu, Layers, Sprout, Briefcase, Search, Zap, Rocket, ShieldCheck, Server, Code, Clock, Shield, Globe, ArrowRight
} from 'lucide-react';




export default function PlaybookPhases({ modelContent, activePhase, setActivePhase }: any) {
  return (
    <section className="dynamic-phases-section" style={{ padding: '40px 0', minHeight: '600px', background: 'white' }}>
          <div className="section-container">
            {/* PHASE 01: SELECT */}
            {activePhase === 0 && (
              <div className="phase-content-animate fade-in">
                <div style={{ marginBottom: '40px' }}>
                  <div className="phase-label" style={{ marginBottom: '6px', textTransform: 'uppercase', fontSize: '0.6875rem', fontWeight: 800, color: '#2563EB' }}>
                    <EditableText contentKey="ourModel.selection.label" value={modelContent?.selection?.label} />
                  </div>
                  <h2 className="phase-title" style={{ fontSize: '2.125rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', color: '#111827' }}>
                    <EditableText contentKey="ourModel.selection.title" value={modelContent?.selection?.title} />
                  </h2>
                </div>

                <div className="selection-grid">
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <Search width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Market Timing & Scale</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>We analyze macroeconomic tailwinds and adoption curves to ensure we enter markets at the perfect inflection point for exponential growth.</p>
                  </div>
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <Cpu width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Technical Feasibility</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>Rigorous clinical assessment of build complexity vs. available pods to ensure predictable 12-week MVP delivery windows without technical debt.</p>
                  </div>
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <Zap width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Competitive Whitespace</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>Mapping the industry landscape to identify structural gaps where incumbents are too slow and startups are under-serving the core user needs.</p>
                  </div>
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <Rocket width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Founder-Market Fit</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>Ensuring the core team possesses the unique domain expertise, obsession, and grit required to navigate industry-specific technical and market hurdles.</p>
                  </div>
                </div>
              </div>
            )}

            {/* PHASE 02: VALIDATE */}
            {activePhase === 1 && (
              <div className="phase-content-animate fade-in">
                <div style={{ marginBottom: '40px' }}>
                  <div className="phase-label" style={{ marginBottom: '6px', textTransform: 'uppercase', fontSize: '0.6875rem', fontWeight: 800, color: '#2563EB' }}>
                    PHASE 02 — CLINICAL VALIDATION
                  </div>
                  <h2 className="phase-title" style={{ fontSize: '2.125rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', color: '#111827' }}>
                    The Validation Framework
                  </h2>
                </div>
                <div className="selection-grid">
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <Search width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Assumption Mapping</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>Extracting every "must-be-true" statement and validating foundational hypotheses before writing a single line of code.</p>
                  </div>
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <ShieldCheck width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Risk Ranking</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>Identifying the deadliest uncertainties first and prioritizing tests that de-risk the venture's core value proposition.</p>
                  </div>
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <Zap width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Signal Testing</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>Deploying rapid smoke tests, landing pages, and MVP-0s to measure actual market pull over stated intent.</p>
                  </div>
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <Check width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Evidence Review</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>A rigorous, data-backed go/no-go decision. We only proceed when unit economics project a clear path to scale.</p>
                  </div>
                </div>
              </div>
            )}

            {/* PHASE 03: BUILD */}
            {activePhase === 2 && (
              <div className="phase-content-animate fade-in">
                <div style={{ marginBottom: '40px' }}>
                  <div className="phase-label" style={{ marginBottom: '6px', textTransform: 'uppercase', fontSize: '0.6875rem', fontWeight: 800, color: '#2563EB' }}>
                    PHASE 03 — BUILD
                  </div>
                  <h2 className="phase-title" style={{ fontSize: '2.125rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', color: '#111827' }}>
                    High-Speed Engineering
                  </h2>
                </div>
                <div className="selection-grid">
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <Server width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Architecture Design</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>Designing scalable, resilient, and secure foundations that support rapid growth without accruing technical debt.</p>
                  </div>
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <Code width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Core Loop Engineering</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>Focusing strictly on the primary user journeys that deliver immediate value and drive early retention metrics.</p>
                  </div>
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <Clock width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Agile Sprints</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>Bi-weekly iterative cycles ensuring continuous delivery, rapid feedback integration, and transparent progress.</p>
                  </div>
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <Layers width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Continuous Integration</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>Automated testing and deployment pipelines that guarantee zero-downtime updates and flawless releases.</p>
                  </div>
                </div>
              </div>
            )}

            {/* PHASE 04: LAUNCH */}
            {activePhase === 3 && (
              <div className="phase-content-animate fade-in">
                <div style={{ marginBottom: '40px' }}>
                  <div className="phase-label" style={{ marginBottom: '6px', textTransform: 'uppercase', fontSize: '0.6875rem', fontWeight: 800, color: '#2563EB' }}>
                    PHASE 04 — LAUNCH
                  </div>
                  <h2 className="phase-title" style={{ fontSize: '2.125rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', color: '#111827' }}>
                    Strategic Market Entry
                  </h2>
                </div>
                <div className="selection-grid">
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <Rocket width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Beachhead Strategy</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>Identifying and targeting a hyper-specific, underserved user segment to achieve rapid initial penetration.</p>
                  </div>
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <Shield width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Controlled Release</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>Staggered rollout phases to monitor system stability and gather qualitative feedback from early adopters.</p>
                  </div>
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <Sparkles width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Feedback Loops</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>Implementing in-app analytics and direct communication channels to capture user sentiment instantly.</p>
                  </div>
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <Globe width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Community Seeding</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>Activating early evangelists to build organic momentum and establish a defensible brand presence.</p>
                  </div>
                </div>
              </div>
            )}

            {/* PHASE 05: SCALE */}
            {activePhase === 4 && (
              <div className="phase-content-animate fade-in">
                <div style={{ marginBottom: '40px' }}>
                  <div className="phase-label" style={{ marginBottom: '6px', textTransform: 'uppercase', fontSize: '0.6875rem', fontWeight: 800, color: '#2563EB' }}>
                    PHASE 05 — SCALE
                  </div>
                  <h2 className="phase-title" style={{ fontSize: '2.125rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', color: '#111827' }}>
                    Aggressive Growth & Hardening
                  </h2>
                </div>
                <div className="selection-grid">
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <TrendingUp width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Analytics Optimization</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>Deep-diving into user behavior data to identify friction points and optimize conversion funnels.</p>
                  </div>
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <Layers width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Infrastructure Hardening</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>Transitioning from MVP architecture to enterprise-grade systems capable of handling massive concurrency.</p>
                  </div>
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <ArrowRight width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Growth Marketing</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>Scaling proven acquisition channels through data-driven campaigns and automated marketing operations.</p>
                  </div>
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <Globe width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Mass-Market Operations</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>Streamlining customer success, localized compliance, and global operational workflows for sustained expansion.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
  );
}
