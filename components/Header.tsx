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
  const pathname = usePathname();

  if (!globalContent) return null;

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

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
          background: #0A0F1C;
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
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
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
          font-size: 1.25rem; 
          color: white;
          text-decoration: none;
          flex: 1;
          letter-spacing: -0.02em;
          display: flex;
          align-items: center;
          white-space: nowrap;
        }

        .navbar-links { 
          display: none; 
          align-items: center;
          justify-content: center;
          flex: 2;
          gap: 32px;
        }
        
        @media(min-width: 769px) { 
          .navbar-links { display: flex; } 
        }

        .navbar-links a, .dropdown-toggle { 
          color: #94A3B8; 
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
          color: white;
        }

        .navbar-links a.active-link { 
          color: white !important; 
          font-weight: 800;
        }
        
        .dropdown { position: relative; display: inline-block; }
        .dropdown-menu { 
          position: absolute; 
          top: calc(100% + 15px); 
          left: 50%;
          transform: translateX(-50%) translateY(10px);
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px; 
          padding: 16px; 
          min-width: 220px; 
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .dropdown:hover .dropdown-menu { 
          opacity: 1; 
          visibility: visible; 
          transform: translateX(-50%) translateY(0);
        }
        .dropdown-item { 
          display: block; 
          padding: 14px 20px; 
          color: #94A3B8; 
          text-decoration: none; 
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 0.95rem;
          font-weight: 600;
          border-radius: 14px;
          text-align: center;
        }
        .dropdown-item:hover { 
          color: white; 
          background: rgba(255,255,255,0.1);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .btn-nav-wrapper { flex: 1; display: flex; justify-content: flex-end; }
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
          .btn-nav-wrapper { flex: 0; }
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
          <Link href="/" className="navbar-brand">
            <EditableText contentKey="global.header.brand" value="Crestcode Product Studio" />
          </Link>
          
          <div className="navbar-links">
            {globalContent.header.links.map((link, idx) => (
              <Link key={idx} href={link.href} className={pathname === link.href ? 'active-link' : ''}>
                <EditableText contentKey={`global.header.links.${idx}.name`} value={link.name} />
              </Link>
            ))}
            {Object.entries(globalContent.header.dropdowns).map(([key, dropdown]: [string, any], dIdx) => (
              <div className="dropdown" key={key}>
                <button className="dropdown-toggle">
                  <EditableText contentKey={`global.header.dropdowns.${key}.label`} value={dropdown.label} />
                </button>
                <div className="dropdown-menu">
                  {dropdown.links.map((link: any, idx: number) => (
                    <Link key={idx} href={link.href} className="dropdown-item">
                      <EditableText contentKey={`global.header.dropdowns.${key}.links.${idx}.name`} value={link.name} />
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
        {globalContent.header.links.map((link, idx) => (
          <Link key={idx} href={link.href} className={`mobile-link ${pathname === link.href ? 'active-link' : ''}`}>{link.name}</Link>
        ))}
        {Object.values(globalContent.header.dropdowns).map((dropdown: any) => 
          dropdown.links.map((link: any, idx: number) => (
            <Link key={idx} href={link.href} className={`mobile-link ${pathname === link.href ? 'active-link' : ''}`}>{link.name}</Link>
          ))
        )}
      </div>
    </>
  );
}
