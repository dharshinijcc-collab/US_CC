'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';
import EditableImage from '@/components/pages/admin/EditableImage';
import type { TeamMember } from '@/types/team.types';



export default function AboutCommunity({ getContent }: any) {
  return (
    <section style={{ backgroundColor: '#EFF6FF', position: 'relative' }}>
          <div className="section-container">
            
            {/* Centered Heading */}
            <div className="section-header-centered">
              <EditableText 
                contentKey="about.community.label" 
                value={getContent('about.community.label', 'COMMUNITY & NETWORK')}
                className="label"
                as="span"
              />
              <EditableText 
                contentKey="about.community.title" 
                value={getContent('about.community.title', 'Building something bigger than a studio.')}
                as="h2"
              />
              <EditableText 
                contentKey="about.community.description" 
                value={getContent('about.community.description', 'CrestCode is more than a product studio — it\'s the foundation for a network of founders, operators, investors, and advisors who believe in building things that last. We\'re actively building this community and looking for the right people to be part of it from the ground up.')}
                as="p"
                style={{ marginBottom: '32px' }}
              />
            </div>

            {/* 3 Cards Auto-balanced Responsive Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {[
                {
                  icon: (
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 00-3-3.87" />
                      <path d="M16 3.13a4 4 0 010 7.75" />
                    </svg>
                  ),
                  title: getContent('about.community.0.title', 'Founders Network'),
                  desc: getContent('about.community.0.desc', 'Connect with other founders in the CrestCode portfolio — share learnings, challenges, and opportunities across ventures.')
                },
                {
                  icon: (
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                    </svg>
                  ),
                  title: getContent('about.community.1.title', 'Investor Circle'),
                  desc: getContent('about.community.1.desc', 'Strategic investors who back CrestCode ventures and play an active role in their growth and adoption.')
                },
                {
                  icon: (
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
                    </svg>
                  ),
                  title: getContent('about.community.2.title', 'Advisor Pool'),
                  desc: getContent('about.community.2.desc', 'Domain experts across finance, healthcare, product, and operations — available to every entrepreneur we work with.')
                }
              ].map((item, idx) => (
                <div key={idx} className="about-card" style={{ background: 'var(--white)', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'rgba(0, 90, 226, 0.08)',
                    color: 'var(--primary-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    flexShrink: 0
                  }}>
                    {item.icon}
                  </div>
                  <EditableText 
                    contentKey={`about.community.${idx}.title`}
                    value={item.title}
                    as="h3"
                    style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '8px' }}
                  />
                  <EditableText 
                    contentKey={`about.community.${idx}.desc`}
                    value={item.desc}
                    as="p"
                    style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0, fontWeight: 500 }}
                  />
                </div>
              ))}
            </div>

          </div>
        </section>
  );
}
