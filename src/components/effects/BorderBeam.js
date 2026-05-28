import React from 'react';

export default function BorderBeam({
  className = '',
<<<<<<< HEAD
  style = {},
  children
}) {
  return (
    <div className={className} style={style}>
      {children}
=======
  size = 200,
  duration = 8,
  colorFrom = 'rgba(0, 90, 226, 0)',
  colorTo = '#005AE2',
  borderWidth = 2,
  children
}) {
  return (
    <div className={`cc-border-beam-container ${className}`} style={{ position: 'relative', overflow: 'hidden' }}>
      {/* The animated beam */}
      <div 
        className="cc-border-beam"
        style={{
          position: 'absolute',
          inset: `-${size/2}px`,
          background: `conic-gradient(from 0deg, transparent 70%, ${colorFrom} 80%, ${colorTo} 100%)`,
          animation: `cc-rotateGlow ${duration}s linear infinite`,
          zIndex: 0,
        }}
      />
      {/* Inner mask to hide center of beam */}
      <div 
        className="cc-border-beam-mask"
        style={{
          position: 'absolute',
          inset: `${borderWidth}px`,
          background: 'inherit', // Should inherit background of parent card
          borderRadius: 'inherit',
          zIndex: 1
        }}
      />
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, height: '100%' }}>
        {children}
      </div>
>>>>>>> 6204e84388e7766d313d60e6efb8f989a7e83b6b
    </div>
  );
}
