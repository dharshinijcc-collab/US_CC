'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

interface CountUpProps {
  end: string | number;
  duration?: number;
  start?: boolean;
  decimals?: number;
}

export default function CountUp({ end, duration = 2, start, decimals = 0 }: CountUpProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  
  // If 'start' is provided from parent, use it. Otherwise detect in-view state.
  const internalInView = useInView(ref, { once: true, margin: "-50px" });
  const isInView = start !== undefined ? start : internalInView;
  
  const endNumber = typeof end === 'number' ? end : parseFloat(String(end || '0').replace(/,/g, '')) || 0;

  useEffect(() => {
    if (isInView && endNumber > 0) {
      let startTime: number;
      let animationFrame: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / (duration * 1000), 1);
        
        // easeOutQuart: smoother and finishes more predictably
        const easedProgress = 1 - Math.pow(1 - progress, 4);
        
        const currentCount = endNumber * easedProgress;
        setCount(currentCount);

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        } else {
          setCount(endNumber);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    } else if (!isInView) {
      setCount(0);
    }
  }, [isInView, endNumber, duration]);

  const formattedCount = Math.floor(count).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return <span ref={ref}>{formattedCount}</span>;
}
