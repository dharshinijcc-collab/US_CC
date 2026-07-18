import React from 'react';

export const style: Record<string, React.CSSProperties> = {
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
