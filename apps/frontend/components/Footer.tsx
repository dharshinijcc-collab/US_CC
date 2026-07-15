'use client';

import React from 'react';
import Link from 'next/link';
import { useContent } from '@/context/ContentContext';
import EditableText from '@/components/admin/EditableText';
import EditableImage from '@/components/admin/EditableImage';
import localConfig from '@/shared/config.json';

export default function Footer() {
  const { content } = useContent();
  const globalContent = content?.global || (localConfig as any).global;

  if (!globalContent) return null; // should never happen now with localConfig fallback
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        .cc-footer-wrapper .footer { 
          background-color: #0B1019; 
          color: #94A3B8; 
          padding: 40px 0 20px 0; 
          font-size: clamp(0.875rem, 1.5vw, 1rem); 
          font-weight: 500;
          border-top: none;
          position: relative;
        }
        .cc-footer-wrapper .footer::before {
          content: '';
          position: absolute;
          top: -80px; left: 0; right: 0;
          height: 80px;
          background: linear-gradient(to bottom, rgba(11, 16, 25, 0) 0%, #0B1019 100%);
          pointer-events: none;
          z-index: 10;
        }
        .cc-footer-wrapper .footer-container { 
          max-width: 1200px; 
          margin: 0 auto; 
          padding: 0 24px; 
          display: flex; 
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 48px; 
          position: relative;
          z-index: 1;
        }
        .cc-footer-wrapper .footer-brand-column {
          flex: 2;
          min-width: 260px;
          max-width: 340px;
        }
        .cc-footer-wrapper .footer-logo { 
          color: #FFFFFF; 
          font-weight: 800; 
          font-size: clamp(1.125rem, 2.5vw, 1.25rem); 
          margin-bottom: 12px; 
          letter-spacing: -0.02em; 
        }
        .cc-footer-wrapper .footer-tagline { 
          line-height: 1.6; 
          max-width: 280px; 
          margin: 0;
          color: #64748B;
        }
        .cc-footer-wrapper .footer-heading { 
          color: #005AE2; 
          font-weight: 700; 
          margin-bottom: 16px; 
          font-size: 1rem; 
        }
        .cc-footer-wrapper .footer-links-group { 
          flex: 1;
          min-width: 180px;
        }
        .cc-footer-wrapper .footer-links-group ul { 
          list-style: none; 
          padding: 0; 
          margin: 0; 
        }
        .cc-footer-wrapper .footer-links-group li { 
          margin-bottom: 12px; 
        }
        .cc-footer-wrapper .footer-links-group a { 
          color: #64748B; 
          text-decoration: none; 
          transition: all 0.3s ease; 
          font-weight: 500;
        }
        .cc-footer-wrapper .footer-links-group a:hover { 
          color: #FFFFFF; 
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
        
        .cc-footer-wrapper .footer-bottom {
          margin-top: 30px;
          padding-top: 20px;
          width: 100%;
          position: relative;
          z-index: 1;
        }
        .cc-footer-wrapper .footer-bottom-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }
        .cc-footer-wrapper .copyright-text {
          margin: 0;
          color: #64748B;
          font-size: 0.875rem;
          font-weight: 500;
        }
        .cc-footer-wrapper .footer-bottom-links {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .cc-footer-wrapper .footer-bottom-links a {
          color: #64748B;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          transition: color 0.3s ease;
        }
        .cc-footer-wrapper .footer-bottom-links a:hover {
          color: #FFFFFF;
        }
        .cc-footer-wrapper .footer-bottom-links .divider {
          color: rgba(255, 255, 255, 0.15);
          font-size: 0.875rem;
          user-select: none;
        }

        .cc-footer-wrapper .footer-watermark { 
          position: absolute; 
          top: 50%; 
          left: 50%; 
          transform: translate(-50%, -50%);
          width: 95%;
          font-size: clamp(2.5rem, 11vw, 11rem); 
          font-weight: 900; 
          color: rgba(30, 44, 79, 0.36); 
          pointer-events: none; 
          white-space: nowrap; 
          z-index: 0; 
          letter-spacing: 0.05em; 
          text-indent: 0.05em; 
          text-transform: uppercase; 
          text-align: center;
          line-height: 1;
          user-select: none;
          opacity: 0.95;
          overflow: hidden;
        } 
        
        @media(max-width: 480px) {
          .cc-footer-wrapper .footer-watermark {
            font-size: 10vw;
            width: 100%;
          }
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
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 40px; 
            padding: 0 16px; 
          }
          .cc-footer-wrapper .footer-brand-column {
            text-align: center;
            margin-bottom: 20px;
            max-width: 100%;
          }
          .cc-footer-wrapper .footer-tagline {
            text-align: center;
            margin: 0 auto;
          }
          .cc-footer-wrapper .footer-logo-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 20px;
          }
          .cc-footer-wrapper .footer-logo-container img {
            margin: 0 auto 12px auto !important;
          }
          .cc-footer-wrapper .footer-watermark { 
            font-size: 8vw; 
            letter-spacing: 0.02em;
            line-height: 1.2;
          }
          .cc-footer-wrapper .logo-circle {
            width: 40px;
            height: 40px;
            font-size: 1.2rem;
          }
          .cc-footer-wrapper .social-icons {
            gap: 12px;
            justify-content: center;
          }
          .cc-footer-wrapper .social-icon {
            width: 32px;
            height: 32px;
            font-size: 14px;
          }
          .cc-footer-wrapper .footer-links-group {
            text-align: center;
            margin-bottom: 20px;
          }
          .cc-footer-wrapper .footer-links-group ul {
            justify-content: center;
          }
          .cc-footer-wrapper .footer-links-group li {
            margin-bottom: 8px;
          }
          .cc-footer-wrapper .footer-bottom-container {
            flex-direction: column;
            text-align: center;
            gap: 12px;
          }
        }
      `}} />
      <div className="cc-footer-wrapper" style={{ position: 'relative' }}>

        <footer className="footer" style={{ position: "relative", overflow: "hidden" }}>
          <div className="footer-watermark">
            <EditableText contentKey="global.footer.watermark" value={globalContent.footer.watermark} />
          </div>
          <div className="footer-container">
            <div className="footer-brand-column">
              <div className="footer-logo-container" style={{ marginBottom: '16px', textAlign: 'left' }}>
                <img
                  src="/CC_US_Logo_-_Black_Patch-removebg-preview.png"
                  alt="Crestcode Logo"
                  style={{ height: '90px', width: 'auto', display: 'inline-block', marginBottom: '16px', objectFit: 'contain' }}
                />
              </div>
              <EditableText
                as="p"
                contentKey="global.footer.tagline"
                value={globalContent.footer.tagline}
                className="footer-tagline"
                style={{ textAlign: 'left' }}
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
                      <Link key={sIdx} href={social.name === 'in' ? 'https://www.linkedin.com/search/results/all/?keywords=crestcode%20technologies&origin=RICH_QUERY_SUGGESTION&spellCorrectionEnabled=false&heroEntityKey=urn%3Ali%3Aorganization%3A108093169&position=0' : social.href} className="social-icon" style={{ backgroundColor: '#005AE2', width: '32px', height: '32px', borderRadius: '6px' }}>
                        {social.name === 'in' ? (
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="#FFF"><path d="M4.98 3.5c0 1.381-1.119 2.5-2.5 2.5s-2.5-1.119-2.5-2.5c0-1.38 1.119-2.5 2.5-2.5s2.5 1.12 2.5 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" /></svg>
                        ) : social.name === 'x' || social.name === 'X' || social.name === 'tw' ? (
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="#FFF"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                        ) : (
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#FFF', textTransform: 'uppercase' }}>{social.name}</span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
                {section.links && (
                  <ul style={{ marginBottom: section.cta ? '24px' : '0' }}>
                    {section.links.map((link, lIdx) => {
                      const isBlogsLink = link.name?.toLowerCase() === 'blogs' || link.name?.toLowerCase() === 'blog';
                      const isAboutLink = link.name?.toLowerCase() === 'about us';
                      const resolvedHref = isBlogsLink ? '/blogs' : (isAboutLink ? '/about' : link.href);
                      const displayName = (link.name?.toLowerCase() === 'blog' || link.name?.toLowerCase() === 'blogs') ? 'Blog' : link.name;
                      return (
                        <li key={lIdx}>
                          <Link href={resolvedHref}>
                            <EditableText contentKey={`global.footer.sections.${idx}.links.${lIdx}.name`} value={displayName} />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
                {section.contactLinks && (
                  <ul className="footer-links-group" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {section.contactLinks.map((link, lIdx) => (
                      <li key={lIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <span style={{ color: '#005AE2', display: 'flex', alignItems: 'center' }}>
                          {link.type === 'email' ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 .7 2.81A2 2 0 0 1 22 16.92z" /></svg>
                          )}
                        </span>
                        <Link href={link.href} style={{ color: '#64748B', textDecoration: 'none', transition: 'color 0.3s' }}>
                          <EditableText contentKey={`global.footer.sections.${idx}.contactLinks.${lIdx}.name`} value={link.name} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                {section.cta && (
                  <Link 
                    href={section.cta.href} 
                    className="btn-pill btn-primary" 
                    style={{ 
                      display: 'inline-block',
                      textDecoration: 'none',
                      padding: '12px 28px', 
                      borderRadius: '100px', 
                      fontSize: '0.875rem', 
                      border: 'none', 
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <EditableText
                      contentKey={`global.footer.sections.${idx}.cta.name`}
                      value={section.cta.name}
                    />
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="footer-bottom">
            <div className="footer-bottom-container">
              <p className="copyright-text">
                &copy; {new Date().getFullYear()} Crestcode Product Studio. All rights reserved.
              </p>
              <div className="footer-bottom-links">
                <Link href="/privacy">Privacy Policy</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
