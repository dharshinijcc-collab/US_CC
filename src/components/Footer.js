import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .footer { 
          background: linear-gradient(135deg, #0A0F1C, #1a2332);
          color: #9CA3AF; 
          padding: 80px 0 60px; 
          font-size: clamp(0.875rem, 1.5vw, 1rem); 
          font-weight: 500;
          position: relative;
          overflow: hidden;
        }
        .footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        }
        .footer-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
          gap: 48px; 
          max-width: 1200px; 
          margin: 0 auto; 
          padding: 0 24px;
          position: relative;
          z-index: 1;
        }
        .footer-logo { 
          color: var(--white); 
          font-weight: 800; 
          font-size: clamp(1.125rem, 2.5vw, 1.25rem); 
          margin-bottom: 16px; 
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #ffffff, #e0e7ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
          transform: translateZ(10px);
        }
        .footer-heading { 
          color: var(--white); 
          font-weight: 700; 
          margin-bottom: 24px; 
          font-size: 0.8rem; 
          text-transform: uppercase; 
          letter-spacing: 0.05em;
          transform: translateZ(5px);
        }
        .footer-links ul { 
          list-style: none; 
          padding: 0; 
          margin: 0; 
        }
        .footer-links li { 
          margin-bottom: 16px; 
          transform: translateZ(3px);
        }
        .footer-links a { 
          color: #9CA3AF; 
          text-decoration: none; 
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          display: inline-block;
          transform: translateZ(5px);
        }
        .footer-links a::before {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--primary-blue), var(--bright-blue));
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .footer-links a:hover { 
          color: var(--white);
          transform: translateY(-2px) translateZ(5px);
        }
        .footer-links a:hover::before {
          width: 100%;
        }

        /* 3D Social Icons */
        .social-icons {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
        }
        .social-icon {
          width: 40px; 
          height: 40px; 
          border-radius: 50%; 
          background: linear-gradient(135deg, #1E293B, #334155);
          display: flex; 
          align-items: center; 
          justify-content: center; 
          color: var(--white); 
          font-weight: 700; 
          cursor: pointer;
          transform: translateZ(15px);
          box-shadow: 
            0 4px 15px rgba(0,0,0,0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        .social-icon::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transform: rotate(45deg);
          transition: all 0.6s;
          opacity: 0;
        }
        .social-icon:hover {
          transform: translateY(-3px) translateZ(20px) scale(1.1);
          box-shadow: 
            0 8px 25px rgba(0,0,0,0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        .social-icon:hover::before {
          opacity: 1;
          top: -100%;
          left: -100%;
        }

        /* 3D Partner Button */
        .partner-btn {
          background: linear-gradient(135deg, var(--primary-blue), var(--bright-blue));
          color: var(--white);
          padding: 12px 20px;
          border-radius: 100px;
          border: none;
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
          transform: translateZ(15px);
          box-shadow: 
            0 4px 15px rgba(0, 90, 226, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        .partner-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s;
        }
        .partner-btn:hover {
          transform: translateY(-2px) translateZ(20px) scale(1.05);
          box-shadow: 
            0 8px 25px rgba(0, 90, 226, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }
        .partner-btn:hover::before {
          left: 100%;
        }

        /* Floating Elements */
        .floating-element {
          position: absolute;
          opacity: 0.03;
          pointer-events: none;
          animation: float 6s ease-in-out infinite;
        }
        .floating-element:nth-child(1) {
          top: 10%;
          left: 5%;
          width: 60px;
          height: 60px;
          animation-delay: 0s;
        }
        .floating-element:nth-child(2) {
          top: 60%;
          right: 8%;
          width: 40px;
          height: 40px;
          animation-delay: 2s;
        }
        .floating-element:nth-child(3) {
          bottom: 15%;
          left: 15%;
          width: 80px;
          height: 80px;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) translateZ(0) rotate(0deg); }
          50% { transform: translateY(-20px) translateZ(0) rotate(180deg); }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .social-icons {
            justify-content: center;
          }
          .partner-btn {
            width: 100%;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .footer {
            padding: 60px 0 40px;
          }
          .footer-grid {
            gap: 24px;
          }
        }
      `}} />

      <footer className="footer">
        {/* Floating 3D Elements */}
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>

        <div className="footer-grid">
          <div>
            <div className="footer-logo">Crestcode USA</div>
            <p className="body-text" style={{fontSize: '0.875rem', lineHeight: 1.6, color: '#9CA3AF'}}>
              Building the next generation of digital products and ventures.
            </p>
          </div>
          <div className="footer-links">
            <h5 className="footer-heading">Company</h5>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h5 className="footer-heading">Services</h5>
            <ul>
              <li><a href="#mvp">MVP Development</a></li>
              <li><a href="#design">Product Design</a></li>
              <li><a href="#consulting">Technical Consulting</a></li>
            </ul>
          </div>
          <div className="footer-links">
             <h5 className="footer-heading">Connect</h5>
             <div className="social-icons">
                <div className="social-icon">in</div>
                <div className="social-icon">X</div>
             </div>
             <p style={{fontSize: '0.875rem', color: '#9CA3AF', marginBottom: '16px'}}>Contact Us</p>
             <button className="partner-btn">Partner With Us</button>
          </div>
        </div>
      </footer>
    </>
  );
}
