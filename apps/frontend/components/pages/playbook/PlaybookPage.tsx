'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useContent } from '@/context/ContentContext';

// ─── Sub-components & Styles ──────────────────────────────────────────────────
import { playbookStyles } from './styles';
import PlaybookHero from './PlaybookHero';
import PlaybookPhases from './PlaybookPhases';
import PlaybookPods from './PlaybookPods';
import PlaybookStats from './PlaybookStats';
import PlaybookComparison from './PlaybookComparison';
import PlaybookCta from './PlaybookCta';

export default function OurModelPage() {
  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const { content, loading, error } = useContent();
  const [activePhase, setActivePhase] = React.useState(0);

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#F3F5F9] font-manrope">Loading our model...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen bg-[#F3F5F9] font-manrope text-red-500">Error: {error}</div>;
  if (!content || !content.ourModel) return null;

  const modelContent = content.ourModel;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: playbookStyles }} />

      <Header />
      <div className="our-model-page">
        {/* SECTION 1: HERO */}
        <PlaybookHero modelContent={modelContent} handleScroll={handleScroll} />

        {/* SECTION 2: STICKY TABS */}
        <div id="phases" className="phases-section" style={{ background: '#F8FAFC' }}>
          <div className="section-container" style={{ paddingTop: 0, paddingBottom: 0 }}>
            <div className="phases-tabs" style={{ maxWidth: '1000px' }}>
              {[
                { n: '01.', t: 'SELECT', id: 'discovery' },
                { n: '02.', t: 'VALIDATE', id: 'validation' },
                { n: '03.', t: 'BUILD', id: 'build' },
                { n: '04.', t: 'LAUNCH', id: 'launch' },
                { n: '05.', t: 'SCALE', id: 'scale' }
              ].map((phase, i) => (
                <button 
                  key={phase.t} 
                  onClick={() => { setActivePhase(i); document.getElementById('phases')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className={`phase-tab ${activePhase === i ? 'active' : ''}`}
                  style={{ 
                    fontSize: '0.6875rem', 
                    fontWeight: 800, 
                    cursor: 'pointer',
                    color: activePhase === i ? '#2563EB' : '#4B5563',
                    transition: 'all 0.3s'
                  }}
                >
                  <span style={{ color: '#2563EB', marginRight: '4px', opacity: 1, fontWeight: 900 }}>{phase.n}</span> {phase.t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* DYNAMIC PHASES SECTION */}
        <PlaybookPhases modelContent={modelContent} activePhase={activePhase} setActivePhase={setActivePhase} />

        {/* SECTION 6: THE FIVE PODS */}
        <PlaybookPods modelContent={modelContent} />

        {/* SECTION 7: SUCCESS METRICS */}
        <PlaybookStats modelContent={modelContent} />

        {/* SECTION 8: COMPARISON */}
        <PlaybookComparison modelContent={modelContent} />

        {/* SECTION 9: FINAL CTA */}
        <PlaybookCta modelContent={modelContent} />

        <Footer />
      </div>
    </>
  );
}
