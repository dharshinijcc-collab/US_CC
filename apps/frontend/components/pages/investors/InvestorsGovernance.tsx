'use client';
import React from 'react';
import EditableText from '@/components/pages/admin/EditableText';
import { DollarSign, Hourglass, Scale } from 'lucide-react';

export default function InvestorsGovernance({ content, getContent }: any) {
  const cards = [
    {
      labelKey: 'investors.terms.0.label',
      labelDefault: 'MINIMUM INVESTMENT',
      valueKey: 'investors.terms.0.value',
      valueDefault: '$50K/yr',
      descKey: 'investors.terms.0.description',
      descDefault: 'Minimum annual commitment for both studio-level and venture-specific investments. Flexible structuring available for multi-year commitments.',
      icon: <DollarSign size={20} color="#005AE2" />
    },
    {
      labelKey: 'investors.terms.1.label',
      labelDefault: 'INVESTMENT HORIZON',
      valueKey: 'investors.terms.1.value',
      valueDefault: 'Long-term',
      descKey: 'investors.terms.1.description',
      descDefault: 'We build ventures designed to last. We expect investors to share a 5–7 year horizon and believe in compounding value over time — not short-term exits.',
      icon: <Hourglass size={20} color="#005AE2" />
    },
    {
      labelKey: 'investors.terms.2.label',
      labelDefault: 'RETURN STRUCTURE',
      valueKey: 'investors.terms.2.value',
      valueDefault: 'Equity or Revenue',
      descKey: 'investors.terms.2.description',
      descDefault: 'Studio investors choose between an equity stake in CrestCode or a revenue share arrangement. Venture-specific investments are equity via SPV.',
      icon: <Scale size={20} color="#005AE2" />
    }
  ];

  return (
    <section className="page-section" style={{ backgroundColor: '#F8FAFC', paddingTop: '48px', paddingBottom: '48px', position: 'relative' }}>
      <div className="section-container" style={{ maxWidth: '1180px', margin: '0 auto' }}>
        
        {/* Centered Heading */}
        <div className="section-header-centered" style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="hero-eyebrow-pill" style={{ display: 'inline-block', background: '#E6EFFF', color: '#005AE2', fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '6px 16px', borderRadius: '100px', marginBottom: '14px' }}>
            <EditableText contentKey="investors.terms.eyebrow" value={content?.investors?.terms?.eyebrow || 'Investment Terms'} />
          </div>
          <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 'clamp(2rem, 4vw, 2.6rem)', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', margin: '0 auto 12px', lineHeight: 1.25 }}>
            <EditableText contentKey="investors.terms.title" value={content?.investors?.terms?.title || 'Clear terms.\nNo surprises.'} />
          </h2>
        </div>

        {/* Clean Modern 3-Column Card Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '44px'
        }}>
          {cards.map((card, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                padding: '32px 28px',
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(15, 23, 42, 0.08)';
                e.currentTarget.style.borderColor = '#005AE2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(15, 23, 42, 0.04)';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
            >
              <div>
                {/* Top Badge & Icon Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <span style={{
                    backgroundColor: '#EFF6FF',
                    color: '#005AE2',
                    border: '1px solid #BFDBFE',
                    padding: '4px 12px',
                    borderRadius: '100px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    fontFamily: "'Inter', sans-serif"
                  }}>
                    <EditableText contentKey={card.labelKey} value={getContent(card.labelKey, card.labelDefault)} />
                  </span>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {card.icon}
                  </div>
                </div>

                {/* Big Stat / Value */}
                <h3 style={{
                  fontSize: '1.8rem',
                  fontWeight: 800,
                  color: '#0F172A',
                  margin: '0 0 14px 0',
                  letterSpacing: '-0.02em',
                  fontFamily: "'Inter', sans-serif"
                }}>
                  <EditableText contentKey={card.valueKey} value={getContent(card.valueKey, card.valueDefault)} />
                </h3>

                {/* Body Description */}
                <p style={{
                  color: '#64748B',
                  fontSize: '0.92rem',
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
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '20px 28px',
          fontSize: '0.88rem',
          color: '#475569',
          lineHeight: 1.6,
          fontWeight: 500,
          textAlign: 'center',
          maxWidth: '1080px',
          margin: '0 auto',
          boxShadow: '0 2px 10px rgba(15, 23, 42, 0.02)'
        }}>
          <EditableText contentKey="investors.terms.disclaimer" value={getContent('investors.terms.disclaimer', 'Investment terms, legal structure, and formal agreements are subject to negotiation and applicable securities regulations. CrestCode is currently establishing its formal legal investment framework. All terms discussed are indicative and non-binding until a formal agreement is executed.')} />
        </div>

      </div>
    </section>
  );
}
