import React, { useState, useEffect } from 'react';

const CHARS = '!<>-_\\\\/[]{}—=+*^?#________';

export default function ScrambleText({ text, className = '' }) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      setDisplayText(text);
      return;
    }

    let frame = 0;
    const queue = [];
    for (let i = 0; i < text.length; i++) {
      queue.push({
        from: text[i],
        to: text[i],
        start: Math.floor(Math.random() * 20),
        end: Math.floor(Math.random() * 20) + 10,
        char: ''
      });
    }

    let animationFrame;
    const update = () => {
      let output = '';
      let complete = 0;

      for (let i = 0, n = queue.length; i < n; i++) {
        let { from, to, start, end, char } = queue[i];

        if (frame >= end) {
          complete++;
          output += to;
        } else if (frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = CHARS[Math.floor(Math.random() * CHARS.length)];
            queue[i].char = char;
          }
          output += `<span class="cc-scramble-char">${char}</span>`;
        } else {
          output += from;
        }
      }

      setDisplayText(output);

      if (complete === queue.length) {
        setDisplayText(text); // Fix final state without HTML tags
      } else {
        frame++;
        animationFrame = requestAnimationFrame(update);
      }
    };

    update();

    return () => cancelAnimationFrame(animationFrame);
  }, [isHovered, text]);

  return (
    <span 
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      dangerouslySetInnerHTML={{ __html: displayText === text ? text : displayText }}
    />
  );
}
