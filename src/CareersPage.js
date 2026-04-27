import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useScrollReveal from './useScrollReveal';
import Header from './components/Header';
import careersContent from './content/careers.json';

// Effects & Hooks
import TextReveal from './components/effects/TextReveal';
import GrainOverlay from './components/effects/GrainOverlay';
import BorderBeam from './components/effects/BorderBeam';
import Footer from './components/Footer';

export default function CareersPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    interest: 'Engineering',
    linkedin: ''
  });
  useScrollReveal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/submit-talent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Thank you for joining our talent pool! We have received your information.');
        setFormData({
          firstName: '',
          email: '',
          interest: 'Engineering',
          linkedin: ''
        });
      } else {
        alert(data.error || 'Submission failed. Please try again.');
      }
    } catch (error) {
      alert('Network error. Please try again later.');
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

        :root {
          /* Color System */
          --bg-base: #FAFAFA;
          --bg-light: #FFFFFF;
          --bg-dark: #0A0F1C;
          --bg-grey: #F4F5F7;
          
          /* Branding specific to this page */
          --primary-blue: #005AE2;
          --bright-blue: #0088FF; /* Vibrant blue used in 'Revolution' and buttons */
          --bright-blue-hover: #0070E0;
          --light-blue-bg: #EBF5FF;
          
          --text-black: #020617;
          --text-main: #0F172A;
          --text-muted: #64748B;
          --white: #FFFFFF;
          
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
        .careers-page { min-height: 100vh; overflow-x: hidden; animation: cc-pageSlide 0.7s cubic-bezier(0.4,0,0.2,1) both; }

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
        .pb-0 { padding-bottom: 0 !important; }
        
        /* Typography */
        .hero-title { 
          font-size: clamp(2.5rem, 5.5vw, 4.5rem); 
          font-weight: 800; 
          letter-spacing: -0.03em; 
          margin-bottom: clamp(16px, 3vw, 24px); 
          line-height: 1.15; 
          color: var(--text-black);
        }
        .text-bright-blue { color: var(--bright-blue); }
        .cc-gradient-text { background: linear-gradient(90deg, #0088FF, #005AE2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        .section-title { 
          font-size: clamp(1.8rem, 4vw, 2.5rem); 
          font-weight: 800; 
          letter-spacing: -0.02em; 
          margin-bottom: clamp(12px, 2vw, 16px); 
          line-height: 1.2; 
          color: var(--text-black);
        }
        
        .hero-eyebrow-pill {
          display: inline-flex;
          align-items: center;
          background-color: var(--light-blue-bg);
          color: var(--bright-blue);
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 24px;
        }
        .eyebrow-dot { margin-right: 8px; font-size: 10px; }

        .body-text {
          font-size: clamp(0.95rem, 2vw, 1.125rem);
          line-height: 1.6;
          color: var(--text-muted);
          font-weight: 500;
        }

        /* Buttons */
        .btn-bright { 
          background-color: var(--bright-blue); 
          color: var(--white); 
          padding: 14px 32px; 
          border-radius: 8px; 
          font-weight: 700; 
          font-size: 15px; 
          border: none; 
          cursor: pointer; 
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: relative; overflow: hidden;
          box-shadow: 0 4px 14px rgba(0,136,255,0.3);
        }
        .btn-bright::before {
          content:''; position:absolute; top:0; left:-100%; width:60%; height:100%;
          background: linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent);
          transition: left 0s; pointer-events: none;
        }
        .btn-bright:hover { background-color: var(--bright-blue-hover); transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,136,255,0.4); }
        .btn-bright:hover::before { left: 140%; transition: left 0.5s ease; }
        
        .btn-outline {
          background-color: var(--white);
          color: var(--text-black);
          padding: 14px 32px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 15px;
          border: 1px solid var(--border-light);
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-outline:hover { border-color: var(--text-muted); }
        
        .btn-nav { padding: 10px 24px; font-size: 14px; border-radius: 100px; background-color: var(--bright-blue);}

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

        /* Layout Grids */
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 5vw, 64px); align-items: center; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .dept-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; }

        /* Hero Section */
        .hero-section { padding-top: clamp(120px, 12vw, 160px); background-color: var(--bg-base); }
        .hero-btn-group { display: flex; gap: 16px; margin-top: 32px; flex-wrap: wrap; }
        .hero-image-wrap {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.15);
          height: 100%;
          min-height: 400px;
          background: url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80') center/cover;
        }

        /* Values Cards */
        .value-card { 
          background-color: var(--white); 
          border: 1px solid rgba(0,0,0,0.03); 
          padding: 40px 32px; 
          border-radius: 16px; 
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          transition: transform 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s ease;
          transform-style: preserve-3d;
          position: relative;
          overflow: hidden;
        }
        .value-card:hover {
          transform: perspective(800px) rotateX(-4deg) rotateY(4deg) translateY(-8px);
          box-shadow: 0 28px 50px -12px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,136,255,0.07);
        }
        /* shimmer on value card */
        .value-card::before {
          content: '';
          position: absolute; top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent);
          transition: left 0s; pointer-events: none;
        }
        .value-card:hover::before { left: 140%; transition: left 0.5s ease; }
        .value-icon-box {
          width: 48px; height: 48px;
          background-color: var(--light-blue-bg);
          color: var(--bright-blue);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px;
        }
        .value-title { font-size: 1.125rem; font-weight: 800; margin-bottom: 12px; color: var(--text-black); }
        .value-desc { font-size: 0.875rem; color: var(--text-muted); line-height: 1.6; font-weight: 500; }

        /* Departments */
        .dept-card {
          background-color: var(--bg-grey);
          padding: 24px 16px;
          border-radius: 12px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center;
          transition: background-color 0.25s, transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s ease;
          cursor: pointer;
        }
        .dept-card:hover {
          background-color: var(--light-blue-bg);
          transform: translateY(-6px) scale(1.04);
          box-shadow: 0 16px 30px -8px rgba(0,136,255,0.15);
        }
        .dept-icon { transition: transform 0.3s ease; }
        .dept-card:hover .dept-icon { transform: scale(1.2) rotate(-8deg); }
        .dept-icon { color: var(--bright-blue); margin-bottom: 12px; }
        .dept-label { font-size: 0.875rem; font-weight: 800; color: var(--text-main); }

        /* Talent Pool Form */
        .talent-section { text-align: center; max-width: 700px; margin: 0 auto; }
        .talent-icon { width: 56px; height: 56px; background-color: var(--light-blue-bg); color: var(--bright-blue); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
        .talent-form-card {
          background-color: var(--white);
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.05);
          text-align: left;
          margin-top: 40px;
          border: 1px solid var(--border-light);
        }
        .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
        .form-group { display: flex; flex-direction: column; margin-bottom: 24px; }
        .form-label { font-size: 0.65rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
        .form-input {
          padding: 14px 16px;
          border: 1px solid var(--border-light);
          border-radius: 8px;
          font-family: inherit;
          font-size: 0.9rem;
          color: var(--text-black);
          outline: none;
          transition: border-color 0.2s;
          background-color: var(--white);
        }
        .form-input::placeholder { color: #CBD5E1; }
        .form-input:focus { border-color: var(--bright-blue); }
        .w-full { width: 100%; }

        /* CTA Section */
        .cta-card {
          background-color: var(--bg-dark);
          background-image: radial-gradient(circle at center, rgba(0,136,255,0.05) 0%, transparent 60%);
          border-radius: 24px;
          padding: clamp(60px, 8vw, 80px) 24px;
          text-align: center;
          color: var(--white);
          border: 1px solid var(--border-dark);
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          position: relative;
          overflow: hidden;
        }
        /* Simulated tech pattern background */
        .cta-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
          opacity: 0.5; z-index: 0;
        }
        .cta-content { position: relative; z-index: 1; }
        .cta-title { font-size: clamp(2rem, 4vw, 2.75rem); font-weight: 800; margin-bottom: 16px; letter-spacing: -0.02em; }
        .cta-subtitle { color: #9CA3AF; font-size: clamp(0.95rem, 2vw, 1.125rem); font-weight: 500; margin-bottom: 32px; max-width: 600px; margin-inline: auto; line-height: 1.6;}

        /* Footer */
        .footer { background-color: var(--bg-dark); color: #9CA3AF; padding: 80px 0 60px; font-size: clamp(0.875rem, 1.5vw, 1rem); font-weight: 500;}
        .footer-logo { color: var(--white); font-weight: 800; font-size: clamp(1.125rem, 2.5vw, 1.25rem); margin-bottom: 16px; letter-spacing: -0.02em; }
        .footer-heading { color: var(--white); font-weight: 700; margin-bottom: 24px; font-size: 1rem; }
        .footer-links ul { list-style: none; padding: 0; margin: 0; }
        .footer-links li { margin-bottom: 16px; }
        .footer-links a { color: #9CA3AF; text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: var(--white); }

        /* Responsive Overrides */
        @media (max-width: 1024px) {
          .dept-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .grid-2, .grid-3 { grid-template-columns: 1fr; }
          .hero-image-wrap { min-height: 300px; margin-top: 40px; }
          .dept-grid { grid-template-columns: repeat(2, 1fr); }
          .form-row-2 { grid-template-columns: 1fr; gap: 0; }
          .talent-form-card { padding: 32px 24px; }
        }
        @media (max-width: 480px) {
          .hero-btn-group { flex-direction: column; width: 100%; }
          .hero-btn-group button { width: 100%; }
        }
      `}} />

      <div className="careers-page" style={{position:'relative',overflow:'hidden'}}>
        {/* Ambient glow orbs */}
        <div className="cc-glow-orb cc-glow-orb-blue" style={{width:500,height:500,top:'-150px',right:'-120px',opacity:0.14}} />
        <div className="cc-glow-orb cc-glow-orb-cyan" style={{width:300,height:300,top:'55%',left:'-60px',opacity:0.09}} />
        <Header currentPage="careers" />

        {/* Hero Section */}
        <section className="hero-section">
          <GrainOverlay opacity={0.02} />
          <div className="section-container grid-2 pt-0 pb-0" style={{position:'relative',zIndex:1}}>
            <div>
              <div className="hero-eyebrow-pill cc-reveal">
                <span className="eyebrow-dot">.</span> OPEN POSITIONS
              </div>
              <TextReveal as="h1" className="hero-title" text={careersContent.hero.title} />
              <p className="body-text cc-reveal cc-delay-2" style={{maxWidth: '480px'}}>
                {careersContent.hero.subheading}
              </p>
              <div className="hero-btn-group">
                <button className="btn-bright" onClick={() => document.getElementById('job-listings')?.scrollIntoView({behavior: 'smooth'})}>{careersContent.hero.viewOpeningsButton}</button>
                <button className="btn-outline" onClick={() => document.getElementById('mission-section')?.scrollIntoView({behavior: 'smooth'})}>{careersContent.hero.ourMissionButton}</button>
              </div>
            </div>
            <div className="hero-image-wrap">
               {/* Image loaded via CSS background */}
            </div>
          </div>
        </section>

        {/* Values / Mindset Section */}
        <section id="mission-section">
          <div className="section-container">
            <h2 className="section-title">{careersContent.values.title}</h2>
            <p className="body-text" style={{marginBottom: '48px', maxWidth: '600px'}}>
              {careersContent.values.subtitle}
            </p>

            <div className="grid-3">
              {/* Value 1 */}
              <div className="value-card cc-slide-left cc-delay-1">
                <div className="value-icon-box">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <h4 className="value-title">{careersContent.values.values[0].title}</h4>
                <p className="value-desc">{careersContent.values.values[0].description}</p>
              </div>

              {/* Value 2 */}
              <div className="value-card cc-slide-center cc-delay-2">
                <div className="value-icon-box">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h4 className="value-title">{careersContent.values.values[1].title}</h4>
                <p className="value-desc">{careersContent.values.values[1].description}</p>
              </div>

              {/* Value 3 */}
              <div className="value-card cc-slide-right cc-delay-3">
                <div className="value-icon-box">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <h4 className="value-title">{careersContent.values.values[2].title}</h4>
                <p className="value-desc">{careersContent.values.values[2].description}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Department Overview */}
        <section>
          <div className="section-container pt-0">
            <h2 className="section-title" style={{fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '32px'}}>{careersContent.departments.title}</h2>
            
            <div className="dept-grid">
              <div className="dept-card">
                <div className="dept-icon">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                </div>
                <span className="dept-label">{careersContent.departments.departments[0]}</span>
              </div>
              <div className="dept-card">
                <div className="dept-icon">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                </div>
                <span className="dept-label">{careersContent.departments.departments[1]}</span>
              </div>
              <div className="dept-card">
                <div className="dept-icon">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                </div>
                <span className="dept-label">{careersContent.departments.departments[2]}</span>
              </div>
              <div className="dept-card">
                <div className="dept-icon">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <span className="dept-label">{careersContent.departments.departments[3]}</span>
              </div>
              <div className="dept-card">
                <div className="dept-icon">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <span className="dept-label">{careersContent.departments.departments[4]}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Talent Pool Form Section */}
        <section id="job-listings">
          <div className="section-container talent-section">
            <div className="talent-icon">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h2 className="section-title">{careersContent.talentPool.title}</h2>
            <p className="body-text" style={{maxWidth: '500px', margin: '0 auto'}}>
              {careersContent.talentPool.subtitle}
            </p>

            <BorderBeam>
              <div className="talent-form-card">
                <form onSubmit={handleSubmit}>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">{careersContent.talentPool.form.nameLabel}</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="John Doe"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{careersContent.talentPool.form.emailLabel}</label>
                      <input 
                        type="email" 
                        className="form-input" 
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{careersContent.talentPool.form.roleLabel}</label>
                    <select 
                      className="form-input"
                      value={formData.interest}
                      onChange={(e) => setFormData({...formData, interest: e.target.value})}
                      style={{cursor: 'pointer', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundSize: '16px'}}
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Product">Product</option>
                      <option value="Data">Data</option>
                      <option value="Security">Security</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>

                  <div className="form-group" style={{marginBottom: '32px'}}>
                    <label className="form-label">{careersContent.talentPool.form.linkedinLabel}</label>
                    <input 
                      type="url" 
                      className="form-input" 
                      placeholder="https://linkedin.com/in/johndoe"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                    />
                  </div>

                  <div className="cc-reveal cc-delay-2" style={{marginTop: '32px'}}>
                    <button type="submit" className="btn-bright w-full cc-magnetic" style={{padding: '16px'}}>{careersContent.talentPool.form.buttonText}</button>
                  </div>
                </form>
              </div>
            </BorderBeam>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{padding: '0 24px clamp(60px, 8vw, 100px)'}}>
          <div className="max-w-[1200px] mx-auto">
            <div className="cta-card">
              <div className="cta-content">
                <h2 className="cta-title">{careersContent.cta.title}</h2>
                <p className="cta-subtitle">
                  {careersContent.cta.subtitle}
                </p>
                <Link to="/contact">
                  <button className="btn-bright">{careersContent.cta.buttonText} &#x2192;</button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />

      </div>
    </>
  );
}
