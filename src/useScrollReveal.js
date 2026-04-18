import { useEffect } from 'react';

/**
 * useScrollReveal — attaches IntersectionObserver to elements with
 * data-reveal attribute and adds 'cc-visible' class when they enter the viewport.
 *
 * Usage: call useScrollReveal() inside any page component.
 * Mark elements with className="cc-reveal" (or cc-reveal-left / cc-reveal-right / cc-reveal-scale)
 * and optionally data-reveal-delay="100" etc.
 */
export default function useScrollReveal() {
  useEffect(() => {
    const revealClasses = [
      '.cc-reveal',
      '.cc-reveal-left',
      '.cc-reveal-right',
      '.cc-reveal-scale',
      '.cc-stat-reveal',
    ];

    const elements = document.querySelectorAll(revealClasses.join(','));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = el.dataset.revealDelay || 0;
            setTimeout(() => {
              el.classList.add('cc-visible');
            }, Number(delay));
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}
