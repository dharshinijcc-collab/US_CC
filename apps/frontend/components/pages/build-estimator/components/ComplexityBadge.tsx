'use client';

import React from 'react';
import type { EstimateResult } from '../types';

interface ComplexityBadgeProps {
  level: EstimateResult['complexity'];
}

export default function ComplexityBadge({ level }: ComplexityBadgeProps) {
  const map = {
    'Low':       { bg: '#E8F5E9', color: '#2E7D32', border: '#A5D6A7' },
    'Medium':    { bg: '#FFF8E1', color: '#B45309', border: '#FCD34D' },
    'High':      { bg: '#FFF3E0', color: '#C2410C', border: '#FDBA74' },
    'Very High': { bg: '#FEF2F2', color: '#B91C1C', border: '#FCA5A5' },
  };
  const s = map[level];
  return (
    <span style={{ padding: '4px 14px', borderRadius: '20px', fontWeight: 800, fontSize: '0.8rem', background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {level}
    </span>
  );
}
