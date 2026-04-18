import React, { useState } from 'react';
import useScrollReveal from './useScrollReveal';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import StudioPage from './StudioPage';
import CareersPage from './CareersPage';
import FaqPage from './FaqPage';
import ContactPage from './ContactPage';
import PrivacyPolicyPage from './PrivacyPolicyPage';
import TermsOfUsePage from './TermsOfUsePage';

// Effects & Hooks
import useCountUp from './hooks/useCountUp';
import useMagneticHover from './hooks/useMagneticHover';

import ParticleField from './components/effects/ParticleField';
import SpotlightCursor from './components/effects/SpotlightCursor';
import TextReveal from './components/effects/TextReveal';
import TypewriterText from './components/effects/TypewriterText';
import BorderBeam from './components/effects/BorderBeam';
import GrainOverlay from './components/effects/GrainOverlay';

export default function App() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<LandingPage key={location.pathname} />} />
      <Route path="/studio" element={<StudioPage key={location.pathname} />} />
      <Route path="/careers" element={<CareersPage key={location.pathname} />} />
      <Route path="/faq" element={<FaqPage key={location.pathname} />} />
      <Route path="/contact" element={<ContactPage key={location.pathname} />} />
      <Route path="/privacy" element={<PrivacyPolicyPage key={location.pathname} />} />
      <Route path="/terms" element={<TermsOfUsePage key={location.pathname} />} />
    </Routes>
  );
}

function LandingPage() {
  const [idea, setIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  useScrollReveal();

  const magBtn1 = useMagneticHover(15);
  const magBtn2 = useMagneticHover(15);
  const magBtn3 = useMagneticHover(15);

  const statsRef1 = useCountUp(12000, 2000);
  const statsRef2 = useCountUp(450, 2000);
  const statsRef3 = useCountUp(3.5, 2000);
  const statsRef4 = useCountUp(42, 2000);

  const handleIdeaSubmit = async (e) => {
    e.preventDefault();
    if (!idea || idea.trim().length < 10) {
      setFormMessage('Please tell us about your idea (at least 10 characters)');
      setMessageType('error');
      return;
    }
    setIsLoading(true);
    setFormMessage('');
    try {
      setTimeout(() => {
        setFormMessage('Thanks for sharing! Our team will review your idea.');
        setMessageType('success');
        setIdea('');
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setFormMessage('Network error. Please try again later.');
      setMessageType('error');
      setIsLoading(false);
    }
  };

  return (
    <>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');

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
          font-family: 'Plus Jakarta Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
          background-color: var(--bg-base);
          color: var(--text-black);
          scroll-behavior: smooth;
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

        /* Grid Systems */
        .cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
        .cards-grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 24px; margin-bottom: 48px;}
        .features-grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; }

        /* System Cards */
        .sys-card { background-color: var(--bg-light); border: 1px solid var(--border-light); padding: 48px 40px; border-radius: 24px; transition: transform 0.2s, box-shadow 0.2s; }
        .sys-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.05); }
        .sys-card-small { background-color: var(--bg-light); border: 1px solid var(--border-light); padding: 40px 32px; border-radius: 24px; display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s; }
        .sys-card-small:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.05); }

        /* Target Audience Elements */
        .card-icon { width: 56px; height: 56px; background-color: var(--white); color: var(--primary-blue); display: flex; align-items: center; justify-content: center; border-radius: 16px; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .card-title { font-size: clamp(1.25rem, 3vw, 1.5rem); font-weight: 800; margin-bottom: 16px; color: var(--text-black); letter-spacing: -0.02em; }
        .card-description { color: var(--text-muted); font-size: clamp(0.9rem, 1.5vw, 1rem); line-height: 1.6; font-weight: 500; margin-bottom: 32px; min-height: 80px; }
        .card-features { list-style: none; padding: 0; margin: 0; }
        .card-features li { display: flex; align-items: center; font-size: clamp(0.9rem, 1.5vw, 1rem); color: var(--text-main); font-weight: 700; margin-bottom: 12px; }
        .check-icon { color: var(--primary-blue); margin-right: 12px; font-weight: 800; font-size: 1.2rem; }

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
        .process-grid { display: grid; grid-template-columns: repeat(1, 1fr); gap: 24px; position: relative; z-index: 1; text-align: left; }
        @media(min-width: 768px) { .process-grid { grid-template-columns: repeat(6, 1fr); } }
        .process-step { display: flex; flex-direction: column; align-items: flex-start; }
        .step-icon-peach { width: 48px; height: 48px; background-color: var(--peach-bg); border: 1px solid var(--peach-border); color: var(--primary-blue); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
        .step-title { font-weight: 800; font-size: clamp(0.8125rem, 1.5vw, 0.875rem); margin-bottom: 8px; color: var(--text-black); line-height: 1.2;}
        .step-desc { color: var(--text-muted); font-size: clamp(0.75rem, 1.25vw, 0.8125rem); line-height: 1.6; font-weight: 500; }

        /* Testimonials */
        .t-quote { font-style: italic; color: var(--text-muted); font-size: clamp(0.95rem, 2vw, 1.125rem); line-height: 1.6; font-weight: 500; margin-bottom: 40px; flex-grow: 1; }
        .t-box-author { display: flex; align-items: center; gap: 16px; }
        .t-avatar-light { width: 40px; height: 40px; background-color: var(--border-light); border-radius: 100px; }
        .t-name-light { font-weight: 800; font-size: clamp(0.875rem, 1.5vw, 1rem); color: var(--text-black); }
        .t-role-light { color: var(--text-muted); font-size: clamp(0.6875rem, 1vw, 0.8125rem); font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin-top: 4px; }

        /* Founder Quote Box */
        .founder-quote-card { background-color: #F8FAFC; border-radius: 24px; padding: clamp(40px, 6vw, 64px); display: flex; align-items: center; gap: clamp(32px, 5vw, 64px); border: 1px solid #E2E8F0; max-width: 1000px; margin: 64px auto 0; }
        .founder-img { width: clamp(100px, 15vw, 140px); height: clamp(100px, 15vw, 140px); border-radius: 100px; border: 4px solid var(--white); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); overflow: hidden; flex-shrink: 0; }
        .founder-photo { width: 100%; height: 100%; object-fit: cover; }
        .fq-content { flex-grow: 1; text-align: left; }
        .fq-marks { color: #005AE2; font-size: 48px; font-weight: 800; line-height: 1; margin-bottom: 12px; font-family: 'Plus Jakarta Sans', sans-serif; }
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

        /* Responsive Overrides */
        @media (max-width: 1024px) {
          .footer-container { grid-template-columns: 1fr 1fr; gap: 48px; }
          .founder-quote-card { flex-direction: column; text-align: center; gap: 32px; }
          .process-line { display: none; }
          .process-step { align-items: center; text-align: center; }
        }
        @media (max-width: 768px) {
          .footer-container { grid-template-columns: 1fr; }
        }
      `}} />

      <div className="landing-page" style={{ overflow: 'hidden', position: 'relative' }}>
        {/* Ambient aura animation */}
        <div className="hero-aura aura-1" />
        <div className="hero-aura aura-2" />
        <div className="navbar-wrapper">
          <nav className="navbar">
            <div className="navbar-brand">Crestcode Product Studio</div>
            <div className="navbar-links">
              <Link to="/" className="active-link">Home</Link>
              <Link to="/studio">Studio</Link>
              <a href="#company">Company</a>
              <div className="nav-dropdown">
                <a href="#model">Our Model &#x25BC;</a>
                <div className="nav-dropdown-content">
                  <Link to="/careers" className="dropdown-item">Careers</Link>
                  <Link to="/faq" className="dropdown-item">FAQ</Link>
                  <Link to="/contact" className="dropdown-item">Contact</Link>
                  <Link to="/privacy" className="dropdown-item">Privacy Policy</Link>
                  <Link to="/terms" className="dropdown-item">Terms of Use</Link>
                </div>
              </div>
            </div>
            <button className="btn-primary btn-nav" style={{backgroundColor: 'var(--primary-blue)', color: 'var(--white)'}}>Enquire</button>
          </nav>
        </div>

        <header className="hero-section" style={{ position: 'relative', paddingTop: '160px', paddingBottom: '80px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, textAlign: 'center', color: '#0A0F1C', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '24px' }}>
            Have an <span style={{color: '#005AE2'}}>Idea</span><br/>Worth Building?
          </h1>
          <p style={{ textAlign: 'center', color: '#475569', fontSize: '1.1rem', maxWidth: '540px', lineHeight: 1.6, marginBottom: '48px', fontWeight: 500 }}>
            Tell us what you're working on. If there's strong founder fit, market pull, and product potential, we'll help take it from concept to venture creation.
          </p>
          
          <form onSubmit={handleIdeaSubmit} style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: '100%',
              position: 'relative',
              background: 'linear-gradient(white, white) padding-box, linear-gradient(225deg, #E2E8F0 60%, #D8B4E2 100%) border-box',
              borderRadius: '24px',
              border: '1px solid transparent',
              boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)',
              padding: '8px',
              marginBottom: '16px'
            }}>
              <textarea 
                className="idea-textarea"
                style={{
                  width: '100%',
                  height: '140px',
                  border: 'none',
                  resize: 'none',
                  padding: '16px',
                  fontSize: '1.05rem',
                  fontFamily: 'inherit',
                  color: '#0A0F1C',
                  backgroundColor: 'transparent',
                  outline: 'none'
                }}
                placeholder="Tell us about your idea..." 
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                disabled={isLoading}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 8px 8px 0' }}>
                <button type="submit" disabled={isLoading} style={{
                  backgroundColor: '#BDBDBD',
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
                  {isLoading ? '...' : 'Submit →'}
                </button>
              </div>
            </div>
            {formMessage && <div className={`form-message ${messageType}`}>{formMessage}</div>}
            <p style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: 500, textAlign: 'center' }}>From Idea to Validation, all under one roof.</p>
          </form>
        </header>

        {/* Target Audiences Section */}
        <section className="section-light">
          <div className="section-container">
            <h3 className="section-eyebrow text-center cc-reveal">TARGET AUDIENCES</h3>
            <h2 className="section-title text-center cc-reveal cc-delay-1">Built for Visionaries at Every Stage.</h2>
            <p className="section-subtitle text-center cc-reveal cc-delay-2">Using AI to deliver faster.</p>
            
            <div className="cards-grid">
              <div className="sys-card cc-slide-left cc-delay-1 cc-shine">
                <div className="card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <h4 className="card-title">Solo Founders</h4>
                <p className="card-description">Expert technical partnership to transform your vision into a robust, market-ready digital product without the overhead of hiring an internal team.</p>
                <ul className="card-features">
                  <li><span className="check-icon">&#x2713;</span> Rapid MVP Development</li>
                  <li><span className="check-icon">&#x2713;</span> Strategic Product Roadmap</li>
                </ul>
              </div>
              <div className="sys-card cc-slide-center cc-delay-2 cc-shine">
                <div className="card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                </div>
                <h4 className="card-title">SMEs & Corporate Labs</h4>
                <p className="card-description">Agile execution for launching new digital sub-brands or internal products that require speed-to-market and high-fidelity design.</p>
                <ul className="card-features">
                  <li><span className="check-icon">&#x2713;</span> Digital Product Innovation</li>
                  <li><span className="check-icon">&#x2713;</span> Legacy Modernization</li>
                </ul>
              </div>
              <div className="sys-card cc-slide-right cc-delay-3 cc-shine">
                <div className="card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M12 2a7 7 0 0 1 7 7c0 2-1 3.9-2 5.5-.5.8-1.5 1.5-1.5 2.5v1H8.5v-1c0-1-1-1.7-1.5-2.5C6 12.9 5 11 5 9a7 7 0 0 1 7-7z"></path></svg>
                </div>
                <h4 className="card-title">Non-technical Founders</h4>
                <p className="card-description">A bridge between your business insight and complex technical implementation, ensuring quality code and scalable architecture from day one.</p>
                <ul className="card-features">
                  <li><span className="check-icon">&#x2713;</span> CTO-as-a-Service</li>
                  <li><span className="check-icon">&#x2713;</span> Tech Strategy & Mentorship</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Dark Section: Why Partner With Us */}
        <section className="section-dark cc-dots-bg-dark" style={{ position: 'relative' }}>
          <SpotlightCursor color="rgba(0, 90, 226, 0.15)" />
          <div className="section-container" style={{ position: 'relative', zIndex: 1 }}>
            <div className="dark-grid">
              <div className="dark-content">
                <h3 className="section-eyebrow cc-reveal">THE CRESTCODE EDGE</h3>
                <h2 className="section-title text-white cc-reveal cc-delay-1">Why Strategic Founders<br />Partner With Us.</h2>
                <div className="feature-list">
                  <div className="feature-item">
                    <div className="feature-bullet">&#x2713;</div>
                    <div>
                      <h4 className="feature-title">Hands-on Product Partners</h4>
                      <p className="feature-desc">We aren't just order-takers. We challenge assumptions, offer strategic insights, and build products based on business outcomes, not just tickets.</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-bullet">&#x2713;</div>
                    <div>
                      <h4 className="feature-title">India-based Team, Global Quality</h4>
                      <p className="feature-desc">Access top-tier engineering talent with a Silicon Valley mindset. We provide elite output at founder-friendly pricing structures that optimize your runway.</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-bullet">&#x2713;</div>
                    <div>
                      <h4 className="feature-title">Founder-Friendly Agility</h4>
                      <p className="feature-desc">We move at the speed of venture. No bureaucracy, just rapid iteration cycles and transparent communication that keeps your project moving forward.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <BorderBeam className="testimonial-card-dark cc-reveal cc-delay-2 cc-card-3d cc-card-3d-dark cc-shine" style={{padding: 0}}>
                <div style={{padding: '32px', height: '100%'}}>
                  <p className="t-card-quote">"Crestcode has been the catalyst for our growth, acting as an extension of our core team."</p>
                  <div className="t-card-author">
                    <div className="t-avatar"></div>
                    <div>
                      <div className="t-name">Julian Rossi</div>
                      <div className="t-role">CTO, Zenith FinTech</div>
                    </div>
                  </div>
                </div>
              </BorderBeam>
            </div>

            <div className="stats-row">
              <div className="stat-item">
                <div ref={statsRef1.ref} className="stat-num">{statsRef1.displayValue || '12k+'}</div>
                <div className="stat-label">HOURS AUTOMATED</div>
              </div>
              <div className="stat-item cc-reveal cc-delay-2">
                <div ref={statsRef2.ref} className="stat-num text-accent">${statsRef2.displayValue || '450'}M</div>
                <div className="stat-label">VALUE DELIVERED</div>
              </div>
              <div className="stat-item cc-reveal cc-delay-3">
                <div ref={statsRef3.ref} className="stat-num">{statsRef3.displayValue || '3.5'}x</div>
                <div className="stat-label">FASTER TO MARKET</div>
              </div>
              <div className="stat-item cc-reveal cc-delay-4">
                <div ref={statsRef4.ref} className="stat-num">{statsRef4.displayValue || '42'}</div>
                <div className="stat-label">PRODUCTS LAUNCHED</div>
              </div>
            </div>
          </div>
        </section>

        {/* How We Make It Happen */}
        <section className="section-light">
          <div className="section-container">
            <TextReveal as="h2" className="section-title" text="How We Make It Happen" />
            <p className="section-subtitle cc-reveal" style={{margin: '0 0 clamp(32px, 5vw, 48px) 0', maxWidth: '800px', textAlign: 'left'}}>
              We don't just execute tasks — we become your product build partner. With senior product thinking, in-house delivery, and proven systems, we help you move from idea to launch with less risk, less delay, and far more clarity.
            </p>

            <div className="features-grid-4">
              <div className="sys-card-small cc-slide-left cc-delay-1 cc-shine">
                <div className="f-card-icon primary-bg">&#x39b;</div>
                <h4 className="f-card-title">Deep Product &<br/>Development<br/>Expertise</h4>
                <p className="f-card-highlight">Built by Product Minds, Not Just Coders</p>
                <p className="f-card-desc">Our team brings real product, design, and engineering depth to every line of code. We think about the "why" as much as the "how".</p>
              </div>
              <div className="sys-card-small">
                <div className="f-card-icon primary-bg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                </div>
                <h4 className="f-card-title">Reusable, Validated<br/>Build Systems</h4>
                <p className="f-card-highlight">Proven Methods. Faster Decisions.</p>
                <p className="f-card-desc">We use reusable frameworks and tested workflows to speed up execution. We don't reinvent the wheel; we optimize the journey.</p>
              </div>
              <div className="sys-card-small cc-slide-up-sm cc-delay-3 cc-shine">
                <div className="f-card-icon primary-bg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 3h5v5"/><path d="M4 20L21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/></svg>
                </div>
                <h4 className="f-card-title">End-to-End In-House<br/>Delivery</h4>
                <p className="f-card-highlight">From Ideation to Launch — All in One Place</p>
                <p className="f-card-desc">Strategy, UX, UI, and dev handled in-house with no fragmented handoffs. Total alignment from day one to launch.</p>
              </div>
              <div className="sys-card-small cc-slide-right cc-delay-4 cc-shine">
                <div className="f-card-icon primary-bg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                </div>
                <h4 className="f-card-title">Partnership Over<br/>Project</h4>
                <p className="f-card-highlight">We Build With You, Not Just For You</p>
                <p className="f-card-desc">We work as an embedded partner invested in your long-term success, adapting our systems to your unique growth goals.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 6-Step Venture Process Section */}
        <section className="section-grey border-y text-center">
          <div className="section-container">
            <TextReveal as="h2" className="section-title" text="The 6-Step Venture Process" />
            <p className="section-subtitle text-center cc-reveal cc-delay-1">A rigorous methodology designed to de-risk startups and accelerate the path to Product-Market Fit.</p>

            <div className="process-wrapper">
              <div className="process-line"></div>
              <div className="process-grid">
                {[
                  { title: "1. Submit Your Idea", desc: "Simple intake with clear criteria for high-potential market disruptions.", icon: (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 18h6M10 22h4M12 2a7 7 0 017 7c0 2-1 3.9-2 5.5-.5.8-1.5 1.5-1.5 2.5v1H8.5v-1c0-1-1-1.7-1.5-2.5C6 12.9 5 11 5 9a7 7 0 017-7z" /></svg>) },
                  { title: "2. Present Core Group", desc: "Strategic alignment check and technical feasibility analysis.", icon: (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 6a4 4 0 100-8 4 4 0 000 8zM23 20v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>) },
                  { title: "3. Formalize", desc: "Agreement and security-backed onboarding for all stakeholders.", icon: (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14 13l-4 4c-.8.8-2 .8-2.8 0l-2-2c-.8-.8-.8-2 0-2.8l4-4m1-1l5-5c.8-.8.8-2 0-2.8l-2-2c-.8-.8-2-.8-2.8 0l-5 5M22 22l-5-5m-13 5h4m-4-4v4" /></svg>) },
                  { title: "4. Build with Pod", desc: "Rapid execution by a dedicated engineering and product team.", icon: (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>) },
                  { title: "5. Launch & Iterate", desc: "Market entry followed by rapid feedback loops and optimization.", icon: (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><polyline strokeLinecap="round" strokeLinejoin="round" points="2 17 8 11 13 16 22 5" /><path strokeLinecap="round" strokeLinejoin="round" d="M18 5h4v4M10 4l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" /></svg>) },
                  { title: "6. Spin Out", desc: "Establishing the venture as a fully independent market entity.", icon: (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>) }
                ].map((step, idx) => (
                  <div key={idx} className="process-step">
                    <div className="step-icon-peach">{step.icon}</div>
                    <h5 className="step-title">{step.title}</h5>
                    <p className="step-desc">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="section-light">
          <div className="section-container">
            <h2 className="section-title text-center cc-reveal" style={{marginBottom: 'clamp(40px, 6vw, 80px)'}}>The Verdict from Visionaries</h2>
            
            <div className="cards-grid-2">
              <div className="sys-card-small cc-slide-left cc-delay-1 cc-card-3d cc-shine">
                <p className="t-quote">"Crestcode transformed our vague concept into a market-ready platform in under 4 months. Their strategic clarity and technical speed are unmatched."</p>
                <div className="t-box-author">
                  <div className="t-avatar-light"></div>
                  <div>
                    <div className="t-name-light">Elena Rodriguez</div>
                    <div className="t-role-light">CEO, FLUX SYSTEMS</div>
                  </div>
                </div>
              </div>
              <div className="sys-card-small cc-slide-right cc-delay-2 cc-card-3d cc-shine">
                <p className="t-quote">"They don't just build what you ask for; they build what you actually need to scale. A true partner in every sense of the word."</p>
                <div className="t-box-author">
                  <div className="t-avatar-light"></div>
                  <div>
                    <div className="t-name-light">David Chen</div>
                    <div className="t-role-light">PRODUCT HEAD, VANTAGE AI</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="founder-quote-card">
              <div className="founder-img">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" alt="Marcus Sterling" className="founder-photo" />
              </div>
              <div className="fq-content">
                <div className="fq-marks">""</div>
                <p className="fq-text">"We believe strong ideas deserve structured execution. In the world of tech, brilliance is common, but discipline is rare. We bridge that gap."</p>
                <div className="fq-meta">
                  <span className="fq-author">Marcus Sterling</span>
                  <span className="fq-role">Founder & Managing Partner, Crestcode USA</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-light text-center" style={{paddingTop: 0}}>
          <div className="section-container">
            <h2 className="section-title cc-reveal">A Better Way to Build<br />New Ventures</h2>
            <p className="section-subtitle text-center">
              We don't just build software; we engineer businesses.<br/>
              Our validated build framework minimizes risk and maximizes market impact by aligning technical precision with commercial reality.
            </p>
            <button className="btn-primary" style={{marginTop: '16px'}}>
              Our Methodology &#x2192;
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-container">
            <div>
              <div className="footer-logo">Crestcode USA</div>
              <p className="footer-tagline">Building the next generation of digital products and ventures.</p>
            </div>
            <div className="footer-links-group">
              <h5 className="footer-heading">Company</h5>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-links-group">
              <h5 className="footer-heading">Services</h5>
              <ul>
                <li><a href="#mvp">MVP Development</a></li>
                <li><a href="#design">Product Design</a></li>
                <li><a href="#consulting">Technical Consulting</a></li>
              </ul>
            </div>
            <div className="footer-links-group">
               <h5 className="footer-heading">Connect</h5>
               <div className="social-icons">
                  <div className="social-icon">in</div>
                  <div className="social-icon">X</div>
               </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}