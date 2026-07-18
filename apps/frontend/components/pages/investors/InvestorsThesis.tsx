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




export default function InvestorsThesis({ content, getContent }: any) {
  return (
    <section style={{ backgroundColor: '#FFFFFF', position: 'relative' }}>
          <div className="section-container">
            
            {/* Centered Heading & Intro Lead */}
            <div className="section-header-centered" style={{ marginBottom: '56px' }}>
              <div className="hero-eyebrow-pill">
                <EditableText contentKey="investors.whyInvest.eyebrow" value={content?.investors?.whyInvest?.eyebrow || 'The Opportunity'} />
              </div>
              <h2>
                <EditableText contentKey="investors.whyInvest.heading" value={getContent('investors.whyInvest.heading', 'Why invest in')} />{' '}<EditableText contentKey="investors.whyInvest.highlight" value={getContent('investors.whyInvest.highlight', 'CrestCode?')} />
              </h2>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '1.15rem',
                lineHeight: 1.75,
                maxWidth: '780px',
                margin: '24px auto 0',
                fontWeight: 500,
                textAlign: 'center'
              }}>
                <EditableText contentKey="investors.whyInvest.description" value={content?.investors?.whyInvest?.description || "We don't just build products — we build ventures with staying power. Every company we back goes through rigorous validation, senior engineering, and a structured go-to-market process. You're not betting on ideas. You're betting on execution."} />
              </p>
            </div>

            {/* Premium 2x2 Balanced Cards Grid */}
            <div className="why-invest-grid" style={{ gap: '24px', alignItems: 'stretch' }}>
              {[
                {
                  title: getContent('investors.whyInvest.0.title', 'Execution-first model'),
                  desc: getContent('investors.whyInvest.0.desc', 'Every venture is built in-house by senior engineers, designers, and product strategists — not outsourced, not staffed with juniors.'),
                  color: '#005AE2',
                  icon: (
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )
                },
                {
                  title: getContent('investors.whyInvest.1.title', 'Validated before built'),
                  desc: getContent('investors.whyInvest.1.desc', 'Every product goes through a rigorous two-week ideation, business case, and PRFAQ process before a single line of code is written.'),
                  color: '#EC4899',
                  icon: (
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                },
                {
                  title: getContent('investors.whyInvest.2.title', 'Full transparency'),
                  desc: getContent('investors.whyInvest.2.desc', "Investors get access to a live dashboard showing where capital is deployed, what's being built, and how each venture is progressing."),
                  color: '#10B981',
                  icon: (
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                    </svg>
                  )
                },
                {
                  title: getContent('investors.whyInvest.3.title', 'Long-term partnership'),
                  desc: getContent('investors.whyInvest.3.desc', "We're not looking for a transaction. We want investors who are aligned with the mission and can contribute beyond capital."),
                  color: '#F59E0B',
                  icon: (
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.407 2.67 1M12 17V7m0 10c-1.11 0-2.08-.407-2.67-1M12 17V7" />
                    </svg>
                  )
                }
              ].map((item, idx) => (
                <div key={idx} className="why-invest-card">
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: `${item.color}10`,
                    border: `1.5px solid ${item.color}25`,
                    color: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '6px' }}>
                      <EditableText contentKey={`investors.whyInvest.${idx}.title`} value={item.title} />
                    </h3>
                    <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                      <EditableText contentKey={`investors.whyInvest.${idx}.desc`} value={item.desc} />
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
  );
}
