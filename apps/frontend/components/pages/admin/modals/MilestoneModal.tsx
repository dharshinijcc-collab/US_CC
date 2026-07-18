'use client';
import React from 'react';
import { X } from 'lucide-react';
import type { Milestone } from '../types/admin.types';
import { ds } from '../ds';

interface MilestoneModalProps {
  editingMilestone: Partial<Milestone>;
  setEditingMilestone: (m: Partial<Milestone> | null) => void;
  onClose: () => void;
  onSave: () => void;
  saveStatus: string;
}

export default function MilestoneModal({ editingMilestone, setEditingMilestone, onClose, onSave, saveStatus }: MilestoneModalProps) {
  return (
    <div style={ds.overlay}>
      <div style={{ ...ds.modalCard, maxWidth: 540 }}>
        <div style={ds.modalHeader}>
          <h3 style={{ margin: 0, color: '#F1F5F9' }}>{editingMilestone.id ? 'Edit Milestone' : 'Add Milestone'}</h3>
          <button style={ds.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>
        <div style={ds.modalBody}>
          <div style={ds.formGroup}>
            <label style={ds.formLabel}>Year</label>
            <input type="text" style={ds.input} value={editingMilestone.year || ''} onChange={e => setEditingMilestone({ ...editingMilestone, year: e.target.value })} placeholder="e.g. 2023" />
          </div>
          <div style={ds.formGroup}>
            <label style={ds.formLabel}>Title</label>
            <input type="text" style={ds.input} value={editingMilestone.title || ''} onChange={e => setEditingMilestone({ ...editingMilestone, title: e.target.value })} placeholder="e.g. Launched our first product" />
          </div>
          <div style={ds.formGroup}>
            <label style={ds.formLabel}>Description</label>
            <textarea style={ds.textarea} rows={4} value={editingMilestone.description || ''} onChange={e => setEditingMilestone({ ...editingMilestone, description: e.target.value })} placeholder="Describe this milestone..." />
          </div>
          <div style={ds.formGroup}>
            <label style={ds.formLabel}>Image URL (optional)</label>
            <input type="text" style={ds.input} value={editingMilestone.image_url || ''} onChange={e => setEditingMilestone({ ...editingMilestone, image_url: e.target.value || null })} placeholder="https://..." />
          </div>
        </div>
        <div style={ds.modalFooter}>
          <button style={ds.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={ds.saveButton} onClick={onSave} disabled={saveStatus === 'saving'}>{saveStatus === 'saving' ? 'Saving...' : 'Save Milestone'}</button>
        </div>
      </div>
    </div>
  );
}
