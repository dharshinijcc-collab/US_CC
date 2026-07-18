'use client';

import React from 'react';
import { 
  ArrowLeft, MessageSquare, ChevronRight, ExternalLink, Compass, BarChart3 
} from 'lucide-react';

interface ResultsDashboardProps {
  reportData: any;
  expandedPainPoints: Record<number, boolean>;
  togglePainPoint: (idx: number) => void;
  onReset: () => void;
}

export default function ResultsDashboard({
  reportData,
  expandedPainPoints,
  togglePainPoint,
  onReset,
}: ResultsDashboardProps) {
  return (
    <div className="sve-dashboard fade-in">
      
      {/* Score summary panel */}
      <div className="sve-card score-panel glass-panel">
        <div className="score-header">
          <div className="score-wheel">
            <span className="score-num">{reportData.validation_score}</span>
            <span className="score-max">/100</span>
          </div>
          <div className="score-meta">
            <span className="score-label">VALIDATION VERDICT</span>
            <h2>{reportData.verdict}</h2>
          </div>
        </div>
        <p className="score-reasoning">{reportData.reasoning}</p>
        <button className="sve-btn secondary" onClick={onReset}>
          <ArrowLeft size={16} />
          <span>Analyze Another Idea</span>
        </button>
      </div>

      {/* Grid of details */}
      <div className="dashboard-grid">
        
        {/* Section: Pain Points */}
        <div className="sve-card glass-panel grid-cell">
          <div className="cell-header">
            <MessageSquare size={18} className="blue-icon" />
            <h3>Mined User Pain Points</h3>
          </div>
          <div className="pain-points-list">
            {reportData.pain_points && reportData.pain_points.length > 0 ? (
              reportData.pain_points.map((pp: any, idx: number) => (
                <div key={idx} className="pain-point-item">
                  <div className="pp-summary" onClick={() => togglePainPoint(idx)}>
                    <div className="pp-main">
                      <span className="pp-title">{pp.pain_point}</span>
                      <span className="pp-mentions">{pp.mentions} {pp.mentions === 1 ? 'mention' : 'mentions'}</span>
                    </div>
                    <div className="pp-side">
                      <span className={`pp-badge severity-${pp.severity || 3}`}>
                        Severity: {pp.severity || 3}/5
                      </span>
                      <ChevronRight size={16} className={`arrow ${expandedPainPoints[idx] ? 'expanded' : ''}`} />
                    </div>
                  </div>
                  
                  {expandedPainPoints[idx] && (
                    <div className="pp-details">
                      <span className="evidence-title">Evidencing Posts:</span>
                      {pp.sources && pp.sources.length > 0 ? (
                        <ul>
                          {pp.sources.map((url: string, uidx: number) => (
                            <li key={uidx}>
                              <a href={url} target="_blank" rel="noopener noreferrer">
                                <span>{url}</span>
                                <ExternalLink size={12} />
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="no-sources">No source links available.</p>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="empty-state">No pain points surfaced from public forums.</div>
            )}
          </div>
        </div>

        {/* Section: Competitors */}
        <div className="sve-card glass-panel grid-cell">
          <div className="cell-header">
            <Compass size={18} className="blue-icon" />
            <h3>Verified Competitors</h3>
          </div>
          <div className="competitors-list">
            {reportData.competitors && reportData.competitors.length > 0 ? (
              reportData.competitors.map((c: any, idx: number) => (
                <div key={idx} className="competitor-item">
                  <div className="comp-header">
                    <span className="comp-name">{c.name}</span>
                    <a href={c.source_url} target="_blank" rel="noopener noreferrer" className="comp-link">
                      <span>Source</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                  {c.website && <span className="comp-web">{c.website}</span>}
                  {c.missing_features && c.missing_features.length > 0 && (
                    <div className="comp-gaps">
                      <span className="gaps-title">Unmet Needs / Missing Features:</span>
                      <div className="gap-badges">
                        {c.missing_features.map((f: string, fidx: number) => (
                          <span key={fidx} className="gap-badge">{f}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="empty-state">No competitor entries verified on the web.</div>
            )}
          </div>
        </div>

        {/* Section: Feature Requests */}
        <div className="sve-card glass-panel grid-cell full-width">
          <div className="cell-header">
            <BarChart3 size={18} className="blue-icon" />
            <h3>Surfaced Feature Demands</h3>
          </div>
          <div className="features-grid">
            {reportData.feature_requests && reportData.feature_requests.length > 0 ? (
              reportData.feature_requests.map((f: any, idx: number) => (
                <div key={idx} className="feature-item">
                  <div className="feat-main">
                    <span className="feat-name">{f.feature_name}</span>
                    <span className="feat-mentions">{f.mentions} {f.mentions === 1 ? 'request' : 'requests'}</span>
                  </div>
                  <span className={`feat-priority prio-${f.priority || 'low'}`}>
                    {f.priority || 'low'} priority
                  </span>
                </div>
              ))
            ) : (
              <div className="empty-state">No feature requests extracted.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
