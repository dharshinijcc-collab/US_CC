'use client';

import React from 'react';
import {
  Users, Compass, User, Code2, Ban, History, Palette, Layers, Sprout, TrendingUp, DollarSign,
  ArrowLeft, Lightbulb, Rocket
} from 'lucide-react';
import EditableText from '@/components/pages/admin/EditableText';
import type { QAAnswers } from '@/app/founder/idea-validator/types/scoring.types';

interface FounderStepProps {
  answers: QAAnswers;
  onChange: (field: keyof QAAnswers, val: any) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function FounderStep({ answers, onChange, onPrev, onNext }: FounderStepProps) {
  return (
    <div className="form-card" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)' }}>
      
      <div className="form-section-card" style={{ border: 'none', padding: 0, background: 'transparent' }}>
        <div className="form-section-title" style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '24px', color: '#0F172A' }}>
          <Users size={20} style={{ color: 'var(--primary-blue)' }} />
          <EditableText contentKey="validator.step2.founderTitle" value="Founder Capabilities" as="span" />
        </div>

        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label" style={{ display: 'block', fontWeight: 800, color: '#0F172A', marginBottom: '8px', fontSize: '1.05rem', fontFamily: "'Manrope', sans-serif" }}>
            Are you a solo founder?
          </label>
          <div className="toggle-btn-group">
            <button 
              type="button" 
              className={`toggle-btn ${answers.solo_founder === true ? 'active' : ''}`}
              onClick={() => {
                onChange('solo_founder', true);
                onChange('has_technical_cofounder', false);
              }}
            >
              <User size={16} />
              <span>Solo Founder</span>
            </button>
            <button 
              type="button" 
              className={`toggle-btn ${answers.solo_founder === false ? 'active' : ''}`}
              onClick={() => onChange('solo_founder', false)}
            >
              <Users size={16} />
              <span>Co-founders / Team</span>
            </button>
          </div>
        </div>

        {!answers.solo_founder && (
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label" style={{ display: 'block', fontWeight: 800, color: '#0F172A', marginBottom: '8px', fontSize: '1.05rem', fontFamily: "'Manrope', sans-serif" }}>
              Is there a technical co-founder?
            </label>
            <div className="toggle-btn-group">
              <button 
                type="button" 
                className={`toggle-btn ${answers.has_technical_cofounder === true ? 'active' : ''}`}
                onClick={() => onChange('has_technical_cofounder', true)}
              >
                <Code2 size={16} />
                <span>Yes, they can code</span>
              </button>
              <button 
                type="button" 
                className={`toggle-btn ${answers.has_technical_cofounder === false ? 'active' : ''}`}
                onClick={() => onChange('has_technical_cofounder', false)}
              >
                <Ban size={16} />
                <span>No tech co-founder</span>
              </button>
            </div>
          </div>
        )}

        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label" style={{ display: 'block', fontWeight: 800, color: '#0F172A', marginBottom: '8px', fontSize: '1.05rem', fontFamily: "'Manrope', sans-serif" }}>
            What is your personal technical background?
          </label>
          <div className="toggle-btn-group">
            {[
              { key: 'can_code', label: 'I can code', icon: <Code2 size={16} /> },
              { key: 'used_to_code', label: 'I used to code', icon: <History size={16} /> },
              { key: 'no', label: 'Non-technical', icon: <Ban size={16} /> }
            ].map(opt => (
              <button 
                key={opt.key}
                type="button" 
                className={`toggle-btn ${answers.technical_background === opt.key ? 'active' : ''}`}
                onClick={() => onChange('technical_background', opt.key)}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="form-section-card" style={{ borderTop: '1px solid #E2E8F0', marginTop: '32px', paddingTop: '32px', borderBottom: 'none', paddingBottom: 0, background: 'transparent' }}>
        <div className="form-section-title" style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '24px', color: '#0F172A' }}>
          <Compass size={20} style={{ color: 'var(--primary-blue)' }} />
          <EditableText contentKey="validator.step2.timelineTitle" value="Project Timeline & Contact" as="span" />
        </div>

        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label" style={{ display: 'block', fontWeight: 800, color: '#0F172A', marginBottom: '8px', fontSize: '1.05rem', fontFamily: "'Manrope', sans-serif" }}>
            Current Development Stage
          </label>
          <div className="toggle-btn-group">
            {[
              { key: 'forming', label: 'Idea Only', icon: <Lightbulb size={16} /> },
              { key: 'ux_design', label: 'Design Stage', icon: <Palette size={16} /> },
              { key: 'prototype', label: 'Mock/Prototype', icon: <Layers size={16} /> },
              { key: 'mvp', label: 'Active MVP', icon: <Rocket size={16} /> }
            ].map(opt => (
              <button 
                key={opt.key}
                type="button" 
                className={`toggle-btn ${answers.current_stage === opt.key ? 'active' : ''}`}
                onClick={() => onChange('current_stage', opt.key)}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label" style={{ display: 'block', fontWeight: 800, color: '#0F172A', marginBottom: '8px', fontSize: '1.05rem', fontFamily: "'Manrope', sans-serif" }}>
            Target Launch Timeline
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <select 
              className="select-box"
              value={answers.launch_timeline.split(' ')[0] || 'January'}
              onChange={(e) => {
                const year = answers.launch_timeline.split(' ')[1] || '2026';
                onChange('launch_timeline', `${e.target.value} ${year}`);
              }}
              style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1.5px solid #E2E8F0', outline: 'none', cursor: 'pointer' }}
            >
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <select 
              className="select-box"
              value={answers.launch_timeline.split(' ')[1] || '2026'}
              onChange={(e) => {
                const month = answers.launch_timeline.split(' ')[0] || 'January';
                onChange('launch_timeline', `${month} ${e.target.value}`);
              }}
              style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1.5px solid #E2E8F0', outline: 'none', cursor: 'pointer' }}
            >
              {['2026', '2027', '2028', '2029', '2030'].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '32px' }}>
          <label className="form-label" style={{ display: 'block', fontWeight: 800, color: '#0F172A', marginBottom: '8px', fontSize: '1.05rem', fontFamily: "'Manrope', sans-serif" }}>
            Funding Stage
          </label>
          <div className="toggle-btn-group">
            {[
              { key: 'bootstrapped', label: 'Bootstrapped', icon: <Sprout size={16} /> },
              { key: 'raising', label: 'Raising Seed', icon: <TrendingUp size={16} /> },
              { key: 'raised', label: 'Funded', icon: <DollarSign size={16} /> }
            ].map(opt => (
              <button 
                key={opt.key}
                type="button" 
                className={`toggle-btn ${answers.funding_status === opt.key ? 'active' : ''}`}
                onClick={() => onChange('funding_status', opt.key)}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: '20px' }}>
          <input 
            type="checkbox" 
            id="need_help"
            checked={answers.need_help || false}
            onChange={(e) => onChange('need_help', e.target.checked)}
            style={{ width: 18, height: 18, accentColor: 'var(--primary-blue)', cursor: 'pointer' }}
          />
          <label htmlFor="need_help" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
            I would like CrestCode to contact me for co-founder build opportunities.
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
        <button 
          type="button" 
          onClick={onPrev}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '1.5px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
            color: '#64748B',
            borderRadius: '12px',
            padding: '12px 24px',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.95rem'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <button 
          onClick={onNext}
          className="btn-form-next"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--primary-blue)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            padding: '14px 28px',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.95rem'
          }}
        >
          <span>Submit Details</span>
        </button>
      </div>

    </div>
  );
}
