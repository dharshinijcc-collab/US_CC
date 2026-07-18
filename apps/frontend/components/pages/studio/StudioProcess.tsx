'use client';

import React from 'react';
import EditableText from '@/components/pages/admin/EditableText';

import {
  getPhaseTabs,
  getCurrentPhaseData
} from './helpers';

export default function StudioProcess({ studioContent, heroCarouselIndex, handleManualPhaseChange }: any) {
  return (
    <section
      id="selection-process"
      className="page-section"
      style={{
        position: 'relative',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Unified Header */}
        <div className="section-container section-container--flush-y" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-block' }}>
            <EditableText
              contentKey="studio.phases.eyebrow"
              value={studioContent.phases?.eyebrow || "Selection Process"}
              className="hero-eyebrow-pill"
            />
          </div>
          <EditableText
            as="h2"
            contentKey="studio.phases.title"
            value={studioContent.phases?.title || "Seven Steps. One Mission."}
            className="section-title"
            style={{
              color: '#0F172A',
              maxWidth: '800px',
              margin: '0 auto 16px',
            }}
          />
          <EditableText
            as="p"
            contentKey="studio.phases.subtitle"
            value={studioContent.phases?.subtitle || "Our structured blueprint for transforming bold concepts into venture-scale realities."}
            className="section-subtitle"
            style={{
              maxWidth: '640px',
              margin: '0 auto',
              color: '#64748B'
            }}
          />
        </div>

        {/* Stepper Navigation */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: '#FFFFFF',
          marginBottom: '40px',
        }}>
          <div className="section-container section-container--flush-y">
            <div className="selection-stepper-container" style={{
              maxWidth: '960px',
              margin: '0 auto',
            }}>
              {getPhaseTabs(studioContent).map((tab, idx) => {
                const isActive = heroCarouselIndex === idx;
                const isCompleted = heroCarouselIndex > idx;
                return (
                  <React.Fragment key={tab.id}>
                    <button
                      onClick={() => handleManualPhaseChange(tab.id)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        background: 'transparent',
                        border: 'none',
                        padding: 0,
                        minWidth: '72px',
                        outline: 'none',
                      }}
                    >
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: 700,
                        fontFamily: "'Manrope', sans-serif",
                        background: isActive ? '#005AE2' : (isCompleted ? '#E6F4EA' : '#ffffff'),
                        color: isActive ? '#ffffff' : (isCompleted ? '#137333' : '#64748B'),
                        border: isActive ? '2px solid #005AE2' : (isCompleted ? '2px solid #10B981' : '2px solid #D1D5DB'),
                        transition: 'all 0.3s ease',
                      }}>
                        {isCompleted ? '✓' : (idx + 1)}
                      </div>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        fontFamily: "'Manrope', sans-serif",
                        letterSpacing: '0.08em',
                        textAlign: 'center',
                        color: isActive ? '#005AE2' : '#64748B',
                        transition: 'all 0.3s ease',
                      }}>
                        <EditableText contentKey={`studio.selection_process.tabs.${idx}.title`} value={tab.title} />
                      </span>
                    </button>
                    {idx < getPhaseTabs(studioContent).length - 1 && (
                      <div style={{
                        flex: 1,
                        height: '2px',
                        background: heroCarouselIndex > idx ? '#10B981' : '#E5E7EB',
                        margin: '0 4px',
                        transition: 'all 0.3s ease',
                        maxWidth: '80px',
                        minWidth: '20px',
                      }} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="section-container section-container--flush-y">
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '20px',
            padding: 'clamp(20px, 4vw, 48px) clamp(16px, 4vw, 48px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.015)',
            maxWidth: '960px',
            margin: '0 auto',
          }}>
            {/* Phase Number Label */}
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
              STEP {getCurrentPhaseData(studioContent, heroCarouselIndex).phaseNum} — {getCurrentPhaseData(studioContent, heroCarouselIndex).phaseKey}
            </span>

            {/* Main Title */}
            <h3 style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              fontWeight: 700,
              color: '#0F172A',
              lineHeight: 1.25,
              marginBottom: '20px',
              fontFamily: "'Manrope', sans-serif"
            }}>
              <EditableText
                contentKey={`studio.selection_process.items.${heroCarouselIndex}.title`}
                value={getCurrentPhaseData(studioContent, heroCarouselIndex).title}
              />
            </h3>

            {/* Description Block */}
            <div style={{
              borderLeft: '3px solid #005AE2',
              paddingLeft: '16px',
              marginBottom: '32px',
            }}>
              <p style={{
                fontSize: '0.975rem',
                color: '#475569',
                lineHeight: 1.6,
                margin: 0,
                fontWeight: 500,
              }}>
                <EditableText
                  contentKey={`studio.selection_process.items.${heroCarouselIndex}.description`}
                  value={getCurrentPhaseData(studioContent, heroCarouselIndex).description}
                />
              </p>
            </div>

            {/* Divider Line */}
            <div style={{
              height: '1px',
              background: '#E2E8F0',
              marginBottom: '32px',
            }} />

            {/* Bullet Points */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
              {getCurrentPhaseData(studioContent, heroCarouselIndex).bullets.map((bullet: any, bIdx: number) => (
                <div key={bIdx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#F5F5F4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#787880',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}>
                    {bIdx + 1}
                  </div>
                  <div>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: '#0F172A',
                      margin: '0 0 4px 0',
                      fontFamily: "'Manrope', sans-serif"
                    }}>
                      <EditableText
                        contentKey={`studio.selection_process.items.${heroCarouselIndex}.bullets.${bIdx}.title`}
                        value={bullet.title}
                      />
                    </h4>
                    {bullet.duration && (
                      <span style={{
                        fontSize: '0.8rem',
                        color: '#787880',
                        display: 'block',
                        marginBottom: '4px',
                        fontWeight: 700,
                        fontFamily: "'Manrope', sans-serif"
                      }}>
                        <EditableText
                          contentKey={`studio.selection_process.items.${heroCarouselIndex}.bullets.${bIdx}.duration`}
                          value={bullet.duration}
                        />
                      </span>
                    )}
                    <p style={{
                      fontSize: '0.925rem',
                      color: '#475569',
                      lineHeight: 1.5,
                      margin: 0,
                    }}>
                      <EditableText
                        contentKey={`studio.selection_process.items.${heroCarouselIndex}.bullets.${bIdx}.desc`}
                        value={bullet.desc}
                      />
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Metrics Header */}
            {getCurrentPhaseData(studioContent, heroCarouselIndex).metricHeader && (
              <h4 style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#787880',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '20px',
                fontFamily: "'Manrope', sans-serif"
              }}>
                <EditableText
                  contentKey={`studio.selection_process.items.${heroCarouselIndex}.metricHeader`}
                  value={getCurrentPhaseData(studioContent, heroCarouselIndex).metricHeader}
                />
              </h4>
            )}

            {/* Metrics Cards Grid */}
            <div className="metrics-grid">
              {getCurrentPhaseData(studioContent, heroCarouselIndex).metrics.map((metric: any, mIdx: number) => (
                <div key={mIdx} style={{
                  background: '#F5F5F4',
                  borderRadius: '12px',
                  padding: '20px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    {metric.num && (
                      <div style={{
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        fontSize: '10px',
                        fontWeight: 700,
                        color: '#787880',
                        fontFamily: "'Manrope', sans-serif"
                      }}>
                        {metric.num}
                      </div>
                    )}
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#787880',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      fontFamily: "'Manrope', sans-serif"
                    }}>
                      <EditableText
                        contentKey={`studio.selection_process.items.${heroCarouselIndex}.metrics.${mIdx}.label`}
                        value={metric.label}
                      />
                    </span>
                  </div>
                  <div style={{
                    fontSize: '1.35rem',
                    fontWeight: 800,
                    color: metric.valueColor || '#0F172A',
                    marginBottom: metric.sub ? '6px' : '0px',
                    fontFamily: "'Manrope', sans-serif",
                    lineHeight: 1.2,
                  }}>
                    <EditableText
                      contentKey={`studio.selection_process.items.${heroCarouselIndex}.metrics.${mIdx}.value`}
                      value={metric.value}
                    />
                  </div>
                  {metric.sub && (
                    <p style={{
                      fontSize: '0.85rem',
                      color: '#64748B',
                      lineHeight: 1.45,
                      margin: 0,
                    }}>
                      <EditableText
                        contentKey={`studio.selection_process.items.${heroCarouselIndex}.metrics.${mIdx}.sub`}
                        value={metric.sub}
                      />
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider Line at Bottom */}
        <div className="section-container section-container--flush-y" style={{ paddingTop: '40px' }}>
          <div style={{
            maxWidth: '960px',
            margin: '0 auto',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(0,90,226,0.1), transparent)',
          }} />
        </div>
      </div>
    </section>
  );
}
