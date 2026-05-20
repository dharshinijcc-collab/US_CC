'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EditableText from '@/components/admin/EditableText';
import SpotlightCursor from '@/components/effects/SpotlightCursor';
import BorderBeam from '@/components/effects/BorderBeam';
import Link from 'next/link';
import { useContent } from '@/context/ContentContext';
import localConfig from '@/backend/config.json';

// Map categories to modern gradient/glow themes (styling, not content)
const CATEGORY_THEMES: Record<string, { gradient: string; glow: string; text: string }> = {
  'AI/ML': {
    gradient: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
    glow: 'rgba(139, 92, 246, 0.15)',
    text: '#8B5CF6'
  },
  'Fintech': {
    gradient: 'linear-gradient(135deg, #0D9488, #06B6D4)',
    glow: 'rgba(6, 182, 212, 0.15)',
    text: '#0D9488'
  },
  'HealthTech': {
    gradient: 'linear-gradient(135deg, #10B981, #34D399)',
    glow: 'rgba(16, 185, 129, 0.15)',
    text: '#10B981'
  },
  'Enterprise SaaS': {
    gradient: 'linear-gradient(135deg, #F59E0B, #EC4899)',
    glow: 'rgba(236, 72, 153, 0.15)',
    text: '#EC4899'
  }
};

export default function CompanyPage() {
  const { content } = useContent();
  const [activeFilter, setActiveFilter] = useState('All');

  // CMS-driven content with fallback to localConfig
  const companyContent = (content as any)?.company || (localConfig as any).company;
  const homeContent = (content as any)?.home || (localConfig as any).home;

  const categories: string[] = companyContent?.categories || ['All'];
  const companies: any[] = companyContent?.companies || [];

  const filteredCompanies = companies.filter(
    (c: any) => activeFilter === 'All' || c.category === activeFilter
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        /* ===== HERO ===== */
        .company-hero {
          padding: 160px 24px 80px;
          background: #0A0F1C;
          color: white;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .hero-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(0, 90, 226, 0.2), transparent 70%);
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          filter: blur(80px);
          pointer-events: none;
        }
        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 800;
          margin-bottom: 20px;
          letter-spacing: -0.03em;
          line-height: 1.1;
        }
        .hero-subtitle {
          font-size: clamp(1rem, 2.5vw, 1.25rem);
          color: #94A3B8;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* ===== FILTER BAR ===== */
        .filter-bar {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
          padding: 28px 20px;
          background: #F8FAFC;
          border-bottom: 1px solid #E2E8F0;
        }
        .filter-pill {
          padding: 10px 22px;
          border-radius: 100px;
          font-weight: 700;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
          white-space: nowrap;
        }
        .filter-pill.active {
          background: #0A0F1C;
          color: white;
        }
        .filter-pill:not(.active) {
          background: white;
          color: #64748B;
          border-color: #E2E8F0;
        }
        .filter-pill:not(.active):hover {
          color: #0A0F1C;
          border-color: #CBD5E1;
        }

        /* ===== COMPANIES GRID ===== */
        .companies-section {
          background: #FFFFFF;
          padding: 60px 24px 80px;
        }
        .companies-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 28px;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* ===== COMPANY CARD ===== */
        .company-card {
          background: white;
          border-radius: 24px;
          padding: 36px 32px;
          border: 1px solid #E2E8F0;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }
        .company-card:hover {
          transform: translateY(-6px);
          border-color: transparent;
        }
        .c-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }
        .c-logo-avatar {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 1.1rem;
          letter-spacing: -0.02em;
          flex-shrink: 0;
        }
        .c-est-badge {
          background: #F1F5F9;
          color: #64748B;
          padding: 6px 12px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .c-cat {
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 10px;
        }
        .c-name {
          font-size: clamp(1.5rem, 3vw, 1.85rem);
          font-weight: 800;
          color: #0A0F1C;
          margin-bottom: 10px;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        .c-desc {
          color: #475569;
          font-size: 0.9375rem;
          line-height: 1.65;
          margin-bottom: 24px;
          flex-grow: 1;
        }
        .c-tag-list {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }
        .c-tag-badge {
          font-size: 0.75rem;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          color: #64748B;
          padding: 4px 10px;
          border-radius: 8px;
          font-weight: 600;
        }
        .c-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 0.9375rem;
          color: #0A0F1C;
          text-decoration: none;
          transition: color 0.2s;
          margin-top: auto;
        }
        .c-link:hover {
          color: #005AE2;
        }

        /* ===== DARK SECTION (Make Innovation Accessible) ===== */
        .section-dark {
          position: relative;
          background-color: #0A0F1C;
          color: #FFFFFF;
          overflow: hidden;
        }
        .section-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 24px;
        }
        .section-eyebrow {
          color: #005AE2;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-size: clamp(0.6875rem, 1vw, 0.8125rem);
          margin-bottom: 16px;
          font-family: 'Manrope', sans-serif;
        }
        .section-title {
          font-size: clamp(1.75rem, 4vw, 2.75rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: clamp(16px, 3vw, 24px);
          line-height: 1.1;
          font-family: 'Manrope', sans-serif;
        }
        .dark-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          align-items: center;
        }
        .feature-list {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        .feature-item {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }
        .feature-bullet {
          width: 38px;
          height: 38px;
          border-radius: 100px;
          background-color: rgba(37,99,235,0.15);
          border: 2px solid #005AE2;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #005AE2;
          font-weight: 800;
          font-size: 1rem;
        }
        .feature-title {
          font-size: clamp(0.9375rem, 2vw, 1.125rem);
          font-weight: 800;
          margin-bottom: 6px;
          color: #FFFFFF;
          font-family: 'Manrope', sans-serif;
        }
        .feature-desc {
          color: #9CA3AF;
          font-size: clamp(0.875rem, 1.5vw, 1rem);
          line-height: 1.6;
          font-weight: 500;
          font-family: 'Manrope', sans-serif;
        }
        .testimonial-card-dark {
          background-color: #0F172A;
          padding: 40px 36px;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .t-card-quote {
          font-size: clamp(1rem, 2.5vw, 1.35rem);
          font-weight: 600;
          line-height: 1.6;
          margin-bottom: 36px;
          color: #FFFFFF;
        }
        .t-card-author {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .t-avatar {
          width: 46px;
          height: 46px;
          background-color: #334155;
          border-radius: 100px;
          flex-shrink: 0;
        }
        .t-name {
          font-weight: 800;
          font-size: 1rem;
          color: #FFFFFF;
          font-family: 'Manrope', sans-serif;
        }
        .t-role {
          color: #9CA3AF;
          font-size: clamp(0.6875rem, 1vw, 0.8125rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 4px;
          font-family: 'Manrope', sans-serif;
        }

        /* ===== RESPONSIVE: TABLET (max 900px) ===== */
        @media (min-width: 900px) {
          .dark-grid {
            grid-template-columns: 1fr 1fr;
            gap: 64px;
          }
        }

        /* ===== RESPONSIVE: MOBILE (max 768px) ===== */
        @media (max-width: 768px) {
          .company-hero {
            padding: 120px 20px 60px;
          }
          .hero-glow {
            width: 300px;
            height: 300px;
          }
          .filter-bar {
            padding: 20px 16px;
            gap: 8px;
          }
          .filter-pill {
            padding: 8px 16px;
            font-size: 0.8125rem;
          }
          .companies-section {
            padding: 40px 16px 60px;
          }
          .companies-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .company-card {
            padding: 28px 24px;
            border-radius: 20px;
          }
          .c-logo-avatar {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            font-size: 1rem;
          }
          .c-header-row {
            margin-bottom: 16px;
          }
          .c-tag-list {
            margin-bottom: 20px;
          }
          .section-container {
            padding: 64px 20px;
          }
          .testimonial-card-dark {
            padding: 28px 24px;
            border-radius: 20px;
          }
          .t-card-quote {
            margin-bottom: 24px;
          }
          .feature-list {
            gap: 20px;
          }
          .feature-bullet {
            width: 34px;
            height: 34px;
            font-size: 0.875rem;
          }
        }

        /* ===== RESPONSIVE: SMALL MOBILE (max 480px) ===== */
        @media (max-width: 480px) {
          .company-hero {
            padding: 100px 16px 48px;
          }
          .company-card {
            padding: 24px 20px;
          }
          .c-est-badge {
            font-size: 0.6875rem;
            padding: 5px 10px;
          }
          .companies-section {
            padding: 32px 12px 48px;
          }
          .filter-bar {
            padding: 16px 12px;
          }
          .section-container {
            padding: 52px 16px;
          }
        }
      `}} />
      <Header />

      <main>
        {/* HERO */}
        <section className="company-hero bg-dark">
          <SpotlightCursor color="rgba(0, 90, 226, 0.15)" />
          <div className="hero-glow"></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 className="hero-title">
              <EditableText
                contentKey="company.hero.title"
                value={companyContent?.hero?.title || 'Crestcode Portfolio'}
              />
            </h1>
            <p className="hero-subtitle">
              <EditableText
                contentKey="company.hero.subtitle"
                value={companyContent?.hero?.subtitle || 'Explore the portfolio of ventures crafted in our product studio.'}
              />
            </p>
          </div>
        </section>

        {/* FILTER BAR */}
        <section className="filter-bar">
          {categories.map((cat: string, idx: number) => (
            <button
              key={idx}
              className={`filter-pill ${activeFilter === cat ? 'active' : ''}`}
              onClick={() => setActiveFilter(cat)}
            >
              <EditableText
                contentKey={`company.categories.${idx}`}
                value={cat}
              />
            </button>
          ))}
        </section>

        {/* COMPANIES GRID */}
        <section className="companies-section">
          <div className="companies-grid">
            {filteredCompanies.map((company: any, idx: number) => {
              const theme = CATEGORY_THEMES[company.category] || {
                gradient: 'linear-gradient(135deg, #005AE2, #4F46E5)',
                glow: 'rgba(0, 90, 226, 0.15)',
                text: '#005AE2'
              };

              return (
                <div
                  key={idx}
                  className="company-card"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 30px 60px -15px ${theme.glow}`;
                    e.currentTarget.style.borderColor = theme.text;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = '#E2E8F0';
                  }}
                >
                  <div className="c-header-row">
                    <div className="c-logo-avatar" style={{ background: theme.gradient }}>
                      <EditableText
                        contentKey={`company.companies.${idx}.initials`}
                        value={company.initials}
                      />
                    </div>
                    <span className="c-est-badge">
                      <EditableText
                        contentKey={`company.companies.${idx}.est`}
                        value={company.est}
                      />
                    </span>
                  </div>

                  <div className="c-cat" style={{ color: theme.text }}>
                    <EditableText
                      contentKey={`company.companies.${idx}.category`}
                      value={company.category}
                    />
                  </div>

                  <h3 className="c-name">
                    <EditableText
                      contentKey={`company.companies.${idx}.name`}
                      value={company.name}
                    />
                  </h3>

                  <p className="c-desc">
                    <EditableText
                      contentKey={`company.companies.${idx}.desc`}
                      value={company.desc}
                    />
                  </p>

                  <div className="c-tag-list">
                    {(company.tags || []).map((tag: string, tIdx: number) => (
                      <span key={tIdx} className="c-tag-badge">
                        <EditableText
                          contentKey={`company.companies.${idx}.tags.${tIdx}`}
                          value={tag}
                        />
                      </span>
                    ))}
                  </div>

                  <Link href={company.link || '#'} className="c-link">
                    Visit Website
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* Dark Section: Make Innovation Accessible */}
        <section className="section-dark" style={{ position: 'relative' }}>
          <SpotlightCursor color="rgba(0, 90, 226, 0.15)" />
          <div className="section-container" style={{ position: 'relative', zIndex: 1 }}>
            <div className="dark-grid">
              <div className="dark-content">
                <EditableText
                  as="h3"
                  contentKey="home.partnership.eyebrow"
                  value={homeContent?.partnership?.eyebrow || 'WE AS CO-FOUNDERS'}
                  className="section-eyebrow"
                />
                <EditableText
                  as="h2"
                  contentKey="home.partnership.title"
                  value={homeContent?.partnership?.title || 'Make Innovation Accessible.'}
                  className="section-title text-white"
                />
                <div className="feature-list">
                  {(homeContent?.partnership?.features || []).map((feature: any, idx: number) => (
                    <div key={idx} className="feature-item">
                      <div className="feature-bullet">&#x2713;</div>
                      <div>
                        <EditableText
                          as="h4"
                          contentKey={`home.partnership.features.${idx}.title`}
                          value={feature.title}
                          className="feature-title"
                        />
                        <EditableText
                          as="p"
                          contentKey={`home.partnership.features.${idx}.description`}
                          value={feature.description}
                          className="feature-desc"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <BorderBeam className="testimonial-card-dark cc-reveal cc-delay-2 cc-card-3d cc-card-3d-dark cc-shine" style={{ padding: 0 }}>
                <div style={{ padding: '32px', height: '100%' }}>
                  <EditableText
                    as="p"
                    contentKey="home.partnership.testimonial.quote"
                    value={homeContent?.partnership?.testimonial?.quote || ''}
                    className="t-card-quote"
                  />
                  <div className="t-card-author">
                    <div className="t-avatar"></div>
                    <div>
                      <EditableText
                        contentKey="home.partnership.testimonial.author"
                        value={homeContent?.partnership?.testimonial?.author || ''}
                        className="t-name"
                      />
                      <EditableText
                        contentKey="home.partnership.testimonial.role"
                        value={homeContent?.partnership?.testimonial?.role || ''}
                        className="t-role"
                      />
                    </div>
                  </div>
                </div>
              </BorderBeam>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
