import React, { useState, useEffect, useRef } from 'react';

export default function TypewriterText({ 
  text, 
  delay = 100, 
  startDelay = 500,
  className = ''
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          setIsTyping(true);
          
          let i = 0;
          setTimeout(() => {
            const timer = setInterval(() => {
              if (i < text.length) {
                setDisplayedText(text.substring(0, i + 1));
                i++;
              } else {
                clearInterval(timer);
                setIsTyping(false);
              }
            }, delay);
          }, startDelay);

          observer.unobserve(container);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [text, delay, startDelay]);

  return (
    <span ref={containerRef} className={className}>
      {displayedText}
      <span 
        style={{ 
          display: 'inline-block', 
          width: '0.1em', 
          height: '1em', 
          backgroundColor: 'currentColor', 
          marginLeft: '2px',
          verticalAlign: 'baseline',
          animation: isTyping ? 'none' : 'cc-blink 1s step-end infinite',
          opacity: isTyping ? 1 : 0
        }} 
      />
    </span>
  );
}
