'use client';

import React from 'react';
import { Lightbulb, TrendingUp } from 'lucide-react';
import { QAAnswers } from '@/app/founder/idea-validator/types/scoring.types';
import EditableText from '@/components/pages/admin/EditableText';

interface WizardStep1Props {
  answers: QAAnswers;
  handleInputChange: (field: keyof QAAnswers, value: any) => void;
}

export default function WizardStep1({ answers, handleInputChange }: WizardStep1Props) {
  return (
    <div>
      <h2 className="form-heading">Step 1: About The Idea</h2>
      <p className="form-subheading" style={{ marginBottom: '24px' }}>Help us evaluate the core parameters, problem size, and validation level of your idea.</p>

      <div className="form-section-card">
        <div className="form-section-title">
          <Lightbulb size={18} style={{ color: '#005AE2' }} />
          <span>Core Value Proposition</span>
        </div>
        
        <div className="form-group">
          <label className="form-label">Who is the customer? *</label>
          <textarea 
            className="textarea-box"
            placeholder="e.g. Small law firms with 5–20 attorneys..."
            value={answers.customer}
            onChange={(e) => handleInputChange('customer', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">What problem does it solve? *</label>
          <textarea 
            className="textarea-box"
            placeholder="e.g. Legal teams spend 40% of their time on repetitive manual research..."
            value={answers.problem}
            onChange={(e) => handleInputChange('problem', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Pain Score (1-10)</label>
          <div className="pain-score-group">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
              <button 
                key={val}
                type="button"
                className={`pain-btn ${answers.pain_score === val ? 'active' : ''}`}
                onClick={() => handleInputChange('pain_score', val)}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="form-section-card">
        <div className="form-section-title">
          <TrendingUp size={18} style={{ color: '#005AE2' }} />
          <span>Market & Defensibility</span>
        </div>

        <div className="form-group">
          <label className="form-label">Validation Level</label>
          <div className="radio-pills-row">
            <div 
              className={`radio-pill-card ${answers.validation_level === 'none' ? 'active' : ''}`}
              onClick={() => handleInputChange('validation_level', 'none')}
            >
              <span className="radio-title">None</span>
              <span className="radio-desc">Just an early concept</span>
            </div>
            <div 
              className={`radio-pill-card ${answers.validation_level === 'conversations' ? 'active' : ''}`}
              onClick={() => handleInputChange('validation_level', 'conversations')}
            >
              <span className="radio-title">Conversations</span>
              <span className="radio-desc">Spoken with potential users</span>
            </div>
            <div 
              className={`radio-pill-card ${answers.validation_level === 'waitlist' ? 'active' : ''}`}
              onClick={() => handleInputChange('validation_level', 'waitlist')}
            >
              <span className="radio-title">Waitlist / Signups</span>
              <span className="radio-desc">Tangible user interest leads</span>
            </div>
            <div 
              className={`radio-pill-card ${answers.validation_level === 'paying_customers' ? 'active' : ''}`}
              onClick={() => handleInputChange('validation_level', 'paying_customers')}
            >
              <span className="radio-title">Paying Customers</span>
              <span className="radio-desc">Active pilot contracts</span>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Competitors *</label>
          <textarea 
            className="textarea-box"
            placeholder="e.g. competitor1.com, competitor2.com - enter website details..."
            value={answers.competitors}
            onChange={(e) => handleInputChange('competitors', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Do you have a MOAT? *</label>
          <textarea 
            className="textarea-box"
            placeholder="e.g. Proprietary verification model; deep workflow integrations..."
            value={answers.moat}
            onChange={(e) => handleInputChange('moat', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
