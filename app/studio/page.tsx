'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useRef } from 'react';
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
  { tx: 0, ty: 0, r: 0, z: 40, op: 1, shadow: '0 16px 48px -8px rgba(0,0,0,0.32), 0 4px 16px -4px rgba(0,0,0,0.16)' },
  { tx: 9, ty: 11, r: 5, z: 30, op: 1, shadow: 'none' },
  { tx: 17, ty: 20, r: 9, z: 20, op: 0.90, shadow: 'none' },
  { tx: 23, ty: 27, r: 13, z: 10, op: 0.75, shadow: 'none' },
];

function SolvingSection({ stackCards, studioContent, EditableText }: any) {
  const n = stackCards.length;
  const [active, setActive] = useState(0);
  const [exiting, setExiting] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const t = setInterval(() => {
      setActive(prev => {
        setExiting(prev);
        setTimeout(() => setExiting(null), 380);
        return (prev + 1) % n;
      });
    }, INTERVAL);
    return () => clearInterval(t);
  }, [n, isVisible]);

  return (
    <section
      ref={sectionRef}
      style={{ backgroundColor: '#060B18' }}
      className="section-dark page-section"
    >
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(40px, 6vw, 72px)',
          alignItems: 'center',
        }}>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="hero-eyebrow-pill" style={{ marginBottom: '24px' }}>
              <EditableText contentKey="studio.solving.eyebrow" value={studioContent.solving?.eyebrow || "Solving It"} />
            </div>
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
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(true);


  const PHASE_STEP_IDS = [
    'phase-select', 'phase-submit', 'phase-validate', 'phase-build', 'phase-launch', 'phase-pmf', 'phase-scale',
  ];

  const handleManualPhaseChange = (index: number) => {
    setIsAutoAdvancing(false);
    setHeroCarouselIndex(index);
    const target = document.getElementById(PHASE_STEP_IDS[index]) || document.getElementById('selection-process');
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#${PHASE_STEP_IDS[index]}`);
  };

  useEffect(() => {
    if (!content) return;

    const observerOptions = {
      root: null,
      rootMargin: '-45% 0px -45% 0px',
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

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (PHASE_STEP_IDS.includes(hash)) {
      const index = PHASE_STEP_IDS.indexOf(hash);
      setHeroCarouselIndex(index);
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [loading]);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (!isAutoAdvancing) return;

    const interval = setInterval(() => {
      setHeroCarouselIndex(prev => (prev + 1) % 7);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoAdvancing]);

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

        @keyframes ambientGlow {
          0% {
            opacity: 0.8;
            transform: translateY(0) scale(1);
          }
          50% {
            opacity: 1;
            transform: translateY(-15px) scale(1.08);
          }
          100% {
            opacity: 0.8;
            transform: translateY(0) scale(1);
          }
        }
        .hero-ambient-glow {
          animation: ambientGlow 10s ease-in-out infinite;
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
        h1, h2, h3, h4, h5, h6, .hero-title, .section-title, .section-eyebrow, .card-title, .navbar-brand, .f-card-title, .feature-title, .t-name-light, .t-name, .fq-author, .footer-logo, .footer-heading {
          font-family: 'Manrope', sans-serif !important;
          font-weight: 800 !important;
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

        .section-container { max-width: 100%; }
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

        .thesis-grid {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 4rem;
          align-items: start;
        }
        @media(max-width: 991px) {
          .thesis-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
        }

        .thesis-text-scroll {
          max-height: 440px;
          overflow-y: auto;
          padding-right: 16px;
        }
        .thesis-text-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .thesis-text-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .thesis-text-scroll::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 4px;
        }
        .thesis-text-scroll::-webkit-scrollbar-thumb:hover {
          background: #94A3B8;
        }
        @media(max-width: 991px) {
          .thesis-text-scroll {
            max-height: none !important;
            overflow-y: visible !important;
            padding-right: 0 !important;
          }
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
        .hcFadeIn {
          animation: hcFadeIn 0.4s ease;
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
          padding: 80px 18px;
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
          background: var(--card-bg, #F8FAFC) !important;
          border: 1px solid var(--card-border, #E2E8F0) !important;
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
          background: var(--card-bg-hover, #FFFFFF) !important;
          border-color: var(--card-border-hover, var(--card-glow)) !important;
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
          .section-title {
            font-size: 2.25rem !important;
            text-align: center !important;
            transform: none !important;
            margin-bottom: 40px !important;
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

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .selection-stepper-container {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: nowrap;
          overflow-x: auto;
          padding: 20px 10px;
          gap: 8px;
          -webkit-overflow-scrolling: touch;
        }
        .selection-stepper-container::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 768px) {
          .diff-header { margin-bottom: 3rem; }
          .diff-table-wrap { overflow-x: auto; }
          .diff-table th, .diff-table td { padding: 1rem; font-size: 0.8rem; }
          .metrics-grid {
            grid-template-columns: 1fr;
          }
          .selection-stepper-container {
            justify-content: flex-start;
          }
        }

        .hero-split-grid {
          display: grid;
          grid-template-columns: 1.1fr 1.2fr;
          gap: clamp(24px, 5vw, 64px);
          align-items: start;
        }
        @media (max-width: 900px) {
          .hero-split-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }

      `}} />

      <Header />
      <div className="studio-page" style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#F8FAFC' }}>

        {/* Ambient glow orbs */}

        {/* Consolidated Intro Section */}
        <section className="hero-section" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Hero Background */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(37,99,235,0.18) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 20% 80%, rgba(37,99,235,0.08) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }}></div>
          {/* Hero Grid */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(37,99,235,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.08) 1px, transparent 1px)', backgroundSize: '80px 80px', maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 0%, transparent 80%)', opacity: 0.4, pointerEvents: 'none', zIndex: 0 }}></div>
          {/* Ambient Glows */}
          <div style={{ position: 'absolute', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.25), transparent 70%)', top: '-200px', left: '50%', transform: 'translateX(-50%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }}></div>
          <div style={{ position: 'absolute', width: '520px', height: '520px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.2), transparent 70%)', bottom: '0px', left: '0px', filter: 'blur(90px)', pointerEvents: 'none', zIndex: 0 }}></div>
          <div style={{ position: 'absolute', width: '520px', height: '520px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.2), transparent 70%)', bottom: '0px', right: '0px', filter: 'blur(90px)', pointerEvents: 'none', zIndex: 0 }}></div>

          <div style={{ maxWidth: '1200px', width: '100%', padding: '0 24px', boxSizing: 'border-box', margin: '0 auto', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* Part 1: Who We Are Card */}
            <div style={{
              textAlign: 'center',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              zIndex: 1,
            }}>
              <span className="hero-eyebrow-pill" style={{ marginBottom: '24px' }}>
                <EditableText contentKey="studio.consolidated.whoweare.eyebrow" value={studioContent.consolidated?.whoweare?.eyebrow || "Who we are"} />
              </span>
              <EditableText
                as="h1"
                contentKey="studio.consolidated.whoweare.title"
                value={studioContent.consolidated?.whoweare?.title || "Not an agency. Not an accelerator.\nA venture partner."}
                className="hero-title"
              >
                {(() => {
                  const headingText = studioContent.consolidated?.whoweare?.title || "Not an agency. Not an accelerator.\nA venture partner.";
                  const lines = headingText.split('\n');
                  return lines.map((line, lineIdx) => (
                    <React.Fragment key={lineIdx}>
                      {line.split(/[\s\u00a0]+/).map((word: string, index: number) => {
                        if (!word) return null;
                        const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").toLowerCase();
                        const isBlue = cleanWord === 'partner';
                        return (
                          <span key={index} style={isBlue ? { color: '#005AE2' } : {}}>
                            {word}{' '}
                          </span>
                        );
                      })}
                      {lineIdx < lines.length - 1 && <br />}
                    </React.Fragment>
                  ));
                })()}
              </EditableText>
              <p className="hero-description" style={{ margin: '0 auto' }}>
                <EditableText
                  contentKey="studio.consolidated.whoweare.desc"
                  value={studioContent.consolidated?.whoweare?.desc || "CrestCode exists to level the playing field — combining elite engineering with strategic partnership to turn bold ideas into ventures built to last, not just launched."}
                />
              </p>
            </div>

            {/* Part 2: Vision & Mission Card */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '24px',
              padding: '48px 48px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.015)',
              width: '100%',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}>
              <div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#005AE2',
                  display: 'block',
                  marginBottom: '12px',
                  fontFamily: "'Manrope', sans-serif"
                }}>
                  <EditableText contentKey="studio.consolidated.vision.eyebrow" value={studioContent.consolidated?.vision?.eyebrow || "VISION & MISSION"} />
                </span>
                <h2 style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2.1rem)',
                  fontWeight: 800,
                  color: '#0F172A',
                  lineHeight: 1.3,
                  margin: 0,
                  fontFamily: "'Manrope', sans-serif",
                  letterSpacing: '-0.02em',
                }}>
                  <EditableText contentKey="studio.consolidated.vision.title" value={studioContent.consolidated?.vision?.title || "What we're building toward, and how we get there"} />
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <EditableText
                    as="p"
                    contentKey="studio.consolidated.vision.paragraph1"
                    value={studioContent.consolidated?.vision?.paragraph1 || "We envision a world where great ideas — regardless of technical background or startup experience — get the strategic and engineering firepower they deserve. No founder should have to build alone."}
                    style={{
                      fontSize: '1rem',
                      color: '#334155',
                      lineHeight: 1.7,
                      margin: 0,
                      fontWeight: 500,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {(() => {
                      const text = studioContent.consolidated?.vision?.paragraph1 || "We envision a world where great ideas — regardless of technical background or startup experience — get the strategic and engineering firepower they deserve. No founder should have to build alone.";
                      const target = "No founder should have to build alone.";
                      if (text.includes(target)) {
                        const parts = text.split(target);
                        return (
                          <>
                            {parts[0]}
                            <span style={{ fontWeight: 700, color: '#005AE2' }}>{target}</span>
                            {parts[1]}
                          </>
                        );
                      }
                      return text;
                    })()}
                  </EditableText>
                </div>
                <EditableText
                  as="p"
                  contentKey="studio.consolidated.vision.paragraph2"
                  value={studioContent.consolidated?.vision?.paragraph2 || "Day to day, that means partnering with visionary founders and business owners through strategy, elite engineering, and relentless execution — turning real problems into world-class digital products."}
                  style={{
                    fontSize: '1rem',
                    color: '#475569',
                    lineHeight: 1.7,
                    margin: 0,
                    fontWeight: 500,
                    fontFamily: "'Inter', sans-serif",
                  }}
                />
              </div>
            </div>

          </div>
        </section>





        {/* Core Values Section - Premium Light Mode Grid with 6 Cards */}
        <section className="page-section" style={{ backgroundColor: '#FAFAFA', fontFamily: 'Manrope, sans-serif', position: 'relative', overflow: 'hidden' }}>
          {/* Subtle background */}
          <div style={{ position: 'absolute', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.03), transparent 70%)', top: '-100px', left: '-100px', pointerEvents: 'none' }}></div>
          <div style={{ position: 'absolute', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(13, 148, 136, 0.02), transparent 70%)', bottom: '-100px', right: '-100px', pointerEvents: 'none' }}></div>

          <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
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

            <div className="values-grid">
              {(() => {
                // Two alternating colors only: blue (#3B82F6) and teal (#0D9488)
                const VALUE_COLORS = [
                  { color: '#3B82F6', bgTint: '#EFF6FF', borderHover: '#3B82F6' },
                  { color: '#0D9488', bgTint: '#F0FDFA', borderHover: '#0D9488' },
                ];
                const defaultValues = [
                  {
                    title: 'Ownership',
                    desc: "We treat every product as if it's our own.",
                    icon: (
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.656 5.656L12 3 3.344 5.656C3.125 5.724 3 5.923 3 6.152V12c0 5.061 3.864 9.479 9 10 5.136-.521 9-4.939 9-10V6.152c0-.229-.125-.428-.344-.496z" />
                      </svg>
                    ),
                    ...VALUE_COLORS[0],
                  },
                  {
                    title: 'Honesty',
                    desc: "We challenge clients when we need to, even when it's uncomfortable.",
                    icon: (
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    ),
                    ...VALUE_COLORS[1],
                  },
                  {
                    title: 'Customer obsession',
                    desc: "Success is measured by the people who use the product, not just the people who commissioned it.",
                    icon: (
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    ),
                    ...VALUE_COLORS[0],
                  },
                  {
                    title: 'Craft',
                    desc: "We build to the MLP standard, because good enough never is.",
                    icon: (
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.242.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.17 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.883c-.77-.568-.371-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    ),
                    ...VALUE_COLORS[1],
                  },
                  {
                    title: 'Partnership',
                    desc: "We're in it for the long run, not just the launch.",
                    icon: (
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    ),
                    ...VALUE_COLORS[0],
                  },
                  {
                    title: 'Innovation',
                    desc: "We bring the latest thinking in product, engineering, and AI to every engagement.",
                    icon: (
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z" />
                      </svg>
                    ),
                    ...VALUE_COLORS[1],
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
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '14px',
                      padding: '28px',
                      transition: 'all 0.25s ease',
                      cursor: 'default',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = val.borderHover;
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E5E7EB';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Circular Icon Container */}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: val.bgTint,
                      color: val.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px',
                      flexShrink: 0,
                    }}>
                      {val.icon}
                    </div>

                    {/* Title */}
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: '#111827',
                      marginBottom: '8px',
                      letterSpacing: '-0.01em',
                      lineHeight: 1.3,
                    }}>
                      <EditableText
                        contentKey={`studio.values.items.${index}.title`}
                        value={val.title}
                      />
                    </h3>

                    {/* Description */}
                    <p style={{
                      color: '#6B7280',
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                      margin: 0,
                      fontWeight: 400,
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







        

        {/* ── INVESTMENT THESIS — redesigned 2-col layout ── */}
        <section style={{
          background: 'linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)',
          position: 'relative',
          boxShadow: 'inset 0 20px 20px -20px rgba(0, 0, 0, 0.08), inset 0 -20px 20px -20px rgba(0, 0, 0, 0.05), 0 20px 40px -20px rgba(0, 0, 0, 0.05)'
        }}>
          <div className="section-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="thesis-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '4rem', alignItems: 'start' }}>

              {/* ── LEFT: Quadrant Chart + caption ── */}
              <div>
                {/* Eyebrow + Title */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <span className="hero-eyebrow-pill" style={{ display: 'inline-block', marginBottom: 0 }}>
                    <EditableText contentKey="studio.selectiveness.thesisLabel" value={studioContent.selectiveness?.thesisLabel || "LET'S START FROM HERE"} />
                  </span>
                </div>
                <h3 style={{
                  fontSize: 'clamp(1.5rem, 2.5vw, 2.1rem)',
                  fontWeight: 800,
                  color: '#0F172A',
                  lineHeight: 1.25,
                  letterSpacing: '-0.02em',
                  fontFamily: "'Manrope', sans-serif",
                  marginBottom: '1.75rem',
                  textTransform: 'uppercase'
                }}>
                  <EditableText contentKey="studio.selectiveness.thesisTitle" value={studioContent.selectiveness?.thesisTitle || "INVESTMENT THESIS: SMALL BUSINESSES ARE STILL RUNNING ON YESTERDAY'S TOOLS"} />
                </h3>

                {/* Quadrant Chart — matches reference image */}
                <div style={{ position: 'relative', paddingTop: '28px', paddingBottom: '36px', paddingLeft: '0px' }}>

                  {/* Chart box */}
                  <div style={{
                    position: 'relative',
                    width: '100%', maxWidth: '340px',
                    aspectRatio: '1 / 1',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                    backgroundColor: '#fff',
                  }}>
                    {/* ── Quadrant fills (uniform lavender left, mint green right) ── */}
                    {/* Q2 top-left: lavender */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '50%', height: '50%', backgroundColor: '#F5F3FF' }} />
                    {/* Q1 top-right: mint green */}
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '50%', backgroundColor: '#F0FDF4' }} />
                    {/* Q3 bottom-left: lavender */}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '50%', height: '50%', backgroundColor: '#F5F3FF' }} />
                    {/* Q4 bottom-right: mint green */}
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: '50%', height: '50%', backgroundColor: '#F0FDF4' }} />

                    {/* ── Divider lines ── */}
                    <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', backgroundColor: '#D1D9E4', transform: 'translateX(-50%)' }} />
                    <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', backgroundColor: '#D1D9E4', transform: 'translateY(-50%)' }} />

                    {/* ── Products ── (label above, circle centered exactly) ── */}

                    {/* Limelite — Q1: top-right, broad business */}
                    <div style={{
                      position: 'absolute',
                      left: '70%',
                      top: '25%',
                      transform: 'translate(-50%, -50%)',
                      width: '16px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 10
                    }}>
                      <span style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        fontFamily: "'Inter', sans-serif",
                        whiteSpace: 'nowrap',
                        marginBottom: '5px'
                      }}>
                        <EditableText
                          contentKey="studio.selectiveness.products.limelite"
                          value={studioContent.selectiveness?.products?.limelite || "Limelite"}
                          style={{ color: '#1A7A4A' }}
                        />
                      </span>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #22C55E', backgroundColor: 'transparent' }} />
                    </div>

                    {/* Dockly — Q3: bottom-left, broad family */}
                    <div style={{
                      position: 'absolute',
                      left: '30%',
                      top: '25%',
                      transform: 'translate(-50%, -50%)',
                      width: '16px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 10
                    }}>
                      <span style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        fontFamily: "'Inter', sans-serif",
                        whiteSpace: 'nowrap',
                        marginBottom: '5px'
                      }}>
                        <EditableText
                          contentKey="studio.selectiveness.products.dockly"
                          value={studioContent.selectiveness?.products?.dockly || "Dockly"}
                          style={{ color: '#4338CA' }}
                        />
                      </span>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #6366F1', backgroundColor: 'transparent' }} />
                    </div>

                    {/* CastleGEC — Q3: bottom-left lower area, deeper niche */}
                    <div style={{
                      position: 'absolute',
                      left: '36%',
                      top: '70%',
                      transform: 'translate(-50%, -50%)',
                      width: '16px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 10
                    }}>
                      <span style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        fontFamily: "'Inter', sans-serif",
                        whiteSpace: 'nowrap',
                        marginTop: '5px'
                      }}>
                        <EditableText
                          contentKey="studio.selectiveness.products.castleGEC"
                          value={studioContent.selectiveness?.products?.castleGEC || "CastleGEC"}
                          style={{ color: '#4338CA' }}
                        />
                      </span>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #6366F1', backgroundColor: 'transparent' }} />
                    </div>

                    {/* OpenCap — centered where X and Y axes meet */}
                    <div style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '16px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 12
                    }}>
                      <span style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        fontFamily: "'Inter', sans-serif",
                        whiteSpace: 'nowrap',
                        marginBottom: '5px'
                      }}>
                        <EditableText
                          contentKey="studio.selectiveness.products.openCap"
                          value={studioContent.selectiveness?.products?.openCap || "OpenCap"}
                          style={{ color: '#94A3B8' }}
                        />
                      </span>
                      <div style={{
                        width: '15px',
                        height: '15px',
                        borderRadius: '50%',
                        border: '1.5px dashed #94A3B8',
                        backgroundColor: '#fff',
                      }} />
                    </div>

                    {/* NestBloq — Q4: bottom-right, near center */}
                    <div style={{
                      position: 'absolute',
                      left: '70%',
                      top: '68%',
                      transform: 'translate(-50%, -50%)',
                      width: '16px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 10
                    }}>
                      <span style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        fontFamily: "'Inter', sans-serif",
                        whiteSpace: 'nowrap',
                        marginTop: '5px'
                      }}>
                        <EditableText
                          contentKey="studio.selectiveness.products.nestBloq"
                          value={studioContent.selectiveness?.products?.nestBloq || "NestBloq"}
                          style={{ color: '#1A7A4A' }}
                        />
                      </span>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #22C55E', backgroundColor: 'transparent' }} />
                    </div>

                  </div>{/* end chart box */}

                  {/* X-axis labels: Family left, Business right */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '340px', marginTop: '12px' }}>
                    <div style={{ textAlign: 'left', fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', lineHeight: 1.3 }}>
                      <div style={{ fontWeight: 800, color: '#0F172A', letterSpacing: '0.06em' }}>
                        <EditableText
                          contentKey="studio.selectiveness.axis.family"
                          value={studioContent.selectiveness?.axis?.family || "Family"}
                        />
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', lineHeight: 1.3 }}>
                      <div style={{ fontWeight: 800, color: '#0F172A', letterSpacing: '0.06em' }}>
                        <EditableText
                          contentKey="studio.selectiveness.axis.business"
                          value={studioContent.selectiveness?.axis?.business || "Business"}
                        />
                      </div>
                    </div>
                  </div>



                </div>{/* end chart wrapper */}


                {/* Chart caption */}
                <p style={{ marginTop: '2.2rem', fontSize: '0.78rem', color: '#94A3B8', lineHeight: 1.6, fontFamily: "'Inter', sans-serif", maxWidth: '320px', fontStyle: 'italic' }}>
                  <EditableText
                    contentKey="studio.selectiveness.chartCaption"
                    value={studioContent.selectiveness?.chartCaption || "How we think about who we build for — not a measured market view."}
                  />
                </p>
              </div>

              {/* ── RIGHT: Editorial text ── */}
              <div className="thesis-text-scroll" style={{ paddingTop: '0.5rem' }}>
                <div style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.85, fontFamily: "'Inter', sans-serif", fontWeight: 450, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <p style={{ margin: 0 }}>
                    <EditableText
                      as="span"
                      contentKey="studio.selectiveness.thesisP1"
                      value={studioContent.selectiveness?.thesisP1 || "Families managing the moving parts of a household. Small business owners running operations with no IT department behind them. Different scale, same problem — they're stuck with spreadsheets, phone calls, and guesswork, while the software built for them is either too generic to fit how they actually operate, or too complex to bother adopting."}
                    />
                  </p>
                  <p style={{ margin: 0 }}>
                    <EditableText
                      as="span"
                      contentKey="studio.selectiveness.thesisP2"
                      value={studioContent.selectiveness?.thesisP2 || "It's not for lack of technology. It's cost, habit, and a real fear: that handing the work over to software means losing the judgment that made it succeed in the first place."}
                    />
                  </p>
                  <p style={{ margin: 0 }}>
                    <EditableText
                      as="span"
                      contentKey="studio.selectiveness.thesisP3"
                      value={studioContent.selectiveness?.thesisP3 || "We build for both sides of that gap. For families, that means products like Dockly and CastleGEC — tools that hold the everyday logistics and the major decisions of a household in one place, instead of scattered across apps no one fully trusts. For small businesses, that means products like Limelite and NestBloq — tools built around how an independent operator actually works, not how an enterprise vendor assumes they should."}
                    />
                  </p>
                  <p style={{ margin: 0 }}>
                    <EditableText
                      as="span"
                      contentKey="studio.selectiveness.thesisP4"
                      value={studioContent.selectiveness?.thesisP4 || "That's our bet: the families and small operators still under-digitized today are the ones with the most room to grow tomorrow — and the ones we're building for first."}
                    />
                  </p>
                </div>
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
        {/* SECTION A: Selection Process — 7 Phase Tabs + Cards   */}
        {/* ═══════════════════════════════════════════════════════ */}

        {content?.ourModel && (() => {
          // ── CMS-driven tabs: read from studioContent, fall back to hardcoded labels ──
          const CMS_TABS = studioContent.selection_process?.tabs;
          const PHASE_TABS = [
            { title: CMS_TABS?.[0]?.title || 'SELECT', id: 0 },
            { title: CMS_TABS?.[1]?.title || 'SUBMIT', id: 1 },
            { title: CMS_TABS?.[2]?.title || 'VALIDATE', id: 2 },
            { title: CMS_TABS?.[3]?.title || 'BUILD', id: 3 },
            { title: CMS_TABS?.[4]?.title || 'LAUNCH', id: 4 },
            { title: CMS_TABS?.[5]?.title || 'PMF', id: 5 },
            { title: CMS_TABS?.[6]?.title || 'SCALE', id: 6 },
          ];

          // ── CMS-driven items: merge CMS data over hardcoded fallbacks ──
          const CMS_ITEMS = studioContent.selection_process?.items || [];
          const mergePhase = (idx: number, fallback: any) => {
            const cms = CMS_ITEMS[idx] || {};
            return {
              ...fallback,
              title: cms.title ?? fallback.title,
              description: cms.description ?? fallback.description,
              metricHeader: cms.metricHeader !== undefined ? cms.metricHeader : fallback.metricHeader,
              bullets: (cms.bullets && cms.bullets.length > 0)
                ? cms.bullets.map((b: any, bIdx: number) => ({
                    ...(fallback.bullets[bIdx] || {}),
                    title: b.title ?? (fallback.bullets[bIdx]?.title || ''),
                    desc: b.desc ?? (fallback.bullets[bIdx]?.desc || ''),
                    ...(b.duration !== undefined ? { duration: b.duration } : {}),
                  }))
                : fallback.bullets,
              metrics: (cms.metrics && cms.metrics.length > 0)
                ? cms.metrics.map((m: any, mIdx: number) => ({
                    ...(fallback.metrics[mIdx] || {}),
                    ...m,
                  }))
                : fallback.metrics,
            };
          };

          const FALLBACK_PHASE_DATA = [
            {
              phaseNum: "01", phaseKey: "SELECT",
              title: "We choose ideas worth building",
              description: "Submit your idea — not the how, just the what and why, in one page or less. Every submission gets reviewed by our partners directly.",
              bullets: [
                { title: "Submit your idea", desc: "One page max. We're evaluating the problem and your fit — not asking for a business plan yet." },
                { title: "Meet with partners", desc: "You'll learn what CrestCode does, what support looks like, and the full process ahead." }
              ],
              metricHeader: null,
              metrics: [
                { num: "01", label: "Typical duration", value: "1-2 weeks", valueColor: "#0F172A" },
                { num: "", label: "What you need", value: "Just the idea", valueColor: "#0F172A" }
              ]
            },
            {
              phaseNum: "02", phaseKey: "SUBMIT",
              title: "Submit your idea",
              description: "Share your concept with our team. We review every submission within 24–48 hours and assess fit across market potential, technical feasibility, and founder conviction.",
              bullets: [
                { title: "Initial assessment", desc: "We review every submission within 24–48 hours to assess market potential, technical feasibility, and founder conviction." },
                { title: "Partner meeting", desc: "Get invited to learn what Crestcode does, the support we provide, and the overall process." }
              ],
              metricHeader: null,
              metrics: [
                { num: "01", label: "Typical duration", value: "24-48 hours", valueColor: "#0F172A" },
                { num: "", label: "What you need", value: "1 page max", valueColor: "#0F172A" }
              ]
            },
            {
              phaseNum: "03", phaseKey: "VALIDATE",
              title: "We pressure-test before we build",
              description: "If there's mutual fit, you submit the full proposal — business model, strategic alignment, and technical scope — before any code gets written.",
              bullets: [
                { title: "Full proposal", desc: "Business model, target customer, and technical specifications get detailed and stress-tested together." },
                { title: "Team assigned", desc: "Senior engineers and product leads are allocated — the people you meet are the people who build." }
              ],
              metricHeader: null,
              metrics: [
                { num: "01", label: "Typical duration", value: "1-2 weeks", sub: "Proposal review through team allocation", valueColor: "#0F172A" },
                { num: "02", label: "Output", value: "Signed scope + team", sub: "Clear deliverables before build begins", valueColor: "#0F172A" }
              ]
            },
            {
              phaseNum: "04", phaseKey: "BUILD",
              title: "Design and engineering, in lockstep",
              description: "A high-velocity, structured roadmap from zero to market entry — six execution stages optimized for speed without sacrificing quality.",
              bullets: [
                { title: "Discovery & requirements", duration: "1-2 weeks", desc: "Defining core goals and user needs for a scalable architecture." },
                { title: "Strategy & setup", duration: "1-2 weeks", desc: "Technical planning and resource allocation." },
                { title: "Design & prototyping", duration: "3-4 weeks", desc: "High-fidelity UI/UX design and interaction mapping." },
                { title: "Agile development", duration: "8-12 weeks", desc: "Building core features with bi-weekly demos." },
                { title: "QA & launch prep", duration: "2 weeks", desc: "Rigorous testing and production deployment." }
              ],
              metricHeader: "HOW WE MEASURE THIS PHASE",
              metrics: [
                { num: "01", label: "Sprint velocity", value: "Bi-weekly demos", sub: "Working software shown every cycle", valueColor: "#005AE2" },
                { num: "02", label: "Scope stability", value: "85%+ on-spec", sub: "Features matching original scope", valueColor: "#10B981" },
                { num: "03", label: "Code quality gate", value: "80%+ test coverage", sub: "Minimum before a feature is \"done\"", valueColor: "#005AE2" },
                { num: "04", label: "Time to MLP", value: "15-22 weeks", sub: "Discovery through QA, idea-dependent", valueColor: "#B45309" }
              ]
            },
            {
              phaseNum: "05", phaseKey: "LAUNCH",
              title: "Precision over noise",
              description: "Founder-led, community-first, metrics-gated. Growth is earned before it's amplified — we deploy strategically to a beachhead market first.",
              bullets: [
                { title: "Beachhead deployment", desc: "Controlled release, rapid feedback gathering, and early community seeding." }
              ],
              metricHeader: "HOW WE MEASURE THIS PHASE",
              metrics: [
                { num: "01", label: "User retention (Day 30)", value: "Target 20-40%", sub: "Early product-market signal", valueColor: "#B45309" },
                { num: "02", label: "CAC : LTV ratio", value: "Target 1 : 4-5", sub: "Threshold before recommending paid growth", valueColor: "#B45309" },
                { num: "03", label: "Platform stability", value: "99.5%+ uptime", sub: "Monitored from first public release", valueColor: "#10B981" },
                { num: "04", label: "Time to first 100 users", value: "2-4 weeks", sub: "From beachhead release to adoption", valueColor: "#005AE2" }
              ]
            },
            {
              phaseNum: "06", phaseKey: "PMF",
              title: "Achieving Product-Market Fit",
              description: "We measure, iterate, and refine until your product earns genuine retention. PMF is not declared — it is proven through real user behavior and engagement signals.",
              bullets: [
                { title: "Retention signals", desc: "Track repeat usage, engagement depth, and organic referral patterns that indicate real product value." },
                { title: "User feedback loops", desc: "Structured interviews and behavioral data to identify what resonates and what needs refinement." },
                { title: "Iteration cycles", desc: "Rapid product adjustments based on validated learnings — not assumptions." }
              ],
              metricHeader: "HOW WE MEASURE THIS PHASE",
              metrics: [
                { num: "01", label: "Target PMF timeline", value: "3-6 months", sub: "Structured iteration cycles", valueColor: "#B45309" },
                { num: "02", label: "Retention metric", value: "Sustained active usage", sub: "Product-market confirmation", valueColor: "#005AE2" }
              ]
            },
            {
              phaseNum: "07", phaseKey: "SCALE",
              title: "We stay past the finish line",
              description: "This is where most studios disappear. We don't — refining distribution, optimizing the acquisition funnel, and supporting fundraising as the venture grows.",
              bullets: [
                { title: "Distribution & growth", desc: "Refining channels and optimizing the acquisition funnel for sustained impact." },
                { title: "Ongoing partnership", desc: "Continued access to the CrestCode network, engineering support, and strategic guidance." }
              ],
              metricHeader: "HOW WE MEASURE THIS PHASE",
              metrics: [
                { num: "01", label: "Month-over-month growth", value: "Target 10-20%", sub: "Sustainable compounding growth", valueColor: "#10B981" },
                { num: "02", label: "Channel diversification", value: "2+ active channels", sub: "Reduces single-source dependency", valueColor: "#005AE2" },
                { num: "03", label: "Net revenue retention", value: "Target 100%+", sub: "Expansion outpacing churn", valueColor: "#B45309" },
                { num: "04", label: "Continued engagement", value: "Ongoing partnership", sub: "Engaged through fundraising & beyond", valueColor: "#005AE2" }
              ]
            }
          ];

          const PHASE_DATA = FALLBACK_PHASE_DATA.map((fallback, idx) => mergePhase(idx, fallback));

          const currentPhaseData = PHASE_DATA[heroCarouselIndex];

          return (
            <section
              id="selection-process"
              className="page-section"
              style={{
                position: 'relative',
                backgroundColor: '#FFFFFF',
                overflow: 'hidden'
              }}
            >
              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Unified Header */}
                <div className="section-container section-container--flush-y" style={{ textAlign: 'center', marginBottom: '40px' }}>
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
                    value={studioContent.phases?.title || "Seven Steps. One Mission."}
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

                {/* Stepper Navigation */}
                <div style={{
                  position: 'sticky', top: 0, zIndex: 100,
                  background: '#FFFFFF',
                  marginBottom: '40px',
                }}>
                  <div className="section-container section-container--flush-y">
                    <div className="selection-stepper-container" style={{
                      maxWidth: '960px',
                      margin: '0 auto',
                    }}>
                      {PHASE_TABS.map((tab, idx) => {
                        const isActive = heroCarouselIndex === idx;
                        const isCompleted = heroCarouselIndex > idx;
                        return (
                          <React.Fragment key={tab.id}>
                            <button
                              onClick={() => handleManualPhaseChange(tab.id)}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                                background: 'transparent',
                                border: 'none',
                                padding: 0,
                                minWidth: '72px',
                                outline: 'none',
                              }}
                            >
                              <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '13px',
                                fontWeight: 700,
                                fontFamily: "'Manrope', sans-serif",
                                background: isActive ? '#005AE2' : (isCompleted ? '#E6F4EA' : '#ffffff'),
                                color: isActive ? '#ffffff' : (isCompleted ? '#137333' : '#64748B'),
                                border: isActive ? '2px solid #005AE2' : (isCompleted ? '2px solid #10B981' : '2px solid #D1D5DB'),
                                transition: 'all 0.3s ease',
                              }}>
                                {isCompleted ? '✓' : (idx + 1)}
                              </div>
                              <span style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                fontFamily: "'Manrope', sans-serif",
                                letterSpacing: '0.08em',
                                textAlign: 'center',
                                color: isActive ? '#005AE2' : '#64748B',
                                transition: 'all 0.3s ease',
                              }}>
                                <EditableText contentKey={`studio.selection_process.tabs.${idx}.title`} value={tab.title} />
                              </span>
                            </button>
                            {idx < PHASE_TABS.length - 1 && (
                              <div style={{
                                flex: 1,
                                height: '2px',
                                background: heroCarouselIndex > idx ? '#10B981' : '#E5E7EB',
                                margin: '0 4px',
                                transition: 'all 0.3s ease',
                                maxWidth: '80px',
                                minWidth: '20px',
                              }} />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Main Content Card */}
                <div className="section-container section-container--flush-y">
                  <div style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '20px',
                    padding: '40px 48px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.015)',
                    maxWidth: '960px',
                    margin: '0 auto',
                  }}>

                    {/* Main Title */}
                    <h3 style={{
                      fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                      fontWeight: 700,
                      color: '#0F172A',
                      lineHeight: 1.25,
                      marginBottom: '20px',
                      fontFamily: "'Manrope', sans-serif"
                    }}>
                      <EditableText
                        contentKey={`studio.selection_process.items.${heroCarouselIndex}.title`}
                        value={currentPhaseData.title}
                      />
                    </h3>

                    {/* Description Block */}
                    <div style={{
                      borderLeft: '3px solid #005AE2',
                      paddingLeft: '16px',
                      marginBottom: '32px',
                    }}>
                      <p style={{
                        fontSize: '0.975rem',
                        color: '#475569',
                        lineHeight: 1.6,
                        margin: 0,
                        fontWeight: 500,
                      }}>
                        <EditableText
                          contentKey={`studio.selection_process.items.${heroCarouselIndex}.description`}
                          value={currentPhaseData.description}
                        />
                      </p>
                    </div>

                    {/* Divider Line */}
                    <div style={{
                      height: '1px',
                      background: '#E2E8F0',
                      marginBottom: '32px',
                    }} />

                    {/* Bullet Points */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
                      {currentPhaseData.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: '#F5F5F4',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#787880',
                            flexShrink: 0,
                            marginTop: '2px',
                          }}>
                            {bIdx + 1}
                          </div>
                          <div>
                            <h4 style={{
                              fontSize: '1rem',
                              fontWeight: 700,
                              color: '#0F172A',
                              margin: '0 0 4px 0',
                              fontFamily: "'Manrope', sans-serif"
                            }}>
                              <EditableText
                                contentKey={`studio.selection_process.items.${heroCarouselIndex}.bullets.${bIdx}.title`}
                                value={bullet.title}
                              />
                            </h4>
                            {bullet.duration && (
                              <span style={{
                                fontSize: '0.8rem',
                                color: '#787880',
                                display: 'block',
                                marginBottom: '4px',
                                fontWeight: 700,
                                fontFamily: "'Manrope', sans-serif"
                              }}>
                                <EditableText
                                  contentKey={`studio.selection_process.items.${heroCarouselIndex}.bullets.${bIdx}.duration`}
                                  value={bullet.duration}
                                />
                              </span>
                            )}
                            <p style={{
                              fontSize: '0.925rem',
                              color: '#475569',
                              lineHeight: 1.5,
                              margin: 0,
                            }}>
                              <EditableText
                                contentKey={`studio.selection_process.items.${heroCarouselIndex}.bullets.${bIdx}.desc`}
                                value={bullet.desc}
                              />
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Metrics Header */}
                    {currentPhaseData.metricHeader && (
                      <h4 style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: '#787880',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        marginBottom: '20px',
                        fontFamily: "'Manrope', sans-serif"
                      }}>
                        <EditableText
                          contentKey={`studio.selection_process.items.${heroCarouselIndex}.metricHeader`}
                          value={currentPhaseData.metricHeader}
                        />
                      </h4>
                    )}

                    {/* Metrics Cards Grid */}
                    <div className="metrics-grid">
                      {currentPhaseData.metrics.map((metric, mIdx) => (
                        <div key={mIdx} style={{
                          background: '#F5F5F4',
                          borderRadius: '12px',
                          padding: '20px 24px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            {metric.num && (
                              <div style={{
                                background: '#FFFFFF',
                                border: '1px solid #E2E8F0',
                                borderRadius: '4px',
                                padding: '2px 6px',
                                fontSize: '10px',
                                fontWeight: 700,
                                color: '#787880',
                                fontFamily: "'Manrope', sans-serif"
                              }}>
                                {metric.num}
                              </div>
                            )}
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              color: '#787880',
                              letterSpacing: '0.04em',
                              textTransform: 'uppercase',
                              fontFamily: "'Manrope', sans-serif"
                            }}>
                              <EditableText
                                contentKey={`studio.selection_process.items.${heroCarouselIndex}.metrics.${mIdx}.label`}
                                value={metric.label}
                              />
                            </span>
                          </div>
                          <div style={{
                            fontSize: '1.35rem',
                            fontWeight: 800,
                            color: metric.valueColor || '#0F172A',
                            marginBottom: metric.sub ? '6px' : '0px',
                            fontFamily: "'Manrope', sans-serif",
                            lineHeight: 1.2,
                          }}>
                            <EditableText
                              contentKey={`studio.selection_process.items.${heroCarouselIndex}.metrics.${mIdx}.value`}
                              value={metric.value}
                            />
                          </div>
                          {metric.sub && (
                            <p style={{
                              fontSize: '0.85rem',
                              color: '#64748B',
                              lineHeight: 1.45,
                              margin: 0,
                            }}>
                              <EditableText
                                contentKey={`studio.selection_process.items.${heroCarouselIndex}.metrics.${mIdx}.sub`}
                                value={metric.sub}
                              />
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Divider Line at Bottom */}
                <div className="section-container section-container--flush-y" style={{ paddingTop: '40px' }}>
                  <div style={{
                    maxWidth: '960px',
                    margin: '0 auto',
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(0,90,226,0.1), transparent)',
                  }} />
                </div>

              </div>
            </section>
          );
        })()}


        {/* DIFFERENTIATION */}
        <section id="diff" className="page-section" style={{ backgroundColor: '#EFF6FF' }}>
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
            <div className="section-container">
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div className="hero-eyebrow-pill">
                  <EditableText contentKey="studio.cta.eyebrow" value={studioContent.cta?.eyebrow || "Get Started"} />
                </div>
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
              <Link href="/#idea">
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
