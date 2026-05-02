'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '@/context/AdminContext';

interface EditableTextProps {
  contentKey: string; // e.g. 'home.hero.title'
  value: string;
  className?: string;
  as?: React.ElementType;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  [key: string]: any; // Allow for other props like href
}

export default function EditableText({ contentKey, value, className = '', as: Component = 'span', style, children, ...rest }: EditableTextProps) {
  const { isAdminMode, updateContent } = useAdmin();
  const [localValue, setLocalValue] = useState(value);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Clean the value from any accidental "EDITABLE" strings
    const cleanValue = typeof value === 'string' ? value.replace(/EDITABLE/g, '').trim() : value;
    setLocalValue(cleanValue);
  }, [value]);

  const handleBlur = () => {
    if (elementRef.current) {
      // Get the text and strip any accidental "EDITABLE" strings
      let newValue = elementRef.current.innerText;
      newValue = newValue.replace(/EDITABLE/g, '').trim();
      
      if (newValue !== value) {
        updateContent(contentKey, newValue);
      }
    }
  };

  // If not in admin mode, just render normally
  if (!isAdminMode) {
    const displayValue = typeof value === 'string' ? value.replace(/EDITABLE/g, '').trim() : value;
    return <Component className={className} style={style} {...rest}>{children || displayValue}</Component>;
  }

  // Strip animation/reveal classes in Admin Mode to prevent "vanishing" (opacity 0)
  const sanitizedClassName = className
    .split(' ')
    .filter(cls => !cls.startsWith('cc-reveal') && !cls.startsWith('cc-delay') && !cls.startsWith('cc-slide') && !cls.startsWith('cc-blur'))
    .join(' ');

  // In admin mode, we use contentEditable to allow direct editing without breaking layout
  // We removed the wrapper div and badge to prevent any layout or content pollution
  return (
    <Component 
      ref={elementRef}
      contentEditable={true}
      suppressContentEditableWarning={true}
      onBlur={handleBlur}
      className={`${sanitizedClassName} outline-none focus:ring-2 focus:ring-blue-400 focus:bg-blue-50/10 rounded-md transition-all cursor-text hover:bg-blue-50/20`}
      style={{ ...style, minWidth: '20px', minHeight: '1em', opacity: 1, visibility: 'visible' }}
      {...rest}
    >
      {localValue}
    </Component>
  );
}
