'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';

// Shared font constants
const FONT_INTER = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

export default function StudioCta({ studioContent }: any) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        /* Override globals.css: h2 { font-weight:800 } and global-styles.css: .section-title { font-family: Manrope } */
        #studio-cta-section h2.studio-cta-heading,
        #studio-cta-section h2.studio-cta-heading span {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
          font-weight: 700 !important;
          font-size: clamp(2.2rem, 5vw, 3rem) !important;
          letter-spacing: -0.02em !important;
          line-height: 1.22 !important;
          color: #0F172A !important;
          margin: 0 0 20px 0 !important;
        }

        /* Override globals.css: p { font-size: clamp(1rem,...) } and body font-family */
        #studio-cta-section p.studio-cta-paragraph,
        #studio-cta-section p.studio-cta-paragraph span {
          font-family: 'Inter', sans-serif !important;
          font-weight: 500 !important;
          font-size: clamp(0.87rem, 1.5vw, 0.96rem) !important;
          color: #111827 !important;
          line-height: 1.72 !important;
          max-width: 640px !important;
          margin: 0 auto 36px !important;
          text-align: center !important;
        }

        #studio-cta-section .studio-cta-eyebrow,
        #studio-cta-section .studio-cta-eyebrow span {
          font-family: 'Inter', sans-serif !important;
          font-weight: 700 !important;
          font-size: 0.7rem !important;
          letter-spacing: 0.15em !important;
          text-transform: uppercase !important;
        }

        /* Button / Link */
        #studio-cta-section a.studio-cta-btn,
        #studio-cta-section a.studio-cta-btn span {
          font-family: 'Inter', sans-serif !important;
          font-weight: 700 !important;
          font-size: 0.95rem !important;
          letter-spacing: 0em !important;
          text-transform: none !important;
        }

        #studio-cta-section a.studio-cta-btn {
          background-color: #005AE2 !important;
          color: #FFFFFF !important;
          border: none !important;
          border-radius: 100px !important;
          padding: 14px 34px !important;
          cursor: pointer !important;
          box-shadow: 0 10px 20px -5px rgba(0, 90, 226, 0.3) !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 8px !important;
          text-decoration: none !important;
          transition: all 0.25s ease !important;
        }

        #studio-cta-section a.studio-cta-btn:hover {
          background-color: #004ac2 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 15px 30px -5px rgba(0, 90, 226, 0.4) !important;
        }
      `}} />

      <section
        id="studio-cta-section"
        className="page-section"
        style={{
          backgroundColor: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center',
        }}
      >
        {/* Soft radial glow — top right */}
        <div style={{
          position: 'absolute',
          top: '-180px',
          right: '-180px',
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(147, 197, 253, 0.3) 0%, transparent 65%)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '760px', margin: '0 auto', padding: '0 24px' }}>

          {/* Eyebrow — Inter Bold */}
          <div style={{ marginBottom: '24px' }}>
            <span
              className="studio-cta-eyebrow"
              style={{
                display: 'inline-block',
                backgroundColor: '#EFF6FF',
                color: '#005AE2',
                padding: '5px 16px',
                borderRadius: '100px',
                fontFamily: FONT_INTER,
                fontWeight: 700,
                fontSize: '0.7rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              <EditableText
                contentKey="studio.cta.eyebrow"
                value={studioContent.cta?.eyebrow || "GET STARTED"}
                style={{ fontFamily: FONT_INTER, fontWeight: 700 }}
              />
            </span>
          </div>

          {/* Heading — Inter Sans-Serif Bold */}
          <h2
            className="studio-cta-heading"
            style={{
              fontFamily: FONT_INTER,
              fontWeight: 700,
              fontSize: 'clamp(2.2rem, 5vw, 3rem)',
              color: '#0F172A',
              lineHeight: 1.22,
              letterSpacing: '-0.02em',
              marginBottom: '20px',
              marginTop: 0,
            }}
          >
            <EditableText
              contentKey="studio.cta.title"
              value={studioContent.cta?.title || "Have A Venture Ready Idea?"}
              style={{ fontFamily: FONT_INTER, fontWeight: 700 }}
            />
          </h2>

          {/* Paragraph — Inter Regular (Medium) */}
          <p
            className="studio-cta-paragraph"
            style={{
              fontFamily: FONT_INTER,
              fontWeight: 500,
              fontSize: 'clamp(0.87rem, 1.5vw, 0.96rem)',
              color: '#111827',
              lineHeight: 1.72,
              maxWidth: '640px',
              margin: '0 auto 36px',
              textAlign: 'center',
            }}
          >
            <EditableText
              contentKey="studio.cta.subtitle"
              value={studioContent.cta?.subtitle || "Built to transform high potential ideas into scalable, venture ready products with real market relevance. Focused on validation, execution, and sustainable growth to create long-term value for founders and investors alike."}
              style={{ fontFamily: FONT_INTER, fontWeight: 500 }}
            />
          </p>

          {/* Button — Inter SemiBold */}
          <Link
            href="/#idea"
            className="studio-cta-btn"
            style={{
              fontFamily: FONT_INTER,
              fontWeight: 700,
              fontSize: '0.95rem',
              backgroundColor: '#005AE2',
              color: '#FFFFFF',
              borderRadius: '100px',
              padding: '14px 34px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              boxShadow: '0 10px 20px -5px rgba(0, 90, 226, 0.3)',
              transition: 'all 0.25s ease',
            }}
          >
            <EditableText
              contentKey="studio.cta.buttonText"
              value={studioContent.cta?.buttonText || "Start Your Venture"}
              style={{ fontFamily: FONT_INTER, fontWeight: 600 }}
            />
            <span style={{ fontFamily: FONT_INTER, fontWeight: 600, fontSize: '1rem' }}>→</span>
          </Link>

        </div>
      </section>
    </>
  );
}
