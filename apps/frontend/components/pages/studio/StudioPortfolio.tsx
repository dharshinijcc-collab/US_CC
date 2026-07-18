'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';
import EditableImage from '@/components/pages/admin/EditableImage';
import { motion } from 'framer-motion';
import { 
  Compass, Cpu, Layers, Sparkles, Check, X, HelpCircle, ChevronDown, MessageSquare
} from 'lucide-react';
import ScrollStack, { ScrollStackItem } from '@/components/effects/ScrollStack';




export default function StudioPortfolio({ studioContent }: any) {
  return (
    <section className="page-section" style={{ backgroundColor: '#FAFAFA', fontFamily: 'Manrope, sans-serif', position: 'relative', overflow: 'hidden' }}>
          {/* Subtle background */}
          <div style={{ position: 'absolute', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(0, 90, 226, 0.03), transparent 70%)', top: '-100px', left: '-100px', pointerEvents: 'none' }}></div>
          <div style={{ position: 'absolute', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(13, 148, 136, 0.02), transparent 70%)', bottom: '-100px', right: '-100px', pointerEvents: 'none' }}></div>

          <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <EditableText
                contentKey="studio.values.eyebrow"
                value={studioContent.values?.eyebrow || "Our Ethos & Beliefs"}
                className="hero-eyebrow-pill"
              />
              <EditableText
                as="h2"
                contentKey="studio.values.title"
                value={studioContent.values?.title || "Core Values That Guide Everything We Build"}
                className="section-title"
                style={{ margin: '0 auto 16px', color: '#0F172A', maxWidth: '800px' }}
              />
              <EditableText
                as="p"
                contentKey="studio.values.subtitle"
                value={studioContent.values?.subtitle || "We aren't here to build commodities. We partner with founders to construct enduring, high-performance tech enterprises."}
                className="section-subtitle"
                style={{ maxWidth: '600px', margin: '0 auto' }}
              />
            </div>

            <div className="values-grid">
              {(() => {
                // Two alternating colors only: blue (#3B82F6) and teal (#0D9488)
                const VALUE_COLORS = [
                  { color: '#3B82F6', bgTint: '#EFF6FF', borderHover: '#3B82F6' },
                  { color: '#0D9488', bgTint: '#F0FDFA', borderHover: '#0D9488' },
                ];
                const defaultValues = [
                  {
                    title: 'Ownership',
                    desc: "We treat every product as if it's our own.",
                    icon: (
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.656 5.656L12 3 3.344 5.656C3.125 5.724 3 5.923 3 6.152V12c0 5.061 3.864 9.479 9 10 5.136-.521 9-4.939 9-10V6.152c0-.229-.125-.428-.344-.496z" />
                      </svg>
                    ),
                    ...VALUE_COLORS[0],
                  },
                  {
                    title: 'Honesty',
                    desc: "We challenge clients when we need to, even when it's uncomfortable.",
                    icon: (
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    ),
                    ...VALUE_COLORS[1],
                  },
                  {
                    title: 'Customer obsession',
                    desc: "Success is measured by the people who use the product, not just the people who commissioned it.",
                    icon: (
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    ),
                    ...VALUE_COLORS[0],
                  },
                  {
                    title: 'Craft',
                    desc: "We build to the MLP standard, because good enough never is.",
                    icon: (
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.242.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.17 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.883c-.77-.568-.371-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    ),
                    ...VALUE_COLORS[1],
                  },
                  {
                    title: 'Partnership',
                    desc: "We're in it for the long run, not just the launch.",
                    icon: (
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    ),
                    ...VALUE_COLORS[0],
                  },
                  {
                    title: 'Innovation',
                    desc: "We bring the latest thinking in product, engineering, and AI to every engagement.",
                    icon: (
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z" />
                      </svg>
                    ),
                    ...VALUE_COLORS[1],
                  }
                ];

                const valuesItems = (studioContent.values?.items || []).length > 0
                  ? studioContent.values.items.map((item: any, idx: number) => ({
                    ...defaultValues[idx],
                    ...item
                  }))
                  : defaultValues;

                return valuesItems.map((val: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '14px',
                      padding: '28px',
                      transition: 'all 0.25s ease',
                      cursor: 'default',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = val.borderHover;
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E5E7EB';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Circular Icon Container */}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: val.bgTint,
                      color: val.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px',
                      flexShrink: 0,
                    }}>
                      {val.icon}
                    </div>

                    {/* Title */}
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: '#111827',
                      marginBottom: '8px',
                      letterSpacing: '-0.01em',
                      lineHeight: 1.3,
                    }}>
                      <EditableText
                        contentKey={`studio.values.items.${index}.title`}
                        value={val.title}
                      />
                    </h3>

                    {/* Description */}
                    <p style={{
                      color: '#6B7280',
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                      margin: 0,
                      fontWeight: 400,
                    }}>
                      <EditableText
                        contentKey={`studio.values.items.${index}.desc`}
                        value={val.desc}
                      />
                    </p>
                  </div>
                ));
              })()}
            </div>
          </div>
        </section>
  );
}
