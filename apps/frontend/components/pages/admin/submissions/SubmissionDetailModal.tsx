'use client';

import React from 'react';
import { X, Send, XCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { Submission, Note, HistoryItem } from './types';
import { style } from './styles';

interface SubmissionDetailModalProps {
  selectedSub: Submission;
  selectedNotes: Note[];
  selectedHistory: HistoryItem[];
  newNoteText: string;
  setNewNoteText: (val: string) => void;
  editStatus: string;
  setEditStatus: (val: string) => void;
  editReviewer: string;
  setEditReviewer: (val: string) => void;
  editInternalNotes: string;
  setEditInternalNotes: (val: string) => void;
  updatingSub: boolean;
  handleSaveEdits: () => void;
  handleAddNote: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function SubmissionDetailModal({
  selectedSub,
  selectedNotes,
  selectedHistory,
  newNoteText,
  setNewNoteText,
  editStatus,
  setEditStatus,
  editReviewer,
  setEditReviewer,
  editInternalNotes,
  setEditInternalNotes,
  updatingSub,
  handleSaveEdits,
  handleAddNote,
  onClose,
}: SubmissionDetailModalProps) {
  return (
    <div style={style.modalOverlay}>
      <div style={style.modalContent}>
        <div style={style.modalHeader}>
          <div>
            <h3 style={style.modalTitle}>Reviewing Submission ({selectedSub.form_type.toUpperCase()})</h3>
            <p style={style.modalSubtitle}>ID: {selectedSub.id}</p>
          </div>
          <button onClick={onClose} style={style.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <div style={style.modalBody}>
          {/* Dynamic Payload Render */}
          <div style={style.modalSection}>
            <h4 style={style.sectionTitle}>User Profile & Form Payload</h4>
            <div style={style.payloadGrid}>
              <div style={style.payloadItem}>
                <strong>Name:</strong> {selectedSub.name}
              </div>
              <div style={style.payloadItem}>
                <strong>Email:</strong> {selectedSub.email}
              </div>
              {selectedSub.phone && (
                <div style={style.payloadItem}>
                  <strong>Phone:</strong> {selectedSub.phone}
                </div>
              )}
              {selectedSub.company && (
                <div style={style.payloadItem}>
                  <strong>Company:</strong> {selectedSub.company}
                </div>
              )}
              {Object.entries(selectedSub.payload).map(([key, val]: [string, any]) => {
                const displayKey = key.replace(/_/g, ' ').toUpperCase();
                if (typeof val === 'object') {
                  return (
                    <div key={key} style={{ ...style.payloadItem, gridColumn: 'span 2' }}>
                      <strong>{displayKey}:</strong>
                      <pre style={style.preformatted}>{JSON.stringify(val, null, 2)}</pre>
                    </div>
                  );
                }
                if (key.includes('url') && val) {
                  return (
                    <div key={key} style={style.payloadItem}>
                      <strong>{displayKey}:</strong>{' '}
                      <a href={val} target="_blank" rel="noreferrer" style={style.linkText}>View Asset ↗</a>
                    </div>
                  );
                }
                return (
                  <div key={key} style={style.payloadItem}>
                    <strong>{displayKey}:</strong> {val}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status Update & Reviewer form */}
          <div style={style.modalSection}>
            <h4 style={style.sectionTitle}>Status Management & Actions</h4>
            <div style={style.actionsGrid}>
              <div style={style.inputWrapper}>
                <label style={style.inputLabel}>Current Status</label>
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value)}
                  style={style.modalSelect}
                >
                  <option value="new">New</option>
                  <option value="under_review">Under Review</option>
                  <option value="need_more_information">Need Info</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="contacted">Contacted</option>
                </select>
              </div>

              <div style={style.inputWrapper}>
                <label style={style.inputLabel}>Assigned Reviewer</label>
                <input
                  type="text"
                  placeholder="Enter reviewer email"
                  value={editReviewer}
                  onChange={e => setEditReviewer(e.target.value)}
                  style={style.modalInput}
                />
              </div>

              <div style={{ ...style.inputWrapper, gridColumn: 'span 2' }}>
                <label style={style.inputLabel}>Status Change Context (Internal Notes/Instructions)</label>
                <textarea
                  placeholder="Why are you transitioning this status? Add context here. (Optional)"
                  value={editInternalNotes}
                  onChange={e => setEditInternalNotes(e.target.value)}
                  style={style.modalTextarea}
                  rows={3}
                />
                <span style={{ fontSize: 11, color: '#64748B', marginTop: 4, display: 'block' }}>
                  💡 If transitioning status to 'Need Info', these notes will be emailed to the submitter as instructions.
                </span>
              </div>
            </div>

            <button
              onClick={handleSaveEdits}
              disabled={updatingSub}
              style={style.saveBtn}
            >
              {updatingSub ? 'Saving Updates...' : 'Apply Status Update & Send Notification Email'}
            </button>
          </div>

          {/* Notes Timeline */}
          <div style={style.modalSection}>
            <h4 style={style.sectionTitle}>Internal Notes log</h4>
            
            {/* Notes Input */}
            <form onSubmit={handleAddNote} style={style.noteInputForm}>
              <input
                type="text"
                placeholder="Type an internal note regarding this candidate..."
                value={newNoteText}
                onChange={e => setNewNoteText(e.target.value)}
                style={style.noteInput}
              />
              <button type="submit" style={style.noteSubmitBtn}>
                <Send size={14} /> Add Note
              </button>
            </form>

            {/* Notes List */}
            <div style={style.notesList}>
              {selectedNotes.length === 0 ? (
                <span style={{ color: '#475569', fontSize: 13 }}>No internal notes saved yet.</span>
              ) : (
                selectedNotes.map(n => (
                  <div key={n.id} style={style.noteRow}>
                    <div style={style.noteMeta}>
                      <span style={style.noteAuthor}>{n.created_by}</span>
                      <span style={style.noteDate}>{new Date(n.created_at).toLocaleString()}</span>
                    </div>
                    <p style={style.noteText}>{n.note}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Audit History Timeline */}
          <div style={style.modalSection}>
            <h4 style={style.sectionTitle}>Audit Status History Timeline</h4>
            <div style={style.timeline}>
              {selectedHistory.length === 0 ? (
                <span style={{ color: '#475569', fontSize: 13 }}>No status changes recorded.</span>
              ) : (
                selectedHistory.map(h => (
                  <div key={h.id} style={style.timelineItem}>
                    <div style={style.timelineMarker}></div>
                    <div style={style.timelineContent}>
                      <div style={style.timelineMeta}>
                        <strong>{h.previous_status?.toUpperCase() || 'NEW'}</strong> &rarr; <strong>{h.current_status.toUpperCase()}</strong>
                        <span style={style.timelineDate}>by {h.changed_by} on {new Date(h.changed_at).toLocaleString()}</span>
                      </div>
                      {h.internal_notes && (
                        <p style={style.timelineNotes}>{h.internal_notes}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
