'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import useScrollReveal from '@/hooks/useScrollReveal';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GrainOverlay from '@/components/effects/GrainOverlay';
import { useContent } from '@/context/ContentContext';
import BorderBeam from '@/components/effects/BorderBeam';
import EditableText from '@/components/admin/EditableText';

export default function ContactPage() {
  const { content, loading, error } = useContent();

  const [formData, setFormData] = useState({
    firstName: '',
    workEmail: '',
    company: '',
    serviceInterest: 'Idea Validation',
    projectStage: 'Discovery',
    message: ''
  });

  const handleServiceClick = (service: any) => {
    setFormData({ ...formData, serviceInterest: service });
  };
  useScrollReveal();
  
  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#FAFAFA] font-manrope">Loading contact...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen bg-[#FAFAFA] font-manrope text-red-500">Error: {error}</div>;
  if (!content) return null;

  const contactContent = content.contact;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/submit-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Thank you for contacting us! We will get back to you soon.');
        setFormData({
          firstName: '',
          workEmail: '',
          company: '',
          serviceInterest: 'Idea Validation',
          projectStage: 'Discovery',
          message: ''
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
          
          --primary-blue: #005AE2;
          --bright-blue: #0088FF;
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
        .contact-page { min-height: 100vh; overflow-x: hidden; animation: cc-pageSlide 0.7s cubic-bezier(0.4,0,0.2,1) both; }

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

        .page-wrapper { min-height: 100vh; overflow-x: hidden; padding-bottom: 0; }
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
          background: linear-gradient(135deg, #020617, #4a5568);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 4px 8px rgba(0,0,0,0.1);
          transform: translateZ(20px);
        }
        .text-bright-blue { 
          color: var(--bright-blue);
          background: linear-gradient(135deg, var(--primary-blue), var(--bright-blue));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 20px rgba(0, 90, 226, 0.3);
        }
        
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

        .body-text {
          font-size: clamp(0.95rem, 2vw, 1.125rem);
          line-height: 1.6;
          color: var(--text-muted);
          font-weight: 500;
        }

        /* 3D Buttons */
        .btn-bright { 
          background: linear-gradient(135deg, var(--bright-blue), var(--primary-blue));
          color: var(--white); 
          padding: 16px 32px; 
          border-radius: 8px; 
          font-weight: 700; 
          font-size: 15px; 
          border: none; 
          cursor: pointer; 
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-flex; 
          align-items: center; 
          justify-content: center;
          transform: translateZ(15px);
          box-shadow: 
            0 4px 15px rgba(0, 136, 255, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }
        .btn-bright::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s;
        }
        .btn-bright:hover {
          transform: translateY(-3px) translateZ(15px) scale(1.05);
          box-shadow: 
            0 8px 25px rgba(0, 136, 255, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }
        .btn-bright:hover::before {
          left: 100%;
        }
        .btn-bright:active {
          transform: translateY(-1px) translateZ(15px) scale(0.98);
        }
        
        .btn-dark {
          background: linear-gradient(135deg, var(--bg-dark), #1a2332);
          color: var(--white);
          padding: 16px 32px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 15px;
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateZ(15px);
          box-shadow: 
            0 4px 15px rgba(0,0,0,0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        .btn-dark:hover {
          transform: translateY(-2px) translateZ(15px);
          box-shadow: 
            0 8px 25px rgba(0,0,0,0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .btn-white {
          background-color: var(--white);
          color: var(--bright-blue);
          padding: 14px 32px;
          border-radius: 8px;
          font-weight: 800;
          font-size: 15px;
          border: none;
          cursor: pointer;
          transition: transform 0.2s;
          transform: translateZ(10px);
          box-shadow: 
            0 4px 15px rgba(0,0,0,0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }
        .btn-white:hover { transform: translateY(-2px) translateZ(10px); }
        
        .btn-nav { padding: 10px 24px; font-size: 14px; border-radius: 100px; background-color: var(--bright-blue);}

        /* Layout Grids */
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(40px, 6vw, 80px); align-items: center; }
        .grid-2-align-top { align-items: start; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }

        /* Hero Section */
        .hero-section { padding-top: clamp(80px, 8vw, 120px); background-color: var(--bg-base); position: relative; }
        .hero-image-wrap {
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.15);
          height: 100%;
          min-height: 450px;
          background: url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80') center/cover;
          transform: translateZ(20px);
          transition: transform 0.3s ease;
        }
        .hero-image-wrap:hover {
          transform: translateZ(20px) scale(1.02);
        }

        /* Interactive Service Cards */
        .services-list { display: flex; flex-direction: column; gap: 16px; margin-top: 40px;}
        .service-card {
          display: flex; align-items: center; gap: 20px;
          padding: 24px 32px;
          border-radius: 16px;
          background: var(--white);
          border: 1px solid var(--border-light);
          cursor: pointer;
          transition: all 0.3s ease;
          transform: translateZ(10px);
          box-shadow: 
            0 4px 10px rgba(0,0,0,0.02),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }
        .service-card:hover { 
          border-color: #CBD5E1; 
          box-shadow: 
            0 10px 30px rgba(0,0,0,0.08),
            inset 0 1px 0 rgba(255, 255, 255, 1);
          transform: translateY(-2px) translateZ(10px);
        }
        .service-card.active {
          border-color: var(--bright-blue);
          box-shadow: 
            0 15px 40px rgba(0, 136, 255, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 1);
        }
        .service-icon-box {
          width: 48px; height: 48px; border-radius: 12px;
          background-color: var(--bg-grey);
          color: var(--text-muted);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
          transform: translateZ(5px);
        }
        .service-card.active .service-icon-box { 
          background-color: var(--light-blue-bg); 
          color: var(--bright-blue);
          transform: translateZ(5px) scale(1.1);
        }
        .service-title { font-size: 1.1rem; font-weight: 800; color: var(--text-black); margin-bottom: 4px; }
        .service-desc { font-size: 0.85rem; color: var(--text-muted); font-weight: 500; margin: 0;}

        /* Form Card */
        .form-card {
          background: linear-gradient(135deg, #ffffff, #f8fafc);
          border-radius: 24px;
          padding: clamp(32px, 5vw, 48px);
          box-shadow: 
            0 20px 50px rgba(0,0,0,0.08),
            0 0 0 1px rgba(255, 255, 255, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          transform: translateZ(30px);
          transition: all 0.3s ease;
          border: 1px solid rgba(0,0,0,0.02);
        }
        .form-card:hover {
          transform: translateY(-2px) translateZ(30px);
          box-shadow: 
            0 30px 60px rgba(0,0,0,0.12),
            0 0 0 1px rgba(255, 255, 255, 0.7),
            inset 0 1px 0 rgba(255, 255, 255, 1);
        }
        .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
        @media(max-width: 640px) { .form-row-2 { grid-template-columns: 1fr; gap: 24px; } }
        .form-group { display: flex; flex-direction: column; margin-bottom: 24px; }
        .form-group:last-child { margin-bottom: 0; }
        .form-label { font-size: 0.85rem; font-weight: 800; color: var(--text-black); margin-bottom: 12px; }
        .form-input {
          padding: 16px;
          border: 1px solid var(--border-light);
          border-radius: 8px;
          font-family: inherit;
          font-size: 0.95rem;
          color: var(--text-black);
          outline: none;
          transition: all 0.3s ease;
          background: var(--bg-base);
          transform: translateZ(5px);
        }
        .form-input::placeholder { color: #9CA3AF; font-weight: 500;}
        .form-input:focus { 
          border-color: var(--bright-blue); 
          background-color: var(--white);
          transform: translateZ(5px);
        }
        textarea.form-input { resize: none; min-height: 120px; }
        
        /* Custom Select */
        select.form-input {
          appearance: none; cursor: pointer;
          background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E");
          background-repeat: no-repeat; background-position: right 16px center; background-size: 16px;
          transform: translateZ(5px);
        }

        /* Radio Pills */
        .radio-pill-group { display: flex; flex-wrap: wrap; gap: 12px; }
        .radio-pill {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 20px;
          background: var(--bg-base);
          border: 1px solid var(--border-light);
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
          cursor: pointer; 
          transition: all 0.3s ease;
          transform: translateZ(5px);
        }
        .radio-pill:hover { 
          border-color: #CBD5E1; 
          transform: translateY(-1px) translateZ(5px);
        }
        .radio-pill.active { 
          background: var(--white); 
          border-color: var(--bright-blue); 
          color: var(--text-black); 
          box-shadow: 
            0 4px 10px rgba(0, 136, 255, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }
        .radio-circle { 
          width: 16px; 
          height: 16px; 
          border-radius: 50%; 
          border: 2px solid #CBD5E1; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          transform: translateZ(3px);
        }
        .radio-pill.active .radio-circle { 
          border-color: var(--bright-blue);
          transform: translateZ(3px) scale(1.1);
        }
        .radio-pill.active .radio-circle::after { 
          content: ''; 
          width: 8px; 
          height: 8px; 
          border-radius: 50%; 
          background-color: var(--bright-blue); 
        }
        .radio-pill input[type="radio"] { display: none; }

        /* Contact Info Cards */
        .contact-info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; max-width: 900px; margin: 80px auto 0; }
        .info-card {
          background: linear-gradient(135deg, #ffffff, #f8fafc);
          border-radius: 24px;
          padding: 48px 32px;
          text-align: center;
          box-shadow: 
            0 10px 40px rgba(0,0,0,0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          transform: translateZ(20px);
          transition: all 0.3s ease;
        }
        .info-card:hover {
          transform: translateY(-3px) translateZ(20px);
          box-shadow: 
            0 15px 50px rgba(0,0,0,0.1),
            inset 0 1px 0 rgba(255, 255, 255, 1);
        }
        .info-icon { 
          width: 48px; 
          height: 48px; 
          background: var(--light-blue-bg); 
          color: var(--bright-blue); 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          margin: 0 auto 24px; 
          transform: translateZ(10px);
        }
        .info-title { font-size: 1.25rem; font-weight: 800; margin-bottom: 12px; color: var(--text-black); }
        .info-desc { font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; font-weight: 500; margin-bottom: 24px; }
        .info-link { font-weight: 800; font-size: 1rem; color: var(--bright-blue); text-decoration: none; }
        .info-link:hover { text-decoration: underline; }

        /* Process Steps */
        .process-steps-wrap { text-align: center; margin-top: 64px; }
        .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; margin-top: 64px; position: relative; }
        /* Dotted line behind circles */
        .steps-grid::before { 
          content: ''; 
          position: absolute; 
          top: 32px; 
          left: 15%; 
          right: 15%; 
          height: 2px; 
          border-top: 2px dashed var(--border-light); 
          z-index: 0; 
        }
        @media(max-width: 768px) { 
          .steps-grid { 
            grid-template-columns: 1fr; 
            gap: 48px; 
          } 
          .steps-grid::before { display: none; } 
        }
        .step-item { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; }
        .step-circle { 
          width: 64px; 
          height: 64px; 
          border-radius: 50%; 
          background: linear-gradient(135deg, var(--bright-blue), var(--primary-blue)); 
          color: var(--white); 
          font-size: 1.5rem; 
          font-weight: 800; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          margin-bottom: 24px; 
          box-shadow: 
            0 0 0 8px var(--bg-base),
            inset 0 2px 0 rgba(255, 255, 255, 0.3);
          transform: translateZ(15px);
        }
        .step-title { font-size: 1.25rem; font-weight: 800; color: var(--text-black); margin-bottom: 12px; }
        .step-desc { font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; font-weight: 500; max-width: 280px; margin: 0 auto; }

        /* Full Width CTA Strip */
        .cta-strip {
          background: linear-gradient(135deg, var(--bright-blue), var(--primary-blue));
          padding: clamp(40px, 6vw, 64px) 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .cta-strip::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          animation: shimmer 3s infinite;
        }
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        .cta-strip-inner {
          max-width: 1200px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 32px;
          position: relative;
          z-index: 1;
        }
        .cta-strip-title { 
          font-size: clamp(2rem, 4vw, 2.5rem); 
          font-weight: 800; 
          color: var(--white); 
          letter-spacing: -0.02em; 
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transform: translateZ(10px);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-title { font-size: clamp(2rem, 8vw, 3rem); }
          .form-card { padding: 32px 24px; }
          .cta-strip { padding: clamp(32px, 5vw, 48px) 16px; }
        }
        @media (max-width: 480px) {
          .hero-title { font-size: clamp(1.5rem, 10vw, 2.5rem); }
          .form-card { padding: 24px 16px; }
          .cta-strip { padding: clamp(24px, 4vw, 40px) 12px; }
        }
      `}} />

      <div className="contact-page" id="top" style={{position:'relative',overflow:'hidden'}}>
        {/* Ambient glow orbs */}
        <div className="cc-glow-orb cc-glow-orb-blue" style={{width:550,height:550,top:'-180px',right:'-130px',opacity:0.14}} />
        <div className="cc-glow-orb cc-glow-orb-purple" style={{width:320,height:320,bottom:'20%',left:'-70px',opacity:0.09}} />
        <Header currentPage="contact" />

        {/* Hero Section */}
        <section className="hero-section">
          <GrainOverlay opacity={0.02} />
          <div className="section-container grid-2 pb-0" style={{ position: 'relative', zIndex: 1 }}>
            <div>
              <div className="hero-eyebrow-pill cc-reveal">CONTACT OUR EXPERTS</div>
              <EditableText 
                as="h1"
                contentKey="contact.hero.title"
                value={contactContent.hero.title}
                className="hero-title"
              />
              <EditableText 
                as="p"
                contentKey="contact.hero.subheading"
                value={contactContent.hero.subheading}
                className="body-text cc-reveal cc-delay-2"
                style={{maxWidth: '480px', marginBottom: '40px'}}
              />
              <button className="btn-dark cc-reveal cc-delay-3" onClick={() => document.getElementById('form-section')?.scrollIntoView()}>
                <EditableText contentKey="contact.hero.buttonText" value={contactContent.hero.buttonText} />
              </button>
            </div>
            <div className="hero-image-wrap"></div>
          </div>
        </section>

        {/* Form and Services Section */}
        <section id="form-section">
          <div className="section-container grid-2 grid-2-align-top">
            
            {/* Left Column: Services */}
            <div>
              <EditableText 
                as="h2"
                contentKey="contact.services.title"
                value={contactContent.services.title}
                className="section-title cc-slide-left"
                style={{fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', marginTop: 0}}
              />
              <EditableText 
                as="p"
                contentKey="contact.services.subtitle"
                value={contactContent.services.subtitle}
                className="body-text cc-slide-left cc-delay-1"
              />
              
              <div className="services-list">
                {contactContent.services.services.map((service, index) => (
                  <div 
                    key={service.title}
                    className={`service-card ${formData.serviceInterest === service.title ? 'active' : ''}`}
                    onClick={() => handleServiceClick(service.title)}
                  >
                    <div className="service-icon-box">
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">{[
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />,
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />,
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      ][index]}</svg>
                    </div>
                    <div>
                      <EditableText 
                        as="h4"
                        contentKey={`contact.services.services.${index}.title`}
                        value={service.title}
                        className="service-title"
                      />
                      <EditableText 
                        as="p"
                        contentKey={`contact.services.services.${index}.description`}
                        value={service.description}
                        className="service-desc"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Form */}
            <BorderBeam className="form-card cc-slide-right" style={{padding: 0}}>
              <form onSubmit={handleSubmit} method="POST" name="contact-form" style={{padding: '48px'}}>
                <div className="form-row-2">
                  <div className="form-group">
                    <EditableText 
                      as="label"
                      contentKey="contact.form.nameLabel"
                      value={contactContent.form.nameLabel}
                      className="form-label"
                    />
                    <input type="text" name="firstName" className="form-input" placeholder="John Doe" 
                           value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required/>
                  </div>
                  <div className="form-group">
                    <EditableText 
                      as="label"
                      contentKey="contact.form.emailLabel"
                      value={contactContent.form.emailLabel}
                      className="form-label"
                    />
                    <input type="email" name="workEmail" className="form-input" placeholder="john@company.com" 
                           value={formData.workEmail} onChange={e => setFormData({...formData, workEmail: e.target.value})} required/>
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <EditableText 
                      as="label"
                      contentKey="contact.form.companyLabel"
                      value={contactContent.form.companyLabel}
                      className="form-label"
                    />
                    <input type="text" name="company" className="form-input" placeholder="Acme Inc." 
                           value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})}/>
                  </div>
                  <div className="form-group">
                    <EditableText 
                      as="label"
                      contentKey="contact.form.serviceLabel"
                      value={contactContent.form.serviceLabel}
                      className="form-label"
                    />
                    <select className="form-input" value={formData.serviceInterest} onChange={e => handleServiceClick(e.target.value)}>
                      {contactContent.services.services.map(service => (
                        <option key={service.title} value={service.title}>{service.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{marginBottom: '32px'}}>
                  <EditableText 
                    as="label"
                    contentKey="contact.form.stageLabel"
                    value={contactContent.form.stageLabel}
                    className="form-label"
                  />
                  <div className="radio-pill-group">
                    {contactContent.form.stages.map((stage, idx) => (
                      <label key={stage} className={`radio-pill ${formData.projectStage === stage ? 'active' : ''}`}>
                        <input type="radio" name="projectStage" value={stage} 
                                checked={formData.projectStage === stage} 
                                onChange={e => setFormData({...formData, projectStage: e.target.value})} />
                        <div className="radio-circle"></div>
                        <EditableText 
                          as="span"
                          contentKey={`contact.form.stages.${idx}`}
                          value={stage}
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group" style={{marginBottom: '32px'}}>
                  <EditableText 
                    as="label"
                    contentKey="contact.form.messageLabel"
                    value={contactContent.form.messageLabel}
                    className="form-label"
                  />
                  <textarea name="message" className="form-input" placeholder="Tell us about your project..." 
                            value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required></textarea>
                </div>

                <button type="submit" className="btn-bright" style={{width: '100%', padding: '18px'}}>
                  <EditableText contentKey="contact.form.buttonText" value={contactContent.form.buttonText} />
                </button>
              </form>
            </BorderBeam>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="pt-0">
          <div className="section-container contact-info-grid">
            <div className="info-card">
              <div className="info-icon">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2h-4a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <EditableText 
                as="h3"
                contentKey="contact.contactInfo.emailTitle"
                value="Email Us"
                className="info-title"
              />
              <EditableText 
                as="p"
                contentKey="contact.contactInfo.emailDesc"
                value="For general inquiries and hello's"
                className="info-desc"
              />
              <EditableText 
                as="a"
                contentKey="contact.contactInfo.email"
                value={contactContent.contactInfo.email}
                className="info-link"
                href={`mailto:${contactContent.contactInfo.email}`}
              />
            </div>
            <div className="info-card">
              <div className="info-icon">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2H5a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <EditableText as="h3" contentKey="contact.contactInfo.title" value={contactContent.contactInfo.title} className="info-title" />
              <EditableText as="p" contentKey="contact.contactInfo.address" value={contactContent.contactInfo.address} className="info-desc" />
              <EditableText as="a" contentKey="contact.contactInfo.phone" value={contactContent.contactInfo.phone} href={`tel:${contactContent.contactInfo.phone}`} className="info-link" />
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="pb-0">
          <div className="section-container process-steps-wrap">
            <EditableText as="h2" contentKey="contact.process.title" value={contactContent.process.title} className="section-title" />
            <EditableText as="p" contentKey="contact.process.subtitle" value={contactContent.process.subtitle} className="body-text text-center" />
            
            <div className="steps-grid">
              {contactContent.process.steps.map((step, idx) => (
                <div key={idx} className="step-item cc-slide-left cc-delay-1">
                  <div className="step-circle">{idx+1}</div>
                  <EditableText as="h4" contentKey={`contact.process.steps.${idx}.title`} value={step.title} className="step-title" />
                  <EditableText as="p" contentKey={`contact.process.steps.${idx}.description`} value={step.description} className="step-desc" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA Strip */}
        <div className="cta-strip">
          <div className="cta-strip-inner">
            <EditableText as="h2" contentKey="contact.cta.title" value={contactContent.cta.title} className="cta-strip-title" />
            <button className="btn-white" onClick={() => document.getElementById('form-section')?.scrollIntoView({behavior: 'smooth'})}>
              <EditableText contentKey="contact.cta.buttonText" value={contactContent.cta.buttonText} />
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
