'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useContent } from '@/context/ContentContext';
import EditableText from '@/components/admin/EditableText';

export default function ToolsPage() {
  const { content, loading, error } = useContent();

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#F3F5F9] font-manrope">Loading tools...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen bg-[#F3F5F9] font-manrope text-red-500">Error: {error}</div>;

  // Use studio content for the validation section
  const studioContent = content?.studio || {};

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

        :root {
          --bg-base: #FAFAFA;
          --bg-light: #FFFFFF;
          --bg-dark: #0A0F1C;
          --bg-grey: #F4F5F7;
          --primary-blue: #005AE2;
          --bright-blue: #0088FF;
          --bright-blue-hover: #0070E0;
          --light-blue-bg: #EBF5FF;
          --text-black: #020617;
          --text-main: #0F172A;
          --text-muted: #64748B;
          --white: #FFFFFF;
          --border-light: #E2E8F0;
          --border-dark: rgba(255, 255, 255, 0.1);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: 'Manrope', sans-serif;
          background-color: var(--bg-base);
          color: var(--text-main);
          line-height: 1.6;
        }

        .section-base {
          padding: clamp(60px, 8vw, 100px) clamp(16px, 3vw, 24px);
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .section-base { padding: clamp(40px, 6vw, 60px) clamp(12px, 3vw, 20px); }
        }

        .section-title {
          font-size: clamp(1.5rem, 5vw, 3rem);
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: clamp(16px, 3vw, 24px);
          letter-spacing: -0.03em;
        }

        .section-title-left {
          text-align: left;
        }

        .title-dark {
          color: var(--text-black);
        }

        .body-text {
          font-family: 'Inter', sans-serif;
          font-size: clamp(0.95rem, 2vw, 1.125rem);
          line-height: 1.7;
          color: var(--text-muted);
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
        }

        @media (max-width: 768px) {
          .grid-2 { grid-template-columns: 1fr; }
        }

        .btn-primary {
          background-color: var(--primary-blue);
          color: var(--white);
          border: none;
          padding: clamp(10px, 2vw, 12px) clamp(20px, 4vw, 32px);
          border-radius: 100px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: clamp(0.85rem, 2vw, 1rem);
        }

        @media (max-width: 480px) {
          .btn-primary {
            width: 100%;
            text-align: center;
          }
        }

        .btn-primary:hover {
          background-color: #004ac2;
          transform: translateY(-2px);
        }

        /* Idea Validation Section Styles */
        .validation-wrapper {
          padding: clamp(40px, 6vw, 80px) clamp(16px, 3vw, 32px);
          max-width: 100%;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .validation-wrapper { padding: clamp(32px, 5vw, 60px) clamp(12px, 3vw, 24px); max-width: 100%; }
        }

        .validation-card {
          background: #0B1019;
          border-radius: clamp(16px, 3vw, 24px);
          padding: clamp(32px, 5vw, 80px);
          color: var(--white);
          box-shadow: 0 40px 80px rgba(0,20,60,0.15);
        }

        .score-panel {
          background-color: #1A1F29;
          border-radius: clamp(12px, 2vw, 16px);
          padding: clamp(20px, 4vw, 32px);
        }

        .score-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding-bottom: clamp(12px, 3vw, 20px);
          margin-bottom: clamp(16px, 3vw, 24px);
        }

        @media (max-width: 480px) {
          .score-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }

        .score-title-text {
          font-size: clamp(0.65rem, 2vw, 0.75rem);
          font-weight: 800;
          color: #9CA3AF;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .score-number {
          font-size: clamp(1.2rem, 4vw, 1.5rem);
          font-weight: 800;
          color: var(--primary-blue);
        }

        .progress-row {
          margin-bottom: clamp(16px, 3vw, 20px);
        }

        .progress-labels {
          display: flex;
          justify-content: space-between;
          font-size: clamp(0.75rem, 2vw, 0.85rem);
          font-weight: 500;
          color: #D1D5DB;
          margin-bottom: clamp(6px, 2vw, 8px);
        }

        .progress-track {
          height: clamp(4px, 1vw, 6px);
          background-color: rgba(255,255,255,0.08);
          border-radius: clamp(2px, 0.5vw, 4px);
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background-color: var(--primary-blue);
          border-radius: 4px;
        }
        `
      }} />

      <Header />
      
      <main style={{ paddingTop: 'clamp(60px, 8vw, 80px)' }}>
        {/* Hero Section */}
        <section className="section-base">
          <h1 className="section-title section-title-left title-dark">Tools</h1>
          <p className="body-text" style={{ maxWidth: '600px', marginBottom: 'clamp(24px, 4vw, 40px)' }}>
            Accelerate your growth with our validated frameworks and assessment tools.
          </p>
        </section>

        {/* Idea Validation Section */}
        <div className="validation-wrapper section-base" style={{ backgroundColor: 'var(--white)' }}>
          <div className="validation-card grid-2">
            <div>
              <EditableText 
                as="h2"
                contentKey="studio.validation.title"
                value={studioContent.validation?.title || "Idea Validation"}
                className="section-title section-title-left title-dark"
              />
              <EditableText
                as="p"
                contentKey="studio.validation.description"
                value={studioContent.validation?.description || "Get an instant \"Build-Ready\" score based on our proprietary venture assessment framework."}
                className="body-text"
                style={{ marginBottom: 'clamp(24px, 4vw, 40px)', color: '#9CA3AF' }}
              />
              <Link href="/contact">
                <button className="btn-primary" style={{ backgroundColor: '#005AE2', boxShadow: '0 8px 32px rgba(0, 90, 226, 0.4)', padding: 'clamp(10px, 2vw, 12px) clamp(20px, 4vw, 32px)', borderRadius: '100px' }}>
                  <EditableText contentKey="studio.validation.buttonText" value={studioContent.validation?.buttonText || "Validate Your Idea"} />
                </button>
              </Link>
            </div>

            <div className="score-panel">
              <div className="score-header">
                <EditableText 
                  contentKey="studio.validation.scoreLabel"
                  value={studioContent.validation?.scoreLabel || "VENTURE READINESS SCORE"}
                  className="score-title-text"
                  style={{ color: '#9CA3AF', fontSize: 'clamp(0.6rem, 2vw, 0.7rem)', fontWeight: 700 }}
                />
                <EditableText 
                  contentKey="studio.validation.scoreValue"
                  value={studioContent.validation?.scoreValue || "84/100"}
                  className="score-number"
                  style={{ color: '#005AE2', fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', fontWeight: 800 }}
                />
              </div>

              <div className="progress-row">
                <div className="progress-labels">
                  <EditableText contentKey="studio.validation.marketFitLabel" value={studioContent.validation?.marketFitLabel || "Market Fit"} style={{ color: '#9CA3AF', fontSize: 'clamp(0.7rem, 2vw, 0.8rem)' }} />
                  <EditableText contentKey="studio.validation.marketFitValue" value={studioContent.validation?.marketFitValue || "92/100"} style={{ color: '#9CA3AF', fontSize: 'clamp(0.7rem, 2vw, 0.8rem)' }} />
                </div>
                <div className="progress-track" style={{ backgroundColor: '#2A303C', height: 'clamp(3px, 1vw, 4px)', borderRadius: 'clamp(1.5px, 0.5vw, 2px)' }}>
                  <div className="progress-fill" style={{ width: '92%', height: 'clamp(3px, 1vw, 4px)', borderRadius: 'clamp(1.5px, 0.5vw, 2px)', backgroundColor: '#005AE2' }}></div>
                </div>
              </div>

              <div className="progress-row">
                <div className="progress-labels">
                  <EditableText contentKey="studio.validation.techFeasibilityLabel" value={studioContent.validation?.techFeasibilityLabel || "Tech Feasibility"} style={{ color: '#9CA3AF', fontSize: 'clamp(0.7rem, 2vw, 0.8rem)' }} />
                  <EditableText contentKey="studio.validation.techFeasibilityValue" value={studioContent.validation?.techFeasibilityValue || "78/100"} style={{ color: '#9CA3AF', fontSize: 'clamp(0.7rem, 2vw, 0.8rem)' }} />
                </div>
                <div className="progress-track" style={{ backgroundColor: '#2A303C', height: 'clamp(3px, 1vw, 4px)', borderRadius: 'clamp(1.5px, 0.5vw, 2px)' }}>
                  <div className="progress-fill" style={{ width: '78%', height: 'clamp(3px, 1vw, 4px)', borderRadius: 'clamp(1.5px, 0.5vw, 2px)', backgroundColor: '#005AE2' }}></div>
                </div>
              </div>

              <div className="progress-row" style={{ marginBottom: 'clamp(16px, 3vw, 24px)' }}>
                <div className="progress-labels">
                  <EditableText contentKey="studio.validation.gtmStrategyLabel" value={studioContent.validation?.gtmStrategyLabel || "GTM Strategy"} style={{ color: '#9CA3AF', fontSize: 'clamp(0.7rem, 2vw, 0.8rem)' }} />
                  <EditableText contentKey="studio.validation.gtmStrategyValue" value={studioContent.validation?.gtmStrategyValue || "81/100"} style={{ color: '#9CA3AF', fontSize: 'clamp(0.7rem, 2vw, 0.8rem)' }} />
                </div>
                <div className="progress-track" style={{ backgroundColor: '#2A303C', height: 'clamp(3px, 1vw, 4px)', borderRadius: 'clamp(1.5px, 0.5vw, 2px)' }}>
                  <div className="progress-fill" style={{ width: '81%', height: 'clamp(3px, 1vw, 4px)', borderRadius: 'clamp(1.5px, 0.5vw, 2px)', backgroundColor: '#005AE2' }}></div>
                </div>
              </div>

              <div style={{ backgroundColor: '#122624', color: '#00E6A0', padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)', borderRadius: 'clamp(6px, 1.5vw, 8px)', fontSize: 'clamp(0.65rem, 2vw, 0.75rem)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: 'clamp(6px, 2vw, 8px)' }}>
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                <EditableText contentKey="studio.validation.growthBadge" value={studioContent.validation?.growthBadge || "High Growth Potential"} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}