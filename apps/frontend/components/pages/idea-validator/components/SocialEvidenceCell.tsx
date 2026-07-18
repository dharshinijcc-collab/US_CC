'use client';

import React from 'react';
import type { ScoringResponse } from '@/app/founder/idea-validator/types/scoring.types';

interface SocialEvidenceCellProps {
  report: ScoringResponse;
  activeNotebookPage: string;
}

export default function SocialEvidenceCell({ report, activeNotebookPage }: SocialEvidenceCellProps) {
  const social = report.social_validation;
  if (!social) return null;

  return (
    <div className={`notebook-cell-panel ${activeNotebookPage === 'evidence' ? 'active-cell' : 'hidden-cell'}`}>
      <div className="notebook-cell-header">
        <span className="cell-title">Social Evidence Explorer</span>
      </div>
      <div className="notebook-cell-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Score Summary Card */}
        <div className="detail-card" style={{ padding: '24px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Social Validation Score</span>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0F172A' }}>
                {social.validation_score}/100
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block' }}>Social Verdict</span>
              <div style={{
                fontSize: '0.9rem',
                fontWeight: 700,
                padding: '6px 12px',
                borderRadius: '6px',
                display: 'inline-block',
                background: social.validation_score >= 70 ? '#E8F5E9' : social.validation_score >= 45 ? '#FFF8E1' : '#FFEBEE',
                color: social.validation_score >= 70 ? '#2E7D32' : social.validation_score >= 45 ? '#B7791F' : '#C0392B',
                marginTop: '4px'
              }}>
                {social.verdict}
              </div>
            </div>
          </div>
          <p style={{ marginTop: '16px', color: '#475569', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
            {social.reasoning}
          </p>
        </div>

        {/* Extracted Pain Points */}
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '12px' }}>
            🔥 Mined Customer Pain Points (Reddit)
          </h4>
          {social.pain_points && social.pain_points.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {social.pain_points.map((pp: any, idx: number) => (
                <details key={idx} style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  cursor: 'pointer'
                }}>
                  <summary style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: '#1E293B',
                    userSelect: 'none'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{pp.pain_point}</span>
                      <span style={{ fontSize: '0.7rem', background: '#F1F5F9', color: '#475569', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                        {pp.mentions} {pp.mentions === 1 ? 'mention' : 'mentions'}
                      </span>
                    </span>
                    <span style={{
                      fontSize: '0.7rem',
                      color: pp.severity >= 4 ? '#C0392B' : pp.severity >= 3 ? '#D97706' : '#2563EB',
                      fontWeight: 800
                    }}>
                      Severity: {pp.severity}/5
                    </span>
                  </summary>
                  
                  <div style={{ marginTop: '12px', borderTop: '1px solid #F1F5F9', paddingTop: '12px', cursor: 'default' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '8px', fontWeight: 700 }}>EVIDENCING SOURCE POSTS:</div>
                    {pp.sources && pp.sources.length > 0 ? (
                      <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {pp.sources.map((url: string, uidx: number) => (
                          <li key={uidx} style={{ fontSize: '0.8rem' }}>
                            <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#005AE2', textDecoration: 'underline' }}>
                              {url}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontStyle: 'italic' }}>No raw source links stored.</span>
                    )}
                  </div>
                </details>
              ))}
            </div>
          ) : (
            <div style={{ color: '#64748B', fontSize: '0.8rem', fontStyle: 'italic', padding: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
              No customer pain points could be extracted from public discussions.
            </div>
          )}
        </div>

        {/* Competitor Gap Analysis */}
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '12px' }}>
            城堡 Discovered Competitor Feature Gaps
          </h4>
          {social.competitors && social.competitors.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
              {social.competitors.map((c: any, idx: number) => (
                <div key={idx} className="detail-card" style={{ padding: '16px', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h5 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#0F172A' }}>
                      {c.name}
                    </h5>
                    {c.website && (
                      <a href={c.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.72rem', color: '#005AE2', textDecoration: 'none', fontWeight: 700 }}>
                        Visit Website ↗
                      </a>
                    )}
                  </div>
                  {c.source_url && (
                    <div style={{ fontSize: '0.72rem', color: '#64748B', marginBottom: '10px' }}>
                      <strong>Verified via:</strong> <a href={c.source_url} target="_blank" rel="noopener noreferrer" style={{ color: '#475569', textDecoration: 'underline' }}>{c.source_url}</a>
                    </div>
                  )}
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#B91C1C', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Missing Features / Gaps:</span>
                    {c.missing_features && c.missing_features.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {c.missing_features.map((f: string, fidx: number) => (
                          <span key={fidx} style={{
                            fontSize: '0.7rem',
                            background: '#FEF2F2',
                            color: '#B91C1C',
                            padding: '3px 6px',
                            borderRadius: '4px',
                            border: '1px solid #FEE2E2',
                            fontWeight: 600
                          }}>
                            ✗ {f}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontStyle: 'italic' }}>No specific features identified as missing.</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: '#64748B', fontSize: '0.8rem', fontStyle: 'italic', padding: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
              No competitors were discovered via social searches.
            </div>
          )}
        </div>

        {/* Mined Feature Requests */}
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '12px' }}>
            💡 High-Demand Feature Requests
          </h4>
          {social.feature_requests && social.feature_requests.length > 0 ? (
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <th style={{ padding: '10px 16px', fontWeight: 700, color: '#475569' }}>Requested Feature</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700, color: '#475569' }}>Mention Volume</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700, color: '#475569' }}>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {social.feature_requests.map((f: any, idx: number) => (
                    <tr key={idx} style={{ borderBottom: idx < social.feature_requests.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                      <td style={{ padding: '10px 16px', fontWeight: 700, color: '#1E293B' }}>{f.feature_name}</td>
                      <td style={{ padding: '10px 16px', color: '#475569' }}>{f.mentions} {f.mentions === 1 ? 'post' : 'posts'}</td>
                      <td style={{ padding: '10px 16px' }}>
                        <span style={{
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: f.priority === 'high' ? '#FEF2F2' : f.priority === 'medium' ? '#FFFBEB' : '#EFF6FF',
                          color: f.priority === 'high' ? '#B91C1C' : f.priority === 'medium' ? '#D97706' : '#1D4ED8',
                          textTransform: 'uppercase'
                        }}>
                          {f.priority || 'medium'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ color: '#64748B', fontSize: '0.8rem', fontStyle: 'italic', padding: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
              No high-demand feature requests were compiled.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
