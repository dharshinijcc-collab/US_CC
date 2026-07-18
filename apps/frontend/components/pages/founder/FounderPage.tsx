'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useRef } from 'react';
import useScrollReveal from '@/hooks/useScrollReveal';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { useContent } from '@/context/ContentContext';
import localConfig from '@/shared/config.json';
import { useAdmin } from '@/context/AdminContext';

// ─── Sub-components & Helpers ───────────────────────────────────────────────
import FounderHero from './FounderHero';
import FounderAudiences from './FounderAudiences';
import FounderTechHub from './FounderTechHub';
import FounderValidation from './FounderValidation';
import FounderTestimonials from './FounderTestimonials';
import FounderWizardModal from './FounderWizardModal';
import './founder.css';

import {
  PARTNER_PRODUCTS,
  renderProductIcon,
  RotatingIdeaPlaceholder,
  MetricsRow,
  TechLogo,
  getCardIcon
} from './helpers';

export default function LandingPage() {
  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const { content, loading, error } = useContent();
  const { isAdminMode } = useAdmin();
  const homeContent = content?.home || (localConfig as any).home;

  const [idea, setIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [submissionStep, setSubmissionStep] = useState(0); // 0: Idle, 1: Step 1 (About the Idea), 2: Step 2 (Founder), 3: Loading, 4: Results
  const [partnerProductsData, setPartnerProductsData] = useState<any[]>([]);

  // Fetch partner products from API
  useEffect(() => {
    fetch('/api/partner-products')
      .then(res => res.json())
      .then(json => {
        if (json.status === 'success') {
          setPartnerProductsData(json.payload || []);
        }
      })
      .catch(() => {});
  }, []);

  const handleReset = () => {
    setSubmissionStep(0);
    setIdea('');
  };
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const heroRef = useRef(null);

  const [activeProd, setActiveProd] = useState(0);

  const ideaExamples = [
    "Building a comprehensive life and legacy management application for family",
    "Creating reporting solutions for thinkandswim platform for option traders",
    "Creating an AI powered HOA management solution"
  ];

  const backFeaturesFallback = [
    // Card 0: Visionary Founders
    [
      "Validated product concept and market positioning",
      "Technical architecture and product roadmap",
      "A Minimum Lovable Product — built to delight, not just function",
      "Go-to-market strategy and launch support",
      "Pitch materials for investors or partners"
    ],
    // Card 1: Business Owners
    [
      "Clear problem definition and solution scope",
      "Business case and requirements documentation",
      "A Minimum Lovable Product your users will actually love",
      "Operational workflows and automation built in",
      "A long-term partner who grows with your business"
    ]
  ];

  // Carousel scrolling/dragging logic
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-scroll logic (smooth loop without duplicate elements)
  useEffect(() => {
    if (isDown || isHovered) return;

    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        const maxScroll = scrollWidth - clientWidth;

        if (scrollLeft >= maxScroll - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carouselRef.current.scrollBy({ left: 452, behavior: 'smooth' });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isDown, isHovered]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDown(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeftState(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
    setIsHovered(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    carouselRef.current.scrollLeft = scrollLeftState - walk;
  };

  const scrollLeftFunc = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -450, behavior: 'smooth' });
    }
  };

  const scrollRightFunc = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 450, behavior: 'smooth' });
    }
  };

  useScrollReveal([loading, content]);

  // Handle body scroll locking for modals
  useEffect(() => {
    if (submissionStep >= 1 && submissionStep <= 4) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, [submissionStep]);

  if (error && localConfig?.home) {
    console.warn("Content fetch failed, falling back to local static config:", error);
  }

  if (loading && !content && !localConfig?.home) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F3F5F9] font-manrope">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-600 font-medium">Loading</p>
    </div>
  );

  if (error && !localConfig?.home) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F3F5F9] font-manrope px-4 text-center">
      <div className="text-red-500 text-5xl mb-4">⚠️</div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Content Loading Failed</h1>
      <p className="text-gray-600 mb-6">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
      >
        Retry Connection
      </button>
    </div>
  );

  if (!homeContent) return (
    <div className="flex items-center justify-center min-h-screen bg-[#F3F5F9] font-manrope">
      <p className="text-gray-500 italic">No content available. Please ensure the backend is running or config.json is populated.</p>
    </div>
  );

  const methodologyCards = homeContent.methodology.cards.length <= 4
    ? [
      ...homeContent.methodology.cards,
      {
        title: "AI & Automation Integration",
        highlight: "INTELLIGENT WORKFLOWS. ELITE SPEED.",
        description: "We infuse artificial intelligence and workflow automation directly into your venture’s core operations to minimize manual friction and accelerate scale.",
        icon: "cpu"
      },
      {
        title: "Silicon Valley Execution",
        highlight: "GLOBAL TALENT. RAPID LAUNCH.",
        description: "Access top-tier engineers, world-class designers, and product leaders working on a unified, high-velocity roadmap designed to optimize your runway.",
        icon: "target"
      }
    ]
    : homeContent.methodology.cards;

  const handleIdeaSubmit = (e: any) => {
    e.preventDefault();
    if (!idea || idea.trim().length < 10) {
      setFormMessage('Please tell us about your idea (at least 10 characters)');
      setMessageType('error');
      return;
    }
    setFormMessage('');
    window.location.href = `/founder/idea-validator?idea=${encodeURIComponent(idea)}`;
  };

  return (
    <>
      <Header />

      <div className="landing-page" style={{ overflow: 'clip', position: 'relative', backgroundColor: '#F8FAFC' }}>
        {/* Step 1: Idea Submission Hero */}
        <FounderHero
          heroRef={heroRef}
          homeContent={homeContent}
          ideaExamples={ideaExamples}
          idea={idea}
          isLoading={isLoading}
          setIdea={setIdea}
          handleIdeaSubmit={handleIdeaSubmit}
          formMessage={formMessage}
          submissionStep={submissionStep}
          messageType={messageType}
        />

        {/* Target Audiences Section */}
        <FounderAudiences
          homeContent={homeContent}
          flippedCards={flippedCards}
          setFlippedCards={setFlippedCards}
          handleScroll={handleScroll}
          backFeaturesFallback={backFeaturesFallback}
        />

        {/* Tech Hub Section */}
        <FounderTechHub
          homeContent={homeContent}
          partnerProductsData={partnerProductsData}
          PARTNER_PRODUCTS={PARTNER_PRODUCTS}
          renderProductIcon={renderProductIcon}
          activeProd={activeProd}
          setActiveProd={setActiveProd}
          scrollLeftFunc={scrollLeftFunc}
          scrollRightFunc={scrollRightFunc}
          carouselRef={carouselRef}
          handleMouseDown={handleMouseDown}
          handleMouseLeave={handleMouseLeave}
          handleMouseUp={handleMouseUp}
          handleMouseMove={handleMouseMove}
          content={content}
          methodologyCards={methodologyCards}
        />

        {/* Partner Showcase Section */}
        {(() => {
          const items = partnerProductsData.length > 0 ? partnerProductsData : (homeContent.partnerProducts?.items || PARTNER_PRODUCTS);
          const rawProd = items[activeProd] || (partnerProductsData.length > 0 ? partnerProductsData[activeProd] : PARTNER_PRODUCTS[activeProd]);
          
          const nameToRender = rawProd.name === 'VHOA' ? 'NestBloq' : rawProd.name;
          const prod = {
            ...rawProd,
            name: nameToRender,
            subtitle: rawProd.name === 'VHOA' ? 'B2B partner operations and workflow automation' : (rawProd.subtitle || rawProd.tagline),
            whatWeDid: rawProd.name === 'VHOA' 
              ? 'Designed and built the operations hub to orchestrate workflow management, delivery logistics, and service coordination for B2B partner products.' 
              : (rawProd.whatWeDid || rawProd.what_we_did),
            team: rawProd.team || rawProd.team_size,
            stack: rawProd.stack || rawProd.tech_stack,
            liveUrl: rawProd.liveUrl || rawProd.website_url,
            features: (rawProd.features || []).map((f: any) => typeof f === 'string' ? { text: f } : f),
          };
          
          const resolvedStatus = prod.status || 
            (prod.status_type ? { type: prod.status_type, text: prod.status_text, subText: prod.status_subtext } : null) ||
            PARTNER_PRODUCTS.find(p => p.name.toLowerCase() === prod.name?.toLowerCase())?.status ||
            (rawProd.name?.toLowerCase() === 'vhoa' ? PARTNER_PRODUCTS.find(p => p.name === 'NestBloq')?.status : null);

          return (
            <FounderValidation
              homeContent={homeContent}
              handleScroll={handleScroll}
              items={items}
              activeProd={activeProd}
              setActiveProd={setActiveProd}
              renderProductIcon={renderProductIcon}
              prod={prod}
              resolvedStatus={resolvedStatus}
              PARTNER_PRODUCTS={PARTNER_PRODUCTS}
              rawProd={rawProd}
            />
          );
        })()}

        {/* Testimonials Section */}
        <FounderTestimonials homeContent={homeContent} />

        <Footer />
      </div>

      {/* 2-STEP FORM WIZARD */}
      <FounderWizardModal
        isOpen={submissionStep >= 1 && submissionStep <= 3}
        onClose={handleReset}
        idea={idea}
        setIdea={setIdea}
        submissionStep={submissionStep}
        setSubmissionStep={setSubmissionStep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </>
  );
}
