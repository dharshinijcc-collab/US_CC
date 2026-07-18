'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';
import EditableImage from '@/components/pages/admin/EditableImage';
import { motion } from 'framer-motion';
import { 
  Rocket, TrendingUp, Users, Target, BookOpen, Clock, Layout, Heart, Calendar, Laptop, ArrowRight, MapPin, Briefcase, ChevronRight, Check, Upload, FileText, X
} from 'lucide-react';



export default function CareersWhyJoin({ careersContent }: any) {
  return (
    <section style={{ backgroundColor: '#FFFFFF' }}>
          <div className="section-container">
            <div style={{ textAlign: 'center', marginBottom: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span className="section-eyebrow">
                <EditableText contentKey="careers.whyJoin.eyebrow" value={careersContent.whyJoin.eyebrow || "WHY JOIN US"} />
              </span>
              <h2 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.02em' }} className="font-manrope">
                <EditableText contentKey="careers.whyJoin.title" value={careersContent.whyJoin.title} />
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', fontWeight: 500, maxWidth: '600px', margin: '0 auto' }}>
                <EditableText contentKey="careers.whyJoin.subtitle" value={careersContent.whyJoin.subtitle} />
              </p>
            </div>
            
            <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
              {[
                { icon: <Rocket size={20}/>, title: "Real Product Experience", desc: "Work on live products that impact thousands of users daily from day one." },
                { icon: <TrendingUp size={20}/>, title: "Growth & Learning", desc: "Structured mentorship and generous education stipends for your career path." },
                { icon: <Users size={20}/>, title: "Collaborative Culture", desc: "No silos. We work across teams to solve complex problems together." },
                { icon: <Target size={20}/>, title: "Ownership & Impact", desc: "We trust you with autonomy. Your decisions shape the future of our products." }
              ].map((item, i) => (
                <div key={i} className="hover-lift" style={{ backgroundColor: 'var(--bg-light)', padding: '40px 32px', borderRadius: '16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--light-blue-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-blue)', marginBottom: '24px' }}>
                    {item.icon}
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '12px' }} className="font-manrope">
                    <EditableText contentKey={`careers.whyJoin.items.${i}.title`} value={careersContent.whyJoin.items[i].title} />
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, fontWeight: 500 }}>
                    <EditableText contentKey={`careers.whyJoin.items.${i}.desc`} value={careersContent.whyJoin.items[i].desc} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
  );
}
