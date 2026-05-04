'use client';

import React from 'react';
import Link from 'next/link';
import { useContent } from '@/context/ContentContext';
import EditableText from '@/components/admin/EditableText';

export default function Footer() {
  const { content } = useContent();
  const globalContent = content?.global;

  if (!globalContent) return null;
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .cc-footer-wrapper .footer { 
          background-color: var(--bg-dark, #0A0F1C); 
          color: #9CA3AF; 
          padding: 80px 0; 
          font-size: clamp(0.875rem, 1.5vw, 1rem); 
          font-weight: 500;
        }
        .cc-footer-wrapper .footer-container { 
          max-width: 1200px; 
          margin: 0 auto; 
          padding: 0 24px; 
          display: grid; 
          grid-template-columns: repeat(4, 1fr); 
          gap: 64px; 
          position: relative;
          z-index: 1;
        }
        .cc-footer-wrapper .footer-logo { 
          color: var(--white, #FFFFFF); 
          font-weight: 800; 
          font-size: clamp(1.125rem, 2.5vw, 1.25rem); 
          margin-bottom: 16px; 
          letter-spacing: -0.02em; 
        }
        .cc-footer-wrapper .footer-tagline { 
          line-height: 1.6; 
          max-width: 250px; 
          margin: 0;
        }
        .cc-footer-wrapper .footer-heading { 
          color: var(--white, #FFFFFF); 
          font-weight: 700; 
          margin-bottom: 24px; 
          font-size: 1rem; 
        }
        .cc-footer-wrapper .footer-links-group ul { 
          list-style: none; 
          padding: 0; 
          margin: 0; 
        }
        .cc-footer-wrapper .footer-links-group li { 
          margin-bottom: 20px; 
        }
        .cc-footer-wrapper .footer-links-group a { 
          color: #94A3B8; 
          text-decoration: none; 
          transition: all 0.3s ease; 
          font-weight: 500;
        }
        .cc-footer-wrapper .footer-links-group a:hover { 
          color: var(--white, #FFFFFF); 
        }
        .cc-footer-wrapper .social-icons { 
          display: flex; 
          gap: 16px; 
        }
        .cc-footer-wrapper .social-icon { 
          width: 40px; 
          height: 40px; 
          border-radius: 100px; 
          background-color: #1E293B; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          color: var(--white, #FFFFFF); 
          cursor: pointer; 
          transition: background-color 0.2s; 
          font-weight: 700; 
          text-decoration: none;
        }
        .cc-footer-wrapper .social-icon:hover { 
          background-color: var(--primary-blue, #005AE2); 
        }
        
        .cc-footer-wrapper .footer-watermark { 
          position: absolute; 
          top: 50%; 
          left: 50%; 
          transform: translate(-50%, -50%);
          width: 100%;
          font-size: clamp(5rem, 13vw, 15rem); 
          font-weight: 900; 
          color: #0d1425; /* Very close to #0A0F1C */
          pointer-events: none; 
          white-space: nowrap; 
          z-index: 0; 
          letter-spacing: 0.12em; 
          text-transform: uppercase; 
          text-align: center;
          line-height: 1;
          user-select: none;
        } 
        
        .cc-footer-wrapper .footer-logo-container {
          margin-bottom: 24px;
        }
        
        .cc-footer-wrapper .logo-circle {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #005AE2 0%, #004ac2 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 900;
          font-size: 1.5rem;
          margin-bottom: 16px;
          box-shadow: 0 10px 20px rgba(0, 90, 226, 0.2);
        }
        
        @media(max-width: 768px) { 
          .cc-footer-wrapper .footer-container { 
            grid-template-columns: 1fr; 
            gap: 40px; 
          }
          .cc-footer-wrapper .footer-watermark { 
            font-size: 10.5vw; 
            letter-spacing: 0.04em;
          } 
        }
      `}} />
      <div className="cc-footer-wrapper">
        <footer className="footer" style={{ position: "relative", overflow: "hidden" }}>
          <div className="footer-watermark">
            <EditableText contentKey="global.footer.watermark" value={globalContent.footer.watermark} />
          </div>
          <div className="footer-container">
            <div>
              <div className="footer-logo-container" style={{ marginBottom: '8px' }}>
                <img 
                  src="/crestcode-logo.png" 
                  alt="Crestcode Product Studio" 
                  style={{ maxWidth: '125px', height: 'auto', display: 'block', borderRadius: '8px' }} 
                />
              </div>
              <EditableText 
                as="p"
                contentKey="global.footer.tagline" 
                value={globalContent.footer.tagline} 
                className="footer-tagline"
              />
            </div>
            {globalContent.footer.sections.map((section, idx) => (
              <div key={idx} className="footer-links-group">
                <EditableText 
                  as="h5"
                  contentKey={`global.footer.sections.${idx}.title`}
                  value={section.title}
                  className="footer-heading"
                />
                {section.social && (
                  <div className="social-icons" style={{ marginBottom: '16px' }}>
                    {section.social.map((social, sIdx) => (
                      <Link key={sIdx} href={social.href} className="social-icon" style={{ backgroundColor: '#005AE2', width: '32px', height: '32px', borderRadius: '6px' }}>
                        {social.name === 'in' ? (
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        ) : social.name}
                      </Link>
                    ))}
                  </div>
                )}
                {section.links && (
                  <ul style={{ marginBottom: section.cta ? '24px' : '0' }}>
                    {section.links.map((link, lIdx) => (
                      <li key={lIdx}>
                        <Link href={link.href}>
                          <EditableText contentKey={`global.footer.sections.${idx}.links.${lIdx}.name`} value={link.name} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                {section.cta && (
                  <Link href={section.cta.href}>
                    <button className="btn-pill btn-primary" style={{ padding: '12px 28px', borderRadius: '100px', fontSize: '0.875rem', border: 'none', cursor: 'pointer' }}>
                      <EditableText contentKey={`global.footer.sections.${idx}.cta.name`} value={section.cta.name} />
                    </button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </footer>
      </div>
    </>
  );
}
