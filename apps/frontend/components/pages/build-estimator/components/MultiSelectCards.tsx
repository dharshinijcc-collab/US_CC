'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface MultiSelectCardsProps<T extends string> {
  options: { key: T; label: string; icon: React.ReactNode; desc?: string }[];
  values: T[];
  onChange: (v: T[]) => void;
}

export default function MultiSelectCards<T extends string>({
  options, values, onChange
}: MultiSelectCardsProps<T>) {
  const toggle = (k: T) => {
    if (k === 'none') { onChange(['none' as T]); return; }
    let next = values.filter(v => v !== ('none' as T));
    if (next.includes(k)) {
      next = next.filter(v => v !== k);
    } else {
      next = [...next, k];
    }
    if (next.length === 0) {
      onChange(['none' as T]);
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
            className={`bte-option-btn ${selected ? 'selected' : ''}`}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '10px' }}>
              <div className="bte-option-icon">{o.icon}</div>
              <div className="bte-checkbox">
                {selected && <Check size={12} color="#fff" strokeWidth={3} />}
              </div>
            </div>
            <div className="bte-option-label">{o.label}</div>
            {o.desc && <div className="bte-option-desc">{o.desc}</div>}
          </button>
        );
      })}
    </div>
  );
}
