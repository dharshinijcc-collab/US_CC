import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .cc-footer-wrapper .footer { background-color: var(--bg-dark, #0A0F1C); color: #9CA3AF; padding: 80px 0; font-size: clamp(0.875rem, 1.5vw, 1rem); font-weight: 500;}
        .cc-footer-wrapper .footer-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 64px; }
        .cc-footer-wrapper .footer-logo { color: var(--white, #FFFFFF); font-weight: 800; font-size: clamp(1.125rem, 2.5vw, 1.25rem); margin-bottom: 16px; letter-spacing: -0.02em; }
        .cc-footer-wrapper .footer-tagline { line-height: 1.6; max-width: 250px; margin: 0;}
        .cc-footer-wrapper .footer-heading { color: var(--white, #FFFFFF); font-weight: 700; margin-bottom: 24px; font-size: 1rem; }
        .cc-footer-wrapper .footer-links-group ul { list-style: none; padding: 0; margin: 0; }
        .cc-footer-wrapper .footer-links-group li { margin-bottom: 16px; }
        .cc-footer-wrapper .footer-links-group a { color: #9CA3AF; text-decoration: none; transition: color 0.2s; }
        .cc-footer-wrapper .footer-links-group a:hover { color: var(--white, #FFFFFF); }
        .cc-footer-wrapper .social-icons { display: flex; gap: 16px; }
        .cc-footer-wrapper .social-icon { width: 40px; height: 40px; border-radius: 100px; background-color: #1E293B; display: flex; align-items: center; justify-content: center; color: var(--white, #FFFFFF); cursor: pointer; transition: background-color 0.2s; font-weight: 700; text-decoration: none;}
        .cc-footer-wrapper .social-icon:hover { background-color: var(--primary-blue, #005AE2); }
        @media(max-width: 768px) {
          .cc-footer-wrapper .footer-container { grid-template-columns: 1fr; gap: 40px; }
        }
      `}} />
      <div className="cc-footer-wrapper">
        <footer className="footer">
          <div className="footer-container">
            <div>
              <div className="footer-logo">Crestcode USA</div>
              <p className="footer-tagline">Building the next generation of digital products and ventures.</p>
            </div>
            <div className="footer-links-group">
              <h5 className="footer-heading">Company</h5>
              <ul>
                <li><Link to="/">About Us</Link></li>
                <li><Link to="/careers">Careers</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
            <div className="footer-links-group">
              <h5 className="footer-heading">Services</h5>
              <ul>
                <li><Link to="/studio">MVP Development</Link></li>
                <li><Link to="/studio">Product Design</Link></li>
                <li><Link to="/studio">Technical Consulting</Link></li>
              </ul>
            </div>
            <div className="footer-links-group">
               <h5 className="footer-heading">Connect</h5>
               <div className="social-icons">
                  <span className="social-icon">in</span>
                  <span className="social-icon">X</span>
               </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
