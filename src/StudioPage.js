import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './components/Header';
import ScrollStack, { ScrollStackItem } from './components/ScrollStack';
import config from '../backend/config.json';
const studioContent = config.studio;

export default function StudioPage() {
  // 1. State for the 3D Card Stack Carousel
  const [activeStackIndex, setActiveStackIndex] = useState(0);
  // 2. Data array for the Stacked Cards from JSON content
  const stackCards = studioContent.solving.cards.map((card, index) => ({
    ...card,
    icon: index === 0 ? <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z" /></svg> :
         index === 1 ? <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" /></svg> :
         index === 2 ? <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> :
         index === 3 ? <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> :
         <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.407 2.67 1M12 17V7m0 10c-1.11 0-2.08-.407-2.67-1M12 17V7" /></svg>,
    color: ["#FF8EBB", "#5C67FF", "#99C26D", "#9C27B0", "#8257e5"][index]
  }));

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStackIndex((prev) => (prev + 1) % stackCards.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [stackCards.length]);

  // Handler to slide to the next card
  const handleNextCard = () => {
    setActiveStackIndex((prevIndex) => (prevIndex + 1) % stackCards.length);
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
        }

        /* Base Styles */
        body, html {
          margin: 0;
          padding: 0;
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
          background-color: var(--bg-light);
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

        * { box-sizing: border-box; }

        .studio-page { min-height: 100vh; overflow-x: hidden; animation: cc-pageSlide 0.7s cubic-bezier(0.4,0,0.2,1) both; }

        .section-container { max-width: 1200px; margin: 0 auto; padding: clamp(40px, 6vw, 80px) 24px; }
        .pt-0 { padding-top: 0 !important; }
        .pb-0 { padding-bottom: 0 !important; }
        
        /* Typography */
        .hero-title { 
          font-size: clamp(2.5rem, 5vw, 4rem); 
          font-weight: 800; 
          letter-spacing: -0.03em; 
          margin-bottom: clamp(16px, 3vw, 24px); 
          line-height: 1.1; 
          color: var(--text-black);
        }
        .text-blue { color: var(--primary-blue); }
        
        .section-title { 
          font-size: clamp(2rem, 4vw, 2.75rem); 
          font-weight: 800; 
          letter-spacing: -0.02em; 
          margin-bottom: clamp(16px, 3vw, 24px); 
          line-height: 1.1; 
          text-align: center;
          color: var(--text-black);
        }
        .section-title-left { text-align: left; }
        .title-dark { color: var(--white); }
        
        .section-eyebrow {
          color: var(--primary-blue);
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-size: clamp(0.6875rem, 1vw, 0.8125rem);
          margin-bottom: 16px;
        }
        
        .hero-eyebrow-pill {
          display: inline-block;
          background-color: #F0F5FF;
          color: var(--primary-blue);
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          margin-bottom: 24px;
        }

        .body-text {
          font-size: clamp(0.95rem, 2vw, 1.125rem);
          line-height: 1.6;
          color: var(--text-muted);
          font-weight: 500;
        }

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
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
          display: inline-block;
          box-shadow: 0 10px 20px -5px rgba(0, 90, 226, 0.3);
        }
        .btn-primary:hover { 
          background-color: #004ac2; 
          transform: translateY(-2px); 
          box-shadow: 0 15px 30px -5px rgba(0, 90, 226, 0.4);
        }
        .btn-primary:active { transform: translateY(0) scale(0.98); }
        .btn-nav { padding: 10px 24px; font-size: 14px; box-shadow: none;}

        /* Navbar & Dropdown */
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
        @media(min-width: 768px) { .navbar-links { display: flex; align-items: center; gap: 32px; font-size: 0.875rem; font-weight: 600; } }
        .navbar-links > a { color: var(--text-muted); text-decoration: none; padding-bottom: 4px; transition: color 0.2s; cursor: pointer; position: relative;}
        .navbar-links > a:hover { color: var(--white); }
        .active-link { color: var(--white) !important; }
        
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

        /* Layout & Grids */
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 5vw, 64px); align-items: center; }
        .grid-2-align-top { align-items: start; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }

        /* Sections */
        .section-white { background-color: var(--white); }
        .section-base { background-color: var(--bg-base); }
        .section-dark { background-color: var(--bg-dark); color: var(--white); }

        /* Hero Section */
        .hero-section { padding-top: clamp(120px, 12vw, 160px); }
        .hero-eyebrow-pill {
          display: inline-flex;
          background-color: #E6EFFF;
          color: #005AE2;
          font-weight: 800;
          font-size: 0.75rem;
          padding: 6px 12px;
          border-radius: 100px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 24px;
        }
        .hero-img-col {
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.15);
          height: 100%;
          min-height: 400px;
          background-color: var(--bg-dark);
          position: relative;
        }
        .hero-img-bg {
          width: 100%; height: 100%; position: absolute; top:0; left:0;
          background: linear-gradient(180deg, rgba(15,23,42,0) 0%, #0F172A 100%), url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80') center/cover;
        }
        .hero-img-badge {
          position: absolute;
          bottom: 32px; left: 32px; right: 32px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 24px;
        }
        .hero-badge-dot {
          width: 6px; height: 6px; background-color: #00E6A0; border-radius: 50%; display: inline-block; margin-right: 8px;
        }
        .hero-badge-tag { font-size: 0.7rem; font-weight: 800; color: #FFFFFF; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; margin-bottom: 8px;}
        .hero-badge-val { font-size: 2rem; font-weight: 800; color: var(--white); line-height: 1; margin-bottom: 4px;}
        .hero-badge-lbl { font-size: 0.75rem; font-weight: 500; color: #9CA3AF; }

        /* Idea Validation Section */
        .validation-wrapper { padding: 80px 24px; max-width: 1200px; margin: 0 auto;}
        .validation-card { 
          background: #0B1019;
          border-radius: 24px; 
          padding: clamp(40px, 6vw, 80px);
          color: var(--white);
          box-shadow: 0 40px 80px rgba(0,20,60,0.15);
        }
        .score-panel {
          background-color: #1A1F29;
          border-radius: 16px;
          padding: 32px;
        }
        .score-header {
          display: flex; justify-content: space-between; align-items: center;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding-bottom: 20px; margin-bottom: 24px;
        }
        .score-title-text { font-size: 0.75rem; font-weight: 800; color: #9CA3AF; letter-spacing: 0.1em; text-transform: uppercase;}
        .score-number { font-size: 1.5rem; font-weight: 800; color: var(--primary-blue);}
        .progress-row { margin-bottom: 20px;}
        .progress-labels { display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 500; color: #D1D5DB; margin-bottom: 8px;}
        .progress-track { height: 6px; background-color: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden;}
        .progress-fill { height: 100%; background-color: var(--primary-blue); border-radius: 4px;}
        .status-badge { 
          background-color: rgba(16, 185, 129, 0.1); 
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: var(--success-green); 
          padding: 12px 16px; 
          border-radius: 8px; 
          font-size: 0.875rem; font-weight: 600; 
          display: flex; align-items: center; gap: 8px; 
          margin-top: 32px;
        }

        /* Generic Cards */
        .card { 
          background-color: var(--white); 
          border: 1px solid var(--border-light); 
          padding: 32px; 
          border-radius: 24px; 
          aspect-ratio: 1 / 1;
          transition: transform 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s ease;
          display: flex; flex-direction: column;
          justify-content: center;
          position: relative;
          transform-style: preserve-3d;
        }
        .card:hover { 
          transform: perspective(900px) rotateX(-3deg) rotateY(3deg) translateY(-10px);
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.4);
          background-color: var(--bg-dark); 
          color: var(--white); 
          border: 1px solid var(--border-dark); 
        }

        .card-title { font-size: clamp(1.25rem, 3vw, 1.5rem); font-weight: 800; margin-bottom: 16px; letter-spacing: -0.02em; color: var(--text-black); transition: color 0.3s;}
        .card:hover .card-title { color: var(--white); }
        
        .card-desc { font-size: clamp(0.9rem, 1.5vw, 1rem); color: var(--text-muted); line-height: 1.6; margin-bottom: 32px; font-weight: 500; flex-grow: 1; transition: color 0.3s;}
        .card:hover .card-desc { color: #9CA3AF; }

        .icon-circle { width: 48px; height: 48px; border-radius: 12px; background-color: #F0F5FF; color: var(--primary-blue); display: flex; align-items: center; justify-content: center; margin-bottom: 24px; transition: background-color 0.3s, color 0.3s;}
        .card:hover .icon-circle { background-color: var(--primary-blue); color: var(--white); }
        
        .card-link { font-weight: 800; font-size: 0.875rem; color: var(--primary-blue); text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: color 0.3s;}
        .card:hover .card-link { color: var(--accent-cyan); }

        .card-desc span { color: var(--text-main); transition: color 0.3s; }
        .card:hover .card-desc span { color: var(--white); }

        /* Lists */
        .check-list { list-style: none; padding: 0; margin: 0 0 32px 0; }
        .check-list li { display: flex; align-items: center; font-size: clamp(0.9rem, 1.5vw, 1rem); color: var(--text-main); font-weight: 700; margin-bottom: 16px; }
        .card-dark .check-list li { color: var(--white); }
        .check-icon { color: var(--primary-blue); margin-right: 12px; font-weight: 800; font-size: 1.2rem;}

        /* --- UPDATED: Solving It Section (Dark) & Stacked Fanned Cards --- */
        .solving-col-text {
          font-size: clamp(1.125rem, 2.5vw, 1.35rem);
          line-height: 1.6;
          color: rgba(255,255,255,0.9);
          text-align: center;
          font-weight: 500;
          max-width: 400px;
          margin: 0 auto;
        }
        .solving-subtitle {
          font-size: clamp(1.25rem, 2vw, 1.5rem);
          font-weight: 800;
          color: var(--white);
          text-align: center;
          margin-bottom: 40px;
          letter-spacing: -0.01em;
        }

        .card-stack-wrapper {
          position: relative;
          width: 100%;
          max-width: 320px;
          margin: 0 auto;
          height: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        /* The white rounded-square cards fanning out */
        .card-stack-item {
          position: absolute;
          width: 300px;
          height: 300px;
          background: var(--white);
          border-radius: 20px;
          padding: 40px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          user-select: none;
          transform-origin: center center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          border: 1px solid #E2E8F0;
        }

        .card-stack-icon {
          width: 56px;
          height: 56px;
          background-color: #FF8EBB; /* Exact pink from the image */
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          color: white;
          flex-shrink: 0;
        }

        .card-stack-text {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.8;
          font-weight: 600;
          overflow: hidden;
          margin: 0;
        }

        /* Highlight active card on hover */
        .card-stack-item.active-hover:hover {
          transform: translateY(-10px) rotate(2deg) scale(1.05) !important;
          box-shadow: 0 40px 80px -15px rgba(0, 90, 226, 0.25) !important;
          z-index: 60 !important;
        }
        .card-stack-item {
          cursor: pointer;
        }

        /* Purple 'C' Bubble Badge at bottom right of the card stack */
        .c-badge-bubble {
          position: absolute;
          bottom: -16px;
          right: -16px;
          width: 72px;
          height: 72px;
          background-color: white;
          border-radius: 50%;
          border-bottom-left-radius: 4px; /* Creates the teardrop shape pointing down-left */
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          z-index: 30;
        }
        .c-badge-inner {
          width: 52px;
          height: 52px;
          background-color: #B548C6; /* Purple color from image */
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 20px;
        }

        /* Why Ideas Fail Section */
        .feature-box { background-color: var(--bg-dark); color: var(--white); padding: 32px; border-radius: 20px; margin-bottom: 16px; display: flex; align-items: flex-start; gap: 20px; border: 1px solid var(--border-dark); }
        .feature-box-icon { width: 40px; height: 40px; background-color: rgba(255,255,255,0.05); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--primary-blue); flex-shrink: 0;}
        .feature-box h4 { margin: 0 0 8px 0; font-size: 1.15rem; font-weight: 800; }
        .feature-box p { margin: 0; font-size: 0.95rem; color: #9CA3AF; line-height: 1.6; font-weight: 500;}
        .image-box-abstract { border-radius: 24px; overflow: hidden; height: 100%; min-height: 400px; background: url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80') center/cover; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.15);}

        /* What We Look For */
        .look-card { background: var(--white); border-radius: 24px; padding: 40px; text-align: left; border: 1px solid var(--border-light); box-shadow: 0 10px 40px rgba(0,0,0,0.08); height: 100%; display: flex; flex-direction: column; justify-content: center; }
        .look-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--primary-blue); margin-bottom: 24px; background-color: #F0F5FF;}
        .look-title { font-size: 1.25rem; font-weight: 800; margin-bottom: 12px; color: var(--text-black); }
        .look-desc { font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; font-weight: 500; }

        /* The Build Timeline Section */
        .timeline-wrapper-new { padding: 48px 0 64px; overflow-x: auto; scrollbar-width: none; }
        .timeline-wrapper-new::-webkit-scrollbar { display: none; }
        
        .timeline-grid-new { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; min-width: 1100px; margin-bottom: 40px; }
        .timeline-col { display: flex; flex-direction: column; position: relative; }
        
        .timeline-grid-new:hover .t-dot-new { background-color: var(--bg-dark) !important; box-shadow: 0 0 0 4px var(--bg-light) !important; }
        .timeline-grid-new:hover .t-line-new { background-color: var(--bg-dark) !important; }
        
        .t-dot-wrapper { display: flex; align-items: center; position: relative; height: 16px; padding-left: 24px; margin-bottom: 16px;}
        .t-dot-new { width: 10px; height: 10px; border-radius: 50%; z-index: 2; position: relative; transition: background-color 0.3s, box-shadow 0.3s; }
        .t-dot-new.blue { background-color: var(--primary-blue); box-shadow: 0 0 0 4px var(--bg-light); }
        .t-dot-new.dark { background-color: var(--bg-dark); box-shadow: 0 0 0 4px var(--bg-light); }
        .t-line-new { position: absolute; left: 34px; right: -16px; height: 2px; z-index: 1; transition: background-color 0.3s; }
        .t-line-new.blue { background-color: var(--primary-blue); }
        .t-line-new.dark { background-color: var(--bg-dark); }
        .t-line-new.grey { background-color: #CBD5E1; }

        .time-card-new { background: var(--white); border: 1px solid var(--border-light); border-radius: 16px; padding: 24px; text-align: left; display: flex; flex-direction: column; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); transition: transform 0.2s, box-shadow 0.2s; height: 100%;}
        .time-card-new:hover { transform: translateY(-4px); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);}
        .time-card-new.dark-bg { background-color: #0A0F1C; border-color: #0A0F1C; }
        .time-card-new.blue-bg { background-color: #005AE2; border-color: #005AE2; }

        .t-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .t-phase-text { font-size: 0.7rem; font-weight: 800; letter-spacing: 0.05em; }
        .t-week-pill { background-color: var(--bg-base); color: var(--text-muted); font-size: 0.65rem; font-weight: 800; padding: 4px 8px; border-radius: 100px; letter-spacing: 0.05em;}
        .t-week-pill.dark-pill { background-color: rgba(255,255,255,0.1); color: var(--white); }
        .t-week-pill.blue-pill { background-color: rgba(255,255,255,0.2); color: var(--white); }
        
        .t-title-new { font-size: 1.1rem; font-weight: 800; line-height: 1.3; margin-bottom: 12px; color: var(--text-black); }
        .t-desc-new { font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; font-weight: 500; }

        .timeline-stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; min-width: 900px; }
        .t-stat-pill { background: var(--white); border: 1px solid var(--border-light); border-radius: 16px; padding: 24px; display: flex; align-items: center; gap: 16px; text-align: left; }
        .t-stat-icon { width: 40px; height: 40px; border-radius: 50%; background-color: #F0F5FF; color: var(--primary-blue); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .t-stat-val { font-size: 1.1rem; font-weight: 800; color: var(--text-black); margin-bottom: 4px; }
        .t-stat-lbl { font-size: 0.7rem; font-weight: 800; color: var(--text-muted); letter-spacing: 0.05em; text-transform: uppercase; }

        /* FAQ */
        .faq-item { background-color: var(--white); border: 1px solid var(--border-light); border-radius: 20px; padding: 24px 32px; margin-bottom: 16px; cursor: pointer; transition: box-shadow 0.2s;}
        .faq-item:hover { box-shadow: 0 10px 20px -10px rgba(0,0,0,0.05); }
        .faq-header { display: flex; justify-content: space-between; align-items: center; font-weight: 800; font-size: clamp(1rem, 2vw, 1.125rem); color: var(--text-main); }
        .faq-icon { font-size: 1.5rem; color: var(--text-muted); font-weight: 400;}
        .faq-content { margin-top: 16px; font-size: clamp(0.9rem, 1.5vw, 1rem); color: var(--text-muted); line-height: 1.6; font-weight: 500; display: block; }

        /* Footer */
        .footer { background-color: var(--bg-dark); color: #9CA3AF; padding: 80px 0 60px; font-size: clamp(0.875rem, 1.5vw, 1rem); font-weight: 500; border-top: 1px solid var(--border-dark);}
        .footer-logo { color: var(--white); font-weight: 800; font-size: clamp(1.125rem, 2.5vw, 1.25rem); margin-bottom: 16px; letter-spacing: -0.02em; }
        .footer-heading { color: var(--white); font-weight: 700; margin-bottom: 24px; font-size: 1rem; }
        .footer-links ul { list-style: none; padding: 0; margin: 0; }
        .footer-links li { margin-bottom: 16px; }
        .footer-links a { color: #9CA3AF; text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: var(--white); }

        /* Responsive Overrides */
        @media (max-width: 1024px) {
          .grid-4 { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
          .stacked-cards-container { height: 300px; margin-top: 40px; }
          .hero-image-wrap { min-height: 300px; margin-top: 40px;}
          .image-box-abstract { min-height: 300px; margin-top: 24px;}
        }
      `}} />

      <div className="studio-page" style={{ position: 'relative', overflow: 'hidden' }}>
        <Header />
        {/* Ambient glow orbs */}

        {/* Hero Section */}
        <section className="section-white hero-section" style={{ position: 'relative' }}>
          <div className="section-container grid-2 pt-0 pb-0" style={{ position: 'relative', zIndex: 1 }}>
            <div>
              <div className="hero-eyebrow-pill">{studioContent.hero.eyebrow}</div>
              <h1 className="hero-title">
                {studioContent.hero.title}
              </h1>
              <p className="body-text" style={{ marginBottom: '40px', maxWidth: '480px' }}>
                {studioContent.hero.subheading}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }} className="cc-reveal">
                <button className="btn-primary" onClick={() => document.getElementById('methodology-section')?.scrollIntoView({behavior: 'smooth'})}>{studioContent.hero.buttonText}</button>
              </div>
            </div>
            <div className="hero-img-col">
              <div className="hero-img-bg"></div>
              <div className="hero-img-badge">
                <div className="hero-badge-tag"><span className="hero-badge-dot"></span>{studioContent.hero.badgeTag}</div>
                <div className="hero-badge-val">{studioContent.hero.badgeValue}</div>
                <div className="hero-badge-lbl">{studioContent.hero.badgeLabel}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Idea Validation Section */}
        <div className="validation-wrapper section-base" style={{ backgroundColor: 'var(--white)' }}>
          <div className="validation-card grid-2">
            <div>
              <h2 className="section-title section-title-left title-dark">{studioContent.validation.title}</h2>
              <p className="body-text" style={{ marginBottom: '40px', color: '#9CA3AF' }}>
                {studioContent.validation.description}
              </p>
              <Link to="/contact">
                <button className="btn-primary" style={{ backgroundColor: '#005AE2', boxShadow: '0 8px 32px rgba(0, 90, 226, 0.4)', padding: '12px 32px', borderRadius: '100px' }}>{studioContent.validation.buttonText}</button>
              </Link>
            </div>

            <div className="score-panel">
              <div className="score-header">
                <span className="score-title-text" style={{ color: '#9CA3AF', fontSize: '0.7rem', fontWeight: 700 }}>{studioContent.validation.scoreLabel}</span>
                <span className="score-number" style={{ color: '#005AE2', fontSize: '1.5rem', fontWeight: 800 }}>{studioContent.validation.scoreValue}</span>
              </div>

              <div className="progress-row">
                <div className="progress-labels">
                  <span style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>{studioContent.validation.marketFitLabel}</span>
                  <span style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>{studioContent.validation.marketFitValue}</span>
                </div>
                <div className="progress-track" style={{ backgroundColor: '#2A303C', height: '4px', borderRadius: '2px' }}>
                  <div className="progress-fill" style={{ width: '92%', height: '4px', borderRadius: '2px', backgroundColor: '#005AE2' }}></div>
                </div>
              </div>

              <div className="progress-row">
                <div className="progress-labels">
                  <span style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>{studioContent.validation.techFeasibilityLabel}</span>
                  <span style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>{studioContent.validation.techFeasibilityValue}</span>
                </div>
                <div className="progress-track" style={{ backgroundColor: '#2A303C', height: '4px', borderRadius: '2px' }}>
                  <div className="progress-fill" style={{ width: '78%', height: '4px', borderRadius: '2px', backgroundColor: '#005AE2' }}></div>
                </div>
              </div>

              <div className="progress-row" style={{ marginBottom: '24px' }}>
                <div className="progress-labels">
                  <span style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>{studioContent.validation.gtmStrategyLabel}</span>
                  <span style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>{studioContent.validation.gtmStrategyValue}</span>
                </div>
                <div className="progress-track" style={{ backgroundColor: '#2A303C', height: '4px', borderRadius: '2px' }}>
                  <div className="progress-fill" style={{ width: '81%', height: '4px', borderRadius: '2px', backgroundColor: '#005AE2' }}></div>
                </div>
              </div>

              <div style={{ backgroundColor: '#122624', color: '#00E6A0', padding: '12px 16px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                {studioContent.validation.growthBadge}
              </div>
            </div>
          </div>
        </div>

        {/* For Founders vs. For Investors Section */}
        <section className="section-base" style={{ position: 'relative' }}>
          <div className="section-container" style={{ position: 'relative', zIndex: 1 }}>
            <h2 className="section-title">{studioContent.foundersInvestors.title}</h2>
            <div className="grid-2 grid-2-align-top" style={{ marginTop: '64px' }}>

              <div className="card" style={{ position: 'relative', overflow: 'hidden', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                {/* Decorative Faint Icon Top Right */}
                <svg style={{ position: 'absolute', top: '32px', right: '32px', width: '80px', height: '80px', color: '#F1F5F9' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5L21 3m-7.5 7.5L9 21M13.5 10.5l-3-3m3 3l3 3m-3-3L3 21" />
                </svg>
                <h3 className="card-title relative z-10" style={{ fontSize: '1.5rem', marginBottom: '24px' }}>{studioContent.foundersInvestors.founders.title}</h3>
                <p className="card-desc relative z-10" style={{ color: '#64748B', fontSize: '0.95rem', marginBottom: '32px', lineHeight: '1.6' }}>{studioContent.foundersInvestors.founders.description}</p>
                <ul className="check-list relative z-10" style={{ marginBottom: '40px' }}>
                  <li style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', color: '#334155', fontSize: '0.9rem', fontWeight: 600 }}>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#005AE2" strokeWidth="2" style={{ marginRight: '12px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {studioContent.foundersInvestors.founders.benefits[0]}
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', color: '#334155', fontSize: '0.9rem', fontWeight: 600 }}>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#005AE2" strokeWidth="2" style={{ marginRight: '12px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {studioContent.foundersInvestors.founders.benefits[1]}
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', color: '#334155', fontSize: '0.9rem', fontWeight: 600 }}>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#005AE2" strokeWidth="2" style={{ marginRight: '12px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {studioContent.foundersInvestors.founders.benefits[2]}
                  </li>
                </ul>
                <a href="#founders" className="card-link relative z-10" style={{ color: '#005AE2', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>{studioContent.foundersInvestors.founders.buttonText} <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg></a>
              </div>

              <div className="card" style={{ position: 'relative', overflow: 'hidden', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                {/* Decorative Faint Icon Top Right */}
                <svg style={{ position: 'absolute', top: '32px', right: '32px', width: '80px', height: '80px', color: '#F1F5F9' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <h3 className="card-title relative z-10" style={{ fontSize: '1.5rem', marginBottom: '24px' }}>{studioContent.foundersInvestors.investors.title}</h3>
                <p className="card-desc relative z-10" style={{ color: '#64748B', fontSize: '0.95rem', marginBottom: '32px', lineHeight: '1.6' }}>{studioContent.foundersInvestors.investors.description}</p>
                <ul className="check-list relative z-10" style={{ marginBottom: '40px' }}>
                  <li style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', color: '#334155', fontSize: '0.9rem', fontWeight: 600 }}>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#005AE2" strokeWidth="2" style={{ marginRight: '12px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {studioContent.foundersInvestors.investors.benefits[0]}
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', color: '#334155', fontSize: '0.9rem', fontWeight: 600 }}>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#005AE2" strokeWidth="2" style={{ marginRight: '12px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {studioContent.foundersInvestors.investors.benefits[1]}
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', color: '#334155', fontSize: '0.9rem', fontWeight: 600 }}>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#005AE2" strokeWidth="2" style={{ marginRight: '12px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {studioContent.foundersInvestors.investors.benefits[2]}
                  </li>
                </ul>
                <a href="#investors" className="card-link relative z-10" style={{ color: '#005AE2', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>{studioContent.foundersInvestors.investors.buttonText} <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg></a>
              </div>

            </div>
          </div>
        </section>

        {/* How the Partnership Works */}
        <section className="section-white" id="methodology-section">
          <div className="section-container" style={{ maxWidth: '1280px' }}>
            <h2 className="section-title">{studioContent.partnership.title}</h2>
            <div className="grid-3" style={{ marginTop: '64px', gap: '32px' }}>

              <div className="card" style={{ padding: '40px 32px' }}>
                <div className="icon-circle">1</div>
                <h3 className="card-title" style={{ fontSize: '1.25rem' }}>{studioContent.partnership.support.title}</h3>
                <p className="card-desc" style={{ fontSize: '0.9rem' }}>
                  {studioContent.partnership.support.description}<br /><br />
                  <span style={{ fontWeight: 700 }}>Best for:</span> {studioContent.partnership.support.bestFor}
                </p>
                <Link to="/contact">
                  <button className="card-link" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', textDecoration: 'none' }}>{studioContent.partnership.support.buttonText}</button>
                </Link>
              </div>

              <div className="card cc-slide-center" style={{ padding: '40px 32px' }}>
                <div className="icon-circle">2</div>
                <h3 className="card-title" style={{ fontSize: '1.25rem' }}>{studioContent.partnership.codevelopment.title}</h3>
                <p className="card-desc" style={{ fontSize: '0.9rem' }}>
                  {studioContent.partnership.codevelopment.description}<br /><br />
                  <span style={{ fontWeight: 700 }}>Best for:</span> {studioContent.partnership.codevelopment.bestFor}
                </p>
                <Link to="/contact">
                  <button className="card-link" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', textDecoration: 'none' }}>{studioContent.partnership.codevelopment.buttonText}</button>
                </Link>
              </div>

              <div className="card" style={{ padding: '40px 32px' }}>
                <div className="icon-circle">3</div>
                <h3 className="card-title" style={{ fontSize: '1.25rem' }}>{studioContent.partnership.fullBuild.title}</h3>
                <p className="card-desc" style={{ fontSize: '0.9rem' }}>
                  {studioContent.partnership.fullBuild.description}<br /><br />
                  <span style={{ fontWeight: 700 }}>Best for:</span> {studioContent.partnership.fullBuild.bestFor}
                </p>
                <Link to="/contact">
                  <button className="card-link" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', textDecoration: 'none' }}>{studioContent.partnership.fullBuild.buttonText}</button>
                </Link>
              </div>

            </div>
          </div>
        </section>

        <section className="section-dark" style={{ backgroundColor: '#0A0F1C', padding: '100px 24px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Main Section Title */}
            <h2 className="section-title title-dark" style={{ marginBottom: '80px', textAlign: 'center', fontSize: '3.5rem', fontWeight: 800, transform: 'translateX(-40px)' }}>{studioContent.solving.title}</h2>
            <div className="grid-2" style={{ alignItems: 'center', gap: '120px', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              {/* Left Column: Problem Step */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transform: 'translateY(-50px)' }}>
                <h3 className="solving-subtitle" style={{ fontSize: '2.25rem', marginBottom: '24px', fontWeight: 800, color: '#FFFFFF', textAlign: 'center', width: '100%' }}>
                  {stackCards[activeStackIndex].title}
                </h3>
                <p className="solving-col-text" style={{ fontSize: '1.25rem', color: '#CBD5E1', maxWidth: '480px', lineHeight: '1.6', fontWeight: 500, margin: '0', textAlign: 'center' }}>
                  {stackCards[activeStackIndex].problemDesc}
                </p>
              </div>

              {/* Right Column: Solution Stack */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div className="card-stack-wrapper" onClick={handleNextCard} style={{ perspective: '1500px', height: '440px', width: '100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ position: 'relative', width: '380px', height: '380px' }}>
                    {stackCards.map((card, index) => {
                      const isActive = index === activeStackIndex;
                      const isPast = index < activeStackIndex;

                      let transform = '';
                      let zIndex = 50 - index;
                      let opacity = 1;

                      // Fanned calculation:
                      const offset = index - activeStackIndex;
                      if (isPast) {
                        transform = 'translate(-60px, -40px) rotate(-15deg)';
                        opacity = 0;
                        zIndex = 0;
                      } else {
                        const rotation = offset * 4;
                        const translateX = offset * 8;
                        const translateY = offset * 8;
                        transform = `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg)`;
                        opacity = 1 - (offset * 0.15);
                        zIndex = 50 - offset;
                      }

                      return (
                        <div
                          key={card.id}
                          className={`card-stack-item ${isActive ? 'active-hover' : ''}`}
                          style={{
                            transform,
                            zIndex,
                            opacity,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            transformOrigin: 'center center',
                            transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            background: 'white',
                            borderRadius: '24px',
                            padding: '40px 32px',
                            width: '380px',
                            height: '380px',
                            boxShadow: isActive ? '0 30px 60px -12px rgba(0,0,0,0.3)' : '0 10px 20px rgba(0,0,0,0.1)',
                            border: '1px solid rgba(0,0,0,0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <div className="card-stack-icon" style={{
                            backgroundColor: card.color || '#FF8EBB',
                            width: '48px', height: '48px',
                            borderRadius: '8px', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            marginBottom: '20px', color: 'white',
                            flexShrink: 0
                          }}>
                            {card.icon}
                          </div>
                          <p className="card-stack-text" style={{ fontSize: '0.85rem', color: '#1E293B', fontWeight: 600, lineHeight: 1.6, margin: 0, textAlign: 'left' }}>
                            {card.solutionDesc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Caption below cards */}
                <p style={{ 
                  color: '#005AE2', 
                  fontSize: '0.75rem', 
                  fontWeight: 800, 
                  letterSpacing: '0.1em', 
                  textTransform: 'uppercase',
                  marginTop: '40px',
                  marginLeft: '80px'
                }}>
                  {studioContent.solving.caption}
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Why Ideas Never Launch */}
        <section className="section-base">
          <div className="section-container grid-2">
            <div>
              <h2 className="section-title section-title-left">
                {studioContent.whyIdeasFail.title}
              </h2>
              <p className="body-text" style={{ marginBottom: '48px' }}>
                {studioContent.whyIdeasFail.description}
              </p>

              <div className="feature-box">
                <div className="feature-box-icon">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <div>
                  <h4>{studioContent.whyIdeasFail.problems[0].title}</h4>
                  <p>{studioContent.whyIdeasFail.problems[0].description}</p>
                </div>
              </div>

              <div className="feature-box">
                <div className="feature-box-icon">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <h4>{studioContent.whyIdeasFail.problems[1].title}</h4>
                  <p>{studioContent.whyIdeasFail.problems[1].description}</p>
                </div>
              </div>
            </div>

            <div className="image-box-abstract"></div>
          </div>
        </section>

        {/* What We Look For */}
        <section className="section-white">
          <div className="section-container">
            <div className="grid-2">
              <div></div>
              <div>
                <h2 className="section-title section-title-left">{studioContent.whatWeLookFor.title}</h2>
                <p className="section-subtitle" style={{ marginBottom: '32px' }}>
                  {studioContent.whatWeLookFor.subtitle}
                </p>
                <ScrollStack useWindowScroll={true} itemDistance={60} itemStackDistance={20} stackPosition="15%" scaleEndPosition="5%">
                  <ScrollStackItem>
                    <div className="look-card">
                      <div className="look-icon">
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                      </div>
                      <h4 className="look-title">{studioContent.whatWeLookFor.criteria[0].title}</h4>
                      <p className="look-desc">{studioContent.whatWeLookFor.criteria[0].description}</p>
                    </div>
                  </ScrollStackItem>

                  <ScrollStackItem>
                    <div className="look-card">
                      <div className="look-icon">
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                      </div>
                      <h4 className="look-title">{studioContent.whatWeLookFor.criteria[1].title}</h4>
                      <p className="look-desc">{studioContent.whatWeLookFor.criteria[1].description}</p>
                    </div>
                  </ScrollStackItem>

                  <ScrollStackItem>
                    <div className="look-card">
                      <div className="look-icon">
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      </div>
                      <h4 className="look-title">{studioContent.whatWeLookFor.criteria[2].title}</h4>
                      <p className="look-desc">{studioContent.whatWeLookFor.criteria[2].description}</p>
                    </div>
                  </ScrollStackItem>

                  <ScrollStackItem>
                    <div className="look-card">
                      <div className="look-icon">
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      </div>
                      <h4 className="look-title">{studioContent.whatWeLookFor.criteria[3].title}</h4>
                      <p className="look-desc">{studioContent.whatWeLookFor.criteria[3].description}</p>
                    </div>
                  </ScrollStackItem>
                </ScrollStack>
              </div>
            </div>
          </div>
        </section>

        {/* The Build Timeline */}
        <section className="section-light text-center">
          <div className="section-container">
            <h2 className="section-title">{studioContent.timeline.title}</h2>
            <p className="section-subtitle text-center mx-auto" style={{ maxWidth: '750px', marginBottom: '64px' }}>
              {studioContent.timeline.subtitle}
            </p>

            <div className="timeline-wrapper-new">
              <div className="timeline-grid-new">

                {/* Column 1 */}
                <div className="timeline-col">
                  <div className="t-dot-wrapper">
                    <div className="t-dot-new blue"></div>
                    <div className="t-line-new blue"></div>
                  </div>
                  <div className="time-card-new">
                    <div className="t-card-header">
                      <span className="t-phase-text text-primary">PHASE 01</span>
                      <span className="t-week-pill">1-2 WKS</span>
                    </div>
                    <h4 className="t-title-new">{studioContent.timeline.phases[0].title}</h4>
                    <p className="t-desc-new">{studioContent.timeline.phases[0].description}</p>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="timeline-col">
                  <div className="t-dot-wrapper">
                    <div className="t-dot-new blue"></div>
                    <div className="t-line-new blue"></div>
                  </div>
                  <div className="time-card-new">
                    <div className="t-card-header">
                      <span className="t-phase-text text-primary">PHASE 02</span>
                      <span className="t-week-pill">1-2 WKS</span>
                    </div>
                    <h4 className="t-title-new">{studioContent.timeline.phases[1].title}</h4>
                    <p className="t-desc-new">{studioContent.timeline.phases[1].description}</p>
                  </div>
                </div>

                {/* Column 3 */}
                <div className="timeline-col">
                  <div className="t-dot-wrapper">
                    <div className="t-dot-new blue"></div>
                    <div className="t-line-new blue"></div>
                  </div>
                  <div className="time-card-new">
                    <div className="t-card-header">
                      <span className="t-phase-text text-primary">PHASE 03</span>
                      <span className="t-week-pill">2-3 WKS</span>
                    </div>
                    <h4 className="t-title-new">{studioContent.timeline.phases[2].title}</h4>
                    <p className="t-desc-new">{studioContent.timeline.phases[2].description}</p>
                  </div>
                </div>

                {/* Column 4 */}
                <div className="timeline-col">
                  <div className="t-dot-wrapper">
                    <div className="t-dot-new blue"></div>
                    <div className="t-line-new dark"></div>
                  </div>
                  <div className="time-card-new">
                    <div className="t-card-header">
                      <span className="t-phase-text text-primary">PHASE 04</span>
                      <span className="t-week-pill">2-3 WKS</span>
                    </div>
                    <h4 className="t-title-new">{studioContent.timeline.phases[3].title}</h4>
                    <p className="t-desc-new">{studioContent.timeline.phases[3].description}</p>
                  </div>
                </div>

                {/* Column 5 */}
                <div className="timeline-col">
                  <div className="t-dot-wrapper">
                    <div className="t-dot-new dark"></div>
                    <div className="t-line-new grey"></div>
                  </div>
                  <div className="time-card-new dark-bg">
                    <div className="t-card-header">
                      <span className="t-phase-text text-primary">PHASE 05</span>
                      <span className="t-week-pill dark-pill">6-8 WKS</span>
                    </div>
                    <h4 className="t-title-new text-white">{studioContent.timeline.phases[4].title}</h4>
                    <p className="t-desc-new" style={{ color: '#9CA3AF' }}>{studioContent.timeline.phases[4].description}</p>
                  </div>
                </div>

                {/* Column 6 */}
                <div className="timeline-col">
                  <div className="t-dot-wrapper">
                    <div className="t-dot-new blue"></div>
                    <div className="t-line-new grey"></div>
                  </div>
                  <div className="time-card-new blue-bg">
                    <div className="t-card-header">
                      <span className="t-phase-text text-white">PHASE 06</span>
                      <span className="t-week-pill blue-pill">2-2 WKS</span>
                    </div>
                    <h4 className="t-title-new text-white">{studioContent.timeline.phases[5].title}</h4>
                    <p className="t-desc-new" style={{ color: 'rgba(255,255,255,0.8)' }}>{studioContent.timeline.phases[5].description}</p>
                  </div>
                </div>

              </div>

              {/* Bottom Stat Pills */}
              <div className="timeline-stats-row">
                <div className="t-stat-pill">
                  <div className="t-stat-icon">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <div className="t-stat-val">{studioContent.timeline.stats[0].value}</div>
                    <div className="t-stat-lbl">{studioContent.timeline.stats[0].label}</div>
                  </div>
                </div>
                <div className="t-stat-pill">
                  <div className="t-stat-icon">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  </div>
                  <div>
                    <div className="t-stat-val">{studioContent.timeline.stats[1].value}</div>
                    <div className="t-stat-lbl">{studioContent.timeline.stats[1].label}</div>
                  </div>
                </div>
                <div className="t-stat-pill">
                  <div className="t-stat-icon">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <div>
                    <div className="t-stat-val">{studioContent.timeline.stats[2].value}</div>
                    <div className="t-stat-lbl">{studioContent.timeline.stats[2].label}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="section-base">
          <div className="section-container">
            <h2 className="section-title text-center" style={{ marginBottom: '64px' }}>{studioContent.faq.title}</h2>

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div className="faq-item">
                <div className="faq-header">
                  <span>{studioContent.faq.items[0].question}</span>
                  <span className="faq-icon">-</span>
                </div>
                <div className="faq-content">
                  {studioContent.faq.items[0].answer}
                </div>
              </div>
              <div className="faq-item">
                <div className="faq-header">
                  <span>{studioContent.faq.items[1].question}</span>
                  <span className="faq-icon">+</span>
                </div>
              </div>
              <div className="faq-item">
                <div className="faq-header">
                  <span>{studioContent.faq.items[2].question}</span>
                  <span className="faq-icon">+</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-white text-center">
          <div className="section-container" style={{ paddingTop: 'clamp(80px, 10vw, 120px)', paddingBottom: 'clamp(80px, 10vw, 120px)' }}>
            <h2 className="section-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '24px' }}>
              {studioContent.cta.title}
            </h2>
            <p className="section-subtitle text-center">
              {studioContent.cta.subtitle}
            </p>
            <Link to="/">
              <button className="btn-primary" style={{ marginTop: '32px', padding: '20px 48px', fontSize: '1.125rem' }}>{studioContent.cta.buttonText}</button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="section-container grid-4 pt-0 pb-0">
            <div>
              <div className="footer-logo">{studioContent.footer.logo}</div>
              <p className="body-text" style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#9CA3AF' }}>{studioContent.footer.description}</p>
            </div>
            <div className="footer-links">
              <h5 className="footer-heading">{studioContent.footer.company.heading}</h5>
              <ul>
                <li><Link to="/">About Us</Link></li>
                <li><Link to="/careers">Careers</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
            <div className="footer-links">
              <h5 className="footer-heading">{studioContent.footer.services.heading}</h5>
              <ul>
                <li><Link to="/studio">MVP Development</Link></li>
                <li><Link to="/studio">Product Design</Link></li>
                <li><Link to="/studio">Technical Consulting</Link></li>
              </ul>
            </div>
            <div className="footer-links">
              <h5 className="footer-heading">{studioContent.footer.connect.heading}</h5>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, cursor: 'pointer' }}>in</div>
                <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, cursor: 'pointer' }}>X</div>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
