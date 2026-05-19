'use client';

import React from 'react';

export default function GrainOverlay({ opacity = 0.04 }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: opacity,
        overflow: 'hidden'
      }}
    >
      <svg style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
        <filter id="cc-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#cc-noise)" />
      </svg>
    </div>
  );
}


