'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useContent } from '@/context/ContentContext';
import EditableText from '@/components/admin/EditableText';
import Link from 'next/link';
import { API_URL, api } from '@/services/api';
import '@/styles/global-styles.css';

export default function InvestorsPage() {
  const { content, loading, error } = useContent();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    expertise: 'Product Strategy',
    preferredRoles: [] as string[],
    background: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to safely get content values
  const getContent = (path: string, defaultValue: any) => {
    const keys = path.split('.');
    let value: any = content;
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return defaultValue;
      }
    }
    return value !== undefined ? value : defaultValue;
  };

  const handleRoleChange = (role: string) => {
    setFormData(prev => ({
      ...prev,
      preferredRoles: prev.preferredRoles.includes(role)
        ? prev.preferredRoles.filter(r => r !== role)
        : [...prev.preferredRoles, role]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await api.post('/submit-investor', formData);

      if (response.status === 200 || response.status === 201) {
        setSubmitted(true);
        setFormData({
          fullName: '',
          email: '',
          expertise: 'Product Strategy',
          preferredRoles: [],
          background: ''
        });
      } else {
        alert(response.data?.error || 'Submission failed. Please try again.');
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Network error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#F3F5F9] font-manrope">Loading investor relations...</div>;
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
          --accent-gold: #c5a880; /* Elegant gold for 'Built to Last' heading highlight */
          --text-black: #020617;
          --text-main: #0F172A;
          --text-muted: #64748B;
          --bg-light: #F8FAFC;
          --bg-grey: #F1F5F9;
          --white: #FFFFFF;
          --border-light: #E2E8F0;
        }

        body {
          font-family: 'Inter', sans-serif;
          background-color: var(--bg-light);
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
          letter-spacing: 0.1em !important;
          padding: 8px 18px !important;
          border-radius: 100px !important;
          margin-bottom: 32px !important;
          text-transform: uppercase !important;
          font-family: 'Manrope', sans-serif !important;
        }
        .hero-title {
          font-family: 'Manrope', sans-serif !important;
          font-size: 52px !important; /* beautifully sized to feel elegant and full without being too large */
          font-weight: 800 !important;
          letter-spacing: -0.04em !important;
          line-height: 1.22 !important;
          color: #020617 !important;
          margin: 0 auto 28px !important;
          text-align: center !important;
          max-width: 960px !important;
        }
        .hero-title span {
          font-family: 'Manrope', sans-serif !important;
          font-weight: 800 !important;
        }
        .btn-primary {
          display: inline-block !important;
          padding: 16px 36px !important;
          border-radius: 100px !important;
          font-weight: 700 !important;
          font-family: 'Inter', sans-serif !important;
          text-decoration: none !important;
          background-color: var(--primary-blue) !important;
          color: #FFFFFF !important;
          font-size: 0.95rem !important;
          border: none !important;
          cursor: pointer !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          box-shadow: 0 10px 20px -6px rgba(0, 90, 226, 0.3) !important;
        }
        .btn-primary:hover {
          background-color: #004ac2 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 15px 30px -8px rgba(0, 90, 226, 0.4) !important;
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
          line-height: 1.65 !important;
          max-width: 650px !important;
          margin: 0 auto 24px !important;
          text-align: center !important;
        }

        /* Premium Center-Aligned Headings Structure */
        .section-header-centered {
          text-align: center;
          margin-bottom: 24px;
        }
        .section-header-centered .label {
          color: var(--primary-blue) !important;
          font-weight: 800 !important;
          letter-spacing: 0.15em !important;
          text-transform: uppercase !important;
          font-size: 0.75rem !important;
          display: block;
          margin-bottom: 12px;
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

        /* Why Invest Stack Cards */
        .why-invest-card {
          background: var(--white);
          border: 1px solid var(--border-light);
          border-radius: 20px;
          padding: 20px;
          display: flex;
          align-items: flex-start;
          gap: 20px;
          transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .why-invest-card:hover {
          transform: translateY(-5px);
          border-color: var(--primary-blue);
          box-shadow: 0 16px 32px rgba(0, 90, 226, 0.05);
        }

        /* Two Paths Cards */
        .path-card {
          background: var(--white);
          border: 1px solid var(--border-light);
          border-radius: 24px;
          padding: 24px 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .path-card:hover {
          transform: translateY(-6px);
          border-color: var(--primary-blue);
          box-shadow: 0 24px 48px rgba(0, 90, 226, 0.08);
        }

        /* Premium Benefit Cards */
        .benefit-card-new {
          background: var(--white);
          border: 1px solid var(--border-light);
          border-radius: 24px;
          padding: 20px 20px;
          position: relative;
          transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
          z-index: 1;
        }
        .benefit-card-new:hover {
          transform: translateY(-8px) scale(1.01);
          border-color: var(--card-glow);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
        }
        .benefit-badge {
          align-self: flex-start;
          background: #F1F5F9;
          border: 1px solid var(--border-light);
          border-radius: 8px;
          padding: 4px 10px;
          font-family: 'Manrope', sans-serif;
          font-size: 0.72rem;
          font-weight: 800;
          color: #475569;
          margin-bottom: 24px;
          letter-spacing: 0.05em;
        }

        /* Selective Item Checklist */
        .selective-item {
          background: var(--white);
          border: 1px solid var(--border-light);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.01);
        }
        .selective-item:hover {
          transform: translateY(-2px);
          border-color: var(--primary-blue);
          box-shadow: 0 12px 24px rgba(0, 90, 226, 0.04);
        }
        .selective-check {
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #F0F7FF;
          color: var(--primary-blue);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 800;
        }

        /* Clear Terms Cards */
        .term-card {
          background: var(--white);
          border: 1px solid var(--border-light);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          transition: all 0.3s ease;
        }
        .term-card:hover {
          transform: translateY(-4px);
          border-color: var(--primary-blue);
          box-shadow: 0 16px 32px rgba(0, 90, 226, 0.04);
        }
        .term-card h3 {
          font-size: 1.1rem !important;
          margin-bottom: 8px !important;
        }
        .term-card p {
          font-size: 0.85rem !important;
          line-height: 1.5 !important;
        }
        .path-card, .benefit-card-new {
          padding: 20px !important;
          border-radius: 16px !important;
        }

        /* Premium Bottom CTA Strategic Interest Form */
        .form-section-card {
          background: #0A0F1C;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 36px;
          padding: 24px 24px;
          box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.35);
          position: relative;
          overflow: hidden;
        }

        .form-input {
          width: 100%;
          padding: 14px 18px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.04);
          font-size: 0.95rem;
          color: white;
          transition: all 0.25s ease;
          outline: none;
          font-family: 'Inter', sans-serif;
        }
        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }
        .form-input:focus {
          border-color: var(--primary-blue);
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 0 4px rgba(0, 90, 226, 0.15);
        }

        .custom-checkbox {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.25s ease;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.8);
          font-family: 'Inter', sans-serif;
        }
        .custom-checkbox:hover {
          border-color: var(--primary-blue);
          background: rgba(255, 255, 255, 0.06);
        }
        .custom-checkbox input {
          display: none;
        }
        .checkmark {
          width: 18px;
          height: 18px;
          border: 2.2px solid rgba(255, 255, 255, 0.3);
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          background: transparent;
          flex-shrink: 0;
        }
        .custom-checkbox input:checked + .checkmark {
          background: var(--primary-blue);
          border-color: var(--primary-blue);
        }
        .custom-checkbox input:checked + .checkmark::after {
          content: "";
          width: 4px;
          height: 8px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
          margin-bottom: 2px;
        }
        .custom-checkbox:has(input:checked) {
          border-color: var(--primary-blue);
          background: rgba(0, 90, 226, 0.12);
          color: white;
        }

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

        .grid-2 { display: grid; grid-template-columns: 1fr 1.15fr; gap: 48px; align-items: start; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
        .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }

        @media (max-width: 900px) {
          .grid-2, .grid-3, .grid-4 {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .section-container {
            max-width: 1200px;
          }
          .form-section-card {
            padding: 24px 24px !important;
          }
        }
      `}} />

      <Header />

      <div className="investors-page" style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#F8FAFC' }}>

        {/* ── 1. HERO SECTION (Image 1) ── */}
        <section className="hero-section" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Top Light Effect */}
          <div style={{ position: 'absolute', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.25), transparent 70%)', top: '-200px', left: '50%', transform: 'translateX(-50%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }}></div>
          <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="hero-eyebrow-pill">
              <EditableText contentKey="investors.hero.eyebrow" value={content?.investors?.hero?.eyebrow || 'INVESTOR RELATIONS'} />
            </div>
            <EditableText
              as="h1"
              contentKey="investors.hero.titleText"
              value={content?.investors?.hero?.titleText || (content?.investors?.hero?.title1 && content?.investors?.hero?.title2 ? (content.investors.hero.title1 + '\n' + content.investors.hero.title2) : 'Not Just Capital.\nBuild With Us.')}
              className="hero-title"
              style={{ color: '#020617' }}
            >
              {(() => {
                const titleText = content?.investors?.hero?.titleText || (content?.investors?.hero?.title1 && content?.investors?.hero?.title2 ? (content.investors.hero.title1 + '\n' + content.investors.hero.title2) : 'Not Just Capital.\nBuild With Us.');
                const lines = titleText.split('\n');
                return lines.map((line, lineIdx) => {
                  const words = line.split(/[\s\u00a0]+/);
                  return (
                    <React.Fragment key={lineIdx}>
                      {words.map((word: string, index: number) => {
                        if (!word) return null;
                        const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").toUpperCase();
                        const isBlue = ['CAPITAL', 'BUILD', 'US'].includes(cleanWord);
                        return (
                          <span key={index} style={isBlue ? { color: '#005AE2' } : {}}>
                            {word}{' '}
                          </span>
                        );
                      })}
                      {lineIdx < lines.length - 1 && <br />}
                    </React.Fragment>
                  );
                });
              })()}
            </EditableText>
            <p className="hero-description" style={{ marginBottom: '40px', maxWidth: '720px', lineHeight: 1.8, fontSize: 'clamp(1rem, 2vw, 1.125rem)' }}>
              <EditableText contentKey="investors.hero.description" value={content?.investors?.hero?.description || 'CrestCode partners with strategic investors who believe in the long game — backing the studio, the ventures, or both. We offer full transparency, shared conviction, and two clear paths to participate.'} />
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Link href="/contact" className="btn-primary">
                <EditableText contentKey="investors.hero.buttonText" value={content?.investors?.hero?.buttonText || 'Express Your Interest'} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── 2. WHY INVEST IN CRESTCODE? (Image 1) ── */}
        <section style={{ backgroundColor: '#FFFFFF', position: 'relative' }}>
          <div className="section-container">
            
            {/* Centered Heading & Intro Lead */}
            <div className="section-header-centered" style={{ marginBottom: '56px' }}>
              <div className="hero-eyebrow-pill">
                <EditableText contentKey="investors.whyInvest.eyebrow" value={content?.investors?.whyInvest?.eyebrow || 'The Opportunity'} />
              </div>
              <h2>
                <EditableText contentKey="investors.whyInvest.heading" value={getContent('investors.whyInvest.heading', 'Why invest in')} />{' '}<EditableText contentKey="investors.whyInvest.highlight" value={getContent('investors.whyInvest.highlight', 'CrestCode?')} />
              </h2>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '1.15rem',
                lineHeight: 1.75,
                maxWidth: '780px',
                margin: '24px auto 0',
                fontWeight: 500,
                textAlign: 'center'
              }}>
                <EditableText contentKey="investors.whyInvest.description" value={content?.investors?.whyInvest?.description || "We don't just build products — we build ventures with staying power. Every company we back goes through rigorous validation, senior engineering, and a structured go-to-market process. You're not betting on ideas. You're betting on execution."} />
              </p>
            </div>

            {/* Premium 2x2 Balanced Cards Grid */}
            <div className="why-invest-grid" style={{ gap: '24px', alignItems: 'stretch' }}>
              {[
                {
                  title: getContent('investors.whyInvest.0.title', 'Execution-first model'),
                  desc: getContent('investors.whyInvest.0.desc', 'Every venture is built in-house by senior engineers, designers, and product strategists — not outsourced, not staffed with juniors.'),
                  color: '#005AE2',
                  icon: (
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )
                },
                {
                  title: getContent('investors.whyInvest.1.title', 'Validated before built'),
                  desc: getContent('investors.whyInvest.1.desc', 'Every product goes through a rigorous two-week ideation, business case, and PRFAQ process before a single line of code is written.'),
                  color: '#EC4899',
                  icon: (
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                },
                {
                  title: getContent('investors.whyInvest.2.title', 'Full transparency'),
                  desc: getContent('investors.whyInvest.2.desc', "Investors get access to a live dashboard showing where capital is deployed, what's being built, and how each venture is progressing."),
                  color: '#10B981',
                  icon: (
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                    </svg>
                  )
                },
                {
                  title: getContent('investors.whyInvest.3.title', 'Long-term partnership'),
                  desc: getContent('investors.whyInvest.3.desc', "We're not looking for a transaction. We want investors who are aligned with the mission and can contribute beyond capital."),
                  color: '#F59E0B',
                  icon: (
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.407 2.67 1M12 17V7m0 10c-1.11 0-2.08-.407-2.67-1M12 17V7" />
                    </svg>
                  )
                }
              ].map((item, idx) => (
                <div key={idx} className="why-invest-card">
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: `${item.color}10`,
                    border: `1.5px solid ${item.color}25`,
                    color: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '6px' }}>
                      <EditableText contentKey={`investors.whyInvest.${idx}.title`} value={item.title} />
                    </h3>
                    <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                      <EditableText contentKey={`investors.whyInvest.${idx}.desc`} value={item.desc} />
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── 3. TWO WAYS TO INVEST (Image 2) ── */}
        <section style={{ backgroundColor: '#EFF6FF', position: 'relative' }}>
          <div className="section-container">
            
            {/* Centered Heading */}
            <div className="section-header-centered">
              <div className="hero-eyebrow-pill">
                <EditableText contentKey="investors.investmentPaths.eyebrow" value={content?.investors?.investmentPaths?.eyebrow || 'Investment Paths'} />
              </div>
              <h2>
                <EditableText contentKey="investors.investmentPaths.title" value={content?.investors?.investmentPaths?.title || 'Two ways to invest.\nOne shared goal.'} />
              </h2>
              <p>
                <EditableText contentKey="investors.investmentPaths.description" value={content?.investors?.investmentPaths?.description || 'Choose the path that fits your investment thesis — or participate in both. Each path offers distinct exposure, return mechanics, and involvement.'} />
              </p>
            </div>

            {/* Responsive Paths Grid */}
            <div className="paths-two-col-grid" style={{ alignItems: 'stretch' }}>
              
              {/* Path 1 Card */}
              <div className="path-card">
                <div>
                  <span style={{
                    display: 'inline-block',
                    background: '#EEF2F6',
                    border: '1px solid var(--border-light)',
                    color: 'var(--primary-blue)',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    padding: '6px 14px',
                    borderRadius: '100px',
                    marginBottom: '24px'
                  }}>
                    <EditableText contentKey="investors.investmentPaths.0.badge" value={getContent('investors.investmentPaths.0.badge', 'PATH 01')} />
                  </span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '8px' }}>
                    <EditableText contentKey="investors.investmentPaths.0.title" value={getContent('investors.investmentPaths.0.title', 'Invest in CrestCode Studio')} />
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.55, marginBottom: '16px', fontWeight: 500 }}>
                    <EditableText contentKey="investors.investmentPaths.0.description" value={getContent('investors.investmentPaths.0.description', 'Back the studio itself — gaining exposure to every venture CrestCode builds, incubates, or advises. This is a bet on the model, the team, and the portfolio of companies we build over time.')} />
                  </p>
                  
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      getContent('investors.investmentPaths.0.point0', 'Choose between equity stake in CrestCode or a revenue share arrangement'),
                      getContent('investors.investmentPaths.0.point1', 'Exposure across all current and future ventures in the studio portfolio'),
                      getContent('investors.investmentPaths.0.point2', 'Access to the investor dashboard covering studio-wide metrics and deployment'),
                      getContent('investors.investmentPaths.0.point3', 'Quarterly strategic reviews and direct access to CrestCode leadership')
                    ].map((pt, i) => (
                      <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>
                        <span style={{ color: 'var(--primary-blue)', fontWeight: 800, fontSize: '1.1rem', lineHeight: '1' }}>•</span>
                        <EditableText contentKey={`investors.investmentPaths.0.point${i}`} value={pt} />
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{
                  background: 'var(--bg-light)',
                  border: '1px solid var(--border-light)',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  fontSize: '0.825rem',
                  color: '#475569',
                  lineHeight: 1.5,
                  fontWeight: 500
                }}>
                  <strong style={{ color: 'var(--text-black)' }}>Best for:</strong> <EditableText contentKey="investors.investmentPaths.0.bestFor" value={getContent('investors.investmentPaths.0.bestFor', 'Investors who want diversified exposure across multiple ventures and believe in the studio model as a category.')} />
                </div>
              </div>

              {/* Path 2 Card */}
              <div className="path-card">
                <div>
                  <span style={{
                    display: 'inline-block',
                    background: '#FFFBEB',
                    border: '1px solid #FEF3C7',
                    color: '#D97706',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    padding: '6px 14px',
                    borderRadius: '100px',
                    marginBottom: '24px'
                  }}>
                    <EditableText contentKey="investors.investmentPaths.1.badge" value={getContent('investors.investmentPaths.1.badge', 'PATH 02')} />
                  </span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '8px' }}>
                    <EditableText contentKey="investors.investmentPaths.1.title" value={getContent('investors.investmentPaths.1.title', 'Invest in a Specific Venture')} />
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.55, marginBottom: '16px', fontWeight: 500 }}>
                    <EditableText contentKey="investors.investmentPaths.1.description" value={getContent('investors.investmentPaths.1.description', 'Back a specific company in the CrestCode portfolio through a dedicated Special Purpose Vehicle (SPV). Your capital goes directly into one venture — clean, targeted, and legally isolated from the rest of the portfolio.')} />
                  </p>
                  
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      getContent('investors.investmentPaths.1.point0', 'Direct equity in a single venture via a dedicated SPV structure'),
                      getContent('investors.investmentPaths.1.point1', 'Investment isolated per venture — one company\'s performance doesn\'t affect another'),
                      getContent('investors.investmentPaths.1.point2', 'Access to venture-specific dashboard showing build progress, milestones, and financials'),
                      getContent('investors.investmentPaths.1.point3', 'Opportunity to play an active role in product adoption and operations')
                    ].map((pt, i) => (
                      <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>
                        <span style={{ color: '#D97706', fontWeight: 800, fontSize: '1.1rem', lineHeight: '1' }}>•</span>
                        <EditableText contentKey={`investors.investmentPaths.1.point${i}`} value={pt} />
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{
                  background: '#FFFBEB',
                  border: '1px solid #FEF3C7',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  fontSize: '0.825rem',
                  color: '#B45309',
                  lineHeight: 1.5,
                  fontWeight: 500
                }}>
                  <strong style={{ color: '#78350F' }}>Best for:</strong> <EditableText contentKey="investors.investmentPaths.1.bestFor" value={getContent('investors.investmentPaths.1.bestFor', 'Investors with conviction in a specific market, product, or domain — and who want to contribute hands-on to that venture\'s growth.')} />
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ── 4. WHAT YOU GET AS AN INVESTOR (Image 3) ── */}
        <section style={{ backgroundColor: '#FFFFFF', position: 'relative' }}>
          <div className="section-container">
            
            {/* Centered Heading */}
            <div className="section-header-centered">
              <div className="hero-eyebrow-pill">
                <EditableText contentKey="investors.benefits.eyebrow" value={content?.investors?.benefits?.eyebrow || 'Investor Benefits'} />
              </div>
              <h2>
                <EditableText contentKey="investors.benefits.heading" value={getContent('investors.benefits.heading', 'What you get as an')} />{' '}<EditableText contentKey="investors.benefits.highlight" value={getContent('investors.benefits.highlight', 'investor.')} />
              </h2>
              <p>
                <EditableText contentKey="investors.benefits.description" value={content?.investors?.benefits?.description || 'Beyond capital deployment, CrestCode investors get a front-row seat to how ventures are built — with the visibility and access to make that meaningful.'} />
              </p>
            </div>

            {/* 6 Grid Cards */}
            <div className="grid-3">
              {[
                {
                  badge: getContent('investors.benefits.0.badge', '01'),
                  title: getContent('investors.benefits.0.title', 'Live Investor Dashboard'),
                  desc: getContent('investors.benefits.0.desc', 'A dedicated dashboard showing exactly where your capital is deployed, what\'s being built, milestone progress, and key metrics across your investment — updated in real time.'),
                  color: '#3B82F6',
                  icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" /></svg>
                },
                {
                  badge: getContent('investors.benefits.1.badge', '02'),
                  title: getContent('investors.benefits.1.title', 'Full Financial Transparency'),
                  desc: getContent('investors.benefits.1.desc', 'No black boxes. You see how capital is allocated across engineering, design, product, and operations — with clear accountability at every stage of the build.'),
                  color: '#10B981',
                  icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.407 2.67 1M12 17V7m0 10c-1.11 0-2.08-.407-2.67-1M12 17V7" /></svg>
                },
                {
                  badge: getContent('investors.benefits.2.badge', '03'),
                  title: getContent('investors.benefits.2.title', 'Strategic Involvement'),
                  desc: getContent('investors.benefits.2.desc', 'We actively want investors who can open doors, support adoption, and contribute domain expertise. Your network and experience are as valuable to us as your capital.'),
                  color: '#8B5CF6',
                  icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                },
                {
                  badge: getContent('investors.benefits.3.badge', '04'),
                  title: getContent('investors.benefits.3.title', 'Quarterly Reviews'),
                  desc: getContent('investors.benefits.3.desc', 'Structured quarterly sessions with CrestCode leadership covering portfolio performance, upcoming ventures, strategic direction, and your investment position.'),
                  color: '#EC4899',
                  icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                },
                {
                  badge: getContent('investors.benefits.4.badge', '05'),
                  title: getContent('investors.benefits.4.title', 'Early Access to New Ventures'),
                  desc: getContent('investors.benefits.4.desc', 'Studio investors get first visibility into new ventures before they are opened to outside investors — with the option to participate at the earliest stage.'),
                  color: '#F59E0B',
                  icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                },
                {
                  badge: getContent('investors.benefits.5.badge', '06'),
                  title: getContent('investors.benefits.5.title', 'Co-Founder Network Access'),
                  desc: getContent('investors.benefits.5.desc', 'Join a growing network of founders, operators, and builders across the CrestCode portfolio — and help shape the ecosystem we\'re building together.'),
                  color: '#06B6D4',
                  icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                }
              ].map((val, idx) => (
                <div key={idx} className="benefit-card-new" style={{ '--card-glow': val.color } as React.CSSProperties}>

                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: `${val.color}12`,
                    border: `1.5px solid ${val.color}25`,
                    color: val.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '24px'
                  }}>
                    {val.icon}
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '8px' }}>
                    <EditableText contentKey={`investors.benefits.${idx}.title`} value={val.title} />
                  </h3>
 
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                    <EditableText contentKey={`investors.benefits.${idx}.desc`} value={val.desc} />
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── 5. WE'RE SELECTIVE. ON PURPOSE. (Image 4) ── */}
        <section style={{ backgroundColor: '#EFF6FF', position: 'relative' }}>
          <div className="section-container">
            
            {/* Centered Heading */}
            <div className="section-header-centered">
              <div className="hero-eyebrow-pill">
                <EditableText contentKey="investors.selective.eyebrow" value={content?.investors?.selective?.eyebrow || 'Investor Profile'} />
              </div>
              <h2>
                <EditableText contentKey="investors.selective.title" value={content?.investors?.selective?.title || "We're selective.\nOn purpose."} />
              </h2>
            </div>

            {/* Spanning Center-Aligned Description Block */}
            <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 56px' }}>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '1.1rem',
                lineHeight: 1.75,
                fontWeight: 500,
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <EditableText contentKey="investors.selective.description1" value={getContent('investors.selective.description1', 'We prefer investors who bring more than capital. Our ideal partner is aligned with the product, believes in the long-term, and wants to play an active role in helping ventures succeed — whether through their network, domain expertise, or hands-on operational support.')} />
              </p>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '1.1rem',
                lineHeight: 1.75,
                fontWeight: 500,
                margin: 0,
                textAlign: 'center'
              }}>
                <EditableText contentKey="investors.selective.description2" value={getContent('investors.selective.description2', 'Pure financial investors are welcome, but investors who can actively contribute to product adoption, customer introductions, or operations will always be prioritized.')} />
              </p>
            </div>

            {/* 3-Column / Auto-balanced Responsive Trait Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
              marginBottom: '40px'
            }}>
              {[
                {
                  title: getContent('investors.selective.0.title', 'Domain-aligned operators'),
                  desc: getContent('investors.selective.0.desc', 'you understand the market the venture is targeting and can help open doors.')
                },
                {
                  title: getContent('investors.selective.1.title', 'Long-term thinkers'),
                  desc: getContent('investors.selective.1.desc', "you're patient, believe in building real businesses, and aren't looking for a quick exit.")
                },
                {
                  title: getContent('investors.selective.2.title', 'Strategic connectors'),
                  desc: getContent('investors.selective.2.desc', 'you have a network that can accelerate customer acquisition, partnerships, or hiring.')
                },
                {
                  title: getContent('investors.selective.3.title', 'Hands-on contributors'),
                  desc: getContent('investors.selective.3.desc', "you're willing to roll up your sleeves and support a venture in its early stages of operations or adoption.")
                },
                {
                  title: getContent('investors.selective.4.title', 'Transparent communicators'),
                  desc: getContent('investors.selective.4.desc', 'you engage honestly, ask hard questions, and hold us accountable the same way we hold ourselves.')
                }
              ].map((item, idx) => (
                <div key={idx} className="selective-item">
                  <div className="selective-check">✓</div>
                  <div style={{ fontSize: '0.925rem', lineHeight: 1.5, fontWeight: 500, color: '#475569' }}>
                    <strong style={{ color: 'var(--text-black)', display: 'block', marginBottom: '2px', fontWeight: 700 }}>
                      <EditableText contentKey={`investors.selective.${idx}.title`} value={item.title} />
                    </strong>
                    <EditableText contentKey={`investors.selective.${idx}.desc`} value={item.desc} />
                  </div>
                </div>
              ))}
            </div>

            {/* Centered Amber Full-Width Warning Risk Banner */}
            <div style={{
              background: '#FFFBEB',
              border: '1px solid #FEF3C7',
              borderRadius: '16px',
              padding: '24px',
              fontSize: '0.875rem',
              color: '#B45309',
              lineHeight: 1.6,
              fontWeight: 500,
              maxWidth: '820px',
              margin: '32px auto 0',
              textAlign: 'center'
            }}>
              <strong style={{ color: '#78350F' }}>Note:</strong> <EditableText contentKey="investors.selective.note" value={getContent('investors.selective.note', 'CrestCode is an early-stage studio. All investments carry inherent risk. We are committed to full transparency — and we will always tell you the truth about where things stand.')} />
            </div>

          </div>
        </section>

        {/* ── 6. CLEAR TERMS. NO SURPRISES. (Image 5) ── */}
        <section style={{ backgroundColor: '#FFFFFF', position: 'relative' }}>
          <div className="section-container">
            
            {/* Centered Heading */}
            <div className="section-header-centered">
              <div className="hero-eyebrow-pill">
                <EditableText contentKey="investors.terms.eyebrow" value={content?.investors?.terms?.eyebrow || 'Investment Terms'} />
              </div>
              <h2>
                <EditableText contentKey="investors.terms.title" value={content?.investors?.terms?.title || 'Clear terms.\nNo surprises.'} />
              </h2>
            </div>

            {/* 3 Columns Grid */}
            <div className="grid-3" style={{ marginBottom: '40px' }}>
              
              {/* Card 1 */}
              <div className="term-card">
                <div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#D97706', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '24px', fontFamily: "'Manrope', sans-serif" }}>
                    <EditableText contentKey="investors.terms.0.label" value={getContent('investors.terms.0.label', 'MINIMUM INVESTMENT')} />
                  </span>
                  <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '16px', letterSpacing: '-0.02em' }}>
                    <EditableText contentKey="investors.terms.0.value" value={getContent('investors.terms.0.value', '$50K/yr')} />
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.65, margin: 0, fontWeight: 500 }}>
                    <EditableText contentKey="investors.terms.0.description" value={getContent('investors.terms.0.description', 'Minimum annual commitment for both studio-level and venture-specific investments. Flexible structuring available for multi-year commitments.')} />
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="term-card">
                <div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--primary-blue)', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '24px', fontFamily: "'Manrope', sans-serif" }}>
                    <EditableText contentKey="investors.terms.1.label" value={getContent('investors.terms.1.label', 'INVESTMENT HORIZON')} />
                  </span>
                  <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '16px', letterSpacing: '-0.02em' }}>
                    <EditableText contentKey="investors.terms.1.value" value={getContent('investors.terms.1.value', 'Long-term')} />
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.65, margin: 0, fontWeight: 500 }}>
                    <EditableText contentKey="investors.terms.1.description" value={getContent('investors.terms.1.description', 'We build ventures designed to last. We expect investors to share a 5–7 year horizon and believe in compounding value over time — not short-term exits.')} />
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="term-card">
                <div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#8B5CF6', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '24px', fontFamily: "'Manrope', sans-serif" }}>
                    <EditableText contentKey="investors.terms.2.label" value={getContent('investors.terms.2.label', 'RETURN STRUCTURE')} />
                  </span>
                  <h3 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '16px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                    <EditableText contentKey="investors.terms.2.value" value={getContent('investors.terms.2.value', 'Equity or Revenue')} />
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.65, margin: 0, fontWeight: 500 }}>
                    <EditableText contentKey="investors.terms.2.description" value={getContent('investors.terms.2.description', 'Studio investors choose between an equity stake in CrestCode or a revenue share arrangement. Venture-specific investments are equity via SPV.')} />
                  </p>
                </div>
              </div>

            </div>

            {/* Bottom Non-binding Text */}
            <div style={{
              background: 'var(--bg-light)',
              border: '1px solid var(--border-light)',
              borderRadius: '16px',
              padding: '20px 24px',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              fontWeight: 500,
              textAlign: 'center',
              maxWidth: '1200px',
              margin: '0 auto'
            }}>
              <EditableText contentKey="investors.terms.disclaimer" value={getContent('investors.terms.disclaimer', 'Investment terms, legal structure, and formal agreements are subject to negotiation and applicable securities regulations. CrestCode is currently establishing its formal legal investment framework. All terms discussed are indicative and non-binding until a formal agreement is executed.')} />
            </div>

          </div>
        </section>

        {/* ── 7. CTA APPLICATION FORM (Bottom Form) ── */}
        <section id="apply-form" style={{ background: '#EFF6FF' }}>
          <div className="section-container">
            
            <div className="form-section-card">
              <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.15), transparent 70%)', top: '-100px', right: '-100px', filter: 'blur(80px)', pointerEvents: 'none' }}></div>
              <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1), transparent 70%)', bottom: '-100px', left: '-100px', filter: 'blur(80px)', pointerEvents: 'none' }}></div>

              <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div className="hero-eyebrow-pill" style={{ marginBottom: '16px' }}>
                  <EditableText contentKey="investors.form.eyebrow" value={content?.investors?.form?.eyebrow || 'Get Started'} />
                </div>
                <h2 style={{ fontSize: '3rem', color: '#FFFFFF', marginBottom: '16px', letterSpacing: '-0.02em' }}>
                  {submitted ? 'Thank You!' : <EditableText contentKey="investors.form.title" value={content?.investors?.form?.title || 'Register Your Interest'} />}
                </h2>
                {!submitted && (
                  <p style={{ color: 'rgba(255, 255, 255, 0.65)', marginBottom: '48px', fontSize: '1.05rem', fontWeight: 500, lineHeight: 1.6 }}>
                    <EditableText contentKey="investors.form.description" value={content?.investors?.form?.description || 'Complete the briefing form below and our team will get in touch to schedule a private briefing session.'} />
                  </p>
                )}

                {submitted ? (
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    color: '#10B981',
                    padding: '36px',
                    borderRadius: '20px',
                    textAlign: 'center'
                  }}>
                    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ margin: '0 auto 16px auto' }}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <h3 style={{ color: '#FFFFFF', fontSize: '1.4rem', fontWeight: 800, margin: '0 0 8px 0', fontFamily: "'Manrope', sans-serif" }}>Interest Submitted Successfully!</h3>
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.95rem', margin: 0, fontFamily: "'Inter', sans-serif" }}>A CrestCode partner will reach you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                    <div className="form-row-2" style={{ marginBottom: '20px' }}>
                      <div className="form-group">
                        <label style={{ display: 'block', color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.75rem', fontWeight: 800, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Manrope', sans-serif" }}>
                          <EditableText contentKey="investors.form.labelName" value={getContent('investors.form.labelName', 'FULL NAME')} />
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="John Doe"
                          className="form-input"
                          value={formData.fullName}
                          onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.75rem', fontWeight: 800, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Manrope', sans-serif" }}>
                          <EditableText contentKey="investors.form.labelEmail" value={getContent('investors.form.labelEmail', 'EMAIL ADDRESS')} />
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="john@company.com"
                          className="form-input"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="form-row-2" style={{ marginBottom: '24px' }}>
                      <div className="form-group">
                        <label style={{ display: 'block', color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.75rem', fontWeight: 800, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Manrope', sans-serif" }}>
                          <EditableText contentKey="investors.form.labelExpertise" value={getContent('investors.form.labelExpertise', 'PRIMARY EXPERTISE')} />
                        </label>
                        <select
                          className="form-input"
                          style={{ background: '#131926', color: '#FFFFFF', cursor: 'pointer' }}
                          value={formData.expertise}
                          onChange={(e) => setFormData(prev => ({ ...prev, expertise: e.target.value }))}
                        >
                          {['Product Strategy', 'Engineering / Architecture', 'GTM / Sales', 'Finance / M&A', 'Legal / Compliance'].map((opt, i) => (
                            <option key={i} style={{ background: '#0A0F1C' }} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.75rem', fontWeight: 800, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Manrope', sans-serif" }}>
                          <EditableText contentKey="investors.form.labelRole" value={getContent('investors.form.labelRole', 'PREFERRED ENGAGEMENT ROLE')} />
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                          {['Investor Only', 'Strategic Advisor', 'Venture CEO', 'Network Partner'].map((role, idx) => {
                            const isChecked = formData.preferredRoles.includes(role);
                            return (
                              <label key={idx} className="custom-checkbox">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleRoleChange(role)}
                                />
                                <div className="checkmark"></div>
                                <span>{role}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '36px' }}>
                      <label style={{ display: 'block', color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.75rem', fontWeight: 800, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Manrope', sans-serif" }}>
                        <EditableText contentKey="investors.form.labelBackground" value={getContent('investors.form.labelBackground', 'BACKGROUND & CONTEXT')} />
                      </label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Briefly tell us about your investment background and strategic focus..."
                        className="form-input"
                        style={{ resize: 'none' }}
                        value={formData.background}
                        onChange={(e) => setFormData(prev => ({ ...prev, background: e.target.value }))}
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-pill"
                      style={{
                        width: '100%',
                        background: '#FFFFFF',
                        color: '#0A0F1C',
                        padding: '18px',
                        fontWeight: 800,
                        fontSize: '1rem',
                        boxShadow: '0 8px 24px rgba(255,255,255,0.15)',
                        opacity: isSubmitting ? 0.7 : 1,
                        cursor: isSubmitting ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isSubmitting ? <EditableText contentKey="investors.form.buttonSubmitting" value={getContent('investors.form.buttonSubmitting', 'Registering...')} /> : <EditableText contentKey="investors.form.buttonSubmit" value={getContent('investors.form.buttonSubmit', 'Register Strategic Interest')} />}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </section>

      </div>

      <Footer />
    </>
  );
}
