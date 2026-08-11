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




export default function StudioVentureModel({ studioContent, renderCellText }: any) {
  return (
    <section className="page-section" style={{
          background: 'linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)',
          position: 'relative',
          paddingTop: '48px',
          paddingBottom: '48px',
        }}>
          <div className="section-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            
            {/* ── TOP: Eyebrow Pill ── */}
            <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
              <span className="hero-eyebrow-pill" style={{ display: 'inline-block', marginBottom: 0 }}>
                <EditableText contentKey="studio.selectiveness.thesisLabel" value={studioContent.selectiveness?.thesisLabel || "LET'S START FROM HERE"} />
              </span>
            </div>

            <div className="thesis-grid">

              {/* ── LEFT: Quadrant Chart ── */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{
                    fontSize: 'clamp(1.5rem, 2.5vw, 2.1rem)',
                    fontWeight: 800,
                    color: '#0F172A',
                    lineHeight: 1.25,
                    letterSpacing: '-0.02em',
                    fontFamily: "'Manrope', sans-serif",
                    marginBottom: '1.25rem',
                    textTransform: 'uppercase',
                    marginTop: 0
                  }}>
                    <EditableText contentKey="studio.selectiveness.thesisTitle" value={studioContent.selectiveness?.thesisTitle || "INVESTMENT THESIS: SMALL BUSINESSES ARE STILL RUNNING ON YESTERDAY'S TOOLS"} />
                  </h3>

                  {/* Quadrant Chart — matches reference image */}
                  <div style={{ position: 'relative', paddingTop: '12px', paddingBottom: '0px', paddingLeft: '0px' }}>

                    {/* Chart box */}
                    <div style={{
                      position: 'relative',
                      width: '100%', maxWidth: '340px',
                      aspectRatio: '1 / 1',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                      backgroundColor: '#fff',
                    }}>
                      {/* ── Quadrant fills (uniform lavender left, mint green right) ── */}
                      {/* Q2 top-left: lavender */}
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '50%', height: '50%', backgroundColor: '#F5F3FF' }} />
                      {/* Q1 top-right: mint green */}
                      <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '50%', backgroundColor: '#F0FDF4' }} />
                      {/* Q3 bottom-left: lavender */}
                      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '50%', height: '50%', backgroundColor: '#F5F3FF' }} />
                      {/* Q4 bottom-right: mint green */}
                      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '50%', height: '50%', backgroundColor: '#F0FDF4' }} />

                      {/* ── Divider lines ── */}
                      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', backgroundColor: '#D1D9E4', transform: 'translateX(-50%)' }} />
                      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', backgroundColor: '#D1D9E4', transform: 'translateY(-50%)' }} />

                      {/* ── Products ── (label above, circle centered exactly) ── */}

                      {/* Limelite — Q1: top-right, broad business */}
                      <div style={{
                        position: 'absolute',
                        left: '70%',
                        top: '25%',
                        transform: 'translate(-50%, -50%)',
                        width: '16px',
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10
                      }}>
                        <span style={{
                          position: 'absolute',
                          bottom: '100%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          fontFamily: "'Inter', sans-serif",
                          whiteSpace: 'nowrap',
                          marginBottom: '5px'
                        }}>
                          <EditableText
                            contentKey="studio.selectiveness.products.limelite"
                            value={studioContent.selectiveness?.products?.limelite || "Limelite"}
                            style={{ color: '#1A7A4A' }}
                          />
                        </span>
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #22C55E', backgroundColor: 'transparent' }} />
                      </div>

                      {/* Dockly — Q3: bottom-left, broad family */}
                      <div style={{
                        position: 'absolute',
                        left: '30%',
                        top: '25%',
                        transform: 'translate(-50%, -50%)',
                        width: '16px',
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10
                      }}>
                        <span style={{
                          position: 'absolute',
                          bottom: '100%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          fontFamily: "'Inter', sans-serif",
                          whiteSpace: 'nowrap',
                          marginBottom: '5px'
                        }}>
                          <EditableText
                            contentKey="studio.selectiveness.products.dockly"
                            value={studioContent.selectiveness?.products?.dockly || "Dockly"}
                            style={{ color: '#4338CA' }}
                          />
                        </span>
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #6366F1', backgroundColor: 'transparent' }} />
                      </div>

                      {/* CastleGEC — Q3: bottom-left lower area, deeper niche */}
                      <div style={{
                        position: 'absolute',
                        left: '36%',
                        top: '70%',
                        transform: 'translate(-50%, -50%)',
                        width: '16px',
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10
                      }}>
                        <span style={{
                          position: 'absolute',
                          top: '100%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          fontFamily: "'Inter', sans-serif",
                          whiteSpace: 'nowrap',
                          marginTop: '5px'
                        }}>
                          <EditableText
                            contentKey="studio.selectiveness.products.castleGEC"
                            value={studioContent.selectiveness?.products?.castleGEC || "CastleGEC"}
                            style={{ color: '#4338CA' }}
                          />
                        </span>
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #6366F1', backgroundColor: 'transparent' }} />
                      </div>

                      {/* OpenCap — centered where X and Y axes meet */}
                      <div style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '16px',
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 12
                      }}>
                        <span style={{
                          position: 'absolute',
                          bottom: '100%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontSize: '0.65rem',
                          fontWeight: 600,
                          fontFamily: "'Inter', sans-serif",
                          whiteSpace: 'nowrap',
                          marginBottom: '5px'
                        }}>
                          <EditableText
                            contentKey="studio.selectiveness.products.openCap"
                            value={studioContent.selectiveness?.products?.openCap || "OpenCap"}
                            style={{ color: '#94A3B8' }}
                          />
                        </span>
                        <div style={{
                          width: '15px',
                          height: '15px',
                          borderRadius: '50%',
                          border: '1.5px dashed #94A3B8',
                          backgroundColor: '#fff',
                        }} />
                      </div>

                      {/* NestBloq — Q4: bottom-right, near center */}
                      <div style={{
                        position: 'absolute',
                        left: '70%',
                        top: '68%',
                        transform: 'translate(-50%, -50%)',
                        width: '16px',
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10
                      }}>
                        <span style={{
                          position: 'absolute',
                          top: '100%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          fontFamily: "'Inter', sans-serif",
                          whiteSpace: 'nowrap',
                          marginTop: '5px'
                        }}>
                          <EditableText
                            contentKey="studio.selectiveness.products.nestBloq"
                            value={studioContent.selectiveness?.products?.nestBloq || "NestBloq"}
                            style={{ color: '#1A7A4A' }}
                          />
                        </span>
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #22C55E', backgroundColor: 'transparent' }} />
                      </div>

                    </div>{/* end chart box */}

                    {/* X-axis labels: Family left, Business right */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '340px', marginTop: '12px' }}>
                      <div style={{ textAlign: 'left', fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', lineHeight: 1.3 }}>
                        <div style={{ fontWeight: 800, color: '#0F172A', letterSpacing: '0.06em' }}>
                          <EditableText
                            contentKey="studio.selectiveness.axis.family"
                            value={studioContent.selectiveness?.axis?.family || "Family"}
                          />
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', lineHeight: 1.3 }}>
                        <div style={{ fontWeight: 800, color: '#0F172A', letterSpacing: '0.06em' }}>
                          <EditableText
                            contentKey="studio.selectiveness.axis.business"
                            value={studioContent.selectiveness?.axis?.business || "Business"}
                          />
                        </div>
                      </div>
                    </div>

                  </div>{/* end chart wrapper */}
                </div>
              </div>

              {/* ── RIGHT: Editorial text ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'flex-start', paddingTop: '4px' }}>
                {[
                  { key: 'thesisP1', defaultVal: "Families managing the moving parts of a household. Small business owners running operations with no IT department behind them. Different scale, same problem — they're stuck with spreadsheets, phone calls, and guesswork, while the software built for them is either too generic to fit how they actually operate, or too complex to bother adopting." },
                  { key: 'thesisP2', defaultVal: "It's not for lack of technology. It's cost, habit, and a real fear: that handing the work over to software means losing the judgment that made it succeed in the first place." },
                  { key: 'thesisP3', defaultVal: "We build for both sides of that gap. For families, that means products like Dockly and CastleGEC — tools that hold the everyday logistics and the major decisions of a household in one place, instead of scattered across apps no one fully trusts. For small businesses, that means products like Limelite and NestBloq — tools built around how an independent operator actually works, not how an enterprise vendor assumes they should." },
                  { key: 'thesisP4', defaultVal: "That's our bet: the families and small operators still under-digitized today are the ones with the most room to grow tomorrow — and the ones we're building for first." }
                ].map((item, idx) => {
                  const rawValue = studioContent.selectiveness?.[item.key] || item.defaultVal;
                  
                  const formatThesisText = (text: string) => {
                    if (!text) return text;
                    const parts = text.split(/(Dockly|CastleGEC|Limelite|NestBloq|That's our bet)/g);
                    return parts.map((part, i) => {
                      if (['Dockly', 'CastleGEC', 'Limelite', 'NestBloq'].includes(part)) {
                        return (
                          <strong key={i} style={{ color: '#0F172A', fontWeight: 800 }}>
                            {part}
                          </strong>
                        );
                      }
                      if (part === "That's our bet") {
                        return (
                          <strong key={i} style={{ color: '#005AE2', fontWeight: 800 }}>
                            {part}
                          </strong>
                        );
                      }
                      return part;
                    });
                  };

                  return (
                    <p
                      key={item.key}
                      style={{
                        margin: 0,
                        fontSize: 'clamp(0.9rem, 2vw, 0.95rem)',
                        lineHeight: 1.68,
                        color: '#64748B',
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 500,
                        textAlign: 'justify',
                        textJustify: 'inter-word',
                      }}
                    >
                      <EditableText
                        as="span"
                        contentKey={`studio.selectiveness.${item.key}`}
                        value={rawValue}
                      >
                        {formatThesisText(rawValue)}
                      </EditableText>
                    </p>
                  );
                })}
              </div>

            </div>
          </div>
        </section>
  );
}
