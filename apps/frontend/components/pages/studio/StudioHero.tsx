'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';
import EditableImage from '@/components/pages/admin/EditableImage';
import { motion } from 'framer-motion';
import { 
  Compass, Cpu, Layers, Sparkles, Check, X, HelpCircle, ChevronDown, MessageSquare
} from 'lucide-react';
import ScrollStack, { ScrollStackItem } from '@/components/effects/ScrollStack';




export default function StudioHero({ studioContent, handleManualPhaseChange, heroCarouselIndex }: any) {
  return (
    <section className="hero-section" style={{ position: 'relative', overflow: 'hidden', padding: '80px 0' }}>
          {/* Hero Background */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(37,99,235,0.18) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 20% 80%, rgba(37,99,235,0.08) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }}></div>
          {/* Hero Grid */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(37,99,235,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.08) 1px, transparent 1px)', backgroundSize: '80px 80px', maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 0%, transparent 80%)', opacity: 0.4, pointerEvents: 'none', zIndex: 0 }}></div>
          {/* Ambient Glows */}
          <div style={{ position: 'absolute', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.25), transparent 70%)', top: '-200px', left: '50%', transform: 'translateX(-50%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }}></div>
          <div style={{ position: 'absolute', width: '520px', height: '520px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.2), transparent 70%)', bottom: '0px', left: '0px', filter: 'blur(90px)', pointerEvents: 'none', zIndex: 0 }}></div>
          <div style={{ position: 'absolute', width: '520px', height: '520px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.2), transparent 70%)', bottom: '0px', right: '0px', filter: 'blur(90px)', pointerEvents: 'none', zIndex: 0 }}></div>

          <div style={{ maxWidth: '1200px', width: '100%', padding: '0 24px', boxSizing: 'border-box', margin: '0 auto', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* Part 1: Who We Are Card */}
            <div style={{
              textAlign: 'center',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              zIndex: 1,
            }}>
              <span className="hero-eyebrow-pill" style={{ marginBottom: '24px', marginTop: '0px' }}>
                <EditableText contentKey="studio.consolidated.whoweare.eyebrow" value={studioContent.consolidated?.whoweare?.eyebrow || "WHO WE ARE"} />
              </span>
              <EditableText
                as="h1"
                contentKey="studio.consolidated.whoweare.title"
                value={studioContent.consolidated?.whoweare?.title || "Not An Agency. Not An Accelerator.\nA Venture Partner."}
                className="hero-title"
              >
                {(() => {
                  const headingText = studioContent.consolidated?.whoweare?.title || "Not An Agency. Not An Accelerator.\nA Venture Partner.";
                  const lines = headingText.split('\n');
                  return lines.map((line, lineIdx) => (
                    <React.Fragment key={lineIdx}>
                      {line.split(/[\s\u00a0]+/).map((word: string, index: number) => {
                        if (!word) return null;
                        const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").toLowerCase();
                        const isBlue = cleanWord === 'partner';
                        return (
                          <span key={index} style={isBlue ? { color: '#005AE2' } : {}}>
                            {word}{' '}
                          </span>
                        );
                      })}
                      {lineIdx < lines.length - 1 && <br />}
                    </React.Fragment>
                  ));
                })()}
              </EditableText>
              <p className="hero-description" style={{ margin: '0 auto' }}>
                <EditableText
                  contentKey="studio.consolidated.whoweare.desc"
                  value={studioContent.consolidated?.whoweare?.desc || "CrestCode exists to level the playing field combining elite engineering with strategic partnership to turn bold ideas into ventures built to last, not just launched."}
                />
              </p>
            </div>

            {/* Part 2: Vision & Mission Card */}
            <div className="grid-2 grid-2-align-top" style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '24px',
              padding: '48px 48px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.015)',
              textAlign: 'left',
              gap: 'clamp(24px, 4vw, 48px)',
            }}>
              <div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#005AE2',
                  display: 'block',
                  marginBottom: '12px',
                  fontFamily: "'Manrope', sans-serif"
                }}>
                  <EditableText contentKey="studio.consolidated.vision.eyebrow" value={studioContent.consolidated?.vision?.eyebrow || "VISION & MISSION"} />
                </span>
                <h2 style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2.1rem)',
                  fontWeight: 800,
                  color: '#0F172A',
                  lineHeight: 1.3,
                  margin: 0,
                  fontFamily: "'Manrope', sans-serif",
                  letterSpacing: '-0.02em',
                }}>
                  <EditableText contentKey="studio.consolidated.vision.title" value={studioContent.consolidated?.vision?.title || "What we're building toward, and how we get there"} />
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <EditableText
                    as="p"
                    contentKey="studio.consolidated.vision.paragraph1"
                    value={studioContent.consolidated?.vision?.paragraph1 || "We envision a world where great ideas — regardless of technical background or startup experience — get the strategic and engineering firepower they deserve. No founder should have to build alone."}
                    style={{
                      fontSize: '1rem',
                      color: '#334155',
                      lineHeight: 1.7,
                      margin: 0,
                      fontWeight: 500,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {(() => {
                      const text = studioContent.consolidated?.vision?.paragraph1 || "We envision a world where great ideas — regardless of technical background or startup experience — get the strategic and engineering firepower they deserve. No founder should have to build alone.";
                      const target = "No founder should have to build alone.";
                      if (text.includes(target)) {
                        const parts = text.split(target);
                        return (
                          <>
                            {parts[0]}
                            <span style={{ fontWeight: 700, color: '#005AE2' }}>{target}</span>
                            {parts[1]}
                          </>
                        );
                      }
                      return text;
                    })()}
                  </EditableText>
                </div>
                <EditableText
                  as="p"
                  contentKey="studio.consolidated.vision.paragraph2"
                  value={studioContent.consolidated?.vision?.paragraph2 || "Day to day, that means partnering with visionary founders and business owners through strategy, elite engineering, and relentless execution — turning real problems into world-class digital products."}
                  style={{
                    fontSize: '1rem',
                    color: '#475569',
                    lineHeight: 1.7,
                    margin: 0,
                    fontWeight: 500,
                    fontFamily: "'Inter', sans-serif",
                  }}
                />
              </div>
            </div>

          </div>
        </section>
  );
}
