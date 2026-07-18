'use client';
import React from 'react';
import Link from 'next/link';
import EditableText from '@/components/pages/admin/EditableText';
import EditableImage from '@/components/pages/admin/EditableImage';
import { 
  Building, Users, TrendingUp, Sparkles, Check, X, Compass, Cpu, Layers, Sprout, Briefcase, Search, Zap, Rocket, ShieldCheck, Server, Code, Clock, Shield, Globe, ArrowRight
} from 'lucide-react';




export default function PlaybookPods({ modelContent }: any) {
  return (
    <section className="pods-section" style={{ background: '#0F172A' }}>
          <div className="section-container" style={{ maxWidth: '1400px', width: '95%' }}>
            <div style={{ textAlign: 'center', maxWidth: '1000px', margin: '0 auto 64px' }}>
              <h2 className="phase-title" style={{ color: 'white', fontSize: '2.75rem', fontWeight: 800, marginBottom: '24px', whiteSpace: 'nowrap' }}>
                <EditableText contentKey="ourModel.pods.title" value={modelContent.pods.title} />
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '1.125rem', lineHeight: 1.6, maxWidth: '800px', margin: '0 auto' }}>
                <EditableText contentKey="ourModel.pods.subtitle" value={modelContent.pods.subtitle} />
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px' }}>
              {modelContent.pods.items.map((pod, pidx) => {
                const colors = ['#3B82F6', '#1E40AF', '#10B981', '#06B6D4', '#14B8A6'];
                const icons = [
                  <Cpu size={28} />,
                  <Layers size={28} />,
                  <TrendingUp size={28} />,
                  <Sparkles size={28} />,
                  <ShieldCheck size={28} />
                ];
                return (
                  <div key={pidx} className="pod-card" style={{ 
                    background: 'rgba(255, 255, 255, 0.03)', 
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '40px 24px',
                    borderRadius: '24px',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    textAlign: 'left',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <div style={{ 
                      width: '56px', 
                      height: '56px', 
                      background: `${colors[pidx]}15`, 
                      color: colors[pidx], 
                      borderRadius: '16px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      marginBottom: '24px',
                      boxShadow: `0 8px 20px ${colors[pidx]}20`
                    }}>
                      {icons[pidx]}
                    </div>
                    <span style={{ color: colors[pidx], fontWeight: 800, fontSize: '0.625rem', letterSpacing: '0.2em', marginBottom: '12px', display: 'block' }}>
                      <EditableText contentKey={`ourModel.pods.items.${pidx}.id`} value={pod.id} />
                    </span>
                    <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', lineHeight: 1.3 }}>
                      <EditableText contentKey={`ourModel.pods.items.${pidx}.title`} value={pod.title} />
                    </h3>
                    <p style={{ color: '#94A3B8', fontSize: '0.8125rem', lineHeight: 1.5, flexGrow: 1 }}>
                      <EditableText contentKey={`ourModel.pods.items.${pidx}.desc`} value={pod.desc} />
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
  );
}
