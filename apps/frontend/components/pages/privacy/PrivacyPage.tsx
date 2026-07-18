'use client';

import React from 'react';
import useScrollReveal from '@/hooks/useScrollReveal';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useContent } from '@/context/ContentContext';
import EditableText from '@/components/pages/admin/EditableText';
import { privacyStyles } from './styles';

export default function PrivacyPolicyPage() {
  const { content, loading, error } = useContent();
  useScrollReveal();
  
  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#F3F5F9] font-manrope">Loading privacy policy...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen bg-[#F3F5F9] font-manrope text-red-500">Error: {error}</div>;
  if (!content) return null;

  const privacyContent = content.privacy;
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: privacyStyles }} />

      <Header />
      <div className="privacy-page" style={{position:'relative',overflow:'hidden'}}>

        {/* Ambient glow orbs */}

        {/* Legal Document Content */}
        <main className="legal-container">
          <div className="eyebrow-pill cc-reveal">LEGAL DOCUMENT</div>
          <EditableText 
            as="h1"
            contentKey="privacy.title"
            value={privacyContent.title}
            className="legal-title cc-reveal cc-delay-1"
          />
          
          <div className="legal-meta">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Last Updated: <EditableText contentKey="privacy.lastUpdated" value={privacyContent.lastUpdated} />
          </div>

          <section className="cc-reveal cc-delay-2">
            <h2 className="legal-h2">
              <span className="legal-number">{privacyContent.sections[0].number}.</span>
              <EditableText 
                contentKey="privacy.sections.0.title"
                value={privacyContent.sections[0].title}
              />
            </h2>
            {privacyContent.sections[0].content?.map((paragraph, idx) => (
              <EditableText 
                key={idx}
                as="p"
                contentKey={`privacy.sections.0.content.${idx}`}
                value={paragraph}
                className="legal-p"
              />
            ))}
          </section>

          <section className="cc-reveal cc-delay-3">
            <h2 className="legal-h2">
              <span className="legal-number">{privacyContent.sections[1].number}.</span>
              <EditableText 
                contentKey="privacy.sections.1.title"
                value={privacyContent.sections[1].title}
              />
            </h2>
            {privacyContent.sections[1].content?.map((paragraph, idx) => (
              <EditableText 
                key={idx}
                as="p"
                contentKey={`privacy.sections.1.content.${idx}`}
                value={paragraph}
                className="legal-p"
              />
            ))}
            
            <ul className="legal-list">
              {privacyContent.sections[1].listItems?.map((item, idx) => (
                <li key={idx}>
                  <div className="list-icon">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <EditableText 
                    contentKey={`privacy.sections.1.listItems.${idx}`}
                    value={item}
                  />
                </li>
              ))}
            </ul>
            
            {privacyContent.sections[1].followUpContent?.map((paragraph, idx) => (
              <EditableText 
                key={idx}
                as="p"
                contentKey={`privacy.sections.1.followUpContent.${idx}`}
                value={paragraph}
                className="legal-p"
              />
            ))}
          </section>

          <section className="cc-reveal cc-delay-1">
            <h2 className="legal-h2">
              <span className="legal-number">{privacyContent.sections[2].number}.</span>
              <EditableText 
                contentKey="privacy.sections.2.title"
                value={privacyContent.sections[2].title}
              />
            </h2>
            
            <div className="legal-card">
              {privacyContent.sections[2].content?.map((paragraph, idx) => (
                <EditableText 
                  key={idx}
                  as="p"
                  contentKey={`privacy.sections.2.content.${idx}`}
                  value={paragraph}
                  className="legal-p"
                  style={{color: 'var(--text-main)'}}
                />
              ))}
              
              <div className="legal-card-grid">
                {privacyContent.sections[2].cookies?.map((cookie, idx) => (
                  <div key={idx}>
                    <EditableText 
                      as="h3"
                      contentKey={`privacy.sections.2.cookies.${idx}.title`}
                      value={cookie.title}
                      className="legal-card-h3"
                    />
                    <EditableText 
                      as="p"
                      contentKey={`privacy.sections.2.cookies.${idx}.description`}
                      value={cookie.description}
                      className="legal-card-p"
                    />
                  </div>
                ))}
              </div>

              <EditableText 
                as="p"
                contentKey="privacy.sections.2.cookieNote"
                value={privacyContent.sections[2].cookieNote}
                className="legal-card-p"
                style={{color: '#9CA3AF', fontSize: '0.8rem'}}
              />
            </div>
          </section>

          <section className="cc-reveal cc-delay-2">
            <h2 className="legal-h2">
              <span className="legal-number">{privacyContent.sections[3].number}.</span>
              <EditableText 
                contentKey="privacy.sections.3.title"
                value={privacyContent.sections[3].title}
              />
            </h2>
            {privacyContent.sections[3].content?.map((paragraph, idx) => (
              <EditableText 
                key={idx}
                as="p"
                contentKey={`privacy.sections.3.content.${idx}`}
                value={paragraph}
                className="legal-p"
              />
            ))}
            
            <div className="contact-pills-wrap">
              <a href={`mailto:${privacyContent.sections[3].contactEmail}`} className="contact-pill">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <EditableText 
                  contentKey="privacy.sections.3.contactEmail"
                  value={privacyContent.sections[3].contactEmail}
                />
              </a>
              <div className="contact-pill">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <EditableText 
                  contentKey="privacy.sections.3.contactAddress"
                  value={privacyContent.sections[3].contactAddress}
                />
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
