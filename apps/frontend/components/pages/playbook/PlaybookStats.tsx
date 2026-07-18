'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';
import EditableImage from '@/components/pages/admin/EditableImage';
import { 
  Building, Users, TrendingUp, Sparkles, Check, X, Compass, Cpu, Layers, Sprout, Briefcase, Search, Zap, Rocket, ShieldCheck, Server, Code, Clock, Shield, Globe, ArrowRight
} from 'lucide-react';




export default function PlaybookStats({ modelContent }: any) {
  return (
    <section className="stats-section" style={{ padding: '40px 0', background: 'white' }}>
          <div className="section-container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '3rem', fontWeight: 800, color: '#2563EB', marginBottom: '8px' }}>
                  <EditableText contentKey="ourModel.stats.s1.value" value={modelContent?.stats?.s1?.value} />
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.1em' }}>
                  <EditableText contentKey="ourModel.stats.s1.label" value={modelContent?.stats?.s1?.label} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: '3rem', fontWeight: 800, color: '#2563EB', marginBottom: '8px' }}>
                  <EditableText contentKey="ourModel.stats.s2.value" value={modelContent?.stats?.s2?.value} />
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.1em' }}>
                  <EditableText contentKey="ourModel.stats.s2.label" value={modelContent?.stats?.s2?.label} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: '3rem', fontWeight: 800, color: '#2563EB', marginBottom: '8px' }}>
                  <EditableText contentKey="ourModel.stats.s3.value" value={modelContent?.stats?.s3?.value} />
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.1em' }}>
                  <EditableText contentKey="ourModel.stats.s3.label" value={modelContent?.stats?.s3?.label} />
                </div>
              </div>
            </div>
          </div>
        </section>
  );
}
