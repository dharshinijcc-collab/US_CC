'use client';

import React from 'react';

interface SingleSelectProps<T extends string> {
  options: { key: T; label: string; icon: React.ReactNode; desc?: string }[];
  value: T | null;
  onChange: (v: T) => void;
}

export default function SingleSelect<T extends string>({
  options, value, onChange
}: SingleSelectProps<T>) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(215px, 1fr))', gridAutoRows: '1fr', gap: '12px' }}>
      {options.map(o => (
        <button
          key={o.key}
          onClick={() => onChange(o.key)}
          className={`bte-option-btn ${value === o.key ? 'selected' : ''}`}
        >
          <div className="bte-option-icon">{o.icon}</div>
          <div className="bte-option-label">{o.label}</div>
          {o.desc && <div className="bte-option-desc">{o.desc}</div>}
        </button>
      ))}
    </div>
  );
}
