import { useState, useEffect } from 'react';

/**
 * useNavShrink — returns isScrolled (true when page has scrolled > threshold px)
 * Used to apply a glassy compact state to the floating navbar.
 * @param {number} threshold — scroll px before activating (default 60)
 */
export default function useNavShrink(threshold = 60) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // check on mount
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return isScrolled;
}
