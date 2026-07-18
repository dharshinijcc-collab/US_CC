'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';
import EditableImage from '@/components/pages/admin/EditableImage';
import type { TeamMember } from '@/types/team.types';



export default function AboutStory({ getContent, milestonesData }: any) {
  return (
    <section style={{ backgroundColor: '#FFFFFF', position: 'relative' }}>
          <div className="section-container">
            
            {/* Centered Heading */}
            <div className="section-header-centered">
              <EditableText 
                contentKey="about.story.label" 
                value={getContent('about.story.label', 'OUR STORY')}
                className="label"
                as="span"
              />
              <EditableText 
                contentKey="about.story.title" 
                value={getContent('about.story.title', 'Where it all began.')}
                as="h2"
              />
              <EditableText 
                contentKey="about.story.description" 
                value={getContent('about.story.description', "CrestCode didn't start with a business plan. It started with a conviction - that finding and building the right idea is one of the hardest things a founder can do, and nobody should have to do it without the right partner.")}
                as="p"
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '1.08rem',
                  lineHeight: 1.8,
                  fontWeight: 500,
                  margin: '24px auto 0',
                  maxWidth: '700px'
                }}
              />
            </div>

            {/* Timeline */}
            <div style={{ maxWidth: '900px', margin: '60px auto 0' }}>
              <div style={{ position: 'relative' }}>
                {/* Vertical line */}
                <div style={{
                  position: 'absolute',
                  left: '77px',
                  top: 0,
                  bottom: 0,
                  width: '2px',
                  background: 'rgba(0, 90, 226, 0.2)'
                }}></div>
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                {(milestonesData.length > 0 ? milestonesData : [
                  {
                    year: getContent('about.timeline.0.year', '2023'),
                    title: getContent('about.timeline.0.title', 'The Seed of an Idea'),
                    description: getContent('about.timeline.0.desc', 'While working as a Product Manager at Amazon, Asfarul Huda began thinking seriously about the entrepreneur journey. He saw a consistent pattern — founders with genuine ideas struggling to find partners who could actually build. The idea for a product studio that could bridge that gap began to take shape.')
                  },
                  {
                    year: getContent('about.timeline.1.year', '2024'),
                    title: getContent('about.timeline.1.title', 'The First Client — and the First Lesson'),
                    description: getContent('about.timeline.1.desc', 'Premier Review became CrestCode\'s first client, seeking strategic guidance as an early-stage startup. That engagement crystallized two foundational truths: founders don\'t just need builders — they need someone who will challenge them, hold them accountable, and earn their trust. Those two pillars — execution and trust — became the foundation of everything CrestCode stands for.')
                  },
                  {
                    year: getContent('about.timeline.2.year', '2025'),
                    title: getContent('about.timeline.2.title', 'CrestCode Launches'),
                    description: getContent('about.timeline.2.desc', 'With a clear model and a founding team in place, CrestCode USA officially launched as a venture studio — offering end-to-end product building for founders and business owners. The mission: be the partner that turns ambitious ideas and real-world problems into products people actually use.')
                  },
                  {
                    year: getContent('about.timeline.3.year', 'TODAY'),
                    title: getContent('about.timeline.3.title', 'Three Products. One Studio. A Growing Portfolio.'),
                    description: getContent('about.timeline.3.desc', 'CrestCode now has three active products in market — Dockly, OpenCapFi, and Vhoas — alongside strategic partnerships with Premier Review and CastleGEC. The studio is growing its team, its network, and its ambition.')
                  }
                ]).map((item, idx, arr) => (
                  <div key={item.id || idx} style={{ display: 'flex', marginBottom: idx === arr.length - 1 ? '0' : '48px', alignItems: 'flex-start' }}>
                    {/* Left side - Year */}
                    <div style={{ width: '70px', flexShrink: 0, textAlign: 'right', paddingRight: '14px', paddingTop: '2px' }}>
                      <span
                        style={{
                          color: 'var(--primary-blue)',
                          fontSize: '0.9rem',
                          fontWeight: 800,
                          letterSpacing: '0.05em',
                          fontFamily: "'Manrope', sans-serif"
                        }}
                      >
                        {item.year}
                      </span>
                    </div>
                    
                    {/* Center - Node on line */}
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: '#005AE2',
                      border: '3px solid #FFFFFF',
                      boxShadow: '0 0 0 3px rgba(0, 90, 226, 0.2)',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}></div>
                    
                    {/* Right side - Content */}
                    <div style={{ flex: 1, paddingLeft: '14px', paddingTop: '2px' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '8px' }}>
                        {item.title}
                      </h3>
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          style={{ width: '100%', maxWidth: '320px', borderRadius: '8px', marginBottom: '12px', display: 'block', objectFit: 'cover' }}
                        />
                      )}
                      <p
                        style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0, fontWeight: 500 }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            </div>

          </div>
        </section>
  );
}
