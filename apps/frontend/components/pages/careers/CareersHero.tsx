'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';
import EditableImage from '@/components/pages/admin/EditableImage';
import { motion } from 'framer-motion';
import { 
  Rocket, TrendingUp, Users, Target, BookOpen, Clock, Layout, Heart, Calendar, Laptop, ArrowRight, MapPin, Briefcase, ChevronRight, Check, Upload, FileText, X
} from 'lucide-react';



export default function CareersHero({ careersContent, handleScroll }: any) {
  return (
    <section className="hero-section" style={{ backgroundColor: '#F1F5F9', position: 'relative', overflow: 'hidden', padding: '80px 0' }}>
          {/* Hero Background */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(37,99,235,0.18) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 20% 80%, rgba(37,99,235,0.08) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }}></div>
          {/* Hero Grid */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(37,99,235,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.08) 1px, transparent 1px)', backgroundSize: '80px 80px', maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 0%, transparent 80%)', opacity: 0.4, pointerEvents: 'none', zIndex: 0 }}></div>
          {/* Ambient Glows */}
          <div style={{ position: 'absolute', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(0, 82, 255, 0.25), transparent 70%)', top: '-200px', left: '50%', transform: 'translateX(-50%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }}></div>
          <div style={{ position: 'absolute', width: '520px', height: '520px', background: 'radial-gradient(circle, rgba(0, 82, 255, 0.22), transparent 70%)', bottom: '0px', left: '0px', filter: 'blur(90px)', pointerEvents: 'none', zIndex: 0 }}></div>
          <div style={{ position: 'absolute', width: '520px', height: '520px', background: 'radial-gradient(circle, rgba(0, 82, 255, 0.22), transparent 70%)', bottom: '0px', right: '0px', filter: 'blur(90px)', pointerEvents: 'none', zIndex: 0 }}></div>

          <div className="section-container pt-0 pb-0" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%', maxWidth: '960px' }}>
            <span className="hero-eyebrow-pill" style={{ marginBottom: '32px', marginTop: '0px' }}>
              <EditableText contentKey="careers.hero.eyebrow" value={careersContent.hero.eyebrow} />
            </span>
            <EditableText
              as="h1"
              contentKey="careers.hero.title"
              value={careersContent.hero.title || "Build Meaningful Technology With Us"}
              className="hero-title"
              style={{ whiteSpace: 'pre-wrap', width: '100%', textAlign: 'center' }}
            >
              {(() => {
                const headingText = careersContent.hero.title || "Build Meaningful Technology With Us";
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
                        const isBlue = ['US', 'CRESTCODE', 'CAREERS'].includes(cleanWordUpper);
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
            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.125rem)', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '40px', maxWidth: '720px', fontWeight: 500, marginInline: 'auto', textAlign: 'center' }}>
              <EditableText contentKey="careers.hero.description" value={careersContent.hero.description} />
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
              <button onClick={() => handleScroll('open-positions')} className="btn-primary-style">
                <EditableText contentKey="careers.hero.primaryButton" value={careersContent.hero.primaryButton} />
              </button>
              <button onClick={() => handleScroll('benefits')} className="btn-secondary-style">
                <EditableText contentKey="careers.hero.secondaryButton" value={careersContent.hero.secondaryButton} />
              </button>
            </div>
          </div>
        </section>
  );
}
