'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';
import EditableImage from '@/components/pages/admin/EditableImage';
import type { TeamMember } from '@/types/team.types';



export default function AboutGovernance({ getContent }: any) {
  return (
    <section style={{ backgroundColor: '#FFFFFF', position: 'relative' }}>
          <div className="section-container">
            
            {/* Centered Heading */}
            <div className="section-header-centered">
              <EditableText 
                contentKey="about.governance.label" 
                value={getContent('about.governance.label', 'GOVERNANCE MODEL')}
                className="label"
                as="span"
              />
              <EditableText 
                contentKey="about.governance.title" 
                value={getContent('about.governance.title', 'How we decide what to build.')}
                as="h2"
              />
              <EditableText 
                contentKey="about.governance.description" 
                value={getContent('about.governance.description', 'CrestCode operates with a structured, transparent governance model — so founders know exactly how ideas are evaluated, what to expect from the process, and how decisions are made at every stage.')}
                as="p"
              />
            </div>

            {/* 3 columns steps */}
            <div className="grid-3">
              {[
                {
                  step: getContent('about.governance.0.step', '01'),
                  title: getContent('about.governance.0.title', 'Monthly Idea Review'),
                  desc: getContent('about.governance.0.desc', 'All ideas submitted through CrestCode are reviewed on a monthly basis by the studio team. We evaluate each submission against our domain expertise, market opportunity, and strategic fit — ensuring every idea gets a genuine assessment, not just a quick pass.')
                },
                {
                  step: getContent('about.governance.1.step', '02'),
                  title: getContent('about.governance.1.title', 'Invitation to a Casual Meeting'),
                  desc: getContent('about.governance.1.desc', 'Ideas that align with CrestCode\'s areas of expertise move to an informal conversation with the founder or business owner. This is low-pressure and exploratory — designed to understand the person behind the idea as much as the idea itself.')
                },
                {
                  step: getContent('about.governance.2.step', '03'),
                  title: getContent('about.governance.2.title', 'Clear Exit Criteria from the Start'),
                  desc: getContent('about.governance.2.desc', 'Before any meeting begins, both parties agree on what success looks like and what would cause either side to walk away. We define exit criteria early — so there are no surprises, no wasted time, and no ambiguity about where things stand.')
                }
              ].map((item, idx) => (
                <div key={idx} className="about-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <EditableText 
                    contentKey={`about.governance.${idx}.step`}
                    value={`STEP ${item.step}`}
                    as="span"
                    style={{
                      color: 'var(--primary-blue)',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '20px',
                      fontFamily: "'Manrope', sans-serif"
                    }}
                  />
                  <EditableText 
                    contentKey={`about.governance.${idx}.title`}
                    value={item.title}
                    as="h3"
                    style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '12px' }}
                  />
                  <EditableText 
                    contentKey={`about.governance.${idx}.desc`}
                    value={item.desc}
                    as="p"
                    style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.65, margin: 0, fontWeight: 500 }}
                  />
                </div>
              ))}
            </div>

          </div>
        </section>
  );
}
