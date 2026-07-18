'use client';
import React from 'react';
import { X } from 'lucide-react';
import type { FAQ } from '../types/admin.types';
import { ds } from '../ds';

interface FaqModalProps {
  editingFaq: Partial<FAQ>;
  setEditingFaq: (f: Partial<FAQ> | null) => void;
  onClose: () => void;
  onSave: () => void;
  saveStatus: string;
}

export default function FaqModal({ editingFaq, setEditingFaq, onClose, onSave, saveStatus }: FaqModalProps) {
  return (
    <div style={ds.overlay}>
      <div style={{ ...ds.modalCard, maxWidth: 540 }}>
        <div style={ds.modalHeader}>
          <h3 style={{ margin: 0, color: '#F1F5F9' }}>{editingFaq.id ? 'Edit FAQ' : 'Add FAQ'}</h3>
          <button style={ds.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>
        <div style={ds.modalBody}>
          <div style={ds.formGroup}>
            <label style={ds.formLabel}>Category</label>
            <select style={ds.input} value={editingFaq.category || 'engagement'} onChange={e => setEditingFaq({ ...editingFaq, category: e.target.value })}>
              <option value="engagement">Engagement Model</option>
              <option value="product">Product & Scope</option>
              <option value="security">Security & IP</option>
            </select>
          </div>
          <div style={ds.formGroup}>
            <label style={ds.formLabel}>Question Text</label>
            <input type="text" style={ds.input} value={editingFaq.question || ''} onChange={e => setEditingFaq({ ...editingFaq, question: e.target.value })} placeholder="e.g. Do you sign NDAs?" />
          </div>
          <div style={ds.formGroup}>
            <label style={ds.formLabel}>Answer Text</label>
            <textarea style={ds.textarea} rows={4} value={editingFaq.answer || ''} onChange={e => setEditingFaq({ ...editingFaq, answer: e.target.value })} placeholder="Provide a detailed, helpful answer..." />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
            <input type="checkbox" id="faq-active-check" checked={editingFaq.is_active ?? true} onChange={e => setEditingFaq({ ...editingFaq, is_active: e.target.checked })} />
            <label htmlFor="faq-active-check" style={{ color: '#F1F5F9', fontSize: 13 }}>Display as active on public FAQ list</label>
          </div>
        </div>
        <div style={ds.modalFooter}>
          <button style={ds.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={ds.saveButton} onClick={onSave} disabled={saveStatus === 'saving'}>{saveStatus === 'saving' ? 'Saving...' : 'Save FAQ'}</button>
        </div>
      </div>
    </div>
  );
}
