'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';
import EditableImage from '@/components/pages/admin/EditableImage';
import { 
  Building, Users, TrendingUp, Sparkles, Check, X, Compass, Cpu, Layers, Sprout, Briefcase, Search, Zap, Rocket, ShieldCheck, Server, Code, Clock, Shield, Globe, ArrowRight
} from 'lucide-react';




export default function PlaybookCta({ modelContent }: any) {
  return (
    <section className="final-cta-section page-section" style={{ background: 'white' }}>
          <div className="section-container" style={{ 
            maxWidth: '1200px', 
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', 
            borderRadius: '48px', 
            padding: '48px 40px',
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 20px 40px rgba(37, 99, 235, 0.2)'
          }}>
            <h2 className="cta-title" style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '24px', letterSpacing: '-0.02em' }}>
              <EditableText contentKey="ourModel.cta.title" value={modelContent.cta.title} />
            </h2>
            <p className="cta-description" style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.9)', marginBottom: '48px', lineHeight: 1.6, maxWidth: '700px', margin: '0 auto 48px' }}>
              <EditableText contentKey="ourModel.cta.description" value={modelContent.cta.description} />
            </p>
            <div className="cta-buttons" style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
              <Link href="/contact" style={{ 
                padding: '18px 40px', 
                background: 'white', 
                color: '#2563EB', 
                borderRadius: '16px', 
                fontWeight: 700, 
                fontSize: '1.125rem', 
                transition: 'all 0.3s ease',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
              }}>
                <EditableText contentKey="ourModel.cta.button" value={modelContent.cta.button} />
              </Link>
            </div>
          </div>
        </section>
  );
}
