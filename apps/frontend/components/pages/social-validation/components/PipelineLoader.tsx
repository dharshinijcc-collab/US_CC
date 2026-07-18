'use client';

import React from 'react';
import { 
  Zap, Compass, Key, Globe, Brain, MessageSquare, Target, Layers, BarChart3, Check, RefreshCw, AlertTriangle 
} from 'lucide-react';

interface PipelineLoaderProps {
  currentStageId: string;
  elapsedSeconds: number;
}

export default function PipelineLoader({ currentStageId, elapsedSeconds }: PipelineLoaderProps) {
  // Pipeline stages mapping backend stage IDs to labels/subtexts and icons
  const stages = [
    { id: 'init',                 icon: Zap,           label: 'Pipeline Initialized',         sub: 'Project created, validation pipeline starting up' },
    { id: 'keyword_generation',   icon: Key,           label: 'Generating Search Keywords',    sub: 'Gemini AI extracts problem-framed query keywords' },
    { id: 'collecting',           icon: Globe,         label: 'Harvesting Forum Discussions',  sub: 'Scraping HN & Product Hunt for real user posts' },
    { id: 'extracting_pain_points',icon: Brain,         label: 'Extracting Customer Pain Points', sub: 'AI reads every post and maps user struggles' },
    { id: 'sentiment_tagging',    icon: MessageSquare, label: 'Analyzing Buying Intent',       sub: 'Tagging posts with active search & buying signals' },
    { id: 'competitor_discovery', icon: Target,        label: 'Discovering Competitors',       sub: 'Gemini web search locates market alternatives' },
    { id: 'feature_mapping',      icon: Layers,        label: 'Mapping Feature Gaps',          sub: 'Identifies capabilities users are asking for' },
    { id: 'scoring',              icon: BarChart3,     label: 'Computing Validation Score',    sub: 'Weighing pain frequency and competitive gaps' },
  ];

  const activeIdx = stages.findIndex(s => s.id === currentStageId);
  const activeStageIdx = activeIdx === -1 ? 0 : activeIdx;
  
  // Calculate a clean progress percentage based on active stage index
  const progressPct = Math.round(((activeStageIdx + 1) / stages.length) * 100);

  return (
    <div className="sve-pipeline-loader fade-in">
      {/* Header */}
      <div className="pipeline-header">
        <div className="pipeline-logo">
          <Compass size={22} />
        </div>
        <div>
          <h2>Social Validation Engine Running</h2>
          <p>AI is scanning forums and analyzing market signals for your idea</p>
        </div>
        <div className="pipeline-timer">
          <span>{Math.floor(elapsedSeconds / 60)}:{String(elapsedSeconds % 60).padStart(2, '0')}</span>
          <small>elapsed</small>
        </div>
      </div>

      {/* Progress bar */}
      <div className="pipeline-progress-track">
        <div className="pipeline-progress-fill" style={{ width: `${progressPct}%` }} />
        <span className="pipeline-progress-label">{progressPct}% complete</span>
      </div>

      {/* Stage steps */}
      <div className="pipeline-steps">
        {stages.map((stage, idx) => {
          const isDone    = idx < activeStageIdx;
          const isActive  = idx === activeStageIdx;
          const isPending = idx > activeStageIdx;
          const IconComponent = stage.icon;

          return (
            <div key={stage.id} className={`pipeline-step ${
              isDone ? 'step-done' : isActive ? 'step-active' : 'step-pending'
            }`}>
              <div className="step-icon-wrap">
                {isDone ? (
                  <Check size={16} />
                ) : isActive ? (
                  <RefreshCw size={16} className="spin-icon" />
                ) : (
                  <IconComponent size={16} />
                )}
              </div>
              <div className="step-body">
                <div className="step-label">
                  <span>{stage.label}</span>
                  {isDone && <span className="step-badge done">Done</span>}
                  {isActive && <span className="step-badge active">Running...</span>}
                </div>
                {(isActive || isDone) && <p className="step-sub">{stage.sub}</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Current action text */}
      <div className="pipeline-current-action">
        <AlertTriangle size={14} />
        <span>This typically takes <strong>2–3 minutes</strong> — please keep this tab open</span>
      </div>
    </div>
  );
}
