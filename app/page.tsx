'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import useScrollReveal from '@/hooks/useScrollReveal';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useContent } from '@/context/ContentContext';
import GlobalCursorGlow from '@/components/effects/GlobalCursorGlow';
import EditableText from '@/components/admin/EditableText';
import SpotlightCursor from '@/components/effects/SpotlightCursor';
import BorderBeam from '@/components/effects/BorderBeam';
import CountUp from '@/components/effects/CountUp';
import { useAdmin } from '@/context/AdminContext';
import { useInView } from 'framer-motion';
import { API_URL } from '@/services/api';

export default function LandingPage() {
  const { content, loading, error } = useContent();
  const { isAdminMode } = useAdmin();

  const [idea, setIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [submissionStep, setSubmissionStep] = useState(0); // 0: Idle, 1: Email, 2: Signup, 3: Success
  const [pendingIdea, setPendingIdea] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const heroRef = useRef(null);
  
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
        
        // If we are at the end, scroll back smoothly to 0
        if (scrollLeft >= maxScroll - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll by card width (420px card + 32px gap = 452px)
          carouselRef.current.scrollBy({ left: 452, behavior: 'smooth' });
        }
      }
    }, 3500); // Auto-scroll every 3.5 seconds

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
    const walk = (x - startX) * 1.5; // scroll speed multiplier
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

  const loadScript = (src: string, id: string) => {
    return new Promise((resolve) => {
      if (document.getElementById(id)) {
        const checkReady = () => {
          if (id === 'three-script' && (window as any).THREE) return true;
          if (id === 'vanta-script' && (window as any).VANTA) return true;
          if (id === 'vanta-waves-script' && (window as any).VANTA?.WAVES) return true;
          return false;
        };

        if (checkReady()) {
          resolve(true);
          return;
        }

        const interval = setInterval(() => {
          if (checkReady()) {
            clearInterval(interval);
            resolve(true);
          }
        }, 50);
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.id = id;
      script.async = true;
      script.onload = () => resolve(true);
      document.body.appendChild(script);
    });
  };

  useScrollReveal();

  // Vanta clouds effect
  useEffect(() => {
    let vantaEffect: any = null;
    let isUnmounted = false;

    const initVanta = async () => {
      // Check ref inside the function to ensure it's captured correctly
      if (!heroRef.current || isUnmounted) return;

      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js', 'three-script');
        await loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.clouds.min.js', 'vanta-script');

        if (!isUnmounted && heroRef.current && (window as any).VANTA && (window as any).VANTA.CLOUDS && !vantaEffect) {
          vantaEffect = (window as any).VANTA.CLOUDS({
            el: heroRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 500.00,
            minWidth: 200.00,
            backgroundColor: 0xffffff,
            skyColor: 0x68b8d7,
            cloudColor: 0xadc1d1,
            cloudShadowColor: 0x183550,
            sunColor: 0xff9919,
            sunGlareColor: 0xff6633,
            sunlightColor: 0xff9933
          });
        }
      } catch (err) {
        console.error('Vanta initialization failed:', err);
      }
    };

    // Small timeout to ensure DOM is ready and styles are applied
    const timeoutId = setTimeout(() => {
      initVanta();
    }, 50);

    return () => {
      isUnmounted = true;
      clearTimeout(timeoutId);
      if (vantaEffect && vantaEffect.destroy) {
        vantaEffect.destroy();
      }
    };
  }, [loading]);



  // Handle body scroll locking for modals
  useEffect(() => {
    if (submissionStep === 1 || submissionStep === 3) {
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

  // We still show the loader if content isn't ready, 
  // but loading.tsx will have already shown a similar state.
  if (loading && !content) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F3F5F9] font-manrope">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-600 font-medium">Loading premium experience...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F3F5F9] font-manrope px-4 text-center">
      <div className="text-red-500 text-5xl mb-4">âš ï¸</div>
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

  if (!content) return (
    <div className="flex items-center justify-center min-h-screen bg-[#F3F5F9] font-manrope">
      <p className="text-gray-500 italic">No content available. Please ensure the backend is running and seeded.</p>
    </div>
  );

  const homeContent = content.home;
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
    setPendingIdea(idea);
    setSubmissionStep(1);
    setFormMessage('');
  };

  const handleFinalSubmit = async (e: any) => {
    e.preventDefault();
    if (!userName || !userEmail || !userEmail.includes('@')) {
      setFormMessage('Please provide your name and a valid email');
      setMessageType('error');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/submit-idea`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: pendingIdea,
          email: userEmail,
          name: userName
        }),
      });
      if (response.ok) {
        setSubmissionStep(3);
        setIdea('');
      } else {
        setFormMessage('Something went wrong. Please try again.');
        setMessageType('error');
      }
    } catch (error) {
      setFormMessage('Network error. Please try again.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>

      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

        :root {
          /* Color System */
          --bg-base: #F3F5F9;
          --bg-light: #F8FAFC;
          --bg-dark: #0A0F1C;
          --bg-grey: #F1F5F9;
          --primary: #4F46E5;
          --primary-blue: #005AE2;
          --text-black: #020617;
          --text-main: #0F172A;
          --text-muted: #64748B;
          --white: #FFFFFF;
          --border-light: #E2E8F0;
          --border-dark: rgba(255, 255, 255, 0.1);
          --success-green: #10B981;
          --accent-cyan: #00E6A0;
          
          /* Specific Section Colors */
          --peach-bg: #FFF2ED;
          --peach-border: #FFEBE0;
        }

        /* Base Styles */
        body, html {
          margin: 0;
          padding: 0;
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
          background-color: var(--bg-base);
          color: var(--text-black);
          scroll-behavior: smooth;
        }

        /* Headings - Manrope */
        h1, h2, h3, h4, h5, h6, .hero-title, .section-title, .section-eyebrow, .card-title, .navbar-brand, .f-card-title, .feature-title, .t-name-light, .t-name, .fq-author, .footer-logo, .footer-heading {
          font-family: 'Manrope', sans-serif;
        }

        /* Sub-text - Manrope */
        .section-subtitle, .hero-description, .card-description, .f-card-desc, .feature-desc, .t-quote, .t-role-light, .t-role, .fq-role, .footer-tagline, .stat-label, .step-desc {
          font-family: 'Manrope', sans-serif;
        }

        /* Content - Inter */
        p, span, div, button, input, textarea, a, li, .navbar-links, .nav-dropdown-content a, .idea-textarea, .form-message {
          font-family: 'Inter', sans-serif;
        }

        * { box-sizing: border-box; }

        /* Page Load Animation */
        .landing-page { min-height: 100vh; overflow-x: hidden; animation: cc-pageSlide 0.7s cubic-bezier(0.4,0,0.2,1) both; }

        /* 3D Hero ambient glow */
        .hero-glow-wrap { position: relative; overflow: hidden; }
        .hero-glow-wrap .cc-glow-orb { pointer-events: none; }

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

        /* Enhanced card hover */
        .sys-card, .sys-card-small {
          transform-style: preserve-3d;
          transition: transform 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s ease;
        }
        .sys-card:hover {
          transform: perspective(900px) rotateX(-3deg) rotateY(3deg) translateY(-8px);
          box-shadow: 0 30px 60px -15px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,90,226,0.06);
        }
        .sys-card-small:hover {
          transform: perspective(900px) rotateX(-3deg) rotateY(3deg) translateY(-8px);
          box-shadow: 0 30px 60px -15px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,90,226,0.06);
        }

        /* Shimmer button */
        .btn-primary { position: relative; overflow: hidden; }
        .btn-primary::before {
          content: '';
          position: absolute; top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent);
          transition: left 0s;
          pointer-events: none;
        }
        .btn-primary:hover::before { left: 140%; transition: left 0.5s ease; }

        /* Section dark glow */
        .section-dark { position: relative; overflow: hidden; }

        /* Stat number pop */
        .stat-num {
          display: inline-block;
          transition: transform 0.3s ease;
        }
        .stat-item:hover .stat-num { transform: scale(1.08); }

        /* Process step hover */
        .process-step {
          transition: transform 0.3s ease;
        }
        .process-step:hover { transform: translateY(-6px); }
        .step-icon-peach {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .process-step:hover .step-icon-peach {
          transform: scale(1.15) rotate(-5deg);
          box-shadow: 0 8px 20px rgba(255,120,60,0.2);
        }
        .section-container { max-width: 1200px; margin: 0 auto; padding: 100px 24px; }
        @media(max-width: 768px) { .section-container { padding: 60px 20px; } }
        .text-center { text-align: center; }
        .text-primary { color: var(--primary-blue); }
        .text-white { color: var(--white); }
        .text-accent { color: var(--accent-cyan); }

        /* Typography */
        .hero-title { 
          font-size: clamp(2.5rem, 5vw, 4rem); 
          font-weight: 800; 
          letter-spacing: -0.03em; 
          margin-bottom: clamp(16px, 3vw, 24px); 
          line-height: 1.1; 
        }
        .section-title { 
          font-size: clamp(2rem, 4vw, 2.75rem); 
          font-weight: 800; 
          letter-spacing: -0.02em; 
          margin-bottom: clamp(16px, 3vw, 24px); 
          line-height: 1.1; 
        }
        .section-subtitle { 
          color: var(--text-muted); 
          font-size: clamp(0.95rem, 2vw, 1.125rem); 
          line-height: 1.6; 
          font-weight: 500;
          max-width: 600px; 
          margin: 0 auto clamp(32px, 5vw, 48px); 
        }
        .section-eyebrow { 
          color: var(--primary-blue); 
          font-weight: 800; 
          letter-spacing: 0.1em; 
          text-transform: uppercase; 
          font-size: clamp(0.6875rem, 1vw, 0.8125rem); 
          margin-bottom: 16px; 
        }

        /* Sections - all share a unified 100px top/bottom padding via .section-container */
        .section-light { background-color: var(--white); }
        .section-cta-sky {
          background-image: url('/images/studio/footer_no_faces.png');
          background-size: cover;
          background-position: center;
          position: relative;
          border-top: 1px solid rgba(0, 90, 226, 0.05);
          overflow: hidden;
          color: #FFFFFF !important;
        }
        .section-cta-sky::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(to bottom, rgba(10, 15, 28, 0.6) 0%, rgba(10, 15, 28, 0.8) 100%);
          z-index: 1;
        }
        .section-cta-sky .section-title, 
        .section-cta-sky .section-subtitle {
          color: #FFFFFF !important;
        }

        .section-cta-fade {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 50%;
          background: linear-gradient(to bottom, 
            transparent 0%,
            rgba(11, 16, 25, 0.6) 60%,
            #0B1019 100%
          );
          pointer-events: none;
          z-index: 2;
        }
        .section-dark { background-color: var(--bg-dark); color: var(--white); }
        .section-grey { background-color: var(--bg-base); border-top: 1px solid var(--border-light); border-bottom: 1px solid var(--border-light); }

        /* Buttons */
        .btn-primary { 
          background-color: var(--primary-blue); 
          color: var(--white); 
          padding: 16px 40px; 
          border-radius: 100px; 
          font-weight: 700; 
          font-size: 16px; 
          border: none; 
          cursor: pointer; 
          transition: background-color 0.2s, transform 0.2s; 
          box-shadow: 0 10px 20px -5px rgba(0, 90, 226, 0.3);
        }
        .btn-primary:hover { background-color: #004ac2; transform: translateY(-2px); }
        .btn-nav { padding: 10px 24px; font-size: 14px; box-shadow: none; }

        .idea-textarea::placeholder { color: #CBD5E1; }

        /* Hero Section */
        /* Hero gets extra top padding to clear the fixed navbar (~80px) on top of the standard 100px */
        .hero-section { padding: 180px 24px 100px; text-align: center; }
        @media(max-width: 768px) { .hero-section { padding: 140px 20px 60px; } }
        .hero-description { font-size: clamp(0.95rem, 2vw, 1.125rem); font-weight: 500; color: var(--text-muted); line-height: 1.6; margin-bottom: 48px; }
        .email-form { max-width: 500px; margin: 0 auto; position: relative; }
        .email-form-input { background-color: var(--white); border-radius: 24px; border: 1px solid var(--border-light); box-shadow: 0 40px 100px -20px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04); position: relative; overflow: hidden; }
        .idea-textarea { width: 100%; height: 160px; padding: 24px; border: none; outline: none; font-family: inherit; font-size: clamp(0.95rem, 2vw, 1.125rem); resize: none; color: var(--text-black); }
        .idea-textarea::placeholder { color: var(--text-muted); }
        .submit-btn { position: absolute; bottom: 16px; right: 16px; background-color: var(--primary-blue); color: var(--white); padding: 12px 24px; border-radius: 100px; font-weight: 700; font-size: 14px; border: none; cursor: pointer; transition: background-color 0.2s; }
        .submit-btn:hover { background-color: #004ac2; }
        .hero-note { font-size: clamp(0.75rem, 1.25vw, 0.8125rem); font-weight: 600; color: var(--text-muted); margin-top: 24px; }
        .form-message { margin-top: 16px; padding: 12px; border-radius: 12px; font-size: 14px; font-weight: 600; }
        .form-message.success { background-color: #ECFDF5; color: var(--success-green); }
        .form-message.error { background-color: #FEF2F2; color: #991B1B; }

        /* Hero Email Popup */
        @keyframes popupSlideIn {
          from { opacity: 0; transform: translate(-50%, -44%); }
          to   { opacity: 1; transform: translate(-50%, -50%); }
        }
        .hero-email-popup-overlay {
          position: absolute;
          inset: 0;
          background: rgba(10, 15, 28, 0.38);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 50;
          border-radius: inherit;
        }
        .hero-email-popup {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: min(440px, 90vw);
          background: #ffffff;
          border-radius: 24px;
          padding: 40px 36px 36px;
          box-shadow: 0 40px 80px -20px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.02);
          z-index: 51;
          animation: popupSlideIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
          text-align: center;
        }
        .hero-email-popup-close {
          position: absolute;
          top: 14px; right: 18px;
          background: none; border: none;
          font-size: 1.5rem; color: #94A3B8;
          cursor: pointer; line-height: 1;
          transition: color 0.2s;
        }
        .hero-email-popup-close:hover { color: #475569; }
        .hero-email-popup-icon {
          width: 60px; height: 60px;
          background: linear-gradient(135deg, #005AE2 0%, #4F46E5 100%);
          border-radius: 18px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px;
          box-shadow: 0 10px 24px -6px rgba(0,90,226,0.4);
        }
        .hero-email-popup h3 {
          font-family: 'Manrope', sans-serif;
          font-size: 1.5rem; font-weight: 800;
          color: #0A0F1C; margin: 0 0 10px;
          letter-spacing: -0.02em;
        }
        .hero-email-popup p {
          font-size: 0.95rem; color: #64748B;
          line-height: 1.6; font-weight: 500;
          margin: 0 0 24px;
        }
        .hero-email-popup-input-row {
          display: flex; gap: 8px;
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 14px;
          padding: 6px 6px 6px 16px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .hero-email-popup-input-row:focus-within {
          border-color: #005AE2;
          box-shadow: 0 0 0 4px rgba(0,90,226,0.1);
        }
        .hero-email-popup-input {
          flex: 1; border: none; background: transparent;
          outline: none; font-size: 0.95rem; font-weight: 500;
          color: #0A0F1C; font-family: 'Inter', sans-serif;
          min-width: 0;
        }
        .hero-email-popup-input::placeholder { color: #94A3B8; }
        .hero-email-popup-btn {
          background: #005AE2; color: #fff;
          border: none; border-radius: 10px;
          padding: 10px 18px; font-weight: 700;
          font-size: 0.875rem; cursor: pointer;
          white-space: nowrap; flex-shrink: 0;
          transition: background 0.2s, transform 0.15s;
          box-shadow: 0 4px 12px rgba(0,90,226,0.3);
        }
        .hero-email-popup-btn:hover { background: #004ac2; transform: translateY(-1px); }
        .hero-email-popup-success {
          display: flex; flex-direction: column; align-items: center; gap: 12px;
          padding: 8px 0;
        }
        .hero-email-popup-success-icon {
          width: 52px; height: 52px; border-radius: 50%;
          background: #ECFDF5; display: flex; align-items: center; justify-content: center;
        }
        .hero-email-popup-privacy {
          margin-top: 14px;
          font-size: 0.75rem; color: #94A3B8; font-weight: 500;
        }

        /* Grid Systems */
        .cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
        .cards-grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 48px;}
        .features-grid-4 {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 20px;
        }
        @media (min-width: 640px) {
          .features-grid-4 {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .features-grid-4 {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (min-width: 1280px) {
          .features-grid-4 {
            grid-template-columns: repeat(6, 1fr);
            gap: 16px;
          }
          .features-grid-4 .sys-card-small {
            padding: 32px 20px;
          }
        }

        /* System Cards */
        .sys-card { background-color: var(--bg-light); border: 1px solid var(--border-light); padding: 48px 40px; border-radius: 24px; display: flex; flex-direction: column; transition: all 0.3s ease; }
        .sys-card:hover { transform: perspective(900px) rotateX(-3deg) rotateY(3deg) translateY(-10px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.4); background-color: var(--bg-dark); color: var(--white); border-color: var(--border-dark); }
        .sys-card-small { background-color: var(--bg-light); border: 1px solid var(--border-light); padding: 40px 32px; border-radius: 24px; display: flex; flex-direction: column; transition: all 0.3s ease; }
        .sys-card-small:hover { transform: perspective(900px) rotateX(-3deg) rotateY(3deg) translateY(-10px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.4); background-color: var(--bg-dark); color: var(--white); border-color: var(--border-dark); }

        .card-learn-more-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: transparent;
          color: var(--primary-blue);
          border: 1.5px solid var(--primary-blue);
          border-radius: 100px;
          padding: 10px 22px;
          font-weight: 700;
          font-size: 0.875rem;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin-top: auto;
        }
        .card-learn-more-btn svg {
          transition: transform 0.3s ease;
        }
        .card-learn-more-btn:hover {
          background-color: var(--primary-blue);
          color: var(--white) !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 90, 226, 0.2);
        }
        .card-learn-more-btn:hover svg {
          transform: translateX(4px);
        }
        .sys-card:hover .card-learn-more-btn {
          color: var(--white);
          border-color: rgba(255, 255, 255, 0.25);
        }
        .sys-card:hover .card-learn-more-btn:hover {
          background-color: var(--white);
          color: var(--bg-dark) !important;
          border-color: var(--white);
          box-shadow: 0 8px 16px rgba(255, 255, 255, 0.15);
        }

        /* Dedicated Testimonial Card Aesthetic */
        .testimonial-card {
          background-color: #F5F9FF; /* Lite Blue Tint */
          border: 1px solid rgba(0, 90, 226, 0.05);
          padding: 48px 40px;
          border-radius: 32px;
          display: flex;
          flex-direction: column;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.01);
        }
        .testimonial-card::after {
          content: '\u201C';
          position: absolute;
          top: 10px;
          right: 30px;
          font-size: 80px;
          color: var(--primary-blue);
          opacity: 0.06;
          font-family: serif;
          pointer-events: none;
          line-height: 1;
        }
        .testimonial-card:hover {
          background-color: var(--white);
          transform: translateY(-12px);
          box-shadow: 0 30px 60px -12px rgba(0, 90, 226, 0.12);
          border-color: rgba(0, 90, 226, 0.15);
        }

        /* Target Audience Elements */
        .card-icon { width: 56px; height: 56px; background-color: var(--white); color: var(--primary-blue); display: flex; align-items: center; justify-content: center; border-radius: 16px; margin-bottom: 24px; transition: all 0.3s; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .sys-card:hover .card-icon { background-color: var(--primary-blue); color: var(--white); }
        .card-title { font-size: clamp(1.25rem, 3vw, 1.5rem); font-weight: 800; margin-bottom: 16px; color: var(--text-black); letter-spacing: -0.02em; transition: color 0.3s; }
        .sys-card:hover .card-title { color: var(--white); }
        .card-description { color: var(--text-muted); font-size: clamp(0.9rem, 1.5vw, 1rem); line-height: 1.6; font-weight: 500; margin-bottom: 32px; min-height: 80px; transition: color 0.3s; }
        .sys-card:hover .card-description { color: #9CA3AF; }
        .card-features { list-style: none; padding: 0; margin: 0; }
        .card-features li { display: flex; align-items: center; font-size: clamp(0.9rem, 1.5vw, 1rem); color: var(--text-main); font-weight: 700; margin-bottom: 12px; transition: color 0.3s; }
        .sys-card:hover .card-features li { color: var(--white); }
        .check-icon { color: var(--primary-blue); margin-right: 12px; font-weight: 800; font-size: 1.2rem; }
        
        /* sys-card-small inner hovers */
        .f-card-icon { transition: all 0.3s; }
        .sys-card-small:hover .f-card-icon { background-color: var(--primary-blue); color: var(--white); }
        .f-card-title { transition: color 0.3s; }
        .sys-card-small:hover .f-card-title { color: var(--white); }
        .f-card-highlight { transition: color 0.3s; }
        .sys-card-small:hover .f-card-highlight { color: var(--accent-cyan); }
        .f-card-desc { transition: color 0.3s; }
        .sys-card-small:hover .f-card-desc { color: #9CA3AF; }

        /* Dark Section Content */
        .dark-grid { display: grid; grid-template-columns: 1fr; gap: 40px; align-items: center; margin-bottom: 80px; }
        @media(min-width: 900px) { .dark-grid { grid-template-columns: 1fr 1fr; gap: 64px; } }
        .feature-list { display: flex; flex-direction: column; gap: 32px; }
        .feature-item { display: flex; gap: 20px; }
        .feature-bullet { width: 40px; height: 40px; border-radius: 100px; background-color: rgba(37,99,235,0.15); border: 2px solid var(--primary-blue); flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: var(--primary-blue); font-weight: 800; }
        .feature-title { font-size: clamp(1rem, 2vw, 1.125rem); font-weight: 800; margin-bottom: 8px; color: var(--white); }
        .feature-desc { color: #9CA3AF; font-size: clamp(0.875rem, 1.5vw, 1rem); line-height: 1.6; font-weight: 500; }
        
        .testimonial-card-dark { background-color: #0F172A; padding: 48px 40px; border-radius: 24px; border: 1px solid var(--border-dark); }
        .t-card-quote { font-size: clamp(1.125rem, 2.5vw, 1.35rem); font-weight: 600; line-height: 1.6; margin-bottom: 40px; color: var(--white); }
        .t-card-author { display: flex; align-items: center; gap: 16px; }
        .t-avatar { width: 48px; height: 48px; background-color: #334155; border-radius: 100px; }
        .t-name { font-weight: 800; font-size: 1rem; color: var(--white); }
        .t-role { color: #9CA3AF; font-size: clamp(0.6875rem, 1vw, 0.8125rem); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px; }

        /* Stats Row */
        .stats-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; padding: 0; text-align: center; }
        @media(min-width: 768px) { .stats-row { grid-template-columns: repeat(4, 1fr); } }

        /* 3D Stat Card */
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 32px 24px;
          position: relative;
          overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s ease, background 0.3s ease;
          backdrop-filter: blur(10px);
        }
        .stat-item:hover {
          transform: perspective(800px) rotateX(-6deg) translateY(-10px) scale(1.04);
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 0 30px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15);
        }
        /* Shimmer line inside card */
        .stat-item::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
          transition: left 0.6s ease;
        }
        .stat-item:hover::before { left: 140%; }
        /* Glow orb behind number */
        .stat-item::after {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 120px; height: 120px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .stat-item:hover::after { opacity: 1; }

        .stat-num {
          font-size: clamp(2.5rem, 6vw, 3.5rem);
          font-weight: 800;
          margin-bottom: 10px;
          letter-spacing: -0.03em;
          display: flex;
          align-items: baseline;
          justify-content: center;
          color: #ffffff;
        }
        .stat-label {
          color: rgba(255,255,255,0.85);
          font-size: clamp(0.6rem, 1vw, 0.75rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          transition: color 0.3s ease;
        }
        .stat-item:hover .stat-label { color: #ffffff; }

        .metrics-bg-section {
          position: relative;
          background: #0A0F1C;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          min-height: 220px;
          overflow: hidden;
          width: 100% !important;
          max-width: 100vw !important;
          margin: 0 !important;
          padding: 0 !important;
          display: block;
        }

        /* How We Make It Happen Features */
        .f-card-icon { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 12px; margin-bottom: 24px; font-weight: 800; font-size: 1.25rem; }
        .primary-bg { background-color: rgba(0, 90, 226, 0.1); color: var(--primary-blue); }
        .f-card-title { font-size: clamp(1rem, 2vw, 1.25rem); font-weight: 800; margin-bottom: 16px; line-height: 1.3; color: var(--text-black); }
        .f-card-highlight { color: var(--primary-blue); font-size: clamp(0.75rem, 1.25vw, 0.8125rem); font-weight: 700; margin-bottom: 16px; line-height: 1.4; text-transform: uppercase; letter-spacing: 0.05em; }
        .f-card-desc { color: var(--text-muted); font-size: clamp(0.875rem, 1.5vw, 1rem); line-height: 1.6; font-weight: 500; }

        /* 3D Glass Auto-Scrolling Carousel */
        .carousel-section-wrapper {
          position: relative;
          width: 100%;
          overflow: hidden;
          margin-top: 64px;
          padding: 40px 0 80px;
        }
        
        .carousel-section-wrapper::before,
        .carousel-section-wrapper::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 15%;
          z-index: 5;
          pointer-events: none;
        }
        .carousel-section-wrapper::before {
          left: 0;
          background: linear-gradient(to right, #F9FAFB, transparent);
        }
        .carousel-section-wrapper::after {
          right: 0;
          background: linear-gradient(to left, #F9FAFB, transparent);
        }
        .carousel-track {
          display: flex;
          width: max-content;
          gap: 32px;
          padding: 20px 0;
        }
        
        /* Optional: add smooth scrolling if users use trackpad */
        .carousel-section-wrapper {
          overflow-x: auto;
          scrollbar-width: none; /* Firefox */
          scroll-behavior: smooth;
          user-select: none;
        }
        .carousel-section-wrapper::-webkit-scrollbar {
          display: none; /* Chrome/Safari */
        }
        
        .carousel-nav-btn {
          position: absolute;
          top: 55%;
          transform: translateY(-50%);
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 90, 226, 0.15);
          color: #0A0F1C;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(0, 90, 226, 0.08);
        }
        .carousel-nav-btn:hover {
          background: #005AE2;
          color: white;
          box-shadow: 0 15px 35px rgba(0, 90, 226, 0.25);
          transform: translateY(-50%) scale(1.08);
          border-color: transparent;
        }
        .carousel-nav-btn.left {
          left: 40px;
        }
        .carousel-nav-btn.right {
          right: 40px;
        }
        @media (max-width: 768px) {
          .carousel-nav-btn {
            display: none;
          }
        }
        
        .carousel-card {
          width: 420px;
          height: 480px;
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 32px;
          padding: 48px 40px;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 30px rgba(0, 90, 226, 0.05), inset 0 0 0 1px rgba(255, 255, 255, 0.5);
          flex-shrink: 0;
          transform: perspective(1000px) rotateY(-5deg) translateZ(0);
          z-index: 1;
        }
        
        .carousel-card:hover {
          transform: perspective(1000px) rotateY(0deg) translateZ(20px) translateY(-10px);
          background: rgba(255, 255, 255, 0.8);
          box-shadow: 0 30px 60px rgba(0, 90, 226, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 1);
          z-index: 10;
        }
        
        .carousel-bg-number {
          position: absolute;
          bottom: -20px;
          right: -10px;
          font-size: 14rem;
          font-weight: 900;
          color: rgba(0, 90, 226, 0.04);
          line-height: 1;
          font-family: 'Inter', sans-serif;
          transition: all 0.5s ease;
          pointer-events: none;
          z-index: 0;
        }
        
        .carousel-card:hover .carousel-bg-number {
          color: rgba(0, 90, 226, 0.08);
          transform: scale(1.05) translate(-10px, -10px);
        }
        
        .carousel-icon-box {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          background: linear-gradient(135deg, var(--primary-blue), #003a9e);
          color: var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          font-weight: bold;
          margin-bottom: 40px;
          box-shadow: 0 10px 20px rgba(0, 90, 226, 0.3);
          z-index: 2;
          position: relative;
        }
        
        .carousel-content {
          position: relative;
          z-index: 2;
          flex-grow: 1;
        }
        
        .carousel-title {
          font-family: 'Manrope', sans-serif;
          font-weight: 800;
          font-size: 1.5rem;
          color: var(--text-black);
          margin-bottom: 16px;
          line-height: 1.3;
        }
        
        .carousel-desc {
          color: var(--text-muted);
          font-size: 1.05rem;
          line-height: 1.6;
          font-weight: 500;
        }
        
        @media(max-width: 768px) {
          .carousel-card {
            width: 320px;
            height: 400px;
            padding: 32px 24px;
          }
          .carousel-bg-number {
            font-size: 10rem;
          }
        }

        /* Testimonials */
        /* Testimonials Aesthetic Refinement */
        .t-quote {
          font-style: normal;
          color: var(--text-black);
          font-size: 1.1rem;
          line-height: 1.7;
          font-weight: 500;
          margin-bottom: 40px;
          flex-grow: 1;
          transition: color 0.3s ease;
        }
        
        .t-box-author {
          display: flex;
          align-items: center;
          gap: 16px;
          padding-top: 24px;
          border-top: 1px solid rgba(0, 90, 226, 0.05);
        }
        .t-avatar-light {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, rgba(0, 90, 226, 0.1), rgba(0, 90, 226, 0.05));
          border-radius: 50%;
          border: 1px solid rgba(0, 90, 226, 0.1);
        }
        
        .t-name-light { font-weight: 800; font-size: 1rem; color: var(--text-black); transition: color 0.3s; }
        .t-role-light { color: var(--text-muted); font-size: 0.75rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin-top: 4px; transition: color 0.3s; }
        
        /* Remove the dark theme hover for testimonials to keep it minimalist and light */
        .testimonial-card:hover .t-quote, 
        .testimonial-card:hover .t-name-light,
        .testimonial-card:hover .t-role-light { color: inherit; }

        /* Founder Quote Box Aesthetic Refinement */
        .founder-quote-card {
          background-color: #F5F9FF; /* Lite Blue Tint */
          border-radius: 40px;
          padding: clamp(40px, 6vw, 80px);
          display: flex;
          align-items: center;
          gap: clamp(32px, 5vw, 64px);
          border: 1px solid rgba(0, 90, 226, 0.05);
          max-width: 1000px;
          margin: 80px auto 0;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.02);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .founder-quote-card::after {
          content: '\u201C';
          position: absolute;
          top: -20px;
          right: 40px;
          font-size: 160px;
          color: var(--primary-blue);
          opacity: 0.04;
          font-family: serif;
          pointer-events: none;
          line-height: 1;
        }
        .founder-quote-card:hover {
          background-color: var(--white); /* Turns white on hover for contrast */
          transform: translateY(-8px);
          box-shadow: 0 40px 80px -15px rgba(0, 90, 226, 0.1);
          border-color: rgba(0, 90, 226, 0.15);
        }
        
        .founder-img {
          width: clamp(120px, 18vw, 180px);
          height: clamp(120px, 18vw, 180px);
          border-radius: 50%;
          border: 6px solid var(--white);
          box-shadow: 0 15px 35px rgba(0, 90, 226, 0.1);
          overflow: hidden;
          flex-shrink: 0;
          transition: transform 0.5s ease;
          position: relative;
          z-index: 1;
        }
        .founder-quote-card:hover .founder-img {
          transform: scale(1.05) rotate(2deg);
        }
        
        .fq-marks {
          color: var(--primary-blue);
          font-size: 40px;
          font-weight: 800;
          line-height: 1;
          margin-bottom: 20px;
          opacity: 0.8;
          letter-spacing: -2px;
        }
        
        .fq-text {
          font-size: clamp(1.1rem, 2.5vw, 1.4rem);
          font-weight: 700;
          color: var(--text-black);
          line-height: 1.5;
          margin-bottom: 32px;
          letter-spacing: -0.02em;
          position: relative;
          z-index: 1;
        }
        
        .fq-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          padding-top: 24px;
          border-top: 1px solid rgba(0, 90, 226, 0.05);
        }
        .fq-author { font-weight: 800; font-size: 1.1rem; color: var(--text-black); }
        .fq-role { color: var(--text-muted); font-size: 0.875rem; font-weight: 500; }

        /* Multi-step Submission Styles */
        .step-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(10, 15, 28, 0.4);
          backdrop-filter: blur(12px);
          z-index: 1000; display: flex; align-items: center; justify-content: center;
          animation: cc-fadeIn 0.3s ease;
        }
        .step-modal {
          background: white; border-radius: 32px; width: min(480px, 95vw);
          padding: 32px 24px; text-align: center; position: relative;
          box-shadow: 0 40px 100px -20px rgba(0,0,0,0.25);
          animation: cc-popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .step-modal-close {
          position: absolute; top: 24px; right: 24px; background: none; border: none;
          font-size: 24px; color: #94A3B8; cursor: pointer;
        }
        .step-modal-icon-wrap {
          width: 64px; height: 64px; background: #F1F5F9; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px; color: #005AE2;
        }
        .step-modal h3 { font-size: 1.75rem; font-weight: 800; color: #0A0F1C; margin-bottom: 12px; }
        .step-modal p { color: #64748B; font-size: 1rem; line-height: 1.6; margin-bottom: 32px; font-weight: 500; }
        .step-input-wrap {
          background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 16px;
          padding: 16px 20px; margin-bottom: 24px; transition: border-color 0.2s;
        }
        .step-input-wrap:focus-within { border-color: #005AE2; }
        .step-input { border: none; background: transparent; width: 100%; outline: none; font-size: 1rem; color: #0A0F1C; }
        .btn-step-primary {
          width: 100%; background: #005AE2; color: white; padding: 18px;
          border-radius: 16px; font-weight: 700; border: none; cursor: pointer;
          font-size: 1rem; display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: transform 0.2s, background 0.2s;
        }
        .btn-step-primary:hover { background: #004ac2; transform: translateY(-2px); }
        .step-modal-footer { margin-top: 32px; font-size: 0.75rem; color: #94A3B8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }

        /* Signup Overlay Styles */
        .signup-overlay {
          position: fixed; inset: 0; background: white; z-index: 2000;
          display: flex; animation: cc-pageSlide 0.5s ease;
        }
        .signup-left {
          width: 38%; background: #0A0F1C; color: white; padding: 60px 64px;
          display: flex; flex-direction: column; justify-content: flex-start;
          gap: 20px;
        }
        /* @media (max-width: 900px) { .signup-left { display: none; } } */
        /* Maintain desktop signup view */
        .signup-left { display: flex; }
        .signup-right {
          flex: 1; padding: 40px 64px; display: flex; flex-direction: column;
          align-items: center; justify-content: flex-start; overflow-y: auto;
        }
        .signup-form-box { 
          width: 100%; max-width: 440px; 
          display: flex; flex-direction: column;
        }
        .signup-badge {
          background: #E0E7FF; color: #4338CA; padding: 6px 12px;
          border-radius: 100px; font-size: 0.75rem; font-weight: 700;
          display: inline-block; margin-bottom: 24px;
        }
        .signup-title { font-size: 2.25rem; font-weight: 800; color: #0A0F1C; margin-bottom: 8px; }
        .signup-subtitle { color: #64748B; margin-bottom: 24px; font-weight: 500; }
        .signup-field { margin-bottom: 20px; }
        .signup-label { display: block; font-size: 0.875rem; font-weight: 700; color: #0F172A; margin-bottom: 8px; }
        .signup-input {
          width: 100%; padding: 14px 16px; background: white;
          border: 1.5px solid #E2E8F0; border-radius: 12px; font-size: 1rem;
          transition: border-color 0.2s;
        }
        .signup-input:focus { border-color: #005AE2; outline: none; }
        .signup-divider {
          display: flex; align-items: center; margin: 32px 0; color: #94A3B8; font-size: 0.8rem; font-weight: 700;
        }
        .signup-divider::before, .signup-divider::after { content: ''; flex: 1; height: 1px; background: #E2E8F0; margin: 0 16px; }
        .btn-google {
          width: 100%; background: white; border: 1.5px solid #E2E8F0; padding: 14px;
          border-radius: 12px; font-weight: 600; display: flex; align-items: center;
          justify-content: center; gap: 12px; cursor: pointer; transition: background 0.2s;
        }
        .btn-google:hover { background: #F8FAFC; }
        .signup-footer { margin-top: 32px; text-align: center; color: #64748B; font-weight: 500; font-size: 0.9rem; }
        .signup-footer a { color: #005AE2; font-weight: 700; text-decoration: none; }

        @keyframes cc-popIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes cc-fadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* Hero Aura Animation */
        @keyframes float-aura {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, 50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
          100% { transform: translate(0, 0) scale(1); }
        }
        .hero-aura {
          position: absolute;
          width: 800px;
          height: 800px;
          border-radius: 100%;
          filter: blur(100px);
          opacity: 0.12;
          z-index: 0;
          pointer-events: none;
          animation: float-aura 15s infinite alternate ease-in-out;
        }
        .aura-1 { background: radial-gradient(circle, #4F46E5, transparent 70%); top: -300px; left: -200px; }
        .aura-2 { background: radial-gradient(circle, #005AE2, transparent 70%); bottom: -200px; right: -200px; animation-delay: -7s; }

        @keyframes border-beam {
          from { offset-distance: 0%; }
          to { offset-distance: 100%; }
        }

        .hero-idea-box {
          position: relative;
          background: #FFFFFF;
          border-radius: 24px;
          padding: 1px; /* Subtle border container */
          box-shadow: 
            0 20px 50px -12px rgba(0, 90, 226, 0.15),
            0 0 0 1px rgba(0, 90, 226, 0.15);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
          max-width: 480px;
          border: none;
          overflow: hidden;
        }

        .hero-idea-box:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 
            0 30px 70px -10px rgba(0, 90, 226, 0.25),
            0 0 25px rgba(0, 90, 226, 0.2);
        }

        .hero-idea-inner {
          position: relative;
          background: white;
          border-radius: 23px;
          width: 100%;
          height: 100%;
          padding: 8px;
          box-shadow: inset 0 0 0 1px rgba(0, 90, 226, 0.08);
          z-index: 1; /* Stay above the beam */
        }

        /* Seamless Footer Merge Override */
        .cc-footer-wrapper .footer {
          border-top: none !important;
        }
      `}} />

      <Header />

      <div className="landing-page" style={{ overflow: 'hidden', position: 'relative' }}>
        {/* Ambient aura animation */}
        <div className="hero-aura aura-1"></div>
        <div className="hero-aura aura-2"></div>

        {/* Step 1: Idea Submission Hero */}
        <header ref={heroRef} className="hero-section" style={{ position: 'relative', paddingTop: '140px', paddingBottom: '80px', backgroundColor: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <EditableText
              as="h1"
              contentKey="home.hero.heading"
              value={homeContent.hero.heading}
              style={{ fontSize: '2.75rem', fontWeight: 800, textAlign: 'center', color: '#0A0F1C', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '24px' }}
            >
              {(() => {
                const words = (homeContent.hero.heading || '').split(' ');
                const line1 = words.slice(0, 4);
                const line2 = words.slice(4);
                
                const renderWord = (word: string, index: number) => {
                  const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
                  const isBlue = ['BOLD', 'IDEAS', 'REAL'].includes(cleanWord);
                  return (
                    <span key={index} style={isBlue ? { color: '#005AE2' } : {}}>
                      {word}{' '}
                    </span>
                  );
                };

                return (
                  <>
                    <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                      {line1.map((w, idx) => renderWord(w, idx))}
                    </span>
                    <br />
                    <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                      {line2.map((w, idx) => renderWord(w, idx + 4))}
                    </span>
                  </>
                );
              })()}
            </EditableText>
            <EditableText
              as="p"
              contentKey="home.hero.subheading"
              value={homeContent.hero.subheading}
              style={{ textAlign: 'center', color: '#475569', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 48px', lineHeight: 1.6, fontWeight: 500, textWrap: 'balance' }}
            />
          </div>

          <form onSubmit={handleIdeaSubmit} method="POST" style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 10 }}>
            <div className="hero-idea-box" style={{ maxWidth: '400px' }}>
              <div className="hero-idea-inner">
                <textarea
                  id="idea"
                  name="idea"
                  className="idea-textarea"
                  style={{
                    width: '100%',
                    height: '70px',
                    border: 'none',
                    resize: 'none',
                    padding: '12px 14px',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    color: '#0A0F1C',
                    backgroundColor: 'transparent',
                    outline: 'none',
                    borderRadius: '14px'
                  }}
                  placeholder={homeContent.hero.placeholder}
                  value={idea}
                  onChange={(e: any) => setIdea(e.target.value)}
                  disabled={isLoading}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 8px 8px 0' }}>
                  <button type="submit" disabled={isLoading} style={{
                    backgroundColor: '#005AE2',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '100px',
                    padding: '10px 20px',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(0, 90, 226, 0.2)'
                  }}
                    onMouseOver={(e: any) => {
                      e.currentTarget.style.backgroundColor = '#004ac2';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseOut={(e: any) => {
                      e.currentTarget.style.backgroundColor = '#005AE2';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <EditableText contentKey="home.hero.submitBtn" value={homeContent.hero.submitBtn} />
                  </button>
                </div>
              </div>
            </div>
            {formMessage && submissionStep < 1 && (
              <div className={`form-message ${messageType}`} style={{
                marginTop: '12px',
                fontSize: '0.875rem',
                fontWeight: 600,
                animation: 'cc-fadeIn 0.3s ease'
              }}>
                {formMessage}
              </div>
            )}
            <p className="hero-note">{homeContent.hero.footerNote}</p>
          </form>
        </header>

        {/* Step 2 inline implemented above */}




        {/* Target Audiences Section */}
        <section className="section-light">
          <div className="section-container">
            <EditableText
              as="h3"
              contentKey="home.audiences.eyebrow"
              value={homeContent.audiences.eyebrow}
              className="section-eyebrow text-center cc-reveal"
            />
            <EditableText
              as="h2"
              contentKey="home.audiences.title"
              value={homeContent.audiences.title}
              className="section-title text-center cc-reveal cc-delay-1"
            />
            <EditableText
              as="p"
              contentKey="home.audiences.subtitle"
              value={homeContent.audiences.subtitle}
              className="section-subtitle text-center cc-reveal cc-delay-2"
            />

            <div className="cards-grid">
              {homeContent.audiences.items.map((item, idx) => (
                <div key={idx} className="sys-card cc-shine">
                  <div className="card-icon">
                    {item.icon === 'user' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>}
                    {item.icon === 'building' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>}
                    {item.icon === 'idea' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M12 2a7 7 0 0 1 7 7c0 2-1 3.9-2 5.5-.5.8-1.5 1.5-1.5 2.5v1H8.5v-1c0-1-1-1.7-1.5-2.5C6 12.9 5 11 5 9a7 7 0 0 1 7-7z"></path></svg>}
                  </div>
                  <EditableText
                    as="h4"
                    contentKey={`home.audiences.items.${idx}.title`}
                    value={item.title}
                    className="card-title"
                  />
                  <EditableText
                    as="p"
                    contentKey={`home.audiences.items.${idx}.description`}
                    value={item.description}
                    className="card-description"
                  />
                  <ul className="card-features">
                    {item.features.map((feature, fIdx) => (
                      <li key={fIdx}>
                        <span className="check-icon">&#x2713;</span>
                        <EditableText
                          contentKey={`home.audiences.items.${idx}.features.${fIdx}`}
                          value={feature}
                        />
                      </li>
                    ))}
                  </ul>
                  <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
                    <Link href="/studio" className="card-learn-more-btn">
                      Learn More
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How We Make It Happen */}
        <section className="section-light">
          <div className="section-container" style={{ maxWidth: '1440px' }}>
            <EditableText
              as="h2"
              contentKey="home.methodology.title"
              value={homeContent.methodology.title}
              className="section-title"
            />
            <EditableText
              as="p"
              contentKey="home.methodology.subtitle"
              value={homeContent.methodology.subtitle}
              className="section-subtitle"
              style={{ margin: '0 0 clamp(32px, 5vw, 48px) 0', maxWidth: '800px', textAlign: 'left' }}
            />
            <div className="features-grid-4">
              {methodologyCards.map((card, idx) => (
                <div key={idx} className={`sys-card-small ${idx % 2 === 0 ? 'cc-shine' : ''}`}>
                  <div className="f-card-icon primary-bg" style={{ fontSize: '1rem', fontWeight: 800 }}>
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <EditableText
                    as="h4"
                    contentKey={`home.methodology.cards.${idx}.title`}
                    value={card.title}
                    className="f-card-title"
                    style={{ whiteSpace: 'pre-line' }}
                  />
                  <EditableText
                    as="p"
                    contentKey={`home.methodology.cards.${idx}.highlight`}
                    value={card.highlight}
                    className="f-card-highlight"
                  />
                  <EditableText
                    as="p"
                    contentKey={`home.methodology.cards.${idx}.description`}
                    value={card.description}
                    className="f-card-desc"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>



        {/* Metrics Section */}
        <section className="metrics-bg-section" style={{ minHeight: '180px' }}>
          <div className="section-container" style={{ paddingTop: '64px', paddingBottom: '64px', position: 'relative', zIndex: 2 }}>
            <div className="text-center" style={{ marginBottom: '48px' }}>
              <EditableText as="p" contentKey="home.metrics_section.eyebrow" value="CRESTCODE BY THE NUMBERS" className="section-eyebrow" style={{ color: '#94A3B8' }} />
              <EditableText as="h2" contentKey="home.metrics_section.title" value="Our Track Record of Delivering High-Growth Results" className="section-title text-white" style={{ marginBottom: '0px' }} />
            </div>
            <MetricsRow metrics={homeContent.metrics} />
          </div>
        </section>


        {/* Testimonials Section */}
        <section className="section-light">
          <div className="section-container">
            <EditableText
              as="h2"
              contentKey="home.testimonials.title"
              value={homeContent.testimonials.title}
              className="section-title text-center cc-reveal"
              style={{ marginBottom: 'clamp(40px, 6vw, 80px)' }}
            />

            <div className="cards-grid-2">
              {homeContent.testimonials.items.map((item, idx) => (
                <div key={idx} className="testimonial-card cc-shine">
                  <EditableText
                    as="p"
                    contentKey={`home.testimonials.items.${idx}.quote`}
                    value={item.quote}
                    className="t-quote"
                  />
                  <div className="t-box-author">
                    <div className="t-avatar-light"></div>
                    <div>
                      <EditableText
                        contentKey={`home.testimonials.items.${idx}.author`}
                        value={item.author}
                        className="t-name-light"
                      />
                      <EditableText
                        contentKey={`home.testimonials.items.${idx}.role`}
                        value={item.role}
                        className="t-role-light"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="founder-quote-card">
              <div className="founder-img">
                <img src="/images/founder-asfarul.jpg" alt={homeContent.testimonials.founder.author} className="founder-photo" />
              </div>
              <div className="fq-content">
                <div className="fq-marks">""</div>
                <EditableText
                  as="p"
                  contentKey="home.testimonials.founder.quote"
                  value={homeContent.testimonials.founder.quote}
                  className="fq-text"
                />
                <div className="fq-meta">
                  <EditableText
                    contentKey="home.testimonials.founder.author"
                    value={homeContent.testimonials.founder.author}
                    className="fq-author"
                  />
                  <EditableText
                    contentKey="home.testimonials.founder.role"
                    value={homeContent.testimonials.founder.role}
                    className="fq-role"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-cta-sky text-center">
          <div className="section-container" style={{ position: 'relative', zIndex: 3 }}>
            <EditableText
              as="h2"
              contentKey="home.cta.title"
              value={homeContent.cta.title}
              className="section-title cc-reveal"
              style={{ whiteSpace: 'pre-line', marginTop: 0, marginBottom: '12px' }}
            />
            <EditableText
              as="p"
              contentKey="home.cta.subtitle"
              value={homeContent.cta.subtitle}
              className="section-subtitle text-center"
              style={{ margin: '0 auto 24px' }}
            />
            <Link href="/studio">
              <button className="btn-primary" style={{ marginTop: '16px' }}>
                <EditableText contentKey="home.cta.buttonText" value={homeContent.cta.buttonText} />
              </button>
            </Link>
          </div>

          {/* Merge Fade to Footer */}
          <div className="section-cta-fade"></div>
        </section>

        <Footer />
      </div>

      {/* Step 1: Email/Name Modal */}
      {submissionStep === 1 && (
        <div className="step-modal-overlay">
          <div className="step-modal">
            <button className="step-modal-close" onClick={() => setSubmissionStep(0)}>&times;</button>
            <div className="step-modal-icon-wrap" style={{ background: '#F0F5FF', color: '#005AE2', marginBottom: '16px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
            <EditableText
              as="h3"
              contentKey="home.hero.emailStep.title"
              value={homeContent.hero.emailStep.title}
            />
            <EditableText
              as="p"
              contentKey="home.hero.emailStep.subtitle"
              value={homeContent.hero.emailStep.subtitle}
              style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '24px' }}
            />
            <form onSubmit={handleFinalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="step-input-wrap" style={{ marginBottom: 0, padding: '12px 16px' }}>
                <input
                  type="text"
                  className="step-input"
                  placeholder={homeContent.hero.emailStep.namePlaceholder || "Your Name"}
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>
              <div className="step-input-wrap" style={{ marginBottom: 0, padding: '12px 16px' }}>
                <input
                  type="email"
                  className="step-input"
                  placeholder={homeContent.hero.emailStep.placeholder || "businessname@email.com"}
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                />
              </div>
              {formMessage && <div className="form-message error">{formMessage}</div>}
              <button type="submit" disabled={isLoading} className="btn-step-primary" style={{ marginTop: '8px', padding: '14px' }}>
                {isLoading ? '...' : <EditableText contentKey="home.hero.emailStep.buttonText" value={homeContent.hero.emailStep.buttonText || "Register \u2192"} />}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Step 4: Success / Next Steps */}
      {submissionStep === 3 && (
        <div className="step-modal-overlay">
          <div className="step-modal">
            <div className="step-modal-icon-wrap" style={{ background: '#ECFDF5', color: '#10B981' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h3><EditableText contentKey="home.hero.successModal.title" value={homeContent.hero.successModal.title} /></h3>
            <p><EditableText contentKey="home.hero.successModal.description" value={homeContent.hero.successModal.description} /></p>
            <Link href="/progress">
              <button className="btn-step-primary">
                <EditableText contentKey="home.hero.successModal.buttonText" value={homeContent.hero.successModal.buttonText} />
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
function MetricsRow({ metrics }: { metrics: any[] }) {
  const rowRef = useRef(null);
  const isRowInView = useInView(rowRef, { once: false, margin: "-100px" });
  const { isAdminMode } = useAdmin();

  // To ensure they all stop at the same time, we use the same duration
  const countDuration = 2.5;

  return (
    <div className="stats-row" style={{ borderTop: 'none', padding: 0 }} ref={rowRef}>
      {metrics.map((metric, idx) => (
        <div key={idx} className="stat-item">
          <div className="stat-num" style={{ color: '#ffffff', display: 'flex', gap: '2px', alignItems: 'baseline' }}>
            <EditableText contentKey={`home.metrics.${idx}.prefix`} value={metric.prefix || ''} variant="ghost" />
            <div className="stat-num">
              {isAdminMode ? (
                <EditableText contentKey={`home.metrics.${idx}.value`} value={(metric.value || 0).toString()} variant="ghost" />
              ) : (
                <CountUp
                  key={`stat-${idx}`}
                  end={Number(metric.value) || 0}
                  duration={countDuration}
                  start={isRowInView}
                />
              )}
            </div>
            <EditableText contentKey={`home.metrics.${idx}.suffix`} value={metric.suffix || ''} variant="ghost" />
          </div>
          <EditableText
            contentKey={`home.metrics.${idx}.label`}
            value={metric.label || ''}
            className="stat-label"
            style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 800 }}
          />
        </div>
      ))}
    </div>
  );
}