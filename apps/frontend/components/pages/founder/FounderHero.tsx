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
    <header ref={heroRef} className="hero-section" style={{ position: 'relative', overflow: 'hidden', minHeight: 'auto', padding: '128px 0 48px 0' }}>
          {/* Top Light Effect */}
          <div style={{ position: 'absolute', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.25), transparent 70%)', top: '-200px', left: '50%', transform: 'translateX(-50%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }}></div>
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0 24px' }}>
            <div className="hero-eyebrow-pill" style={{ marginTop: '0px' }}>
              <EditableText contentKey="home.hero.eyebrow" value={homeContent.hero.eyebrow} />
            </div>
            <EditableText
              as="h1"
              contentKey="home.hero.heading"
              value={homeContent.hero.heading || "Where BOLD IDEAS\nbecome REAL products"}
              className="hero-title"
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: 'clamp(1.75rem, 3.2vw, 2.375rem)',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                color: '#0F172A',
              }}
            >
              {(() => {
                const headingText = homeContent.hero.heading || "Where BOLD IDEAS\nbecome REAL products";
                
                const formatLine = (lineStr: string) => {
                  return lineStr.split(/[\s\u00a0]+/).map((word: string, index: number) => {
                    if (!word) return null;
                    const cleanWordUpper = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").toUpperCase();
                    const isBlue = ['IDEA', 'IDEAS', 'CUSTOMER', 'CUSTOMERS', 'BOLD', 'REAL'].includes(cleanWordUpper);
                    return (
                      <span key={index} style={isBlue ? { color: '#005AE2', fontWeight: 900, WebkitTextStroke: 'none' } : {}}>
                        {word}{' '}
                      </span>
                    );
                  });
                };

                let line1 = "";
                let line2 = "";

                if (headingText.includes('\n')) {
                  const parts = headingText.split('\n');
                  line1 = parts[0] || "";
                  line2 = parts.slice(1).join(" ") || "";
                } else {
                  const words = headingText.split(' ');
                  const mid = Math.ceil(words.length / 2);
                  line1 = words.slice(0, mid).join(' ');
                  line2 = words.slice(mid).join(' ');
                }

                return (
                  <>
                    <span className="hero-title-line" style={{ display: 'block' }}>
                      {formatLine(line1)}
                    </span>
                    <span className="hero-title-line" style={{ display: 'block' }}>
                      {formatLine(line2)}
                    </span>
                  </>
                );
              })()}
            </EditableText>
            <EditableText
              as="p"
              contentKey="home.hero.subheading"
              value={homeContent.hero.subheading}
              className="hero-description"
              style={{
                textAlign: 'center',
                color: '#64748B',
                fontSize: 'clamp(0.9rem, 2vw, 0.95rem)',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                lineHeight: 1.65,
                maxWidth: '720px',
                margin: '0 auto 40px',
              }}
            />
          </div>

          <form id="idea-section" onSubmit={handleIdeaSubmit} method="POST" style={{ width: '100%', maxWidth: '520px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 10 }}>
            <div 
              style={{
                width: '100%',
                maxWidth: '520px',
                backgroundColor: '#FFFFFF', // Pure white inside
                background: '#FFFFFF',
                borderRadius: '24px',
                border: isFocused 
                  ? '1.5px solid #005AE2' 
                  : '1.5px solid #CBD5E1',
                boxShadow: isFocused 
                  ? 'inset 0 4px 10px rgba(15, 23, 42, 0.08), inset 0 -3px 6px rgba(15, 23, 42, 0.04), inset 4px 0 8px rgba(15, 23, 42, 0.05), inset -4px 0 8px rgba(15, 23, 42, 0.05), 0 0 0 4px rgba(0, 90, 226, 0.14), 0 16px 40px -10px rgba(0, 90, 226, 0.18)' 
                  : 'inset 0 5px 12px rgba(15, 23, 42, 0.10), inset 0 -3px 6px rgba(15, 23, 42, 0.05), inset 4px 0 8px rgba(15, 23, 42, 0.06), inset -4px 0 8px rgba(15, 23, 42, 0.06), 0 10px 30px -5px rgba(15, 23, 42, 0.06)', // Deep 4-side inner shadow within form
                padding: '24px 26px 18px 26px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                transition: 'border-color 250ms ease, box-shadow 250ms ease, transform 250ms ease'
              }}
              onMouseOver={e => {
                if (!isFocused) {
                  e.currentTarget.style.border = '1.5px solid #005AE2';
                  e.currentTarget.style.boxShadow = 'inset 0 5px 12px rgba(15, 23, 42, 0.10), inset 0 -3px 6px rgba(15, 23, 42, 0.05), inset 4px 0 8px rgba(15, 23, 42, 0.06), inset -4px 0 8px rgba(15, 23, 42, 0.06), 0 12px 32px -8px rgba(0, 90, 226, 0.12)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseOut={e => {
                if (!isFocused) {
                  e.currentTarget.style.border = '1.5px solid #CBD5E1';
                  e.currentTarget.style.boxShadow = 'inset 0 5px 12px rgba(15, 23, 42, 0.10), inset 0 -3px 6px rgba(15, 23, 42, 0.05), inset 4px 0 8px rgba(15, 23, 42, 0.06), inset -4px 0 8px rgba(15, 23, 42, 0.06), 0 10px 30px -5px rgba(15, 23, 42, 0.06)';
                  e.currentTarget.style.transform = 'translateY(0)';
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
                  fontSize: '0.75rem', 
                  color: '#94A3B8', 
                  fontWeight: 600,
                  fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace",
                  letterSpacing: '0.05em'
                }}>
                  {idea.trim().split(/\s+/).filter(word => word.length > 0).length}/100 words
                </span>
                <button 
                  type="submit" 
                  disabled={isLoading} 
                  style={{
                    background: 'linear-gradient(135deg, #0066FF 0%, #0052D6 100%)', // Vibrant blue circular button (Image 1)
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '50%',
                    width: '52px',
                    height: '52px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: '0 10px 24px rgba(0, 90, 226, 0.42)', // Elevated vibrant blue drop shadow (Image 1)
                    padding: 0,
                    outline: 'none'
                  }}
                  onMouseOver={(e: any) => {
                    e.currentTarget.style.transform = 'scale(1.06)';
                    e.currentTarget.style.boxShadow = '0 14px 28px rgba(0, 90, 226, 0.55)';
                  }}
                  onMouseOut={(e: any) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 10px 24px rgba(0, 90, 226, 0.42)';
                  }}
                  onMouseDown={(e: any) => {
                    e.currentTarget.style.transform = 'scale(0.95)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 90, 226, 0.35)';
                  }}
                  onMouseUp={(e: any) => {
                    e.currentTarget.style.transform = 'scale(1.06)';
                    e.currentTarget.style.boxShadow = '0 14px 28px rgba(0, 90, 226, 0.55)';
                  }}
                  title="Submit Idea"
                >
                  <ArrowUp size={22} strokeWidth={2.8} style={{ color: '#FFFFFF' }} />
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
