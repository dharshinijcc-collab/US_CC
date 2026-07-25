'use client';

import React, { useState, useEffect, useRef } from 'react';

interface RotatingIdeaPlaceholderProps {
  examples: string[];
  idea: string;
  isLoading: boolean;
  onIdeaChange: (value: string) => void;
  onSubmit: () => void;
  isFocused: boolean;
  setIsFocused: (focused: boolean) => void;
}

export default function RotatingIdeaPlaceholder({
  examples,
  idea,
  isLoading,
  onIdeaChange,
  onSubmit,
  isFocused,
  setIsFocused,
}: RotatingIdeaPlaceholderProps) {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'fade-in' | 'fade-out'>('fade-in');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Rotating placeholder logic
  useEffect(() => {
    if (idea.trim()) return;
    const interval = setInterval(() => {
      setFadeState('fade-out');
      setTimeout(() => {
        setExampleIndex((prev) => (prev + 1) % examples.length);
        setFadeState('fade-in');
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, [idea, examples.length]);

  // Auto-grow logic
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    textarea.style.height = 'auto';
    const newHeight = Math.min(Math.max(textarea.scrollHeight, 80), 320);
    textarea.style.height = `${newHeight}px`;
  }, [idea]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (idea.trim() && !isLoading) {
        onSubmit();
      }
    }
  };

  const showPlaceholder = !idea;
  // Fades placeholder from 75% to 35% when focused, 0% when typing
  const placeholderOpacity = idea 
    ? 0 
    : (isFocused 
        ? 0.35 
        : (fadeState === 'fade-in' ? 0.75 : 0)
      );

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <textarea
        ref={textareaRef}
        id="idea"
        name="idea"
        className="idea-textarea"
        style={{
          width: '100%',
          minHeight: '80px',
          border: 'none',
          resize: 'none',
          padding: '0',
          fontSize: '1.05rem', // Smaller elegant font size
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          fontWeight: 500,
          color: '#111827', // Dark slate/gray color (never pure black)
          backgroundColor: 'transparent',
          outline: 'none',
          position: 'relative',
          zIndex: 2,
          caretColor: '#005AE2', // Thick modern caret color matching theme
          lineHeight: '1.55',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          display: 'block'
        }}
        value={idea}
        onChange={(e) => onIdeaChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        maxLength={500}
        placeholder=""
      />
      {/* Custom animated placeholder overlay */}
      {showPlaceholder && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '0',
          fontSize: '1.05rem', // Matching smaller placeholder font size
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          fontWeight: 500,
          color: '#9CA3AF',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: placeholderOpacity,
          transform: isFocused ? 'translateY(0)' : (fadeState === 'fade-in' ? 'translateY(0)' : 'translateY(-4px)'),
          transition: 'opacity 250ms ease, transform 250ms ease',
          whiteSpace: 'pre-wrap',
          lineHeight: '1.55',
          letterSpacing: '-0.02em',
        }}>
          {examples[exampleIndex]}
        </div>
      )}
    </div>
  );
}
