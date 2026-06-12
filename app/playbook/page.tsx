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
  const [activeFilter, setActiveFilter] = React.useState(0);
  const [activePhase, setActivePhase] = React.useState(0);

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
          /* Color System */
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

        body, html {
          margin: 0;
          padding: 0;
          font-family: 'Inter', sans-serif;
          background-color: var(--bg-base);
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

        .section-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        
        /* Section 1: Hero */
        .hero-section {
          background: var(--bg-base);
          padding: 130px 0 24px;
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
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 900;
          line-height: 1.0;
          letter-spacing: -0.05em;
          color: var(--text-black);
          margin-bottom: 24px;
        }

        .text-blue { color: var(--bright-blue); }

        .hero-description {
          font-size: 1.125rem;
          line-height: 1.6;
          color: var(--text-muted);
          margin-bottom: 32px;
          max-width: 600px;
        }

        .hero-info-box {
          background: var(--light-blue-bg);
          border-left: 6px solid var(--bright-blue);
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
          background: linear-gradient(135deg, var(--bright-blue), var(--primary-blue));
          color: var(--white);
          padding: 16px 32px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 15px;
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transform: translateZ(15px);
          box-shadow: 0 4px 15px rgba(0, 136, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
          text-decoration: none;
        }

        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s;
        }

        .btn-primary:hover {
          transform: translateY(-3px) translateZ(15px) scale(1.05);
          box-shadow: 0 8px 25px rgba(0, 136, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .btn-primary:hover::before {
          left: 100%;
        }

        .btn-primary:active {
          transform: translateY(-1px) translateZ(15px) scale(0.98);
        }

        .btn-outline {
          background: transparent;
          border: 2px solid var(--border-light);
          color: var(--text-main);
          padding: 16px 32px;
          border-radius: 8px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 15px;
        }

        .btn-outline:hover {
          background: var(--light-blue-bg);
          border-color: var(--bright-blue);
          color: var(--bright-blue);
        }

        .hero-image-container {
          position: relative;
          border-radius: 40px;
          overflow: hidden;
          background: #000;
          aspect-ratio: 1/1;
          box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.4);
        }

        /* Responsive Design Overrides */
        @media (max-width: 900px) {
          .section-container {
            padding: 40px 20px !important;
          }
          
          .hero-section {
            padding-top: 60px !important;
            text-align: center !important;
          }
          
          .hero-title {
            font-size: 2.5rem !important;
          }
          
          .hero-description, .hero-info-box {
            margin-inline: auto !important;
            font-size: 1rem !important;
          }
          
          .hero-buttons {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          
          .selection-grid, .outcome-grid, .post-greenlight-grid, .stats-section .section-container > div, .pods-section .section-container > div:last-child {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          
          .step-circles-row {
            flex-direction: column !important;
            gap: 32px !important;
          }
          
          .step-circles-row div {
            flex: none !important;
          }
          
          .step-circles-row div[style*="absolute"] {
            display: none !important;
          }
          
          .phase-title {
            font-size: 2rem !important;
            white-space: normal !important;
          }
          
          /* Table Responsiveness */
          .criteria-table-wrapper, .comparison-table-wrapper {
            overflow-x: auto !important;
            margin-inline: -20px !important;
            padding-inline: 20px !important;
          }
          
          .criteria-table-wrapper > div, .comparison-table-wrapper > div {
            min-width: 600px !important;
          }
          
          .final-cta-section .section-container {
            padding: 60px 20px !important;
            border-radius: 24px !important;
          }
          
          .final-cta-section h2 {
            font-size: 2rem !important;
          }
          
          .final-cta-section .cta-buttons {
            flex-direction: column !important;
          }
          
          .final-cta-section .cta-buttons a {
            width: 100% !important;
          }
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
          box-shadow: 0 10px 30px -10px rgba(0, 90, 226, 0.08);
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
          background: #DBEAFE;
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
          background: #FFFFFF;
          padding: 80px 0;
          text-align: center;
          position: relative;
          overflow: hidden;
          z-index: 1;
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
          position: relative;
          z-index: 1;
        }

        .outcome-card {
          background: white;
          padding: 32px;
          border-radius: 12px;
          text-align: left;
          border: 1px solid var(--border-light);
          position: relative;
          z-index: 1;
          overflow: hidden;
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

        /* @media (max-width: 968px) {
          .step-circles-row { grid-template-columns: repeat(2, 1fr); }
          .outcome-grid { grid-template-columns: 1fr; }
        } */

        /* Execution Section (Section 4) */
        .post-greenlight-section {
          background: white;
          padding: 48px 0;
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

        /* @media (max-width: 968px) {
          .post-greenlight-grid { grid-template-columns: 1fr; }
        } */

        /* Pods Section */
        .pods-section {
          background: var(--bg-dark);
          padding: 60px 0;
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

        /* Responsive Overrides Disabled to maintain desktop view */
        @media (max-width: 1200px) {
          /* .pods-grid { grid-template-columns: repeat(3, 1fr); } */
          /* .stats-row { gap: 64px; } */
        }
        @media (max-width: 768px) {
          /* .pods-grid { grid-template-columns: 1fr; } */
          /* .stats-row { flex-direction: column; gap: 48px; } */
          /* .stat-value { font-size: 2.5rem; } */
        }

        /* Comparison Section */
        .comparison-section {
          background: #F8FAFC;
          padding: 48px 0;
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
          padding: 60px 24px;
          text-align: center;
        }

        .cta-container {
          max-width: 1000px;
          margin: 0 auto;
          background: var(--primary-blue);
          padding: 48px 40px;
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

        /* @media (max-width: 768px) {
          .comparison-table-wrapper { display: block; overflow-x: auto; }
          .comparison-table th, .comparison-table td { min-width: 140px; padding: 16px; }
          .cta-title { font-size: 2rem; }
          .cta-buttons { flex-direction: column; }
        } */

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

      <Header />
      <div className="our-model-page">


        {/* SECTION 1: HERO */}
        <section className="hero-section" style={{ background: 'white', paddingTop: '130px', paddingBottom: '24px', minHeight: '700px', position: 'relative', overflow: 'hidden' }}>
          {/* Top Light Effect */}
          <div style={{ position: 'absolute', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.25), transparent 70%)', top: '-200px', left: '50%', transform: 'translateX(-50%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }}></div>
          <div className="section-container">
            <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '80px', alignItems: 'center' }}>
              <div className="hero-content">
                <div className="hero-eyebrow-pill" style={{ background: '#E6EFFF', color: '#005AE2', fontWeight: 800, padding: '6px 14px', fontSize: '0.75rem' }}>
                  <EditableText contentKey="ourModel.hero.eyebrow" value={modelContent.hero.eyebrow} />
                </div>
                <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginTop: '24px' }}>
                  From Raw Idea to<br /><span style={{ color: '#2563EB' }}>Proven Product</span> — in 5 Phases
                </h1>
                <p className="hero-description" style={{ fontSize: '1rem', color: '#4B5563', lineHeight: 1.6, marginTop: '24px' }}>
                  <EditableText contentKey="ourModel.hero.description" value={modelContent.hero.description} />
                </p>
                <div className="hero-info-box" style={{ background: '#F5F7FF', borderLeft: '3px solid #2563EB', padding: '24px', borderRadius: '4px', marginTop: '32px', color: '#374151', fontSize: '0.9375rem', fontWeight: 500, fontStyle: 'normal' }}>
                  <EditableText contentKey="ourModel.hero.quote" value={modelContent.hero.quote} />
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
                    <EditableText contentKey="ourModel.hero.primaryButton" value={modelContent.hero.primaryButton} />
                  </Link>
                  <Link href="#phases" style={{ 
                    display: 'inline-block',
                    background: '#DBEAFE', 
                    color: '#2563EB',
                    padding: '16px 40px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '1rem',
                    transition: 'all 0.3s ease'
                  }}>
                    <EditableText contentKey="ourModel.hero.secondaryButton" value={modelContent.hero.secondaryButton} />
                  </Link>
                </div>
              </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ 
                background: '#D1E4FF', 
                borderRadius: '32px', 
                padding: '12px',
                boxShadow: '0 20px 40px rgba(0,90,226,0.12)',
                position: 'relative',
                width: '100%',
                maxWidth: '580px'
              }}>
                <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                  <img 
                    src="/images/methodology_hero.png" 
                    alt="Our Methodology — Futuristic Digital Planning" 
                    style={{ width: '100%', height: 'auto', display: 'block', opacity: 1 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
        <section className="dynamic-phases-section" style={{ padding: '40px 0', minHeight: '600px', background: 'white' }}>
          <div className="section-container">
            {/* PHASE 01: SELECT */}
            {activePhase === 0 && (
              <div className="phase-content-animate fade-in">
                <div style={{ marginBottom: '40px' }}>
                  <div className="phase-label" style={{ marginBottom: '6px', textTransform: 'uppercase', fontSize: '0.6875rem', fontWeight: 800, color: '#2563EB' }}>
                    <EditableText contentKey="ourModel.selection.label" value={modelContent?.selection?.label} />
                  </div>
                  <h2 className="phase-title" style={{ fontSize: '2.125rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', color: '#111827' }}>
                    <EditableText contentKey="ourModel.selection.title" value={modelContent?.selection?.title} />
                  </h2>
                </div>

                <div className="selection-grid">
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <Search width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Market Timing & Scale</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>We analyze macroeconomic tailwinds and adoption curves to ensure we enter markets at the perfect inflection point for exponential growth.</p>
                  </div>
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <Cpu width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Technical Feasibility</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>Rigorous clinical assessment of build complexity vs. available pods to ensure predictable 12-week MVP delivery windows without technical debt.</p>
                  </div>
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <Zap width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Competitive Whitespace</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>Mapping the industry landscape to identify structural gaps where incumbents are too slow and startups are under-serving the core user needs.</p>
                  </div>
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <Rocket width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Founder-Market Fit</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>Ensuring the core team possesses the unique domain expertise, obsession, and grit required to navigate industry-specific technical and market hurdles.</p>
                  </div>
                </div>
              </div>
            )}

            {/* PHASE 02: VALIDATE */}
            {activePhase === 1 && (
              <div className="phase-content-animate fade-in">
                <div style={{ marginBottom: '40px' }}>
                  <div className="phase-label" style={{ marginBottom: '6px', textTransform: 'uppercase', fontSize: '0.6875rem', fontWeight: 800, color: '#2563EB' }}>
                    PHASE 02 — CLINICAL VALIDATION
                  </div>
                  <h2 className="phase-title" style={{ fontSize: '2.125rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', color: '#111827' }}>
                    The Validation Framework
                  </h2>
                </div>
                <div className="selection-grid">
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <Search width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Assumption Mapping</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>Extracting every "must-be-true" statement and validating foundational hypotheses before writing a single line of code.</p>
                  </div>
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <ShieldCheck width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Risk Ranking</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>Identifying the deadliest uncertainties first and prioritizing tests that de-risk the venture's core value proposition.</p>
                  </div>
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <Zap width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Signal Testing</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>Deploying rapid smoke tests, landing pages, and MVP-0s to measure actual market pull over stated intent.</p>
                  </div>
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <Check width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Evidence Review</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>A rigorous, data-backed go/no-go decision. We only proceed when unit economics project a clear path to scale.</p>
                  </div>
                </div>
              </div>
            )}

            {/* PHASE 03: BUILD */}
            {activePhase === 2 && (
              <div className="phase-content-animate fade-in">
                <div style={{ marginBottom: '40px' }}>
                  <div className="phase-label" style={{ marginBottom: '6px', textTransform: 'uppercase', fontSize: '0.6875rem', fontWeight: 800, color: '#2563EB' }}>
                    PHASE 03 — BUILD
                  </div>
                  <h2 className="phase-title" style={{ fontSize: '2.125rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', color: '#111827' }}>
                    High-Speed Engineering
                  </h2>
                </div>
                <div className="selection-grid">
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <Server width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Architecture Design</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>Designing scalable, resilient, and secure foundations that support rapid growth without accruing technical debt.</p>
                  </div>
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <Code width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Core Loop Engineering</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>Focusing strictly on the primary user journeys that deliver immediate value and drive early retention metrics.</p>
                  </div>
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <Clock width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Agile Sprints</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>Bi-weekly iterative cycles ensuring continuous delivery, rapid feedback integration, and transparent progress.</p>
                  </div>
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <Layers width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Continuous Integration</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>Automated testing and deployment pipelines that guarantee zero-downtime updates and flawless releases.</p>
                  </div>
                </div>
              </div>
            )}

            {/* PHASE 04: LAUNCH */}
            {activePhase === 3 && (
              <div className="phase-content-animate fade-in">
                <div style={{ marginBottom: '40px' }}>
                  <div className="phase-label" style={{ marginBottom: '6px', textTransform: 'uppercase', fontSize: '0.6875rem', fontWeight: 800, color: '#2563EB' }}>
                    PHASE 04 — LAUNCH
                  </div>
                  <h2 className="phase-title" style={{ fontSize: '2.125rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', color: '#111827' }}>
                    Strategic Market Entry
                  </h2>
                </div>
                <div className="selection-grid">
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <Rocket width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Beachhead Strategy</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>Identifying and targeting a hyper-specific, underserved user segment to achieve rapid initial penetration.</p>
                  </div>
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <Shield width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Controlled Release</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>Staggered rollout phases to monitor system stability and gather qualitative feedback from early adopters.</p>
                  </div>
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <Sparkles width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Feedback Loops</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>Implementing in-app analytics and direct communication channels to capture user sentiment instantly.</p>
                  </div>
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <Globe width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Community Seeding</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>Activating early evangelists to build organic momentum and establish a defensible brand presence.</p>
                  </div>
                </div>
              </div>
            )}

            {/* PHASE 05: SCALE */}
            {activePhase === 4 && (
              <div className="phase-content-animate fade-in">
                <div style={{ marginBottom: '40px' }}>
                  <div className="phase-label" style={{ marginBottom: '6px', textTransform: 'uppercase', fontSize: '0.6875rem', fontWeight: 800, color: '#2563EB' }}>
                    PHASE 05 — SCALE
                  </div>
                  <h2 className="phase-title" style={{ fontSize: '2.125rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', color: '#111827' }}>
                    Aggressive Growth & Hardening
                  </h2>
                </div>
                <div className="selection-grid">
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <TrendingUp width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Analytics Optimization</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>Deep-diving into user behavior data to identify friction points and optimize conversion funnels.</p>
                  </div>
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <Layers width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Infrastructure Hardening</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>Transitioning from MVP architecture to enterprise-grade systems capable of handling massive concurrency.</p>
                  </div>
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <ArrowRight width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Growth Marketing</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>Scaling proven acquisition channels through data-driven campaigns and automated marketing operations.</p>
                  </div>
                  <div className="selection-card" style={{ background: '#F5F7FF', border: 'none' }}>
                    <div className="card-icon-wrapper" style={{ background: 'transparent', color: '#2563EB', marginBottom: '16px' }}>
                      <Globe width="32" height="32" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Mass-Market Operations</h3>
                    <p className="card-description" style={{ fontSize: '0.875rem' }}>Streamlining customer success, localized compliance, and global operational workflows for sustained expansion.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 6: THE FIVE PODS */}
        <section className="pods-section" style={{ padding: '60px 0', background: '#0F172A' }}>
          <div className="section-container" style={{ maxWidth: '1400px', width: '95%' }}>
            <div style={{ textAlign: 'center', maxWidth: '1000px', margin: '0 auto 64px' }}>
              <h2 className="phase-title" style={{ color: 'white', fontSize: '2.75rem', fontWeight: 800, marginBottom: '24px', whiteSpace: 'nowrap' }}>
                <EditableText contentKey="ourModel.pods.title" value={modelContent.pods.title} />
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '1.125rem', lineHeight: 1.6, maxWidth: '800px', margin: '0 auto' }}>
                <EditableText contentKey="ourModel.pods.subtitle" value={modelContent.pods.subtitle} />
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px' }}>
              {modelContent.pods.items.map((pod, pidx) => {
                const colors = ['#3B82F6', '#1E40AF', '#10B981', '#06B6D4', '#14B8A6'];
                const icons = [
                  <Cpu size={28} />,
                  <Layers size={28} />,
                  <TrendingUp size={28} />,
                  <Sparkles size={28} />,
                  <ShieldCheck size={28} />
                ];
                return (
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
                      background: `${colors[pidx]}15`, 
                      color: colors[pidx], 
                      borderRadius: '16px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      marginBottom: '24px',
                      boxShadow: `0 8px 20px ${colors[pidx]}20`
                    }}>
                      {icons[pidx]}
                    </div>
                    <span style={{ color: colors[pidx], fontWeight: 800, fontSize: '0.625rem', letterSpacing: '0.2em', marginBottom: '12px', display: 'block' }}>
                      <EditableText contentKey={`ourModel.pods.items.${pidx}.id`} value={pod.id} />
                    </span>
                    <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', lineHeight: 1.3 }}>
                      <EditableText contentKey={`ourModel.pods.items.${pidx}.title`} value={pod.title} />
                    </h3>
                    <p style={{ color: '#94A3B8', fontSize: '0.8125rem', lineHeight: 1.5, flexGrow: 1 }}>
                      <EditableText contentKey={`ourModel.pods.items.${pidx}.desc`} value={pod.desc} />
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 7: SUCCESS METRICS */}
        <section className="stats-section" style={{ padding: '40px 0', background: 'white' }}>
          <div className="section-container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '3rem', fontWeight: 800, color: '#2563EB', marginBottom: '8px' }}>
                  <EditableText contentKey="ourModel.stats.s1.value" value={modelContent?.stats?.s1?.value} />
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.1em' }}>
                  <EditableText contentKey="ourModel.stats.s1.label" value={modelContent?.stats?.s1?.label} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: '3rem', fontWeight: 800, color: '#2563EB', marginBottom: '8px' }}>
                  <EditableText contentKey="ourModel.stats.s2.value" value={modelContent?.stats?.s2?.value} />
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.1em' }}>
                  <EditableText contentKey="ourModel.stats.s2.label" value={modelContent?.stats?.s2?.label} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: '3rem', fontWeight: 800, color: '#2563EB', marginBottom: '8px' }}>
                  <EditableText contentKey="ourModel.stats.s3.value" value={modelContent?.stats?.s3?.value} />
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.1em' }}>
                  <EditableText contentKey="ourModel.stats.s3.label" value={modelContent?.stats?.s3?.label} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8: COMPARISON */}
        <section className="comparison-section" style={{ padding: '48px 0', background: '#F0F7FF' }}>
          <div className="section-container" style={{ maxWidth: '1200px' }}>
            <h2 className="phase-title" style={{ textAlign: 'center', fontSize: '3rem', fontWeight: 800, marginBottom: '64px' }}>
              <EditableText contentKey="ourModel.comparison.title" value={modelContent.comparison.title} />
            </h2>
            <div className="comparison-table-wrapper">
              <div className="comparison-table" style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', background: '#DBEAFE', padding: '24px' }}>
                <div style={{ fontWeight: 800, fontSize: '0.875rem' }}>
                  <EditableText contentKey="ourModel.comparison.h1" value={modelContent.comparison.h1} />
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.875rem' }}>
                  <EditableText contentKey="ourModel.comparison.h2" value={modelContent.comparison.h2} />
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.875rem' }}>
                  <EditableText contentKey="ourModel.comparison.h3" value={modelContent.comparison.h3} />
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.875rem' }}>
                  <EditableText contentKey="ourModel.comparison.h4" value={modelContent.comparison.h4} />
                </div>
              </div>
              {modelContent.comparison.rows.map((row, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', padding: '24px', borderBottom: idx === modelContent.comparison.rows.length - 1 ? 'none' : '1px solid #E2E8F0', background: idx % 2 === 0 ? 'white' : '#F0F7FF' }}>
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
        </div>
      </section>

        {/* SECTION 9: FINAL CTA */}
        <section className="final-cta-section" style={{ padding: '60px 24px', background: 'white' }}>
          <div className="section-container" style={{ 
            maxWidth: '1200px', 
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', 
            borderRadius: '48px', 
            padding: '48px 40px',
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 20px 40px rgba(37, 99, 235, 0.2)'
          }}>
            <h2 className="cta-title" style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '24px', letterSpacing: '-0.02em' }}>
              <EditableText contentKey="ourModel.cta.title" value={modelContent.cta.title} />
            </h2>
            <p className="cta-description" style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.9)', marginBottom: '48px', lineHeight: 1.6, maxWidth: '700px', margin: '0 auto 48px' }}>
              <EditableText contentKey="ourModel.cta.description" value={modelContent.cta.description} />
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
                <EditableText contentKey="ourModel.cta.button" value={modelContent.cta.button} />
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
