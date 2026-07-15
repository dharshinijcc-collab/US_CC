'use client';

import React, { useState, useEffect } from 'react';

export default function GlobalCursorGlow() {
  const [position, setPosition] = useState({ x: -200, y: -200 });
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkMobile);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  if (isMobile) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 1s ease',
      }}
    >
      {/* Large Soft Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 90, 226, 0.08) 0%, transparent 60%)',
          transform: `translate(${position.x - 300}px, ${position.y - 300}px)`,
          transition: 'transform 0.4s cubic-bezier(0.1, 0, 0.2, 1)',
          filter: 'blur(80px)',
          mixBlendMode: 'plus-lighter',
        }}
      />
      {/* Subtle Focus Glow */}
      <div
        style={{
          position: 'absolute',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 132, 255, 0.15) 0%, transparent 70%)',
          transform: `translate(${position.x - 60}px, ${position.y - 60}px)`,
          transition: 'transform 0.2s cubic-bezier(0.1, 0, 0.2, 1)',
          filter: 'blur(20px)',
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );
}

