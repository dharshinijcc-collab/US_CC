'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import EditableText from '@/components/pages/admin/EditableText';
import { useContent } from '@/context/ContentContext';
import Link from 'next/link';

import type { TeamMember } from '@/types/team.types';

function getInitials(name: string) {
  return name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
}

const defaultTeam: TeamMember[] = [
  {
    id: 'f1',
    name: 'Asfarul Huda',
    role: 'CEO & Founder',
    bio: 'Former Amazon Product Manager with a decade of experience building digital products at scale. Founded CrestCode in 2025 with a mission to give every founder access to world-class execution.',
    category: 'Founder',
    display_order: 1,
    is_active: true,
    image_url: null,
    created_at: '',
    updated_at: ''
  },
  {
    id: 'p1',
    name: 'Adam Braasch',
    role: 'Partner',
    bio: 'A strategic and operational partner at CrestCode, Adam brings deep expertise in building and scaling early-stage ventures from idea to market.',
    category: 'Partner',
    display_order: 2,
    is_active: true,
    image_url: null,
    created_at: '',
    updated_at: ''
  },
  {
    id: 'p2',
    name: 'Pranali Choubal',
    role: 'Partner',
    bio: 'Pranali brings a sharp product and design sensibility to CrestCode, ensuring that every venture we build is not just functional — but genuinely lovable.',
    category: 'Partner',
    display_order: 3,
    is_active: true,
    image_url: null,
    created_at: '',
    updated_at: ''
  },
  {
    id: 'p3',
    name: 'Amir Hoda',
    role: 'Partner',
    bio: 'A technical and business partner at CrestCode, Amir focuses on engineering strategy, delivery excellence, and helping ventures scale with confidence.',
    category: 'Partner',
    display_order: 4,
    is_active: true,
    image_url: null,
    created_at: '',
    updated_at: ''
  },
  {
    id: 'a1',
    name: 'Fahad Siddiqui',
    role: 'Finance Advisor',
    bio: 'Advises CrestCode and its ventures on financial strategy, investment structuring, and capital planning.',
    category: 'Advisor',
    display_order: 5,
    is_active: true,
    image_url: null,
    created_at: '',
    updated_at: ''
  },
  {
    id: 'a2',
    name: 'Dr. Faria Ali',
    role: 'Healthcare Advisor',
    bio: 'Brings deep domain expertise in healthcare, guiding CrestCode ventures in health-adjacent product strategy and compliance.',
    category: 'Advisor',
    display_order: 6,
    is_active: true,
    image_url: null,
    created_at: '',
    updated_at: ''
  }
];

import AboutHero from './AboutHero';
import AboutStory from './AboutStory';
import AboutPillars from './AboutPillars';
import AboutTeam from './AboutTeam';
import AboutAdvisors from './AboutAdvisors';
import AboutGovernance from './AboutGovernance';
import AboutCommunity from './AboutCommunity';

export default function AboutPage() {
  const { content, loading, error } = useContent();

  // ── Dynamic team state ──────────────────────────────────
  const [teamData, setTeamData] = useState<TeamMember[]>([]);
  const [milestonesData, setMilestonesData] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/team')
      .then((r) => r.json())
      .then((json) => {
        if (json.status === 'success') {
          setTeamData(json.payload || []);
        }
      })
      .catch(() => { /* keep empty */ });

    fetch('/api/milestones')
      .then((r) => r.json())
      .then((json) => {
        if (json.status === 'success') {
          setMilestonesData(json.payload || []);
        }
      })
      .catch(() => { /* keep empty */ });
  }, []);

  const activeTeam   = teamData.length > 0 ? teamData : defaultTeam;
  const coreTeam     = activeTeam.filter((m) => m.category !== 'Advisor').sort((a, b) => a.display_order - b.display_order);
  const advisors     = activeTeam.filter((m) => m.category === 'Advisor').sort((a, b) => a.display_order - b.display_order);

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
        <AboutHero getContent={getContent} />

        {/* ── 2. OUR STORY (TIMELINE) (Image 1) ── */}
        <AboutStory getContent={getContent} milestonesData={milestonesData} />

        {/* ── 3. FOUNDING PILLARS (Image 2) ── */}
        <AboutPillars getContent={getContent} />

        {/* ── 4. THE TEAM (Image 3) ── */}
        <AboutTeam coreTeam={coreTeam} getInitials={getInitials} getContent={getContent} />

        {/* ── 5. ADVISORS (Image 4) ── */}
        <AboutAdvisors advisors={advisors} getInitials={getInitials} getContent={getContent} />

        {/* ── 6. GOVERNANCE MODEL (Image 4) ── */}
        <AboutGovernance getContent={getContent} />

        {/* ── 7. COMMUNITY & NETWORK (Image 5) ── */}
        <AboutCommunity getContent={getContent} />

      </div>


      <Footer />
    </>
  );
}
