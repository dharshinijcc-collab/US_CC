'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollStack, { ScrollStackItem } from '@/components/ScrollStack';
import { useContent } from '@/context/ContentContext';
import EditableText from '@/components/admin/EditableText';

export default function StudioPage() {
  const { content, loading, error } = useContent();
  const [activeStackIndex, setActiveStackIndex] = useState(0);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [activeTimelineIndex, setActiveTimelineIndex] = useState<number | null>(null);

  useEffect(() => {
    // We can't derive stackCards here because it needs content.
    // But we can use an effect that only runs if content exists.
    if (!content) return;
    
    const studioContent = content.studio;
    const cardsLength = studioContent.solving.cards.length;
    
    const timer = setInterval(() => {
      setActiveStackIndex((prev) => (prev + 1) % cardsLength);
    }, 3500);
    return () => clearInterval(timer);
  }, [content]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-45% 0px -45% 0px', // Very tight margin to highlight exactly at center
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-timeline-index') || '0');
          setActiveTimelineIndex(index);
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.timeline-row-vertical');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [content, loading]);

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#F3F5F9] font-manrope">Loading studio...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen bg-[#F3F5F9] font-manrope text-red-500">Error: {error}</div>;
  if (!content) return null;
  const studioContent = content.studio;

  // 2. Data array for the Stacked Cards from JSON content
  const stackCards = studioContent.solving.cards.map((card, index) => ({
    ...card,
    icon: index === 0 ? <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z" /></svg> :
         index === 1 ? <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" /></svg> :
         index === 2 ? <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> :
         index === 3 ? <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> :
         <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.407 2.67 1M12 17V7m0 10c-1.11 0-2.08-.407-2.67-1M12 17V7" /></svg>,
    color: ["#FF8EBB", "#5C67FF", "#99C26D", "#9C27B0", "#8257e5"][index]
  }));

  // Handler to slide to the next card
  const handleNextCard = () => {
    setActiveStackIndex((prevIndex) => (prevIndex + 1) % stackCards.length);
  };




  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

        :root {
          /* Color System */
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
          --success-green: #10B981;
          --accent-cyan: #00E6A0;
        }

        /* Base Styles */
        body, html {
          margin: 0;
          padding: 0;
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
          background-color: var(--bg-light);
          color: var(--text-black);
          scroll-behavior: smooth;
        }
        
        /* Hide scrollbars */
        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; }

        /* Headings - Manrope */
        h1, h2, h3, h4, h5, h6, .hero-title, .section-title, .section-eyebrow, .card-title, .navbar-brand, .feature-title, .t-name-light, .t-name, .fq-author, .footer-logo, .footer-heading {
          font-family: 'Manrope', sans-serif;
        }

        /* Sub-text - Manrope */
        .section-subtitle, .hero-description, .card-description, .feature-desc, .t-quote, .t-role-light, .t-role, .fq-role, .footer-tagline, .stat-label, .step-desc {
          font-family: 'Manrope', sans-serif;
        }

        /* Content - Inter */
        p, span, div, button, input, textarea, a, li, .navbar-links, .nav-dropdown-content a, .idea-textarea, .form-message {
          font-family: 'Inter', sans-serif;
        }

        * { box-sizing: border-box; }

        .studio-page { min-height: 100vh; overflow-x: hidden; animation: cc-pageSlide 0.7s cubic-bezier(0.4,0,0.2,1) both; }

        .section-container { max-width: 1200px; margin: 0 auto; padding: clamp(40px, 6vw, 80px) 24px; }
        .pt-0 { padding-top: 0 !important; }
        .pb-0 { padding-bottom: 0 !important; }
        
        /* Typography */
        .hero-title { 
          font-size: clamp(2.5rem, 5vw, 4rem); 
          font-weight: 800; 
          letter-spacing: -0.03em; 
          margin-bottom: clamp(16px, 3vw, 24px); 
          line-height: 1.1; 
          color: var(--text-black);
        }
        .text-blue { color: var(--primary-blue); }
        
        .section-title { 
          font-size: clamp(2rem, 4vw, 2.75rem); 
          font-weight: 800; 
          letter-spacing: -0.02em; 
          margin-bottom: clamp(16px, 3vw, 24px); 
          line-height: 1.1; 
          text-align: center;
          color: var(--text-black);
        }
        .section-title-left { text-align: left; }
        .title-dark { color: var(--white); }
        
        .section-eyebrow {
          color: var(--primary-blue);
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-size: clamp(0.6875rem, 1vw, 0.8125rem);
          margin-bottom: 16px;
        }
        
        .hero-eyebrow-pill {
          display: inline-block;
          background-color: #F0F5FF;
          color: var(--primary-blue);
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          margin-bottom: 24px;
        }

        .body-text {
          font-size: clamp(0.95rem, 2vw, 1.125rem);
          line-height: 1.6;
          color: var(--text-muted);
          font-weight: 500;
        }

        /* Buttons */
        .btn-primary { 
          background-color: var(--primary-blue); 
          color: var(--white); 
          padding: 16px 40px; 
          border-radius: 100px; 
          font-weight: 700; 
          font-size: 16px; 
          border: none; 
          cursor: pointer; 
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
          display: inline-block;
          box-shadow: 0 10px 20px -5px rgba(0, 90, 226, 0.3);
        }
        .btn-primary:hover { 
          background-color: #004ac2; 
          transform: translateY(-2px); 
          box-shadow: 0 15px 30px -5px rgba(0, 90, 226, 0.4);
        }
        .btn-primary:active { transform: translateY(0) scale(0.98); }
        .btn-nav { padding: 10px 24px; font-size: 14px; box-shadow: none;}

        /* Layout & Grids */

        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 5vw, 64px); align-items: center; }
        .grid-2-align-top { align-items: start; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }

        /* Sections */
        .section-white { background-color: var(--white); }
        .section-base { background-color: var(--bg-base); }
        .section-dark { background-color: var(--bg-dark); color: var(--white); }

        /* Hero Section */
        .hero-section { padding-top: 140px; }
        .hero-eyebrow-pill {
          display: inline-flex;
          background-color: #E6EFFF;
          color: #005AE2;
          font-weight: 800;
          font-size: 0.75rem;
          padding: 6px 12px;
          border-radius: 100px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 24px;
        }
        .hero-img-col {
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.15);
          height: 100%;
          min-height: 400px;
          background-color: var(--bg-dark);
          position: relative;
        }
        .hero-img-bg {
          width: 100%; height: 100%; position: absolute; top:0; left:0;
          background: url('${studioContent?.hero?.image || "/images/studio/hero-right.jpeg"}') center/cover;
        }
        .hero-img-badge {
          position: absolute;
          bottom: 32px; left: 32px; right: 32px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 24px;
        }
        .hero-badge-dot {
          width: 6px; height: 6px; background-color: #00E6A0; border-radius: 50%; display: inline-block; margin-right: 8px;
        }
        .hero-badge-tag { font-size: 0.7rem; font-weight: 800; color: #FFFFFF; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; margin-bottom: 8px;}
        .hero-badge-val { font-size: 2rem; font-weight: 800; color: var(--white); line-height: 1; margin-bottom: 4px;}
        .hero-badge-lbl { font-size: 0.75rem; font-weight: 500; color: #9CA3AF; }

        /* Idea Validation Section */
        .validation-wrapper { padding: 80px 24px; max-width: 1200px; margin: 0 auto;}
        .validation-card { 
          background: #0B1019;
          border-radius: 24px; 
          padding: clamp(40px, 6vw, 80px);
          color: var(--white);
          box-shadow: 0 40px 80px rgba(0,20,60,0.15);
        }
        .score-panel {
          background-color: #1A1F29;
          border-radius: 16px;
          padding: 32px;
        }
        .score-header {
          display: flex; justify-content: space-between; align-items: center;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding-bottom: 20px; margin-bottom: 24px;
        }
        .score-title-text { font-size: 0.75rem; font-weight: 800; color: #9CA3AF; letter-spacing: 0.1em; text-transform: uppercase;}
        .score-number { font-size: 1.5rem; font-weight: 800; color: var(--primary-blue);}
        .progress-row { margin-bottom: 20px;}
        .progress-labels { display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 500; color: #D1D5DB; margin-bottom: 8px;}
        .progress-track { height: 6px; background-color: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden;}
        .progress-fill { height: 100%; background-color: var(--primary-blue); border-radius: 4px;}
        .status-badge { 
          background-color: rgba(16, 185, 129, 0.1); 
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: var(--success-green); 
          padding: 12px 16px; 
          border-radius: 8px; 
          font-size: 0.875rem; font-weight: 600; 
          display: flex; align-items: center; gap: 8px; 
          margin-top: 32px;
        }

        /* Generic Cards */
        .card { 
          background-color: var(--white); 
          border: 1px solid var(--border-light); 
          padding: 32px; 
          border-radius: 24px; 
          aspect-ratio: 1 / 1;
          transition: transform 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s ease;
          display: flex; flex-direction: column;
          justify-content: center;
          position: relative;
          transform-style: preserve-3d;
        }
        .card:hover { 
          transform: perspective(900px) rotateX(-3deg) rotateY(3deg) translateY(-10px);
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.4);
          background-color: var(--bg-dark); 
          color: var(--white); 
          border: 1px solid var(--border-dark); 
        }

        .card-title { font-size: clamp(1.25rem, 3vw, 1.5rem); font-weight: 800; margin-bottom: 16px; letter-spacing: -0.02em; color: var(--text-black); transition: color 0.3s;}
        .card:hover .card-title { color: var(--white); }
        
        .card-desc { font-size: clamp(0.9rem, 1.5vw, 1rem); color: var(--text-muted); line-height: 1.6; margin-bottom: 32px; font-weight: 500; flex-grow: 1; transition: color 0.3s;}
        .card:hover .card-desc { color: #9CA3AF; }

        .icon-circle { width: 48px; height: 48px; border-radius: 12px; background-color: #F0F5FF; color: var(--primary-blue); display: flex; align-items: center; justify-content: center; margin-bottom: 24px; transition: background-color 0.3s, color 0.3s;}
        .card:hover .icon-circle { background-color: var(--primary-blue); color: var(--white); }
        
        .card-link { font-weight: 800; font-size: 0.875rem; color: var(--primary-blue); text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: color 0.3s;}
        .card:hover .card-link { color: var(--accent-cyan); }

        .card-desc span { color: var(--text-main); transition: color 0.3s; }
        .card:hover .card-desc span { color: var(--white); }

        /* Lists */
        .check-list { list-style: none; padding: 0; margin: 0 0 32px 0; }
        .check-list li { display: flex; align-items: center; font-size: clamp(0.9rem, 1.5vw, 1rem); color: var(--text-main); font-weight: 700; margin-bottom: 16px; }
        .card-dark .check-list li { color: var(--white); }
        .check-icon { color: var(--primary-blue); margin-right: 12px; font-weight: 800; font-size: 1.2rem;}

        /* --- UPDATED: Solving It Section (Dark) & Stacked Fanned Cards --- */
        .solving-col-text {
          font-size: clamp(1.125rem, 2.5vw, 1.35rem);
          line-height: 1.6;
          color: rgba(255,255,255,0.9);
          text-align: center;
          font-weight: 500;
          max-width: 400px;
          margin: 0 auto;
        }
        .solving-subtitle {
          font-size: clamp(1.25rem, 2vw, 1.5rem);
          font-weight: 800;
          color: var(--white);
          text-align: center;
          margin-bottom: 40px;
          letter-spacing: -0.01em;
        }

        .card-stack-wrapper {
          position: relative;
          width: 100%;
          max-width: 320px;
          margin: 0 auto;
          height: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        /* The white rounded-square cards fanning out */
        .card-stack-item {
          position: absolute;
          width: 300px;
          height: 300px;
          background: var(--white);
          border-radius: 20px;
          padding: 40px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          user-select: none;
          transform-origin: center center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          border: 1px solid #E2E8F0;
        }

        .card-stack-icon {
          width: 56px;
          height: 56px;
          background-color: #FF8EBB; /* Exact pink from the image */
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          color: white;
          flex-shrink: 0;
        }

        .card-stack-text {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.8;
          font-weight: 600;
          overflow: hidden;
          margin: 0;
        }

        /* Highlight active card on hover */
        .card-stack-item.active-hover:hover {
          transform: translateY(-10px) rotate(2deg) scale(1.05) !important;
          box-shadow: 0 40px 80px -15px rgba(0, 90, 226, 0.25) !important;
          z-index: 60 !important;
        }
        .card-stack-item {
          cursor: pointer;
        }

        /* Purple 'C' Bubble Badge at bottom right of the card stack */
        .c-badge-bubble {
          position: absolute;
          bottom: -16px;
          right: -16px;
          width: 72px;
          height: 72px;
          background-color: white;
          border-radius: 50%;
          border-bottom-left-radius: 4px; /* Creates the teardrop shape pointing down-left */
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          z-index: 30;
        }
        .c-badge-inner {
          width: 52px;
          height: 52px;
          background-color: #B548C6; /* Purple color from image */
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 20px;
        }

        /* Why Ideas Fail Section */
        .feature-box { background-color: var(--bg-dark); color: var(--white); padding: 32px; border-radius: 20px; margin-bottom: 16px; display: flex; align-items: flex-start; gap: 20px; border: 1px solid var(--border-dark); }
        .feature-box-icon { width: 40px; height: 40px; background-color: rgba(255,255,255,0.05); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--primary-blue); flex-shrink: 0;}
        .feature-box h4 { margin: 0 0 8px 0; font-size: 1.15rem; font-weight: 800; }
        .feature-box p { margin: 0; font-size: 0.95rem; color: #9CA3AF; line-height: 1.6; font-weight: 500;}
        .image-box-abstract { border-radius: 24px; overflow: hidden; height: 100%; min-height: 400px; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.15);}

        /* What We Look For */
        .look-card { background: #F1F3F5; border-radius: 32px; padding: 48px 40px; text-align: left; border: none; box-shadow: none; height: 100%; display: flex; flex-direction: column; justify-content: flex-start; transition: transform 0.3s ease; }
        .look-card:hover { transform: translateY(-8px); }
        .look-icon { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; color: #005AE2; margin-bottom: 40px; background: none; padding: 0; }
        .look-icon svg { width: 100%; height: 100%; }
        .look-title { font-size: 1.5rem; font-weight: 800; margin-bottom: 20px; color: var(--text-black); }
        .look-desc { font-size: 1rem; color: var(--text-muted); line-height: 1.6; font-weight: 500; }

        /* The Build Timeline Section */
        .timeline-section-vertical { 
          padding: 80px 0;
          background-color: #0B1019;
          position: relative; 
          overflow: hidden;
        }

        .timeline-section-vertical::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: rgba(255,255,255,0.06);
        }

        .timeline-section-vertical::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: rgba(255,255,255,0.06);
        }

        .timeline-container-vertical { 
          position: relative; 
          max-width: 1100px; 
          margin: 48px auto 0; 
          padding: 0 24px;
        }

        .timeline-center-line { 
          position: absolute; 
          left: 50%; 
          top: 0; 
          bottom: 0; 
          width: 1px; 
          background: rgba(255, 255, 255, 0.06); 
          transform: translateX(-50%); 
          z-index: 1;
        }

        .timeline-row-vertical { 
          display: flex; 
          align-items: stretch; 
          position: relative; 
          margin-bottom: 28px; 
          z-index: 2;
          width: 100%;
        }

        .timeline-row-vertical:nth-child(odd) { 
          padding-right: calc(50% + 32px); 
          justify-content: flex-end;
        }

        .timeline-row-vertical:nth-child(even) { 
          padding-left: calc(50% + 32px); 
          justify-content: flex-start;
        }

        .timeline-phase-pill { 
          width: 100%;
          min-height: 120px; 
          background: rgba(255, 255, 255, 0.03); 
          padding: 28px 32px; 
          border-radius: 16px; 
          display: flex; 
          align-items: flex-start; 
          gap: 20px; 
          border: 1px solid rgba(255, 255, 255, 0.07);
          transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
          position: relative;
        }

        .timeline-phase-pill:hover,
        .timeline-phase-pill.active-scroll {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-3px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.3);
        }

        /* Step number badge — matches site's blue accent */
        .timeline-badge {
          flex-shrink: 0;
          width: 44px;
          height: 44px;
          background: var(--primary-blue);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.875rem;
          font-weight: 800;
          font-family: 'Manrope', sans-serif;
          letter-spacing: -0.01em;
          transition: all 0.4s;
          box-shadow: 0 4px 12px rgba(0, 90, 226, 0.3);
          position: static;
          top: auto;
          right: auto;
        }

        .timeline-phase-pill.active-scroll .timeline-badge {
          box-shadow: 0 6px 20px rgba(0, 90, 226, 0.5);
          transform: scale(1.05);
        }

        .timeline-left-side { 
          display: none; 
        }

        .timeline-right-side { 
          flex: 1;
          min-width: 0;
          padding-top: 2px;
        }

        .timeline-dot { 
          position: absolute; 
          left: 50%; 
          top: 50%;
          width: 9px; 
          height: 9px; 
          background: rgba(255, 255, 255, 0.15); 
          border-radius: 50%; 
          transform: translate(-50%, -50%); 
          z-index: 3;
          transition: all 0.4s;
        }

        .timeline-row-vertical:has(.active-scroll) .timeline-dot {
          background: var(--primary-blue);
          box-shadow: 0 0 0 4px rgba(0, 90, 226, 0.25);
          transform: translate(-50%, -50%) scale(1.3);
        }

        .t-title-new {
          font-family: 'Manrope', sans-serif !important;
          font-size: 1.05rem !important;
          font-weight: 700 !important;
          color: rgba(255, 255, 255, 0.92) !important;
          margin: 0 0 6px 0 !important;
          line-height: 1.3 !important;
          letter-spacing: -0.01em;
        }

        .t-desc-new {
          font-family: 'Inter', sans-serif !important;
          font-size: 0.88rem !important;
          color: rgba(255, 255, 255, 0.45) !important;
          line-height: 1.65 !important;
          margin: 0 !important;
        }

        .t-duration-label {
          display: inline-block;
          margin-top: 10px;
          font-size: 0.72rem;
          color: var(--primary-blue);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-family: 'Manrope', sans-serif;
        }

        .timeline-phase-pill.active-scroll .t-title-new {
          color: #FFFFFF !important;
        }

        .timeline-phase-pill.active-scroll .t-desc-new {
          color: rgba(255, 255, 255, 0.65) !important;
        }

        @media (max-width: 768px) {
          .timeline-center-line { left: 24px; transform: none; }
          .timeline-dot { left: 24px; transform: translateX(-50%); }
          .timeline-row-vertical:nth-child(odd), .timeline-row-vertical:nth-child(even) {
            padding-left: 50px;
            padding-right: 0;
            justify-content: flex-start;
          }
          .timeline-phase-pill { 
            width: 100%; 
            margin: 0 !important; 
            border-radius: 24px; 
            padding: 24px; 
            flex-direction: column; 
            align-items: flex-start; 
            gap: 12px; 
          }
        }

        /* FAQ */
        .faq-item { background-color: var(--white); border: 1px solid var(--border-light); border-radius: 20px; padding: 24px 32px; margin-bottom: 16px; cursor: pointer; transition: box-shadow 0.2s;}
        .faq-item:hover { box-shadow: 0 10px 20px -10px rgba(0,0,0,0.05); }
        .faq-header { display: flex; justify-content: space-between; align-items: center; font-weight: 800; font-size: clamp(1rem, 2vw, 1.125rem); color: var(--text-main); }
        .faq-icon { font-size: 1.5rem; color: var(--text-muted); font-weight: 400;}
        .faq-content { margin-top: 16px; font-size: clamp(0.9rem, 1.5vw, 1rem); color: var(--text-muted); line-height: 1.6; font-weight: 500; display: block; }

        /* Footer */
        .footer { background-color: var(--bg-dark); color: #9CA3AF; padding: 80px 0 60px; font-size: clamp(0.875rem, 1.5vw, 1rem); font-weight: 500; border-top: 1px solid var(--border-dark);}
        .footer-logo { color: var(--white); font-weight: 800; font-size: clamp(1.125rem, 2.5vw, 1.25rem); margin-bottom: 16px; letter-spacing: -0.02em; }
        .footer-heading { color: var(--white); font-weight: 700; margin-bottom: 24px; font-size: 1rem; }
        .footer-links ul { list-style: none; padding: 0; margin: 0; }
        .footer-links li { margin-bottom: 16px; }
        .footer-links a { color: #9CA3AF; text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: var(--white); }

        /* Mobile Responsive System */
        @media (max-width: 900px) {
          .grid-2, .grid-3, .grid-4 {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .section-container {
            padding: 60px 20px !important;
          }
          .section-title {
            font-size: 2.25rem !important;
            text-align: center !important;
            transform: none !important;
            margin-bottom: 40px !important;
          }
          .hero-section {
            padding-top: 120px !important;
          }
          .hero-img-col {
            min-height: 400px !important;
            margin-top: 40px;
          }
          .card-stack-wrapper {
            height: 400px !important;
          }
          .card-stack-item {
            width: 320px !important;
            height: 320px !important;
            padding: 32px !important;
          }
          .solving-subtitle {
            font-size: 1.75rem !important;
            text-align: center !important;
          }
          .solving-col-text {
            font-size: 1rem !important;
            text-align: center !important;
          }
          .card {
            aspect-ratio: auto !important;
          }
        }

        /* Dark Shine Card */
        .dark-shine-card {
          background-color: var(--bg-dark) !important;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid rgba(255,255,255,0.05) !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2) !important;
        }
        .dark-shine-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 100%);
          transform: skewX(-25deg);
          transition: left 0.7s ease;
          z-index: 1;
          pointer-events: none;
        }
        .dark-shine-card:hover::before {
          left: 200%;
        }
        .dark-shine-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.3) !important;
        }

      `}} />

      <Header />
      <div className="studio-page" style={{ position: 'relative', overflow: 'hidden' }}>

        {/* Ambient glow orbs */}

        {/* Hero Section */}
        <section className="section-white hero-section" style={{ position: 'relative' }}>
          <div className="section-container grid-2 pt-0 pb-0" style={{ position: 'relative', zIndex: 1 }}>
            <div>
              <EditableText 
                contentKey="studio.hero.eyebrow"
                value={studioContent.hero.eyebrow}
                className="hero-eyebrow-pill"
              />
              <h1 className="hero-title">
                {studioContent.hero.title?.split(' ').map((word: string, i: number) => {
                  const cleanWord = word.replace(/[^a-zA-Z]/g, '');
                  const isBlue = ['Venture', 'Studio'].includes(cleanWord);
                  
                  if (isBlue) {
                    const match = word.match(/^([a-zA-Z]+)(.*)$/);
                    if (match) {
                      return (
                        <span key={i}>
                          <span style={{ color: '#005AE2' }}>{match[1]}</span>
                          {match[2]}
                          {' '}
                        </span>
                      );
                    }
                  }
                  
                  return (
                    <span key={i}>
                      {word}{' '}
                    </span>
                  );
                })}
              </h1>
              <EditableText 
                as="p"
                contentKey="studio.hero.subheading"
                value={studioContent.hero.subheading}
                className="body-text"
                style={{ marginBottom: '40px', maxWidth: '520px', textAlign: 'justify', lineHeight: '1.7' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }} className="cc-reveal">
                <button className="btn-primary" onClick={() => document.getElementById('methodology-section')?.scrollIntoView({behavior: 'smooth'})}>
                  <EditableText contentKey="studio.hero.buttonText" value={studioContent.hero.buttonText} />
                </button>
              </div>
            </div>
            <div className="hero-img-col">
              <div className="hero-img-bg"></div>

            </div>
          </div>
        </section>

        {/* Idea Validation Section */}
        <div className="validation-wrapper section-base" style={{ backgroundColor: 'var(--white)' }}>
          <div className="validation-card grid-2">
            <div>
              <EditableText 
                as="h2"
                contentKey="studio.validation.title"
                value={studioContent.validation.title}
                className="section-title section-title-left title-dark"
              />
              <EditableText 
                as="p"
                contentKey="studio.validation.description"
                value={studioContent.validation.description}
                className="body-text"
                style={{ marginBottom: '40px', color: '#9CA3AF' }}
              />
              <Link href="/contact">
                <button className="btn-primary" style={{ backgroundColor: '#005AE2', boxShadow: '0 8px 32px rgba(0, 90, 226, 0.4)', padding: '12px 32px', borderRadius: '100px' }}>
                  <EditableText contentKey="studio.validation.buttonText" value={studioContent.validation.buttonText} />
                </button>
              </Link>
            </div>

            <div className="score-panel">
              <div className="score-header">
                <EditableText 
                  contentKey="studio.validation.scoreLabel"
                  value={studioContent.validation.scoreLabel}
                  className="score-title-text"
                  style={{ color: '#9CA3AF', fontSize: '0.7rem', fontWeight: 700 }}
                />
                <EditableText 
                  contentKey="studio.validation.scoreValue"
                  value={studioContent.validation.scoreValue}
                  className="score-number"
                  style={{ color: '#005AE2', fontSize: '1.5rem', fontWeight: 800 }}
                />
              </div>

              <div className="progress-row">
                <div className="progress-labels">
                  <EditableText contentKey="studio.validation.marketFitLabel" value={studioContent.validation.marketFitLabel} style={{ color: '#9CA3AF', fontSize: '0.8rem' }} />
                  <EditableText contentKey="studio.validation.marketFitValue" value={studioContent.validation.marketFitValue} style={{ color: '#9CA3AF', fontSize: '0.8rem' }} />
                </div>
                <div className="progress-track" style={{ backgroundColor: '#2A303C', height: '4px', borderRadius: '2px' }}>
                  <div className="progress-fill" style={{ width: '92%', height: '4px', borderRadius: '2px', backgroundColor: '#005AE2' }}></div>
                </div>
              </div>

              <div className="progress-row">
                <div className="progress-labels">
                  <EditableText contentKey="studio.validation.techFeasibilityLabel" value={studioContent.validation.techFeasibilityLabel} style={{ color: '#9CA3AF', fontSize: '0.8rem' }} />
                  <EditableText contentKey="studio.validation.techFeasibilityValue" value={studioContent.validation.techFeasibilityValue} style={{ color: '#9CA3AF', fontSize: '0.8rem' }} />
                </div>
                <div className="progress-track" style={{ backgroundColor: '#2A303C', height: '4px', borderRadius: '2px' }}>
                  <div className="progress-fill" style={{ width: '78%', height: '4px', borderRadius: '2px', backgroundColor: '#005AE2' }}></div>
                </div>
              </div>

              <div className="progress-row" style={{ marginBottom: '24px' }}>
                <div className="progress-labels">
                  <EditableText contentKey="studio.validation.gtmStrategyLabel" value={studioContent.validation.gtmStrategyLabel} style={{ color: '#9CA3AF', fontSize: '0.8rem' }} />
                  <EditableText contentKey="studio.validation.gtmStrategyValue" value={studioContent.validation.gtmStrategyValue} style={{ color: '#9CA3AF', fontSize: '0.8rem' }} />
                </div>
                <div className="progress-track" style={{ backgroundColor: '#2A303C', height: '4px', borderRadius: '2px' }}>
                  <div className="progress-fill" style={{ width: '81%', height: '4px', borderRadius: '2px', backgroundColor: '#005AE2' }}></div>
                </div>
              </div>

              <div style={{ backgroundColor: '#122624', color: '#00E6A0', padding: '12px 16px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                <EditableText contentKey="studio.validation.growthBadge" value={studioContent.validation.growthBadge} />
              </div>
            </div>
          </div>
        </div>

        {/* For Founders vs. For Investors Section */}
        <section className="section-base" style={{ position: 'relative' }}>
          <div className="section-container" style={{ position: 'relative', zIndex: 1 }}>
            <EditableText 
              as="h2"
              contentKey="studio.foundersInvestors.title"
              value={studioContent.foundersInvestors.title}
              className="section-title"
            />
            <div className="grid-2 grid-2-align-top" style={{ marginTop: '64px' }}>

              <div className="card dark-shine-card" style={{ padding: '40px' }}>
                <EditableText 
                  as="h3"
                  contentKey="studio.foundersInvestors.founders.title"
                  value={studioContent.foundersInvestors.founders.title}
                  className="card-title relative z-10"
                  style={{ fontSize: '1.5rem', marginBottom: '24px', color: '#FFFFFF' }}
                />
                <EditableText 
                  as="p"
                  contentKey="studio.foundersInvestors.founders.description"
                  value={studioContent.foundersInvestors.founders.description}
                  className="card-desc relative z-10"
                  style={{ color: '#9CA3AF', fontSize: '0.95rem', marginBottom: '32px', lineHeight: '1.6' }}
                />
                <ul className="check-list relative z-10" style={{ marginBottom: '40px' }}>
                  {studioContent.foundersInvestors.founders.benefits.map((benefit, bIdx) => (
                    <li key={bIdx} style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', color: '#E2E8F0', fontSize: '0.9rem', fontWeight: 600 }}>
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#60A5FA" strokeWidth="2" style={{ marginRight: '12px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <EditableText contentKey={`studio.foundersInvestors.founders.benefits.${bIdx}`} value={benefit} />
                    </li>
                  ))}
                </ul>
                <a href="#founders" className="card-link relative z-10" style={{ color: '#60A5FA', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                  <EditableText contentKey="studio.foundersInvestors.founders.buttonText" value={studioContent.foundersInvestors.founders.buttonText} /> 
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
                </a>
              </div>

              <div className="card dark-shine-card" style={{ padding: '40px' }}>
                <EditableText 
                  as="h3"
                  contentKey="studio.foundersInvestors.investors.title"
                  value={studioContent.foundersInvestors.investors.title}
                  className="card-title relative z-10"
                  style={{ fontSize: '1.5rem', marginBottom: '24px', color: '#FFFFFF' }}
                />
                <EditableText 
                  as="p"
                  contentKey="studio.foundersInvestors.investors.description"
                  value={studioContent.foundersInvestors.investors.description}
                  className="card-desc relative z-10"
                  style={{ color: '#9CA3AF', fontSize: '0.95rem', marginBottom: '32px', lineHeight: '1.6' }}
                />
                <ul className="check-list relative z-10" style={{ marginBottom: '40px' }}>
                  {studioContent.foundersInvestors.investors.benefits.map((benefit, bIdx) => (
                    <li key={bIdx} style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', color: '#E2E8F0', fontSize: '0.9rem', fontWeight: 600 }}>
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#60A5FA" strokeWidth="2" style={{ marginRight: '12px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <EditableText contentKey={`studio.foundersInvestors.investors.benefits.${bIdx}`} value={benefit} />
                    </li>
                  ))}
                </ul>
                <a href="/investors" className="card-link relative z-10" style={{ color: '#60A5FA', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <EditableText contentKey="studio.foundersInvestors.investors.buttonText" value={studioContent.foundersInvestors.investors.buttonText} />
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
                </a>
              </div>

            </div>
          </div>
        </section>

        {/* How the Partnership Works */}
        <section className="section-white" id="methodology-section">
          <div className="section-container" style={{ maxWidth: '1280px' }}>
            <EditableText 
              as="h2"
              contentKey="studio.partnership.title"
              value={studioContent.partnership.title}
              className="section-title"
            />
            <div className="grid-3" style={{ marginTop: '64px', gap: '32px' }}>

              <div className="card" style={{ padding: '40px 32px', aspectRatio: 'auto' }}>
                <div className="icon-circle">1</div>
                <EditableText 
                  as="h3"
                  contentKey="studio.partnership.support.title"
                  value={studioContent.partnership.support.title}
                  className="card-title"
                  style={{ fontSize: '1.25rem' }}
                />
                <div className="card-desc" style={{ fontSize: '0.9rem', marginBottom: 0 }}>
                  <EditableText contentKey="studio.partnership.support.description" value={studioContent.partnership.support.description} />
                  <br /><br />
                  <span style={{ fontWeight: 700 }}>Best for:</span> <EditableText contentKey="studio.partnership.support.bestFor" value={studioContent.partnership.support.bestFor} />
                </div>
              </div>

              <div className="card cc-slide-center" style={{ padding: '40px 32px', aspectRatio: 'auto' }}>
                <div className="icon-circle">2</div>
                <EditableText 
                  as="h3"
                  contentKey="studio.partnership.codevelopment.title"
                  value={studioContent.partnership.codevelopment.title}
                  className="card-title"
                  style={{ fontSize: '1.25rem' }}
                />
                <div className="card-desc" style={{ fontSize: '0.9rem', marginBottom: 0 }}>
                  <EditableText contentKey="studio.partnership.codevelopment.description" value={studioContent.partnership.codevelopment.description} />
                  <br /><br />
                  <span style={{ fontWeight: 700 }}>Best for:</span> <EditableText contentKey="studio.partnership.codevelopment.bestFor" value={studioContent.partnership.codevelopment.bestFor} />
                </div>
              </div>

              <div className="card" style={{ padding: '40px 32px', aspectRatio: 'auto' }}>
                <div className="icon-circle">3</div>
                <EditableText 
                  as="h3"
                  contentKey="studio.partnership.fullBuild.title"
                  value={studioContent.partnership.fullBuild.title}
                  className="card-title"
                  style={{ fontSize: '1.25rem' }}
                />
                <div className="card-desc" style={{ fontSize: '0.9rem', marginBottom: 0 }}>
                  <EditableText contentKey="studio.partnership.fullBuild.description" value={studioContent.partnership.fullBuild.description} />
                  <br /><br />
                  <span style={{ fontWeight: 700 }}>Best for:</span> <EditableText contentKey="studio.partnership.fullBuild.bestFor" value={studioContent.partnership.fullBuild.bestFor} />
                </div>
              </div>

            </div>
          </div>
        </section>

        <section className="section-dark" style={{ backgroundColor: '#0A0F1C', padding: '100px 24px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Main Section Title */}
            <EditableText 
              as="h2"
              contentKey="studio.solving.title"
              value={studioContent.solving.title}
              className="section-title title-dark"
              style={{ marginBottom: '80px', textAlign: 'center', fontSize: '3.5rem', fontWeight: 800, transform: 'translateX(-40px)' }}
            />
            <div className="grid-2" style={{ alignItems: 'center', gap: 'clamp(40px, 8vw, 120px)', display: 'grid' }}>
              {/* Left Column: Problem Step */}
              <div className="solving-text-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <EditableText 
                  as="h3"
                  contentKey={`studio.solving.cards.${activeStackIndex}.title`}
                  value={stackCards[activeStackIndex].title}
                  className="solving-subtitle"
                  style={{ fontSize: '2.25rem', marginBottom: '24px', fontWeight: 800, color: '#FFFFFF', textAlign: 'center', width: '100%' }}
                />
                <EditableText 
                  as="p"
                  contentKey={`studio.solving.cards.${activeStackIndex}.problemDesc`}
                  value={stackCards[activeStackIndex].problemDesc}
                  className="solving-col-text"
                  style={{ fontSize: '1.25rem', color: '#CBD5E1', maxWidth: '480px', lineHeight: '1.6', fontWeight: 500, margin: '0', textAlign: 'center' }}
                />
              </div>

              {/* Right Column: Solution Stack */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div className="card-stack-wrapper" onClick={handleNextCard} style={{ perspective: '1500px', height: '440px', width: '100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div className="card-stack-container" style={{ position: 'relative', width: 'min(400px, 100%)', height: 'min(400px, 100%)' }}>
                    {stackCards.map((card, index) => {
                      const isActive = index === activeStackIndex;
                      const isPast = index < activeStackIndex;

                      let transform = '';
                      let zIndex = 50 - index;
                      let opacity = 1;

                      // Fanned calculation:
                      const offset = index - activeStackIndex;
                      if (isPast) {
                        transform = 'translate(-150px, -100px) rotate(-45deg) scale(0.7)';
                        opacity = 0;
                        zIndex = 0;
                      } else {
                        // Creating a balanced arc fan where edges are visible on all sides
                        // We use a combination of rotation and translation to spread them out
                        const rotation = offset * 12.5; 
                        const translateX = offset * 12; 
                        const translateY = offset * 8;
                        transform = `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg)`;
                        opacity = 1 - (offset * 0.1);
                        zIndex = 50 - offset;
                      }

                      return (
                        <div
                          key={card.id}
                          className={`card-stack-item ${isActive ? 'active-hover' : ''}`}
                          style={{
                            transform,
                            zIndex,
                            opacity,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            transformOrigin: 'bottom center', // Creates a natural fan from the bottom
                            transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            background: 'white',
                            borderRadius: '32px',
                            padding: '48px',
                            width: '400px',
                            height: '400px',
                            boxShadow: isActive ? '0 40px 80px -15px rgba(0,0,0,0.2)' : '0 10px 30px rgba(0,0,0,0.1)',
                            border: '1px solid rgba(0,0,0,0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <div className="card-stack-icon" style={{
                            backgroundColor: card.color || '#FF8EBB',
                            width: '80px', height: '80px',
                            borderRadius: '16px', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            marginBottom: '32px', color: 'white',
                            flexShrink: 0,
                            opacity: 0.9
                          }}>
                            {React.cloneElement(card.icon as React.ReactElement<any>, { width: 32, height: 32 })}
                          </div>
                          <EditableText 
                            as="p"
                            contentKey={`studio.solving.cards.${index}.solutionDesc`}
                            value={card.solutionDesc}
                            className="card-stack-text"
                            style={{ 
                              fontSize: '1rem', 
                              color: '#475569', 
                              fontWeight: 500, 
                              lineHeight: 1.7, 
                              margin: 0, 
                              textAlign: 'center',
                              maxWidth: '320px'
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Caption below cards */}
                <EditableText 
                  as="p"
                  contentKey="studio.solving.caption"
                  value={studioContent.solving.caption}
                  style={{ 
                    color: '#005AE2', 
                    fontSize: '0.75rem', 
                    fontWeight: 800, 
                    letterSpacing: '0.1em', 
                    textTransform: 'uppercase',
                    marginTop: '40px',
                    marginLeft: '80px'
                  }}
                />
              </div>
            </div>
          </div>
        </section>
        {/* Why Ideas Never Launch */}
        <section className="section-base">
          <div className="section-container grid-2">
            <div>
              <EditableText 
                as="h2"
                contentKey="studio.whyIdeasFail.title"
                value={studioContent.whyIdeasFail.title}
                className="section-title section-title-left"
              />
              <EditableText 
                as="p"
                contentKey="studio.whyIdeasFail.description"
                value={studioContent.whyIdeasFail.description}
                className="body-text"
                style={{ marginBottom: '48px' }}
              />

              <div className="feature-box">
                <div className="feature-box-icon">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <div>
                  <EditableText as="h4" contentKey="studio.whyIdeasFail.problems.0.title" value={studioContent.whyIdeasFail.problems[0].title} />
                  <EditableText as="p" contentKey="studio.whyIdeasFail.problems.0.description" value={studioContent.whyIdeasFail.problems[0].description} />
                </div>
              </div>

              <div className="feature-box">
                <div className="feature-box-icon">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <EditableText as="h4" contentKey="studio.whyIdeasFail.problems.1.title" value={studioContent.whyIdeasFail.problems[1].title} />
                  <EditableText as="p" contentKey="studio.whyIdeasFail.problems.1.description" value={studioContent.whyIdeasFail.problems[1].description} />
                </div>
              </div>
            </div>

            <div className="image-box-abstract" style={{ position: 'relative', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img 
                src={studioContent.whyIdeasFail.image || "/images/core_capabilities.png"} 
                alt="Our Core Capabilities" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  objectPosition: 'center',
                  borderRadius: '24px',
                  transform: 'scale(1.1)' /* Subtle zoom as requested earlier, while staying centered */
                }} 
              />
            </div>
          </div>
        </section>

        {/* What We Look For */}
        <section className="section-white" style={{ paddingBottom: '20px' }}>
          <div className="section-container">
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <EditableText 
                as="h2"
                contentKey="studio.whatWeLookFor.title"
                value={studioContent.whatWeLookFor.title}
                className="section-title"
                style={{ marginBottom: '24px' }}
              />
              <EditableText 
                as="p"
                contentKey="studio.whatWeLookFor.subtitle"
                value={studioContent.whatWeLookFor.subtitle}
                className="section-subtitle"
                style={{ maxWidth: '700px', margin: '0 auto', color: '#64748B', lineHeight: 1.6 }}
              />
            </div>
            
            <div className="grid-4" style={{ gap: '24px' }}>
              {studioContent.whatWeLookFor.criteria.map((criterion, cIdx) => (
                <div key={cIdx} className="look-card">
                  <div className="look-icon">
                    {cIdx === 0 ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> :
                     cIdx === 1 ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2-2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg> :
                     cIdx === 2 ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> :
                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                  </div>
                  <EditableText as="h4" contentKey={`studio.whatWeLookFor.criteria.${cIdx}.title`} value={criterion.title} className="look-title" />
                  <EditableText as="p" contentKey={`studio.whatWeLookFor.criteria.${cIdx}.description`} value={criterion.description} className="look-desc" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The Build Timeline */}
        <section className="timeline-section-vertical">
          <div className="section-container">
            <EditableText 
              as="h2"
              contentKey="studio.timeline.title"
              value={studioContent.timeline.title}
              className="section-title"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 3rem)', fontWeight: 800, color: '#FFFFFF' }}
            />
            <EditableText 
              as="p"
              contentKey="studio.timeline.subtitle"
              value={studioContent.timeline.subtitle}
              className="section-subtitle text-center mx-auto"
              style={{ maxWidth: '800px', marginBottom: '16px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6 }}
            />

            <div className="timeline-container-vertical">
              <div className="timeline-center-line"></div>
              
              {studioContent.timeline.phases.map((phase, pIdx) => (
                <div key={pIdx} className="timeline-row-vertical" data-timeline-index={pIdx}>
                  <div className="timeline-dot"></div>
                  <div className={`timeline-phase-pill ${activeTimelineIndex === pIdx ? 'active-scroll' : ''}`}>
                     <div className="timeline-badge">
                        {pIdx + 1 < 10 ? `0${pIdx + 1}` : pIdx + 1}
                     </div>
                     <div className="timeline-right-side">
                        <EditableText as="h4" contentKey={`studio.timeline.phases.${pIdx}.title`} value={phase.title} className="t-title-new" />
                        <EditableText as="p" contentKey={`studio.timeline.phases.${pIdx}.description`} value={phase.description} className="t-desc-new" />
                        <div className="t-duration-label">{phase.duration}</div>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        {studioContent.faq && (
        <section id="faq" className="section-base" style={{ paddingTop: '0' }}>
          <div className="section-container">
            <EditableText 
              as="h2"
              contentKey="studio.faq.title"
              value={studioContent.faq?.title}
              className="section-title text-center"
              style={{ marginBottom: '64px' }}
            />

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              {studioContent.faq?.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="faq-item"
                  onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="faq-header">
                    <EditableText as="span" contentKey={`studio.faq.items.${idx}.question`} value={item.question} />
                    <span className="faq-icon" style={{ transition: 'transform 0.3s', display: 'inline-block', transform: openFaqIdx === idx ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
                  </div>
                  {openFaqIdx === idx && (
                    <EditableText 
                      as="div"
                      contentKey={`studio.faq.items.${idx}.answer`}
                      value={item.answer}
                      className="faq-content"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* CTA */}
        {studioContent.cta && (
        <section className="section-white text-center">
          <div className="section-container" style={{ paddingTop: 'clamp(80px, 10vw, 120px)', paddingBottom: 'clamp(80px, 10vw, 120px)' }}>
            <EditableText 
              as="h2"
              contentKey="studio.cta.title"
              value={studioContent.cta?.title}
              className="section-title"
              style={{ marginBottom: '24px' }}
            />
            <EditableText 
              as="p"
              contentKey="studio.cta.subtitle"
              value={studioContent.cta?.subtitle}
              className="section-subtitle text-center"
            />
            <Link href="/">
              <button className="btn-primary" style={{ marginTop: '32px', padding: '20px 48px', fontSize: '1.125rem' }}>
                <EditableText contentKey="studio.cta.buttonText" value={studioContent.cta?.buttonText} />
              </button>
            </Link>
          </div>
        </section>
        )}

        <Footer />

      </div>
    </>
  );
}
