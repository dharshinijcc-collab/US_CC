'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';
import EditableImage from '@/components/pages/admin/EditableImage';
import type { TeamMember } from '@/types/team.types';



export default function AboutPillars({ getContent }: any) {
  return (
    <section style={{ backgroundColor: '#EFF6FF', position: 'relative' }}>
          <div className="section-container">
            
            {/* Centered Heading */}
            <div className="section-header-centered">
              <EditableText 
                contentKey="about.pillars.label" 
                value={getContent('about.pillars.label', 'FOUNDING PILLARS')}
                className="label"
                as="span"
              />
              <EditableText 
                contentKey="about.pillars.title" 
                value={getContent('about.pillars.title', 'Two truths that built this studio.')}
                as="h2"
              />
              <EditableText 
                contentKey="about.pillars.description" 
                value={getContent('about.pillars.description', 'Everything CrestCode does flows from two observations Asfar made before the studio was even named.')}
                as="p"
              />
            </div>

            {/* 2 equal columns cards */}
            <div className="grid-2-equal">
              
              {/* Card 1 */}
              <div className="about-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(0, 90, 226, 0.08)',
                  color: 'var(--primary-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px'
                }}>
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 006 8c0 1 .2 2.2 1.5 3.5.7.8 1.3 1.5 1.5 2.5" />
                    <path d="M9 18h6" />
                    <path d="M10 22h4" />
                  </svg>
                </div>
                <EditableText 
                  contentKey="about.pillars.0.title"
                  value={getContent('about.pillars.0.title', 'A truly great idea is rare — and even harder to recognize.')}
                  as="h3"
                  style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '16px', lineHeight: 1.3 }}
                />
                <EditableText 
                  contentKey="about.pillars.0.description"
                  value={getContent('about.pillars.0.description', 'The real challenge isn\'t coming up with something new. It\'s identifying the ideas that are genuinely worth building — problems with real depth, markets with real demand, and timing that is right. Most people never find that clarity. CrestCode exists to help founders and business owners cut through the noise and build conviction around the ideas that actually deserve to be built.')}
                  as="p"
                  style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.65, margin: 0, fontWeight: 500 }}
                />
              </div>

              {/* Card 2 */}
              <div className="about-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(0, 90, 226, 0.08)',
                  color: 'var(--primary-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px'
                }}>
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 11 2 2 4-4" />
                  </svg>
                </div>
                <EditableText 
                  contentKey="about.pillars.1.title"
                  value={getContent('about.pillars.1.title', 'Trust is the most important currency in any partnership.')}
                  as="h3"
                  style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '16px', lineHeight: 1.3 }}
                />
                <EditableText 
                  contentKey="about.pillars.1.description"
                  value={getContent('about.pillars.1.description', 'Founders share their most vulnerable ideas with their build partners. That relationship only works if the partner earns trust - through honesty, through accountability, and through the willingness to say things that are uncomfortable but true. CrestCode was built with that kind of partnership in mind from day one.')}
                  as="p"
                  style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.65, margin: 0, fontWeight: 500 }}
                />
              </div>

            </div>

          </div>
        </section>
  );
}
