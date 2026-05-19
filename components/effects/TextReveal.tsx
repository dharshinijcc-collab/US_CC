'use client';

import React, { useEffect, useRef } from 'react';

export default function TextReveal({ 
  text, 
  className = '', 
  delay = 0,
  as: Component = 'div' as any 
}) {
  const Comp: any = Component;
  const containerRef = useRef<any>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const words = container.querySelectorAll('.word-inner');
          words.forEach((word, i) => {
            setTimeout(() => {
              word.style.transform = 'translateY(0)';
              word.style.opacity = '1';
            }, delay + i * 40); // 40ms stagger between words
          });
          observer.unobserve(container);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [delay]);

  const words = text.split(' ');

  return (
    <Comp ref={containerRef} className={className} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25em' }}>
      {words.map((word, i) => (
        <span 
          key={i} 
          className="word-outer"
          style={{ 
            display: 'inline-block', 
            overflow: 'hidden',
            verticalAlign: 'top'
          }}
        >
          <span 
            className="word-inner"
            style={{ 
              display: 'inline-block',
              transform: 'translateY(100%)',
              opacity: 0,
              transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease',
              willChange: 'transform, opacity'
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </Comp>
  );
}
