'use client';

import React from 'react';
import { Sparkles, AlertTriangle, Check, ArrowRight } from 'lucide-react';
import type { ScoringResponse } from '@/app/founder/idea-validator/types/scoring.types';

interface RoadmapCellProps {
  report: ScoringResponse;
  activeNotebookPage: string;
  isTemp: boolean;
  submitStatus: 'idle' | 'loading' | 'success' | 'error';
  submitError: string | null;
  onSubmitToCrestCode: () => void;
}

export default function RoadmapCell({
  report, activeNotebookPage, isTemp, submitStatus, submitError, onSubmitToCrestCode
}: RoadmapCellProps) {
  const roadmapSteps = report.validation_roadmap || [];
  
  const next30Days = roadmapSteps.filter(step => {
    const t = step.timeline.toLowerCase();
    return t.includes('week 1') || t.includes('week 2') || t.includes('week 3') || t.includes('week 4') || t.includes('month 1') || t.includes('days') || t.includes('immediate');
  });
  const next90Days = roadmapSteps.filter(step => !next30Days.includes(step));

  const finalNext30 = next30Days.length > 0 ? next30Days : roadmapSteps.slice(0, Math.ceil(roadmapSteps.length / 2));
  const finalNext90 = next90Days.length > 0 ? next90Days : roadmapSteps.slice(Math.ceil(roadmapSteps.length / 2));

  return (
    <div className={`notebook-cell-panel ${activeNotebookPage === 'roadmap' ? 'active-cell' : 'hidden-cell'}`}>
      <div className="notebook-cell-header">
        <span className="cell-title">Roadmap & Checklist</span>
      </div>
      <div className="notebook-cell-body">
        
        {report.evidence_checklist && (
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '8px' }}>Evidence Checklist</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {report.evidence_checklist.map((c, idx) => (
                <div key={idx} className="evidence-checklist-row-flat" style={{ padding: '8px 12px', borderLeft: c.status === 'completed' ? '3px solid #15803D' : c.status === 'partial' ? '3px solid #D97706' : '3px solid #B91C1C' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.8rem', color: c.status === 'completed' ? '#15803D' : c.status === 'partial' ? '#D97706' : '#B91C1C' }}>
                      {c.status === 'completed' ? '✓' : c.status === 'partial' ? '⚠' : '✗'}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>{c.item}</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{c.gap_description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '8px' }}>Execution Roadmap</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
            <div className="roadmap-phase-card" style={{ padding: '16px' }}>
              <div className="phase-card-header" style={{ paddingBottom: '6px', marginBottom: '8px' }}>
                <span style={{ fontSize: '1rem' }}>🎯</span>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, margin: 0 }}>Next 30 Days</h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {finalNext30.map((step, idx) => (
                  <div key={idx} className="roadmap-step-box-flat" style={{ padding: '10px' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.78rem', color: 'var(--text-black)' }}>{step.task}</div>
                    <div style={{ fontSize: '0.72rem', color: '#475569', margin: '2px 0' }}><strong>Goal:</strong> {step.impact}</div>
                    <div className="step-box-footer-meta" style={{ paddingTop: '4px' }}>
                      <span>Timeline: {step.timeline}</span>
                      <span>Effort: {step.effort}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="roadmap-phase-card" style={{ padding: '16px' }}>
              <div className="phase-card-header" style={{ paddingBottom: '6px', marginBottom: '8px' }}>
                <span style={{ fontSize: '1rem' }}>🚀</span>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, margin: 0 }}>Next 90 Days</h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {finalNext90.map((step, idx) => (
                  <div key={idx} className="roadmap-step-box-flat" style={{ padding: '10px' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.78rem', color: 'var(--text-black)' }}>{step.task}</div>
                    <div style={{ fontSize: '0.72rem', color: '#475569', margin: '2px 0' }}><strong>Goal:</strong> {step.impact}</div>
                    <div className="step-box-footer-meta" style={{ paddingTop: '4px' }}>
                      <span>Timeline: {step.timeline}</span>
                      <span>Effort: {step.effort}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Submit to CrestCode CTA (inside Roadmap tab) ── */}
        {isTemp && (
          <div style={{ marginTop: '40px', marginBottom: '8px' }}>
            <div style={{
              background: '#fff',
              border: '2px solid #005AE2',
              borderRadius: '12px',
              padding: '28px 32px',
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              flexWrap: 'wrap',
            }}>
              <div style={{ flex: 1, minWidth: '240px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#EFF6FF', borderRadius: '20px', padding: '5px 14px', marginBottom: '12px' }}>
                  <Sparkles size={12} color="#005AE2" />
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#005AE2', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Ready to Build?</span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                  Submit Your Idea to CrestCode
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0', lineHeight: 1.6 }}>
                  Our team will review your validated idea and reach out to discuss how we can help bring it to life — from MVP development to product launch.
                </p>
                {submitError && (
                  <p style={{ fontSize: '0.78rem', color: '#DC2626', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertTriangle size={13} /> {submitError}
                  </p>
                )}
              </div>
              <div style={{ flexShrink: 0 }}>
                {submitStatus === 'success' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F0FDF4', border: '1.5px solid #86EFAC', borderRadius: '10px', padding: '14px 24px', color: '#166534', fontWeight: 700, fontSize: '0.9rem' }}>
                    <Check size={16} /> Submitted! We'll be in touch.
                  </div>
                ) : (
                  <button
                    onClick={onSubmitToCrestCode}
                    disabled={submitStatus === 'loading'}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      background: submitStatus === 'loading' ? '#93C5FD' : '#005AE2',
                      color: '#fff', border: 'none', borderRadius: '10px',
                      padding: '14px 28px', fontWeight: 800, fontSize: '0.9rem',
                      cursor: submitStatus === 'loading' ? 'not-allowed' : 'pointer',
                      whiteSpace: 'nowrap', transition: 'all 0.2s ease',
                    }}
                  >
                    {submitStatus === 'loading' ? 'Submitting…' : 'Submit to CrestCode'}
                    {submitStatus !== 'loading' && <ArrowRight size={16} />}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
