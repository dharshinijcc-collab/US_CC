'use client';

export const dynamic = 'force-dynamic';

import React, { Suspense, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  User, Building, Lightbulb, Compass, Zap, Users, TrendingUp, Cpu, Globe, Brain, 
  ArrowLeft, ArrowRight, Sparkles, Check, X, AlertTriangle, Info, RefreshCw, ChevronRight,
  Mail, Lock, Eye, EyeOff
} from 'lucide-react';
import { ScoringResponse, DIMENSION_META, TRIAGE_CONFIG } from '../types/scoring';
import { supabase } from '@/lib/supabase';


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
  const [activeNotebookPage, setActiveNotebookPage] = useState<'executive' | 'dimensions' | 'memo' | 'risks' | 'roadmap'>('executive');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ dimensions: true, memo: false, flags: false, roadmap: false });
  const toggleSection = (sec: string) => { setExpandedSections(prev => ({ ...prev, [sec]: !prev[sec] })); };

  const roadmapSteps = report?.validation_roadmap || [];
  const next30Days = roadmapSteps.filter(step => {
    const t = step.timeline.toLowerCase();
    return t.includes('week 1') || t.includes('week 2') || t.includes('week 3') || t.includes('week 4') || t.includes('month 1') || t.includes('days') || t.includes('immediate');
  });
  const next90Days = roadmapSteps.filter(step => !next30Days.includes(step));

  const finalNext30 = next30Days.length > 0 ? next30Days : roadmapSteps.slice(0, Math.ceil(roadmapSteps.length / 2));
  const finalNext90 = next90Days.length > 0 ? next90Days : roadmapSteps.slice(Math.ceil(roadmapSteps.length / 2));

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
          // If temp=true, try sessionStorage first (report not yet saved to DB)
          if (isTemp) {
            const cached = sessionStorage.getItem(`cc_report_${id}`);
            if (cached) {
              setReport(JSON.parse(cached));
              setLoading(false);
              return;
            }
          }
          const res = await fetch(`/founder/idea-validator/api?id=${id}`);
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
        // If temp=true, try sessionStorage first (report not yet saved to DB)
        if (isTemp) {
          const cached = sessionStorage.getItem(`cc_report_${id}`);
          if (cached) {
            setReport(JSON.parse(cached));
            setLoading(false);
            return;
          }
        }
        const res = await fetch(`/founder/idea-validator/api?id=${id}`);
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

  // Submit report to CrestCode DB when user clicks the CTA
  const handleSubmitToCrestCode = async () => {
    if (!report) return;
    setSubmitStatus('loading');
    setSubmitError(null);
    try {
      const res = await fetch('/founder/idea-validator/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      // Clear sessionStorage cache now that it's saved
      if (id) sessionStorage.removeItem(`cc_report_${id}`);
      setSubmitStatus('success');
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || 'An unexpected error occurred. Please try again.');
      setSubmitStatus('error');
    }
  };

  const handleGateAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGateError(null);

    // ── Client-side validation ───────────────────────────────
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!authEmail || !emailRegex.test(authEmail)) {
      setGateError('Please enter a valid email address.');
      return;
    }
    if (!authPassword || authPassword.length < 6) {
      setGateError('Password must be at least 6 characters long.');
      return;
    }

    // ── Fallback: Supabase not configured yet ────────────────
    if (!supabase) {
      if (authTab === 'signup') {
        if (!authName || authName.trim().length < 2) {
          setGateError('Please enter your full name.');
          return;
        }
        const usersListRaw = localStorage.getItem('cc_mock_users');
        const usersList = usersListRaw ? JSON.parse(usersListRaw) : [];
        const existingUser = usersList.find((u: any) => u.email.toLowerCase() === authEmail.toLowerCase());
        if (existingUser) {
          setGateError('An account with this email already exists. Please log in instead.');
          setAuthTab('login');
          return;
        }
        usersList.push({ name: authName, email: authEmail, password: authPassword });
        localStorage.setItem('cc_mock_users', JSON.stringify(usersList));
        localStorage.setItem('cc_user_session', JSON.stringify({ name: authName, email: authEmail, isLoggedIn: true }));
        setIsAuthenticated(true);
      } else {
        const usersListRaw = localStorage.getItem('cc_mock_users');
        const usersList = usersListRaw ? JSON.parse(usersListRaw) : [];
        const user = usersList.find((u: any) => u.email.toLowerCase() === authEmail.toLowerCase() && u.password === authPassword);
        if (!user) {
          setGateError('Incorrect email or password. Please try again.');
          return;
        }
        localStorage.setItem('cc_user_session', JSON.stringify({ name: user.name, email: user.email, isLoggedIn: true }));
        setIsAuthenticated(true);
      }
      return;
    }

    setLoading(true);

    // ── SIGN UP (using standard Supabase Auth with verification email) ──
    if (authTab === 'signup') {
      if (!authName || authName.trim().length < 2) {
        setGateError('Please enter your full name.');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
          options: {
            data: {
              full_name: authName,
            },
            emailRedirectTo: `${window.location.origin}/founder/idea-validator/report?id=${id}`,
          },
        });

        if (error) throw error;

        // If email verification is enabled, user may not have an active session yet
        if (data.user && !data.session) {
          setGateSuccess('Registration successful! A verification link has been sent to your email. Please verify your email to unlock your due diligence report.');
          setGateError(null);
        } else if (data.session && data.user) {
          // Logged in automatically
          setIsAuthenticated(true);
          // Link this report to the user
          await fetch('/founder/idea-validator/api', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reportId: id, userId: data.user.id }),
          });
        }
      } catch (err: any) {
        console.error('Signup error:', err);
        setGateError(err.message || 'Signup failed. Please try again.');
      } finally {
        setLoading(false);
      }

    // ── LOG IN (using standard Supabase Auth) ──
    } else {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });

        if (error) {
          if (error.message.toLowerCase().includes('email not confirmed')) {
            throw new Error('Your email address is not verified. Please check your inbox and verify your email.');
          }
          throw error;
        }

        if (data.session && data.user) {
          setIsAuthenticated(true);
          // Link this report to the user
          await fetch('/founder/idea-validator/api', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
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
          <Link href="/founder" className="btn-form-next" style={{ display: 'inline-flex', alignSelf: 'center', textDecoration: 'none', margin: '0 auto' }}>
            <ArrowLeft size={16} />
            <span>Evaluate a New Idea</span>
          </Link>
        </div>
      </div>
    );
  }

  const exportToDoc = () => {
    if (!report) return;

    const dims = DIMENSION_META.map(d => {
      const dim = report.dimensions?.[d.key as keyof typeof report.dimensions];
      if (!dim) return '';
      return `
        <h3>${d.label} &mdash; Score: ${dim.score}/10</h3>
        <p>${dim.why_this_score || ''}</p>
        ${dim.positive_signals?.length ? `<p><strong>Positive Signals:</strong></p><ul>${dim.positive_signals.map(s => `<li>${s}</li>`).join('')}</ul>` : ''}
        ${dim.negative_signals?.length ? `<p><strong>Risk Concerns:</strong></p><ul>${dim.negative_signals.map(s => `<li>${s}</li>`).join('')}</ul>` : ''}
        ${dim.improvement_actions?.length ? `<p><strong>Required Adjustments:</strong></p><ul>${dim.improvement_actions.map(a => `<li>${a}</li>`).join('')}</ul>` : ''}
      `;
    }).join('');

    const redFlags = report.investor_red_flags?.map(f => `<li><strong>${f.flag}</strong> (${f.severity}): ${f.reason}</li>`).join('') || '';
    const riskMatrix = report.risk_matrix ? Object.entries(report.risk_matrix).map(([k, v]: [string, any]) =>
      `<tr><td>${k}</td><td>${v.severity}</td><td>${v.reason}</td><td>${v.mitigation}</td></tr>`
    ).join('') : '';
    const checklist = report.evidence_checklist?.map(c =>
      `<li>[${c.status === 'completed' ? '✓' : c.status === 'partial' ? '~' : '✗'}] ${c.item}: ${c.gap_description}</li>`
    ).join('') || '';
    const roadmapAll = report.validation_roadmap?.map(s =>
      `<li><strong>${s.task}</strong> &mdash; ${s.timeline} | Effort: ${s.effort}<br/>${s.impact}</li>`
    ).join('') || '';

    const documentHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="utf-8">
          <title>Venture Readiness Report</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #0F172A; line-height: 1.6; margin: 48px; }
            h1 { font-size: 26pt; color: #0F172A; font-weight: 800; border-bottom: 2px solid #2563EB; padding-bottom: 8px; margin-bottom: 6px; }
            h2 { font-size: 16pt; color: #1E293B; font-weight: 800; margin-top: 32px; margin-bottom: 10px; border-left: 4px solid #2563EB; padding-left: 10px; }
            h3 { font-size: 13pt; color: #1E293B; font-weight: 700; margin-top: 20px; margin-bottom: 8px; }
            p { margin: 0 0 10px 0; font-size: 11pt; }
            ul { margin: 0 0 12px 16px; } li { margin-bottom: 5px; font-size: 11pt; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th { background: #F1F5F9; font-weight: bold; border: 1px solid #CBD5E1; padding: 10px; text-align: left; font-size: 10pt; }
            td { border: 1px solid #CBD5E1; padding: 10px; font-size: 10pt; }
            .meta { font-size: 9pt; color: #64748B; margin-bottom: 4px; }
            .score-box { display: inline-block; background: #EFF6FF; border: 1px solid #BFDBFE; padding: 6px 14px; border-radius: 4px; font-weight: 800; font-size: 14pt; color: #1D4ED8; margin-bottom: 10px; }
            .section { margin-bottom: 28px; }
            .verdict { background: #F0FDF4; border-left: 4px solid #16A34A; padding: 14px 18px; margin: 16px 0; }
            .risk-high { color: #B91C1C; } .risk-med { color: #D97706; } .risk-low { color: #0F766E; }
          </style>
        </head>
        <body>
          <h1>Investor-Grade Due Diligence Report</h1>
          <p class="meta">Report ID: ${id || 'N/A'} &nbsp;|&nbsp; Generated by CrestCode Venture Studio &nbsp;|&nbsp; Powered by Gemini AI</p>
          <hr/>

          <div class="section">
            <h2>1. Executive Summary</h2>
            <p class="score-box">Readiness Score: ${report.overall_score?.toFixed(1) || '0.0'} / 10</p>
            <p><strong>${(report.overall_score || 0) >= 7.5 ? 'Strong Venture Prospect — Proceed to Build' : (report.overall_score || 0) >= 4.5 ? 'Promising Idea — Needs Validation' : 'High-Risk Concept — Pivot Recommended'}</strong></p>
            <p>${report.startup_summary || report.investor_memo?.executive_summary || ''}</p>
            <div class="verdict">
              <p><strong>AI Strategic Advisory:</strong></p>
              <p>${report.co_founder_recommendations || ''}</p>
            </div>
            ${report.what_increased_the_score?.length ? `<p><strong>Core Strengths:</strong></p><ul>${report.what_increased_the_score.map(s => `<li>${s}</li>`).join('')}</ul>` : ''}
            ${report.what_reduced_the_score?.length ? `<p><strong>Core Risks:</strong></p><ul>${report.what_reduced_the_score.map(s => `<li>${s}</li>`).join('')}</ul>` : ''}
          </div>

          <div class="section">
            <h2>2. Dimension Scores</h2>
            <p><strong>Highest Dimension:</strong> ${report.highest_scoring_dimension || ''} &nbsp;|&nbsp; <strong>Lowest Dimension:</strong> ${report.lowest_scoring_dimension || ''}</p>
            ${dims}
          </div>

          <div class="section">
            <h2>3. VC Investment Memo</h2>
            <p><strong>Biggest Assumption:</strong> ${report.biggest_assumption || ''}</p>
            <h3>Investment Thesis</h3>
            <p>${report.investor_memo?.investment_thesis || ''}</p>
            <h3>Strengths</h3>
            <p>${report.investor_memo?.strengths || ''}</p>
            <h3>Weaknesses</h3>
            <p>${report.investor_memo?.weaknesses || ''}</p>
            <h3>Major Risks</h3>
            <p>${report.investor_memo?.major_risks || ''}</p>
            <h3>Recommendation</h3>
            <p>${report.investor_memo?.recommendation || ''} &mdash; Confidence: ${report.investor_memo?.confidence_rating || ''}</p>
          </div>

          <div class="section">
            <h2>4. Red Flags &amp; Risk Matrix</h2>
            ${redFlags ? `<h3>Venture Red Flags</h3><ul>${redFlags}</ul>` : ''}
            ${riskMatrix ? `<h3>Risk Mitigation Matrix</h3><table><thead><tr><th>Category</th><th>Severity</th><th>Reason</th><th>Mitigation</th></tr></thead><tbody>${riskMatrix}</tbody></table>` : ''}
          </div>

          <div class="section">
            <h2>5. Verification Checklist &amp; Roadmap</h2>
            ${checklist ? `<h3>Evidence Checklist</h3><ul>${checklist}</ul>` : ''}
            ${roadmapAll ? `<h3>Execution Roadmap</h3><ul>${roadmapAll}</ul>` : ''}
          </div>
        </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + documentHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
const link = document.createElement('a');
    link.href = url;
    link.download = `Venture_Readiness_Report_${id || 'report'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="validator-container cc-page-enter" style={{ paddingBottom: '100px', position: 'relative' }}>
      <style dangerouslySetInnerHTML={{ __html: validatorStyles }} />
      <div className="content-box" style={!isAuthenticated ? { filter: 'blur(8px)', pointerEvents: 'none', userSelect: 'none' } : {}}>
        

        {/* Notebook Header Title Row */}
        <div className="dashboard-title-row" style={{ marginBottom: '28px' }}>
          <div>
            <span className="dashboard-subtitle">INTERACTIVE DUE DILIGENCE WORKSPACE</span>
            <h1 className="dashboard-title">Venture Assessment Notebook</h1>
          </div>
          {!report?.is_mock && (
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

        {report?.is_mock ? (
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
            <div className="icon-wrap" style={{
              fontSize: '4rem',
              marginBottom: '24px',
            }}>
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
                </div>
              </div>
            </div>

            {/* Notebook Right Content Area */}
            <div className="notebook-content">
              
              {/* CELL 1: EXECUTIVE VERDICT */}
              <div className={`notebook-cell-panel ${activeNotebookPage === 'executive' ? 'active-cell' : 'hidden-cell'}`}>
                <div className="notebook-cell-header">
                  <span className="cell-title">Executive Summary</span>
                </div>
                <div className="notebook-cell-body">
                  
                  <div className="notebook-score-row">
                    <div className="notebook-score-index">
                      <span className="score-label">READINESS SCORE</span>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                        <span className="score-num-nb">{report?.overall_score?.toFixed(1) || '0.0'}</span>
                        <span className="score-denom-nb">/ 10</span>
                      </div>
                      <div className={`score-badge-nb ${(report?.overall_score || 0) >= 7.5 ? 'strong' : (report?.overall_score || 0) >= 4.5 ? 'needs-val' : 'risk'}`}>
                        {(report?.overall_score || 0) >= 7.5 ? 'Proceed' : (report?.overall_score || 0) >= 4.5 ? 'Needs Work' : 'High Risk'}
                      </div>
                    </div>
                    <div className="notebook-verdict-summary">
                      <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--text-black)' }}>
                        {(report?.overall_score || 0) >= 7.5 ? 'Strong Venture Prospect — Proceed to Build' : (report?.overall_score || 0) >= 4.5 ? 'Promising Idea — Needs Validation' : 'High-Risk Concept — Pivot Recommended'}
                      </h2>
                      <p style={{ fontSize: '0.875rem', lineHeight: '1.5', color: '#334155', margin: 0 }}>
                        {report?.startup_summary || report?.investor_memo?.executive_summary}
                      </p>
                    </div>
                  </div>

                  <div className="notebook-advice-box" style={{ background: '#F0FDF4', borderLeft: '4px solid #16A34A', padding: '16px', borderRadius: '4px', marginTop: '16px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#15803D', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>AI Strategic Advisory</span>
                    <p style={{ fontSize: '0.825rem', color: '#1E3A8A', margin: 0, lineHeight: '1.5' }}>
                      {report?.co_founder_recommendations}
                    </p>
                  </div>
                </div>
              </div>

              {/* CELL 2: DIMENSION RATINGS */}
              <div className={`notebook-cell-panel ${activeNotebookPage === 'dimensions' ? 'active-cell' : 'hidden-cell'}`}>
                <div className="notebook-cell-header">
                  <span className="cell-title">Dimension Scores</span>
                </div>
                <div className="notebook-cell-body">
                  
                  <div className="notebook-dimensions-grid">
                    <div className="notebook-dimensions-list">
                      {DIMENSION_META.map(d => {
                        const dimData = report?.dimensions?.[d.key as keyof typeof report.dimensions] || { score: 0 };
                        const isActive = selectedDimension === d.key;
                        return (
                          <div 
                            key={d.key} 
                            className={`dim-nav-item-nb ${isActive ? 'active' : ''}`}
                            onClick={() => setSelectedDimension(d.key)}
                          >
                            <div className="dim-nav-header">
                              <span className="dim-nav-title">{d.label}</span>
                              <span className="dim-nav-score">{dimData.score}</span>
                            </div>
                            <div className="dim-progress-bg">
                              <div className="dim-progress-fill" style={{ width: `${dimData.score * 10}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {selectedDimension && (() => {
                      const activeDim = report?.dimensions?.[selectedDimension as keyof typeof report.dimensions];
                      const meta = DIMENSION_META.find(d => d.key === selectedDimension)!;
                      if (!activeDim) return null;
                      return (
                        <div className="dim-detail-panel-nb">
                          <div className="dim-detail-title-row">
                            <h4 className="dim-detail-label">{meta.label}</h4>
                            <span className="dim-detail-score-pill">Score: {activeDim.score}/10</span>
                          </div>
                          <p className="dim-detail-prose">{activeDim.why_this_score}</p>
                          
                          <div className="signals-split">
                            <div className="signals-list-box">
                              <h5 className="signals-list-title">Positive Signals</h5>
                              <ul className="signals-ul">
                                {activeDim.positive_signals?.map((sig, idx) => (
                                  <li key={idx} className="signal-li">
                                    <Check className="signal-icon-pos" size={12} />
                                    <span>{sig}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="signals-list-box">
                              <h5 className="signals-list-title font-medium text-red-700">Concerns</h5>
                              <ul className="signals-ul">
                                {activeDim.negative_signals?.map((sig, idx) => (
                                  <li key={idx} className="signal-li">
                                    <X className="signal-icon-neg" size={12} />
                                    <span>{sig}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px dashed #E2E8F0' }}>
                            <h5 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Recommended Improvements</h5>
                            <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.8rem', color: '#334155', lineHeight: '1.6' }}>
                              {activeDim.improvement_actions?.map((act, idx) => (
                                <li key={idx} style={{ marginBottom: '4px' }}>{act}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })()}
                </div>

                {/* Core Strengths & Risks lists */}
                <div className="strengths-risks-split">
                  <div className="sr-card-half strength" style={{ padding: '16px', borderTop: '3px solid #16A34A' }}>
                    <h3 className="sr-title strength-title" style={{ fontSize: '0.8rem', marginBottom: '8px' }}>Core Strengths</h3>
                    <ul className="sr-list" style={{ gap: '6px' }}>
                      {report?.what_increased_the_score?.map((item, idx) => (
                        <li key={idx} className="sr-item" style={{ fontSize: '0.78rem' }}>
                          <span className="sr-bullet">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="sr-card-half risk" style={{ padding: '16px', borderTop: '3px solid #DC2626' }}>
                    <h3 className="sr-title risk-title" style={{ fontSize: '0.8rem', marginBottom: '8px' }}>Core Risks</h3>
                    <ul className="sr-list" style={{ gap: '6px' }}>
                      {report?.what_reduced_the_score?.map((item, idx) => (
                        <li key={idx} className="sr-item" style={{ fontSize: '0.78rem' }}>
                          <span className="sr-bullet">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
            </div>

            {/* CELL 3: VC INVESTMENT MEMO */}
            <div className={`notebook-cell-panel ${activeNotebookPage === 'memo' ? 'active-cell' : 'hidden-cell'}`}>
              <div className="notebook-cell-header">
                <span className="cell-title">VC Investment Memo</span>
              </div>
              <div className="notebook-cell-body">
                
                <div className="warning-assumption-box" style={{ background: '#FFF5F5', borderLeft: '4px solid #B91C1C', padding: '14px', borderRadius: '4px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#B91C1C', marginBottom: '4px' }}>
                    <AlertTriangle size={14} />
                    <span style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.7rem' }}>CRITICAL RISK ASSUMPTION</span>
                  </div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#9B2C2C', margin: '0 0 4px 0' }}>
                    {report?.biggest_assumption}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#742A2A', margin: 0, lineHeight: 1.4 }}>
                    <strong>Required Validation:</strong> {report?.investor_memo?.next_validation_step || report?.missing_evidence}
                  </p>
                </div>

                <div className="memo-section">
                  <div className="memo-tabs">
                    {['summary', 'thesis', 'strengths', 'risks'].map(tab => (
                      <button
                        key={tab}
                        type="button"
                        className={`memo-tab-btn ${memoTab === tab || (tab === 'risks' && memoTab === 'recommendation') ? 'active' : ''}`}
                        onClick={() => setMemoTab(tab as any)}
                      >
                        {tab === 'summary' && 'Executive Summary'}
                        {tab === 'thesis' && 'Investment Thesis'}
                        {tab === 'strengths' && 'Strengths & Weaknesses'}
                        {tab === 'risks' && 'Recommendation'}
                      </button>
                    ))}
                  </div>

                  <div className="memo-content-box" style={{ padding: '16px' }}>
                    {memoTab === 'summary' && (
                      <div>
                        <h4 style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: 6, color: 'var(--text-black)' }}>VC Snapshot Opportunity</h4>
                        <p style={{ fontSize: '0.825rem', margin: 0, lineHeight: 1.5 }}>{report?.investor_memo?.executive_summary}</p>
                      </div>
                    )}
                    {memoTab === 'thesis' && (
                      <div>
                        <h4 style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: 6, color: 'var(--text-black)' }}>VC Investment Thesis</h4>
                        <p style={{ fontSize: '0.825rem', margin: '0 0 10px 0', lineHeight: 1.5 }}>{report?.investor_memo?.investment_thesis}</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          <span>Highest Dimension: <strong>{report?.highest_scoring_dimension}</strong></span>
                          <span>Lowest Dimension: <strong>{report?.lowest_scoring_dimension}</strong></span>
                        </div>
                      </div>
                    )}
                    {memoTab === 'strengths' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div>
                          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#15803D' }}>Valuation Highlights</span>
                          <p style={{ fontSize: '0.825rem', margin: '2px 0 0 0', lineHeight: 1.4 }}>{report?.investor_memo?.strengths}</p>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#B91C1C' }}>Identified Weaknesses</span>
                          <p style={{ fontSize: '0.825rem', margin: '2px 0 0 0', lineHeight: 1.4 }}>{report?.investor_memo?.weaknesses}</p>
                        </div>
                      </div>
                    )}
                    {(memoTab === 'risks' || memoTab === 'recommendation') && (
                      <div>
                        <h4 style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: 6, color: 'var(--text-black)' }}>Analyst Recommendation</h4>
                        <p style={{ fontSize: '0.825rem', marginBottom: '10px', lineHeight: 1.5 }}>{report?.investor_memo?.major_risks}</p>
                        <div className="memo-meta-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', padding: '10px 12px', gap: '10px' }}>
                          <div>
                            <div className="dd-sub-label">Recommendation</div>
                            <div style={{ fontWeight: 800, color: 'var(--accent-blue)', fontSize: '0.8rem' }}>{report?.investor_memo?.recommendation}</div>
                          </div>
                          <div>
                            <div className="dd-sub-label">Confidence</div>
                            <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>{report?.investor_memo?.confidence_rating}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* CELL 4: RED FLAGS & RISKS */}
            <div className={`notebook-cell-panel ${activeNotebookPage === 'risks' ? 'active-cell' : 'hidden-cell'}`}>
              <div className="notebook-cell-header">
                <span className="cell-title">Red Flags & Risks</span>
              </div>
              <div className="notebook-cell-body">
                
                {report?.investor_red_flags && report.investor_red_flags.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '8px' }}>Venture Red Flags</h4>
                    <div className="red-flags-grid" style={{ gridTemplateColumns: '1fr', gap: '8px' }}>
                      {report.investor_red_flags.map((flag, idx) => (
                        <div key={idx} className="red-flag-card-flat" style={{ padding: '10px 12px', borderLeft: flag.severity === 'high' ? '4px solid #B91C1C' : flag.severity === 'medium' ? '4px solid #D97706' : '4px solid #94A3B8' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.825rem' }}>{flag.flag}</span>
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: flag.severity === 'high' ? '#B91C1C' : '#D97706' }}>{flag.severity}</span>
                          </div>
                          <p style={{ fontSize: '0.78rem', color: '#475569', margin: '2px 0 0 0' }}>{flag.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '8px' }}>Risk Mitigation Matrix</h4>
                  <div className="risk-matrix-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    {report?.risk_matrix && Object.entries(report.risk_matrix).map(([key, item]: [string, any]) => (
                      <div key={key} className={`risk-matrix-card ${item.severity}`} style={{ padding: '12px' }}>
                        <div className="risk-card-header" style={{ paddingBottom: '3px', marginBottom: '4px' }}>
                          <span className="risk-card-title" style={{ fontSize: '0.78rem' }}>{key} Risk</span>
                          <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'capitalize', color: item.severity === 'high' ? '#B91C1C' : item.severity === 'medium' ? '#D97706' : '#0F766E' }}>{item.severity}</span>
                        </div>
                        <p className="risk-card-desc" style={{ fontSize: '0.72rem', margin: '0 0 6px 0' }}>{item.reason}</p>
                        <div className="risk-card-mitigation" style={{ fontSize: '0.72rem', padding: '6px' }}>{item.mitigation}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* CELL 5: ROADMAP & CHECKLIST */}
            <div className={`notebook-cell-panel ${activeNotebookPage === 'roadmap' ? 'active-cell' : 'hidden-cell'}`}>
              <div className="notebook-cell-header">
                <span className="cell-title">Roadmap & Checklist</span>
              </div>
              <div className="notebook-cell-body">
                
                {report?.evidence_checklist && (
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '8px' }}>Evidence Checklist</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {report.evidence_checklist.map((c, idx) => (
                        <div key={idx} className="evidence-checklist-row-flat" style={{ padding: '8px 12px', borderLeft: c.status === 'completed' ? '3px solid #15803D' : c.status === 'partial' ? '3px solid #D97706' : '3px solid #B91C1C' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.8rem', color: c.status === 'completed' ? '#15803D' : c.status === 'partial' ? '#D97706' : '#B91C1C' }}>
                              {c.status === 'completed' ? '✓' : c.status === 'partial' ? '⚠' : '✗'}
                            </span>
                            <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>{c.item}</span>
                          </div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{c.gap_description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '8px' }}>Execution Roadmap</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                    <div className="roadmap-phase-card" style={{ padding: '16px' }}>
                      <div className="phase-card-header" style={{ paddingBottom: '6px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '1rem' }}>🎯</span>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 800, margin: 0 }}>Next 30 Days</h4>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {finalNext30.map((step, idx) => (
                          <div key={idx} className="roadmap-step-box-flat" style={{ padding: '10px' }}>
                            <div style={{ fontWeight: 800, fontSize: '0.78rem', color: 'var(--text-black)' }}>{step.task}</div>
                            <div style={{ fontSize: '0.72rem', color: '#475569', margin: '2px 0' }}><strong>Goal:</strong> {step.impact}</div>
                            <div className="step-box-footer-meta" style={{ paddingTop: '4px' }}>
                              <span>Timeline: {step.timeline}</span>
                              <span>Effort: {step.effort}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="roadmap-phase-card" style={{ padding: '16px' }}>
                      <div className="phase-card-header" style={{ paddingBottom: '6px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '1rem' }}>🚀</span>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 800, margin: 0 }}>Next 90 Days</h4>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {finalNext90.map((step, idx) => (
                          <div key={idx} className="roadmap-step-box-flat" style={{ padding: '10px' }}>
                            <div style={{ fontWeight: 800, fontSize: '0.78rem', color: 'var(--text-black)' }}>{step.task}</div>
                            <div style={{ fontSize: '0.72rem', color: '#475569', margin: '2px 0' }}><strong>Goal:</strong> {step.impact}</div>
                            <div className="step-box-footer-meta" style={{ paddingTop: '4px' }}>
                              <span>Timeline: {step.timeline}</span>
                              <span>Effort: {step.effort}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Submit to CrestCode CTA (inside Roadmap tab) ── */}
                {isTemp && (
                  <div style={{ marginTop: '40px', marginBottom: '8px' }}>
                    <div style={{
                      background: '#fff',
                      border: '2px solid #005AE2',
                      borderRadius: '12px',
                      padding: '28px 32px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '24px',
                      flexWrap: 'wrap',
                    }}>
                      <div style={{ flex: 1, minWidth: '240px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#EFF6FF', borderRadius: '20px', padding: '5px 14px', marginBottom: '12px' }}>
                          <Sparkles size={12} color="#005AE2" />
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#005AE2', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Ready to Build?</span>
                        </div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                          Submit Your Idea to CrestCode
                        </h3>
                        <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0', lineHeight: 1.6 }}>
                          Our team will review your validated idea and reach out to discuss how we can help bring it to life — from MVP development to product launch.
                        </p>
                        {submitError && (
                          <p style={{ fontSize: '0.78rem', color: '#DC2626', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <AlertTriangle size={13} /> {submitError}
                          </p>
                        )}
                      </div>
                      <div style={{ flexShrink: 0 }}>
                        {submitStatus === 'success' ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F0FDF4', border: '1.5px solid #86EFAC', borderRadius: '10px', padding: '14px 24px', color: '#166534', fontWeight: 700, fontSize: '0.9rem' }}>
                            <Check size={16} /> Submitted! We'll be in touch.
                          </div>
                        ) : (
                          <button
                            onClick={handleSubmitToCrestCode}
                            disabled={submitStatus === 'loading'}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '8px',
                              background: submitStatus === 'loading' ? '#93C5FD' : '#005AE2',
                              color: '#fff', border: 'none', borderRadius: '10px',
                              padding: '14px 28px', fontWeight: 800, fontSize: '0.9rem',
                              cursor: submitStatus === 'loading' ? 'not-allowed' : 'pointer',
                              whiteSpace: 'nowrap', transition: 'all 0.2s ease',
                            }}
                          >
                            {submitStatus === 'loading' ? 'Submitting…' : 'Submit to CrestCode'}
                            {submitStatus !== 'loading' && <ArrowRight size={16} />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Build Time Estimator CTA (Roadmap tab, always shown as last section) ── */}
                <div style={{ marginTop: '32px', marginBottom: '8px' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #005AE2 0%, #4F46E5 100%)',
                    borderRadius: '12px',
                    padding: '28px 32px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    flexWrap: 'wrap',
                  }}>
                    <div style={{ flex: 1, minWidth: '240px' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', borderRadius: '20px', padding: '5px 14px', marginBottom: '12px' }}>
                        <Zap size={12} color="#fff" />
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Next Step: Estimate Build Time</span>
                      </div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                        🚀 How long will it take to build your product?
                      </h3>
                      <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.9)', margin: '0 0 16px', lineHeight: 1.6 }}>
                        Get a personalised development estimate — MVP Timeline, Team Requirements, Complexity Assessment, Roadmap, and Technical Risks.
                      </p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {['MVP Timeline', 'Team Requirements', 'Complexity', 'Dev Roadmap', 'Tech Risks'].map((tag, i) => (
                          <span key={i} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '12px', padding: '3px 10px', fontSize: '0.7rem', fontWeight: 600, color: '#fff' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      <Link
                        href="/build-time-estimator"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '8px',
                          background: '#fff', color: '#005AE2', borderRadius: '10px',
                          padding: '14px 28px', textDecoration: 'none', fontWeight: 800,
                          fontSize: '0.9rem', whiteSpace: 'nowrap',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                      >
                        Estimate Build Time
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        )}
      </div>


      {/* Auth Gate Overlay */}
      {!isAuthenticated && !isAuthChecking && (
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
                onClick={() => { setAuthTab('signup'); setGateError(null); setGateSuccess(null); }}
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
                onClick={() => { setAuthTab('login'); setGateError(null); setGateSuccess(null); }}
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

            <form onSubmit={handleGateAuthSubmit}>
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
      )}
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



const validatorStyles = `
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');

:root {
  --primary-blue: #1E3A8A;
  --accent-blue: #2563EB;
  --bg-dark: #0F172A;
  --bg-light: #F8FAFC;
  --text-black: #1E293B;
  --text-muted: #64748B;
  --white: #FFFFFF;
  --border-light: #E2E8F0;
  --mono-font: 'Fira Code', monospace;
}

/* ── Scoped Report Typography (only inside .validator-container) ── */
.validator-container h1,
.validator-container h2,
.validator-container h3,
.validator-container h4,
.validator-container h5,
.validator-container h6 {
  font-family: 'Manrope', sans-serif;
  color: var(--text-black);
  margin-top: 0;
}

.validator-container h2 { font-size: 1.35rem; font-weight: 800; margin-bottom: 16px; letter-spacing: -0.02em; }
.validator-container h3 { font-size: 1.05rem; font-weight: 700; margin-bottom: 10px; }
.validator-container h4 { font-size: 0.95rem; font-weight: 700; margin-bottom: 8px; }
.validator-container h5 { font-size: 0.85rem; font-weight: 700; margin-bottom: 6px; }

.validator-container,
.validator-container p,
.validator-container li,
.validator-container span:not(.cc-footer-wrapper span),
.validator-container div:not(.cc-footer-wrapper div) {
  font-family: 'Inter', sans-serif;
}

.validator-container p {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  line-height: 1.65;
  color: #334155;
  margin: 0 0 14px 0;
}

.validator-container li {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #334155;
}


.validator-container {
  padding-top: 90px;
  padding-bottom: 96px;
  min-height: 100vh;
  background: var(--bg-light);
}

.content-box {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 24px;
}

@media (max-width: 768px) {
  .validator-container {
    padding-top: 72px;
    padding-bottom: 64px;
  }
}

/* Dimension nav row — keeps label and score on opposite sides */
.dim-nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

/* Notebook Meta Header */
.doc-meta-header {
  display: flex;
  justify-content: flex-start;
  gap: 32px;
  border-bottom: 1px solid var(--border-light);
  padding-bottom: 12px;
  margin-bottom: 24px;
}

.doc-meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-label {
  font-family: var(--mono-font);
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

.meta-val {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-black);
}

/* Notebook Title Row */
.dashboard-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.dashboard-subtitle {
  font-family: var(--mono-font);
  text-transform: uppercase;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--accent-blue);
  letter-spacing: 0.05em;
  display: block;
}

.dashboard-title {
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 800;
  color: #0F172A;
  margin: 4px 0 0 0;
  letter-spacing: -0.03em;
}

.dashboard-header-actions {
  display: flex;
  gap: 12px;
}

.alert-banner-mock {
  background: #FFFBEB;
  border: 1px solid #FDE68A;
  border-radius: 4px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #92400E;
  font-size: 0.825rem;
}

.alert-icon-mock {
  font-size: 1.1rem;
}

.alert-banner-ai-active {
  background: #EEF2FF;
  border: 1px solid #C7D2FE;
  border-radius: 4px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #3730A3;
  font-size: 0.825rem;
}

.alert-icon-ai-active {
  font-size: 1.1rem;
}

.badge-ai-status {
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: white;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  box-shadow: 0 0 8px rgba(168, 85, 247, 0.3);
}

.badge-mock-status {
  background: #f59e0b;
  color: white;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}

/* ── Notebook Workspace Layout ── */
.notebook-workspace {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 32px;
  align-items: start;
}

.notebook-score-row {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 24px;
  align-items: center;
  margin-bottom: 20px;
}

.notebook-dimensions-grid {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 24px;
}

.strengths-risks-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 20px;
}

@media (max-width: 900px) {
  .notebook-workspace {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .notebook-score-row {
    grid-template-columns: 1fr;
    gap: 16px;
    text-align: center;
  }
  .notebook-score-index {
    max-width: 240px;
    margin: 0 auto;
    width: 100%;
  }
  .notebook-dimensions-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

@media (max-width: 600px) {
  .strengths-risks-split {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

/* Left Sidebar Navigation */
.notebook-sidebar {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: 16px;
  position: sticky;
  top: 100px;
}

.sidebar-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-group-title {
  font-family: var(--mono-font);
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

.sidebar-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sidebar-item-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;
}

.sidebar-item-btn:hover {
  background-color: var(--bg-light);
}

.sidebar-item-btn.active {
  background-color: #F0F6FF;
  border-left: 3px solid var(--accent-blue) !important;
  border-radius: 0 4px 4px 0;
}

.cell-num {
  font-family: var(--mono-font);
  font-size: 0.72rem;
  color: var(--text-muted);
  font-weight: 600;
}

.sidebar-item-btn.active .cell-num {
  color: var(--accent-blue);
}

.cell-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-black);
}

.sidebar-item-btn.active .cell-name {
  color: var(--accent-blue);
}

/* Notebook Right Content Area */
.notebook-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.notebook-cell-panel {
  display: none;
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  overflow: hidden;
}

.notebook-cell-panel.active-cell {
  display: block;
  animation: ccFadeIn 0.25s ease forwards;
}

.notebook-cell-panel.hidden-cell {
  display: none;
}

.notebook-cell-header {
  background: #FFFFFF;
  border-bottom: 1px solid var(--border-light);
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.cell-in-tag {
  font-family: var(--mono-font);
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--accent-blue);
}

.cell-out-tag {
  font-family: var(--mono-font);
  font-size: 0.78rem;
  font-weight: 600;
  color: #B91C1C;
}

.cell-title {
  font-size: 1rem;
  font-weight: 800;
  color: var(--text-black);
  letter-spacing: -0.01em;
}

.notebook-cell-body {
  padding: 24px;
}

/* Notebook Score Design */
.notebook-score-index {
  border: 1px solid var(--border-light);
  border-radius: 6px;
  padding: 16px;
  text-align: center;
  background: #FAFAFA;
}

.score-label {
  font-family: var(--mono-font);
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--text-muted);
  display: block;
  margin-bottom: 4px;
}

.score-num-nb {
  font-size: 2.75rem;
  font-weight: 800;
  color: #0F172A;
  line-height: 1;
}

.score-denom-nb {
  font-size: 1rem;
  color: var(--text-muted);
  font-weight: 600;
}

.score-badge-nb {
  margin-top: 8px;
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 3px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.score-badge-nb.strong { background: #DCFCE7; color: #15803D; }
.score-badge-nb.needs-val { background: #FEF3C7; color: #D97706; }
.score-badge-nb.risk { background: #FEE2E2; color: #B91C1C; }

/* Dimensions list */
.dim-nav-item-nb {
  background-color: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 6px;
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 8px;
}

.dim-nav-item-nb:hover { border-color: var(--accent-blue); }
.dim-nav-item-nb.active {
  border-color: var(--border-light);
  border-left: 3px solid var(--accent-blue) !important;
  background-color: var(--bg-light);
}

.dim-progress-bg {
  width: 100%;
  height: 4px;
  background-color: #E2E8F0;
  border-radius: 2px;
  overflow: hidden;
}

.dim-progress-fill {
  height: 100%;
  background-color: var(--accent-blue);
  border-radius: 2px;
}

.dim-detail-panel-nb {
  background-color: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 6px;
  padding: 16px;
}

.dim-detail-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-light);
  padding-bottom: 8px;
  margin-bottom: 10px;
}

.dim-detail-label {
  font-size: 0.95rem;
  font-weight: 800;
  margin: 0;
}

.dim-detail-score-pill {
  font-size: 0.72rem;
  font-weight: 800;
  background: #F0F6FF;
  color: var(--accent-blue);
  padding: 3px 6px;
  border-radius: 3px;
}

.dim-detail-prose {
  font-size: 0.8rem;
  color: #475569;
  line-height: 1.45;
  margin-bottom: 12px;
}

.signals-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 12px;
}

.signals-list-title {
  font-family: var(--mono-font);
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
}

.signals-ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.signal-li {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  font-size: 0.75rem;
  color: #334155;
  line-height: 1.35;
}

.signal-icon-pos {
  color: #15803D;
  flex-shrink: 0;
  margin-top: 1px;
}

.signal-icon-neg {
  color: #B91C1C;
  flex-shrink: 0;
  margin-top: 1px;
}

.actions-box {
  background-color: #F8FAFC;
  border: 1px solid var(--border-light);
  border-radius: 4px;
  padding: 10px;
}

.actions-box-title {
  font-family: var(--mono-font);
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--text-black);
}

/* Strengths and Risks */
.sr-card-half {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 6px;
}

.sr-title {
  font-family: var(--mono-font);
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.strength-title { color: #15803D; }
.risk-title { color: #B91C1C; }

.sr-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.sr-item {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  line-height: 1.35;
}

.sr-bullet {
  font-weight: 800;
}

.strength .sr-bullet { color: #16A34A; }
.risk .sr-bullet { color: #DC2626; }

/* Due Diligence Memo */
.memo-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-light);
  gap: 4px;
  margin-bottom: 12px;
}

.memo-tab-btn {
  padding: 6px 10px;
  font-weight: 700;
  font-size: 0.78rem;
  color: var(--text-muted);
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.15s ease;
}

.memo-tab-btn:hover { color: var(--text-black); }
.memo-tab-btn.active { color: var(--accent-blue); border-bottom-color: var(--accent-blue); }

.memo-content-box {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 6px;
}

.memo-meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
  background: var(--bg-light);
  padding: 8px 12px;
  border-radius: 4px;
}

.dd-sub-label {
  font-family: var(--mono-font);
  font-size: 0.625rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
}

/* Red flags */
.red-flag-card-flat {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 4px;
}

/* Risk Matrix */
.risk-matrix-card {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 4px;
}

.risk-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-light);
}

.risk-card-title {
  font-weight: 800;
  color: var(--text-black);
}

.risk-card-desc {
  color: var(--text-muted);
  line-height: 1.35;
}

.risk-card-mitigation {
  color: var(--text-black);
  line-height: 1.3;
  background: #F1F5F9;
  border-radius: 3px;
}

/* Checklist and Roadmap */
.evidence-checklist-row-flat {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid var(--border-light);
  border-radius: 4px;
  background: var(--white);
}

.roadmap-phase-card {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 6px;
}

.phase-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid var(--border-light);
}

.roadmap-step-box-flat {
  background: var(--bg-light);
  border: 1px solid var(--border-light);
  border-radius: 4px;
}

.step-box-footer-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.65rem;
  color: var(--text-muted);
  border-top: 1px solid var(--border-light);
}

/* Buttons */
.btn-results-call {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: var(--accent-blue);
  color: var(--white);
  padding: 10px 18px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.85rem;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;
}

.btn-results-call:hover {
  background-color: #1d4ed8;
}

.btn-results-outline {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: var(--white);
  color: var(--text-black);
  border: 1px solid var(--border-light);
  padding: 10px 18px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.15s ease;
  text-decoration: none;
}

.btn-results-outline:hover {
  border-color: var(--text-muted);
  background-color: #FAFAFA;
}

/* Auth Gate Overlay */
.auth-gate-overlay-fixed {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 160px;
  background-color: rgba(248, 250, 252, 0.4);
  z-index: 100;
}

@keyframes ccFadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.cc-page-enter {
  animation: ccFadeIn 0.25s ease forwards;
}
`;
