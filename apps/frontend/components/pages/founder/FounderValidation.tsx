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




export default function FounderValidation({ homeContent, handleScroll, items, activeProd, setActiveProd, renderProductIcon, prod, resolvedStatus, PARTNER_PRODUCTS, rawProd }: any) {
  return (
    <section className="page-section" style={{ backgroundColor: '#F8FAFC', fontFamily: "'Inter', sans-serif" }}>
              <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
                {/* Section Eyebrow */}
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                  <span style={{
                    display: 'inline-block',
                    background: '#E6EFFF',
                    color: '#005AE2',
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    padding: '8px 18px',
                    borderRadius: '100px',
                    marginBottom: '16px',
                  }}>
                    <EditableText
                      contentKey="home.partnerProducts.eyebrow"
                      value={homeContent.partnerProducts?.eyebrow || "Partners' Products"}
                    />
                  </span>
                  <h2 style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                    fontWeight: 800,
                    color: '#0F172A',
                    letterSpacing: '-0.02em',
                    margin: '0 auto 12px',
                    lineHeight: 1.25,
                  }}>
                    <EditableText
                      contentKey="home.partnerProducts.title"
                      value={homeContent.partnerProducts?.title || "What we've built together"}
                    />
                  </h2>
                  <p style={{ color: '#64748B', fontSize: '1rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6, fontWeight: 500 }}>
                    <EditableText
                      contentKey="home.partnerProducts.description"
                      value={homeContent.partnerProducts?.description || "Real ventures built in partnership with founders who chose to build, not just plan."}
                    />
                  </p>
                </div>

                {/* Two-column layout */}
                <div className="pp-layout">
                  {/* Left sidebar — product list */}
                  <div className="pp-sidebar">
                    {items.map((p: any, idx: number) => {
                      const nameToRender = p.name === 'VHOA' ? 'NestBloq' : p.name;
                      const taglineToRender = p.name === 'VHOA' ? 'Partner operations' : p.tagline;
                      
                      return (
                        <button
                          key={p.id || idx}
                          onClick={() => setActiveProd(idx)}
                          data-active={activeProd === idx ? 'true' : 'false'}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            width: '100%',
                            padding: '14px 20px',
                            border: 'none',
                            borderLeft: activeProd === idx ? `3px solid #005AE2` : '3px solid transparent',
                            background: activeProd === idx ? '#FFFFFF' : 'transparent',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {/* Icon box */}
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            background: activeProd === idx ? '#E6EFFF' : '#FFFFFF',
                            color: activeProd === idx ? '#005AE2' : '#475569',
                            border: activeProd === idx ? '1px solid #BAE6FD' : '1px solid #E5E7EB',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            transition: 'all 0.2s ease',
                            overflow: 'hidden'
                          }}>
                            {renderProductIcon(p, idx)}
                          </div>
                          <div>
                            <div style={{
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 700,
                              fontSize: '0.95rem',
                              color: activeProd === idx ? '#0F172A' : '#475569',
                              lineHeight: 1.3,
                              transition: 'color 0.2s',
                            }}>
                              <EditableText
                                contentKey={`home.partnerProducts.items.${idx}.name`}
                                value={nameToRender}
                              />
                            </div>
                            <div style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: '0.8rem',
                              color: '#6B7280',
                              fontWeight: 500,
                              marginTop: '2px',
                            }}>
                              <EditableText
                                contentKey={`home.partnerProducts.items.${idx}.tagline`}
                                value={taglineToRender}
                              />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Right detail panel */}
                  <div className="pp-content">
                    {/* Product name + subtitle */}
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
                        <h3 className="pp-product-name" style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '2.25rem',
                          fontWeight: 800,
                          color: '#0F172A',
                          letterSpacing: '-0.03em',
                          margin: 0,
                        }}>
                          <EditableText
                            contentKey={`home.partnerProducts.items.${activeProd}.name`}
                            value={prod.name}
                          />
                        </h3>

                        {/* Dynamic Status Badges matching layout requirements */}
                        {resolvedStatus && (
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                            {resolvedStatus.type === 'live' && (
                              <>
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  backgroundColor: '#E6F4EA',
                                  color: '#137333',
                                  padding: '4px 12px',
                                  borderRadius: '100px',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  fontFamily: "'Inter', sans-serif",
                                }}>
                                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" style={{ flexShrink: 0 }}>
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                  Live
                                </span>
                                {resolvedStatus.subText && (
                                  <a href={prod.liveUrl} target="_blank" rel="noopener noreferrer" style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    backgroundColor: '#FFFFFF',
                                    color: '#3C4043',
                                    border: '1.5px solid #DADCE0',
                                    padding: '3px 12px',
                                    borderRadius: '100px',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    fontFamily: "'Inter', sans-serif",
                                    textDecoration: 'none',
                                    cursor: 'pointer',
                                    transition: 'border-color 0.2s, color 0.2s'
                                  }}
                                  className="web-ready-link"
                                  >
                                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" style={{ flexShrink: 0 }}>
                                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                      <line x1="8" y1="21" x2="16" y2="21" />
                                      <line x1="12" y1="17" x2="12" y2="21" />
                                    </svg>
                                    {resolvedStatus.subText}
                                  </a>
                                )}
                              </>
                            )}

                            {resolvedStatus.type === 'beta' && (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                backgroundColor: '#E8F0FE',
                                color: '#1A73E8',
                                padding: '4px 12px',
                                borderRadius: '100px',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                fontFamily: "'Inter', sans-serif",
                              }}>
                                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" style={{ flexShrink: 0 }}>
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                                {resolvedStatus.text}
                              </span>
                            )}

                            {resolvedStatus.type === 'development' && (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                backgroundColor: '#FEF3C7',
                                color: '#D97706',
                                padding: '4px 12px',
                                borderRadius: '100px',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                fontFamily: "'Inter', sans-serif",
                              }}>
                                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" style={{ flexShrink: 0 }}>
                                  <circle cx="12" cy="12" r="10" />
                                  <polyline points="12 6 12 12 16 14" />
                                </svg>
                                {resolvedStatus.text}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <p style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '1.125rem',
                        color: '#005AE2',
                        fontWeight: 600,
                        margin: 0,
                        lineHeight: 1.4,
                      }}>
                        <EditableText
                          contentKey={`home.partnerProducts.items.${activeProd}.subtitle`}
                          value={prod.subtitle}
                        />
                      </p>
                    </div>


                    {/* What CrestCode did */}
                    <div style={{
                      background: '#F1F5F9',
                      borderRadius: '12px',
                      padding: '20px 24px',
                      marginBottom: '28px',
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '10px',
                      }}>
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .3 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                          <path d="M9 18h6" />
                          <path d="M10 22h4" />
                        </svg>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B7280' }}>What CrestCode Did</span>
                      </div>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1rem', color: '#334155', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                        <EditableText
                          contentKey={`home.partnerProducts.items.${activeProd}.whatWeDid`}
                          value={prod.whatWeDid}
                        />
                      </p>
                    </div>

                    {/* Key Features */}
                    <div style={{ marginBottom: '28px' }}>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B7280', marginBottom: '12px' }}>Key Features</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {(prod.features || []).map((f: any, i: number) => {
                          const matchedFallbackProduct = PARTNER_PRODUCTS.find(p => p.name.toLowerCase() === prod.name?.toLowerCase());
                          const fallbackIcon = matchedFallbackProduct?.features?.[i]?.icon;

                          return (
                            <span key={i} style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              background: '#F1F5F9',
                              borderRadius: '8px',
                              padding: '8px 16px',
                              fontSize: '0.875rem',
                              color: '#334155',
                              fontWeight: 600,
                            }}>
                              {f.icon || fallbackIcon}
                              <EditableText
                                contentKey={`home.partnerProducts.items.${activeProd}.features.${i}.text`}
                                value={f.text}
                              />
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Industry / Duration / Team */}
                    <div className="pp-stats-grid">
                      {[
                        { label: 'Industry', value: prod.industry, key: 'industry' },
                        { label: 'Duration', value: prod.duration, key: 'duration' },
                        { label: 'Team size', value: prod.team, key: 'team' },
                      ].map((meta, i) => (
                        <div key={i} style={{
                          background: '#F1F5F9',
                          borderRadius: '12px',
                          padding: '16px 18px',
                        }}>
                          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: '#6B7280', fontWeight: 600, marginBottom: '6px' }}>{meta.label}</div>
                          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>
                            <EditableText
                              contentKey={`home.partnerProducts.items.${activeProd}.${meta.key}`}
                              value={meta.value}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Screenshots Gallery */}
                    {rawProd.gallery_images && Array.isArray(rawProd.gallery_images) && rawProd.gallery_images.length > 0 && (
                      <div style={{ marginBottom: '32px' }}>
                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B7280', marginBottom: '12px' }}>Product Gallery / Screenshots</div>
                        <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '12px' }}>
                          {rawProd.gallery_images.map((imgUrl: string, imgIdx: number) => (
                            <img
                              key={imgIdx}
                              src={imgUrl}
                              alt={`${rawProd.name} Screenshot ${imgIdx + 1}`}
                              style={{ height: '140px', borderRadius: '8px', border: '1px solid #E2E8F0', objectFit: 'cover', cursor: 'pointer', transition: 'transform 0.2s' }}
                              onClick={() => window.open(imgUrl, '_blank')}
                              onMouseOver={(e: any) => e.currentTarget.style.transform = 'scale(1.05)'}
                              onMouseOut={(e: any) => e.currentTarget.style.transform = 'scale(1)'}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tech Stack */}
                    <div style={{ marginBottom: '32px' }}>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B7280', marginBottom: '12px' }}>Technology Stack</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {(prod.stack || []).map((s: string, i: number) => (
                          <span key={i} style={{
                            background: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            borderRadius: '8px',
                            padding: '6px 16px',
                            fontSize: '0.875rem',
                            color: '#334155',
                            fontWeight: 600,
                          }}>
                            <EditableText
                              contentKey={`home.partnerProducts.items.${activeProd}.stack.${i}`}
                              value={s}
                            />
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action CTA Button based on status */}
                    {resolvedStatus && resolvedStatus.type === 'live' && (
                      <a href={prod.liveUrl} target="_blank" rel="noopener noreferrer" className="pp-cta-btn">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="7" y1="17" x2="17" y2="7" />
                          <polyline points="7 7 17 7 17 17" />
                        </svg>
                        Visit live product
                      </a>
                    )}

                    {resolvedStatus && resolvedStatus.type === 'beta' && (
                      <div className="pp-cta-btn" style={{ background: '#F8FAFC', color: '#64748B', borderColor: '#E2E8F0', cursor: 'default' }}>
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        Beta phase
                      </div>
                    )}

                    {resolvedStatus && resolvedStatus.type === 'development' && (
                      <div className="pp-cta-btn" style={{ background: '#F8FAFC', color: '#64748B', borderColor: '#E2E8F0', cursor: 'default' }}>
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        In development
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
  );
}
