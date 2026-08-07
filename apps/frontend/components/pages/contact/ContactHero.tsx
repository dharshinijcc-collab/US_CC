'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';
import EditableImage from '@/components/pages/admin/EditableImage';
import { 
  MapPin, Phone, Mail, Clock, MessageSquare, Shield, Award, Sparkles, Check, AlertCircle, RefreshCw
} from 'lucide-react';
import GrainOverlay from '@/components/effects/GrainOverlay';
import BorderBeam from '@/components/effects/BorderBeam';




export default function ContactHero({ contactContent, handleScroll }: any) {
  return (
    <section className="hero-section" style={{ position: 'relative', overflow: 'hidden', padding: '80px 0' }}>
          {/* Ambient glow orbs - Blue only, matching studio page */}
          <div style={{ position: 'absolute', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.25), transparent 70%)', top: '-250px', left: '50%', transform: 'translateX(-50%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }}></div>
          <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.15), transparent 70%)', bottom: '-150px', left: '-50px', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }}></div>
          <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.15), transparent 70%)', bottom: '-150px', right: '-50px', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }}></div>

          <GrainOverlay opacity={0.02} />
          
          <div className="section-container pt-0 pb-0" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '960px' }}>
            <div className="cc-reveal" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <div className="hero-eyebrow-pill" style={{ marginTop: '0px' }}>
                <EditableText contentKey="contact.hero.eyebrow" value={contactContent.hero.eyebrow || "CONTACT OUR EXPERTS"} />
              </div>
              
              <div style={{ width: '100%', textAlign: 'center' }}>
                <h1 className="hero-title" style={{ textAlign: 'center', margin: '0 auto', display: 'inline-block' }}>
                  {contactContent.hero.title?.split(' ').map((word: string, i: number) => {
                    const isBlue = ['Great'].includes(word.replace(/[^a-zA-Z]/g, ''));
                    return (
                      <React.Fragment key={i}>
                        <span style={isBlue ? { color: '#005AE2' } : {}}>
                          {word}{' '}
                        </span>
                        {i === 2 && <br />}
                      </React.Fragment>
                    );
                  })}
                </h1>
              </div>

              <EditableText 
                as="p"
                contentKey="contact.hero.subheading"
                value={contactContent.hero.subheading}
                className="body-text cc-delay-2"
                style={{ maxWidth: '720px', margin: '0 auto 40px', textAlign: 'center', lineHeight: '1.8' }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', justifyContent: 'center' }} className="cc-reveal">
                <button className="btn-primary cc-delay-3" onClick={() => document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' })}>
                  <EditableText contentKey="contact.hero.buttonText" value={contactContent.hero.buttonText} />
                </button>
                <div className="cc-delay-4" style={{ fontSize: '0.95rem', color: '#64748B', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>
                  Or email us directly at{' '}
                  <a href="mailto:ccproductstudio@gmail.com" style={{ color: '#005AE2', fontWeight: 700, textDecoration: 'none', borderBottom: '2px solid rgba(0, 90, 226, 0.2)', transition: 'border-color 0.2s', paddingBottom: '2px' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#005AE2'} onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0, 90, 226, 0.2)'}>
                    ccproductstudio@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
  );
}
