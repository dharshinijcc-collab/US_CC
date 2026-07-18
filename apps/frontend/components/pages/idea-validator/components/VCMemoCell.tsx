'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { ScoringResponse } from '@/app/founder/idea-validator/types/scoring.types';

interface VCMemoCellProps {
  report: ScoringResponse;
  activeNotebookPage: string;
  memoTab: 'summary' | 'thesis' | 'strengths' | 'risks' | 'recommendation';
  setMemoTab: (tab: 'summary' | 'thesis' | 'strengths' | 'risks' | 'recommendation') => void;
}

export default function VCMemoCell({
  report, activeNotebookPage, memoTab, setMemoTab
}: VCMemoCellProps) {
  return (
    <div className={`notebook-cell-panel ${activeNotebookPage === 'memo' ? 'active-cell' : 'hidden-cell'}`}>
      <div className="notebook-cell-header">
        <span className="cell-title">VC Investment Memo</span>
      </div>
      <div className="notebook-cell-body">
        
        <div className="warning-assumption-box" style={{ background: '#FFF5F5', borderLeft: '4px solid #B91C1C', padding: '14px', borderRadius: '4px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#B91C1C', marginBottom: '4px' }}>
            <AlertTriangle size={14} />
            <span style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.7rem' }}>CRITICAL RISK ASSUMPTION</span>
          </div>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#9B2C2C', margin: '0 0 4px 0' }}>
            {report.biggest_assumption}
          </h4>
          <p style={{ fontSize: '0.8rem', color: '#742A2A', margin: 0, lineHeight: 1.4 }}>
            <strong>Required Validation:</strong> {report.investor_memo?.next_validation_step || report.missing_evidence}
          </p>
        </div>

        <div className="memo-section">
          <div className="memo-tabs">
            {['summary', 'thesis', 'strengths', 'risks'].map(tab => (
              <button
                key={tab}
                type="button"
                className={`memo-tab-btn ${memoTab === tab || (tab === 'risks' && memoTab === 'recommendation') ? 'active' : ''}`}
                onClick={() => setMemoTab(tab as any)}
              >
                {tab === 'summary' && 'Executive Summary'}
                {tab === 'thesis' && 'Investment Thesis'}
                {tab === 'strengths' && 'Strengths & Weaknesses'}
                {tab === 'risks' && 'Recommendation'}
              </button>
            ))}
          </div>

          <div className="memo-content-box" style={{ padding: '16px' }}>
            {memoTab === 'summary' && (
              <div>
                <h4 style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: 6, color: 'var(--text-black)' }}>VC Snapshot Opportunity</h4>
                <p style={{ fontSize: '0.825rem', margin: 0, lineHeight: 1.5 }}>{report.investor_memo?.executive_summary}</p>
              </div>
            )}
            {memoTab === 'thesis' && (
              <div>
                <h4 style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: 6, color: 'var(--text-black)' }}>VC Investment Thesis</h4>
                <p style={{ fontSize: '0.825rem', margin: '0 0 10px 0', lineHeight: 1.5 }}>{report.investor_memo?.investment_thesis}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Highest Dimension: <strong>{report.highest_scoring_dimension}</strong></span>
                  <span>Lowest Dimension: <strong>{report.lowest_scoring_dimension}</strong></span>
                </div>
              </div>
            )}
            {memoTab === 'strengths' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#15803D' }}>Valuation Highlights</span>
                  <p style={{ fontSize: '0.825rem', margin: '2px 0 0 0', lineHeight: 1.4 }}>{report.investor_memo?.strengths}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#B91C1C' }}>Identified Weaknesses</span>
                  <p style={{ fontSize: '0.825rem', margin: '2px 0 0 0', lineHeight: 1.4 }}>{report.investor_memo?.weaknesses}</p>
                </div>
              </div>
            )}
            {(memoTab === 'risks' || memoTab === 'recommendation') && (
              <div>
                <h4 style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: 6, color: 'var(--text-black)' }}>Analyst Recommendation</h4>
                <p style={{ fontSize: '0.825rem', marginBottom: '10px', lineHeight: 1.5 }}>{report.investor_memo?.major_risks}</p>
                <div className="memo-meta-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', padding: '10px 12px', gap: '10px' }}>
                  <div>
                    <div className="dd-sub-label">Recommendation</div>
                    <div style={{ fontWeight: 800, color: 'var(--accent-blue)', fontSize: '0.8rem' }}>{report.investor_memo?.recommendation}</div>
                  </div>
                  <div>
                    <div className="dd-sub-label">Confidence</div>
                    <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>{report.investor_memo?.confidence_rating}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
