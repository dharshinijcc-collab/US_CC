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




export default function InvestorsGovernance({ content, getContent }: any) {
  return (
    <section style={{ backgroundColor: '#FFFFFF', position: 'relative' }}>
          <div className="section-container">
            
            {/* Centered Heading */}
            <div className="section-header-centered">
              <div className="hero-eyebrow-pill">
                <EditableText contentKey="investors.terms.eyebrow" value={content?.investors?.terms?.eyebrow || 'Investment Terms'} />
              </div>
              <h2>
                <EditableText contentKey="investors.terms.title" value={content?.investors?.terms?.title || 'Clear terms.\nNo surprises.'} />
              </h2>
            </div>

            {/* 3 Columns Grid */}
            <div className="grid-3" style={{ marginBottom: '40px' }}>
              
              {/* Card 1 */}
              <div className="term-card">
                <div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#D97706', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '24px', fontFamily: "'Manrope', sans-serif" }}>
                    <EditableText contentKey="investors.terms.0.label" value={getContent('investors.terms.0.label', 'MINIMUM INVESTMENT')} />
                  </span>
                  <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '16px', letterSpacing: '-0.02em' }}>
                    <EditableText contentKey="investors.terms.0.value" value={getContent('investors.terms.0.value', '$50K/yr')} />
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.65, margin: 0, fontWeight: 500 }}>
                    <EditableText contentKey="investors.terms.0.description" value={getContent('investors.terms.0.description', 'Minimum annual commitment for both studio-level and venture-specific investments. Flexible structuring available for multi-year commitments.')} />
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="term-card">
                <div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--primary-blue)', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '24px', fontFamily: "'Manrope', sans-serif" }}>
                    <EditableText contentKey="investors.terms.1.label" value={getContent('investors.terms.1.label', 'INVESTMENT HORIZON')} />
                  </span>
                  <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '16px', letterSpacing: '-0.02em' }}>
                    <EditableText contentKey="investors.terms.1.value" value={getContent('investors.terms.1.value', 'Long-term')} />
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.65, margin: 0, fontWeight: 500 }}>
                    <EditableText contentKey="investors.terms.1.description" value={getContent('investors.terms.1.description', 'We build ventures designed to last. We expect investors to share a 5–7 year horizon and believe in compounding value over time — not short-term exits.')} />
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="term-card">
                <div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#8B5CF6', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '24px', fontFamily: "'Manrope', sans-serif" }}>
                    <EditableText contentKey="investors.terms.2.label" value={getContent('investors.terms.2.label', 'RETURN STRUCTURE')} />
                  </span>
                  <h3 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '16px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                    <EditableText contentKey="investors.terms.2.value" value={getContent('investors.terms.2.value', 'Equity or Revenue')} />
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.65, margin: 0, fontWeight: 500 }}>
                    <EditableText contentKey="investors.terms.2.description" value={getContent('investors.terms.2.description', 'Studio investors choose between an equity stake in CrestCode or a revenue share arrangement. Venture-specific investments are equity via SPV.')} />
                  </p>
                </div>
              </div>

            </div>

            {/* Bottom Non-binding Text */}
            <div style={{
              background: 'var(--bg-light)',
              border: '1px solid var(--border-light)',
              borderRadius: '16px',
              padding: '20px 24px',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              fontWeight: 500,
              textAlign: 'center',
              maxWidth: '1200px',
              margin: '0 auto'
            }}>
              <EditableText contentKey="investors.terms.disclaimer" value={getContent('investors.terms.disclaimer', 'Investment terms, legal structure, and formal agreements are subject to negotiation and applicable securities regulations. CrestCode is currently establishing its formal legal investment framework. All terms discussed are indicative and non-binding until a formal agreement is executed.')} />
            </div>

          </div>
        </section>
  );
}
