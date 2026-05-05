'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useContent } from '@/context/ContentContext';
import EditableText from '@/components/admin/EditableText';
import { Cpu, Layers, TrendingUp, Sparkles, ShieldCheck, ChevronRight, Check, X, Code, Search, Zap, Server, Edit3, ArrowRight, Play, Globe, Rocket, Shield, Clock } from 'lucide-react';

export default function OurModelPage() {
  const { content, loading, error } = useContent();

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#F3F5F9] font-manrope">Loading our model...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen bg-[#F3F5F9] font-manrope text-red-500">Error: {error}</div>;
  if (!content || !content.ourModel) return null;

  const modelContent = content.ourModel;

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

        :root {
          --bg-base: #F3F5F9;
          --bg-light: #F8FAFC;
          --bg-dark: #0A0F1C;
          --bg-grey: #F1F5F9;
          
          --primary: #4F46E5;
          --primary-blue: #005AE2;
          
          --text-black: #020617;
          --text-main: #0F172A;
          --text-muted: #64748B;
          --white: #FFFFFF;
          
          --border-light: #E2E8F0;
          --border-dark: rgba(255, 255, 255, 0.1);
        }

        body, html {
          margin: 0;
          padding: 0;
          font-family: 'Inter', sans-serif;
          background-color: var(--bg-light);
          color: var(--text-black);
          scroll-behavior: smooth;
        }
        
        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; box-sizing: border-box; }

        h1, h2, h3, h4, h5, h6, .section-title, .section-eyebrow, .card-title {
          font-family: 'Manrope', sans-serif;
        }

        p, span, div, button, a {
          font-family: 'Inter', sans-serif;
        }

        .section-container { max-width: 1200px; margin: 0 auto; padding: clamp(40px, 6vw, 80px) 24px; }
        
        .section-container { max-width: 1200px; margin: 0 auto; padding: clamp(40px, 6vw, 60px) 24px; }
        
        /* Section 1: Hero */
        .hero-section {
          background: #F8FAFC;
          padding: 60px 0 40px;
          overflow: hidden;
        }

        .hero-eyebrow-pill {
          display: inline-block;
          background: #E0E7FF;
          color: var(--primary-blue);
          padding: 10px 24px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.2em;
          margin-bottom: 24px;
          text-transform: uppercase;
        }

        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 900;
          line-height: 1.0;
          letter-spacing: -0.05em;
          color: var(--text-black);
          margin-bottom: 24px;
        }

        .text-blue { color: var(--primary-blue); }

        .hero-description {
          font-size: 1.125rem;
          line-height: 1.6;
          color: #64748B;
          margin-bottom: 32px;
          max-width: 600px;
        }

        .hero-info-box {
          background: #EEF2FF;
          border-left: 6px solid var(--primary-blue);
          padding: 24px 32px;
          border-radius: 4px 24px 24px 4px;
          margin-bottom: 40px;
          font-size: 1.125rem;
          font-weight: 700;
          line-height: 1.4;
          color: var(--primary-blue);
          max-width: 600px;
        }

        .hero-buttons {
          display: flex;
          gap: 20px;
        }

        .btn-primary {
          background: var(--primary-blue);
          color: white;
          padding: 20px 44px;
          border-radius: 100px;
          font-weight: 800;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 12px 28px -5px rgba(0, 90, 226, 0.4);
          font-size: 1rem;
        }

        .btn-primary:hover {
          background: #004ac2;
          transform: translateY(-3px);
          box-shadow: 0 18px 32px -5px rgba(0, 90, 226, 0.5);
        }

        .btn-outline {
          background: transparent;
          border: 2px solid var(--border-light);
          color: var(--text-main);
          padding: 20px 44px;
          border-radius: 100px;
          font-weight: 800;
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .btn-outline:hover {
          background: #F8FAFC;
          border-color: var(--primary-blue);
          color: var(--primary-blue);
        }

        .hero-image-container {
          position: relative;
          border-radius: 40px;
          overflow: hidden;
          background: #000;
          aspect-ratio: 1/1;
          box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.4);
        }

        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.95;
        }

        @media (max-width: 968px) {
          .hero-grid { grid-template-columns: 1fr; text-align: left; }
          .hero-description { margin-left: 0; }
          .hero-buttons { justify-content: flex-start; flex-direction: column; }
          .hero-image-container { max-width: 450px; margin: 0; }
        }

        /* Section 2: Tabs */
        .phases-section {
          background: white;
          border-bottom: 1px solid #E2E8F0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .phases-tabs {
          display: flex;
          justify-content: space-between;
          padding: 16px 0;
          max-width: 800px;
          margin: 0 auto;
        }

        .phase-tab {
          background: none;
          border: none;
          font-family: 'Manrope', sans-serif;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #94A3B8;
          cursor: pointer;
          padding: 8px 12px;
          position: relative;
          transition: all 0.3s ease;
        }

        .phase-tab.active {
          color: var(--primary-blue);
        }

        .phase-tab.active::after {
          content: '';
          position: absolute;
          bottom: -17px;
          left: 0;
          width: 100%;
          height: 5px;
          background: #2563EB;
          border-radius: 2px 2px 0 0;
        }

        .phase-content-section {
          background: var(--bg-light);
          padding: 80px 0;
        }

        .phase-content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .phase-label {
          color: var(--primary-blue);
          font-weight: 800;
          font-size: 0.8125rem;
          letter-spacing: 0.1em;
          margin-bottom: 16px;
        }

        .phase-title {
          font-size: clamp(2rem, 4vw, 2.75rem);
          font-weight: 800;
          margin-bottom: 24px;
          letter-spacing: -0.02em;
        }

        .phase-description {
          font-size: 1.125rem;
          line-height: 1.7;
          color: var(--text-muted);
          margin-bottom: 32px;
        }

        .phase-metrics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .metric-card {
          background: white;
          padding: 24px;
          border-radius: 16px;
          border: 1px solid var(--border-light);
        }

        .metric-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-black);
          margin-bottom: 4px;
        }

        .metric-label {
          font-size: 0.875rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        /* Selection Section */
        /* Section 3: Phase 01 — Selection */
        .selection-section {
          padding: 60px 0;
          background: white;
        }

        .selection-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
          margin-top: 32px;
        }

        .selection-filters::-webkit-scrollbar {
          display: none;
        }

        .selection-card {
          padding: 32px;
          border-radius: 20px;
          background: #F5F7FF;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
          position: relative;
        }

        .selection-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.1);
          border-color: var(--primary-blue);
        }

        .card-icon-wrapper {
          width: 56px;
          height: 56px;
          background: #EEF2FF;
          color: var(--primary-blue);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 16px;
          color: var(--text-black);
          letter-spacing: -0.02em;
        }

        .card-description {
          font-size: 1.0625rem;
          line-height: 1.6;
          color: #64748B;
        }

        @media (max-width: 968px) {
          .selection-grid { grid-template-columns: 1fr; }
        }

        /* Section 3: Phase 02 */
        .clinical-validation-section {
          background: #F0F5FF;
          padding: 80px 0;
          text-align: center;
        }

        .step-circles-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-top: 64px;
          margin-bottom: 64px;
        }

        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .step-number-circle {
          width: 44px;
          height: 44px;
          background: var(--primary-blue);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.125rem;
          margin-bottom: 24px;
          box-shadow: 0 8px 16px rgba(0, 90, 226, 0.3);
        }

        .step-title {
          font-size: 1rem;
          font-weight: 800;
          color: var(--text-black);
          margin-bottom: 8px;
        }

        .step-desc {
          font-size: 0.8125rem;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .outcome-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-top: 48px;
        }

        .outcome-card {
          background: white;
          padding: 32px;
          border-radius: 12px;
          text-align: left;
          border: 1px solid var(--border-light);
          position: relative;
        }

        .outcome-card.proceed { border-left: 6px solid #10B981; }
        .outcome-card.iterate { border-left: 6px solid #F59E0B; }
        .outcome-card.kill { border-left: 6px solid #EF4444; }

        .outcome-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-black);
        }

        .outcome-icon { width: 24px; height: 24px; }
        .proceed-text { color: #10B981; }
        .iterate-text { color: #F59E0B; }
        .kill-text { color: #EF4444; }

        .outcome-desc {
          font-size: 0.9375rem;
          line-height: 1.6;
          color: var(--text-muted);
        }

        @media (max-width: 968px) {
          .step-circles-row { grid-template-columns: repeat(2, 1fr); }
          .outcome-grid { grid-template-columns: 1fr; }
        }

        /* Execution Section (Section 4) */
        .post-greenlight-section {
          background: white;
          padding: 80px 0;
        }

        .post-greenlight-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 48px;
          margin-top: 48px;
        }

        .phase-step-card {
          padding-left: 20px;
          border-left: 3px solid var(--primary-blue);
        }

        .phase-step-label {
          display: block;
          font-size: 0.6875rem;
          font-weight: 800;
          color: var(--primary-blue);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 12px;
        }

        .phase-step-title {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 16px;
          color: var(--text-black);
        }

        .phase-step-description {
          font-size: 0.875rem;
          line-height: 1.6;
          color: var(--text-muted);
        }

        .gate-table-wrapper {
          margin-top: 64px;
          border: 1px solid var(--border-light);
          border-radius: 8px;
          overflow: hidden;
        }

        .gate-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
        }

        .gate-table th {
          background: #F1F1F9;
          padding: 20px 24px;
          text-align: left;
          font-weight: 800;
          color: var(--text-black);
          border-bottom: 1px solid var(--border-light);
        }

        .gate-table td {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-light);
        }

        .gate-table tr:last-child td { border-bottom: none; }

        .text-green { color: #10B981; font-weight: 600; }
        .text-yellow { color: #F59E0B; font-weight: 600; }
        .text-red { color: #EF4444; font-weight: 600; }

        @media (max-width: 968px) {
          .post-greenlight-grid { grid-template-columns: 1fr; }
        }

        /* Pods Section */
        .pods-section {
          background: var(--bg-dark);
          padding: 120px 0;
          color: white;
          text-align: center;
          position: relative;
        }

        .pods-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 20px;
          margin-top: 64px;
        }

        .pod-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 40px 24px;
          border-radius: 16px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: left;
        }

        .pod-card:hover {
          background: rgba(255, 255, 255, 0.07);
          border-color: var(--primary-blue);
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .pod-id {
          font-size: 0.625rem;
          font-weight: 800;
          color: var(--primary-blue);
          text-transform: uppercase;
          letter-spacing: 0.2em;
          margin-bottom: 16px;
          display: block;
        }

        .pod-title {
          font-size: 1.25rem;
          font-weight: 800;
          margin-bottom: 16px;
          color: white;
        }

        .pod-description {
          font-size: 0.875rem;
          line-height: 1.6;
          color: #94A3B8;
        }

        .stats-row {
          display: flex;
          justify-content: center;
          gap: 120px;
          margin-top: 100px;
          padding-top: 100px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-value {
          font-size: 3.5rem;
          font-weight: 800;
          color: white;
          margin-bottom: 12px;
          letter-spacing: -0.02em;
        }

        .stat-label {
          font-size: 0.8125rem;
          font-weight: 700;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }

        @media (max-width: 1200px) {
          .pods-grid { grid-template-columns: repeat(3, 1fr); }
          .stats-row { gap: 64px; }
        }
        @media (max-width: 768px) {
          .pods-grid { grid-template-columns: 1fr; }
          .stats-row { flex-direction: column; gap: 48px; }
          .stat-value { font-size: 2.5rem; }
        }

        /* Comparison Section */
        .comparison-section {
          background: #F8FAFC;
          padding: 100px 0;
        }

        .comparison-table-wrapper {
          max-width: 1000px;
          margin: 64px auto 0;
          background: white;
          border-radius: 12px;
          border: 1px solid var(--border-light);
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .comparison-table {
          width: 100%;
          border-collapse: collapse;
        }

        .comparison-table th {
          padding: 24px;
          text-align: left;
          font-size: 0.875rem;
          font-weight: 800;
          color: var(--text-black);
          border-bottom: 1px solid var(--border-light);
          background: white;
        }

        .comparison-table td {
          padding: 20px 24px;
          font-size: 0.9375rem;
          color: var(--text-muted);
          border-bottom: 1px solid #F1F5F9;
        }

        .comparison-table tr:last-child td { border-bottom: none; }

        .feature-cell {
          font-weight: 700;
          color: var(--text-black) !important;
          width: 25%;
        }

        .studio-highlight {
          background: #F0F5FF;
          color: var(--primary-blue) !important;
          font-weight: 700;
          width: 25%;
        }

        .studio-header {
          background: #F0F5FF !important;
          color: var(--primary-blue) !important;
        }

        /* Final CTA Section */
        .final-cta-section {
          background: var(--bg-light);
          padding: 100px 24px;
          text-align: center;
        }

        .cta-container {
          max-width: 1000px;
          margin: 0 auto;
          background: var(--primary-blue);
          padding: 80px 40px;
          border-radius: 24px;
          color: white;
          position: relative;
          overflow: hidden;
          background-image: linear-gradient(135deg, #005AE2 0%, #0046B1 100%);
        }

        .cta-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 16px;
          color: white;
        }

        .cta-description {
          font-size: 1.125rem;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 40px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
        }

        .btn-white {
          background: white;
          color: var(--primary-blue);
          padding: 16px 32px;
          border-radius: 100px;
          font-weight: 800;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .btn-white:hover {
          background: #F1F5F9;
          transform: translateY(-2px);
        }

        .btn-outline-white {
          background: transparent;
          border: 2px solid white;
          color: white;
          padding: 16px 32px;
          border-radius: 100px;
          font-weight: 800;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .btn-outline-white:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 768px) {
          .comparison-table-wrapper { display: block; overflow-x: auto; }
          .comparison-table th, .comparison-table td { min-width: 140px; padding: 16px; }
          .cta-title { font-size: 2rem; }
          .cta-buttons { flex-direction: column; }
        }

        .cta-gradient-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 50% 50%, rgba(0, 90, 226, 0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        .cta-content {
          position: relative;
          z-index: 1;
        }

        .cta-title {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 800;
          color: white;
          margin-bottom: 32px;
          letter-spacing: -0.04em;
        }

        .cta-button {
          display: inline-block;
          background: white;
          color: var(--primary-blue);
          padding: 20px 48px;
          border-radius: 100px;
          font-weight: 800;
          font-size: 1.125rem;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5);
        }

        .cta-button:hover {
          transform: translateY(-5px);
          box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.6);
          background: #f8fafc;
        }
        `
      }} />

      <div className="our-model-page">
        <Header />

        {/* SECTION 1: HERO */}
        <section className="hero-section" style={{ background: 'white' }}>
          <div className="section-container">
            <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '80px', alignItems: 'center' }}>
              <div className="hero-content">
                <div className="hero-eyebrow-pill" style={{ background: '#E0E7FF', color: '#4F46E5', fontWeight: 700, padding: '8px 16px', fontSize: '0.6875rem' }}>
                  <EditableText contentKey="ourModel.hero.eyebrow" value={content.ourModel.hero.eyebrow} />
                </div>
                <h1 className="hero-title" style={{ fontSize: '4rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginTop: '24px' }}>
                  <EditableText contentKey="ourModel.hero.title" value={content.ourModel.hero.title} />
                </h1>
                <p className="hero-description" style={{ fontSize: '1rem', color: '#4B5563', lineHeight: 1.6, marginTop: '24px' }}>
                  <EditableText contentKey="ourModel.hero.description" value={content.ourModel.hero.description} />
                </p>
                <div className="hero-info-box" style={{ background: '#F5F7FF', borderLeft: '3px solid #4F46E5', padding: '24px', borderRadius: '4px', marginTop: '32px', color: '#374151', fontSize: '0.9375rem', fontWeight: 500, fontStyle: 'normal' }}>
                  <EditableText contentKey="ourModel.hero.quote" value={content.ourModel.hero.quote} />
                </div>
                <div className="hero-buttons" style={{ marginTop: '32px', display: 'flex', gap: '16px' }}>
                  <Link href="/contact" style={{ 
                    display: 'inline-block',
                    background: '#2563EB', 
                    color: 'white',
                    padding: '16px 40px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '1rem',
                    transition: 'all 0.3s ease'
                  }}>
                    <EditableText contentKey="ourModel.hero.primaryButton" value={content.ourModel.hero.primaryButton} />
                  </Link>
                  <Link href="#phases" style={{ 
                    display: 'inline-block',
                    background: '#EEF2FF', 
                    color: '#2563EB',
                    padding: '16px 40px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '1rem',
                    transition: 'all 0.3s ease'
                  }}>
                    <EditableText contentKey="ourModel.hero.secondaryButton" value={content.ourModel.hero.secondaryButton} />
                  </Link>
                </div>
              </div>
            <div style={{ position: 'relative', marginTop: '120px' }}>
              <div style={{ 
                background: '#E2E8F0', 
                borderRadius: '40px', 
                padding: '16px',
                boxShadow: '0 30px 60px rgba(0,0,0,0.08)',
                position: 'relative'
              }}>
                <div style={{ width: '100%', aspectRatio: '1/1', background: '#000', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', position: 'relative' }}>
                  <img 
                    src="/images/playbook_hero.png" 
                    alt="Venture Engineering Playbook" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
                  />
                  {/* Decorative Overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%)' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* SECTION 2: STICKY TABS */}
        <div id="phases" className="phases-section" style={{ borderTop: '1px solid #F1F5F9', background: '#F8FAFC' }}>
          <div className="section-container" style={{ paddingTop: 0, paddingBottom: 0 }}>
            <div className="phases-tabs" style={{ maxWidth: '1000px' }}>
              {[
                { n: '01.', t: 'SELECT' },
                { n: '02.', t: 'VALIDATE' },
                { n: '03.', t: 'BUILD' },
                { n: '04.', t: 'LAUNCH' },
                { n: '05.', t: 'SCALE' }
              ].map((phase, i) => (
                <button 
                  key={phase.t} 
                  className={`phase-tab ${i === 0 ? 'active' : ''}`}
                  style={{ fontSize: '0.6875rem', fontWeight: 800 }}
                >
                  <span style={{ color: '#4F46E5', marginRight: '4px', opacity: 1, fontWeight: 900 }}>{phase.n}</span> {phase.t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 3: PHASE 01 — SELECTION */}
        <section className="selection-section" id="discovery" style={{ padding: '40px 0' }}>
          <div className="section-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', gap: '32px' }}>
              <div style={{ flexShrink: 1 }}>
                <div className="phase-label" style={{ marginBottom: '6px', textTransform: 'uppercase', fontSize: '0.6875rem', fontWeight: 800, color: '#2563EB' }}>
                  <EditableText contentKey="ourModel.selection.label" value="PHASE 01" />
                </div>
                <h2 className="phase-title" style={{ fontSize: '2.125rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', color: '#111827' }}>
                  <EditableText contentKey="ourModel.selection.title" value="How We Choose What to Build" />
                </h2>
              </div>
              <div className="selection-filters" style={{ 
                display: 'flex', 
                gap: '8px', 
                margin: 0, 
                alignItems: 'center', 
                flexWrap: 'nowrap', 
                overflowX: 'auto', 
                msOverflowStyle: 'none', 
                scrollbarWidth: 'none',
                padding: '4px 0'
              }}>
                {[
                  { t: 'Market Fit', a: true },
                  { t: 'Scalability', a: false },
                  { t: 'Defensibility', a: false },
                  { t: 'Moat Strength', a: false },
                  { t: 'Execution Complexity', a: false }
                ].map((filter, fidx) => (
                  <div 
                    key={fidx} 
                    style={{ 
                      fontSize: '0.75rem', 
                      padding: '8px 20px', 
                      borderRadius: '100px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      background: filter.a ? '#2563EB' : '#F3F4F6',
                      color: filter.a ? 'white' : '#4B5563'
                    }}
                  >
                    <EditableText contentKey={`ourModel.selection.filters.${fidx}`} value={filter.t} />
                  </div>
                ))}
              </div>
            </div>

            <div className="selection-grid">
              <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>
                  <EditableText contentKey="ourModel.selection.cards.0.title" value="Market Timing" />
                </h3>
                <p className="card-description" style={{ fontSize: '0.875rem' }}>
                  <EditableText contentKey="ourModel.selection.cards.0.desc" value="We analyze macroeconomic tailwinds to ensure we’re entering at the inflection point of adoption, avoiding the “too early” trap." />
                </p>
              </div>
              <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>
                  <EditableText contentKey="ourModel.selection.cards.1.title" value="Technical Feasibility" />
                </h3>
                <p className="card-description" style={{ fontSize: '0.875rem' }}>
                  <EditableText contentKey="ourModel.selection.cards.1.desc" value="Clinical assessment of build complexity vs. available pods to ensure 12-week MVP delivery windows." />
                </p>
              </div>
              <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                </div>
                <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>
                  <EditableText contentKey="ourModel.selection.cards.2.title" value="Competitive Whitespace" />
                </h3>
                <p className="card-description" style={{ fontSize: '0.875rem' }}>
                  <EditableText contentKey="ourModel.selection.cards.2.desc" value="Mapping the landscape to find the structural gaps where incumbents are too slow to move and startups are under-serving." />
                </p>
              </div>
              <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>
                  <EditableText contentKey="ourModel.selection.cards.3.title" value="Founder-Market Fit" />
                </h3>
                <p className="card-description" style={{ fontSize: '0.875rem' }}>
                  <EditableText contentKey="ourModel.selection.cards.3.desc" value="Ensuring the core team possesses the domain expertise and obsession required to navigate the specific industry challenges." />
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: PHASE 02 — CLINICAL VALIDATION */}
        <section className="clinical-validation-section" style={{ background: '#F5F7FF', padding: '40px 0' }}>
          <div className="section-container">
            <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px' }}>
              <div className="phase-label" style={{ marginBottom: '12px', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 800, color: '#4F46E5' }}>
                <EditableText contentKey="ourModel.validation.label" value="PHASE 02 — CLINICAL VALIDATION" />
              </div>
              <h2 className="phase-title" style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                <EditableText contentKey="ourModel.validation.title" value="The Validation Framework" />
              </h2>
            </div>

            <div className="step-circles-row" style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', marginBottom: '100px' }}>
              <div style={{ position: 'absolute', top: '24px', left: '0', width: '100%', height: '1px', background: '#E2E8F0', zIndex: 0 }}></div>
              {[
                { n: '1', t: 'Assumption Mapping', d: 'Extracting every "must-be-true" statement.' },
                { n: '2', t: 'Risk Ranking', d: 'Identifying the deadliest uncertainties first.' },
                { n: '3', t: 'Signal Testing', d: 'Cold outreach, smoke tests, and MVP-0.' },
                { n: '4', t: 'Evidence Review', d: 'Data-backed go/no-go final decision.' }
              ].map((step, sidx) => (
                <div key={sidx} style={{ textAlign: 'center', flex: 1, zIndex: 1, position: 'relative' }}>
                  <div style={{ width: '48px', height: '48px', background: '#2563EB', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontWeight: 700 }}>
                    {step.n}
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '8px' }}>
                    <EditableText contentKey={`ourModel.validation.steps.${sidx}.title`} value={step.t} />
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#64748B', maxWidth: '280px', margin: '0 auto' }}>
                    <EditableText contentKey={`ourModel.validation.steps.${sidx}.desc`} value={step.d} />
                  </p>
                </div>
              ))}
            </div>

            <div className="outcome-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {[
                { t: 'Proceed', c: '#10B981', i: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', d: 'Strong market signal. Pre-commitments secured. Unit economics project a clear path to scale.' },
                { t: 'Iterate', c: '#F59E0B', i: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', d: 'Problem confirmed but solution missed. Pivot core value prop and re-validate immediately.' },
                { t: 'Kill', c: '#EF4444', i: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z', d: 'Market apathy or structural roadblocks. Stop execution now to preserve capital and focus.' }
              ].map((card, oidx) => (
                <div key={oidx} style={{ background: 'white', padding: '24px 28px', borderRadius: '16px', borderLeft: `6px solid ${card.c}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', justifyContent: 'flex-start' }}>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={card.c} strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d={card.i} /></svg>
                    <span style={{ fontWeight: 800, fontSize: '1.125rem', color: '#111827' }}>
                      <EditableText contentKey={`ourModel.validation.outcomes.${oidx}.title`} value={card.t} />
                    </span>
                  </div>
                  <p style={{ color: '#4B5563', fontSize: '0.8125rem', lineHeight: 1.5, maxWidth: '100%', letterSpacing: '-0.01em' }}>
                    <EditableText contentKey={`ourModel.validation.outcomes.${oidx}.desc`} value={card.d} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: AFTER GREENLIGHT */}
        <section className="post-greenlight-section" style={{ background: 'white', padding: '60px 0' }}>
          <div className="section-container">
            <div style={{ textAlign: 'left', maxWidth: '100%', marginBottom: '40px' }}>
              <h2 className="phase-title" style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '16px', whiteSpace: 'nowrap' }}>
                <EditableText contentKey="ourModel.phases.title" value="What Happens After a Green Light" />
              </h2>
              <p style={{ fontSize: '1.125rem', color: '#4B5563', lineHeight: 1.6 }}>
                The transition from experiment to enterprise. We deploy a full-stack squad to execute with surgical precision.
              </p>
            </div>

            <div className="post-greenlight-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', marginBottom: '64px' }}>
              {[
                { p: '03', t: 'Build', d: 'High-speed engineering of the MVP. We focus on core loops that deliver immediate value while maintaining architectural integrity.' },
                { p: '04', t: 'Launch', d: 'Strategic deployment to the beachhead market. Controlled release, rapid feedback gathering, and community seeding.' },
                { p: '05', t: 'Scale', d: 'Aggressive growth through analytics-driven optimization and infrastructure hardening for mass-market demand.' }
              ].map((item, pidx) => (
                <div key={pidx} style={{ borderLeft: '3px solid #2563EB', paddingLeft: '20px' }}>
                  <div style={{ color: '#2563EB', fontWeight: 800, fontSize: '0.6875rem', marginBottom: '8px', textTransform: 'uppercase' }}>
                    <EditableText contentKey={`ourModel.phases.items.${pidx}.label`} value={`PHASE ${item.p}`} />
                  </div>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '16px' }}>
                    <EditableText contentKey={`ourModel.phases.items.${pidx}.title`} value={item.t} />
                  </h3>
                  <p style={{ color: '#4B5563', fontSize: '0.9375rem', lineHeight: 1.55, maxWidth: '100%' }}>
                    <EditableText contentKey={`ourModel.phases.items.${pidx}.desc`} value={item.d} />
                  </p>
                </div>
              ))}
            </div>

            {/* Criteria Table */}
            <div style={{ background: '#F8FAFC', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', background: '#E0E7FF', padding: '24px', borderBottom: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 800, fontSize: '0.875rem' }}>
                  <EditableText contentKey="ourModel.phases.table.h1" value="Gate Criteria" />
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.875rem' }}>
                  <EditableText contentKey="ourModel.phases.table.h2" value="Action: Continue" />
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.875rem' }}>
                  <EditableText contentKey="ourModel.phases.table.h3" value="Action: Iterate" />
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.875rem' }}>
                  <EditableText contentKey="ourModel.phases.table.h4" value="Action: Stop" />
                </div>
              </div>
              {[
                { c: 'User Retention (Day 30)', v1: '> 40%', v2: '20% - 40%', v3: '< 20%' },
                { c: 'CAC / LTV Ratio', v1: '< 3:1', v2: '4:1 - 5:1', v3: '> 5:1' },
                { c: 'Platform Stability', v1: '99.9% Uptime', v2: 'Minor Bugfixing', v3: 'Critical Failures' }
              ].map((row, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', padding: '24px', borderBottom: idx === 2 ? 'none' : '1px solid #E2E8F0', background: 'white' }}>
                  <div style={{ fontWeight: 700, color: '#111827' }}>
                    <EditableText contentKey={`ourModel.phases.table.rows.${idx}.c`} value={row.c} />
                  </div>
                  <div style={{ color: '#10B981', fontWeight: 700 }}>
                    <EditableText contentKey={`ourModel.phases.table.rows.${idx}.v1`} value={row.v1} />
                  </div>
                  <div style={{ color: '#F59E0B', fontWeight: 700 }}>
                    <EditableText contentKey={`ourModel.phases.table.rows.${idx}.v2`} value={row.v2} />
                  </div>
                  <div style={{ color: '#EF4444', fontWeight: 700 }}>
                    <EditableText contentKey={`ourModel.phases.table.rows.${idx}.v3`} value={row.v3} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: THE FIVE PODS */}
        <section className="pods-section" style={{ padding: '40px 0', background: '#0F172A' }}>
          <div className="section-container" style={{ maxWidth: '1400px', width: '95%' }}>
            <div style={{ textAlign: 'center', maxWidth: '1000px', margin: '0 auto 64px' }}>
              <h2 className="phase-title" style={{ color: 'white', fontSize: '2.75rem', fontWeight: 800, marginBottom: '24px', whiteSpace: 'nowrap' }}>
                <EditableText contentKey="ourModel.pods.title" value="The Five Pods That Run the Playbook" />
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '1.125rem', lineHeight: 1.6, maxWidth: '800px', margin: '0 auto' }}>
                <EditableText contentKey="ourModel.pods.subtitle" value="Cross-functional expertise deployed in surgical strikes. Every pod is incentivized by product success, not billable hours." />
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px' }}>
              {[
                { id: 'POD 01', t: 'Product Engineering', d: 'Scale-first architecture with modern stacks.', i: <Cpu size={28} />, c: '#3B82F6' },
                { id: 'POD 02', t: 'Product Design', d: 'Behavioral-led UI/UX that converts.', i: <Layers size={28} />, c: '#A855F7' },
                { id: 'POD 03', t: 'Growth & Analytics', d: 'Loop optimization and funnel hardening.', i: <TrendingUp size={28} />, c: '#10B981' },
                { id: 'POD 04', t: 'AI Integration', d: 'LLM-ops and predictive intelligence layers.', i: <Sparkles size={28} />, c: '#06B6D4' },
                { id: 'POD 05', t: 'Platform & Ops', d: 'Cloud infra and CI/CD pipelines.', i: <ShieldCheck size={28} />, c: '#14B8A6' }
              ].map((pod, pidx) => (
                <div key={pidx} className="pod-card" style={{ 
                  background: 'rgba(255, 255, 255, 0.03)', 
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '40px 24px',
                  borderRadius: '24px',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  textAlign: 'left',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ 
                    width: '56px', 
                    height: '56px', 
                    background: `${pod.c}15`, 
                    color: pod.c, 
                    borderRadius: '16px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    marginBottom: '24px',
                    boxShadow: `0 8px 20px ${pod.c}20`
                  }}>
                    {pod.i}
                  </div>
                  <span style={{ color: pod.c, fontWeight: 800, fontSize: '0.625rem', letterSpacing: '0.2em', marginBottom: '12px', display: 'block' }}>
                    <EditableText contentKey={`ourModel.pods.items.${pidx}.id`} value={pod.id} />
                  </span>
                  <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', lineHeight: 1.3 }}>
                    <EditableText contentKey={`ourModel.pods.items.${pidx}.title`} value={pod.t} />
                  </h3>
                  <p style={{ color: '#94A3B8', fontSize: '0.8125rem', lineHeight: 1.5, flexGrow: 1 }}>
                    <EditableText contentKey={`ourModel.pods.items.${pidx}.desc`} value={pod.d} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 7: SUCCESS METRICS */}
        <section className="stats-section" style={{ padding: '40px 0', background: 'white' }}>
          <div className="section-container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '3rem', fontWeight: 800, color: '#2563EB', marginBottom: '8px' }}>92%</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.1em' }}>SUCCESS RATE</div>
              </div>
              <div>
                <div style={{ fontSize: '3rem', fontWeight: 800, color: '#2563EB', marginBottom: '8px' }}>10 wks</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.1em' }}>AVERAGE MVP BUILD</div>
              </div>
              <div>
                <div style={{ fontSize: '3rem', fontWeight: 800, color: '#2563EB', marginBottom: '8px' }}>85%</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.1em' }}>FOLLOW-ON FUNDING</div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8: COMPARISON */}
        <section className="comparison-section" style={{ padding: '60px 0', background: '#F0F7FF' }}>
          <div className="section-container" style={{ maxWidth: '1200px' }}>
            <h2 className="phase-title" style={{ textAlign: 'center', fontSize: '3rem', fontWeight: 800, marginBottom: '64px' }}>
              <EditableText contentKey="ourModel.comparison.title" value="An Honest Comparison" />
            </h2>
            <div className="comparison-table" style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', background: '#E0E7FF', padding: '24px' }}>
                <div style={{ fontWeight: 800, fontSize: '0.875rem' }}>
                  <EditableText contentKey="ourModel.comparison.h1" value="Capability" />
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.875rem' }}>
                  <EditableText contentKey="ourModel.comparison.h2" value="Traditional Agency" />
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.875rem' }}>
                  <EditableText contentKey="ourModel.comparison.h3" value="Freelance Network" />
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.875rem' }}>
                  <EditableText contentKey="ourModel.comparison.h4" value="Crestcode Playbook" />
                </div>
              </div>
              {[
                { f: 'Risk Management', c1: 'Minimal. They build what you ask.', c2: 'Non-existent. pure execution.', c3: 'Clinical validation before build.' },
                { f: 'Delivery Speed', c1: '6-9 months (Heavy overhead)', c2: 'Unpredictable (Siloed tasks)', c3: '10-12 Weeks (Parallel pods)' },
                { f: 'Ownership Model', c1: 'Project-based (Fee for service)', c2: 'Hourly (Incentivized slowness)', c3: 'Equity-aligned performance goals.' },
                { f: 'Post-Launch', c1: 'Hand-off & Maintenance bills.', c2: 'Hard to re-engage same talent.', c3: 'Scale-up pods & growth ops.' }
              ].map((row, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', padding: '24px', borderBottom: idx === 3 ? 'none' : '1px solid #E2E8F0', background: idx % 2 === 0 ? 'white' : '#F0F7FF' }}>
                  <div style={{ fontWeight: 700 }}>
                    <EditableText contentKey={`ourModel.comparison.rows.${idx}.f`} value={row.f} />
                  </div>
                  <div style={{ color: '#64748B' }}>
                    <EditableText contentKey={`ourModel.comparison.rows.${idx}.c1`} value={row.c1} />
                  </div>
                  <div style={{ color: '#64748B' }}>
                    <EditableText contentKey={`ourModel.comparison.rows.${idx}.c2`} value={row.c2} />
                  </div>
                  <div style={{ color: '#2563EB', fontWeight: 700 }}>
                    <EditableText contentKey={`ourModel.comparison.rows.${idx}.c3`} value={row.c3} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 9: FINAL CTA */}
        <section className="final-cta-section" style={{ padding: '60px 24px', background: 'white' }}>
          <div className="section-container" style={{ 
            maxWidth: '1200px', 
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', 
            borderRadius: '48px', 
            padding: '80px 40px',
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 20px 40px rgba(37, 99, 235, 0.2)'
          }}>
            <h2 className="cta-title" style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '24px', letterSpacing: '-0.02em' }}>
              <EditableText contentKey="ourModel.cta.title" value="Ready to Run the Playbook?" />
            </h2>
            <p className="cta-description" style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.9)', marginBottom: '48px', lineHeight: 1.6, maxWidth: '700px', margin: '0 auto 48px' }}>
              <EditableText contentKey="ourModel.cta.description" value="Stop guessing and start engineering. Join the elite founders who have transformed their vision into high-valuation digital products with Crestcode." />
            </p>
            <div className="cta-buttons" style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
              <Link href="/contact" style={{ 
                padding: '18px 40px', 
                background: 'white', 
                color: '#2563EB', 
                borderRadius: '16px', 
                fontWeight: 700, 
                fontSize: '1.125rem', 
                transition: 'all 0.3s ease',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
              }}>
                <EditableText contentKey="ourModel.cta.button" value="Apply for a Build Slot" />
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
