'use client';

import React from 'react';
import { Users, Compass, User } from 'lucide-react';
import { QAAnswers } from '@/app/founder/idea-validator/types/scoring.types';

interface WizardStep2Props {
  answers: QAAnswers;
  handleInputChange: (field: keyof QAAnswers, value: any) => void;
}

export default function WizardStep2({ answers, handleInputChange }: WizardStep2Props) {
  return (
    <div>
      <h2 className="form-heading">Step 2: About The Founder</h2>
      <p className="form-subheading" style={{ marginBottom: '24px' }}>Help us evaluate execution capacity, timeline models, and founder alignment.</p>

      <div className="form-section-card">
        <div className="form-section-title">
          <Users size={18} style={{ color: '#005AE2' }} />
          <span>Founding Team & Capabilities</span>
        </div>

        <div className="form-group">
          <label className="form-label">Are you a solo founder?</label>
          <div className="toggle-btn-group">
            <button 
              type="button" 
              className={`toggle-btn ${answers.solo_founder === true ? 'active' : ''}`}
              onClick={() => {
                handleInputChange('solo_founder', true);
                handleInputChange('has_technical_cofounder', false);
              }}
            >
              👤 Solo Founder
            </button>
            <button 
              type="button" 
              className={`toggle-btn ${answers.solo_founder === false ? 'active' : ''}`}
              onClick={() => handleInputChange('solo_founder', false)}
            >
              👥 Co-founders / Team
            </button>
          </div>
        </div>

        {!answers.solo_founder && (
          <div className="form-group">
            <label className="form-label">Is there a technical co-founder?</label>
            <div className="toggle-btn-group">
              <button 
                type="button" 
                className={`toggle-btn ${answers.has_technical_cofounder === true ? 'active' : ''}`}
                onClick={() => handleInputChange('has_technical_cofounder', true)}
              >
                💻 Yes, they can code
              </button>
              <button 
                type="button" 
                className={`toggle-btn ${answers.has_technical_cofounder === false ? 'active' : ''}`}
                onClick={() => handleInputChange('has_technical_cofounder', false)}
              >
                🚫 No tech co-founder
              </button>
            </div>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">What is your technical background?</label>
          <div className="toggle-btn-group">
            <button 
              type="button" 
              className={`toggle-btn ${answers.technical_background === 'can_code' ? 'active' : ''}`}
              onClick={() => handleInputChange('technical_background', 'can_code')}
            >
              💻 I can code
            </button>
            <button 
              type="button" 
              className={`toggle-btn ${answers.technical_background === 'used_to_code' ? 'active' : ''}`}
              onClick={() => handleInputChange('technical_background', 'used_to_code')}
            >
              ⏳ I used to code
            </button>
            <button 
              type="button" 
              className={`toggle-btn ${answers.technical_background === 'no' ? 'active' : ''}`}
              onClick={() => handleInputChange('technical_background', 'no')}
            >
              🚫 Non-technical
            </button>
          </div>
        </div>
      </div>

      <div className="form-section-card">
        <div className="form-section-title">
          <Compass size={18} style={{ color: '#005AE2' }} />
          <span>Execution Timeline & Stage</span>
        </div>

        <div className="form-group">
          <label className="form-label">Current Stage</label>
          <div className="toggle-btn-group">
            <button 
              type="button" 
              className={`toggle-btn ${answers.current_stage === 'forming' ? 'active' : ''}`}
              onClick={() => handleInputChange('current_stage', 'forming')}
            >
              💡 Still forming
            </button>
            <button 
              type="button" 
              className={`toggle-btn ${answers.current_stage === 'ux_design' ? 'active' : ''}`}
              onClick={() => handleInputChange('current_stage', 'ux_design')}
            >
              🎨 Got UX design
            </button>
            <button 
              type="button" 
              className={`toggle-btn ${answers.current_stage === 'prototype' ? 'active' : ''}`}
              onClick={() => handleInputChange('current_stage', 'prototype')}
            >
              ⚙️ Have prototype
            </button>
            <button 
              type="button" 
              className={`toggle-btn ${answers.current_stage === 'mvp' ? 'active' : ''}`}
              onClick={() => handleInputChange('current_stage', 'mvp')}
            >
              🚀 Have MVP
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Launch Timeline *</label>
          <div className="launch-timeline-select-group" style={{ display: 'flex', gap: '12px' }}>
            <select 
              className="select-box"
              value={answers.launch_timeline.split(' ')[0] || 'January'}
              onChange={(e) => {
                const year = answers.launch_timeline.split(' ')[1] || '2026';
                handleInputChange('launch_timeline', `${e.target.value} ${year}`);
              }}
              style={{ flex: 1 }}
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
                handleInputChange('launch_timeline', `${month} ${e.target.value}`);
              }}
              style={{ flex: 1 }}
            >
              {['2026', '2027', '2028', '2029', '2030'].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Funding Status</label>
          <div className="toggle-btn-group">
            <button 
              type="button" 
              className={`toggle-btn ${answers.funding_status === 'bootstrapped' ? 'active' : ''}`}
              onClick={() => handleInputChange('funding_status', 'bootstrapped')}
            >
              🌱 Bootstrapped
            </button>
            <button 
              type="button" 
              className={`toggle-btn ${answers.funding_status === 'raising' ? 'active' : ''}`}
              onClick={() => handleInputChange('funding_status', 'raising')}
            >
              📈 Raising Seed
            </button>
            <button 
              type="button" 
              className={`toggle-btn ${answers.funding_status === 'raised' ? 'active' : ''}`}
              onClick={() => handleInputChange('funding_status', 'raised')}
            >
              💰 Funded
            </button>
          </div>
        </div>
      </div>

      <div className="form-section-card">
        <div className="form-section-title">
          <User size={18} style={{ color: '#005AE2' }} />
          <span>Founder Contact Information</span>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0px', marginBottom: '16px', lineHeight: '1.4' }}>
          💡 <strong>Note:</strong> Your contact details are strictly used for communications and do not impact the score evaluation of the idea.
        </p>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label">Your Name *</label>
          <input 
            type="text" 
            className="input-text"
            placeholder="e.g. Jane Doe"
            value={answers.contact_name}
            onChange={(e) => handleInputChange('contact_name', e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label">Email Address *</label>
          <input 
            type="email" 
            className="input-text"
            placeholder="e.g. jane@example.com"
            value={answers.contact_email}
            onChange={(e) => handleInputChange('contact_email', e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
          <input 
            type="checkbox" 
            id="need_help"
            checked={answers.need_help || false}
            onChange={(e) => handleInputChange('need_help', e.target.checked)}
            style={{ width: 18, height: 18, accentColor: 'var(--primary-blue)', cursor: 'pointer' }}
          />
          <label htmlFor="need_help" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
            Do you need help from CrestCode?
          </label>
        </div>
      </div>
    </div>
  );
}
