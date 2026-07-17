'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import EditableText from '@/components/admin/EditableText';
import SpotlightCursor from '@/components/effects/SpotlightCursor';
import BorderBeam from '@/components/effects/BorderBeam';
import Link from 'next/link';
import { useContent } from '@/context/ContentContext';
import localConfig from '@/shared/config.json';

// Map categories to modern gradient/glow themes (styling, not content)
const CATEGORY_THEMES: Record<string, { gradient: string; glow: string; text: string }> = {
  'AI/ML': {
    gradient: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
    glow: 'rgba(139, 92, 246, 0.15)',
    text: '#8B5CF6'
  },
  'Fintech': {
    gradient: 'linear-gradient(135deg, #0D9488, #06B6D4)',
    glow: 'rgba(6, 182, 212, 0.15)',
    text: '#0D9488'
  },
  'HealthTech': {
    gradient: 'linear-gradient(135deg, #10B981, #34D399)',
    glow: 'rgba(16, 185, 129, 0.15)',
    text: '#10B981'
  },
  'Enterprise SaaS': {
    gradient: 'linear-gradient(135deg, #F59E0B, #EC4899)',
    glow: 'rgba(236, 72, 153, 0.15)',
    text: '#EC4899'
  }
};

export default function CompanyPage() {
  const { content } = useContent();

  // CMS-driven content with fallback to localConfig
  const companyContent = (content as any)?.company || (localConfig as any).company;
  const homeContent = (content as any)?.home || (localConfig as any).home;

  const problemsWeLove = [
    {
      title: "Complex Workflows",
      desc: "Processes too tangled for off-the-shelf tools. We map, simplify, and build around them.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="6" height="6" rx="1"></rect><rect x="15" y="3" width="6" height="6" rx="1"></rect><rect x="15" y="15" width="6" height="6" rx="1"></rect><rect x="3" y="15" width="6" height="6" rx="1"></rect><path d="M9 6h6"></path><path d="M21 9v6"></path><path d="M15 18H9"></path><path d="M3 15V9"></path></svg>
      )
    },
    {
      title: "Broken User Experiences",
      desc: "Products that frustrate instead of flow. We find where users drop off and redesign from there.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 15l-3-3m0 0l-3 3m3-3v8"></path><path d="M12 3a9 9 0 100 18 9 9 0 000-18z"></path></svg>
      )
    },
    {
      title: "Systems That Don't Talk",
      desc: "Disconnected tools, siloed data, integration nightmares. We make them work as one.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"></path></svg>
      )
    },
    {
      title: "Ideas That Need Technical Co-Thinking",
      desc: "You have the vision but need a product partner who can think through the build with you, not just execute orders.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83M12 12m-4 0a4 4 0 108 0 4 4 0 10-8 0"></path></svg>
      )
    }
  ];

  const processSteps = [
    {
      num: "01",
      title: "Pressure Test",
      desc: "Vetting ideas against market physics and scalability.",
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.31"></path><path d="M14 9.3V1.99"></path><path d="M8.5 2h7"></path><path d="M14 9.3a6.5 6.5 0 11-4 0"></path><path d="M5.52 16h12.96"></path></svg>
    },
    {
      num: "02",
      title: "Blueprint",
      desc: "Defining technical architecture and user experience flows.",
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
    },
    {
      num: "03",
      title: "Build in Sprints",
      desc: "Rapid execution with iterative feedback loops.",
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
    },
    {
      num: "04",
      title: "Ship & Sustain",
      desc: "Operationalizing growth and scaling infrastructure.",
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13.5 10.5L21 3m-7.5 7.5L9 21M13.5 10.5l-3-3m3 3l3 3m-3-3L3 21"></path></svg>
    }
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        /* ===== HERO ===== */
        .company-hero {
          background: #FFFFFF;
          color: #0A0F1C;
          text-align: center;
          position: relative;
          overflow: hidden;
          z-index: 1;
        }
        .hero-glow {
          position: absolute;
          width: 700px;
          height: 700px;
          background: radial-gradient(circle, rgba(0, 90, 226, 0.25), transparent 70%);
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          filter: blur(100px);
          pointer-events: none;
          z-index: 0;
        }
        .hero-glow-2 {
          position: absolute;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%);
          bottom: -100px;
          left: -50px;
          filter: blur(60px);
          pointer-events: none;
          z-index: 0;
        }
        .hero-glow-3 {
          position: absolute;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%);
          bottom: -100px;
          right: -50px;
          filter: blur(60px);
          pointer-events: none;
          z-index: 0;
        }
        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 800;
          margin-bottom: 20px;
          letter-spacing: -0.03em;
          line-height: 1.1;
        }
        .hero-subtitle {
          font-size: clamp(1rem, 2.5vw, 1.25rem);
          color: #64748B;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* ===== FILTER BAR ===== */
        .filter-bar {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
          padding: 28px 32px;
          background: #F8FAFC;
          border-bottom: 1px solid #E2E8F0;
        }
        .filter-pill {
          padding: 10px 22px;
          border-radius: 100px;
          font-weight: 700;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
          white-space: nowrap;
        }
        .filter-pill.active {
          background: #0A0F1C;
          color: white;
        }
        .filter-pill:not(.active) {
          background: white;
          color: #64748B;
          border-color: #E2E8F0;
        }
        .filter-pill:not(.active):hover {
          color: #0A0F1C;
          border-color: #CBD5E1;
        }

        /* ===== COMPANIES GRID ===== */
        .companies-section {
          background: #FFFFFF;
          padding: var(--section-padding-y) var(--section-padding-x);
        }
        .companies-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 28px;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* ===== COMPANY CARD ===== */
        .company-card {
          background: white;
          border-radius: 24px;
          padding: 36px 32px;
          border: 1px solid #E2E8F0;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }
        .company-card:hover {
          transform: translateY(-6px);
          border-color: transparent;
        }
        .c-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }
        .c-logo-avatar {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 1.1rem;
          letter-spacing: -0.02em;
          flex-shrink: 0;
        }
        .c-est-badge {
          background: #F1F5F9;
          color: #64748B;
          padding: 6px 12px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .c-cat {
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 10px;
        }
        .c-name {
          font-size: clamp(1.5rem, 3vw, 1.85rem);
          font-weight: 800;
          color: #0A0F1C;
          margin-bottom: 10px;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        .c-desc {
          color: #475569;
          font-size: 0.9375rem;
          line-height: 1.65;
          margin-bottom: 24px;
          flex-grow: 1;
        }
        .c-tag-list {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }
        .c-tag-badge {
          font-size: 0.75rem;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          color: #64748B;
          padding: 4px 10px;
          border-radius: 8px;
          font-weight: 600;
        }
        .c-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 0.9375rem;
          color: #0A0F1C;
          text-decoration: none;
          transition: color 0.2s;
          margin-top: auto;
        }
        .c-link:hover {
          color: #005AE2;
        }

        /* ===== PROBLEMS WE LOVE SECTION ===== */
        .problems-section {
          background: #FFFFFF;
          padding: var(--section-padding-y) var(--section-padding-x);
        }
        .problems-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .problems-header {
          margin-bottom: 48px;
        }
        .problems-title {
          font-size: clamp(2rem, 4vw, 2.5rem);
          font-weight: 800;
          color: #0A0F1C;
          margin-bottom: 12px;
          letter-spacing: -0.02em;
        }
        .problems-subtitle {
          font-size: 1.125rem;
          color: #64748B;
          font-weight: 500;
        }
        .problems-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
        }
        .problem-card {
          border: 1px solid #E2E8F0;
          border-radius: 24px;
          padding: 40px;
          background: #FFFFFF;
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .problem-card:hover {
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.05);
          border-color: #CBD5E1;
        }
        .problem-icon {
          width: 48px;
          height: 48px;
          background: #F0F5FF;
          color: #005AE2;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }
        .problem-card-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0A0F1C;
          margin-bottom: 12px;
        }
        .problem-card-desc {
          color: #64748B;
          line-height: 1.6;
          font-size: 0.9375rem;
        }
        @media (max-width: 768px) {
          .problems-grid { grid-template-columns: 1fr; }
          .problem-card { padding: 32px 24px; }
        }

        /* ===== HOW IT GETS BORN (PROCESS) SECTION ===== */
        .process-section {
          background: #FAFAFA;
          padding: var(--section-padding-y) var(--section-padding-x);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .process-header-box {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 24px;
          padding: 48px 32px;
          text-align: center;
          max-width: 600px;
          width: 100%;
          margin-bottom: 64px;
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.03);
          position: relative;
          z-index: 2;
        }
        .process-title {
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 800;
          color: #0A0F1C;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }
        .process-subtitle {
          color: #64748B;
          font-size: 1rem;
          line-height: 1.6;
        }
        .process-list-container {
          max-width: 500px;
          width: 100%;
          position: relative;
          margin-bottom: 80px;
        }
        /* Vertical connecting line */
        .process-list-container::before {
          content: '';
          position: absolute;
          left: 28px;
          top: 24px;
          bottom: 24px;
          width: 2px;
          background: #E2E8F0;
          z-index: 0;
        }
        .process-item {
          display: flex;
          gap: 32px;
          align-items: flex-start;
          margin-bottom: 48px;
          position: relative;
          z-index: 1;
        }
        .process-item:last-child {
          margin-bottom: 0;
        }
        .process-icon {
          width: 56px;
          height: 56px;
          background: #0F172A;
          color: #FFFFFF;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 0 8px #FAFAFA; /* creates space matching background to cut the line */
        }
        .process-content {
          padding-top: 6px;
        }
        .process-item-title {
          font-size: 1.125rem;
          font-weight: 800;
          color: #0A0F1C;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .process-item-num {
          font-weight: 800;
          color: #0A0F1C;
        }
        .process-item-desc {
          color: #64748B;
          line-height: 1.6;
          font-size: 0.9375rem;
        }
        .process-image-wrapper {
          max-width: 700px;
          width: 100%;
          border-radius: 32px;
          overflow: hidden;
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1);
          position: relative;
        }
        /* Overlay to give it that faded abstract look */
        .process-image-wrapper::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(250, 250, 250, 0.4);
          mix-blend-mode: overlay;
          pointer-events: none;
        }
        .process-image {
          width: 100%;
          height: auto;
          display: block;
          filter: grayscale(100%) contrast(1.2) brightness(1.1);
          opacity: 0.8;
          transition: transform 0.5s ease, filter 0.5s ease;
        }
        .process-image-wrapper:hover .process-image {
          transform: scale(1.02);
          filter: grayscale(50%) contrast(1.1) brightness(1);
        }
        @media (max-width: 640px) {
          .process-list-container::before { left: 24px; }
          .process-icon { width: 48px; height: 48px; }
          .process-item { gap: 20px; }
          .process-header-box { padding: 32px 20px; }
        }

        /* ===== DARK SECTION (Make Innovation Accessible) ===== */
        .section-dark {
          position: relative;
          background-color: #0A0F1C;
          color: #FFFFFF;
          overflow: hidden;
        }
        .section-container {
          max-width: 100%;
          margin: 0 auto;
        }
        .section-eyebrow {
          color: #005AE2;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-size: clamp(0.6875rem, 1vw, 0.8125rem);
          margin-bottom: 16px;
          font-family: 'Manrope', sans-serif;
        }
        .section-title {
          font-size: clamp(1.75rem, 4vw, 2.75rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: clamp(16px, 3vw, 24px);
          line-height: 1.1;
          font-family: 'Manrope', sans-serif;
        }
        .dark-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          align-items: center;
        }
        .feature-list {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        .feature-item {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }
        .feature-bullet {
          width: 38px;
          height: 38px;
          border-radius: 100px;
          background-color: rgba(37,99,235,0.15);
          border: 2px solid #005AE2;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #005AE2;
          font-weight: 800;
          font-size: 1rem;
        }
        .feature-title {
          font-size: clamp(0.9375rem, 2vw, 1.125rem);
          font-weight: 800;
          margin-bottom: 6px;
          color: #FFFFFF;
          font-family: 'Manrope', sans-serif;
        }
        .feature-desc {
          color: #9CA3AF;
          font-size: clamp(0.875rem, 1.5vw, 1rem);
          line-height: 1.6;
          font-weight: 500;
          font-family: 'Manrope', sans-serif;
        }
        .testimonial-card-dark {
          background-color: #0F172A;
          padding: 40px 36px;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .t-card-quote {
          font-size: clamp(1rem, 2.5vw, 1.35rem);
          font-weight: 600;
          line-height: 1.6;
          margin-bottom: 36px;
          color: #FFFFFF;
        }
        .t-card-author {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .t-avatar {
          width: 46px;
          height: 46px;
          background-color: #334155;
          border-radius: 100px;
          flex-shrink: 0;
        }
        .t-name {
          font-weight: 800;
          font-size: 1rem;
          color: #FFFFFF;
          font-family: 'Manrope', sans-serif;
        }
        .t-role {
          color: #9CA3AF;
          font-size: clamp(0.6875rem, 1vw, 0.8125rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 4px;
          font-family: 'Manrope', sans-serif;
        }

        /* ===== FOOTER WRAPPER ===== */
        .cc-footer-wrapper {
          width: 100%;
          position: relative;
          z-index: 1;
        }
        .cc-footer-wrapper .footer {
          width: 100%;
          max-width: 100%;
        }

        /* ===== PAGE LAYOUT FIX ===== */
        main {
          position: relative;
          z-index: 1;
        }
        .company-hero {
          position: relative;
          z-index: 1;
        }

        /* ===== RESPONSIVE: TABLET (max 900px) ===== */
        @media (min-width: 900px) {
          .dark-grid {
            grid-template-columns: 1fr 1fr;
            gap: 64px;
          }
        }

        /* ===== RESPONSIVE: MOBILE (max 768px) ===== */
        @media (max-width: 768px) {
          .company-hero {
            padding: 120px 24px 60px;
          }
          .hero-glow {
            width: 300px;
            height: 300px;
          }
          .filter-bar {
            padding: 20px 24px;
            gap: 8px;
          }
          .filter-pill {
            padding: 8px 16px;
            font-size: 0.8125rem;
          }
          .companies-section {
            padding: 40px 24px 60px;
          }
          .companies-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .company-card {
            padding: 28px 24px;
            border-radius: 20px;
          }
          .c-logo-avatar {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            font-size: 1rem;
          }
          .c-header-row {
            margin-bottom: 16px;
          }
          .c-tag-list {
            margin-bottom: 20px;
          }
          .section-container {
            padding: 64px 24px;
          }
          .testimonial-card-dark {
            padding: 28px 24px;
            border-radius: 20px;
          }
          .t-card-quote {
            margin-bottom: 24px;
          }
          .feature-list {
            gap: 20px;
          }
          .feature-bullet {
            width: 34px;
            height: 34px;
            font-size: 0.875rem;
          }
        }

        /* ===== RESPONSIVE: SMALL MOBILE (max 480px) ===== */
        @media (max-width: 480px) {
          .company-hero {
            padding: 100px 16px 48px;
          }
          .company-card {
            padding: 24px 20px;
          }
          .c-est-badge {
            font-size: 0.6875rem;
            padding: 5px 10px;
          }
          .companies-section {
            padding: 32px 12px 48px;
          }
          .filter-bar {
            padding: 16px 12px;
          }
          .section-container {
            padding: 52px 16px;
          }
        }
      `}} />
      <Header />

      <main>
        {/* HERO */}
        <section className="company-hero bg-dark">
          <SpotlightCursor color="rgba(0, 90, 226, 0.15)" />
          <div className="hero-glow"></div>
          <div className="hero-glow-2"></div>
          <div className="hero-glow-3"></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 className="hero-title">
              Crestcode <span style={{ color: '#005AE2' }}>Portfolio</span>
            </h1>
            <p className="hero-subtitle">
              <EditableText
                contentKey="company.hero.subtitle"
                value={companyContent?.hero?.subtitle || 'Explore the portfolio of ventures crafted in our product studio.'}
              />
            </p>
          </div>
        </section>

        {/* SECTION: THE KIND OF PROBLEMS WE LOVE */}
        <section className="problems-section">
          <div className="problems-container">
            <div className="problems-header">
              <h2 className="problems-title">
                <EditableText
                  contentKey="company.problems.title"
                  value={companyContent?.problems?.title || 'The Kind of Problems We Love'}
                />
              </h2>
              <p className="problems-subtitle">
                <EditableText
                  contentKey="company.problems.subtitle"
                  value={companyContent?.problems?.subtitle || 'We don\'t shy away from the hard ones.'}
                />
              </p>
            </div>

            <div className="problems-grid">
              {problemsWeLove.map((item, index) => (
                <div key={index} className="problem-card">
                  <div className="problem-icon">
                    {item.icon}
                  </div>
                  <h3 className="problem-card-title">
                    <EditableText
                      contentKey={`company.problems.items.${index}.title`}
                      value={item.title}
                    />
                  </h3>
                  <p className="problem-card-desc">
                    <EditableText
                      contentKey={`company.problems.items.${index}.desc`}
                      value={item.desc}
                    />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dark Section: Make Innovation Accessible */}
        <section className="section-dark" style={{ position: 'relative' }}>
          <SpotlightCursor color="rgba(0, 90, 226, 0.15)" />
          <div className="section-container" style={{ position: 'relative', zIndex: 1 }}>
            <div className="dark-grid">
              <div className="dark-content">
                <EditableText
                  as="h3"
                  contentKey="home.partnership.eyebrow"
                  value={homeContent?.partnership?.eyebrow || 'WE AS CO-FOUNDERS'}
                  className="section-eyebrow"
                />
                <EditableText
                  as="h2"
                  contentKey="home.partnership.title"
                  value={homeContent?.partnership?.title || 'Make Innovation Accessible.'}
                  className="section-title text-white"
                />
                <div className="feature-list">
                  {(homeContent?.partnership?.features || []).map((feature: any, idx: number) => (
                    <div key={idx} className="feature-item">
                      <div className="feature-bullet">&#x2713;</div>
                      <div>
                        <EditableText
                          as="h4"
                          contentKey={`home.partnership.features.${idx}.title`}
                          value={feature.title}
                          className="feature-title"
                        />
                        <EditableText
                          as="p"
                          contentKey={`home.partnership.features.${idx}.description`}
                          value={feature.description}
                          className="feature-desc"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <BorderBeam className="testimonial-card-dark cc-reveal cc-delay-2 cc-card-3d cc-card-3d-dark cc-shine" style={{ padding: 0 }}>
                <div style={{ padding: '32px', height: '100%' }}>
                  <EditableText
                    as="p"
                    contentKey="home.partnership.testimonial.quote"
                    value={homeContent?.partnership?.testimonial?.quote || ''}
                    className="t-card-quote"
                  />
                  <div className="t-card-author">
                    <div className="t-avatar"></div>
                    <div>
                      <EditableText
                        contentKey="home.partnership.testimonial.author"
                        value={homeContent?.partnership?.testimonial?.author || ''}
                        className="t-name"
                      />
                      <EditableText
                        contentKey="home.partnership.testimonial.role"
                        value={homeContent?.partnership?.testimonial?.role || ''}
                        className="t-role"
                      />
                    </div>
                  </div>
                </div>
              </BorderBeam>
            </div>
          </div>
        </section>

        {/* SECTION: HOW A PRODUCT GETS BORN */}
        <section className="process-section">
          <div className="process-header-box">
            <h2 className="process-title">
              <EditableText
                contentKey="company.process.title"
                value={companyContent?.process?.title || 'How a Product Gets Born at Crestcode'}
              />
            </h2>
            <p className="process-subtitle">
              <EditableText
                contentKey="company.process.subtitle"
                value={companyContent?.process?.subtitle || 'Every product we\'ve shipped followed the same discipline.'}
              />
            </p>
          </div>

          <div className="process-list-container">
            {processSteps.map((step, index) => (
              <div key={index} className="process-item">
                <div className="process-icon">
                  {step.icon}
                </div>
                <div className="process-content">
                  <h4 className="process-item-title">
                    <span className="process-item-num">{step.num}</span>{' '}
                    <EditableText
                      contentKey={`company.process.steps.${index}.title`}
                      value={step.title}
                    />
                  </h4>
                  <p className="process-item-desc">
                    <EditableText
                      contentKey={`company.process.steps.${index}.desc`}
                      value={step.desc}
                    />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <div className="cc-footer-wrapper">
        <Footer />
      </div>
    </>
  );
}
