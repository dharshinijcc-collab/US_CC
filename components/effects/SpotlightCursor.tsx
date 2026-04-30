'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function SpotlightCursor({ 
  color = 'rgba(0, 90, 226, 0.15)', 
  size = 400 
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<any>(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsHovered(true);
    };

    const handleMouseLeave = () => setIsHovered(false);

    const container = containerRef.current;
    if (container) {
      // Find the parent element to attach events to
      const parent = container.parentElement;
      if (parent) {
        parent.style.position = parent.style.position || 'relative';
        parent.addEventListener('mousemove', handleMouseMove);
        parent.addEventListener('mouseleave', handleMouseLeave);
        
        return () => {
          parent.removeEventListener('mousemove', handleMouseMove);
          parent.removeEventListener('mouseleave', handleMouseLeave);
        };
      }
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden'
      }}
    >
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          transform: `translate(${position.x - size/2}px, ${position.y - size/2}px)`,
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
          filter: 'blur(40px)'
        }}
      />
    </div>
  );
}


