'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';
import EditableImage from '@/components/pages/admin/EditableImage';
import { 
  Building, Users, TrendingUp, ShieldAlert, Sparkles, Check, X, ArrowLeft, ArrowRight, 
  MapPin, Briefcase, DollarSign, Layers, Globe, Cpu, Ban, History, Sprout, Info, AlertTriangle
} from 'lucide-react';
import CountUp from '@/components/effects/CountUp';




export default function InvestorsHero({ content, getContent, handleScroll }: any) {
  return (
    <section className="hero-section" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Top Light Effect */}
          <div style={{ position: 'absolute', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.25), transparent 70%)', top: '-200px', left: '50%', transform: 'translateX(-50%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }}></div>
          <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="hero-eyebrow-pill">
              <EditableText contentKey="investors.hero.eyebrow" value={content?.investors?.hero?.eyebrow || 'INVESTOR RELATIONS'} />
            </div>
            <EditableText
              as="h1"
              contentKey="investors.hero.titleText"
              value={content?.investors?.hero?.titleText || (content?.investors?.hero?.title1 && content?.investors?.hero?.title2 ? (content.investors.hero.title1 + '\n' + content.investors.hero.title2) : 'Not Just Capital.\nBuild With Us.')}
              className="hero-title"
              style={{ color: '#020617' }}
            >
              {(() => {
                const titleText = content?.investors?.hero?.titleText || (content?.investors?.hero?.title1 && content?.investors?.hero?.title2 ? (content.investors.hero.title1 + '\n' + content.investors.hero.title2) : 'Not Just Capital.\nBuild With Us.');
                const lines = titleText.split('\n');
                return lines.map((line, lineIdx) => {
                  const words = line.split(/[\s\u00a0]+/);
                  return (
                    <React.Fragment key={lineIdx}>
                      {words.map((word: string, index: number) => {
                        if (!word) return null;
                        const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").toUpperCase();
                        const isBlue = ['CAPITAL', 'BUILD', 'US'].includes(cleanWord);
                        return (
                          <span key={index} style={isBlue ? { color: '#005AE2' } : {}}>
                            {word}{' '}
                          </span>
                        );
                      })}
                      {lineIdx < lines.length - 1 && <br />}
                    </React.Fragment>
                  );
                });
              })()}
            </EditableText>
            <p className="hero-description" style={{ marginBottom: '40px', maxWidth: '720px', lineHeight: 1.8, fontSize: 'clamp(1rem, 2vw, 1.125rem)' }}>
              <EditableText contentKey="investors.hero.description" value={content?.investors?.hero?.description || 'CrestCode partners with strategic investors who believe in the long game — backing the studio, the ventures, or both. We offer full transparency, shared conviction, and two clear paths to participate.'} />
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Link href="/contact" className="btn-primary">
                <EditableText contentKey="investors.hero.buttonText" value={content?.investors?.hero?.buttonText || 'Express Your Interest'} />
              </Link>
            </div>
          </div>
        </section>
  );
}
