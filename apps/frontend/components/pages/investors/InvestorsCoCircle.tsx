'use client';
import React from 'react';
import EditableText from '@/components/pages/admin/EditableText';
import { Target, Clock, Users, Wrench, ShieldCheck, TrendingUp } from 'lucide-react';

export default function InvestorsCoCircle({ content, getContent }: any) {
  const traits = [
    {
      title: getContent('investors.selective.0.title', 'Domain-aligned operators'),
      desc: getContent('investors.selective.0.desc', 'you understand the market the venture is targeting and can help open doors.'),
      icon: <Target size={24} strokeWidth={2} />
    },
    {
      title: getContent('investors.selective.1.title', 'Long-term thinkers'),
      desc: getContent('investors.selective.1.desc', "you're patient, believe in building real businesses, and aren't looking for a quick exit."),
      icon: <Clock size={24} strokeWidth={2} />
    },
    {
      title: getContent('investors.selective.2.title', 'Strategic connectors'),
      desc: getContent('investors.selective.2.desc', 'you have a network that can accelerate customer acquisition, partnerships, or hiring.'),
      icon: <Users size={24} strokeWidth={2} />
    },
    {
      title: getContent('investors.selective.3.title', 'Hands-on contributors'),
      desc: getContent('investors.selective.3.desc', "you're willing to roll up your sleeves and support a venture in its early stages of operations or adoption."),
      icon: <Wrench size={24} strokeWidth={2} />
    },
    {
      title: getContent('investors.selective.4.title', 'Transparent communicators'),
      desc: getContent('investors.selective.4.desc', 'you engage honestly, ask hard questions, and hold us accountable the same way we hold ourselves.'),
      icon: <ShieldCheck size={24} strokeWidth={2} />
    },
    {
      title: getContent('investors.selective.5.title', 'Active growth partners'),
      desc: getContent('investors.selective.5.desc', 'you actively advocate for the portfolio, assist with follow-on capital, and help scale venture distribution.'),
      icon: <TrendingUp size={24} strokeWidth={2} />
    }
  ];

  return (
    <section className="page-section" style={{ backgroundColor: '#F8FAFC', paddingTop: '24px', paddingBottom: '24px', position: 'relative' }}>
      <div className="section-container" style={{ maxWidth: '1180px', margin: '0 auto' }}>
        
        {/* Centered Heading */}
        <div className="section-header-centered" style={{ textAlign: 'center', marginBottom: '44px' }}>
          <div className="hero-eyebrow-pill" style={{ display: 'inline-block', background: '#E6EFFF', color: '#005AE2', fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '6px 16px', borderRadius: '100px', marginBottom: '14px' }}>
            <EditableText contentKey="investors.selective.eyebrow" value={content?.investors?.selective?.eyebrow || 'Investor Profile'} />
          </div>
          <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 'clamp(2rem, 4vw, 2.6rem)', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', margin: '0 auto 16px', lineHeight: 1.25 }}>
            <EditableText contentKey="investors.selective.title" value={content?.investors?.selective?.title || "We're selective.\nOn purpose."} />
          </h2>
        </div>

        {/* Center-Aligned Description Block */}
        <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 52px' }}>
          <p style={{
            color: '#475569',
            fontSize: '1.02rem',
            lineHeight: 1.7,
            fontWeight: 500,
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            <EditableText contentKey="investors.selective.description1" value={getContent('investors.selective.description1', 'We prefer investors who bring more than capital. Our ideal partner is aligned with the product, believes in the long-term, and wants to play an active role in helping ventures succeed — whether through their network, domain expertise, or hands-on operational support.')} />
          </p>
          <p style={{
            color: '#475569',
            fontSize: '1.02rem',
            lineHeight: 1.7,
            fontWeight: 500,
            margin: 0,
            textAlign: 'center'
          }}>
            <EditableText contentKey="investors.selective.description2" value={getContent('investors.selective.description2', 'Pure financial investors are welcome, but investors who can actively contribute to product adoption, customer introductions, or operations will always be prioritized.')} />
          </p>
        </div>

        {/* 3-Column Card Grid with 6 Balanced Trait Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px',
          marginBottom: '44px'
        }}>
          {traits.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 18px rgba(15, 23, 42, 0.05)',
                overflow: 'hidden',
                position: 'relative',
                minHeight: '110px',
                transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 10px 28px rgba(13, 147, 242, 0.14)';
                e.currentTarget.style.borderColor = 'rgba(13, 147, 242, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 18px rgba(15, 23, 42, 0.05)';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
            >
              {/* Mild Blue Accent Bar with Circle Node */}
              <div style={{
                width: '46px',
                minWidth: '46px',
                alignSelf: 'stretch',
                backgroundColor: '#0D93F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: '2.5px solid #FFFFFF',
                  backgroundColor: 'transparent'
                }} />
              </div>

              {/* Middle Card Content */}
              <div style={{ flex: 1, padding: '20px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{
                  fontSize: '0.98rem',
                  fontWeight: 700,
                  color: '#0F172A',
                  margin: '0 0 4px 0',
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: 1.3
                }}>
                  <EditableText contentKey={`investors.selective.${idx}.title`} value={item.title} />
                </h3>
                <p style={{
                  fontSize: '0.84rem',
                  color: '#64748B',
                  lineHeight: 1.5,
                  margin: 0,
                  fontWeight: 500,
                  fontFamily: "'Inter', sans-serif"
                }}>
                  <EditableText contentKey={`investors.selective.${idx}.desc`} value={item.desc} />
                </p>
              </div>

              {/* Clean Standalone Icon without Square Box */}
              <div style={{
                marginRight: '24px',
                color: '#0D93F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {item.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Centered Amber Full-Width Risk Note Banner */}
        <div style={{
          background: '#FFFBEB',
          border: '1px solid #FEF3C7',
          borderRadius: '16px',
          padding: '22px 28px',
          fontSize: '0.88rem',
          color: '#B45309',
          lineHeight: 1.6,
          fontWeight: 500,
          maxWidth: '840px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <strong style={{ color: '#78350F' }}>Note:</strong> <EditableText contentKey="investors.selective.note" value={getContent('investors.selective.note', 'CrestCode is an early-stage studio. All investments carry inherent risk. We are committed to full transparency — and we will always tell you the truth about where things stand.')} />
        </div>

      </div>
    </section>
  );
}
