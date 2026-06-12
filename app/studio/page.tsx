'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollStack, { ScrollStackItem } from '@/components/ScrollStack';
import { useContent } from '@/context/ContentContext';
import EditableText from '@/components/admin/EditableText';
import '@/app/global-styles.css';

// Solving section — clean redesign
// Small tight fan (9/17/23px offsets, 5/9/13deg), no dots, no progress bar
// Icon stroke uses card accent color for a polished tinted look

const INTERVAL = 3600;

const FAN = [
  { tx: 0,  ty: 0,  r: 0,  z: 40, op: 1,    shadow: '0 16px 48px -8px rgba(0,0,0,0.32), 0 4px 16px -4px rgba(0,0,0,0.16)' },
  { tx: 9,  ty: 11, r: 5,  z: 30, op: 1,    shadow: 'none' },
  { tx: 17, ty: 20, r: 9,  z: 20, op: 0.90, shadow: 'none' },
  { tx: 23, ty: 27, r: 13, z: 10, op: 0.75, shadow: 'none' },
];

function SolvingSection({ stackCards, studioContent, EditableText }: any) {
  const n = stackCards.length;
  const [active, setActive] = useState(0);
  const [exiting, setExiting] = useState<number | null>(null);

  useEffect(() => {
    const t = setInterval(() => {
      setActive(prev => {
        setExiting(prev);
        setTimeout(() => setExiting(null), 380);
        return (prev + 1) % n;
      });
    }, INTERVAL);
    return () => clearInterval(t);
  }, [n]);

  return (
    <section
      className="section-dark"
      style={{ backgroundColor: '#060B18', padding: '24px 24px' }}
    >
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(40px, 6vw, 72px)',
          alignItems: 'center',
        }}>

          {/* ── Left ── */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="hero-eyebrow-pill" style={{ marginBottom: '24px' }}>Solving It</div>
            <EditableText
              as="h2"
              contentKey="studio.solving.title"
              value={studioContent.solving.title}
              className="section-title title-dark"
              style={{
                textAlign: 'left',
                color: '#fff',
                marginBottom: '32px',
              }}
            />
            <span style={{
              fontSize: '0.68rem', fontWeight: 800,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: '#2563EB', marginBottom: '20px',
            }}>
              {String(active + 1).padStart(2, '0')} — {String(n).padStart(2, '0')}
            </span>

            <EditableText
              as="h3"
              contentKey={`studio.solving.cards.${active}.title`}
              value={stackCards[active].title}
              style={{
                fontSize: 'clamp(1.3rem, 2.5vw, 1.65rem)',
                fontWeight: 800,
                color: '#fff',
                letterSpacing: '-0.01em',
                lineHeight: 1.3,
                marginBottom: '16px',
              }}
            />
            <EditableText
              as="p"
              contentKey={`studio.solving.cards.${active}.problemDesc`}
              value={stackCards[active].problemDesc}
              style={{
                fontSize: '0.95rem',
                color: '#64748B',
                lineHeight: 1.8,
                fontWeight: 500,
                margin: 0,
              }}
            />
          </div>

          {/* ── Right: deck ── */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative', width: '280px', height: '310px' }}>

              {/* Paint back-to-front */}
              {[...Array(n)].map((_, rev) => {
                const index = n - 1 - rev;
                const slot = (index - active + n) % n;
                const f = FAN[slot] ?? { tx: 30, ty: 34, r: 17, z: 0, op: 0, shadow: 'none' };
                const card = stackCards[index];
                const isOut = index === exiting;

                return (
                  <div
                    key={card.id}
                    style={{
                      position: 'absolute',
                      top: 0, left: 0,
                      width: '280px',
                      height: '300px',
                      background: '#fff',
                      borderRadius: '22px',
                      padding: '20px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '18px',
                      transformOrigin: 'center center',
                      transform: isOut
                        ? 'translate(-80px, -52px) rotate(-18deg)'
                        : `translate(${f.tx}px, ${f.ty}px) rotate(${f.r}deg)`,
                      zIndex: isOut ? 0 : f.z,
                      opacity: isOut ? 0 : f.op,
                      boxShadow: f.shadow,
                      border: '1px solid rgba(0,0,0,0.04)',
                      transition: isOut
                        ? 'transform 0.44s cubic-bezier(0.4,0,1,1), opacity 0.35s'
                        : 'transform 0.7s cubic-bezier(0.34,1.38,0.64,1), opacity 0.5s, box-shadow 0.5s',
                    }}
                  >
                    {/* Icon — stroke uses accent colour, bg is tinted */}
                    <div style={{
                      width: '58px', height: '58px',
                      borderRadius: '14px',
                      background: `${card.color}18`,
                      border: `2px solid ${card.color}44`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {React.cloneElement(card.icon as React.ReactElement<any>, {
                        width: 26,
                        height: 26,
                        stroke: card.color,
                        strokeWidth: 1.75,
                      })}
                    </div>

                    <EditableText
                      as="p"
                      contentKey={`studio.solving.cards.${index}.solutionDesc`}
                      value={card.solutionDesc}
                      style={{
                        fontSize: '0.84rem',
                        color: '#475569',
                        fontWeight: 500,
                        lineHeight: 1.7,
                        margin: 0,
                        textAlign: 'center',
                        maxWidth: '220px',
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function StudioPage() {
  const { content, loading, error } = useContent();
  const [activeStackIndex, setActiveStackIndex] = useState(0);
  
  const renderCellText = (text: string) => {
    if (!text) return null;
    const clean = text.trim();
    if (clean === '✓' || clean === 'check') {
      return <span className="check">✓</span>;
    } else if (clean === '✗' || clean === 'cross') {
      return <span className="cross">✗</span>;
    } else if (clean.toLowerCase() === 'sometimes' || clean.toLowerCase() === 'rarely' || clean.toLowerCase() === 'varies') {
      return <span className="partial">{text}</span>;
    }
    return <span>{text}</span>;
  };

  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [activeTimelineIndex, setActiveTimelineIndex] = useState<number | null>(null);
  const [heroCarouselIndex, setHeroCarouselIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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

  // Auto-progression for hero carousel
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setHeroCarouselIndex((prev) => (prev + 1) % 5);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused]);

  // Handler for manual clicks with 3-second pause
  const handleManualPhaseChange = (index: number) => {
    setHeroCarouselIndex(index);
    setIsPaused(true);
    setTimeout(() => {
      setIsPaused(false);
    }, 3000);
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#F3F5F9] font-manrope">Loading studio...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen bg-[#F3F5F9] font-manrope text-red-500">Error: {error}</div>;
  if (!content) return null;
  const studioContent = content.studio;

  const defaultPhases = [
    {
      stage: "01",
      title: "Finalize the Idea",
      description: "We pressure-test your concept, define the core problem, identify the target user, and align on a product vision that is ambitious but buildable.",
      duration: "2 weeks"
    },
    {
      stage: "02",
      title: "Operating Agreement",
      description: "We align on ownership, engagement terms, and mutual expectations before a single line of code is written.",
      duration: "1 week"
    },
    {
      stage: "03",
      title: "Requirements & Business Case",
      description: "Working sessions, user story mapping, PRFAQs, and a formal business case — so every build decision has a strategic rationale.",
      duration: "2 weeks"
    },
    {
      stage: "04",
      title: "Build the Product",
      description: "Senior in-house engineers build your MLP — no outsourcing, no juniors. Bi-weekly demos, continuous feedback, relentless quality.",
      duration: "12-18 weeks"
    },
    {
      stage: "05",
      title: "Go to Market",
      description: "Launch strategy, positioning, pitch materials, and early user acquisition support. You go to market ready — not just live.",
      duration: "2 weeks"
    }
  ];

  const timelinePhases = defaultPhases.map((defPhase, idx) => {
    const dbPhase = studioContent?.timeline?.phases?.[idx];
    return {
      stage: defPhase.stage,
      title: dbPhase?.title || defPhase.title,
      description: dbPhase?.description || defPhase.description,
      duration: dbPhase?.duration || defPhase.duration,
    };
  });

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
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');

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
        h1 {
          text-align: center !important;
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

        .section-container { max-width: 100%; margin: 0 auto; padding: clamp(24px, 3vw, 24px) 24px; }
        @media (max-width: 768px) { .section-container { padding: clamp(24px, 4vw, 24px) 24px; } }
        .pt-0 { padding-top: 0 !important; }
        .pb-0 { padding-bottom: 0 !important; }
        
        /* Typography */
        .hero-title { 
          font-family: 'Manrope', sans-serif !important;
          font-size: 52px !important; /* beautifully sized to feel elegant and full without being too large */
          font-weight: 800 !important;
          letter-spacing: -0.04em !important;
          line-height: 1.22 !important; /* increased line-height for elite aesthetic */
          color: var(--text-black) !important;
          text-align: center !important;
          width: 100%;
          margin: 0 auto 28px !important; /* increased spacing below heading */
          max-width: 960px !important; /* wider boundaries for magnificent scale */
        }
        .hero-title span {
          font-family: 'Manrope', sans-serif !important;
          font-weight: 800 !important;
        }
        @media(max-width: 768px) {
          .hero-title {
            font-size: 32px !important;
            line-height: 1.25 !important;
          }
        }
        .hero-title-text {
          text-align: center !important;
          display: block;
          width: 100%;
        }
        .text-blue { color: var(--primary-blue); }
        
        .section-title { 
          font-family: 'Manrope', sans-serif !important;
          font-size: 36px !important; 
          font-weight: 800 !important; 
          letter-spacing: -0.02em !important; 
          margin-bottom: 12px !important; 
          line-height: 1.25 !important; 
          text-align: center;
          color: var(--text-black) !important;
        }
        @media(max-width: 768px) {
          .section-title {
            font-size: 26px !important;
          }
        }
        .section-title-left { text-align: left; }
        .title-dark { color: var(--white) !important; }
        
        .section-eyebrow {
          display: inline-block;
          background-color: #E6EFFF !important;
          color: var(--primary-blue) !important;
          font-weight: 800 !important;
          letter-spacing: 0.15em !important;
          text-transform: uppercase !important;
          font-size: 0.75rem !important;
          padding: 6px 16px;
          border-radius: 100px;
          margin-bottom: 16px;
          font-family: 'Manrope', sans-serif !important;
        }
        
        .hero-eyebrow-pill {
          display: inline-block;
          background-color: #E6EFFF !important;
          color: var(--primary-blue) !important;
          padding: 8px 18px;
          border-radius: 100px;
          font-size: 0.8rem !important;
          font-weight: 800 !important;
          letter-spacing: 0.15em !important;
          margin-bottom: 32px;
          text-transform: uppercase !important;
          font-family: 'Manrope', sans-serif !important;
        }
        
        .section-subtitle, .hero-description {
          font-family: 'Inter', sans-serif !important;
          color: var(--text-muted) !important;
          font-size: clamp(0.9rem, 2vw, 0.95rem) !important;
          line-height: 1.65 !important;
          font-weight: 500 !important;
          max-width: 650px;
          margin: 0 auto 24px !important;
          text-align: center !important;
        }

        .body-text {
          font-family: 'Inter', sans-serif !important;
          font-size: clamp(0.9rem, 2vw, 0.95rem) !important;
          line-height: 1.65 !important;
          color: var(--text-muted) !important;
          font-weight: 500 !important;
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
        .btn-secondary {
          background-color: #004ac2;
          color: var(--primary-white);
          padding: 16px 40px;
          border-radius: 100px;
          font-weight: 700;
          font-size: 16px;
          border: 2px solid var(--primary-blue);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-block;
        }
        .btn-secondary:hover {
          background-color: var(--primary-blue);
          color: var(--white);
          transform: translateY(-2px);
        }

        /* Layout & Grids */

        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 5vw, 64px); align-items: center; }
        .grid-2-align-top { align-items: start; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }

        /* Sections */
        .section-white { background-color: var(--white); }
        .section-base { background-color: var(--bg-base); }
        .section-dark { background-color: var(--bg-dark); color: var(--white); }

        /* Unified Hero Section Style */
        .hero-section {
          padding: 220px 24px 160px !important; /* spacious padding to expand the section */
          text-align: center !important;
          background-color: #F1F5F9 !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          min-height: 480px !important; /* enlarged height to look grand and full-screen */
          width: 100% !important;
          position: relative !important;
        }
        @media(max-width: 768px) {
          .hero-section {
            padding: 90px 20px 40px !important;
            min-height: 380px !important;
          }
        }

        /* Hero Carousel Stepper */
        .hero-carousel-panel {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 24px;
          overflow: hidden;
          height: 100%;
          min-height: 480px;
          display: flex;
          flex-direction: column;
        }
        .hero-carousel-tabs {
          display: flex;
          border-bottom: 1px solid #E2E8F0;
          background: #FFFFFF;
          overflow-x: auto;
        }
        .hero-carousel-tab {
          flex: 1;
          padding: 14px 10px;
          border: none;
          background: none;
          font-family: 'Manrope', sans-serif;
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #94A3B8;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          transition: all 0.25s ease;
          white-space: nowrap;
        }
        .hero-carousel-tab.active {
          color: #005AE2;
          border-bottom-color: #005AE2;
          background: #F0F7FF;
        }
        .hero-carousel-body {
          flex: 1;
          padding: 28px 28px 20px;
          overflow-y: auto;
          animation: hcFadeIn 0.3s ease;
        }
        @keyframes hcFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hc-phase-label {
          font-size: 0.65rem;
          font-weight: 800;
          color: #005AE2;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .hc-phase-title {
          font-family: 'Manrope', sans-serif;
          font-size: 1.35rem;
          font-weight: 800;
          color: #0F172A;
          letter-spacing: -0.02em;
          margin-bottom: 20px;
          line-height: 1.2;
        }
        .hc-cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .hc-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 16px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .hc-card:hover {
          border-color: #005AE2;
          box-shadow: 0 4px 16px rgba(0,90,226,0.08);
        }
        .hc-card-title {
          font-family: 'Manrope', sans-serif;
          font-size: 0.8rem;
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 6px;
        }
        .hc-card-desc {
          font-size: 0.75rem;
          color: #64748B;
          line-height: 1.5;
        }
        /* Comparison table inside hero carousel */
        .hc-comparison-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.72rem;
        }
        .hc-comparison-table th {
          background: #DBEAFE;
          padding: 10px 12px;
          text-align: left;
          font-weight: 800;
          color: #0F172A;
          border-bottom: 1px solid #E2E8F0;
        }
        .hc-comparison-table td {
          padding: 10px 12px;
          border-bottom: 1px solid #F1F5F9;
          color: #64748B;
          line-height: 1.4;
        }
        .hc-comparison-table tr:last-child td { border-bottom: none; }
        .hc-comparison-table td:first-child { font-weight: 700; color: #0F172A; }
        .hc-comparison-table td:last-child  { color: #005AE2; font-weight: 700; }
        .hero-carousel-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 28px;
          border-top: 1px solid #E2E8F0;
          background: #FFFFFF;
        }
        .hc-nav-dots {
          display: flex;
          gap: 6px;
        }
        .hc-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #CBD5E1;
          cursor: pointer;
          transition: all 0.2s;
        }
        .hc-dot.active {
          background: #005AE2;
          width: 18px;
          border-radius: 4px;
        }
        .hc-nav-btn {
          background: none;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #64748B;
          font-size: 1rem;
          transition: all 0.2s;
        }
        .hc-nav-btn:hover { background: #F0F7FF; border-color: #005AE2; color: #005AE2; }
        .hc-nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        .hero-eyebrow-pill {
          display: inline-flex;
          background-color: #E6EFFF;
          color: #005AE2;
          font-weight: 800;
          font-size: 0.8rem;
          padding: 8px 18px;
          border-radius: 100px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 32px;
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
          padding: 20px; 
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

        .card-title { font-size: clamp(1.05rem, 2vw, 1.15rem) !important; font-weight: 800; margin-bottom: 8px !important; letter-spacing: -0.02em; color: var(--text-black); transition: color 0.3s;}
        .card:hover .card-title { color: var(--white); }
        
        .card-desc { font-size: 0.85rem !important; color: var(--text-muted); line-height: 1.45 !important; margin-bottom: 16px !important; font-weight: 500; flex-grow: 1; transition: color 0.3s;}
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
        .feature-box { background-color: var(--bg-dark); color: var(--white); padding: 20px; border-radius: 20px; margin-bottom: 16px; display: flex; align-items: flex-start; gap: 20px; border: 1px solid var(--border-dark); }
        .feature-box-icon { width: 40px; height: 40px; background-color: rgba(255,255,255,0.05); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--primary-blue); flex-shrink: 0;}
        .feature-box h4 { margin: 0 0 8px 0; font-size: 1.15rem; font-weight: 800; }
        .feature-box p { margin: 0; font-size: 0.95rem; color: #9CA3AF; line-height: 1.6; font-weight: 500;}
        .image-box-abstract { border-radius: 24px; overflow: hidden; height: 100%; min-height: 400px; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.15);}

        /* What We Look For */
        .look-card { background: #F1F3F5; border-radius: 32px; padding: 24px 24px; text-align: left; border: none; box-shadow: none; height: 100%; display: flex; flex-direction: column; justify-content: flex-start; transition: transform 0.3s ease; }
        .look-card:hover { transform: translateY(-8px); }
        .look-icon { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; color: #005AE2; margin-bottom: 40px; background: none; padding: 0; }
        .look-icon svg { width: 100%; height: 100%; }
        .look-title { font-size: 1.5rem; font-weight: 800; margin-bottom: 20px; color: var(--text-black); }
        .look-desc { font-size: 1rem; color: var(--text-muted); line-height: 1.6; font-weight: 500; }

        /* Premium Build Timeline Table Section */
        .timeline-table-section {
          padding: 80px 24px;
          background-color: #FFFFFF;
          position: relative;
        }

        .timeline-table-container {
          max-width: 1100px;
          margin: 40px auto 0;
          overflow: hidden;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
        }

        .timeline-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .timeline-table th {
          font-family: 'Manrope', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          color: #0F172A;
          padding: 18px 24px;
          border-bottom: 1px solid #E2E8F0;
          text-transform: capitalize;
        }

        .timeline-table th:not(:last-child) {
          border-right: 1px solid #E2E8F0;
        }

        .timeline-table td {
          padding: 24px 24px;
          font-size: 0.95rem;
          color: #334155;
          border-bottom: 1px solid #E2E8F0;
          vertical-align: top;
          line-height: 1.6;
        }

        .timeline-table tr:last-child td {
          border-bottom: 1px solid #E2E8F0;
        }

        .timeline-table td.stage-col {
          font-family: 'Manrope', sans-serif;
          font-weight: 500;
          color: #0F172A;
          font-size: 1rem;
          width: 80px;
          border-right: 1px solid #E2E8F0;
        }

        .timeline-table td.title-col {
          font-family: 'Manrope', sans-serif;
          font-weight: 700;
          color: #0F172A;
          font-size: 1.05rem;
          width: 220px;
          border-right: 1px solid #E2E8F0;
        }

        .timeline-table td.desc-col {
          color: #475569;
          font-weight: 400;
          border-right: 1px solid #E2E8F0;
        }

        .timeline-table td.duration-col {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          color: #0F172A;
          white-space: nowrap;
          width: 140px;
        }

        .timeline-table tr {
          transition: background-color 0.2s ease;
        }

        .timeline-table tr:hover td {
          background-color: #F8FAFC;
        }

        /* ── NEW STYLES: Selection Steps & Premium Values ── */
        .selection-step-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          padding: 32px 24px;
          position: relative;
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 280px;
        }
        .selection-step-card:hover {
          transform: translateY(-6px);
          border-color: #005AE2 !important;
          box-shadow: 0 20px 40px -10px rgba(0,90,226,0.1) !important;
        }
        
        .value-premium-card {
          background: #F8FAFC !important;
          border: 1px solid #E2E8F0 !important;
          border-radius: 20px;
          padding: 24px 24px;
          transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1) !important;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          min-height: 230px;
          z-index: 1;
        }
        .value-premium-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: var(--card-glow);
          opacity: 0.7;
          transition: height 0.3s ease, opacity 0.3s ease;
        }
        .value-premium-card:hover {
          transform: translateY(-6px);
          background: #FFFFFF !important;
          border-color: var(--card-glow) !important;
          box-shadow: 0 15px 30px -5px var(--card-glow-shadow), 0 0 0 1px rgba(0, 0, 0, 0.02) !important;
        }
        .value-premium-card:hover::after {
          height: 5px;
          opacity: 1;
        }
        .value-card-bg-num {
          position: absolute;
          top: 15px;
          right: 20px;
          font-size: 2.25rem;
          font-weight: 800;
          font-family: 'Manrope', sans-serif;
          color: rgba(0, 0, 0, 0.035);
          line-height: 1;
          pointer-events: none;
          user-select: none;
          transition: all 0.35s ease;
        }
        .value-premium-card:hover .value-card-bg-num {
          color: var(--card-glow);
          opacity: 0.15;
          transform: scale(1.08);
        }

        @media (max-width: 768px) {
          .timeline-table-section {
            padding: 48px 16px;
          }
          
          .timeline-table, .timeline-table thead, .timeline-table tbody, .timeline-table th, .timeline-table td, .timeline-table tr {
            display: block;
            width: 100%;
          }

          .timeline-table thead {
            display: none;
          }

          .timeline-table tr {
            border: 1px solid #E2E8F0;
            border-radius: 12px;
            margin-bottom: 16px;
            padding: 16px;
            background: #FFFFFF;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.01);
          }

          .timeline-table td {
            padding: 6px 0;
            border: none !important;
            width: 100% !important;
          }

          .timeline-table td.stage-col {
            font-size: 0.8rem;
            color: #64748B;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 700;
          }

          .timeline-table td.title-col {
            font-size: 1.1rem;
            padding-bottom: 8px;
            border-bottom: 1px solid #F1F5F9 !important;
            margin-bottom: 8px;
          }

          .timeline-table td.desc-col {
            font-size: 0.9rem;
            color: #475569;
            padding-bottom: 12px;
          }

          .timeline-table td.duration-col {
            border-top: 1px solid #F1F5F9 !important;
            padding-top: 10px;
            font-size: 0.85rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .timeline-table td.duration-col::before {
            content: 'DURATION';
            font-weight: 700;
            color: #64748B;
            font-size: 0.75rem;
            letter-spacing: 0.05em;
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
        
        /* Mobile padding overrides */
        @media (max-width: 768px) {
          [data-mobile-padding="40px 24px"] { padding: 40px 24px !important; }
          [data-mobile-padding="100px 24px"] { padding: 100px 24px !important; }
        }

        /* Phase Section - Selection Process */
        .phase-section-wrap {
          position: relative;
          background: #F0EEE9;
          overflow: hidden;
        }
        .phase-mesh {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background:
            radial-gradient(ellipse 80% 60% at 20% 20%, rgba(191,219,254,0.45) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 80%, rgba(221,214,254,0.35) 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 60% 10%, rgba(254,215,170,0.3)  0%, transparent 50%);
        }
        .phase-watermark {
          font-family: 'Playfair Display', serif;
          font-size: clamp(6rem, 16vw, 10rem);
          font-weight: 900;
          line-height: 0.85;
          position: absolute;
          top: -10px;
          left: -8px;
          pointer-events: none;
          user-select: none;
          letter-spacing: -0.04em;
          transition: opacity 0.5s ease, color 0.5s ease;
          opacity: 0.08;
        }
        .phase-pill {
          padding: 9px 20px;
          border-radius: 100px;
          font-family: 'Manrope', sans-serif;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          border: 1.5px solid rgba(0,0,0,0.1);
          background: rgba(255,255,255,0.5);
          color: #888;
          transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .phase-pill:hover {
          background: rgba(255,255,255,0.8);
          color: #333;
          border-color: rgba(0,0,0,0.15);
        }
        .phase-pill.active {
          background: #fff;
          border-color: var(--pill-ac);
          box-shadow: 0 2px 20px rgba(0,0,0,0.08);
          color: var(--pill-ac-dark);
        }
        .phase-pill.active .pill-num {
          color: var(--pill-ac);
        }
        .gcard {
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.85);
          border-radius: 18px;
          padding: 24px 22px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9);
          transition: all 0.35s ease;
          animation: gcardIn 0.5s cubic-bezier(0.34,1.15,0.64,1) both;
        }
        .gcard:hover {
          background: rgba(255,255,255,0.75);
          transform: translateY(-3px) scale(1.01);
          box-shadow: 0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9);
        }
        .gcard-green {
          border-left: 3px solid #10B981 !important;
          background: rgba(236,253,245,0.6) !important;
        }
        .gcard-amber {
          border-left: 3px solid #F59E0B !important;
          background: rgba(255,251,235,0.6) !important;
        }
        .gcard-red {
          border-left: 3px solid #EF4444 !important;
          background: rgba(254,242,242,0.6) !important;
        }

        .section-header {
          max-width: 1200px;
          margin: 0 auto 2rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 1rem;
        }

        .section-header h2 {
          font-size: clamp(2rem, 3.5vw, 3rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.1;
          max-width: 520px;
        }

        .section-header p {
          color: var(--text-muted);
          font-size: 0.975rem;
          max-width: 340px;
          line-height: 1.7;
        }

        .section-header .label {
          color: #64748B;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        @keyframes gcardIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: none; }
        }
        .phase-tag-anim {
          animation: fadeUp 0.4s ease both;
        }
        .phase-title-anim {
          animation: fadeUp 0.45s ease 0.06s both;
        }
        .phase-desc-anim {
          animation: fadeUp 0.4s ease 0.12s both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: none; }
        }
        .counter-bar {
          flex: 1;
          height: 2px;
          background: rgba(0,0,0,0.08);
          border-radius: 1px;
          overflow: hidden;
          max-width: 120px;
        }
        .counter-fill {
          height: 100%;
          border-radius: 1px;
          transition: width 0.7s cubic-bezier(0.4,0,0.2,1);
        }

        /* ── DIFFERENTIATION ──────────────────────────────── */
        #diff {
          padding: 24px 24px;
        }

        .diff-header {
          max-width: 1200px;
          margin: 0 auto 5rem;
          text-align: center;
        }

        .diff-header .label {
          color: #005AE2;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-size: 0.75rem;
          display: block;
          margin-bottom: 16px;
        }

        .diff-header h2 {
          font-size: clamp(2rem, 3.5vw, 3rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.1;
          max-width: 680px;
          margin: 0 auto 1rem;
          color: #0F172A;
        }

        .diff-header p {
          color: #64748B;
          font-size: 0.975rem;
          max-width: 480px;
          margin: 0 auto;
          line-height: 1.7;
        }

        .diff-table-wrap {
          max-width: 1200px;
          margin: 0 auto 4rem;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          overflow: hidden;
        }

        .diff-table {
          width: 100%;
          border-collapse: collapse;
        }

        .diff-table th {
          font-family: 'Manrope', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 1.25rem 2rem;
          text-align: left;
          border-bottom: 1px solid #E2E8F0;
          color: #64748B;
        }

        .diff-table th.highlight {
          background: #F0F7FF;
          color: #005AE2;
          border-bottom-color: #BFDBFE;
        }

        .diff-table td {
          padding: 1.25rem 2rem;
          font-size: 0.9rem;
          border-bottom: 1px solid #E2E8F0;
          color: #64748B;
          vertical-align: middle;
        }

        .diff-table tr:last-child td { border-bottom: none; }

        .diff-table td.feature {
          color: #0F172A;
          font-weight: 500;
          font-size: 0.925rem;
        }

        .diff-table td.highlight {
          background: #F0F7FF;
          color: #005AE2;
          font-weight: 600;
        }

        .diff-table tr:hover td { background: #F8FAFC; }
        .diff-table tr:hover td.highlight { background: #E0F2FE; }

        .check { color: #22c55e; font-size: 1rem; }
        .cross { color: rgba(0,0,0,0.25); font-size: 1rem; }
        .partial { color: #f59e0b; font-size: 0.8rem; font-style: italic; }

        @media (max-width: 768px) {
          #diff { padding: 24px 20px; }
          .diff-header { margin-bottom: 3rem; }
          .diff-table-wrap { overflow-x: auto; }
          .diff-table th, .diff-table td { padding: 1rem; font-size: 0.8rem; }
        }

      `}} />

      <Header />
      <div className="studio-page" style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#F8FAFC' }}>

        {/* Ambient glow orbs */}

        {/* Hero Section */}
        <section className="section-white hero-section" style={{ position: 'relative', overflow: 'hidden', minHeight: '700px' }}>
          {/* Top Light Effect */}
          <div style={{ position: 'absolute', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.25), transparent 70%)', top: '-200px', left: '50%', transform: 'translateX(-50%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }}></div>
          <div className="section-container pt-0 pb-0" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ textAlign: 'center', width: '100%' }}>
                <EditableText
                  contentKey="studio.hero.eyebrow"
                  value={studioContent.hero.eyebrow}
                  className="hero-eyebrow-pill"
                />
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <EditableText
                    as="h1"
                    contentKey="studio.hero.title"
                    value={studioContent.hero.title || "Build Ventures, Not Just\nProducts"}
                    className="hero-title"
                    style={{ textAlign: 'center', margin: '0 auto', display: 'inline-block' }}
                  >
                    {(() => {
                      const titleText = studioContent.hero.title || "Build Ventures, Not Just\nProducts";
                      const lines = titleText.split('\n');
                      return lines.map((line, lineIdx) => {
                        const words = line.split(' ');
                        return (
                          <React.Fragment key={lineIdx}>
                            {words.map((word: string, index: number) => {
                              const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").toUpperCase();
                              const isBlue = ['VENTURES', 'PRODUCTS', 'VENTURE', 'PRODUCT', 'LAST'].includes(cleanWord);
                              return (
                                <span key={index} style={isBlue ? { color: '#005AE2' } : {}}>
                                  {word}{index < words.length - 1 ? ' ' : ''}
                                </span>
                              );
                            })}
                            {lineIdx < lines.length - 1 && <br />}
                          </React.Fragment>
                        );
                      });
                    })()}
                  </EditableText>
                </div>
                <EditableText
                  as="p"
                  contentKey="studio.hero.subheading"
                  value={studioContent.hero.subheading}
                  className="body-text"
                  style={{ marginBottom: '40px', maxWidth: '720px', margin: '0 auto 40px', textAlign: 'center', lineHeight: '1.8', fontSize: 'clamp(1rem, 2vw, 1.125rem)' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center' }} className="cc-reveal">
                  <Link href="/contact">
                    <button className="btn-primary">
                      <EditableText
                        contentKey="studio.hero.buttonText"
                        value={studioContent.hero.buttonText || "Schedule A Call"}
                      />
                    </button>
                  </Link>
                </div>
              </div>
          </div>
        </section>

        {/* Vision & Mission Section */}
        <section id="vision" style={{ padding: '24px 24px', backgroundColor: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
          {/* Grid Background */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(0, 90, 226, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 90, 226, 0.03) 1px, transparent 1px)', backgroundSize: '50px 50px', opacity: 0.5 }}></div>
          
          {/* Light Effects */}
          <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.1) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }}></div>
          <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }}></div>
          
          <div className="vm-intro" style={{ maxWidth: '1200px', margin: '0 auto 3rem', position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <div className="hero-eyebrow-pill">Who We Are</div>
            <h2 className="section-title" style={{ color: '#0F172A', maxWidth: '800px', margin: '0 auto' }}>
              <EditableText contentKey="studio.vision.title" value="Not an agency. Not an accelerator. A venture partner." />
            </h2>
            <p className="section-subtitle" style={{ marginTop: '1rem', maxWidth: '700px', margin: '1rem auto 0' }}>
              <EditableText contentKey="studio.vision.keyMessage" value="We build world-class digital products by combining elite engineering with strategic partnership — turning bold ideas into scalable ventures." />
            </p>
          </div>

          <div className="vm-inner" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'stretch', position: 'relative', zIndex: 1 }}>
            <div className="vm-card" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '20px', padding: '2rem', position: 'relative', overflow: 'hidden', transition: 'border-color 0.3s', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #005AE2 0%, transparent 100%)' }}></div>
              <span className="vm-tag" style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#005AE2', marginBottom: '1rem', display: 'block', fontFamily: "'Manrope', sans-serif" }}>
                <EditableText contentKey="studio.vision.visionTag" value="Our Vision" />
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '0.75rem', fontFamily: "'Manrope', sans-serif" }}>
                <EditableText contentKey="studio.vision.visionTitle" value="To be the most trusted venture partner for founders and operators who refuse to build alone." />
              </h3>
              <p style={{ marginTop: '0.75rem', color: '#64748B', fontSize: '0.9rem', lineHeight: 1.65, fontFamily: "'Inter', sans-serif", flex: 1, fontWeight: 500 }}>
                <EditableText contentKey="studio.vision.visionDesc" value="We envision a world where great ideas — regardless of technical background or startup experience — get the strategic and engineering firepower they deserve. CrestCode exists to level the playing field." />
              </p>
            </div>

            <div className="vm-card" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '20px', padding: '2rem', position: 'relative', overflow: 'hidden', transition: 'border-color 0.3s', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #005AE2 0%, transparent 100%)' }}></div>
              <span className="vm-tag" style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#005AE2', marginBottom: '1rem', display: 'block', fontFamily: "'Manrope', sans-serif" }}>
                <EditableText contentKey="studio.vision.missionTag" value="Our Mission" />
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '0.75rem', fontFamily: "'Manrope', sans-serif" }}>
                <EditableText contentKey="studio.vision.missionTitle" value="To turn bold ideas and real-world problems into world-class digital products." />
              </h3>
              <p style={{ marginTop: '0.75rem', color: '#64748B', fontSize: '0.9rem', lineHeight: 1.65, fontFamily: "'Inter', sans-serif", flex: 1, fontWeight: 500 }}>
                <EditableText contentKey="studio.vision.missionDesc" value="We partner with visionary founders and business owners through strategy, elite engineering, and relentless execution — building ventures that are built to last, not just launched." />
              </p>
            </div>
          </div>
        </section>

      {/* Core Values Section - Premium Light Mode Grid with 6 Cards */}
      <section style={{ backgroundColor: '#EFF6FF', padding: '24px 24px', fontFamily: 'Manrope, sans-serif', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle glowing radial background lights */}
        <div style={{ position: 'absolute', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.04), transparent 70%)', top: '-100px', left: '-100px', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.03), transparent 70%)', bottom: '-100px', right: '-100px', pointerEvents: 'none' }}></div>

        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <EditableText
              contentKey="studio.values.eyebrow"
              value={studioContent.values?.eyebrow || "Our Ethos & Beliefs"}
              className="hero-eyebrow-pill"
            />
            <EditableText
              as="h2"
              contentKey="studio.values.title"
              value={studioContent.values?.title || "Core Values That Guide Everything We Build"}
              className="section-title"
              style={{ margin: '0 auto 16px', color: '#0F172A', maxWidth: '800px' }}
            />
            <EditableText
              as="p"
              contentKey="studio.values.subtitle"
              value={studioContent.values?.subtitle || "We aren't here to build commodities. We partner with founders to construct enduring, high-performance tech enterprises."}
              className="section-subtitle"
              style={{ maxWidth: '600px', margin: '0 auto' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            {(() => {
              const defaultValues = [
                {
                  num: '01',
                  title: 'Ownership',
                  subheading: 'FOUNDER MINDSET',
                  desc: "We treat every product as if it's our own.",
                  icon: (
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                  color: '#3B82F6', // Blue
                  shadow: 'rgba(59, 130, 246, 0.08)'
                },
                {
                  num: '02',
                  title: 'Honesty',
                  subheading: 'FEARLESS TRANSPARENCY',
                  desc: "We challenge clients when we need to, even when it's uncomfortable.",
                  icon: (
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  ),
                  color: '#EC4899', // Pink
                  shadow: 'rgba(236, 72, 153, 0.08)'
                },
                {
                  num: '03',
                  title: 'End-customer obsession',
                  subheading: 'USER-FIRST PARADIGM',
                  desc: "Success is measured by the people who use the product, not just the people who commissioned it.",
                  icon: (
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  color: '#10B981', // Green
                  shadow: 'rgba(16, 185, 129, 0.08)'
                },
                {
                  num: '04',
                  title: 'Craft',
                  subheading: 'MLP QUALITY STANDARD',
                  desc: "We build to MLP standard because good enough never is.",
                  icon: (
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.242.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.17 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.883c-.77-.568-.371-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  ),
                  color: '#F59E0B', // Amber
                  shadow: 'rgba(245, 158, 11, 0.08)'
                },
                {
                  num: '05',
                  title: 'Partnership',
                  subheading: 'LONG-TERM ENGAGEMENT',
                  desc: "We are in it for the long run, not just the launch.",
                  icon: (
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  ),
                  color: '#005AE2', // Blue
                  shadow: 'rgba(0, 90, 226, 0.08)'
                },
                {
                  num: '06',
                  title: 'Innovation',
                  subheading: 'AI-DRIVEN PRODUCT THINKING',
                  desc: "We bring the latest thinking in product, engineering, and AI to every engagement.",
                  icon: (
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                  color: '#06B6D4', // Cyan
                  shadow: 'rgba(6, 182, 212, 0.08)'
                }
              ];

              const valuesItems = (studioContent.values?.items || []).length > 0
                ? studioContent.values.items.map((item: any, idx: number) => ({
                    ...defaultValues[idx],
                    ...item
                  }))
                : defaultValues;

              return valuesItems.map((val: any, index: number) => (
                <div
                  key={index}
                  className="value-premium-card"
                  style={{
                    '--card-glow': val.color,
                    '--card-glow-shadow': val.shadow
                  } as React.CSSProperties}
                >
                  {/* Top subheading tag */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    color: val.color,
                    textTransform: 'uppercase',
                    marginBottom: '16px'
                  }}>
                    <EditableText
                      contentKey={`studio.values.items.${index}.subheading`}
                      value={val.subheading}
                    />
                  </div>

                  {/* Colored Icon Container */}
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '14px',
                    background: `${val.color}10`,
                    border: `1.5px solid ${val.color}25`,
                    color: val.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}>
                    {val.icon}
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: '#0F172A',
                    marginBottom: '8px',
                    letterSpacing: '-0.01em',
                    textTransform: 'capitalize'
                  }}>
                    <EditableText
                      contentKey={`studio.values.items.${index}.title`}
                      value={val.title}
                    />
                  </h3>

                  {/* Description */}
                  <p style={{
                    color: '#64748B',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    margin: 0,
                    fontWeight: 500,
                    position: 'relative',
                    zIndex: 1
                  }}>
                    <EditableText
                      contentKey={`studio.values.items.${index}.desc`}
                      value={val.desc}
                    />
                  </p>
                </div>
              ));
            })()}
          </div>
        </div>
      </section>

        {/* Selection Process Heading & Description Section */}
        <section style={{ padding: '24px 24px 16px', backgroundColor: '#FFFFFF', position: 'relative' }}>
          <div className="section-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <EditableText
                contentKey="studio.selectiveness.eyebrow"
                value={studioContent.selectiveness?.eyebrow || "Selection Process"}
                className="hero-eyebrow-pill"
              />
              <EditableText
                as="h2"
                contentKey="studio.selectiveness.title"
                value={studioContent.selectiveness?.title || "We are selective\nfor a reason."}
                className="section-title"
                style={{
                  color: '#0F172A',
                  maxWidth: '800px',
                  margin: '0 auto 16px',
                  whiteSpace: 'pre-line'
                }}
              />
              <EditableText
                as="p"
                contentKey="studio.selectiveness.subtitle"
                value={studioContent.selectiveness?.subtitle || "We partner with a small number of founders and business owners each year. Every engagement gets our full attention — which means we choose carefully."}
                className="section-subtitle"
                style={{
                  maxWidth: '640px',
                  margin: '0 auto'
                }}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.2fr', gap: '3rem', marginTop: '2rem', alignItems: 'start' }}>
              {/* Left Column */}
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#005AE2', display: 'block', marginBottom: '0.75rem', fontFamily: "'Manrope', sans-serif" }}>
                  <EditableText
                    contentKey="studio.selectiveness.thesisLabel"
                    value={studioContent.selectiveness?.thesisLabel || "LET'S START FROM HERE"}
                  />
                </span>
                <h3 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.65rem)', fontWeight: 800, color: '#0F172A', lineHeight: 1.25, letterSpacing: '-0.02em', textTransform: 'uppercase', fontFamily: "'Manrope', sans-serif" }}>
                  <EditableText
                    contentKey="studio.selectiveness.thesisTitle"
                    value={studioContent.selectiveness?.thesisTitle || "INVESTMENT THESIS: THE PROCESS OF CREATING A STARTUP WITHIN VENTURE BUILDER CRESTCODE"}
                  />
                </h3>
              </div>
              
              {/* Right Column */}
              <div>
                <p style={{ fontSize: '0.95rem', color: '#64748B', lineHeight: 1.65, fontFamily: "'Inter', sans-serif", margin: 0, fontWeight: 500 }}>
                  <EditableText
                    contentKey="studio.selectiveness.thesisDesc"
                    value={studioContent.selectiveness?.thesisDesc || "Crestcode Startup Studio's startups aim to shift the paradigm of analog services, customer experience, and process management. Micro and small businesses that are still under-digitalized are the primary targets of this transformation. The solutions we will build together will put customers at the center, enabling them to access the services of artisans and professionals with a simple click, enabling them to continue to succeed in a rapidly evolving digital landscape. We create plug-and-play platforms that streamline processes, improve customer experience, and create cross-functional tools for digital transformation. The goal is to reduce inefficiencies and enable professionals to attract, manage, and retain clients, allowing them to focus exclusively on their specific profession."}
                  />
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* SECTION A: Selection Process — 5 Phase Tabs + Cards   */}
        {/* Editorial + Glassmorphism Design                       */}
        {/* ═══════════════════════════════════════════════════════ */}

        {/* ── ADD THIS <style> BLOCK once inside your page/component's global CSS or a <style> tag ── */}
        {/*
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');

.phase-section-wrap {
  position: relative;
  background: #F0EEE9;
  overflow: hidden;
}
.phase-mesh {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(ellipse 80% 60% at 20% 20%, rgba(79,70,229,0.15) 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 80% 80%, rgba(0,90,226,0.12) 0%, transparent 55%),
    radial-gradient(ellipse 50% 40% at 60% 10%, rgba(139,92,246,0.1)  0%, transparent 50%);
}
.phase-watermark {
  font-family: 'Playfair Display', serif;
  font-size: clamp(6rem, 16vw, 10rem);
  font-weight: 900;
  line-height: 0.85;
  position: absolute;
  top: -10px;
  left: -8px;
  pointer-events: none;
  user-select: none;
  letter-spacing: -0.04em;
  transition: opacity 0.5s ease, color 0.5s ease;
  opacity: 0.08;
}
.phase-pill {
  padding: 9px 20px;
  border-radius: 100px;
  font-family: 'Manrope', sans-serif;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
  border: 1.5px solid rgba(0,0,0,0.1);
  background: rgba(255,255,255,0.5);
  color: #888;
  transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.phase-pill:hover {
  background: rgba(255,255,255,0.8);
  color: #333;
  border-color: rgba(0,0,0,0.15);
}
.phase-pill.active {
  background: #fff;
  border-color: var(--pill-ac);
  box-shadow: 0 2px 20px rgba(0,0,0,0.08);
  color: var(--pill-ac-dark);
}
.phase-pill.active .pill-num {
  color: var(--pill-ac);
}
.gcard {
  background: rgba(255,255,255,0.55);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.85);
  border-radius: 18px;
  padding: 24px 22px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9);
  transition: all 0.35s ease;
  animation: gcardIn 0.5s cubic-bezier(0.34,1.15,0.64,1) both;
}
.gcard:hover {
  background: rgba(255,255,255,0.75);
  transform: translateY(-3px) scale(1.01);
  box-shadow: 0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9);
}
.gcard-green {
  border-left: 3px solid #10B981 !important;
  background: rgba(236,253,245,0.6) !important;
}
.gcard-amber {
  border-left: 3px solid #F59E0B !important;
  background: rgba(255,251,235,0.6) !important;
}
.gcard-red {
  border-left: 3px solid #EF4444 !important;
  background: rgba(254,242,242,0.6) !important;
}
@keyframes gcardIn {
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to   { opacity: 1; transform: none; }
}
.phase-tag-anim {
  animation: fadeUp 0.4s ease both;
}
.phase-title-anim {
  animation: fadeUp 0.45s ease 0.06s both;
}
.phase-desc-anim {
  animation: fadeUp 0.4s ease 0.12s both;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: none; }
}
        */}`

        {content?.ourModel && (() => {
          const phaseColors = ['#005AE2', '#005AE2', '#005AE2', '#005AE2', '#005AE2'];
          const phaseDarkColors = ['#0047B3', '#0047B3', '#0047B3', '#0047B3', '#0047B3'];
          const defaultPhaseLabels = [
            content.ourModel.selection?.label || 'Phase 01 — Selection Framework',
            content.ourModel.validation?.label || 'Phase 02 — Validation Framework',
            'Phase 03 — Build Framework',
            'Phase 04 — Launch Framework',
            'Phase 05 — Scale Framework',
          ];
          const defaultPhaseTitles = [
            content.ourModel.selection?.title || 'Selection Process',
            content.ourModel.validation?.title || 'Validation Process',
            content.ourModel.phases?.items?.[0]?.title || '12-Week Sprint Build',
            content.ourModel.phases?.items?.[1]?.title || 'Go-To-Market Activation',
            content.ourModel.phases?.items?.[2]?.title || 'Scaling for Growth',
          ];
          const defaultPhaseDescs = [
            'We run every venture idea through a rigorous four-lens framework before committing a single resource. Ideas are plentiful — the right ones are rare.',
            'No assumptions, no guesses. Every thesis is pressure-tested with real customers before a line of production code is written.',
            'Small autonomous pods. Radical focus. Ship, learn, iterate — nothing else matters in these 84 days.',
            'We launch with precision, not noise. Founder-led, community-first, metrics-gated. Growth is earned before it is amplified.',
            'We scale what is proven. Hiring behind revenue, diversifying channels, hardening infrastructure — in that exact order.',
          ];

          const phaseLabels = defaultPhaseLabels.map((val, idx) => studioContent.phases?.items?.[idx]?.label || val);
          const phaseTitles = defaultPhaseTitles.map((val, idx) => studioContent.phases?.items?.[idx]?.title || val);
          const phaseDescs = defaultPhaseDescs.map((val, idx) => studioContent.phases?.items?.[idx]?.description || val);

          const ac = phaseColors[heroCarouselIndex] || '#3B82F6';
          const acDark = phaseDarkColors[heroCarouselIndex] || '#1d4ed8';
          const ph = [2, 3, 4].includes(heroCarouselIndex) ? content.ourModel.phases?.items?.[heroCarouselIndex - 2] : null;
          const colors = ['#10B981', '#F59E0B', '#EF4444'];
          const vKey = [2, 3, 4].includes(heroCarouselIndex) ? ['v1', 'v2', 'v3'][heroCarouselIndex - 2] : '';

          return (
            <section
              style={{
                position: 'relative',
                backgroundColor: '#EFF6FF',
                padding: '80px 0 80px',
                overflow: 'hidden'
              }}
            >

              {/* Light effect from center */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '800px',
                height: '800px',
                background: 'radial-gradient(circle, rgba(0, 90, 226, 0.08) 0%, transparent 70%)',
                pointerEvents: 'none',
                zIndex: 0,
              }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Unified Header */}
                <div className="section-container" style={{ textAlign: 'center', marginBottom: '40px', paddingTop: 0, paddingBottom: 0 }}>
                  <div style={{ display: 'inline-block' }}>
                    <EditableText
                      contentKey="studio.phases.eyebrow"
                      value={studioContent.phases?.eyebrow || "Selection Process"}
                      className="hero-eyebrow-pill"
                    />
                  </div>
                  <EditableText
                    as="h2"
                    contentKey="studio.phases.title"
                    value={studioContent.phases?.title || "Five Phases. One Mission."}
                    className="section-title"
                    style={{
                      color: '#0F172A',
                      maxWidth: '800px',
                      margin: '0 auto 16px',
                    }}
                  />
                  <EditableText
                    as="p"
                    contentKey="studio.phases.subtitle"
                    value={studioContent.phases?.subtitle || "Our structured blueprint for transforming bold concepts into venture-scale realities."}
                    className="section-subtitle"
                    style={{
                      maxWidth: '640px',
                      margin: '0 auto',
                      color: '#64748B'
                    }}
                  />
                </div>

                {/* ── STICKY PILL NAV ── */}
                <div style={{
                  position: 'sticky', top: 0, zIndex: 100,
                  background: 'rgba(239, 246, 255, 0.85)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  borderBottom: '1px solid rgba(0, 90, 226, 0.05)',
                  marginBottom: '32px',
                }}>
                  <div className="section-container" style={{ paddingTop: 0, paddingBottom: 0 }}>
                    <div style={{
                      display: 'flex', justifyContent: 'center',
                      padding: '20px 0', maxWidth: '800px',
                      margin: '0 auto', alignItems: 'center',
                    }}>
                      {[
                        { n: '01', t: studioContent.phases?.tabs?.[0]?.title || 'SELECT', id: 0 },
                        { n: '02', t: studioContent.phases?.tabs?.[1]?.title || 'VALIDATE', id: 1 },
                        { n: '03', t: studioContent.phases?.tabs?.[2]?.title || 'BUILD', id: 2 },
                        { n: '04', t: studioContent.phases?.tabs?.[3]?.title || 'LAUNCH', id: 3 },
                        { n: '05', t: studioContent.phases?.tabs?.[4]?.title || 'SCALE', id: 4 },
                      ].map((ph, idx) => (
                        <React.Fragment key={ph.id}>
                          <button
                            onClick={() => handleManualPhaseChange(ph.id)}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '8px',
                              cursor: 'pointer',
                              background: 'transparent',
                              border: 'none',
                              padding: 0,
                              minWidth: '80px',
                            }}
                          >
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '14px',
                              fontWeight: 700,
                              fontFamily: "'Manrope', sans-serif",
                              background: heroCarouselIndex === ph.id ? '#005AE2' : 
                                        heroCarouselIndex > ph.id ? '#005AE2' : '#ffffff',
                              color: heroCarouselIndex === ph.id ? '#ffffff' : 
                                     heroCarouselIndex > ph.id ? '#ffffff' : '#64748B',
                              border: heroCarouselIndex === ph.id ? '3px solid #005AE2' : 
                                     heroCarouselIndex > ph.id ? '3px solid #005AE2' : '2px solid #E2E8F0',
                              transition: 'all 0.3s ease',
                              boxShadow: heroCarouselIndex === ph.id ? '0 4px 12px rgba(0, 90, 226, 0.3)' : 'none',
                            }}>
                              {heroCarouselIndex > ph.id ? '✓' : ph.n}
                            </div>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              fontFamily: "'Manrope', sans-serif",
                              letterSpacing: '0.05em',
                              textTransform: 'uppercase',
                              color: heroCarouselIndex === ph.id ? '#005AE2' : 
                                     heroCarouselIndex > ph.id ? '#005AE2' : '#64748B',
                              transition: 'all 0.3s ease',
                            }}>
                              <EditableText
                                contentKey={`studio.phases.tabs.${idx}.title`}
                                value={ph.t}
                              />
                            </span>
                          </button>
                          {idx < 4 && (
                            <div style={{
                              flex: 1,
                              height: '2px',
                              background: heroCarouselIndex > idx ? '#005AE2' : '#E2E8F0',
                              margin: '0 8px',
                              transition: 'all 0.3s ease',
                              maxWidth: '60px',
                            }} />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── MAIN CONTENT (GRID) ── */}
                <div className="section-container" style={{ background: 'transparent' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1.15fr',
                    gap: '40px',
                    alignItems: 'start',
                    maxWidth: '960px',
                    margin: '0 auto',
                  }}>

                    {/* ── LEFT: Editorial ── */}
                    <div style={{ position: 'relative', paddingTop: '8px', textAlign: 'left' }}>

                      {/* Giant watermark number */}
                      <div
                        className="phase-watermark"
                        style={{ color: 'rgba(0, 90, 226, 0.08)', left: '0', top: '-20px' }}
                      >
                        {String(heroCarouselIndex + 1).padStart(2, '0')}
                      </div>

                      {/* Tag */}
                      <div
                        key={`tag-${heroCarouselIndex}`}
                        className="phase-tag-anim"
                        style={{
                          fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em',
                          textTransform: 'uppercase', color: '#005AE2', marginBottom: '12px',
                        }}
                      >
                        <EditableText
                          contentKey={`studio.phases.items.${heroCarouselIndex}.label`}
                          value={phaseLabels[heroCarouselIndex]}
                        />
                      </div>

                      {/* Main title */}
                      <h2
                        key={`title-${heroCarouselIndex}`}
                        className="phase-title-anim"
                        style={{
                          fontFamily: "'Manrope', sans-serif",
                          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                          fontWeight: 700,
                          letterSpacing: '-0.01em',
                          color: '#0F172A',
                          lineHeight: 1.2,
                          marginBottom: '16px',
                        }}
                      >
                        <EditableText
                          contentKey={`studio.phases.items.${heroCarouselIndex}.title`}
                          value={phaseTitles[heroCarouselIndex]}
                        />
                      </h2>

                      {/* Description with left border */}
                      <p
                        key={`desc-${heroCarouselIndex}`}
                        className="phase-desc-anim"
                        style={{
                          fontSize: '0.95rem',
                          color: '#64748B',
                          lineHeight: 1.6,
                          borderLeft: `3px solid #005AE2`,
                          paddingLeft: '16px',
                          marginBottom: '24px',
                        }}
                      >
                        <EditableText
                          contentKey={`studio.phases.items.${heroCarouselIndex}.description`}
                          value={phaseDescs[heroCarouselIndex]}
                        />
                      </p>

                      {/* Progress counter */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="counter-bar">
                          <div
                            className="counter-fill"
                            style={{
                              width: `${((heroCarouselIndex + 1) / 5) * 100}%`,
                              background: '#005AE2',
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', letterSpacing: '0.05em' }}>
                          {heroCarouselIndex + 1} / 5
                        </span>
                      </div>
                    </div>

                    {/* ── RIGHT: Cards ── */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', minHeight: '400px' }}>

                      {/* Phase 0 — Select */}
                      {heroCarouselIndex === 0 && content.ourModel.selection?.cards?.map((card: any, idx: number) => (
                        <div
                          key={idx}
                          style={{
                            background: '#F8FAFC',
                            border: '1px solid #E2E8F0',
                            borderRadius: '12px',
                            padding: '20px 18px',
                            transition: 'all 0.2s ease',
                            animationDelay: `${idx % 2 === 0 ? idx * 0.09 : 0.05 + idx * 0.09}s`,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#005AE2';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 90, 226, 0.15)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#E2E8F0';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 700,
                            fontFamily: "'Manrope', sans-serif",
                            background: '#005AE2',
                            color: '#ffffff',
                            marginBottom: '12px',
                            border: '2px solid #005AE2',
                          }}>
                            {String(idx + 1).padStart(2, '0')}
                          </div>
                          <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px', lineHeight: 1.3 }}>
                            <EditableText contentKey={`ourModel.selection.cards.${idx}.title`} value={card.title} />
                          </h3>
                          <p style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                            <EditableText contentKey={`ourModel.selection.cards.${idx}.desc`} value={card.desc} />
                          </p>
                        </div>
                      ))}

                      {/* Phase 1 — Validate */}
                      {heroCarouselIndex === 1 && content.ourModel.validation?.steps?.map((step: any, idx: number) => (
                        <div
                          key={idx}
                          style={{
                            background: '#ffffff',
                            border: '1px solid #E2E8F0',
                            borderRadius: '12px',
                            padding: '20px 18px',
                            transition: 'all 0.2s ease',
                            animationDelay: `${idx % 2 === 0 ? idx * 0.09 : 0.05 + idx * 0.09}s`,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#005AE2';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 90, 226, 0.15)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#E2E8F0';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 700,
                            fontFamily: "'Manrope', sans-serif",
                            background: '#005AE2',
                            color: '#ffffff',
                            marginBottom: '12px',
                            border: '2px solid #005AE2',
                          }}>
                            {String(idx + 1).padStart(2, '0')}
                          </div>
                          <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px', lineHeight: 1.3 }}>
                            <EditableText contentKey={`ourModel.validation.steps.${idx}.title`} value={step.title} />
                          </h3>
                          <p style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                            <EditableText contentKey={`ourModel.validation.steps.${idx}.desc`} value={step.desc} />
                          </p>
                        </div>
                      ))}

                      {/* Phases 2, 3, 4 — Build / Launch / Scale */}
                      {[2, 3, 4].includes(heroCarouselIndex) && (
                        <>
                          <div
                            style={{
                              background: '#ffffff',
                              border: '1px solid #E2E8F0',
                              borderRadius: '12px',
                              padding: '20px 18px',
                              transition: 'all 0.2s ease',
                              animationDelay: '0s',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = '#005AE2';
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 90, 226, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = '#E2E8F0';
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: 700,
                              fontFamily: "'Manrope', sans-serif",
                              background: '#005AE2',
                              color: '#ffffff',
                              marginBottom: '12px',
                              border: '2px solid #005AE2',
                            }}>01</div>
                            <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px', lineHeight: 1.3 }}>
                              <EditableText contentKey={`ourModel.phases.items.${heroCarouselIndex - 2}.label`} value={ph?.label} />
                            </h3>
                            <p style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                              <EditableText contentKey={`ourModel.phases.items.${heroCarouselIndex - 2}.desc`} value={ph?.desc} />
                            </p>
                          </div>
                          {content.ourModel.phases?.table?.rows?.map((row: any, idx: number) => (
                            <div
                              key={idx}
                              style={{
                                background: '#ffffff',
                                border: '1px solid #E2E8F0',
                                borderRadius: '12px',
                                padding: '20px 18px',
                                transition: 'all 0.2s ease',
                                animationDelay: `${(idx + 1) * 0.09}s`,
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#005AE2';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 90, 226, 0.15)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#E2E8F0';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                            >
                              <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: 700,
                                fontFamily: "'Manrope', sans-serif",
                                background: '#005AE2',
                                color: '#ffffff',
                                marginBottom: '12px',
                                border: '2px solid #005AE2',
                              }}>
                                {String(idx + 2).padStart(2, '0')}
                              </div>
                              <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px', lineHeight: 1.3 }}>
                                <EditableText contentKey={`ourModel.phases.table.rows.${idx}.c`} value={row.c} />
                              </h3>
                              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: colors[heroCarouselIndex - 2], margin: 0 }}>
                                <EditableText contentKey={`ourModel.phases.table.rows.${idx}.${vKey}`} value={(row as any)[vKey]} />
                              </p>
                            </div>
                          ))}
                        </>
                      )}



                    </div>
                  </div>
                </div>

              {/* ── DIVIDER ── */}
              <div className="section-container" style={{ paddingTop: 0, paddingBottom: 0 }}>
                <div style={{
                  maxWidth: '960px',
                  margin: '0 auto',
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(0,90,226,0.15), transparent)',
                }} />
              </div>

              {/* ── SELECTION PROCESS SUB-SECTION ── */}
              <div className="section-container" id="selection" style={{ paddingBottom: 0, backgroundColor: '#EFF6FF', padding: '60px 24px' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                  <div style={{ textAlign: 'center', marginBottom: '48px', paddingTop: '60px' }}>
                    <EditableText
                      contentKey="studio.creation_steps.eyebrow"
                      value={studioContent.creation_steps?.eyebrow || "Selection Steps"}
                      className="hero-eyebrow-pill"
                    />
                    <EditableText
                      as="h2"
                      contentKey="studio.creation_steps.title"
                      value={studioContent.creation_steps?.title || "Venture Creation Steps"}
                      className="section-title"
                      style={{
                        color: '#0F172A',
                        maxWidth: '800px',
                        margin: '0 auto 16px',
                      }}
                    />
                    <EditableText
                      as="p"
                      contentKey="studio.creation_steps.subtitle"
                      value={studioContent.creation_steps?.subtitle || "A structured roadmap from your initial product proposal to assembly, build, and market launch."}
                      className="section-subtitle"
                      style={{
                        maxWidth: '600px',
                        margin: '0 auto'
                      }}
                    />
                  </div>

                  <div style={{ maxWidth: '640px', margin: '0 auto', position: 'relative', paddingLeft: '24px' }}>
                    {/* Vertical timeline connector line */}
                    <div style={{
                      position: 'absolute',
                      left: '18px',
                      top: '24px',
                      bottom: '24px',
                      width: '2px',
                      background: 'rgba(0,90,226,0.12)',
                      zIndex: 0
                    }}></div>

            {(() => {
              const defaultCreationSteps = [
                {
                  step: '01',
                  title: 'Submit your idea',
                  desc: "Don't submit the how. Just the idea and why (1 page at max)."
                },
                {
                  step: '02',
                  title: 'Get invited for a meeting with partners',
                  bullets: [
                    'You will learn what crestcode does',
                    'You will learn the support we will provide',
                    'You will learn the overall process involved'
                  ]
                },
                {
                  step: '03',
                  title: 'Submit the full proposal',
                  desc: 'Detailing the business model, strategic alignment, and technical specifications for the product.'
                },
                {
                  step: '04',
                  title: 'Get a team assigned & the build product',
                  desc: 'Elite engineers and product leads are allocated to build the product to institutional quality standards.'
                },
                {
                  step: '05',
                  title: 'Prepare go to market launch',
                  desc: 'Launching with precision, refining distribution channels, and optimizing the acquisition funnel for impact.'
                }
              ];

              const creationSteps = (studioContent.creation_steps?.items || []).length > 0
                ? studioContent.creation_steps.items.map((item: any, idx: number) => ({
                    ...defaultCreationSteps[idx],
                    ...item,
                    bullets: item.bullets || defaultCreationSteps[idx].bullets || []
                  }))
                : defaultCreationSteps;

              return creationSteps.map((item: any, idx: number) => (
                <div key={idx} style={{
                  display: 'flex',
                  gap: '24px',
                  marginBottom: idx === 4 ? '0' : '48px',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {/* Left Bullet Icon Circle */}
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #005AE2',
                    color: '#005AE2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    flexShrink: 0,
                    boxShadow: '0 4px 10px rgba(0, 90, 226, 0.08)'
                  }}>
                    <EditableText
                      contentKey={`studio.creation_steps.items.${idx}.step`}
                      value={item.step}
                    />
                  </div>

                  {/* Right Content */}
                  <div style={{ paddingTop: '4px' }}>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: '#0F172A',
                      marginBottom: '8px',
                      fontFamily: "'Manrope', sans-serif",
                      letterSpacing: '-0.01em'
                    }}>
                      <EditableText
                        contentKey={`studio.creation_steps.items.${idx}.title`}
                        value={item.title}
                      />
                    </h3>
                    {item.desc && (
                      <p style={{
                        fontSize: '0.95rem',
                        color: '#64748B',
                        lineHeight: 1.6,
                        margin: 0,
                        fontWeight: 500
                      }}>
                        <EditableText
                          contentKey={`studio.creation_steps.items.${idx}.desc`}
                          value={item.desc}
                        />
                      </p>
                    )}
                    {item.bullets && item.bullets.length > 0 && (
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: '12px 0 0 0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                      }}>
                        {item.bullets.map((bullet: string, bIdx: number) => (
                          <li key={bIdx} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontSize: '0.925rem',
                            color: '#64748B',
                            fontWeight: 500
                          }}>
                            <span style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: '#005AE2',
                              flexShrink: 0
                            }}></span>
                            <EditableText
                              contentKey={`studio.creation_steps.items.${idx}.bullets.${bIdx}`}
                              value={bullet}
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ));
            })()}
                  </div>
                </div>
              </div>
            </div>
            </section>
          );
        })()}

      {/* The Build Timeline */}
      <section className="timeline-table-section">
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <div className="hero-eyebrow-pill">BUILD TIMELINE</div>
          </div>
          <EditableText
            as="h2"
            contentKey="studio.timeline.title"
            value={studioContent?.timeline?.title || "From First Conversation to First Customer"}
            className="section-title"
            style={{ color: '#0F172A', textAlign: 'center', margin: '0 auto 16px' }}
          />
          <EditableText
            as="p"
            contentKey="studio.timeline.subtitle"
            value={studioContent?.timeline?.subtitle || "Every engagement follows five structured stages — built for clarity, speed, and quality."}
            className="section-subtitle text-center mx-auto"
            style={{ maxWidth: '800px', marginBottom: '40px', color: '#64748B', lineHeight: 1.65, textAlign: 'center', margin: '0 auto 24px' }}
          />

          <div className="timeline-table-container">
            <table className="timeline-table">
              <thead>
                <tr>
                  <th>Stage</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {timelinePhases.map((phase, pIdx) => (
                  <tr key={pIdx}>
                    <td className="stage-col">{phase.stage}</td>
                    <td className="title-col">
                      <EditableText
                        contentKey={`studio.timeline.phases.${pIdx}.title`}
                        value={phase.title}
                      />
                    </td>
                    <td className="desc-col">
                      <EditableText
                        contentKey={`studio.timeline.phases.${pIdx}.description`}
                        value={phase.description}
                      />
                    </td>
                    <td className="duration-col">
                      <EditableText
                        contentKey={`studio.timeline.phases.${pIdx}.duration`}
                        value={phase.duration}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      
      {/* DIFFERENTIATION */}
      <section id="diff" style={{ backgroundColor: '#EFF6FF' }}>
        <div className="diff-header">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <EditableText
              contentKey="studio.differentiation.eyebrow"
              value={studioContent.differentiation?.eyebrow || "Why CrestCode"}
              className="hero-eyebrow-pill"
            />
            <EditableText
              as="h2"
              contentKey="studio.differentiation.title"
              value={studioContent.differentiation?.title || "Not a vendor.\nNot a studio that vanishes.\nA co-builder."}
              className="section-title"
              style={{
                color: '#0F172A',
                margin: '0 auto 16px',
                maxWidth: '800px',
                whiteSpace: 'pre-line'
              }}
            />
            <EditableText
              as="p"
              contentKey="studio.differentiation.subtitle"
              value={studioContent.differentiation?.subtitle || "Here is how we compare to the alternatives — and why it matters for your venture."}
              className="section-subtitle"
              style={{
                maxWidth: '600px',
                margin: '0 auto'
              }}
            />
          </div>
        </div>

        <div className="diff-table-wrap">
          <table className="diff-table">
            <thead>
              {(() => {
                const defaultHeaders = ["Capability", "CrestCode", "Dev Agencies", "Other Studios", "Freelancers"];
                const headers = studioContent.differentiation?.headers || defaultHeaders;
                return (
                  <tr>
                    <th style={{ width: '28%' }}>
                      <EditableText contentKey="studio.differentiation.headers.0" value={headers[0]} />
                    </th>
                    <th className="highlight" style={{ width: '18%' }}>
                      <EditableText contentKey="studio.differentiation.headers.1" value={headers[1]} />
                    </th>
                    <th style={{ width: '18%' }}>
                      <EditableText contentKey="studio.differentiation.headers.2" value={headers[2]} />
                    </th>
                    <th style={{ width: '18%' }}>
                      <EditableText contentKey="studio.differentiation.headers.3" value={headers[3]} />
                    </th>
                    <th style={{ width: '18%' }}>
                      <EditableText contentKey="studio.differentiation.headers.4" value={headers[4]} />
                    </th>
                  </tr>
                );
              })()}
            </thead>
            <tbody>
              {(() => {
                const defaultDiffRows = [
                  { feature: "Zero to one expertise", c1: "✓", c2: "Sometimes", c3: "Sometimes", c4: "✗" },
                  { feature: "End-to-end product ownership", c1: "✓", c2: "✗", c3: "Sometimes", c4: "✗" },
                  { feature: "Strategic product & business guidance", c1: "✓", c2: "✗", c3: "Sometimes", c4: "✗" },
                  { feature: "MLP standard — not just MVP", c1: "✓", c2: "✗", c3: "Rarely", c4: "✗" },
                  { feature: "In-house senior team, no outsourcing", "c1": "✓", "c2": "Varies", "c3": "Varies", "c4": "✗" },
                  { feature: "Go-to-market & pitch support", c1: "✓", c2: "✗", c3: "Sometimes", c4: "✗" },
                  { feature: "Co-founder network access", c1: "✓", c2: "✗", c3: "✗", c4: "✗" },
                  { feature: "Lifelong partnership model", c1: "✓", c2: "✗", c3: "Rarely", c4: "✗" }
                ];

                const diffRows = (studioContent.differentiation?.rows || []).length > 0
                  ? studioContent.differentiation.rows
                  : defaultDiffRows;

                return diffRows.map((row: any, idx: number) => (
                  <tr key={idx}>
                    <td className="feature">
                      <EditableText
                        contentKey={`studio.differentiation.rows.${idx}.feature`}
                        value={row.feature}
                      />
                    </td>
                    <td className="highlight">
                      <EditableText
                        contentKey={`studio.differentiation.rows.${idx}.c1`}
                        value={row.c1}
                      >
                        {renderCellText(row.c1)}
                      </EditableText>
                    </td>
                    <td>
                      <EditableText
                        contentKey={`studio.differentiation.rows.${idx}.c2`}
                        value={row.c2}
                      >
                        {renderCellText(row.c2)}
                      </EditableText>
                    </td>
                    <td>
                      <EditableText
                        contentKey={`studio.differentiation.rows.${idx}.c3`}
                        value={row.c3}
                      >
                        {renderCellText(row.c3)}
                      </EditableText>
                    </td>
                    <td>
                      <EditableText
                        contentKey={`studio.differentiation.rows.${idx}.c4`}
                        value={row.c4}
                      >
                        {renderCellText(row.c4)}
                      </EditableText>
                    </td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      {studioContent.cta && (
        <section className="section-white text-center">
          <div className="section-container" style={{ paddingTop: '24px', paddingBottom: '24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div className="hero-eyebrow-pill">Get Started</div>
            </div>
            <EditableText
              as="h2"
              contentKey="studio.cta.title"
              value={studioContent.cta?.title}
              className="section-title"
              style={{ marginBottom: '16px' }}
            />
            <EditableText
              as="p"
              contentKey="studio.cta.subtitle"
              value={studioContent.cta?.subtitle}
              className="section-subtitle text-center"
              style={{ maxWidth: '600px', margin: '0 auto' }}
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

    </div >
    </>
  );
}
