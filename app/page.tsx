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

export default function LandingPage() {
  const { content, loading, error } = useContent();

  const [idea, setIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [submissionStep, setSubmissionStep] = useState(0); // 0: Idle, 1: Email, 2: Signup, 3: Success
  const [pendingIdea, setPendingIdea] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const heroRef = useRef(null);

  useScrollReveal();

  // Vanta clouds effect
  useEffect(() => {
    let vantaEffect: any = null;
    let isUnmounted = false;
    
    const loadScript = (src: string, id: string) => {
      return new Promise((resolve) => {
        if (document.getElementById(id)) {
          const checkReady = () => {
            if (id === 'three-script' && (window as any).THREE) return true;
            if (id === 'vanta-script' && (window as any).VANTA) return true;
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

  if (!content) return (
    <div className="flex items-center justify-center min-h-screen bg-[#F3F5F9] font-manrope">
      <p className="text-gray-500 italic">No content available. Please ensure the backend is running and seeded.</p>
    </div>
  );

  const homeContent = content.home;

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

  const handleProceedToSignup = () => {
    if (!userEmail || !userEmail.includes('@')) {
      setFormMessage('Please enter a valid email');
      setMessageType('error');
      return;
    }
    setSubmissionStep(2);
    setFormMessage('');
  };

  const handleCreateAccount = async () => {
    if (!businessName || !password || password !== confirmPassword) {
      setFormMessage('Please fill all fields correctly');
      setMessageType('error');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/submit-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          idea: pendingIdea, 
          email: userEmail,
          businessName,
          password
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
        .section-container { max-width: 1200px; margin: 0 auto; padding: clamp(40px, 6vw, 80px) 24px; }
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

        /* Sections */
        .section-light { background-color: var(--white); }
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

        /* Navbar */
        .cc-navbar-scrolled { background: rgba(10, 15, 28, 0.8); backdrop-filter: blur(10px); padding: 4px 24px; transition: all 0.3s ease; }
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
        .active-link { color: var(--white) !important; border-bottom: 2px solid var(--primary-blue); }
        .idea-textarea::placeholder { color: #CBD5E1; }
        
        .nav-dropdown { position: relative; display: inline-block; padding-bottom: 4px; cursor: pointer; }
        .nav-dropdown > a { color: var(--text-muted); text-decoration: none; transition: color 0.2s; }
        .nav-dropdown:hover > a { color: var(--white); }
        .nav-dropdown-content {
          display: none;
          position: absolute;
          background-color: #151E32;
          min-width: 160px;
          box-shadow: 0px 8px 24px 0px rgba(0,0,0,0.3);
          z-index: 1000;
          border-radius: 12px;
          padding: 8px 0;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-top: 16px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .nav-dropdown::after { content: ''; position: absolute; left: 0; right: 0; bottom: -16px; height: 16px; }
        .nav-dropdown:hover .nav-dropdown-content { display: flex; flex-direction: column; }
        .nav-dropdown-content a {
          color: #9CA3AF;
          padding: 10px 24px;
          text-decoration: none;
          display: block;
          font-weight: 500;
          font-size: 0.85rem;
          transition: background-color 0.2s, color 0.2s;
        }
        .nav-dropdown-content a:hover {
          color: var(--white);
          background-color: rgba(255,255,255,0.05);
        }
        .dropdown-item {
          color: #9CA3AF !important;
          padding: 10px 24px !important;
          text-decoration: none !important;
          display: block;
          font-weight: 500;
          font-size: 0.85rem;
          transition: background-color 0.2s, color 0.2s;
          border-bottom: none !important;
        }
        .dropdown-item:hover {
          color: var(--white) !important;
          background-color: rgba(255,255,255,0.05);
        }

        /* Hero Section */
        .hero-section { padding: clamp(160px, 15vw, 200px) 24px clamp(60px, 8vw, 100px); text-align: center; }
        .hero-description { font-size: clamp(0.95rem, 2vw, 1.125rem); font-weight: 500; color: var(--text-muted); line-height: 1.6; margin-bottom: 48px; }
        .email-form { max-width: 500px; margin: 0 auto; position: relative; }
        .email-form-input { background-color: var(--white); border-radius: 24px; border: 1px solid var(--border-light); box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05); position: relative; overflow: hidden; }
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
          box-shadow: 0 40px 80px -20px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.04);
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
        .cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
        .cards-grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 24px; margin-bottom: 48px;}
        .features-grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; }

        /* System Cards */
        .sys-card { background-color: var(--bg-light); border: 1px solid var(--border-light); padding: 48px 40px; border-radius: 24px; transition: all 0.3s ease; }
        .sys-card:hover { transform: perspective(900px) rotateX(-3deg) rotateY(3deg) translateY(-10px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.4); background-color: var(--bg-dark); color: var(--white); border-color: var(--border-dark); }
        .sys-card-small { background-color: var(--bg-light); border: 1px solid var(--border-light); padding: 40px 32px; border-radius: 24px; display: flex; flex-direction: column; transition: all 0.3s ease; }
        .sys-card-small:hover { transform: perspective(900px) rotateX(-3deg) rotateY(3deg) translateY(-10px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.4); background-color: var(--bg-dark); color: var(--white); border-color: var(--border-dark); }

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
        .stats-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px; border-top: 1px solid var(--border-dark); padding-top: 80px; text-align: center; }
        @media(min-width: 768px) { .stats-row { grid-template-columns: repeat(4, 1fr); } }
        .stat-num { font-size: clamp(2.5rem, 6vw, 3.5rem); font-weight: 800; margin-bottom: 8px; letter-spacing: -0.03em; }
        .stat-label { color: #9CA3AF; font-size: clamp(0.6875rem, 1vw, 0.8125rem); font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }

        /* How We Make It Happen Features */
        .f-card-icon { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 12px; margin-bottom: 24px; font-weight: 800; font-size: 1.25rem; }
        .primary-bg { background-color: rgba(0, 90, 226, 0.1); color: var(--primary-blue); }
        .f-card-title { font-size: clamp(1rem, 2vw, 1.25rem); font-weight: 800; margin-bottom: 16px; line-height: 1.3; color: var(--text-black); }
        .f-card-highlight { color: var(--primary-blue); font-size: clamp(0.75rem, 1.25vw, 0.8125rem); font-weight: 700; margin-bottom: 16px; line-height: 1.4; text-transform: uppercase; letter-spacing: 0.05em; }
        .f-card-desc { color: var(--text-muted); font-size: clamp(0.875rem, 1.5vw, 1rem); line-height: 1.6; font-weight: 500; }

        /* 6-Step Process - Original Design Exact Match */
        .process-wrapper { position: relative; margin-top: 64px; }
        .process-line { position: absolute; top: 24px; left: 8%; right: 8%; height: 1px; border-top: 1px dashed #F3D5C5; z-index: 0; }
        .process-grid { display: grid; grid-template-columns: repeat(1, 1fr); gap: 24px; position: relative; z-index: 1; text-align: center; }
        @media(min-width: 768px) { .process-grid { grid-template-columns: repeat(6, 1fr); } }
        .process-step { display: flex; flex-direction: column; align-items: center; }
        .step-icon-peach { width: 48px; height: 48px; background-color: var(--peach-bg); border: 1px solid var(--peach-border); color: var(--primary-blue); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
        .step-title { font-weight: 800; font-size: clamp(0.8125rem, 1.5vw, 0.875rem); margin-bottom: 8px; color: var(--text-black); line-height: 1.2;}
        .step-desc { color: var(--text-muted); font-size: clamp(0.75rem, 1.25vw, 0.8125rem); line-height: 1.6; font-weight: 500; }

        /* Testimonials */
        .t-quote { font-style: italic; color: var(--text-muted); font-size: clamp(0.95rem, 2vw, 1.125rem); line-height: 1.6; font-weight: 500; margin-bottom: 40px; flex-grow: 1; transition: color 0.3s; }
        .sys-card-small:hover .t-quote { color: #9CA3AF; }
        
        .t-box-author { display: flex; align-items: center; gap: 16px; }
        .t-avatar-light { width: 40px; height: 40px; background-color: var(--border-light); border-radius: 100px; }
        
        .t-name-light { font-weight: 800; font-size: clamp(0.875rem, 1.5vw, 1rem); color: var(--text-black); transition: color 0.3s; }
        .sys-card-small:hover .t-name-light { color: var(--white); }
        
        .t-role-light { color: var(--text-muted); font-size: clamp(0.6875rem, 1vw, 0.8125rem); font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin-top: 4px; transition: color 0.3s; }
        .sys-card-small:hover .t-role-light { color: #9CA3AF; }

        /* Founder Quote Box */
        .founder-quote-card { background-color: #F8FAFC; border-radius: 24px; padding: clamp(40px, 6vw, 64px); display: flex; align-items: center; gap: clamp(32px, 5vw, 64px); border: 1px solid #E2E8F0; max-width: 1000px; margin: 64px auto 0; }
        .founder-img { width: clamp(100px, 15vw, 140px); height: clamp(100px, 15vw, 140px); border-radius: 100px; border: 4px solid var(--white); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); overflow: hidden; flex-shrink: 0; }
        .founder-photo { width: 100%; height: 100%; object-fit: cover; }
        .fq-content { flex-grow: 1; text-align: left; }
        .fq-marks { color: #005AE2; font-size: 48px; font-weight: 800; line-height: 1; margin-bottom: 12px; font-family: 'Manrope', sans-serif; }
        .fq-text { font-size: clamp(1.1rem, 2.5vw, 1.35rem); font-weight: 700; color: #0A0F1C; line-height: 1.5; margin-bottom: 24px; letter-spacing: -0.01em; }
        .fq-meta { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
        .fq-author { font-weight: 800; font-size: 1rem; color: #0A0F1C; }
        .fq-role { color: #94A3B8; font-size: 0.875rem; font-weight: 500; }

        /* Footer */
        .footer { background-color: var(--bg-dark); color: #9CA3AF; padding: 80px 0; font-size: clamp(0.875rem, 1.5vw, 1rem); font-weight: 500;}
        .footer-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 64px; }
        .footer-logo { color: var(--white); font-weight: 800; font-size: clamp(1.125rem, 2.5vw, 1.25rem); margin-bottom: 16px; letter-spacing: -0.02em; }
        .footer-tagline { line-height: 1.6; max-width: 250px; }
        .footer-heading { color: var(--white); font-weight: 700; margin-bottom: 24px; font-size: 1rem; }
        .footer-links-group ul { list-style: none; padding: 0; margin: 0; }
        .footer-links-group li { margin-bottom: 16px; }
        .footer-links-group a { color: #9CA3AF; text-decoration: none; transition: color 0.2s; }
        .footer-links-group a:hover { color: var(--white); }
        .social-icons { display: flex; gap: 16px; }
        .social-icon { width: 40px; height: 40px; border-radius: 100px; background-color: #1E293B; display: flex; align-items: center; justify-content: center; color: var(--white); cursor: pointer; transition: background-color 0.2s; font-weight: 700; }
        .social-icon:hover { background-color: var(--primary-blue); }

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
          padding: 48px 40px; text-align: center; position: relative;
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
        @media (max-width: 900px) { .signup-left { display: none; } }
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
      `}} />

      <div className="landing-page" style={{ overflow: 'hidden', position: 'relative' }}>
        <Header />
        
        {/* Ambient aura animation */}
        <div className="hero-aura aura-1"></div>
        <div className="hero-aura aura-2"></div>
        
        {/* Step 1: Idea Submission Hero */}
        <header ref={heroRef} className="hero-section" style={{ position: 'relative', paddingTop: '160px', paddingBottom: '80px', backgroundColor: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <EditableText 
            as="h1"
            contentKey="home.hero.heading"
            value={homeContent.hero.heading}
            style={{ fontSize: '3.5rem', fontWeight: 800, textAlign: 'center', color: '#0A0F1C', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '24px' }}
          />
          <EditableText 
            as="p"
            contentKey="home.hero.subheading"
            value={homeContent.hero.subheading}
            style={{ textAlign: 'center', color: '#475569', fontSize: '1.1rem', maxWidth: '540px', lineHeight: 1.6, marginBottom: '48px', fontWeight: 500 }}
          />

          <form onSubmit={(e) => { e.preventDefault(); if (submissionStep === 0) handleIdeaSubmit(e); else if (submissionStep === 1) handleProceedToSignup(); }} method="POST" style={{ width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 10 }}>
            <div style={{
              width: '100%',
              position: 'relative',
              background: 'linear-gradient(white, white) padding-box, linear-gradient(225deg, #E2E8F0 60%, #D8B4E2 100%) border-box',
              borderRadius: '20px',
              border: '1px solid transparent',
              boxShadow: '0 10px 40px -10px rgba(0,0,0,0.07)',
              padding: '8px',
              marginBottom: '16px'
            }}>
              {submissionStep === 0 ? (
                <>
                  <textarea
                    id="idea"
                    name="idea"
                    className="idea-textarea"
                    style={{
                      width: '100%',
                      height: '90px',
                      border: 'none',
                      resize: 'none',
                      padding: '14px 16px',
                      fontSize: '1rem',
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
                      padding: '10px 24px',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                      gap: '6px'
                    }}>
                      {isLoading ? '...' : <EditableText contentKey="home.hero.submitBtn" value={homeContent.hero.submitBtn} />}
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ padding: '16px 16px 8px 16px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <EditableText 
                      as="h3"
                      contentKey="home.hero.emailStep.title"
                      value={homeContent.hero.emailStep.title}
                      style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0A0F1C', margin: 0 }}
                    />
                    <button type="button" onClick={() => setSubmissionStep(0)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#94A3B8', padding: '0 8px' }}>×</button>
                  </div>
                  <EditableText 
                    as="p"
                    contentKey="home.hero.emailStep.subtitle"
                    value={homeContent.hero.emailStep.subtitle}
                    style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '16px' }}
                  />
                  <input 
                    type="email" 
                    className="step-input" 
                    placeholder={homeContent.hero.emailStep.placeholder}
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    style={{ width: '100%', marginBottom: '16px', boxSizing: 'border-box' }}
                    autoFocus
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" disabled={isLoading} style={{
                      backgroundColor: '#005AE2',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '100px',
                      padding: '10px 24px',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                      gap: '6px'
                    }}>
                      <EditableText contentKey="home.hero.emailStep.buttonText" value={homeContent.hero.emailStep.buttonText} />
                    </button>
                  </div>
                </div>
              )}
            </div>
            {formMessage && submissionStep < 2 && <div className={`form-message ${messageType}`}>{formMessage}</div>}
            <p className="hero-note">{homeContent.hero.footerNote}</p>
          </form>
        </header>

        {/* Step 2 inline implemented above */}


        {/* Step 3: Signup Overlay */}
        {submissionStep === 2 && (
          <div className="signup-overlay">
            <div className="signup-left">
              <EditableText 
                as="h1"
                contentKey="home.hero.signupStep.brand"
                value={homeContent.hero.signupStep.brand}
                style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '16px' }}
              />
              <EditableText 
                as="h2"
                contentKey="home.hero.signupStep.title"
                value={homeContent.hero.signupStep.title}
                style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px', lineHeight: 1.2, whiteSpace: 'pre-line' }}
              />
              <EditableText 
                as="p"
                contentKey="home.hero.signupStep.subtitle"
                value={homeContent.hero.signupStep.subtitle}
                style={{ color: '#94A3B8', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '32px' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {homeContent.hero.signupStep.features.map((feature, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#005AE2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <EditableText 
                      as="span"
                      contentKey={`home.hero.signupStep.features.${idx}`}
                      value={feature}
                      style={{ fontWeight: 600 }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="signup-right">
              <div className="signup-form-box">
                <EditableText 
                  contentKey="home.hero.signupStep.form.badge"
                  value={homeContent.hero.signupStep.form.badge}
                  className="signup-badge"
                />
                <EditableText 
                  as="h2"
                  contentKey="home.hero.signupStep.form.title"
                  value={homeContent.hero.signupStep.form.title}
                  className="signup-title"
                />
                <EditableText 
                  as="p"
                  contentKey="home.hero.signupStep.form.subtitle"
                  value={homeContent.hero.signupStep.form.subtitle}
                  className="signup-subtitle"
                />
                
                <div className="signup-field">
                  <label className="signup-label">{homeContent.hero.signupStep.form.businessNameLabel}</label>
                  <input 
                    type="text" 
                    className="signup-input" 
                    placeholder={homeContent.hero.signupStep.form.businessNamePlaceholder}
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>
                <div className="signup-field">
                  <label className="signup-label">{homeContent.hero.signupStep.form.emailLabel}</label>
                  <input 
                    type="email" 
                    className="signup-input" 
                    placeholder="xyz@company.com" 
                    value={userEmail}
                    disabled
                  />
                </div>
                <div className="signup-field">
                  <label className="signup-label">{homeContent.hero.signupStep.form.passwordLabel}</label>
                  <input 
                    type="password" 
                    className="signup-input" 
                    placeholder={homeContent.hero.signupStep.form.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="signup-field">
                  <label className="signup-label">{homeContent.hero.signupStep.form.confirmPasswordLabel}</label>
                  <input 
                    type="password" 
                    className="signup-input" 
                    placeholder={homeContent.hero.signupStep.form.confirmPasswordPlaceholder}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                
                {formMessage && <div className="form-message error" style={{ marginBottom: '20px' }}>{formMessage}</div>}
                
                <button className="btn-step-primary" onClick={handleCreateAccount} disabled={isLoading}>
                  {isLoading ? homeContent.hero.signupStep.form.creatingBtn : homeContent.hero.signupStep.form.submitBtn}
                </button>

                <div className="signup-divider">
                  <EditableText contentKey="home.hero.signupStep.form.orText" value={homeContent.hero.signupStep.form.orText} />
                </div>

                <button className="btn-google">
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" alt="Google" />
                  <EditableText contentKey="home.hero.signupStep.form.googleBtn" value={homeContent.hero.signupStep.form.googleBtn} />
                </button>

                <div className="signup-footer">
                  <EditableText contentKey="home.hero.signupStep.form.footerText" value={homeContent.hero.signupStep.form.footerText} /> <Link href="/signin"><EditableText contentKey="home.hero.signupStep.form.footerLink" value={homeContent.hero.signupStep.form.footerLink} /></Link>
                </div>
              </div>
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
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dark Section: Why Partner With Us */}
        <section className="section-dark cc-dots-bg-dark" style={{ position: 'relative' }}>
          <SpotlightCursor color="rgba(0, 90, 226, 0.15)" />
          <div className="section-container" style={{ position: 'relative', zIndex: 1 }}>
            <div className="dark-grid">
              <div className="dark-content">
                <EditableText 
                  as="h3"
                  contentKey="home.partnership.eyebrow"
                  value={homeContent.partnership.eyebrow}
                  className="section-eyebrow cc-reveal"
                />
                <EditableText 
                  as="h2"
                  contentKey="home.partnership.title"
                  value={homeContent.partnership.title}
                  className="section-title text-white cc-reveal cc-delay-1"
                />
                <div className="feature-list">
                  {homeContent.partnership.features.map((feature, idx) => (
                    <div key={idx} className="feature-item">
                      <div className="feature-bullet">&#x2713;</div>
                      <div>
                        <EditableText 
                          as="h4"
                          contentKey={`home.partnership.features.${idx}.title`}
                          value={feature.title}
                          className="feature-title"
                        />
                        <EditableText 
                          as="p"
                          contentKey={`home.partnership.features.${idx}.description`}
                          value={feature.description}
                          className="feature-desc"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <BorderBeam className="testimonial-card-dark cc-reveal cc-delay-2 cc-card-3d cc-card-3d-dark cc-shine" style={{ padding: 0 }}>
                <div style={{ padding: '32px', height: '100%' }}>
                  <EditableText 
                    as="p"
                    contentKey="home.partnership.testimonial.quote"
                    value={homeContent.partnership.testimonial.quote}
                    className="t-card-quote"
                  />
                  <div className="t-card-author">
                    <div className="t-avatar"></div>
                    <div>
                      <EditableText 
                        contentKey="home.partnership.testimonial.author"
                        value={homeContent.partnership.testimonial.author}
                        className="t-name"
                      />
                      <EditableText 
                        contentKey="home.partnership.testimonial.role"
                        value={homeContent.partnership.testimonial.role}
                        className="t-role"
                      />
                    </div>
                  </div>
                </div>
              </BorderBeam>
            </div>
          </div>
        </section>

        {/* Metrics Section */}
        <section className="section-light" style={{ borderBottom: '1px solid var(--border-light)' }}>
          <div className="section-container" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
            <div className="stats-row" style={{ borderTop: 'none', padding: 0 }}>
              {homeContent.metrics.map((metric, idx) => (
                <div key={idx} className="stat-item">
                  <div className="stat-num" style={{ color: 'var(--text-black)', display: 'flex', gap: '2px' }}>
                    <EditableText contentKey={`home.metrics.${idx}.prefix`} value={metric.prefix} />
                    <EditableText contentKey={`home.metrics.${idx}.value`} value={metric.value} />
                    <EditableText contentKey={`home.metrics.${idx}.suffix`} value={metric.suffix} />
                  </div>
                  <EditableText 
                    contentKey={`home.metrics.${idx}.label`}
                    value={metric.label}
                    className="stat-label"
                    style={{ color: 'var(--text-muted)' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How We Make It Happen */}
        <section className="section-light">
          <div className="section-container">
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
              {homeContent.methodology.cards.map((card, idx) => (
                <div key={idx} className={`sys-card-small ${idx % 2 === 0 ? 'cc-shine' : ''}`}>
                  <div className="f-card-icon primary-bg">
                    {card.icon === 'lambda' && 'Λ'}
                    {card.icon === 'grid' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>}
                    {card.icon === 'layers' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 3h5v5" /><path d="M4 20L21 3" /><path d="M21 16v5h-5" /><path d="M15 15l6 6" /><path d="M4 4l5 5" /></svg>}
                    {card.icon === 'star' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>}
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

        {/* 6-Step Venture Process Section */}
        <section className="section-grey border-y text-center">
          <div className="section-container">
            <EditableText 
              as="h2"
              contentKey="home.process.title"
              value={homeContent.process.title}
              className="section-title text-center"
            />
            <EditableText 
              as="p"
              contentKey="home.process.subtitle"
              value={homeContent.process.subtitle}
              className="section-subtitle text-center cc-reveal cc-delay-1"
            />
            <div className="process-wrapper">
              <div className="process-line"></div>
              <div className="process-grid">
                {homeContent.process.steps.map((step, idx) => (
                  <div key={idx} className="process-step">
                    <div className="step-icon-peach" style={{ backgroundColor: step.color, color: 'white' }}>{idx+1}</div>
                    <EditableText 
                      as="h5"
                      contentKey={`home.process.steps.${idx}.title`}
                      value={step.title}
                      className="step-title"
                    />
                    <EditableText 
                      as="p"
                      contentKey={`home.process.steps.${idx}.description`}
                      value={step.description}
                      className="step-desc"
                    />
                  </div>
                ))}
              </div>
            </div>
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
                <div key={idx} className="sys-card-small cc-shine">
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
                <img src={homeContent.testimonials.founder.image} alt={homeContent.testimonials.founder.author} className="founder-photo" />
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
        <section className="section-light text-center" style={{ paddingTop: 0 }}>
          <div className="section-container">
            <EditableText 
              as="h2"
              contentKey="home.cta.title"
              value={homeContent.cta.title}
              className="section-title cc-reveal"
              style={{ whiteSpace: 'pre-line' }}
            />
            <EditableText 
              as="p"
              contentKey="home.cta.subtitle"
              value={homeContent.cta.subtitle}
              className="section-subtitle text-center"
            />
            <Link href="/studio">
              <button className="btn-primary" style={{ marginTop: '16px' }}>
                <EditableText contentKey="home.cta.buttonText" value={homeContent.cta.buttonText} />
              </button>
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

