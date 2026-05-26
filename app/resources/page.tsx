'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Blogs from '@/components/blogs';

export default function ResourcesPage() {


  const toolsCards = [
    {
      emoji: '💡', title: 'Idea Evaluator', status: 'LIVE', statusColor: '#10B981', statusBg: 'rgba(16, 185, 129, 0.1)',
      desc: "Score your idea across six key dimensions — market size, problem clarity, competition, timing, founder fit, and scalability. Get an honest readiness score in under 5 minutes.",
      tags: ['Founders', 'Pre-build', 'Free']
    },
    {
      emoji: '⏱️', title: 'Timeline & Cost Estimator', status: 'COMING SOON', statusColor: '#F59E0B', statusBg: 'rgba(245, 158, 11, 0.1)',
      desc: "Describe what you want to build and get a rough timeline and cost estimate based on Crestcode's engagement model — broken down by stage and scope.",
      tags: ['Founders', 'Business Owners', 'Free']
    },
    {
      emoji: '📋', title: 'PRFAQ Template', status: 'COMING SOON', statusColor: '#F59E0B', statusBg: 'rgba(245, 158, 11, 0.1)',
      desc: "A structured Amazon-style PRFAQ template pre-configured for early-stage product thinking. Download, fill in, and bring it to your first Crestcode conversation.",
      tags: ['Founders', 'Template', 'Free']
    },
    {
      emoji: '📈', title: 'Investor Readiness Checklist', status: 'COMING SOON', statusColor: '#F59E0B', statusBg: 'rgba(245, 158, 11, 0.1)',
      desc: "A step-by-step checklist covering everything a founder needs before approaching investors — from pitch deck to financials to product demo readiness.",
      tags: ['Founders', 'Pre-raise', 'Free']
    },
    {
      emoji: '🗺️', title: 'Product Roadmap Builder', status: 'COMING SOON', statusColor: '#F59E0B', statusBg: 'rgba(245, 158, 11, 0.1)',
      desc: "A lightweight tool to map your product from MLP to V2 — prioritizing features by impact, effort, and user value so you always know what to build next.",
      tags: ['Founders', 'Post-launch', 'Free']
    },
    {
      emoji: '🏦', title: 'Studio Investment Calculator', status: 'COMING SOON', statusColor: '#F59E0B', statusBg: 'rgba(245, 158, 11, 0.1)',
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
          background-color: var(--bg-light);
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
          font-size: 36px !important;
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
        .hero-description, .hero-subtitle {
          font-family: 'Inter', sans-serif !important;
          font-size: clamp(0.9rem, 2vw, 0.975rem) !important;
          font-weight: 500 !important;
          color: #64748B !important;
          line-height: 1.6 !important;
          max-width: 650px !important;
          margin: 0 auto 24px !important;
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
          border-top: 1px solid var(--border-light);
          border-bottom: 1px solid var(--border-light);
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
        .card-emoji-box {
          font-size: 1.75rem;
          margin-bottom: 16px;
          text-align: center;
          padding: 12px;
          background: var(--bg-grey);
          border-radius: 12px;
        }
        
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
          font-size: clamp(32px, 5vw, 48px) !important;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 12px;
          color: var(--text-main);
        }
        .section-subtitle {
          color: var(--text-muted);
          font-size: clamp(0.85rem, 1.5vw, 0.925rem) !important;
          line-height: 1.6;
        }
      `}} />

      <Header />

      <main className="resources-page">
        
        {/* ===== SECTION 1: HERO ===== */}
        <section className="hero-section" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Ambient Glows */}
          <div style={{ position: 'absolute', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.25), transparent 70%)', top: '-200px', left: '50%', transform: 'translateX(-50%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }}></div>
          <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%)', bottom: '-100px', left: '-50px', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }}></div>
          <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%)', bottom: '-100px', right: '-50px', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }}></div>

          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="hero-eyebrow-pill">RESOURCES</div>
            <h1 className="hero-title" style={{ color: '#020617' }}>
              Everything you<br />need to <span style={{ color: 'var(--primary-blue)' }}>build</span><br />
              with <span style={{ color: 'var(--primary-blue)' }}>confidence</span>
            </h1>
            <p className="hero-description">
              Guides, tools, and insights for founders and investors — covering how CrestCode works, how the industry is moving, and what it takes to build a product that lasts.
            </p>
          </div>
        </section>

        {/* ===== SECTION 3: BLOG COMPONENT ===== */}
        <section className="section-container" style={{ paddingTop: '40px' }}>
          <Blogs showHero={false} />
        </section>

        {/* ===== SECTION 4: INTERACTIVE TOOLS ===== */}
        <section className="section-container" style={{ paddingTop: '40px' }}>
          <div className="header-center">
            <span className="eyebrow-text">INTERACTIVE TOOLS</span>
            <h2 className="section-title manrope-font">Tools built for builders.</h2>
            <p className="section-subtitle">
              Practical calculators and frameworks to help you evaluate your idea, estimate timelines, and understand what it takes to build a product with CrestCode.
            </p>
          </div>

          <div className="cards-grid">
            {toolsCards.map((tool, idx) => (
              <div key={idx} className="res-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                  <div className="card-emoji-box" style={{ margin: 0, padding: '16px', fontSize: '1.8rem' }}>
                    {tool.emoji}
                  </div>
                  <span className="tool-badge" style={{ backgroundColor: tool.statusBg, color: tool.statusColor }}>
                    {tool.status}
                  </span>
                </div>
                <h3 className="card-title manrope-font">{tool.title}</h3>
                <p className="card-desc" style={{ marginBottom: '24px' }}>{tool.desc}</p>
                <div className="tool-tags">
                  {tool.tags.map(tag => (
                    <span key={tag} className="tool-tag">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>



        {/* ===== SECTION 7: FOOTER ===== */}
        <div style={{ borderTop: '1px solid var(--border-dark)' }}>
          <Footer />
        </div>

      </main>
    </>
  );
}
