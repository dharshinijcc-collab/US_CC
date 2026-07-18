'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Clock, BarChart2, Users, Zap, CalendarDays, AlertTriangle, Rocket, ArrowLeft, ArrowRight,
  ChevronRight, User, ClipboardList, Palette, Code2, Database, Smartphone, Brain, Plug, Cloud,
  ShieldCheck, Shield, CheckCircle
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import EditableText from '@/components/pages/admin/EditableText';
import type { Answers, EstimateResult } from '../types';
import {
  BLUE, BLUE_LIGHT, DARK, MUTED, BORDER, PRODUCT_TYPES, AI_OPTIONS, FEATURE_OPTIONS,
  INTEGRATION_OPTIONS, TEAM_OPTIONS
} from '../config';
import { formatDuration } from '../utils';
import SelectionsSummaryPanel from './SelectionsSummaryPanel';
import ComplexityBadge from './ComplexityBadge';
import { reportStyles } from './reportStyles';

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

interface ReportViewProps {
  estimate: EstimateResult;
  answers: Answers;
  onBack: () => void;
  customConfig: any;
}

export default function ReportView({ estimate, answers, onBack, customConfig }: ReportViewProps) {
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
      <style dangerouslySetInnerHTML={{ __html: reportStyles }} />

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
                    <div style={{ display: 'flex', alignItems: 'center', width: '32px', height: '32px', borderRadius: '50%', background: '#fff', border: '1px solid #BFDBFE', flexShrink: 0, justifyContent: 'center' }}>
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
