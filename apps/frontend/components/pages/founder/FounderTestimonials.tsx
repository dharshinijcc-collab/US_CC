'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';
import EditableImage from '@/components/pages/admin/EditableImage';
import { motion } from 'framer-motion';
import { 
  User, Building, Lightbulb, Compass, Zap, Users, TrendingUp, Cpu, Globe, Brain, Home,
  ArrowLeft, ArrowRight, Sparkles, Check, X, AlertTriangle, Info, RefreshCw, ChevronRight,
  Code2, Ban, History, Sprout, Briefcase, DollarSign, Layers, Palette
} from 'lucide-react';
import RotatingIdeaPlaceholder from '@/components/effects/RotatingIdeaPlaceholder';




export default function FounderTestimonials({ homeContent }: any) {
  return (
    <section id="testimonials-section" className="section-light">
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
              style={{ marginBottom: 'clamp(40px, 6vw, 80px)' }}
            />

            <div className="cards-grid-2">
              {(homeContent.testimonials.items || [])
                .filter((item: any) => item.author && !item.author.toLowerCase().includes('abdul') && !item.author.toLowerCase().includes('adbul'))
                .map((item: any, idx: number) => (
                  <div key={idx} className="testimonial-card">
                    <EditableText
                      as="p"
                      contentKey={`home.testimonials.items.${idx}.quote`}
                      value={item.quote}
                      className="t-quote"
                      style={{ fontStyle: 'italic' }}
                    />
                    <div className="t-box-author">
                      <div>
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
