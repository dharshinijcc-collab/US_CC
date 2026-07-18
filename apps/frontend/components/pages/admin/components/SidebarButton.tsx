'use client';

import React from 'react';
import { ds } from '../ds';

interface SidebarButtonProps {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export default function SidebarButton({ active, icon, label, onClick }: SidebarButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        ...ds.navLink,
        background: active ? '#1E293B' : 'transparent',
        color: active ? '#38BDF8' : '#94A3B8',
        fontWeight: active ? 700 : 500,
        borderLeft: active ? '4px solid #38BDF8' : '4px solid transparent',
        paddingLeft: active ? 16 : 20,
      }}
    >
      {icon}
      {label}
    </button>
  );
}
