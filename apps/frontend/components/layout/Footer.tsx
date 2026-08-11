'use client';

import React from 'react';
import Link from 'next/link';
import { useContent } from '@/context/ContentContext';
import EditableText from '@/components/pages/admin/EditableText';
import localConfig from '@/shared/config.json';

export default function Footer() {
  const { content } = useContent();
  const globalContent = content?.global || (localConfig as any).global;

  if (!globalContent) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        .cc-footer-wrapper {
          width: 100%;
          background-color: #0A0F1D;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .footer-grid-container {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1.1fr;
          gap: 48px;
          align-items: start;
          padding-bottom: 48px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .footer-link-hover {
          color: #CBD5E1 !important;
          text-decoration: none;
          font-size: 0.94rem;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .footer-link-hover:hover {
          color: #60A5FA !important;
        }

        .footer-btn-cta {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 12px 28px !important;
          border-radius: 100px !important;
          background-color: #005AE2 !important;
          color: #FFFFFF !important;
          font-weight: 700 !important;
          font-size: 0.9rem !important;
          text-decoration: none !important;
          box-shadow: 0 4px 14px rgba(0, 90, 226, 0.3) !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
          border: none !important;
        }

        .footer-btn-cta:hover {
          background-color: #004ac2 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 20px rgba(0, 90, 226, 0.45) !important;
        }

        @media (max-width: 768px) {
          .footer-grid-container {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
            text-align: left !important;
          }
          .footer-col-item {
            align-items: flex-start !important;
            text-align: left !important;
          }
          .footer-bottom-flex {
            flex-direction: column !important;
            gap: 12px !important;
            align-items: flex-start !important;
            text-align: left !important;
          }
        }
      `}} />

      <div className="cc-footer-wrapper">
        <footer style={{ backgroundColor: '#0A0F1D', color: '#FFFFFF', padding: '64px 0 32px 0', position: 'relative', overflow: 'hidden' }}>
          
          {/* Subtle Ambient Light Orb */}
          <div style={{ position: 'absolute', top: 0, right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1, boxSizing: 'border-box' }}>
            
            {/* ── Main Top Footer Grid ── */}
            <div className="footer-grid-container">
              
              {/* Column 1: Brand & Tagline */}
              <div className="footer-col-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', textDecoration: 'none', marginBottom: '16px' }}>
                  <img
                    src="/CC_US_Logo_-_Black_Patch-removebg-preview.png"
                    alt="CrestCode Logo"
                    style={{ height: '42px', width: 'auto', filter: 'brightness(0) invert(1)' }}
                  />
                  <span style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '1.25rem', fontFamily: "'Manrope', sans-serif", letterSpacing: '-0.02em' }}>
                    CrestCode
                  </span>
                </Link>
                <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: 1.65, maxWidth: '320px', margin: 0, fontWeight: 500 }}>
                  <EditableText
                    contentKey="global.footer.tagline"
                    value={globalContent.footer?.tagline || "Building the next generation of digital infrastructure and consumer ventures."}
                  />
                </p>
              </div>

              {/* Column 2: Company Navigation Links */}
              <div className="footer-col-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <h5 style={{ color: '#005AE2', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '20px', fontFamily: "'Manrope', sans-serif" }}>
                  COMPANY
                </h5>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <li>
                    <Link href="/about" className="footer-link-hover">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/blogs" className="footer-link-hover">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/careers" className="footer-link-hover">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="footer-link-hover">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: Connect & Partner CTA */}
              <div className="footer-col-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <h5 style={{ color: '#005AE2', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '20px', fontFamily: "'Manrope', sans-serif" }}>
                  CONNECT
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
                  
                  {/* Social Icon + Contact Link */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <Link
                      href="https://www.linkedin.com/search/results/all/?keywords=crestcode%20technologies&origin=RICH_QUERY_SUGGESTION&spellCorrectionEnabled=false&heroEntityKey=urn%3Ali%3Aorganization%3A108093169&position=0"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: '#1E293B',
                        color: '#005AE2',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                      }}
                      aria-label="LinkedIn"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                      </svg>
                    </Link>
                    <Link href="/contact#form-section" className="footer-link-hover">
                      Contact Us
                    </Link>
                  </div>

                  {/* Primary Action CTA Button */}
                  <div style={{ marginTop: '8px' }}>
                    <Link href="/contact#form-section" className="footer-btn-cta">
                      Partner With Us
                    </Link>
                  </div>

                </div>
              </div>

            </div>

            {/* ── Bottom Bar: Copyright & Privacy ── */}
            <div className="footer-bottom-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <p style={{ color: '#64748B', fontSize: '0.88rem', margin: 0, fontWeight: 500 }}>
                &copy; {new Date().getFullYear()} CrestCode Product Studio. All rights reserved.
              </p>
              <Link href="/privacy" className="footer-link-hover" style={{ fontSize: '0.88rem' }}>
                Privacy Policy
              </Link>
            </div>

          </div>
        </footer>
      </div>
    </>
  );
}
