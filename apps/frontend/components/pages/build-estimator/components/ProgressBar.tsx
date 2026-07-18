'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { BLUE, DARK, MUTED, STEPS } from '../config';

interface ProgressBarProps {
  step: number;
  total: number;
}

export default function ProgressBar({ step, total }: ProgressBarProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '36px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', width: '100%', padding: '0 12px' }}>
        {/* Background Line */}
        <div style={{ position: 'absolute', top: '16px', left: '20px', right: '20px', height: '2px', background: '#E2E8F0', zIndex: 0 }} />
        {/* Active Progress Line */}
        <div style={{
          position: 'absolute', top: '16px', left: '20px',
          width: `${((step - 1) / (total - 1)) * 94}%`,
          height: '2px', background: BLUE, transition: 'all 0.3s ease', zIndex: 0
        }} />

        {STEPS.map((s, i) => {
          const done = i < step - 1;
          const active = i === step - 1;
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, position: 'relative', width: '60px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: active ? BLUE : done ? '#FFFFFF' : '#FFFFFF',
                border: `2px solid ${active ? BLUE : done ? BLUE : '#CBD5E1'}`,
                color: active ? '#FFFFFF' : done ? BLUE : '#64748B',
                fontWeight: 700,
                fontSize: '0.85rem',
                boxShadow: active ? '0 0 0 4px rgba(0, 90, 226, 0.15)' : 'none',
                transition: 'all 0.25s ease',
              }}>
                {done ? <Check size={14} strokeWidth={3} /> : <span>{i + 1}</span>}
              </div>
              <span className="bte-step-label" style={{
                marginTop: '8px',
                fontSize: '0.72rem',
                fontWeight: active ? 700 : 500,
                color: active ? DARK : done ? MUTED : '#94A3B8',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                position: 'absolute',
                top: '32px',
                transition: 'color 0.2s',
              }}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
      {/* Margin spacer to prevent labels from overlapping content */}
      <div style={{ height: '20px' }} />
    </div>
  );
}
