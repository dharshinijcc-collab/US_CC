// app/founder/idea-validator/reset-password/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { Lock, Eye, EyeOff, Check, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Check if we are running in browser context and have session available
  useEffect(() => {
    if (!supabase) return;

    // Verify if there is an active session (Supabase sets recovery session automatically from the email link hash)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // Recovery link sessions exist in hash. If hash is empty and session is null, recovery link might be expired.
        console.warn('No active session found for password reset.');
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      if (!supabase) {
        // Fallback mock mode
        console.log('Mock password update successful');
        setSuccess(true);
        setLoading(false);
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
      
      // Redirect to founder page after short delay
      setTimeout(() => {
        router.push('/founder');
      }, 3000);
    } catch (err: any) {
      console.error('Password update error:', err);
      setError(err.message || 'Failed to update your password. The recovery link may have expired.');
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
              backgroundColor: '#F0FDF4',
              color: '#15803D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <ShieldCheck size={24} />
            </div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: '#0F172A',
              margin: '0 0 8px 0',
              fontFamily: "'Manrope', sans-serif",
              letterSpacing: '-0.02em'
            }}>
              Set New Password
            </h1>
            <p style={{
              color: '#64748B',
              fontSize: '0.875rem',
              lineHeight: 1.5,
              margin: 0,
              fontFamily: "'Inter', sans-serif"
            }}>
              Please enter your new password below. It must be at least 6 characters long.
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
                  Password updated successfully! Redirecting you to the workspace...
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
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
                  New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94A3B8'
                  }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 38px 12px 38px',
                      borderRadius: '8px',
                      border: '1.5px solid #E2E8F0',
                      outline: 'none',
                      fontSize: '0.875rem',
                      fontFamily: "'Inter', sans-serif",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#94A3B8',
                      padding: 0
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '28px' }}>
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
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94A3B8'
                  }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 38px',
                      borderRadius: '8px',
                      border: '1.5px solid #E2E8F0',
                      outline: 'none',
                      fontSize: '0.875rem',
                      fontFamily: "'Inter', sans-serif",
                    }}
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
                }}
              >
                {loading ? 'Saving Password...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
