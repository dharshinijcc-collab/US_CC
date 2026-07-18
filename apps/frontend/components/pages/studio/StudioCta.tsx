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




export default function StudioCta({ studioContent }: any) {
  return (
    <section className="section-white text-center">
            <div className="section-container">
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div className="hero-eyebrow-pill">
                  <EditableText contentKey="studio.cta.eyebrow" value={studioContent.cta?.eyebrow || "Get Started"} />
                </div>
              </div>
              <EditableText
                as="h2"
                contentKey="studio.cta.title"
                value={studioContent.cta?.title}
                className="section-title"
                style={{ marginBottom: '16px' }}
              />
              <EditableText
                as="p"
                contentKey="studio.cta.subtitle"
                value={studioContent.cta?.subtitle}
                className="section-subtitle text-center"
                style={{ maxWidth: '600px', margin: '0 auto' }}
              />
              <Link href="/#idea">
                <button className="btn-primary" style={{ marginTop: '32px', padding: '20px 48px', fontSize: '1.125rem' }}>
                  <EditableText contentKey="studio.cta.buttonText" value={studioContent.cta?.buttonText} />
                </button>
              </Link>
            </div>
          </section>
  );
}
