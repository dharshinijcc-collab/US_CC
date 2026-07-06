'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-check if already logged in by pinging `/api/auth/check`
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/check');
        const json = await res.json();
        if (json.status === 'success') {
          router.push('/admin/dashboard');
        }
      } catch {}
    };
    checkSession();
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (json.status === 'success') {
        router.push('/admin/dashboard');
      } else {
        setError(json.payload || 'Invalid email or password');
      }
    } catch {
      setError('Connection error — please try again');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={s.page}>
      <div style={s.container}>
        {/* Logo */}
        <div style={s.logoContainer}>
          <div style={s.logoBadge}>CC</div>
          <h1 style={s.title}>Admin Portal</h1>
          <p style={s.subtitle}>Sign in to access your CrestCode Dashboard</p>
        </div>

        {/* Login Card */}
        <form onSubmit={handleLogin} style={s.formCard}>
          <div style={s.inputGroup}>
            <label style={s.label}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@crestcode.com"
              style={s.input}
            />
          </div>

          <div style={s.inputGroup}>
            <label style={s.label}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={s.input}
            />
          </div>

          {error && (
            <div style={s.errorBanner}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...s.submitBtn,
              background: loading ? 'rgba(37,99,235,0.7)' : '#2563EB',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Authenticating…' : 'Sign In →'}
          </button>
        </form>

        <p style={s.footerText}>
          Secure HTTP-Only Cookie Authentication
        </p>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#0F172A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Inter', sans-serif"
  },
  container: {
    width: '100%',
    maxWidth: 420,
    padding: '0 24px'
  },
  logoContainer: {
    textAlign: 'center',
    marginBottom: 36
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    background: 'linear-gradient(135deg,#2563EB,#7C3AED)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    fontWeight: 800,
    color: '#fff',
    margin: '0 auto 16px',
    letterSpacing: '-0.02em',
    boxShadow: '0 10px 25px -5px rgba(37,99,235,0.3)'
  },
  title: {
    fontSize: 26,
    fontWeight: 800,
    color: '#F1F5F9',
    margin: '0 0 6px',
    letterSpacing: '-0.03em'
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    margin: 0
  },
  formCard: {
    background: '#1E293B',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 24,
    padding: 32,
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
  },
  inputGroup: {
    marginBottom: 20
  },
  label: {
    display: 'block',
    fontSize: 11,
    fontWeight: 800,
    color: '#94A3B8',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: 8
  },
  input: {
    width: '100%',
    background: '#0F172A',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: '12px 16px',
    color: '#F1F5F9',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Inter', sans-serif",
    transition: 'border-color 0.2s',
  },
  errorBanner: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: 12,
    color: '#FCA5A5',
    fontSize: 13,
    padding: '12px 16px',
    marginBottom: 20
  },
  submitBtn: {
    width: '100%',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '14px',
    fontSize: 15,
    fontWeight: 700,
    transition: 'all 0.2s',
    letterSpacing: '-0.01em',
    boxShadow: '0 8px 20px -6px rgba(37,99,235,0.4)'
  },
  footerText: {
    textAlign: 'center',
    fontSize: 11,
    color: '#475569',
    marginTop: 24,
    fontWeight: 500,
    letterSpacing: '0.05em',
    textTransform: 'uppercase'
  }
};
