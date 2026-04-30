'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '@/context/AdminContext';

interface EditableTextProps {
  contentKey: string; // e.g. 'home.hero.title'
  value: string;
  className?: string;
  as?: React.ElementType;
  style?: React.CSSProperties;
  [key: string]: any; // Allow for other props like href
}

export default function EditableText({ contentKey, value, className = '', as: Component = 'span', style, ...rest }: EditableTextProps) {
  const { isAdminMode, updateContent } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Auto-resize
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (localValue !== value) {
      updateContent(contentKey, localValue);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  if (!isAdminMode) {
    return <Component className={className} style={style} {...rest}>{value}</Component>;
  }

  if (isEditing) {
    return (
      <textarea
        ref={inputRef}
        value={localValue}
        onChange={handleInput}
        onBlur={handleBlur}
        className={`${className} outline-none bg-blue-50/50 border-2 border-blue-400 rounded-lg p-1 w-full resize-none transition-all`}
        style={{ ...style, minHeight: '1em' }}
      />
    );
  }

  return (
    <Component 
      className={`${className} relative group cursor-edit hover:outline hover:outline-2 hover:outline-blue-400 hover:outline-offset-4 rounded-sm transition-all`}
      style={style}
      {...rest}
      onClick={(e: React.MouseEvent) => {
        if (isAdminMode) {
          e.preventDefault();
          e.stopPropagation();
        }
        if (rest.onClick) rest.onClick(e);
        setIsEditing(true);
      }}
    >
      {localValue}
      <div className="absolute -top-6 right-0 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
        Click to Edit
      </div>
    </Component>
  );
}
