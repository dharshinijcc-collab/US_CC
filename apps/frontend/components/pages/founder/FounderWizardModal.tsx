'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { QAAnswers } from '@/app/founder/idea-validator/types/scoring.types';
import { api } from '@/services/api';

// ─── Sub-components & Steps ─────────────────────────────────────────────────
import WizardStep1 from './WizardStep1';
import WizardStep2 from './WizardStep2';

interface FounderWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  idea: string;
  setIdea: React.Dispatch<React.SetStateAction<string>>;
  submissionStep: number;
  setSubmissionStep: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FounderWizardModal({
  isOpen,
  onClose,
  idea,
  submissionStep,
  setSubmissionStep,
  setIsLoading
}: FounderWizardModalProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const [loadingStepText, setLoadingStepText] = useState('Extracting business signals...');
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

  useEffect(() => {
    if (!isOpen) {
      setAnswers({
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
      setFormError(null);
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof QAAnswers, value: any) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = (): boolean => {
    if (!answers.customer.trim() || answers.customer.trim().length < 10) {
      setFormError('Customer segment is required and must be at least 10 characters.');
      return false;
    }
    if (!answers.problem.trim() || answers.problem.trim().length < 10) {
      setFormError('Problem description is required and must be at least 10 characters.');
      return false;
    }
    if (!answers.competitors.trim() || answers.competitors.trim().length < 10) {
      setFormError('Competitors list is required and must be at least 10 characters.');
      return false;
    }
    if (!answers.moat.trim() || answers.moat.trim().length < 10) {
      setFormError('Moat / Differentiation is required and must be at least 10 characters.');
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    if (!answers.launch_timeline.trim() || answers.launch_timeline.trim().length < 3) {
      setFormError('Launch timeline is required and must be at least 3 characters.');
      return false;
    }
    if (!answers.contact_name.trim() || answers.contact_name.trim().length < 2) {
      setFormError('Your name is required and must be at least 2 characters.');
      return false;
    }
    const emailRegex = /^.+@.+\..+$/;
    if (!answers.contact_email.trim() || !emailRegex.test(answers.contact_email.trim())) {
      setFormError('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setFormError(null);
    if (submissionStep === 1 && !validateStep1()) return;
    setFormError(null);
    setSubmissionStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setFormError(null);
    setSubmissionStep(prev => prev - 1);
  };

  const handleValidatorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validateStep2()) return;

    setIsLoading(true);
    setSubmissionStep(3); // Loading screen step
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
      const response = await api.post('idea-validator', {
        ideaText,
        answers: {
          ...answers,
          contact_name: answers.contact_name || 'Anonymous',
          contact_email: answers.contact_email || 'anonymous@crestcode.com'
        },
        saveToDb: false,
        toolType: 'idea-validator'
      });
      const data = response.data;

      clearInterval(stageTimer);
      setIsLoading(false);
      if (data.id) {
        sessionStorage.setItem(`cc_report_${data.id}`, JSON.stringify(data));
        window.location.href = `/founder/idea-validator/report?id=${data.id}&temp=true`;
      } else {
        throw new Error('No report ID returned from server');
      }
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'An unexpected error occurred. Please try again.');
      setSubmissionStep(2); // Return to step 2
      setIsLoading(false);
      clearInterval(stageTimer);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="step-modal-overlay">
      {/* STEP 1 & 2: QUESTIONNAIRE WIZARD */}
      {submissionStep >= 1 && submissionStep <= 2 && (
        <div className="step-modal-wizard">
          <button className="step-modal-close" onClick={onClose}>&times;</button>
          
          {/* Stepper Progress bar */}
          <div className="step-progress-row" style={{ maxWidth: 300, margin: '0 auto 40px', padding: 0 }}>
            <div className="step-progress-bar" style={{ left: '20%', right: '20%' }}>
              <div className="step-progress-fill" style={{ width: `${(submissionStep === 2) ? 100 : 0}%` }}></div>
            </div>
            <div className={`step-bubble ${submissionStep === 1 ? 'active' : 'completed'}`}>1</div>
            <div className={`step-bubble ${submissionStep === 2 ? 'active' : ''}`}>2</div>
          </div>

          <form onSubmit={handleValidatorSubmit} className="form-card" style={{ border: 'none', boxShadow: 'none', padding: 0 }}>
            {formError && (
              <div className="error-banner" style={{ marginBottom: '24px' }}>
                <AlertTriangle size={18} />
                <span>{formError}</span>
              </div>
            )}

            {/* STEP 1: ABOUT THE IDEA */}
            {submissionStep === 1 && (
              <WizardStep1 answers={answers} handleInputChange={handleInputChange} />
            )}

            {/* STEP 2: ABOUT THE FOUNDER */}
            {submissionStep === 2 && (
              <WizardStep2 answers={answers} handleInputChange={handleInputChange} />
            )}

            {/* Navigation Buttons Row */}
            <div className="btn-row" style={{ marginTop: '32px' }}>
              {submissionStep === 2 && (
                <button 
                  type="button" 
                  className="btn-form-prev"
                  onClick={handlePrevStep}
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
              )}

              {submissionStep === 1 ? (
                <button 
                  type="button" 
                  className="btn-form-next"
                  onClick={handleNextStep}
                  style={{ marginLeft: 'auto' }}
                >
                  <span>Continue</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button 
                  type="submit" 
                  className="btn-form-next"
                  style={{ background: 'linear-gradient(135deg, #005AE2 0%, #4F46E5 100%)', marginLeft: 'auto' }}
                >
                  <Sparkles size={16} />
                  <span>Generate Report</span>
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* STEP 3: LOADING SCREEN */}
      {submissionStep === 3 && (
        <div className="step-modal" style={{ maxWidth: '480px', padding: '40px' }}>
          <div className="spinner-outer" style={{ margin: '0 auto 24px' }}>
            <div className="spinner-circle"></div>
            <div className="spinner-inner"></div>
          </div>
          <div className="loading-text" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
            {loadingStepText}
          </div>
          <p className="loading-desc" style={{ color: '#64748B', fontSize: '0.9rem', margin: 0 }}>
            Our AI due diligence engine is evaluating your startup signals...
          </p>
        </div>
      )}
    </div>
  );
}
