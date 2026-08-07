'use client';

import React from 'react';
import { Lightbulb, TrendingUp, ArrowRight } from 'lucide-react';
import EditableText from '@/components/pages/admin/EditableText';
import type { QAAnswers } from '@/app/founder/idea-validator/types/scoring.types';

interface ConceptStepProps {
  idea: string;
  setIdea: (val: string) => void;
  answers: QAAnswers;
  onChange: (field: keyof QAAnswers, val: any) => void;
  onNext: () => void;
}

export default function ConceptStep({ idea, setIdea, answers, onChange, onNext }: ConceptStepProps) {
  return (
    <div className="form-card" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)' }}>
      
      <div className="form-section-card" style={{ border: 'none', padding: 0, background: 'transparent' }}>
        <div className="form-section-title" style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '24px', color: '#0F172A' }}>
          <Lightbulb size={20} style={{ color: 'var(--primary-blue)' }} />
          <EditableText contentKey="validator.step1.sectionTitle" value="The Core Concept" as="span" />
        </div>

        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label" style={{ display: 'block', color: '#374151', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', fontFamily: "'Inter', sans-serif" }}>
            Describe your startup idea <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <textarea 
            className="form-input-light textarea-box"
            style={{ width: '100%', minHeight: '100px', resize: 'vertical' }}
            placeholder="Describe what your venture does, the technology, and core innovation..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label" style={{ display: 'block', color: '#374151', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', fontFamily: "'Inter', sans-serif" }}>
            Who is the target customer? <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <textarea 
            className="form-input-light textarea-box"
            style={{ width: '100%', minHeight: '80px', resize: 'vertical' }}
            placeholder="e.g. Mid-sized retail brands struggling with omnichannel returns..."
            value={answers.customer}
            onChange={(e) => onChange('customer', e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label" style={{ display: 'block', color: '#374151', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', fontFamily: "'Inter', sans-serif" }}>
            What specific problem do you solve? <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <textarea 
            className="form-input-light textarea-box"
            style={{ width: '100%', minHeight: '80px', resize: 'vertical' }}
            placeholder="e.g. Return processing takes 14 days and wastes 18% of product margins due to manual triage..."
            value={answers.problem}
            onChange={(e) => onChange('problem', e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label" style={{ display: 'block', fontWeight: 800, color: '#0F172A', marginBottom: '8px', fontSize: '1.05rem', fontFamily: "'Manrope', sans-serif" }}>
            Customer Pain Score (1 = Low, 10 = Critical)
          </label>
          <div className="pain-score-group" style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
              <button 
                key={val}
                type="button"
                className={`pain-btn ${answers.pain_score === val ? 'active' : ''}`}
                onClick={() => onChange('pain_score', val)}
                style={{
                  flex: 1,
                  minWidth: '36px',
                  height: '38px',
                  borderRadius: '8px',
                  border: answers.pain_score === val ? '2px solid var(--primary-blue)' : '1px solid #E2E8F0',
                  backgroundColor: answers.pain_score === val ? 'rgba(0, 90, 226, 0.08)' : '#FFFFFF',
                  color: answers.pain_score === val ? 'var(--primary-blue)' : '#0F172A',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="form-section-card" style={{ borderTop: '1px solid #E2E8F0', marginTop: '32px', paddingTop: '32px', borderBottom: 'none', paddingBottom: 0, background: 'transparent' }}>
        <div className="form-section-title" style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '24px', color: '#0F172A' }}>
          <TrendingUp size={20} style={{ color: 'var(--primary-blue)' }} />
          <EditableText contentKey="validator.step1.marketTitle" value="Market Defensibility" as="span" />
        </div>

        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label" style={{ display: 'block', fontWeight: 800, color: '#0F172A', marginBottom: '12px', fontSize: '1.05rem', fontFamily: "'Manrope', sans-serif" }}>
            Validation Level
          </label>
          <div className="radio-pills-row">
            {[
              { key: 'none', title: 'Concept Only', desc: 'No validation yet' },
              { key: 'conversations', title: 'User Interviews', desc: 'Spoken with prospects' },
              { key: 'waitlist', title: 'Waitlist / Signups', desc: 'Tangible customer leads' },
              { key: 'paying_customers', title: 'Paying Customers', desc: 'Active pilots or contracts' }
            ].map(opt => (
              <div 
                key={opt.key}
                className={`radio-pill-card ${answers.validation_level === opt.key ? 'active' : ''}`}
                onClick={() => onChange('validation_level', opt.key)}
              >
                <div className="radio-pill-title">{opt.title}</div>
                <div className="radio-pill-desc">{opt.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label" style={{ display: 'block', color: '#374151', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', fontFamily: "'Inter', sans-serif" }}>
            Competitors <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <textarea 
            className="form-input-light textarea-box"
            style={{ width: '100%', minHeight: '70px', resize: 'vertical' }}
            placeholder="Who are the existing players? e.g. Shopify Flow, Returnly..."
            value={answers.competitors}
            onChange={(e) => onChange('competitors', e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label" style={{ display: 'block', color: '#374151', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', fontFamily: "'Inter', sans-serif" }}>
            What is your unfair advantage (MOAT)? <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <textarea 
            className="form-input-light textarea-box"
            style={{ width: '100%', minHeight: '70px', resize: 'vertical' }}
            placeholder="e.g. Proprietary returns logic API, exclusive distributor partnerships..."
            value={answers.moat}
            onChange={(e) => onChange('moat', e.target.value)}
          />
        </div>
      </div>

      {/* Action Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '40px' }}>
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
          <span>Continue to Founder Details</span>
          <ArrowRight size={16} />
        </button>
      </div>

    </div>
  );
}
