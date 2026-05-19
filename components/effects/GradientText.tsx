'use client';

import React from 'react';

export default function GradientText({ text, className = '' }) {
  return (
    <span className={`cc-gradient-text ${className}`} style={{ fontWeight: 'inherit' }}>
      {text}
    </span>
  );
}


