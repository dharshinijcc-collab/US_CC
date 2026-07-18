'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';
import EditableImage from '@/components/pages/admin/EditableImage';
import type { TeamMember } from '@/types/team.types';



export default function AboutHero({ getContent }: any) {
  return (
    <section className="hero-section" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Hero Background */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(37,99,235,0.18) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }}></div>
          {/* Hero Grid */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(37,99,235,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.08) 1px, transparent 1px)', backgroundSize: '80px 80px', maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 0%, transparent 80%)', opacity: 0.4, pointerEvents: 'none', zIndex: 0 }}></div>
          {/* Ambient Glows */}
          <div style={{ position: 'absolute', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.25), transparent 70%)', top: '-200px', left: '50%', transform: 'translateX(-50%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }}></div>

          <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <EditableText 
              contentKey="about.hero.eyebrow" 
              value={getContent('about.hero.eyebrow', 'ABOUT THE STUDIO')}
              className="hero-eyebrow-pill"
              as="div"
            />
            <EditableText
              as="h1"
              contentKey="about.hero.title"
              value={getContent('about.hero.title', 'Built on trust \n and the will to execute.')}
              className="hero-title"
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {(() => {
                const headingText = getContent('about.hero.title', 'Built on trust \n and the will to execute.');
                const lines = headingText.includes('\n') ? headingText.split('\n') : [headingText];
                return lines.map((line, lineIdx) => {
                  const words = line.split(/[\s\u00a0]+/);
                  const hasNewlines = headingText.includes('\n');
                  return (
                    <React.Fragment key={lineIdx}>
                      {words.map((word: string, index: number) => {
                        if (!word) return null;
                        const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
                        const cleanWordUpper = cleanWord.toUpperCase();
                        const isBlue = ['TRUST', 'WILL', 'TO', 'EXECUTE'].includes(cleanWordUpper);
                        const isMidpoint = !hasNewlines && index === Math.floor(words.length / 2) - 1;
                        return (
                          <React.Fragment key={index}>
                            <span style={isBlue ? { color: 'var(--primary-blue)' } : {}}>
                              {word}{' '}
                            </span>
                            {isMidpoint && <br />}
                          </React.Fragment>
                        );
                      })}
                      {lineIdx < lines.length - 1 && <br />}
                    </React.Fragment>
                  );
                });
              })()}
            </EditableText>
            <EditableText 
              contentKey="about.hero.description" 
              value={getContent('about.hero.description', 'CrestCode is a venture studio born from a simple observation — identifying a truly great idea is rare, and executing it with conviction is rarer still. We exist to do both.')}
              className="hero-description"
              as="p"
              style={{ marginBottom: '32px', lineHeight: '1.8', maxWidth: '720px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Link href="/contact" className="btn-pill btn-primary">
                <EditableText 
                  contentKey="about.hero.cta" 
                  value={getContent('about.hero.cta', "Let's Build Together")}
                  as="span"
                />
              </Link>
            </div>
          </div>
        </section>
  );
}
