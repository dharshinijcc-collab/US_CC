'use client';

import React, { useState, useEffect } from 'react';

interface Burst {
  id: number;
  x: number;
  y: number;
}

export default function ClickBurstEffect() {
  const [bursts, setBursts] = useState<Burst[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newBurst = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY
      };
      
      setBursts(prev => [...prev, newBurst]);
      
      setTimeout(() => {
        setBursts(prev => prev.filter(b => b.id !== newBurst.id));
      }, 600);
    };

    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: 9999999, // Render on top of all popups & pages
      overflow: 'hidden'
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes stroke-out-up {
          0% { height: 0px; opacity: 1; transform: translateY(0px); }
          100% { height: 20px; opacity: 0; transform: translateY(-24px); }
        }
        @keyframes stroke-out-down {
          0% { height: 0px; opacity: 1; transform: translateY(0px); }
          100% { height: 20px; opacity: 0; transform: translateY(24px); }
        }
        @keyframes stroke-out-left {
          0% { width: 0px; opacity: 1; transform: translateX(0px); }
          100% { width: 20px; opacity: 0; transform: translateX(-24px); }
        }
        @keyframes stroke-out-right {
          0% { width: 0px; opacity: 1; transform: translateX(0px); }
          100% { width: 20px; opacity: 0; transform: translateX(24px); }
        }
      `}} />
      
      {bursts.map(burst => (
        <div 
          key={burst.id} 
          style={{
            position: 'absolute',
            left: burst.x,
            top: burst.y,
            width: 0,
            height: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* North Line */}
          <div style={{
            position: 'absolute',
            bottom: '4px',
            width: '2px',
            backgroundColor: '#005AE2', // Premium Blue matching theme
            borderRadius: '1px',
            animation: 'stroke-out-up 0.5s cubic-bezier(0.1, 0.8, 0.3, 1) forwards'
          }} />
          
          {/* South Line */}
          <div style={{
            position: 'absolute',
            top: '4px',
            width: '2px',
            backgroundColor: '#005AE2',
            borderRadius: '1px',
            animation: 'stroke-out-down 0.5s cubic-bezier(0.1, 0.8, 0.3, 1) forwards'
          }} />

          {/* West Line */}
          <div style={{
            position: 'absolute',
            right: '4px',
            height: '2px',
            backgroundColor: '#005AE2',
            borderRadius: '1px',
            animation: 'stroke-out-left 0.5s cubic-bezier(0.1, 0.8, 0.3, 1) forwards'
          }} />

          {/* East Line */}
          <div style={{
            position: 'absolute',
            left: '4px',
            height: '2px',
            backgroundColor: '#005AE2',
            borderRadius: '1px',
            animation: 'stroke-out-right 0.5s cubic-bezier(0.1, 0.8, 0.3, 1) forwards'
          }} />
        </div>
      ))}
    </div>
  );
}
