'use client';

import React from 'react';
import { Zap } from 'lucide-react';

interface AuthGateFormProps {
  isAuthenticated: boolean;
  isAuthChecking: boolean;
  authTab: 'signup' | 'login';
  setAuthTab: (tab: 'signup' | 'login') => void;
  handleAuthSubmit: (e: React.FormEvent) => void;
  authName: string;
  setAuthName: (val: string) => void;
  authEmail: string;
  setAuthEmail: (val: string) => void;
  authPassword: string;
  setAuthPassword: (val: string) => void;
  ideaText: string;
  setIdeaText: (val: string) => void;
  ideaName: string;
  setIdeaName: (val: string) => void;
  targetAudience: string;
  setTargetAudience: (val: string) => void;
  handleFormSubmit: (e: React.FormEvent) => void;
}

export default function AuthGateForm({
  isAuthenticated,
  isAuthChecking,
  authTab,
  setAuthTab,
  handleAuthSubmit,
  authName,
  setAuthName,
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword,
  ideaText,
  setIdeaText,
  ideaName,
  setIdeaName,
  targetAudience,
  setTargetAudience,
  handleFormSubmit,
}: AuthGateFormProps) {
  if (isAuthChecking) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748B' }}>
        Checking authentication session...
      </div>
    );
  }

  return (
    <div className="sve-card glass-panel fade-in">
      {!isAuthenticated ? (
        // Auth Wall
        <div className="sve-auth-gate">
          <div className="auth-header">
            <h3>Unlock the Validation Engine</h3>
            <p>Create a free account or login to access the scraper and database.</p>
          </div>
          
          <div className="auth-tabs">
            <button 
              type="button"
              className={authTab === 'signup' ? 'active' : ''} 
              onClick={() => setAuthTab('signup')}
            >
              Sign Up
            </button>
            <button 
              type="button"
              className={authTab === 'login' ? 'active' : ''} 
              onClick={() => setAuthTab('login')}
            >
              Log In
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="auth-form">
            {authTab === 'signup' && (
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Jane Doe" 
                  value={authName} 
                  onChange={e => setAuthName(e.target.value)} 
                  required 
                />
              </div>
            )}
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                value={authEmail} 
                onChange={e => setAuthEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={authPassword} 
                onChange={e => setAuthPassword(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="sve-btn primary">
              {authTab === 'signup' ? 'Create Account' : 'Sign In'}
            </button>
          </form>
        </div>
      ) : (
        // Idea Submission Form
        <form onSubmit={handleFormSubmit} className="sve-main-form">
          <div className="form-group">
            <label>Idea Description <span className="req">*</span></label>
            <textarea 
              placeholder="e.g. A developer tool that automatically detects API drift in staging environments and suggests fixes..."
              value={ideaText} 
              onChange={e => setIdeaText(e.target.value)}
              required 
            />
            <small>Provide at least 20 characters describing the core innovation and problem space.</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Product Name (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g. DriftGuard" 
                value={ideaName} 
                onChange={e => setIdeaName(e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Target Audience (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g. DevOps Engineers, SaaS CTOs" 
                value={targetAudience} 
                onChange={e => setTargetAudience(e.target.value)} 
              />
            </div>
          </div>

          <button type="submit" className="sve-btn primary glow-btn">
            <Zap size={16} />
            <span>Run Validation Pipeline</span>
          </button>
        </form>
      )}
    </div>
  );
}
