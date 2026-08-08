'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';
import { motion } from 'framer-motion';

export default function FounderTestimonials({ homeContent }: any) {
  return (
    <section id="testimonials-section" className="testimonials-page-section" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="section-container">
        <div className="text-center">
          <EditableText
            as="h3"
            contentKey="home.testimonials.eyebrow"
            value={homeContent.testimonials?.eyebrow || "CLIENT STORIES"}
            className="section-eyebrow cc-reveal"
          />
        </div>
        <EditableText
          as="h2"
          contentKey="home.testimonials.title"
          value={homeContent.testimonials.title}
          className="section-title text-center cc-reveal"
          style={{ marginBottom: '24px' }}
        />

        <div className="cards-grid-2" style={{ gap: '32px 32px', marginTop: '0px' }}>
          {(homeContent.testimonials.items || [])
            .filter((item: any) => item.author && !item.author.toLowerCase().includes('abdul') && !item.author.toLowerCase().includes('adbul'))
            .map((item: any, idx: number) => (
              <div key={idx} className="testimonial-card">
                {/* Circle quote icon */}
                <div className="t-quote-circle">
                  <span className="t-quote-symbol">“</span>
                </div>

                {/* Stars — Bright Yellow */}
                <div className="t-stars" style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="t-star" width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" style={{ marginRight: '4px' }}>
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <EditableText
                  as="p"
                  contentKey={`home.testimonials.items.${idx}.quote`}
                  value={item.quote}
                  className="t-quote"
                />

                {/* Divider Line */}
                <div className="t-divider" />

                {/* Author block with Avatar */}
                <div className="t-box-author">
                  <div className="t-avatar-wrap">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.author}
                        className="t-avatar-img"
                      />
                    ) : (
                      <div className="t-avatar-placeholder">
                        {item.author ? item.author.charAt(0) : 'U'}
                      </div>
                    )}
                  </div>
                  <div className="t-author-info">
                    <EditableText
                      contentKey={`home.testimonials.items.${idx}.author`}
                      value={item.author}
                      className="t-name-light"
                    />
                    <EditableText
                      contentKey={`home.testimonials.items.${idx}.role`}
                      value={item.role}
                      className="t-role-light"
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>

      </div>
    </section>
  );
}
