'use client';
import React, { useState, useEffect, useRef } from 'react';
import EditableText from '@/components/pages/admin/EditableText';

// Product screenshot mapping
const PRODUCT_SCREENSHOTS: Record<string, string> = {
  'Dockly':    '/images/dockly_showcase.png',
  'CastleGC':  '/images/castlegc_showcase.png',
  'OpenCap':   '/images/opencap_showcase.png',
  'NestBloq':  '/images/vhoa_showcase.png',
  'VHOA':      '/images/vhoa_showcase.png',
};

// Sharp, clean tech badge renderer (pill capsules with official tech icons)
const renderTechBadge = (techName: string, idx: number) => {
  const tech = techName.trim();
  const lower = tech.toLowerCase();

  let icon: React.ReactNode = null;
  if (lower.includes('next')) {
    icon = (
      <svg width="16" height="16" viewBox="0 0 180 180" fill="none">
        <circle cx="90" cy="90" r="90" fill="#000000"/>
        <path d="M149.508 157.52L69.142 54H54V126H67.5V69.75L138.837 161.4C142.617 160.337 146.189 159.032 149.508 157.52Z" fill="white"/>
        <rect x="115.5" y="54" width="13.5" height="72" fill="white"/>
      </svg>
    );
  } else if (lower.includes('node')) {
    icon = (
      <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
        <path d="M16 2L3 9.5v15L16 32l13-7.5v-15L16 2z" fill="#68A063"/>
        <path d="M16 2v30l13-7.5v-15L16 2z" fill="#43853D"/>
      </svg>
    );
  } else if (lower.includes('tailwind')) {
    icon = (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M12 6C9.333 6 7.667 7.333 7 10C8 8.667 9.167 8.167 10.5 8.5C11.5 8.75 12.214 9.471 13 10.271C14.28 11.574 15.772 13 19 13C21.667 13 23.333 11.667 24 9C23 10.333 21.833 10.833 20.5 10.5C19.5 10.25 18.786 9.529 18 8.729C16.72 7.426 15.228 6 12 6ZM5 13C2.333 13 .667 14.333 0 17C1 15.667 2.167 15.167 3.5 15.5C4.5 15.75 5.214 16.471 6 17.271C7.28 18.574 8.772 20 12 20C14.667 20 16.333 18.667 17 16C16 17.333 14.833 17.833 13.5 17.5C9.72 14.426 8.228 13 5 13Z" fill="#38BDF8"/>
      </svg>
    );
  } else if (lower.includes('supabase')) {
    icon = (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M13.35 21.05c-.68.86-2.07.39-2.07-.7V13H3.64c-.87 0-1.34-1.03-.76-1.68L10.65 2.95c.68-.86 2.07-.39 2.07.7V11h7.64c.87 0 1.34 1.03.76 1.68l-7.76 8.37z" fill="#3ECF8E"/>
      </svg>
    );
  } else if (lower.includes('typescript') || lower === 'ts') {
    icon = (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#3178C6"/>
        <path d="M11.5 16.5h-2v-7h-2.5V8h7v1.5h-2.5v7zm7.5-1.5c0 .6-.2 1-.6 1.3-.4.3-1 .5-1.7.5-1.1 0-2-.5-2.5-1.3l1.2-.8c.3.5.7.8 1.3.8.3 0 .6-.1.8-.2.2-.1.3-.3.3-.5 0-.2-.1-.4-.3-.5-.2-.1-.6-.3-1.2-.5-.8-.3-1.4-.6-1.7-1-.3-.4-.5-.9-.5-1.5 0-.7.3-1.2.8-1.6.5-.4 1.2-.6 2.1-.6 1 0 1.7.3 2.3.9l-1.1.9c-.3-.4-.7-.6-1.2-.6-.3 0-.5.1-.7.2-.2.1-.3.2-.3.4 0 .2.1.3.3.4.2.1.6.3 1.2.5.8.3 1.4.6 1.7 1 .4.3.5.9.5 1.5z" fill="white"/>
      </svg>
    );
  } else if (lower.includes('react')) {
    icon = (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#61DAFB" strokeWidth="1.8">
        <ellipse cx="12" cy="12" rx="10" ry="4.2" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
        <circle cx="12" cy="12" r="1.8" fill="#61DAFB" />
      </svg>
    );
  } else {
    icon = (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    );
  }

  return (
    <span key={idx} style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '100px',
      padding: '8px 18px',
      fontSize: '0.88rem',
      color: '#0F172A',
      fontWeight: 600,
      fontFamily: "'Inter', sans-serif",
      boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
    }}>
      {icon}
      <span>{tech}</span>
    </span>
  );
};

export default function FounderValidation({
  homeContent,
  handleScroll,
  items,
  activeProd,
  setActiveProd,
  renderProductIcon,
  prod,
  resolvedStatus,
  PARTNER_PRODUCTS,
  rawProd
}: any) {
  const [screenshotSlide, setScreenshotSlide] = useState(0);
  const autoSlideRef = useRef<any>(null);

  // All screenshots for the current product
  const screenshotSrc = PRODUCT_SCREENSHOTS[rawProd?.name] || PRODUCT_SCREENSHOTS[prod?.name] || '/images/dockly_showcase.png';

  // Auto-slide every 4 seconds
  useEffect(() => {
    if (!items || items.length === 0) return;
    autoSlideRef.current = setInterval(() => {
      setActiveProd((prev: number) => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(autoSlideRef.current);
  }, [items, setActiveProd]);

  // Reset screenshot slide when product changes
  useEffect(() => {
    setScreenshotSlide(0);
  }, [activeProd]);

  const defaultFeatures = [
    {
      title: 'Smart Scheduling & Coordination',
      desc: 'Smart scheduling & coordination and moving family life- with a a person team.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <circle cx="8" cy="14" r="1" fill="#0F172A" />
          <circle cx="12" cy="14" r="1" fill="#0F172A" />
          <circle cx="16" cy="14" r="1" fill="#0F172A" />
        </svg>
      )
    },
    {
      title: 'Secure Financial Management',
      desc: 'Secure financial management and governance and automated vaults.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 9v1m0 4v1m-3-3h1m4 0h1" />
        </svg>
      )
    },
    {
      title: 'Insightful Family Analytics',
      desc: 'Insightful family analytics and analytics chart components.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M7 16l4-4 3 3 5-6" />
          <path d="M17 9h2v2" />
        </svg>
      )
    }
  ];

  const techStack = (prod.stack && prod.stack.length > 0)
    ? prod.stack
    : ['Next.js', 'Node.js', 'TailwindCSS', 'Supabase', 'TypeScript'];

  const handlePrev = () => {
    if (!items || items.length === 0) return;
    setActiveProd((prev: number) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    if (!items || items.length === 0) return;
    setActiveProd((prev: number) => (prev + 1) % items.length);
  };

  return (
    <section style={{
      background: 'linear-gradient(180deg, #EDF4FF 0%, #F4F8FF 50%, #EDF4FF 100%)',
      padding: '44px 24px',
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto' }}>

        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span style={{
            display: 'inline-block',
            background: '#E6EFFF',
            color: '#005AE2',
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 800,
            fontSize: '0.72rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            padding: '5px 14px',
            borderRadius: '8px',
            marginBottom: '12px',
          }}>
            <EditableText
              contentKey="home.partnerProducts.eyebrow"
              value={homeContent.partnerProducts?.eyebrow || "Partners' Products"}
            />
          </span>
          <h2 style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: 'clamp(1.75rem, 3.2vw, 2.2rem)',
            fontWeight: 800,
            color: '#0F172A',
            letterSpacing: '-0.02em',
            margin: '0 auto 8px',
            lineHeight: 1.25,
          }}>
            <EditableText
              contentKey="home.partnerProducts.title"
              value={homeContent.partnerProducts?.title || "What we've built together"}
            />
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.94rem', maxWidth: '480px', margin: '0 auto 22px', lineHeight: 1.55, fontWeight: 500 }}>
            <EditableText
              contentKey="home.partnerProducts.description"
              value={homeContent.partnerProducts?.description || "Real ventures built in partnership with founders who chose to build, not just plan."}
            />
          </p>

          {/* Dot Indicators — click to jump, auto-slides every 4s */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            {items.map((_: any, idx: number) => {
              const isActive = activeProd === idx;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    clearInterval(autoSlideRef.current);
                    setActiveProd(idx);
                    // restart auto-slide after manual click
                    autoSlideRef.current = setInterval(() => {
                      setActiveProd((prev: number) => (prev + 1) % items.length);
                    }, 4000);
                  }}
                  aria-label={`Go to product ${idx + 1}`}
                  style={{
                    width: isActive ? '28px' : '8px',
                    height: '8px',
                    borderRadius: '100px',
                    backgroundColor: isActive ? '#2563EB' : '#CBD5E1',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                    flexShrink: 0,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* ── Main 2-Column Showcase Grid ── */}
        <div className="fv-showcase-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'flex-start' }}>

          {/* ── LEFT: Multi-Device Laptop & Mobile Mockups + Centered Tech Stack Below ── */}
          <div style={{ position: 'sticky', top: '80px', display: 'flex', flexDirection: 'column', gap: '28px', alignItems: 'center' }}>

            {/* Fixed-height wrapper prevents layout shift across all product slides */}
            <div style={{
              position: 'relative',
              width: '100%',
              height: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 40px',
            }}>
              {/* Transparent Left Carousel Arrow */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous Product"
                style={{
                  position: 'absolute',
                  left: '-20px',
                  top: '40%',
                  transform: 'translateY(-50%)',
                  zIndex: 25,
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.88)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(15, 23, 42, 0.12)',
                  color: '#0F172A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.12)',
                  transition: 'all 0.22s ease',
                }}
                onMouseOver={(e: any) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(15, 23, 42, 0.18)';
                }}
                onMouseOut={(e: any) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.88)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(15, 23, 42, 0.12)';
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              {/* Transparent Right Carousel Arrow */}
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next Product"
                style={{
                  position: 'absolute',
                  right: '-20px',
                  top: '40%',
                  transform: 'translateY(-50%)',
                  zIndex: 25,
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.88)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(15, 23, 42, 0.12)',
                  color: '#0F172A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.12)',
                  transition: 'all 0.22s ease',
                }}
                onMouseOver={(e: any) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(15, 23, 42, 0.18)';
                }}
                onMouseOut={(e: any) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.88)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(15, 23, 42, 0.12)';
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>

              {/* Radiant Blue Glow Orb emanating from top-left behind laptop screen */}
              <div style={{
                position: 'absolute',
                top: '-30px',
                left: '-30px',
                width: '120%',
                height: '120%',
                background: 'radial-gradient(circle at 35% 30%, rgba(59, 130, 246, 0.4) 0%, rgba(37, 99, 235, 0.18) 45%, transparent 72%)',
                filter: 'blur(45px)',
                zIndex: 0,
                pointerEvents: 'none',
              }} />

              <div style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                maxWidth: '420px',
                marginTop: '22px',
                filter: 'drop-shadow(0 18px 28px rgba(15,23,42,0.15))',
              }}>
                <div style={{
                  position: 'absolute',
                  top: '10.5%',
                  left: '12.4%',
                  width: '75.2%',
                  height: '76.4%',
                  zIndex: 1,
                  overflow: 'hidden',
                  backgroundColor: '#0F172A',
                  borderRadius: '4px 4px 0 0',
                }}>
                  <img
                    key={activeProd}
                    src={screenshotSrc}
                    alt={prod?.name || 'Product Screenshot'}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'top center',
                      display: 'block',
                      animation: 'fvSlideInRight 0.45s cubic-bezier(0.4,0,0.2,1) both',
                    }}
                  />
                </div>

                {/* STEP 2 — MacBook frame overlaid on top as the bezel */}
                <img
                  src="/images/macbook_mockup.png"
                  alt="MacBook Pro Mockup"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    position: 'relative',
                    zIndex: 2,
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>

            {/* Technologies Used (CENTERED DIRECTLY BELOW LAPTOP) */}
            <div style={{ textAlign: 'center' }}>
              <h4 style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '1rem',
                fontWeight: 800,
                color: '#0F172A',
                marginBottom: '14px',
                marginTop: 0,
                textAlign: 'center',
              }}>
                Technologies Used
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
                {techStack.map((tech: string, i: number) => renderTechBadge(tech, i))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Product Details — slides in from right on product change ── */}
          <div
            key={activeProd}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              animation: 'fvSlideInRight 0.45s cubic-bezier(0.4,0,0.2,1) both',
            }}
          >

            {/* Product Title */}
            <h3 style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'clamp(2.2rem, 4vw, 2.8rem)',
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              margin: '0 0 6px 0',
            }}>
              <EditableText
                contentKey={`home.partnerProducts.items.${activeProd}.name`}
                value={prod.name}
              />
            </h3>

            {/* Category / Subtitle */}
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '1.05rem',
              color: '#64748B',
              fontWeight: 500,
              margin: '0 0 20px 0',
            }}>
              <EditableText
                contentKey={`home.partnerProducts.items.${activeProd}.category`}
                value={prod.category || 'Venture Studio Product'}
              />
            </p>

            {/* Paragraph Description */}
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.96rem',
              color: '#334155',
              lineHeight: 1.6,
              fontWeight: 500,
              margin: '0 0 28px 0',
            }}>
              <EditableText
                contentKey={`home.partnerProducts.items.${activeProd}.description`}
                value={prod.whatWeDid || 'One connected platform to manage family life effortlessly. Built for modern families to manage finances, calendars, documents and communication in one unified platform.'}
              />
            </p>

            {/* Key Features List with Sharp Professional Icon Badges */}
            <div style={{ marginBottom: '28px' }}>
              <h4 style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '1.1rem',
                fontWeight: 800,
                color: '#0F172A',
                marginBottom: '16px',
                marginTop: 0,
              }}>
                Key Features
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {(prod.features && prod.features.length > 0 ? prod.features : defaultFeatures).slice(0, 3).map((feat: any, i: number) => {
                  const featTitle = typeof feat === 'string' ? feat : (feat.title || 'Core Feature');
                  const featDesc = typeof feat === 'object' ? feat.desc : 'Built for scale.';

                  const featureBadgeColors = [
                    { bg: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', border: '#BFDBFE', color: '#2563EB' },
                    { bg: 'linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 100%)', border: '#99F6E4', color: '#0D9488' },
                    { bg: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)', border: '#C7D2FE', color: '#4F46E5' },
                  ][i % 3];

                  const featureIcons = [
                    (
                      <svg key="0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={featureBadgeColors.color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    ),
                    (
                      <svg key="1" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={featureBadgeColors.color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    ),
                    (
                      <svg key="2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={featureBadgeColors.color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="20" x2="18" y2="10" />
                        <line x1="12" y1="20" x2="12" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="14" />
                      </svg>
                    )
                  ];

                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        minWidth: '42px',
                        borderRadius: '12px',
                        border: `1.5px solid ${featureBadgeColors.border}`,
                        background: featureBadgeColors.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                      }}>
                        {featureIcons[i % 3]}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.96rem', color: '#0F172A', lineHeight: 1.3 }}>
                        <EditableText contentKey={`home.partnerProducts.items.${activeProd}.features.${i}.title`} value={featTitle} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* What CrestCode Did */}
            <div style={{ marginBottom: '32px' }}>
              <h4 style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '1.1rem',
                fontWeight: 800,
                color: '#0F172A',
                marginBottom: '14px',
                marginTop: 0,
              }}>
                What CrestCode Did
              </h4>
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                padding: '14px 24px',
                display: 'flex',
                gap: '40px',
                alignItems: 'center',
                boxShadow: '0 4px 16px rgba(0, 90, 226, 0.06)',
              }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, marginBottom: '3px' }}>Duration</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
                    <EditableText contentKey={`home.partnerProducts.items.${activeProd}.duration`} value={prod.duration || '4 Months'} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, marginBottom: '3px' }}>Team</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
                    <EditableText contentKey={`home.partnerProducts.items.${activeProd}.team`} value={prod.team || '3 Members'} />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons — Theme Primary Blue Gradient Pill matching CrestCode Theme */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <a
                href={prod.liveUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'linear-gradient(135deg, #005AE2 0%, #2563EB 50%, #1D4ED8 100%)',
                  color: '#FFFFFF',
                  padding: '12px 32px',
                  borderRadius: '100px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 24px -4px rgba(0, 90, 226, 0.42)',
                  border: 'none',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: '0.01em',
                  cursor: 'pointer',
                  userSelect: 'none' as const,
                }}
                onMouseOver={(e: any) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px -4px rgba(0, 90, 226, 0.55)';
                }}
                onMouseOut={(e: any) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 24px -4px rgba(0, 90, 226, 0.42)';
                }}
              >
                <span>Visit Live Website</span>
                <span style={{ fontSize: '0.95rem' }}>→</span>
              </a>

              <button
                type="button"
                onClick={() => handleScroll('idea')}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #2563EB',
                  color: '#005AE2',
                  padding: '11px 28px',
                  borderRadius: '100px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: '0.01em',
                  boxShadow: '0 4px 14px rgba(0, 90, 226, 0.12)',
                  userSelect: 'none' as const,
                }}
                onMouseOver={(e: any) => {
                  e.currentTarget.style.backgroundColor = '#EFF6FF';
                  e.currentTarget.style.borderColor = '#005AE2';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 90, 226, 0.22)';
                }}
                onMouseOut={(e: any) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#2563EB';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 90, 226, 0.12)';
                }}
              >
                View Case Study
              </button>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fvSlideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fvScreenFadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}} />
    </section>
  );
}
