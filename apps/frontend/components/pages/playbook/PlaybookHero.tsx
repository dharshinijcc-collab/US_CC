'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';
import EditableImage from '@/components/pages/admin/EditableImage';
import { 
  Building, Users, TrendingUp, Sparkles, Check, X, Compass, Cpu, Layers, Sprout, Briefcase, Search, Zap, Rocket, ShieldCheck, Server, Code, Clock, Shield, Globe, ArrowRight
} from 'lucide-react';




export default function PlaybookHero({ modelContent, handleScroll }: any) {
  return (
    <section className="hero-section" style={{ background: 'white', position: 'relative', overflow: 'hidden' }}>
          {/* Top Light Effect */}
          <div style={{ position: 'absolute', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.25), transparent 70%)', top: '-200px', left: '50%', transform: 'translateX(-50%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }}></div>
          <div className="section-container">
            <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '80px', alignItems: 'center' }}>
              <div className="hero-content">
                <div className="hero-eyebrow-pill" style={{ background: '#E6EFFF', color: '#005AE2', fontWeight: 800, padding: '6px 14px', fontSize: '0.75rem' }}>
                  <EditableText contentKey="ourModel.hero.eyebrow" value={modelContent.hero.eyebrow} />
                </div>
                <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginTop: '24px' }}>
                  From Raw Idea to<br /><span style={{ color: '#2563EB' }}>Proven Product</span> — in 5 Phases
                </h1>
                <p className="hero-description" style={{ fontSize: '1rem', color: '#4B5563', lineHeight: 1.6, marginTop: '24px' }}>
                  <EditableText contentKey="ourModel.hero.description" value={modelContent.hero.description} />
                </p>
                <div className="hero-info-box" style={{ background: '#F5F7FF', borderLeft: '3px solid #2563EB', padding: '24px', borderRadius: '4px', marginTop: '32px', color: '#374151', fontSize: '0.9375rem', fontWeight: 500, fontStyle: 'normal' }}>
                  <EditableText contentKey="ourModel.hero.quote" value={modelContent.hero.quote} />
                </div>
                <div className="hero-buttons" style={{ marginTop: '32px', display: 'flex', gap: '16px' }}>
                  <Link href="/contact" style={{ 
                    display: 'inline-block',
                    background: '#2563EB', 
                    color: 'white',
                    padding: '16px 40px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '1rem',
                    transition: 'all 0.3s ease'
                  }}>
                    <EditableText contentKey="ourModel.hero.primaryButton" value={modelContent.hero.primaryButton} />
                  </Link>
                  <Link href="#phases" style={{ 
                    display: 'inline-block',
                    background: '#DBEAFE', 
                    color: '#2563EB',
                    padding: '16px 40px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '1rem',
                    transition: 'all 0.3s ease'
                  }}>
                    <EditableText contentKey="ourModel.hero.secondaryButton" value={modelContent.hero.secondaryButton} />
                  </Link>
                </div>
              </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ 
                background: '#D1E4FF', 
                borderRadius: '32px', 
                padding: '12px',
                boxShadow: '0 20px 40px rgba(0,90,226,0.12)',
                position: 'relative',
                width: '100%',
                maxWidth: '580px'
              }}>
                <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                  <img 
                    src="/images/methodology_hero.png" 
                    alt="Our Methodology — Futuristic Digital Planning" 
                    style={{ width: '100%', height: 'auto', display: 'block', opacity: 1 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}
