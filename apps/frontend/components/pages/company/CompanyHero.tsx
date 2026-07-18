'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';
import EditableImage from '@/components/pages/admin/EditableImage';
import { 
  Building, Users, TrendingUp, Sparkles, Check, ArrowRight, Shield, Award, Lightbulb, Compass, Zap
} from 'lucide-react';
import SpotlightCursor from '@/components/effects/SpotlightCursor';
import BorderBeam from '@/components/effects/BorderBeam';




export default function CompanyHero({ companyContent, handleScroll }: any) {
  return (
    <section className="company-hero bg-dark">
          <SpotlightCursor color="rgba(0, 90, 226, 0.15)" />
          <div className="hero-glow"></div>
          <div className="hero-glow-2"></div>
          <div className="hero-glow-3"></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 className="hero-title">
              Crestcode <span style={{ color: '#005AE2' }}>Portfolio</span>
            </h1>
            <p className="hero-subtitle">
              <EditableText
                contentKey="company.hero.subtitle"
                value={companyContent?.hero?.subtitle || 'Explore the portfolio of ventures crafted in our product studio.'}
              />
            </p>
          </div>
        </section>
  );
}
