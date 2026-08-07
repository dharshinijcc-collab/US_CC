'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';

const FONT_INTER = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

export default function StudioCta({ studioContent }: any) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .studio-cta-card {
          position: relative;
          background: linear-gradient(145deg, #FAFCFF 0%, #F0F6FF 100%);
          border-radius: 32px;
          padding: clamp(48px, 6vw, 76px) clamp(24px, 4vw, 48px);
          box-shadow: 
            0 32px 64px -16px rgba(0, 90, 226, 0.12),
            0 16px 32px -8px rgba(15, 23, 42, 0.05);
          border: none !important;
          overflow: hidden;
          text-align: center;
        }

        .studio-cta-grid-bg {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(0, 90, 226, 0.07) 1px, transparent 1px), 
            linear-gradient(90deg, rgba(0, 90, 226, 0.07) 1px, transparent 1px);
          background-size: 44px 44px;
          mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 40%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 40%, transparent 100%);
          pointer-events: none;
          z-index: 0;
        }

        .studio-cta-title-text {
          font-family: 'Manrope', 'Inter', -apple-system, sans-serif !important;
          font-weight: 800 !important;
          font-size: clamp(2rem, 4.2vw, 2.75rem) !important;
          letter-spacing: -0.03em !important;
          line-height: 1.2 !important;
          color: #0F172A !important;
          margin: 0 0 16px 0 !important;
          white-space: pre-line !important;
        }

        .studio-cta-sub-text {
          font-family: 'Inter', sans-serif !important;
          font-weight: 500 !important;
          font-size: clamp(0.95rem, 1.5vw, 1.08rem) !important;
          color: #475569 !important;
          line-height: 1.65 !important;
          max-width: 600px !important;
          margin: 0 auto 36px !important;
        }

        .studio-cta-btn-primary {
          background-color: #005AE2 !important;
          color: #FFFFFF !important;
          border: 1px solid #005AE2 !important;
          border-radius: 100px !important;
          padding: 14px 36px !important;
          font-family: 'Inter', sans-serif !important;
          font-weight: 700 !important;
          font-size: 0.92rem !important;
          letter-spacing: -0.01em !important;
          text-decoration: none !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 8px !important;
          box-shadow: 0 10px 24px -4px rgba(0, 90, 226, 0.35) !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
          cursor: pointer !important;
        }

        .studio-cta-btn-primary:hover {
          background-color: #004ac2 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 14px 28px -4px rgba(0, 90, 226, 0.45) !important;
        }

        .studio-cta-btn-secondary {
          background-color: rgba(255, 255, 255, 0.9) !important;
          color: #005AE2 !important;
          border: 1.5px solid rgba(0, 90, 226, 0.3) !important;
          border-radius: 100px !important;
          padding: 14px 34px !important;
          font-family: 'Inter', sans-serif !important;
          font-weight: 700 !important;
          font-size: 0.92rem !important;
          letter-spacing: -0.01em !important;
          text-decoration: none !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 8px !important;
          box-shadow: 0 4px 14px rgba(0, 90, 226, 0.06) !important;
          backdrop-filter: blur(12px) !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
          cursor: pointer !important;
        }

        .studio-cta-btn-secondary:hover {
          background-color: #FFFFFF !important;
          border-color: #005AE2 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 20px rgba(0, 90, 226, 0.12) !important;
        }
      `}} />

      <section
        id="studio-cta-section"
        className="page-section"
        style={{
          backgroundColor: '#FFFFFF',
          position: 'relative',
          padding: '80px 24px 100px',
        }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
          
          {/* Ambient Glow Orb under Card */}
          <div style={{
            position: 'absolute',
            bottom: '-40px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            height: '160px',
            background: 'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(0, 90, 226, 0.18) 0%, transparent 70%)',
            filter: 'blur(30px)',
            pointerEvents: 'none',
            zIndex: 0,
          }} />

          {/* Floating Card Container */}
          <div className="studio-cta-card">
            {/* Grid Pattern Background */}
            <div className="studio-cta-grid-bg" />

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '780px', margin: '0 auto' }}>
              
              {/* Eyebrow Badge */}
              <div style={{ marginBottom: '20px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(0, 90, 226, 0.2)',
                    color: '#005AE2',
                    padding: '6px 18px',
                    borderRadius: '100px',
                    fontFamily: FONT_INTER,
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    boxShadow: '0 2px 8px rgba(0, 90, 226, 0.05)',
                  }}
                >
                  <EditableText
                    contentKey="studio.cta.eyebrow"
                    value={studioContent.cta?.eyebrow || "JOIN THE STUDIO"}
                    style={{ fontFamily: FONT_INTER, fontWeight: 700 }}
                  />
                </span>
              </div>

              {/* Big Bold Headline matching the image UX */}
              <h2 className="studio-cta-title-text">
                <EditableText
                  contentKey="studio.cta.title"
                  value={studioContent.cta?.title || "We're just getting started.\nAre you in?"}
                  style={{ fontFamily: FONT_INTER, fontWeight: 800 }}
                />
              </h2>

              {/* Subtitle / Paragraph */}
              <p className="studio-cta-sub-text">
                <EditableText
                  contentKey="studio.cta.subtitle"
                  value={studioContent.cta?.subtitle || "Build high-impact venture products with conviction, validation, and engineering excellence."}
                  style={{ fontFamily: FONT_INTER, fontWeight: 500 }}
                />
              </p>

              {/* Side-by-Side Pill CTA Buttons */}
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                <Link href="/careers" className="studio-cta-btn-primary">
                  <EditableText
                    contentKey="studio.cta.buttonText"
                    value={studioContent.cta?.buttonText || "Explore Open Roles"}
                    style={{ fontFamily: FONT_INTER, fontWeight: 700 }}
                  />
                </Link>

                <Link href="/about" className="studio-cta-btn-secondary">
                  <EditableText
                    contentKey="studio.cta.secondaryButtonText"
                    value={studioContent.cta?.secondaryButtonText || "Our Values"}
                    style={{ fontFamily: FONT_INTER, fontWeight: 700 }}
                  />
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
