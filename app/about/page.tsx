'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EditableText from '@/components/admin/EditableText';
import { useContent } from '@/context/ContentContext';
import Link from 'next/link';

export default function AboutPage() {
  const { content, loading, error } = useContent();

  // Helper function to safely get content values
  const getContent = (path: string, defaultValue: string) => {
    const keys = path.split('.');
    let value = content;
    for (const key of keys) {
      if (value && typeof value === 'object') {
        value = value[key];
      } else {
        return defaultValue;
      }
    }
    return value || defaultValue;
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#F3F5F9] font-manrope">Loading company profile...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen bg-[#F3F5F9] font-manrope text-red-500">Error: {error}</div>;

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

        :root {
          /* Color System matching Studio page */
          --primary-blue: #005AE2;
          --accent-blue-tint: #EEF4FF;
          --text-black: #020617;
          --text-main: #0F172A;
          --text-muted: #64748B;
          --bg-light: #F8FAFC;
          --white: #FFFFFF;
          --border-light: #E2E8F0;
        }

        body {
          font-family: 'Inter', sans-serif;
          background-color: var(--white);
          color: var(--text-black);
          margin: 0;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }

        /* Hide scrollbars */
        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; }

        h1, h2, h3, h4, h5, h6 {
          font-family: 'Manrope', sans-serif;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0;
        }


        /* Hero Section */
        .hero-section {
          background-color: #F1F5F9 !important;
        }
        .hero-eyebrow-pill {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          background-color: #E6EFFF !important;
          color: #005AE2 !important;
          font-size: 0.8rem !important;
          font-weight: 800 !important;
          letter-spacing: 0.15em !important;
          padding: 8px 18px !important; /* increased padding */
          border-radius: 100px !important;
          margin-bottom: 32px !important; /* increased spacing */
          text-transform: uppercase !important;
          font-family: 'Manrope', sans-serif !important;
        }
        .hero-title {
          font-family: 'Manrope', sans-serif !important;
          font-size: 52px !important; /* beautifully sized to feel elegant and full without being too large */
          font-weight: 800 !important;
          letter-spacing: -0.04em !important;
          line-height: 1.22 !important; /* increased line-height for elite aesthetic */
          color: #020617 !important;
          margin: 0 auto 28px !important; /* increased spacing below heading */
          text-align: center !important;
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
        .hero-description {
          font-family: 'Inter', sans-serif !important;
          font-size: clamp(0.925rem, 2vw, 0.975rem) !important;
          font-weight: 500 !important;
          color: #64748B !important;
          line-height: 1.8 !important; /* wider line height for premium readability */
          max-width: 720px !important; /* expanded to follow modern web layouts */
          margin: 0 auto 32px !important;
          text-align: center !important;
        }

        /* Centered Headings matching Studio page */
        .section-header-centered {
          text-align: center;
          margin-bottom: 24px;
        }
        .section-header-centered .label {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          background-color: #E6EFFF !important;
          color: #005AE2 !important;
          font-weight: 800 !important;
          letter-spacing: 0.15em !important;
          text-transform: uppercase !important;
          font-size: 0.75rem !important;
          padding: 6px 14px !important;
          border-radius: 100px !important;
          margin-bottom: 16px !important;
          font-family: 'Manrope', sans-serif !important;
        }
        .section-header-centered h2 {
          font-size: 36px !important;
          color: var(--text-black) !important;
          font-weight: 800 !important;
          letter-spacing: -0.02em !important;
          line-height: 1.25 !important;
          max-width: 800px;
          margin: 0 auto 12px;
        }
        @media(max-width: 768px) {
          .section-header-centered h2 {
            font-size: 26px !important;
          }
        }
        .section-header-centered p {
          color: var(--text-muted) !important;
          font-size: clamp(0.9rem, 2vw, 0.95rem) !important;
          line-height: 1.65 !important;
          max-width: 680px;
          margin: 0 auto;
          font-weight: 500 !important;
          font-family: 'Inter', sans-serif !important;
        }

        /* Timeline Styles */
        .timeline-container {
          position: relative;
          padding-left: 48px;
        }
        .timeline-line {
          position: absolute;
          left: 11px;
          top: 8px;
          bottom: 8px;
          width: 2px;
          background: #E2E8F0;
        }
        .timeline-item {
          position: relative;
          margin-bottom: 48px;
        }
        .timeline-item:last-child {
          margin-bottom: 0;
        }
        .timeline-node {
          position: absolute;
          left: -48px;
          top: 2px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--white);
          border: 2px solid var(--primary-blue);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 0 0 6px var(--white);
        }
        .timeline-node-inner {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--primary-blue);
          transition: all 0.3s ease;
        }
        .timeline-item:hover .timeline-node {
          transform: scale(1.1);
          box-shadow: 0 0 0 6px var(--white), 0 4px 12px rgba(0, 90, 226, 0.2);
        }

        /* Cards and Elements */
        .about-card {
          background: var(--white);
          border: 1px solid var(--border-light);
          border-radius: 16px;
          padding: 20px;
          transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .about-card:hover {
          transform: translateY(-4px);
          border-color: var(--primary-blue);
          box-shadow: 0 16px 32px rgba(0, 90, 226, 0.05);
        }

        /* Team Avatar Circle */
        .avatar-circle {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: var(--accent-blue-tint);
          color: var(--primary-blue);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Manrope', sans-serif;
          font-size: 1.20rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          border: 1px solid rgba(0, 90, 226, 0.15);
          margin-bottom: 16px;
          transition: all 0.3s ease;
        }
        .about-card:hover .avatar-circle {
          background: var(--primary-blue);
          color: var(--white);
          border-color: var(--primary-blue);
          box-shadow: 0 8px 16px rgba(0, 90, 226, 0.15);
        }

        /* Buttons matching Studio Page */
        .btn-pill {
          padding: 16px 36px;
          border-radius: 100px;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          text-decoration: none;
          display: inline-block;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 0.95rem;
          border: none;
          cursor: pointer;
        }
        .btn-primary {
          background-color: var(--primary-blue);
          color: var(--white);
          box-shadow: 0 10px 20px -6px rgba(0, 90, 226, 0.3);
        }
        .btn-primary:hover {
          background-color: #004ac2;
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -8px rgba(0, 90, 226, 0.4);
        }
        .btn-secondary {
          background-color: var(--white);
          color: var(--text-black);
          border: 1.5px solid var(--border-light);
        }
        .btn-secondary:hover {
          background: #F8FAFC;
          border-color: var(--primary-blue);
          color: var(--primary-blue);
          transform: translateY(-2px);
        }

        /* Grid setups */
        .grid-2 { display: grid; grid-template-columns: 1fr 1.2fr; gap: 48px; align-items: start; }
        .grid-2-equal { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
        .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }

        @media (max-width: 900px) {
          .grid-2, .grid-2-equal, .grid-3, .grid-4 {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
          .section-container {
            max-width: 1200px;
          }
        }
      `}} />

      <Header />

      <div className="about-page" style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#F8FAFC' }}>

        {/* ── 1. HERO SECTION (Image 1) ── */}
        <section className="hero-section" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Hero Background */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(37,99,235,0.18) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }}></div>
          {/* Hero Grid */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(37,99,235,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.08) 1px, transparent 1px)', backgroundSize: '80px 80px', maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 0%, transparent 80%)', opacity: 0.4, pointerEvents: 'none', zIndex: 0 }}></div>
          {/* Ambient Glows */}
          <div style={{ position: 'absolute', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.25), transparent 70%)', top: '-200px', left: '50%', transform: 'translateX(-50%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }}></div>

          <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <EditableText 
              contentKey="about.hero.eyebrow" 
              value={getContent('about.hero.eyebrow', 'ABOUT THE STUDIO')}
              className="hero-eyebrow-pill"
              as="div"
            />
            <EditableText
              as="h1"
              contentKey="about.hero.title"
              value={getContent('about.hero.title', 'Built on trust \n and the will to execute.')}
              className="hero-title"
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {(() => {
                const headingText = getContent('about.hero.title', 'Built on trust \n and the will to execute.');
                const lines = headingText.includes('\n') ? headingText.split('\n') : [headingText];
                return lines.map((line, lineIdx) => {
                  const words = line.split(/[\s\u00a0]+/);
                  const hasNewlines = headingText.includes('\n');
                  return (
                    <React.Fragment key={lineIdx}>
                      {words.map((word: string, index: number) => {
                        if (!word) return null;
                        const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
                        const cleanWordUpper = cleanWord.toUpperCase();
                        const isBlue = ['TRUST', 'WILL', 'TO', 'EXECUTE'].includes(cleanWordUpper);
                        const isMidpoint = !hasNewlines && index === Math.floor(words.length / 2) - 1;
                        return (
                          <React.Fragment key={index}>
                            <span style={isBlue ? { color: 'var(--primary-blue)' } : {}}>
                              {word}{' '}
                            </span>
                            {isMidpoint && <br />}
                          </React.Fragment>
                        );
                      })}
                      {lineIdx < lines.length - 1 && <br />}
                    </React.Fragment>
                  );
                });
              })()}
            </EditableText>
            <EditableText 
              contentKey="about.hero.description" 
              value={getContent('about.hero.description', 'CrestCode is a venture studio born from a simple observation — identifying a truly great idea is rare, and executing it with conviction is rarer still. We exist to do both.')}
              className="hero-description"
              as="p"
              style={{ marginBottom: '32px', lineHeight: '1.8', maxWidth: '720px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Link href="/contact" className="btn-pill btn-primary">
                <EditableText 
                  contentKey="about.hero.cta" 
                  value={getContent('about.hero.cta', "Let's Build Together")}
                  as="span"
                />
              </Link>
            </div>
          </div>
        </section>

        {/* ── 2. OUR STORY (TIMELINE) (Image 1) ── */}
        <section style={{ backgroundColor: '#FFFFFF', position: 'relative' }}>
          <div className="section-container">
            
            {/* Centered Heading */}
            <div className="section-header-centered">
              <EditableText 
                contentKey="about.story.label" 
                value={getContent('about.story.label', 'OUR STORY')}
                className="label"
                as="span"
              />
              <EditableText 
                contentKey="about.story.title" 
                value={getContent('about.story.title', 'Where it all began.')}
                as="h2"
              />
              <EditableText 
                contentKey="about.story.description" 
                value={getContent('about.story.description', "CrestCode didn't start with a business plan. It started with a conviction - that finding and building the right idea is one of the hardest things a founder can do, and nobody should have to do it without the right partner.")}
                as="p"
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '1.08rem',
                  lineHeight: 1.8,
                  fontWeight: 500,
                  margin: '24px auto 0',
                  maxWidth: '700px'
                }}
              />
            </div>

            {/* Timeline */}
            <div style={{ maxWidth: '900px', margin: '60px auto 0' }}>
              <div style={{ position: 'relative' }}>
                {/* Vertical line */}
                <div style={{
                  position: 'absolute',
                  left: '77px',
                  top: 0,
                  bottom: 0,
                  width: '2px',
                  background: 'rgba(0, 90, 226, 0.2)'
                }}></div>
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                {[
                  {
                    year: getContent('about.timeline.0.year', '2023'),
                    title: getContent('about.timeline.0.title', 'The Seed of an Idea'),
                    desc: getContent('about.timeline.0.desc', 'While working as a Product Manager at Amazon, Asfarul Huda began thinking seriously about the entrepreneur journey. He saw a consistent pattern — founders with genuine ideas struggling to find partners who could actually build. The idea for a product studio that could bridge that gap began to take shape.')
                  },
                  {
                    year: getContent('about.timeline.1.year', '2024'),
                    title: getContent('about.timeline.1.title', 'The First Client — and the First Lesson'),
                    desc: getContent('about.timeline.1.desc', 'Premier Review became CrestCode\'s first client, seeking strategic guidance as an early-stage startup. That engagement crystallized two foundational truths: founders don\'t just need builders — they need someone who will challenge them, hold them accountable, and earn their trust. Those two pillars — execution and trust — became the foundation of everything CrestCode stands for.')
                  },
                  {
                    year: getContent('about.timeline.2.year', '2025'),
                    title: getContent('about.timeline.2.title', 'CrestCode Launches'),
                    desc: getContent('about.timeline.2.desc', 'With a clear model and a founding team in place, CrestCode USA officially launched as a venture studio — offering end-to-end product building for founders and business owners. The mission: be the partner that turns ambitious ideas and real-world problems into products people actually use.')
                  },
                  {
                    year: getContent('about.timeline.3.year', 'TODAY'),
                    title: getContent('about.timeline.3.title', 'Three Products. One Studio. A Growing Portfolio.'),
                    desc: getContent('about.timeline.3.desc', 'CrestCode now has three active products in market — Dockly, OpenCapFi, and Vhoas — alongside strategic partnerships with Premier Review and CastleGEC. The studio is growing its team, its network, and its ambition.')
                  }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', marginBottom: idx === 3 ? '0' : '48px', alignItems: 'flex-start' }}>
                    {/* Left side - Year */}
                    <div style={{ width: '70px', flexShrink: 0, textAlign: 'right', paddingRight: '14px', paddingTop: '2px' }}>
                      <EditableText 
                        contentKey={`about.timeline.${idx}.year`}
                        value={item.year}
                        as="span"
                        style={{
                          color: 'var(--primary-blue)',
                          fontSize: '0.9rem',
                          fontWeight: 800,
                          letterSpacing: '0.05em',
                          fontFamily: "'Manrope', sans-serif"
                        }}
                      />
                    </div>
                    
                    {/* Center - Node on line */}
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: '#005AE2',
                      border: '3px solid #FFFFFF',
                      boxShadow: '0 0 0 3px rgba(0, 90, 226, 0.2)',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}></div>
                    
                    {/* Right side - Content */}
                    <div style={{ flex: 1, paddingLeft: '14px', paddingTop: '2px' }}>
                      <EditableText 
                        contentKey={`about.timeline.${idx}.title`}
                        value={item.title}
                        as="h3"
                        style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '8px' }}
                      />
                      <EditableText 
                        contentKey={`about.timeline.${idx}.desc`}
                        value={item.desc}
                        as="p"
                        style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0, fontWeight: 500 }}
                      />
                    </div>
                  </div>
                ))}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── 3. FOUNDING PILLARS (Image 2) ── */}
        <section style={{ backgroundColor: '#EFF6FF', position: 'relative' }}>
          <div className="section-container">
            
            {/* Centered Heading */}
            <div className="section-header-centered">
              <EditableText 
                contentKey="about.pillars.label" 
                value={getContent('about.pillars.label', 'FOUNDING PILLARS')}
                className="label"
                as="span"
              />
              <EditableText 
                contentKey="about.pillars.title" 
                value={getContent('about.pillars.title', 'Two truths that built this studio.')}
                as="h2"
              />
              <EditableText 
                contentKey="about.pillars.description" 
                value={getContent('about.pillars.description', 'Everything CrestCode does flows from two observations Asfar made before the studio was even named.')}
                as="p"
              />
            </div>

            {/* 2 equal columns cards */}
            <div className="grid-2-equal">
              
              {/* Card 1 */}
              <div className="about-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(0, 90, 226, 0.08)',
                  color: 'var(--primary-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px'
                }}>
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 006 8c0 1 .2 2.2 1.5 3.5.7.8 1.3 1.5 1.5 2.5" />
                    <path d="M9 18h6" />
                    <path d="M10 22h4" />
                  </svg>
                </div>
                <EditableText 
                  contentKey="about.pillars.0.title"
                  value={getContent('about.pillars.0.title', 'A truly great idea is rare — and even harder to recognize.')}
                  as="h3"
                  style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '16px', lineHeight: 1.3 }}
                />
                <EditableText 
                  contentKey="about.pillars.0.description"
                  value={getContent('about.pillars.0.description', 'The real challenge isn\'t coming up with something new. It\'s identifying the ideas that are genuinely worth building — problems with real depth, markets with real demand, and timing that is right. Most people never find that clarity. CrestCode exists to help founders and business owners cut through the noise and build conviction around the ideas that actually deserve to be built.')}
                  as="p"
                  style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.65, margin: 0, fontWeight: 500 }}
                />
              </div>

              {/* Card 2 */}
              <div className="about-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(0, 90, 226, 0.08)',
                  color: 'var(--primary-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px'
                }}>
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 11 2 2 4-4" />
                  </svg>
                </div>
                <EditableText 
                  contentKey="about.pillars.1.title"
                  value={getContent('about.pillars.1.title', 'Trust is the most important currency in any partnership.')}
                  as="h3"
                  style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '16px', lineHeight: 1.3 }}
                />
                <EditableText 
                  contentKey="about.pillars.1.description"
                  value={getContent('about.pillars.1.description', 'Founders share their most vulnerable ideas with their build partners. That relationship only works if the partner earns trust - through honesty, through accountability, and through the willingness to say things that are uncomfortable but true. CrestCode was built with that kind of partnership in mind from day one.')}
                  as="p"
                  style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.65, margin: 0, fontWeight: 500 }}
                />
              </div>

            </div>

          </div>
        </section>

        {/* ── 4. THE TEAM (Image 3) ── */}
        <section style={{ backgroundColor: '#FFFFFF', position: 'relative' }}>
          <div className="section-container">
            
            {/* Centered Heading */}
            <div className="section-header-centered">
              <EditableText 
                contentKey="about.team.label" 
                value={getContent('about.team.label', 'THE TEAM')}
                className="label"
                as="span"
              />
              <EditableText 
                contentKey="about.team.title" 
                value={getContent('about.team.title', 'The people behind the studio.')}
                as="h2"
              />
              <EditableText 
                contentKey="about.team.description" 
                value={getContent('about.team.description', 'A remote-first team of builders, strategists, and operators — united by the belief that great products are built through partnership, not just process.')}
                as="p"
              />
            </div>

            {/* Grid 4 columns */}
            <div className="grid-4">
              {[
                {
                  initials: getContent('about.team.0.initials', 'AH'),
                  name: getContent('about.team.0.name', 'Asfarul Huda'),
                  role: getContent('about.team.0.role', 'CEO & FOUNDER'),
                  bio: getContent('about.team.0.bio', 'Former Amazon Product Manager with a decade of experience building digital products at scale. Founded CrestCode in 2025 with a mission to give every founder access to world-class execution.')
                },
                {
                  initials: getContent('about.team.1.initials', 'AB'),
                  name: getContent('about.team.1.name', 'Adam Braasch'),
                  role: getContent('about.team.1.role', 'PARTNER'),
                  bio: getContent('about.team.1.bio', 'A strategic and operational partner at CrestCode, Adam brings deep expertise in building and scaling early-stage ventures from idea to market.')
                },
                {
                  initials: getContent('about.team.2.initials', 'PC'),
                  name: getContent('about.team.2.name', 'Pranali Choubal'),
                  role: getContent('about.team.2.role', 'PARTNER'),
                  bio: getContent('about.team.2.bio', 'Pranali brings a sharp product and design sensibility to CrestCode, ensuring that every venture we build is not just functional — but genuinely lovable.')
                },
                {
                  initials: getContent('about.team.3.initials', 'AH'),
                  name: getContent('about.team.3.name', 'Amir Hoda'),
                  role: getContent('about.team.3.role', 'PARTNER'),
                  bio: getContent('about.team.3.bio', 'A technical and business partner at CrestCode, Amir focuses on engineering strategy, delivery excellence, and helping ventures scale with confidence.')
                }
              ].map((member, idx) => (
                <div key={idx} className="about-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div className="avatar-circle">
                    <EditableText 
                      contentKey={`about.team.${idx}.initials`}
                      value={member.initials}
                      as="span"
                    />
                  </div>
                  <EditableText 
                    contentKey={`about.team.${idx}.name`}
                    value={member.name}
                    as="h3"
                    style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '4px' }}
                  />
                  <EditableText 
                    contentKey={`about.team.${idx}.role`}
                    value={member.role}
                    as="span"
                    style={{
                      color: 'var(--primary-blue)',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '16px',
                      fontFamily: "'Manrope', sans-serif"
                    }}
                  />
                  <EditableText 
                    contentKey={`about.team.${idx}.bio`}
                    value={member.bio}
                    as="p"
                    style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0, fontWeight: 500 }}
                  />
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── 5. ADVISORS (Image 4) ── */}
        <section style={{ backgroundColor: '#EFF6FF', position: 'relative' }}>
          <div className="section-container">
            
            {/* Centered Heading */}
            <div className="section-header-centered">
              <EditableText 
                contentKey="about.advisors.label" 
                value={getContent('about.advisors.label', 'ADVISORS')}
                className="label"
                as="span"
              />
              <EditableText 
                contentKey="about.advisors.title" 
                value={getContent('about.advisors.title', 'Expert guidance where it matters most.')}
                as="h2"
              />
            </div>

            {/* 2 columns advisors */}
            <div className="grid-2-equal" style={{ maxWidth: '900px', margin: '0 auto' }}>
              {[
                {
                  initials: getContent('about.advisors.0.initials', 'FS'),
                  name: getContent('about.advisors.0.name', 'Fahad Siddiqui'),
                  role: getContent('about.advisors.0.role', 'FINANCE ADVISOR'),
                  bio: getContent('about.advisors.0.bio', 'Advises CrestCode and its ventures on financial strategy, investment structuring, and capital planning.')
                },
                {
                  initials: getContent('about.advisors.1.initials', 'FA'),
                  name: getContent('about.advisors.1.name', 'Dr. Faria Ali'),
                  role: getContent('about.advisors.1.role', 'HEALTHCARE ADVISOR'),
                  bio: getContent('about.advisors.1.bio', 'Brings deep domain expertise in healthcare, guiding CrestCode ventures in health-adjacent product strategy and compliance.')
                }
              ].map((adv, idx) => (
                <div key={idx} className="about-card" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', background: 'var(--white)' }}>
                  <div className="avatar-circle" style={{ margin: 0, flexShrink: 0 }}>
                    <EditableText 
                      contentKey={`about.advisors.${idx}.initials`}
                      value={adv.initials}
                      as="span"
                    />
                  </div>
                  <div>
                    <EditableText 
                      contentKey={`about.advisors.${idx}.name`}
                      value={adv.name}
                      as="h3"
                      style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '4px' }}
                    />
                    <EditableText 
                      contentKey={`about.advisors.${idx}.role`}
                      value={adv.role}
                      as="span"
                      style={{
                        color: 'var(--primary-blue)',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '12px',
                        fontFamily: "'Manrope', sans-serif"
                      }}
                    />
                    <EditableText 
                      contentKey={`about.advisors.${idx}.bio`}
                      value={adv.bio}
                      as="p"
                      style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0, fontWeight: 500 }}
                    />
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── 6. GOVERNANCE MODEL (Image 4) ── */}
        <section style={{ backgroundColor: '#FFFFFF', position: 'relative' }}>
          <div className="section-container">
            
            {/* Centered Heading */}
            <div className="section-header-centered">
              <EditableText 
                contentKey="about.governance.label" 
                value={getContent('about.governance.label', 'GOVERNANCE MODEL')}
                className="label"
                as="span"
              />
              <EditableText 
                contentKey="about.governance.title" 
                value={getContent('about.governance.title', 'How we decide what to build.')}
                as="h2"
              />
              <EditableText 
                contentKey="about.governance.description" 
                value={getContent('about.governance.description', 'CrestCode operates with a structured, transparent governance model — so founders know exactly how ideas are evaluated, what to expect from the process, and how decisions are made at every stage.')}
                as="p"
              />
            </div>

            {/* 3 columns steps */}
            <div className="grid-3">
              {[
                {
                  step: getContent('about.governance.0.step', '01'),
                  title: getContent('about.governance.0.title', 'Monthly Idea Review'),
                  desc: getContent('about.governance.0.desc', 'All ideas submitted through CrestCode are reviewed on a monthly basis by the studio team. We evaluate each submission against our domain expertise, market opportunity, and strategic fit — ensuring every idea gets a genuine assessment, not just a quick pass.')
                },
                {
                  step: getContent('about.governance.1.step', '02'),
                  title: getContent('about.governance.1.title', 'Invitation to a Casual Meeting'),
                  desc: getContent('about.governance.1.desc', 'Ideas that align with CrestCode\'s areas of expertise move to an informal conversation with the founder or business owner. This is low-pressure and exploratory — designed to understand the person behind the idea as much as the idea itself.')
                },
                {
                  step: getContent('about.governance.2.step', '03'),
                  title: getContent('about.governance.2.title', 'Clear Exit Criteria from the Start'),
                  desc: getContent('about.governance.2.desc', 'Before any meeting begins, both parties agree on what success looks like and what would cause either side to walk away. We define exit criteria early — so there are no surprises, no wasted time, and no ambiguity about where things stand.')
                }
              ].map((item, idx) => (
                <div key={idx} className="about-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <EditableText 
                    contentKey={`about.governance.${idx}.step`}
                    value={`STEP ${item.step}`}
                    as="span"
                    style={{
                      color: 'var(--primary-blue)',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '20px',
                      fontFamily: "'Manrope', sans-serif"
                    }}
                  />
                  <EditableText 
                    contentKey={`about.governance.${idx}.title`}
                    value={item.title}
                    as="h3"
                    style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '12px' }}
                  />
                  <EditableText 
                    contentKey={`about.governance.${idx}.desc`}
                    value={item.desc}
                    as="p"
                    style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.65, margin: 0, fontWeight: 500 }}
                  />
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── 7. COMMUNITY & NETWORK (Image 5) ── */}
        <section style={{ backgroundColor: '#EFF6FF', position: 'relative' }}>
          <div className="section-container">
            
            {/* Centered Heading */}
            <div className="section-header-centered">
              <EditableText 
                contentKey="about.community.label" 
                value={getContent('about.community.label', 'COMMUNITY & NETWORK')}
                className="label"
                as="span"
              />
              <EditableText 
                contentKey="about.community.title" 
                value={getContent('about.community.title', 'Building something bigger than a studio.')}
                as="h2"
              />
              <EditableText 
                contentKey="about.community.description" 
                value={getContent('about.community.description', 'CrestCode is more than a product studio — it\'s the foundation for a network of founders, operators, investors, and advisors who believe in building things that last. We\'re actively building this community and looking for the right people to be part of it from the ground up.')}
                as="p"
                style={{ marginBottom: '32px' }}
              />
            </div>

            {/* 3 Cards Auto-balanced Responsive Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {[
                {
                  icon: (
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 00-3-3.87" />
                      <path d="M16 3.13a4 4 0 010 7.75" />
                    </svg>
                  ),
                  title: getContent('about.community.0.title', 'Founders Network'),
                  desc: getContent('about.community.0.desc', 'Connect with other founders in the CrestCode portfolio — share learnings, challenges, and opportunities across ventures.')
                },
                {
                  icon: (
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                    </svg>
                  ),
                  title: getContent('about.community.1.title', 'Investor Circle'),
                  desc: getContent('about.community.1.desc', 'Strategic investors who back CrestCode ventures and play an active role in their growth and adoption.')
                },
                {
                  icon: (
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
                    </svg>
                  ),
                  title: getContent('about.community.2.title', 'Advisor Pool'),
                  desc: getContent('about.community.2.desc', 'Domain experts across finance, healthcare, product, and operations — available to every entrepreneur we work with.')
                }
              ].map((item, idx) => (
                <div key={idx} className="about-card" style={{ background: 'var(--white)', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'rgba(0, 90, 226, 0.08)',
                    color: 'var(--primary-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    flexShrink: 0
                  }}>
                    {item.icon}
                  </div>
                  <EditableText 
                    contentKey={`about.community.${idx}.title`}
                    value={item.title}
                    as="h3"
                    style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '8px' }}
                  />
                  <EditableText 
                    contentKey={`about.community.${idx}.desc`}
                    value={item.desc}
                    as="p"
                    style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0, fontWeight: 500 }}
                  />
                </div>
              ))}
            </div>

          </div>
        </section>

      </div>

      <Footer />
    </>
  );
}
