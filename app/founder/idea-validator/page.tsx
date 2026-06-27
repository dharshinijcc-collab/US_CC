'use client';

export const dynamic = 'force-dynamic';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Lightbulb, TrendingUp, Users, Compass, User, 
  ArrowLeft, ArrowRight, Sparkles, AlertTriangle, Eye, EyeOff, Lock, Mail, UserCheck
} from 'lucide-react';
import { QAAnswers } from './types/scoring';


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
    if (!answers.contact_name || answers.contact_name.trim().length < 2) {
      setFormError('Please provide your name.');
      return false;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!answers.contact_email || !emailRegex.test(answers.contact_email)) {
      setFormError('Please provide a valid contact email address.');
      return false;
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
        setCurrentStep(3);
      }
    }
  };

  const handlePrevStep = () => {
    setFormError(null);
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Handle Mock Registration & Login
  const handleAuthSubmit = (e: React.FormEvent) => {
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

    // Get current mock users list
    const usersListRaw = localStorage.getItem('cc_mock_users');
    let usersList = usersListRaw ? JSON.parse(usersListRaw) : [];

    if (authTab === 'signup') {
      if (!authName || authName.trim().length < 2) {
        setFormError('Please enter your full name.');
        return;
      }

      // Check if user already exists
      const existingUser = usersList.find((u: any) => u.email.toLowerCase() === authEmail.toLowerCase());
      if (existingUser) {
        setFormError('An account with this email already exists. Please log in.');
        setAuthTab('login');
        return;
      }

      // Create new user
      const newUser = { name: authName, email: authEmail, password: authPassword };
      usersList.push(newUser);
      localStorage.setItem('cc_mock_users', JSON.stringify(usersList));

      // Save user session
      const userSession: UserSession = { name: authName, email: authEmail, isLoggedIn: true };
      localStorage.setItem('cc_user_session', JSON.stringify(userSession));
      setSession(userSession);

      // Align answers contact details
      setAnswers(prev => ({
        ...prev,
        contact_name: authName,
        contact_email: authEmail
      }));

      // Proceed to generate report
      triggerAnalysis();
    } else {
      // Login check
      const user = usersList.find(
        (u: any) => u.email.toLowerCase() === authEmail.toLowerCase() && u.password === authPassword
      );

      if (!user) {
        // Dynamic fallback: if it's a first run and no users exist in localStorage, let them log in anyway
        if (usersList.length === 0) {
          const userSession: UserSession = { name: authEmail.split('@')[0], email: authEmail, isLoggedIn: true };
          localStorage.setItem('cc_user_session', JSON.stringify(userSession));
          setSession(userSession);
          setAnswers(prev => ({
            ...prev,
            contact_name: userSession.name,
            contact_email: userSession.email
          }));
          triggerAnalysis();
          return;
        }
        setFormError('Invalid email or password. Please try again or create a new account.');
        return;
      }

      // Login success
      const userSession: UserSession = { name: user.name, email: user.email, isLoggedIn: true };
      localStorage.setItem('cc_user_session', JSON.stringify(userSession));
      setSession(userSession);

      // Align answers contact details
      setAnswers(prev => ({
        ...prev,
        contact_name: user.name,
        contact_email: user.email
      }));

      // Proceed to generate report
      triggerAnalysis();
    }
  };

  // Submit and call scoring API
  const triggerAnalysis = async () => {
    setIsLoading(true);
    setCurrentStep(4);
    setLoadingStepText('Extracting business signals...');

    const loadingStages = [
      'Extracting business signals...',
      'Analyzing market timing & dynamics...',
      'Evaluating technical feasibility...',
      'Calculating investor appeal indices...',
      'Generating VC-grade due diligence report...'
    ];

    let currentStageIndex = 0;
    const stageTimer = setInterval(() => {
      if (currentStageIndex < loadingStages.length - 1) {
        currentStageIndex++;
        setLoadingStepText(loadingStages[currentStageIndex]);
      }
    }, 1200);

    const ideaText = `Original Concept: ${idea}
Target Customer: ${answers.customer}
Core Problem: ${answers.problem}
Competitors: ${answers.competitors}
Moat: ${answers.moat}`;

    try {
      const response = await fetch('/founder/idea-validator/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ideaText, answers })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server error generating scores');
      }

      clearInterval(stageTimer);
      setIsLoading(false);
      
      if (data.id) {
        router.push(`/founder/idea-validator/report?id=${data.id}`);
      } else {
        throw new Error('No report ID returned from server');
      }
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'An unexpected error occurred. Please try again.');
      setCurrentStep(2); // Return to step 2 on error
      setIsLoading(false);
      clearInterval(stageTimer);
    }
  };

  return (
    <>
      <Header />
      <style dangerouslySetInnerHTML={{ __html: validatorStyles }} />
      
      <main className="validator-page-root" style={{ background: '#F8FAFC', minHeight: '100vh', paddingTop: '100px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* Progress Indicator Header */}
          {currentStep <= 3 && (
            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary-blue)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Venture Accelerator
              </span>
              <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.25rem)', fontWeight: 800, color: '#0F172A', marginTop: '8px', marginBottom: '8px', letterSpacing: '-0.03em' }}>
                {currentStep === 3 ? 'Secure Your Analysis' : 'Venture Idea Validator'}
              </h1>
              <p style={{ color: '#64748B', fontSize: '0.95rem', maxWidth: '550px', margin: '0 auto 24px', lineHeight: '1.6' }}>
                {currentStep === 1 && 'Refine your core value proposition, targeted consumer base, and market defensibility.'}
                {currentStep === 2 && 'Help us evaluate execution capabilities, launch models, and timeline projections.'}
                {currentStep === 3 && 'Save your progress and create a free account to unlock your comprehensive VC-grade report.'}
              </p>

              {/* Progress Stepper Bullets */}
              <div className="step-progress-row" style={{ maxWidth: '400px', margin: '0 auto' }}>
                <div className="step-progress-bar" style={{ left: '15%', right: '15%' }}>
                  <div 
                    className="step-progress-fill" 
                    style={{ width: `${currentStep === 1 ? 0 : currentStep === 2 ? 50 : 100}%` }}
                  ></div>
                </div>
                <div className={`step-bubble ${currentStep === 1 ? 'active' : 'completed'}`} onClick={() => currentStep > 1 && setCurrentStep(1)}>1</div>
                <div className={`step-bubble ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`} onClick={() => currentStep > 2 && setCurrentStep(2)}>2</div>
                <div className={`step-bubble ${currentStep === 3 ? 'active' : ''}`}>3</div>
              </div>
            </div>
          )}

          {formError && (
            <div className="error-banner" style={{ display: 'flex', gap: '12px', alignItems: 'center', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '12px', padding: '16px', color: '#991B1B', fontSize: '0.9rem', marginBottom: '32px' }}>
              <AlertTriangle size={18} style={{ flexShrink: 0 }} />
              <span>{formError}</span>
            </div>
          )}

          {/* STEP 1: ABOUT THE IDEA */}
          {currentStep === 1 && (
            <div className="form-card" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)' }}>
              
              <div className="form-section-card" style={{ border: 'none', padding: 0, background: 'transparent' }}>
                <div className="form-section-title" style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '24px', color: '#0F172A' }}>
                  <Lightbulb size={20} style={{ color: 'var(--primary-blue)' }} />
                  <span>The Core Concept</span>
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label" style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '8px', fontSize: '0.9rem' }}>
                    Describe your startup idea *
                  </label>
                  <textarea 
                    className="textarea-box"
                    style={{ width: '100%', minHeight: '100px', padding: '14px', borderRadius: '12px', border: '1.5px solid #E2E8F0', outline: 'none', fontSize: '0.925rem' }}
                    placeholder="Describe what your venture does, the technology, and core innovation..."
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label" style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '8px', fontSize: '0.9rem' }}>
                    Who is the target customer? *
                  </label>
                  <textarea 
                    className="textarea-box"
                    style={{ width: '100%', minHeight: '80px', padding: '14px', borderRadius: '12px', border: '1.5px solid #E2E8F0', outline: 'none', fontSize: '0.925rem' }}
                    placeholder="e.g. Mid-sized retail brands struggling with omnichannel returns..."
                    value={answers.customer}
                    onChange={(e) => handleInputChange('customer', e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label" style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '8px', fontSize: '0.9rem' }}>
                    What specific problem do you solve? *
                  </label>
                  <textarea 
                    className="textarea-box"
                    style={{ width: '100%', minHeight: '80px', padding: '14px', borderRadius: '12px', border: '1.5px solid #E2E8F0', outline: 'none', fontSize: '0.925rem' }}
                    placeholder="e.g. Return processing takes 14 days and wastes 18% of product margins due to manual triage..."
                    value={answers.problem}
                    onChange={(e) => handleInputChange('problem', e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label" style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '8px', fontSize: '0.9rem' }}>
                    Customer Pain Score (1 = Low, 10 = Critical)
                  </label>
                  <div className="pain-score-group" style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
                      <button 
                        key={val}
                        type="button"
                        className={`pain-btn ${answers.pain_score === val ? 'active' : ''}`}
                        onClick={() => handleInputChange('pain_score', val)}
                        style={{
                          flex: 1,
                          minWidth: '36px',
                          height: '38px',
                          borderRadius: '8px',
                          border: answers.pain_score === val ? '2px solid var(--primary-blue)' : '1px solid #E2E8F0',
                          backgroundColor: answers.pain_score === val ? 'rgba(0, 90, 226, 0.08)' : '#FFFFFF',
                          color: answers.pain_score === val ? 'var(--primary-blue)' : '#0F172A',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-section-card" style={{ borderTop: '1px solid #E2E8F0', marginTop: '32px', paddingTop: '32px', borderBottom: 'none', paddingBottom: 0, background: 'transparent' }}>
                <div className="form-section-title" style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '24px', color: '#0F172A' }}>
                  <TrendingUp size={20} style={{ color: 'var(--primary-blue)' }} />
                  <span>Market Defensibility</span>
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label" style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '12px', fontSize: '0.9rem' }}>
                    Validation Level
                  </label>
                  <div className="radio-pills-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                    {[
                      { key: 'none', title: 'Concept Only', desc: 'No validation yet' },
                      { key: 'conversations', title: 'User Interviews', desc: 'Spoken with prospects' },
                      { key: 'waitlist', title: 'Waitlist / Signups', desc: 'Tangible customer leads' },
                      { key: 'paying_customers', title: 'Paying Customers', desc: 'Active pilots or contracts' }
                    ].map(opt => (
                      <div 
                        key={opt.key}
                        className={`radio-pill-card ${answers.validation_level === opt.key ? 'active' : ''}`}
                        onClick={() => handleInputChange('validation_level', opt.key)}
                        style={{
                          padding: '14px',
                          borderRadius: '12px',
                          border: answers.validation_level === opt.key ? '2px solid var(--primary-blue)' : '1px solid #E2E8F0',
                          backgroundColor: answers.validation_level === opt.key ? 'rgba(0, 90, 226, 0.02)' : '#FFFFFF',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: answers.validation_level === opt.key ? 'var(--primary-blue)' : '#0F172A' }}>{opt.title}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>{opt.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label" style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '8px', fontSize: '0.9rem' }}>
                    Competitors *
                  </label>
                  <textarea 
                    className="textarea-box"
                    style={{ width: '100%', minHeight: '70px', padding: '14px', borderRadius: '12px', border: '1.5px solid #E2E8F0', outline: 'none', fontSize: '0.925rem' }}
                    placeholder="Who are the existing players? e.g. Shopify Flow, Returnly..."
                    value={answers.competitors}
                    onChange={(e) => handleInputChange('competitors', e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label" style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '8px', fontSize: '0.9rem' }}>
                    What is your unfair advantage (MOAT)? *
                  </label>
                  <textarea 
                    className="textarea-box"
                    style={{ width: '100%', minHeight: '70px', padding: '14px', borderRadius: '12px', border: '1.5px solid #E2E8F0', outline: 'none', fontSize: '0.925rem' }}
                    placeholder="e.g. Proprietary returns logic API, exclusive distributor partnerships..."
                    value={answers.moat}
                    onChange={(e) => handleInputChange('moat', e.target.value)}
                  />
                </div>
              </div>

              {/* Action Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '40px' }}>
                <button 
                  onClick={handleNextStep}
                  className="btn-form-next"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: 'var(--primary-blue)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px 28px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.95rem'
                  }}
                >
                  <span>Continue to Founder Details</span>
                  <ArrowRight size={16} />
                </button>
              </div>

            </div>
          )}

          {/* STEP 2: FOUNDER & EXECUTION */}
          {currentStep === 2 && (
            <div className="form-card" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)' }}>
              
              <div className="form-section-card" style={{ border: 'none', padding: 0, background: 'transparent' }}>
                <div className="form-section-title" style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '24px', color: '#0F172A' }}>
                  <Users size={20} style={{ color: 'var(--primary-blue)' }} />
                  <span>Founder Capabilities</span>
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label" style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '8px', fontSize: '0.9rem' }}>
                    Are you a solo founder?
                  </label>
                  <div className="toggle-btn-group" style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      type="button" 
                      className={`toggle-btn ${answers.solo_founder === true ? 'active' : ''}`}
                      onClick={() => {
                        handleInputChange('solo_founder', true);
                        handleInputChange('has_technical_cofounder', false);
                      }}
                      style={{
                        flex: 1,
                        padding: '14px',
                        borderRadius: '12px',
                        border: answers.solo_founder === true ? '2px solid var(--primary-blue)' : '1px solid #E2E8F0',
                        backgroundColor: answers.solo_founder === true ? 'rgba(0, 90, 226, 0.05)' : '#FFFFFF',
                        color: answers.solo_founder === true ? 'var(--primary-blue)' : '#334155',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      👤 Solo Founder
                    </button>
                    <button 
                      type="button" 
                      className={`toggle-btn ${answers.solo_founder === false ? 'active' : ''}`}
                      onClick={() => handleInputChange('solo_founder', false)}
                      style={{
                        flex: 1,
                        padding: '14px',
                        borderRadius: '12px',
                        border: answers.solo_founder === false ? '2px solid var(--primary-blue)' : '1px solid #E2E8F0',
                        backgroundColor: answers.solo_founder === false ? 'rgba(0, 90, 226, 0.05)' : '#FFFFFF',
                        color: answers.solo_founder === false ? 'var(--primary-blue)' : '#334155',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      👥 Co-founders / Team
                    </button>
                  </div>
                </div>

                {!answers.solo_founder && (
                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label className="form-label" style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '8px', fontSize: '0.9rem' }}>
                      Is there a technical co-founder?
                    </label>
                    <div className="toggle-btn-group" style={{ display: 'flex', gap: '12px' }}>
                      <button 
                        type="button" 
                        className={`toggle-btn ${answers.has_technical_cofounder === true ? 'active' : ''}`}
                        onClick={() => handleInputChange('has_technical_cofounder', true)}
                        style={{
                          flex: 1,
                          padding: '12px',
                          borderRadius: '12px',
                          border: answers.has_technical_cofounder === true ? '2px solid var(--primary-blue)' : '1px solid #E2E8F0',
                          backgroundColor: answers.has_technical_cofounder === true ? 'rgba(0, 90, 226, 0.05)' : '#FFFFFF',
                          color: answers.has_technical_cofounder === true ? 'var(--primary-blue)' : '#334155',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        💻 Yes, they can code
                      </button>
                      <button 
                        type="button" 
                        className={`toggle-btn ${answers.has_technical_cofounder === false ? 'active' : ''}`}
                        onClick={() => handleInputChange('has_technical_cofounder', false)}
                        style={{
                          flex: 1,
                          padding: '12px',
                          borderRadius: '12px',
                          border: answers.has_technical_cofounder === false ? '2px solid var(--primary-blue)' : '1px solid #E2E8F0',
                          backgroundColor: answers.has_technical_cofounder === false ? 'rgba(0, 90, 226, 0.05)' : '#FFFFFF',
                          color: answers.has_technical_cofounder === false ? 'var(--primary-blue)' : '#334155',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        🚫 No tech co-founder
                      </button>
                    </div>
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label" style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '8px', fontSize: '0.9rem' }}>
                    What is your personal technical background?
                  </label>
                  <div className="toggle-btn-group" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {[
                      { key: 'can_code', label: '💻 I can code' },
                      { key: 'used_to_code', label: '⏳ I used to code' },
                      { key: 'no', label: '🚫 Non-technical' }
                    ].map(opt => (
                      <button 
                        key={opt.key}
                        type="button" 
                        className={`toggle-btn ${answers.technical_background === opt.key ? 'active' : ''}`}
                        onClick={() => handleInputChange('technical_background', opt.key)}
                        style={{
                          flex: '1 1 120px',
                          padding: '12px',
                          borderRadius: '12px',
                          border: answers.technical_background === opt.key ? '2px solid var(--primary-blue)' : '1px solid #E2E8F0',
                          backgroundColor: answers.technical_background === opt.key ? 'rgba(0, 90, 226, 0.05)' : '#FFFFFF',
                          color: answers.technical_background === opt.key ? 'var(--primary-blue)' : '#334155',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-section-card" style={{ borderTop: '1px solid #E2E8F0', marginTop: '32px', paddingTop: '32px', borderBottom: 'none', paddingBottom: 0, background: 'transparent' }}>
                <div className="form-section-title" style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '24px', color: '#0F172A' }}>
                  <Compass size={20} style={{ color: 'var(--primary-blue)' }} />
                  <span>Project Timeline & Contact</span>
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label" style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '8px', fontSize: '0.9rem' }}>
                    Current Development Stage
                  </label>
                  <div className="toggle-btn-group" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                    {[
                      { key: 'forming', label: '💡 Idea Only' },
                      { key: 'ux_design', label: '🎨 Design Stage' },
                      { key: 'prototype', label: '⚙️ Mock/Prototype' },
                      { key: 'mvp', label: '🚀 Active MVP' }
                    ].map(opt => (
                      <button 
                        key={opt.key}
                        type="button" 
                        className={`toggle-btn ${answers.current_stage === opt.key ? 'active' : ''}`}
                        onClick={() => handleInputChange('current_stage', opt.key)}
                        style={{
                          padding: '12px',
                          borderRadius: '12px',
                          border: answers.current_stage === opt.key ? '2px solid var(--primary-blue)' : '1px solid #E2E8F0',
                          backgroundColor: answers.current_stage === opt.key ? 'rgba(0, 90, 226, 0.05)' : '#FFFFFF',
                          color: answers.current_stage === opt.key ? 'var(--primary-blue)' : '#334155',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label" style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '8px', fontSize: '0.9rem' }}>
                    Target Launch Timeline
                  </label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <select 
                      className="select-box"
                      value={answers.launch_timeline.split(' ')[0] || 'January'}
                      onChange={(e) => {
                        const year = answers.launch_timeline.split(' ')[1] || '2026';
                        handleInputChange('launch_timeline', `${e.target.value} ${year}`);
                      }}
                      style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1.5px solid #E2E8F0', outline: 'none', cursor: 'pointer' }}
                    >
                      {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <select 
                      className="select-box"
                      value={answers.launch_timeline.split(' ')[1] || '2026'}
                      onChange={(e) => {
                        const month = answers.launch_timeline.split(' ')[0] || 'January';
                        handleInputChange('launch_timeline', `${month} ${e.target.value}`);
                      }}
                      style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1.5px solid #E2E8F0', outline: 'none', cursor: 'pointer' }}
                    >
                      {['2026', '2027', '2028', '2029', '2030'].map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '32px' }}>
                  <label className="form-label" style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '8px', fontSize: '0.9rem' }}>
                    Funding Stage
                  </label>
                  <div className="toggle-btn-group" style={{ display: 'flex', gap: '12px' }}>
                    {[
                      { key: 'bootstrapped', label: '🌱 Bootstrapped' },
                      { key: 'raising', label: '📈 Raising Seed' },
                      { key: 'raised', label: '💰 Funded' }
                    ].map(opt => (
                      <button 
                        key={opt.key}
                        type="button" 
                        className={`toggle-btn ${answers.funding_status === opt.key ? 'active' : ''}`}
                        onClick={() => handleInputChange('funding_status', opt.key)}
                        style={{
                          flex: 1,
                          padding: '12px',
                          borderRadius: '12px',
                          border: answers.funding_status === opt.key ? '2px solid var(--primary-blue)' : '1px solid #E2E8F0',
                          backgroundColor: answers.funding_status === opt.key ? 'rgba(0, 90, 226, 0.05)' : '#FFFFFF',
                          color: answers.funding_status === opt.key ? 'var(--primary-blue)' : '#334155',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label" style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '8px', fontSize: '0.9rem' }}>
                    Your Name *
                  </label>
                  <input 
                    type="text" 
                    className="input-text"
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #E2E8F0', outline: 'none' }}
                    placeholder="e.g. Jane Doe"
                    value={answers.contact_name}
                    onChange={(e) => handleInputChange('contact_name', e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label" style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '8px', fontSize: '0.9rem' }}>
                    Email Address *
                  </label>
                  <input 
                    type="email" 
                    className="input-text"
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #E2E8F0', outline: 'none' }}
                    placeholder="e.g. jane@example.com"
                    value={answers.contact_email}
                    onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: '20px' }}>
                  <input 
                    type="checkbox" 
                    id="need_help"
                    checked={answers.need_help || false}
                    onChange={(e) => handleInputChange('need_help', e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: 'var(--primary-blue)', cursor: 'pointer' }}
                  />
                  <label htmlFor="need_help" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                    I would like CrestCode to contact me for co-founder build opportunities.
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
                <button 
                  type="button" 
                  onClick={handlePrevStep}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    border: '1.5px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    color: '#64748B',
                    borderRadius: '12px',
                    padding: '12px 24px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.95rem'
                  }}
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>

                <button 
                  onClick={handleNextStep}
                  className="btn-form-next"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: 'var(--primary-blue)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px 28px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.95rem'
                  }}
                >
                  <span>Submit Details</span>
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: MOCK LOGIN & SIGNUP PORTAL */}
          {currentStep === 3 && (
            <div className="form-card auth-card" style={{ maxWidth: '480px', margin: '0 auto', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '24px', padding: '32px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)' }}>
              
              {/* Tab Selector */}
              <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', marginBottom: '28px', position: 'relative' }}>
                <button 
                  type="button"
                  onClick={() => { setAuthTab('signup'); setFormError(null); }}
                  style={{
                    flex: 1,
                    paddingBottom: '14px',
                    border: 'none',
                    background: 'transparent',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: authTab === 'signup' ? 'var(--primary-blue)' : '#64748B',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  Create Account
                  {authTab === 'signup' && <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 3, backgroundColor: 'var(--primary-blue)', borderRadius: '2px' }} />}
                </button>
                <button 
                  type="button"
                  onClick={() => { setAuthTab('login'); setFormError(null); }}
                  style={{
                    flex: 1,
                    paddingBottom: '14px',
                    border: 'none',
                    background: 'transparent',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: authTab === 'login' ? 'var(--primary-blue)' : '#64748B',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  Log In
                  {authTab === 'login' && <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 3, backgroundColor: 'var(--primary-blue)', borderRadius: '2px' }} />}
                </button>
              </div>

              <form onSubmit={handleAuthSubmit}>
                {authTab === 'signup' && (
                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label className="form-label" style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '8px', fontSize: '0.85rem' }}>
                      Full Name
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                      <input 
                        type="text" 
                        className="input-text"
                        style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '12px', border: '1.5px solid #E2E8F0', outline: 'none', fontSize: '0.9rem' }}
                        placeholder="Jane Doe"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label" style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '8px', fontSize: '0.85rem' }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                    <input 
                      type="email" 
                      className="input-text"
                      style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '12px', border: '1.5px solid #E2E8F0', outline: 'none', fontSize: '0.9rem' }}
                      placeholder="jane@example.com"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '28px' }}>
                  <label className="form-label" style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '8px', fontSize: '0.85rem' }}>
                    Password (min. 6 characters)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      className="input-text"
                      style={{ width: '100%', padding: '12px 42px 12px 42px', borderRadius: '12px', border: '1.5px solid #E2E8F0', outline: 'none', fontSize: '0.9rem' }}
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
                  className="btn-form-next"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    backgroundColor: 'var(--primary-blue)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.95rem'
                  }}
                >
                  <UserCheck size={16} />
                  <span>{authTab === 'signup' ? 'Create Account & View Report' : 'Log In & View Report'}</span>
                </button>
              </form>

              {/* Back navigation link */}
              <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <button 
                  type="button"
                  onClick={handlePrevStep}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#64748B',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <ArrowLeft size={14} />
                  Back to Questionnaire
                </button>
              </div>

            </div>
          )}

          {/* STEP 4: LOADING SCREEN */}
          {currentStep === 4 && (
            <div className="form-card loading-wrap" style={{ maxWidth: '480px', margin: '60px auto 0', padding: '48px 32px', textAlign: 'center', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)' }}>
              <div className="spinner-outer" style={{ margin: '0 auto 28px' }}>
                <div className="spinner-circle"></div>
                <div className="spinner-inner"></div>
              </div>
              <div className="loading-text" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginBottom: '10px', letterSpacing: '-0.02em' }}>
                Analyzing Your Venture
              </div>
              <p className="loading-desc" style={{ color: '#64748B', fontSize: '0.925rem', margin: 0, fontWeight: 500 }}>
                {loadingStepText}
              </p>
            </div>
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


const validatorStyles = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

:root {
  --primary-blue: #005AE2;
  --bg-dark: #0A0F1C;
  --bg-light: #F8FAFC;
  --text-black: #0F172A;
  --text-muted: #64748B;
  --white: #FFFFFF;
  --border-light: #E2E8F0;
}

h1, h2, h3, h4, h5, h6, .manrope-font {
  font-family: 'Manrope', sans-serif;
}

.validator-container {
  padding-top: 90px;
  padding-bottom: 96px;
  min-height: 100vh;
  background: radial-gradient(circle at top right, rgba(0, 90, 226, 0.05), transparent 60%);
}

.content-box {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;
}

@media (max-width: 768px) {
  .validator-container {
    padding-top: 72px;
    padding-bottom: 64px;
  }
}

@media (max-width: 480px) {
  .content-box {
    padding: 0 16px;
  }
}

/* Wizard Progress Header */
.step-progress-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  position: relative;
}

.step-progress-bar {
  position: absolute;
  height: 3px;
  background-color: var(--border-light);
  top: 50%;
  left: 10%;
  right: 10%;
  transform: translateY(-50%);
  z-index: 0;
}

.step-progress-fill {
  position: absolute;
  height: 100%;
  background-color: var(--primary-blue);
  transition: width 0.3s ease;
}

.step-bubble {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-color: var(--white);
  border: 2px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-muted);
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
}

.step-bubble.active {
  border-color: var(--primary-blue);
  background-color: var(--primary-blue);
  color: var(--white);
  box-shadow: 0 0 0 6px rgba(0, 90, 226, 0.15);
}

.step-bubble.completed {
  border-color: var(--primary-blue);
  background-color: var(--primary-blue);
  color: var(--white);
}

/* Form Card */
.form-card {
  background-color: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 24px;
  padding: 48px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
  position: relative;
}

@media (max-width: 600px) {
  .form-card {
    padding: 32px 20px;
  }
}

.form-heading {
  font-size: clamp(1.5rem, 3.5vw, 2.25rem);
  font-weight: 800;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}

.form-subheading {
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 32px;
}

.form-group {
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-weight: 700;
  font-size: 0.95rem;
  color: #334155;
}

.form-label span {
  color: var(--text-muted);
  font-weight: 400;
  font-size: 0.8rem;
}

.input-text, .select-box, .textarea-box {
  width: 100%;
  padding: 14px 18px;
  border-radius: 12px;
  border: 1px solid var(--border-light);
  font-size: 0.95rem;
  font-family: inherit;
  color: var(--text-black);
  outline: none;
  transition: all 0.2s;
  background-color: #FAFAFA;
  box-sizing: border-box;
}

.input-text:focus, .select-box:focus, .textarea-box:focus {
  border-color: var(--primary-blue);
  background-color: var(--white);
  box-shadow: 0 0 0 4px rgba(0, 90, 226, 0.05);
}

.textarea-box {
  resize: vertical;
  min-height: 110px;
}

/* Toggle Button Group */
.toggle-btn-group {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.toggle-btn {
  padding: 12px 20px;
  border-radius: 10px;
  border: 1px solid var(--border-light);
  background: #FAFAFA;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-grow: 1;
}

.toggle-btn:hover {
  border-color: #CBD5E1;
}

.toggle-btn.active {
  background-color: #E6EFFF;
  border-color: var(--primary-blue);
  color: var(--primary-blue);
}

/* 1 to 10 Button Group for Pain Score */
.pain-score-group {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 6px;
}

@media (max-width: 600px) {
  .pain-score-group {
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
  }
}

@media (max-width: 360px) {
  .toggle-btn {
    padding: 10px 12px;
    font-size: 0.8rem;
  }
}

.pain-btn {
  height: 44px;
  border-radius: 8px;
  border: 1px solid var(--border-light);
  background: #FAFAFA;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pain-btn:hover {
  border-color: #CBD5E1;
}

.pain-btn.active {
  background-color: var(--primary-blue);
  border-color: var(--primary-blue);
  color: var(--white);
}

/* Radio Pill Selection Box */
.radio-pills-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

@media (max-width: 480px) {
  .radio-pills-row {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }
}

.radio-pill-card {
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 16px;
  background-color: #FAFAFA;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.radio-pill-card:hover {
  border-color: #CBD5E1;
}

.radio-pill-card.active {
  background-color: #E6EFFF;
  border-color: var(--primary-blue);
}

.radio-title {
  font-weight: 700;
  font-size: 0.925rem;
  color: var(--text-black);
}

.radio-pill-card.active .radio-title {
  color: var(--primary-blue);
}

.radio-desc {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Navigation Buttons row */
.btn-row {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  border-top: 1px solid var(--border-light);
  padding-top: 32px;
  gap: 16px;
}

.btn-form-prev {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border-light);
  padding: 14px 28px;
  border-radius: 100px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-form-prev:hover {
  color: var(--text-black);
  border-color: var(--text-muted);
}

.btn-form-next {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--primary-blue);
  color: var(--white);
  border: none;
  padding: 14px 36px;
  border-radius: 100px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 16px -4px rgba(0, 90, 226, 0.25);
  transition: all 0.2s;
  margin-left: auto;
}

.btn-form-next:hover {
  background-color: #004ac2;
  transform: translateY(-1px);
}

/* Error Banner */
.error-banner {
  background-color: #FEF2F2;
  border: 1px solid #FEE2E2;
  color: #EF4444;
  padding: 16px 20px;
  border-radius: 12px;
  margin-bottom: 28px;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Loading Screen styles */
.loading-wrap {
  text-align: center;
  padding: 64px 24px;
}

.spinner-outer {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 32px;
}

.spinner-circle {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 80px;
  height: 80px;
  border: 4px solid transparent;
  border-top-color: var(--primary-blue);
  border-radius: 50%;
  animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.spinner-inner {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 60px;
  height: 60px;
  top: 10px;
  left: 10px;
  border: 4px solid transparent;
  border-bottom-color: #10B981;
  border-radius: 50%;
  animation: spin-reverse 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes spin-reverse {
  0% { transform: rotate(360deg); }
  100% { transform: rotate(0deg); }
}

.loading-text {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-black);
  margin-bottom: 8px;
  height: 24px;
}

.loading-desc {
  color: var(--text-muted);
  font-size: 0.9rem;
}

/* Results Screen Scorecard */
.score-circle-panel {
  background-color: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 24px;
  padding: 32px;
  display: flex;
  align-items: center;
  gap: 28px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
  width: 100%;
  box-sizing: border-box;
}

.score-circle-outer {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
}

.score-circle-inner {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: var(--white);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.score-big-num {
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--text-black);
  line-height: 1;
}

.score-scale {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 600;
  margin-top: 2px;
}

.score-summary-details {
  flex-grow: 1;
}

.triage-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 100px;
  font-weight: 800;
  font-size: 0.825rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
}

.score-summary-title {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 8px;
  letter-spacing: -0.01em;
}

.score-summary-desc {
  color: var(--text-muted);
  font-size: 0.925rem;
  line-height: 1.5;
}

@media (max-width: 600px) {
  .score-circle-panel {
    flex-direction: column;
    text-align: center;
  }
}

/* Quick Metrics Grid */
.metrics-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
  margin-top: 24px;
}

.metric-mini-card {
  background-color: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.01);
}

.metric-mini-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.metric-mini-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-black);
}

/* Dimension details split layout */
.dimensions-section {
  margin-bottom: 56px;
}

.dimensions-title {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 24px;
  letter-spacing: -0.01em;
}

.dimensions-split {
  display: grid;
  grid-template-columns: 1.2fr 1.8fr;
  gap: 32px;
  align-items: start;
}

@media (max-width: 800px) {
  .dimensions-split {
    grid-template-columns: 1fr;
  }
}

.dimensions-sidebar-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dim-nav-item {
  background-color: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
}

.dim-nav-item:hover {
  border-color: var(--primary-blue);
  box-shadow: 0 8px 16px rgba(0, 90, 226, 0.03);
}

.dim-nav-item.active {
  border-color: var(--primary-blue);
  background-color: #E6EFFF;
  box-shadow: 0 8px 24px rgba(0, 90, 226, 0.06);
}

.dim-nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dim-nav-title-box {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dim-nav-icon {
  font-size: 1.2rem;
}

.dim-nav-title {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--text-black);
}

.dim-nav-score {
  font-weight: 800;
  font-size: 1.15rem;
  color: var(--primary-blue);
}

.dim-progress-bg {
  width: 100%;
  height: 6px;
  background-color: #E2E8F0;
  border-radius: 100px;
  overflow: hidden;
}

.dim-progress-fill {
  height: 100%;
  background-color: var(--primary-blue);
  border-radius: 100px;
  transition: width 0.4s ease;
}

/* Detail Panel */
.dim-detail-panel {
  background-color: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
}

.dim-detail-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-light);
  padding-bottom: 24px;
  margin-bottom: 24px;
}

.dim-detail-label {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-black);
}

.dim-detail-score-pill {
  padding: 8px 16px;
  border-radius: 100px;
  background-color: #E6EFFF;
  color: var(--primary-blue);
  font-weight: 800;
  font-size: 1rem;
}

.dim-detail-prose {
  color: #475569;
  font-size: 0.975rem;
  line-height: 1.6;
  margin-bottom: 32px;
  font-weight: 500;
}

.signals-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

@media (max-width: 600px) {
  .signals-split {
    grid-template-columns: 1fr;
  }
}

.signals-list-box {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.signals-list-title {
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.signals-ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.signal-li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155;
  line-height: 1.4;
}

.signal-icon-pos {
  color: #10B981;
  flex-shrink: 0;
  margin-top: 2px;
}

.signal-icon-neg {
  color: #EF4444;
  flex-shrink: 0;
  margin-top: 2px;
}

.actions-box {
  background-color: #FAFAFA;
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 24px;
}

.actions-box-title {
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--text-black);
  margin-bottom: 16px;
}

/* Deep-Dive Report details */
.report-section {
  margin-bottom: 56px;
}

.report-card {
  background-color: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 24px;
  padding: 48px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
}

@media (max-width: 600px) {
  .report-card {
    padding: 32px 20px;
  }
}

.report-title {
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 32px;
  letter-spacing: -0.02em;
  border-bottom: 1px solid var(--border-light);
  padding-bottom: 16px;
}

.report-block {
  margin-bottom: 36px;
}

.report-block-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-black);
  margin-bottom: 12px;
}

.report-block-text {
  color: #475569;
  font-size: 0.95rem;
  line-height: 1.6;
  font-weight: 500;
}

.alert-block {
  border-left: 4px solid var(--primary-blue);
  background-color: #E6EFFF;
  padding: 20px;
  border-radius: 0 16px 16px 0;
  margin-bottom: 24px;
}

.alert-block.warning {
  border-left-color: #F59E0B;
  background-color: #FFFBEB;
}

.alert-block-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  font-size: 0.95rem;
  color: var(--text-black);
  margin-bottom: 8px;
}

.alert-block-text {
  font-size: 0.9rem;
  line-height: 1.5;
  color: #475569;
  font-weight: 500;
}

/* Results Action buttons */
.results-actions-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 56px;
  border-top: 1px solid var(--border-light);
  padding-top: 40px;
}

.btn-results-call {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background-color: var(--primary-blue);
  color: var(--white);
  padding: 16px 36px;
  border-radius: 100px;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  box-shadow: 0 10px 20px -5px rgba(0, 90, 226, 0.3);
  transition: all 0.3s ease;
}

.btn-results-call:hover {
  background-color: #004ac2;
  transform: translateY(-2px);
  box-shadow: 0 15px 30px -5px rgba(0, 90, 226, 0.4);
}

.btn-results-outline {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background-color: var(--white);
  color: var(--text-black);
  border: 1px solid var(--border-light);
  padding: 16px 36px;
  border-radius: 100px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-results-outline:hover {
  border-color: var(--text-muted);
  background-color: #FAFAFA;
  transform: translateY(-2px);
}

/* Upgrade Page Styles */
.upgrade-wrap {
  text-align: center;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upgrade-icon-box {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background-color: #FFF8E1;
  color: #F59E0B;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
  box-shadow: 0 8px 24px rgba(245, 158, 11, 0.15);
}

.upgrade-title {
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.upgrade-desc {
  color: var(--text-muted);
  font-size: 1rem;
  line-height: 1.6;
  max-width: 500px;
  margin-bottom: 36px;
}

.upgrade-btn-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.btn-upgrade-pro {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #005AE2 0%, #4F46E5 100%);
  color: var(--white);
  padding: 16px 36px;
  border-radius: 100px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.35);
  transition: all 0.3s ease;
}

.btn-upgrade-pro:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px -5px rgba(79, 70, 229, 0.45);
}

/* ── Methodology Section ── */
.methodology-wrap {
  max-width: 960px;
  margin: 48px auto 0;
}
.meth-section-title {
  font-size: clamp(1.3rem, 3vw, 1.75rem);
  font-weight: 800;
  color: var(--text-black);
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}
.meth-section-sub {
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 32px;
}
@media (max-width: 768px) {
  .methodology-wrap {
    margin: 32px auto 0;
  }
}

.arch-pipeline {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 56px;
}
@media (max-width: 720px) {
  .arch-pipeline { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .arch-pipeline { gap: 14px; }
}
.arch-card {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 20px;
  padding: 28px 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.arch-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(0,90,226,0.07);
}
.arch-pass-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 16px;
}
.arch-pass-1 { background: #E6EFFF; color: var(--primary-blue); }
.arch-pass-2 { background: #ECFDF5; color: #059669; }
.arch-pass-3 { background: #FDF4FF; color: #9333EA; }
.arch-card-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--text-black);
  margin-bottom: 10px;
}
.arch-card-temp {
  display: inline-block;
  font-size: 0.78rem;
  font-weight: 700;
  background: #F1F5F9;
  color: var(--text-muted);
  padding: 3px 10px;
  border-radius: 6px;
  margin-bottom: 12px;
  font-family: 'Courier New', monospace;
}
.arch-card-desc {
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.55;
}
.dims-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 40px;
}
@media (max-width: 720px) {
  .dims-grid { grid-template-columns: repeat(2, 1fr); }
}
.dim-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-black);
  box-shadow: 0 2px 6px rgba(0,0,0,0.02);
}
.formula-block {
  background: #F8FAFC;
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 24px 28px;
  margin-bottom: 20px;
  font-family: 'Courier New', Courier, monospace;
}
.formula-label {
  font-size: 0.78rem;
  font-weight: 800;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 10px;
  font-family: 'Inter', sans-serif;
}
.formula-text {
  font-size: 0.95rem;
  color: var(--text-black);
  line-height: 1.7;
}
@media (max-width: 480px) {
  .formula-block { padding: 16px; }
  .formula-text { font-size: 0.82rem; line-height: 1.6; }
}
.formula-highlight { color: var(--primary-blue); font-weight: 700; }
.formula-green { color: #059669; font-weight: 700; }
.formula-purple { color: #9333EA; font-weight: 700; }
.triage-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 40px;
  font-size: 0.875rem;
}
.triage-table th {
  font-size: 0.78rem;
  font-weight: 800;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: left;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border-light);
}
.triage-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #F1F5F9;
  color: #334155;
  font-weight: 500;
}
.triage-table tr:last-child td { border-bottom: none; }
@media (max-width: 600px) {
  .triage-table { font-size: 0.78rem; }
  .triage-table th, .triage-table td { padding: 8px 10px; }
}
@media (max-width: 400px) {
  .triage-table th:nth-child(3),
  .triage-table td:nth-child(3) { display: none; }
}
.conf-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 40px;
}
@media (max-width: 600px) {
  .conf-row { grid-template-columns: 1fr; }
}
.conf-card {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}
.conf-card-title {
  font-size: 0.875rem;
  font-weight: 800;
  color: var(--text-black);
  margin-bottom: 10px;
}
.conf-card-formula {
  background: #F8FAFC;
  border-radius: 10px;
  padding: 12px 14px;
  font-family: 'Courier New', monospace;
  font-size: 0.82rem;
  color: var(--text-black);
  line-height: 1.6;
  margin-bottom: 10px;
}
@media (max-width: 400px) {
  .conf-card-formula { font-size: 0.75rem; }
}
.conf-card-note {
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.4;
}
.report-preview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 48px;
}
@media (max-width: 720px) {
  .report-preview-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
  .report-preview-grid { grid-template-columns: 1fr; }
}
.report-preview-card {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.report-preview-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,90,226,0.06);
}
.report-preview-icon { font-size: 1.4rem; margin-bottom: 4px; }
.report-preview-title { font-size: 0.9rem; font-weight: 800; color: var(--text-black); }
.report-preview-desc { font-size: 0.78rem; color: var(--text-muted); line-height: 1.4; }
.no-fetch-callout {
  background: linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%);
  border: 1px solid #6EE7B7;
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 48px;
}
.no-fetch-icon { font-size: 1.4rem; flex-shrink: 0; margin-top: 2px; }
.no-fetch-text { font-size: 0.875rem; color: #065F46; line-height: 1.5; font-weight: 500; }
.no-fetch-text strong { font-weight: 800; }
.section-divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 48px 0 36px;
}
.section-divider-line { flex: 1; height: 1px; background: var(--border-light); }
.section-divider-label {
  font-size: 0.78rem;
  font-weight: 800;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  white-space: nowrap;
}
@media (max-width: 400px) {
  .section-divider-label { font-size: 0.7rem; }
}
.cta-banner {
  background: linear-gradient(135deg, #005AE2 0%, #4F46E5 100%);
  border-radius: 24px;
  padding: 48px;
  text-align: center;
  color: var(--white);
  margin-top: 48px;
}
.cta-banner h3 {
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 800;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}
.cta-banner p {
  font-size: 1rem;
  opacity: 0.85;
  max-width: 540px;
  margin: 0 auto 32px;
  line-height: 1.6;
}
.btn-cta-white {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--white);
  color: var(--primary-blue);
  padding: 16px 40px;
  border-radius: 100px;
  font-weight: 800;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  transition: all 0.2s ease;
}
.btn-cta-white:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 32px rgba(0,0,0,0.2);
}
@media (max-width: 480px) {
  .cta-banner { padding: 28px 20px; }
  .btn-cta-white { padding: 14px 24px; font-size: 0.9rem; }
}

.hero-intro-card {
  padding: 64px 48px;
}
@media (max-width: 600px) {
  .hero-intro-card {
    padding: 40px 20px;
  }
}

/* Red Flags Styles */
.red-flags-section {
  margin-bottom: 56px;
}
.red-flags-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 16px;
}
.red-flag-card {
  background: #FFF5F5;
  border: 1px solid #FEB2B2;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.red-flag-card.medium {
  background: #FFFDF5;
  border-color: #FEEBC8;
}
.red-flag-card.low {
  background: #F7FAFC;
  border-color: #E2E8F0;
}
.red-flag-badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 100px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  width: fit-content;
}
.red-flag-badge.high { background: #FED7D7; color: #9B2C2C; }
.red-flag-badge.medium { background: #FEEBC8; color: #9C4221; }
.red-flag-badge.low { background: #EDF2F7; color: #4A5568; }
.red-flag-title { font-size: 1rem; font-weight: 800; color: #0F172A; }
.red-flag-desc { font-size: 0.82rem; color: #4A5568; line-height: 1.5; }
.red-flag-rec { font-size: 0.82rem; color: #2D3748; line-height: 1.5; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 10px; margin-top: auto; }

/* Risk Matrix Styles */
.risk-matrix-section { margin-bottom: 56px; }
.risk-matrix-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-top: 20px;
}
.risk-matrix-card {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  overflow: hidden;
}
.risk-matrix-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
}
.risk-matrix-card.high::before { background-color: #E53E3E; }
.risk-matrix-card.medium::before { background-color: #DD6B20; }
.risk-matrix-card.low::before { background-color: #319795; }
.risk-card-header { display: flex; justify-content: space-between; align-items: center; }
.risk-card-title { font-size: 0.95rem; font-weight: 800; color: var(--text-black); text-transform: capitalize; }
.risk-card-desc { font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; }
.risk-card-mitigation { font-size: 0.8rem; color: #1A202C; line-height: 1.4; background: #EDF2F7; padding: 10px; border-radius: 8px; margin-top: auto; }

/* Confidence Breakdown Styles */
.conf-breakdown-box {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 40px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.01);
}
.conf-breakdown-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-top: 20px;
}
.conf-breakdown-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.conf-breakdown-label { font-size: 0.78rem; font-weight: 700; color: var(--text-muted); }
.conf-breakdown-val { font-size: 1.25rem; font-weight: 800; color: var(--text-black); }
.conf-progress-bar-bg { width: 100%; height: 6px; background: #E2E8F0; border-radius: 100px; overflow: hidden; }
.conf-progress-bar-fill { height: 100%; border-radius: 100px; }

/* Comparable Startups Styles */
.comps-section { margin-bottom: 56px; }
.comps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}
.comp-card {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.01);
}
.comp-header { display: flex; justify-content: space-between; align-items: center; }
.comp-name { font-size: 1.1rem; font-weight: 800; color: var(--text-black); }
.comp-desc { font-size: 0.82rem; color: var(--text-muted); line-height: 1.5; }
.comp-model { font-size: 0.78rem; font-weight: 700; color: var(--primary-blue); background: #E6EFFF; padding: 4px 10px; border-radius: 100px; width: fit-content; }
.comp-lesson { font-size: 0.8rem; color: #2D3748; line-height: 1.5; border-top: 1px solid var(--border-light); padding-top: 12px; margin-top: auto; }

/* Phased Validation Roadmap Styles */
.roadmap-section { margin-bottom: 56px; }
.roadmap-timeline { display: flex; flex-direction: column; gap: 20px; position: relative; padding-left: 28px; margin-top: 24px; }
.roadmap-timeline::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: #E2E8F0;
}
.roadmap-item { position: relative; }
.roadmap-bubble {
  position: absolute;
  left: -28px;
  top: 4px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--white);
  border: 3px solid var(--primary-blue);
  box-sizing: border-box;
}
.roadmap-card {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.01);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.roadmap-header-row { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
.roadmap-phase-title { font-size: 0.78rem; font-weight: 800; color: var(--primary-blue); text-transform: uppercase; letter-spacing: 0.05em; }
.roadmap-improvement { font-size: 0.78rem; font-weight: 800; color: #2F855A; background: #C6F6D5; padding: 2px 8px; border-radius: 100px; }
.roadmap-task { font-size: 1rem; font-weight: 800; color: var(--text-black); }
.roadmap-details-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; font-size: 0.8rem; color: var(--text-muted); border-top: 1px solid var(--border-light); padding-top: 10px; margin-top: 4px; }

/* VC Investor Memo Styles */
.memo-section { margin-bottom: 56px; }
.memo-tabs { display: flex; border-bottom: 1px solid var(--border-light); margin-bottom: 24px; gap: 8px; overflow-x: auto; padding-bottom: 4px; }
.memo-tab-btn {
  padding: 10px 18px;
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-muted);
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.memo-tab-btn:hover { color: var(--text-black); }
.memo-tab-btn.active { color: var(--primary-blue); border-bottom-color: var(--primary-blue); }
.memo-content-box {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.01);
  line-height: 1.6;
  font-size: 0.92rem;
  color: #334155;
}
.memo-meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  background: var(--bg-light);
  padding: 16px 20px;
  border-radius: 12px;
}

/* BuildTime Estimator Styles */
.buildtime-section { margin-bottom: 56px; }
.buildtime-card {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.01);
}
.bt-meta-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  margin-bottom: 28px;
}
.bt-meta-item { display: flex; flex-direction: column; gap: 6px; }
.bt-meta-label { font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
.bt-meta-val { font-size: 1.35rem; font-weight: 800; color: var(--text-black); }
.phase-list { display: flex; flex-direction: column; gap: 14px; margin-top: 20px; }
.phase-item {
  background: var(--bg-light);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.phase-info { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.phase-name { font-size: 0.92rem; font-weight: 800; color: var(--text-black); }
.phase-desc { font-size: 0.78rem; color: var(--text-muted); line-height: 1.4; }
.phase-badge-row { display: flex; gap: 8px; }
.phase-badge-time { font-size: 0.78rem; font-weight: 700; background: #E6EFFF; color: var(--primary-blue); padding: 4px 10px; border-radius: 100px; white-space: nowrap; }
.phase-badge-effort { font-size: 0.78rem; font-weight: 700; background: #EDF2F7; color: #4A5568; padding: 4px 10px; border-radius: 100px; white-space: nowrap; }

/* Accordion Styles for Investor DD Questions */
.dd-section { margin-bottom: 56px; }
.accordion-item { border: 1px solid var(--border-light); border-radius: 16px; background: var(--white); margin-bottom: 12px; overflow: hidden; }
.accordion-header {
  padding: 18px 24px;
  font-weight: 800;
  font-size: 0.95rem;
  color: var(--text-black);
  background: var(--white);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s ease;
  text-transform: capitalize;
}
.accordion-header:hover { background: var(--bg-light); }
.accordion-content { padding: 24px; border-top: 1px solid var(--border-light); background: var(--bg-light); display: flex; flex-direction: column; gap: 20px; }
.dd-question-box {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.dd-q-text { font-size: 0.92rem; font-weight: 800; color: var(--text-black); }
.dd-sub-item { display: flex; flex-direction: column; gap: 4px; font-size: 0.8rem; }
.dd-sub-label { font-weight: 700; color: var(--text-muted); text-transform: uppercase; font-size: 0.7rem; }
.dd-sub-val { color: #334155; line-height: 1.4; }

/* Score Sensitivity Card */
.sensitivity-section { margin-bottom: 56px; }
.sensitivity-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-top: 16px; }
.sensitivity-card {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.01);
}
.sens-info { display: flex; flex-direction: column; gap: 4px; }
.sens-milestone { font-size: 0.9rem; font-weight: 700; color: var(--text-black); }
.sens-gain { font-size: 1.15rem; font-weight: 800; color: #2F855A; background: #C6F6D5; padding: 4px 12px; border-radius: 100px; white-space: nowrap; }

/* Transparency Formula Box */
.transparency-box {
  background: var(--bg-light);
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.85rem;
  color: #334155;
}
.transparency-formula {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--primary-blue);
  border-bottom: 1px solid var(--border-light);
  padding-bottom: 6px;
}

/* Outcome Survey Box */
.outcome-survey-box {
  background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
  border: 1px solid var(--border-light);
  border-radius: 20px;
  padding: 28px;
  margin-top: 56px;
}
.outcome-survey-title { font-size: 1.2rem; font-weight: 800; color: var(--text-black); margin-bottom: 8px; }
.outcome-survey-desc { font-size: 0.82rem; color: var(--text-muted); margin-bottom: 20px; }

/* Custom Modal Scrollability for wizard & dashboard on homepage */
.step-modal-overlay {
  z-index: 99999;
}
.step-modal {
  max-width: 900px !important;
  width: 95% !important;
  max-height: 90vh !important;
  overflow-y: auto !important;
  border-radius: 24px !important;
  padding: 40px !important;
}

@media (max-width: 600px) {
  .step-modal {
    padding: 24px 16px !important;
  }
}

/* Dedicated Subpage Styles */
.validator-page-root textarea:focus,
.validator-page-root select:focus,
.validator-page-root input:focus {
  border-color: var(--primary-blue) !important;
  box-shadow: 0 0 0 3px rgba(0, 90, 226, 0.08) !important;
}

.pain-btn:hover {
  border-color: var(--primary-blue) !important;
  background-color: rgba(0, 90, 226, 0.02) !important;
}

.radio-pill-card:hover {
  border-color: var(--primary-blue) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

.toggle-btn:hover {
  background-color: rgba(0, 90, 226, 0.02) !important;
  border-color: var(--primary-blue) !important;
}

.toggle-btn.active {
  background-color: rgba(0, 90, 226, 0.08) !important;
  border-color: var(--primary-blue) !important;
  color: var(--primary-blue) !important;
}

/* Auth Cards Floating Animation */
.auth-card input {
  transition: all 0.2s ease;
}

.auth-card input:focus {
  border-color: var(--primary-blue) !important;
  box-shadow: 0 0 0 3px rgba(0, 90, 226, 0.08) !important;
}

/* Glassmorphism for the Auth gate */
.auth-card {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* Animations */
@keyframes ccFadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.cc-page-enter {
  animation: ccFadeIn 0.4s ease forwards;
}
`;
