'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContent } from '@/context/ContentContext';
import EditableText from '@/components/admin/EditableText';

export default function Header(props: any) {
  const { content } = useContent();
  const globalContent = content?.global;
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkBg, setIsDarkBg] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect and background detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Detect if header area overlaps a dark section or element
      const darkSelectors = [
        '.section-dark', 
        '.bg-dark', 
        '.btn-primary', 
        '.solving-card', 
        '.process-card',
        '.card-dark',
        '.metrics-bg-section',
        '.footer',
        '.sys-card-small', // Methodology cards
        '.founder-quote-card',
        '[style*="background-color: #0A0F1C"]',
        '[style*="background-color: var(--bg-dark)"]',
        '[style*="background-color: #005AE2"]',
        '[style*="background-color: var(--primary-blue)"]',
        '[style*="background-color: #040d1f"]'
      ];
      const darkElements = document.querySelectorAll(darkSelectors.join(', '));
      let foundDark = false;
      const headerTop = 0;
      const headerBottom = 80; // Detect anything within the first 80px of viewport

      darkElements.forEach((el: any) => {
        const rect = el.getBoundingClientRect();
        // Check if the element overlaps the header's vertical zone
        if (rect.top <= headerBottom && rect.bottom >= headerTop) {
          foundDark = true;
        }
      });
      setIsDarkBg(foundDark);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const checkMobile = () => {
      // Check physical screen width because viewport is forced to 1200
      setIsMobileDevice(window.screen.width < 1100 || (window.innerWidth < 1100 && window.innerWidth > 0));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  if (!globalContent) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .navbar-wrapper { 
          position: fixed; 
          top: ${isScrolled ? '0' : '8px'}; 
          left: 0; 
          width: 100%; 
          display: block; /* Change from flex to ensure width: 100% works predictably */
          z-index: 1000; 
          padding: ${isScrolled ? '0' : '0 12px'}; 
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* @media (max-width: 768px) {
          .navbar-wrapper {
            top: 4px;
            padding: 0 12px;
          }
        } */

        .navbar { 
          background: transparent;
          backdrop-filter: none;
          color: #0A0F1C; 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          padding: 12px 16px; 
          width: 100%; 
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .navbar { 
          background: transparent;
          backdrop-filter: none;
          color: #0A0F1C; 
          display: flex; 
          justify-content: space-between;
          align-items: center; 
          padding: 12px 16px; 
          width: 100%; 
          max-width: 1600px;
          margin: 0 auto;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* @media (max-width: 768px) {
          .navbar {
            padding: 10px 20px;
          }
        } */

        .navbar-brand { 
          font-weight: 800; 
          font-size: 1.15rem; 
          color: ${isDarkBg ? '#ffffff' : '#0A0F1C'};
          text-decoration: none;
          letter-spacing: -0.04em;
          display: flex;
          align-items: center;
          white-space: nowrap;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: ${isScrolled ? '0' : '1'};
          transform: ${isScrolled ? 'translateY(-10px)' : 'translateY(0)'};
          pointer-events: ${isScrolled ? 'none' : 'auto'};
          border: none;
          outline: none;
          background: transparent;
          padding: 0;
          margin: 0;
        }

        /* @media (max-width: 1200px) {
          .navbar-brand { font-size: 1.1rem; }
        } */

        .navbar-links { 
          display: flex; /* Always visible for website look */
          align-items: center;
          justify-content: center;
          background: ${isDarkBg ? 'rgba(255, 255, 255, 0.15)' : 'rgba(241, 245, 249, 0.9)'};
          padding: 8px 32px;
          border-radius: 100px;
          gap: 28px;
          border: 1px solid ${isDarkBg ? 'rgba(255, 255, 255, 0.1)' : 'rgba(203, 213, 225, 0.5)'};
          backdrop-filter: blur(16px);
          transition: all 0.3s ease;
          box-shadow: ${isScrolled ? '0 10px 30px -10px rgba(0,0,0,0.1)' : 'none'};
        }

        .navbar-links a, .dropdown-toggle { 
          color: ${isDarkBg ? 'rgba(255, 255, 255, 0.95)' : '#000000'}; 
          text-decoration: none; 
          padding: 8px 0; 
          transition: all 0.3s ease;
          background: none;
          border: none;
          font-family: inherit;
          font-size: 0.875rem; 
          font-weight: 600; 
          cursor: pointer;
          outline: none !important;
        }

        .navbar-links a:hover, .dropdown-toggle:hover { 
          color: #005AE2;
        }

        .navbar-links a.active-link { 
          color: #005AE2 !important; 
        }
        
        .dropdown { position: relative; display: inline-block; }
        .dropdown-menu { 
          position: absolute; 
          top: calc(100% + 15px); 
          left: 50%;
          transform: translateX(-50%) translateY(10px);
          background: ${isDarkBg ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.9)'};
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid ${isDarkBg ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
          border-radius: 20px; 
          padding: 12px; 
          min-width: 200px; 
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }
        .dropdown:hover .dropdown-menu { 
          opacity: 1; 
          visibility: visible; 
          transform: translateX(-50%) translateY(0);
        }
        .dropdown-item { 
          display: block; 
          padding: 12px 16px; 
          color: #000000; 
          text-decoration: none; 
          transition: all 0.2s ease;
          font-size: 0.9rem;
          font-weight: 600;
          border-radius: 12px;
          text-align: center;
        }
        .dropdown-item:hover { 
          color: #005AE2; 
          background: rgba(0, 0, 0, 0.08);
        }

        .btn-nav-wrapper { 
          display: flex; 
          justify-content: flex-end; 
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: ${isScrolled ? '0' : '1'};
          transform: ${isScrolled ? 'translateY(-10px)' : 'translateY(0)'};
          pointer-events: ${isScrolled ? 'none' : 'auto'};
        }
        .btn-nav { 
          padding: 12px 32px; 
          font-size: 15px; 
          border-radius: 100px; 
          background: #005AE2; /* Original Premium Blue */
          border: none;
          color: white;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(0, 90, 226, 0.2);
        }
        .btn-nav:hover {
          transform: scale(1.05);
          background: #004ac2;
          box-shadow: 0 8px 20px rgba(0, 90, 226, 0.3);
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
          background: ${isDarkBg ? '#ffffff' : '#0A0F1C'};
          transition: all 0.3s ease;
          border-radius: 2px;
        }

        /* Force Desktop Proportions Always */
        .navbar {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          padding: 12px 40px;
          min-width: 1200px;
        }

        .navbar-links { 
          display: ${isMobileDevice ? 'none' : 'flex'} !important;
          align-items: center;
          justify-content: center;
          background: ${isDarkBg ? 'rgba(255, 255, 255, 0.15)' : 'rgba(241, 245, 249, 0.9)'};
          padding: 8px 32px;
          border-radius: 100px;
          gap: 28px;
          border: 1px solid ${isDarkBg ? 'rgba(255, 255, 255, 0.1)' : 'rgba(203, 213, 225, 0.5)'};
          backdrop-filter: blur(16px);
          transition: all 0.3s ease;
          box-shadow: ${isScrolled ? '0 10px 30px -10px rgba(0,0,0,0.1)' : 'none'};
        }

        .btn-nav-desktop { 
          display: flex !important; /* Keep Contact button visible on mobile */
        }
        
        @media (max-width: 1200px) {
          .btn-nav { padding: 8px 20px; font-size: 13px; } /* Slightly smaller for mobile layout */
        }

        /* Symmetrical Brand/CTA widths to keep links centered */
        .navbar-brand {
          flex: 1;
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }

        .btn-nav-wrapper {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }

        /* Mobile Menu Redesign (Hexa Style) */
        .hamburger {
          display: ${isMobileDevice ? 'flex' : 'none'} !important;
          flex-direction: column;
          gap: 6px;
          cursor: pointer;
          padding: 8px;
          z-index: 1002;
          transition: all 0.3s ease;
        }
        .hamburger span {
          width: 28px;
          height: 2px;
          background-color: ${isDarkBg || isScrolled || isMenuOpen ? '#FFFFFF' : '#000000'};
          transition: all 0.3s ease;
        }

        .hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(6px, 6px); background-color: #FFFFFF; }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); background-color: #FFFFFF; }

        .mobile-menu {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: #0A0F1C;
          display: flex;
          flex-direction: column;
          z-index: 1001;
          transform: translateY(-100%);
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 100px 32px 40px;
          overflow-y: auto;
        }
        
        .mobile-menu.open {
          transform: translateY(0);
        }

        .menu-section {
          margin-bottom: 48px;
        }

        .menu-label {
          font-size: 0.75rem;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 24px;
          display: block;
        }

        .menu-links {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .menu-link {
          font-family: 'Outfit', 'Inter', sans-serif;
          font-size: 2.5rem;
          font-weight: 800;
          color: #FFFFFF;
          text-decoration: none;
          line-height: 1.1;
          transition: opacity 0.3s ease;
          text-transform: uppercase;
        }

        .menu-link:hover {
          opacity: 0.7;
        }

        .menu-link.active {
          color: #005AE2;
        }

        .menu-contact-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
          margin-top: 12px;
        }

        .menu-contact-link {
          color: #FFFFFF;
          font-size: 1.25rem;
          font-weight: 600;
          text-decoration: none;
          opacity: 0.9;
        }

        .mobile-menu-header {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          padding: 24px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}} />

      <div className="navbar-wrapper">
        <nav className="navbar">
          <Link href="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <img 
                src="/crestcode-logo-transparent.png" 
                alt="Crestcode Logo" 
                style={{ height: '50px', width: 'auto', objectFit: 'contain', position: 'relative', zIndex: 1 }} 
              />
            </div>
            <EditableText contentKey="global.header.brand" value="Crestcode Product Studio" variant="ghost" />
          </Link>
          
          <div className="navbar-links">
            {globalContent.header.links.map((link: any, idx: number) => (
              <Link key={idx} href={link.href} className={pathname === link.href ? 'active-link' : ''}>
                <EditableText contentKey={`global.header.links.${idx}.name`} value={link.name} />
              </Link>
            ))}

            {(Array.isArray(globalContent.header.dropdowns) 
              ? globalContent.header.dropdowns
              : Object.values(globalContent.header.dropdowns)
            ).map((dropdown: any, dIdx: number) => (
              <div className="dropdown" key={dIdx}>
                <Link href="#" className="dropdown-toggle" style={{ display: 'block', textDecoration: 'none' }}>
                  <EditableText 
                    contentKey={`global.header.dropdowns.${dIdx}.label`} 
                    value={dropdown.label} 
                  />
                </Link>
                <div className="dropdown-menu">
                  {dropdown.links.map((link: any, idx: number) => (
                    <Link key={idx} href={link.href} className={`dropdown-item ${pathname === link.href ? 'active-link' : ''}`}>
                      <EditableText 
                        contentKey={`global.header.dropdowns.${dIdx}.links.${idx}.name`}
                        value={link.name} 
                      />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="btn-nav-wrapper">
            <Link href="/contact" className="btn-nav-desktop">
              <button className="btn-nav">
                <EditableText contentKey="global.header.cta" value={globalContent.header.cta} />
              </button>
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
        <div className="mobile-menu-header">
          <Link href="/" className="navbar-brand" onClick={toggleMenu}>
            <img src="/crestcode-logo-transparent.png" alt="Logo" style={{ height: '40px' }} />
          </Link>
          <div className="hamburger open" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div className="menu-section">
          <span className="menu-label">Menu</span>
          <div className="menu-links">
            {globalContent.header.links.map((link: any, idx: number) => (
              <Link 
                key={idx} 
                href={link.href} 
                className={`menu-link ${pathname === link.href ? 'active' : ''}`}
                onClick={toggleMenu}
              >
                <EditableText contentKey={`global.header.links.${idx}.name`} value={link.name} />
              </Link>
            ))}

            {(Array.isArray(globalContent.header.dropdowns) 
              ? globalContent.header.dropdowns 
              : Object.values(globalContent.header.dropdowns)
            ).map((dropdown: any, dIdx: number) => (
              <React.Fragment key={dIdx}>
                <div className="menu-link" style={{ pointerEvents: 'none', opacity: 0.8 }}>
                  <EditableText contentKey={`global.header.dropdowns.${dIdx}.label`} value={dropdown.label} />
                </div>
                {dropdown.links.map((link: any, idx: number) => (
                  <Link 
                    key={`${dIdx}-${idx}`} 
                    href={link.href} 
                    className={`menu-link ${pathname === link.href ? 'active' : ''}`}
                    onClick={toggleMenu}
                    style={{ fontSize: '1.75rem', paddingLeft: '20px' }}
                  >
                    <EditableText contentKey={`global.header.dropdowns.${dIdx}.links.${idx}.name`} value={link.name} />
                  </Link>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="menu-section" style={{ marginBottom: 0 }}>
          <span className="menu-label">Contact</span>
          <div className="menu-contact-grid">
            <Link href="/contact" className="menu-contact-link" onClick={toggleMenu}>Email</Link>
            <Link href="https://linkedin.com/company/crestcode" className="menu-contact-link">LinkedIn</Link>
          </div>
        </div>
      </div>
    </>
  );
}
