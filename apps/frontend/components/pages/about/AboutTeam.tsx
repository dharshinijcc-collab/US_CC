'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';
import EditableImage from '@/components/pages/admin/EditableImage';
import type { TeamMember } from '@/types/team.types';



export default function AboutTeam({ coreTeam, getInitials, getContent }: any) {
  return (
    <section style={{ backgroundColor: '#FFFFFF', position: 'relative' }}>
          <div className="section-container">
            
            {/* Centered Heading */}
            <div className="section-header-centered">
              <EditableText 
                contentKey="about.team.label" 
                value={getContent('about.team.label', 'THE TEAM')}
                className="label"
                as="span"
              />
              <EditableText 
                contentKey="about.team.title" 
                value={getContent('about.team.title', 'The people behind the studio.')}
                as="h2"
              />
              <EditableText 
                contentKey="about.team.description" 
                value={getContent('about.team.description', 'A remote-first team of builders, strategists, and operators — united by the belief that great products are built through partnership, not just process.')}
                as="p"
              />
            </div>

            {/* Grid 4 columns — dynamic from Supabase */}
            <div className="grid-4">
              {coreTeam.map((member) => (
                <div key={member.id} className="about-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div className="avatar-circle">
                    {member.image_url ? (
                      <img src={member.image_url} alt={member.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <span>{getInitials(member.name)}</span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '4px' }}>
                    {member.name}
                  </h3>
                  <span style={{
                    color: 'var(--primary-blue)',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '16px',
                    fontFamily: "'Manrope', sans-serif"
                  }}>
                    {member.role}
                  </span>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>
  );
}
