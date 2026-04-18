import React, { useState } from 'react';
import useScrollReveal from './useScrollReveal';
import Header from './components/Header';
import Footer from './components/Footer';

// Effects & Hooks
import TextReveal from './components/effects/TextReveal';
import useMagneticHover from './hooks/useMagneticHover';
import GrainOverlay from './components/effects/GrainOverlay';
import BorderBeam from './components/effects/BorderBeam';
import GradientText from './components/effects/GradientText';

// Effects & Hooks
export default function FaqPage() {
  const [activeTab, setActiveTab] = useState('engagement');
  const [openFaq, setOpenFaq] = useState('engagement-1');
  useScrollReveal();
  const magBtn = useMagneticHover(15);
  const magBtn2 = useMagneticHover(15);

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');

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
          font-family: 'Plus Jakarta Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
          background-color: var(--bg-base);
          color: var(--text-black);
          scroll-behavior: smooth;
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
        .section-container { max-width: 1200px; margin: 0 auto; padding: clamp(40px, 6vw, 80px) 24px; }
        .pt-0 { padding-top: 0 !important; }
        
        /* Typography */
        .hero-title { 
          font-size: clamp(2rem, 4vw, 3rem); 
          font-weight: 800; 
          letter-spacing: -0.02em; 
          margin-bottom: 16px; 
          line-height: 1.15; 
          color: var(--text-black);
        }
        .text-bright-blue { color: var(--bright-blue); }
        
        .body-text {
          font-size: clamp(0.95rem, 2vw, 1.05rem);
          line-height: 1.6;
          color: var(--text-muted);
          font-weight: 500;
        }

        /* Buttons */
        .btn-bright { 
          background-color: var(--bright-blue); 
          color: var(--white); 
          padding: 14px 28px; 
          border-radius: 8px; 
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

        /* Navbar */
        .navbar-wrapper { position: fixed; top: 24px; left: 0; width: 100%; display: flex; justify-content: center; z-index: 100; padding: 0 24px; }
        .navbar { 
          background-color: var(--bg-dark); 
          color: var(--white); 
          display: flex; justify-content: space-between; align-items: center; 
          padding: 8px 8px 8px 32px; 
          width: 100%; max-width: 1152px; 
          border-radius: 100px; 
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.4); 
        }
        .navbar-brand { font-weight: 800; font-size: 1rem; }
        .navbar-links { display: none; }
        @media(min-width: 768px) { .navbar-links { display: flex; gap: 32px; font-size: 0.875rem; font-weight: 600; } }
        .navbar-links a { color: var(--text-muted); text-decoration: none; padding-bottom: 4px; transition: color 0.2s; }
        .navbar-links a:hover { color: var(--white); }
        
        /* Dropdown Menu */
        .dropdown { position: relative; display: inline-block; }
        .dropdown-toggle { 
          color: var(--text-muted); 
          text-decoration: none; 
          padding-bottom: 4px; 
          transition: color 0.2s; 
          cursor: pointer;
          background: none;
          border: none;
          font-family: inherit;
          font-size: inherit;
        }
        .dropdown-toggle:hover { color: var(--white); }
        .dropdown-menu { 
          position: absolute; 
          top: 100%; 
          right: 0; 
          background-color: var(--bg-dark); 
          border: 1px solid var(--border-dark); 
          border-radius: 12px; 
          padding: 8px 0; 
          min-width: 150px; 
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.4);
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.2s ease;
        }
        .dropdown:hover .dropdown-menu { 
          opacity: 1; 
          visibility: visible; 
          transform: translateY(0);
        }
        .dropdown-item { 
          display: block; 
          padding: 12px 20px; 
          color: var(--text-muted); 
          text-decoration: none; 
          transition: color 0.2s, background-color 0.2s;
          font-size: 0.875rem;
          font-weight: 600;
        }
        .dropdown-item:hover { 
          color: var(--white); 
          background-color: rgba(255,255,255,0.05);
        }

        /* Hero Card Section */
        .hero-section { padding-top: clamp(100px, 12vw, 140px); }
        .hero-card {
          background: var(--white);
          border-radius: 24px;
          padding: clamp(32px, 5vw, 56px);
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(32px, 5vw, 48px);
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.05);
          align-items: center;
        }
        @media(min-width: 768px) { .hero-card { grid-template-columns: 1fr 1fr; } }
        .hero-graphic {
          background-color: var(--light-blue-bg);
          border-radius: 16px;
          aspect-ratio: 4/3;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hero-graphic svg { width: 80px; height: 80px; color: var(--bright-blue); }

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
        }

        /* FAQ Accordions */
        .faq-group { margin-bottom: 48px; }
        .faq-group-header {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-black);
          margin-bottom: 24px;
        }
        .faq-group-header svg { color: var(--bright-blue); width: 24px; height: 24px; }
        
        .accordion-item {
          background: var(--white);
          border-radius: 12px;
          padding: 24px 32px;
          margin-bottom: 16px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.02);
          cursor: pointer;
          border: 1px solid transparent;
          transition: box-shadow 0.3s, border-color 0.3s, transform 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .accordion-item:hover { box-shadow: 0 12px 28px rgba(0,0,0,0.07); transform: translateY(-3px); }
        .accordion-item.open { border-color: rgba(0,132,255,0.15); box-shadow: 0 8px 24px rgba(0,132,255,0.08); }
        .accordion-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 800;
          font-size: 1rem;
          color: var(--text-black);
        }
        .chevron {
          color: #CBD5E1;
          transition: transform 0.3s ease;
        }
        .accordion-item.open .chevron { transform: rotate(180deg); color: var(--text-muted); }
        .accordion-body {
          margin-top: 16px;
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.6;
          font-weight: 500;
          display: none;
        }
        .accordion-item.open .accordion-body { display: block; }

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

        /* Footer */
        .footer { background-color: var(--bg-dark); color: #9CA3AF; padding: 80px 0 60px; font-size: clamp(0.875rem, 1.5vw, 1rem); font-weight: 500;}
        .footer-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 48px; max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        .footer-logo { color: var(--white); font-weight: 800; font-size: clamp(1.125rem, 2.5vw, 1.25rem); margin-bottom: 16px; letter-spacing: -0.02em; }
        .footer-heading { color: var(--white); font-weight: 700; margin-bottom: 24px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .footer-links ul { list-style: none; padding: 0; margin: 0; }
        .footer-links li { margin-bottom: 16px; }
        .footer-links a { color: #9CA3AF; text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: var(--white); }

        @media (max-width: 640px) {
          .cta-buttons { flex-direction: column; width: 100%; }
          .cta-buttons button { width: 100%; justify-content: center; }
          .accordion-item { padding: 20px; }
        }
      `}} />

      <div className="faq-page" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Ambient glow orbs */}
        <div className="cc-glow-orb cc-glow-orb-blue" style={{ width: 450, height: 450, top: '-120px', right: '-100px', opacity: 0.13 }} />
        <div className="cc-glow-orb cc-glow-orb-cyan" style={{ width: 280, height: 280, bottom: '15%', left: '-60px', opacity: 0.08 }} />
        <Header currentPage="faq" />

        {/* Hero Section */}
        <section className="hero-section" style={{ position: 'relative' }}>
          <GrainOverlay opacity={0.02} />
          <div className="section-container" style={{ position: 'relative', zIndex: 1 }}>
            <div className="hero-card cc-reveal">
              <div className="hero-graphic">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path fill="#FFFFFF" d="M12 22s8-4 8-10V5l-8-3v20z" />
                </svg>
              </div>
              <div>
                <TextReveal as="h1" className="hero-title" text="How We Help You Scale" />
              </div>
              <div>
                <p className="body-text" style={{ marginBottom: '32px' }}>
                  Find answers to common questions about our engagement models, product development lifecycle, and enterprise security standards.
                </p>
                <button ref={magBtn} className="btn-bright cc-magnetic">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  View FAQ
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Content Section */}
        <section>
          <div className="section-container pt-0">

            {/* Tabs */}
            <div className="tabs-container">
              <div className={`tab-item ${activeTab === 'engagement' ? 'active' : ''}`} onClick={() => setActiveTab('engagement')}>
                <GradientText text="Engagement" />
              </div>
              <div className={`tab-item ${activeTab === 'product' ? 'active' : ''}`} onClick={() => setActiveTab('product')}>
                <GradientText text="Product" />
              </div>
              <div className={`tab-item ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
                <GradientText text="Security" />
              </div>
            </div>

            {/* Engagement Model Group */}
            <div className="faq-group cc-slide-left cc-delay-1">
              <div className="faq-group-header">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Engagement Model
              </div>

              <div className={`accordion-item ${openFaq === 'engagement-1' ? 'open' : ''}`} onClick={() => toggleFaq('engagement-1')}>
                <div className="accordion-header">
                  What is your typical engagement process?
                  <svg className="chevron" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="accordion-body">
                  Our process begins with a deep-dive discovery phase to align on goals. We then move into agile development cycles featuring bi-weekly demos, transparent roadmaps, and continuous feedback loops to ensure alignment at every step.
                </div>
              </div>

              <div className={`accordion-item ${openFaq === 'engagement-2' ? 'open' : ''}`} onClick={() => toggleFaq('engagement-2')}>
                <div className="accordion-header">
                  Who owns the intellectual property?
                  <svg className="chevron" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="accordion-body">
                  Upon completion and final payment, you retain 100% ownership of all source code, designs, and intellectual property generated during the engagement.
                </div>
              </div>
            </div>

            {/* Product Build Group */}
            <div className="faq-group cc-slide-center cc-delay-2">
              <div className="faq-group-header">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Product Build
              </div>

              <div className={`accordion-item ${openFaq === 'product-1' ? 'open' : ''}`} onClick={() => toggleFaq('product-1')}>
                <div className="accordion-header">
                  How long does it take to build an MVP?
                  <svg className="chevron" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="accordion-body">
                  A typical MVP takes between 12 to 20 weeks depending on complexity, integrations, and feature scope.
                </div>
              </div>

              <div className={`accordion-item ${openFaq === 'product-2' ? 'open' : ''}`} onClick={() => toggleFaq('product-2')}>
                <div className="accordion-header">
                  What technology stack do you use?
                  <svg className="chevron" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="accordion-body">
                  We specialize in modern, scalable stacks including React/Next.js for frontend, Node.js or Python for backend, and PostgreSQL for databases, hosted on AWS or GCP.
                </div>
              </div>
            </div>

            {/* Security & Support Group */}
            <div className="faq-group cc-slide-right cc-delay-3">
              <div className="faq-group-header">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Security & Support
              </div>

              <div className={`accordion-item ${openFaq === 'sec-1' ? 'open' : ''}`} onClick={() => toggleFaq('sec-1')}>
                <div className="accordion-header">
                  How do you handle data security?
                  <svg className="chevron" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="accordion-body">
                  We build security in from day one, adhering to SOC2 and GDPR compliance standards, utilizing end-to-end encryption, and conducting routine vulnerability assessments.
                </div>
              </div>

              <div className={`accordion-item ${openFaq === 'sec-2' ? 'open' : ''}`} onClick={() => toggleFaq('sec-2')}>
                <div className="accordion-header">
                  What post-launch support do you offer?
                  <svg className="chevron" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="accordion-body">
                  We offer SLA-backed maintenance packages, ongoing feature iteration cycles, and proactive infrastructure monitoring to ensure your product scales seamlessly.
                </div>
              </div>
            </div>

            {/* CTA Banner */}
            <BorderBeam className="cta-banner cc-reveal cc-delay-1 cc-shine" style={{ padding: 0 }}>
              <div style={{ padding: '48px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <h2 className="cta-title">Didn't find what you're looking for?</h2>
                <p className="cta-desc">Our team is ready to answer your specific questions and discuss how Crestcode can accelerate your digital product journey.</p>
                <button ref={magBtn2} className="btn-solid cc-magnetic">Contact Our Team</button>
              </div>
            </BorderBeam>

          </div>
        </section>

        <Footer />

      </div>
    </>
  );
}
