'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import useScrollReveal from '@/hooks/useScrollReveal';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GrainOverlay from '@/components/effects/GrainOverlay';
import { useContent } from '@/context/ContentContext';
import BorderBeam from '@/components/effects/BorderBeam';
import EditableText from '@/components/admin/EditableText';
import { API_URL, api } from '@/services/api';
import '@/styles/global-styles.css';

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
  const [submitted, setSubmitted] = useState(false);

  const handleServiceClick = (service: any) => {
    setFormData({ ...formData, serviceInterest: service });
  };
  useScrollReveal();
  
  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#FFFFFF] font-manrope">Loading contact...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen bg-[#FFFFFF] font-manrope text-red-500">Error: {error}</div>;
  if (!content) return null;

  const contactContent = content.contact;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await api.post('/submit-contact', formData);

      if (response.status === 200 || response.status === 201) {
        setSubmitted(true);
        setFormData({
          firstName: '',
          workEmail: '',
          company: '',
          serviceInterest: 'Idea Validation',
          projectStage: 'Discovery',
          message: ''
        });
      } else {
        alert(response.data?.error || 'Submission failed. Please try again.');
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Network error. Please try again later.');
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

        :root {
          /* Color System */
          --bg-base: #FFFFFF;
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
        .pt-0 { padding-top: 0 !important; }
        .pb-0 { padding-bottom: 0 !important; }
        
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
        
        /* Typography */
        .hero-title { 
          font-family: 'Manrope', sans-serif !important;
          font-size: 52px !important; /* beautifully sized to feel elegant and full without being too large */
          font-weight: 800 !important;
          letter-spacing: -0.04em !important;
          line-height: 1.22 !important; /* increased line-height for elite aesthetic */
          color: var(--text-black) !important;
          text-align: center !important;
          width: 100%;
          margin: 0 auto 28px !important; /* increased spacing below heading */
          max-width: 960px !important; /* wider boundaries for magnificent scale */
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
          font-size: 36px !important; 
          font-weight: 800; 
          letter-spacing: -0.02em; 
          margin-bottom: clamp(12px, 2vw, 16px); 
          line-height: 1.2; 
          color: var(--text-black);
        }
        
        .hero-eyebrow-pill {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          background-color: #E6EFFF !important;
          color: var(--primary-blue) !important;
          padding: 8px 18px !important; /* increased padding */
          border-radius: 100px !important;
          font-size: 0.8rem !important;
          font-weight: 800 !important;
          letter-spacing: 0.15em !important;
          margin-bottom: 32px !important; /* increased spacing */
          text-transform: uppercase !important;
          font-family: 'Manrope', sans-serif !important;
        }

        .body-text {
          font-size: clamp(0.95rem, 2vw, 1.125rem);
          line-height: 1.6;
          color: var(--text-muted);
          font-weight: 500;
        }

        /* 3D Buttons */
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
          text-decoration: none;
        }
        .btn-primary:hover { 
          background-color: #004ac2; 
          transform: translateY(-2px); 
          box-shadow: 0 15px 30px -5px rgba(0, 90, 226, 0.4);
        }
        .btn-primary:active { transform: translateY(0) scale(0.98); }
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
        
        /* Layout Grids */

        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 5vw, 48px); align-items: center; }
        .grid-2-align-top { align-items: start; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }

        /* Hero Section — spacing from global-styles.css */
        .hero-section {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          width: 100%;
          overflow: hidden;
          background-color: #F1F5F9 !important;
          box-sizing: border-box;
          min-height: auto;
          padding-top: 128px !important;
          padding-bottom: var(--section-padding-bottom) !important;
          padding-left: var(--section-padding-x) !important;
          padding-right: var(--section-padding-x) !important;
        }

        @media (max-width: 1024px) {
          .hero-section {
            min-height: auto;
            padding-top: 110px !important;
            padding-bottom: var(--section-padding-bottom-tablet) !important;
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            min-height: auto;
            padding-top: 110px !important;
            padding-bottom: var(--section-padding-bottom-tablet) !important;
          }
        }

        @media (max-width: 480px) {
          .hero-section {
            min-height: auto;
            padding-top: 102px !important;
            padding-bottom: var(--section-padding-bottom-mobile) !important;
          }
        }
        .hero-image-wrap {
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.15);
          height: 100%;
          min-height: 450px;
          background: url('/images/contact_hero_abstract_tech.png') center/cover;
          transform: translateZ(20px);
          transition: transform 0.3s ease;
        }
        .hero-image-wrap:hover {
          transform: translateZ(20px) scale(1.02);
        }

        /* Interactive Service Cards */
        .services-list { display: flex; flex-direction: column; gap: 16px; margin-top: 24px;}
        .service-card {
          display: flex; align-items: center; gap: 20px;
          padding: 16px 20px;
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
          padding: 24px;
          box-shadow: 
            0 40px 80px -20px rgba(0,0,0,0.12),
            0 0 0 1px rgba(0,0,0,0.02),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          transform: translateZ(30px);
          transition: all 0.3s ease;
          border: 1px solid rgba(0,0,0,0.02);
        }
        .form-card:hover {
          transform: translateY(-2px) translateZ(30px);
          box-shadow: 
            0 60px 100px -30px rgba(0,0,0,0.15),
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
        .contact-info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; max-width: 900px; margin: 40px auto 0; }
        .info-card {
          background: linear-gradient(135deg, #ffffff, #f8fafc);
          border-radius: 24px;
          padding: 20px 20px;
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
        .process-steps-wrap { text-align: center; margin-top: 48px; }
        .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; margin-top: 40px; position: relative; }
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
          padding: 24px 24px;
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
          font-size: 36px !important; 
          font-weight: 800; 
          color: var(--white); 
          letter-spacing: -0.02em; 
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transform: translateZ(10px);
        }

        /* Responsive Design */
        @media (max-width: 900px) {
          .grid-2 {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            text-align: center !important;
          }
          
          /* Standardized via global-styles */
          
          .hero-title {
            font-size: 36px !important;
            margin-bottom: 24px !important;
          }
          
          .body-text {
            margin-inline: auto !important;
            margin-bottom: 32px !important;
          }
          
          .hero-image-wrap {
            min-height: 250px !important;
            margin-top: 20px !important;
          }
          
          .service-card {
            text-align: left !important;
          }
          
          .form-card {
            margin-top: 20px !important;
          }
          
          .form-card form {
            padding: 20px !important;
          }
          
          .cta-strip-inner {
            flex-direction: column !important;
            text-align: center !important;
          }
        }
      `}} />

      <Header currentPage="contact" />
      <div className="contact-page" id="top" style={{position:'relative',overflow:'hidden',backgroundColor:'#F8FAFC'}}>


        {/* Hero Section */}
        <section className="hero-section">
          {/* Ambient glow orbs - Blue only, matching studio page */}
          <div style={{ position: 'absolute', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.25), transparent 70%)', top: '-250px', left: '50%', transform: 'translateX(-50%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }}></div>
          <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.15), transparent 70%)', bottom: '-150px', left: '-50px', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }}></div>
          <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.15), transparent 70%)', bottom: '-150px', right: '-50px', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }}></div>

          <GrainOverlay opacity={0.02} />
          
          <div className="section-container pt-0 pb-0" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '960px' }}>
            <div className="cc-reveal" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <div className="hero-eyebrow-pill">
                <EditableText contentKey="contact.hero.eyebrow" value={contactContent.hero.eyebrow || "CONTACT OUR EXPERTS"} />
              </div>
              
              <div style={{ width: '100%', textAlign: 'center' }}>
                <h1 className="hero-title" style={{ textAlign: 'center', margin: '0 auto', display: 'inline-block' }}>
                  {contactContent.hero.title?.split(' ').map((word: string, i: number) => {
                    const isBlue = ['Great'].includes(word.replace(/[^a-zA-Z]/g, ''));
                    return (
                      <React.Fragment key={i}>
                        <span style={isBlue ? { color: '#005AE2' } : {}}>
                          {word}{' '}
                        </span>
                        {i === 2 && <br />}
                      </React.Fragment>
                    );
                  })}
                </h1>
              </div>

              <EditableText 
                as="p"
                contentKey="contact.hero.subheading"
                value={contactContent.hero.subheading}
                className="body-text cc-delay-2"
                style={{ maxWidth: '720px', margin: '0 auto 40px', textAlign: 'center', lineHeight: '1.8' }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', justifyContent: 'center' }} className="cc-reveal">
                <button className="btn-primary cc-delay-3" onClick={() => document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' })}>
                  <EditableText contentKey="contact.hero.buttonText" value={contactContent.hero.buttonText} />
                </button>
                <div className="cc-delay-4" style={{ fontSize: '0.95rem', color: '#64748B', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>
                  Or email us directly at{' '}
                  <a href="mailto:ccproductstudio@gmail.com" style={{ color: '#005AE2', fontWeight: 700, textDecoration: 'none', borderBottom: '2px solid rgba(0, 90, 226, 0.2)', transition: 'border-color 0.2s', paddingBottom: '2px' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#005AE2'} onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0, 90, 226, 0.2)'}>
                    ccproductstudio@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Form and Services Section */}
        <section id="form-section" style={{ 
          backgroundColor: '#FFFFFF', 
          position: 'relative', 
          overflow: 'hidden',
        }}>
          {/* Grid Background */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(0, 90, 226, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 90, 226, 0.03) 1px, transparent 1px)', backgroundSize: '50px 50px', opacity: 0.5, pointerEvents: 'none', zIndex: 0 }}></div>
          <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.08) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }}></div>
          
          <div className="section-container grid-2 grid-2-align-top" style={{ position: 'relative', zIndex: 1 }}>
            
            {/* Left Column: Services */}
            <div>
              <EditableText 
                as="h2"
                contentKey="contact.services.title"
                value={contactContent.services.title}
                className="section-title cc-slide-left"
                style={{marginTop: 0}}
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
              {submitted ? (
                <div className="text-center py-20 px-10 animate-fade-in" style={{minHeight: '600px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                  <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
                    <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold mb-4">
                    <EditableText contentKey="contact.form.success.title" value={contactContent.form.success.title} />
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-sm">
                    <EditableText contentKey="contact.form.success.message" value={contactContent.form.success.message} />
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="btn-bright"
                  >
                    <EditableText contentKey="contact.form.success.buttonText" value={contactContent.form.success.buttonText} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} method="POST" name="contact-form" style={{padding: '24px'}}>
                  <div className="form-row-2">
                    <div className="form-group">
                      <EditableText 
                        as="label"
                        contentKey="contact.form.nameLabel"
                        value={contactContent.form.nameLabel}
                        className="form-label"
                      />
                      <input type="text" name="firstName" className="form-input" placeholder={contactContent.form.namePlaceholder} 
                             value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required/>
                    </div>
                    <div className="form-group">
                      <EditableText 
                        as="label"
                        contentKey="contact.form.emailLabel"
                        value={contactContent.form.emailLabel}
                        className="form-label"
                      />
                      <input type="email" name="workEmail" className="form-input" placeholder={contactContent.form.emailPlaceholder} 
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
                      <input type="text" name="company" className="form-input" placeholder={contactContent.form.companyPlaceholder} 
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
                    <textarea name="message" className="form-input" placeholder={contactContent.form.messagePlaceholder} 
                               value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required></textarea>
                  </div>

                  <button type="submit" className="btn-bright" style={{width: '100%', padding: '14px'}}>
                    <EditableText contentKey="contact.form.buttonText" value={contactContent.form.buttonText} />
                  </button>
                </form>
              )}
            </BorderBeam>
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
