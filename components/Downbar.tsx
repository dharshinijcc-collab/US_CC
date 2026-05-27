'use client';

import React, { useState, useEffect } from 'react';

import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Briefcase, MessageSquare, ChevronUp, X, BookOpen, Layers, TrendingUp } from 'lucide-react';
import NextLink from 'next/link';

export default function Downbar() {
  const pathname = usePathname();
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const toggleSubmenu = (e: React.MouseEvent, label: string) => {
    e.preventDefault();
    if (activeSubmenu === label) {
      setIsSubmenuOpen(!isSubmenuOpen);
      if (!isSubmenuOpen) setActiveSubmenu(null);
    } else {
      setActiveSubmenu(label);
      setIsSubmenuOpen(true);
    }
  };

  const navItems = [
    { label: 'Founder', href: '/', icon: <Home size={20} /> },
    { label: 'Studio', href: '/studio', icon: <LayoutGrid size={20} />, hasSubmenu: true },
    { label: 'Investors', href: '/investors', icon: <TrendingUp size={20} /> },
    { label: 'Company', href: '/company', icon: <Briefcase size={20} /> },
    { label: 'Resources', href: '/resources', icon: <BookOpen size={20} />, hasSubmenu: true },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .downbar-container {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 40px);
          max-width: 400px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          display: none;
          justify-content: space-around;
          align-items: center;
          padding: 12px 8px;
          z-index: 2000;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

         @media (max-width: 1100px) {
          .downbar-container {
            display: flex;
          }
          body {
            padding-bottom: 100px !important;
          }
        }

        .downbar-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          font-size: 10px;
          font-weight: 600;
          transition: all 0.3s ease;
          position: relative;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 12px;
        }

        .downbar-item.active {
          color: #005AE2;
        }

        .downbar-item:active {
          transform: scale(0.9);
        }

        .submenu-overlay {
          position: fixed;
          bottom: 100px;
          left: 50%;
          transform: translateX(-50%) translateY(20px);
          width: calc(100% - 60px);
          max-width: 300px;
          background: rgba(30, 41, 59, 0.95);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 12px;
          z-index: 1999;
          opacity: 0;
          visibility: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
        }

        .submenu-overlay.open {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0);
        }

        .submenu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          color: #FFFFFF;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          border-radius: 12px;
          transition: background 0.2s;
        }

        .submenu-item:active {
          background: rgba(255, 255, 255, 0.1);
        }

        .submenu-item-icon {
          color: #005AE2;
        }

        .indicator {
          position: absolute;
          top: -4px;
          right: 4px;
          width: 6px;
          height: 6px;
          background: #005AE2;
          border-radius: 50%;
          display: none;
        }

        .downbar-item.active .indicator {
          display: block;
        }
      `}} />

      <div className={`submenu-overlay ${isSubmenuOpen ? 'open' : ''}`}>
        {activeSubmenu === 'Studio' && (
          <>
            <NextLink href="/studio" className="submenu-item" onClick={() => setIsSubmenuOpen(false)}>
              <div className="submenu-item-icon"><Layers size={18} /></div>
              <span>Studio Overview</span>
            </NextLink>
            <NextLink href="/playbook" className="submenu-item" onClick={() => setIsSubmenuOpen(false)}>
              <div className="submenu-item-icon"><BookOpen size={18} /></div>
              <span>Our Methodology</span>
            </NextLink>
          </>
        )}
        {activeSubmenu === 'Resources' && (
          <>
            <NextLink href="/resources/tools" className="submenu-item" onClick={() => setIsSubmenuOpen(false)}>
              <div className="submenu-item-icon"><TrendingUp size={18} /></div>
              <span>Studio Tools</span>
            </NextLink>
            <NextLink href="/blogs" className="submenu-item" onClick={() => setIsSubmenuOpen(false)}>
              <div className="submenu-item-icon"><BookOpen size={18} /></div>
              <span>Insights & Blog</span>
            </NextLink>
            <NextLink href="/resources/events" className="submenu-item" onClick={() => setIsSubmenuOpen(false)}>
              <div className="submenu-item-icon"><MessageSquare size={18} /></div>
              <span>Events</span>
            </NextLink>
          </>
        )}
      </div>

      <div className="downbar-container">
        {navItems.map((item) => (
          item.hasSubmenu ? (
            <button
              key={item.label}
              className={`downbar-item ${pathname.startsWith(item.href) ? 'active' : ''}`}
              onClick={(e) => toggleSubmenu(e, item.label)}
            >
              {isSubmenuOpen && activeSubmenu === item.label ? <X size={20} /> : item.icon}
              <span>{item.label}</span>
              <div className="indicator"></div>
            </button>
          ) : (
            <NextLink 
              key={item.label} 
              href={item.href} 
              className={`downbar-item ${pathname === item.href ? 'active' : ''}`}
              onClick={() => setIsSubmenuOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
              <div className="indicator"></div>
            </NextLink>
          )
        ))}
      </div>
    </>
  );
}
