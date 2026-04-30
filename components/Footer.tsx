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
          grid-template-columns: 2fr 1fr 1fr 1fr; 
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
          margin-bottom: 16px; 
        }
        .cc-footer-wrapper .footer-links-group a { 
          color: #9CA3AF; 
          text-decoration: none; 
          transition: color 0.2s; 
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
          color: rgba(255, 255, 255, 0.04);
          pointer-events: none; 
          white-space: nowrap; 
          z-index: 0; 
          letter-spacing: 0.12em; 
          text-transform: uppercase; 
          text-align: center;
          line-height: 1;
          user-select: none;
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
              <EditableText 
                contentKey="global.footer.brand" 
                value={globalContent.footer.brand} 
                className="footer-logo"
              />
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
                {section.links ? (
                  <ul>
                    {section.links.map((link, lIdx) => (
                      <li key={lIdx}>
                        <Link href={link.href}>
                          <EditableText contentKey={`global.footer.sections.${idx}.links.${lIdx}.name`} value={link.name} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : section.social ? (
                  <div className="social-icons">
                    {section.social.map((social, sIdx) => (
                      <Link key={sIdx} href={social.href} className="social-icon">
                        <EditableText contentKey={`global.footer.sections.${idx}.social.${sIdx}.name`} value={social.name} />
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </footer>
      </div>
    </>
  );
}
