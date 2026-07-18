'use client';
import React from 'react';
import { ArrowUp, ArrowDown, Edit, Trash2, Plus } from 'lucide-react';
import type { Milestone } from '../types/admin.types';
import { ds } from '../ds';

interface MilestonesTabProps {
  milestones: Milestone[];
  openAddMilestone: () => void;
  openEditMilestone: (m: Milestone) => void;
  handleDeleteMilestone: (id: string) => void;
  moveMilestoneOrder: (m: Milestone, direction: 'up' | 'down') => void;
}

export default function MilestonesTab({ milestones, openAddMilestone, openEditMilestone, handleDeleteMilestone, moveMilestoneOrder }: MilestonesTabProps) {
  return (
    <div style={ds.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={ds.cardTitle}>Manage Timeline Milestones</h3>
        <button style={ds.addButton} onClick={openAddMilestone}><Plus size={16} /> Add Milestone</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {milestones.map((m, idx) => (
          <div key={m.id} style={{ display: 'flex', gap: 16, background: '#0F172A', border: '1px solid #1E293B', borderRadius: 12, padding: 20, alignItems: 'center' }}>
            <div style={{ minWidth: 120, paddingRight: 10, fontSize: 22, fontWeight: 'bold', color: '#38BDF8', textAlign: 'center' }}>{m.year}</div>
            {m.image_url && <img src={m.image_url} alt={m.title} style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover' }} />}
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 6px 0', color: '#F1F5F9', fontSize: 16 }}>{m.title}</h4>
              <p style={{ margin: 0, color: '#94A3B8', fontSize: 13, lineHeight: 1.5 }}>{m.description}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', gap: 4 }}>
                <button style={ds.orderBtn} onClick={() => moveMilestoneOrder(m, 'up')} disabled={idx === 0}><ArrowUp size={14} /></button>
                <button style={ds.orderBtn} onClick={() => moveMilestoneOrder(m, 'down')} disabled={idx === milestones.length - 1}><ArrowDown size={14} /></button>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button style={{ ...ds.editBtn, flex: 1 }} onClick={() => openEditMilestone(m)}><Edit size={14} /></button>
                <button style={{ ...ds.deleteBtn, flex: 1 }} onClick={() => handleDeleteMilestone(m.id)}><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
