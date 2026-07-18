'use client';

import React from 'react';
import type { ScoringResponse } from '@/app/founder/idea-validator/types/scoring.types';

interface ExecutiveSummaryCellProps {
  report: ScoringResponse;
  activeNotebookPage: string;
}

export default function ExecutiveSummaryCell({ report, activeNotebookPage }: ExecutiveSummaryCellProps) {
  const score = report.overall_score || 0;
  
  return (
    <div className={`notebook-cell-panel ${activeNotebookPage === 'executive' ? 'active-cell' : 'hidden-cell'}`}>
      <div className="notebook-cell-header">
        <span className="cell-title">Executive Summary</span>
      </div>
      <div className="notebook-cell-body">
        
        <div className="notebook-score-row">
          <div className="notebook-score-index">
            <span className="score-label">READINESS SCORE</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', justifyContent: 'center' }}>
              <span className="score-num-nb">{score.toFixed(1)}</span>
              <span className="score-denom-nb">/ 10</span>
            </div>
            <div className={`score-badge-nb ${score >= 7.5 ? 'strong' : score >= 4.5 ? 'needs-val' : 'risk'}`}>
              {score >= 7.5 ? 'Proceed' : score >= 4.5 ? 'Needs Work' : 'High Risk'}
            </div>
          </div>
          <div className="notebook-verdict-summary">
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--text-black)' }}>
              {score >= 7.5 ? 'Strong Venture Prospect — Proceed to Build' : score >= 4.5 ? 'Promising Idea — Needs Validation' : 'High-Risk Concept — Pivot Recommended'}
            </h2>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.5', color: '#334155', margin: 0 }}>
              {report.startup_summary || report.investor_memo?.executive_summary}
            </p>
          </div>
        </div>

        <div className="notebook-advice-box" style={{ background: '#F0FDF4', borderLeft: '4px solid #16A34A', padding: '16px', borderRadius: '4px', marginTop: '16px' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#15803D', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>AI Strategic Advisory</span>
          <p style={{ fontSize: '0.825rem', color: '#1E3A8A', margin: 0, lineHeight: '1.5' }}>
            {report.co_founder_recommendations}
          </p>
        </div>
      </div>
    </div>
  );
}
