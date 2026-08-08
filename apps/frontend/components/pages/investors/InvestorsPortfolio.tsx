'use client';
import React from 'react';
import EditableText from '@/components/pages/admin/EditableText';
import { Building, Briefcase } from 'lucide-react';

export default function InvestorsPortfolio({ content, getContent }: any) {
  return (
    <section className="page-section" style={{ backgroundColor: '#F8FAFC', paddingTop: '24px', paddingBottom: '24px', position: 'relative' }}>
      <div className="section-container" style={{ maxWidth: '1180px', margin: '0 auto' }}>
        
        {/* Centered Heading */}
        <div className="section-header-centered" style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="hero-eyebrow-pill" style={{ display: 'inline-block', background: '#E6EFFF', color: '#005AE2', fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '6px 16px', borderRadius: '100px', marginBottom: '14px' }}>
            <EditableText contentKey="investors.investmentPaths.eyebrow" value={content?.investors?.investmentPaths?.eyebrow || 'Investment Paths'} />
          </div>
          <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 'clamp(2rem, 4vw, 2.6rem)', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', margin: '0 auto 12px', lineHeight: 1.2 }}>
            <EditableText contentKey="investors.investmentPaths.title" value={content?.investors?.investmentPaths?.title || 'Two ways to invest.\nOne shared goal.'} />
          </h2>
          <p style={{ color: '#64748B', fontSize: '1rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.65, fontWeight: 500 }}>
            <EditableText contentKey="investors.investmentPaths.description" value={content?.investors?.investmentPaths?.description || 'Choose the path that fits your investment thesis — or participate in both. Each path offers distinct exposure, return mechanics, and involvement.'} />
          </p>
        </div>

        {/* Stacked Cards Grid matching the Reference Design */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '48px', alignItems: 'stretch' }}>
          
          {/* ── CARD 01: Invest in CrestCode Studio (Mild Light Blue Theme) ── */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>

            {/* Back Accent Panel — Mild Light Blue Pastel */}
            <div style={{
              position: 'absolute',
              left: '0',
              top: '20px',
              bottom: '20px',
              width: '180px',
              background: 'linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 100%)',
              border: '1.5px solid #BFDBFE',
              borderRadius: '20px',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 8px 24px rgba(0, 90, 226, 0.08)',
              zIndex: 1
            }}>
              <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#005AE2', lineHeight: 1, fontFamily: "'Inter', sans-serif" }}>
                01
              </div>
              <div style={{ color: '#005AE2' }}>
                <Building size={34} strokeWidth={2} />
              </div>
            </div>

            {/* Front Overlapping Card */}
            <div style={{
              position: 'relative',
              zIndex: 2,
              marginLeft: '88px',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 12px 32px rgba(15, 23, 42, 0.06)',
              padding: '32px 28px 28px 28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              flex: 1
            }}>
              <div>
                {/* Top Rounded Pill Header — Mild Soft Blue */}
                <div style={{
                  background: 'linear-gradient(135deg, #EBF3FF 0%, #EFF6FF 100%)',
                  border: '1px solid #BFDBFE',
                  borderRadius: '12px',
                  padding: '14px 20px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#005AE2' }}>
                    <EditableText contentKey="investors.investmentPaths.0.badge" value={getContent('investors.investmentPaths.0.badge', 'PATH 01')} />
                  </span>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', margin: 0, fontFamily: "'Inter', sans-serif" }}>
                    <EditableText contentKey="investors.investmentPaths.0.title" value={getContent('investors.investmentPaths.0.title', 'Invest in CrestCode Studio')} />
                  </h3>
                </div>

                {/* Description */}
                <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '20px', fontWeight: 500 }}>
                  <EditableText contentKey="investors.investmentPaths.0.description" value={getContent('investors.investmentPaths.0.description', 'Back the studio itself — gaining exposure to every venture CrestCode builds, incubates, or advises. This is a bet on the model, the team, and the portfolio of companies we build over time.')} />
                </p>
                
                {/* Bullet Points */}
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    getContent('investors.investmentPaths.0.point0', 'Choose between equity stake in CrestCode or a revenue share arrangement'),
                    getContent('investors.investmentPaths.0.point1', 'Exposure across all current and future ventures in the studio portfolio'),
                    getContent('investors.investmentPaths.0.point2', 'Access to the investor dashboard covering studio-wide metrics and deployment'),
                    getContent('investors.investmentPaths.0.point3', 'Quarterly strategic reviews and direct access to CrestCode leadership')
                  ].map((pt, i) => (
                    <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '0.86rem', color: '#334155', fontWeight: 500, lineHeight: 1.45 }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563EB', flexShrink: 0, marginTop: '6px' }} />
                      <EditableText contentKey={`investors.investmentPaths.0.point${i}`} value={pt} />
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                {/* Best For Box */}
                <div style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  padding: '16px 18px',
                  borderRadius: '12px',
                  fontSize: '0.825rem',
                  color: '#475569',
                  lineHeight: 1.5,
                  fontWeight: 500,
                  marginBottom: '20px'
                }}>
                  <strong style={{ color: '#0F172A' }}>Best for:</strong> <EditableText contentKey="investors.investmentPaths.0.bestFor" value={getContent('investors.investmentPaths.0.bestFor', 'Investors who want diversified exposure across multiple ventures and believe in the studio model as a category.')} />
                </div>

                {/* Bottom Timeline Indicator Bar */}
                <div style={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative' }}>
                  <div style={{ flex: 1, height: '2px', backgroundColor: '#3B82F6' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: '2px solid #3B82F6', backgroundColor: '#FFFFFF', flexShrink: 0 }} />
                </div>
              </div>
            </div>
          </div>

          {/* ── CARD 02: Invest in a Specific Venture (Mild Indigo Blue Theme) ── */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>

            {/* Back Accent Panel — Mild Indigo Blue Pastel */}
            <div style={{
              position: 'absolute',
              right: '0',
              top: '20px',
              bottom: '20px',
              width: '180px',
              background: 'linear-gradient(135deg, #E0E7FF 0%, #EEF2FF 100%)',
              border: '1.5px solid #C7D2FE',
              borderRadius: '20px',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              boxShadow: '0 8px 24px rgba(79, 70, 229, 0.08)',
              zIndex: 1
            }}>
              <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#4F46E5', lineHeight: 1, fontFamily: "'Inter', sans-serif" }}>
                02
              </div>
              <div style={{ color: '#4F46E5' }}>
                <Briefcase size={34} strokeWidth={2} />
              </div>
            </div>

            {/* Front Overlapping Card */}
            <div style={{
              position: 'relative',
              zIndex: 2,
              marginRight: '88px',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 12px 32px rgba(15, 23, 42, 0.06)',
              padding: '32px 28px 28px 28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              flex: 1
            }}>
              <div>
                {/* Top Rounded Pill Header — Mild Soft Indigo Blue */}
                <div style={{
                  background: 'linear-gradient(135deg, #EEF2FF 0%, #F5F7FF 100%)',
                  border: '1px solid #C7D2FE',
                  borderRadius: '12px',
                  padding: '14px 20px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4F46E5' }}>
                    <EditableText contentKey="investors.investmentPaths.1.badge" value={getContent('investors.investmentPaths.1.badge', 'PATH 02')} />
                  </span>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', margin: 0, fontFamily: "'Inter', sans-serif" }}>
                    <EditableText contentKey="investors.investmentPaths.1.title" value={getContent('investors.investmentPaths.1.title', 'Invest in a Specific Venture')} />
                  </h3>
                </div>

                {/* Description */}
                <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '20px', fontWeight: 500 }}>
                  <EditableText contentKey="investors.investmentPaths.1.description" value={getContent('investors.investmentPaths.1.description', 'Back a specific company in the CrestCode portfolio through a dedicated Special Purpose Vehicle (SPV). Your capital goes directly into one venture — clean, targeted, and legally isolated from the rest of the portfolio.')} />
                </p>
                
                {/* Bullet Points */}
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    getContent('investors.investmentPaths.1.point0', 'Direct equity in a single venture via a dedicated SPV structure'),
                    getContent('investors.investmentPaths.1.point1', 'Investment isolated per venture — one company\'s performance doesn\'t affect another'),
                    getContent('investors.investmentPaths.1.point2', 'Access to venture-specific dashboard showing build progress, milestones, and financials'),
                    getContent('investors.investmentPaths.1.point3', 'Opportunity to play an active role in product adoption and operations')
                  ].map((pt, i) => (
                    <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '0.86rem', color: '#334155', fontWeight: 500, lineHeight: 1.45 }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4F46E5', flexShrink: 0, marginTop: '6px' }} />
                      <EditableText contentKey={`investors.investmentPaths.1.point${i}`} value={pt} />
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                {/* Best For Box */}
                <div style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  padding: '16px 18px',
                  borderRadius: '12px',
                  fontSize: '0.825rem',
                  color: '#475569',
                  lineHeight: 1.5,
                  fontWeight: 500,
                  marginBottom: '20px'
                }}>
                  <strong style={{ color: '#0F172A' }}>Best for:</strong> <EditableText contentKey="investors.investmentPaths.1.bestFor" value={getContent('investors.investmentPaths.1.bestFor', 'Investors with conviction in a specific market, product, or domain — and who want to contribute hands-on to that venture\'s growth.')} />
                </div>

                {/* Bottom Timeline Indicator Bar */}
                <div style={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative' }}>
                  <div style={{ flex: 1, height: '2px', backgroundColor: '#4F46E5' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: '2px solid #4F46E5', backgroundColor: '#FFFFFF', flexShrink: 0 }} />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
