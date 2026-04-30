import { useEffect, useRef, useCallback } from 'react';

/**
 * useMagneticHover — attaches a cursor-gravity magnetic pull effect to an element.
 *
 * The element softly follows the cursor while hovered, snapping back on leave.
 * @param {number} strength — how many px the element moves at most (default 18)
 * @returns ref — attach to the element
 */
export default function useMagneticHover<T = any>(strength = 18) {
  const ref = useRef<any>(null);

  const onMouseMove = useCallback((e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = ((e.clientX - cx) / (rect.width / 2)) * strength;
    const dy = ((e.clientY - cy) / (rect.height / 2)) * strength;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  }, [strength]);

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'translate(0px, 0px)';
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);
    return () => {
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [onMouseMove, onMouseLeave]);

  return ref;
}
