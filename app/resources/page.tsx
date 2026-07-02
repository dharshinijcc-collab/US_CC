'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Blogs from '@/components/blogs';
import { useContent } from '@/context/ContentContext';
import EditableText from '@/components/admin/EditableText';

import localConfig from '@/backend/config.json';

export default function ResourcesPage() {
  const { content, loading, error } = useContent();
  const resourcesContent = content?.resources || (localConfig as any).resources || {};


  const toolsCards = [
    {
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
      title: 'Timeline & Cost Estimator', status: 'ACTIVE', statusColor: '#10B981', statusBg: 'rgba(16, 185, 129, 0.1)',
      desc: "Describe what you want to build and get a rough timeline and cost estimate based on Crestcode's engagement model — broken down by stage and scope.",
      tags: ['Founders', 'Business Owners', 'Free'],
      href: '/build-time-estimator'
    },
    {
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9 12l2 2 4-4" />
          <path d="M12 2a10 10 0 0110 10c0 5.523-4.477 10-10 10S2 17.523 2 12c0-2.4 1.15-4.5 2.93-6" />
        </svg>
      ),
      title: 'Venture Idea Validator', status: 'ACTIVE', statusColor: '#10B981', statusBg: 'rgba(16, 185, 129, 0.1)',
      desc: "Validate your startup idea's market potential, target customer pain score, and investor appeal with our comprehensive assessment framework.",
      tags: ['Founders', 'Idea Stage', 'Free'],
      href: '/founder/idea-validator'
    },
    {
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        </svg>
      ),
      title: 'PRFAQ Template', status: 'COMING SOON', statusColor: '#F59E0B', statusBg: 'rgba(245, 158, 11, 0.1)',
      desc: "A structured Amazon-style PRFAQ template pre-configured for early-stage product thinking. Download, fill in, and bring it to your first Crestcode conversation.",
      tags: ['Founders', 'Template', 'Free']
    },
    {
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 6l-9.5 9.5-5-5L1 18" />
          <path d="M17 6h6v6" />
        </svg>
      ),
      title: 'Investor Readiness Checklist', status: 'COMING SOON', statusColor: '#F59E0B', statusBg: 'rgba(245, 158, 11, 0.1)',
      desc: "A step-by-step checklist covering everything a founder needs before approaching investors — from pitch deck to financials to product demo readiness.",
      tags: ['Founders', 'Pre-raise', 'Free']
    },
    {
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4z" />
          <path d="M8 2v16M16 6v16" />
        </svg>
      ),
      title: 'Product Roadmap Builder', status: 'COMING SOON', statusColor: '#F59E0B', statusBg: 'rgba(245, 158, 11, 0.1)',
      desc: "A lightweight tool to map your product from MLP to V2 — prioritizing features by impact, effort, and user value so you always know what to build next.",
      tags: ['Founders', 'Post-launch', 'Free']
    },
    {
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18M3 10h18M5 6l7-3 7 3" />
          <path d="M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
        </svg>
      ),
      title: 'Studio Investment Calculator', status: 'COMING SOON', statusColor: '#F59E0B', statusBg: 'rgba(245, 158, 11, 0.1)',
      desc: "Model different investment scenarios across Crestcode's two investment paths — visualize projected returns, timelines, and exposure across the portfolio.",
      tags: ['Investors', 'Free']
    }
  ];



  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

        :root {
          --primary-blue: #005AE2;
          --accent-gold: #c5a880;
          --text-black: #020617;
          --text-main: #0F172A;
          --text-muted: #64748B;
          --bg-light: #F8FAFC;
          --bg-grey: #F1F5F9;
          --white: #FFFFFF;
          --border-light: #E2E8F0;
        }

        body, html {
          margin: 0;
          padding: 0;
          background-color: var(--bg-light);
          color: var(--text-black);
          font-family: 'Inter', sans-serif;
          scroll-behavior: smooth;
        }

        h1, h2, h3, h4, h5, h6, .manrope-font {
          font-family: 'Manrope', sans-serif;
        }

        .resources-page {
          min-height: 100vh;
          overflow-x: hidden;
          background-color: #F8FAFC;
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
        .hero-description, .hero-subtitle {
          font-family: 'Inter', sans-serif !important;
          font-size: clamp(0.925rem, 2vw, 0.975rem) !important;
          font-weight: 500 !important;
          color: #64748B !important;
          line-height: 1.8 !important; /* wider line height for premium readability */
          max-width: 720px !important; /* expanded to follow modern web layouts */
          margin: 0 auto 32px !important;
          text-align: center !important;
        }

        /* Centered Header Utilities */
        .header-center {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 24px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* ===== SECTION 2: FEATURED ARTICLE ===== */
        .featured-card {
          background-color: var(--white);
          border: 1px solid var(--border-light);
          border-radius: 24px;
          display: flex;
          overflow: hidden;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          margin-bottom: 60px;
        }
        .featured-card:hover {
          border-color: var(--primary-blue);
          box-shadow: 0 20px 40px -15px rgba(0, 90, 226, 0.15);
        }
        .featured-img-col {
          flex: 1;
          min-height: 350px;
          background: linear-gradient(135deg, rgba(0, 90, 226, 0.05) 0%, rgba(0, 90, 226, 0.1) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          border-right: 1px solid var(--border-light);
        }
        .featured-content-col {
          flex: 1.2;
          padding: 56px 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        @media (max-width: 768px) {
          .featured-card { flex-direction: column; }
          .featured-img-col { min-height: 250px; border-right: none; border-bottom: 1px solid var(--border-light); }
          .featured-content-col { padding: 40px 24px; }
        }
        
        .tag-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .tag-group {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .tag-primary {
          background: rgba(0, 90, 226, 0.1);
          color: var(--primary-blue);
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.05em;
        }
        .tag-secondary {
          border: 1px solid var(--border-light);
          color: var(--text-muted);
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .read-time {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        
        .featured-title {
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 800;
          margin-bottom: 20px;
          line-height: 1.2;
          letter-spacing: -0.02em;
          color: var(--text-main);
        }
        .featured-desc {
          color: var(--text-muted);
          font-size: 1.05rem;
          line-height: 1.6;
          margin-bottom: 32px;
        }

        /* ===== SECTION 3: FILTER BAR ===== */
        .filter-section {
          box-shadow: 0 10px 30px -10px rgba(0, 90, 226, 0.08);
          padding: 24px 0;
          background-color: var(--white);
          position: sticky;
          top: 80px;
          z-index: 50;
        }
        .filter-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 24px;
        }
        .filter-group {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .filter-label {
          color: var(--text-muted);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .filter-pill {
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-muted);
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .filter-pill:hover {
          color: var(--text-main);
        }
        .filter-pill.active {
          background: rgba(0, 90, 226, 0.1);
          color: var(--primary-blue);
        }
        .resource-count {
          color: var(--text-muted);
          font-size: 0.875rem;
          font-weight: 500;
        }

        /* ===== SECTION 4, 5, 6: RESOURCE GRIDS ===== */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
        }

        .res-card {
          background-color: var(--white);
          border: 1px solid var(--border-light);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .res-card:hover {
          transform: translateY(-4px);
          border-color: var(--primary-blue);
          box-shadow: 0 16px 32px rgba(0, 90, 226, 0.05);
        }

        /* Resource Card Interiors */
        
        .card-title {
          font-size: 1.15rem;
          font-weight: 800;
          line-height: 1.3;
          margin-bottom: 8px;
          color: var(--text-main);
        }
        
        .card-desc {
          color: var(--text-muted);
          font-size: 0.85rem;
          line-height: 1.45;
          margin-bottom: 16px;
          flex-grow: 1;
        }
        
        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--border-light);
          padding-top: 24px;
          font-size: 0.875rem;
        }
        .card-author {
          color: var(--text-muted);
          font-weight: 500;
        }
        .card-link {
          color: var(--primary-blue);
          font-weight: 700;
          text-decoration: none;
          transition: color 0.2s;
        }
        .card-link:hover {
          color: #0044a0;
        }

        /* Interactive Tools specific */
        .tool-badge {
          padding: 4px 10px;
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.05em;
        }
        .tool-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: auto;
        }
        .tool-tag {
          border: 1px solid var(--border-light);
          color: var(--text-muted);
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        /* Curated Reading specific */
        .reading-source {
          color: var(--text-muted);
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          margin-bottom: 16px;
        }

        /* Section Titles */
        .section-title {
          font-family: 'Manrope', sans-serif !important;
          font-size: 36px !important;
          font-weight: 800 !important;
          letter-spacing: -0.02em !important;
          margin-bottom: 12px !important;
          line-height: 1.25 !important;
          color: var(--text-main) !important;
          text-align: center !important;
        }
        @media(max-width: 768px) {
          .section-title {
            font-size: 26px !important;
          }
        }
        .section-subtitle {
          font-family: 'Inter', sans-serif !important;
          color: var(--text-muted) !important;
          font-size: clamp(0.9rem, 2vw, 0.95rem) !important;
          line-height: 1.65 !important;
          font-weight: 500 !important;
          max-width: 600px;
          margin: 0 auto 24px !important;
          text-align: center !important;
        }
        .eyebrow-text {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          background-color: #E6EFFF !important;
          color: var(--primary-blue) !important;
          font-weight: 800 !important;
          letter-spacing: 0.15em !important;
          text-transform: uppercase !important;
          font-size: 0.75rem !important;
          padding: 6px 14px !important;
          border-radius: 100px !important;
          margin-bottom: 16px !important;
          font-family: 'Manrope', sans-serif !important;
        }
      `}} />

      <Header />

      <main className="resources-page">
        
        {/* ===== SECTION 1: HERO ===== */}
        <section className="hero-section">
          {/* Top Light Effect */}
          <div style={{ position: 'absolute', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.25), transparent 70%)', top: '-200px', left: '50%', transform: 'translateX(-50%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }}></div>
          <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <div className="hero-eyebrow-pill">
              <EditableText contentKey="resources.hero.eyebrow" value={resourcesContent.hero?.eyebrow || 'RESOURCES'} />
            </div>
            <EditableText
              as="h1"
              contentKey="resources.hero.title"
              value={resourcesContent.hero?.title || 'Everything you need to build\nWith Confidence'}
              className="hero-title"
              style={{ color: '#020617' }}
            >
              {(() => {
                const titleText = resourcesContent.hero?.title || 'Everything you need to build\nWith Confidence';
                const lines = titleText.split('\n');
                return lines.map((line, lineIdx) => {
                  const words = line.split(/[\s\u00a0]+/);
                  return (
                    <React.Fragment key={lineIdx}>
                      {words.map((word: string, index: number) => {
                        if (!word) return null;
                        const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").toUpperCase();
                        const isBlue = ['BUILD', 'CONFIDENCE'].includes(cleanWord);
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
            <p className="hero-description" style={{ marginBottom: '32px', lineHeight: '1.8', maxWidth: '720px' }}>
              <EditableText contentKey="resources.hero.description" value={resourcesContent.hero?.description || 'Guides, tools, and insights for founders and investors — covering how CrestCode works, how the industry is moving, and what it takes to build a product that lasts.'} />
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Link href="/contact" className="btn-primary">
                <EditableText contentKey="resources.hero.buttonText" value={resourcesContent.hero?.buttonText || 'Ask Us Anything'} />
              </Link>
            </div>
          </div>
        </section>

        {/* ===== SECTION 2: INTERACTIVE TOOLS (shown first) ===== */}
        <section style={{ backgroundColor: '#FFFFFF', position: 'relative' }}>
          <div className="section-container">
          <div className="header-center">
            <span className="eyebrow-text">
              <EditableText contentKey="resources.tools.eyebrow" value={resourcesContent.tools?.eyebrow || 'INTERACTIVE TOOLS'} />
            </span>
            <h2 className="section-title manrope-font">
              <EditableText contentKey="resources.tools.title" value={resourcesContent.tools?.title || 'Tools built for builders.'} />
            </h2>
            <p className="section-subtitle">
              <EditableText contentKey="resources.tools.subtitle" value={resourcesContent.tools?.subtitle || 'Practical calculators and frameworks to help you evaluate your idea, estimate timelines, and understand what it takes to build a product with CrestCode.'} />
            </p>
          </div>

          <div className="cards-grid">
            {(() => {
              const cards = resourcesContent.tools?.cards || toolsCards;
              return cards.map((tool, idx) => {
                const href = tool.href || toolsCards[idx]?.href;
                const cardContent = (
                  <div className="res-card" style={{
                    height: '100%',
                    cursor: href ? 'pointer' : 'default',
                    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        background: 'rgba(0, 90, 226, 0.08)',
                        color: 'var(--primary-blue)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: 0,
                        flexShrink: 0
                      }}>
                        {tool.icon || toolsCards[idx]?.icon}
                      </div>
                      <span className="tool-badge" style={{ backgroundColor: tool.statusBg || toolsCards[idx]?.statusBg, color: tool.statusColor || toolsCards[idx]?.statusColor }}>
                        <EditableText
                          contentKey={`resources.tools.cards.${idx}.status`}
                          value={tool.status}
                        />
                      </span>
                    </div>
                    <h3 className="card-title manrope-font">
                      <EditableText
                        contentKey={`resources.tools.cards.${idx}.title`}
                        value={tool.title}
                      />
                    </h3>
                    <p className="card-desc" style={{ marginBottom: '24px' }}>
                      <EditableText
                        contentKey={`resources.tools.cards.${idx}.desc`}
                        value={tool.desc}
                      />
                    </p>
                    <div className="tool-tags">
                      {(tool.tags || toolsCards[idx]?.tags || []).map((tag: string, tagIdx: number) => (
                        <span key={tagIdx} className="tool-tag">
                          <EditableText
                            contentKey={`resources.tools.cards.${idx}.tags.${tagIdx}`}
                            value={tag}
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                );

                if (href) {
                  return (
                    <Link key={idx} href={href} style={{ textDecoration: 'none', color: 'inherit' }} className="res-card-link">
                      {cardContent}
                    </Link>
                  );
                }

                return (
                  <div key={idx} className="res-card-wrapper">
                    {cardContent}
                  </div>
                );
              });
            })()}
          </div>
          </div>
        </section>

        {/* ===== SECTION 3: BLOG COMPONENT (shown after Tools) ===== */}
        <section style={{ backgroundColor: '#EFF6FF', position: 'relative' }}>
          <div className="section-container">
            <Blogs showHero={false} />
          </div>
        </section>



        {/* ===== SECTION 4: FOOTER ===== */}
        <div style={{ borderTop: '1px solid var(--border-dark)' }}>
          <Footer />
        </div>

      </main>
    </>
  );
}
