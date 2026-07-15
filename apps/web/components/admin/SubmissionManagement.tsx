import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Clock, Users, MessageSquare, Briefcase, Inbox, X, Send, 
  CheckCircle2, XCircle, AlertTriangle, ChevronLeft, ChevronRight, Loader2
} from 'lucide-react';

interface Submission {
  id: string;
  form_type: string;
  status: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  payload: any;
  assigned_reviewer: string | null;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
}

interface Note {
  id: string;
  note: string;
  created_by: string;
  created_at: string;
}

interface HistoryItem {
  id: string;
  previous_status: string | null;
  current_status: string;
  changed_by: string;
  changed_at: string;
  internal_notes: string | null;
}

export default function SubmissionManagement() {
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'idea' | 'talent' | 'contact' | 'investor'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [stats, setStats] = useState<any>({
    total: 0, new: 0, under_review: 0, need_info: 0, approved: 0, rejected: 0, contacted: 0
  });
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [selectedNotes, setSelectedNotes] = useState<Note[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<HistoryItem[]>([]);
  const [newNoteText, setNewNoteText] = useState<string>('');
  
  const [updatingSub, setUpdatingSub] = useState<boolean>(false);
  const [editStatus, setEditStatus] = useState<string>('');
  const [editReviewer, setEditReviewer] = useState<string>('');
  const [editInternalNotes, setEditInternalNotes] = useState<string>('');
  
  const limit = 10;

  // Fetch Submissions on tab, filter, query or page change
  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const qParams = new URLSearchParams({
        formType: activeSubTab,
        status: statusFilter,
        query: searchQuery,
        page: currentPage.toString(),
        limit: limit.toString()
      });
      const res = await fetch(`/api/submissions?${qParams.toString()}`);
      const json = await res.json();
      if (json.status === 'success') {
        setSubmissions(json.payload.submissions);
        setTotalCount(json.payload.count);
        setStats(json.payload.stats);
      }
    } catch (err) {
      console.error('Failed to load submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [activeSubTab, statusFilter, currentPage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchSubmissions();
  };

  // Fetch Full Submission details (notes & history timeline)
  const viewDetails = async (sub: Submission) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/submissions/details?id=${sub.id}`);
      const json = await res.json();
      if (json.status === 'success') {
        setSelectedSub(json.payload.submission);
        setSelectedNotes(json.payload.notes);
        setSelectedHistory(json.payload.history);
        
        // Populate inputs
        setEditStatus(json.payload.submission.status);
        setEditReviewer(json.payload.submission.assigned_reviewer || '');
        setEditInternalNotes('');
      }
    } catch (err) {
      console.error('Failed to fetch details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedSub) return;
    try {
      const res = await fetch('/api/submissions/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submission_id: selectedSub.id, note: newNoteText })
      });
      const json = await res.json();
      if (json.status === 'success') {
        setNewNoteText('');
        // Reload details
        viewDetails(selectedSub);
      }
    } catch (err) {
      console.error('Failed to add note:', err);
    }
  };

  // Save edits (Status / Reviewer)
  const handleSaveEdits = async () => {
    if (!selectedSub) return;
    setUpdatingSub(true);
    try {
      const res = await fetch('/api/submissions/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedSub.id,
          status: editStatus,
          assigned_reviewer: editReviewer,
          internal_notes: editInternalNotes
        })
      });
      const json = await res.json();
      if (json.status === 'success') {
        setEditInternalNotes('');
        // Reload details & main list
        await viewDetails(selectedSub);
        await fetchSubmissions();
      }
    } catch (err) {
      console.error('Failed to save edits:', err);
    } finally {
      setUpdatingSub(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'new': return { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6', label: 'New' };
      case 'under_review': return { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', label: 'Under Review' };
      case 'need_more_information': return { bg: 'rgba(124,58,237,0.1)', color: '#A78BFA', label: 'Need Info' };
      case 'approved': return { bg: 'rgba(16,185,129,0.1)', color: '#10B981', label: 'Approved' };
      case 'rejected': return { bg: 'rgba(239,68,68,0.1)', color: '#EF4444', label: 'Rejected' };
      case 'contacted': return { bg: 'rgba(6,182,212,0.1)', color: '#06B6D4', label: 'Contacted' };
      default: return { bg: 'rgba(255,255,255,0.05)', color: '#94A3B8', label: status };
    }
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div style={style.container}>
      {/* ── Statistics Summary Cards ── */}
      <div style={style.statsGrid}>
        <div style={style.statCard}>
          <div style={style.statRow}>
            <Inbox size={22} color="#3B82F6" />
            <span style={style.statValue}>{stats.total}</span>
          </div>
          <span style={style.statLabel}>Total Inquiries</span>
        </div>
        <div style={{ ...style.statCard, borderLeft: '4px solid #3B82F6' }}>
          <div style={style.statRow}>
            <Clock size={20} color="#3B82F6" />
            <span style={style.statValue}>{stats.new}</span>
          </div>
          <span style={style.statLabel}>New Submissions</span>
        </div>
        <div style={{ ...style.statCard, borderLeft: '4px solid #F59E0B' }}>
          <div style={style.statRow}>
            <Clock size={20} color="#F59E0B" />
            <span style={style.statValue}>{stats.under_review}</span>
          </div>
          <span style={style.statLabel}>Under Review</span>
        </div>
        <div style={{ ...style.statCard, borderLeft: '4px solid #10B981' }}>
          <div style={style.statRow}>
            <CheckCircle2 size={20} color="#10B981" />
            <span style={style.statValue}>{stats.approved}</span>
          </div>
          <span style={style.statLabel}>Approved</span>
        </div>
      </div>

      {/* ── Sub-Tabs & Filters ── */}
      <div style={style.filterBar}>
        <div style={style.tabsWrapper}>
          {(['all', 'idea', 'talent', 'contact', 'investor'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveSubTab(tab); setCurrentPage(1); }}
              style={{
                ...style.tabBtn,
                color: activeSubTab === tab ? '#FFF' : '#64748B',
                borderBottom: activeSubTab === tab ? '2px solid #2563EB' : '2px solid transparent'
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}s
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} style={style.searchForm}>
          <Search size={16} color="#64748B" style={style.searchIcon} />
          <input
            type="text"
            placeholder="Search by name, email, company..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={style.searchInput}
          />
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            style={style.selectFilter}
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="under_review">Under Review</option>
            <option value="need_more_information">Need Info</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="contacted">Contacted</option>
          </select>
          <button type="submit" style={style.filterBtn}>Find</button>
        </form>
      </div>

      {/* ── Submission Listing Table ── */}
      <div style={style.tableCard}>
        {loading ? (
          <div style={style.loadingState}>
            <Loader2 className="animate-spin" size={32} color="#3B82F6" />
            <span style={{ marginTop: 12, color: '#64748B' }}>Loading submissions...</span>
          </div>
        ) : submissions.length === 0 ? (
          <div style={style.emptyState}>
            <span>No submissions found matching criteria.</span>
          </div>
        ) : (
          <>
            <table style={style.table}>
              <thead>
                <tr style={style.trHeader}>
                  <th style={style.th}>Sender</th>
                  <th style={style.th}>Form Type</th>
                  <th style={style.th}>Company / Info</th>
                  <th style={style.th}>Date</th>
                  <th style={style.th}>Status</th>
                  <th style={style.th}>Reviewer</th>
                  <th style={{ ...style.th, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map(sub => {
                  const statusStyle = getStatusStyle(sub.status);
                  return (
                    <tr key={sub.id} style={style.trRow}>
                      <td style={style.td}>
                        <div style={style.primaryText}>{sub.name}</div>
                        <div style={style.secondaryText}>{sub.email}</div>
                      </td>
                      <td style={style.td}>
                        <span style={{
                          ...style.badge,
                          background: sub.form_type === 'idea' ? 'rgba(59,130,246,0.1)' : sub.form_type === 'talent' ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)',
                          color: sub.form_type === 'idea' ? '#3B82F6' : sub.form_type === 'talent' ? '#10B981' : '#94A3B8'
                        }}>
                          {sub.form_type.toUpperCase()}
                        </span>
                      </td>
                      <td style={style.td}>
                        {sub.company ? (
                          <div style={style.primaryText}>{sub.company}</div>
                        ) : sub.payload.interest_area ? (
                          <div style={style.primaryText}>Interest: {sub.payload.interest_area}</div>
                        ) : (
                          <span style={{ color: '#475569', fontSize: 13 }}>—</span>
                        )}
                      </td>
                      <td style={style.td}>
                        <span style={style.dateText}>{new Date(sub.created_at).toLocaleDateString()}</span>
                      </td>
                      <td style={style.td}>
                        <span style={{ ...style.statusBadge, background: statusStyle.bg, color: statusStyle.color }}>
                          {statusStyle.label}
                        </span>
                      </td>
                      <td style={style.td}>
                        <span style={style.reviewerText}>{sub.assigned_reviewer || 'Unassigned'}</span>
                      </td>
                      <td style={{ ...style.td, textAlign: 'right' }}>
                        <button onClick={() => viewDetails(sub)} style={style.actionBtn}>
                          Review Workflow
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={style.pagination}>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  style={style.pageBtn}
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                <span style={style.pageIndicator}>Page {currentPage} of {totalPages}</span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  style={style.pageBtn}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Review Details Modal ── */}
      {selectedSub && (
        <div style={style.modalOverlay}>
          <div style={style.modalContent}>
            <div style={style.modalHeader}>
              <div>
                <h3 style={style.modalTitle}>Reviewing Submission ({selectedSub.form_type.toUpperCase()})</h3>
                <p style={style.modalSubtitle}>ID: {selectedSub.id}</p>
              </div>
              <button onClick={() => setSelectedSub(null)} style={style.closeBtn}>
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
                            <strong>{h.previous_status?.toUpperCase() || 'NEW'}</strong> $\rightarrow$ <strong>{h.current_status.toUpperCase()}</strong>
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
      )}
    </div>
  );
}

const style: Record<string, React.CSSProperties> = {
  container: {
    padding: '0 24px 24px 24px',
    background: '#090D16',
    minHeight: '100vh',
    color: '#FFF',
    fontFamily: 'system-ui, sans-serif'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 16,
    marginBottom: 28
  },
  statCard: {
    background: '#121B2E',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  statValue: {
    fontSize: 24,
    fontWeight: 800,
    color: '#FFF'
  },
  statLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  filterBar: {
    background: '#121B2E',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16
  },
  tabsWrapper: {
    display: 'flex',
    gap: 16
  },
  tabBtn: {
    background: 'none',
    border: 'none',
    padding: '8px 12px',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s',
    outline: 'none'
  },
  searchForm: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap'
  },
  searchIcon: {
    marginRight: -28,
    zIndex: 10
  },
  searchInput: {
    background: '#090D16',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10,
    padding: '10px 12px 10px 36px',
    color: '#FFF',
    fontSize: 13,
    outline: 'none',
    width: 260
  },
  selectFilter: {
    background: '#090D16',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10,
    padding: '10px 12px',
    color: '#FFF',
    fontSize: 13,
    outline: 'none',
    cursor: 'pointer'
  },
  filterBtn: {
    background: '#2563EB',
    color: '#FFF',
    border: 'none',
    borderRadius: 10,
    padding: '10px 20px',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  tableCard: {
    background: '#121B2E',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: 16,
    overflow: 'hidden'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  trHeader: {
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.02)'
  },
  th: {
    padding: '16px 24px',
    fontSize: 11,
    fontWeight: 800,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.08em'
  },
  trRow: {
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    transition: 'background 0.2s'
  },
  td: {
    padding: '16px 24px',
    verticalAlign: 'middle'
  },
  primaryText: {
    fontSize: 14,
    fontWeight: 700,
    color: '#F1F5F9'
  },
  secondaryText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2
  },
  badge: {
    padding: '4px 8px',
    borderRadius: 6,
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: '0.05em'
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 800,
    display: 'inline-block'
  },
  reviewerText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: 500
  },
  dateText: {
    fontSize: 13,
    color: '#64748B'
  },
  actionBtn: {
    background: 'none',
    border: '1px solid rgba(59,130,246,0.3)',
    borderRadius: 8,
    color: '#60A5FA',
    fontSize: 12,
    fontWeight: 700,
    padding: '6px 14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    outline: 'none'
  },
  pagination: {
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid rgba(255,255,255,0.06)'
  },
  pageBtn: {
    background: '#090D16',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8,
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: 600,
    padding: '8px 16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6
  },
  pageIndicator: {
    fontSize: 13,
    color: '#64748B'
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60
  },
  emptyState: {
    padding: 60,
    textAlign: 'center',
    color: '#64748B',
    fontSize: 14
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)'
  },
  modalContent: {
    background: '#121B2E',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 24,
    width: '90%',
    maxWidth: 800,
    maxHeight: '85vh',
    overflowY: 'auto',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column'
  },
  modalHeader: {
    padding: '24px 32px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    background: '#121B2E',
    zIndex: 10
  },
  modalTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 800,
    color: '#FFF'
  },
  modalSubtitle: {
    margin: '4px 0 0 0',
    fontSize: 11,
    color: '#64748B',
    fontFamily: 'monospace'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#64748B',
    cursor: 'pointer',
    padding: 4,
    borderRadius: 8
  },
  modalBody: {
    padding: '0 32px 32px 32px'
  },
  modalSection: {
    marginTop: 28,
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    paddingBottom: 24
  },
  sectionTitle: {
    margin: '0 0 16px 0',
    fontSize: 13,
    fontWeight: 800,
    color: '#60A5FA',
    textTransform: 'uppercase',
    letterSpacing: '0.06em'
  },
  payloadGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
    background: '#090D16',
    padding: 20,
    borderRadius: 16,
    border: '1px solid rgba(255,255,255,0.04)'
  },
  payloadItem: {
    fontSize: 14,
    color: '#CBD5E1',
    lineHeight: 1.5
  },
  preformatted: {
    background: '#121B2E',
    padding: 12,
    borderRadius: 8,
    fontSize: 12,
    overflowX: 'auto',
    marginTop: 8,
    border: '1px solid rgba(255,255,255,0.04)',
    color: '#38BDF8'
  },
  linkText: {
    color: '#3B82F6',
    textDecoration: 'none',
    fontWeight: 600
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: 800,
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  modalSelect: {
    background: '#090D16',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10,
    padding: 12,
    color: '#FFF',
    fontSize: 13,
    outline: 'none',
    cursor: 'pointer'
  },
  modalInput: {
    background: '#090D16',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10,
    padding: 12,
    color: '#FFF',
    fontSize: 13,
    outline: 'none'
  },
  modalTextarea: {
    background: '#090D16',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 12,
    color: '#FFF',
    fontSize: 13,
    outline: 'none',
    resize: 'vertical'
  },
  saveBtn: {
    background: '#10B981',
    color: '#FFF',
    border: 'none',
    borderRadius: 12,
    padding: '14px 20px',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 20,
    width: '100%',
    transition: 'background 0.2s'
  },
  noteInputForm: {
    display: 'flex',
    gap: 12,
    marginBottom: 16
  },
  noteInput: {
    flex: 1,
    background: '#090D16',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10,
    padding: 12,
    color: '#FFF',
    fontSize: 13,
    outline: 'none'
  },
  noteSubmitBtn: {
    background: '#2563EB',
    color: '#FFF',
    border: 'none',
    borderRadius: 10,
    padding: '12px 20px',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  notesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },
  noteRow: {
    background: '#090D16',
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: 12,
    padding: 16
  },
  noteMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 11,
    marginBottom: 6
  },
  noteAuthor: {
    fontWeight: 700,
    color: '#3B82F6'
  },
  noteDate: {
    color: '#64748B'
  },
  noteText: {
    margin: 0,
    fontSize: 13,
    color: '#E2E8F0',
    lineHeight: 1.5
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    position: 'relative',
    paddingLeft: 20
  },
  timelineItem: {
    position: 'relative'
  },
  timelineMarker: {
    position: 'absolute',
    left: -20,
    top: 4,
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#3B82F6',
    border: '2px solid #121B2E',
    zIndex: 2
  },
  timelineContent: {
    background: 'rgba(255,255,255,0.02)',
    borderRadius: 10,
    padding: 12,
    border: '1px solid rgba(255,255,255,0.04)'
  },
  timelineMeta: {
    fontSize: 12,
    color: '#CBD5E1'
  },
  timelineDate: {
    color: '#64748B',
    marginLeft: 8,
    fontSize: 11
  },
  timelineNotes: {
    margin: '6px 0 0 0',
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 1.4
  }
};
