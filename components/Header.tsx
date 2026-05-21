'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContent } from '@/context/ContentContext';
import EditableText from '@/components/admin/EditableText';
import { ChevronDown, RefreshCcw, TrendingUp, Rocket, Swords, Users } from 'lucide-react';

export default function Header(props: any) {
  const { content } = useContent();
  const globalContent = content?.global;
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkBg, setIsDarkBg] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Fixed nav items to ensure consistent menu structure
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Studio', href: '/studio' },
    { label: 'Investors', href: '/investors' },
    { label: 'Company', href: '/company' },
    { label: 'Resources', href: '/resources', dropdown: [
      { label: 'Tools', href: '/resources/tools', logo: '/images/logos/tools.svg' },
      { label: 'Blogs', href: '/resources/blogs', logo: '/images/logos/blogs.svg' },
      { label: 'Events', href: '/resources/events', logo: '/images/logos/events.svg' },
    ] }
  ];

  if (!globalContent) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .navbar-wrapper { 
          position: fixed; 
          top: 0; 
          left: 0; 
          width: 100%; 
          display: block;
          z-index: 1000; 
          padding: 0;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          background: #ffffff;
          box-shadow: 0 1px 0 rgba(0,0,0,0.08);
        }
        
        /* @media (max-width: 768px) {
          .navbar-wrapper {
            top: 4px;
            padding: 0 12px;
          }
        } */

        .navbar { 
          background: transparent;
          color: #0A0F1C; 
          display: grid; 
          grid-template-columns: auto minmax(520px, 1fr) auto; /* logo - menus - contact */
          align-items: center; 
          padding: 12px 24px; 
          width: 100%; 
          max-width: 1400px;
          margin: 0 auto;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          gap: 32px;
        }

        /* @media (max-width: 768px) {
          .navbar {
            padding: 10px 20px;
          }
        } */

        .navbar-brand { 
          font-weight: 800; 
          font-size: 1.15rem; 
          color: #0A0F1C;
          text-decoration: none;
          letter-spacing: -0.04em;
          display: flex;
          align-items: center;
          white-space: nowrap;
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
          justify-content: flex-end;
          background: transparent;
          padding: 8px 0;
          border-radius: 0;
          gap: 32px;
          border: none;
          backdrop-filter: none;
          transition: all 0.3s ease;
          box-shadow: none;
          margin-right: 32px;
          /* nudge menus slightly right for better visual balance */
          transform: translateX(18px);
        }

        .navbar-links a, .dropdown-toggle { 
          color: ${isDarkBg ? 'rgba(255, 255, 255, 0.8)' : '#64748B'}; 
          text-decoration: none; 
          padding: 8px 0; 
          transition: all 0.3s ease;
          background: none;
          border: none;
          font-family: inherit;
          font-size: 0.8125rem; 
          font-weight: 700; 
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          outline: none !important;
        }

        .navbar-links a:hover, .dropdown-toggle:hover { 
          color: ${isDarkBg ? '#ffffff' : '#0A0F1C'};
        }

        .navbar-links a.active-link { 
          color: ${isDarkBg ? '#ffffff' : '#0A0F1C'} !important; 
        }
        
        .dropdown { position: static; display: inline-block; }
        .dropdown-menu { 
          position: absolute; 
          top: 100%; 
          left: 0;
          transform: translateY(10px);
          background: #ffffff;
          border-top: 1px solid rgba(0,0,0,0.08);
          border-bottom: 1px solid rgba(0,0,0,0.08);
          border-left: none;
          border-right: none;
          border-radius: 0; 
          padding: 20px 0; 
          width: 100%; 
          box-shadow: 0 15px 30px rgba(0,0,0,0.05);
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          justify-content: center;
          align-items: flex-start;
          gap: 32px;
        }
        .dropdown:hover .dropdown-menu,
        .dropdown.open .dropdown-menu { 
          opacity: 1; 
          visibility: visible; 
          transform: translateY(0);
        }
        .dropdown-item { 
          display: flex; 
          flex-direction: row;
          align-items: center;
          padding: 10px 14px; 
          color: #0A0F1C; 
          text-decoration: none; 
          transition: all 0.18s ease;
          border-radius: 12px;
          text-align: left;
          width: 260px;
          gap: 12px;
          background: transparent;
        }
        .dropdown-item:hover { 
          background: rgba(0, 90, 226, 0.04);
          transform: translateY(-3px);
        }
        .dropdown-icon {
          width: 48px;
          height: 48px;
          background: #F8FAFC;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #0A0F1C;
          overflow: hidden;
          box-shadow: 0 4px 10px rgba(2,6,23,0.04);
        }
        .dropdown-title {
          font-size: 0.95rem;
          font-weight: 800;
          color: #0A0F1C;
          margin: 0;
        }
        .dropdown-desc {
          font-size: 0.8rem;
          color: #64748B;
          line-height: 1.3;
          font-weight: 500;
          margin: 0;
        }
        .dropdown-toggle {
          display: flex !important;
          align-items: center;
          gap: 6px;
        }
        .dropdown-toggle svg {
          transition: transform 0.3s ease;
        }
        .dropdown:hover .dropdown-toggle svg,
        .dropdown.open .dropdown-toggle svg {
          transform: rotate(180deg);
        }

        .btn-nav-wrapper { 
          display: flex; 
          justify-content: flex-end;
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

        /* Desktop layout: centered links with equal side spacing */
        .navbar {
          padding: 12px 40px;
        }

        .navbar-brand { justify-self: start; }
        .navbar-links { 
          display: ${isMobileDevice ? 'none' : 'flex'} !important;
          justify-self: center; /* center menus in wide middle column */
          align-items: center;
          background: transparent;
          padding: 8px 0;
          gap: 28px;
          transition: all 0.3s ease;
        }

        .btn-nav-wrapper { justify-self: end; }

        .btn-nav-desktop { 
          display: flex !important; /* Keep Contact button visible on mobile */
        }
        
        @media (max-width: 1200px) {
          .btn-nav { padding: 8px 20px; font-size: 13px; } /* Slightly smaller for mobile layout */
        }

        /* Symmetrical Brand/CTA widths to keep links centered */
        .navbar-brand {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex: 1;
        }

        .btn-nav-wrapper {
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
          
          <div className="navbar-links" ref={dropdownRef}>
            {navItems.map((item, idx) => (
              item.dropdown ? (
                <div key={idx} className={`dropdown ${openDropdown === idx ? 'open' : ''}`}>
                  <button
                    className="dropdown-toggle"
                    onClick={(e) => { e.preventDefault(); setOpenDropdown(openDropdown === idx ? null : idx); }}
                  >
                    {item.label} <ChevronDown size={14} />
                  </button>
                  <div className="dropdown-menu">
                    {item.dropdown.map((s, sIdx) => (
                      <Link
                        key={sIdx}
                        href={s.href}
                        className={`dropdown-item ${pathname === s.href ? 'active-link' : ''}`}
                        onClick={() => setOpenDropdown(null)}
                      >
                        <div className="dropdown-icon">
                          {s.logo ? (
                            <img src={s.logo} alt={`${s.label} logo`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          ) : (
                            <RefreshCcw size={18} />
                          )}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <div className="dropdown-title">{s.label}</div>
                          {s.desc && <div className="dropdown-desc">{s.desc}</div>}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link key={idx} href={item.href} className={pathname === item.href ? 'active-link' : ''}>
                  {item.label}
                </Link>
              )
            ))}
          </div>

          <div className="btn-nav-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div style={{ height: '24px', width: '1px', backgroundColor: isDarkBg ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }}></div>
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
