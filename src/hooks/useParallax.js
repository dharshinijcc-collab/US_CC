import { useEffect, useState } from 'react';

/**
 * useParallax — Returns a Y offset value based on window scroll.
 * 
 * @param {number} speed - The multiplier for the scroll speed.
 * @returns {number} The calculated Y offset.
 */
export default function useParallax(speed = 0.5) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY * speed);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed]);

  return offset;
}
