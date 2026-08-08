'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';
import { User, Building, CheckCircle2, ArrowLeft } from 'lucide-react';
import localConfig from '@/shared/config.json';

export default function FounderAudiences({ homeContent, flippedCards, setFlippedCards, handleScroll, backFeaturesFallback }: any) {
  const audiencesData = homeContent?.audiences || (localConfig as any).home.audiences;

  return (
    <section id="audiences-section" className="section-light" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="section-container">
        <div className="text-center">
          <EditableText
            as="h3"
            contentKey="home.audiences.eyebrow"
            value={audiencesData?.eyebrow || "Who We Build For"}
            className="section-eyebrow cc-reveal"
          />
        </div>
        <EditableText
          as="h2"
          contentKey="home.audiences.title"
          value={audiencesData?.title || "Engineered For Visionaries"}
          className="section-title text-center cc-reveal cc-delay-1"
        />
        <EditableText
          as="p"
          contentKey="home.audiences.subtitle"
          value={audiencesData?.subtitle || ""}
          className="section-subtitle text-center cc-reveal cc-delay-2"
        />

        {/* Cards Grid formatted to exact Figma Specs: 522px width, 590px height */}
        <div className="cards-grid" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '32px', maxWidth: '1120px', margin: '48px auto 0' }}>
          {(audiencesData?.items || []).slice(0, 2).map((item: any, idx: number) => {
            const isFlipped = flippedCards.has(idx);

            return (
              <div
                key={idx}
                className="audience-card-wrap"
                style={{
                  width: '100%',
                  maxWidth: '522px',
                  height: '590px',
                  perspective: '1200px',
                  position: 'relative'
                }}
              >
                <div
                  className={`flip-card-inner ${isFlipped ? 'is-flipped' : ''}`}
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                  }}
                >
                  {/* FRONT */}
                  <div
                    className="flip-card-front"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backfaceVisibility: 'hidden',
                      borderRadius: '20px',
                      backgroundColor: '#F1F5F9',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 12px 32px rgba(15, 23, 42, 0.06)',
                      padding: '40px 42px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Top Right Decorative Accent (Rectangle 77 / cyan glow) */}
                    <div
                      style={{
                        position: 'absolute',
                        right: '-50px',
                        top: '-50px',
                        width: '200px',
                        height: '200px',
                        borderRadius: '50%',
                        backgroundColor: '#C4FFF8',
                        opacity: 0.35,
                        filter: 'blur(30px)',
                        pointerEvents: 'none'
                      }}
                    />

                    <div>
                      {/* Vector Icon with #1E40AF stroke */}
                      <div style={{ color: '#1E40AF', marginBottom: '24px' }}>
                        {idx === 0 ? (
                          <User size={38} strokeWidth={2.2} />
                        ) : (
                          <Building size={38} strokeWidth={2.2} />
                        )}
                      </div>

                      {/* Title: Inter, 600, 20px, #000000 */}
                      <EditableText
                        as="h3"
                        contentKey={`home.audiences.items.${idx}.title`}
                        value={item.title}
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 600,
                          fontSize: '20px',
                          lineHeight: '24px',
                          color: '#000000',
                          marginBottom: '16px'
                        }}
                      />

                      {/* Description: Inter, 400, 16px, line-height 25px (156%), #000000 */}
                      <EditableText
                        as="p"
                        contentKey={`home.audiences.items.${idx}.description`}
                        value={item.description}
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 400,
                          fontSize: '16px',
                          lineHeight: '25px',
                          color: '#000000',
                          marginBottom: '28px',
                          maxWidth: '438px'
                        }}
                      />

                      {/* Frame 26: Bullet List with #0D93F2 tick-circle icons */}
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {(item.features || []).slice(0, 3).map((feature: string, fIdx: number) => (
                          <li key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                            <CheckCircle2 size={19} style={{ color: '#0D93F2', flexShrink: 0, fill: 'rgba(13, 147, 242, 0.15)' }} />
                            <EditableText
                              contentKey={`home.audiences.items.${idx}.features.${fIdx}`}
                              value={feature}
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 500,
                                fontSize: '16px',
                                lineHeight: '25px',
                                color: '#000000'
                              }}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Frame 21: Learn More CTA Button (#0D93F2, border-radius 30px) */}
                    <div>
                      <button
                        onClick={() => setFlippedCards((prev: any) => { const n = new Set(prev); n.add(idx); return n; })}
                        style={{
                          backgroundColor: '#0D93F2',
                          color: '#FFFFFF',
                          borderRadius: '30px',
                          padding: '16px 36px',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 600,
                          fontSize: '18px',
                          lineHeight: '25px',
                          boxShadow: '0 6px 18px rgba(13, 147, 242, 0.25)',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#0280D8';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#0D93F2';
                          e.currentTarget.style.transform = 'none';
                        }}
                      >
                        Learn more
                        <span style={{ fontSize: '16px', fontWeight: 600, marginLeft: '2px' }}>»</span>
                      </button>
                    </div>
                  </div>

                  {/* BACK */}
                  <div
                    className="flip-card-back"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      borderRadius: '20px',
                      backgroundColor: '#F1F5F9',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 12px 32px rgba(15, 23, 42, 0.06)',
                      padding: '40px 42px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#0D93F2', marginBottom: '10px' }}>
                        What you walk away with:
                      </p>
                      <h4 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '20px', color: '#FFFFFF', marginBottom: '20px' }}>
                        {item.title}
                      </h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: '14px', flexGrow: 1 }}>
                        {(() => {
                          const itemsToUse = (item.backFeatures && item.backFeatures.length >= 5)
                            ? item.backFeatures
                            : (backFeaturesFallback[idx] || item.features || []);
                          return itemsToUse.slice(0, 5).map((feature: string, fIdx: number) => (
                            <li key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                              <CheckCircle2 size={19} style={{ color: '#0D93F2', flexShrink: 0, marginTop: '2px', fill: 'rgba(13, 147, 242, 0.15)' }} />
                              <EditableText
                                contentKey={`home.audiences.items.${idx}.backFeatures.${fIdx}`}
                                value={feature}
                                style={{
                                  fontFamily: "'Inter', sans-serif",
                                  fontWeight: 500,
                                  fontSize: '15px',
                                  lineHeight: '22px',
                                  color: '#E2E8F0'
                                }}
                              />
                            </li>
                          ));
                        })()}
                      </ul>
                    </div>

                    {item.backNote && (
                      <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                        <EditableText
                          as="p"
                          contentKey={`home.audiences.items.${idx}.backNote`}
                          value={item.backNote}
                          style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#475569', fontStyle: 'italic', margin: 0, lineHeight: '1.5', fontWeight: 500 }}
                        />
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%' }}>
                      <Link
                        href={idx === 0 ? "/studio" : "/contact"}
                        className="btn-pill"
                        style={{
                          flexGrow: 1,
                          padding: '14px 28px',
                          borderRadius: '30px',
                          backgroundColor: '#0D93F2',
                          color: '#FFFFFF',
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 600,
                          fontSize: '16px',
                          textAlign: 'center',
                          textDecoration: 'none',
                          border: 'none',
                          boxShadow: '0 6px 18px rgba(13, 147, 242, 0.25)'
                        }}
                      >
                        <EditableText
                          contentKey={`home.audiences.items.${idx}.backCtaText`}
                          value={idx === 0 ? "Apply to Studio" : "Start a Conversation"}
                        />
                      </Link>

                      <button
                        style={{
                          padding: '12px',
                          borderRadius: '50%',
                          width: '44px',
                          height: '44px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          backgroundColor: '#E2E8F0',
                          color: '#0F172A',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setFlippedCards((prev: any) => { const n = new Set(prev); n.delete(idx); return n; });
                        }}
                        title="Go Back"
                      >
                        <ArrowLeft size={20} strokeWidth={2.2} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
