'use client';
import React from 'react';
import { X } from 'lucide-react';
import type { OpenPosition } from '../types/admin.types';
import { ds } from '../ds';

interface JobModalProps {
  editingJob: Partial<OpenPosition>;
  setEditingJob: (j: Partial<OpenPosition> | null) => void;
  onClose: () => void;
  onSave: () => void;
  saveStatus: string;
}

export default function JobModal({ editingJob, setEditingJob, onClose, onSave, saveStatus }: JobModalProps) {
  return (
    <div style={ds.overlay}>
      <div style={{ ...ds.modalCard, maxWidth: 540 }}>
        <div style={ds.modalHeader}>
          <h3 style={{ margin: 0, color: '#F1F5F9' }}>{editingJob.id ? 'Edit Position' : 'Add Position'}</h3>
          <button style={ds.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>
        <div style={ds.modalBody}>
          <div style={ds.formGroup}>
            <label style={ds.formLabel}>Job Title</label>
            <input type="text" style={ds.input} value={editingJob.title || ''} onChange={e => setEditingJob({ ...editingJob, title: e.target.value })} placeholder="e.g. Senior Frontend Developer" />
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ ...ds.formGroup, flex: 1 }}>
              <label style={ds.formLabel}>Category</label>
              <select style={ds.input} value={editingJob.category || 'Engineering'} onChange={e => setEditingJob({ ...editingJob, category: e.target.value })}>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
              </select>
            </div>
            <div style={{ ...ds.formGroup, flex: 1 }}>
              <label style={ds.formLabel}>Job Type</label>
              <input type="text" style={ds.input} value={editingJob.type || 'Full Time'} onChange={e => setEditingJob({ ...editingJob, type: e.target.value })} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ ...ds.formGroup, flex: 1 }}>
              <label style={ds.formLabel}>Location</label>
              <input type="text" style={ds.input} value={editingJob.location || 'Chennai, TN'} onChange={e => setEditingJob({ ...editingJob, location: e.target.value })} />
            </div>
            <div style={{ ...ds.formGroup, flex: 1 }}>
              <label style={ds.formLabel}>Experience Level</label>
              <input type="text" style={ds.input} value={editingJob.experience || ''} onChange={e => setEditingJob({ ...editingJob, experience: e.target.value })} placeholder="e.g. Mid-Level (2-3 Yrs)" />
            </div>
          </div>
          <div style={ds.formGroup}>
            <label style={ds.formLabel}>Apply CTA Link or Email</label>
            <input type="text" style={ds.input} value={editingJob.apply_link || ''} onChange={e => setEditingJob({ ...editingJob, apply_link: e.target.value })} placeholder="mailto:careers@crestcode.usa" />
          </div>
          <div style={ds.formGroup}>
            <label style={ds.formLabel}>Application Email</label>
            <input type="email" style={ds.input} value={editingJob.application_email || ''} onChange={e => setEditingJob({ ...editingJob, application_email: e.target.value })} placeholder="careers@crestcode.usa" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" id="job-active-check" checked={editingJob.is_active ?? true} onChange={e => setEditingJob({ ...editingJob, is_active: e.target.checked })} />
            <label htmlFor="job-active-check" style={{ color: '#F1F5F9', fontSize: 13 }}>Display as active on public Careers page</label>
          </div>
        </div>
        <div style={ds.modalFooter}>
          <button style={ds.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={ds.saveButton} onClick={onSave} disabled={saveStatus === 'saving'}>{saveStatus === 'saving' ? 'Saving...' : 'Save Position'}</button>
        </div>
      </div>
    </div>
  );
}
