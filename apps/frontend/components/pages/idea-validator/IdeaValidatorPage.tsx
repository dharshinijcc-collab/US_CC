'use client';

export const dynamic = 'force-dynamic';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import EditableText from '@/components/pages/admin/EditableText';
import { AlertTriangle } from 'lucide-react';
import { QAAnswers } from '@/app/founder/idea-validator/types/scoring.types';
import { api } from '@/services/api';

// ─── Sub-components & Styles ──────────────────────────────────────────────────
import { validatorStyles } from './styles';
import ConceptStep from './components/ConceptStep';
import FounderStep from './components/FounderStep';
import AuthStep from './components/AuthStep';
import LoadingStep from './components/LoadingStep';

interface UserSession {
  email: string;
  name: string;
  isLoggedIn: boolean;
}

function ValidatorPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Load initial idea query parameter
  const initialIdea = searchParams.get('idea') || '';

  // Form steps: 1 (Idea), 2 (Founder), 3 (Auth / Login & Signup), 4 (Loading)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStepText, setLoadingStepText] = useState<string>('');

  // Auth tab: 'signup' or 'login'
  const [authTab, setAuthTab] = useState<'signup' | 'login'>('signup');
  const [authName, setAuthName] = useState<string>('');
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Authenticated user session
  const [session, setSession] = useState<UserSession | null>(null);
  const [showAuthPopup, setShowAuthPopup] = useState<boolean>(false);

  // Form responses state
  const [idea, setIdea] = useState<string>(initialIdea);
  const [answers, setAnswers] = useState<QAAnswers>({
    customer: '',
    problem: '',
    pain_score: 5,
    validation_level: 'none',
    market_size_choice: 'medium',
    revenue_model_choice: 'subscription',
    why_now: 'The timing is right due to market shifts and technological advancements.',
    competitors: '',
    moat: '',
    solo_founder: true,
    has_technical_cofounder: false,
    technical_background: 'no',
    current_stage: 'forming',
    launch_timeline: 'January 2026',
    funding_status: 'bootstrapped',
    contact_name: '',
    contact_email: '',
    need_help: false
  });

  // Fetch session on load
  useEffect(() => {
    const savedSession = localStorage.getItem('cc_user_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setSession(parsed);
        // Pre-fill founder contact details if we have session
        setAnswers(prev => ({
          ...prev,
          contact_name: parsed.name || '',
          contact_email: parsed.email || ''
        }));
      } catch (e) {
        console.error('Error parsing session', e);
      }
    }
  }, []);

  // Update answers on field change
  const handleInputChange = (field: keyof QAAnswers, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Step 1 Validation
  const validateStep1 = () => {
    if (!idea || idea.trim().length < 10) {
      setFormError('Please describe your core concept (at least 10 characters).');
      return false;
    }
    if (!answers.customer || answers.customer.trim().length < 5) {
      setFormError('Please describe your target customer in detail.');
      return false;
    }
    if (!answers.problem || answers.problem.trim().length < 5) {
      setFormError('Please describe the core problem being solved.');
      return false;
    }
    if (!answers.competitors || answers.competitors.trim().length < 3) {
      setFormError('Please specify key competitors (or write "None" if first mover).');
      return false;
    }
    if (!answers.moat || answers.moat.trim().length < 5) {
      setFormError('Please describe your unfair advantage or defensibility strategy.');
      return false;
    }
    return true;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    if (session && session.isLoggedIn) {
      if (!answers.contact_name || answers.contact_name.trim().length < 2) {
        setFormError('Please provide your name.');
        return false;
      }
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!answers.contact_email || !emailRegex.test(answers.contact_email)) {
        setFormError('Please provide a valid contact email address.');
        return false;
      }
    }
    if (!answers.launch_timeline) {
      setFormError('Please select a launch timeline.');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setFormError(null);
    if (currentStep === 1) {
      if (!validateStep1()) return;
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!validateStep2()) return;
      
      // If user is already logged in, skip the authentication step and trigger analysis
      if (session && session.isLoggedIn) {
        triggerAnalysis();
      } else {
        // Pre-fill auth email with contact email
        setAuthEmail(answers.contact_email);
        setShowAuthPopup(true);
      }
    }
  };

  const handlePrevStep = () => {
    setFormError(null);
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Handle Google OAuth Success
  const handleGoogleAuthSuccess = async (idToken: string) => {
    setIsLoading(true);
    setFormError(null);
    try {
      const res = await api.post('idea-validator/auth/google', { id_token: idToken });
      const data = res.data;
      if (data && data.access_token) {
        localStorage.setItem('Dtoken', data.access_token);
        const name = data.user?.name || data.user?.email.split('@')[0];
        const userSession: UserSession = { name, email: data.user.email, isLoggedIn: true };
        localStorage.setItem('cc_user_session', JSON.stringify(userSession));
        setSession(userSession);

        // Align answers contact details
        setAnswers(prev => ({
          ...prev,
          contact_name: name,
          contact_email: data.user.email
        }));

        // Proceed to generate report
        setShowAuthPopup(false);
        triggerAnalysis();
      } else {
        throw new Error('Failed to retrieve authentication tokens from Google login');
      }
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      const msg = err.response?.data?.detail || err.message || 'Google Login failed. Please try again.';
      setFormError(msg);
      setIsLoading(false);
    }
  };

  // Handle Backend Registration & Login
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!authEmail || !emailRegex.test(authEmail)) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!authPassword || authPassword.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      if (authTab === 'signup') {
        if (!authName || authName.trim().length < 2) {
          setFormError('Please enter your full name.');
          setIsLoading(false);
          return;
        }

        const res = await api.post('idea-validator/auth?action=signup', {
          name: authName,
          email: authEmail,
          password: authPassword
        });
        
        const data = res.data;
        localStorage.setItem('Dtoken', data.access_token);
        const userSession: UserSession = { name: authName, email: authEmail, isLoggedIn: true };
        localStorage.setItem('cc_user_session', JSON.stringify(userSession));
        setSession(userSession);

        setAnswers(prev => ({
          ...prev,
          contact_name: authName,
          contact_email: authEmail
        }));

        setShowAuthPopup(false);
        triggerAnalysis();
      } else {
        const res = await api.post('idea-validator/auth?action=login', {
          email: authEmail,
          password: authPassword
        });

        const data = res.data;
        localStorage.setItem('Dtoken', data.access_token);
        const name = data.user?.name || authEmail.split('@')[0];
        const userSession: UserSession = { name, email: authEmail, isLoggedIn: true };
        localStorage.setItem('cc_user_session', JSON.stringify(userSession));
        setSession(userSession);

        setAnswers(prev => ({
          ...prev,
          contact_name: name,
          contact_email: authEmail
        }));

        setShowAuthPopup(false);
        triggerAnalysis();
      }
    } catch (err: any) {
      console.error('Auth submit error:', err);
      const msg = err.response?.data?.detail 
        || err.response?.data?.payload 
        || (err.response?.status === 409 ? 'An account with this email already exists.' : null)
        || (err.response?.status === 401 ? 'Invalid email or password.' : null)
        || err.message 
        || 'Authentication failed. Please check your credentials and try again.';
      setFormError(msg);
      setIsLoading(false);
    }
  };

  // Submit and call scoring API
  const triggerAnalysis = async () => {
    setIsLoading(true);
    setCurrentStep(4);
    setLoadingStepText('Initializing validation pipeline...');

    const ideaText = `Original Concept: ${idea}
Target Customer: ${answers.customer}
Core Problem: ${answers.problem}
Competitors: ${answers.competitors}
Moat: ${answers.moat}`;

    let pollInterval: any = null;

    try {
      const response = await api.post('idea-validator', {
        ideaText,
        answers: {
          ...answers,
          contact_name: session?.name || answers.contact_name || 'Anonymous',
          contact_email: session?.email || answers.contact_email || 'anonymous@crestcode.com'
        },
        saveToDb: false,
        toolType: 'idea-validator'
      });
      const data = response.data;

      if (!data.id) {
        throw new Error('No report ID returned from server');
      }

      // If SVE started a background job
      if (data.status === 'pending') {
        const projectId = data.id;
        
        // Start polling SVE status
        pollInterval = setInterval(async () => {
          try {
            const statusRes = await api.get(`idea-validator/status?id=${projectId}`);
            const statusData = statusRes.data;

            if (statusData.status === 'collecting') {
              setLoadingStepText('SVE: Scraping Reddit threads and user discussions...');
            } else if (statusData.status === 'analyzing') {
              setLoadingStepText('SVE: Extracting customer pain points and competitor gaps...');
            } else if (statusData.status === 'done') {
              setLoadingStepText('Due Diligence: Finalizing venture notebook...');
              
              if (pollInterval) clearInterval(pollInterval);
              
              // Load the compiled report
              const reportRes = await api.get(`idea-validator?id=${projectId}`);
              const reportData = reportRes.data;
              
              setIsLoading(false);
              sessionStorage.setItem(`cc_report_${projectId}`, JSON.stringify(reportData));
              router.push(`/founder/idea-validator/report?id=${projectId}&temp=true`);
            } else if (statusData.status === 'failed') {
              throw new Error(`SVE job failed at stage: ${statusData.failed_stage || 'unknown'}`);
            }
          } catch (err: any) {
            console.error('Polling status error:', err);
            setFormError(err.message || 'Validation failed during scraping. Please try again.');
            setCurrentStep(2);
            setIsLoading(false);
            if (pollInterval) clearInterval(pollInterval);
          }
        }, 2000);
      } else {
        // Fallback: immediate Due Diligence report completed (SVE was offline)
        setIsLoading(false);
        sessionStorage.setItem(`cc_report_${data.id}`, JSON.stringify(data));
        router.push(`/founder/idea-validator/report?id=${data.id}&temp=true`);
      }
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'An unexpected error occurred. Please try again.');
      setCurrentStep(2); // Return to step 2 on error
      setIsLoading(false);
      if (pollInterval) clearInterval(pollInterval);
    }
  };

  return (
    <>
      <Header />
      <style dangerouslySetInnerHTML={{ __html: validatorStyles }} />
      
      <main className="validator-page-root" style={{ background: '#F8FAFC', minHeight: '100vh', paddingTop: '180px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* Progress Indicator Header */}
          {currentStep <= 2 && !showAuthPopup && (
            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
              <EditableText
                contentKey="validator.hero.eyebrow"
                value="Venture Accelerator"
                as="span"
                style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary-blue)', letterSpacing: '0.15em', textTransform: 'uppercase' }}
              />
              <h1 style={{ fontSize: 'clamp(2.1rem, 5vw, 2.75rem)', fontWeight: 800, color: '#0F172A', marginTop: '8px', marginBottom: '8px', letterSpacing: '-0.03em', fontFamily: "'Manrope', sans-serif" }}>
                {currentStep === 1 && 'Core Concept'}
                {currentStep === 2 && 'Founder Capabilities'}
              </h1>
              <p style={{ color: '#64748B', fontSize: '1.05rem', maxWidth: '550px', margin: '0 auto 24px', lineHeight: '1.6' }}>
                {currentStep === 1 && <EditableText contentKey="validator.hero.step1desc" value="Refine your core value proposition, targeted consumer base, and market defensibility." />}
                {currentStep === 2 && <EditableText contentKey="validator.hero.step2desc" value="Help us evaluate execution capabilities, launch models, and timeline projections." />}
              </p>

              {/* Progress Stepper Bullets & Labels */}
              <div style={{ maxWidth: '480px', margin: '0 auto 40px', position: 'relative' }}>
                {/* Progress Bar background */}
                <div className="step-progress-bar" style={{ left: '40px', right: '40px', top: '19px', transform: 'none', margin: 0 }}>
                  <div 
                    className="step-progress-fill" 
                    style={{ width: `${currentStep === 1 ? 0 : 100}%` }}
                  ></div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                  {/* Step 1 */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80px' }}>
                    <div 
                      className={`step-bubble ${currentStep === 1 ? 'active' : 'completed'}`} 
                      onClick={() => currentStep > 1 && setCurrentStep(1)}
                      style={{ cursor: currentStep > 1 ? 'pointer' : 'default', margin: 0 }}
                    >
                      1
                    </div>
                    <span style={{ 
                      fontSize: '0.85rem', 
                      fontWeight: 800, 
                      color: currentStep === 1 ? 'var(--primary-blue)' : currentStep > 1 ? '#10B981' : '#64748B',
                      textAlign: 'center',
                      marginTop: '8px',
                      transition: 'color 0.3s ease',
                      fontFamily: "'Manrope', sans-serif",
                      whiteSpace: 'nowrap'
                    }}>
                      Core Concept
                    </span>
                  </div>

                  {/* Step 2 */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '160px' }}>
                    <div 
                      className={`step-bubble ${currentStep === 2 ? 'active' : ''}`} 
                      onClick={() => currentStep > 2 && setCurrentStep(2)}
                      style={{ cursor: currentStep > 2 ? 'pointer' : 'default', margin: 0 }}
                    >
                      2
                    </div>
                    <span style={{ 
                      fontSize: '0.85rem', 
                      fontWeight: 800, 
                      color: currentStep === 2 ? 'var(--primary-blue)' : '#64748B',
                      textAlign: 'center',
                      marginTop: '8px',
                      transition: 'color 0.3s ease',
                      fontFamily: "'Manrope', sans-serif",
                      whiteSpace: 'nowrap'
                    }}>
                      Founder Capabilities
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {formError && (
            <div className="error-banner" style={{ display: 'flex', gap: '12px', alignItems: 'center', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '12px', padding: '16px', color: '#991B1B', fontSize: '0.9rem', marginBottom: '32px' }}>
              <AlertTriangle size={18} style={{ flexShrink: 0 }} />
              <span>{formError}</span>
            </div>
          )}

          {currentStep === 1 && (
            <ConceptStep
              idea={idea}
              setIdea={setIdea}
              answers={answers}
              onChange={handleInputChange}
              onNext={handleNextStep}
            />
          )}

          {currentStep === 2 && (
            <FounderStep
              answers={answers}
              onChange={handleInputChange}
              onPrev={handlePrevStep}
              onNext={handleNextStep}
            />
          )}

          {currentStep === 4 && (
            <LoadingStep loadingStepText={loadingStepText} />
          )}

          {showAuthPopup && (
            <AuthStep
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
              onSubmit={handleAuthSubmit}
              onPrev={() => setShowAuthPopup(false)}
              onGoogleAuthSuccess={handleGoogleAuthSuccess}
            />
          )}

          {currentStep === 4 && (
            <LoadingStep loadingStepText={loadingStepText} />
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}

export default function ValidatorPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner-circle" style={{ margin: '0 auto 16px' }}></div>
          <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Loading workspace...</p>
        </div>
      </div>
    }>
      <ValidatorPageContent />
    </Suspense>
  );
}
