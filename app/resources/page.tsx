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

  const readingCards = [
    {
      source: 'FIRST ROUND REVIEW', title: 'The 18 Mistakes That Kill Startups',
      desc: "Paul Graham's classic breakdown of why most early-stage companies fail — still one of the most honest reads for any founder.", linkText: 'Read →'
    },
    {
      source: 'A16Z', title: 'The Product-Market Fit Myth',
      desc: "Why PMF isn't a binary milestone — and how founders should think about the signals that actually matter in the early stages.", linkText: 'Read →'
    },
    {
      source: 'GLOBAL STARTUP STUDIO NETWORK', title: 'The State of Venture Studios 2024',
      desc: "Annual research on how studio-built companies are performing relative to traditionally funded startups — key data for investors.", linkText: 'Read →'
    },
    {
      source: "LENNY'S NEWSLETTER", title: 'How the Best Product Teams Operate',
      desc: "A deep look at the rituals, frameworks, and operating principles behind the most effective product teams in the industry.", linkText: 'Read →'
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
          padding: 80px 24px;
        }

        /* Centered Header Utilities */
        .header-center {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 64px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .eyebrow-text {
          color: var(--primary-blue);
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-size: 0.8125rem;
          margin-bottom: 20px;
          font-family: 'Manrope', sans-serif;
        }

        /* ===== SECTION 1: HERO ===== */
        .hero-title {
          font-size: clamp(3rem, 7vw, 5.5rem);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.03em;
          margin-bottom: 32px;
          color: var(--text-black);
        }
        .hero-title span.blue-text {
          color: var(--primary-blue);
        }
        .hero-subtitle {
          font-size: clamp(1.1rem, 2vw, 1.25rem);
          color: var(--text-muted);
          line-height: 1.6;
          font-weight: 500;
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
          border-radius: 20px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .res-card:hover {
          transform: translateY(-6px);
          border-color: var(--primary-blue);
          box-shadow: 0 20px 40px -15px rgba(0, 90, 226, 0.15);
        }

        /* Resource Card Interiors */
        .card-emoji-box {
          font-size: 2.5rem;
          margin-bottom: 32px;
          text-align: center;
          padding: 24px;
          background: var(--bg-grey);
          border-radius: 16px;
        }
        
        .card-title {
          font-size: 1.35rem;
          font-weight: 800;
          line-height: 1.3;
          margin-bottom: 16px;
          color: var(--text-main);
        }
        
        .card-desc {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 32px;
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
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 20px;
          color: var(--text-main);
        }
        .section-subtitle {
          color: var(--text-muted);
          font-size: 1.1rem;
          line-height: 1.6;
        }
      `}} />

      <Header />

      <main className="resources-page pt-32">
        
        {/* ===== SECTION 1: HERO ===== */}
        <section className="section-container" style={{ paddingBottom: '40px' }}>
          <div className="header-center">
            <span className="eyebrow-text">RESOURCES</span>
            <h1 className="hero-title manrope-font">
              Everything you<br />need to <span className="blue-text">build</span><br />
              <span className="blue-text">with confidence</span>
            </h1>
            <p className="hero-subtitle">
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

        {/* ===== SECTION 5: CURATED READING ===== */}
        <section className="section-container" style={{ paddingTop: '40px', paddingBottom: '120px' }}>
          <div className="header-center">
            <span className="eyebrow-text">CURATED READING</span>
            <h2 className="section-title manrope-font">What we're reading.</h2>
            <p className="section-subtitle">
              Industry articles, research, and perspectives that we think every founder and investor should have on their radar.
            </p>
          </div>

          <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            {readingCards.map((read, idx) => (
              <div key={idx} className="res-card" style={{ padding: '32px 24px' }}>
                <div className="reading-source">{read.source}</div>
                <h3 className="card-title manrope-font" style={{ fontSize: '1.25rem' }}>{read.title}</h3>
                <p className="card-desc" style={{ fontSize: '0.9rem' }}>{read.desc}</p>
                <div style={{ marginTop: 'auto' }}>
                  <Link href="#" className="card-link">{read.linkText}</Link>
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
