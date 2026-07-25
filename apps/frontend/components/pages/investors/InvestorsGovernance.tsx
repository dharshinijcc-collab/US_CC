'use client';
import React from 'react';
import EditableText from '@/components/pages/admin/EditableText';

export default function InvestorsGovernance({ content, getContent }: any) {
  const cards = [
    {
      labelKey: 'investors.terms.0.label',
      labelDefault: 'MINIMUM INVESTMENT',
      valueKey: 'investors.terms.0.value',
      valueDefault: '$50K/yr',
      descKey: 'investors.terms.0.description',
      descDefault: 'Minimum annual commitment for both studio-level and venture-specific investments. Flexible structuring available for multi-year commitments.',
      tabColor: '#3B82F6', // Glass Electric Blue
      plateColor: '#60A5FA'
    },
    {
      labelKey: 'investors.terms.1.label',
      labelDefault: 'INVESTMENT HORIZON',
      valueKey: 'investors.terms.1.value',
      valueDefault: 'Long-term',
      descKey: 'investors.terms.1.description',
      descDefault: 'We build ventures designed to last. We expect investors to share a 5–7 year horizon and believe in compounding value over time — not short-term exits.',
      tabColor: '#0EA5E9', // Glass Sky Ice Blue
      plateColor: '#38BDF8'
    },
    {
      labelKey: 'investors.terms.2.label',
      labelDefault: 'RETURN STRUCTURE',
      valueKey: 'investors.terms.2.value',
      valueDefault: 'Equity or Revenue',
      descKey: 'investors.terms.2.description',
      descDefault: 'Studio investors choose between an equity stake in CrestCode or a revenue share arrangement. Venture-specific investments are equity via SPV.',
      tabColor: '#2563EB', // Glass Cream Soft Blue
      plateColor: '#93C5FD'
    }
  ];

  return (
    <section style={{ backgroundColor: '#FAFAFC', padding: '88px 0', position: 'relative' }}>
      <div className="section-container" style={{ maxWidth: '1180px', margin: '0 auto' }}>
        
        {/* Centered Heading */}
        <div className="section-header-centered" style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="hero-eyebrow-pill" style={{ display: 'inline-block', background: '#E6EFFF', color: '#005AE2', fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '6px 16px', borderRadius: '100px', marginBottom: '14px' }}>
            <EditableText contentKey="investors.terms.eyebrow" value={content?.investors?.terms?.eyebrow || 'Investment Terms'} />
          </div>
          <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 'clamp(2rem, 4vw, 2.6rem)', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', margin: '0 auto 12px', lineHeight: 1.25 }}>
            <EditableText contentKey="investors.terms.title" value={content?.investors?.terms?.title || 'Clear terms.\nNo surprises.'} />
          </h2>
        </div>

        {/* Horizontal Card Grid (Exact Stacked Offset Card Design from Mockup) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px 32px',
          marginBottom: '52px',
          paddingTop: '20px'
        }}>
          {cards.map((card, idx) => (
            <div key={idx} style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
              
              {/* Back Offset Translucent Glass Plate */}
              <div style={{
                position: 'absolute',
                inset: 0,
                transform: 'translate(8px, 8px)',
                backgroundColor: card.plateColor,
                opacity: 0.5,
                borderRadius: '20px',
                zIndex: 1
              }} />

              {/* Front Elevated White Card */}
              <div style={{
                position: 'relative',
                zIndex: 2,
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1.5px solid #E2E8F0',
                padding: '36px 26px 26px 26px',
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flex: 1,
                minHeight: '210px'
              }}>
                {/* Top Overlapping Pill Tab — Centered in the middle */}
                <div style={{
                  position: 'absolute',
                  top: '-18px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  whiteSpace: 'nowrap',
                  backgroundColor: card.tabColor,
                  color: '#FFFFFF',
                  padding: '7px 22px',
                  borderRadius: '100px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  boxShadow: `0 4px 14px ${card.tabColor}50`,
                  fontFamily: "'Inter', sans-serif"
                }}>
                  <EditableText contentKey={card.labelKey} value={getContent(card.labelKey, card.labelDefault)} />
                </div>

                {/* Top Left Value / Amount */}
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px', paddingTop: '10px' }}>
                  <h3 style={{
                    fontSize: '1.9rem',
                    fontWeight: 800,
                    color: '#0F172A',
                    margin: 0,
                    letterSpacing: '-0.02em',
                    fontFamily: "'Inter', sans-serif"
                  }}>
                    <EditableText contentKey={card.valueKey} value={getContent(card.valueKey, card.valueDefault)} />
                  </h3>
                </div>

                {/* Body Description */}
                <p style={{
                  color: '#64748B',
                  fontSize: '0.88rem',
                  lineHeight: 1.65,
                  margin: 0,
                  fontWeight: 500,
                  fontFamily: "'Inter', sans-serif"
                }}>
                  <EditableText contentKey={card.descKey} value={getContent(card.descKey, card.descDefault)} />
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Non-binding Disclaimer Text */}
        <div style={{
          background: '#F1F5F9',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '20px 26px',
          fontSize: '0.86rem',
          color: '#475569',
          lineHeight: 1.6,
          fontWeight: 500,
          textAlign: 'center',
          maxWidth: '1080px',
          margin: '0 auto'
        }}>
          <EditableText contentKey="investors.terms.disclaimer" value={getContent('investors.terms.disclaimer', 'Investment terms, legal structure, and formal agreements are subject to negotiation and applicable securities regulations. CrestCode is currently establishing its formal legal investment framework. All terms discussed are indicative and non-binding until a formal agreement is executed.')} />
        </div>

      </div>
    </section>
  );
}
