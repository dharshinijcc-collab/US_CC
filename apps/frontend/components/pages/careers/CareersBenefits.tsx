'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';
import EditableImage from '@/components/pages/admin/EditableImage';
import { motion } from 'framer-motion';
import { 
  Rocket, TrendingUp, Users, Target, BookOpen, Clock, Layout, Heart, Calendar, Laptop, ArrowRight, MapPin, Briefcase, ChevronRight, Check, Upload, FileText, X
} from 'lucide-react';



export default function CareersBenefits({ careersContent }: any) {
  return (
    <section id="benefits" style={{ backgroundColor: '#FFFFFF', color: 'var(--text-black)' }}>
          <div className="section-container">
            <div style={{ marginBottom: '60px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span className="section-eyebrow">
                <EditableText contentKey="careers.benefits.eyebrow" value={careersContent.benefits.eyebrow || "BENEFITS & PERKS"} />
              </span>
              <h2 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.02em', color: '#0F172A' }} className="font-manrope">
                <EditableText contentKey="careers.benefits.title" value={careersContent.benefits.title} />
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', fontWeight: 500, maxWidth: '600px', margin: '0 auto' }}>
                <EditableText contentKey="careers.benefits.subtitle" value={careersContent.benefits.subtitle} />
              </p>
            </div>
            
            <div className="grid-3">
              {[
                { icon: <BookOpen size={20}/>, title: "Continuous Learning", desc: "Monthly budget for books, courses, and conferences to sharpen your skills." },
                { icon: <MapPin size={20}/>, title: "Flexible Work", desc: "Work from anywhere. We value results over desk time and office hours." },
                { icon: <Layout size={20}/>, title: "Exposure to Product", desc: "Directly collaborate with founders and product owners on vision and strategy." },
                { icon: <Heart size={20}/>, title: "Health & Wellness", desc: "Premium health insurance and monthly wellness allowance for gym/mental health." },
                { icon: <Calendar size={20}/>, title: "Unlimited PTO", desc: "We trust you to manage your time. Rest is essential for peak performance." },
                { icon: <Laptop size={20}/>, title: "Tech Stipend", desc: "Top-tier hardware and home-office setup budget for all team members." }
              ].map((benefit, i) => (
                <div key={i} style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--light-blue-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-blue)', flexShrink: 0 }}>
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '8px', color: '#0F172A' }} className="font-manrope">
                      <EditableText contentKey={`careers.benefits.items.${i}.title`} value={careersContent.benefits.items[i].title} />
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, fontWeight: 500 }}>
                      <EditableText contentKey={`careers.benefits.items.${i}.desc`} value={careersContent.benefits.items[i].desc} />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
  );
}
