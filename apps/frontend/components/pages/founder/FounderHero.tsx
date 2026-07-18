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




export default function FounderHero({ heroRef, homeContent, ideaExamples, idea, isLoading, setIdea, handleIdeaSubmit, formMessage, submissionStep, messageType }: any) {
  return (
    <header ref={heroRef} className="hero-section" style={{ position: 'relative', overflow: 'hidden', minHeight: '700px' }}>
          {/* Top Light Effect */}
          <div style={{ position: 'absolute', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.25), transparent 70%)', top: '-200px', left: '50%', transform: 'translateX(-50%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }}></div>
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '960px', width: '100%' }}>
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

          <form id="idea-section" onSubmit={handleIdeaSubmit} method="POST" style={{ width: '100%', maxWidth: '580px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 10 }}>
            <div className="hero-idea-box" style={{ maxWidth: '580px', width: '100%' }}>
              <div className="hero-idea-inner">
                <RotatingIdeaPlaceholder
                  examples={ideaExamples}
                  idea={idea}
                  isLoading={isLoading}
                  onIdeaChange={setIdea}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', padding: '0 8px 8px 0' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 500 }}>
                    {idea.trim().split(/\s+/).filter(word => word.length > 0).length}/100 words
                  </span>
                  <button type="submit" disabled={isLoading} style={{
                    backgroundColor: '#005AE2',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '100px',
                    padding: '10px 20px',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(0, 90, 226, 0.2)'
                  }}
                    onMouseOver={(e: any) => {
                      e.currentTarget.style.backgroundColor = '#004ac2';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseOut={(e: any) => {
                      e.currentTarget.style.backgroundColor = '#005AE2';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <EditableText contentKey="home.hero.submitBtn" value={homeContent.hero.submitBtn} />
                  </button>
                </div>
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
