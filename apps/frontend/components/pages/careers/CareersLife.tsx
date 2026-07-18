'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';
import EditableImage from '@/components/pages/admin/EditableImage';
import { motion } from 'framer-motion';
import { 
  Rocket, TrendingUp, Users, Target, BookOpen, Clock, Layout, Heart, Calendar, Laptop, ArrowRight, MapPin, Briefcase, ChevronRight, Check, Upload, FileText, X
} from 'lucide-react';



export default function CareersLife({ careersContent }: any) {
  return (
    <section style={{ backgroundColor: '#F8FAFC' }}>
          <div className="section-container">
            <div style={{ backgroundColor: 'var(--primary-blue)', borderRadius: '24px', padding: '60px', display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '60px', alignItems: 'center', color: '#FFF' }} className="life-grid">
              <div>
                <h2 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '32px', letterSpacing: '-0.02em', lineHeight: 1.15 }} className="font-manrope">
                  <EditableText contentKey="careers.life.title" value={careersContent.life.title} />
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, fontWeight: 500 }}>
                    <EditableText contentKey="careers.life.description1" value={careersContent.life.description1} />
                  </p>
                  <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, fontWeight: 500 }}>
                    <EditableText contentKey="careers.life.description2" value={careersContent.life.description2} />
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=400" alt="Team talking" style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '16px' }} />
                  <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=400" alt="Monitors" style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '16px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '40px' }}>
                  <img src="https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&q=80&w=400" alt="Meeting" style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '16px' }} />
                  <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=400" alt="Brainstorming" style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '16px' }} />
                </div>
              </div>
            </div>
          </div>
        </section>
  );
}
