'use client';

import React from 'react';
import type { ScoringResponse } from '@/app/founder/idea-validator/types/scoring.types';

interface RiskMatrixCellProps {
  report: ScoringResponse;
  activeNotebookPage: string;
}

export default function RiskMatrixCell({ report, activeNotebookPage }: RiskMatrixCellProps) {
  return (
    <div className={`notebook-cell-panel ${activeNotebookPage === 'risks' ? 'active-cell' : 'hidden-cell'}`}>
      <div className="notebook-cell-header">
        <span className="cell-title">Red Flags & Risks</span>
      </div>
      <div className="notebook-cell-body">
        
        {report.investor_red_flags && report.investor_red_flags.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '8px' }}>Venture Red Flags</h4>
            <div className="red-flags-grid" style={{ gridTemplateColumns: '1fr', gap: '8px' }}>
              {report.investor_red_flags.map((flag, idx) => (
                <div key={idx} className="red-flag-card-flat" style={{ padding: '10px 12px', borderLeft: flag.severity === 'high' ? '4px solid #B91C1C' : flag.severity === 'medium' ? '4px solid #D97706' : '4px solid #94A3B8' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.825rem' }}>{flag.flag}</span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: flag.severity === 'high' ? '#B91C1C' : '#D97706' }}>{flag.severity}</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#475569', margin: '2px 0 0 0' }}>{flag.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '8px' }}>Risk Mitigation Matrix</h4>
          <div className="risk-matrix-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {report.risk_matrix && Object.entries(report.risk_matrix).map(([key, item]: [string, any]) => (
              <div key={key} className={`risk-matrix-card ${item.severity}`} style={{ padding: '12px' }}>
                <div className="risk-card-header" style={{ paddingBottom: '3px', marginBottom: '4px' }}>
                  <span className="risk-card-title" style={{ fontSize: '0.78rem' }}>{key} Risk</span>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'capitalize', color: item.severity === 'high' ? '#B91C1C' : item.severity === 'medium' ? '#D97706' : '#0F766E' }}>{item.severity}</span>
                </div>
                <p className="risk-card-desc" style={{ fontSize: '0.72rem', margin: '0 0 6px 0' }}>{item.reason}</p>
                <div className="risk-card-mitigation" style={{ fontSize: '0.72rem', padding: '6px' }}>{item.mitigation}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
