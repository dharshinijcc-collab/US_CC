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




export default function InvestorsCoCircle({ content, getContent }: any) {
  return (
    <section style={{ backgroundColor: '#EFF6FF', position: 'relative' }}>
          <div className="section-container">
            
            {/* Centered Heading */}
            <div className="section-header-centered">
              <div className="hero-eyebrow-pill">
                <EditableText contentKey="investors.selective.eyebrow" value={content?.investors?.selective?.eyebrow || 'Investor Profile'} />
              </div>
              <h2>
                <EditableText contentKey="investors.selective.title" value={content?.investors?.selective?.title || "We're selective.\nOn purpose."} />
              </h2>
            </div>

            {/* Spanning Center-Aligned Description Block */}
            <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 56px' }}>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '1.1rem',
                lineHeight: 1.75,
                fontWeight: 500,
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <EditableText contentKey="investors.selective.description1" value={getContent('investors.selective.description1', 'We prefer investors who bring more than capital. Our ideal partner is aligned with the product, believes in the long-term, and wants to play an active role in helping ventures succeed — whether through their network, domain expertise, or hands-on operational support.')} />
              </p>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '1.1rem',
                lineHeight: 1.75,
                fontWeight: 500,
                margin: 0,
                textAlign: 'center'
              }}>
                <EditableText contentKey="investors.selective.description2" value={getContent('investors.selective.description2', 'Pure financial investors are welcome, but investors who can actively contribute to product adoption, customer introductions, or operations will always be prioritized.')} />
              </p>
            </div>

            {/* 3-Column / Auto-balanced Responsive Trait Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
              marginBottom: '40px'
            }}>
              {[
                {
                  title: getContent('investors.selective.0.title', 'Domain-aligned operators'),
                  desc: getContent('investors.selective.0.desc', 'you understand the market the venture is targeting and can help open doors.')
                },
                {
                  title: getContent('investors.selective.1.title', 'Long-term thinkers'),
                  desc: getContent('investors.selective.1.desc', "you're patient, believe in building real businesses, and aren't looking for a quick exit.")
                },
                {
                  title: getContent('investors.selective.2.title', 'Strategic connectors'),
                  desc: getContent('investors.selective.2.desc', 'you have a network that can accelerate customer acquisition, partnerships, or hiring.')
                },
                {
                  title: getContent('investors.selective.3.title', 'Hands-on contributors'),
                  desc: getContent('investors.selective.3.desc', "you're willing to roll up your sleeves and support a venture in its early stages of operations or adoption.")
                },
                {
                  title: getContent('investors.selective.4.title', 'Transparent communicators'),
                  desc: getContent('investors.selective.4.desc', 'you engage honestly, ask hard questions, and hold us accountable the same way we hold ourselves.')
                }
              ].map((item, idx) => (
                <div key={idx} className="selective-item">
                  <div className="selective-check">✓</div>
                  <div style={{ fontSize: '0.925rem', lineHeight: 1.5, fontWeight: 500, color: '#475569' }}>
                    <strong style={{ color: 'var(--text-black)', display: 'block', marginBottom: '2px', fontWeight: 700 }}>
                      <EditableText contentKey={`investors.selective.${idx}.title`} value={item.title} />
                    </strong>
                    <EditableText contentKey={`investors.selective.${idx}.desc`} value={item.desc} />
                  </div>
                </div>
              ))}
            </div>

            {/* Centered Amber Full-Width Warning Risk Banner */}
            <div style={{
              background: '#FFFBEB',
              border: '1px solid #FEF3C7',
              borderRadius: '16px',
              padding: '24px',
              fontSize: '0.875rem',
              color: '#B45309',
              lineHeight: 1.6,
              fontWeight: 500,
              maxWidth: '820px',
              margin: '32px auto 0',
              textAlign: 'center'
            }}>
              <strong style={{ color: '#78350F' }}>Note:</strong> <EditableText contentKey="investors.selective.note" value={getContent('investors.selective.note', 'CrestCode is an early-stage studio. All investments carry inherent risk. We are committed to full transparency — and we will always tell you the truth about where things stand.')} />
            </div>

          </div>
        </section>
  );
}
