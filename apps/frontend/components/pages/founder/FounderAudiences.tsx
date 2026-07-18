'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';
import EditableImage from '@/components/pages/admin/EditableImage';
import { motion } from 'framer-motion';
import { 
  User, Building, Lightbulb, Compass, Zap, Users, TrendingUp, Cpu, Globe, Brain, Home,
  ArrowLeft, ArrowRight, Sparkles, Check, X, AlertTriangle, Info, RefreshCw, ChevronRight,
  Code2, Ban, History, Sprout, Briefcase, DollarSign, Layers, Palette
} from 'lucide-react';
import RotatingIdeaPlaceholder from '@/components/effects/RotatingIdeaPlaceholder';




export default function FounderAudiences({ homeContent, flippedCards, setFlippedCards, handleScroll, backFeaturesFallback }: any) {
  return (
    <section id="audiences-section" className="section-light" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="section-container">
            <div className="text-center">
              <EditableText
                as="h3"
                contentKey="home.audiences.eyebrow"
                value={homeContent.audiences.eyebrow}
                className="section-eyebrow cc-reveal"
              />
            </div>
            <EditableText
              as="h2"
              contentKey="home.audiences.title"
              value={homeContent.audiences.title}
              className="section-title text-center cc-reveal cc-delay-1"
            />
            <EditableText
              as="p"
              contentKey="home.audiences.subtitle"
              value={homeContent.audiences.subtitle}
              className="section-subtitle text-center cc-reveal cc-delay-2"
            />

            <div className="cards-grid" style={{ gap: '32px', maxWidth: '900px', margin: '0 auto' }}>
              {(homeContent.audiences.items || []).slice(0, 2).map((item: any, idx: number) => {
                const isFlipped = flippedCards.has(idx);
                return (
                  <div key={idx} className="audience-card-wrap">
                    <div className={`flip-card-inner ${isFlipped ? 'is-flipped' : ''}`}>
                      {/* FRONT */}
                      <div className="flip-card-front" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'between', height: '100%' }}>
                        <div>
                          <div className="card-icon">
                            {item.icon === 'user' && <User size={24} style={{ width: '24px', height: '24px', minWidth: '24px', minHeight: '24px' }} />}
                            {item.icon === 'building' && <Building size={24} style={{ width: '24px', height: '24px', minWidth: '24px', minHeight: '24px' }} />}
                            {item.icon === 'idea' && <Lightbulb size={24} style={{ width: '24px', height: '24px', minWidth: '24px', minHeight: '24px' }} />}
                          </div>
                          <EditableText
                            as="h4"
                            contentKey={`home.audiences.items.${idx}.title`}
                            value={item.title}
                            className="card-title"
                          />
                          <EditableText
                            as="p"
                            contentKey={`home.audiences.items.${idx}.description`}
                            value={item.description}
                            className="card-description"
                            style={{ minHeight: '80px' }}
                          />
                          <ul className="card-features">
                            {(item.features || []).slice(0, 3).map((feature: string, fIdx: number) => (
                              <li key={fIdx}>
                                <span className="check-icon">&#x2713;</span>
                                <EditableText
                                  contentKey={`home.audiences.items.${idx}.features.${fIdx}`}
                                  value={feature}
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div style={{ paddingTop: '24px', paddingBottom: '16px', marginTop: 'auto' }}>
                          <button
                            className="card-learn-more-btn"
                            onClick={() => setFlippedCards(prev => { const n = new Set(prev); n.add(idx); return n; })}
                          >
                            Learn More
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                              <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* BACK */}
                      <div className="flip-card-back" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '32px' }}>
                        <div style={{ flexGrow: 1 }}>
                          <p className="flip-back-eyebrow">What you walk away with:</p>
                          <h4 className="flip-back-title">{item.title}</h4>
                          <ul className="flip-back-features" style={{ marginBottom: '24px' }}>
                            {(() => {
                              const itemsToUse = (item.backFeatures && item.backFeatures.length >= 5)
                                ? item.backFeatures
                                : (backFeaturesFallback[idx] || item.features || []);
                              return itemsToUse.slice(0, 5).map((feature: string, fIdx: number) => (
                                <li key={fIdx}>
                                  <span className="flip-back-check">✓</span>
                                  <EditableText
                                    contentKey={`home.audiences.items.${idx}.backFeatures.${fIdx}`}
                                    value={feature}
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
                              style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)', fontStyle: 'italic', margin: 0, lineHeight: '1.45', fontWeight: 500 }}
                            />
                          </div>
                        )}

                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: 'auto', width: '100%' }}>
                          <Link
                            href={idx === 0 ? "/studio" : "/contact"}
                            className="btn-pill"
                            style={{
                              flexGrow: 1,
                              padding: '12px 24px',
                              borderRadius: '100px',
                              background: '#FFFFFF',
                              color: 'var(--primary-blue)',
                              fontWeight: 700,
                              fontSize: '0.875rem',
                              textAlign: 'center',
                              textDecoration: 'none',
                              boxShadow: '0 4px 12px rgba(255,255,255,0.1)'
                            }}
                          >
                            <EditableText
                              contentKey={`home.audiences.items.${idx}.backCtaText`}
                              value={idx === 0 ? "Apply to Studio" : "Start a Conversation"}
                            />

                          </Link>

                          <button
                            className="flip-back-btn"
                            style={{ padding: '12px', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.25)', color: '#ffffff' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setFlippedCards(prev => { const n = new Set(prev); n.delete(idx); return n; });
                            }}
                            title="Go Back"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
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
