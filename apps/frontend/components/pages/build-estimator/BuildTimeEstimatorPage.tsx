'use client';

import { useState, useMemo, useEffect } from 'react';
import { Clock, Zap, Rocket, ArrowLeft, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import EditableText from '@/components/pages/admin/EditableText';
import { useContent } from '@/context/ContentContext';

// ─── Sub-components & Utilities ────────────────────────────────────────────────
import type { Answers } from './types';
import {
  BLUE, BLUE_LIGHT, DARK, MUTED, BORDER, PRODUCT_TYPES, ASSET_OPTIONS,
  PLATFORM_OPTIONS, FEATURE_OPTIONS, AI_OPTIONS, INTEGRATION_OPTIONS, TEAM_OPTIONS, STEPS
} from './config';
import { calculateEstimate } from './utils';
import ProgressBar from './components/ProgressBar';
import SingleSelect from './components/SingleSelect';
import MultiSelect from './components/MultiSelect';
import MultiSelectCards from './components/MultiSelectCards';
import ReportView from './components/ReportView';
import { estimatorStyles } from './styles';

export default function BuildTimeEstimatorPage() {
  const { content } = useContent();
  const [step, setStep] = useState(1);
  const [showReport, setShowReport] = useState(false);
  const [answers, setAnswers] = useState<Answers>({
    productType: null, assets: ['idea_only'], platforms: ['web'],
    features: [], aiLevel: ['none'], integrations: [], teamPref: null,
  });

  const [customConfig, setCustomConfig] = useState<any>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);

  useEffect(() => {
    fetch('/api/tool-config?key=build_estimator')
      .then(r => r.json())
      .then(json => {
        if (json.status === 'success') {
          setCustomConfig(json.payload);
        }
      })
      .catch(err => console.error('Error fetching build estimator config:', err))
      .finally(() => setLoadingConfig(false));
  }, []);

  const estimate = useMemo(() => calculateEstimate(answers, customConfig), [answers, customConfig]);

  const canNext = () => {
    if (step === 1) return !!answers.productType;
    if (step === 2) return answers.assets.length > 0;
    if (step === 3) return answers.platforms.length > 0;
    if (step === 4) return true; // features optional
    if (step === 5) return answers.aiLevel.length > 0;
    if (step === 6) return true; // integrations optional
    if (step === 7) return !!answers.teamPref;
    return true;
  };

  const setField = <K extends keyof Answers>(k: K, v: Answers[K]) =>
    setAnswers(prev => ({ ...prev, [k]: v }));

  if (showReport) {
    return <ReportView estimate={estimate} answers={answers} onBack={() => setShowReport(false)} customConfig={customConfig} />;
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: estimatorStyles }} />

      <Header />

      <main className="bte-main">
        <div className="bte-container">

          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: BLUE_LIGHT, border: `1px solid #BFDBFE`, borderRadius: '20px', padding: '6px 16px' }}>
              <Clock size={14} color={BLUE} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: BLUE }}>Step {step} of {STEPS.length}</span>
            </div>
          </div>

          <div className="bte-card">
            <ProgressBar step={step} total={STEPS.length} />

            {/* Step Content */}
            {step === 1 && (
              <div>
                <EditableText
                  contentKey="estimator.step1.heading"
                  value="What are you building?"
                  as="h2"
                  className="bte-step-heading"
                />
                <EditableText
                  contentKey="estimator.step1.desc"
                  value="Select the product type that best describes your idea."
                  as="p"
                  className="bte-step-desc"
                />
                <SingleSelect options={PRODUCT_TYPES} value={answers.productType} onChange={v => setField('productType', v)} />
              </div>
            )}

            {step === 2 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '250px' }}>
                    <EditableText
                      contentKey="estimator.step2.heading"
                      value="What do you already have?"
                      as="h2"
                      className="bte-step-heading"
                    />
                    <EditableText
                      contentKey="estimator.step2.desc"
                      value="Select everything that currently exists. Existing assets significantly reduce the estimated effort."
                      as="p"
                      className="bte-step-desc"
                      style={{ marginBottom: 0 }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      const allKeys = ASSET_OPTIONS.map(o => o.key).filter(k => k !== 'idea_only');
                      const allSelected = allKeys.every(k => answers.assets.includes(k));
                      setField('assets', allSelected ? [] : allKeys);
                    }}
                    style={{
                      background: 'transparent',
                      border: `1.5px solid ${BLUE}`,
                      color: BLUE,
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      flexShrink: 0,
                      marginTop: '4px',
                      transition: 'all 0.15s ease',
                    }}
                    className="bte-select-all-btn"
                  >
                    {ASSET_OPTIONS.map(o => o.key).filter(k => k !== 'idea_only').every(k => answers.assets.includes(k)) ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <div style={{ background: '#FFF8E1', border: '1px solid #FCD34D', borderRadius: '8px', padding: '10px 14px', marginBottom: '18px', fontSize: '0.76rem', color: '#92400E' }}>
                  <EditableText
                    contentKey="estimator.step2.hint"
                    value="💡 Example: A landing page with a Final UI Design + Existing Codebase may only take 1 day."
                  />
                </div>
                <MultiSelect options={ASSET_OPTIONS} values={answers.assets} onChange={v => setField('assets', v)} />
              </div>
            )}

            {step === 3 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '18px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '250px' }}>
                    <EditableText
                      contentKey="estimator.step3.heading"
                      value="Which platforms do you need?"
                      as="h2"
                      className="bte-step-heading"
                    />
                    <EditableText
                      contentKey="estimator.step3.desc"
                      value="Select all deployment targets for your product."
                      as="p"
                      className="bte-step-desc"
                      style={{ marginBottom: 0 }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      const allKeys = PLATFORM_OPTIONS.map(o => o.key);
                      const allSelected = allKeys.every(k => answers.platforms.includes(k));
                      setField('platforms', allSelected ? [] : allKeys);
                    }}
                    style={{
                      background: 'transparent',
                      border: `1.5px solid ${BLUE}`,
                      color: BLUE,
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      flexShrink: 0,
                      marginTop: '4px',
                      transition: 'all 0.15s ease',
                    }}
                    className="bte-select-all-btn"
                  >
                    {PLATFORM_OPTIONS.map(o => o.key).every(k => answers.platforms.includes(k)) ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <MultiSelect options={PLATFORM_OPTIONS} values={answers.platforms} onChange={v => setField('platforms', v)} />
              </div>
            )}

            {step === 4 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '18px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '250px' }}>
                    <EditableText
                      contentKey="estimator.step4.heading"
                      value="Which features do you need?"
                      as="h2"
                      className="bte-step-heading"
                    />
                    <EditableText
                      contentKey="estimator.step4.desc"
                      value="Select only what's essential for your MVP. You can always add more later."
                      as="p"
                      className="bte-step-desc"
                      style={{ marginBottom: 0 }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      const allKeys = FEATURE_OPTIONS.map(o => o.key);
                      const allSelected = allKeys.every(k => answers.features.includes(k));
                      setField('features', allSelected ? [] : allKeys);
                    }}
                    style={{
                      background: 'transparent',
                      border: `1.5px solid ${BLUE}`,
                      color: BLUE,
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      flexShrink: 0,
                      marginTop: '4px',
                      transition: 'all 0.15s ease',
                    }}
                    className="bte-select-all-btn"
                  >
                    {FEATURE_OPTIONS.map(o => o.key).every(k => answers.features.includes(k)) ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <MultiSelect options={FEATURE_OPTIONS} values={answers.features} onChange={v => setField('features', v)} />
              </div>
            )}

            {step === 5 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '18px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '250px' }}>
                    <EditableText
                      contentKey="estimator.step5.heading"
                      value="Will AI be part of the product?"
                      as="h2"
                      className="bte-step-heading"
                    />
                    <EditableText
                      contentKey="estimator.step5.desc"
                      value="AI integration adds significant engineering complexity and timeline."
                      as="p"
                      className="bte-step-desc"
                      style={{ marginBottom: 0 }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      const allKeys = AI_OPTIONS.map(o => o.key).filter(k => k !== 'none');
                      const allSelected = allKeys.every(k => answers.aiLevel.includes(k));
                      setField('aiLevel', allSelected ? ['none'] : allKeys);
                    }}
                    style={{
                      background: 'transparent',
                      border: `1.5px solid ${BLUE}`,
                      color: BLUE,
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      flexShrink: 0,
                      marginTop: '4px',
                      transition: 'all 0.15s ease',
                    }}
                    className="bte-select-all-btn"
                  >
                    {AI_OPTIONS.map(o => o.key).filter(k => k !== 'none').every(k => answers.aiLevel.includes(k)) ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <MultiSelectCards options={AI_OPTIONS} values={answers.aiLevel} onChange={v => setField('aiLevel', v)} />
              </div>
            )}

            {step === 6 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '18px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '250px' }}>
                    <EditableText
                      contentKey="estimator.step6.heading"
                      value="Which external integrations are required?"
                      as="h2"
                      className="bte-step-heading"
                    />
                    <EditableText
                      contentKey="estimator.step6.desc"
                      value="Skip this if no third-party services are needed for V1."
                      as="p"
                      className="bte-step-desc"
                      style={{ marginBottom: 0 }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      const allKeys = INTEGRATION_OPTIONS.map(o => o.key);
                      const allSelected = allKeys.every(k => answers.integrations.includes(k));
                      setField('integrations', allSelected ? [] : allKeys);
                    }}
                    style={{
                      background: 'transparent',
                      border: `1.5px solid ${BLUE}`,
                      color: BLUE,
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      flexShrink: 0,
                      marginTop: '4px',
                      transition: 'all 0.15s ease',
                    }}
                    className="bte-select-all-btn"
                  >
                    {INTEGRATION_OPTIONS.map(o => o.key).every(k => answers.integrations.includes(k)) ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <MultiSelect options={INTEGRATION_OPTIONS} values={answers.integrations} onChange={v => setField('integrations', v)} />
                {answers.integrations.length === 0 && (
                  <EditableText
                    contentKey="estimator.step6.empty"
                    value="No integrations selected — you can proceed."
                    as="p"
                    style={{ fontSize: '0.75rem', color: '#A0AEC0', marginTop: '12px', textAlign: 'center' }}
                  />
                )}
              </div>
            )}

            {step === 7 && (
              <div>
                <EditableText
                  contentKey="estimator.step7.heading"
                  value="How would you like to build?"
                  as="h2"
                  className="bte-step-heading"
                />
                <EditableText
                  contentKey="estimator.step7.desc"
                  value="Your team composition affects both delivery speed and overall investment."
                  as="p"
                  className="bte-step-desc"
                />
                <SingleSelect options={TEAM_OPTIONS} value={answers.teamPref} onChange={v => setField('teamPref', v)} />
              </div>
            )}

            {/* Navigation */}
            <div className="bte-nav">
              <button
                onClick={() => step > 1 ? setStep(s => s - 1) : undefined}
                disabled={step === 1}
                className="bte-btn"
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '8px',
                  border: `1.5px solid ${BORDER}`, background: 'transparent', cursor: step === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '0.85rem', fontWeight: 700, color: step === 1 ? '#CBD5E1' : MUTED,
                }}
              >
                <ArrowLeft size={14} />
                <EditableText contentKey="estimator.nav.back" value="Back" />
              </button>

              {step < STEPS.length ? (
                <button
                  onClick={() => canNext() && setStep(s => s + 1)}
                  disabled={!canNext()}
                  className="bte-btn"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 24px', borderRadius: '8px',
                    background: canNext() ? BLUE : '#CBD5E1', border: 'none', cursor: canNext() ? 'pointer' : 'not-allowed',
                    fontSize: '0.85rem', fontWeight: 700, color: '#fff',
                  }}
                >
                  <EditableText contentKey="estimator.nav.next" value="Next" /> <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  onClick={() => canNext() && setShowReport(true)}
                  disabled={!canNext()}
                  className="bte-btn"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 28px', borderRadius: '10px',
                    background: canNext() ? BLUE : '#CBD5E1', border: 'none', cursor: canNext() ? 'pointer' : 'not-allowed',
                    fontSize: '0.9rem', fontWeight: 800, color: '#fff',
                  }}
                >
                  <Rocket size={16} />
                  <EditableText contentKey="estimator.nav.generate" value="Generate Estimate" />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
