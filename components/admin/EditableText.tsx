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
  const [isEditing, setIsEditing] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Clean the value from any accidental "EDITABLE" strings
    const cleanValue = typeof value === 'string' ? value.replace(/EDITABLE/g, '').trim() : value;
    setLocalValue(cleanValue);
  }, [value]);

  const handleBlur = () => {
    setIsEditing(false); // Turn off edit mode
    if (elementRef.current) {
      // Get the text and strip any accidental "EDITABLE" strings
      let newValue = elementRef.current.innerText;
      newValue = newValue.replace(/EDITABLE/g, '').trim();
      
      if (newValue !== value) {
        updateContent(contentKey, newValue);
      }
    }
  };

  const handleFocus = () => {
    if (isAdminMode) {
      setIsEditing(true);
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

  // In admin mode, elements are only editable when actively clicked (focused)
  return (
    <Component 
      ref={elementRef}
      contentEditable={isEditing}
      suppressContentEditableWarning={true}
      onFocus={handleFocus}
      onClick={handleFocus}
      onBlur={handleBlur}
      className={`${sanitizedClassName} outline-none transition-all ${isEditing ? 'ring-2 ring-blue-400 bg-blue-50/10 cursor-text' : 'hover:bg-blue-50/20 cursor-pointer rounded-md'}`}
      style={{ ...style, minWidth: '20px', minHeight: '1em', opacity: 1, visibility: 'visible' }}
      {...rest}
    >
      {localValue}
    </Component>
  );
}
