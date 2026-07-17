'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import Link from 'next/link';
import useScrollReveal from '@/hooks/useScrollReveal';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GrainOverlay from '@/components/effects/GrainOverlay';
import { useContent } from '@/context/ContentContext';
import useMagneticHover from '@/hooks/useMagneticHover';
import BorderBeam from '@/components/effects/BorderBeam';
import TextReveal from '@/components/effects/TextReveal';
import GradientText from '@/components/effects/GradientText';
import EditableText from '@/components/admin/EditableText';

import '@/styles/global-styles.css';

export default function FaqPage() {
  const { content, loading, error } = useContent();
  const [activeTab, setActiveTab] = useState('engagement');
  const [openFaq, setOpenFaq] = useState('engagement-1');
  useScrollReveal();
  const magBtn = useMagneticHover(15);
  const magBtn2 = useMagneticHover(15);
  
  const [faqsData, setFaqsData] = useState<any[]>([]);

  React.useEffect(() => {
    fetch('/api/faqs')
      .then(res => res.json())
      .then(json => {
        if (json.status === 'success') {
          setFaqsData(json.payload || []);
        }
      })
      .catch(() => {});
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#F4F5F7] font-manrope">Loading FAQs...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen bg-[#F4F5F7] font-manrope text-red-500">Error: {error}</div>;
  if (!content) return null;

  const faqContent = content.faq;

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

        :root {
          /* Color System */
          --bg-base: #F4F5F7; /* Slightly grey background from the image */
          --bg-light: #FFFFFF;
          --bg-dark: #0A0F1C;
          
          /* Primary & Accents */
          --primary-blue: #005AE2;
          --bright-blue: #0084FF; /* Vibrant blue for this specific page */
          --bright-blue-hover: #0070E0;
          --light-blue-bg: #EBF5FF;
          
          /* Text */
          --text-black: #020617;
          --text-main: #0F172A;
          --text-muted: #64748B;
          --white: #FFFFFF;
          
          /* Borders */
          --border-light: #E2E8F0;
          --border-dark: rgba(255, 255, 255, 0.1);
        }

        /* Base Styles */
        body, html {
          margin: 0;
          padding: 0;
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
          background-color: var(--bg-base);
          background: linear-gradient(135deg, #F4F5F7 0%, #FFFFFF 100%);
          color: var(--text-black);
          scroll-behavior: smooth;
        }

        /* Headings - Manrope */
        h1, h2, h3, h4, h5, h6, .hero-title, .section-title, .section-eyebrow, .card-title, .navbar-brand, .feature-title, .t-name-light, .t-name, .fq-author, .footer-logo, .footer-heading {
          font-family: 'Manrope', sans-serif;
        }

        /* Sub-text - Manrope */
        .section-subtitle, .hero-description, .card-description, .feature-desc, .t-quote, .t-role-light, .t-role, .fq-role, .footer-tagline, .stat-label, .step-desc {
          font-family: 'Manrope', sans-serif;
        }

        /* Content - Inter */
        p, span, div, button, input, textarea, a, li, .navbar-links, .nav-dropdown-content a, .idea-textarea, .form-message {
          font-family: 'Inter', sans-serif;
        }

        /* Page Load Animation */
        .faq-page { min-height: 100vh; overflow-x: hidden; animation: cc-pageSlide 0.7s cubic-bezier(0.4,0,0.2,1) both; }

        /* Fade In Up Animation */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-delay-1 { animation-delay: 0.1s; }
        .animate-delay-2 { animation-delay: 0.2s; }
        .animate-delay-3 { animation-delay: 0.3s; }
        .animate-delay-4 { animation-delay: 0.4s; }
        .pt-0 { padding-top: 0 !important; }

        /* Typography */
        .text-bright-blue { color: var(--bright-blue); }

        /* Buttons */
        .btn-bright { 
          background-color: var(--bright-blue); 
          color: var(--white); 
          padding: 14px 28px; 
          border-radius: 100px; 
          font-weight: 700; 
          font-size: 15px; 
          border: none; 
          cursor: pointer; 
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          position: relative; overflow: hidden;
          box-shadow: 0 4px 14px rgba(0,136,255,0.25);
        }
        .btn-bright::before {
          content:''; position:absolute; top:0; left:-100%; width:60%; height:100%;
          background: linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent);
          transition: left 0s; pointer-events: none;
        }
        .btn-bright:hover { background-color: var(--bright-blue-hover); transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,136,255,0.35); }
        .btn-bright:hover::before { left: 140%; transition: left 0.5s ease; }

        .btn-white {
          background-color: var(--white);
          color: var(--bright-blue);
          padding: 14px 28px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 15px;
          border: none;
          cursor: pointer;
          transition: transform 0.2s;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-white:hover { transform: translateY(-2px); }

        .btn-solid {
            background-color: var(--bg-dark);
            color: var(--white);
            padding: 14px 28px;
            border-radius: 8px;
            font-weight: 700;
            font-size: 15px;
            border: none;
            cursor: pointer;
            transition: transform 0.2s;
        }

        .btn-outline-white {
          background-color: transparent;
          color: var(--white);
          padding: 14px 28px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 15px;
          border: 1px solid rgba(255,255,255,0.4);
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .btn-outline-white:hover { border-color: var(--white); }
        
        .btn-nav { padding: 10px 24px; font-size: 14px; border-radius: 100px; background-color: var(--primary-blue);}


        /* Hero Section */
        .hero-section {
          background-color: #F1F5F9 !important;
        }
        .hero-eyebrow-pill {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          background-color: #E6EFFF !important;
          color: #005AE2 !important;
          font-size: 0.8rem !important;
          font-weight: 800 !important;
          letter-spacing: 0.15em !important;
          padding: 8px 18px !important;
          border-radius: 100px !important;
          margin-bottom: 32px !important;
          text-transform: uppercase !important;
          font-family: 'Manrope', sans-serif !important;
        }
        .hero-title {
          font-family: 'Manrope', sans-serif !important;
          font-size: 52px !important;
          font-weight: 800 !important;
          letter-spacing: -0.04em !important;
          line-height: 1.22 !important;
          color: #020617 !important;
          margin: 0 auto 28px !important;
          text-align: center !important;
          max-width: 960px !important;
        }
        .hero-title span {
          font-family: 'Manrope', sans-serif !important;
          font-weight: 800 !important;
        }
        @media(max-width: 768px) {
          .hero-title {
            font-size: 32px !important;
          }
        }
        .hero-description {
          font-family: 'Inter', sans-serif !important;
          font-size: clamp(0.925rem, 2vw, 0.975rem) !important;
          font-weight: 500 !important;
          color: #64748B !important;
          line-height: 1.8 !important;
          max-width: 720px !important;
          margin: 0 auto 32px !important;
          text-align: center !important;
        }

        /* Tabs Navigation */
        .tabs-container {
          display: flex;
          gap: 32px;
          border-bottom: 2px solid var(--border-light);
          margin-bottom: 48px;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .tabs-container::-webkit-scrollbar { display: none; }
        .tab-item {
          padding: 12px 0;
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 3px solid transparent;
          margin-bottom: -2px;
          white-space: nowrap;
          transition: all 0.2s;
        }
        .tab-item:hover { 
          color: var(--text-black);
          background-color: rgba(0, 0, 0, 0.05);
          border-radius: 4px 4px 0 0;
        }
        .tab-item.active {
          color: var(--bright-blue);
          border-bottom-color: var(--bright-blue);
          background-color: rgba(0, 132, 255, 0.03);
          border-radius: 8px 8px 0 0;
        }
        .tab-item:not(.active) {
          color: var(--text-black);
        }

        /* FAQ Accordions - New Style */
        .faq-group { margin-bottom: 80px; }
        .faq-group-header {
          margin-bottom: 32px;
        }
        .faq-group-header h2 {
          font-size: 36px !important;
          font-weight: 800;
          color: var(--text-black);
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }
        .faq-group-header p {
          font-size: 1rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .faq-group-header a {
          color: var(--primary-blue);
          text-decoration: none;
          font-weight: 600;
        }
        .faq-group-header a:hover {
          text-decoration: underline;
        }
        
        .accordion-item {
          background: var(--white);
          border-radius: 16px;
          margin-bottom: 16px;
          cursor: pointer;
          border: 1px solid var(--border-light);
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
          overflow: hidden;
        }
        .accordion-item:hover { 
          border-color: rgba(0, 90, 226, 0.2);
        }
        .accordion-item.open { 
          border-color: rgba(0, 90, 226, 0.3);
          background-color: #F8FAFC;
        }
        .accordion-question {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          font-weight: 600;
          font-size: 1rem;
          color: var(--text-main);
        }
        .faq-icon-wrapper {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }
        .accordion-item.open .faq-icon-wrapper {
          transform: rotate(45deg);
        }
        .faq-icon-wrapper svg {
          color: var(--text-muted);
          transition: color 0.3s ease;
        }
        .accordion-item.open .faq-icon-wrapper svg {
          color: var(--primary-blue);
        }
        .faq_line-icon {
          transition: opacity 0.3s ease;
        }
        .accordion-answer {
          height: 0;
          opacity: 0;
          overflow: hidden;
          transition: height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease;
        }
        .accordion-item.open .accordion-answer {
          height: auto;
          opacity: 1;
        }
        .faq_rich-text {
          padding: 0 20px 20px 20px;
          font-size: 0.95rem;
          color: var(--text-muted);
          line-height: 1.7;
          font-weight: 500;
        }
        .faq_rich-text p {
          margin-bottom: 16px;
        }
        .faq_rich-text a {
          color: var(--primary-blue);
          text-decoration: none;
          font-weight: 600;
        }
        .faq_rich-text a:hover {
          text-decoration: underline;
        }
        .faq_rich-text ul, .faq_rich-text ol {
          margin: 16px 0;
          padding-left: 24px;
        }
        .faq_rich-text li {
          margin-bottom: 8px;
        }

        /* CTA Banner */
        .cta-banner {
          background: var(--white);
          border-radius: 24px;
          text-align: center;
          color: var(--text-black);
          position: relative;
          overflow: hidden;
          margin-top: 32px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
        }
        .cc-gradient-text { background: linear-gradient(90deg, #0088FF, #005AE2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .cta-bg-icon {
          position: absolute;
          right: -5%;
          top: 50%;
          transform: translateY(-50%);
          width: 250px;
          height: 250px;
          color: var(--bright-blue);
          opacity: 0.05;
          pointer-events: none;
        }
        .cta-content { position: relative; z-index: 1; max-width: 600px; margin: 0 auto; }
        .cta-title { font-size: clamp(1.8rem, 3vw, 2.25rem); font-weight: 800; margin-bottom: 16px; letter-spacing: -0.02em; }
        .cta-desc { font-size: clamp(0.95rem, 2vw, 1.05rem); font-weight: 500; color: var(--text-muted); margin-bottom: 32px; line-height: 1.6; }
        .cta-buttons { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }


        @media (max-width: 900px) {
          .tabs-container {
            padding-bottom: 8px !important;
          }
          
          .tab-item {
            font-size: 0.875rem !important;
          }
          
          .accordion-item {
            padding: 16px 20px !important;
          }
          
          .accordion-header {
            font-size: 0.95rem !important;
          }
          
          .cta-banner {
            padding: 24px 20px !important;
          }
          
          .cta-buttons {
            flex-direction: column !important;
          }
          
          .cta-buttons button {
            width: 100% !important;
          }
        }
      `}} />

      <div className="faq-page" style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#F8FAFC' }}>
        {/* Ambient glow orbs */}
        <div className="cc-glow-orb" style={{ width: 600, height: 600, top: '-200px', right: '-150px', background: 'radial-gradient(circle, rgba(0, 132, 255, 0.15) 0%, transparent 70%)', position: 'absolute', borderRadius: '50%', filter: 'blur(80px)', zIndex: 0 }} />
        <div className="cc-glow-orb" style={{ width: 500, height: 500, bottom: '10%', left: '-100px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)', position: 'absolute', borderRadius: '50%', filter: 'blur(80px)', zIndex: 0 }} />
        <div className="cc-glow-orb" style={{ width: 400, height: 400, top: '40%', right: '10%', background: 'radial-gradient(circle, rgba(20, 184, 166, 0.08) 0%, transparent 70%)', position: 'absolute', borderRadius: '50%', filter: 'blur(60px)', zIndex: 0 }} />
        <Header currentPage="faq" />

        {/* Hero Section */}
        <section className="hero-section" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Hero Background */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(37,99,235,0.18) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 20% 80%, rgba(37,99,235,0.08) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }}></div>
          {/* Hero Grid */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(37,99,235,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.08) 1px, transparent 1px)', backgroundSize: '80px 80px', maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 0%, transparent 80%)', opacity: 0.4, pointerEvents: 'none', zIndex: 0 }}></div>
          {/* Ambient Glows */}
          <div style={{ position: 'absolute', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.25), transparent 70%)', top: '-200px', left: '50%', transform: 'translateX(-50%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }}></div>
          <div style={{ position: 'absolute', width: '520px', height: '520px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.2), transparent 70%)', bottom: '0px', left: '0px', filter: 'blur(90px)', pointerEvents: 'none', zIndex: 0 }}></div>
          <div style={{ position: 'absolute', width: '520px', height: '520px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.2), transparent 70%)', bottom: '0px', right: '0px', filter: 'blur(90px)', pointerEvents: 'none', zIndex: 0 }}></div>

          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="hero-eyebrow-pill">
              <EditableText contentKey="faq.hero.eyebrow" value={faqContent.hero.eyebrow || "FREQUENTLY ASKED QUESTIONS"} />
            </div>
            <EditableText
              as="h1"
              contentKey="faq.hero.title"
              value={faqContent.hero.title || "Got Questions? We've Got Answers"}
              className="hero-title"
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {(() => {
                const headingText = faqContent.hero.title || "Got Questions? We've Got Answers";
                const lines = headingText.includes('\n') ? headingText.split('\n') : [headingText];
                
                return lines.map((line, lineIdx) => {
                  const words = line.split(/[\s\u00a0]+/);
                  const hasNewlines = headingText.includes('\n');
                  return (
                    <React.Fragment key={lineIdx}>
                      {words.map((word: string, index: number) => {
                        if (!word) return null;
                        const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
                        const cleanWordUpper = cleanWord.toUpperCase();
                        const isBlue = ['QUESTIONS', 'ANSWERS'].includes(cleanWordUpper);
                        const isMidpoint = !hasNewlines && index === Math.floor(words.length / 2) - 1;
                        return (
                          <React.Fragment key={index}>
                            <span style={isBlue ? { color: '#005AE2' } : {}}>
                              {word}{' '}
                            </span>
                            {isMidpoint && <br />}
                          </React.Fragment>
                        );
                      })}
                      {lineIdx < lines.length - 1 && <br />}
                    </React.Fragment>
                  );
                });
              })()}
            </EditableText>
            <p className="hero-description">
              <EditableText
                contentKey="faq.hero.subheading"
                value={faqContent.hero.subheading}
              />
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button ref={magBtn} className="btn-bright cc-magnetic" onClick={() => document.getElementById('faq-section')?.scrollIntoView({behavior: 'smooth'})}>
                <EditableText contentKey="faq.hero.buttonText" value={faqContent.hero.buttonText} />
              </button>
            </div>
          </div>
        </section>

        {/* FAQ Content Section */}
        <section id="faq-section" style={{ backgroundColor: '#FFFFFF', position: 'relative' }}>
          <div className="section-container">

            {/* Dynamic Category Rendering with Reordering */}
            {[
              { id: 'engagement', content: (
                <div id="engagement-group" className="faq-group cc-slide-left cc-delay-1">
                  <div className="faq-group-header">
                    <h2 style={{ fontSize: '36px' }}>
                      <EditableText
                        contentKey="faq.categories.engagement.title"
                        value={faqContent.categories.engagement.title}
                      />
                    </h2>
                    <p>
                      Everything you need to know about the <a>Studio track</a>
                    </p>
                  </div>

                  {(() => {
                    const list = faqsData.length > 0 ? faqsData.filter(f => f.category === 'engagement') : faqContent.categories.engagement.faqs;
                    return list.map((faq, idx) => (
                      <div key={faq.id || idx} className={`accordion-item ${openFaq === `engagement-${idx + 1}` ? 'open' : ''}`} onClick={() => toggleFaq(`engagement-${idx + 1}`)}>
                        <div className="accordion-question">
                          <span>{faq.question}</span>
                          <div className="faq-icon-wrapper">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path d="M5 13V11H19V13H5Z" fill="currentColor" className="faq_line-icon horizontal"></path>
                              <path d="M13 19L11 19L11 5L13 5L13 19Z" fill="currentColor" className="faq_line-icon vertical"></path>
                            </svg>
                          </div>
                        </div>
                        <div className="accordion-answer">
                          <div className="faq_rich-text">
                            <p>{faq.answer}</p>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              )},
              { id: 'product', content: (
                <div id="product-group" className="faq-group cc-slide-center cc-delay-2">
                  <div className="faq-group-header">
                    <h2 style={{ fontSize: '36px' }}>
                      <EditableText
                        contentKey="faq.categories.product.title"
                        value={faqContent.categories.product.title}
                      />
                    </h2>
                    <p>
                      Everything you need to know about the <a>Product track</a>
                    </p>
                  </div>

                  {(() => {
                    const list = faqsData.length > 0 ? faqsData.filter(f => f.category === 'product') : faqContent.categories.product.faqs;
                    return list.map((faq, idx) => (
                      <div key={faq.id || idx} className={`accordion-item ${openFaq === `product-${idx + 1}` ? 'open' : ''}`} onClick={() => toggleFaq(`product-${idx + 1}`)}>
                        <div className="accordion-question">
                          <span>{faq.question}</span>
                          <div className="faq-icon-wrapper">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path d="M5 13V11H19V13H5Z" fill="currentColor" className="faq_line-icon horizontal"></path>
                              <path d="M13 19L11 19L11 5L13 5L13 19Z" fill="currentColor" className="faq_line-icon vertical"></path>
                            </svg>
                          </div>
                        </div>
                        <div className="accordion-answer">
                          <div className="faq_rich-text">
                            <p>{faq.answer}</p>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              )},
              { id: 'security', content: (
                <div id="security-group" className="faq-group cc-slide-right cc-delay-3">
                  <div className="faq-group-header">
                    <h2 style={{ fontSize: '36px' }}>
                      <EditableText
                        contentKey="faq.categories.security.title"
                        value={faqContent.categories.security.title}
                      />
                    </h2>
                    <p>
                      Everything you need to know about the <a>Security track</a>
                    </p>
                  </div>

                  {(() => {
                    const list = faqsData.length > 0 ? faqsData.filter(f => f.category === 'security') : faqContent.categories.security.faqs;
                    return list.map((faq, idx) => (
                      <div key={faq.id || idx} className={`accordion-item ${openFaq === `sec-${idx + 1}` ? 'open' : ''}`} onClick={() => toggleFaq(`sec-${idx + 1}`)}>
                        <div className="accordion-question">
                          <span>{faq.question}</span>
                          <div className="faq-icon-wrapper">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path d="M5 13V11H19V13H5Z" fill="currentColor" className="faq_line-icon horizontal"></path>
                              <path d="M13 19L11 19L11 5L13 5L13 19Z" fill="currentColor" className="faq_line-icon vertical"></path>
                            </svg>
                          </div>
                        </div>
                        <div className="accordion-answer">
                          <div className="faq_rich-text">
                            <p>{faq.answer}</p>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              )}
            ].sort((a, b) => (a.id === activeTab ? -1 : b.id === activeTab ? 1 : 0)).map(cat => cat.content)}

            {/* CTA Banner */}
            <BorderBeam className="cta-banner cc-reveal cc-delay-1 cc-shine" style={{ padding: 0 }}>
              <div style={{ 
                padding: '24px 24px', 
                textAlign: 'center', 
                width: '100%', 
                background: '#005AE2', 
                borderRadius: '24px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)', borderRadius: '50%' }}></div>
                <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto' }}>
                  <h2 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '16px', color: '#FFFFFF' }} className="font-manrope">
                    <EditableText contentKey="faq.cta.title" value={faqContent.cta.title} />
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.125rem', fontWeight: 500, marginBottom: '40px', lineHeight: 1.6 }}>
                    <EditableText contentKey="faq.cta.subtitle" value={faqContent.cta.subtitle} />
                  </p>
                  <Link href="/contact" style={{ textDecoration: 'none' }}>
                    <button ref={magBtn2} className="cc-magnetic" style={{ backgroundColor: '#FFFFFF', color: '#005AE2', padding: '14px 32px', borderRadius: '100px', fontWeight: 800, fontSize: '15px', border: 'none', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', transition: 'all 0.3s ease' }}>
                      <EditableText contentKey="faq.cta.buttonText" value={faqContent.cta.buttonText} />
                    </button>
                  </Link>
                </div>
              </div>
            </BorderBeam>

          </div>
        </section>


        <Footer />

      </div>
    </>
  );
}










