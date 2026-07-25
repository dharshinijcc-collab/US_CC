'use client';

export const dynamic = 'force-dynamic';

import React, { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { ScoringResponse, DIMENSION_META } from '@/app/founder/idea-validator/types/scoring.types';
import { supabase } from '@/lib/supabase';

// ─── Sub-components & Styles ──────────────────────────────────────────────────
import { reportStyles } from './reportStyles';
import ExecutiveSummaryCell from './components/ExecutiveSummaryCell';
import DimensionScoresCell from './components/DimensionScoresCell';
import VCMemoCell from './components/VCMemoCell';
import RiskMatrixCell from './components/RiskMatrixCell';
import RoadmapCell from './components/RoadmapCell';
import SocialEvidenceCell from './components/SocialEvidenceCell';
import GateOverlay from './components/GateOverlay';
import { exportToDoc as exportDocHelper } from './exportDoc';

function ReportContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const isTemp = searchParams.get('temp') === 'true';

  const [report, setReport] = useState<ScoringResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDimension, setSelectedDimension] = useState<string>('investor_appeal');
  const [memoTab, setMemoTab] = useState<'summary' | 'thesis' | 'strengths' | 'risks' | 'recommendation'>('summary');

  // Auth gate states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [authTab, setAuthTab] = useState<'signup' | 'login'>('signup');
  const [authName, setAuthName] = useState<string>('');
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [gateError, setGateError] = useState<string | null>(null);
  const [gateSuccess, setGateSuccess] = useState<string | null>(null);
  const [activeNotebookPage, setActiveNotebookPage] = useState<'executive' | 'dimensions' | 'memo' | 'risks' | 'roadmap' | 'evidence'>('executive');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      // Supabase not configured — use localStorage session fallback
      const savedSession = localStorage.getItem('cc_user_session');
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession);
          if (parsed?.isLoggedIn) setIsAuthenticated(true);
        } catch {}
      }
      setIsAuthChecking(false);

      if (!id) {
        setError('No report ID specified in URL query parameters.');
        setLoading(false);
        return;
      }

      async function fetchReportFallback() {
        try {
          setLoading(true);
          if (isTemp) {
            const cached = sessionStorage.getItem(`cc_report_${id}`);
            if (cached) {
              setReport(JSON.parse(cached));
              setLoading(false);
              return;
            }
          }
          const res = await fetch(`/api/idea-validator?id=${id}`);
          if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || 'Failed to fetch the due diligence report.');
          }
          const data = await res.json();
          setReport(data);
        } catch (err: any) {
          console.error(err);
          setError(err.message || 'An unexpected error occurred while loading the report.');
        } finally {
          setLoading(false);
        }
      }

      fetchReportFallback();
      return;
    }

    // Real Supabase auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setIsAuthChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    if (!id) {
      setError('No report ID specified in URL query parameters.');
      setLoading(false);
      return () => subscription.unsubscribe();
    }

    async function fetchReport() {
      try {
        setLoading(true);
        if (isTemp) {
          const cached = sessionStorage.getItem(`cc_report_${id}`);
          if (cached) {
            setReport(JSON.parse(cached));
            setLoading(false);
            return;
          }
        }
        const res = await fetch(`/api/idea-validator?id=${id}`);
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to fetch the due diligence report.');
        }
        const data = await res.json();
        setReport(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'An unexpected error occurred while loading the report.');
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
    return () => subscription.unsubscribe();
  }, [id, isTemp]);

  // Pre-fill Auth Gate fields if report answers contain contact details
  useEffect(() => {
    if (report?.answers) {
      if (!authName && report.answers.contact_name) {
        setAuthName(report.answers.contact_name);
      }
      if (!authEmail && report.answers.contact_email) {
        setAuthEmail(report.answers.contact_email);
      }
    }
  }, [report]);

  // Submit report to CrestCode DB when user clicks the CTA
  const handleSubmitToCrestCode = async () => {
    if (!report) return;
    setSubmitStatus('loading');
    setSubmitError(null);
    try {
      const res = await fetch('/api/idea-validator/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      if (id) sessionStorage.removeItem(`cc_report_${id}`);
      setSubmitStatus('success');
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || 'An unexpected error occurred. Please try again.');
      setSubmitStatus('error');
    }
  };

  const handleGateGoogleAuthSuccess = async (idToken: string) => {
    setLoading(true);
    setGateError(null);
    try {
      const res = await fetch('/api/idea-validator/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: idToken })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Google Login failed');
      
      if (data && data.access_token) {
        localStorage.setItem('Dtoken', data.access_token);
        const name = data.user?.name || data.user?.email.split('@')[0];
        const userSession = { name, email: data.user.email, isLoggedIn: true };
        localStorage.setItem('cc_user_session', JSON.stringify(userSession));
        setIsAuthenticated(true);

        // Put user ID into report/updates
        await fetch('/api/idea-validator', {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.access_token}`
          },
          body: JSON.stringify({ reportId: id, userId: data.user.id }),
        });
      } else {
        throw new Error('Failed to retrieve authentication tokens from Google login');
      }
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      setGateError(err.message || 'Google Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGateAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGateError(null);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!authEmail || !emailRegex.test(authEmail)) {
      setGateError('Please enter a valid email address.');
      return;
    }
    if (!authPassword || authPassword.length < 6) {
      setGateError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    if (authTab === 'signup') {
      if (!authName || authName.trim().length < 2) {
        setGateError('Please enter your full name.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/idea-validator/auth?action=signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: authName, email: authEmail, password: authPassword }),
        });

        const data = await res.json();
        if (!res.ok) {
          if (data.detail === 'already_exists') {
            throw new Error('An account with this email already exists.');
          }
          throw new Error(data.detail || 'Signup failed');
        }

        if (data.access_token) {
          localStorage.setItem('Dtoken', data.access_token);
          const userSession = { name: authName, email: authEmail, isLoggedIn: true };
          localStorage.setItem('cc_user_session', JSON.stringify(userSession));
          setIsAuthenticated(true);
          
          await fetch('/api/idea-validator', {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${data.access_token}`
            },
            body: JSON.stringify({ reportId: id, userId: data.user.id }),
          });
        }
      } catch (err: any) {
        console.error('Signup error:', err);
        setGateError(err.message || 'Signup failed. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const res = await fetch('/api/idea-validator/auth?action=login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: authEmail, password: authPassword }),
        });

        const data = await res.json();
        if (!res.ok) {
          if (data.detail === 'invalid_credentials') {
            throw new Error('Incorrect email or password.');
          }
          throw new Error(data.detail || 'Login failed');
        }

        if (data.access_token) {
          localStorage.setItem('Dtoken', data.access_token);
          const name = data.user?.name || authEmail.split('@')[0];
          const userSession = { name, email: authEmail, isLoggedIn: true };
          localStorage.setItem('cc_user_session', JSON.stringify(userSession));
          setIsAuthenticated(true);
          
          await fetch('/api/idea-validator', {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${data.access_token}`
            },
            body: JSON.stringify({ reportId: id, userId: data.user.id }),
          });
        }
      } catch (err: any) {
        console.error('Login error:', err);
        setGateError(err.message || 'Incorrect email or password. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="validator-container" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="form-card loading-wrap" style={{ border: 'none', boxShadow: 'none' }}>
          <div className="spinner-outer" style={{ margin: '0 auto 24px' }}>
            <div className="spinner-circle"></div>
            <div className="spinner-inner"></div>
          </div>
          <div className="loading-text" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
            Loading Due Diligence Report...
          </div>
          <p className="loading-desc" style={{ color: '#64748B', fontSize: '0.9rem', margin: 0 }}>
            Fetching verified startup signals from database cache...
          </p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="validator-container" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="form-card" style={{ maxWidth: '500px', textAlign: 'center', padding: '40px' }}>
          <div style={{ color: '#DC2626', marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
            <AlertTriangle size={64} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
            Unable to Load Report
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '32px' }}>
            {error || 'The requested due diligence report could not be found or does not exist.'}
          </p>
          <Link href="/founder" className="btn-results-outline" style={{ display: 'inline-flex', alignSelf: 'center', textDecoration: 'none', margin: '0 auto', gap: '8px' }}>
            <span>Evaluate a New Idea</span>
          </Link>
        </div>
      </div>
    );
  }

  const exportToDoc = () => {
    exportDocHelper(report, id);
  };

  return (
    <div className="validator-container cc-page-enter" style={{ paddingBottom: '100px', position: 'relative' }}>
      <style dangerouslySetInnerHTML={{ __html: reportStyles }} />
      <div className="content-box" style={!isAuthenticated ? { filter: 'blur(8px)', pointerEvents: 'none', userSelect: 'none' } : {}}>
        
        {/* Notebook Header Title Row */}
        <div className="dashboard-title-row" style={{ marginBottom: '28px' }}>
          <div>
            <span className="dashboard-subtitle">INTERACTIVE DUE DILIGENCE WORKSPACE</span>
            <h1 className="dashboard-title">Venture Assessment Notebook</h1>
          </div>
          {!report.is_mock && (
            <div className="dashboard-header-actions">
              <button className="btn-results-call" onClick={exportToDoc} style={{ gap: '6px' }}>
                <span>Export Word Doc</span>
              </button>
              <Link href="/founder/idea-validator" className="btn-results-outline" style={{ margin: 0, textDecoration: 'none', gap: '6px' }}>
                <RefreshCw size={13} />
                <span>Submit Another Idea</span>
              </Link>
            </div>
          )}
        </div>

        {report.is_mock ? (
          <div className="under-construction-panel" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '80px 24px',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
            marginTop: '20px'
          }}>
            <div className="icon-wrap" style={{ fontSize: '4rem', marginBottom: '24px' }}>
              🛠️
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px', letterSpacing: '-0.02em' }}>
              Venture Engine Under Construction
            </h2>
            <p style={{ fontSize: '1rem', color: '#475569', maxWidth: '540px', lineHeight: '1.6', marginBottom: '32px' }}>
              We got your idea! Our AI venture due diligence engine is currently undergoing maintenance. We have safely received your submission and will email the complete VC-grade assessment report to <strong>{report?.answers?.contact_email || 'your email'}</strong> once construction is complete.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link href="/founder/idea-validator" className="btn-results-call" style={{ textDecoration: 'none', padding: '12px 24px' }}>
                Submit Another Idea
              </Link>
            </div>
          </div>
        ) : (
          /* ── Notebook Workspace Layout ── */
          <div className="notebook-workspace">
            
            {/* Notebook Left Sidebar Navigation (TOC) */}
            <div className="notebook-sidebar">
              <div className="sidebar-group">
                <span className="sidebar-group-title">REPORT SECTIONS</span>
                <div className="sidebar-list">
                  <button 
                    type="button" 
                    className={`sidebar-item-btn ${activeNotebookPage === 'executive' ? 'active' : ''}`} 
                    onClick={() => setActiveNotebookPage('executive')}
                  >
                    <span className="cell-name">Executive Summary</span>
                  </button>
                  <button 
                    type="button" 
                    className={`sidebar-item-btn ${activeNotebookPage === 'dimensions' ? 'active' : ''}`} 
                    onClick={() => setActiveNotebookPage('dimensions')}
                  >
                    <span className="cell-name">Dimension Scores</span>
                  </button>
                  <button 
                    type="button" 
                    className={`sidebar-item-btn ${activeNotebookPage === 'memo' ? 'active' : ''}`} 
                    onClick={() => setActiveNotebookPage('memo')}
                  >
                    <span className="cell-name">VC Investment Memo</span>
                  </button>
                  <button 
                    type="button" 
                    className={`sidebar-item-btn ${activeNotebookPage === 'risks' ? 'active' : ''}`} 
                    onClick={() => setActiveNotebookPage('risks')}
                  >
                    <span className="cell-name">Risk Mitigation Matrix</span>
                  </button>
                  <button 
                    type="button" 
                    className={`sidebar-item-btn ${activeNotebookPage === 'roadmap' ? 'active' : ''}`} 
                    onClick={() => setActiveNotebookPage('roadmap')}
                  >
                    <span className="cell-name">Roadmap & Checklist</span>
                  </button>
                  {report.social_validation && (
                    <button 
                      type="button" 
                      className={`sidebar-item-btn ${activeNotebookPage === 'evidence' ? 'active' : ''}`} 
                      onClick={() => setActiveNotebookPage('evidence')}
                    >
                      <span className="cell-name">Evidence Explorer</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Notebook Right Content Area */}
            <div className="notebook-content">
              <ExecutiveSummaryCell report={report} activeNotebookPage={activeNotebookPage} />
              <DimensionScoresCell report={report} activeNotebookPage={activeNotebookPage} selectedDimension={selectedDimension} setSelectedDimension={setSelectedDimension} />
              <VCMemoCell report={report} activeNotebookPage={activeNotebookPage} memoTab={memoTab} setMemoTab={setMemoTab} />
              <RiskMatrixCell report={report} activeNotebookPage={activeNotebookPage} />
              <RoadmapCell report={report} activeNotebookPage={activeNotebookPage} isTemp={isTemp} submitStatus={submitStatus} submitError={submitError} onSubmitToCrestCode={handleSubmitToCrestCode} />
              <SocialEvidenceCell report={report} activeNotebookPage={activeNotebookPage} />
            </div>
          </div>
        )}
      </div>

      {/* Auth Gate Overlay */}
      <GateOverlay
        isAuthenticated={isAuthenticated}
        isAuthChecking={isAuthChecking}
        authTab={authTab}
        setAuthTab={setAuthTab}
        authName={authName}
        setAuthName={setAuthName}
        authEmail={authEmail}
        setAuthEmail={setAuthEmail}
        authPassword={authPassword}
        setAuthPassword={setAuthPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        gateError={gateError}
        gateSuccess={gateSuccess}
        onSubmit={handleGateAuthSubmit}
        onGoogleAuthSuccess={handleGateGoogleAuthSuccess}
      />
    </div>
  );
}

export default function ReportPage() {
  return (
    <>
      <Header />
      <main style={{ minHeight: '90vh', background: '#F8FAFC', paddingTop: '100px' }}>
        <Suspense fallback={
          <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="form-card loading-wrap" style={{ border: 'none', boxShadow: 'none' }}>
              <div className="spinner-outer" style={{ margin: '0 auto 24px' }}>
                <div className="spinner-circle"></div>
                <div className="spinner-inner"></div>
              </div>
              <div className="loading-text" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                Loading Report...
              </div>
            </div>
          </div>
        }>
          <ReportContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
