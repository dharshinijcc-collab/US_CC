'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';
import EditableImage from '@/components/pages/admin/EditableImage';
import { 
  Search, HelpCircle, ChevronDown, ChevronUp, MessageSquare, ArrowRight, Sparkles
} from 'lucide-react';
import BorderBeam from '@/components/effects/BorderBeam';




export default function FaqHero({ faqContent, handleScroll, magBtn }: any) {
  return (
    <section className="hero-section" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Hero Background */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(37,99,235,0.18) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 20% 80%, rgba(37,99,235,0.08) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }}></div>
          {/* Hero Grid */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(37,99,235,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.08) 1px, transparent 1px)', backgroundSize: '80px 80px', maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 0%, transparent 80%)', opacity: 0.4, pointerEvents: 'none', zIndex: 0 }}></div>
          {/* Ambient Glows */}
          <div style={{ position: 'absolute', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.25), transparent 70%)', top: '-200px', left: '50%', transform: 'translateX(-50%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }}></div>
          <div style={{ position: 'absolute', width: '520px', height: '520px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.2), transparent 70%)', bottom: '0px', left: '0px', filter: 'blur(90px)', pointerEvents: 'none', zIndex: 0 }}></div>
          <div style={{ position: 'absolute', width: '520px', height: '520px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.2), transparent 70%)', bottom: '0px', right: '0px', filter: 'blur(90px)', pointerEvents: 'none', zIndex: 0 }}></div>

          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="hero-eyebrow-pill">
              <EditableText contentKey="faq.hero.eyebrow" value={faqContent.hero.eyebrow || "FREQUENTLY ASKED QUESTIONS"} />
            </div>
            <EditableText
              as="h1"
              contentKey="faq.hero.title"
              value={faqContent.hero.title || "Got Questions? We've Got Answers"}
              className="hero-title"
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {(() => {
                const headingText = faqContent.hero.title || "Got Questions? We've Got Answers";
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
                        const isBlue = ['QUESTIONS', 'ANSWERS'].includes(cleanWordUpper);
                        const isMidpoint = !hasNewlines && index === Math.floor(words.length / 2) - 1;
                        return (
                          <React.Fragment key={index}>
                            <span style={isBlue ? { color: '#005AE2' } : {}}>
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
            <p className="hero-description">
              <EditableText
                contentKey="faq.hero.subheading"
                value={faqContent.hero.subheading}
              />
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button ref={magBtn} className="btn-bright cc-magnetic" onClick={() => document.getElementById('faq-section')?.scrollIntoView({behavior: 'smooth'})}>
                <EditableText contentKey="faq.hero.buttonText" value={faqContent.hero.buttonText} />
              </button>
            </div>
          </div>
        </section>
  );
}
