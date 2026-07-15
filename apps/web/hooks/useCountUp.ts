import { useEffect, useRef, useState } from 'react';

/**
 * useCountUp — animates a number from 0 to `target` when the returned ref
 * element enters the viewport.
 *
 * @param {string | number} target   — final value
 * @param {number} duration — ms for the animation (default 1800)
 * @returns {{ ref: React.RefObject<any>, displayValue: string | number | null }}
 */
export default function useCountUp(target: string | number, duration = 1800) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);
  const [displayValue, setDisplayValue] = useState<string | number | null>(null);
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

          if (isNaN(numericTarget)) {
             setDisplayValue(target);
             return;
          }

          const tick = (now: number) => {
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
