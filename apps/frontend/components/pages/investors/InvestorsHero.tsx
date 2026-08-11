'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';

export default function InvestorsHero({ content, getContent, handleScroll }: any) {
  return (
    <section className="hero-section" style={{ position: 'relative', overflow: 'hidden', padding: '128px 0 48px 0' }}>
      {/* Top Light Effect */}
      <div style={{ position: 'absolute', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.25), transparent 70%)', top: '-200px', left: '50%', transform: 'translateX(-50%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }}></div>
      
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        
        {/* Eyebrow Pill */}
        <div className="hero-eyebrow-pill" style={{ marginTop: '0px' }}>
          <EditableText contentKey="investors.hero.eyebrow" value={content?.investors?.hero?.eyebrow || 'INVESTOR RELATIONS'} />
        </div>

        {/* Title */}
        <div style={{ width: '100%', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
          <EditableText
            as="h1"
            contentKey="investors.hero.titleText"
            value={content?.investors?.hero?.titleText || (content?.investors?.hero?.title1 && content?.investors?.hero?.title2 ? (content.investors.hero.title1 + '\n' + content.investors.hero.title2) : 'Not Just Capital.\nBuild With Us.')}
            className="hero-title"
            style={{ color: '#020617', textAlign: 'center', margin: '0 auto 16px', display: 'inline-block' }}
          >
            {(() => {
              const titleText = content?.investors?.hero?.titleText || (content?.investors?.hero?.title1 && content?.investors?.hero?.title2 ? (content.investors.hero.title1 + '\n' + content.investors.hero.title2) : 'Not Just Capital.\nBuild With Us.');
              const lines = titleText.split('\n');
              return lines.map((line, lineIdx) => {
                const words = line.split(/[\s\u00a0]+/);
                return (
                  <React.Fragment key={lineIdx}>
                    {words.map((word: string, index: number) => {
                      if (!word) return null;
                      const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").toUpperCase();
                      const isBlue = ['CAPITAL', 'BUILD', 'US'].includes(cleanWord);
                      return (
                        <span key={index} style={isBlue ? { color: '#005AE2' } : {}}>
                          {word}{' '}
                        </span>
                      );
                    })}
                    {lineIdx < lines.length - 1 && <br />}
                  </React.Fragment>
                );
              });
            })()}
          </EditableText>
        </div>

        {/* Description Paragraph */}
        <div style={{ width: '100%', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
          <EditableText
            as="p"
            contentKey="investors.hero.description"
            value={content?.investors?.hero?.description || 'CrestCode partners with strategic investors who believe in the long game — backing the studio, the ventures, or both. We offer full transparency, shared conviction, and two clear paths to participate.'}
            className="hero-description"
            style={{ maxWidth: '720px', margin: '0 auto 40px', textAlign: 'center', lineHeight: 1.8, fontSize: 'clamp(1rem, 2vw, 1.125rem)' }}
          />
        </div>

        {/* Primary CTA Button */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Link href="/contact#form-section" className="btn-primary">
            <EditableText contentKey="investors.hero.buttonText" value={content?.investors?.hero?.buttonText || 'Express Your Interest'} />
          </Link>
        </div>

      </div>
    </section>
  );
}
