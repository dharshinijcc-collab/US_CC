'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, Clock, Inbox, CheckCircle2, ChevronLeft, ChevronRight, Loader2
} from 'lucide-react';
import { API_URL } from '@/services/api';

// ─── Sub-components, types & styles ──────────────────────────────────────────
import { style } from './submissions/styles';
import type { Submission, Note, HistoryItem } from './submissions/types';
import SubmissionDetailModal from './submissions/SubmissionDetailModal';

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

  // Auth-aware fetch — attaches admin-token automatically
  const authFetch = (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('admin-token') || localStorage.getItem('Dtoken') || '';
    let targetUrl = url;
    if (url.startsWith('/api/')) {
      const apiBase = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
      targetUrl = apiBase + url.slice(4);
    }
    return fetch(targetUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  };

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
      const res = await authFetch(`/api/submissions?${qParams.toString()}`);
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
      const res = await authFetch(`/api/submissions/details?id=${sub.id}`);
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
      const res = await authFetch('/api/submissions/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submission_id: selectedSub.id, note: newNoteText })
      });
      const json = await res.json();
      if (json.status === 'success') {
        setNewNoteText('');
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
      const res = await authFetch('/api/submissions/update', {
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
        <SubmissionDetailModal
          selectedSub={selectedSub}
          selectedNotes={selectedNotes}
          selectedHistory={selectedHistory}
          newNoteText={newNoteText}
          setNewNoteText={setNewNoteText}
          editStatus={editStatus}
          setEditStatus={setEditStatus}
          editReviewer={editReviewer}
          setEditReviewer={setEditReviewer}
          editInternalNotes={editInternalNotes}
          setEditInternalNotes={setEditInternalNotes}
          updatingSub={updatingSub}
          handleSaveEdits={handleSaveEdits}
          handleAddNote={handleAddNote}
          onClose={() => setSelectedSub(null)}
        />
      )}
    </div>
  );
}
