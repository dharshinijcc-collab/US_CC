'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';
import EditableImage from '@/components/pages/admin/EditableImage';
import type { TeamMember } from '@/types/team.types';



export default function AboutAdvisors({ advisors, getInitials, getContent }: any) {
  return (
    <section style={{ backgroundColor: '#EFF6FF', position: 'relative' }}>
          <div className="section-container">
            
            {/* Centered Heading */}
            <div className="section-header-centered">
              <EditableText 
                contentKey="about.advisors.label" 
                value={getContent('about.advisors.label', 'ADVISORS')}
                className="label"
                as="span"
              />
              <EditableText 
                contentKey="about.advisors.title" 
                value={getContent('about.advisors.title', 'Expert guidance where it matters most.')}
                as="h2"
              />
            </div>

            {/* 2 columns advisors — dynamic from Supabase */}
            <div className="grid-2-equal" style={{ maxWidth: '900px', margin: '0 auto' }}>
              {advisors.map((adv) => (
                <div key={adv.id} className="about-card" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', background: 'var(--white)' }}>
                  <div className="avatar-circle" style={{ margin: 0, flexShrink: 0 }}>
                    {adv.image_url ? (
                      <img src={adv.image_url} alt={adv.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <span>{getInitials(adv.name)}</span>
                    )}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '4px' }}>
                      {adv.name}
                    </h3>
                    <span style={{
                      color: 'var(--primary-blue)',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '12px',
                      fontFamily: "'Manrope', sans-serif"
                    }}>
                      {adv.role}
                    </span>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                      {adv.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
  );
}
