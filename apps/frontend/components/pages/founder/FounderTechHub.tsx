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




export default function FounderTechHub({ homeContent, partnerProductsData, PARTNER_PRODUCTS, renderProductIcon, activeProd, setActiveProd, scrollLeftFunc, scrollRightFunc, carouselRef, handleMouseDown, handleMouseLeave, handleMouseUp, handleMouseMove, content, methodologyCards }: any) {
  return (
    <section className="tech-hub-section" style={{ backgroundColor: '#EFF6FF', marginTop: '-2px' }}>
          <div className="section-container" style={{ maxWidth: '1100px', position: 'relative' }}>
            <div className="text-center" style={{ marginBottom: '48px' }}>
              <h3 className="section-eyebrow text-center cc-reveal" style={{ marginBottom: '12px' }}>OUR METHODOLOGY</h3>
              <EditableText
                as="h2"
                contentKey="methodology.title"
                value={content?.methodology?.title || "How We Help"}
                className="section-title"
                style={{ marginBottom: '12px' }}
              />
              <EditableText
                as="p"
                contentKey="methodology.subtitle"
                value={content?.methodology?.subtitle || "Our collaborative venture-building methodology designed to de-risk startups and scale high-growth products from day one."}
                className="section-subtitle"
                style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.05rem', color: '#64748B' }}
              />
            </div>

            {/* DESKTOP CIRCULAR HUB-AND-SPOKE DIAGRAM */}
            <div className="radial-hub-container">
              <svg className="radial-hub-svg" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#0A0F1C" />
                  </marker>
                </defs>

                {/* Concentric Dashed Background Circles */}
                <circle cx="500" cy="350" r="130" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
                <circle cx="500" cy="350" r="240" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
                <circle cx="500" cy="350" r="350" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />

                {/* Spokes Connecting Center to Cards */}
                {/* 1. Outcome Ownership (Top Center) - extended to touch card 1 at top: 0px */}
                <line x1="500" y1="260" x2="500" y2="105" stroke="#0A0F1C" strokeWidth="1.5" markerEnd="url(#arrow)" />

                {/* 2. Built to Scale (Top Right) */}
                <line x1="560" y1="290" x2="670" y2="225" stroke="#0A0F1C" strokeWidth="1.5" />

                {/* 3. We Challenge You (Middle Right) */}
                <line x1="560" y1="410" x2="690" y2="465" stroke="#0A0F1C" strokeWidth="1.5" />

                {/* 4. Lifelong Partner (Bottom Center) - extended to touch card 4 at bottom: 0px (top border around y=585) */}
                <line x1="500" y1="440" x2="500" y2="585" stroke="#0A0F1C" strokeWidth="1.5" />

                {/* 5. Rigorous Validation (Bottom Left) */}
                <line x1="440" y1="410" x2="310" y2="465" stroke="#0A0F1C" strokeWidth="1.5" />

                {/* 6. Senior In-House Team (Top Left) */}
                <line x1="440" y1="290" x2="330" y2="225" stroke="#0A0F1C" strokeWidth="1.5" />
              </svg>

              {/* CENTER CIRCLE WITH ECOSYSTEM ICON */}
              <div className="hub-center-circle" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                <EditableImage
                  contentKey="home.hero.ecosystemIcon"
                  src={homeContent.hero.ecosystemIcon || "/Ecosystem_Icon-removebg-preview.png"}
                  alt="Ecosystem Icon"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>

              {/* 1. Outcome Ownership */}
              {methodologyCards[0] && (
                <div className="spoke-card" style={{ left: '50%', top: '0px', transform: 'translateX(-50%)' }}>
                  <h4 className="spoke-card-title">
                    <EditableText
                      contentKey="home.methodology.cards.0.title"
                      value={methodologyCards[0].title}
                    />
                  </h4>
                  <p className="spoke-card-desc">
                    <EditableText
                      contentKey="home.methodology.cards.0.description"
                      value={methodologyCards[0].description}
                    />
                  </p>
                </div>
              )}

              {/* 2. Built to Scale */}
              {methodologyCards[1] && (
                <div className="spoke-card" style={{ left: '67%', top: '150px' }}>
                  <h4 className="spoke-card-title">
                    <EditableText
                      contentKey="home.methodology.cards.1.title"
                      value={methodologyCards[1].title}
                    />
                  </h4>
                  <p className="spoke-card-desc">
                    <EditableText
                      contentKey="home.methodology.cards.1.description"
                      value={methodologyCards[1].description}
                    />
                  </p>
                </div>
              )}

              {/* 3. We Challenge You */}
              {methodologyCards[2] && (
                <div className="spoke-card" style={{ left: '69%', top: '410px' }}>
                  <h4 className="spoke-card-title">
                    <EditableText
                      contentKey="home.methodology.cards.2.title"
                      value={methodologyCards[2].title}
                    />
                  </h4>
                  <p className="spoke-card-desc">
                    <EditableText
                      contentKey="home.methodology.cards.2.description"
                      value={methodologyCards[2].description}
                    />
                  </p>
                </div>
              )}

              {/* 4. Lifelong Partner */}
              {methodologyCards[3] && (
                <div className="spoke-card" style={{ left: '50%', bottom: '0px', top: 'auto', transform: 'translateX(-50%)' }}>
                  <h4 className="spoke-card-title">
                    <EditableText
                      contentKey="home.methodology.cards.3.title"
                      value={methodologyCards[3].title}
                    />
                  </h4>
                  <p className="spoke-card-desc">
                    <EditableText
                      contentKey="home.methodology.cards.3.description"
                      value={methodologyCards[3].description}
                    />
                  </p>
                </div>
              )}

              {/* 5. Rigorous Validation */}
              {methodologyCards[4] && (
                <div className="spoke-card" style={{ left: '6%', top: '410px' }}>
                  <h4 className="spoke-card-title">
                    <EditableText
                      contentKey="home.methodology.cards.4.title"
                      value={methodologyCards[4].title}
                    />
                  </h4>
                  <p className="spoke-card-desc">
                    <EditableText
                      contentKey="home.methodology.cards.4.description"
                      value={methodologyCards[4].description}
                    />
                  </p>
                </div>
              )}

              {/* 6. Senior In-House Team */}
              {methodologyCards[5] && (
                <div className="spoke-card" style={{ left: '8%', top: '150px' }}>
                  <h4 className="spoke-card-title">
                    <EditableText
                      contentKey="home.methodology.cards.5.title"
                      value={methodologyCards[5].title}
                    />
                  </h4>
                  <p className="spoke-card-desc">
                    <EditableText
                      contentKey="home.methodology.cards.5.description"
                      value={methodologyCards[5].description}
                    />
                  </p>
                </div>
              )}
            </div>

            {/* MOBILE GRID LAYOUT */}
            <div className="hub-mobile-grid">
              {methodologyCards.slice(0, 6).map((card: any, idx: number) => (
                <div key={idx} className="mobile-spoke-card">
                  <h4 className="spoke-card-title">
                    <EditableText
                      contentKey={`home.methodology.cards.${idx}.title`}
                      value={card.title}
                    />
                  </h4>
                  <p className="spoke-card-desc">
                    <EditableText
                      contentKey={`home.methodology.cards.${idx}.description`}
                      value={card.description}
                    />
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>
  );
}
