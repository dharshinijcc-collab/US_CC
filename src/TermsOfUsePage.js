import React from 'react';
import useScrollReveal from './useScrollReveal';
import { Link } from 'react-router-dom';

// Effects & Hooks



export default function TermsOfUsePage() {
  useScrollReveal();
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');

        :root {
          /* Color System - Consistent with Studio Page Theme */
          --bg-base: #F3F5F9;
          --bg-light: #F8FAFC;
          --bg-dark: #0A0F1C;
          --bg-grey: #F1F5F9;
          
          --primary: #4F46E5;
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
          --success-green: #10B981;
          --accent-cyan: #00E6A0;
        }

        /* Base Styles */
        body, html {
          margin: 0;
          padding: 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
          background-color: var(--bg-light);
          color: var(--text-black);
          scroll-behavior: smooth;
        }

        * { box-sizing: border-box; }

        /* Page Load Animation */
        .terms-page { min-height: 100vh; overflow-x: hidden; animation: cc-pageSlide 0.7s cubic-bezier(0.4,0,0.2,1) both; }

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
        
        /* Specialized Container for Legal Documents */
        .legal-container { 
          max-width: 800px; 
          margin: 0 auto; 
          padding: clamp(80px, 8vw, 120px) 24px clamp(40px, 6vw, 80px) 24px; 
        }

        /* Buttons & Pills */
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

        .btn-nav { 
          background-color: var(--primary-blue); 
          color: var(--white); 
          padding: 10px 24px; 
          border-radius: 100px; 
          font-size: 14px; 
          border: none; 
          cursor: pointer; 
          transition: background-color 0.2s, transform 0.2s; 
        }
        .btn-nav:hover { background-color: #004ac2; }

        .btn-bright {
          background-color: var(--bright-blue);
          color: var(--white);
          padding: 14px 24px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.95rem;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
          position: relative; overflow: hidden;
          box-shadow: 0 4px 14px rgba(0,136,255,0.25);
        }
        .btn-bright::before {
          content:''; position:absolute; top:0; left:-100%; width:60%; height:100%;
          background: linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent);
          transition: left 0s; pointer-events: none;
        }
        .btn-bright:hover { background-color: #0070E0; transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,136,255,0.35); }
        .btn-bright:hover::before { left: 140%; transition: left 0.5s ease; }

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
        .navbar-links > a { 
          color: var(--text-muted); 
          text-decoration: none; 
          padding-bottom: 4px; 
          transition: all 0.3s ease; 
          cursor: pointer;
          position: relative;
        }
        .navbar-links > a::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: var(--primary-blue);
          transition: width 0.3s ease;
        }
        .navbar-links > a:hover::after { width: 100%; }
        .navbar-links > a:hover { color: var(--white); }
        .active-link { color: var(--white) !important; border-bottom: 2px solid var(--primary-blue); }
        
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

        /* Typography - Terms Specific */
        .section-title { 
          font-size: clamp(2rem, 4vw, 2.75rem); 
          font-weight: 800; 
          letter-spacing: -0.02em; 
          margin-bottom: 16px; 
          line-height: 1.1; 
          text-align: center;
          color: var(--text-black);
        }
        
        .terms-title { 
          font-size: clamp(2.5rem, 5vw, 3.5rem); 
          font-weight: 800; 
          letter-spacing: -0.03em; 
          margin-bottom: 12px; 
          line-height: 1.1; 
          color: var(--text-black);
        }
        
        .terms-meta {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 500;
          margin-bottom: 24px;
        }

        .terms-divider {
          width: 48px;
          height: 4px;
          background-color: var(--primary-blue);
          border-radius: 2px;
          margin-bottom: 48px;
        }

        .terms-section {
          margin-bottom: 48px;
        }

        .terms-h2 {
          font-size: clamp(1.25rem, 3vw, 1.35rem);
          font-weight: 800;
          color: var(--text-black);
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .terms-number {
          background-color: var(--light-blue-bg);
          color: var(--primary-blue);
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
          font-weight: 800;
          flex-shrink: 0;
        }

        .terms-p {
          font-size: clamp(0.9rem, 1.5vw, 0.95rem);
          line-height: 1.7;
          color: var(--text-muted);
          font-weight: 500;
          margin-bottom: 16px;
        }

        .terms-indented {
          margin-left: 24px;
          margin-bottom: 16px;
        }
        @media(max-width: 640px) {
          .terms-indented { margin-left: 12px; }
        }

        /* Highlight Box (Disclaimers) */
        .terms-highlight {
          background-color: var(--bg-card);
          border-left: 4px solid var(--primary-blue);
          border-radius: 0 8px 8px 0;
          padding: 24px;
          margin-top: 24px;
          transition: transform 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s ease;
          transform-style: preserve-3d;
        }
        .terms-highlight:hover { 
          transform: perspective(800px) rotateX(-2deg) translateY(-4px);
          box-shadow: 0 16px 40px -10px rgba(0, 90, 226, 0.12);
        }

        /* Contact Box Section */
        .legal-contact-header {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-black);
          margin: 64px 0 24px;
        }
        .legal-contact-header svg { color: var(--primary-blue); }

        .legal-contact-box {
          background-color: var(--bg-card);
          border-radius: 16px;
          padding: 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 24px;
          transition: transform 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s ease;
          transform-style: preserve-3d;
          position: relative; overflow: hidden;
        }
        .legal-contact-box:hover { 
          transform: perspective(800px) rotateX(-2deg) rotateY(2deg) translateY(-6px);
          box-shadow: 0 24px 50px -12px rgba(0, 0, 0, 0.10), 0 0 0 1px rgba(0,90,226,0.06);
        }
        .legal-contact-box::before {
          content:''; position:absolute; top:0; left:-100%; width:60%; height:100%;
          background: linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);
          transition: left 0s; pointer-events: none;
        }
        .legal-contact-box:hover::before { left:140%; transition: left 0.5s ease; }
        .legal-contact-text h3 {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--text-black);
          margin: 0 0 8px 0;
        }
        .legal-contact-text p {
          font-size: clamp(0.85rem, 1.5vw, 0.9rem);
          color: var(--text-muted);
          margin: 0;
          max-width: 400px;
          line-height: 1.6;
          font-weight: 500;
        }

        /* Footer */
        .footer { 
          background-color: var(--bg-dark); 
          color: #9CA3AF; 
          padding: 80px 0 60px; 
          font-size: clamp(0.875rem, 1.5vw, 1rem); 
          font-weight: 500; 
          border-top: 1px solid var(--border-dark);
        }
        .footer-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
          gap: 48px; 
          max-width: 1200px; 
          margin: 0 auto; 
          padding: 0 24px; 
        }
        .footer-logo { 
          color: var(--white); 
          font-weight: 800; 
          font-size: clamp(1.125rem, 2.5vw, 1.25rem); 
          margin-bottom: 16px; 
          letter-spacing: -0.02em; 
        }
        .footer-heading { 
          color: var(--white); 
          font-weight: 700; 
          margin-bottom: 24px; 
          font-size: 0.8rem; 
          text-transform: uppercase; 
          letter-spacing: 0.05em; 
        }
        .footer-links ul { list-style: none; padding: 0; margin: 0; }
        .footer-links li { margin-bottom: 16px; }
        .footer-links a { color: #9CA3AF; text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: var(--white); }
        .btn-footer { 
          background-color: var(--primary-blue); 
          color: var(--white); 
          padding: 10px 20px; 
          border-radius: 100px; 
          border: none; 
          font-weight: 700; 
          font-size: 13px; 
          cursor: pointer; 
          transition: background-color 0.2s;
        }
        .btn-footer:hover { background-color: #004ac2; }

      `}} />

      <div className="terms-page" style={{position:'relative',overflow:'hidden'}}>
        <GrainOverlay opacity={0.015} />
        {/* Ambient glow orbs */}
        <div className="cc-glow-orb cc-glow-orb-blue" style={{width:400,height:400,top:'-100px',right:'-80px',opacity:0.11}} />
        <div className="cc-glow-orb cc-glow-orb-purple" style={{width:240,height:240,bottom:'30%',left:'-50px',opacity:0.07}} />
        {/* Navbar */}
        <div className="navbar-wrapper">
          <nav className="navbar">
            <div className="navbar-brand">Crestcode Product Studio</div>
            <div className="navbar-links">
              <Link to="/">Home</Link>
              <Link to="/studio">Studio</Link>
              <Link to="/">Company</Link>
              <div className="nav-dropdown">
                <Link to="/studio">Our Model &#x25BC;</Link>
                <div className="nav-dropdown-content">
                  <Link to="/careers" className="dropdown-item">Careers</Link>
                  <Link to="/faq" className="dropdown-item">FAQ</Link>
                  <Link to="/contact" className="dropdown-item">Contact</Link>
                  <Link to="/privacy" className="dropdown-item">Privacy Policy</Link>
                  <Link to="/terms" className="dropdown-item">Terms of Use</Link>
                </div>
              </div>
            </div>
            <button className="btn-nav">Enquire</button>
          </nav>
        </div>

        {/* Legal Document Content */}
        <main className="legal-container">
          <section className="legal-hero" style={{ position: 'relative' }}>
            <div className="section-container" style={{ position: 'relative', zIndex: 1 }}>
              <div className="hero-eyebrow cc-reveal">LEGAL</div>
              <TextReveal as="h1" className="hero-title" text="Terms of Use" />
              <p className="hero-subtitle cc-reveal cc-delay-1">Last updated: October 20, 2023</p>
            </div>
          </section>
          
          <div className="terms-divider"></div>

          <section className="terms-section cc-reveal cc-delay-2">
            <h2 className="terms-h2">
              <div className="terms-number">1</div> Overview and Acceptance
            </h2>
            <p className="terms-p">
              Welcome to Crestcode USA. These Terms of Use ("Terms") govern your access to and use of our website, services, and applications. Please read these Terms carefully before using the services.
            </p>
            <p className="terms-p">
              By accessing or using our website, you agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree to these terms, please do not use our services. We reserve the right to modify these terms at any time, and such modifications shall be effective immediately upon posting.
            </p>
          </section>

          <section className="terms-section cc-reveal cc-delay-3">
            <h2 className="terms-h2">
              <div className="terms-number">2</div> Site Usage and Intellectual Property
            </h2>
            <p className="terms-p">
              All content provided on this site, including but not limited to text, graphics, logos, icons, images, and software, is the property of Crestcode USA or its content suppliers and is protected by United States and international copyright laws.
            </p>
            
            <div className="terms-indented">
              <p className="terms-p">You are granted a limited, non-exclusive license to access the site for professional information.</p>
              <p className="terms-p">You may not reproduce, duplicate, copy, sell, or otherwise exploit any portion of the site without express written consent.</p>
              <p className="terms-p">Unauthorized use of any Crestcode USA trademark, service mark, or logo may be a violation of federal and state trademark laws.</p>
            </div>
          </section>

          <section className="terms-section cc-reveal cc-delay-1">
            <h2 className="terms-h2">
              <div className="terms-number">3</div> Disclaimers and Liability
            </h2>
            <p className="terms-p">
              The services and information on this website are provided on an "as is" and "as available" basis. Crestcode USA makes no representations or warranties of any kind, express or implied, as to the operation of the site or the information, content, or materials included.
            </p>
            
            <div className="terms-highlight">
              <p className="terms-p" style={{ margin: 0, color: 'var(--text-muted)' }}>
                In no event shall Crestcode USA be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in any way connected with the use of this website or with the delay or inability to use this website.
              </p>
            </div>
          </section>

          <section className="cc-reveal cc-delay-2">
            <div className="legal-contact-header">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
              Legal Questions & Contact
            </div>
            
            <div className="legal-contact-box">
              <div className="legal-contact-text">
                <h3>Have questions about our terms?</h3>
                <p>Our legal team is here to help you understand your rights and responsibilities.</p>
              </div>
              <button className="btn-bright">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Legal Dept
              </button>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-grid">
            <div>
              <div className="footer-logo">Crestcode USA</div>
              <p style={{fontSize: '0.85rem', lineHeight: 1.6, color: '#9CA3AF', maxWidth: '280px', margin: 0}}>
                Building the next generation of digital products and ventures.
              </p>
            </div>
            <div className="footer-links">
              <h5 className="footer-heading">STUDIO</h5>
              <ul>
                <li><Link to="/founder">Founder Relations</Link></li>
                <li><Link to="/selection">Selection Framework</Link></li>
              </ul>
            </div>
            <div className="footer-links">
              <h5 className="footer-heading">COMPANY</h5>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/insights">Insights</Link></li>
                <li><Link to="/careers">Careers</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
              </ul>
            </div>
            <div className="footer-links">
               <h5 className="footer-heading">CONNECT</h5>
               <div style={{marginBottom: '16px'}}>
                  <div style={{width: 40, height: 40, borderRadius: '6px', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A0F1C', fontWeight: 800, fontSize: '14px', cursor: 'pointer'}}>in</div>
               </div>
               <p style={{fontSize: '0.85rem', color: '#9CA3AF', marginBottom: '16px'}}>Contact Us</p>
               <button className="btn-footer">Partner With Us</button>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
