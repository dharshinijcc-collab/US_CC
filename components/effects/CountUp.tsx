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
  const internalInView = useInView(ref, { once: true, margin: "-50px" });
  const isInView = start !== undefined ? start : internalInView;
  
  // Parse the number from string if needed (e.g., "50,000" -> 50000)
  const endNumber = typeof end === 'number' ? end : parseFloat(end.toString().replace(/,/g, '')) || 0;

  useEffect(() => {
    if (isInView && endNumber > 0) {
      let startTime: number;
      let animationFrame: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / (duration * 1000), 1);
        
        // Easing function (easeOutExpo)
        const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        
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
    }
  }, [isInView, endNumber, duration]);

  const formattedCount = count.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return <span ref={ref}>{formattedCount}</span>;
}
