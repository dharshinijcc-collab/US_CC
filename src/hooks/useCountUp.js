import { useEffect, useRef, useState } from 'react';

/**
 * useCountUp — animates a number from 0 to `target` when the returned ref
 * element enters the viewport.
 *
 * @param {number} target   — final value
 * @param {number} duration — ms for the animation (default 1800)
 * @returns {{ ref, displayValue }}
 */
export default function useCountUp(target, duration = 1800) {
  const ref = useRef(null);
  const [displayValue, setDisplayValue] = useState(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const start = performance.now();
          const numericTarget = parseFloat(String(target).replace(/[^0-9.]/g, ''));

          const tick = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * numericTarget;

            // Format
            if (numericTarget >= 1000) {
              setDisplayValue(Math.floor(current).toLocaleString());
            } else if (numericTarget % 1 !== 0) {
              setDisplayValue(current.toFixed(1));
            } else {
              setDisplayValue(Math.floor(current));
            }

            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { ref, displayValue };
}
