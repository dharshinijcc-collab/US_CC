'use client';

import React from 'react';
import Link from 'next/link';
import { User, Mail, Lock, EyeOff, Eye, AlertTriangle, Check } from 'lucide-react';

interface GateOverlayProps {
  isAuthenticated: boolean;
  isAuthChecking: boolean;
  authTab: 'signup' | 'login';
  setAuthTab: (tab: 'signup' | 'login') => void;
  authName: string;
  setAuthName: (val: string) => void;
  authEmail: string;
  setAuthEmail: (val: string) => void;
  authPassword: string;
  setAuthPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  gateError: string | null;
  gateSuccess: string | null;
  onSubmit: (e: React.FormEvent) => void;
}

export default function GateOverlay({
  isAuthenticated, isAuthChecking, authTab, setAuthTab, authName, setAuthName, authEmail, setAuthEmail,
  authPassword, setAuthPassword, showPassword, setShowPassword, gateError, gateSuccess, onSubmit
}: GateOverlayProps) {
  if (isAuthenticated || isAuthChecking) return null;

  return (
    <div className="auth-gate-overlay-fixed">
      <div className="form-card auth-card" style={{ maxWidth: '440px', width: '100%', margin: '0 24px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '32px', boxShadow: '0 12px 32px rgba(15, 23, 42, 0.06)', pointerEvents: 'auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--accent-blue)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            CrestCode Access Gate
          </span>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginTop: '6px', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            Unlock Analysis
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.825rem', lineHeight: '1.5', margin: 0 }}>
            A free CrestCode account is required to view the dynamic readiness scorecard, detailed dimension breakdown, and tactical roadmap.
          </p>
        </div>

        {gateError && (
          <div className="error-banner" style={{ display: 'flex', gap: '8px', alignItems: 'center', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '6px', padding: '12px', color: '#991B1B', fontSize: '0.8rem', marginBottom: '16px' }}>
            <AlertTriangle size={14} style={{ flexShrink: 0 }} />
            <span>{gateError}</span>
          </div>
        )}
        {gateSuccess && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', backgroundColor: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '6px', padding: '12px', color: '#166534', fontSize: '0.8rem', marginBottom: '16px' }}>
            <Check size={14} style={{ flexShrink: 0, marginTop: '1px' }} />
            <span>{gateSuccess}</span>
          </div>
        )}

        {/* Tab Selector */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', marginBottom: '16px', position: 'relative' }}>
          <button 
            type="button"
            onClick={() => setAuthTab('signup')}
            style={{
              flex: 1,
              paddingBottom: '8px',
              border: 'none',
              background: 'transparent',
              fontWeight: 700,
              fontSize: '0.85rem',
              color: authTab === 'signup' ? 'var(--accent-blue)' : '#64748B',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            Create Account
            {authTab === 'signup' && <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, backgroundColor: 'var(--accent-blue)', borderRadius: '1px' }} />}
          </button>
          <button 
            type="button"
            onClick={() => setAuthTab('login')}
            style={{
              flex: 1,
              paddingBottom: '8px',
              border: 'none',
              background: 'transparent',
              fontWeight: 700,
              fontSize: '0.85rem',
              color: authTab === 'login' ? 'var(--accent-blue)' : '#64748B',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            Log In
            {authTab === 'login' && <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, backgroundColor: 'var(--accent-blue)', borderRadius: '1px' }} />}
          </button>
        </div>

        <form onSubmit={onSubmit}>
          {authTab === 'signup' && (
            <div className="form-group" style={{ marginBottom: '12px', gap: '4px' }}>
              <label className="form-label" style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '4px', fontSize: '0.78rem' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={12} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input 
                  type="text" 
                  style={{ width: '100%', padding: '8px 10px 8px 30px', borderRadius: '6px', border: '1.5px solid #E2E8F0', outline: 'none', fontSize: '0.825rem' }}
                  placeholder="Jane Doe"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '12px', gap: '4px' }}>
            <label className="form-label" style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '4px', fontSize: '0.78rem' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={12} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input 
                type="email" 
                style={{ width: '100%', padding: '8px 10px 8px 30px', borderRadius: '6px', border: '1.5px solid #E2E8F0', outline: 'none', fontSize: '0.825rem' }}
                placeholder="jane@example.com"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '16px', gap: '4px' }}>
            <label className="form-label" style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '4px', fontSize: '0.78rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={12} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                style={{ width: '100%', padding: '8px 30px 8px 30px', borderRadius: '6px', border: '1.5px solid #E2E8F0', outline: 'none', fontSize: '0.825rem' }}
                placeholder="••••••••"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                  background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 0
                }}
              >
                {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
              </button>
            </div>
            {authTab === 'login' && (
              <div style={{ textAlign: 'right', marginTop: '6px' }}>
                <Link 
                  href="/founder/idea-validator/forgot-password" 
                  style={{ color: 'var(--accent-blue)', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none' }}
                >
                  Forgot Password?
                </Link>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              width: '100%',
              backgroundColor: 'var(--accent-blue)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              padding: '10px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            <span>{authTab === 'signup' ? 'Create Account & Unlock' : 'Log In & Unlock'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
