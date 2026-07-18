'use client';

import React from 'react';
import { User, Mail, Lock, EyeOff, Eye, UserCheck, ArrowLeft } from 'lucide-react';

interface AuthStepProps {
  authTab: 'signup' | 'login';
  setAuthTab: (val: 'signup' | 'login') => void;
  authName: string;
  setAuthName: (val: string) => void;
  authEmail: string;
  setAuthEmail: (val: string) => void;
  authPassword: string;
  setAuthPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onPrev: () => void;
}

export default function AuthStep({
  authTab, setAuthTab, authName, setAuthName, authEmail, setAuthEmail, authPassword, setAuthPassword,
  showPassword, setShowPassword, onSubmit, onPrev
}: AuthStepProps) {
  return (
    <div className="form-card auth-card" style={{ maxWidth: '480px', margin: '0 auto', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '24px', padding: '32px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)' }}>
      
      {/* Tab Selector */}
      <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', marginBottom: '28px', position: 'relative' }}>
        <button 
          type="button"
          onClick={() => setAuthTab('signup')}
          style={{
            flex: 1,
            paddingBottom: '14px',
            border: 'none',
            background: 'transparent',
            fontWeight: 700,
            fontSize: '0.95rem',
            color: authTab === 'signup' ? 'var(--primary-blue)' : '#64748B',
            cursor: 'pointer',
            position: 'relative'
          }}
        >
          Create Account
          {authTab === 'signup' && <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 3, backgroundColor: 'var(--primary-blue)', borderRadius: '2px' }} />}
        </button>
        <button 
          type="button"
          onClick={() => setAuthTab('login')}
          style={{
            flex: 1,
            paddingBottom: '14px',
            border: 'none',
            background: 'transparent',
            fontWeight: 700,
            fontSize: '0.95rem',
            color: authTab === 'login' ? 'var(--primary-blue)' : '#64748B',
            cursor: 'pointer',
            position: 'relative'
          }}
        >
          Log In
          {authTab === 'login' && <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 3, backgroundColor: 'var(--primary-blue)', borderRadius: '2px' }} />}
        </button>
      </div>

      <form onSubmit={onSubmit}>
        {authTab === 'signup' && (
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ display: 'block', fontWeight: 800, color: '#0F172A', marginBottom: '8px', fontSize: '0.95rem', fontFamily: "'Manrope', sans-serif" }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input 
                type="text" 
                className="input-text"
                style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '12px', border: '1.5px solid #E2E8F0', outline: 'none', fontSize: '0.9rem' }}
                placeholder="Jane Doe"
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label" style={{ display: 'block', fontWeight: 800, color: '#0F172A', marginBottom: '8px', fontSize: '0.95rem', fontFamily: "'Manrope', sans-serif" }}>
            Email Address
          </label>
          <div style={{ position: 'relative' }}>
            <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input 
              type="email" 
              className="input-text"
              style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '12px', border: '1.5px solid #E2E8F0', outline: 'none', fontSize: '0.9rem' }}
              placeholder="jane@example.com"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '28px' }}>
          <label className="form-label" style={{ display: 'block', fontWeight: 800, color: '#0F172A', marginBottom: '8px', fontSize: '0.95rem', fontFamily: "'Manrope', sans-serif" }}>
            Password (min. 6 characters)
          </label>
          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input 
              type={showPassword ? 'text' : 'password'} 
              className="input-text"
              style={{ width: '100%', padding: '12px 42px 12px 42px', borderRadius: '12px', border: '1.5px solid #E2E8F0', outline: 'none', fontSize: '0.9rem' }}
              placeholder="••••••••"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 0
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          className="btn-form-next"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            backgroundColor: 'var(--primary-blue)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            padding: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.95rem'
          }}
        >
          <UserCheck size={16} />
          <span>{authTab === 'signup' ? 'Create Account & View Report' : 'Log In & View Report'}</span>
        </button>
      </form>

      {/* Back navigation link */}
      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <button 
          type="button"
          onClick={onPrev}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#64748B',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <ArrowLeft size={14} />
          Back to Questionnaire
        </button>
      </div>

    </div>
  );
}
