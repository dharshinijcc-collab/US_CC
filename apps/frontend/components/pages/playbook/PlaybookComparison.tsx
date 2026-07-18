'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';
import EditableImage from '@/components/pages/admin/EditableImage';
import { 
  Building, Users, TrendingUp, Sparkles, Check, X, Compass, Cpu, Layers, Sprout, Briefcase, Search, Zap, Rocket, ShieldCheck, Server, Code, Clock, Shield, Globe, ArrowRight
} from 'lucide-react';




export default function PlaybookComparison({ modelContent }: any) {
  return (
    <section className="comparison-section" style={{ background: '#F0F7FF' }}>
          <div className="section-container" style={{ maxWidth: '1200px' }}>
            <h2 className="phase-title" style={{ textAlign: 'center', fontSize: '3rem', fontWeight: 800, marginBottom: '64px' }}>
              <EditableText contentKey="ourModel.comparison.title" value={modelContent.comparison.title} />
            </h2>
            <div className="comparison-table-wrapper">
              <div className="comparison-table" style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', background: '#DBEAFE', padding: '24px' }}>
                <div style={{ fontWeight: 800, fontSize: '0.875rem' }}>
                  <EditableText contentKey="ourModel.comparison.h1" value={modelContent.comparison.h1} />
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.875rem' }}>
                  <EditableText contentKey="ourModel.comparison.h2" value={modelContent.comparison.h2} />
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.875rem' }}>
                  <EditableText contentKey="ourModel.comparison.h3" value={modelContent.comparison.h3} />
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.875rem' }}>
                  <EditableText contentKey="ourModel.comparison.h4" value={modelContent.comparison.h4} />
                </div>
              </div>
              {modelContent.comparison.rows.map((row, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', padding: '24px', borderBottom: idx === modelContent.comparison.rows.length - 1 ? 'none' : '1px solid #E2E8F0', background: idx % 2 === 0 ? 'white' : '#F0F7FF' }}>
                  <div style={{ fontWeight: 700 }}>
                    <EditableText contentKey={`ourModel.comparison.rows.${idx}.f`} value={row.f} />
                  </div>
                  <div style={{ color: '#64748B' }}>
                    <EditableText contentKey={`ourModel.comparison.rows.${idx}.c1`} value={row.c1} />
                  </div>
                  <div style={{ color: '#64748B' }}>
                    <EditableText contentKey={`ourModel.comparison.rows.${idx}.c2`} value={row.c2} />
                  </div>
                  <div style={{ color: '#2563EB', fontWeight: 700 }}>
                    <EditableText contentKey={`ourModel.comparison.rows.${idx}.c3`} value={row.c3} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
  );
}
