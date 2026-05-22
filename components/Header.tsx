
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContent } from '@/context/ContentContext';
import EditableText from '@/components/admin/EditableText';
import { ChevronDown, Wrench, BookOpen, CalendarDays } from 'lucide-react';

export default function Header(props: any) {
  const { content } = useContent();
  const globalContent = content?.global;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkBg, setIsDarkBg] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

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
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  useEffect(() => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Studio', href: '/studio' },
    { label: 'Investors', href: '/investors' },
    { label: 'Company', href: '/company' },
    {
      label: 'Resources',
      href: '/resources',
      dropdown: [
        {
          label: 'Tools',
          href: '/resources/tools',
          icon: 'wrench',
        },
        {
          label: 'Blogs',
          href: '/resources/blogs',
          icon: 'bookopen',
        },
        {
          label: 'Events',
          href: '/resources/events',
          icon: 'calendar',
        },
      ],
    },
  ];

  const getDropdownIcon = (icon: string) => {
    switch (icon) {
      case 'wrench':    return <Wrench size={20} strokeWidth={1.75} />;
      case 'bookopen':  return <BookOpen size={20} strokeWidth={1.75} />;
      case 'calendar':  return <CalendarDays size={20} strokeWidth={1.75} />;
      default:          return <Wrench size={20} strokeWidth={1.75} />;
    }
  };

  if (!globalContent) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        /* ─── Reset & Base ─────────────────────────────────── */
        *, *::before, *::after { box-sizing: border-box; }

        /* ─── Navbar Wrapper ───────────────────────────────── */
        .navbar-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          background: #ffffff;
          box-shadow: 0 1px 0 rgba(0,0,0,0.08);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* ─── Navbar Inner ─────────────────────────────────── */
        .navbar {
          background: transparent;
          color: #0A0F1C;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 40px;
          width: 100%;
          max-width: 1400px;
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
          gap: 10px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* ─── Nav Links (desktop) ──────────────────────────── */
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 32px;
          flex: 1;
          justify-content: center;
        }

        .navbar-links a,
        .dropdown-toggle {
          color: ${isDarkBg ? 'rgba(255,255,255,0.8)' : '#64748B'};
          text-decoration: none;
          padding: 8px 0;
          transition: color 0.3s ease;
          background: none;
          border: none;
          font-family: inherit;
          font-size: 0.8125rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          outline: none !important;
          white-space: nowrap;
        }

        .navbar-links a:hover,
        .dropdown-toggle:hover {
          color: ${isDarkBg ? '#ffffff' : '#0A0F1C'};
        }

        .navbar-links a.active-link {
          color: ${isDarkBg ? '#ffffff' : '#0A0F1C'} !important;
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
          height: 24px;
          width: 1px;
          background-color: ${isDarkBg ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'};
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
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(0,90,226,0.2);
          white-space: nowrap;
          font-family: inherit;
        }

        .btn-nav:hover {
          transform: scale(1.05);
          background: #004ac2;
          box-shadow: 0 8px 20px rgba(0,90,226,0.3);
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
          background: ${isDarkBg ? '#ffffff' : '#0A0F1C'};
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .hamburger.open span { background: #FFFFFF; }
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
          background: #0A0F1C;
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
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .menu-section {
          margin-bottom: 40px;
        }

        .menu-label {
          font-size: 0.7rem;
          font-weight: 800;
          color: rgba(255,255,255,0.35);
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
          font-family: 'Outfit', 'Inter', sans-serif;
          font-size: clamp(2rem, 7vw, 2.8rem);
          font-weight: 800;
          color: #FFFFFF;
          text-decoration: none;
          line-height: 1.15;
          transition: opacity 0.25s ease;
          text-transform: uppercase;
        }

        .menu-link:hover { opacity: 0.6; }
        .menu-link.active { color: #005AE2; }

        .menu-link-sub {
          font-family: 'Outfit', 'Inter', sans-serif;
          font-size: clamp(1.2rem, 4vw, 1.6rem);
          font-weight: 700;
          color: rgba(255,255,255,0.75);
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
          color: #FFFFFF;
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
          .navbar { padding: 12px 24px; gap: 16px; }
          .navbar-links { gap: 20px; }
          .navbar-links a, .dropdown-toggle { font-size: 0.75rem; }
          .btn-nav { padding: 9px 18px; font-size: 13px; }
        }

        /* Tablets – hide desktop nav, show hamburger */
        @media (max-width: 768px) {
          .navbar { padding: 12px 20px; }
          .navbar-links { display: none !important; }
          .nav-divider { display: none; }
          .btn-nav { display: none; }
          .hamburger { display: flex !important; }
        }

        /* Mobile phones */
        @media (max-width: 480px) {
          .navbar { padding: 10px 16px; }
          .navbar-brand { font-size: 0; } /* hide text, show logo only */
          .mobile-menu { padding: 90px 24px 40px; }
          .mobile-menu-header { padding: 16px 20px; }
          .menu-section { margin-bottom: 32px; }
        }

        /* Small phones */
        @media (max-width: 360px) {
          .mobile-menu { padding: 85px 20px 32px; }
        }

        /* Ensure dropdown-menu is also responsive on mid-size screens */
        @media (max-width: 1024px) {
          .dropdown-menu { padding: 20px 0; gap: 4px; }
          .dropdown-item { width: 180px; padding: 10px 12px; }
        }
      `}} />

      <div className="navbar-wrapper">
        <nav className="navbar">
          {/* Brand / Logo */}
          <Link href="/" className="navbar-brand">
            <img
              src="/crestcode-logo-transparent.png"
              alt="Crestcode Logo"
              style={{ height: '46px', width: 'auto', objectFit: 'contain' }}
            />
            <EditableText contentKey="global.header.brand" value="Crestcode Product Studio" variant="ghost" />
          </Link>

          {/* Desktop Nav Links */}
          <div className="navbar-links" ref={dropdownRef}>
            {navItems.map((item, idx) =>
              item.dropdown ? (
                <div
                  key={idx}
                  className={`dropdown ${openDropdown === idx ? 'open' : ''}`}
                  onMouseEnter={() => setOpenDropdown(idx)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className="dropdown-toggle"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenDropdown(openDropdown === idx ? null : idx);
                    }}
                  >
                    {item.label} <ChevronDown size={13} />
                  </button>

                  <div className="dropdown-menu">
                    {item.dropdown.map((s: any, sIdx: number) => (
                      <Link
                        key={sIdx}
                        href={s.href}
                        className={`dropdown-item ${pathname === s.href ? 'active-link' : ''}`}
                        onClick={() => setOpenDropdown(null)}
                      >
                        <div className="dropdown-icon-box">
                          {getDropdownIcon(s.icon)}
                        </div>
                        <div className="dropdown-item-title">{s.label}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={idx}
                  href={item.href}
                  className={pathname === item.href ? 'active-link' : ''}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* CTA + Hamburger */}
          <div className="btn-nav-wrapper">
            <div className="nav-divider" />
            <Link href="/contact">
              <button className="btn-nav">
                <EditableText contentKey="global.header.cta" value={globalContent.header.cta} />
              </button>
            </Link>

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
            <img src="/crestcode-logo-transparent.png" alt="Logo" style={{ height: '38px' }} />
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

            {/* Resources sub-links in mobile */}
            <div className="menu-link" style={{ pointerEvents: 'none', opacity: 0.5, fontSize: '1rem', letterSpacing: '0.1em' }}>
              Resources
            </div>
            {navItems.find(n => n.label === 'Resources')?.dropdown?.map((s: any, i: number) => (
              <Link
                key={i}
                href={s.href}
                className="menu-link-sub"
                onClick={toggleMenu}
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="menu-section" style={{ marginBottom: 0 }}>
          <span className="menu-label">Contact</span>
          <div className="menu-contact-grid">
            <Link href="/contact" className="menu-contact-link" onClick={toggleMenu}>Email</Link>
            <Link href="https://linkedin.com/company/crestcode" className="menu-contact-link" target="_blank">LinkedIn</Link>
          </div>
        </div>
      </div>
    </>
  );
}