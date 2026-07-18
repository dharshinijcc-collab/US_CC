'use client';
import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { ds } from '../ds';

interface DeleteConfirmModalProps {
  deleteTarget: { id: string; name: string; permanent: boolean };
  onClose: () => void;
  onConfirm: () => void;
  saveStatus: string;
}

export default function DeleteConfirmModal({ deleteTarget, onClose, onConfirm, saveStatus }: DeleteConfirmModalProps) {
  return (
    <div style={ds.overlay}>
      <div style={{ ...ds.modalCard, maxWidth: 400 }}>
        <div style={ds.modalHeader}>
          <h3 style={{ margin: 0, color: '#EF4444', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={20} /> Confirm Deletion
          </h3>
          <button style={ds.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>
        <div style={ds.modalBody}>
          <p style={{ margin: 0, fontSize: 14, color: '#E2E8F0', lineHeight: 1.6 }}>
            Are you sure you want to {deleteTarget.permanent ? 'PERMANENTLY DELETE' : 'DEACTIVATE'} member <strong>{deleteTarget.name}</strong>?
          </p>
          {deleteTarget.permanent && (
            <p style={{ margin: '8px 0 0 0', fontSize: 12, color: '#FCA5A5', fontWeight: 600 }}>
              ⚠️ WARNING: This will permanently remove the record from the database. This action is irreversible.
            </p>
          )}
        </div>
        <div style={ds.modalFooter}>
          <button style={ds.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={{ ...ds.saveButton, background: '#EF4444' }} onClick={onConfirm} disabled={saveStatus === 'saving'}>
            {saveStatus === 'saving' ? 'Deleting...' : deleteTarget.permanent ? 'Delete Permanently' : 'Deactivate'}
          </button>
        </div>
      </div>
    </div>
  );
}
