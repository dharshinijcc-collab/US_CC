'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Settings, Edit } from 'lucide-react';

interface AdminEditBadgeProps {
  tab: string;
  editId?: string;
  label?: string;
}

export default function AdminEditBadge({ tab, editId, label = 'Edit this page' }: AdminEditBadgeProps) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch('/api/auth/check')
      .then(res => res.json())
      .then(json => {
        if (json.authenticated) {
          setIsAdmin(true);
        }
      })
      .catch(() => {});
  }, []);

  if (!isAdmin) return null;

  const url = editId 
    ? `/admin/dashboard?tab=${tab}&edit=${editId}` 
    : `/admin/dashboard?tab=${tab}`;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      pointerEvents: 'auto'
    }}>
      <Link href={url} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(56, 189, 248, 0.4)',
        padding: '10px 18px',
        borderRadius: '100px',
        color: '#38BDF8',
        fontSize: '13px',
        fontWeight: 700,
        textDecoration: 'none',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(56, 189, 248, 0.2)',
        transition: 'all 0.2s ease-in-out',
        fontFamily: 'sans-serif'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = '#38BDF8';
        e.currentTarget.style.boxShadow = '0 12px 30px -5px rgba(0, 0, 0, 0.6), 0 0 20px rgba(56, 189, 248, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
        e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(56, 189, 248, 0.2)';
      }}
      >
        <Settings size={15} className="animate-spin-slow" />
        <Edit size={13} />
        <span>{label}</span>
      </Link>
    </div>
  );
}
