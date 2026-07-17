'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { 
  Lightbulb, Compass, Zap, Users, ShieldAlert, Sparkles, Check, 
  AlertTriangle, RefreshCw, ChevronRight, ExternalLink, ArrowLeft, BarChart3, MessageSquare, AlertCircle,
  Key, Globe, Brain, Target, Layers
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { api } from '@/services/api';

interface UserSession {
  email: string;
  name: string;
  isLoggedIn: boolean;
}

export default function SocialValidationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id');

  // Page States: 'form' | 'loading' | 'results'
  const [pageState, setPageState] = useState<'form' | 'loading' | 'results'>('form');
  const [loadingText, setLoadingText] = useState<string>('Initializing SVE validation pipeline...');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [pipelineStartTime, setPipelineStartTime] = useState<number | null>(null);
  const [serverStatus, setServerStatus] = useState<'pending' | 'done' | 'failed'>('pending');
  const [projectId, setProjectId] = useState<string | null>(initialId);
  const [currentStageId, setCurrentStageId] = useState<string>('init');
  const [error, setError] = useState<string | null>(null);

  // Form Inputs
  const [ideaText, setIdeaText] = useState<string>('');
  const [ideaName, setIdeaName] = useState<string>('');
  const [targetAudience, setTargetAudience] = useState<string>('');

  // Auth Gate
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [authTab, setAuthTab] = useState<'signup' | 'login'>('signup');
  const [authName, setAuthName] = useState<string>('');
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [session, setSession] = useState<UserSession | null>(null);

  // Report Data
  const [reportData, setReportData] = useState<any>(null);
  const [expandedPainPoints, setExpandedPainPoints] = useState<Record<number, boolean>>({});

  // Fetch session on load
  useEffect(() => {
    if (!supabase) {
      const savedSession = localStorage.getItem('cc_user_session');
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession);
          if (parsed?.isLoggedIn) {
            setIsAuthenticated(true);
            setSession(parsed);
          }
        } catch {}
      }
      setIsAuthChecking(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        setSession({
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          isLoggedIn: true
        });
      }
      setIsAuthChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        setSession({
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          isLoggedIn: true
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Elapsed seconds timer — ticks every second while loading
  useEffect(() => {
    if (pageState !== 'loading' || pipelineStartTime === null) return;
    const tick = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - pipelineStartTime) / 1000));
    }, 1000);
    return () => clearInterval(tick);
  }, [pageState, pipelineStartTime]);

  // If initial ID is provided, load or poll
  useEffect(() => {
    if (initialId) {
      checkProjectStatus(initialId);
    }
  }, [initialId]);

  const checkProjectStatus = async (projId: string) => {
    setPageState('loading');
    setProjectId(projId);
    const startTs = Date.now();
    setPipelineStartTime(startTs);
    setElapsedSeconds(0);
    setServerStatus('pending');
    setCurrentStageId('init');

    let attempts = 0;
    const MAX_ATTEMPTS = 150; // 5 minutes (150 × 2s)

    const interval = setInterval(async () => {
      attempts++;

      try {
        const statusRes = await api.get(`social-validation/status?id=${projId}`);
        const statusData = statusRes.data;

        if (statusData.current_stage) {
          setCurrentStageId(statusData.current_stage);
        }

        if (statusData.status === 'done') {
          clearInterval(interval);
          setServerStatus('done');
          loadReport(projId);
        } else if (statusData.status === 'failed') {
          clearInterval(interval);
          setServerStatus('failed');
          const stage = statusData.failed_stage || 'unknown';
          const stageMessages: Record<string, string> = {
            keyword_generator: 'Failed to generate keywords — Gemini API may be unavailable.',
            reddit_collector: 'No posts found. HN & Product Hunt returned no results for this idea topic.',
            pain_point_extractor: 'Failed to extract pain points from collected posts.',
            validation_engine: 'Failed to compute the validation score.'
          };
          setError(stageMessages[stage] || `Pipeline failed at stage: ${stage}`);
          setPageState('form');
        } else if (attempts >= MAX_ATTEMPTS) {
          clearInterval(interval);
          setError('Validation is taking longer than expected. The pipeline may still be running — refresh in a moment.');
          setPageState('form');
        }
        // status === 'pending' → keep polling silently
      } catch {
        // Silently swallow poll errors — only stop at max attempts
        if (attempts >= MAX_ATTEMPTS) {
          clearInterval(interval);
          setError('Could not reach the server. Please check your connection and try again.');
          setPageState('form');
        }
      }
    }, 2000);
  };

  const loadReport = async (projId: string) => {
    try {
      const res = await api.get(`social-validation?id=${projId}`);
      if (res.data && res.data.social_validation) {
        setReportData(res.data.social_validation);
        setPageState('results');
      } else {
        throw new Error("No social validation data available in the report");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'Failed to load compiled validation report.');
      setPageState('form');
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!authEmail || !authPassword) {
      setError('Please fill in all auth fields.');
      return;
    }

    if (authTab === 'signup' && !authName) {
      setError('Please enter your full name.');
      return;
    }

    if (supabase) {
      try {
        if (authTab === 'signup') {
          const { data, error } = await supabase.auth.signUp({
            email: authEmail,
            password: authPassword,
            options: { data: { full_name: authName } }
          });
          if (error) throw error;
          if (data.user) {
            setIsAuthenticated(true);
            setSession({ email: authEmail, name: authName, isLoggedIn: true });
          }
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: authEmail,
            password: authPassword
          });
          if (error) throw error;
          if (data.user) {
            setIsAuthenticated(true);
            setSession({ email: authEmail, name: data.user.user_metadata?.full_name || authEmail.split('@')[0], isLoggedIn: true });
          }
        }
      } catch (err: any) {
        setError(err.message || 'Authentication failed.');
      }
    } else {
      // Mock Fallback
      const userSession = { email: authEmail, name: authName || authEmail.split('@')[0], isLoggedIn: true };
      localStorage.setItem('cc_user_session', JSON.stringify(userSession));
      setSession(userSession);
      setIsAuthenticated(true);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!ideaText || ideaText.trim().length < 20) {
      setError('Please describe your startup idea in at least 20 characters.');
      return;
    }

    const payloadAnswers = {
      customer: targetAudience || 'General Audience',
      problem: 'Social Validation Request',
      pain_score: 5,
      validation_level: 'none',
      competitors: 'Discovered dynamically',
      moat: 'None',
      solo_founder: true,
      technical_background: 'no',
      current_stage: 'forming',
      launch_timeline: 'Immediate',
      funding_status: 'bootstrapped',
      contact_name: session?.name || 'Anonymous',
      contact_email: session?.email || 'anonymous@crestcode.com',
    };

    setPageState('loading');
    setLoadingText('Initializing validation pipeline...');

    try {
      const res = await api.post('social-validation', {
        ideaText,
        ideaName,
        targetAudience,
        contactName: session?.name || 'Anonymous',
        contactEmail: session?.email || 'anonymous@crestcode.com'
      });
      if (res.data && res.data.id) {
        // If mock/no-db: status is already 'done', load directly
        if (res.data.status === 'done' && res.data.social_validation) {
          setReportData(res.data.social_validation);
          setPageState('results');
        } else {
          checkProjectStatus(res.data.id);
        }
      } else {
        throw new Error('No project ID returned from API.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'Failed to submit idea to SVE.');
      setPageState('form');
    }
  };

  const togglePainPoint = (idx: number) => {
    setExpandedPainPoints(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <>
      <Header />
      <style dangerouslySetInnerHTML={{ __html: sveStyles }} />

      <main className="sve-root">
        <div className="sve-container">
          
          {/* Header */}
          <div className="sve-header">
            <span className="sve-tag">
              <Sparkles size={14} />
              <span>Social Validation Engine</span>
            </span>
            <h1>Grounded Market Intel</h1>
            <p>
              Scrape forum discussions, identify user struggles, and map competitive gaps with our AI-powered qualitative analyzer.
            </p>
          </div>

          {error && (
            <div className="sve-error-banner">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {/* PAGE STATE: FORM & AUTH GATE */}
          {pageState === 'form' && (
            <div className="sve-card glass-panel fade-in">
              {!isAuthenticated && !isAuthChecking ? (
                // Auth Wall
                <div className="sve-auth-gate">
                  <div className="auth-header">
                    <h3>Unlock the Validation Engine</h3>
                    <p>Create a free account or login to access the scraper and database.</p>
                  </div>
                  
                  <div className="auth-tabs">
                    <button className={authTab === 'signup' ? 'active' : ''} onClick={() => setAuthTab('signup')}>Sign Up</button>
                    <button className={authTab === 'login' ? 'active' : ''} onClick={() => setAuthTab('login')}>Log In</button>
                  </div>

                  <form onSubmit={handleAuthSubmit} className="auth-form">
                    {authTab === 'signup' && (
                      <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" placeholder="e.g. Jane Doe" value={authName} onChange={e => setAuthName(e.target.value)} required />
                      </div>
                    )}
                    <div className="form-group">
                      <label>Email Address</label>
                      <input type="email" placeholder="you@example.com" value={authEmail} onChange={e => setAuthEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label>Password</label>
                      <input type="password" placeholder="••••••••" value={authPassword} onChange={e => setAuthPassword(e.target.value)} required />
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
          )}

          {/* PAGE STATE: LOADING / POLLING */}
          {pageState === 'loading' && (() => {
            // Pipeline stages mapping backend stage IDs to labels/subtexts and icons
            const stages = [
              { id: 'init',                 icon: Zap,           label: 'Pipeline Initialized',         sub: 'Project created, validation pipeline starting up' },
              { id: 'keyword_generation',   icon: Key,           label: 'Generating Search Keywords',    sub: 'Gemini AI extracts problem-framed query keywords' },
              { id: 'collecting',           icon: Globe,         label: 'Harvesting Forum Discussions',  sub: 'Scraping HN & Product Hunt for real user posts' },
              { id: 'extracting_pain_points',icon: Brain,         label: 'Extracting Customer Pain Points', sub: 'AI reads every post and maps user struggles' },
              { id: 'sentiment_tagging',    icon: MessageSquare, label: 'Analyzing Buying Intent',       sub: 'Tagging posts with active search & buying signals' },
              { id: 'competitor_discovery', icon: Target,        label: 'Discovering Competitors',       sub: 'Gemini web search locates market alternatives' },
              { id: 'feature_mapping',      icon: Layers,        label: 'Mapping Feature Gaps',          sub: 'Identifies capabilities users are asking for' },
              { id: 'scoring',              icon: BarChart3,     label: 'Computing Validation Score',    sub: 'Weighing pain frequency and competitive gaps' },
            ];

            const activeIdx = stages.findIndex(s => s.id === currentStageId);
            const activeStageIdx = activeIdx === -1 ? 0 : activeIdx;
            
            // Calculate a clean progress percentage based on active stage index
            const progressPct = Math.round(((activeStageIdx + 1) / stages.length) * 100);

            return (
              <div className="sve-pipeline-loader fade-in">
                {/* Header */}
                <div className="pipeline-header">
                  <div className="pipeline-logo">
                    <Compass size={22} />
                  </div>
                  <div>
                    <h2>Social Validation Engine Running</h2>
                    <p>AI is scanning forums and analyzing market signals for your idea</p>
                  </div>
                  <div className="pipeline-timer">
                    <span>{Math.floor(elapsedSeconds / 60)}:{String(elapsedSeconds % 60).padStart(2, '0')}</span>
                    <small>elapsed</small>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="pipeline-progress-track">
                  <div className="pipeline-progress-fill" style={{ width: `${progressPct}%` }} />
                  <span className="pipeline-progress-label">{progressPct}% complete</span>
                </div>

                {/* Stage steps */}
                <div className="pipeline-steps">
                  {stages.map((stage, idx) => {
                    const isDone    = idx < activeStageIdx;
                    const isActive  = idx === activeStageIdx;
                    const isPending = idx > activeStageIdx;
                    const IconComponent = stage.icon;

                    return (
                      <div key={stage.id} className={`pipeline-step ${
                        isDone ? 'step-done' : isActive ? 'step-active' : 'step-pending'
                      }`}>
                        <div className="step-icon-wrap">
                          {isDone ? (
                            <Check size={16} />
                          ) : isActive ? (
                            <RefreshCw size={16} className="spin-icon" />
                          ) : (
                            <IconComponent size={16} />
                          )}
                        </div>
                        <div className="step-body">
                          <div className="step-label">
                            <span>{stage.label}</span>
                            {isDone && <span className="step-badge done">Done</span>}
                            {isActive && <span className="step-badge active">Running...</span>}
                          </div>
                          {(isActive || isDone) && <p className="step-sub">{stage.sub}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Current action text */}
                <div className="pipeline-current-action">
                  <AlertTriangle size={14} />
                  <span>This typically takes <strong>2–3 minutes</strong> — please keep this tab open</span>
                </div>
              </div>
            );
          })()}

          {/* PAGE STATE: RESULTS DASHBOARD */}
          {pageState === 'results' && reportData && (
            <div className="sve-dashboard fade-in">
              
              {/* Score summary panel */}
              <div className="sve-card score-panel glass-panel">
                <div className="score-header">
                  <div className="score-wheel">
                    <span className="score-num">{reportData.validation_score}</span>
                    <span className="score-max">/100</span>
                  </div>
                  <div className="score-meta">
                    <span className="score-label">VALIDATION VERDICT</span>
                    <h2>{reportData.verdict}</h2>
                  </div>
                </div>
                <p className="score-reasoning">{reportData.reasoning}</p>
                <button className="sve-btn secondary" onClick={() => { setPageState('form'); setIdeaText(''); setIdeaName(''); setTargetAudience(''); }}>
                  <ArrowLeft size={16} />
                  <span>Analyze Another Idea</span>
                </button>
              </div>

              {/* Grid of details */}
              <div className="dashboard-grid">
                
                {/* Section: Pain Points */}
                <div className="sve-card glass-panel grid-cell">
                  <div className="cell-header">
                    <MessageSquare size={18} className="blue-icon" />
                    <h3>Mined User Pain Points</h3>
                  </div>
                  <div className="pain-points-list">
                    {reportData.pain_points && reportData.pain_points.length > 0 ? (
                      reportData.pain_points.map((pp: any, idx: number) => (
                        <div key={idx} className="pain-point-item">
                          <div className="pp-summary" onClick={() => togglePainPoint(idx)}>
                            <div className="pp-main">
                              <span className="pp-title">{pp.pain_point}</span>
                              <span className="pp-mentions">{pp.mentions} {pp.mentions === 1 ? 'mention' : 'mentions'}</span>
                            </div>
                            <div className="pp-side">
                              <span className={`pp-badge severity-${pp.severity || 3}`}>
                                Severity: {pp.severity || 3}/5
                              </span>
                              <ChevronRight size={16} className={`arrow ${expandedPainPoints[idx] ? 'expanded' : ''}`} />
                            </div>
                          </div>
                          
                          {expandedPainPoints[idx] && (
                            <div className="pp-details">
                              <span className="evidence-title">Evidencing Posts:</span>
                              {pp.sources && pp.sources.length > 0 ? (
                                <ul>
                                  {pp.sources.map((url: string, uidx: number) => (
                                    <li key={uidx}>
                                      <a href={url} target="_blank" rel="noopener noreferrer">
                                        <span>{url}</span>
                                        <ExternalLink size={12} />
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="no-sources">No source links available.</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">No pain points surfaced from public forums.</div>
                    )}
                  </div>
                </div>

                {/* Section: Competitors */}
                <div className="sve-card glass-panel grid-cell">
                  <div className="cell-header">
                    <Compass size={18} className="blue-icon" />
                    <h3>Verified Competitors</h3>
                  </div>
                  <div className="competitors-list">
                    {reportData.competitors && reportData.competitors.length > 0 ? (
                      reportData.competitors.map((c: any, idx: number) => (
                        <div key={idx} className="competitor-item">
                          <div className="comp-header">
                            <span className="comp-name">{c.name}</span>
                            <a href={c.source_url} target="_blank" rel="noopener noreferrer" className="comp-link">
                              <span>Source</span>
                              <ExternalLink size={12} />
                            </a>
                          </div>
                          {c.website && <span className="comp-web">{c.website}</span>}
                          {c.missing_features && c.missing_features.length > 0 && (
                            <div className="comp-gaps">
                              <span className="gaps-title">Unmet Needs / Missing Features:</span>
                              <div className="gap-badges">
                                {c.missing_features.map((f: string, fidx: number) => (
                                  <span key={fidx} className="gap-badge">{f}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">No competitor entries verified on the web.</div>
                    )}
                  </div>
                </div>

                {/* Section: Feature Requests */}
                <div className="sve-card glass-panel grid-cell full-width">
                  <div className="cell-header">
                    <BarChart3 size={18} className="blue-icon" />
                    <h3>Surfaced Feature Demands</h3>
                  </div>
                  <div className="features-grid">
                    {reportData.feature_requests && reportData.feature_requests.length > 0 ? (
                      reportData.feature_requests.map((f: any, idx: number) => (
                        <div key={idx} className="feature-item">
                          <div className="feat-main">
                            <span className="feat-name">{f.feature_name}</span>
                            <span className="feat-mentions">{f.mentions} {f.mentions === 1 ? 'request' : 'requests'}</span>
                          </div>
                          <span className={`feat-priority prio-${f.priority || 'low'}`}>
                            {f.priority || 'low'} priority
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">No feature requests extracted.</div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}

const sveStyles = `
  .sve-root {
    background-color: #F8FAFC;
    min-height: 100vh;
    padding-top: 120px;
    padding-bottom: 80px;
    color: #0F172A;
    font-family: 'Inter', sans-serif;
  }
  .sve-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 24px;
  }
  .sve-header {
    text-align: center;
    margin-bottom: 40px;
  }
  .sve-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background-color: #E6EFFF;
    color: #005AE2;
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    padding: 6px 12px;
    border-radius: 100px;
    text-transform: uppercase;
    margin-bottom: 16px;
  }
  .sve-header h1 {
    font-size: clamp(2rem, 5vw, 2.75rem);
    font-weight: 800;
    color: #0F172A;
    margin: 0 0 12px;
    letter-spacing: -0.03em;
    font-family: 'Manrope', sans-serif;
  }
  .sve-header p {
    color: #64748B;
    font-size: 1rem;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
  .sve-card {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 20px;
    padding: 32px;
    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.04);
  }
  .glass-panel {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(10px);
  }
  
  /* Form components */
  .sve-main-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .form-group label {
    font-size: 0.9rem;
    font-weight: 700;
    color: #334155;
  }
  .form-group label .req {
    color: #EF4444;
  }
  .form-group textarea, .form-group input {
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    border: 1.5px solid #E2E8F0;
    outline: none;
    font-size: 0.925rem;
    font-family: inherit;
    transition: all 0.2s;
  }
  .form-group textarea {
    min-height: 120px;
    resize: vertical;
  }
  .form-group textarea:focus, .form-group input:focus {
    border-color: #005AE2;
    box-shadow: 0 0 0 4px rgba(0, 90, 226, 0.08);
  }
  .form-group small {
    color: #94A3B8;
    font-size: 0.775rem;
  }
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  @media(max-width: 600px) {
    .form-row {
      grid-template-columns: 1fr;
    }
  }

  /* Auth Wall */
  .sve-auth-gate {
    max-width: 420px;
    margin: 0 auto;
    padding: 10px 0;
  }
  .auth-header {
    text-align: center;
    margin-bottom: 24px;
  }
  .auth-header h3 {
    font-family: 'Manrope', sans-serif;
    font-size: 1.25rem;
    font-weight: 800;
    margin: 0 0 6px;
  }
  .auth-header p {
    font-size: 0.875rem;
    color: #64748B;
    margin: 0;
  }
  .auth-tabs {
    display: flex;
    background-color: #F1F5F9;
    padding: 4px;
    border-radius: 8px;
    margin-bottom: 24px;
  }
  .auth-tabs button {
    flex: 1;
    border: none;
    background: transparent;
    padding: 8px;
    font-weight: 600;
    font-size: 0.85rem;
    color: #64748B;
    border-radius: 6px;
    cursor: pointer;
  }
  .auth-tabs button.active {
    background-color: #FFFFFF;
    color: #0F172A;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* Buttons */
  .sve-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-weight: 700;
    font-size: 0.9rem;
    padding: 14px 28px;
    border-radius: 12px;
    cursor: pointer;
    border: none;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .sve-btn.primary {
    background-color: #005AE2;
    color: #FFFFFF;
  }
  .sve-btn.primary:hover {
    background-color: #004ac2;
    transform: translateY(-1px);
  }
  .sve-btn.secondary {
    background-color: #F1F5F9;
    color: #475569;
  }
  .sve-btn.secondary:hover {
    background-color: #E2E8F0;
  }
  .glow-btn {
    box-shadow: 0 8px 20px -6px rgba(0, 90, 226, 0.35);
  }
  .glow-btn:hover {
    box-shadow: 0 12px 24px -6px rgba(0, 90, 226, 0.5);
  }

  /* Loader */
  .loader-panel {
    text-align: center;
    padding: 60px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .pulse-spinner {
    width: 72px;
    height: 72px;
    border-radius: 100px;
    background-color: #E6EFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #005AE2;
    margin-bottom: 24px;
    box-shadow: 0 0 0 10px rgba(0, 90, 226, 0.04);
    animation: pulseGlow 1.5s infinite ease-in-out;
  }
  .spin-icon {
    animation: rotate 2s infinite linear;
  }
  .loader-panel h3 {
    font-family: 'Manrope', sans-serif;
    font-size: 1.5rem;
    font-weight: 800;
    margin: 0 0 8px;
  }
  .loader-panel p {
    color: #64748B;
    margin: 0 0 32px;
    font-size: 0.95rem;
    max-width: 380px;
  }
  /* ── Pipeline Loader (Light Theme) ────────────────────────────── */
  .sve-pipeline-loader {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 16px;
    padding: 32px;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03);
  }

  /* Header */
  .pipeline-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
  }
  .pipeline-logo {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: #F0F7FF;
    border: 1px solid #DBEAFE;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #005AE2;
    flex-shrink: 0;
  }
  .pipeline-header > div:nth-child(2) {
    flex: 1;
  }
  .pipeline-header h2 {
    font-family: 'Manrope', sans-serif;
    font-size: 1.15rem;
    font-weight: 800;
    color: #0F172A;
    margin: 0 0 2px;
  }
  .pipeline-header > div:nth-child(2) p {
    font-size: 0.8rem;
    color: #64748B;
    margin: 0;
  }
  .pipeline-timer {
    text-align: right;
    flex-shrink: 0;
  }
  .pipeline-timer span {
    font-size: 1.3rem;
    font-weight: 700;
    color: #005AE2;
    display: block;
    font-variant-numeric: tabular-nums;
    font-family: Menlo, Monaco, Consolas, monospace;
  }
  .pipeline-timer small {
    font-size: 0.68rem;
    color: #94A3B8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Progress bar */
  .pipeline-progress-track {
    background: #F1F5F9;
    border-radius: 100px;
    height: 6px;
    position: relative;
    margin-bottom: 6px;
    overflow: hidden;
  }
  .pipeline-progress-fill {
    height: 100%;
    border-radius: 100px;
    background: #005AE2;
    transition: width 1s ease;
  }
  .pipeline-progress-label {
    font-size: 0.72rem;
    color: #64748B;
    display: block;
    text-align: right;
    margin-bottom: 20px;
    font-weight: 600;
  }

  /* Steps */
  .pipeline-steps {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 20px;
  }
  .pipeline-step {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 10px;
    border: 1px solid transparent;
    transition: all 0.3s ease;
  }
  .pipeline-step.step-done {
    background: #F0FDF4;
    border-color: #DCFCE7;
  }
  .pipeline-step.step-active {
    background: #F0F7FF;
    border-color: #DBEAFE;
  }
  .pipeline-step.step-pending {
    background: #F8FAFC;
    border-color: #F1F5F9;
    opacity: 0.6;
  }

  /* Step icon */
  .step-icon-wrap {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }
  .step-done .step-icon-wrap {
    background: #DCFCE7;
    color: #10B981;
  }
  .step-active .step-icon-wrap {
    background: #DBEAFE;
    color: #005AE2;
  }
  .step-pending .step-icon-wrap {
    background: #E2E8F0;
    color: #94A3B8;
  }

  /* Step body */
  .step-body {
    flex: 1;
    min-width: 0;
  }
  .step-label {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .step-label span {
    font-size: 0.85rem;
    font-weight: 700;
  }
  .step-done .step-label span { color: #334155; }
  .step-active .step-label span { color: #0F172A; }
  .step-pending .step-label span { color: #94A3B8; }

  .step-sub {
    font-size: 0.75rem;
    color: #64748B;
    margin: 3px 0 0;
    line-height: 1.4;
  }
  .step-active .step-sub { color: #475569; }

  /* Badges */
  .step-badge {
    font-size: 0.65rem;
    font-weight: 700;
    padding: 1px 6px;
    border-radius: 100px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .step-badge.done {
    background: #DCFCE7;
    color: #15803D;
  }
  .step-badge.active {
    background: #DBEAFE;
    color: #1D4ED8;
    animation: pulse-badge 1.5s ease-in-out infinite;
  }
  @keyframes pulse-badge {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }

  /* Bottom notice */
  .pipeline-current-action {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.75rem;
    color: #64748B;
    background: #F8FAFC;
    border-radius: 8px;
    padding: 8px 12px;
    border: 1px solid #E2E8F0;
  }
  .pipeline-current-action strong { color: #334155; }




  /* Errors */
  .sve-error-banner {
    display: flex;
    gap: 12px;
    align-items: center;
    background-color: #FEF2F2;
    border: 1px solid #FCA5A5;
    color: #991B1B;
    padding: 16px;
    border-radius: 12px;
    font-size: 0.9rem;
    margin-bottom: 24px;
    font-weight: 600;
  }

  /* Dashboard Panel */
  .sve-dashboard {
    display: flex;
    flex-direction: column;
    gap: 28px;
  }
  .score-panel {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 36px;
  }
  .score-header {
    display: flex;
    align-items: center;
    gap: 28px;
    flex-wrap: wrap;
  }
  .score-wheel {
    width: 100px;
    height: 100px;
    border-radius: 100px;
    background: radial-gradient(circle, #FFFFFF 60%, transparent 62%), conic-gradient(#005AE2 0% 80%, #E2E8F0 80% 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #E2E8F0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
  }
  .score-num {
    font-size: 2.25rem;
    font-weight: 800;
    color: #0F172A;
  }
  .score-max {
    font-size: 0.85rem;
    color: #94A3B8;
    margin-top: 10px;
    font-weight: 600;
  }
  .score-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .score-label {
    font-size: 0.725rem;
    font-weight: 800;
    color: #64748B;
    letter-spacing: 0.1em;
  }
  .score-meta h2 {
    font-family: 'Manrope', sans-serif;
    font-size: 1.8rem;
    font-weight: 800;
    margin: 0;
    letter-spacing: -0.02em;
  }
  .score-reasoning {
    color: #475569;
    line-height: 1.7;
    margin: 0;
    font-size: 0.95rem;
    white-space: pre-line;
  }

  /* Grid details */
  .dashboard-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px;
  }
  @media(max-width: 800px) {
    .dashboard-grid {
      grid-template-columns: 1fr;
    }
  }
  .grid-cell {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .grid-cell.full-width {
    grid-column: 1 / -1;
  }
  .cell-header {
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1.5px solid #F1F5F9;
    padding-bottom: 16px;
    margin-bottom: -4px;
  }
  .cell-header h3 {
    font-family: 'Manrope', sans-serif;
    font-size: 1.15rem;
    font-weight: 800;
    margin: 0;
  }
  .blue-icon {
    color: #005AE2;
  }

  /* Pain Points List */
  .pain-points-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .pain-point-item {
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    background-color: #FFFFFF;
    overflow: hidden;
  }
  .pp-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.2s;
  }
  .pp-summary:hover {
    background-color: #F8FAFC;
  }
  .pp-main {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .pp-title {
    font-weight: 700;
    font-size: 0.9rem;
    color: #1E293B;
  }
  .pp-mentions {
    font-size: 0.725rem;
    color: #64748B;
    background-color: #F1F5F9;
    padding: 2px 8px;
    border-radius: 100px;
    width: fit-content;
    font-weight: 600;
  }
  .pp-side {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .pp-badge {
    font-size: 0.725rem;
    font-weight: 800;
    padding: 4px 8px;
    border-radius: 6px;
  }
  .pp-badge.severity-5 { background: #FEE2E2; color: #991B1B; }
  .pp-badge.severity-4 { background: #FEE2E2; color: #991B1B; }
  .pp-badge.severity-3 { background: #FEF3C7; color: #92400E; }
  .pp-badge.severity-2 { background: #DBEAFE; color: #1E40AF; }
  .pp-badge.severity-1 { background: #DBEAFE; color: #1E40AF; }
  .arrow {
    color: #94A3B8;
    transition: transform 0.2s;
  }
  .arrow.expanded {
    transform: rotate(90deg);
  }
  .pp-details {
    padding: 16px;
    background-color: #F8FAFC;
    border-top: 1px solid #E2E8F0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .evidence-title {
    font-size: 0.7rem;
    font-weight: 800;
    color: #94A3B8;
    text-transform: uppercase;
  }
  .pp-details ul {
    margin: 0;
    padding-left: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .pp-details li a {
    color: #005AE2;
    font-size: 0.775rem;
    text-decoration: none;
    word-break: break-all;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  .pp-details li a:hover {
    text-decoration: underline;
  }
  .no-sources {
    font-size: 0.8rem;
    color: #94A3B8;
    font-style: italic;
    margin: 0;
  }

  /* Competitors List */
  .competitors-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .competitor-item {
    padding: 16px;
    border-radius: 12px;
    border: 1px solid #E2E8F0;
    background-color: #FFFFFF;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .comp-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .comp-name {
    font-weight: 700;
    font-size: 0.95rem;
    color: #1E293B;
  }
  .comp-link {
    font-size: 0.75rem;
    color: #005AE2;
    text-decoration: none;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 3px;
  }
  .comp-link:hover {
    text-decoration: underline;
  }
  .comp-web {
    font-size: 0.8rem;
    color: #94A3B8;
  }
  .comp-gaps {
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .gaps-title {
    font-size: 0.725rem;
    font-weight: 700;
    color: #64748B;
  }
  .gap-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .gap-badge {
    background-color: #FFF8E1;
    color: #B7791F;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 6px;
    border: 1px solid #FFE082;
  }

  /* Feature Grid */
  .features-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  @media(max-width: 600px) {
    .features-grid {
      grid-template-columns: 1fr;
    }
  }
  .feature-item {
    background-color: #FFFFFF;
    border: 1px solid #E2E8F0;
    padding: 16px;
    border-radius: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }
  .feat-main {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .feat-name {
    font-weight: 700;
    font-size: 0.9rem;
    color: #1E293B;
  }
  .feat-mentions {
    font-size: 0.7rem;
    color: #94A3B8;
    font-weight: 600;
  }
  .feat-priority {
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    padding: 4px 8px;
    border-radius: 6px;
  }
  .feat-priority.prio-high { background-color: #FEE2E2; color: #991B1B; }
  .feat-priority.prio-medium { background-color: #FEF3C7; color: #92400E; }
  .feat-priority.prio-low { background-color: #F1F5F9; color: #475569; }

  /* Animation Utils */
  .fade-in {
    animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 0 10px rgba(0, 90, 226, 0.04); }
    50% { box-shadow: 0 0 0 20px rgba(0, 90, 226, 0.08); }
  }
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
