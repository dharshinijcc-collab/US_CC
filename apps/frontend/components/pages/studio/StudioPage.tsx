'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import { useContent } from '../../../context/ContentContext';
import '@/styles/global-styles.css';

// ─── Sub-components & Styles ──────────────────────────────────────────────────
import { studioStyles } from './styles';
import { PHASE_STEP_IDS, getStackCards } from './config';

import StudioHero from './StudioHero';
import StudioPortfolio from './StudioPortfolio';
import StudioVentureModel from './StudioVentureModel';
import StudioProcess from './StudioProcess';
import StudioDifference from './StudioDifference';
import StudioCta from './StudioCta';

export default function StudioPage() {
  const { content, loading, error } = useContent();

  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [activeTimelineIndex, setActiveTimelineIndex] = useState<number | null>(null);
  const [heroCarouselIndex, setHeroCarouselIndex] = useState(0);
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(true);

  const renderCellText = (text: string) => {
    if (!text) return null;
    const clean = text.trim();
    if (clean === '✓' || clean === 'check') {
      return <span className="check">✓</span>;
    } else if (clean === '✗' || clean === 'cross') {
      return <span className="cross">✗</span>;
    } else if (clean.toLowerCase() === 'sometimes' || clean.toLowerCase() === 'rarely' || clean.toLowerCase() === 'varies') {
      return <span className="partial">{text}</span>;
    }
    return <span>{text}</span>;
  };

  const handleManualPhaseChange = (index: number) => {
    setIsAutoAdvancing(false);
    setHeroCarouselIndex(index);
    const target = document.getElementById(PHASE_STEP_IDS[index]) || document.getElementById('selection-process');
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#${PHASE_STEP_IDS[index]}`);
  };

  // IntersectionObserver for active timeline index
  useEffect(() => {
    if (!content) return;

    const observerOptions = {
      root: null,
      rootMargin: '-45% 0px -45% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-timeline-index') || '0');
          setActiveTimelineIndex(index);
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.timeline-row-vertical');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [content, loading]);

  // Scroll to hash location on load
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (PHASE_STEP_IDS.includes(hash)) {
      const index = PHASE_STEP_IDS.indexOf(hash);
      setHeroCarouselIndex(index);
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [loading]);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (!isAutoAdvancing) return;

    const interval = setInterval(() => {
      setHeroCarouselIndex(prev => (prev + 1) % 7);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoAdvancing]);

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#F3F5F9] font-manrope">Loading studio...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen bg-[#F3F5F9] font-manrope text-red-500">Error: {error}</div>;
  if (!content) return null;

  const studioContent = content.studio;
  const stackCards = getStackCards(studioContent);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: studioStyles }} />

      <Header />
      <div className="studio-page" style={{ position: 'relative', overflow: 'clip', backgroundColor: '#F8FAFC' }}>
        {/* Intro Section */}
        <StudioHero
          studioContent={studioContent}
          handleManualPhaseChange={handleManualPhaseChange}
          heroCarouselIndex={heroCarouselIndex}
        />

        {/* Portfolio Section */}
        <StudioPortfolio studioContent={studioContent} />

        {/* Venture Model Section */}
        <StudioVentureModel
          studioContent={studioContent}
          renderCellText={renderCellText}
        />

        {/* Process Section */}
        <StudioProcess
          studioContent={studioContent}
          activeTimelineIndex={activeTimelineIndex}
          heroCarouselIndex={heroCarouselIndex}
          handleManualPhaseChange={handleManualPhaseChange}
        />

        {/* Differentiation & FAQ Section */}
        <StudioDifference
          studioContent={studioContent}
          openFaqIdx={openFaqIdx}
          setOpenFaqIdx={setOpenFaqIdx}
          renderCellText={renderCellText}
        />

        {/* CTA Section */}
        {studioContent.cta && (
          <StudioCta studioContent={studioContent} />
        )}

        <Footer />
      </div>
    </>
  );
}
