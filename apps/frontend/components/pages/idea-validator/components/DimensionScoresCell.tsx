'use client';

import React from 'react';
import { Check, X } from 'lucide-react';
import { DIMENSION_META } from '@/app/founder/idea-validator/types/scoring.types';
import type { ScoringResponse } from '@/app/founder/idea-validator/types/scoring.types';

interface DimensionScoresCellProps {
  report: ScoringResponse;
  activeNotebookPage: string;
  selectedDimension: string;
  setSelectedDimension: (dim: string) => void;
}

export default function DimensionScoresCell({
  report, activeNotebookPage, selectedDimension, setSelectedDimension
}: DimensionScoresCellProps) {
  const activeDim = report.dimensions?.[selectedDimension as keyof typeof report.dimensions];
  const meta = DIMENSION_META.find(d => d.key === selectedDimension);

  return (
    <div className={`notebook-cell-panel ${activeNotebookPage === 'dimensions' ? 'active-cell' : 'hidden-cell'}`}>
      <div className="notebook-cell-header">
        <span className="cell-title">Dimension Scores</span>
      </div>
      <div className="notebook-cell-body">
        
        <div className="notebook-dimensions-grid">
          <div className="notebook-dimensions-list">
            {DIMENSION_META.map(d => {
              const dimData = report.dimensions?.[d.key as keyof typeof report.dimensions] || { score: 0 };
              const isActive = selectedDimension === d.key;
              return (
                <div 
                  key={d.key} 
                  className={`dim-nav-item-nb ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedDimension(d.key)}
                >
                  <div className="dim-nav-header">
                    <span className="dim-nav-title">{d.label}</span>
                    <span className="dim-nav-score">{dimData.score}</span>
                  </div>
                  <div className="dim-progress-bg">
                    <div className="dim-progress-fill" style={{ width: `${dimData.score * 10}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedDimension && activeDim && meta && (
            <div className="dim-detail-panel-nb">
              <div className="dim-detail-title-row">
                <h4 className="dim-detail-label">{meta.label}</h4>
                <span className="dim-detail-score-pill">Score: {activeDim.score}/10</span>
              </div>
              <p className="dim-detail-prose">{activeDim.why_this_score}</p>
              
              <div className="signals-split">
                <div className="signals-list-box">
                  <h5 className="signals-list-title">Positive Signals</h5>
                  <ul className="signals-ul">
                    {activeDim.positive_signals?.map((sig, idx) => (
                      <li key={idx} className="signal-li">
                        <Check className="signal-icon-pos" size={12} />
                        <span>{sig}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="signals-list-box">
                  <h5 className="signals-list-title font-medium text-red-700">Concerns</h5>
                  <ul className="signals-ul">
                    {activeDim.negative_signals?.map((sig, idx) => (
                      <li key={idx} className="signal-li">
                        <X className="signal-icon-neg" size={12} />
                        <span>{sig}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px dashed #E2E8F0' }}>
                <h5 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Recommended Improvements</h5>
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.8rem', color: '#334155', lineHeight: '1.6' }}>
                  {activeDim.improvement_actions?.map((act, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>{act}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Core Strengths & Risks lists */}
        <div className="strengths-risks-split">
          <div className="sr-card-half strength" style={{ padding: '16px', borderTop: '3px solid #16A34A' }}>
            <h3 className="sr-title strength-title" style={{ fontSize: '0.8rem', marginBottom: '8px' }}>Core Strengths</h3>
            <ul className="sr-list" style={{ gap: '6px' }}>
              {report.what_increased_the_score?.map((item, idx) => (
                <li key={idx} className="sr-item" style={{ fontSize: '0.78rem' }}>
                  <span className="sr-bullet">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="sr-card-half risk" style={{ padding: '16px', borderTop: '3px solid #DC2626' }}>
            <h3 className="sr-title risk-title" style={{ fontSize: '0.8rem', marginBottom: '8px' }}>Core Risks</h3>
            <ul className="sr-list" style={{ gap: '6px' }}>
              {report.what_reduced_the_score?.map((item, idx) => (
                <li key={idx} className="sr-item" style={{ fontSize: '0.78rem' }}>
                  <span className="sr-bullet">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
