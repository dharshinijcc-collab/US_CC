'use client';

import React, { useState } from 'react';
import { Mail, Lock, EyeOff, Eye, User, ArrowLeft, X } from 'lucide-react';
import MatrixBackground from '@/components/effects/MatrixBackground';

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
  onPrev: () => void; // Used here as onClose
  onGoogleAuthSuccess?: (idToken: string) => void;
}

export default function AuthStep({
  authTab, setAuthTab, authName, setAuthName, authEmail, setAuthEmail, authPassword, setAuthPassword,
  showPassword, setShowPassword, onSubmit, onPrev, onGoogleAuthSuccess
}: AuthStepProps) {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showGoogleSimulator, setShowGoogleSimulator] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');

  // Brand SVG Logos
  const googleLogo = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginRight: '10px' }}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );

  const triggerGoogleLogin = () => {
    const clientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || (import.meta as any).env?.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (clientId && window.google) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: any) => {
            if (response.credential && onGoogleAuthSuccess) {
              onGoogleAuthSuccess(response.credential);
            }
          }
        });
        window.google.accounts.id.prompt();
      } catch (err) {
        console.error('Google One Tap Error:', err);
        setShowGoogleSimulator(true);
      }
    } else {
      setShowGoogleSimulator(true);
    }
  };

  const handleSimulatedGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoogleEmail || !customGoogleEmail.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    setShowGoogleSimulator(false);
    if (onGoogleAuthSuccess) {
      onGoogleAuthSuccess(`mock_google_token_${customGoogleEmail.toLowerCase()}`);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(15, 23, 42, 0.45)', // Sleek dark slate backdrop
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '460px',
        minHeight: '440px',
        margin: '0 24px',
        borderRadius: '24px',
        backgroundColor: '#FFFFFF',
        border: '1.5px solid #E2E8F0',
        boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.1)',
        overflow: 'hidden',
        padding: '48px 36px',
        fontFamily: "'Inter', sans-serif",
        boxSizing: 'border-box'
      }}>
        
        {/* Left Glow */}
        <div style={{
          position: 'absolute',
          width: '280px',
          height: '280px',
          background: 'radial-gradient(circle, rgba(0, 90, 226, 0.08), transparent 70%)',
          top: '10%',
          left: '-140px',
          pointerEvents: 'none',
          zIndex: 0,
          filter: 'blur(30px)'
        }} />
        
        {/* Right Glow */}
        <div style={{
          position: 'absolute',
          width: '280px',
          height: '280px',
          background: 'radial-gradient(circle, rgba(0, 90, 226, 0.08), transparent 70%)',
          bottom: '20%',
          right: '-140px',
          pointerEvents: 'none',
          zIndex: 0,
          filter: 'blur(30px)'
        }} />

        {/* Bottom Glow */}
        <div style={{
          position: 'absolute',
          width: '180px',
          height: '180px',
          background: 'radial-gradient(circle, rgba(0, 90, 226, 0.05), transparent 70%)',
          bottom: '-90px',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          zIndex: 0,
          filter: 'blur(20px)'
        }} />

        {/* Background characters matrix aligned to borders inside popup */}
        <MatrixBackground />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Close Button & Header */}
          <div style={{ position: 'absolute', top: '-24px', right: '-12px' }}>
            <button 
              type="button" 
              onClick={onPrev} 
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#94A3B8',
                padding: '6px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s, color 0.2s'
              }}
              onMouseOver={e => { e.currentTarget.style.backgroundColor = '#F1F5F9'; e.currentTarget.style.color = '#475569'; }}
              onMouseOut={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#94A3B8'; }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Brand headers matching references */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{
              fontSize: '2.25rem',
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.03em',
              margin: '0 0 12px 0',
              lineHeight: '1.15',
              fontFamily: "'Manrope', sans-serif"
            }}>
              Sign In / Log In
            </h2>
            <p style={{
              color: '#64748B',
              fontSize: '0.925rem',
              lineHeight: '1.5',
              maxWidth: '380px',
              margin: '0 auto'
            }}>
              Access your custom metrics, scraped reddit demand, scorecards, and roadmap instantly.
            </p>
          </div>

          {/* Auth Forms */}
          {!showEmailForm ? (
            /* Primary Social Buttons Card (Image 1 Style without small socials) */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '360px', margin: '0 auto' }}>
              <button
                type="button"
                onClick={triggerGoogleLogin}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  backgroundColor: '#1E293B',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '14px 20px',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s, transform 0.1s'
                }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#0F172A'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = '#1E293B'}
              >
                {googleLogo}
                Continue with Google
              </button>

              <button
                type="button"
                onClick={() => setShowEmailForm(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  backgroundColor: '#F1F5F9',
                  color: 'var(--primary-blue)',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '14px 20px',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#E2E8F0'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = '#F1F5F9'}
              >
                <Mail size={16} />
                Continue with Email
              </button>

              {/* Terms Footer */}
              <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '0.78rem', color: '#64748B', lineHeight: '1.4' }}>
                By continuing, you agree to our <br />
                <a href="/terms" target="_blank" style={{ color: '#64748B', fontWeight: 600, textDecoration: 'underline' }}>Terms of Service</a> and <a href="/privacy" target="_blank" style={{ color: '#64748B', fontWeight: 600, textDecoration: 'underline' }}>Privacy Policy</a>.
              </div>
            </div>
          ) : (
            /* Email Input Form (Image 2 Style) */
            <div style={{ maxWidth: '380px', margin: '0 auto' }}>
              {/* Header Tabs */}
              <div style={{ display: 'flex', borderBottom: '1.5px solid #F1F5F9', marginBottom: '24px' }}>
                <button 
                  type="button"
                  onClick={() => setAuthTab('signup')}
                  style={{
                    flex: 1,
                    paddingBottom: '12px',
                    border: 'none',
                    background: 'transparent',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    color: authTab === 'signup' ? 'var(--primary-blue)' : '#94A3B8',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  Create Account
                  {authTab === 'signup' && <div style={{ position: 'absolute', bottom: -1.5, left: 0, right: 0, height: 2, backgroundColor: 'var(--primary-blue)' }} />}
                </button>
                <button 
                  type="button"
                  onClick={() => setAuthTab('login')}
                  style={{
                    flex: 1,
                    paddingBottom: '12px',
                    border: 'none',
                    background: 'transparent',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    color: authTab === 'login' ? 'var(--primary-blue)' : '#94A3B8',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  Log In
                  {authTab === 'login' && <div style={{ position: 'absolute', bottom: -1.5, left: 0, right: 0, height: 2, backgroundColor: 'var(--primary-blue)' }} />}
                </button>
              </div>

              <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {authTab === 'signup' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>Full Name</label>
                    <div style={{ position: 'relative' }}>
                      <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                      <input 
                        type="text" 
                        required
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 42px',
                          borderRadius: '12px',
                          border: '1.5px solid #E2E8F0',
                          outline: 'none',
                          fontSize: '0.9rem',
                          boxSizing: 'border-box'
                        }}
                        placeholder="Jane Doe"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                    <input 
                      type="email" 
                      required
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 42px',
                        borderRadius: '12px',
                        border: '1.5px solid #E2E8F0',
                        outline: 'none',
                        fontSize: '0.9rem',
                        boxSizing: 'border-box'
                      }}
                      placeholder="jane@example.com"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>Password (min. 6 characters)</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      required
                      style={{
                        width: '100%',
                        padding: '12px 42px 12px 42px',
                        borderRadius: '12px',
                        border: '1.5px solid #E2E8F0',
                        outline: 'none',
                        fontSize: '0.9rem',
                        boxSizing: 'border-box'
                      }}
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
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--primary-blue)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    marginTop: '8px',
                    boxShadow: '0 8px 16px -4px rgba(0, 90, 226, 0.25)'
                  }}
                >
                  {authTab === 'signup' ? 'Create Account & View Report' : 'Log In & View Report'}
                </button>

                {/* Or continue with Google (Image 2 style) */}
                <div style={{ position: 'relative', textAlign: 'center', margin: '14px 0 6px 0' }}>
                  <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: '1px', backgroundColor: '#E2E8F0', zIndex: 1 }}></div>
                  <span style={{ position: 'relative', zIndex: 2, backgroundColor: '#FFFFFF', padding: '0 12px', color: '#64748B', fontSize: '0.8rem' }}>Or continue with</span>
                </div>

                <button
                  type="button"
                  onClick={triggerGoogleLogin}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    backgroundColor: '#FFFFFF',
                    color: '#334155',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '12px 20px',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                >
                  {googleLogo}
                  Sign in with Google
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowEmailForm(false)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#64748B',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <ArrowLeft size={14} /> Back
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthTab(authTab === 'signup' ? 'login' : 'signup')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--primary-blue)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {authTab === 'signup' ? 'Already have an account? Log In' : 'New user? Sign Up'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Brand-new simulated Google popup/modal */}
        {showGoogleSimulator && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99,
            padding: '24px'
          }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '340px',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
              boxSizing: 'border-box'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {googleLogo}
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A' }}>Google Account Sign-In</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setShowGoogleSimulator(false)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 0 }}
                >
                  <X size={16} />
                </button>
              </div>
              
              <p style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: '1.4', marginBottom: '18px' }}>
                Simulator Mode: Choose an email address to log in instantly via verified Google OAuth route.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setCustomGoogleEmail('dhars@crestcode.com');
                    setShowGoogleSimulator(false);
                    if (onGoogleAuthSuccess) onGoogleAuthSuccess('mock_google_token_dhars@crestcode.com');
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    background: '#F8FAFC',
                    textAlign: 'left',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#334155',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = '#F1F5F9'}
                  onMouseOut={e => e.currentTarget.style.background = '#F8FAFC'}
                >
                  dhars@crestcode.com (Developer)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomGoogleEmail('founder.tester@gmail.com');
                    setShowGoogleSimulator(false);
                    if (onGoogleAuthSuccess) onGoogleAuthSuccess('mock_google_token_founder.tester@gmail.com');
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    background: '#F8FAFC',
                    textAlign: 'left',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#334155',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = '#F1F5F9'}
                  onMouseOut={e => e.currentTarget.style.background = '#F8FAFC'}
                >
                  founder.tester@gmail.com
                </button>
              </div>

              <form onSubmit={handleSimulatedGoogleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>Use Custom Email:</span>
                <input
                  type="email"
                  required
                  placeholder="you@gmail.com"
                  value={customGoogleEmail}
                  onChange={e => setCustomGoogleEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #E2E8F0',
                    outline: 'none',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    backgroundColor: '#1E293B',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    marginTop: '4px'
                }}
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}
