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

function getAnnularSectorPath(cx: number, cy: number, rInner: number, rOuter: number, startAngleDeg: number, endAngleDeg: number) {
  const startAngleRad = (startAngleDeg * Math.PI) / 180;
  const endAngleRad = (endAngleDeg * Math.PI) / 180;

  const x1_out = cx + rOuter * Math.cos(startAngleRad);
  const y1_out = cy + rOuter * Math.sin(startAngleRad);
  const x2_out = cx + rOuter * Math.cos(endAngleRad);
  const y2_out = cy + rOuter * Math.sin(endAngleRad);

  const x1_in = cx + rInner * Math.cos(startAngleRad);
  const y1_in = cy + rInner * Math.sin(startAngleRad);
  const x2_in = cx + rInner * Math.cos(endAngleRad);
  const y2_in = cy + rInner * Math.sin(endAngleRad);

  const largeArcFlag = endAngleDeg - startAngleDeg > 180 ? 1 : 0;

  return `M ${x1_out} ${y1_out} A ${rOuter} ${rOuter} 0 ${largeArcFlag} 1 ${x2_out} ${y2_out} L ${x2_in} ${y2_in} A ${rInner} ${rInner} 0 ${largeArcFlag} 0 ${x1_in} ${y1_in} Z`;
}

function getArcPath(cx: number, cy: number, r: number, startAngleDeg: number, endAngleDeg: number) {
  const startAngleRad = (startAngleDeg * Math.PI) / 180;
  const endAngleRad = (endAngleDeg * Math.PI) / 180;

  const x1 = cx + r * Math.cos(startAngleRad);
  const y1 = cy + r * Math.sin(startAngleRad);
  const x2 = cx + r * Math.cos(endAngleRad);
  const y2 = cy + r * Math.sin(endAngleRad);

  return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
}

function getAttachedBentArrowPath(cx: number, cy: number, rInner: number, rOuter: number, startAngleDeg: number, endAngleDeg: number) {
  const startAngleRad = (startAngleDeg * Math.PI) / 180;
  const endArcAngleDeg = endAngleDeg - 6;
  const endAngleRad = (endArcAngleDeg * Math.PI) / 180;

  const x1 = cx + rInner * Math.cos(startAngleRad);
  const y1 = cy + rInner * Math.sin(startAngleRad);

  const x2 = cx + rOuter * Math.cos(startAngleRad);
  const y2 = cy + rOuter * Math.sin(startAngleRad);

  const x3 = cx + rOuter * Math.cos(endAngleRad);
  const y3 = cy + rOuter * Math.sin(endAngleRad);

  const largeArcFlag = endArcAngleDeg - startAngleDeg > 180 ? 1 : 0;

  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} L ${x2.toFixed(2)} ${y2.toFixed(2)} A ${rOuter} ${rOuter} 0 ${largeArcFlag} 1 ${x3.toFixed(2)} ${y3.toFixed(2)}`;
}

export default function FounderTechHub({ homeContent, partnerProductsData, PARTNER_PRODUCTS, renderProductIcon, activeProd, setActiveProd, scrollLeftFunc, scrollRightFunc, carouselRef, handleMouseDown, handleMouseLeave, handleMouseUp, handleMouseMove, content, methodologyCards }: any) {
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);

  // Sector config for matching colors
  const sectorColors = ["#00A3E0", "#005AE2", "#0B2545", "#134074", "#3D5A80", "#1F2937"];

  return (
    <section className="tech-hub-section" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="section-container" style={{ maxWidth: '1140px', position: 'relative' }}>
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

        {/* DESKTOP CIRCULAR INFOGRAPHIC DIAGRAM */}
        <div className="radial-hub-container" style={{ position: 'relative', width: '1050px', height: '875px', margin: '20px auto 0' }}>
          <svg className="radial-hub-svg" viewBox="0 0 1050 875" style={{ width: '100%', height: '100%' }}>
            <defs>
              {/* Arrowheads matching sector colors */}
              <marker id="arrow-teal" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 2 L 8 5 L 0 8 z" fill="#00A3E0" />
              </marker>
              <marker id="arrow-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 2 L 8 5 L 0 8 z" fill="#005AE2" />
              </marker>
              <marker id="arrow-navy" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 2 L 8 5 L 0 8 z" fill="#0B2545" />
              </marker>
              <marker id="arrow-indigo" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 2 L 8 5 L 0 8 z" fill="#134074" />
              </marker>
              <marker id="arrow-steel" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 2 L 8 5 L 0 8 z" fill="#3D5A80" />
              </marker>
              <marker id="arrow-charcoal" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 2 L 8 5 L 0 8 z" fill="#1F2937" />
              </marker>
            </defs>

            {/* Inner Annular Sector Curved Wedges (rInner = 100, rOuter = 190) */}
            {/* Wedge 0: Top Center (240 to 300 deg) */}
            <path d={getAnnularSectorPath(525, 437.5, 100, 190, 240, 300)} fill="#00A3E0" />
            {/* Wedge 1: Top Right (300 to 360 deg) */}
            <path d={getAnnularSectorPath(525, 437.5, 100, 190, 300, 360)} fill="#005AE2" />
            {/* Wedge 2: Bottom Right (0 to 60 deg) */}
            <path d={getAnnularSectorPath(525, 437.5, 100, 190, 0, 60)} fill="#0B2545" />
            {/* Wedge 3: Bottom Center (60 to 120 deg) */}
            <path d={getAnnularSectorPath(525, 437.5, 100, 190, 60, 120)} fill="#134074" />
            {/* Wedge 4: Bottom Left (120 to 180 deg) */}
            <path d={getAnnularSectorPath(525, 437.5, 100, 190, 120, 180)} fill="#3D5A80" />
            {/* Wedge 5: Top Left (180 to 240 deg) */}
            <path d={getAnnularSectorPath(525, 437.5, 100, 190, 180, 240)} fill="#1F2937" />

            {/* ATTACHED BENT ARROW PATHS (Starts at rInner = 100 [edge of hub circle], extends outward along sector boundary to rOuter = 430, then bends into outer arc) */}
            <path d={getAttachedBentArrowPath(525, 437.5, 100, 430, 240, 300)} stroke="#00A3E0" strokeWidth="2.5" fill="none" markerEnd="url(#arrow-teal)" />
            <path d={getAttachedBentArrowPath(525, 437.5, 100, 430, 300, 360)} stroke="#005AE2" strokeWidth="2.5" fill="none" markerEnd="url(#arrow-blue)" />
            <path d={getAttachedBentArrowPath(525, 437.5, 100, 430, 0, 60)} stroke="#0B2545" strokeWidth="2.5" fill="none" markerEnd="url(#arrow-navy)" />
            <path d={getAttachedBentArrowPath(525, 437.5, 100, 430, 60, 120)} stroke="#134074" strokeWidth="2.5" fill="none" markerEnd="url(#arrow-indigo)" />
            <path d={getAttachedBentArrowPath(525, 437.5, 100, 430, 120, 180)} stroke="#3D5A80" strokeWidth="2.5" fill="none" markerEnd="url(#arrow-steel)" />
            <path d={getAttachedBentArrowPath(525, 437.5, 100, 430, 180, 240)} stroke="#1F2937" strokeWidth="2.5" fill="none" markerEnd="url(#arrow-charcoal)" />

            {/* White Icons Placed inside each inner wedge sector (r = 145) */}
            {/* Icon 0: Code2 */}
            <g style={{ transform: 'translate(513px, 280px)' }}>
              <Code2 size={24} style={{ color: '#FFFFFF' }} strokeWidth={2.2} />
            </g>
            {/* Icon 1: Users */}
            <g style={{ transform: 'translate(638px, 353px)' }}>
              <Users size={24} style={{ color: '#FFFFFF' }} strokeWidth={2.2} />
            </g>
            {/* Icon 2: Compass */}
            <g style={{ transform: 'translate(638px, 498px)' }}>
              <Compass size={24} style={{ color: '#FFFFFF' }} strokeWidth={2.2} />
            </g>
            {/* Icon 3: Sparkles */}
            <g style={{ transform: 'translate(513px, 570px)' }}>
              <Sparkles size={24} style={{ color: '#FFFFFF' }} strokeWidth={2.2} />
            </g>
            {/* Icon 4: Brain */}
            <g style={{ transform: 'translate(387px, 498px)' }}>
              <Brain size={24} style={{ color: '#FFFFFF' }} strokeWidth={2.2} />
            </g>
            {/* Icon 5: Globe */}
            <g style={{ transform: 'translate(387px, 353px)' }}>
              <Globe size={24} style={{ color: '#FFFFFF' }} strokeWidth={2.2} />
            </g>
          </svg>

          {/* INNER WHITE CIRCLE HUB - CONSTANT TITLE AND CONTENT */}
          <div className="hub-center-circle" style={{ width: '200px', height: '200px' }}>
            <h4 style={{
              fontFamily: "'Outfit', 'Manrope', sans-serif",
              fontSize: '0.85rem',
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              margin: '0 0 8px 0',
              textAlign: 'center'
            }}>
              Our Methodology
            </h4>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.72rem',
              color: '#64748B',
              lineHeight: '1.5',
              margin: '0 auto',
              textAlign: 'center',
              fontWeight: 500,
              width: '100%',
              display: 'block'
            }}>
              A continuous cycle of validation, building, and strategic scaling.
            </p>
          </div>

          {/* PARAGRAPH & TITLE LABELS PLACED 100% SYMMETRICALLY INSIDE DESIGN (TRUE CENTER ALIGNMENT) */}
          {/* Card 0 (Top Center - Sector 0 Midpoint: 270°) */}
          {methodologyCards[0] && (
            <div
              className="spoke-card spoke-top-center"
              style={{
                position: 'absolute',
                left: '525px',
                top: '110px',
                transform: 'translate(-50%, -50%)',
                width: '240px',
                textAlign: 'center'
              }}
            >
              <h4 className="spoke-card-title" style={{
                color: '#00A3E0',
                fontSize: '0.82rem',
                fontWeight: 800,
                marginBottom: '3px'
              }}>
                <EditableText contentKey="home.methodology.cards.0.title" value={methodologyCards[0].title} />
              </h4>
              <p className="spoke-card-desc" style={{ fontSize: '0.68rem', color: '#0F172A', lineHeight: '1.4', margin: 0, fontWeight: 600 }}>
                <EditableText contentKey="home.methodology.cards.0.description" value={methodologyCards[0].description} />
              </p>
            </div>
          )}

          {/* Card 1 (Top Right - Sector 1 Midpoint: 330°) */}
          {methodologyCards[1] && (
            <div
              className="spoke-card spoke-top-right"
              style={{
                position: 'absolute',
                left: '780px',
                top: '280px',
                transform: 'translate(-50%, -50%)',
                width: '210px',
                textAlign: 'center'
              }}
            >
              <h4 className="spoke-card-title" style={{
                color: '#00A3E0',
                fontSize: '0.82rem',
                fontWeight: 800,
                marginBottom: '3px'
              }}>
                <EditableText contentKey="home.methodology.cards.1.title" value={methodologyCards[1].title} />
              </h4>
              <p className="spoke-card-desc" style={{ fontSize: '0.68rem', color: '#0F172A', lineHeight: '1.4', margin: 0, fontWeight: 600 }}>
                <EditableText contentKey="home.methodology.cards.1.description" value={methodologyCards[1].description} />
              </p>
            </div>
          )}

          {/* Card 2 (Bottom Right - Sector 2 Midpoint: 30°) */}
          {methodologyCards[2] && (
            <div
              className="spoke-card spoke-bottom-right"
              style={{
                position: 'absolute',
                left: '780px',
                top: '595px',
                transform: 'translate(-50%, -50%)',
                width: '210px',
                textAlign: 'center'
              }}
            >
              <h4 className="spoke-card-title" style={{
                color: '#00A3E0',
                fontSize: '0.82rem',
                fontWeight: 800,
                marginBottom: '3px'
              }}>
                <EditableText contentKey="home.methodology.cards.2.title" value={methodologyCards[2].title} />
              </h4>
              <p className="spoke-card-desc" style={{ fontSize: '0.68rem', color: '#0F172A', lineHeight: '1.4', margin: 0, fontWeight: 600 }}>
                <EditableText contentKey="home.methodology.cards.2.description" value={methodologyCards[2].description} />
              </p>
            </div>
          )}

          {/* Card 3 (Bottom Center - Sector 3 Midpoint: 90°) */}
          {methodologyCards[3] && (
            <div
              className="spoke-card spoke-bottom-center"
              style={{
                position: 'absolute',
                left: '525px',
                top: '765px',
                transform: 'translate(-50%, -50%)',
                width: '240px',
                textAlign: 'center'
              }}
            >
              <h4 className="spoke-card-title" style={{
                color: '#00A3E0',
                fontSize: '0.82rem',
                fontWeight: 800,
                marginBottom: '3px'
              }}>
                <EditableText contentKey="home.methodology.cards.3.title" value={methodologyCards[3].title} />
              </h4>
              <p className="spoke-card-desc" style={{ fontSize: '0.68rem', color: '#0F172A', lineHeight: '1.4', margin: 0, fontWeight: 600 }}>
                <EditableText contentKey="home.methodology.cards.3.description" value={methodologyCards[3].description} />
              </p>
            </div>
          )}

          {/* Card 4 (Bottom Left - Sector 4 Midpoint: 150°) */}
          {methodologyCards[4] && (
            <div
              className="spoke-card spoke-bottom-left"
              style={{
                position: 'absolute',
                left: '270px',
                top: '595px',
                transform: 'translate(-50%, -50%)',
                width: '210px',
                textAlign: 'center'
              }}
            >
              <h4 className="spoke-card-title" style={{
                color: '#00A3E0',
                fontSize: '0.82rem',
                fontWeight: 800,
                marginBottom: '3px'
              }}>
                <EditableText contentKey="home.methodology.cards.4.title" value={methodologyCards[4].title} />
              </h4>
              <p className="spoke-card-desc" style={{ fontSize: '0.68rem', color: '#0F172A', lineHeight: '1.4', margin: 0, fontWeight: 600 }}>
                <EditableText contentKey="home.methodology.cards.4.description" value={methodologyCards[4].description} />
              </p>
            </div>
          )}

          {/* Card 5 (Top Left - Sector 5 Midpoint: 210°) */}
          {methodologyCards[5] && (
            <div
              className="spoke-card spoke-top-left"
              style={{
                position: 'absolute',
                left: '270px',
                top: '280px',
                transform: 'translate(-50%, -50%)',
                width: '210px',
                textAlign: 'center'
              }}
            >
              <h4 className="spoke-card-title" style={{
                color: '#00A3E0',
                fontSize: '0.82rem',
                fontWeight: 800,
                marginBottom: '3px'
              }}>
                <EditableText contentKey="home.methodology.cards.5.title" value={methodologyCards[5].title} />
              </h4>
              <p className="spoke-card-desc" style={{ fontSize: '0.68rem', color: '#0F172A', lineHeight: '1.4', margin: 0, fontWeight: 600 }}>
                <EditableText contentKey="home.methodology.cards.5.description" value={methodologyCards[5].description} />
              </p>
            </div>
          )}
        </div>

        {/* MOBILE GRID LAYOUT */}
        <div className="hub-mobile-grid" style={{ marginTop: '40px' }}>
          {methodologyCards.slice(0, 6).map((card: any, idx: number) => (
            <div key={idx} className="mobile-spoke-card" style={{ padding: '24px', backgroundColor: '#FFFFFF', border: '1px solid rgba(15, 23, 42, 0.08)', borderRadius: '16px' }}>
              <h4 className="spoke-card-title" style={{ textAlign: 'left', marginBottom: '8px' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: idx === 0 ? '#00A3E0' : idx === 1 ? '#005AE2' : idx === 2 ? '#0B2545' : idx === 3 ? '#134074' : idx === 4 ? '#3D5A80' : '#1F2937',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  marginRight: '10px'
                }}>
                  {idx + 1}
                </span>
                <EditableText
                  contentKey={`home.methodology.cards.${idx}.title`}
                  value={card.title}
                />
              </h4>
              <p className="spoke-card-desc" style={{ textAlign: 'left', color: '#64748B' }}>
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
