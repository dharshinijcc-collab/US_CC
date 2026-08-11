'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import Blogs from '@/components/pages/blog/Blogs';
import { useContent } from '@/context/ContentContext';
import EditableText from '@/components/pages/admin/EditableText';
import localConfig from '@/shared/config.json';

// ─── Sub-components & Styles ──────────────────────────────────────────────────
import { resourcesStyles } from './styles';

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
      title: 'Timeline & Cost Estimator', status: 'LIVE', statusColor: '#10B981', statusBg: 'rgba(16, 185, 129, 0.1)',
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
      title: 'Venture Idea Validator', status: 'LIVE', statusColor: '#10B981', statusBg: 'rgba(16, 185, 129, 0.1)',
      desc: "Validate your startup idea's market potential, target customer pain score, and investor appeal with our comprehensive assessment framework.",
      tags: ['Founders', 'Idea Stage', 'Free'],
      href: '/founder/idea-validator'
    },
    {
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
          <path d="M12 11h.01M16 11h.01M8 11h.01" />
        </svg>
      ),
      // SOCIAL VALIDATION ENGINE — TEMPORARILY DISABLED (href removed, status set to COMING SOON)
      title: 'Social Validation Engine', status: 'COMING SOON', statusColor: '#F59E0B', statusBg: 'rgba(245, 158, 11, 0.1)',
      desc: "Validate your startup idea's market demand with empirical data scraped from public discussion forums (Reddit, HackerNews, Product Hunt) and competitive gap analysis.",
      tags: ['Founders', 'Social Validation', 'Free'],
      // href: '/resources/social-validation' // DISABLED
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
    }
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: resourcesStyles }} />

      <Header />

      <main className="resources-page">
        {/* ===== SECTION 1: HERO ===== */}
        <section className="hero-section" style={{ position: 'relative', overflow: 'hidden', padding: '128px 0 48px 0' }}>
          <div style={{ position: 'absolute', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.25), transparent 70%)', top: '-200px', left: '50%', transform: 'translateX(-50%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }}></div>
          
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
            
            {/* Eyebrow Pill */}
            <div className="hero-eyebrow-pill" style={{ marginTop: '0px' }}>
              <EditableText contentKey="resources.hero.eyebrow" value={resourcesContent.hero?.eyebrow || 'RESOURCES'} />
            </div>

            {/* Title */}
            <div style={{ width: '100%', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
              <EditableText
                as="h1"
                contentKey="resources.hero.title"
                value={resourcesContent.hero?.title || 'Everything you need to build\nWith Confidence'}
                className="hero-title"
                style={{ color: '#020617', textAlign: 'center', margin: '0 auto 16px', display: 'inline-block' }}
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
            </div>

            {/* Description Paragraph */}
            <div style={{ width: '100%', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
              <EditableText
                as="p"
                contentKey="resources.hero.description"
                value={resourcesContent.hero?.description || 'Guides, tools, and insights for founders and investors — covering how CrestCode works, how the industry is moving, and what it takes to build a product that lasts.'}
                className="hero-description"
                style={{ maxWidth: '720px', margin: '0 auto 40px', textAlign: 'center', lineHeight: 1.8, fontSize: 'clamp(1rem, 2vw, 1.125rem)' }}
              />
            </div>

            {/* Primary CTA Button */}
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <Link href="/contact" className="btn-primary">
                <EditableText contentKey="resources.hero.buttonText" value={resourcesContent.hero?.buttonText || 'Ask Us Anything'} />
              </Link>
            </div>

          </div>
        </section>

        {/* ===== SECTION 2: INTERACTIVE TOOLS ===== */}
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
                const rawCards = resourcesContent.tools?.cards || toolsCards;
                const cards = rawCards
                  .filter((c: any) => !c.title?.toLowerCase().includes('studio investment calculator'))
                  .slice(0, 6);
                
                const sortedCards = [...cards].sort((a, b) => {
                  const statusA = (a.status || '').toUpperCase();
                  const statusB = (b.status || '').toUpperCase();
                  const isLiveA = statusA === 'LIVE' || statusA === 'ACTIVE';
                  const isLiveB = statusB === 'LIVE' || statusB === 'ACTIVE';
                  if (isLiveA && !isLiveB) return -1;
                  if (!isLiveA && isLiveB) return 1;
                  return 0;
                });

                const getStatusStyles = (status: string) => {
                  const normalized = (status || '').toUpperCase();
                  if (normalized === 'LIVE' || normalized === 'ACTIVE') {
                    return { color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' };
                  }
                  return { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' };
                };

                return sortedCards.map((tool, idx) => {
                  const originalCard = toolsCards.find(tc => tc.title.toLowerCase() === tool.title?.toLowerCase()) || toolsCards[idx] || {};
                  // SOCIAL VALIDATION ENGINE — DISABLED: force href to undefined so it's never clickable
                  const rawHref = tool.href || originalCard.href;
                  const href = (tool.title || '').toLowerCase().includes('social validation') ? undefined : rawHref;
                  const statusStyles = getStatusStyles(tool.status);
                  
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
                          {originalCard.icon}
                        </div>
                        <span className="tool-badge" style={{ backgroundColor: statusStyles.bg, color: statusStyles.color }}>
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
                        {(tool.tags || originalCard.tags || []).map((tag: string, tagIdx: number) => (
                          <span key={tagIdx} className="tool-tag">
                            <EditableText
                              contentKey={`resources.tools.cards.${idx}.tags.${tagIdx}`}
                              value={tag}
                            />
                          </span>
                        ))}
                      </div>
                      {href && (
                        <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
                          <span className="btn-tool-cta">
                            <span>Use Tool</span>
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                          </span>
                        </div>
                      )}
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

        {/* ===== SECTION 3: BLOG COMPONENT ===== */}
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
