'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContent } from '@/context/ContentContext';
import EditableText from '@/components/pages/admin/EditableText';
import localConfig from '@/shared/config.json';

export default function Header(props: any) {
  const { content } = useContent();
  const globalContent = content?.global || (localConfig as any).global;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDarkBg, setIsDarkBg] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sy = window.scrollY;
          const progress = Math.min(Math.max(sy / 100, 0), 1);
          setScrollProgress(progress);
          setIsScrolled(sy > 20);

          const darkSelectors = [
            '.section-dark',
            '.bg-dark',
            '.btn-primary',
            '.solving-card',
            '.process-card',
            '.card-dark',
            '.metrics-bg-section',
            '.footer',
            '.sys-card-small',
            '.founder-quote-card',
            '[style*="background-color: #0A0F1C"]',
            '[style*="background-color: var(--bg-dark)"]',
            '[style*="background-color: #005AE2"]',
            '[style*="background-color: var(--primary-blue)"]',
            '[style*="background-color: #040d1f"]',
          ];
          const darkElements = document.querySelectorAll(darkSelectors.join(', '));
          let foundDark = false;
          darkElements.forEach((el: any) => {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 80 && rect.bottom >= 0) foundDark = true;
          });
          setIsDarkBg(foundDark);

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    { label: 'Founder', href: '/founder' },
    { label: 'Studio', href: '/studio' },
    { label: 'Investors', href: '/investors' },
    { label: 'Resources', href: '/resources' },
  ];

  if (!globalContent) return null; // should never happen now with localConfig fallback

  // Progressive scroll interpolation metrics (0.0 at top -> 1.0 at 100px)
  const p = scrollProgress;
  const currentTop = p * 8;
  const currentRadius = p * 12;
  const currentPaddingY = 10 - (p * 4);
  const currentLogoHeight = 68 - (p * 14);
  const widthVal = p === 0 ? '100%' : `calc(100% - ${p * 48}px)`;
  const shadowAlpha1 = p * 0.05;
  const shadowAlpha2 = p * 0.03;
  const bgAlpha = 0.98 - (p * 0.04);
  const borderAlpha = 0.04 + (p * 0.02);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&display=swap');

        /* ─── Reset & Base ─────────────────────────────────── */
        *, *::before, *::after { box-sizing: border-box; }

        /* ─── Navbar Wrapper ───────────────────────────────── */
        .navbar-wrapper {
          position: fixed;
          left: 50%;
          transform: translateX(-50%) translateZ(0);
          -webkit-transform: translateX(-50%) translateZ(0);
          will-change: transform, top, width, padding, background-color, box-shadow, border-radius;
          z-index: 1000;
          background-clip: padding-box;
        }

        /* ─── Navbar Inner ─────────────────────────────────── */
        .navbar {
          background: transparent;
          color: #0A0F1C;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0px 28px;
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          gap: 24px;
        }

        /* ─── Brand ────────────────────────────────────────── */
        .navbar-brand {
          font-weight: 800;
          font-size: 1.15rem;
          color: #0A0F1C;
          text-decoration: none;
          letter-spacing: -0.04em;
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
          flex-shrink: 0;
          cursor: pointer;
        }

        .header-logo {
          width: auto;
          object-fit: contain;
          cursor: pointer;
          will-change: height;
        }

        .mobile-menu-logo {
          height: 58px;
          width: auto;
          object-fit: contain;
          cursor: pointer;
        }

        /* ─── Nav Links (desktop) ──────────────────────────── */
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 36px;
          flex: 1;
          justify-content: center;
        }

        .navbar-links a,
        .dropdown-toggle {
          color: #64748B;
          text-decoration: none;
          padding: 8px 0;
          transition: color 0.3s ease;
          background: none;
          border: none;
          font-family: var(--font-inter), 'Inter', sans-serif;
          font-size: 0.95rem; /* comfortable executive font size */
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          cursor: pointer;
          outline: none !important;
          white-space: nowrap;
        }

        .navbar-links a:hover,
        .dropdown-toggle:hover {
          color: #0A0F1C;
        }

        .navbar-links a.active-link {
          color: #0A0F1C !important;
        }

        /* ─── Dropdown Container ───────────────────────────── */
        .dropdown {
          position: static;
          display: inline-block;
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

        /* ─── Dropdown Menu (full-width bar) ───────────────── */
        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          background: #ffffff;
          border-top: 1px solid rgba(0,0,0,0.08);
          border-bottom: 1px solid rgba(0,0,0,0.08);
          padding: 28px 0;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          gap: 8px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(8px);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 20px 40px rgba(0,0,0,0.06);
          z-index: 999;
        }

        .dropdown:hover .dropdown-menu,
        .dropdown.open .dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        /* ─── Each Dropdown Card ───────────────────────────── */
        .dropdown-item {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 12px 16px;
          border-radius: 10px;
          text-decoration: none;
          color: #0A0F1C;
          transition: background 0.2s ease;
          width: 200px;
          gap: 0;
        }

        .dropdown-item:hover {
          background: rgba(0, 90, 226, 0.04);
        }

        /* ─── Icon Box (sharp, like reference image) ───────── */
        .dropdown-icon-box {
          width: 44px;
          height: 44px;
          background: #F1F5F9;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          color: #0A0F1C;
          flex-shrink: 0;
        }

        .dropdown-item:hover .dropdown-icon-box {
          background: #E8F0FD;
          color: #005AE2;
        }

        .dropdown-item-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: #0A0F1C;
          margin-bottom: 3px;
          line-height: 1.2;
        }

        .dropdown-item-desc {
          font-size: 0.75rem;
          color: #64748B;
          line-height: 1.4;
          font-weight: 400;
        }

        /* ─── CTA Button ───────────────────────────────────── */
        .btn-nav-wrapper {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-shrink: 0;
        }

        .nav-divider {
          height: 26px;
          width: 1px;
          background-color: rgba(0,0,0,0.1);
        }

        .btn-nav {
          padding: 11px 26px;
          font-size: 15px;
          border-radius: 100px;
          background: #005AE2;
          border: none;
          color: white;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(0,90,226,0.2);
          white-space: nowrap;
          font-family: var(--font-manrope), 'Manrope', sans-serif;
        }

        .btn-nav:hover {
          transform: scale(1.04);
          background: #004ac2;
          box-shadow: 0 6px 18px rgba(0,90,226,0.3);
        }

        /* ─── Hamburger ────────────────────────────────────── */
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 6px;
          cursor: pointer;
          padding: 8px;
          z-index: 1002;
        }

        .hamburger span {
          display: block;
          width: 26px;
          height: 2px;
          background: #0A0F1C;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .hamburger.open span { background: #0F172A; }
        .hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
        .hamburger.open span:nth-child(2) { opacity: 0; width: 0; }
        .hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

        /* ─── Mobile Full-screen Menu ──────────────────────── */
        .mobile-menu {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
          z-index: 1001;
          transform: translateY(-100%);
          transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 100px 32px 40px;
          overflow-y: auto;
        }

        .mobile-menu.open {
          transform: translateY(0);
        }

        .mobile-menu-header {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          padding: 20px 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(0,0,0,0.08);
        }

        .menu-section {
          margin-bottom: 40px;
        }

        .menu-label {
          font-size: 0.7rem;
          font-weight: 800;
          color: rgba(0,0,0,0.4);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 20px;
          display: block;
        }

        .menu-links {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .menu-link {
          font-family: 'Inter', sans-serif;
          font-size: clamp(1.1rem, 4vw, 1.4rem);
          font-weight: 700;
          color: #0F172A;
          text-decoration: none;
          line-height: 1.4;
          transition: opacity 0.25s ease;
          text-transform: none;
          letter-spacing: -0.01em;
        }

        .menu-link:hover { opacity: 0.6; }
        .menu-link.active { color: #005AE2; }

        .menu-link-sub {
          font-family: 'Outfit', 'Inter', sans-serif;
          font-size: clamp(1.2rem, 4vw, 1.6rem);
          font-weight: 700;
          color: rgba(0,0,0,0.55);
          text-decoration: none;
          transition: opacity 0.25s ease;
          text-transform: uppercase;
          padding-left: 16px;
        }

        .menu-link-sub:hover { opacity: 0.5; }

        .menu-contact-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-top: 8px;
        }

        .menu-contact-link {
          color: #0F172A;
          font-size: 1.1rem;
          font-weight: 600;
          text-decoration: none;
          opacity: 0.85;
          transition: opacity 0.2s ease;
        }

        .menu-contact-link:hover { opacity: 1; }

        /* ─── RESPONSIVE BREAKPOINTS ───────────────────────── */

        /* Large tablets / small laptops */
        @media (max-width: 1024px) {
          .navbar-wrapper { padding: 8px 0; }
          .navbar-wrapper.scrolled { width: calc(100% - 32px); top: 8px; border-radius: 12px; padding: 5px 0; }
          .navbar { padding: 8px 20px; gap: 16px; }
          .navbar-links { gap: 24px; }
          .navbar-links a, .dropdown-toggle { font-size: 0.9rem; }
          .btn-nav { padding: 10px 22px; font-size: 14.5px; }
          .header-logo { height: 56px !important; }
          .navbar-wrapper.scrolled .header-logo { height: 46px !important; }
          .brand-title-text { font-size: 1.02rem !important; }
        }

        /* Tablets – hide desktop nav, show hamburger */
        @media (max-width: 768px) {
          .navbar-wrapper { padding: 6px 0; }
          .navbar-wrapper.scrolled { width: calc(100% - 24px); top: 6px; border-radius: 10px; padding: 5px 0; }
          .navbar { padding: 6px 16px; }
          .navbar-links { display: none !important; }
          .nav-divider { display: none; }
          .btn-nav { display: none; }
          .hamburger { display: flex !important; }
          .header-logo { height: 50px !important; }
          .navbar-wrapper.scrolled .header-logo { height: 42px !important; }
          .brand-title-text { font-size: 0.95rem !important; }
        }

        /* Mobile phones */
        @media (max-width: 480px) {
          .navbar-wrapper { padding: 5px 0; }
          .navbar-wrapper.scrolled { width: calc(100% - 16px); top: 4px; border-radius: 8px; padding: 4px 0; }
          .navbar { padding: 4px 12px; }
          .mobile-menu { padding: 80px 20px 32px; }
          .mobile-menu-header { padding: 14px 16px; }
          .menu-section { margin-bottom: 28px; }
          .header-logo { height: 44px !important; }
          .navbar-wrapper.scrolled .header-logo { height: 38px !important; }
          .brand-title-text { font-size: 0.9rem !important; }
        }

        /* Small phones */
        @media (max-width: 360px) {
          .mobile-menu { padding: 80px 16px 28px; }
          .brand-title-text { font-size: 0.84rem !important; }
        }

        /* Ensure dropdown-menu is also responsive on mid-size screens */
        @media (max-width: 1024px) {
          .dropdown-menu { padding: 20px 0; gap: 4px; }
          .dropdown-item { width: 180px; padding: 10px 12px; }
        }
      `}} />

      <div
        className={`navbar-wrapper${isScrolled ? ' scrolled' : ''}`}
        style={{
          top: `${currentTop}px`,
          width: widthVal,
          maxWidth: p === 0 ? '100%' : '1280px',
          borderRadius: `${currentRadius}px`,
          padding: `${currentPaddingY}px 0`,
          backgroundColor: '#FFFFFF',
          background: `rgba(255, 255, 255, ${bgAlpha})`,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: `1px solid rgba(0, 0, 0, ${borderAlpha})`,
          borderBottom: `1px solid rgba(0, 0, 0, ${borderAlpha + 0.02})`,
          boxShadow: p > 0 ? `0 ${p * 4}px ${p * 20}px rgba(15, 23, 42, ${shadowAlpha1}), 0 1px 6px rgba(15, 23, 42, ${shadowAlpha2})` : 'none',
        }}
      >
        <nav className="navbar">
          {/* Left: Brand / Logo + Title */}
          <div className="navbar-left" style={{ display: 'flex', alignItems: 'center', flex: '1 1 0%', justifyContent: 'flex-start', minWidth: 0 }}>
            <Link href="/" className="navbar-brand">
              <img
                src="/CC_US_Logo_-_Black_Patch-removebg-preview.png"
                alt="Crestcode Logo"
                className="header-logo"
                style={{
                  height: `${currentLogoHeight}px`,
                  marginRight: '-4px',
                }}
              />
              <span className="brand-title-text" style={{
                fontFamily: "'Plus Jakarta Sans', var(--font-manrope), 'Manrope', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(0.85rem, 1.1vw, 1.05rem)',
                color: '#0A0F1C',
                letterSpacing: '-0.04em',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}>
                CrestCode Venture Studio
              </span>
            </Link>
          </div>

          {/* Center: Desktop Nav Links */}
          <div className="navbar-links" style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px' }}>
            {navItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)) ? 'active-link' : ''}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right: CTA + Hamburger */}
          <div className="navbar-right" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flex: '1 1 0%', gap: '16px' }}>
            <div className="btn-nav-wrapper">
              <div className="nav-divider" />
              <Link href="/contact">
                <button className="btn-nav">
                  <EditableText contentKey="global.header.cta" value={globalContent.header?.cta || "Contact Us"} />
                </button>
              </Link>
            </div>

            <div className={`hamburger ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
              <span />
              <span />
              <span />
            </div>
          </div>
        </nav>
      </div>

      {/* ── Mobile Full-Screen Menu ── */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <Link href="/" className="navbar-brand" onClick={toggleMenu}>
            <img src="/CC_US_Logo_-_Black_Patch-removebg-preview.png" alt="Logo" className="mobile-menu-logo" />
          </Link>
          <div className={`hamburger open`} onClick={toggleMenu}>
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="menu-section">
          <span className="menu-label">Menu</span>
          <div className="menu-links">
            {navItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className={`menu-link ${pathname === item.href ? 'active' : ''}`}
                onClick={toggleMenu}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="menu-section" style={{ marginBottom: 0 }}>
          <span className="menu-label">Contact</span>
          <div className="menu-contact-grid">
            <Link href="/contact" className="menu-contact-link" onClick={toggleMenu}>Email</Link>
            <Link href="https://www.linkedin.com/search/results/all/?keywords=crestcode%20technologies&origin=RICH_QUERY_SUGGESTION&spellCorrectionEnabled=false&heroEntityKey=urn%3Ali%3Aorganization%3A108093169&position=0" className="menu-contact-link" target="_blank">LinkedIn</Link>
          </div>
        </div>
      </div>
    </>
  );
}
