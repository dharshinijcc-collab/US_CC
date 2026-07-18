'use client';
import React from 'react';
import { X, Upload } from 'lucide-react';
import type { TeamMember } from '@/types/team.types';
import { ds } from '../ds';

interface TeamMemberModalProps {
  editingMember: Partial<TeamMember>;
  setEditingMember: (m: Partial<TeamMember> | null) => void;
  onClose: () => void;
  onSave: () => void;
  saveStatus: string;
  imageUploading: boolean;
  handleAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TeamMemberModal({ editingMember, setEditingMember, onClose, onSave, saveStatus, imageUploading, handleAvatarUpload }: TeamMemberModalProps) {
  return (
    <div style={ds.overlay}>
      <div style={ds.modalCard}>
        <div style={ds.modalHeader}>
          <h3 style={{ margin: 0, color: '#F1F5F9' }}>{editingMember.id ? 'Edit Person Details' : 'Add New Person'}</h3>
          <button style={ds.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>
        <div style={ds.modalBody}>
          <div style={ds.formGroup}>
            <label style={ds.formLabel}>Full Name</label>
            <input type="text" style={ds.input} value={editingMember.name || ''} onChange={e => setEditingMember({ ...editingMember, name: e.target.value })} placeholder="e.g. Jane Smith" />
          </div>
          <div style={ds.formGroup}>
            <label style={ds.formLabel}>Role / Title</label>
            <input type="text" style={ds.input} value={editingMember.role || ''} onChange={e => setEditingMember({ ...editingMember, role: e.target.value })} placeholder="e.g. Lead Venture Architect" />
          </div>
          <div style={ds.formGroup}>
            <label style={ds.formLabel}>Category</label>
            <select style={ds.input} value={editingMember.category || 'Team Member'} onChange={e => setEditingMember({ ...editingMember, category: e.target.value as any })}>
              <option value="Founder">Founder</option>
              <option value="Partner">Partner</option>
              <option value="Team Member">Team Member</option>
              <option value="Advisor">Advisor</option>
            </select>
          </div>
          <div style={ds.formGroup}>
            <label style={ds.formLabel}>Bio Narrative</label>
            <textarea style={ds.textarea} rows={4} value={editingMember.bio || ''} onChange={e => setEditingMember({ ...editingMember, bio: e.target.value })} placeholder="Tell their story and expertise..." />
          </div>
          <div style={ds.formGroup}>
            <label style={ds.formLabel}>Display Order Weight</label>
            <input type="number" style={ds.input} value={editingMember.display_order ?? 1} onChange={e => setEditingMember({ ...editingMember, display_order: parseInt(e.target.value) || 1 })} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <input type="checkbox" id="m-active" style={{ width: 16, height: 16, cursor: 'pointer' }} checked={editingMember.is_active ?? true} onChange={e => setEditingMember({ ...editingMember, is_active: e.target.checked })} />
            <label htmlFor="m-active" style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600, cursor: 'pointer' }}>Active (Visible on Website)</label>
          </div>
          <div style={ds.formGroup}>
            <label style={ds.formLabel}>Profile Avatar Image</label>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <input type="file" accept="image/*" style={{ display: 'none' }} id="member-img-upload" onChange={handleAvatarUpload} disabled={imageUploading} />
              <label htmlFor="member-img-upload" style={{ ...ds.uploadLabelBtn, opacity: imageUploading ? 0.6 : 1, cursor: imageUploading ? 'not-allowed' : 'pointer' }}>
                <Upload size={14} /> {imageUploading ? 'Uploading...' : 'Upload Image File'}
              </label>
              <input type="text" style={{ ...ds.input, flex: 1, margin: 0 }} value={editingMember.image_url || ''} onChange={e => setEditingMember({ ...editingMember, image_url: e.target.value })} placeholder="Or enter public image URL directly" />
            </div>
            {editingMember.image_url && (
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.08)' }}>
                  <img src={editingMember.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <button style={{ color: '#EF4444', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }} onClick={() => setEditingMember({ ...editingMember, image_url: '' })}>Clear Image</button>
              </div>
            )}
          </div>
        </div>
        <div style={ds.modalFooter}>
          <button style={ds.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={ds.saveButton} onClick={onSave} disabled={saveStatus === 'saving' || imageUploading}>{saveStatus === 'saving' ? 'Saving...' : 'Save Person'}</button>
        </div>
      </div>
    </div>
  );
}
