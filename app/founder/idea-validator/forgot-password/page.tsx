// app/founder/idea-validator/forgot-password/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { Mail, ArrowLeft, Check, AlertTriangle, Key } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      if (!supabase) {
        // Fallback mock mode
        console.log('Mock password reset requested for:', email);
        setSuccess(true);
        setLoading(false);
        return;
      }

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/founder/idea-validator/reset-password`,
      });

      if (resetError) {
        throw resetError;
      }

      setSuccess(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'Failed to send password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main style={{
        background: '#F8FAFC',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 24px 80px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow Effects */}
        <div style={{ position: 'absolute', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.08), transparent 70%)', top: '-10%', left: '50%', transform: 'translateX(-50%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }}></div>

        <div style={{
          maxWidth: '440px',
          width: '100%',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '40px 32px',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.04)',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#EFF6FF',
              color: '#005AE2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <Key size={24} />
            </div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: '#0F172A',
              margin: '0 0 8px 0',
              fontFamily: "'Manrope', sans-serif",
              letterSpacing: '-0.02em'
            }}>
              Forgot Password?
            </h1>
            <p style={{
              color: '#64748B',
              fontSize: '0.875rem',
              lineHeight: 1.5,
              margin: 0,
              fontFamily: "'Inter', sans-serif"
            }}>
              Enter the email address associated with your account, and we'll send you a link to reset your password.
            </p>
          </div>

          {error && (
            <div style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              borderRadius: '8px',
              padding: '12px 14px',
              color: '#991B1B',
              fontSize: '0.825rem',
              marginBottom: '20px',
              fontFamily: "'Inter', sans-serif"
            }}>
              <AlertTriangle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                backgroundColor: '#F0FDF4',
                border: '1px solid #86EFAC',
                borderRadius: '8px',
                padding: '14px',
                color: '#166534',
                fontSize: '0.875rem',
                marginBottom: '24px',
                textAlign: 'left',
                fontFamily: "'Inter', sans-serif"
              }}>
                <Check size={20} style={{ flexShrink: 0, color: '#15803D' }} />
                <span>
                  Password reset link sent! Check your inbox for instructions to set your new password.
                </span>
              </div>
              <Link href="/founder" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: '#005AE2',
                fontWeight: 700,
                fontSize: '0.875rem',
                textDecoration: 'none',
                fontFamily: "'Manrope', sans-serif"
              }}>
                <ArrowLeft size={16} />
                Back to Login / Home
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontWeight: 700,
                  color: '#334155',
                  marginBottom: '8px',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontFamily: "'Manrope', sans-serif"
                }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94A3B8'
                  }} />
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 38px',
                      borderRadius: '8px',
                      border: '1.5px solid #E2E8F0',
                      outline: 'none',
                      fontSize: '0.875rem',
                      fontFamily: "'Inter', sans-serif",
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#005AE2'}
                    onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #005AE2 0%, #4F46E5 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  boxShadow: '0 4px 12px rgba(0, 90, 226, 0.2)',
                  fontFamily: "'Manrope', sans-serif",
                  marginBottom: '20px'
                }}
              >
                {loading ? 'Sending Request...' : 'Send Reset Link'}
              </button>

              <div style={{ textAlign: 'center' }}>
                <Link href="/founder" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#64748B',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  fontFamily: "'Manrope', sans-serif"
                }}>
                  <ArrowLeft size={16} />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
