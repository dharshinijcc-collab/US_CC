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




export default function InvestorsVentureModel({ content, getContent }: any) {
  return (
    <section style={{ backgroundColor: '#FFFFFF', position: 'relative' }}>
          <div className="section-container">
            
            {/* Centered Heading */}
            <div className="section-header-centered">
              <div className="hero-eyebrow-pill">
                <EditableText contentKey="investors.benefits.eyebrow" value={content?.investors?.benefits?.eyebrow || 'Investor Benefits'} />
              </div>
              <h2>
                <EditableText contentKey="investors.benefits.heading" value={getContent('investors.benefits.heading', 'What you get as an')} />{' '}<EditableText contentKey="investors.benefits.highlight" value={getContent('investors.benefits.highlight', 'investor.')} />
              </h2>
              <p>
                <EditableText contentKey="investors.benefits.description" value={content?.investors?.benefits?.description || 'Beyond capital deployment, CrestCode investors get a front-row seat to how ventures are built — with the visibility and access to make that meaningful.'} />
              </p>
            </div>

            {/* 6 Grid Cards */}
            <div className="grid-3">
              {[
                {
                  badge: getContent('investors.benefits.0.badge', '01'),
                  title: getContent('investors.benefits.0.title', 'Live Investor Dashboard'),
                  desc: getContent('investors.benefits.0.desc', 'A dedicated dashboard showing exactly where your capital is deployed, what\'s being built, milestone progress, and key metrics across your investment — updated in real time.'),
                  color: '#3B82F6',
                  icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" /></svg>
                },
                {
                  badge: getContent('investors.benefits.1.badge', '02'),
                  title: getContent('investors.benefits.1.title', 'Full Financial Transparency'),
                  desc: getContent('investors.benefits.1.desc', 'No black boxes. You see how capital is allocated across engineering, design, product, and operations — with clear accountability at every stage of the build.'),
                  color: '#10B981',
                  icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.407 2.67 1M12 17V7m0 10c-1.11 0-2.08-.407-2.67-1M12 17V7" /></svg>
                },
                {
                  badge: getContent('investors.benefits.2.badge', '03'),
                  title: getContent('investors.benefits.2.title', 'Strategic Involvement'),
                  desc: getContent('investors.benefits.2.desc', 'We actively want investors who can open doors, support adoption, and contribute domain expertise. Your network and experience are as valuable to us as your capital.'),
                  color: '#8B5CF6',
                  icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                },
                {
                  badge: getContent('investors.benefits.3.badge', '04'),
                  title: getContent('investors.benefits.3.title', 'Quarterly Reviews'),
                  desc: getContent('investors.benefits.3.desc', 'Structured quarterly sessions with CrestCode leadership covering portfolio performance, upcoming ventures, strategic direction, and your investment position.'),
                  color: '#EC4899',
                  icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                },
                {
                  badge: getContent('investors.benefits.4.badge', '05'),
                  title: getContent('investors.benefits.4.title', 'Early Access to New Ventures'),
                  desc: getContent('investors.benefits.4.desc', 'Studio investors get first visibility into new ventures before they are opened to outside investors — with the option to participate at the earliest stage.'),
                  color: '#F59E0B',
                  icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                },
                {
                  badge: getContent('investors.benefits.5.badge', '06'),
                  title: getContent('investors.benefits.5.title', 'Co-Founder Network Access'),
                  desc: getContent('investors.benefits.5.desc', 'Join a growing network of founders, operators, and builders across the CrestCode portfolio — and help shape the ecosystem we\'re building together.'),
                  color: '#06B6D4',
                  icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                }
              ].map((val, idx) => (
                <div key={idx} className="benefit-card-new" style={{ '--card-glow': val.color } as React.CSSProperties}>

                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: `${val.color}12`,
                    border: `1.5px solid ${val.color}25`,
                    color: val.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '24px'
                  }}>
                    {val.icon}
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '8px' }}>
                    <EditableText contentKey={`investors.benefits.${idx}.title`} value={val.title} />
                  </h3>
 
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                    <EditableText contentKey={`investors.benefits.${idx}.desc`} value={val.desc} />
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>
  );
}
