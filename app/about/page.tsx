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

        .section-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px 24px;
        }

        /* Unified Hero Section Style */
        .hero-section {
          padding: 120px 24px 60px !important;
          text-align: center !important;
          background-color: #FFFFFF !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          min-height: auto !important;
          width: 100% !important;
          position: relative !important;
        }
        @media(max-width: 768px) {
          .hero-section {
            padding: 100px 20px 40px !important;
          }
        }
        .hero-eyebrow-pill {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          background-color: #E6EFFF !important;
          color: #005AE2 !important;
          font-size: 0.72rem !important;
          font-weight: 800 !important;
          letter-spacing: 0.05em !important;
          padding: 6px 14px !important;
          border-radius: 100px !important;
          margin-bottom: 16px !important;
          text-transform: uppercase !important;
          font-family: 'Manrope', sans-serif !important;
        }
        .hero-title {
          font-family: 'Manrope', sans-serif !important;
          font-size: 48px !important;
          font-weight: 800 !important;
          letter-spacing: -0.03em !important;
          line-height: 1.15 !important;
          color: #020617 !important;
          margin: 0 auto 16px !important;
          text-align: center !important;
          max-width: 800px !important;
        }
        @media(max-width: 768px) {
          .hero-title {
            font-size: 32px !important;
          }
        }
        .hero-description {
          font-family: 'Inter', sans-serif !important;
          font-size: clamp(0.9rem, 2vw, 0.975rem) !important;
          font-weight: 500 !important;
          color: #64748B !important;
          line-height: 1.6 !important;
          max-width: 650px !important;
          margin: 0 auto 24px !important;
          text-align: center !important;
        }

        /* Centered Headings matching Studio page */
        .section-header-centered {
          text-align: center;
          margin-bottom: 24px;
        }
        .section-header-centered .label {
          color: var(--primary-blue);
          font-weight: 800;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-size: 0.75rem;
          display: block;
          margin-bottom: 12px;
          font-family: 'Manrope', sans-serif;
        }
        .section-header-centered h2 {
          font-size: clamp(1.5rem, 3vw, 1.85rem) !important;
          color: var(--text-black);
          line-height: 1.25 !important;
          max-width: 800px;
          margin: 0 auto 12px;
        }
        .section-header-centered p {
          color: var(--text-muted);
          font-size: clamp(0.85rem, 1.5vw, 0.925rem) !important;
          line-height: 1.65;
          max-width: 680px;
          margin: 0 auto;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
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
            padding: 60px 20px !important;
          }
        }
      `}} />

      <Header />

      <div className="about-page" style={{ position: 'relative', overflow: 'hidden' }}>

        {/* ── 1. HERO SECTION (Image 1) ── */}
        <section className="hero-section" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Ambient Glows */}
          <div style={{ position: 'absolute', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.08), transparent 70%)', top: '-200px', left: '50%', transform: 'translateX(-50%)', filter: 'blur(100px)', pointerEvents: 'none' }}></div>
          <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.04), transparent 70%)', bottom: '-50px', left: '10%', filter: 'blur(80px)', pointerEvents: 'none' }}></div>

          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="hero-eyebrow-pill">ABOUT THE STUDIO</div>
            <h1 className="hero-title">
              Built on <span style={{ color: 'var(--primary-blue)' }}>trust</span> <br />
              and the <span style={{ color: 'var(--primary-blue)' }}>will to execute</span>.
            </h1>
            <p className="hero-description">
              CrestCode is a venture studio born from a simple observation — identifying a truly great idea is rare, and executing it with conviction is rarer still. We exist to do both.
            </p>
          </div>
        </section>

        {/* ── Divider ── */}
        <div style={{ width: '100%', height: '1px', backgroundColor: 'var(--border-light)' }}></div>

        {/* ── 2. OUR STORY (TIMELINE) (Image 1) ── */}
        <section style={{ backgroundColor: '#FFFFFF', padding: '24px 24px', position: 'relative' }}>
          <div className="section-container" style={{ padding: 0 }}>
            
            {/* Centered Heading */}
            <div className="section-header-centered">
              <span className="label">OUR STORY</span>
              <h2>Where it all began.</h2>
            </div>

            {/* Content columns */}
            <div className="grid-2">
              {/* Left Column Description */}
              <div style={{ position: 'sticky', top: '100px' }}>
                <p style={{
                  color: 'var(--text-muted)',
                  fontSize: '1.08rem',
                  lineHeight: 1.8,
                  fontWeight: 500,
                  margin: 0
                }}>
                  CrestCode didn't start with a business plan. It started with a conviction — that finding and building the right idea is one of the hardest things a founder can do, and nobody should have to do it without the right partner.
                </p>
              </div>

              {/* Right Column Timeline */}
              <div className="timeline-container">
                <div className="timeline-line"></div>
                
                {[
                  {
                    year: '2023',
                    title: 'The Seed of an Idea',
                    desc: 'While working as a Product Manager at Amazon, Asfarul Huda began thinking seriously about the entrepreneur journey. He saw a consistent pattern — founders with genuine ideas struggling to find partners who could actually build. The idea for a product studio that could bridge that gap began to take shape.'
                  },
                  {
                    year: '2024',
                    title: 'The First Client — and the First Lesson',
                    desc: 'Premier Review became CrestCode\'s first client, seeking strategic guidance as an early-stage startup. That engagement crystallized two foundational truths: founders don\'t just need builders — they need someone who will challenge them, hold them accountable, and earn their trust. Those two pillars — execution and trust — became the foundation of everything CrestCode stands for.'
                  },
                  {
                    year: '2025',
                    title: 'CrestCode Launches',
                    desc: 'With a clear model and a founding team in place, CrestCode USA officially launched as a venture studio — offering end-to-end product building for founders and business owners. The mission: be the partner that turns ambitious ideas and real-world problems into products people actually use.'
                  },
                  {
                    year: 'TODAY',
                    title: 'Three Products. One Studio. A Growing Portfolio.',
                    desc: 'CrestCode now has three active products in market — Dockly, OpenCapFi, and Vhoas — alongside strategic partnerships with Premier Review and CastleGEC. The studio is growing its team, its network, and its ambition.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="timeline-item">
                    <div className="timeline-node">
                      <div className="timeline-node-inner"></div>
                    </div>
                    <span style={{
                      color: 'var(--primary-blue)',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      letterSpacing: '0.05em',
                      display: 'block',
                      marginBottom: '6px',
                      fontFamily: "'Manrope', sans-serif"
                    }}>
                      {item.year}
                    </span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '8px' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', lineHeight: 1.65, margin: 0, fontWeight: 500 }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── 3. FOUNDING PILLARS (Image 2) ── */}
        <section style={{ backgroundColor: '#F8FAFC', padding: '24px 24px', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', position: 'relative' }}>
          <div className="section-container" style={{ padding: 0 }}>
            
            {/* Centered Heading */}
            <div className="section-header-centered">
              <span className="label">FOUNDING PILLARS</span>
              <h2>Two truths that built this studio.</h2>
              <p>
                Everything CrestCode does flows from two observations Asfar made before the studio was even named.
              </p>
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
                  marginBottom: '24px',
                  fontSize: '1.25rem'
                }}>
                  ⚡
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '16px', lineHeight: 1.3 }}>
                  A truly great idea is rare — and even harder to recognize.
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.65, margin: 0, fontWeight: 500 }}>
                  The real challenge isn't coming up with something new. It's identifying the ideas that are genuinely worth building — problems with real depth, markets with real demand, and timing that is right. Most people never find that clarity. CrestCode exists to help founders and business owners cut through the noise and build conviction around the ideas that actually deserve to be built.
                </p>
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
                  marginBottom: '24px',
                  fontSize: '1.25rem'
                }}>
                  🤝
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '16px', lineHeight: 1.3 }}>
                  Trust is the most important currency in any partnership.
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.65, margin: 0, fontWeight: 500 }}>
                  Founders share their most vulnerable ideas with their build partners. That relationship only works if the partner earns trust — through honesty, through accountability, and through the willingness to say things that are uncomfortable but true. CrestCode was built with that kind of partnership in mind from day one.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* ── 4. THE TEAM (Image 3) ── */}
        <section style={{ backgroundColor: '#FFFFFF', padding: '24px 24px', position: 'relative' }}>
          <div className="section-container" style={{ padding: 0 }}>
            
            {/* Centered Heading */}
            <div className="section-header-centered">
              <span className="label">THE TEAM</span>
              <h2>The people behind the studio.</h2>
              <p>
                A remote-first team of builders, strategists, and operators — united by the belief that great products are built through partnership, not just process.
              </p>
            </div>

            {/* Grid 4 columns */}
            <div className="grid-4">
              {[
                {
                  initials: 'AH',
                  name: 'Asfarul Huda',
                  role: 'CEO & FOUNDER',
                  bio: 'Former Amazon Product Manager with a decade of experience building digital products at scale. Founded CrestCode in 2025 with a mission to give every founder access to world-class execution.'
                },
                {
                  initials: 'AB',
                  name: 'Adam Braasch',
                  role: 'PARTNER',
                  bio: 'A strategic and operational partner at CrestCode, Adam brings deep expertise in building and scaling early-stage ventures from idea to market.'
                },
                {
                  initials: 'PC',
                  name: 'Pranali Choubal',
                  role: 'PARTNER',
                  bio: 'Pranali brings a sharp product and design sensibility to CrestCode, ensuring that every venture we build is not just functional — but genuinely lovable.'
                },
                {
                  initials: 'AH',
                  name: 'Amir Hoda',
                  role: 'PARTNER',
                  bio: 'A technical and business partner at CrestCode, Amir focuses on engineering strategy, delivery excellence, and helping ventures scale with confidence.'
                }
              ].map((member, idx) => (
                <div key={idx} className="about-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div className="avatar-circle">
                    {member.initials}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '4px' }}>
                    {member.name}
                  </h3>
                  <span style={{
                    color: 'var(--primary-blue)',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '16px',
                    fontFamily: "'Manrope', sans-serif"
                  }}>
                    {member.role}
                  </span>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── 5. ADVISORS (Image 4) ── */}
        <section style={{ backgroundColor: '#F8FAFC', padding: '24px 24px', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', position: 'relative' }}>
          <div className="section-container" style={{ padding: 0 }}>
            
            {/* Centered Heading */}
            <div className="section-header-centered">
              <span className="label">ADVISORS</span>
              <h2>Expert guidance where it matters most.</h2>
            </div>

            {/* 2 columns advisors */}
            <div className="grid-2-equal" style={{ maxWidth: '900px', margin: '0 auto' }}>
              {[
                {
                  initials: 'FS',
                  name: 'Fahad Siddiqui',
                  role: 'FINANCE ADVISOR',
                  bio: 'Advises CrestCode and its ventures on financial strategy, investment structuring, and capital planning.'
                },
                {
                  initials: 'FA',
                  name: 'Dr. Faria Ali',
                  role: 'HEALTHCARE ADVISOR',
                  bio: 'Brings deep domain expertise in healthcare, guiding CrestCode ventures in health-adjacent product strategy and compliance.'
                }
              ].map((adv, idx) => (
                <div key={idx} className="about-card" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', background: 'var(--white)' }}>
                  <div className="avatar-circle" style={{ margin: 0, flexShrink: 0 }}>
                    {adv.initials}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '4px' }}>
                      {adv.name}
                    </h3>
                    <span style={{
                      color: 'var(--primary-blue)',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '12px',
                      fontFamily: "'Manrope', sans-serif"
                    }}>
                      {adv.role}
                    </span>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                      {adv.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── 6. GOVERNANCE MODEL (Image 4) ── */}
        <section style={{ backgroundColor: '#FFFFFF', padding: '24px 24px', position: 'relative' }}>
          <div className="section-container" style={{ padding: 0 }}>
            
            {/* Centered Heading */}
            <div className="section-header-centered">
              <span className="label">GOVERNANCE MODEL</span>
              <h2>How we decide what to build.</h2>
              <p>
                CrestCode operates with a structured, transparent governance model — so founders know exactly how ideas are evaluated, what to expect from the process, and how decisions are made at every stage.
              </p>
            </div>

            {/* 3 columns steps */}
            <div className="grid-3">
              {[
                {
                  step: '01',
                  title: 'Monthly Idea Review',
                  desc: 'All ideas submitted through CrestCode are reviewed on a monthly basis by the studio team. We evaluate each submission against our domain expertise, market opportunity, and strategic fit — ensuring every idea gets a genuine assessment, not just a quick pass.'
                },
                {
                  step: '02',
                  title: 'Invitation to a Casual Meeting',
                  desc: 'Ideas that align with CrestCode\'s areas of expertise move to an informal conversation with the founder or business owner. This is low-pressure and exploratory — designed to understand the person behind the idea as much as the idea itself.'
                },
                {
                  step: '03',
                  title: 'Clear Exit Criteria from the Start',
                  desc: 'Before any meeting begins, both parties agree on what success looks like and what would cause either side to walk away. We define exit criteria early — so there are no surprises, no wasted time, and no ambiguity about where things stand.'
                }
              ].map((item, idx) => (
                <div key={idx} className="about-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <span style={{
                    color: 'var(--primary-blue)',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '20px',
                    fontFamily: "'Manrope', sans-serif"
                  }}>
                    STEP {item.step}
                  </span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '12px' }}>
                    {item.title}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.65, margin: 0, fontWeight: 500 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── 7. COMMUNITY & NETWORK (Image 5) ── */}
        <section style={{ backgroundColor: '#F8FAFC', padding: '24px 24px', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', position: 'relative' }}>
          <div className="section-container" style={{ padding: 0 }}>
            
            {/* Centered Heading */}
            <div className="section-header-centered">
              <span className="label">COMMUNITY & NETWORK</span>
              <h2>Building something bigger than a studio.</h2>
              <p style={{ marginBottom: '32px' }}>
                CrestCode is more than a product studio — it's the foundation for a network of founders, operators, investors, and advisors who believe in building things that last. We're actively building this community and looking for the right people to be part of it from the ground up.
              </p>

              {/* Coming in 2025 Alert Banner */}
              <div style={{
                background: 'rgba(0, 90, 226, 0.05)',
                border: '1px solid rgba(0, 90, 226, 0.15)',
                borderRadius: '16px',
                padding: '18px 24px',
                fontSize: '0.9rem',
                color: 'var(--primary-blue)',
                lineHeight: 1.5,
                fontWeight: 600,
                maxWidth: '820px',
                margin: '0 auto',
                textAlign: 'center'
              }}>
                <strong style={{ color: 'var(--primary-blue)' }}>Coming in 2025:</strong> The CrestCode founder and investor network — a curated community of builders and backers across the CrestCode portfolio. If you want to be part of it early, reach out directly.
              </div>
            </div>

            {/* 4 Cards Auto-balanced Responsive Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px'
            }}>
              {[
                {
                  emoji: '🧑‍💻',
                  title: 'Founders Network',
                  desc: 'Connect with other founders in the CrestCode portfolio — share learnings, challenges, and opportunities across ventures.'
                },
                {
                  emoji: '💼',
                  title: 'Investor Circle',
                  desc: 'Strategic investors who back CrestCode ventures and play an active role in their growth and adoption.'
                },
                {
                  emoji: '🧠',
                  title: 'Advisor Pool',
                  desc: 'Domain experts across finance, healthcare, product, and operations — available to every entrepreneur we work with.'
                },
                {
                  emoji: '🌐',
                  title: 'Remote-First',
                  desc: 'Our team and network operate fully remotely — giving access to the best people regardless of geography.'
                }
              ].map((item, idx) => (
                <div key={idx} className="about-card" style={{ background: 'var(--white)', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ fontSize: '1.75rem', marginBottom: '20px' }}>{item.emoji}</div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '8px' }}>
                    {item.title}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── 8. CALL TO ACTION (WORK WITH US) (Image 5) ── */}
        <section style={{ backgroundColor: '#FFFFFF', padding: '32px 24px', position: 'relative' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <span style={{
              color: 'var(--primary-blue)',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '16px',
              display: 'block',
              fontFamily: "'Manrope', sans-serif"
            }}>
              WORK WITH US
            </span>
            <h2 style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              color: 'var(--text-black)',
              lineHeight: 1.15,
              marginBottom: '24px',
              fontFamily: "'Manrope', sans-serif"
            }}>
              If this sounds like <br />
              the partner you've been <br />
              looking for —
            </h2>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '1.1rem',
              lineHeight: 1.7,
              maxWidth: '600px',
              margin: '0 auto 40px',
              fontWeight: 500,
              fontFamily: "'Inter', sans-serif"
            }}>
              We'd love to hear what you're building. Or what problem you're trying to solve. Either way, let's talk.
            </p>

            {/* Dual Action Buttons */}
            <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
              <Link href="/contact">
                <button className="btn-pill btn-primary">
                  Start a Conversation
                </button>
              </Link>
              <Link href="/studio">
                <button className="btn-pill btn-secondary">
                  See The Studio
                </button>
              </Link>
            </div>
          </div>
        </section>

      </div>

      <Footer />
    </>
  );
}
