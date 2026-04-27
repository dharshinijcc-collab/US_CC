import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .navbar-wrapper { 
          position: fixed; 
          top: 24px; 
          left: 0; 
          width: 100%; 
          display: flex; 
          justify-content: center; 
          z-index: 1000; 
          padding: 0 24px; 
          transition: all 0.3s ease;
        }
        
        @media (max-width: 768px) {
          .navbar-wrapper {
            top: 12px;
            padding: 0 12px;
          }
        }

        .navbar { 
          background: linear-gradient(135deg, rgba(10, 15, 28, 0.95), rgba(10, 15, 28, 0.85));
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white; 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          padding: 8px 8px 8px 32px; 
          width: 100%; 
          max-width: 1152px; 
          border-radius: 100px; 
          box-shadow: 
            0 10px 30px -10px rgba(0,0,0,0.4),
            0 0 0 1px rgba(255, 255, 255, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 8px 8px 8px 20px;
            border-radius: 40px;
          }
        }

        .navbar-brand { 
          font-weight: 800; 
          font-size: 1rem; 
          background: linear-gradient(135deg, #ffffff, #e0e7ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          white-space: nowrap;
          text-decoration: none;
        }

        .navbar-links { 
          display: none; 
          align-items: center;
        }
        
        @media(min-width: 769px) { 
          .navbar-links { 
            display: flex; 
            gap: 32px; 
            font-size: 0.875rem; 
            font-weight: 600; 
          } 
        }

        .navbar-links a, .dropdown-toggle { 
          color: #94A3B8; 
          text-decoration: none; 
          padding: 4px 0; 
          transition: all 0.3s ease;
          background: none;
          border: none;
          font-family: inherit;
          font-size: inherit;
          font-weight: inherit;
          cursor: pointer;
        }

        .navbar-links a:hover, .dropdown-toggle:hover { 
          color: white;
        }

        .navbar-links a.active-link { 
          color: white !important; 
          border-bottom: 2px solid #005AE2; 
        }
        
        .dropdown { position: relative; display: inline-block; }
        .dropdown-menu { 
          position: absolute; 
          top: 100%; 
          left: 50%;
          transform: translateX(-50%) translateY(10px);
          background: #0F172A;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; 
          padding: 8px 0; 
          min-width: 180px; 
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }
        .dropdown:hover .dropdown-menu { 
          opacity: 1; 
          visibility: visible; 
          transform: translateX(-50%) translateY(16px);
        }
        .dropdown-item { 
          display: block; 
          padding: 10px 20px; 
          color: #94A3B8; 
          text-decoration: none; 
          transition: all 0.2s ease;
          font-size: 0.85rem;
          font-weight: 500;
        }
        .dropdown-item:hover { 
          color: white; 
          background: rgba(255,255,255,0.05);
        }

        .btn-nav { 
          padding: 10px 24px; 
          font-size: 14px; 
          border-radius: 100px; 
          background: #005AE2;
          border: none;
          color: white;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 90, 226, 0.3);
        }
        .btn-nav:hover {
          transform: translateY(-2px);
          background: #004ac2;
          box-shadow: 0 6px 20px rgba(0, 90, 226, 0.4);
        }

        /* Hamburger Menu */
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          padding: 10px;
          z-index: 1001;
        }
        
        .hamburger span {
          display: block;
          width: 24px;
          height: 2px;
          background: white;
          transition: all 0.3s ease;
          border-radius: 2px;
        }

        @media (max-width: 768px) {
          .hamburger { display: flex; }
          .navbar-links { display: none; }
          .btn-nav-desktop { display: none; }
        }

        .hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

        /* Mobile Menu Overlay */
        .mobile-menu {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: #0A0F1C;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 24px;
          z-index: 1000;
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .mobile-menu.open {
          transform: translateX(0);
        }

        .mobile-link {
          color: white;
          font-size: 1.5rem;
          font-weight: 700;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        
        .mobile-link:hover {
          color: #005AE2;
        }

        .mobile-link.active-link {
          color: #005AE2;
        }
        
        .mobile-sublinks {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        
        .mobile-sublink {
          color: #94A3B8;
          font-size: 1rem;
          font-weight: 500;
          text-decoration: none;
        }
      `}} />

      <div className="navbar-wrapper">
        <nav className="navbar">
          <Link to="/" className="navbar-brand">Crestcode Product Studio</Link>
          
          <div className="navbar-links">
            <Link to="/" className={location.pathname === '/' ? 'active-link' : ''}>Home</Link>
            <Link to="/studio" className={location.pathname === '/studio' ? 'active-link' : ''}>Studio</Link>
            <Link to="/careers" className={location.pathname === '/careers' ? 'active-link' : ''}>Careers</Link>
            <div className="dropdown">
              <button className="dropdown-toggle">Our Model &#x25BC;</button>
              <div className="dropdown-menu">
                <Link to="/faq" className="dropdown-item">FAQ</Link>
                <Link to="/contact" className="dropdown-item">Contact</Link>
                <Link to="/privacy" className="dropdown-item">Privacy Policy</Link>
                <Link to="/terms" className="dropdown-item">Terms of Use</Link>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link to="/contact" className="btn-nav-desktop">
              <button className="btn-nav">Enquire</button>
            </Link>
            
            <div className={`hamburger ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </nav>
      </div>

      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <Link to="/" className={`mobile-link ${location.pathname === '/' ? 'active-link' : ''}`}>Home</Link>
        <Link to="/studio" className={`mobile-link ${location.pathname === '/studio' ? 'active-link' : ''}`}>Studio</Link>
        <Link to="/careers" className={`mobile-link ${location.pathname === '/careers' ? 'active-link' : ''}`}>Careers</Link>
        <Link to="/contact" className={`mobile-link ${location.pathname === '/contact' ? 'active-link' : ''}`}>Contact</Link>
        
        <div className="mobile-sublinks">
          <Link to="/faq" className="mobile-sublink">FAQ</Link>
          <Link to="/privacy" className="mobile-sublink">Privacy Policy</Link>
          <Link to="/terms" className="mobile-sublink">Terms of Use</Link>
        </div>
      </div>
    </>
  );
}

