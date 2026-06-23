'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EditableText from '@/components/admin/EditableText';
import SpotlightCursor from '@/components/effects/SpotlightCursor';
import BorderBeam from '@/components/effects/BorderBeam';
import Link from 'next/link';
import { useContent } from '@/context/ContentContext';
import { 
  Search, 
  Target, 
  ShieldCheck, 
  FlaskConical, 
  Shuffle, 
  Compass, 
  Rocket, 
  BarChart3, 
  UserPlus, 
  TrendingUp, 
  Map, 
  Check, 
  Sparkles 
} from 'lucide-react';

export default function ToolsPage() {
  const { content } = useContent();
  const toolsContent = (content as any)?.tools;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,700;1,800&display=swap');

        :root {
          --primary-blue: #005AE2;
          --bg-dark: #0A0F1C;
          --bg-light: #FFFFFF;
          --text-black: #0A0F1C;
          --text-muted: #64748B;
          --white: #FFFFFF;
          --border-light: rgba(0, 0, 0, 0.05);
          --border-dark: rgba(255, 255, 255, 0.1);
        }

        body, html {
          font-family: 'Inter', sans-serif;
          background-color: #FFFFFF;
          color: #0A0F1C;
        }

        /* Hero styles */
        .tools-hero {
          padding-top: 150px;
          padding-bottom: var(--section-padding-y);
          padding-inline: var(--section-padding-x);
          background: #FFFFFF;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .hero-eyebrow-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: #E6EFFF;
          color: #005AE2;
          padding: 6px 14px;
          border-radius: 100px;
          font-size: clamp(0.6875rem, 1vw, 0.8125rem);
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 24px;
          filter: blur(0.5px);
          text-shadow: 0 0 10px rgba(0, 90, 226, 0.3);
        }

        .hero-title-main {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(2rem, 4vw, 2.75rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: #0A0F1C;
          margin-bottom: 24px;
        }

        .italic-serif-blue {
          font-family: 'Manrope', sans-serif;
          font-style: normal;
          color: #005AE2;
          font-weight: 800;
          display: block;
          margin-top: 4px;
        }

        .hero-description-text {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(0.95rem, 2vw, 1.125rem);
          color: #64748B;
          max-width: 700px;
          margin: 0 auto 24px;
          line-height: 1.6;
          font-weight: 500;
        }

        .hero-btn-row {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }

        .btn-blue {
          background-color: #005AE2;
          color: #FFFFFF;
          padding: 16px 36px;
          border-radius: 100px;
          font-weight: 700;
          font-size: 15px;
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 20px -5px rgba(0, 90, 226, 0.3);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .btn-blue:hover {
          background-color: #004ac2;
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -5px rgba(0, 90, 226, 0.4);
        }

        .btn-outline {
          background-color: transparent;
          color: #005AE2;
          padding: 16px 36px;
          border-radius: 100px;
          font-weight: 700;
          font-size: 15px;
          border: 1px solid rgba(0, 90, 226, 0.15);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .btn-outline:hover {
          background-color: rgba(0, 90, 226, 0.04);
          border-color: #005AE2;
          transform: translateY(-2px);
        }

        /* Evaluate Section */
        .evaluate-section {
          background-color: #FFFFFF;
          text-align: center;
        }

        .eval-title {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(2rem, 4vw, 2.75rem);
          font-weight: 800;
          color: #0A0F1C;
          margin-bottom: 24px;
          letter-spacing: -0.02em;
        }

        .eval-description {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(0.95rem, 2vw, 1.125rem);
          color: #64748B;
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.6;
          font-weight: 500;
        }

        /* Dark Idea Validation Section */
        .idea-validation-dark {
          background: #0A0F1C;
          color: #FFFFFF;
          position: relative;
          overflow: hidden;
        }

        .validation-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(0, 90, 226, 0.15), transparent 70%);
          top: 50%;
          left: 80%;
          transform: translate(-50%, -50%);
          filter: blur(80px);
          pointer-events: none;
        }

        .validation-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 60px;
          max-width: 1200px;
          margin: 0 auto;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        @media (min-width: 900px) {
          .validation-grid {
            grid-template-columns: 1fr 1fr;
            gap: 80px;
          }
        }

        .validation-left h2 {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(2rem, 4vw, 2.75rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 24px;
          line-height: 1.1;
          color: #FFFFFF;
        }

        .validation-left p {
          font-size: clamp(0.95rem, 2vw, 1.125rem);
          color: #94A3B8;
          line-height: 1.6;
          margin-bottom: 40px;
          max-width: 500px;
        }

        .scorecard-panel {
          background: #0A0F1C;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.5);
          position: relative;
          overflow: hidden;
        }

        .scorecard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .scorecard-header-title {
          font-family: 'Manrope', sans-serif;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
        }

        .scorecard-number {
          font-family: 'Manrope', sans-serif;
          font-size: 2.25rem;
          font-weight: 800;
          color: #005AE2;
        }

        .progress-group {
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin-bottom: 32px;
        }

        .progress-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .progress-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.8125rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.9);
        }

        .progress-bar-bg {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 100px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: #005AE2;
          border-radius: 100px;
        }

        .scorecard-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 230, 160, 0.08);
          color: #00E6A0;
          border: 1px solid rgba(0, 230, 160, 0.15);
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 0.8125rem;
          font-weight: 700;
        }

        /* De-risk Roadmap Section */
        .roadmap-section {
          background-color: #FFFFFF;
          padding: var(--section-padding-y) var(--section-padding-x);
        }

        .roadmap-container {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }

        .roadmap-title {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(2rem, 4vw, 2.75rem);
          font-weight: 800;
          color: #0A0F1C;
          margin-bottom: 24px;
          letter-spacing: -0.02em;
        }

        .roadmap-subtitle {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(0.95rem, 2vw, 1.125rem);
          color: #64748B;
          max-width: 600px;
          margin: 0 auto 60px;
          line-height: 1.6;
          font-weight: 500;
        }

        .roadmap-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 32px;
          text-align: left;
        }

        .roadmap-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 24px;
          padding: 40px;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .roadmap-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 30px 60px -15px rgba(0, 90, 226, 0.08);
          border-color: rgba(0, 90, 226, 0.15);
        }

        .roadmap-card-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .icon-purple {
          background: rgba(79, 70, 229, 0.08);
          color: #4F46E5;
        }

        .icon-teal {
          background: rgba(13, 148, 136, 0.08);
          color: #0D9488;
        }

        .icon-grey {
          background: #F1F5F9;
          color: #64748B;
        }

        .roadmap-card-title {
          font-family: 'Manrope', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          color: #0A0F1C;
          margin-bottom: 16px;
          letter-spacing: -0.01em;
        }

        .roadmap-card-desc {
          color: #64748B;
          font-size: 0.95rem;
          line-height: 1.6;
          font-weight: 500;
        }

        /* Our Validation Engine */
        .engine-section {
          background: #0A0F1C;
          padding: var(--section-padding-y) var(--section-padding-x);
          color: #FFFFFF;
        }

        .engine-container {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }

        .engine-title {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(2rem, 4vw, 2.75rem);
          font-weight: 800;
          margin-bottom: 24px;
          letter-spacing: -0.02em;
          color: #FFFFFF;
        }

        .engine-subtitle {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(0.95rem, 2vw, 1.125rem);
          color: #94A3B8;
          max-width: 600px;
          margin: 0 auto 60px;
          line-height: 1.6;
          font-weight: 500;
        }

        .engine-timeline-row {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 32px;
          position: relative;
        }

        @media (min-width: 900px) {
          .engine-timeline-row {
            grid-template-columns: repeat(5, 1fr);
            gap: 20px;
          }

          .engine-timeline-row::before {
            content: '';
            position: absolute;
            top: 40px;
            left: 10%;
            right: 10%;
            height: 2px;
            background: rgba(255, 255, 255, 0.08);
            z-index: 0;
          }
        }

        .engine-step-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 1;
        }

        .engine-step-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          position: relative;
          transition: all 0.3s ease;
        }

        .circle-blue {
          background: rgba(0, 90, 226, 0.15);
          border: 2px solid rgba(0, 90, 226, 0.4);
          color: #005AE2;
        }

        .circle-teal-active {
          background: rgba(13, 148, 136, 0.2);
          border: 2px solid #0D9488;
          color: #0D9488;
          box-shadow: 0 0 20px rgba(13, 148, 136, 0.4);
        }

        .circle-purple {
          background: rgba(99, 102, 241, 0.15);
          border: 2px solid rgba(99, 102, 241, 0.4);
          color: #6366F1;
        }

        .circle-grey {
          background: rgba(148, 163, 184, 0.15);
          border: 2px solid rgba(148, 163, 184, 0.4);
          color: #94A3B8;
        }

        .circle-green {
          background: rgba(16, 185, 129, 0.15);
          border: 2px solid rgba(16, 185, 129, 0.4);
          color: #10B981;
        }

        .engine-step-label {
          font-family: 'Manrope', sans-serif;
          font-size: 0.8125rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          margin-bottom: 12px;
          text-transform: uppercase;
        }

        .label-teal {
          color: #0D9488;
        }

        .label-muted {
          color: #94A3B8;
        }

        .engine-step-desc {
          font-size: 0.875rem;
          color: #94A3B8;
          line-height: 1.5;
          font-weight: 500;
          max-width: 180px;
        }

        /* Market Intelligence Section */
        .market-intel-section {
          background-color: #FFFFFF;
          padding: var(--section-padding-y) var(--section-padding-x);
        }

        .market-intel-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .market-intel-title {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(2rem, 4vw, 2.75rem);
          font-weight: 800;
          color: #0A0F1C;
          margin-bottom: 60px;
          letter-spacing: -0.02em;
          text-align: left;
        }

        .market-intel-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 60px;
          align-items: center;
        }

        @media (min-width: 1024px) {
          .market-intel-grid {
            grid-template-columns: 1fr 1fr;
            gap: 80px;
          }
        }

        .market-intel-cards {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        @media (min-width: 600px) {
          .market-intel-cards {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .intel-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          padding: 32px;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .intel-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -10px rgba(0, 90, 226, 0.06);
          border-color: rgba(0, 90, 226, 0.15);
        }

        .intel-card-icon {
          color: #005AE2;
          margin-bottom: 20px;
        }

        .intel-card-title {
          font-family: 'Manrope', sans-serif;
          font-size: 1.25rem;
          font-weight: 800;
          color: #0A0F1C;
          margin-bottom: 12px;
          letter-spacing: -0.01em;
        }

        .intel-card-desc {
          color: #64748B;
          font-size: 0.875rem;
          line-height: 1.5;
          font-weight: 500;
        }

        .intel-right-panel {
          background: #0A0F1C;
          border-radius: 32px;
          padding: 16px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .intel-image-wrapper {
          position: relative;
          width: 100%;
          border-radius: 20px;
          overflow: hidden;
        }

        .intel-image {
          width: 100%;
          height: auto;
          object-fit: cover;
          display: block;
          border-radius: 20px;
        }

        /* Bottom CTA Section */
        .bottom-cta-section {
          background: #0A0F1C;
          padding: var(--section-padding-y) var(--section-padding-x);
          color: #FFFFFF;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .bottom-cta-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(0, 90, 226, 0.22), transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          filter: blur(80px);
          pointer-events: none;
        }

        .bottom-cta-container {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .bottom-cta-title {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(2rem, 4vw, 2.75rem);
          font-weight: 800;
          margin-bottom: 24px;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: #FFFFFF;
        }

        .bottom-cta-subtitle {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(0.95rem, 2vw, 1.125rem);
          color: #94A3B8;
          max-width: 600px;
          margin: 0 auto 48px;
          line-height: 1.6;
          font-weight: 500;
        }
      `}} />

      <Header />

      <main>
        {/* HERO SECTION */}
        <section className="tools-hero">
          <SpotlightCursor color="rgba(0, 90, 226, 0.08)" />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="hero-eyebrow-pill">STUDIO TOOLS</div>
            <h1 className="hero-title-main">
              <EditableText
                contentKey="tools.hero.title"
                value={toolsContent?.hero?.title || 'Validate Ideas'}
              />
              <span className="italic-serif-blue">
                <EditableText
                  contentKey="tools.hero.highlight"
                  value={toolsContent?.hero?.highlight || 'Before You Build'}
                />
              </span>
            </h1>
            
            <p className="hero-description-text">
              <EditableText
                contentKey="tools.hero.subtitle"
                value={toolsContent?.hero?.subtitle || 'We help founders transform raw concepts into market-ready ventures through research, strategic validation, and real-world insights.'}
              />
            </p>

            <div className="hero-btn-row">
              <Link href="/contact" className="btn-blue">
                <EditableText
                  contentKey="tools.hero.btnPrimary"
                  value={toolsContent?.hero?.btnPrimary || 'Validate Your Idea'}
                />
              </Link>
              <Link href="/contact" className="btn-outline">
                <EditableText
                  contentKey="tools.hero.btnSecondary"
                  value={toolsContent?.hero?.btnSecondary || 'Book a Discovery Call'}
                />
              </Link>
            </div>
          </div>
        </section>

        {/* EVALUATE YOUR IDEA SECTION */}
        <section className="evaluate-section">
          <div className="section-container">
            <h2 className="eval-title">
              <EditableText
                contentKey="tools.eval.title"
                value={toolsContent?.eval?.title || 'Evaluate Your Idea'}
              />
            </h2>
            <p className="eval-description">
              <EditableText
                contentKey="tools.eval.desc"
                value={toolsContent?.eval?.desc || 'We validate ideas through market research, user insights, and strategic analysis to ensure real-world demand. Our process helps founders refine concepts, reduce risk, and build solutions with strong market potential.'}
              />
            </p>
          </div>
        </section>

        {/* IDEA VALIDATION SCORECARD SECTION */}
        <section className="idea-validation-dark page-section">
          <SpotlightCursor color="rgba(0, 90, 226, 0.15)" />
          <div className="validation-glow"></div>
          
          <div className="validation-grid">
            <div className="validation-left">
              <h2>
                <EditableText
                  contentKey="tools.validation.title"
                  value={toolsContent?.validation?.title || 'Idea Validation'}
                />
              </h2>
              <p>
                <EditableText
                  contentKey="tools.validation.desc"
                  value={toolsContent?.validation?.desc || 'Get an instant "Build-Ready" score based on our proprietary venture assessment framework.'}
                />
              </p>
              <Link href="/contact" className="btn-blue">
                <EditableText
                  contentKey="tools.validation.btn"
                  value={toolsContent?.validation?.btn || 'Validate Your Idea'}
                />
              </Link>
            </div>

            <BorderBeam className="scorecard-panel" style={{ padding: 0 }}>
              <div style={{ padding: '40px' }}>
                <div className="scorecard-header">
                  <span className="scorecard-header-title">
                    <EditableText
                      contentKey="tools.validation.scoreTitle"
                      value={toolsContent?.validation?.scoreTitle || 'VENTURE READINESS SCORE'}
                    />
                  </span>
                  <span className="scorecard-number">
                    <EditableText
                      contentKey="tools.validation.score"
                      value={toolsContent?.validation?.score || '84/100'}
                    />
                  </span>
                </div>

                <div className="progress-group">
                  <div className="progress-item">
                    <div className="progress-label-row">
                      <span>Market Fit</span>
                      <span>92%</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: '92%' }}></div>
                    </div>
                  </div>

                  <div className="progress-item">
                    <div className="progress-label-row">
                      <span>Tech Feasibility</span>
                      <span>78%</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: '78%' }}></div>
                    </div>
                  </div>

                  <div className="progress-item">
                    <div className="progress-label-row">
                      <span>GTM Strategy</span>
                      <span>81%</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: '81%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="scorecard-badge">
                  <Sparkles size={14} />
                  <span>
                    <EditableText
                      contentKey="tools.validation.badge"
                      value={toolsContent?.validation?.badge || 'High Growth Potential Detected'}
                    />
                  </span>
                </div>
              </div>
            </BorderBeam>
          </div>
        </section>

        {/* DE-RISK YOUR ROADMAP SECTION */}
        <section className="roadmap-section">
          <div className="roadmap-container">
            <h2 className="roadmap-title">
              <EditableText
                contentKey="tools.roadmap.title"
                value={toolsContent?.roadmap?.title || 'De-risk Your Roadmap'}
              />
            </h2>
            <p className="roadmap-subtitle">
              <EditableText
                contentKey="tools.roadmap.subtitle"
                value={toolsContent?.roadmap?.subtitle || 'Stop guessing what your customers want. We use data-driven methodologies to ensure your product solves actual market problems.'}
              />
            </p>

            <div className="roadmap-grid">
              {/* Card 1 */}
              <div className="roadmap-card">
                <div className="roadmap-card-icon-box icon-purple">
                  <Search size={22} strokeWidth={2.2} />
                </div>
                <h3 className="roadmap-card-title">
                  <EditableText
                    contentKey="tools.roadmap.card1Title"
                    value={toolsContent?.roadmap?.card1Title || 'Identify Pain Points'}
                  />
                </h3>
                <p className="roadmap-card-desc">
                  <EditableText
                    contentKey="tools.roadmap.card1Desc"
                    value={toolsContent?.roadmap?.card1Desc || "Deep-dive discovery to uncover the core friction points in your target market's daily operations."}
                  />
                </p>
              </div>

              {/* Card 2 */}
              <div className="roadmap-card">
                <div className="roadmap-card-icon-box icon-teal">
                  <Target size={22} strokeWidth={2.2} />
                </div>
                <h3 className="roadmap-card-title">
                  <EditableText
                    contentKey="tools.roadmap.card2Title"
                    value={toolsContent?.roadmap?.card2Title || 'Behavioral Mapping'}
                  />
                </h3>
                <p className="roadmap-card-desc">
                  <EditableText
                    contentKey="tools.roadmap.card2Desc"
                    value={toolsContent?.roadmap?.card2Desc || 'Analyze how users currently interact with existing solutions to find hidden opportunities for disruption.'}
                  />
                </p>
              </div>

              {/* Card 3 */}
              <div className="roadmap-card">
                <div className="roadmap-card-icon-box icon-grey">
                  <ShieldCheck size={22} strokeWidth={2.2} />
                </div>
                <h3 className="roadmap-card-title">
                  <EditableText
                    contentKey="tools.roadmap.card3Title"
                    value={toolsContent?.roadmap?.card3Title || 'Demand Validation'}
                  />
                </h3>
                <p className="roadmap-card-desc">
                  <EditableText
                    contentKey="tools.roadmap.card3Desc"
                    value={toolsContent?.roadmap?.card3Desc || 'Secure tangible evidence of market demand through pilot tests and pre-launch engagement metrics.'}
                  />
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* OUR VALIDATION ENGINE SECTION */}
        <section className="engine-section">
          <div className="engine-container">
            <h2 className="engine-title">
              <EditableText
                contentKey="tools.engine.title"
                value={toolsContent?.engine?.title || 'Our Validation Engine'}
              />
            </h2>
            <p className="engine-subtitle">
              <EditableText
                contentKey="tools.engine.subtitle"
                value={toolsContent?.engine?.subtitle || 'A systematic approach to moving from uncertainty to high-conviction product development.'}
              />
            </p>

            <div className="engine-timeline-row">
              {/* Step 1 */}
              <div className="engine-step-card">
                <div className="engine-step-circle circle-blue">
                  <Search size={26} strokeWidth={2} />
                </div>
                <span className="engine-step-label label-muted">
                  <EditableText contentKey="tools.engine.step1Title" value={toolsContent?.engine?.step1Title || 'Discovery'} />
                </span>
                <p className="engine-step-desc">
                  <EditableText contentKey="tools.engine.step1Desc" value={toolsContent?.engine?.step1Desc || 'Hypothesis forming & scope definition.'} />
                </p>
              </div>

              {/* Step 2 */}
              <div className="engine-step-card">
                <div className="engine-step-circle circle-teal-active">
                  <FlaskConical size={26} strokeWidth={2} />
                </div>
                <span className="engine-step-label label-teal">
                  <EditableText contentKey="tools.engine.step2Title" value={toolsContent?.engine?.step2Title || 'Research'} />
                </span>
                <p className="engine-step-desc">
                  <EditableText contentKey="tools.engine.step2Desc" value={toolsContent?.engine?.step2Desc || 'Market & user data gathering.'} />
                </p>
              </div>

              {/* Step 3 */}
              <div className="engine-step-card">
                <div className="engine-step-circle circle-blue">
                  <Shuffle size={26} strokeWidth={2} />
                </div>
                <span className="engine-step-label label-muted">
                  <EditableText contentKey="tools.engine.step3Title" value={toolsContent?.engine?.step3Title || 'Validation'} />
                </span>
                <p className="engine-step-desc">
                  <EditableText contentKey="tools.engine.step3Desc" value={toolsContent?.engine?.step3Desc || 'Testing core assumptions with users.'} />
                </p>
              </div>

              {/* Step 4 */}
              <div className="engine-step-card">
                <div className="engine-step-circle circle-purple">
                  <Compass size={26} strokeWidth={2} />
                </div>
                <span className="engine-step-label label-muted">
                  <EditableText contentKey="tools.engine.step4Title" value={toolsContent?.engine?.step4Title || 'MVP Direction'} />
                </span>
                <p className="engine-step-desc">
                  <EditableText contentKey="tools.engine.step4Desc" value={toolsContent?.engine?.step4Desc || 'Technical & feature roadmap.'} />
                </p>
              </div>

              {/* Step 5 */}
              <div className="engine-step-card">
                <div className="engine-step-circle circle-green">
                  <Rocket size={26} strokeWidth={2} />
                </div>
                <span className="engine-step-label label-muted">
                  <EditableText contentKey="tools.engine.step5Title" value={toolsContent?.engine?.step5Title || 'Launch Ready'} />
                </span>
                <p className="engine-step-desc">
                  <EditableText contentKey="tools.engine.step5Desc" value={toolsContent?.engine?.step5Desc || 'Validated pitch & pilot strategy.'} />
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* COMPREHENSIVE MARKET INTELLIGENCE SECTION */}
        <section className="market-intel-section">
          <div className="market-intel-container">
            <h2 className="market-intel-title">
              <EditableText
                contentKey="tools.market.title"
                value={toolsContent?.market?.title || 'Comprehensive Market Intelligence'}
              />
            </h2>

            <div className="market-intel-grid">
              <div className="market-intel-cards">
                {/* Intel Card 1 */}
                <div className="intel-card">
                  <BarChart3 className="intel-card-icon" size={24} />
                  <h3 className="intel-card-title">
                    <EditableText contentKey="tools.market.card1Title" value={toolsContent?.market?.card1Title || 'Competitor Analysis'} />
                  </h3>
                  <p className="intel-card-desc">
                    <EditableText contentKey="tools.market.card1Desc" value={toolsContent?.market?.card1Desc || 'Detailed breakdown of market incumbents and white-space opportunities.'} />
                  </p>
                </div>

                {/* Intel Card 2 */}
                <div className="intel-card">
                  <UserPlus className="intel-card-icon" size={24} />
                  <h3 className="intel-card-title">
                    <EditableText contentKey="tools.market.card2Title" value={toolsContent?.market?.card2Title || 'Customer Interviews'} />
                  </h3>
                  <p className="intel-card-desc">
                    <EditableText contentKey="tools.market.card2Desc" value={toolsContent?.market?.card2Desc || 'Qualitative insights gathered from direct engagements with your ideal users.'} />
                  </p>
                </div>

                {/* Intel Card 3 */}
                <div className="intel-card">
                  <TrendingUp className="intel-card-icon" size={24} />
                  <h3 className="intel-card-title">
                    <EditableText contentKey="tools.market.card3Title" value={toolsContent?.market?.card3Title || 'Trend Analysis'} />
                  </h3>
                  <p className="intel-card-desc">
                    <EditableText contentKey="tools.market.card3Desc" value={toolsContent?.market?.card3Desc || 'Forecasting market movements to ensure long-term product viability.'} />
                  </p>
                </div>

                {/* Intel Card 4 */}
                <div className="intel-card">
                  <Map className="intel-card-icon" size={24} />
                  <h3 className="intel-card-title">
                    <EditableText contentKey="tools.market.card4Title" value={toolsContent?.market?.card4Title || 'Opportunity Mapping'} />
                  </h3>
                  <p className="intel-card-desc">
                    <EditableText contentKey="tools.market.card4Desc" value={toolsContent?.market?.card4Desc || 'Visualizing high-impact features that drive maximum ROI.'} />
                  </p>
                </div>
              </div>

              <div className="intel-right-panel">
                <div className="intel-image-wrapper">
                  <img 
                    src="/images/market_dashboard.png" 
                    alt="Comprehensive Market Intelligence Dashboard Mockup" 
                    className="intel-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA SECTION */}
        <section className="bottom-cta-section">
          <SpotlightCursor color="rgba(0, 90, 226, 0.15)" />
          <div className="bottom-cta-glow"></div>
          <div className="bottom-cta-container">
            <h2 className="bottom-cta-title">
              <EditableText
                contentKey="tools.cta.title"
                value={toolsContent?.cta?.title || 'Turn Your Vision Into a Validated Venture'}
              />
            </h2>
            <p className="bottom-cta-subtitle">
              <EditableText
                contentKey="tools.cta.subtitle"
                value={toolsContent?.cta?.subtitle || 'Ready to stop guessing and start growing? Our intelligence-first framework is designed for the world\'s most ambitious founders.'}
              />
            </p>
            <Link href="/contact" className="btn-blue" style={{ background: '#005AE2' }}>
              <EditableText
                contentKey="tools.cta.btn"
                value={toolsContent?.cta?.btn || 'Start Validation Process'}
              />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}