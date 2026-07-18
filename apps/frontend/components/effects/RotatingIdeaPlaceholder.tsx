'use client';
import React, { useState, useEffect } from 'react';

interface RotatingIdeaPlaceholderProps {
  examples: string[];
  idea: string;
  isLoading: boolean;
  onIdeaChange: (value: string) => void;
}

export default function RotatingIdeaPlaceholder({
  examples,
  idea,
  isLoading,
  onIdeaChange,
}: RotatingIdeaPlaceholderProps) {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [fadeState, setFadeState] = useState<'fade-in' | 'fade-out'>('fade-in');

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

  const showPlaceholder = !idea && !isFocused;

  return (
    <div style={{ position: 'relative', width: '100%', height: '96px' }}>
      <textarea
        id="idea"
        name="idea"
        className="idea-textarea"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          resize: 'none',
          padding: '16px 20px',
          fontSize: '1.05rem',
          fontFamily: 'inherit',
          color: '#0A0F1C',
          backgroundColor: 'transparent',
          outline: 'none',
          borderRadius: '14px',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 2,
        }}
        value={idea}
        onChange={(e) => onIdeaChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={isLoading}
        maxLength={500}
      />
      {/* Custom animated placeholder overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: '16px 20px',
        fontSize: '1.05rem',
        fontFamily: 'inherit',
        color: '#94A3B8',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: showPlaceholder ? (fadeState === 'fade-in' ? 0.75 : 0) : 0,
        transform: showPlaceholder ? (fadeState === 'fade-in' ? 'translateY(0)' : 'translateY(-6px)') : 'translateY(0)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        whiteSpace: 'pre-wrap',
        lineHeight: 1.5,
      }}>
        {examples[exampleIndex]}
      </div>
    </div>
  );
}
