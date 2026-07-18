'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface MultiSelectProps {
  options: { key: string; label: string; desc?: string; icon: React.ReactNode }[];
  values: string[];
  onChange: (v: string[]) => void;
}

export default function MultiSelect({
  options, values, onChange
}: MultiSelectProps) {
  const toggle = (k: string) => {
    if (k === 'idea_only') { onChange(['idea_only']); return; }
    if (k === 'none') { onChange(['none']); return; }
    
    let next = values.filter(v => v !== 'idea_only' && v !== 'none');
    if (next.includes(k)) {
      next = next.filter(v => v !== k);
    } else {
      next = [...next, k];
    }
    
    if (next.length === 0) {
      if (options.some(o => o.key === 'none')) {
        onChange(['none']);
      } else if (options.some(o => o.key === 'idea_only')) {
        onChange(['idea_only']);
      } else {
        onChange([]);
      }
    } else {
      onChange(next);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(215px, 1fr))', gridAutoRows: '1fr', gap: '12px' }}>
      {options.map(o => {
        const selected = values.includes(o.key);
        return (
          <button
            key={o.key}
            onClick={() => toggle(o.key)}
            className={`bte-multi-btn ${selected ? 'selected' : ''}`}
          >
            <div className="bte-checkbox">
              {selected && <Check size={12} color="#fff" strokeWidth={3} />}
            </div>
            <span className="bte-multi-icon">{o.icon}</span>
            <span className="bte-multi-label">{o.label}</span>
            {o.desc && (
              <div className="bte-card-tooltip">
                <span style={{ fontWeight: 600, color: '#94A3B8', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '2px' }}>Examples</span>
                {o.desc}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
