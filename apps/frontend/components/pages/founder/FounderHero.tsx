'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';
import EditableImage from '@/components/pages/admin/EditableImage';
import { motion } from 'framer-motion';
import { 
  User, Building, Lightbulb, Compass, Zap, Users, TrendingUp, Cpu, Globe, Brain, Home,
  ArrowLeft, ArrowRight, ArrowUp, Sparkles, Check, X, AlertTriangle, Info, RefreshCw, ChevronRight,
  Code2, Ban, History, Sprout, Briefcase, DollarSign, Layers, Palette
} from 'lucide-react';
import RotatingIdeaPlaceholder from '@/components/effects/RotatingIdeaPlaceholder';




export default function FounderHero({ heroRef, homeContent, ideaExamples, idea, isLoading, setIdea, handleIdeaSubmit, formMessage, submissionStep, messageType }: any) {
  const [isFocused, setIsFocused] = React.useState(false);
  
  const triggerSubmit = () => {
    if (idea.trim() && !isLoading) {
      handleIdeaSubmit({ preventDefault: () => {} });
    }
  };

  return (
    <header ref={heroRef} className="hero-section" style={{ position: 'relative', overflow: 'hidden', minHeight: '700px' }}>
          {/* Top Light Effect */}
          <div style={{ position: 'absolute', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.25), transparent 70%)', top: '-200px', left: '50%', transform: 'translateX(-50%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }}></div>
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '1200px', width: '100%' }}>
            <div className="hero-eyebrow-pill">
              <EditableText contentKey="home.hero.eyebrow" value={homeContent.hero.eyebrow} />
            </div>
            <EditableText
              as="h1"
              contentKey="home.hero.heading"
              value={homeContent.hero.heading || "Where BOLD IDEAS\nbecome REAL products"}
              className="hero-title"
              style={{ color: '#0A0F1C', whiteSpace: 'pre-wrap' }}
            >
              {(() => {
                const headingText = homeContent.hero.heading || "Where BOLD IDEAS\nbecome REAL products";
                const lines = headingText.split('\n');
                return lines.map((line, lineIdx) => (
                  <span key={lineIdx} className="hero-title-line" style={{ display: 'block' }}>
                    {line.split(/[\s\u00a0]+/).map((word: string, index: number) => {
                      if (!word) return null;
                      const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
                      const cleanWordUpper = cleanWord.toUpperCase();
                      const isBlue = ['BOLD', 'IDEAS', 'REAL', 'IDEA', 'CUSTOMER', 'CUSTOMERS', 'PRODUCTS', 'PRODUCT', 'VENTURES', 'VENTURE'].includes(cleanWordUpper);
                      return (
                        <span key={index} style={isBlue ? { color: '#005AE2' } : {}}>
                          {word}{' '}
                        </span>
                      );
                    })}
                  </span>
                ));
              })()}
            </EditableText>
            <EditableText
              as="p"
              contentKey="home.hero.subheading"
              value={homeContent.hero.subheading}
              style={{ textAlign: 'center', color: '#475569', fontSize: 'clamp(1rem, 2vw, 1.125rem)', maxWidth: '720px', margin: '0 auto 40px', lineHeight: 1.8, fontWeight: 500, textWrap: 'balance' }}
            />
          </div>

          <form id="idea-section" onSubmit={handleIdeaSubmit} method="POST" style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 10 }}>
            <div style={{
              width: '100%',
              maxWidth: '500px',
              backgroundColor: '#FFFFFF',
              background: 'linear-gradient(180deg, #FFFFFF 0%, #FCFCFD 100%)', // Layered background
              borderRadius: '24px', // Premium radius
              border: isFocused 
                ? '1.5px solid rgba(0, 90, 226, 0.35)' 
                : '1.5px solid rgba(0, 90, 226, 0.18)', // Blue inner border
              boxShadow: isFocused 
                ? '0 0 0 4px rgba(0, 90, 226, 0.10), 0 0 0 5.5px rgba(0, 90, 226, 0.25), 0 12px 40px rgba(0, 90, 226, 0.15)' 
                : '0 0 0 4px rgba(0, 90, 226, 0.05), 0 0 0 5.5px rgba(0, 90, 226, 0.15), 0 2px 6px rgba(15, 23, 42, 0.04), 0 10px 25px rgba(15, 23, 42, 0.05)', // Dual-border with faint blue-lit spacer gap in between
              padding: '24px 24px 18px 24px', // Sleeker, more compact padding
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              transition: 'border-color 250ms ease, box-shadow 250ms ease, transform 250ms ease'
            }}
              onMouseOver={e => {
                if (!isFocused) {
                  e.currentTarget.style.border = '1.5px solid rgba(0, 90, 226, 0.28)';
                  e.currentTarget.style.boxShadow = '0 0 0 4px rgba(0, 90, 226, 0.08), 0 0 0 5.5px rgba(0, 90, 226, 0.22), 0 4px 10px rgba(15, 23, 42, 0.04), 0 14px 30px rgba(15, 23, 42, 0.06)';
                }
              }}
              onMouseOut={e => {
                if (!isFocused) {
                  e.currentTarget.style.border = '1.5px solid rgba(0, 90, 226, 0.18)';
                  e.currentTarget.style.boxShadow = '0 0 0 4px rgba(0, 90, 226, 0.05), 0 0 0 5.5px rgba(0, 90, 226, 0.15), 0 2px 6px rgba(15, 23, 42, 0.04), 0 10px 25px rgba(15, 23, 42, 0.05)';
                }
              }}
            >
              <div style={{ position: 'relative', width: '100%' }}>
                <RotatingIdeaPlaceholder
                  examples={ideaExamples}
                  idea={idea}
                  isLoading={isLoading}
                  onIdeaChange={setIdea}
                  onSubmit={triggerSubmit}
                  isFocused={isFocused}
                  setIsFocused={setIsFocused}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <span style={{ 
                  fontSize: '0.72rem', 
                  color: '#94A3B8', 
                  fontWeight: 600,
                  fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace", // Good sharp monospace font family
                  letterSpacing: '0.05em'
                }}>
                  {idea.trim().split(/\s+/).filter(word => word.length > 0).length}/100 words
                </span>
                <button 
                  type="submit" 
                  disabled={isLoading} 
                  style={{
                    backgroundColor: '#005AE2', // theme blue (never black)
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '50%',
                    width: '56px', // 56x56 circular button
                    height: '56px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'background-color 220ms ease, transform 220ms ease, box-shadow 220ms ease',
                    boxShadow: '0 12px 30px rgba(0, 90, 226, 0.25)',
                    padding: 0
                  }}
                  onMouseOver={(e: any) => {
                    e.currentTarget.style.backgroundColor = '#004ac2';
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 18px 40px rgba(0, 90, 226, 0.35)';
                  }}
                  onMouseOut={(e: any) => {
                    e.currentTarget.style.backgroundColor = '#005AE2';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 90, 226, 0.25)';
                  }}
                  onMouseDown={(e: any) => {
                    e.currentTarget.style.transform = 'scale(0.97)';
                  }}
                  onMouseUp={(e: any) => {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                  }}
                  title="Submit Idea"
                >
                  <ArrowUp size={20} strokeWidth={2.5} style={{ color: '#FFFFFF' }} />
                </button>
              </div>
            </div>
            {formMessage && submissionStep < 1 && (
              <div className={`form-message ${messageType}`} style={{
                marginTop: '12px',
                fontSize: '0.875rem',
                fontWeight: 600,
                animation: 'cc-fadeIn 0.3s ease'
              }}>
                {formMessage}
              </div>
            )}
            <p className="hero-note">{homeContent.hero.footerNote}</p>
          </form>
        </header>
  );
}
