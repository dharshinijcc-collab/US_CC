'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollStack, { ScrollStackItem } from '@/components/ScrollStack';
import { useContent } from '@/context/ContentContext';
import EditableText from '@/components/admin/EditableText';

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
      style={{ backgroundColor: '#060B18', padding: '80px 48px' }}
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
            <EditableText
              as="h2"
              contentKey="studio.solving.title"
              value={studioContent.solving.title}
              className="section-title title-dark"
              style={{
                textAlign: 'left',
                fontSize: 'clamp(1.9rem, 4vw, 2.6rem)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
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
                      padding: '32px 28px',
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

        .section-container { max-width: 100%; margin: 0 auto; padding: clamp(30px, 4vw, 50px) 160px; }
        @media (max-width: 768px) { .section-container { padding: clamp(40px, 6vw, 80px) 24px; } }
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
          max-width: 600px;
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

        /* Hero Section */
        .hero-section { padding-top: 140px; padding-bottom: 80px; }

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
          max-width: 100%; 
          margin: 48px 32px 0; 
          padding: 0 32px;
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} className="cc-reveal">
                <button className="btn-primary" onClick={() => document.getElementById('methodology-section')?.scrollIntoView({ behavior: 'smooth' })}>
                  <EditableText contentKey="studio.hero.buttonText" value={studioContent.hero.buttonText} />
                </button>
                <button className="btn-primary" onClick={() => window.open('/studio-brochure.pdf', '_blank')}>
                  Download Playbook
                </button>
              </div>
            </div>

            {/* Original hero image */}
            <div className="hero-img-col">
              <div className="hero-img-bg"></div>
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
*/}

        {content?.ourModel && (() => {
          const phaseColors = ['#4F46E5', '#005AE2', '#6366F1', '#8B5CF6', '#A855F7'];
          const phaseDarkColors = ['#3730A3', '#1E40AF', '#4338CA', '#6D28D9', '#7C3AED'];
          const phaseLabels = [
            content.ourModel.selection?.label || 'Phase 01 — Selection Framework',
            content.ourModel.validation?.label || 'Phase 02 — Validation Framework',
            'Phase 03 — Build Framework',
            'Phase 04 — Launch Framework',
            'Phase 05 — Scale Framework',
          ];
          const phaseTitles = [
            content.ourModel.selection?.title || 'Selection Process',
            content.ourModel.validation?.title || 'Validation Process',
            content.ourModel.phases?.items?.[0]?.title || '12-Week Sprint Build',
            content.ourModel.phases?.items?.[1]?.title || 'Go-To-Market Activation',
            content.ourModel.phases?.items?.[2]?.title || 'Scaling for Growth',
          ];
          const phaseDescs = [
            'We run every venture idea through a rigorous four-lens framework before committing a single resource. Ideas are plentiful — the right ones are rare.',
            'No assumptions, no guesses. Every thesis is pressure-tested with real customers before a line of production code is written.',
            'Small autonomous pods. Radical focus. Ship, learn, iterate — nothing else matters in these 84 days.',
            'We launch with precision, not noise. Founder-led, community-first, metrics-gated. Growth is earned before it is amplified.',
            'We scale what is proven. Hiring behind revenue, diversifying channels, hardening infrastructure — in that exact order.',
          ];

          const ac = phaseColors[heroCarouselIndex] || '#3B82F6';
          const acDark = phaseDarkColors[heroCarouselIndex] || '#1d4ed8';

          return (
            <>
              {/* ── STICKY PILL NAV ── */}
              <div style={{
                position: 'sticky', top: 0, zIndex: 100,
                background: '#ffffff',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
              }}>
                <div className="section-container" style={{ paddingTop: 0, paddingBottom: 0 }}>
                  <div style={{
                    display: 'flex', justifyContent: 'center',
                    padding: '20px 0', maxWidth: '800px',
                    margin: '0 auto', alignItems: 'center',
                  }}>
                    {[
                      { n: '01', t: 'SELECT', id: 0 },
                      { n: '02', t: 'VALIDATE', id: 1 },
                      { n: '03', t: 'BUILD', id: 2 },
                      { n: '04', t: 'LAUNCH', id: 3 },
                      { n: '05', t: 'SCALE', id: 4 },
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
                            background: heroCarouselIndex === ph.id ? '#4F46E5' : 
                                      heroCarouselIndex > ph.id ? '#4F46E5' : '#ffffff',
                            color: heroCarouselIndex === ph.id ? '#ffffff' : 
                                   heroCarouselIndex > ph.id ? '#ffffff' : '#64748B',
                            border: heroCarouselIndex === ph.id ? '3px solid #4F46E5' : 
                                   heroCarouselIndex > ph.id ? '3px solid #4F46E5' : '2px solid #E2E8F0',
                            transition: 'all 0.3s ease',
                            boxShadow: heroCarouselIndex === ph.id ? '0 4px 12px rgba(79, 70, 229, 0.3)' : 'none',
                          }}>
                            {heroCarouselIndex > ph.id ? '✓' : ph.n}
                          </div>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            fontFamily: "'Manrope', sans-serif",
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            color: heroCarouselIndex === ph.id ? '#4F46E5' : 
                                   heroCarouselIndex > ph.id ? '#4F46E5' : '#64748B',
                            transition: 'all 0.3s ease',
                          }}>
                            {ph.t}
                          </span>
                        </button>
                        {idx < 4 && (
                          <div style={{
                            flex: 1,
                            height: '2px',
                            background: heroCarouselIndex > idx ? '#4F46E5' : '#E2E8F0',
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

              {/* ── MAIN SECTION ── */}
              <section
                className="phase-section-wrap"
                style={{ padding: '48px 0 56px', position: 'relative', background: '#ffffff', overflow: 'hidden' }}
              >
                {/* Grid background */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `
                    linear-gradient(rgba(79, 70, 229, 0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(79, 70, 229, 0.05) 1px, transparent 1px)
                  `,
                  backgroundSize: '50px 50px',
                  opacity: 1,
                }} />

                {/* Light effect from center */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '800px',
                  height: '800px',
                  background: 'radial-gradient(circle, rgba(79, 70, 229, 0.08) 0%, transparent 70%)',
                  pointerEvents: 'none',
                  zIndex: 0,
                }} />

                <div className="section-container" style={{ position: 'relative', zIndex: 1, background: 'transparent' }}>
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
                        style={{ color: 'rgba(79, 70, 229, 0.08)', left: '0', top: '-20px' }}
                      >
                        {String(heroCarouselIndex + 1).padStart(2, '0')}
                      </div>

                      {/* Tag */}
                      <div
                        key={`tag-${heroCarouselIndex}`}
                        className="phase-tag-anim"
                        style={{
                          fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em',
                          textTransform: 'uppercase', color: '#4F46E5', marginBottom: '12px',
                        }}
                      >
                        {heroCarouselIndex === 0 && <EditableText contentKey="ourModel.selection.label" value={phaseLabels[0]} />}
                        {heroCarouselIndex === 1 && <EditableText contentKey="ourModel.validation.label" value={phaseLabels[1]} />}
                        {heroCarouselIndex === 2 && phaseLabels[2]}
                        {heroCarouselIndex === 3 && phaseLabels[3]}
                        {heroCarouselIndex === 4 && phaseLabels[4]}
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
                        {heroCarouselIndex === 0 && <EditableText contentKey="ourModel.selection.title" value={phaseTitles[0]} />}
                        {heroCarouselIndex === 1 && <EditableText contentKey="ourModel.validation.title" value={phaseTitles[1]} />}
                        {heroCarouselIndex === 2 && <EditableText contentKey="ourModel.phases.items.0.title" value={phaseTitles[2]} />}
                        {heroCarouselIndex === 3 && <EditableText contentKey="ourModel.phases.items.1.title" value={phaseTitles[3]} />}
                        {heroCarouselIndex === 4 && <EditableText contentKey="ourModel.phases.items.2.title" value={phaseTitles[4]} />}
                      </h2>

                      {/* Description with left border */}
                      <p
                        key={`desc-${heroCarouselIndex}`}
                        className="phase-desc-anim"
                        style={{
                          fontSize: '0.95rem',
                          color: '#64748B',
                          lineHeight: 1.6,
                          borderLeft: `3px solid #4F46E5`,
                          paddingLeft: '16px',
                          marginBottom: '24px',
                        }}
                      >
                        {phaseDescs[heroCarouselIndex]}
                      </p>

                      {/* Progress counter */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="counter-bar">
                          <div
                            className="counter-fill"
                            style={{
                              width: `${((heroCarouselIndex + 1) / 5) * 100}%`,
                              background: '#4F46E5',
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
                            e.currentTarget.style.borderColor = '#4F46E5';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.15)';
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
                            background: '#4F46E5',
                            color: '#ffffff',
                            marginBottom: '12px',
                            border: '2px solid #4F46E5',
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
                      {heroCarouselIndex === 1 && (
                        <>
                          {content.ourModel.validation?.steps?.map((step: any, idx: number) => (
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
                                e.currentTarget.style.borderColor = '#4F46E5';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.15)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#E2E8F0';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                            >
                              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', color: '#4F46E5', marginBottom: '8px', opacity: 0.9 }}>
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
                        </>
                      )}

                      {/* Phases 2, 3, 4 — Build / Launch / Scale */}
                      {[2, 3, 4].includes(heroCarouselIndex) && (() => {
                        const ph = content.ourModel.phases?.items?.[heroCarouselIndex - 2];
                        const colors = ['#10B981', '#F59E0B', '#EF4444'];
                        const vKey = ['v1', 'v2', 'v3'][heroCarouselIndex - 2];
                        return (
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
                                e.currentTarget.style.borderColor = '#4F46E5';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.15)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#E2E8F0';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                            >
                              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', color: '#4F46E5', marginBottom: '8px', opacity: 0.9 }}>01</div>
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
                                  e.currentTarget.style.borderColor = '#4F46E5';
                                  e.currentTarget.style.transform = 'translateY(-2px)';
                                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.15)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = '#E2E8F0';
                                  e.currentTarget.style.transform = 'translateY(0)';
                                  e.currentTarget.style.boxShadow = 'none';
                                }}
                              >
                                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', color: '#4F46E5', marginBottom: '8px', opacity: 0.9 }}>
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
                        );
                      })()}

                    </div>
                  </div>
                </div>
              </section>
            </>
          );
        })()}

        {/* ═══════════════════════════════════════════════════ */}
        {/* SECTION D: The Five Pods That Run the Playbook     */}
        {/* ═══════════════════════════════════════════════════ */}
        <section style={{ background: '#ffffff', padding: '24px 0', color: '#0F172A', textAlign: 'center' }}>
          <div className="section-container">
            <h2 style={{ fontFamily: "'Manrope',sans-serif", fontSize: 'clamp(2rem,4vw,2.75rem)', fontWeight: 800, letterSpacing: '-0.02em', color: '#0F172A', marginBottom: 12 }}>
              <EditableText contentKey="ourModel.pods.title" value={content.ourModel.pods.title} />
            </h2>
            <p style={{ color: '#64748B', fontSize: '1.125rem', lineHeight: 1.6, maxWidth: 700, margin: '0 auto 24px' }}>
              <EditableText contentKey="ourModel.pods.subtitle" value={content.ourModel.pods.subtitle} />
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 20 }}>
              {content.ourModel.pods.items.map((pod: any, idx: number) => {
                const colors = ['#3B82F6', '#1E40AF', '#10B981', '#06B6D4', '#14B8A6'];
                return (
                  <div key={idx} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '40px 32px', borderRadius: 24, textAlign: 'left', transition: 'all 0.3s' }} data-mobile-padding="40px 24px">
                    <span style={{ display: 'block', color: colors[idx], fontWeight: 800, fontSize: '0.625rem', letterSpacing: '0.2em', marginBottom: 16 }}>
                      <EditableText contentKey={`ourModel.pods.items.${idx}.id`} value={pod.id} />
                    </span>
                    <h3 style={{ fontFamily: "'Manrope',sans-serif", color: '#0F172A', fontSize: '1.25rem', fontWeight: 800, marginBottom: 16 }}>
                      <EditableText contentKey={`ourModel.pods.items.${idx}.title`} value={pod.title} />
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                      <EditableText contentKey={`ourModel.pods.items.${idx}.desc`} value={pod.desc} />
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>


      <SolvingSection stackCards={stackCards} studioContent={studioContent} EditableText={EditableText} />

      {/* Core Values Section */}
      <section style={{ backgroundColor: '#F8FAFC', padding: '100px 20px', fontFamily: "'Manrope', sans-serif" }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div style={{ width: '100%', height: '400px', backgroundColor: '#CBD5E1', borderRadius: '16px' }}>
            {/* Placeholder for 3D abstract graphic */}
          </div>
          <div>
            <span style={{ color: '#005AE2', fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              <EditableText contentKey="studio.coreValues.missionLabel" value="Our Mission" />
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '20px 0' }}>
              <EditableText contentKey="studio.coreValues.missionTitle" value="Disrupt Industries to Exponentially Improve Customer Experience" />
            </h2>
            <p style={{ color: '#64748B', lineHeight: 1.6 }}>
              <EditableText contentKey="studio.coreValues.missionDesc" value="We build customer-focused digital products through innovation, rapid execution, and scalable technology solutions that create long-term impact. Our studio philosophy merges technical rigor with high-end aesthetic storytelling." />
            </p>
          </div>
        </div>

        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ color: '#005AE2', fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            <EditableText contentKey="studio.coreValues.valuesLabel" value="Our Values" />
          </span>
          <h1 style={{ fontSize: '40px', fontWeight: 800, margin: '20px 0 60px' }}>
            <EditableText contentKey="studio.coreValues.valuesTitle" value="Core Values That Drive Everything We Build" />
          </h1>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {[
              { title: 'Disruptive', desc: 'Unwavering ethical standards in every line of code and business decision we make.', icon: 'shield' },
              { title: 'Obsessed with Customer', desc: 'Pushing the boundaries of what\'s possible through architectural engineering and creative vision.', icon: 'lightbulb' },
              { title: 'Focus on innovation', desc: 'Deep partnership with founders to transform ambitious ideas into category-defining products.', icon: 'users' },
              { title: 'Innovation', desc: 'A relentless pursuit of technical perfection and aesthetic rigor in every project detail.', icon: 'star' },
              { title: 'Trust', desc: 'Radical ownership of outcomes, ensuring we deliver on our promises to partners and users.', icon: 'check-shield' },
            ].map((val, index) => (
              <div key={index} style={{ backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '16px', border: '1px solid #E2E8F0', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
                <div style={{ backgroundColor: '#E0E7FF', width: '40px', height: '40px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '20px', height: '20px', backgroundColor: '#4F46E5', borderRadius: '2px' }}></div>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px' }}>
                  <EditableText contentKey={`studio.coreValues.values.${index}.title`} value={val.title} />
                </h3>
                <p style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.6, zIndex: 1, position: 'relative' }}>
                  <EditableText contentKey={`studio.coreValues.values.${index}.desc`} value={val.desc} />
                </p>
                
                <div style={{ position: 'absolute', right: 0, top: 0, width: '40%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(0, 90, 226, 0.1))', zIndex: 0 }}></div>
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

    </div >
    </>
  );
}
