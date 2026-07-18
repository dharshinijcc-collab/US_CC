'use client';

import React from 'react';

interface LoadingStepProps {
  loadingStepText: string;
}

export default function LoadingStep({ loadingStepText }: LoadingStepProps) {
  return (
    <div className="form-card loading-wrap" style={{ maxWidth: '480px', margin: '60px auto 0', padding: '48px 32px', textAlign: 'center', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)' }}>
      <div className="spinner-outer" style={{ margin: '0 auto 28px' }}>
        <div className="spinner-circle"></div>
        <div className="spinner-inner"></div>
      </div>
      <div className="loading-text" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginBottom: '10px', letterSpacing: '-0.02em' }}>
        Analyzing Your Venture
      </div>
      <p className="loading-desc" style={{ color: '#64748B', fontSize: '0.925rem', margin: 0, fontWeight: 500 }}>
        {loadingStepText}
      </p>
    </div>
  );
}
