'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';
import EditableImage from '@/components/pages/admin/EditableImage';
import { 
  Building, Users, TrendingUp, ShieldAlert, Sparkles, Check, X, ArrowLeft, ArrowRight, 
  MapPin, Briefcase, DollarSign, Layers, Globe, Cpu, Ban, History, Sprout, Info, AlertTriangle
} from 'lucide-react';
import CountUp from '@/components/effects/CountUp';




export default function InvestorsPortfolio({ content, getContent }: any) {
  return (
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
  );
}
