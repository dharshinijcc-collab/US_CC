'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Sparkles, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { api } from '@/services/api';

// ─── Sub-components & Styles ──────────────────────────────────────────────────
import { sveStyles } from './styles';
import AuthGateForm from './components/AuthGateForm';
import PipelineLoader from './components/PipelineLoader';
import ResultsDashboard from './components/ResultsDashboard';

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
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [pipelineStartTime, setPipelineStartTime] = useState<number | null>(null);
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
          loadReport(projId);
        } else if (statusData.status === 'failed') {
          clearInterval(interval);
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
      } catch {
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

    setPageState('loading');

    try {
      const res = await api.post('social-validation', {
        ideaText,
        ideaName,
        targetAudience,
        contactName: session?.name || 'Anonymous',
        contactEmail: session?.email || 'anonymous@crestcode.com'
      });
      if (res.data && res.data.id) {
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

  const handleReset = () => {
    setPageState('form');
    setIdeaText('');
    setIdeaName('');
    setTargetAudience('');
    setError(null);
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
            <AuthGateForm
              isAuthenticated={isAuthenticated}
              isAuthChecking={isAuthChecking}
              authTab={authTab}
              setAuthTab={setAuthTab}
              handleAuthSubmit={handleAuthSubmit}
              authName={authName}
              setAuthName={setAuthName}
              authEmail={authEmail}
              setAuthEmail={setAuthEmail}
              authPassword={authPassword}
              setAuthPassword={setAuthPassword}
              ideaText={ideaText}
              setIdeaText={setIdeaText}
              ideaName={ideaName}
              setIdeaName={setIdeaName}
              targetAudience={targetAudience}
              setTargetAudience={setTargetAudience}
              handleFormSubmit={handleFormSubmit}
            />
          )}

          {/* PAGE STATE: LOADING / POLLING */}
          {pageState === 'loading' && (
            <PipelineLoader
              currentStageId={currentStageId}
              elapsedSeconds={elapsedSeconds}
            />
          )}

          {/* PAGE STATE: RESULTS DASHBOARD */}
          {pageState === 'results' && reportData && (
            <ResultsDashboard
              reportData={reportData}
              expandedPainPoints={expandedPainPoints}
              togglePainPoint={togglePainPoint}
              onReset={handleReset}
            />
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}
